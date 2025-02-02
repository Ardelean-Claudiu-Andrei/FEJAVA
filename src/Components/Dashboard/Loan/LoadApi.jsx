import axios from "axios";
import { HOST } from "../../Utils/Constants";
import { Category, Password } from "@mui/icons-material";

export async function fetchLoans(handleLoading) {
  try {
    handleLoading(true);
    const response = await axios.get(HOST + "/loan/all");

    const data = response.data.map((loan) => ({
      id: loan.id,
      user: JSON.stringify({
        id: loan.user.id,
        email: loan.user.email,
        password: loan.user.password,
        firstName: loan.user.firstName,
        lastName: loan.user.lastName,
        role: loan.user.role,
      }),
      book: JSON.stringify({
        id: loan.book.id,
        title: loan.book.title,
        publication_date: loan.book.publication_date,
        category : JSON.stringify({
            id: loan.book.category.id,
            name: loan.book.category.name
        }),
        author: JSON.stringify({
          id: loan.book.author.id,
          firstName: loan.book.author.firstName,
          lastName: loan.book.author.lastName,
          birthday: loan.book.author.birthday
        }),
        state: loan.book.state,
        isbn: loan.book.isbn
      }),
      loanDate: loan.loanDate,
      returnDate: loan.returnDate,
      status: loan.status
    }),);

    return data;
  } catch (error) {
    throw error;
  } finally {
    handleLoading(false);
  }
}


export async function addLoan(loanPayload, handleLoading) {
    try {
        handleLoading(true)
        const response = await axios.post(HOST + "/loan/add", loanPayload);
        console.log(loanPayload)
    } catch(error) {
        console.log(loanPayload)
        console.log(error)
    } finally {
        handleLoading(false)
    }
}