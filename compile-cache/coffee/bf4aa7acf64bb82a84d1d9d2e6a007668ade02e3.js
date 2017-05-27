(function() {
  var BufferedProcess, GitOps, path;

  GitOps = require('../lib/git/shellout');

  BufferedProcess = require('atom').BufferedProcess;

  path = require('path');

  describe('GitBridge', function() {
    var context, gitWorkDir;
    gitWorkDir = "/fake/gitroot/";
    context = [][0];
    beforeEach(function() {
      atom.config.set('merge-conflicts.gitPath', '/usr/bin/git');
      return waitsForPromise(function() {
        return GitOps.getContext().then(function(c) {
          context = c;
          return context.workingDirPath = gitWorkDir;
        });
      });
    });
    it('checks git status for merge conflicts', function() {
      var a, c, conflicts, o, ref;
      ref = [], c = ref[0], a = ref[1], o = ref[2];
      context.mockProcess(function(arg) {
        var args, command, exit, options, ref1, stderr, stdout;
        command = arg.command, args = arg.args, options = arg.options, stdout = arg.stdout, stderr = arg.stderr, exit = arg.exit;
        ref1 = [command, args, options], c = ref1[0], a = ref1[1], o = ref1[2];
        stdout('UU lib/file0.rb');
        stdout('AA lib/file1.rb');
        stdout('M  lib/file2.rb');
        exit(0);
        return {
          process: {
            on: function(callback) {}
          }
        };
      });
      conflicts = [];
      waitsForPromise(function() {
        return context.readConflicts().then(function(cs) {
          return conflicts = cs;
        })["catch"](function(e) {
          throw e;
        });
      });
      return runs(function() {
        expect(conflicts).toEqual([
          {
            path: 'lib/file0.rb',
            message: 'both modified'
          }, {
            path: 'lib/file1.rb',
            message: 'both added'
          }
        ]);
        expect(c).toBe('/usr/bin/git');
        expect(a).toEqual(['status', '--porcelain']);
        return expect(o).toEqual({
          cwd: gitWorkDir
        });
      });
    });
    describe('isResolvedFile', function() {
      var statusMeansStaged;
      statusMeansStaged = function(status, checkPath) {
        if (checkPath == null) {
          checkPath = 'lib/file2.txt';
        }
        context.mockProcess(function(arg) {
          var exit, stdout;
          stdout = arg.stdout, exit = arg.exit;
          stdout(status + " lib/file2.txt");
          exit(0);
          return {
            process: {
              on: function(callback) {}
            }
          };
        });
        return context.isResolvedFile(checkPath);
      };
      it('is true if already resolved', function() {
        return waitsForPromise(function() {
          return statusMeansStaged('M ').then(function(s) {
            return expect(s).toBe(true);
          });
        });
      });
      it('is true if resolved as ours', function() {
        return waitsForPromise(function() {
          return statusMeansStaged(' M', 'lib/file1.txt').then(function(s) {
            return expect(s).toBe(true);
          });
        });
      });
      it('is false if still in conflict', function() {
        return waitsForPromise(function() {
          return statusMeansStaged('UU').then(function(s) {
            return expect(s).toBe(false);
          });
        });
      });
      return it('is false if resolved, but then modified', function() {
        return waitsForPromise(function() {
          return statusMeansStaged('MM').then(function(s) {
            return expect(s).toBe(false);
          });
        });
      });
    });
    it('checks out "our" version of a file from the index', function() {
      var a, c, called, o, ref;
      ref = [], c = ref[0], a = ref[1], o = ref[2];
      context.mockProcess(function(arg) {
        var args, command, exit, options, ref1;
        command = arg.command, args = arg.args, options = arg.options, exit = arg.exit;
        ref1 = [command, args, options], c = ref1[0], a = ref1[1], o = ref1[2];
        exit(0);
        return {
          process: {
            on: function(callback) {}
          }
        };
      });
      called = false;
      waitsForPromise(function() {
        return context.checkoutSide('ours', 'lib/file1.txt').then(function() {
          return called = true;
        });
      });
      return runs(function() {
        expect(called).toBe(true);
        expect(c).toBe('/usr/bin/git');
        expect(a).toEqual(['checkout', '--ours', 'lib/file1.txt']);
        return expect(o).toEqual({
          cwd: gitWorkDir
        });
      });
    });
    it('stages changes to a file', function() {
      var called, p;
      p = "";
      context.repository.repo.add = function(path) {
        return p = path;
      };
      called = false;
      waitsForPromise(function() {
        return context.resolveFile('lib/file1.txt').then(function() {
          return called = true;
        });
      });
      return runs(function() {
        expect(called).toBe(true);
        return expect(p).toBe('lib/file1.txt');
      });
    });
    return describe('rebase detection', function() {
      var withRoot;
      withRoot = function(gitDir, callback) {
        var fullDir, saved;
        fullDir = path.join(atom.project.getDirectories()[0].getPath(), gitDir);
        saved = context.repository.getPath;
        context.repository.getPath = function() {
          return fullDir;
        };
        callback();
        return context.repository.getPath = saved;
      };
      it('recognizes a non-interactive rebase', function() {
        return withRoot('rebasing.git', function() {
          return expect(context.isRebasing()).toBe(true);
        });
      });
      it('recognizes an interactive rebase', function() {
        return withRoot('irebasing.git', function() {
          return expect(context.isRebasing()).toBe(true);
        });
      });
      return it('returns false if not rebasing', function() {
        return withRoot('merging.git', function() {
          return expect(context.isRebasing()).toBe(false);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL2dpdC1zaGVsbG91dC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxxQkFBUjs7RUFDUixrQkFBbUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3BCLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBO0FBRXBCLFFBQUE7SUFBQSxVQUFBLEdBQWE7SUFFWixVQUFXO0lBRVosVUFBQSxDQUFXLFNBQUE7TUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLEVBQTJDLGNBQTNDO2FBRUEsZUFBQSxDQUFnQixTQUFBO2VBQ2QsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsQ0FBRDtVQUNKLE9BQUEsR0FBVTtpQkFDVixPQUFPLENBQUMsY0FBUixHQUF5QjtRQUZyQixDQUROO01BRGMsQ0FBaEI7SUFIUyxDQUFYO0lBU0EsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUE7QUFDMUMsVUFBQTtNQUFBLE1BQVksRUFBWixFQUFDLFVBQUQsRUFBSSxVQUFKLEVBQU87TUFDUCxPQUFPLENBQUMsV0FBUixDQUFvQixTQUFDLEdBQUQ7QUFDbEIsWUFBQTtRQURvQix1QkFBUyxpQkFBTSx1QkFBUyxxQkFBUSxxQkFBUTtRQUM1RCxPQUFZLENBQUMsT0FBRCxFQUFVLElBQVYsRUFBZ0IsT0FBaEIsQ0FBWixFQUFDLFdBQUQsRUFBSSxXQUFKLEVBQU87UUFDUCxNQUFBLENBQU8saUJBQVA7UUFDQSxNQUFBLENBQU8saUJBQVA7UUFDQSxNQUFBLENBQU8saUJBQVA7UUFDQSxJQUFBLENBQUssQ0FBTDtlQUNBO1VBQUUsT0FBQSxFQUFTO1lBQUUs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d0IsU0FBQTtpQkFDdEIsTUFBQSxDQUFPLE9BQU8sQ0FBQyxVQUFSLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1FBRHNCLENBQXhCO01BRGtDLENBQXBDO0lBakIyQixDQUE3QjtFQTdGb0IsQ0FBdEI7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbIkdpdE9wcyA9IHJlcXVpcmUgJy4uL2xpYi9naXQvc2hlbGxvdXQnXG57QnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuZGVzY3JpYmUgJ0dpdEJyaWRnZScsIC0+XG5cbiAgZ2l0V29ya0RpciA9IFwiL2Zha2UvZ2l0cm9vdC9cIlxuXG4gIFtjb250ZXh0XSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20uY29uZmlnLnNldCgnbWVyZ2UtY29uZmxpY3RzLmdpdFBhdGgnLCAnL3Vzci9iaW4vZ2l0JylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgR2l0T3BzLmdldENvbnRleHQoKVxuICAgICAgLnRoZW4gKGMpIC0+XG4gICAgICAgIGNvbnRleHQgPSBjXG4gICAgICAgIGNvbnRleHQud29ya2luZ0RpclBhdGggPSBnaXRXb3JrRGlyXG5cbiAgaXQgJ2NoZWNrcyBnaXQgc3RhdHVzIGZvciBtZXJnZSBjb25mbGljdHMnLCAtPlxuICAgIFtjLCBhLCBvXSA9IFtdXG4gICAgY29udGV4dC5tb2NrUHJvY2VzcyAoe2NvbW1hbmQsIGFyZ3MsIG9wdGlvbnMsIHN0ZG91dCwgc3RkZXJyLCBleGl0fSkgLT5cbiAgICAgIFtjLCBhLCBvXSA9IFtjb21tYW5kLCBhcmdzLCBvcHRpb25zXVxuICAgICAgc3Rkb3V0KCdVVSBsaWIvZmlsZTAucmInKVxuICAgICAgc3Rkb3V0KCdBQSBsaWIvZmlsZTEucmInKVxuICAgICAgc3Rkb3V0KCdNICBsaWIvZmlsZTIucmInKVxuICAgICAgZXhpdCgwKVxuICAgICAgeyBwcm9jZXNzOiB7IG9uOiAoY2FsbGJhY2spIC0+IH0gfVxuXG4gICAgY29uZmxpY3RzID0gW11cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGNvbnRleHQucmVhZENvbmZsaWN0cygpXG4gICAgICAudGhlbiAoY3MpIC0+XG4gICAgICAgIGNvbmZsaWN0cyA9IGNzXG4gICAgICAuY2F0Y2ggKGUpIC0+XG4gICAgICAgIHRocm93IGVcblxuICAgIHJ1bnMgLT5cbiAgICAgIGV4cGVjdChjb25mbGljdHMpLnRvRXF1YWwoW1xuICAgICAgICB7IHBhdGg6ICdsaWIvZmlsZTAucmInLCBtZXNzYWdlOiAnYm90aCBtb2RpZmllZCd9XG4gICAgICAgIHsgcGF0aDogJ2xpYi9maWxlMS5yYicsIG1lc3NhZ2U6ICdib3RoIGFkZGVkJ31cbiAgICAgIF0pXG4gICAgICBleHBlY3QoYykudG9CZSgnL3Vzci9iaW4vZ2l0JylcbiAgICAgIGV4cGVjdChhKS50b0VxdWFsKFsnc3RhdHVzJywgJy0tcG9yY2VsYWluJ10pXG4gICAgICBleHBlY3QobykudG9FcXVhbCh7IGN3ZDogZ2l0V29ya0RpciB9KVxuXG4gIGRlc2NyaWJlICdpc1Jlc29sdmVkRmlsZScsIC0+XG5cbiAgICBzdGF0dXNNZWFuc1N0YWdlZCA9IChzdGF0dXMsIGNoZWNrUGF0aCA9ICdsaWIvZmlsZTIudHh0JykgLT5cbiAgICAgIGNvbnRleHQubW9ja1Byb2Nlc3MgKHtzdGRvdXQsIGV4aXR9KSAtPlxuICAgICAgICBzdGRvdXQoXCIje3N0YXR1c30gbGliL2ZpbGUyLnR4dFwiKVxuICAgICAgICBleGl0KDApXG4gICAgICAgIHsgcHJvY2VzczogeyBvbjogKGNhbGxiYWNrKSAtPiB9IH1cblxuICAgICAgY29udGV4dC5pc1Jlc29sdmVkRmlsZShjaGVja1BhdGgpXG5cbiAgICBpdCAnaXMgdHJ1ZSBpZiBhbHJlYWR5IHJlc29sdmVkJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBzdGF0dXNNZWFuc1N0YWdlZCgnTSAnKS50aGVuIChzKSAtPiBleHBlY3QocykudG9CZSh0cnVlKVxuXG4gICAgaXQgJ2lzIHRydWUgaWYgcmVzb2x2ZWQgYXMgb3VycycsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gc3RhdHVzTWVhbnNTdGFnZWQoJyBNJywgJ2xpYi9maWxlMS50eHQnKS50aGVuIChzKSAtPiBleHBlY3QocykudG9CZSh0cnVlKVxuXG4gICAgaXQgJ2lzIGZhbHNlIGlmIHN0aWxsIGluIGNvbmZsaWN0JywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBzdGF0dXNNZWFuc1N0YWdlZCgnVVUnKS50aGVuIChzKSAtPiBleHBlY3QocykudG9CZShmYWxzZSlcblxuICAgIGl0ICdpcyBmYWxzZSBpZiByZXNvbHZlZCwgYnV0IHRoZW4gbW9kaWZpZWQnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IHN0YXR1c01lYW5zU3RhZ2VkKCdNTScpLnRoZW4gKHMpIC0+IGV4cGVjdChzKS50b0JlKGZhbHNlKVxuXG4gIGl0ICdjaGVja3Mgb3V0IFwib3VyXCIgdmVyc2lvbiBvZiBhIGZpbGUgZnJvbSB0aGUgaW5kZXgnLCAtPlxuICAgIFtjLCBhLCBvXSA9IFtdXG4gICAgY29udGV4dC5tb2NrUHJvY2VzcyAoe2NvbW1hbmQsIGFyZ3MsIG9wdGlvbnMsIGV4aXR9KSAtPlxuICAgICAgW2MsIGEsIG9dID0gW2NvbW1hbmQsIGFyZ3MsIG9wdGlvbnNdXG4gICAgICBleGl0KDApXG4gICAgICB7IHByb2Nlc3M6IHsgb246IChjYWxsYmFjaykgLT4gfSB9XG5cbiAgICBjYWxsZWQgPSBmYWxzZVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgY29udGV4dC5jaGVja291dFNpZGUoJ291cnMnLCAnbGliL2ZpbGUxLnR4dCcpLnRoZW4gLT4gY2FsbGVkID0gdHJ1ZVxuXG4gICAgcnVucyAtPlxuICAgICAgZXhwZWN0KGNhbGxlZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGMpLnRvQmUoJy91c3IvYmluL2dpdCcpXG4gICAgICBleHBlY3QoYSkudG9FcXVhbChbJ2NoZWNrb3V0JywgJy0tb3VycycsICdsaWIvZmlsZTEudHh0J10pXG4gICAgICBleHBlY3QobykudG9FcXVhbCh7IGN3ZDogZ2l0V29ya0RpciB9KVxuXG4gIGl0ICdzdGFnZXMgY2hhbmdlcyB0byBhIGZpbGUnLCAtPlxuICAgIHAgPSBcIlwiXG4gICAgY29udGV4dC5yZXBvc2l0b3J5LnJlcG8uYWRkID0gKHBhdGgpIC0+IHAgPSBwYXRoXG5cbiAgICBjYWxsZWQgPSBmYWxzZVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgY29udGV4dC5yZXNvbHZlRmlsZSgnbGliL2ZpbGUxLnR4dCcpLnRoZW4gLT4gY2FsbGVkID0gdHJ1ZVxuXG4gICAgcnVucyAtPlxuICAgICAgZXhwZWN0KGNhbGxlZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHApLnRvQmUoJ2xpYi9maWxlMS50eHQnKVxuXG4gIGRlc2NyaWJlICdyZWJhc2UgZGV0ZWN0aW9uJywgLT5cblxuICAgIHdpdGhSb290ID0gKGdpdERpciwgY2FsbGJhY2spIC0+XG4gICAgICBmdWxsRGlyID0gcGF0aC5qb2luIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLmdldFBhdGgoKSwgZ2l0RGlyXG4gICAgICBzYXZlZCA9IGNvbnRleHQucmVwb3NpdG9yeS5nZXRQYXRoXG4gICAgICBjb250ZXh0LnJlcG9zaXRvcnkuZ2V0UGF0aCA9IC0+IGZ1bGxEaXJcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIGNvbnRleHQucmVwb3NpdG9yeS5nZXRQYXRoID0gc2F2ZWRcblxuICAgIGl0ICdyZWNvZ25pemVzIGEgbm9uLWludGVyYWN0aXZlIHJlYmFzZScsIC0+XG4gICAgICB3aXRoUm9vdCAncmViYXNpbmcuZ2l0JywgLT5cbiAgICAgICAgZXhwZWN0KGNvbnRleHQuaXNSZWJhc2luZygpKS50b0JlKHRydWUpXG5cbiAgICBpdCAncmVjb2duaXplcyBhbiBpbnRlcmFjdGl2ZSByZWJhc2UnLCAtPlxuICAgICAgd2l0aFJvb3QgJ2lyZWJhc2luZy5naXQnLCAtPlxuICAgICAgICBleHBlY3QoY29udGV4dC5pc1JlYmFzaW5nKCkpLnRvQmUodHJ1ZSlcblxuICAgIGl0ICdyZXR1cm5zIGZhbHNlIGlmIG5vdCByZWJhc2luZycsIC0+XG4gICAgICB3aXRoUm9vdCAnbWVyZ2luZy5naXQnLCAtPlxuICAgICAgICBleHBlY3QoY29udGV4dC5pc1JlYmFzaW5nKCkpLnRvQmUoZmFsc2UpXG4iXX0=
