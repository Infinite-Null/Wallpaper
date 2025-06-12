import axios from "axios";
import API_SETTING from "./settings";

interface Wallpaper {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  keywords: string[];
  category: string;
  downloadCount: number;
  adminId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  wallpaperStyle: "anime" | "real";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WallpaperPaginationResponse {
  wallpapers: Wallpaper[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalWallpapers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface HomeScreenData {
  featured: Wallpaper[];
  recent: Wallpaper[];
  categories: {
    category: string;
    wallpapers: Wallpaper[];
  }[];
  statistics: {
    totalWallpapers: number;
    totalDownloads: number;
    availableCategories: string[];
    availableStyles: string[];
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface CreateWallpaperData {
  title: string;
  description: string;
  imageUrl: string;
  keywords: string[];
  category: string;
  wallpaperStyle: "anime" | "real";
}

interface UpdateWallpaperData {
  title?: string;
  description?: string;
  imageUrl?: string;
  keywords?: string[];
  category?: string;
  wallpaperStyle?: "anime" | "real";
  isActive?: boolean;
}

interface WallpaperQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  wallpaperStyle?: string;
  keyword?: string;
  sortBy?: "createdAt" | "downloadCount" | "title";
  sortOrder?: "asc" | "desc";
  isActive?: boolean;
}

/**
 * Create a new wallpaper
 * @param wallpaperData - Wallpaper data
 * @returns Promise with creation confirmation
 */
export async function createWallpaper(
  wallpaperData: CreateWallpaperData
): Promise<ApiResponse<Wallpaper>> {
  try {
    const response = await axios.post(
      `${API_SETTING.full_url}/wallpapers`,
      wallpaperData,
      {
        withCredentials: true,
      }
    );

    return response?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw { success: false, message: "Invalid Token" };
    } else if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: "No response from server" };
    } else {
      throw { success: false, message: error.message };
    }
  }
}

/**
 * Update wallpaper by ID
 * @param id - Wallpaper ID
 * @param wallpaperData - Updated wallpaper data
 * @returns Promise with update confirmation
 */
export async function updateWallpaper(
  id: string,
  wallpaperData: UpdateWallpaperData
): Promise<ApiResponse<Wallpaper>> {
  try {
    const response = await axios.put(
      `${API_SETTING.full_url}/wallpapers/${id}`,
      wallpaperData,
      {
        withCredentials: true,
      }
    );

    return response?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw { success: false, message: "Invalid Token" };
    } else if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: "No response from server" };
    } else {
      throw { success: false, message: error.message };
    }
  }
}

/**
 * Delete wallpaper by ID
 * @param id - Wallpaper ID to delete
 * @returns Promise with deletion confirmation
 */
export async function deleteWallpaper(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await axios.delete(
      `${API_SETTING.full_url}/wallpapers/${id}`,
      {
        withCredentials: true,
      }
    );

    return response?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw { success: false, message: "Invalid Token" };
    } else if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: "No response from server" };
    } else {
      throw { success: false, message: error.message };
    }
  }
}

/**
 * Get wallpapers with pagination and filters
 * @param params - Query parameters for filtering
 * @returns Promise with wallpapers and pagination data
 */
export async function getWallpapers(
  params: WallpaperQueryParams = {}
): Promise<ApiResponse<WallpaperPaginationResponse>> {
  try {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await axios.get(
      `${API_SETTING.full_url}/wallpapers?${searchParams.toString()}`,
      {
        withCredentials: true,
      }
    );

    return response?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw { success: false, message: "Invalid Token" };
    } else if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: "No response from server" };
    } else {
      throw { success: false, message: error.message };
    }
  }
}

/**
 * Get wallpaper by ID
 * @param id - Wallpaper ID
 * @returns Promise with wallpaper details
 */
export async function getWallpaperById(
  id: string
): Promise<ApiResponse<Wallpaper>> {
  try {
    const response = await axios.get(
      `${API_SETTING.full_url}/wallpapers/${id}`,
      {
        withCredentials: true,
      }
    );

    return response?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw { success: false, message: "Invalid Token" };
    } else if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: "No response from server" };
    } else {
      throw { success: false, message: error.message };
    }
  }
}

/**
 * Get home screen data
 * @returns Promise with home screen data
 */
export async function getHomeScreenData(): Promise<
  ApiResponse<HomeScreenData>
> {
  try {
    const response = await axios.get(
      `${API_SETTING.full_url}/wallpapers/home`,
      {
        withCredentials: true,
      }
    );

    return response?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw { success: false, message: "Invalid Token" };
    } else if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: "No response from server" };
    } else {
      throw { success: false, message: error.message };
    }
  }
}

/**
 * Increment download count for a wallpaper
 * @param id - Wallpaper ID
 * @returns Promise with updated download count
 */
export async function incrementWallpaperDownload(
  id: string
): Promise<ApiResponse<{ downloadCount: number }>> {
  try {
    const response = await axios.post(
      `${API_SETTING.full_url}/wallpapers/${id}/download`,
      {},
      {
        withCredentials: true,
      }
    );

    return response?.data ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw { success: false, message: "Invalid Token" };
    } else if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { success: false, message: "No response from server" };
    } else {
      throw { success: false, message: error.message };
    }
  }
}

// Constants for categories and styles
export const WALLPAPER_CATEGORIES = [
  "lord_krishna",
  "lord_ram",
  "lord_karna",
  "lord_arjun",
  "lord_shiva",
  "lord_vishnu",
  "lord_ganesha",
  "lord_hanuman",
  "lord_brahma",
  "lord_indra",
  "lord_surya",
  "others",
] as const;

export const WALLPAPER_STYLES = ["anime", "real"] as const;

export type {
  ApiResponse,
  CreateWallpaperData,
  HomeScreenData,
  UpdateWallpaperData,
  Wallpaper,
  WallpaperPaginationResponse,
  WallpaperQueryParams,
};
