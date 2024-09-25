import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function ModelCard({ model, filters, onVisibilityChange }) {
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

      return (
        <div
          id={model._id}
          className={
            (model.early_access_end != null
              ? "ring ring-4 ring-offset-0 ring-pink-500 "
              : "") +
            "flex flex-col h-full bg-white border border-slate-300 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg w-72 h-48 mx-auto"
          }
        >
          {/* Image Section */}
          <div className="relative overflow-hidden bg-cover bg-no-repeat w-full h-72 ">
            {model.downloaded && (
              <div className="absolute right-0 top-0 h-16 w-16">
                <div className="absolute transform rotate-45 bg-green-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
                  Owned
                </div>
              </div>
            )}
            <img
              className="m-auto w-full h-full object-cover hover:object-scale-down"
              src={model.image_url}
              alt={model.model_name}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col p-6">
            <header className="mb-4">
              <h2 className="text-l font-bold leading-snug text-gray-900 hover:text-indigo-600 transition-colors duration-300">
                <a href={"https://civitai.com/models/" + model.model_id}>
                  <p className="truncate text-ellipsis overflow-hidden">
                    {model.model_name}
                  </p>
                </a>
              </h2>
              <p className="text-sm text-blue-700 font-mono">
                {model.model_version + " (" + model.version_id + ")"}
              </p>
            </header>
            <div>
              {model.tags.slice(0, 3).map((tag, index) => {
                const badgeColor = badgeRule[tag]
                  ? badgeRule[tag]
                  : badgeRule["def"];
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

            {/* Buttons Section */}
            <div className="flex justify-between items-center mt-auto space-x-2">
              {/* Toggle favorite icon based on local state */}

              {isUpdatingFav ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              ) : favourite ? (
                <HeartIcon
                  className="h-8 w-8 text-gray-500 fill-red-400"
                  onClick={() => handleUpdate("fav")}
                />
              ) : (
                <HeartIconOutline
                  className="h-8 w-8 text-gray-500 stroke-red-400	"
                  onClick={() => handleUpdate("fav")}
                />
              )}

              {isUpdatingHidden ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              ) : modelhidden ? (
                <EyeSlashIcon
                  className="h-8 w-8 text-gray-500"
                  //onClick={toggleVisibility}
                  onClick={() => handleUpdate("hide")}
                />
              ) : (
                <EyeIcon
                  className="h-8 w-8 text-blue-500"
                  onClick={() => handleUpdate("hide")}
                />
              )}

              <button
                className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
                disabled={isUpdatingFav}
              >
                {isUpdatingFav ? "Saving..." : "Favorite"}
              </button>
              <button className="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors">
                {isUpdatingFav ? "Save" : "Update"}
              </button>
            </div>
          </div>
        </div>
      );
      setIsUpdatingHidden(false);
    }
  };

  if (isHidden && !filters.showHidden) {
    return null;
  }

  return (
    <div
      id={model._id}
      className={
        (model.early_access_end != null
          ? "ring ring-4 ring-offset-0 ring-pink-500 "
          : "") +
        "flex flex-col h-full bg-white border border-slate-300 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-lg w-72 h-48 mx-auto"
      }
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-cover bg-no-repeat w-full h-72 ">
        {model.downloaded ? (
          <div className="absolute right-0 top-0 h-16 w-16">
            <div className="absolute transform rotate-45 bg-green-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]">
              Owned
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <img
          className="m-auto w-full h-full object-cover hover:object-scale-down"
          src={model.image_url}
          alt={model.model_name}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col p-6">
        <header className="mb-4">
          <h2 className="text-l font-bold leading-snug text-gray-900 hover:text-indigo-600 transition-colors duration-300">
            <a href={"https://civitai.com/models/" + model.model_id}>
              <p className="truncate text-ellipsis overflow-hidden">
                {model.model_name}
              </p>
            </a>
          </h2>
          <p className="text-sm text-blue-700 font-mono">
            {model.model_version + " (" + model.version_id + ")"}
          </p>
        </header>
        <div>
          {model.tags.slice(0, 3).map((tag, index) => {
            const badgeColor = badgeRule[tag]
              ? badgeRule[tag]
              : badgeRule["def"];
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

        {/* Buttons Section */}
        <div className="flex justify-between items-center mt-auto space-x-2">
          {/* Toggle favorite icon based on local state */}

          {isUpdatingFav ? (
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          ) : favourite ? (
            <HeartIcon
              className="h-8 w-8 text-gray-500 fill-red-400"
              onClick={() => handleUpdate("fav")}
            />
          ) : (
            <HeartIconOutline
              className="h-8 w-8 text-gray-500 stroke-red-400	"
              onClick={() => handleUpdate("fav")}
            />
          )}

          {isUpdatingHidden ? (
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          ) : modelhidden ? (
            <EyeSlashIcon
              className="h-8 w-8 text-gray-500"
              //onClick={toggleVisibility}
              onClick={() => handleUpdate("hide")}
            />
          ) : (
            <EyeIcon
              className="h-8 w-8 text-blue-500"
              onClick={() => handleUpdate("hide")}
            />
          )}

          <button
            className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
            disabled={isUpdatingFav}
          >
            {isUpdatingFav ? "Saving..." : "Favorite"}
          </button>
          <button className="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors">
            {isUpdatingFav ? "Save" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
