import { useState, useEffect } from "react";
import "../Styles/LoanCalculator.css";

const LoanCalculator = () => {
  const [amount, setAmount] = useState(2850000);
  const [rate, setRate] = useState(29);
  const [years, setYears] = useState(5);

  const [emi, setEmi] = useState(0);
  const [interest, setInterest] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const P = amount;
    const r = rate / 12 / 100;
    const n = years * 12;

    const emiCalc =
      (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const totalPayable = emiCalc * n;
    const interestPayable = totalPayable - P;

    setEmi(Math.round(emiCalc));
    setTotal(Math.round(totalPayable));
    setInterest(Math.round(interestPayable));
  }, [amount, rate, years]);

  return (
    <section className="calculator-section">
      <h2>Personal Loans EMI Calculator</h2>

      <div className="calculator-grid">

        {/* INPUTS */}
        <div className="calculator-inputs">
          <label>Personal Loan Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="range"
            min="50000"
            max="5000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
          <input
            type="range"
            min="5"
            max="36"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />

          <label>Loan Tenure (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
          <input
            type="range"
            min="1"
            max="10"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>

        {/* RESULTS */}
        <div className="calculator-results">
          <div>
            <h4>Principal</h4>
            <p>₹ {amount.toLocaleString()}</p>
          </div>
          <div>
            <h4>Interest</h4>
            <p>₹ {interest.toLocaleString()}</p>
          </div>
          <div>
            <h4>Total Payable</h4>
            <p>₹ {total.toLocaleString()}</p>
          </div>
          <div className="emi-box">
            <h4>Monthly EMI</h4>
            <p>₹ {emi.toLocaleString()}</p>
          </div>
        </div>

        {/* CHART */}
        <div className="calculator-chart">
          <div
            className="donut"
            style={{
              background: `conic-gradient(
                #fbbf24 ${(amount / total) * 360}deg,
                #0f2a44 0deg
              )`,
            }}
          >
            <span>Breakup</span>
          </div>

          <div className="legend">
            <p><span className="principal"></span> Principal</p>
            <p><span className="interest"></span> Interest</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanCalculator;
