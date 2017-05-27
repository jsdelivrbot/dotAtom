function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var path = _interopRequireWildcard(_path);

// eslint-disable-next-line import/no-extraneous-dependencies

var _jasmineFix = require('jasmine-fix');

// NOTE: If using fit you must add it to the list above!

var _ = require('..');

var lint = _interopRequireWildcard(_);

'use babel';

var validPath = path.join(__dirname, 'fixtures', 'definition-use-valid.md');
var invalidPath = path.join(__dirname, 'fixtures', 'definition-use-invalid.md');

describe('The remark-lint provider for Linter', function () {
  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    atom.workspace.destroyActivePaneItem();
    yield atom.packages.activatePackage('linter-markdown');
    yield atom.packages.activatePackage('language-gfm');
  }));

  describe('checks a file with issues and', function () {
    var editor = null;
    (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
      editor = yield atom.workspace.open(invalidPath);
    }));

    (0, _jasmineFix.it)('finds at least one message', _asyncToGenerator(function* () {
      var messages = yield lint.provideLinter().lint(editor);
      expect(messages.length).toBeGreaterThan(0);
    }));

    (0, _jasmineFix.it)('verifies the first message', _asyncToGenerator(function* () {
      var messages = yield lint.provideLinter().lint(editor);
      expect(messages[0].severity).toBe('warning');
      expect(messages[0].location.file).toBe(invalidPath);
      expect(messages[0].location.position).toEqual([[2, 0], [2, 58]]);
      expect(messages[0].description).not.toBeDefined();
      expect(messages[0].excerpt).toBe('Found unused definition (remark-lint:no-unused-definitions)');
    }));
  });

  (0, _jasmineFix.it)('finds nothing wrong with a valid file', _asyncToGenerator(function* () {
    var editor = yield atom.workspace.open(validPath);
    var messages = yield lint.provideLinter().lint(editor);
    expect(messages.length).toBe(0);
  }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXItbWFya2Rvd24vc3BlYy9saW50ZXItbWFya2Rvd24tc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O29CQUVzQixNQUFNOztJQUFoQixJQUFJOzs7OzBCQUVlLGFBQWE7Ozs7Z0JBR3RCLElBQUk7O0lBQWQsSUFBSTs7QUFQaEIsV0FBVyxDQUFDOztBQVNaLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBQzlFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDOztBQUVsRixRQUFRLENBQUMscUNBQXFDLEVBQUUsWUFBTTtBQUNwRCxnREFBVyxhQUFZO0FBQ3JCLFFBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUN2QyxVQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkQsVUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztHQUNyRCxFQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLCtCQUErQixFQUFFLFlBQU07QUFDOUMsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLGtEQUFXLGFBQVk7QUFDckIsWUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDakQsRUFBQyxDQUFDOztBQUVILHdCQUFHLDRCQUE0QixvQkFBRSxhQUFZO0FBQzNDLFVBQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6RCxZQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1QyxFQUFDLENBQUM7O0FBRUgsd0JBQUcsNEJBQTRCLG9CQUFFLGFBQVk7QUFDM0MsVUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pELFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwRCxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbEQsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsNkRBQTZELENBQUMsQ0FBQztLQUNqRyxFQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsc0JBQUcsdUNBQXVDLG9CQUFFLGFBQVk7QUFDdEQsUUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwRCxRQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDakMsRUFBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXItbWFya2Rvd24vc3BlYy9saW50ZXItbWFya2Rvd24tc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgaXQgfSBmcm9tICdqYXNtaW5lLWZpeCc7XG4vLyBOT1RFOiBJZiB1c2luZyBmaXQgeW91IG11c3QgYWRkIGl0IHRvIHRoZSBsaXN0IGFib3ZlIVxuXG5pbXBvcnQgKiBhcyBsaW50IGZyb20gJy4uJztcblxuY29uc3QgdmFsaWRQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzJywgJ2RlZmluaXRpb24tdXNlLXZhbGlkLm1kJyk7XG5jb25zdCBpbnZhbGlkUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdkZWZpbml0aW9uLXVzZS1pbnZhbGlkLm1kJyk7XG5cbmRlc2NyaWJlKCdUaGUgcmVtYXJrLWxpbnQgcHJvdmlkZXIgZm9yIExpbnRlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKCk7XG4gICAgYXdhaXQgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xpbnRlci1tYXJrZG93bicpO1xuICAgIGF3YWl0IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1nZm0nKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NoZWNrcyBhIGZpbGUgd2l0aCBpc3N1ZXMgYW5kJywgKCkgPT4ge1xuICAgIGxldCBlZGl0b3IgPSBudWxsO1xuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgZWRpdG9yID0gYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihpbnZhbGlkUGF0aCk7XG4gICAgfSk7XG5cbiAgICBpdCgnZmluZHMgYXQgbGVhc3Qgb25lIG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQucHJvdmlkZUxpbnRlcigpLmxpbnQoZWRpdG9yKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKTtcbiAgICB9KTtcblxuICAgIGl0KCd2ZXJpZmllcyB0aGUgZmlyc3QgbWVzc2FnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludC5wcm92aWRlTGludGVyKCkubGludChlZGl0b3IpO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLnNldmVyaXR5KS50b0JlKCd3YXJuaW5nJyk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24uZmlsZSkudG9CZShpbnZhbGlkUGF0aCk7XG4gICAgICBleHBlY3QobWVzc2FnZXNbMF0ubG9jYXRpb24ucG9zaXRpb24pLnRvRXF1YWwoW1syLCAwXSwgWzIsIDU4XV0pO1xuICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmRlc2NyaXB0aW9uKS5ub3QudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChtZXNzYWdlc1swXS5leGNlcnB0KS50b0JlKCdGb3VuZCB1bnVzZWQgZGVmaW5pdGlvbiAocmVtYXJrLWxpbnQ6bm8tdW51c2VkLWRlZmluaXRpb25zKScpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgdmFsaWQgZmlsZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKHZhbGlkUGF0aCk7XG4gICAgY29uc3QgbWVzc2FnZXMgPSBhd2FpdCBsaW50LnByb3ZpZGVMaW50ZXIoKS5saW50KGVkaXRvcik7XG4gICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKTtcbiAgfSk7XG59KTtcbiJdfQ==