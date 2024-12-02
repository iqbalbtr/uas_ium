"use client"
import Loading from "@components/ui/loading";
import { useRouter } from "next/navigation";

const App = () => {
  const navigate = useRouter()

  if(typeof window !== "undefined")
    return navigate.replace("/login")
};

export default App;
