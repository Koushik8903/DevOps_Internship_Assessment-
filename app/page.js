export default function Page() {
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Next.js on Kubernetes (Minikube)</h1>
        <p>Dockerized and pushed to GHCR via GitHub Actions.</p>
        <p>Health checks at / on port 3000.</p>
      </div>
    </main>
  );
}
