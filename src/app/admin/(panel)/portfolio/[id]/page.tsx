import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { services } from "@/content/services";
import { savePortfolioItem } from "@/app/admin/actions/content";
import { AdminHeader } from "@/components/admin/ui";
import {
  AdminForm,
  CheckboxField,
  CheckboxGroup,
  FormSection,
  GalleryField,
  ImageField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/forms";

export const metadata: Metadata = { title: "Edit case study" };

export default async function EditPortfolioPage(props: PageProps<"/admin/portfolio/[id]">) {
  const { id } = await props.params;
  const isNew = id === "new";
  const item = isNew ? null : await db.portfolioItem.findUnique({ where: { id } });
  if (!isNew && !item) notFound();

  return (
    <>
      <AdminHeader title={isNew ? "New case study" : "Edit case study"} description={item?.title} />
      <AdminForm
        action={savePortfolioItem.bind(null, item?.id ?? null)}
        cancelHref="/admin/portfolio"
        submitLabel={isNew ? "Create case study" : "Save changes"}
      >
        <FormSection title="Basics">
          <TextField name="title" label="Title" defaultValue={item?.title} required wide />
          <TextField
            name="slug"
            label="URL slug"
            defaultValue={item?.slug}
            hint="Leave empty to create it from the title. Example: clinic-booking-app"
          />
          <SelectField
            name="category"
            label="Filter category"
            defaultValue={item?.category ?? "web"}
            options={[
              { value: "web", label: "Web" },
              { value: "mobile", label: "Mobile" },
              { value: "ai", label: "AI" },
              { value: "other", label: "Other" },
            ]}
          />
          <TextField name="client" label="Client" defaultValue={item?.client} required />
          <TextField name="industry" label="Industry" defaultValue={item?.industry} required />
          <TextField name="country" label="Country" defaultValue={item?.country} required />
          <CheckboxGroup
            name="services"
            legend="Related services"
            options={services.map((s) => ({ value: s.slug, label: s.title }))}
            defaultValues={item?.services ?? []}
          />
          <CheckboxField
            name="published"
            label="Published"
            hint="Untick to hide it from the website."
            defaultChecked={item?.published ?? true}
          />
        </FormSection>

        <FormSection title="Story">
          <TextAreaField
            name="summary"
            label="Summary"
            defaultValue={item?.summary}
            rows={2}
            required
            hint="One sentence shown under the title."
          />
          <TextAreaField name="problem" label="Problem" defaultValue={item?.problem} required />
          <TextAreaField name="solution" label="Solution" defaultValue={item?.solution} required />
          <TextField
            name="result"
            label="Main result (shown on cards)"
            defaultValue={item?.result}
            required
            wide
          />
          <TextAreaField
            name="results"
            label="Results list"
            defaultValue={item?.results.join("\n")}
            hint="One result per line."
          />
          <TextField
            name="tech"
            label="Tech used"
            defaultValue={item?.tech.join(", ")}
            hint="Comma separated, e.g. Next.js, Stripe, PostgreSQL"
            wide
          />
        </FormSection>

        <FormSection title="Images">
          <ImageField name="coverImage" label="Cover image" defaultValue={item?.coverImage} />
          <GalleryField name="gallery" label="Gallery" defaultValue={item?.gallery ?? []} />
        </FormSection>

        <FormSection title="Client testimonial (optional)">
          <TextAreaField
            name="testimonialQuote"
            label="Quote"
            defaultValue={item?.testimonialQuote ?? ""}
            rows={3}
          />
          <TextField name="testimonialName" label="Name" defaultValue={item?.testimonialName ?? ""} />
          <TextField
            name="testimonialRole"
            label="Role and company"
            defaultValue={item?.testimonialRole ?? ""}
          />
        </FormSection>
      </AdminForm>
    </>
  );
}
