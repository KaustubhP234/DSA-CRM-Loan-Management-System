import "../Styles/HowWeWork.css";
import processImg from "../assets/processimg.jpg";
import { Link } from "react-router-dom";

const HowWeWork = () => {
  return (
    <section className="process-section">
      <div className="process-header">
        <span className="process-subtitle">How We Work</span>
        <h2>Our Process</h2>
        <p>
          Are you worried about your financial issues? We help you meet your
          financial needs with fast money loans and easy processes.
        </p>
      </div>

      <div className="process-content">

        {/* LEFT IMAGE */}
        <div className="process-image">
          <img src={processImg} alt="Loan Process" />
        </div>

        {/* RIGHT STEPS */}
        <div className="process-steps">

          <div className="step">
            <div className="step-number">01</div>
            <div className="step-box">
              <h4>Fill The Application Form</h4>
              <p>
                Check your eligibility and submit a filled loan application
                form along with all required documents.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <div className="step-box">
              <h4>Compare Your Options</h4>
              <p>
                We provide quotes from multiple financiers so you can compare
                and choose the most suitable option.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <div className="step-box">
              <h4>Get Your Funds</h4>
              <p>
                Once selected, we process your loan quickly and ensure funds
                are credited to your bank account.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
