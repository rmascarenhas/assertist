# assertist

A very simple JavaScript testing library.

### Usage

Specs for a project can be grouped in sets, so that every test related to a
specific feature can be analyzed together.

~~~javascript
assertist('my_project.js', function(test) {
   test.group('bind', function() {
     var x = 10;

     test.assert(x == 10, 'x equals 10');
     test.assert(x != 12, 'x is not 12');
   });
});
~~~

### Test output

![assertist test output](https://cloud.githubusercontent.com/assets/613784/5038414/4ed6d0a0-6b77-11e4-8eb0-dae8ecc2ae99.png)

### Status

This is a toy project, built with the intent to learn (as suggested in the
_Secrets of the JavaScript Ninja_ book).

### License

MIT. See `LICENSE` file.
