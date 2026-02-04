import "../Styles/Eligibility.css";
import eligibilityImg from "../assets/eligibility.jpg";
import { Link } from "react-router-dom";

const Eligibility = () => {
  return (
    <section className="eligibility-section">
      <div className="eligibility-header">
        <span className="eligibility-tag">Essentials</span>
        <h2>Eligibility Criteria</h2>
        <p>
          Prior to applying for a loan, it is important to know whether you meet
          the eligibility criteria. Below are the essential requirements to
          proceed with your loan application.
        </p>
      </div>

      <div className="eligibility-content">

        {/* LEFT */}
        <div className="eligibility-column">
          <div className="eligibility-item">
            <div className="icon pink">📅</div>
            <div>
              <h4>Age</h4>
              <p>Minimum of 23 years to maximum of 65 years</p>
            </div>
          </div>

          <div className="eligibility-item">
            <div className="icon blue">🏠</div>
            <div>
              <h4>Residency</h4>
              <p>Should be a legal Indian resident</p>
            </div>
          </div>

          <div className="eligibility-item">
            <div className="icon yellow">📍</div>
            <div>
              <h4>Address</h4>
              <p>Should have a valid permanent address</p>
            </div>
          </div>
        </div>

        {/* CENTER IMAGE */}
        <div className="eligibility-image">
          <img src={eligibilityImg} alt="Eligibility" />
        </div>

        {/* RIGHT */}
        <div className="eligibility-column">
          <div className="eligibility-item">
            <div className="icon purple">₹</div>
            <div>
              <h4>Income</h4>
              <p>Should have a regular source of income</p>
            </div>
          </div>

          <div className="eligibility-item">
            <div className="icon orange">🏦</div>
            <div>
              <h4>Bank Account</h4>
              <p>Should have an active bank account</p>
            </div>
          </div>

          <div className="eligibility-item">
            <div className="icon green">📊</div>
            <div>
              <h4>Liquidation</h4>
              <p>Should not have been bankrupt in the past 1 year</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Eligibility;
