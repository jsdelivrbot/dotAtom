function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var linterUiDefault = {
  instances: new Set(),
  signalRegistry: null,
  statusBarRegistry: null,
  activate: function activate() {
    if (atom.config.get('linter-ui-default.useBusySignal')) {
      // This is a necessary evil, see steelbrain/linter#1355
      atom.packages.getLoadedPackage('linter-ui-default').metadata['package-deps'].push('busy-signal');
    }

    if (!atom.inSpecMode()) {
      // eslint-disable-next-line global-require
      require('atom-package-deps').install('linter-ui-default', true);
    }
  },
  deactivate: function deactivate() {
    for (var entry of this.instances) {
      entry.dispose();
    }
    this.instances.clear();
  },
  provideUI: function provideUI() {
    var instance = new _main2['default']();
    this.instances.add(instance);
    if (this.signalRegistry) {
      instance.signal.attach(this.signalRegistry);
    }
    return instance;
  },
  provideIntentions: function provideIntentions() {
    return Array.from(this.instances).map(function (entry) {
      return entry.intentions;
    });
  },
  consumeSignal: function consumeSignal(signalRegistry) {
    this.signalRegistry = signalRegistry;
    this.instances.forEach(function (instance) {
      instance.signal.attach(signalRegistry);
    });
  },
  consumeStatusBar: function consumeStatusBar(statusBarRegistry) {
    this.statusBarRegistry = statusBarRegistry;
    this.instances.forEach(function (instance) {
      instance.statusBar.attach(statusBarRegistry);
    });
  }
};

module.exports = linterUiDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7b0JBRXFCLFFBQVE7Ozs7QUFHN0IsSUFBTSxlQUFlLEdBQUc7QUFDdEIsV0FBUyxFQUFFLElBQUksR0FBRyxFQUFFO0FBQ3BCLGdCQUFjLEVBQUUsSUFBSTtBQUNwQixtQkFBaUIsRUFBRSxJQUFJO0FBQ3ZCLFVBQVEsRUFBQSxvQkFBRztBQUNULFFBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsRUFBRTs7QUFFdEQsVUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7S0FDakc7O0FBRUQsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTs7QUFFdEIsYUFBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ2hFO0dBQ0Y7QUFDRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxTQUFLLElBQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEMsV0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ2hCO0FBQ0QsUUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtHQUN2QjtBQUNELFdBQVMsRUFBQSxxQkFBYTtBQUNwQixRQUFNLFFBQVEsR0FBRyx1QkFBYyxDQUFBO0FBQy9CLFFBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzVCLFFBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN2QixjQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7S0FDNUM7QUFDRCxXQUFPLFFBQVEsQ0FBQTtHQUNoQjtBQUNELG1CQUFpQixFQUFBLDZCQUFzQjtBQUNyQyxXQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7YUFBSSxLQUFLLENBQUMsVUFBVTtLQUFBLENBQUMsQ0FBQTtHQUNqRTtBQUNELGVBQWEsRUFBQSx1QkFBQyxjQUFzQixFQUFFO0FBQ3BDLFFBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUSxFQUFFO0FBQ3hDLGNBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0tBQ3ZDLENBQUMsQ0FBQTtHQUNIO0FBQ0Qsa0JBQWdCLEVBQUEsMEJBQUMsaUJBQXlCLEVBQUU7QUFDMUMsUUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFBO0FBQzFDLFFBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUSxFQUFFO0FBQ3hDLGNBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUE7S0FDN0MsQ0FBQyxDQUFBO0dBQ0g7Q0FDRixDQUFBOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgTGludGVyVUkgZnJvbSAnLi9tYWluJ1xuaW1wb3J0IHR5cGUgSW50ZW50aW9ucyBmcm9tICcuL2ludGVudGlvbnMnXG5cbmNvbnN0IGxpbnRlclVpRGVmYXVsdCA9IHtcbiAgaW5zdGFuY2VzOiBuZXcgU2V0KCksXG4gIHNpZ25hbFJlZ2lzdHJ5OiBudWxsLFxuICBzdGF0dXNCYXJSZWdpc3RyeTogbnVsbCxcbiAgYWN0aXZhdGUoKSB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnbGludGVyLXVpLWRlZmF1bHQudXNlQnVzeVNpZ25hbCcpKSB7XG4gICAgICAvLyBUaGlzIGlzIGEgbmVjZXNzYXJ5IGV2aWwsIHNlZSBzdGVlbGJyYWluL2xpbnRlciMxMzU1XG4gICAgICBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ2xpbnRlci11aS1kZWZhdWx0JykubWV0YWRhdGFbJ3BhY2thZ2UtZGVwcyddLnB1c2goJ2J1c3ktc2lnbmFsJylcbiAgICB9XG5cbiAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLXVpLWRlZmF1bHQnLCB0cnVlKVxuICAgIH1cbiAgfSxcbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuaW5zdGFuY2VzKSB7XG4gICAgICBlbnRyeS5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5pbnN0YW5jZXMuY2xlYXIoKVxuICB9LFxuICBwcm92aWRlVUkoKTogTGludGVyVUkge1xuICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IExpbnRlclVJKClcbiAgICB0aGlzLmluc3RhbmNlcy5hZGQoaW5zdGFuY2UpXG4gICAgaWYgKHRoaXMuc2lnbmFsUmVnaXN0cnkpIHtcbiAgICAgIGluc3RhbmNlLnNpZ25hbC5hdHRhY2godGhpcy5zaWduYWxSZWdpc3RyeSlcbiAgICB9XG4gICAgcmV0dXJuIGluc3RhbmNlXG4gIH0sXG4gIHByb3ZpZGVJbnRlbnRpb25zKCk6IEFycmF5PEludGVudGlvbnM+IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmluc3RhbmNlcykubWFwKGVudHJ5ID0+IGVudHJ5LmludGVudGlvbnMpXG4gIH0sXG4gIGNvbnN1bWVTaWduYWwoc2lnbmFsUmVnaXN0cnk6IE9iamVjdCkge1xuICAgIHRoaXMuc2lnbmFsUmVnaXN0cnkgPSBzaWduYWxSZWdpc3RyeVxuICAgIHRoaXMuaW5zdGFuY2VzLmZvckVhY2goZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICAgIGluc3RhbmNlLnNpZ25hbC5hdHRhY2goc2lnbmFsUmVnaXN0cnkpXG4gICAgfSlcbiAgfSxcbiAgY29uc3VtZVN0YXR1c0JhcihzdGF0dXNCYXJSZWdpc3RyeTogT2JqZWN0KSB7XG4gICAgdGhpcy5zdGF0dXNCYXJSZWdpc3RyeSA9IHN0YXR1c0JhclJlZ2lzdHJ5XG4gICAgdGhpcy5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbihpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2Uuc3RhdHVzQmFyLmF0dGFjaChzdGF0dXNCYXJSZWdpc3RyeSlcbiAgICB9KVxuICB9LFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpbnRlclVpRGVmYXVsdFxuIl19