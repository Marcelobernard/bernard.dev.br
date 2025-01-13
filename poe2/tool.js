document.getElementById('calculate').addEventListener('click', function () {
    const mapTier = parseInt(document.getElementById('map-tier').value) || 0;
    const itemRarity = parseFloat(document.getElementById('item-rarity').value) || 0;
    const mapRarity = parseFloat(document.getElementById('map-rarity').value) || 0;

    if (mapTier==0 && itemRarity==0 && mapRarity==0){
        newRate = 0;
        document.getElementById(`new-value-${position}`).textContent = `${newRate}`;
    } else {
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

    if (adjustedRarity > 320) {
        adjustedRarity = 320 + Math.pow(adjustedRarity - 320, 0.9);
    }
    if (adjustedRarity > 500) {
        adjustedRarity = 500 + Math.pow(adjustedRarity - 500, 0.7);
    }
    

    const baseRates = [
        3.547, 3.013, 2.754, 1.689, 0.625, 0.578, 0.275, 0.207, 0.055, 0.001
    ];

    baseRates.forEach((base, index) => {
        let position = index + 1;
        let newRate;
        let increasedPercent;

        if (position === 10) {
            newRate = "🪦";
            increasedPercent = "😭";
            document.getElementById(`new-value-${position}`).textContent = `${newRate}`;
            document.getElementById(`new-percent-${position}`).textContent = `${increasedPercent}`;
        } else {
            if (position === 1 || position === 2 || position === 4 || position === 6) {
                if (adjustedRarity > 120) {
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
                    let newRate1 = (base / 100 + (120 * position) / 10**6) * (100* 1.005**(120));
                    let newRate2 = (base / 100 + (adjustedRarity * position) / 10**6) * (100* 1.005**(adjustedRarity));
                    newRate = (14*newRate1 + newRate2) / 15;
                    newRate = Math.max(newRate, 0).toFixed(3);
                } else {
                    newRate = (base / 100 + (adjustedRarity * position) / 10**6) * (100* 1.005**(adjustedRarity));
                    newRate = Math.max(newRate, 0).toFixed(3);
                }
            }
            increasedPercent = ((newRate*100)/base)-100;
            increasedPercent = Math.max(increasedPercent, 0).toFixed(3);
            document.getElementById(`new-percent-${position}`).textContent = `${increasedPercent}`;
            document.getElementById(`new-value-${position}`).textContent = `${newRate}`;
        }
    });
}});