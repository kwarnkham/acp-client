<template>
  <q-page padding v-if="round" :style-fn="vhPage" class="column no-wrap">
    <div class="row q-gutter-y-xs">
      <div class="col-12 text-h6 text-center">
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
      <div class="col-12" v-if="user.is_admin">
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

    <q-card class="col overflow-auto">
      <q-card-section class="row justify-evenly q-gutter-xs">
        <q-btn
          v-for="code in round.max_tickets"
          :key="code"
          @click="selectCode(code)"
          :color="getTicketColor(code)"
        >
          {{ toDigits(code - 1, String(round.max_tickets).length - 1) }}
        </q-btn>
      </q-card-section>
    </q-card>
    <div class="q-mt-sm" v-if="selectedCodes.length">
      <q-btn
        :label="$t('newRound')"
        no-caps
        class="full-width"
        color="primary"
        @click="book"
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { vhPage } = useUtil();
const { t } = useI18n();
const { localStorage, dialog } = useQuasar();
const round = ref(null);
const route = useRoute();
const user = localStorage.getItem("user");
const { toDigits } = useUtil();
const selectedCodes = ref([]);
const router = useRouter();

const selectCode = (code) => {
  const index = round.value.order_details.findIndex(
    (e) => e.pivot.code == code && ![4, 5].includes(e.status)
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

  const found = round.value.order_details.find(
    (e) => e.pivot.code == code && ![4, 5].includes(e.status)
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
    },
  }).onOk((phoneNumber) => {
    api({
      method: "POST",
      url: `orders`,
      data: {
        phone: phoneNumber,
        round_id: round.value.id,
        codes: selectedCodes.value,
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
