import { site } from "../config/site";

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Qu’est-ce que VTC Copilot AI ?",
    a: "Un assistant d’aide à la décision pour les chauffeurs VTC. Il rassemble les informations d’une proposition de course (prix, approche, durée, destination), y applique vos propres coûts et vous donne une estimation lisible de sa rentabilité. Vous restez seul·e juge de la décision.",
  },
  {
    q: "Comment la rentabilité d’une course est-elle évaluée ?",
    a: "Le principe est simple et transparent : on retire du prix proposé le coût estimé des kilomètres parcourus (approche, course et, si nécessaire, retour à vide), puis on rapporte ce montant au temps total mobilisé. Le résultat est comparé aux seuils que vous avez choisis pour afficher vert, orange ou rouge. Ce sont des estimations, pas des certitudes.",
  },
  {
    q: "Comment sont pris en compte les coûts du véhicule ?",
    a: "Vous les renseignez vous-même : énergie, entretien, pneus, assurance, location ou crédit, ramenés à un coût par kilomètre. Vous pouvez les ajuster à tout moment. Les montants montrés sur ce site sont fictifs.",
  },
  {
    q: "L’application est-elle déjà disponible ?",
    a: "Non. VTC Copilot AI est en préparation. Elle n’est publiée ni sur l’App Store ni sur Google Play. Les écrans présentés sur ce site sont une démonstration du concept, avec des données fictives.",
  },
  {
    q: "Les connexions aux plateformes sont-elles opérationnelles ?",
    a: "Non. Aucune connexion avec Uber, Bolt, Heetch ou une autre plateforme n’est opérationnelle, et aucun partenariat n’est conclu à ce jour. Toute intégration future devra être autorisée et respecter les conditions des plateformes et les droits des chauffeurs.",
  },
  {
    q: "L’inscription à la waitlist est-elle gratuite ?",
    a: "Oui, elle est gratuite et sans engagement. Elle vous permet d’être informé·e du lancement et, si vous le souhaitez, de participer aux tests.",
  },
  {
    q: "Comment mes données sont-elles utilisées ?",
    a: `Nous collectons le minimum : prénom, e-mail, zone d’activité facultative et vos choix de consentement. Ces données servent uniquement à vous informer du lancement et, si vous l’acceptez, à vous proposer des entretiens ou des tests. Elles ne sont ni vendues ni cédées, et sont conservées ${site.waitlist.retentionMonths} mois au maximum. Vous pouvez supprimer votre inscription à tout moment grâce au lien fourni après l’inscription ou en nous écrivant via le formulaire de contact.`,
  },
  {
    q: "Quand le service sera-t-il disponible ?",
    a: "Aucune date n’est fixée pour l’instant. Les inscrits à la waitlist seront les premiers informés, et les volontaires pourront tester le produit sur un périmètre pilote en Île-de-France.",
  },
];
