// ==UserScript==
// @name         IsleWard - Hotkeys
// @namespace    IsleWard.Addon
// @version      1.0.0
// @description  Introduces hotkeys for certain UI buttons and options that were missing them, and provides a framework for executing functions when 1 or more keys are pressed.
// @author       Carnagion
// @match        https://play.isleward.com/
// @grant        none
// ==/UserScript==

retry(addon, () => window.jQuery, 50);

function retry(method, condition, interval)
{
    if (condition())
    {
        method();
    }
    else
    {
        let handler = function()
        {
            retry(method, condition, interval);
        }
        setTimeout(handler, interval);
    }
}

function addon()
{
    let content =
        {
            keymap: new Map(),
            presses: "",
            init: function()
            {
                window.hotkeys = this;

                document.addEventListener("keydown", this.onKeyDown.bind(this));
                document.addEventListener("keyup", this.onKeyUp.bind(this));

                this.hotkey("l", () => $(".uiMenu .btnLeaderboard")[0]?.click());
                this.hotkey("k", () => $(".uiMenu .btnReputation")[0]?.click());
                let mainMenuClick = function()
                {
                    let closeButton = $(".uiMainMenu .heading .btnClose");
                    if (closeButton.is(":hidden"))
                    {
                        $(".uiMenu .btnMainMenu")[0]?.click();
                    }
                    else
                    {
                        closeButton[0]?.click();
                    }
                };
                this.hotkey("m", mainMenuClick);
                this.hotkey("y", () => $(".uiOptions").data("ui")?.toggleQuests());
                this.hotkey("u", () => $(".uiOptions").data("ui")?.toggleEvents());
            },
            onKeyDown: function(event)
            {
                if (document.activeElement !== document.body)
                {
                    return;
                }
                let key = event.key.toLowerCase();
                this.presses += this.presses === "" ? key : ` + ${key}`;
                this.keymap.get(this.presses)?.call();
            },
            onKeyUp: function()
            {
                this.presses = "";
            },
            hotkey: function(keys, method)
            {
                let key;
                switch (typeof(keys))
                {
                    case "number":
                        key = String.fromCharCode(keys);
                        break;
                    case "string":
                        key = keys;
                        break;
                    default:
                        key = keys.join(" + ");
                        break;
                }
                this.keymap.set(key.toLowerCase(), method);
            },
        };
    window.addons.register(content);
}