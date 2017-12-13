---
---

/* RUN DIALOG BACKEND JS - specify run box aliases and the functions they execute */
/*      this file gets loaded dynamically whenever the run dialog is opened      */

// we should eventually replace the hardcoded aliases here with a database-type system
// loaded dynamically
function aliasRun(rawCommand) {
    var command = rawCommand.toLowerCase(); // for case insensitivity
    if(command == "debug") {
        var debugJsLink = $("<script src='system/debug/debug.js'>");
        $("head").append(debugJsLink);
        winDebug();
    } else if (command == "winver") {
        winverStart();
    } else if (command == "calc") {
        window.location.href = "{{site.url}}/games/calculator.html";
    } else if (command == "winmine") {
        window.location.href = "{{site.url}}/games/minesweeper.html";
    } else if (command == "pacman") {
        window.location.href = "{{site.url}}/games/pacman.html";
    } else if (command == "tetris") {
        window.location.href = "{{site.url}}/games/tetris.html";
    } else if (command == "miao") {
        window.open("http://image.baidu.com/search/index?tn=baiduimage&ipn=r&cl=2&lm=-1&st=-1&fm=index&fr=&hs=0&sf=1&fmq=&pv=&ic=0&nc=1&z=&se=1&showtab=0&fb=0&width=&height=&face=0&istype=2&ie=utf-8&word=cat");
    } else if (command == false) {
    
    } else {
        windowsError(1, "Error", "Command not found!");
    }
}