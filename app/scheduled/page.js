"use client";

import Layout from "../components/Layout";
import { useDataContext } from "../components/Layout";
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
ArrowPathIcon,
ArrowDownCircleIcon,
PauseIcon,
TrashIcon,
ChevronLeftIcon,
ChevronRightIcon,
ClockIcon
} from "@heroicons/react/24/outline";
import Countdown from "react-countdown";



export default function Downloads() {
const [DlQueue, setDlQueue] = useState([]);
const flask_url = "http://192.168.18.17:5000";
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;
const dcontext = useDataContext();
const defaultTheme = require("tailwindcss/defaultTheme");


const setScheduledSize = dcontext.setScheduledSize;
const setDlQueueSize = dcontext.setDlQueueSize;
const copy_to_clipboard = (text) => {
navigator.clipboard.writeText(text);
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const {
data: queueData,
error: queueError,
isLoading: queueLoading,
} = useSWR("/api/download?mode=full", fetcher, { refreshInterval: 2000 });

useEffect(() => {
if (queueData && queueData.queue) {
setDlQueue(queueData.queue);
setScheduledSize(queueData.queue.filter((x) => x.flag === "sched").length); // Update the context value
setDlQueueSize(queueData.queue.filter((x) => x.flag === "que").length); // Update the context value
}
}, [queueData]);


const handleCancelSchedule = async (id) => {
try {
const res = await fetch(flask_url + "/schedule/delete/" + id);
if (!res.ok) throw new Error("Failed to fetch");
const data = await res.json();
console.log(data);
} catch (error) {
console.error("Error:", error);
}
};


const cd_renderer = ({ total, days, hours, minutes }) => {
// Render a countdown
return (
  <div>
    <span className="hidden min-[900px]:inline-flex">
      <span>
        {hours}d : {hours}h :
      </span>{" "}
      <span>{minutes}m</span>
    </span>
    <span className="max-[899x]:inline-flex min-[900px]:hidden">
      <span>{Math.floor(total / 60000)}m</span>
    </span>
  </div>
);
}
// Pagination logic
const queuedItems = DlQueue.filter((x) => x.flag === "sched");
const totalPages = Math.ceil(queuedItems.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = queuedItems.slice(indexOfFirstItem, indexOfLastItem);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

const paginationInfo = useMemo(() => {
const maxPageButtons = 7;
let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

if (endPage - startPage + 1 < maxPageButtons) {
startPage = Math.max(1, endPage - maxPageButtons + 1);
}

return {
startPage,
endPage,
maxPageButtons,
};
}, [currentPage, totalPages]);

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
i === currentPage
? "relative cursor-pointer z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
: "relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
}`}
>
{i}
</a>
);
}
return (
<div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-2 sm:px-6 ">
<div className="flex flex-1 min-items-center justify-center">
<div>
<nav
className="isolate inline-flex -space-x-px rounded-md shadow-sm"
aria-label="Pagination"
>
<a
href="#"
className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
onClick={() => paginate(currentPage - 1)}
disabled={currentPage === 1}
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
onClick={() => paginate(currentPage + 1)}
disabled={currentPage === totalPages}
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
    <div className="font-sans max-w-full mx-auto ">
      <h1 className="text-2xl font-extrabold text-gray-800">
        Scheduled Items ({queuedItems.length})
      </h1>
      <div className="grid  grid-cols-1 min-[900px]:max-[1500px]:grid-cols-2 min-[1501px]:grid-cols-3 gap-4 mt-8">
        <div className="col-span-1 min-[900px]:col-span-2 space-y-4 order-2 min-[900px]:order-1 ">
          <div className=" bg-green-300 items-center justify-center">
            {PaginationControls()}
          </div>
          {/* start of card */}
          {currentItems.map((model) => (
            <div
              className=" flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(6,81,237,0.3)]"
              key={model._id}
            >
              <div className="flex gap-4 w-full min-w-96">
                <div className="w-28 h-28 shrink-0">
                  <img
                    src={model.image_url}
                    className="m-auto w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      {model.model_name}
                    </h3>
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
                    <Countdown
                      date={Date.parse(model.early_access_end)}
                      renderer={cd_renderer}
                    ></Countdown>
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
          ))}
        </div>
      </div>
    </div>
  </Layout>
);
}
