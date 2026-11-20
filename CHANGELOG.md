# Değişiklik günlüğü

## v2.1 · Kasım 2026

Bakım ve yenilik güncellemesi. Oyunun adresi, kayıt verisi (`arena.marti.*`) ve oynanış değişmedi; eski kayıtlarla açılır.

### Yenilikler
- **Başarımlar:** 11 yerel rozet (ilk uçuş, 1 km, 3 km, simit sofrası, balıkçı martı, kombo ustası, kıl payı, gece martısı, yavru büyüdü, günün üç görevi, üç bin puan). Koşu bitiş kartında ve Yenilikler penceresinde görünür; kayıt `arena.marti.save` içindeki `ach` alanında tutulur. `?auto` botu yazmaz.
- **Rekor bildirimi:** Kendi en iyi skorunu koşu sırasında geçtiğin an ses, titreşim ve küçük bir kutlama efektiyle haber verilir (azaltılmış hareket açıksa efekt yok).
- **Sürüm etiketi ve Yenilikler penceresi:** Ana menünün altında "v2.1 · Kasım 2026", ayarlarda sürüm satırı, Esc ile kapanan Yenilikler penceresi.
- **Diğer oyunlar bağlantısı:** Ana menüden https://furkiozknn.github.io/ adresine (portal sürümlerinde gizli).

### Düzeltmeler ve sayfa
- Ana menü alt bağlantıları ve "Günün Meydan Okuması" düğmesi 44 px dokunma hedefinin altındaydı; büyütüldü.
- Paylaşım meta verisi tamamlandı: `twitter:title`, `twitter:description`, `twitter:image`, `theme-color`.
- `404.html` eklendi (oyuna ve merkez sayfaya dönüş bağlantılı).
- README güncellendi, `test/duman.mjs` duman testi eklendi.
