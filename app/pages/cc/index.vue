<template>
  <div class="container mx-auto p-4">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Companies List</h2>
          <UBadge color="gray" variant="soft">
            Total: {{ count }}
          </UBadge>
          <UInput v-model="search" @update:model-value="fetchCompanies()"></UInput>
          <UButton @click="redirectToExternalPage('/cc/company')">New company</UButton>
        </div>
      </template>

      <div v-if="!isLoaded" class="flex justify-center items-center py-10">
        <UIcon name="i-lucide-rotate-cw" class="animate-spin h-8 w-8"/>
      </div>

      <div v-else-if="companies.length === 0" class="text-center py-10 text-gray-500">
        No companies found
      </div>

      <div v-else class="space-y-4">
        <UCard
            v-for="company in companies"
            :key="company.uuid"
            class="hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold">
                {{ company.name }}
                <UButton :color="company.validated_at ? 'success' : 'warning'"
                         @click="redirectToExternalPage('/cc/company', company.uuid)">GO
                </UButton>
              </h3>
              <div class="mt-2 flex items-center space-x-2">
                <UIcon name="i-lucide-map-pin" class="h-5 w-5 text-gray-500"/>
                <span class="text-gray-600">
                  {{ company.location?.city || 'No Location' }}
                </span>
              </div>
            </div>

            <div class="flex flex-col items-end">
              <UButton size="sm" icon="i-lucide-house-plus" @click="redirectToExternalPage('/cc/department', company.uuid)"></UButton>
              <div class="flex items-center gap-2 mb-2 flex-wrap justify-end">
                <UButton
                    v-for="dept in company.departments"
                    :key="dept.uuid"
                    icon="i-lucide-map-pin-house"
                    color="info"
                    variant="solid"
                    size="sm"
                    class="mb-1"
                    @click="redirectToExternalPage('/cc/department', dept.uuid)"
                >
                  {{ dept.name }}
                </UButton>
              </div>

              <div class="space-y-1 flex items-center gap-2 mb-2 flex-wrap justify-start">
                <UButton
                    v-for="room in company.rooms"
                    @click="redirectToExternalPage(room.uuid, '/cc/room')"
                    :key="room.uuid"
                    icon="i-lucide-joystick"
                    color="green"
                    variant="soft"
                    size="md"
                >
                  {{ room.name }}
                </UButton>
              </div>
            </div>


          </div>
        </UCard>
      </div>

      <template #footer>
        <div class="flex justify-center mt-4">
          <UPagination
              v-if="isLoaded"
              :page-count="limit"
              :total="count"
              v-model:page="page"
              @update:page="fetchCompanies"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {getCompaniesCompaniesGet} from '@/client/index.ts'

const localePath = useLocalePath()

const companies = ref([])
const isLoaded = ref(false)
const count = ref(0)
const limit = ref(10)
const page = ref(1)
const search = ref(null)

async function fetchCompanies(newPage = 1) {
  try {
    isLoaded.value = false
    page.value = newPage

    const query = {
      offset: (newPage - 1) * limit.value,
      limit: limit.value
    }

    if (search.value) {
      query.search = search.value
    }

    const response = await getCompaniesCompaniesGet({query})

    if (response.data) {
      companies.value = response.data.data
      count.value = response.data.count
      limit.value = response.data.limit
      isLoaded.value = true
    }
  } catch (error) {
    console.error('Error fetching company data:', error)
    await useToast().add({
      title: 'Error',
      description: 'Failed to fetch companies',
      color: 'red'
    })
    isLoaded.value = true
  }
}

const redirectToExternalPage = async (path, uuid) => {
  const query = uuid ? {uuid} : {};

  await navigateTo({
    path: localePath(path),
    query
  });
};

onMounted(() => {
  fetchCompanies()
})
</script>