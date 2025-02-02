import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const Navbar = () => {
  const onOptionSelect = (option) => {
    window.location.href = `/dashboard/${option}`;
  };

  return (
    
    <AppBar position="fixed" >
      <Toolbar>
        <Box>
          <Button color="inherit" onClick={() => onOptionSelect("user")}>
            Users
          </Button>
          <Button color="inherit" onClick={() => onOptionSelect("book")}>
            Books
          </Button>
          <Button color="inherit" onClick={() => onOptionSelect("author")}>
            Authors
          </Button>
          <Button color="inherit" onClick={() => onOptionSelect("category")}>
            Categories
          </Button>
          <Button color="inherit" onClick={() => onOptionSelect("loan")}>
            Loans
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
