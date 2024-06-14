<script lang="ts" setup>
const emit = defineEmits(['toggleShow']);

const props = defineProps<{ show: boolean }>();
</script>
<template>
  <Button
    type="button"
    variant="ghost"
    class="absolute right-0"
    @click="emit('toggleShow')"
  >
    <Eye v-if="!props.show" />
    <EyeOff v-else />
  </Button>
</template>