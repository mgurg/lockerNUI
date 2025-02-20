<template>
  <div v-if="isLoaded || !uuid" class="p-4">
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold">
          <UButton size="sm" icon="i-lucide-arrow-left" @click="$router.back()"></UButton>
          Edit Escape Room
        </h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic Information Column -->
        <div class="space-y-4">
          <h4 class="font-semibold text-lg">Basic Information</h4>

          <UFormField label="Name" name="name">
            <UInput v-model="basicInfo.name" class="w-full"/>
          </UFormField>

          <UFormField label="URL Slug" name="urlSlug">
            <UInput v-model="basicInfo.urlSlug" class="w-full"/>
          </UFormField>
          <UFormField label="Reservation URL" name="reservation_url">
            <UInput v-model="basicInfo.reservation_url" class="w-full" trailing-icon="i-lucide-link"/>
          </UFormField>

          <UFormField label="YT URL" name="url_yt">
            <UInput v-model="basicInfo.url_yt" class="w-full" trailing-icon="i-lucide-youtube"/>
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Min Players" name="playersMin">
              <UInput v-model="basicInfo.playersMin" type="number"/>
            </UFormField>

            <UFormField label="Max Players" name="playersMax">
              <UInput v-model="basicInfo.playersMax" type="number"/>
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Duration (min)" name="duration">
              <UInput v-model="basicInfo.duration" type="number" step="1"/>
            </UFormField>

            <UFormField label="Price From" name="priceFrom">
              <UInput v-model="basicInfo.priceFrom" type="number" step="1"/>
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Fear Index" name="game_fear_index">
              <UInput v-model="basicInfo.game_fear_index"/>
            </UFormField>

            <UFormField label="Difficulty" name="game_difficulty">
              <UInput v-model="basicInfo.game_difficulty"/>
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="LM ID" name="lm_id">
              <UInput v-model="basicInfo.lm_id"/>
            </UFormField>

            <UFormField label="MT ID" name="mt_id">
              <UInput v-model="basicInfo.mt_id"/>
            </UFormField>
          </div>

          <UFormField label="Status" name="active">
            <USwitch v-model="basicInfo.active"/>
          </UFormField>
        </div>

        <!-- Location & Additional Info Column -->
        <div class="space-y-4">
          <h4 class="font-semibold text-lg">Location</h4>

          <div v-if="!loading">
            <UFormField label="Department" name="department">
              <USelect v-model="department.uuid" :items="companyDepartments" class="w-48" label="Select Department"/>
            </UFormField>
          </div>
          <div v-else>
            <UButton @click="fetchCompanyDepartments()">Fetch departments</UButton>
          </div>

          <UFormField label="Street Address" name="streetAddress">
            <UInput v-model="location.streetAddress" class="w-full"/>
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="City" name="city">
              <UInput v-model="location.city"/>
            </UFormField>

            <UFormField label="Postal Code" name="postalCode">
              <UInput v-model="location.postalCode"/>
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Latitude" name="lat">
              <UInput v-model="location.lat" type="number" step="0.0000001"/>
            </UFormField>

            <UFormField label="Longitude" name="lon">
              <UInput v-model="location.lon" type="number" step="0.0000001"/>
            </UFormField>
          </div>

          <h4 class="font-semibold text-lg mt-6">Translations</h4>

          <div class="flex space-x-2 mb-4">
            <UButton v-for="lang in supportedLanguages" :key="lang" @click="loadTranslation(lang)">{{ lang }}</UButton>
          </div>

          <div class="space-y-4 p-4 border rounded-lg">
            <UFormField label="Language" name="lang">
              <UInput v-model="currentTranslation.lang" class="w-full" placeholder="Enter language code (e.g., 'fr')"/>
            </UFormField>

            <UFormField label="Title" name="title">
              <UInput v-model="currentTranslation.title" class="w-full" placeholder="Enter title"/>
            </UFormField>

            <UFormField label="Lead" name="lead">
              <UTextarea v-model="currentTranslation.lead" rows=3 class="w-full" placeholder="Enter lead text"/>
            </UFormField>

            <UFormField label="Description" name="description">
              <UTextarea v-model="currentTranslation.description" rows=6 class="w-full"
                         placeholder="Enter description"/>
            </UFormField>

            <div class="flex space-x-2">
              <UButton @click="addOrUpdateTranslation" class="w-full">Save Translation</UButton>
              <UButton v-if="currentTranslation.lang" @click="deleteTranslation" class="w-full bg-red-500 text-white">
                Delete
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-4">
          <UButton color="gray" variant="ghost">Cancel</UButton>
          <UButton color="primary" @click="saveRoom">Save Changes</UButton>
          <UButton color="warning" @click="deleteRoom">Delete</UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup>
import {useRoute} from "#vue-router";
import {
  createRoomRoomsPost,
  getCompanyDepartmentsCompaniesCompanyUuidDepartmentsGet,
  getRoomByUuidRoomsRoomUuidGet
} from '@/client/index.ts';
import {ref} from "vue";

const route = useRoute();
const uuid = ref(route.query.uuid);
const companyUuid = ref(route.query.company_uuid);
const isLoaded = ref(false);

// Split reactive state
const basicInfo = ref({
  name: '',
  urlSlug: '',
  playersMin: 0,
  playersMax: 0,
  duration: 0,
  priceFrom: 0,
  active: false,
  lm_id: '',
  mt_id: '',
  game_fear_index: 0,
  game_difficulty: '',
  url_yt: '',
  reservation_url: '',
});

const location = ref({
  streetAddress: '',
  city: '',
  postalCode: '',
  lat: 0,
  lon: 0,
  country: 'PL'
});

const company = ref({
  uuid: '',
  name: ''
});

const department = ref({
  uuid: '',
  name: ''
});

const translations = ref([]);

const currentTranslation = ref({lang: '', title: '', lead: '', description: ''});

const loadTranslation = (lang) => {
  const translation = translations.value.find(t => t.lang === lang);
  if (translation) {
    currentTranslation.value = {...translation};
  }
};

const createNewTranslation = () => {
  currentTranslation.value = {lang: '', title: '', lead: '', description: ''};
};

const deleteTranslation = () => {
  translations.value = translations.value.filter(t => t.lang !== currentTranslation.value.lang);
  currentTranslation.value = {lang: '', title: '', lead: '', description: ''};
};

const addOrUpdateTranslation = () => {
  const index = translations.value.findIndex(t => t.lang === currentTranslation.value.lang);
  if (index > -1) {
    translations.value[index] = {...currentTranslation.value};
  } else {
    translations.value.push({...currentTranslation.value});
  }
  currentTranslation.value = {lang: '', title: '', lead: '', description: ''};
};

const supportedLanguages = computed(() => translations.value.map(t => t.lang));


async function fetchRoom() {
  if (!uuid.value) {
    return;
  }
  try {
    const response = await getRoomByUuidRoomsRoomUuidGet({
      path: {room_uuid: uuid.value}
    });
    if (response.data) {
      // Map API data to our reactive refs
      const data = response.data;
      basicInfo.value = {
        name: data.name,
        urlSlug: data.url_slug,
        playersMin: data.players_min,
        playersMax: data.players_max,
        duration: data.game_duration,
        priceFrom: data.price_from,
        active: data.active,
        fear_index: data.game_fear_index,
        game_difficulty: data.game_difficulty,
        lm_id: data.lm_id,
        mt_id: data.mt_id,
        url: data.url_yt,
        reservation_url: data.reservation_url,
      };

      company.value = {
        uuid: data.company.uuid,
        name: data.company.name,
      }

      department.value = {
        uuid: data.department.uuid,
        name: data.department.name,
      }

      location.value = {
        streetAddress: data.location.street_address,
        city: data.location.city,
        postalCode: data.location.postal_code,
        lat: data.location.lat,
        lon: data.location.lon,
        country: data.location.country
      };

      // translations.value = data.translations;

      translations.value = response.data.translations.map(item => ({
        ...item,
        label: item.lang
      }));
      isLoaded.value = true;
    }
  } catch (error) {
    console.error('Error fetching room data:', error);
  }
}

const companyDepartments = ref([]) // Holds the list of departments
const selectedDepartment = ref('') // Holds the selected department UUID
const loading = ref(true)

async function fetchCompanyDepartments() {
  const response = await getCompanyDepartmentsCompaniesCompanyUuidDepartmentsGet({path: {company_uuid: companyUuid.value}})
  companyDepartments.value = response.data.map(department => ({
    label: department.name, // Display name of the department
    value: department.uuid // Use UUID as the value for selection
  }))
  loading.value = false // Set loading to false once data is fetched
}

async function saveRoom() {
  try {
    // Map our reactive refs back to API format
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
    };

    console.log('Saving room:', roomData);

    const response = await createRoomRoomsPost({
      body: roomData
    });

    await useToast().add({
      title: 'Update',
      description: 'Room updated successfully',
      color: 'green'
    })
    // Implement your save API call here
  } catch (error) {
    console.error('Error saving room:', error);
  }
}

async function deleteRoom() {
  // const response = await deleteRoomRoomsRoomUuidDelete({
  //   path: { room_uuid: uuid.value }});

  await useToast().add({
    title: 'Delete',
    description: 'Room deleted successfully',
    color: 'red'
  })

}

fetchRoom();
</script>