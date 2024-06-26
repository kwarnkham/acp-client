<template>
  <q-page
    padding
    v-if="order"
    class="relative-position"
    :class="{ 'bg-grey-3': order.status == 3 }"
  >
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
      <q-btn
        icon="file_copy"
        @click="copyNumber(order.user.phone)"
        flat
        class="q-ml-sm text-primary"
      />
    </div>
    <div class="text-subtitle2">
      <q-icon color="primary" name="person" size="sm" />{{
        order.user.display_name
      }}
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
    <q-form @submit.prevent="submit" v-if="[1].includes(order.status)">
      <FileInput
        :multiple="false"
        v-model="picture"
        label="ငွေလွဲ စခရင်ရှော့ကို ဒီမှာထည့်ပေးပါနော်"
      />

      <q-input
        :label="$t('note')"
        v-model="note"
        hint="Note မထည့်လဲရပါတယ်နော်"
      />
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
    <div v-else-if="order.status == 2" class="text-left">
      ဒီအဆင့်ထိရောက်ပြီဆိုရင် ရပါပြီ။ ငွေလွဲရောက်တာကို စစ်ပြီး အက်ဒမင်ဖက်က
      အတည်ပြုပေးပါမည်။
    </div>
    <div v-if="order.screenshot && order.status != 3" class="q-mt-xs">
      <q-img :src="order.screenshot" v-if="order.screenshot" />
    </div>
    <q-list class="q-pa-sm" separator>
      <div class="text-center">Payments Methods</div>

      <q-item
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.id"
        class="q-mb-sm"
      >
        <q-item-section avatar>
          <q-img :src="paymentMethod.picture" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ paymentMethod.name }}</q-item-label>
          <q-item-label>{{ paymentMethod.number }}</q-item-label>
          <q-item-label overline>{{ paymentMethod.account_name }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn
            icon="content_copy"
            @click="copyNumber(paymentMethod.number)"
            class="text-primary"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-form
      @submit.prevent="confirmOrder"
      class=""
      v-if="[1, 2].includes(order.status)"
    >
      <q-input
        label="Discount"
        v-model="discount"
        v-if="appStore.getUser?.is_admin"
        type="number"
        mode="numeric"
        pattern="[0-9]*"
        :rules="[
          (val) => val <= order.amount || 'Must be less than total amount',
        ]"
      />
      <div class="q-mt-md row justify-evenly">
        <q-btn
          :label="$t('cancel')"
          no-caps
          class="col-5"
          color="negative"
          @click="cancelOrder"
          v-if="appStore.getUser?.is_admin"
        />
        <q-btn
          type="submit"
          :label="$t('confirm')"
          no-caps
          class="col-5"
          color="positive"
          v-if="appStore.getUser?.is_admin"
        />
      </div>
    </q-form>

    <template v-if="order.status == 3 && showReceipt">
      <div
        class="fit absolute-center"
        style="background-color: rgba(0, 0, 0, 0.5)"
      ></div>
      <q-btn
        icon="close"
        class="absolute-top-right"
        color="info"
        v-if="appStore.getUser?.is_admin"
        @click="showReceipt = false"
      />
      <OrderReceipt
        :order="order"
        class="absolute-center"
        receipt-background="#777777"
        @ticket-updated="updateTicket"
      />
    </template>
  </q-page>
</template>

<script setup>
import OrderReceipt from "src/components/OrderReceipt.vue";
import { copyToClipboard, date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import FileInput from "src/components/FileInput.vue";
import useApp from "src/composables/app";
import useUtil from "src/composables/util";
import { useAppStore } from "src/stores/app";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { laravelEcho } from "src/boot/global-properties";
const { getDateDiff } = date;

const { notify, dialog } = useQuasar();
const showReceipt = ref(true);
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
const discount = ref("");
const appStore = useAppStore();

const updateTicket = (ticket) => {
  const index = order.value.tickets.findIndex((e) => e.pivot.id == ticket.id);
  order.value.tickets[index].pivot = ticket;
};

const copyNumber = (text) => {
  copyToClipboard(text).then(() => {
    notify({
      message: t("copied"),
      type: "info",
    });
  });
};

const confirmOrder = () => {
  if (discount.value > order.value.amount) return;
  dialog({
    title: t("areYouSure"),
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "post",
      url: `orders/${order.value.id}/confirm`,
      data: {
        discount: discount.value || undefined,
      },
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
      discount: discount.value || undefined,
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

    if (data.order.round.payment_methods.length == 0)
      api({
        method: "GET",
        url: "payment-methods",
      }).then(({ data }) => {
        paymentMethods.value = data.payment_methods;
      });
    else paymentMethods.value = data.order.round.payment_methods;

    laravelEcho
      .private(`orders.${order.value.id}`)
      .listen("OrderUpdated", (payload) => {
        if (order.value.id == payload.order.id)
          order.value.status = payload.order.status;
      });
  });
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
  laravelEcho.leaveChannel(`rounds.${order.value.round_id}`);
});
</script>
