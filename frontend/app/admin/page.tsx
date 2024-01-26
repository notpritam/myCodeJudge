"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Code, Delete, Plus, Trash2, Users } from "lucide-react";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { Payment, columns } from "./columns";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextEditor from "@/components/editor/Editor";
import { Editor } from "@monaco-editor/react";
import { useSearchParams } from "next/navigation";
import { set } from "zod";
import axios from "axios";

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
  title: string;
  "title-slug": string;
  level: string;
  content: string;
  codeSnippets: CodeSnippet[];
  topics: string[];
  companies: string[];
  testCases: TestCase[];
}

function Page() {
  const searchParams = useSearchParams();

  const section = searchParams.get("section");

  const [selectedTab, setSelectedTab] = useState<String>(
    section || "dashboard"
  );

  const data: Payment[] = [];
  const [addQuestion, setAddQuestion] = useState(false);

  const [addQuestionObject, setAddQuestionObject] = useState<Question>({
    title: "",
    "title-slug": "",
    level: "",
    content: "",
    codeSnippets: [
      {
        langSlug: "javascript",
        lang: "Javascript",
        code: `function add(a,b){
        return a+b;
      }`,
      },
      {
        langSlug: "python",
        lang: "Python",
        code: `def add(a,b):
        return a+b`,
      },
      {
        langSlug: "cpp",
        lang: "C++",
        code: `int add(int a,int b){}`,
      },
    ],
    companies: [],
    topics: [],
    testCases: [],
  });

  const [currentTestCase, setCurrentTestCase] = useState<TestCase>({
    input: "",
    expectedOutput: "",
  });

  const [currentTopic, setCurrentTopic] = useState<string>("");

  const [currentCompany, setCurrentCompany] = useState<string>("");

  // Function to add dummy data of Payment structure to data array
  const addDummyData = () => {
    for (let i = 0; i < 100; i++) {
      const dummyPayment: Payment = {
        id: `${i + 1}`, // Unique id for each entry
        amount: 100 + i, // Unique amount for each entry
        status: "success", // Add status field
        email: `dummy${i + 1}@example.com`, // Unique email for each entry
      };
      data.push(dummyPayment);
    }
  };

  addDummyData();

  const updateContent = (content: string) => {
    setAddQuestionObject({
      ...addQuestionObject,
      content: content,
    });
    console.log(content);
  };

  const submitQuestion = async () => {
    const question = {
      ...addQuestionObject,
    };

    const res = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/questions/add",
      question
    );

    if (res.status === 200) {
      console.log("Question Added Successfully");
    }

    console.log(question);
  };

  return (
    <div className="min-h-screen max-h-screen min-w-screen max-w-screen  p-8 pt-4 dark bg-black">
      <header className="flex justify-between border-b-2 pb-2">
        <span className="font-bold dark:text-primary tracking-wider text-[18px]">
          MyCodeJudge
        </span>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </header>

      <main className="flex max-h-[100%] overflow-y-auto  min-h-[calc(100%-24px)] ">
        <div className="flex flex-col pt-4 gap-4 pr-4 bg-black  border-r-2 ">
          <Button onClick={() => setSelectedTab("questions")}>
            <Code />
          </Button>
          <Button onClick={() => setSelectedTab("users")}>
            <Users />
          </Button>
        </div>

        {selectedTab === "dashboard" && <div className="h-full w-full"></div>}

        {selectedTab === "questions" && (
          <div className="overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar  w-full p-4">
            {/* Heading of Section */}
            <div>
              <span className="text-[1.5rem] dark:text-primary">Questions</span>
              <Button
                onClick={() => setAddQuestion(true)}
                className="float-right"
              >
                <Plus /> Add New
              </Button>
            </div>

            {/* Questions List */}

            <div className="container dark text-white mx-auto py-10">
              {!addQuestion ? (
                <DataTable columns={columns} data={data} />
              ) : (
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Enter Question Title"
                    onChange={(e) =>
                      setAddQuestionObject({
                        ...addQuestionObject,
                        title: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Enter Question Slug"
                    onChange={(e) =>
                      setAddQuestionObject({
                        ...addQuestionObject,
                        "title-slug": e.target.value,
                      })
                    }
                  />

                  {/* Add Question Level */}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      Choose Level :-{" "}
                      {addQuestionObject.level ? (
                        <Badge
                          variant="outline"
                          className="capitalize text-[1rem]"
                        >
                          {addQuestionObject.level}
                        </Badge>
                      ) : (
                        "Select"
                      )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          setAddQuestionObject({
                            ...addQuestionObject,
                            level: "easy",
                          })
                        }
                      >
                        Easy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setAddQuestionObject({
                            ...addQuestionObject,
                            level: "medium",
                          })
                        }
                      >
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setAddQuestionObject({
                            ...addQuestionObject,
                            level: "hard",
                          })
                        }
                      >
                        Hard
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Add Topics Now  */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[1.5rem] dark:text-primary">
                      Topic List
                    </span>
                    <Input
                      placeholder="Enter Topic"
                      onChange={(e) => {
                        setCurrentTopic(e.target.value);
                      }}
                    />

                    <Button
                      onClick={() =>
                        setAddQuestionObject({
                          ...addQuestionObject,
                          topics: [...addQuestionObject.topics, currentTopic],
                        })
                      }
                    >
                      Add New
                    </Button>

                    <div className="flex gap-2">
                      {addQuestionObject.topics.map((item, index) => {
                        return (
                          <Badge className="flex gap-4" key={index}>
                            {item}{" "}
                            <Trash2
                              className="cursor-pointer"
                              onClick={() => {
                                const updatedList =
                                  addQuestionObject.topics.filter(
                                    (topic) => topic !== item
                                  );

                                setAddQuestionObject({
                                  ...addQuestionObject,
                                  topics: updatedList,
                                });
                              }}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Companies Now  */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[1.5rem] dark:text-primary">
                      Companies List
                    </span>
                    <Input
                      placeholder="Enter Topic"
                      onChange={(e) => {
                        setCurrentCompany(e.target.value);
                      }}
                    />

                    <Button
                      onClick={() =>
                        setAddQuestionObject({
                          ...addQuestionObject,
                          companies: [
                            ...addQuestionObject.companies,
                            currentCompany,
                          ],
                        })
                      }
                    >
                      Add New
                    </Button>

                    <div className="flex gap-2">
                      {addQuestionObject.companies.map((item, index) => {
                        return (
                          <Badge className="flex gap-4" key={index}>
                            {item}{" "}
                            <Trash2
                              className="cursor-pointer"
                              onClick={() => {
                                const updatedList =
                                  addQuestionObject.companies.filter(
                                    (com) => com !== item
                                  );
                                setAddQuestionObject({
                                  ...addQuestionObject,
                                  companies: updatedList,
                                });
                              }}
                            />
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Question Content */}

                  <TextEditor updateContent={updateContent} />

                  {/* Add Code Snippets */}

                  <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                      {addQuestionObject.codeSnippets.map((item) => (
                        <TabsTrigger value={item.langSlug}>
                          {item.lang}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {addQuestionObject.codeSnippets.map((item) => (
                      <TabsContent value={item.langSlug}>
                        <Editor
                          height="50vh"
                          defaultLanguage={item.lang}
                          defaultValue={item.code}
                          theme="vs-dark"
                          width="80vh"
                          onChange={(e) => {
                            console.log(e);
                            const updatedList =
                              addQuestionObject.codeSnippets.map((langItem) => {
                                if (langItem.lang === item.lang) {
                                  return { ...langItem, code: e as string };
                                }
                                return langItem;
                              });

                            setAddQuestionObject({
                              ...addQuestionObject,
                              codeSnippets: updatedList,
                            });
                          }}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>

                  {/* Add TestCases Now  */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[1.5rem] dark:text-primary">
                      Test Cases
                    </span>
                    <Input
                      placeholder="Enter Input"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s+/g, "\n"); // Replace spaces with newline characters
                        setCurrentTestCase({
                          ...currentTestCase,
                          input: value,
                        });
                      }}
                    />
                    <Input
                      placeholder="Enter Output"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s+/g, "\n"); // Replace spaces with newline characters
                        setCurrentTestCase({
                          ...currentTestCase,
                          expectedOutput: value,
                        });
                      }}
                    />
                    <Button
                      onClick={() =>
                        setAddQuestionObject({
                          ...addQuestionObject,
                          testCases: [
                            ...addQuestionObject.testCases,
                            currentTestCase,
                          ],
                        })
                      }
                    >
                      Add New
                    </Button>

                    <div className="flex flex-col gap-2">
                      {addQuestionObject.testCases.map((item) => {
                        console.log(item);
                        return (
                          <div key={item.input} className="flex gap-2">
                            <span>
                              Input :- <Badge>{item.input}</Badge> && Output :-
                              <Badge>{item.expectedOutput}</Badge>
                            </span>
                            <Trash2
                              onClick={() => {
                                const updatedList =
                                  addQuestionObject.testCases.filter(
                                    (testCase) => testCase !== item
                                  );
                                setAddQuestionObject({
                                  ...addQuestionObject,
                                  testCases: updatedList,
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button onClick={submitQuestion}>Submit Question</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;
