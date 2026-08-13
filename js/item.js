export class Item {

    constructor(
        name,
        type,
        rarity = "common"
    ) {

        this.name = name;

        this.type = type;

        this.rarity = rarity;


        this.attack = 0;

        this.defense = 0;

        this.hp = 0;

        this.mana = 0;


        // =========================
        // 武器
        // =========================

        if (
            type === "sword"
        ) {

            this.attack = 10;
        }


        // =========================
        // 防具
        // =========================

        else if (
            type === "armor"
        ) {

            this.defense = 5;
        }


        // =========================
        // 戒指
        // =========================

        else if (
            type === "ring"
        ) {

            this.attack = 4;

            this.defense = 2;
        }


        // =========================
        // 药水
        // =========================

        else if (
            type === "potion"
        ) {

            this.hp = 40;
        }
    }


    // =====================================
    // 稀有度颜色
    // =====================================

    getColor() {

        if (
            this.rarity === "common"
        ) {

            return "#ffffff";
        }


        if (
            this.rarity === "rare"
        ) {

            return "#4da6ff";
        }


        if (
            this.rarity === "epic"
        ) {

            return "#b56cff";
        }


        if (
            this.rarity === "legendary"
        ) {

            return "#ffd700";
        }


        return "#ffffff";
    }


    // =====================================
    // 描述
    // =====================================

    getDescription() {

        let text =
            this.name;


        if (
            this.attack > 0
        ) {

            text +=
                ` +${this.attack} ATK`;
        }


        if (
            this.defense > 0
        ) {

            text +=
                ` +${this.defense} DEF`;
        }


        if (
            this.hp > 0
        ) {

            text +=
                ` +${this.hp} HP`;
        }


        if (
            this.mana > 0
        ) {

            text +=
                ` +${this.mana} MANA`;
        }


        return text;
    }
}
