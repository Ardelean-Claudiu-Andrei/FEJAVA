import * as React from "react";
import { DataGrid, GridActionsCellItem, GridCheckIcon } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteRow, updateRow } from "../DashboardApi";
import { formatData, parseJsonProperties } from "../../Utils/DashboardHelper";
import AlertDialogSlide from "../../Common/AlertDialogSlide";

export default function ManagementGrid({
    initialRows,
    columns,
    url,
    keysToKeep,
  }) {
    const [rows, setRows] = React.useState(initialRows);
    const [keys, setKeys] = React.useState(keysToKeep ?? []);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState(null);
    const [dialogType, setDialogType] = React.useState(null);
  
    const actionsColumn = {
      field: "actions",
      type: "actions",
      width: 120,
      getActions: (params) => {
        const baseActions = [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteUser(params.id)}
          />,
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save Changes"
            onClick={saveChanges(params.id)}
          />,
        ];
    
        return baseActions;
      }
    };
  
    const updatedColumns = [...columns, actionsColumn];
  
    const deleteUser = React.useCallback(
      (id) => () => {
        setTimeout(() => {
          setSelectedId(id);
          setOpenDialog(true);
          setDialogType("delete");
        });
      },
      []
    );
  
    const saveChanges = React.useCallback(
      (id) => () => {
        setTimeout(() => {
          setSelectedId(id);
          setOpenDialog(true);
          setDialogType("save");
        });
      },
      []
    );
  
    React.useEffect(() => {
      setRows(initialRows);
      console.log("ROws:")
      console.log(initialRows)
    }, [initialRows]);
  
    const handleConfirm = async () => {
      if (dialogType === "delete") {
        const deleteResult = await deleteRow(url + `/${selectedId}`);
        if (deleteResult) {
          toast.success("The row was deleted successfully!");
          setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
        } else {
          toast.error("There was an error deleting the row.");
        }
      } else if (dialogType === "save") {
        var data; 
        if (keys.length) {
          const formattedData = formatData(rows, keys);
          data = formattedData.filter((row) => row.id === selectedId)[0];
        } else {
          data = rows.filter((row) => row.id === selectedId)[0];
        }
  
        if (data) {
          data = parseJsonProperties(data);
        }
  
        console.log(data);
        const saveResult = await updateRow(url + "/update", data);
  
        if (saveResult) {
          toast.success("The row was updated successfully!");
        } else {
          toast.error("There was an error updating the row.");
        }
      }
      setOpenDialog(false);
      setDialogType(null);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
  
    const handleRowUpdate = (updatedRow) => {
      console.log(updatedRow);
      const { id, ...updatedData } = updatedRow;
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === updatedRow.id ? { ...row, ...updatedData } : row
        )
      );
  
      return updatedRow;
    };
  
    const handleRowUpdateError = (error) => {
      console.error("Error updating row:", error);
      toast.error("There was an error updating the row!");
    };
  
    return (
      <div style={{ height: 380, maxWidth: "100%" }}>
        <ToastContainer position="bottom-right"/>
        <DataGrid
          autosizeOnMount
          editMode="row"
          columns={updatedColumns}
          rows={rows}
          processRowUpdate={(updatedRow, originalRow) =>
            handleRowUpdate(updatedRow)
          }
          onProcessRowUpdateError={handleRowUpdateError}
        />
        <AlertDialogSlide
          open={openDialog}
          handleClose={handleCloseDialog}
          handleOk={handleConfirm}
          title={dialogType === "delete" ? "Confirm Deletion" : "Confirm Save"}
          contentText={
            dialogType === "delete"
              ? "This action is not reversible. Are you sure you want to delete this row?"
              : "Do you want to save the changes you made?"
          }
          disagreeLabel="Cancel"
          agreeLabel={dialogType === "delete" ? "Delete" : "Save"}
        />  
      </div>
    );
  }