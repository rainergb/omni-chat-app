"use client";

import React from "react";
import { App } from "antd";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <ThemeProvider>
      <App>
        <MainLayout />
      </App>
    </ThemeProvider>
  );
}
