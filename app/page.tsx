import { DictionaryApp } from "@/components/DictionaryApp";
import { loadSiteData } from "@/lib/siteData";

export default function HomePage() {
  const { terms, graph } = loadSiteData();
  return <DictionaryApp terms={terms} graph={graph} />;
}
