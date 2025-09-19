/* eslint-disable @typescript-eslint/no-unused-vars */
import { BasePrompt } from './base';
import { type HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { AgentContext } from '@src/background/agent/types';
import { Actors, ExecutionState } from '../event/types';
import { createLogger } from '@src/background/log';
import { navigatorSystemPromptTemplate } from './templates/navigator';
import { launchpadUiKnowledge } from './launchpad/ui';
import { launchpadOverview } from './launchpad/overview';

const logger = createLogger('agent/prompts/navigator');

export class NavigatorPrompt extends BasePrompt {
  constructor(private readonly maxActionsPerStep = 10) {
    super();
  }

  async getSystemMessage(context: AgentContext): Promise<SystemMessage> {
    const currentPage = await context.browserContext.getCurrentPage();
    const isLaunchpad = await currentPage.evaluate(() => {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        return (meta as HTMLMetaElement).content.includes('Pega launchpad');
      }
      return false;
    });

    let prompt = navigatorSystemPromptTemplate;

    if (isLaunchpad) {
      if (!context.launchpadKnowledgeActivated) {
        void context.emitEvent(
          Actors.SYSTEM,
          ExecutionState.INFO,
          'Launchpad application detected. Activating UI-specific knowledge for navigator.',
        );
        context.launchpadKnowledgeActivated = true;
      }
      const appSpecificKnowledge = `
# Application Specific UI Knowledge

The current application or website that we are working on has been identified as the "Launchpad" application. Use the UI knowledge to better understand the interface and available actions.

## Application Overview
${launchpadOverview}

## UI Knowledge: Launchpad
${launchpadUiKnowledge}
`;
      prompt += appSpecificKnowledge;
    }

    const formattedPrompt = prompt.replace('{{max_actions}}', this.maxActionsPerStep.toString()).trim();
    return new SystemMessage(formattedPrompt);
  }

  async getUserMessage(context: AgentContext): Promise<HumanMessage> {
    return await this.buildBrowserStateUserMessage(context);
  }
}
