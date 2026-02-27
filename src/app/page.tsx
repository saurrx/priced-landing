import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Steps from "@/components/Steps";
import TweetDemo from "@/components/TweetDemo";
import Stats from "@/components/Stats";
import TrustBar from "@/components/TrustBar";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[20%] -left-[200px] h-[600px] w-[600px] rounded-full bg-trading-green/[0.04] blur-[120px]" />
        <div className="absolute top-[60%] -right-[200px] h-[500px] w-[500px] rounded-full bg-accent-amber/[0.03] blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Nav />
        <Hero />
        <Steps />
        <TweetDemo />
        <Stats />
        <TrustBar />
        <FinalCTA />
      </div>
    </div>
  );
}
