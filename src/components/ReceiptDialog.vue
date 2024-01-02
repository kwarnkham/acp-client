<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <div class="q-dialog-plugin"></div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";

const props = defineProps({});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>
