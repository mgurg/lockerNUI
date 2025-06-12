<template>
  <UContainer>
    <div class="flex justify-center items-start min-h-screen py-10">
      <div class="flex flex-col gap-10 max-w-lg w-full">
        <div v-if="loading" class="text-sm font-mono text-gray-600 space-y-2">
          <div v-for="(message, index) in bootMessages" :key="index">{{ message }}</div>
        </div>
        <div v-else class="flex flex-col gap-4">
          <h1 class="text-2xl text-center my-8">{{ t('erGame.title') }}</h1>
          <div class="flex flex-col gap-4">
            <UForm
                :schema="schema"
                :state="state"
                @submit="onSubmit"
                class="space-y-4"
            >
              <!-- Game Location -->
              <UFormField :label="t('erGame.form.theme')" name="theme">
                <UInput
                    v-model="state.theme"
                    maxlength=100
                    :placeholder="t('erGame.form.placeholders.theme')"
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Additional Details -->
              <UFormField :label="t('erGame.form.description')" name="description">
                <UTextarea
                    v-model="state.description"
                    maxlength=140
                    :placeholder="t('erGame.form.placeholders.description')"
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Difficulty Level -->
              <UFormField :label="t('erGame.form.difficultyLevel')" name="difficultyLevel">
                <UInput
                    v-model="state.difficultyLevel"
                    maxlength=100
                    placeholder=""
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Escape Room Category -->
              <UFormField :label="t('erGame.form.category')" name="category">
                <UInput
                    v-model="state.category"
                    maxlength=100
                    :placeholder="t('erGame.form.placeholders.category')"
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Audience / Occasion -->
              <UFormField :label="t('erGame.form.occasion')" name="occasion">
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
              <UButton type="submit">
                {{ t('erGame.buttons.createRoom') }}
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
import {startGameGamesStartPost} from "@/client/index.ts";
import {useI18n} from "vue-i18n";

const router = useRouter()
const localePath = useLocalePath()
const toast = useToast()
const { t } = useI18n();

const LATIN_SCRIPT_PATTERN = /^[\p{L}\p{N}\s\p{P}\p{Emoji}]*$/u;

const schema = object({
  theme: string().min(8, 'Must be at least 8 characters').matches(LATIN_SCRIPT_PATTERN, 'Must only contain Latin characters, numbers, and basic punctuation').required('Required'),
  description: string().min(8, 'Must be at least 8 characters').matches(LATIN_SCRIPT_PATTERN, 'Must only contain Latin characters, numbers, and basic punctuation').required('Required'),
  difficultyLevel: string().min(4, 'Must be at least 4 characters').matches(LATIN_SCRIPT_PATTERN, 'Must only contain Latin characters, numbers, and basic punctuation').required('Required'),
  category: string().min(4, 'Must be at least 4 characters').matches(LATIN_SCRIPT_PATTERN, 'Must only contain Latin characters, numbers, and basic punctuation').required('Required'),
  occasion: string().min(4, 'Must be at least 4 characters').matches(LATIN_SCRIPT_PATTERN, 'Must only contain Latin characters, numbers, and basic punctuation').required('Required'),
  // confirmationMail: string().email('Must be a valid email').required('Required'),
})

const state = reactive({
  theme: '',
  description: '',
  difficultyLevel: '',
  category: '',
  occasion: '',
  // confirmationMail: '',
})

const loading = ref(false);
const bootMessages = ref([
  t('erGame.messages.initializing'),
]);

function updateBootMessages() {
  const additionalMessages = [
    t('erGame.messages.loadingTextures'),
    t('erGame.messages.configuringPuzzles'),
    t('erGame.messages.calibratingDifficulty'),
    t('erGame.messages.finalizingSetup'),
    t('erGame.messages.loadingAvatars'),
    t('erGame.messages.encryptingKeys'),
    t('erGame.messages.generatingStoryline'),
    t('erGame.messages.readyCountdown'),
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
      await navigateTo({
        path: localePath('/er_game/play'),
        query: {uuid: response.data.uuid}
      });
    } else {
      toast.add({
        title: t('common.error'),
        description: t('erGame.messages.gameCreationFailed'),
        color: 'error',
      });
    }
  } catch (error) {
    loading.value = false;
    console.error('Error submitting form:', error);
    toast.add({
      title: t('common.error'),
      description: t('erGame.messages.formSubmissionError'),
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
