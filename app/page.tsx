import { DictionaryApp } from "@/components/DictionaryApp";
import { loadSiteData } from "@/lib/siteData";

export default function HomePage() {
  return <DictionaryApp {...loadSiteData()} />;
}
