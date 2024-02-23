"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Code, Plus, Trash2, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextEditor from "@/components/editor/Editor";
import { Editor } from "@monaco-editor/react";
import { useSearchParams } from "next/navigation";
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
  testCases: TestCase;
}

export interface SavedQuestion {
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

function Page() {
  const searchParams = useSearchParams();

  const section = searchParams.get("section");

  const [selectedTab, setSelectedTab] = useState<String>(
    section || "dashboard"
  );

  const [questionList, setQuestionList] = useState<SavedQuestion[]>([]);
  const [addQuestion, setAddQuestion] = useState(false);

  const [addQuestionObject, setAddQuestionObject] = useState<Question>({
    title: "",
    "title-slug": "",
    level: "",
    content: "",
    codeSnippets: [
      {
        langSlug: "java",
        lang: "Java",
        code: `function add(a,b){
        return a+b;
      }`,
      },
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
    testCases: {
      input: "",
      expectedOutput: "",
    },
  });

  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [currentCompany, setCurrentCompany] = useState<string>("");

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

  const getQuestions = async () => {
    try {
      const result = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/questions/get"
      );
      setQuestionList(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

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
                <DataTable columns={columns} data={questionList} />
              ) : (
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Enter Question Title"
                    onChange={(e) => {
                      const titleSlug = e.target.value
                        .replace(/\s+/g, "-")
                        .toLowerCase();
                      setAddQuestionObject({
                        ...addQuestionObject,
                        title: e.target.value,
                        "title-slug": titleSlug,
                      });
                    }}
                  />
                  <Input
                    placeholder="Enter Question Slug"
                    value={addQuestionObject["title-slug"]}
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
                          defaultLanguage={
                            item.lang == "C++" ? "cpp" : item.lang.toLowerCase()
                          }
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
                  <Tabs defaultValue="input" className="w-[400px]">
                    <TabsList>
                      <TabsTrigger value="input">Input</TabsTrigger>
                      <TabsTrigger value="ouput">Output</TabsTrigger>
                    </TabsList>

                    <TabsContent value="input">
                      <Editor
                        height="50vh"
                        defaultValue={addQuestionObject.testCases.input}
                        theme="vs-dark"
                        width="80vh"
                        onChange={(e) => {
                          console.log(e);
                          setAddQuestionObject({
                            ...addQuestionObject,
                            testCases: {
                              ...addQuestionObject.testCases,
                              input: e as string,
                            },
                          });
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="ouput">
                      <Editor
                        height="50vh"
                        defaultValue={
                          addQuestionObject.testCases.expectedOutput
                        }
                        theme="vs-dark"
                        width="80vh"
                        onChange={(e) => {
                          console.log(e);
                          setAddQuestionObject({
                            ...addQuestionObject,
                            testCases: {
                              ...addQuestionObject.testCases,
                              expectedOutput: e as string,
                            },
                          });
                        }}
                      />
                    </TabsContent>
                  </Tabs>

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
