<template>
  <q-page>
    <div class="text-center q-my-sm text-subtitle1">
      {{ appStore.getUser?.name }}
    </div>
    <q-list bordered separator padding>
      <q-item
        v-if="appStore.getUser?.is_admin"
        clickable
        v-ripple
        @click.stop="
          $router.push({
            name: 'payments',
          })
        "
      >
        <q-item-section>{{ $t("paymentMethod", 2) }}</q-item-section>
        <q-item-section avatar>
          <q-btn icon="credit_card" />
        </q-item-section>
      </q-item>
      <q-item
        clickable
        v-ripple
        @click.stop="
          $router.push({
            name: 'change-password',
          })
        "
      >
        <q-item-section>{{ $t("changePassword", 2) }}</q-item-section>
        <q-item-section avatar>
          <q-btn icon="key" />
        </q-item-section>
      </q-item>
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
import { useAppStore } from "src/stores/app";

const { logout } = useApp();
const appStore = useAppStore();
</script>
