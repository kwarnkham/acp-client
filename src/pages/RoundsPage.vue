<template>
  <q-page padding :style-fn="vhPage" class="column no-wrap">
    <q-list
      padding
      dense
      bordered
      separator
      class="col overflow-auto"
      v-if="pagination"
    >
      <q-item
        v-for="round in pagination.data"
        :key="round.id"
        clickable
        v-ripple
        @click="
          $router.push({
            name: 'round-details',
            params: {
              id: round.id,
            },
          })
        "
      >
        <q-item-section>
          <q-item-label :class="{ 'text-positive': round.status == 2 }"
            >#{{ round.id }}</q-item-label
          >
          <q-item-label caption>{{ round.item.name }}</q-item-label>
          <q-item-label overline>{{ round.item.description }}</q-item-label>
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
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";

const { vhPage } = useUtil();

const { pagination, current, lastPage } = usePagination("rounds");
</script>
