import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = (req, res, next) => {
  try {
    // Token aus Request Header nehmen
    const authHeader = req.headers["authorization"]; //expliziert Element Authorisation aus Header (Bearer + Token)
    const token = authHeader && authHeader.split(" ")[1]; // nimmt nur Token-Teil aus Header (Token)

    // prüft ob Token gültigt
    if (!token) {
      return res.status(401).json({ message: "Access Token nicht gefunden " });
    }
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.log(err);
          return res
            .status(403)
            .json({ message: "Access Token abgelaufen oder nicht richtig" });
        }

        // Benutzer nachschlagen und an die Anfrage anhängen
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword"
        );

        if (!user) {
          return res.status(404).json({ message: "Benutzer nicht gefunden" });
        }

        req.user = user;
        next(); // Weiter zur nächsten Middleware oder zum Route-Handler
      }
    );
  } catch (error) {
    console.log("Fehler bei JWT-Authorisation im Middleware", error);
    return res.status(500).json({ message: "System-Fehler" });
  }
};
