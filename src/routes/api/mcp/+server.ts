import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMCPTools, getAITools } from '$lib/tools-registry';

// MCP Server Info endpoint
// Returns server capabilities and metadata
export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = url.origin;

	return json({
		name: 'greatai-dev-tools',
		version: '1.0.0',
		description: 'AI developer tools from greatai.dev - code simplification, explanation, prompt optimization, and more',
		vendor: 'greatai.dev',
		homepage: baseUrl,
		documentation: `${baseUrl}/tools`,
		capabilities: {
			tools: true,
			resources: false,
			prompts: false
		},
		tools: getMCPTools(),
		endpoints: {
			tools: `${baseUrl}/api/mcp/tools`,
			invoke: `${baseUrl}/api/mcp/invoke`
		},
		rateLimit: {
			requestsPerHour: 5,
			note: 'AI-powered tools are rate-limited to 5 requests per hour per IP'
		},
		contact: {
			website: baseUrl,
			github: 'https://github.com/alprimak/greatai-dev'
		}
	}, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
};
