import { getServer } from "../../../@core/utils/apiServer";
import { HomeData } from "@/src/services/customer/home/models/home.model";

export const getHomeData = () =>
  getServer<HomeData>("/home", undefined, {
    revalidate: 60
  });