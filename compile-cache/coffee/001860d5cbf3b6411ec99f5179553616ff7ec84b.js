(function() {
  module.exports = {
    parse: (function(_this) {
      return function(cp) {
        var author, authors, cp_object, cp_references, editor, editors, i, j, k, len, len1, len2, na, ref, ref1, ref2, tags;
        if (!Array.isArray(cp)) {
          cp = [cp];
        }
        cp_references = [];
        for (i = 0, len = cp.length; i < len; i++) {
          ref = cp[i];
          cp_object = {};
          cp_object.citationKey = ref.id;
          cp_object.entryType = ref.type;
          tags = {};
          tags.title = ref.title;
          if (ref.author != null) {
            authors = [];
            ref1 = ref.author;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              author = ref1[j];
              na = {};
              if (author.literal != null) {
                na.familyName = author.literal;
                na.personalName = '';
              } else {
                na.familyName = author.family;
                na.personalName = author.given;
              }
              authors = authors.concat(na);
            }
            tags.authors = authors;
          }
          if (ref.editor != null) {
            editors = [];
            ref2 = ref.editor;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              editor = ref2[k];
              na = {};
              na.familyName = editor.family;
              na.personalName = editor.given;
              editors = editors.concat(na);
            }
            tags.editors = editors;
          }
          tags.type = ref.type;
          tags["in"] = '';
          if (ref['container-title'] != null) {
            tags["in"] = ref['container-title'];
          }
          if (ref.volume != null) {
            tags["in"] += " vol. " + ref.volume;
          }
          if (ref.DOI != null) {
            tags.url = "http://dx.doi.org/" + ref.DOI;
          } else if (ref.URL) {
            tags.url = ref.URL;
          }
          cp_object.entryTags = tags;
          cp_references = cp_references.concat(cp_object);
        }
        return cp_references;
      };
    })(this)
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1iaWJ0ZXgvbGliL2NpdGVwcm9jLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxLQUFBLEVBQU8sQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLEVBQUQ7QUFDTCxZQUFBO1FBQUEsSUFBRyxDQUFJLEtBQUssQ0FBQyxPQUFOLENBQWMsRUFBZCxDQUFQO1VBQ0UsRUFBQSxHQUFLLENBQUMsRUFBRCxFQURQOztRQUdBLGFBQUEsR0FBZ0I7QUFDaEIsYUFBQSxvQ0FBQTs7VUFDRSxTQUFBLEdBQVk7VUFDWixTQUFTLENBQUMsV0FBVixHQUF3QixHQUFHLENBQUM7VUFDNUIsU0FBUyxDQUFDLFNBQVYsR0FBc0IsR0FBRyxDQUFDO1VBQzFCLElBQUEsR0FBTztVQUVQLElBQUksQ0FBQyxLQUFMLEdBQWEsR0FBRyxDQUFDO1VBRWpCLElBQUcsa0JBQUg7WUFDRSxPQUFBLEdBQVU7QUFDVjtBQUFBLGlCQUFBLHdDQUFBOztjQUNFLEVBQUEsR0FBSztjQUNMLElBQUcsc0JBQUg7Z0JBQ0UsRUFBRSxDQUFDLFVBQUgsR0FBZ0IsTUFBTSxDQUFDO2dCQUN2QixFQUFFLENBQUMsWUFBSCxHQUFrQixHQUZwQjtlQUFBLE1BQUE7Z0JBSUUsRUFBRSxDQUFDLFVBQUgsR0FBZ0IsTUFBTSxDQUFDO2dCQUN2QixFQUFFLENBQUMsWUFBSCxHQUFrQixNQUFNLENBQUMsTUFMM0I7O2NBTUEsT0FBQSxHQUFVLE9BQU8sQ0FBQyxNQUFSLENBQWUsRUFBZjtBQVJaO1lBU0EsSUFBSSxDQUFDLE9BQUwsR0FBZSxRQVhqQjs7VUFhQSxJQUFHLGtCQUFIO1lBQ0UsT0FBQSxHQUFVO0FBQ1Y7QUFBQSxpQkFBQSx3Q0FBQTs7Y0FDRSxFQUFBLEdBQUs7Y0FDTCxFQUFFLENBQUMsVUFBSCxHQUFnQixNQUFNLENBQUM7Y0FDdkIsRUFBRSxDQUFDLFlBQUgsR0FBa0IsTUFBTSxDQUFDO2NBQ3pCLE9BQUEsR0FBVSxPQUFPLENBQUMsTUFBUixDQUFlLEVBQWY7QUFKWjtZQUtBLElBQUksQ0FBQyxPQUFMLEdBQWUsUUFQakI7O1VBU0EsSUFBSSxDQUFDLElBQUwsR0FBWSxHQUFHLENBQUM7VUFFaEIsSUFBSSxFQUFDLEVBQUQsRUFBSixHQUFVO1VBQ1YsSUFBRyw4QkFBSDtZQUNFLElBQUksRUFBQyxFQUFELEVBQUosR0FBVSxHQUFJLENBQUEsaUJBQUEsRUFEaEI7O1VBRUEsSUFBRyxrQkFBSDtZQUNFLElBQUksRUFBQyxFQUFELEVBQUosSUFBVyxRQUFBLEdBQVcsR0FBRyxDQUFDLE9BRDVCOztVQUdBLElBQUcsZUFBSDtZQUNFLElBQUksQ0FBQyxHQUFMLEdBQVcsb0JBQUEsR0FBdUIsR0FBRyxDQUFDLElBRHhDO1dBQUEsTUFFSyxJQUFHLEdBQUcsQ0FBQyxHQUFQO1lBQ0gsSUFBSSxDQUFDLEdBQUwsR0FBVyxHQUFHLENBQUMsSUFEWjs7VUFHTCxTQUFTLENBQUMsU0FBVixHQUFzQjtVQUN0QixhQUFBLEdBQWdCLGFBQWEsQ0FBQyxNQUFkLENBQXFCLFNBQXJCO0FBNUNsQjtBQTZDQSxlQUFPO01BbERGO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFQOztBQUZGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuXG4gIHBhcnNlOiAoY3ApID0+XG4gICAgaWYgbm90IEFycmF5LmlzQXJyYXkoY3ApXG4gICAgICBjcCA9IFtjcF1cbiAgICAjIENvbnZlcnQgY2l0ZXByb2MgdG8gaW50ZXJuYWwgZm9ybWF0XG4gICAgY3BfcmVmZXJlbmNlcyA9IFtdXG4gICAgZm9yIHJlZiBpbiBjcFxuICAgICAgY3Bfb2JqZWN0ID0ge31cbiAgICAgIGNwX29iamVjdC5jaXRhdGlvbktleSA9IHJlZi5pZFxuICAgICAgY3Bfb2JqZWN0LmVudHJ5VHlwZSA9IHJlZi50eXBlXG4gICAgICB0YWdzID0ge31cbiAgICAgICMgVGl0bGVcbiAgICAgIHRhZ3MudGl0bGUgPSByZWYudGl0bGVcbiAgICAgICMgQXV0aG9yc1xuICAgICAgaWYgcmVmLmF1dGhvcj9cbiAgICAgICAgYXV0aG9ycyA9IFtdXG4gICAgICAgIGZvciBhdXRob3IgaW4gcmVmLmF1dGhvclxuICAgICAgICAgIG5hID0ge31cbiAgICAgICAgICBpZiBhdXRob3IubGl0ZXJhbD9cbiAgICAgICAgICAgIG5hLmZhbWlseU5hbWUgPSBhdXRob3IubGl0ZXJhbFxuICAgICAgICAgICAgbmEucGVyc29uYWxOYW1lID0gJydcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBuYS5mYW1pbHlOYW1lID0gYXV0aG9yLmZhbWlseVxuICAgICAgICAgICAgbmEucGVyc29uYWxOYW1lID0gYXV0aG9yLmdpdmVuXG4gICAgICAgICAgYXV0aG9ycyA9IGF1dGhvcnMuY29uY2F0IG5hXG4gICAgICAgIHRhZ3MuYXV0aG9ycyA9IGF1dGhvcnNcbiAgICAgICMgRWRpdG9yc1xuICAgICAgaWYgcmVmLmVkaXRvcj9cbiAgICAgICAgZWRpdG9ycyA9IFtdXG4gICAgICAgIGZvciBlZGl0b3IgaW4gcmVmLmVkaXRvclxuICAgICAgICAgIG5hID0ge31cbiAgICAgICAgICBuYS5mYW1pbHlOYW1lID0gZWRpdG9yLmZhbWlseVxuICAgICAgICAgIG5hLnBlcnNvbmFsTmFtZSA9IGVkaXRvci5naXZlblxuICAgICAgICAgIGVkaXRvcnMgPSBlZGl0b3JzLmNvbmNhdCBuYVxuICAgICAgICB0YWdzLmVkaXRvcnMgPSBlZGl0b3JzXG4gICAgICAjIEVudHJ5IHR5cGVcbiAgICAgIHRhZ3MudHlwZSA9IHJlZi50eXBlXG4gICAgICAjIENvbnRhaW5lciB0aXRsZVxuICAgICAgdGFncy5pbiA9ICcnXG4gICAgICBpZiByZWZbJ2NvbnRhaW5lci10aXRsZSddP1xuICAgICAgICB0YWdzLmluID0gcmVmWydjb250YWluZXItdGl0bGUnXVxuICAgICAgaWYgcmVmLnZvbHVtZT9cbiAgICAgICAgdGFncy5pbiArPSBcIiB2b2wuIFwiICsgcmVmLnZvbHVtZVxuICAgICAgIyBVUkwgP1xuICAgICAgaWYgcmVmLkRPST9cbiAgICAgICAgdGFncy51cmwgPSBcImh0dHA6Ly9keC5kb2kub3JnL1wiICsgcmVmLkRPSVxuICAgICAgZWxzZSBpZiByZWYuVVJMXG4gICAgICAgIHRhZ3MudXJsID0gcmVmLlVSTFxuICAgICAgIyBBc3NpZ24gdGFnc1xuICAgICAgY3Bfb2JqZWN0LmVudHJ5VGFncyA9IHRhZ3NcbiAgICAgIGNwX3JlZmVyZW5jZXMgPSBjcF9yZWZlcmVuY2VzLmNvbmNhdCBjcF9vYmplY3RcbiAgICByZXR1cm4gY3BfcmVmZXJlbmNlc1xuIl19
