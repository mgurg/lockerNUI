<template>
  <div v-if="isLoaded || !uuid" class="p-4">
    <UCard>
      <!-- Header Section -->
      <template #header>
        <header class="flex items-center gap-3">
          <UButton
              size="sm"
              icon="i-lucide-arrow-left"
              @click="$router.back()"
              aria-label="Go back"
          />
          <h3 class="text-xl font-bold">{{ uuid ? 'Edit' : 'Create' }} Escape Room</h3>
        </header>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic Information Section -->
        <section class="space-y-4">
          <h4 class="font-semibold text-lg">Basic Information</h4>

          <UFormField
              v-for="field in basicInfoFields"
              :key="field.name"
              :label="field.label"
              :name="field.name"
          >
            <UInput
                v-model="basicInfo[field.name]"
                :type="field.type || 'text'"
                :class="field.class"
                :trailing-icon="field.icon"
                v-bind="field.props"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField
                v-for="field in numericFields"
                :key="field.name"
                :label="field.label"
                :name="field.name"
            >
              <UInput
                  v-model="basicInfo[field.name]"
                  type="number"
                  :min="field.min"
                  :step="field.step"
              />
            </UFormField>
          </div>

          <UFormField label="Status" name="active">
            <USwitch v-model="basicInfo.active"/>
          </UFormField>
        </section>

        <!-- Location & Translations Section -->
        <section class="space-y-6">
          <div class="space-y-4">
            <h4 class="font-semibold text-lg">Location</h4>
            <!-- Department Selection -->
            <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UCard
                  v-for="dept in departments"
                  :key="dept.uuid"
                  class="cursor-pointer hover:shadow-md transition-all"
                  :ui="{
                        ring: department.uuid === dept.uuid ? 'ring-2 ring-primary-500' : '',
                        background: department.uuid === dept.uuid ? 'bg-primary-50' : 'bg-primary-10'
                      }"
                  @click="department.uuid = dept.uuid"
              >
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-building-2"/>
                    <h5 class="font-medium">{{ dept.name }}</h5>
                  </div>

                  <div class="text-sm text-gray-600 space-y-1">
                    <div class="flex items-start gap-2">
                      <UIcon name="i-lucide-map-pin" class="mt-1 flex-shrink-0"/>
                      <div>
                        <p>{{ dept.location.street_name }} {{ dept.location.street_number }}</p>
                        <p>{{ dept.location.postal_code }} {{ dept.location.city }}</p>
                        <p>{{ dept.location.country }}</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-map"/>
                      <span>{{ dept.location.lat }}, {{ dept.location.lon }}</span>
                    </div>
                  </div>
                </div>
              </UCard>
            </div>
            <!-- Department Selection -->

            <div v-if="!loading">
              <UFormField label="Department" name="department">
                <USelect
                    v-model="department.uuid"
                    :items="companyDepartments"
                    class="w-full"
                    placeholder="Select Department"
                />
              </UFormField>
            </div>
            <UButton
                v-else
                @click="fetchCompanyDepartments"
                :loading="loading"
            >
              Fetch departments
            </UButton>
          </div>

          <!-- Translations Section -->
          <div class="space-y-4">
            <h4 class="font-semibold text-lg">Translations</h4>

            <div class="flex flex-wrap gap-2 mb-4">
              <UButton
                  v-for="lang in supportedLanguages"
                  :key="lang"
                  @click="loadTranslation(lang)"
                  :variant="currentTranslation.lang === lang ? 'solid' : 'outline'"
              >
                {{ lang.toUpperCase() }}
              </UButton>
              <UButton
                  icon="i-lucide-plus"
                  @click="createNewTranslation"
                  variant="outline"
              >
                Add New
              </UButton>
            </div>

            <!-- Translation Form -->
            <div class="space-y-4 p-4 border rounded-lg">
              <UFormField label="Language" name="lang">
                <UInput
                    v-model="currentTranslation.lang"
                    class="w-full"
                    placeholder="Enter language code (e.g., 'en')"
                    :disabled="!!translations.find(t => t.lang === currentTranslation.lang)"
                />
              </UFormField>

              <UFormField label="Title" name="title">
                <UInput
                    v-model="currentTranslation.title"
                    class="w-full"
                    placeholder="Enter title"
                />
              </UFormField>

              <UFormField label="Lead" name="lead">
                <UTextarea
                    v-model="currentTranslation.lead"
                    :rows="3"
                    class="w-full"
                    placeholder="Enter lead text"
                />
              </UFormField>

              <UFormField label="Description" name="description">
                <UTextarea
                    v-model="currentTranslation.description"
                    :rows="6"
                    class="w-full"
                    placeholder="Enter description"
                />
              </UFormField>

              <div class="flex gap-4">
                <UButton
                    class="flex-1"
                    color="primary"
                    :disabled="!isTranslationValid"
                    @click="addOrUpdateTranslation"
                >
                  Save Translation
                </UButton>
                <UButton
                    v-if="translations.find(t => t.lang === currentTranslation.lang)"
                    class="flex-1"
                    color="error"
                    variant="soft"
                    @click="deleteTranslation"
                >
                  Delete
                </UButton>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer Actions -->
      <template #footer>
        <footer class="flex justify-end gap-4">
          <UButton
              color="gray"
              variant="ghost"
              @click="$router.back()"
          >
            Cancel
          </UButton>
          <UButton
              color="primary"
              @click="saveRoom"
              :loading="isSaving"
              :disabled="!isFormValid"
          >
            Save Changes
          </UButton>
          <UButton
              v-if="uuid"
              color="red"
              variant="soft"
              @click="confirmDelete"
          >
            Delete
          </UButton>
        </footer>
      </template>
    </UCard>

    <!-- Confirmation Dialog -->
    <!--    <UModal v-model="showDeleteConfirm">-->
    <!--      <UCard>-->
    <!--        <template #header>-->
    <!--          <h3 class="text-lg font-bold">Confirm Deletion</h3>-->
    <!--        </template>-->
    <!--        <p>Are you sure you want to delete this escape room? This action cannot be undone.</p>-->
    <!--        <template #footer>-->
    <!--          <div class="flex justify-end gap-4">-->
    <!--            <UButton @click="showDeleteConfirm = false">Cancel</UButton>-->
    <!--            <UButton-->
    <!--                color="red"-->
    <!--                @click="handleDelete"-->
    <!--                :loading="isDeleting"-->
    <!--            >-->
    <!--              Delete-->
    <!--            </UButton>-->
    <!--          </div>-->
    <!--        </template>-->
    <!--      </UCard>-->
    <!--    </UModal>-->
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute, useRouter} from '#vue-router'
import {
  createRoomRoomsPost,
  getCompanyDepartmentsCompaniesCompanyUuidDepartmentsGet,
  getRoomByUuidRoomsRoomUuidGet
} from '@/client/index.js'
import type {LocationQueryRaw} from 'vue-router'

// Types
interface BasicInfo {
  name: string
  urlSlug: string
  playersMin: number
  playersMax: number
  duration: number
  priceFrom: number
  active: boolean
  lm_id: string
  mt_id: string
  game_fear_index: number
  game_difficulty: string
  url_yt: string
  reservation_url: string
}

interface Location {
  streetAddress: string
  city: string
  postalCode: string
  lat: number
  lon: number
  country: string
}

interface Translation {
  lang: string
  title: string
  lead: string
  description: string
}

// State
const route = useRoute()
const router = useRouter()
const uuid = ref(route.query.uuid as string)
const companyUuid = ref(route.query.company_uuid as string)
const isLoaded = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)
const loading = ref(true)
const companyDepartments = ref([])
const departments = ref([])

// Form Data
const basicInfo = ref<BasicInfo>({
  name: '',
  urlSlug: '',
  playersMin: 2,
  playersMax: 6,
  duration: 60,
  priceFrom: 0,
  active: true,
  lm_id: '',
  mt_id: '',
  game_fear_index: 0,
  game_difficulty: '',
  url_yt: '',
  reservation_url: ''
})

const location = ref<Location>({
  streetAddress: '',
  city: '',
  postalCode: '',
  lat: 0,
  lon: 0,
  country: 'PL'
})

const department = ref({
  uuid: '',
  name: ''
})

const translations = ref<Translation[]>([])
const currentTranslation = ref<Translation>({
  lang: '',
  title: '',
  lead: '',
  description: ''
})

// Field Configurations
const basicInfoFields = [
  {name: 'name', label: 'Name', class: 'w-full'},
  {name: 'urlSlug', label: 'URL Slug', class: 'w-full'},
  {name: 'reservation_url', label: 'Reservation URL', class: 'w-full', icon: 'i-lucide-link'},
  {name: 'url_yt', label: 'YouTube URL', class: 'w-full', icon: 'i-lucide-youtube'}
]

const numericFields = [
  {name: 'playersMin', label: 'Min Players', min: 1, step: 1},
  {name: 'playersMax', label: 'Max Players', min: 1, step: 1},
  {name: 'duration', label: 'Duration (min)', min: 0, step: 5},
  {name: 'priceFrom', label: 'Price From', min: 0, step: 1},
  {name: 'game_fear_index', label: 'Fear Index', min: 0, max: 5, step: 1},
  {name: 'game_difficulty', label: 'Difficulty', min: 1, max: 5, step: 1}
]

const locationFields = [
  {name: 'streetAddress', label: 'Street Address', class: 'w-full'},
  {name: 'city', label: 'City', class: 'w-full'},
  {name: 'postalCode', label: 'Postal Code'},
  {name: 'lat', label: 'Latitude', type: 'number', step: '0.0000001'},
  {name: 'lon', label: 'Longitude', type: 'number', step: '0.0000001'}
]

// Computed
const supportedLanguages = computed(() => translations.value.map(t => t.lang))
const isFormValid = computed(() => {
  return basicInfo.value.name &&
      basicInfo.value.urlSlug &&
      department.value.uuid &&
      translations.value.length > 0
})

const isTranslationValid = computed(() => {
  return currentTranslation.value.lang &&
      currentTranslation.value.title
})

// Methods
const loadTranslation = (lang: string) => {
  const translation = translations.value.find(t => t.lang === lang)
  if (translation) {
    currentTranslation.value = {...translation}
  }
}

const createNewTranslation = () => {
  currentTranslation.value = {lang: '', title: '', lead: '', description: ''}
}

const deleteTranslation = () => {
  translations.value = translations.value.filter(t => t.lang !== currentTranslation.value.lang)
  createNewTranslation()
}

const addOrUpdateTranslation = () => {
  if (!isTranslationValid.value) {
    useToast().add({
      title: 'Error',
      description: 'Language and title are required',
      color: 'red'
    })
    return
  }

  const index = translations.value.findIndex(t => t.lang === currentTranslation.value.lang)
  if (index > -1) {
    translations.value[index] = {...currentTranslation.value}
  } else {
    translations.value.push({...currentTranslation.value})
  }
  createNewTranslation()
}

const fetchCompanyDepartments = async () => {
  try {
    const response = await getCompanyDepartmentsCompaniesCompanyUuidDepartmentsGet({path: {company_uuid: companyUuid.value}})
    companyDepartments.value = response.data.map(dept => ({
      label: dept.name,
      value: dept.uuid
    }))

    departments.value = response.data
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to fetch departments',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const fetchRoom = async () => {
  if (!uuid.value) {
    isLoaded.value = true
    return
  }

  try {
    const response = await getRoomByUuidRoomsRoomUuidGet({
      path: {room_uuid: uuid.value}
    })

    if (response.data) {
      const data = response.data
      basicInfo.value = {
        name: data.name,
        urlSlug: data.url_slug,
        playersMin: data.players_min,
        playersMax: data.players_max,
        duration: data.game_duration,
        priceFrom: data.price_from,
        active: data.active,
        lm_id: data.lm_id,
        mt_id: data.mt_id,
        game_fear_index: data.game_fear_index,
        game_difficulty: data.game_difficulty,
        url_yt: data.url_yt,
        reservation_url: data.reservation_url
      }

      location.value = {
        streetAddress: data.location.street_address,
        city: data.location.city,
        postalCode: data.location.postal_code,
        lat: data.location.lat,
        lon: data.location.lon,
        country: data.location.country
      }

      department.value = {
        uuid: data.department.uuid,
        name: data.department.name
      }

      translations.value = data.translations
    }
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to fetch room data',
      color: 'red'
    })
  } finally {
    isLoaded.value = true
  }
}

const saveRoom = async () => {
  try {
    isSaving.value = true
    const roomData = {
      name: basicInfo.value.name,
      company_uuid: companyUuid.value,
      department_uuid: department.value.uuid,
      url_slug: basicInfo.value.urlSlug,
      players_min: basicInfo.value.playersMin,
      players_max: basicInfo.value.playersMax,
      game_duration: basicInfo.value.duration,
      price_from: basicInfo.value.priceFrom,
      active: basicInfo.value.active,
      translation: translations.value,
      supported_languages: supportedLanguages.value,
    }

    await createRoomRoomsPost({body: roomData})

    useToast().add({
      title: 'Success',
      description: 'Room saved successfully',
      color: 'success'
    })


  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to save room',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  try {
    isDeleting.value = true
    // Implement delete API call
    await redirectToExternalPage('/cc')
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to delete room',
      color: 'warning'
    })
  } finally {
    isDeleting.value = false
    showDeleteConfirm.value = false
  }
}

const localePath = useLocalePath()
const redirectToExternalPage = async (
    path: string,
    company_uuid?: string,
    uuid?: string
): Promise<void> => {
  const query: LocationQueryRaw = {};

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
// Initialize
onMounted(() => {
  fetchRoom()
  fetchCompanyDepartments()
})
</script>