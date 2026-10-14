export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ message: 'Hello world', framework: 'nextjs', time: new Date().toISOString() });
}
