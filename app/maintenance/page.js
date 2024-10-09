"use client";

import Layout from "../components/Layout";
import { useDataContext } from "../components/Layout";
import OpenSideBarButton from "../components/OpenSidebarButton";
import ModelDetail from "../components/ModelDetail";

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
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Countdown from "react-countdown";

export default function MaintenanceIssue() {


  function createInitialState(key, text) {
    const initial_state = {
      data: [],
      count: 0,
      currentPage: 0,
      key: key,
      text: text,
    };

    return initial_state;
  }

  const [missingHash, setMissingHash] = useState(
    createInitialState("missing_hash", "Missing Hash")
  );
  const [mismatchHash, setMisMatchHash] = useState(
    createInitialState("mismatch_hash", "Hash Mismatch")
  );
  const [missingCreator, setMissingCreator] = useState(
    createInitialState("missing_creator", "Missing Creator Info")
  );
  const [missingPreview, setMissingPreview] = useState(
    createInitialState("missing_preview", "Missing Preview Image")
  );
  const [missingModel, setMissingModel] = useState(
    createInitialState("missing_model", "Missing Model File")
  );
  const [missingJson, setMissingJson] = useState(
    createInitialState("missing_json", "Missing JSON")
  );
  const [missingHtml, setMissingHtml] = useState(
    createInitialState("missing_html", "Missing HTML")
  );
  const [missingId, setMissingId] = useState(
    createInitialState("missing_id", "Missing ID")
  );
  const [missingIntegrity, setMissingIntegrity] = useState(
    createInitialState("missing_integrity", "Missing Integrity Info")
  );
  const [currentType, setCurrentType] = useState(createInitialState("", ""));
  const [showModelDetail, setShowModelDetail] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const IssuesData = [
    missingHash,
    mismatchHash,
    missingCreator,
    missingPreview,
    missingModel,
    missingJson,
    missingHtml,
    missingId,
    missingIntegrity
  ];

  const flask_url = "http://192.168.18.17:5000";
  const [itemsPerPage, setitemsPerPage] = useState(10);
  const dcontext = useDataContext();

  const sidebarOpen = dcontext.sidebarOpen;
  const setSidebarOpen = dcontext.setSidebarOpen;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const {
    data: missingHash_data,
    error: missingHash_error,
    mutate: missingHash_mutate,
  } = useSWR("/api/maintenance/issues?type=missing_hash", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

    const {
      data: missingId_data,
      error: missingId_error,
      mutate: missingId_mutate,
    } = useSWR("/api/maintenance/issues?type=missing_id", fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    });

  const {
    data: mismatchHash_data,
    error: mismatchHash_error,
    mutate: mismatchHash_mutate,
  } = useSWR("/api/maintenance/issues?type=mismatch_hash", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: missingCreator_data,
    error: missingCreator_error,
    mutate: missingCreator_mutate,
  } = useSWR("/api/maintenance/issues?type=missing_creator", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: missingPreview_data,
    error: missingPreview_error,
    mutate: missingPreview_mutate,
  } = useSWR("/api/maintenance/issues?type=missing_preview", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: missingModel_data,
    error: missingModel_error,
    mutate: missingModel_mutate,
  } = useSWR("/api/maintenance/issues?type=missing_model", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: missingHtml_data,
    error: missingHtml_error,
    mutate: missingHtml_mutate,
  } = useSWR("/api/maintenance/issues?type=missing_html", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: missingJson_data,
    error: missingJson_error,
    mutate: missingJson_mutate,
  } = useSWR("/api/maintenance/issues?type=missing_json", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const {
    data: missingIntegrity_data,
    error: missingIntegrity_error,
    mutate: missingIntegrity_mutate,
  } = useSWR("/api/maintenance/issues?type=missing_integrity", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (missingHash_data && missingHash_data.data) {
      setMissingHash((prevState) => ({
        ...prevState,
        data: missingHash_data.data,
        count: missingHash_data.count,
        currentPage: 1,
      }));
    }
  }, [missingHash_data, itemsPerPage]);

    useEffect(() => {
      if (missingId_data && missingId_data.data) {
        setMissingId((prevState) => ({
          ...prevState,
          data: missingId_data.data,
          count: missingId_data.count,
          currentPage: 1,
        }));
      }
    }, [missingId_data, itemsPerPage]);

  useEffect(() => {
    if (mismatchHash_data && mismatchHash_data.data) {
      setMisMatchHash((prevState) => ({
        ...prevState,
        data: mismatchHash_data.data,
        count: mismatchHash_data.count,
        currentPage: 1,
      }));
    }
  }, [mismatchHash_data, itemsPerPage]);

  useEffect(() => {
    if (missingCreator_data && missingCreator_data.data) {
      // setMissingCreator(missingCreator_data);
      setMissingCreator((prevState) => ({
        ...prevState,
        data: missingCreator_data.data,
        count: missingCreator_data.count,
        currentPage: 1,
      }));
    }
  }, [missingCreator_data, itemsPerPage]);

  useEffect(() => {
    if (missingPreview_data && missingPreview_data.data) {
      setMissingPreview((prevState) => ({
        ...prevState,
        data: missingPreview_data.data,
        count: missingPreview_data.count,
        currentPage: 1,
      }));
    }
  }, [missingPreview_data, itemsPerPage]);

  useEffect(() => {
    if (missingModel_data && missingModel_data.data) {
      setMissingModel((prevState) => ({
        ...prevState,
        data: missingModel_data.data,
        count: missingModel_data.count,
        currentPage: 1,
      }));
    }
  }, [missingModel_data, itemsPerPage]);

  useEffect(() => {
    if (missingJson_data && missingJson_data.data) {
      setMissingJson((prevState) => ({
        ...prevState,
        data: missingJson_data.data,
        count: missingJson_data.count,
        currentPage: 1,
      }));
    }
  }, [missingJson_data, itemsPerPage]);

  useEffect(() => {
    if (missingHtml_data && missingHtml_data.data) {
      setMissingHtml((prevState) => ({
        ...prevState,
        data: missingHtml_data.data,
        count: missingHtml_data.count,
        currentPage: 1,
      }));
    }
  }, [missingHtml_data, itemsPerPage]);

  useEffect(() => {
    if (missingIntegrity_data && missingIntegrity_data.data) {
      setMissingIntegrity((prevState) => ({
        ...prevState,
        data: missingIntegrity_data.data,
        count: missingIntegrity_data.count,
        currentPage: 1,
      }));
    }
  }, [missingIntegrity_data, itemsPerPage]);

  useEffect(() => {
    if (IssuesData.every((data) => data.currentPage == 1)) {
      setCurrentType(missingHash);
      setAllDataLoaded(true);
    }
  }, [IssuesData]);


  const handleModelPerPageChange = (num) => {
    setitemsPerPage(num);
    setCurrentPage(1);
  };

  const handleIssueChange = (key) => {
    if (key == "missing_hash") {
      setCurrentType(missingHash);
    } else if (key == "mismatch_hash") {
      setCurrentType(mismatchHash);
    } else if (key == "missing_creator") {
      setCurrentType(missingCreator);
    } else if (key == "missing_json") {
      setCurrentType(missingJson);
    } else if (key == "missing_html") {
      setCurrentType(missingHtml);
    } else if (key == "missing_model") {
      setCurrentType(missingModel);
    } else if (key == "missing_preview") {
      setCurrentType(missingPreview);
    } else if (key == "missing_id") {
      setCurrentType(missingId);
    } else if (key == "missing_integrity") {
      setCurrentType(missingIntegrity);
    }
    setCurrentType((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
  };

  const copy_to_clipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSelectedModel = (model) => {
    setSelectedModel(model);
    setShowModelDetail(true);
  };

  // Pagination logic

  const paginate = (pageNumber) =>
    setCurrentType((prevState) => ({
      ...prevState,
      currentPage: pageNumber,
    }));

  const totalPages = Math.ceil(currentType.count / itemsPerPage);
  const indexOfLastItem = currentType.currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentType.data.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginationInfo = useMemo(() => {
    const maxPageButtons = 7;
    let startPage = Math.max(
      1,
      currentType.currentPage - Math.floor(maxPageButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    return {
      startPage,
      endPage,
      maxPageButtons,
    };
  }, [currentType.currentPage, totalPages]);

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
            i === currentType.currentPage
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
        <div className="flex flex-1 min-items-center justify-center">
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => paginate(currentType.currentPage - 1)}
                disabled={currentType.currentPage === 1}
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
                onClick={() => paginate(currentType.currentPage + 1)}
                disabled={currentType.currentPage === totalPages}
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

  if (!currentType.data) {
    return <div>loading data...</div>;
  }
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
            Issues ({currentType.count})
          </h1>
        </div>

        <div className="grid  grid-cols-1 min-[900px]:max-[1500px]:grid-cols-2 min-[1501px]:grid-cols-3 gap-4 mt-8">
          <div className="col-span-1 min-[900px]:col-span-2 space-y-4 order-2 min-[900px]:order-1 ">
            <label className="text-sm text-center py-2 px-4  md:text-left text-gray-600 ">
              Select Issue
            </label>
            <div className="flex w-full sm:w-full sm:items-end sm:justify-end items-center justify-center px-4">
              <select
                className="inline-flex min-h-[1rem] w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border  rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none border-slate-400  shadow-sm focus:shadow-md appearance-none cursor-pointer"
                onChange={(e) => handleIssueChange(e.target.value)}
                value={currentType.key}
              >
                {IssuesData.map((issue) => (
                  <option key={issue.key} value={issue.key}>
                    {issue.text}
                  </option>
                ))}
              </select>
            </div>
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
            {allDataLoaded ? (
              currentItems.map((model) => (
                <div
                  className=" flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)]"
                  key={model._id}
                >
                  <div className="flex gap-4 w-full min-w-96">
                    <div className="w-28 h-28 shrink-0">
                      <img
                        onClick={() => handleSelectedModel(model)}
                        src={
                          model.preview_path != ""
                            ? `http://192.168.18.17:9999/api/public/dl/BQVi9UJg/${encodeURI(
                                model.preview_path
                              )}`
                            : "http://192.168.18.17:9999/api/public/dl/ar-zeiuw/noimg.png"
                        }
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

                  <div className="ml-auto flex flex-col w-fit items-center justify-center ">
                    <div className="flex-col gap-6 ">
                      <span className=" grid grid-col-1 place-items-center md:inline-flex w-full min-h-[3rem] items-center gap-2  bg-orange-500 text-white text-sm font-bold px-2 py-2 rounded my-2 min-[900px]:justify-start justify-center">
                        <ClockIcon className="w-4 h-4 md:w-8 md:h-8 "></ClockIcon>
                      </span>
                      <button
                        onClick={() => handleCancelSchedule(model._id)}
                        className="inline-flex min-h-[3rem] w-full bg-stone-100 hover:bg-red-300 text-gray-900 font-semibold justify-center items-center  min-[900px]:justify-start rounded-md px-2 py-2 gap-2"
                      >
                        <TrashIcon className="w-8 h-8"></TrashIcon>
                        <span className="hidden md:inline-flex leading-none">
                          Cancel
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                Loading Data... (
                {IssuesData.filter((x) => x.currentPage === 1).length}/
                {IssuesData.length} Loaded)
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
