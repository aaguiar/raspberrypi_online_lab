// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

if (typeof mazepage == 'undefined') { var mazepage = {}; }


mazepage.start = function(opt_data, opt_ignored, opt_ijData) {
  return '<table width="100%" height="100%"><tr><td width="410" valign="top"><h1>' + soy.$$escapeHtml(opt_ijData.MSG.title) + '</h1><table width="100%"><tr><button id="runButton" class="launch" onclick="Maze.runButtonClick();">' + soy.$$escapeHtml(opt_ijData.MSG.runProgram) + '</button></tr></table></td><td valign="top">' + mazepage.toolbox(null, null, opt_ijData) + '<iframe src="frame.html?' + soy.$$escapeHtml(opt_ijData.frameSrc) + '"></iframe></td></tr></table>';
};


mazepage.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none"><block type="maze_lamp"></block><block type="start"></block><block type="end"></block></xml>';
};
