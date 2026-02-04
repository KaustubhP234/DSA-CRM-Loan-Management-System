import "../Styles/Partners.css";
import icici from "../assets/icicibank.png";
import axis from "../assets/axisbank.jpg";
import sbi from "../assets/sbi.png";
import hsbc from "../assets/hsbc.png";
import union from "../assets/unionbank.png";
import yes from "../assets/yesbank.png";
import canara from "../assets/canarabank.jpg";
import Central from "../assets/Centralbank.png";

const Partners = () => {
  return (
    <section className="partners-section">
      <span className="section-tag">To Whom We Work With</span>
      <h2>Our Financial Partners</h2>

      <div className="partners-slider">
        <div className="partners-track">
          {/* LOGOS (duplicated for infinite scroll) */}
          {[icici, axis, sbi, hsbc, union, yes, canara, Central,
            icici, axis, sbi, hsbc, union, yes, canara, Central
          ].map((logo, index) => (
            <img key={index} src={logo} alt="Bank Logo" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
