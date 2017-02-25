var app = {
	inicio: function () {

		DIAMETRO_BOLA = 50;
		DIAMETRO_OBJETIVO = 50;

		dificultad = 0;
		puntuacion = 0;
		velocidadX=0;
		velocidadY=0; 

		velocidadTargetX=200;
		velocidadTargetY=200; 

		alto  = document.documentElement.clientHeight;
	    ancho = document.documentElement.clientWidth;

		app.vigilaSensores();

 	},

 	iniciaJuego: function()  {

 		function preload() {
	  		game.physics.startSystem(Phaser.Physics.ARCADE);
 			
 			//game.stage.backgroundColor = '#82E0AA';
 			game.load.image("background", "assets/grass.png");
	

 			//Cargamos las imagenes
 			game.load.image('bola','assets/bola.png');
 			game.load.image('objetivoBueno','assets/goodTarget.png');
			game.load.image('objetivoMalo','assets/badTarget.png');

 		}

 		function create() {
 			
 			//Inicializamos el fondo
 			 game.add.tileSprite(0, 0, ancho, alto, 'background'); 

 			//Inicializamos el marcador
 			scoreText = game.add.text(16, 16, puntuacion, {fontSize: '100px', fill: '#757676'});

 			//Inicializamos los assets: la bola del juego y los objetivos buenos y malos
 			bola=game.add.sprite(app.numeroAletarioHasta(ancho - DIAMETRO_BOLA), 
 				app.numeroAletarioHasta(alto - DIAMETRO_BOLA), 'bola');
 
 			objetivoBueno=game.add.sprite(app.numeroAletarioHasta(ancho - DIAMETRO_OBJETIVO),
 					 app.numeroAletarioHasta(alto - DIAMETRO_OBJETIVO), 'objetivoBueno');
 			objetivoMalo=game.add.sprite(app.numeroAletarioHasta(ancho - DIAMETRO_OBJETIVO), 
 					app.numeroAletarioHasta(alto - DIAMETRO_OBJETIVO), 'objetivoMalo');
 			
 			
 			game.physics.arcade.enable(bola);
 			game.physics.arcade.enable(objetivoBueno);
 			game.physics.arcade.enable(objetivoMalo);

			//Ponemos que la bola colision con los bordes y que lance una señal para decremntar la puntuacion
 			bola.body.collideWorldBounds = true;
 			bola.body.onWorldBounds = new Phaser.Signal();
  			bola.body.onWorldBounds.add(app.decrementarPuntuacion, this);
 		
 			//Ponemos que el objetivo bueno colisione con los bordes y que al hacerlo cambie su dirección
			objetivoBueno.body.velocity.setTo(velocidadTargetX,velocidadTargetY);

 			objetivoBueno.body.collideWorldBounds = true;
 			objetivoBueno.body.onWorldBounds = new Phaser.Signal();
 			objetivoBueno.body.bounce.set(1);
 
 			//Ponemos que el objetivo malo colisione con los bordes y que al hacerlo cambie su dirección
			objetivoMalo.body.velocity.setTo(150,150);

 			objetivoMalo.body.collideWorldBounds = true;
 			objetivoMalo.body.onWorldBounds = new Phaser.Signal();
 			objetivoMalo.body.bounce.set(1);
  			
 			
		}

 		function update() {

 			//Aumentamos la velocidad nuesra y la de nuestro objetivo
 			var factorDificultad = (300 + (dificultad*100));

 			
 			bola.body.velocity.y = (velocidadY * factorDificultad);
      		bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));      		

      		game.physics.arcade.overlap(bola, objetivoBueno, app.capturaObjetivoBueno, null, this);
      		game.physics.arcade.overlap(bola, objetivoMalo, app.capturaObjetivoMalo, null, this);
      					
 		}

 		var estados = {preload: preload, create: create, update: update};
 		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);

 	},

	//Cambia la puntuación segun el parametro dado
	decrementarPuntuacion: function() {
		app.cambiarPuntuacion(-1);
 	},

 	//Cambia la puntuación segun el parametro dado
	cambiarPuntuacion: function(punt) {
		puntuacion = puntuacion + punt;	
		scoreText.text = puntuacion;
 	},

 	//Metodo que se ejecuta cuando se captura el objetivo bueno (suma 10 ptos)
 	capturaObjetivoBueno: function() {
 		//Subimos la puntuacion
 		app.cambiarPuntuacion(10);
		
		//Repintamos el objetivo bueno
		objetivoBueno.body.x = app.numeroAletarioHasta(ancho - DIAMETRO_OBJETIVO);
 		objetivoBueno.body.y = app.numeroAletarioHasta(alto - DIAMETRO_OBJETIVO);

 		//Aumentamos dificultad
 		if (puntuacion > 0) {
 			dificultad = dificultad +1;
 		}

   		objetivoBueno.body.velocity.setTo(velocidadTargetX+(dificultad*10), velocidadTargetY+(dificultad*10));


 	},

 	//Metodo que se ejecuta cuando se captura el objetivo malo (resta 10 ptos)
 	capturaObjetivoMalo: function() {
 		//Bajamos la puntuacion
 		app.cambiarPuntuacion(-10);
		
 		//Repintamos el objetivo bueno
		objetivoMalo.body.x = app.numeroAletarioHasta(ancho - DIAMETRO_OBJETIVO);
 		objetivoMalo.body.y = app.numeroAletarioHasta(alto - DIAMETRO_OBJETIVO);

 	},

 	numeroAletarioHasta: function (limite) {
 		return Math.floor(Math.random() * limite);
 	},

 	vigilaSensores: function() {

		function onError() {
 			console.log('onError!');
 		}
		
	 	function onSuccess(datosAcelaracion) {
 			app.detectaAgitacion(datosAcelaracion);
			app.registraDireccion(datosAcelaracion);
  		}
		
 		navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 100});		
 	},
 
 	detectaAgitacion: function(datosAcelaracion){
 		agitacionX = datosAcelaracion.x > 10;
 		agitacionY = datosAcelaracion.y >10;

 		if (agitacionY || agitacionX) {
 			setTimeout(app.recomienza, 1000);
 		}
 	},

 	recomienza: function() {
 		document.location.reload(true);
 	},

 	registraDireccion: function(datosAcelaracion) {
 		velocidadX = datosAcelaracion.x;
 		velocidadY = datosAcelaracion.y;
 	},

 	muestraJuego: function(){
 		document.getElementById('portada').style.display='none';
 		document.getElementById('phaser').style.display='block';
 		app.iniciaJuego();
 	}
};

if ('addEventListener' in document) {
		document.addEventListener('deviceready', function(){
			app.inicio();
		}, false);
}