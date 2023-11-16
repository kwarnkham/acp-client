<template>
  <q-page padding :style-fn="vhPage" class="column no-wrap">
    <q-input v-model="name" dense outlined class="q-mb-md">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-list bordered separator class="overflow-auto col">
      <q-item
        v-for="item in pagination?.data"
        :key="item.id"
        clickable
        @click="
          $router.push({
            name: 'item-details',
            params: {
              id: item.id,
            },
          })
        "
      >
        <q-item-section>
          <q-item-label>
            {{ item.name }}
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
    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
      v-if="appStore.getUser.is_admin"
    >
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="
          $router.push({
            name: 'create-item',
          })
        "
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { debounce, useQuasar } from "quasar";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { useAppStore } from "src/stores/app";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const { pagination, lastPage, current, updateQueryAndFetch } =
  usePagination("items");
const { vhPage } = useUtil();
const route = useRoute();
const name = ref(route.query.name || "");
const appStore = useAppStore();

watch(
  name,
  debounce(() => {
    updateQueryAndFetch({ name: name.value });
  }, 500)
);
</script>
