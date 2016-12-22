//create Game instance
var game = new Phaser.Game(640, 360, Phaser.AUTO);
game.state.add('state1',gameState.state1);
game.state.add('state2',gameState.state2);
game.state.start('state1');
