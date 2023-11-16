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
      <div class="col-12" v-if="user?.is_admin">
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
      <q-btn :label="$t('selected')" no-caps color="green" v-if="user" />
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

    <div class="q-mt-sm" v-if="selectedCodes.length && user">
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
      v-if="!user?.is_admin && round.status == 2"
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
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { vhPage } = useUtil();
const { t } = useI18n();
const { localStorage, dialog, notify } = useQuasar();
const round = ref(null);
const route = useRoute();
const user = localStorage.getItem("user");
const { toDigits } = useUtil();
const selectedCodes = ref([]);
const router = useRouter();

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
  if (!user) return;
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
  dialog({
    title: t("buyTicket"),
    noBackdropDismiss: true,
    cancel: true,
    prompt: {
      model: "",
      label: t("phoneNumber"),
      isValid: (val) => val != "",
      type: "tel",
      autofocus: true,
    },
  }).onOk((phoneNumber) => {
    api({
      method: "POST",
      url: `orders`,
      data: {
        phone: phoneNumber,
        round_id: round.value.id,
        codes: selectedCodes.value.map((e) => e - 1),
      },
    }).then(({ data }) => {
      router.push({
        name: "order-details",
        params: {
          id: data.order.id,
        },
      });
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