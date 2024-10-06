"use client";
import React, { useState, useContext, useEffect, createContext } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useDataContext } from "../components/Layout";

const OpenSideBarButton = ({sidebarOpen,setSidebarOpen}) => {
//   const dcontext = useDataContext();
//   const sidebarOpen = dcontext.sidebarOpen;
//   const setSidebarOpen = dcontext.setSidebarOpen;
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="min-[1150px]:hidden p-2 rounded-md text-gray-900"
      aria-label="Toggle sidebar"
    >
      {sidebarOpen ? (
        <XMarkIcon className="h-6 w-6" />
      ) : (
        <Bars3Icon className="h-6 w-6" />
      )}
    </button>
  );
};

export default OpenSideBarButton;
