import {
  HeartIcon as HeartIconOutline,
  ClockIcon,
  CalendarDaysIcon,
  ArrowDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon,
  EyeSlashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { useState, useMemo, useEffect, useRef } from "react";
import Countdown from "react-countdown";
import useSWR from "swr";

export default function ModelCard({
  model,
  filters,
  onVisibilityChange,
  onShowDetail,
  dlQueue,
}) {
  const [isUpdatingFav, setIsUpdatingFav] = useState(false);
  const [isUpdatingHidden, setIsUpdatingHidden] = useState(false);
  const [favourite, setFavourite] = useState(model.favourite); // Local state for favorite status
  const [modelhidden, setHidden] = useState(model.hidden); // Local state for hidden status
  //const [filterhidden, setfilterHidden] = useState(filters["showHidden"]);
  const [isHidden, setIsHidden] = useState(model.isHidden);
  const [isDownloading, setIsDownloading] = useState(model.flag);
  const [isDownloaded, setIsDownloaded] = useState(model.downloaded);
  const [isScheduled, setisScheduled] = useState(model.flag);
  const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false);

  const flask_url = "http://192.168.18.17:5000";
  const prevQueueRef = useRef(dlQueue);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const { data: updatedModel, mutate } = useSWR(
    `/api/models?id=${model._id}`, // Always fetch for each ModelCard when dlQueue changes
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (updatedModel) {
      setIsDownloaded(updatedModel.model.downloaded);
    }
  }, [updatedModel]);

  useEffect(() => {
    const wasInQueue = prevQueueRef.current.some(
      (item) => item._id === model._id
    );
    const isInQueue = dlQueue.some((item) => item._id === model._id);
    if (isInQueue) {
      setIsDownloading("dl");
    } else {
      setIsDownloading("");
    }

    if ((wasInQueue && !isInQueue) || (!wasInQueue && isInQueue)) {
      mutate(); // Re-fetch model status
    }

    // Update the ref to store the latest queue
    prevQueueRef.current = dlQueue;
  }, [dlQueue, model._id, mutate]);

  // const inQueue = useMemo(() => {
  //   return dlQueue.some((item) => item._id === model._id);
  // }, [dlQueue, model._id]);

  const badgeRule = {
    style: {
      text: "text-green-800",
      bg: "bg-green-400",
      border: "border-green-400",
    },
    character: {
      text: "text-red-800",
      bg: "bg-red-300",
      border: "border-red-400",
    },
    concept: {
      text: "text-blue-800",
      bg: "bg-blue-200",
      border: "border-blue-400",
    },
    def: {
      text: "text-black-800",
      bg: "bg-gray-200",
      border: "border-gray-400",
    },
  };

  const showModelDetail = () => {
    onShowDetail(model);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading("dl");
      const res = await fetch(flask_url + "/download/new/" + model._id);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
      setIsDownloading("");
    }
  };

  const handleUpdate = async (action) => {
    if (action == "fav") {
      setIsUpdatingFav(true);
      var bodyData = JSON.stringify({
        id: model._id,
        updatedData: { favourite: !favourite },
      });
    } else if (action == "hide") {
      setIsUpdatingHidden(true);
      var bodyData = JSON.stringify({
        id: model._id,
        updatedData: { hidden: !modelhidden },
      });
    } else if (action == "schedule") {
      setIsUpdatingSchedule(true);
      var bodyData = JSON.stringify({
        id: model._id,
        updatedData: { flag: "sched" },
      });
    }
    try {
      const response = await fetch("/api/models", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
      });

      if (response.ok) {
        // Update the local state
        if (action == "fav") {
          setFavourite(!favourite);
          console.log(favourite);

          setIsUpdatingFav(false);
        }
        if (action == "hide") {
          setHidden(!modelhidden);
          setIsHidden(!modelhidden);
          onVisibilityChange(!modelhidden);
          setIsUpdatingHidden(false);
        }
        if (action == "schedule") {
          setisScheduled("sched");
          setIsUpdatingSchedule(false);
        }

        // Optionally update the parent component
      } else {
        console.error("Failed to update model");
        setIsUpdatingFav(false);
        setIsUpdatingHidden(false);
        setIsUpdatingSchedule(false);
      }
    } catch (error) {
      console.error("Error updating model:", error);
      setIsUpdatingFav(false);
      setIsUpdatingHidden(false);
      setIsUpdatingSchedule(false);
    }
  };

  function actionButton() {
    if (!isDownloaded) {
      if (isDownloading === "dl") {
        return (
          <button className="flex items-center space-x-1 bg-gray-400  text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-300">
            <Spinner />
            <span>Downloading...</span>
          </button>
        );
      } else {
        if (Date.parse(model.early_access_end) > Date.now()) {
          return isScheduled != "sched" ? (
            <button
              onClick={() => handleUpdate("schedule")}
              className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-300"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Schedule</span>
            </button>
          ) : (
            <button
              disabled
              className="flex items-center space-x-1 bg-gray-400  text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-300"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Scheduled</span>
            </button>
          );
        } else {
          return (
            <button
              className="flex items-center space-x-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-300"
              onClick={() => handleDownload()}
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Download</span>
            </button>
          );
        }
      }
    } else {
      return (
        <button className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-300">
          <TrashIcon className="h-4 w-4" />
          <span>Delete</span>
        </button>
      );
    }
  }

  const cd_renderer = ({ days, hours, minutes }) => {
    // Render a countdown
    return (
      <span>
        {hours}d : {hours}h : {minutes}m
      </span>
    );
  };

  if (isHidden && !filters.showHidden) {
    return null;
  }

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
      {/* Image Section */}
      <div className="relative overflow-hidden bg-cover bg-no-repeat w-full aspect-[7/9]">
        <img
          className="m-auto w-full h-full object-cover "
          src={model.image_url}
          alt={model.model_name}
          onClick={showModelDetail}
        />
        {isDownloaded && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-s font-bold px-2 py-1 m-2 rounded">
            Installed
          </div>
        )}
        {model.early_access_end != null && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-sm font-bold px-2 py-2 m-2 rounded">
            <span className="inline-flex items-center gap-2">
              <ClockIcon className="w-6 h-6"></ClockIcon>
              <Countdown
                date={Date.parse(model.early_access_end)}
                renderer={cd_renderer}
              ></Countdown>
            </span>
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
          <a
            href={`https://civitai.com/models/${model.model_id}`}
            target="_blank"
            className="hover:text-indigo-600 transition-colors duration-300"
          >
            {model.model_name ? model.model_name : ""}
          </a>
        </h2>
        <p className="text-sm text-blue-600 font-mono overflow-hidden truncate">
          {model.model_version} ({model.version_id})
        </p>
        <div className="flex flex-wrap gap-0">
          {model.tags &&
            model.tags.length > 0 &&
            model.tags.slice(0, 3).map((tag, index) => {
              const badgeColor = badgeRule[tag] || badgeRule.def;
              return (
                <span
                  key={index}
                  className={`${badgeColor["bg"]} ${badgeColor["text"]} text-xs w-16 truncate text-center font-medium me-2 px-2.5 py-0.5 rounded border ${badgeColor["border"]}`}
                >
                  {tag.toLowerCase()}
                </span>
              );
            })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdate("fav")}
            className="text-gray-600 hover:text-red-500 transition-colors duration-300"
            disabled={isUpdatingFav}
          >
            {isUpdatingFav ? (
              <Spinner />
            ) : favourite ? (
              <HeartIcon className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIconOutline className="h-6 w-6" />
            )}
          </button>
          <button
            onClick={() => handleUpdate("hide")}
            className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
            disabled={isUpdatingHidden}
          >
            {isUpdatingHidden ? (
              <Spinner />
            ) : modelhidden ? (
              <EyeSlashIcon className="h-6 w-6" />
            ) : (
              <EyeIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        {actionButton()}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
