<template>
  <q-page
    padding
    :style-fn="vhPage"
    class="column no-wrap bg-grey-3"
    v-if="item"
  >
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
          <ItemPictureCarousel :pictures="item.pictures" v-model="slide" />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import ItemPictureCarousel from "src/components/ItemPictureCarousel.vue";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const item = ref(null);
const { vhPage } = useUtil();
const { localStorage } = useQuasar();
const user = localStorage.getItem("user");
const slide = ref(1);

onMounted(() => {
  const itemId = route.params.id;
  api({
    method: "GET",
    url: `items/${itemId}`,
  }).then(({ data }) => {
    item.value = data.item;
  });
});
</script>
