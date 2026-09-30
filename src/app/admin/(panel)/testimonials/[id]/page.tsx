import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { saveTestimonial } from "@/app/admin/actions/content";
import { AdminHeader } from "@/components/admin/ui";
import { AdminForm, CheckboxField, FormSection, TextAreaField, TextField } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Edit testimonial" };

export default async function EditTestimonialPage(props: PageProps<"/admin/testimonials/[id]">) {
  const { id } = await props.params;
  const isNew = id === "new";
  const t = isNew ? null : await db.testimonial.findUnique({ where: { id } });
  if (!isNew && !t) notFound();

  return (
    <>
      <AdminHeader title={isNew ? "New testimonial" : "Edit testimonial"} />
      <AdminForm action={saveTestimonial.bind(null, t?.id ?? null)} cancelHref="/admin/testimonials">
        <FormSection title="Testimonial">
          <TextAreaField
            name="quote"
            label="Quote"
            defaultValue={t?.quote}
            rows={4}
            required
            hint="Use the client's real words, with their permission."
          />
          <TextField name="name" label="Name" defaultValue={t?.name} required />
          <TextField name="role" label="Role" defaultValue={t?.role} required />
          <TextField name="company" label="Company" defaultValue={t?.company} required />
          <TextField name="country" label="Country" defaultValue={t?.country} required />
          <CheckboxField name="published" label="Published" defaultChecked={t?.published ?? true} />
        </FormSection>
      </AdminForm>
    </>
  );
}
