"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useStore from "@/lib/store/UserStore";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const page = () => {
  const { login, isLogged } = useStore();
  const searchParams = useSearchParams();

  const search = searchParams.get("callback");

  console.log(search, "this is callback");

  if (isLogged) {
    window.location.href = `${search}`;
  }

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
      console.log(response.data);
      const token = response.data.token;
      // Store the token in local storage
      localStorage.setItem("token", token);
      login(response.data.user, token);
      // window.location.href = "/question/two-sum";
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
    <div className="dark p-4 bg-black overflow-hidden min-h-screen h-screen flex flex-col min-w-screen">
      <header className="flex w-full justify-between border-b-2 pb-2">
        <Link
          href={"/"}
          className="font-bold dark:text-primary  text-[18px] tracking-widest "
        >
          MyCodeJudge
        </Link>
      </header>
      <div className="w-full h-screen flex justify-center items-center">
        <Button onClick={() => loginClick()}>Login With Google</Button>
      </div>
    </div>
  );
};

export default page;
