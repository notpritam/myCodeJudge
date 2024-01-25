"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Code, Plus, Users } from "lucide-react";
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
import { set } from "zod";

interface CodeSnippet {
  lang: string;
  language: string;
  code: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface Question {
  title: string;
  "title-slug": string;
  level: string;
  content: string;
  code: CodeSnippet[];
  testCases: TestCase[];
}

function Page() {
  const [selectedTab, setSelectedTab] = useState<String>("dashboard");

  const data: Payment[] = [];
  const [addQuestion, setAddQuestion] = useState(false);

  const [addQuestionObject, setAddQuestionObject] = useState<Question>({
    title: "",
    "title-slug": "",
    level: "",
    content: "",
    code: [],
    testCases: [],
  });

  const [languagesList, setLanguageList] = useState<CodeSnippet[]>([
    {
      lang: "javascript",
      language: "Javascript",
      code: `function add(a,b){
        return a+b;
      }`,
    },
    {
      lang: "python",
      language: "Python",
      code: `def add(a,b):
        return a+b`,
    },
    {
      lang: "cpp",
      language: "C++",
      code: `int add(int a,int b){}`,
    },
  ]);

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [currentTestCase, setCurrentTestCase] = useState<TestCase>({
    input: "",
    output: "",
  });

  // const [codeSnippet, setCodeSnippet] = useState<CodeSnippet>({
  //   lang: "",
  //   language: "",
  //   code: "",
  // });

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
                <>
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
                      <DropdownMenuItem>
                        <Button
                          onClick={() =>
                            setAddQuestionObject({
                              ...addQuestionObject,
                              level: "easy",
                            })
                          }
                        >
                          Easy
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setAddQuestionObject({
                            ...addQuestionObject,
                            level: "medium",
                          })
                        }
                      >
                        {/* <Button
                          
                        >
                          Medium
                        </Button> */}
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button
                          onClick={() =>
                            setAddQuestionObject({
                              ...addQuestionObject,
                              level: "hard",
                            })
                          }
                        >
                          Hard
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Add Question Content */}

                  <TextEditor />

                  {/* Add Code Snippets */}

                  <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                      {languagesList.map((item) => (
                        <TabsTrigger value={item.lang}>
                          {item.language}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {languagesList.map((item) => (
                      <TabsContent value={item.lang}>
                        <Editor
                          height="50vh"
                          defaultLanguage={item.lang}
                          defaultValue={item.code}
                          theme="vs-dark"
                          width="80vh"
                          onChange={(e) => {
                            console.log(e);
                            const updatedList = languagesList.map(
                              (langItem) => {
                                if (langItem.lang === item.lang) {
                                  return { ...langItem, code: e as string };
                                }
                                return langItem;
                              }
                            );

                            setLanguageList(updatedList);
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
                          output: value,
                        });
                      }}
                    />
                    <Button
                      onClick={() =>
                        setTestCases([...testCases, currentTestCase])
                      }
                    >
                      Add New
                    </Button>

                    <div className="flex flex-col gap-2">
                      {testCases.map((item) => {
                        console.log(item);
                        return (
                          <div className="flex gap-2">
                            {}
                            <span>
                              Input :- {item.input} && Output :- {item.output}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;
