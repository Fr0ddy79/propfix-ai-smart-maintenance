import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { SocialProof } from "@/components/landing/SocialProof";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { ROI } from "@/components/landing/ROI";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <SocialProof />
      <ProblemSolution />
      <HowItWorks />
      <Features />
      <ROI />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
