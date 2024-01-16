<template>
  <q-page padding :style-fn="vhPage" class="column no-wrap">
    <div class="text-center q-mb-sm q-gutter-x-sm">
      <q-btn
        flat
        @click="toggleStatusFromFilter(1)"
        :color="statusFilters.includes(1) ? 'positive' : 'grey'"
      >
        <q-spinner-radio size="sm" />
      </q-btn>
      <q-btn
        icon="check"
        flat
        @click="toggleStatusFromFilter(2)"
        :color="statusFilters.includes(2) ? 'positive' : 'grey'"
      />
      <q-btn
        icon="do_not_disturb_on"
        flat
        @click="toggleStatusFromFilter(3)"
        :color="statusFilters.includes(3) ? 'positive' : 'grey'"
      />
    </div>
    <div>
      <q-input
        v-model="id"
        placeholder="Search by round number"
        dense
        type="number"
        mode="numeric"
        pattern="[0-9]*"
      >
        <template v-slot:prepend>
          <q-icon name="tag" />
        </template>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
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
        class="q-my-xs"
        @click="
          $router.push({
            name: 'round-details',
            params: {
              id: round.id,
            },
          })
        "
      >
        <q-item-section avatar v-if="round.item.pictures.length">
          <q-img :src="round.item.pictures[0].name" />
        </q-item-section>
        <q-item-section>
          <q-item-label :class="{ 'text-positive': round.status == 2 }"
            >#{{ round.id }}</q-item-label
          >
          <q-item-label caption>{{ round.item.name }}</q-item-label>
          <q-item-label overline>{{ round.item.description }}</q-item-label>
          <q-linear-progress
            v-if="appStore.getUser?.is_admin"
            class="q-mt-xs"
            dark
            stripe
            rounded
            size="20px"
            color="positive"
            :value="round.progress_percentage / 100"
          >
            <div class="absolute-full flex flex-center">
              <q-badge
                color="white"
                text-color="primary"
                :label="round.progress_percentage + '%'"
              />
            </div>
          </q-linear-progress>
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
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { useAppStore } from "src/stores/app";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const { vhPage } = useUtil();
const appStore = useAppStore();

const route = useRoute();
const statusFilters = ref([1]);
const id = ref(route.query.id);

const toggleStatusFromFilter = (status) => {
  if (statusFilters.value.includes(status)) {
    if (statusFilters.value.length == 1) return;
    statusFilters.value.splice(
      statusFilters.value.findIndex((e) => e == status),
      1
    );
  } else statusFilters.value.push(status);
};

const { pagination, current, lastPage, updateQueryAndFetch } = usePagination(
  "rounds",
  {
    status: statusFilters.value.join(","),
    id: id.value ? id.value : undefined,
  }
);

watch(
  [id, statusFilters],
  debounce(() => {
    updateQueryAndFetch({
      status: statusFilters.value.join(","),
      id: id.value ? id.value : undefined,
    });
  }, 500),
  { deep: true }
);
</script>
