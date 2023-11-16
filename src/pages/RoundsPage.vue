<template>
  <q-page padding>
    <q-list padding dense bordered separator class="col" v-if="pagination">
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
          <q-item-label :class="{ 'text-positive': round.ticket != null }"
            >#{{ round.id }}</q-item-label
          >
          <q-item-label caption>{{ round.item.name }}</q-item-label>
          <q-item-label overline>{{ round.item.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import usePagination from "src/composables/pagination";

const { pagination } = usePagination("rounds");
</script>
