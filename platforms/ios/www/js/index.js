/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// var decodeField;
// var decodedContent;

//var host = "192.168.1.58";
//var ws = new WebSocket('ws://' + host + ':9111');

var heldDown = false;


var shortCounter = 0; // used to count morse short and longs and super-longs (for deleting morse character)


var longCounter = 0; // used to count enter features of press -- short (add letter), long (read word), super-long (delete letter)


var enterCounter = 0;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
      this.morse2Go();
    },

    morse2Go: function() {
      app.focusElement(); // force focus to input box

      var decodedLetters = []; // array for holding morse inputs

      window.addEventListener("keydown", function(event){ // look for key event
        if (event.defaultPrevented){
           return;
         }

        if (event.key == " "){ // if keydown is an Enter key, add to "shortCounter" variable
          event.preventDefault();
          shortCounter = shortCounter + 1;

        }

        else if (event.key == "Enter"){ // if keydown is a Space key, add to "longCounter" variable
          event.preventDefault();
          longCounter = longCounter + 1;
        }

        else if (event.key == "Tab"){ // if keydown is a __ key, add to "enterCounter" variable
          event.preventDefault();
          enterCounter = enterCounter + 1;
        }

        if (shortCounter == 1) {
          //heldDown == true;
          app.playSound("media/shortHarp.mp3");
        }
        if (shortCounter == 6){
          app.playSound("media/longHarp.mp3");
        }
        if (longCounter == 1) {
          //heldDown == true;
          app.playSound("media/shortSpiel.mp3");
        }
        if (longCounter == 6){
          app.playSound("media/longSpiel.mp3");
        }
        if (enterCounter == 1) {
          //heldDown == true;
          app.playSound("media/bell.mp3");
        }
        if (enterCounter == 6){
          app.playSound("media/piano.mp3");
        }

      });

      window.addEventListener("keyup", function(event){
        // adds a short to the text field
        if (shortCounter > 0 && shortCounter <= 5){
          var morseLetter = document.getElementById('TextField').value = document.getElementById('TextField').value + '.';
          app.getMorse(decodedLetters);
          shortCounter = 0;
          heldDown == false;
      }

        // deletes morse character in input field
        else if (shortCounter > 5){
          var morseCode = document.getElementById('TextField').value;
          document.getElementById('TextField').value = morseCode.substring(0, morseCode.length-1);
          app.getMorse(decodedLetters);
          shortCounter = 0;
          heldDown == false;
        }

        // adds a long
        else if (longCounter > 0 && longCounter <=5){
          var morseLetter = document.getElementById('TextField').value =  document.getElementById('TextField').value + '-';
          app.getMorse(decodedLetters);
          longCounter = 0;
          heldDown == false;
        }

        // deletes letter from top
        else if (longCounter > 5){
          var decodedText = app.getMorse(decodedLetters);
          decodedLetters.push(decodedText);
          decodedLetters.splice(-2);
          app.getMorse(decodedLetters);
          longCounter = 0;
          app.focusElement();
        }

        // adds letter from morse input
        else if (enterCounter > 0 && enterCounter <= 5){
          var decodedText = app.getMorse(decodedLetters);
          decodedLetters.push(decodedText);
          document.getElementById('TextField').value = '';
          enterCounter = 0;
          app.focusElement();
        }

        // reads submitted letters
        else if (enterCounter > 5){
          var decodedText = app.getMorse(decodedLetters);
          decodedLetters.push(decodedText);
          var phraseToSpeak = app.compileWord(decodedLetters);
          responsiveVoice.speak(phraseToSpeak, "US English Male");
          //ws.send(phraseToSpeak);
          document.getElementById('TextField').value = "";
          decodedLetters.splice(0, decodedLetters.length);
          enterCounter = 0;
          app.focusElement();
        }

        else {
          shortCounter = 0;
          longCounter = 0;
          enterCounter = 0;
        }
      });
    },

    focusElement: function(){
      document.getElementById('TextField').focus();
    },

    compileWord: function(decodedLetters) {
      var assembledPhrase = decodedLetters.join("");
      //console.log(assembledPhrase);
      return assembledPhrase;
    },

    deleteChar: function() {
      var morseCode = document.getElementById('TextField').value;
      document.getElementById('TextField').value = morseCode.substring(0, morseCode.length-1);
      app.getMorse();
    },

    getMorse: function(decodedLetters) {
      var morseCode = document.getElementById('TextField').value;
      var decodeField = document.getElementById('decode');
      app.removeTextNodes(decodeField);
      var decodedText = morjs.decode(morseCode, {mode: 'simple'});
      var assembledPhrase = decodedLetters.join("");
      var decodedContent = document.createTextNode(assembledPhrase + decodedText);
      decodeField.appendChild(decodedContent);
      return decodedText;
    },

    playSound: function(fileName) {
      //https://stackoverflow.com/questions/28339389/how-to-get-path-for-local-mp3-file-from-www-in-phonegap-ios
      var path = window.location.pathname;
      path = path.substr( path, path.length - 10 );
      path = path + fileName;
      var my_media = new Media(path, function (){
        console.log("playAudio():Audio Success");
      },
        function() {
        alert("playAudio Error " + err);
        }
      );
        //alert("here");
      my_media.play();
    },
/*
    playShort2: function() {
      //https://stackoverflow.com/questions/28339389/how-to-get-path-for-local-mp3-file-from-www-in-phonegap-ios
      var path = window.location.pathname;
      path = path.substr( path, path.length - 10 );
      path = path + "media/bell.mp3";
      var my_media = new Media(path, function (){
        console.log("playAudio():Audio Success");
      },
        function() {
        alert("playAudio Error " + err);
        }
      );
        //alert("here");
      my_media.play();
    },

    playLong1: function() {
      //https://stackoverflow.com/questions/28339389/how-to-get-path-for-local-mp3-file-from-www-in-phonegap-ios
      var path = window.location.pathname;
      path = path.substr( path, path.length - 10 );
      path = path + "media/organ.mp3";
      var my_media = new Media(path, function (){
        console.log("playAudio():Audio Success");
      },
        function() {
        alert("playAudio Error " + err);
        }
      );
        //alert("here");
      my_media.play();
    },

    playLong2: function() {
      //https://stackoverflow.com/questions/28339389/how-to-get-path-for-local-mp3-file-from-www-in-phonegap-ios
      var path = window.location.pathname;
      path = path.substr( path, path.length - 10 );
      path = path + "media/piano.mp3";
      var my_media = new Media(path, function (){
        console.log("playAudio():Audio Success");
      },
        function() {
        alert("playAudio Error " + err);
        }
      );
        //alert("here");
      my_media.play();
    },

    playEnter1: function() {
      //https://stackoverflow.com/questions/28339389/how-to-get-path-for-local-mp3-file-from-www-in-phonegap-ios
      var path = window.location.pathname;
      path = path.substr( path, path.length - 10 );
      path = path + "media/organ.mp3";
      var my_media = new Media(path, function (){
        console.log("playAudio():Audio Success");
      },
        function() {
        alert("playAudio Error " + err);
        }
      );
        //alert("here");
      my_media.play();
    },

    playEnter2: function() {
      //https://stackoverflow.com/questions/28339389/how-to-get-path-for-local-mp3-file-from-www-in-phonegap-ios
      var path = window.location.pathname;
      path = path.substr( path, path.length - 10 );
      path = path + "media/piano.mp3";
      var my_media = new Media(path, function (){
        console.log("playAudio():Audio Success");
      },
        function() {
        alert("playAudio Error " + err);
        }
      );
        //alert("here");
      my_media.play();
    },
*/
    removeTextNodes: function(decodeField){
      var nodesToRemove = decodeField.childNodes;
      for (var i = 0; i < nodesToRemove.length; i++){
          decodeField.removeChild(nodesToRemove[i]);
      }
    }
};

app.initialize();
