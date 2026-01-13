import { defineStore } from "pinia";

export const useLoggerStore = defineStore("logger", () => {
  const messages = ref<any[]>([]);
  const activeGroupId = ref<string | null>(null);
  const activeGroupName = ref<string | null>(null);

  // Bắt đầu một tiến trình mới (ví dụ: "Dreamer Process #123")
  const startGroup = (name: string) => {
    activeGroupId.value = `group-${Date.now()}`;
    activeGroupName.value = name;
    return activeGroupId.value;
  };

  const endGroup = () => {
    activeGroupId.value = null;
    activeGroupName.value = null;
  };

  const addMessage = (message: string, type: string) => {
    messages.value.push({
      id: `msg-${Date.now()}-${Math.random()}`,
      groupId: activeGroupId.value,
      groupName: activeGroupName.value,
      message,
      type,
      timestamp: Date.now(),
    });

    if (messages.value.length > 100) messages.value.shift();
  };

  // Logic phân nhóm log để hiển thị ở trang chi tiết
  const groupedMessages = computed(() => {
    const groups: Record<string, any> = {};
    const orphans: any[] = [];

    messages.value.forEach((msg) => {
      if (msg.groupId) {
        if (!groups[msg.groupId]) {
          groups[msg.groupId] = {
            id: msg.groupId,
            name: msg.groupName,
            timestamp: msg.timestamp,
            status: "processing", // Sẽ được cập nhật dựa trên item cuối
            items: [],
          };
        }
        groups[msg.groupId].items.push(msg);
        if (msg.type === "success" || msg.type === "error") {
          groups[msg.groupId].status = msg.type;
        }
      } else {
        orphans.push(msg);
      }
    });

    return {
      groups: Object.values(groups).reverse(),
      orphans: orphans.reverse(),
    };
  });

  const clearMessages = () => (messages.value = []);

  return {
    messages,
    activeGroupId,
    startGroup,
    endGroup,
    addMessage,
    groupedMessages,
    clearMessages,
    hasLogMessage: computed(() => messages.value.length > 0),
  };
});
