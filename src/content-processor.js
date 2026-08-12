function generateEducationalContent(topic, rawContent) {
  const cleanedContent = cleanContent(rawContent);
  
  return {
    title: capitalizeWords(topic),
    what: extractWhat(cleanedContent, topic),
    why: extractWhy(cleanedContent, topic),
    how: extractHow(cleanedContent, topic),
    who: extractWho(cleanedContent, topic),
    where: extractWhere(cleanedContent, topic),
    when: extractWhen(cleanedContent, topic),
    ipo: generateIPO(cleanedContent, topic),
    types: generateTypes(cleanedContent, topic),
    examples: generateExamples(cleanedContent, topic),
    architecture: generateArchitecture(cleanedContent, topic),
    takeaways: generateTakeaways(cleanedContent, topic),
    timeline: generateTimeline(cleanedContent, topic)
  };
}

function cleanContent(content) {
  let cleaned = content.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/[^\w\s.,!?-]/g, ' ');
  if (cleaned.length > 5000) {
    cleaned = cleaned.substring(0, 5000);
  }
  return cleaned;
}

function extractWhat(content, topic) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let definition = findDefinition(content, topic);
  if (definition) return definition;
  if (sentences.length > 0) return sentences[0].trim() + '.';
  return `${topic} is a concept that helps us understand and solve problems in our daily lives.`;
}

function extractWhy(content, topic) {
  const importancePhrases = ['important', 'essential', 'crucial', 'vital', 'key', 'significant', 'benefit', 'advantage'];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let importanceSentences = sentences.filter(s => 
    importancePhrases.some(phrase => s.toLowerCase().includes(phrase))
  );
  if (importanceSentences.length > 0) {
    return importanceSentences.slice(0, 3).join('. ') + '.';
  }
  if (sentences.length > 1) {
    return sentences.slice(0, 2).join('. ') + '.';
  }
  return `${topic} is important because it helps us understand how things work and find solutions to problems.`;
}

function extractHow(content, topic) {
  const processPhrases = ['process', 'works', 'function', 'operate', 'step', 'method', 'approach', 'technique'];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let processSentences = sentences.filter(s => 
    processPhrases.some(phrase => s.toLowerCase().includes(phrase))
  );
  if (processSentences.length > 0) {
    return processSentences.slice(0, 3).join('. ') + '.';
  }
  if (sentences.length > 2) {
    return sentences.slice(1, 3).join('. ') + '.';
  }
  return `${topic} works by taking input, processing it, and producing output.`;
}

function extractWho(content, topic) {
  const peoplePhrases = ['people', 'users', 'developers', 'engineers', 'scientists', 'students', 'professionals'];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let peopleSentences = sentences.filter(s => 
    peoplePhrases.some(phrase => s.toLowerCase().includes(phrase))
  );
  if (peopleSentences.length > 0) {
    return peopleSentences.slice(0, 2).join('. ') + '.';
  }
  return `${topic} is used by students, professionals, and anyone interested in learning about this topic.`;
}

function extractWhere(content, topic) {
  const locationPhrases = ['used in', 'applied in', 'found in', 'implemented in', 'industries', 'fields', 'sectors'];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let locationSentences = sentences.filter(s => 
    locationPhrases.some(phrase => s.toLowerCase().includes(phrase))
  );
  if (locationSentences.length > 0) {
    return locationSentences.slice(0, 2).join('. ') + '.';
  }
  return `${topic} is used in various fields including education, technology, business, and research.`;
}

function extractWhen(content, topic) {
  const timePhrases = ['developed', 'invented', 'created', 'introduced', 'century', 'year', 'decade', 'history'];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let timeSentences = sentences.filter(s => 
    timePhrases.some(phrase => s.toLowerCase().includes(phrase))
  );
  if (timeSentences.length > 0) {
    return timeSentences.slice(0, 2).join('. ') + '.';
  }
  return `${topic} has evolved over time and continues to develop.`;
}

function findDefinition(content, topic) {
  const sentences = content.split(/[.!?]+/);
  for (const s of sentences) {
    const lower = s.toLowerCase();
    if (lower.includes(`${topic.toLowerCase()} is`) || 
        lower.includes(`${topic.toLowerCase()} refers`) ||
        lower.includes(`definition of ${topic.toLowerCase()}`)) {
      return s.trim() + '.';
    }
  }
  return null;
}

function generateIPO(content, topic) {
  return {
    input: `Data, resources, and requirements needed to work with ${topic}.`,
    process: `Steps and methods used to analyze and process information about ${topic}.`,
    output: `Results, solutions, and insights generated from ${topic}.`
  };
}

function generateTypes(content, topic) {
  const types = [];
  const sentences = content.split(/[.!?]+/);
  let typeSentences = sentences.filter(s => 
    s.toLowerCase().includes('types of') || 
    s.toLowerCase().includes('categories of') ||
    s.toLowerCase().includes('kinds of')
  );
  
  if (typeSentences.length > 0) {
    const typeWords = typeSentences.join(' ').split(',').slice(0, 4);
    typeWords.forEach((word, i) => {
      const clean = word.trim().replace(/^(types of|categories of|kinds of)\s*/i, '');
      if (clean.length > 3) {
        types.push({
          name: clean.substring(0, 40),
          description: `A type of ${topic} with specific characteristics and applications.`
        });
      }
    });
  }
  
  if (types.length === 0) {
    types.push(
      { name: 'Basic Type', description: `The fundamental form of ${topic} that is easy to understand.` },
      { name: 'Advanced Type', description: `A more complex version of ${topic} with additional features.` },
      { name: 'Specialized Type', description: `A specific version designed for particular use cases.` }
    );
  }
  
  return types.slice(0, 4);
}

function generateExamples(content, topic) {
  const examples = [];
  const sentences = content.split(/[.!?]+/);
  let exampleSentences = sentences.filter(s => 
    s.toLowerCase().includes('example') || 
    s.toLowerCase().includes('for instance') ||
    s.toLowerCase().includes('such as')
  );
  
  if (exampleSentences.length > 0) {
    exampleSentences.slice(0, 3).forEach((s, i) => {
      examples.push({
        title: `Example ${i + 1}`,
        description: s.trim() + '.'
      });
    });
  }
  
  if (examples.length === 0) {
    examples.push(
      { title: 'Everyday Example', description: `A simple example of ${topic} we use in daily life.` },
      { title: 'Educational Example', description: `How ${topic} is used in learning and education.` },
      { title: 'Professional Example', description: `How ${topic} is applied in professional settings.` }
    );
  }
  
  return examples;
}

function generateArchitecture(content, topic) {
  return [
    { 
      layer: 'Presentation Layer', 
      description: `The top layer where users interact with ${topic}. Includes user interfaces and how people see and use ${topic}.` 
    },
    { 
      layer: 'Application Layer', 
      description: `The middle layer where main processing happens. Handles the logic and rules of ${topic}.` 
    },
    { 
      layer: 'Data Layer', 
      description: `The bottom layer where information is stored and managed. Includes databases and files related to ${topic}.` 
    }
  ];
}

function generateTakeaways(content, topic) {
  const takeaways = [
    `✅ ${topic} is an important concept that helps us understand the world better.`,
    `✅ It has many real-world applications and benefits.`,
    `✅ Understanding ${topic} opens up opportunities in education and careers.`,
    `✅ ${topic} continues to evolve and improve over time.`
  ];
  return takeaways;
}

function generateTimeline(content, topic) {
  // Generate a simple HTML timeline
  return `
    <div style="padding: 20px; text-align: center;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0;">
        <div style="flex: 1; text-align: center; padding: 10px; background: #667eea; color: white; border-radius: 10px; margin: 0 5px;">
          <strong>1950s</strong><br>
          <small>Origins</small>
        </div>
        <div style="flex: 1; text-align: center; padding: 10px; background: #764ba2; color: white; border-radius: 10px; margin: 0 5px;">
          <strong>1970s</strong><br>
          <small>Development</small>
        </div>
        <div style="flex: 1; text-align: center; padding: 10px; background: #f093fb; color: white; border-radius: 10px; margin: 0 5px;">
          <strong>1990s</strong><br>
          <small>Digital Age</small>
        </div>
        <div style="flex: 1; text-align: center; padding: 10px; background: #4facfe; color: white; border-radius: 10px; margin: 0 5px;">
          <strong>Today</strong><br>
          <small>Modern Era</small>
        </div>
      </div>
      <div style="margin-top: 20px; color: #666;">
        <i class="fas fa-arrow-right"></i> ${topic} continues to evolve
      </div>
    </div>
  `;
}

function capitalizeWords(str) {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

module.exports = { generateEducationalContent };
