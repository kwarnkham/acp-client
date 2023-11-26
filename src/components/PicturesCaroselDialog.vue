<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss maximized>
    <q-card class="q-dialog-plugin">
      <q-bar>
        <div class="text-right full-width">
          <q-btn dense flat icon="close" @click="onDialogCancel">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </div>
      </q-bar>
      <ItemPictureCarousel v-model="slide" :pictures="pictures" />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import ItemPictureCarousel from "./ItemPictureCarousel.vue";
import { ref } from "vue";

const props = defineProps({
  pictures: {
    type: Array,
    required: true,
  },
});

const slide = ref(props.pictures[0]?.id ?? 1);
defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>
