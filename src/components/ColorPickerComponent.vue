<script setup lang="ts">
const primary_color = defineModel<string>()
const props = defineProps<{
  default: string
  name:string
}>()

if (props.default) {
  primary_color.value = props.default
}

</script>

<template>
  <div>
    <UPopover>
      <UButton :label="props.name" color="neutral" variant="outline">
        <template #leading>
          <span :style="{ backgroundColor: primary_color }" class="size-3 rounded-full" />
        </template>
      </UButton>

      <template #content>
        <UColorPicker v-model="primary_color" class="p-2" />
      </template>
    </UPopover>
  </div>
</template>

<style scoped></style>
