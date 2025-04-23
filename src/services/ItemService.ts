import { gameState } from "../core/GameState";

export class ItemService {

    getPanelPosition(imageKey: string, leftOrRight: string = "left"): {x: number, y: number} {
        let position = {x: 0, y: 0};

        if (imageKey === "item_helmet") {
            position = {x: 300, y: 150};
        }else
        if (imageKey === "item_armor") {
            position = {x: 300, y: 300};
        }else
        if (imageKey === "item_boots") {
            position = {x: 300, y: 450};
        }else
        if (imageKey === "item_gloves") {
            if (leftOrRight === "left") {
                position = {x: 150, y: 400};
            } else {
                position = {x: 450, y: 400};
            }
        }else
        if (imageKey === "item_shield") {
            position = {x: 450, y: 250};
        }else
        if (imageKey === "item_sword") {
            position = {x: 150, y: 250};
        }

        return position;
    }

    getCost(imageKey: string): {movePoints: number, coins: number} {
        let cost = {movePoints: 0, coins: 0};

        if (imageKey === "item_helmet") {
            cost = {movePoints: 5, coins: 50};
        }else
        if (imageKey === "item_armor") {
            cost = {movePoints: 10, coins: 100};
        }else
        if (imageKey === "item_boots") {
            cost = {movePoints: 3, coins: 30};
        }else
        if (imageKey === "item_gloves") {
            cost = {movePoints: 3, coins: 10};

        }else
        if (imageKey === "item_shield") {
            cost = {movePoints: 5, coins: 50};
        }else
        if (imageKey === "item_sword") {
            cost = {movePoints: 5, coins: 50};
        }

        return cost;
    }

    itemAlreadyExists(imageKey: string): boolean {
        for (let item of gameState.items) {
            if (item === imageKey) {
                return true;
            }
        }

        return false;
    }

    itemCanBeCrafted(imageKey: string): boolean {
        if (gameState.todayWorkshopAlreadyUsed) { return false; }
        if (this.itemAlreadyExists(imageKey)) { return false; }

        let {movePoints, coins} = this.getCost(imageKey);
        if (gameState.movePointsCurrent < movePoints) { return false; }
        if (gameState.coins < coins) { return false; }

        return true;
    }

    itemAlreadyExists_Includes(imageKey: string) {
        for (let item of gameState.items) {
            if (item.includes(imageKey)) {
                return true;
            }
        }

        return false;
    }
}