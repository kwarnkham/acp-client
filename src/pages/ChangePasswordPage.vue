<template>
  <q-page padding>
    <q-form @submit.prevent="submit" class="q-pa-xs q-gutter-y-sm">
      <div class="text-center text-h6">{{ $t("changePassword") }}</div>
      <input class="hidden" autocomplete="username" />
      <q-input
        autofocus
        v-model="password"
        required
        :label="$t('password')"
        outlined
        :type="showPasword ? 'text' : 'password'"
        autocomplete="current-password"
      >
        <template v-slot:append>
          <q-btn
            color="primary"
            flat
            dense
            :icon="showPasword ? 'visibility' : 'visibility_off'"
            @click="showPasword = !showPasword"
          />
        </template>
      </q-input>
      <q-input
        v-model="newPassword"
        required
        :label="$t('newPassword')"
        outlined
        :type="showNewPassword ? 'text' : 'password'"
        autocomplete="new-password"
      >
        <template v-slot:append>
          <q-btn
            color="primary"
            flat
            dense
            :icon="showNewPassword ? 'visibility' : 'visibility_off'"
            @click="showNewPassword = !showNewPassword"
          />
        </template>
      </q-input>
      <q-input
        v-model="newPasswordAgain"
        required
        :label="$t('newPasswordAgain')"
        outlined
        :type="showNewPasswordAgain ? 'text' : 'password'"
        autocomplete="new-password"
        lazy-rules
        :rules="[
          (val) => val == newPassword || $t('newPasswordsMustBeTheSame'),
        ]"
      >
        <template v-slot:append>
          <q-btn
            color="primary"
            flat
            dense
            :icon="showNewPasswordAgain ? 'visibility' : 'visibility_off'"
            @click="showNewPasswordAgain = !showNewPasswordAgain"
          />
        </template>
      </q-input>
      <div class="text-right">
        <q-btn icon="save" color="primary" type="submit" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const password = ref("");
const newPassword = ref("");
const newPasswordAgain = ref("");
const showNewPassword = ref(false);
const showNewPasswordAgain = ref(false);
const showPasword = ref(false);
const { notify } = useQuasar();
const { t } = useI18n();

const submit = () => {
  api({
    method: "POST",
    url: "change-password",
    data: {
      password: password.value,
      new_password: newPassword.value,
      new_password_confirmation: newPasswordAgain.value,
    },
  }).then(() => {
    password.value = "";
    newPassword.value = "";
    newPasswordAgain.value = "";
    notify({
      message: t("success"),
      type: "positive",
    });
  });
};
</script>
