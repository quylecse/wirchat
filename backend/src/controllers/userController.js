export const authMe = async (req, res) => {
    // nachdem middleware `protectedRoute` läuft, Benutzerdaten wird auf `req.user` angefügt
    if (req.user) {
        // authentifizierte User ausgeben
        return res.status(200).json({ user: req.user });
    } else {
        return res.status(401).json({ message: "Benutzer nicht gefunden" });
    }
};