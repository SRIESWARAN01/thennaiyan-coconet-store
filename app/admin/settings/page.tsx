import { getSettings } from "@/lib/queries";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <span className="eyebrow">Configuration</span>
        <h1
          className="mt-2 font-display text-display-md text-leaf-deep"
          style={{ fontVariationSettings: "'SOFT' 60, 'opsz' 40" }}
        >
          Store settings
        </h1>
        <p className="mt-2 font-body text-sm text-shell">
          These values feed the storefront — the WhatsApp ordering number, the
          contact page, and the registration details on the story page.
        </p>
      </header>

      <SettingsForm settings={settings} />
    </div>
  );
}
