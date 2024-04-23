<script lang="ts" setup>
import { Info } from 'lucide-vue-next';
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Info class="size-5 stroke-slate-50" />
      </TooltipTrigger>
      <TooltipContent class="flex flex-col">
        <slot />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>