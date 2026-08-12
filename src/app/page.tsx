import HomepageClient from "@/components/home/HomepageClient";
import { getTokscaleUsageData } from "@/lib/tokscale/data";

export default async function Home() {
  const tokscaleSummary = await getTokscaleUsageData();

  return <HomepageClient tokscaleSummary={tokscaleSummary} />;
}
