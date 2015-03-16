(function (window) {
	'use strict';

    // -- Invaders ---------------------------------------------------
	var Invaders = function (width, height) {
		this._initialize(width, height);
		this._nextLevel();
	};

	Invaders.prototype.run = function () {
		var that = this;
		this.level = 0;
		this._nextLevel();
		this._resetShip();
		this.isRunning = true;
		this.gameLost = false;
		this.gameWon = false;
		this.interval = window.setInterval(function (event) {
			that._iterate();
		}, this.tickLength);
	};

	Invaders.prototype.startMovingShip = function (shipMovingLeft) {
		if (this.isRunning) {
            if (shipMovingLeft) {
                this.shipMovingLeft = true;
            } else {
                this.shipMovingRight = true;
            }
		}
	};

	Invaders.prototype.stopMovingShip = function (shipMovingLeft) {
		if (this.isRunning && (this.shipMovingLeft || this.shipMovingRight)) {
            if (shipMovingLeft) {
                this.shipMovingLeft = false;
            } else {
                this.shipMovingRight = false;
            }
		}
	};
    
    Invaders.prototype.shoot = function () {
		if (this.isRunning) {
			this.totalScore -= 1;
			this.shots.push(new Shot(this.shipX, this.shipY - 1, 0, this));
		}
	};
    
    Invaders.prototype._initialize = function (width, height) {
		this.tickLength = 100;
		this.width = width;
		this.height = height;
		this.level = 0;
		this.totalScore = 0;
		this.enemies = [];
		this.views = [];
		this.shots = [];
		this.enemiesGoingLeft = false;
		this.shipMovingLeft = false;
        this.shipMovingRight = false;
		this.isRunning = false;
		this.gameLost = false;
		this.gameWon = false;
	};

    Invaders.prototype._iterate = function () {
		var enemyLanded = false,
			shipY = this.shipY;

        if (this.shipMovingLeft) {
            this._moveShipLeft();
        } else if (this.shipMovingRight) {
            this._moveShipRight();
        }

		if (this._enemiesReachedTheBorder()) {
			this.enemiesGoingLeft = !this.enemiesGoingLeft;
		}
		this.enemies.forEach(function (enemy) {
			enemy.move();
			if ((enemy.posY + 1) === shipY) {
				enemyLanded = true;
			}
		});

		this.shots.forEach(function (shot) {
			shot.move();
		});

		this._calculateCollision();

		if (this.enemies.length === 0) {
			this.gameWon = true;
			this._stopGame();
		}
		if (enemyLanded) {
			this.gameLost = true;
			this._stopGame();
		}
		this._notifyViews();
	};
    
    Invaders.prototype._enemiesReachedTheBorder = function () {
		var switchDirection,
			i = (this.enemies.length - 1);
		while (i >= 0) {
			if ((!this.enemiesGoingLeft && ((this.enemies[i].posX + 1) >= this.width)) ||
                (this.enemiesGoingLeft && ((this.enemies[i].posX - 1) <= 0))) {
				switchDirection = true;
				break;
			}
			i = i - 1;
		}
		return switchDirection;
	};

	Invaders.prototype._calculateCollision = function () {
		var i, j, shotHit, newEnemies, newShots = [];
		if (this.shots.length > 0) {
			i = this.shots.length - 1;
			while (i >= 0) {
				j = this.enemies.length - 1;
				shotHit = false;
				newEnemies = [];
				while (j >= 0) {
					if ((this.shots[i].posX === this.enemies[j].posX) &&
						(this.shots[i].posY === this.enemies[j].posY)) {
						this.totalScore += 5;
						shotHit = true;
					} else {
						newEnemies.push(this.enemies[j]);
					}
					j = j - 1;
				}
				this.enemies = newEnemies;
				if (!shotHit) {
					newShots.push(this.shots[i]);
				}
				i = i - 1;
			}
			this.shots = newShots;
		}
	};

	Invaders.prototype._stopGame = function () {
		if (this.isRunning) {
			this.isRunning = false;
			window.clearInterval(this.interval);
		}
	};

	Invaders.prototype._resetShip = function () {
		this.shots = [];
		this.shipY = this.height - 2;
		this.shipX = Math.round(this.width / 2);
	};

	Invaders.prototype._moveShipLeft = function () {
		this.shipX = Math.max(0, this.shipX - 1);
	};

	Invaders.prototype._moveShipRight = function () {
		this.shipX = Math.min(this.width, this.shipX + 1);
	};

	Invaders.prototype._nextLevel = function () {
		this.level += 1;
		var speed = Math.max(1, 5 - this.level);
		this._resetShip();
		this._initializeEnemies(speed);
	};

	Invaders.prototype._initializeEnemies = function (speed) {
		var y, x, posY;
		this.enemies = [];
		for (y = 0; y < Math.round(this.height * 0.5); y += 2) {
			posY = 3 + y;
			for (x = 0; x < Math.round(this.width * 0.75); x += 2) {
				this.enemies.push(new Enemy(x, posY, speed, this));
			}
		}
	};

	Invaders.prototype.registerView = function (view) {
		this.views.push(view);
	};

	Invaders.prototype._notifyViews = function () {
		var that = this;
		this.views.forEach(function (view) {
			view.notify(that);
		});
	};

    // -- Enemy ------------------------------------------------------
	var Enemy = function (posX, posY, speed, invaders) {
		this.posX = posX;
		this.posY = posY;
		this.speed = speed;
		this.goingLeft = false;
		this.invaders = invaders;
		this.moveCooldown = 0;
	};

	Enemy.prototype.move = function () {
		if (this.moveCooldown === this.speed) {
			this.moveCooldown = 0;
			if (this.invaders.enemiesGoingLeft !== this.goingLeft) {
				this.goingLeft = this.invaders.enemiesGoingLeft;
				this.posY += 1;
			} else {
				this.posX += (this.goingLeft) ? -1 : 1;
			}
		}
		this.moveCooldown += 1;
	};

    // -- Shot -------------------------------------------------------
	var Shot = function (posX, posY, speed, invaders) {
		this.posX = posX;
		this.posY = posY;
		this.speed = speed;
		this.invaders = invaders;
		this.moveCooldown = 0;
	};

	Shot.prototype.move = function () {
		if (this.moveCooldown >= this.speed) {
			this.moveCooldown = 0;
			this.posY -= 1;
		}
		this.moveCooldown += 1;
	};

    
    // -- InvadersCanvasView -----------------------------------------
	var InvadersCanvasView = function (targetElement, invaders, scaleX, scaleY) {
		invaders.registerView(this);
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.spaceX = 2;
		this.spaceY = 2;
		this.border = 10;
		this.canvas = window.document.createElement('canvas');
		this.canvas.width = invaders.width * (this.scaleX + this.spaceX) + (this.border * 3);
		this.canvas.height = invaders.height * (this.scaleY + this.spaceY) + (this.border * 3);
		targetElement.appendChild(this.canvas);
		this._redraw(invaders);
	};

	InvadersCanvasView.prototype.notify = function (invaders) {
		this._redraw(invaders);
	};
    
    InvadersCanvasView.prototype._redraw = function (invaders) {
		var textY, shipY,
			ctx = this.canvas.getContext('2d'),
			width = this.canvas.width,
			height = this.canvas.height,
			scaleX = this.scaleX,
			scaleY = this.scaleY,
			spaceX = this.spaceX,
			spaceY = this.spaceY,
			border = this.border;

		ctx.fillStyle = window.invaders.colors.backgroundColor;
		ctx.fillRect(0, 0, width, height);

		this._drawEnemies(invaders, ctx, border, scaleX, spaceX, scaleY, spaceY);

		shipY = this._drawShip(invaders, ctx, border, scaleX, spaceX, scaleY, spaceY);

		if (!invaders.isRunning && !invaders.gameWon && !invaders.gameLost) {
			textY = this._drawGreetingScreen(shipY, scaleY, ctx, width);
			this._drawStartHint(shipY, scaleY, ctx, width, textY);
		}

		this._drawUI(invaders, ctx, scaleY, border, spaceX, height, spaceY, width);

		if (invaders.gameWon) {
			textY = this._drawWinScreen(ctx, scaleY, height, width);
			this._drawStartHint(shipY, scaleY, ctx, width, textY);
		}

		if (invaders.gameLost) {
			textY = this._drawLoseScreen(ctx, scaleY, height, width);
			this._drawStartHint(shipY, scaleY, ctx, width, textY);
		}
	};

	InvadersCanvasView.prototype._drawEnemies = function (invaders, ctx, border, scaleX, spaceX, scaleY, spaceY) {
		if (!invaders.isRunning) {
			ctx.fillStyle = window.invaders.colors.inactiveColor;
		} else {
			ctx.fillStyle = window.invaders.colors.enemyColor;
		}
		invaders.enemies.forEach(function (enemy) {
			ctx.fillRect(border + (enemy.posX * (scaleX + spaceX)),
				border + (enemy.posY * (scaleY + spaceY)),
				scaleX,
				scaleY);
		});

		if (!invaders.isRunning) {
			ctx.fillStyle = window.invaders.colors.inactiveColor;
		} else {
			ctx.fillStyle = window.invaders.colors.shotColor;
		}
		invaders.shots.forEach(function (shot) {
			var posX = border + (shot.posX * (scaleX + spaceX)) + Math.round((scaleX - 1) / 2);
			ctx.fillRect(posX,
				border + (shot.posY * (scaleY + spaceY)),
				1,
				scaleY);
		});
	};

	InvadersCanvasView.prototype._drawShip = function (invaders, ctx, border, scaleX, spaceX, scaleY, spaceY) {
		var shipX = border + invaders.shipX * (scaleX + spaceX);
		var shipY = border + invaders.shipY * (scaleY + spaceY);
		if (!invaders.isRunning) {
			ctx.fillStyle = window.invaders.colors.inactiveColor;
			ctx.strokeStyle = window.invaders.colors.inactiveColor;
		} else {
			ctx.fillStyle = window.invaders.colors.shipColor;
			ctx.strokeStyle = window.invaders.colors.shipStrokeColor;
		}
		ctx.beginPath();
		ctx.moveTo(shipX, shipY);
		ctx.lineTo(shipX + scaleX + spaceX, shipY);
		ctx.lineTo(shipX + Math.round((scaleX + spaceX) / 2), shipY - (scaleY + spaceY));
		ctx.fill();
		return shipY;
	};

	InvadersCanvasView.prototype._drawGreetingScreen = function (shipY, scaleY, ctx, width) {
		var textY = shipY - (scaleY * 14);
		ctx.font = Math.floor(1.75 * scaleY) + "px sans-serif";
		ctx.fillStyle = window.invaders.colors.uiColor;
		this._drawCenteredText(ctx, "JavaScript Game Example", width, textY);
		textY = textY + (scaleY * 2);
		this._drawCenteredText(ctx, "- Space Invaders -", width, textY);
		return textY;
	};

	InvadersCanvasView.prototype._drawUI = function (invaders, ctx, scaleY, border, spaceX, height, spaceY, width) {
		ctx.fillStyle = window.invaders.colors.uiColor;
		ctx.font = Math.floor(1.5 * scaleY) + "px sans-serif";
		ctx.fillText('Score: ' + invaders.totalScore, border + spaceX, height - border);
		ctx.strokeStyle = window.invaders.colors.uiColor;
		ctx.moveTo(0, height - border - (4 * spaceY) - scaleY);
		ctx.lineTo(width, height - border - (4 * spaceY) - scaleY);
		ctx.stroke();
	};

	InvadersCanvasView.prototype._drawWinScreen = function (ctx, scaleY, height, width) {
		var textY = Math.floor(height / 3);
		ctx.font = Math.floor(4 * scaleY) + "px sans-serif ";
		ctx.strokeStyle = window.invaders.colors.uiColor;
		ctx.fillStyle = window.invaders.colors.backgroundColor;
		this._drawCenteredText(ctx, "Victory!", width, textY, true);
		ctx.font = Math.floor(1.75 * scaleY) + "px sans-serif";
		textY = textY + (scaleY * 3);
		ctx.fillStyle = window.invaders.colors.uiColor;
		this._drawCenteredText(ctx, "You got them all!", width, textY);
		return textY;
	};

	InvadersCanvasView.prototype._drawLoseScreen = function (ctx, scaleY, height, width) {
		var textY = Math.floor(height / 3);
		ctx.font = Math.floor(4 * scaleY) + "px sans-serif ";
		ctx.strokeStyle = window.invaders.colors.uiColor;
		ctx.fillStyle = window.invaders.colors.backgroundColor;
		this._drawCenteredText(ctx, "Game Over!", width, textY, true);
		ctx.font = Math.floor(1.75 * scaleY) + "px sans-serif";
		textY = textY + (scaleY * 3);
		ctx.fillStyle = window.invaders.colors.uiColor;
		this._drawCenteredText(ctx, "The aliens got you this time!", width, textY);
		return textY;
	};

	InvadersCanvasView.prototype._drawStartHint = function (shipY, scaleY, ctx, width, textY) {
		var textX;
		textY = textY + (scaleY * 3);
		ctx.font = Math.floor(1.75 * scaleY) + "px sans-serif";
		textX = this._drawCenteredText(ctx, "[S] to start playing!", width, textY);
		ctx.fillStyle = window.invaders.colors.shipColor;
		ctx.fillText("[S]", textX, textY);
	};	

	InvadersCanvasView.prototype._drawCenteredText = function (ctx, text, width, posY, stroked) {
		var textInfo = ctx.measureText(text),
			posX = Math.floor((width - textInfo.width) / 2);
		if (stroked) {
			ctx.strokeText(text, posX, posY);
		} else {
			ctx.fillText(text, posX, posY);
		}
		return posX;
	};

    // -- Public Methods / Fields ------------------------------------
	window.invaders = {
		createGame: function (targetElement, width, height, scaleX, scaleY) {
			var invaders = new Invaders(width, height),
				invadersView = new InvadersCanvasView(targetElement, invaders, scaleX, scaleY);

			window.addEventListener('keypress', function (event) {
				if ((event.key == 's') || (event.keyCode == 115) || (event.charCode == 115)) {
					if (!invaders.isRunning) {
						invaders.run();
					}
				}
			});
			window.addEventListener('keydown', function (event) {
				if ((event.key == 'Spacebar') || (event.key == ' ') || (event.keyCode == 32) || (event.charCode == 32)) {
					invaders.shoot();
				}
				if ((event.key == 'ArrowLeft') || (event.keyCode == 37) || (event.charCode == 37)) {
					invaders.startMovingShip(true);
				}
				if ((event.key == 'ArrowRight') || (event.keyCode == 39) || (event.charCode == 39)) {
					invaders.startMovingShip(false);
				}
			});
			window.addEventListener('keyup', function (event) {
				if ((event.key == 'ArrowLeft') || (event.keyCode == 37) || (event.charCode == 37)) {
                    invaders.stopMovingShip(true);
                }
                if ((event.key == 'ArrowRight') || (event.keyCode == 39) || (event.charCode == 39)) {
					invaders.stopMovingShip(false);
				}
			});
		},
		colors: {
			backgroundColor: 'rgb(0,0,0)',
			shipColor: 'rgb(80,100,200)',
			shipStrokeColor: 'rgb(255,255,255)',
			enemyColor: 'rgb(200,60,60)',
			shotColor: 'rgb(255,255,255)',
			uiColor: 'rgb(200,200,200)',
			inactiveColor: 'rgb(80,80,80)'
		}
	};

})(window);