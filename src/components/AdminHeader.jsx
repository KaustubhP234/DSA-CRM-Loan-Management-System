const AdminHeader = () => {
  return (
    <div style={styles.header}>
      <h3>Admin Panel</h3>
      <span>Admin</span>
    </div>
  );
};

export default AdminHeader;

const styles = {
  header: {
    height: "60px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
};
