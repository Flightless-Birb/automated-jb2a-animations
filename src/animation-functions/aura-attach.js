import { buildFile } from "./file-builder/build-filepath.js";
import { aaDebugger } from "../constants/constants.js";
import { AAanimationData } from "../aa-classes/animation-data.js";

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export async function auras(handler, animationData) {

    //const gridSize = canvas.grid.size
    const data = animationData.primary;
    
    if (data.isAuto) {
        data.size = data.scale * 2;
    } else {
        data.size = data.auraRadius * 2;
    }

    const easeArray = ['easeInOutCubic', 'easeInOutQuart', 'easeInQuad', 'easeInOutQuad', 'easeInCirc']

    const sourceToken = handler.sourceToken;
    const aura = await buildFile(true, data.animation, "static", data.variant, data.color, data.customPath);

    if (handler.debug) { aaDebugger("Aura Animation Start", animationData, aura) }
    console.log(data)
    if (handler.allTargets.length === 0 || data.ignoreTargets) {
        selfAura()
    } else {
        targetAura();
    }


    async function selfAura() {
        const randomEase = easeArray[Math.floor(Math.random() * easeArray.length)]
        let checkAnim = Sequencer.EffectManager.getEffects({ object: sourceToken, name: `${sourceToken.name}` }).length > 0
        let playPersist = !checkAnim ? true : false;
        new Sequence()
            .sound()
                .file(data.itemAudio.file, true)
                .volume(data.itemAudio.volume)
                .delay(data.itemAudio.delay)
                .playIf(data.playSound)
            .effect()
                //.atLocation(sourceToken)
                .persist()
                .origin(handler.item.uuid)
                .size(data.size, { gridUnits: true })
                .belowTokens(data.below)
                .file(aura.file)
                .playIf(playPersist)
                .attachTo(sourceToken)
                .name(sourceToken.name)
                .opacity(data.opacity)
                .animateProperty("sprite", "width", {from: 0, to: data.size, duration: 2500, ease: randomEase})
                .animateProperty("sprite", "height", {from: 0, to: data.size, duration: 2500, ease: randomEase})
                .animateProperty("sprite", "alpha", {from: 0, to: 1, duration: 2500})
                //.fadeIn(250)
                .fadeOut(500)
                //.animateProperty("sprite", "rotation", {from: 0, to: 360, duration: 2500, ease: randomEase})
            .play()
        AAanimationData.howToDelete("sequencerground")
    }

    async function targetAura() {
        let targets = handler.allTargets;
        let arrayLength = targets.length;
        for (var i = 0; i < arrayLength; i++) {

            let target = targets[i];
            let randomEase = easeArray[Math.floor(Math.random() * easeArray.length)]

            let checkAnim = Sequencer.EffectManager.getEffects({ object: target, name: `${target.name}-${handler.itemName}` }).length > 0
            let playPersist = !checkAnim ? true : false;

            new Sequence()
                .sound()
                    .file(data.itemAudio.file, true)
                    .volume(data.itemAudio.volume)
                    .delay(data.itemAudio.delay)
                    .playIf(() => {
                        return data.itemAudio.enable && data.itemAudio.file;
                    })
                .effect()
                    //.atLocation(target)
                    .attachTo(target)
                    .persist()
                    .origin(handler.item.uuid)
                    .name(`${target.name}-${handler.itemName}`)
                    .size(data.size, { gridUnits: true })
                    .playIf(playPersist)
                    .belowTokens(data.below)
                    .file(aura.file)
                    .animateProperty("sprite", "width", {from: 0, to: data.size, duration: 2500, ease: randomEase, gridUnits: true})
                    .animateProperty("sprite", "height", {from: 0, to: data.size, duration: 2500, ease: randomEase, gridUnits: true})
                    .animateProperty("sprite", "alpha", {from: 0, to: data.opacity, duration: 2500})
                    .fadeIn(250)
                    .fadeOut(500)    
                    //.animateProperty("sprite", "rotation", {from: 0, to: 360, duration: 2500, ease: randomEase})
                .play()
        }
        AAanimationData.howToDelete("sequencerground")
    }


}