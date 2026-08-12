/**
 * Content Structuring Agent
 * Transforms raw research content into educational format (WH, IPO, Architecture)
 */

class ContentStructuringAgent {
  constructor() {
    this.patterns = {
      what: [/what is/i, /defined as/i, /refers to/i, /means/i],
      why: [/why/i, /importance/i, /significance/i, /benefit/i, /advantage/i],
      how: [/how/i, /work/i, /function/i, /operate/i, /mechanism/i],
      who: [/who/i, /users/i, /people/i, /organization/i, /developer/i],
      where: [/where/i, /application/i, /use case/i, /scenario/i],
      when: [/when/i, /history/i, /developed/i, /created/i, /timeline/i]
    };
  }

  /**
   * Main structuring method - orchestrates content transformation
   */
  async structure(topic, rawContent) {
    console.log(`📚 Content Structuring Agent: Organizing content for "${topic}"...`);

    const tasks = [
      this.extractWhat.bind(this, topic, rawContent),
      this.extractWhy.bind(this, topic, rawContent),
      this.extractHow.bind(this, topic, rawContent),
      this.extractWho.bind(this, topic, rawContent),
      this.extractWhere.bind(this, topic, rawContent),
      this.extractWhen.bind(this, topic, rawContent),
      this.generateIPO.bind(this, topic, rawContent),
      this.generateTypes.bind(this, topic, rawContent),
      this.generateExamples.bind(this, topic, rawContent),
      this.generateArchitecture.bind(this, topic, rawContent),
      this.generateTakeaways.bind(this, topic, rawContent)
    ];

    const results = await Promise.all(tasks);
    
    return {
      success: true,
      structuredContent: {
        title: this.formatTitle(topic),
        what: results[0],
        why: results[1],
        how: results[2],
        who: results[3],
        where: results[4],
        when: results[5],
        ipo: results[6],
        types: results[7],
        examples: results[8],
        architecture: results[9],
        takeaways: results[10]
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Extract WHAT information
   */
  async extractWhat(topic, content) {
    const patterns = this.patterns.what;
    const sentences = this.extractSentences(content);
    
    const matches = sentences.filter(s => 
      patterns.some(p => p.test(s)) || s.toLowerCase().includes(topic.toLowerCase())
    );

    if (matches.length > 0) {
      return this.summarize(matches.slice(0, 3).join(' '));
    }

    return `${topic} is a fundamental concept that plays a crucial role in modern technology and education. It encompasses various principles and applications that are essential for understanding the subject matter.`;
  }

  /**
   * Extract WHY information
   */
  async extractWhy(topic, content) {
    const patterns = this.patterns.why;
    const sentences = this.extractSentences(content);
    
    const matches = sentences.filter(s => 
      patterns.some(p => p.test(s))
    );

    if (matches.length > 0) {
      return this.summarize(matches.slice(0, 3).join(' '));
    }

    return `Understanding ${topic} is crucial because it forms the foundation for advanced concepts, enables practical problem-solving skills, and opens up numerous career opportunities in various industries.`;
  }

  /**
   * Extract HOW information
   */
  async extractHow(topic, content) {
    const patterns = this.patterns.how;
    const sentences = this.extractSentences(content);
    
    const matches = sentences.filter(s => 
      patterns.some(p => p.test(s))
    );

    if (matches.length > 0) {
      return this.summarize(matches.slice(0, 3).join(' '));
    }

    return `${topic} works through a systematic process involving input processing, logical operations, and output generation. The mechanism typically follows established principles and methodologies specific to the domain.`;
  }

  /**
   * Extract WHO information
   */
  async extractWho(topic, content) {
    const patterns = this.patterns.who;
    const sentences = this.extractSentences(content);
    
    const matches = sentences.filter(s => 
      patterns.some(p => p.test(s))
    );

    if (matches.length > 0) {
      return this.summarize(matches.slice(0, 2).join(' '));
    }

    return `${topic} is used by students, professionals, researchers, and organizations across various fields including education, technology, business, and science.`;
  }

  /**
   * Extract WHERE information
   */
  async extractWhere(topic, content) {
    const patterns = this.patterns.where;
    const sentences = this.extractSentences(content);
    
    const matches = sentences.filter(s => 
      patterns.some(p => p.test(s))
    );

    if (matches.length > 0) {
      return this.summarize(matches.slice(0, 2).join(' '));
    }

    return `${topic} finds applications in educational institutions, technology companies, research laboratories, healthcare systems, and everyday consumer products.`;
  }

  /**
   * Extract WHEN information
   */
  async extractWhen(topic, content) {
    const patterns = this.patterns.when;
    const sentences = this.extractSentences(content);
    
    const matches = sentences.filter(s => 
      patterns.some(p => p.test(s))
    );

    if (matches.length > 0) {
      return this.summarize(matches.slice(0, 2).join(' '));
    }

    return `The development of ${topic} has evolved over time, with significant milestones achieved in recent decades. Modern implementations continue to advance with ongoing research and innovation.`;
  }

  /**
   * Generate IPO (Input-Process-Output) model
   */
  async generateIPO(topic, content) {
    return {
      input: `Data, queries, user interactions, and external resources related to ${topic}`,
      process: `Analysis, computation, pattern recognition, and application of ${topic} principles`,
      output: `Results, solutions, insights, visualizations, and actionable recommendations`
    };
  }

  /**
   * Generate types/categories
   */
  async generateTypes(topic, content) {
    // Try to extract types from content
    const typePatterns = [/type/i, /kind/i, /category/i, /classification/i];
    const sentences = this.extractSentences(content);
    
    const typeMatches = sentences.filter(s => 
      typePatterns.some(p => p.test(s))
    );

    if (typeMatches.length > 0) {
      return [
        { name: 'Primary Type', description: typeMatches[0].substring(0, 150) },
        { name: 'Secondary Type', description: 'Alternative approaches and variations' },
        { name: 'Advanced Type', description: 'Complex implementations for specialized use cases' }
      ];
    }

    return [
      { name: 'Fundamental Type', description: 'Basic principles and core concepts' },
      { name: 'Applied Type', description: 'Practical implementations in real-world scenarios' },
      { name: 'Advanced Type', description: 'Sophisticated applications and cutting-edge developments' }
    ];
  }

  /**
   * Generate examples
   */
  async generateExamples(topic, content) {
    return [
      { 
        title: 'Everyday Application', 
        description: `Common use of ${topic} in daily life that most people encounter regularly` 
      },
      { 
        title: 'Educational Example', 
        description: `Classroom or academic demonstration of ${topic} principles` 
      },
      { 
        title: 'Industry Case Study', 
        description: `Professional implementation of ${topic} in business or research settings` 
      }
    ];
  }

  /**
   * Generate layered architecture
   */
  async generateArchitecture(topic, content) {
    return [
      { 
        layer: 'Presentation Layer', 
        description: 'User interfaces, visualizations, and interaction mechanisms' 
      },
      { 
        layer: 'Application Logic Layer', 
        description: `Core algorithms, processing engines, and ${topic} methodologies` 
      },
      { 
        layer: 'Data Layer', 
        description: 'Information storage, retrieval systems, and knowledge bases' 
      }
    ];
  }

  /**
   * Generate key takeaways
   */
  async generateTakeaways(topic, content) {
    return [
      `✅ ${topic} is essential for understanding modern technology and its applications`,
      `✅ Multiple approaches exist for implementing ${topic} depending on requirements`,
      `✅ Practical experience with ${topic} enhances problem-solving abilities`,
      `✅ Continuous learning about ${topic} keeps you updated with industry trends`
    ];
  }

  /**
   * Helper: Extract sentences from content
   */
  extractSentences(content) {
    return content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 300);
  }

  /**
   * Helper: Summarize text
   */
  summarize(text) {
    const words = text.split(' ');
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...';
    }
    return text;
  }

  /**
   * Helper: Format title
   */
  formatTitle(topic) {
    return topic
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

module.exports = { ContentStructuringAgent };
