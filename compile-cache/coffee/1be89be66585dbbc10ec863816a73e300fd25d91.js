(function() {
  var GitRepository, Path, commentChar, commitFilePath, file, fs, git, notifier, os, quibble, repo, workingDirectory;

  os = require('os');

  Path = require('path');

  quibble = require('quibble');

  fs = require('fs-plus');

  GitRepository = require('atom').GitRepository;

  git = require('../../lib/git');

  notifier = require('../../lib/notifier');

  commentChar = '%';

  workingDirectory = Path.join(os.homedir(), 'fixture-repo');

  commitFilePath = Path.join(workingDirectory, '/.git/COMMIT_EDITMSG');

  file = Path.join(workingDirectory, 'fake.file');

  repo = null;

  describe("GitCommit", function() {
    var GitCommit, GitPush;
    GitPush = quibble('../../lib/models/git-push', jasmine.createSpy('GitPush'));
    GitCommit = require('../../lib/models/git-commit');
    beforeEach(function() {
      fs.writeFileSync(file, 'foobar');
      waitsForPromise(function() {
        return git.cmd(['init'], {
          cwd: workingDirectory
        });
      });
      waitsForPromise(function() {
        return git.cmd(['config', 'user.useconfigonly', 'false'], {
          cwd: workingDirectory
        });
      });
      waitsForPromise(function() {
        return git.cmd(['config', 'core.commentchar', commentChar], {
          cwd: workingDirectory
        });
      });
      waitsForPromise(function() {
        return git.cmd(['add', file], {
          cwd: workingDirectory
        });
      });
      waitsForPromise(function() {
        return git.cmd(['commit', '--allow-empty', '--allow-empty-message', '-m', ''], {
          cwd: workingDirectory
        });
      });
      waitsForPromise(function() {
        return git.cmd(['tag', '-a', '-m', '', 'ROOT'], {
          cwd: workingDirectory
        });
      });
      return runs(function() {
        return repo = GitRepository.open(workingDirectory);
      });
    });
    afterEach(function() {
      fs.removeSync(workingDirectory);
      return repo.destroy();
    });
    describe("a regular commit", function() {
      beforeEach(function() {
        fs.writeFileSync(file, Math.random());
        waitsForPromise(function() {
          return git.cmd(['add', file], {
            cwd: workingDirectory
          });
        });
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      it("uses the commentchar from git configs", function() {
        var editor;
        editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
        return expect(editor.getText().trim()[0]).toBe(commentChar);
      });
      it("gets staged files", function() {
        var editor;
        editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
        return expect(editor.getText()).toContain('modified:   fake.file');
      });
      it("makes a commit when the commit file is saved and closes the textEditor", function() {
        var editor, log;
        spyOn(notifier, 'addSuccess');
        editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
        spyOn(editor, 'destroy').andCallThrough();
        editor.setText('this is a commit');
        editor.save();
        log = null;
        waitsFor(function() {
          return editor.destroy.callCount > 0;
        });
        waitsForPromise(function() {
          return log = git.cmd(['whatchanged', '-1'], {
            cwd: workingDirectory
          });
        });
        return runs(function() {
          expect(notifier.addSuccess).toHaveBeenCalled();
          return log.then(function(l) {
            return expect(l).toContain('this is a commit');
          });
        });
      });
      return it("cancels the commit on textEditor destroy", function() {
        var editor;
        editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
        return editor.destroy();
      });
    });
    describe("when commit.template config is set", function() {
      it("pre-populates the commit with the template message", function() {
        var templateFile;
        templateFile = Path.join(os.tmpdir(), 'commit-template');
        fs.writeFileSync(templateFile, 'foobar');
        waitsForPromise(function() {
          return git.cmd(['config', 'commit.template', templateFile], {
            cwd: workingDirectory
          });
        });
        fs.writeFileSync(file, Math.random());
        waitsForPromise(function() {
          return git.cmd(['add', file], {
            cwd: workingDirectory
          });
        });
        waitsForPromise(function() {
          return GitCommit(repo);
        });
        return runs(function() {
          var editor;
          editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
          expect(editor.getText().startsWith('foobar')).toBe(true);
          git.cmd(['config', '--unset', 'commit.template'], {
            cwd: workingDirectory
          });
          return fs.removeSync(templateFile);
        });
      });
      return describe("when the template file can't be found", function() {
        return it("notifies user", function() {
          var templateFile;
          spyOn(notifier, 'addError');
          templateFile = Path.join(os.tmpdir(), 'commit-template');
          waitsForPromise(function() {
            return git.cmd(['config', 'commit.template', templateFile], {
              cwd: workingDirectory
            });
          });
          fs.writeFileSync(file, Math.random());
          waitsForPromise(function() {
            return git.cmd(['add', file], {
              cwd: workingDirectory
            });
          });
          waitsForPromise(function() {
            return GitCommit(repo)["catch"](function() {
              return Promise.resolve();
            });
          });
          return runs(function() {
            return expect(notifier.addError).toHaveBeenCalledWith("Your configured commit template file can't be found.");
          });
        });
      });
    });
    describe("when 'stageChanges' option is true", function() {
      beforeEach(function() {
        fs.writeFileSync(file, Math.random());
        return waitsForPromise(function() {
          return GitCommit(repo, {
            stageChanges: true
          });
        });
      });
      return it("stages modified and tracked files", function() {
        var editor;
        editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
        return expect(editor.getText()).toContain('modified:   fake.file');
      });
    });
    describe("a failing commit", function() {
      beforeEach(function() {
        fs.writeFileSync(file, Math.random());
        waitsForPromise(function() {
          return git.cmd(['add', file], {
            cwd: workingDirectory
          });
        });
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      return it("notifies of error and closes commit pane", function() {
        var editor;
        editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
        spyOn(editor, 'destroy').andCallThrough();
        spyOn(notifier, 'addError');
        spyOn(git, 'cmd').andReturn(Promise.reject());
        editor.save();
        waitsFor(function() {
          return notifier.addError.callCount > 0;
        });
        return runs(function() {
          expect(notifier.addError).toHaveBeenCalled();
          return expect(editor.destroy).toHaveBeenCalled();
        });
      });
    });
    describe("when the verbose commit setting is true", function() {
      beforeEach(function() {
        atom.config.set("git-plus.commits.verboseCommits", true);
        fs.writeFileSync(file, Math.random());
        waitsForPromise(function() {
          return git.cmd(['add', file], {
            cwd: workingDirectory
          });
        });
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      return it("puts the diff in the commit file", function() {
        var editor;
        editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
        return waitsForPromise(function() {
          return git.cmd(['diff', '--color=never', '--staged'], {
            cwd: workingDirectory
          }).then(function(diff) {
            return expect(editor.getText()).toContain(diff);
          });
        });
      });
    });
    describe("when the `git-plus.general.openInPane` setting is true", function() {
      beforeEach(function() {
        atom.config.set('git-plus.general.openInPane', true);
        atom.config.set('git-plus.general.splitPane', 'Right');
        fs.writeFileSync(file, Math.random());
        waitsForPromise(function() {
          return git.cmd(['add', file], {
            cwd: workingDirectory
          });
        });
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      return it("closes the created pane on finish", function() {
        var pane;
        pane = atom.workspace.paneForURI(commitFilePath);
        spyOn(pane, 'destroy').andCallThrough();
        pane.itemForURI(commitFilePath).save();
        waitsFor(function() {
          return pane.destroy.callCount > 0;
        });
        return runs(function() {
          return expect(pane.destroy).toHaveBeenCalled();
        });
      });
    });
    return describe("when 'andPush' option is true", function() {
      beforeEach(function() {
        fs.writeFileSync(file, Math.random());
        waitsForPromise(function() {
          return git.cmd(['add', file], {
            cwd: workingDirectory
          });
        });
        return waitsForPromise(function() {
          return GitCommit(repo, {
            andPush: true
          });
        });
      });
      return it("tries to push after a successful commit", function() {
        var editor;
        editor = atom.workspace.paneForURI(commitFilePath).itemForURI(commitFilePath);
        spyOn(editor, 'destroy').andCallThrough();
        editor.setText('blah blah');
        editor.save();
        waitsFor(function() {
          return editor.destroy.callCount > 0;
        });
        return runs(function() {
          return expect(GitPush).toHaveBeenCalledWith(repo);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1jb21taXQtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSOztFQUNWLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDSixnQkFBaUIsT0FBQSxDQUFRLE1BQVI7O0VBQ2xCLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLG9CQUFSOztFQUVYLFdBQUEsR0FBYzs7RUFDZCxnQkFBQSxHQUFtQixJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxPQUFILENBQUEsQ0FBVixFQUF3QixjQUF4Qjs7RUFDbkIsY0FBQSxHQUFpQixJQUFJLENBQUMsSUFBTCxDQUFVLGdCQUFWLEVBQTRCLHNCQUE1Qjs7RUFDakIsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsZ0JBQVYsRUFBNEIsV0FBNUI7O0VBQ1AsSUFBQSxHQUFPOztFQUVQLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUE7QUFDcEIsUUFBQTtJQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsMkJBQVIsRUFBcUMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsU0FBbEIsQ0FBckM7SUFDVixTQUFBLEdBQVksT0FBQSxDQUFRLDZCQUFSO0lBQ1osVUFBQSxDQUFXLFNBQUE7TUFDVCxFQUFFLENBQUMsYUFBSCxDQUFpQixJQUFqQixFQUF1QixRQUF2QjtNQUNBLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxNQUFELENBQVIsRUFBa0I7VUFBQSxHQUFBLEVBQUssZ0JBQUw7U0FB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QWhCO01BSFMsQ0FBWDthQUtBLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBO0FBQzVDLFlBQUE7UUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFmLENBQTBCLGNBQTFCLENBQXlDLENBQUMsVUFBMUMsQ0FBcUQsY0FBckQ7UUFDVCxLQUFBLENBQU0sTUFBTixFQUFjLFNBQWQsQ0FBd0IsQ0FBQyxjQUF6QixDQUFBO1FBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxXQUFmO1FBQ0EsTUFBTSxDQUFDLElBQVAsQ0FBQTtRQUNBLFFBQUEsQ0FBUyxTQUFBO2lCQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBZixHQUEyQjtRQUE5QixDQUFUO2VBQ0EsSUFBQSxDQUFLLFNBQUE7aUJBQUcsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLG9CQUFoQixDQUFxQyxJQUFyQztRQUFILENBQUw7TUFONEMsQ0FBOUM7SUFOd0MsQ0FBMUM7RUFoSW9CLENBQXRCO0FBZEEiLCJzb3VyY2VzQ29udGVudCI6WyJvcyA9IHJlcXVpcmUgJ29zJ1xuUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5xdWliYmxlID0gcmVxdWlyZSAncXVpYmJsZSdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcbntHaXRSZXBvc2l0b3J5fSA9IHJlcXVpcmUgJ2F0b20nXG5naXQgPSByZXF1aXJlICcuLi8uLi9saWIvZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi8uLi9saWIvbm90aWZpZXInXG5cbmNvbW1lbnRDaGFyID0gJyUnXG53b3JraW5nRGlyZWN0b3J5ID0gUGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJ2ZpeHR1cmUtcmVwbycpXG5jb21taXRGaWxlUGF0aCA9IFBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5LCAnLy5naXQvQ09NTUlUX0VESVRNU0cnKVxuZmlsZSA9IFBhdGguam9pbih3b3JraW5nRGlyZWN0b3J5LCAnZmFrZS5maWxlJylcbnJlcG8gPSBudWxsXG5cbmRlc2NyaWJlIFwiR2l0Q29tbWl0XCIsIC0+XG4gIEdpdFB1c2ggPSBxdWliYmxlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1wdXNoJywgamFzbWluZS5jcmVhdGVTcHkoJ0dpdFB1c2gnKVxuICBHaXRDb21taXQgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1jb21taXQnXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBmcy53cml0ZUZpbGVTeW5jIGZpbGUsICdmb29iYXInXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGdpdC5jbWQoWydpbml0J10sIGN3ZDogd29ya2luZ0RpcmVjdG9yeSlcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gZ2l0LmNtZChbJ2NvbmZpZycsICd1c2VyLnVzZWNvbmZpZ29ubHknLCAnZmFsc2UnXSwgY3dkOiB3b3JraW5nRGlyZWN0b3J5KVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBnaXQuY21kKFsnY29uZmlnJywgJ2NvcmUuY29tbWVudGNoYXInLCBjb21tZW50Q2hhcl0sIGN3ZDogd29ya2luZ0RpcmVjdG9yeSlcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gZ2l0LmNtZChbJ2FkZCcsIGZpbGVdLCBjd2Q6IHdvcmtpbmdEaXJlY3RvcnkpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGdpdC5jbWQoWydjb21taXQnLCAnLS1hbGxvdy1lbXB0eScsICctLWFsbG93LWVtcHR5LW1lc3NhZ2UnLCAnLW0nLCAnJ10sIGN3ZDogd29ya2luZ0RpcmVjdG9yeSlcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gZ2l0LmNtZChbJ3RhZycsICctYScsICctbScsICcnLCAnUk9PVCddLCBjd2Q6IHdvcmtpbmdEaXJlY3RvcnkpXG4gICAgcnVucyAtPiByZXBvID0gR2l0UmVwb3NpdG9yeS5vcGVuKHdvcmtpbmdEaXJlY3RvcnkpXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgZnMucmVtb3ZlU3luYyB3b3JraW5nRGlyZWN0b3J5XG4gICAgcmVwby5kZXN0cm95KClcblxuICBkZXNjcmliZSBcImEgcmVndWxhciBjb21taXRcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBmcy53cml0ZUZpbGVTeW5jIGZpbGUsIE1hdGgucmFuZG9tKClcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBnaXQuY21kKFsnYWRkJywgZmlsZV0sIGN3ZDogd29ya2luZ0RpcmVjdG9yeSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBHaXRDb21taXQocmVwbylcblxuICAgIGl0IFwidXNlcyB0aGUgY29tbWVudGNoYXIgZnJvbSBnaXQgY29uZmlnc1wiLCAtPlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShjb21taXRGaWxlUGF0aCkuaXRlbUZvclVSSShjb21taXRGaWxlUGF0aClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKVswXSkudG9CZSBjb21tZW50Q2hhclxuXG4gICAgaXQgXCJnZXRzIHN0YWdlZCBmaWxlc1wiLCAtPlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShjb21taXRGaWxlUGF0aCkuaXRlbUZvclVSSShjb21taXRGaWxlUGF0aClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0NvbnRhaW4gJ21vZGlmaWVkOiAgIGZha2UuZmlsZSdcblxuICAgIGl0IFwibWFrZXMgYSBjb21taXQgd2hlbiB0aGUgY29tbWl0IGZpbGUgaXMgc2F2ZWQgYW5kIGNsb3NlcyB0aGUgdGV4dEVkaXRvclwiLCAtPlxuICAgICAgc3B5T24obm90aWZpZXIsICdhZGRTdWNjZXNzJylcbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoY29tbWl0RmlsZVBhdGgpLml0ZW1Gb3JVUkkoY29tbWl0RmlsZVBhdGgpXG4gICAgICBzcHlPbihlZGl0b3IsICdkZXN0cm95JykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgZWRpdG9yLnNldFRleHQgJ3RoaXMgaXMgYSBjb21taXQnXG4gICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICBsb2cgPSBudWxsXG4gICAgICB3YWl0c0ZvciAtPiBlZGl0b3IuZGVzdHJveS5jYWxsQ291bnQgPiAwXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gbG9nID0gZ2l0LmNtZChbJ3doYXRjaGFuZ2VkJywgJy0xJ10sIGN3ZDogd29ya2luZ0RpcmVjdG9yeSlcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KG5vdGlmaWVyLmFkZFN1Y2Nlc3MpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBsb2cudGhlbiAobCkgLT4gZXhwZWN0KGwpLnRvQ29udGFpbiAndGhpcyBpcyBhIGNvbW1pdCdcblxuICAgIGl0IFwiY2FuY2VscyB0aGUgY29tbWl0IG9uIHRleHRFZGl0b3IgZGVzdHJveVwiLCAtPlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShjb21taXRGaWxlUGF0aCkuaXRlbUZvclVSSShjb21taXRGaWxlUGF0aClcbiAgICAgIGVkaXRvci5kZXN0cm95KClcblxuICBkZXNjcmliZSBcIndoZW4gY29tbWl0LnRlbXBsYXRlIGNvbmZpZyBpcyBzZXRcIiwgLT5cbiAgICBpdCBcInByZS1wb3B1bGF0ZXMgdGhlIGNvbW1pdCB3aXRoIHRoZSB0ZW1wbGF0ZSBtZXNzYWdlXCIsIC0+XG4gICAgICB0ZW1wbGF0ZUZpbGUgPSBQYXRoLmpvaW4ob3MudG1wZGlyKCksICdjb21taXQtdGVtcGxhdGUnKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyB0ZW1wbGF0ZUZpbGUsICdmb29iYXInXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gZ2l0LmNtZChbJ2NvbmZpZycsICdjb21taXQudGVtcGxhdGUnLCB0ZW1wbGF0ZUZpbGVdLCBjd2Q6IHdvcmtpbmdEaXJlY3RvcnkpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jIGZpbGUsIE1hdGgucmFuZG9tKClcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBnaXQuY21kKFsnYWRkJywgZmlsZV0sIGN3ZDogd29ya2luZ0RpcmVjdG9yeSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBHaXRDb21taXQocmVwbylcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShjb21taXRGaWxlUGF0aCkuaXRlbUZvclVSSShjb21taXRGaWxlUGF0aClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkuc3RhcnRzV2l0aCgnZm9vYmFyJykpLnRvQmUgdHJ1ZVxuICAgICAgICBnaXQuY21kKFsnY29uZmlnJywgJy0tdW5zZXQnLCAnY29tbWl0LnRlbXBsYXRlJ10sIGN3ZDogd29ya2luZ0RpcmVjdG9yeSlcbiAgICAgICAgZnMucmVtb3ZlU3luYyh0ZW1wbGF0ZUZpbGUpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGhlIHRlbXBsYXRlIGZpbGUgY2FuJ3QgYmUgZm91bmRcIiwgLT5cbiAgICAgIGl0IFwibm90aWZpZXMgdXNlclwiLCAtPlxuICAgICAgICBzcHlPbihub3RpZmllciwgJ2FkZEVycm9yJylcbiAgICAgICAgdGVtcGxhdGVGaWxlID0gUGF0aC5qb2luKG9zLnRtcGRpcigpLCAnY29tbWl0LXRlbXBsYXRlJylcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGdpdC5jbWQoWydjb25maWcnLCAnY29tbWl0LnRlbXBsYXRlJywgdGVtcGxhdGVGaWxlXSwgY3dkOiB3b3JraW5nRGlyZWN0b3J5KVxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jIGZpbGUsIE1hdGgucmFuZG9tKClcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGdpdC5jbWQoWydhZGQnLCBmaWxlXSwgY3dkOiB3b3JraW5nRGlyZWN0b3J5KVxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0Q29tbWl0KHJlcG8pLmNhdGNoIC0+IFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3Qobm90aWZpZXIuYWRkRXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFwiWW91ciBjb25maWd1cmVkIGNvbW1pdCB0ZW1wbGF0ZSBmaWxlIGNhbid0IGJlIGZvdW5kLlwiXG5cbiAgZGVzY3JpYmUgXCJ3aGVuICdzdGFnZUNoYW5nZXMnIG9wdGlvbiBpcyB0cnVlXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZnMud3JpdGVGaWxlU3luYyBmaWxlLCBNYXRoLnJhbmRvbSgpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0Q29tbWl0KHJlcG8sIHN0YWdlQ2hhbmdlczogdHJ1ZSlcblxuICAgIGl0IFwic3RhZ2VzIG1vZGlmaWVkIGFuZCB0cmFja2VkIGZpbGVzXCIsIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGNvbW1pdEZpbGVQYXRoKS5pdGVtRm9yVVJJKGNvbW1pdEZpbGVQYXRoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQ29udGFpbiAnbW9kaWZpZWQ6ICAgZmFrZS5maWxlJ1xuXG4gIGRlc2NyaWJlIFwiYSBmYWlsaW5nIGNvbW1pdFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMgZmlsZSwgTWF0aC5yYW5kb20oKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGdpdC5jbWQoWydhZGQnLCBmaWxlXSwgY3dkOiB3b3JraW5nRGlyZWN0b3J5KVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdENvbW1pdChyZXBvKVxuXG4gICAgaXQgXCJub3RpZmllcyBvZiBlcnJvciBhbmQgY2xvc2VzIGNvbW1pdCBwYW5lXCIsIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGNvbW1pdEZpbGVQYXRoKS5pdGVtRm9yVVJJKGNvbW1pdEZpbGVQYXRoKVxuICAgICAgc3B5T24oZWRpdG9yLCAnZGVzdHJveScpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIHNweU9uKG5vdGlmaWVyLCAnYWRkRXJyb3InKVxuICAgICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVqZWN0KClcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIHdhaXRzRm9yIC0+IG5vdGlmaWVyLmFkZEVycm9yLmNhbGxDb3VudCA+IDBcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KG5vdGlmaWVyLmFkZEVycm9yKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5kZXN0cm95KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIHZlcmJvc2UgY29tbWl0IHNldHRpbmcgaXMgdHJ1ZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCBcImdpdC1wbHVzLmNvbW1pdHMudmVyYm9zZUNvbW1pdHNcIiwgdHJ1ZVxuICAgICAgZnMud3JpdGVGaWxlU3luYyBmaWxlLCBNYXRoLnJhbmRvbSgpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gZ2l0LmNtZChbJ2FkZCcsIGZpbGVdLCBjd2Q6IHdvcmtpbmdEaXJlY3RvcnkpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0Q29tbWl0KHJlcG8pXG5cbiAgICBpdCBcInB1dHMgdGhlIGRpZmYgaW4gdGhlIGNvbW1pdCBmaWxlXCIsIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGNvbW1pdEZpbGVQYXRoKS5pdGVtRm9yVVJJKGNvbW1pdEZpbGVQYXRoKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGdpdC5jbWQoWydkaWZmJywgJy0tY29sb3I9bmV2ZXInLCAnLS1zdGFnZWQnXSwgY3dkOiB3b3JraW5nRGlyZWN0b3J5KVxuICAgICAgICAudGhlbiAoZGlmZikgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9Db250YWluIGRpZmZcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIGBnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmVgIHNldHRpbmcgaXMgdHJ1ZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCAnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJywgdHJ1ZVxuICAgICAgYXRvbS5jb25maWcuc2V0ICdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScsICdSaWdodCdcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMgZmlsZSwgTWF0aC5yYW5kb20oKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGdpdC5jbWQoWydhZGQnLCBmaWxlXSwgY3dkOiB3b3JraW5nRGlyZWN0b3J5KVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdENvbW1pdChyZXBvKVxuXG4gICAgaXQgXCJjbG9zZXMgdGhlIGNyZWF0ZWQgcGFuZSBvbiBmaW5pc2hcIiwgLT5cbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGNvbW1pdEZpbGVQYXRoKVxuICAgICAgc3B5T24ocGFuZSwgJ2Rlc3Ryb3knKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICBwYW5lLml0ZW1Gb3JVUkkoY29tbWl0RmlsZVBhdGgpLnNhdmUoKVxuICAgICAgd2FpdHNGb3IgLT4gcGFuZS5kZXN0cm95LmNhbGxDb3VudCA+IDBcbiAgICAgIHJ1bnMgLT4gZXhwZWN0KHBhbmUuZGVzdHJveSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuICdhbmRQdXNoJyBvcHRpb24gaXMgdHJ1ZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMgZmlsZSwgTWF0aC5yYW5kb20oKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGdpdC5jbWQoWydhZGQnLCBmaWxlXSwgY3dkOiB3b3JraW5nRGlyZWN0b3J5KVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IEdpdENvbW1pdChyZXBvLCBhbmRQdXNoOiB0cnVlKVxuXG4gICAgaXQgXCJ0cmllcyB0byBwdXNoIGFmdGVyIGEgc3VjY2Vzc2Z1bCBjb21taXRcIiwgLT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoY29tbWl0RmlsZVBhdGgpLml0ZW1Gb3JVUkkoY29tbWl0RmlsZVBhdGgpXG4gICAgICBzcHlPbihlZGl0b3IsICdkZXN0cm95JykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgZWRpdG9yLnNldFRleHQgJ2JsYWggYmxhaCdcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIHdhaXRzRm9yIC0+IGVkaXRvci5kZXN0cm95LmNhbGxDb3VudCA+IDBcbiAgICAgIHJ1bnMgLT4gZXhwZWN0KEdpdFB1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIHJlcG9cbiJdfQ==
