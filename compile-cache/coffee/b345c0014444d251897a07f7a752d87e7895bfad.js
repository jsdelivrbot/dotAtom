(function() {
  var Conflict, Directory, GitOps, MergeConflictsView, MergeState, _, path, util;

  Directory = require('atom').Directory;

  path = require('path');

  _ = require('underscore-plus');

  MergeConflictsView = require('../../lib/view/merge-conflicts-view').MergeConflictsView;

  MergeState = require('../../lib/merge-state').MergeState;

  Conflict = require('../../lib/conflict').Conflict;

  GitOps = require('../../lib/git').GitOps;

  util = require('../util');

  describe('MergeConflictsView', function() {
    var context, fullPath, pkg, ref, repoPath, state, view;
    ref = [], view = ref[0], context = ref[1], state = ref[2], pkg = ref[3];
    fullPath = function(fname) {
      return path.join(atom.project.getPaths()[0], 'path', fname);
    };
    repoPath = function(fname) {
      return context.workingDirectory.relativize(fullPath(fname));
    };
    beforeEach(function() {
      var conflicts, workingDirectory;
      pkg = util.pkgEmitter();
      workingDirectory = new Directory(atom.project.getRepositories()[0].getWorkingDirectory());
      context = {
        isRebase: false,
        workingDirPath: workingDirectory.path,
        workingDirectory: workingDirectory,
        readConflicts: function() {
          return Promise.resolve(conflicts);
        },
        checkoutSide: function() {
          return Promise.resolve();
        }
      };
      conflicts = _.map(['file1.txt', 'file2.txt'], function(fname) {
        return {
          path: repoPath(fname),
          message: 'both modified'
        };
      });
      return util.openPath('triple-2way-diff.txt', function(editorView) {
        state = new MergeState(conflicts, context, false);
        conflicts = Conflict.all(state, editorView.getModel());
        return view = new MergeConflictsView(state, pkg);
      });
    });
    afterEach(function() {
      return pkg.dispose();
    });
    describe('conflict resolution progress', function() {
      var progressFor;
      progressFor = function(filename) {
        return view.pathList.find("li[data-path='" + (repoPath(filename)) + "'] progress")[0];
      };
      it('starts at zero', function() {
        expect(progressFor('file1.txt').value).toBe(0);
        return expect(progressFor('file2.txt').value).toBe(0);
      });
      return it('advances when requested', function() {
        var progress1;
        pkg.didResolveConflict({
          file: fullPath('file1.txt'),
          total: 3,
          resolved: 2
        });
        progress1 = progressFor('file1.txt');
        expect(progress1.value).toBe(2);
        return expect(progress1.max).toBe(3);
      });
    });
    describe('tracking the progress of staging', function() {
      var isMarkedWith;
      isMarkedWith = function(filename, icon) {
        var rs;
        rs = view.pathList.find("li[data-path='" + (repoPath(filename)) + "'] span.icon-" + icon);
        return rs.length !== 0;
      };
      it('starts without files marked as staged', function() {
        expect(isMarkedWith('file1.txt', 'dash')).toBe(true);
        return expect(isMarkedWith('file2.txt', 'dash')).toBe(true);
      });
      return it('marks files as staged on events', function() {
        context.readConflicts = function() {
          return Promise.resolve([
            {
              path: repoPath("file2.txt"),
              message: "both modified"
            }
          ]);
        };
        pkg.didResolveFile({
          file: fullPath('file1.txt')
        });
        waitsFor(function() {
          return isMarkedWith('file1.txt', 'check');
        });
        return runs(function() {
          expect(isMarkedWith('file1.txt', 'check')).toBe(true);
          return expect(isMarkedWith('file2.txt', 'dash')).toBe(true);
        });
      });
    });
    return it('minimizes and restores the view on request', function() {
      expect(view.hasClass('minimized')).toBe(false);
      view.minimize();
      expect(view.hasClass('minimized')).toBe(true);
      view.restore();
      return expect(view.hasClass('minimized')).toBe(false);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL3ZpZXcvbWVyZ2UtY29uZmxpY3RzLXZpZXctc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFlBQWEsT0FBQSxDQUFRLE1BQVI7O0VBQ2QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBRUgscUJBQXNCLE9BQUEsQ0FBUSxxQ0FBUjs7RUFFdEIsYUFBYyxPQUFBLENBQVEsdUJBQVI7O0VBQ2QsV0FBWSxPQUFBLENBQVEsb0JBQVI7O0VBQ1osU0FBVSxPQUFBLENBQVEsZUFBUjs7RUFDWCxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVI7O0VBRVAsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUE7QUFDN0IsUUFBQTtJQUFBLE1BQThCLEVBQTlCLEVBQUMsYUFBRCxFQUFPLGdCQUFQLEVBQWdCLGNBQWhCLEVBQXVCO0lBRXZCLFFBQUEsR0FBVyxTQUFDLEtBQUQ7YUFDVCxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxDQUFsQyxFQUFzQyxNQUF0QyxFQUE4QyxLQUE5QztJQURTO0lBR1gsUUFBQSxHQUFXLFNBQUMsS0FBRDthQUNULE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUF6QixDQUFvQyxRQUFBLENBQVMsS0FBVCxDQUFwQztJQURTO0lBR1gsVUFBQSxDQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxVQUFMLENBQUE7TUFFTixnQkFBQSxHQUF1QixJQUFBLFNBQUEsQ0FBVSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWIsQ0FBQSxDQUErQixDQUFBLENBQUEsQ0FBRSxDQUFDLG1CQUFsQyxDQUFBLENB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YXRoID0gcmVxdWlyZSAncGF0aCdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbntNZXJnZUNvbmZsaWN0c1ZpZXd9ID0gcmVxdWlyZSAnLi4vLi4vbGliL3ZpZXcvbWVyZ2UtY29uZmxpY3RzLXZpZXcnXG5cbntNZXJnZVN0YXRlfSA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tZXJnZS1zdGF0ZSdcbntDb25mbGljdH0gPSByZXF1aXJlICcuLi8uLi9saWIvY29uZmxpY3QnXG57R2l0T3BzfSA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG51dGlsID0gcmVxdWlyZSAnLi4vdXRpbCdcblxuZGVzY3JpYmUgJ01lcmdlQ29uZmxpY3RzVmlldycsIC0+XG4gIFt2aWV3LCBjb250ZXh0LCBzdGF0ZSwgcGtnXSA9IFtdXG5cbiAgZnVsbFBhdGggPSAoZm5hbWUpIC0+XG4gICAgcGF0aC5qb2luIGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCAncGF0aCcsIGZuYW1lXG5cbiAgcmVwb1BhdGggPSAoZm5hbWUpIC0+XG4gICAgY29udGV4dC53b3JraW5nRGlyZWN0b3J5LnJlbGF0aXZpemUgZnVsbFBhdGgoZm5hbWUpXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHBrZyA9IHV0aWwucGtnRW1pdHRlcigpXG5cbiAgICB3b3JraW5nRGlyZWN0b3J5ID0gbmV3IERpcmVjdG9yeSBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbMF0uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbiAgICBjb250ZXh0ID1cbiAgICAgIGlzUmViYXNlOiBmYWxzZVxuICAgICAgd29ya2luZ0RpclBhdGg6IHdvcmtpbmdEaXJlY3RvcnkucGF0aFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogd29ya2luZ0RpcmVjdG9yeVxuICAgICAgcmVhZENvbmZsaWN0czogLT4gUHJvbWlzZS5yZXNvbHZlIGNvbmZsaWN0c1xuICAgICAgY2hlY2tvdXRTaWRlOiAtPiBQcm9taXNlLnJlc29sdmUoKVxuXG4gICAgY29uZmxpY3RzID0gXy5tYXAgWydmaWxlMS50eHQnLCAnZmlsZTIudHh0J10sIChmbmFtZSkgLT5cbiAgICAgIHsgcGF0aDogcmVwb1BhdGgoZm5hbWUpLCBtZXNzYWdlOiAnYm90aCBtb2RpZmllZCcgfVxuXG4gICAgdXRpbC5vcGVuUGF0aCAndHJpcGxlLTJ3YXktZGlmZi50eHQnLCAoZWRpdG9yVmlldykgLT5cbiAgICAgIHN0YXRlID0gbmV3IE1lcmdlU3RhdGUgY29uZmxpY3RzLCBjb250ZXh0LCBmYWxzZVxuICAgICAgY29uZmxpY3RzID0gQ29uZmxpY3QuYWxsIHN0YXRlLCBlZGl0b3JWaWV3LmdldE1vZGVsKClcblxuICAgICAgdmlldyA9IG5ldyBNZXJnZUNvbmZsaWN0c1ZpZXcoc3RhdGUsIHBrZylcblxuICBhZnRlckVhY2ggLT5cbiAgICBwa2cuZGlzcG9zZSgpXG5cbiAgZGVzY3JpYmUgJ2NvbmZsaWN0IHJlc29sdXRpb24gcHJvZ3Jlc3MnLCAtPlxuICAgIHByb2dyZXNzRm9yID0gKGZpbGVuYW1lKSAtPlxuICAgICAgdmlldy5wYXRoTGlzdC5maW5kKFwibGlbZGF0YS1wYXRoPScje3JlcG9QYXRoIGZpbGVuYW1lfSddIHByb2dyZXNzXCIpWzBdXG5cbiAgICBpdCAnc3RhcnRzIGF0IHplcm8nLCAtPlxuICAgICAgZXhwZWN0KHByb2dyZXNzRm9yKCdmaWxlMS50eHQnKS52YWx1ZSkudG9CZSgwKVxuICAgICAgZXhwZWN0KHByb2dyZXNzRm9yKCdmaWxlMi50eHQnKS52YWx1ZSkudG9CZSgwKVxuXG4gICAgaXQgJ2FkdmFuY2VzIHdoZW4gcmVxdWVzdGVkJywgLT5cbiAgICAgIHBrZy5kaWRSZXNvbHZlQ29uZmxpY3RcbiAgICAgICAgZmlsZTogZnVsbFBhdGgoJ2ZpbGUxLnR4dCcpLFxuICAgICAgICB0b3RhbDogMyxcbiAgICAgICAgcmVzb2x2ZWQ6IDJcbiAgICAgIHByb2dyZXNzMSA9IHByb2dyZXNzRm9yICdmaWxlMS50eHQnXG4gICAgICBleHBlY3QocHJvZ3Jlc3MxLnZhbHVlKS50b0JlKDIpXG4gICAgICBleHBlY3QocHJvZ3Jlc3MxLm1heCkudG9CZSgzKVxuXG4gIGRlc2NyaWJlICd0cmFja2luZyB0aGUgcHJvZ3Jlc3Mgb2Ygc3RhZ2luZycsIC0+XG5cbiAgICBpc01hcmtlZFdpdGggPSAoZmlsZW5hbWUsIGljb24pIC0+XG4gICAgICBycyA9IHZpZXcucGF0aExpc3QuZmluZChcImxpW2RhdGEtcGF0aD0nI3tyZXBvUGF0aCBmaWxlbmFtZX0nXSBzcGFuLmljb24tI3tpY29ufVwiKVxuICAgICAgcnMubGVuZ3RoIGlzbnQgMFxuXG4gICAgaXQgJ3N0YXJ0cyB3aXRob3V0IGZpbGVzIG1hcmtlZCBhcyBzdGFnZWQnLCAtPlxuICAgICAgZXhwZWN0KGlzTWFya2VkV2l0aCAnZmlsZTEudHh0JywgJ2Rhc2gnKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaXNNYXJrZWRXaXRoICdmaWxlMi50eHQnLCAnZGFzaCcpLnRvQmUodHJ1ZSlcblxuICAgIGl0ICdtYXJrcyBmaWxlcyBhcyBzdGFnZWQgb24gZXZlbnRzJywgLT5cbiAgICAgIGNvbnRleHQucmVhZENvbmZsaWN0cyA9IC0+IFByb21pc2UucmVzb2x2ZShbeyBwYXRoOiByZXBvUGF0aChcImZpbGUyLnR4dFwiKSwgbWVzc2FnZTogXCJib3RoIG1vZGlmaWVkXCJ9XSlcblxuICAgICAgcGtnLmRpZFJlc29sdmVGaWxlIGZpbGU6IGZ1bGxQYXRoKCdmaWxlMS50eHQnKVxuXG4gICAgICAjIFRlcnJpYmxlIGhhY2suXG4gICAgICB3YWl0c0ZvciAtPiBpc01hcmtlZFdpdGggJ2ZpbGUxLnR4dCcsICdjaGVjaydcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoaXNNYXJrZWRXaXRoICdmaWxlMS50eHQnLCAnY2hlY2snKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChpc01hcmtlZFdpdGggJ2ZpbGUyLnR4dCcsICdkYXNoJykudG9CZSh0cnVlKVxuXG4gIGl0ICdtaW5pbWl6ZXMgYW5kIHJlc3RvcmVzIHRoZSB2aWV3IG9uIHJlcXVlc3QnLCAtPlxuICAgIGV4cGVjdCh2aWV3Lmhhc0NsYXNzICdtaW5pbWl6ZWQnKS50b0JlKGZhbHNlKVxuICAgIHZpZXcubWluaW1pemUoKVxuICAgIGV4cGVjdCh2aWV3Lmhhc0NsYXNzICdtaW5pbWl6ZWQnKS50b0JlKHRydWUpXG4gICAgdmlldy5yZXN0b3JlKClcbiAgICBleHBlY3Qodmlldy5oYXNDbGFzcyAnbWluaW1pemVkJykudG9CZShmYWxzZSlcbiJdfQ==
