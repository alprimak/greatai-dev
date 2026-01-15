// Centralized tool registry for MCP and UI
// This is the single source of truth for all tools

export interface ToolParameter {
	name: string;
	type: 'string' | 'number' | 'boolean' | 'array' | 'object';
	description: string;
	required: boolean;
	enum?: string[];
	default?: unknown;
}

export interface Tool {
	name: string;
	slug: string;
	description: string;
	longDescription: string;
	category: 'ai-powered' | 'utility';
	endpoint?: string; // API endpoint for AI-powered tools
	rateLimit: string;
	parameters?: ToolParameter[];
	icon: string;
}

export const tools: Tool[] = [
	{
		name: 'Code Simplifier',
		slug: 'code-simplifier',
		description: 'Simplify and clean up code using AI',
		longDescription: 'Paste your code and get a cleaner, more maintainable version. Analyzes code structure, removes redundancy, and suggests improvements while preserving functionality.',
		category: 'ai-powered',
		endpoint: '/tools/code-simplifier',
		rateLimit: '5 requests/hour',
		icon: 'simplify',
		parameters: [
			{
				name: 'code',
				type: 'string',
				description: 'The code to simplify',
				required: true
			},
			{
				name: 'language',
				type: 'string',
				description: 'Programming language of the code',
				required: false,
				default: 'auto-detect'
			}
		]
	},
	{
		name: 'Code Explainer',
		slug: 'code-explainer',
		description: 'Get AI-powered explanations of any code',
		longDescription: 'Understand any code snippet with detailed explanations. Choose from brief summaries, detailed breakdowns, or comprehensive line-by-line analysis.',
		category: 'ai-powered',
		endpoint: '/tools/code-explainer',
		rateLimit: '5 requests/hour',
		icon: 'explain',
		parameters: [
			{
				name: 'code',
				type: 'string',
				description: 'The code to explain',
				required: true
			},
			{
				name: 'language',
				type: 'string',
				description: 'Programming language of the code',
				required: false,
				default: 'auto-detect'
			},
			{
				name: 'depth',
				type: 'string',
				description: 'Level of detail for the explanation',
				required: false,
				enum: ['brief', 'detailed', 'line_by_line'],
				default: 'detailed'
			}
		]
	},
	{
		name: 'Prompt Optimizer',
		slug: 'prompt-optimizer',
		description: 'Improve AI prompts for better results',
		longDescription: 'Transform vague or unclear prompts into effective AI instructions. Get expert analysis of your prompt and receive an optimized version with improved clarity, structure, and effectiveness.',
		category: 'ai-powered',
		endpoint: '/tools/prompt-optimizer',
		rateLimit: '5 requests/hour',
		icon: 'optimize',
		parameters: [
			{
				name: 'prompt',
				type: 'string',
				description: 'The prompt to optimize',
				required: true
			},
			{
				name: 'goal',
				type: 'string',
				description: 'What you are trying to achieve with this prompt',
				required: false
			},
			{
				name: 'model',
				type: 'string',
				description: 'Target AI model for optimization',
				required: false,
				enum: ['Claude', 'GPT-4', 'Gemini', 'Llama', 'General'],
				default: 'Claude'
			}
		]
	},
	{
		name: 'Regex Tester',
		slug: 'regex-tester',
		description: 'Test regex patterns with AI explanations',
		longDescription: 'Test regular expressions with real-time matching and get AI-powered explanations of what your patterns do. Supports all standard regex flags.',
		category: 'ai-powered',
		endpoint: '/tools/regex-tester',
		rateLimit: '5 AI explanations/hour',
		icon: 'regex',
		parameters: [
			{
				name: 'pattern',
				type: 'string',
				description: 'The regular expression pattern',
				required: true
			},
			{
				name: 'flags',
				type: 'string',
				description: 'Regex flags (g, i, m, s)',
				required: false,
				default: 'g'
			}
		]
	},
	{
		name: 'Token Calculator',
		slug: 'token-calculator',
		description: 'Count tokens for various AI models',
		longDescription: 'Count tokens for Claude, GPT-4, and other models. Real-time counting as you type with support for multiple tokenization schemes.',
		category: 'utility',
		rateLimit: 'Unlimited',
		icon: 'tokens'
	},
	{
		name: 'JSON Formatter',
		slug: 'json-formatter',
		description: 'Format, validate, and minify JSON',
		longDescription: 'Format, validate, minify, and sort JSON with syntax highlighting. Detect errors and fix common JSON issues.',
		category: 'utility',
		rateLimit: 'Unlimited',
		icon: 'json'
	},
	{
		name: 'Base64 Encoder',
		slug: 'base64',
		description: 'Encode and decode Base64 strings',
		longDescription: 'Encode and decode Base64 strings instantly. Supports URL-safe encoding and file uploads for binary data.',
		category: 'utility',
		rateLimit: 'Unlimited',
		icon: 'base64'
	},
	{
		name: 'Timestamp Converter',
		slug: 'timestamp',
		description: 'Convert Unix timestamps to dates',
		longDescription: 'Convert Unix timestamps to human-readable dates and vice versa. Supports multiple timezones and formats including ISO 8601.',
		category: 'utility',
		rateLimit: 'Unlimited',
		icon: 'timestamp'
	}
];

// Get only AI-powered tools (tools that have API endpoints)
export function getAITools(): Tool[] {
	return tools.filter(t => t.category === 'ai-powered' && t.endpoint);
}

// Get all tools
export function getAllTools(): Tool[] {
	return tools;
}

// Get tool by slug
export function getToolBySlug(slug: string): Tool | undefined {
	return tools.find(t => t.slug === slug);
}

// Convert to MCP tool format
export function toMCPTool(tool: Tool) {
	return {
		name: tool.slug,
		description: tool.description,
		inputSchema: {
			type: 'object',
			properties: tool.parameters?.reduce((acc, param) => {
				acc[param.name] = {
					type: param.type,
					description: param.description,
					...(param.enum && { enum: param.enum }),
					...(param.default !== undefined && { default: param.default })
				};
				return acc;
			}, {} as Record<string, unknown>) || {},
			required: tool.parameters?.filter(p => p.required).map(p => p.name) || []
		}
	};
}

// Convert all AI tools to MCP format
export function getMCPTools() {
	return getAITools().map(toMCPTool);
}
