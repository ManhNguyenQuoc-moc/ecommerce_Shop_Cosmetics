"use client";
import dynamic from "next/dynamic";
import { UserProvider } from "./provider";
import SWTSpin from "@/src/@core/component/AntD/SWTSpin";

const UsersPageContent = dynamic(() => import("./UsersPage"), {
  ssr: false,
  loading: () => <SWTSpin/>,
});

export default function UserModule() {
  return (
    <UserProvider>
      <UsersPageContent />
    </UserProvider>
  );
}