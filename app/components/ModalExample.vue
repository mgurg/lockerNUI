<script setup lang="ts">
const modal = useModal()

defineProps<{
  message: string
}>()

const emit = defineEmits(['success'])

function onSuccess() {
  emit('success')
  modal.close()
}
</script>

<template>
  <UModal :title="`${message}`">
    <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" label="Close" @click="modal.close()"/>
        <UButton label="OK" @click="onSuccess"/>
      </div>
    </template>
  </UModal>
</template>

