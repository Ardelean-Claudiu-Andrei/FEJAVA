import {
  Box,
  Button,
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ManagementGrid from "../Component/ManagementGrid";
import { HOST } from "../../Utils/Constants";
import { fetchBooks } from "./BookApi";
import { fetchCategories } from "../Category/CategoryApi";
import { fetchAuthors } from "../Author/AuthorApi";
import { addBook } from "./BookApi";
import AccordionForm from "../Component/AccordionForm";

export default function BookDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    publication_date: "",
    isbn: "",
    state: "AVAILABLE",
    category: { id: "" },
    author: { id: "" },
  });

  const columns = useMemo(() => [
    { field: "id", headerName: "ID", type: "string", width: 300 },
    {
      field: "title",
      headerName: "Title",
      type: "string",
      editable: true,
      width: 200,
    },
    {
      field: "publication_date",
      headerName: "Publication Date",
      type: "string",
      editable: false,
      width: 200,
    },
    {
      field: "category",
      headerName: "Category",
      type: "singleSelect",
      width: 130,
      editable: true,
      valueOptions: categories,
      getOptionValue: (value) =>
        JSON.stringify({ id: value.id, name: value.name }),
      getOptionLabel: (value) => value.name,
    },
    {
      field: "author",
      headerName: "Author",
      type: "singleSelect",
      width: 130,
      editable: true,
      valueOptions: authors,
      getOptionValue: (value) =>
        JSON.stringify({
          id: value.id,
          firstName: value.firstName,
          lastName: value.lastName,
          birthday: value.birthday,
        }),
      getOptionLabel: (value) => `${value.firstName} ${value.lastName}`,
      editable: true,
    },
    {
      field: "isbn",
      headerName: "ISBN",
      type: "string",
      width: 200,
    },
    {
      field: "state",
      headerName: "State",
      type: "singleSelect",
      editable: true,
      width: 120,
      valueOptions: ["AVAILABLE", "BORROWED"],
    },
  ]);

  const fields = [
    { name: "title", label: "Title", type: "string", required: true },
    {
      name: "publication_date",
      label: "Publication Date",
      type: "date",
      required: true,
    },
    { name: "isbn", label: "ISBN", type: "string", required: true },
    {
      name: "state",
      label: "State",
      type: "select",
      required: true,
      options: [
        { value: "AVAILABLE", label: "Available" },
        { value: "BORROWED", label: "Borrowed" },
      ],
    },
    {
      name: "categoryId",
      label: "Category",
      type: "select",
      required: true,
      options: categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
    {
      name: "authorId",
      label: "Author",
      type: "select",
      required: true,
      options: authors.map((auth) => ({
        value: auth.id,
        label: `${auth.firstName} ${auth.lastName}`,
      })),
    },
  ];

  const handleIsLoading = (isLoading) => {
    setIsLoading(isLoading);
  };

  const handleAddBook = async (bookData) => {
    try {
      const bookPayload = {
        title: bookData.title,
        publication_date: bookData.publication_date,
        isbn: bookData.isbn,
        state: bookData.state,
        category: { id: bookData.categoryId },
        author: { id: bookData.authorId },
      };

      await addBook(bookPayload, handleIsLoading);
      fetchData();
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const fetchData = () => {
    fetchBooks(handleIsLoading).then((books) => setRows(books));
    fetchAuthors(handleIsLoading).then((authors) => {
      setAuthors(authors);
      fetchCategories(handleIsLoading).then((categories) =>
        setCategories(categories)
      );
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            Manage Books
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
            library's book collection. You can view, edit, and organize book
            details, including titles, authors, categories, publication dates,
            and availability status. Use the tools provided to add new books,
            update existing records, and maintain an accurate and organized
            inventory.{" "}
          </Typography>
        </Grid>
      </Grid>
      <Grid item marginTop={5} marginLeft={3}>
        <AccordionForm
          fields={fields}
          onAdd={handleAddBook}
          accordionTitle="Add Book"
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
            url={HOST + "/book"}
          />
        </Box>
      </Grid>
    </>
  );
}
