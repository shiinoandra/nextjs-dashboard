"use client";
import Layout from "../components/Layout";

import { useState, useEffect, useMemo, mutate, useCallback } from "react";
import useSWR from "swr";

import {
  ArrowPathIcon,
  ArrowDownCircleIcon,
  PauseIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

export default function Downloads() {
  const [DlQueue, setDlQueue] = useState([]);
  const flask_url = "http://192.168.18.17:5000";

  const copy_to_clipboard = (text) => {
      navigator.clipboard.writeText(text);
    };

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const {
    data: queueData,
    error: queueError,
    isLoading: queueLoading,
  } = useSWR("/api/download?mode=full", fetcher, { refreshInterval: 2000 });

  useEffect(() => {
    if (queueData && queueData.queue) {
      setDlQueue(queueData.queue);
    }
  }, [queueData]);

  const handleDownload = async (id) => {
    try {
      const res = await fetch(flask_url + "/download/new/" + id);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

    const handleCancelDownload = async (id) => {
      try {
        const res = await fetch(flask_url + "/download/delete/" + id);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

  return (
    <Layout>
      <div className="font-sans max-w-full mx-auto ">
        <h1 className="text-2xl font-extrabold text-gray-800">In Queue</h1>
        <div className="grid min-[900px]:grid-cols-3 gap-4 mt-8">
          <div className="col-span-1 min-[900px]:col-span-2 space-y-4 order-2 min-[900px]:order-1 ">
            {/* start of card */}

            {DlQueue.filter((x) => x.flag === "que").map((model) => (
              <div
                className=" flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)]"
                key={model._id}
              >
                <div className="flex gap-4 w-full min-w-96">
                  <div className="w-28 h-28 shrink-0">
                    <img
                      src={model.image_url}
                      className="m-auto w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-800">
                        {model.model_name}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500 mt-2 flex items-center gap-2">
                        Version : {model.model_version}
                      </p>
                    </div>

                    <button
                      className="inline-flex rounded-md shadow-sm mb-2 hover:bg-gray-800 hover:text-white w-fit "
                      role="group"
                    >
                      <button
                        onClick={() =>
                          copy_to_clipboard(
                            model._id
                          )
                        }
                        type="button"
                        className="inline-flex items-center px-2 py-2 text-xs font-medium  bg-transparent border border-gray-900 rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
                      >
                        {model.model_id}
                      </button>
                      <button
                        onClick={() =>
                          copy_to_clipboard(
                            model.model_name ? model.model_name : ""
                          )
                        }
                        type="button"
                        className="inline-flex items-center px-2 py-2 text-xs font-medium  bg-transparent border border-gray-900 rounded-e-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
                      >
                        {model.version_id}
                      </button>
                    </button>
                  </div>
                </div>

                <div className="ml-auto flex flex-col w-fit items-center justify-center ">
                  <div className="flex-col gap-6 ">
                    <button
                      onClick={() => handleCancelDownload(model._id)}
                      className="inline-flex min-h-[3rem] w-full bg-stone-100 hover:bg-red-300 text-gray-900 font-semibold justify-center items-center  min-[900px]:items-start min-[900px]:justify-start  rounded-md px-4 py-2 gap-2"
                    >
                      <TrashIcon className="w-8 h-8"></TrashIcon>
                      <span className="hidden md:inline-flex">Cancel</span>
                    </button>
                    <button
                      className="inline-flex min-h-[3rem] w-full bg-stone-100 hover:bg-green-300 text-gray-900 font-semibold justify-center items-center min-[900px]:items-start min-[900px]:justify-start  rounded-md px-4 py-2 gap-2"
                      onClick={() => handleDownload(model._id)}
                    >
                      <ArrowPathIcon className="h-8 w-8" />
                      <span className="hidden md:inline-flex">Retry</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="order-1 min-[900px]:order-2 ">
            {DlQueue.some((x) => x.flag === "dl") ? (
              DlQueue.filter((x) => x.flag === "dl").map((model, index) => (
                <div className="w-full" key={index}>
                  <div className="h-2"></div>
                  <div className="flex items-start justify-center h-fit bg-red-lightest">
                    <div className="bg-white shadow-lg rounded-lg">
                      <div className="flex">
                        <div className="relative overflow-hidden bg-cover bg-no-repeat w-full aspect-[7/9]">
                          <img
                            className="m-auto w-full h-full object-cover"
                            src={model.image_url}
                          />
                        </div>
                      </div>
                      <div className="w-full p-4">
                        <div className="flex justify-center items-center sm:justify-start sm:items-start">
                          <h3 className="text-2xl text-grey-darkest font-medium pb-4">
                            {model.model_name || ""}
                          </h3>
                        </div>
                        <div className="flex flex-wrap justify-center items-center sm:inline-flex sm:justify-start gap-2 md:max-[1100px]:justify-center md:max-[1085px]:items-center">
                          <ArrowPathIcon className="w-6 h-6 animate-spin" />
                          <p className="text-m font-light text-grey mt-1 animate-pulse text-center">
                            Currently Downloading ...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full">
                <div className="h-2 bg-red-light"></div>
                <div className="flex items-start justify-center h-screen bg-red-lightest">
                  <div className="bg-white shadow-lg rounded-lg">
                    <div className="flex">
                      <div>
                        <img
                          className="w-full rounded block"
                          src="https://tailwindcss.com/img/card-top.jpg"
                        />
                      </div>
                    </div>
                    <div className="w-full p-4">
                      <div className="flex justify-center items-center sm:justify-start sm:items-start">
                        <h3 className="text-2xl text-grey-darkest font-medium pb-4">
                          No Downloads
                        </h3>
                      </div>
                      <div className="flex flex-wrap justify-center items-center sm:inline-flex sm:justify-start gap-2 md:max-[1085px]:justify-center md:max-[1085px]:items-center">
                        <PauseIcon className="w-6 h-6" />
                        <p className="text-m font-light text-grey mt-1 text-center">
                          No Model Being Downloaded
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
