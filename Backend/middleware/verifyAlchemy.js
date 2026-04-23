const crypto = require("crypto");

const verifyAlchemySignature = (req, res, next) => {
  const signature = req.headers["x-alchemy-signature"];
  const signingKey = process.env.ALCHEMY_SIGNING_KEY;

  if (!signature) {
    console.error("No Alchemy signature found in headers");
    return res.status(401).send("Missing signature");
  }

  // Use the rawBody we captured in the main app file
  const hmac = crypto.createHmac("sha256", signingKey);
  hmac.update(req.rawBody, "utf8");
  const digest = hmac.digest("hex");

  if (signature !== digest) {
    console.error("Invalid signature. Request is untrusted.");
    return res.status(401).send("Invalid signature");
  }

  console.log("Alchemy Signature Validated");
  

  next(); // Signature is valid, proceed to the route handler
};

module.exports = verifyAlchemySignature;