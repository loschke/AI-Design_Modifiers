import React, { useState } from 'react';
import { ChevronRight, Search, Copy, Bookmark, Image, Layout, Paintbrush, Box, Wand2, Settings } from 'lucide-react';

// Beispieldaten wie zuvor, aber gekürzt für die Übersichtlichkeit
const clusters = {
  concept: {
    icon: <Layout size={20} />,
    name: "Concept",
    description: "Medium, style, and conceptual elements",
    categories: {
      medium: {
        name: "Medium",
        description: "Different types of media and artistic styles",
        subcategories: {
          realistic_media: {
            name: "Realistic Media",
            description: "Photography and film-based media",
            items: {
              photography: {
                name: "Photography",
                description: "Various photographic styles",
                general: [
                  "a photo of",
                  "a photograph of",
                  "a snapshot of"
                ],
                professional: [
                  "a National Geographic style photo of",
                  "an editorial photograph of"
                ]
              },
              film: {
                name: "Film",
                description: "Cinematic and movie styles",
                items: [
                  "a still from a film",
                  "a cinematic shot of"
                ]
              }
            }
          },
          artistic_media: {
            name: "Artistic Media",
            description: "Traditional art forms",
            items: {
              painting: {
                name: "Painting",
                description: "Various painting techniques",
                items: [
                  "an oil painting of",
                  "a watercolor painting of"
                ]
              },
              drawing: {
                name: "Drawing",
                description: "Drawing and illustration styles",
                items: [
                  "a sketch of",
                  "an illustration of"
                ]
              }
            }
          }
        }
      }
    }
  }
  // Weitere Cluster hier...
};

export default function ModifierDocumentation() {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const resetSelection = () => {
    setSelectedCluster(null);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const renderModifierCard = (title, description, items, onClick = null) => (
    <div 
      onClick={onClick}
      className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
    >
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-3">{description}</p>
      )}
      {items && (
        <div className="space-y-1">
          {Object.entries(items).slice(0, 3).map(([key, value]) => (
            <div key={key} className="text-sm text-gray-600">
              • {typeof value === 'string' ? value : value.name || key.replace(/_/g, ' ')}
            </div>
          ))}
          {Object.keys(items).length > 3 && (
            <div className="text-sm text-blue-500">
              + {Object.keys(items).length - 3} more
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderModifierList = (items) => {
    if (!Array.isArray(items)) return null;
    return (
      <div className="grid grid-cols-1 gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <span className="text-gray-800 font-medium">{item}</span>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full" title="Copy">
                <Copy size={16} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full" title="Preview">
                <Image size={16} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full" title="Bookmark">
                <Bookmark size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Modifier Documentation</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search modifiers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={resetSelection} className="hover:text-blue-500">
            Home
          </button>
          {selectedCluster && (
            <>
              <ChevronRight size={16} />
              <button onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
              }} className="hover:text-blue-500">
                {clusters[selectedCluster].name}
              </button>
            </>
          )}
          {selectedCategory && (
            <>
              <ChevronRight size={16} />
              <button onClick={() => setSelectedSubcategory(null)} className="hover:text-blue-500">
                {clusters[selectedCluster].categories[selectedCategory].name}
              </button>
            </>
          )}
          {selectedSubcategory && (
            <>
              <ChevronRight size={16} />
              <span>{clusters[selectedCluster].categories[selectedCategory].subcategories[selectedSubcategory].name}</span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {!selectedCluster ? (
          // Cluster Overview - Grid Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(clusters).map(([key, cluster]) => (
              <div
                key={key}
                onClick={() => setSelectedCluster(key)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-500">
                    {cluster.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{cluster.name}</h3>
                    <p className="text-sm text-gray-500">{cluster.description}</p>
                  </div>
                </div>
                {Object.entries(cluster.categories).length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                    {Object.entries(cluster.categories).map(([catKey, category]) => (
                      <div key={catKey} className="text-sm">
                        <span className="font-medium text-gray-700">{category.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : !selectedCategory ? (
          // Category Overview - Grid Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(clusters[selectedCluster].categories).map(([key, category]) => (
              <div
                key={key}
                onClick={() => setSelectedCategory(key)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                  {Object.entries(category.subcategories).map(([subKey, subCat]) => (
                    <div key={subKey} className="text-sm">
                      <span className="font-medium text-gray-700">{subCat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !selectedSubcategory ? (
          // Subcategory Overview - Grid Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(clusters[selectedCluster].categories[selectedCategory].subcategories).map(([key, subCategory]) => (
              <div
                key={key}
                onClick={() => setSelectedSubcategory(key)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{subCategory.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{subCategory.description}</p>
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                  {Object.entries(subCategory.items).map(([itemKey, item]) => (
                    <div key={itemKey} className="text-sm">
                      <span className="font-medium text-gray-700">
                        {typeof item === 'string' ? item : item.name || itemKey.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Modifier View - Grid Layout with Categories
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(clusters[selectedCluster].categories[selectedCategory].subcategories[selectedSubcategory].items).map(([key, section]) => (
              <div key={key} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {section.name || key.replace(/_/g, ' ')}
                </h3>
                {section.description && (
                  <p className="text-sm text-gray-500 mb-4">{section.description}</p>
                )}
                {renderModifierList(section.items || section)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
