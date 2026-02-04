// src/utils/activityService.js

export const getActivities = () => {
  return JSON.parse(localStorage.getItem("activities")) || [];
};

export const addActivity = (loanId, action, by = "ADMIN") => {
  if (!loanId) return; // ❌ do not log global activities here

  const activities = getActivities();

  const newActivity = {
    id: Date.now(),
    loanId: String(loanId), // ✅ FORCE STRING
    action,
    by,
    time: new Date().toLocaleString(),
  };

  localStorage.setItem(
    "activities",
    JSON.stringify([newActivity, ...activities])
  );
};

export const getActivitiesByLoan = (loanId) => {
  return getActivities().filter(
    (a) => a.loanId === String(loanId) // ✅ STRING MATCH
  );
};
