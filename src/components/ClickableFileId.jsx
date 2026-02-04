import { useNavigate } from "react-router-dom";

/**
 * Clickable File ID Component
 * Makes file IDs clickable and navigates to file details page
 * 
 * Usage:
 * <ClickableFileId fileId={file.id} />
 * <ClickableFileId fileId={file.id} role="admin" />
 * <ClickableFileId fileId={file.id} role="bank-executive" />
 */

const ClickableFileId = ({ fileId, role = "admin", className = "", style = {} }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const basePath = role === "bank-executive" ? "/bank-executive" : "/admin";
    navigate(`${basePath}/file/${fileId}`);
  };

  const defaultStyle = {
    color: '#3b82f6',
    fontWeight: 700,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s',
    fontFamily: 'monospace',
    ...style
  };

  return (
    <span
      onClick={handleClick}
      className={className}
      style={defaultStyle}
      onMouseEnter={(e) => {
        e.target.style.textDecoration = 'underline';
        e.target.style.color = '#2563eb';
      }}
      onMouseLeave={(e) => {
        e.target.style.textDecoration = 'none';
        e.target.style.color = '#3b82f6';
      }}
    >
      {fileId}
    </span>
  );
};

export default ClickableFileId;