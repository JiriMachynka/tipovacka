<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { ToastTitle, type ToastTitleProps } from 'radix-vue';

const props = defineProps<ToastTitleProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});
</script>

<template>
  <ToastTitle v-bind="delegatedProps" :class="cn('text-sm font-semibold', props.class)">
    <slot />
  </ToastTitle>
</template>
