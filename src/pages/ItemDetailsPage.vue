<template>
  <q-page padding class="bg-grey-3 column" v-if="item" :style-fn="vhPage">
    <div class="col overflow-auto">
      <q-expansion-item icon="info" :label="$t('itemDetails')" default-opened>
        <q-card>
          <q-card-section>
            <div class="text-center text-subtitle1 q-mb-sm q-gutter-x-sm">
              <span>{{ item.name }}</span>
              <q-btn
                icon="edit"
                rounded
                v-if="user?.is_admin"
                @click="
                  $router.push({
                    name: 'edit-item',
                    params: {
                      id: item.id,
                    },
                  })
                "
              />
            </div>
            <q-separator />
            <div class="row q-gutter-y-xs">
              <div class="col-12" v-if="item.description">
                {{ item.description }}
              </div>
              <div class="col-12">
                {{ $t("totalNumberOfTickets") }} :
                {{ item.latest_round.max_tickets }}
              </div>
              <div class="col-12">
                {{ $t("pricePerTicket") }} :
                {{ item.latest_round.price_per_ticket }}
              </div>
              <div class="col-12" v-if="user.is_admin">
                {{ $t("itemPrice") }} : {{ item.latest_round.price }}
              </div>
              <div class="col-12" v-if="item.latest_round.note">
                {{ $t("note") }} : {{ item.latest_round.note }}
              </div>
              <div class="col-12">
                {{ $t("bookingExpiresIn") }} :
                {{ item.latest_round.expires_in }}
                {{ $t("minute", 2) }}
              </div>
            </div>
            <q-separator spaced />
            <ItemPictureCarousel
              :pictures="item.pictures"
              v-model="slide"
              v-if="item.pictures.length"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <q-expansion-item icon="info" :label="$t('itemDetails')" default-opened>
        <q-card>
          <q-card-section class="row justify-between q-gutter-sm">
            <q-btn
              v-for="code in item.latest_round.max_tickets"
              :key="code"
              @click="selectCode(code)"
              :color="getTicketColor(code)"
            >
              {{
                toDigits(
                  code - 1,
                  String(item.latest_round.max_tickets).length - 1
                )
              }}
            </q-btn>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <div class="q-mt-sm" v-if="selectedCodes.length">
      <q-btn
        :label="$t('next')"
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
import ItemPictureCarousel from "src/components/ItemPictureCarousel.vue";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const item = ref(null);
const { localStorage, dialog } = useQuasar();
const user = localStorage.getItem("user");
const slide = ref(1);
const { t } = useI18n();
const { toDigits } = useUtil();
const router = useRouter();
const selectedCodes = ref([]);
const { vhPage } = useUtil();

const selectCode = (code) => {
  const index = item.value.latest_round.order_details.findIndex(
    (e) => e.pivot.code == code
  );
  console.log(index);
  if (index == -1) {
    if (!selectedCodes.value.includes(code)) selectedCodes.value.push(code);
    else
      selectedCodes.value.splice(
        selectedCodes.value.findIndex((e) => e == code),
        1
      );
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
        round_id: item.value.latest_round.id,
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

const getTicketColor = (code) => {
  if (selectedCodes.value.includes(code)) return "green";

  const found = item.value.latest_round.order_details.find(
    (e) => e.pivot.code == code
  );
  if (found != null) {
    if (found.status == 3) return "red";
    else return "orange";
  }
};

onMounted(() => {
  const itemId = route.params.id;
  api({
    method: "GET",
    url: `items/${itemId}`,
  }).then(({ data }) => {
    item.value = data.item;
    slide.value = item.value.pictures[0]?.id ?? 1;
  });
});
</script>
