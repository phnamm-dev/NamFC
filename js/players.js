// js/players.js
const BASE_IMG_PATH = "images/players/";
const BASE_FLAG_PATH = "images/flags/";
const BASE_CLUB_PATH = "images/clubs/";

const allPlayers = [
    // Bronze Common
    { id: 101, name: "Anh Tuan", position: "ST", ovr: 39, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "bronze-anh-tuan.png", pack: "bronze" },
    { id: 102, name: "Hong Long", position: "GK", ovr: 33, nation: "argentina", club: "Manchester City", clubLogo: "man-city.png", flag: "ar.png", playerImg: "bronze-hong-long.png", pack: "bronze" },
    { id: 103, name: "Gia Phuc", position: "ST", ovr: 41, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "bronze-gia-phuc.png", pack: "bronze" },
    { id: 104, name: "Cong Khoi", position: "ST", ovr: 43, nation: "portugal", club: "Manchester United", clubLogo: "man-utd.png", flag: "pt.png", playerImg: "bronze-cong-khoi.png", pack: "bronze" },
    
    // Silver Rare
    { id: 201, name: "Van Thang", position: "ST", ovr: 67, nation: "india", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "in.png", playerImg: "silver-van-thang.png", pack: "silver" },
    { id: 202, name: "Doraemon", position: "GK", ovr: 66, nation: "japan", club: "Paris Saint-Germain", clubLogo: "psg.png", flag: "jp.png", playerImg: "silver-doraemon.png", pack: "silver" }, 
    { id: 203, name: "Bao Khang", position: "ST", ovr: 63, nation: "portugal", club: "VES School Football Club", clubLogo: "ves-sfc.png", flag: "pt.png", playerImg: "silver-bao-khang.png", pack: "silver" }, 

    // Common
    { id: 301, name: "Minh Long", position: "ST", ovr: 72, nation: "portugal", club: "THCS Le Quang Cuong", clubLogo: "thcs-lqc.png", flag: "pt.png", playerImg: "common-minh-long.png", pack: "common" }, 

    // Legend
    { id: 401, name: "Pipilabu", position: "CDM", ovr: 89, nation: "china", club: "Manchester United", clubLogo: "man-utd.png", flag: "cn.png", playerImg: "legend-pipilabu.png", pack: "legend" }, 

    // UEFA Champions League
    { id: 501, name: "Anh Tuan", position: "ST", ovr: 96, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "uefa-anh-tuan.png", pack: "uefa" },
    { id: 502, name: "Cong Khoi", position: "ST", ovr: 91, nation: "portugal", club: "Manchester United", clubLogo: "man-utd.png", flag: "pt.png", playerImg: "uefa-cong-khoi.png", pack: "uefa" },
    { id: 503, name: "Hong Long", position: "GK", ovr: 90, nation: "argentina", club: "Manchester City", clubLogo: "man-city.png", flag: "ar.png", playerImg: "uefa-hong-long.png", pack: "uefa" },
    
    // TOTY
    { id: 601, name: "Van Thang", position: "ST", ovr: 136, nation: "india", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "in.png", playerImg: "toty-van-thang.png", pack: "toty" },
    { id: 602, name: "Anh Tuan", position: "ST", ovr: 136, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "toty-anh-tuan.png", pack: "toty" },
    { id: 603, name: "Doraemon", position: "GK", ovr: 130, nation: "japan", club: "Paris Saint-Germain", clubLogo: "psg.png", flag: "jp.png", playerImg: "toty-doraemon.png", pack: "toty" }, 
    { id: 604, name: "Bao Khang", position: "ST", ovr: 139, nation: "portugal", club: "VES School Football Club", clubLogo: "ves-sfc.png", flag: "pt.png", playerImg: "toty-bao-khang.png", pack: "toty" }, 

    // TITANS
    { id: 701, name: "Anh Tuan", position: "ST", ovr: 149, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "titans-anh-tuan.png", pack: "titans" },
    { id: 702, name: "Hong Long", position: "GK", ovr: 140, nation: "argentina", club: "Manchester City", clubLogo: "man-city.png", flag: "ar.png", playerImg: "titans-hong-long.png", pack: "titans" },
    { id: 703, name: "Peter Griffin", position: "CB", ovr: 141, nation: "mexico", club: "Mexico", clubLogo: "mexico.png", flag: "mx.png", playerImg: "titans-peter-griffin.png", pack: "titans" },
    { id: 704, name: "Glenn Quagmire", position: "LM", ovr: 142, nation: "usa", club: "Emblem of the United States Navy", clubLogo: "us-navy.png", flag: "us.png", playerImg: "titans-glenn-quagmire.png", pack: "titans" },
    { id: 705, name: "Joe Swanson", position: "GK", ovr: 143, nation: "usa", club: "Chelsea", clubLogo: "chelsea.png", flag: "us.png", playerImg: "titans-joe-swanson.png", pack: "titans" },
    { id: 706, name: "Cong Khoi", position: "ST", ovr: 148, nation: "portugal", club: "Manchester United", clubLogo: "man-utd.png", flag: "pt.png", playerImg: "titans-cong-khoi.png", pack: "titans" },

    // ULTIMATE
    { id: 801, name: "Anh Tuan", position: "ST", ovr: 149, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "titans-anh-tuan.png", pack: "ultimate" },
    { id: 802, name: "Bao Khang", position: "ST", ovr: 139, nation: "portugal", club: "VES School Football Club", clubLogo: "ves-sfc.png", flag: "pt.png", playerImg: "toty-bao-khang.png", pack: "ultimate" }, 
    { id: 803, name: "Anh Tuan", position: "ST", ovr: 96, nation: "belgium", club: "Real Madrid", clubLogo: "real-madrid.png", flag: "be.png", playerImg: "uefa-anh-tuan.png", pack: "ultimate" },
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

// Chuẩn hóa tất cả cầu thủ
function normalizePlayer(p) {
    return {
        ...p,
        positionName: getPositionName(p.position),
        positionCode: p.position,
        avatarUrl: BASE_IMG_PATH + p.playerImg,
        flagUrl: BASE_FLAG_PATH + p.flag,
        clubLogoUrl: BASE_CLUB_PATH + p.clubLogo
    };
}
const normalizedPlayers = allPlayers.map(p => normalizePlayer(p));

// Lọc cầu thủ theo loại pack (so sánh chính xác)
function getPlayersByPackType(packType) {
    return normalizedPlayers.filter(p => p.pack.toLowerCase() === packType.toLowerCase());
}

/**
 * Random cầu thủ với xác suất tỉ lệ nghịch với OVR.
 * Công thức: weight = max(1, 200 - ovr)
 * - OVR thấp (33) -> weight ~167 (rất dễ ra)
 * - OVR cao (139) -> weight ~61 (khó ra hơn)
 * Đảm bảo ngay cả OVR > 100 cũng có sự phân biệt rõ ràng.
 */
function getRandomPlayerByPack(packType) {
    const pool = getPlayersByPackType(packType);
    if (pool.length === 0) return null;

    // Tìm min/max OVR trong pack này
    const ovrs = pool.map(p => p.ovr);
    const minOVR = Math.min(...ovrs);
    const maxOVR = Math.max(...ovrs);
    const range = maxOVR - minOVR || 1; // tránh chia 0 khi tất cả OVR bằng nhau

    // Phân biệt pack phế hay pack xịn
    const lowTierPacks = ["bronze", "silver", "common", "legend"];
    const isLowTier = lowTierPacks.includes(packType.toLowerCase());

    // Cài đặt độ "nhả" khác nhau
    const baseMaxWeight = isLowTier ? 80 : 120;   // pack phế = 80, pack xịn = 120
    const minWeight      = isLowTier ? 25 : 1;    // pack phế minWeight cao hơn → nhả hơn

    let totalWeight = 0;
    const weights = pool.map(p => {
        const relative = (p.ovr - minOVR) / range;           // 0 = OVR thấp nhất, 1 = OVR cao nhất
        const w = Math.max(minWeight, 
                  Math.floor(baseMaxWeight * (1 - relative)));
        
        totalWeight += w;
        return w;
    });

    // Random theo weight
    let rand = Math.random() * totalWeight;
    let current = 0;
    for (let i = 0; i < pool.length; i++) {
        current += weights[i];
        if (rand <= current) {
            return { ...pool[i] };
        }
    }
    return { ...pool[0] }; // fallback
}

// ========== QUẢN LÝ BỘ SƯU TẬP ==========
function getMyPlayers() {
    const data = localStorage.getItem("myPlayers");
    return data ? JSON.parse(data) : [];
}

function saveMyPlayers(players) {
    localStorage.setItem("myPlayers", JSON.stringify(players));
}

function addPlayerToCollection(player) {
    const players = getMyPlayers();
    if (!players.some(p => p.id === player.id)) {
        players.push(player);
        saveMyPlayers(players);
        return true;
    }
    return false;
}

function addMultiplePlayersToCollection(newPlayers) {
    const players = getMyPlayers();
    let added = 0;
    for (let p of newPlayers) {
        if (!players.some(ex => ex.id === p.id)) {
            players.push(p);
            added++;
        }
    }
    if (added > 0) saveMyPlayers(players);
    return added;
}