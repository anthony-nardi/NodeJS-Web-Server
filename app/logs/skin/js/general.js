'use strict';

document.addEventListener('DOMContentLoaded', function () {

  if (!window.logs) {
    console.log(window.logs);
  } else {
    console.log('Logs found: %o', window.logs);

    var parentElement = document.getElementById('content'),
        logs = window.logs,
        logCount = logs.length,
        i = 0, k = 0,
        moduleName,
        date,
        niceMessage,
        origMessage,
        log,
        logRows;

    // For every log:
    //  1) Create a row
    //  2) Create a column for every property of each log
    for (; i < logCount; i++) {
      log = logs[i];
      moduleName = log.modulename;
      date = log.date;
      niceMessage = log.nice_message;
      origMessage = log.orig_message;
      parentElement.appendChild(getLogHTML(moduleName, niceMessage, origMessage, date));
    }

    logRows = document.getElementsByClassName('logRow');

    for (; k < logRows.length; k++) {
      logRows[k].addEventListener('click', toggleMessage);
    }


  }

});

function createDiv () {
  return document.createElement('div');
}

function createTextNode (string) {
  return document.createTextNode(string);
}

function getLogHTML (moduleName, niceMessage, origMessage, date) {

  var rowDiv               = createDiv(),
      moduleNameColumnDiv  = createDiv(),
      niceMessageColumnDiv = createDiv(),
      origMessageColumnDiv = createDiv(),
      dateColumnDiv        = createDiv(),
      moduleNameTextNode   = createTextNode(moduleName),
      niceMessageTextNode  = createTextNode(niceMessage),
      origMessageTextNode  = createTextNode(origMessage),
      dateTextNode         = createTextNode(Date(date));

  rowDiv.className               = 'row logRow';
  moduleNameColumnDiv.className  = 'col-md-2 col-xs-2';
  niceMessageColumnDiv.className = 'col-md-8 col-xs-8 niceMessage';
  origMessageColumnDiv.className = 'col-md-8 col-xs-8 hidden origMessage';
  dateColumnDiv.className        = 'col-md-2 col-xs-2';

  moduleNameColumnDiv.appendChild(moduleNameTextNode);
  niceMessageColumnDiv.appendChild(niceMessageTextNode);
  origMessageColumnDiv.appendChild(origMessageTextNode);
  dateColumnDiv.appendChild(dateTextNode);

  rowDiv.appendChild(moduleNameColumnDiv);
  rowDiv.appendChild(niceMessageColumnDiv);
  rowDiv.appendChild(origMessageColumnDiv);
  rowDiv.appendChild(dateColumnDiv);

  return rowDiv;

}

function toggleMessage (event) {

  var rowClicked = event.currentTarget,
      niceMessage = rowClicked.getElementsByClassName('niceMessage')[0],
      origMessage = rowClicked.getElementsByClassName('origMessage')[0];

  if (niceMessage.className.indexOf('hidden') === -1) {
    niceMessage.className = niceMessage.className + ' hidden';
    origMessage.className = origMessage.className.replace('hidden', '');
  } else {
    origMessage.className = origMessage.className + ' hidden';
    niceMessage.className = niceMessage.className.replace('hidden', '');
  }

}