import {
  Box,
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { fetchCategories, addCategory } from "./CategoryApi";
import ManagementGrid from "../Component/ManagementGrid";
import { HOST } from "../../Utils/Constants";
import AccordionForm from "../Component/AccordionForm";

export default function CategoryDashboard() {
  const columns = useMemo(() => [
    { field: "id", headerName: "ID", type: "string", width: 300 },
    {
      field: "name",
      headerName: "Category Name",
      type: "string",
      editable: true,
      width: 200,
    },
  ]);

  const fields = [
    {
      name: "name",
      label: "Category Name",
      type: "string",
      required: true,
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const handleIsLoading = (isLoading) => {
    setIsLoading(isLoading);
  };

  const handleAddCategory = (categoryData) => {
    setIsLoading(true);
    addCategory(categoryData)
      .then(() => {
        fetchData();
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const fetchData = () => {
    fetchCategories(handleIsLoading).then((categories) => setRows(categories));
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
            Manage Categories
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
            Efficiently manage and organize your library's categories. This
            section allows you to add new categories, update existing ones, and
            ensure a well-structured classification system for your books.
          </Typography>
        </Grid>
      </Grid>

      <Grid container marginTop={5} marginLeft={3}>
        <AccordionForm
          fields={fields}
          onAdd={handleAddCategory}
          accordionTitle="Add Category"
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
            url={HOST + "/category"}
          />
        </Box>
      </Grid>
    </>
  );
}
