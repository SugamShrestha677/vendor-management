import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

export const sendRequestNotificationEmail = async (email, requestNumber, status) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Purchase Request ${requestNumber} - ${status}`,
    html: `
      <h2>Purchase Request Update</h2>
      <p>Your purchase request <strong>${requestNumber}</strong> has been <strong>${status}</strong>.</p>
      <p>Please log in to the system for more details.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendApprovalNotificationEmail = async (email, requestNumber) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `New Approval Required - ${requestNumber}`,
    html: `
      <h2>Approval Required</h2>
      <p>A new purchase request <strong>${requestNumber}</strong> requires your approval.</p>
      <p>Please log in to the system to review and approve.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
