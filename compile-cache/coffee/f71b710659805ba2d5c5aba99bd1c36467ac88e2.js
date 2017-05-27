(function() {
  var BranchListView, GitDiffBranchFiles, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitDiffBranchFiles = require('../../lib/models/git-diff-branch-files');

  BranchListView = require('../../lib/views/branch-list-view');

  repo.branch = 'branch';

  describe("GitDiffBranchFiles", function() {
    beforeEach(function() {
      return spyOn(git, 'cmd').andReturn(Promise.resolve('foobar'));
    });
    it("gets the branches", function() {
      GitDiffBranchFiles(repo);
      return expect(git.cmd).toHaveBeenCalledWith(['branch', '--no-color'], {
        cwd: repo.getWorkingDirectory()
      });
    });
    return it("creates a BranchListView", function() {
      var view;
      view = null;
      waitsForPromise(function() {
        return GitDiffBranchFiles(repo).then(function(v) {
          return view = v;
        });
      });
      return runs(function() {
        expect(view instanceof BranchListView).toBe(true);
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 1;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['diff', '--name-status', repo.branch, 'foobar'], {
            cwd: repo.getWorkingDirectory()
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1kaWZmLWJyYW5jaC1maWxlcy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsT0FBUSxPQUFBLENBQVEsYUFBUjs7RUFDVCxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVI7O0VBQ04sa0JBQUEsR0FBcUIsT0FBQSxDQUFRLHdDQUFSOztFQUNyQixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQ0FBUjs7RUFFakIsSUFBSSxDQUFDLE1BQUwsR0FBYzs7RUFFZCxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTtJQUM3QixVQUFBLENBQVcsU0FBQTthQUNULEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFFBQWhCLENBQTVCO0lBRFMsQ0FBWDtJQUdBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO01BQ3RCLGtCQUFBLENBQW1CLElBQW5CO2FBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxRQUFELEVBQVcsWUFBWCxDQUFyQyxFQUErRDtRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQS9EO0lBRnNCLENBQXhCO1dBSUEsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7QUFDN0IsVUFBQTtNQUFBLElBQUEsR0FBTztNQUNQLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLGtCQUFBLENBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBQyxDQUFEO2lCQUFPLElBQUEsR0FBTztRQUFkLENBQTlCO01BQUgsQ0FBaEI7YUFDQSxJQUFBLENBQUssU0FBQTtRQUNILE1BQUEsQ0FBTyxJQUFBLFlBQWdCLGNBQXZCLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsSUFBNUM7UUFDQSxJQUFJLENBQUMsZ0JBQUwsQ0FBQTtRQUNBLFFBQUEsQ0FBUyxTQUFBO2lCQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUixHQUFvQjtRQUF2QixDQUFUO2VBQ0EsSUFBQSxDQUFLLFNBQUE7aUJBQ0gsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxNQUFELEVBQVMsZUFBVCxFQUEwQixJQUFJLENBQUMsTUFBL0IsRUFBdUMsUUFBdkMsQ0FBckMsRUFBdUY7WUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtXQUF2RjtRQURHLENBQUw7TUFKRyxDQUFMO0lBSDZCLENBQS9CO0VBUjZCLENBQS9CO0FBUEEiLCJzb3VyY2VzQ29udGVudCI6WyJ7cmVwb30gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbmdpdCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG5HaXREaWZmQnJhbmNoRmlsZXMgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1kaWZmLWJyYW5jaC1maWxlcydcbkJyYW5jaExpc3RWaWV3ID0gcmVxdWlyZSAnLi4vLi4vbGliL3ZpZXdzL2JyYW5jaC1saXN0LXZpZXcnXG5cbnJlcG8uYnJhbmNoID0gJ2JyYW5jaCdcblxuZGVzY3JpYmUgXCJHaXREaWZmQnJhbmNoRmlsZXNcIiwgLT5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHNweU9uKGdpdCwgJ2NtZCcpLmFuZFJldHVybiBQcm9taXNlLnJlc29sdmUgJ2Zvb2JhcidcblxuICBpdCBcImdldHMgdGhlIGJyYW5jaGVzXCIsIC0+XG4gICAgR2l0RGlmZkJyYW5jaEZpbGVzKHJlcG8pXG4gICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsnYnJhbmNoJywgJy0tbm8tY29sb3InXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuXG4gIGl0IFwiY3JlYXRlcyBhIEJyYW5jaExpc3RWaWV3XCIsIC0+XG4gICAgdmlldyA9IG51bGxcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0RGlmZkJyYW5jaEZpbGVzKHJlcG8pLnRoZW4gKHYpIC0+IHZpZXcgPSB2XG4gICAgcnVucyAtPlxuICAgICAgZXhwZWN0KHZpZXcgaW5zdGFuY2VvZiBCcmFuY2hMaXN0VmlldykudG9CZSB0cnVlXG4gICAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuICAgICAgd2FpdHNGb3IgLT4gZ2l0LmNtZC5jYWxsQ291bnQgPiAxXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChnaXQuY21kKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBbJ2RpZmYnLCAnLS1uYW1lLXN0YXR1cycsIHJlcG8uYnJhbmNoLCAnZm9vYmFyJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiJdfQ==
