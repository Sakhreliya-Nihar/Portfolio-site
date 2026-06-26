const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class ReadmeGenerator {
  constructor(configDir = './config', outputFile = './README.md') {
    this.configDir = configDir;
    this.outputFile = outputFile;
    this.sections = [];
  }

  // Dynamically discover and load all YAML files
  loadAllYamlFiles() {
    // Read base.yaml for custom ordering if it exists
    let yamlFiles;
    const basePath = path.join(this.configDir, 'base.yaml');
    if (fs.existsSync(basePath)) {
      const baseOrder = yaml.load(fs.readFileSync(basePath, 'utf8'));
      yamlFiles = baseOrder.filter(file => file !== 'base.yaml' && (file.endsWith('.yaml') || file.endsWith('.yml')));
      // Fallback: add any other YAML files not in base.yaml
      const allYaml = fs.readdirSync(this.configDir)
        .filter(file => (file.endsWith('.yaml') || file.endsWith('.yml')) && file !== 'base.yaml');
      for (const file of allYaml) {
        if (!yamlFiles.includes(file)) yamlFiles.push(file);
      }
    } else {
      yamlFiles = fs.readdirSync(this.configDir)
        .filter(file => file.endsWith('.yaml') || file.endsWith('.yml'))
        .filter(file => file !== 'base.yaml')
        .sort();
    }

    // Force tech_stack.yaml before project.yaml if both exist
    const techIdx = yamlFiles.indexOf('tech_stack.yaml');
    const projIdx = yamlFiles.indexOf('project.yaml');
    if (techIdx !== -1 && projIdx !== -1 && techIdx > projIdx) {
      // Swap them
      [yamlFiles[techIdx], yamlFiles[projIdx]] = [yamlFiles[projIdx], yamlFiles[techIdx]];
    }

    console.log(`📁 Found ${yamlFiles.length} YAML files:`, yamlFiles);

    for (const file of yamlFiles) {
      try {
        const filePath = path.join(this.configDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(content);

        const sectionName = path.basename(file, path.extname(file));
        this.sections.push({
          fileName: file,
          sectionName: this.formatSectionName(sectionName),
          data: data
        });

        console.log(`✅ Loaded: ${file}`);
      } catch (error) {
        console.error(`❌ Error loading ${file}:`, error.message);
      }
    }
  }

  // Format section name for display
  formatSectionName(name) {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  // Convert markdown-like syntax to proper markdown
  formatText(text) {
    if (typeof text !== 'string') return text;

    return text
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // Ensure bold formatting
      .replace(/\*(.*?)\*/g, '*$1*') // Ensure italic formatting
      .replace(/`(.*?)`/g, '`$1`'); // Ensure code formatting
  }

  // Render different data structures flexibly
  renderSection(section) {
    const { sectionName, data, fileName } = section;
    let markdown = `\n## ${data.title || sectionName}\n\n`;

    // Handle different YAML structures dynamically
    if (data.subtitle) {
      markdown += `*${this.formatText(data.subtitle)}*\n\n`;
    }

    if (data.quote) {
      markdown += `> "${this.formatText(data.quote)}"\n`;
      if (data.quote_author) {
        markdown += `> — ${this.formatText(data.quote_author)}\n\n`;
      }
    }

    if (data.contact) {
      markdown += `### Contact\n`;
      if (data.contact.email) {
        markdown += `- **Email**: ${data.contact.email}\n`;
      }
      if (data.contact.linkedin) {
        markdown += `- **LinkedIn**: [Profile](${data.contact.linkedin})\n`;
      }
      if (data.website) {
        markdown += `- **Website**: [${data.website}](${data.website})\n`;
      }
      markdown += '\n';
    }

    // Handle items array (most common structure)
    if (data.items && Array.isArray(data.items)) {
      markdown += this.renderItems(data.items, fileName);
    }

    // Handle categories (for tech stack)
    if (data.categories) {
      markdown += this.renderCategories(data.categories);
    }

    // Handle timeline (for journey)
    if (data.timeline) {
      markdown += this.renderTimeline(data.timeline);
      if (data.footer) {
        markdown += `\n${this.formatText(data.footer)}\n\n`;
      }
    }

    return markdown;
  }

  // Render items array with different structures
  renderItems(items, fileName) {
    let markdown = '';

    for (const item of items) {
      if (typeof item === 'string') {
        // Simple string items (legacy)
        markdown += `- ${this.formatText(item)}\n`;
      } else if (typeof item === 'object') {
        if (fileName.includes('project')) {
          markdown += this.renderProjectItem(item);
        } else if (fileName.includes('experience')) {
          markdown += this.renderExperienceItem(item);
        } else if (fileName.includes('education')) {
          markdown += this.renderEducationItem(item);
        } else {
          // Generic object handling
          markdown += this.renderGenericItem(item);
        }
      }
    }

    return markdown + '\n';
  }

  // Render project items
  renderProjectItem(project) {
    let markdown = `### ${this.formatText(project.name)}\n\n`;

    if (project.description) {
      markdown += `${this.formatText(project.description)}\n\n`;
    }

    if (project.bullet_points && Array.isArray(project.bullet_points)) {
      project.bullet_points.forEach(point => {
        markdown += `- ${this.formatText(point)}\n`;
      });
      markdown += '\n';
    }

    if (project.tag) {
      const tags = project.tag.split(', ').map(tag => `\`${tag.trim()}\``).join(' ');
      markdown += `**Technologies**: ${tags}\n\n`;
    }

    if (project.link || project.deployment) {
      markdown += '**Links**: ';
      const links = [];
      if (project.link) {
        links.push(`[Repository](${project.link})`);
      }
      if (project.deployment && project.deployment !== project.link) {
        links.push(`[Live Demo](${project.deployment})`);
      }
      markdown += links.join(' • ') + '\n\n';
    }

    return markdown + '---\n\n';
  }

  // Render experience items
  renderExperienceItem(experience) {
    let markdown = `### ${this.formatText(experience.company)}\n`;
    if (experience.duration) {
      markdown += `*${this.formatText(experience.duration)}*\n`;
    }
    markdown += '\n';
    if (experience.description) {
      markdown += `${this.formatText(experience.description)}\n\n`;
    }

    if (experience.bullet_points && Array.isArray(experience.bullet_points)) {
      experience.bullet_points.forEach(point => {
        markdown += `- ${this.formatText(point)}\n`;
      });
      markdown += '\n';
    }

    if (experience.tag) {
      const tags = experience.tag.split(', ').map(tag => `\`${tag.trim()}\``).join(' ');
      markdown += `**Technologies**: ${tags}\n\n`;
    }

    return markdown + '---\n\n';
  }

  // Render education items (new structure)
  renderEducationItem(item) {
    let markdown = `### ${this.formatText(item.degree)}, **${this.formatText(item.school)}**\n`;
    if (item.duration) {
      markdown += `*${item.duration}*\n`;
    }
    if (item.description) {
      markdown += `\n${this.formatText(item.description)}\n`;
    }
    if (item.bullet_points && Array.isArray(item.bullet_points) && item.bullet_points.length > 0) {
      item.bullet_points.forEach(point => {
        markdown += `- ${this.formatText(point)}\n`;
      });
    }
    if (item.skills) {
      markdown += `\n**Skills:** ${this.formatText(item.skills)}\n`;
    }
    markdown += '\n---\n\n';
    return markdown;
  }

  // Render generic object items
  renderGenericItem(item) {
    let markdown = '';

    for (const [key, value] of Object.entries(item)) {
      if (Array.isArray(value)) {
        markdown += `**${this.formatSectionName(key)}**:\n`;
        value.forEach(v => {
          markdown += `- ${this.formatText(v)}\n`;
        });
      } else {
        markdown += `**${this.formatSectionName(key)}**: ${this.formatText(value)}\n`;
      }
    }

    return markdown + '\n';
  }

  // Render categories (for tech stack)
  renderCategories(categories) {
    let markdown = '';

    for (const [category, technologies] of Object.entries(categories)) {
      markdown += `### ${category}\n\n`;
      const techList = technologies.split(', ').map(tech => `\`${tech.trim()}\``).join(' ');
      markdown += `${techList}\n\n`;
    }

    return markdown;
  }

  // Render timeline (for journey)
  renderTimeline(timeline) {
    let markdown = '';

    for (const event of timeline) {
      markdown += `### ${event.year}\n\n`;
      markdown += `${this.formatText(event.event)}\n\n`;

      if (event.details && Array.isArray(event.details)) {
        event.details.forEach(detail => {
          markdown += `- ${this.formatText(detail)}\n`;
        });
        markdown += '\n';
      }
    }

    return markdown;
  }

  // Generate the complete README
  generateReadme() {
    console.log('🚀 Generating README from YAML files...\n');

    // Load all YAML files
    this.loadAllYamlFiles();

    if (this.sections.length === 0) {
      console.error('❌ No YAML files found or loaded successfully');
      return;
    }

    // Find intro section for header
    const introSection = this.sections.find(s => s.fileName === 'intro.yaml');
    const otherSections = this.sections.filter(s => s.fileName !== 'intro.yaml');

    // Generate README content with intro data
    let readmeContent = `# ${introSection?.data?.title || 'Personal Portfolio'}\n`;

    // Add WakaTime badge
    readmeContent += `\n[![wakatime](https://wakatime.com/badge/user/7f899f26-8070-47ba-b38f-c89a2fa80139.svg)](https://wakatime.com/@7f899f26-8070-47ba-b38f-c89a2fa80139)\n`;

    // Add intro content (subtitle, quote, contact)
    if (introSection) {
      if (introSection.data.subtitle) {
        readmeContent += `\n*${this.formatText(introSection.data.subtitle)}*\n`;
      }

      if (introSection.data.quote) {
        readmeContent += `\n> "${this.formatText(introSection.data.quote)}"\n`;
        if (introSection.data.quote_author) {
          readmeContent += `> — ${this.formatText(introSection.data.quote_author)}\n`;
        }
      }

      if (introSection.data.contact || introSection.data.website || introSection.data.address) {
        readmeContent += '\n### Contact\n';
        if (introSection.data.website) {
          readmeContent += `- **Website**: [${introSection.data.website}](${introSection.data.website})\n`;
        }
        if (introSection.data.contact?.email) {
          readmeContent += `- **Email**: ${introSection.data.contact.email}\n`;
        }
        if (introSection.data.contact?.linkedin) {
          readmeContent += `- **LinkedIn**: [Profile](${introSection.data.contact.linkedin})\n`;
        }
        if (introSection.data.address) {
          readmeContent += `- **Address**: ${introSection.data.address}\n`;
        }
      }
      readmeContent += '\n';
    }

    // Add table of contents for other sections
    readmeContent += '## Table of Contents\n\n';
    otherSections.forEach(section => {
      const title = section.data.title || section.sectionName;
      const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      readmeContent += `- [${title}](#${anchor})\n`;
    });
    readmeContent += '\n';

    // Add all other sections (excluding intro)
    for (const section of otherSections) {
      readmeContent += this.renderSection(section);
    }

    // Add footer
    readmeContent += '\n---\n\n';
    readmeContent += `*This README was automatically generated from YAML configuration files on ${new Date().toLocaleDateString()}*\n`;

    // Write to file
    fs.writeFileSync(this.outputFile, readmeContent, 'utf8');
    console.log(`\n✅ README generated successfully: ${this.outputFile}`);
    console.log(`📄 Generated ${readmeContent.split('\n').length} lines from ${this.sections.length} YAML files`);
  }
}

// CLI usage
if (require.main === module) {
  const configDir = process.argv[2] || './config';
  const outputFile = process.argv[3] || './README.md';

  const generator = new ReadmeGenerator(configDir, outputFile);
  generator.generateReadme();
}

module.exports = ReadmeGenerator;