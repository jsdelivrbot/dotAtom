(function() {
  var GitAddContext, GitUnstageFileContext, contextPackageFinder, git, notifier, quibble, repo, selectedFilePath;

  quibble = require('quibble');

  git = require('../../lib/git');

  notifier = require('../../lib/notifier');

  contextPackageFinder = require('../../lib/context-package-finder');

  GitAddContext = require('../../lib/models/context/git-add-context');

  GitUnstageFileContext = require('../../lib/models/context/git-unstage-file-context');

  repo = require('../fixtures').repo;

  selectedFilePath = 'selected/path';

  describe("Context-menu commands", function() {
    beforeEach(function() {
      return spyOn(git, 'getRepoForPath').andReturn(Promise.resolve(repo));
    });
    describe("GitAddContext", function() {
      describe("when an object in the tree is selected", function() {
        return it("calls git::add", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          spyOn(git, 'add');
          waitsForPromise(function() {
            return GitAddContext();
          });
          return runs(function() {
            return expect(git.add).toHaveBeenCalledWith(repo, {
              file: selectedFilePath
            });
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitAddContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No file selected to add");
        });
      });
    });
    describe("GitAddAndCommitContext", function() {
      var GitAddAndCommitContext, GitCommit;
      GitAddAndCommitContext = null;
      GitCommit = null;
      beforeEach(function() {
        GitCommit = quibble('../../lib/models/git-commit', jasmine.createSpy('GitCommit'));
        return GitAddAndCommitContext = require('../../lib/models/context/git-add-and-commit-context');
      });
      describe("when an object in the tree is selected", function() {
        return it("calls git::add and GitCommit", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          spyOn(git, 'add').andReturn(Promise.resolve());
          waitsForPromise(function() {
            return GitAddAndCommitContext();
          });
          return runs(function() {
            expect(git.add).toHaveBeenCalledWith(repo, {
              file: selectedFilePath
            });
            return expect(GitCommit).toHaveBeenCalledWith(repo);
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitAddAndCommitContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No file selected to add and commit");
        });
      });
    });
    describe("GitDiffContext", function() {
      var GitDiff, GitDiffContext;
      GitDiff = null;
      GitDiffContext = null;
      beforeEach(function() {
        GitDiff = quibble('../../lib/models/git-diff', jasmine.createSpy('GitDiff'));
        return GitDiffContext = require('../../lib/models/context/git-diff-context');
      });
      describe("when an object in the tree is selected", function() {
        return it("calls GitDiff", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          waitsForPromise(function() {
            return GitDiffContext();
          });
          return runs(function() {
            return expect(GitDiff).toHaveBeenCalledWith(repo, {
              file: selectedFilePath
            });
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitDiffContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No file selected to diff");
        });
      });
    });
    describe("GitDifftoolContext", function() {
      var GitDiffTool, GitDifftoolContext;
      GitDiffTool = null;
      GitDifftoolContext = null;
      beforeEach(function() {
        GitDiffTool = quibble('../../lib/models/git-difftool', jasmine.createSpy('GitDiffTool'));
        return GitDifftoolContext = require('../../lib/models/context/git-difftool-context');
      });
      describe("when an object in the tree is selected", function() {
        return it("calls GitDiffTool", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          waitsForPromise(function() {
            return GitDifftoolContext();
          });
          return runs(function() {
            return expect(GitDiffTool).toHaveBeenCalledWith(repo, {
              file: selectedFilePath
            });
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitDifftoolContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No file selected to diff");
        });
      });
    });
    describe("GitCheckoutFileContext", function() {
      var GitCheckoutFile, GitCheckoutFileContext;
      GitCheckoutFile = null;
      GitCheckoutFileContext = null;
      beforeEach(function() {
        GitCheckoutFile = quibble('../../lib/models/git-checkout-file', jasmine.createSpy('GitCheckoutFile'));
        return GitCheckoutFileContext = require('../../lib/models/context/git-checkout-file-context');
      });
      describe("when an object in the tree is selected", function() {
        return it("calls CheckoutFile", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          spyOn(atom, 'confirm').andCallFake(function() {
            return atom.confirm.mostRecentCall.args[0].buttons.Yes();
          });
          waitsForPromise(function() {
            return GitCheckoutFileContext();
          });
          return runs(function() {
            return expect(GitCheckoutFile).toHaveBeenCalledWith(repo, {
              file: selectedFilePath
            });
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitCheckoutFileContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No file selected to checkout");
        });
      });
    });
    describe("GitUnstageFileContext", function() {
      describe("when an object in the tree is selected", function() {
        return it("calls git::cmd to unstage files", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          spyOn(git, 'cmd').andReturn(Promise.resolve());
          waitsForPromise(function() {
            return GitUnstageFileContext();
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(['reset', 'HEAD', '--', selectedFilePath], {
              cwd: repo.getWorkingDirectory()
            });
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitUnstageFileContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No file selected to unstage");
        });
      });
    });
    describe("GitPullContext", function() {
      var GitPull, GitPullContext, ref;
      ref = [], GitPull = ref[0], GitPullContext = ref[1];
      beforeEach(function() {
        GitPull = quibble('../../lib/models/git-pull', jasmine.createSpy('GitPull'));
        return GitPullContext = require('../../lib/models/context/git-pull-context');
      });
      describe("when an object in the tree is selected", function() {
        return it("calls GitPull with the options received", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          waitsForPromise(function() {
            return GitPullContext();
          });
          return runs(function() {
            return expect(GitPull).toHaveBeenCalledWith(repo);
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitPullContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No repository found");
        });
      });
    });
    describe("GitPushContext", function() {
      var GitPush, GitPushContext, ref;
      ref = [], GitPush = ref[0], GitPushContext = ref[1];
      beforeEach(function() {
        GitPush = quibble('../../lib/models/git-push', jasmine.createSpy('GitPush'));
        return GitPushContext = require('../../lib/models/context/git-push-context');
      });
      describe("when an object in the tree is selected", function() {
        return it("calls GitPush with the options received", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          waitsForPromise(function() {
            return GitPushContext({
              setUpstream: true
            });
          });
          return runs(function() {
            return expect(GitPush).toHaveBeenCalledWith(repo, {
              setUpstream: true
            });
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitPushContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No repository found");
        });
      });
    });
    describe("GitDiffBranchesContext", function() {
      var GitDiffBranches, GitDiffBranchesContext, ref;
      ref = [], GitDiffBranches = ref[0], GitDiffBranchesContext = ref[1];
      beforeEach(function() {
        GitDiffBranches = quibble('../../lib/models/git-diff-branches', jasmine.createSpy('GitDiffBranches'));
        return GitDiffBranchesContext = require('../../lib/models/context/git-diff-branches-context');
      });
      describe("when an object in the tree is selected", function() {
        return it("calls GitDiffBranches", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          waitsForPromise(function() {
            return GitDiffBranchesContext();
          });
          return runs(function() {
            return expect(GitDiffBranches).toHaveBeenCalledWith(repo);
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitDiffBranchesContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No repository found");
        });
      });
    });
    return describe("GitDiffBranchFilesContext", function() {
      var GitDiffBranchFiles, GitDiffBranchFilesContext, ref;
      ref = [], GitDiffBranchFiles = ref[0], GitDiffBranchFilesContext = ref[1];
      beforeEach(function() {
        GitDiffBranchFiles = quibble('../../lib/models/git-diff-branch-files', jasmine.createSpy('GitDiffBranchFiles'));
        return GitDiffBranchFilesContext = require('../../lib/models/context/git-diff-branch-files-context');
      });
      describe("when an object in the tree is selected", function() {
        return it("calls GitDiffBranchFiles", function() {
          spyOn(contextPackageFinder, 'get').andReturn({
            selectedPath: selectedFilePath
          });
          waitsForPromise(function() {
            return GitDiffBranchFilesContext();
          });
          return runs(function() {
            return expect(GitDiffBranchFiles).toHaveBeenCalledWith(repo, selectedFilePath);
          });
        });
      });
      return describe("when an object is not selected", function() {
        return it("notifies the user of the issue", function() {
          spyOn(notifier, 'addInfo');
          GitDiffBranchFilesContext();
          return expect(notifier.addInfo).toHaveBeenCalledWith("No repository found");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1jb250ZXh0LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0VBQ1YsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsb0JBQVI7O0VBQ1gsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLGtDQUFSOztFQUN2QixhQUFBLEdBQWdCLE9BQUEsQ0FBUSwwQ0FBUjs7RUFDaEIscUJBQUEsR0FBd0IsT0FBQSxDQUFRLG1EQUFSOztFQUV2QixPQUFRLE9BQUEsQ0FBUSxhQUFSOztFQUNULGdCQUFBLEdBQW1COztFQUVuQixRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQTtJQUNoQyxVQUFBLENBQVcsU0FBQTthQUNULEtBQUEsQ0FBTSxHQUFOLEVBQVcsZ0JBQVgsQ0FBNEIsQ0FBQyxTQUE3QixDQUF1QyxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixDQUF2QztJQURTLENBQVg7SUFHQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBO01BQ3hCLFFBQUEsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFBO2VBQ2pELEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBO1VBQ25CLEtBQUEsQ0FBTSxvQkFBTixFQUE0QixLQUE1QixDQUFrQyxDQUFDLFNBQW5DLENBQTZDO1lBQUMsWUFBQSxFQUFjLGdCQUFmO1dBQTdDO1VBQ0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYO1VBQ0EsZUFBQSxDQUFnQixTQUFBO21CQUFHLGFBQUEsQ0FBQTtVQUFILENBQWhCO2lCQUNBLElBQUEsQ0FBSyxTQUFBO21CQUFHLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLElBQXJD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QU4sRUFBZ0IsU0FBaEI7VUFDQSx5QkFBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxRQUFRLENBQUMsT0FBaEIsQ0FBd0IsQ0FBQyxvQkFBekIsQ0FBOEMscUJBQTlDO1FBSG1DLENBQXJDO01BRHlDLENBQTNDO0lBYm9DLENBQXRDO0VBN0tnQyxDQUFsQztBQVZBIiwic291cmNlc0NvbnRlbnQiOlsicXVpYmJsZSA9IHJlcXVpcmUgJ3F1aWJibGUnXG5naXQgPSByZXF1aXJlICcuLi8uLi9saWIvZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi8uLi9saWIvbm90aWZpZXInXG5jb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2xpYi9jb250ZXh0LXBhY2thZ2UtZmluZGVyJ1xuR2l0QWRkQ29udGV4dCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvY29udGV4dC9naXQtYWRkLWNvbnRleHQnXG5HaXRVbnN0YWdlRmlsZUNvbnRleHQgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LXVuc3RhZ2UtZmlsZS1jb250ZXh0J1xuXG57cmVwb30gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbnNlbGVjdGVkRmlsZVBhdGggPSAnc2VsZWN0ZWQvcGF0aCdcblxuZGVzY3JpYmUgXCJDb250ZXh0LW1lbnUgY29tbWFuZHNcIiwgLT5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHNweU9uKGdpdCwgJ2dldFJlcG9Gb3JQYXRoJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXBvKVxuXG4gIGRlc2NyaWJlIFwiR2l0QWRkQ29udGV4dFwiLCAtPlxuICAgIGRlc2NyaWJlIFwid2hlbiBhbiBvYmplY3QgaW4gdGhlIHRyZWUgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgZ2l0OjphZGRcIiwgLT5cbiAgICAgICAgc3B5T24oY29udGV4dFBhY2thZ2VGaW5kZXIsICdnZXQnKS5hbmRSZXR1cm4ge3NlbGVjdGVkUGF0aDogc2VsZWN0ZWRGaWxlUGF0aH1cbiAgICAgICAgc3B5T24oZ2l0LCAnYWRkJylcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdEFkZENvbnRleHQoKVxuICAgICAgICBydW5zIC0+IGV4cGVjdChnaXQuYWRkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCByZXBvLCBmaWxlOiBzZWxlY3RlZEZpbGVQYXRoXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGlzIG5vdCBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgXCJub3RpZmllcyB0aGUgdXNlciBvZiB0aGUgaXNzdWVcIiwgLT5cbiAgICAgICAgc3B5T24obm90aWZpZXIsICdhZGRJbmZvJylcbiAgICAgICAgR2l0QWRkQ29udGV4dCgpXG4gICAgICAgIGV4cGVjdChub3RpZmllci5hZGRJbmZvKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBcIk5vIGZpbGUgc2VsZWN0ZWQgdG8gYWRkXCJcblxuICBkZXNjcmliZSBcIkdpdEFkZEFuZENvbW1pdENvbnRleHRcIiwgLT5cbiAgICBHaXRBZGRBbmRDb21taXRDb250ZXh0ID0gbnVsbFxuICAgIEdpdENvbW1pdCA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIEdpdENvbW1pdCA9IHF1aWJibGUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LWNvbW1pdCcsIGphc21pbmUuY3JlYXRlU3B5KCdHaXRDb21taXQnKVxuICAgICAgR2l0QWRkQW5kQ29tbWl0Q29udGV4dCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvY29udGV4dC9naXQtYWRkLWFuZC1jb21taXQtY29udGV4dCdcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhbiBvYmplY3QgaW4gdGhlIHRyZWUgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgZ2l0OjphZGQgYW5kIEdpdENvbW1pdFwiLCAtPlxuICAgICAgICBzcHlPbihjb250ZXh0UGFja2FnZUZpbmRlciwgJ2dldCcpLmFuZFJldHVybiB7c2VsZWN0ZWRQYXRoOiBzZWxlY3RlZEZpbGVQYXRofVxuICAgICAgICBzcHlPbihnaXQsICdhZGQnKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdEFkZEFuZENvbW1pdENvbnRleHQoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGdpdC5hZGQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIHJlcG8sIGZpbGU6IHNlbGVjdGVkRmlsZVBhdGhcbiAgICAgICAgICBleHBlY3QoR2l0Q29tbWl0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCByZXBvXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGlzIG5vdCBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgXCJub3RpZmllcyB0aGUgdXNlciBvZiB0aGUgaXNzdWVcIiwgLT5cbiAgICAgICAgc3B5T24obm90aWZpZXIsICdhZGRJbmZvJylcbiAgICAgICAgR2l0QWRkQW5kQ29tbWl0Q29udGV4dCgpXG4gICAgICAgIGV4cGVjdChub3RpZmllci5hZGRJbmZvKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBcIk5vIGZpbGUgc2VsZWN0ZWQgdG8gYWRkIGFuZCBjb21taXRcIlxuXG4gIGRlc2NyaWJlIFwiR2l0RGlmZkNvbnRleHRcIiwgLT5cbiAgICBHaXREaWZmID0gbnVsbFxuICAgIEdpdERpZmZDb250ZXh0ID0gbnVsbFxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgR2l0RGlmZiA9IHF1aWJibGUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LWRpZmYnLCBqYXNtaW5lLmNyZWF0ZVNweSgnR2l0RGlmZicpXG4gICAgICBHaXREaWZmQ29udGV4dCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvY29udGV4dC9naXQtZGlmZi1jb250ZXh0J1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFuIG9iamVjdCBpbiB0aGUgdHJlZSBpcyBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgXCJjYWxscyBHaXREaWZmXCIsIC0+XG4gICAgICAgIHNweU9uKGNvbnRleHRQYWNrYWdlRmluZGVyLCAnZ2V0JykuYW5kUmV0dXJuIHtzZWxlY3RlZFBhdGg6IHNlbGVjdGVkRmlsZVBhdGh9XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBHaXREaWZmQ29udGV4dCgpXG4gICAgICAgIHJ1bnMgLT4gZXhwZWN0KEdpdERpZmYpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIHJlcG8sIGZpbGU6IHNlbGVjdGVkRmlsZVBhdGhcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhbiBvYmplY3QgaXMgbm90IHNlbGVjdGVkXCIsIC0+XG4gICAgICBpdCBcIm5vdGlmaWVzIHRoZSB1c2VyIG9mIHRoZSBpc3N1ZVwiLCAtPlxuICAgICAgICBzcHlPbihub3RpZmllciwgJ2FkZEluZm8nKVxuICAgICAgICBHaXREaWZmQ29udGV4dCgpXG4gICAgICAgIGV4cGVjdChub3RpZmllci5hZGRJbmZvKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBcIk5vIGZpbGUgc2VsZWN0ZWQgdG8gZGlmZlwiXG5cbiAgZGVzY3JpYmUgXCJHaXREaWZmdG9vbENvbnRleHRcIiwgLT5cbiAgICBHaXREaWZmVG9vbCA9IG51bGxcbiAgICBHaXREaWZmdG9vbENvbnRleHQgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBHaXREaWZmVG9vbCA9IHF1aWJibGUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LWRpZmZ0b29sJywgamFzbWluZS5jcmVhdGVTcHkoJ0dpdERpZmZUb29sJylcbiAgICAgIEdpdERpZmZ0b29sQ29udGV4dCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvY29udGV4dC9naXQtZGlmZnRvb2wtY29udGV4dCdcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhbiBvYmplY3QgaW4gdGhlIHRyZWUgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgR2l0RGlmZlRvb2xcIiwgLT5cbiAgICAgICAgc3B5T24oY29udGV4dFBhY2thZ2VGaW5kZXIsICdnZXQnKS5hbmRSZXR1cm4ge3NlbGVjdGVkUGF0aDogc2VsZWN0ZWRGaWxlUGF0aH1cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdERpZmZ0b29sQ29udGV4dCgpXG4gICAgICAgIHJ1bnMgLT4gZXhwZWN0KEdpdERpZmZUb29sKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCByZXBvLCBmaWxlOiBzZWxlY3RlZEZpbGVQYXRoXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGlzIG5vdCBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgXCJub3RpZmllcyB0aGUgdXNlciBvZiB0aGUgaXNzdWVcIiwgLT5cbiAgICAgICAgc3B5T24obm90aWZpZXIsICdhZGRJbmZvJylcbiAgICAgICAgR2l0RGlmZnRvb2xDb250ZXh0KClcbiAgICAgICAgZXhwZWN0KG5vdGlmaWVyLmFkZEluZm8pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFwiTm8gZmlsZSBzZWxlY3RlZCB0byBkaWZmXCJcblxuICBkZXNjcmliZSBcIkdpdENoZWNrb3V0RmlsZUNvbnRleHRcIiwgLT5cbiAgICBHaXRDaGVja291dEZpbGUgPSBudWxsXG4gICAgR2l0Q2hlY2tvdXRGaWxlQ29udGV4dCA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIEdpdENoZWNrb3V0RmlsZSA9IHF1aWJibGUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LWNoZWNrb3V0LWZpbGUnLCBqYXNtaW5lLmNyZWF0ZVNweSgnR2l0Q2hlY2tvdXRGaWxlJylcbiAgICAgIEdpdENoZWNrb3V0RmlsZUNvbnRleHQgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LWNoZWNrb3V0LWZpbGUtY29udGV4dCdcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhbiBvYmplY3QgaW4gdGhlIHRyZWUgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgQ2hlY2tvdXRGaWxlXCIsIC0+XG4gICAgICAgIHNweU9uKGNvbnRleHRQYWNrYWdlRmluZGVyLCAnZ2V0JykuYW5kUmV0dXJuIHtzZWxlY3RlZFBhdGg6IHNlbGVjdGVkRmlsZVBhdGh9XG4gICAgICAgIHNweU9uKGF0b20sICdjb25maXJtJykuYW5kQ2FsbEZha2UgLT4gYXRvbS5jb25maXJtLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF0uYnV0dG9ucy5ZZXMoKVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0Q2hlY2tvdXRGaWxlQ29udGV4dCgpXG4gICAgICAgIHJ1bnMgLT4gZXhwZWN0KEdpdENoZWNrb3V0RmlsZSkudG9IYXZlQmVlbkNhbGxlZFdpdGggcmVwbywgZmlsZTogc2VsZWN0ZWRGaWxlUGF0aFxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFuIG9iamVjdCBpcyBub3Qgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0IFwibm90aWZpZXMgdGhlIHVzZXIgb2YgdGhlIGlzc3VlXCIsIC0+XG4gICAgICAgIHNweU9uKG5vdGlmaWVyLCAnYWRkSW5mbycpXG4gICAgICAgIEdpdENoZWNrb3V0RmlsZUNvbnRleHQoKVxuICAgICAgICBleHBlY3Qobm90aWZpZXIuYWRkSW5mbykudG9IYXZlQmVlbkNhbGxlZFdpdGggXCJObyBmaWxlIHNlbGVjdGVkIHRvIGNoZWNrb3V0XCJcblxuICBkZXNjcmliZSBcIkdpdFVuc3RhZ2VGaWxlQ29udGV4dFwiLCAtPlxuICAgIGRlc2NyaWJlIFwid2hlbiBhbiBvYmplY3QgaW4gdGhlIHRyZWUgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgZ2l0OjpjbWQgdG8gdW5zdGFnZSBmaWxlc1wiLCAtPlxuICAgICAgICBzcHlPbihjb250ZXh0UGFja2FnZUZpbmRlciwgJ2dldCcpLmFuZFJldHVybiB7c2VsZWN0ZWRQYXRoOiBzZWxlY3RlZEZpbGVQYXRofVxuICAgICAgICBzcHlPbihnaXQsICdjbWQnKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdFVuc3RhZ2VGaWxlQ29udGV4dCgpXG4gICAgICAgIHJ1bnMgLT4gZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncmVzZXQnLCAnSEVBRCcsICctLScsIHNlbGVjdGVkRmlsZVBhdGhdLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGlzIG5vdCBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgXCJub3RpZmllcyB0aGUgdXNlciBvZiB0aGUgaXNzdWVcIiwgLT5cbiAgICAgICAgc3B5T24obm90aWZpZXIsICdhZGRJbmZvJylcbiAgICAgICAgR2l0VW5zdGFnZUZpbGVDb250ZXh0KClcbiAgICAgICAgZXhwZWN0KG5vdGlmaWVyLmFkZEluZm8pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFwiTm8gZmlsZSBzZWxlY3RlZCB0byB1bnN0YWdlXCJcblxuICBkZXNjcmliZSBcIkdpdFB1bGxDb250ZXh0XCIsIC0+XG4gICAgW0dpdFB1bGwsIEdpdFB1bGxDb250ZXh0XSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBHaXRQdWxsID0gcXVpYmJsZSAnLi4vLi4vbGliL21vZGVscy9naXQtcHVsbCcsIGphc21pbmUuY3JlYXRlU3B5KCdHaXRQdWxsJylcbiAgICAgIEdpdFB1bGxDb250ZXh0ID0gcmVxdWlyZSAnLi4vLi4vbGliL21vZGVscy9jb250ZXh0L2dpdC1wdWxsLWNvbnRleHQnXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGluIHRoZSB0cmVlIGlzIHNlbGVjdGVkXCIsIC0+XG4gICAgICBpdCBcImNhbGxzIEdpdFB1bGwgd2l0aCB0aGUgb3B0aW9ucyByZWNlaXZlZFwiLCAtPlxuICAgICAgICBzcHlPbihjb250ZXh0UGFja2FnZUZpbmRlciwgJ2dldCcpLmFuZFJldHVybiB7c2VsZWN0ZWRQYXRoOiBzZWxlY3RlZEZpbGVQYXRofVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0UHVsbENvbnRleHQoKVxuICAgICAgICBydW5zIC0+IGV4cGVjdChHaXRQdWxsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCByZXBvXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGlzIG5vdCBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgXCJub3RpZmllcyB0aGUgdXNlciBvZiB0aGUgaXNzdWVcIiwgLT5cbiAgICAgICAgc3B5T24obm90aWZpZXIsICdhZGRJbmZvJylcbiAgICAgICAgR2l0UHVsbENvbnRleHQoKVxuICAgICAgICBleHBlY3Qobm90aWZpZXIuYWRkSW5mbykudG9IYXZlQmVlbkNhbGxlZFdpdGggXCJObyByZXBvc2l0b3J5IGZvdW5kXCJcblxuICBkZXNjcmliZSBcIkdpdFB1c2hDb250ZXh0XCIsIC0+XG4gICAgW0dpdFB1c2gsIEdpdFB1c2hDb250ZXh0XSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBHaXRQdXNoID0gcXVpYmJsZSAnLi4vLi4vbGliL21vZGVscy9naXQtcHVzaCcsIGphc21pbmUuY3JlYXRlU3B5KCdHaXRQdXNoJylcbiAgICAgIEdpdFB1c2hDb250ZXh0ID0gcmVxdWlyZSAnLi4vLi4vbGliL21vZGVscy9jb250ZXh0L2dpdC1wdXNoLWNvbnRleHQnXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGluIHRoZSB0cmVlIGlzIHNlbGVjdGVkXCIsIC0+XG4gICAgICBpdCBcImNhbGxzIEdpdFB1c2ggd2l0aCB0aGUgb3B0aW9ucyByZWNlaXZlZFwiLCAtPlxuICAgICAgICBzcHlPbihjb250ZXh0UGFja2FnZUZpbmRlciwgJ2dldCcpLmFuZFJldHVybiB7c2VsZWN0ZWRQYXRoOiBzZWxlY3RlZEZpbGVQYXRofVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0UHVzaENvbnRleHQoc2V0VXBzdHJlYW06IHRydWUpXG4gICAgICAgIHJ1bnMgLT4gZXhwZWN0KEdpdFB1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIHJlcG8sIHNldFVwc3RyZWFtOiB0cnVlXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGlzIG5vdCBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgXCJub3RpZmllcyB0aGUgdXNlciBvZiB0aGUgaXNzdWVcIiwgLT5cbiAgICAgICAgc3B5T24obm90aWZpZXIsICdhZGRJbmZvJylcbiAgICAgICAgR2l0UHVzaENvbnRleHQoKVxuICAgICAgICBleHBlY3Qobm90aWZpZXIuYWRkSW5mbykudG9IYXZlQmVlbkNhbGxlZFdpdGggXCJObyByZXBvc2l0b3J5IGZvdW5kXCJcblxuICBkZXNjcmliZSBcIkdpdERpZmZCcmFuY2hlc0NvbnRleHRcIiwgLT5cbiAgICBbR2l0RGlmZkJyYW5jaGVzLCBHaXREaWZmQnJhbmNoZXNDb250ZXh0XSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBHaXREaWZmQnJhbmNoZXMgPSBxdWliYmxlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1kaWZmLWJyYW5jaGVzJywgamFzbWluZS5jcmVhdGVTcHkoJ0dpdERpZmZCcmFuY2hlcycpXG4gICAgICBHaXREaWZmQnJhbmNoZXNDb250ZXh0ID0gcmVxdWlyZSAnLi4vLi4vbGliL21vZGVscy9jb250ZXh0L2dpdC1kaWZmLWJyYW5jaGVzLWNvbnRleHQnXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGluIHRoZSB0cmVlIGlzIHNlbGVjdGVkXCIsIC0+XG4gICAgICBpdCBcImNhbGxzIEdpdERpZmZCcmFuY2hlc1wiLCAtPlxuICAgICAgICBzcHlPbihjb250ZXh0UGFja2FnZUZpbmRlciwgJ2dldCcpLmFuZFJldHVybiB7c2VsZWN0ZWRQYXRoOiBzZWxlY3RlZEZpbGVQYXRofVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0RGlmZkJyYW5jaGVzQ29udGV4dCgpXG4gICAgICAgIHJ1bnMgLT4gZXhwZWN0KEdpdERpZmZCcmFuY2hlcykudG9IYXZlQmVlbkNhbGxlZFdpdGggcmVwb1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFuIG9iamVjdCBpcyBub3Qgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0IFwibm90aWZpZXMgdGhlIHVzZXIgb2YgdGhlIGlzc3VlXCIsIC0+XG4gICAgICAgIHNweU9uKG5vdGlmaWVyLCAnYWRkSW5mbycpXG4gICAgICAgIEdpdERpZmZCcmFuY2hlc0NvbnRleHQoKVxuICAgICAgICBleHBlY3Qobm90aWZpZXIuYWRkSW5mbykudG9IYXZlQmVlbkNhbGxlZFdpdGggXCJObyByZXBvc2l0b3J5IGZvdW5kXCJcblxuICBkZXNjcmliZSBcIkdpdERpZmZCcmFuY2hGaWxlc0NvbnRleHRcIiwgLT5cbiAgICBbR2l0RGlmZkJyYW5jaEZpbGVzLCBHaXREaWZmQnJhbmNoRmlsZXNDb250ZXh0XSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBHaXREaWZmQnJhbmNoRmlsZXMgPSBxdWliYmxlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1kaWZmLWJyYW5jaC1maWxlcycsIGphc21pbmUuY3JlYXRlU3B5KCdHaXREaWZmQnJhbmNoRmlsZXMnKVxuICAgICAgR2l0RGlmZkJyYW5jaEZpbGVzQ29udGV4dCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvY29udGV4dC9naXQtZGlmZi1icmFuY2gtZmlsZXMtY29udGV4dCdcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhbiBvYmplY3QgaW4gdGhlIHRyZWUgaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgR2l0RGlmZkJyYW5jaEZpbGVzXCIsIC0+XG4gICAgICAgIHNweU9uKGNvbnRleHRQYWNrYWdlRmluZGVyLCAnZ2V0JykuYW5kUmV0dXJuIHtzZWxlY3RlZFBhdGg6IHNlbGVjdGVkRmlsZVBhdGh9XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBHaXREaWZmQnJhbmNoRmlsZXNDb250ZXh0KClcbiAgICAgICAgcnVucyAtPiBleHBlY3QoR2l0RGlmZkJyYW5jaEZpbGVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCByZXBvLCBzZWxlY3RlZEZpbGVQYXRoXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gb2JqZWN0IGlzIG5vdCBzZWxlY3RlZFwiLCAtPlxuICAgICAgaXQgXCJub3RpZmllcyB0aGUgdXNlciBvZiB0aGUgaXNzdWVcIiwgLT5cbiAgICAgICAgc3B5T24obm90aWZpZXIsICdhZGRJbmZvJylcbiAgICAgICAgR2l0RGlmZkJyYW5jaEZpbGVzQ29udGV4dCgpXG4gICAgICAgIGV4cGVjdChub3RpZmllci5hZGRJbmZvKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBcIk5vIHJlcG9zaXRvcnkgZm91bmRcIlxuIl19
