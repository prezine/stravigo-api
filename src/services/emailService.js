const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Send contact form confirmation
  async sendContactConfirmation(to, name) {
    const mailOptions = {
      from: `"Stravigo" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Thank You for Contacting Stravigo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hi ${name},</h2>
          <p>Thank you for reaching out to Stravigo! We've received your message and our team will get back to you within 24 hours.</p>
          
          <p>In the meantime, you might want to check out:</p>
          <ul>
            <li><a href="https://stravigo.com/insights">Our Latest Insights</a></li>
            <li><a href="https://stravigo.com/work">Our Featured Case Studies</a></li>
          </ul>
          
          <p>If you have any urgent inquiries, please call us at +234 901 234 5678.</p>
          
          <p>Best regards,<br>
          The Stravigo Team</p>
          
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Stravigo - Building Brands Everyone Talks About<br>
            123 Innovation Drive, Victoria Island, Lagos, Nigeria
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Send lead notification to admin
  async sendLeadNotification(leadData) {
    const mailOptions = {
      from: `"Stravigo Website" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: `New Lead: ${leadData.full_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Website Lead</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                leadData.full_name
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                leadData.email
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                leadData.phone_number || "Not provided"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                leadData.company || "Not provided"
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service Interest:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                leadData.service_interest
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Source:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                leadData.page_source
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message:</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${
                leadData.message || "No message"
              }</td>
            </tr>
          </table>
          
          <p style="margin-top: 20px;">
            <a href="mailto:${
              leadData.email
            }" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              Reply to ${leadData.full_name}
            </a>
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Send resource access email
  async sendResourceAccess(to, name, resourceType) {
    const resourceLinks = {
      business: "https://stravigo.com/resources/business-strategy-guide.pdf",
      individuals:
        "https://stravigo.com/resources/personal-branding-framework.pdf",
      entertainment:
        "https://stravigo.com/resources/entertainment-industry-report.pdf",
    };

    const mailOptions = {
      from: `"Stravigo Resources" <${process.env.EMAIL_FROM}>`,
      to,
      subject: `Your ${
        resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
      } Resource from Stravigo`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Here's Your Resource, ${name}!</h2>
          
          <p>Thank you for your interest in Stravigo. Here's the ${resourceType} resource you requested:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Download Link:</h3>
            <p>
              <a href="${
                resourceLinks[resourceType]
              }" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Download ${
                  resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
                } Resource
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">
              <em>Note: This link will expire in 7 days</em>
            </p>
          </div>
          
          <p>Want to learn more about how Stravigo can help you?</p>
          <ul>
            <li><a href="https://stravigo.com/services/${resourceType}">Explore Our ${
        resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
      } Services</a></li>
            <li><a href="https://stravigo.com/work">View Case Studies</a></li>
            <li><a href="https://stravigo.com/contact">Schedule a Consultation</a></li>
          </ul>
          
          <p>Best regards,<br>
          The Stravigo Team</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Send job application confirmation
  async sendApplicationConfirmation(to, name, position) {
    const mailOptions = {
      from: `"Stravigo Careers" <${process.env.EMAIL_FROM}>`,
      to,
      subject: `Application Received: ${position}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Application Received, ${name}!</h2>
          
          <p>Thank you for applying for the <strong>${position}</strong> position at Stravigo.</p>
          
          <p>We've received your application and our team will review it carefully. We aim to get back to all applicants within 7-10 business days.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <ul>
              <li>Our team will review your application</li>
              <li>If shortlisted, we'll contact you for an initial screening</li>
              <li>The interview process typically takes 2-3 weeks</li>
            </ul>
          </div>
          
          <p>In the meantime, learn more about working at Stravigo:</p>
          <ul>
            <li><a href="https://stravigo.com/culture">Our Culture & Values</a></li>
            <li><a href="https://stravigo.com/work">Our Recent Work</a></li>
          </ul>
          
          <p>If you have any questions, please reply to this email.</p>
          
          <p>Best regards,<br>
          Stravigo Talent Team</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
