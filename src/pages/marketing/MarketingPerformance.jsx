import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MarketingPerformance = () => {
  const navigate = useNavigate();

  const [timeframe, setTimeframe] = useState("30"); // days
  const [performance, setPerformance] = useState({
    overview: {
      totalLeads: 0,
      newLeads: 0,
      converted: 0,
      conversionRate: 0,
      totalValue: 0,
      avgDealSize: 0,
      activeFiles: 0,
      completedFiles: 0,
    },
    trends: [],
    teamPerformance: [],
    bankPerformance: [],
    hourlyActivity: [],
    conversionFunnel: [],
  });

  useEffect(() => {
    loadPerformanceData();
  }, [timeframe]);

  const loadPerformanceData = () => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const loanFiles = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe));

    // Filter data by timeframe
    const recentCustomers = customers.filter(c => {
      const date = new Date(c.date_of_registration || c.registrationDate || c.created_date);
      return date >= startDate && date <= endDate;
    });

    const recentFiles = loanFiles.filter(f => {
      const date = new Date(f.createdAt || f.createdDate || f.date_of_registration);
      return date >= startDate && date <= endDate;
    });

    // Overview stats
    const totalLeads = customers.length;
    const newLeads = recentCustomers.length;
    const converted = new Set(recentFiles.map(f => f.customerId || f.customer_id)).size;
    const conversionRate = newLeads > 0 ? (converted / newLeads * 100) : 0;
    const totalValue = recentFiles.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
    const avgDealSize = recentFiles.length > 0 ? totalValue / recentFiles.length : 0;
    const activeFiles = recentFiles.filter(f => 
      (f.status || f.fileStatus) === "In-Process" || (f.status || f.fileStatus) === "Active"
    ).length;
    const completedFiles = recentFiles.filter(f => (f.status || f.fileStatus) === "Completed").length;

    // Daily trends (last 7 days)
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCustomers = customers.filter(c => {
        const cDate = (c.date_of_registration || c.registrationDate || c.created_date || "").split('T')[0];
        return cDate === dateStr;
      }).length;
      
      const dayFiles = loanFiles.filter(f => {
        const fDate = (f.createdAt || f.createdDate || f.date_of_registration || "").split('T')[0];
        return fDate === dateStr;
      }).length;
      
      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        leads: dayCustomers,
        conversions: dayFiles,
      });
    }

    // Team performance
    const userStats = {};
    recentFiles.forEach(file => {
      const userId = file.user_id || file.createdBy || "Unknown";
      if (!userStats[userId]) {
        const user = users.find(u => String(u.id) === String(userId));
        userStats[userId] = {
          name: user ? user.name : `User ${userId}`,
          files: 0,
          amount: 0,
          completed: 0,
        };
      }
      userStats[userId].files++;
      userStats[userId].amount += parseFloat(file.amount || 0);
      if ((file.status || file.fileStatus) === "Completed") {
        userStats[userId].completed++;
      }
    });
    const teamPerformance = Object.values(userStats)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Bank performance
    const bankStats = {};
    recentFiles.forEach(file => {
      const bank = file.bankName || file.bank_name || "Unknown";
      if (!bankStats[bank]) {
        bankStats[bank] = {
          name: bank,
          files: 0,
          amount: 0,
          avgAmount: 0,
          conversionRate: 0,
        };
      }
      bankStats[bank].files++;
      bankStats[bank].amount += parseFloat(file.amount || 0);
    });
    const bankPerformance = Object.values(bankStats).map(bank => ({
      ...bank,
      avgAmount: bank.amount / bank.files,
    })).sort((a, b) => b.amount - a.amount);

    // Hourly activity (simulated - in production, use actual timestamps)
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      activity: Math.floor(Math.random() * (recentFiles.length / 24)) + 1,
    }));

    // Conversion funnel
    const conversionFunnel = [
      { stage: "Total Leads", count: totalLeads, percentage: 100 },
      { stage: "Contacted", count: Math.floor(totalLeads * 0.8), percentage: 80 },
      { stage: "Interested", count: Math.floor(totalLeads * 0.5), percentage: 50 },
      { stage: "Applied", count: recentFiles.length, percentage: (recentFiles.length / totalLeads * 100) },
      { stage: "Completed", count: completedFiles, percentage: (completedFiles / totalLeads * 100) },
    ];

    setPerformance({
      overview: {
        totalLeads,
        newLeads,
        converted,
        conversionRate,
        totalValue,
        avgDealSize,
        activeFiles,
        completedFiles,
      },
      trends,
      teamPerformance,
      bankPerformance,
      hourlyActivity,
      conversionFunnel,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .performance-page {
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .header-left h1 {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }

        .header-left p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .timeframe-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .timeframe-select:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        /* Overview Stats */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--stat-color);
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0.5rem 0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
          color: #10b981;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 2px solid #e2e8f0;
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Trend Chart */
        .trend-chart {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 200px;
          gap: 0.5rem;
        }

        .trend-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .bar-group {
          width: 100%;
          display: flex;
          gap: 0.25rem;
          height: 150px;
          align-items: flex-end;
        }

        .bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s;
          position: relative;
        }

        .bar:hover {
          opacity: 0.8;
        }

        .bar-leads {
          background: linear-gradient(180deg, #10b981, #059669);
        }

        .bar-conversions {
          background: linear-gradient(180deg, #3b82f6, #2563eb);
        }

        .bar-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Funnel Chart */
        .funnel-chart {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .funnel-stage {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .funnel-label {
          min-width: 100px;
          font-weight: 600;
          color: #0f172a;
          font-size: 0.875rem;
        }

        .funnel-bar-container {
          flex: 1;
          background: #f1f5f9;
          border-radius: 6px;
          height: 40px;
          position: relative;
          overflow: hidden;
        }

        .funnel-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 6px;
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .funnel-count {
          min-width: 80px;
          text-align: right;
          font-weight: 700;
          color: #10b981;
        }

        /* Team Table */
        .team-table {
          width: 100%;
          border-collapse: collapse;
        }

        .team-table thead th {
          text-align: left;
          padding: 0.75rem;
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .team-table tbody td {
          padding: 0.875rem 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.875rem;
          color: #475569;
        }

        .team-table tbody tr:hover {
          background: #f8fafc;
        }

        .rank-badge {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.875rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .overview-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .performance-page {
            padding: 1rem;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            flex-direction: column;
          }

          .timeframe-select,
          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="performance-page">
        {/* Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>🏆 Performance Analytics</h1>
            <p>Track detailed marketing performance metrics and trends</p>
          </div>
          <div className="header-actions">
            <select
              className="timeframe-select"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
            <button className="btn btn-primary" onClick={() => navigate("/marketing")}>
              <span>📊</span>
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="overview-grid">
          <div className="stat-card" style={{ '--stat-color': '#10b981' }}>
            <div className="stat-icon">👥</div>
            <div className="stat-label">New Leads</div>
            <div className="stat-value">{performance.overview.newLeads}</div>
            <div className="stat-change">↑ Last {timeframe} days</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#3b82f6' }}>
            <div className="stat-icon">✅</div>
            <div className="stat-label">Converted</div>
            <div className="stat-value">{performance.overview.converted}</div>
            <div className="stat-change">{performance.overview.conversionRate.toFixed(1)}% rate</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#8b5cf6' }}>
            <div className="stat-icon">💰</div>
            <div className="stat-label">Total Value</div>
            <div className="stat-value">{formatCurrency(performance.overview.totalValue).split('.')[0]}</div>
            <div className="stat-change">Generated revenue</div>
          </div>
          <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
            <div className="stat-icon">📊</div>
            <div className="stat-label">Avg Deal Size</div>
            <div className="stat-value">{formatCurrency(performance.overview.avgDealSize).split('.')[0]}</div>
            <div className="stat-change">Per transaction</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* Trend Chart */}
          <div className="chart-card">
            <h3 className="chart-title">
              <span>📈</span>
              <span>7-Day Performance Trend</span>
            </h3>
            <div className="trend-chart">
              {performance.trends.map((day, idx) => {
                const maxValue = Math.max(...performance.trends.map(d => Math.max(d.leads, d.conversions)));
                return (
                  <div key={idx} className="trend-bar">
                    <div className="bar-group">
                      <div
                        className="bar bar-leads"
                        style={{ height: `${(day.leads / maxValue) * 100}%` }}
                        title={`${day.leads} leads`}
                      />
                      <div
                        className="bar bar-conversions"
                        style={{ height: `${(day.conversions / maxValue) * 100}%` }}
                        title={`${day.conversions} conversions`}
                      />
                    </div>
                    <div className="bar-label">{day.date}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="chart-card">
            <h3 className="chart-title">
              <span>🎯</span>
              <span>Conversion Funnel</span>
            </h3>
            <div className="funnel-chart">
              {performance.conversionFunnel.map((stage, idx) => (
                <div key={idx} className="funnel-stage">
                  <div className="funnel-label">{stage.stage}</div>
                  <div className="funnel-bar-container">
                    <div className="funnel-bar" style={{ width: `${stage.percentage}%` }}>
                      {stage.percentage.toFixed(0)}%
                    </div>
                  </div>
                  <div className="funnel-count">{stage.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="chart-card full-width">
          <h3 className="chart-title">
            <span>👥</span>
            <span>Team Performance</span>
          </h3>
          <table className="team-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team Member</th>
                <th>Files</th>
                <th>Completed</th>
                <th>Total Amount</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {performance.teamPerformance.map((member, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="rank-badge">#{idx + 1}</div>
                  </td>
                  <td><strong>{member.name}</strong></td>
                  <td>{member.files}</td>
                  <td>{member.completed}</td>
                  <td><strong>{formatCurrency(member.amount)}</strong></td>
                  <td>
                    <strong style={{ color: '#10b981' }}>
                      {member.files > 0 ? ((member.completed / member.files) * 100).toFixed(1) : 0}%
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bank Performance */}
        <div className="chart-card full-width">
          <h3 className="chart-title">
            <span>🏦</span>
            <span>Bank Performance</span>
          </h3>
          <table className="team-table">
            <thead>
              <tr>
                <th>Bank</th>
                <th>Files</th>
                <th>Total Amount</th>
                <th>Avg Amount</th>
              </tr>
            </thead>
            <tbody>
              {performance.bankPerformance.map((bank, idx) => (
                <tr key={idx}>
                  <td><strong>{bank.name}</strong></td>
                  <td>{bank.files}</td>
                  <td><strong>{formatCurrency(bank.amount)}</strong></td>
                  <td>{formatCurrency(bank.avgAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MarketingPerformance;