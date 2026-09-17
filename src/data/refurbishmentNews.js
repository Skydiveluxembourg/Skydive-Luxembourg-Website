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
 *    many as you like. They render two to a row, in order, each sized by its own
 *    aspect ratio so a portrait and a landscape shot end up the same height.
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
import rolledForestImg from '../assets/img/news/2026-09-17-runway-rolled-forest-end.webp';
import rolledVillageImg from '../assets/img/news/2026-09-17-runway-rolled-village-end.webp';
import rollerImg from '../assets/img/news/2026-09-17-roller.webp';
import tractorImg from '../assets/img/news/2026-09-17-tractor.webp';
import groovesWideImg from '../assets/img/news/2026-09-14-runway-grooves-wide.webp';
import centrelineImg from '../assets/img/news/2026-09-14-runway-centreline.webp';
import fencingImg from '../assets/img/news/2026-09-08-fence-line.webp';

export const posts = [
  {
    id: '2026-09-17-ploughing-and-compaction',
    date: '2026-09-17',

    images: [
      {
        src: rolledForestImg,
        alt: {
          en: 'The bare earth runway after ploughing and rolling, looking towards the wooded end, with the fenced boundary on the right',
          fr: "La piste en terre nue après labour et compactage, en direction de la partie boisée, la clôture du chantier sur la droite",
          de: 'Die Piste aus blankem Erdreich nach dem Pflügen und Verdichten, Blick zum bewaldeten Ende, rechts die Absperrung',
          lu: "D'Piste aus blousem Buedem nom Plouen a Verdichten, Bléck op dat bewaldent Enn, riets d'Absperrung",
        },
      },
      {
        src: rolledVillageImg,
        alt: {
          en: 'Roller tracks running the full width of the ploughed runway, with the hangars and the village on the horizon',
          fr: "Les traces du rouleau sur toute la largeur de la piste labourée, les hangars et le village à l'horizon",
          de: 'Walzenspuren über die gesamte Breite der gepflügten Piste, am Horizont die Hallen und das Dorf',
          lu: "Walzespuren iwwer déi ganz Breet vun der geplouter Piste, um Horizont d'Hale an d'Duerf",
        },
      },
      {
        src: rollerImg,
        alt: {
          en: 'A single drum roller parked at the edge of the worked ground, the ploughed surface stretching away to the left',
          fr: "Un rouleau compacteur à bille unique à l'arrêt en bordure du terrain travaillé, la surface labourée s'étendant sur la gauche",
          de: 'Eine Walze am Rand der bearbeiteten Fläche, links davon die gepflügte Oberfläche',
          lu: "Eng Walz um Rand vun der bearbechter Fläch, lénks dovunner déi geplouten Uewerfläch",
        },
      },
      {
        src: tractorImg,
        alt: {
          en: 'A tractor with a mounted implement standing at the edge of the field in the low evening sun',
          fr: "Un tracteur équipé d'un outil porté, à l'arrêt en bordure du terrain dans la lumière rasante du soir",
          de: 'Ein Traktor mit Anbaugerät am Feldrand in der tief stehenden Abendsonne',
          lu: "En Trakter mat Unbaugerät um Feldrand an der déif stoender Owesonn",
        },
      },
    ],

    title: {
      en: 'Ploughing and compaction under way, slowed by dry soil',
      fr: 'Labour et compactage en cours, ralentis par la sécheresse du sol',
      de: 'Pflügen und Verdichten laufen - der trockene Boden bremst',
      lu: 'Plouen a Verdichten am Gaang, gebremst vum dréchene Buedem',
    },

    body: {
      en: [
        'In the swampy section in the forest, the contractor broke up the ground to a depth of 40 centimetres, loosening the soil in preparation for the next steps. On Monday the whole field was ploughed, and work continued through the rest of the week on compacting the whole runway.',
        'Compaction has not advanced as expected. The soil is extremely dry, and that is what is holding the work back.',
        'Next week the ground will be watered, with the help of the Commune of Wiltz, so that the runway can be compacted properly. For once in skydiving, we would be glad to see rain.',
        'The asphalt way crossing the runway will stay in place. The grass area around it will be flattened, to reduce the risk of a bump forming there.',
      ],
      fr: [
        "Dans la zone marécageuse de la partie boisée de la piste, l'entreprise a ameubli le sol sur 40 centimètres de profondeur, afin de préparer les étapes suivantes. Lundi, l'entreprise a labouré la totalité du terrain, et les travaux se sont poursuivis toute la semaine pour compacter l'ensemble de la piste.",
        "Le compactage n'avance pas aussi vite que prévu. Le sol est extrêmement sec, et c'est ce qui freine les travaux.",
        "La semaine prochaine, le sol sera arrosé avec l'aide de la Commune de Wiltz, afin que la piste puisse être compactée correctement. Pour une fois en parachutisme, la pluie serait la bienvenue.",
        "Le chemin goudronné qui traverse la piste restera en place ; en revanche, la zone en herbe qui l'entoure sera aplanie, afin de limiter le risque de formation d'une bosse à cet endroit.",
      ],
      de: [
        'Im sumpfigen Waldabschnitt hat die Baufirma den Boden 40 Zentimeter tief aufgebrochen und aufgelockert, als Vorbereitung auf die nächsten Schritte. Am Montag hat die Baufirma das gesamte Feld gepflügt, und die ganze Woche über wurde an der Verdichtung der kompletten Piste gearbeitet.',
        'Das Verdichten kommt allerdings nicht so voran wie erwartet. Der Boden ist extrem trocken, und genau das bremst die Arbeiten.',
        'Nächste Woche wird der Boden mit Unterstützung der Gemeinde Wiltz gewässert, damit sich die Piste richtig verdichten lässt. Regen ist im Fallschirmsport sonst nie willkommen - diesmal würden wir uns ausnahmsweise darüber freuen.',
        'Der asphaltierte Weg, der die Piste kreuzt, bleibt bestehen. Die Grasfläche ringsherum wird eingeebnet, um das Risiko einer Bodenwelle an dieser Stelle zu verringern.',
      ],
      lu: [
        "Am sompege Beräich am Bësch huet d'Baufirma de Buedem 40 Zentimeter déif opgebrach an opgelackert, als Virbereedung op déi nächst Schrëtt. E Méindeg huet si dat ganzt Feld geplout, an déi ganz Woch iwwer gouf weider un der Verdichtung vun der ganzer Piste geschafft.",
        "D'Verdichtung ass awer net esou virugaangen, wéi erwaart. De Buedem ass extrem dréchen, a genee dat bremst d'Aarbechten.",
        "Nächst Woch gëtt de Buedem mat der Hëllef vun der Gemeng Wiltz beweessert, fir dass d'Piste richteg ka verdicht ginn. Am Fallschiermsprangen hätte mir fir eng Kéier näischt géint e bësse Reen.",
        "Den asphaltéierte Wee, deen iwwer d'Piste leeft, bleift wou en ass. D'Grasfläch ronderëm gëtt awer planéiert, fir de Risiko ze verklengeren, dass do e Bockel entsteet.",
      ],
    },
  },
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
