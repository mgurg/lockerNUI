<template>
  <UContainer>
    <UAccordion :items="items"/>
    <div v-if="loading">Loading data...</div>
    <UPagination
        v-if="!loading"
        v-model:page="page"
        :total="totalItems"
        :page-count="Math.ceil(totalItems / itemsPerPage)"
        :to="to"
        :sibling-count="1"
        show-edges
    />
  </UContainer>
</template>


<script setup lang="ts">
import {ref, watch} from "vue";
import {CompanyService} from "@/client";

// https://github.com/Semolik/music/blob/3aa04a1ed3efae9e57d9c71942f959655c1d085a/frontend/stores/auth.js#L51


// Pagination state
const items = ref([]); // Accordion items
const page = ref(1); // Current page
const totalItems = ref(0); // Total number of items
const itemsPerPage = 10; // Items per page (same as API's `limit`)
const loading = ref(true); // Loading state

// Define the `to` function for pagination links
function to(page: number) {
  return {
    query: {
      page,
    },
  };
}

// Fetch data for the current page
async function fetchPageData() {
  loading.value = true; // Start loading
  try {
    const offset = (page.value - 1) * itemsPerPage;

    // Fetch data from the API
    const response = await CompanyService.getCompaniesCompaniesGet(
        null, // Search query (optional)
        itemsPerPage,
        offset
    );

    // Update total items and items
    totalItems.value = response.count;
    items.value = response.data.map((company) => ({
      label: company.name,
      icon: "heroicons:building-office",
      content: company.name,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false; // End loading
  }
}

// Watch for changes to the `page` and fetch data accordingly
watch(page, fetchPageData);

// Initial fetch
fetchPageData();
</script>


