(function() {
  var GitLog, LogListView, git, logFileURI, pathToRepoFile, ref, repo, view;

  git = require('../../lib/git');

  ref = require('../fixtures'), repo = ref.repo, pathToRepoFile = ref.pathToRepoFile;

  GitLog = require('../../lib/models/git-log');

  LogListView = require('../../lib/views/log-list-view');

  view = new LogListView;

  logFileURI = 'atom://git-plus:log';

  describe("GitLog", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(view));
      spyOn(atom.workspace, 'addOpener');
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn({
        getPath: function() {
          return pathToRepoFile;
        }
      });
      spyOn(view, 'branchLog');
      return waitsForPromise(function() {
        return GitLog(repo);
      });
    });
    it("adds a custom opener for the log file URI", function() {
      return expect(atom.workspace.addOpener).toHaveBeenCalled();
    });
    it("opens the log file URI", function() {
      return expect(atom.workspace.open).toHaveBeenCalledWith(logFileURI);
    });
    it("calls branchLog on the view", function() {
      return expect(view.branchLog).toHaveBeenCalledWith(repo);
    });
    return describe("when 'onlyCurrentFile' option is true", function() {
      return it("calls currentFileLog on the view", function() {
        spyOn(view, 'currentFileLog');
        waitsForPromise(function() {
          return GitLog(repo, {
            onlyCurrentFile: true
          });
        });
        return runs(function() {
          return expect(view.currentFileLog).toHaveBeenCalledWith(repo, repo.relativize(pathToRepoFile));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1sb2ctc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUjs7RUFDTixNQUF5QixPQUFBLENBQVEsYUFBUixDQUF6QixFQUFDLGVBQUQsRUFBTzs7RUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLDBCQUFSOztFQUNULFdBQUEsR0FBYyxPQUFBLENBQVEsK0JBQVI7O0VBRWQsSUFBQSxHQUFPLElBQUk7O0VBQ1gsVUFBQSxHQUFhOztFQUViLFFBQUEsQ0FBUyxRQUFULEVBQW1CLFNBQUE7SUFDakIsVUFBQSxDQUFXLFNBQUE7TUFDVCxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsTUFBdEIsQ0FBNkIsQ0FBQyxTQUE5QixDQUF3QyxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixDQUF4QztNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixXQUF0QjtNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixxQkFBdEIsQ0FBNEMsQ0FBQyxTQUE3QyxDQUF1RDtRQUFFLE9BQUEsRUFBUyxTQUFBO2lCQUFHO1FBQUgsQ0FBWDtPQUF2RDtNQUNBLEtBQUEsQ0FBTSxJQUFOLEVBQVksV0FBWjthQUNBLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLE1BQUEsQ0FBTyxJQUFQO01BQUgsQ0FBaEI7SUFMUyxDQUFYO0lBT0EsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUE7YUFDOUMsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBdEIsQ0FBZ0MsQ0FBQyxnQkFBakMsQ0FBQTtJQUQ4QyxDQUFoRDtJQUdBLEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBO2FBQzNCLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXRCLENBQTJCLENBQUMsb0JBQTVCLENBQWlELFVBQWpEO0lBRDJCLENBQTdCO0lBR0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFaLENBQXNCLENBQUMsb0JBQXZCLENBQTRDLElBQTVDO0lBRGdDLENBQWxDO1dBR0EsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUE7YUFDaEQsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUE7UUFDckMsS0FBQSxDQUFNLElBQU4sRUFBWSxnQkFBWjtRQUNBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFBRyxNQUFBLENBQU8sSUFBUCxFQUFhO1lBQUEsZUFBQSxFQUFpQixJQUFqQjtXQUFiO1FBQUgsQ0FBaEI7ZUFDQSxJQUFBLENBQUssU0FBQTtpQkFDSCxNQUFBLENBQU8sSUFBSSxDQUFDLGNBQVosQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FBaUQsSUFBakQsRUFBdUQsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBdkQ7UUFERyxDQUFMO01BSHFDLENBQXZDO0lBRGdELENBQWxEO0VBakJpQixDQUFuQjtBQVJBIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vLi4vbGliL2dpdCdcbntyZXBvLCBwYXRoVG9SZXBvRmlsZX0gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbkdpdExvZyA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LWxvZydcbkxvZ0xpc3RWaWV3ID0gcmVxdWlyZSAnLi4vLi4vbGliL3ZpZXdzL2xvZy1saXN0LXZpZXcnXG5cbnZpZXcgPSBuZXcgTG9nTGlzdFZpZXdcbmxvZ0ZpbGVVUkkgPSAnYXRvbTovL2dpdC1wbHVzOmxvZydcblxuZGVzY3JpYmUgXCJHaXRMb2dcIiwgLT5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnb3BlbicpLmFuZFJldHVybiBQcm9taXNlLnJlc29sdmUgdmlld1xuICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnYWRkT3BlbmVyJylcbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ2dldEFjdGl2ZVRleHRFZGl0b3InKS5hbmRSZXR1cm4geyBnZXRQYXRoOiAtPiBwYXRoVG9SZXBvRmlsZSB9XG4gICAgc3B5T24odmlldywgJ2JyYW5jaExvZycpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdExvZyByZXBvXG5cbiAgaXQgXCJhZGRzIGEgY3VzdG9tIG9wZW5lciBmb3IgdGhlIGxvZyBmaWxlIFVSSVwiLCAtPlxuICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGl0IFwib3BlbnMgdGhlIGxvZyBmaWxlIFVSSVwiLCAtPlxuICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBsb2dGaWxlVVJJXG5cbiAgaXQgXCJjYWxscyBicmFuY2hMb2cgb24gdGhlIHZpZXdcIiwgLT5cbiAgICBleHBlY3Qodmlldy5icmFuY2hMb2cpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIHJlcG9cblxuICBkZXNjcmliZSBcIndoZW4gJ29ubHlDdXJyZW50RmlsZScgb3B0aW9uIGlzIHRydWVcIiwgLT5cbiAgICBpdCBcImNhbGxzIGN1cnJlbnRGaWxlTG9nIG9uIHRoZSB2aWV3XCIsIC0+XG4gICAgICBzcHlPbih2aWV3LCAnY3VycmVudEZpbGVMb2cnKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdExvZyByZXBvLCBvbmx5Q3VycmVudEZpbGU6IHRydWVcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHZpZXcuY3VycmVudEZpbGVMb2cpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIHJlcG8sIHJlcG8ucmVsYXRpdml6ZSBwYXRoVG9SZXBvRmlsZVxuIl19
