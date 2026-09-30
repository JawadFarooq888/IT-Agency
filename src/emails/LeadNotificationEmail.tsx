import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { button, colors, container, heading, main, small, text } from "./styles";

export type LeadEmailData = {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service: string;
  budget?: string | null;
  timeline?: string | null;
  details: string;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  sourcePage?: string | null;
  referrer?: string | null;
  utm?: string | null;
  whatsappReplyUrl?: string | null;
  adminUrl: string;
};

const row = { color: colors.body, fontSize: "15px", lineHeight: "1.5", margin: "0 0 6px" };
const label = { color: colors.ink, fontWeight: 600 };

/** Sent to you when a new quote request arrives. */
export function LeadNotificationEmail(lead: LeadEmailData) {
  const fields: [string, string | null | undefined][] = [
    ["Name", lead.fullName],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Company", lead.company],
    ["Service", lead.service],
    ["Budget", lead.budget],
    ["Timeline", lead.timeline],
    ["Source page", lead.sourcePage],
    ["Referrer", lead.referrer],
    ["UTM", lead.utm],
  ];

  return (
    <Html lang="en">
      <Head />
      <Preview>{`New lead: ${lead.fullName} needs ${lead.service}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading as="h1" style={heading}>
            New quote request
          </Heading>
          <Text style={text}>
            {lead.fullName} is asking about <strong>{lead.service}</strong>.
          </Text>

          <Section style={{ margin: "0 0 20px" }}>
            {lead.whatsappReplyUrl && (
              <Button href={lead.whatsappReplyUrl} style={{ ...button(colors.whatsapp), marginRight: "8px" }}>
                Reply on WhatsApp
              </Button>
            )}
            <Button href={`mailto:${lead.email}`} style={button(colors.accent)}>
              Reply by email
            </Button>
          </Section>

          <Hr style={{ borderColor: colors.line, margin: "20px 0" }} />
          {fields
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <Text key={k} style={row}>
                <span style={label}>{k}:</span> {v}
              </Text>
            ))}

          <Hr style={{ borderColor: colors.line, margin: "20px 0" }} />
          <Text style={{ ...row, fontWeight: 600, color: colors.ink }}>Project details</Text>
          <Text style={{ ...text, whiteSpace: "pre-wrap" }}>{lead.details}</Text>

          {lead.attachmentUrl && (
            <Text style={row}>
              <span style={label}>Attachment:</span>{" "}
              <Link href={lead.attachmentUrl} style={{ color: colors.accent }}>
                {lead.attachmentName ?? "Download file"}
              </Link>
            </Text>
          )}

          <Hr style={{ borderColor: colors.line, margin: "20px 0" }} />
          <Text style={small}>
            <Link href={lead.adminUrl} style={{ color: colors.accent }}>
              Open this lead in the admin panel
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
