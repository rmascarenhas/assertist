// assertisc('ampersand.js', function(test) {
//    test.group('bind', function() {
//      var x = 10;
//
//      test.assert(x == 10, 'x equals 10');
//      test.assert(x != 12, 'x is not 12');
//    });
// });

(function() {
  var assertisc = window.assertisc = function(project, tests) {
    // The container in which the test results will be rendered.
    var globalContainer = document.createElement('div');
    globalContainer.id = 'assertisc';

    // The number of test groups in the test suite. Used mainly to construct unique
    // test group identifiers, making for faster element querying the displaying the
    // results.
    var groupCounter = 0;

    // Internal: creates the base DOM hierarchy in the page in which the test
    // results will be rendered. The structure is as follows:
    //
    //  <div class="container">
    //    <h1>Title</h1>
    //
    //    <div id="assertisc">
    //    </div>
    //  </div>
    var createBaseHierarchy = function() {
      var container = document.createElement('div'),
          titleEl   = document.createElement('h1'),
          heading   = document.createTextNode(project);

      titleEl.appendChild(heading);

      container.classList.add('container');

      container.appendChild(titleEl);
      container.appendChild(globalContainer);

      document.body.appendChild(container);
    };

    // Internal: creates the DOM representation for a new test group.
    //
    // descritpion - the description for the test block.
    //
    // Created DOM structure:
    //
    //    <div class="test-group">
    //      <h2>Description</h2>
    //
    //      <ul id="group-1" class="results">
    //      </ul>
    //    </div>
    var newTestGroup = function(description) {
      var groupWrapper   = document.createElement('div'),
          titleText      = document.createTextNode(description),
          groupTitle     = document.createElement('h2'),
          resultsWrapper = document.createElement('ul');

      groupCounter++;

      groupWrapper.classList.add('test-group');
      resultsWrapper.classList.add('results');
      resultsWrapper.id = 'group-' + groupCounter;

      groupTitle.appendChild(titleText);
      groupWrapper.appendChild(groupTitle);
      groupWrapper.appendChild(resultsWrapper);

      globalContainer.appendChild(groupWrapper);
    };

    // Public: Runs a test group with the given name.
    //
    // name  - the name of the test group. Usually the name of the method being tested.
    // tests - a function with tests and assertions.
    //
    // Example
    //
    //    group('bind method', function() {
    //      // tests...
    //    });
    var testGroup = function(name, tests) {
      newTestGroup(name);
      tests();
    };

    // Internal: returns the container element
    var currentResultContainer = function() {
      return document.getElementById('group-' + groupCounter);
    };

    // Internal: builds the DOM structure for the a test result.
    //
    // description - the test description.
    //
    // The created structure is as follows:
    //
    //    <li class="result">Description</li>
    var buildNewResult = function(description) {
      var result = document.createElement('li'),
          descriptionEl = document.createTextNode(description);

      result.classList.add('result');
      result.appendChild(descriptionEl);

      return result;
    };

    // Internal: builds a specialized (success or failure) test result.
    //
    // type        - the result of the test (`success` or `failure`).
    // descritpion - the test description.
    var newResult = function(type, description) {
      var container = currentResultContainer(),
          result    = buildNewResult(description);

      result.classList.add(type);
      container.appendChild(result);
    };

    // Public: Tests the given expression and outputs the result.
    //
    // expression - the expression that should be tested.
    // description - a description for the intent for that test.
    //
    // Example
    //
    //    assert(1 == 1, 'integer comparison works');
    var assert = function(expression, description) {
      if (expression) {
        newResult('success', description);
      } else {
        newResult('failure', description);
      }

      return expression;
    };

    // The `test` object to be passed to the tests function so that it can have
    // access to `group` and `assert` functions.
    var testObject = {
      group: testGroup,
      assert: assert
    };

    createBaseHierarchy();
    tests(testObject);
  };
})();
