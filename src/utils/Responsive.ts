import { ref, watch } from "vue";
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();

const lt600px = ref(width.value < 600);
const lt800px = ref(width.value < 800);

watch(width, () => {
  lt600px.value = width.value < 600
  lt800px.value = width.value < 800
})

export { lt600px, lt800px };
