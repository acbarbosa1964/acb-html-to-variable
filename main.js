define(function (require, exports, module) {
    "use strict";

    var docIndex = 1,
        commandId = "acb-html-to-variable",
        menuID = "acb.htmlMenuID",
        menuLabel = "Convert to Variable",
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Commands = brackets.getModule("command/Commands"),
        CommandManager = brackets.getModule("command/CommandManager"),
        KeyBindingManager = brackets.getModule("command/KeyBindingManager"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        Menus = brackets.getModule("command/Menus"),
        trackService = require('./services/trackingClient').init(),
        menu;

    function convertSelectedToVariable() {
        var editor = EditorManager.getActiveEditor(),
            selectedText = editor.getSelectedText();

        if (selectedText.length > 0) {
            selectedText = selectedText.replace(/"/gi, '\\"');

            var arrSelectedText = selectedText.split('\n'),
                newBlock = 'snippets.variable = "';

            for (var i = 0; i < arrSelectedText.length; i++) {
                if (i < (arrSelectedText.length - 1)) {
                    newBlock += arrSelectedText[i] + '\\n" +\n"';
                } else {
                    newBlock += arrSelectedText[i] + '\\n";';
                }
            }
            _replaceActiveSelection(newBlock)
        }

    }

    function _replaceActiveSelection(str) {
        EditorManager.getActiveEditor()._codeMirror.replaceSelection(str);
        MainViewManager._getPane(MainViewManager.ACTIVE_PANE).focus();
    }

    CommandManager.register(menuLabel, menuID, convertSelectedToVariable);
    menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuItem(menuID, undefined, Menus.AFTER, Commands.FILE_NEW_UNTITLED);
    KeyBindingManager.addBinding(menuID, "Ctrl-Alt-V", "mac");
    KeyBindingManager.addBinding(menuID, "Ctrl-Alt-V", "win");
});
