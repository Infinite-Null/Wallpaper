import axios from "axios";
import API_SETTING from "./settings";

export async function loginUser(email: string, password: string) {
  try {
    const response = await axios.post(
      `${API_SETTING.full_url}/auth/login`,
      {
        email,
        password,
      },
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

export async function verifyUser() {
  try {
    const response = await axios.get(`${API_SETTING.full_url}/auth/me`, {
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

export async function logoutUser() {
  try {
    const response = await axios.post(
      `${API_SETTING.full_url}/auth/logout`,
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
