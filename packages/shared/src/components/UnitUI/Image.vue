<template>
  <img :src="imgValue" class="smart-image" :data-id="data.props.cid" />
</template>
<script setup lang="ts">
import type { ComponentSchema } from '@shared/schema/component'
import { useUiConfig } from '@shared/composables/useUiConfig'
const props = defineProps<{
  data: ComponentSchema
}>()
useUiConfig(props.data.id)

//const imgValue = null

const imgValue = defineModel({
  default:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMTYsNDRINDBBMTIsMTIsMCwwLDAsMjgsNTZWMjAwYTEyLDEyLDAsMCwwLDEyLDEySDIxNmExMiwxMiwwLDAsMCwxMi0xMlY1NkExMiwxMiwwLDAsMCwyMTYsNDRaTTQwLDUySDIxNmE0LDQsMCwwLDEsNCw0VjE2OC40bC0zMi44OS0zMi44OWExMiwxMiwwLDAsMC0xNywwbC0yMi44MywyMi44My00Ni44Mi00Ni44M2ExMiwxMiwwLDAsMC0xNywwTDM2LDE1OVY1NkE0LDQsMCwwLDEsNDAsNTJaTTM2LDIwMFYxNzAuMzRsNTMuMTctNTMuMTdhNCw0LDAsMCwxLDUuNjYsMEwxODEuNjYsMjA0SDQwQTQsNCwwLDAsMSwzNiwyMDBabTE4MCw0SDE5M2wtNDAtNDAsMjIuODMtMjIuODNhNCw0LDAsMCwxLDUuNjYsMEwyMjAsMTc5LjcxVjIwMEE0LDQsMCwwLDEsMjE2LDIwNFpNMTQ4LDEwMGE4LDgsMCwxLDEsOCw4QTgsOCwwLDAsMSwxNDgsMTAwWiI+PC9wYXRoPjwvc3ZnPg==',
})
</script>
<style coped>
.default {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iIzAwMDAwMCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxwYXRoIGQ9Ik0yMTYsNDRINDBBMTIsMTIsMCwwLDAsMjgsNTZWMjAwYTEyLDEyLDAsMCwwLDEyLDEySDIxNmExMiwxMiwwLDAsMCwxMi0xMlY1NkExMiwxMiwwLDAsMCwyMTYsNDRaTTQwLDUySDIxNmE0LDQsMCwwLDEsNCw0VjE2OC40bC0zMi44OS0zMi44OWExMiwxMiwwLDAsMC0xNywwbC0yMi44MywyMi44My00Ni44Mi00Ni44M2ExMiwxMiwwLDAsMC0xNywwTDM2LDE1OVY1NkE0LDQsMCwwLDEsNDAsNTJaTTM2LDIwMFYxNzAuMzRsNTMuMTctNTMuMTdhNCw0LDAsMCwxLDUuNjYsMEwxODEuNjYsMjA0SDQwQTQsNCwwLDAsMSwzNiwyMDBabTE4MCw0SDE5M2wtNDAtNDAsMjIuODMtMjIuODNhNCw0LDAsMCwxLDUuNjYsMEwyMjAsMTc5LjcxVjIwMEE0LDQsMCwwLDEsMjE2LDIwNFpNMTQ4LDEwMGE4LDgsMCwxLDEsOCw4QTgsOCwwLDAsMSwxNDgsMTAwWiI+PC9wYXRoPjwvc3ZnPg==');
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgb(228 228 231 / var(--tw-text-opacity, 1));
  width: 7.5rem;
  height: 7.5rem;
  display: inline-block;
}
</style>
