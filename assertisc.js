(function() {
  var globalContainer = document.getElementById('assertisc');

  window.assert = function(expression, description) {
    var container = document.createElement('div'),
        result    = document.createElement('li'),
        text      = document.createTextNode(description),
        title     = document.createTextNode('Test group'),
        titleEl   = document.createElement('h2');

    container.classList.add('test-group');

    titleEl.appendChild(title);
    container.appendChild(titleEl);

    result.appendChild(text);
    result.classList.add('result');

    if (expression) {
      result.classList.add('success');
    } else {
      result.classList.add('failure');
    }

    container.appendChild(result);
    globalContainer.appendChild(container);

    return expression;
  };
})();
