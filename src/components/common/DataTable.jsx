import React from "react";
import "./DataTable.css";

const DataTable = ({
  columns = [],
  data = [],
  searchKey = "",
  actions = null
}) => {
  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (val) =>
        val &&
        val.toString().toLowerCase().includes(searchKey.toLowerCase())
    )
  );

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="empty">
                No Records Found
              </td>
            </tr>
          ) : (
            filteredData.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col, cidx) => (
                  <td key={cidx}>
                    {row[col.key] ?? "-"}
                  </td>
                ))}
                {actions && (
                  <td>{actions(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
