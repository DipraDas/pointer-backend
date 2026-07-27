const sendEmail = async (email, subject, message) => {
    console.log("==================================");
    console.log("To:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);
    console.log("==================================");
};

module.exports = sendEmail;