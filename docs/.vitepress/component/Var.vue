<script setup lang="ts">

import {useVarStore} from "../StoreUtil";

const varStore = useVarStore()

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})

varStore.registerVars({ [props.name]: props.value })
</script>

<template>

</template>