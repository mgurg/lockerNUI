<template>
  <VaLayout
      :top="{ fixed: true, order: 2 }"
      :left="{
      fixed: true,
      absolute: breakpoints.mdDown,
      order: 1,
      overlay: breakpoints.mdDown && !isSidebarMinimized,
    }"
      :right="{
      fixed: true,
      absolute: breakpoints.mdDown,
      order: 1,
      overlay: breakpoints.mdDown && !isSidebarMinimized,
    }"
      @leftOverlayClick="isSidebarMinimized = true"
  >
    <template #top>
      <AppNavbar :is-mobile="isMobile"/>
    </template>

<!--    <template #right>-->
<!--      <AppSidebar-->
<!--          :minimized="isSidebarMinimized"-->
<!--          :animated="!isMobile"-->
<!--          :mobile="isMobile"-->
<!--      />-->
<!--    </template>-->

    <template #content>
      <div
          :class="{ minimized: isSidebarMinimized }"
          class="app-layout__sidebar-wrapper"
      >
        <div v-if="isFullScreenSidebar" class="flex justify-end">
          <VaButton
              class="px-4 py-4"
              icon="md_close"
              preset="plain"
              @click="onCloseSidebarButtonClick"
          />
        </div>
      </div>
      <main class="p-4 mt-8 pt-0">
        <article>
          <NuxtPage/>
        </article>
      </main>
    </template>
  </VaLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useBreakpoint } from "vuestic-ui";
import AppNavbar from "~/components/navbar/AppNavbar.vue";

const breakpoints = useBreakpoint();

const sidebarWidth = ref("16rem");
const sidebarMinimizedWidth = ref(undefined);

const isMobile = ref(false);
const isTablet = ref(false);

const { isSidebarMinimized } = ref(false);

const onResize = () => {
  isSidebarMinimized.value = breakpoints.mdDown;
  isMobile.value = breakpoints.smDown;
  isTablet.value = breakpoints.mdDown;
  sidebarMinimizedWidth.value = isMobile.value ? "0" : "4.5rem";
  sidebarWidth.value = isTablet.value ? "100%" : "16rem";
};

onMounted(() => {
  window.addEventListener("resize", onResize);
  onResize();
  isSidebarMinimized.value = true;
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
});

const isFullScreenSidebar = computed(
    () => isTablet.value && !isSidebarMinimized.value,
);

const onCloseSidebarButtonClick = () => {
  isSidebarMinimized.value = true;
};

</script>


<!--<style lang="scss" scoped>-->
<!--// Prevent icon jump on animation-->
<!--.va-sidebar {-->
<!--  width: unset !important;-->
<!--  min-width: unset !important;-->
<!--}-->
<!--</style>-->

