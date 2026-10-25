// Shared labels and formatting for the news index and individual articles.
const copy = {
  en: {
    author: 'By',
    title: 'Club news',
    lead: 'Club life, events and the latest from the airfield. Newest updates first.',
    updates: 'Latest news',
    updated: 'Updated',
    statusTitle: 'Airfield closed for runway refurbishment',
    statusBody: 'Reopening is expected by June 2027.',
    latestWorks: 'Latest works report',
    bookingLabel: 'Tandem booking during the works',
    bookingBody: 'You can still buy a tandem jump. You will receive a reservation code to choose your date once reservations reopen.',
    bookingLink: 'Tandem booking information',
    read: 'Read update', back: 'All club news', newer: 'Newer update', older: 'Older update',
    articleNav: 'More club news', photos: 'Photos',
    empty: 'There are no updates yet. Please check back soon.', contact: 'Questions? Contact us',
  },
  fr: {
    author: 'Par',
    title: 'Actualités du club',
    lead: 'La vie du club, les événements et les nouvelles de l’aérodrome. Les actualités les plus récentes en premier.',
    updates: 'Dernières actualités',
    updated: 'Mise à jour le',
    statusTitle: 'Aérodrome fermé pour réfection de la piste',
    statusBody: 'La réouverture est prévue d’ici juin 2027.',
    latestWorks: 'Dernier point sur les travaux',
    bookingLabel: 'Réserver un tandem pendant les travaux',
    bookingBody: 'Vous pouvez toujours acheter un saut en tandem. Vous recevrez un code pour choisir votre date dès la réouverture des réservations.',
    bookingLink: 'Informations sur les réservations tandem',
    read: 'Lire la suite', back: 'Toutes les actualités', newer: 'Actualité plus récente', older: 'Actualité plus ancienne',
    articleNav: 'Autres actualités du club', photos: 'Photos',
    empty: 'Il n’y a pas encore d’actualité. Revenez bientôt.', contact: 'Une question ? Contactez-nous',
  },
  de: {
    author: 'Von',
    title: 'Neuigkeiten aus dem Verein',
    lead: 'Vereinsleben, Veranstaltungen und Aktuelles vom Flugplatz. Die neuesten Meldungen zuerst.',
    updates: 'Aktuelle Meldungen',
    updated: 'Aktualisiert am',
    statusTitle: 'Flugplatz wegen Pistensanierung geschlossen',
    statusBody: 'Die Wiedereröffnung ist für Juni 2027 geplant.',
    latestWorks: 'Letzter Bericht zu den Arbeiten',
    bookingLabel: 'Tandem buchen während der Arbeiten',
    bookingBody: 'Du kannst weiterhin einen Tandemsprung kaufen. Du erhältst einen Reservierungscode, mit dem du deinen Wunschtermin buchen kannst, sobald die Reservierungen wieder offen sind.',
    bookingLink: 'Informationen zur Tandembuchung',
    read: 'Weiterlesen', back: 'Alle Neuigkeiten', newer: 'Neuere Meldung', older: 'Ältere Meldung',
    articleNav: 'Weitere Neuigkeiten aus dem Verein', photos: 'Fotos',
    empty: 'Es gibt noch keine Neuigkeiten. Schau bald wieder vorbei.', contact: 'Fragen? Kontaktiere uns',
  },
  lu: {
    author: 'Vum',
    title: 'Neiegkeeten aus dem Veräin',
    lead: 'Veräinsliewen, Evenementer an Neiegkeete vun der Fluchplaz. Déi neiste Meldunge fir d’éischt.',
    updates: 'Déi neisten Neiegkeeten',
    updated: 'Aktualiséiert den',
    statusTitle: 'Fluchplaz wéinst Pistenerneierung zou',
    statusBody: 'Mir rechne mat der Reouverture am Juni 2027.',
    latestWorks: 'Leschte Bericht iwwer d’Aarbechten',
    bookingLabel: 'En Tandem während den Aarbechte buchen',
    bookingBody: 'Du kanns weider en Tandemsprong kafen. Du kriss e Reservatiounscode, mat deem s du däi Wonschdatum buche kanns, soubal d’Reservatiounen erëm op sinn.',
    bookingLink: 'Informatiounen iwwer d’Tandemreservatioun',
    read: 'Weiderliesen', back: 'All d’Neiegkeeten', newer: 'Méi nei Meldung', older: 'Méi al Meldung',
    articleNav: 'Weider Neiegkeeten aus dem Veräin', photos: 'Fotoen',
    empty: 'Et gëtt nach keng Neiegkeeten. Kuck geschwë nees laanscht.', contact: 'Froen? Kontaktéier eis',
  },
};

export const newsCopy = (lang) => copy[lang] ?? copy.en;
export const pickNews = (field, lang) => field?.[lang] ?? field?.en;
export const newsLang = (field, lang) => field?.[lang] != null ? lang : 'en';
export const newsHref = (lang, post) => `/${lang}/news/${post.id}/`;

export function formatNewsDate(iso, lang) {
  const locales = { en: 'en-GB', fr: 'fr-FR', de: 'de-DE', lu: 'lb-LU' };
  return new Intl.DateTimeFormat(locales[lang] ?? 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${iso}T12:00:00Z`));
}
