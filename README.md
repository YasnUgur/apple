# Apple Finans

iPhone’da ücretsiz, App Store’suz kişisel finans uygulaması (PWA).

Veriler yalnızca telefonunda (`localStorage`) tutulur. Hesap / sunucu zorunlu değil.

## iPhone’a uygulama gibi ekleme

1. Uygulamayı bir kez HTTPS ile aç (aşağıdaki yayın adımı).
2. Safari’de **Paylaş → Ana Ekrana Ekle**.
3. Artık ana ekrandan tam ekran uygulama gibi açılır; internet olmadan da açılabilir.

## Geliştirme

```bash
npm install
npm run dev
```

Telefonundan denemek için bilgisayar ve telefon aynı Wi‑Fi’de olsun:

```bash
npm run dev -- --host
```

Çıkan `http://SENIN-IP:5173` adresini Safari’de aç.

## Ücretsiz yayın (önerilen)

```bash
npm run build
```

`dist` klasörünü Cloudflare Pages, Netlify veya GitHub Pages’e yükle. Ücretsiz hesap yeter.

## Özellikler

- Dashboard (net varlık, gelir/gider, yaklaşan ödemeler)
- Aylık finans toplamları
- Varlıklar (altın/döviz TL karşılığı)
- Borçlar / ödemeler
- Piyasa fiyatları (elle güncelleme — sisteme bağlı değil)
- Analiz
