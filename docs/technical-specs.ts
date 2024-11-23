// Types & Interfaces
interface Cluster {
  name: string;
  description: string;
  icon: string;
  categories: Record<string, Category>;
  metadata?: ClusterMetadata;
}

interface Category {
  id: string;
  name: string;
  description: string;
  path: string;
  subcategories: Record<string, Subcategory>;
  metadata?: CategoryMetadata;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  items: Record<string, ModifierGroup | string[]>;
  metadata?: SubcategoryMetadata;
}

interface ModifierGroup {
  name: string;
  description?: string;
  items: string[];
  metadata?: ModifierMetadata;
}

// Metadata Interfaces
interface BaseMetadata {
  tags?: string[];
  order?: number;
  visible?: boolean;
}

interface ClusterMetadata extends BaseMetadata {
  defaultCategory?: string;
}

interface CategoryMetadata extends BaseMetadata {
  defaultSubcategory?: string;
}

interface SubcategoryMetadata extends BaseMetadata {
  defaultGroup?: string;
}

interface ModifierMetadata extends BaseMetadata {
  usage?: string;
  examples?: string[];
}

// Component Structure
interface ComponentTree {
  App: {
    Layout: {
      Header: {
        Search: null;
        Navigation: null;
      };
      Main: {
        ClusterGrid: {
          ClusterCard: null;
        };
        CategoryGrid: {
          CategoryCard: null;
        };
        SubcategoryGrid: {
          SubcategoryCard: null;
        };
        ModifierGrid: {
          ModifierCard: null;
        };
      };
      Footer: null;
    };
    Context: {
      NavigationContext: null;
      SearchContext: null;
      BookmarkContext: null;
    };
  };
}
