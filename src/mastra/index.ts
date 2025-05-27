import { Mastra } from '@mastra/core/mastra';
// import {
//   credoraNetwork,
//   webResearchAgent,
//   riskAssessmentAgent,
//   loanPoolCreationAgent,
//   poolAnalyticsAgent,
//   userPortfolioAgent
// } from './agents/credoraAgents';
import { unifiedCredoraAgent } from './agents/unifiedCredoraAgent';

export const mastra = new Mastra({
  agents: {
    // webResearchAgent,
    // riskAssessmentAgent,
    // loanPoolCreationAgent,
    // poolAnalyticsAgent,
    // userPortfolioAgent,
    unifiedCredoraAgent
  },

  networks: {
    // credoraNetwork
  },


  // Make all tools available through this central object

});

