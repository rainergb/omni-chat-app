"use client";

import React from "react";
import { ConfigProvider, App } from "antd";
import ptBR from "antd/locale/pt_BR";
import { MainTabs } from "@/components/layout/MainTabs";

const theme = {
  token: {
    colorPrimary: "#1890ff",
    borderRadius: 8,
    colorBgContainer: "#ffffff"
  },
  components: {
    Card: {
      borderRadius: 12
    },
    Button: {
      borderRadius: 8
    },
    Modal: {
      borderRadius: 12
    }
  }
};

export default function Home() {
  return (
    <ConfigProvider locale={ptBR} theme={theme}>
      <App>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">OC</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">
                      OmniChat
                    </h1>
                    <p className="text-sm text-gray-500">
                      Sistema Unificado de Chat
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">v1.0.0</div>
              </div>
            </div>
          </header>

          <main className="h-[calc(100vh-73px)]">
            <MainTabs />
          </main>
        </div>
      </App>
    </ConfigProvider>
  );
}
