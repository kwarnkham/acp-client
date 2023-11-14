<template>
  <q-page padding v-if="pagination" :style-fn="vhPage" class="column no-wrap">
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
  </q-page>
</template>

<script setup>
import useApp from "src/composables/app";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";

const { pagination } = usePagination("orders");
const { vhPage } = useUtil();
const { orderStatusToText } = useApp();
</script>
