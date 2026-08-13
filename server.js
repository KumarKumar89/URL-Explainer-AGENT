require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { searchAndExplain } = require('./src/search-service');
const { extractImagesFromUrl } = require('./src/image-extractor');
const { extractVideoInfo } = require('./src/video-extractor');
const { AgentOrchestrator } = require('./agents/orchestrator');
const { AlgorithmAnimatorAgent } = require('./agents/algorithm-animator-agent');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the Agent Orchestrator
const orchestrator = new AgentOrchestrator();
const algorithmAnimator = new AlgorithmAnimatorAgent();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Main analyze endpoint - AGENT-POWERED VERSION
app.post('/api/analyze', async (req, res) => {
  const { url, useAgents } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL or topic is required' });
  }

  try {
    let topic = extractTopicFromUrl(url);
    let result;

    // Use agent-based processing if requested, otherwise use legacy method
    if (useAgents) {
      console.log(`🤖 Using AI Agents to process: ${topic}`);
      result = await orchestrator.processTopic(topic);
    } else {
      console.log(`📚 Using legacy method to process: ${topic}`);
      
      // Extract images if URL is a webpage
      let images = [];
      let videoInfo = null;

      // Check if it's a URL with content
      if (isValidUrl(url)) {
        try {
          // Extract images from the webpage
          images = await extractImagesFromUrl(url);

          // Check if it's a YouTube video
          if (isYouTubeUrl(url)) {
            videoInfo = await extractVideoInfo(url);
          }
        } catch (e) {
          console.log('Image/Video extraction failed, continuing...');
        }
      }

      // Get educational content using legacy method
      const legacyResult = await searchAndExplain(topic);

      // Merge with images and video
      result = {
        ...legacyResult,
        images: images.length > 0 ? images : legacyResult.images || [],
        video: videoInfo || legacyResult.video || null,
        hasVisuals: images.length > 0 || videoInfo !== null
      };
    }

    res.json({
      success: true,
      data: result,
      topic: topic,
      processingMethod: useAgents ? 'agents' : 'legacy',
      visualCount: result.images ? result.images.length : 0
    });

  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({
      error: 'Failed to explain the topic',
      details: error.message
    });
  }
});

// New endpoint: Agent-specific analysis
app.post('/api/analyze-with-agents', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    console.log(`🤖 Agent-powered analysis for: ${topic}`);
    const result = await orchestrator.processTopic(topic);
    
    res.json({
      success: true,
      data: result,
      topic: topic,
      processingMethod: 'agents'
    });
  } catch (error) {
    console.error('Agent analysis error:', error.message);
    res.status(500).json({
      error: 'Failed to analyze with agents',
      details: error.message
    });
  }
});

// Metrics endpoint
app.get('/api/agent-metrics', (req, res) => {
  res.json({
    success: true,
    metrics: orchestrator.getMetrics()
  });
});

// Reset metrics endpoint
app.post('/api/agent-metrics/reset', (req, res) => {
  orchestrator.resetMetrics();
  res.json({
    success: true,
    message: 'Metrics reset successfully'
  });
});

// Helper functions
function extractTopicFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p);
    let topic = pathParts[pathParts.length - 1] || urlObj.hostname;
    topic = topic.replace(/[_-]/g, ' ');
    topic = topic.replace(/\.[^/.]+$/, '');
    topic = decodeURIComponent(topic);
    return topic || 'technology';
  } catch (e) {
    return url;
  }
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function isYouTubeUrl(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)/
  ];
  return patterns.some(pattern => pattern.test(url));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎓 ULTIMATE URL EXPLAINER running on http://localhost:${PORT}`);
  console.log(`🤖 Now with AI Agents: Research, Structuring, and Visualization!`);
  console.log(`📊 With charts, diagrams, images, and video support!`);
  console.log(`💡 Enter any topic or URL to get started`);
});
