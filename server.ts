import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { HUB_GROUNDING_CONTEXT } from './server/hubContext.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const MODEL_NAME = 'gemini-4-hydrogen';

interface ChatTurn {
  role: 'user' | 'assistant';
  text: string;
}

interface AnalyzeRequestBody {
  message?: string;
  history?: ChatTurn[];
  activeContext?: {
    page?: string;
    datasetId?: string;
  };
}

interface ContributionPayload {
  pathway?: string;
  title?: string;
  subDistrict?: string;
  dataType?: string;
  format?: string;
  accessLevel?: string;
  sourceLabel?: string;
  ownerContributor?: string;
  summary?: string;
  sampleRows?: Array<Record<string, string | number>>;
  consentAccepted?: boolean;
}

interface ContributedDatasetRecord {
  id: string;
  title: string;
  shortSummary: string;
  fullDescription: string;
  category: string;
  dataType: string;
  sourceLabel: string;
  sourceCategory: string;
  ownerContributor: string;
  collectionMethod: string;
  collectedDate: string;
  lastUpdated: string;
  verificationDate: string;
  verificationNote: string;
  accessLevel: string;
  permittedUse: string;
  howToUse: string;
  usageNotes: string;
  recordCountLabel: string;
  subDistrict: string;
  relatedIds: string[];
  tablePreview?: {
    columns: string[];
    rows: Array<Record<string, string | number>>;
  };
  textPreview?: Array<{
    id: string;
    date: string;
    area: string;
    note: string;
    contributorType: string;
  }>;
}

const inMemoryContributions: ContributedDatasetRecord[] = [];

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, model: MODEL_NAME });
  });

  app.get('/api/contributions', (_req: Request, res: Response) => {
    res.json({
      count: inMemoryContributions.length,
      storage: 'in-memory-demo-session',
      items: inMemoryContributions,
    });
  });

  app.post('/api/contributions', (req: Request, res: Response) => {
    const body = (req.body || {}) as ContributionPayload;
    const title = typeof body.title === 'string' ? body.title.trim() : '';

    if (!title) {
      res.status(400).json({
        error: 'Validation error: "title" is required.',
      });
      return;
    }

    if (body.consentAccepted !== true) {
      res.status(400).json({
        error:
          'Governance check failed: "consentAccepted" must be true to confirm permission to share and PDPA compliance.',
      });
      return;
    }

    const allowedAccess = ['Open', 'Members only', 'Restricted'];
    const accessLevel =
      typeof body.accessLevel === 'string' && allowedAccess.includes(body.accessLevel)
        ? body.accessLevel
        : 'Open';

    const allowedTypes = [
      'Statistics',
      'Photos',
      'Video',
      'Text & Feedback',
      'Directory data',
      'Report / document',
    ];
    const dataType =
      typeof body.dataType === 'string' && allowedTypes.includes(body.dataType)
        ? body.dataType
        : 'Directory data';

    const pathway =
      typeof body.pathway === 'string' && body.pathway.trim()
        ? body.pathway.trim()
        : 'API Integration';

    const subDistrict =
      typeof body.subDistrict === 'string' && body.subDistrict.trim()
        ? body.subDistrict.trim()
        : 'Mae Sai';

    const summary =
      typeof body.summary === 'string' && body.summary.trim()
        ? body.summary.trim()
        : `Contributed via ${pathway} (${body.format || 'JSON payload'}) for ${subDistrict}.`;

    const today = new Date().toISOString().slice(0, 10);
    const id = `api-${Date.now().toString(36)}`;

    const validRows = Array.isArray(body.sampleRows)
      ? body.sampleRows.filter(
          (row): row is Record<string, string | number> =>
            Boolean(row) && typeof row === 'object' && !Array.isArray(row)
        )
      : [];

    const columns =
      validRows.length > 0 ? Object.keys(validRows[0]).slice(0, 6) : [];

    const sourceCategoryMap: Record<string, string> = {
      'Government & Public Agencies': 'Public agency source',
      'Local Businesses': 'Business contribution',
      'Community Groups': 'Community contribution',
      'Visitors & Travelers': 'Visitor contribution',
    };

    const record: ContributedDatasetRecord = {
      id,
      title,
      shortSummary: summary.length > 150 ? `${summary.slice(0, 147)}...` : summary,
      fullDescription: summary,
      category: `${pathway} Contribution`,
      dataType,
      sourceLabel:
        typeof body.sourceLabel === 'string' && body.sourceLabel.trim()
          ? body.sourceLabel.trim()
          : `${pathway} — API demo contribution`,
      sourceCategory:
        sourceCategoryMap[pathway] || 'Community contribution',
      ownerContributor:
        typeof body.ownerContributor === 'string' && body.ownerContributor.trim()
          ? body.ownerContributor.trim()
          : `${pathway} Contributor (API Demo)`,
      collectionMethod: `HTTP POST /api/contributions (${body.format || 'JSON'})`,
      collectedDate: today,
      lastUpdated: today,
      verificationDate:
        accessLevel === 'Restricted'
          ? 'Restricted — steward controlled'
          : 'Pending steward review (API demo)',
      verificationNote:
        'Submitted via prototype API endpoint during active session; stored in memory only.',
      accessLevel,
      permittedUse:
        accessLevel === 'Restricted'
          ? 'Restricted — metadata only; contents withheld from public preview.'
          : accessLevel === 'Members only'
          ? 'Members only — intended for participating Mae Sai hub members.'
          : 'Openly viewable in this session catalog.',
      howToUse:
        'Contributed dynamically via the Together Mae Sai JSON API to demonstrate programmatic ingestion from local partners.',
      usageNotes:
        'Prototype in-memory submission only. Resets when the server restarts.',
      recordCountLabel:
        validRows.length > 0
          ? `${validRows.length} API-ingested rows`
          : '1 API-ingested record',
      subDistrict,
      relatedIds: ['ms-business-services-directory', 'ms-visitor-trend-snapshot'],
      ...(accessLevel !== 'Restricted' && columns.length > 0
        ? {
            tablePreview: {
              columns,
              rows: validRows.slice(0, 20),
            },
          }
        : accessLevel !== 'Restricted'
        ? {
            textPreview: [
              {
                id: `${id}-note-1`,
                date: `${today} (API Demo)`,
                area: subDistrict,
                note: summary,
                contributorType: `${pathway} via /api/contributions`,
              },
            ],
          }
        : {}),
    };

    inMemoryContributions.unshift(record);
    if (inMemoryContributions.length > 50) {
      inMemoryContributions.pop();
    }

    res.status(201).json({
      status: 'created',
      message: 'Dataset accepted into Together Mae Sai session catalog.',
      dataset: record,
    });
  });

  app.post('/api/ai/analyze', async (req: Request, res: Response) => {
    const body = (req.body || {}) as AnalyzeRequestBody;
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      res.status(400).json({ error: 'Please enter a question or analysis prompt.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Gemini API key is not configured yet. Please add GEMINI_API_KEY in the Settings > Secrets panel.',
      });
      return;
    }

    const historyLines = Array.isArray(body.history)
      ? body.history
          .slice(-6)
          .map((turn) => `${turn.role === 'user' ? 'User' : 'Analyst'}: ${turn.text}`)
          .join('\n')
      : '';

    const activePageNote = body.activeContext?.page
      ? `Current user screen: ${body.activeContext.page}${
          body.activeContext.datasetId ? ` (viewing dataset: ${body.activeContext.datasetId})` : ''
        }`
      : 'Current user screen: hub overview';

const dynamicContributionsNote =
      inMemoryContributions.length > 0
        ? `\n=== RECENTLY CONTRIBUTED DATASETS VIA /api/contributions (SESSION) ===\n${inMemoryContributions
            .map(
              (c) =>
                `- [id: ${c.id}] "${c.title}" | Type: ${c.dataType} | Access: ${c.accessLevel} | Sub-district: ${c.subDistrict} | Summary: ${c.shortSummary}`
            )
            .join('\n')}`
        : '';

    const systemInstruction = `You are the Together Mae Sai Data Analyst, an AI assistant embedded inside a civic tourism data hub prototype for Mae Sai District, Chiang Rai, Thailand.

YOUR CORE JOBS:
1. EXPLORE: Help users discover relevant datasets from the catalog (including any newly contributed session datasets), explain source provenance, update dates, and access levels (Open, Members only, Restricted).
2. ANALYZE: Compare Mae Sai sub-districts (Mae Sai, Wiang Phang Kham, Pong Pha, Ko Chang), seasonal patterns, visitor friction points, and business/community opportunities strictly grounded in the hub data below.
3. PREDICT / FORECAST: Provide clear, reasoned scenario estimates or projections (e.g., seasonal shifts, morning-to-afternoon traffic redistribution, monsoon readiness, business planning) derived from the hub's demo indices.

STRICT RULES:
- Base your answers on the hub data provided below. If something is outside the hub data, say so honestly instead of inventing Mae Sai statistics.
- Clearly note that figures and forecasts come from illustrative demo data ("Demo data — illustrative projection"), never claiming official government statistics.
- For Restricted datasets (ms-tourism-planning-reference, ms-accommodation-occupancy-panel, or any Restricted API dataset), NEVER fabricate or expose hidden contents; explain that only metadata is available.
- Keep your language concise, plain, practical, and tailored to Mae Sai local businesses, community groups, agencies, or visitors. Respond in the same language the user writes in (English or Thai).
- Always recommend valid dataset IDs from the catalog list when relevant.

${HUB_GROUNDING_CONTEXT}${dynamicContributionsNote}`;

    const promptText = [
      activePageNote,
      historyLines ? `Recent conversation:\n${historyLines}` : '',
      `User request: ${message}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysisMode: {
                type: Type.STRING,
                description: 'One of: explore, analyze, predict',
              },
              answer: {
                type: Type.STRING,
                description:
                  'Clear, concise plain-language answer grounded in the Mae Sai hub data, including an explicit demo-data reminder when quoting numbers or projections.',
              },
              keyTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 4 crisp bullet findings, predictions, or recommended local actions.',
              },
              recommendedDatasetIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Up to 3 matching dataset IDs from the 12 catalog datasets (e.g. ms-visitor-trend-snapshot, ms-doi-pha-hee-trail-log).',
              },
              followUpPrompts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 short suggested follow-up questions for the user.',
              },
            },
            required: [
              'analysisMode',
              'answer',
              'keyTakeaways',
              'recommendedDatasetIds',
              'followUpPrompts',
            ],
          },
        },
      });

      const rawJson = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawJson);

      res.json({
        model: MODEL_NAME,
        analysisMode: parsed.analysisMode || 'analyze',
        answer: parsed.answer || 'No analysis returned.',
        keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
        recommendedDatasetIds: Array.isArray(parsed.recommendedDatasetIds)
          ? parsed.recommendedDatasetIds
          : [],
        followUpPrompts: Array.isArray(parsed.followUpPrompts)
          ? parsed.followUpPrompts
          : [],
      });
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error ? err.message : 'Unexpected error calling Gemini API.';
      console.error('Gemini API error:', errMessage);

      const status =
        errMessage.includes('403') || errMessage.includes('PERMISSION_DENIED')
          ? 403
          : errMessage.includes('429') || errMessage.includes('RESOURCE_EXHAUSTED')
          ? 429
          : 500;

      res.status(status).json({
        error:
          status === 403
            ? 'Gemini API permission denied. Please verify your GEMINI_API_KEY in Settings > Secrets.'
            : status === 429
            ? 'Gemini API rate limit reached. Please wait a moment and try again.'
            : `Unable to complete AI analysis right now: ${errMessage}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Together Mae Sai server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
