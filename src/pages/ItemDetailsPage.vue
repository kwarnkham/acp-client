<template>
  <q-page padding class="bg-grey-3 column" v-if="item" :style-fn="vhPage">
    <div class="col overflow-auto">
      <q-card>
        <q-card-section>
          <div class="text-center text-subtitle1 q-mb-sm q-gutter-x-sm">
            <span>{{ item.name }}</span>
            <q-btn
              icon="edit"
              rounded
              v-if="appStore.getUser?.is_admin"
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
          <div class="row q-gutter-y-xs">
            <div class="col-12" v-if="item.description">
              {{ item.description }}
            </div>
          </div>
          <ItemPictureCarousel
            :pictures="item.pictures"
            v-model="slide"
            @picture:deleted="deletePicure"
            v-if="item.pictures.length"
          />
        </q-card-section>
      </q-card>

      <q-card class="q-mt-lg">
        <q-card-section>
          <RoundForm :itemId="item.id" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import ItemPictureCarousel from "src/components/ItemPictureCarousel.vue";
import useUtil from "src/composables/util";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import RoundForm from "src/components/RoundForm.vue";
import { useAppStore } from "src/stores/app";

const route = useRoute();
const item = ref(null);
const slide = ref(1);
const appStore = useAppStore();

const { vhPage } = useUtil();

const deletePicure = (id) => {
  const index = item.value.pictures.findIndex((e) => e.id == id);
  if (index != -1) item.value.pictures.splice(index, 1);
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
