<template>
  <q-page padding v-if="round">
    <div>
      <div class="text-center text-h6">Available payments</div>
      <q-list separator bordered>
        <q-item
          v-for="payment in paymentMethods"
          :key="'p' + payment.id"
          :class="{
            'text-positive': round.payment_methods
              .map((e) => e.id)
              .includes(payment.id),
          }"
          clickable
          @click="togglePayment(payment.id)"
        >
          <q-item-section>
            <q-item-label>{{ payment.name }} </q-item-label>
            <q-item-label>{{ payment.number }} </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{ payment.account_name }} </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { dialog } = useQuasar();
const round = ref(null);
const route = useRoute();
const paymentMethods = ref([]);
const { t } = useI18n();
const togglePayment = (id) => {
  dialog({
    title: t("areYouSure"),
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `rounds/${round.value.id}/payment-methods/toggle`,
      data: {
        payment_method_id: id,
      },
    }).then(({ data }) => {
      round.value = data.round;
    });
  });
};
onMounted(() => {
  const roundId = route.params.id;
  api({
    method: "GET",
    url: `rounds/${roundId}`,
  }).then(({ data }) => {
    round.value = data.round;
  });

  api({
    method: "GET",
    url: "payment-methods",
  }).then(({ data }) => {
    paymentMethods.value = data.payment_methods;
  });
});
</script>
