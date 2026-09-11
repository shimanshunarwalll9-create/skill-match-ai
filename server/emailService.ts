import nodemailer from "nodemailer";

interface VerificationItem {
  code: string;
  email: string;
  fullName: string;
  expiresAt: number;
  createdAt: number;
  type: "signup" | "login" | "reset_password";
  lastSentAt: number;
}

export interface EmailDispatchResult {
  success: boolean;
  email: string;
  code: string;
  expiresAt: number;
  subject: string;
  htmlBody: string;
  sentVia: "smtp" | "simulated_preview";
  message?: string;
}

// In-memory verification storage
const verificationStore = new Map<string, VerificationItem>();

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of verificationStore.entries()) {
    if (now > item.expiresAt) {
      verificationStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function generateVerificationHtml(
  code: string,
  fullName: string,
  type: "signup" | "login" | "reset_password"
): { subject: string; htmlBody: string } {
  const isReset = type === "reset_password";
  const subject = isReset
    ? `🔐 Reset your SkillMatch password: ${code}`
    : `🛡️ Verify your SkillMatch AI account: ${code}`;

  const heading = isReset ? "Password Reset Verification" : "Verify Your Email Address";
  const intro = isReset
    ? `We received a request to reset the password for your SkillMatch AI account.`
    : `Welcome to SkillMatch AI! You're one step away from finding curated hackathons, internships, and dream teammates.`;

  const htmlBody = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f4; margin: 0; padding: 24px; color: #1c1917; }
    .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e5e4; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #d97706; padding: 28px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.92; font-weight: 500; }
    .body { padding: 32px 28px; }
    .code-box { background: #fef3c7; border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #78350f; font-family: monospace; }
    .expire-note { font-size: 12px; color: #92400e; margin-top: 6px; font-weight: 600; }
    .security-note { font-size: 12px; color: #78716c; line-height: 1.6; border-top: 1px solid #f5f5f4; padding-top: 20px; margin-top: 24px; }
    .footer { background: #fafaf9; padding: 18px 24px; text-align: center; font-size: 11px; color: #a8a29e; border-top: 1px solid #f5f5f4; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SkillMatch AI</h1>
      <p>Intelligent Opportunity & Career Matching</p>
    </div>
    <div class="body">
      <h2 style="font-size: 18px; font-weight: 700; color: #1c1917; margin-top: 0;">${heading}</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #44403c;">
        Hi <strong>${fullName || "there"}</strong>,<br><br>
        ${intro} Use the 6-digit security code below to complete verification:
      </p>

      <div class="code-box">
        <div class="code">${code}</div>
        <div class="expire-note">⏱️ Code expires in 10 minutes</div>
      </div>

      <p style="font-size: 13px; color: #57534e; line-height: 1.5;">
        Enter this code in your browser verification window to continue. If you did not make this request, you can safely ignore this email.
      </p>

      <div class="security-note">
        <strong>Security Tip:</strong> Never share your verification code with anyone. SkillMatch staff will never ask for your code or password.
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} SkillMatch AI. All rights reserved. • Connecting students to hackathons & opportunities.
    </div>
  </div>
</body>
</html>`;

  return { subject, htmlBody };
}

export async function sendVerificationEmail(
  email: string,
  fullName: string = "User",
  type: "signup" | "login" | "reset_password" = "signup"
): Promise<EmailDispatchResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store verification record
  verificationStore.set(normalizedEmail, {
    code,
    email: normalizedEmail,
    fullName,
    expiresAt,
    createdAt: Date.now(),
    type,
    lastSentAt: Date.now(),
  });

  const { subject, htmlBody } = generateVerificationHtml(code, fullName, type);
  const transporter = getSmtpTransporter();

  console.log(`\n======================================================`);
  console.log(`[SkillMatch Auth] Email Verification Dispatched`);
  console.log(`Recipient: ${normalizedEmail}`);
  console.log(`Code: ${code}`);
  console.log(`Expires: in 10 minutes`);
  console.log(`======================================================\n`);

  if (transporter) {
    try {
      const from = process.env.SMTP_FROM || `"SkillMatch AI" <${process.env.SMTP_USER}>`;
      await transporter.sendMail({
        from,
        to: normalizedEmail,
        subject,
        html: htmlBody,
        text: `Your SkillMatch verification code is: ${code}. Valid for 10 minutes.`,
      });

      return {
        success: true,
        email: normalizedEmail,
        code,
        expiresAt,
        subject,
        htmlBody,
        sentVia: "smtp",
        message: `Verification email delivered to ${normalizedEmail} via SMTP!`,
      };
    } catch (err: any) {
      console.warn("SMTP send failed, falling back to simulated preview:", err?.message);
    }
  }

  // Fallback to simulated delivery with rich in-app email preview
  return {
    success: true,
    email: normalizedEmail,
    code,
    expiresAt,
    subject,
    htmlBody,
    sentVia: "simulated_preview",
    message: `Verification code generated for ${normalizedEmail}. Code: ${code}`,
  };
}

export function verifyEmailCode(
  email: string,
  code: string
): { success: boolean; message?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const record = verificationStore.get(normalizedEmail);

  if (!record) {
    return {
      success: false,
      message: "No active verification code found for this email. Please request a new code.",
    };
  }

  if (Date.now() > record.expiresAt) {
    verificationStore.delete(normalizedEmail);
    return {
      success: false,
      message: "Verification code has expired. Please request a new code.",
    };
  }

  if (record.code.trim() !== code.trim()) {
    return {
      success: false,
      message: "Incorrect 6-digit verification code. Please check and try again.",
    };
  }

  // Success: consume token
  verificationStore.delete(normalizedEmail);
  return {
    success: true,
    message: "Email verified successfully!",
  };
}

export function getPendingVerification(email: string): VerificationItem | undefined {
  const normalizedEmail = email.trim().toLowerCase();
  return verificationStore.get(normalizedEmail);
}
