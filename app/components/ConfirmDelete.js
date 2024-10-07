import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/solid";

const ConfirmDelete = ({ model,showToast, onClose }) => {
  const [open, setOpen] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const flask_url = "http://192.168.18.17:5000";

  const handleDeleteModel = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(flask_url + "/model/delete/" + model._id);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setIsDeleting(false);
      setIsDownloaded(false);
      showToast("success", model._id + " is deleted");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setIsDeleting(false);
      showToast("error", "error deleting model: " + error);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto overflow-x-hidden outline-none">
        <div className="container flex min-h-full xl:w-1/2  lg:w-full md:w-full sm:w-full items-end justify-center mx-auto text-center sm:items-center sm:p-0">
          <DialogPanel className=" w-fit transform overflow-hidden rounded-lg bg-white sm:max-w-2xl p-2 pt-4 text-center align-middle shadow-xl transition-all">
            <div className="px-2 pb-2 sm:p-4 sm:pb-4">
              <div className="flex flex-wrap sm:flex">
                {/* start of content */}
                <div className="flex flex-wrap -mx4 gap-y-4  sm:justify-start justify-center">
                  <div className="w-full sm:w-1/2  text-center sm:text-left flex flex-col gap-y-4">
                    <div>
                      <DialogTitle
                        as="h2"
                        className="text-2xl font-bold text-grey-900"
                      >
                        Confirm Delete
                      </DialogTitle>
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-start border border-gray-200 rounded-lg shadow sm:flex-row sm:max-w-2x ">
                    <div className="relative overflow-hidden w-fit h-full bg-cover bg-no-repeat ">
                      <img
                        className="object-cover m-auto w-full h-full rounded-t-lg sm:h-auto sm:w-48 sm:rounded-none sm:rounded-s-lg"
                        src={model.image_url}
                        alt=""
                      ></img>
                    </div>
                    <div className="flex-col text-start sm:items-center pb-4 pr-2 pl-8 leading-normal">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                        {model.model_name}
                      </h5>
                      <h2 className="text-m title-font font-semibold text-blue-700 tracking-widest">
                        {model.model_version}
                      </h2>
                      <div
                        className="inline-flex pt-2 rounded-md shadow-sm mb-2 "
                        role="group"
                      >
                        <button
                          type="button"
                          onClick={() => copy_to_clipboard(model.model_id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium  bg-transparent border border-gray-900 rounded-s-lg  hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
                        >
                          {model.model_id}
                        </button>
                        <button
                          type="button"
                          onClick={() => copy_to_clipboard(model.version_id)}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium  bg-transparent border border-gray-900 rounded-e-lg  hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
                        >
                          {model.version_id}
                        </button>
                      </div>
                      <p className="mb-3 mt-3 text-lg font-semibold text-red-700">
                        Are you sure you want to delete this model?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-x-4">
              {isDeleting ? (
                <button className="flex items-center space-x-1 bg-gray-400 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-300">
                  <Spinner />
                  <span>Deleting...</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDeleteModel()}
                  className="flex items-center gap-x-2 bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded-md transition-colors duration-300"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              )}
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};


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

export default ConfirmDelete;
