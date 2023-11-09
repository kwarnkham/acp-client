<template>
  <q-page padding v-if="item">
    <ItemForm :item="item" />
    <ItemPictureCarosel
      v-if="item.pictures.length"
      v-model="slide"
      :pictures="item.pictures"
      @picture:deleted="deletePicture"
    />
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import ItemForm from "src/components/ItemForm.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ItemPictureCarosel from "src/components/ItemPictureCarousel.vue";

const route = useRoute();
const item = ref(null);
const slide = ref(1);

const deletePicture = (id) => {
  console.log(id);
  item.value.pictures.splice(
    item.value.pictures.findIndex((e) => e.id == id),
    1
  );
};

onMounted(() => {
  const itemId = route.params.id;
  api({
    method: "GET",
    url: `items/${itemId}`,
  }).then(({ data }) => {
    item.value = data.item;
    slide.value = data.item.pictures[0]?.id;
  });
});
</script>
