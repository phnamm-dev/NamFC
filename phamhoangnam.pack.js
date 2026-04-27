// ========== CẤU HÌNH ==========
const basePath = {
    players: "images/players/",
    flags: "images/flags/",
    clubs: "images/clubs/",
    packs: "images/packs/",
};

const PACK_MP3_URL = "audio/pack_open.mp3";
const LEGEND_PACK_MP3_URL = "audio/legends-never-die.mp3";
const CROWD_CHEER_URL = "audio/crowd-cheer.mp3";

const PACK_MUSIC_MAP = {
    and_pt: "audio/and_pt_open.mp3",
    toty: "audio/toty_open.mp3",
    uefa: "audio/uefa_open.mp3",
    legend: "audio/legend_open.mp3",
    capped_legends: "audio/capped_legends_open.mp3",
    ucl: "audio/ucl_open.mp3",
    future_stars: "audio/future_stars_open.mp3",
    songkran: "audio/songkran_open.mp3",
    tots: "audio/tots_open.mp3",

    developers_test: "audio/knockout_royalty_open.mp3",
};

const EPIC_ANIMATION_CONFIG = {
    legend: { audio: "audio/crowd-cheer.mp3", duration: 8000 },
    ucl: { audio: "audio/ucl_begin.mp3", duration: 13100 },
    future_stars: { audio: "audio/future_stars_begin.mp3", duration: 6700 },
    uefa: { audio: "audio/uefa_begin.mp3", duration: 7500 },
    and_pt: { audio: "audio/and_pt_begin.mp3", duration: 6720 },
    toty: { audio: "audio/toty_begin.mp3", duration: 8675 },
    capped_legends: { audio: "audio/capped_legends_begin.mp3", duration: 8500 },
    songkran: { audio: "audio/songkran_begin.mp3", duration: 8000 },
    tots: { audio: "audio/tots_begin.mp3", duration: 9700 },

    developers_test: {
        audio: "audio/knockout_royalty_begin.mp3",
        duration: 13100,
    },
};

const packImageMap = {
    bronze: "bronze.png",
    silver: "silver.png",
    rare: "rare.png",
    legend: "legend.png",
    premium: "premium.png",
    and_pt: "and_pt.png",
    toty: "toty.png",
    uefa: "uefa.png",
    knockout_royalty: "knockout_royalty.png",
    future_stars: "future_stars.png",
    titans: "titans.png",
    songkran: "songkran.png",
    tots: "tots.png",
};

const EPIC_PACKS = [
    "legend",
    "uefa",
    "and_pt",
    "toty",
    "capped_legends",
    "ucl",
    "future_stars",
    "developers_test",
    "songkran",
    "tots",
];

function isEpicPack(packType) {
    return EPIC_PACKS.includes(packType.toLowerCase());
}

function updatePackImage(packType) {
    const packImg = document.getElementById("pack-image");
    if (!packImg) return;
    let imageFile = packImageMap[packType] || "default_pack.png";
    packImg.src = basePath.packs + imageFile;
}

// ========== TIỀN ==========
function getMoney() {
    let money = localStorage.getItem("myMoney");
    if (money === null) {
        localStorage.setItem("myMoney", "10000");
        return 10000;
    }
    return parseInt(money);
}
function updateMoneyUI() {
    document.getElementById("moneyAmount").innerText =
        getMoney().toLocaleString();
}

// ========== DỮ LIỆU PACK ==========
let currentPackType = null;
let totalPacks = 0;
let isOpening = false;

function formatPackName(packType) {
    if (!packType) return "";

    // Map tên đặc biệt
    const nameMap = {
        ucl: "UCL DREAMCHASERS",
        uefa: "UEFA CHAMPIONS",
        and_pt: "A NATION'S STORY",
        toty: "TEAM OF THE YEAR",
        titans: "TROPHY TITANS",
        legend: "LEGENDARY",
        rare: "RARE",
        silver: "SILVER",
        bronze: "BRONZE",
        future_stars: "FUTURE STARS",
        songkran: "SONGKRAN SPLASH",
        tots: "TEAM OF THE SEASON",

        developers_test: "GÓI THỬ NGHIỆM",
    };

    // Nếu có trong map thì dùng, không thì tự format
    if (nameMap[packType.toLowerCase()]) {
        return nameMap[packType.toLowerCase()];
    }

    // Format mặc định: thay _ bằng space và viết hoa
    return packType.replace(/_/g, " ").toUpperCase();
}

function loadPackData() {
    const packType = localStorage.getItem("currentPackType");
    const quantity = localStorage.getItem("currentPackQuantity");
    if (packType && quantity) {
        currentPackType = packType;
        totalPacks = parseInt(quantity);

        // Format tên đẹp
        const displayName = formatPackName(packType);
        document.getElementById("packTypeBadge").innerHTML =
            `${displayName} x${totalPacks}`;

        updatePackImage(currentPackType);
        localStorage.removeItem("currentPackType");
        localStorage.removeItem("currentPackQuantity");
        document.getElementById("progressInfo").innerHTML =
            `Sẵn sàng mở ${totalPacks} thẻ`;
    } else {
        alert("Bạn chưa mua pack nào! Hãy vào shop để mua.");
        window.location.href = "shop.html";
    }
}

// ========== AUDIO MANAGEMENT ==========
let currentAudio = null;
let animationAudio = null;

function stopAllMusic() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (animationAudio) {
        animationAudio.pause();
        animationAudio = null;
    }
}

async function playAudio(url, volume = 0.75, loop = false) {
    stopAllMusic();
    const audio = new Audio(url);
    audio.volume = volume;
    audio.loop = loop;
    try {
        await audio.play();
        if (loop) {
            currentAudio = audio;
        } else {
            animationAudio = audio;
        }
        return audio;
    } catch (err) {
        if (err.name !== "AbortError") {
            console.warn("Audio play failed:", err.message);
        }
    }
}

function playPackMusicByType(packType) {
    const musicUrl =
        PACK_MUSIC_MAP[packType.toLowerCase()] || LEGEND_PACK_MP3_URL;
    playAudio(musicUrl, 0.78, false);
}

function playEpicAnimationAudio(packType) {
    const config = EPIC_ANIMATION_CONFIG[packType.toLowerCase()];
    if (!config) return;
    playAudio(config.audio, 0.8, false);
}

function playCrowdCheer() {
    playAudio(CROWD_CHEER_URL, 0.85, false);
}

let audioCtx = null;
function initAudio() {
    if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playWhoosh() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = 300;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc.start();
    osc.stop(now + 0.6);
}

function playEpicReveal() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const noise = audioCtx.createBufferSource();
    const buffer = audioCtx.createBuffer(
        1,
        audioCtx.sampleRate * 1.2,
        audioCtx.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    noise.connect(filter).connect(gain).connect(audioCtx.destination);
    noise.start();
}

// ========== HIỆU ỨNG VISUAL (giữ nguyên) ==========
function shakePack() {
    const pack = document.getElementById("pack-image");
    pack.classList.add("shake");
    setTimeout(() => pack.classList.remove("shake"), 300);
}

function epicShakePack() {
    const pack = document.getElementById("pack-image");
    pack.classList.add("epic-shake");
    setTimeout(() => pack.classList.remove("epic-shake"), 400);
}

function createShootingStars() {
    const stage = document.getElementById("animation-stage");
    for (let i = 0; i < 150; i++) {
        const star = document.createElement("div");
        star.className = "shooting-star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.width = Math.random() * 5 + 1 + "px";
        star.style.height = star.style.width;
        star.style.animation = `starFall ${Math.random() * 1.5 + 1.5}s linear forwards`;
        stage.appendChild(star);
        setTimeout(() => star.remove(), 8000);
    }
}

function createPackAtmosphere(packType = "default") {
    const container = document.getElementById("player-reveal");
    if (!container) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const centerX = screenW / 2;
    const centerY = screenH / 2;

    const palettes = {
        legend: ["#ffffff", "#ffedbc", "#ffd700", "#ffaa33", "#ff8800"],
        uefa: ["#ffffff", "#aee2ff", "#00f2fe", "#4facfe", "#0052d4"],
        and_pt: ["#ffffff", "#002D72", "#DA291C", "#046A38", "#FFE900"],
        toty: ["#ffffff", "#d4f1f9", "#00e5ff", "#1a237e", "#ffd700"],
        titans: ["#ffffff", "#fdfcf0", "#dec54d", "#a67c00", "#594300"],
        //knockout_royalty: ['#F5E6D3', '#F5B041', '#D4AF37', '#4A0E4E', '#1A1A1A'],
        future_stars: ["#ffffff", "#aee2ff", "#00f2fe", "#4facfe", "#0052d4"],
        ucl: ["#ffffff", "#aee2ff", "#00f2fe", "#4facfe", "#0052d4"],
        songkran: ["#ffffff", "#aee2ff", "#00f2fe", "#4facfe", "#0052d4"],
        tots: ['#FFFFFF', '#E0E7FF', '#A78BFA', '#4F46E5', '#1E3A8A'],

        default: ["#ffffff", "#ffedbc", "#ffd700", "#ffaa33", "#ff8800"],

        developers_test: [
            "#F5E6D3",
            "#F5B041",
            "#D4AF37",
            "#4A0E4E",
            "#1A1A1A",
        ],
    };
    const colors = palettes[packType.toLowerCase()] || palettes.default;

    const flash = document.createElement("div");
    flash.className = "explosion-flash";
    container.appendChild(flash);
    setTimeout(() => flash.remove(), 800);

    function spawnParticle(x, y, type = "ambient") {
        const particle = document.createElement("div");
        particle.className = "pack-particle";

        const isBurst = type === "burst";
        const size = isBurst ? Math.random() * 15 + 8 : Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        Object.assign(particle.style, {
            width: size + "px",
            height: (Math.random() > 0.5 ? size : size / 2) + "px",
            borderRadius: Math.random() > 0.6 ? "50%" : "1px",
            background: color,
            boxShadow: isBurst
                ? `0 0 ${size * 1.5}px ${color}`
                : `0 0 ${size}px ${color}`,
            left: "0px",
            top: "0px",
            transformOrigin: "center",
            opacity: "1",
        });

        container.appendChild(particle);

        let posX = x;
        let posY = y;
        let vx, vy;
        let rotation = Math.random() * 360;
        const rotSpeed = (Math.random() - 0.5) * 20;
        const lifespan = isBurst
            ? Math.random() * 1.5 + 1.5
            : Math.random() * 2 + 3;

        if (isBurst) {
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * 35 + 15;
            vx = Math.cos(angle) * force;
            vy = Math.sin(angle) * force - 5;
        } else {
            vx = (Math.random() - 0.5) * 5;
            vy = Math.random() * 3 + 2;
        }

        const gravity = 0.25;
        const friction = 0.94;
        const startTime = performance.now();

        function update(now) {
            const dt = (now - startTime) / 1000;
            const progress = dt / lifespan;

            if (progress >= 1) {
                particle.remove();
                return;
            }

            vx *= friction;
            vy *= friction;
            vy += gravity;

            posX += vx;
            posY += vy;
            rotation += rotSpeed;

            const scale = isBurst ? 1 - progress * 0.8 : 1;
            const opacity = 1 - progress;

            particle.style.transform = `translate3d(${posX}px, ${posY}px, 0) rotate(${rotation}deg) scale(${scale})`;
            particle.style.opacity = opacity;

            if (posY < screenH + 50) {
                requestAnimationFrame(update);
            } else {
                particle.remove();
            }
        }
        requestAnimationFrame(update);
    }

    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            spawnParticle(centerX, centerY, "burst");
        }, Math.random() * 100);
    }

    const ambientInterval = setInterval(() => {
        const rx = Math.random() * screenW;
        const ry = Math.random() * (screenH * 0.8);
        spawnParticle(rx, ry, "ambient");
    }, 25);

    setTimeout(() => clearInterval(ambientInterval), 15000);
}

function delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

// ========== MỞ 1 PACK (CÓ SKIP) ==========
async function openOnePackWithAnimation() {
    const player = getRandomPlayerByPack(currentPackType);
    if (!player) throw new Error("Không tìm thấy cầu thủ");

    const stage = document.getElementById("animation-stage");
    const revealDiv = document.getElementById("player-reveal");
    const packImg = document.getElementById("pack-image");

    packImg.style.display = "none";
    stage.style.display = "flex";
    revealDiv.style.display = "none";
    revealDiv.innerHTML = "";

    let stepDuration = 2000;
    if (isEpicPack(currentPackType)) {
        const config = EPIC_ANIMATION_CONFIG[currentPackType.toLowerCase()];
        if (config) {
            const total = config.duration;
            stepDuration = Math.floor((total - 600) / 3);
            playEpicAnimationAudio(currentPackType);
        } else {
            playCrowdCheer();
        }
    }

    let skipRequested = false;
    const skipHandler = () => {
        skipRequested = true;
    };
    stage.addEventListener("click", skipHandler);

    const waitWithSkip = (ms) => {
        return new Promise((resolve) => {
            if (skipRequested) return resolve("skip");
            let interval = setInterval(() => {
                if (skipRequested) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    resolve("skip");
                }
            }, 50);
            let timeout = setTimeout(() => {
                clearInterval(interval);
                resolve("timeout");
            }, ms);
        });
    };

    if (isEpicPack(currentPackType)) {
        stage.style.background =
            "radial-gradient(circle at center, #1a0f00, #000000)";
        epicShakePack();
        createShootingStars();
    } else {
        stage.style.background =
            "radial-gradient(circle at center, #0b0e1a, #000000)";
        shakePack();
    }

    document
        .querySelectorAll(".reveal-item")
        .forEach((item) => item.classList.remove("show"));

    // Bước 1: Cờ
    document.getElementById("flag-img").src = basePath.flags + player.flag;
    document.getElementById("item-flag").classList.add("show");
    playWhoosh();
    let waitResult = await waitWithSkip(stepDuration);
    if (waitResult === "skip") {
        stage.removeEventListener("click", skipHandler);
        await finalizeReveal(player, stage, revealDiv, packImg);
        return player;
    }

    document.getElementById("item-flag").classList.remove("show");
    await delay(200);
    if (skipRequested) {
        stage.removeEventListener("click", skipHandler);
        await finalizeReveal(player, stage, revealDiv, packImg);
        return player;
    }

    // Bước 2: Vị trí + OVR
    document.getElementById("pos-text").innerHTML = player.position;
    document.getElementById("item-pos").classList.add("show");
    playWhoosh();
    waitResult = await waitWithSkip(stepDuration);
    if (waitResult === "skip") {
        stage.removeEventListener("click", skipHandler);
        await finalizeReveal(player, stage, revealDiv, packImg);
        return player;
    }

    document.getElementById("item-pos").classList.remove("show");
    await delay(200);
    if (skipRequested) {
        stage.removeEventListener("click", skipHandler);
        await finalizeReveal(player, stage, revealDiv, packImg);
        return player;
    }

    // Bước 3: CLB
    document.getElementById("club-logo-img").src =
        basePath.clubs + player.clubLogo;
    document.getElementById("club-name-text").innerText = player.club;
    document.getElementById("item-club").classList.add("show");
    playWhoosh();
    waitResult = await waitWithSkip(stepDuration);
    if (waitResult === "skip") {
        stage.removeEventListener("click", skipHandler);
        await finalizeReveal(player, stage, revealDiv, packImg);
        return player;
    }

    document.getElementById("item-club").classList.remove("show");
    await delay(200);

    stage.removeEventListener("click", skipHandler);
    await finalizeReveal(player, stage, revealDiv, packImg);
    return player;
}

async function finalizeReveal(player, stage, revealDiv, packImg) {
    stage.style.display = "none";

    if (animationAudio) {
        animationAudio.pause();
        animationAudio = null;
    }

    if (isEpicPack(currentPackType)) {
        playPackMusicByType(currentPackType);
        createPackAtmosphere(currentPackType);
    }

    playEpicReveal();

    const cardDiv = document.createElement("div");
    cardDiv.className = "player-card";
    cardDiv.innerHTML = `<img src="${basePath.players + player.playerImg}" 
            onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=ffaa33&color=fff&size=400';">`;

    revealDiv.innerHTML = "";
    revealDiv.appendChild(cardDiv);
    revealDiv.style.display = "flex";

    setTimeout(() => cardDiv.classList.add("show"), 80);

    const hint = document.createElement("div");
    hint.className = "pack-hint";
    hint.innerHTML = "Nhấp vào thẻ để lưu vào kho";
    revealDiv.appendChild(hint);

    cardDiv.addEventListener(
        "click",
        () => {
            cardDiv.classList.add("store-card");
            cardDiv.addEventListener(
                "animationend",
                () => {
                    stopAllMusic();
                    revealDiv.style.display = "none";
                    window.location.href = "shop.html";
                },
                { once: true },
            );
        },
        { once: true },
    );
}

// ========== MỞ NHIỀU PACK NHANH ==========
async function openMultiplePacksFast(quantity) {
    const players = [];
    for (let i = 0; i < quantity; i++) {
        const p = getRandomPlayerByPack(currentPackType);
        if (p) players.push(p);
    }

    players.sort((a, b) => {
        if (b.ovr !== a.ovr) return b.ovr - a.ovr;
        // return a.name.localeCompare(b.name); // A-Z
        return a.id - b.id; // ID
    });
    addMultiplePlayersToCollection(players);
    playWhoosh();

    if (isEpicPack(currentPackType)) {
        playCrowdCheer();
        setTimeout(() => {
            playPackMusicByType(currentPackType);
            createPackAtmosphere(currentPackType);
        }, 1800);
        epicShakePack();
    } else {
        shakePack();
    }

    const resultGrid = document.getElementById("resultGrid");
    const gridContainer = document.getElementById("resultPlayersGrid");

    gridContainer.innerHTML = players
        .map(
            (p) => `
            <div class="mini-player-card">
                <img src="${basePath.players + p.playerImg}" 
                    onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=ffaa33&color=fff&size=100'">
                <div class="player-name">${p.name}</div>
                <div class="player-detail">${p.position} • OVR ${p.ovr}</div>
            </div>
        `,
        )
        .join("");

    resultGrid.style.display = "flex";

    return new Promise((resolve) => {
        const closeBtn = document.getElementById("closeResultBtn");
        const onClose = () => {
            closeBtn.removeEventListener("click", onClose);
            resultGrid.style.display = "none";
            stopAllMusic();
            window.location.href = "shop.html";
            resolve(players);
        };
        closeBtn.addEventListener("click", onClose);
    });
}

// ========== FULLSCREEN ==========
function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        return elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        return elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        return elem.msRequestFullscreen();
    }
    return Promise.reject("Fullscreen not supported");
}

// ========== KHỞI ĐỘNG MỞ PACK (ĐÃ THÊM LOADING & KHÓA) ==========
async function startPackOpening() {
    // Kiểm tra khóa chống spam
    if (isOpening) {
        alert("Đang mở pack, vui lòng chờ...");
        return;
    }
    if (!currentPackType || totalPacks <= 0) {
        alert("Không có pack nào để mở!");
        return;
    }

    // Hiển thị loading overlay (đã có sẵn trong HTML)
    const loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) loadingOverlay.classList.add("active");

    // Khóa ngay lập tức
    isOpening = true;
    const packImg = document.getElementById("pack-image");
    packImg.style.pointerEvents = "none";
    window.addEventListener("beforeunload", beforeUnloadHandler);

    try {
        // Yêu cầu fullscreen (có thể mất thời gian)
        await requestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch(() => {});
        }
    } catch (e) {
        console.log("Fullscreen không khả dụng:", e);
    }

    // Sau khi fullscreen hoặc không, tắt loading
    if (loadingOverlay) loadingOverlay.classList.remove("active");

    try {
        if (totalPacks === 1) {
            document.getElementById("progressInfo").innerHTML =
                `Đang mở thẻ...`;
            const player = await openOnePackWithAnimation();
            addPlayerToCollection(player);
            document.getElementById("progressInfo").innerHTML =
                `Đã mở xong 1 thẻ!`;
        } else {
            document.getElementById("progressInfo").innerHTML =
                `Đang mở ${totalPacks} thẻ...`;
            await openMultiplePacksFast(totalPacks);
            document.getElementById("progressInfo").innerHTML =
                `Đã mở xong ${totalPacks} thẻ!`;
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi: " + err.message);
    } finally {
        // Mở khóa sau khi hoàn tất (kể cả lỗi)
        isOpening = false;
        packImg.style.pointerEvents = "auto";
        window.removeEventListener("beforeunload", beforeUnloadHandler);
        stopAllMusic();

        currentPackType = null;
        totalPacks = 0;
        // Ẩn loading nếu chưa ẩn
        if (loadingOverlay) loadingOverlay.classList.remove("active");
    }
}

function beforeUnloadHandler(e) {
    if (isOpening) {
        e.preventDefault();
        e.returnValue =
            "Bạn đang mở pack chưa xong! Thoát sẽ mất dữ liệu. Bạn chắc chắn?";
        return e.returnValue;
    }
}

// ========== KHỞI ĐỘNG TRANG ==========
loadPackData();
updateMoneyUI();

document.body.addEventListener(
    "click",
    () => {
        if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    },
    { once: true },
);
