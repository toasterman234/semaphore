<template>
  <nav
    class="MobileProjectNavigation"
    aria-label="Project navigation"
    data-testid="mobile-navigation"
  >
    <RouterLink
      :to="dashboardPath"
      class="MobileProjectNavigation__item"
      :class="{ 'MobileProjectNavigation__item--active': isActive(dashboardPath) }"
      :aria-current="isActive(dashboardPath) ? 'page' : undefined"
      data-testid="mobile-navigation-dashboard"
    >
      <v-icon size="22">mdi-view-dashboard-outline</v-icon>
      <span>{{ $t('dashboard') }}</span>
    </RouterLink>

    <RouterLink
      v-for="item in primaryItems"
      :key="item.key"
      :to="item.to"
      class="MobileProjectNavigation__item"
      :class="{ 'MobileProjectNavigation__item--active': isActive(item.to) }"
      :aria-current="isActive(item.to) ? 'page' : undefined"
      :data-testid="`mobile-navigation-${item.key}`"
    >
      <v-icon size="22">{{ item.icon }}</v-icon>
      <span>{{ item.title }}</span>
    </RouterLink>

    <button
      class="MobileProjectNavigation__item"
      type="button"
      :aria-label="$t('more')"
      data-testid="mobile-navigation-more"
      @click="$emit('open-menu')"
    >
      <v-icon size="22">mdi-menu</v-icon>
      <span>{{ $t('more') }}</span>
    </button>
  </nav>
</template>

<script>
export default {
  name: 'MobileProjectNavigation',
  emits: ['open-menu'],
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    currentPath: {
      type: String,
      required: true,
    },
    // App.vue is the authority for permissions, licenses, and available routes.
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    dashboardPath() {
      return `/project/${this.projectId}/history`;
    },
    primaryItems() {
      const preferred = ['templates', 'workflows'];
      const selected = preferred
        .map((key) => this.items.find((item) => item.key === key))
        .filter(Boolean);
      // Project types and licenses differ; show available alternatives, never hidden items.
      for (const item of this.items) {
        if (selected.length >= 2) break;
        if (!selected.some((current) => current.key === item.key)) {
          selected.push(item);
        }
      }
      return selected.slice(0, 2);
    },
  },
  methods: {
    isActive(path) {
      return this.currentPath === path || this.currentPath.startsWith(`${path}/`);
    },
  },
};
</script>

<style scoped lang="scss">
.MobileProjectNavigation {
  position: fixed;
  z-index: 900;
  inset: auto 0 0;
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  min-height: calc(64px + env(safe-area-inset-bottom));
  padding: 4px 8px calc(4px + env(safe-area-inset-bottom));
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.MobileProjectNavigation__item {
  display: flex;
  flex: 1 1 0;
  min-width: 0;
  min-height: 56px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 2px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.MobileProjectNavigation__item span {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.MobileProjectNavigation__item--active {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.08);
}

.MobileProjectNavigation__item:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: -2px;
}
</style>
