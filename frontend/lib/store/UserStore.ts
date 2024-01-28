import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  givenName: string;
  familyName: string;
  email: string;
  picture: string;
  token: string;
  isLogged: boolean;
  count: number;
  logOut: () => void;
  login: (user: any, token: any) => void;
};

const useStore = create<User>()(
  persist(
    (set) => ({
      isLogged: false,
      givenName: "",
      familyName: "",
      email: "",
      picture: "",
      token: "",

      count: 1,
      login: (user, token) =>
        set((state) => ({
          isLogged: true,
          givenName: user.given_name,
          familyName: user.family_name,
          email: user.email,
          picture: user.picture,
          token: token,
        })),

      logOut: () => set((state) => ({ isLogged: false, token: "" })),
    }),
    { name: "user-storage" }
  )
);

export default useStore;
