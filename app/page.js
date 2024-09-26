"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "./components/Layout";
import ModelCard from "./components/ModelCard.js";
import ModelDetail from "./components/ModelDetail";
import FilterPopout from "./components/FilterPopout.js";
import { FunnelIcon } from "@heroicons/react/24/outline";

const MODELS_PER_PAGE = 20; // Adjust this number as needed

export default function Home() {
  const [selectedModel, setSelectedModel] = useState(null)
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showFilterPopout, setShowFilterPopout] = useState(false);
  const [showModelDetail, setShowModelDetail] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    showFavorites: false,
    showHidden: false,
    nsfwContent: true,
    showDownloaded: true,
  });

  const handleFilterChange = () => {
    setPage(1);
    setModels([]);
    fetchModels();
  };


  const observer = useRef();
  const lastModelElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/models?page=${page}&limit=${MODELS_PER_PAGE}&showHidden=${filters.showHidden}&showDownloaded=${filters.showDownloaded}&favOnly=${filters.showFavorites}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setModels((prevModels) => [...prevModels, ...data.models]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to load models. Please try again later.");
    } finally {
      setLoading(false);
      //setShowModelDetail(true)
    }
  };
  useEffect(() => {
    fetchModels()
    if (models.length > 0) {
      setSelectedModel(models[10])
      // models.forEach((model)=>
      // {
      //   if(model.version_id === 890194)
      //   {
      //     setSelectedModel(model);
      //   }
      // });
      setShowModelDetail(true);
    }
  }, [page]);

  // New function to handle hiding/unhiding models
  const handleModelVisibilityChange = (modelId, isHidden) => {
    setModels((prevModels) =>
      prevModels.map((model) =>
        model._id === modelId ? { ...model, isHidden } : model
      )
    );
  };

  const handleSelectedModel = (model) => {
    setSelectedModel(model)
  }

  // Filter out hidden models before rendering
  const visibleModels = models.filter(
    (model) => !model.isHidden || filters.showHidden
  );

  return (
    <Layout>
      <button onClick={() => setShowModelDetail(true)}>showdetail</button>
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
      {error ? (
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
                // handleSelectedModel={handleSelectedModel(selectedModel)}
                // setShowModelDetail={setShowModelDetail}
              />
            </div>
          ))}
        </div>
      )}
      {loading && <p className="text-center mt-4">Loading more models...</p>}
    </Layout>
  );
}
