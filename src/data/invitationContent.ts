export type Language = 'en' | 'sw';

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
          name: 'Any Tech Gadget',
          note: 'Always a want — e.g. Samsung S10 Lite tablet 😉',
        },
        {
          name: 'Monetary Gift',
        },
        {
          name: 'Portable SSD',
        },
        {
          name: 'Smartwatch',
        },
        {
          name: 'Heels or Shoes',
        },
        {
          name: 'Jewellery',
        },
        {
          name: 'Skincare Set',
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
  sw: {
    nav: {
      story: 'Safari Yangu',
      program: 'Ratiba',
      details: 'Maelezo',
      rsvp: 'RSVP',
      travel: 'Mahali',
    },
    cover: {
      tapToOpen: 'GUSA KUFUNGUA',
      monogramLabel: 'Fungua mwaliko wa mahafali ya Racheal Kache',
      replayEnvelope: 'Bahasha',
    },
    hero: {
      kicker: 'NINAHITIMU',
      graduateName: 'Racheal Kache',
      degree: 'Shahada ya Sayansi katika Uhandisi wa Programu',
      date: '4 DISEMBA 2026',
      confirmAttendance: 'THIBITISHA KUHUDHURIA',
    },
    invited: {
      title: 'Umealikwa',
      message:
        'Pamoja na familia yangu yenye upendo, nakukaribisha kwa moyo mkunjufu katika sherehe ya kifamilia ya mahafali yangu nyumbani kwetu Nairobi',
      countingTitle: 'Tukihesabu Siku',
      countingSubtitle: 'hadi kusherehekea hatua hii pamoja kama familia',
      days: 'SIKU',
      hours: 'SAA',
      minutes: 'DAKIKA',
      seconds: 'SEKUNDE',
    },
    journey: {
      kicker: 'Safari Yangu',
      title: 'Hadithi ya Masomo',
      milestones: [
        {
          year: '2022',
          title: 'Siku ya Kwanza Chuoni',
          description:
            'Kuingia lango la chuo kikuu nikiwa na hamu ya kujifunza, ndoto kubwa, na mistari yangu ya kwanza ya kodi — mwanzo wa sura isiyosahaulika.',
          illustration: 'desk',
        },
        {
          year: '2023',
          title: 'Kodi za Usiku na Maabara',
          description:
            'Kodi za usiku wa manane, kahawa ya moto, na urafiki wa kudumu — mwaka ambao maisha yalibadilika kwa upole, yakinibariki na sababu mpya ndogo na nafasi ya pili ya kuendelea na masomo.',
          illustration: 'books',
        },
        {
          year: '2024',
          title: 'Mafunzo ya Uhandisi',
          description:
            'Nje ya kumbi za mihadhara, nilipata tena mwendo wangu — nikijifunza kwa kina, nikipata uzoefu mkubwa katika mafunzo ya kazi, na kugeuza mawazo makubwa kuwa programu halisi.',
          illustration: 'trunk',
        },
        {
          year: '2025',
          title: 'Mradi wa Kuhitimu',
          description:
            'Miezi ya usanifu, majaribio, na marekebisho ya usiku kucha hadi utetezi wa mwisho wenye fahari — baada ya kila changamoto njiani, hatimaye nilifika.',
          illustration: 'arch',
        },
        {
          year: '2026',
          title: 'Sura Mpya',
          description:
            'Shahada ya Sayansi katika Uhandisi wa Programu mkononi — sherehe ya asubuhi chuoni imekamilika, na sasa tuko tayari kukusanyika nyumbani na familia iliyotembea nami.',
          illustration: 'graduate',
        },
      ],
    },
    program: {
      title: 'Ratiba ya Siku',
      subtitle: 'JINSI SIKU YETU ITAKAVYOENDELEA',
      items: [
        {
          time: 'ASUBUHI',
          title: 'SHEREHE YA CHUO',
          subtitle: 'Racheal anahudhuria sherehe ya asubuhi ya mahafali na kutunukiwa shahada',
          illustration: 'hall',
        },
        {
          time: '12:30 MCHANA',
          title: 'KUWASILI KWA WAGENI',
          subtitle: 'Mapokezi ya uchangamfu katika makazi yetu binafsi Nairobi',
          illustration: 'flutes',
        },
        {
          time: '1:30 MCHANA',
          title: 'CHAKULA CHA NYUMBANI',
          subtitle: 'Kukusanyika mezani kufurahia vyakula vilivyopikwa nyumbani kwa upendo',
          illustration: 'dinner',
        },
        {
          time: '3:00 ALASIRI',
          title: 'VINYWAJI NA MAPUMZIKO',
          subtitle: 'Vinywaji baridi, vicheko na mazungumzo ya furaha',
          illustration: 'cocktail',
        },
        {
          time: '4:00 ALASIRI',
          title: 'HOTUBA NA PONGEZI',
          subtitle: 'Maneno ya dhati ya shukrani na kuinua glasi kama familia',
          illustration: 'orb',
        },
        {
          time: '5:00 JIONI',
          title: 'MUZIKI NA FURAHA',
          subtitle: 'Muziki, picha, hadithi na kufurahia jioni pamoja',
          illustration: 'music',
        },
        {
          time: 'JIONI',
          title: 'KWAHERI YA UPENDO',
          subtitle: 'Kukumbatiana, picha za kumbukumbu na mioyo yenye shukrani',
          illustration: 'farewell',
        },
      ],
    },
    gifts: {
      kicker: 'UJUMBE MDOGO WA UPENDO',
      title: 'Zawadi',
      intro:
        'Kuwa nawe nyumbani tukishiriki chakula cha nyumbani, vicheko, na hatua hii muhimu pamoja nami kweli kunatosha kabisa. Hata naona aibu kidogo kuongeza ujumbe huu — ila tu kama ungependa kuleta zawadi ndogo na hujui uchague nini, nimeweka mawazo machache kwa upole hapa chini.',
      showListLabel: 'Tazama Mawazo Machache ya Zawadi',
      hideListLabel: 'Ficha Mawazo ya Zawadi',
      listIntro: 'Vitu vichache tu ambavyo nimekuwa nikitamani:',
      items: [
        {
          name: 'Mkoba wa Coach Tote',
        },
        {
          name: 'Kifaa Chochote cha Teknolojia',
          note: 'Kila mara ni hitaji — k.m. Samsung S10 Lite tablet 😉',
        },
        {
          name: 'Zawadi ya Fedha',
        },
        {
          name: 'Portable SSD',
        },
        {
          name: 'Saa Janja (Smartwatch)',
        },
        {
          name: 'Viatu au Viatu vya Kisigino',
        },
        {
          name: 'Mapambo (Vito)',
        },
        {
          name: 'Seti ya Kutunza Ngozi',
        },
        {
          name: 'Maua',
          note: 'Napenda maua ya yungiyungi (lilies).',
        },
      ],
      closingNote: 'Kweli hakuna shinikizo lolote — kusherehekea pamoja tu kuna maana kubwa sana kwangu.',
    },
    details: {
      kicker: 'UNGANA NASI NYUMBANI',
      title: 'Maelezo ya Sherehe',
      subtitle:
        'Si karamu kubwa rasmi — ni mkusanyiko wa karibu na wa furaha katika makazi yetu binafsi na watu wenye thamani kubwa zaidi.',
      ceremonyTitle: 'Sherehe ya Kifamilia',
      time: '12:30 MCHANA · Baada ya Mahafali ya Asubuhi',
      venueName: 'Makazi Binafsi · Nairobi',
      addressLine1: 'Plus Code: PP8H+Q7V',
      addressLine2: 'Nairobi, Kenya',
      note: 'Asubuhi nitahudhuria sherehe ya mahafali chuoni, kisha tutakutana pamoja nyumbani kwa chakula cha nyumbani, vinywaji, hotuba, na furaha ya kifamilia.',
      openMaps: 'Fungua PP8H+Q7V kwenye Ramani',
      addCalendar: 'Ongeza kwenye Kalenda',
      calendarAdded: 'Faili ya Kalenda Imepakuliwa',
    },
    dressCode: {
      title: 'Mavazi',
      subtitle: 'MARIDADI NA YA KUSTAREHE',
      paragraphs: [
        'Kwa kuwa hii ni sherehe ya kifamilia katika makazi binafsi, tafadhali vaa kwa ustarehe na furaha — chochote kinachokufanya ujisikie vizuri na mwenye uchangamfu.',
        'Rangi laini, pastel, gauni za mchana, au mashati nadhifu ya kawaida vinafaa kabisa kwa mchana mzuri wa Disemba jijini Nairobi.',
        'Viatu vya kustarehe, loafers, au visigino vipana ni bora ili uweze kupumzika, kuchangamana kwa uhuru, na kufurahia mchana nasi.',
      ],
    },
    rsvp: {
      kicker: 'UWE MGENI WETU',
      title: 'RSVP',
      deadline: 'Tafadhali tujulishe kama utaungana nasi kabla ya 30 Novemba 2026',
      fullNameLabel: 'Jina Kamili *',
      fullNamePlaceholder: 'Jina lako kamili',
      emailLabel: 'Barua Pepe *',
      emailPlaceholder: 'barua@mfano.com',
      attendingLabel: 'Je, utahudhuria? *',
      acceptOption: 'Ninakubali kwa Furaha',
      declineOption: 'Kwa Masikitiko Sitahudhuria',
      guestsLabel: 'Idadi ya Wageni',
      messageLabel: 'Ujumbe kwa Racheal',
      messagePlaceholder: 'Shiriki pongezi zako, baraka, au kumbukumbu unayoipenda...',
      submitButton: 'Tuma Jibu (RSVP)',
      validationError:
        'Tafadhali weka jina lako kamili, barua pepe sahihi, na jibu lako la kuhudhuria.',
      confirmedTitleAccept: 'Tunasubiri kwa Hamu Kukukaribisha Nyumbani',
      confirmedTitleDecline: 'Asante kwa Kutujulisha',
      confirmedBodyAccept:
        'kiti chenye upendo mezani mwa familia kwa chakula cha nyumbani, vinywaji na sherehe kimehifadhiwa kwa ajili yako.',
      confirmedBodyDecline:
        'tutakukosa sana tarehe 4 Disemba. Asante kwa ujumbe wako wenye upendo.',
      editResponse: 'Badilisha Jibu',
    },
    travel: {
      title: 'Kufika Mahali',
      subtitle: 'MAKAZI BINAFSI · NAIROBI',
      gettingThereTitle: 'Kupata Makazi',
      gettingThereIntro:
        'Tunataka kuwasili kwako nyumbani kwetu kuwe rahisi kabisa. Tumia Google Maps Plus Code hapa chini kufika moja kwa moja hadi langoni.',
      byAirTitle: 'Elekezwa kwa Plus Code',
      byAirBody:
        'Tafuta "PP8H+Q7V Nairobi" kwenye Google Maps, Uber, au Bolt ili kupata eneo sahihi la makazi yetu binafsi Nairobi.',
      byCarTitle: 'Kuendesha Gari na Maegesho',
      byCarBody:
        'Maegesho rahisi ya wageni yanapatikana hapo nyumbani. Ukikaribia na kuhitaji maelekezo ya haraka, tupigie simu au tuma ujumbe.',
      tipLabel: 'UJUMBE WA UPENDO',
      tipBody:
        'Nitaanza asubuhi kwenye sherehe ya mahafali chuoni — jisikie huru kuwasili kuanzia saa 12:30 mchana huku vyakula vya nyumbani na vinywaji vikiandaliwa!',
      whereToStayTitle: 'Maelezo ya Sherehe',
      whereToStayIntro:
        'Maelezo machache ya haraka ili ujisikie nyumbani katika mkusanyiko wetu wa tarehe 4 Disemba.',
      hotels: [
        {
          id: 'residence-pin',
          name: 'Eneo la Makazi Binafsi',
          distance: 'NAIROBI, KENYA',
          note: 'Google Maps Plus Code sahihi kwa kuwasili kwa urahisi',
          address: 'Makazi Binafsi · PP8H+Q7V, Nairobi, Kenya',
          promoCode: 'PP8H+Q7V',
          rate: 'Sherehe ya Nyumbani · Kuanzia 12:30 Mchana',
          websiteUrl: NAIROBI_MAPS_URL,
        },
        {
          id: 'homemade-feast',
          name: 'Chakula cha Nyumbani na Vinywaji',
          distance: 'KIMEPIKWA KWA UPENDO',
          note: 'Njoo tayari kufurahia vyakula vya nyumbani na viburudisho',
          address: 'Hutolewa kifamilia nyumbani kuanzia 1:30 mchana',
          promoCode: 'DEC4FEAST',
          rate: 'Karamu ya Nyumbani · Viburudisho na Pongezi',
          websiteUrl: NAIROBI_MAPS_URL,
        },
        {
          id: 'speeches-fun',
          name: 'Hotuba na Furaha ya Familia',
          distance: 'KARIBU NA YA FURAHA',
          note: 'Maneno ya dhati, picha, muziki na vicheko pamoja',
          address: 'Hotuba za alasiri na kumbukumbu za familia nyumbani',
          promoCode: 'RACHEAL2026',
          rate: 'Darasa la 2026 · Sherehe ya Familia',
          websiteUrl: NAIROBI_MAPS_URL,
        },
      ],
      promoCodeLabel: 'Msimbo',
      rateLabel: 'Maelezo',
      viewMapLink: 'Fungua kwenye Google Maps',
      thingsToDoTitle: 'Kinachokusubiri',
      thingsToDoIntro: 'Haya ndiyo tunayotarajia kushiriki pamoja:',
      attractions: [
        'Vyakula Vitamu Vilivyopikwa Nyumbani kwa Upendo',
        'Vinywaji, Viburudisho na Mazungumzo ya Furaha',
        'Hotuba za Dhati za Familia na Pongezi',
        'Muziki, Picha na Furaha ya Kifamilia',
      ],
      questionsTitle: 'Unahitaji Maelekezo?',
      questionsIntro:
        'Usisite kuwasiliana nasi ukihitaji msaada wa kupata lango au kupanga kuwasili kwako.',
      email: 'kacheracheal152@gmail.com',
      phone: 'PP8H+Q7V · Nairobi, Kenya',
    },
    footer: {
      date: '4 DISEMBA 2026',
      thankYou: 'Asante kwa kuwa sehemu ya hadithi yangu.',
      madeWith: 'SHAHADA YA SAYANSI KATIKA UHANDISI WA PROGRAMU · DARASA LA 2026',
      hashtag: '#RachealKache2026',
    },
    audio: {
      mute: 'Nyamazisha muziki',
      unmute: 'Cheza muziki laini',
    },
  },
};
