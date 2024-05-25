import nodemailer from 'nodemailer';

const createMailTransporter = () => {
  const transport = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'MohamedRamadanMeray@outlook.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  return transport;
};

export default createMailTransporter;
