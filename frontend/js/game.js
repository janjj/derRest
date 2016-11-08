/**
 * Created by JanJJ on 21.10.2016.
 */

var game = {};
game.player = {
    name: "",
    collectedCandies: 0,
    keyCountWall: 0
};

game.player.moveToIfPossible = function (x, y) {
    var locationId = x + maze.config.splitChar + y;
    if (!maze.isWall(x, y)) { //Prüft ob nicht auf Mauer gelaufen wird
        if (maze.isCandy(x, y)) {
            var $xyPosElement = $("#" + x + maze.config.splitChar + y);
            $xyPosElement.html(maze.config.chars[0]);
            $xyPosElement.removeClass("candy");
            game.player.collectedCandies++;
        }
        game.player.setPos(x, y);
        $("#" + game.player.getPos()).removeAttr(game.config.selectorPlayerClass, ""); //Altes Attribut für Position löschen
        $("#" + locationId).attr(game.config.selectorPlayerClass, "test"); //Neues Attribut für Position setzen
        if (maze.isOnExit(x, y)) {
            game.finishGameAndDisplayText();
        }
    } else {
        game.player.keyCountWall++;
    }
};

game.player.getPos = function () {
    return $("span[player]").attr("id");
};

game.player.setPos = function (x, y) {

    //Alte Position löschen UND setze Klasse game.config.selectorPlayerClass zurück für die Farbe
    var $playerPos = $("#" + game.player.getPos());
    $playerPos.html(maze.config.chars[0]);
    $playerPos.removeClass(game.config.selectorPlayerClass);

    //Neue Position setzen UND setze Klasse game.config.selectorPlayerClass für die Farbe
    var $newPlayerPos = $("#" + x + maze.config.splitChar + y);
    $newPlayerPos.html(game.config.playerSymbol);
    $newPlayerPos.addClass(game.config.selectorPlayerClass);
};

game.startTime = 0;

game.config = {
    selectorPlayerClass: "player",
    playerSymbol: "&#916;",
    startPosX: 1,
    startPosY: 1,
    difficulty: 1
};

game.initialiseKeyEvent = function () {
    $(document).off("keydown");
    $(document).on("keydown", $(document), function (event) {
        if (event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40 || event.keyCode == 37) {
            event.preventDefault();
            var playerPos = game.player.getPos();
            if (typeof(playerPos) == "undefined") {
                game.finishGameAndDisplayText();
                return;
            }
            game.player.keyCount++;
            var playerPosXY = playerPos.split(maze.config.splitChar);
            switch (event.keyCode) {
                case 37:
                    game.player.moveToIfPossible(parseInt(playerPosXY[0]), parseInt(playerPosXY[1]) - 1);
                    break;
                case 38:
                    game.player.moveToIfPossible(parseInt(playerPosXY[0]) - 1, parseInt(playerPosXY[1]));
                    break;
                case 39:
                    game.player.moveToIfPossible(parseInt(playerPosXY[0]), parseInt(playerPosXY[1]) + 1);
                    break;
                case 40:
                    game.player.moveToIfPossible(parseInt(playerPosXY[0]) + 1, parseInt(playerPosXY[1]));
                    break;
            }
        }
    });
};

game.calculateScore = function (candy, time, maxTime) {
    var level = 1;
    var timePoints = Math.min(level * 1000, maxTime/(time * game.config.difficulty)); // Kurzform für: 1000/(Zeit*(1000/60/Schwierigkeit)) 
    var candyPoints = level * 1000 * Math.pow((candy / maze.config.candyCount), 2); 
    var errorPoints = Math.max(100 - game.player.keyCountWall * 10, 0); 
    return (candyPoints * timePoints) + errorPoints;
};

game.start = function (name) {
    $('button').text('restart game');
    $(':focus').blur();
    game.reset();
    game.player.name = name;

    game.player.moveToIfPossible(game.config.startPosX, game.config.startPosY);
    game.timeMeasure("start");
    game.initialiseKeyEvent(); //Startet möglichkeit zu Steuern
};

game.timeMeasure = function (start) {
    if (start === "start") {
        game.startTime = Date.now();
    }
    if (start === "stop" && (game.startTime != 0)) {
        return (Date.now() - game.startTime) / 1000;
    }

};

game.saveScore = function (name, points, timeInSeconds) {
    var url = location.protocol + '//' + location.host + location.pathname + 'api/highscore';
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: JSON.stringify({
            name: name,
            score: points,
            level: 1,
            elapsedTime: timeInSeconds
        })
    });
};

game.finishGameAndDisplayText = function () {
    $(document).off("keydown");
    var timeInSeconds = game.timeMeasure("stop");

    var points = game.calculateScore(game.player.collectedCandies, timeInSeconds, 60);
    game.saveScore(game.player.name, points, timeInSeconds);
    maze.unload();
    maze.printResult(points, timeInSeconds);
};

game.reset = function () {
    game.startTime = 0;
    game.player.name = "";
    maze.isLoaded = false;
};
