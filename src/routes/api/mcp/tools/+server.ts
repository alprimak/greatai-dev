import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMCPTools, getAllTools, toMCPTool } from '$lib/tools-registry';

// List all available tools in MCP format
export const GET: RequestHandler = async ({ url }) => {
	const format = url.searchParams.get('format') || 'mcp';
	const filter = url.searchParams.get('filter') || 'all'; // 'all', 'api', 'browser'
	const baseUrl = url.origin;

	if (format === 'full') {
		// Return full tool details including UI info
		let tools = getAllTools();

		if (filter === 'api') {
			tools = tools.filter(t => t.endpoint);
		} else if (filter === 'browser') {
			tools = tools.filter(t => !t.endpoint);
		}

		return json({
			tools: tools.map(tool => ({
				...tool,
				url: `${baseUrl}/tools/${tool.slug}`,
				apiEndpoint: tool.endpoint ? `${baseUrl}${tool.endpoint}` : null,
				invocable: !!tool.endpoint
			}))
		}, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	}

	// MCP format - include all tools but mark browser-only ones
	const allTools = getAllTools();
	const mcpTools = allTools.map(tool => ({
		...toMCPTool(tool),
		invocable: !!tool.endpoint,
		category: tool.category,
		url: `${baseUrl}/tools/${tool.slug}`,
		...(tool.endpoint ? { apiEndpoint: `${baseUrl}${tool.endpoint}` } : {}),
		rateLimit: tool.rateLimit
	}));

	return json({
		tools: mcpTools,
		summary: {
			total: allTools.length,
			apiInvocable: allTools.filter(t => t.endpoint).length,
			browserOnly: allTools.filter(t => !t.endpoint).length
		}
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
