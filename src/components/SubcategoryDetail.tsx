import { useState } from 'react';
import { Subcategory, Modifier, SubcategoryData } from '../types/data';

interface SubcategoryDetailProps {
  subcategory: SubcategoryData;
}

export const SubcategoryDetail = ({ subcategory }: SubcategoryDetailProps) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderCopyButton = (value: string) => (
    <button
      onClick={() => handleCopy(value)}
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium 
        ${copiedValue === value 
          ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } transition-colors duration-200`}
    >
      {value}
      {copiedValue === value ? (
        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
    </button>
  );

  const renderModifierItems = (items: string[] | Record<string, string[]>) => {
    if (Array.isArray(items)) {
      return (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div key={index}>
              {renderCopyButton(item)}
            </div>
          ))}
        </div>
      );
    }

    return Object.entries(items).map(([key, values], index) => (
      <div key={index} className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{key}</h3>
        <div className="flex flex-wrap gap-2">
          {values.map((value, valueIndex) => (
            <div key={`${index}-${valueIndex}`}>
              {renderCopyButton(value)}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const renderModifiers = () => {
    if (!subcategory.modifiers) return null;

    return Object.entries(subcategory.modifiers).map(([key, modifier], index) => (
      <div key={index} className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {modifier.name}
        </h3>
        {modifier.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {modifier.description}
          </p>
        )}
        {renderModifierItems(modifier.items)}
      </div>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {subcategory.name}
        </h2>
        {subcategory.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {subcategory.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {renderModifiers()}
      </div>
    </div>
  );
};
