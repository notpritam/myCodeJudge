"use client";
const page = () => {
  const handleLogin = () => {
    console.log("login");
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
        <button onClick={handleLogin}>Login With Google</button>
      </div>
    </div>
  );
};

export default page;
