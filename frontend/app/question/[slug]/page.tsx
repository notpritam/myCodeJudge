"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ChevronsDownUp } from "lucide-react";
import { set } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Header from "@/components/Header";
import useStore from "@/lib/store/UserStore";

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
  titleSlug: string;
  likes: number;
  dislikes: number;
  content: string;
  codeSnippets: CodeSnippet[];
  testCases: TestCase;
  __v: number;
}

interface CodeResponse {
  error: boolean;
  message: string;
  expectedOutput: string;
  success: boolean;
  input: string;
  outputValue: string;
}
const TitleAndDes = () => {
  <>
    <span className="font-bold text-black text-8">Two Sum</span>
  </>;
};

function Page({ params }: { params: { slug: string } }) {
  const [codeResponse, setCodeResponse] = useState<CodeResponse>(
    {} as CodeResponse
  );

  const { isLogged, token, logOut } = useStore();
  const [questionData, setQuestionData] = useState<Question>({} as Question);
  console.log(params.slug);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [selectedLangIndex, setSelectedLangIndex] = useState(0);

  const getQuestion = async () => {
    const result = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/questions/get/" + params.slug
    );
    console.log(result);
    setQuestionData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getQuestion();
  }, []);

  const evaluateCode = async () => {
    if (!isLogged) {
      toast.error("Please login to submit");
      return;
    } else {
      setEvaluating(true);
      const code = {
        questionId: params.slug,
        code: questionData.codeSnippets[selectedLangIndex].code,
        language: questionData.codeSnippets[selectedLangIndex].langSlug,
        questionDetails: questionData,
      };
      try {
        const result = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "/code/submit-code/" + params.slug,
          code,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(result.data);

        if (!result.data.error) {
          toast.success("Code Evaluated Successfully");
        } else {
          toast.error(result.data.message);
        }

        setCodeResponse(result.data);
      } catch (e: any) {
        toast.error(e.message as string);
        logOut();
      }
      setEvaluating(false);
    }
  };

  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    console.log("hhh", editor, monaco);
    editorRef.current = editor;
  }

  const [showConsole, setShowConsole] = useState(false);

  return (
    <div className="p-4 h-screen w-screen flex flex-col overflow-hidden dark bg-black">
      <Header />

      {loading ? (
        <div className="flex w-full h-full gap-8">
          <div className="p-8 flex w-full h-screen flex-1 gap-8 flex-col">
            <Skeleton className="w-[70%] h-[40px] rounded-sm"></Skeleton>
            <Skeleton className="w-[80%] h-[40%]"></Skeleton>
            <Skeleton className="w-[80%] h-[20%]"></Skeleton>
            <Skeleton className="w-[80%] h-[10%]"></Skeleton>
          </div>
          <div className="p-8 flex w-full h-full flex-1 gap-8 flex-col">
            <Skeleton className="w-[80%] h-[40px] rounded-sm"></Skeleton>
            <Skeleton className="w-[100%] h-[80%]"></Skeleton>
            <Skeleton className="w-[100%] h-[60px]"></Skeleton>
          </div>
        </div>
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-screen m-4 border-none  w-full rounded-lg border"
        >
          <ResizablePanel className="h-full w-full">
            <div className="h-full w-full">
              <Tabs defaultValue="des" className="h-full">
                <TabsList>
                  <TabsTrigger value={"des"}>Description</TabsTrigger>
                  <TabsTrigger value={"discussion"}>Disscussion</TabsTrigger>
                  <TabsTrigger value={"solution"}>Solutions</TabsTrigger>
                  <TabsTrigger value={"submission"}>Submission</TabsTrigger>
                </TabsList>

                <TabsContent className="h-full" value={"des"}>
                  <div
                    className="bg-black text-white h-[100%] overflow-y-auto  p-4"
                    dangerouslySetInnerHTML={{
                      __html: questionData.content?.replace(
                        `<div class="editor-input" contenteditable="true" role="textbox" spellcheck="true" data-lexical-editor="true" style="user-select: text; white-space: pre-wrap; word-break: break-word;"><p class="editor-paragraph ltr" dir="ltr" style="text-align: start;">`,
                        `<span class="question-title">${
                          questionData.title
                        } </br></span>
                        <div class="icon-list">
                        <span class="${questionData.level} level">${
                          questionData.level
                        }</span>
                        <span class="likes-count"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>${
                          questionData.likes
                        }</span>
                        <span class="likes-count"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-down"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>${
                          questionData.dislikes
                        }</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                        
                        </div>
                        <div class="icon-list">
                        ${questionData.companies
                          ?.map((item) => {
                            if (item.length > 2) {
                              return `<span class="company-card">${item}</span>`;
                            }
                          })
                          .toString()
                          .replace(",", "")}
                        </div>`
                      ),
                    }}
                  ></div>
                </TabsContent>
                <TabsContent className="h-full w-full" value={"discussion"}>
                  <div className="w-full">sdkjs</div>
                </TabsContent>
                <TabsContent
                  className="h-full w-full"
                  value={"solution"}
                ></TabsContent>
                <TabsContent
                  className="h-full w-full"
                  value={"submission"}
                ></TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
          <ResizableHandle className="w-[2px] bg-gray-600  hover:w-[4px] hover:bg-gray-500 " />
          <ResizablePanel className=" h-full w-full">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel
                style={{ flex: showConsole ? "70 1 0px" : "85 1 0px" }}
                className={showConsole ? "flex-[70]" : "flex-[85]"}
                defaultSize={85}
              >
                <Tabs
                  defaultValue="java"
                  className="h-full overflow-hidden w-full"
                >
                  <TabsList>
                    {questionData?.codeSnippets?.map((item, index) => (
                      <TabsTrigger
                        onClick={() => {
                          // console.log(item.langSlug);
                          setSelectedLangIndex(index);
                        }}
                        value={item.langSlug}
                      >
                        {item.lang}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {questionData.codeSnippets?.map((item) => (
                    <TabsContent
                      className="h-full overflow-y-auto"
                      value={item.langSlug}
                    >
                      <Editor
                        height={"100%"}
                        defaultLanguage={
                          item.lang == "C++" ? "cpp" : item.lang.toLowerCase()
                        }
                        defaultValue={item.code}
                        theme="vs-dark"
                        // defineTheme={{
                        //   themeName: "my-theme",
                        //   themeData: {
                        //     colors: {
                        //       "editor.background": "#000000",
                        //     },
                        //   },
                        // }}
                        width="100%"
                        options={{
                          minimap: {
                            enabled: false,
                          },
                          fontSize: 16,

                          // cursorStyle: "block",
                          wordWrap: "on",
                        }}
                        onChange={(e) => {
                          console.log(e);
                          const updatedList = questionData.codeSnippets.map(
                            (langItem) => {
                              if (langItem.lang === item.lang) {
                                return { ...langItem, code: e as string };
                              }
                              return langItem;
                            }
                          );
                          setQuestionData({
                            ...questionData,
                            codeSnippets: updatedList,
                          });
                        }}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </ResizablePanel>
              <ResizableHandle className="h-[1.5rem] bg-gray-500" />
              <ResizablePanel
                style={{ flex: showConsole ? "30 1 0px" : "15 1 0px" }}
                // className={showConsole ? "flex-[30]" : "flex-[15]"}
                // defaultSize={15}
                className="overfow-hidden w-full"
              >
                <Collapsible
                  open={showConsole}
                  className="dark text-white overflow-hidden w-full h-full"
                >
                  <CollapsibleTrigger className="flex justify-between w-full p-4 pb-0">
                    <span className="flex gap-4">
                      Console{" "}
                      <ChevronsDownUp
                        onClick={() => setShowConsole(!showConsole)}
                      />
                    </span>
                    {/* <Button onClick={evaluateCode}>Run</Button> */}
                    <Button
                      disabled={evaluating}
                      className="bg-green-700 text-white"
                      onClick={() => {
                        evaluateCode();
                        setShowConsole(true);
                      }}
                    >
                      {evaluating ? "Evaluating..." : "Submit"}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="h-full  p-8 pt-0 overflow-y-auto w-full">
                    {evaluating ? (
                      "Evaluating..."
                    ) : (
                      <>
                        <div className="flex h-full overflow-y-auto gap-4 text-white">
                          <div className="flex  gap-8 h-full overflow-y-auto">
                            <span>{codeResponse.message}</span>
                            <span>
                              <strong>Input</strong> :{" "}
                              {codeResponse.input
                                ?.split("\n")
                                .map((item: string) => {
                                  return <p>{item}</p>;
                                })}
                            </span>
                            <span>
                              <strong>Expected Output</strong> :{" "}
                              {codeResponse.expectedOutput
                                ?.split("\n")
                                .map((item: string) => {
                                  return <p>{item}</p>;
                                })}
                            </span>
                            <span>
                              <strong>Output</strong> :{" "}
                              {codeResponse.outputValue
                                ?.split("\n")
                                .map((item: string) => {
                                  return <p>{item}</p>;
                                })}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <main className="flex h-[100%] p-4 gap-8"></main>
    </div>
  );
}

export default Page;
