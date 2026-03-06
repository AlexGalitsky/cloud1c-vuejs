<template>
  <div class="mb-4">
    <label v-if="label" class="text-body-2 font-weight-medium mb-2 d-block">
      {{ label }}
    </label>

    <div class="position-relative">
      <v-icon
        v-if="icon || $slots.icon"
        :icon="icon"
        class="position-absolute"
        style="left: 12px; top: 50%; transform: translateY(-50%); z-index: 1;"
      >
        <slot v-if="$slots.icon" name="icon" />
      </v-icon>

      <v-text-field
        :id="inputId"
        :type="computedType"
        v-model="model"
        :placeholder="placeholder"
        :required="required"
        :minlength="minlength"
        :disabled="disabled"
        :class="icon ? 'pl-10' : ''"
        v-bind="$attrs"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @change="$emit('change', $event)"
      />

      <v-icon
        v-if="type === 'password'"
        :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        class="position-absolute cursor-pointer"
        style="right: 12px; top: 50%; transform: translateY(-50%); z-index: 1;"
        @click="showPassword = !showPassword"
      />
    </div>

    <p v-if="hint || error" :class="['text-caption mt-1', error ? 'text-error' : 'text-medium-emphasis']">
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'

export interface AppInputProps {
  modelValue?: string
  type?: InputType
  label?: string
  placeholder?: string
  icon?: string
  hint?: string
  error?: string
  required?: boolean
  minlength?: number | string
  disabled?: boolean
  id?: string
}

const model = defineModel<string>({ required: false })

const props = withDefaults(defineProps<AppInputProps>(), {
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  change: [event: Event]
}>()

defineSlots<{
  icon?: () => any
}>()

defineOptions({
  inheritAttrs: false,
})

const generatedId = useId()
const inputId = computed(() => props.id || generatedId)
const showPassword = ref(false)
const computedType = computed(() => props.type === 'password' && showPassword.value ? 'text' : props.type)
</script>

<style scoped>
.pl-10 :deep(.v-field__input) {
  padding-left: 48px !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
