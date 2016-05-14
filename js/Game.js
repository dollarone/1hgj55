var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
    create: function() {

        //  A simple background for our game
        
        this.players = this.game.add.group();
        this.player2 = this.players.create(400, 400, 'plane');
        this.game.physics.arcade.enable(this.player2);
        this.player2.anchor.setTo(0.5);
        this.player2.body.collideWorldBounds = true;
        this.player2.body.setSize(6, 58, 0, 2);

        this.player = this.players.create(400, 400, 'plane');
        this.game.physics.arcade.enable(this.player);
        this.player.anchor.setTo(0.5);
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(58, 6, 0, 2);
        this.stars = this.game.add.group();

        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        this.music = this.game.add.audio('music');
        this.music.loop = true;
        //this.music.play();

        //  The score
        this.scoreText = this.game.add.text(246, 537, '', { fontSize: '32px', fill: '#fff' });
        //this.scoreText.fixedToCamera = true;
        
        this.startTime = this.game.time.now;
        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.timer = 0;
        this.rKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.rKey.onDown.add(this.reset, this);
        this.showDebug = false;
        this.gameOver = false; 

        this.level = 1;

    },


    createDanger: function() {
        var star = this.stars.create(this.game.rnd.integerInRange(0,800), -20, 'things')
        star.frame = this.game.rnd.integerInRange(0,3);
        star.body.velocity.y = this.game.rnd.integerInRange(20,240) + this.level;
        star.body.velocity.x = this.game.rnd.integerInRange(-40-this.level,40 +this.level);
        
        star.anchor.setTo(0.5);
        //setSize(width, height, offsetX, offsetY)
        //star.body.setSize(9, 9, 3, 5);
        star.dangerous = true;

    },

    reset: function() {
        this.state.restart();
    },

    update: function() {
        this.timer++;
        if (this.timer % Math.max(1, 50 - this.level) == 0) {
            this.createDanger();
        }

        if (this.timer % 100 == 0) {
            this.level++;
        }        
        if (!this.gameOver) {
            this.timeSpent = this.game.time.now - this.startTime;
            this.scoreText.text = "Time survived: " + parseFloat( (this.timeSpent / 1000)).toFixed(1) + "s";
        }
        else {
            return true;
        }
        
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.game.physics.arcade.overlap(this.players, this.stars, this.collectStar, null, this);

        //  Reset the players velocity (movement)
        if (this.player.body.velocity.x < -20) {
            this.player.body.velocity.x += 20;
            this.player2.body.velocity.x += 20;
        }
        else if (this.player.body.velocity.x > 20) {
            this.player.body.velocity.x -= 20;
            this.player2.body.velocity.x -= 20;
        }
        if (this.player.body.velocity.y < -20) {
            this.player.body.velocity.y += 20;
            this.player2.body.velocity.y += 20;
        }
        else if (this.player.body.velocity.y > 20) {
            this.player.body.velocity.y -= 20;
            this.player2.body.velocity.y -= 20;
        }

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -150;
            this.player2.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 150;
            this.player2.body.velocity.x = 150;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -150;
            this.player2.body.velocity.y = -150;
        }
        else if(this.cursors.down.isDown)
        {
            this.player.body.velocity.y = 150;
            this.player2.body.velocity.y = 150;
        }


    },

    preRender : function() {
        if (this.player.y > 570) {
            this.player.y = 570;
        }
        this.player2.y = this.player.y;
    },


    collectStar : function(player, star) {
        
        // Removes the star from the screen
        star.kill();
        if (this.gameOver) {
            return true;
        }
        if (star.dangerous) {
            this.gameOver = true;
            this.players.visible = false;
            //player2.visible = false;

            var gameoverText = this.game.add.text(200, 300, 'You died! Press R to restart', { fontSize: '32px', fill: '#fff' });          

        }

    },


    render: function() {

        if (this.showDebug) {
            this.game.debug.body(this.player2);
            this.game.debug.body(this.player);
        }
    },

};