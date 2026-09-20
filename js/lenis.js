// ==========================================
// 1. Lenisの初期化（必ず一番上に書く）
// ==========================================
const lenis = new Lenis({
  duration: 1.2,      
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  smoothWheel: true,  
  wheelMultiplier: 1, 
});

// ==========================================
// 2. 毎フレーム Lenis を更新するループ
// ==========================================
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
// ここで初めて raf を呼び出す
requestAnimationFrame(raf);

// ==========================================
// 3. GSAP ScrollTrigger と同期させる設定
// ==========================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// ==========================================
// 4. ページ内リンク（アンカーリンク）の制御
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = this.getAttribute('href');
    if (target !== '#') {
      lenis.scrollTo(target, {
        offset: -80, 
        duration: 1.5,
      });
    }
  });
});