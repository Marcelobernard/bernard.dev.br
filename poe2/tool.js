document.getElementById('calculate').addEventListener('click', function () {
    const mapTier = parseInt(document.getElementById('map-tier').value) || 0;
    const itemRarity = parseFloat(document.getElementById('item-rarity').value) || 0;
    const mapRarity = parseFloat(document.getElementById('map-rarity').value) || 0;

    const totalRarity = itemRarity + mapRarity;

    let adjustedRarity = totalRarity;
    if (mapTier == 1) {
        adjustedRarity += 5;
    } else if (mapTier == 2) {
        adjustedRarity += 10;
    } else if (mapTier == 3) {
        adjustedRarity += 15;
    } else if (mapTier == 4) {
        adjustedRarity += 20;
    } else if (mapTier == 5) {
        adjustedRarity += 25;
    } else if (mapTier == 6) {
        adjustedRarity += 55;
    } else if (mapTier == 7) {
        adjustedRarity += 60;
    } else if (mapTier == 8) {
        adjustedRarity += 65;
    } else if (mapTier == 9) {
        adjustedRarity += 70;
    } else if (mapTier == 10) {
        adjustedRarity += 75;
    } else if (mapTier == 11) {
        adjustedRarity += 105;
    } else if (mapTier == 12) {
        adjustedRarity += 110;
    } else if (mapTier == 13) {
        adjustedRarity += 115;
    } else if (mapTier == 14) {
        adjustedRarity += 120;
    } else if (mapTier >= 15) {
        adjustedRarity += 125;
    }

    const baseRates = [
        31.246, 15.195, 3.547, 3.013, 2.754, 1.689, 0.625, 0.578, 0.275, 0.207, 0.055, 0.001
    ];

    baseRates.forEach((base, index) => {
        let position = index + 1;
        let newRate;

        if (position === 12) {
            newRate = "🪦";
            document.getElementById(`new-value-${position}`).textContent = `${newRate}`;
        } else {
            if (position === 3 || position === 4 || position === 6 || position === 8) {
                if (adjustedRarity > 120) {
                    let adjustedRarity2 = adjustedRarity - 120;
                    let newRate1 = (base / 100 + (120 * position) / 10**6) * (100 * 1.005**(120));
                    let newRate2 = (base / 100 + (adjustedRarity * position) / 10**6) * (100 * 1.005**(adjustedRarity));
                    newRate = (14*newRate1 + newRate2) / 15;
                    newRate = Math.max(newRate, 0).toFixed(3);
                } else {
                    newRate = (base / 100 + (adjustedRarity * position) / 10**6) * (100 * 1.005**(adjustedRarity));
                    newRate = Math.max(newRate, 0).toFixed(3);
                }
            } else {
                if (adjustedRarity > 120) {
                    let adjustedRarity2 = adjustedRarity - 200;
                    let newRate1 = (base / 100 + (120 * position) / 10**6) * 130;
                    let newRate2 = (base / 100 + (adjustedRarity * position) / 10**6) * 130;
                    newRate = (14*newRate1 + newRate2) / 15;
                    newRate = Math.max(newRate, 0).toFixed(3);
                } else {
                    newRate = (base / 100 + (adjustedRarity * position) / 10**6) * 130;
                    newRate = Math.max(newRate, 0).toFixed(3);
                }
            }
            document.getElementById(`new-value-${position}`).textContent = `${newRate}`;
        }
    });
});