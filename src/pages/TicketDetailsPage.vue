<template>
  <q-page padding v-if="ticket">
    <div class="text-center text-h6">{{ toDigits(ticket.code) }}</div>
    <div>
      {{ timeRemaining }}
    </div>
  </q-page>
</template>

<script setup>
import { date } from "quasar";
import { api } from "src/boot/axios";
import useUtil from "src/composables/util";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const { getDateDiff } = date;

const route = useRoute();
const { toDigits } = useUtil();
const ticket = ref(null);
const getTimeRemaining = () => {
  const date = new Date(
    getDateDiff(
      new Date(ticket.value.current_user.pivot.expires_at),
      new Date(),
      "seconds"
    ) * 1000
  );

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const formattedSeconds = date.getUTCSeconds();
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(formattedSeconds).padStart(2, "0")}`;

  return formattedTime;
};
const timeRemaining = ref();
let intervalId;

onMounted(() => {
  api({
    method: "GET",
    url: `tickets/${route.params.id}`,
  }).then(({ data }) => {
    ticket.value = data.ticket;
    timeRemaining.value = getTimeRemaining();
    intervalId = setInterval(() => {
      timeRemaining.value = getTimeRemaining();
    }, 1000);
  });
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>
