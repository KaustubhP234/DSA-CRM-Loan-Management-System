// src/utils/notificationService.js

export const getNotifications = () => {
  return JSON.parse(localStorage.getItem("notifications")) || [];
};

export const addNotification = (message) => {
  const notifications = getNotifications();

  const newNotification = {
    id: Date.now(),
    message,
    time: new Date().toLocaleString(),
    read: false,
  };

  localStorage.setItem(
    "notifications",
    JSON.stringify([newNotification, ...notifications])
  );
};

export const markAllAsRead = () => {
  const notifications = getNotifications().map((n) => ({
    ...n,
    read: true,
  }));

  localStorage.setItem("notifications", JSON.stringify(notifications));
};
