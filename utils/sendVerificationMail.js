import createMailTransporter from './email.js';

const sendVerificationMail = (user) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: 'Learning website <MohamedRamadanMeray@outlook.com>',
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Hello ${user.name}, Verify your email by clicking this link:
     <a href="http://127.0.0.1:3000/api/v1/auth/verify-email/${user.emailToken}">
       Verify your email
     </a>
   </p>`,
  };
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('verification email sent');
    }
  });
};

export default sendVerificationMail;
