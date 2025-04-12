import { createTransport } from "nodemailer";

export async function POST(request: Request) {
  const emailPassword = process.env.NEXT_EMAIL_PASSWORD;
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "alvindsouza2204@gmail.com",
      pass: emailPassword,
    },
  });

  try {
    const req = await request.json();
    const emailPromises = req.emails.map(async (email: string) => {
      const mail = await transporter.sendMail({
        from: '"QConnect HelpDesk" <alvindsouza2204@gmail.com>',
        to: email,
        subject: req.subject || "QConnect Classroom Invitation",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #4f46e5;">QConnect</h1>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p>Hello,</p>
            <p>${
              req.message || "You have been invited to join a classroom."
            }</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="margin-top: 0; color: #111827;">${
              req.classroomName || "Classroom"
            }</h2>
            <p><strong>Teacher:</strong> ${
              req.teacherName || "Not specified"
            }</p>
            ${
              req.description
                ? `<p><strong>Description:</strong> ${req.description}</p>`
                : ""
            }
          </div>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${
              req.joinUrl
            }" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Join Classroom</a>
          </div>
          
          <div style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 30px;">
            <p>If you received this email by mistake, please ignore it or contact support.</p>
          </div>
        </div>
        `,
      });

      console.log("Success - " + email + mail.response);
      return mail;
    });

    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({
        status: 200,
        success: true,
        message: "Invitations sent successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error: " + error);
    return new Response(
      JSON.stringify({
        status: 500,
        success: false,
        message: "Error sending email",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
