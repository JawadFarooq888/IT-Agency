import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { saveTeamMember } from "@/app/admin/actions/content";
import { AdminHeader } from "@/components/admin/ui";
import {
  AdminForm,
  CheckboxField,
  FormSection,
  ImageField,
  TextAreaField,
  TextField,
} from "@/components/admin/forms";

export const metadata: Metadata = { title: "Edit team member" };

export default async function EditTeamMemberPage(props: PageProps<"/admin/team/[id]">) {
  const { id } = await props.params;
  const isNew = id === "new";
  const m = isNew ? null : await db.teamMember.findUnique({ where: { id } });
  if (!isNew && !m) notFound();

  return (
    <>
      <AdminHeader title={isNew ? "New team member" : `Edit ${m?.name}`} />
      <AdminForm action={saveTeamMember.bind(null, m?.id ?? null)} cancelHref="/admin/team">
        <FormSection title="Profile">
          <TextField name="name" label="Full name" defaultValue={m?.name} required />
          <TextField
            name="role"
            label="Title"
            defaultValue={m?.role}
            required
            placeholder="e.g. Mobile Developer"
          />
          <ImageField
            name="photo"
            label="Photo"
            defaultValue={m?.photo}
            hint="A clear, front-facing photo. Square or portrait works best."
          />
        </FormSection>
        <FormSection title="Contact">
          <TextField
            name="email"
            label="Email"
            type="email"
            defaultValue={m?.email ?? ""}
            hint="Shown on the About page. Leave empty to hide."
          />
          <TextField
            name="phone"
            label="Phone or WhatsApp"
            type="tel"
            defaultValue={m?.phone ?? ""}
            placeholder="+92 300 1234567"
            hint="Include the country code. Leave empty to hide."
          />
        </FormSection>
        <FormSection title="About this person">
          <TextAreaField
            name="bio"
            label="Short bio"
            defaultValue={m?.bio ?? ""}
            rows={6}
            hint="Shown in the founder section. Leave a blank line between paragraphs."
          />
          <CheckboxField
            name="featured"
            label="Show as founder"
            defaultChecked={m?.featured ?? false}
            hint="Gives this person the big 'Meet the founder' section. Only one person can have it."
          />
          <CheckboxField name="published" label="Show on the website" defaultChecked={m?.published ?? true} />
        </FormSection>
      </AdminForm>
    </>
  );
}
