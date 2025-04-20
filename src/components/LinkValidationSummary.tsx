"use client"

import { useState } from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface LinkValidationSummaryProps {
  totalLinks: number;
  validLinks: number;
  invalidLinks: number;
  sameDomainLinks: number;
  differentDomainLinks: number;
}

export const LinkValidationSummary = ({
  totalLinks,
  validLinks,
  invalidLinks,
  sameDomainLinks,
  differentDomainLinks
}: LinkValidationSummaryProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Estado de los enlaces</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300">Enlaces totales:</span>
          <span className="font-medium text-gray-900 dark:text-white">{totalLinks}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CheckCircle size={12} className="text-green-500" />
            <span className="text-gray-600 dark:text-gray-300">Enlaces accesibles:</span>
          </div>
          <span className="font-medium text-green-600 dark:text-green-500">{validLinks}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <AlertCircle size={12} className="text-red-500" />
            <span className="text-gray-600 dark:text-gray-300">Enlaces no accesibles:</span>
          </div>
          <span className="font-medium text-red-600 dark:text-red-500">{invalidLinks}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CheckCircle size={12} className="text-green-500" />
            <span className="text-gray-600 dark:text-gray-300">Mismo dominio:</span>
          </div>
          <span className="font-medium text-green-600 dark:text-green-500">{sameDomainLinks}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <AlertCircle size={12} className="text-amber-500" />
            <span className="text-gray-600 dark:text-gray-300">Dominio diferente:</span>
          </div>
          <span className="font-medium text-amber-600 dark:text-amber-500">{differentDomainLinks}</span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Siempre intentamos abrir el artículo directamente. Solo en caso de enlaces completamente inaccesibles se redirige al sitio principal.
      </div>
    </div>
  );
};
