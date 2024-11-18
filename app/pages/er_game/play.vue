<template>
  <div class="flex flex-col h-screen bg-gray-900 text-gray-100">
    <!-- Scrollable Content Area -->
    <div
        ref="scrollableContent"
        class="flex-1 overflow-y-auto p-6 mb-16"
    >
      <!-- Header Section -->
      <div class="text-center">
        <img
            src="https://via.placeholder.com/100x100"
            alt="Logo"
            class="mx-auto mb-4 rounded-full"
        />
        <h1 class="text-2xl font-bold">Screen Shot to Code</h1>
        <p class="text-gray-400 text-sm">By Alwyn Bunsie</p>
      </div>

      <!-- Description Section -->
      <div class="mt-6 text-center space-y-4">
        <p class="max-w-xl mx-auto text-gray-300">
          This simple app converts a screenshot to code (HTML/Tailwind CSS, or React
          or Vue or Bootstrap). Upload your image, provide any additional
          instructions and say "Make it real!"
        </p>

        <!-- Long Text Section -->
        <div class="max-w-xl mx-auto text-gray-400 space-y-4">
          <p v-for="(message, index) in messages" :key="index">
            {{ message }}
          </p>
        </div>
      </div>
    </div>

    <!-- Fixed Input Section -->
    <div class="bg-gray-800 p-4 border-t border-gray-700 fixed bottom-0 left-0 w-full">
      <div class="flex items-center">
        <!-- File Upload Icon -->
        <button
            class="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600 text-gray-300"
            title="Upload"
        >
          📎
        </button>

        <!-- Text Input -->
        <!-- <div class="grid gap-4 grid-cols-5">
            <UButton to="https://github.com/nuxt/ui" target="_blank" size="xl">1</UButton>
            <UButton to="https://github.com/nuxt/ui" target="_blank" size="xl">2</UButton>
            <UButton to="https://github.com/nuxt/ui" target="_blank" size="xl">3</UButton>
            <UButton to="https://github.com/nuxt/ui" target="_blank" size="xl">HINT</UButton>
          </div> -->
        <UInput
            v-model="newMessage"
            @keyup.enter="addMessage"
            type="text"
            size="xl"
            class="flex-1 bg-gray-800 text-gray-300 placeholder-gray-500 px-4 py-2 ml-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Message Screen Shot to Code"
        />

        <!-- Submit Button -->
        <UButton
            @click="addMessage"
            class="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
        >
          Submit
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

// Reactive state
const messages = ref([
  "This app is designed to simplify your workflow.",
  "Simply upload your design files, provide instructions, and let the app do the work!",
  "Collaborate with your team and save time.",
]);
const newMessage = ref("");
const scrollableContent = ref(null);

// Function to add a new message
const addMessage = () => {
  if (newMessage.value.trim() !== "") {
    messages.value.push(newMessage.value.trim());
    newMessage.value = "";
    scrollToBottom();
  }
};

// Function to scroll to the bottom
const scrollToBottom = () => {
  nextTick(() => {
    const scrollable = scrollableContent.value;
    if (scrollable) {
      scrollable.scrollTop = scrollable.scrollHeight;
    }
  });
};

// Ensure content is scrolled to the bottom on mount
scrollToBottom();
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
</style>