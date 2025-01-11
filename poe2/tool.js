document.getElementById('calculate').addEventListener('click', function () {
    const mapTier = parseInt(document.getElementById('map-tier').value) || 0;
    const itemRarity = parseFloat(document.getElementById('item-rarity').value) || 0;
    const mapRarity = parseFloat(document.getElementById('map-rarity').value) || 0;

    // Soma do Rarity total
    const totalRarity = itemRarity + mapRarity;

    // Ajustar o Rarity total baseado no Map Tier
    let adjustedRarity = totalRarity;
    if (mapTier >= 1 && mapTier <= 5) {
        adjustedRarity += 50; // Map Tier 1-5: +50
    } else if (mapTier >= 6 && mapTier <= 10) {
        adjustedRarity += 100; // Map Tier 6-10: +100
    } else if (mapTier >= 11) {
        adjustedRarity += 150; // Map Tier 11+: +150
    }

    // Base drop rates
    const baseRates = [
        31.246,  // Orb of Augmentation
        15.195,  // Orb of Transmutation
        3.547,   // Exalted
        3.013,   // Regal Orb
        2.754,   // Arcanist/Armourer/Blacksmith
        1.689,   // Chaos Orb
        0.625,   // Vaal Orb
        0.578,   // Orb of Alchemy
        0.275,   // Gemcutter's Prism
        0.207,   // Glassblower's Bauble
        0.055,   // Divine Orb
        0.001    // Mirror of Kalandra
    ];

    // Atualizar os drop rates
    baseRates.forEach((base, index) => {
        let position = index + 1; // Posição de 1 a 12
        let newRate;

        if (position === 12) {
            newRate = "🪦";
            document.getElementById(`new-value-${position}`).textContent = `${newRate}`;
        } else {
            // Aplicando a fórmula fdr = (base/100 + (r * p)/10^6) * 100
            if (position === 3 || position === 4 || position === 6 || position === 8) {
                if (adjustedRarity > 120) {
                    let adjustedRarity2 = adjustedRarity - 120;
                    let newRate1 = (base / 100 + (120 * position) / 10**6) * (100 * 1.005**(adjustedRarity));
                    let newRate2 = (base / 100 + (adjustedRarity * position) / 10**6) * (100 * 1.005**(adjustedRarity));
                    newRate = (newRate1 + newRate2) / 2;
                    newRate = Math.max(newRate, 0).toFixed(3);
                } else {
                    newRate = (base / 100 + (adjustedRarity * position) / 10**6) * (100 * 1.005**(adjustedRarity));
                    newRate = Math.max(newRate, 0).toFixed(3);
                }
            } else {
                if (adjustedRarity > 120) {
                    let adjustedRarity2 = adjustedRarity - 200;
                    let newRate1 = (base / 100 + (120 * position) / 10**6) * 100;
                    let newRate2 = (base / 100 + (adjustedRarity * position) / 10**6) * 100;
                    newRate = (newRate1 + newRate2) / 2;
                    newRate = Math.max(newRate, 0).toFixed(3);
                } else {
                    newRate = (base / 100 + (adjustedRarity * position) / 10**6) * 100;
                    newRate = Math.max(newRate, 0).toFixed(3);
                }
            }
            document.getElementById(`new-value-${position}`).textContent = `${newRate}`;
        }
    });
});
