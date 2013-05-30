/**
 * Blockly Demo: Maze
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Demonstration of Blockly: Solving a maze.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Maze = {};

var frameSrc = frameSrc10.join('&');
document.write(mazepage.start({}, null,
    {MSG: MSG, frameSrc: frameSrc}));


/**
 * Initialize Blockly and the maze.  Called on page load.
 * @param {!Blockly} blockly Instance of Blockly from iframe.
 */
Maze.init = function(blockly) {
  window.Blockly = blockly;
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  Blockly.Apps.checkTimeout(%1);\n';
 
  
  // An href with #key trigers an AJAX call to retrieve saved blocks.
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
	}
 
  Blockly.addChangeListener(function() {Blockly.Apps.updateCapacity(MSG)});
};



/**
 * Click the run button.  Start the program.
 */
Maze.runButtonClick = function() {
  Blockly.mainWorkspace.traceOn(true);
  Maze.execute();
};


/**
 * Execute the user's code.  Heaven help us...
 */
Maze.execute = function() {

  Blockly.Apps.log = [];
  Blockly.Apps.ticks = 1000;
  var code = Blockly.Generator.workspaceToCode('JavaScript');
   code = Blockly.Apps.stripCode(code);
  try {
  //send to cluster
  if((code.indexOf('\n\n') == -1) && (code.indexOf('start') != -1) && (code.indexOf('end') != -1)){
	  alert('codigo: ' + code);
  }
  else{
	alert('erro: codigo mal formado\n');
  }
 
  } catch (e) {
  alert('error');
    // A boolean is thrown for normal termination.
    // Abnormal termination is a user error.
    if (typeof e != 'boolean') {
      alert(e);
    }
  }
  // Blockly.Apps.log now contains a transcript of all the user's actions.
  // Reset the maze and animate the transcript.
  Maze.reset();
};