var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _dock = require('./dock');

var _dock2 = _interopRequireDefault(_dock);

var Panel = (function () {
  function Panel() {
    var _this = this;

    _classCallCheck(this, Panel);

    this.panel = null;
    this.element = document.createElement('div');
    this.delegate = new _delegate2['default']();
    this.deactivating = false;
    this.subscriptions = new _atom.CompositeDisposable();
    this.showPanelStateMessages = false;

    this.subscriptions.add(this.delegate);
    this.subscriptions.add(atom.config.observe('linter-ui-default.hidePanelWhenEmpty', function (hidePanelWhenEmpty) {
      _this.hidePanelWhenEmpty = hidePanelWhenEmpty;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(function (_ref) {
      var paneItem = _ref.item;

      if (paneItem instanceof _dock2['default'] && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      _this.showPanelConfig = showPanel;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function () {
      _this.showPanelStateMessages = !!_this.delegate.filteredMessages.length;
      _this.refresh();
    }));
    this.activate();
  }

  _createClass(Panel, [{
    key: 'activate',
    value: _asyncToGenerator(function* () {
      if (this.panel) {
        this.panel.dispose();
      }
      this.panel = new _dock2['default'](this.delegate);
      yield atom.workspace.open(this.panel, {
        activatePane: false,
        activateItem: false,
        searchAllPanes: true
      });
      this.refresh();
    })
  }, {
    key: 'update',
    value: function update(messages) {
      this.delegate.update(messages);
      this.showPanelStateMessages = !!this.delegate.filteredMessages.length;
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: _asyncToGenerator(function* () {
      if (this.panel === null) {
        if (this.showPanelConfig) {
          yield this.activate();
        }
        return;
      }
      var paneContainer = atom.workspace.paneContainerForItem(this.panel);
      if (!paneContainer || paneContainer.location !== 'bottom') {
        return;
      }
      if (this.showPanelConfig && (!this.hidePanelWhenEmpty || this.showPanelStateMessages)) {
        paneContainer.show();
      } else {
        paneContainer.hide();
      }
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.deactivating = true;
      if (this.panel) {
        this.panel.dispose();
      }
      this.subscriptions.dispose();
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3dCQUNyQixZQUFZOzs7O29CQUNYLFFBQVE7Ozs7SUFHeEIsS0FBSztBQVNFLFdBVFAsS0FBSyxHQVNLOzs7MEJBVFYsS0FBSzs7QUFVUCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQTs7QUFFbkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxFQUFFLFVBQUMsa0JBQWtCLEVBQUs7QUFDekcsWUFBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtBQUM1QyxZQUFLLE9BQU8sRUFBRSxDQUFBO0tBQ2YsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLFVBQUMsSUFBa0IsRUFBSztVQUFmLFFBQVEsR0FBaEIsSUFBa0IsQ0FBaEIsSUFBSTs7QUFDaEUsVUFBSSxRQUFRLDZCQUFxQixJQUFJLENBQUMsTUFBSyxZQUFZLEVBQUU7QUFDdkQsY0FBSyxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLEtBQUssQ0FBQyxDQUFBO09BQ3REO0tBQ0YsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsRUFBRSxVQUFDLFNBQVMsRUFBSztBQUN2RixZQUFLLGVBQWUsR0FBRyxTQUFTLENBQUE7QUFDaEMsWUFBSyxPQUFPLEVBQUUsQ0FBQTtLQUNmLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxZQUFNO0FBQ2hFLFlBQUssc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLE1BQUssUUFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQTtBQUNyRSxZQUFLLE9BQU8sRUFBRSxDQUFBO0tBQ2YsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7R0FDaEI7O2VBckNHLEtBQUs7OzZCQXNDSyxhQUFHO0FBQ2YsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksQ0FBQyxLQUFLLEdBQUcsc0JBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3pDLFlBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNwQyxvQkFBWSxFQUFFLEtBQUs7QUFDbkIsb0JBQVksRUFBRSxLQUFLO0FBQ25CLHNCQUFjLEVBQUUsSUFBSTtPQUNyQixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDZjs7O1dBQ0ssZ0JBQUMsUUFBOEIsRUFBUTtBQUMzQyxVQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5QixVQUFJLENBQUMsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFBO0FBQ3JFLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNmOzs7NkJBQ1ksYUFBRztBQUNkLFVBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDdkIsWUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3hCLGdCQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtTQUN0QjtBQUNELGVBQU07T0FDUDtBQUNELFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3JFLFVBQUksQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7QUFDekQsZUFBTTtPQUNQO0FBQ0QsVUFDRSxBQUFDLElBQUksQ0FBQyxlQUFlLEtBQ3BCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQSxBQUFDLEVBQ3pEO0FBQ0EscUJBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNyQixNQUFNO0FBQ0wscUJBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNyQjtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ3hCLFVBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDckI7QUFDRCxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FqRkcsS0FBSzs7O0FBb0ZYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IFBhbmVsRG9jayBmcm9tICcuL2RvY2snXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuY2xhc3MgUGFuZWwge1xuICBwYW5lbDogP1BhbmVsRG9jaztcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIGRlbGVnYXRlOiBEZWxlZ2F0ZTtcbiAgZGVhY3RpdmF0aW5nOiBib29sZWFuO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBzaG93UGFuZWxDb25maWc6IGJvb2xlYW47XG4gIGhpZGVQYW5lbFdoZW5FbXB0eTogYm9vbGVhbjtcbiAgc2hvd1BhbmVsU3RhdGVNZXNzYWdlczogYm9vbGVhbjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMuZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUoKVxuICAgIHRoaXMuZGVhY3RpdmF0aW5nID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzID0gZmFsc2VcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5kZWxlZ2F0ZSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LmhpZGVQYW5lbFdoZW5FbXB0eScsIChoaWRlUGFuZWxXaGVuRW1wdHkpID0+IHtcbiAgICAgIHRoaXMuaGlkZVBhbmVsV2hlbkVtcHR5ID0gaGlkZVBhbmVsV2hlbkVtcHR5XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0oKHsgaXRlbTogcGFuZUl0ZW0gfSkgPT4ge1xuICAgICAgaWYgKHBhbmVJdGVtIGluc3RhbmNlb2YgUGFuZWxEb2NrICYmICF0aGlzLmRlYWN0aXZhdGluZykge1xuICAgICAgICB0aGlzLnBhbmVsID0gbnVsbFxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIGZhbHNlKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgKHNob3dQYW5lbCkgPT4ge1xuICAgICAgdGhpcy5zaG93UGFuZWxDb25maWcgPSBzaG93UGFuZWxcbiAgICAgIHRoaXMucmVmcmVzaCgpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0oKCkgPT4ge1xuICAgICAgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzID0gISF0aGlzLmRlbGVnYXRlLmZpbHRlcmVkTWVzc2FnZXMubGVuZ3RoXG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0pKVxuICAgIHRoaXMuYWN0aXZhdGUoKVxuICB9XG4gIGFzeW5jIGFjdGl2YXRlKCkge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnBhbmVsID0gbmV3IFBhbmVsRG9jayh0aGlzLmRlbGVnYXRlKVxuICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5wYW5lbCwge1xuICAgICAgYWN0aXZhdGVQYW5lOiBmYWxzZSxcbiAgICAgIGFjdGl2YXRlSXRlbTogZmFsc2UsXG4gICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZSxcbiAgICB9KVxuICAgIHRoaXMucmVmcmVzaCgpXG4gIH1cbiAgdXBkYXRlKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPik6IHZvaWQge1xuICAgIHRoaXMuZGVsZWdhdGUudXBkYXRlKG1lc3NhZ2VzKVxuICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA9ICEhdGhpcy5kZWxlZ2F0ZS5maWx0ZXJlZE1lc3NhZ2VzLmxlbmd0aFxuICAgIHRoaXMucmVmcmVzaCgpXG4gIH1cbiAgYXN5bmMgcmVmcmVzaCgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCA9PT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuc2hvd1BhbmVsQ29uZmlnKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWN0aXZhdGUoKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHBhbmVDb250YWluZXIgPSBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9ySXRlbSh0aGlzLnBhbmVsKVxuICAgIGlmICghcGFuZUNvbnRhaW5lciB8fCBwYW5lQ29udGFpbmVyLmxvY2F0aW9uICE9PSAnYm90dG9tJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChcbiAgICAgICh0aGlzLnNob3dQYW5lbENvbmZpZykgJiZcbiAgICAgICghdGhpcy5oaWRlUGFuZWxXaGVuRW1wdHkgfHwgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzKVxuICAgICkge1xuICAgICAgcGFuZUNvbnRhaW5lci5zaG93KClcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZUNvbnRhaW5lci5oaWRlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmRlYWN0aXZhdGluZyA9IHRydWVcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxcbiJdfQ==