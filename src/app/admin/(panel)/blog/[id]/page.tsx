import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { saveBlogPost } from "@/app/admin/actions/content";
import { AdminHeader } from "@/components/admin/ui";
import {
  AdminForm,
  FormSection,
  ImageField,
  MarkdownField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/forms";

export const metadata: Metadata = { title: "Edit post" };

export default async function EditBlogPostPage(props: PageProps<"/admin/blog/[id]">) {
  const { id } = await props.params;
  const isNew = id === "new";
  const [post, categories] = await Promise.all([
    isNew ? null : db.blogPost.findUnique({ where: { id }, include: { category: true } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!isNew && !post) notFound();

  return (
    <>
      <AdminHeader title={isNew ? "New post" : "Edit post"} description={post?.title} />
      <AdminForm
        action={saveBlogPost.bind(null, post?.id ?? null)}
        cancelHref="/admin/blog"
        submitLabel={isNew ? "Create post" : "Save post"}
      >
        <FormSection title="Post">
          <TextField name="title" label="Title" defaultValue={post?.title} required wide />
          <TextField
            name="slug"
            label="URL slug"
            defaultValue={post?.slug}
            hint="Leave empty to create it from the title."
          />
          <TextField name="authorName" label="Author" defaultValue={post?.authorName} required />
          <div>
            <TextField
              name="category"
              list="blog-categories"
              label="Category"
              defaultValue={post?.category?.name ?? ""}
              hint="Pick an existing one or type a new name."
            />
            <datalist id="blog-categories">
              {categories.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>
          <SelectField
            name="status"
            label="Status"
            defaultValue={post?.status ?? "DRAFT"}
            options={[
              { value: "DRAFT", label: "Draft (not visible)" },
              { value: "PUBLISHED", label: "Published" },
            ]}
          />
          <TextField
            name="publishedAt"
            label="Publish date"
            type="date"
            defaultValue={post?.publishedAt?.toISOString().slice(0, 10)}
            hint="Empty = today when published. A future date schedules the post."
          />
          <TextAreaField
            name="excerpt"
            label="Excerpt"
            defaultValue={post?.excerpt}
            rows={2}
            required
            hint="One or two sentences shown on blog cards."
          />
          <ImageField name="coverImage" label="Cover image" defaultValue={post?.coverImage} />
        </FormSection>

        <FormSection title="Content">
          <MarkdownField name="content" label="Article" defaultValue={post?.content} />
        </FormSection>

        <FormSection title="SEO">
          <TextField
            name="seoTitle"
            label="SEO title"
            defaultValue={post?.seoTitle ?? ""}
            hint="Optional. Up to 70 characters. Defaults to the title."
            wide
          />
          <TextAreaField
            name="seoDescription"
            label="SEO description"
            defaultValue={post?.seoDescription ?? ""}
            rows={2}
            hint="Optional. Up to 170 characters. Defaults to the excerpt."
          />
        </FormSection>
      </AdminForm>
    </>
  );
}
