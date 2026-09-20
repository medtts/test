// ==========================================================================
// 要素の取得と初期設定
// ==========================================================================
const scrollTopBtn = document.getElementById('scrollTopBtn');
const h1Title = document.querySelector('.pc-nav');    
const spNav = document.querySelector('.sp-nav');   
const hamburgerBtn = document.querySelector('.hamburger-btn');
const navLinks = document.querySelectorAll('.g_nav a');
const worksSection = document.querySelector('#hero');

// 直前のスクロール位置を記録しておくための変数
let lastScrollY = window.scrollY;

// ==========================================================================
// 画面スクロール時の制御（上下判定と各ボタンの表示非表示）
// ==========================================================================
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    //  トップに戻るボタンの制御 
    if (currentScrollY > 300) {
        // 画面サイズに関係なく（PC・スマホ共通）、上下スクロールで表示・非表示を切り替える
        if (currentScrollY < lastScrollY) {
            scrollTopBtn.classList.add('is-show'); // 上スクロールで表示
        } else {
            scrollTopBtn.classList.remove('is-show'); // 下スクロールで非表示
        }
    } else {
        scrollTopBtn.classList.remove('is-show'); // 300px未満は非表示
    }

    //  ナビゲーションとハンバーガーボタンの非表示制御 
    // 背景が反転（Heroを抜けた状態）しているときだけ実行
    if (h1Title.classList.contains('is-inverted') || spNav.classList.contains('is-inverted')) {
        
        // スマホサイズ（768px以下）のとき「だけ」下スクロールで隠す
        if (window.innerWidth <= 768 && currentScrollY > lastScrollY && currentScrollY > 100) {
            spNav.classList.add('is-hidden');
            hamburgerBtn.classList.add('is-hidden');
        } else {
            // 上スクロールのとき、またはPCサイズ（769px以上）のときは常に表示
            h1Title.classList.remove('is-hidden');
            spNav.classList.remove('is-hidden');
            hamburgerBtn.classList.remove('is-hidden');
        }
    } else {
        // Heroセクション（最上部）にいる時は隠しクラスを外す
        h1Title.classList.remove('is-hidden');
        spNav.classList.remove('is-hidden');
        hamburgerBtn.classList.remove('is-hidden');
    }

    // 次の判定のために現在のスクロール位置を保存
    lastScrollY = currentScrollY;
});

async function loadWorks() {
    try {
        const response = await fetch('js/data.json'); 
        const worksData = await response.json();
        const worksContainer = document.getElementById('works-grid');

        worksData.forEach(work => {
            const workCard = `
                <div class="work-card-link" style="display: block; color: inherit;">
                    <div class="mockup-container"><a href="work.html?id=${work.id}" class="">
                        <img src="image/MacBookFrame.webp" alt="" class="mockup-body">
                        <div class="screen-content">
                            <img src="${work.mac_image}" alt="${work.title}" loading="lazy">
                        </div>
                        <div class="mockup-iphone">
                            <img src="image/iPhoneFrame.webp" alt="" class="iphone-body">
                            <div class="iphone-screen">
                                <img src="${work.sp_image}" alt="${work.title} スマホ版" loading="lazy">
                            </div>
                        </div>
                    </a></div>
                    <div class="work-info">
                        <h4>${work.title}</h4>
                        <p>${work.description}</p>
                        <div class="work-footer">
                            <span class="tech-tag">${work.category}</span>
                            <a href="work.html?id=${work.id}" class="detail">詳細はこちら</a>
                        </div>
                    </div>
                </div>
            `;
            worksContainer.insertAdjacentHTML('beforeend', workCard);
        });
    } catch (error) {
        console.error('データの読み込みに失敗しました：', error);
    }
}

document.addEventListener('DOMContentLoaded', loadWorks);

// ==========================================================================
// IntersectionObserver による背景色反転（is-inverted）の制御
// ==========================================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            // Heroセクションが画面から外れたら色を反転させる（PC用・スマホ用両方）
            h1Title.classList.add('is-inverted');
            spNav.classList.add('is-inverted');
            hamburgerBtn.classList.add('is-inverted');
        } else {
            // 最上部に戻ったら元の色（白）に戻す
            h1Title.classList.remove('is-inverted');
            spNav.classList.remove('is-inverted');
            hamburgerBtn.classList.remove('is-inverted');
        }
    });
}, {
    rootMargin: "-350px 0px 0px 0px",
    threshold: 0
});

if (worksSection) {
    observer.observe(worksSection);
}

// ==========================================================================
// 現在地マーキング（肉球）の処理
// ==========================================================================
const navItems = document.querySelectorAll('.g_nav li');

if (navItems.length > 0) {
    const targetSections = Array.from(navItems).map(item => {
        const aTag = item.querySelector('a');
        if (!aTag) return null;
        const hash = aTag.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return null;
        return document.querySelector(hash);
    }).filter(section => section !== null);

    const markObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(item => item.classList.remove('is-active'));
                const currentId = entry.target.getAttribute('id');
                const activeNavItems = document.querySelectorAll(`.g_nav a[href="#${currentId}"]`);
                activeNavItems.forEach(aKey => {
                    aKey.closest('li')?.classList.add('is-active');
                });
            }
        });
    }, {
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0
    });

    targetSections.forEach(section => {
        markObserver.observe(section);
    });
}

// ==========================================================================
// スマホ用ハンバーガーメニューの開閉・リサイズ制御
// ==========================================================================
function closeMenu() {
    spNav.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-open');
    document.body.style.overflow = ''; 
}

if (hamburgerBtn && spNav) {
    hamburgerBtn.addEventListener('click', () => {
        spNav.classList.toggle('is-open');
        hamburgerBtn.classList.toggle('is-open');

        if (spNav.classList.contains('is-open')) {
            document.body.style.overflow = 'hidden'; // 背面スクロール禁止
        } else {
            document.body.style.overflow = '';
        }
    });
}

// メニュー内のリンクをクリックしたらメニューを閉じる
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// 画面幅がPCサイズ（768px以上）になったら自動的にハンバーガーメニューを閉じる
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        if (spNav.classList.contains('is-open')) {
            closeMenu();
        }
    }
});

// ==========================================================================
// トップに戻るボタンのクリックイベント
// ==========================================================================
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}



// ==========================================================================
// ギャラリーのパネル
// ==========================================================================
// 要素の取得
const galleryItems = document.querySelectorAll('.gallery-item'); // 個別のアイテムではなく、画像が入っている親枠を取得
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// 現在表示している画像のインデックス（番号）を記憶する変数
let currentIndex = 0;

//  関数：指定されたインデックスの画像とキャプションをパネルに表示する 
function showImage(index) {
  // インデックスが範囲内に収まるようにループさせる（例：最後の次を押すと最初に戻る）
  if (index >= galleryItems.length) {
    currentIndex = 0; // 最初に戻る
  } else if (index < 0) {
    currentIndex = galleryItems.length - 1; // 最後へ行く
  } else {
    currentIndex = index;
  }

  // 現在のインデックスに対応する画像要素とimgタグを取得
  const item = galleryItems[currentIndex];
  const img = item.querySelector('img');

  // パネルの内容を更新
  lightboxImg.src = img.src;
  lightboxCaption.textContent = img.alt;
}

//  ギャラリーの各写真をクリックしたとき 
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    // クリックされた画像のインデックスをセットしてパネルを開く
    showImage(index); 
    lightbox.classList.add('active');
  });
});

//  閉じるボタン（×）をクリックしたとき 
closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

//  背景の黒い部分をクリックしたとき 
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});

//  「前へ」ボタンをクリックしたとき 
prevBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // パネル全体のクリックイベントが発動するのを防ぐ
  showImage(currentIndex - 1); // 1つ前のインデックスを表示
});

//  「次へ」ボタンをクリックしたとき 
nextBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // パネル全体のクリックイベントが発動するのを防ぐ
  showImage(currentIndex + 1); // 1つ後のインデックスを表示
});

//  キーボードの左右矢印キーでも操作できるようにする 
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('active')) {
    if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  }
});