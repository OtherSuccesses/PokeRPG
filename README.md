# Poke-Map Challenge


## To view a live version of this game, [click here.](https://m081779.github.io/PokeRPG/)
### (Make sure your speakers are turned on!)

## Technologies used:
* HTML5
* CSS3 (including CSS animations and transitions)
* Bootstrap 3
* Javascript
* jQuery
* jQuery UI
* Firebase
* AJAX
* API's:
	* PokeAPI
	* Google Maps API
* Google Fonts




## The game is fully responsive on all common screen sizes:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/mobile1.png)
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/mobile2.png)




## The goal of this game is to see how many Pokemon you can catch.  It is built on the Google Maps API as a backdrop for the game, and draws the sprites down from the PokeAPI.  To begin, enter your name:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img1.png)




## If you attempt to enter numbers, or special characters you will not be allowed:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img2.png)




## leaving the name blank is also not allowed:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img3.png)





## Once you are logged in, this screen appears.  If you are a returning user, your score data is pulled from Firebase and displayed on the screen:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img4.png)




## Here is a view of the world map with the Pokemon sprites scattered randomly across the globe.  Their position is determined by an algorithm, so they are never in the same place twice: 
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img15.png)





##On the left is the animated title, on the right is the information accordion.  It remains translucent until hovered over, so as not to impact the user experience.  
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img5.png)





##The accordion has three views.  The first is the instructions which appear by default:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img6.png)





## The second is the user information which displays the player name, their high score, how many Pokemon have been caught and remain, and how many lives remain:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img7.png)





## The third view is the Poke-Pen, which is where captured Pokemon go.  You can drag the sprites around to rearrange them:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img14.png)





## If you click on a Pokemon on the world map, the battle sequence appears.
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img8.png)




## To score a hit and reduce the HP of the Pokemon, the user must click anywhere on the screen when the moving green dot is roughly above the red dot:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img10.png)





## If you click at the wrong time, a miss will register and you will lose HP:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img9.png)





## If you hit the Pokemon enough times to decrease it's life to zero, you can capture it:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img13.png)





## If you miss enough times you will die, and fade away:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img18.png)





## The game is over when you either collect all of the Pokemon, or die trying:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img16.png)





## At this point, if you register a score high enough, you will be placed on the leaderboard:
![image of Poke Map challenge](https://github.com/m081779/PokeRPG/blob/master/assets/images/img17.png)
