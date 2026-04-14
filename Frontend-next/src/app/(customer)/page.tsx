import HomePage from "./home/HomePage";
import { getHomeData } from "@/src/services/customer/home/home.service";

export default async function Page() {

  const data = await getHomeData();

  return <HomePage initialData={data} />;
}