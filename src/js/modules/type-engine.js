/**
 * PRISMA — Type Engine
 * Empfiehlt Schriftpaarungen mit Begründung
 */

const FONT_PAIRINGS = {
  blog: [
    {
      heading: 'Merriweather',
      body: 'Open Sans',
      reason: 'Serif-Heading für Eleganz, Sans-Body für gute Lesbarkeit im langen Blogtext.',
    },
    {
      heading: 'Playfair Display',
      body: 'Inter',
      reason: 'Kontrastreicher Titel mit modernem, neutralem Fließtext für Content-Fokus.',
    },
    {
      heading: 'Lora',
      body: 'Nunito',
      reason: 'Warmer Serif-Ton für Autorenstimmen, klare Sans für leserfreundliche Absätze.',
    },
  ],
  portfolio: [
    {
      heading: 'Montserrat',
      body: 'Roboto',
      reason: 'Geometrisches Heading trifft sachliche Body-Schrift für kreative Portfolios.',
    },
    {
      heading: 'Poppins',
      body: 'Source Sans Pro',
      reason: 'Markanter Display-Look oben, ruhiger Textreadabilty unten.',
    },
    {
      heading: 'Raleway',
      body: 'Noto Sans',
      reason: 'Elegante Headline-Optik und back-to-back neutraler Körpertext.',
    },
  ],
  corporate: [
    {
      heading: 'IBM Plex Serif',
      body: 'IBM Plex Sans',
      reason: 'Kohärente Familie mit klarer Hierarchie und corporate Professionalität.',
    },
    {
      heading: 'Libre Baskerville',
      body: 'PT Sans',
      reason: 'Traditioneller Serif-Titel kombiniert mit schlichtem Sans-Body für Seriosität.',
    },
    {
      heading: 'Crimson Pro',
      body: 'Work Sans',
      reason: 'Starke Serif-Headline, die Vertrauen schafft, ergänzt durch moderne Lesbarkeit.',
    },
  ],
  editorial: [
    {
      heading: 'Cormorant Garamond',
      body: 'Merriweather Sans',
      reason: 'Künstlerisches Heading für Storytelling, dennoch gut lesbare Body-Schrift.',
    },
    {
      heading: 'Bitter',
      body: 'Lato',
      reason: 'Rustikaler Serif-Ton für Titel und ein zugänglicher Sans-Textfluss.',
    },
    {
      heading: 'Tiempos',
      body: 'Open Sans',
      reason: 'Zeitungsähnliches Layoutgefühl durch klassischen Schrifttyp und moderne Body-Balance.',
    },
  ],
  startup: [
    {
      heading: 'Space Grotesk',
      body: 'Inter',
      reason: 'Frischer, technischer Heading-Charakter mit vertrautem Body für digitale Marken.',
    },
    {
      heading: 'Fira Sans',
      body: 'Public Sans',
      reason: 'Leichtfüßiges, seriöses Set für agile Produkt- und Tech-Kommunikation.',
    },
    {
      heading: 'Chivo',
      body: 'IBM Plex Sans',
      reason: 'Starker visueller Auftritt mit schlichtem Fließtext für schnelle Lesbarkeit.',
    },
  ],
  boutique: [
    {
      heading: 'Playfair Display',
      body: 'Muli',
      reason: 'Edle Serif-Headline trifft luftigen Body-Look für Lifestyle- und Fashion-Marken.',
    },
    {
      heading: 'Cormorant',
      body: 'Josefin Sans',
      reason: 'Künstlerische Eleganz im Heading, leichte Sans-Unterstützung im Text.',
    },
    {
      heading: 'Cardo',
      body: 'Quicksand',
      reason: 'Kultivierte Schulter im Titel, freundliche Lesbarkeit in den Absätzen.',
    },
  ],
};

const PAIRING_ALIASES = {
  blog: 'blog',
  portfolio: 'portfolio',
  corporate: 'corporate',
  editorial: 'editorial',
  startup: 'startup',
  boutique: 'boutique',
  magazine: 'editorial',
  agency: 'portfolio',
  shop: 'boutique',
  business: 'corporate',
};

const loadedGoogleFonts = new Set();
const GOOGLE_FONTS_LINK_ID = 'challenge-google-fonts';

const PREVIEW_TEXT = {
  heading: 'The quick brown fox jumps over the lazy dog',
  body: 'A clean sample sentence helps you judge how readable the body text appears.',
  article: 'A short article preview helps you judge the harmony of heading and body fonts in a realistic context.',
};

function normalizeUseCase(useCase) {
  if (typeof useCase !== 'string') {
    return '';
  }

  return useCase
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function generatePairings(useCase) {
  if (!useCase || typeof useCase !== 'string') {
    return getDefaultPairings();
  }

  const normalized = normalizeUseCase(useCase);
  const key = PAIRING_ALIASES[normalized] || normalized;

  if (FONT_PAIRINGS[key]) {
    return FONT_PAIRINGS[key].map((pairing) => ({ ...pairing }));
  }

  return getDefaultPairings();
}

function getDefaultPairings() {
  return [
    {
      heading: 'Playfair Display',
      body: 'Inter',
      reason: 'Klassisches Serif-Heading mit modernem Sans-Body für vielseitige Lesbarkeit.',
    },
    {
      heading: 'Lora',
      body: 'Roboto',
      reason: 'Warmer Serif-Titel für Charakter, ergänzt durch neutrale Allround-Lesbarkeit.',
    },
    {
      heading: 'IBM Plex Sans',
      body: 'Source Sans Pro',
      reason: 'Seriöse Sans-Kombination für klare, zeitgemäße Präsentationen.',
    },
  ];
}

function formatGoogleFontFamily(fontName) {
  return fontName.trim().replace(/\s+/g, '+');
}

function loadGoogleFonts(fontNames) {
  if (!Array.isArray(fontNames) || !fontNames.length || typeof document === 'undefined') {
    return;
  }

  const uniqueFonts = fontNames
    .filter((name) => typeof name === 'string' && name.trim())
    .map((name) => name.trim())
    .reduce((set, fontName) => set.add(fontName), new Set());

  const fontsToLoad = Array.from(uniqueFonts).filter((fontName) => !loadedGoogleFonts.has(fontName));

  if (!fontsToLoad.length) {
    return;
  }

  const allFonts = new Set([...loadedGoogleFonts, ...fontsToLoad]);

  const familyParam = Array.from(allFonts)
    .map((fontName) => formatGoogleFontFamily(fontName))
    .join('&family=');

  if (!familyParam) {
    return;
  }

  let link = document.getElementById(GOOGLE_FONTS_LINK_ID);

  if (!link) {
    link = document.createElement('link');
    link.id = GOOGLE_FONTS_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  link.href = `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`;

  fontsToLoad.forEach((fontName) => loadedGoogleFonts.add(fontName));
}

function createTextPreviewElement(tagName, fontName, i18nKey, textContent) {
  const element = document.createElement(tagName);
  element.style.fontFamily = `'${fontName}', system-ui, sans-serif`;
  element.setAttribute('data-i18n', i18nKey);
  element.textContent = textContent;
  return element;
}

function createPairingCard(pairing, index) {
  const card = document.createElement('article');
  card.className = 'challenge-type-pairing';
  card.dataset.pairingIndex = String(index);

  const mockup = document.createElement('div');
  mockup.className = 'challenge-type-pairing__article';
  mockup.setAttribute('data-i18n', 'typeMatcher.pairing.previewArticle');

  const headingPreview = createTextPreviewElement(
    'h3',
    pairing.heading,
    'typeMatcher.pairing.previewHeading',
    PREVIEW_TEXT.heading,
  );
  headingPreview.className = 'challenge-type-pairing__heading';

  const bodyPreview = createTextPreviewElement(
    'p',
    pairing.body,
    'typeMatcher.pairing.previewBody',
    PREVIEW_TEXT.body,
  );
  bodyPreview.className = 'challenge-type-pairing__body';

  const reason = document.createElement('p');
  reason.className = 'challenge-type-pairing__reason';
  reason.textContent = pairing.reason;

  const articleHeadline = document.createElement('h4');
  articleHeadline.className = 'challenge-type-pairing__mockup-title';
  articleHeadline.style.fontFamily = `'${pairing.heading}', serif`;
  articleHeadline.textContent = 'Design trifft Text: Ein visueller Eindruck.';

  const articleParagraphOne = document.createElement('p');
  articleParagraphOne.style.fontFamily = `'${pairing.body}', sans-serif`;
  articleParagraphOne.textContent =
    'Dieser Mini-Artikel zeigt, wie Überschrift und Fließtext zusammenwirken und eine stimmige Typografie erzeugen.';

  const articleParagraphTwo = document.createElement('p');
  articleParagraphTwo.style.fontFamily = `'${pairing.body}', sans-serif`;
  articleParagraphTwo.textContent =
    'Mit einer Kombination aus kontrastreicher Headline und gut lesbarem Body entsteht ein überzeugender visueller Rhythmus.';

  const authorLine = document.createElement('p');
  authorLine.className = 'challenge-type-pairing__author';
  authorLine.style.fontFamily = `'${pairing.body}', sans-serif`;
  authorLine.textContent = 'Autor • Typografie | PRISMA';

  const selectButton = document.createElement('button');
  selectButton.type = 'button';
  selectButton.className = 'challenge-type-pairing__select';
  selectButton.textContent = 'Auswählen';
  selectButton.setAttribute('aria-pressed', 'false');
  selectButton.dataset.pairingIndex = String(index);

  selectButton.addEventListener('click', () => {
    const cardRoot = selectButton.closest('.challenge-type-pairing');
    if (!cardRoot || !cardRoot.parentElement) {
      return;
    }

    const allCards = Array.from(cardRoot.parentElement.querySelectorAll('.challenge-type-pairing'));
    allCards.forEach((item) => {
      const button = item.querySelector('.challenge-type-pairing__select');
      item.classList.toggle('challenge-type-pairing--selected', item === cardRoot);
      if (button) {
        button.setAttribute('aria-pressed', item === cardRoot ? 'true' : 'false');
      }
    });
  });

  mockup.appendChild(headingPreview);
  mockup.appendChild(bodyPreview);
  mockup.appendChild(reason);
  mockup.appendChild(articleHeadline);
  mockup.appendChild(articleParagraphOne);
  mockup.appendChild(articleParagraphTwo);
  mockup.appendChild(authorLine);

  card.appendChild(mockup);
  card.appendChild(selectButton);

  return card;
}

function setSelectedPairing(container, selectedIndex) {
  const cards = Array.from(container.querySelectorAll('.challenge-type-pairing'));
  cards.forEach((card, index) => {
    const button = card.querySelector('.challenge-type-pairing__select');
    const selected = index === selectedIndex;
    card.classList.toggle('challenge-type-pairing--selected', selected);
    if (button) {
      button.setAttribute('aria-pressed', String(selected));
    }
  });
}

function startFontRoulette(pairings, container, rouletteButton) {
  const cards = Array.from(container.querySelectorAll('.challenge-type-pairing'));
  if (!cards.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finalize = (finalIndex) => {
    setSelectedPairing(container, finalIndex);
    rouletteButton.disabled = false;
  };

  if (prefersReducedMotion) {
    const finalIndex = Math.floor(Math.random() * cards.length);
    finalize(finalIndex);
    return;
  }

  rouletteButton.disabled = true;

  let iteration = 0;
  const totalIterations = 12;
  const intervalMs = 125;
  const timer = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    setSelectedPairing(container, randomIndex);
    iteration += 1;

    if (iteration >= totalIterations) {
      clearInterval(timer);
      finalize(randomIndex);
    }
  }, intervalMs);
}

export function renderPairings(pairings, containerSelector = '#type-preview') {
  if (!Array.isArray(pairings) || typeof document === 'undefined') {
    return;
  }

  const container = document.querySelector(containerSelector);
  if (!container) {
    return;
  }

  const fontsToLoad = pairings.flatMap((pairing) => [pairing.heading, pairing.body]);
  loadGoogleFonts(fontsToLoad);

  container.innerHTML = '';

  const rouletteWrapper = document.createElement('div');
  rouletteWrapper.className = 'challenge-type-pairing__roulette';

  const rouletteButton = document.createElement('button');
  rouletteButton.type = 'button';
  rouletteButton.className = 'challenge-type-pairing__roulette-btn';
  rouletteButton.setAttribute('aria-label', 'Schrift-Roulette starten');
  rouletteButton.textContent = 'Font Roulette';

  rouletteButton.addEventListener('click', () => startFontRoulette(pairings, pairingList, rouletteButton));

  rouletteWrapper.appendChild(rouletteButton);
  container.appendChild(rouletteWrapper);

  const pairingList = document.createElement('div');
  pairingList.className = 'challenge-type-pairing__list';

  pairings.forEach((pairing, index) => {
    const card = createPairingCard(pairing, index);
    pairingList.appendChild(card);
  });

  container.appendChild(pairingList);
}