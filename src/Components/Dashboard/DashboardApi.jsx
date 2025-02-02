import axios from "axios";

export async function deleteRow(url) {
    console.log(url);
    try {
      await axios.delete(url);
  
      return true;
    } catch (error) {
      return false;
    }
  }
  
  export async function updateRow(url, data) {
    console.log(url);
    try {
      await axios.put(url, data);
  
      return true;
    } catch (error) {
      return false;
    }
  }