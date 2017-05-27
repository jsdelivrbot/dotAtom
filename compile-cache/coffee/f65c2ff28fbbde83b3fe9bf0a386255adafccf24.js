(function() {
  var CompositeDisposable, Expose, ExposeView;

  CompositeDisposable = require('atom').CompositeDisposable;

  ExposeView = require('./expose-view');

  module.exports = Expose = {
    exposeView: null,
    modalPanel: null,
    config: {
      useAnimations: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      this.exposeView = new ExposeView;
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.exposeView,
        visible: false,
        className: 'expose-panel'
      });
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.modalPanel.onDidChangeVisible((function(_this) {
        return function(visible) {
          var workspaceElement, workspaceView;
          _this.exposeView.didChangeVisible(visible);
          workspaceView = atom.views.getView(atom.workspace);
          workspaceElement = workspaceView.getElementsByTagName('atom-workspace-axis')[0];
          if (!atom.config.get('expose.useAnimations')) {
            visible = false;
          }
          return workspaceElement.classList.toggle('expose-blur', visible);
        };
      })(this)));
      return this.disposables.add(atom.commands.add('atom-workspace', {
        'expose:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.exposeView.destroy();
      this.modalPanel.destroy();
      return this.disposables.dispose();
    },
    toggle: function() {
      if (this.modalPanel.isVisible()) {
        return this.exposeView.exposeHide();
      } else {
        return this.modalPanel.show();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2V4cG9zZS9saWIvZXhwb3NlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBQSxHQUNmO0lBQUEsVUFBQSxFQUFZLElBQVo7SUFDQSxVQUFBLEVBQVksSUFEWjtJQUdBLE1BQUEsRUFDRTtNQUFBLGFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BREY7S0FKRjtJQVFBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJO01BQ2xCLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1FBQUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxVQUFQO1FBQW1CLE9BQUEsRUFBUyxLQUE1QjtRQUFtQyxTQUFBLEVBQVcsY0FBOUM7T0FBN0I7TUFFZCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFFbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsa0JBQVosQ0FBK0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7QUFDOUMsY0FBQTtVQUFBLEtBQUMsQ0FBQSxVQUFVLENBQUMsZ0JBQVosQ0FBNkIsT0FBN0I7VUFLQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7VUFDaEIsZ0JBQUEsR0FBbUIsYUFBYSxDQUFDLG9CQUFkLENBQW1DLHFCQUFuQyxDQUEwRCxDQUFBLENBQUE7VUFDN0UsSUFBQSxDQUF1QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLENBQXZCO1lBQUEsT0FBQSxHQUFVLE1BQVY7O2lCQUNBLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUEzQixDQUFrQyxhQUFsQyxFQUFpRCxPQUFqRDtRQVQ4QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0IsQ0FBakI7YUFXQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNmO1FBQUEsZUFBQSxFQUFpQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakI7T0FEZSxDQUFqQjtJQWpCUSxDQVJWO0lBNEJBLFVBQUEsRUFBWSxTQUFBO01BQ1YsSUFBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUE7TUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO0lBSFUsQ0E1Qlo7SUFpQ0EsTUFBQSxFQUFRLFNBQUE7TUFDTixJQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFBLEVBSEY7O0lBRE0sQ0FqQ1I7O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5FeHBvc2VWaWV3ID0gcmVxdWlyZSAnLi9leHBvc2UtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSBFeHBvc2UgPVxuICBleHBvc2VWaWV3OiBudWxsXG4gIG1vZGFsUGFuZWw6IG51bGxcblxuICBjb25maWc6XG4gICAgdXNlQW5pbWF0aW9uczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBleHBvc2VWaWV3ID0gbmV3IEV4cG9zZVZpZXdcbiAgICBAbW9kYWxQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogQGV4cG9zZVZpZXcsIHZpc2libGU6IGZhbHNlLCBjbGFzc05hbWU6ICdleHBvc2UtcGFuZWwnKVxuXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQG1vZGFsUGFuZWwub25EaWRDaGFuZ2VWaXNpYmxlICh2aXNpYmxlKSA9PlxuICAgICAgQGV4cG9zZVZpZXcuZGlkQ2hhbmdlVmlzaWJsZSh2aXNpYmxlKVxuXG4gICAgICAjIEVYUEVSSU1FTlRBTDogQWRkIGJsdXIgZWZmZWN0IHRvIHdvcmtzcGFjZSB3aGVuIG1vZGFsIGlzIHZpc2libGUuXG4gICAgICAjIFRoaXMgY2FuIGJlIGRhbmdlcm91cyBpZiBvbkRpZENoYW5nZVZpc2libGUgZG9lcyBub3QgZ2V0IHRyaWdnZXJlZFxuICAgICAgIyBmb3Igc29tZSByZWFzb24uIFRoZW4gdGhlIGJsdXIgZWZmZWN0IGlzIHBlcnNpc3RlbnQgb24gdGhlIHdvcmtzcGFjZS5cbiAgICAgIHdvcmtzcGFjZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgYXRvbS53b3Jrc3BhY2VcbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSB3b3Jrc3BhY2VWaWV3LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhdG9tLXdvcmtzcGFjZS1heGlzJylbMF1cbiAgICAgIHZpc2libGUgPSBmYWxzZSB1bmxlc3MgYXRvbS5jb25maWcuZ2V0ICdleHBvc2UudXNlQW5pbWF0aW9ucydcbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnZXhwb3NlLWJsdXInLCB2aXNpYmxlKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2V4cG9zZTp0b2dnbGUnOiA9PiBAdG9nZ2xlKClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBleHBvc2VWaWV3LmRlc3Ryb3koKVxuICAgIEBtb2RhbFBhbmVsLmRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQG1vZGFsUGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBleHBvc2VWaWV3LmV4cG9zZUhpZGUoKVxuICAgIGVsc2VcbiAgICAgIEBtb2RhbFBhbmVsLnNob3coKVxuIl19
