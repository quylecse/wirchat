import mongoose from "mongoose";

//Schema definiert die Struktur einer User
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, //kein Duplikation erlaubt
        trim: true, // Start- und End-Leerzeichen entfernt
        lowercase: true //auf kleinbuchstaben. 
    },
    hashedPassword: {
        //speichert Password nach dem Verschlüssellung
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    avatarUrl: {
        type: String // link von Cloudynary zum Bilderanzeigen
    },
    avatarId: {
        type: String // Cloudynary puclic_id zum Löschen eines Bildes
    },
    bi: {
        type: String,
        maxlength: 500, //max 500 Wörte erlaubt
    },
    phone: {
        type: String,
        sparse: true // null erlaubt aber nicht vervielfältigt
    }
}, { timestamps: true }); //automatisch createAt und updateAt hinzufügen

//User-Model nutzt das deklarierte Schema 
const User = mongoose.model("User", userSchema);
export default User; 