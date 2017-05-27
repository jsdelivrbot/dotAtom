(function() {
  var meta;

  meta = {
    define: "https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey",
    key: (function() {
      switch (process.platform) {
        case "darwin":
          return "⌘";
        case "linux":
          return "Super";
        case "win32":
          return "❖";
      }
    })()
  };

  module.exports = {
    general: {
      order: 1,
      type: "object",
      properties: {
        gitPath: {
          order: 1,
          title: "Git Path",
          type: "string",
          "default": "git",
          description: "If git is not in your PATH, specify where the executable is"
        },
        enableStatusBarIcon: {
          order: 2,
          title: "Status-bar Pin Icon",
          type: "boolean",
          "default": true,
          description: "The pin icon in the bottom-right of the status-bar toggles the output view above the status-bar"
        },
        newBranchKey: {
          order: 3,
          title: "Status-bar New Branch modifier key",
          type: "string",
          "default": "alt",
          description: "Status-bar branch list modifier key to alternatively create a new branch if held on click. Note that _[`meta`](" + meta.define + ")_ is <kbd>" + meta.key + "</kbd>",
          "enum": ["alt", "shift", "meta", "ctrl"]
        },
        openInPane: {
          order: 4,
          title: "Allow commands to open new panes",
          type: "boolean",
          "default": true,
          description: "Commands like `Commit`, `Log`, `Show`, `Diff` can be split into new panes"
        },
        splitPane: {
          order: 5,
          title: "Split pane direction",
          type: "string",
          "default": "Down",
          description: "Where should new panes go?",
          "enum": ["Up", "Right", "Down", "Left"]
        },
        showFormat: {
          order: 6,
          title: "Format option for 'Git Show'",
          type: "string",
          "default": "full",
          "enum": ["oneline", "short", "medium", "full", "fuller", "email", "raw", "none"],
          description: "Which format to use for `git show`? (`none` will use your git config default)"
        }
      }
    },
    commits: {
      order: 2,
      type: "object",
      properties: {
        verboseCommits: {
          title: "Verbose Commits",
          description: "Show diffs in commit pane?",
          type: "boolean",
          "default": false
        }
      }
    },
    diffs: {
      order: 3,
      type: "object",
      properties: {
        includeStagedDiff: {
          order: 1,
          title: "Include staged diffs?",
          type: "boolean",
          "default": true
        },
        wordDiff: {
          order: 2,
          title: "Word diff",
          type: "boolean",
          "default": false,
          description: "Should diffs be generated with the `--word-diff` flag?"
        },
        syntaxHighlighting: {
          order: 3,
          title: "Enable syntax highlighting in diffs?",
          type: "boolean",
          "default": true
        }
      }
    },
    logs: {
      order: 4,
      type: "object",
      properties: {
        numberOfCommitsToShow: {
          order: 1,
          title: "Number of commits to load",
          type: "integer",
          "default": 25,
          minimum: 1,
          description: "Initial amount of commits to load when running the `Log` command"
        }
      }
    },
    remoteInteractions: {
      order: 5,
      type: "object",
      properties: {
        pullRebase: {
          order: 1,
          title: "Pull Rebase",
          type: "boolean",
          "default": false,
          description: "Pull with `--rebase` flag?"
        },
        pullBeforePush: {
          order: 2,
          title: "Pull Before Pushing",
          type: "boolean",
          "default": false,
          description: "Pull from remote before pushing"
        },
        promptForBranch: {
          order: 3,
          title: "Prompt for branch selection when pulling/pushing",
          type: "boolean",
          "default": false,
          description: "If false, it defaults to current branch upstream"
        }
      }
    },
    tags: {
      order: 6,
      type: "object",
      properties: {
        signTags: {
          title: "Sign git tags with GPG",
          type: "boolean",
          "default": false,
          description: "Use a GPG key to sign Git tags"
        }
      }
    },
    experimental: {
      order: 7,
      type: "object",
      properties: {
        stageFilesBeta: {
          order: 1,
          title: "Stage Files Beta",
          type: "boolean",
          "default": true,
          description: "Stage and unstage files in a single command"
        },
        customCommands: {
          order: 2,
          title: "Custom Commands",
          type: "boolean",
          "default": false,
          description: "Declared custom commands in your `init` file that can be run from the Git-plus command palette"
        },
        diffBranches: {
          order: 3,
          title: "Show diffs across branches",
          type: "boolean",
          "default": false,
          description: "Diffs will be shown for the current branch against a branch you choose. The `Diff branch files` command will allow choosing which file to compare. The file feature requires the 'split-diff' package to be installed."
        },
        useSplitDiff: {
          order: 4,
          title: "Split diff",
          type: "boolean",
          "default": false,
          description: "Use the split-diff package to show diffs for a single file. Only works with `Diff` command when a file is open."
        },
        autoFetch: {
          order: 5,
          title: "Auto-fetch",
          type: "integer",
          "default": 0,
          maximum: 60,
          description: "Automatically fetch remote repositories every `x` minutes (`0` will disable this feature)"
        },
        autoFetchNotify: {
          order: 6,
          title: "Auto-fetch notification",
          type: "boolean",
          "default": false,
          description: "Show notifications while running `fetch --all`?"
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL2xpYi9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQ0U7SUFBQSxNQUFBLEVBQVEscUVBQVI7SUFDQSxHQUFBO0FBQ0UsY0FBTyxPQUFPLENBQUMsUUFBZjtBQUFBLGFBQ08sUUFEUDtpQkFDcUI7QUFEckIsYUFFTyxPQUZQO2lCQUVvQjtBQUZwQixhQUdPLE9BSFA7aUJBR29CO0FBSHBCO1FBRkY7OztFQU9GLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxPQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sQ0FBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsVUFBQSxFQUNFO1FBQUEsT0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8sVUFEUDtVQUVBLElBQUEsRUFBTSxRQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsV0FBQSxFQUFhLDZEQUpiO1NBREY7UUFNQSxtQkFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8scUJBRFA7VUFFQSxJQUFBLEVBQU0sU0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtVQUlBLFdBQUEsRUFBYSxpR0FKYjtTQVBGO1FBWUEsWUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8sb0NBRFA7VUFFQSxJQUFBLEVBQU0sUUFGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtVQUlBLFdBQUEsRUFBYSxpSEFBQSxHQUFrSCxJQUFJLENBQUMsTUFBdkgsR0FBOEgsYUFBOUgsR0FBMkksSUFBSSxDQUFDLEdBQWhKLEdBQW9KLFFBSmpLO1VBS0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxPQUFS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QURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7VUFJQSxXQUFBLEVBQWEsaUhBSmI7U0FuQkY7UUF3QkEsU0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8sWUFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUhUO1VBSUEsT0FBQSxFQUFTLEVBSlQ7VUFLQSxXQUFBLEVBQWEsMkZBTGI7U0F6QkY7UUErQkEsZUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8seUJBRFA7VUFFQSxJQUFBLEVBQU0sU0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FIVDtVQUlBLFdBQUEsRUFBYSxpREFKYjtTQWhDRjtPQUhGO0tBbkhGOztBQVRGIiwic291cmNlc0NvbnRlbnQiOlsibWV0YSA9ICNLZXlcbiAgZGVmaW5lOiBcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Nb3VzZUV2ZW50L21ldGFLZXlcIlxuICBrZXk6XG4gICAgc3dpdGNoIHByb2Nlc3MucGxhdGZvcm1cbiAgICAgIHdoZW4gXCJkYXJ3aW5cIiB0aGVuIFwi4oyYXCJcbiAgICAgIHdoZW4gXCJsaW51eFwiIHRoZW4gXCJTdXBlclwiXG4gICAgICB3aGVuIFwid2luMzJcIiB0aGVuIFwi4p2WXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuICBnZW5lcmFsOlxuICAgIG9yZGVyOiAxXG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBnaXRQYXRoOlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJHaXQgUGF0aFwiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogXCJnaXRcIlxuICAgICAgICBkZXNjcmlwdGlvbjogXCJJZiBnaXQgaXMgbm90IGluIHlvdXIgUEFUSCwgc3BlY2lmeSB3aGVyZSB0aGUgZXhlY3V0YWJsZSBpc1wiXG4gICAgICBlbmFibGVTdGF0dXNCYXJJY29uOlxuICAgICAgICBvcmRlcjogMlxuICAgICAgICB0aXRsZTogXCJTdGF0dXMtYmFyIFBpbiBJY29uXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgcGluIGljb24gaW4gdGhlIGJvdHRvbS1yaWdodCBvZiB0aGUgc3RhdHVzLWJhciB0b2dnbGVzIHRoZSBvdXRwdXQgdmlldyBhYm92ZSB0aGUgc3RhdHVzLWJhclwiXG4gICAgICBuZXdCcmFuY2hLZXk6XG4gICAgICAgIG9yZGVyOiAzXG4gICAgICAgIHRpdGxlOiBcIlN0YXR1cy1iYXIgTmV3IEJyYW5jaCBtb2RpZmllciBrZXlcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiYWx0XCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU3RhdHVzLWJhciBicmFuY2ggbGlzdCBtb2RpZmllciBrZXkgdG8gYWx0ZXJuYXRpdmVseSBjcmVhdGUgYSBuZXcgYnJhbmNoIGlmIGhlbGQgb24gY2xpY2suIE5vdGUgdGhhdCBfW2BtZXRhYF0oI3ttZXRhLmRlZmluZX0pXyBpcyA8a2JkPiN7bWV0YS5rZXl9PC9rYmQ+XCJcbiAgICAgICAgZW51bTogW1wiYWx0XCIsIFwic2hpZnRcIiwgXCJtZXRhXCIsIFwiY3RybFwiXVxuICAgICAgb3BlbkluUGFuZTpcbiAgICAgICAgb3JkZXI6IDRcbiAgICAgICAgdGl0bGU6IFwiQWxsb3cgY29tbWFuZHMgdG8gb3BlbiBuZXcgcGFuZXNcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbW1hbmRzIGxpa2UgYENvbW1pdGAsIGBMb2dgLCBgU2hvd2AsIGBEaWZmYCBjYW4gYmUgc3BsaXQgaW50byBuZXcgcGFuZXNcIlxuICAgICAgc3BsaXRQYW5lOlxuICAgICAgICBvcmRlcjogNVxuICAgICAgICB0aXRsZTogXCJTcGxpdCBwYW5lIGRpcmVjdGlvblwiXG4gICAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICAgICAgZGVmYXVsdDogXCJEb3duXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2hlcmUgc2hvdWxkIG5ldyBwYW5lcyBnbz9cIlxuICAgICAgICBlbnVtOiBbXCJVcFwiLCBcIlJpZ2h0XCIsIFwiRG93blwiLCBcIkxlZnRcIl1cbiAgICAgIHNob3dGb3JtYXQ6XG4gICAgICAgIG9yZGVyOiA2XG4gICAgICAgIHRpdGxlOiBcIkZvcm1hdCBvcHRpb24gZm9yICdHaXQgU2hvdydcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiZnVsbFwiXG4gICAgICAgIGVudW06IFtcIm9uZWxpbmVcIiwgXCJzaG9ydFwiLCBcIm1lZGl1bVwiLCBcImZ1bGxcIiwgXCJmdWxsZXJcIiwgXCJlbWFpbFwiLCBcInJhd1wiLCBcIm5vbmVcIl1cbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgYGdpdCBzaG93YD8gKGBub25lYCB3aWxsIHVzZSB5b3VyIGdpdCBjb25maWcgZGVmYXVsdClcIlxuICBjb21taXRzOlxuICAgIG9yZGVyOiAyXG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICB2ZXJib3NlQ29tbWl0czpcbiAgICAgICAgdGl0bGU6IFwiVmVyYm9zZSBDb21taXRzXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2hvdyBkaWZmcyBpbiBjb21taXQgcGFuZT9cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICBkaWZmczpcbiAgICBvcmRlcjogM1xuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgaW5jbHVkZVN0YWdlZERpZmY6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIkluY2x1ZGUgc3RhZ2VkIGRpZmZzP1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIHdvcmREaWZmOlxuICAgICAgICBvcmRlcjogMlxuICAgICAgICB0aXRsZTogXCJXb3JkIGRpZmZcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJTaG91bGQgZGlmZnMgYmUgZ2VuZXJhdGVkIHdpdGggdGhlIGAtLXdvcmQtZGlmZmAgZmxhZz9cIlxuICAgICAgc3ludGF4SGlnaGxpZ2h0aW5nOlxuICAgICAgICBvcmRlcjogM1xuICAgICAgICB0aXRsZTogXCJFbmFibGUgc3ludGF4IGhpZ2hsaWdodGluZyBpbiBkaWZmcz9cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gIGxvZ3M6XG4gICAgb3JkZXI6IDRcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIG51bWJlck9mQ29tbWl0c1RvU2hvdzpcbiAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgdGl0bGU6IFwiTnVtYmVyIG9mIGNvbW1pdHMgdG8gbG9hZFwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDI1XG4gICAgICAgIG1pbmltdW06IDFcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSW5pdGlhbCBhbW91bnQgb2YgY29tbWl0cyB0byBsb2FkIHdoZW4gcnVubmluZyB0aGUgYExvZ2AgY29tbWFuZFwiXG4gIHJlbW90ZUludGVyYWN0aW9uczpcbiAgICBvcmRlcjogNVxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgcHVsbFJlYmFzZTpcbiAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgdGl0bGU6IFwiUHVsbCBSZWJhc2VcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJQdWxsIHdpdGggYC0tcmViYXNlYCBmbGFnP1wiXG4gICAgICBwdWxsQmVmb3JlUHVzaDpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiUHVsbCBCZWZvcmUgUHVzaGluZ1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlB1bGwgZnJvbSByZW1vdGUgYmVmb3JlIHB1c2hpbmdcIlxuICAgICAgcHJvbXB0Rm9yQnJhbmNoOlxuICAgICAgICBvcmRlcjogM1xuICAgICAgICB0aXRsZTogXCJQcm9tcHQgZm9yIGJyYW5jaCBzZWxlY3Rpb24gd2hlbiBwdWxsaW5nL3B1c2hpbmdcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJJZiBmYWxzZSwgaXQgZGVmYXVsdHMgdG8gY3VycmVudCBicmFuY2ggdXBzdHJlYW1cIlxuICB0YWdzOlxuICAgIG9yZGVyOiA2XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBzaWduVGFnczpcbiAgICAgICAgdGl0bGU6IFwiU2lnbiBnaXQgdGFncyB3aXRoIEdQR1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlVzZSBhIEdQRyBrZXkgdG8gc2lnbiBHaXQgdGFnc1wiXG4gIGV4cGVyaW1lbnRhbDpcbiAgICBvcmRlcjogN1xuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgc3RhZ2VGaWxlc0JldGE6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIlN0YWdlIEZpbGVzIEJldGFcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN0YWdlIGFuZCB1bnN0YWdlIGZpbGVzIGluIGEgc2luZ2xlIGNvbW1hbmRcIlxuICAgICAgY3VzdG9tQ29tbWFuZHM6XG4gICAgICAgIG9yZGVyOiAyXG4gICAgICAgIHRpdGxlOiBcIkN1c3RvbSBDb21tYW5kc1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkRlY2xhcmVkIGN1c3RvbSBjb21tYW5kcyBpbiB5b3VyIGBpbml0YCBmaWxlIHRoYXQgY2FuIGJlIHJ1biBmcm9tIHRoZSBHaXQtcGx1cyBjb21tYW5kIHBhbGV0dGVcIlxuICAgICAgZGlmZkJyYW5jaGVzOlxuICAgICAgICBvcmRlcjogM1xuICAgICAgICB0aXRsZTogXCJTaG93IGRpZmZzIGFjcm9zcyBicmFuY2hlc1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkRpZmZzIHdpbGwgYmUgc2hvd24gZm9yIHRoZSBjdXJyZW50IGJyYW5jaCBhZ2FpbnN0IGEgYnJhbmNoIHlvdSBjaG9vc2UuIFRoZSBgRGlmZiBicmFuY2ggZmlsZXNgIGNvbW1hbmQgd2lsbCBhbGxvdyBjaG9vc2luZyB3aGljaCBmaWxlIHRvIGNvbXBhcmUuIFRoZSBmaWxlIGZlYXR1cmUgcmVxdWlyZXMgdGhlICdzcGxpdC1kaWZmJyBwYWNrYWdlIHRvIGJlIGluc3RhbGxlZC5cIlxuICAgICAgdXNlU3BsaXREaWZmOlxuICAgICAgICBvcmRlcjogNFxuICAgICAgICB0aXRsZTogXCJTcGxpdCBkaWZmXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVXNlIHRoZSBzcGxpdC1kaWZmIHBhY2thZ2UgdG8gc2hvdyBkaWZmcyBmb3IgYSBzaW5nbGUgZmlsZS4gT25seSB3b3JrcyB3aXRoIGBEaWZmYCBjb21tYW5kIHdoZW4gYSBmaWxlIGlzIG9wZW4uXCJcbiAgICAgIGF1dG9GZXRjaDpcbiAgICAgICAgb3JkZXI6IDVcbiAgICAgICAgdGl0bGU6IFwiQXV0by1mZXRjaFwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDBcbiAgICAgICAgbWF4aW11bTogNjBcbiAgICAgICAgZGVzY3JpcHRpb246IFwiQXV0b21hdGljYWxseSBmZXRjaCByZW1vdGUgcmVwb3NpdG9yaWVzIGV2ZXJ5IGB4YCBtaW51dGVzIChgMGAgd2lsbCBkaXNhYmxlIHRoaXMgZmVhdHVyZSlcIlxuICAgICAgYXV0b0ZldGNoTm90aWZ5OlxuICAgICAgICBvcmRlcjogNlxuICAgICAgICB0aXRsZTogXCJBdXRvLWZldGNoIG5vdGlmaWNhdGlvblwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3cgbm90aWZpY2F0aW9ucyB3aGlsZSBydW5uaW5nIGBmZXRjaCAtLWFsbGA/XCJcbiJdfQ==
