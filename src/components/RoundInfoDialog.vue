<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-pa-sm">
      <div class="row q-gutter-y-xs">
        <div
          class="col-12 text-h6 text-center"
          :class="{ 'bg-positive': round.status == 2 }"
        >
          {{ round.item.name }} : {{ $t("round") }} - {{ round.id }}
        </div>
        <div class="col-12" v-if="round.item?.description">
          {{ round.item.description }}
        </div>
        <div class="col-12">
          <span class="text-info"> {{ $t("totalNumberOfTickets") }} </span>:
          {{ round.max_tickets }}
        </div>
        <div class="col-12">
          <span class="text-info">{{ $t("pricePerTicket") }}</span> :
          {{ round.price_per_ticket }}
        </div>
        <div class="col-12" v-if="appStore.getUser?.is_admin">
          <span class="text-info">{{ $t("itemPrice") }}</span> :
          {{ round.price }}
        </div>
        <div class="col-12" v-if="round.note">
          <span class="text-info">{{ $t("note") }}</span> : {{ round.note }}
        </div>
        <div class="col-12">
          <span class="text-info">{{ $t("bookingExpiresIn") }}</span> :
          {{ round.expires_in }}
          {{ $t("minute", 2) }}
        </div>
        <div class="col-12 text-center text-overline">
          {{ round.order_details.filter((e) => e.status == 3).length }} /
          {{ round.max_tickets }}
        </div>
      </div>
      <div class="row justify-between q-mt-sm">
        <q-btn :label="$t('available')" no-caps dense />
        <q-btn
          :label="$t('selected')"
          no-caps
          color="green"
          v-if="appStore.getUser"
          dense
        />
        <q-btn :label="$t('booked')" no-caps color="orange" dense />
        <q-btn :label="$t('paid')" no-caps color="black" dense />
        <q-btn :label="$t('soldOut')" no-caps color="red" dense />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import { useAppStore } from "src/stores/app";

const props = defineProps({
  round: {
    type: Object,
    required: true,
  },
});

const appStore = useAppStore();

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
