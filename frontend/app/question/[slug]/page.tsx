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
  const [questionData, setQuestionData] = useState<Question>({} as Question);
  console.log(params.slug);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

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
    setEvaluating(true);
    const token = localStorage.getItem("token");
    console.log(token, "frontend token");
    const code = {
      questionId: params.slug,
      code: questionData.codeSnippets[0].code,
      language: `java`,
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
    }
    setEvaluating(false);
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
      <header className="flex justify-between border-b-2 pb-2">
        <span className="font-bold dark:text-primary tracking-wider text-[18px]">
          MyCodeJudge
        </span>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </header>

      {/* <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup> */}

      <main className="flex h-[100%] p-4 gap-8">
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
                className="bg-gray-200 h-[100%] overflow-y-auto  p-4"
                dangerouslySetInnerHTML={{
                  __html: questionData.content?.replace(
                    `<div class="editor-input" contenteditable="true" role="textbox" spellcheck="true" data-lexical-editor="true" style="user-select: text; white-space: pre-wrap; word-break: break-word;"><p class="editor-paragraph ltr" dir="ltr" style="text-align: start;">`,
                    ""
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

        <Tabs defaultValue="java" className="h-full overflow-hidden w-full">
          <TabsList>
            {questionData?.codeSnippets?.map((item) => (
              <TabsTrigger value={item.langSlug}>{item.lang}</TabsTrigger>
            ))}
          </TabsList>

          {questionData.codeSnippets?.map((item) => (
            <TabsContent
              className="h-full overflow-y-auto"
              value={item.langSlug}
            >
              <Editor
                height={showConsole ? "70%" : "87%"}
                defaultLanguage={
                  item.lang == "C++" ? "cpp" : item.lang.toLowerCase()
                }
                defaultValue={item.code}
                theme="vs-dark"
                width="100vh"
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
              <Collapsible open={showConsole} className="dark text-white">
                <CollapsibleTrigger className="flex justify-between w-full p-4">
                  <span className="flex gap-4">
                    Console{" "}
                    <ChevronsDownUp
                      onClick={() => setShowConsole(!showConsole)}
                    />
                  </span>
                  {/* <Button onClick={evaluateCode}>Run</Button> */}
                  <Button
                    disabled={evaluating}
                    className="bg-green-700"
                    onClick={() => {
                      evaluateCode();
                      setShowConsole(true);
                    }}
                  >
                    {evaluating ? "Evaluating..." : "Submit"}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="h-full ">
                  {evaluating ? (
                    "Evaluating..."
                  ) : (
                    <>
                      <div className="flex h-full overflow-y-auto gap-4 text-white">
                        {codeResponse.error ? (
                          <>
                            <span>
                              <strong>Error</strong> : {codeResponse.message}
                            </span>
                          </>
                        ) : (
                          <div className="flex flex-col h-full overflow-y-auto">
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
                        )}
                      </div>
                    </>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}

export default Page;
