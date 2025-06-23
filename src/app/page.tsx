"use client";

import React from "react";
import { App } from "antd";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Header } from "@/components/layout/Header";
import { MainLayout } from "@/components/layout/MainLayout";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <ThemeProvider>
      <App>
        <Header />
        <MainLayout />
        <Footer />
      </App>
    </ThemeProvider>
  );
}
