# AgentricAI University - Operational Core Agents

This directory contains the operational core agents that power the AgentricAI University platform. These agents work in the background to provide specialized functionality for neurodiverse learning environments.

## Directory Structure

```
src/agents/
├── README.md                    # This file
├── base/                        # Base agent classes and interfaces
│   ├── BaseAgent.ts            # Core agent functionality
│   ├── AgentInterface.ts       # Agent communication interfaces
│   └── AgentTypes.ts           # Type definitions
├── learning/                    # Learning coordination agents
│   ├── LearningCoordinator.ts  # Main learning coordination logic
│   ├── ProgressTracker.ts      # Student progress tracking
│   └── ContentAdapter.ts       # Adaptive content delivery
├── behavior/                    # Behavior analysis agents
│   ├── BehaviorAnalyst.ts      # Pattern recognition and analysis
│   ├── SensoryProcessor.ts     # Sensory preference handling
│   └── InteractionMonitor.ts   # User interaction monitoring
├── content/                     # Content generation agents
│   ├── ContentGenerator.ts     # Dynamic content creation
│   ├── DifficultyAdapter.ts    # Difficulty level adjustment
│   └── SensoryOptimizer.ts     # Sensory-friendly content optimization
├── error/                       # Error handling agents
│   ├── ErrorHandler.ts         # Child-friendly error resolution
│   ├── SafetyGuard.ts          # Safety and security monitoring
│   └── RecoveryAgent.ts        # System recovery and healing
├── knowledge/                   # Knowledge management agents
│   ├── KnowledgeManager.ts     # Knowledge base operations
│   ├── MemoryOptimizer.ts      # Memory and storage optimization
│   └── DataAnalyst.ts          # Data analysis and insights
└── communication/               # Agent communication system
    ├── MessageRouter.ts         # Inter-agent message routing
    ├── WorkflowOrchestrator.ts  # Workflow coordination
    └── EventBus.ts              # Event-driven communication

## Agent Development Guidelines

### 1. Agent Architecture
- All agents extend the `BaseAgent` class
- Implement the `AgentInterface` for standardized communication
- Use TypeScript for type safety and better development experience

### 2. Neurodiverse Optimization
- Always consider sensory sensitivities in agent behavior
- Provide clear, predictable responses
- Maintain consistent interaction patterns
- Support visual, auditory, and kinesthetic learning styles

### 3. Communication Protocols
- Use the `MessageRouter` for inter-agent communication
- Implement event-driven architecture with `EventBus`
- Follow priority-based message handling
- Ensure graceful degradation when agents are unavailable

### 4. Error Handling
- All agents must implement safe error handling
- Provide child-friendly error messages when appropriate
- Log errors for system monitoring and improvement
- Implement automatic recovery mechanisms where possible

### 5. Performance Considerations
- Agents should be lightweight and efficient
- Implement proper memory management
- Use caching for frequently accessed data
- Monitor and optimize agent performance metrics

## Hot-Swappable Agent System

This directory supports hot-swapping of agents without disrupting the application:

- **Live Updates**: Agents can be updated while the system is running
- **Graceful Transitions**: Old agent instances are safely retired
- **State Preservation**: Agent memory and state are preserved during updates
- **Rollback Capability**: Previous agent versions can be restored if needed

## Getting Started

1. **Create a New Agent**: Copy an existing agent template and modify for your needs
2. **Register the Agent**: Add your agent to the ecosystem in `agentEcosystem.ts`
3. **Test Integration**: Use the admin panel to monitor agent behavior
4. **Deploy**: Hot-swap the agent into the running system

## Agent Communication Example

```typescript
// Example of agent-to-agent communication
const message = {
  type: 'learning_assessment_request',
  data: { userId: 'user-123', activityId: 'colors-1' },
  priority: 'high'
};

await this.sendMessage('behavior-analyst', message);
```

## Monitoring and Debugging

- Use the Admin Panel's Agent Monitor to view real-time agent status
- Check the Knowledge Database for agent memory and learning patterns
- Monitor system logs for agent communication and error patterns
- Use the workflow orchestrator to trace agent interactions