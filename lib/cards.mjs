import clear from "clear";

// cards.mjs
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const range = function(start, end, inc){
    if (end === undefined && inc === undefined){
        end = start;
        start = 0;
        inc = 1;
    }else if (inc === undefined){
        inc = 1;
    }
    const arr = [];
    for (let i = start; i < end; i+= inc) {
        arr.push(i);
    }
    return arr;
};
const generateDeck = function(){
    const arr = [];
    const rankTable = {
        1: 'A',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: 'J',
        12: 'Q',
        13: 'K'
    }
    const suitTable = {
        1: suits.CLUBS,
        2: suits.DIAMONDS,
        3: suits.HEARTS,
        4: suits.SPADES
    }
    for (let i =1; i < 14; i++){
        for (let j = 1; j < 5; j++){
            arr.push({
                suit: suitTable[j], rank: rankTable[i]
            })
        }
    }
    return arr;
}
const shuffle = function(arr){
    const array = [...arr];
    for (let i = 0; i < 1000; i++){
        const indexOne = Math.floor(Math.random()*52);
        const indexTwo = Math.floor(Math.random()* 52);
        const temp = array[indexOne];
        array[indexOne] = array[indexTwo];
        array[indexTwo] = temp;
    }
  return array;
}
const draw = function(arr, n = 1){
    const res =[]; 
    const array = [...arr];
    const size = arr.length;
    for (let i = size-1; i > size-n-1; i--){
        res.push(array[i]);
        array.pop();
    }
    return [array, res];
}
const deal = function(arr, numHands = 2, cardsPerHand = 5){
    const array = [...arr];
    const hand = [];
    let size = array.length;
    for (let j = 0; j < numHands; j ++){
        const playerHand = [];
        for (let i = size -1 ; i > size - 1 - cardsPerHand; i--){
            playerHand.push(array[i]);
            array.pop();
        }
        hand.push(playerHand);
        size = array.length;
    }
    return {deck:array, hands:hand};
}
const handToString = function(hand, sep = '  ', numbers = false){
    let res = "";
    if (numbers){
        res += 1;
        res += ': ';
    }
    res+=hand[0]["rank"];
    res+=hand[0]['suit'];
    for (let i = 2; i < hand.length+1; i++){
        res+=sep;
        if (numbers){
            res += i;
            res += ': ';
        }
        res+=hand[i-1]['rank'];
        res+=hand[i-1]['suit'];
    }
    return res;
}
const matchesAnyProperty = function(obj, matchObj){
    const keys = Object.keys(obj);
    const keys1 = Object.keys(matchObj);
    for (let i = 0; i < keys.length; i++){
        for (let j = 0; j < keys1.length; j++){
            if ((keys[i] === keys1[j])&&(obj[keys[i]]===matchObj[keys1[j]])){
                return true;
            }
        }
    }return false;
}
const drawUntilPlayable = function(deck, matchObject){
    const array = [...deck];
    let i = deck.length-1;
    const hands =[];
    while (array[i]['rank']!=matchObject['rank']&&array[i]['suit']!=matchObject['suit']&&array[i]['rank']!=8&&i>0){
        hands.push(array[i]);
        array.pop();
        i--;
    }hands.push(array[i]);
    array.pop();
    return [array, hands];
}

export{
    range,
    generateDeck,
    shuffle,
    draw,
    deal,
    handToString,
    matchesAnyProperty,
    drawUntilPlayable,
    suits
};

