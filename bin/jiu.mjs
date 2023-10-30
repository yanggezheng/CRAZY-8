import * as myModule from '../lib/cards.mjs'; // game.mjs
import { question } from 'readline-sync';
import clear from 'clear';
// import { cp, readFile } from 'fs';

const names = ['weigan610', '🌞', 'blueSky', 'oneDay'];
let hands = [[], [], [], []];
let count = 0;
let xiaojie = '';

let deck = myModule.shuffle(myModule.generateDeck());
// const dealCards = myModule.deal(deck);
// console.log(dealCards);
while (1) {
    const cardObj = deck.pop();
    const str = cardObj.suit + cardObj.rank;
    hands[count % 4].push(str);
    count++;
    if (cardObj.rank === 2) {
        xiaojie = names[i];
    }
    console.log('current: ' + str);
    console.log('小姐: ', + xiaojie);
    for (let i = 0; i < 4; i++) {
        const card = hands[i].join(' ');
        const message = names[i] + " " + card;
        console.log(message);
    }
    if (count === 51) {
        count = 0;
        hands = [[], [], [], []];
        deck = myModule.shuffle(myModule.generateDeck());
    }
    question('');
    clear();
}