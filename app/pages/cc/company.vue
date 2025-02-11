<template>
  <div v-if="isLoaded">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h2 class="text-xl font-semibold">
          <UButton size="sm" icon="i-lucide-arrow-left" @click="$router.back()"></UButton>
          Company Details
          <UBadge :color="companyState.validated_at ? 'success' : 'warning'" size="md"
                  icon="i-lucide-badge-check"></UBadge>
        </h2>
        <UForm :schema="schema" :state="companyState" @submit="onSubmit" class="space-y-4">
          <UFormField label="UUID" name="uuid">
            <UInput v-model="companyState.uuid" readonly class="w-full"/>
          </UFormField>

          <UFormField label="Brand" name="brand">
            <UInput v-model="companyState.brand" maxlength="100" size="xl" class="w-full"/>
          </UFormField>

          <UFormField label="Government ID" name="gov_id">
            <UInput v-model="companyState.gov_id" class="w-full"/>
          </UFormField>

          <UFormField label="Gov ID Type" name="gov_id_type">
            <UInput v-model="companyState.gov_id_type" class="w-full"/>
          </UFormField>

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

          <UFormField label="Street Address" name="street_address">
            <UInput v-model="locationState.street_address" class="w-full"/>
          </UFormField>

          <UFormField label="Postal Code" name="postal_code">
            <UInput v-model="locationState.postal_code" class="w-full"/>
          </UFormField>

          <UFormField label="Country" name="country">
            <UInput v-model="locationState.country" class="w-full"/>
          </UFormField>

          <UFormField label="Latitude" name="lat">
            <UInput v-model="locationState.lat" type="number" step="0.000001" class="w-full"/>
          </UFormField>

          <UFormField label="Longitude" name="lon">
            <UInput v-model="locationState.lon" type="number" step="0.000001" class="w-full"/>
          </UFormField>
        </UForm>

        <div class="mt-6 flex justify-between items-center">
          <USwitch v-model="companyState.isVerified" description="Zweryfikowana firma"/>
          <UButton color="info" icon="i-lucide-pencil" @click="updateCompany(companyState.uuid)">
            Aktualizuj
          </UButton>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <h2 class="text-xl font-semibold">Departments</h2>
      <div v-if="departments.length" class="flex flex-wrap gap-2 mt-2">
        <UButton
            v-for="department in departments"
            :key="department.uuid"
            @click="fetchDepartmentDetails(department.uuid)"
            variant="outline"
        >
          {{ department.name }}
        </UButton>
      </div>

      <div v-if="selectedDepartment" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="text-lg font-medium">Department Details</h3>
            <UForm :schema="departmentSchema" :state="departmentState" @submit="onSubmit" class="space-y-4">
              <UFormField label="UUID" name="uuid">
                <UInput v-model="departmentState.uuid" class="w-full"/>
              </UFormField>
              <UFormField label="Department Name" name="name">
                <UInput v-model="departmentState.name" class="w-full"/>
              </UFormField>
            </UForm>
            <div class="my-4 py-4 flex flex-wrap gap-2">
              <UButton color="success" icon="i-lucide-plus" @click="createDepartment()">Dodaj</UButton>
              <UButton color="info" icon="i-lucide-pencil" @click="updateDepartment(departmentState.uuid)">Edytuj
              </UButton>
              <UButton color="error" icon="i-lucide-eraser" @click="deleteDepartment(departmentState.uuid)">Usuń
              </UButton>
            </div>
          </div>
          <div>
            <h2 class="text-xl font-semibold">Location Department Details</h2>
            <UForm :schema="locationSchema" :state="locationDepartmentState" @submit="onSubmit" class="space-y-4">
              <UFormField label="City" name="city">
                <UInput v-model="locationDepartmentState.city" class="w-full"/>
              </UFormField>

              <UFormField label="Street Address" name="street_address">
                <UInput v-model="locationDepartmentState.street_address" class="w-full"/>
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
            @click="redirectToExternalPage(room.uuid, '/cc/room')"
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
  createDepartmentCompaniesDepartmentsPost,
  deleteDepartmentCompaniesDepartmentsDepartmentUuidDelete,
  getCompanyByUuidCompaniesCompanyUuidGet,
  getDepartmentCompaniesDepartmentsDepartmentUuidGet,
  updateCompanyCompaniesCompanyUuidPatch,
  updateDepartmentCompaniesDepartmentsDepartmentUuidPatch
} from '@/client/index.ts';
import {useRoute} from "#vue-router";

const localePath = useLocalePath()
const route = useRoute();

const uuid = ref(route.query.uuid);

// Validation schemas
const schema = object({
  brand: string().min(8, 'Must be at least 8 characters').required('Required'),
  gov_id: string().required('Required'),
  gov_id_type: string().required('Required'),
  website: string().url('Must be a valid URL'),
  email: string().email('Must be a valid email'),
  phone: string(),
});

const locationSchema = object({
  city: string().required('Required'),
  street_address: string().required('Required'),
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
  street_address: '',
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
  street_address: '',
  postal_code: '',
  country: '',
  lat: '',
  lon: '',
});

const departments = ref([]);
const rooms = ref([]);
const selectedDepartment = ref(null);
const isLoaded = ref(false);

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

async function fetchDepartmentDetails(departmentUuid) {
  try {
    const response = await getDepartmentCompaniesDepartmentsDepartmentUuidGet({path: {department_uuid: departmentUuid}});
    Object.assign(departmentState, response.data);
    if (response.data.location) {
      Object.assign(locationDepartmentState, response.data.location);
    }
    selectedDepartment.value = {name: "Fetched Department", uuid: departmentUuid};
    console.log(`Fetching department details for ${departmentUuid}`);
  } catch (error) {
    console.error('Error fetching department:', error);
  }
}

async function createDepartment() {
  const data = {
    company_uuid: companyState.uuid,
    name: departmentState.name,
    location: locationDepartmentState,
  };
  console.log(data)
  const response = await createDepartmentCompaniesDepartmentsPost({
    body: data,
  })

  await useToast().add({
    title: 'Create',
    description: 'Department created successfully',
    color: 'green'
  })

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
    color: 'red'
  })

}

async function deleteDepartment(departmentUuid) {
  console.log(departmentUuid)
  const response = await deleteDepartmentCompaniesDepartmentsDepartmentUuidDelete(
      {
        path: {department_uuid: departmentUuid},
      }
  )
}

const redirectToExternalPage = async (uuid, path) => {
  await navigateTo({
    path: localePath(path),
    query: {uuid: uuid}
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
    color: 'green'
  })
  await fetchCompany()
}

// Initialize data
fetchCompany();
</script>