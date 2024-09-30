import React, { useState, useEffect } from "react";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* <nav className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">File Manager</h2>
        <ul className="space-y-4">
          <li className="hover:bg-gray-700 py-2 px-4 rounded cursor-pointer">Home</li>
          <li className="hover:bg-gray-700 py-2 px-4 rounded cursor-pointer">Downloads</li>
          <li className="hover:bg-gray-700 py-2 px-4 rounded cursor-pointer">Settings</li>
        </ul>
      </nav> */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
