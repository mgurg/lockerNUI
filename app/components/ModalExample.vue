<script setup lang="ts">

defineProps<{
  description: string
  message: string
}>()

// const emit = defineEmits(['success'])
const emit = defineEmits<{ close: [boolean], success: [] }>()

function onSuccess() {
  // Emit 'close' event to close the modal
  emit('success')

  emit('close', true)

  // Emit 'success' event to notify the parent that the action was confirmed
}
</script>

<template>
  <UModal :title="description" :description="message" :close="{ onClick: () => emit('close', false) }">
    <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" label="Close" @click="emit('close', false)"/>
        <UButton label="OK" @click="onSuccess" />
      </div>
    </template>
  </UModal>
</template>

