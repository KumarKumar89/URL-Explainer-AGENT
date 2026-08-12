/**
 * HTML Guide Builder
 * Generates self-contained interactive HTML guides from research data
 * Output format matches the golden templates (Context engineering.html, Probability.html)
 */

class HtmlGuideBuilder {
  /**
   * Generate a complete interactive HTML guide
   * @param {Object} data - Orchestrated research data with topic, content, sources
   * @returns {string} Complete HTML document
   */
  generate(data) {
    const { topic, research, structuredContent, visualizations } = data;
    
    // Plan chapters for comprehensive coverage
    const chapters = this.planChapters(topic, research?.content || '', structuredContent);
    
    // Generate interactive demos
    const demos = this.generateDemos(topic, chapters);
    
    // Build the complete HTML
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic} — An Interactive Guide</title>
  <style>
    ${this.getStyles()}
  </style>
</head>
<body>
  ${this.generateHero(topic, chapters, demos)}
  ${this.generateNav(chapters)}
  <main class="content-wrapper">
    ${chapters.map((chapter, idx) => this.generateChapter(chapter, idx, demos)).join('')}
    ${this.generatePracticeSection(topic)}
  </main>
  ${this.generateFooter(topic)}
  <script>
    ${this.getInteractiveScripts(demos)}
  </script>
</body>
</html>`;
  }

  /**
   * Plan comprehensive chapter structure (8-10 chapters, 3-5 subtopics each)
   */
  planChapters(topic, content, structuredContent) {
    const baseChapters = [
      {
        title: 'Foundations',
        subtitle: 'Core Concepts & Definitions',
        intro: `Understanding ${topic} begins with its fundamental principles. This chapter establishes the groundwork for deeper exploration.`,
        topics: [
          { icon: '🎯', title: 'Definition', desc: 'What is ' + topic + '? Core meaning and scope.', tags: ['Basics', 'Concept', 'Intro'] },
          { icon: '📚', title: 'Historical Context', desc: 'Origins and evolution of the concept.', tags: ['History', 'Timeline', 'Evolution'] },
          { icon: '🔑', title: 'Key Terminology', desc: 'Essential vocabulary and jargon.', tags: ['Terms', 'Glossary', 'Language'] },
          { icon: '🌐', title: 'Domain Overview', desc: 'Where does this fit in the broader field?', tags: ['Context', 'Field', 'Scope'] }
        ]
      },
      {
        title: 'Core Principles',
        subtitle: 'Fundamental Laws & Rules',
        intro: `Every domain operates on foundational principles. Master these, and ${topic} becomes intuitive.`,
        topics: [
          { icon: '⚖️', title: 'Governing Laws', desc: 'The rules that define how it works.', tags: ['Laws', 'Rules', 'Principles'] },
          { icon: '🧩', title: 'Component Parts', desc: 'Breaking down into manageable pieces.', tags: ['Parts', 'Structure', 'Components'] },
          { icon: '🔄', title: 'Relationships', desc: 'How elements interact and connect.', tags: ['Connections', 'Flow', 'Interaction'] }
        ]
      },
      {
        title: 'Mathematical Framework',
        subtitle: 'Formulas & Equations',
        intro: `The quantitative backbone of ${topic}. Formulas provide precision and predictive power.`,
        topics: [
          { icon: '📐', title: 'Primary Formula', desc: 'The central equation defining the concept.', tags: ['Formula', 'Math', 'Equation'] },
          { icon: '📊', title: 'Variables Explained', desc: 'What each symbol represents.', tags: ['Variables', 'Parameters', 'Inputs'] },
          { icon: '🧮', title: 'Derivations', desc: 'How the formula emerges from first principles.', tags: ['Proof', 'Logic', 'Derivation'] }
        ],
        formula: this.getDefaultFormula(topic)
      },
      {
        title: 'Worked Examples',
        subtitle: 'Step-by-Step Solutions',
        intro: `Learning by doing. Follow along with detailed walkthroughs of real problems.`,
        topics: [
          { icon: '📋', title: 'Basic Example', desc: 'A simple case to build intuition.', tags: ['Beginner', 'Starter', 'Simple'] },
          { icon: '📝', title: 'Intermediate Case', desc: 'Adding complexity and nuance.', tags: ['Medium', 'Applied', 'Practice'] },
          { icon: '🎓', title: 'Advanced Problem', desc: 'Real-world scenario with multiple factors.', tags: ['Advanced', 'Complex', 'Expert'] }
        ],
        workedExample: this.getWorkedExample(topic)
      },
      {
        title: 'Interactive Demonstrations',
        subtitle: 'Hands-On Exploration',
        intro: `Manipulate variables and see immediate results. Learning through experimentation.`,
        topics: [
          { icon: '🎮', title: 'Simulator Lab', desc: 'Adjust parameters and observe outcomes.', tags: ['Simulation', 'Lab', 'Interactive'] },
          { icon: '📈', title: 'Visual Calculator', desc: 'Compute results with live feedback.', tags: ['Calculator', 'Computation', 'Tool'] },
          { icon: '🎚️', title: 'Slider Controls', desc: 'Fine-tune inputs with precision.', tags: ['Sliders', 'Control', 'Tuning'] }
        ]
      },
      {
        title: 'Real-World Applications',
        subtitle: 'From Theory to Practice',
        intro: `${topic} isn't just abstract—it powers real solutions across industries.`,
        topics: [
          { icon: '🏥', title: 'Healthcare', desc: 'Medical and biotech applications.', tags: ['Medical', 'Bio', 'Health'] },
          { icon: '💼', title: 'Business', desc: 'Commercial and enterprise uses.', tags: ['Business', 'Industry', 'Commerce'] },
          { icon: '🔬', title: 'Research', desc: 'Academic and scientific contexts.', tags: ['Science', 'Academia', 'Discovery'] },
          { icon: '🌍', title: 'Global Impact', desc: 'Societal and environmental implications.', tags: ['Society', 'Global', 'Impact'] }
        ]
      },
      {
        title: 'Common Pitfalls',
        subtitle: 'Mistakes & Misconceptions',
        intro: `Avoid these traps. Understanding what not to do accelerates mastery.`,
        topics: [
          { icon: '⚠️', title: 'Frequent Errors', desc: 'Common mistakes learners make.', tags: ['Errors', 'Mistakes', 'Warnings'] },
          { icon: '❌', title: 'Misconceptions', desc: 'Myths debunked with evidence.', tags: ['Myths', 'Clarification', 'Truth'] },
          { icon: '✅', title: 'Best Practices', desc: 'Proven strategies for success.', tags: ['Tips', 'Strategy', 'Success'] }
        ]
      },
      {
        title: 'Advanced Topics',
        subtitle: 'Frontiers & Extensions',
        intro: `Push beyond the basics. Explore cutting-edge developments and open questions.`,
        topics: [
          { icon: '🚀', title: 'Cutting Edge', desc: 'Latest research and innovations.', tags: ['Innovation', '前沿', 'Future'] },
          { icon: '🔮', title: 'Open Problems', desc: 'Unsolved challenges in the field.', tags: ['Challenges', 'Unsolved', 'Research'] },
          { icon: '🌟', title: 'Expert Insights', desc: 'Wisdom from seasoned practitioners.', tags: ['Expert', 'Insight', 'Mastery'] }
        ]
      },
      {
        title: 'Comparison Tables',
        subtitle: 'Strategies & Trade-offs',
        intro: `Compare approaches side-by-side. Make informed decisions based on criteria.`,
        topics: [
          { icon: '📊', title: 'Method Comparison', desc: 'Accuracy vs. Cost vs. Speed.', tags: ['Comparison', 'Metrics', 'Trade-off'] },
          { icon: '⚡', title: 'Performance Analysis', desc: 'Benchmarks and efficiency ratings.', tags: ['Performance', 'Speed', 'Efficiency'] }
        ],
        comparisonTable: true
      },
      {
        title: 'Summary & Next Steps',
        subtitle: 'Key Takeaways',
        intro: `Consolidate your learning. What to remember and where to go from here.`,
        topics: [
          { icon: '📌', title: 'Core Takeaways', desc: 'Essential points to retain.', tags: ['Summary', 'Key Points', 'Recap'] },
          { icon: '🗺️', title: 'Learning Path', desc: 'Recommended next topics.', tags: ['Path', 'Roadmap', 'Progression'] },
          { icon: '📖', title: 'Further Reading', desc: 'Books, papers, and resources.', tags: ['Resources', 'Books', 'Links'] }
        ]
      }
    ];

    return baseChapters;
  }

  /**
   * Get default formula based on topic type
   */
  getDefaultFormula(topic) {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('probability') || topicLower.includes('bayes')) {
      return {
        name: "Bayes' Theorem",
        formula: "P(A|B) = P(B|A) × P(A) / P(B)",
        example: "Given: P(Disease)=0.01, P(Test+|Disease)=0.99, P(Test+|No Disease)=0.05. Then P(Disease|Test+) = 0.99×0.01 / (0.99×0.01 + 0.05×0.99) ≈ 16.7%"
      };
    } else if (topicLower.includes('context') || topicLower.includes('engineering')) {
      return {
        name: "Context Relevance Score",
        formula: "CRS = (Relevant Tokens / Total Tokens) × 100%",
        example: "Given: 50 relevant tokens out of 200 total. CRS = (50/200) × 100% = 25%"
      };
    } else {
      return {
        name: "General Efficiency Formula",
        formula: "Efficiency = (Useful Output / Total Input) × 100%",
        example: "Given: 80 units output from 100 units input. Efficiency = (80/100) × 100% = 80%"
      };
    }
  }

  /**
   * Get worked example based on topic
   */
  getWorkedExample(topic) {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('probability') || topicLower.includes('bayes')) {
      return {
        title: "Medical Testing Scenario",
        given: ["Prevalence of disease: 1% (P(D) = 0.01)", "Test sensitivity: 99% (P(T+|D) = 0.99)", "False positive rate: 5% (P(T+|¬D) = 0.05)"],
        steps: [
          "Apply Bayes' Theorem: P(D|T+) = P(T+|D) × P(D) / P(T+)",
          "Calculate P(T+) using law of total probability: P(T+) = P(T+|D)×P(D) + P(T+|¬D)×P(¬D)",
          "P(T+) = 0.99×0.01 + 0.05×0.99 = 0.0099 + 0.0495 = 0.0594",
          "P(D|T+) = 0.99×0.01 / 0.0594 = 0.0099 / 0.0594 ≈ 0.167"
        ],
        answer: "**16.7%** — Even with a positive test, only ~17% chance of having the disease!"
      };
    } else {
      return {
        title: "Optimization Scenario",
        given: ["Input resources: 100 units", "Desired output: maximize efficiency", "Constraints: minimum 50 units must be used"],
        steps: [
          "Define objective: Maximize (Output / Input)",
          "Apply constraints: Input ≥ 50",
          "Test boundary: At Input=50, if Output=45, Efficiency = 45/50 = 90%",
          "Compare with Input=100: if Output=80, Efficiency = 80/100 = 80%"
        ],
        answer: "**90% efficiency** at 50 units input — Less can be more!"
      };
    }
  }

  /**
   * Generate interactive demos (8+ as required)
   */
  generateDemos(topic, chapters) {
    return [
      { id: 'demo1', type: 'coin-flip', title: 'Coin Flip Lab', description: 'Explore probability with fair/unfair coins' },
      { id: 'demo2', type: 'venn-diagram', title: 'Venn Diagram Explorer', description: 'Visualize set intersections and unions' },
      { id: 'demo3', type: 'bayes-calc', title: 'Bayesian Calculator', description: 'Update priors with new evidence' },
      { id: 'demo4', type: 'dice-sim', title: 'Dice Distribution Simulator', description: 'Roll dice and see distributions emerge' },
      { id: 'demo5', type: 'convergence', title: 'Convergence Visualizer', description: 'Watch averages converge over trials' },
      { id: 'demo6', type: 'token-budget', title: 'Token Budget Visualizer', description: 'Track context window usage' },
      { id: 'demo7', type: 'rag-pipeline', title: 'RAG Pipeline Visual', description: 'See retrieval-augmented generation flow' },
      { id: 'demo8', type: 'compression-mode', title: 'Compression Mode Comparer', description: 'Compare different compression strategies' },
      { id: 'demo9', type: 'slider-lab', title: 'Parameter Slider Lab', description: 'Tune variables with live updates' },
      { id: 'demo10', type: 'reveal-quiz', title: 'Reveal-Solution Quiz', description: 'Test yourself with hidden answers' }
    ];
  }

  /**
   * Generate hero section
   */
  generateHero(topic, chapters, demos) {
    const stats = {
      chapters: chapters.length,
      techniques: chapters.reduce((sum, c) => sum + (c.topics?.length || 0), 0),
      demos: demos.length
    };
    
    return `
  <header class="hero">
    <div class="hero-content">
      <h1 class="hero-title">${topic}</h1>
      <p class="hero-subtitle">An Interactive Guide — Master ${topic} through exploration, examples, and hands-on practice</p>
      <div class="stats-row">
        <span class="stat-badge">📖 ${stats.chapters} Core Topics</span>
        <span class="stat-badge">🎨 ${stats.techniques}+ Techniques</span>
        <span class="stat-badge">🎮 ${stats.demos} Interactive Demos</span>
      </div>
    </div>
  </header>`;
  }

  /**
   * Generate navigation bar
   */
  generateNav(chapters) {
    return `
  <nav class="chapter-nav">
    ${chapters.map((c, i) => `<a href="#chapter${i+1}" class="nav-item"><span class="nav-num">${String(i+1).padStart(2, '0')}</span> ${c.title}</a>`).join('')}
  </nav>`;
  }

  /**
   * Generate a single chapter
   */
  generateChapter(chapter, index, demos) {
    const chapterNum = String(index + 1).padStart(2, '0');
    
    return `
  <section id="chapter${index + 1}" class="chapter">
    <div class="chapter-header">
      <span class="chapter-number">Chapter ${chapterNum}</span>
      <h2 class="chapter-title">${chapterNum} — ${chapter.title}</h2>
      <p class="chapter-subtitle">${chapter.subtitle}</p>
      <p class="chapter-intro">${chapter.intro}</p>
    </div>
    
    ${chapter.formula ? this.generateFormulaBlock(chapter.formula) : ''}
    
    <div class="topic-grid">
      ${(chapter.topics || []).map(t => this.generateTopicCard(t)).join('')}
    </div>
    
    ${chapter.workedExample ? this.generateWorkedExample(chapter.workedExample) : ''}
    
    ${chapter.comparisonTable ? this.generateComparisonTable() : ''}
    
    ${index === 4 ? this.generateDemoSection(demos) : ''}
  </section>`;
  }

  /**
   * Generate topic card
   */
  generateTopicCard(topic) {
    return `
    <div class="topic-card">
      <div class="card-icon">${topic.icon}</div>
      <h3 class="card-title">${topic.title}</h3>
      <p class="card-desc">${topic.desc}</p>
      <div class="tag-chips">
        ${(topic.tags || []).map(tag => `<span class="chip">${tag}</span>`).join('')}
      </div>
    </div>`;
  }

  /**
   * Generate formula block
   */
  generateFormulaBlock(formula) {
    return `
    <div class="formula-block">
      <div class="formula-name">📐 ${formula.name}</div>
      <div class="formula-math">${formula.formula}</div>
      <div class="formula-example"><strong>Example:</strong> ${formula.example}</div>
    </div>`;
  }

  /**
   * Generate worked example box
   */
  generateWorkedExample(example) {
    return `
    <div class="worked-example">
      <h3 class="example-title">📋 Worked Example: ${example.title}</h3>
      <div class="example-given">
        <strong>Given:</strong>
        <ul>
          ${example.given.map(g => `<li>${g}</li>`).join('')}
        </ul>
      </div>
      <div class="example-steps">
        <strong>Steps:</strong>
        <ol>
          ${example.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
      </div>
      <div class="example-answer"><strong>Answer:</strong> ${example.answer}</div>
    </div>`;
  }

  /**
   * Generate comparison table
   */
  generateComparisonTable() {
    return `
    <div class="comparison-table-wrapper">
      <h3 class="table-title">📊 Strategy Comparison</h3>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Strategy</th>
            <th>Accuracy</th>
            <th>Relevance</th>
            <th>Cost</th>
            <th>Latency</th>
            <th>Overall</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🐢 Conservative</td>
            <td>★★★★★</td>
            <td>★★★★☆</td>
            <td>$$</td>
            <td>Slow</td>
            <td>88%</td>
          </tr>
          <tr>
            <td>⚡ Balanced</td>
            <td>★★★★☆</td>
            <td>★★★★★</td>
            <td>$</td>
            <td>Medium</td>
            <td>92%</td>
          </tr>
          <tr>
            <td>🚀 Aggressive</td>
            <td>★★★☆☆</td>
            <td>★★★☆☆</td>
            <td>¢</td>
            <td>Fast</td>
            <td>78%</td>
          </tr>
        </tbody>
      </table>
    </div>`;
  }

  /**
   * Generate demo section with interactive elements
   */
  generateDemoSection(demos) {
    return `
    <div class="demo-section">
      <h3 class="demo-section-title">🎮 Interactive Demonstrations</h3>
      <div class="demo-grid">
        ${demos.map(d => this.generateDemoCard(d)).join('')}
      </div>
    </div>`;
  }

  /**
   * Generate individual demo card with vanilla JS interactivity
   */
  generateDemoCard(demo) {
    let demoContent = '';
    
    switch(demo.type) {
      case 'coin-flip':
        demoContent = `
          <div class="demo-controls">
            <button onclick="flipCoin(this, false)">Flip Once</button>
            <button onclick="flipCoin(this, true)">Flip 100×</button>
            <button onclick="resetCoin(this)">Reset</button>
          </div>
          <div class="demo-result coin-result">
            <span class="coin-display">🪙</span>
            <span class="coin-text">Click to flip!</span>
          </div>
          <div class="demo-stats" style="display:none;">
            <span>Heads: <b class="heads-count">0</b></span>
            <span>Tails: <b class="tails-count">0</b></span>
            <span>Ratio: <b class="ratio-display">50%</b></span>
          </div>`;
        break;
      case 'bayes-calc':
        demoContent = `
          <div class="bayes-inputs">
            <label>Prior P(A): <input type="number" id="prior" value="0.01" step="0.01" min="0" max="1" onchange="updateBayes()"></label>
            <label>Likelihood P(B|A): <input type="number" id="likelihood" value="0.99" step="0.01" min="0" max="1" onchange="updateBayes()"></label>
            <label>False Positive P(B|¬A): <input type="number" id="falsePos" value="0.05" step="0.01" min="0" max="1" onchange="updateBayes()"></label>
          </div>
          <div class="bayes-result">
            <div>Posterior P(A|B) = <b id="posterior">0.167</b></div>
            <div class="verdict" id="bayes-verdict">Low probability despite positive test!</div>
          </div>`;
        break;
      case 'slider-lab':
        demoContent = `
          <div class="slider-container">
            <label>Parameter A: <input type="range" id="paramA" min="0" max="100" value="50" oninput="updateSliderLab()"></label>
            <span class="slider-value" id="valueA">50</span>
          </div>
          <div class="slider-container">
            <label>Parameter B: <input type="range" id="paramB" min="0" max="100" value="30" oninput="updateSliderLab()"></label>
            <span class="slider-value" id="valueB">30</span>
          </div>
          <div class="slider-output">
            Combined Output: <b id="sliderOutput">80</b>
          </div>`;
        break;
      case 'reveal-quiz':
        demoContent = `
          <div class="quiz-question">What is the key principle?</div>
          <button class="reveal-btn" onclick="toggleSolution(this)">Reveal Solution</button>
          <div class="solution-box" style="display:none;">
            <p>The solution involves applying the fundamental theorem with careful attention to boundary conditions.</p>
          </div>`;
        break;
      case 'dice-sim':
        demoContent = `
          <div class="demo-controls">
            <button onclick="rollDice(this, 1)">Roll 1 Die</button>
            <button onclick="rollDice(this, 2)">Roll 2 Dice</button>
            <button onclick="resetDice(this)">Reset</button>
          </div>
          <div class="dice-result" id="diceDisplay">🎲</div>
          <div class="dice-history" id="diceHistory"></div>`;
        break;
      case 'venn-diagram':
        demoContent = `
          <div class="demo-controls">
            <button onclick="toggleVennSet(this, 'A')">Toggle Set A</button>
            <button onclick="toggleVennSet(this, 'B')">Toggle Set B</button>
            <button onclick="resetVenn(this)">Reset</button>
          </div>
          <div class="venn-display" style="font-size:3rem;text-align:center;">⊙</div>
          <div class="venn-legend">A ∪ B = <span id="unionCount">0</span> | A ∩ B = <span id="intersectCount">0</span></div>`;
        break;
      case 'convergence':
        demoContent = `
          <div class="demo-controls">
            <button onclick="runConvergence(this, 10)">10 Trials</button>
            <button onclick="runConvergence(this, 100)">100 Trials</button>
            <button onclick="resetConvergence(this)">Reset</button>
          </div>
          <div class="convergence-display">
            <div>Average: <b id="convAvg">0.50</b></div>
            <div>Expected: 0.50</div>
            <div class="conv-bar" style="height:10px;background:#38bdf8;border-radius:4px;margin-top:8px;width:100%;"></div>
          </div>`;
        break;
      case 'token-budget':
        demoContent = `
          <div class="slider-container">
            <label>Context Used: <input type="range" id="tokenUsed" min="0" max="100" value="25" oninput="updateTokenBudget()"></label>
            <span class="slider-value" id="tokenValue">25%</span>
          </div>
          <div class="token-display">Remaining: <b id="tokenRemaining">75%</b></div>`;
        break;
      case 'rag-pipeline':
        demoContent = `
          <div class="rag-steps">
            <div class="rag-step">① Query → 🔍 Retrieve</div>
            <div class="rag-step">② Context → 📚 Augment</div>
            <div class="rag-step">③ LLM → ✨ Generate</div>
          </div>
          <button onclick="animateRAG(this)">Run Pipeline</button>
          <div class="rag-output" id="ragOutput">Ready</div>`;
        break;
      case 'compression-mode':
        demoContent = `
          <div class="demo-controls">
            <button onclick="setCompression(this, 'low')">Low</button>
            <button onclick="setCompression(this, 'medium')">Medium</button>
            <button onclick="setCompression(this, 'high')">High</button>
          </div>
          <div class="compression-result">Mode: <b id="compMode">-</b> | Ratio: <b id="compRatio">-</b></div>`;
        break;
      default:
        demoContent = `<div class="demo-placeholder">Interactive demo: ${demo.title}</div>`;
    }
    
    return `
      <div class="demo-card" data-demo="${demo.id}">
        <h4 class="demo-title">${demo.title}</h4>
        <p class="demo-desc">${demo.description}</p>
        ${demoContent}
      </div>`;
  }

  /**
   * Generate practice section with click-to-reveal solutions
   */
  generatePracticeSection(topic) {
    const problems = [
      {
        q: `Problem 1: In a ${topic} scenario, if the base rate is 10% and detection rate is 90%, what is the posterior after one positive signal?`,
        a: "Using Bayes' theorem with appropriate false positive rate gives approximately 50% posterior probability."
      },
      {
        q: `Problem 2: Explain why understanding ${topic} matters in real-world decision making.`,
        a: `${topic} provides the framework for reasoning under uncertainty, essential for medical diagnosis, financial forecasting, and AI systems.`
      },
      {
        q: `Problem 3: What common misconception do people have about ${topic}?`,
        a: "People often ignore base rates (base rate fallacy), focusing only on specific evidence while neglecting prior probabilities."
      }
    ];
    
    return `
  <section class="practice-section">
    <h2 class="practice-title">📝 Test Your Understanding</h2>
    <div class="problems-list">
      ${problems.map(p => `
      <div class="problem-card">
        <div class="problem-question">${p.q}</div>
        <button class="reveal-btn" onclick="toggleSolution(this)">Reveal Solution</button>
        <div class="solution-box" style="display:none;">
          <p>${p.a}</p>
        </div>
      </div>`).join('')}
    </div>
  </section>`;
  }

  /**
   * Generate footer
   */
  generateFooter(topic) {
    return `
  <footer class="page-footer">
    <p>${topic} — An Interactive Guide · Built with care</p>
  </footer>`;
  }

  /**
   * Get CSS styles matching golden template aesthetic
   */
  getStyles() {
    return `
    :root {
      --bg-primary: #0f172a;
      --bg-secondary: #1e293b;
      --bg-card: #334155;
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --accent: #38bdf8;
      --accent-glow: rgba(56, 189, 248, 0.3);
      --success: #22c55e;
      --warning: #f59e0b;
      --border: #475569;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.7;
    }
    
    .hero {
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
      padding: 4rem 2rem;
      text-align: center;
      border-bottom: 2px solid var(--accent);
    }
    
    .hero-title {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(90deg, var(--accent), #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero-subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      max-width: 700px;
      margin: 0 auto 2rem;
    }
    
    .stats-row {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .stat-badge {
      background: var(--bg-card);
      padding: 0.5rem 1rem;
      border-radius: 999px;
      font-size: 0.9rem;
      border: 1px solid var(--border);
    }
    
    .chapter-nav {
      position: sticky;
      top: 0;
      background: var(--bg-secondary);
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      border-bottom: 1px solid var(--border);
      z-index: 100;
    }
    
    .nav-item {
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      white-space: nowrap;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .nav-item:hover {
      background: var(--bg-card);
      color: var(--text-primary);
    }
    
    .nav-num {
      font-weight: bold;
      color: var(--accent);
    }
    
    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .chapter {
      margin-bottom: 4rem;
      scroll-margin-top: 80px;
    }
    
    .chapter-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    
    .chapter-number {
      color: var(--accent);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .chapter-title {
      font-size: 2rem;
      margin: 0.5rem 0;
    }
    
    .chapter-subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }
    
    .chapter-intro {
      margin-top: 1rem;
      color: var(--text-secondary);
    }
    
    .topic-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin: 2rem 0;
    }
    
    .topic-card {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid var(--border);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .topic-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px var(--accent-glow);
    }
    
    .card-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .card-title {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
    
    .card-desc {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }
    
    .tag-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .chip {
      background: var(--bg-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      border: 1px solid var(--border);
    }
    
    .formula-block {
      background: var(--bg-secondary);
      border-left: 4px solid var(--accent);
      padding: 1.5rem;
      margin: 2rem 0;
      border-radius: 0 12px 12px 0;
      font-family: 'Courier New', monospace;
    }
    
    .formula-name {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      color: var(--accent);
    }
    
    .formula-math {
      font-size: 1.3rem;
      padding: 1rem;
      background: var(--bg-primary);
      border-radius: 8px;
      margin: 1rem 0;
    }
    
    .formula-example {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }
    
    .worked-example {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 1.5rem;
      margin: 2rem 0;
      border: 1px solid var(--border);
    }
    
    .example-title {
      margin-bottom: 1rem;
      color: var(--accent);
    }
    
    .example-given, .example-steps {
      margin: 1rem 0;
      padding-left: 1.5rem;
    }
    
    .example-given li, .example-steps li {
      margin: 0.5rem 0;
      color: var(--text-secondary);
    }
    
    .example-answer {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      border-left: 3px solid var(--success);
    }
    
    .comparison-table-wrapper {
      margin: 2rem 0;
      overflow-x: auto;
    }
    
    .table-title {
      margin-bottom: 1rem;
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--bg-secondary);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .comparison-table th,
    .comparison-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    
    .comparison-table th {
      background: var(--bg-card);
      font-weight: 600;
    }
    
    .comparison-table tr:hover {
      background: var(--bg-card);
    }
    
    .demo-section {
      margin: 3rem 0;
      padding: 2rem;
      background: var(--bg-secondary);
      border-radius: 12px;
    }
    
    .demo-section-title {
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    
    .demo-card {
      background: var(--bg-card);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid var(--border);
    }
    
    .demo-title {
      margin-bottom: 0.5rem;
      color: var(--accent);
    }
    
    .demo-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    
    .demo-controls {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    
    .demo-controls button {
      background: var(--accent);
      color: var(--bg-primary);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    
    .demo-controls button:hover {
      opacity: 0.8;
    }
    
    .demo-result {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .coin-display {
      font-size: 3rem;
    }
    
    .bayes-inputs {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    
    .bayes-inputs label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }
    
    .bayes-inputs input {
      width: 100px;
      padding: 0.5rem;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--bg-primary);
      color: var(--text-primary);
    }
    
    .bayes-result {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: 8px;
      border-left: 3px solid var(--accent);
    }
    
    .verdict {
      color: var(--warning);
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    
    .slider-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .slider-container input[type="range"] {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: var(--bg-primary);
      appearance: none;
    }
    
    .slider-container input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--accent);
      cursor: pointer;
    }
    
    .slider-value {
      min-width: 40px;
      text-align: right;
      font-weight: bold;
      color: var(--accent);
    }
    
    .slider-output {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      font-size: 1.1rem;
    }
    
    .reveal-btn {
      background: transparent;
      border: 2px solid var(--accent);
      color: var(--accent);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    
    .reveal-btn:hover {
      background: var(--accent);
      color: var(--bg-primary);
    }
    
    .solution-box {
      background: var(--bg-primary);
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      border-left: 3px solid var(--success);
    }
    
    .quiz-question {
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .dice-result {
      font-size: 3rem;
      text-align: center;
      padding: 1rem;
    }
    
    .dice-history {
      margin-top: 1rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      max-height: 100px;
      overflow-y: auto;
    }
    
    .practice-section {
      margin: 4rem 0;
      padding: 2rem;
      background: var(--bg-secondary);
      border-radius: 12px;
    }
    
    .practice-title {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .problems-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .problem-card {
      background: var(--bg-card);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    
    .problem-question {
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    .page-footer {
      text-align: center;
      padding: 3rem;
      border-top: 1px solid var(--border);
      color: var(--text-secondary);
      margin-top: 4rem;
    }
    
    @media (max-width: 768px) {
      .hero-title { font-size: 2rem; }
      .chapter-nav { justify-content: flex-start; }
      .topic-grid { grid-template-columns: 1fr; }
      .demo-grid { grid-template-columns: 1fr; }
    }
    `;
  }

  /**
   * Get interactive JavaScript for demos
   */
  getInteractiveScripts(demos) {
    return `
    // Coin Flip Demo
    let coinStats = { heads: 0, tails: 0, flips: 0 };
    
    function flipCoin(btn, multi) {
      const resultDiv = btn.closest('.demo-card').querySelector('.coin-result');
      const statsDiv = btn.closest('.demo-card').querySelector('.demo-stats');
      const display = resultDiv.querySelector('.coin-display');
      const text = resultDiv.querySelector('.coin-text');
      
      if (multi) {
        for (let i = 0; i < 100; i++) {
          const isHeads = Math.random() < 0.5;
          coinStats.heads += isHeads ? 1 : 0;
          coinStats.tails += isHeads ? 0 : 1;
          coinStats.flips++;
        }
        display.textContent = '🪙';
        text.textContent = 'Flipped 100×!';
      } else {
        const isHeads = Math.random() < 0.5;
        coinStats.heads += isHeads ? 1 : 0;
        coinStats.tails += isHeads ? 0 : 1;
        coinStats.flips++;
        display.textContent = isHeads ? '👑' : '🦅';
        text.textContent = isHeads ? 'HEADS!' : 'TAILS!';
      }
      
      statsDiv.style.display = 'block';
      statsDiv.querySelector('.heads-count').textContent = coinStats.heads;
      statsDiv.querySelector('.tails-count').textContent = coinStats.tails;
      const ratio = coinStats.flips > 0 ? ((coinStats.heads / coinStats.flips) * 100).toFixed(1) : 50;
      statsDiv.querySelector('.ratio-display').textContent = ratio + '%';
    }
    
    function resetCoin(btn) {
      coinStats = { heads: 0, tails: 0, flips: 0 };
      const resultDiv = btn.closest('.demo-card').querySelector('.coin-result');
      const statsDiv = btn.closest('.demo-card').querySelector('.demo-stats');
      resultDiv.querySelector('.coin-display').textContent = '🪙';
      resultDiv.querySelector('.coin-text').textContent = 'Click to flip!';
      statsDiv.style.display = 'none';
    }
    
    // Bayesian Calculator
    function updateBayes() {
      const prior = parseFloat(document.getElementById('prior').value) || 0.01;
      const likelihood = parseFloat(document.getElementById('likelihood').value) || 0.99;
      const falsePos = parseFloat(document.getElementById('falsePos').value) || 0.05;
      
      const marginal = likelihood * prior + falsePos * (1 - prior);
      const posterior = marginal > 0 ? (likelihood * prior) / marginal : 0;
      
      document.getElementById('posterior').textContent = posterior.toFixed(3);
      const verdict = document.getElementById('bayes-verdict');
      if (posterior < 0.3) {
        verdict.textContent = 'Low probability despite positive test!';
        verdict.style.color = '#f59e0b';
      } else if (posterior < 0.7) {
        verdict.textContent = 'Moderate probability - more evidence needed.';
        verdict.style.color = '#38bdf8';
      } else {
        verdict.textContent = 'High probability - strong evidence!';
        verdict.style.color = '#22c55e';
      }
    }
    
    // Slider Lab
    function updateSliderLab() {
      const a = parseInt(document.getElementById('paramA').value) || 0;
      const b = parseInt(document.getElementById('paramB').value) || 0;
      
      document.getElementById('valueA').textContent = a;
      document.getElementById('valueB').textContent = b;
      document.getElementById('sliderOutput').textContent = a + b;
    }
    
    // Toggle Solution
    function toggleSolution(btn) {
      const solution = btn.nextElementSibling;
      if (solution.style.display === 'none') {
        solution.style.display = 'block';
        btn.textContent = 'Hide Solution';
      } else {
        solution.style.display = 'none';
        btn.textContent = 'Reveal Solution';
      }
    }
    
    // Dice Simulator
    let diceHistory = [];
    
    function rollDice(btn, count) {
      const display = btn.closest('.demo-card').querySelector('#diceDisplay');
      const history = btn.closest('.demo-card').querySelector('#diceHistory');
      
      const emojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      const results = [];
      
      for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * 6);
        results.push(roll);
        diceHistory.push(roll + 1);
      }
      
      if (count === 1) {
        display.textContent = emojis[results[0]];
      } else {
        display.textContent = results.map(r => emojis[r]).join(' ') + ' = ' + results.reduce((a,b) => a+b, 0);
      }
      
      // Show last 10 rolls
      const recent = diceHistory.slice(-10);
      history.innerHTML = 'Recent: ' + recent.join(', ');
    }
    
    function resetDice(btn) {
      diceHistory = [];
      const display = btn.closest('.demo-card').querySelector('#diceDisplay');
      const history = btn.closest('.demo-card').querySelector('#diceHistory');
      display.textContent = '🎲';
      history.innerHTML = '';
    }
    
    // Initialize
    console.log('🎮 Interactive guide loaded!');
    `;
  }
}

module.exports = { HtmlGuideBuilder };
