// composables/useTouchMenu.ts
export const useTouchMenu = () => {
  const isHolding = ref(false);
  const anchorX = ref(0);
  const anchorY = ref(0);
  const currentX = ref(0);
  const currentY = ref(0);
  const activeActionId = ref<string | null>(null);
  let holdTimer: any = null;

  const RADIUS = 110;
  const ACTION_IDS = ["save", "preset", "cloud"];

  const onTouchStart = (e: TouchEvent, onConfirm: () => void) => {
    const touch = e.touches[0];
    anchorX.value = currentX.value = touch.clientX;
    anchorY.value = currentY.value = touch.clientY;

    holdTimer = setTimeout(() => {
      isHolding.value = true;
      if (window.navigator.vibrate) window.navigator.vibrate(15);
      onConfirm();
    }, 400);
  };

  const onTouchMove = (e: TouchEvent, startAngle: number) => {
    if (!isHolding.value) {
      clearTimeout(holdTimer);
      return;
    }
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    currentX.value = touch.clientX;
    currentY.value = touch.clientY;

    // HIT-TESTING (Dò va chạm tức thì)
    let foundId: string | null = null;
    ACTION_IDS.forEach((id, index) => {
      const angle = index * 60 + startAngle;
      const rad = (angle * Math.PI) / 180;
      const btnX = anchorX.value + Math.cos(rad) * RADIUS;
      const btnY = anchorY.value + Math.sin(rad) * RADIUS;

      const dist = Math.hypot(currentX.value - btnX, currentY.value - btnY);
      if (dist < 50) foundId = id;
    });

    if (activeActionId.value !== foundId) {
      activeActionId.value = foundId;
      if (foundId && window.navigator.vibrate) window.navigator.vibrate(8);
    }
  };

  const onTouchEnd = () => {
    clearTimeout(holdTimer);
    const selected = activeActionId.value;
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
