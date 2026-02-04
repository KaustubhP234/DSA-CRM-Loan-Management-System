// src/components/notifications/NotificationBell.jsx

import { useEffect, useState } from "react";
import {
  getNotifications,
  markAllAsRead,
} from "../../utils/notificationService";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (open) {
      setNotifications(getNotifications());
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={styles.bell}>
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <span>Notifications</span>
            <button
              onClick={() => {
                markAllAsRead();
                setNotifications(getNotifications());
              }}
              style={styles.readBtn}
            >
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <p style={styles.empty}>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  ...styles.item,
                  background: n.read ? "#f9fafb" : "#eef2ff",
                }}
              >
                <p>{n.message}</p>
                <small>{n.time}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

/* ---------------- STYLES ---------------- */

const styles = {
  bell: {
    fontSize: "22px",
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "12px",
    padding: "2px 6px",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "35px",
    width: "320px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
    zIndex: 999,
  },
  header: {
    padding: "10px",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
  },
  readBtn: {
    fontSize: "12px",
    border: "none",
    background: "none",
    color: "#2563eb",
    cursor: "pointer",
  },
  item: {
    padding: "10px",
    borderBottom: "1px solid #e5e7eb",
  },
  empty: {
    padding: "15px",
    textAlign: "center",
    color: "#64748b",
  },
};
