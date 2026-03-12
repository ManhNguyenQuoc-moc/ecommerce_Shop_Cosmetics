import { get } from "../api";

import { HomeData } from "@/src/@core/type/home";

export const getHomeData = () => get<HomeData>("/home");