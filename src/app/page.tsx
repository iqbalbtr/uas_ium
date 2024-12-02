"use client"
import { useRouter } from "next/navigation";

const App = () => {

  if(typeof window == "undefined")
    return

  const navigate = useRouter()

  return navigate.replace("/login")
};

export default App;
