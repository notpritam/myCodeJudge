"use client";

import { Input } from "@/components/ui/input";

const page = () => {
  const handleLogin = async () => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "admin",
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div>
      <header className="w-full h-[50px] bg-white dark:bg-[#282828] flex py-[120px]">
        <div className="flex">
          <div className="">logo</div>
          <div className="">Explore</div>
        </div>
      </header>{" "}
      <div>
        <Input placeholder="username" />
        <Input placeholder="password" />
        <button onClick={handleLogin}>Login With Google</button>
      </div>
    </div>
  );
};

export default page;
