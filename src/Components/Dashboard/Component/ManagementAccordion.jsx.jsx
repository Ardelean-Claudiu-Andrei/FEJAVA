import React, { useState } from "react";
import { TextField, Button, Grid, MenuItem } from "@mui/material";

const ManagementAccordion = ({ fields, onSubmit }) => {
  const initialFormState = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialFormState);
  };

  const renderField = (field) => {
    switch (field.type) {
      case "string":
        return (
          <TextField
            label={field.label}
            variant="outlined"
            fullWidth
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            multiline={field.multiline || false}
            rows={field.rows || 1}
          />
        );
      case "date":
        return (
          <TextField
            label={field.label}
            type="date"
            variant="outlined"
            fullWidth
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            InputLabelProps={{ shrink: true }}
          />
        );
      case "select":
        return (
          <TextField
            select
            label={field.label}
            fullWidth
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            sx={{
              "& .MuiSelect-select": {
                textAlign: "left",
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            {field.options &&
              field.options.map((option, index) => {
                if (typeof option === "object") {
                  return (
                    <MenuItem key={index} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                } else {
                  return (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  );
                }
              })}
          </TextField>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid item xs={12} key={index}>
              {renderField(field)}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button sx={{backgroundColor:"#8d6e63"}} type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ManagementAccordion;
