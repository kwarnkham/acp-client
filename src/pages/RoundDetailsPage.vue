<template>
  <q-page
    padding
    v-if="round"
    :style-fn="vhPage"
    class="column no-wrap relative-position"
  >
    <div class="text-subtitle1 text-center">
      <span>{{ round.item.name }}</span>
      <q-btn icon="info" flat round color="info" @click="showRoundInfo" />
    </div>
    <div
      class="full-wdith q-my-sm q-gutter-x-md"
      v-if="
        round.status == 2 && appStore.getUser?.is_admin && round.code != null
      "
    >
      <q-btn
        :label="toDigits(round.code, String(round.max_tickets - 1).length)"
        color="purple"
      />

      <q-btn
        icon="star"
        color="purple"
        v-if="round.ticket?.order_id"
        @click="
          $router.push({
            name: 'order-details',
            params: {
              id: round.ticket.order_id,
            },
          })
        "
      />

      <q-btn
        icon="receipt"
        color="purple"
        @click="showReceipt = true"
        v-if="order"
      />
    </div>

    <div class="full-wdith q-my-sm" v-if="appStore.getUser?.is_admin">
      <q-btn icon="check" class="full-width" color="indigo" @click="settle" />
    </div>
    <div class="full-wdith q-my-sm row justify-evenly">
      <q-btn
        icon="share"
        class="col-5"
        color="blue"
        @click="copyLinkToClipboard"
      />
      <q-btn
        :label="$t('order')"
        class="col-5"
        no-caps
        color="blue"
        @click="
          $router.push({
            name: 'orders',
            query: {
              round_id: round.id,
            },
          })
        "
      />
    </div>

    <q-card class="col overflow-auto">
      <q-card-section class="row justify-evenly q-gutter-xs">
        <q-btn
          v-for="ticket in tickets"
          :key="ticket.code"
          @click="selectCode(ticket.code)"
          :color="ticket.color"
        >
          {{ toDigits(ticket.code, String(round.max_tickets - 1).length) }}
          <q-badge color="positive" floating v-if="ticket.ownned">
            <q-icon name="check" style="font-size: 10px" />
          </q-badge>
        </q-btn>
      </q-card-section>
    </q-card>

    <div class="q-mt-sm" v-if="selectedCodes.length">
      <q-btn
        :label="$t('next')"
        no-caps
        class="full-width"
        color="primary"
        @click="book"
      />
    </div>
    <div
      class="col-12 absolute-center full-width row flex-center text-center"
      style="background-color: rgba(0, 0, 0, 0.5)"
      v-if="round.status == 2 && order && showReceipt"
    >
      <q-btn
        icon="close"
        class="absolute-top-right"
        color="info"
        @click="hideReceipt"
        v-if="appStore.getUser?.is_admin"
      />
      <transition
        appear
        enter-active-class="animated tada"
        leave-active-class="animated bounceOut"
        @after-leave="showReceipt = false"
      >
        <ConfettiContainer v-if="order.status == 3 && showReceiptDialog">
          <OrderReceipt
            :order="order"
            receipt-background="#8A8A8A"
            :code="Number(round.code)"
          />
        </ConfettiContainer>
      </transition>
    </div>
  </q-page>
</template>

<script setup>
import { copyToClipboard, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import UserFormDialog from "src/components/UserFormDialog.vue";
import useApp from "src/composables/app";
import useUtil from "src/composables/util";
import { useAppStore } from "src/stores/app";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { laravelEcho } from "src/boot/global-properties";
import RoundInfoDialog from "src/components/RoundInfoDialog.vue";
import OrderReceipt from "src/components/OrderReceipt.vue";
import ConfettiContainer from "src/components/ConfettiContainer.vue";

const { vhPage } = useUtil();
const { t } = useI18n();
const { dialog, notify } = useQuasar();
const round = ref(null);
const route = useRoute();
const { toDigits } = useUtil();
const selectedCodes = ref([]);
const router = useRouter();
const { preserveUser } = useApp();
const appStore = useAppStore();
const order = ref(null);
const showReceipt = ref(true);
const showReceiptDialog = ref(true);

watch(round, () => {
  if (round.value.ticket?.order_id)
    api({
      method: "GET",
      url: `orders/${round.value.ticket?.order_id}`,
    }).then(({ data }) => {
      order.value = data.order;
      showReceipt.value = true;
    });
  else order.value = false;
});

watch(showReceipt, () => {
  showReceiptDialog.value = showReceipt.value;
});

const settle = () => {
  dialog({
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      model: "",
      type: "number",
      mode: "numeric",
      pattern: "[0-9]*",
      isValid: (val) => val != "" && val >= 0 && val < round.value.max_tickets,
    },
  }).onOk((value) => {
    api({
      method: "POST",
      url: `rounds/${round.value.id}/settle`,
      data: {
        code: value,
      },
    }).then(({ data }) => {
      round.value = data.round;
    });
  });
};

const hideReceipt = () => {
  showReceiptDialog.value = false;
};

const showRoundInfo = () => {
  dialog({
    component: RoundInfoDialog,
    componentProps: {
      round: round.value,
    },
  });
};

const copyLinkToClipboard = () => {
  copyToClipboard(window.location.href)
    .then(() => {
      notify({
        message: t("linkCopiedToClippoard"),
        type: "positive",
      });
    })
    .catch(() => {
      dialog({
        message: window.location.href,
      });
    });
};

const tickets = computed(() => {
  const data = [];
  for (let index = 0; index < round.value.max_tickets; index++) {
    data.push({
      code: index,
      color: getTicketColor(index),
      ownned:
        appStore.getUser != null &&
        round.value.order_details.find(
          (e) => e.pivot.code == index && e.status == 3
        )?.user_id == appStore.getUser.id,
    });
  }
  return data;
});

const selectCode = (code) => {
  if (round.value.status == 2) return;
  const order = round.value.order_details.find(
    (e) => e.pivot.code == code && ![4, 5].includes(e.status)
  );
  if (!order) {
    if (!selectedCodes.value.includes(code)) selectedCodes.value.push(code);
    else
      selectedCodes.value.splice(
        selectedCodes.value.findIndex((e) => e == code),
        1
      );
  } else {
    if (appStore.getUser?.is_admin)
      dialog({
        title: "Check order details?",
        noBackdropDismiss: true,
        cancel: true,
      }).onOk(() => {
        router.push({
          name: "order-details",
          params: {
            id: order.id,
          },
        });
      });
  }
};

const getTicketColor = (code) => {
  if (selectedCodes.value.includes(code)) return "green";
  if (code == round.value.ticket?.code) return "purple";
  const found = round.value.order_details.find(
    (e) => e.pivot.code == code && ![4, 5].includes(e.status)
  );

  if (found != null) {
    if (found.status == 3) return "red";
    else if (found.status == 2 && appStore.getUser?.is_admin) return "black";
    else return "orange";
  }
};

const book = () => {
  const sendBookRequest = ({ phone, name }) => {
    const url = appStore.getUser ? "orders" : "orders/guest";
    api({
      method: "POST",
      url,
      data: {
        name: name,
        phone: phone,
        round_id: round.value.id,
        codes: selectedCodes.value,
      },
    }).then(({ data }) => {
      const orderData = data.order;
      if (!appStore.getUser)
        api({
          method: "POST",
          url: "login",
          data: {
            name: phone,
            password: phone,
          },
        }).then(({ data }) => {
          preserveUser(data);
          router.push({
            name: "order-details",
            params: {
              id: orderData.id,
            },
          });
        });
      else
        router.push({
          name: "order-details",
          params: {
            id: orderData.id,
          },
        });
    });
  };
  if (!appStore.getUser || appStore.getUser?.is_admin)
    dialog({
      component: UserFormDialog,
    }).onOk(({ phone, name }) => {
      sendBookRequest({ phone, name });
    });
  else
    dialog({
      title: t("confirm"),
      noBackdropDismiss: true,
      cancel: true,
    }).onOk(() => {
      sendBookRequest({
        phone: appStore.getUser?.phone,
        name: appStore.getUser?.name,
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

  laravelEcho
    .channel(`rounds.${roundId}`)
    .listen("OrderUpdated", ({ order }) => {
      selectedCodes.value = selectedCodes.value.filter(
        (e) => !order.tickets.map((ticket) => ticket.pivot.code).includes(e)
      );

      round.value = order.round;
    })
    .listen("RoundUpdated", (payload) => {
      round.value.code = payload.round.code;
      round.value.ticket = payload.round.ticket;
      round.value.ticket_id = payload.round.ticket_id;
      round.value.status = payload.round.status;
    });
});

onBeforeUnmount(() => {
  laravelEcho.leaveChannel(`rounds.${route.params.id}`);
});
</script>

<style scoped lang="scss">
:deep(.animated.tada) {
  --animate-duration: 1s;
}
:deep(.animated.bounceOut) {
  --animate-duration: 0.6s;
}
</style>
