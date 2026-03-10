import { useRouter } from "next/navigation";

const useSWTRouter = () => {
  const router = useRouter();

  return { ...router };
};

export default useSWTRouter;