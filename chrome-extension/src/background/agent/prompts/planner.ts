/* eslint-disable @typescript-eslint/no-unused-vars */
import { BasePrompt } from './base';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { AgentContext } from '@src/background/agent/types';
import { plannerSystemPromptTemplate } from './templates/planner';
import { launchpadDomainKnowledge } from './launchpad/domain';
import { launchpadOverview } from './launchpad/overview';

export class PlannerPrompt extends BasePrompt {
  async getSystemMessage(context: AgentContext): Promise<SystemMessage> {
    const state = await context.browserContext.getState();
    const isLaunchpad = state.url.includes('https://adoption-frontend-us-east-1.cluster.staging.pegaservice.net');

    let prompt = plannerSystemPromptTemplate;

    if (isLaunchpad) {
      const appSpecificKnowledge = `
# Application Specific Knowledge

The current site has been identified as the "Launchpad" application. Use the following context to plan appropriate actions.

## Application Overview
${launchpadOverview}

## Domain Knowledge: Launchpad
${launchpadDomainKnowledge}
`;
      prompt += appSpecificKnowledge;
    }

    return new SystemMessage(prompt);
  }

  async getUserMessage(context: AgentContext): Promise<HumanMessage> {
    return new HumanMessage('');
  }
}
