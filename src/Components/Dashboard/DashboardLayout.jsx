import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const handleNavigation = (option) => {
    window.location.href = `/dashboard/${option}`;
  };

  return (
    <Box sx={{ display: "flex" , flexDirection: "column" }}>
      {/* Navbar lateral stilizat */}
      <Box
        sx={{
          width: 250,
          backgroundColor: "#8d6e63", // Maro cald
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          color: "white",
          boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
          pt: 2,
        }}
      >
        <Toolbar>
          <Box sx={{ fontSize: 20, fontWeight: "bold" }}>Library Dashboard</Box>
        </Toolbar>
        <List>
          {[
            { text: "Users", option: "user" },
            { text: "Books", option: "book" },
            { text: "Authors", option: "author" },
            { text: "Categories", option: "category" },
            { text: "Loans", option: "loan" },
          ].map((item) => (
            <ListItem key={item.option} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.option)}
                sx={{
                  px: 3,
                  py: 1.5,
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#6d4c41", // Maro mai închis la hover
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  sx={{ fontSize: 18 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Conținut principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: "250px", // Spațiu pentru a nu se suprapune navbar-ul
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
