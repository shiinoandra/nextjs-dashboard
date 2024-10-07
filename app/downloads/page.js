"use client";

import Layout from "../components/Layout";
import OpenSideBarButton from "../components/OpenSidebarButton";
import ModelDetail from "../components/ModelDetail";


import { useDataContext } from "../components/Layout";
import {
  useState,
  useEffect,
  useMemo,
  mutate,
  useCallback,
  useContext,
} from "react";
import useSWR from "swr";
import {
  ArrowPathIcon,
  ArrowDownCircleIcon,
  PauseIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function Downloads() {
  const [DlQueue, setDlQueue] = useState([]);
  const flask_url = "http://192.168.18.17:5000";
  const [currentPage, setCurrentPage] = useState(1);
  const dcontext = useDataContext();
  const [itemsPerPage, setitemsPerPage] = useState(5);

  const setScheduledSize = dcontext.setScheduledSize;
  const setDlQueueSize = dcontext.setDlQueueSize;
  const sidebarOpen = dcontext.sidebarOpen;
  const setSidebarOpen = dcontext.setSidebarOpen;
  const [showModelDetail, setShowModelDetail] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);


  const handleModelPerPageChange = (num) => {
    setitemsPerPage(num);
    setCurrentPage(1);
  };


  const copy_to_clipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSelectedModel = (model) => {
    setSelectedModel(model);
    setShowModelDetail(true);
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
      setScheduledSize(queueData.queue.filter((x) => x.flag === "sched").length); // Update the context value
      setDlQueueSize(queueData.queue.filter((x) => x.flag === "que").length); // Update the context value
      }
  }, [queueData,itemsPerPage]);


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
  // Pagination logic
  const queuedItems = DlQueue.filter((x) => x.flag === "que");
  const totalPages = Math.ceil(queuedItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = queuedItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const paginationInfo = useMemo(() => {
    const maxPageButtons = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    return {
      startPage,
      endPage,
      maxPageButtons,
    };
  }, [currentPage, totalPages]);

  const PaginationControls = () => {
    const { startPage, endPage } = paginationInfo;
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <a
          key={i}
          aria-current="page"
          onClick={() => paginate(i)}
          className={` ${
            i === currentPage
              ? "relative cursor-pointer z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              : "relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          }`}
        >
          {i}
        </a>
      );
    }
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 sm:px-4 ">
        {/* <div className="flex flex-1 justify-between min-[900px]:hidden">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </a>
          </div> */}
        <div className="flex flex-1 min-items-center justify-center">
          {/* <form method="post" onSubmit={handleGotoPage}>
              <div className="inline-flex">
                <div className="relative flex items-center  bg-white overflow-hidden">
                  <input
                    className="w-24 px-2 py-2 peer h-full border-2 focus-within:shadow-md border-gray-400 hover:border-indigo-600 text-sm font-normal text-gray-700 pr-2"
                    type="text"
                    name="gotoinput"
                    id="gotopage"
                    placeholder="Go to page"
                  />
                </div>
                <button
                  className="bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  type="submit"
                >
                  Go
                </button>
              </div>
            </form> */}

          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              {pageNumbers}
              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="font-sans max-w-full mx-auto ">
        {showModelDetail && (
          <ModelDetail
            model={selectedModel}
            onClose={() => setShowModelDetail(false)}
          />
        )}
        <div className="inline-flex items-center gap-x-4">
          <OpenSideBarButton
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <h1 className="text-2xl font-extrabold text-gray-800">
            In Queue ({queuedItems.length})
          </h1>
        </div>
        <div className="grid min-[900px]:grid-cols-3 gap-4 mt-8">
          <div className="col-span-1 min-[900px]:col-span-2 space-y-4 order-2 min-[900px]:order-1 ">
            <div className="grid grid-col-1 sm:flex justify-center items-center sm:justify-start">
              <div className="">{PaginationControls()}</div>
              <label className="text-sm text-center py-2 px-4 md:text-left text-slate-800 ">
                Items per Page:
              </label>
              <div className="flex w-full sm:w-fit sm:items-end sm:justify-end items-center justify-center">
                <select
                  className="inline-flex min-h-[3rem] w-fit bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border  rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none border-slate-400  shadow-sm focus:shadow-md appearance-none cursor-pointer"
                  onChange={(e) => handleModelPerPageChange(e.target.value)}
                  value={itemsPerPage}
                >
                  {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* start of card */}
            {currentItems.map((model) => (
              <div
                className=" flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)]"
                key={model._id}
              >
                <div className="flex gap-4 w-full min-w-96">
                  <div className="w-28 h-28 shrink-0">
                    <img
                      onClick={() => handleSelectedModel(model)}
                      src={model.image_url}
                      className="m-auto w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <a
                        href={`https://civitai.com/models/${model.model_id}`}
                        target="_blank"
                        className="text-base font-bold text-gray-800"
                      >
                        {model.model_name}
                      </a>
                      <p className="text-sm font-semibold text-gray-500 mt-2 flex items-center gap-2">
                        Version : {model.model_version}
                      </p>
                    </div>

                    <div
                      className="inline-flex rounded-md shadow-sm mb-2 hover:bg-gray-800 hover:text-white w-fit "
                      role="group"
                    >
                      <button
                        onClick={() => copy_to_clipboard(model._id)}
                        type="button"
                        className="inline-flex items-center px-2 py-2 text-xs font-medium  bg-transparent border border-gray-900 rounded-s-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
                      >
                        {model.model_id}
                      </button>
                      <button
                        onClick={() => copy_to_clipboard(model._id)}
                        type="button"
                        className="inline-flex items-center px-2 py-2 text-xs font-medium  bg-transparent border border-gray-900 rounded-e-lg focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
                      >
                        {model.version_id}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ml-auto flex flex-col max-w-32 items-center justify-center ">
                  <div className="flex-col gap-6 ">
                    <button
                      onClick={() => handleCancelDownload(model._id)}
                      className="inline-flex min-h-[3rem] w-full bg-stone-100 hover:bg-red-300 text-gray-900 font-semibold justify-center items-center  min-[900px]:justify-start rounded-md px-4 py-2 gap-2"
                    >
                      <TrashIcon className="w-8 h-8"></TrashIcon>
                      <span className="hidden md:inline-flex leading-none">
                        Cancel
                      </span>
                    </button>
                    <button
                      className="inline-flex min-h-[3rem] w-full bg-stone-100 hover:bg-green-300 text-gray-900 font-semibold justify-center items-center  min-[900px]:justify-start  rounded-md px-4 py-2 gap-2"
                      onClick={() => handleDownload(model._id)}
                    >
                      <ArrowPathIcon className="h-8 w-8" />
                      <span className="hidden md:inline-flex leading-none">
                        Retry
                      </span>
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
