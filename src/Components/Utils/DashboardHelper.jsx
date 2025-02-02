export function formatData(rows, keys) {
  return rows.map((row) => {
    const formattedRow = {};
    keys.forEach((key) => {
      if (row.hasOwnProperty(key)) {
        formattedRow[key] = row[key];
      }
    });
    return formattedRow;
  });
}

export function formatDate(milliseconds) {
  const date = new Date(milliseconds);
  if (milliseconds == null || milliseconds == 0) {
    return "Not Recorded";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function validateFields(fields, fieldValues, handleError) {
  var isValid = true;
  fields.forEach((field) => {
    if (
      !fieldValues[field.name] &&
      fieldValues[field.name] !== 0 &&
      field.editable
    ) {
      handleError("All fields are required!");
      isValid = false;
    }
  });

  return isValid;
}

export function parseJsonProperties(data) {
  function parseRecursive(obj) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        try {
          const parsed = JSON.parse(obj[key]);
          if (parsed && typeof parsed === "object") {
            obj[key] = parsed;
            parseRecursive(obj[key]); // Recursively parse nested objects
          }
        } catch (error) {
          // Ignore invalid JSON strings
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        parseRecursive(obj[key]); // Recursively handle nested objects
      }
    });
  }

  parseRecursive(data);
  return data;
}

