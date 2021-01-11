'use strict';

/**
 * Variables
 */

let tirage = new Set() // contiendra le tirage de l'ordinateur
let saisie = new Array() // contiendra le choix de l'utilisateur (aurait aussi pu être un set)
let compGen, // numéro complémentaire généré
    compSaisi // numéro complémentaire saisi par l'utilisateur
let cpt = 0 // nombre de numéros correspondants au tirage
let gain = 0
// prix gagné

/**
 * Fonctions
 */

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Code principal
 */

function getUserChoice() {
    let inputs = document.querySelectorAll(".nombres")
    for (let input of inputs) {
        /**
         * On vérifie que chaque nombre saisi soit compris entre 1 et 50
         * Que l'input ne soit pas vide
         * et que le nombre ne soit pas saisi 2 fois
         * -> si une de ces conditions n'est pas respectée, on ajoute la classe warning à l'input
         */
        if (input.value.trim().length > 0 && input.value > 0 && input.value <= 50 && saisie.indexOf(parseInt(input.value)) == -1) {
            saisie.push(parseInt(input.value))
            input.disabled = true // on rend l'input disable pour qu'il ne soit plus modifiable
            input.classList.remove("nombres") // on supprime la class nombres pour que sur un 2 clic, les nombres déjà ajoutés au tableau ne soient plus pris en compte
            input.classList.remove("warning")
        } else {
            input.classList.add("warning")
        }
    }

    /**
     * Numéro complémentaire qui ne doit pas être vide et contenir un nombre compris entre 1 et 10
     */
    let inputComp = document.querySelector("#complementaire")
    if (inputComp.value.trim().length > 0 && inputComp.value > 0 && inputComp.value <= 10) {
        compSaisi = inputComp.value
        inputComp.disabled = true // on rend l'input disable pour qu'il ne soit plus modifiable
    } else {
        inputComp.classList.add("warning")
    }


    /**
     * on lance l'appel des fonctions suivantes uniquement si on a bien les 5 numéros
     */
    if (saisie.length == 5 && compSaisi != undefined) {
        compare()
        genPrice()
        showResult()
    }
}


/**
 * Génère un set qui contient les 5 numéros tirés par l'ordinateur.
 * Le set est un ensemble de données (un peu comme un tableau) qui, à la différence tu Array, ne peut pas contenir 2 fois la même valeur
 */
function generateComputeTirage() { // on tire 5 chiffres aléatoires uniques compris entre 1 et 50
    let nombre
    while (tirage.size < 5) {
        nombre = getRandomInteger(1, 50)
        if (tirage.has(nombre) == false) { // si le nombre n'est pas déjà dans le set, on l'ajoute
            tirage.add(nombre)
        }
    }
    compGen = getRandomInteger(1, 10) // génération du numéro complémentaire qui est compris entre 1 et 10
}

/**
 * Compare les chiffres tirés par l'ordinateur à ceux choisis par l'utilisateur
 * Incrémente le compteur cpt à chaque correspondance. C'est le nombre de correspondance qui déterminera le prix remporté par l'utilisateur
 */
function compare() {
    let html = ''
    console.log(saisie)
    for (let nbGen of tirage) {
        /**
         * Pour chaque nombre, on vérifie si l'utisateur l'a choisi
         * Si oui, on ajoute une classe win afin qu'il apparaisse en vert dans la page
         * Sinon, simplement le nombre sans classe
         */
        if (saisie.indexOf(nbGen) > -1) {
            cpt++
            html += `<span class="win">${nbGen}</span>`
        } else {
            html += `<span>${nbGen}</span>`
        }
    }

    // si le numéro complémentaire correspond, on incrémente le compteur et on ajoute 2000€ de gain
    if (compSaisi == compGen) {
        cpt++
        gain = 2000
        html += `<span class="win complementaire">${compGen}</span>`
    } else {
        html += `<span class="complementaire">${compGen}</span>`
    }

    document.querySelector('#result .generate').innerHTML = html
}


/**
 * En fonction du nombre de numéros trouvés (et comptabilisés grâce au cpt), on détermine combien va remporter l'utilisateur
 */
function genPrice() {
    /**
     * On calcule le montant total des gains en fonction du nombre de correspondances, sachant que si le numéro complémentaire a été tiré, on a déjà 2K€
     */
    switch (cpt) {
        case 2:
            gain += 1000
            break
        case 3:
            gain += 5000
            break
        case 4:
            gain += 10000
            break
        case 5:
        case 6:
            gain += 100000
            break
    }
    /**
     * Si on a gagné quelque chose, on affiche le montant, 
     * sinon on indique que rien n'a été gagné
     */
    if (gain > 0) {
        document.querySelector("#result h3 span").textContent = gain
    } else {
        document.querySelector("#result h3").textContent = "Vous n'avez rien gagné, mais vous pouvez retenter votre chance !"

    }
}

/**
 * Vient cacher la section de saisie de l'utilisateur et afficher celle des résultats après avoir généré un rappel des chiffres choisis par l'utilisateur
 */
function showResult() {
    document.querySelector("#choix").classList.add('hide')

    document.querySelector("#result .saisi").innerHTML = "Pour rappel, voici votre grille :"
    for (let choix of saisie) {
        document.querySelector("#result .saisi").innerHTML += choix + ', '
    }
    document.querySelector("#result .saisi").innerHTML += `et le numéro complémentaire <b>${compSaisi}</b>`

    document.querySelector("#result").classList.remove('hide')
}

document.addEventListener('DOMContentLoaded', function () {
    generateComputeTirage()
    console.log(tirage) //pour le debug, pour ne pas avoir à faire plein de tests pour choisir les bons nombres

    //gestionnaire d'événement sur le bouton afin de lancer tout le process
    document.querySelector('button').addEventListener('click', getUserChoice)
})