<template>
  <div class="container mx-auto p-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Companies List</h2>
          <UBadge color="gray" variant="soft">
            Total: {{ count }}
          </UBadge>
          <UInput
              v-model="search"
              @update:model-value="handleSearchChange"
              placeholder="Search companies"
          />
          <UButton @click="redirectToExternalPage('cc/company')">
            New company
          </UButton>
        </div>
      </template>

      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <UIcon name="i-lucide-rotate-cw" class="animate-spin h-8 w-8"/>
      </div>

      <!-- Empty state -->
      <div v-else-if="companies.length === 0" class="text-center py-10 text-gray-500">
        No companies found
      </div>

      <!-- Companies list -->
      <div v-else class="space-y-4">
        <UCard
            v-for="company in companies"
            :key="company.uuid"
            class="hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <!-- Company details -->
            <div>
              <UButton
                  class="text-lg font-semibold"
                  :color="company.verified_at ? 'success' : 'warning'"
                  trailing-icon="i-lucide-chevron-right"
                  @click="redirectToExternalPage('/cc/company', company.uuid)"
              >
                {{ company.name }}
              </UButton>

              <div class="mt-2 flex items-center space-x-2">
                <UIcon name="i-lucide-map-pin" class="h-5 w-5 text-gray-500"/>
                <span class="text-gray-600">
                  {{ company.location?.city || 'No Location' }}
                </span>
              </div>
            </div>

            <!-- Departments and rooms -->
            <div class="flex flex-col items-end">
              <!-- Departments section -->
              <div class="flex items-center gap-2 mb-2 flex-wrap justify-end">
                <UButton
                    v-for="dept in company.departments"
                    :key="dept.uuid"
                    icon="i-lucide-map-pin-house"
                    color="info"
                    variant="solid"
                    size="sm"
                    class="mb-1"
                >
                  {{ dept.name }}
                </UButton>
              </div>

              <!-- Rooms section -->
              <div class="space-y-1 flex items-center gap-2 mb-2 flex-wrap justify-start">
                <UButton
                    v-for="room in company.rooms"
                    :key="room.uuid"
                    @click="redirectToExternalPage('/cc/room',company.uuid, room.uuid, )"
                    icon="i-lucide-joystick"
                    :color="room.active ? 'success' : 'warning'"
                    variant="soft"
                    size="md"
                >
                  {{ room.name }}
                </UButton>
                <UButton
                    class="mb-2"
                    size="sm"
                    icon="i-lucide-house-plus"
                    @click="redirectToExternalPage('/cc/room', company.uuid)"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <template #footer>
        <div class="flex justify-center mt-4">
          <UPagination
              v-if="!isLoading"
              :page-count="limit"
              :total="count"
              v-model:page="currentPage"
              @update:page="handlePageChange"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCompaniesCompaniesGet } from '@/client/index.ts'
import { useToast } from '#imports'

// Route and navigation
const localePath = useLocalePath()

// Data state
const companies = ref([])
const isLoading = ref(true)
const count = ref(0)
const limit = ref(10)
const currentPage = ref(1)
const search = ref('')

/**
 * Fetches companies with pagination and optional search filter
 * @param {number} page - Page number to fetch
 */
async function fetchCompanies(page = 1) {
  isLoading.value = true

  try {
    const query = {
      offset: (page - 1) * limit.value,
      limit: limit.value
    }

    if (search.value) {
      query.search = search.value
    }

    const response = await getCompaniesCompaniesGet({ query })

    if (response.data) {
      companies.value = response.data.data
      count.value = response.data.count
      limit.value = response.data.limit
    }
  } catch (error) {
    console.error('Error fetching company data:', error)
    showErrorToast('Failed to fetch companies')
  } finally {
    isLoading.value = false
  }
}

/**
 * Handles page change in pagination
 * @param {number} newPage - New page number
 */
function handlePageChange(newPage) {
  currentPage.value = newPage
  fetchCompanies(newPage)
}

/**
 * Handles search input changes
 */
function handleSearchChange() {
  currentPage.value = 1 // Reset to first page when searching
  fetchCompanies(1)
}

const redirectToExternalPage = async (path, company_uuid, uuid) => {
  const query = {};

  if (uuid) {
    query.uuid = uuid;
  }

  if (company_uuid) {
    query.company_uuid = company_uuid;
  }

  await navigateTo({
    path: localePath(path),
    query
  });
};

/**
 * Display error toast notification
 * @param {string} message - Error message to display
 */
function showErrorToast(message) {
  useToast().add({
    title: 'Error',
    description: message,
    color: 'red'
  })
}

// Initialize data on component mount
onMounted(() => {
  fetchCompanies()
})
</script>