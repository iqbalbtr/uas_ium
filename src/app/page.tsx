import Button from "@components/core/Button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-[100%] h-[100vh] bg-gray-300 block items-center">
      <h1 className="text-3xl font-bold top-5 text-slate-900">Dashboard</h1>
      <Button className="bg-blue-500">Learn</Button>
    </div>
  );
}
