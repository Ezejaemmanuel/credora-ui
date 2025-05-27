# Credora Mastra Agents

This directory contains two implementations of the Credora agent system:

## 1. Specialized Agents Network (Original)

The original implementation uses a network of specialized agents, each focusing on a specific aspect of the lending process:

- **Web Research Agent**: Researches borrowers using web search to gather financial information
- **Risk Assessment Agent**: Evaluates borrower risk and sets appropriate risk profiles
- **Loan Pool Creation Agent**: Creates and configures loan pools for approved borrowers
- **Pool Analytics Agent**: Analyzes loan pools and provides detailed insights
- **User Portfolio Agent**: Manages and reports on user portfolios

These agents are coordinated by the Credora Agent Network, which routes user requests to the appropriate specialized agent.

**Usage**: Import from `index.ts` (default)

```typescript
import { mastra } from './mastra'; // Uses the network of specialized agents
```

## 2. Unified Agent (Alternative)

An alternative implementation that combines all capabilities into a single unified agent that can handle the entire lending process:

- Web research
- Risk assessment
- Loan pool creation
- Pool analytics
- Portfolio management

The unified agent has access to all tools and can switch between different roles as needed, providing a more streamlined experience.

**Usage**: Import from `unified-index.ts`

```typescript
import { mastra } from './mastra/unified-index'; // Uses the unified agent
```

## Comparison

| Feature | Specialized Agents Network | Unified Agent |
|---------|----------------------------|---------------|
| Architecture | Multiple specialized agents with a coordinator | Single agent with all capabilities |
| Memory | Separate memory contexts for each agent | Single shared memory context |
| Context | Might require repeating context when switching between agents | Maintains context across all functionality |
| Complexity | More complex implementation, easier to maintain specialized logic | Simpler implementation, but more complex instructions |
| Scale | Can scale individual agents independently | Single agent handles all load |

Choose the implementation that best suits your needs based on these characteristics. 