// assertist('ampersand.js', function(test) {
//    test.group('bind', function() {
//      var x = 10;
//
//      test.assert(x == 10, 'x equals 10');
//      test.assert(x != 12, 'x is not 12');
//    });
// });

(function() {
  var assertist = window.assertist = function(project, tests) {
    // The container in which the test results will be rendered.
    var globalContainer = document.createElement('div');
    globalContainer.id = 'assertist';

    // The number of test groups in the test suite. Used mainly to construct unique
    // test group identifiers, making for faster element querying the displaying the
    // results.
    var groupCounter = 0,
        successes    = 0,
        failures     = 0;

    // Internal: creates the base DOM hierarchy in the page in which the test
    // results will be rendered. The structure is as follows:
    //
    //  <div class="container">
    //    <h1>Title</h1>
    //    <div class="test-metadata">
    //      <span class="user-agent"><!-- User agent information --></span>
    //      <span id="test-timing"><!-- test timing info --></span>
    //      <div id="test-results"><!-- results --></div>
    //    </div>
    //
    //    <div id="assertist">
    //    </div>
    //  </div>
    function createBaseHierarchy() {
      var container = document.createElement('div'),
          metadata  = document.createElement('div'),
          userAgent = document.createElement('span'),
          timing    = document.createElement('span'),
          results   = document.createElement('div'),
          uaInfo    = document.createTextNode(navigator.userAgent),
          titleEl   = document.createElement('h1'),
          heading   = document.createTextNode(project);

      titleEl.appendChild(heading);
      userAgent.appendChild(uaInfo);

      timing.id  = 'test-timing';
      results.id = 'test-results';

      container.classList.add('container');
      metadata.classList.add('test-metadata');

      userAgent.classList.add('metadata-row');
      timing.classList.add('metadata-row');

      metadata.appendChild(userAgent);
      metadata.appendChild(timing);
      metadata.appendChild(results);
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

    // InternalexecuteTests builds the DOM structure for the a test result.
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
    function calculatingTime(work) {
      var start = new Date();
      work();
      var end = new Date();

      var elapsedTime = (end - start) / 1000;

      var timeEl   = document.getElementById('test-timing'),
          timeInfo = document.createTextNode('Run in ' + elapsedTime.toFixed(4) + ' seconds');

      timeEl.appendChild(timeInfo);
    }

    // Internal: adds results information to the `test-results` element.
    //
    // The summary has the format:
    //    20 passed | 3 failed
    function addTestSummary() {
      var resultsEl  = document.getElementById('test-results');

      if (failures === 0) {
        var congratsEl   = document.createElement('span'),
            congratsInfo = document.createTextNode('Everything has passed! Yay!');

        congratsEl.classList.add('success-light-bg');
        congratsEl.appendChild(congratsInfo);

        resultsEl.appendChild(congratsEl);

      } else {
        var passEl     = document.createElement('span'),
            failureEl  = document.createElement('span'),
            passInfo   = document.createTextNode(successes + ' passed'),
            failreInfo = document.createTextNode(failures + ' failed'),
            separator  = document.createTextNode(' | ');

        passEl.classList.add('success-light-bg');
        failureEl.classList.add('failure');

        passEl.appendChild(passInfo);
        failureEl.appendChild(failreInfo);

        resultsEl.appendChild(passEl);
        resultsEl.appendChild(separator);
        resultsEl.appendChild(failureEl);
      }
    }

    // Internal: actually executes the passed `tests`, adding timing and results.
    //
    // tests - the function to be executed, which will run the tests.
    function executeTests(tests) {
      calculatingTime(tests);
      addTestSummary();
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
        successes++;
      } else {
        newResult('failure', description);
        failures++;
      }

      return expression;
    }

    // The `test` object to be passed to the tests function so that it can have
    // access to `group` and `assert` functions.
    var testObject = {
      group: testGroup,
      assert: assert
    }

    createBaseHierarchy();
    executeTests(function() { tests(testObject); });
  };
})();
