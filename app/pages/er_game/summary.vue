<template>
  <UContainer>
    <div class="flex justify-center items-start min-h-screen py-10">
      <div class="flex flex-col gap-10 max-w-lg w-full">
        <div class="flex flex-col gap-4">
          <h1 class="text-2xl text-center">{{ t('erGame.title') }}</h1>
          <div class="flex flex-col gap-4">
            <UForm
                :schema="schema"
                :state="state"
                @submit="onSubmit"
                class="space-y-4"
            >
              <!-- Additional Details -->
              <UFormField :label="t('erGame.summary.reviewLabel')" name="reviewText">
                <UTextarea
                    v-model="state.reviewText"
                    maxlength=140
                    placeholder=""
                    size="xl"
                    class="w-full"
                />
              </UFormField>

              <!-- Rating -->
              <UFormField :label="t('erGame.summary.ratingLabel')" name="rating">
                <div class="grid gap-4 grid-cols-5">
                  <UButton
                      v-for="rating in [1, 2, 3, 4, 5]"
                      :key="rating"
                      @click="state.rating = rating"
                      :class="{'bg-primary text-white': state.rating === rating}"
                  >
                    {{ rating }}
                  </UButton>
                </div>
              </UFormField>

              <!-- Submit Button -->
              <UButton type="submit" block>
                {{ t('erGame.buttons.shareOpinion') }}
              </UButton>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </UContainer>
</template>

<script setup>
import {useRoute, useRouter} from "#vue-router";
import {reactive} from "vue";
import {useI18n} from "vue-i18n";
import {addReviewGamesReviewGameUuidPost} from "@/client/index.ts";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const uuid = route.query.uuid;

const state = reactive({
  reviewText: '',
  rating: 0,
});

async function onSubmit() {
  try {
    const response = await addReviewGamesReviewGameUuidPost({
      path: {game_uuid: uuid},
      body: {
        text: state.reviewText,
        score: state.rating,
      },
    });
    await router.push({path: `/er_game`});
  } catch (error) {
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
.bg-primary {
  background-color: #3498db; /* Example primary color */
}

.text-white {
  color: #fff;
}
</style>
