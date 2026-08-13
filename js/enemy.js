export class Enemy {

    constructor(
        x,
        y,
        type = "goblin"
    ) {

        this.x = x;
        this.y = y;

        this.type = type;


        // =========================
        // 默认属性
        // =========================

        this.name = "Enemy";

        this.color = "#ffffff";

        this.maxHp = 50;

        this.hp = this.maxHp;

        this.attack = 10;

        this.speed = 1;

        this.expReward = 20;

        this.goldReward = 10;

        this.radius = 18;


        // =========================
        // Goblin
        // =========================

        if (
            type === "goblin"
        ) {

            this.name = "Goblin";

            this.color = "#63d471";

            this.maxHp = 60;

            this.hp = 60;

            this.attack = 10;

            this.speed = 1.2;

            this.expReward = 30;

            this.goldReward = 15;
        }


        // =========================
        // Wolf
        // =========================

        else if (
            type === "wolf"
        ) {

            this.name = "Wolf";

            this.color = "#a8b0bd";

            this.maxHp = 80;

            this.hp = 80;

            this.attack = 15;

            this.speed = 1.8;

            this.expReward = 45;

            this.goldReward = 22;
        }


        // =========================
        // Orc
        // =========================

        else if (
            type === "orc"
        ) {

            this.name = "Orc";

            this.color = "#d47b4a";

            this.maxHp = 140;

            this.hp = 140;

            this.attack = 22;

            this.speed = 0.8;

            this.expReward = 80;

            this.goldReward = 40;
        }


        // =========================
        // Boss
        // =========================

        else if (
            type === "boss"
        ) {

            this.name =
                "Shadow Lord";

            this.color =
                "#8b5cf6";

            this.maxHp =
                500;

            this.hp =
                500;

            this.attack =
                30;

            this.speed =
                0.6;

            this.expReward =
                300;

            this.goldReward =
                200;

            this.radius =
                30;
        }


        // =========================
        // 状态
        // =========================

        this.attackCooldown = 0;

        this.pounceCooldown = 0;

        this.pouncing = false;

        this.hitFlash = 0;

        this.dead = false;

        this.isBoss =
            type === "boss";

        this.bossSkillCooldown =
            180;
    }


    // =====================================
    // AI
    // =====================================

    update(player) {

        if (
            this.dead
        ) {

            return;
        }


        if (
            !player
        ) {

            return;
        }


        const dx =
            player.x -
            this.x;

        const dy =
            player.y -
            this.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // =========================
        // 侦测范围
        // =========================

        let detectRange =
            350;


        if (
            this.type === "wolf"
        ) {

            detectRange = 500;
        }


        if (
            this.type === "orc"
        ) {

            detectRange = 300;
        }


        if (
            this.isBoss
        ) {

            detectRange = 700;
        }


        if (
            distance >
            detectRange
        ) {

            this.updateCooldowns();

            return;
        }


        // =========================
        // Boss 技能
        // =========================

        if (
            this.isBoss &&
            distance > 60 &&
            distance < 280 &&
            this.bossSkillCooldown <= 0
        ) {

            this.pouncing = true;

            this.bossSkillCooldown =
                240;
        }


        // =========================
        // Wolf 扑击
        // =========================

        if (
            this.type === "wolf" &&
            distance > 45 &&
            distance < 180 &&
            this.pounceCooldown <= 0
        ) {

            this.pouncing = true;

            this.pounceCooldown =
                180;
        }


        // =========================
        // 追踪
        // =========================

        if (
            distance > 45
        ) {

            let moveSpeed =
                this.speed;


            if (
                this.pouncing
            ) {

                moveSpeed =
                    this.speed * 3.5;
            }


            if (
                distance > 0
            ) {

                this.x +=
                    (dx / distance) *
                    moveSpeed;

                this.y +=
                    (dy / distance) *
                    moveSpeed;
            }


            // 扑击命中

            if (
                this.pouncing &&
                distance < 60
            ) {

                const damage =
                    this.isBoss
                        ? this.attack + 15
                        : this.attack + 10;


                player.takeDamage(
                    damage
                );


                this.pouncing =
                    false;
            }
        }


        // =========================
        // 普通攻击
        // =========================

        if (
            distance <= 45 &&
            this.attackCooldown <= 0
        ) {

            player.takeDamage(
                this.attack
            );

            this.attackCooldown =
                this.isBoss
                    ? 45
                    : 60;
        }


        this.updateCooldowns();
    }


    // =====================================
    // 更新冷却
    // =====================================

    updateCooldowns() {

        if (
            this.attackCooldown > 0
        ) {

            this.attackCooldown--;
        }


        if (
            this.pounceCooldown > 0
        ) {

            this.pounceCooldown--;
        }


        if (
            this.bossSkillCooldown > 0
        ) {

            this.bossSkillCooldown--;
        }


        if (
            this.hitFlash > 0
        ) {

            this.hitFlash--;
        }
    }


    // =====================================
    // 受到伤害
    // =====================================

    takeDamage(amount) {

        if (
            this.dead
        ) {

            return;
        }


        this.hp -= amount;

        this.hitFlash = 8;


        if (
            this.hp <= 0
        ) {

            this.hp = 0;

            this.dead = true;

            this.pouncing = false;
        }
    }


    // =====================================
    // 绘制
    // =====================================

    draw(ctx) {

        if (
            this.dead
        ) {

            return;
        }


        // =========================
        // Boss 光环
        // =========================

        if (
            this.isBoss
        ) {

            ctx.save();

            ctx.globalAlpha = 0.25;

            ctx.fillStyle =
                "#8b5cf6";

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.radius + 12,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.restore();
        }


        // =========================
        // 阴影
        // =========================

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";

        ctx.beginPath();

        ctx.ellipse(
            this.x,
            this.y + 18,
            this.radius + 2,
            8,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =========================
        // 身体
        // =========================

        ctx.fillStyle =
            this.hitFlash > 0
                ? "#ffffff"
                : this.color;


        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =========================
        // Boss 外圈
        // =========================

        if (
            this.isBoss
        ) {

            ctx.strokeStyle =
                "#c084fc";

            ctx.lineWidth = 4;

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.radius + 5,
                0,
                Math.PI * 2
            );

            ctx.stroke();
        }


        // =========================
        // 眼睛
        // =========================

        ctx.fillStyle =
            this.isBoss
                ? "#ff3030"
                : "#111";


        ctx.beginPath();

        ctx.arc(
            this.x - 6,
            this.y - 4,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.beginPath();

        ctx.arc(
            this.x + 6,
            this.y - 4,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =========================
        // HP
        // =========================

        const width =
            this.isBoss
                ? 100
                : 45;

        const height =
            this.isBoss
                ? 8
                : 6;


        const barY =
            this.isBoss
                ? this.y - 48
                : this.y - 34;


        ctx.fillStyle =
            "#270909";

        ctx.fillRect(
            this.x -
                width / 2,
            barY,
            width,
            height
        );


        ctx.fillStyle =
            this.isBoss
                ? "#a855f7"
                : "#e53935";


        ctx.fillRect(
            this.x -
                width / 2,
            barY,
            width *
                (
                    this.hp /
                    this.maxHp
                ),
            height
        );


        // =========================
        // 名字
        // =========================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            this.isBoss
                ? "bold 14px Arial"
                : "12px Arial";

        ctx.textAlign =
            "center";


        ctx.fillText(
            this.name,
            this.x,
            barY - 7
        );
    }
}
