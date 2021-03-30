const 	fs = require('fs'),
		https = require('https'),
		request = require('request'),
		Canvas = require('canvas'),
		{Image} = require('canvas'),
		express = require('express'),
		app = express();


app.listen((process.env.PORT || 3400));

app.get('/', (req, res) => {
	if(req.query.criptomoneda !== undefined) {
		https.get(`https://api.bitso.com/v3/ticker?book=${req.query.criptomoneda}_mxn`, (resp) => {
          let data = '';
          resp.on('data', (chunk) => {
            data += chunk;
          })

          resp.on('end', () => {
            var datos = JSON.parse(data);
			
			    // console.log(datos);

            const img = new Image();
            //img.src = './failure.png'
            img.src = './space.jpg'
            
            var c24h = parseInt(datos.payload['change_24']);
            if(c24h > 5000) {
              img.src = './space.jpg'
            }
            else if(c24h > 10000) {
              img.src = './marte.png'
            }
            

            var c = Canvas.createCanvas(800, 600);
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            ctx.font = "120px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "white";

            ctx.strokeText(`${req.query.criptomoneda.toUpperCase()}`, 400, 150);
            ctx.fillText(`${req.query.criptomoneda.toUpperCase()}`, 400, 150);
            
            ctx.font = "72px Arial";
            ctx.lineWidth = 3;
            // console.log(parseInt(datos.payload.last).toString().length)
            if(parseInt(datos.payload.last).toString().length < 5) {
              ctx.strokeText(`${(datos.payload.last).substring(0, 7)} MXN - 1 ${req.query.criptomoneda.toUpperCase()}`, 400, 300)
              ctx.fillText(`${(datos.payload.last).substring(0, 7)} MXN - 1 ${req.query.criptomoneda.toUpperCase()}`, 400, 300);
            }
            else {
              ctx.strokeText(`${parseInt(datos.payload.last)} MXN - 1 ${req.query.criptomoneda.toUpperCase()}`, 400, 300);
              ctx.fillText(`${parseInt(datos.payload.last)} MXN - 1 ${req.query.criptomoneda.toUpperCase()}`, 400, 300);
            }
            
           
            
            ctx.font = "32px Arial";
            
            ctx.strokeText(`Cambio 24h: ${(datos.payload['change_24']).toString().substring(0,5)} MXN`, 400, 350 )
            ctx.fillText(`Cambio 24h: ${(datos.payload['change_24']).toString().substring(0,5)} MXN`, 400, 350 )
            
            ctx.font = "12px Arial"



            ctx.textAlign = "start";
            ctx.fillText('Fuente: api.bitso.com', 10, 566)
            ctx.fillText(`Ultima actualizacion: ${new Date()/*.getHours()}:${new Date().getUTCMinutes()}:${new Date().getUTCSeconds()*/}`	, 10, 584);


            var logo = new Image();
            logo.src = './elTripLogo.png'
            ctx.globalAlpha = 0.3

            ctx.drawImage(logo, (800-128), (600-128))

			      res.type('png')
			      res.send(Buffer.from(c.toBuffer()))

			//res.sendFile(c.toBuffer());


            // const attachment = new MessageAttachment(c.toBuffer(), 'btc-mxn.png');
            // if(!msg.match(varCriptos)) {
            //   message.channel.send( attachment).then((m) => {
            //     if(Number.parseFloat(datos.payload['change_24']).toFixed(2) > 1000) {
            //       m.react('🚀')
            //     }
            //   });
            // }
            // else {
            //   message.author.send(attachment).then((m) => {
            //     if(Number.parseFloat(datos.payload['change_24']).toFixed(2) > 1000) {
            //       m.react('🚀')
            //     }
            //   })
            //   message.react('🚀')
            // }
          })
        }).on("error", (err) => {
          console.log("Error: " + err.message)
        })
	}
  else {
    res.sendStatus(404)
  }
})



