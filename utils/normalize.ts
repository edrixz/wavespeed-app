// Hàm chuẩn hóa riêng cho Giới tính (An toàn hơn)
// Vì Gemini có thể trả về "Woman", "Girl" thay vì "Female"
export const normalizeGender = (val: string | undefined) => {
  if (!val) return "Female"; // Mặc định

  const lower = val.toLowerCase();

  // Map các từ đồng nghĩa về chuẩn "Female" / "Male"
  if (["female", "woman", "girl", "lady"].some((w) => lower.includes(w))) {
    return "Female";
  }
  if (["male", "man", "boy", "gentleman"].some((w) => lower.includes(w))) {
    return "Male";
  }

  // Nếu không khớp logic trên thì format Title Case bình thường
  return formatTitleCase(val);
};
