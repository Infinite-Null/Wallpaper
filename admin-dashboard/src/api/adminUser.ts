import axios from "axios";
import API_SETTING from "./settings";

interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminPaginationResponse {
  admins: AdminUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAdmins: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Get all admin users with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise with admin users and pagination data
 */
export async function getAdmins(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<AdminPaginationResponse>> {
  try {
    const response = await axios.get(
      `${API_SETTING.full_url}/auth?page=${page}&limit=${limit}`,
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
 * Get admin user by ID
 * @param id - Admin user ID
 * @returns Promise with admin user details
 */
export async function getAdminById(
  id: string
): Promise<ApiResponse<AdminUser>> {
  try {
    const response = await axios.get(`${API_SETTING.full_url}/auth/${id}`, {
      withCredentials: true,
    });

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
 * Delete admin user by ID
 * @param id - Admin user ID to delete
 * @returns Promise with deletion confirmation
 */
export async function deleteAdmin(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await axios.delete(`${API_SETTING.full_url}/auth/${id}`, {
      withCredentials: true,
    });

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
 * Create a new admin user
 * @param adminData - Admin user data
 * @returns Promise with creation confirmation
 */
export async function CreateAdmin(adminData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}): Promise<ApiResponse<null>> {
  try {
    const response = await axios.post(
      `${API_SETTING.full_url}/auth/register`,
      adminData,
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

export type { AdminPaginationResponse, AdminUser, ApiResponse };
