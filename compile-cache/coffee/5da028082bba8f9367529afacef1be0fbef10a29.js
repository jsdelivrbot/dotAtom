(function() {
  var SelectStageHunkFiles, SelectStageHunks, fs, git, pathToRepoFile, ref, repo;

  fs = require('fs-plus');

  git = require('../../lib/git');

  ref = require('../fixtures'), repo = ref.repo, pathToRepoFile = ref.pathToRepoFile;

  SelectStageHunkFiles = require('../../lib/views/select-stage-hunk-file-view');

  SelectStageHunks = require('../../lib/views/select-stage-hunks-view');

  describe("SelectStageHunkFiles", function() {
    return it("gets the diff of the selected file", function() {
      var fileItem, view;
      spyOn(git, 'diff').andReturn(Promise.resolve(''));
      fileItem = {
        path: pathToRepoFile
      };
      view = new SelectStageHunkFiles(repo, [fileItem]);
      view.confirmSelection();
      return expect(git.diff).toHaveBeenCalledWith(repo, pathToRepoFile);
    });
  });

  describe("SelectStageHunks", function() {
    return it("stages the selected hunk", function() {
      var hunk, patch_path, view;
      spyOn(git, 'cmd').andReturn(Promise.resolve(''));
      spyOn(fs, 'unlink');
      spyOn(fs, 'writeFile').andCallFake(function() {
        return fs.writeFile.mostRecentCall.args[3]();
      });
      hunk = {
        match: function() {
          return [1, 'this is a diff', 'hunk'];
        }
      };
      view = new SelectStageHunks(repo, ["patch_path hunk1", hunk]);
      patch_path = repo.getWorkingDirectory() + '/GITPLUS_PATCH';
      view.confirmSelection();
      view.find('.btn-stage-button').click();
      return expect(git.cmd).toHaveBeenCalledWith(['apply', '--cached', '--', patch_path], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3Mvc2VsZWN0LXN0YWdlLWh1bmstZmlsZXMtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUjs7RUFDTixNQUF5QixPQUFBLENBQVEsYUFBUixDQUF6QixFQUFDLGVBQUQsRUFBTzs7RUFDUCxvQkFBQSxHQUF1QixPQUFBLENBQVEsNkNBQVI7O0VBQ3ZCLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSx5Q0FBUjs7RUFFbkIsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7V0FDL0IsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUE7QUFDdkMsVUFBQTtNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsTUFBWCxDQUFrQixDQUFDLFNBQW5CLENBQTZCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEVBQWhCLENBQTdCO01BQ0EsUUFBQSxHQUNFO1FBQUEsSUFBQSxFQUFNLGNBQU47O01BQ0YsSUFBQSxHQUFXLElBQUEsb0JBQUEsQ0FBcUIsSUFBckIsRUFBMkIsQ0FBQyxRQUFELENBQTNCO01BQ1gsSUFBSSxDQUFDLGdCQUFMLENBQUE7YUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLElBQVgsQ0FBZ0IsQ0FBQyxvQkFBakIsQ0FBc0MsSUFBdEMsRUFBNEMsY0FBNUM7SUFOdUMsQ0FBekM7RUFEK0IsQ0FBakM7O0VBU0EsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7V0FDM0IsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7QUFDN0IsVUFBQTtNQUFBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLEVBQWhCLENBQTVCO01BQ0EsS0FBQSxDQUFNLEVBQU4sRUFBVSxRQUFWO01BQ0EsS0FBQSxDQUFNLEVBQU4sRUFBVSxXQUFWLENBQXNCLENBQUMsV0FBdkIsQ0FBbUMsU0FBQTtlQUNqQyxFQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFqQyxDQUFBO01BRGlDLENBQW5DO01BRUEsSUFBQSxHQUNFO1FBQUEsS0FBQSxFQUFPLFNBQUE7aUJBQUcsQ0FBQyxDQUFELEVBQUksZ0JBQUosRUFBc0IsTUFBdEI7UUFBSCxDQUFQOztNQUNGLElBQUEsR0FBVyxJQUFBLGdCQUFBLENBQWlCLElBQWpCLEVBQXVCLENBQUMsa0JBQUQsRUFBcUIsSUFBckIsQ0FBdkI7TUFDWCxVQUFBLEdBQWEsSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBQSxHQUE2QjtNQUMxQyxJQUFJLENBQUMsZ0JBQUwsQ0FBQTtNQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsbUJBQVYsQ0FBOEIsQ0FBQyxLQUEvQixDQUFBO2FBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxPQUFELEVBQVUsVUFBVixFQUFzQixJQUF0QixFQUE0QixVQUE1QixDQUFyQyxFQUE4RTtRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQTlFO0lBWDZCLENBQS9CO0VBRDJCLENBQTdCO0FBZkEiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5naXQgPSByZXF1aXJlICcuLi8uLi9saWIvZ2l0J1xue3JlcG8sIHBhdGhUb1JlcG9GaWxlfSA9IHJlcXVpcmUgJy4uL2ZpeHR1cmVzJ1xuU2VsZWN0U3RhZ2VIdW5rRmlsZXMgPSByZXF1aXJlICcuLi8uLi9saWIvdmlld3Mvc2VsZWN0LXN0YWdlLWh1bmstZmlsZS12aWV3J1xuU2VsZWN0U3RhZ2VIdW5rcyA9IHJlcXVpcmUgJy4uLy4uL2xpYi92aWV3cy9zZWxlY3Qtc3RhZ2UtaHVua3MtdmlldydcblxuZGVzY3JpYmUgXCJTZWxlY3RTdGFnZUh1bmtGaWxlc1wiLCAtPlxuICBpdCBcImdldHMgdGhlIGRpZmYgb2YgdGhlIHNlbGVjdGVkIGZpbGVcIiwgLT5cbiAgICBzcHlPbihnaXQsICdkaWZmJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSAnJ1xuICAgIGZpbGVJdGVtID1cbiAgICAgIHBhdGg6IHBhdGhUb1JlcG9GaWxlXG4gICAgdmlldyA9IG5ldyBTZWxlY3RTdGFnZUh1bmtGaWxlcyhyZXBvLCBbZmlsZUl0ZW1dKVxuICAgIHZpZXcuY29uZmlybVNlbGVjdGlvbigpXG4gICAgZXhwZWN0KGdpdC5kaWZmKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCByZXBvLCBwYXRoVG9SZXBvRmlsZVxuXG5kZXNjcmliZSBcIlNlbGVjdFN0YWdlSHVua3NcIiwgLT5cbiAgaXQgXCJzdGFnZXMgdGhlIHNlbGVjdGVkIGh1bmtcIiwgLT5cbiAgICBzcHlPbihnaXQsICdjbWQnKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlICcnXG4gICAgc3B5T24oZnMsICd1bmxpbmsnKVxuICAgIHNweU9uKGZzLCAnd3JpdGVGaWxlJykuYW5kQ2FsbEZha2UgLT5cbiAgICAgIGZzLndyaXRlRmlsZS5tb3N0UmVjZW50Q2FsbC5hcmdzWzNdKClcbiAgICBodW5rID1cbiAgICAgIG1hdGNoOiAtPiBbMSwgJ3RoaXMgaXMgYSBkaWZmJywgJ2h1bmsnXVxuICAgIHZpZXcgPSBuZXcgU2VsZWN0U3RhZ2VIdW5rcyhyZXBvLCBbXCJwYXRjaF9wYXRoIGh1bmsxXCIsIGh1bmtdKVxuICAgIHBhdGNoX3BhdGggPSByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSArICcvR0lUUExVU19QQVRDSCdcbiAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuICAgIHZpZXcuZmluZCgnLmJ0bi1zdGFnZS1idXR0b24nKS5jbGljaygpXG4gICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsnYXBwbHknLCAnLS1jYWNoZWQnLCAnLS0nLCBwYXRjaF9wYXRoXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuIl19
