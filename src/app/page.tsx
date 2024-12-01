"use client"
import { useRouter } from "next/navigation";

const App = () => {

  const navigate = useRouter()

  return navigate.push("/dashboard")
};

export default App;
