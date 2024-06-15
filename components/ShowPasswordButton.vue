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
    <IconEye v-if="!props.show" />
    <IconEyeOff v-else />
  </Button>
</template>