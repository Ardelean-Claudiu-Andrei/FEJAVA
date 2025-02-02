import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManagementAccordion from './ManagementAccordion.jsx';

const AccordionForm = ({ fields, onAdd, accordionTitle }) => {
  return (
    <Grid
      container
      marginTop={5}
      marginLeft={2}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12} sm={8} md={6}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
           <Box sx={{ fontSize: 16, fontWeight: "bold" }}>{accordionTitle}</Box>
          </AccordionSummary>
          <AccordionDetails>
            <ManagementAccordion fields={fields} onSubmit={onAdd} />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default AccordionForm;
