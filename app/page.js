"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "./components/Layout";
import ModelCard from "./components/ModelCard.js";
import ModelDetail from "./components/ModelDetail";
import FilterPopout from "./components/FilterPopout.js";
import { FunnelIcon } from "@heroicons/react/24/outline";
import TestComponent from  "./components/Test";
import useSWR from "swr";


const MODELS_PER_PAGE = 20; // Adjust this number as needed

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(null)
  const [models, setModels] = useState([]);
  const [DlQueue,setDlQueue] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showFilterPopout, setShowFilterPopout] = useState(false);
  const [showModelDetail, setShowModelDetail] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    showFavorites: false,
    showHidden: false,
    nsfwContent: true,
    showDownloaded: true,
  })


  const handleFilterChange = () => {
    setPage(1);
    setModels([]);
    setHasMore(true);
    // fetchModels();
  };

  const getModelUrl = useCallback(() => {
    if (!hasMore) return null;
    return `/api/models?page=${page}&limit=${MODELS_PER_PAGE}&showHidden=${filters.showHidden}&showDownloaded=${filters.showDownloaded}&favOnly=${filters.showFavorites}`;
  }, [page, filters, hasMore]);

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
  } = useSWR("/api/download/", fetcher, {
    refreshInterval: 2000,
  });





  const observer = useRef();
  const lastModelElementRef = useCallback(
    (node) => {
      if (modelLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [modelLoading, hasMore]
  );

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
      console.log("Model data:", modelData.models);
      setModels((prevModels) => {
        const newModels = modelData.models.filter(
          (newModel) => !prevModels.some((model) => model._id === newModel._id)
        );
        return [...prevModels, ...newModels];
      });
      setHasMore(modelData.hasMore);
    }
  }, [modelData]);

  useEffect(() => {
    if (queueData && queueData.queue) {
      console.log("Queue data:", queueData.queue);
      setDlQueue(queueData.queue);
    if (modelData && modelData.models) {
      setModels((prevModels) => {
        const newModels = modelData.models.filter(
          (newModel) =>
            !prevModels.some((model) => model._id === newModel._id)
        );
        return [...prevModels, ...newModels];
      });
    }
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

  // Filter out hidden models before rendering
  const visibleModels = models.filter(
    (model) => !model.isHidden || filters.showHidden
  );

  return (
    <Layout>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowFilterPopout(!showFilterPopout)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filter
        </button>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2048px]:grid-cols-6 min-[2560px]:grid-cols-7 gap-4">
          {visibleModels.map((model, index) => (
            <div
              key={model._id}
              ref={
                index === visibleModels.length - 1 ? lastModelElementRef : null
              }
            >
              <ModelCard
                model={model}
                filters={filters}
                onVisibilityChange={(isHidden) =>
                  handleModelVisibilityChange(model._id, isHidden)
                }
                onShowDetail={(model)=> handleSelectedModel(model)}
                dlQueue= {DlQueue}
              />
            </div>
          ))}
        </div>
      )}
      {modelLoading && <p className="text-center mt-4">Loading more models...</p>}
    </Layout>
  );
}
