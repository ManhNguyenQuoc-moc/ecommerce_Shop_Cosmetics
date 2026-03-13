import { getServer } from "../apiServer";
import { HomeData } from "@/src/@core/type/home";

export const getHomeData = () =>
  getServer<HomeData>("/home", undefined, {
    revalidate: 60
  });