export const metadata = {
  title: 'Next.js + Docker + GHCR + Minikube',
  description: 'Simple Next.js app for Kubernetes demo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial, sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
