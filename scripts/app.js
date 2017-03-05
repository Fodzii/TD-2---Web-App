// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function() {
  'use strict';

    $(".button-collapse").sideNav();
    $('.carousel').carousel();

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
    var dataLastUpdated = new Date(data.created);
    var current = data.dev.identite;
    var nom = data.dev.identite.nom;
    var prenom = data.dev.identite.prenom;
    var fonction = data.dev.identite.fonction;
    var titre = data.dev.section.titre;
    var texte = data.dev.section.texte;
    var card = app.visibleCards[data.key];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.key] = card;
    }

    // Verifies the data provide is newer than what's already visible
    // on the card, if it's not bail, if it is, continue and update the
    // time saved in the card
    var cardLastUpdatedElem = card.querySelector('.card-last-updated');
    var cardLastUpdated = cardLastUpdatedElem.textContent;
    if (cardLastUpdated) {
      cardLastUpdated = new Date(cardLastUpdated);
      // Bail if the card has more recent data then the data
      if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
        return;
      }
    }
    cardLastUpdatedElem.textContent = data.created;

    card.querySelector('.current .fonction').textContent = fonction;
    card.querySelector('.current .nom').textContent = nom;
    card.querySelector('.current .prenom').textContent = prenom;
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  app.getForecast = function(key, label) {
    var statement = 'select * from weather.forecast where woeid=' + key;
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
        statement;
    // TODO add cache logic here

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results;
          results.key = key;
          results.label = label;
          results.created = response.query.created;
          app.updateForecastCard(results);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        app.updateForecastCard(initialProjectDescription);
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getForecast(key);
    });
  };


  var initialProjectDescription = {
    key:"1",
    dev: {
      identite: {
        nom: "Blancheton",
        prenom: "Fabien",
        fonction: "Développeur Android"
      },
      section:{
        titre: "Parcours",
        texte: "Have my breakfast spaghetti yarn throwup on your pillow chase dog then run away i could pee on this if i had the energy scratch at the door then walk away lie in the sink all day. Mrow i cry and cry and cry unless you pet me, and then maybe i cry just for fun kitty scratches couch bad kitty stick butt in face. Rub face on owner stare out the window so eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap so i am the best so the dog smells bad for soft kitty warm kitty little ball of furr lick the plastic bag. Kitten is playing with dead mouse hola te quiero poop on grasses or favor packaging over toy or spread kitty litter all over house. Cat not kitten around thinking longingly about tuna brine pushes butt to face attack dog, run away and pretend to be victim and jump off balcony, onto stranger's head so scratch the box eats owners hair then claws head. Cough furball poop in the plant pot plays league of legends put toy mouse in food bowl run out of litter box at full speed purr while eating, so cats go for world"
      }
    },
     key:"2",
    dev: {
      identite: {
        nom: "Quachero",
        prenom: "Alaric",
        fonction: "Développeur Android"
      },
      section:{
        titre: "Parcours",
        texte: "Have my breakfast spaghetti yarn throwup on your pillow chase dog then run away i could pee on this if i had the energy scratch at the door then walk away lie in the sink all day. Mrow i cry and cry and cry unless you pet me, and then maybe i cry just for fun kitty scratches couch bad kitty stick butt in face. Rub face on owner stare out the window so eat prawns daintily with a claw then lick paws clean wash down prawns with a lap of carnation milk then retire to the warmest spot on the couch to claw at the fabric before taking a catnap so i am the best so the dog smells bad for soft kitty warm kitty little ball of furr lick the plastic bag. Kitten is playing with dead mouse hola te quiero poop on grasses or favor packaging over toy or spread kitty litter all over house. Cat not kitten around thinking longingly about tuna brine pushes butt to face attack dog, run away and pretend to be victim and jump off balcony, onto stranger's head so scratch the box eats owners hair then claws head. Cough furball poop in the plant pot plays league of legends put toy mouse in food bowl run out of litter box at full speed purr while eating, so cats go for world"
      }
    }
  };

  // TODO uncomment line below to test app with fake data
  //app.updateForecastCard(initialProjectDescription);

  // TODO add startup code here

  // TODO add service worker code here
})();
