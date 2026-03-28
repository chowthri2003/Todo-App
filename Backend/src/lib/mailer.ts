import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
   auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendReminderMail = async (
  to: string,
  title: string,
  dueDate: Date
) => {
  const info = await transporter.sendMail({
    from: '"Todo App" <reminder@todo.com>',
    to,
    subject: "Task Reminder",
    html: `
      <h2>Task Reminder</h2>
      <p>Your task <b>${title}</b> is due at:</p>
      <h3>${dueDate}</h3>
    `,
  });
};
