<template>
  <q-page padding v-if="order">
    <div class="text-center text-h6 row no-wrap">
      <div class="text-right col-6 q-mr-sm">#{{ order.id }}</div>
      <div
        class="text-overline text-italic"
        :class="
          orderStatusToText(order.status) == 'confirmedPaid'
            ? 'text-positive'
            : ''
        "
      >
        ({{ $t(orderStatusToText(order.status)) }})
      </div>
    </div>
    <div>{{ $t("name") }}: {{ order.round.item.name }}</div>
    <div>{{ $t("description") }}: {{ order.round.item.description }}</div>
    <div class="row q-gutter-x-sm">
      <q-btn v-for="details in order.rounds" :key="details.id" color="green">
        {{ toDigits(details.pivot.code) }}
      </q-btn>
    </div>
    <q-banner dense class="bg-primary text-white q-my-sm" rounded>
      {{ $t("amount") }} : {{ order.amount }}
    </q-banner>

    <q-banner dense rounded class="bg-grey-9 text-white">
      <template v-slot:avatar>
        <q-icon name="info" color="warning" />
      </template>
      {{ $t("expiresIn") }} : {{ timeRemaining }}
    </q-banner>
    <q-form @submit.prevent="submit" v-if="order.status != 3">
      <FileInput :multiple="false" v-model="picture" />
      <q-input :label="$t('note')" v-model="note" />
      <div class="q-mt-md">
        <q-btn
          :label="$t('pay')"
          no-caps
          class="full-width"
          color="positive"
          type="submit"
        />
      </div>
    </q-form>
    <div v-else>
      <q-img :src="order.screenshot" v-if="order.screenshot" />
    </div>
  </q-page>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import FileInput from "src/components/FileInput.vue";
import useUtil from "src/composables/util";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const { getDateDiff } = date;

const { notify } = useQuasar();
const route = useRoute();
const { toDigits, buildForm } = useUtil();
const { t } = useI18n();
const order = ref(null);
const getTimeRemaining = () => {
  const date = new Date(
    getDateDiff(new Date(order.value.expires_at), new Date(), "seconds") * 1000
  );

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const formattedSeconds = date.getUTCSeconds();
  const formattedTime = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(formattedSeconds).padStart(2, "0")}`;

  return formattedTime;
};

const picture = ref();
const note = ref("");
const submit = () => {
  if (!picture.value) {
    notify({
      message: t("youMustUploadPaymentScreenshot"),
      type: "warning",
    });
    return;
  }
  api({
    method: "post",
    url: `orders/${order.value.id}/pay`,
    data: buildForm({
      picture: picture.value,
      note: note.value,
    }),
    asForm: true,
  }).then(({ data }) => {
    order.value = data.order;
  });
};

const orderStatusToText = (status) => {
  switch (status) {
    case 1:
      return "pending";
    case 2:
      return "paid";
    case 3:
      return "confirmedPaid";
  }
};
const timeRemaining = ref();
let intervalId;

onMounted(() => {
  api({
    method: "GET",
    url: `orders/${route.params.id}`,
  }).then(({ data }) => {
    order.value = data.order;
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
