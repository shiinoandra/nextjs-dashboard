import React, { useState } from "react";
import Image from "next/image";
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

import {
	LinkIcon,
	TagIcon,
	CheckCircleIcon,
	MinusCircleIcon,
} from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const ModelDetail = ({ model,onClose }) => {
	const [open, setOpen] = useState(true);
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

	const test_tags = [
		"character",
		"background",
		"comcept",
		"style",
		"anime",
		"girl",
		"sexy",
		"cartoon",
		"manga",
	];

	const copy_to_clipboard = (text) =>{
		navigator.clipboard.writeText(text)
	};

	return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto overflow-x-hidden outline-none">
        <div className="container flex min-h-full xl:w-1/2  lg: w-full md:w-full sm:w-full items-end justify-center mx-auto text-center sm:items-center sm:p-0">
          <DialogPanel className=" w-full max-w-fit transform overflow-hidden rounded-lg bg-white p-2 pt-4 text-center align-middle shadow-xl transition-all">
            <div className="px-2 pb-2 pt-4 sm:p-4 sm:pb-4">
              <div className="flex flex-wrap md:flex md:items-start">
                {/* start of content */}
                <div className="flex flex-wrap -mx4 gap-y-8">
                  <div className="w-full md:w-1/2 px-4">
                    <img
                      src={model.image_url}
                      alt={model.name}
                      width={500}
                      height={500}
                      layout="responsive"
                      className="rounded-lg shadow-md mb-4 m-auto w-fit h-fit bg-cover"
                    ></img>
                  </div>
                  <div className="w-full md:w-1/2 px-4 text-left flex flex-col gap-y-4">
                    <div>
                      <DialogTitle
                        as="h2"
                        className="text-2xl font-bold leading-6 text-grey-900 mb-2"
                      >
                        {`${model.model_name}`}
                      </DialogTitle>
                    </div>
                    <div className="flex items-center space-x-4 mb-2">
                      <h2 className="text-sm title-font font-semibold text-blue-500 tracking-widest">
                        {model.model_version}
                      </h2>
                      {/* start of status row */}
                      {model.downloaded ? (
                        <span className="inline-flex items-center bg-green-200 text-green-800 ring-2 ring-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full ">
                          <span className="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
                          Installed
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-slate-200 text-slate-800 ring-2 ring-slate-400 text-xs font-medium px-2.5 py-0.5 rounded-full ">
                          <span className="w-2 h-2 me-1 bg-slate-600 rounded-full"></span>
                          Not Installed
                        </span>
                      )}
                    </div>
                    {/* end of status row */}

                    {/* button for model id and version id */}
                    <div
                      className="inline-flex rounded-md shadow-sm mb-2 "
                      role="group"
                    >
                      <button
                        type="button"
                        onClick={() => copy_to_clipboard(model.model_id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium  bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
                      >
                        <LinkIcon className="h-4 w-4" />
                        {model.model_id}
                      </button>
                      <button
                        type="button"
                        onClick={() => copy_to_clipboard(model.version_id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium  bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white"
                      >
                        <TagIcon className="h-4 w-4" />
                        {model.version_id}
                      </button>
                    </div>
                    {/* end of model id and verson id row */}
                    {/* published date */}

                    <TabGroup>
                      <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                              selected
                                ? "bg-white shadow"
                                : "text-blue-100 hover:bg-white/[0.12] hover:text-slate-600"
                            )
                          }
                        >
                          Description
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                              selected
                                ? "bg-white shadow"
                                : "text-blue-100 hover:bg-white/[0.12] hover:text-slate-600"
                            )
                          }
                        >
                          Metadata
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                              "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                              selected
                                ? "bg-white shadow"
                                : "text-blue-100 hover:bg-white/[0.12] hover:text-slate-600"
                            )
                          }
                        >
                          Activation
                        </Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel>
                          {/* description div */}
                          <div className="h-72 max-w-full list-disc mt-4 pl-4 text-sm overflow-y-auto overflow-x-auto rounded">
                            <div
                              className="max-w-72"
                              dangerouslySetInnerHTML={{
                                __html: model.model_description,
                              }}
                            ></div>
                            {model.version_info && model.version_info != "" ? (
                              <div>
                                <p className="flex items-center text-sm font-semibold">
                                  Version Info:
                                </p>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: model.version_description,
                                  }}
                                ></div>
                              </div>
                            ) : (
                              <div />
                            )}
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <div className="h-72 max-w-full list-disc mt-4 pl-4 text-sm overflow-y-auto">
                            <div className="flex justify-between text-gray-600 border-b-2 border-gray-300">
                              <p className="flex items-start text-sm font-semibold">
                                Author
                              </p>
                              <div className="flex items-center">
                                <p className="p-1 mr-4 text-sm rounded">
                                  {model.author}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between text-gray-600 border-b-2 border-gray-300">
                              <p className="flex items-center text-sm font-semibold">
                                Created
                              </p>
                              <div className="flex items-center">
                                <p className="p-1 mr-4 text-sm rounded">
                                  {model.created_date}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between text-gray-600 border-b-2 border-gray-300">
                              <p className="flex items-center text-sm font-semibold">
                                Published
                              </p>
                              <div className="flex items-center">
                                <p className="p-1 mr-4 text-sm rounded">
                                  {model.published_date}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between text-gray-600 border-b-2 border-gray-300">
                              <p className="flex items-center text-sm font-semibold">
                                Base Model
                              </p>
                              <div className="flex items-center">
                                <p className="p-1 mr-4 text-sm rounded">
                                  {model.base_model}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between text-gray-600 border-b-2 border-gray-300">
                              <p className="flex items-center text-sm font-semibold">
                                SHA256
                              </p>
                              <div className="flex items-center w-60">
                                <p
                                  onClick={() =>
                                    copy_to_clipboard(
                                      model.file_hash
                                        ? model.file_hash["SHA256"]
                                        : ""
                                    )
                                  }
                                  className="p-1 mr-4 text-sm overflow-hidden truncate underline underline-offset-1 cursor-pointer hover:color-sky-500"
                                >
                                  {model.file_hash
                                    ? model.file_hash["SHA256"]
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between text-gray-600 border-b-2 border-gray-300">
                              <p className="flex items-center text-sm font-semibold">
                                Filename
                              </p>
                              <div className="flex items-center w-max-60">
                                <p
                                  onClick={() =>
                                    copy_to_clipboard(model.file_name)
                                  }
                                  className="p-1 mr-4 text-sm overflow-hidden truncate cursor-pointer hover:color-sky-500"
                                >
                                  {" "}
                                  {model.file_name}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 ">
                              <div>
                                <ul className="max-w-md space-y-1 text-slate-900 list-inside  mt-8">
                                  <li className="flex text-md items-center">
                                    {model.nsfw ? (
                                      <CheckCircleIcon className="w-6 h-6 me-2 text-green-500 rounded-full flex-shrink-0 outline outline-2 outline-offset-0 outline-green-400"></CheckCircleIcon>
                                    ) : (
                                      <MinusCircleIcon className="w-6 h-6 me-2 text-red-500 rounded-full flex-shrink-0 outline outline-2 outline-offset-0 outline-red-400"></MinusCircleIcon>
                                    )}
                                    NSFW
                                  </li>
                                  <li className="flex text-md items-center">
                                    {model.minor ? (
                                      <CheckCircleIcon className="w-6 h-6 me-2 text-green-500 rounded-full flex-shrink-0 outline outline-2 outline-offset-0 outline-green-400"></CheckCircleIcon>
                                    ) : (
                                      <MinusCircleIcon className="w-6 h-6 me-2 text-red-500 rounded-full flex-shrink-0 outline outline-2 outline-offset-0 outline-red-400"></MinusCircleIcon>
                                    )}
                                    Minor
                                  </li>
                                </ul>
                              </div>
                              <div>
                                <ul className="max-w-md space-y-1 text-slate-900 list-inside  mt-8">
                                  <li className="flex text-md items-center">
                                    {model.poi ? (
                                      <CheckCircleIcon className="w-6 h-6 me-2 text-green-500 rounded-full flex-shrink-0 outline outline-2 outline-offset-0 outline-green-400"></CheckCircleIcon>
                                    ) : (
                                      <MinusCircleIcon className="w-6 h-6 me-2 text-red-500 rounded-full flex-shrink-0 outline outline-2 outline-offset-0 outline-red-400"></MinusCircleIcon>
                                    )}
                                    Person of Interest
                                  </li>
                                  <li className="flex text-md items-center">
                                    {model.minor ? (
                                      <CheckCircleIcon className="w-6 h-6 me-2 text-green-500 rounded-full flex-shrink-0 outline outline-2 outline-offset-0 outline-green-400"></CheckCircleIcon>
                                    ) : (
                                      <MinusCircleIcon className="w-6 h-6 me-2 text-red-500 rounded-full flex-shrink-0 outline outline-2 outline-offset-0 outline-red-400"></MinusCircleIcon>
                                    )}
                                    Minor
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <div className="h-72 max-w-full list-disc mt-4 pl-4 text-sm overflow-y-auto"></div>
                        </TabPanel>
                      </TabPanels>
                    </TabGroup>

                    {/* begin tags section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Tags:</h3>
                      <div className="flex flex-wrap gap-x-1 gap-y-2">
                        {test_tags &&
                          test_tags.length > 0 &&
                          test_tags.map((tag, index) => {
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
                    {/* end tags section */}
                    <div className="mb-6"></div>
                    <div className="flex space-x-4 mb-6">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                        Download
                      </button>
                      <button className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100 transition duration-300 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                        Wishlist
                      </button>
                    </div>
                    {/* <div>
											<h3 className="text-lg font-semibold mb-2">
												Key Features:
											</h3>
											<ul className="list-disc list-inside">
												{model.tags.map((tag, index) => (
													<li key={index}>{tag}</li>
												))}
											</ul>
										</div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Deactivate
              </button>
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

export default ModelDetail;
