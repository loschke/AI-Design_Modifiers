import { useState } from 'react';
import { SubcategoryData, PromptExample } from '../types/data';

interface SubcategoryDetailProps {
  subcategory: SubcategoryData;
}

export const SubcategoryDetail = ({ subcategory }: SubcategoryDetailProps) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

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
      onClick={(e) => {
        e.stopPropagation();
        handleCopy(value);
      }}
      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium 
        ${copiedValue === value 
          ? 'bg-success text-success-content' 
          : 'bg-base-200 text-base-content hover:bg-base-300'
        } transition-colors duration-200`}
    >
      {value}
      {copiedValue === value ? (
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      )}
    </button>
  );

  const renderModifierItems = (items: string[] | Record<string, string[]> | undefined) => {
    if (!items) return null;

    if (Array.isArray(items)) {
      return (
        <div className="flex flex-wrap gap-4">
          {items.map((item, index) => (
            <div key={index}>
              {renderCopyButton(item)}
            </div>
          ))}
        </div>
      );
    }

    return Object.entries(items).map(([category, values], idx) => {
      if (Array.isArray(values)) {
        return (
          <div key={idx} className="flex flex-col gap-4">
            <h3 className="text-sm font-black text-neutral-content capitalize">{category}</h3>
            <div className="flex flex-wrap gap-4">
              {values.map((value, valueIndex) => (
                <div key={`${idx}-${valueIndex}`}>
                  {renderCopyButton(value)}
                </div>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div key={idx} className="flex flex-col gap-6">
          <h3 className="text-sm font-black text-neutral-content capitalize">{category}</h3>
          {renderModifierItems(values)}
        </div>
      );
    });
  };

  const renderExampleDetails = (example: PromptExample) => (
    <div className="mt-4 space-y-4">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-neutral-content mb-2">Verwendete Elemente:</h4>
        {Object.entries(example.elements).map(([category, items], idx) => (
          <div key={idx} className="mb-3">
            <h5 className="text-sm font-medium text-neutral-content capitalize">{category}:</h5>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(items) ? items.map((item, i) => (
                <span key={i} className="text-sm bg-base-200 px-2 py-1 rounded">{item}</span>
              )) : Object.entries(items).map(([subCategory, subItems], i) => (
                <div key={i} className="w-full">
                  <span className="text-sm text-neutral-content">{subCategory}:</span>
                  {subItems.map((item, j) => (
                    <span key={j} className="text-sm bg-base-200 px-2 py-1 rounded ml-2">{item}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-neutral-content">{example.explanation}</p>
    </div>
  );

  const renderExample = (example: PromptExample) => {
    const isExpanded = expandedExample === example.title;
    
    return (
      <div 
        key={example.title}
        className="border border-base-200 rounded-lg overflow-hidden mb-2"
      >
        <div 
          onClick={() => setExpandedExample(isExpanded ? null : example.title)}
          className={`p-4 cursor-pointer transition-colors duration-200 flex justify-between items-center
            ${isExpanded ? 'bg-base-300' : 'bg-base-200 hover:bg-base-300'}`}
        >
          <div className="flex-1">
            <h3 className="text-lg font-bold text-base-content">{example.title}</h3>
            <div className="mt-2">
              {renderCopyButton(example.prompt)}
            </div>
          </div>
          <svg 
            className={`w-6 h-6 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isExpanded && (
          <div className="p-4 bg-base-300">
            {renderExampleDetails(example)}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (!subcategory) return null;

    // If it has direct examples, render them
    if (subcategory.examples) {
      return (
        <div className="mt-6">
          {subcategory.examples.map((example) => renderExample(example))}
        </div>
      );
    }

    // If it's a subcategory with items
    if (subcategory.items) {
      return renderModifierItems(subcategory.items);
    }
    
    // If it's a subcategory with modifiers
    if (subcategory.modifiers) {
      return Object.entries(subcategory.modifiers).map(([key, modifier]) => (
        <div key={key} className="border-t border-base-200 pt-6 mt-6 first:border-0 first:pt-0 first:mt-0">
          {/* Only show modifier name if it's different from subcategory name */}
          {modifier.name !== subcategory.name && (
            <h3 className="text-lg font-black text-base-content mb-4">
              {modifier.name}
            </h3>
          )}
          {modifier.description && modifier.description !== subcategory.description && (
            <p className="text-neutral-content mb-4">
              {modifier.description}
            </p>
          )}
          {renderModifierItems(modifier.items)}
          {modifier.examples && (
            <div className="mt-6">
              {modifier.examples.map((example) => renderExample(example))}
            </div>
          )}
        </div>
      ));
    }

    return null;
  };

  if (!subcategory) {
    return (
      <div className="bg-base-100 rounded-lg shadow p-8">
        <div className="text-center text-neutral-content">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-base-content mb-4">
          {subcategory.name}
        </h2>
        {subcategory.description && (
          <p className="text-neutral-content">
            {subcategory.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {renderContent()}
      </div>
    </div>
  );
};
