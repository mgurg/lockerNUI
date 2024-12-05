<template>
  <div class="flex flex-col h-screen bg-gray-900 text-gray-100">
    <!-- Scrollable Content Area -->
    <div ref="scrollableContent" class="flex-1 overflow-y-auto p-6 mb-16">
      <!-- Header Section -->
      <div class="text-center">
        <h1 class="text-3xl font-extrabold text-sky-500">{{ theme }}</h1>
<!--        <p class="text-gray-400 text-sm">Let's start your escape room adventure!</p>-->
      </div>

      <!-- Intro -->
      <div class="mt-6 text-center space-y-4">
        <p class="max-w-xl mx-auto text-gray-300">{{ intro }}</p>
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
          <p class="text-gray-400 text-sm mb-4">
            {{
              isPuzzleCompleted ? "Kliknij Dalej, aby kontynuować" : "Wybierz działanie:"
            }}
          </p>

          <!-- Options -->
          <div class="max-w-md mx-auto space-y-2"
               v-if="!isPuzzleCompleted && options.length > 0">
            <ul class="space-y-2">
              <li
                  v-for="option in options"
                  :key="option.number"
                  class="text-gray-200 bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-sky-600 transition"
                  @click="submitAnswer(option.number)"
              >
                {{ option.number }}. {{ option.text }}
              </li>
              <li
                  class="text-gray-200 bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-sky-600 transition text-center"
                  @click="submitAnswer('hint')"
              >
                Hint
              </li>
            </ul>
          </div>

          <!-- Next Puzzle Button -->
          <div v-else class="text-center mt-4">
            <UButton size="lg" color="primary" @click="fetchPuzzle">
              Dalej
            </UButton>
          </div>
        </div>


        <!-- Game Finished Section -->
        <div class="mt-6 text-center" v-if="isGameFinished && gameEnding.length > 1">
          <h2 class="text-xl font-bold text-green-500">Gra skończona! 🎉</h2>
          <p class="text-gray-400">Kliknij i podziel się opinią.</p>
          <UButton
              size="lg"
              class="mt-4 bg-red-600 hover:bg-red-700 transition text-white"
              @click="redirectToExternalPage"
          >
            Play Again
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
} from "@/clienth/index.ts";

const toast = useToast();
const route = useRoute();
const router = useRouter()

// Game State
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

// Messages
const messages = ref([]);
const scrollableContent = ref(null);

// Computed Properties
const isPuzzleCompleted = computed(
    () => currentPuzzleNumber.value === lastSolvedPuzzleNumber.value
);
const isGameFinished = computed(() => lastSolvedPuzzleNumber.value === 4);

// Functions
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
  if (isGameFinished.value) {
    const response = await getEndingGamesEndingGameUuidGet({
      path: {game_uuid: uuid},
    });
    gameEnding.value = response?.data?.outro || "Thank you for playing!";
    addMessage(gameEnding.value);
    return;
  }

  try {
    const response = await getPuzzleGamesPuzzleGameUuidGet({
      path: {game_uuid: uuid},
    });

    console.log("Puzzle Response:", response?.data);

    scenario.value = response?.data?.scenario || "No scenario received";
    baseHint.value = response?.data?.base_hint || "No hints available";
    options.value = response?.data?.options || [];
    wrongFeedback.value = response?.data?.wrong_feedback || [];
    correctAnswer.value = response?.data?.correct || null;
    correctAnswerText.value = response?.data?.result || "Correct answer!";
    currentPuzzleNumber.value = response?.data?.current_puzzle || null;

    // Reset lastSolvedPuzzleNumber to ensure UI refresh
    lastSolvedPuzzleNumber.value = null;

    addMessage(scenario.value);
  } catch (error) {
    console.error("Error fetching puzzle:", error);
  }

  console.log({
    currentPuzzleNumber: currentPuzzleNumber.value,
    lastSolvedPuzzleNumber: lastSolvedPuzzleNumber.value,
    options: options.value
  });
};


const submitAnswer = async (answer) => {
  if (answer === "hint") {
    // Handle the hint action locally without making a request
    toast.add({
      title: baseHint.value || "No hints available.",
      icon: "i-lucide-lightbulb",
    });
    return;
  }

  try {
    // Send request with the user's answer to the server
    const response = await submitAnswerGamesAnswerGameUuidPost({
      path: {game_uuid: uuid},
      body: {choice: answer},
    });

    // Update state based on the server response
    const isCorrect = response?.data?.correct;
    const feedback = response?.data?.result;

    if (feedback === "You are trapped!") {
      // Game Over logic
      addMessage(feedback);
      isGameFinished.value = true;
      return;
    }

    if (isCorrect) {
      // Correct answer
      addMessage(response?.data?.message || correctAnswerText.value);
      lastSolvedPuzzleNumber.value = currentPuzzleNumber.value;
    } else {
      // Incorrect answer
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


// Messaging and Scrolling

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

// Style Helpers
const getMessageStyle = (index) => {
  if (index % 2 === 0) return "bg-gray-800 border-l-4 border-sky-500";
  return "bg-gray-700 border-l-4 border-green-500";
};

// Redirect to External Page
const redirectToExternalPage = async () => {
  await router.push({path: `/er_game/summary`, query: {uuid: uuid}});
};

// Initialize
onMounted(fetchIntro);
</script>

<style scoped>
/* Custom Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #4b5563; /* Dark gray */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #374151; /* Slightly darker */
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
