import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import { getDatabase, ref, set, child, get, update, remove }
from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGouQfxdNsbX8NEXsWYDhnIJlTt3LF9-w",
    authDomain: "memory-game-bcf3e.firebaseapp.com",
    databaseURL: "https://memory-game-bcf3e-default-rtdb.firebaseio.com",
    projectId: "memory-game-bcf3e",
    storageBucket: "memory-game-bcf3e.appspot.com",
    messagingSenderId: "278681444199",
    appId: "1:278681444199:web:3b5c101df487f8a78499c2"
};

const randomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const app = initializeApp(firebaseConfig);
const realdb = getDatabase();

function getNickName() {
    return modal.$inputNick.value;
}

function pushResultToDB() {
    const targetId = randomId();
    set(ref(realdb, "results/" + getNickName() + ':' + cardsPairs), {
        id: targetId,
        playerNick: getNickName(),
        complexity: cardsPairs,
        time: time.toFixed(2)
    });
}

const $app = document.getElementById('app');

let cards = [];
let cardsPairs = 3;
let modal = mainModal();

function createElement(elementType, ...classes) {
    const element = document.createElement(elementType);
    classes.forEach(oneClass => {
        element.classList.add(oneClass);
    });
    return element;
}

function defaultLayout() {
    const $contaienr = createElement('div', 'app__container');
    const $resultPanel = createElement('div', 'app__result-panel', 'result-panel');
    const $timer = createElement('div', 'result-panel__timer');
    const $lastRecord = createElement('div', 'result-panel__title');

    $lastRecord.innerText = 'MemoryGame!';

    const $game = createElement('div', 'app__game', 'game');

    const $actions = createElement('div', 'app__actions', 'actions');

    $resultPanel.append($timer, $lastRecord);
    $contaienr.append($resultPanel, $game, $actions);

    return { $contaienr, $timer, $lastRecord, $game };
}

function mainModal() {
    const $modalContainer = createElement('div', 'modal-container');
    $modalContainer.innerHTML = '';
    const $modal = createElement('div', 'modal', 'modal-main');

    const $startBtn = createElement('button', 'modal-main__start');
    $startBtn.innerText = 'Start!';

    const $inputNick = createElement('input', 'modal-main__nick');
    $inputNick.placeholder = 'Nickname..';
    $inputNick.value = localStorage.getItem('nick');
    $inputNick.type = 'text';
    $inputNick.required = 'required';

    const $inputNumber = createElement('input', 'modal-main__number');
    $inputNumber.value = 5;
    $inputNumber.type = 'number';

    const $recordList = getRecordList().$recordList;

    $modal.append($inputNick, $inputNumber, $startBtn, $recordList);
    $modalContainer.append($modal);
    $app.append($modalContainer);

    $startBtn.addEventListener('click', startGame);

    $inputNumber.addEventListener('change', () => {
        document.querySelector('.record-list').remove();
        if ($recordList) {
            $recordList.remove();
        }
        if (getRecordList().$recordHead) {
            getRecordList().$recordHead.remove();
        }
        const $newList = getRecordList().$recordList;
        $modal.append($newList);
    });
    

    function closeMainModal() {
        $modalContainer.classList.remove('open');
        $modal.classList.remove('open');
    }

    function openMainModal() {
        $modalContainer.classList.add('open');
        $modal.classList.add('open');
    }

    function getCardsPairs() {
        const number = $inputNumber.value;
        return number;
    }

    return { $modalContainer, openMainModal, closeMainModal, $inputNumber, getCardsPairs, $inputNick };
}

function getRecordList() {
    const $recordList = createElement('table', 'record-list');
    const $recordHead = createElement('thead', 'record-head');
    const $recordHeadTr = createElement('tr', 'record-head-tr');
    const $recordHeadNumber = createElement('th', 'record-head-th');
    $recordHeadNumber.innerText = 'Number';
    const $recordHeadNick = createElement('th', 'record-head-th');
    $recordHeadNick.innerText = 'Nick';
    const $recordHeadComlexity = createElement('th', 'record-head-th');
    $recordHeadComlexity.innerText = 'Complexity';
    const $recordHeadTime = createElement('th', 'record-head-th');
    $recordHeadTime.innerText = 'Time';
    const $recordBody = createElement('tbody', 'record-body');
    
    $recordHeadTr.append($recordHeadNumber, $recordHeadNick, $recordHeadComlexity, $recordHeadTime);
    $recordHead.append($recordHeadTr);
    $recordList.append($recordHead, $recordBody);

    let results = [];
    const dbref = ref(realdb);

    get(child(dbref, "results"))
    .then((snapshot) => {
        console.log(snapshot)
        snapshot.forEach(result => {
            const resultItem = result.val();
            if (resultItem.complexity == modal.$inputNumber.value) {
                results.push(resultItem);
            }
            console.log(results);
            
            refreshResultList(results);
        });
    });
    return { $recordList, $recordHead };
}

function refreshResultList(results) {
    const $recordList = document.querySelector('.record-list');
    let index = 1;

    results.sort((a, b) => a.time - b.time);

    $recordList.querySelector('.record-body').innerHTML = '';
    results.forEach(item => {
        const temp = `<tr class="result">
        <td class="result-number">${index + ')'}</td>
        <td class="result-nickname">${item.playerNick}</td>
        <td class="result-complexity">${item.complexity}</td>
        <td class="result-time">${item.time}</td>
        </tr>`;
        $recordList.querySelector('.record-body').insertAdjacentHTML('beforeend', temp);
        index++;
    });
}

function resultModal() {
    const $modalContainer = document.querySelector('.modal-container');
    $modalContainer.innerHTML = '';
    const $modal = createElement('div', 'modal', 'modal-result');

    const time = getTime();

    const $text = createElement('div', 'modal-result__text');
    $text.innerText = `result: ${time} \n ${getNickName()}`;

    const $relaodGame = createElement('button', 'modal-result__reload');
    $relaodGame.innerText = `Играть еще`;

    const $pushResult = createElement('button', 'modal-result__push');
    $pushResult.innerText = `Сохранить резульат`;

    const $recordList = getRecordList().$recordList;

    $modal.append($text, $relaodGame, $pushResult, $recordList);
    $modalContainer.append($modal);
    $app.append($modalContainer);


    function closeResultModal() {
        $modal.classList.remove('open');
        $modalContainer.classList.remove('open');
    }

    function openResultModal() {
        $modal.classList.add('open');
        $modalContainer.classList.add('open');
    }

    $relaodGame.addEventListener('click', () => {
        location.reload();
    });

    $pushResult.addEventListener('click', () => {
        $pushResult.setAttribute('disabled', '');
        pushResultToDB();
        document.querySelector('.record-list').remove();
        if ($recordList) {
            $recordList.remove();
        }
        if (getRecordList().$recordHead) {
            getRecordList().$recordHead.remove();
        }
        const $newList = getRecordList().$recordList;
        $modal.append($newList);
    })

    return { $modalContainer, openResultModal, closeResultModal };
}

function startGame() {
    $app.append(defaultLayout().$contaienr);
    modal.closeMainModal();
    createCardsArray();
    startTimer();
    localStorage.setItem('nick', modal.$inputNick.value);
}

function finishGame() {
    stopTimer();
    
    setTimeout(() => {
        resultModal().openResultModal();
    }, 600);
}

let time = 0;
let timerInterval;

function startTimer() {
    const timer = document.querySelector('.result-panel__timer');
    
    function updateTimer() {
        time += 0.01;
        timer.innerText = time.toFixed(2); 
        timerInterval = setTimeout(updateTimer, 10); 
    }

    updateTimer();
}

function getTime() {
    return time.toFixed(2);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function createCardsArray() {
    cardsPairs = parseInt(modal.getCardsPairs());
    cards = [];
    for (let i = 1; i <= cardsPairs; i++) {
        cards.push({
            number: +i,
            checked: "n",
            success: "n"
        }, {
            number: +i,
            checked: "n",
            success: "n"
        });
    }
    console.log(cards);

    mixCards();
}

function mixCards() {
    for (let i = 0; i < cards.length; i++) {
        const randomIndex = Math.floor(Math.random() * cards.length);

        const temp = cards[i];
        cards[i] = cards[randomIndex];
        cards[randomIndex] = temp;
    }
    console.log(cards);

    cardsToPage();
}

function cardsToPage() {
    cards.forEach(card => {
        console.log(cardTemplate(card));
        const game = document.querySelector('.game');
        game.append(cardTemplate(card));
    })
}

function cardTemplate(card) {
    const $card = createElement('div', 'card');
    $card.addEventListener('click', () => {
        checkCard($card, $face);
    });

    const $back = createElement('div', 'back');
    const $face = createElement('div', 'face');

    $face.innerText = card.number;

    $card.appendChild($face);
    $card.appendChild($back);

    return $card;
}

let firstCard = null;
let secondCard = null;

function checkCard(card, face) {
    console.log(card)
    if (card.classList.contains('checked') || card.classList.contains('success')) {
        return;
    }

    if (firstCard !== null && secondCard !== null) {
        firstCard.classList.remove('checked');
        secondCard.classList.remove('checked');
        firstCard = null
        secondCard = null
    }

    card.classList.add('checked');
    face.classList.add('checked');

    if (firstCard === null) {
        firstCard = card
    } else {
        secondCard = card
    }

    if (firstCard !== null && secondCard !== null) {
        let firstCardNumber = firstCard.textContent
        let secondCardNumber = secondCard.textContent

    if (firstCardNumber === secondCardNumber) {
        firstCard.classList.add('success');
        secondCard.classList.add('success');
        }
    }

    const successArray = document.querySelectorAll('.success');

    if (successArray.length === cards.length) {
        finishGame();
    }
}

modal.openMainModal();