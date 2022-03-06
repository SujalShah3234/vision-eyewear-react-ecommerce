const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { deleteUser, disableUser, enableUser } = require('./firebase.utils');
const app = express();

app.use(express.json());
app.use(cors());

dotenv.config();

app.post('/mail', async (req, res) => {
  const to_mail = req.body.email;
  const message = req.body.message;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'visioneyewear182@gmail.com',
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: 'visioneyewear182@gmail.com',
    to: 'visioneyewear182@gmail.com',
    subject: 'Message from Customer',
    html: `<h1>Hi there,</h1><h4>Here is a message from ${to_mail}</h4><p>${message}</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.json({
        message: error,
      });
    } else {
      res.json({
        message: info,
      });
    }
  });
});

app.post('/delete-user', async (req, res) => {
  const uid = req.body.uid;
  try {
    await deleteUser(uid);
    res.json({
      message: 'User Deleted',
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

app.post('/disable-user', async (req, res) => {
  const uid = req.body.uid;
  try {
    await disableUser(uid);
    res.json({
      message: 'User Blocked',
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

app.post('/enable-user', async (req, res) => {
  const uid = req.body.uid;
  try {
    await enableUser(uid);
    res.json({
      message: 'User Unblocked',
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on: ${process.env.PORT}`);
});
