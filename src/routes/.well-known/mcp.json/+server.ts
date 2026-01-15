import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllTools, toMCPTool } from '$lib/tools-registry';

// .well-known/mcp.json - Standard MCP discovery endpoint
// This allows AI agents to discover available tools at a well-known location
export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = url.origin;
	const allTools = getAllTools();

	// Include all tools with invocable flag
	const tools = allTools.map(tool => ({
		...toMCPTool(tool),
		invocable: !!tool.endpoint,
		category: tool.category,
		url: `${baseUrl}/tools/${tool.slug}`,
		rateLimit: tool.rateLimit
	}));

	return json({
		schema_version: '1.0',
		name: 'greatai-dev-tools',
		description: 'AI developer tools - code simplification, explanation, prompt optimization, regex testing, and more',
		version: '1.0.0',
		vendor: {
			name: 'greatai.dev',
			url: baseUrl
		},
		server: {
			type: 'http',
			url: `${baseUrl}/api/mcp`
		},
		capabilities: {
			tools: {
				supported: true,
				list_endpoint: `${baseUrl}/api/mcp/tools`,
				invoke_endpoint: `${baseUrl}/api/mcp/invoke`
			},
			resources: {
				supported: false
			},
			prompts: {
				supported: false
			}
		},
		tools,
		summary: {
			total: allTools.length,
			apiInvocable: allTools.filter(t => t.endpoint).length,
			browserOnly: allTools.filter(t => !t.endpoint).length
		},
		authentication: {
			type: 'none',
			note: 'Rate limited to 5 requests/hour per IP for AI-powered tools. Browser-only tools have no rate limit.'
		}
	}, {
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
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
