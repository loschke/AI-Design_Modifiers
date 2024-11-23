import { useState } from 'react';
import { SubcategoryData } from '../types/data';

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
          ? 'bg-success text-success-content' 
          : 'bg-base-200 text-base-content hover:bg-base-300'
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

  const renderModifierItems = (items: string[] | Record<string, string[]> | undefined) => {
    if (!items) return null;

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

    return Object.entries(items).map(([category, values], idx) => {
      // Check if values is an array
      if (Array.isArray(values)) {
        return (
          <div key={idx} className="flex flex-col gap-2">
            <h3 className="text-sm font-black italic text-neutral-content capitalize">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value, valueIndex) => (
                <div key={`${idx}-${valueIndex}`}>
                  {renderCopyButton(value)}
                </div>
              ))}
            </div>
          </div>
        );
      }
      // If values is another object, render it recursively
      return (
        <div key={idx} className="flex flex-col gap-4">
          <h3 className="text-sm font-black italic text-neutral-content capitalize">{category}</h3>
          {renderModifierItems(values)}
        </div>
      );
    });
  };

  const renderContent = () => {
    if (!subcategory) return null;

    // If it's a subcategory with items
    if (subcategory.items) {
      return renderModifierItems(subcategory.items);
    }
    
    // If it's a subcategory with modifiers
    if (subcategory.modifiers) {
      return Object.entries(subcategory.modifiers).map(([key, modifier]) => (
        <div key={key} className="border-t border-base-200 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0">
          <h3 className="text-lg font-black italic text-base-content mb-2">
            {modifier.name}
          </h3>
          {modifier.description && (
            <p className="text-neutral-content mb-3">
              {modifier.description}
            </p>
          )}
          {renderModifierItems(modifier.items)}
        </div>
      ));
    }

    return null;
  };

  if (!subcategory) {
    return (
      <div className="bg-base-100 rounded-lg shadow p-6">
        <div className="text-center text-neutral-content">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black italic text-base-content mb-2">
          {subcategory.name}
        </h2>
        {subcategory.description && (
          <p className="text-neutral-content">
            {subcategory.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {renderContent()}
      </div>
    </div>
  );
};
