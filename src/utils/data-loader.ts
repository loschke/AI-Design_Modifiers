import { Cluster, Category, Subcategory } from '../types/data';

export async function loadClusterData(clusterPath: string): Promise<Cluster> {
  try {
    const response = await fetch(clusterPath);
    if (!response.ok) {
      throw new Error(`Failed to load cluster data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading cluster data:', error);
    throw error;
  }
}

export async function loadCategoryData(categoryPath: string): Promise<Category> {
  try {
    const response = await fetch(categoryPath);
    if (!response.ok) {
      throw new Error(`Failed to load category data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading category data:', error);
    throw error;
  }
}

export async function loadSubcategoryData(subcategoryPath: string): Promise<Subcategory> {
  try {
    const response = await fetch(subcategoryPath);
    if (!response.ok) {
      throw new Error(`Failed to load subcategory data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading subcategory data:', error);
    throw error;
  }
}
