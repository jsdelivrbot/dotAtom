(function() {
  var DiffBranchFilesView, RevisionView, pathToRepoFile, ref, repo;

  RevisionView = require('../../lib/views/git-revision-view');

  DiffBranchFilesView = require('../../lib/views/diff-branch-files-view');

  ref = require('../fixtures'), repo = ref.repo, pathToRepoFile = ref.pathToRepoFile;

  describe("DiffBranchFilesView", function() {
    var textEditor;
    textEditor = null;
    beforeEach(function() {
      spyOn(RevisionView, 'showRevision');
      return spyOn(atom.workspace, 'open').andCallFake(function() {
        textEditor = {
          getPath: function() {
            return atom.workspace.open.mostRecentCall.args[0];
          }
        };
        return Promise.resolve(textEditor);
      });
    });
    describe("when selectedFilePath is not provided", function() {
      var branchView;
      branchView = new DiffBranchFilesView(repo, "M\tfile.txt\nD\tanother.txt", 'branchName');
      it("displays a list of diff branch files", function() {
        return expect(branchView.items.length).toBe(2);
      });
      return it("calls RevisionView.showRevision", function() {
        waitsForPromise(function() {
          return branchView.confirmSelection();
        });
        return runs(function() {
          return expect(RevisionView.showRevision).toHaveBeenCalledWith(repo, textEditor, 'branchName');
        });
      });
    });
    return describe("when a selectedFilePath is provided", function() {
      return it("does not show the view and automatically calls RevisionView.showRevision", function() {
        var branchView;
        branchView = new DiffBranchFilesView(repo, "M\tfile.txt\nD\tanother.txt", 'branchName', pathToRepoFile);
        expect(branchView.isVisible()).toBe(false);
        waitsFor(function() {
          return RevisionView.showRevision.callCount > 0;
        });
        return runs(function() {
          expect(RevisionView.showRevision.mostRecentCall.args[0]).toBe(repo);
          expect(RevisionView.showRevision.mostRecentCall.args[1].getPath()).toBe(pathToRepoFile);
          return expect(RevisionView.showRevision.mostRecentCall.args[2]).toBe('branchName');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvZGlmZi1icmFuY2gtZmlsZXMtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxtQ0FBUjs7RUFDZixtQkFBQSxHQUFzQixPQUFBLENBQVEsd0NBQVI7O0VBQ3RCLE1BQXlCLE9BQUEsQ0FBUSxhQUFSLENBQXpCLEVBQUMsZUFBRCxFQUFPOztFQUVQLFFBQUEsQ0FBUyxxQkFBVCxFQUFnQyxTQUFBO0FBQzlCLFFBQUE7SUFBQSxVQUFBLEdBQWE7SUFFYixVQUFBLENBQVcsU0FBQTtNQUNULEtBQUEsQ0FBTSxZQUFOLEVBQW9CLGNBQXBCO2FBQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLE1BQXRCLENBQTZCLENBQUMsV0FBOUIsQ0FBMEMsU0FBQTtRQUN4QyxVQUFBLEdBQWE7VUFBQSxPQUFBLEVBQVMsU0FBQTttQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUE7VUFBM0MsQ0FBVDs7ZUFDYixPQUFPLENBQUMsT0FBUixDQUFnQixVQUFoQjtNQUZ3QyxDQUExQztJQUZTLENBQVg7SUFNQSxRQUFBLENBQVMsdUNBQVQsRUFBa0QsU0FBQTtBQUNoRCxVQUFBO01BQUEsVUFBQSxHQUFpQixJQUFBLG1CQUFBLENBQW9CLElBQXBCLEVBQTBCLDZCQUExQixFQUF5RCxZQUF6RDtNQUVqQixFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQTtlQUN6QyxNQUFBLENBQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUF4QixDQUErQixDQUFDLElBQWhDLENBQXFDLENBQXJDO01BRHlDLENBQTNDO2FBR0EsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUE7UUFDcEMsZUFBQSxDQUFnQixTQUFBO2lCQUFHLFVBQVUsQ0FBQyxnQkFBWCxDQUFBO1FBQUgsQ0FBaEI7ZUFDQSxJQUFBLENBQUssU0FBQTtpQkFDSCxNQUFBLENBQU8sWUFBWSxDQUFDLFlBQXBCLENBQWlDLENBQUMsb0JBQWxDLENBQXVELElBQXZELEVBQTZELFVBQTdELEVBQXlFLFlBQXpFO1FBREcsQ0FBTDtNQUZvQyxDQUF0QztJQU5nRCxDQUFsRDtXQVdBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBO2FBQzlDLEVBQUEsQ0FBRywwRUFBSCxFQUErRSxTQUFBO0FBQzdFLFlBQUE7UUFBQSxVQUFBLEdBQWlCLElBQUEsbUJBQUEsQ0FBb0IsSUFBcEIsRUFBMEIsNkJBQTFCLEVBQXlELFlBQXpELEVBQXVFLGNBQXZFO1FBQ2pCLE1BQUEsQ0FBTyxVQUFVLENBQUMsU0FBWCxDQUFBLENBQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxLQUFwQztRQUNBLFFBQUEsQ0FBUyxTQUFBO2lCQUFHLFlBQVksQ0FBQyxZQUFZLENBQUMsU0FBMUIsR0FBc0M7UUFBekMsQ0FBVDtlQUNBLElBQUEsQ0FBSyxTQUFBO1VBQ0gsTUFBQSxDQUFPLFlBQVksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQXJELENBQXdELENBQUMsSUFBekQsQ0FBOEQsSUFBOUQ7VUFDQSxNQUFBLENBQU8sWUFBWSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpELENBQUEsQ0FBUCxDQUFrRSxDQUFDLElBQW5FLENBQXdFLGNBQXhFO2lCQUNBLE1BQUEsQ0FBTyxZQUFZLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFyRCxDQUF3RCxDQUFDLElBQXpELENBQThELFlBQTlEO1FBSEcsQ0FBTDtNQUo2RSxDQUEvRTtJQUQ4QyxDQUFoRDtFQXBCOEIsQ0FBaEM7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbIlJldmlzaW9uVmlldyA9IHJlcXVpcmUgJy4uLy4uL2xpYi92aWV3cy9naXQtcmV2aXNpb24tdmlldydcbkRpZmZCcmFuY2hGaWxlc1ZpZXcgPSByZXF1aXJlICcuLi8uLi9saWIvdmlld3MvZGlmZi1icmFuY2gtZmlsZXMtdmlldydcbntyZXBvLCBwYXRoVG9SZXBvRmlsZX0gPSByZXF1aXJlICcuLi9maXh0dXJlcydcblxuZGVzY3JpYmUgXCJEaWZmQnJhbmNoRmlsZXNWaWV3XCIsIC0+XG4gIHRleHRFZGl0b3IgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHNweU9uKFJldmlzaW9uVmlldywgJ3Nob3dSZXZpc2lvbicpXG4gICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdvcGVuJykuYW5kQ2FsbEZha2UgLT5cbiAgICAgIHRleHRFZGl0b3IgPSBnZXRQYXRoOiAtPiBhdG9tLndvcmtzcGFjZS5vcGVuLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF1cbiAgICAgIFByb21pc2UucmVzb2x2ZSh0ZXh0RWRpdG9yKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBzZWxlY3RlZEZpbGVQYXRoIGlzIG5vdCBwcm92aWRlZFwiLCAtPlxuICAgIGJyYW5jaFZpZXcgPSBuZXcgRGlmZkJyYW5jaEZpbGVzVmlldyhyZXBvLCBcIk1cXHRmaWxlLnR4dFxcbkRcXHRhbm90aGVyLnR4dFwiLCAnYnJhbmNoTmFtZScpXG5cbiAgICBpdCBcImRpc3BsYXlzIGEgbGlzdCBvZiBkaWZmIGJyYW5jaCBmaWxlc1wiLCAtPlxuICAgICAgZXhwZWN0KGJyYW5jaFZpZXcuaXRlbXMubGVuZ3RoKS50b0JlIDJcblxuICAgIGl0IFwiY2FsbHMgUmV2aXNpb25WaWV3LnNob3dSZXZpc2lvblwiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGJyYW5jaFZpZXcuY29uZmlybVNlbGVjdGlvbigpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChSZXZpc2lvblZpZXcuc2hvd1JldmlzaW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCByZXBvLCB0ZXh0RWRpdG9yLCAnYnJhbmNoTmFtZSdcblxuICBkZXNjcmliZSBcIndoZW4gYSBzZWxlY3RlZEZpbGVQYXRoIGlzIHByb3ZpZGVkXCIsIC0+XG4gICAgaXQgXCJkb2VzIG5vdCBzaG93IHRoZSB2aWV3IGFuZCBhdXRvbWF0aWNhbGx5IGNhbGxzIFJldmlzaW9uVmlldy5zaG93UmV2aXNpb25cIiwgLT5cbiAgICAgIGJyYW5jaFZpZXcgPSBuZXcgRGlmZkJyYW5jaEZpbGVzVmlldyhyZXBvLCBcIk1cXHRmaWxlLnR4dFxcbkRcXHRhbm90aGVyLnR4dFwiLCAnYnJhbmNoTmFtZScsIHBhdGhUb1JlcG9GaWxlKVxuICAgICAgZXhwZWN0KGJyYW5jaFZpZXcuaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcbiAgICAgIHdhaXRzRm9yIC0+IFJldmlzaW9uVmlldy5zaG93UmV2aXNpb24uY2FsbENvdW50ID4gMFxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoUmV2aXNpb25WaWV3LnNob3dSZXZpc2lvbi5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdKS50b0JlKHJlcG8pXG4gICAgICAgIGV4cGVjdChSZXZpc2lvblZpZXcuc2hvd1JldmlzaW9uLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMV0uZ2V0UGF0aCgpKS50b0JlKHBhdGhUb1JlcG9GaWxlKVxuICAgICAgICBleHBlY3QoUmV2aXNpb25WaWV3LnNob3dSZXZpc2lvbi5tb3N0UmVjZW50Q2FsbC5hcmdzWzJdKS50b0JlKCdicmFuY2hOYW1lJylcbiJdfQ==
