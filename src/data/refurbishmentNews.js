/**
 * refurbishmentNews.js - updates shown on the /news page while the runway is
 * being refurbished. The page is linked only from the site-wide NoticeBanner.
 *
 * ---------------------------------------------------------------------------
 * HOW TO ADD AN UPDATE
 * ---------------------------------------------------------------------------
 * 1. Photos (optional): put the files in src/assets/img/news/ and import them
 *    at the top of this file, e.g.
 *        import worksJuly from '../assets/img/news/works-july.webp';
 *    Then list them under `images`, each as { src, alt }. A post may carry as
 *    many as you like and they render stacked, in order. Portrait shots are
 *    shown narrower so they do not tower over the text.
 *    Astro optimises and resizes them automatically - no need to pre-scale.
 *
 * 2. Add a new object to the TOP of `posts`. The page renders them in array
 *    order, so newest first.
 *
 * 3. `title`, `body` and `imageAlt` are keyed by language. English is the
 *    fallback: if `fr` or `de` is missing, the page shows `en` rather than an
 *    empty block, so it is safe to publish in English first and translate later.
 *
 * 4. `body` is an array of paragraphs - add as many strings as you need.
 *
 * 5. `date` is ISO (YYYY-MM-DD). It is formatted per language on the page.
 * ---------------------------------------------------------------------------
 */

// Photos, newest first. Add one import per photo.
import groovesWideImg from '../assets/img/news/2026-09-14-runway-grooves-wide.webp';
import centrelineImg from '../assets/img/news/2026-09-14-runway-centreline.webp';
import fencingImg from '../assets/img/news/2026-09-08-fence-line.webp';

export const posts = [
  {
    id: '2026-09-14-runway-ground-work',
    date: '2026-09-14',

    images: [
      {
        src: groovesWideImg,
        alt: {
          en: 'The runway seen end on, with regular parallel grooves cut into the turf across its full width',
          fr: "La piste vue dans l'axe, avec des sillons parallèles réguliers creusés dans le gazon sur toute sa largeur",
          de: 'Die Piste in der Achse gesehen, mit gleichmäßigen parallelen Rillen über die gesamte Breite der Grasnarbe',
          lu: "D'Piste an der Achs gesinn, mat gläichméissege parallele Rillen iwwer déi ganz Breet vun der Grasnarb",
        },
      },
      {
        src: centrelineImg,
        alt: {
          en: 'The painted runway markings in the foreground, with the freshly grooved surface running away towards the trees',
          fr: "Les marques peintes de la piste au premier plan, la surface fraîchement sillonnée s'éloignant vers les arbres",
          de: 'Die aufgemalten Pistenmarkierungen im Vordergrund, dahinter die frisch aufgerissene Fläche in Richtung Bäume',
          lu: "D'Pistemarkéierungen am Virdergrond, dohannert déi frësch opgerass Fläch a Richtung Beem",
        },
      },
    ],

    title: {
      en: 'Ground work starts: first 200 metres of the runway opened up',
      fr: 'Début des travaux de terrassement : les 200 premiers mètres de la piste ouverts',
      de: 'Erdarbeiten beginnen: die ersten 200 Meter der Piste aufgebrochen',
      lu: "D'Erdaarbechte fänken un: déi éischt 200 Meter vun der Piste opgebrach",
    },

    body: {
      en: [
        'A tractor-towed machine was at work on 14 September, drawing parallel grooves along roughly 200 metres of the runway, on the section that runs between the trees. The turf has been lifted and the soil beneath opened up, leaving a ribbed pattern across the full width of the surface.',
        'This is groundwork rather than the resurfacing itself: loosening the compacted surface is the first step before the ground can be levelled and rebuilt.',
        'The airfield stays closed and the fenced area remains off limits to everyone except the contractor’s personnel. We will post the next update as the works move on.',
      ],
      fr: [
        "Une machine tractée était à l'oeuvre le 14 septembre, traçant des sillons parallèles sur environ 200 mètres de la piste, sur la section qui passe entre les arbres. Le gazon a été soulevé et le sol en dessous ouvert, laissant un motif de stries sur toute la largeur de la surface.",
        "Il s'agit de travaux préparatoires et non de la réfection elle-même : ameublir la surface compactée est la première étape avant que le terrain puisse être nivelé et reconstruit.",
        "L'aérodrome reste fermé et la zone clôturée demeure interdite à toute personne autre que le personnel de l'entreprise. Nous publierons la prochaine actualité au fur et à mesure de l'avancement du chantier.",
      ],
      de: [
        'Am 14. September war eine von einem Traktor gezogene Maschine im Einsatz und hat auf rund 200 Metern der Piste parallele Rillen gezogen, auf dem Abschnitt, der zwischen den Bäumen verläuft. Die Grasnarbe wurde angehoben und der Boden darunter geöffnet; das Rillenmuster zieht sich jetzt über die gesamte Breite der Fläche.',
        'Das sind Vorarbeiten, noch nicht die Sanierung selbst: Das Auflockern der verdichteten Oberfläche ist der erste Schritt, bevor der Boden eingeebnet und neu aufgebaut werden kann.',
        'Der Flugplatz bleibt geschlossen und der abgesperrte Bereich weiterhin für alle außer dem Personal der Baufirma gesperrt. Die nächste Meldung folgt, sobald die Arbeiten weitergehen.',
      ],
      lu: [
        "Den 14. September war eng Maschinn, déi vun engem Trakter gezu gouf, am Asaz an huet op ronn 200 Meter vun der Piste parallel Rillen gezunn, op deem Deel, dee tëscht de Beem leeft. D'Grasnarb ass ugehuewe ginn an de Buedem drënner opgemaach; d'Rillemuster zitt sech elo iwwer déi ganz Breet vun der Fläch.",
        "Dat sinn Viraarbechten, nach net d'Sanéierung selwer: d'Oploossen vun der verdichteter Uewerfläch ass den éischte Schrëtt, ier de Buedem ka planéiert an nei opgebaut ginn.",
        "D'Fluchplaz bleift zou an den ofgespaarte Beräich weiderhi fir jiddereen ausser dem Personal vun der Baufirma verbueden. Déi nächst Meldung kënnt, soubal d'Aarbechte weiderginn.",
      ],
    },
  },
  {
    id: '2026-09-08-work-area-fenced',
    date: '2026-09-08',

    images: [
      {
        src: fencingImg,
        alt: {
          en: 'Wooden posts strung with red-and-white barrier tape, marking the edge of the work area alongside the paved path',
          fr: "Piquets en bois reliés par une rubalise rouge et blanche, marquant la limite de la zone de chantier le long du chemin goudronné",
          de: 'Holzpfosten mit rot-weißem Absperrband markieren die Grenze der Baustelle entlang des asphaltierten Wegs',
          lu: "Holzpinn mat rout-wäissem Absperrband markéieren d'Grenz vun der Baustell laanscht den asphaltéierte Wee",
        },
      },
    ],

    title: {
      en: 'Work area fenced off as the runway is handed to the contractor',
      fr: "La zone de chantier est clôturée, la piste passe aux mains de l'entreprise",
      de: 'Baustelle abgesperrt - die Piste geht an die Baufirma über',
      lu: "D'Baustell ass ofgespaart - d'Piste geet un d'Baufirma iwwer",
    },

    body: {
      en: [
        'The boundary of the construction site has been marked out and fenced. A line of posts now runs the length of the work area, separating the site from the rest of the airfield and making the limits unmistakable from every direction.',
        'For the entire duration of the works, access to the runway is strictly forbidden. Only the contractor’s personnel may enter the fenced area. This applies equally to club members, visitors and vehicles, at any time of day, including evenings and weekends when no work is under way.',
        'In preparation, the club cleared the runway of all cones and markers, so that the site could be handed over ready for work to begin.',
      ],
      fr: [
        "Les limites du chantier ont été matérialisées et clôturées. Une ligne de piquets longe désormais toute la zone des travaux : elle sépare le chantier du reste de l'aérodrome et en rend les limites parfaitement lisibles, quel que soit l'angle d'approche.",
        "Pendant toute la durée des travaux, l'accès à la piste est strictement interdit. Seul le personnel de l'entreprise est autorisé à pénétrer dans la zone clôturée. Cela vaut aussi bien pour les membres du club que pour les visiteurs et les véhicules, à toute heure, y compris le soir et le week-end lorsque le chantier est à l'arrêt.",
        "En préparation, le club a retiré tous les cônes et balises de la piste, afin que le site puisse être remis à l'entreprise, prêt pour le début des travaux.",
      ],
      de: [
        'Die Grenzen der Baustelle sind abgesteckt und abgesperrt. Eine Reihe Pfosten verläuft nun entlang des gesamten Arbeitsbereichs, trennt die Baustelle vom übrigen Flugplatz und macht die Grenze aus jeder Richtung unmissverständlich sichtbar.',
        'Für die gesamte Dauer der Arbeiten ist der Zugang zur Piste strikt verboten. Nur das Personal der Baufirma darf den abgesperrten Bereich betreten. Das gilt gleichermaßen für Vereinsmitglieder, Besucher und Fahrzeuge, zu jeder Tageszeit, auch abends und am Wochenende, wenn nicht gearbeitet wird.',
        'Zur Vorbereitung hat der Club alle Kegel und Markierungen von der Piste entfernt, damit das Gelände bereit für den Arbeitsbeginn übergeben werden konnte.',
      ],
      lu: [
        "D'Grenze vun der Baustell si markéiert an ofgespaart. Eng Rei Pinn leeft elo laanscht de ganzen Aarbechtsberäich, trennt d'Baustell vum Rescht vun der Fluchplaz a mécht d'Limitt aus all Richtung kloer sichtbar.",
        "Fir déi ganz Dauer vun den Aarbechten ass den Zougang zur Piste strikt verbueden. Nëmmen d'Personal vun der Baufirma dierf an den ofgespaarte Beräich. Dat gëllt fir Clubmemberen, Visiteuren a Gefierer gläicherweis, zu all Auerzäit, och owes an um Weekend, wa net geschafft gëtt.",
        "Fir virzebereeden huet de Club all Kegelen a Markéierunge vun der Piste ewechgeholl, fir dass den Terrain prett fir den Ufank vun den Aarbechte konnt iwwerginn ginn.",
      ],
    },
  },
];
