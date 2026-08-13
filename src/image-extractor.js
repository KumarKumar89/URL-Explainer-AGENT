/**
 * Image Extractor
 * Extracts images and visual content from webpages
 */

const axios = require('axios');
const cheerio = require('cheerio');

const AXIOS_CONFIG = {
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

async function extractImagesFromUrl(url) {
  try {
    const response = await axios.get(url, AXIOS_CONFIG);
    
    const $ = cheerio.load(response.data);
    const images = [];
    
    // Extract images with their context
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt') || '';
      const title = $(elem).attr('title') || '';
      
      if (src && !src.startsWith('data:') && images.length < 15) {
        try {
          const absoluteUrl = new URL(src, url).href;
          
          // Check if image is likely a diagram or chart
          const isDiagram = alt.toLowerCase().includes('diagram') || 
                           alt.toLowerCase().includes('chart') ||
                           alt.toLowerCase().includes('graph') ||
                           title.toLowerCase().includes('diagram');
          
          // Check size
          const width = $(elem).attr('width') || 'auto';
          const height = $(elem).attr('height') || 'auto';
          
          images.push({
            src: absoluteUrl,
            alt: alt || 'Image',
            title: title || '',
            type: isDiagram ? 'diagram' : 'image',
            width: width,
            height: height,
            context: getImageContext($, elem)
          });
        } catch (e) {
          // Skip invalid URLs
        }
      }
    });
    
    return images;
    
  } catch (error) {
    console.error('Image extraction error:', error.message);
    return [];
  }
}

function getImageContext($, element) {
  // Get surrounding text for context
  let context = '';
  const parent = $(element).parent();
  const text = parent.text().trim();
  if (text.length > 0 && text.length < 200) {
    context = text;
  }
  return context;
}

module.exports = { extractImagesFromUrl };
