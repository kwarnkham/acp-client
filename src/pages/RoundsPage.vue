<template>
  <q-page padding :style-fn="vhPage" class="column no-wrap">
    <div class="text-center q-mb-sm">
      <q-btn
        label="မပြိးသေးသော round များသာ"
        @click="onlyOngoing = !onlyOngoing"
        :color="onlyOngoing ? 'primary' : 'grey'"
        no-caps
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
import { ref, watch } from "vue";

const { vhPage } = useUtil();

const { pagination, current, lastPage, updateQueryAndFetch } =
  usePagination("rounds");
const onlyOngoing = ref(true);
const id = ref("");

watch(
  [onlyOngoing, id],
  debounce(() => {
    updateQueryAndFetch({
      status: onlyOngoing.value ? 1 : undefined,
      id: id.value ? id.value : undefined,
    });
  }, 500)
);
</script>
