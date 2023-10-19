<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <q-btn
          icon="facebook"
          flat
          @click="login"
          v-if="appStore.getFbLoginStatus?.status != 'connected'"
        />
        <q-btn icon="logout" flat @click="logout" v-else />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import useFacebook from "src/composables/facebook";
import { useAppStore } from "src/stores/app";
const { login, logout } = useFacebook();
const appStore = useAppStore();
</script>
