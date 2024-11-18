<template>
  <UContainer>
    <div class="flex flex-col gap-10">
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl">Information about the Administrator of the Building</h2>
        <div class="flex flex-col md:flex-row gap-4">
          <UForm
              :schema="schema"
              :state="state"
              @submit="onSubmit"
              class="space-y-4 w-full md:w-1/2"
          >
            <!-- Game Location -->
            <UFormField label="Wprowadź motyw" name="theme">
              <UInput
                  v-model="state.theme"
                  placeholder="opuszczona świątynia, stacja kosmiczna"
                  size="xl"
                  class="w-full max-w-[400px]"
              />
            </UFormField>

            <!-- Additional Details -->
            <UFormField label="Dodatkowe szczegóły/opis" name="description">
              <UTextarea
                  v-model="state.description"
                  placeholder=""
                  size="xl"
                  class="w-full max-w-[400px]"
              />
            </UFormField>

            <!-- Difficulty Level -->
            <UFormField label="Poziom trudności" name="difficultyLevel">
              <UInput
                  v-model="state.difficultyLevel"
                  placeholder=""
                  size="xl"
                  class="w-full max-w-[400px]"
              />
            </UFormField>

            <!-- Escape Room Category -->
            <UFormField label="Kategoria" name="category">
              <UInput
                  v-model="state.category"
                  placeholder="przygodowy, historyczny, itp."
                  size="xl"
                  class="w-full max-w-[400px]"
              />
            </UFormField>

            <!-- Fear Level -->
            <UFormField label="Jak bardzo ma być strasznie?" name="fearLevel">
              <UInput
                  v-model="state.fearLevel"
                  placeholder=""
                  size="xl"
                  class="w-full max-w-[400px]"
              />
            </UFormField>

            <!-- Audience / Occasion -->
            <UFormField label="Dla kogo/na jaką okazję?" name="occasion">
              <UInput
                  v-model="state.occasion"
                  placeholder=""
                  size="xl"
                  class="w-full max-w-[400px]"
              />
            </UFormField>

            <!-- Submit Button -->
            <UButton type="submit">
              Stwórz pokój i zacznij grę 🚀️
            </UButton>
          </UForm>
        </div>
      </div>
    </div>
  </UContainer>
</template>


<script setup>
import {object, string} from 'yup'
import {ref} from 'vue'

const schema = object({
  theme: string().min(8, 'Must be at least 8 characters').required('Required'),
  description: string().min(8, 'Must be at least 8 characters').required('Required'),
  difficultyLevel: string().min(4, 'Must be at least 4 characters').required('Required'),
  category: string().min(4, 'Must be at least 4 characters').required('Required'),
  fearLevel: string().min(4, 'Must be at least 4 characters').required('Required'),
  occasion: string().min(4, 'Must be at least 4 characters').required('Required'),
})

const state = reactive({
  theme: undefined,
  description: undefined,
  difficultyLevel: undefined,
  category: undefined,
  fearLevel: undefined,
  occasion: undefined
})

const formData = ref({
  gameLocation: '',
  additionalDetails: '',
  city: '',
  difficultyLevel: '',
  category: '',
  fearLevel: '',
  occasion: ''
})

const toast = useToast()

async function onSubmit(event) {
  toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
  console.log(event.data)
  console.log(formData.value)
}

const handleSubmit = () => {
  // Logic to handle form submission
  console.log(formData.value)

  toast.add({title: 'Success', description: 'The form has been submitted.', color: 'success'})
}
</script>

<style scoped>

</style>
