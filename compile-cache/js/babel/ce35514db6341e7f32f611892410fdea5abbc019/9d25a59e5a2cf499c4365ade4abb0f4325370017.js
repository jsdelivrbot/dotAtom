Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getConfigFile = getConfigFile;
exports.shouldTriggerLinter = shouldTriggerLinter;
exports.getEditorCursorScopes = getEditorCursorScopes;
exports.isPathIgnored = isPathIgnored;
exports.subscriptiveObserve = subscriptiveObserve;
exports.messageKey = messageKey;
exports.normalizeMessages = normalizeMessages;
exports.messageKeyLegacy = messageKeyLegacy;
exports.normalizeMessagesLegacy = normalizeMessagesLegacy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _lodashUniq = require('lodash.uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

var _sbConfigFile = require('sb-config-file');

var _sbConfigFile2 = _interopRequireDefault(_sbConfigFile);

var _atom = require('atom');

var $version = '__$sb_linter_version';
exports.$version = $version;
var $activated = '__$sb_linter_activated';
exports.$activated = $activated;
var $requestLatest = '__$sb_linter_request_latest';
exports.$requestLatest = $requestLatest;
var $requestLastReceived = '__$sb_linter_request_last_received';

exports.$requestLastReceived = $requestLastReceived;
var LINTER_CONFIG_FILE_PATH = _path2['default'].join(atom.getConfigDirPath(), 'linter-config.json');
exports.LINTER_CONFIG_FILE_PATH = LINTER_CONFIG_FILE_PATH;
var LINTER_CONFIG_FILE_DEFAULT = {
  disabled: [],
  greeter: {
    shown: []
  }
};
exports.LINTER_CONFIG_FILE_DEFAULT = LINTER_CONFIG_FILE_DEFAULT;
var LINTER_CONFIG_FILE_OPTIONS = {
  prettyPrint: true,
  createIfNonExistent: false
};
exports.LINTER_CONFIG_FILE_OPTIONS = LINTER_CONFIG_FILE_OPTIONS;

function getConfigFile() {
  return _sbConfigFile2['default'].get(LINTER_CONFIG_FILE_PATH, LINTER_CONFIG_FILE_DEFAULT, LINTER_CONFIG_FILE_OPTIONS);
}

function shouldTriggerLinter(linter, wasTriggeredOnChange, scopes) {
  if (wasTriggeredOnChange && !(linter[$version] === 2 ? linter.lintsOnChange : linter.lintOnFly)) {
    return false;
  }
  return scopes.some(function (scope) {
    return linter.grammarScopes.includes(scope);
  });
}

function getEditorCursorScopes(textEditor) {
  return (0, _lodashUniq2['default'])(textEditor.getCursors().reduce(function (scopes, cursor) {
    return scopes.concat(cursor.getScopeDescriptor().getScopesArray());
  }, ['*']));
}

function isPathIgnored(filePath, ignoredGlob, ignoredVCS) {
  if (ignoredVCS) {
    var repository = null;
    var projectPaths = atom.project.getPaths();
    for (var i = 0, _length2 = projectPaths.length; i < _length2; ++i) {
      var projectPath = projectPaths[i];
      if (filePath.indexOf(projectPath) === 0) {
        repository = atom.project.getRepositories()[i];
        break;
      }
    }
    if (repository && repository.isPathIgnored(filePath)) {
      return true;
    }
  }
  var normalizedFilePath = process.platform === 'win32' ? filePath.replace(/\\/g, '/') : filePath;
  return (0, _minimatch2['default'])(normalizedFilePath, ignoredGlob);
}

function subscriptiveObserve(object, eventName, callback) {
  var subscription = null;
  var eventSubscription = object.observe(eventName, function (props) {
    if (subscription) {
      subscription.dispose();
    }
    subscription = callback.call(this, props);
  });

  return new _atom.Disposable(function () {
    eventSubscription.dispose();
    if (subscription) {
      subscription.dispose();
    }
  });
}

function messageKey(message) {
  var reference = message.reference;
  return ['$LINTER:' + message.linterName, '$LOCATION:' + message.location.file + '$' + message.location.position.start.row + '$' + message.location.position.start.column + '$' + message.location.position.end.row + '$' + message.location.position.end.column, reference ? '$REFERENCE:' + reference.file + '$' + (reference.position ? reference.position.row + '$' + reference.position.column : '') : '$REFERENCE:null', '$EXCERPT:' + message.excerpt, '$SEVERITY:' + message.severity, message.icon ? '$ICON:' + message.icon : '$ICON:null', message.url ? '$URL:' + message.url : '$URL:null'].join('');
}

function normalizeMessages(linterName, messages) {
  for (var i = 0, _length3 = messages.length; i < _length3; ++i) {
    var message = messages[i];
    var reference = message.reference;
    if (Array.isArray(message.location.position)) {
      message.location.position = _atom.Range.fromObject(message.location.position);
    }
    if (reference && Array.isArray(reference.position)) {
      reference.position = _atom.Point.fromObject(reference.position);
    }
    if (message.solutions && message.solutions.length) {
      for (var j = 0, _length = message.solutions.length, solution = undefined; j < _length; j++) {
        solution = message.solutions[j];
        if (Array.isArray(solution.position)) {
          solution.position = _atom.Range.fromObject(solution.position);
        }
      }
    }
    message.version = 2;
    message.linterName = linterName;
    message.key = messageKey(message);
  }
}

function messageKeyLegacy(message) {
  return ['$LINTER:' + message.linterName, '$LOCATION:' + (message.filePath || '') + '$' + (message.range ? message.range.start.row + '$' + message.range.start.column + '$' + message.range.end.row + '$' + message.range.end.column : ''), '$TEXT:' + (message.text || ''), '$HTML:' + (message.html || ''), '$SEVERITY:' + message.severity, '$TYPE:' + message.type, '$CLASS:' + (message['class'] || '')].join('');
}

function normalizeMessagesLegacy(linterName, messages) {
  for (var i = 0, _length4 = messages.length; i < _length4; ++i) {
    var message = messages[i];
    var fix = message.fix;
    if (message.range && message.range.constructor.name === 'Array') {
      message.range = _atom.Range.fromObject(message.range);
    }
    if (fix && fix.range.constructor.name === 'Array') {
      fix.range = _atom.Range.fromObject(fix.range);
    }
    if (!message.severity) {
      var type = message.type.toLowerCase();
      if (type === 'warning') {
        message.severity = type;
      } else if (type === 'info' || type === 'trace') {
        message.severity = 'info';
      } else {
        message.severity = 'error';
      }
    }
    message.version = 1;
    message.linterName = linterName;
    message.key = messageKeyLegacy(message);

    if (message.trace) {
      normalizeMessagesLegacy(linterName, message.trace);
    }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O29CQUVpQixNQUFNOzs7O3lCQUNELFdBQVc7Ozs7MEJBQ1QsYUFBYTs7Ozs0QkFDZCxnQkFBZ0I7Ozs7b0JBQ0UsTUFBTTs7QUFJeEMsSUFBTSxRQUFRLEdBQUcsc0JBQXNCLENBQUE7O0FBQ3ZDLElBQU0sVUFBVSxHQUFHLHdCQUF3QixDQUFBOztBQUMzQyxJQUFNLGNBQWMsR0FBRyw2QkFBNkIsQ0FBQTs7QUFDcEQsSUFBTSxvQkFBb0IsR0FBRyxvQ0FBb0MsQ0FBQTs7O0FBR2pFLElBQU0sdUJBQXVCLEdBQUcsa0JBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUE7O0FBQ3hGLElBQU0sMEJBQTBCLEdBQUc7QUFDeEMsVUFBUSxFQUFFLEVBQUU7QUFDWixTQUFPLEVBQUU7QUFDUCxTQUFLLEVBQUUsRUFBRTtHQUNWO0NBQ0YsQ0FBQTs7QUFDTSxJQUFNLDBCQUEwQixHQUFHO0FBQ3hDLGFBQVcsRUFBRSxJQUFJO0FBQ2pCLHFCQUFtQixFQUFFLEtBQUs7Q0FDM0IsQ0FBQTs7O0FBQ00sU0FBUyxhQUFhLEdBQXdCO0FBQ25ELFNBQU8sMEJBQVcsR0FBRyxDQUFDLHVCQUF1QixFQUFFLDBCQUEwQixFQUFFLDBCQUEwQixDQUFDLENBQUE7Q0FDdkc7O0FBRU0sU0FBUyxtQkFBbUIsQ0FDakMsTUFBYyxFQUNkLG9CQUE2QixFQUM3QixNQUFxQixFQUNaO0FBQ1QsTUFBSSxvQkFBb0IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFBLEFBQUMsRUFBRTtBQUMvRixXQUFPLEtBQUssQ0FBQTtHQUNiO0FBQ0QsU0FBTyxNQUFNLENBQUMsSUFB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TyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDL0IsV0FBTyxDQUFDLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFdkMsUUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ2pCLDZCQUF1QixDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDbkQ7R0FDRjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgYXJyYXlVbmlxdWUgZnJvbSAnbG9kYXNoLnVuaXEnXG5pbXBvcnQgQ29uZmlnRmlsZSBmcm9tICdzYi1jb25maWctZmlsZSdcbmltcG9ydCB7IERpc3Bvc2FibGUsIFJhbmdlLCBQb2ludCB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIE1lc3NhZ2UsIE1lc3NhZ2VMZWdhY3kgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgJHZlcnNpb24gPSAnX18kc2JfbGludGVyX3ZlcnNpb24nXG5leHBvcnQgY29uc3QgJGFjdGl2YXRlZCA9ICdfXyRzYl9saW50ZXJfYWN0aXZhdGVkJ1xuZXhwb3J0IGNvbnN0ICRyZXF1ZXN0TGF0ZXN0ID0gJ19fJHNiX2xpbnRlcl9yZXF1ZXN0X2xhdGVzdCdcbmV4cG9ydCBjb25zdCAkcmVxdWVzdExhc3RSZWNlaXZlZCA9ICdfXyRzYl9saW50ZXJfcmVxdWVzdF9sYXN0X3JlY2VpdmVkJ1xuXG5cbmV4cG9ydCBjb25zdCBMSU5URVJfQ09ORklHX0ZJTEVfUEFUSCA9IFBhdGguam9pbihhdG9tLmdldENvbmZpZ0RpclBhdGgoKSwgJ2xpbnRlci1jb25maWcuanNvbicpXG5leHBvcnQgY29uc3QgTElOVEVSX0NPTkZJR19GSUxFX0RFRkFVTFQgPSB7XG4gIGRpc2FibGVkOiBbXSxcbiAgZ3JlZXRlcjoge1xuICAgIHNob3duOiBbXSxcbiAgfSxcbn1cbmV4cG9ydCBjb25zdCBMSU5URVJfQ09ORklHX0ZJTEVfT1BUSU9OUyA9IHtcbiAgcHJldHR5UHJpbnQ6IHRydWUsXG4gIGNyZWF0ZUlmTm9uRXhpc3RlbnQ6IGZhbHNlLFxufVxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZ0ZpbGUoKTogUHJvbWlzZTxDb25maWdGaWxlPiB7XG4gIHJldHVybiBDb25maWdGaWxlLmdldChMSU5URVJfQ09ORklHX0ZJTEVfUEFUSCwgTElOVEVSX0NPTkZJR19GSUxFX0RFRkFVTFQsIExJTlRFUl9DT05GSUdfRklMRV9PUFRJT05TKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkVHJpZ2dlckxpbnRlcihcbiAgbGludGVyOiBMaW50ZXIsXG4gIHdhc1RyaWdnZXJlZE9uQ2hhbmdlOiBib29sZWFuLFxuICBzY29wZXM6IEFycmF5PHN0cmluZz5cbik6IGJvb2xlYW4ge1xuICBpZiAod2FzVHJpZ2dlcmVkT25DaGFuZ2UgJiYgIShsaW50ZXJbJHZlcnNpb25dID09PSAyID8gbGludGVyLmxpbnRzT25DaGFuZ2UgOiBsaW50ZXIubGludE9uRmx5KSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBzY29wZXMuc29tZShmdW5jdGlvbihzY29wZSkge1xuICAgIHJldHVybiBsaW50ZXIuZ3JhbW1hclNjb3Blcy5pbmNsdWRlcyhzY29wZSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVkaXRvckN1cnNvclNjb3Blcyh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogQXJyYXk8c3RyaW5nPiB7XG4gIHJldHVybiBhcnJheVVuaXF1ZSh0ZXh0RWRpdG9yLmdldEN1cnNvcnMoKS5yZWR1Y2UoKHNjb3BlcywgY3Vyc29yKSA9PiAoXG4gICAgc2NvcGVzLmNvbmNhdChjdXJzb3IuZ2V0U2NvcGVEZXNjcmlwdG9yKCkuZ2V0U2NvcGVzQXJyYXkoKSlcbiAgKSwgWycqJ10pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQYXRoSWdub3JlZChmaWxlUGF0aDogc3RyaW5nLCBpZ25vcmVkR2xvYjogc3RyaW5nLCBpZ25vcmVkVkNTOiBib29sZWFuKTogYm9vbGVhbiB7XG4gIGlmIChpZ25vcmVkVkNTKSB7XG4gICAgbGV0IHJlcG9zaXRvcnkgPSBudWxsXG4gICAgY29uc3QgcHJvamVjdFBhdGhzID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcHJvamVjdFBhdGhzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IHByb2plY3RQYXRoc1tpXVxuICAgICAgaWYgKGZpbGVQYXRoLmluZGV4T2YocHJvamVjdFBhdGgpID09PSAwKSB7XG4gICAgICAgIHJlcG9zaXRvcnkgPSBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbaV1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlcG9zaXRvcnkgJiYgcmVwb3NpdG9yeS5pc1BhdGhJZ25vcmVkKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgY29uc3Qgbm9ybWFsaXplZEZpbGVQYXRoID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/IGZpbGVQYXRoLnJlcGxhY2UoL1xcXFwvZywgJy8nKSA6IGZpbGVQYXRoXG4gIHJldHVybiBtaW5pbWF0Y2gobm9ybWFsaXplZEZpbGVQYXRoLCBpZ25vcmVkR2xvYilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1YnNjcmlwdGl2ZU9ic2VydmUob2JqZWN0OiBPYmplY3QsIGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgbGV0IHN1YnNjcmlwdGlvbiA9IG51bGxcbiAgY29uc3QgZXZlbnRTdWJzY3JpcHRpb24gPSBvYmplY3Qub2JzZXJ2ZShldmVudE5hbWUsIGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIH1cbiAgICBzdWJzY3JpcHRpb24gPSBjYWxsYmFjay5jYWxsKHRoaXMsIHByb3BzKVxuICB9KVxuXG4gIHJldHVybiBuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICBldmVudFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZUtleShtZXNzYWdlOiBNZXNzYWdlKSB7XG4gIGNvbnN0IHJlZmVyZW5jZSA9IG1lc3NhZ2UucmVmZXJlbmNlXG4gIHJldHVybiBbXG4gICAgYCRMSU5URVI6JHttZXNzYWdlLmxpbnRlck5hbWV9YCxcbiAgICBgJExPQ0FUSU9OOiR7bWVzc2FnZS5sb2NhdGlvbi5maWxlfSQke21lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24uc3RhcnQucm93fSQke21lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24uc3RhcnQuY29sdW1ufSQke21lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24uZW5kLnJvd30kJHttZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uLmVuZC5jb2x1bW59YCxcbiAgICByZWZlcmVuY2UgPyBgJFJFRkVSRU5DRToke3JlZmVyZW5jZS5maWxlfSQke3JlZmVyZW5jZS5wb3NpdGlvbiA/IGAke3JlZmVyZW5jZS5wb3NpdGlvbi5yb3d9JCR7cmVmZXJlbmNlLnBvc2l0aW9uLmNvbHVtbn1gIDogJyd9YCA6ICckUkVGRVJFTkNFOm51bGwnLFxuICAgIGAkRVhDRVJQVDoke21lc3NhZ2UuZXhjZXJwdH1gLFxuICAgIGAkU0VWRVJJVFk6JHttZXNzYWdlLnNldmVyaXR5fWAsXG4gICAgbWVzc2FnZS5pY29uID8gYCRJQ09OOiR7bWVzc2FnZS5pY29ufWAgOiAnJElDT046bnVsbCcsXG4gICAgbWVzc2FnZS51cmwgPyBgJFVSTDoke21lc3NhZ2UudXJsfWAgOiAnJFVSTDpudWxsJyxcbiAgXS5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplTWVzc2FnZXMobGludGVyTmFtZTogc3RyaW5nLCBtZXNzYWdlczogQXJyYXk8TWVzc2FnZT4pIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IG1lc3NhZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VzW2ldXG4gICAgY29uc3QgcmVmZXJlbmNlID0gbWVzc2FnZS5yZWZlcmVuY2VcbiAgICBpZiAoQXJyYXkuaXNBcnJheShtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uKSkge1xuICAgICAgbWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbiA9IFJhbmdlLmZyb21PYmplY3QobWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbilcbiAgICB9XG4gICAgaWYgKHJlZmVyZW5jZSAmJiBBcnJheS5pc0FycmF5KHJlZmVyZW5jZS5wb3NpdGlvbikpIHtcbiAgICAgIHJlZmVyZW5jZS5wb3NpdGlvbiA9IFBvaW50LmZyb21PYmplY3QocmVmZXJlbmNlLnBvc2l0aW9uKVxuICAgIH1cbiAgICBpZiAobWVzc2FnZS5zb2x1dGlvbnMgJiYgbWVzc2FnZS5zb2x1dGlvbnMubGVuZ3RoKSB7XG4gICAgICBmb3IgKGxldCBqID0gMCwgX2xlbmd0aCA9IG1lc3NhZ2Uuc29sdXRpb25zLmxlbmd0aCwgc29sdXRpb247IGogPCBfbGVuZ3RoOyBqKyspIHtcbiAgICAgICAgc29sdXRpb24gPSBtZXNzYWdlLnNvbHV0aW9uc1tqXVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzb2x1dGlvbi5wb3NpdGlvbikpIHtcbiAgICAgICAgICBzb2x1dGlvbi5wb3NpdGlvbiA9IFJhbmdlLmZyb21PYmplY3Qoc29sdXRpb24ucG9zaXRpb24pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbWVzc2FnZS52ZXJzaW9uID0gMlxuICAgIG1lc3NhZ2UubGludGVyTmFtZSA9IGxpbnRlck5hbWVcbiAgICBtZXNzYWdlLmtleSA9IG1lc3NhZ2VLZXkobWVzc2FnZSlcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZUtleUxlZ2FjeShtZXNzYWdlOiBNZXNzYWdlTGVnYWN5KTogc3RyaW5nIHtcbiAgcmV0dXJuIFtcbiAgICBgJExJTlRFUjoke21lc3NhZ2UubGludGVyTmFtZX1gLFxuICAgIGAkTE9DQVRJT046JHttZXNzYWdlLmZpbGVQYXRoIHx8ICcnfSQke21lc3NhZ2UucmFuZ2UgPyBgJHttZXNzYWdlLnJhbmdlLnN0YXJ0LnJvd30kJHttZXNzYWdlLnJhbmdlLnN0YXJ0LmNvbHVtbn0kJHttZXNzYWdlLnJhbmdlLmVuZC5yb3d9JCR7bWVzc2FnZS5yYW5nZS5lbmQuY29sdW1ufWAgOiAnJ31gLFxuICAgIGAkVEVYVDoke21lc3NhZ2UudGV4dCB8fCAnJ31gLFxuICAgIGAkSFRNTDoke21lc3NhZ2UuaHRtbCB8fCAnJ31gLFxuICAgIGAkU0VWRVJJVFk6JHttZXNzYWdlLnNldmVyaXR5fWAsXG4gICAgYCRUWVBFOiR7bWVzc2FnZS50eXBlfWAsXG4gICAgYCRDTEFTUzoke21lc3NhZ2UuY2xhc3MgfHwgJyd9YCxcbiAgXS5qb2luKCcnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplTWVzc2FnZXNMZWdhY3kobGludGVyTmFtZTogc3RyaW5nLCBtZXNzYWdlczogQXJyYXk8TWVzc2FnZUxlZ2FjeT4pIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IG1lc3NhZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VzW2ldXG4gICAgY29uc3QgZml4ID0gbWVzc2FnZS5maXhcbiAgICBpZiAobWVzc2FnZS5yYW5nZSAmJiBtZXNzYWdlLnJhbmdlLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBcnJheScpIHtcbiAgICAgIG1lc3NhZ2UucmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KG1lc3NhZ2UucmFuZ2UpXG4gICAgfVxuICAgIGlmIChmaXggJiYgZml4LnJhbmdlLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBcnJheScpIHtcbiAgICAgIGZpeC5yYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoZml4LnJhbmdlKVxuICAgIH1cbiAgICBpZiAoIW1lc3NhZ2Uuc2V2ZXJpdHkpIHtcbiAgICAgIGNvbnN0IHR5cGUgPSBtZXNzYWdlLnR5cGUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKHR5cGUgPT09ICd3YXJuaW5nJykge1xuICAgICAgICBtZXNzYWdlLnNldmVyaXR5ID0gdHlwZVxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAnaW5mbycgfHwgdHlwZSA9PT0gJ3RyYWNlJykge1xuICAgICAgICBtZXNzYWdlLnNldmVyaXR5ID0gJ2luZm8nXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzYWdlLnNldmVyaXR5ID0gJ2Vycm9yJ1xuICAgICAgfVxuICAgIH1cbiAgICBtZXNzYWdlLnZlcnNpb24gPSAxXG4gICAgbWVzc2FnZS5saW50ZXJOYW1lID0gbGludGVyTmFtZVxuICAgIG1lc3NhZ2Uua2V5ID0gbWVzc2FnZUtleUxlZ2FjeShtZXNzYWdlKVxuXG4gICAgaWYgKG1lc3NhZ2UudHJhY2UpIHtcbiAgICAgIG5vcm1hbGl6ZU1lc3NhZ2VzTGVnYWN5KGxpbnRlck5hbWUsIG1lc3NhZ2UudHJhY2UpXG4gICAgfVxuICB9XG59XG4iXX0=