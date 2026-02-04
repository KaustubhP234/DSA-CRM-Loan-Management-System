import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MarketingDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    activeFiles: 0,
    totalCommission: 0,
    monthlyLeads: 0,
    conversionRate: 0,
    avgDealSize: 0,
    pendingFiles: 0,
  });

  const [recentLeads, setRecentLeads] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = () => {
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const loanFiles = JSON.parse(localStorage.getItem("loanFiles")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Calculate total leads (customers)
    const totalLeads = customers.length;
    
    // Calculate converted leads (customers with loan files)
    const customerIdsWithFiles = loanFiles.map(f => f.customerId || f.customer_id);
    const convertedLeads = new Set(customerIdsWithFiles).size;
    
    // Calculate active files
    const activeFiles = loanFiles.filter(f => 
      (f.status || f.fileStatus) === "Active" || 
      (f.status || f.fileStatus) === "In-Process"
    ).length;
    
    // Calculate total commission (example: 1% of loan amount)
    const totalCommission = loanFiles.reduce((sum, file) => {
      if ((file.status || file.fileStatus) === "Completed") {
        return sum + (parseFloat(file.amount || 0) * 0.01);
      }
      return sum;
    }, 0);
    
    // Get current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculate monthly leads
    const monthlyLeads = customers.filter(c => {
      const regDate = new Date(c.date_of_registration || c.registrationDate || c.created_date);
      return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
    
    // Calculate average deal size
    const avgDealSize = loanFiles.length > 0 
      ? loanFiles.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0) / loanFiles.length 
      : 0;
    
    // Calculate pending files
    const pendingFiles = loanFiles.filter(f => 
      (f.status || f.fileStatus) === "Pending" || 
      (f.status || f.fileStatus) === "Query"
    ).length;
    
    setStats({
      totalLeads,
      convertedLeads,
      activeFiles,
      totalCommission,
      monthlyLeads,
      conversionRate,
      avgDealSize,
      pendingFiles,
    });
    
    // Get recent leads (last 10 customers)
    const recent = customers
      .sort((a, b) => {
        const dateA = new Date(a.date_of_registration || a.registrationDate || a.created_date);
        const dateB = new Date(b.date_of_registration || b.registrationDate || b.created_date);
        return dateB - dateA;
      })
      .slice(0, 10)
      .map(c => ({
        ...c,
        hasFile: loanFiles.some(f => 
          String(f.customerId || f.customer_id) === String(c.id)
        ),
      }));
    
    setRecentLeads(recent);
    
    // Calculate top performers (users with most files)
    const userPerformance = {};
    loanFiles.forEach(file => {
      const userId = file.user_id || file.createdBy || "Unknown";
      if (!userPerformance[userId]) {
        userPerformance[userId] = {
          userId,
          fileCount: 0,
          totalAmount: 0,
          commission: 0,
        };
      }
      userPerformance[userId].fileCount++;
      userPerformance[userId].totalAmount += parseFloat(file.amount || 0);
      if ((file.status || file.fileStatus) === "Completed") {
        userPerformance[userId].commission += parseFloat(file.amount || 0) * 0.01;
      }
    });
    
    const performers = Object.values(userPerformance)
      .sort((a, b) => b.fileCount - a.fileCount)
      .slice(0, 5)
      .map(p => {
        const user = users.find(u => String(u.id) === String(p.userId));
        return {
          ...p,
          userName: user ? user.name : "Unknown User",
        };
      });
    
    setTopPerformers(performers);
    
    // Calculate monthly data for last 6 months
    const monthData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthCustomers = customers.filter(c => {
        const regDate = new Date(c.date_of_registration || c.registrationDate || c.created_date);
        return regDate.getMonth() === month && regDate.getFullYear() === year;
      }).length;
      
      const monthFiles = loanFiles.filter(f => {
        const fileDate = new Date(f.createdDate || f.date_of_registration || f.createdAt);
        return fileDate.getMonth() === month && fileDate.getFullYear() === year;
      }).length;
      
      monthData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        leads: monthCustomers,
        files: monthFiles,
      });
    }
    
    setMonthlyData(monthData);
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

        .marketing-dashboard {
          font-family: 'Inter', sans-serif;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
          min-height: 100vh;
        }

        /* Header */
        .dashboard-header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 2rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
          color: white;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left h1 {
          font-size: 2rem;
          font-weight: 900;
          margin: 0 0 0.5rem 0;
        }

        .header-left p {
          font-size: 1rem;
          margin: 0;
          opacity: 0.9;
        }

        .header-right {
          text-align: right;
        }

        .current-date {
          font-size: 0.875rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }

        .refresh-btn {
          padding: 0.625rem 1.25rem;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: var(--stat-bg);
          margin-bottom: 1rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
          font-family: monospace;
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
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          display: inline-block;
        }

        .stat-change.positive {
          background: #d1fae5;
          color: #065f46;
        }

        .stat-change.negative {
          background: #fee2e2;
          color: #991b1b;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 2px solid #e2e8f0;
        }

        .card-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Recent Leads Table */
        .leads-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leads-table thead th {
          text-align: left;
          padding: 0.75rem;
          border-bottom: 2px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .leads-table tbody td {
          padding: 0.875rem 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.875rem;
          color: #475569;
        }

        .leads-table tbody tr:hover {
          background: #f8fafc;
        }

        .lead-name {
          font-weight: 600;
          color: #0f172a;
        }

        .lead-badge {
          padding: 0.25rem 0.625rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-converted {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-pending {
          background: #fef3c7;
          color: #92400e;
        }

        /* Top Performers */
        .performer-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .performer-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          transition: all 0.2s;
        }

        .performer-item:hover {
          background: #f1f5f9;
          border-color: #10b981;
        }

        .performer-rank {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.125rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .performer-info {
          flex: 1;
        }

        .performer-name {
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.25rem 0;
        }

        .performer-stats {
          font-size: 0.8125rem;
          color: #64748b;
        }

        .performer-value {
          text-align: right;
        }

        .performer-files {
          font-weight: 700;
          color: #10b981;
          font-size: 1.125rem;
        }

        .performer-commission {
          font-size: 0.75rem;
          color: #64748b;
        }

        /* Monthly Trend */
        .monthly-chart {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 200px;
          gap: 1rem;
          padding: 1rem 0;
        }

        .chart-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .bar-container {
          width: 100%;
          height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .bar {
          width: 100%;
          background: linear-gradient(180deg, #10b981, #059669);
          border-radius: 6px 6px 0 0;
          transition: all 0.3s;
          position: relative;
        }

        .bar:hover {
          background: linear-gradient(180deg, #059669, #047857);
        }

        .bar-value {
          position: absolute;
          top: -1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          font-weight: 700;
          color: #0f172a;
        }

        .bar-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.4;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .marketing-dashboard {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .monthly-chart {
            height: 150px;
          }

          .bar-container {
            height: 100px;
          }
        }
      `}</style>

      <div className="marketing-dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>📊 Marketing Dashboard</h1>
              <p>Track your marketing performance and lead generation</p>
            </div>
            <div className="header-right">
              <div className="current-date">
                📅 {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <button className="refresh-btn" onClick={loadDashboardData}>
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card" style={{ '--stat-color': '#10b981', '--stat-bg': '#d1fae5' }}>
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.totalLeads}</div>
            <div className="stat-label">Total Leads</div>
            <span className="stat-change positive">↑ {stats.monthlyLeads} this month</span>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#3b82f6', '--stat-bg': '#dbeafe' }}>
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.convertedLeads}</div>
            <div className="stat-label">Converted Leads</div>
            <span className="stat-change positive">{stats.conversionRate}% conversion</span>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#8b5cf6', '--stat-bg': '#ede9fe' }}>
            <div className="stat-icon">📋</div>
            <div className="stat-value">{stats.activeFiles}</div>
            <div className="stat-label">Active Files</div>
            <span className="stat-change positive">{stats.pendingFiles} pending</span>
          </div>

          <div className="stat-card" style={{ '--stat-color': '#f59e0b', '--stat-bg': '#fef3c7' }}>
            <div className="stat-icon">💰</div>
            <div className="stat-value">{formatCurrency(stats.totalCommission).split('.')[0]}</div>
            <div className="stat-label">Total Commission</div>
            <span className="stat-change positive">Avg: {formatCurrency(stats.avgDealSize).split('.')[0]}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
          {/* Recent Leads */}
          <div className="card">
            <h2 className="card-title">
              <span>🎯</span>
              <span>Recent Leads</span>
            </h2>
            {recentLeads.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No leads yet</h3>
                <p>Start adding customers to see them here</p>
              </div>
            ) : (
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="lead-name">{lead.name}</td>
                      <td>{lead.contact || lead.phone}</td>
                      <td>{lead.date_of_registration || lead.registrationDate || lead.created_date}</td>
                      <td>
                        <span className={`lead-badge ${lead.hasFile ? 'badge-converted' : 'badge-pending'}`}>
                          {lead.hasFile ? '✓ Converted' : '⏳ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Top Performers */}
          <div className="card">
            <h2 className="card-title">
              <span>🏆</span>
              <span>Top Performers</span>
            </h2>
            {topPerformers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <p>No data available</p>
              </div>
            ) : (
              <div className="performer-list">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="performer-item">
                    <div className="performer-rank">#{index + 1}</div>
                    <div className="performer-info">
                      <h4 className="performer-name">{performer.userName}</h4>
                      <p className="performer-stats">
                        {formatCurrency(performer.totalAmount)} • {performer.fileCount} files
                      </p>
                    </div>
                    <div className="performer-value">
                      <div className="performer-files">{performer.fileCount}</div>
                      <div className="performer-commission">{formatCurrency(performer.commission)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="card">
          <h2 className="card-title">
            <span>📈</span>
            <span>6-Month Trend</span>
          </h2>
          <div className="monthly-chart">
            {monthlyData.map((month, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ height: `${Math.max(month.leads * 10, 10)}%` }}
                  >
                    <span className="bar-value">{month.leads}</span>
                  </div>
                </div>
                <div className="bar-label">{month.month.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketingDashboard;