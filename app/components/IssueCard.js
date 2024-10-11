import {
  HeartIcon as HeartIconOutline,
  ClockIcon,
  CalendarDaysIcon,
  ArrowDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowPathIcon
} from "@heroicons/react/24/solid";
import { useState, useMemo, useEffect, useRef } from "react";
import useSWR from "swr";

export default function IssueCard({
  model,
  handleSelectedModel,
  copy_to_clipboard,
  onFetchComplete,
}) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  const {
    data: modelData,
    error: modelError,
    isLoading: modelLoading,
  } = useSWR(
    shouldFetch ? `/api/fetch/civit/model?id=${model.model_id}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const {
    data: versionData,
    error: versionError,
    isLoading: versionLoading,
  } = useSWR(
    shouldFetch
      ? `/api/fetch/civit/version?id=${model.model_version_id}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  function checkSHA(data) {
    if (data.files && data.files.length > 0) {
      const filtered = data.files.filter((x) => x.primary === true);
      return filtered[0].hashes.SHA256;
    } else {
      return "";
    }
  }

  const isFieldExist = (field) => {
    if (!field || field == "null" || field == "" || field == null) return false;
    else return true;
  };

  const createBodyData = (db_id, mData, vData) => {
    return JSON.stringify({
      id: db_id,
      updatedData: {
        ...(isFieldExist(mData.id) && { model_id: mData.id.toString() }),
        ...(isFieldExist(mData.name) && { model_name: mData.name }),
        ...(isFieldExist(mData.id) && {
          model_url: "https://civitai.com/models/" + mData.id.toString(),
        }),
        ...(isFieldExist(mData.creator) && {
          model_author: mData.creator.username,
        }),
        ...(isFieldExist(mData.creator) && {
          model_author_url:
            "https://civitai.com/models/" + mData.creator.username,
        }),
        ...(isFieldExist(vData.name) && { model_version: vData.name }),
        ...(isFieldExist(vData.id) && { model_version_id: vData.id }),
        ...(isFieldExist(vData.baseModel) && { base_model: vData.baseModel }),
        ...(isFieldExist(mData.tags) && { model_tags: mData.tags }),
        ...(isFieldExist(vData.trainedWords) && {
          activation_text: vData.trainedWords.join(","),
        }),
        ...(isFieldExist(vData.files) && { file_hash: checkSHA(vData) }),
      },
    });
  };

  const UpdateModelData = async (mData, vData) => {
    try {
      const response = await fetch("/api/maintenance/issues", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: createBodyData(model._id, mData, vData),
      });
      return response;
    } catch (error) {
      console.error("Error updating model:", error);
      return error;
    }
  };

  useEffect(() => {
    const updateData = async () => {
      if (modelData && versionData && !isUpdating) {
        setIsUpdating(true);
        const response = await UpdateModelData(modelData, versionData);
        if (response.status === 200) {
          onFetchComplete(true);
        } else {
          onFetchComplete(false);
        }
        setShouldFetch(false);
        setIsUpdating(false);
      }
    };

    updateData();
  }, [modelData, versionData]);

  const handleFetchClick = () => {
    if (!shouldFetch && !isUpdating) {
      setShouldFetch(true);
    }
  };
  return (
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
              {model.model_version_id}
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
            onClick={()=>handleFetchClick()}
            disabled={shouldFetch} // Disable button while fetching
            className={`inline-flex min-h-[3rem] w-full ${
              shouldFetch ? "bg-gray-400" : "bg-indigo-400 hover:bg-indigo-500"
            } text-white font-semibold justify-center items-center min-[900px]:justify-start rounded-md px-2 py-2 gap-2`}
          >
            <ArrowPathIcon
              className={`w-8 h-8 ${shouldFetch ? "animate-spin" : ""}`}
            />
            <span className="hidden md:inline-flex leading-none">
              {shouldFetch ? "Fetching..." : "Fetch"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
