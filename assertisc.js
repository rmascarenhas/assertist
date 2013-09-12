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
    //    <div class="test-metadata">
    //      <span class="user-agent"><!-- User agent information --></span>
    //      <span class="test-timing"><!-- test timing info --></div>
    //    </div>
    //
    //    <div id="assertisc">
    //    </div>
    //  </div>
    function createBaseHierarchy() {
      var container = document.createElement('div'),
          metadata  = document.createElement('div'),
          userAgent = document.createElement('span'),
          timing    = document.createElement('span'),
          uaInfo    = document.createTextNode(navigator.userAgent),
          titleEl   = document.createElement('h1'),
          heading   = document.createTextNode(project);

      titleEl.appendChild(heading);
      userAgent.appendChild(uaInfo);

      timing.id = 'test-timing';

      container.classList.add('container');
      metadata.classList.add('test-metadata');
      userAgent.classList.add('user-agent');

      metadata.appendChild(userAgent);
      metadata.appendChild(timing);
      container.appendChild(titleEl);
      container.appendChild(metadata);
      container.appendChild(globalContainer);

      document.body.appendChild(container);
    }

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
    function newTestGroup(description) {
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
    }

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
    function testGroup(name, tests) {
      newTestGroup(name);
      tests();
    }

    // Internal: returns the container element
    function currentResultContainer() {
      return document.getElementById('group-' + groupCounter);
    }

    // Internal: builds the DOM structure for the a test result.
    //
    // description - the test description.
    //
    // The created structure is as follows:
    //
    //    <li class="result">Description</li>
    function buildNewResult(description) {
      var result = document.createElement('li'),
          descriptionEl = document.createTextNode(description);

      result.classList.add('result');
      result.appendChild(descriptionEl);

      return result;
    }

    // Internal: builds a specialized (success or failure) test result.
    //
    // type        - the result of the test (`success` or `failure`).
    // descritpion - the test description.
    function newResult(type, description) {
      var container = currentResultContainer(),
          result    = buildNewResult(description);

      result.classList.add(type);
      container.appendChild(result);
    }

    // Internal: calculates the time to run a given function, and updates the timing container.
    //
    // work - the function to be measured.
    //
    // This will calculate the time to run the `work` parameter and updates the `test-timing`
    // element with the calculated time, in seconds.
    function calculating_time(work) {
      var start = new Date();
      work();
      var end = new Date();

      var elapsedTime = (end - start) / 1000;

      var timeEl   = document.getElementById('test-timing'),
          timeInfo = document.createTextNode('Run in ' + elapsedTime.toFixed(4) + ' seconds');

      timeEl.appendChild(timeInfo);
    }

    // Public: Tests the given expression and outputs the result.
    //
    // expression - the expression that should be tested.
    // description - a description for the intent for that test.
    //
    // Example
    //
    //    assert(1 == 1, 'integer comparison works');
    function assert(expression, description) {
      if (expression) {
        newResult('success', description);
      } else {
        newResult('failure', description);
      }

      return expression;
    }

    // The `test` object to be passed to the tests function so that it can have
    // access to `group` and `assert` functions.
    var testObject = {
      group: testGroup,
      assert: assert
    }

    calculating_time(function() {
      createBaseHierarchy();
      tests(testObject);
    });
  };
})();
