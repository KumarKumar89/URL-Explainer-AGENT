const axios = require('axios');
const { YoutubeTranscript } = require('youtube-transcript');

async function extractVideoInfo(url) {
  try {
    const videoId = extractYouTubeId(url);
    if (!videoId) return null;
    
    // Get metadata via oEmbed
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await axios.get(oEmbedUrl);
    
    // Get transcript
    let transcript = null;
    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
      transcript = transcriptItems.map(item => item.text).join(' ');
    } catch (e) {
      console.log('No transcript available');
    }
    
    return {
      id: videoId,
      title: response.data.title || 'YouTube Video',
      description: response.data.description || '',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnail_sd: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      author: response.data.author_name || 'Unknown',
      author_url: response.data.author_url || '',
      transcript: transcript,
      url: url,
      embed_url: `https://www.youtube.com/embed/${videoId}`,
      duration: response.data.duration || 'Unknown'
    };
    
  } catch (error) {
    console.error('Video extraction error:', error.message);
    return null;
  }
}

function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

module.exports = { extractVideoInfo };
