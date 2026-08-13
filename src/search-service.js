/**
 * Search Service
 * Handles web searches and content extraction for educational topics
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { generateEducationalContent } = require('./content-processor');

const AXIOS_CONFIG = {
  timeout: 10000,
  headers: { 'User-Agent': 'EduExplainer-SearchService/1.0' }
};

async function searchAndExplain(topic) {
  try {
    const searchResults = await searchWeb(topic);
    const content = await extractContent(searchResults, topic);
    return generateEducationalContent(topic, content);
  } catch (error) {
    console.error('Search error:', error.message);
    return generateFallbackContent(topic);
  }
}

async function searchWeb(topic) {
  const results = [];
  
  try {
    const wikiContent = await fetchWikipedia(topic);
    if (wikiContent) {
      results.push({ source: 'Wikipedia', content: wikiContent, priority: 1 });
    }
  } catch (e) {
    console.log('Wikipedia fetch failed...');
  }
  
  try {
    const ddgContent = await fetchDuckDuckGo(topic);
    if (ddgContent) {
      results.push({ source: 'DuckDuckGo', content: ddgContent, priority: 2 });
    }
  } catch (e) {
    console.log('DuckDuckGo fetch failed...');
  }
  
  if (results.length === 0) {
    results.push({
      source: 'Generated Content',
      content: generateBasicContent(topic),
      priority: 3
    });
  }
  
  return results;
}

async function fetchWikipedia(topic) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&srlimit=1`;
    const searchResponse = await axios.get(searchUrl, AXIOS_CONFIG);
    
    const pages = searchResponse.data.query.search;
    if (!pages || pages.length === 0) return null;
    
    const pageId = pages[0].pageid;
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=parse&pageid=${pageId}&format=json&prop=text`;
    const contentResponse = await axios.get(contentUrl, AXIOS_CONFIG);
    
    const html = contentResponse.data.parse.text['*'];
    const $ = cheerio.load(html);
    
    let text = '';
    $('p').each((i, elem) => {
      const paragraph = $(elem).text().trim();
      if (paragraph.length > 50) {
        text += paragraph + '\n\n';
      }
    });
    
    return text.substring(0, 3000);
  } catch (error) {
    console.error('Wikipedia fetch error:', error.message);
    return null;
  }
}

async function fetchDuckDuckGo(topic) {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(topic)}&format=json&no_html=1&skip_disambig=1`;
    const response = await axios.get(url, AXIOS_CONFIG);
    const data = response.data;
    
    let content = '';
    if (data.AbstractText) {
      content += data.AbstractText + '\n\n';
    }
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.forEach(item => {
        if (item.Text) {
          content += item.Text + '\n\n';
        }
      });
    }
    return content || null;
  } catch (error) {
    console.error('DuckDuckGo fetch error:', error.message);
    return null;
  }
}

async function extractContent(searchResults, topic) {
  let combinedContent = '';
  searchResults.sort((a, b) => a.priority - b.priority);
  searchResults.forEach(result => {
    if (result.content) {
      combinedContent += result.content + '\n\n';
    }
  });
  if (combinedContent.length < 200) {
    combinedContent = generateBasicContent(topic);
  }
  return combinedContent;
}

function generateBasicContent(topic) {
  return `
    ${topic} is an important concept in modern technology and daily life.
    It helps us solve problems and make things easier.
    Many people use ${topic} every day without even realizing it.
    Understanding ${topic} can open up many opportunities in education and career.
  `;
}

function generateFallbackContent(topic) {
  return {
    title: topic,
    what: `What is ${topic}?`,
    why: `Why is ${topic} important?`,
    how: `How does ${topic} work?`,
    who: `Who uses ${topic}?`,
    where: `Where is ${topic} used?`,
    when: `When was ${topic} developed?`,
    ipo: { input: 'Various data', process: 'Processing', output: 'Results' },
    types: [
      { name: 'Basic Type', description: 'The fundamental form' },
      { name: 'Advanced Type', description: 'More complex applications' }
    ],
    examples: [
      { title: 'Example 1', description: 'A simple everyday example' },
      { title: 'Example 2', description: 'A more advanced application' }
    ],
    architecture: [
      { layer: 'User Interface', description: 'How users interact' },
      { layer: 'Application Logic', description: 'The main processing' },
      { layer: 'Data Storage', description: 'Where information is stored' }
    ],
    takeaways: ['✅ Key takeaway 1', '✅ Key takeaway 2'],
    timeline: '<div>Timeline goes here</div>'
  };
}

module.exports = { searchAndExplain };
