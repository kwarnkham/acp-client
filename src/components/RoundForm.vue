<template>
  <q-form @submit.prevent="submit" class="q-ma-sm q-gutter-y-sm">
    <q-input
      :label="$t('totalNumberOfTickets')"
      v-model="max"
      type="number"
      mode="numeric"
      pattern="[0-9]*"
      required
      v-if="!round"
    />
    <q-input
      :label="$t('pricePerTicket')"
      v-model="pricePerTicket"
      type="number"
      mode="numeric"
      pattern="[0-9]*"
      required
    />
    <q-input
      :label="$t('itemPrice')"
      v-model="price"
      type="number"
      mode="numeric"
      pattern="[0-9]*"
      required
    />
    <q-input
      :label="$t('bookingExpiresIn')"
      v-model="expires_in"
      type="number"
      mode="numeric"
      pattern="[0-9]*"
      required
    >
      <template v-slot:append>
        <span>{{ $t("minute", 2) }}</span>
      </template>
    </q-input>
    <q-input :label="$t('note')" v-model="note" autogrow outlined />
    <div class="text-right q-mt-sm">
      <q-btn :label="$t(round ? 'update' : 'create')" no-caps type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  round: {
    type: Object,
    default: () => null,
  },
  itemId: {
    type: Number,
    required: true,
  },
});

const max = ref("100");
const pricePerTicket = ref(props.round?.price_per_ticket ?? "");
const price = ref(props.round?.price ?? "");
const note = ref(props.round?.note ?? "");
const expires_in = ref(60);
const router = useRouter();

const submit = () => {
  api({
    method: "POST",
    url: "rounds",
    data: {
      max_tickets: max.value,
      price_per_ticket: pricePerTicket.value,
      price: price.value,
      note: note.value,
      expires_in: expires_in.value,
      item_id: props.itemId,
    },
  }).then(({ data }) => {
    router.push({
      name: "round-details",
      params: {
        id: data.round.id,
      },
    });
  });
};
</script>
