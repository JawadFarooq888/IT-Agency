import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Paperclip, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { statusLabels, statusOrder } from "@/lib/leads";
import { whatsappUrl } from "@/lib/utils";
import { site } from "@/content/site";
import { deleteLead, deleteLeadNote } from "@/app/admin/actions/leads";
import { buttonClasses } from "@/components/ui/button-styles";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { ConfirmSubmit, LeadStatusPicker, NoteForm } from "@/components/admin/LeadControls";
import { formatDateTime } from "@/components/admin/format";

export const metadata: Metadata = { title: "Lead" };

export default async function LeadDetailPage(props: PageProps<"/admin/leads/[id]">) {
  const { id } = await props.params;
  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, email: true } } } },
    },
  });
  if (!lead) notFound();

  const firstName = lead.fullName.split(" ")[0];
  const phoneDigits = lead.phone?.replace(/\D/g, "");
  const utm = [
    ["Source", lead.utmSource],
    ["Medium", lead.utmMedium],
    ["Campaign", lead.utmCampaign],
    ["Term", lead.utmTerm],
    ["Content", lead.utmContent],
  ].filter(([, v]) => v);

  const facts: [string, React.ReactNode][] = [
    [
      "Email",
      <a key="e" href={`mailto:${lead.email}`} className="text-accent hover:underline">
        {lead.email}
      </a>,
    ],
    ["Phone / WhatsApp", lead.phone],
    ["Company", lead.company],
    ["Service", lead.service],
    ["Budget", lead.budget],
    ["Timeline", lead.timeline],
    ["Received", formatDateTime(lead.createdAt)],
    ["Source page", lead.sourcePage],
    ["Referrer", lead.referrer],
  ];

  return (
    <>
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-muted hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> All leads
      </Link>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">{lead.fullName}</h1>
          <p className="mt-1 text-[15px] text-muted">
            {lead.service} · {lead.budget ?? "No budget given"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {phoneDigits && (
            <a
              href={whatsappUrl(
                phoneDigits,
                `Hi ${firstName}, thanks for contacting ${site.name} about ${lead.service}. `,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("whatsapp", "sm")}
            >
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          )}
          <a
            href={`mailto:${lead.email}?subject=${encodeURIComponent(`Your ${lead.service} project`)}`}
            className={buttonClasses("primary", "sm")}
          >
            <Mail aria-hidden="true" className="size-4" /> Email
          </a>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <section className="card p-6" aria-labelledby="status-title">
            <h2 id="status-title" className="heading-3 mb-4">
              Status
            </h2>
            <LeadStatusPicker
              leadId={lead.id}
              status={lead.status}
              options={statusOrder.map((s) => ({ value: s, label: statusLabels[s] }))}
            />
          </section>

          <section className="card p-6" aria-labelledby="details-title">
            <h2 id="details-title" className="heading-3">
              Project details
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap text-ink">{lead.details}</p>
            {lead.attachmentUrl && (
              <a
                href={lead.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("outline", "sm", "mt-5")}
              >
                <Paperclip aria-hidden="true" className="size-4" /> {lead.attachmentName ?? "Attachment"}
              </a>
            )}
          </section>

          <section className="card p-6" aria-labelledby="notes-title">
            <h2 id="notes-title" className="heading-3 mb-4">
              Private notes
            </h2>
            <NoteForm leadId={lead.id} />
            {lead.notes.length > 0 && (
              <ul className="mt-6 space-y-3">
                {lead.notes.map((n) => (
                  <li key={n.id} className="rounded-card-sm border border-line bg-canvas p-4">
                    <p className="text-[15px] whitespace-pre-wrap text-ink">{n.body}</p>
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
                      <span>
                        {n.author?.name ?? n.author?.email ?? "Admin"} · {formatDateTime(n.createdAt)}
                      </span>
                      <form action={deleteLeadNote.bind(null, n.id, lead.id)}>
                        <ConfirmSubmit
                          message="Delete this note?"
                          aria-label="Delete note"
                          className="grid size-9 place-items-center rounded-lg hover:bg-card hover:text-red-700"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="card p-6" aria-labelledby="info-title">
            <h2 id="info-title" className="heading-3">
              Contact and source
            </h2>
            <dl className="mt-4 space-y-3 text-[15px]">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="break-words text-ink">{v}</dd>
                  </div>
                ))}
              {utm.length > 0 && (
                <div>
                  <dt className="text-sm text-muted">UTM tags</dt>
                  <dd className="text-ink">{utm.map(([k, v]) => `${k}: ${v}`).join(" · ")}</dd>
                </div>
              )}
            </dl>
          </section>
          <form action={deleteLead.bind(null, lead.id)} className="card p-6">
            <h2 className="heading-3">Delete lead</h2>
            <p className="mt-1 text-sm text-muted">Removes the lead and its notes for good.</p>
            <ConfirmSubmit
              message={`Delete the lead from ${lead.fullName}? This cannot be undone.`}
              className={buttonClasses("outline", "sm", "mt-4 text-red-700")}
            >
              <Trash2 aria-hidden="true" className="size-4" /> Delete lead
            </ConfirmSubmit>
          </form>
        </aside>
      </div>
    </>
  );
}
