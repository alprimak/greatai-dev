import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getToolBySlug } from '$lib/tools-registry';

// Invoke a tool by name
// This endpoint proxies requests to the actual tool endpoints
export const POST: RequestHandler = async ({ request, fetch }) => {
	try {
		const body = await request.json();
		const { tool, arguments: args } = body;

		if (!tool) {
			return json({ error: 'Missing tool name' }, { status: 400 });
		}

		const toolDef = getToolBySlug(tool);
		if (!toolDef) {
			return json({ error: `Unknown tool: ${tool}` }, { status: 404 });
		}

		if (!toolDef.endpoint) {
			return json({
				error: `Tool ${tool} is a client-side utility and cannot be invoked via API`
			}, { status: 400 });
		}

		// Forward the request to the actual tool endpoint
		const response = await fetch(toolDef.endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Forwarded-For': request.headers.get('x-forwarded-for') || 'mcp-client'
			},
			body: JSON.stringify(args)
		});

		const result = await response.json();

		if (!response.ok) {
			return json({
				error: result.error || 'Tool invocation failed',
				status: response.status
			}, {
				status: response.status,
				headers: {
					'Access-Control-Allow-Origin': '*'
				}
			});
		}

		return json({
			tool,
			result,
			success: true
		}, {
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (error) {
		console.error('MCP invoke error:', error);
		return json({
			error: 'Failed to invoke tool',
			details: error instanceof Error ? error.message : 'Unknown error'
		}, {
			status: 500,
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
};
