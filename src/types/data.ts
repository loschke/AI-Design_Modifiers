export interface Metadata {
  order?: number;
  defaultSubcategory?: string;
  tags?: string[];
}

export interface Cluster {
  name: string;
  description: string;
  icon: string;
  categories: Record<string, Category>;
  metadata?: Metadata;
}

export interface Category {
  name: string;
  description: string;
  path?: string;
  items?: string[] | Record<string, string[]>;
  subcategories?: Record<string, NavigationSubcategory | Subcategory>;
  modifiers?: Record<string, Modifier>;
  metadata?: Metadata;
}

// For navigation purposes (like in medium.json)
export interface NavigationSubcategory {
  name: string;
  description: string;
  path: string;
  metadata?: Metadata;
}

// For actual content (like in realistic.json)
export interface Subcategory {
  name: string;
  description: string;
  items: string[] | Record<string, string[]>;
  modifiers?: Record<string, Modifier>;
  subcategories?: Record<string, NavigationSubcategory | Subcategory>;
  metadata?: Metadata;
}

export interface Modifier {
  name: string;
  description: string;
  items: string[] | Record<string, string[]>;
  subcategories?: Record<string, NavigationSubcategory | Subcategory>;
  metadata?: Metadata;
}

export type CategoryItem = Category | NavigationSubcategory | Subcategory | Modifier;

export interface SubcategoryData {
  name: string;
  description: string;
  items?: string[] | Record<string, string[]>;
  modifiers?: Record<string, Modifier>;
  metadata?: Metadata;
}
