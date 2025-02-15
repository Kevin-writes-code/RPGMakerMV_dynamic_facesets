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
 *  You have to wait 1 frame after changing class for changes to take effect.
 * 
 *  Plugin Commands:
 *      None  
 */

(function () {
    /*
     * internal config
     */

    const parameters = PluginManager.parameters("facesets")
    const activeSwitch = Number(parameters["Enable Switch ID"] || 11);

    const basecase = "Actor1" //set basecase here; used to overwrite display in text windows
    const characterID = 1; // ID of the character to change face for
    const protagFacesets = { //populate with ID/Image Name pairs
        1: "Actor1",
        2: "Actor2",
      };

    function getDynamicFaceName(actor) {
      for (const key in protagFacesets){
          if (key == actor.currentClass().id) return protagFacesets[key];
      }
      //basecase:
      return basecase;
    }

    function preloadFaceset(actor) {
      const faceName = getDynamicFaceName(actor);
      ImageManager.loadFace(faceName);
    }

    /*
     * function overwrides 
     */
    const _facesetImageNameFunction = Game_Actor.prototype.faceName;
    Game_Actor.prototype.faceName = function() {
        if (!$gameSwitches.value(activeSwitch) || this._actorId != characterID) return _facesetImageNameFunction.call(this);
        //if actor is dynamic one:
        return getDynamicFaceName(this);
    }

    const _changeClass = Game_Actor.prototype.changeClass;
    Game_Actor.prototype.changeClass = function(ID, keepXP){
        _changeClass.call(this, ID, keepXP);
        if (!this._actorId == characterID) return;
        preloadFaceset(this);
    }

	const _windowMessageDrawFace = Window_Message.prototype.drawFace;
    Window_Message.prototype.drawFace = function(faceName, faceIndex, x, y, width, height){
        if (faceName == basecase) {
            faceName = getDynamicFaceName($gameActors.actor(characterID));
	    	setTimeout(() => {_windowMessageDrawFace.call(this, faceName, faceIndex, x, y, width, height)}, 100);
        }
        _windowMessageDrawFace.call(this, faceName, faceIndex, x, y, width, height)
    }

})();
