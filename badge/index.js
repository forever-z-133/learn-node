const fs = require('fs');
const { createCanvas } = require('canvas');

/**
 * 产生那些像在 github 常见的 badge 图，npm|v5.6.0 那种
 */

const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

ctx.clearRect(0, 0, 200, 200);
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, 200, 200);

ctx.font = '30px serif'
ctx.rotate(0.1)
ctx.fillStyle = '#000';
ctx.fillText('Awesome!', 50, 100)

// Draw line under text
var text = ctx.measureText('Awesome!')
ctx.strokeStyle = 'rgba(0,0,0,0.5)'
ctx.beginPath()
ctx.lineTo(50, 102)
ctx.lineTo(50 + text.width, 102)
ctx.stroke()

fs.writeFileSync(__dirname + '/img.jpg', canvas.toBuffer());
// Draw cat with lime helmet
// loadImage('examples/images/lime-cat.jpg').then((image) => {
//   ctx.drawImage(image, 50, 0, 70, 70)
//   console.log(canvas.toDataURL())
// })