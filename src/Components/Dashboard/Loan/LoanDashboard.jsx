import {
  Box,
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ManagementGrid from "../Component/ManagementGrid";
import { fetchBooks } from "../Book/BookApi";
import { fetchUsers } from "../User/UserApi";
import { fetchLoans } from "./LoadApi";
import AccordionForm from "../Component/AccordionForm";
import { HOST } from "../../Utils/Constants";
import { addLoan } from "./LoadApi";

export default function LoanDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [newLoan, setNewLoan] = useState({
    userId: "",
    bookId: "",
    loanDate: "",
    returnDate: "",
    status: "ACTIVE",
  });

  const columns = useMemo(() => [
    { field: "id", headerName: "ID", type: "string", width: 300 },
    {
      field: "user",
      headerName: "User",
      type: "singleSelect",
      width: 130,
      editable: true,
      valueOptions: users,
      getOptionValue: (value) =>
        JSON.stringify({
          id: value.id,
          email: value.email,
          password: value.password,
          firstName: value.firstName,
          lastName: value.lastName,
          role: value.role,
        }),
      getOptionLabel: (value) => `${value.firstName} ${value.lastName}`,
    },
    {
      field: "book",
      headerName: "Book",
      type: "singleSelect",
      width: 130,
      editable: true,
      valueOptions: books,
      getOptionValue: (value) =>
        JSON.stringify({
          id: value.id,
          title: value.title,
          publication_date: value.publication_date,
          category: value.category,
          author: value.author,
          state: value.state,
          isbn: value.isbn,
        }),
      getOptionLabel: (value) => `${value.title}`,
      editable: true,
    },
    {
      field: "loanDate",
      headerName: "Loan Date",
      type: "string",
      editable: false,
      width: 200,
    },
    {
      field: "returnDate",
      headerName: "Return Date",
      type: "string",
      editable: false,
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      editable: true,
      width: 120,
      valueOptions: ["ACTIVE", "RETURNED", "OVERDUE"],
    },
  ]);

  const fields = [
    {
      name: "userId",
      label: "User",
      type: "select",
      required: true,
      options: users.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      })),
    },
    {
      name: "bookId",
      label: "Book",
      type: "select",
      required: true,
      options: books.map((book) => ({
        value: book.id,
        label: `${book.title}`,
      })),
    },
    {
      name: "loanDate",
      label: "Loan Date",
      type: "date",
      required: true,
    },
    {
      name: "returnDate",
      label: "Return Date",
      type: "date",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "ACTIVE", label: "Active" },
        { value: "RETURNED", label: "Returned" },
        { value: "OVERDUE", label: "Overdue" },
      ],
    },
  ];

  const handleIsLoading = (isLoading) => {
    setIsLoading(isLoading);
  };

  const fetchData = () => {
    fetchLoans(handleIsLoading).then((loans) => setRows(loans));
    fetchUsers(handleIsLoading).then((users) => setUsers(users));
    fetchBooks(handleIsLoading).then((books) => setBooks(books));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLoan = async (loanData) => {
    const loanPayload = {
      user: { id: loanData.userId },
      book: { id: loanData.bookId },
      loanDate: loanData.loanDate,
      returnDate: loanData.returnDate,
      status: loanData.status,
    };

    try {
      await addLoan(loanPayload, handleIsLoading);
      fetchData(); // Refresh data after adding new loan
    } catch (error) {
      console.error("Error adding loan:", error);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container direction="column" justifyContent="space-around">
        <Grid item xs={6} marginTop={5} marginLeft={3}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: "left",
              fontFamily: "Nunito Sans, sans-serif",
              fontWeight: 700,
            }}
          >
            Manage Loans
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              fontFamily: "Nunito Sans, sans-serif",
              fontWeight: 200,
            }}
          >
            This section allows administrators to efficiently manage the
            library's loan records. You can view, edit, and organize loan
            details, including user information, book titles, loan dates, return
            dates, and loan status (ACTIVE, RETURNED, OVERDUE). Use the tools
            provided to add new loans, update existing records, and ensure
            accurate tracking of borrowed books.
          </Typography>
        </Grid>
      </Grid>
      <Grid item marginTop={5} marginLeft={3}>
        <AccordionForm
          fields={fields}
          onAdd={handleAddLoan}
          accordionTitle="Add Loan"
        />
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-around"
        marginTop={10}
        marginLeft={2}
      >
        <Box sx={{ height: 450, maxWidth: "100%" }}>
          <ManagementGrid
            initialRows={rows}
            columns={columns}
            url={HOST + "/loan"}
          />
        </Box>
      </Grid>
    </>
  );
}
