<template>
  <q-page padding :style-fn="vhPage" class="column no-wrap">
    <q-input v-model="phone" dense outlined class="q-mb-md">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-list bordered separator class="overflow-auto col">
      <q-item v-for="user in pagination?.data" :key="user.id">
        <q-item-section>
          <q-item-label>
            <q-icon name="person" class="q-mr-sm" />{{ user.name }}
          </q-item-label>
          <q-item-label caption>
            <q-icon name="phone" class="q-mr-sm" />{{ user.phone }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-btn icon="key" @click="resetPassword(user.id)" />
        </q-item-section>
      </q-item>
    </q-list>
    <div
      class="row justify-center full-width"
      :class="{
        hidden: current == 1 && pagination?.next_page_url == null,
      }"
    >
      <q-pagination v-model="current" :max="lastPage" input />
    </div>
  </q-page>
</template>

<script setup>
import { copyToClipboard, debounce, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import usePagination from "src/composables/pagination";
import useUtil from "src/composables/util";
import { useAppStore } from "src/stores/app";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { pagination, lastPage, current, updateQueryAndFetch } =
  usePagination("users");
const { vhPage } = useUtil();
const route = useRoute();
const phone = ref(route.query.phone || "");
const { dialog, notify } = useQuasar();
const { t } = useI18n();
const resetPassword = (id) => {
  dialog({
    title: t("areYouSure"),
    cancel: true,
    noBackdropDismiss: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: `users/${id}/reset-password`,
    }).then(({ data }) => {
      copyToClipboard(data.password).then(() => {
        notify({
          message: `Password has been changed to "${data.password}" and ready to paste`,
          type: "positive",
          timeout: 0,
          closeBtn: true,
        });
      });
    });
  });
};

watch(
  phone,
  debounce(() => {
    updateQueryAndFetch({ phone: phone.value });
  }, 500)
);
</script>
