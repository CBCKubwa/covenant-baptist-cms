import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import SundayInfo from "@/components/SundayInfo";
import WeeklyWord from "@/components/WeeklyWord";
import FeaturedSermon from "@/components/FeaturedSermon";
import { featuredSermon, weeklyWordSample } from "@/lib/content";
import { getCurrentWeeklyWord, getPublishedSermons } from "@/lib/queries";
import { formatWeekRange } from "@/lib/week";

export const revalidate = 60;

export default async function Home() {
  const [latest, weekly] = await Promise.all([getPublishedSermons(1), getCurrentWeeklyWord()]);

  // Latest published sermon. null = database unreachable -> sample sermon; [] = none yet -> hide the block.
  const sermon =
    latest === null
      ? featuredSermon
      : latest[0] && { title: latest[0].title, scripture: latest[0].scripture, speaker: latest[0].speaker.name, audioUrl: latest[0].audioUrl };

  // Weekly Word. Database unreachable -> sample; nothing scheduled yet -> hide the block.
  const word = !weekly.ok
    ? weeklyWordSample
    : weekly.word && { ...weekly.word, weekLabel: formatWeekRange(weekly.word.date) };

  return (
    <>
      <Hero />
      <Intro />
      <SundayInfo />
      {word && <WeeklyWord word={word} />}
      {sermon && <FeaturedSermon sermon={sermon} />}
    </>
  );
}
