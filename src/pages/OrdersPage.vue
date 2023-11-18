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
    <div class="row justify-evenly q-my-xs">
      <q-btn
        :label="$t(orderStatusToText(1))"
        no-caps
        @click="filterStatus(1)"
        :color="filteredStatuses.includes(1) ? 'primary' : 'grey'"
        dense
      />
      <q-btn
        :label="$t(orderStatusToText(2))"
        no-caps
        @click="filterStatus(2)"
        :color="filteredStatuses.includes(2) ? 'primary' : 'grey'"
        dense
      />
      <q-btn
        :label="$t(orderStatusToText(3))"
        no-caps
        @click="filterStatus(3)"
        :color="filteredStatuses.includes(3) ? 'primary' : 'grey'"
        dense
      />
      <q-btn
        :label="$t(orderStatusToText(4))"
        no-caps
        @click="filterStatus(4)"
        :color="filteredStatuses.includes(4) ? 'primary' : 'grey'"
        dense
      />
      <q-btn
        :label="$t(orderStatusToText(5))"
        no-caps
        @click="filterStatus(5)"
        :color="filteredStatuses.includes(5) ? 'primary' : 'grey'"
        dense
      />
    </div>
    <q-list padding dense bordered separator class="col overflow-auto">
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
const filteredStatuses = ref(
  route.query.status.split(",").map((e) => Number(e))
);
const filterStatus = (status) => {
  const index = filteredStatuses.value.findIndex((e) => e == status);
  if (index != -1) filteredStatuses.value.splice(index, 1);
  else filteredStatuses.value.push(status);
};

watch(
  [roundId, phone, filteredStatuses],
  debounce(() => {
    updateQueryAndFetch({
      round_id: roundId.value,
      phone: phone.value,
      status: filteredStatuses.value.join(","),
    });
  }, 500),
  {
    deep: true,
  }
);
</script>
