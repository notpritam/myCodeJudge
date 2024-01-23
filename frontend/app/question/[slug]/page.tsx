"use client";
import axios from "axios";
import React, { useState } from "react";

function Page({ params }: { params: { slug: string } }) {
  const [userData, setUserData] = useState({} as any);
  console.log(params.slug);

  const evaluateCode = async () => {
    const token = localStorage.getItem("token");
    console.log(token, "frontend token");
    const questionData = {
      questionId: params.slug,
      code: `code`,
      language: `javascript`,
    };
    const result = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/code/submit-code",
      questionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUserData(result.data);
    console.log(result);
  };

  return (
    <div>
      <button onClick={evaluateCode}>Evaluate Code</button>
      {userData && <p>{userData.body}</p>}
    </div>
  );
}

export default Page;
