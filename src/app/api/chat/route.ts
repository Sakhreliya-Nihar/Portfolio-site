import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load all YAML configuration files
function loadYamlConfigs() {
  const configDir = path.join(process.cwd(), 'config');

  const yamlFiles = [
    'intro.yaml',
    'current_work.yaml',
    'learning.yaml',
    'experience.yaml',
    'education.yaml',
    'tech_stack.yaml',
    'fun_facts.yaml',
    'journey.yaml'
  ];

  const configs: Record<string, unknown> = {};

  yamlFiles.forEach((file) => {
    const filePath = path.join(configDir, file);

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContent);

      const key = file.replace('.yaml', '');
      configs[key] = data;
    }
  });

  return configs;
}

// Create system prompt with all profile information
function createSystemPrompt(configs: Record<string, unknown>) {
  const introConfig = configs.intro as
    | { contact?: { email?: string } }
    | undefined;

  const email =
    introConfig?.contact?.email ||
    'niharsakhreliya4@gmail.com';

  return `You are a helpful AI assistant representing Nihar Sakhreliya's professional portfolio website.

Your role is to answer questions about Nihar's background, experience, skills, and projects.

Here is Nihar's complete profile information:

${JSON.stringify(configs, null, 2)}

Guidelines:
- Be friendly, professional, and helpful
- Answer questions based on the profile information provided
- If asked about something not in the profile, politely say you don't have that information
- Keep responses concise and relevant
- You can elaborate on experiences, education, or projects when asked
- If recruiters ask about availability or contact, refer them to the email: ${email}
`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      );
    }

    const configs = loadYamlConfigs();
    const systemPrompt = createSystemPrompt(configs);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const conversation = messages
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role}: ${msg.content}`
      )
      .join('\n');

    const prompt = `
${systemPrompt}

Conversation:
${conversation}

Respond as Nihar's portfolio assistant.
`;

    const result = await model.generateContent(prompt);

    const assistantMessage =
      result.response.text() ||
      'Sorry, I could not generate a response.';

    return NextResponse.json({
      message: assistantMessage
    });
  } catch (error) {
    console.error('Gemini API Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error'
      },
      {
        status: 500
      }
    );
  }
}
