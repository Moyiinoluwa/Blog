export const generate2FACode6digits = () => {
    const min = 10000;
    const max = 99999;
    const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
    return otp;
};