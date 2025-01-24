const axios = require('axios');
const { fetchSecrets } = require('../config/infisical');
const MessageTemplate = require('../src/schemas/templates.schema');

const sendSms = async (purpose, mobileNumber, countryCode) => {
  const context = {
    success: 1,
    message: "Otp send successfully.",
    data: {},
  }
  try {
    const randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const secrets = await fetchSecrets();
    const payload = {
      phone: `${countryCode}${mobileNumber}`,
      text: `This is your otp for verification - ${randomNumber}`,
      session: "default",
    };
    const smsSent = await axios.post(secrets?.SMS_GATEWAY_ENDPOINT, payload, {
      headers: {
        'X-Access-Key': secrets?.SMS_GATEWAY_ACCESS_KEY,
        'X-Token': secrets?.SMS_GATEWAY_ACCESS_TOKEN,
      }
    }).then((res) => {
      return true;
    }).catch((err) => {
      return false;
    });
    if (!smsSent) {
      throw new Error("Otp could not be sent.");
    }
    context.data = {
      otpCode: randomNumber,
    };
  } catch (error) {
    context.success = 0;
    context.message = error?.message || error?.toString();
  }
  return context
}

module.exports = {
  sendSms,
};