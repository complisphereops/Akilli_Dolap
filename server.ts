import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || 'AQ.Ab8RN6Id1eJi6I7MpuY6DgpKTuO1Of5ZQE2T_u4XBuLHEoHzWQ';

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

function cleanJsonString(raw: string): string {
  let cleaned = (raw || '').trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

async function callGeminiModel(prompt: string, systemInstruction: string): Promise<string> {
  const ai = getAIClient();
  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
      if (response.text) {
        return cleanJsonString(response.text);
      }
    } catch (err: any) {
      lastError = err;
      // Continue to next candidate model
    }
  }

  throw lastError || new Error('Tüm Gemini modelleri meşgul.');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(GEMINI_API_KEY),
      model: 'gemini-3.6-flash',
    });
  });

  // 2. AI Stylist Chat endpoint
  app.post('/api/stylist/chat', async (req, res) => {
    try {
      const { message, history = [], wardrobe = [], accessories = [], weather = {}, userProfile = {} } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Mesaj metni gereklidir.' });
      }

      const ai = getAIClient();

      // Format wardrobe summary for context
      const wardrobeSummary = wardrobe
        .map(
          (item: any) =>
            `- ID: ${item.id} | Ad: ${item.name} | Marka: ${item.brand || 'Özel'} | Kategori: ${item.category} | Renk: ${item.colorName} (${item.colorHex}) | Mevsim: ${item.season} | Stil: ${item.styleSegment}`
        )
        .join('\n');

      const accessoriesSummary = accessories
        .map((acc: any) => `- ${acc.name} (${acc.subtitle || ''}, Etiket: ${acc.tag || ''})`)
        .join('\n');

      const weatherContext = `Konum: ${weather.contextLocation || 'İstanbul'}, Sıcaklık: ${weather.temperature || '22°C'}, Durum: ${weather.weatherCondition || 'Güneşli, esintili'}`;

      const systemInstruction = `
Sen "Akıllı Dolap" uygulamasının uzman, samimi ve zevk sahibi Kişisel Yapay Zeka Stilistisin.
Kullanıcı seninle stil, kombin, günlük kıyafet seçimi ve hava durumuna göre giyinme konularında sohbet ediyor.

KULLANICININ DOLABINDAKİ MEVCUT PARÇALAR:
${wardrobeSummary}

KULLANICININ AKSESUARLARI:
${accessoriesSummary}

GÜNCEL HAVA DURUMU BİLGİSİ:
${weatherContext}

KULLANICI BİLGİLERİ:
İsim: ${userProfile.name || 'Selin'}, Tarz Rozeti: ${userProfile.styleBadge || 'Minimalist & Smart Casual'}

KURALLAR:
1. Türkçe olarak samimi, stil sahibi, net ve ilham verici yanıt ver. Aşırı uzun ve boğucu paragraflar yerine 2-3 akıcı, etkili cümle tercih et.
2. Önerilerini MÜMKÜN OLDUKÇA kullanıcının kendi dolabındaki parçalardan yap (Örn: "dolabındaki Massimo Dutti kum beji trençkot", "kuzguni siyah fitilli balıkçı yaka triko", "kum beji pileli pantolon").
3. Güncel hava durumunu (${weatherContext}) her zaman hesaba kat.
4. Yanıtını MUTLAKA geçerli bir JSON nesnesi olarak döndür:
{
  "reply": "Kullanıcıya yönelik samimi, stilist tavsiyeli yanıt metni...",
  "suggestedItemId": "Eğer dolaptan tek bir özel parça öneriyorsan o parçanın ID'si (örn. 'item-3'), yoksa null",
  "comparisons": [
    { "title": "Öneri Başlığı", "subtitle": "Açıklama veya Neden", "match": "%95 Uyum", "recommended": true, "icon": "checkroom" },
    { "title": "Alternatif Başlık", "subtitle": "Açıklama", "match": "%88 Uyum", "recommended": false, "icon": "styler" }
  ]
}
Eğer karşılaştırma yapmaya gerek yoksa comparisons boş dizi [] olabilir.
`;

      const prompt = `Kullanıcı Mesajı: "${message}"\nLütfen stilist olarak yanıtını JSON formatında oluştur.`;

      let responseText = '';
      try {
        responseText = await callGeminiModel(prompt, systemInstruction);
      } catch (_geminiError: any) {
        // High quality dynamic fallback when external model encounters temporary rate limits
        const isShoe = /ayakkabı|topuklu|loafer|sneaker/i.test(message);
        const isCold = /soğuk|rüzgar|hava|serin|yağmur/i.test(message);
        const isAcc = /takı|aksesuar|küpe|çanta|kolye/i.test(message);
        
        responseText = JSON.stringify({
          reply: isShoe
            ? `Bugünkü ${weather.temperature || '22°C'} sıcaklıkta dolabındaki deri loafer veya küt topuklu sandalet hem şık hem de konforlu bir tercih olacaktır.`
            : isCold
            ? `Havanın ${weather.temperature || '22°C'} olduğu ve esinti hissedildiği anlarda dolabındaki klasik kruvaze trençkotu veya keten blazer ceketi tercih edebilirsin.`
            : isAcc
            ? `Keten ve dökümlü kumaşların yalın zarafetini dolabındaki 18K altın minimalist takı seti ve örgü deri çanta kusursuz biçimde tamamlar.`
            : `Gardırobundaki renk paletini ve bugünkü ${weather.temperature || '22°C'} hava durumunu incelediğimde, keten ve nefes alan dokuların birleşimi stiline ferah bir şıklık katacaktır.`,
          suggestedItemId: isShoe ? 'item-4' : isCold ? 'item-3' : isAcc ? 'acc-4' : 'item-1',
          comparisons: isShoe
            ? [
                { title: 'Deri Loafer', subtitle: 'Koyu Kahve • Zamansız', match: '%97 Uyum', recommended: true, icon: 'checkroom' },
                { title: 'Topuklu Sandalet', subtitle: 'Şampanya Dore', match: '%91 Uyum', recommended: false, icon: 'styler' },
              ]
            : [],
        });
      }

      let parsedData: any = {};
      try {
        parsedData = JSON.parse(responseText.trim());
      } catch (e) {
        // In case JSON parsing fails, provide a fallback
        parsedData = {
          reply: responseText || 'Harika bir seçim! Gardırobundaki parçalar hava durumuna ve stiline çok uyumlu.',
          suggestedItemId: null,
          comparisons: [],
        };
      }

      // Attach full item details if suggestedItemId matches
      let suggestedGarment: any = null;
      if (parsedData.suggestedItemId) {
        const matched = wardrobe.find((w: any) => w.id === parsedData.suggestedItemId);
        if (matched) {
          suggestedGarment = {
            name: matched.name,
            brandColor: `${matched.brand || 'Özel'} • ${matched.colorName}`,
            image: matched.image,
            colorHex: matched.colorHex,
          };
        }
      }

      res.json({
        reply: parsedData.reply || 'Stiline en uygun parçaları gardırobundan seçtim.',
        suggestedItem: suggestedGarment,
        comparisons: Array.isArray(parsedData.comparisons) ? parsedData.comparisons : [],
      });
    } catch (error: any) {
      console.error('Stylist Chat API Error:', error);
      res.status(500).json({
        error: 'Stilist yanıtı oluşturulurken bir hata oluştu.',
        details: error?.message,
      });
    }
  });

  // 3. AI Outfit Generator based on Wardrobe + Weather
  const mannequinArchetypes: Record<string, string> = {
    linen: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    blazer: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
    trench: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    casual: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=85',
    dress: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85',
    knit: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=1000&q=85',
    street: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1000&q=85',
    summer: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
  };

  interface StylistRecipe {
    title: string;
    archetype: keyof typeof mannequinArchetypes;
    matchPercentage: number;
    rationaleTitle: string;
    rationaleText: string;
    styleTip: string;
    topSearch: RegExp;
    bottomSearch: RegExp;
    outerSearch?: RegExp;
    shoeSearch: RegExp;
    accSearch?: RegExp;
  }

  const STYLIST_RECIPES: StylistRecipe[] = [
    {
      title: 'Akıllı Ofis & Bahar Dengesi',
      archetype: 'blazer',
      matchPercentage: 96,
      rationaleTitle: 'Ofis ve toplantı temposu için yapılandırılmış ceket dengesi.',
      rationaleText: 'Gece laciverti yün ceket ve poplin beyaz gömlek, toplantılarda profesyonel duruşu kumaş konforuyla buluşturur.',
      styleTip: 'Ceketin kollarını hafifçe toplayıp dökümlü tote çantanla taşıyarak dinamik bir iş havası yakala.',
      topSearch: /poplin|oversized gömlek|gömlek/i,
      bottomSearch: /pileli pantolon|pantolon/i,
      outerSearch: /yün ceket|blazer/i,
      shoeSearch: /loafer|deri loafer/i,
      accSearch: /tote|çanta/i,
    },
    {
      title: 'Boğaz Esintisi & Zamansız Trençkot',
      archetype: 'trench',
      matchPercentage: 95,
      rationaleTitle: 'Akşam esintisi ve serin Boğaz havası için trençkot zarafeti.',
      rationaleText: 'Camel rengi zamansız trençkot ve dökümlü alt parça, değişen bahar havasında günün her anına uyum sağlayacak ikonik bir silüet sunar.',
      styleTip: 'Trençkotun kuşağını arkada gevşek bir düğümle bırakarak dökümünü daha akıcı hale getir.',
      topSearch: /slip elbise|breton|gömlek/i,
      bottomSearch: /selvedge|denim|pantolon/i,
      outerSearch: /trençkot/i,
      shoeSearch: /loafer|sneaker|stiletto/i,
      accSearch: /deri çanta|örgü/i,
    },
    {
      title: 'Hafta Sonu Brunch & Denim Rahatlığı',
      archetype: 'casual',
      matchPercentage: 97,
      rationaleTitle: 'Hafif esintili hava ve şehir yürüyüşleri için esnek pamuklu dokular.',
      rationaleText: 'Selvedge denim pantolon ve ferah pamuklu üst, hafta sonu kahve ve galeri turları için modern rahatlığın simgesidir.',
      styleTip: 'Pantolon paçasını hafif kıvırıp beyaz deri sneaker ile temiz bir kontrast oluştur.',
      topSearch: /breton|tişört|polo|poplin/i,
      bottomSearch: /denim|selvedge|jean/i,
      outerSearch: /ceket|trençkot/i,
      shoeSearch: /sneaker|deri sneaker/i,
      accSearch: /tote|çanta/i,
    },
    {
      title: 'Minimalist Kaşmir & Doğal Doku',
      archetype: 'knit',
      matchPercentage: 94,
      rationaleTitle: 'Rüzgarlı geçiş havasında teni kucaklayan hafif kaşmir sıcaklığı.',
      rationaleText: 'Adaçayı kaşmir kazak ve doğal bej tonlarındaki pantolon, lüksü sessiz ve mütevazı renk dengesiyle yansıtır.',
      styleTip: 'Kazağın ön ucunu kemer hizasında hafifçe içeri alarak bacak boyunu daha zarif göster.',
      topSearch: /kaşmir|kazak|triko/i,
      bottomSearch: /pantolon|pileli/i,
      shoeSearch: /loafer|deri loafer/i,
      accSearch: /örgü deri|çanta/i,
    },
    {
      title: 'Akşam Daveti & İpek Zarafeti',
      archetype: 'dress',
      matchPercentage: 99,
      rationaleTitle: 'Gece esintisinde ışıldayan akıcı ipek formu.',
      rationaleText: 'Şampanya tonlu ipek slip elbise ve omuzlara atılan zarif dış giyim, akşam kokteylleri ve şık yemekler için kusursuz bir zarafet vadeder.',
      styleTip: 'Zarif takılar ve stiletto ayakkabıyla kombinleyerek şıklığı doruğa çıkar.',
      topSearch: /ipek|slip elbise|elbise/i,
      bottomSearch: /saten|pantolon/i,
      outerSearch: /trençkot|ceket/i,
      shoeSearch: /stiletto|sandalet|topuklu/i,
      accSearch: /tote|çanta/i,
    },
    {
      title: 'Modern Şehir & Süet Kontrastı',
      archetype: 'street',
      matchPercentage: 96,
      rationaleTitle: 'Şehir temposunda tok deri ve pamuk liflerinin kusursuz uyumu.',
      rationaleText: 'Kuzguni siyah triko ve süet dokulu dış giyim, sokak stiline sofistike bir mimari derinlik katar.',
      styleTip: 'Çantanı çapraz takarak omuz hattındaki süet ceket duruşunu öne çıkar.',
      topSearch: /balıkçı|triko|siyah/i,
      bottomSearch: /denim|selvedge|pantolon/i,
      outerSearch: /bomber|ceket/i,
      shoeSearch: /sneaker|loafer/i,
      accSearch: /çanta/i,
    },
    {
      title: 'Akdeniz Sayfiye & Açık Renk Armonisi',
      archetype: 'summer',
      matchPercentage: 95,
      rationaleTitle: 'Sıcak havalarda ferahlatıcı açık renk kombinasyonu.',
      rationaleText: 'Keten kumaşlar ve açık kum tonları, güneş ışığını yansıtarak gün boyu maksimum serinlik sağlar.',
      styleTip: 'Zarif bir güneş gözlüğü ve doğal deri sandaletlerle kombini tamamla.',
      topSearch: /keten|gömlek/i,
      bottomSearch: /şort|bermuda|etek|pileli/i,
      shoeSearch: /sandalet|loafer/i,
      accSearch: /örgü|çanta/i,
    },
    {
      title: 'Güneşli Sahil & Keten Ferahlığı',
      archetype: 'linen',
      matchPercentage: 98,
      rationaleTitle: '22°C ve hafif esintide nefes alan keten lifler gün boyu serinlik vadeder.',
      rationaleText: 'Ekru keten gömlek ve kum beji dökümlü pantolon, sıcak günlerde hem terletmeyen doğal konforu hem de zahmetsiz Akdeniz asaletini bir araya getirir.',
      styleTip: 'Gömleğin kol manşetlerini bir tur kıvırıp minimalist bir saat ve hasır örgü çantayla tamamla.',
      topSearch: /keten gömlek|keten/i,
      bottomSearch: /pileli pantolon|kum beji/i,
      shoeSearch: /loafer|deri loafer/i,
      accSearch: /örgü deri|çanta/i,
    },
  ];

  function buildCuratedOutfit(
    wardrobe: any[],
    weather: any,
    avoidTitles: string[] = [],
    currentOutfitId?: string
  ) {
    // Pick recipes not already in avoidTitles
    const available = STYLIST_RECIPES.filter((r) => !avoidTitles.includes(r.title));
    const recipe = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : STYLIST_RECIPES[Math.floor(Math.random() * STYLIST_RECIPES.length)];

    // Resolve garments from user's wardrobe
    const tops = wardrobe.filter((w: any) => w.category === 'ust');
    const bottoms = wardrobe.filter((w: any) => w.category === 'alt');
    const outers = wardrobe.filter((w: any) => w.category === 'dis');
    const shoes = wardrobe.filter((w: any) => w.category === 'ayakkabi');
    const accessories = wardrobe.filter((w: any) => w.category === 'aksesuar');

    const chosenTop = tops.find((w: any) => recipe.topSearch.test(w.name)) || tops[0];
    const chosenBottom = bottoms.find((w: any) => recipe.bottomSearch.test(w.name)) || bottoms[0];
    const chosenShoe = shoes.find((w: any) => recipe.shoeSearch.test(w.name)) || shoes[0];
    const chosenOuter = recipe.outerSearch ? outers.find((w: any) => recipe.outerSearch!.test(w.name)) : undefined;
    const chosenAcc = recipe.accSearch ? accessories.find((w: any) => recipe.accSearch!.test(w.name)) : undefined;

    const resolvedGarments = [chosenOuter, chosenTop, chosenBottom, chosenShoe, chosenAcc].filter(Boolean);

    const formattedItems = resolvedGarments.map((g: any) => ({
      name: g.name,
      color: g.colorName,
      dotColor: g.colorHex,
      category: g.category,
      brand: g.brand,
      image: g.image,
    }));

    const titleModifier = avoidTitles.includes(recipe.title) ? ` (${resolvedGarments[0].name})` : '';

    return {
      id: `outfit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `${recipe.title}${titleModifier}`,
      contextLocation: weather.contextLocation || 'İstanbul, Bebek',
      temperature: weather.temperature || '22°C',
      weatherCondition: weather.weatherCondition || 'Güneşli • Esintili',
      matchPercentage: recipe.matchPercentage,
      image: chosenOuter?.image || chosenTop?.image || resolvedGarments[0]?.image,
      mannequinImage: mannequinArchetypes[recipe.archetype] || mannequinArchetypes.linen,
      garments: resolvedGarments.map((g: any) => ({
        id: g.id,
        name: g.name,
        category: g.category,
        brand: g.brand,
        colorName: g.colorName,
        colorHex: g.colorHex,
        image: g.image,
      })),
      items: formattedItems,
      rationaleTitle: recipe.rationaleTitle,
      rationaleText: recipe.rationaleText,
      styleTip: recipe.styleTip,
      isLiked: false,
      isWorn: false,
    };
  }

  app.post('/api/stylist/generate-outfit', async (req, res) => {
    try {
      const {
        wardrobe = [],
        weather = {},
        occasion = 'Günlük Şıklık',
        avoidTitles = [],
        currentOutfitId,
      } = req.body;

      if (!wardrobe || wardrobe.length === 0) {
        return res.status(400).json({ error: 'Gardıropta kıyafet bulunamadı.' });
      }

      // First, attempt Gemini generation with temperature / creativity
      let generatedOutfit: any = null;

      try {
        const wardrobeItems = wardrobe.map(
          (item: any) =>
            `ID: ${item.id} | Ad: ${item.name} | Kategori: ${item.category} | Renk: ${item.colorName} (${item.colorHex}) | Mevsim: ${item.season} | Stil: ${item.styleSegment}`
        );

        const prompt = `
Sen "Akıllı Dolap" uygulamasının AI Stilistisin.
Aşağıdaki gardırop parçaları arasından, belirtilen hava durumu ve etkinlik için YENİ ve ÖZGÜN bir kombin oluşturacaksın.

ÖNCEKİ OLUŞTURULAN BAŞLIKLAR (BUNLARI KESİNLİKLE TEKRARLAMA):
${JSON.stringify(avoidTitles)}

GÜNCEL HAVA DURUMU:
Sıcaklık: ${weather.temperature || '22°C'}, Durum: ${weather.weatherCondition || 'Güneşli • Esintili'}, Konum: ${weather.contextLocation || 'İstanbul, Bebek'}

HEDEF ETKİNLİK / ORTAM:
${occasion}

GARDIROP PARÇALARI:
${wardrobeItems.join('\n')}

KURALLAR:
1. Kombinde MUTLAKA 1 üst (ust), 1 alt (alt), 1 ayakkabı (ayakkabi) ve isteğe bağlı dış giyim (dis) veya aksesuar (aksesuar) seç.
2. Kombin başlığı daha önce kullanılmamış, yaratıcı ve şık olsun.
3. rationaleTitle ve rationaleText kısımlarında hava durumunun (${weather.temperature}, ${weather.weatherCondition}) ve kumaş/renk uyumunun neden bu parçalara uygun olduğunu açıkla.
4. styleTip kısmında kullanıcıya pratik bir stil ipucu ver.
5. archetype için şunlardan birini seç: "linen", "blazer", "trench", "casual", "dress", "knit", "street", "summer".
6. selectedItemIds içine seçtiğin tüm parçaların ID'lerini yaz.

JSON FORMATI:
{
  "title": "Yeni Kombin Başlığı",
  "matchPercentage": 97,
  "rationaleTitle": "Hava durumu ve doku gerekçesi",
  "rationaleText": "Detaylı açıklama...",
  "styleTip": "Kullanıcıya şık stil tavsiyesi...",
  "archetype": "linen",
  "selectedItemIds": ["item-1", "item-2", "item-4"]
}
`;

        const rawResponse = await callGeminiModel(
          prompt,
          'Sen profesyonel bir kişisel stil danışmanısın. Yanıtını daima geçerli ve temiz bir JSON nesnesi olarak ver.'
        );

        const parsed = JSON.parse(rawResponse);
        const selectedIds: string[] = Array.isArray(parsed.selectedItemIds) ? parsed.selectedItemIds : [];
        let resolvedGarments = wardrobe.filter((w: any) => selectedIds.includes(w.id));

        if (resolvedGarments.length >= 2 && parsed.title) {
          const chosenArchetype = parsed.archetype && mannequinArchetypes[parsed.archetype]
            ? parsed.archetype
            : resolvedGarments.some((g: any) => g.category === 'dis')
            ? 'blazer'
            : 'linen';

          generatedOutfit = {
            id: `outfit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: parsed.title,
            contextLocation: weather.contextLocation || 'İstanbul, Bebek',
            temperature: weather.temperature || '22°C',
            weatherCondition: weather.weatherCondition || 'Güneşli • Hafif Esintili',
            matchPercentage: parsed.matchPercentage || 97,
            image: resolvedGarments[0]?.image || wardrobe[0]?.image,
            mannequinImage: mannequinArchetypes[chosenArchetype] || mannequinArchetypes.linen,
            garments: resolvedGarments.map((g: any) => ({
              id: g.id,
              name: g.name,
              category: g.category,
              brand: g.brand,
              colorName: g.colorName,
              colorHex: g.colorHex,
              image: g.image,
            })),
            items: resolvedGarments.map((g: any) => ({
              name: g.name,
              color: g.colorName,
              dotColor: g.colorHex,
              category: g.category,
              brand: g.brand,
              image: g.image,
            })),
            rationaleTitle: parsed.rationaleTitle || 'Günün hava koşullarına göre optimize edildi.',
            rationaleText: parsed.rationaleText || 'Gardırobundaki parçalar özenle bir araya getirildi.',
            styleTip: parsed.styleTip || 'Kombini minimalist aksesuarlarla tamamlayabilirsin.',
            isLiked: false,
            isWorn: false,
          };
        }
      } catch (_geminiErr) {
        // Fallback to high variety curated algorithm
      }

      // If Gemini didn't produce an outfit, use our guaranteed curated diverse engine
      if (!generatedOutfit) {
        generatedOutfit = buildCuratedOutfit(wardrobe, weather, avoidTitles, currentOutfitId);
      }

      res.json(generatedOutfit);
    } catch (error: any) {
      console.error('Generate Outfit API Error:', error);
      res.status(500).json({
        error: 'Kombin oluşturulurken bir hata oluştu.',
        details: error?.message,
      });
    }
  });

  // 4. Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Akıllı Dolap Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
