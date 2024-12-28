"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

const CompletionPage = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#1B1C22] text-gray-100">
      <div className="text-center">
        <div className="cmb-4 rounded-full bg-green-500 p-3 inline-flex items-center justify-center">
          <Check className="w-16 h-16" />
        </div>
        <h1 className="text-4xl font-bold mb-3">FINALIZADA</h1>
        <p className="mb-1">
          🎉 Você finalizou sua compra com sucesso! 🎉
        </p>
      </div>
      <div className="">
        <p>
          Precisa de ajuda? Contate a nossa{" "}
          <Button variant="link" asChild className="p-0 m-0 text-primary-700">
            <a href="mailto:central@atendimento.com">central de atendimento.</a>
          </Button>
          .
        </p>
      </div>
      <div className="mt-2 flex justify-center bg-secondary-700 rounded-lg px-4 py-2 hover:bg-secondary-600 cursor-pointer">
        <Link href="user/courses" scroll={false}>
          Ir para cursos
        </Link>
      </div>
    </div>
  );
};

export default CompletionPage;