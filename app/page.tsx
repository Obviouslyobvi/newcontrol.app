import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import WithoutWith from "./components/WithoutWith";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <WithoutWith />
      <FinalCTA />
      <Footer />
    </main>
  );
}
