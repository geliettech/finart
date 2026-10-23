import Header from "../../components/header"
import Hero from "../../components/hero"
import Features from "../../components/Features";
import Pricing from "../../components/Pricing";
import Faq from "../../components/Faq";
import Footer from "../../components/Footer";

const LandingPage = () => {
    return (
        <main className="overflow-hidden">
            <Header />
            <Hero />
            <Features />
            <Pricing />
            <Faq />
            <Footer />
            <div className="">CTA</div>
        </main>
    );
};

export default LandingPage;
