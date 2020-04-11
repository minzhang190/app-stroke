var queue = new createjs.LoadQueue();

document.title = String.fromCodePoint(parseInt(codepoint, 16));

var canvas = document.getElementById('canvas');
var stage = new createjs.Stage(canvas);

var strokeBitmaps = [];
var strokeInfos = [];

var current = -1;
var writing = false;

function write(e) {
    if (e.target._x_strokeId == current) {
        render();
    }
}

function mouseover(e) {
    console.log('mouseover');
    if (writing) {
        write(e);
    }
}

function mousedown(e) {
    console.log('mousedown');
    writing = true;
    write(e);
}

function stagemouseup(e) {
    console.log('stagemouseup');
    writing = false;
}

function render() {
    if (current >= 0) {
        var previousStroke = strokeBitmaps[current];
        createjs.Tween.get(previousStroke).to({
            alpha: 1
        }, 500);
    }

    while (++current < strokeBitmaps.length && (
        strokeInfos[current]._x_solidCount < 128
    )) {
        var skippedStroke = strokeBitmaps[current];
        createjs.Tween.get(skippedStroke).to({
            alpha: 1
        }, 1000);
        stage.addChild(skippedStroke);
    }

    if (current < strokeBitmaps.length) {
        var currentStroke = strokeBitmaps[current];
        createjs.Tween.get(currentStroke).to({
            alpha: 0.5
        }, 500);
        stage.addChild(currentStroke);
    }

    console.log('next stroke:', current);
}

function ready(strokes) {
    var background = strokes.shift();

    var backgroundBitmap = new createjs.Bitmap(background.getImage());
    stage.addChild(backgroundBitmap);

    var coverBitmap = new createjs.Bitmap(queue.getResult('cover'));
    stage.addChild(coverBitmap);

    stage.update();

    strokes.forEach(function(stroke, strokeId) {
        var canvas = stroke.getImage();
        var bitmap = new createjs.Bitmap(canvas);
        var info = stroke.frameInfo;
        bitmap._x_strokeId = strokeId;
        bitmap.alpha = 0;
        bitmap.addEventListener('mouseover', mouseover);
        bitmap.addEventListener('mousedown', mousedown);
        strokeBitmaps.push(bitmap);
        info._x_strokeId = strokeId;
        var solidCount = 0;
        var data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        for (var i = 3; i < data.length; i += 4) {
            if (data[i] != 0) {
                solidCount++;
            }
        }
        info._x_solidCount = solidCount;
        console.log(strokeId, info);
        strokeInfos.push(info);
    });

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener('tick', stage);

    render();

    stage.enableMouseOver();
    console.log('touch:', createjs.Touch.enable(stage, true, false));

    stage.addEventListener('stagemouseup', stagemouseup);
}

queue.installPlugin(createjs.Sound);

queue.on('complete', function() {
    require('gif-frames')({
        url: 'data/' + codepoint + '.gif',
        frames: 'all',
        outputType: 'canvas'
    }).then(ready);
});

queue.loadManifest([
    {id: 'cover', src: 'cover.png', type: createjs.Types.IMAGE},
]);
