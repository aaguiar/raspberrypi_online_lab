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

var MSG = window.parent.MSG;
var maxBlocks = window.parent.maxBlocks;
// document.dir fails in Mozilla, use document.body.parentNode.dir instead.
// https://bugzilla.mozilla.org/show_bug.cgi?id=151407
var rtl = window.parent.document.body.parentNode.dir == 'rtl';
var toolbox = window.parent.document.getElementById('toolbox');

// Extensions to Blockly's language and JavaScript generator.

Blockly.JavaScript = Blockly.Generator.get('JavaScript');



Blockly.Language.maze_lamp = {

  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(MSG.lamp)
		  .appendTitle(new Blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(MSG.lampTooltip);
  }
};

Blockly.JavaScript.maze_lamp = function() {
  // Generate JavaScript for turning left or right.
  var dir = this.getTitleValue('DIR');
  var code;
 
    code = 'Lamp '+ dir +';\n';
  
  return code;
};

Blockly.Language.maze_lamp.DIRECTIONS =
    [[MSG.on, 'turnOn'], [MSG.off, 'turnOff']];


Blockly.Language.start = {
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(MSG.start);
    this.setPreviousStatement(false);
    this.setNextStatement(true);
    this.setTooltip(MSG.startTooltip);
  }
};

Blockly.JavaScript.start = function() {
  return 'start;\n';
};
Blockly.Language.end = {

  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendTitle(MSG.end);
    this.setPreviousStatement(true);
    this.setNextStatement(false);
    this.setTooltip(MSG.endTooltip);
  }
};

Blockly.JavaScript.end = function() {
  return 'end;\n';
};






Blockly.Language.maze_if = {
  // Block for 'if' conditional if there a path.
  helpUrl: '',
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendTitle(MSG.ifPath);
        //.appendTitle(new Blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
    this.appendStatementInput('DO')
        .appendTitle(MSG.do);
    this.setTooltip(MSG.ifTooltip);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


Blockly.JavaScript.maze_if = function() {
  // Generate JavaScript for 'if' conditional if there is a path.
  var argument = 'Maze.' + this.getTitleValue('DIR') + '()';
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  var code = 'Blockly.Apps.highlight(\'' + this.id + '\');\n' +
             'if (' + argument + ') {\n' + branch + '}';
  return code;
};

Blockly.Language.maze_ifElse = {
  // Block for 'if/else' conditional if there a path.
  helpUrl: '',
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendTitle(MSG.ifPath);
        //.appendTitle(new Blockly.FieldDropdown(this.DIRECTIONS), 'DIR');
    this.appendStatementInput('DO')
        .appendTitle(MSG.do);
    this.appendStatementInput('ELSE')
        .appendTitle(MSG.else);
    this.setTooltip(MSG.ifelseTooltip);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


Blockly.JavaScript.maze_ifElse = function() {
  // Generate JavaScript for 'if/else' conditional if there is a path.
  var argument = 'Maze.' + this.getTitleValue('DIR') + '()';
  var branch0 = Blockly.JavaScript.statementToCode(this, 'DO');
  var branch1 = Blockly.JavaScript.statementToCode(this, 'ELSE');
  var code = 'Blockly.Apps.highlight(\'' + this.id + '\');\n' +
             'if (' + argument + ') {\n' + branch0 +
             '} else {\n' + branch1 + '}';
  return code;
};

Blockly.Language.maze_forever = {
  // Do forever loop.
  helpUrl: 'http://code.google.com/p/blockly/wiki/Repeat',
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendTitle(MSG.repeatUntilFinished);
    this.appendStatementInput('DO').appendTitle(MSG.do);
    this.setPreviousStatement(true);
    this.setTooltip(MSG.whileTooltip);
  }
};

Blockly.JavaScript.maze_forever = function() {
  // Generate JavaScript for do forever loop.
  var branch = Blockly.JavaScript.statementToCode(this, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  return 'while (true) {\n' + branch + '}\n';
};

function init() {
  Blockly.inject(document.body,
      {path: '../../',
       maxBlocks: maxBlocks,
       rtl: rtl,
       toolbox: toolbox,
       trashcan: true});
  Blockly.loadAudio_('whack');
  Blockly.loadAudio_('win');
  if (window.parent.Maze) {
    // Let the top-level application know that Blockly is ready.
    window.parent.Maze.init(Blockly);
  } else {
    // Attempt to diagnose the problem.
    var msg = 'Error: Unable to communicate between frames.\n\n';
    if (window.parent == window) {
      msg += 'Try loading index.html instead of frame.html';
    } else if (window.location.protocol == 'file:') {
      msg += 'This may be due to a security restriction preventing\n' +
          'access when using the file:// protocol.\n' +
          'http://code.google.com/p/chromium/issues/detail?id=47416';
    }
    alert(msg);
  }
}
