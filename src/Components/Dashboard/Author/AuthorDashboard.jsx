import {
  Box,
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import ManagementGrid from "../Component/ManagementGrid";
import { HOST } from "../../Utils/Constants";
import { fetchAuthors, addAuthor } from "./AuthorApi";
import AccordionForm from "../Component/AccordionForm";

export default function AuthorDashboard() {
  const columns = useMemo(() => [
    { field: "id", headerName: "ID", type: "string", width: 300 },
    {
      field: "firstName",
      headerName: "First Name",
      type: "string",
      editable: true,
      width: 200,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      type: "string",
      editable: true,
      width: 200,
    },
    {
      field: "birthday",
      headerName: "Birthday",
      type: "string",
      width: 200,
    },
  ]);

  const fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "string",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "string",
      required: true,
    },
    {
      name: "birthday",
      label: "Birthday",
      type: "date",
      required: true,
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const handleIsLoading = (isLoading) => {
    setIsLoading(isLoading);
  };

  const handleAddAuthor = (authorData) => {
    setIsLoading(true);
    addAuthor(authorData)
      .then(() => {
        fetchData();
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const fetchData = () => {
    fetchAuthors(handleIsLoading).then((authors) => setRows(authors));
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
            Manage Authors
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
            This section allows you to add new authors, update their details,
            and maintain accurate records of their contributions. Keep author
            information organized for seamless cataloging and reference.
          </Typography>
        </Grid>
      </Grid>

      <Grid>
        <AccordionForm
          fields={fields}
          onAdd={handleAddAuthor}
          accordionTitle="Add Author"
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
            url={HOST + "/author"}
          />
        </Box>
      </Grid>
    </>
  );
}
