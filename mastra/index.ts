import { Mastra } from "@mastra/core";
import { surisuriAgent } from "./agents/surisuri";

export const mastra = new Mastra({
  agents: {
    surisuri: surisuriAgent,
  },
});
