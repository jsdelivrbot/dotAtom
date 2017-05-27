(function() {
  var StatusListView, fs, git, repo,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs-plus');

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  StatusListView = require('../../lib/views/status-list-view');

  describe("StatusListView", function() {
    describe("when there are modified files", function() {
      it("displays a list of modified files", function() {
        var view;
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        return expect(view.items.length).toBe(2);
      });
      return it("calls git.cmd with 'diff' when user doesn't want to open the file", function() {
        var view;
        spyOn(window, 'confirm').andReturn(false);
        spyOn(git, 'cmd').andReturn(Promise.resolve('foobar'));
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return false;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(indexOf.call(git.cmd.mostRecentCall.args[0], 'diff') >= 0).toBe(true);
      });
    });
    return describe("when there are unstaged files", function() {
      beforeEach(function() {
        return spyOn(window, 'confirm').andReturn(true);
      });
      it("opens the file when it is a file", function() {
        var view;
        spyOn(atom.workspace, 'open');
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return false;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
      return it("opens the directory in a project when it is a directory", function() {
        var view;
        spyOn(atom, 'open');
        spyOn(fs, 'stat').andCallFake(function() {
          var stat;
          stat = {
            isDirectory: function() {
              return true;
            }
          };
          return fs.stat.mostRecentCall.args[1](null, stat);
        });
        view = new StatusListView(repo, [" M\tfile.txt", " D\tanother.txt", '']);
        view.confirmSelection();
        return expect(atom.open).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3Mvc3RhdHVzLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkJBQUE7SUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNMLE9BQVEsT0FBQSxDQUFRLGFBQVI7O0VBQ1QsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVI7O0VBRWpCLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO0lBQ3pCLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBO01BQ3hDLEVBQUEsQ0FBRyxtQ0FBSCxFQUF3QyxTQUFBO0FBQ3RDLFlBQUE7UUFBQSxJQUFBLEdBQVcsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixDQUFDLGNBQUQsRUFBaUIsaUJBQWpCLEVBQW9DLEVBQXBDLENBQXJCO2VBQ1gsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUEvQjtNQUZzQyxDQUF4QzthQUlBLEVBQUEsQ0FBRyxtRUFBSCxFQUF3RSxTQUFBO0FBQ3RFLFlBQUE7UUFBQSxLQUFBLENBQU0sTUFBTixFQUFjLFNBQWQsQ0FBd0IsQ0FBQyxTQUF6QixDQUFtQyxLQUFuQztRQUNBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFFBQWhCLENBQTVCO1FBQ0EsS0FBQSxDQUFNLEVBQU4sRUFBVSxNQUFWLENBQWlCLENBQUMsV0FBbEIsQ0FBOEIsU0FBQTtBQUM1QixjQUFBO1VBQUEsSUFBQSxHQUFPO1lBQUEsV0FBQSxFQUFhLFNBQUE7cUJBQUc7WUFBSCxDQUFiOztpQkFDUCxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUE1QixDQUErQixJQUEvQixFQUFxQyxJQUFyQztRQUY0QixDQUE5QjtRQUdBLElBQUEsR0FBVyxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLENBQUMsY0FBRCxFQUFpQixpQkFBakIsRUFBb0MsRUFBcEMsQ0FBckI7UUFDWCxJQUFJLENBQUMsZ0JBQUwsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxhQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQXRDLEVBQUEsTUFBQSxNQUFQLENBQWdELENBQUMsSUFBakQsQ0FBc0QsSUFBdEQ7TUFSc0UsQ0FBeEU7SUFMd0MsQ0FBMUM7V0FlQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQTtNQUN4QyxVQUFBLENBQVcsU0FBQTtlQUNULEtBQUEsQ0FBTSxNQUFOLEVBQWMsU0FBZCxDQUF3QixDQUFDLFNBQXpCLENBQW1DLElBQW5DO01BRFMsQ0FBWDtNQUdBLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO0FBQ3JDLFlBQUE7UUFBQSxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsTUFBdEI7UUFDQSxLQUFBLENBQU0sRUFBTixFQUFVLE1BQVYsQ0FBaUIsQ0FBQyxXQUFsQixDQUE4QixTQUFBO0FBQzVCLGNBQUE7VUFBQSxJQUFBLEdBQU87WUFBQSxXQUFBLEVBQWEsU0FBQTtxQkFBRztZQUFILENBQWI7O2lCQUNQLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQTVCLENBQStCLElBQS9CLEVBQXFDLElBQXJDO1FBRjRCLENBQTlCO1FBR0EsSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsQ0FBQyxjQUFELEVBQWlCLGlCQUFqQixFQUFvQyxFQUFwQyxDQUFyQjtRQUNYLElBQUksQ0FBQyxnQkFBTCxDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxnQkFBNUIsQ0FBQTtNQVBxQyxDQUF2QzthQVNBLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBO0FBQzVELFlBQUE7UUFBQSxLQUFBLENBQU0sSUFBTixFQUFZLE1BQVo7UUFDQSxLQUFBLENBQU0sRUFBTixFQUFVLE1BQVYsQ0FBaUIsQ0FBQyxXQUFsQixDQUE4QixTQUFBO0FBQzVCLGNBQUE7VUFBQSxJQUFBLEdBQU87WUFBQSxXQUFBLEVBQWEsU0FBQTtxQkFBRztZQUFILENBQWI7O2lCQUNQLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUssQ0FBQSxDQUFBLENBQTVCLENBQStCLElBQS9CLEVBQXFDLElBQXJDO1FBRjRCLENBQTlCO1FBR0EsSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsQ0FBQyxjQUFELEVBQWlCLGlCQUFqQixFQUFvQyxFQUFwQyxDQUFyQjtRQUNYLElBQUksQ0FBQyxnQkFBTCxDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsZ0JBQWxCLENBQUE7TUFQNEQsQ0FBOUQ7SUFid0MsQ0FBMUM7RUFoQnlCLENBQTNCO0FBTEEiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5naXQgPSByZXF1aXJlICcuLi8uLi9saWIvZ2l0J1xue3JlcG99ID0gcmVxdWlyZSAnLi4vZml4dHVyZXMnXG5TdGF0dXNMaXN0VmlldyA9IHJlcXVpcmUgJy4uLy4uL2xpYi92aWV3cy9zdGF0dXMtbGlzdC12aWV3J1xuXG5kZXNjcmliZSBcIlN0YXR1c0xpc3RWaWV3XCIsIC0+XG4gIGRlc2NyaWJlIFwid2hlbiB0aGVyZSBhcmUgbW9kaWZpZWQgZmlsZXNcIiwgLT5cbiAgICBpdCBcImRpc3BsYXlzIGEgbGlzdCBvZiBtb2RpZmllZCBmaWxlc1wiLCAtPlxuICAgICAgdmlldyA9IG5ldyBTdGF0dXNMaXN0VmlldyhyZXBvLCBbXCIgTVxcdGZpbGUudHh0XCIsIFwiIERcXHRhbm90aGVyLnR4dFwiLCAnJ10pXG4gICAgICBleHBlY3Qodmlldy5pdGVtcy5sZW5ndGgpLnRvQmUgMlxuXG4gICAgaXQgXCJjYWxscyBnaXQuY21kIHdpdGggJ2RpZmYnIHdoZW4gdXNlciBkb2Vzbid0IHdhbnQgdG8gb3BlbiB0aGUgZmlsZVwiLCAtPlxuICAgICAgc3B5T24od2luZG93LCAnY29uZmlybScpLmFuZFJldHVybiBmYWxzZVxuICAgICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSAnZm9vYmFyJ1xuICAgICAgc3B5T24oZnMsICdzdGF0JykuYW5kQ2FsbEZha2UgLT5cbiAgICAgICAgc3RhdCA9IGlzRGlyZWN0b3J5OiAtPiBmYWxzZVxuICAgICAgICBmcy5zdGF0Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMV0obnVsbCwgc3RhdClcbiAgICAgIHZpZXcgPSBuZXcgU3RhdHVzTGlzdFZpZXcocmVwbywgW1wiIE1cXHRmaWxlLnR4dFwiLCBcIiBEXFx0YW5vdGhlci50eHRcIiwgJyddKVxuICAgICAgdmlldy5jb25maXJtU2VsZWN0aW9uKClcbiAgICAgIGV4cGVjdCgnZGlmZicgaW4gZ2l0LmNtZC5tb3N0UmVjZW50Q2FsbC5hcmdzWzBdKS50b0JlIHRydWVcblxuICBkZXNjcmliZSBcIndoZW4gdGhlcmUgYXJlIHVuc3RhZ2VkIGZpbGVzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24od2luZG93LCAnY29uZmlybScpLmFuZFJldHVybiB0cnVlXG5cbiAgICBpdCBcIm9wZW5zIHRoZSBmaWxlIHdoZW4gaXQgaXMgYSBmaWxlXCIsIC0+XG4gICAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ29wZW4nKVxuICAgICAgc3B5T24oZnMsICdzdGF0JykuYW5kQ2FsbEZha2UgLT5cbiAgICAgICAgc3RhdCA9IGlzRGlyZWN0b3J5OiAtPiBmYWxzZVxuICAgICAgICBmcy5zdGF0Lm1vc3RSZWNlbnRDYWxsLmFyZ3NbMV0obnVsbCwgc3RhdClcbiAgICAgIHZpZXcgPSBuZXcgU3RhdHVzTGlzdFZpZXcocmVwbywgW1wiIE1cXHRmaWxlLnR4dFwiLCBcIiBEXFx0YW5vdGhlci50eHRcIiwgJyddKVxuICAgICAgdmlldy5jb25maXJtU2VsZWN0aW9uKClcbiAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGl0IFwib3BlbnMgdGhlIGRpcmVjdG9yeSBpbiBhIHByb2plY3Qgd2hlbiBpdCBpcyBhIGRpcmVjdG9yeVwiLCAtPlxuICAgICAgc3B5T24oYXRvbSwgJ29wZW4nKVxuICAgICAgc3B5T24oZnMsICdzdGF0JykuYW5kQ2FsbEZha2UgLT5cbiAgICAgICAgc3RhdCA9IGlzRGlyZWN0b3J5OiAtPiB0cnVlXG4gICAgICAgIGZzLnN0YXQubW9zdFJlY2VudENhbGwuYXJnc1sxXShudWxsLCBzdGF0KVxuICAgICAgdmlldyA9IG5ldyBTdGF0dXNMaXN0VmlldyhyZXBvLCBbXCIgTVxcdGZpbGUudHh0XCIsIFwiIERcXHRhbm90aGVyLnR4dFwiLCAnJ10pXG4gICAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuICAgICAgZXhwZWN0KGF0b20ub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpXG4iXX0=
