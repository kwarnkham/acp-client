<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss>
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-input :label="$t('name')" v-model="name" required autofocus>
          <template v-slot:prepend>
            <q-icon name="person" color="blue" /> </template
        ></q-input>
        <q-input :label="$t('phoneNumber')" v-model="phone" required type="tel">
          <template v-slot:prepend>
            <q-icon name="phone" color="green" />
          </template>
        </q-input>
        <q-input
          label="လိပ်စာ"
          v-model="address"
          required
          type="textarea"
          autogrow
        >
          <template v-slot:prepend>
            <q-icon name="place" color="blue" /> </template
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          :label="$t('cancel')"
          @click="onDialogCancel"
          no-caps
        />
        <q-btn
          color="primary"
          :label="$t('ok')"
          @click="onOk"
          :disable="name == '' || phone == ''"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import { ref } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
});
const name = ref(props.name);
const phone = ref(props.phone);
const address = ref("");

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const onOk = () => {
  if (name.value == "" || phone.value.vlaue == "") return;
  onDialogOK({ name: name.value, phone: phone.value, address: address.value });
};
</script>
