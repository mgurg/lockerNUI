<template>
  <UContainer>
    <div class="flex justify-center items-start min-h-screen py-10">
      <div class="flex flex-col gap-10 max-w-lg w-full">
        <div v-if="loading" class="text-sm font-mono text-gray-600 space-y-2">
          <div v-for="(message, index) in bootMessages" :key="index">{{ message }}</div>
        </div>
        <div v-else class="flex flex-col gap-4">
          <h1 class="text-2xl text-center">Wirtualny escape room w Twoim domu</h1>
          <div class="flex flex-col gap-4">
            <UForm
                :schema="schema"
                :state="state"
                @submit="onSubmit"
                class="space-y-4"
            >
              <!-- Game Location -->
              <UFormField label="Wprowadź motyw" name="theme">
                <UInput
                    v-model="state.theme"
                    maxlength=100
                    placeholder="opuszczona świątynia, stacja kosmiczna"
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Additional Details -->
              <UFormField label="Dodatkowe szczegóły/opis/'straszność' :)" name="description">
                <UTextarea
                    v-model="state.description"
                    maxlength=140
                    placeholder=""
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Difficulty Level -->
              <UFormField label="Poziom trudności" name="difficultyLevel">
                <UInput
                    v-model="state.difficultyLevel"
                    maxlength=100
                    placeholder=""
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Escape Room Category -->
              <UFormField label="Kategoria" name="category">
                <UInput
                    v-model="state.category"
                    maxlength=100
                    placeholder="przygodowy, historyczny, itp."
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Audience / Occasion -->
              <UFormField label="Dla kogo/na jaką okazję?" name="occasion">
                <UInput
                    v-model="state.occasion"
                    maxlength=100
                    placeholder=""
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Email Level -->
<!--              <UFormField label="E-mail (blokada botów, nie dostaniesz żadnej wiadomości)" name="confirmationMail">-->
<!--                <UInput-->
<!--                    v-model="state.confirmationMail"-->
<!--                    maxlength=100-->
<!--                    placeholder=""-->
<!--                    size="xl"-->
<!--                    class="w-full"-->
<!--                />-->
<!--              </UFormField>-->

              <!-- Submit Button -->
              <UButton type="submit" block>
                Stwórz pokój i zacznij grę 🚀️
              </UButton>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import {object, string} from 'yup'
import {reactive} from 'vue'
import {startGameGamesStartPost} from "@/clienth/index.ts";


const router = useRouter()
const toast = useToast()

// Validation schema
const schema = object({
  theme: string().min(8, 'Must be at least 8 characters').required('Required'),
  description: string().min(8, 'Must be at least 8 characters').required('Required'),
  difficultyLevel: string().min(4, 'Must be at least 4 characters').required('Required'),
  category: string().min(4, 'Must be at least 4 characters').required('Required'),
  confirmationMail: string().email('Must be a valid email').required('Required'),
  occasion: string().min(4, 'Must be at least 4 characters').required('Required'),
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

// Loading state and booting messages
const loading = ref(false);
const bootMessages = ref([
  "Initializing escape room...",

]);

// Function to update booting messages dynamically
function updateBootMessages() {
  const additionalMessages = [
    "Loading ancient temple textures...",
    "Configuring puzzles and traps...",
    "Calibrating difficulty level...",
    "Finalizing escape room setup...",
    "Loading virtual avatars...",
    "Encrypting secret keys...",
    "Generating storyline twists...",
    "Escape room ready in 3... 2... 1...",
  ];

  let counter = 0;
  const interval = setInterval(() => {
    if (counter < additionalMessages.length) {
      bootMessages.value.push(additionalMessages[counter]);
      counter++;
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

// Form submission handler
async function onSubmit() {
  loading.value = true;
  updateBootMessages();
  try {
    const response = await startGameGamesStartPost({
      body: {
        theme: state.theme,
        description: state.description,
        difficulty: state.difficultyLevel,
        category: state.category,
        occasion: state.occasion,
        email: state.confirmationMail || null,
      },
    });

    loading.value = false;

    if (response?.data?.uuid) {
      await router.push({ path: `/er_game/play`, query: { uuid: response.data.uuid } });
    } else {
      toast.add({
        title: 'Error',
        description: 'Game creation failed. Please try again.',
        color: 'error',
      });
    }
  } catch (error) {
    loading.value = false;
    console.error('Error submitting form:', error);
    toast.add({
      title: 'Error',
      description: 'An error occurred while submitting the form.',
      color: 'error',
    });
  }
}
</script>


<style scoped>
/* Adjust to ensure the container fits well on all screen sizes */
.min-h-screen {
  padding: 20px;
}
</style>
