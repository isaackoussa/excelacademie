/**
 * Inscription à la liste de l'atelier.
 *
 * La page envoie ici { prenom, mail, accord, source } ; cette fonction vérifie,
 * puis transmet à Brevo. La clé d'API ne quitte jamais le serveur : elle vit
 * dans les variables d'environnement du site.
 *
 * Variables attendues :
 *   BREVO_API_KEY   la clé v3 (Brevo → SMTP & API → Clés d'API)
 *   BREVO_LIST_ID   l'identifiant numérique de la liste (défaut : 2)
 *
 * Sans clé, la fonction répond 503 : la page déverrouille alors les modules
 * localement et proposera de réessayer depuis le profil.
 */

export const config = { path: "/api/subscribe" };

const BREVO = "https://api.brevo.com/v3/contacts";
const MAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

const json = (corps, code = 200) =>
  new Response(JSON.stringify(corps), {
    status: code,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const refus = (champ, message) => json({ champ, message }, 422);

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { allow: "POST, OPTIONS" },
    });
  }
  if (req.method !== "POST") {
    return json({ erreur: "methode" }, 405);
  }

  let d;
  try {
    d = await req.json();
  } catch {
    return json({ erreur: "corps" }, 400);
  }

  // Le champ « societe » est un leurre : un humain ne le voit pas, un robot le
  // remplit. On répond comme si tout allait bien, sans rien transmettre.
  if (typeof d.societe === "string" && d.societe.trim() !== "") {
    return json({ ok: true, note: "ignore" });
  }

  const prenom = String(d.prenom || "").trim().slice(0, 60);
  const mail = String(d.mail || "").trim().toLowerCase().slice(0, 120);

  if (prenom.length < 2) {
    return refus("prenom", "Un prénom, même court, pour vous écrire correctement.");
  }
  if (!MAIL.test(mail)) {
    return refus("mail", "Cette adresse n'a pas l'air complète — il manque un @ ou un domaine.");
  }
  if (d.accord !== true) {
    return refus("accord", "Il faut cocher l'accord : sans lui, rien n'est envoyé.");
  }

  const cle = process.env.BREVO_API_KEY;
  if (!cle) {
    return json({ erreur: "non configure" }, 503);
  }
  const liste = Number(process.env.BREVO_LIST_ID || 2);

  let r;
  try {
    r = await fetch(BREVO, {
      method: "POST",
      headers: {
        "api-key": cle,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: mail,
        updateEnabled: true,
        listIds: [liste],
        attributes: {
          PRENOM: prenom,
          OPT_IN: true,
        },
      }),
    });
  } catch {
    return json({ erreur: "amont injoignable" }, 502);
  }

  // 201 : contact créé. 204 : contact déjà connu, mis à jour.
  if (r.status === 201 || r.status === 204) {
    return json({ ok: true, liste });
  }

  let amont = null;
  try {
    amont = await r.json();
  } catch {
    /* réponse sans corps */
  }

  if (r.status === 400 && amont && amont.code === "invalid_parameter") {
    return refus("mail", "Cette adresse a été refusée par le service de courrier.");
  }
  if (r.status === 401) {
    return json({ erreur: "cle refusee" }, 503);
  }
  if (r.status === 429) {
    return json({ erreur: "trop de demandes" }, 503);
  }

  return json({ erreur: "amont", code: r.status }, 502);
};
