(function() {
  var Emitter;

  Emitter = require('atom').Emitter;

  module.exports = {
    openPath: function(path, callback) {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.workspace.open(path);
      });
      return runs(function() {
        return callback(atom.views.getView(atom.workspace.getActivePaneItem()));
      });
    },
    rowRangeFrom: function(marker) {
      return [marker.getTailBufferPosition().row, marker.getHeadBufferPosition().row];
    },
    pkgEmitter: function() {
      var emitter;
      emitter = new Emitter;
      return {
        onDidResolveConflict: function(callback) {
          return emitter.on('did-resolve-conflict', callback);
        },
        didResolveConflict: function(event) {
          return emitter.emit('did-resolve-conflict', event);
        },
        onDidResolveFile: function(callback) {
          return emitter.on('did-resolve-file', callback);
        },
        didResolveFile: function(event) {
          return emitter.emit('did-resolve-file', event);
        },
        onDidQuitConflictResolution: function(callback) {
          return emitter.on('did-quit-conflict-resolution', callback);
        },
        didQuitConflictResolution: function() {
          return emitter.emit('did-quit-conflict-resolution');
        },
        onDidCompleteConflictResolution: function(callback) {
          return emitter.on('did-complete-conflict-resolution', callback);
        },
        didCompleteConflictResolution: function() {
          return emitter.emit('did-complete-conflict-resolution');
        },
        dispose: function() {
          return emitter.dispose();
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL3V0aWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxJQUFELEVBQU8sUUFBUDtBQUNSLFVBQUE7TUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO01BQ25CLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQjtNQUVBLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFwQjtNQUFILENBQWhCO2FBRUEsSUFBQSxDQUFLLFNBQUE7ZUFDSCxRQUFBLENBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFuQixDQUFUO01BREcsQ0FBTDtJQU5RLENBQVY7SUFTQSxZQUFBLEVBQWMsU0FBQyxNQUFEO2FBQ1osQ0FBQyxNQUFNLENBQUMscUJBQVAsQ0FBQSxDQUE4QixDQUFDLEdBQWhDLEVBQXFDLE1BQU0sQ0FBQyxxQkFBUCxDQUFBLENBQThCLENBQUMsR0FBcEU7SUFEWSxDQVRkO0lBWUEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsT0FBQSxHQUFVLElBQUk7QUFFZCxhQUFPO1FBQ0wsb0JBQUEsRUFBc0IsU0FBQyxRQUFEO2lCQUFjLE9BQU8sQ0FBQyxFQUFSLENBQVcsc0JBQVgsRUFBbUMsUUFBbkM7UUFBZCxDQURqQjtRQUVMLGtCQUFBLEVBQW9CLFNBQUMsS0FBRDtpQkFBVyxPQUFPLENBQUMsSUFBUixDQUFhLHNCQUFiLEVBQXFDLEtBQXJDO1FBQVgsQ0FGZjtRQUdMLGdCQUFBLEVBQWtCLFNBQUMsUUFBRDtpQkFBYyxPQUFPLENBQUMsRUFBUixDQUFXLGtCQUFYLEVBQStCLFFBQS9CO1FBQWQsQ0FIYjtRQUlMLGNBQUEsRUFBZ0IsU0FBQyxLQUFEO2lCQUFXLE9BQU8sQ0FBQyxJQUFSLENBQWEsa0JBQWIsRUFBaUMsS0FBakM7UUFBWCxDQUpYO1FBS0wsMkJBQUEsRUFBNkIsU0FBQyxRQUFEO2lCQUFjLE9BQU8sQ0FBQyxFQUFSLENBQVcsOEJBQVgsRUFBMkMsUUFBM0M7UUFBZCxDQUx4QjtRQU1MLHlCQUFBLEVBQTJCLFNBQUE7aUJBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSw4QkFBYjtRQUFILENBTnRCO1FBT0wsK0JBQUEsRUFBaUMsU0FBQyxRQUFEO2lCQUFjLE9BQU8sQ0FBQyxFQUFSLENBQVcsa0NBQVgsRUFBK0MsUUFBL0M7UUFBZCxDQVA1QjtRQVFMLDZCQUFBLEVBQStCLFNBQUE7aUJBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSxrQ0FBYjtRQUFILENBUjFCO1FBU0wsT0FBQSxFQUFTLFNBQUE7aUJBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBQTtRQUFILENBVEo7O0lBSEcsQ0FaWjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIntFbWl0dGVyfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgb3BlblBhdGg6IChwYXRoLCBjYWxsYmFjaykgLT5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGgpXG5cbiAgICBydW5zIC0+XG4gICAgICBjYWxsYmFjayhhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSkpXG5cbiAgcm93UmFuZ2VGcm9tOiAobWFya2VyKSAtPlxuICAgIFttYXJrZXIuZ2V0VGFpbEJ1ZmZlclBvc2l0aW9uKCkucm93LCBtYXJrZXIuZ2V0SGVhZEJ1ZmZlclBvc2l0aW9uKCkucm93XVxuXG4gIHBrZ0VtaXR0ZXI6IC0+XG4gICAgZW1pdHRlciA9IG5ldyBFbWl0dGVyXG5cbiAgICByZXR1cm4ge1xuICAgICAgb25EaWRSZXNvbHZlQ29uZmxpY3Q6IChjYWxsYmFjaykgLT4gZW1pdHRlci5vbiAnZGlkLXJlc29sdmUtY29uZmxpY3QnLCBjYWxsYmFja1xuICAgICAgZGlkUmVzb2x2ZUNvbmZsaWN0OiAoZXZlbnQpIC0+IGVtaXR0ZXIuZW1pdCAnZGlkLXJlc29sdmUtY29uZmxpY3QnLCBldmVudFxuICAgICAgb25EaWRSZXNvbHZlRmlsZTogKGNhbGxiYWNrKSAtPiBlbWl0dGVyLm9uICdkaWQtcmVzb2x2ZS1maWxlJywgY2FsbGJhY2tcbiAgICAgIGRpZFJlc29sdmVGaWxlOiAoZXZlbnQpIC0+IGVtaXR0ZXIuZW1pdCAnZGlkLXJlc29sdmUtZmlsZScsIGV2ZW50XG4gICAgICBvbkRpZFF1aXRDb25mbGljdFJlc29sdXRpb246IChjYWxsYmFjaykgLT4gZW1pdHRlci5vbiAnZGlkLXF1aXQtY29uZmxpY3QtcmVzb2x1dGlvbicsIGNhbGxiYWNrXG4gICAgICBkaWRRdWl0Q29uZmxpY3RSZXNvbHV0aW9uOiAtPiBlbWl0dGVyLmVtaXQgJ2RpZC1xdWl0LWNvbmZsaWN0LXJlc29sdXRpb24nXG4gICAgICBvbkRpZENvbXBsZXRlQ29uZmxpY3RSZXNvbHV0aW9uOiAoY2FsbGJhY2spIC0+IGVtaXR0ZXIub24gJ2RpZC1jb21wbGV0ZS1jb25mbGljdC1yZXNvbHV0aW9uJywgY2FsbGJhY2tcbiAgICAgIGRpZENvbXBsZXRlQ29uZmxpY3RSZXNvbHV0aW9uOiAtPiBlbWl0dGVyLmVtaXQgJ2RpZC1jb21wbGV0ZS1jb25mbGljdC1yZXNvbHV0aW9uJ1xuICAgICAgZGlzcG9zZTogLT4gZW1pdHRlci5kaXNwb3NlKClcbiAgICB9XG4iXX0=
