<template>
  <h1 class="text-2xl text-center my-1">ER COMPANY</h1>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <h2 class="text-xl font-semibold">Company Details</h2>
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Brand" name="brand">
          <UInput v-model="state.brand" maxlength=100 size="xl" class="w-full" />
        </UFormField>

        <UFormField label="UUID" name="uuid">
          <UInput v-model="state.uuid" readonly class="w-full" />
        </UFormField>

        <UFormField label="Government ID" name="gov_id">
          <UInput v-model="state.gov_id" class="w-full" />
        </UFormField>

        <UFormField label="Gov ID Type" name="gov_id_type">
          <UInput v-model="state.gov_id_type" class="w-full" />
        </UFormField>

        <UFormField label="Website" name="website">
          <UInput v-model="state.website" class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>

        <UFormField label="Phone" name="phone">
          <UInput v-model="state.phone" class="w-full" />
        </UFormField>
      </UForm>
    </div>

    <div>
      <h2 class="text-xl font-semibold">Location Details</h2>
      <UForm class="space-y-4">
        <UFormField label="City" name="city">
          <UInput v-model="state.location.city" class="w-full" />
        </UFormField>

        <UFormField label="Street Address" name="street_address">
          <UInput v-model="state.location.street_address" class="w-full" />
        </UFormField>

        <UFormField label="Postal Code" name="postal_code">
          <UInput v-model="state.location.postal_code" class="w-full" />
        </UFormField>

        <UFormField label="Country" name="country">
          <UInput v-model="state.location.country" class="w-full" />
        </UFormField>

        <UFormField label="Latitude" name="lat">
          <UInput v-model="state.location.lat" class="w-full" />
        </UFormField>

        <UFormField label="Longitude" name="lon">
          <UInput v-model="state.location.lon" class="w-full" />
        </UFormField>
      </UForm>
    </div>
  </div>

  <div class="mt-4">
    <h2 class="text-xl font-semibold">Department</h2>
    <UForm>
      <UFormField label="Department Name" name="department">
        <UInput v-model="state.department" class="w-full" />
      </UFormField>
    </UForm>
  </div>
</template>

<script setup>
import { getFirstUnverifiedCompanyCcCompanyGet } from "@/client/index.ts";
import { object, string } from "yup";
import { reactive } from "vue";

const LATIN_SCRIPT_PATTERN = /^[\p{L}\p{N}\s\p{P}\p{Emoji}]*$/u;

const schema = object({
  brand: string().min(8, 'Must be at least 8 characters').matches(LATIN_SCRIPT_PATTERN, 'Must only contain Latin characters, numbers, and basic punctuation').required('Required')
});

const state = reactive({
  brand: '',
  uuid: '',
  gov_id: '',
  gov_id_type: '',
  website: '',
  email: '',
  phone: '',
  location: {
    city: '',
    street_address: '',
    postal_code: '',
    country: '',
    lat: '',
    lon: ''
  },
  department: ''
});

async function onSubmit() {}

const fetchUnverifiedCompanies = async () => {
  const response = await getFirstUnverifiedCompanyCcCompanyGet();
  if (response.data) {
    Object.assign(state, response.data, {
      location: response.data.location || {},
      department: response.data.departments?.[0]?.name || ''
    });
  }
};

fetchUnverifiedCompanies();
</script>

<style scoped></style>
