// consts/presets.ts
import type { PromptPreset } from "~/types";

export const PRESET_CATEGORIES = [
  { label: "Tất cả", value: "All" },
  { label: "Nghệ thuật", value: "Fine Art" },
  { label: "Chân dung", value: "Portrait" },
  { label: "Điện ảnh", value: "Cinematic" },
  { label: "Studio", value: "Studio" },
];

export const PRESET_SAMPLES: PromptPreset[] = [
  {
    id: "wet-stone-editorial",
    title: "Rustic Wet Stone Editorial",
    category: "Fine Art",
    thumbnail:
      "https://as1.ftcdn.net/v2/jpg/01/18/69/58/1000_F_118695855_ZClrAZhGRCw7WSyGgQ3xvyQtgVF6mhMB.jpg",
    data: {
      subject: {
        gender: {
          value: "Young East Asian woman",
          label_vi: "Phụ nữ Đông Á trẻ",
        },
        age: { value: "22", label_vi: "22 tuổi" },
        ethnicity: {
          value: "Japanese-Korean heritage",
          label_vi: "Nét đẹp Nhật-Hàn",
        },
        bodyType: {
          value: "Slender, athletic silhouette",
          label_vi: "Mảnh mai, dáng thể thao",
        },
        skinTone: { value: "Pale porcelain skin", label_vi: "Làn da trắng sứ" },
        skinDetails: {
          value: "Wet skin texture, droplets, pores",
          label_vi: "Da bóng nước, giọt nước đọng, rõ lỗ chân lông",
        },
        breast: {
          value: "Natural rounded breasts",
          label_vi: "Vòng một tròn tự nhiên",
        },
        genitals: {
          value: "Detailed labia texture",
          label_vi: "Chi tiết vùng kín",
        },
        pubicHair: {
          value: "Groomed pubic hair",
          label_vi: "Vùng tam giác gọn gàng",
        },
      },
      face: {
        structure: { value: "Defined cheekbones", label_vi: "Gò má rõ nét" },
        eyes: {
          value: "Intense gaze, dark irises",
          label_vi: "Ánh nhìn cuốn hút, tròng mắt tối",
        },
        eyebrows: {
          value: "Natural arched brows",
          label_vi: "Lông mày cong tự nhiên",
        },
        nose: { value: "Straight bridge", label_vi: "Sống mũi thẳng" },
        lips: {
          value: "Slightly parted, moist lips",
          label_vi: "Môi hé mở, căng mọng",
        },
        skinTexture: { value: "Smooth surface", label_vi: "Bề mặt da mịn" },
        expression: { value: "Sultry look", label_vi: "Biểu cảm quyến rũ" },
        makeup: {
          value: "No makeup, natural finish",
          label_vi: "Không trang điểm, vẻ đẹp tự nhiên",
        },
      },
      hair: {
        description: {
          value: "Long drenched hair",
          label_vi: "Tóc dài ướt đẫm",
        },
        color: { value: "Raven black", label_vi: "Đen tuyền" },
        length: { value: "Waist length", label_vi: "Dài ngang eo" },
        texture: {
          value: "Clumping wet strands",
          label_vi: "Các lọn tóc bết ướt",
        },
      },
      outfit: {
        description: {
          value: "Holding thin underwear fabric",
          label_vi: "Cầm vải đồ lót mỏng",
        },
        materials: { value: "Translucent silk", label_vi: "Lụa xuyên thấu" },
        layering: { value: "Single layer", label_vi: "Một lớp vải" },
        fit: { value: "Clinging to body", label_vi: "Dính sát cơ thể" },
        details: { value: "Minimal stitching", label_vi: "Đường chỉ tối giản" },
        accessories: { value: "No accessories", label_vi: "Không phụ kiện" },
        fabricInteraction: {
          value: "Wet fabric clinging to skin",
          label_vi: "Vải ướt dính sát vào da",
        },
      },
      pose: {
        action: {
          value: "Standing under shower",
          label_vi: "Đứng dưới vòi sen",
        },
        interaction: {
          value: "One hand pulling fabric",
          label_vi: "Một tay kéo vải",
        },
        posture: {
          value: "Weight on one leg",
          label_vi: "Trọng tâm dồn một chân",
        },
        headAngle: { value: "Three-quarter view", label_vi: "Góc mặt 3/4" },
        hands: {
          value: "Holding fabric near hip",
          label_vi: "Cầm vải gần hông",
        },
        framing: {
          value: "Medium full shot",
          label_vi: "Góc máy trung toàn thân",
        },
        perspective: { value: "Eye level", label_vi: "Góc nhìn ngang mắt" },
        aspectRatio: { value: "2:3", label_vi: "Tỷ lệ 2:3" },
      },
      environment: {
        location: {
          value: "Rustic stone shower",
          label_vi: "Phòng tắm đá mộc mạc",
        },
        lighting: {
          value: "Soft diffused natural light",
          label_vi: "Ánh sáng tự nhiên khuếch tán",
        },
        lightColor: {
          value: "5500K daylight",
          label_vi: "Ánh sáng ban ngày 5500K",
        },
        shadows: {
          value: "Soft anatomical shadows",
          label_vi: "Bóng đổ khối cơ thể mềm",
        },
        atmosphere: {
          value: "Humid, misty air",
          label_vi: "Không khí ẩm, sương mờ",
        },
        colorPalette: {
          value: "Desaturated earth tones",
          label_vi: "Tông màu đất trầm",
        },
      },
      tech: {
        camera: { value: "Sony A7R V", label_vi: "Máy ảnh Sony A7R V" },
        lensSettings: { value: "85mm f/1.8", label_vi: "Ống kính 85mm f/1.8" },
        filmEffect: { value: "Fine organic grain", label_vi: "Hạt phim mịn" },
        artStyle: {
          value: "Photorealistic fine art",
          label_vi: "Nghệ thuật siêu thực",
        },
        postProcessing: {
          value: "Cinematic grading",
          label_vi: "Chỉnh màu điện ảnh",
        },
        viewpoint: { value: "Direct front", label_vi: "Góc nhìn trực diện" },
      },
    },
  },
];
