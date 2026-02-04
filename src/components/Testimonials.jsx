import "../Styles/Testimonials.css";
import user1 from "../assets/avtar1.webp";
import user2 from "../assets/avtar2.webp";
import user3 from "../assets/avtar3.webp";

const testimonials = [
  {
    text:
      "In the past few months, we were going through financial issues and got to know about Finfree Enterprises. The complete process of getting a personal loan was smooth and uncomplicated.",
    name: "Vipin Raj",
    company: "Reliance Commodity",
    img: user1,
  },
  {
    text:
      "Excellent service and very professional team. The loan approval process was fast and transparent. Highly recommended!",
    name: "Ankit Sharma",
    company: "Self Employed",
    img: user2,
  },
  {
    text:
      "I received my business loan on time with minimal documentation. Very supportive staff and easy process.",
    name: "Rohit Verma",
    company: "Small Business Owner",
    img: user3,
  },
];

const Testimonials = () => {
  return (
    <section className="testimonial-section">
      <span className="section-tag">What Clients Say?</span>
      <h2>See Clients Reviews</h2>

      {/* BOOTSTRAP CAROUSEL */}
      <div
        id="testimonialCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >
        <div className="carousel-inner">

          {testimonials.map((item, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={index}
            >
              <div className="d-flex justify-content-center">
                <div className="testimonial-card">
                  <span className="loan-badge">Personal Loan</span>

                  <div className="quote">“</div>

                  <p>{item.text}</p>

                  <hr />

                  <div className="testimonial-user">
                    <img src={item.img} alt="Client" />
                    <div>
                      <h4>{item.name}</h4>
                      <span>{item.company}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* PREV */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#testimonialCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        {/* NEXT */}
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#testimonialCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </section>
  );
};

export default Testimonials;
