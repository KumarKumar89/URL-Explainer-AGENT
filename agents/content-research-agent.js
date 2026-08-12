/**
 * Content Research Agent
 * Responsible for gathering comprehensive information from multiple sources
 */

const axios = require('axios');
const cheerio = require('cheerio');

class ContentResearchAgent {
  constructor() {
    this.sources = ['Wikipedia', 'DuckDuckGo', 'WebScraper'];
    this.maxRetries = 2;
  }

  /**
   * Main research method - orchestrates multi-source research
   */
  async research(topic) {
    console.log(`🔍 Content Research Agent: Researching "${topic}"...`);
    
    const researchTasks = [
      this.searchWikipedia.bind(this, topic),
      this.searchDuckDuckGo.bind(this, topic),
      this.searchWeb.bind(this, topic)
    ];

    const results = await Promise.allSettled(
      researchTasks.map(task => this.executeWithRetry(task))
    );

    const aggregatedContent = this.aggregateResults(results);
    
    return {
      success: aggregatedContent.length > 0,
      content: aggregatedContent,
      sourceCount: results.filter(r => r.status === 'fulfilled' && r.value).length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Execute a research task with retry logic
   */
  async executeWithRetry(task, retries = this.maxRetries) {
    for (let i = 0; i <= retries; i++) {
      try {
        const result = await task();
        if (result) return result;
      } catch (error) {
        console.warn(`Task failed (attempt ${i + 1}/${retries + 1}):`, error.message);
        if (i === retries) throw error;
        await this.delay(1000 * (i + 1));
      }
    }
    return null;
  }

  /**
   * Search Wikipedia for comprehensive article content
   */
  async searchWikipedia(topic) {
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&srlimit=1`;
      const searchResponse = await axios.get(searchUrl, {
        headers: { 'User-Agent': 'EduExplainer-ResearchAgent/1.0' }
      });

      const pages = searchResponse.data.query.search;
      if (!pages || pages.length === 0) return null;

      const pageId = pages[0].pageid;
      const contentUrl = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${pageId}&format=json&prop=text|categories`;
      const contentResponse = await axios.get(contentUrl, {
        headers: { 'User-Agent': 'EduExplainer-ResearchAgent/1.0' }
      });

      const html = contentResponse.data.parse.text['*'];
      const $ = cheerio.load(html);
      
      // Remove references and other non-content elements
      $('.reference,.noprint').remove();

      let text = '';
      $('p').each((i, elem) => {
        const paragraph = $(elem).text().trim();
        if (paragraph.length > 50 && !paragraph.startsWith('Jump to:')) {
          text += paragraph + '\n\n';
        }
      });

      // Extract categories for better understanding
      const categories = [];
      $('#mw-normal-catlinks ul li a').each((i, elem) => {
        categories.push($(elem).text());
      });

      return {
        source: 'Wikipedia',
        content: text.substring(0, 5000),
        categories,
        confidence: 0.95
      };
    } catch (error) {
      console.error('Wikipedia research failed:', error.message);
      return null;
    }
  }

  /**
   * Search DuckDuckGo for additional context
   */
  async searchDuckDuckGo(topic) {
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(topic)}&format=json&no_html=1&skip_disambig=1`;
      const response = await axios.get(url);
      const data = response.data;

      let content = '';
      const relatedTopics = [];

      if (data.AbstractText) {
        content += data.AbstractText + '\n\n';
      }

      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        data.RelatedTopics.slice(0, 10).forEach(item => {
          if (item.Text) {
            content += item.Text + '\n\n';
            relatedTopics.push(item.Text.substring(0, 100));
          }
        });
      }

      return {
        source: 'DuckDuckGo',
        content: content || null,
        relatedTopics,
        abstract: data.AbstractText || '',
        confidence: 0.85
      };
    } catch (error) {
      console.error('DuckDuckGo research failed:', error.message);
      return null;
    }
  }

  /**
   * General web search for supplementary information
   */
  async searchWeb(topic) {
    try {
      // Use DuckDuckGo HTML search as fallback
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(topic)}`;
      const response = await axios.get(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });

      const $ = cheerio.load(response.data);
      const results = [];

      $('.result').each((i, elem) => {
        if (i < 5) {
          const title = $(elem).find('.result__title').text().trim();
          const snippet = $(elem).find('.result__snippet').text().trim();
          const url = $(elem).find('a.result__url').attr('href');
          
          if (title && snippet) {
            results.push({ title, snippet, url });
          }
        }
      });

      return {
        source: 'WebSearch',
        results,
        content: results.map(r => `${r.title}: ${r.snippet}`).join('\n\n'),
        confidence: 0.75
      };
    } catch (error) {
      console.error('Web search failed:', error.message);
      return null;
    }
  }

  /**
   * Aggregate results from multiple sources
   */
  aggregateResults(results) {
    let aggregatedContent = '';
    const successfulResults = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value);

    // Sort by confidence
    successfulResults.sort((a, b) => b.confidence - a.confidence);

    successfulResults.forEach(result => {
      if (result.content) {
        aggregatedContent += `【Source: ${result.source}】\n${result.content}\n\n`;
      }
    });

    return aggregatedContent;
  }

  /**
   * Utility: Delay execution
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { ContentResearchAgent };
