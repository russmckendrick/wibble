/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		switch (url.pathname) {
			case '/__reload': {
				// Server-Sent Events stream for local dev autoreload
				const stream = new ReadableStream({
					start(controller) {
						(globalThis as any).__sseClients ??= new Set();
						(globalThis as any).__sseClients.add(controller);
						controller.enqueue(new TextEncoder().encode(': connected\n\n'));
					},
					cancel() {
						try {
							// Best-effort cleanup
							const set: Set<any> = (globalThis as any).__sseClients;
							if (set) {
								for (const c of Array.from(set)) {
									try { c.close?.(); } catch {}
								}
							}
						} catch {}
					}
				});
				return new Response(stream, {
					headers: {
						'Content-Type': 'text/event-stream',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive'
					}
				});
			}
			case '/__reload-trigger': {
				if (request.method !== 'POST') {
					return new Response('Method Not Allowed', { status: 405 });
				}
				// Broadcast a reload event to all connected clients (dev-only)
				const clients: Set<any> = (globalThis as any).__sseClients || new Set();
				for (const controller of clients) {
					try {
						controller.enqueue(new TextEncoder().encode('data: reload\n\n'));
					} catch (e) {
						try { clients.delete(controller); } catch {}
					}
				}
				return new Response('ok');
			}
			case '/message':
				return new Response('Hello, World!');
			case '/random':
				return new Response(crypto.randomUUID());
			default:
				return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
