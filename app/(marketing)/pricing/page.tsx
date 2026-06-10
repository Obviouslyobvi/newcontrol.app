import type { Metadata } from "next";
import Nav from "../components/Nav";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Pricing — NewControl",
  description:
    "Flat-rate plans with unlimited campaigns. 14-day free trial, no credit card required.",
};

export default function PricingPage() {
  return (
    <main className="relative">
      <Nav />
      <div className="pt-12">
        <Pricing />
      </div>
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
