function resize() {
    var canvas = document.getElementById('canvas');
    var widthToHeight = canvas.width / canvas.height;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
    } else {
        newHeight = newWidth / widthToHeight;
    }

    canvas.style.position = 'fixed';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.height = newHeight + 'px';
    canvas.style.width = newWidth + 'px';
    canvas.style.marginTop = '-' + newHeight / 2 + 'px';
    canvas.style.marginLeft = '-' + newWidth / 2 + 'px';
}

resize();

window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
