<template>
  <div class="receipt rounded-borders column bg-yellow-1">
    <div class="col q-pa-sm">
      <div class="text-center text-subtitle1">
        {{ order.round.item.name }}
      </div>
      <q-separator spaced />
      <div class="text-center q-mt-sm">
        <q-img
          v-if="order.round.item.pictures.length"
          :src="order.round.item.pictures[0].name"
          fit="contain"
          height="120px"
          width="120px"
        >
          <q-img
            :src="$ASSETS_URL + '/assets/paid.png'"
            fit="contain"
            height="70px"
            width="70px"
            class="absolute-top-right"
            style="background-color: transparent"
        /></q-img>
      </div>

      <q-separator />
      <div class="row q-mt-sm no-wrap justify-between">
        <div class="row justify-between items-center">
          <div><q-icon name="person" size="md" color="primary" /></div>
          <div>{{ order.user.display_name }}</div>
        </div>
        <div class="row justify-between items-center">
          <div><q-icon name="phone" size="md" color="green" /></div>
          <div>{{ order.user.phone }}</div>
        </div>
      </div>
      <q-separator />
      <div class="q-mt-sm row justify-between items-center no-wrap">
        <div><q-icon name="place" size="md" color="info" /></div>
        <div>{{ order.user.address }}</div>
      </div>
      <q-separator spaced />
      <template v-if="order.round.settles_on">
        <div class="q-mt-sm row justify-between items-center text-red">
          <div>မဲဖွင့်မည့်ရက်</div>
          <div>{{ order.round.settles_on.split("-").reverse().join(".") }}</div>
        </div>
        <q-separator spaced />
      </template>

      <div class="q-gutter-xs row">
        <q-btn
          v-for="details in order.tickets"
          :key="details.id"
          :color="details.pivot.code == code ? 'purple' : 'green'"
          @click="protect(details.pivot)"
          class="relative-position"
        >
          {{
            toDigits(
              details.pivot.code,
              String(order.round.max_tickets).length - 1
            )
          }}

          <q-icon
            v-if="details.pivot.protected && appStore.getUser?.is_admin"
            name="health_and_safety"
            size="sm"
            color="deep-purple-9"
            class="absolute-top-right"
            style="transform: translate(7px, -7px)"
          />
        </q-btn>
      </div>
      <q-separator spaced />
      <div class="q-mt-sm row justify-between items-center">
        <div><q-icon name="paid" size="md" color="yellow-9" /></div>
        <div>{{ order.round.price_per_ticket.toLocaleString() }} (Ks)</div>
      </div>
    </div>
    <div
      style="height: 50px"
      class="relative-position footer row items-center q-px-md justify-center"
    >
      ကံကောင်းပါစေ ☘️
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import useUtil from "src/composables/util";
import { useAppStore } from "src/stores/app";

const { toDigits } = useUtil();
const { dialog } = useQuasar();
const emit = defineEmits(["ticketUpdated"]);
const appStore = useAppStore();
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  receiptBackground: {
    type: String,
    default: "white",
  },
  code: {
    type: Number,
    default: null,
  },
});

const protect = (ticket) => {
  dialog({
    title: "Confirm",
    message: `Do you want to "${
      ticket.protected ? "unprotect" : "protect"
    }" the ticket?`,
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `orders/tickets/${ticket.id}/toggle-protect`,
    }).then(({ data }) => {
      emit("ticketUpdated", data.ticket);
    });
  });
};
</script>

<style scoped lang="scss">
::v-deep(.q-badge--outline) {
  border: none;
}
.receipt {
  min-height: 400px;
  width: 80vw;
  max-width: 300px;
  border: 1px solid black;
}

.top-left-clipped {
  top: -10px;
  left: -10px;
  border-right: 1px solid black;
}

.clipped {
  width: 20px;
  height: 20px;
  border-radius: 100%;
  position: absolute;
  // background-color: $grey-3;
}

.top-right-clipped {
  top: -10px;
  right: -10px;
  border-left: 1px solid black;
}

.footer {
  border-top: 3px dashed #777777;
  font-size: 15px;
}
</style>
