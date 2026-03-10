import Image from "next/image";

const SWTAppLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <Image
        src="/images/main/SWTAppLoading.gif"
        alt="Loading..."
        width={200}
        height={200}
        priority
      />
    </div>
  );
};

export default SWTAppLoader;