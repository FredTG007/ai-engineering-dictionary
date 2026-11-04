import { loadCurriculum, loadTerms } from "./content/loadDictionary";
import { publishTerms } from "./content/publishTerms";
import type { PublishedTerm } from "./content/types";
import { buildTermGraph } from "./graph/buildGraph";
import { layoutGraph } from "./graph/forceLayout";
import type { PositionedGraph } from "./graph/types";

export interface SiteData {
  terms: PublishedTerm[];
  graph: PositionedGraph;
}

/** Build-time entry point: everything the client needs, computed once. */
export function loadSiteData(): SiteData {
  const terms = publishTerms(loadTerms(), loadCurriculum());
  return { terms, graph: layoutGraph(buildTermGraph(terms)) };
}
