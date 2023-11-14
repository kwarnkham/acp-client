<template>
  <q-page padding class="row items-baseline justify-around">
    <q-card
      @click="
        $router.push({
          name: 'items',
        })
      "
    >
      <q-card-section>
        {{ $t("item", 2) }}
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
    <q-card>
      <q-card-section>
        {{ $t("user", 2) }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup></script>
