(function() {
  var GitRemove, currentPane, git, pathToRepoFile, ref, repo, textEditor,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  git = require('../../lib/git');

  ref = require('../fixtures'), repo = ref.repo, pathToRepoFile = ref.pathToRepoFile, textEditor = ref.textEditor, currentPane = ref.currentPane;

  GitRemove = require('../../lib/models/git-remove');

  describe("GitRemove", function() {
    beforeEach(function() {
      spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
      spyOn(atom.workspace, 'getActivePaneItem').andReturn(currentPane);
      return spyOn(git, 'cmd').andReturn(Promise.resolve(repo.relativize(pathToRepoFile)));
    });
    describe("when the file has been modified and user confirms", function() {
      beforeEach(function() {
        spyOn(window, 'confirm').andReturn(true);
        return spyOn(repo, 'isPathModified').andReturn(true);
      });
      describe("when there is a current file open", function() {
        return it("calls git.cmd with 'rm' and " + pathToRepoFile, function() {
          var args, ref1;
          GitRemove(repo);
          args = git.cmd.mostRecentCall.args[0];
          expect(indexOf.call(args, 'rm') >= 0).toBe(true);
          return expect((ref1 = repo.relativize(pathToRepoFile), indexOf.call(args, ref1) >= 0)).toBe(true);
        });
      });
      return describe("when 'showSelector' is set to true", function() {
        return it("calls git.cmd with '*' instead of " + pathToRepoFile, function() {
          var args;
          GitRemove(repo, {
            showSelector: true
          });
          args = git.cmd.mostRecentCall.args[0];
          return expect(indexOf.call(args, '*') >= 0).toBe(true);
        });
      });
    });
    return describe("when the file has not been modified and user doesn't need to confirm", function() {
      beforeEach(function() {
        spyOn(window, 'confirm').andReturn(false);
        return spyOn(repo, 'isPathModified').andReturn(false);
      });
      describe("when there is a current file open", function() {
        return it("calls git.cmd with 'rm' and " + pathToRepoFile, function() {
          var args, ref1;
          GitRemove(repo);
          args = git.cmd.mostRecentCall.args[0];
          expect(indexOf.call(args, 'rm') >= 0).toBe(true);
          expect((ref1 = repo.relativize(pathToRepoFile), indexOf.call(args, ref1) >= 0)).toBe(true);
          return expect(window.confirm).not.toHaveBeenCalled();
        });
      });
      return describe("when 'showSelector' is set to true", function() {
        return it("calls git.cmd with '*' instead of " + pathToRepoFile, function() {
          var args;
          GitRemove(repo, {
            showSelector: true
          });
          args = git.cmd.mostRecentCall.args[0];
          return expect(indexOf.call(args, '*') >= 0).toBe(true);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1yZW1vdmUtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGtFQUFBO0lBQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNOLE1BQWtELE9BQUEsQ0FBUSxhQUFSLENBQWxELEVBQUMsZUFBRCxFQUFPLG1DQUFQLEVBQXVCLDJCQUF2QixFQUFtQzs7RUFDbkMsU0FBQSxHQUFZLE9BQUEsQ0FBUSw2QkFBUjs7RUFFWixRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBO0lBQ3BCLFVBQUEsQ0FBVyxTQUFBO01BQ1QsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLHFCQUF0QixDQUE0QyxDQUFDLFNBQTdDLENBQXVELFVBQXZEO01BQ0EsS0FBQSxDQUFNLElBQUksQ0FBQyxTQUFYLEVBQXNCLG1CQUF0QixDQUEwQyxDQUFDLFNBQTNDLENBQXFELFdBQXJEO2FBQ0EsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsY0FBaEIsQ0FBaEIsQ0FBNUI7SUFIUyxDQUFYO0lBS0EsUUFBQSxDQUFTLG1EQUFULEVBQThELFNBQUE7TUFDNUQsVUFBQSxDQUFXLFNBQUE7UUFDVCxLQUFBLENBQU0sTUFBTixFQUFjLFNBQWQsQ0FBd0IsQ0FBQyxTQUF6QixDQUFtQyxJQUFuQztlQUNBLEtBQUEsQ0FBTSxJQUFOLEVBQVksZ0JBQVosQ0FBNkIsQ0FBQyxTQUE5QixDQUF3QyxJQUF4QztNQUZTLENBQVg7TUFJQSxRQUFBLENBQVMsbUNBQVQsRUFBOEMsU0FBQTtlQUM1QyxFQUFBLENBQUcsOEJBQUEsR0FBK0IsY0FBbEMsRUFBb0QsU0FBQTtBQUNsRCxjQUFBO1VBQUEsU0FBQSxDQUFVLElBQVY7VUFDQSxJQUFBLEdBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUE7VUFDbkMsTUFBQSxDQUFPLGFBQVEsSUFBUixFQUFBLElBQUEsTUFBUCxDQUFvQixDQUFDLElBQXJCLENBQTBCLElBQTFCO2lCQUNBLE1BQUEsQ0FBTyxRQUFBLElBQUksQ0FBQyxVQUFMLENBQWdCLGNBQWhCLENBQUEsRUFBQSxhQUFtQyxJQUFuQyxFQUFBLElBQUEsTUFBQSxDQUFQLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsSUFBckQ7UUFKa0QsQ0FBcEQ7TUFENEMsQ0FBOUM7YUFPQSxRQUFBLENBQVMsb0NBQVQsRUFBK0MsU0FBQTtlQUM3QyxFQUFBLENBQUcsb0NBQUEsR0FBcUMsY0FBeEMsRUFBMEQsU0FBQTtBQUN4RCxjQUFBO1VBQUEsU0FBQSxDQUFVLElBQVYsRUFBZ0I7WUFBQSxZQUFBLEVBQWMsSUFBZDtXQUFoQjtVQUNBLElBQUEsR0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQTtpQkFDbkMsTUFBQSxDQUFPLGFBQU8sSUFBUCxFQUFBLEdBQUEsTUFBUCxDQUFtQixDQUFDLElBQXBCLENBQXlCLElBQXpCO1FBSHdELENBQTFEO01BRDZDLENBQS9DO0lBWjRELENBQTlEO1dBa0JBLFFBQUEsQ0FBUyxzRUFBVCxFQUFpRixTQUFBO01BQy9FLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsS0FBQSxDQUFNLE1BQU4sRUFBYyxTQUFkLENBQXdCLENBQUMsU0FBekIsQ0FBbUMsS0FBbkM7ZUFDQSxLQUFBLENBQU0sSUFBTixFQUFZLGdCQUFaLENBQTZCLENBQUMsU0FBOUIsQ0FBd0MsS0FBeEM7TUFGUyxDQUFYO01BSUEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUE7ZUFDNUMsRUFBQSxDQUFHLDhCQUFBLEdBQStCLGNBQWxDLEVBQW9ELFNBQUE7QUFDbEQsY0FBQTtVQUFBLFNBQUEsQ0FBVSxJQUFWO1VBQ0EsSUFBQSxHQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBO1VBQ25DLE1BQUEsQ0FBTyxhQUFRLElBQVIsRUFBQSxJQUFBLE1BQVAsQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixJQUExQjtVQUNBLE1BQUEsQ0FBTyxRQUFBLElBQUksQ0FBQyxVQUFMLENBQWdCLGNBQWhCLENBQUEsRUFBQSxhQUFtQyxJQUFuQyxFQUFBLElBQUEsTUFBQSxDQUFQLENBQStDLENBQUMsSUFBaEQsQ0FBcUQsSUFBckQ7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFkLENBQXNCLENBQUMsR0FBRyxDQUFDLGdCQUEzQixDQUFBO1FBTGtELENBQXBEO01BRDRDLENBQTlDO2FBUUEsUUFBQSxDQUFTLG9DQUFULEVBQStDLFNBQUE7ZUFDN0MsRUFBQSxDQUFHLG9DQUFBLEdBQXFDLGNBQXhDLEVBQTBELFNBQUE7QUFDeEQsY0FBQTtVQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO1lBQUEsWUFBQSxFQUFjLElBQWQ7V0FBaEI7VUFDQSxJQUFBLEdBQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSyxDQUFBLENBQUE7aUJBQ25DLE1BQUEsQ0FBTyxhQUFPLElBQVAsRUFBQSxHQUFBLE1BQVAsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixJQUF6QjtRQUh3RCxDQUExRDtNQUQ2QyxDQUEvQztJQWIrRSxDQUFqRjtFQXhCb0IsQ0FBdEI7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG57cmVwbywgcGF0aFRvUmVwb0ZpbGUsIHRleHRFZGl0b3IsIGN1cnJlbnRQYW5lfSA9IHJlcXVpcmUgJy4uL2ZpeHR1cmVzJ1xuR2l0UmVtb3ZlID0gcmVxdWlyZSAnLi4vLi4vbGliL21vZGVscy9naXQtcmVtb3ZlJ1xuXG5kZXNjcmliZSBcIkdpdFJlbW92ZVwiLCAtPlxuICBiZWZvcmVFYWNoIC0+XG4gICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdnZXRBY3RpdmVUZXh0RWRpdG9yJykuYW5kUmV0dXJuIHRleHRFZGl0b3JcbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ2dldEFjdGl2ZVBhbmVJdGVtJykuYW5kUmV0dXJuIGN1cnJlbnRQYW5lXG4gICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSByZXBvLnJlbGF0aXZpemUocGF0aFRvUmVwb0ZpbGUpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBmaWxlIGhhcyBiZWVuIG1vZGlmaWVkIGFuZCB1c2VyIGNvbmZpcm1zXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24od2luZG93LCAnY29uZmlybScpLmFuZFJldHVybiB0cnVlXG4gICAgICBzcHlPbihyZXBvLCAnaXNQYXRoTW9kaWZpZWQnKS5hbmRSZXR1cm4gdHJ1ZVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRoZXJlIGlzIGEgY3VycmVudCBmaWxlIG9wZW5cIiwgLT5cbiAgICAgIGl0IFwiY2FsbHMgZ2l0LmNtZCB3aXRoICdybScgYW5kICN7cGF0aFRvUmVwb0ZpbGV9XCIsIC0+XG4gICAgICAgIEdpdFJlbW92ZSByZXBvXG4gICAgICAgIGFyZ3MgPSBnaXQuY21kLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF1cbiAgICAgICAgZXhwZWN0KCdybScgaW4gYXJncykudG9CZSB0cnVlXG4gICAgICAgIGV4cGVjdChyZXBvLnJlbGF0aXZpemUocGF0aFRvUmVwb0ZpbGUpIGluIGFyZ3MpLnRvQmUgdHJ1ZVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuICdzaG93U2VsZWN0b3InIGlzIHNldCB0byB0cnVlXCIsIC0+XG4gICAgICBpdCBcImNhbGxzIGdpdC5jbWQgd2l0aCAnKicgaW5zdGVhZCBvZiAje3BhdGhUb1JlcG9GaWxlfVwiLCAtPlxuICAgICAgICBHaXRSZW1vdmUgcmVwbywgc2hvd1NlbGVjdG9yOiB0cnVlXG4gICAgICAgIGFyZ3MgPSBnaXQuY21kLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF1cbiAgICAgICAgZXhwZWN0KCcqJyBpbiBhcmdzKS50b0JlIHRydWVcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIGZpbGUgaGFzIG5vdCBiZWVuIG1vZGlmaWVkIGFuZCB1c2VyIGRvZXNuJ3QgbmVlZCB0byBjb25maXJtXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24od2luZG93LCAnY29uZmlybScpLmFuZFJldHVybiBmYWxzZVxuICAgICAgc3B5T24ocmVwbywgJ2lzUGF0aE1vZGlmaWVkJykuYW5kUmV0dXJuIGZhbHNlXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGhlcmUgaXMgYSBjdXJyZW50IGZpbGUgb3BlblwiLCAtPlxuICAgICAgaXQgXCJjYWxscyBnaXQuY21kIHdpdGggJ3JtJyBhbmQgI3twYXRoVG9SZXBvRmlsZX1cIiwgLT5cbiAgICAgICAgR2l0UmVtb3ZlIHJlcG9cbiAgICAgICAgYXJncyA9IGdpdC5jbWQubW9zdFJlY2VudENhbGwuYXJnc1swXVxuICAgICAgICBleHBlY3QoJ3JtJyBpbiBhcmdzKS50b0JlIHRydWVcbiAgICAgICAgZXhwZWN0KHJlcG8ucmVsYXRpdml6ZShwYXRoVG9SZXBvRmlsZSkgaW4gYXJncykudG9CZSB0cnVlXG4gICAgICAgIGV4cGVjdCh3aW5kb3cuY29uZmlybSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuICdzaG93U2VsZWN0b3InIGlzIHNldCB0byB0cnVlXCIsIC0+XG4gICAgICBpdCBcImNhbGxzIGdpdC5jbWQgd2l0aCAnKicgaW5zdGVhZCBvZiAje3BhdGhUb1JlcG9GaWxlfVwiLCAtPlxuICAgICAgICBHaXRSZW1vdmUgcmVwbywgc2hvd1NlbGVjdG9yOiB0cnVlXG4gICAgICAgIGFyZ3MgPSBnaXQuY21kLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF1cbiAgICAgICAgZXhwZWN0KCcqJyBpbiBhcmdzKS50b0JlIHRydWVcbiJdfQ==
