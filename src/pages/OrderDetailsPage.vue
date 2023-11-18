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
    <div class="text-subtitle2">
      <q-icon color="green" name="phone" size="sm" />{{ order.user.phone }}
    </div>
    <div>{{ $t("name") }}: {{ order.round.item.name }}</div>
    <div>{{ $t("description") }}: {{ order.round.item.description }}</div>
    <div class="row q-gutter-sm">
      <q-btn v-for="details in order.tickets" :key="details.id" color="green">
        {{
          toDigits(
            details.pivot.code,
            String(order.round.max_tickets).length - 1
          )
        }}
      </q-btn>
    </div>
    <q-banner dense class="bg-primary text-white q-my-sm" rounded>
      {{ $t("amount") }} : {{ order.amount }}
    </q-banner>

    <q-banner
      dense
      class="bg-info text-white q-my-sm"
      rounded
      v-if="order.note"
    >
      {{ $t("note") }} : {{ order.note }}
    </q-banner>

    <q-banner
      dense
      rounded
      class="bg-grey-9 text-white"
      v-if="[1].includes(order.status)"
    >
      <template v-slot:avatar>
        <q-icon name="info" color="warning" />
      </template>
      {{ $t("expiresIn") }} : {{ timeRemaining }}
    </q-banner>
    <q-form @submit.prevent="submit" v-if="[1, 2].includes(order.status)">
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
    <div v-if="order.screenshot" class="q-mt-xs">
      <q-img :src="order.screenshot" v-if="order.screenshot" />
    </div>
    <div class="q-pa-sm">
      <div class="text-center">Payments Methods</div>
      <div
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.id"
        class="q-mb-sm"
      >
        <div>{{ paymentMethod.name }}</div>
        <div class="row items-center text-info">
          <div>{{ paymentMethod.number }}</div>
          <q-btn
            icon="content_copy"
            no-caps
            flat
            round
            @click="copyNumber(paymentMethod.number)"
          />
        </div>
        <div><q-icon name="person" />{{ paymentMethod.account_name }}</div>
        <q-separator />
      </div>
    </div>
    <div
      class="q-mt-md row justify-evenly"
      v-if="[1, 2].includes(order.status)"
    >
      <q-btn
        :label="$t('cancel')"
        no-caps
        class="col-5"
        color="negative"
        @click="cancelOrder"
        v-if="appStore.getUser?.is_admin"
      />
      <q-btn
        :label="$t('confirm')"
        no-caps
        class="col-5"
        color="positive"
        @click="confirmOrder"
        v-if="appStore.getUser?.is_admin"
      />
    </div>
  </q-page>
</template>

<script setup>
import { copyToClipboard, date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import FileInput from "src/components/FileInput.vue";
import useApp from "src/composables/app";
import useUtil from "src/composables/util";
import { useAppStore } from "src/stores/app";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const { getDateDiff } = date;

const { notify, dialog } = useQuasar();
const route = useRoute();
const { toDigits, buildForm } = useUtil();
const { t } = useI18n();
const order = ref(null);
const { orderStatusToText } = useApp();
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

const paymentMethods = ref([]);

const picture = ref();
const note = ref("");
const appStore = useAppStore();

const copyNumber = (text) => {
  copyToClipboard(text).then(() => {
    notify({
      message: t("copied"),
      type: "info",
    });
  });
};

const confirmOrder = () => {
  dialog({
    title: t("areYouSure"),
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "post",
      url: `orders/${order.value.id}/confirm`,
    }).then(({ data }) => {
      order.value = data.order;
    });
  });
};

const cancelOrder = () => {
  dialog({
    title: t("areYouSure"),
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "post",
      url: `orders/${order.value.id}/cancel`,
    }).then(({ data }) => {
      order.value = data.order;
    });
  });
};
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
    picture.value = null;
    note.value = null;
  });
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
    if (order.value.status != 3)
      intervalId = setInterval(() => {
        timeRemaining.value = getTimeRemaining();
      }, 1000);
  });

  api({
    method: "GET",
    url: "payment-methods",
  }).then(({ data }) => {
    paymentMethods.value = data.payment_methods;
  });
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
