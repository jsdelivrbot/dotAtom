'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');
var readdir = Promise.promisify(require('fs').readdir);
var path = require('path');
var fuzzaldrin = require('fuzzaldrin');
var escapeRegExp = require('lodash.escaperegexp');
var get = require('lodash.get');
var findBabelConfig = require('find-babel-config');
var internalModules = require('./utils/internal-modules');

var LINE_REGEXP = /require|import|export\s+(?:\*|{[a-zA-Z0-9_$,\s]+})+\s+from|}\s*from\s*['"]/;
var SELECTOR = ['.source.js .string.quoted',

// for babel-language plugin
'.source.js .punctuation.definition.string.end', '.source.js .punctuation.definition.string.begin', '.source.ts .string.quoted', '.source.coffee .string.quoted'];
var SELECTOR_DISABLE = ['.source.js .comment', '.source.js .keyword', '.source.ts .comment', '.source.ts .keyword'];

var CompletionProvider = (function () {
  function CompletionProvider() {
    _classCallCheck(this, CompletionProvider);

    this.selector = SELECTOR.join(', ');
    this.disableForSelector = SELECTOR_DISABLE.join(', ');
    this.inclusionPriority = 1;
  }

  _createClass(CompletionProvider, [{
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var prefix = _ref.prefix;

      var line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      if (!LINE_REGEXP.test(line)) {
        return [];
      }

      var realPrefix = this.getRealPrefix(prefix, line);
      if (!realPrefix) {
        return [];
      }

      if (realPrefix[0] === '.') {
        return this.lookupLocal(realPrefix, path.dirname(editor.getPath()));
      }

      var vendors = atom.config.get('autocomplete-modules.vendors');

      var promises = vendors.map(function (vendor) {
        return _this.lookupGlobal(realPrefix, vendor);
      });

      var webpack = atom.config.get('autocomplete-modules.webpack');
      if (webpack) {
        promises.push(this.lookupWebpack(realPrefix));
      }

      var babelPluginModuleResolver = atom.config.get('autocomplete-modules.babelPluginModuleResolver');
      if (babelPluginModuleResolver) {
        promises.push(this.lookupbabelPluginModuleResolver(realPrefix));
      }

      return Promise.all(promises).then(function (suggestions) {
        var _ref2;

        return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(suggestions));
      });
    }
  }, {
    key: 'getRealPrefix',
    value: function getRealPrefix(prefix, line) {
      try {
        var realPrefixRegExp = new RegExp('[\'"]((?:.+?)*' + escapeRegExp(prefix) + ')');
        var realPrefixMathes = realPrefixRegExp.exec(line);
        if (!realPrefixMathes) {
          return false;
        }

        return realPrefixMathes[1];
      } catch (e) {
        return false;
      }
    }
  }, {
    key: 'filterSuggestions',
    value: function filterSuggestions(prefix, suggestions) {
      return fuzzaldrin.filter(suggestions, prefix, {
        key: 'text'
      });
    }
  }, {
    key: 'lookupLocal',
    value: function lookupLocal(prefix, dirname) {
      var _this2 = this;

      var filterPrefix = prefix.replace(path.dirname(prefix), '').replace('/', '');
      if (prefix[prefix.length - 1] === '/') {
        filterPrefix = '';
      }

      var includeExtension = atom.config.get('autocomplete-modules.includeExtension');
      var lookupDirname = path.resolve(dirname, prefix);
      if (filterPrefix) {
        lookupDirname = lookupDirname.replace(new RegExp(escapeRegExp(filterPrefix) + '$'), '');
      }

      return readdir(lookupDirname)['catch'](function (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }

        return [];
      }).filter(function (filename) {
        return filename[0] !== '.';
      }).map(function (pathname) {
        return {
          text: includeExtension ? pathname : _this2.normalizeLocal(pathname),
          displayText: pathname,
          type: 'import'
        };
      }).then(function (suggestions) {
        return _this2.filterSuggestions(filterPrefix, suggestions);
      });
    }
  }, {
    key: 'normalizeLocal',
    value: function normalizeLocal(filename) {
      return filename.replace(/\.(js|es6|jsx|coffee|ts|tsx)$/, '');
    }
  }, {
    key: 'lookupGlobal',
    value: function lookupGlobal(prefix) {
      var _this3 = this;

      var vendor = arguments.length <= 1 || arguments[1] === undefined ? 'node_modules' : arguments[1];

      var projectPath = atom.project.getPaths()[0];
      if (!projectPath) {
        return Promise.resolve([]);
      }

      var vendorPath = path.join(projectPath, vendor);
      if (prefix.indexOf('/') !== -1) {
        return this.lookupLocal('./' + prefix, vendorPath);
      }

      return readdir(vendorPath)['catch'](function (e) {
        if (e.code !== 'ENOENT') {
          throw e;
        }

        return [];
      }).then(function (libs) {
        return [].concat(_toConsumableArray(internalModules), _toConsumableArray(libs));
      }).map(function (lib) {
        return {
          text: lib,
          replacementPrefix: prefix,
          type: 'import'
        };
      }).then(function (suggestions) {
        return _this3.filterSuggestions(prefix, suggestions);
      });
    }
  }, {
    key: 'lookupWebpack',
    value: function lookupWebpack(prefix) {
      var _this4 = this;

      var projectPath = atom.project.getPaths()[0];
      if (!projectPath) {
        return Promise.resolve([]);
      }

      var vendors = atom.config.get('autocomplete-modules.vendors');
      var webpackConfig = this.fetchWebpackConfig(projectPath);

      var webpackRoot = get(webpackConfig, 'resolve.root', '');
      var moduleSearchPaths = get(webpackConfig, 'resolve.modulesDirectories', []);
      moduleSearchPaths = moduleSearchPaths.filter(function (item) {
        return vendors.indexOf(item) === -1;
      });

      return Promise.all(moduleSearchPaths.concat(webpackRoot).map(function (searchPath) {
        return _this4.lookupLocal(prefix, path.join(projectPath, searchPath));
      })).then(function (suggestions) {
        var _ref3;

        return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(suggestions));
      });
    }
  }, {
    key: 'fetchWebpackConfig',
    value: function fetchWebpackConfig(rootPath) {
      var webpackConfigFilename = atom.config.get('autocomplete-modules.webpackConfigFilename');
      var webpackConfigPath = path.join(rootPath, webpackConfigFilename);

      try {
        return require(webpackConfigPath); // eslint-disable-line
      } catch (error) {
        return {};
      }
    }
  }, {
    key: 'lookupbabelPluginModuleResolver',
    value: function lookupbabelPluginModuleResolver(prefix) {
      var _this5 = this;

      var projectPath = atom.project.getPaths()[0];
      if (projectPath) {
        return findBabelConfig(projectPath).then(function (_ref4) {
          var config = _ref4.config;

          if (config && Array.isArray(config.plugins)) {
            var _ret = (function () {
              // Grab the v1 (module-alias) or v2 (module-resolver) plugin configuration
              var pluginConfig = config.plugins.find(function (p) {
                return p[0] === 'module-alias' || p[0] === 'babel-plugin-module-alias';
              }) || config.plugins.find(function (p) {
                return p[0] === 'module-resolver' || p[0] === 'babel-plugin-module-resolver';
              });
              if (!pluginConfig) {
                return {
                  v: []
                };
              }

              // Only v2 of the plugin supports custom root directories
              var rootPromises = [];
              if (!Array.isArray(pluginConfig[1])) {
                var rootDirs = pluginConfig[1].root || [];
                rootPromises = rootPromises.concat(rootDirs.map(function (r) {
                  var rootDirPath = path.join(projectPath, r);
                  return _this5.lookupLocal('./' + prefix, rootDirPath);
                }));
              }

              // determine the right prefix for the alias config
              // `realPrefix` is the prefix we want to use to find the right file/suggestions
              // when the prefix is a sub module (eg. module/subfile),
              // `modulePrefix` will be "module", and `realPrefix` will be "subfile"
              var prefixSplit = prefix.split('/');
              var modulePrefix = prefixSplit[0];
              var realPrefix = prefixSplit.pop();
              var moduleSearchPath = prefixSplit.join('/');

              // get the alias configs for the specific module
              var aliasConfig = Array.isArray(pluginConfig[1])
              // v1 of the plugin is an array
              ? pluginConfig[1].filter(function (alias) {
                return alias.expose.startsWith(modulePrefix);
              })
              // otherwise it's v2 (an object)
              : Object.keys(pluginConfig[1].alias || {}).filter(function (expose) {
                return expose.startsWith(modulePrefix);
              }).map(function (exp) {
                return {
                  expose: exp,
                  src: pluginConfig[1].alias[exp]
                };
              });

              return {
                v: Promise.all(rootPromises.concat(aliasConfig.map(function (alias) {
                  // The search path is the parent directory of the source directory specified in .babelrc
                  // then we append the `moduleSearchPath` to get the real search path
                  var searchPath = path.join(path.dirname(path.resolve(projectPath, alias.src)), moduleSearchPath);

                  return _this5.lookupLocal(realPrefix, searchPath);
                }))).then(function (suggestions) {
                  var _ref5;

                  return (_ref5 = []).concat.apply(_ref5, _toConsumableArray(suggestions));
                }).then(function (suggestions) {
                  // make sure the suggestions are from the compatible alias
                  if (prefix === realPrefix && aliasConfig.length) {
                    return suggestions.filter(function (sugg) {
                      return aliasConfig.find(function (a) {
                        return a.expose === sugg.text;
                      });
                    });
                  }
                  return suggestions;
                })
              };
            })();

            if (typeof _ret === 'object') return _ret.v;
          }

          return [];
        });
      }
    }
  }]);

  return CompletionProvider;
})();

module.exports = CompletionProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtbW9kdWxlcy9zcmMvY29tcGxldGlvbi1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7O0FBRVosSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDekMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDcEQsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2xDLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUU1RCxJQUFNLFdBQVcsR0FBRyw0RUFBNEUsQ0FBQztBQUNqRyxJQUFNLFFBQVEsR0FBRyxDQUNmLDJCQUEyQjs7O0FBRzNCLCtDQUErQyxFQUMvQyxpREFBaUQsRUFFakQsMkJBQTJCLEVBQzNCLCtCQUErQixDQUNoQyxDQUFDO0FBQ0YsSUFBTSxnQkFBZ0IsR0FBRyxDQUN2QixxQkFBcUIsRUFDckIscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixxQkFBcUIsQ0FDdEIsQ0FBQzs7SUFFSSxrQkFBa0I7QUFDWCxXQURQLGtCQUFrQixHQUNSOzBCQURWLGtCQUFrQjs7QUFFcEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLFFBQUksQ0FB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bHJhbWlyZXovLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLW1vZHVsZXMvc3JjL2NvbXBsZXRpb24tcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5jb25zdCByZWFkZGlyID0gUHJvbWlzZS5wcm9taXNpZnkocmVxdWlyZSgnZnMnKS5yZWFkZGlyKTtcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5jb25zdCBmdXp6YWxkcmluID0gcmVxdWlyZSgnZnV6emFsZHJpbicpO1xuY29uc3QgZXNjYXBlUmVnRXhwID0gcmVxdWlyZSgnbG9kYXNoLmVzY2FwZXJlZ2V4cCcpO1xuY29uc3QgZ2V0ID0gcmVxdWlyZSgnbG9kYXNoLmdldCcpO1xuY29uc3QgZmluZEJhYmVsQ29uZmlnID0gcmVxdWlyZSgnZmluZC1iYWJlbC1jb25maWcnKTtcbmNvbnN0IGludGVybmFsTW9kdWxlcyA9IHJlcXVpcmUoJy4vdXRpbHMvaW50ZXJuYWwtbW9kdWxlcycpO1xuXG5jb25zdCBMSU5FX1JFR0VYUCA9IC9yZXF1aXJlfGltcG9ydHxleHBvcnRcXHMrKD86XFwqfHtbYS16QS1aMC05XyQsXFxzXSt9KStcXHMrZnJvbXx9XFxzKmZyb21cXHMqWydcIl0vO1xuY29uc3QgU0VMRUNUT1IgPSBbXG4gICcuc291cmNlLmpzIC5zdHJpbmcucXVvdGVkJyxcblxuICAvLyBmb3IgYmFiZWwtbGFuZ3VhZ2UgcGx1Z2luXG4gICcuc291cmNlLmpzIC5wdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5lbmQnLFxuICAnLnNvdXJjZS5qcyAucHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4nLFxuXG4gICcuc291cmNlLnRzIC5zdHJpbmcucXVvdGVkJyxcbiAgJy5zb3VyY2UuY29mZmVlIC5zdHJpbmcucXVvdGVkJ1xuXTtcbmNvbnN0IFNFTEVDVE9SX0RJU0FCTEUgPSBbXG4gICcuc291cmNlLmpzIC5jb21tZW50JyxcbiAgJy5zb3VyY2UuanMgLmtleXdvcmQnLFxuICAnLnNvdXJjZS50cyAuY29tbWVudCcsXG4gICcuc291cmNlLnRzIC5rZXl3b3JkJ1xuXTtcblxuY2xhc3MgQ29tcGxldGlvblByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IFNFTEVDVE9SLmpvaW4oJywgJyk7XG4gICAgdGhpcy5kaXNhYmxlRm9yU2VsZWN0b3IgPSBTRUxFQ1RPUl9ESVNBQkxFLmpvaW4oJywgJyk7XG4gICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IDE7XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgcHJlZml4fSkge1xuICAgIGNvbnN0IGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pO1xuICAgIGlmICghTElORV9SRUdFWFAudGVzdChsaW5lKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlYWxQcmVmaXggPSB0aGlzLmdldFJlYWxQcmVmaXgocHJlZml4LCBsaW5lKTtcbiAgICBpZiAoIXJlYWxQcmVmaXgpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBpZiAocmVhbFByZWZpeFswXSA9PT0gJy4nKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb29rdXBMb2NhbChyZWFsUHJlZml4LCBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSkpO1xuICAgIH1cblxuICAgIGNvbnN0IHZlbmRvcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLnZlbmRvcnMnKTtcblxuICAgIGNvbnN0IHByb21pc2VzID0gdmVuZG9ycy5tYXAoXG4gICAgICAodmVuZG9yKSA9PiB0aGlzLmxvb2t1cEdsb2JhbChyZWFsUHJlZml4LCB2ZW5kb3IpXG4gICAgKTtcblxuICAgIGNvbnN0IHdlYnBhY2sgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLndlYnBhY2snKTtcbiAgICBpZiAod2VicGFjaykge1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmxvb2t1cFdlYnBhY2socmVhbFByZWZpeCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGJhYmVsUGx1Z2luTW9kdWxlUmVzb2x2ZXIgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLmJhYmVsUGx1Z2luTW9kdWxlUmVzb2x2ZXInKTtcbiAgICBpZiAoYmFiZWxQbHVnaW5Nb2R1bGVSZXNvbHZlcikge1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLmxvb2t1cGJhYmVsUGx1Z2luTW9kdWxlUmVzb2x2ZXIocmVhbFByZWZpeCkpO1xuICAgIH1cblxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbihcbiAgICAgIChzdWdnZXN0aW9ucykgPT4gW10uY29uY2F0KC4uLnN1Z2dlc3Rpb25zKVxuICAgICk7XG4gIH1cblxuICBnZXRSZWFsUHJlZml4KHByZWZpeCwgbGluZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZWFsUHJlZml4UmVnRXhwID0gbmV3IFJlZ0V4cChgWydcIl0oKD86Lis/KSoke2VzY2FwZVJlZ0V4cChwcmVmaXgpfSlgKTtcbiAgICAgIGNvbnN0IHJlYWxQcmVmaXhNYXRoZXMgPSByZWFsUHJlZml4UmVnRXhwLmV4ZWMobGluZSk7XG4gICAgICBpZiAoIXJlYWxQcmVmaXhNYXRoZXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhbFByZWZpeE1hdGhlc1sxXTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZmlsdGVyU3VnZ2VzdGlvbnMocHJlZml4LCBzdWdnZXN0aW9ucykge1xuICAgIHJldHVybiBmdXp6YWxkcmluLmZpbHRlcihzdWdnZXN0aW9ucywgcHJlZml4LCB7XG4gICAgICBrZXk6ICd0ZXh0J1xuICAgIH0pO1xuICB9XG5cbiAgbG9va3VwTG9jYWwocHJlZml4LCBkaXJuYW1lKSB7XG4gICAgbGV0IGZpbHRlclByZWZpeCA9IHByZWZpeC5yZXBsYWNlKHBhdGguZGlybmFtZShwcmVmaXgpLCAnJykucmVwbGFjZSgnLycsICcnKTtcbiAgICBpZiAocHJlZml4W3ByZWZpeC5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICBmaWx0ZXJQcmVmaXggPSAnJztcbiAgICB9XG5cbiAgICBjb25zdCBpbmNsdWRlRXh0ZW5zaW9uID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtbW9kdWxlcy5pbmNsdWRlRXh0ZW5zaW9uJyk7XG4gICAgbGV0IGxvb2t1cERpcm5hbWUgPSBwYXRoLnJlc29sdmUoZGlybmFtZSwgcHJlZml4KTtcbiAgICBpZiAoZmlsdGVyUHJlZml4KSB7XG4gICAgICBsb29rdXBEaXJuYW1lID0gbG9va3VwRGlybmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnRXhwKGZpbHRlclByZWZpeCl9JGApLCAnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlYWRkaXIobG9va3VwRGlybmFtZSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGlmIChlLmNvZGUgIT09ICdFTk9FTlQnKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBbXTtcbiAgICB9KS5maWx0ZXIoXG4gICAgICAoZmlsZW5hbWUpID0+IGZpbGVuYW1lWzBdICE9PSAnLidcbiAgICApLm1hcCgocGF0aG5hbWUpID0+ICh7XG4gICAgICB0ZXh0OiBpbmNsdWRlRXh0ZW5zaW9uID8gcGF0aG5hbWUgOiB0aGlzLm5vcm1hbGl6ZUxvY2FsKHBhdGhuYW1lKSxcbiAgICAgIGRpc3BsYXlUZXh0OiBwYXRobmFtZSxcbiAgICAgIHR5cGU6ICdpbXBvcnQnXG4gICAgfSkpLnRoZW4oXG4gICAgICAoc3VnZ2VzdGlvbnMpID0+IHRoaXMuZmlsdGVyU3VnZ2VzdGlvbnMoZmlsdGVyUHJlZml4LCBzdWdnZXN0aW9ucylcbiAgICApO1xuICB9XG5cbiAgbm9ybWFsaXplTG9jYWwoZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gZmlsZW5hbWUucmVwbGFjZSgvXFwuKGpzfGVzNnxqc3h8Y29mZmVlfHRzfHRzeCkkLywgJycpO1xuICB9XG5cbiAgbG9va3VwR2xvYmFsKHByZWZpeCwgdmVuZG9yID0gJ25vZGVfbW9kdWxlcycpIHtcbiAgICBjb25zdCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGlmICghcHJvamVjdFBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIGNvbnN0IHZlbmRvclBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsIHZlbmRvcik7XG4gICAgaWYgKHByZWZpeC5pbmRleE9mKCcvJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb29rdXBMb2NhbChgLi8ke3ByZWZpeH1gLCB2ZW5kb3JQYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhZGRpcih2ZW5kb3JQYXRoKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgaWYgKGUuY29kZSAhPT0gJ0VOT0VOVCcpIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFtdO1xuICAgIH0pLnRoZW4oXG4gICAgICAobGlicykgPT4gWy4uLmludGVybmFsTW9kdWxlcywgLi4ubGlic11cbiAgICApLm1hcCgobGliKSA9PiAoe1xuICAgICAgdGV4dDogbGliLFxuICAgICAgcmVwbGFjZW1lbnRQcmVmaXg6IHByZWZpeCxcbiAgICAgIHR5cGU6ICdpbXBvcnQnXG4gICAgfSkpLnRoZW4oXG4gICAgICAoc3VnZ2VzdGlvbnMpID0+IHRoaXMuZmlsdGVyU3VnZ2VzdGlvbnMocHJlZml4LCBzdWdnZXN0aW9ucylcbiAgICApO1xuICB9XG5cbiAgbG9va3VwV2VicGFjayhwcmVmaXgpIHtcbiAgICBjb25zdCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdO1xuICAgIGlmICghcHJvamVjdFBhdGgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgIH1cblxuICAgIGNvbnN0IHZlbmRvcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1tb2R1bGVzLnZlbmRvcnMnKTtcbiAgICBjb25zdCB3ZWJwYWNrQ29uZmlnID0gdGhpcy5mZXRjaFdlYnBhY2tDb25maWcocHJvamVjdFBhdGgpO1xuXG4gICAgY29uc3Qgd2VicGFja1Jvb3QgPSBnZXQod2VicGFja0NvbmZpZywgJ3Jlc29sdmUucm9vdCcsICcnKTtcbiAgICBsZXQgbW9kdWxlU2VhcmNoUGF0aHMgPSBnZXQod2VicGFja0NvbmZpZywgJ3Jlc29sdmUubW9kdWxlc0RpcmVjdG9yaWVzJywgW10pO1xuICAgIG1vZHVsZVNlYXJjaFBhdGhzID0gbW9kdWxlU2VhcmNoUGF0aHMuZmlsdGVyKFxuICAgICAgKGl0ZW0pID0+IHZlbmRvcnMuaW5kZXhPZihpdGVtKSA9PT0gLTFcbiAgICApO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKG1vZHVsZVNlYXJjaFBhdGhzLmNvbmNhdCh3ZWJwYWNrUm9vdCkubWFwKFxuICAgICAgKHNlYXJjaFBhdGgpID0+IHRoaXMubG9va3VwTG9jYWwocHJlZml4LCBwYXRoLmpvaW4ocHJvamVjdFBhdGgsIHNlYXJjaFBhdGgpKVxuICAgICkpLnRoZW4oXG4gICAgICAoc3VnZ2VzdGlvbnMpID0+IFtdLmNvbmNhdCguLi5zdWdnZXN0aW9ucylcbiAgICApO1xuICB9XG5cbiAgZmV0Y2hXZWJwYWNrQ29uZmlnKHJvb3RQYXRoKSB7XG4gICAgY29uc3Qgd2VicGFja0NvbmZpZ0ZpbGVuYW1lID0gYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtbW9kdWxlcy53ZWJwYWNrQ29uZmlnRmlsZW5hbWUnKTtcbiAgICBjb25zdCB3ZWJwYWNrQ29uZmlnUGF0aCA9IHBhdGguam9pbihyb290UGF0aCwgd2VicGFja0NvbmZpZ0ZpbGVuYW1lKTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcmVxdWlyZSh3ZWJwYWNrQ29uZmlnUGF0aCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfVxuXG4gIGxvb2t1cGJhYmVsUGx1Z2luTW9kdWxlUmVzb2x2ZXIocHJlZml4KSB7XG4gICAgY29uc3QgcHJvamVjdFBhdGggPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXTtcbiAgICBpZiAocHJvamVjdFBhdGgpIHtcbiAgICAgIHJldHVybiBmaW5kQmFiZWxDb25maWcocHJvamVjdFBhdGgpLnRoZW4oKHtjb25maWd9KSA9PiB7XG4gICAgICAgIGlmIChjb25maWcgJiYgQXJyYXkuaXNBcnJheShjb25maWcucGx1Z2lucykpIHtcbiAgICAgICAgICAvLyBHcmFiIHRoZSB2MSAobW9kdWxlLWFsaWFzKSBvciB2MiAobW9kdWxlLXJlc29sdmVyKSBwbHVnaW4gY29uZmlndXJhdGlvblxuICAgICAgICAgIGNvbnN0IHBsdWdpbkNvbmZpZyA9IGNvbmZpZy5wbHVnaW5zLmZpbmQocCA9PiBwWzBdID09PSAnbW9kdWxlLWFsaWFzJyB8fCBwWzBdID09PSAnYmFiZWwtcGx1Z2luLW1vZHVsZS1hbGlhcycpIHx8XG4gICAgICAgICAgICBjb25maWcucGx1Z2lucy5maW5kKHAgPT4gcFswXSA9PT0gJ21vZHVsZS1yZXNvbHZlcicgfHwgcFswXSA9PT0gJ2JhYmVsLXBsdWdpbi1tb2R1bGUtcmVzb2x2ZXInKTtcbiAgICAgICAgICBpZiAoIXBsdWdpbkNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE9ubHkgdjIgb2YgdGhlIHBsdWdpbiBzdXBwb3J0cyBjdXN0b20gcm9vdCBkaXJlY3Rvcmllc1xuICAgICAgICAgIGxldCByb290UHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkocGx1Z2luQ29uZmlnWzFdKSkge1xuICAgICAgICAgICAgY29uc3Qgcm9vdERpcnMgPSBwbHVnaW5Db25maWdbMV0ucm9vdCB8fCBbXTtcbiAgICAgICAgICAgIHJvb3RQcm9taXNlcyA9IHJvb3RQcm9taXNlcy5jb25jYXQocm9vdERpcnMubWFwKHIgPT4ge1xuICAgICAgICAgICAgICBjb25zdCByb290RGlyUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgcik7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvb2t1cExvY2FsKGAuLyR7cHJlZml4fWAsIHJvb3REaXJQYXRoKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBkZXRlcm1pbmUgdGhlIHJpZ2h0IHByZWZpeCBmb3IgdGhlIGFsaWFzIGNvbmZpZ1xuICAgICAgICAgIC8vIGByZWFsUHJlZml4YCBpcyB0aGUgcHJlZml4IHdlIHdhbnQgdG8gdXNlIHRvIGZpbmQgdGhlIHJpZ2h0IGZpbGUvc3VnZ2VzdGlvbnNcbiAgICAgICAgICAvLyB3aGVuIHRoZSBwcmVmaXggaXMgYSBzdWIgbW9kdWxlIChlZy4gbW9kdWxlL3N1YmZpbGUpLFxuICAgICAgICAgIC8vIGBtb2R1bGVQcmVmaXhgIHdpbGwgYmUgXCJtb2R1bGVcIiwgYW5kIGByZWFsUHJlZml4YCB3aWxsIGJlIFwic3ViZmlsZVwiXG4gICAgICAgICAgY29uc3QgcHJlZml4U3BsaXQgPSBwcmVmaXguc3BsaXQoJy8nKTtcbiAgICAgICAgICBjb25zdCBtb2R1bGVQcmVmaXggPSBwcmVmaXhTcGxpdFswXTtcbiAgICAgICAgICBjb25zdCByZWFsUHJlZml4ID0gcHJlZml4U3BsaXQucG9wKCk7XG4gICAgICAgICAgY29uc3QgbW9kdWxlU2VhcmNoUGF0aCA9IHByZWZpeFNwbGl0LmpvaW4oJy8nKTtcblxuICAgICAgICAgIC8vIGdldCB0aGUgYWxpYXMgY29uZmlncyBmb3IgdGhlIHNwZWNpZmljIG1vZHVsZVxuICAgICAgICAgIGNvbnN0IGFsaWFzQ29uZmlnID0gQXJyYXkuaXNBcnJheShwbHVnaW5Db25maWdbMV0pXG4gICAgICAgICAgICAvLyB2MSBvZiB0aGUgcGx1Z2luIGlzIGFuIGFycmF5XG4gICAgICAgICAgICA/IHBsdWdpbkNvbmZpZ1sxXS5maWx0ZXIoYWxpYXMgPT4gYWxpYXMuZXhwb3NlLnN0YXJ0c1dpdGgobW9kdWxlUHJlZml4KSlcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSBpdCdzIHYyIChhbiBvYmplY3QpXG4gICAgICAgICAgICA6IE9iamVjdC5rZXlzKHBsdWdpbkNvbmZpZ1sxXS5hbGlhcyB8fCB7fSlcbiAgICAgICAgICAgICAgLmZpbHRlcihleHBvc2UgPT4gZXhwb3NlLnN0YXJ0c1dpdGgobW9kdWxlUHJlZml4KSlcbiAgICAgICAgICAgICAgLm1hcChleHAgPT4gKHtcbiAgICAgICAgICAgICAgICBleHBvc2U6IGV4cCxcbiAgICAgICAgICAgICAgICBzcmM6IHBsdWdpbkNvbmZpZ1sxXS5hbGlhc1tleHBdXG4gICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChyb290UHJvbWlzZXMuY29uY2F0KGFsaWFzQ29uZmlnLm1hcChcbiAgICAgICAgICAgIChhbGlhcykgPT4ge1xuICAgICAgICAgICAgICAvLyBUaGUgc2VhcmNoIHBhdGggaXMgdGhlIHBhcmVudCBkaXJlY3Rvcnkgb2YgdGhlIHNvdXJjZSBkaXJlY3Rvcnkgc3BlY2lmaWVkIGluIC5iYWJlbHJjXG4gICAgICAgICAgICAgIC8vIHRoZW4gd2UgYXBwZW5kIHRoZSBgbW9kdWxlU2VhcmNoUGF0aGAgdG8gZ2V0IHRoZSByZWFsIHNlYXJjaCBwYXRoXG4gICAgICAgICAgICAgIGNvbnN0IHNlYXJjaFBhdGggPSBwYXRoLmpvaW4oXG4gICAgICAgICAgICAgICAgcGF0aC5kaXJuYW1lKHBhdGgucmVzb2x2ZShwcm9qZWN0UGF0aCwgYWxpYXMuc3JjKSksXG4gICAgICAgICAgICAgICAgbW9kdWxlU2VhcmNoUGF0aFxuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvb2t1cExvY2FsKHJlYWxQcmVmaXgsIHNlYXJjaFBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICkpKS50aGVuKFxuICAgICAgICAgICAgKHN1Z2dlc3Rpb25zKSA9PiBbXS5jb25jYXQoLi4uc3VnZ2VzdGlvbnMpXG4gICAgICAgICAgKS50aGVuKHN1Z2dlc3Rpb25zID0+IHtcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgc3VnZ2VzdGlvbnMgYXJlIGZyb20gdGhlIGNvbXBhdGlibGUgYWxpYXNcbiAgICAgICAgICAgIGlmIChwcmVmaXggPT09IHJlYWxQcmVmaXggJiYgYWxpYXNDb25maWcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdWdnZXN0aW9ucy5maWx0ZXIoc3VnZyA9PlxuICAgICAgICAgICAgICAgIGFsaWFzQ29uZmlnLmZpbmQoYSA9PiBhLmV4cG9zZSA9PT0gc3VnZy50ZXh0KVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN1Z2dlc3Rpb25zO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcGxldGlvblByb3ZpZGVyO1xuIl19