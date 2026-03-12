// app/utils/workers/sam.worker.ts
import {
  env,
  SamModel,
  AutoProcessor,
  RawImage,
  Tensor,
} from "@huggingface/transformers";

env.allowLocalModels = false;

let model: SamModel | null = null;
let processor: any = null;
let imageEmbeddings: any = null;
let imageInputs: any = null; // Lưu trữ metadata của ảnh (kích thước gốc, kích thước đã resize)

self.onmessage = async (e: MessageEvent) => {
  const { type, data } = e.data;
  try {
    if (type === "init") {
      model = (await SamModel.from_pretrained("Xenova/slimsam-77-uniform", {
        dtype: "q8",
      } as any)) as SamModel;
      processor = await AutoProcessor.from_pretrained(
        "Xenova/slimsam-77-uniform",
      );
      self.postMessage({ status: "ready" });
    } else if (type === "process_image") {
      const image = await RawImage.read(data.imageUrl);
      imageInputs = await processor(image); // Lưu metadata để dùng cho bước post-process
      imageEmbeddings = await model!.get_image_embeddings(imageInputs);
      self.postMessage({ status: "image_ready" });
    } else if (type === "decode") {
      if (!model || !imageEmbeddings || !imageInputs) return;

      const { points, labels } = data;
      const width = imageInputs.original_sizes[0][1]; // Lấy width thực tế
      const height = imageInputs.original_sizes[0][0]; // Lấy height thực tế

      // 1. Chuẩn hóa Points và Labels (Sử dụng int64 cho labels)
      const input_points = new Tensor("float32", points.flat(), [
        1,
        1,
        points.length,
        2,
      ]);
      const input_labels = new Tensor(
        "int64",
        BigInt64Array.from(labels.flat().map((l: number) => BigInt(l))),
        [1, 1, labels.length],
      );

      // 2. Chạy Decoder
      const outputs = await model({
        ...imageEmbeddings,
        input_points,
        input_labels,
      });

      // 3. QUAN TRỌNG: Resize mask về kích thước ảnh gốc
      const masks = await processor.post_process_masks(
        outputs.pred_masks,
        imageInputs.original_sizes,
        imageInputs.reshaped_input_sizes,
      );

      const maskData = masks[0].data; // Dữ liệu đã được resize chuẩn
      const maskImage = new ImageData(width, height);

      for (let i = 0; i < maskData.length; i++) {
        const val = maskData[i] > 0 ? 255 : 0;
        const idx = i * 4;
        maskImage.data[idx] = val; // R
        maskImage.data[idx + 1] = val; // G
        maskImage.data[idx + 2] = val; // B
        maskImage.data[idx + 3] = val; // Alpha
      }

      self.postMessage({ status: "mask_ready", maskImage });
    }
  } catch (error: any) {
    self.console.error("[Worker Error]", error);
    self.postMessage({ status: "error", error: error.message });
  }
};
