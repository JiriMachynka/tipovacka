<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <th :class="cn('h-auto p-4 text-center text-xl align-middle font-bold text-muted-foreground [&:has([role=checkbox])]:pr-0', props.class)"> 
    <slot />
  </th>
</template>
