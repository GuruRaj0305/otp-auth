const { OTP_LENGTH } = require("../config/config");

const generateOtp = () => {
    let otp = "";
    for (let i = 0; i < OTP_LENGTH; i++) { // this for loop beceuse to generate dymanic lentgh 
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
};

// if opt all digits are same then it is weak otp
const isWeakOtp = (otp) => {
  if (!otp) return true;

  //  000000, ...
  if (/^(\d)\1+$/.test(otp)) return true;

  return false;
};

const generateAndValidateOtp = () => {

    const maxGenerationAttempts = 5;
    let attempts = 0;
    let otp;

    do {
        otp = generateOtp();
        attempts++;
        
    } while (isWeakOtp(otp) && attempts < maxGenerationAttempts);

    return otp;
};



module.exports = {
    generateAndValidateOtp,
};  
