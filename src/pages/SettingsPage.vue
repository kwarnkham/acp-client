<template>
  <q-page>
    <q-btn icon="logout" flat @click="logout" />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api, instance } from "src/boot/axios";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { notify, localStorage, dialog } = useQuasar();
const { t } = useI18n();
const router = useRouter();
const logout = () => {
  dialog({
    title: t("confirm"),
    message: t("doYouWantToLogOut"),
    noBackdropDismiss: true,
    cancel: true,
  }).onOk(() => {
    api({
      method: "POST",
      url: "logout",
    }).finally(() => {
      localStorage.remove("token");
      instance.defaults.headers.common["Authorization"] = undefined;
      notify({
        message: t("loggedOut"),
        type: "info",
      });
      router.replace({
        name: "login",
      });
    });
  });
};
</script>
