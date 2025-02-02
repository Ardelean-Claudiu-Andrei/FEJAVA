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
import { fetchUsers } from "./UserApi";
import AccordionForm from "../Component/AccordionForm"; // Importă componenta AccordionWithForm
import { addUser } from "./UserApi";

export default function UserDashboard() {
  const columns = useMemo(() => [
    { field: "id", headerName: "ID", type: "string", width: 300 },
    {
      field: "email",
      headerName: "Email",
      type: "string",
      editable: true,
      width: 200,
    },
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
      field: "role",
      headerName: "Role",
      type: "singleSelect",
      editable: true,
      width: 120,
      valueOptions: ["USER", "ADMIN"],
    },
  ]);

  const fields = [
    { 
      name: "firstName", 
      label: "First Name", 
      type: "string", 
      required: true 
    },
    { 
      name: "lastName", 
      label: "Last Name", 
      type: "string", 
      required: true 
    },
    { 
      name: "email", 
      label: "Email", 
      type: "string", 
      required: true 
    },
    { 
      name: "password", 
      label: "Password", 
      type: "password", 
      required: true 
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { value: "USER", label: "User" },
        { value: "ADMIN", label: "Admin" }
      ]
    }
  ];
  

  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const handleIsLoading = (isLoading) => {
    setIsLoading(isLoading);
  };

  const handleAddUser = (userData) => {
    setIsLoading(true);
    addUser(userData)
      .then(() => {
        fetchData(); // Reîncarcă lista de utilizatori după adăugare
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  const fetchData = () => {
    fetchUsers(handleIsLoading).then((users) => setRows(users));
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
            Manage Users
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
            Welcome to the User Management Panel, where administrators can efficiently oversee all registered user accounts. This section allows you to view user details, edit roles and permissions, manage account statuses, and ensure proper access control.{" "}
          </Typography>
        </Grid>
      </Grid>
      <Grid>
        <AccordionForm
          fields={fields}
          onAdd={handleAddUser}
          accordionTitle="Add User"
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
            url={HOST + "/user"}
          />
        </Box>
      </Grid>
    </>
  );
}
