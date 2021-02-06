function initPlateau() {

  //Définition des variables nécessaires à la création du plateau de jeu
  const plateau = document.getElementById('plateau');
  const resultat = document.getElementById('resultat');
  let nbrEssais = 10;
  let nbrPions = 5;

  //Création des éléments du plateau de jeu
  let i = nbrEssais;
  do {
    //Création d'une ligne d'essais
    const ligne = document.createElement('div');
    ligne.className = 'ligne';

    //Numérotation de la ligne
    const numeroLigne = document.createElement('div');
    numeroLigne.textContent = i.toString();
    numeroLigne.className = 'num-ligne';
    ligne.appendChild(numeroLigne);

    //Création de l'emplacement pour les pions
    for (let n = 0; n < nbrPions; n++) {
      const trou = document.createElement('div');
      trou.className = 'trou';
      ligne.appendChild(trou);
    }

    //Mise en place d'une ligne sur le plateau
    plateau.appendChild(ligne);

    //Création de la ligne des résultats
    const ligneResult = document.createElement('div');
    ligneResult.className = 'ligne-result';

    for (let n = 0; n < nbrPions; n++) {
      const trouResult = document.createElement('div');
      trouResult.className = 'trou-result';
      ligneResult.appendChild(trouResult);
    }

    resultat.appendChild(ligneResult);
    //Décrémentation de la boucle
    i--

  } while (i > 0);

}

function jeu() {
  //Mise en route du chrono
  const chronoDisplay = document.getElementById('chrono');
  let temps = 0;
  let chrono = window.setInterval(function() {
    temps++;
    if (temps < 60) {
      chronoDisplay.textContent = 'Temps: ' + temps + ' s';
    } else {
      chronoDisplay.textContent = 'Temps: ' + Math.floor(temps / 60) + ' min ' + temps % 60 + ' s';
    }
  }, 1000);

  /*****Création de la combinaison de couleurs à trouver*****/

  //Définition des variables
  let combinaison = [];
  let combinaisonNum = [];
  let nbrPions = 5;
  let nbrCouleurs = 6;

  //Création d'un boucle pour définir une couleur au hasard par emplacement
  for (let i = 0; i < nbrPions; i++) {

    //Génération d'un nombre au hasard qui servira à définir une couleur
    let nbrHasard = Math.ceil(Math.random() * nbrCouleurs);

    //Teste si le nombre est déjà dans la variable
    function testCouleur(nbr) {
      return combinaisonNum.includes(nbr);
    }

    //Tant que le nombre générée est dans la variable, on en génère un nouveau
    if (testCouleur(nbrHasard)) {
      do {
        nbrHasard = (Math.random() * 5).toFixed() + 1;
      } while (testCouleur(nbrHasard));
    }

    //Le nombre généré est inséré dans nos variables array
    combinaisonNum.push(nbrHasard);
    combinaison.push(nbrHasard);

    //Le nombre est remplacé par le nom d'une couleur dans l'array 'combinaison'
    switch (combinaison[i]) {
      case 1:
        combinaison[i] = 'green';
        break;

      case 2:
        combinaison[i] = 'blue';
        break;

      case 3:
        combinaison[i] = 'red';
        break;

      case 4:
        combinaison[i] = 'yellow';
        break;

      case 5:
        combinaison[i] = 'white';
        break;

      case 6:
        combinaison[i] = 'black';
        break;
    }
  }
  console.log(combinaison);

  /*****Création de l'interaction dans le jeu******/

  //Définition des variables
  let essais = 9;
  let pionsPlaces = 1;

  const boutons = document.getElementsByClassName('bouton');
  const lignes = document.getElementsByClassName('ligne');
  const cancel = document.getElementById('cancel');
  const test = document.getElementById('test');

  //Définition des actions lorsqu'on click sur un bouton de couleur
  for (let i = 0; i < boutons.length; i++) {
    boutons[i].addEventListener('click', function (e) {
      if (lignes[essais].childNodes[pionsPlaces]) {
        lignes[essais].childNodes[pionsPlaces].className = 'pion ' + e.target.getAttribute('data-color');
        lignes[essais].childNodes[pionsPlaces].setAttribute('data-color', e.target.getAttribute('data-color'));
        pionsPlaces++;
      }
    });
  }

  //Définition de l'action du bouton d'annulation
  cancel.addEventListener('click', function () {
    pionsPlaces--;
    if (lignes[essais].childNodes[pionsPlaces] && pionsPlaces >= 1) {
      lignes[essais].childNodes[pionsPlaces].className = 'trou';
    }
  });

  //Définition des actions du bouton de test
  test.addEventListener('click', function () {
    //Création d'un tableau contenant la combinaison à tester
    let codeTeste = [];

    lignes[essais].childNodes.forEach(elt => {
      if (elt.hasAttribute('data-color')) {
        codeTeste.push(elt.getAttribute('data-color'));
      }
    });

    //Création d'une variable booléenne pour savoir si la combinaison a été trouvée 
    let combinaisonTrouvee = function () {
      for (let i = 0; i < codeTeste.length; i++) {
        if (codeTeste[i] !== combinaison[i]) {
          return false
        }
      }
      return true;
    }

    if (combinaisonTrouvee()) {
      //Si la combinaison est trouvée, message + arrêt du chrono
      document.getElementById('message').textContent = 'Bravo!! Vous avez gagné!!';
      window.clearInterval(chrono);
    } else {
      //Sinon on indique si le pion ou la couleur est bonne
      for (let i = 0; i < codeTeste.length; i++) {
        const lignesResult = document.getElementsByClassName('ligne-result');
        if (codeTeste[i] === combinaison[i]) {
          lignesResult[essais].childNodes[i].classList.add('ok');
        }

        if (combinaison.includes(codeTeste[i])) {
          lignesResult[essais].childNodes[i].classList.add('couleur');
        }
      }
    }

    //Mise à jour des variables
    essais--;
    pionsPlaces = 1;
  });
}

window.addEventListener('load', function () {
  initPlateau();
  document.getElementById('start').addEventListener('click', () => {
    jeu();
  });
});