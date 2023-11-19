<template>
  <q-page padding class="q-gutter-y-sm">
    <div>
      Telegram bot မှ Notification ရယူရန်
      <a href="https://t.me/JsonDumpBot" target="_blank">Json Dump Bot</a> ကို
      စာပို့ပါ
    </div>
    <q-img :src="$ASSETS_URL + '/assets/json-dump-bot.jpeg'" />
    <div>ပြီလျှင် အ၀ါရောင် ၀ိုင်းထားသော id ကို အောက်တွင်ရိုက်ထည့်ပါ</div>
    <q-form @submit.prevent="submit" class="q-gutter-y-sm">
      <q-input outlined v-model="telegramId" label="Telegram ID" required>
        <template v-slot:append v-if="appStore.getUser.telegram_chat_id">
          <q-icon name="checked" color="positive" />
        </template>
      </q-input>
      <div class="text-right q-gutter-x-sm">
        <q-btn
          :icon="
            appStore.getUser.notification_active
              ? 'notifications_active'
              : 'notifications_off'
          "
          :color="
            appStore.getUser.notification_active ? 'positive' : 'negative'
          "
          @click="toggleNotification"
        />
        <q-btn icon="save" color="primary" type="submit" />
      </div>
    </q-form>
    <div>
      အပေါ်က
      <q-btn icon="save" color="primary" /> ကိုနိုပ်ပြီးလျှင်
      <a href="https://t.me/lucky_mee_mee_bot" target="_blank">
        Lucky Mee Mee Bot
      </a>
      ကို စာပို့ပါ
    </div>
    <div>
      <q-btn icon="notifications" color="primary" /> က Bot Notification
      ကိုအဖွင့်ပိတ်လုပ်ရန်ဖြစ်သည်
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useAppStore } from "src/stores/app";
import { ref } from "vue";

const appStore = useAppStore();
const telegramId = ref(appStore.getUser.telegram_chat_id);
const submit = () => {
  loading.show();
  api({
    method: "POST",
    url: "users/telegram-id/set",
    data: {
      telegram_chat_id: telegramId.value,
    },
  })
    .then(({ data }) => {
      appStore.setUser({
        ...appStore.getUser,
        telegram_chat_id: data.user.telegram_chat_id,
      });
    })
    .finally(() => {
      loading.hide();
    });
};
const { loading } = useQuasar();

const toggleNotification = () => {
  loading.show();
  api({
    url: "users/telegram-notification/toggle",
    method: "POST",
  })
    .then(() => {
      appStore.setUser({
        ...appStore.getUser,
        notification_active: appStore.getUser.notification_active
          ? false
          : true,
      });
    })
    .finally(() => {
      loading.hide();
    });
};
</script>
