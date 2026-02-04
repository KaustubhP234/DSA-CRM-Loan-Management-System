import { useEffect, useState } from "react";
import { getActivitiesByLoan } from "../../utils/activityService";

const ActivityTimeline = ({ loanId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    setActivities(getActivitiesByLoan(loanId));
  }, [loanId]);

  if (activities.length === 0) {
    return (
      <p style={{ color: "#6b7280", marginTop: "10px" }}>
        No activity recorded yet.
      </p>
    );
  }

  return (
    <div style={styles.timeline}>
      {activities.map((a) => (
        <div key={a.id} style={styles.item}>
          <span style={styles.dot} />
          <div>
            <p style={styles.action}>{a.action}</p>
            <small>{a.by} • {a.time}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;

const styles = {
  timeline: {
    marginTop: "20px",
    borderLeft: "2px solid #e5e7eb",
    paddingLeft: "20px",
  },
  item: {
    position: "relative",
    marginBottom: "18px",
  },
  dot: {
    position: "absolute",
    left: "-29px",
    top: "6px",
    width: "10px",
    height: "10px",
    background: "#2563eb",
    borderRadius: "50%",
  },
  action: {
    fontWeight: "600",
  },
};
