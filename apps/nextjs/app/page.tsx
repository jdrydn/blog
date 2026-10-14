export default function IndexPage() {
  return (
    <main style={{ textAlign: 'center' }}>
      <img src="/logo.png" alt="Logo" width={160} height={160} />
      <h1>Hello world!</h1>
      <p>Served by Next.js.</p>
      <p>
        <a href="/api" style={{ color: '#0969da' }}>
          GET /api
        </a>
      </p>
    </main>
  );
}
