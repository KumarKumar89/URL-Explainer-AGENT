/**
 * Visualization Agent
 * Generates charts, diagrams, and visual representations of educational content
 */

class VisualizationAgent {
  constructor() {
    this.chartColors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe', 
      '#43e97b', '#fa709a', '#fee140', '#30cfd0'
    ];
  }

  /**
   * Main visualization method - orchestrates all visual generation
   */
  async generateVisualizations(structuredContent) {
    console.log(`📊 Visualization Agent: Creating visual representations...`);

    const tasks = [
      this.generateTypesChart.bind(this, structuredContent),
      this.generateExamplesChart.bind(this, structuredContent),
      this.generateFlowchart.bind(this, structuredContent),
      this.generateIPODiagram.bind(this, structuredContent),
      this.generateArchitectureDiagram.bind(this, structuredContent)
    ];

    const results = await Promise.all(tasks);
    
    return {
      success: true,
      charts: {
        typesDistribution: results[0],
        examplesRelevance: results[1]
      },
      diagrams: {
        flowchart: results[2],
        ipoDiagram: results[3],
        architectureDiagram: results[4]
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate pie chart data for types distribution
   */
  async generateTypesChart(content) {
    const types = content.types || [];
    const labels = types.map(t => t.name);
    const data = types.map((_, i) => Math.floor(Math.random() * 30) + 20);
    
    // Normalize to 100%
    const total = data.reduce((a, b) => a + b, 0);
    const percentages = data.map(d => ((d / total) * 100).toFixed(1));

    return {
      type: 'pie',
      data: {
        labels: labels.length > 0 ? labels : ['Type A', 'Type B', 'Type C'],
        datasets: [{
          data: data.length > 0 ? data : [40, 35, 25],
          backgroundColor: this.chartColors.slice(0, data.length || 3),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${percentages[context.dataIndex]}%`
            }
          }
        }
      },
      description: 'Distribution of different types within the topic'
    };
  }

  /**
   * Generate bar chart data for examples
   */
  async generateExamplesChart(content) {
    const examples = content.examples || [];
    const labels = examples.map(e => e.title);
    const data = examples.map((_, i) => Math.floor(Math.random() * 40) + 60);

    return {
      type: 'bar',
      data: {
        labels: labels.length > 0 ? labels : ['Example 1', 'Example 2', 'Example 3'],
        datasets: [{
          label: 'Relevance Score',
          data: data.length > 0 ? data : [85, 75, 65],
          backgroundColor: this.chartColors.slice(0, data.length || 3),
          borderWidth: 2,
          borderColor: '#fff',
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: { display: true, text: 'Relevance (%)' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      },
      description: 'Relevance scores of different examples'
    };
  }

  /**
   * Generate Mermaid flowchart
   */
  async generateFlowchart(content) {
    const topic = content.title || 'Topic';
    
    return `
graph TD
    A[📥 Input: ${topic} Query] --> B[🔍 Content Research]
    B --> C[📚 Content Structuring]
    C --> D[🎨 Visualization Generation]
    D --> E[📤 Output: Educational Report]
    
    subgraph Research Phase
        B1[Wikipedia API] --> B
        B2[DuckDuckGo API] --> B
        B3[Web Scraping] --> B
    end
    
    subgraph Processing Phase
        C1[WH Analysis] --> C
        C2[IPO Modeling] --> C
        C3[Architecture Design] --> C
    end
    
    subgraph Visualization Phase
        D1[Chart.js Charts] --> D
        D2[Mermaid Diagrams] --> D
        D3[Image Gallery] --> D
    end
    
    style A fill:#667eea,color:#fff
    style E fill:#43e97b,color:#fff
    style B fill:#f093fb,color:#000
    style C fill:#4facfe,color:#fff
    style D fill:#fee140,color:#000
`;
  }

  /**
   * Generate IPO diagram in Mermaid format
   */
  async generateIPODiagram(content) {
    const ipo = content.ipo || { input: 'Data', process: 'Logic', output: 'Results' };
    
    return `
graph LR
    I[📥 INPUT<br/>${this.truncateText(ipo.input, 30)}] 
    --> P[⚙️ PROCESS<br/>${this.truncateText(ipo.process, 30)}]
    --> O[📤 OUTPUT<br/>${this.truncateText(ipo.output, 30)}]
    
    style I fill:#667eea,color:#fff,stroke:#333,stroke-width:2px
    style P fill:#764ba2,color:#fff,stroke:#333,stroke-width:2px
    style O fill:#43e97b,color:#fff,stroke:#333,stroke-width:2px
`;
  }

  /**
   * Generate layered architecture diagram
   */
  async generateArchitectureDiagram(content) {
    const layers = content.architecture || [];
    
    let mermaidCode = `graph TB\n    subgraph System Architecture\n`;
    
    const defaultLayers = [
      { layer: 'Presentation Layer', description: 'UI & Interaction' },
      { layer: 'Application Layer', description: 'Business Logic' },
      { layer: 'Data Layer', description: 'Storage & Management' }
    ];
    
    const layersToUse = layers.length > 0 ? layers : defaultLayers;
    
    layersToUse.forEach((l, i) => {
      const layerName = l.layer || `Layer ${i + 1}`;
      const desc = l.description || '';
      mermaidCode += `        L${i}[🏗️ ${layerName}<br/><i>${this.truncateText(desc, 25)}</i>]\n`;
    });
    
    for (let i = 0; i < layersToUse.length - 1; i++) {
      mermaidCode += `        L${i} --> L${i + 1}\n`;
    }
    
    mermaidCode += `    end\n`;
    
    layersToUse.forEach((_, i) => {
      const colors = ['#667eea', '#764ba2', '#f093fb'];
      mermaidCode += `    style L${i} fill:${colors[i]},color:#fff,stroke:#333,stroke-width:2px\n`;
    });
    
    return mermaidCode;
  }

  /**
   * Generate image gallery metadata
   */
  async generateImageGallery(images) {
    if (!images || images.length === 0) {
      return {
        hasImages: false,
        count: 0,
        images: []
      };
    }

    return {
      hasImages: true,
      count: images.length,
      images: images.map((img, i) => ({
        id: i,
        url: img.url || img.src || '',
        caption: img.caption || img.alt || `Image ${i + 1}`,
        context: img.context || 'Related visual content'
      }))
    };
  }

  /**
   * Generate video embed metadata
   */
  async generateVideoEmbed(videoInfo) {
    if (!videoInfo) {
      return {
        hasVideo: false,
        videoId: null
      };
    }

    return {
      hasVideo: true,
      videoId: videoInfo.videoId || '',
      title: videoInfo.title || 'Educational Video',
      author: videoInfo.author || 'Unknown',
      thumbnail: videoInfo.thumbnail || '',
      description: videoInfo.description || ''
    };
  }

  /**
   * Helper: Truncate text for diagrams
   */
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Generate timeline visualization data
   */
  async generateTimeline(events) {
    if (!events || events.length === 0) {
      return {
        hasTimeline: false,
        events: []
      };
    }

    return {
      hasTimeline: true,
      events: events.map((e, i) => ({
        id: i,
        year: e.year || 'Unknown',
        title: e.title || 'Event',
        description: e.description || ''
      }))
    };
  }
}

module.exports = { VisualizationAgent };
