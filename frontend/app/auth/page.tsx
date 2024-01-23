"use client";

import { Input } from "@/components/ui/input";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";

const page = () => {
  const handleLogin = async (token: string) => {
    const data = await axios.post(
      "http://localhost:3001/api/auth/google/callback",
      { token: token }
    );
    console.log(data);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const loginClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);

      const data = await handleLogin(tokenResponse.access_token);
    },
  });

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
        <button onClick={() => loginClick()}>Login With Google</button>
      </div>
    </div>
  );
};

export default page;
