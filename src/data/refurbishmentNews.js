/**
 * refurbishmentNews.js - updates shown on the /news page while the runway is
 * being refurbished. The page is linked only from the site-wide NoticeBanner.
 *
 * ---------------------------------------------------------------------------
 * HOW TO ADD AN UPDATE
 * ---------------------------------------------------------------------------
 * 1. Photo (optional): put the file in src/assets/img/news/ and import it at
 *    the top of this file, e.g.
 *        import worksJuly from '../assets/img/news/works-july.webp';
 *    Astro optimises and resizes it automatically - no need to pre-scale.
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
import fencingImg from '../assets/img/news/2026-09-08-fence-line.webp';

export const posts = [
  {
    id: '2026-09-08-work-area-fenced',
    date: '2026-09-08',

    image: fencingImg,
    imageAlt: {
      en: 'Wooden posts strung with red-and-white barrier tape, marking the edge of the work area alongside the paved path',
      fr: "Piquets en bois reliés par une rubalise rouge et blanche, marquant la limite de la zone de chantier le long du chemin goudronné",
      de: 'Holzpfosten mit rot-weißem Absperrband markieren die Grenze der Baustelle entlang des asphaltierten Wegs',
      lu: "Holzpinn mat rout-wäissem Absperrband markéieren d'Grenz vun der Baustell laanscht den asphaltéierte Wee",
    },

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
