<template>
  <div class="py-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <UCard v-for="location in locations" :key="location.uuid" class="hover:shadow-lg transition-shadow">
        <template #header>
          <div class="flex items-center space-x-2">

            <h3 class="font-medium">{{ location.city }}, {{ location.country }}</h3>
            <UButton
                variant="ghost"
                color="primary"
                icon="i-lucideicons-map"
                size="sm"
                :to="`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`"
                target="_blank"
            >
              View on Map
            </UButton>
          </div>
        </template>

        <div class="space-y-2">
          <p>{{ location.street_name }}</p>
          <p>{{ location.postal_code }} {{ location.city }}</p>


          <div v-if="location.lat && location.lon" class="flex items-center text-sm text-gray-500 mt-2">
            <UIcon name="i-lucideicons-globe" class="mr-1"/>
            <span>{{ location.lat.toFixed(4) }}, {{ location.lon.toFixed(4) }}</span>
          </div>
        </div>
        <!-- Entity Icons Section -->
        <div v-if="location.entities && location.entities.length > 0" class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-sm text-gray-600 mb-2">Contains:</p>
          <div class="flex flex-wrap gap-2">
            <UBadge
                v-if="hasEntityType(location.entities, 'company')"
                color="blue"
                class="flex items-center gap-1"
            >
              <UIcon name="i-lucideicons-building" class="text-sm"/>
              Company
            </UBadge>

            <UBadge
                v-if="hasEntityType(location.entities, 'department')"
                color="green"
                class="flex items-center gap-1"
            >
              <UIcon name="i-lucideicons-users" class="text-sm"/>
              Department
            </UBadge>

            <UBadge
                v-if="countEntityType(location.entities, 'rooms') > 0"
                color="amber"
                class="flex items-center gap-1"
            >
              <UIcon name="i-lucideicons-house" class="text-sm"/>
              {{ countEntityType(location.entities, 'rooms') }}
              Room{{ countEntityType(location.entities, 'rooms') > 1 ? 's' : '' }}
            </UBadge>
          </div>
        </div>

      </UCard>
    </div>
  </div>


  <div v-if="isLoaded || !uuid">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h2 class="text-xl font-semibold">
          <UButton size="sm" icon="i-lucide-arrow-left" @click="$router.back()"></UButton>
          Company Details
          <UBadge :color="companyState.validated_at ? 'success' : 'warning'" size="md"
                  icon="i-lucide-badge-check"></UBadge>
        </h2>
        <UForm :schema="schema" :state="companyState" @submit.prevent="handleSubmit" class="space-y-4">
          <UFormField label="UUID" name="uuid" v-if="uuid">
            <UInput v-model="companyState.uuid" readonly class="w-full"/>
          </UFormField>

          <UFormField label="Name" name="name">
            <UInput v-model="companyState.name" maxlength="100" size="xl" class="w-full"/>
          </UFormField>

          <UFormField label="Brand" name="brand">
            <UInput v-model="companyState.brand" maxlength="100" size="xl" class="w-full"/>
          </UFormField>

          <div class="flex space-x-4 w-full">
            <UFormField label="Government ID" name="gov_id">
              <UInput v-model="companyState.gov_id" class="w-full"/>
            </UFormField>

            <UFormField label="Gov ID Type" name="gov_id_type">
              <UInput v-model="companyState.gov_id_type" class="w-full"/>
            </UFormField>
          </div>

          <UFormField label="Website" name="website">
            <UInput v-model="companyState.website" class="w-full"/>
          </UFormField>

          <UFormField label="Email" name="email">
            <UInput v-model="companyState.email" class="w-full"/>
          </UFormField>

          <UFormField label="Phone" name="phone">
            <UInput v-model="companyState.phone" class="w-full"/>
          </UFormField>
        </UForm>
      </div>

      <div>
        <h2 class="text-xl font-semibold">Location Details</h2>
        <UForm :schema="locationSchema" :state="locationState" @submit="onSubmit" class="space-y-4">
          <UFormField label="City" name="city">
            <UInput v-model="locationState.city" class="w-full"/>
          </UFormField>

          <div class="flex space-x-4 w-full">
            <UFormField label="Street Name" name="street_name">
              <UInput v-model="locationState.street_name" class="w-full"/>
            </UFormField>

            <UFormField label="Street Number" name="street_number">
              <UInput v-model="locationState.street_number" class="w-full"/>
            </UFormField>
          </div>
          <UFormField label="Postal Code" name="postal_code">
            <UInput v-model="locationState.postal_code" class="w-full"/>
          </UFormField>

          <UFormField label="Country" name="country">
            <UInput v-model="locationState.country" class="w-full"/>
          </UFormField>

          <div class="flex space-x-4 w-full">
            <UFormField label="Latitude" name="lat">
              <UInput v-model="locationState.lat" type="number" step="0.000001" class="w-full"/>
            </UFormField>

            <UFormField label="Longitude" name="lon">
              <UInput v-model="locationState.lon" type="number" step="0.000001" class="w-full"/>
            </UFormField>
          </div>
        </UForm>

        <div class="mt-6 flex justify-between items-center">
          <USwitch v-model="companyState.isVerified" description="Zweryfikowana firma"/>
          <UButton color="warning" icon="i-lucide-pencil" @click="deleteCompany(companyState.uuid)" v-if="uuid">
            Usuń
          </UButton>
          <UButton color="info" icon="i-lucide-pencil" @click="updateCompany(companyState.uuid)" v-if="uuid">
            Aktualizuj
          </UButton>
          <UButton color="success" icon="i-lucide-circle-plus" @click="handleSubmit" v-else>Dodaj</UButton>

        </div>
      </div>
    </div>

    <div class="mt-4">
      <h2 class="text-xl font-semibold">Departments</h2>
      <div v-if="departments.length >0" class="flex flex-wrap gap-2 mt-2">
        <UButton
            v-for="department in departments"
            :key="department.uuid"
            @click="fetchDepartmentDetails(department.uuid)"
            variant="outline"
        >
          {{ department.name }}
        </UButton>
        <UButton color="error" @click="selectedDepartment = null">X</UButton>

      </div>

      <div class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="text-lg font-medium">Department Details</h3>
            <UForm :schema="departmentSchema" :state="departmentState" @submit="onSubmit" class="space-y-4">
              <UFormField label="Department Name" name="name">
                <UInput v-model="departmentState.name" class="w-full"/>
              </UFormField>
              <USwitch v-model="copyLocation" description="Adres taki sam jak siedziba"/>
            </UForm>
            <div class="my-4 py-4 flex flex-wrap gap-2">
              <UButton color="success" icon="i-lucide-plus" @click="createDepartment()">Dodaj</UButton>
              <UButton color="info" icon="i-lucide-pencil" @click="updateDepartment(departmentState.uuid)">Edytuj
              </UButton>
              <UButton color="error" icon="i-lucide-eraser" @click="deleteDepartment(departmentState.uuid)">Usuń
              </UButton>
            </div>
          </div>
          <div v-if='!copyLocation || selectedDepartment!==null'>
            <h2 class="text-xl font-semibold">Location Department Details</h2>
            <UForm :schema="locationSchema" :state="locationDepartmentState" @submit="onSubmit" class="space-y-4">
              <UFormField label="City" name="city">
                <UInput v-model="locationDepartmentState.city" class="w-full"/>
              </UFormField>

              <UFormField label="Street Name" name="street_name">
                <UInput v-model="locationDepartmentState.street_name" class="w-full"/>
              </UFormField>

              <UFormField label="Street Number" name="street_number">
                <UInput v-model="locationDepartmentState.street_number" class="w-full"/>
              </UFormField>

              <UFormField label="Postal Code" name="postal_code">
                <UInput v-model="locationDepartmentState.postal_code" class="w-full"/>
              </UFormField>

              <UFormField label="Country" name="country">
                <UInput v-model="locationDepartmentState.country" class="w-full"/>
              </UFormField>

              <UFormField label="Latitude" name="lat">
                <UInput v-model="locationDepartmentState.lat" type="number" step="0.000001" class="w-full"/>
              </UFormField>

              <UFormField label="Longitude" name="lon">
                <UInput v-model="locationDepartmentState.lon" type="number" step="0.000001" class="w-full"/>
              </UFormField>
            </UForm>

          </div>
        </div>

      </div>
    </div>

    <div class="mt-4">
      <h2 class="text-xl font-semibold">Rooms</h2>
      <div v-if="rooms.length" class="flex flex-wrap gap-2 mt-2">
        <UButton
            v-for="room in rooms"
            :key="room.uuid"
            @click="redirectToExternalPage( '/cc/room',uuid, room.uuid)"
            variant="outline"
        >
          {{ room.name }}
        </UButton>
      </div>
    </div>


  </div>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {number, object, string} from 'yup';
import {
  getCompanyByUuidCompaniesCompanyUuidGet,
  getCompanyLocationsCompaniesCompanyUuidLocationsGet,
    createCompanyCompaniesPost,
  updateCompanyCompaniesCompanyUuidPatch,
    deleteCompanyCompaniesCompanyUuidDelete,
  createDepartmentCompaniesDepartmentsPost,
  deleteDepartmentCompaniesDepartmentsDepartmentUuidDelete,
  getDepartmentCompaniesDepartmentsDepartmentUuidGet,
  updateDepartmentCompaniesDepartmentsDepartmentUuidPatch
} from '@/client/index.ts';
import {useRoute} from "#vue-router";
import { ModalExample } from '#components'

const localePath = useLocalePath()
const modal = useModal()
const route = useRoute();

const uuid = ref(route.query.company_uuid);
const locations = ref([])
const copyLocation = ref(true)

// Validation schemas
const schema = object({
  name: string().required('Required'),
  brand: string(),
  gov_id: string().required('Required'),
  gov_id_type: string().required('Required'),
  website: string().url('Must be a valid URL'),
  email: string().email('Must be a valid email'),
  phone: string(),
});

const locationSchema = object({
  city: string().required('Required'),
  street_name: string().required('Required'),
  street_number: string().required('Required'),
  postal_code: string().required('Required'),
  country: string().required('Required'),
  lat: number().typeError('Must be a number'),
  lon: number().typeError('Must be a number'),
});

const departmentSchema = object({
  name: string().required('Required'),
});

const roomSchema = object({
  name: string().required('Required'),
});

// State management
const companyState = reactive({
  name: '',
  brand: '',
  uuid: '',
  gov_id: '',
  gov_id_type: '',
  website: '',
  email: '',
  phone: '',
  verified_at: '',
  isVerified: false
});

const locationState = reactive({
  city: '',
  street_name: '',
  street_number: '',
  postal_code: '',
  country: '',
  lat: '',
  lon: '',
});

const departmentState = reactive({
  name: '',
  uuid: '',
});

const locationDepartmentState = reactive({
  city: '',
  street_name: '',
  street_number: '',
  postal_code: '',
  country: '',
  lat: '',
  lon: '',
});

const departments = ref([]);
const rooms = ref([]);
const selectedDepartment = ref(null);
const isLoaded = ref(false);

const handleSubmit = async (event) => {
  try {
    // Validate form
    await schema.validate(companyState, {abortEarly: false});
    await locationSchema.validate(locationState, {abortEarly: false});

    // If validation passes, call appropriate method
    if (uuid.value) {
      await updateCompany(companyState.uuid);
    } else {
      await createCompany();
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      await useToast().add({
        title: 'Validation Error',
        description: error.message,
        color: 'error'
      });
    }
    console.error('Form submission error:', error);
  }
};

// Methods
async function onSubmit() {
  try {
    // Combine states for API submission
    const submitData = {
      ...companyState,
      location: locationState,
      departments: departments.value,
      rooms: rooms.value,
    };

    // TODO: Implement API call to update company data
    console.log('Submitting data:', submitData);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}

async function fetchCompany() {
  if (!uuid.value) {
    return;
  }
  try {
    const response = await getCompanyByUuidCompaniesCompanyUuidGet({path: {company_uuid: uuid.value}});
    if (response.data) {
      // Update company state
      Object.assign(companyState, response.data);

      // Update location state
      if (response.data.location) {
        Object.assign(locationState, response.data.location);
      }

      // Update departments and rooms
      departments.value = response.data.departments || [];
      rooms.value = response.data.rooms || [];

      isLoaded.value = true;
    }
  } catch (error) {
    console.error('Error fetching company data:', error);
  }
}

async function fetchLocations() {
  if (!uuid.value) {
    return;
  }
  try {
    const response = await getCompanyLocationsCompaniesCompanyUuidLocationsGet({
      path: {company_uuid: uuid.value}
    })

    locations.value = response.data || []
  } catch (err) {
    console.error('Failed to fetch locations:', err)
  }

}

// Function to check if entities array has a specific type
function hasEntityType(entities, type) {
  return entities.some(entity => entity.type === type)
}

// Function to count occurrences of a specific entity type
function countEntityType(entities, type) {
  return entities.filter(entity => entity.type === type).length
}

await fetchLocations()


// DEPARTMENTS
async function fetchDepartmentDetails(departmentUuid) {
  try {
    const response = await getDepartmentCompaniesDepartmentsDepartmentUuidGet({path: {department_uuid: departmentUuid}});
    Object.assign(departmentState, response.data);
    if (response.data.location) {
      Object.assign(locationDepartmentState, response.data.location);
    }
    selectedDepartment.value = {name: response.data.name, uuid: departmentUuid};
    console.log(`Fetching department details for ${departmentUuid}`);
  } catch (error) {
    console.error('Error fetching department:', error);
  }
}

async function createDepartment() {
  const data = {
    company_uuid: companyState.uuid,
    name: departmentState.name,
    location: copyLocation.value ? locationState : locationDepartmentState,
  };

  console.log(data)
  const response = await createDepartmentCompaniesDepartmentsPost({
    body: data,
  })

  await useToast().add({
    title: 'Create',
    description: 'Department created successfully',
    color: 'success'
  })

  await fetchCompany();
}

async function updateDepartment(departmentUuid) {
  const data = {
    name: departmentState.name,
    location: locationDepartmentState,
  };
  console.log(data)
  const response = await updateDepartmentCompaniesDepartmentsDepartmentUuidPatch({
    body: data,
    path: {department_uuid: departmentUuid},
  })

  await fetchDepartmentDetails(departmentUuid)

  await useToast().add({
    title: 'Update',
    description: 'Department updated successfully',
    color: 'error'
  })

}

async function deleteDepartment(departmentUuid) {
  console.log(departmentUuid)
  const response = await deleteDepartmentCompaniesDepartmentsDepartmentUuidDelete(
      {
        path: {department_uuid: departmentUuid},
      }
  )

  await fetchCompany();
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

async function updateCompany(companyUuid) {
  console.log(companyUuid)
  if (companyState.isVerified === true) {
    companyState.verified_at = new Date().toISOString();
  } else {
    companyState.verified_at = null;
  }

  const data = {
    ...companyState,
    location: locationState,
  };

  console.log(data)
  const response = await updateCompanyCompaniesCompanyUuidPatch({
    body: data,
    path: {company_uuid: companyUuid},
  })
  await useToast().add({
    title: 'Update',
    description: 'Company updated successfully',
    color: 'success'
  })
  await fetchCompany()
}

async function deleteCompany(companyUuid) {


  modal.open(ModalExample, {
    description: 'NAZWA FIRMY',
    message: 'Czy na pewno chcesz usunąć firmę?',
    onSuccess() {
      console.log("DELETE COMPANY")
    }
  })

 const response = deleteCompanyCompaniesCompanyUuidDelete({
   path: {company_uuid: companyUuid},
 })
}

const errors = ref({});


async function validateForm(data) {
  try {
    // Validate company data
    await schema.validate(data, {abortEarly: false});

    // Validate location data
    await locationSchema.validate(data.location, {abortEarly: false});

    return true;
  } catch (validationError) {
    // Transform Yup errors into a more usable format
    errors.value = validationError.inner.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});

    return false;
  }
}

async function createCompany() {
  if (companyState.isVerified === true) {
    companyState.verified_at = new Date().toISOString();
  } else {
    companyState.verified_at = null;
  }

  const data = {
    ...companyState,
    location: locationState,
  };

  const isValid = await validateForm(data);

  console.log(data)
  const response = await createCompanyCompaniesPost({
    body: data
  })
  await useToast().add({
    title: 'Add',
    description: 'Company added successfully',
    color: 'success'
  })
  await redirectToExternalPage('/cc')
}

// Initialize data
await fetchCompany();
</script>