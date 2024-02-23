"use client";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import axios from "axios";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

import Header from "@/components/Header";
interface CodeSnippet {
  lang: string;
  langSlug: string;
  code: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface Question {
  _id: string;
  level: string;
  topics: string[];
  companies: string[];
  title: string;
  "title-slug": string;
  likes: number;
  dislikes: number;
  content: string;
  codeSnippets: CodeSnippet[];
  testCases: TestCase;
  __v: number;
}

export default function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [loading, setLoading] = React.useState<boolean>(true);

  const categories = [
    { name: "Array", count: 1374 },
    { name: "String", count: 612 },
    { name: "Hash Table", count: 472 },
    { name: "Math", count: 429 },
    { name: "Dynamic Programming", count: 428 },
    { name: "Sorting", count: 315 },
    { name: "Greedy", count: 307 },
    { name: "Depth-First Search", count: 274 },
    { name: "Database", count: 225 },
    { name: "Binary Search", count: 224 },
    { name: "Breadth-First Search", count: 218 },
    { name: "Tree", count: 214 },
    { name: "Matrix", count: 196 },
    { name: "Two Pointers", count: 171 },
    { name: "Binary Tree", count: 169 },
    { name: "Bit Manipulation", count: 161 },
    { name: "Heap (Priority Queue)", count: 142 },
    { name: "Stack", count: 141 },
    { name: "Graph", count: 128 },
    { name: "Prefix Sum", count: 127 },
  ];

  const [questions, setQuestions] = React.useState<Question[]>([]);

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty == "easy") {
      return "text-green-500";
    } else if (difficulty == "medium") {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };

  const getQuestions = async () => {
    try {
      const result = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/questions/get"
      );
      setQuestions(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <main className="flex h-screen dark bg-black p-4  w-screen flex-col ">
      <Header />
      <div className="flex flex-wrap gap-2 p-12 pt-4 pb-0 mt-4">
        {categories.map((item, i) => (
          <div className="px-4 cursor-pointer py-2 text-gray-400 bg-gray-700 rounded-3xl">
            {item.name}
          </div>
        ))}
      </div>

      <div className="flex gap-8 text-white p-12">
        <div className="flex-[8] w-full">
          <span className="text-[2rem] tracking-widest ">Questions </span>
          <div className="w-full flex mt-12 mb-2">
            <span className="w-full text-[1.25rem] pl-4 tracking-widest text-gray-600">
              Title
            </span>
            <span className="w-[20%] text-[1.25rem] tracking-widest text-gray-600">
              Difficulty
            </span>
            <span className="w-[20%] text-[1.25rem] tracking-widest text-gray-600"></span>
          </div>

          {loading ? (
            <>
              {Array.from({ length: 5 }).map((item, i) => (
                <div
                  className={cn(
                    i % 2 == 0 ? "" : "",
                    "py-[10px] w-full flex justify-between bg-opacity-30 text-gray-300 px-2"
                  )}
                >
                  <Skeleton className="w-[60%] h-[20px]" />
                  <Skeleton className="w-[20%] h-[20px]" />
                  <Skeleton className="w-[10%] h-[20px]" />
                </div>
              ))}
            </>
          ) : (
            <>
              {questions?.map((item, i) => (
                <div
                  className={cn(
                    i % 2 == 0 ? "bg-gray-500" : "",
                    "py-[10px] w-full flex bg-opacity-30 text-gray-300 px-2"
                  )}
                >
                  <Link
                    href={`/question/${item["title-slug"]}`}
                    className="w-full pl-2"
                  >
                    {item.title}
                  </Link>
                  <span
                    className={cn(
                      getDifficultyColor(item.level),
                      "w-[20%] capitalize "
                    )}
                  >
                    {item.level}
                  </span>
                  <span className="w-[20%] text-opacity-40 cursor-pointer">
                    <MoreVertical />
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="flex-[2]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
      </div>
    </main>
  );
}
