/**
 * Creates default levels3d data.
 *
 * @returns {DataLevels3D}
 */
export function levels3d() {
   return {
      type: "explosion",
      data: {
         alpha: void 0,
         arc: void 0,
         color01: "#FFFFFF",
         color02: "#FFFFFF",
         delay: void 0,
         emittersize: void 0,
         gravity: void 0,
         life: void 0,
         mass: void 0,
         rate: void 0,
         repeat: void 0,
         scale: void 0,
         speed: void 0,
         spritePath: "modules/levels-3d-preview/assets/particles/dust.png",
      },
      sound: {enable: false},
      secondary: {
         enable: false,
         data: {
            alpha: void 0,
            color01: "#FFFFFF",
            color02: "#FFFFFF",
            emittersize: void 0,
            gravity: void 0,
            life: void 0,
            mass: void 0,
            rate: void 0,
            scale: void 0,
            speed: void 0,
            spritePath: "modules/levels-3d-preview/assets/particles/dust.png",
         }
      }
   }
}

/**
 * @typedef DataLevels3D
 *
 * @property {string}   type -
 *
 * @property {object}   data -
 *
 * @property {number}   [data.alpha] -
 *
 * @property {number}   [data.arc] -
 *
 * @property {number}   [data.color0] -
 *
 * @property {number}   [data.color01] -
 *
 * @property {number}   [data.delay] -
 *
 * @property {number}   [data.emittersize] -
 *
 * @property {number}   [data.gravity] -
 *
 * @property {number}   [data.life] -
 *
 * @property {number}   [data.mass] -
 *
 * @property {number}   [data.rate] -
 *
 * @property {number}   [data.repeat] -
 *
 * @property {number}   [data.scale] -
 *
 * @property {number}   [data.speed] -
 *
 * @property {number}   [data.sprite] -
 */
