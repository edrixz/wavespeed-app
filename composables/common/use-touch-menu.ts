export const useTouchMenu = () => {
  const isHolding = ref(false);
  const anchorX = ref(0);
  const anchorY = ref(0);
  const currentX = ref(0);
  const currentY = ref(0);
  const activeActionId = ref<string | null>(null);
  let holdTimer: any = null;

  // Cấu hình vật lý
  const RADIUS = 80; // Bán kính vòng tròn menu
  const HIT_DIST = 60; // Khoảng cách bắt dính ngón tay

  const onTouchStart = (e: TouchEvent, onConfirm: () => void) => {
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

  // QUAN TRỌNG: Nhận thêm activeActionIds để biết đang có những nút nào
  const onTouchMove = (
    e: TouchEvent,
    startAngle: number,
    activeActionIds: string[]
  ) => {
    if (!isHolding.value) {
      clearTimeout(holdTimer);
      return;
    }
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    currentX.value = touch.clientX;
    currentY.value = touch.clientY;

    // HIT-TESTING
    let foundId: string | null = null;

    // Duyệt qua danh sách ID động được truyền vào
    activeActionIds.forEach((id, index) => {
      // Góc của nút thứ 'index'
      const angle = index * 60 + startAngle;
      const rad = (angle * Math.PI) / 180;

      // Tọa độ tâm của nút
      const btnX = anchorX.value + Math.cos(rad) * RADIUS;
      const btnY = anchorY.value + Math.sin(rad) * RADIUS;

      // Khoảng cách từ ngón tay đến nút
      const dist = Math.hypot(currentX.value - btnX, currentY.value - btnY);

      if (dist < HIT_DIST) foundId = id;
    });

    // Feedback Rung khi đổi nút chọn
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
    activeActionId, // ID của nút đang được chọn
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
