<template>
  <q-page>
    <q-form @submit.prevent="submit" class="q-ma-sm">
      <q-input label="Name" v-model="name" required autofocus />
      <q-input
        label="Max Tickets"
        v-model="max"
        type="number"
        mode="numeric"
        pattern="[0-9]*"
        required
      />
      <div class="text-right q-mt-sm">
        <q-btn label="Submit" no-caps flat />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const name = ref("");
const max = ref("100");

const submit = () => {};
</script>
