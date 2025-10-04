export async function GET() {
  return Response.json({ message: 'Simple API working' });
}

export async function POST() {
  return Response.json({ message: 'Simple POST working' });
}
