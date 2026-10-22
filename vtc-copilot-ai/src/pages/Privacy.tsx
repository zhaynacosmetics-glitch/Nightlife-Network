import { site } from "../config/site";
import { Prose } from "./Legal";

export function Privacy() {
  const m = site.waitlist.retentionMonths;
  return (
    <Prose title="Politique de confidentialité">
      <p>Dernière mise à jour : {site.legal.lastUpdate}. Cette page explique quelles données VTC Copilot AI collecte sur ce site, pourquoi, combien de temps elles sont gardées et comment exercer vos droits.</p>

      <h2>Responsable du traitement</h2>
      <p>
        L’éditeur du site indiqué dans les <a href="/mentions-legales/">mentions légales</a>. Pour toute question ou demande :{" "}
        {site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <a href="/#partenaires">formulaire de contact</a>}.
      </p>

      <h2>Données collectées et finalités</h2>
      <ul>
        <li>
          <strong>Waitlist</strong> : prénom, adresse e-mail, zone d’activité (facultative), vos choix de consentement et la date d’inscription. Finalité : vous informer du lancement de VTC Copilot AI et, uniquement si vous
          cochez la case correspondante, vous proposer des entretiens ou des tests. Base légale : votre consentement.
        </li>
        <li>
          <strong>Formulaire de contact</strong> : nom, organisation (facultative), e-mail et message. Finalité : répondre à votre demande. Base légale : votre demande et notre intérêt légitime à y répondre.
        </li>
        <li>
          <strong>Protection contre les abus</strong> : une empreinte de votre adresse IP, transformée de façon irréversible (hachage avec un secret), est conservée 24 heures au plus pour limiter les envois
          automatisés. Base légale : intérêt légitime à sécuriser le service.
        </li>
      </ul>
      <p>Aucun cookie publicitaire ni outil de mesure d’audience tiers n’est utilisé sur ce site. Aucune donnée n’est vendue ni cédée.</p>

      <h2>Durée de conservation</h2>
      <ul>
        <li>Inscriptions à la waitlist : jusqu’à votre désinscription et au maximum {m} mois après votre inscription.</li>
        <li>Messages de contact : 12 mois au maximum après le dernier échange.</li>
        <li>Empreintes d’adresse IP : 24 heures au maximum.</li>
      </ul>

      <h2>Destinataires et sous-traitants</h2>
      <p>
        Les données sont accessibles uniquement à l’équipe VTC Copilot AI. Le site et sa base de données sont hébergés par Cloudflare (Cloudflare Workers et Cloudflare D1), qui agit en tant que sous-traitant.
        Cloudflare peut traiter des données hors de l’Union européenne ; ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne et le cadre de protection des données UE-États-Unis
        auquel Cloudflare adhère. Si un service d’envoi d’e-mails est utilisé pour les communications de lancement, il sera ajouté à cette liste avant tout envoi.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les échanges sont chiffrés (HTTPS). La liste des inscrits n’est jamais accessible publiquement : son export nécessite une clé d’administration secrète. Les données collectées sont limitées au strict nécessaire.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité, ainsi que du droit de retirer votre consentement à tout moment. Après votre inscription, un lien
        personnel vous permet de supprimer immédiatement vos données. Vous pouvez aussi nous écrire via le formulaire de contact. Vous pouvez enfin introduire une réclamation auprès de la CNIL (
        <a href="https://www.cnil.fr" rel="noopener noreferrer">cnil.fr</a>).
      </p>
    </Prose>
  );
}
