import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { saveSettings } from "@/app/admin/actions/content";
import { AdminHeader } from "@/components/admin/ui";
import { AdminForm, FormSection, TextField } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const s = await getSiteSettings();
  return (
    <>
      <AdminHeader
        title="Settings"
        description="Contact details, social links and stats shown across the website."
      />
      <AdminForm action={saveSettings} submitLabel="Save settings">
        <FormSection title="Contact">
          <TextField
            name="whatsappNumber"
            label="WhatsApp number (for links)"
            defaultValue={s.whatsappNumber}
            required
            hint="Digits only with country code, e.g. 923001234567"
          />
          <TextField
            name="whatsappDisplay"
            label="WhatsApp number (as shown)"
            defaultValue={s.whatsappDisplay}
            required
            hint="e.g. +92 300 1234567"
          />
          <TextField name="email" label="Email" type="email" defaultValue={s.email} required />
          <TextField name="location" label="Location" defaultValue={s.location} required />
          <TextField
            name="mapQuery"
            label="Map search"
            defaultValue={s.mapQuery}
            required
            hint="What Google Maps should show, e.g. Gulberg, Lahore, Pakistan"
          />
          <TextField
            name="countriesLabel"
            label="Countries line"
            defaultValue={s.countriesLabel}
            required
            wide
            hint='Used in "Trusted by clients in ..."'
          />
        </FormSection>
        <FormSection title="Social links">
          <TextField name="social.linkedin" label="LinkedIn" type="url" defaultValue={s.social.linkedin} />
          <TextField name="social.facebook" label="Facebook" type="url" defaultValue={s.social.facebook} />
          <TextField name="social.instagram" label="Instagram" type="url" defaultValue={s.social.instagram} />
          <TextField name="social.upwork" label="Upwork" type="url" defaultValue={s.social.upwork} />
        </FormSection>
        <FormSection title="Stats in the hero">
          <TextField
            name="stats.projects"
            label="Projects delivered"
            defaultValue={s.stats.projects}
            required
          />
          <TextField name="stats.rating" label="Upwork rating" defaultValue={s.stats.rating} required />
          <TextField name="stats.replyTime" label="Reply time" defaultValue={s.stats.replyTime} required />
        </FormSection>
      </AdminForm>
    </>
  );
}
