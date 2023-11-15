<template>
  <q-form @submit.prevent="submit" class="q-ma-sm q-gutter-y-sm">
    <q-input :label="$t('name')" v-model="name" required autofocus />

    <q-input
      :label="$t('description')"
      v-model="description"
      autogrow
      outlined
    />

    <FileInput multiple v-model="pictures" />
    <div class="text-right q-mt-sm">
      <q-btn :label="$t(item.id ? 'update' : 'create')" no-caps type="submit" />
    </div>
  </q-form>
</template>

<script setup>
import FileInput from "src/components/FileInput.vue";
import { ref } from "vue";
import { api } from "src/boot/axios";
import useUtil from "src/composables/util";
import { useRouter } from "vue-router";

const props = defineProps({
  item: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

const { buildForm } = useUtil();
const name = ref(props.item.name ?? "");
const max = ref("100");
const description = ref(props.item.description ?? "");
const pricePerTicket = ref(props.item.latest_round?.price_per_ticket ?? "");
const price = ref(props.item.latest_round?.price ?? "");
const note = ref(props.item.latest_round?.note ?? "");
const expires_in = ref(60);
const pictures = ref([]);
const router = useRouter();

const submit = () => {
  const url = props.item.id ? `items/${props.item.id}` : "items";
  api({
    asForm: true,
    showLoading: true,
    method: "POST",
    url,
    data: buildForm({
      name: name.value,
      max_tickets: max.value,
      price_per_ticket: pricePerTicket.value,
      price: price.value,
      note: note.value,
      description: description.value,
      pictures: pictures.value,
      expires_in: expires_in.value,
      _method: props.item.id ? "PUT" : "POST",
    }),
  }).then(({ data }) => {
    router.push({
      name: "item-details",
      params: {
        id: data.item.id,
      },
    });
  });
};
</script>
