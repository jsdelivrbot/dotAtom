var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _atom = require('atom');

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _helpers = require('../helpers');

var PanelDock = (function () {
  function PanelDock(delegate) {
    _classCallCheck(this, PanelDock);

    this.element = document.createElement('div');
    this.subscriptions = new _atom.CompositeDisposable();
    _reactDom2['default'].render(_react2['default'].createElement(_component2['default'], { delegate: delegate }), this.element);
  }

  _createClass(PanelDock, [{
    key: 'getURI',
    value: function getURI() {
      return _helpers.WORKSPACE_URI;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Linter';
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return 'bottom';
    }
  }, {
    key: 'getAllowedLocations',
    value: function getAllowedLocations() {
      return ['center', 'bottom', 'top'];
    }
  }, {
    key: 'getPreferredHeight',
    value: function getPreferredHeight() {
      return atom.config.get('linter-ui-default.panelHeight');
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      var parentElement = this.element.parentElement;
      if (parentElement) {
        var _parentElement$getBoundingClientRect = parentElement.getBoundingClientRect();

        var height = _parentElement$getBoundingClientRect.height;

        if (height > 0) {
          atom.config.set('linter-ui-default.panelHeight', height);
        }
      }

      this.subscriptions.dispose();
      var paneContainer = atom.workspace.paneContainerForItem(this);
      if (paneContainer) {
        paneContainer.paneForItem(this).destroyItem(this, true);
      }
    }
  }]);

  return PanelDock;
})();

module.exports = PanelDock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBRWtCLE9BQU87Ozs7d0JBQ0osV0FBVzs7OztvQkFDSSxNQUFNOzt5QkFFcEIsYUFBYTs7Ozt1QkFDTCxZQUFZOztJQUVwQyxTQUFTO0FBSUYsV0FKUCxTQUFTLENBSUQsUUFBZ0IsRUFBRTswQkFKMUIsU0FBUzs7QUFLWCxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QywwQkFBUyxNQUFNLENBQUMsMkRBQVcsUUFBUSxFQUFFLFFBQVEsQUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ2pFOztlQVJHLFNBQVM7O1dBU1Asa0JBQUc7QUFDUCxvQ0FBb0I7S0FDckI7OztXQUNPLG9CQUFHO0FBQ1QsYUFBTyxRQUFRLENBQUE7S0FDaEI7OztXQUNpQiw4QkFBRztBQUNuQixhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBQ2tCLCtCQUFHO0FBQ3BCLGFBQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO0tBQ25DOzs7V0FDaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0tBQ3hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFBO0FBQ2hELFVBQUksYUFBYSxFQUFFO21EQUNFLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRTs7WUFBaEQsTUFBTSx3Q0FBTixNQUFNOztBQUNkLFlBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNkLGNBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQ3pEO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQy9ELFVBQUksYUFBYSxFQUFFO0FBQ2pCLHFCQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDeEQ7S0FDRjs7O1NBdENHLFNBQVM7OztBQXlDZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvbHJhbWlyZXovLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2RvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi9jb21wb25lbnQnXG5pbXBvcnQgeyBXT1JLU1BBQ0VfVVJJIH0gZnJvbSAnLi4vaGVscGVycydcblxuY2xhc3MgUGFuZWxEb2NrIHtcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoZGVsZWdhdGU6IE9iamVjdCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIFJlYWN0RE9NLnJlbmRlcig8Q29tcG9uZW50IGRlbGVnYXRlPXtkZWxlZ2F0ZX0gLz4sIHRoaXMuZWxlbWVudClcbiAgfVxuICBnZXRVUkkoKSB7XG4gICAgcmV0dXJuIFdPUktTUEFDRV9VUklcbiAgfVxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0xpbnRlcidcbiAgfVxuICBnZXREZWZhdWx0TG9jYXRpb24oKSB7XG4gICAgcmV0dXJuICdib3R0b20nXG4gIH1cbiAgZ2V0QWxsb3dlZExvY2F0aW9ucygpIHtcbiAgICByZXR1cm4gWydjZW50ZXInLCAnYm90dG9tJywgJ3RvcCddXG4gIH1cbiAgZ2V0UHJlZmVycmVkSGVpZ2h0KCkge1xuICAgIHJldHVybiBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsSGVpZ2h0JylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgIGlmIChwYXJlbnRFbGVtZW50KSB7XG4gICAgICBjb25zdCB7IGhlaWdodCB9ID0gcGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgaWYgKGhlaWdodCA+IDApIHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5wYW5lbEhlaWdodCcsIGhlaWdodClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHRoaXMpXG4gICAgaWYgKHBhbmVDb250YWluZXIpIHtcbiAgICAgIHBhbmVDb250YWluZXIucGFuZUZvckl0ZW0odGhpcykuZGVzdHJveUl0ZW0odGhpcywgdHJ1ZSlcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbERvY2tcbiJdfQ==