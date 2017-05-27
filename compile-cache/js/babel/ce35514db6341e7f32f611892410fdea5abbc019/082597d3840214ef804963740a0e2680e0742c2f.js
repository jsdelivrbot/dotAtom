

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module atom:linter-markdown
 * @fileoverview Linter.
 */

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

// Internal variables
'use babel';var engine = undefined;
var processor = undefined;
var subscriptions = undefined;
var recommendedWithoutConfig = undefined;
var consistentWithoutConfig = undefined;
var recommended = undefined;
var consistent = undefined;
var idleCallbacks = new Set();

// Settings
var scopes = undefined;
var detectIgnore = undefined;

function loadDeps() {
  if (!engine) {
    engine = require('unified-engine-atom');
  }
  if (!processor) {
    processor = require('remark');
  }
  if (!recommended) {
    recommended = require('remark-preset-lint-recommended');
  }
  if (!consistent) {
    consistent = require('remark-preset-lint-consistent');
  }
}

function lint(editor) {
  var plugins = [];
  var defaultConfig = undefined;

  // Load required modules if not already handled by init
  loadDeps();

  if (recommendedWithoutConfig) {
    plugins.push(recommended);
  }

  if (consistentWithoutConfig) {
    plugins.push(consistent);
  }

  if (consistentWithoutConfig || recommendedWithoutConfig) {
    defaultConfig = { plugins: plugins };
  }

  return engine({
    processor: processor,
    detectIgnore: detectIgnore,
    defaultConfig: defaultConfig,
    rcName: '.remarkrc',
    packageField: 'remarkConfig',
    ignoreName: '.remarkignore',
    pluginPrefix: 'remark'
  })(editor);
}

/**
 * Linter-markdown.
 *
 * @return {LinterConfiguration}
 */
function provideLinter() {
  return {
    grammarScopes: scopes,
    name: 'remark-lint',
    scope: 'file',
    lintsOnChange: true,
    lint: lint
  };
}

function activate() {
  var callbackID = undefined;
  var installLinterMarkdownDeps = function installLinterMarkdownDeps() {
    idleCallbacks['delete'](callbackID);

    // Install package dependencies
    if (!atom.inSpecMode()) {
      require('atom-package-deps').install('linter-markdown');
    }
    // Load required modules
    loadDeps();
  };

  // Defer this till an idle time as we don't need it immediately
  callbackID = window.requestIdleCallback(installLinterMarkdownDeps);
  idleCallbacks.add(callbackID);

  subscriptions = new _atom.CompositeDisposable();

  subscriptions.add(atom.config.observe('linter-markdown.presetRecommendedWithoutConfig', function (value) {
    recommendedWithoutConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.presetConsistentWithoutConfig', function (value) {
    consistentWithoutConfig = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.scopes', function (value) {
    scopes = value;
  }));
  subscriptions.add(atom.config.observe('linter-markdown.detectIgnore', function (value) {
    detectIgnore = value;
  }));
}

function deactivate() {
  idleCallbacks.forEach(function (callbackID) {
    return window.cancelIdleCallback(callbackID);
  });
  idleCallbacks.clear();
  subscriptions.dispose();
}

/*
 * Expose.
 */
module.exports = {
  activate: activate,
  deactivate: deactivate,
  provideLinter: provideLinter
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXItbWFya2Rvd24vbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFXb0MsTUFBTTs7O0FBWDFDLFdBQVcsQ0FBQyxBQWNaLElBQUksTUFBTSxZQUFBLENBQUM7QUFDWCxJQUFJLFNBQVMsWUFBQSxDQUFDO0FBQ2QsSUFBSSxhQUFhLFlBQUEsQ0FBQztBQUNsQixJQUFJLHdCQUF3QixZQUFBLENBQUM7QUFDN0IsSUFBSSx1QkFBdUIsWUFBQSxDQUFDO0FBQzVCLElBQUksV0FBVyxZQUFBLENBQUM7QUFDaEIsSUFBSSxVQUFVLFlBQUEsQ0FBQztBQUNmLElBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7OztBQUdoQyxJQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsSUFBSSxZQUFZLFlBQUEsQ0FBQzs7QUFFakIsU0FBUyxRQUFRLEdBQUc7QUFDbEIsTUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLFVBQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztHQUN6QztBQUNELE1BQUksQ0FBQyxTQUFTLEVBQUU7QUFDZCxhQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQy9CO0FBQ0QsTUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNoQixlQUFXLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7R0FDekQ7QUFDRCxNQUFJLENBQUMsVUFBVSxFQUFFO0FBQ2YsY0FBVSxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0dBQ3ZEO0NBQ0Y7O0FBRUQsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3BCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNuQixNQUFJLGFBQWEsWUFBQSxDQUFDOzs7QUFHbEIsVUFBUSxFQUFFLENBQUM7O0FBRVgsTUFBSSx3QkFBd0IsRUFBRTtBQUM1QixXQUFPLENBQUMsSUFB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L2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQGF1dGhvciBUaXR1cyBXb3JtZXJcbiAqIEBjb3B5cmlnaHQgMjAxNSBUaXR1cyBXb3JtZXJcbiAqIEBsaWNlbnNlIE1JVFxuICogQG1vZHVsZSBhdG9tOmxpbnRlci1tYXJrZG93blxuICogQGZpbGVvdmVydmlldyBMaW50ZXIuXG4gKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcywgaW1wb3J0L2V4dGVuc2lvbnNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuLy8gSW50ZXJuYWwgdmFyaWFibGVzXG5sZXQgZW5naW5lO1xubGV0IHByb2Nlc3NvcjtcbmxldCBzdWJzY3JpcHRpb25zO1xubGV0IHJlY29tbWVuZGVkV2l0aG91dENvbmZpZztcbmxldCBjb25zaXN0ZW50V2l0aG91dENvbmZpZztcbmxldCByZWNvbW1lbmRlZDtcbmxldCBjb25zaXN0ZW50O1xuY29uc3QgaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKTtcblxuLy8gU2V0dGluZ3NcbmxldCBzY29wZXM7XG5sZXQgZGV0ZWN0SWdub3JlO1xuXG5mdW5jdGlvbiBsb2FkRGVwcygpIHtcbiAgaWYgKCFlbmdpbmUpIHtcbiAgICBlbmdpbmUgPSByZXF1aXJlKCd1bmlmaWVkLWVuZ2luZS1hdG9tJyk7XG4gIH1cbiAgaWYgKCFwcm9jZXNzb3IpIHtcbiAgICBwcm9jZXNzb3IgPSByZXF1aXJlKCdyZW1hcmsnKTtcbiAgfVxuICBpZiAoIXJlY29tbWVuZGVkKSB7XG4gICAgcmVjb21tZW5kZWQgPSByZXF1aXJlKCdyZW1hcmstcHJlc2V0LWxpbnQtcmVjb21tZW5kZWQnKTtcbiAgfVxuICBpZiAoIWNvbnNpc3RlbnQpIHtcbiAgICBjb25zaXN0ZW50ID0gcmVxdWlyZSgncmVtYXJrLXByZXNldC1saW50LWNvbnNpc3RlbnQnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsaW50KGVkaXRvcikge1xuICBjb25zdCBwbHVnaW5zID0gW107XG4gIGxldCBkZWZhdWx0Q29uZmlnO1xuXG4gIC8vIExvYWQgcmVxdWlyZWQgbW9kdWxlcyBpZiBub3QgYWxyZWFkeSBoYW5kbGVkIGJ5IGluaXRcbiAgbG9hZERlcHMoKTtcblxuICBpZiAocmVjb21tZW5kZWRXaXRob3V0Q29uZmlnKSB7XG4gICAgcGx1Z2lucy5wdXNoKHJlY29tbWVuZGVkKTtcbiAgfVxuXG4gIGlmIChjb25zaXN0ZW50V2l0aG91dENvbmZpZykge1xuICAgIHBsdWdpbnMucHVzaChjb25zaXN0ZW50KTtcbiAgfVxuXG4gIGlmIChjb25zaXN0ZW50V2l0aG91dENvbmZpZyB8fCByZWNvbW1lbmRlZFdpdGhvdXRDb25maWcpIHtcbiAgICBkZWZhdWx0Q29uZmlnID0geyBwbHVnaW5zIH07XG4gIH1cblxuICByZXR1cm4gZW5naW5lKHtcbiAgICBwcm9jZXNzb3IsXG4gICAgZGV0ZWN0SWdub3JlLFxuICAgIGRlZmF1bHRDb25maWcsXG4gICAgcmNOYW1lOiAnLnJlbWFya3JjJyxcbiAgICBwYWNrYWdlRmllbGQ6ICdyZW1hcmtDb25maWcnLFxuICAgIGlnbm9yZU5hbWU6ICcucmVtYXJraWdub3JlJyxcbiAgICBwbHVnaW5QcmVmaXg6ICdyZW1hcmsnXG4gIH0pKGVkaXRvcik7XG59XG5cbi8qKlxuICogTGludGVyLW1hcmtkb3duLlxuICpcbiAqIEByZXR1cm4ge0xpbnRlckNvbmZpZ3VyYXRpb259XG4gKi9cbmZ1bmN0aW9uIHByb3ZpZGVMaW50ZXIoKSB7XG4gIHJldHVybiB7XG4gICAgZ3JhbW1hclNjb3Blczogc2NvcGVzLFxuICAgIG5hbWU6ICdyZW1hcmstbGludCcsXG4gICAgc2NvcGU6ICdmaWxlJyxcbiAgICBsaW50c09uQ2hhbmdlOiB0cnVlLFxuICAgIGxpbnRcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gIGxldCBjYWxsYmFja0lEO1xuICBjb25zdCBpbnN0YWxsTGludGVyTWFya2Rvd25EZXBzID0gKCkgPT4ge1xuICAgIGlkbGVDYWxsYmFja3MuZGVsZXRlKGNhbGxiYWNrSUQpO1xuXG4gICAgLy8gSW5zdGFsbCBwYWNrYWdlIGRlcGVuZGVuY2llc1xuICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLW1hcmtkb3duJyk7XG4gICAgfVxuICAgIC8vIExvYWQgcmVxdWlyZWQgbW9kdWxlc1xuICAgIGxvYWREZXBzKCk7XG4gIH07XG5cbiAgLy8gRGVmZXIgdGhpcyB0aWxsIGFuIGlkbGUgdGltZSBhcyB3ZSBkb24ndCBuZWVkIGl0IGltbWVkaWF0ZWx5XG4gIGNhbGxiYWNrSUQgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhpbnN0YWxsTGludGVyTWFya2Rvd25EZXBzKTtcbiAgaWRsZUNhbGxiYWNrcy5hZGQoY2FsbGJhY2tJRCk7XG5cbiAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLW1hcmtkb3duLnByZXNldFJlY29tbWVuZGVkV2l0aG91dENvbmZpZycsICh2YWx1ZSkgPT4ge1xuICAgIHJlY29tbWVuZGVkV2l0aG91dENvbmZpZyA9IHZhbHVlO1xuICB9KSk7XG4gIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1tYXJrZG93bi5wcmVzZXRDb25zaXN0ZW50V2l0aG91dENvbmZpZycsICh2YWx1ZSkgPT4ge1xuICAgIGNvbnNpc3RlbnRXaXRob3V0Q29uZmlnID0gdmFsdWU7XG4gIH0pKTtcbiAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLW1hcmtkb3duLnNjb3BlcycsICh2YWx1ZSkgPT4ge1xuICAgIHNjb3BlcyA9IHZhbHVlO1xuICB9KSk7XG4gIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1tYXJrZG93bi5kZXRlY3RJZ25vcmUnLCAodmFsdWUpID0+IHtcbiAgICBkZXRlY3RJZ25vcmUgPSB2YWx1ZTtcbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICBpZGxlQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2tJRCA9PiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKGNhbGxiYWNrSUQpKTtcbiAgaWRsZUNhbGxiYWNrcy5jbGVhcigpO1xuICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbn1cblxuLypcbiAqIEV4cG9zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFjdGl2YXRlLFxuICBkZWFjdGl2YXRlLFxuICBwcm92aWRlTGludGVyXG59O1xuIl19