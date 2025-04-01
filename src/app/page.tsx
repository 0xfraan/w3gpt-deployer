"use client";

import React from "react";
import { AppProvider } from "../lib/AppContext";
import PromptList from "../components/PromptList";
import SettingsPanel from "../components/SettingsPanel";
import LogsPanel from "../components/LogsPanel";

export default function Home() {
  return (
    <AppProvider>
      <main className="container mx-auto p-4 max-w-7xl">
        <div className="space-y-6 mt-4">
          <PromptList />
          <SettingsPanel />
          <LogsPanel />
        </div>
      </main>
    </AppProvider>
  );
}
