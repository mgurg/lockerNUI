<template>
  <div v-if="isLoaded || !uuid">
    <!-- Main content layout -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Company Information Section -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center mb-4">
          <UButton size="sm" icon="i-lucide-arrow-left" @click="$router.back()" class="mr-2"/>
          <h2 class="text-xl font-semibold">Company Details</h2>
          <UBadge
              :color="companyState.verified_at ? 'success' : 'warning'"
              size="md"
              icon="i-lucide-badge-check"
              class="ml-2"
          />
        </div>

        <UForm :schema="schema" :state="companyState" @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Company ID field -->
          <UFormField v-if="uuid" label="UUID" name="uuid">
            <UInput v-model="companyState.uuid" readonly class="w-full bg-gray-100"/>
          </UFormField>

          <!-- Basic company information -->
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Name" name="name">
              <UInput v-model="companyState.name" maxlength="100" size="xl" class="w-full"/>
            </UFormField>

            <UFormField label="Brand" name="brand">
              <UInput v-model="companyState.brand" maxlength="100" size="xl" class="w-full"/>
            </UFormField>
          </div>

          <!-- Government ID fields -->
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Government ID" name="gov_id">
              <UInput v-model="companyState.gov_id" class="w-full"/>
            </UFormField>

            <UFormField label="Gov ID Type" name="gov_id_type">
              <UInput v-model="companyState.gov_id_type" class="w-full"/>
            </UFormField>
          </div>

          <!-- Contact information -->
          <UFormField label="Website" name="website">
            <UInput v-model="companyState.website" class="w-full"/>
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Email" name="email">
              <UInput v-model="companyState.email" class="w-full"/>
            </UFormField>

            <UFormField label="Phone" name="phone">
              <UInput v-model="companyState.phone" class="w-full"/>
            </UFormField>
          </div>
        </UForm>
      </div>

      <!-- Location Details Section -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Location Details</h2>
        <UForm :schema="locationSchema" :state="locationState" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="City" name="city">
              <UInput v-model="locationState.city" class="w-full"/>
            </UFormField>

            <UFormField label="Postal Code" name="postal_code">
              <UInput v-model="locationState.postal_code" class="w-full"/>
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Street Name" name="street_name">
              <UInput v-model="locationState.street_name" class="w-full"/>
            </UFormField>

            <UFormField label="Street Number" name="street_number">
              <UInput v-model="locationState.street_number" class="w-full"/>
            </UFormField>
          </div>

          <UFormField label="Country" name="country">
            <UInput v-model="locationState.country" class="w-full"/>
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Latitude" name="lat">
              <UInput v-model="locationState.lat" type="number" step="0.000001" class="w-full"/>
            </UFormField>

            <UFormField label="Longitude" name="lon">
              <UInput v-model="locationState.lon" type="number" step="0.000001" class="w-full"/>
            </UFormField>
          </div>
        </UForm>

        <!-- Action buttons -->
        <div class="mt-6 flex justify-between items-center">
          <USwitch v-model="companyState.isVerified" description="Verified company"/>
          <div class="space-x-2">
            <UButton
                v-if="uuid"
                color="warning"
                icon="i-lucide-trash-2"
                @click="confirmDeleteCompany(companyState.uuid)"
            >
              Delete
            </UButton>
            <UButton
                v-if="uuid"
                color="info"
                icon="i-lucide-save"
                @click="updateCompany(companyState.uuid)"
            >
              Update
            </UButton>
            <UButton
                v-else
                color="success"
                icon="i-lucide-circle-plus"
                @click="handleSubmit"
            >
              Add
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Departments Section -->
    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">Departments</h2>

      <!-- Department List -->
      <div v-if="departments.length > 0" class="flex flex-wrap gap-2 mt-4 mb-6">
        <UButton
            v-for="department in departments"
            :key="department.uuid"
            @click="fetchDepartmentDetails(department.uuid)"
            :color="selectedDepartment?.uuid === department.uuid ? 'primary' : 'gray'"
            variant="outline"
        >
          {{ department.name }}
        </UButton>
        <UButton
            v-if="selectedDepartment"
            color="error"
            size="sm"
            icon="i-lucide-x"
            @click="clearDepartmentSelection"
        />
      </div>
      <p v-else class="text-gray-500 italic mb-4">No departments available</p>

      <!-- Department Details Form -->
      <div class="grid grid-cols-2 gap-6">
        <div class="p-4 bg-white rounded-lg shadow-sm">
          <h3 class="text-lg font-medium mb-4">Department Details</h3>
          <UForm :schema="departmentSchema" :state="departmentState" class="space-y-4">
            <UFormField label="Department Name" name="name">
              <UInput v-model="departmentState.name" class="w-full"/>
            </UFormField>
            <USwitch
                v-model="copyLocation"
                description="Same address as headquarters"
                class="mt-4"
            />
          </UForm>

          <!-- Department action buttons -->
          <div class="mt-6 flex flex-wrap gap-2">
            <UButton
                color="success"
                icon="i-lucide-plus"
                @click="createDepartment()"
                :disabled="!companyState.uuid || !departmentState.name"
            >
              Add
            </UButton>
            <UButton
                color="info"
                icon="i-lucide-save"
                @click="updateDepartment(departmentState.uuid)"
                :disabled="!departmentState.uuid"
            >
              Edit
            </UButton>
            <UButton
                color="error"
                icon="i-lucide-trash-2"
                @click="confirmDeleteDepartment(departmentState.uuid)"
                :disabled="!departmentState.uuid"
            >
              Delete
            </UButton>
          </div>
        </div>

        <!-- Department Location Form -->
        <div v-if="!copyLocation || selectedDepartment" class="p-4 bg-white rounded-lg shadow-sm">
          <h3 class="text-lg font-medium mb-4">Department Location</h3>
          <UForm :schema="locationSchema" :state="locationDepartmentState" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="City" name="city">
                <UInput v-model="locationDepartmentState.city" class="w-full"/>
              </UFormField>

              <UFormField label="Postal Code" name="postal_code">
                <UInput v-model="locationDepartmentState.postal_code" class="w-full"/>
              </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Street Name" name="street_name">
                <UInput v-model="locationDepartmentState.street_name" class="w-full"/>
              </UFormField>

              <UFormField label="Street Number" name="street_number">
                <UInput v-model="locationDepartmentState.street_number" class="w-full"/>
              </UFormField>
            </div>

            <UFormField label="Country" name="country">
              <UInput v-model="locationDepartmentState.country" class="w-full"/>
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Latitude" name="lat">
                <UInput v-model="locationDepartmentState.lat" type="number" step="0.000001" class="w-full"/>
              </UFormField>

              <UFormField label="Longitude" name="lon">
                <UInput v-model="locationDepartmentState.lon" type="number" step="0.000001" class="w-full"/>
              </UFormField>
            </div>
          </UForm>
        </div>
      </div>
    </div>


    <!-- Contacts Section -->
    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">Contacts</h2>

      <!-- Contacts List -->
      <div v-if="contacts.length > 0" class="flex flex-wrap gap-2 mt-4 mb-6">
        <UButton
            v-for="contact in contacts"
            :key="contact.uuid"
            @click="fetchDepartmentDetails(contact.uuid)"
            :color="selectedContact?.uuid === contact.uuid ? 'primary' : 'gray'"
            variant="outline"
        >
          {{ contact.name }}
        </UButton>
        <UButton
            v-if="selectedContact"
            color="error"
            size="sm"
            icon="i-lucide-x"
            @click="clearContactSelection"
        />
      </div>
      <p v-else class="text-gray-500 italic mb-4">No contacts available</p>

      <!-- Contact Details Form -->
      <div class="grid grid-cols-2 gap-6">
        <div class="p-4 bg-white rounded-lg shadow-sm">
          <h3 class="text-lg font-medium mb-4">Contacts Details</h3>
          <UForm :schema="departmentSchema" :state="departmentState" class="space-y-4">
            <UFormField label="Contact Type" name="type">
              <UInput v-model="contactState.type" class="w-full"/>
            </UFormField>
            <UFormField label="Contact Value" name="value">
              <UInput v-model="contactState.value" class="w-full"/>
            </UFormField>
            <UFormField label="Contact Description" name="description">
              <UInput v-model="contactState.description" class="w-full"/>
            </UFormField>
            <USwitch v-model="contactState.isPrimary" description="Is primary"/>
          </UForm>

          <!-- Department action buttons -->
          <div class="mt-6 flex flex-wrap gap-2">
            <UButton
                color="success"
                icon="i-lucide-plus"
                @click="createDepartment()"
                :disabled="!companyState.uuid || !contactState.type"
            >
              Add
            </UButton>
            <UButton
                color="info"
                icon="i-lucide-save"
                @click="updateDepartment(departmentState.uuid)"
                :disabled="!departmentState.uuid"
            >
              Edit
            </UButton>
            <UButton
                color="error"
                icon="i-lucide-trash-2"
                @click="confirmDeleteDepartment(departmentState.uuid)"
                :disabled="!departmentState.uuid"
            >
              Delete
            </UButton>
          </div>
        </div>


      </div>
    </div>


    <!-- Rooms Section -->
    <div class="mt-8 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">Rooms</h2>
      <div v-if="rooms.length" class="flex flex-wrap gap-2 mt-4">
        <UButton
            v-for="room in rooms"
            :key="room.uuid"
            @click="redirectToExternalPage('/cc/room', uuid, room.uuid)"
            variant="outline"
            color="gray"
        >
          {{ room.name }}
        </UButton>
      </div>
      <p v-else class="text-gray-500 italic mt-2">No rooms available</p>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-64">
    <UIcon name="i-lucide-loader-2" class="animate-spin h-8 w-8 text-gray-400"/>
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
import {ModalExample} from '#components'


// Composables
const localePath = useLocalePath();
const overlay = useOverlay();
const modal = overlay.create(ModalExample,{
  props: {
    description: 'Confirm Deletion',
    message: `Are you sure you want to delete department"?`,
  }
})
const toast = useToast();
const route = useRoute();

// State variables
const uuid = ref(route.query.company_uuid);
const locations = ref([]);
const copyLocation = ref(true);
const departments = ref([]);
const rooms = ref([]);
const contacts = ref([]);
const selectedDepartment = ref(null);
const selectedContact = ref(null);
const isLoaded = ref(false);
const errors = ref({});

// Validation schemas
const schema = object({
  name: string().required('Company name is required'),
  brand: string(),
  gov_id: string().required('Government ID is required'),
  gov_id_type: string().required('Government ID type is required'),
  website: string().url('Must be a valid URL'),
  email: string().email('Must be a valid email'),
  phone: string(),
});

const locationSchema = object({
  city: string().required('City is required'),
  street_name: string().required('Street name is required'),
  street_number: string().required('Street number is required'),
  postal_code: string().required('Postal code is required'),
  country: string().required('Country is required'),
  lat: number().typeError('Must be a number'),
  lon: number().typeError('Must be a number'),
});

const departmentSchema = object({
  name: string().required('Department name is required'),
});

const contactSchema = object({
  type: string().required('Contact type is required'),
});

const contactState = reactive({
  type: '',
  value: '',
  country_code: '',
  description: '',
  isPrimary: false
});


// Form state objects
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

// Form validation and submission
const handleSubmit = async () => {
  try {
    // Validate form data
    await schema.validate(companyState, {abortEarly: false});
    await locationSchema.validate(locationState, {abortEarly: false});

    // Call appropriate method based on whether we're editing or creating
    if (uuid.value) {
      await updateCompany(companyState.uuid);
    } else {
      await createCompany();
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      toast.add({
        title: 'Validation Error',
        description: error.message,
        color: 'error'
      });
    }
    console.error('Form submission error:', error);
  }
};

async function validateForm(data) {
  try {
    // Validate company and location data
    await schema.validate(data, {abortEarly: false});
    await locationSchema.validate(data.location, {abortEarly: false});
    return true;
  } catch (validationError) {
    // Transform validation errors into usable format
    errors.value = validationError.inner.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
    return false;
  }
}

// Data fetching methods
async function fetchCompany() {
  if (!uuid.value) {
    isLoaded.value = true;
    return;
  }

  try {
    const response = await getCompanyByUuidCompaniesCompanyUuidGet({
      path: {company_uuid: uuid.value}
    });

    if (response.data) {
      // Update company state
      Object.assign(companyState, response.data);
      companyState.isVerified = !!response.data.verified_at;

      // Update location state
      if (response.data.location) {
        Object.assign(locationState, response.data.location);
      }

      // Update departments and rooms
      departments.value = response.data.departments || [];
      rooms.value = response.data.rooms || [];
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to load company data',
      color: 'error'
    });
    console.error('Error fetching company data:', error);
  } finally {
    isLoaded.value = true;
  }
}

async function fetchLocations() {
  if (!uuid.value) return;

  try {
    const response = await getCompanyLocationsCompaniesCompanyUuidLocationsGet({
      path: {company_uuid: uuid.value}
    });
    locations.value = response.data || [];
  } catch (err) {
    console.error('Failed to fetch locations:', err);
  }
}

// Department management methods
async function fetchDepartmentDetails(departmentUuid) {
  try {
    const response = await getDepartmentCompaniesDepartmentsDepartmentUuidGet({
      path: {department_uuid: departmentUuid}
    });

    Object.assign(departmentState, response.data);
    if (response.data.location) {
      Object.assign(locationDepartmentState, response.data.location);
    } else {
      // Reset location fields if no location data
      Object.assign(locationDepartmentState, {
        city: '',
        street_name: '',
        street_number: '',
        postal_code: '',
        country: '',
        lat: '',
        lon: '',
      });
    }

    selectedDepartment.value = {
      name: response.data.name,
      uuid: departmentUuid
    };
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to load department details',
      color: 'error'
    });
    console.error('Error fetching department:', error);
  }
}

function clearDepartmentSelection() {
  selectedDepartment.value = null;
  Object.assign(departmentState, {
    name: '',
    uuid: '',
  });
  Object.assign(locationDepartmentState, {
    city: '',
    street_name: '',
    street_number: '',
    postal_code: '',
    country: '',
    lat: '',
    lon: '',
  });
}

function clearContactSelection() {
  selectedContact.value = null;
}

async function createContact() {

}

async function updateContact() {

}

async function deleteContact() {

}


async function createDepartment() {
  if (!departmentState.name || !companyState.uuid) {
    toast.add({
      title: 'Validation Error',
      description: 'Department name is required',
      color: 'error'
    });
    return;
  }

  const data = {
    company_uuid: companyState.uuid,
    name: departmentState.name,
    location: copyLocation.value ? locationState : locationDepartmentState,
  };

  try {
    await createDepartmentCompaniesDepartmentsPost({
      body: data,
    });

    toast.add({
      title: 'Success',
      description: 'Department created successfully',
      color: 'success'
    });

    await fetchCompany();
    clearDepartmentSelection();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to create department',
      color: 'error'
    });
    console.error('Error creating department:', error);
  }
}

async function updateDepartment(departmentUuid) {
  if (!departmentUuid) {
    toast.add({
      title: 'Error',
      description: 'No department selected',
      color: 'error'
    });
    return;
  }

  const data = {
    name: departmentState.name,
    location: locationDepartmentState,
  };

  try {
    await updateDepartmentCompaniesDepartmentsDepartmentUuidPatch({
      body: data,
      path: {department_uuid: departmentUuid},
    });

    toast.add({
      title: 'Success',
      description: 'Department updated successfully',
      color: 'success'
    });

    await fetchDepartmentDetails(departmentUuid);
    await fetchCompany();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to update department',
      color: 'error'
    });
    console.error('Error updating department:', error);
  }
}

function confirmDeleteDepartment(departmentUuid) {
  if (!departmentUuid) return;

  modal.open(ModalExample, {
    description: 'Confirm Deletion',
    message: `Are you sure you want to delete department "${departmentState.name}"?`,
    onSuccess() {
      console.log("DELETE COMPANY")

    }
  })

  deleteDepartment(departmentUuid)
}

async function deleteDepartment(departmentUuid) {
  try {
    await deleteDepartmentCompaniesDepartmentsDepartmentUuidDelete({
      path: {department_uuid: departmentUuid},
    });

    toast.add({
      title: 'Success',
      description: 'Department deleted successfully',
      color: 'success'
    });

    await fetchCompany();
    clearDepartmentSelection();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to delete department',
      color: 'error'
    });
    console.error('Error deleting department:', error);
  }
}

// Company management methods
async function updateCompany(companyUuid) {
  if (!companyUuid) return;

  try {
    // Update verified_at timestamp based on isVerified state
    if (companyState.isVerified) {
      companyState.verified_at = companyState.verified_at || new Date().toISOString();
    } else {
      companyState.verified_at = null;
    }

    const data = {
      ...companyState,
      location: locationState,
    };

    await updateCompanyCompaniesCompanyUuidPatch({
      body: data,
      path: {company_uuid: companyUuid},
    });

    toast.add({
      title: 'Success',
      description: 'Company updated successfully',
      color: 'success'
    });

    await fetchCompany();
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to update company',
      color: 'error'
    });
    console.error('Error updating company:', error);
  }
}

function confirmDeleteCompany(companyUuid) {
  if (!companyUuid) return;

  overlay.open(ModalExample, {
    description: 'Confirm Company Deletion',
    message: `Are you sure you want to delete company "${companyState.name}"? This action cannot be undone.`,
    onSuccess() {
      console.log("DELETE COMPANY")
      deleteCompany(companyUuid)
    }
  })
}

async function deleteCompany(companyUuid) {
  try {
    await deleteCompanyCompaniesCompanyUuidDelete({
      path: {company_uuid: companyUuid},
    });

    toast.add({
      title: 'Success',
      description: 'Company deleted successfully',
      color: 'success'
    });

    await redirectToExternalPage('/cc');
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to delete company',
      color: 'error'
    });
    console.error('Error deleting company:', error);
  }
}

async function createCompany() {
  try {
    if (companyState.isVerified) {
      companyState.verified_at = new Date().toISOString();
    } else {
      companyState.verified_at = null;
    }

    const data = {
      ...companyState,
      location: locationState,
    };

    const isValid = await validateForm(data);
    if (!isValid) {
      toast.add({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        color: 'error'
      });
      return;
    }

    await createCompanyCompaniesPost({
      body: data
    });

    toast.add({
      title: 'Success',
      description: 'Company added successfully',
      color: 'success'
    });

    await redirectToExternalPage('/cc');
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to create company',
      color: 'error'
    });
    console.error('Error creating company:', error);
  }
}

// Navigation helper
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

// Initialize data on component mount
// await fetchLocations();
await fetchCompany();
</script>