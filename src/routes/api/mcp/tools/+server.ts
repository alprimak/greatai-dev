import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMCPTools, getAllTools } from '$lib/tools-registry';

// List all available tools in MCP format
export const GET: RequestHandler = async ({ url }) => {
	const format = url.searchParams.get('format') || 'mcp';
	const baseUrl = url.origin;

	if (format === 'full') {
		// Return full tool details including UI info
		const tools = getAllTools().map(tool => ({
			...tool,
			url: `${baseUrl}/tools/${tool.slug}`,
			apiEndpoint: tool.endpoint ? `${baseUrl}${tool.endpoint}` : null
		}));

		return json({ tools }, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	}

	// Default: MCP format (only AI-powered tools with schemas)
	return json({
		tools: getMCPTools()
	}, {
		headers: {
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
