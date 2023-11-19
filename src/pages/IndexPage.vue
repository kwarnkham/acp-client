<template>
  <q-page padding class="row items-baseline justify-around">
    <q-card
      @click="
        $router.push({
          name: 'items',
        })
      "
      v-if="appStore.getUser?.is_admin"
    >
      <q-card-section>
        {{ $t("item", 2) }}
      </q-card-section>
    </q-card>
    <q-card
      @click="
        $router.push({
          name: 'rounds',
        })
      "
    >
      <q-card-section>
        {{ $t("round", 2) }}
      </q-card-section>
    </q-card>
    <q-card
      @click="
        $router.push({
          name: 'orders',
        })
      "
    >
      <q-card-section>
        {{ $t("order", 2) }}
      </q-card-section>
    </q-card>
    <q-card
      v-if="appStore.getUser?.is_admin"
      @click="
        $router.push({
          name: 'users',
        })
      "
    >
      <q-card-section>
        {{ $t("user", 2) }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useAppStore } from "src/stores/app";

const appStore = useAppStore();
</script>
