<script setup lang="ts">
import { useLoggerStore } from "~/stores/common/ui/logger-store";
import { storeToRefs } from "pinia";

definePageMeta({ layout: "default" });

const loggerStore = useLoggerStore();
const { groupedMessages, activeGroupId } = storeToRefs(loggerStore);

// State quản lý các nhóm đang được mở
const expandedGroups = ref<string[]>([]);

/**
 * LOGIC AUTO-EXPAND:
 * Theo dõi activeGroupId. Khi có một task mới bắt đầu (ID khác null),
 * chúng ta tự động push ID đó vào mảng expandedGroups để mở nó ra.
 */
watch(
  activeGroupId,
  (newId) => {
    if (newId && !expandedGroups.value.includes(newId)) {
      expandedGroups.value.push(newId);
    }
  },
  { immediate: true }
);

// Toggle đóng/mở group thủ công
const toggleGroup = (groupId: string) => {
  const index = expandedGroups.value.indexOf(groupId);
  if (index > -1) {
    expandedGroups.value.splice(index, 1);
  } else {
    expandedGroups.value.push(groupId);
  }
};

const getBadgeClass = (type: string) => {
  const styles: any = {
    error: "bg-red-500/10 text-red-500",
    success: "bg-green-500/10 text-green-500",
    warning: "bg-yellow-500/10 text-yellow-500",
    loading: "bg-blue-500/10 text-blue-500",
    info: "bg-white/5 text-gray-400",
  };
  return styles[type] || styles.info;
};

const getGroupStatusIcon = (status: string) => {
  if (status === "success")
    return { name: "lucide:check-circle", color: "text-green-500" };
  if (status === "error")
    return { name: "lucide:x-circle", color: "text-red-500" };
  return { name: "lucide:loader-2", color: "text-blue-500 animate-spin" };
};
</script>

<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
    >
      <div>
        <h1 class="text-2xl font-black uppercase tracking-wider text-white">
          System Logs
        </h1>
        <p class="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1">
          Real-time session activity monitor
        </p>
      </div>
      <PartsButtonSecondary
        class="!w-auto !py-2 !px-4"
        icon="lucide:trash-2"
        @click="loggerStore.clearMessages"
      >
        Clear Session Logs
      </PartsButtonSecondary>
    </div>

    <div
      class="bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr class="bg-white/5">
              <th
                class="p-5 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/5"
              >
                Timestamp
              </th>
              <th
                class="p-5 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/5"
              >
                Type
              </th>
              <th
                class="p-5 text-[10px] font-black uppercase text-gray-500 tracking-widest border-b border-white/5"
              >
                Message / Process
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-white/5">
            <tr v-if="loggerStore.messages.length === 0">
              <td
                colspan="3"
                class="p-20 text-center text-gray-600 italic text-sm"
              >
                No activity logs found for this session.
              </td>
            </tr>

            <template v-for="group in groupedMessages.groups" :key="group.id">
              <tr
                @click="toggleGroup(group.id)"
                class="cursor-pointer transition-colors group relative"
                :class="[
                  expandedGroups.includes(group.id)
                    ? 'bg-blue-600/10'
                    : 'bg-blue-600/5 hover:bg-blue-600/10',
                ]"
              >
                <div
                  v-if="group.status === 'processing'"
                  class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
                ></div>

                <td
                  class="p-5 text-[10px] font-mono"
                  :class="
                    group.status === 'processing'
                      ? 'text-blue-400'
                      : 'text-blue-500/50'
                  "
                >
                  {{ new Date(group.timestamp).toLocaleTimeString() }}
                </td>
                <td class="p-5">
                  <div class="flex items-center gap-2">
                    <Icon
                      :name="getGroupStatusIcon(group.status).name"
                      :class="getGroupStatusIcon(group.status).color"
                      size="14"
                    />
                    <span
                      class="text-[8px] font-black uppercase"
                      :class="
                        group.status === 'processing'
                          ? 'text-blue-300'
                          : 'text-blue-400'
                      "
                      >Process</span
                    >
                  </div>
                </td>
                <td class="p-5">
                  <div class="flex justify-between items-center">
                    <span
                      class="text-xs font-black uppercase tracking-widest text-white"
                    >
                      {{ group.name }}
                      <span
                        v-if="group.status === 'processing'"
                        class="ml-2 text-[8px] text-blue-500 animate-pulse"
                        >(Active)</span
                      >
                    </span>
                    <Icon
                      name="lucide:chevron-down"
                      size="16"
                      class="text-gray-600 transition-transform duration-300"
                      :class="{
                        'rotate-180': expandedGroups.includes(group.id),
                      }"
                    />
                  </div>
                </td>
              </tr>

              <TransitionGroup name="list">
                <template v-if="expandedGroups.includes(group.id)">
                  <tr
                    v-for="item in group.items"
                    :key="item.id"
                    class="bg-black/20 border-l border-blue-500/20"
                  >
                    <td class="p-4 pl-10 text-[9px] font-mono text-gray-600">
                      {{ new Date(item.timestamp).toLocaleTimeString() }}
                    </td>
                    <td class="p-4">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded text-[7px] font-black uppercase',
                          getBadgeClass(item.type),
                        ]"
                      >
                        {{ item.type }}
                      </span>
                    </td>
                    <td
                      class="p-4 text-xs"
                      :class="
                        item.type === 'error'
                          ? 'text-red-400'
                          : 'text-gray-400 italic'
                      "
                    >
                      {{ item.message }}
                    </td>
                  </tr>
                </template>
              </TransitionGroup>
            </template>

            <tr
              v-for="log in groupedMessages.orphans"
              :key="log.id"
              class="hover:bg-white/[0.02]"
            >
              <td
                class="p-5 text-[10px] font-mono text-gray-500 border-l border-transparent"
              >
                {{ new Date(log.timestamp).toLocaleTimeString() }}
              </td>
              <td class="p-5">
                <span
                  :class="[
                    'px-2 py-1 rounded-lg text-[8px] font-black uppercase',
                    getBadgeClass(log.type),
                  ]"
                >
                  {{ log.type }}
                </span>
              </td>
              <td class="p-5 text-xs text-gray-300 font-medium italic">
                {{ log.message }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  border-spacing: 0;
}

/* Animation cho danh sách log chi tiết */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
