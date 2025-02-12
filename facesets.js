//=============================================================================
// facesets.js
// 
// (c) 2025 Kevin Kummerer
//=============================================================================


/*:
 * @plugindesc faceset change for transformations for game
 * @author Kevin Kummerer
 * 
 * @param Enable Switch ID
 * @desc On if Switch with ID is on
 * @default 11
 * 
 * @help
 *  Plugin Commands:
 *      None  
 */

(function () {
    /*
     * internal config
     */

    const parameters = PluginManager.parameters("facesets")
    const activeSwitch = Number(parameters["Enable Switch ID"] || 11);

    const basecase = "basecase" //set basecase here
    const characterID = 2; // ID of the character to change face for
    const protagFacesets = { //populate with ID/Image Name pairs
        0: "example image",
        1: "example 2",
      };

      let currentFaceset;

      function getDynamicFaceName() {
        for (const key in protagFacesets){
            if ($gameSwitches.value(key)) return protagFacesets[key];
        }
        //basecase:
        return basecase;
      }

      function preloadFaceset() {
        const faceName = getDynamicFaceName();
        ImageManager.loadFace(faceName);
      }

    /*
     * function overwrides 
     */
    
    const _facesetImageNameFunction = Game_Actor.prototype.faceName;
    Game_Actor.prototype.faceName = function() {
        if (!$gameSwitches.value(activeSwitch) || this._actorId != characterID) return _facesetImageNameFunction.call(this);

        //if actor is dynamic one:
        return getDynamicFaceName();
    }

    const _windowMessageDrawFace = Window_Message.prototype.drawFace;
    Window_Message.prototype.drawFace = function(faceName, faceIndex, x, y, width, height){
        if (faceName == basecase) {
            faceName = getDynamicFaceName();
        }
        _windowMessageDrawFace.call(this, faceName, faceIndex, x, y, width, height)
    }

    const _onSwitchChanged = Game_Switches.prototype.onChange;
    Game_Switches.prototype.onChange = function() {
        _onSwitchChanged.call(this);
        preloadFaceset();
    }


})();