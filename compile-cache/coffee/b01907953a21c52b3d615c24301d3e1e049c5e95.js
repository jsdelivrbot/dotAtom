(function() {
  var BufferedProcess, Directory, Os, RepoListView, _prettify, _prettifyDiff, _prettifyUntracked, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, ref;

  Os = require('os');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, Directory = ref.Directory;

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitUntrackedFiles = function(repo, dataUnstaged) {
    var args;
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    args = ['ls-files', '-o', '--exclude-standard'];
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return dataUnstaged.concat(_prettifyUntracked(data));
    });
  };

  _prettify = function(data, arg) {
    var i, mode, staged;
    staged = (arg != null ? arg : {}).staged;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var j, len, results;
      results = [];
      for (i = j = 0, len = data.length; j < len; i = j += 2) {
        mode = data[i];
        results.push({
          mode: mode,
          staged: staged,
          path: data[i + 1]
        });
      }
      return results;
    })();
  };

  _prettifyUntracked = function(data) {
    if (data === '') {
      return [];
    }
    data = data.split(/\n/).filter(function(d) {
      return d !== '';
    });
    return data.map(function(file) {
      return {
        mode: '?',
        path: file
      };
    });
  };

  _prettifyDiff = function(data) {
    var line, ref1;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(ref1 = (function() {
      var j, len, ref2, results;
      ref2 = data.slice(1);
      results = [];
      for (j = 0, len = ref2.length; j < len; j++) {
        line = ref2[j];
        results.push('@@' + line);
      }
      return results;
    })())), ref1;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, ref1;
      project = atom.project;
      path = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      directory = project.getDirectories().filter(function(d) {
        return d.contains(path);
      })[0];
      if (directory != null) {
        return project.repositoryForDirectory(directory).then(function(repo) {
          var submodule;
          submodule = repo.repo.submoduleForPath(path);
          if (submodule != null) {
            return resolve(submodule);
          } else {
            return resolve(repo);
          }
        })["catch"](function(e) {
          return reject(e);
        });
      } else {
        return reject("no current file");
      }
    });
  };

  module.exports = git = {
    cmd: function(args, options, arg) {
      var color;
      if (options == null) {
        options = {
          env: process.env
        };
      }
      color = (arg != null ? arg : {}).color;
      return new Promise(function(resolve, reject) {
        var output, process, ref1;
        output = '';
        if (color) {
          args = ['-c', 'color.ui=always'].concat(args);
        }
        process = new BufferedProcess({
          command: (ref1 = atom.config.get('git-plus.general.gitPath')) != null ? ref1 : 'git',
          args: args,
          options: options,
          stdout: function(data) {
            return output += data.toString();
          },
          stderr: function(data) {
            return output += data.toString();
          },
          exit: function(code) {
            if (code === 0) {
              return resolve(output);
            } else {
              return reject(output);
            }
          }
        });
        return process.onWillThrowError(function(errorObject) {
          notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
          return reject("Couldn't find git");
        });
      });
    },
    getConfig: function(repo, setting) {
      return repo.getConfigValue(setting, repo.getWorkingDirectory());
    },
    reset: function(repo) {
      return git.cmd(['reset', 'HEAD'], {
        cwd: repo.getWorkingDirectory()
      }).then(function() {
        return notifier.addSuccess('All changes unstaged');
      });
    },
    status: function(repo) {
      return git.cmd(['status', '--porcelain', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (data.length > 2) {
          return data.split('\0').slice(0, -1);
        } else {
          return [];
        }
      });
    },
    refresh: function(repo) {
      if (repo) {
        if (typeof repo.refreshStatus === "function") {
          repo.refreshStatus();
        }
        return typeof repo.refreshIndex === "function" ? repo.refreshIndex() : void 0;
      } else {
        return atom.project.getRepositories().forEach(function(repo) {
          if (repo != null) {
            return repo.refreshStatus();
          }
        });
      }
    },
    relativize: function(path) {
      var ref1, ref2, ref3, ref4;
      return (ref1 = (ref2 = (ref3 = git.getSubmodule(path)) != null ? ref3.relativize(path) : void 0) != null ? ref2 : (ref4 = atom.project.getRepositories()[0]) != null ? ref4.relativize(path) : void 0) != null ? ref1 : path;
    },
    diff: function(repo, path) {
      return git.cmd(['diff', '-p', '-U1', path], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettifyDiff(data);
      });
    },
    stagedFiles: function(repo) {
      var args;
      args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettify(data, {
          staged: true
        });
      })["catch"](function(error) {
        if (error.includes("ambiguous argument 'HEAD'")) {
          return Promise.resolve([1]);
        } else {
          notifier.addError(error);
          return Promise.resolve([]);
        }
      });
    },
    unstagedFiles: function(repo, arg) {
      var args, showUntracked;
      showUntracked = (arg != null ? arg : {}).showUntracked;
      args = ['diff-files', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data, {
            staged: false
          }));
        } else {
          return _prettify(data, {
            staged: false
          });
        }
      });
    },
    add: function(repo, arg) {
      var args, file, ref1, update;
      ref1 = arg != null ? arg : {}, file = ref1.file, update = ref1.update;
      args = ['add'];
      if (update) {
        args.push('--update');
      } else {
        args.push('--all');
      }
      args.push(file ? file : '.');
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(output) {
        if (output !== false) {
          return notifier.addSuccess("Added " + (file != null ? file : 'all files'));
        }
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    },
    getAllRepos: function() {
      var project;
      project = atom.project;
      return Promise.all(project.getDirectories().map(project.repositoryForDirectory.bind(project)));
    },
    getRepo: function() {
      return new Promise(function(resolve, reject) {
        return getRepoForCurrentFile().then(function(repo) {
          return resolve(repo);
        })["catch"](function(e) {
          var repos;
          repos = atom.project.getRepositories().filter(function(r) {
            return r != null;
          });
          if (repos.length === 0) {
            return reject("No repos found");
          } else if (repos.length > 1) {
            return resolve(new RepoListView(repos).result);
          } else {
            return resolve(repos[0]);
          }
        });
      });
    },
    getRepoForPath: function(path) {
      if (path == null) {
        return Promise.reject("No file to find repository for");
      } else {
        return new Promise(function(resolve, reject) {
          var repoPromises;
          repoPromises = atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project));
          return Promise.all(repoPromises).then(function(repos) {
            if (!repo) {
              return;
            }
            return repos.forEach(function(repo) {
              var directory, submodule;
              directory = new Directory(repo.getWorkingDirectory());
              if ((repo != null) && directory.contains(path) || directory.getPath() === path) {
                submodule = repo != null ? repo.repo.submoduleForPath(path) : void 0;
                if (submodule != null) {
                  return resolve(submodule);
                } else {
                  return resolve(repo);
                }
              }
            });
          });
        });
      }
    },
    getSubmodule: function(path) {
      var ref1, ref2, ref3;
      if (path == null) {
        path = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      }
      return (ref2 = atom.project.getRepositories().filter(function(r) {
        var ref3;
        return r != null ? (ref3 = r.repo) != null ? ref3.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (ref3 = ref2.repo) != null ? ref3.submoduleForPath(path) : void 0 : void 0;
    },
    dir: function(andSubmodules) {
      if (andSubmodules == null) {
        andSubmodules = true;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var submodule;
          if (andSubmodules && (submodule = git.getSubmodule())) {
            return resolve(submodule.getWorkingDirectory());
          } else {
            return git.getRepo().then(function(repo) {
              return resolve(repo.getWorkingDirectory());
            });
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9naXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsTUFBK0IsT0FBQSxDQUFRLE1BQVIsQ0FBL0IsRUFBQyxxQ0FBRCxFQUFrQjs7RUFFbEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUjs7RUFDZixRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBRVgsaUJBQUEsR0FBb0IsU0FBQyxJQUFELEVBQU8sWUFBUDtBQUNsQixRQUFBOztNQUR5QixlQUFhOztJQUN0QyxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixvQkFBbkI7V0FDUCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFDSixZQUFZLENBQUMsTUFBYixDQUFvQixrQkFBQSxDQUFtQixJQUFuQixDQUFwQjtJQURJLENBRE47RUFGa0I7O0VBTXBCLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ1YsUUFBQTtJQURrQix3QkFBRCxNQUFTO0lBQzFCLElBQWEsSUFBQSxLQUFRLEVBQXJCO0FBQUEsYUFBTyxHQUFQOztJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUI7OztBQUNuQjtXQUFBLGlEQUFBOztxQkFDSDtVQUFDLE1BQUEsSUFBRDtVQUFPLFFBQUEsTUFBUDtVQUFlLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBMUI7O0FBREc7OztFQUhLOztFQU1aLGtCQUFBLEdBQXFCLFNBQUMsSUFBRDtJQUNuQixJQUFhLElBQUEsS0FBUSxFQUFy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LENBQW5CLEVBSEY7O1FBRFU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7SUFERCxDQWxITDs7QUEzQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJPcyA9IHJlcXVpcmUgJ29zJ1xue0J1ZmZlcmVkUHJvY2VzcywgRGlyZWN0b3J5fSA9IHJlcXVpcmUgJ2F0b20nXG5cblJlcG9MaXN0VmlldyA9IHJlcXVpcmUgJy4vdmlld3MvcmVwby1saXN0LXZpZXcnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4vbm90aWZpZXInXG5cbmdpdFVudHJhY2tlZEZpbGVzID0gKHJlcG8sIGRhdGFVbnN0YWdlZD1bXSkgLT5cbiAgYXJncyA9IFsnbHMtZmlsZXMnLCAnLW8nLCAnLS1leGNsdWRlLXN0YW5kYXJkJ11cbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBkYXRhVW5zdGFnZWQuY29uY2F0KF9wcmV0dGlmeVVudHJhY2tlZChkYXRhKSlcblxuX3ByZXR0aWZ5ID0gKGRhdGEsIHtzdGFnZWR9PXt9KSAtPlxuICByZXR1cm4gW10gaWYgZGF0YSBpcyAnJ1xuICBkYXRhID0gZGF0YS5zcGxpdCgvXFwwLylbLi4uLTFdXG4gIFtdID0gZm9yIG1vZGUsIGkgaW4gZGF0YSBieSAyXG4gICAge21vZGUsIHN0YWdlZCwgcGF0aDogZGF0YVtpKzFdfVxuXG5fcHJldHRpZnlVbnRyYWNrZWQgPSAoZGF0YSkgLT5cbiAgcmV0dXJuIFtdIGlmIGRhdGEgaXMgJydcbiAgZGF0YSA9IGRhdGEuc3BsaXQoL1xcbi8pLmZpbHRlciAoZCkgLT4gZCBpc250ICcnXG4gIGRhdGEubWFwIChmaWxlKSAtPiB7bW9kZTogJz8nLCBwYXRoOiBmaWxlfVxuXG5fcHJldHRpZnlEaWZmID0gKGRhdGEpIC0+XG4gIGRhdGEgPSBkYXRhLnNwbGl0KC9eQEAoPz1bIFxcLVxcK1xcLDAtOV0qQEApL2dtKVxuICBkYXRhWzEuLmRhdGEubGVuZ3RoXSA9ICgnQEAnICsgbGluZSBmb3IgbGluZSBpbiBkYXRhWzEuLl0pXG4gIGRhdGFcblxuZ2V0UmVwb0ZvckN1cnJlbnRGaWxlID0gLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICBwcm9qZWN0ID0gYXRvbS5wcm9qZWN0XG4gICAgcGF0aCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpXG4gICAgZGlyZWN0b3J5ID0gcHJvamVjdC5nZXREaXJlY3RvcmllcygpLmZpbHRlcigoZCkgLT4gZC5jb250YWlucyhwYXRoKSlbMF1cbiAgICBpZiBkaXJlY3Rvcnk/XG4gICAgICBwcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkoZGlyZWN0b3J5KS50aGVuIChyZXBvKSAtPlxuICAgICAgICBzdWJtb2R1bGUgPSByZXBvLnJlcG8uc3VibW9kdWxlRm9yUGF0aChwYXRoKVxuICAgICAgICBpZiBzdWJtb2R1bGU/IHRoZW4gcmVzb2x2ZShzdWJtb2R1bGUpIGVsc2UgcmVzb2x2ZShyZXBvKVxuICAgICAgLmNhdGNoIChlKSAtPlxuICAgICAgICByZWplY3QoZSlcbiAgICBlbHNlXG4gICAgICByZWplY3QgXCJubyBjdXJyZW50IGZpbGVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGdpdCA9XG4gIGNtZDogKGFyZ3MsIG9wdGlvbnM9eyBlbnY6IHByb2Nlc3MuZW52fSwge2NvbG9yfT17fSkgLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgb3V0cHV0ID0gJydcbiAgICAgIGFyZ3MgPSBbJy1jJywgJ2NvbG9yLnVpPWFsd2F5cyddLmNvbmNhdChhcmdzKSBpZiBjb2xvclxuICAgICAgcHJvY2VzcyA9IG5ldyBCdWZmZXJlZFByb2Nlc3NcbiAgICAgICAgY29tbWFuZDogYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLmdpdFBhdGgnKSA/ICdnaXQnXG4gICAgICAgIGFyZ3M6IGFyZ3NcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICBzdGRvdXQ6IChkYXRhKSAtPiBvdXRwdXQgKz0gZGF0YS50b1N0cmluZygpXG4gICAgICAgIHN0ZGVycjogKGRhdGEpIC0+XG4gICAgICAgICAgb3V0cHV0ICs9IGRhdGEudG9TdHJpbmcoKVxuICAgICAgICBleGl0OiAoY29kZSkgLT5cbiAgICAgICAgICBpZiBjb2RlIGlzIDBcbiAgICAgICAgICAgIHJlc29sdmUgb3V0cHV0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVqZWN0IG91dHB1dFxuICAgICAgcHJvY2Vzcy5vbldpbGxUaHJvd0Vycm9yIChlcnJvck9iamVjdCkgLT5cbiAgICAgICAgbm90aWZpZXIuYWRkRXJyb3IgJ0dpdCBQbHVzIGlzIHVuYWJsZSB0byBsb2NhdGUgdGhlIGdpdCBjb21tYW5kLiBQbGVhc2UgZW5zdXJlIHByb2Nlc3MuZW52LlBBVEggY2FuIGFjY2VzcyBnaXQuJ1xuICAgICAgICByZWplY3QgXCJDb3VsZG4ndCBmaW5kIGdpdFwiXG5cbiAgZ2V0Q29uZmlnOiAocmVwbywgc2V0dGluZykgLT4gcmVwby5nZXRDb25maWdWYWx1ZSBzZXR0aW5nLCByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuXG4gIHJlc2V0OiAocmVwbykgLT5cbiAgICBnaXQuY21kKFsncmVzZXQnLCAnSEVBRCddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKS50aGVuICgpIC0+IG5vdGlmaWVyLmFkZFN1Y2Nlc3MgJ0FsbCBjaGFuZ2VzIHVuc3RhZ2VkJ1xuXG4gIHN0YXR1czogKHJlcG8pIC0+XG4gICAgZ2l0LmNtZChbJ3N0YXR1cycsICctLXBvcmNlbGFpbicsICcteiddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPiBpZiBkYXRhLmxlbmd0aCA+IDIgdGhlbiBkYXRhLnNwbGl0KCdcXDAnKVsuLi4tMV0gZWxzZSBbXVxuXG4gIHJlZnJlc2g6IChyZXBvKSAtPlxuICAgIGlmIHJlcG9cbiAgICAgIHJlcG8ucmVmcmVzaFN0YXR1cz8oKVxuICAgICAgcmVwby5yZWZyZXNoSW5kZXg/KClcbiAgICBlbHNlXG4gICAgICBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKCkuZm9yRWFjaCAocmVwbykgLT4gcmVwby5yZWZyZXNoU3RhdHVzKCkgaWYgcmVwbz9cblxuICByZWxhdGl2aXplOiAocGF0aCkgLT5cbiAgICBnaXQuZ2V0U3VibW9kdWxlKHBhdGgpPy5yZWxhdGl2aXplKHBhdGgpID8gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpWzBdPy5yZWxhdGl2aXplKHBhdGgpID8gcGF0aFxuXG4gIGRpZmY6IChyZXBvLCBwYXRoKSAtPlxuICAgIGdpdC5jbWQoWydkaWZmJywgJy1wJywgJy1VMScsIHBhdGhdLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPiBfcHJldHRpZnlEaWZmKGRhdGEpXG5cbiAgc3RhZ2VkRmlsZXM6IChyZXBvKSAtPlxuICAgIGFyZ3MgPSBbJ2RpZmYtaW5kZXgnLCAnLS1jYWNoZWQnLCAnSEVBRCcsICctLW5hbWUtc3RhdHVzJywgJy16J11cbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBfcHJldHRpZnkgZGF0YSwgc3RhZ2VkOiB0cnVlXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGlmIGVycm9yLmluY2x1ZGVzIFwiYW1iaWd1b3VzIGFyZ3VtZW50ICdIRUFEJ1wiXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSBbMV1cbiAgICAgIGVsc2VcbiAgICAgICAgbm90aWZpZXIuYWRkRXJyb3IgZXJyb3JcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlIFtdXG5cbiAgdW5zdGFnZWRGaWxlczogKHJlcG8sIHtzaG93VW50cmFja2VkfT17fSkgLT5cbiAgICBhcmdzID0gWydkaWZmLWZpbGVzJywgJy0tbmFtZS1zdGF0dXMnLCAnLXonXVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIGlmIHNob3dVbnRyYWNrZWRcbiAgICAgICAgZ2l0VW50cmFja2VkRmlsZXMocmVwbywgX3ByZXR0aWZ5KGRhdGEsIHN0YWdlZDogZmFsc2UpKVxuICAgICAgZWxzZVxuICAgICAgICBfcHJldHRpZnkoZGF0YSwgc3RhZ2VkOiBmYWxzZSlcblxuICBhZGQ6IChyZXBvLCB7ZmlsZSwgdXBkYXRlfT17fSkgLT5cbiAgICBhcmdzID0gWydhZGQnXVxuICAgIGlmIHVwZGF0ZSB0aGVuIGFyZ3MucHVzaCAnLS11cGRhdGUnIGVsc2UgYXJncy5wdXNoICctLWFsbCdcbiAgICBhcmdzLnB1c2goaWYgZmlsZSB0aGVuIGZpbGUgZWxzZSAnLicpXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChvdXRwdXQpIC0+XG4gICAgICBpZiBvdXRwdXQgaXNudCBmYWxzZVxuICAgICAgICBub3RpZmllci5hZGRTdWNjZXNzIFwiQWRkZWQgI3tmaWxlID8gJ2FsbCBmaWxlcyd9XCJcbiAgICAuY2F0Y2ggKG1zZykgLT4gbm90aWZpZXIuYWRkRXJyb3IgbXNnXG5cbiAgZ2V0QWxsUmVwb3M6IC0+XG4gICAge3Byb2plY3R9ID0gYXRvbVxuICAgIFByb21pc2UuYWxsKHByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgLm1hcChwcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkuYmluZChwcm9qZWN0KSkpXG5cbiAgZ2V0UmVwbzogLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgZ2V0UmVwb0ZvckN1cnJlbnRGaWxlKCkudGhlbiAocmVwbykgLT4gcmVzb2x2ZShyZXBvKVxuICAgICAgLmNhdGNoIChlKSAtPlxuICAgICAgICByZXBvcyA9IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5maWx0ZXIgKHIpIC0+IHI/XG4gICAgICAgIGlmIHJlcG9zLmxlbmd0aCBpcyAwXG4gICAgICAgICAgcmVqZWN0KFwiTm8gcmVwb3MgZm91bmRcIilcbiAgICAgICAgZWxzZSBpZiByZXBvcy5sZW5ndGggPiAxXG4gICAgICAgICAgcmVzb2x2ZShuZXcgUmVwb0xpc3RWaWV3KHJlcG9zKS5yZXN1bHQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXNvbHZlKHJlcG9zWzBdKVxuXG4gIGdldFJlcG9Gb3JQYXRoOiAocGF0aCkgLT5cbiAgICBpZiBub3QgcGF0aD9cbiAgICAgIFByb21pc2UucmVqZWN0IFwiTm8gZmlsZSB0byBmaW5kIHJlcG9zaXRvcnkgZm9yXCJcbiAgICBlbHNlXG4gICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgICByZXBvUHJvbWlzZXMgPVxuICAgICAgICAgIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG4gICAgICAgICAgLm1hcChhdG9tLnByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeS5iaW5kKGF0b20ucHJvamVjdCkpXG5cbiAgICAgICAgUHJvbWlzZS5hbGwocmVwb1Byb21pc2VzKS50aGVuIChyZXBvcykgLT5cbiAgICAgICAgICByZXR1cm4gaWYgbm90IHJlcG9cbiAgICAgICAgICByZXBvcy5mb3JFYWNoIChyZXBvKSAtPlxuICAgICAgICAgICAgZGlyZWN0b3J5ID0gbmV3IERpcmVjdG9yeShyZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgICAgICAgIGlmIHJlcG8/IGFuZCBkaXJlY3RvcnkuY29udGFpbnMocGF0aCkgb3IgZGlyZWN0b3J5LmdldFBhdGgoKSBpcyBwYXRoXG4gICAgICAgICAgICAgIHN1Ym1vZHVsZSA9IHJlcG8/LnJlcG8uc3VibW9kdWxlRm9yUGF0aChwYXRoKVxuICAgICAgICAgICAgICBpZiBzdWJtb2R1bGU/IHRoZW4gcmVzb2x2ZShzdWJtb2R1bGUpIGVsc2UgcmVzb2x2ZShyZXBvKVxuXG4gIGdldFN1Ym1vZHVsZTogKHBhdGgpIC0+XG4gICAgcGF0aCA/PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKVxuICAgIGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5maWx0ZXIoKHIpIC0+XG4gICAgICByPy5yZXBvPy5zdWJtb2R1bGVGb3JQYXRoIHBhdGhcbiAgICApWzBdPy5yZXBvPy5zdWJtb2R1bGVGb3JQYXRoIHBhdGhcblxuICBkaXI6IChhbmRTdWJtb2R1bGVzPXRydWUpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIGlmIGFuZFN1Ym1vZHVsZXMgYW5kIHN1Ym1vZHVsZSA9IGdpdC5nZXRTdWJtb2R1bGUoKVxuICAgICAgICByZXNvbHZlKHN1Ym1vZHVsZS5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICBlbHNlXG4gICAgICAgIGdpdC5nZXRSZXBvKCkudGhlbiAocmVwbykgLT4gcmVzb2x2ZShyZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiJdfQ==
