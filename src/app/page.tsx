"use client";

import React from "react";
import { App } from "antd";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Components/Header/Header";

export default function Home() {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <App>
          <Header />
          <MainLayout />
          <Footer />
        </App>
      </NavigationProvider>
    </ThemeProvider>
  );
}
