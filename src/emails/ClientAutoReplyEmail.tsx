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

export type AutoReplyData = {
  firstName: string;
  service: string;
  brandName: string;
  siteUrl: string;
  whatsappUrl: string;
  calendlyUrl: string;
};

/** Branded auto-reply sent to the person who filled in the quote form. */
export function ClientAutoReplyEmail(d: AutoReplyData) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Thanks, we will reply within 24 hours.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={{ ...heading, fontSize: "20px", margin: "0 0 24px" }}>
            {d.brandName}
            <span style={{ color: colors.accent }}>.</span>
          </Text>
          <Heading as="h1" style={heading}>
            Thanks, {d.firstName}. We will reply within 24 hours.
          </Heading>
          <Text style={text}>
            We have received your request about <strong>{d.service}</strong>. A member of our team will read
            it carefully and get back to you with questions or a free, fixed price quote.
          </Text>
          <Text style={text}>Need an answer sooner? Message us on WhatsApp or book a short call.</Text>
          <Section style={{ margin: "8px 0 8px" }}>
            <Button href={d.whatsappUrl} style={{ ...button(colors.whatsapp), marginRight: "8px" }}>
              Chat on WhatsApp
            </Button>
            <Button href={d.calendlyUrl} style={button(colors.accent)}>
              Book a call
            </Button>
          </Section>
          <Hr style={{ borderColor: colors.line, margin: "28px 0 16px" }} />
          <Text style={small}>
            You are receiving this email because you sent a request on {d.siteUrl}. If this was not you, you
            can ignore this message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
