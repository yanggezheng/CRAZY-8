import * as myModule from '../lib/cards.mjs'; // game.mjs
import {question} from 'readline-sync';
import clear from 'clear';
import {cp, readFile} from 'fs';
let deck;
let discardPile = [];
let playerHand = [];
let computerHand = [];
let end = false;
let topCard;
const args = process.argv;
let obj;
const sleep = function(time) {
    return new Promise(resolve => setTimeout(resolve, time));//from stackOverflow
    //https://stackoverflow.com/questions/39538473/using-settimeout-on-promise-chain
}
const printLine = function(){
    console.log('-----------------------------------------------');
}
const printTitle = function(){
    console.log("              CR🤪ZY 8's");
    printLine();
    console.log('Next suit/rank to play: ➡️  '+myModule.handToString([topCard])+'  ⬅️')
}
const printdiscard = function(){
    printLine();
    console.log("Top of discard pile: "+myModule.handToString([topCard]));
    console.log("Number of cards left in deck: "+deck.length);
    printLine();
}
const printHand = function(){
    console.log("🤖✋ (computer hand): "+myModule.handToString(computerHand));
    console.log("😊✋ (player hand): "+myModule.handToString(playerHand));
    printLine();
}
const checkHand = function(arr){
    for (let i = 0; i < arr.length; i++){
        if(myModule.matchesAnyProperty(arr[i],topCard)) return true;
    }return false;
}
const crazyEight = function(){
    const SPADES = {
        rank:'',
        suit:'♠️'
    }
    const HEARTS = {
        rank:'',
        suit:'❤️'
    }
    const CLUBS = {
        rank:'',
        suit:'♣️'
    }
    const DIAMONDS = {
        rank:'',
        suit:'♦️'
    }
    const suit = [SPADES,HEARTS,CLUBS,DIAMONDS];
    console.log(myModule.handToString(suit,"\n",true));
    const userChoice = question("> ");
    console.log('You chose to set the suit to '+suit[userChoice-1]['suit']);
    topCard = suit[userChoice-1];
    question("Press ENTER to continue");
}
const playerTurn = function(){
    console.log("😊 Player's turn...");
    if (checkHand(playerHand)){
        console.log('Enter the number of the card you would like to play');
        console.log(myModule.handToString(playerHand,"\n", true));
        let userChoice = question("> ");
        while (!myModule.matchesAnyProperty(playerHand[userChoice-1],topCard)){
            console.log('You can not play this card!');
            userChoice = question("> ");
        }
        if (playerHand[userChoice-1]['rank'] === '8'){
            crazyEight();
        }else {
            topCard = playerHand[userChoice-1];
        }
        let playerHand1 = [];
        for (let i = 0; i < playerHand.length; i++){
            if(i != userChoice-1)
            {playerHand1.push(playerHand[i]);}
        }
        if (playerHand1.length === 0){
            end = true;
            console.log("Player won!");
        }
        playerHand = playerHand1;
    }
    
    else{
        let drawnCard = [];
        console.log('😔 You have no playable cards');
        console.log('Press ENTER to draw cards until matching: '+topCard['rank']+', '+topCard['suit']+', 8');
        console.log('.');
        [deck, drawnCard] = myModule.drawUntilPlayable(deck, topCard);
        if (deck.length === 0) {
            end = true;
            console.log('No more cards');
            return false;
        }
        console.log('Cards drawn: '+myModule.handToString(drawnCard));
        console.log('Card played: '+myModule.handToString([drawnCard[drawnCard.length-1]]));
        topCard = drawnCard[drawnCard.length-1];
        for (let i = 0; i < drawnCard.length-1; i++){
            playerHand.push(drawnCard[i]);
        }
        if (drawnCard[drawnCard.length-1]['rank']==='8'){
            crazyEight();
        }else{
            question("Press ENTER to continue");
        }
    }
}
const computerTurn = function(){
    if (!end){console.log("🤖 Computer's turn...");
    console.log("🤖✋ (computer hand): "+myModule.handToString(computerHand));
    let computerHand1 = [];
    if (checkHand(computerHand)){
        for(let i = 0; i < computerHand.length; i++){
            if(myModule.matchesAnyProperty(computerHand[i],topCard)){
                console.log('Computer plays '+myModule.handToString([computerHand[i]]));
                if (computerHand[i]['rank'] === '8'){
                    topCard ={ suit:'❤️' , rank: ""}
                    console.log('Computer chose to set the suit to ❤️');
                }else{
                    topCard = computerHand[i];
                }
                for (let j = 0; j < computerHand.length; j++){
                    if(i !=j){computerHand1.push(computerHand[j]);}
                }
                computerHand = computerHand1;
                i = 100;
            }
        }
    if(computerHand.length === 0){
        console.log('Computer won!');
        end = true;
    }}
    else{
        let drawnCard = [];
        console.log('😔 Computer has no playable cards');
        [deck, drawnCard] = myModule.drawUntilPlayable(deck, topCard);
        if (deck.length === 0) {
            end = true;
            console.log('No more cards');
            return false;
        }
        console.log('Cards drawn: '+myModule.handToString(drawnCard));
        console.log('Card played: '+myModule.handToString([drawnCard[drawnCard.length-1]]));
        for (let i = 0; i < drawnCard.length-1; i++){
            computerHand.push(drawnCard[i]);
        }
        if (drawnCard[drawnCard.length-1]['rank']==='8'){
            topCard ={ suit:'❤️' , rank: ""}
            console.log('Computer chose to set the suit to ❤️');
        }else{
            topCard =drawnCard[drawnCard.length-1];
            question("Press ENTER to continue");
        }
    }}
}

if (args.length === 3){
        readFile(args[2], 'utf8', (err, data) => { obj = JSON.parse(data);});
        await sleep(1000);
        for (const [key, value] of Object.entries(obj)) {
            if (key === "deck") {
                deck = value;
            }else if (key === "playerHand") {
                playerHand = value;
            }else if (key === "computerHand") {
                computerHand = value;
            }else if (key === "discardPile") {
                discardPile = value;
            }else if (key === "nextPlay") {
                topCard = [value];
            }
    }
}else{
    deck = myModule.shuffle(myModule.generateDeck());
    const dealCards = myModule.deal(deck);
    deck = dealCards['deck'];
    discardPile.push(deck.pop());
    [playerHand, computerHand] = dealCards['hands'];
    topCard = discardPile.pop();
}
while(!end){
    printTitle();
    printdiscard();
    printHand();
    if (playerTurn() === false){
        break;
    }
    if (computerTurn() === false){
        break;
    }
}

