<template>
  <q-page padding v-if="pagination" :style-fn="vhPage" class="column no-wrap">
    <q-input
      dense
      v-model="roundId"
      type="number"
      mode="numeric"
      pattern="[0-9]*"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-input dense v-model="phone" type="tel">
      <template v-slot:append>
        <q-icon name="phone" />
      </template>
    </q-input>
    <q-list padding dense bordered separator class="col">
      <q-item
        v-for="order in pagination.data"
        :key="order.id"
        clickable
        v-ripple
        @click="
          $router.push({
            name: 'order-details',
            params: {
              id: order.id,
            },
          })
        "
      >
        <q-item-section>
          <q-item-label>#{{ order.id }}</q-item-label>
          <q-item-label caption>{{ order.round.item.name }}</q-item-label>
          <q-item-label overline>
            <q-icon name="phone" color="green" size="sm" />
            {{ order.user.phone }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ order.amount }}</q-item-label>
          <q-item-label
            caption
            :class="{
              'text-green': order.status == 3,
              'text-info': order.status == 2,
              'text-warning': order.status == 4,
              'text-negative': order.status == 5,
            }"
          >
            {{ $t(orderStatusToText(order.status)) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div
      class="row justify-center full-width"
      :class="{
        hidden: current == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="lastPage" input />
    </div>
  </q-page>
</template>

<script setup>
import { debounce } from "quasar";
import useApp from "src/composables/app";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const { pagination, updateQueryAndFetch, current, lastPage } =
  usePagination("orders");
const { vhPage } = useUtil();
const { orderStatusToText } = useApp();
const route = useRoute();
const roundId = ref(route.query.round_id ?? "");
const phone = ref(route.query.phone ?? "");

watch(
  [roundId, phone],
  debounce(() => {
    updateQueryAndFetch({ round_id: roundId.value, phone: phone.value });
  }, 500)
);
</script>
