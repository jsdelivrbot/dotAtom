(function() {
  var GitStageHunk, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitStageHunk = require('../../lib/models/git-stage-hunk');

  describe("GitStageHunk", function() {
    it("calls git.unstagedFiles to get files to stage", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      GitStageHunk(repo);
      return expect(git.unstagedFiles).toHaveBeenCalled();
    });
    return it("opens the view for selecting files to choose from", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      return GitStageHunk(repo).then(function(view) {
        return expect(view).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1zdGFnZS1odW5rLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVI7O0VBQ0wsT0FBUSxPQUFBLENBQVEsYUFBUjs7RUFDVCxZQUFBLEdBQWUsT0FBQSxDQUFRLGlDQUFSOztFQUVmLFFBQUEsQ0FBUyxjQUFULEVBQXlCLFNBQUE7SUFDdkIsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUE7TUFDbEQsS0FBQSxDQUFNLEdBQU4sRUFBVyxlQUFYLENBQTJCLENBQUMsU0FBNUIsQ0FBc0MsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0JBQWhCLENBQXRDO01BQ0EsWUFBQSxDQUFhLElBQWI7YUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLGFBQVgsQ0FBeUIsQ0FBQyxnQkFBMUIsQ0FBQTtJQUhrRCxDQUFwRDtXQUtBLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBO01BQ3RELEtBQUEsQ0FBTSxHQUFOLEVBQVcsZUFBWCxDQUEyQixDQUFDLFNBQTVCLENBQXNDLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGtCQUFoQixDQUF0QzthQUNBLFlBQUEsQ0FBYSxJQUFiLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsU0FBQyxJQUFEO2VBQ3RCLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxXQUFiLENBQUE7TUFEc0IsQ0FBeEI7SUFGc0QsQ0FBeEQ7RUFOdUIsQ0FBekI7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG57cmVwb30gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbkdpdFN0YWdlSHVuayA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LXN0YWdlLWh1bmsnXG5cbmRlc2NyaWJlIFwiR2l0U3RhZ2VIdW5rXCIsIC0+XG4gIGl0IFwiY2FsbHMgZ2l0LnVuc3RhZ2VkRmlsZXMgdG8gZ2V0IGZpbGVzIHRvIHN0YWdlXCIsIC0+XG4gICAgc3B5T24oZ2l0LCAndW5zdGFnZWRGaWxlcycpLmFuZFJldHVybiBQcm9taXNlLnJlc29sdmUgJ3Vuc3RhZ2VkRmlsZS50eHQnXG4gICAgR2l0U3RhZ2VIdW5rIHJlcG9cbiAgICBleHBlY3QoZ2l0LnVuc3RhZ2VkRmlsZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGl0IFwib3BlbnMgdGhlIHZpZXcgZm9yIHNlbGVjdGluZyBmaWxlcyB0byBjaG9vc2UgZnJvbVwiLCAtPlxuICAgIHNweU9uKGdpdCwgJ3Vuc3RhZ2VkRmlsZXMnKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlICd1bnN0YWdlZEZpbGUudHh0J1xuICAgIEdpdFN0YWdlSHVuayhyZXBvKS50aGVuICh2aWV3KSAtPlxuICAgICAgZXhwZWN0KHZpZXcpLnRvQmVEZWZpbmVkKClcbiJdfQ==
