"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Code, Plus, Users } from "lucide-react";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { Payment, columns } from "./columns";

function Page() {
  const [selectedTab, setSelectedTab] = useState<String>("dashboard");

  const data: Payment[] = [];

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

      <main className="flex  min-h-[calc(100%-24px)] ">
        <div className="flex flex-col pt-4 gap-4 pr-4 bg-black  border-r-2 h-[100%]">
          <Button onClick={() => setSelectedTab("questions")}>
            <Code />
          </Button>
          <Button onClick={() => setSelectedTab("users")}>
            <Users />
          </Button>
        </div>

        {selectedTab === "dashboard" && <div className="h-full w-full"></div>}

        {selectedTab === "questions" && (
          <div className="h-full w-full p-4">
            {/* Heading of Section */}
            <div>
              <span className="text-[1.5rem] dark:text-primary">Questions</span>
              <Button className="float-right">
                <Plus /> Add New
              </Button>
            </div>

            {/* Questions List */}

            <div className="container dark text-white mx-auto py-10">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Page;

const steeperComponent = () => {
  return (
    <div data-hs-stepper>
      {/* <!-- Stepper Nav --> */}
      <ul className="relative flex flex-row gap-x-2">
        <li
          className="flex items-center gap-x-2 shrink basis-0 flex-1 group"
          data-hs-stepper-nav-item='{
      "index": 1
    }'
        >
          <span className="min-w-[28px] min-h-[28px] group inline-flex items-center text-xs align-middle">
            <span className="w-7 h-7 flex justify-center items-center flex-shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 dark:bg-gray-700 dark:text-white dark:group-focus:bg-gray-600 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
              <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                1
              </span>
              <svg
                className="hidden flex-shrink-0 h-3 w-3 hs-stepper-success:block"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="ms-2 text-sm font-medium text-gray-800">Step</span>
          </span>
          <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600"></div>
        </li>

        <li
          className="flex items-center gap-x-2 shrink basis-0 flex-1 group"
          data-hs-stepper-nav-item='{
      "index": 2
    }'
        >
          <span className="min-w-[28px] min-h-[28px] group inline-flex items-center text-xs align-middle">
            <span className="w-7 h-7 flex justify-center items-center flex-shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 dark:bg-gray-700 dark:text-white dark:group-focus:bg-gray-600 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
              <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                2
              </span>
              <svg
                className="hidden flex-shrink-0 h-3 w-3 hs-stepper-success:block"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="ms-2 text-sm font-medium text-gray-800">Step</span>
          </span>
          <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600"></div>
        </li>

        <li
          className="flex items-center gap-x-2 shrink basis-0 flex-1 group"
          data-hs-stepper-nav-item='{
        "index": 3
      }'
        >
          <span className="min-w-[28px] min-h-[28px] group inline-flex items-center text-xs align-middle">
            <span className="w-7 h-7 flex justify-center items-center flex-shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full group-focus:bg-gray-200 dark:bg-gray-700 dark:text-white dark:group-focus:bg-gray-600 hs-stepper-active:bg-blue-600 hs-stepper-active:text-white hs-stepper-success:bg-blue-600 hs-stepper-success:text-white hs-stepper-completed:bg-teal-500 hs-stepper-completed:group-focus:bg-teal-600">
              <span className="hs-stepper-success:hidden hs-stepper-completed:hidden">
                3
              </span>
              <svg
                className="hidden flex-shrink-0 h-3 w-3 hs-stepper-success:block"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span className="ms-2 text-sm font-medium text-gray-800">Step</span>
          </span>
          <div className="w-full h-px flex-1 bg-gray-200 group-last:hidden hs-stepper-success:bg-blue-600 hs-stepper-completed:bg-teal-600"></div>
        </li>
        {/* <!-- End Item --> */}
      </ul>
      {/* <!-- End Stepper Nav --> */}

      {/* <!-- Stepper Content --> */}
      <div className="mt-5 sm:mt-8">
        {/* <!-- First Contnet --> */}
        <div
          data-hs-stepper-content-item='{
      "index": 1
    }'
        >
          <div className="p-4 h-48 bg-gray-50 flex justify-center items-center border border-dashed border-gray-200 rounded-xl">
            <h3 className="text-gray-500">First content</h3>
          </div>
        </div>
        {/* <!-- End First Contnet --> */}

        {/* <!-- First Contnet --> */}
        <div
          data-hs-stepper-content-item='{
      "index": 2
    }'
          style={{ display: "none" }}
        >
          <div className="p-4 h-48 bg-gray-50 flex justify-center items-center border border-dashed border-gray-200 rounded-xl">
            <h3 className="text-gray-500">Second content</h3>
          </div>
        </div>
        {/* <!-- End First Contnet --> */}

        {/* <!-- First Contnet --> */}
        <div
          data-hs-stepper-content-item='{
      "index": 3
    }'
          style={{ display: "none" }}
        >
          <div className="p-4 h-48 bg-gray-50 flex justify-center items-center border border-dashed border-gray-200 rounded-xl">
            <h3 className="text-gray-500">Third content</h3>
          </div>
        </div>
        {/* <!-- End First Contnet --> */}

        {/* <!-- Final Contnet --> */}
        <div
          data-hs-stepper-content-item='{
      "isFinal": true
    }'
          style={{ display: "none" }}
        >
          <div className="p-4 h-48 bg-gray-50 flex justify-center items-center border border-dashed border-gray-200 rounded-xl">
            <h3 className="text-gray-500">Final content</h3>
          </div>
        </div>
        {/* <!-- End Final Contnet --> */}

        {/* <!-- Button Group --> */}
        <div className="mt-5 flex justify-between items-center gap-x-2">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            data-hs-stepper-back-btn
          >
            <svg
              className="flex-shrink-0 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            data-hs-stepper-next-btn
          >
            Next
            <svg
              className="flex-shrink-0 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            data-hs-stepper-finish-btn
            style={{ display: "none" }}
          >
            Finish
          </button>
          <button
            type="reset"
            className="py-2 px-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            data-hs-stepper-reset-btn
            style={{ display: "none" }}
          >
            Reset
          </button>
        </div>
        {/* <!-- End Button Group --> */}
      </div>
    </div>
  );
};
