import { debug } from "../constants/constants.js";
import { trafficCop } from "../router/traffic-cop.js";
import AAHandler from "../system-handlers/workflow-data.js";
import { getRequiredData } from "./getRequiredData.js";

export function systemHooks() {
    Hooks.on("swadeAction", async (SwadeTokenOrActor, SwadeItem, SwadeAction, SwadeRoll, userId) => {
        if (!SwadeRoll) { return; }
        const playtrigger = game.settings.get("autoanimations", "playtrigger");
        if ((SwadeAction === "damage" && playtrigger === "onDamage") || (SwadeAction === "formula" && playtrigger === "onAttack")) {
            const controlledTokens = canvas.tokens.controlled;
            let token;
            if (controlledTokens.length > 0) {
                token = controlledTokens.find(token => token.document.actorId === SwadeTokenOrActor.id);
            }
            if (token) { SwadeTokenOrActor = token; }
            runSwade(SwadeTokenOrActor, SwadeTokenOrActor, SwadeItem);
        }
    });
    Hooks.on("swadeConsumeItem", async (SwadeItem, charges, usage) => {
        const controlledTokens = canvas.tokens.controlled;
        let token;
        let SwadeTokenOrActor = SwadeItem.parent
        if (controlledTokens.length > 0) {
          token = controlledTokens.find(token => token.document.actorId === SwadeTokenOrActor.id);
        }
        if (token) {
          SwadeTokenOrActor = token;
        }
        runSwade(SwadeTokenOrActor, SwadeTokenOrActor, SwadeItem);
    });
    Hooks.on("createMeasuredTemplate", async (template, data, userId) => {
        if (userId !== game.user.id || !template.flags?.swade?.origin) return;
        templateAnimation(await getRequiredData({itemUuid: template.flags?.swade?.origin, templateData: template, workflow: template, isTemplate: true}))
    })
    async function get_brsw_data (data) {
        //var tokenId = data.getFlag("betterrolls-swade2", "token");
        return {token: data.token, actor: data.actor, item: data.item}
        /*
        if (tokenId) {
            var token = canvas.tokens.get(tokenId);
            var itemId = data.getFlag("betterrolls-swade2", "item_id");
            var item = token.actor.items.get(itemId);
            const actorOrToken = token
            return {actorOrToken, item}
        } else {
            var actorId = data.getFlag("betterrolls-swade2", "actor");
            var actor = game.actors.get(actorId);
            var itemId = data.getFlag("betterrolls-swade2", "item_id");
            var item = actor.items.get(itemId);
            const actorOrToken = actor
            return {actorOrToken, item}
        }
        */
    }
    Hooks.on("BRSW-RollItem", async (data, html) => {
        const {token, actor, item} = await get_brsw_data (data)
        if (item.flags?.autoanimations?.menu === "templatefx" || (item.flags?.autoanimations?.menu === "preset" && item.flags?.autoanimations?.presetType === "proToTemp")) {
            return //Return to prevent duplicate effects on placing a template.
        } else { runSwade(token, actor, item) }
    });
    Hooks.on("BRSW-BeforePreviewingTemplate", async (template, data, ev) => {
        const {token, actor, item} = await get_brsw_data (data)
        runSwade(token, actor, item)
    })
    Hooks.on("BRSW-CreateItemCardNoRoll", async (data) => {
        const {token, actor, item} = await get_brsw_data (data)
        if (item.flags?.autoanimations?.menu === "templatefx" || (item.flags?.autoanimations?.menu === "preset" && item.flags?.autoanimations?.presetType === "proToTemp")) {
            return //Return to prevent duplicate effects on placing a template.
        } else { runSwade(token, actor, item) }
    })
}

async function templateAnimation(input) {
    debug("Template placed, checking for animations")
    if (!input.item) {
        debug("No Item could be found")
        return;
    }
    const handler = await AAHandler.make(input)
    trafficCop(handler)
}
// TO-DO, CHECK SWADE
async function runSwade(token, actor, item) {
    let data = await getRequiredData({token, actor, item })
    if (!data.item) { return; }
    const handler = await AAHandler.make(data)
    trafficCop(handler);
}