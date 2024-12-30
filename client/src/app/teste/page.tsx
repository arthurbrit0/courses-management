// pages/debug-metadata.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

const DebugMetadata = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Carregando...</div>;
  if (!user) return <div>Usuário não autenticado.</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Public Metadata</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(user.publicMetadata, null, 2)}
      </pre>
    </div>
  );
};

export default DebugMetadata;