export type Language = 'en' | 'fr';

export interface JourneyMilestone {
  year: string;
  title: string;
  description: string;
  illustration: 'desk' | 'books' | 'trunk' | 'arch' | 'graduate';
}

export interface ProgramItem {
  time: string;
  title: string;
  subtitle: string;
  illustration: 'flutes' | 'hall' | 'cocktail' | 'dinner' | 'orb' | 'music' | 'farewell';
}

export interface GiftWishlistItem {
  name: string;
  note?: string;
}

export interface HotelOption {
  id: string;
  name: string;
  distance: string;
  note: string;
  address: string;
  promoCode: string;
  rate: string;
  websiteUrl: string;
}

export interface InvitationCopy {
  nav: {
    story: string;
    program: string;
    details: string;
    rsvp: string;
    travel: string;
  };
  cover: {
    tapToOpen: string;
    monogramLabel: string;
    replayEnvelope: string;
  };
  hero: {
    kicker: string;
    graduateName: string;
    degree: string;
    date: string;
    confirmAttendance: string;
  };
  invited: {
    title: string;
    message: string;
    countingTitle: string;
    countingSubtitle: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  journey: {
    kicker: string;
    title: string;
    milestones: JourneyMilestone[];
  };
  program: {
    title: string;
    subtitle: string;
    items: ProgramItem[];
  };
  gifts: {
    kicker: string;
    title: string;
    intro: string;
    showListLabel: string;
    hideListLabel: string;
    listIntro: string;
    items: GiftWishlistItem[];
    closingNote: string;
  };
  details: {
    kicker: string;
    title: string;
    subtitle: string;
    ceremonyTitle: string;
    time: string;
    venueName: string;
    addressLine1: string;
    addressLine2: string;
    note: string;
    openMaps: string;
    addCalendar: string;
    calendarAdded: string;
  };
  dressCode: {
    title: string;
    subtitle: string;
    paragraphs: string[];
  };
  rsvp: {
    kicker: string;
    title: string;
    deadline: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    attendingLabel: string;
    acceptOption: string;
    declineOption: string;
    guestsLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    validationError: string;
    confirmedTitleAccept: string;
    confirmedTitleDecline: string;
    confirmedBodyAccept: string;
    confirmedBodyDecline: string;
    editResponse: string;
  };
  travel: {
    title: string;
    subtitle: string;
    gettingThereTitle: string;
    gettingThereIntro: string;
    byAirTitle: string;
    byAirBody: string;
    byCarTitle: string;
    byCarBody: string;
    tipLabel: string;
    tipBody: string;
    whereToStayTitle: string;
    whereToStayIntro: string;
    hotels: HotelOption[];
    promoCodeLabel: string;
    rateLabel: string;
    viewMapLink: string;
    thingsToDoTitle: string;
    thingsToDoIntro: string;
    attractions: string[];
    questionsTitle: string;
    questionsIntro: string;
    email: string;
    phone: string;
  };
  footer: {
    date: string;
    thankYou: string;
    madeWith: string;
    hashtag: string;
  };
  audio: {
    mute: string;
    unmute: string;
  };
}

// December 4, 2026 at 12:30 PM East Africa Time (Nairobi, UTC+3)
export const CEREMONY_TARGET_ISO = '2026-12-04T12:30:00+03:00';

const NAIROBI_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=PP8H%2BQ7V+Nairobi';

export const INVITATION_CONTENT: Record<Language, InvitationCopy> = {
  en: {
    nav: {
      story: 'Journey',
      program: 'Program',
      details: 'Details',
      rsvp: 'RSVP',
      travel: 'Location',
    },
    cover: {
      tapToOpen: 'TAP TO OPEN',
      monogramLabel: 'Open Racheal Kache graduation invitation',
      replayEnvelope: 'Seal',
    },
    hero: {
      kicker: "I'M GRADUATING",
      graduateName: 'Racheal Kache',
      degree: 'Bachelor of Science in Software Engineering',
      date: '4 DECEMBER 2026',
      confirmAttendance: 'CONFIRM ATTENDANCE',
    },
    invited: {
      title: 'You Are Invited',
      message:
        'Together with my loving family, I warmly invite you to an intimate graduation celebration at our home in Nairobi',
      countingTitle: 'Counting The Days',
      countingSubtitle: 'to celebrating this milestone together as a family',
      days: 'DAYS',
      hours: 'HOURS',
      minutes: 'MINUTES',
      seconds: 'SECONDS',
    },
    journey: {
      kicker: 'My Journey',
      title: 'Academic Story',
      milestones: [
        {
          year: '2022',
          title: 'First Day on Campus',
          description:
            'Stepping through the university gates with curiosity, big dreams, and my very first lines of code — the beginning of an unforgettable chapter.',
          illustration: 'desk',
        },
        {
          year: '2023',
          title: 'Late-Night Code & Labs',
          description:
            'Late-night code, warm coffee, and lasting friendships — the year life gently reshaped itself, blessing me with a tiny new reason and a second chance to keep studying.',
          illustration: 'books',
        },
        {
          year: '2024',
          title: 'Engineering Internship',
          description:
            'Stepping beyond the lecture halls, I found my footing again — learning deeply, experiencing so much during my internship, and turning bold ideas into real-world software.',
          illustration: 'trunk',
        },
        {
          year: '2025',
          title: 'The Capstone Project',
          description:
            'Months of architecture, testing, and late-night iterations leading to a proud final defense — after every twist along the way, I finally made it.',
          illustration: 'arch',
        },
        {
          year: '2026',
          title: 'A New Chapter',
          description:
            'Bachelor of Science in Software Engineering earned — morning matriculation complete, degree in hand, and ready to gather at home with the family who walked beside me.',
          illustration: 'graduate',
        },
      ],
    },
    program: {
      title: 'Day Program',
      subtitle: 'HOW OUR DAY UNFOLDS',
      items: [
        {
          time: 'MORNING',
          title: 'MATRICULATION',
          subtitle: 'Racheal attends the morning graduation & matriculation ceremony',
          illustration: 'hall',
        },
        {
          time: '12:30 PM',
          title: 'GUEST ARRIVAL',
          subtitle: 'Warm welcome at our private residence in Nairobi',
          illustration: 'flutes',
        },
        {
          time: '1:30 PM',
          title: 'HOMEMADE MEALS',
          subtitle: 'Gathering around the table for lovingly home-cooked dishes',
          illustration: 'dinner',
        },
        {
          time: '3:00 PM',
          title: 'DRINKS & RELAXING',
          subtitle: 'Refreshing drinks, laughter & catching up warmly',
          illustration: 'cocktail',
        },
        {
          time: '4:00 PM',
          title: 'SPEECHES & TOASTS',
          subtitle: 'Heartfelt words of gratitude & raising a glass as a family',
          illustration: 'orb',
        },
        {
          time: '5:00 PM',
          title: 'FAMILY FUN & MUSIC',
          subtitle: 'Music, photos, stories & enjoying the evening together',
          illustration: 'music',
        },
        {
          time: 'EVENING',
          title: 'WARM GOODBYES',
          subtitle: 'Hugs, keepsake photos & grateful hearts',
          illustration: 'farewell',
        },
      ],
    },
    gifts: {
      kicker: 'A QUIET LITTLE NOTE',
      title: 'Gifts',
      intro:
        "Having you at home sharing homemade meals, laughter, and this milestone with me is honestly more than enough. I feel a little shy even adding this note — only if you happen to feel like bringing a little something and aren't sure what to pick, I quietly tucked a few ideas away below.",
      showListLabel: 'Peek at a Few Wish Ideas',
      hideListLabel: 'Hide Wish Ideas',
      listIntro: "Just a few little things I've been wishing for:",
      items: [
        {
          name: 'Coach Tote Bag',
        },
        {
          name: 'Monetary Gift',
          note: 'Towards my future plans, goals and next chapter.',
        },
        {
          name: 'Portable SSD',
          note: 'For storing projects, files and memories.',
        },
        {
          name: 'Smartwatch',
          note: 'A stylish and useful everyday accessory.',
        },
        {
          name: 'Heels or Shoes',
          note: 'A beautiful pair for my wardrobe.',
        },
        {
          name: 'Jewellery',
          note: 'Timeless, delicate pieces I can treasure.',
        },
        {
          name: 'Skincare Set',
          note: 'A little self-care and pampering.',
        },
        {
          name: 'Flowers',
          note: 'I love lilies.',
        },
      ],
      closingNote: 'Truly, zero pressure at all — simply celebrating together means the world to me.',
    },
    details: {
      kicker: 'JOIN US AT HOME',
      title: 'Event Details',
      subtitle:
        'Not a big formal banquet — just an intimate, joyful gathering at our private residence with the people who mean the most.',
      ceremonyTitle: 'Intimate Family Celebration',
      time: '12:30 PM · Following Morning Matriculation',
      venueName: 'Private Residence · Nairobi',
      addressLine1: 'Plus Code: PP8H+Q7V',
      addressLine2: 'Nairobi, Kenya',
      note: 'In the morning I will attend the matriculation ceremony, and right afterwards we will meet together at the residence for homemade meals, drinks, speeches, and warm family fun.',
      openMaps: 'Open PP8H+Q7V in Maps',
      addCalendar: 'Add to Calendar',
      calendarAdded: 'Calendar File Downloaded',
    },
    dressCode: {
      title: 'Dress Code',
      subtitle: 'SMART CASUAL / RELAXED CHIC',
      paragraphs: [
        'Because this is an intimate family celebration at a private residence, please dress comfortably and festively — whatever makes you feel joyful and at ease.',
        'Warm neutrals, soft pastels, sundresses, or crisp smart-casual shirts suit Nairobi’s lovely December afternoon perfectly.',
        'Comfortable flats, loafers, or block heels are ideal so you can relax, mingle freely, and enjoy the afternoon with us.',
      ],
    },
    rsvp: {
      kicker: 'BE OUR GUEST',
      title: 'RSVP',
      deadline: "Please let us know if you'll be joining us by November 30, 2026",
      fullNameLabel: 'Full Name *',
      fullNamePlaceholder: 'Your full name',
      emailLabel: 'Email Address *',
      emailPlaceholder: 'your@email.com',
      attendingLabel: 'Will you be attending? *',
      acceptOption: 'Joyfully Accept',
      declineOption: 'Regretfully Decline',
      guestsLabel: 'Number of Guests',
      messageLabel: 'Message for Racheal',
      messagePlaceholder: 'Share your congratulations, blessings, or favorite memory...',
      submitButton: 'Send RSVP',
      validationError:
        'Please enter your full name, a valid email address, and your attendance response.',
      confirmedTitleAccept: 'We Cannot Wait to Welcome You Home',
      confirmedTitleDecline: 'Thank You for Letting Us Know',
      confirmedBodyAccept:
        'A warm seat at the family table for homemade meals, drinks, and celebration is saved for you.',
      confirmedBodyDecline:
        'You will be warmly missed on December 4th. Thank you for your loving note.',
      editResponse: 'Update RSVP',
    },
    travel: {
      title: 'Getting Here',
      subtitle: 'PRIVATE RESIDENCE · NAIROBI',
      gettingThereTitle: 'Finding the Residence',
      gettingThereIntro:
        'We want your arrival at our private residence to be effortless. Use the exact Google Maps Plus Code below to navigate straight to the gate.',
      byAirTitle: 'Navigate via Plus Code',
      byAirBody:
        'Search "PP8H+Q7V Nairobi" in Google Maps, Uber, or Bolt to drop the exact pin at our private residence in Nairobi.',
      byCarTitle: 'Driving & Parking',
      byCarBody:
        'Convenient residential guest parking is available right at the residence. If you need a quick direction cue as you approach, just give us a call or message.',
      tipLabel: 'WARM NOTE',
      tipBody:
        'I will be at my morning matriculation ceremony first — feel free to arrive from 12:30 PM as the homemade meals and drinks are set out!',
      whereToStayTitle: 'Celebration Notes',
      whereToStayIntro:
        'A few quick details so you feel right at home for our intimate December 4th gathering.',
      hotels: [
        {
          id: 'residence-pin',
          name: 'Private Residence Pin',
          distance: 'NAIROBI, KENYA',
          note: 'Exact Google Maps Plus Code for effortless arrival',
          address: 'Private Residence · PP8H+Q7V, Nairobi, Kenya',
          promoCode: 'PP8H+Q7V',
          rate: 'Intimate Home Gathering · From 12:30 PM',
          websiteUrl: NAIROBI_MAPS_URL,
        },
        {
          id: 'homemade-feast',
          name: 'Homemade Meals & Drinks',
          distance: 'PREPARED WITH LOVE',
          note: 'Come hungry for home-cooked dishes & refreshments',
          address: 'Served family-style at the residence starting at 1:30 PM',
          promoCode: 'DEC4FEAST',
          rate: 'Homemade Feast · Refreshments & Toasts',
          websiteUrl: NAIROBI_MAPS_URL,
        },
        {
          id: 'speeches-fun',
          name: 'Speeches & Family Fun',
          distance: 'INTIMATE & JOYFUL',
          note: 'Heartfelt words, photos, music & laughter together',
          address: 'Afternoon speeches & family memories at the residence',
          promoCode: 'RACHEAL2026',
          rate: 'Class of 2026 · Family Celebration',
          websiteUrl: NAIROBI_MAPS_URL,
        },
      ],
      promoCodeLabel: 'Code',
      rateLabel: 'Details',
      viewMapLink: 'Open in Google Maps',
      thingsToDoTitle: 'What Awaits You',
      thingsToDoIntro: 'Here is what we are looking forward to sharing together:',
      attractions: [
        'Lovingly Prepared Homemade Meals',
        'Drinks, Refreshments & Warm Conversation',
        'Heartfelt Family Speeches & Toasts',
        'Music, Photos & Intimate Family Fun',
      ],
      questionsTitle: 'Need Directions?',
      questionsIntro:
        "Don't hesitate to reach out if you need help finding the gate or planning your arrival.",
      email: 'kacheracheal152@gmail.com',
      phone: 'PP8H+Q7V · Nairobi, Kenya',
    },
    footer: {
      date: 'DECEMBER 4, 2026',
      thankYou: 'Thank you for being part of my story.',
      madeWith: 'B.SC. IN SOFTWARE ENGINEERING · CLASS OF 2026',
      hashtag: '#RachealKache2026',
    },
    audio: {
      mute: 'Mute background music',
      unmute: 'Play gentle background music',
    },
  },
  fr: {
    nav: {
      story: 'Parcours',
      program: 'Programme',
      details: 'Lieu',
      rsvp: 'RSVP',
      travel: 'Accès',
    },
    cover: {
      tapToOpen: 'TOUCHEZ POUR OUVRIR',
      monogramLabel: "Ouvrir l'invitation de remise de diplôme de Racheal Kache",
      replayEnvelope: 'Sceller',
    },
    hero: {
      kicker: 'JE SUIS DIPLÔMÉE',
      graduateName: 'Racheal Kache',
      degree: 'Bachelor of Science en Génie Logiciel',
      date: '4 DÉCEMBRE 2026',
      confirmAttendance: 'CONFIRMER VOTRE PRÉSENCE',
    },
    invited: {
      title: 'Vous Êtes Invités',
      message:
        'Avec ma chère famille, je vous invite chaleureusement à célébrer ma remise de diplôme en toute intimité à notre résidence de Nairobi',
      countingTitle: 'Compte à Rebours',
      countingSubtitle: 'avant de célébrer cette étape en famille',
      days: 'JOURS',
      hours: 'HEURES',
      minutes: 'MINUTES',
      seconds: 'SECONDES',
    },
    journey: {
      kicker: 'Mon Parcours',
      title: 'Histoire Académique',
      milestones: [
        {
          year: '2022',
          title: 'Premier Jour sur le Campus',
          description:
            'Franchir les portes de l’université avec curiosité, de grands rêves et mes toutes premières lignes de code — le début d’un chapitre inoubliable.',
          illustration: 'desk',
        },
        {
          year: '2023',
          title: 'Nuits de Code & Laboratoires',
          description:
            'Nuits de code, café chaud et amitiés précieuses — l’année où la vie s’est doucement transformée, m’offrant une petite raison de plus et une seconde chance d’étudier.',
          illustration: 'books',
        },
        {
          year: '2024',
          title: 'Stage en Ingénierie',
          description:
            'Au-delà des amphithéâtres, j’ai retrouvé mon élan — apprenant énormément et vivant tant d’expériences en stage tout en donnant vie à de vrais logiciels.',
          illustration: 'trunk',
        },
        {
          year: '2025',
          title: 'Le Projet de Fin d’Études',
          description:
            'Des mois d’architecture, de tests et d’itérations jusqu’à une soutenance finale pleine de fierté — après chaque détour du chemin, j’y suis enfin arrivée.',
          illustration: 'arch',
        },
        {
          year: '2026',
          title: 'Un Nouveau Chapitre',
          description:
            'Bachelor of Science en Génie Logiciel en poche — prête à célébrer chaleureusement à la maison avec la famille et les proches qui m’ont soutenue.',
          illustration: 'graduate',
        },
      ],
    },
    program: {
      title: 'Programme du Jour',
      subtitle: 'DÉROULEMENT DE LA JOURNÉE',
      items: [
        {
          time: 'MATIN',
          title: 'MATRICULATION',
          subtitle: 'Racheal assiste à la cérémonie matinale de remise de diplôme',
          illustration: 'hall',
        },
        {
          time: '12H30',
          title: 'ACCUEIL DES PROCHES',
          subtitle: 'Bienvenue chaleureuse à notre résidence privée à Nairobi',
          illustration: 'flutes',
        },
        {
          time: '13H30',
          title: 'REPAS FAIT MAISON',
          subtitle: 'Partage de plats cuisinés maison avec amour autour de la table',
          illustration: 'dinner',
        },
        {
          time: '15H00',
          title: 'VERRES & DÉTENTE',
          subtitle: 'Boissons fraîches, rires et retrouvailles en famille',
          illustration: 'cocktail',
        },
        {
          time: '16H00',
          title: 'DISCOURS & TOASTS',
          subtitle: 'Mots tendres de gratitude et verres levés en famille',
          illustration: 'orb',
        },
        {
          time: '17H00',
          title: 'MUSIQUE & JOIE',
          subtitle: 'Musique, photos, histoires et doux moments partagés',
          illustration: 'music',
        },
        {
          time: 'SOIRÉE',
          title: 'DOUX AU REVOIR',
          subtitle: 'Étreintes, souvenirs et cœurs reconnaissants',
          illustration: 'farewell',
        },
      ],
    },
    gifts: {
      kicker: 'UN TOUT PETIT MOT',
      title: 'Cadeaux',
      intro:
        'Partager un bon repas maison, des rires et ce moment précieux à la maison avec vous est déjà largement suffisant. Je suis même un peu timide d’ajouter cette note — seulement si vous aviez envie d’offrir une petite attention sans savoir quoi choisir, j’ai discrètement glissé quelques idées ci-dessous.',
      showListLabel: 'Découvrir Quelques Idées',
      hideListLabel: 'Masquer la Liste',
      listIntro: 'Quelques petites choses qui me feraient très plaisir :',
      items: [
        {
          name: 'Sac Cabas Coach',
        },
        {
          name: 'Cadeau Monétaire',
          note: 'Pour accompagner mes projets, mes objectifs et mon prochain chapitre.',
        },
        {
          name: 'Disque SSD Portable',
          note: 'Pour garder précieusement mes projets, fichiers et souvenirs.',
        },
        {
          name: 'Montre Connectée',
          note: 'Un accessoire élégant et utile au quotidien.',
        },
        {
          name: 'Talons ou Chaussures',
          note: 'Une jolie paire pour ma garde-robe.',
        },
        {
          name: 'Bijoux',
          note: 'Des pièces délicates et intemporelles à chérir.',
        },
        {
          name: 'Coffret de Soins Visage',
          note: 'Un peu de douceur et de bien-être.',
        },
        {
          name: 'Fleurs',
          note: 'J’adore les lys.',
        },
      ],
      closingNote: 'Vraiment aucune obligation — célébrer ensemble compte plus que tout.',
    },
    details: {
      kicker: 'À LA MAISON',
      title: 'Détails de la Journée',
      subtitle:
        'Pas de grand banquet formel — juste une célébration intime et chaleureuse en famille à notre résidence privée.',
      ceremonyTitle: 'Célébration Intime en Famille',
      time: '12H30 · Après la Matriculation du Matin',
      venueName: 'Résidence Privée · Nairobi',
      addressLine1: 'Code Plus : PP8H+Q7V',
      addressLine2: 'Nairobi, Kenya',
      note: 'Le matin, j’assisterai à la matriculation, puis nous nous retrouverons tous à la résidence pour savourer des plats maison, boire un verre, partager des discours et profiter en famille.',
      openMaps: 'Ouvrir PP8H+Q7V dans Maps',
      addCalendar: 'Ajouter au Calendrier',
      calendarAdded: 'Fichier Calendrier Téléchargé',
    },
    dressCode: {
      title: 'Code Vestimentaire',
      subtitle: 'CHIC DÉCONTRACTÉ',
      paragraphs: [
        'Pour cette fête intime à la maison, privilégiez une tenue élégante mais confortable dans laquelle vous vous sentez pleinement à l’aise.',
        'Des tons doux, pastels ou tenues estivales chics conviendront à merveille à un bel après-midi de décembre à Nairobi.',
        'Des chaussures plates habillées, mocassins ou talons carrés seront parfaits pour profiter librement de la journée.',
      ],
    },
    rsvp: {
      kicker: 'SOYEZ DES NÔTRES',
      title: 'RSVP',
      deadline: 'Merci de confirmer votre présence avant le 30 novembre 2026',
      fullNameLabel: 'Nom Complet *',
      fullNamePlaceholder: 'Votre nom complet',
      emailLabel: 'Adresse E-mail *',
      emailPlaceholder: 'vous@exemple.fr',
      attendingLabel: 'Serez-vous présent(e) ? *',
      acceptOption: 'Avec Grand Plaisir',
      declineOption: 'Avec Regret',
      guestsLabel: 'Nombre de Convives',
      messageLabel: 'Message pour Racheal',
      messagePlaceholder: 'Partagez vos félicitations et vos vœux pour Racheal...',
      submitButton: 'Envoyer la Réponse',
      validationError:
        'Veuillez renseigner votre nom, une adresse e-mail valide et votre réponse.',
      confirmedTitleAccept: 'Nous Avons Hâte de Vous Accueillir',
      confirmedTitleDecline: 'Merci de Nous Avoir Prévenus',
      confirmedBodyAccept:
        'Votre place autour de notre table familiale est réservée avec joie.',
      confirmedBodyDecline:
        'Vous nous manquerez chaleureusement le 4 décembre. Merci pour votre doux message.',
      editResponse: 'Modifier ma Réponse',
    },
    travel: {
      title: 'Accès & Infos',
      subtitle: 'RÉSIDENCE PRIVÉE · NAIROBI',
      gettingThereTitle: 'Trouver la Résidence',
      gettingThereIntro:
        'Notre célébration a lieu en toute intimité dans une résidence privée à Nairobi. Utilisez simplement le Code Plus Google Maps ci-dessous.',
      byAirTitle: 'Navigation via Code Plus',
      byAirBody:
        'Saisissez « PP8H+Q7V Nairobi » dans Google Maps, Uber ou Bolt pour arriver exactement devant la résidence.',
      byCarTitle: 'En Voiture ou VTC',
      byCarBody:
        'Un stationnement résidentiel est disponible sur place. N’hésitez pas à nous appeler en arrivant pour toute indication.',
      tipLabel: 'PETIT MOT',
      tipBody:
        'Je serai d’abord à la cérémonie matinale de matriculation — venez dès 12h30 pour savourer ensemble le repas maison !',
      whereToStayTitle: 'Infos Pratiques',
      whereToStayIntro:
        'Quelques repères simples pour profiter sereinement de notre fête du 4 décembre.',
      hotels: [
        {
          id: 'residence-pin',
          name: 'Point GPS Résidence Privée',
          distance: 'NAIROBI, KENYA',
          note: 'Code Plus Google Maps exact pour une arrivée facile',
          address: 'Résidence Privée · PP8H+Q7V, Nairobi, Kenya',
          promoCode: 'PP8H+Q7V',
          rate: 'Réception Intime · Dès 12h30',
          websiteUrl: NAIROBI_MAPS_URL,
        },
        {
          id: 'homemade-feast',
          name: 'Repas Maison & Boissons',
          distance: 'CUISINÉ AVEC AMOUR',
          note: 'Plats faits maison, rafraîchissements et convivialité',
          address: 'Servi en famille à la résidence à partir de 13h30',
          promoCode: 'DEC4FEAST',
          rate: 'Repas Familial · Toasts & Douceurs',
          websiteUrl: NAIROBI_MAPS_URL,
        },
        {
          id: 'speeches-fun',
          name: 'Discours & Moments en Famille',
          distance: 'INTIME & CHALEUREUX',
          note: 'Discours touchants, musique, photos et rires',
          address: 'Après-midi festif à la résidence',
          promoCode: 'RACHEAL2026',
          rate: 'Promotion 2026 · Fête en Famille',
          websiteUrl: NAIROBI_MAPS_URL,
        },
      ],
      promoCodeLabel: 'Code',
      rateLabel: 'Détails',
      viewMapLink: 'Ouvrir dans Google Maps',
      thingsToDoTitle: 'Au Menu de la Journée',
      thingsToDoIntro: 'Tout ce que nous avons hâte de vivre ensemble :',
      attractions: [
        'Délicieux Repas Faits Maison',
        'Boissons, Douceurs & Rires',
        'Discours Émouvants & Toasts en Famille',
        'Musique, Photos & Souvenirs Précieux',
      ],
      questionsTitle: 'Besoin d’Indications ?',
      questionsIntro:
        'N’hésitez pas à nous écrire si vous avez besoin d’aide pour rejoindre la résidence.',
      email: 'kacheracheal152@gmail.com',
      phone: 'PP8H+Q7V · Nairobi, Kenya',
    },
    footer: {
      date: '4 DÉCEMBRE 2026',
      thankYou: 'Merci de faire partie de mon histoire.',
      madeWith: 'BACHELOR OF SCIENCE EN GÉNIE LOGICIEL · PROMOTION 2026',
      hashtag: '#RachealKache2026',
    },
    audio: {
      mute: 'Couper la musique',
      unmute: 'Activer la musique douce',
    },
  },
};
