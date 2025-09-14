import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LiveMarketData from "@/components/LiveMarketData";
import FinancialInputForm from "@/components/FinancialInputForm";
import RealityCheckDashboard from "@/components/RealityCheckDashboard";
import AIAdvisorPanel from "@/components/AIAdvisorPanel";
import EducationModule from "@/components/EducationModule";
import MoneyGame from "@/components/MoneyGame";
import GoalCalculator from "@/components/GoalCalculator";
import ComparisonCharts from "@/components/ComparisonCharts";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Home() {
  const [realityCheckData, setRealityCheckData] = useState(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <LiveMarketData />
      <FinancialInputForm 
        onRealityCheckComplete={setRealityCheckData}
        onProfileCreated={setProfileId}
      />
      {realityCheckData && (
        <>
          <RealityCheckDashboard data={realityCheckData} />
          <AIAdvisorPanel data={realityCheckData} />
        </>
      )}
      <EducationModule />
      <MoneyGame />
      <GoalCalculator profileId={profileId} />
      <ComparisonCharts />
      <Footer />
    </div>
  );
}
