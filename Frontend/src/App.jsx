import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UploadCSV from "./pages/UploadCSV";
import Dashboard from "./pages/Dashboard";
import { DataProvider } from "./context/DataContext";

export default function App() {
  return (
    <div className="h-screen overflow-hidden">
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UploadCSV />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </div>
  );
}
