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
				const encoder = new TextEncoder();
				const ts = new TransformStream();
				const writer = ts.writable.getWriter();
				await writer.write(encoder.encode(': connected\n\n'));

				(globalThis as any).__reloadClients ??= new Set();
				const clients: Set<any> = (globalThis as any).__reloadClients;
				const clientRef = { writer, ping: 0 } as { writer: WritableStreamDefaultWriter<Uint8Array>; ping: number };
				clientRef.ping = setInterval(() => {
					writer.write(encoder.encode(': ping\n\n')).catch(() => {});
				}, 25000) as unknown as number;
				clients.add(clientRef);

				ctx.waitUntil(
					writer.closed.finally(() => {
						try { clearInterval(clientRef.ping as unknown as number); } catch {}
						try { clients.delete(clientRef); } catch {}
					})
				);

				return new Response(ts.readable, {
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
				const encoder = new TextEncoder();
				const clients: Set<any> = (globalThis as any).__reloadClients || new Set();
				for (const client of clients) {
					try {
						await client.writer.write(encoder.encode('data: reload\n\n'));
					} catch (e) {
						try { clients.delete(client); } catch {}
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
