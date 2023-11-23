<template>
  <div class="receipt rounded-borders column bg-yellow-1">
    <div class="col q-pa-sm">
      <div class="text-center text-subtitle1">
        {{ order.amount.toLocaleString() }} (Ks)
      </div>
      <q-separator spaced />

      <div class="q-gutter-xs row">
        <q-btn
          v-for="details in order.tickets"
          :key="details.id"
          :color="details.pivot.code == code ? 'purple' : 'green'"
        >
          {{
            toDigits(
              details.pivot.code,
              String(order.round.max_tickets).length - 1
            )
          }}
        </q-btn>
      </div>
      <div class="text-center text-weight-bold q-my-md">
        {{ order.round.item.name }}
      </div>
      <q-separator />
      <div class="q-mt-sm row justify-between">
        <div><q-icon name="sell" size="md" color="info" /></div>
        <div>{{ order.round.price_per_ticket.toLocaleString() }} (Ks)</div>
      </div>
      <q-separator />
      <div class="q-mt-sm row justify-between">
        <div><q-icon name="person" size="md" color="primary" /></div>
        <div>{{ order.user.display_name }}</div>
      </div>
      <q-separator />
      <div class="q-mt-sm row justify-between">
        <div><q-icon name="phone" size="md" color="green" /></div>
        <div>{{ order.user.phone }}</div>
      </div>
      <q-separator />
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
    </div>
    <div
      style="height: 50px"
      class="relative-position footer row items-center q-px-md justify-between"
    >
      <div class="font-great-vibes text-weight-bold">Lucky Mee Mee</div>
      <div class="font-great-vibes text-weight-bold">Thanks you</div>
    </div>
  </div>
</template>

<script setup>
import useUtil from "src/composables/util";

const { toDigits } = useUtil();
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
</script>

<style scoped lang="scss">
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
