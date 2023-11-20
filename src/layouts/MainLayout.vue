<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          icon="keyboard_arrow_left"
          flat
          @click="$router.go(-1)"
          v-if="!['login', 'index'].includes($route.name) && appStore.getUser"
        />
        <q-toolbar-title
          @click="
            $router.push({
              name: 'index',
            })
          "
          class="font-great-vibes"
        >
          Lucky Mee Mee
        </q-toolbar-title>
        <LanguageToggleButton />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :class="{ 'bg-indigo-2': appStore.getUser?.is_admin }" />
    </q-page-container>

    <q-footer elevated v-if="appStore.getUser">
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
import LanguageToggleButton from "src/components/LanguageToggleButton.vue";
import { useAppStore } from "src/stores/app";
import { ref } from "vue";

const tab = ref("home");
const appStore = useAppStore();
</script>
