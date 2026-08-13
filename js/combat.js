export class CombatSystem {

    constructor(
        player,
        inventory = null,
        onEnemyKilled = null
    ) {

        this.player = player;

        this.inventory = inventory;

        this.onEnemyKilled =
            onEnemyKilled;


        this.effects = [];

        this.damageNumbers = [];

        this.combo = 0;

        this.comboTimer = 0;

        this.lastAttackTime = 0;
    }


    // =====================================
    // 普通攻击
    // =====================================

    attack(enemies) {

        const now =
            performance.now();


        // 攻击速度

        if (
            now -
            this.lastAttackTime <
            250
        ) {

            return;
        }


        this.lastAttackTime =
            now;


        let target = null;

        let closest =
            Infinity;


        // =========================
        // 找最近敌人
        // =========================

        for (
            const enemy of enemies
        ) {

            if (
                enemy.dead
            ) {

                continue;
            }


            const dx =
                enemy.x -
                this.player.x;

            const dy =
                enemy.y -
                this.player.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                closest
            ) {

                closest =
                    distance;

                target =
                    enemy;
            }
        }


        if (
            !target
        ) {

            return;
        }


        // =========================
        // 攻击范围
        // =========================

        if (
            closest > 90
        ) {

            return;
        }


        // =========================
        // 伤害
        // =========================

        let damage =
            this.player.attack +
            Math.floor(
                Math.random() * 8
            );


        // =========================
        // 暴击
        // =========================

        const critical =
            Math.random() <
            0.15;


        if (
            critical
        ) {

            damage *= 2;
        }


        target.takeDamage(
            damage
        );


        // =========================
        // Combo
        // =========================

        this.combo++;

        this.comboTimer =
            120;


        // =========================
        // Slash
        // =========================

        this.effects.push({

            type: "slash",

            x: target.x,

            y: target.y,

            life: 15,

            maxLife: 15,

            critical: critical
        });


        // =========================
        // Flash
        // =========================

        this.effects.push({

            type: "flash",

            x: target.x,

            y: target.y,

            life: 8,

            maxLife: 8
        });


        // =========================
        // 伤害数字
        // =========================

        this.damageNumbers.push({

            x: target.x,

            y: target.y - 25,

            value:
                critical
                    ? `CRIT ${damage}`
                    : `-${damage}`,

            life: 50,

            color:
                critical
                    ? "#ffd700"
                    : "#ff5c5c"
        });


        // =========================
        // 敌人死亡
        // =========================

        if (
            target.dead
        ) {

            this.handleEnemyDeath(
                target
            );
        }
    }


    // =====================================
    // 敌人死亡奖励
    // =====================================

    handleEnemyDeath(enemy) {

        // EXP

        this.player.gainExp(
            enemy.expReward
        );


        // Gold

        this.player.addGold(
            enemy.goldReward
        );


        // EXP 数字

        this.damageNumbers.push({

            x: enemy.x,

            y: enemy.y - 50,

            value:
                `+${enemy.expReward} EXP`,

            life: 80,

            color: "#7dd3fc"
        });


        // Gold 数字

        this.damageNumbers.push({

            x: enemy.x,

            y: enemy.y - 70,

            value:
                `+${enemy.goldReward} GOLD`,

            life: 80,

            color: "#ffd700"
        });


        // =========================
        // Boss 特殊掉落
        // =========================

        if (
            enemy.isBoss
        ) {

            if (
                this.onEnemyKilled
            ) {

                this.onEnemyKilled(
                    enemy
                );
            }

            return;
        }


        // =========================
        // 普通敌人掉落
        // =========================

        if (
            this.onEnemyKilled
        ) {

            this.onEnemyKilled(
                enemy
            );
        }
    }


    // =====================================
    // 更新
    // =====================================

    update() {

        // =========================
        // Combo
        // =========================

        if (
            this.comboTimer > 0
        ) {

            this.comboTimer--;

        }
        else {

            this.combo = 0;
        }


        // =========================
        // 特效
        // =========================

        for (
            let i =
                this.effects.length - 1;
            i >= 0;
            i--
        ) {

            this.effects[i].life--;


            if (
                this.effects[i].life <= 0
            ) {

                this.effects.splice(
                    i,
                    1
                );
            }
        }


        // =========================
        // 伤害数字
        // =========================

        for (
            let i =
                this.damageNumbers.length - 1;
            i >= 0;
            i--
        ) {

            const number =
                this.damageNumbers[i];


            number.y -= 0.6;

            number.life--;


            if (
                number.life <= 0
            ) {

                this.damageNumbers.splice(
                    i,
                    1
                );
            }
        }
    }


    // =====================================
    // 绘制
    // =====================================

    draw(ctx) {

        // =========================
        // 攻击特效
        // =========================

        for (
            const effect
            of this.effects
        ) {

            if (
                effect.type !== "slash" &&
                effect.type !== "flash"
            ) {

                continue;
            }


            const progress =
                1 -
                effect.life /
                effect.maxLife;


            ctx.save();


            ctx.translate(
                effect.x,
                effect.y
            );


            ctx.rotate(
                progress *
                Math.PI
            );


            ctx.strokeStyle =
                effect.critical
                    ? "#ffd700"
                    : "#8ab4ff";


            ctx.lineWidth =
                effect.critical
                    ? 8
                    : 5;


            ctx.beginPath();


            ctx.arc(
                0,
                0,
                35,
                -1.1,
                1.1
            );


            ctx.stroke();


            ctx.restore();
        }


        // =========================
        // 伤害数字
        // =========================

        ctx.textAlign =
            "center";


        for (
            const number
            of this.damageNumbers
        ) {

            ctx.globalAlpha =
                Math.min(
                    1,
                    number.life / 20
                );


            ctx.fillStyle =
                number.color;


            ctx.font =
                "bold 16px Arial";


            ctx.fillText(
                number.value,
                number.x,
                number.y
            );
        }


        ctx.globalAlpha = 1;


        // =========================
        // Combo
        // =========================

        if (
            this.combo >= 2
        ) {

            ctx.fillStyle =
                "#ffd700";

            ctx.font =
                "bold 20px Arial";

            ctx.textAlign =
                "left";


            ctx.fillText(
                `COMBO x${this.combo}`,
                20,
                120
            );
        }
    }
}
