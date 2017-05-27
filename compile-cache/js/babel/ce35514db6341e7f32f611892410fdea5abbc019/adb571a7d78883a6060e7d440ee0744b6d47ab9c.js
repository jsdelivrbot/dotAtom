'use babel';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var CompletionProvider = require('./completion-provider');

var AutocompleteModulesPlugin = (function () {
  function AutocompleteModulesPlugin() {
    _classCallCheck(this, AutocompleteModulesPlugin);

    this.config = {
      includeExtension: {
        order: 1,
        title: 'Include file extension',
        description: "Include the file's extension when filling in the completion.",
        type: 'boolean',
        'default': false
      },
      vendors: {
        order: 2,
        title: 'Vendor directories',
        description: 'A list of directories to search for modules relative to the project root.',
        type: 'array',
        'default': ['node_modules'],
        items: {
          type: 'string'
        }
      },
      webpack: {
        order: 3,
        title: 'Webpack support',
        description: 'Attempts to use the given webpack configuration file resolution settings to search for modules.',
        type: 'boolean',
        'default': false
      },
      webpackConfigFilename: {
        order: 4,
        title: 'Webpack configuration filename',
        description: 'When "Webpack support" is enabled this is the config file used to supply module search paths.',
        type: 'string',
        'default': 'webpack.config.js'
      },
      babelPluginModuleResolver: {
        order: 5,
        title: 'Babel Plugin Module Resolver support',
        description: 'Use the <a href="https://github.com/tleunen/babel-plugin-module-resolver">Babel Plugin Module Resolver</a> configuration located in your `.babelrc` or in the babel configuration in `package.json`.',
        type: 'boolean',
        'default': false
      }
    };
  }

  _createClass(AutocompleteModulesPlugin, [{
    key: 'activate',
    value: function activate() {
      this.completionProvider = new CompletionProvider();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      delete this.completionProvider;
      this.completionProvider = null;
    }
  }, {
    key: 'getCompletionProvider',
    value: function getCompletionProvider() {
      return this.completionProvider;
    }
  }]);

  return AutocompleteModulesPlugin;
})();

module.exports = new AutocompleteModulesPlugin();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtbW9kdWxlcy9zcmMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7OztBQUVaLElBQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0lBRXRELHlCQUF5QjtBQUNsQixXQURQLHlCQUF5QixHQUNmOzBCQURWLHlCQUF5Qjs7QUFFM0IsUUFBSSxDQUFDLE1BQU0sR0FBRztBQUNaLHNCQUFnQixFQUFFO0FBQ2hCLGFBQUssRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFLHdCQUF3QjtBQUMvQixtQkFBVyxFQUFFLDhEQUE4RDtBQUMzRSxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELGFBQU8sRUFBRTtBQUNQLGFBQUssRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFLG9CQUFvQjtBQUMzQixtQkFBVyxFQUFFLDJFQUEyRTtBQUN4RixZQUFJLEVBQUUsT0FBTztBQUNiLG1CQUFTLENBQUMsY0FBYyxDQUFDO0FBQ3pCLGFBQUssRUFBRTtBQUNMLGNBQUksRUFBRSxRQUFRO1NBQ2Y7T0FDRjtBQUNELGFBQU8sRUFBRTtBQUNQLGFBQUssRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFLGlCQUFpQjtBQUN4QixtQkFBVyxFQUFFLGlHQUFpRztBQUM5RyxZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtBQUNELDJCQUFxQixFQUFFO0FBQ3JCLGFBQUssRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFLGdDQUFnQztBQUN2QyxtQkFBVyxFQUFFLCtGQUErRjtBQUM1RyxZQUFJLEVBQUUsUUFBUTtBQUNkLG1CQUFTLG1CQUFtQjtPQUM3QjtBQUNELCtCQUF5QixFQUFFO0FBQ3pCLGFBQUssRUFBRSxDQUFDO0FBQ1IsYUFBSyxFQUFFLHNDQUFzQztBQUM3QyxtQkFBVyxFQUFFLHNNQUFzTTtBQUNuTixZQUFJLEVBQUUsU0FBUztBQUNmLG1CQUFTLEtBQUs7T0FDZjtLQUNGLENBQUM7R0FDSDs7ZUExQ0cseUJBQXlCOztXQTRDckIsb0JBQUc7QUFDVCxVQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0tBQ3BEOzs7V0FFUyxzQkFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDO0FBQy9CLFVBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7S0FDaEM7OztXQUVvQixpQ0FBRztBQUN0QixhQUFPLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztLQUNoQzs7O1NBdkRHLHlCQUF5Qjs7O0FBMEQvQixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUkseUJBQXlCLEVBQUUsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbHJhbWlyZXovLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLW1vZHVsZXMvc3JjL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgQ29tcGxldGlvblByb3ZpZGVyID0gcmVxdWlyZSgnLi9jb21wbGV0aW9uLXByb3ZpZGVyJyk7XG5cbmNsYXNzIEF1dG9jb21wbGV0ZU1vZHVsZXNQbHVnaW4ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGluY2x1ZGVFeHRlbnNpb246IHtcbiAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgIHRpdGxlOiAnSW5jbHVkZSBmaWxlIGV4dGVuc2lvbicsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkluY2x1ZGUgdGhlIGZpbGUncyBleHRlbnNpb24gd2hlbiBmaWxsaW5nIGluIHRoZSBjb21wbGV0aW9uLlwiLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgdmVuZG9yczoge1xuICAgICAgICBvcmRlcjogMixcbiAgICAgICAgdGl0bGU6ICdWZW5kb3IgZGlyZWN0b3JpZXMnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0EgbGlzdCBvZiBkaXJlY3RvcmllcyB0byBzZWFyY2ggZm9yIG1vZHVsZXMgcmVsYXRpdmUgdG8gdGhlIHByb2plY3Qgcm9vdC4nLFxuICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICBkZWZhdWx0OiBbJ25vZGVfbW9kdWxlcyddLFxuICAgICAgICBpdGVtczoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB3ZWJwYWNrOiB7XG4gICAgICAgIG9yZGVyOiAzLFxuICAgICAgICB0aXRsZTogJ1dlYnBhY2sgc3VwcG9ydCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQXR0ZW1wdHMgdG8gdXNlIHRoZSBnaXZlbiB3ZWJwYWNrIGNvbmZpZ3VyYXRpb24gZmlsZSByZXNvbHV0aW9uIHNldHRpbmdzIHRvIHNlYXJjaCBmb3IgbW9kdWxlcy4nLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9LFxuICAgICAgd2VicGFja0NvbmZpZ0ZpbGVuYW1lOiB7XG4gICAgICAgIG9yZGVyOiA0LFxuICAgICAgICB0aXRsZTogJ1dlYnBhY2sgY29uZmlndXJhdGlvbiBmaWxlbmFtZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBcIldlYnBhY2sgc3VwcG9ydFwiIGlzIGVuYWJsZWQgdGhpcyBpcyB0aGUgY29uZmlnIGZpbGUgdXNlZCB0byBzdXBwbHkgbW9kdWxlIHNlYXJjaCBwYXRocy4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogJ3dlYnBhY2suY29uZmlnLmpzJ1xuICAgICAgfSxcbiAgICAgIGJhYmVsUGx1Z2luTW9kdWxlUmVzb2x2ZXI6IHtcbiAgICAgICAgb3JkZXI6IDUsXG4gICAgICAgIHRpdGxlOiAnQmFiZWwgUGx1Z2luIE1vZHVsZSBSZXNvbHZlciBzdXBwb3J0JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdVc2UgdGhlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vdGxldW5lbi9iYWJlbC1wbHVnaW4tbW9kdWxlLXJlc29sdmVyXCI+QmFiZWwgUGx1Z2luIE1vZHVsZSBSZXNvbHZlcjwvYT4gY29uZmlndXJhdGlvbiBsb2NhdGVkIGluIHlvdXIgYC5iYWJlbHJjYCBvciBpbiB0aGUgYmFiZWwgY29uZmlndXJhdGlvbiBpbiBgcGFja2FnZS5qc29uYC4nLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuY29tcGxldGlvblByb3ZpZGVyID0gbmV3IENvbXBsZXRpb25Qcm92aWRlcigpO1xuICB9XG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBkZWxldGUgdGhpcy5jb21wbGV0aW9uUHJvdmlkZXI7XG4gICAgdGhpcy5jb21wbGV0aW9uUHJvdmlkZXIgPSBudWxsO1xuICB9XG5cbiAgZ2V0Q29tcGxldGlvblByb3ZpZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmNvbXBsZXRpb25Qcm92aWRlcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBBdXRvY29tcGxldGVNb2R1bGVzUGx1Z2luKCk7XG4iXX0=