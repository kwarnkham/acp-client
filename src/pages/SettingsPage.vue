<template>
  <q-page>
    <q-list bordered>
      <q-item clickable v-ripple @click.stop="logout">
        <q-item-section>{{ $t("logout") }}</q-item-section>
        <q-item-section avatar>
          <q-btn icon="logout" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import useApp from "src/composables/app";

const { logout } = useApp();
</script>
