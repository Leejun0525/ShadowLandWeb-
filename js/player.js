export class Player {

    constructor(x, y) {

        // =========================
        // 位置
        // =========================

        this.x = x;
        this.y = y;

        this.width = 32;
        this.height = 32;

        this.speed = 4;


        // =========================
        // 等级
        // =========================

        this.level = 1;

        this.exp = 0;

        this.expToNext = 100;


        // =========================
        // HP / Mana
        // =========================

        this.maxHp = 100;
        this.hp = 100;

        this.maxMana = 50;
        this.mana = 50;


        // =========================
        // 属性
        // =========================

        this.attack = 20;

        this.defense = 5;

        this.gold = 0;


        // =========================
        // 战斗状态
        // =========================

        this.attackCooldown = 0;

        this.invincible = 0;

        this.facing = "down";
    }


    // =====================================
    // 玩家更新
    // =====================================

    update(keys, canvas) {

        let dx = 0;
        let dy = 0;


        // =========================
        // 移动
        // =========================

        if (
            keys["w"] ||
            keys["arrowup"]
        ) {

            dy -= 1;

            this.facing = "up";
        }


        if (
            keys["s"] ||
            keys["arrowdown"]
        ) {

            dy += 1;

            this.facing = "down";
        }


        if (
            keys["a"] ||
            keys["arrowleft"]
        ) {

            dx -= 1;

            this.facing = "left";
        }


        if (
            keys["d"] ||
            keys["arrowright"]
        ) {

            dx += 1;

            this.facing = "right";
        }


        // =========================
        // 防止斜向速度变快
        // =========================

        if (
            dx !== 0 ||
            dy !== 0
        ) {

            const length =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            dx /= length;
            dy /= length;


            this.x +=
                dx * this.speed;

            this.y +=
                dy * this.speed;
        }


        // =========================
        // 地图边界
        // =========================

        this.x = Math.max(
            this.width / 2,
            Math.min(
                canvas.width -
                this.width / 2,
                this.x
            )
        );


        this.y = Math.max(
            this.height / 2,
            Math.min(
                canvas.height -
                this.height / 2,
                this.y
            )
        );


        // =========================
        // 攻击冷却
        // =========================

        if (
            this.attackCooldown > 0
        ) {

            this.attackCooldown--;
        }


        // =========================
        // 无敌时间
        // =========================

        if (
            this.invincible > 0
        ) {

            this.invincible--;
        }
    }


    // =====================================
    // 是否可以攻击
    // =====================================

    canAttack() {

        return (
            this.attackCooldown <= 0
        );
    }


    // =====================================
    // 攻击敌人
    // =====================================

    attackEnemy(enemy) {

        if (
            !this.canAttack()
        ) {

            return null;
        }


        if (
            !enemy ||
            enemy.dead
        ) {

            return null;
        }


        this.attackCooldown = 20;


        const damage =
            this.attack +
            Math.floor(
                Math.random() * 8
            );


        enemy.takeDamage(
            damage
        );


        return damage;
    }


    // =====================================
    // 玩家受到伤害
    // =====================================

    takeDamage(amount) {

        if (
            this.invincible > 0
        ) {

            return 0;
        }


        const damage =
            Math.max(
                1,
                amount -
                this.defense
            );


        this.hp -= damage;


        this.invincible = 30;


        if (
            this.hp < 0
        ) {

            this.hp = 0;
        }


        return damage;
    }


    // =====================================
    // 获得经验
    // =====================================

    gainExp(amount) {

        if (
            amount <= 0
        ) {

            return;
        }


        this.exp += amount;


        while (
            this.exp >=
            this.expToNext
        ) {

            this.exp -=
                this.expToNext;

            this.levelUp();
        }
    }


    // =====================================
    // 升级
    // =====================================

    levelUp() {

        this.level++;


        this.expToNext =
            Math.floor(
                this.expToNext *
                1.35
            );


        this.maxHp += 25;

        this.maxMana += 10;

        this.attack += 6;

        this.defense += 3;


        // 完全恢复

        this.hp =
            this.maxHp;

        this.mana =
            this.maxMana;


        console.log(
            "LEVEL UP!",
            this.level
        );
    }


    // =====================================
    // 获得金币
    // =====================================

    addGold(amount) {

        if (
            amount <= 0
        ) {

            return;
        }


        this.gold += amount;
    }


    // =====================================
    // 绘制玩家
    // =====================================

    draw(ctx) {

        // =========================
        // 阴影
        // =========================

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";


        ctx.beginPath();

        ctx.ellipse(
            this.x,
            this.y + 18,
            20,
            8,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =========================
        // 玩家身体
        // =========================

        ctx.fillStyle =
            this.invincible > 0 &&
            this.invincible % 6 < 3
                ? "#ffffff"
                : "#4f8cff";


        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            18,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =========================
        // 外圈
        // =========================

        ctx.strokeStyle =
            "#8ab4ff";

        ctx.lineWidth = 3;


        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            21,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        // =========================
        // HP
        // =========================

        const barWidth = 45;
        const barHeight = 6;


        ctx.fillStyle =
            "#240909";

        ctx.fillRect(
            this.x -
                barWidth / 2,
            this.y - 34,
            barWidth,
            barHeight
        );


        ctx.fillStyle =
            "#35d05f";

        ctx.fillRect(
            this.x -
                barWidth / 2,
            this.y - 34,
            barWidth *
                (
                    this.hp /
                    this.maxHp
                ),
            barHeight
        );
    }
}
