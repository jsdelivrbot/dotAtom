(function() {
  var RemoteListView, colorOptions, git, options, promptForBranch, pullBeforePush, pullRebase, remotes, repo;

  git = require('../../lib/git');

  RemoteListView = require('../../lib/views/remote-list-view');

  repo = require('../fixtures').repo;

  options = {
    cwd: repo.getWorkingDirectory()
  };

  colorOptions = {
    color: true
  };

  remotes = "remote1\nremote2";

  pullBeforePush = 'git-plus.remoteInteractions.pullBeforePush';

  pullRebase = 'git-plus.remoteInteractions.pullRebase';

  promptForBranch = 'git-plus.remoteInteractions.promptForBranch';

  describe("RemoteListView", function() {
    it("displays a list of remotes", function() {
      var view;
      view = new RemoteListView(repo, remotes, {
        mode: 'pull'
      });
      return expect(view.items.length).toBe(2);
    });
    describe("when mode is pull", function() {
      describe("when promptForBranch is enabled", function() {
        return it("it calls git.cmd to get the remote branches", function() {
          var view;
          atom.config.set(promptForBranch, true);
          view = new RemoteListView(repo, remotes, {
            mode: 'pull'
          });
          spyOn(git, 'cmd').andCallFake(function() {
            return Promise.resolve('branch1\nbranch2');
          });
          view.confirmSelection();
          waitsFor(function() {
            return git.cmd.callCount > 0;
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(['branch', '--no-color', '-r'], options);
          });
        });
      });
      return describe("when promptForBranch is disabled", function() {
        return it("it calls the _pull function", function() {
          var view;
          atom.config.set(promptForBranch, false);
          view = new RemoteListView(repo, remotes, {
            mode: 'pull'
          });
          spyOn(git, 'cmd').andCallFake(function() {
            return Promise.resolve('branch1\nbranch2');
          });
          view.confirmSelection();
          waitsFor(function() {
            return git.cmd.callCount > 0;
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(['pull', 'origin', 'foo'], options, colorOptions);
          });
        });
      });
    });
    describe("when mode is fetch", function() {
      return it("it calls git.cmd to with ['fetch'] and the remote name", function() {
        var view;
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('fetched stuff');
        });
        view = new RemoteListView(repo, remotes, {
          mode: 'fetch'
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['fetch', 'remote1'], options, colorOptions);
        });
      });
    });
    describe("when mode is fetch-prune", function() {
      return it("it calls git.cmd to with ['fetch', '--prune'] and the remote name", function() {
        var view;
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('fetched stuff');
        });
        view = new RemoteListView(repo, remotes, {
          mode: 'fetch-prune'
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['fetch', '--prune', 'remote1'], options, colorOptions);
        });
      });
    });
    describe("when mode is push", function() {
      return it("calls git.cmd with ['push']", function() {
        var view;
        spyOn(git, 'cmd').andReturn(Promise.resolve('pushing text'));
        view = new RemoteListView(repo, remotes, {
          mode: 'push'
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['push', 'remote1'], options, colorOptions);
        });
      });
    });
    describe("when mode is 'push -u'", function() {
      return it("calls git.cmd with ['push', '-u'] and remote name", function() {
        var view;
        spyOn(git, 'cmd').andReturn(Promise.resolve('pushing text'));
        view = new RemoteListView(repo, remotes, {
          mode: 'push -u'
        });
        view.confirmSelection();
        waitsFor(function() {
          return git.cmd.callCount > 0;
        });
        return runs(function() {
          return expect(git.cmd).toHaveBeenCalledWith(['push', '-u', 'remote1', 'HEAD'], options, colorOptions);
        });
      });
    });
    return describe("when the the config for pull before push is set to true", function() {
      describe("when promptForBranch is disabled", function() {
        return it("calls git.cmd with ['pull'], remote name, and branch name and then with ['push']", function() {
          var view;
          spyOn(git, 'cmd').andReturn(Promise.resolve('branch1'));
          atom.config.set(pullBeforePush, true);
          view = new RemoteListView(repo, remotes, {
            mode: 'push'
          });
          view.confirmSelection();
          waitsFor(function() {
            return git.cmd.callCount > 1;
          });
          return runs(function() {
            expect(git.cmd).toHaveBeenCalledWith(['pull', 'origin', 'foo'], options, colorOptions);
            return expect(git.cmd).toHaveBeenCalledWith(['push', 'remote1'], options, colorOptions);
          });
        });
      });
      describe("when promptForBranch is enabled", function() {
        return it("calls git.cmd with ['branch', '--no-color', '-r']", function() {
          var view;
          spyOn(git, 'cmd').andReturn(Promise.resolve('remote/branch1'));
          atom.config.set(pullBeforePush, true);
          atom.config.set(promptForBranch, true);
          view = new RemoteListView(repo, remotes, {
            mode: 'push'
          });
          view.confirmSelection();
          waitsFor(function() {
            return git.cmd.callCount > 0;
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(['branch', '--no-color', '-r'], options);
          });
        });
      });
      return describe("when the the config for pullRebase is set to true", function() {
        return it("calls git.cmd with ['pull', '--rebase'], remote name, and branch name and then with ['push']", function() {
          var view;
          spyOn(git, 'cmd').andReturn(Promise.resolve('branch1'));
          atom.config.set(pullBeforePush, true);
          atom.config.set(pullRebase, true);
          atom.config.set(promptForBranch, false);
          view = new RemoteListView(repo, remotes, {
            mode: 'push'
          });
          view.confirmSelection();
          waitsFor(function() {
            return git.cmd.callCount > 1;
          });
          return runs(function() {
            expect(git.cmd).toHaveBeenCalledWith(['pull', '--rebase', 'origin', 'foo'], options, colorOptions);
            return expect(git.cmd).toHaveBeenCalledWith(['push', 'remote1'], options, colorOptions);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvcmVtb3RlLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNOLGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSOztFQUNoQixPQUFRLE9BQUEsQ0FBUSxhQUFSOztFQUNULE9BQUEsR0FBVTtJQUFDLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFOOzs7RUFDVixZQUFBLEdBQWU7SUFBQyxLQUFBLEVBQU8sSUFBUjs7O0VBQ2YsT0FBQSxHQUFVOztFQUNWLGNBQUEsR0FBaUI7O0VBQ2pCLFVBQUEsR0FBYTs7RUFDYixlQUFBLEdBQWtCOztFQUVsQixRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtJQUN6QixFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQTtBQUMvQixVQUFBO01BQUEsSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsT0FBckIsRUFBOEI7UUFBQSxJQUFBLEVBQU0sTUFBTjtPQUE5QjthQUNYLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWxCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBL0I7SUFGK0IsQ0FBakM7SUFJQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQTtNQUM1QixRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQTtlQUMxQyxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQTtBQUNoRCxjQUFBO1VBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGVBQWhCLEVBQWlDLElBQWpDO1VBQ0EsSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsT0FBckIsRUFBOEI7WUFBQSxJQUFBLEVBQU0sTUFBTjtX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RUFBZ0MsSUFBaEM7VUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsVUFBaEIsRUFBNEIsSUFBNUI7VUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZUFBaEIsRUFBaUMsS0FBakM7VUFFQSxJQUFBLEdBQVcsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixPQUFyQixFQUE4QjtZQUFBLElBQUEsRUFBTSxNQUFOO1dBQTlCO1VBQ1gsSUFBSSxDQUFDLGdCQUFMLENBQUE7VUFFQSxRQUFBLENBQVMsU0FBQTttQkFBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVIsR0FBb0I7VUFBdkIsQ0FBVDtpQkFDQSxJQUFBLENBQUssU0FBQTtZQUNILE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsUUFBckIsRUFBK0IsS0FBL0IsQ0FBckMsRUFBNEUsT0FBNUUsRUFBcUYsWUFBckY7bUJBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxNQUFELEVBQVMsU0FBVCxDQUFyQyxFQUEwRCxPQUExRCxFQUFtRSxZQUFuRTtVQUZHLENBQUw7UUFWaUcsQ0FBbkc7TUFENEQsQ0FBOUQ7SUEzQmtFLENBQXBFO0VBekV5QixDQUEzQjtBQVZBIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vLi4vbGliL2dpdCdcblJlbW90ZUxpc3RWaWV3ID0gcmVxdWlyZSAnLi4vLi4vbGliL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcnXG57cmVwb30gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbm9wdGlvbnMgPSB7Y3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKX1cbmNvbG9yT3B0aW9ucyA9IHtjb2xvcjogdHJ1ZX1cbnJlbW90ZXMgPSBcInJlbW90ZTFcXG5yZW1vdGUyXCJcbnB1bGxCZWZvcmVQdXNoID0gJ2dpdC1wbHVzLnJlbW90ZUludGVyYWN0aW9ucy5wdWxsQmVmb3JlUHVzaCdcbnB1bGxSZWJhc2UgPSAnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnB1bGxSZWJhc2UnXG5wcm9tcHRGb3JCcmFuY2ggPSAnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnByb21wdEZvckJyYW5jaCdcblxuZGVzY3JpYmUgXCJSZW1vdGVMaXN0Vmlld1wiLCAtPlxuICBpdCBcImRpc3BsYXlzIGEgbGlzdCBvZiByZW1vdGVzXCIsIC0+XG4gICAgdmlldyA9IG5ldyBSZW1vdGVMaXN0VmlldyhyZXBvLCByZW1vdGVzLCBtb2RlOiAncHVsbCcpXG4gICAgZXhwZWN0KHZpZXcuaXRlbXMubGVuZ3RoKS50b0JlIDJcblxuICBkZXNjcmliZSBcIndoZW4gbW9kZSBpcyBwdWxsXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJ3aGVuIHByb21wdEZvckJyYW5jaCBpcyBlbmFibGVkXCIsIC0+XG4gICAgICBpdCBcIml0IGNhbGxzIGdpdC5jbWQgdG8gZ2V0IHRoZSByZW1vdGUgYnJhbmNoZXNcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KHByb21wdEZvckJyYW5jaCwgdHJ1ZSlcbiAgICAgICAgdmlldyA9IG5ldyBSZW1vdGVMaXN0VmlldyhyZXBvLCByZW1vdGVzLCBtb2RlOiAncHVsbCcpXG4gICAgICAgIHNweU9uKGdpdCwgJ2NtZCcpLmFuZENhbGxGYWtlIC0+XG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlICdicmFuY2gxXFxuYnJhbmNoMidcblxuICAgICAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuICAgICAgICB3YWl0c0ZvciAtPiBnaXQuY21kLmNhbGxDb3VudCA+IDBcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChnaXQuY21kKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBbJ2JyYW5jaCcsICctLW5vLWNvbG9yJywgJy1yJ10sIG9wdGlvbnNcblxuICAgIGRlc2NyaWJlIFwid2hlbiBwcm9tcHRGb3JCcmFuY2ggaXMgZGlzYWJsZWRcIiwgLT5cbiAgICAgIGl0IFwiaXQgY2FsbHMgdGhlIF9wdWxsIGZ1bmN0aW9uXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChwcm9tcHRGb3JCcmFuY2gsIGZhbHNlKVxuICAgICAgICB2aWV3ID0gbmV3IFJlbW90ZUxpc3RWaWV3KHJlcG8sIHJlbW90ZXMsIG1vZGU6ICdwdWxsJylcbiAgICAgICAgc3B5T24oZ2l0LCAnY21kJykuYW5kQ2FsbEZha2UgLT5cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUgJ2JyYW5jaDFcXG5icmFuY2gyJ1xuXG4gICAgICAgIHZpZXcuY29uZmlybVNlbGVjdGlvbigpXG4gICAgICAgIHdhaXRzRm9yIC0+IGdpdC5jbWQuY2FsbENvdW50ID4gMFxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncHVsbCcsICdvcmlnaW4nLCAnZm9vJ10sIG9wdGlvbnMsIGNvbG9yT3B0aW9uc1xuXG4gIGRlc2NyaWJlIFwid2hlbiBtb2RlIGlzIGZldGNoXCIsIC0+XG4gICAgaXQgXCJpdCBjYWxscyBnaXQuY21kIHRvIHdpdGggWydmZXRjaCddIGFuZCB0aGUgcmVtb3RlIG5hbWVcIiwgLT5cbiAgICAgIHNweU9uKGdpdCwgJ2NtZCcpLmFuZENhbGxGYWtlIC0+XG4gICAgICAgIFByb21pc2UucmVzb2x2ZSAnZmV0Y2hlZCBzdHVmZidcblxuICAgICAgdmlldyA9IG5ldyBSZW1vdGVMaXN0VmlldyhyZXBvLCByZW1vdGVzLCBtb2RlOiAnZmV0Y2gnKVxuICAgICAgdmlldy5jb25maXJtU2VsZWN0aW9uKClcbiAgICAgIHdhaXRzRm9yIC0+IGdpdC5jbWQuY2FsbENvdW50ID4gMFxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggWydmZXRjaCcsICdyZW1vdGUxJ10sIG9wdGlvbnMsIGNvbG9yT3B0aW9uc1xuXG4gIGRlc2NyaWJlIFwid2hlbiBtb2RlIGlzIGZldGNoLXBydW5lXCIsIC0+XG4gICAgaXQgXCJpdCBjYWxscyBnaXQuY21kIHRvIHdpdGggWydmZXRjaCcsICctLXBydW5lJ10gYW5kIHRoZSByZW1vdGUgbmFtZVwiLCAtPlxuICAgICAgc3B5T24oZ2l0LCAnY21kJykuYW5kQ2FsbEZha2UgLT5cbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlICdmZXRjaGVkIHN0dWZmJ1xuXG4gICAgICB2aWV3ID0gbmV3IFJlbW90ZUxpc3RWaWV3KHJlcG8sIHJlbW90ZXMsIG1vZGU6ICdmZXRjaC1wcnVuZScpXG4gICAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuICAgICAgd2FpdHNGb3IgLT4gZ2l0LmNtZC5jYWxsQ291bnQgPiAwXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChnaXQuY21kKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBbJ2ZldGNoJywgJy0tcHJ1bmUnLCAncmVtb3RlMSddLCBvcHRpb25zLCBjb2xvck9wdGlvbnNcblxuICBkZXNjcmliZSBcIndoZW4gbW9kZSBpcyBwdXNoXCIsIC0+XG4gICAgaXQgXCJjYWxscyBnaXQuY21kIHdpdGggWydwdXNoJ11cIiwgLT5cbiAgICAgIHNweU9uKGdpdCwgJ2NtZCcpLmFuZFJldHVybiBQcm9taXNlLnJlc29sdmUgJ3B1c2hpbmcgdGV4dCdcblxuICAgICAgdmlldyA9IG5ldyBSZW1vdGVMaXN0VmlldyhyZXBvLCByZW1vdGVzLCBtb2RlOiAncHVzaCcpXG4gICAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuXG4gICAgICB3YWl0c0ZvciAtPiBnaXQuY21kLmNhbGxDb3VudCA+IDBcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncHVzaCcsICdyZW1vdGUxJ10sIG9wdGlvbnMsIGNvbG9yT3B0aW9uc1xuXG4gIGRlc2NyaWJlIFwid2hlbiBtb2RlIGlzICdwdXNoIC11J1wiLCAtPlxuICAgIGl0IFwiY2FsbHMgZ2l0LmNtZCB3aXRoIFsncHVzaCcsICctdSddIGFuZCByZW1vdGUgbmFtZVwiLCAtPlxuICAgICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSgncHVzaGluZyB0ZXh0JylcbiAgICAgIHZpZXcgPSBuZXcgUmVtb3RlTGlzdFZpZXcocmVwbywgcmVtb3RlcywgbW9kZTogJ3B1c2ggLXUnKVxuICAgICAgdmlldy5jb25maXJtU2VsZWN0aW9uKClcblxuICAgICAgd2FpdHNGb3IgLT4gZ2l0LmNtZC5jYWxsQ291bnQgPiAwXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChnaXQuY21kKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBbJ3B1c2gnLCAnLXUnLCAncmVtb3RlMScsICdIRUFEJ10sIG9wdGlvbnMsIGNvbG9yT3B0aW9uc1xuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgdGhlIGNvbmZpZyBmb3IgcHVsbCBiZWZvcmUgcHVzaCBpcyBzZXQgdG8gdHJ1ZVwiLCAtPlxuICAgIGRlc2NyaWJlIFwid2hlbiBwcm9tcHRGb3JCcmFuY2ggaXMgZGlzYWJsZWRcIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgZ2l0LmNtZCB3aXRoIFsncHVsbCddLCByZW1vdGUgbmFtZSwgYW5kIGJyYW5jaCBuYW1lIGFuZCB0aGVuIHdpdGggWydwdXNoJ11cIiwgLT5cbiAgICAgICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSAnYnJhbmNoMSdcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KHB1bGxCZWZvcmVQdXNoLCB0cnVlKVxuXG4gICAgICAgIHZpZXcgPSBuZXcgUmVtb3RlTGlzdFZpZXcocmVwbywgcmVtb3RlcywgbW9kZTogJ3B1c2gnKVxuICAgICAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+IGdpdC5jbWQuY2FsbENvdW50ID4gMVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncHVsbCcsICdvcmlnaW4nLCAnZm9vJ10sIG9wdGlvbnMsIGNvbG9yT3B0aW9uc1xuICAgICAgICAgIGV4cGVjdChnaXQuY21kKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBbJ3B1c2gnLCAncmVtb3RlMSddLCBvcHRpb25zLCBjb2xvck9wdGlvbnNcblxuICAgIGRlc2NyaWJlIFwid2hlbiBwcm9tcHRGb3JCcmFuY2ggaXMgZW5hYmxlZFwiLCAtPlxuICAgICAgaXQgXCJjYWxscyBnaXQuY21kIHdpdGggWydicmFuY2gnLCAnLS1uby1jb2xvcicsICctciddXCIsIC0+XG4gICAgICAgIHNweU9uKGdpdCwgJ2NtZCcpLmFuZFJldHVybiBQcm9taXNlLnJlc29sdmUgJ3JlbW90ZS9icmFuY2gxJ1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQocHVsbEJlZm9yZVB1c2gsIHRydWUpXG4gICAgICAgIGF0b20uY29uZmlnLnNldChwcm9tcHRGb3JCcmFuY2gsIHRydWUpXG5cbiAgICAgICAgdmlldyA9IG5ldyBSZW1vdGVMaXN0VmlldyhyZXBvLCByZW1vdGVzLCBtb2RlOiAncHVzaCcpXG4gICAgICAgIHZpZXcuY29uZmlybVNlbGVjdGlvbigpXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gZ2l0LmNtZC5jYWxsQ291bnQgPiAwXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggWydicmFuY2gnLCAnLS1uby1jb2xvcicsICctciddLCBvcHRpb25zXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGhlIHRoZSBjb25maWcgZm9yIHB1bGxSZWJhc2UgaXMgc2V0IHRvIHRydWVcIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgZ2l0LmNtZCB3aXRoIFsncHVsbCcsICctLXJlYmFzZSddLCByZW1vdGUgbmFtZSwgYW5kIGJyYW5jaCBuYW1lIGFuZCB0aGVuIHdpdGggWydwdXNoJ11cIiwgLT5cbiAgICAgICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSAnYnJhbmNoMSdcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KHB1bGxCZWZvcmVQdXNoLCB0cnVlKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQocHVsbFJlYmFzZSwgdHJ1ZSlcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KHByb21wdEZvckJyYW5jaCwgZmFsc2UpXG5cbiAgICAgICAgdmlldyA9IG5ldyBSZW1vdGVMaXN0VmlldyhyZXBvLCByZW1vdGVzLCBtb2RlOiAncHVzaCcpXG4gICAgICAgIHZpZXcuY29uZmlybVNlbGVjdGlvbigpXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gZ2l0LmNtZC5jYWxsQ291bnQgPiAxXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggWydwdWxsJywgJy0tcmViYXNlJywgJ29yaWdpbicsICdmb28nXSwgb3B0aW9ucywgY29sb3JPcHRpb25zXG4gICAgICAgICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncHVzaCcsICdyZW1vdGUxJ10sIG9wdGlvbnMsIGNvbG9yT3B0aW9uc1xuIl19
