import { InspectionScene, TrueFalseStatement, FactOrMythItem, DetectiveCase, Badge } from '../types/game';

export const INSPECTION_SCENES: InspectionScene[] = [
  {
    id: 'beach_resort',
    title: 'A Napfényes Strand Eset',
    location: 'Balatoni Strandfürdő',
    timeOfDay: '12:45 (Déli Napcsúcs)',
    temperature: '32 °C',
    uvIndexRecorded: 8.6,
    image: '/src/assets/images/uv_scene_beach_1792491561107.jpg',
    briefing: 'Bejelentés érkezett: több strandoló súlyos elsőfokú égési sérüléseket és szemirritációt szenvedett. Vizsgáld át a helyszínt, azonosítsd az UV-sugárzási veszélyforrásokat és a hiányos védelmi intézkedéseket!',
    hotspots: [
      {
        id: 'hs_water_reflection',
        x: 62,
        y: 45,
        radius: 12,
        title: 'Vízfelszíni Sugárzás-Reflexió',
        hazardType: 'REFLEXIÓ',
        severity: 'EXTRÉM',
        description: 'A fürdőzők a vízben hűsölve védettnek hiszik magukat, holott a vízfelszín a beeső UV-sugarak 20-25%-át tükörként visszaveri, ráadásul 50 cm mélységben még az UV 40%-a áthatol.',
        forensicNote: 'A víz hűsítő érzete elnyomja a bőr hőérzetét, így a fürdőző nem érzi, hogy a bőre éppen ég.',
        preventionTip: 'Vízálló (water-resistant) fényvédő krém használata kötelező, fürdés után pedig azonnali újrakrémezés szükséges.'
      },
      {
        id: 'hs_umbrella_trap',
        x: 23,
        y: 72,
        radius: 10,
        title: 'Az Árnyéki Csapda (Szórt Sugárzás)',
        hazardType: 'UVA_VESZÉLY',
        severity: 'MAGAS',
        description: 'A napernyő alatt fekvő áldozat azt hitte, az ernyő teljes védelmet nyújt. A világos homok azonban az UV 15-20%-át visszaveri, és a légköri részecskékről szórt UV az árnyék alá is bejut.',
        forensicNote: 'Az árnyék a közvetlen UV mintegy 50-60%-át szűri csak ki, a szórt sugárzás ellen fényvédő nélkül az árnyékban is le lehet égni.',
        preventionTip: 'Árnyékban is használj fényvédőt és viselj laza, szorosan szőtt ruházatot.'
      },
      {
        id: 'hs_cheap_sunglasses',
        x: 81,
        y: 82,
        radius: 9,
        title: 'Gyanús Olcsó Napszemüveg',
        hazardType: 'HIÁNYOS_VÉDELEM',
        severity: 'KRITIKUS',
        description: 'A parton heverő sötét lencsés divatszemüvegen nincs hivatalos UV400 / CE jelölés. Csak sötétít, de nem szűri az UV-t.',
        forensicNote: 'A sötét lencse miatt a pupilla kitágul, így a szűretlen UV-A és UV-B sugarak akadálytalanul jutnak a szem mélyébe, szürkehályogot és retinadegenerációt okozva!',
        preventionTip: 'Kizárólag garantált UV400 vagy 100% UV-szűrős (CE jelzésű) napszemüveget viselj.'
      },
      {
        id: 'hs_expired_sunscreen',
        x: 53,
        y: 89,
        radius: 8,
        title: 'Forróságban Hagyott, Lejárt Naptej',
        hazardType: 'LEJÁRT_TERMÉK',
        severity: 'MAGAS',
        description: 'A törölközőn hagyott fényvédő flakon közvetlen 50 °C-os napsütésnek volt kitéve. Felbontás után már tavaly lejárt.',
        forensicNote: 'A kémiai fényszűrő molekulák magas hőmérsékleten és idővel lebomlanak, így a faktorszám töredékére zuhan, miközben bőrirritációt okozhat.',
        preventionTip: 'A naptejet árnyékban, hűtőtáskában tartsd, és felbontás után maximum 12 hónapig használd.'
      },
      {
        id: 'hs_peak_hours',
        x: 34,
        y: 65,
        radius: 11,
        title: 'Közvetlen Napozás Csúcsidőben',
        hazardType: 'CSÚCSIDŐ',
        severity: 'EXTRÉM',
        description: 'A napozóágyon fekvő személy 11:00 és 15:00 között a legmagasabb sugárzási beesési szögben fekszik a tűző napon.',
        forensicNote: 'A napi teljes UV-dózis több mint 60%-a ezen a 4 órás idősávon belül éri a felszínt.',
        preventionTip: '11:00 és 15:00 között vonulj zárt, hűvös helyre vagy teljes fedett árnyékba.'
      }
    ]
  },
  {
    id: 'snow_mountain',
    title: 'A Havas Hegycsúcs Eset',
    location: 'Magas-Tátrai Síközpont',
    timeOfDay: '13:15',
    temperature: '-4 °C (Fagyos, tiszta idő)',
    uvIndexRecorded: 7.2,
    image: '/src/assets/images/uv_scene_snow_1792491576199.jpg',
    briefing: 'Egy tapasztalatlan túrázó és síelő csoport tagjai a fagyos idő ellenére hóvakság és arcégés tüneteivel jelentkeztek a hegyimentőknél. Derítsd ki a téli hegyvidéki UV-sugárzás rejtett bűnjeleit!',
    hotspots: [
      {
        id: 'hs_snow_reflection',
        x: 48,
        y: 78,
        radius: 13,
        title: 'Extrém Hóreflexió (Tükörhatás)',
        hazardType: 'REFLEXIÓ',
        severity: 'KRITIKUS',
        description: 'A friss, kristályos hó a ráeső UV-sugárzás mintegy 80-85%-át közvetlenül visszaveri! Ezzel szinte megduplázza a testet érő sugárdózist alulról és oldalról is.',
        forensicNote: 'A normál talaj (fű, föld) alig 2-5%-ot ver vissza, a friss hó viszont a természet legerősebb UV-reflektora.',
        preventionTip: 'Síszemüveg vagy zárt oldalfalú gleccserszemüveg és az áll/orr alatti részek fényvédőzése elengedhetetlen.'
      },
      {
        id: 'hs_altitude_factor',
        x: 22,
        y: 42,
        radius: 11,
        title: 'Magassági Ritkulás Faktora',
        hazardType: 'CSÚCSIDŐ',
        severity: 'EXTRÉM',
        description: 'A sípálya 2200 méter magasan fekszik. A tengerszinthez képest a vékonyabb légkör és kevesebb aeroszol miatt az UV-sugárzás sokkal agresszívabb.',
        forensicNote: 'Minden 1000 méter tengerszint feletti magasságemelkedéssel az UV-szint 10-12%-kal növekszik!',
        preventionTip: 'Hegyvidéken télen is minimum SPF 50+ fényvédőt és UV-szűrős ajakírt kell alkalmazni.'
      },
      {
        id: 'hs_snow_blindness',
        x: 88,
        y: 38,
        radius: 10,
        title: 'Fotokeratitis (Hóvakság) Veszély',
        hazardType: 'HIÁNYOS_VÉDELEM',
        severity: 'KRITIKUS',
        description: 'A sífelvonón ülő sportoló levette a síszemüvegét a tiszta hegyi kilátás miatt.',
        forensicNote: 'A szaruhártya és a kötőhártya órákon belül leéghet az intenzív UV-B sugárzástól, ami rendkívül fájdalmas, ideiglenes vaksággal járó gyulladást (fotokeratitis) okoz.',
        preventionTip: 'Soha ne vedd le a védőszemüveget havas környezetben napsütéses időben.'
      },
      {
        id: 'hs_wind_illusion',
        x: 60,
        y: 62,
        radius: 9,
        title: 'A Hideg Szél Érzéki Csalódása',
        hazardType: 'UVA_VESZÉLY',
        severity: 'MAGAS',
        description: 'A fagyos menetszél és a -4 °C-os hideg miatt a síelők nem érzik a nap melegét, ezért azt hiszik, nem érheti őket leégés.',
        forensicNote: 'A meleget az infravörös (IR) sugarak adják, a leégést és DNS-károsodást viszont a láthatatlan és nem érezhető ultraibolya (UV) sugarak okozzák.',
        preventionTip: 'A hőmérséklet nem mérvadó az UV-veszélyre: fagyban is ellenőrizd az UV-indexet!'
      }
    ]
  },
  {
    id: 'city_street',
    title: 'A Városi Üvegkanyon Eset',
    location: 'Központi Irodanegyed & Korzó',
    timeOfDay: '13:00',
    temperature: '29 °C',
    uvIndexRecorded: 7.8,
    image: '/src/assets/images/uv_scene_city_1792491591895.jpg',
    briefing: 'Egy irodai menedzser és több belvárosi lakos orvosi vizsgálaton vett részt: arcukon és nyakukon aszimmetrikus korai öregedést és gyanús anyajegy-elváltozásokat észleltek. Nyomozd le a modern városi környezet láthatatlan UV-veszélyeit!',
    hotspots: [
      {
        id: 'hs_glass_facade',
        x: 18,
        y: 28,
        radius: 12,
        title: 'Üvegfalak UVA-Áteresztése',
        hazardType: 'UVA_VESZÉLY',
        severity: 'KRITIKUS',
        description: 'A modern irodaházak üvegfelületei és az autóablakok kiszűrik az UV-B sugarakat (ezért nem égünk le azonnal), de az UV-A sugarak 70-80%-át átengedik!',
        forensicNote: 'Az UV-A a mély irharétegbe hatolva elpusztítja a kollagénrostokat, felelős a fényöregedésért, ráncokért és a melanomát kiváltó mély sejt-DNS mutációkért.',
        preventionTip: 'Ablak melletti ülésnél vagy autóvezetéskor is használj széles spektrumú (UVA + UVB) védelmet biztosító fényvédőt.'
      },
      {
        id: 'hs_pavement_reflection',
        x: 68,
        y: 84,
        radius: 11,
        title: 'Világos Díszburkolat és Betonreflexió',
        hazardType: 'REFLEXIÓ',
        severity: 'MAGAS',
        description: 'A világos szürke beton és márvány járdalapok a beeső UV-sugárzás mintegy 10-15%-át sugározzák vissza alulról az arcra és a nyakra.',
        forensicNote: 'Városi kanyonokban az épületek falairól és járdákról érkező többszörös szórt sugárzás összeadódik.',
        preventionTip: 'A mindennapi városi közlekedéshez is ajánlott az arc és nyak reggeli fényvédőzése.'
      },
      {
        id: 'hs_exposed_neck',
        x: 89,
        y: 72,
        radius: 9,
        title: 'Tarkó és Fülkagyló Védelmének Hiánya',
        hazardType: 'HIÁNYOS_VÉDELEM',
        severity: 'EXTRÉM',
        description: 'A sétáló járókelők pólóban, fedetlen tarkóval és fülkagylóval közlekednek a déli órákban.',
        forensicNote: 'A bőrgyógyászati statisztikák szerint a nem-melanoma típusú bőrrákok (bazalióma, laphámrák) egyik leggyakoribb rejtett helye a fül felső része és a tarkó!',
        preventionTip: 'Használj széles karimájú kalapot vagy tarkóvédős sapkát, és ne felejtsd el bekenni a fülkagylóidat sem.'
      },
      {
        id: 'hs_shade_canopy',
        x: 28,
        y: 52,
        radius: 10,
        title: 'Vékony Textil Napernyő a Teraszon',
        hazardType: 'HIÁNYOS_VÉDELEM',
        severity: 'MAGAS',
        description: 'A kávézó teraszának vékony, laza szövésű sárga napernyője alatt ülnek a vendégek ebédidőben.',
        forensicNote: 'A vékony, laza szövésű nyári textíliák UV-áteresztő képessége magas (UPF értékük gyakran 5 alatt van), így a sugarak jelentős része átszűrődik.',
        preventionTip: 'Keress sűrű szövésű, UV-védő réteggel ellátott (UPF 50+) ernyőket vagy masszív épített tetőt.'
      }
    ]
  }
];

export const TRUE_FALSE_STATEMENTS: TrueFalseStatement[] = [
  {
    id: 'tf_1',
    statement: 'A felhős, borús égbolt teljesen megvéd az UV-sugárzástól, ilyenkor felesleges a fényvédelem.',
    isTrue: false,
    explanation: 'HAMIS! A vékony, fátyolos felhőzet az UV-sugarak akár 80-90%-át is átengedi. Sőt, a felhők széléről visszaverődő sugarak miatt a sugárzás néha még erősebb is lehet.',
    category: 'KÖRNYEZET'
  },
  {
    id: 'tf_2',
    statement: 'A lebarnult bőr nem jelent valódi védelmet, maga a barnulás a bőr DNS-ének sérülésre adott vészreakciója.',
    isTrue: true,
    explanation: 'IGAZ! A bőr azért termel melanint, hogy megvédje a sejtmagokat a további DNS-törésektől. A barnulás orvosilag a sejtkárosodás bizonyítéka, nem az egészségé.',
    category: 'EGÉSZSÉGÜGY'
  },
  {
    id: 'tf_3',
    statement: 'Az autó lehúzatlan oldalablaka mögött ülve nem fenyeget semmilyen UV-veszély.',
    isTrue: false,
    explanation: 'HAMIS! Bár a sima ablaküveg az UVB sugarakat (amelyek a közvetlen égést okozzák) elnyeli, az UVA sugarak 70-80%-át átengedi, ami mély sejtkárosodást és fényöregedést okoz.',
    category: 'FIZIKA'
  },
  {
    id: 'tf_4',
    statement: 'Minden 1000 méter tengerszint feletti magasságnövekedéssel az UV-sugárzás szintje kb. 10-12%-kal erősödik.',
    isTrue: true,
    explanation: 'IGAZ! A magasban a ritkább levegő és a kevesebb légköri molekula kevesebb UV-sugarat képes elnyelni, ezért hegyvidéken sokkal nagyobb az UV-terhelés.',
    category: 'KÖRNYEZET'
  },
  {
    id: 'tf_5',
    statement: 'Egy SPF 50-es naptej pontosan kétszer annyi védelmet nyújt a bőrnek, mint egy SPF 25-ös.',
    isTrue: false,
    explanation: 'HAMIS! Az SPF nem lineáris arány: az SPF 15 kiszűri az UVB kb. 93%-át, az SPF 30 kb. 97%-át, az SPF 50 pedig kb. 98%-át. Nincs "dupla" védelem, a különbség a szűrés pontosságában van.',
    category: 'BŐRVÉDELEM'
  },
  {
    id: 'tf_6',
    statement: 'A napégés tünetei (pirosság, fájdalom) nem azonnal, hanem 4-6 órával a napozás után kezdenek kifejlődni.',
    isTrue: true,
    explanation: 'IGAZ! A napégés gyulladásos kaszkádja késleltetett folyamat: a tünetek legkorábban 4-6 óra múlva jelentkeznek, és 12-24 óra között érik el a csúcspontjukat.',
    category: 'EGÉSZSÉGÜGY'
  },
  {
    id: 'tf_7',
    statement: 'A sötét színű, de UV-szűrő nélküli napszemüveg viselése veszélyesebb a szemre, mintha egyáltalán nem viselnénk semmit.',
    isTrue: true,
    explanation: 'IGAZ! A sötét lencse miatt a pupilla kitágul, így ha nincs UV-szűrő, sokkal több káros sugárzás jut a szemlencsére és a retinára, növelve a szürkehályog és makuladegeneráció kockázatát.',
    category: 'EGÉSZSÉGÜGY'
  },
  {
    id: 'tf_8',
    statement: 'A szoláriumozás biztonságos felkészülést nyújt a bőrnek a nyári tengerparti napozás előtt.',
    isTrue: false,
    explanation: 'HAMIS! A szolárium szinte kizárólag nagy dózisú UVA-t sugároz, ami nem épít vastag védőréteget, viszont drámaian megnöveli a melanoma kialakulásának kockázatát.',
    category: 'BŐRVÉDELEM'
  },
  {
    id: 'tf_9',
    statement: 'A friss hó a beeső UV-sugárzás több mint 80%-át képes visszaverni.',
    isTrue: true,
    explanation: 'IGAZ! A friss hótakaró albedója kiemelkedő: az UV 80-85%-át tükrözi vissza, emiatt alakulhat ki a hegyekben a fájdalmas fotokeratitis (hóvakság).',
    category: 'FIZIKA'
  },
  {
    id: 'tf_10',
    statement: 'A melanoma (a legagresszívabb bőrrák) kizárólag a közvetlen napfénynek kitett testrészeken alakulhat ki.',
    isTrue: false,
    explanation: 'HAMIS! Bár a napsütés a fő kockázati tényező, melanoma megjelenhet a talpon, a tenyéren, a körmök alatt és nyálkahártyákon is, ahol alig éri nap a testet.',
    category: 'EGÉSZSÉGÜGY'
  }
];

export const FACT_MYTH_ITEMS: FactOrMythItem[] = [
  {
    id: 'fm_1',
    statement: '„Ha már egyszer lebarnultam a nyár elején, utána már soha többé nem tudok leégni abban a szezonban.”',
    isFact: false,
    revealText: 'TÉVHIT! A barna bőr legfeljebb körülbelül SPF 2-4-nek megfelelő minimális védelmet jelent. Erős déli UV-sugárzásnál a lebarnult bőr is pillanatok alatt újabb égést és DNS-törést szenved.',
    scientificSource: 'Egészségügyi Világszervezet (WHO) UV Tudástár'
  },
  {
    id: 'fm_2',
    statement: '„Az UV-A sugárzás a felhőkön és az ablaküvegen is áthatol, és felelős a mély ráncokért és korai bőröregedésért.”',
    isFact: true,
    revealText: 'TÉNY! Az UV-A (320-400 nm) hosszabb hullámhosszú, ezért mélyen az irharétegbe hatol, roncsolja a kollagént és elasztint, és az év 365 napján szinte azonos intenzitással van jelen.',
    scientificSource: 'Európai Bőrgyógyászati és Venerológiai Akadémia (EADV)'
  },
  {
    id: 'fm_3',
    statement: '„A naptej reggeli egyszeri felvitele egész napra garantálja a védelmet, ha nem megyünk vízbe.”',
    isFact: false,
    revealText: 'TÉVHIT! Az izzadás, a ruha dörzsölődése, az archoz nyúlás és a fényszűrők természetes fotodegradációja miatt a fényvédőt 2 óránként kötelező újrakenni!',
    scientificSource: 'Nemzetközi Bőrrák Alapítvány (Skin Cancer Foundation)'
  },
  {
    id: 'fm_4',
    statement: '„A gyerekkori hólyagos napégések száma közvetlenül és drámaian megsokszorozza a felnőttkori melanoma kialakulásának esélyét.”',
    isFact: true,
    revealText: 'TÉNY! A kutatások igazolják, hogy már 1-2 gyermekkori súlyos, hólyagos napégés több mint duplájára növeli a későbbi életkorban megjelenő melanoma kockázatát.',
    scientificSource: 'Nemzeti Rákintézet (NCI)'
  },
  {
    id: 'fm_5',
    statement: '„A vízben úszva teljesen védve vagyunk, mert a hideg víz lehűti a bőrt és leállítja a leégést.”',
    isFact: false,
    revealText: 'TÉVHIT! A víz hideg érzete csak becsapja az idegrendszert. Az UV-sugarak a vízbe is mélyen behatolnak, miközben a vízfelszín visszaverődése miatt a fej és vállak extra dózist kapnak.',
    scientificSource: 'Magyar Meteorológiai Szolgálat (HungaroMet)'
  },
  {
    id: 'fm_6',
    statement: '„Az UV-index 3-as értéktől felfelé már orvosi szempontból is kötelezővé teszi a megfelelő napvédelmet.”',
    isFact: true,
    revealText: 'TÉNY! A WHO besorolása szerint 0-2 között alacsony a kockázat, de 3-5 között (mérsékelt) már sapka, napszemüveg és fényvédő ajánlott, 6 felett pedig szigorú védelem szükséges.',
    scientificSource: 'WHO UV Index Irányelvek'
  },
  {
    id: 'fm_7',
    statement: '„A D-vitamin képződéséhez naponta legalább 1-2 órán át közvetlenül a déli tűző napon kell feküdni fényvédő nélkül.”',
    isFact: false,
    revealText: 'TÉVHIT! A szervezet optimális D-vitamin szintéziséhez elegendő napi 10-15 perc napfény az arcon és karokon, délelőtt vagy késő délután. Ezen felül a bőr már nem termel több D-vitamint, csak károsodik.',
    scientificSource: 'Harvard Medical School & EADV'
  },
  {
    id: 'fm_8',
    statement: '„A sűrű szövésű, sötétebb ruházat általában magasabb UV-védelmet nyújt, mint egy vékony fehér pamutpóló.”',
    isFact: true,
    revealText: 'TÉNY! Egy nedves, fehér vékony pamutpóló UPF értéke alig 3-5 (a sugárzás felét átengedi!), míg a sötétebb, szorosan szőtt anyagok jobban elnyelik az UV-sugarakat.',
    scientificSource: 'Ausztrál Sugárvédelmi és Nukleáris Biztonsági Hivatal (ARPANSA)'
  }
];

export const DETECTIVE_CASES: DetectiveCase[] = [
  {
    id: 'case_1',
    caseNumber: 'UV-2026-08',
    title: 'A Vitorlázó Különös Leégése',
    victimProfile: 'Kovács Péter (38 éves amatőr vitorlázó, II-es típusú világos bőr)',
    incidentLocation: 'Balatonfüredi öböl nyílt vize',
    reportBrief: 'A sértett reggel 10-től délután 14-ig volt kint a tavon. Az időjárás felhős, enyhén szeles volt. Meg volt győződve róla, hogy a felhők és a szél miatt nem érheti baj. Másnap reggel súlyos, hólyagos égésekkel szállították bőrgyógyászatra.',
    mysteryQuestion: 'Detektív! Mi okozta a váratlanul súlyos égési sérülést a borús napon?',
    options: [
      {
        id: 'opt_1a',
        text: 'A tó vize savassá vált a hirtelen esőzésektől és felmarta a bőrt.',
        isCorrect: false,
        feedback: 'Téves irány! A víz minősége kifogástalan volt, nem kémiai marás történt.'
      },
      {
        id: 'opt_1b',
        text: 'A fátyolfelhők átengedték az UV 80%-át, a vízfelszín visszaverte a sugarakat, a szél pedig elfedte a hőérzetet.',
        isCorrect: true,
        feedback: 'Pontos detektív munka! A szél hűsítő hatása miatt a vitorlázó nem érezte az égést, miközben a felhőkön átjutó UV és a vízfelszíni reflexió duplázta a dózist.'
      },
      {
        id: 'opt_1c',
        text: 'A vitorlavászon fluoreszkáló anyaga radioaktív sugárzást bocsátott ki.',
        isCorrect: false,
        feedback: 'Képtelenség! A vitorlák szabványos poliészterből készülnek, nincs radioaktivitás.'
      }
    ],
    investigationTakeaway: 'Nyílt vízen a közvetlen és a visszavert UV-sugárzás összeadódik, a szél hűsítő illúziója pedig elaltatja a veszélyérzetet.'
  },
  {
    id: 'case_2',
    caseNumber: 'UV-2026-14',
    title: 'Az Irodai Dolgozó Rejtélyes Ráncai',
    victimProfile: 'Dr. Szabó Judit (46 éves jogász, sosem napozik)',
    incidentLocation: 'Modern budapesti üvegpalota, 5. emelet',
    reportBrief: 'A páciens értetlenül áll az előtt, hogy az arcának bal oldala jóval ráncosabb, petyhüdtebb és sötét pigmentfoltokkal borított, miközben a jobb oldala 10 évvel fiatalabbnak látszik. Állítása szerint 15 éve nem járt strandon és szoláriumban sem.',
    mysteryQuestion: 'Milyen láthatatlan környezeti bűntény magyarázza az aszimmetrikus öregedést?',
    options: [
      {
        id: 'opt_2a',
        text: 'A számítógép monitorja kizárólag a bal arcfelére sugárzott kozmikus sugarakat.',
        isCorrect: false,
        feedback: 'Téves! A modern LED monitorok fénye nem képes ilyen mértékű irhakárosodást okozni.'
      },
      {
        id: 'opt_2b',
        text: 'Évtizedek óta a bal oldalán lévő nagy ablak mellett dolgozik: az üveg átengedi az UV-A sugarakat, amik roncsolták a kollagént.',
        isCorrect: true,
        feedback: 'Kiváló megfigyelés! Ez a klasszikus "egyoldalú dermatoheliosis": a hagyományos épület- és autóüveg átengedi a mélyre hatoló UV-A sugarakat, ami aszimmetrikus fényöregedést okoz.'
      },
      {
        id: 'opt_2c',
        text: 'Rossz arckrémet használt a bal oldalára, ami megolvasztotta a bőrszöveteket.',
        isCorrect: false,
        feedback: 'Kizárt, a sértett mindkét oldalára ugyanazt a hidratáló krémet használta.'
      }
    ],
    investigationTakeaway: 'Az ablaküveg nem véd az UV-A sugarak ellen! Ha sokat ülsz ablak mellett vagy vezetsz, mindennap használj UVA-szűrős védelmet.'
  },
  {
    id: 'case_3',
    caseNumber: 'UV-2026-21',
    title: 'A Babakocsi Csalóka Árnyéka',
    victimProfile: '9 hónapos csecsemő és édesanyja',
    incidentLocation: 'Városi park, júliusi délután (33 °C, UV-index: 8.4)',
    reportBrief: 'A gondos édesanya egy fehér pamut textilpelenkát csipeszelt a babakocsi nyílására, hogy megvédje a babát a napfénytől és a rovaroktól. Fél óra séta után a baba bágyadt lett, bőre kipirosodott, belázasodott.',
    mysteryQuestion: 'Milyen kritikus hibát követett el a kismama a jó szándék ellenére?',
    options: [
      {
        id: 'opt_3a',
        text: 'A pelenka üvegházhatást teremtett (a belső hőmérséklet 15 perc alatt akár 37-40 °C-ra ugorhat), miközben a vékony textil az UV egy részét is átengedte.',
        isCorrect: true,
        feedback: 'Fájdalmas igazság! A letakart babakocsiban percek alatt életveszélyes hőség alakul ki a légmozgás hiánya miatt, miközben a vékony pelenka nem helyettesíti a valódi UV-árnyékolást.'
      },
      {
        id: 'opt_3b',
        text: 'A textilpelenka anyaga felszívta a park oxigénjét.',
        isCorrect: false,
        feedback: 'Biológiai képtelenség, a pamut nem nyeli el az oxigént.'
      },
      {
        id: 'opt_3c',
        text: 'A baba allergiás volt a parkban található fűnyesedék szagára.',
        isCorrect: false,
        feedback: 'Nem allergiás reakció, hanem túlhevülés és fényterhelés történt.'
      }
    ],
    investigationTakeaway: 'Soha ne takard le a babakocsit pelenkával vagy takaróval! Használj UV-szűrős rögzíthető napernyőt, ami biztosítja a szabad légáramlást.'
  },
  {
    id: 'case_4',
    caseNumber: 'UV-2026-29',
    title: 'A Reggeli Szuper-Fényvédő Kudarc',
    victimProfile: 'Nagy Balázs (24 éves egyetemi hallgató)',
    incidentLocation: 'Tengerparti nyaralás',
    reportBrief: 'Balázs prémium SPF 50+ vízálló fényvédőt vett. Reggel 8:30-kor alaposan bekente magát a szállodában, majd magabiztosan azt gondolta: „Ma egész nap sérthetetlen vagyok!”. Délután 17 órára mégis rákvörösre égett a háta és a válla.',
    mysteryQuestion: 'Hol csúszott el a nyomozás alanya a védelem alkalmazásakor?',
    options: [
      {
        id: 'opt_4a',
        text: 'A tengervíz sótartalma feloldotta a bőr keratinrétegét.',
        isCorrect: false,
        feedback: 'Téves! A tengervíz nem oldja fel a keratint.'
      },
      {
        id: 'opt_4b',
        text: 'A fürdés, a törölköző dörzsölése és az izzadás órák alatt letörölte a védőréteget, ráadásul nem kente újra 2 óránként a szert.',
        isCorrect: true,
        feedback: 'Mesteri helyzetértékelés! Nincs olyan naptej, ami 8-9 órán át tartana fürdés és törölközés mellett. A "vízálló" jelölés legfeljebb 40-80 percnyi fürdésre garantálja a védelmet.'
      },
      {
        id: 'opt_4c',
        text: 'Az SPF 50-es faktor valójában csak 50 perc védelmet jelent összesen.',
        isCorrect: false,
        feedback: 'Helytelen! Az SPF nem percekben mérendő, hanem a védelmi arány szorzója, de a réteg fizikai kopása miatt újrakrémezés nélkül elveszíti hatását.'
      }
    ],
    investigationTakeaway: 'Nincs egész napos védelem! Vízből kijövetel és törölközés után, illetve alapesetben 2 óránként kötelező az újrakrémezés.'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'badge_first_mission',
    title: 'Kezdő Felfedező',
    description: 'Sikeresen teljesítetted az 1. Küldetést (Gyanús Állítások vizsgálata).',
    iconName: 'Zap',
    unlocked: false
  },
  {
    id: 'badge_fact_hunter',
    title: 'Tévhit-romboló',
    description: 'Tökéletes pontossággal szétválogattad a veszélyes tévhiteket és a tudományos tényeket.',
    iconName: 'ShieldCheck',
    unlocked: false
  },
  {
    id: 'badge_rapid_analyst',
    title: 'Gyorsteszt Mester',
    description: 'Hibátlanul felismerted az igaz és hamis UV-állításokat az ellenőrzésen.',
    iconName: 'Zap',
    unlocked: false
  },
  {
    id: 'badge_case_solver',
    title: 'Főnyomozói Briliáns Elme',
    description: 'Minden rejtélyes UV-ügyiratot sikeresen megoldottál és lezártál.',
    iconName: 'Award',
    unlocked: false
  },
  {
    id: 'badge_uv_scientist',
    title: 'UV-Laboratórium Szakértő',
    description: 'Sikeresen kitöltötted az UV-index kalkulátort és a biztonsági szimulációt.',
    iconName: 'Gauge',
    unlocked: false
  },
  {
    id: 'badge_master_detective',
    title: 'Arany Főfelügyelő',
    description: 'Elérted a legmagasabb nyomozói rangot és kiérdemelted a hivatalos kitüntetést.',
    iconName: 'Sparkles',
    unlocked: false
  }
];
