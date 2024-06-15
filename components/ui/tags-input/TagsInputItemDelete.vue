<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { TagsInputItemDelete, type TagsInputItemDeleteProps, useForwardProps } from 'radix-vue';

const props = defineProps<TagsInputItemDeleteProps & { class?: HTMLAttributes['class'] }>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TagsInputItemDelete v-bind="forwardedProps" :class="cn('flex rounded bg-transparent mr-1', props.class)">
    <slot>
      <IconX class="size-4" />
    </slot>
  </TagsInputItemDelete>
</template>
