import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import {
  HeartIcon,
  EyeSlashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export default function ModelCard({
  model,
  filters,
  onVisibilityChange,
  handleSelectedModel,
  setShowModelDetail,
}) {
  const [isUpdatingFav, setIsUpdatingFav] = useState(false);
  const [isUpdatingHidden, setIsUpdatingHidden] = useState(false);
  const [favourite, setFavourite] = useState(model.favourite); // Local state for favorite status
  const [modelhidden, setHidden] = useState(model.hidden); // Local state for hidden status
  //const [filterhidden, setfilterHidden] = useState(filters["showHidden"]);
  const [isHidden, setIsHidden] = useState(model.isHidden);

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

  const showModelDetail = () =>{
    //setShowModelDetail(false);
    //handleSelectedModel(model);
    //setShowModelDetail(true);
  }
  const handleUpdate = async (action) => {
    if (action == "fav") {
      //setIsUpdatingFav(true);
      var bodyData = JSON.stringify({
        id: model._id,
        updatedData: { favourite: !favourite },
      });
    } else if (action == "hide") {
      //setIsUpdatingHidden(true);
      var bodyData = JSON.stringify({
        id: model._id,
        updatedData: { hidden: !modelhidden },
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
          console.log(modelhidden);
          setIsUpdatingHidden(false);
        }

        // Optionally update the parent component
      } else {
        console.error("Failed to update model");
        setIsUpdatingFav(false);
        setIsUpdatingHidden(false);
      }
    } catch (error) {
      console.error("Error updating model:", error);
      setIsUpdatingFav(false);
      setIsUpdatingHidden(false);
    }
  };

  if (isHidden && !filters.showHidden) {
    return null;
  }

  return (
    //     <div
    //   id={model._id}
    //   className={
    //     (model.early_access_end != null
    //       ? "ring ring-4 ring-offset-0 ring-pink-500 "
    //       : "") +
    //     "flex flex-col h-full bg-white border border-slate-300 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg w-72 h-48 mx-auto"
    //   }
    // ></div>

    <div className="bg-gray-100 border border-gray-300 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
      {/* Image Section */}
      <div className="relative overflow-hidden bg-cover bg-no-repeat w-full h-72 ">
        <img
          className="m-auto w-full h-full object-cover hover:object-scale-down"
          src={model.image_url}
          alt={model.model_name}
          onClick={showModelDetail}
        />
        {model.downloaded && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-s font-bold px-2 py-1 m-2 rounded">
            Owned
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
          <a
            href={`https://civitai.com/models/${model.model_id}`}
            className="hover:text-indigo-600 transition-colors duration-300"
          >
            {model.model_name? model.model_name:""}
          </a>
        </h2>
        <p className="text-sm text-blue-600 font-mono">
          {model.model_version} ({model.version_id})
        </p>
        <div className="flex flex-wrap gap-1">
          {
            (model.tags && model.tags.length > 0) &&
            model.tags.slice(0, 3).map((tag, index) => {
            const badgeColor = badgeRule[tag] || badgeRule.def;
            return (
              <span
                key={index}
                className={`${badgeColor["bg"]} ${badgeColor["text"]} text-xs font-medium me-2 px-2.5 py-0.5 rounded border ${badgeColor["border"]}`}
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
        <button className="flex items-center space-x-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-300">
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span>Download</span>
        </button>
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
