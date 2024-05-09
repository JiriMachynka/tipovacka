<script lang="ts" setup>
import { Eye, EyeOff } from 'lucide-vue-next';

const emit = defineEmits(['toggleShow']);

const props = defineProps<{ show: boolean; }>();
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