export class Inventory {

    constructor(maxSlots = 12) {

        this.maxSlots = maxSlots;

        this.items = [];
    }


    // =====================================
    // 添加物品
    // =====================================

    addItem(item) {

        if (
            !item
        ) {

            return false;
        }


        if (
            this.items.length >=
            this.maxSlots
        ) {

            console.log(
                "Inventory Full!"
            );

            return false;
        }


        this.items.push(item);


        console.log(
            "获得物品:",
            item.getDescription()
        );


        return true;
    }


    // =====================================
    // 删除
    // =====================================

    removeItem(index) {

        if (
            index < 0 ||
            index >= this.items.length
        ) {

            return null;
        }


        return this.items.splice(
            index,
            1
        )[0];
    }


    // =====================================
    // 获取
    // =====================================

    getItem(index) {

        if (
            index < 0 ||
            index >= this.items.length
        ) {

            return null;
        }


        return this.items[index];
    }


    // =====================================
    // 是否满
    // =====================================

    isFull() {

        return (
            this.items.length >=
            this.maxSlots
        );
    }


    // =====================================
    // 清空
    // =====================================

    clear() {

        this.items = [];
    }


    // =====================================
    // 绘制背包
    // =====================================

    draw(ctx) {

        const x = 20;
        const y = 180;

        const slotSize = 50;
        const gap = 8;


        // =========================
        // 背景
        // =========================

        ctx.fillStyle =
            "rgba(0,0,0,0.65)";

        ctx.fillRect(
            x - 10,
            y - 35,
            230,
            120
        );


        // =========================
        // 标题
        // =========================

        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 16px Arial";

        ctx.textAlign =
            "left";

        ctx.fillText(
            "INVENTORY",
            x,
            y - 10
        );


        // =========================
        // 格子
        // =========================

        for (
            let i = 0;
            i < this.maxSlots;
            i++
        ) {

            const col =
                i % 4;

            const row =
                Math.floor(
                    i / 4
                );


            const slotX =
                x +
                col *
                (slotSize + gap);

            const slotY =
                y +
                row *
                (slotSize + gap);


            ctx.fillStyle =
                "#202633";

            ctx.fillRect(
                slotX,
                slotY,
                slotSize,
                slotSize
            );


            ctx.strokeStyle =
                "#596273";

            ctx.strokeRect(
                slotX,
                slotY,
                slotSize,
                slotSize
            );


            const item =
                this.items[i];


            if (
                !item
            ) {

                continue;
            }


            // 物品颜色

            ctx.fillStyle =
                item.getColor();


            ctx.font =
                "bold 11px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(
                item.name.substring(
                    0,
                    7
                ),
                slotX +
                    slotSize / 2,
                slotY + 28
            );
        }
    }
}
