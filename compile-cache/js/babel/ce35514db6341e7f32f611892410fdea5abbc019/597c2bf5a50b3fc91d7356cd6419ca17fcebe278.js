Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

exports['default'] = {
  activate: function activate() {
    this.intentions = new _main2['default']();
    this.intentions.activate();
  },
  deactivate: function deactivate() {
    this.intentions.dispose();
  },
  consumeListIntentions: function consumeListIntentions(provider) {
    var _this = this;

    var providers = [].concat(provider);
    providers.forEach(function (entry) {
      _this.intentions.consumeListProvider(entry);
    });
    return new _atom.Disposable(function () {
      providers.forEach(function (entry) {
        _this.intentions.deleteListProvider(entry);
      });
    });
  },
  consumeHighlightIntentions: function consumeHighlightIntentions(provider) {
    var _this2 = this;

    var providers = [].concat(provider);
    providers.forEach(function (entry) {
      _this2.intentions.consumeHighlightProvider(entry);
    });
    return new _atom.Disposable(function () {
      providers.forEach(function (entry) {
        _this2.intentions.deleteHighlightProvider(entry);
      });
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRTJCLE1BQU07O29CQUNWLFFBQVE7Ozs7cUJBR2hCO0FBQ2IsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBSSxDQUFDLFVBQVUsR0FBRyx1QkFBZ0IsQ0FBQTtBQUNsQyxRQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFBO0dBQzNCO0FBQ0QsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUMxQjtBQUNELHVCQUFxQixFQUFBLCtCQUFDLFFBQTRDLEVBQUU7OztBQUNsRSxRQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLGFBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDekIsWUFBSyxVQUFVLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDM0MsQ0FBQyxDQUFBO0FBQ0YsV0FBTyxxQkFBZSxZQUFNO0FBQzFCLGVBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDekIsY0FBSyxVQUFVLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDMUMsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0g7QUFDRCw0QkFBMEIsRUFBQSxvQ0FBQyxRQUFzRCxFQUFFOzs7QUFDakYsUUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxhQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ3pCLGFBQUssVUFBVSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ2hELENBQUMsQ0FBQTtBQUNGLFdBQU8scUJBQWUsWUFBTTtBQUMxQixlQUFTLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ3pCLGVBQUssVUFBVSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFBO09BQy9DLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtHQUNIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgSW50ZW50aW9ucyBmcm9tICcuL21haW4nXG5pbXBvcnQgdHlwZSB7IExpc3RQcm92aWRlciwgSGlnaGxpZ2h0UHJvdmlkZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuaW50ZW50aW9ucyA9IG5ldyBJbnRlbnRpb25zKClcbiAgICB0aGlzLmludGVudGlvbnMuYWN0aXZhdGUoKVxuICB9LFxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaW50ZW50aW9ucy5kaXNwb3NlKClcbiAgfSxcbiAgY29uc3VtZUxpc3RJbnRlbnRpb25zKHByb3ZpZGVyOiBMaXN0UHJvdmlkZXIgfCBBcnJheTxMaXN0UHJvdmlkZXI+KSB7XG4gICAgY29uc3QgcHJvdmlkZXJzID0gW10uY29uY2F0KHByb3ZpZGVyKVxuICAgIHByb3ZpZGVycy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIHRoaXMuaW50ZW50aW9ucy5jb25zdW1lTGlzdFByb3ZpZGVyKGVudHJ5KVxuICAgIH0pXG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIHByb3ZpZGVycy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgdGhpcy5pbnRlbnRpb25zLmRlbGV0ZUxpc3RQcm92aWRlcihlbnRyeSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbiAgY29uc3VtZUhpZ2hsaWdodEludGVudGlvbnMocHJvdmlkZXI6IEhpZ2hsaWdodFByb3ZpZGVyIHwgQXJyYXk8SGlnaGxpZ2h0UHJvdmlkZXI+KSB7XG4gICAgY29uc3QgcHJvdmlkZXJzID0gW10uY29uY2F0KHByb3ZpZGVyKVxuICAgIHByb3ZpZGVycy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIHRoaXMuaW50ZW50aW9ucy5jb25zdW1lSGlnaGxpZ2h0UHJvdmlkZXIoZW50cnkpXG4gICAgfSlcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgcHJvdmlkZXJzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICB0aGlzLmludGVudGlvbnMuZGVsZXRlSGlnaGxpZ2h0UHJvdmlkZXIoZW50cnkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG59XG4iXX0=