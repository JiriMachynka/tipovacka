<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <IconInfo class="size-5 stroke-slate-50" />
      </TooltipTrigger>
      <TooltipContent class="flex flex-col">
        <slot />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>