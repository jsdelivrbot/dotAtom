(function() {
  var BranchListView, GitDiffBranches, branches, git, quibble, repo;

  quibble = require('quibble');

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitDiffBranches = require('../../lib/models/git-diff-branches');

  BranchListView = require('../../lib/views/branch-list-view');

  repo.branch = 'master';

  branches = 'foobar';

  describe("GitDiffBranches", function() {
    beforeEach(function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve(branches));
      return spyOn(atom.workspace, 'open');
    });
    it("gets the branches", function() {
      GitDiffBranches(repo);
      return expect(git.cmd).toHaveBeenCalledWith(['branch', '--no-color'], {
        cwd: repo.getWorkingDirectory()
      });
    });
    return it("creates a BranchListView with a callback to do the diffing when a branch is selected", function() {
      var view;
      view = null;
      waitsForPromise(function() {
        return GitDiffBranches(repo).then(function(v) {
          return view = v;
        });
      });
      return runs(function() {
        expect(view instanceof BranchListView).toBe(true);
        view.confirmSelection();
        waitsFor(function() {
          return atom.workspace.open.callCount > 0;
        });
        return runs(function() {
          expect(git.cmd).toHaveBeenCalledWith(['diff', '--stat', repo.branch, 'foobar'], {
            cwd: repo.getWorkingDirectory()
          });
          return expect(atom.workspace.open).toHaveBeenCalledWith(repo.getPath() + '/atom_git_plus.diff');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1kaWZmLWJyYW5jaGVzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0VBQ1QsT0FBUSxPQUFBLENBQVEsYUFBUjs7RUFDVCxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVI7O0VBQ04sZUFBQSxHQUFrQixPQUFBLENBQVEsb0NBQVI7O0VBQ2xCLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSOztFQUVqQixJQUFJLENBQUMsTUFBTCxHQUFjOztFQUNkLFFBQUEsR0FBVzs7RUFFWCxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQTtJQUMxQixVQUFBLENBQVcsU0FBQTtNQUNULEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFFBQWhCLENBQTVCO2FBQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLE1BQXRCO0lBRlMsQ0FBWDtJQUlBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO01BQ3RCLGVBQUEsQ0FBZ0IsSUFBaEI7YUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLFFBQUQsRUFBVyxZQUFYLENBQXJDLEVBQStEO1FBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7T0FBL0Q7SUFGc0IsQ0FBeEI7V0FJQSxFQUFBLENBQUcsc0ZBQUgsRUFBMkYsU0FBQTtBQUN6RixVQUFBO01BQUEsSUFBQSxHQUFPO01BQ1AsZUFBQSxDQUFnQixTQUFBO2VBQUcsZUFBQSxDQUFnQixJQUFoQixDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUMsQ0FBRDtpQkFBTyxJQUFBLEdBQU87UUFBZCxDQUEzQjtNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFNBQUE7UUFDSCxNQUFBLENBQU8sSUFBQSxZQUFnQixjQUF2QixDQUFzQyxDQUFDLElBQXZDLENBQTRDLElBQTVDO1FBQ0EsSUFBSSxDQUFDLGdCQUFMLENBQUE7UUFDQSxRQUFBLENBQVMsU0FBQTtpQkFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFwQixHQUFnQztRQUFuQyxDQUFUO2VBQ0EsSUFBQSxDQUFLLFNBQUE7VUFDSCxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxDQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLElBQUksQ0FBQyxNQUF4QixFQUFnQyxRQUFoQyxDQUFyQyxFQUFnRjtZQUFDLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFOO1dBQWhGO2lCQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXRCLENBQTJCLENBQUMsb0JBQTVCLENBQWlELElBQUksQ0FBQyxPQUFMLENBQUEsQ0FBQSxHQUFpQixxQkFBbEU7UUFGRyxDQUFMO01BSkcsQ0FBTDtJQUh5RixDQUEzRjtFQVQwQixDQUE1QjtBQVRBIiwic291cmNlc0NvbnRlbnQiOlsicXVpYmJsZSA9IHJlcXVpcmUgJ3F1aWJibGUnXG57cmVwb30gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbmdpdCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG5HaXREaWZmQnJhbmNoZXMgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1kaWZmLWJyYW5jaGVzJ1xuQnJhbmNoTGlzdFZpZXcgPSByZXF1aXJlICcuLi8uLi9saWIvdmlld3MvYnJhbmNoLWxpc3QtdmlldydcblxucmVwby5icmFuY2ggPSAnbWFzdGVyJ1xuYnJhbmNoZXMgPSAnZm9vYmFyJ1xuXG5kZXNjcmliZSBcIkdpdERpZmZCcmFuY2hlc1wiLCAtPlxuICBiZWZvcmVFYWNoIC0+XG4gICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZShicmFuY2hlcylcbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ29wZW4nKVxuXG4gIGl0IFwiZ2V0cyB0aGUgYnJhbmNoZXNcIiwgLT5cbiAgICBHaXREaWZmQnJhbmNoZXMocmVwbylcbiAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggWydicmFuY2gnLCAnLS1uby1jb2xvciddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbiAgaXQgXCJjcmVhdGVzIGEgQnJhbmNoTGlzdFZpZXcgd2l0aCBhIGNhbGxiYWNrIHRvIGRvIHRoZSBkaWZmaW5nIHdoZW4gYSBicmFuY2ggaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICB2aWV3ID0gbnVsbFxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBHaXREaWZmQnJhbmNoZXMocmVwbykudGhlbiAodikgLT4gdmlldyA9IHZcbiAgICBydW5zIC0+XG4gICAgICBleHBlY3QodmlldyBpbnN0YW5jZW9mIEJyYW5jaExpc3RWaWV3KS50b0JlIHRydWVcbiAgICAgIHZpZXcuY29uZmlybVNlbGVjdGlvbigpXG4gICAgICB3YWl0c0ZvciAtPiBhdG9tLndvcmtzcGFjZS5vcGVuLmNhbGxDb3VudCA+IDBcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsnZGlmZicsICctLXN0YXQnLCByZXBvLmJyYW5jaCwgJ2Zvb2JhciddLCB7Y3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKX1cbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHJlcG8uZ2V0UGF0aCgpICsgJy9hdG9tX2dpdF9wbHVzLmRpZmYnKVxuIl19
