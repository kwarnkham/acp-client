<template>
  <q-page padding>
    <PaymentForm v-if="paymentMethod" :payment-method="paymentMethod" />
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import PaymentForm from "src/components/PaymentForm.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const paymentMethod = ref(null);
onMounted(() => {
  api({
    method: "GET",
    url: `payment-methods/${route.params.id}`,
  }).then(({ data }) => {
    paymentMethod.value = data.payment_method;
  });
});
</script>
