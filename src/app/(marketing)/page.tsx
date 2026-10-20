import { AgentBlock } from "@/components/home/agent-block";
import { AgentsHub } from "@/components/home/agents-hub";
import { AskChips } from "@/components/home/ask-chips";
import { BottomCta } from "@/components/home/bottom-cta";
import { CustomerStories } from "@/components/home/customer-stories";
import { EcosystemTeasers } from "@/components/home/ecosystem-teasers";
import { HomeHero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { ValueProps } from "@/components/home/value-props";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AskChips />
      <TrustStrip />
      <ValueProps />
      <AgentsHub />
      <AgentBlock />
      <CustomerStories />
      <EcosystemTeasers />
      <BottomCta />
    </>
  );
}
