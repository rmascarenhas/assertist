(function() {
  var container = document.getElementById('assertisc');

  window.assert = function(expression, description) {
    var result = document.createElement('li'),
        text   = document.createTextNode(description);

    result.appendChild(text);

    if (expression) {
      result.classList.add('success');
    } else {
      result.classList.add('failure');
    }

    container.appendChild(result);

    return expression;
  };
})();
