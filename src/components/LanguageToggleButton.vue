<template>
  <q-btn
    :icon="
      'img:' +
      $ASSETS_URL +
      (locale == 'en-US' ? '/assets/us-flag.png' : '/assets/mm-flag.png')
    "
    flat
    round
    @click="toggleLanguage"
  />
</template>

<script setup>
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const { localStorage, lang } = useQuasar();
const { locale } = useI18n();

const toggleLanguage = () => {
  const changedLanguage = locale.value == "en-US" ? "mm" : "en-US";
  import(
    /* webpackInclude: /(mm|en-US)\.js$/ */
    "quasar/lang/" + changedLanguage
  ).then((language) => {
    lang.set(language.default);
    locale.value = changedLanguage;
    localStorage.set("language", changedLanguage);
  });
};
</script>
