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
          <UBadge
              :color="basicInfo.verified_at ? 'success' : 'warning'"
              size="md"
              icon="i-lucide-badge-check"
              class="ml-0"
          />
          <UBadge
              :color="basicInfo.active ? 'success' : 'warning'"
              size="md"
              icon="i-lucide-circle-check-big"
              class="ml-0"
          />
          <UButton v-if="uuid"
                   size="sm"
                   color="info"
                   trailing-icon="i-lucide-external-link"
                   @click="redirectToExternalPage('/escape-room/'+basicInfo.urlSlug)"
          />
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
                  :class="field.class"
              />
            </UFormField>
          </div>

          <UFormField label="Languages" name="languages" class="mx-2 mt-4">
            <div class="flex gap-2">
              <UButton
                  v-for="lang in languageOptions"
                  :key="lang.value"
                  :label="lang.label"
                  :variant="basicInfo.languages.includes(lang.value) ? 'solid' : 'outline'"
                  @click="toggleLanguage(lang.value)"
              />
            </div>
          </UFormField>

          <UFormField label="Status" name="active" class="mx-2">
            <USwitch v-model="basicInfo.active"
                     label="is active?"
                     unchecked-icon="i-lucide-x"
                     checked-icon="i-lucide-check"
            />
            <USwitch v-model="basicInfo.verified_at"
                     label="is verified?"
                     unchecked-icon="i-lucide-x"
                     checked-icon="i-lucide-badge-check"
            />
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
                    <h5 class="font-medium" :class="department.uuid === dept.uuid ? 'text-purple-700' :'text-current' ">
                      {{ dept.name }}</h5>
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
              color="info"
              variant="ghost"
              @click="$router.back()"
          >
            Cancel
          </UButton>
          <UButton
              v-if="uuid"
              color="error"
              @click="confirmDelete"
          >
            Delete
          </UButton>
          <UButton
              color="info"
              @click="saveRoom"
              :loading="isSaving"
              :disabled="!isFormValid"
              :label=" uuid ? 'Update' : 'Create'"
          >
          </UButton>
        </footer>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute} from '#vue-router'
import {
  createRoomRoomsPost,
  getCompanyDepartmentsCompaniesCompanyUuidDepartmentsGet,
  getRoomByUuidRoomsRoomUuidGet,
  updateRoomRoomsRoomUuidPatch
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
  fear_index: number
  difficulty: string
  url_yt: string
  booking_url: string
  verified_at: string
  languages: string[],
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
  active: false,
  lm_id: '',
  mt_id: '',
  fear_index: 0,
  difficulty: '',
  url_yt: '',
  booking_url: '',
  verified_at: '',
  languages: ['pl'],
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
  {name: 'booking_url', label: 'Reservation URL', class: 'w-full', icon: 'i-lucide-link'},
  {name: 'url_yt', label: 'YouTube URL', class: 'w-full', icon: 'i-lucide-youtube'}
]

const numericFields = [
  {name: 'playersMin', label: 'Min Players', min: 1, step: 1, class: 'w-full'},
  {name: 'playersMax', label: 'Max Players', min: 1, step: 1, class: 'w-full'},
  {name: 'duration', label: 'Duration (min)', min: 0, step: 5, class: 'w-full'},
  {name: 'priceFrom', label: 'Price From', min: 0, step: 1, class: 'w-full'},
  {name: 'fear_index', label: 'Fear Index', min: 0, max: 5, step: 1, class: 'w-full'},
  {name: 'difficulty', label: 'Difficulty', min: 1, max: 5, step: 1, class: 'w-full'}
]

const locationFields = [
  {name: 'streetAddress', label: 'Street Address', class: 'w-full'},
  {name: 'city', label: 'City', class: 'w-full'},
  {name: 'postalCode', label: 'Postal Code'},
  {name: 'lat', label: 'Latitude', type: 'number', step: '0.0000001'},
  {name: 'lon', label: 'Longitude', type: 'number', step: '0.0000001'}
]

const languageOptions = [
  {label: 'PL', value: 'pl'},
  {label: 'EN', value: 'en'},
  {label: 'ES', value: 'es'},
]


function toggleLanguage(code: string) {
  const index = basicInfo.value.languages.indexOf(code)
  if (index === -1) {
    basicInfo.value.languages.push(code)
  } else {
    basicInfo.value.languages.splice(index, 1)
  }
}

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
      color: 'warning'
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
      color: 'error'
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
        duration: data.duration,
        priceFrom: data.price_from,
        active: data.active,
        lm_id: data.lm_id,
        mt_id: data.mt_id,
        fear_index: data.fear_index,
        difficulty: data.difficulty,
        url_yt: data.url_yt,
        booking_url: data.booking_url,
        verified_at: !!data.verified_at,
        languages: data.languages.map(lang => lang.code),
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
      color: 'error'
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
      booking_url: basicInfo.value.booking_url,
      yt_url: basicInfo.value.url_yt,
      players_min: basicInfo.value.playersMin,
      players_max: basicInfo.value.playersMax,
      duration: basicInfo.value.duration,
      price_from: basicInfo.value.priceFrom,
      active: basicInfo.value.active,
      translation: translations.value,
      supported_languages: basicInfo.value.languages,
      verified_at: basicInfo.value.verified_at ? new Date().toISOString() : null
    }

    if (uuid.value) {
      await updateRoomRoomsRoomUuidPatch({
        path: {room_uuid: uuid.value},
        body: roomData
      })
    } else {
      await createRoomRoomsPost({body: roomData})

    }

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