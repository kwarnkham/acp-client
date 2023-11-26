<template>
  <q-page
    padding
    v-if="round"
    :style-fn="vhPage"
    class="column no-wrap relative-position"
  >
    <q-expansion-item expand-separator :label="round.item.name">
      <div class="text-subtitle1 text-center">
        <q-btn icon="info" flat round color="info" @click="showRoundInfo" />
        <q-btn
          icon="photo"
          flat
          round
          color="teal"
          @click="showPictures"
          :disable="round.item.pictures.length == 0"
        />
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
          v-if="luckyOrder"
        />
      </div>

      <div class="full-wdith q-my-sm" v-if="appStore.getUser?.is_admin">
        <q-btn icon="check" class="full-width" color="indigo" @click="settle" />
      </div>
      <div class="full-wdith q-my-sm row justify-evenly q-pb-sm">
        <q-btn icon="share" color="blue" @click="copyLinkToClipboard" />
        <q-btn
          icon="payment"
          color="blue"
          @click="
            $router.push({
              name: 'round-payments',
              params: {
                id: round.id,
              },
            })
          "
          v-if="appStore.getUser?.is_admin"
        />
        <q-btn
          :label="$t('order')"
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
    </q-expansion-item>

    <q-tabs
      v-model="ticketDisplayType"
      dense
      class="text-black"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab :name="1" label="မဲအားလုံး" />
      <q-tab :name="2" label="ကျန်မဲများ" />
      <q-tab :name="3" label="ငွေလွဲမဲများ" v-if="appStore.getUser?.is_admin" />
    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="ticketDisplayType"
      animated
      class="col overflow-auto"
      swipeable
    >
      <q-tab-panel
        :name="1"
        class="row justify-evenly q-gutter-xs items-baselineitems-xs-baseline"
      >
        <template v-for="ticket in allTickets" :key="ticket.code">
          <q-btn
            @click="selectCode(ticket.code)"
            :color="ticket.color"
            v-if="
              ticketDisplayType == 1 ||
              (ticketDisplayType == 2 &&
                (ticket.color == undefined || ticket.color == 'green')) ||
              (ticketDisplayType == 3 && ticket.color == 'black')
            "
          >
            {{ ticket.code }}
            <q-badge color="positive" floating v-if="ticket.ownned">
              <q-icon name="check" style="font-size: 10px" />
            </q-badge>
          </q-btn>
        </template>
      </q-tab-panel>

      <q-tab-panel
        :name="2"
        class="row justify-evenly q-gutter-xs items-baseline"
      >
        <template v-for="ticket in allTickets" :key="ticket.code">
          <q-btn
            @click="selectCode(ticket.code)"
            :color="ticket.color"
            v-if="ticket.color == undefined || ticket.color == 'green'"
          >
            {{ ticket.code }}
          </q-btn>
        </template>
      </q-tab-panel>

      <q-tab-panel
        :name="3"
        class="row justify-evenly q-gutter-xs items-baseline"
        v-if="appStore.getUser?.is_admin"
      >
        <template v-for="ticket in allTickets" :key="ticket.code">
          <q-btn
            @click="selectCode(ticket.code)"
            :color="ticket.color"
            v-if="ticket.color == 'black'"
          >
            {{ ticket.code }}
          </q-btn>
        </template>
      </q-tab-panel>
    </q-tab-panels>

    <div class="q-mt-sm">
      <q-btn
        :label="$t('next')"
        no-caps
        class="full-width"
        color="primary"
        @click="book"
        :disable="!selectedCodes.length"
      />
    </div>
    <div
      class="col-12 absolute-center full-width row flex-center text-center"
      style="background-color: rgba(0, 0, 0, 0.5)"
      v-if="round.status == 2 && luckyOrder && showReceipt"
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
        <ConfettiContainer v-if="luckyOrder.status == 3 && showReceiptDialog">
          <OrderReceipt
            :order="luckyOrder"
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
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { laravelEcho } from "src/boot/global-properties";
import RoundInfoDialog from "src/components/RoundInfoDialog.vue";
import OrderReceipt from "src/components/OrderReceipt.vue";
import ConfettiContainer from "src/components/ConfettiContainer.vue";
import PicturesCaroselDialog from "src/components/PicturesCaroselDialog.vue";

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
const luckyOrder = ref(null);
const showReceipt = ref(true);
const showReceiptDialog = ref(true);
const ticketDisplayType = ref(1);

watch(round, () => {
  if (round.value.ticket?.order_id)
    api({
      method: "GET",
      url: `orders/${round.value.ticket?.order_id}`,
    }).then(({ data }) => {
      luckyOrder.value = data.order;
      showReceipt.value = true;
    });
  else luckyOrder.value = null;
});

watch(showReceipt, () => {
  showReceiptDialog.value = showReceipt.value;
});

watch(selectedCodes, () => {});

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

const showPictures = () => {
  dialog({
    component: PicturesCaroselDialog,
    componentProps: {
      pictures: round.value.item.pictures,
    },
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

const allTickets = ref([]);

const generateTickets = () => {
  const data = [];
  for (let index = 0; index < round.value.max_tickets; index++) {
    const color = getTicketColor(index);
    data.push(createTicket({ code: index, color }));
  }
  return data;
};

const createTicket = ({ code, color }) => {
  return {
    code: toDigits(code, String(round.value.max_tickets - 1).length),
    color,
    ownned:
      appStore.getUser != null &&
      round.value.order_details.find(
        (e) => e.pivot.code == code && e.status == 3
      )?.user_id == appStore.getUser.id,
  };
};

const updateTicket = (code) => {
  code = Number(code);
  const index = allTickets.value.findIndex((e) => code == Number(e.code));
  allTickets.value[index] = createTicket({ code, color: getTicketColor(code) });
};

const selectCode = (code) => {
  code = Number(code);
  if (round.value.status == 2) return;
  const foundOrder = round.value.order_details.find(
    (e) => e.pivot.code == code && ![4, 5].includes(e.status)
  );
  if (!foundOrder) {
    if (!selectedCodes.value.includes(code)) selectedCodes.value.push(code);
    else
      selectedCodes.value.splice(
        selectedCodes.value.findIndex((e) => e == code),
        1
      );
    updateTicket(code);
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
            id: foundOrder.id,
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
    })
      .then(({ data }) => {
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
      })
      .catch((e) => {
        if (e.response.status == 400) {
          dialog({
            title: "ဖုန်းနံပါတ်က ရှိပြီးသားဖြစ်နေတယ်",
            message:
              "သုံးပြီးသားဖုန်းနံပါတ်ဆိုရင် အရင် login လုပ်ပေးပါနော်။ Password မသိတော့ရင် admin ကိုအကူညီတောင်းလို့ရပါတယ်နော်။",
            noBackdropDismiss: true,
            cancel: true,
          }).onOk(() => {
            router.push({
              name: "login",
              query: {
                redirect: btoa(
                  JSON.stringify({
                    name: "round-details",
                    params: { id: round.value.id },
                  })
                ),
              },
            });
          });
        }
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
    allTickets.value = generateTickets();
  });

  laravelEcho
    .channel(`rounds.${roundId}`)
    .listen("OrderUpdated", ({ order }) => {
      const codesToBeUnselected = selectedCodes.value.filter((e) =>
        order.tickets.map((ticket) => ticket.pivot.code).includes(Number(e))
      );
      selectedCodes.value = selectedCodes.value.filter(
        (e) => !codesToBeUnselected.includes(e)
      );
      order.tickets.forEach((ticket) => {
        const index = round.value.order_details.findIndex(
          (e) => e.pivot.code == ticket.pivot.code && e.id == order.id
        );
        const roundOrder = {
          ...order,
          pivot: { code: ticket.pivot.code },
        };
        if (index != -1) {
          round.value.order_details.splice(index, 1, roundOrder);
        } else {
          round.value.order_details.push(roundOrder);
        }
        updateTicket(ticket.pivot.code);
      });
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
