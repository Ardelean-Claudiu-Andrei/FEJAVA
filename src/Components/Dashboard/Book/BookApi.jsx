import axios from "axios";
import { HOST } from "../../Utils/Constants";

export async function addBook(bookData, handleLoading) {
    try {
      handleLoading(true);
      console.log(bookData);
      const response = await axios.post(HOST + "/book/add", bookData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      handleLoading(false);
    }
  }

export async function fetchBooks(handleLoading) {
  try {
    handleLoading(true);
    const response = await axios.get(HOST + "/book/all");

    const data = response.data.map((book) => ({
      id: book.id,
      title: book.title,
      publication_date: book.publication_date,
      category: JSON.stringify({
        id: book.category.id,
        name: book.category.name,
      }),
      author: JSON.stringify({
        id: book.author.id,
        firstName: book.author.firstName,
        lastName: book.author.lastName,
        birthday: book.author.birthday,
      }),
      state: book.state,
      isbn: book.isbn,
    }));

    return data;
  } catch (error) {
    throw error;
  } finally {
    handleLoading(false);
  }
}
