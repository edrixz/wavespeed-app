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

export const PRESET_SAMPLES_2: PromptPreset[] = [
  {
    id: "wet-stone-editorial",
    title: "Rustic Wet Stone Editorial",
    category: "Fine Art",
    thumbnail:
      "https://as1.ftcdn.net/v2/jpg/01/18/69/58/1000_F_118695855_ZClrAZhGRCw7WSyGgQ3xvyQtgVF6mhMB.jpg",
    data: {
      subject: {
        gender: { value: "female", label_vi: "Nữ" },
        age: {
          value: "young adult, mid-20s",
          label_vi: "Người lớn trẻ tuổi, khoảng 25 tuổi",
        },
        ethnicity: { value: "Caucasian", label_vi: "Người Da trắng" },
        bodyType: {
          value: "slim, athletic, toned abdominal muscles",
          label_vi: "Mảnh khảnh, cân đối, cơ bụng săn chắc",
        },
        skinTone: {
          value: "fair skin, warm undertone",
          label_vi: "Da trắng, tông ấm",
        },
        skinDetails: {
          value: "soft smooth texture, navel piercing with silver jewelry",
          label_vi: "Bề mặt da mịn màng, có khuyên rốn trang sức bạc",
        },
        breast: {
          value: "natural medium breasts, firm",
          label_vi: "Ngực tự nhiên cỡ vừa, săn chắc",
        },
        nipple: {
          value: "small light pink nipples",
          label_vi: "Núm vú nhỏ, màu hồng nhạt",
        },
        pubicHair: {
          value: "natural landing strip, dark brown hair",
          label_vi: "Lông vùng kín tự nhiên dạng landing strip, màu nâu sẫm",
        },
      },
      face: {
        structure: {
          value: "oval face, defined jawline, elegant neck",
          label_vi: "Mặt trái xoan, đường hàm rõ nét, cổ thanh tú",
        },
        eyes: {
          value: "sensual dark eyes, heavy eyelashes, soft gaze",
          label_vi: "Mắt tối gợi cảm, lông mi dày, ánh nhìn mềm mại",
        },
        eyebrows: {
          value: "natural arched eyebrows, medium thickness",
          label_vi: "Lông mày cong tự nhiên, độ dày vừa phải",
        },
        nose: { value: "straight slim nose", label_vi: "Mũi thẳng và thon" },
        lips: {
          value: "full soft lips, slightly parted",
          label_vi: "Môi đầy đặn, hơi hé mở",
        },
        skinTexture: {
          value: "matte, natural skin glow",
          label_vi: "Mịn màng, có độ bóng tự nhiên của da",
        },
        expression: {
          value: "alluring, calm, mysterious",
          label_vi: "Quyến rũ, điềm tĩnh, bí ẩn",
        },
        makeup: {
          value: "minimalist nude makeup",
          label_vi: "Trang điểm tối giản phong cách nude",
        },
      },
      hair: {
        description: {
          value: "messy undone hair, tousled aesthetic",
          label_vi: "Tóc đánh rối tự nhiên, thẩm mỹ phóng khoáng",
        },
        color: {
          value: "chestnut brown with subtle highlights",
          label_vi: "Nâu hạt dẻ với các lọn highlight nhẹ",
        },
        length: {
          value: "medium shoulder-length hair",
          label_vi: "Tóc dài ngang vai",
        },
        texture: {
          value: "voluminous, slightly dry/textured",
          label_vi: "Bồng bềnh, có độ nhám tự nhiên",
        },
      },
      outfit: {
        description: {
          value: "nude, unclothed, artistic boudoir style",
          label_vi: "Khỏa thân, phong cách boudoir nghệ thuật",
        },
        accessories: {
          value: "silver navel ring with crystal drop",
          label_vi: "Khuyên rốn bạc với mặt pha lê dài",
        },
      },
      pose: {
        action: {
          value: "kneeling on bed, hands raised behind head",
          label_vi: "Quỳ trên giường, hai tay đưa ra sau đầu",
        },
        posture: {
          value: "arched back, leaning forward, showing silhouette",
          label_vi: "Ưỡn lưng, hơi ngả về phía trước, lộ đường cong cơ thể",
        },
        headAngle: {
          value: "slight tilt, looking directly at camera",
          label_vi: "Đầu hơi nghiêng, nhìn trực diện ống kính",
        },
        hands: {
          value: "fingers intertwined with hair",
          label_vi: "Các ngón tay luồn trong tóc",
        },
        framing: {
          value: "cowboy shot, medium close-up",
          label_vi: "Khung hình từ đùi trở lên, cận trung",
        },
        perspective: {
          value: "low angle, eye level hybrid",
          label_vi: "Góc máy thấp, ngang tầm mắt",
        },
        aspectRatio: { value: "4:5", label_vi: "Tỷ lệ khung hình 4:5" },
      },
      environment: {
        location: {
          value: "luxurious bedroom, ornate vintage headboard",
          label_vi: "Phòng ngủ sang trọng, đầu giường hoa văn cổ điển",
        },
        lighting: {
          value: "warm side light, blue rim lighting on the side",
          label_vi: "Ánh sáng cạnh ấm áp, ánh sáng xanh dọc viền cơ thể",
        },
        lightColor: {
          value: "warm 3000K mixed with cool blue 7000K",
          label_vi: "Ánh sáng ấm 3000K kết hợp xanh lạnh 7000K",
        },
        shadows: {
          value: "soft cinematic shadows, volumetric lighting",
          label_vi: "Bóng đổ điện ảnh mềm mại, ánh sáng khối",
        },
        atmosphere: {
          value: "intimate, moody, romantic",
          label_vi: "Thân mật, tâm trạng, lãng mạn",
        },
        colorPalette: {
          value: "gold, beige, blue, skin tones",
          label_vi: "Vàng kim, màu be, xanh dương, tông màu da",
        },
      },
      tech: {
        camera: {
          value: "Sony A7R IV, professional mirrorless",
          label_vi: "Sony A7R IV, máy ảnh chuyên nghiệp",
        },
        lensSettings: {
          value: "35mm f/1.4, shallow depth of field, bokeh",
          label_vi: "35mm f/1.4, xóa phông mạnh, hiệu ứng bokeh",
        },
        filmEffect: {
          value: "slight film grain, vintage look",
          label_vi: "Nhiễu hạt phim nhẹ, phong cách cổ điển",
        },
        artStyle: {
          value: "boudoir photography, fine art nude",
          label_vi: "Nhiếp ảnh boudoir, nghệ thuật khỏa thân",
        },
        postProcessing: {
          value: "cinematic color grading, softened highlights",
          label_vi: "Chỉnh màu điện ảnh, làm mềm vùng sáng",
        },
      },
    },
  },
];
