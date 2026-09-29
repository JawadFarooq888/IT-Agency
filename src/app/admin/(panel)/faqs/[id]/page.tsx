import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { saveFaq } from "@/app/admin/actions/content";
import { AdminHeader } from "@/components/admin/ui";
import { AdminForm, CheckboxField, FormSection, TextAreaField, TextField } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Edit FAQ" };

export default async function EditFaqPage(props: PageProps<"/admin/faqs/[id]">) {
  const { id } = await props.params;
  const isNew = id === "new";
  const f = isNew ? null : await db.faq.findUnique({ where: { id } });
  if (!isNew && !f) notFound();

  return (
    <>
      <AdminHeader title={isNew ? "New FAQ" : "Edit FAQ"} />
      <AdminForm action={saveFaq.bind(null, f?.id ?? null)} cancelHref="/admin/faqs">
        <FormSection title="Question and answer">
          <TextField name="question" label="Question" defaultValue={f?.question} required wide />
          <TextAreaField name="answer" label="Answer" defaultValue={f?.answer} rows={5} required />
          <CheckboxField name="published" label="Published" defaultChecked={f?.published ?? true} />
        </FormSection>
      </AdminForm>
    </>
  );
}
