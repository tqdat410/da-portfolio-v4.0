import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Hero");

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <p className="text-emerald mb-2">{t("greeting")}</p>
        <h1 className="text-5xl md:text-7xl font-bold text-light-mint mb-4">{t("name")}</h1>
        <p className="text-xl text-mint">{t("role")}</p>
        <p className="mt-6 text-forest-dark text-sm">{t("description")}</p>
        <div className="mt-8">
          <button
            className="inline-block px-6 py-3 bg-sea-green text-light-mint rounded-lg hover:bg-emerald transition-colors cursor-default opacity-70"
            disabled
            aria-label={t("cta")}
          >
            {t("cta")}
          </button>
        </div>
      </div>
    </main>
  );
}
