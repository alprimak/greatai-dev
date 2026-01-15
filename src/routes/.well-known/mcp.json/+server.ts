import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMCPTools } from '$lib/tools-registry';

// .well-known/mcp.json - Standard MCP discovery endpoint
// This allows AI agents to discover available tools at a well-known location
export const GET: RequestHandler = async ({ url }) => {
	const baseUrl = url.origin;

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
		tools: getMCPTools(),
		authentication: {
			type: 'none',
			note: 'Rate limited to 5 requests/hour per IP for AI-powered tools'
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
