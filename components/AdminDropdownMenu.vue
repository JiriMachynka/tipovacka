<script lang="ts" setup>
interface AdminDropdownMenuProps {
	items: Array<{
		link: string;
		text: string;
	}>;
}

const props = defineProps<AdminDropdownMenuProps>();
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      :class="cn(buttonVariants({ variant: 'ghost' }),
        'w-full text-lg py-3 inline-flex items-center gap-2 group font-bold'
      )"
    >
      <span>Admin sekce</span>
      <IconChevronDown
        :size="20"
        class="transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180 group-data-[state=closed]:rotate-0"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent class="flex flex-col max-w-52 w-full">
      <DropdownMenuItem
        v-for="item in props.items"
        :key="item.text"
        :class="cn(buttonVariants({ variant: 'ghost' }), 'text-lg font-bold px-5 py-3 hover:cursor-pointer')"
        as-child
      >
        <NuxtLink :to="item.link">
          {{ item.text }}
        </NuxtLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>