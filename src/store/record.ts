import { reactive } from "vue";
import type API from "./api";

const records = reactive<API.Record[]>([])

export default records
