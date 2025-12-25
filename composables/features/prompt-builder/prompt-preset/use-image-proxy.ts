export const useImageProxy = () => {
  /**
   * Tối ưu hóa URL hình ảnh qua wsrv.nl
   * @param url URL ảnh gốc (từ Supabase hoặc các nguồn khác)
   * @param options Các tùy chọn như width, height, quality
   */
  const getOptimizedUrl = (
    url: string | null | undefined,
    options: { w?: number; h?: number; fit?: string; q?: number } = {}
  ) => {
    if (!url) return "/placeholder-preset.jpg"; // Ảnh mặc định nếu URL rỗng

    const { w = 400, h, fit = "cover", q = 80 } = options;

    // Base URL của dịch vụ proxy
    const proxyBase = "https://wsrv.nl/";

    // Xây dựng các tham số truy vấn
    const params = new URLSearchParams({
      url: url,
      w: w.toString(),
      fit: fit,
      output: "webp", // Cưỡng ép định dạng WebP cực nhẹ
      q: q.toString(),
    });

    if (h) params.append("h", h.toString());

    return `${proxyBase}?${params.toString()}`;
  };

  return { getOptimizedUrl };
};
