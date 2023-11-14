<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn icon="keyboard_arrow_left" flat @click="$router.go(-1)" />
        <q-toolbar-title
          @click="
            $router.push({
              name: 'index',
            })
          "
        >
          Quasar App
        </q-toolbar-title>
        <LanguageToggleButton />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated>
      <q-tabs v-model="tab" no-caps>
        <q-route-tab
          name="home"
          icon="home"
          label="Home"
          :to="{ name: 'index' }"
          exact
        />
        <q-route-tab
          name="settings"
          icon="settings"
          label="Setting"
          :to="{ name: 'settings' }"
          exact
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import LanguageToggleButton from "src/components/LanguageToggleButton.vue";
import { ref } from "vue";

const tab = ref("home");
</script>
