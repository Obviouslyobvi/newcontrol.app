import Nav from "./components/Nav";
import Hero from "./components/Hero";
import AgencyMath from "./components/AgencyMath";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import WithoutWith from "./components/WithoutWith";
import SocialProof from "./components/SocialProof";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <AgencyMath />
      <Features />
      <HowItWorks />
      <WithoutWith />
      <SocialProof />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
