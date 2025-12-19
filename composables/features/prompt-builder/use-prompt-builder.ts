export const usePromptBuilder = () => {
  // Cập nhật giá trị: Hỗ trợ cả Subject lồng nhau và Scene
  const updateAttr = (
    target: any,
    key: string,
    value: string,
    mode: "single" | "multi" = "single"
  ) => {
    if (!target) return;

    if (mode === "single") {
      target[key] = target[key] === value ? "" : value;
    } else {
      let tags = target[key]
        ? target[key]
            .split(",")
            .map((s: any) => s.trim())
            .filter(Boolean)
        : [];
      const index = tags.indexOf(value);
      if (index !== -1) tags.splice(index, 1);
      else tags.push(value);
      target[key] = tags.join(", ");
    }
  };

  const isActive = (target: any, key: string, value: string) => {
    if (!target || !target[key]) return false;
    return target[key].includes(value);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  };

  return { updateAttr, isActive, scrollToSection };
};
