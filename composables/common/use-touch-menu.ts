// composables/useTouchMenu.ts
export const useTouchMenu = () => {
  const isHolding = ref(false);
  const anchorX = ref(0);
  const anchorY = ref(0);
  const currentX = ref(0);
  const currentY = ref(0);
  const activeActionId = ref<string | null>(null);
  let holdTimer: any = null;

  // CẤU HÌNH QUAN TRỌNG
  const RADIUS = 80; // Bán kính vòng cung (nút gần nhau)
  const HIT_DIST = 60; // Khoảng cách bắt dính (ngón tay cách nút < 60px là dính)
  const ACTION_IDS = ["save", "preset", "cloud"];

  const onTouchStart = (e: TouchEvent, onConfirm: () => void) => {
    // Chỉ xử lý 1 ngón tay
    if (e.touches.length > 1) return;

    const touch = e.touches[0];
    anchorX.value = currentX.value = touch.clientX;
    anchorY.value = currentY.value = touch.clientY;

    holdTimer = setTimeout(() => {
      isHolding.value = true;
      if (window.navigator.vibrate) window.navigator.vibrate(15);
      onConfirm();
    }, 450);
  };

  const onTouchMove = (e: TouchEvent, startAngle: number) => {
    if (!isHolding.value) {
      // Nếu di chuyển trước khi giữ đủ lâu -> Hủy giữ
      clearTimeout(holdTimer);
      return;
    }
    // CHẶN SCROLL TRÌNH DUYỆT
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    currentX.value = touch.clientX;
    currentY.value = touch.clientY;

    // HIT-TESTING
    let foundId: string | null = null;
    ACTION_IDS.forEach((id, index) => {
      const angle = index * 60 + startAngle;
      const rad = (angle * Math.PI) / 180;

      // Vị trí tâm của nút (khi chưa active)
      const btnX = anchorX.value + Math.cos(rad) * RADIUS;
      const btnY = anchorY.value + Math.sin(rad) * RADIUS;

      // Tính khoảng cách
      const dist = Math.hypot(currentX.value - btnX, currentY.value - btnY);

      if (dist < HIT_DIST) foundId = id;
    });

    if (activeActionId.value !== foundId) {
      activeActionId.value = foundId;
      if (foundId && window.navigator.vibrate) window.navigator.vibrate(10);
    }
  };

  const onTouchEnd = () => {
    clearTimeout(holdTimer);
    const selected = activeActionId.value;

    // Reset state
    isHolding.value = false;
    activeActionId.value = null;

    return selected;
  };

  return {
    isHolding,
    anchorX,
    anchorY,
    currentX,
    currentY,
    activeActionId,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
