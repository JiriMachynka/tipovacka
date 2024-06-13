<script lang="ts" setup>
import { ComboboxAnchor, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue';
import { onClickOutside } from '@vueuse/core';

const emit = defineEmits(['refresh']);

const props = defineProps<{ tournamentId: number }>();

const { $client } = useNuxtApp();

const { toast } = useToast();

const { data: allUsers, refresh: refreshUsers } = await $client.user.getAll.useQuery({ tournamentId: props.tournamentId });

const { mutate: addPlayer } = $client.player.add.useMutation();

const modelValue = ref<string[]>([]);
const open = ref(false);
const searchTerm = ref('');

const filteredUsers = computed(() => allUsers.value?.filter((u) => !modelValue.value.includes(u.username)) || []);

const tagsInputRef = ref(null);
onClickOutside(tagsInputRef, () => (open.value = false));

const handleAddPlayers = () => {
	modelValue.value.map(async (username) => {
		await addPlayer({
			tournamentId: props.tournamentId,
			username,
		});
	});

	toast({
		title: 'Přidání hráčů',
		description: 'Hráči byli úspěšně přidáni',
		duration: 1200,
	});

	refreshUsers();
	setTimeout(() => emit('refresh'), 300);

	modelValue.value = [];
};
</script>
<template>
  <div class="w-full max-w-xl mx-auto flex flex-col gap-4">
    <TagsInput ref="tagsInputRef" class="px-0 gap-0 w-full" :model-value="modelValue">
      <div class="flex gap-2 flex-wrap items-center px-3">
        <TagsInputItem
          v-for="user in modelValue"
          :key="user"
          :value="user"
        >
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      </div>
      <ComboboxRoot v-model="modelValue" v-model:open="open" v-model:searchTerm="searchTerm" class="w-full">
        <ComboboxAnchor as-child>
          <ComboboxInput placeholder="Uživatel..." as-child>
            <TagsInputInput
              class="w-full px-3"
              :class="modelValue.length > 0 ? 'mt-2' : ''"
              @keydown.enter.prevent
            />
          </ComboboxInput>
        </ComboboxAnchor>
        <ComboboxPortal>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty />
            <CommandGroup>
              <CommandItem
                v-for="user in filteredUsers"
                :key="user.username"
                :value="user.username"
                @select.prevent="(ev) => {
                  if (typeof ev.detail.value === 'string') {
                    searchTerm = ''
                    modelValue.push(ev.detail.value)
                  }

                  if (filteredUsers.length === 0) {
                    open = false
                  }
                }"
              >
                {{ user.username }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxPortal>
      </ComboboxRoot>
    </TagsInput>
    <Button
      type="button"
      class="w-full text-xl"
      @click="handleAddPlayers"
    >
      Přidat hráče
    </Button>
  </div>
</template>