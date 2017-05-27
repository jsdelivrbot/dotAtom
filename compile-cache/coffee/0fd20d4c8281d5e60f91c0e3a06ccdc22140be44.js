(function() {
  var GitInit, git;

  git = require('../../lib/git');

  GitInit = require('../../lib/models/git-init');

  describe("GitInit", function() {
    return it("sets the project path to the new repo path", function() {
      spyOn(atom.project, 'setPaths');
      spyOn(atom.project, 'getPaths').andCallFake(function() {
        return ['some/path'];
      });
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve(true);
      });
      return waitsForPromise(function() {
        return GitInit().then(function() {
          return expect(atom.project.setPaths).toHaveBeenCalledWith(['some/path']);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1pbml0LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVI7O0VBQ04sT0FBQSxHQUFVLE9BQUEsQ0FBUSwyQkFBUjs7RUFFVixRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBO1dBQ2xCLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBO01BQy9DLEtBQUEsQ0FBTSxJQUFJLENBQUMsT0FBWCxFQUFvQixVQUFwQjtNQUNBLEtBQUEsQ0FBTSxJQUFJLENBQUMsT0FBWCxFQUFvQixVQUFwQixDQUErQixDQUFDLFdBQWhDLENBQTRDLFNBQUE7ZUFBRyxDQUFDLFdBQUQ7TUFBSCxDQUE1QztNQUNBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUE7ZUFDNUIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEI7TUFENEIsQ0FBOUI7YUFFQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxPQUFBLENBQUEsQ0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFBO2lCQUNiLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQXBCLENBQTZCLENBQUMsb0JBQTlCLENBQW1ELENBQUMsV0FBRCxDQUFuRDtRQURhLENBQWY7TUFEYyxDQUFoQjtJQUwrQyxDQUFqRDtFQURrQixDQUFwQjtBQUhBIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vLi4vbGliL2dpdCdcbkdpdEluaXQgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1pbml0J1xuXG5kZXNjcmliZSBcIkdpdEluaXRcIiwgLT5cbiAgaXQgXCJzZXRzIHRoZSBwcm9qZWN0IHBhdGggdG8gdGhlIG5ldyByZXBvIHBhdGhcIiwgLT5cbiAgICBzcHlPbihhdG9tLnByb2plY3QsICdzZXRQYXRocycpXG4gICAgc3B5T24oYXRvbS5wcm9qZWN0LCAnZ2V0UGF0aHMnKS5hbmRDYWxsRmFrZSAtPiBbJ3NvbWUvcGF0aCddXG4gICAgc3B5T24oZ2l0LCAnY21kJykuYW5kQ2FsbEZha2UgLT5cbiAgICAgIFByb21pc2UucmVzb2x2ZSB0cnVlXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBHaXRJbml0KCkudGhlbiAtPlxuICAgICAgICBleHBlY3QoYXRvbS5wcm9qZWN0LnNldFBhdGhzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBbJ3NvbWUvcGF0aCddXG4iXX0=
