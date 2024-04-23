<script setup lang="ts">
const colorMode = useColorMode();

const toggleTheme = () => {
	colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';
};
</script>
<template>
  <Button variant="outline" class="px-3" @click="toggleTheme">
    <Moon class="size-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 duration-700" />
    <Sun class="size-4.5 absolute rotate-90 scale-100 transition-all dark:rotate-90 dark:scale-0 duration-700" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>