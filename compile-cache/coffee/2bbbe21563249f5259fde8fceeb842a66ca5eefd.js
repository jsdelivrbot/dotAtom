(function() {
  var Beautifier, PHPCSFixer, isWindows, path;

  PHPCSFixer = require("../src/beautifiers/php-cs-fixer");

  Beautifier = require("../src/beautifiers/beautifier");

  path = require('path');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("PHP-CS-Fixer Beautifier", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        return activationPromise;
      });
    });
    return describe("Beautifier::beautify", function() {
      var OSSpecificSpecs, beautifier;
      beautifier = null;
      beforeEach(function() {
        return beautifier = new PHPCSFixer();
      });
      OSSpecificSpecs = function() {
        var failWhichProgram, text;
        text = "<?php echo \"test\"; ?>";
        it("should error when beautifier's program not found", function() {
          expect(beautifier).not.toBe(null);
          expect(beautifier instanceof Beautifier).toBe(true);
          return waitsForPromise({
            shouldReject: true
          }, function() {
            var cb, language, options, p;
            language = "PHP";
            options = {
              fixers: "",
              levels: ""
            };
            beautifier.spawn = function(exe, args, options) {
              var er;
              er = new Error('ENOENT');
              er.code = 'ENOENT';
              return beautifier.Promise.reject(er);
            };
            p = beautifier.beautify(text, language, options);
            expect(p).not.toBe(null);
            expect(p instanceof beautifier.Promise).toBe(true);
            cb = function(v) {
              expect(v).not.toBe(null);
              expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
              expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
              return v;
            };
            p.then(cb, cb);
            return p;
          });
        });
        failWhichProgram = function(failingProgram) {
          return it("should error when '" + failingProgram + "' not found", function() {
            expect(beautifier).not.toBe(null);
            expect(beautifier instanceof Beautifier).toBe(true);
            if (!beautifier.isWindows && failingProgram === "php") {
              return;
            }
            return waitsForPromise({
              shouldReject: true
            }, function() {
              var cb, language, oldSpawn, options, p;
              language = "PHP";
              options = {
                fixers: "",
                levels: ""
              };
              cb = function(v) {
                expect(v).not.toBe(null);
                expect(v instanceof Error).toBe(true, "Expected '" + v + "' to be instance of Error");
                expect(v.code).toBe("CommandNotFound", "Expected to be CommandNotFound");
                expect(v.file).toBe(failingProgram);
                return v;
              };
              beautifier.which = function(exe, options) {
                if (exe == null) {
                  return beautifier.Promise.resolve(null);
                }
                if (exe === failingProgram) {
                  return beautifier.Promise.resolve(failingProgram);
                } else {
                  return beautifier.Promise.resolve("/" + exe);
                }
              };
              oldSpawn = beautifier.spawn.bind(beautifier);
              beautifier.spawn = function(exe, args, options) {
                var er;
                if (exe === failingProgram) {
                  er = new Error('ENOENT');
                  er.code = 'ENOENT';
                  return beautifier.Promise.reject(er);
                } else {
                  return beautifier.Promise.resolve({
                    returnCode: 0,
                    stdout: 'stdout',
                    stderr: ''
                  });
                }
              };
              p = beautifier.beautify(text, language, options);
              expect(p).not.toBe(null);
              expect(p instanceof beautifier.Promise).toBe(true);
              p.then(cb, cb);
              return p;
            });
          });
        };
        return failWhichProgram('php-cs-fixer');
      };
      if (!isWindows) {
        describe("Mac/Linux", function() {
          beforeEach(function() {
            return beautifier.isWindows = false;
          });
          return OSSpecificSpecs();
        });
      }
      return describe("Windows", function() {
        beforeEach(function() {
          return beautifier.isWindows = true;
        });
        return OSSpecificSpecs();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3BlYy9iZWF1dGlmaWVyLXBocC1jcy1maXhlci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxpQ0FBUjs7RUFDYixVQUFBLEdBQWEsT0FBQSxDQUFRLCtCQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFRUCxTQUFBLEdBQVksT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBcEIsSUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0IsUUFEWixJQUVWLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBWixLQUFzQjs7RUFFeEIsUUFBQSxDQUFTLHlCQUFULEVBQW9DLFNBQUE7SUFFbEMsVUFBQSxDQUFXLFNBQUE7YUFHVCxlQUFBLENBQWdCLFNBQUE7QUFDZCxZQUFBO1FBQUEsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCO1FBRXBCLElBQUEsR0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGVBQS9CO1FBQ1AsSUFBSSxDQUFDLFdBQUwsQ0FBQTtBQUlBLGVBQU87TUFSTyxDQUFoQjtJQUhTLENBQVg7V0FhQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTtBQUUvQixVQUFBO01BQUEsVUFBQSxHQUFhO01BRWIsVUFBQSxDQUFXLFNBQUE7ZUFDVCxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBO01BRFIsQ0FBWDtNQUlBLGVBQUEsR0FBa0IsU0FBQTtBQUNoQixZQUFBO1FBQUEsSUFBQSxHQUFPO1FBRVAsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUE7VUFDckQsTUFBQSxDQUFPLFVBQVAsQ0FBa0IsQ0FBQyxHQUFHLENBQUMsSUFBdkIsQ0FBNEIsSUFBNUI7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QUVULFVBQVUsQ0FBQyxTQUFYLEdBQXVCO1VBRmQsQ0FBWDtpQkFJRyxlQUFILENBQUE7UUFOb0IsQ0FBdEIsRUFERjs7YUFTQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBO1FBRWxCLFVBQUEsQ0FBVyxTQUFBO2lCQUVULFVBQVUsQ0FBQyxTQUFYLEdBQXVCO1FBRmQsQ0FBWDtlQUlHLGVBQUgsQ0FBQTtNQU5rQixDQUFwQjtJQTVHK0IsQ0FBakM7RUFma0MsQ0FBcEM7QUFkQSIsInNvdXJjZXNDb250ZW50IjpbIlBIUENTRml4ZXIgPSByZXF1aXJlIFwiLi4vc3JjL2JlYXV0aWZpZXJzL3BocC1jcy1maXhlclwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSBcIi4uL3NyYy9iZWF1dGlmaWVycy9iZWF1dGlmaWVyXCJcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG4jIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbiNcbiMgVG8gcnVuIGEgc3BlY2lmaWMgYGl0YCBvciBgZGVzY3JpYmVgIGJsb2NrIGFkZCBhbiBgZmAgdG8gdGhlIGZyb250IChlLmcuIGBmaXRgXG4jIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbiMgQ2hlY2sgaWYgV2luZG93c1xuaXNXaW5kb3dzID0gcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIG9yXG4gIHByb2Nlc3MuZW52Lk9TVFlQRSBpcyAnY3lnd2luJyBvclxuICBwcm9jZXNzLmVudi5PU1RZUEUgaXMgJ21zeXMnXG5cbmRlc2NyaWJlIFwiUEhQLUNTLUZpeGVyIEJlYXV0aWZpZXJcIiwgLT5cblxuICBiZWZvcmVFYWNoIC0+XG5cbiAgICAjIEFjdGl2YXRlIHBhY2thZ2VcbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2F0b20tYmVhdXRpZnknKVxuICAgICAgIyBGb3JjZSBhY3RpdmF0ZSBwYWNrYWdlXG4gICAgICBwYWNrID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKFwiYXRvbS1iZWF1dGlmeVwiKVxuICAgICAgcGFjay5hY3RpdmF0ZU5vdygpXG4gICAgICAjIENoYW5nZSBsb2dnZXIgbGV2ZWxcbiAgICAgICMgYXRvbS5jb25maWcuc2V0KCdhdG9tLWJlYXV0aWZ5Ll9sb2dnZXJMZXZlbCcsICd2ZXJib3NlJylcbiAgICAgICMgUmV0dXJuIHByb21pc2VcbiAgICAgIHJldHVybiBhY3RpdmF0aW9uUHJvbWlzZVxuXG4gIGRlc2NyaWJlIFwiQmVhdXRpZmllcjo6YmVhdXRpZnlcIiwgLT5cblxuICAgIGJlYXV0aWZpZXIgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBiZWF1dGlmaWVyID0gbmV3IFBIUENTRml4ZXIoKVxuICAgICAgIyBjb25zb2xlLmxvZygnbmV3IGJlYXV0aWZpZXInKVxuXG4gICAgT1NTcGVjaWZpY1NwZWNzID0gLT5cbiAgICAgIHRleHQgPSBcIjw/cGhwIGVjaG8gXFxcInRlc3RcXFwiOyA/PlwiXG5cbiAgICAgIGl0IFwic2hvdWxkIGVycm9yIHdoZW4gYmVhdXRpZmllcidzIHByb2dyYW0gbm90IGZvdW5kXCIsIC0+XG4gICAgICAgIGV4cGVjdChiZWF1dGlmaWVyKS5ub3QudG9CZShudWxsKVxuICAgICAgICBleHBlY3QoYmVhdXRpZmllciBpbnN0YW5jZW9mIEJlYXV0aWZpZXIpLnRvQmUodHJ1ZSlcblxuICAgICAgICB3YWl0c0ZvclByb21pc2Ugc2hvdWxkUmVqZWN0OiB0cnVlLCAtPlxuICAgICAgICAgIGxhbmd1YWdlID0gXCJQSFBcIlxuICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBmaXhlcnM6IFwiXCJcbiAgICAgICAgICAgIGxldmVsczogXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgICAjIE1vY2sgc3Bhd25cbiAgICAgICAgICBiZWF1dGlmaWVyLnNwYXduID0gKGV4ZSwgYXJncywgb3B0aW9ucykgLT5cbiAgICAgICAgICAgICMgY29uc29sZS5sb2coJ3NwYXduJywgZXhlLCBhcmdzLCBvcHRpb25zKVxuICAgICAgICAgICAgZXIgPSBuZXcgRXJyb3IoJ0VOT0VOVCcpXG4gICAgICAgICAgICBlci5jb2RlID0gJ0VOT0VOVCdcbiAgICAgICAgICAgIHJldHVybiBiZWF1dGlmaWVyLlByb21pc2UucmVqZWN0KGVyKVxuICAgICAgICAgICMgQmVhdXRpZnlcbiAgICAgICAgICBwID0gYmVhdXRpZmllci5iZWF1dGlmeSh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucylcbiAgICAgICAgICBleHBlY3QocCkubm90LnRvQmUobnVsbClcbiAgICAgICAgICBleHBlY3QocCBpbnN0YW5jZW9mIGJlYXV0aWZpZXIuUHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgICAgIGNiID0gKHYpIC0+XG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nKHYpXG4gICAgICAgICAgICBleHBlY3Qodikubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgIGV4cGVjdCh2IGluc3RhbmNlb2YgRXJyb3IpLnRvQmUodHJ1ZSwgXFxcbiAgICAgICAgICAgICAgXCJFeHBlY3RlZCAnI3t2fScgdG8gYmUgaW5zdGFuY2Ugb2YgRXJyb3JcIilcbiAgICAgICAgICAgIGV4cGVjdCh2LmNvZGUpLnRvQmUoXCJDb21tYW5kTm90Rm91bmRcIiwgXFxcbiAgICAgICAgICAgICAgXCJFeHBlY3RlZCB0byBiZSBDb21tYW5kTm90Rm91bmRcIilcbiAgICAgICAgICAgIHJldHVybiB2XG4gICAgICAgICAgcC50aGVuKGNiLCBjYilcbiAgICAgICAgICByZXR1cm4gcFxuXG4gICAgICBmYWlsV2hpY2hQcm9ncmFtID0gKGZhaWxpbmdQcm9ncmFtKSAtPlxuICAgICAgICBpdCBcInNob3VsZCBlcnJvciB3aGVuICcje2ZhaWxpbmdQcm9ncmFtfScgbm90IGZvdW5kXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGJlYXV0aWZpZXIpLm5vdC50b0JlKG51bGwpXG4gICAgICAgICAgZXhwZWN0KGJlYXV0aWZpZXIgaW5zdGFuY2VvZiBCZWF1dGlmaWVyKS50b0JlKHRydWUpXG5cbiAgICAgICAgICBpZiBub3QgYmVhdXRpZmllci5pc1dpbmRvd3MgYW5kIGZhaWxpbmdQcm9ncmFtIGlzIFwicGhwXCJcbiAgICAgICAgICAgICMgT25seSBhcHBsaWNhYmxlIG9uIFdpbmRvd3NcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIHNob3VsZFJlamVjdDogdHJ1ZSwgLT5cbiAgICAgICAgICAgIGxhbmd1YWdlID0gXCJQSFBcIlxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgZml4ZXJzOiBcIlwiXG4gICAgICAgICAgICAgIGxldmVsczogXCJcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2IgPSAodikgLT5cbiAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZygnY2IgdmFsdWUnLCB2KVxuICAgICAgICAgICAgICBleHBlY3Qodikubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgICAgZXhwZWN0KHYgaW5zdGFuY2VvZiBFcnJvcikudG9CZSh0cnVlLCBcXFxuICAgICAgICAgICAgICAgIFwiRXhwZWN0ZWQgJyN7dn0nIHRvIGJlIGluc3RhbmNlIG9mIEVycm9yXCIpXG4gICAgICAgICAgICAgIGV4cGVjdCh2LmNvZGUpLnRvQmUoXCJDb21tYW5kTm90Rm91bmRcIiwgXFxcbiAgICAgICAgICAgICAgICBcIkV4cGVjdGVkIHRvIGJlIENvbW1hbmROb3RGb3VuZFwiKVxuICAgICAgICAgICAgICBleHBlY3Qodi5maWxlKS50b0JlKGZhaWxpbmdQcm9ncmFtKVxuICAgICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICAgICAgIyB3aGljaCA9IGJlYXV0aWZpZXIud2hpY2guYmluZChiZWF1dGlmaWVyKVxuICAgICAgICAgICAgYmVhdXRpZmllci53aGljaCA9IChleGUsIG9wdGlvbnMpIC0+XG4gICAgICAgICAgICAgIHJldHVybiBiZWF1dGlmaWVyLlByb21pc2UucmVzb2x2ZShudWxsKSBcXFxuICAgICAgICAgICAgICAgIGlmIG5vdCBleGU/XG4gICAgICAgICAgICAgIGlmIGV4ZSBpcyBmYWlsaW5nUHJvZ3JhbVxuICAgICAgICAgICAgICAgIGJlYXV0aWZpZXIuUHJvbWlzZS5yZXNvbHZlKGZhaWxpbmdQcm9ncmFtKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgIyB3aGljaChleGUsIG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgIyBjb25zb2xlLmxvZygnZmFrZSBleGUgcGF0aCcsIGV4ZSlcbiAgICAgICAgICAgICAgICBiZWF1dGlmaWVyLlByb21pc2UucmVzb2x2ZShcIi8je2V4ZX1cIilcblxuICAgICAgICAgICAgb2xkU3Bhd24gPSBiZWF1dGlmaWVyLnNwYXduLmJpbmQoYmVhdXRpZmllcilcbiAgICAgICAgICAgIGJlYXV0aWZpZXIuc3Bhd24gPSAoZXhlLCBhcmdzLCBvcHRpb25zKSAtPlxuICAgICAgICAgICAgICAjIGNvbnNvbGUubG9nKCdzcGF3bicsIGV4ZSwgYXJncywgb3B0aW9ucylcbiAgICAgICAgICAgICAgaWYgZXhlIGlzIGZhaWxpbmdQcm9ncmFtXG4gICAgICAgICAgICAgICAgZXIgPSBuZXcgRXJyb3IoJ0VOT0VOVCcpXG4gICAgICAgICAgICAgICAgZXIuY29kZSA9ICdFTk9FTlQnXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZpZXIuUHJvbWlzZS5yZWplY3QoZXIpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gYmVhdXRpZmllci5Qcm9taXNlLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgcmV0dXJuQ29kZTogMCxcbiAgICAgICAgICAgICAgICAgIHN0ZG91dDogJ3N0ZG91dCcsXG4gICAgICAgICAgICAgICAgICBzdGRlcnI6ICcnXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgcCA9IGJlYXV0aWZpZXIuYmVhdXRpZnkodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpXG4gICAgICAgICAgICBleHBlY3QocCkubm90LnRvQmUobnVsbClcbiAgICAgICAgICAgIGV4cGVjdChwIGluc3RhbmNlb2YgYmVhdXRpZmllci5Qcm9taXNlKS50b0JlKHRydWUpXG4gICAgICAgICAgICBwLnRoZW4oY2IsIGNiKVxuICAgICAgICAgICAgcmV0dXJuIHBcblxuICAgICAgIyBmYWlsV2hpY2hQcm9ncmFtKCdwaHAnKVxuICAgICAgZmFpbFdoaWNoUHJvZ3JhbSgncGhwLWNzLWZpeGVyJylcblxuICAgIHVubGVzcyBpc1dpbmRvd3NcbiAgICAgIGRlc2NyaWJlIFwiTWFjL0xpbnV4XCIsIC0+XG5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgICMgY29uc29sZS5sb2coJ21hYy9saW54JylcbiAgICAgICAgICBiZWF1dGlmaWVyLmlzV2luZG93cyA9IGZhbHNlXG5cbiAgICAgICAgZG8gT1NTcGVjaWZpY1NwZWNzXG5cbiAgICBkZXNjcmliZSBcIldpbmRvd3NcIiwgLT5cblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAjIGNvbnNvbGUubG9nKCd3aW5kb3dzJylcbiAgICAgICAgYmVhdXRpZmllci5pc1dpbmRvd3MgPSB0cnVlXG5cbiAgICAgIGRvIE9TU3BlY2lmaWNTcGVjc1xuIl19
