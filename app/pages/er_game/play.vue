<template>
  <div class="flex flex-col h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 px-3 sm:px-6">
    <!-- Scrollable Content Area -->
    <div
        ref="scrollableContent"
        class="flex-1 overflow-y-auto p-6 mb-16"
    >
      <!-- Header Section -->
      <div class="text-center">
        <h1 class="text-3xl font-extrabold capitalize text-sky-600 dark:text-sky-400">
          {{ theme }}
        </h1>
      </div>

      <!-- Intro -->
      <div class="mt-6 text-center space-y-4">
        <p class="max-w-xl mx-auto">
          {{ intro }}
        </p>
        <!-- Messages Section -->
        <div class="max-w-xl mx-auto mt-4 space-y-4">
          <p
              v-for="(message, index) in messages"
              :key="index"
              class="p-4 rounded-lg"
              :class="getMessageStyle(index)"
          >
            {{ message }}
          </p>
        </div>

        <!-- Options and Actions -->
        <div v-if="!isGameFinished || gameEnding.length === 0" class="mt-6">
          <p class="text-sm mb-4 text-gray-600 dark:text-gray-400">
            {{ isPuzzleCompleted ? "Kliknij Dalej, aby kontynuować" : "Wybierz działanie:" }}
          </p>

          <!-- Options -->
          <div class="max-w-md mx-auto space-y-2" v-if="!isPuzzleCompleted && options.length > 0">
            <ul class="space-y-2">
              <li
                  v-for="option in options"
                  :key="option.number"
                  class="p-3 rounded-lg cursor-pointer transition bg-gray-200 text-gray-900 hover:bg-sky-600 hover:text-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-sky-500"
                  @click="submitAnswer(option.number)"
              >
                {{ option.number }}. {{ option.text }}
              </li>
              <li
                  class="p-3 rounded-lg cursor-pointer transition text-center bg-gray-200 text-gray-900 hover:bg-sky-600 hover:text-white dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-sky-500"
                  @click="submitAnswer('hint')"
              >
                Podpowiedź
              </li>
            </ul>
          </div>

          <!-- Next Puzzle Button -->
          <div v-else class="text-center mt-4">
            <UButton
                size="lg"
                color="primary"
                @click="fetchPuzzle"
                :loading="loading"
            >
              Dalej
            </UButton>
          </div>
        </div>

        <!-- Game Finished Section -->
        <div class="mt-6 text-center" v-if="isGameFinished && gameEnding.length > 1">
          <h2 class="text-xl font-bold text-green-500">Gra skończona! 🎉</h2>
          <UButton
              size="lg"
              class="mt-4 bg-red-600 hover:bg-red-700 transition text-white"
              @click="redirectToExternalPage"
          >
            Kliknij i podziel się opinią
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import {computed, nextTick, ref} from "vue";
import {useRoute} from "vue-router";
import {
  getEndingGamesEndingGameUuidGet,
  getIntroGamesIntroGameUuidGet,
  getPuzzleGamesPuzzleGameUuidGet,
  submitAnswerGamesAnswerGameUuidPost,
} from "@/client/index.ts";

const toast = useToast();
const localePath = useLocalePath()
const route = useRoute();

const loading = ref(false);
const intro = ref("");
const theme = ref("");
const uuid = route.query.uuid;

const scenario = ref("");
const baseHint = ref("");
const options = ref([]);
const wrongFeedback = ref([]);
const correctAnswer = ref(null);
const correctAnswerText = ref("");
const currentPuzzleNumber = ref(null);
const lastSolvedPuzzleNumber = ref(null);
const gameEnding = ref("");

const messages = ref([]);
const scrollableContent = ref(null);

const isPuzzleCompleted = computed(
    () => currentPuzzleNumber.value === lastSolvedPuzzleNumber.value
);
const isGameFinished = computed(() => lastSolvedPuzzleNumber.value === 4);

const fetchIntro = async () => {
  try {
    const response = await getIntroGamesIntroGameUuidGet({
      path: {game_uuid: uuid},
    });
    intro.value = response?.data?.intro || "Coś poszło nie tak :/";
    theme.value = response?.data?.theme || "Błąd ładowania gry";
  } catch (error) {
    console.error("Error fetching intro:", error);
  }
};

const fetchPuzzle = async () => {
  loading.value = true;
  if (isGameFinished.value) {
    const response = await getEndingGamesEndingGameUuidGet({
      path: {game_uuid: uuid},
    });
    gameEnding.value = response?.data?.outro || "Thank you for playing!";
    addMessage(gameEnding.value);
    loading.value = false;
    return;
  }

  try {
    const response = await getPuzzleGamesPuzzleGameUuidGet({
      path: {game_uuid: uuid},
    });

    scenario.value = response?.data?.scenario || "No scenario received";
    baseHint.value = response?.data?.base_hint || "No hints available";
    options.value = response?.data?.options || [];
    wrongFeedback.value = response?.data?.wrong_feedback || [];
    correctAnswer.value = response?.data?.correct || null;
    correctAnswerText.value = response?.data?.result || "Correct answer!";
    currentPuzzleNumber.value = response?.data?.current_puzzle || null;

    lastSolvedPuzzleNumber.value = null;

    addMessage(scenario.value);
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error("Error fetching puzzle:", error);
  }
};


const submitAnswer = async (answer) => {
  if (answer === "hint") {
    toast.add({
      title: baseHint.value || "No hints available.",
      icon: "i-lucide-lightbulb",
    });
    return;
  }

  try {
    const response = await submitAnswerGamesAnswerGameUuidPost({
      path: {game_uuid: uuid},
      body: {choice: answer},
    });

    const isCorrect = response?.data?.correct;
    const feedback = response?.data?.result;

    if (feedback === "You are trapped!") {
      addMessage(feedback);
      isGameFinished.value = true;
      return;
    }

    if (isCorrect) {
      addMessage(response?.data?.message || correctAnswerText.value);
      lastSolvedPuzzleNumber.value = currentPuzzleNumber.value;
    } else {
      toast.add({
        title: feedback,
        icon: "i-lucide-alert-triangle",
      });
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
    toast.add({
      title: "Failed to submit answer. Please try again.",
      icon: "i-lucide-alert-triangle",
    });
  }
};

const addMessage = async (message) => {
  if (message.trim()) {
    messages.value.push(message.trim());
    await nextTick();
    scrollToBottom();
  }
};


const scrollToBottom = () => {
  nextTick(() => {
    const scrollable = scrollableContent.value;
    if (scrollable) {
      scrollable.scrollTop = scrollable.scrollHeight;
    }
  });
};

const getMessageStyle = (index) => {
  return [
    "border-l-4 p-4 rounded-lg",
    index % 2 === 0
        ? "bg-gray-300 text-gray-900 border-sky-500 dark:bg-gray-800 dark:text-gray-100"
        : "bg-gray-200 text-gray-900 border-green-500 dark:bg-gray-700 dark:text-gray-100",
  ].join(" ");
};

const redirectToExternalPage = async () => {
  await navigateTo({
    path: localePath('/er_game/summary'),
    query: {uuid: uuid}
  });
};

onMounted(fetchIntro);
</script>

<style scoped>
/* Custom Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #d1d5db; /* Light gray for light mode */
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* Dark gray for dark mode */
}

/* Ensure message contrast */
.bg-gray-800 {
  color: #ffffff; /* White text for contrast in dark mode */
}

.dark .bg-gray-700 {
  color: #e5e7eb; /* Lighter text in dark mode */
}

/* Add spacing and styles for better appearance */
.puzzle-options li {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.puzzle-options li:hover {
  background-color: #3b82f6; /* Sky blue */
  color: #fff;
}
</style>

