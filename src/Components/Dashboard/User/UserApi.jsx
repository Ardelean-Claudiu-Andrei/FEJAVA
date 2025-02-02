import axios from "axios";
import { HOST } from "../../Utils/Constants";

export async function addUser(userData) {
    try {
      const response = await axios.post(HOST + "/user/register", userData);
      console.log("User added:", response.data);
    } catch (error) {
      console.error("Error adding user: ", error);
      throw error;
    }
  }

export async function fetchUsers(handleIsLoading) {
  try {
    handleIsLoading(true);
    const response = await axios.get(HOST + "/user/allUsers");

    return response.data;
  } catch (error) {
    console.error("Error fetching categories: ", error);
  } finally {
    handleIsLoading(false);
  }
}