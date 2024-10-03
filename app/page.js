"use client";

import { useState, useEffect, useMemo, mutate, useCallback } from "react";
import Layout from "./components/Layout";
import ModelCard from "./components/ModelCard.js";
import ModelDetail from "./components/ModelDetail";
import FilterPopout from "./components/FilterPopout.js";
import {
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import useSWR from "swr";
import { Popover } from "@headlessui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";

const MODELS_PER_PAGE = 21; // Adjust this number as needed

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(null)
  const [models, setModels] = useState([]);
  const [DlQueue,setDlQueue] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [showFilterPopout, setShowFilterPopout] = useState(false);
  const [showModelDetail, setShowModelDetail] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    showFavorites: false,
    showHidden: false,
    nsfwContent: true,
    showDownloaded: true,
  })

  const [sortOpt, setSortOpt]=useState({text:"Published",key:"published_date"});
  const [sortOrder, setSortOrder] = useState(-1);

  const [inputValue, setInputValue] = useState("");
  const [timer, setTimer] = useState(null);
  const [searchWords, setSearchWords] = useState("");



  const searchChanged = (e) => {
    setInputValue(e.target.value);

    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      setSearchWords(inputValue);
    }, 500);

    setTimer(newTimer);
  };

  const handleEnterSearch =(e)=> {
    if(e.key==="Enter")
    {
      setSearchWords(inputValue)
    }
  }

  const getModelUrl = useCallback(() => {
    if (!hasMore) return null;
    return `/api/models?page=${page}&limit=${MODELS_PER_PAGE}&showHidden=${filters.showHidden}&showDownloaded=${filters.showDownloaded}&favOnly=${filters.showFavorites}&sortBy=${sortOpt.key}&order=${sortOrder}&search=${searchWords}`;
  }, [page,filters,sortOpt,sortOrder,searchWords
  ]);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const {
    data: modelData,
    error: modelError,
    isLoading: modelLoading,
  } = useSWR(getModelUrl, fetcher);

  const {
    data: queueData,
    error: queueError,
    isLoading: queueLoading,
  } = useSWR("/api/download/", fetcher, { refreshInterval:2000 });

  const paginationInfo = useMemo(() => {
    const maxPageButtons = 7;
    let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    return {
      startPage,
      endPage,
      maxPageButtons,
    };
  }, [page, totalPages]);

    const sortOptions = [
      {text:"Published",key:"published_date"},
      {text:"Created",key:"created_date"},
      {text:"Model ID",key:"model_id"},
      {text:"Version ID",key:"version_id"},
      {text:"Model Name",key:"model_name"},
      {text:"Version Name",key:"version_name"},
    ];
  // const observer = useRef();
  // const lastModelElementRef = useCallback(
  //   (node) => {
  //     if (modelLoading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         setPage((prevPage) => prevPage + 1);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [modelLoading, hasMore]
  // );

  // const fetchModels = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch(
  //       `/api/models?page=${page}&limit=${MODELS_PER_PAGE}&showHidden=${filters.showHidden}&showDownloaded=${filters.showDownloaded}&favOnly=${filters.showFavorites}`
  //     );
  //     if (!res.ok) throw new Error("Failed to fetch");
  //     const data = await res.json();
  //     console.log(data);
  //     setModels((prevModels) => [...prevModels, ...data.models]);
  //     setHasMore(data.hasMore);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setError("Failed to load models. Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchModels = () => {

  // };



  // useEffect(() => {
  //   if (data && data.models) {
  //     setModels((prevModels) => [...prevModels, ...data.models]);
  //     setHasMore(data.hasMore);
  //     //setLoading(false); // Ensure loading is false after data is fetched
  //   }
  // }, [data]);

  useEffect(() => {
    if (modelData && modelData.models) {
      setModels(modelData.models);
      setTotalPages(Math.ceil(modelData.totalCount / MODELS_PER_PAGE));
    }
  }, [modelData]);


  useEffect(() => {
    if (queueData && queueData.queue) {
      setDlQueue(queueData.queue);
    }
  }, [queueData]);


  if (modelError) {
    console.error("Model Error:", modelError);
  }

  if (queueError) {
    console.error("Queue Error:", queueError);
  }

  // New function to handle hiding/unhiding models
  const handleModelVisibilityChange = (modelId, isHidden) => {
    setModels((prevModels) =>
      prevModels.map((model) =>
        model._id === modelId ? { ...model, isHidden } : model
      )
    );
  };

  const handleSelectedModel = (model) => {
    setSelectedModel(model);
    setShowModelDetail(true);

  }
  const handlePageChange = (newPage) => {
    console.log(newPage);
    setPage(parseInt(newPage));
    window.scrollTo(0, 0);
  };

  function handleGotoPage(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    for (var [key, value] of formData.entries()) { 
      if(key==="gotoinput")
        handlePageChange(parseInt(value));
    }
  }

  const handleFilterChange = () => {
    setPage(1);
    setModels([]);
    //setHasMore(true);
    // fetchModels();
  };

  const handleSortingChange = (_sortKey,_sortText) =>{
    const _sortOpt = {};
    _sortOpt["key"] = _sortKey; // Dynamically set the sort field and order
    _sortOpt["text"] = _sortText; // Default secondary sorting by _id
    setSortOpt(_sortOpt);
  }

  const handleOrderChange = (_sortOrder) => {
    setSortOrder(_sortOrder);
    setPage(1);
  };


  // Filter out hidden models before rendering
  const visibleModels = models.filter(
    (model) => !model.isHidden || filters.showHidden
  );

  const renderPagination = () => {
    const { startPage, endPage } = paginationInfo;
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <a
        key={i}
        aria-current="page"
        onClick={() => handlePageChange(i)}
        className={` ${i=== page
          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        }`}
        >
        {i}
      </a>

      );
    }
      return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-6 sm:px-6">
          <div className="flex flex-1 justify-between min-[900px]:hidden">
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
          </div>
          <div className=" hidden min-[900px]:flex min-[900px]:flex-1 min-[900px]:items-center min-[900px]:justify-between">
            <div>
              <p className="py-4 text-sm text-gray-800">
                Showing
                <span className="font-medium m-2">
                  {(page - 1) * MODELS_PER_PAGE + 1}
                </span>
                to
                <span className="font-medium m-2">
                  {(page - 1) * MODELS_PER_PAGE + MODELS_PER_PAGE}
                </span>
                of
                {modelData && (
                  <span className="font-medium m-2">
                    {modelData.totalCount}
                  </span>
                )}
                results
              </p>
            </div>
            <form method="post" onSubmit={handleGotoPage}>
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
            </form>

            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
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
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
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
      <h1 className="text-2xl font-extrabold text-gray-800">
        Browse Models
      </h1>
      <div className="mt-8 mb-4 relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
        {/* search and show menu */}
        <input
          className="px-6 py-4 peer h-full shadow-md w-full outline-none text-sm font-semibold text-gray-700 pr-2"
          type="text"
          value={inputValue}
          onChange={searchChanged}
          onKeyDown={handleEnterSearch}
          id="search"
          placeholder="Search something.."
        />
      </div>
      {/* sort and order */}

      <div className="grid grid-cols-1 pb-4 pt-4 sm:pt-4 sm:pb-8 gap-2 sm:grid-cols-10">
        <div className="sm:grid sm:grid-cols-2 grid-cols-1 sm:col-span-7 sm:justify-start gap-x-2 sm:w-fit w-full">
          <Popover className="relative">
            <Popover.Button
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className="inline-flex min-h-[3rem] w-full sm:w-fit items-center justify-start sm:justify-between rounded-md bg-stone-100 text-gray-900 font-semibold sm:font-normal sm:bg-indigo-500 px-4 py-2 sm:text-white gap-2"
              type="button"
            >
              <ChevronDownIcon className="w-6 h-6" />
              <span>Sort</span>
              <span>:</span>
              <span>{sortOpt.text}</span>
            </Popover.Button>
            <Popover.Panel className="absolute z-10 mt-3 w-72 max-w-md transform px-0 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                {sortOptions.map((opt) => (
                  <div
                    className="relative flex bg-stone-100 cursor-pointer items-center  hover:bg-stone-300 border-b-2 border-stone-200"
                    key={opt.key}
                    onClick={() => handleSortingChange(opt.key, opt.text)}
                  >
                    <a className="flex items-center p-4 rounded-lg transition duration-150 ease-in-out  focus:outline-none focus-visible:ring font-medium text-sm text-stone-900  focus-visible:ring-orange-500/50">
                      <div>{opt.text}</div>
                    </a>
                  </div>
                ))}
              </div>
            </Popover.Panel>
          </Popover>
          <Popover className="relative">
            <Popover.Button
              id="dropdownDefault"
              data-dropdown-toggle="dropdown"
              className="inline-flex min-h-[3rem] w-full sm:w-fit items-center justify-start sm:justify-between rounded-md bg-stone-100 text-gray-900 font-semibold sm:font-normal sm:bg-indigo-500 px-4 py-2 sm:text-white gap-2"
              type="button"
            >
              <ChevronDownIcon className="w-6 h-6" />
              <span>Order</span>
              <span>:</span>
              <span>
                {sortOrder == -1 ? (
                  <ArrowDownIcon className="w-4 h-4" />
                ) : (
                  <ArrowUpIcon className="w-4 h-4" />
                )}
              </span>
            </Popover.Button>
            <Popover.Panel className="absolute z-10 mt-3 w-72 max-w-md transform px-0 sm:px-0 lg:max-w-3xl">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                <div
                  className="relative flex bg-stone-100 cursor-pointer items-center  hover:bg-stone-300 border-b-2 border-stone-200"
                  onClick={() => setSortOrder(-1)}
                >
                  <a className="flex items-center p-4 rounded-lg transition duration-150 ease-in-out  focus:outline-none focus-visible:ring font-medium text-sm text-stone-900  focus-visible:ring-orange-500/50">
                    <div>Descending</div>
                  </a>
                </div>
                <div
                  className="relative flex bg-stone-100 cursor-pointer items-center  hover:bg-stone-300 border-b-2 border-stone-200"
                  onClick={() => setSortOrder(1)}
                >
                  <a className="flex items-center p-4 rounded-lg transition duration-150 ease-in-out  focus:outline-none focus-visible:ring font-medium text-sm text-stone-900  focus-visible:ring-orange-500/50">
                    <div>Ascending</div>
                  </a>
                </div>
              </div>
            </Popover.Panel>
          </Popover>
        </div>
        <div className="flex justify-center sm:col-span-3 sm:justify-end">
          <button
            id="dropdownDefault"
            data-dropdown-toggle="dropdown"
            className="inline-flex min-h-[3rem] w-full sm:w-max items-center bg-stone-100 text-gray-900 font-semibold sm:font-light justify-start sm:justify-between rounded-md sm:bg-indigo-500 px-4 py-2 sm:text-white gap-2"
            onClick={() => setShowFilterPopout(!showFilterPopout)}
            type="button"
          >
            <FunnelIcon className="w-6 h-6 mr-2" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {showFilterPopout && (
        <FilterPopout
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilterPopout(false)}
        />
      )}
      {showModelDetail && (
        <ModelDetail
          model={selectedModel}
          onClose={() => setShowModelDetail(false)}
        />
      )}
      {modelError ? (
        <p className="text-center text-red-500">{error}</p>
      ) : modelLoading ? (
        <p className="text-center mt-4">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 min-[2048px]:grid-cols-6 min-[2560px]:grid-cols-7 gap-4">
          {visibleModels.map((model) => (
            <div
              key={model._id}
              // ref={
              //   index === visibleModels.length - 1 ? lastModelElementRef : null
              // }
            >
              <ModelCard
                model={model}
                filters={filters}
                onVisibilityChange={(isHidden) =>
                  handleModelVisibilityChange(model._id, isHidden)
                }
                onShowDetail={(model) => handleSelectedModel(model)}
                dlQueue={DlQueue}
              />
            </div>
          ))}
        </div>
      )}
      {renderPagination()}
    </Layout>
  );
}
