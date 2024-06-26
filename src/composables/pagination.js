import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "src/boot/axios"

export default function usePagination (url, params) {
  const route = useRoute();
  const router = useRouter();
  const pagination = ref(null);
  const totalAmount = ref(0)
  const current = ref(1);
  const summery = ref(0)
  const lastPage = ref(0)

  const fetcher = (params) => {
    if (!params?.per_page) params.per_page = 10;
    return new Promise((resolve, reject) => {
      api({
        method: "GET",
        url,
        data: params,
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      });
    })
  };

  const fetchMore = () => {
    const query = JSON.parse(JSON.stringify(route.query))
    fetcher(query).then(({ data }) => {
      pagination.value = data.data;
      totalAmount.value = data.total_amount;
      lastPage.value = data.data.last_page
    });
  };

  const updateQueryAndFetch = (newQuery) => {
    const options = {
      name: route.name,
      query: JSON.parse(JSON.stringify(route.query)),
    };
    options.query = { ...options.query, ...newQuery };
    Object.keys(options.query).forEach(key => {
      if (!options.query[key]) delete options.query[key]
    })
    router.replace(options).then(() => {
      if (current.value == 1) fetch(options.query);
      else current.value = 1;
    });
  };

  const fetch = (query) => {
    fetcher(query).then(({ data }) => {
      pagination.value = data.data;
      current.value = data.data.current_page;
      totalAmount.value = data.total_amount
      lastPage.value = data.data.last_page
    });
  }

  onMounted(() => {
    let query = JSON.parse(JSON.stringify(route.query))
    if (params) query = { ...query, ...params }
    router.replace({
      name: route.name,
      query: query
    }).then(() => {
      fetch(query)
    })
  })

  watch(current, () => {
    router
      .replace({
        name: route.name,
        query: { ...route.query, page: current.value },
      })
      .then(fetchMore);
  });

  return {
    pagination,
    lastPage,
    current,
    totalAmount,
    fetch,
    summery,
    updateQueryAndFetch,
  }
}
