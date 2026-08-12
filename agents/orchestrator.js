/**
 * Agent Orchestrator
 * Coordinates multiple AI agents to process educational content
 */

const { ContentResearchAgent } = require('./content-research-agent');
const { ContentStructuringAgent } = require('./content-structuring-agent');
const { VisualizationAgent } = require('./visualization-agent');

class AgentOrchestrator {
  constructor() {
    this.researchAgent = new ContentResearchAgent();
    this.structuringAgent = new ContentStructuringAgent();
    this.visualizationAgent = new VisualizationAgent();
    
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      averageProcessingTime: 0,
      agentMetrics: {
        research: { calls: 0, success: 0, avgTime: 0 },
        structuring: { calls: 0, success: 0, avgTime: 0 },
        visualization: { calls: 0, success: 0, avgTime: 0 }
      }
    };
  }

  /**
   * Main orchestration method - coordinates all agents
   */
  async processTopic(topic, options = {}) {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    console.log(`\n🎯 Agent Orchestrator: Processing "${topic}"...`);
    console.log(`📊 Options: ${JSON.stringify(options)}`);

    try {
      // Phase 1: Research
      const researchResult = await this.executeWithMetrics(
        'research',
        () => this.researchAgent.research(topic)
      );

      if (!researchResult.success) {
        throw new Error('Research phase failed');
      }

      // Phase 2: Structuring
      const structuringResult = await this.executeWithMetrics(
        'structuring',
        () => this.structuringAgent.structure(topic, researchResult.content)
      );

      if (!structuringResult.success) {
        throw new Error('Structuring phase failed');
      }

      // Phase 3: Visualization
      const visualizationResult = await this.executeWithMetrics(
        'visualization',
        () => this.visualizationAgent.generateVisualizations(structuringResult.structuredContent)
      );

      // Combine all results
      const finalResult = {
        success: true,
        topic,
        metadata: {
          processingTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          version: '2.0-agents'
        },
        research: {
          content: researchResult.content,
          sourceCount: researchResult.sourceCount,
          sources: researchResult.sources || []
        },
        structuredContent: structuringResult.structuredContent,
        visualizations: visualizationResult,
        quality: this.calculateQualityScore(researchResult, structuringResult, visualizationResult)
      };

      this.metrics.successfulRequests++;
      this.updateAverageTime(Date.now() - startTime);

      console.log(`✅ Agent Orchestrator: Completed in ${finalResult.metadata.processingTime}ms`);
      
      return finalResult;

    } catch (error) {
      console.error('❌ Agent Orchestrator: Error:', error.message);
      this.metrics.successfulRequests--;
      
      return {
        success: false,
        error: error.message,
        topic,
        fallback: await this.generateFallbackContent(topic),
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Execute agent with metrics tracking
   */
  async executeWithMetrics(agentName, task) {
    const startTime = Date.now();
    this.metrics.agentMetrics[agentName].calls++;
    
    try {
      const result = await task();
      const duration = Date.now() - startTime;
      
      this.metrics.agentMetrics[agentName].success++;
      this.updateAgentAverageTime(agentName, duration);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.updateAgentAverageTime(agentName, duration);
      throw error;
    }
  }

  /**
   * Calculate overall quality score
   */
  calculateQualityScore(research, structuring, visualization) {
    const scores = {
      researchQuality: research.sourceCount > 0 ? Math.min(100, research.sourceCount * 30) : 0,
      contentDepth: research.content.length > 500 ? 80 : research.content.length / 10,
      structureCompleteness: structuring.structuredContent ? 90 : 50,
      visualizationRichness: visualization.charts && visualization.diagrams ? 85 : 60
    };

    const overall = Object.values(scores).reduce((a, b) => a + b, 0) / 4;

    return {
      scores,
      overall: Math.round(overall),
      grade: overall >= 80 ? 'A' : overall >= 70 ? 'B' : overall >= 60 ? 'C' : 'D'
    };
  }

  /**
   * Generate fallback content when agents fail
   */
  async generateFallbackContent(topic) {
    console.log(`⚠️ Generating fallback content for "${topic}"...`);
    
    return {
      title: topic,
      what: `${topic} is an important concept worth exploring.`,
      why: `Understanding ${topic} helps build foundational knowledge.`,
      how: `${topic} operates through established principles and methodologies.`,
      who: `Students, professionals, and researchers use ${topic}.`,
      where: `${topic} is applied in various industries and contexts.`,
      when: `${topic} has evolved over time with modern advancements.`,
      ipo: {
        input: 'Data and queries',
        process: 'Analysis and computation',
        output: 'Results and insights'
      },
      types: [
        { name: 'Basic Type', description: 'Fundamental concepts' },
        { name: 'Advanced Type', description: 'Complex applications' }
      ],
      examples: [
        { title: 'Example 1', description: 'Common use case' },
        { title: 'Example 2', description: 'Advanced application' }
      ],
      architecture: [
        { layer: 'Interface', description: 'User interaction' },
        { layer: 'Logic', description: 'Processing' },
        { layer: 'Data', description: 'Storage' }
      ],
      takeaways: [
        `✅ ${topic} is valuable to learn`,
        `✅ Practice improves understanding`
      ]
    };
  }

  /**
   * Update overall average processing time
   */
  updateAverageTime(newTime) {
    const total = this.metrics.averageProcessingTime * (this.metrics.successfulRequests - 1) + newTime;
    this.metrics.averageProcessingTime = total / this.metrics.successfulRequests;
  }

  /**
   * Update agent-specific average time
   */
  updateAgentAverageTime(agentName, duration) {
    const metric = this.metrics.agentMetrics[agentName];
    const successCount = metric.success || 1;
    metric.avgTime = ((metric.avgTime * (successCount - 1)) + duration) / successCount;
  }

  /**
   * Get orchestrator metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalRequests > 0 
        ? ((this.metrics.successfulRequests / this.metrics.totalRequests) * 100).toFixed(2) 
        : 0
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      averageProcessingTime: 0,
      agentMetrics: {
        research: { calls: 0, success: 0, avgTime: 0 },
        structuring: { calls: 0, success: 0, avgTime: 0 },
        visualization: { calls: 0, success: 0, avgTime: 0 }
      }
    };
  }
}

module.exports = { AgentOrchestrator };
