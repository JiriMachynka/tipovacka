<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
	class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <td
    :class="
      cn(
        'px-0 py-1 align-middle [&:has([role=checkbox])]:pr-0 text-center text-lg', 
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>
