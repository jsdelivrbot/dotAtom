(function() {
  var GitDiff, GitDiffAll, RevisionView, currentPane, diffPane, fs, git, openPromise, pathToRepoFile, ref, repo, textEditor,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  ref = require('../fixtures'), repo = ref.repo, pathToRepoFile = ref.pathToRepoFile, textEditor = ref.textEditor;

  git = require('../../lib/git');

  GitDiff = require('../../lib/models/git-diff');

  GitDiffAll = require('../../lib/models/git-diff-all');

  RevisionView = require('../../lib/views/git-revision-view');

  currentPane = {
    splitRight: function() {}
  };

  diffPane = {
    splitRight: function() {
      return void 0;
    },
    getActiveEditor: function() {
      return textEditor;
    }
  };

  openPromise = {
    done: function(cb) {
      return cb(textEditor);
    }
  };

  describe("GitDiff", function() {
    beforeEach(function() {
      atom.config.set('git-plus.diffs.includeStagedDiff', true);
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      return waitsForPromise(function() {
        return GitDiff(repo, {
          file: pathToRepoFile
        });
      });
    });
    return describe("when git-plus.diffs.includeStagedDiff config is true", function() {
      return it("calls git.cmd and specifies 'HEAD'", function() {
        return expect(indexOf.call(git.cmd.mostRecentCall.args[0], 'HEAD') >= 0).toBe(true);
      });
    });
  });

  describe("GitDiff when git-plus.diffs.wordDiff config is true", function() {
    beforeEach(function() {
      atom.config.set('git-plus.diffs.wordDiff', true);
      atom.config.set('git-plus.diffs.includeStagedDiff', true);
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      return waitsForPromise(function() {
        return GitDiff(repo, {
          file: pathToRepoFile
        });
      });
    });
    return it("calls git.cmd and uses '--word-diff' flag", function() {
      return expect(indexOf.call(git.cmd.mostRecentCall.args[0], '--word-diff') >= 0).toBe(true);
    });
  });

  describe("GitDiff when a file is not specified", function() {
    beforeEach(function() {
      atom.config.set('git-plus.diffs.includeStagedDiff', true);
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(git, 'cmd').andReturn(Promise.resolve('diffs'));
      return waitsForPromise(function() {
        return GitDiff(repo);
      });
    });
    return it("checks for the current open file", function() {
      return expect(atom.workspace.getActiveTextEditor).toHaveBeenCalled();
    });
  });

  describe("when the useSplitDiff config is set to true", function() {
    it("calls RevisionView.showRevision", function() {
      atom.config.set('git-plus.experimental.useSplitDiff', true);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(RevisionView, 'showRevision');
      GitDiff(repo, {
        file: pathToRepoFile
      });
      waitsFor(function() {
        return RevisionView.showRevision.callCount > 0;
      });
      return runs(function() {
        expect(atom.workspace.open).toHaveBeenCalled();
        return expect(RevisionView.showRevision).toHaveBeenCalledWith(repo, textEditor, repo.branch);
      });
    });
    describe("when no current repository file is open", function() {
      return it("notifies user that the split-diff feature won't work unless invoked on a repository file", function() {
        atom.config.set('git-plus.experimental.useSplitDiff', true);
        spyOn(atom.workspace, 'open');
        spyOn(RevisionView, 'showRevision');
        GitDiff(repo);
        expect(atom.workspace.open).not.toHaveBeenCalled();
        return expect(RevisionView.showRevision).not.toHaveBeenCalled();
      });
    });
    return describe("when file option is '.'", function() {
      return it("does not try to use split-dif", function() {
        atom.config.set('git-plus.experimental.useSplitDiff', true);
        spyOn(atom.workspace, 'open');
        spyOn(RevisionView, 'showRevision');
        GitDiff(repo, {
          file: '.'
        });
        expect(atom.workspace.open).not.toHaveBeenCalled();
        return expect(RevisionView.showRevision).not.toHaveBeenCalled();
      });
    });
  });

  describe("GitDiffAll", function() {
    beforeEach(function() {
      atom.config.set('git-plus.diffs.includeStagedDiff', true);
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
      spyOn(fs, 'writeFile').andCallFake(function() {
        return fs.writeFile.mostRecentCall.args[3]();
      });
      spyOn(git, 'cmd').andCallFake(function() {
        var args;
        args = git.cmd.mostRecentCall.args[0];
        if (args[2] === '--stat') {
          return Promise.resolve('diff stats\n');
        } else {
          return Promise.resolve('diffs');
        }
      });
      return waitsForPromise(function() {
        return GitDiffAll(repo);
      });
    });
    return it("includes the diff stats in the diffs window", function() {
      return expect(fs.writeFile.mostRecentCall.args[1].includes('diff stats')).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1kaWZmLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxxSEFBQTtJQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxNQUFxQyxPQUFBLENBQVEsYUFBUixDQUFyQyxFQUFDLGVBQUQsRUFBTyxtQ0FBUCxFQUF1Qjs7RUFDdkIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNOLE9BQUEsR0FBVSxPQUFBLENBQVEsMkJBQVI7O0VBQ1YsVUFBQSxHQUFhLE9BQUEsQ0FBUSwrQkFBUjs7RUFDYixZQUFBLEdBQWUsT0FBQSxDQUFRLG1DQUFSOztFQUVmLFdBQUEsR0FDRTtJQUFBLFVBQUEsRUFBWSxTQUFBLEdBQUEsQ0FBWjs7O0VBQ0YsUUFBQSxHQUNFO0lBQUEsVUFBQSxFQUFZLFNBQUE7YUFBRztJQUFILENBQVo7SUFDQSxlQUFBLEVBQWlCLFNBQUE7YUFBRztJQUFILENBRGpCOzs7RUFFRixXQUFBLEdBQ0U7SUFBQSxJQUFBLEVBQU0sU0FBQyxFQUFEO2FBQVEsRUFBQSxDQUFHLFVBQUg7SUFBUixDQUFOOzs7RUFFRixRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBO0lBQ2xCLFVBQUEsQ0FBVyxTQUFBO01BQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixFQUFvRCxJQUFwRDtNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixxQkFBdEIsQ0FBNEMsQ0FBQyxTQUE3QyxDQUF1RCxVQUF2RDtNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixNQUF0QixDQUE2QixDQUFDLFNBQTlCLENBQXdDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFVBQWhCLENBQXhDO01BQ0EsS0FBQSxDQUFNLEdBQU4s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QUFBO2lCQUdFLE9BQU8sQ0FBQyxPQUFSLENBQWdCLE9BQWhCLEVBSEY7O01BRjRCLENBQTlCO2FBTUEsZUFBQSxDQUFnQixTQUFBO2VBQ2QsVUFBQSxDQUFXLElBQVg7TUFEYyxDQUFoQjtJQVhTLENBQVg7V0FjQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQTthQUNoRCxNQUFBLENBQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQXBDLENBQTZDLFlBQTdDLENBQVAsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxJQUF2RTtJQURnRCxDQUFsRDtFQWZxQixDQUF2QjtBQWhHQSIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMtcGx1cydcbntyZXBvLCBwYXRoVG9SZXBvRmlsZSwgdGV4dEVkaXRvcn0gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbmdpdCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG5HaXREaWZmID0gcmVxdWlyZSAnLi4vLi4vbGliL21vZGVscy9naXQtZGlmZidcbkdpdERpZmZBbGwgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1kaWZmLWFsbCdcblJldmlzaW9uVmlldyA9IHJlcXVpcmUgJy4uLy4uL2xpYi92aWV3cy9naXQtcmV2aXNpb24tdmlldydcblxuY3VycmVudFBhbmUgPVxuICBzcGxpdFJpZ2h0OiAtPlxuZGlmZlBhbmUgPVxuICBzcGxpdFJpZ2h0OiAtPiB1bmRlZmluZWRcbiAgZ2V0QWN0aXZlRWRpdG9yOiAtPiB0ZXh0RWRpdG9yXG5vcGVuUHJvbWlzZSA9XG4gIGRvbmU6IChjYikgLT4gY2IgdGV4dEVkaXRvclxuXG5kZXNjcmliZSBcIkdpdERpZmZcIiwgLT5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20uY29uZmlnLnNldCAnZ2l0LXBsdXMuZGlmZnMuaW5jbHVkZVN0YWdlZERpZmYnLCB0cnVlXG4gICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdnZXRBY3RpdmVUZXh0RWRpdG9yJykuYW5kUmV0dXJuIHRleHRFZGl0b3JcbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ29wZW4nKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlIHRleHRFZGl0b3JcbiAgICBzcHlPbihnaXQsICdjbWQnKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCdkaWZmcycpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBHaXREaWZmIHJlcG8sIGZpbGU6IHBhdGhUb1JlcG9GaWxlXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGdpdC1wbHVzLmRpZmZzLmluY2x1ZGVTdGFnZWREaWZmIGNvbmZpZyBpcyB0cnVlXCIsIC0+XG4gICAgaXQgXCJjYWxscyBnaXQuY21kIGFuZCBzcGVjaWZpZXMgJ0hFQUQnXCIsIC0+XG4gICAgICBleHBlY3QoJ0hFQUQnIGluIGdpdC5jbWQubW9zdFJlY2VudENhbGwuYXJnc1swXSkudG9CZSB0cnVlXG5cbmRlc2NyaWJlIFwiR2l0RGlmZiB3aGVuIGdpdC1wbHVzLmRpZmZzLndvcmREaWZmIGNvbmZpZyBpcyB0cnVlXCIsIC0+XG4gIGJlZm9yZUVhY2ggLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ2dpdC1wbHVzLmRpZmZzLndvcmREaWZmJywgdHJ1ZVxuICAgIGF0b20uY29uZmlnLnNldCAnZ2l0LXBsdXMuZGlmZnMuaW5jbHVkZVN0YWdlZERpZmYnLCB0cnVlXG4gICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdnZXRBY3RpdmVUZXh0RWRpdG9yJykuYW5kUmV0dXJuIHRleHRFZGl0b3JcbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ29wZW4nKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlIHRleHRFZGl0b3JcbiAgICBzcHlPbihnaXQsICdjbWQnKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCdkaWZmcycpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBHaXREaWZmIHJlcG8sIGZpbGU6IHBhdGhUb1JlcG9GaWxlXG5cbiAgaXQgXCJjYWxscyBnaXQuY21kIGFuZCB1c2VzICctLXdvcmQtZGlmZicgZmxhZ1wiLCAtPlxuICAgIGV4cGVjdCgnLS13b3JkLWRpZmYnIGluIGdpdC5jbWQubW9zdFJlY2VudENhbGwuYXJnc1swXSkudG9CZSB0cnVlXG5cbmRlc2NyaWJlIFwiR2l0RGlmZiB3aGVuIGEgZmlsZSBpcyBub3Qgc3BlY2lmaWVkXCIsIC0+XG4gIGJlZm9yZUVhY2ggLT5cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ2dpdC1wbHVzLmRpZmZzLmluY2x1ZGVTdGFnZWREaWZmJywgdHJ1ZVxuICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnZ2V0QWN0aXZlVGV4dEVkaXRvcicpLmFuZFJldHVybiB0ZXh0RWRpdG9yXG4gICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdvcGVuJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSB0ZXh0RWRpdG9yXG4gICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSgnZGlmZnMnKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgR2l0RGlmZiByZXBvXG5cbiAgaXQgXCJjaGVja3MgZm9yIHRoZSBjdXJyZW50IG9wZW4gZmlsZVwiLCAtPlxuICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuZGVzY3JpYmUgXCJ3aGVuIHRoZSB1c2VTcGxpdERpZmYgY29uZmlnIGlzIHNldCB0byB0cnVlXCIsIC0+XG4gIGl0IFwiY2FsbHMgUmV2aXNpb25WaWV3LnNob3dSZXZpc2lvblwiLCAtPlxuICAgIGF0b20uY29uZmlnLnNldCgnZ2l0LXBsdXMuZXhwZXJpbWVudGFsLnVzZVNwbGl0RGlmZicsIHRydWUpXG4gICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdvcGVuJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSB0ZXh0RWRpdG9yXG4gICAgc3B5T24oUmV2aXNpb25WaWV3LCAnc2hvd1JldmlzaW9uJylcbiAgICBHaXREaWZmKHJlcG8sIGZpbGU6IHBhdGhUb1JlcG9GaWxlKVxuICAgIHdhaXRzRm9yIC0+IFJldmlzaW9uVmlldy5zaG93UmV2aXNpb24uY2FsbENvdW50ID4gMFxuICAgIHJ1bnMgLT5cbiAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChSZXZpc2lvblZpZXcuc2hvd1JldmlzaW9uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCByZXBvLCB0ZXh0RWRpdG9yLCByZXBvLmJyYW5jaFxuXG4gIGRlc2NyaWJlIFwid2hlbiBubyBjdXJyZW50IHJlcG9zaXRvcnkgZmlsZSBpcyBvcGVuXCIsIC0+XG4gICAgaXQgXCJub3RpZmllcyB1c2VyIHRoYXQgdGhlIHNwbGl0LWRpZmYgZmVhdHVyZSB3b24ndCB3b3JrIHVubGVzcyBpbnZva2VkIG9uIGEgcmVwb3NpdG9yeSBmaWxlXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2dpdC1wbHVzLmV4cGVyaW1lbnRhbC51c2VTcGxpdERpZmYnLCB0cnVlKVxuICAgICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdvcGVuJylcbiAgICAgIHNweU9uKFJldmlzaW9uVmlldywgJ3Nob3dSZXZpc2lvbicpXG4gICAgICBHaXREaWZmKHJlcG8pXG4gICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2Uub3Blbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KFJldmlzaW9uVmlldy5zaG93UmV2aXNpb24pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSBcIndoZW4gZmlsZSBvcHRpb24gaXMgJy4nXCIsIC0+XG4gICAgaXQgXCJkb2VzIG5vdCB0cnkgdG8gdXNlIHNwbGl0LWRpZlwiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KCdnaXQtcGx1cy5leHBlcmltZW50YWwudXNlU3BsaXREaWZmJywgdHJ1ZSlcbiAgICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnb3BlbicpXG4gICAgICBzcHlPbihSZXZpc2lvblZpZXcsICdzaG93UmV2aXNpb24nKVxuICAgICAgR2l0RGlmZihyZXBvLCBmaWxlOiAnLicpXG4gICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2Uub3Blbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KFJldmlzaW9uVmlldy5zaG93UmV2aXNpb24pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuIyBkZXNjcmliZSBcIndoZW4gZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lIGNvbmZpZyBpcyB0cnVlXCIsIC0+XG4jICAgYmVmb3JlRWFjaCAtPlxuIyAgICAgYXRvbS5jb25maWcuc2V0ICdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnLCB0cnVlXG4jICAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ2dldEFjdGl2ZVBhbmUnKS5hbmRSZXR1cm4gY3VycmVudFBhbmVcbiMgICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnb3BlbicpLmFuZFJldHVybiB0ZXh0RWRpdG9yXG4jICAgICBzcHlPbihjdXJyZW50UGFuZSwgJ3NwbGl0UmlnaHQnKS5hbmRSZXR1cm4gY3VycmVudFBhbmVcbiMgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuIyAgICAgICBHaXREaWZmIHJlcG8sIGZpbGU6ICcuJ1xuI1xuIyAgIGRlc2NyaWJlIFwid2hlbiBnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZSBjb25maWcgaXMgbm90IHNldFwiLCAtPlxuIyAgICAgaXQgXCJkZWZhdWx0cyB0byBzcGxpdFJpZ2h0XCIsIC0+XG4jICAgICAgIGV4cGVjdChjdXJyZW50UGFuZS5zcGxpdFJpZ2h0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiMgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG5kZXNjcmliZSBcIkdpdERpZmZBbGxcIiwgLT5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20uY29uZmlnLnNldCAnZ2l0LXBsdXMuZGlmZnMuaW5jbHVkZVN0YWdlZERpZmYnLCB0cnVlXG4gICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdnZXRBY3RpdmVUZXh0RWRpdG9yJykuYW5kUmV0dXJuIHRleHRFZGl0b3JcbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ29wZW4nKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlIHRleHRFZGl0b3JcbiAgICBzcHlPbihmcywgJ3dyaXRlRmlsZScpLmFuZENhbGxGYWtlIC0+IGZzLndyaXRlRmlsZS5tb3N0UmVjZW50Q2FsbC5hcmdzWzNdKClcbiAgICBzcHlPbihnaXQsICdjbWQnKS5hbmRDYWxsRmFrZSAtPlxuICAgICAgYXJncyA9IGdpdC5jbWQubW9zdFJlY2VudENhbGwuYXJnc1swXVxuICAgICAgaWYgYXJnc1syXSBpcyAnLS1zdGF0J1xuICAgICAgICBQcm9taXNlLnJlc29sdmUgJ2RpZmYgc3RhdHNcXG4nXG4gICAgICBlbHNlXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSAnZGlmZnMnXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBHaXREaWZmQWxsIHJlcG9cblxuICBpdCBcImluY2x1ZGVzIHRoZSBkaWZmIHN0YXRzIGluIHRoZSBkaWZmcyB3aW5kb3dcIiwgLT5cbiAgICBleHBlY3QoZnMud3JpdGVGaWxlLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMV0uaW5jbHVkZXMgJ2RpZmYgc3RhdHMnKS50b0JlIHRydWVcbiJdfQ==
