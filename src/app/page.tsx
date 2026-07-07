import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import GrainOverlay from "@/components/GrainOverlay";
import CursorTrail from "@/components/CursorTrail";
import CornerHUD from "@/components/CornerHUD";
import CosmicSurfer from "@/components/three/CosmicSurfer";
import Hero from "@/components/hero/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import QuoteMoment from "@/components/QuoteMoment";
import Projects from "@/components/Projects";
import Leadership from "@/components/Leadership";
import Marquee from "@/components/Marquee";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <GrainOverlay />
      <CursorTrail />
      <CornerHUD />
      <CosmicSurfer />
      <main>
        <Hero />
        <About />
        <Experience />
        <QuoteMoment />
        <Projects />
        <Leadership />
        <Marquee />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
