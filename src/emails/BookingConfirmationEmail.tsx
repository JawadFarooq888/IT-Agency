import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { button, colors, container, heading, main, small, text } from "./styles";

export type BookingConfirmationData = {
  firstName: string;
  brandName: string;
  siteUrl: string;
  preferredDate: string;
  timeSlot: string;
  timezone: string;
  whatsappUrl: string;
};

/** Sent to the visitor after they request a consultation call. */
export function BookingConfirmationEmail(d: BookingConfirmationData) {
  return (
    <Html lang="en">
      <Head />
      <Preview>We received your call request and will confirm the time soon.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={{ ...heading, fontSize: "20px", margin: "0 0 24px" }}>
            {d.brandName}
            <span style={{ color: colors.accent }}>.</span>
          </Text>
          <Heading as="h1" style={heading}>
            Thanks, {d.firstName}. Your call request is in.
          </Heading>
          <Text style={text}>
            You asked for a free consultation call on <strong>{d.preferredDate}</strong>,{" "}
            <strong>{d.timeSlot}</strong> ({d.timezone}). We will confirm the exact time on WhatsApp or by
            email within 24 hours.
          </Text>
          <Text style={text}>Want to confirm faster? Send us a message on WhatsApp.</Text>
          <Section style={{ margin: "8px 0" }}>
            <Button href={d.whatsappUrl} style={button(colors.whatsapp)}>
              Chat on WhatsApp
            </Button>
          </Section>
          <Hr style={{ borderColor: colors.line, margin: "28px 0 16px" }} />
          <Text style={small}>
            You are receiving this email because you requested a call on {d.siteUrl}. If this was not you, you
            can ignore this message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
