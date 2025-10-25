import bcrypt from "bcrypt";
import crypto, { setEngine } from "crypto";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; //Token bleibt 30m lang güligt (üblicherweise <15min)
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14 Tagen auf Milisenkunden

export const signUp = async (req, res) => {
  try {
    //Benutzerdaten aus Request (req.body) definieren (durch const) mithilfe Destructuring assigment.
    const { username, password, email, firstName, lastName } = req.body;

    //prüft, ob Benutzerdaten eingegeben werden
    if (!username || !password || !email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ message: "Bitte überprüfen Sie Ihre Eingaben" });
    }

    // prüft, ob username vorhanden ist

    const duplicateUser = await User.findOne({ $or: [{ username }, { email }] })
      .lean()
      .exec();
    if (duplicateUser) {
      if (duplicateUser.username === username) {
        return res
          .status(409)
          .json({ message: "Benutzername ist bereit vorhanden!" });
      }
      if (duplicateUser.email === email) {
        return res
          .status(409)
          .json({ message: "E-Mail ist bereit vorhanden!" });
      }
    }

    // password verschlüsseln
    const hashedPassword = await bcrypt.hash(password, 10); //salt = 10

    // neue Benutzer auf Datenbank anlegen
    const newUser = await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    //Anlegung neues Benutzern erfolgreich, code 201 senden
    return res
      .status(201)
      .json({ message: `Benutzer ${newUser.username} erfolgreich erstellt` });
  } catch (error) {
    console.log("Fehler bei Registrierung", error);
    return res.status(500).json({ message: "System-Fehler" });
  }
};

export const signIn = async (req, res) => {
  try {
    // Benutzerdaten aus req lesen
    const { username, password } = req.body;

    //prüft Bentzerdaten
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "E-Mail-Adresse oder Telefonnummer eingeben" });
    }

    //username auf DB nachschlagen
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Ihr Konto wurde nicht gefunden." });
    }

    // eingegebenes Passwort mit dem auf DB gespeicherten Passwort vergleichen
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res.status(401).json({ message: "Falsches Passwort." });
    }
    // wenn stimmt, ein accessToken mit JWT erstellen
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // ein refresh-Token erstellen
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // eine neue Sitzung erstellen und das refresh Token hineinspeichern
    await Session.create({
      userId: user._id,
      refreshToken,
      expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // das refresh-Token an Benutzer im Cookie senden
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", //backend und frontend werden separat stationiert
      maxAge: REFRESH_TOKEN_TTL,
    });

    // das access-Token an Benutzer im Response senden
    return res.status(200).json({
      message: `Benutzer ${user.displayName} hat sich angemeldet!`,
      accessToken,
    });
  } catch (error) {
    console.log("Fehler bei Anmeldung", error);
    return res.status(500).json({ message: "System-Fehler" });
  }
};

export const signOut = async (req, res) => {
  try {
    //refresh-Token aus Cookie nehmen, nutzen cooke-parse
    const token = req.cookies?.refreshToken;

    // refresh Token im Session löschen
    if (token) {
      await Session.deleteOne({ refreshToken: token });
    }

    // Cookie löschen
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.sendStatus(204);
  } catch (error) {
    console.log(`Fehler bei Abmeldung`, error);
    return res.status(500).json({ message: "System-Fehler" });
  }
};
export const refreshToken = async (req, res) => {
  try {
    //refreshToken aus Cookie nehmen
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token ist nicht vorhanden" });
    }
    // mit dem aus DB vergleichen
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res
        .status(403)
        .json({ message: "Token ist ungültig oder abgelaufen. " });
    }
    // Gültigkeit prüfen
    if (session.expireAt < new Date()) {
      await Session.deleteOne({ _id: session._id }); // Abgelaufene Sitzung aufräumen

      return res.status(403).json({ message: "Token ist ungültig." });
    }

    // Finde den Benutzer, der zu dieser Sitzung gehört
    const user = await User.findById(session.userId).select("-hashedPassword");
    if (!user) {
      return res
        .status(404)
        .json({ message: "Benutzer für diese Sitzung nicht gefunden." });
    }

    // neues Token erstellen
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Erstelle ein abgespecktes Benutzerobjekt für die Antwort
    const userResponse = {
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
    };

    // Sende sowohl den neuen Token als auch die Benutzerdaten zurück
    return res.status(200).json({ accessToken, user: userResponse });
  } catch (error) {
    console.log("Fehler beim Token neusertellen");
    return res.status(500).json({ message: "System-Fehler" });
  }
};
