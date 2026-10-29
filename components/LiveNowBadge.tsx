import { getLiveStream } from "@/lib/queries";
import LiveNowPill from "./LiveNowPill";
export default async function LiveNowBadge() { const live = await getLiveStream(); return <LiveNowPill initialLive={!!live?.isLive} />; }
