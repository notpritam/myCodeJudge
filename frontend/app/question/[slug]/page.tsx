"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  input: string;
  outputValue: string;
}

function Page({ params }: { params: { slug: string } }) {
  const [codeResponse, setCodeResponse] = useState<CodeResponse>(
    {} as CodeResponse
  );
  const [questionData, setQuestionData] = useState<Question>({} as Question);
  console.log(params.slug);
  const [loading, setLoading] = useState(false);

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
  };

  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    console.log("hhh", editor, monaco);
    editorRef.current = editor;
  }

  return (
    <div className="p-4 h-screen w-screen dark bg-black">
      <header className="flex justify-between border-b-2 pb-2">
        <span className="font-bold dark:text-primary tracking-wider text-[18px]">
          MyCodeJudge
        </span>

        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </header>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="w-full p-4 flex gap-8">
            <div
              className="bg-gray-200  p-4"
              dangerouslySetInnerHTML={{
                __html: questionData.content?.replace(
                  `<div class="editor-input" contenteditable="true" role="textbox" spellcheck="true" data-lexical-editor="true" style="user-select: text; white-space: pre-wrap; word-break: break-word;"><p class="editor-paragraph ltr" dir="ltr" style="text-align: start;">`,
                  ""
                ),
              }}
            ></div>
            <Tabs defaultValue="java" className="">
              <TabsList>
                {questionData?.codeSnippets?.map((item) => (
                  <TabsTrigger value={item.langSlug}>{item.lang}</TabsTrigger>
                ))}
              </TabsList>

              {questionData.codeSnippets?.map((item) => (
                <TabsContent value={item.langSlug}>
                  <Editor
                    height="60vh"
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
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </>
      )}

      <div className="flex justify-between">
        <div className="flex flex-col gap-4 text-white">
          {codeResponse.error ? (
            <>
              <span>
                <strong>Error</strong> : {codeResponse.message}
              </span>
            </>
          ) : (
            <>
              <span>
                <strong>Success</strong> : {codeResponse.message}
              </span>
              <span>
                <strong>Input</strong> : {codeResponse.input}
              </span>
              <span>
                <strong>Expected Output</strong> : {codeResponse.expectedOutput}
              </span>
              <span>
                <strong>Output</strong> : {codeResponse.outputValue}
              </span>
            </>
          )}
        </div>
        <div className="flex justify-end w-full pt-8">
          <Button onClick={evaluateCode}>Evaluate Code</Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
