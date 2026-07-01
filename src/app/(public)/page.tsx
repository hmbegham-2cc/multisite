export default function HomePage() {
  return (
    <main className="public-shell">
      <section className="public-panel">
        <p className="public-eyebrow">Usine a sites</p>
        <h1 className="public-title">Fondation Payload + Next.js</h1>
        <p className="public-copy">
          Le back-office sera disponible sur <a className="public-link" href="/admin">/admin</a> apres
          configuration de PostgreSQL et lancement du serveur.
        </p>
      </section>
    </main>
  )
}
