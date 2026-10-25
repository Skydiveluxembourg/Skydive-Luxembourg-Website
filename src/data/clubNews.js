/**
 * clubNews.js - news shown on the /news page, reached from the main menu.
 * Runway refurbishment updates, club activities, events and other club news
 * share the same chronological feed. Refurbishment reports are grouped into
 * one story on the index, with every dated update preserved inside it.
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
 *    With an odd number, the FIRST photo leads alone at full width and the rest
 *    follow in pairs, so list the photo you want to lead first.
 *    Astro optimises and resizes them automatically - no need to pre-scale.
 *
 * 2. Add a new object to the TOP of `posts`, newest first. Ordinary club news
 *    gets its own entry; refurbishment reports join the single project story.
 *
 * 3. `title`, `summary`, `body` and each image's `alt` are keyed by language.
 *    English is the fallback: if a translation is missing, the page shows `en`
 *    rather than an empty block, so it is safe to publish in English first and
 *    translate later.
 *
 * 4. `summary` is one or two short sentences covering the main takeaway. For
 *    standalone stories it appears on the index and before the photographs.
 *    Grouped refurbishment reports use the project introduction on the index.
 *
 * 5. `body` is an array of paragraphs - add as many strings as you need.
 *
 * 6. `date` is the event/report date in ISO (YYYY-MM-DD), formatted per language.
 *    Optional `publishedAt` and `modifiedAt` describe actual website publication
 *    and substantive editing dates, once known. Do not copy the event date or
 *    generate a fresh timestamp on every build: these feed article metadata.
 *
 * 7. Optional `category: 'refurbishment'` identifies runway updates, so the
 *    reports appear in the grouped project story. Its date and thumbnail follow
 *    the newest report automatically. Other club news can omit this category.
 * ---------------------------------------------------------------------------
 */

// Photos, newest first. Add one import per photo.
import partyGroupImg from '../assets/img/news/2026-10-24-end-of-season-group.jpeg';
import partyConversationImg from '../assets/img/news/2026-10-24-end-of-season-conversation.jpeg';
import partyTableImg from '../assets/img/news/2026-10-24-end-of-season-table.jpeg';
import sownRunwayImg from '../assets/img/news/2026-10-17-prepared-runway.jpeg';
import electricFenceImg from '../assets/img/news/2026-10-17-electric-fence.jpeg';
import graderImg from '../assets/img/news/2026-10-17-grader.jpeg';
import fencedRunwayImg from '../assets/img/news/2026-10-17-fenced-runway.jpeg';
import treelineImg from '../assets/img/news/2026-09-24-machines-treeline.webp';
import sunsetRunwayImg from '../assets/img/news/2026-09-24-runway-sunset-centreline.webp';
import truckImg from '../assets/img/news/2026-09-24-truck-container.webp';
import rolledForestImg from '../assets/img/news/2026-09-17-runway-rolled-forest-end.webp';
import rolledVillageImg from '../assets/img/news/2026-09-17-runway-rolled-village-end.webp';
import rollerImg from '../assets/img/news/2026-09-17-roller.webp';
import tractorImg from '../assets/img/news/2026-09-17-tractor.webp';
import groovesWideImg from '../assets/img/news/2026-09-14-runway-grooves-wide.webp';
import centrelineImg from '../assets/img/news/2026-09-14-runway-centreline.webp';
import fencingImg from '../assets/img/news/2026-09-08-fence-line.webp';

export const posts = [
  {
    id: '2026-10-24-end-of-season-party',
    date: '2026-10-24',
    thumbnailFit: 'contain',

    images: [
      {
        src: partyGroupImg,
        alt: {
          en: "A group smiling towards the camera around a long dinner table in the club hangar, with plates, glasses and flags visible",
          fr: "Un groupe souriant à l'objectif autour d'une longue table de repas dans le hangar du club, avec des assiettes, des verres et des drapeaux",
          de: "Eine Gruppe lächelt an einer langen gedeckten Tafel in der Vereinshalle zur Kamera, mit Tellern, Gläsern und Flaggen im Bild",
          lu: "Eng Grupp, déi ronderëm e laangen Iessdësch am Clubhangar sëtzt an an d'Kamera laacht, mat Telleren, Glieser a Fändelen am Bild",
        },
      },
      {
        src: partyConversationImg,
        alt: {
          en: "People chatting and eating along a dinner table by candlelight",
          fr: "Des convives discutant et mangeant autour d'une table à la lumière des bougies",
          de: "Menschen unterhalten sich und essen an einem Tisch bei Kerzenlicht",
          lu: "Leit, déi sech bei Käerzeliicht laanscht en Iessdësch ënnerhalen an iessen",
        },
      },
      {
        src: partyTableImg,
        alt: {
          en: "A close view along the dinner table with seated diners, plates and drinks",
          fr: "Vue rapprochée dans la longueur de la table, avec des convives assis, des assiettes et des boissons",
          de: "Naher Blick entlang der Tafel mit sitzenden Gästen, Tellern und Getränken",
          lu: "Bléck vun no laanscht den Iessdësch, mat sëtzende Gäscht, Telleren a Gedrénks",
        },
      },
    ],

    title: {
      en: 'Ending the 2026 season together',
      fr: 'Terminer ensemble la saison 2026',
      de: 'Gemeinsam die Saison 2026 ausklingen lassen',
      lu: "D'Saison 2026 zesummen ofschléissen",
    },

    summary: {
      en: "A shared meal and good company in Noertrange rounded off an afternoon of getting the dropzone ready for winter.",
      fr: "Un repas partagé et le plaisir de se retrouver à Noertrange ont conclu un après-midi consacré à préparer la dropzone pour l'hiver.",
      de: "Nach einem Nachmittag mit Wintervorbereitungen auf der Dropzone ließen wir die Saison bei einem gemeinsamen Essen in Noertrange ausklingen.",
      lu: "No engem Nomëtteg, wou d'Dropzone fir de Wanter virbereet gouf, hu mir d'Saison mat engem Iessen a gudder Gesellschaft zu Noertrange ofgeschloss.",
    },

    body: {
      en: [
        "After an afternoon preparing the dropzone for winter, it was time to gather around the table. Our traditional end-of-season party brought members, friends and family together in Noertrange to share a meal, catch up and look back on the season.",
        "Helping out, sharing stories and making everyone feel welcome are all part of life at Skydive Luxembourg. Thank you to everyone who lent a hand during the afternoon and joined us for the evening. It was a lovely way to close the season together.",
      ],
      fr: [
        "Après un après-midi à préparer la dropzone pour l'hiver, il était temps de se retrouver autour de la table. Notre traditionnelle fête de fin de saison a réuni membres, amis et familles à Noertrange pour partager un repas, prendre des nouvelles et revenir sur la saison.",
        "Donner un coup de main, partager des histoires et faire en sorte que chacun se sente le bienvenu font partie de la vie à Skydive Luxembourg. Merci à toutes celles et ceux qui ont aidé pendant l'après-midi et nous ont rejoints pour la soirée. C'était une belle façon de terminer la saison ensemble.",
      ],
      de: [
        "Nach einem Nachmittag, an dem wir die Dropzone für den Winter vorbereitet hatten, war es Zeit, gemeinsam am Tisch Platz zu nehmen. Unsere traditionelle Saisonabschlussfeier brachte Mitglieder, Freunde und Familien in Noertrange zusammen, um gemeinsam zu essen, sich auszutauschen und auf die Saison zurückzublicken.",
        "Mit anpacken, Geschichten teilen und dafür sorgen, dass sich alle willkommen fühlen: Das gehört zum Leben bei Skydive Luxembourg. Danke an alle, die am Nachmittag mitgeholfen haben und am Abend dabei waren. Es war ein schöner gemeinsamer Abschluss der Saison.",
      ],
      lu: [
        "No engem Nomëtteg, wou mir d'Dropzone fir de Wanter virbereet haten, war et Zäit, eis ëm den Dësch ze versammelen. Eist traditionellt Fest zum Enn vun der Saison huet Memberen, Frënn a Familljen zu Noertrange zesummebruecht, fir zesummen z'iessen, Neiegkeeten auszetauschen an op d'Saison zeréckzekucken.",
        "Mathëllefen, Geschichten deelen an dofir suergen, dass jidderee sech wëllkomm fillt: dat gehéiert zum Liewe bei Skydive Luxembourg. Merci u jiddereen, deen am Nomëtteg matgehollef huet an owes dobäi war. Et war eng flott Manéier, d'Saison zesummen ofzeschléissen.",
      ],
    },
  },
  {
    id: '2026-10-17-grass-sown-and-fence-installed',
    date: '2026-10-17',
    category: 'refurbishment',

    images: [
      {
        src: sownRunwayImg,
        alt: {
          en: "The prepared bare-earth runway looking straight towards the hangars and village at sunset",
          fr: "La piste en terre préparée, vue dans l'axe vers les hangars et le village au coucher du soleil",
          de: "Die vorbereitete Piste aus blankem Erdreich, Blick geradeaus zu den Hallen und zum Dorf bei Sonnenuntergang",
          lu: "Déi preparéiert Piste aus blousem Buedem, riicht a Richtung vun den Halen an dem Duerf beim Sonnenënnergang gesinn",
        },
      },
      {
        src: electricFenceImg,
        alt: {
          en: "Electric fence posts and strands with a yellow warning sign beside the runway, with grass on the left and prepared soil on the right",
          fr: "Piquets et fils d'une clôture électrique avec un panneau d'avertissement jaune à côté de la piste, de l'herbe à gauche et le sol préparé à droite",
          de: "Pfosten und Drähte eines Elektrozauns mit gelbem Warnschild neben der Piste, links Gras und rechts vorbereiteter Boden",
          lu: "Pinn an Dréit vun engem Elektrozaun mat engem giele Warnschëld nieft der Piste, lénks Gras a riets preparéierte Buedem",
        },
      },
      {
        src: graderImg,
        alt: {
          en: "A yellow grader parked on the grass beside the runway under a blue sky with clouds",
          fr: "Une niveleuse jaune garée sur l'herbe à côté de la piste, sous un ciel bleu avec des nuages",
          de: "Ein gelber Grader auf der Grasfläche neben der Piste unter blauem Himmel mit Wolken",
          lu: "Eng giel Planéiermaschinn um Gras nieft der Piste ënner engem bloen Himmel mat Wolleken",
        },
      },
      {
        src: fencedRunwayImg,
        alt: {
          en: "The bare-earth runway behind white electric fence posts at the near end, with hangars in the distance under an overcast sky",
          fr: "La piste en terre nue derrière les piquets blancs d'une clôture électrique au premier plan, les hangars au loin sous un ciel couvert",
          de: "Die Piste aus blankem Erdreich hinter weißen Elektrozaunpfosten im Vordergrund, in der Ferne Hallen unter bedecktem Himmel",
          lu: "D'Piste aus blousem Buedem hannert wäissen Elektrozaunpinn am Virdergrond, am Hannergrond d'Halen ënner engem bedeckten Himmel",
        },
      },
    ],

    title: {
      en: 'Grass sown and electric fence installed',
      fr: 'Gazon semé et clôture électrique installée',
      de: 'Gras eingesät und Elektrozaun aufgestellt',
      lu: 'Gras geséint an Elektrozaun opgestallt',
    },

    summary: {
      en: "The final runway levelling and soil tilling are done, and grass seed has been sown. An electric fence has been installed to protect the area while the grass takes root.",
      fr: "Le nivellement final et le fraisage du sol sont terminés, et le gazon a été semé. Une clôture électrique a été installée pour protéger la zone pendant que le gazon prend racine.",
      de: "Die abschließenden Planier- und Fräsarbeiten an der Piste sind erledigt, und der Grassamen ist ausgesät. Ein Elektrozaun soll den Bereich schützen, während das Gras anwächst.",
      lu: "Dat lescht Planéieren an d'Fräse vum Buedem si gemaach, an de Grassom ass geséint. En Elektrozaun soll de Beräich schützen, wärend d'Gras Zäit kritt fir unzewuessen.",
    },

    body: {
      en: [
        "The final levelling and soil tilling of the runway have been completed, and the grass seed has now been sown.",
        "Ponts et Chaussées has installed an electric fence around the refurbished area to keep wildlife away from the newly sown ground.",
        "The grass now needs time to grow and develop strong roots. We therefore expect the 2027 skydiving season to start a little later than usual. We’re looking forward to getting back in the air.",
      ],
      fr: [
        "Le nivellement final et le fraisage du sol de la piste sont terminés. Le gazon a maintenant été semé.",
        "Les Ponts et Chaussées ont installé une clôture électrique autour de la zone rénovée pour tenir la faune à l'écart du terrain fraîchement semé.",
        "Le gazon a maintenant besoin de temps pour pousser et développer des racines solides. Nous prévoyons donc un début de saison de parachutisme 2027 un peu plus tardif que d'habitude. Nous avons hâte de reprendre les sauts.",
      ],
      de: [
        "Die abschließenden Planier- und Fräsarbeiten an der Piste sind erledigt. Der Grassamen ist inzwischen ausgesät.",
        "Um den sanierten Bereich wurde von Ponts et Chaussées ein Elektrozaun aufgestellt, der Wildtiere von der frisch eingesäten Fläche fernhalten soll.",
        "Das Gras braucht jetzt Zeit zum Wachsen und für kräftige Wurzeln. Deshalb rechnen wir damit, dass die Sprungsaison 2027 etwas später als üblich beginnt. Wir freuen uns schon darauf, wieder in die Luft zu gehen.",
      ],
      lu: [
        "Déi lescht Aarbechte fir d'Piste ze planéieren an de Buedem ze fräse si gemaach, an de Grassom ass elo geséint.",
        "Ronderëm den erneierte Beräich ass vun de Ponts et Chaussées en Elektrozaun opgestallt ginn, fir Wëld vum frësch geséinten Terrain ewechzehalen.",
        "D'Gras brauch elo Zäit fir ze wuessen a staark Wuerzelen ze entwéckelen. Dofir rechne mir domat, dass d'Saison 2027 fir d'Fallschiermsprangen e bësse méi spéit ufänkt wéi gewinnt. Mir freeën eis schonn drop, nees an d’Luucht ze goen.",
      ],
    },
  },
  {
    id: '2026-09-24-levelling-and-sowing',
    date: '2026-09-24',
    category: 'refurbishment',

    images: [
      {
        src: treelineImg,
        alt: {
          en: "Machines parked along the treeline beside the runway at dusk, with the village and its church spire on the horizon",
          fr: "Au crépuscule, des engins à l'arrêt le long de la lisière des arbres, à côté de la piste, avec le village et son clocher à l'horizon",
          de: "Entlang der Baumreihe neben der Piste abgestellte Maschinen in der Abenddämmerung, am Horizont das Dorf mit seinem Kirchturm",
          lu: "Maschinnen, déi an der Dämmerung laanscht d'Bamrei nieft der Piste geparkt sinn, an um Horizont d'Duerf mat sengem Kierchtuerm",
        },
      },
      {
        src: sunsetRunwayImg,
        alt: {
          en: "The bare runway at sunset, seen along a painted centreline marker, with machines at the far end between the trees",
          fr: "La piste en terre nue au coucher du soleil, vue dans l'alignement d'une marque d'axe peinte, avec des engins tout au bout entre les arbres",
          de: "Die Piste aus blankem Erdreich bei Sonnenuntergang, Blick entlang einer aufgemalten Mittellinienmarkierung, am anderen Ende Maschinen zwischen den Bäumen",
          lu: "Déi blouss Piste beim Sonnenënnergang, laanscht eng opgemolt Mëttelmarkéierung gesinn, mat Maschinnen um aneren Enn tëscht de Beem",
        },
      },
      {
        src: truckImg,
        alt: {
          en: "A heavy truck with a loaded container parked on the grass beside the runway, the setting sun beyond",
          fr: "Un poids lourd avec une benne chargée, garé sur l'herbe à côté de la piste, le soleil couchant au loin",
          de: "Ein schwerer Lastwagen mit beladenem Container, auf der Grasfläche neben der Piste abgestellt, dahinter die untergehende Sonne",
          lu: "E schwéiere Camion mat engem geluedene Container, um Gras nieft der Piste geparkt, an dohannert d'Sonn, déi ënnergeet",
        },
      },
    ],

    title: {
      en: "Levelling continues, with sowing planned before winter",
      fr: "Le nivellement se poursuit, le semis est prévu avant l'hiver",
      de: "Die Piste wird weiter eingeebnet, Einsaat vor dem Winter geplant",
      lu: "D'Planéiere geet weider, virum Wanter soll geséint ginn",
    },

    summary: {
      en: "Levelling continues ahead of grass sowing planned before winter. The soil still needs more water for compaction, and an electric fence is planned to keep wild boar off the new grass.",
      fr: "Le nivellement se poursuit avant le semis prévu avant l'hiver. Le sol doit encore absorber de l'eau pour le compactage, et une clôture électrique est prévue pour protéger le nouveau gazon des sangliers.",
      de: "Die Piste wird für die vor dem Winter geplante Einsaat weiter eingeebnet. Der Boden braucht mehr Wasser zum Verdichten; ein Elektrozaun soll das neue Gras vor Wildschweinen schützen.",
      lu: "D'Piste gëtt weider planéiert, virum Wanter soll geséint ginn. De Buedem brauch nach méi Waasser fir d'Verdichtung; en Elektrozaun soll dat neit Gras virun de Wëllschwäin schützen.",
    },

    body: {
      en: [
        "The next step for the runway is sowing: the grass seed is due to go into the ground before winter. The work on the airfield at the moment is preparing the ground for it.",
        "Heavy machinery is on site straightening and levelling the runway further, so that the surface the grass will grow on is as even as it can be made.",
        "The ground was watered last week and compaction advanced with it, but the soil is still not moist enough. It needs to take up more water before the runway will compact as it should.",
        "An electric fence against wild boar will be put in place as well. Boar root up open ground as they feed, and a fresh sowing would not survive that, so keeping them out is part of giving the new grass the best conditions to establish.",
      ],
      fr: [
        "La prochaine étape sur la piste est le semis : les graines de gazon doivent être mises en terre avant l'hiver. Les travaux menés actuellement sur l'aérodrome préparent le sol à les recevoir.",
        "Des engins lourds poursuivent le redressement et le nivellement de la piste, afin que la surface sur laquelle l'herbe poussera soit aussi plane que possible.",
        "Le sol a été arrosé la semaine dernière et le compactage a pu progresser, mais la terre n'est toujours pas assez humide. Il faut qu'elle absorbe encore de l'eau pour que la piste se compacte correctement.",
        "Une clôture électrique sera par ailleurs installée contre les sangliers. Ces derniers retournent la terre nue pour se nourrir, et un semis tout frais n'y résisterait pas : les tenir à l'écart fait donc partie des mesures prises pour donner au nouveau gazon les meilleures chances de reprise.",
      ],
      de: [
        "Der nächste Schritt für die Piste ist die Einsaat: Das Saatgut soll noch vor dem Winter in den Boden. Die Arbeiten, die gerade auf dem Flugplatz laufen, bereiten den Boden genau darauf vor.",
        "Dafür ist im Moment schweres Gerät im Einsatz: Die Piste wird weiter begradigt und eingeebnet, damit die Fläche, auf der das Gras später wachsen soll, so eben wird wie nur möglich.",
        "Vergangene Woche wurde der Boden gewässert, und das Verdichten ist damit ein Stück vorangekommen. Feucht genug ist der Boden aber immer noch nicht: Er muss mehr Wasser aufnehmen, bevor sich die Piste so verdichten lässt, wie es sein soll.",
        "Außerdem wird ein Elektrozaun gegen Wildschweine aufgestellt. Wildschweine wühlen bei der Futtersuche offenen Boden auf, und eine frische Einsaat würde das nicht überstehen. Die Tiere fernzuhalten, gehört deshalb dazu, damit das neue Gras die besten Bedingungen zum Anwachsen hat.",
      ],
      lu: [
        "Den nächste Schrëtt op der Piste ass d'Séien: de Grassom soll nach virum Wanter an de Buedem kommen. D'Aarbechten, déi de Moment op der Fluchplaz lafen, bereeden de Buedem dofir vir.",
        "Mat schwéiere Maschinne gëtt d'Piste weider riicht gemaach a planéiert, fir dass d'Fläch, op där d'Gras spéider wuesse soll, esou eben gëtt wéi nëmme méiglech.",
        "Lescht Woch ass de Buedem beweessert ginn, an d'Verdichtung ass domat virugaangen. Mee de Buedem ass nach ëmmer net fiicht genuch: hie muss nach méi Waasser ophuelen, ier d'Piste sech esou verdicht, wéi se soll.",
        "Donieft gëtt en Elektrozaun géint d'Wëllschwäin opgestallt. Wëllschwäin, déi op der Sich no Fudder sinn, wullen de fräie Buedem op, an eng frësch Saat géif dat net iwwerliewen. Si dobaussen ze halen gehéiert dofir dozou, fir dem neie Gras déi bescht Konditiounen ze ginn, fir dass et gutt uwiisst.",
      ],
    },
  },
  {
    id: '2026-09-17-ploughing-and-compaction',
    date: '2026-09-17',
    category: 'refurbishment',

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

    summary: {
      en: "Ploughing is complete, and runway compaction is under way. Very dry soil is slowing progress; watering is planned with help from the Commune of Wiltz.",
      fr: "Le labour est terminé et le compactage de la piste est en cours. Le sol très sec ralentit les travaux ; un arrosage est prévu avec l'aide de la Commune de Wiltz.",
      de: "Die Piste ist gepflügt, die Verdichtung läuft. Der sehr trockene Boden bremst die Arbeiten; mit Unterstützung der Gemeinde Wiltz soll bewässert werden.",
      lu: "D'Piste ass geplout an d'Verdichtung ass am Gaang. De ganz dréchene Buedem bremst d'Aarbechten; mat der Hëllef vun der Gemeng Wiltz soll beweessert ginn.",
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
    category: 'refurbishment',

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

    summary: {
      en: "Groundwork has begun on roughly 200 metres of runway, loosening the turf and soil before levelling. The airfield remains closed, and only the contractor's personnel may enter the fenced area.",
      fr: "Les travaux préparatoires ont commencé sur environ 200 mètres de piste, avec l'ameublissement du gazon et du sol avant le nivellement. L'aérodrome reste fermé et seul le personnel de l'entreprise peut entrer dans la zone clôturée.",
      de: "Auf rund 200 Metern Piste haben die Vorarbeiten begonnen: Grasnarbe und Boden werden vor dem Einebnen aufgelockert. Der Flugplatz bleibt geschlossen; nur das Personal der Baufirma darf den abgesperrten Bereich betreten.",
      lu: "Op ronn 200 Meter vun der Piste hunn d'Viraarbechten ugefaangen: d'Grasnarb an de Buedem ginn opgelackert, ier planéiert gëtt. D'Fluchplaz bleift zou; nëmmen d'Personal vun der Baufirma dierf an den ofgespaarte Beräich.",
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
    category: 'refurbishment',

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

    summary: {
      en: "The runway work area is now fenced off, and the club has removed the cones and markers. Access is restricted to the contractor's personnel, including evenings and weekends.",
      fr: "La zone des travaux de la piste est désormais clôturée, et le club a retiré les cônes et balises. L'accès est réservé au personnel de l'entreprise, y compris le soir et le week-end.",
      de: "Der Arbeitsbereich an der Piste ist abgesperrt, und der Club hat Kegel und Markierungen entfernt. Nur das Personal der Baufirma darf das Gelände betreten, auch abends und am Wochenende.",
      lu: "D'Baustell un der Piste ass ofgespaart, an de Club huet d'Kegelen an d'Markéierungen ewechgeholl. Nëmmen d'Personal vun der Baufirma dierf eran, och owes an um Weekend.",
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

export const refurbishmentUpdates = posts.filter((post) => post.category === 'refurbishment');

// Keep the project URL stable as more dated reports are added.
const refurbishmentStory = {
  id: 'runway-refurbishment',
  date: refurbishmentUpdates[0]?.date,
  title: {
    en: 'Runway refurbishment at Noertrange',
    fr: 'Réfection de la piste à Noertrange',
    de: 'Pistensanierung in Noertrange',
    lu: 'Erneierung vun der Piste zu Noertrange',
  },
  teaser: {
    en: 'Updates and photos from the runway refurbishment at Noertrange.',
    fr: 'Actualités et photos de la réfection de la piste à Noertrange.',
    de: 'Berichte und Fotos zur Pistensanierung in Noertrange.',
    lu: 'Neiegkeeten a Fotoe vun der Erneierung vun der Piste zu Noertrange.',
  },
  summary: {
    en: 'Follow the runway refurbishment from ground preparation and grass sowing through the time needed for the new turf to establish. All dated progress reports and photos are collected here.',
    fr: 'Suivez la réfection de la piste, de la préparation du sol au semis du gazon, puis au temps nécessaire à son enracinement. Tous les comptes rendus datés et les photos sont réunis ici.',
    de: 'Verfolge die Pistensanierung von der Bodenvorbereitung und Einsaat bis zur Zeit, die das neue Gras zum Anwachsen braucht. Hier findest du alle datierten Berichte und Fotos.',
    lu: "Verfolleg d'Erneierung vun der Piste, vun der Virbereedung vum Buedem an dem Séie vum Gras bis bei d'Zäit, déi dat neit Gras brauch fir unzewuessen. All datéiert Berichter a Fotoe sinn hei gesammelt.",
  },
  images: refurbishmentUpdates[0]?.images?.slice(0, 1) ?? [],
  updates: refurbishmentUpdates,
};

// The single project entry takes the newest report's place in the feed;
// unrelated club stories remain independent entries in their original order.
export const newsEntries = posts.flatMap((post) => {
  if (post.category !== 'refurbishment') return [post];
  return post === refurbishmentUpdates[0] ? [refurbishmentStory] : [];
});
