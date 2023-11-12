<template>
  <q-page padding class="bg-grey-3" v-if="item">
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
            <div class="col-6">
              {{ $t("totalNumberOfTickets") }} : {{ item.max_tickets }}
            </div>
            <div class="col-6 text-right">
              {{ $t("pricePerTicket") }} : {{ item.price_per_ticket }}
            </div>
            <div class="col-12 text-center">
              {{ $t("itemPrice") }} : {{ item.price }}
            </div>
            <div class="col-12" v-if="item.note">
              {{ $t("note") }} : {{ item.note }}
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
    <q-expansion-item
      icon="info"
      :label="$t('itemDetails')"
      default-opened
      v-if="pagination"
    >
      <q-card>
        <q-card-section class="row justify-between q-gutter-sm">
          <q-btn
            v-for="ticket in pagination.data"
            :key="ticket.id"
            :color="getTicketColor(ticket.status)"
            @click="book(ticket)"
          >
            {{ toThreeDigits(ticket.code) }}
          </q-btn>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import ItemPictureCarousel from "src/components/ItemPictureCarousel.vue";
import usePagination from "src/composables/pagination";
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
const { toThreeDigits } = useUtil();
const { pagination } = usePagination("tickets", {
  item_id: route.params.id,
  per_page: 10000,
  select: ["code", "status", "id"],
});
const router = useRouter();

const book = (ticket) => {
  dialog({
    title: t("buyTicket"),
    message: `${t("ticketNumber")} : ${toThreeDigits(ticket.code)}`,
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
      url: `tickets/${ticket.id}/book`,
      data: {
        phone: phoneNumber,
      },
    }).then(({ data }) => {
      router.push({
        name: "ticket-details",
        params: {
          id: data.ticket.id,
        },
      });
    });
  });
};

const getTicketColor = (status) => {
  switch (status) {
    case 2:
      return "orange";
    case 3:
      return "orange";
    case 4:
      return "negative";
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
