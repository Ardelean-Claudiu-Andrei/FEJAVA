import axios from "axios";
import { HOST } from "../../Utils/Constants";

export async function addAuthor(userData) {
    try {
      const response = await axios.post(HOST + "/author/add", userData);
      console.log("Author added:", response.data);
    } catch (error) {
      console.error("Error adding author: ", error);
      throw error;
    }
  }

export async function fetchAuthors(handleIsLoading) {
  try {
    handleIsLoading(true);
    const response = await axios.get(HOST + "/author/all");

    return response.data;
  } catch (error) {
    console.error("Error fetching categories: ", error);
  } finally {
    handleIsLoading(false);
  }
}