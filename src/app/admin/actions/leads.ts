"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/auth";
import { db } from "@/lib/db";
import type { FormState } from "@/lib/admin";
import { LeadStatus } from "@/generated/prisma/enums";

const statusSchema = z.enum(LeadStatus);

export async function updateLeadStatus(leadId: string, status: string): Promise<FormState> {
  await requireAdmin();
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { error: "Invalid status" };
  await db.lead.update({ where: { id: leadId }, data: { status: parsed.data } });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Status updated" };
}

export async function addLeadNote(leadId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireAdmin();
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 1) return { error: "Write a note first." };
  if (body.length > 5000) return { error: "Notes can be up to 5000 characters." };
  await db.leadNote.create({ data: { leadId, body, authorId: user.id } });
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true, message: "Note added" };
}

export async function deleteLeadNote(noteId: string, leadId: string): Promise<void> {
  await requireAdmin();
  await db.leadNote.delete({ where: { id: noteId } });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(leadId: string): Promise<void> {
  await requireAdmin();
  await db.lead.delete({ where: { id: leadId } });
  revalidatePath("/admin", "layout");
  redirect("/admin/leads");
}
