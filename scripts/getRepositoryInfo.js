const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Replaced OPENAI_API_KEY
const USERNAME = process.env.GITHUB_USERNAME;

async function fetchRepositories() {
  try {
    // Try organization endpoint first, fallback to user endpoint
    let apiUrl = `https://api.github.com/orgs/${USERNAME}/repos?per_page=100&sort=updated&type=public`;
    let response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    // If org endpoint fails, try user endpoint
    if (!response.ok && response.status === 404) {
      apiUrl = `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`;
      response = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos = await response.json();
    return repos;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

async function enhanceRepoWithAI(repo) {
  try {
    const prompt = `Based on this GitHub repository information, create an enhanced description and 3-4 bullet points highlighting key features or technologies used:

Repository Name: ${repo.name}
Original Description: ${repo.description || 'No description'}
Language: ${repo.language || 'Not specified'}
Topics: ${repo.topics?.join(', ') || 'None'}
Created: ${new Date(repo.created_at).getFullYear()}

Please respond strictly in JSON format matching this structure:
{
  "description": "Enhanced description (1-2 sentences)",
  "bullet_points": ["Point 1", "Point 2", "Point 3"]
}`;

    // Update to Gemini Pro API endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          // This ensures Gemini strictly returns parsable JSON
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    // Extract the text content from Gemini's response structure
    const content = data.candidates[0].content.parts[0].text;

    try {
      return JSON.parse(content);
    } catch (parseError) {
      console.warn(`Failed to parse AI response for ${repo.name}, using fallback`);
      return {
        description: repo.description || "No description available",
        bullet_points: [
          `Created ${new Date(repo.created_at).getFullYear()}`,
          `Language: ${repo.language || 'Not specified'}`,
          ...(repo.topics && repo.topics.length > 0 ? [`Topics: ${repo.topics.join(', ')}`] : [])
        ]
      };
    }
  } catch (error) {
    console.warn(`AI enhancement failed for ${repo.name}:`, error.message);
    return {
      description: repo.description || "No description available",
      bullet_points: [
        `Created ${new Date(repo.created_at).getFullYear()}`,
        `Language: ${repo.language || 'Not specified'}`,
        ...(repo.topics && repo.topics.length > 0 ? [`Topics: ${repo.topics.join(', ')}`] : [])
      ]
    };
  }
}

function readExistingProjects(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const yamlContent = fs.readFileSync(configPath, 'utf8');
      const existingData = yaml.load(yamlContent);
      return existingData?.items || [];
    }
  } catch (error) {
    console.warn('Failed to read existing project.yaml:', error.message);
  }
  return [];
}

async function formatProjectYaml(repos, configPath) {
  const filteredRepos = repos
    .filter(repo => !repo.fork && !repo.private);

  // Read existing projects
  const existingItems = readExistingProjects(configPath);
  console.log(`Found ${existingItems.length} existing projects`);

  // Create a map of existing items by name for duplicate checking
  const existingByName = new Map();
  const existingByLink = new Map();
  existingItems.forEach(item => {
    if (item.name) existingByName.set(item.name, item);
    if (item.link) existingByLink.set(item.link, item);
  });

  const enhancedItems = [];

  for (const repo of filteredRepos) {
    // Check if this repo already exists (by name or link)
    if (existingByName.has(repo.name) || existingByLink.has(repo.html_url)) {
      console.log(`Skipping ${repo.name} - already exists`);
      continue;
    }

    console.log(`Enhancing ${repo.name}...`);
    const aiEnhancement = await enhanceRepoWithAI(repo);

    enhancedItems.push({
      name: repo.name,
      description: aiEnhancement.description,
      bullet_points: aiEnhancement.bullet_points,
      link: repo.html_url,
      deployment: repo.homepage || repo.html_url,
      tag: [repo.language, ...(repo.topics || [])].filter(Boolean).join(', ')
    });

    // Rate limiting delay (Gemini has different rate limits, but 1s is safe)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Combine existing items with new enhanced items
  const allItems = [...existingItems, ...enhancedItems];

  let yamlContent = `title: "💼 Projects"\n`;
  yamlContent += `items:\n`;

  allItems.forEach(item => {
    yamlContent += `  - name: "${item.name}"\n`;
    yamlContent += `    description: "${item.description}"\n`;
    yamlContent += `    bullet_points:\n`;
    item.bullet_points.forEach(point => {
      yamlContent += `      - "${point}"\n`;
    });
    yamlContent += `    link: "${item.link}"\n`;
    yamlContent += `    deployment: "${item.deployment}"\n`;
    yamlContent += `    tag: "${item.tag}"\n`;
  });

  return yamlContent;
}

async function main() {
  try {
    console.log('Fetching repositories from GitHub...');
    const repos = await fetchRepositories();
    console.log(`Found ${repos.length} repositories`);

    const configPath = path.join(__dirname, '../config/project.yaml');
    console.log('Formatting project data with AI enhancement...');
    const yamlContent = await formatProjectYaml(repos, configPath);
    console.log(`Writing to ${configPath}...`);
    fs.writeFileSync(configPath, yamlContent, 'utf8');

    console.log('Successfully updated project.yaml with AI-enhanced descriptions!');
    const newRepoCount = repos.filter(r => !r.fork && !r.private).length;
    const existingCount = readExistingProjects(configPath).length;
    console.log(`Total repositories processed: ${newRepoCount}`);
    console.log(`Existing projects preserved: ${existingCount}`);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fetchRepositories, enhanceRepoWithAI, formatProjectYaml };