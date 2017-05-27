(function() {
  var CompositeDisposable, RefView, ReferenceProvider, fs;

  fs = require("fs");

  CompositeDisposable = require('atom').CompositeDisposable;

  ReferenceProvider = require("./provider");

  RefView = require('./ref-view');

  module.exports = {
    config: {
      bibtex: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      scope: {
        type: 'string',
        "default": '.source.gfm,.text.md'
      },
      ignoreScope: {
        type: 'string',
        "default": '.comment'
      },
      resultTemplate: {
        type: 'string',
        "default": '@[key]'
      }
    },
    activate: function(state) {
      var bibtexFiles, file, i, len, reload, stats;
      reload = false;
      if (state) {
        bibtexFiles = atom.config.get("autocomplete-bibtex.bibtex");
        this.stateTime = state.saveTime;
        if (!Array.isArray(bibtexFiles)) {
          bibtexFiles = [bibtexFiles];
        }
        for (i = 0, len = bibtexFiles.length; i < len; i++) {
          file = bibtexFiles[i];
          stats = fs.statSync(file);
          if (stats.isFile()) {
            if (state.saveTime < stats.mtime.getTime()) {
              reload = true;
              this.stateTime = new Date().getTime();
            }
          }
        }
      }
      if (state && reload === false) {
        this.referenceProvider = atom.deserializers.deserialize(state.provider);
        if (!this.referenceProvider) {
          this.referenceProvider = new ReferenceProvider();
        }
      } else {
        this.referenceProvider = new ReferenceProvider();
      }
      this.provider = this.referenceProvider.provider;
      this.refView = new RefView(this.referenceProvider.bibtex);
      this.commands = new CompositeDisposable();
      return this.commands.add(atom.commands.add('atom-workspace', {
        'bibliography:search': (function(_this) {
          return function() {
            return _this.showSearch();
          };
        })(this),
        'bibliography:reload': (function(_this) {
          return function() {
            return _this.forceReload();
          };
        })(this)
      }));
    },
    showSearch: function() {
      this.refView.populateList();
      return this.refView.show();
    },
    forceReload: function() {
      this.referenceProvider = new ReferenceProvider();
      this.provider = this.referenceProvider.provider;
      this.refView = new RefView(this.referenceProvider.bibtex);
      this.commands = new CompositeDisposable();
      return this.commands.add(atom.commands.add('atom-workspace', {
        'bibliography:search': (function(_this) {
          return function() {
            return _this.showSearch();
          };
        })(this),
        'bibliography:reload': (function(_this) {
          return function() {
            return _this.forceReload();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.provider.registration.dispose();
      return this.commands.dispose();
    },
    serialize: function() {
      var state;
      state = {
        provider: this.referenceProvider.serialize(),
        saveTime: new Date().getTime()
      };
      return state;
    },
    provide: function() {
      return this.provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1iaWJ0ZXgvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0osc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixpQkFBQSxHQUFvQixPQUFBLENBQVEsWUFBUjs7RUFDcEIsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtRQUVBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBSEY7T0FERjtNQUtBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxzQkFEVDtPQU5GO01BUUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFVBRFQ7T0FURjtNQVdBLGNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxRQURUO09BWkY7S0FERjtJQWdCQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFBLE1BQUEsR0FBUztNQUNULElBQUcsS0FBSDtRQUNFLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCO1FBRWQsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUFLLENBQUM7UUFDbkIsSUFBRyxDQUFJLEtBQUssQ0FBQyxPQUFOLENBQWMsV0FBZCxDQUFQO1VBQ0UsV0FBQSxHQUFjLENBQUMsV0FBRCxFQURoQjs7QUFHQSxhQUFBLDZDQUFBOztV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QW5CLENBQUEsQ0FESjtRQUVOLFFBQUEsRUFBYyxJQUFBLElBQUEsQ0FBQSxDQUFNLENBQUMsT0FBUCxDQUFBLENBRlI7O0FBSVIsYUFBTztJQUxFLENBOUVYO0lBc0ZBLE9BQUEsRUFBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBO0lBRE0sQ0F0RlQ7O0FBUEYiLCJzb3VyY2VzQ29udGVudCI6WyJmcyA9IHJlcXVpcmUgXCJmc1wiXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5SZWZlcmVuY2VQcm92aWRlciA9IHJlcXVpcmUgXCIuL3Byb3ZpZGVyXCJcblJlZlZpZXcgPSByZXF1aXJlICcuL3JlZi12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBiaWJ0ZXg6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgc2NvcGU6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJy5zb3VyY2UuZ2ZtLC50ZXh0Lm1kJ1xuICAgIGlnbm9yZVNjb3BlOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcuY29tbWVudCdcbiAgICByZXN1bHRUZW1wbGF0ZTpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnQFtrZXldJ1xuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgcmVsb2FkID0gZmFsc2VcbiAgICBpZiBzdGF0ZVxuICAgICAgYmlidGV4RmlsZXMgPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtYmlidGV4LmJpYnRleFwiXG4gICAgICAjIHdlIHdhbnQgdG8gcmVtZW1iZXIgdGhlIGFjdHVhbCBzdGF0ZVRpbWVcbiAgICAgIEBzdGF0ZVRpbWUgPSBzdGF0ZS5zYXZlVGltZVxuICAgICAgaWYgbm90IEFycmF5LmlzQXJyYXkoYmlidGV4RmlsZXMpXG4gICAgICAgIGJpYnRleEZpbGVzID0gW2JpYnRleEZpbGVzXVxuICAgICAgIyByZWxvYWQgZXZlcnl0aGluZyBpZiBhbnkgZmlsZXMgY2hhbmdlZFxuICAgICAgZm9yIGZpbGUgaW4gYmlidGV4RmlsZXNcbiAgICAgICAgc3RhdHMgPSBmcy5zdGF0U3luYyhmaWxlKVxuICAgICAgICBpZiBzdGF0cy5pc0ZpbGUoKVxuICAgICAgICAgIGlmIHN0YXRlLnNhdmVUaW1lIDwgc3RhdHMubXRpbWUuZ2V0VGltZSgpXG4gICAgICAgICAgICByZWxvYWQgPSB0cnVlXG4gICAgICAgICAgICBAc3RhdGVUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKClcblxuICAgICMgTmVlZCB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIHRoZSBBdXRvY29tcGxldGUgcHJvdmlkZXIgYW5kIHRoZVxuICAgICMgY29udGFpbmluZyBjbGFzcyAod2hpY2ggaG9sZHMgdGhlIHNlcmlhbGl6ZSBmbilcbiAgICBpZiBzdGF0ZSBhbmQgcmVsb2FkIGlzIGZhbHNlXG4gICAgICBAcmVmZXJlbmNlUHJvdmlkZXIgPSBhdG9tLmRlc2VyaWFsaXplcnMuZGVzZXJpYWxpemUoc3RhdGUucHJvdmlkZXIpXG4gICAgICAjZGVzZXJpYWxpemVyIHByb2R1Y2VzIFwidW5kZWZpbmVkXCIgaWYgaXQgZmFpbHMsIHNvIGRvdWJsZSBjaGVja1xuICAgICAgaWYgbm90IEByZWZlcmVuY2VQcm92aWRlclxuICAgICAgICBAcmVmZXJlbmNlUHJvdmlkZXIgPSBuZXcgUmVmZXJlbmNlUHJvdmlkZXIoKVxuICAgIGVsc2VcbiAgICAgIEByZWZlcmVuY2VQcm92aWRlciA9IG5ldyBSZWZlcmVuY2VQcm92aWRlcigpXG5cbiAgICBAcHJvdmlkZXIgPSBAcmVmZXJlbmNlUHJvdmlkZXIucHJvdmlkZXJcblxuICAgICMgQGJpYkl0ZW1zID0gQHJlZmVyZW5jZVByb3ZpZGVyLnBvc3NpYmxlV29yZHNcblxuICAgIEByZWZWaWV3ID0gbmV3IFJlZlZpZXcoQHJlZmVyZW5jZVByb3ZpZGVyLmJpYnRleClcblxuICAgIEBjb21tYW5kcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgICMgVE9ETyBmaWd1cmUgb3V0IGhvdyB0byBzaG93L2hpZGUgY29tbWFuZHMgZm9yIGdyYW1tYXJzXG4gICAgQGNvbW1hbmRzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgICAnYmlibGlvZ3JhcGh5OnNlYXJjaCc6ID0+IEBzaG93U2VhcmNoKClcbiAgICAgICAgJ2JpYmxpb2dyYXBoeTpyZWxvYWQnOiA9PiBAZm9yY2VSZWxvYWQoKVxuXG4gIHNob3dTZWFyY2g6IC0+XG4gICAgIyBAcmVmVmlldyA9IG5ldyBSZWZWaWV3KEByZWZlcmVuY2VQcm92aWRlci5iaWJ0ZXgpXG4gICAgQHJlZlZpZXcucG9wdWxhdGVMaXN0KClcbiAgICBAcmVmVmlldy5zaG93KClcblxuICBmb3JjZVJlbG9hZDogLT5cbiAgICBAcmVmZXJlbmNlUHJvdmlkZXIgPSBuZXcgUmVmZXJlbmNlUHJvdmlkZXIoKVxuICAgIEBwcm92aWRlciA9IEByZWZlcmVuY2VQcm92aWRlci5wcm92aWRlclxuICAgIEByZWZWaWV3ID0gbmV3IFJlZlZpZXcoQHJlZmVyZW5jZVByb3ZpZGVyLmJpYnRleClcblxuXG4gICAgIyBAYmliSXRlbXMgPSBAcmVmZXJlbmNlUHJvdmlkZXIucG9zc2libGVXb3Jkc1xuICAgIEBjb21tYW5kcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgICMgVE9ETyBmaWd1cmUgb3V0IGhvdyB0byBzaG93L2hpZGUgY29tbWFuZHMgZm9yIGdyYW1tYXJzXG4gICAgQGNvbW1hbmRzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgICAnYmlibGlvZ3JhcGh5OnNlYXJjaCc6ID0+IEBzaG93U2VhcmNoKClcbiAgICAgICAgJ2JpYmxpb2dyYXBoeTpyZWxvYWQnOiA9PiBAZm9yY2VSZWxvYWQoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHByb3ZpZGVyLnJlZ2lzdHJhdGlvbi5kaXNwb3NlKClcbiAgICBAY29tbWFuZHMuZGlzcG9zZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIHN0YXRlID0ge1xuICAgICAgcHJvdmlkZXI6IEByZWZlcmVuY2VQcm92aWRlci5zZXJpYWxpemUoKVxuICAgICAgc2F2ZVRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgfVxuICAgIHJldHVybiBzdGF0ZVxuXG5cbiAgcHJvdmlkZTogLT5cbiAgICBAcHJvdmlkZXJcbiJdfQ==
