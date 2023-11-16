<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          icon="keyboard_arrow_left"
          flat
          @click="$router.go(-1)"
          v-if="!['login', 'index'].includes($route.name) && user"
        />
        <q-toolbar-title
          @click="
            $router.push({
              name: 'index',
            })
          "
        >
          Lucky Mee Mee
        </q-toolbar-title>
        <LanguageToggleButton />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated v-if="user">
      <q-tabs v-model="tab" no-caps>
        <q-route-tab
          name="home"
          icon="home"
          :label="$t('home')"
          :to="{ name: 'index' }"
          exact
        />
        <q-route-tab
          name="orders"
          icon="category"
          :label="$t('order', 2)"
          :to="{ name: 'orders' }"
          exact
        />
        <q-route-tab
          name="settings"
          icon="settings"
          :label="$t('setting', 2)"
          :to="{ name: 'settings' }"
          exact
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import LanguageToggleButton from "src/components/LanguageToggleButton.vue";
import { ref } from "vue";

const tab = ref("home");
const { localStorage } = useQuasar();
const user = localStorage.getItem("user");
</script>
