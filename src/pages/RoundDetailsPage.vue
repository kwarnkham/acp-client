<template>
  <q-page
    padding
    v-if="round"
    :style-fn="vhPage"
    class="column no-wrap relative-position"
  >
    <div class="row q-gutter-y-xs">
      <div
        class="col-12 text-h6 text-center"
        :class="{ 'bg-positive': round.status == 2 }"
      >
        {{ round.item.name }} : {{ $t("round") }} - {{ round.id }}
      </div>
      <div class="col-12" v-if="round.item?.description">
        {{ round.item.description }}
      </div>
      <div class="col-12">
        {{ $t("totalNumberOfTickets") }} :
        {{ round.max_tickets }}
      </div>
      <div class="col-12">
        {{ $t("pricePerTicket") }} :
        {{ round.price_per_ticket }}
      </div>
      <div class="col-12" v-if="appStore.getUser?.is_admin">
        {{ $t("itemPrice") }} : {{ round.price }}
      </div>
      <div class="col-12" v-if="round.note">
        {{ $t("note") }} : {{ round.note }}
      </div>
      <div class="col-12">
        {{ $t("bookingExpiresIn") }} :
        {{ round.expires_in }}
        {{ $t("minute", 2) }}
      </div>
    </div>
    <div class="justify-between row">
      <q-btn :label="$t('available')" no-caps />
      <q-btn
        :label="$t('selected')"
        no-caps
        color="green"
        v-if="appStore.getUser"
      />
      <q-btn :label="$t('booked')" no-caps color="orange" />
      <q-btn :label="$t('soldOut')" no-caps color="red" />
    </div>
    <div class="full-wdith q-my-sm">
      <q-btn icon="check" class="full-width" color="indigo" @click="settle" />
    </div>
    <div class="full-wdith q-my-sm">
      <q-btn
        icon="share"
        class="full-width"
        color="blue"
        @click="copyLinkToClipboard"
      />
    </div>

    <q-card class="col overflow-auto">
      <q-card-section class="row justify-evenly q-gutter-xs">
        <q-btn
          v-for="code in round.max_tickets"
          :key="code + (round.ticket?.id ?? 't')"
          @click="selectCode(code)"
          :color="getTicketColor(code)"
        >
          {{ toDigits(code - 1, String(round.max_tickets).length - 1) }}
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
      class="col-12 absolute-center full-width row flex-center text-center text-h4 text-white"
      style="background-color: rgba(0, 0, 0, 0.5)"
      v-if="!appStore.getUser?.is_admin && round.status == 2"
    >
      <div>
        <div>{{ $t("theRoundIsFinished") }}</div>
        <div>
          <q-btn :label="round.ticket?.code" color="purple" size="lg" />
        </div>
      </div>
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
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

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

const selectCode = (code) => {
  const index = round.value.order_details.findIndex(
    (e) => e.pivot.code == code - 1 && ![4, 5].includes(e.status)
  );
  if (index == -1) {
    if (!selectedCodes.value.includes(code)) selectedCodes.value.push(code);
    else
      selectedCodes.value.splice(
        selectedCodes.value.findIndex((e) => e == code),
        1
      );
  }
};

const getTicketColor = (code) => {
  if (selectedCodes.value.includes(code)) return "green";
  if (code - 1 == round.value.ticket?.code) return "purple";
  const found = round.value.order_details.find(
    (e) => e.pivot.code == code - 1 && ![4, 5].includes(e.status)
  );

  if (found != null) {
    if (found.status == 3) return "red";
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
        codes: selectedCodes.value.map((e) => e - 1),
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
  if (!appStore.getUser || appStore.getUser.is_admin)
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
        phone: appStore.getUser.phone,
        name: appStore.getUser.name,
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
});
</script>
