(function() {
  var WordcountView,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  module.exports = WordcountView = (function() {
    WordcountView.prototype.CSS_SELECTED_CLASS = 'wordcount-select';

    function WordcountView() {
      this.getTexts = bind(this.getTexts, this);
      this.element = document.createElement('div');
      this.element.classList.add('word-count');
      this.element.classList.add('inline-block');
      this.divWords = document.createElement('div');
      this.element.appendChild(this.divWords);
    }

    WordcountView.prototype.update_count = function(editor) {
      var charCount, chars, color, goal, green, height, i, len, percent, priceResult, ref, text, texts, wordCount, words;
      texts = this.getTexts(editor);
      wordCount = charCount = 0;
      for (i = 0, len = texts.length; i < len; i++) {
        text = texts[i];
        ref = this.count(text), words = ref[0], chars = ref[1];
        wordCount += words;
        charCount += chars;
      }
      this.divWords.innerHTML = (wordCount || 0) + " W";
      if (!atom.config.get('wordcount.hidechars')) {
        this.divWords.innerHTML += " | " + (charCount || 0) + " C";
      }
      priceResult = wordCount * atom.config.get('wordcount.wordprice');
      if (atom.config.get('wordcount.showprice')) {
        this.divWords.innerHTML += (" | " + (priceResult.toFixed(2) || 0) + " ") + atom.config.get('wordcount.currencysymbol');
      }
      if (goal = atom.config.get('wordcount.goal')) {
        if (!this.divGoal) {
          this.divGoal = document.createElement('div');
          this.divGoal.style.width = '100%';
          this.element.appendChild(this.divGoal);
        }
        green = Math.round(wordCount / goal * 100);
        if (green > 100) {
          green = 100;
        }
        color = atom.config.get('wordcount.goalColor');
        this.divGoal.style.background = '-webkit-linear-gradient(left, ' + color + ' ' + green + '%, transparent 0%)';
        percent = parseFloat(atom.config.get('wordcount.goalLineHeight')) / 100;
        height = this.element.clientHeight * percent;
        this.divGoal.style.height = height + 'px';
        return this.divGoal.style.marginTop = -height + 'px';
      }
    };

    WordcountView.prototype.getTexts = function(editor) {
      var emptySelections, i, len, range, selectionRanges, text, texts;
      texts = [];
      selectionRanges = editor.getSelectedBufferRanges();
      emptySelections = true;
      for (i = 0, len = selectionRanges.length; i < len; i++) {
        range = selectionRanges[i];
        text = editor.getTextInBufferRange(range);
        if (text) {
          texts.push(text);
          emptySelections = false;
        }
      }
      if (emptySelections) {
        texts.push(editor.getText());
        this.element.classList.remove(this.CSS_SELECTED_CLASS);
      } else {
        this.element.classList.add(this.CSS_SELECTED_CLASS);
      }
      return texts;
    };

    WordcountView.prototype.count = function(text) {
      var chars, codePatterns, i, len, pattern, ref, words;
      if (atom.config.get('wordcount.ignorecode')) {
        codePatterns = [/`{3}(.|\s)*?(`{3}|$)/g, /[ ]{4}.*?$/gm];
        for (i = 0, len = codePatterns.length; i < len; i++) {
          pattern = codePatterns[i];
          text = text != null ? text.replace(pattern, '') : void 0;
        }
      }
      words = text != null ? (ref = text.match(/\S+/g)) != null ? ref.length : void 0 : void 0;
      text = text != null ? text.replace('\n', '') : void 0;
      text = text != null ? text.replace('\r', '') : void 0;
      chars = text != null ? text.length : void 0;
      return [words, chars];
    };

    return WordcountView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3dvcmRjb3VudC9saWIvd29yZGNvdW50LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQSxhQUFBO0lBQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTs0QkFDSixrQkFBQSxHQUFvQjs7SUFFUCx1QkFBQTs7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO01BQ1gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsWUFBdkI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixjQUF2QjtNQUVBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7TUFFWixJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsSUFBQyxDQUFBLFFBQXRCO0lBUFc7OzRCQVViLFlBQUEsR0FBYyxTQUFDLE1BQUQ7QUFDWixVQUFBO01BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxRQUFELENBQVUsTUFBVjtNQUNSLFNBQUEsR0FBWSxTQUFBLEdBQVk7QUFDeEIsV0FBQSx1Q0FBQTs7UUFDRSxNQUFpQixJQUFDLENBQUEsS0FBRCxDQUFPLElBQVAsQ0FBakIsRUFBQyxjQUFELEVBQVE7UUFDUixTQUFBLElBQWE7UUFDYixTQUFBLElBQWE7QUFIZjtNQUlBLElBQUMsQ0FBQSxRQUFRLENBQUMsU0FBVixHQUF3QixDQUFDLFNBQUEsSUFBYSxDQUFkLENBQUEsR0FBZ0I7TUFDeEMsSUFBQSxDQUF5RCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBQXpEO1FBQUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxTQUFWLElBQXdCLEtBQUEsR0FBSyxDQUFDLFNBQUEsSUFBYSxDQUFkLENB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TixDQUFjLElBQWQsRUFBb0IsRUFBcEI7TUFDUCxJQUFBLGtCQUFPLElBQUksQ0FBRSxPQUFOLENBQWMsSUFBZCxFQUFvQixFQUFwQjtNQUNQLEtBQUEsa0JBQVEsSUFBSSxDQUFFO2FBQ2QsQ0FBQyxLQUFELEVBQVEsS0FBUjtJQVRLOzs7OztBQTdEVCIsInNvdXJjZXNDb250ZW50IjpbIlxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgV29yZGNvdW50Vmlld1xuICBDU1NfU0VMRUNURURfQ0xBU1M6ICd3b3JkY291bnQtc2VsZWN0J1xuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCAnZGl2J1xuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3dvcmQtY291bnQnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycpXG5cbiAgICBAZGl2V29yZHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG5cbiAgICBAZWxlbWVudC5hcHBlbmRDaGlsZChAZGl2V29yZHMpXG5cblxuICB1cGRhdGVfY291bnQ6IChlZGl0b3IpIC0+XG4gICAgdGV4dHMgPSBAZ2V0VGV4dHMgZWRpdG9yXG4gICAgd29yZENvdW50ID0gY2hhckNvdW50ID0gMFxuICAgIGZvciB0ZXh0IGluIHRleHRzXG4gICAgICBbd29yZHMsIGNoYXJzXSA9IEBjb3VudCB0ZXh0XG4gICAgICB3b3JkQ291bnQgKz0gd29yZHNcbiAgICAgIGNoYXJDb3VudCArPSBjaGFyc1xuICAgIEBkaXZXb3Jkcy5pbm5lckhUTUwgPSBcIiN7d29yZENvdW50IHx8IDB9IFdcIlxuICAgIEBkaXZXb3Jkcy5pbm5lckhUTUwgKz0gKFwiIHwgI3tjaGFyQ291bnQgfHwgMH0gQ1wiKSB1bmxlc3MgYXRvbS5jb25maWcuZ2V0KCd3b3JkY291bnQuaGlkZWNoYXJzJylcbiAgICBwcmljZVJlc3VsdCA9IHdvcmRDb3VudCphdG9tLmNvbmZpZy5nZXQoJ3dvcmRjb3VudC53b3JkcHJpY2UnKVxuICAgIEBkaXZXb3Jkcy5pbm5lckhUTUwgKz0gKFwiIHwgI3twcmljZVJlc3VsdC50b0ZpeGVkKDIpIHx8IDB9IFwiKSthdG9tLmNvbmZpZy5nZXQoJ3dvcmRjb3VudC5jdXJyZW5jeXN5bWJvbCcpIGlmIGF0b20uY29uZmlnLmdldCgnd29yZGNvdW50LnNob3dwcmljZScpXG4gICAgaWYgZ29hbCA9IGF0b20uY29uZmlnLmdldCAnd29yZGNvdW50LmdvYWwnXG4gICAgICBpZiBub3QgQGRpdkdvYWxcbiAgICAgICAgQGRpdkdvYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgICAgIEBkaXZHb2FsLnN0eWxlLndpZHRoID0gJzEwMCUnXG4gICAgICAgIEBlbGVtZW50LmFwcGVuZENoaWxkIEBkaXZHb2FsXG4gICAgICBncmVlbiA9IE1hdGgucm91bmQod29yZENvdW50IC8gZ29hbCAqIDEwMClcbiAgICAgIGdyZWVuID0gMTAwIGlmIGdyZWVuID4gMTAwXG4gICAgICBjb2xvciA9IGF0b20uY29uZmlnLmdldCAnd29yZGNvdW50LmdvYWxDb2xvcidcbiAgICAgIEBkaXZHb2FsLnN0eWxlLmJhY2tncm91bmQgPSAnLXdlYmtpdC1saW5lYXItZ3JhZGllbnQobGVmdCwgJyArIGNvbG9yICsgJyAnICsgZ3JlZW4gKyAnJSwgdHJhbnNwYXJlbnQgMCUpJ1xuICAgICAgcGVyY2VudCA9IHBhcnNlRmxvYXQoYXRvbS5jb25maWcuZ2V0ICd3b3JkY291bnQuZ29hbExpbmVIZWlnaHQnKSAvIDEwMFxuICAgICAgaGVpZ2h0ID0gQGVsZW1lbnQuY2xpZW50SGVpZ2h0ICogcGVyY2VudFxuICAgICAgQGRpdkdvYWwuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4J1xuICAgICAgQGRpdkdvYWwuc3R5bGUubWFyZ2luVG9wID0gLWhlaWdodCArICdweCdcblxuICBnZXRUZXh0czogKGVkaXRvcikgPT5cbiAgICAjIE5PVEU6IEEgY3Vyc29yIGlzIGNvbnNpZGVyZWQgYW4gZW1wdHkgc2VsZWN0aW9uIHRvIHRoZSBlZGl0b3JcbiAgICB0ZXh0cyA9IFtdXG4gICAgc2VsZWN0aW9uUmFuZ2VzID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKClcbiAgICBlbXB0eVNlbGVjdGlvbnMgPSB0cnVlXG4gICAgZm9yIHJhbmdlIGluIHNlbGVjdGlvblJhbmdlc1xuICAgICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShyYW5nZSlcblxuICAgICAgIyBUZXh0IGZyb20gYnVmZmVyIG1pZ2h0IGJlIGVtcHR5IChubyBzZWxlY3Rpb24gYnV0IGEgY3Vyc29yKVxuICAgICAgaWYgdGV4dFxuICAgICAgICB0ZXh0cy5wdXNoKHRleHQpXG4gICAgICAgIGVtcHR5U2VsZWN0aW9ucyA9IGZhbHNlXG5cbiAgICAjIE5vIG9yIG9ubHkgZW1wdHkgc2VsZWN0aW9ucyB3aWxsIGNhdXNlIHRoZSBlbnRpcmUgZWRpdG9yIHRleHQgdG8gYmUgcmV0dXJuZWQgaW5zdGVhZFxuICAgIGlmIGVtcHR5U2VsZWN0aW9uc1xuICAgICAgdGV4dHMucHVzaChlZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSBAQ1NTX1NFTEVDVEVEX0NMQVNTXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCBAQ1NTX1NFTEVDVEVEX0NMQVNTXG5cbiAgICB0ZXh0c1xuXG4gIGNvdW50OiAodGV4dCkgLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3dvcmRjb3VudC5pZ25vcmVjb2RlJylcbiAgICAgIGNvZGVQYXR0ZXJucyA9IFsvYHszfSgufFxccykqPyhgezN9fCQpL2csIC9bIF17NH0uKj8kL2dtXVxuICAgICAgZm9yIHBhdHRlcm4gaW4gY29kZVBhdHRlcm5zXG4gICAgICAgIHRleHQgPSB0ZXh0Py5yZXBsYWNlIHBhdHRlcm4sICcnXG4gICAgd29yZHMgPSB0ZXh0Py5tYXRjaCgvXFxTKy9nKT8ubGVuZ3RoXG4gICAgdGV4dCA9IHRleHQ/LnJlcGxhY2UgJ1xcbicsICcnXG4gICAgdGV4dCA9IHRleHQ/LnJlcGxhY2UgJ1xccicsICcnXG4gICAgY2hhcnMgPSB0ZXh0Py5sZW5ndGhcbiAgICBbd29yZHMsIGNoYXJzXVxuIl19
