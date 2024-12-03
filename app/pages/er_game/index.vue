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
            <UFormField label="Dodatkowe szczegóły/opis/'straszność' :)" name="description">
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

            <!-- Audience / Occasion -->
            <UFormField label="Dla kogo/na jaką okazję?" name="occasion">
              <UInput
                  v-model="state.occasion"
                  placeholder=""
                  size="xl"
                  class="w-full max-w-[400px]"
              />
            </UFormField>

            <!-- Email Level -->
            <UFormField label="E-mail (blokada botów, nie dostaniesz żadnej wiadomości)" name="confirmationMail">
              <UInput
                  v-model="state.confirmationMail"
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
import {ref, reactive} from 'vue'
import {GamesService} from "@/client"


const router = useRouter()
const toast = useToast()

// Validation schema
const schema = object({
  theme: string().min(8, 'Must be at least 8 characters').required('Required'),
  description: string().min(8, 'Must be at least 8 characters').required('Required'),
  // difficultyLevel: string().min(4, 'Must be at least 4 characters').required('Required'),
  // category: string().min(4, 'Must be at least 4 characters').required('Required'),
  // confirmationMail: string().email('Must be a valid email').required('Required'),
  // occasion: string().min(4, 'Must be at least 4 characters').required('Required'),
})

// Form state
const state = reactive({
  theme: 'starożytna świątynia',
  description: 'gra z motywami humorystycznymi',
  difficultyLevel: '',
  category: '',
  confirmationMail: '',
  occasion: '',
})

// Form submission handler
async function onSubmit() {
  // await router.push({path: `/er_game/play`, query: {uuid: "3d49a241-fc16-4d49-8192-89827f9a7648"}});
  // return;
  try {
    const requestBody = {
      theme: state.theme,
      description: state.description,
      difficulty: state.difficultyLevel,
      category: state.category,
      occasion: state.occasion,
      email: state.confirmationMail || null,
    }

    const response = await GamesService.postTestGamesTestPost(requestBody)

    if (response?.uuid) {
      await router.push({name: "GamePage", params: {gameUuid: response.uuid}});
    } else {
      toast.add({
        title: "Error",
        description: "Game creation failed. Please try again.",
        color: "error",
      });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.add({
      title: "Error",
      description: "An error occurred while submitting the form.",
      color: "error",
    });
  }
}
</script>


<style scoped>

</style>
