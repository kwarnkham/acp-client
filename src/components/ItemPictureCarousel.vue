<template>
  <q-carousel
    animated
    :modelValue="modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
    arrows
    navigation
    infinite
    swipeable
    v-model:fullscreen="fullscreen"
    :autoplay="autoplay"
  >
    <q-carousel-slide
      v-for="picture in pictures"
      :key="picture.id"
      :name="picture.id"
      :img-src="picture.name"
    />
    <template v-slot:control>
      <q-carousel-control
        position="bottom-right"
        :offset="[18, 18]"
        class="q-gutter-x-sm"
      >
        <q-btn
          push
          round
          dense
          color="negative"
          icon="delete_forever"
          @click="deletePicture(modelValue)"
        />
        <q-btn
          push
          round
          dense
          color="white"
          text-color="primary"
          :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="fullscreen = !fullscreen"
        />
      </q-carousel-control>
    </template>
  </q-carousel>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

const props = defineProps({
  modelValue: {
    required: true,
  },
  pictures: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "picture:deleted"]);
const { notify, dialog } = useQuasar();
const { t } = useI18n();
const autoplay = ref(true);
const fullscreen = ref(false);
const deletePicture = (id) => {
  autoplay.value = false;
  dialog({
    title: t("confirm"),
    message: t("doYouWantToDelete"),
    noBackdropDismiss: true,
    cancel: true,
  })
    .onOk(() => {
      api({
        method: "DELETE",
        url: `pictures/${id}`,
      }).then(() => {
        notify({
          message: t("deleted"),
          type: "info",
        });

        emit("picture:deleted", id);

        emit(
          "update:modelValue",
          props.pictures.find((e) => e.id != id)?.id ?? 0
        );
      });
    })
    .onDismiss(() => {
      autoplay.value = true;
    });
};
</script>

<style scoped lang="scss">
.q-carousel__slide {
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
