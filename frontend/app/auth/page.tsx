"use client";

import { Input } from "@/components/ui/input";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";

const page = () => {
  const handleLogin = async (token: string) => {
    const response = await axios.post(
      "http://localhost:3001/api/auth/google/callback",
      { token: token }
    );

    // const recivedToken = response.data.token;

    // // Store the token in a cookie
    // document.cookie = `token=${recivedToken}; path=/`;
    // console.log(recivedToken);

    if (response.status === 200) {
      console.log("success");
      console.log(response.data.user);
      const token = response.data.token;
      // Store the token in local storage
      localStorage.setItem("token", token);
      window.location.href = "/question/two-sum";
    }
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
