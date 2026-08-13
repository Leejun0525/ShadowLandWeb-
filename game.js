import { Player } from "./js/player.js";
import { Enemy } from "./js/enemy.js";
import { CombatSystem } from "./js/combat.js";
import { Item } from "./js/item.js";
import { Inventory } from "./js/inventory.js";


// ========================================
// ShadowLand
// ========================================

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext("2d");


canvas.width = 1000;
canvas.height = 600;


// ========================================
// 键盘
// ========================================

const keys = {};


document.addEventListener(
    "keydown",
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = true;


        if (
            event.code === "Space"
        ) {

            event.preventDefault();
        }
    }
);


document.addEventListener(
    "keyup",
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = false;
    }
);


// ========================================
// 玩家
// ========================================

const player =
    new Player(
        canvas.width / 2,
        400
    );


// ========================================
// 背包
// ========================================

const inventory =
    new Inventory(12);


// ========================================
// 游戏状态
// ========================================

let gameOver = false;

let victory = false;


// ========================================
// 敌人
// ========================================

const enemies = [

    new Enemy(
        180,
        150,
        "goblin"
    ),

    new Enemy(
        820,
        150,
        "goblin"
    ),

    new Enemy(
        260,
        500,
        "wolf"
    ),

    new Enemy(
        760,
        470,
        "wolf"
    ),

    new Enemy(
        500,
        100,
        "orc"
    ),

    // Boss

    new Enemy(
        500,
        520,
        "boss"
    )
];


// ========================================
// 金币
// ========================================

const coins = [];


// ========================================
// 已处理掉落
// ========================================

const itemDropHandled =
    new Set();


// ========================================
// 伤害数字
// ========================================

const damageNumbers = [];


// ========================================
// 特效
// ========================================

const effects = [];


// ========================================
// 技能
// ========================================

let potionCooldown = 0;

let dashCooldown = 0;

let fireballCooldown = 0;

let meteorCooldown = 0;


const fireballs = [];

const meteors = [];


// ========================================
// 战斗系统
// ========================================

const combat =
    new CombatSystem(
        player,
        inventory,
        handleEnemyKilled
    );


// ========================================
// 敌人死亡处理
// ========================================

function handleEnemyKilled(enemy) {

    if (
        itemDropHandled.has(enemy)
    ) {

        return;
    }


    itemDropHandled.add(
        enemy
    );


    // =========================
    // Boss 必掉传奇装备
    // =========================

    if (
        enemy.isBoss
    ) {

        const bossItem =
            new Item(
                "Shadow Blade",
                "sword",
                "legendary"
            );


        bossItem.attack = 35;


        inventory.addItem(
            bossItem
        );


        damageNumbers.push({

            x: enemy.x,

            y: enemy.y - 90,

            value:
                "LEGENDARY DROP!",

            life: 120,

            color: "#ffd700"
        });


        return;
    }


    // =========================
    // 普通怪物随机掉落
    // =========================

    const dropChance =
        Math.random();


    if (
        dropChance > 0.45
    ) {

        return;
    }


    let item;


    const roll =
        Math.random();


    if (
        roll < 0.4
    ) {

        item =
            new Item(
                "Iron Sword",
                "sword",
                "common"
            );
    }

    else if (
        roll < 0.7
    ) {

        item =
            new Item(
                "Leather Armor",
                "armor",
                "common"
            );
    }

    else if (
        roll < 0.9
    ) {

        item =
            new Item(
                "Magic Ring",
                "ring",
                "rare"
            );
    }

    else {

        item =
            new Item(
                "Health Potion",
                "potion",
                "rare"
            );
    }


    inventory.addItem(
        item
    );


    damageNumbers.push({

        x: enemy.x,

        y: enemy.y - 90,

        value:
            `DROP: ${item.name}`,

        life: 100,

        color:
            item.getColor()
    });
}


// ========================================
// 药水
// ========================================

function usePotion() {

    if (
        potionCooldown > 0
    ) {

        return;
    }


    if (
        player.hp >=
        player.maxHp
    ) {

        return;
    }


    const heal = 40;


    player.hp =
        Math.min(
            player.maxHp,
            player.hp + heal
        );


    potionCooldown =
        120;


    damageNumbers.push({

        x: player.x,

        y: player.y - 40,

        value:
            `+${heal} HP`,

        life: 60,

        color: "#55efc4"
    });
}


// ========================================
// E：冲刺
// ========================================

function dash() {

    if (
        dashCooldown > 0
    ) {

        return;
    }


    const distance = 110;


    if (
        player.facing === "up"
    ) {

        player.y -= distance;
    }


    if (
        player.facing === "down"
    ) {

        player.y += distance;
    }


    if (
        player.facing === "left"
    ) {

        player.x -= distance;
    }


    if (
        player.facing === "right"
    ) {

        player.x += distance;
    }


    // 边界

    player.x =
        Math.max(
            player.width / 2,
            Math.min(
                canvas.width -
                player.width / 2,
                player.x
            )
        );


    player.y =
        Math.max(
            player.height / 2,
            Math.min(
                canvas.height -
                player.height / 2,
                player.y
            )
        );


    player.invincible = 15;


    dashCooldown = 90;
}


// ========================================
// R：火球
// ========================================

function fireball() {

    if (
        fireballCooldown > 0
    ) {

        return;
    }


    fireballs.push({

        x: player.x,

        y: player.y,

        direction:
            player.facing,

        speed: 9,

        damage:
            player.attack + 25,

        life: 100
    });


    fireballCooldown = 45;
}


// ========================================
// F：陨石
// ========================================

function meteor() {

    if (
        meteorCooldown > 0
    ) {

        return;
    }


    meteors.push({

        x: player.x,

        y: player.y,

        radius: 120,

        life: 45,

        damage:
            player.attack * 4,

        hitDone: false
    });


    meteorCooldown = 300;
}


// ========================================
// 更新敌人
// ========================================

function updateEnemies() {

    for (
        const enemy of enemies
    ) {

        enemy.update(
            player
        );
    }
}


// ========================================
// 更新金币
// ========================================

function updateCoins() {

    for (
        let i = coins.length - 1;
        i >= 0;
        i--
    ) {

        const coin =
            coins[i];


        coin.life--;


        const dx =
            player.x -
            coin.x;

        const dy =
            player.y -
            coin.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // 拾取

        if (
            distance < 35
        ) {

            player.addGold(
                coin.amount
            );


            damageNumbers.push({

                x: player.x,

                y: player.y - 45,

                value:
                    `+${coin.amount} GOLD`,

                life: 60,

                color: "#ffe082"
            });


            coins.splice(
                i,
                1
            );


            continue;
        }


        // 消失

        if (
            coin.life <= 0
        ) {

            coins.splice(
                i,
                1
            );
        }
    }
}


// ========================================
// 更新旧特效
// ========================================

function updateEffects() {

    for (
        let i =
            effects.length - 1;
        i >= 0;
        i--
    ) {

        effects[i].life--;


        if (
            effects[i].life <= 0
        ) {

            effects.splice(
                i,
                1
            );
        }
    }
}


// ========================================
// 更新旧伤害数字
// ========================================

function updateDamageNumbers() {

    for (
        let i =
            damageNumbers.length - 1;
        i >= 0;
        i--
    ) {

        const number =
            damageNumbers[i];


        number.y -= 0.6;

        number.life--;


        if (
            number.life <= 0
        ) {

            damageNumbers.splice(
                i,
                1
            );
        }
    }
}


// ========================================
// 更新火球
// ========================================

function updateFireballs() {

    for (
        let i =
            fireballs.length - 1;
        i >= 0;
        i--
    ) {

        const fireball =
            fireballs[i];


        // =========================
        // 移动
        // =========================

        if (
            fireball.direction ===
            "up"
        ) {

            fireball.y -=
                fireball.speed;
        }


        if (
            fireball.direction ===
            "down"
        ) {

            fireball.y +=
                fireball.speed;
        }


        if (
            fireball.direction ===
            "left"
        ) {

            fireball.x -=
                fireball.speed;
        }


        if (
            fireball.direction ===
            "right"
        ) {

            fireball.x +=
                fireball.speed;
        }


        fireball.life--;


        // =========================
        // 碰撞
        // =========================

        let hit = false;


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
                fireball.x;

            const dy =
                enemy.y -
                fireball.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <
                enemy.radius + 10
            ) {

                enemy.takeDamage(
                    fireball.damage
                );


                damageNumbers.push({

                    x: enemy.x,

                    y: enemy.y - 30,

                    value:
                        `🔥 -${fireball.damage}`,

                    life: 50,

                    color: "#ff9f43"
                });


                if (
                    enemy.dead
                ) {

                    combat.handleEnemyDeath(
                        enemy
                    );
                }


                hit = true;

                break;
            }
        }


        if (
            hit
        ) {

            fireballs.splice(
                i,
                1
            );

            continue;
        }


        // =========================
        // 出界
        // =========================

        if (
            fireball.life <= 0 ||
            fireball.x < 0 ||
            fireball.x > canvas.width ||
            fireball.y < 0 ||
            fireball.y > canvas.height
        ) {

            fireballs.splice(
                i,
                1
            );
        }
    }
}


// ========================================
// 更新陨石
// ========================================

function updateMeteors() {

    for (
        let i =
            meteors.length - 1;
        i >= 0;
        i--
    ) {

        const meteor =
            meteors[i];


        meteor.life--;


        // =========================
        // 落地时攻击一次
        // =========================

        if (
            meteor.life === 20 &&
            !meteor.hitDone
        ) {

            meteor.hitDone = true;


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
                    meteor.x;

                const dy =
                    enemy.y -
                    meteor.y;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance <=
                    meteor.radius
                ) {

                    enemy.takeDamage(
                        meteor.damage
                    );


                    damageNumbers.push({

                        x: enemy.x,

                        y: enemy.y - 35,

                        value:
                            `☄️ -${meteor.damage}`,

                        life: 70,

                        color: "#ff3b30"
                    });


                    if (
                        enemy.dead
                    ) {

                        combat.handleEnemyDeath(
                            enemy
                        );
                    }
                }
            }
        }


        if (
            meteor.life <= 0
        ) {

            meteors.splice(
                i,
                1
            );
        }
    }
}


// ========================================
// 更新
// ========================================

function update() {

    if (
        gameOver ||
        victory
    ) {

        return;
    }


    // 玩家

    player.update(
        keys,
        canvas
    );


    // 敌人

    updateEnemies();


    // 金币

    updateCoins();


    // 特效

    updateEffects();


    // 伤害数字

    updateDamageNumbers();


    // Combat

    combat.update();


    // 火球

    updateFireballs();


    // 陨石

    updateMeteors();


    // =========================
    // Space 普攻
    // =========================

    if (
        keys[" "]
    ) {

        combat.attack(
            enemies
        );
    }


    // =========================
    // Q 药水
    // =========================

    if (
        keys["q"]
    ) {

        usePotion();

        keys["q"] = false;
    }


    // =========================
    // E 冲刺
    // =========================

    if (
        keys["e"]
    ) {

        dash();

        keys["e"] = false;
    }


    // =========================
    // R 火球
    // =========================

    if (
        keys["r"]
    ) {

        fireball();

        keys["r"] = false;
    }


    // =========================
    // F 陨石
    // =========================

    if (
        keys["f"]
    ) {

        meteor();

        keys["f"] = false;
    }


    // =========================
    // 冷却
    // =========================

    if (
        potionCooldown > 0
    ) {

        potionCooldown--;
    }


    if (
        dashCooldown > 0
    ) {

        dashCooldown--;
    }


    if (
        fireballCooldown > 0
    ) {

        fireballCooldown--;
    }


    if (
        meteorCooldown > 0
    ) {

        meteorCooldown--;
    }


    // =========================
    // 玩家死亡
    // =========================

    if (
        player.hp <= 0
    ) {

        gameOver = true;
    }


    // =========================
    // 胜利
    // =========================

    const allDead =
        enemies.every(
            enemy =>
                enemy.dead
        );


    if (
        allDead
    ) {

        victory = true;
    }
}


// ========================================
// HUD
// ========================================

function updateHUD() {

    const hp =
        document.getElementById(
            "hp"
        );


    const exp =
        document.getElementById(
            "exp"
        );


    const gold =
        document.getElementById(
            "gold"
        );


    const level =
        document.getElementById(
            "level"
        );


    const mana =
        document.getElementById(
            "mana"
        );


    if (
        hp
    ) {

        hp.textContent =
            `${player.hp} / ${player.maxHp}`;
    }


    if (
        exp
    ) {

        exp.textContent =
            `${player.exp} / ${player.expToNext}`;
    }


    if (
        gold
    ) {

        gold.textContent =
            player.gold;
    }


    if (
        level
    ) {

        level.textContent =
            player.level;
    }


    if (
        mana
    ) {

        mana.textContent =
            `${player.mana} / ${player.maxMana}`;
    }
}


// ========================================
// 地图
// ========================================

function drawWorld() {

    // =========================
    // 草地
    // =========================

    ctx.fillStyle =
        "#102819";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =========================
    // 网格
    // =========================

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < canvas.width;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();
    }


    for (
        let y = 0;
        y < canvas.height;
        y += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();
    }


    // =========================
    // 河流
    // =========================

    ctx.fillStyle =
        "rgba(25,100,170,0.45)";

    ctx.fillRect(
        0,
        270,
        canvas.width,
        65
    );


    // =========================
    // 树
    // =========================

    drawTree(100, 120);

    drawTree(180, 450);

    drawTree(850, 130);

    drawTree(760, 470);

    drawTree(900, 400);

    drawTree(70, 500);


    // =========================
    // 石头
    // =========================

    drawRock(350, 130);

    drawRock(650, 450);

    drawRock(420, 500);
}


// ========================================
// 树
// ========================================

function drawTree(x, y) {

    ctx.fillStyle =
        "rgba(0,0,0,0.3)";


    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 25,
        30,
        10,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#5b3a29";

    ctx.fillRect(
        x - 7,
        y,
        14,
        35
    );


    ctx.fillStyle =
        "#164d2c";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        30,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#26753f";


    ctx.beginPath();

    ctx.arc(
        x - 10,
        y - 8,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ========================================
// 石头
// ========================================

function drawRock(x, y) {

    ctx.fillStyle =
        "#5c6670";


    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        16,
        11,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ========================================
// 火球
// ========================================

function drawFireballs() {

    for (
        const fireball
        of fireballs
    ) {

        ctx.save();


        ctx.shadowColor =
            "#ff4500";

        ctx.shadowBlur = 20;


        ctx.fillStyle =
            "#ff6b35";


        ctx.beginPath();

        ctx.arc(
            fireball.x,
            fireball.y,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.fillStyle =
            "#ffd166";


        ctx.beginPath();

        ctx.arc(
            fireball.x,
            fireball.y,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    }
}


// ========================================
// 陨石
// ========================================

function drawMeteors() {

    for (
        const meteor
        of meteors
    ) {

        const progress =
            1 -
            meteor.life / 45;


        ctx.save();


        // =========================
        // 范围
        // =========================

        ctx.globalAlpha =
            0.35;


        ctx.strokeStyle =
            "#ff304f";

        ctx.lineWidth = 4;


        ctx.beginPath();

        ctx.arc(
            meteor.x,
            meteor.y,
            meteor.radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();


        // =========================
        // 地面警告
        // =========================

        ctx.globalAlpha =
            0.12;

        ctx.fillStyle =
            "#ff304f";


        ctx.beginPath();

        ctx.arc(
            meteor.x,
            meteor.y,
            meteor.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.globalAlpha = 1;


        // =========================
        // 陨石
        // =========================

        const meteorY =
            meteor.y -
            (1 - progress) *
            180;


        ctx.shadowColor =
            "#ff3b00";

        ctx.shadowBlur = 25;


        ctx.fillStyle =
            "#ff5722";


        ctx.beginPath();

        ctx.arc(
            meteor.x,
            meteorY,
            22,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // =========================
        // 核心
        // =========================

        ctx.shadowBlur = 10;

        ctx.fillStyle =
            "#ffd166";


        ctx.beginPath();

        ctx.arc(
            meteor.x,
            meteorY,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.restore();
    }
}


// ========================================
// 金币
// ========================================

function drawCoins() {

    for (
        const coin
        of coins
    ) {

        ctx.fillStyle =
            "#ffd700";


        ctx.beginPath();

        ctx.arc(
            coin.x,
            coin.y,
            8,
            0,
            Math.PI * 2
        );

        ctx.fill();


        ctx.strokeStyle =
            "#fff1a8";

        ctx.stroke();


        ctx.fillStyle =
            "#8a6500";

        ctx.font =
            "bold 8px Arial";

        ctx.textAlign =
            "center";


        ctx.fillText(
            "$",
            coin.x,
            coin.y + 3
        );
    }
}


// ========================================
// 敌人
// ========================================

function drawEnemies() {

    for (
        const enemy
        of enemies
    ) {

        enemy.draw(ctx);
    }
}


// ========================================
// 旧特效
// ========================================

function drawEffects() {

    for (
        const effect
        of effects
    ) {

        if (
            effect.type !==
            "slash"
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
}


// ========================================
// 旧伤害数字
// ========================================

function drawDamageNumbers() {

    ctx.textAlign =
        "center";


    for (
        const number
        of damageNumbers
    ) {

        ctx.globalAlpha =
            Math.min(
                1,
                number.life / 20
            );


        ctx.fillStyle =
            number.color ||
            "#ff5c5c";


        ctx.font =
            "bold 16px Arial";


        ctx.fillText(
            number.value,
            number.x,
            number.y
        );
    }


    ctx.globalAlpha = 1;
}


// ========================================
// 游戏结束
// ========================================

function drawGameMessage() {

    if (
        !gameOver &&
        !victory
    ) {

        return;
    }


    ctx.fillStyle =
        "rgba(0,0,0,0.7)";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 48px Arial";


    ctx.fillStyle =
        victory
            ? "#ffd700"
            : "#ff4d4d";


    ctx.fillText(
        victory
            ? "🏆 AREA CLEARED!"
            : "💀 YOU DIED",
        canvas.width / 2,
        canvas.height / 2
    );


    ctx.font =
        "18px Arial";

    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        "刷新网页重新开始",
        canvas.width / 2,
        canvas.height / 2 + 50
    );
}


// ========================================
// 绘制
// ========================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawWorld();


    drawCoins();


    drawFireballs();


    drawMeteors();


    drawEnemies();


    player.draw(ctx);


    // 战斗系统

    combat.draw(ctx);


    // 背包

    inventory.draw(ctx);


    // 旧特效

    drawEffects();


    drawDamageNumbers();


    // 游戏结束

    drawGameMessage();


    // HUD

    updateHUD();
}


// ========================================
// 游戏循环
// ========================================

function gameLoop() {

    update();

    draw();


    requestAnimationFrame(
        gameLoop
    );
}


// ========================================
// 开始
// ========================================

gameLoop();