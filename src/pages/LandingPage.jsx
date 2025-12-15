import ProductsList from "../components/ProductsList";
import Hero from "../components/Hero";
import landingpageimage from "../assets/landingpageimage.webp";
import "../styling/LandingPageStyling.css";

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <section className="landingpage-section">
      <img className="landingpage-image" src={landingpageimage} alt="Shopfront" />
      </section>
      <ProductsList />
    </div>
  );
};

export default LandingPage;
