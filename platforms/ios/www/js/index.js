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
var counter = 0; // used to count morse short and longs and super-longs (for deleting morse character)
var beans = 0; // used to count enter features of press -- short (add letter), long (read word), super-long (delete letter)

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

        if (event.key == "Enter"){ // if keydown is an Enter key, add to "counter" variable
          //event.preventDefault();
          counter = counter + 1;

        }

        else if (event.key == " "){ // if keydown is a Space key, add to "beans" variable
          event.preventDefault();
          beans = beans + 1;
        }

        if (counter == 1) {
          heldDown == true;
          //app.playShort();
        }

      });

/*
      if (counter > 0 && counter <= 5) {
        app.playShort();
      }
*/

      window.addEventListener("keyup", function(event){
        if (counter > 0 && counter <= 5){
        var morseLetter = document.getElementById('TextField').value = document.getElementById('TextField').value + '.';
        app.getMorse(decodedLetters);
        counter = 0;
        heldDown == false;
      }

        else if (counter > 5 && counter <= 20){
          var morseLetter = document.getElementById('TextField').value =  document.getElementById('TextField').value + '-';
          app.getMorse(decodedLetters);
          counter = 0;
          heldDown == false;
        }

        else if (counter > 20){
          var morseCode = document.getElementById('TextField').value;
          document.getElementById('TextField').value = morseCode.substring(0, morseCode.length-1);
          app.getMorse(decodedLetters);
          counter = 0;
          heldDown == false;
        }

        else if (beans > 0 && beans <= 5){
          var decodedText = app.getMorse(decodedLetters);
          decodedLetters.push(decodedText);
          document.getElementById('TextField').value = '';
          beans = 0;
          app.focusElement();
        }

        else if (beans > 5 && beans <= 20){
          var decodedText = app.getMorse(decodedLetters);
          decodedLetters.push(decodedText);
          var phraseToSpeak = app.compileWord(decodedLetters);
          responsiveVoice.speak(phraseToSpeak, "US English Male");
          //ws.send(phraseToSpeak);
          document.getElementById('TextField').value = "";
          decodedLetters.splice(0, decodedLetters.length);
          beans = 0;
          app.focusElement();
        }

        else if (beans > 20){
          var decodedText = app.getMorse(decodedLetters);
          decodedLetters.push(decodedText);
          decodedLetters.splice(-2);
          app.getMorse(decodedLetters);
          beans = 0;
          app.focusElement();
        }

        else {
          counter = 0;
          beans = 0;
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

    playShort: function() {
      var path = window.location.pathname;
      path = path.substr( path, path.length - 10 );
      path = path + "media/short.mp3";
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

    removeTextNodes: function(decodeField){
      var nodesToRemove = decodeField.childNodes;
      for (var i = 0; i < nodesToRemove.length; i++){
          decodeField.removeChild(nodesToRemove[i]);
      }
    }
};

app.initialize();

/*
      document.getElementById('submitText').addEventListener('touchend', function(){
        var decodedText = app.getMorse(decodedLetters);
        decodedLetters.push(decodedText);
        var phraseToSpeak = app.compileWord(decodedLetters);
        responsiveVoice.speak(phraseToSpeak, "US English Male");
        ws.send(phraseToSpeak);
        document.getElementById('TextField').value = "";
        decodedLetters.splice(0, decodedLetters.length);
      });

      window.addEventListener("keydown", function(event){
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        switch (event.key) {
          case "Enter":
            counter = counter + 1;
            if (counter > 0 || counter < 3){
            var morseLetter = document.getElementById('TextField').value = document.getElementById('TextField').value + '.';
            app.getMorse(decodedLetters);
            counter = 0;
          }
            break;
        }

      });

      document.getElementById('dot').addEventListener('touchend', function(){
        var morseLetter = document.getElementById('TextField').value = document.getElementById('TextField').value + '.';
        app.playShort();
        app.getMorse(decodedLetters);
      });

      document.getElementById('dash').addEventListener('touchend', function(){
        var morseLetter = document.getElementById('TextField').value = document.getElementById('TextField').value + '-';
        app.getMorse(decodedLetters);
      });

      document.getElementById('space').addEventListener('touchend', function(){
        var decodedText = app.getMorse(decodedLetters);
        decodedLetters.push(decodedText);
        document.getElementById('TextField').value = '';
      });

      document.getElementById('deleteLetter').addEventListener('touchend', function(){
        var morseCode = document.getElementById('TextField').value;
        document.getElementById('TextField').value = morseCode.substring(0, morseCode.length-1);
        app.getMorse(decodedLetters);
      });


      document.getElementById('sendText').addEventListener('touchend', function(){
        alert("pressed");
      });
*/
