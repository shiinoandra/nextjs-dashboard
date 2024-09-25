import React from "react";

const FilterPopout = ({ filters, onFilterChange, onClose }) => {

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
      filters[name]=checked;
      onFilterChange();
      //console.log(filters);
    };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-white">Filter Options</h2>

        <div className="mb-2">
          <label className="block text-m font-medium text-gray-300">
            Search type:
          </label>
          <label className="flex items-center mb-5 cursor-pointer">
            <input
              name="showHidden"
              type="checkbox"
              value=""
              checked={filters["showHidden"] ? "checked" : ""}
              className="sr-only peer"
              onChange={handleChange}
            ></input>
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Show Hidden
            </span>
          </label>

          <label className="flex items-center mb-5 cursor-pointer">
            <input
              name="showFavorites"
              type="checkbox"
              value=""
              checked={filters["showFavorites"] ? "checked" : ""}
              className="sr-only peer "
              onChange={handleChange}
            ></input>
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Show Only Favorites
            </span>
          </label>

          <label className="flex items-center mb-5 cursor-pointer">
            <input
              name="showDownloaded"
              type="checkbox"
              value=""
              checked={filters["showDownloaded"] ? "checked" : ""}
              className="sr-only peer"
              onChange={handleChange}
            ></input>
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Show Downloaded
            </span>
          </label>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPopout;
