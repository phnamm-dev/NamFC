// js/players.js
const BASE_IMG_PATH = "images/players/";
const BASE_FLAG_PATH = "images/flags/";
const BASE_CLUB_PATH = "images/clubs/";

const allPlayers = [
    // Bronze
    { id: 101, name: "Gia Bao", position: "CB", ovr: 56, nation: "india", club: "THCS Lê Quang Cường", clubLogo: "thcs-lqc.png", flag: "in.png", playerImg: "bronze-gia-bao.png", pack: "bronze" },
    { id: 102, name: "Hong Long", position: "GK", ovr: 54, nation: "argentina", club: "Manchester City", clubLogo: "man-city.png", flag: "ar.png", playerImg: "bronze-hong-long.png", pack: "bronze" },
    { id: 103, name: "Hong Hai", position: "CB", ovr: 53, nation: "vietnam", club: "Juventus", clubLogo: "juventus.png", flag: "vi.png", playerImg: "bronze-hong-hai.png", pack: "bronze" },
    { id: 104, name: "Gia Phuc", position: "ST", ovr: 52, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "bronze-gia-phuc.png", pack: "bronze" },
    { id: 105, name: "Cong Khoi", position: "ST", ovr: 48, nation: "portugal", club: "Manchester United", clubLogo: "man-utd.png", flag: "pt.png", playerImg: "bronze-cong-khoi.png", pack: "bronze" },
    { id: 106, name: "Anh Tuan", position: "ST", ovr: 45, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "bronze-anh-tuan.png", pack: "bronze" },
    { id: 107, name: "Co Ay Noi Rang", position: "DOG", ovr: 44, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "dev-36.gif", pack: "bronze" },

    // Silver
    { id: 201, name: "Bao Khang", position: "ST", ovr: 69, nation: "portugal", club: "VES School Football Club", clubLogo: "ves-sfc.png", flag: "pt.png", playerImg: "silver-bao-khang.png", pack: "silver" }, 
    { id: 202, name: "Van Thang", position: "ST", ovr: 65, nation: "england", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "gb-eng.png", playerImg: "silver-van-thang.png", pack: "silver" },
    { id: 203, name: "Pipilabu", position: "CDM", ovr: 63, nation: "china", club: "Manchester United", clubLogo: "man-utd.png", flag: "cn.png", playerImg: "silver-pipilabu.png", pack: "silver" }, 

    // Rare
    { id: 301, name: "Hong Hai", position: "CAM", ovr: 79, nation: "england", club: "Arsenal", clubLogo: "arsenal.png", flag: "gb-eng.png", playerImg: "rare-hong-hai.png", pack: "rare" },
    { id: 302, name: "Masha", position: "GK", ovr: 74, nation: "russia", club: "Masha and The Bear", clubLogo: "masha&thebear.png", flag: "ru.png", playerImg: "rare-masha.png", pack: "rare" },

    // Legend
    { id: 401, name: "The Bear", position: "CAM", ovr: 89, nation: "russia", club: "Masha and The Bear", clubLogo: "masha&thebear.png", flag: "ru.png", playerImg: "legend-the-bear.png", pack: "legend" }, 

    // UEFA Champions League
    { id: 501, name: "Peppa Beach", position: "CM", ovr: 94, nation: "england", club: "Peppa Pig", clubLogo: "peppa-pig.png", flag: "gb-eng.png", playerImg: "uefa-peppa-beach.png", pack: "uefa" },
    { id: 502, name: "Cong Khoi", position: "CDM", ovr: 93, nation: "portugal", club: "Manchester United", clubLogo: "man-utd.png", flag: "pt.png", playerImg: "uefa-cong-khoi.png", pack: "uefa" },
    
    // TOTY
    { id: 601, name: "Hong Long", position: "GK", ovr: 117, nation: "argentina", club: "Manchester City", clubLogo: "man-city.png", flag: "ar.png", playerImg: "toty-hong-long.gif", pack: "toty" },
    { id: 602, name: "Anh Tuan", position: "ST", ovr: 117, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "toty-anh-tuan.gif", pack: "toty" },
    { id: 603, name: "Van Thang", position: "ST", ovr: 116, nation: "vietnam", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "vi.png", playerImg: "toty-van-thang.gif", pack: "toty" },
    { id: 604, name: "Hong Hai", position: "CB", ovr: 115, nation: "vietnam", club: "Juventus", clubLogo: "juventus.png", flag: "vi.png", playerImg: "toty-hong-hai.gif", pack: "toty" },

    // CAPPED LEGENDS
    { id: 701, name: "Cong Khoi", position: "CDM", ovr: 117, nation: "portugal", club: "Manchester United", clubLogo: "man-utd.png", flag: "pt.png", playerImg: "capped-legends-cong-khoi.gif", pack: "capped_legends" },

    // FUTURE STARS
    { id: 801, name: "Xuan Phuc", position: "GK", ovr: 117, nation: "gb-eng", club: "Barcelona", clubLogo: "barcelona.png", flag: "gb-eng.png", playerImg: "future-stars-xuan-phuc.gif", pack: "future_stars" },

    // UCL DREAMCHASERS
    { id: 901, name: "Nhu Y", position: "ST", ovr: 117, nation: "vietnam", club: "Arsenal", clubLogo: "arsenal.png", flag: "vi.png", playerImg: "ucl-nhu-y.gif", pack: "ucl" },

    // A NATION'S STORY
    
    // PORTUGAL
    { id: 1001, name: "Ronaldo", position: "ST", ovr: 117, nation: "portugal", club: "Al Nassr", clubLogo: "al-nassr.png", flag: "pt.png", playerImg: "and-pt-ronaldo.gif", pack: "and_pt" },
    { id: 1002, name: "Cong Khoi", position: "CDM", ovr: 116, nation: "portugal", club: "Manchester United", clubLogo: "man-utd.png", flag: "pt.png", playerImg: "and-pt-cong-khoi.gif", pack: "and_pt" },

    // SONGKRAN
    { id: 1101, name: "Thanh Nhan", position: "CM", ovr: 117, nation: "vietnam", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "vi.png", playerImg: "songkran-thanh-nhan.gif", pack: "songkran" },

    // TOTS
    { id: 1201, name: "Anh Tuan", position: "ST", ovr: 120, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "tots-anh-tuan.gif", pack: "tots" },
    { id: 1202, name: "Xuan Phuc", position: "GK", ovr: 119, nation: "gb-eng", club: "Barcelona", clubLogo: "barcelona.png", flag: "gb-eng.png", playerImg: "tots-xuan-phuc.gif", pack: "tots" },
    { id: 1203, name: "Thanh Nhan", position: "CM", ovr: 118, nation: "vietnam", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "vi.png", playerImg: "tots-thanh-nhan.gif", pack: "tots" },

    // DEVELOPERS TEST
    { id: -1, name: "Nam FC Online", position: "DEV", ovr: 115, nation: "vietnam", club: "Nam FC Online", clubLogo: "man-utd.png", flag: "pt.png", playerImg: "dev-115.gif", pack: "null" },

];

// Hàm ánh xạ vị trí
function getPositionName(posCode) {
    const map = {
        "GK": "Thủ môn", "LB": "Hậu vệ trái", "CB": "Trung vệ", "RB": "Hậu vệ phải",
        "LM": "Tiền vệ trái", "CM": "Tiền vệ trung tâm", "RM": "Tiền vệ phải",
        "ST": "Tiền đạo", "LW": "Tiền đạo cánh trái", "RW": "Tiền đạo cánh phải",
        "CDM": "Tiền vệ phòng ngự", "CAM": "Tiền vệ tấn công"
    };
    return map[posCode] || posCode;
}

// Chuẩn hóa cầu thủ trước khi lưu hoặc hiển thị
function normalizePlayer(p) {
    return {
        id: p.id,
        name: p.name,
        position: p.position,           // giữ code gốc (ST, GK...)
        positionName: getPositionName(p.position),
        ovr: p.ovr,
        nation: p.nation,
        club: p.club,
        clubLogo: p.clubLogo,
        flag: p.flag,
        playerImg: p.playerImg,
        pack: p.pack,
        // Đường dẫn đầy đủ
        avatarUrl: BASE_IMG_PATH + p.playerImg,
        flagUrl: BASE_FLAG_PATH + p.flag,
        clubLogoUrl: BASE_CLUB_PATH + p.clubLogo
    };
}

// Lọc theo pack
function getPlayersByPackType(packType) {
    return allPlayers
        .filter(p => p.pack.toLowerCase() === packType.toLowerCase())
        .map(normalizePlayer);
}

// Random cầu thủ theo trọng số (đã tối ưu)
function getRandomPlayerByPack(packType) {
    const pool = getPlayersByPackType(packType);
    if (pool.length === 0) return null;

    const ovrs = pool.map(p => p.ovr);
    const minOVR = Math.min(...ovrs);
    const maxOVR = Math.max(...ovrs);
    const range = maxOVR - minOVR || 1;

    const isLowTier = ["bronze", "silver", "common", "legend"].includes(packType.toLowerCase());
    const baseMaxWeight = isLowTier ? 80 : 120;
    const minWeight = isLowTier ? 25 : 1;

    let totalWeight = 0;
    const weights = pool.map(p => {
        const relative = (p.ovr - minOVR) / range;
        const w = Math.max(minWeight, Math.floor(baseMaxWeight * (1 - relative)));
        totalWeight += w;
        return w;
    });

    let rand = Math.random() * totalWeight;
    let current = 0;
    for (let i = 0; i < pool.length; i++) {
        current += weights[i];
        if (rand <= current) {
            return { ...pool[i] };
        }
    }
    return { ...pool[0] };
}

// ==================== QUẢN LÝ BỘ SƯU TẬP ====================

function getMyPlayers() {
    const data = localStorage.getItem("myPlayers");
    if (!data) return [];
    
    try {
        const players = JSON.parse(data);
        // Normalize lại khi load để đảm bảo có positionName, avatarUrl...
        return players.map(p => normalizePlayer(p));
    } catch (e) {
        console.error("Lỗi parse myPlayers:", e);
        return [];
    }
}

function saveMyPlayers(players) {
    // Chỉ lưu dữ liệu cần thiết, không lưu đường dẫn đầy đủ (tiết kiệm dung lượng)
    const cleanPlayers = players.map(p => ({
        id: p.id,
        name: p.name,
        position: p.position,
        ovr: p.ovr,
        nation: p.nation,
        club: p.club,
        clubLogo: p.clubLogo,
        flag: p.flag,
        playerImg: p.playerImg,
        pack: p.pack
    }));
    localStorage.setItem("myPlayers", JSON.stringify(cleanPlayers));
}

function addPlayerToCollection(player) {
    if (!player || !player.id) return false;

    const players = getMyPlayers();
    
    // Cho phép lưu nhiều phiên bản của cùng một cầu thủ nếu pack khác nhau
    // (ví dụ: Anh Tuan bronze vs Anh Tuan TOTY)
    const exists = players.some(p => 
        p.id === player.id && 
        p.pack === player.pack && 
        p.ovr === player.ovr
    );

    if (!exists) {
        const normalized = normalizePlayer(player);
        players.push(normalized);
        saveMyPlayers(players);
        console.log(`✅ Đã thêm cầu thủ: ${player.name} (${player.ovr}) - ${player.pack}`);
        return true;
    }
    
    console.log(`⚠️ Cầu thủ đã tồn tại: ${player.name} (${player.ovr})`);
    return false;
}

function addMultiplePlayersToCollection(newPlayers) {
    const players = getMyPlayers();
    let added = 0;

    for (let p of newPlayers) {
        const exists = players.some(ex => 
            ex.id === p.id && 
            ex.pack === p.pack && 
            ex.ovr === p.ovr
        );

        if (!exists) {
            const normalized = normalizePlayer(p);
            players.push(normalized);
            added++;
        }
    }

    if (added > 0) {
        saveMyPlayers(players);
        console.log(`✅ Đã thêm ${added} cầu thủ mới từ pack`);
    }
    return added;
}

// Export các hàm cần thiết (dùng cho debug)
window.getMyPlayers = getMyPlayers;
window.addPlayerToCollection = addPlayerToCollection;
window.addMultiplePlayersToCollection = addMultiplePlayersToCollection;