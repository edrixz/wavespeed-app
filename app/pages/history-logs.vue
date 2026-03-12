<script setup lang="ts">
import { useLoggerStore } from "~/stores/common/ui/logger-store";
import { storeToRefs } from "pinia";

definePageMeta({ layout: "default" });

const loggerStore = useLoggerStore();
const { groupedMessages, activeGroupId } = storeToRefs(loggerStore);

const expandedGroups = ref<string[]>([]);

watch(
  activeGroupId,
  (newId) => {
    if (newId && !expandedGroups.value.includes(newId)) {
      expandedGroups.value.push(newId);
    }
  },
  { immediate: true },
);

const toggleGroup = (groupId: string) => {
  const index = expandedGroups.value.indexOf(groupId);
  if (index > -1) expandedGroups.value.splice(index, 1);
  else expandedGroups.value.push(groupId);
};

/** Badge style per log type */
const getBadgeStyle = (
  type: string,
): { bg: string; text: string; icon: string } => {
  const map: Record<string, { bg: string; text: string; icon: string }> = {
    error: {
      bg: "bg-red-500/15",
      text: "text-red-400",
      icon: "lucide:x-circle",
    },
    success: {
      bg: "bg-green-500/15",
      text: "text-green-400",
      icon: "lucide:check-circle",
    },
    warning: {
      bg: "bg-yellow-500/15",
      text: "text-yellow-400",
      icon: "lucide:alert-triangle",
    },
    loading: {
      bg: "bg-blue-500/15",
      text: "text-blue-400",
      icon: "lucide:loader-2",
    },
    info: { bg: "bg-white/5", text: "text-gray-500", icon: "lucide:info" },
  };
  return (
    map[type] ?? {
      bg: "bg-white/5",
      text: "text-gray-500",
      icon: "lucide:info",
    }
  );
};

/** Group header status icon + color */
const getGroupStatusIcon = (status: string) => {
  if (status === "success")
    return { name: "lucide:check-circle-2", color: "text-green-400" };
  if (status === "error")
    return { name: "lucide:x-circle", color: "text-red-400" };
  return { name: "lucide:loader-2", color: "text-blue-400 animate-spin" };
};

/** Count errors inside a group */
const groupErrorCount = (group: any) =>
  group.items.filter((i: any) => i.type === "error").length;
</script>

<template>
  <div class="space-y-6 pb-20">
    <!-- Header -->
    <div
      class="px-1 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 animate-fade-in-down"
    >
      <div>
        <h1
          class="text-2xl font-black uppercase tracking-wider text-neutral-900 dark:text-white"
        >
          System Logs
        </h1>
        <p class="text-xs text-gray-500 uppercase tracking-[0.2em] mt-1">
          Real-time session activity monitor
        </p>
      </div>
      <button
        @click="loggerStore.clearMessages"
        class="flex items-center gap-2 px-4 py-2 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-200 active:scale-95"
      >
        <Icon name="lucide:trash-2" size="13" />
        Clear Logs
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="loggerStore.messages.length === 0"
      class="flex flex-col items-center justify-center py-24 gap-4 opacity-40"
    >
      <Icon
        name="lucide:terminal"
        size="40"
        class="text-gray-400 dark:text-white/20"
      />
      <p
        class="text-xs uppercase tracking-widest text-gray-400 dark:text-white/40 font-bold"
      >
        No activity logs for this session
      </p>
    </div>

    <!-- Log groups timeline -->
    <div v-else class="space-y-3">
      <div
        v-for="group in groupedMessages.groups"
        :key="group.id"
        class="rounded-3xl border overflow-hidden transition-all duration-300"
        :class="
          group.status === 'processing'
            ? 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/5'
            : group.status === 'error'
              ? 'border-red-500/20 bg-white dark:bg-[#0d0d0d]'
              : 'border-black/5 dark:border-white/5 bg-white dark:bg-[#0d0d0d]'
        "
      >
        <!-- Group header row -->
        <button
          class="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-black/3 dark:hover:bg-white/3"
          @click="toggleGroup(group.id)"
        >
          <!-- Status icon -->
          <div
            class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            :class="
              group.status === 'processing'
                ? 'bg-blue-500/15'
                : group.status === 'error'
                  ? 'bg-red-500/15'
                  : 'bg-green-500/15'
            "
          >
            <Icon
              :name="getGroupStatusIcon(group.status).name"
              :class="getGroupStatusIcon(group.status).color"
              size="16"
            />
          </div>

          <!-- Group info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="text-xs font-black uppercase tracking-wide text-neutral-900 dark:text-white truncate"
              >
                {{ group.name }}
              </span>
              <span
                v-if="group.status === 'processing'"
                class="text-[10px] font-black uppercase tracking-widest text-blue-400 animate-pulse"
              >
                ● Live
              </span>
              <span
                v-if="groupErrorCount(group) > 0"
                class="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-black uppercase"
              >
                {{ groupErrorCount(group) }} error{{
                  groupErrorCount(group) > 1 ? "s" : ""
                }}
              </span>
            </div>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs font-mono text-gray-400">
                {{ new Date(group.timestamp).toLocaleTimeString() }}
              </span>
              <span class="text-xs text-gray-400">
                · {{ group.items.length }} steps
              </span>
            </div>
          </div>

          <!-- Expand chevron -->
          <Icon
            name="lucide:chevron-down"
            size="15"
            class="shrink-0 text-gray-400 transition-transform duration-300"
            :class="{ 'rotate-180': expandedGroups.includes(group.id) }"
          />
        </button>

        <!-- Group items - detail list -->
        <Transition name="group-expand">
          <div
            v-show="expandedGroups.includes(group.id)"
            class="border-t border-black/5 dark:border-white/5"
          >
            <div class="divide-y divide-black/5 dark:divide-white/5">
              <div
                v-for="item in group.items"
                :key="item.id"
                class="flex items-start gap-4 px-5 py-3"
                :class="item.type === 'error' ? 'bg-red-500/5' : ''"
              >
                <!-- Timeline dot + line -->
                <div class="shrink-0 flex flex-col items-center pt-1 gap-1">
                  <div
                    class="w-5 h-5 rounded-full flex items-center justify-center"
                    :class="getBadgeStyle(String(item.type)).bg"
                  >
                    <Icon
                      :name="
                        getBadgeStyle(String(item.type)).icon || 'lucide:info'
                      "
                      :class="[
                        getBadgeStyle(String(item.type)).text,
                        item.type === 'loading' ? 'animate-spin' : '',
                      ]"
                      size="11"
                    />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0 pt-0.5">
                  <p
                    class="text-sm font-medium leading-relaxed"
                    :class="
                      item.type === 'error'
                        ? 'text-red-400 font-semibold'
                        : item.type === 'success'
                          ? 'text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                    "
                  >
                    {{ item.message }}
                  </p>
                </div>

                <!-- Timestamp -->
                <span class="shrink-0 text-[10px] font-mono text-gray-400 pt-1">
                  {{ new Date(item.timestamp).toLocaleTimeString() }}
                </span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Orphan logs (không thuộc group nào) -->
      <div
        v-if="(groupedMessages.orphans?.length ?? 0) > 0"
        class="rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-[#0d0d0d] overflow-hidden"
      >
        <div
          class="px-5 py-3 border-b border-black/5 dark:border-white/5 bg-black/3 dark:bg-white/3"
        >
          <span
            class="text-xs font-black uppercase tracking-widest text-gray-400"
            >Standalone Logs</span
          >
        </div>
        <div
          v-for="(log, idx) in groupedMessages.orphans"
          :key="log.id"
          class="flex items-start gap-4 px-5 py-3"
          :class="
            idx < (groupedMessages.orphans?.length ?? 0) - 1
              ? 'border-b border-black/5 dark:border-white/5'
              : ''
          "
        >
          <div
            class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
            :class="getBadgeStyle(log.type).bg"
          >
            <Icon
              :name="getBadgeStyle(log.type).icon"
              :class="getBadgeStyle(log.type).text"
              size="11"
            />
          </div>
          <p class="flex-1 text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
            {{ log.message }}
          </p>
          <span class="shrink-0 text-[8px] font-mono text-gray-400 pt-1">
            {{ new Date(log.timestamp).toLocaleTimeString() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Group expand animation */
.group-expand-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.group-expand-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.group-expand-enter-from,
.group-expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
