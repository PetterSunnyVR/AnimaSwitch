var gameState = {};


gameState.state1 = function(){};

gameState.state1.prototype = {
    preload: function(){
        this.load.image("background","assets/images/background.png");
        
        this.load.spritesheet('chicken',"assets/images/chicken_spritesheet.png",131,200,3);
        this.load.spritesheet('horse','assets/images/horse_spritesheet.png',212,200,3);
        this.load.spritesheet('pig','assets/images/pig_spritesheet.png',297,200,3);
        this.load.spritesheet('sheep','assets/images/sheep_spritesheet.png',244,200,3);
        
        this.load.image('arrow','assets/images/arrow.png');
        
        this.load.audio('chickenSound',['assets/audio/chicken.ogg','assets/audio/chicken.mp3']);
        this.load.audio('horseSound',['assets/audio/horse.ogg','assets/audio/horse.mp3']);
        this.load.audio('pigSound',['assets/audio/pig.ogg','assets/audio/pig.mp3']);
        this.load.audio('sheepSound',['assets/audio/sheep.ogg','assets/audio/sheep.mp3']);
        
    },
    create: function(){
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        
        this.background = this.game.add.sprite(0,0,"background");
        
        //group - array of objects - key = asset key (load.sppritesheet), text - under each image there will be text
        var animalData = [
            {key: 'chicken', text: 'CHICKEN', audio: 'chickenSound'},
            {key: 'horse', text: 'HORSE', audio: 'horseSound'},
            {key: 'pig', text: 'PIG', audio: 'pigSound'},
            {key: 'sheep', text: 'SHEEP', audio: 'sheepSound'},
        ];
        
        this.animalsGroup = this.game.add.group();
        
        //because in forEach "this" is a different obj than "this" above we assign above "this" as a new var and only then we can use it inside loops scope
        var self = this;
        
        // element = each element of array above
        animalData.forEach(function(element){
            animal = self.animalsGroup.create(-1000, this.game.world.centerY, element.key, 0);    
            //added audio
            animal.customParams = {text: element.text, sound: self.game.add.audio(element.audio)};
            
            animal.anchor.setTo(0.5);
            
            //create animation
            animal.animations.add('animate',[0,1,2,1,0,1], 3, false);
            
            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(self.animateAnimal, self);
        });
        
        //current animal will be held in this variable
        this.currentAnimal = this.animalsGroup.next(); //next() gets next animal starting from animal 0 and calld again retriving animal 1 and so on.
        this.currentAnimal.position.set(this.game.world.centerX,this.game.world.centerY);
        
        //show animal text
        console.log(this.currentAnimal.customParams.text+ " 3");
        this.showText(this.currentAnimal);
        
        
        /*this.chicken = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'chicken');
        this.chicken.anchor.setTo(0.5,0.5);*/
        
        //enable input on animal
        //chicken input
        /*this.chicken.inputEnabled = true;
        this.chicken.input.pixelPerfectClick = true;
        this.chicken.events.onInputDown.add(this.animateAnimal, this);*/
        
        //this.chicken.scale.setTo(0.5,2);
        /*this.pig = this.game.add.sprite(500,300, 'pig');
        this.pig.anchor.setTo(0.5);
        this.pig.scale.setTo(-1,-1);
        
        this.sheep = this.game.add.sprite(100,200, 'sheep');
        this.sheep.anchor.setTo(0.5);
        this.sheep.scale.setTo(0.5);
        this.sheep.angle = 45;*/
        
        //adding arrows
        
        //left arrow
        this.leftArrow = this.game.add.sprite(60,this.game.world.centerY, 'arrow');
        this.leftArrow.scale.x = -1;
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.customParams = {dir: -1};
        
        //leftArrow input
        this.leftArrow.inputEnabled = true;
        //this.leftArrow.input. = true;
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this);
        
        //right arrow
        this.rightArrow = this.game.add.sprite(580,this.game.world.centerY, 'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = {dir: 1};
        
        //rightArrow input
        this.rightArrow.inputEnabled = true;
        //this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);
    },
    update: function(){
  

    },
    
    animateAnimal: function(sprite, event){
      sprite.play('animate');  
        //play the sound
        sprite.customParams.sound.play();
    },
    
    switchAnimal: function(sprite, event){
        this.animalText.visibile = false;
        //animation onComplete() function
        //console.log(this.isMoving+" 1");
        //1st time isMoving = undefined so the if doesnt run
        if(this.isMoving){
            return false;
        }
        
        this.isMoving = true;
        //after that we get true = if runs so we cant change animal
        //console.log(this.isMoving+" 2");
        
        //hide text
        this.animalText.visible = false;
        console.log(this.animalText.visibile+" 0");
        
        //console.log(sprite.customParams.text);
        var newAnimal, finalX;
        
        //1. get arrow dir
        if(sprite.customParams.dir>0){
            
            newAnimal = this.animalsGroup.next();
            //direction
            
            newAnimal.x = -newAnimal.width/2;
            finalX = 640 + this.currentAnimal.width/2;
            //finalX = 640 + this.currentAnimal.width/2;
        }else{
            newAnimal = this.animalsGroup.previous();
            //direction
            newAnimal.x = 640 + newAnimal.width/2;
            finalX = -this.currentAnimal.width/2;
        }
        
        var newAnimalMovement = this.game.add.tween(newAnimal);
        //.to - sets target
        newAnimalMovement.to({x: this.game.world.centerX},1000);
        
        //if isMoving stays true we cant change animals. onComplete runs when the tween has done moving. It changes isMoving to false so we can again change animal to a new one
        newAnimalMovement.onComplete.add(function(){
            this.isMoving = false;
            this.showText(newAnimal);
        },this);
        
        newAnimalMovement.start();
        
        var currentAnimalMovement = this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({x: finalX},1000);
        currentAnimalMovement.start();
        //this.currentAnimal.x = finalX;
        //newAnimal.x = this.game.world.centerX;
        this.currentAnimal = newAnimal;
        //2. get animal text
        
        //3. get final destination
        
        //4. move current animal away from the screen
        
        //5. set new animal as current
    },
    showText: function(animal){
        //console.log(animal.customParams.text +" 3");
        
        if(!this.animalText){
            var style = {
                font: 'bold 30pt Arial',
                fill: '#D0171B',
                align: 'center'
            };
            this.animalText = this.game.add.text(this.game.width/2, this.game.height*0.85, '', style);
            this.animalText.anchor.setTo(0.5);
            
        }
        console.log(this.animalText.visible+" 1")
        //console.log(animal.customParams.text);
        //console.log(animal.customParams.text);
        this.animalText.setText(animal.customParams.text);
        this.animalText.visible = true;
        
    }
    
};