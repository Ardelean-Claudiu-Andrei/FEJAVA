import axios from "axios";
import { HOST } from "../../Utils/Constants";

export async function addCategory(categoryData) {
    try {
      const response = await axios.post(HOST + "/category/add", categoryData);
      console.log("Category added:", response.data);
    } catch (error) {
      console.error("Error adding category: ", error);
      throw error;
    }
  }
  
export async function fetchCategories(handleIsLoading) {
  try {
    handleIsLoading(true);
    const response = await axios.get(HOST + "/category/all");

    return response.data;
  } catch (error) {
    console.error("Error fetching categories: ", error);
  } finally {
    handleIsLoading(false);
  }
}