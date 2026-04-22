# Seesaw Simulation

Playground seesaw simülasyonu. Pure HTML, CSS ve JavaScript ile yazıldı.

## Çalıştırma

`index.html` dosyasını tarayıcıda açılarak uygulama görüntülenir.

## Mimari

Tüm JavaScript kodu tek bir `app.js` dosyasında bulunmakta. Yukarıdan aşağıya okunacak şekilde gruplandırıldı:

- **Constants** — magic number'ların tek bir yerde tutulması
- **State** — `objects`, `currentAngle`, `targetAngle`
- **Physics** — tork hesabı ve açı clamp'i
- **Animation** — RAF loop ile `currentAngle` takibi
- **Render** — state'ten DOM'a senkronizasyon
- **Storage** — localStorage okuma/yazma
- **Events** — click handling ve koordinat dönüşümü
- **Init** — sayfa yükleme

## Teknik Kararlar

### Koordinat Dönüşümü

Plank döndüğünde mouse click koordinatları ekran uzayında gelir. `event.offsetX` child element'lere tıklandığında yanlış değer verir. Bunun yerine `getBoundingClientRect()` ile plank merkezini bulup ters rotasyon matrisi uyguladım:

```js
const localX = dx * Math.cos(-rad) - dy * Math.sin(-rad);
```

Bu sayede plank hangi açıda olursa olsun tıklanan nokta pivot'a göre doğru hesaplanıyor.

### İki Katmanlı Animasyon

CSS `transition` görsel döndürmeyi GPU'da hallediyor. Paralel bir `requestAnimationFrame` loop'u ise `state.currentAngle`'ı JS tarafında günceller. Animasyon ortasında tıklama olursa koordinat hesabının o anki görsel açıyı kullanması gerekiyor — bunun için bu iki track gerekli oldu.

### localStorage

Yalnızca `objects` array'i saklanır. Açılar her yüklemede nesnelerden sıfırdan hesaplanır. İlk yüklemede `transition: none` ile snap yapılır, böylece sayfa açılışında gereksiz animasyon olmaz.

## Trade-off'lar

- DOM seçildi canvas yerine — erişilebilirlik ve CSS entegrasyonu açısından daha uygun, ama çok sayıda obje için canvas daha performanslı olurdu
- Tek dosya — küçük proje için overkill olmadan yeterli organizasyon sağlıyor

## AI Kullanımı

CSS yazımında AI araçlarından yararlandım — layout, renk paleti, animasyon transition değerleri ve `.object` konumlandırma gibi stil kararlarında. JavaScript tarafındaki koordinat dönüşüm mantığı, state tasarımı, fizik hesapları ve animasyon mimarisi tarafımdan yazıldı.
