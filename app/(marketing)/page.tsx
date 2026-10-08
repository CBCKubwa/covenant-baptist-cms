import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import SundayInfo from "@/components/SundayInfo";
import TodaysWord from "@/components/TodaysWord";
import FeaturedSermon from "@/components/FeaturedSermon";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SundayInfo />
      <TodaysWord />
      <FeaturedSermon />
    </>
  );
}
