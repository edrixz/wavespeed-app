/**
 * Handle image proxy and caching for preset thumbnails
 */
export const useImageProxy = () => {
  const cachedImages = new Map<string, string>();
  const imageLoadingStatus = new Map<string, "loading" | "loaded" | "error">();

  /**
   * Get proxied image URL
   */
  const getProxiedUrl = (url: string): string => {
    if (!url) return "/placeholder-preset.jpg";

    // Return cached version if available
    if (cachedImages.has(url)) {
      return cachedImages.get(url) || "";
    }

    // Use image service for optimization if needed
    // Could add image optimization service here in future
    const proxiedUrl = url;

    cachedImages.set(url, proxiedUrl);
    return proxiedUrl;
  };

  /**
   * Get optimized image URL (alias for getProxiedUrl)
   */
  const getOptimizedUrl = (url: string): string => {
    return getProxiedUrl(url);
  };

  /**
   * Preload image and cache
   */
  const preloadImage = async (url: string): Promise<boolean> => {
    if (!url) return false;
    if (imageLoadingStatus.get(url) === "loaded") return true;

    imageLoadingStatus.set(url, "loading");

    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        imageLoadingStatus.set(url, "loaded");
        getProxiedUrl(url);
        resolve(true);
      };

      img.onerror = () => {
        imageLoadingStatus.set(url, "error");
        resolve(false);
      };

      img.src = url;
    });
  };

  /**
   * Preload multiple images in parallel
   */
  const preloadImages = async (urls: string[]): Promise<string[]> => {
    const results = await Promise.all(urls.map((url) => preloadImage(url)));
    return urls.filter((_, idx) => results[idx]);
  };

  /**
   * Clear cache
   */
  const clearCache = () => {
    cachedImages.clear();
    imageLoadingStatus.clear();
  };

  /**
   * Get loading status for image
   */
  const getImageStatus = (url: string) => {
    return imageLoadingStatus.get(url) || "idle";
  };

  /**
   * Remove specific image from cache
   */
  const removeFromCache = (url: string) => {
    cachedImages.delete(url);
    imageLoadingStatus.delete(url);
  };

  return {
    getProxiedUrl,
    getOptimizedUrl,
    preloadImage,
    preloadImages,
    clearCache,
    getImageStatus,
    removeFromCache,
  };
};
