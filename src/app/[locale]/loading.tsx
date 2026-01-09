export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-sea-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-mint">Loading...</p>
      </div>
    </main>
  );
}
