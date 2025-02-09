
/*
  lib/sub-atom.coffee
 */

(function() {
  var $, CompositeDisposable, Disposable, SubAtom, ref,
    slice = [].slice;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  $ = require('jquery');

  module.exports = SubAtom = (function() {
    function SubAtom() {
      this.disposables = new CompositeDisposable;
    }

    SubAtom.prototype.addDisposable = function(disposable, disposeEventObj, disposeEventType) {
      var autoDisposables, e;
      if (disposeEventObj) {
        try {
          autoDisposables = new CompositeDisposable;
          autoDisposables.add(disposable);
          autoDisposables.add(disposeEventObj[disposeEventType]((function(_this) {
            return function() {
              autoDisposables.dispose();
              return _this.disposables.remove(autoDisposables);
            };
          })(this)));
          this.disposables.add(autoDisposables);
          return autoDisposables;
        } catch (error) {
          e = error;
          return console.log('SubAtom::add, invalid dispose event', disposeEventObj, disposeEventType, e);
        }
      } else {
        this.disposables.add(disposable);
        return disposable;
      }
    };

    SubAtom.prototype.addElementListener = function(ele, events, selector, disposeEventObj, disposeEventType, handler) {
      var disposable, subscription;
      if (selector) {
        subscription = $(ele).on(events, selector, handler);
      } else {
        subscription = $(ele).on(events, handler);
      }
      disposable = new Disposable(function() {
        return subscription.off(events, handler);
      });
      return this.addDisposable(disposable, disposeEventObj, disposeEventType);
    };

    SubAtom.prototype.add = function() {
      var arg, args, disposeEventObj, disposeEventType, ele, events, handler, i, len, selector, signature;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      signature = '';
      for (i = 0, len = args.length; i < len; i++) {
        arg = args[i];
        switch (typeof arg) {
          case 'string':
            signature += 's';
            break;
          case 'object':
            signature += 'o';
            break;
          case 'function':
            signature += 'f';
        }
      }
      switch (signature) {
        case 'o':
        case 'oos':
          return this.addDisposable.apply(this, args);
        case 'ssf':
        case 'osf':
          ele = args[0], events = args[1], handler = args[2];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossf':
        case 'sssf':
          ele = args[0], events = args[1], selector = args[2], handler = args[3];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ososf':
        case 'ssosf':
          ele = args[0], events = args[1], disposeEventObj = args[2], disposeEventType = args[3], handler = args[4];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        case 'ossosf':
        case 'sssosf':
          ele = args[0], events = args[1], selector = args[2], disposeEventObj = args[3], disposeEventType = args[4], handler = args[5];
          return this.addElementListener(ele, events, selector, disposeEventObj, disposeEventType, handler);
        default:
          console.log('SubAtom::add, invalid call signature', args);
      }
    };

    SubAtom.prototype.remove = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.disposables).remove.apply(ref1, args);
    };

    SubAtom.prototype.clear = function() {
      return this.disposables.clear();
    };

    SubAtom.prototype.dispose = function() {
      return this.disposables.dispose();
    };

    return SubAtom;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3NpbXBsZS1kcmFnLWRyb3AtdGV4dC9ub2RlX21vZHVsZXMvc3ViLWF0b20vbGliL3N1Yi1hdG9tLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtBQUFBLE1BQUEsZ0RBQUE7SUFBQTs7RUFJQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVTLGlCQUFBO01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO0lBRFI7O3NCQUdiLGFBQUEsR0FBZSxTQUFDLFVBQUQsRUFBYSxlQUFiLEVBQThCLGdCQUE5QjtBQUNiLFVBQUE7TUFBQSxJQUFHLGVBQUg7QUFDRTtVQUNFLGVBQUEsR0FBa0IsSUFBSTtVQUN0QixlQUFlLENBQUMsR0FBaEIsQ0FBb0IsVUFBcEI7VUFDQSxlQUFlLENBQUMsR0FBaEIsQ0FBb0IsZUFBZ0IsQ0FBQSxnQkFBQSxDQUFoQixDQUFrQyxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFBO2NBQ3BELGVBQWUsQ0FBQyxPQUFoQixDQUFBO3FCQUNBLEtBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUFvQixlQUFwQjtZQUZvRDtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBcEI7VUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsZUFBakI7aUJBQ0EsZ0JBUEY7U0FBQSxhQUFBO1VBUU07aUJBQ0osT0FBTyxDQUFDLEdBQVIsQ0FBWSxxQ0FBWixFQUFtRCxlQUFuRCxFQUFvRSxnQkFBcEUsRUFBc0YsQ0FBdEYsRUFURjtTQURGO09BQUEsTUFBQTtRQVlFLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixVQUFqQjtlQUNBLFdBYkY7O0lBRGE7O3NCQWdCZixrQkFBQSxHQUFvQixTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsUUFBZCxFQUF3QixlQUF4QixFQUF5QyxnQkFBekMsRUFBMkQsT0FBM0Q7QUFDbEIsVUFBQTtNQUFBLElBQUcsUUFBSDtRQUNFLFlBQUEsR0FBZSxDQUFBLENBQUUsR0FBRixDQUFNLENBQUMsRUFBUCxDQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsT0FBNUIsRUFEakI7T0FBQSxNQUFBO1FBR0UsWUFBQSxHQUFlLENBQUEsQ0FBRSxHQUFGLENBQU0sQ0FBQyxFQUFQLENBQVUsTUFBVixFQUFrQixPQUFsQixFQUhqQjs7TUFJQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFXLFNBQUE7ZUFBRyxZQUFZLENBQUMsR0FBYixDQUFpQixNQUFqQixFQUF5QixPQUF6QjtNQUFILENBQVg7YUFDakIsSUFBQyxDQUFBLGFBQUQsQ0FBZSxVQUFmLEVBQTJCLGVBQTNCLEVBQTRDLGdCQUE1QztJQU5rQjs7c0JBUXBCLEdBQUEsR0FBSyxTQUFBO0FBQ0gsVUFBQTtNQURJO01BQ0osU0FBQSxHQUFZO0FBQ1osV0FBQSxzQ0FBQTs7QUFDRSxnQkFBTyxPQUFPLEdBQWQ7QUFBQSxlQUNPLFFBRFA7WUFDdUIsU0FBQSxJQUFhO0FBQTdCO0FBRFAsZUFFTyxRQUZQO1lBRXVCLFNBQUEsSUFBYTtBQUE3QjtBQUZQLGVBR08sVUFIUDtZQUd1QixTQUFBLElBQWE7QUFIcEM7QUFERjtBQUtBLGNBQU8sU0FBUDtBQUFBLGFBQ08sR0FEUDtBQUFBLGFBQ1ksS0FEWjtpQkFDdUIsSUFBQyxDQUFBLGFBQUQsYUFBZSxJQUFmO0FBRHZCLGFBRU8sS0FGUDtBQUFBLGFBRWMsS0FGZDtVQUdLLGFBQUQsRUFBTSxnQkFBTixFQUFjO2lCQUNkLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixHQUFwQixFQUF5QixNQUF6QixFQUFpQyxRQUFqQyxFQUEyQyxlQUEzQyxFQUE0RCxnQkFBNUQsRUFBOEUsT0FBOUU7QUFKSixhQUtPLE1BTFA7QUFBQSxhQUtlLE1BTGY7VUFNSyxhQUFELEVBQU0sZ0JBQU4sRUFBYyxrQkFBZCxFQUF3QjtpQkFDeEIsSUFBQyxDQUFBLGtCQUFELENBQW9CLEdBQXBCLEVBQXlCLE1BQXpCLEVBQWlDLFFBQWpDLEVBQTJDLGVBQTNDLEVBQTRELGdCQUE1RCxFQUE4RSxPQUE5RTtBQVBKLGFBUU8sT0FSUDtBQUFBLGFBUWdCLE9BUmhCO1VBU0ssYUFBRCxFQUFNLGdCQUFOLEVBQWMseUJBQWQsRUFBK0IsMEJBQS9CLEVBQWlEO2lCQUNqRCxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsR0FBcEIsRUFBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkMsZUFBM0MsRUFBNEQsZ0JBQTVELEVBQThFLE9BQTlFO0FBVkosYUFXTyxRQVhQO0FBQUEsYUFXaUIsUUFYakI7VUFZSyxhQUFELEVBQU0sZ0JBQU4sRUFBYyxrQkFBZCxFQUF3Qix5QkFBeEIsRUFBeUMsMEJBQXpDLEVBQTJEO2lCQUMzRCxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsR0FBcEIsRUFBeUIsTUFBekIsRUFBaUMsUUFBakMsRUFBMkMsZUFBM0MsRUFBNEQsZ0JBQTVELEVBQThFLE9BQTlFO0FBYko7VUFlSSxPQUFPLENBQUMsR0FBUixDQUFZLHNDQUFaLEVBQW9ELElBQXBEO0FBZko7SUFQRzs7c0JBeUJMLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQURPO2FBQ1AsUUFBQSxJQUFDLENBQUEsV0FBRCxDQUFZLENBQUMsTUFBYixhQUFvQixJQUFwQjtJQURNOztzQkFHUixLQUFBLEdBQU8sU0FBQTthQUNMLElBQUMsQ0FBQSxXQUFXLENBQUMsS0FBYixDQUFBO0lBREs7O3NCQUdQLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFETzs7Ozs7QUFwRVgiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiAgbGliL3N1Yi1hdG9tLmNvZmZlZVxuIyMjXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXG5tb2R1bGUuZXhwb3J0cyA9IFxuY2xhc3MgU3ViQXRvbVxuICBcbiAgY29uc3RydWN0b3I6IC0+IFxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgYWRkRGlzcG9zYWJsZTogKGRpc3Bvc2FibGUsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZSkgLT5cbiAgICBpZiBkaXNwb3NlRXZlbnRPYmpcbiAgICAgIHRyeVxuICAgICAgICBhdXRvRGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICAgICBhdXRvRGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2FibGVcbiAgICAgICAgYXV0b0Rpc3Bvc2FibGVzLmFkZCBkaXNwb3NlRXZlbnRPYmpbZGlzcG9zZUV2ZW50VHlwZV0gPT5cbiAgICAgICAgICBhdXRvRGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICAgICAgQGRpc3Bvc2FibGVzLnJlbW92ZSBhdXRvRGlzcG9zYWJsZXNcbiAgICAgICAgQGRpc3Bvc2FibGVzLmFkZCBhdXRvRGlzcG9zYWJsZXNcbiAgICAgICAgYXV0b0Rpc3Bvc2FibGVzXG4gICAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUubG9nICdTdWJBdG9tOjphZGQsIGludmFsaWQgZGlzcG9zZSBldmVudCcsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZSwgZVxuICAgIGVsc2VcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgZGlzcG9zYWJsZVxuICAgICAgZGlzcG9zYWJsZVxuICAgICAgICBcbiAgYWRkRWxlbWVudExpc3RlbmVyOiAoZWxlLCBldmVudHMsIHNlbGVjdG9yLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUsIGhhbmRsZXIpIC0+XG4gICAgaWYgc2VsZWN0b3JcbiAgICAgIHN1YnNjcmlwdGlvbiA9ICQoZWxlKS5vbiBldmVudHMsIHNlbGVjdG9yLCBoYW5kbGVyXG4gICAgZWxzZVxuICAgICAgc3Vic2NyaXB0aW9uID0gJChlbGUpLm9uIGV2ZW50cywgaGFuZGxlclxuICAgIGRpc3Bvc2FibGUgPSBuZXcgRGlzcG9zYWJsZSAtPiBzdWJzY3JpcHRpb24ub2ZmIGV2ZW50cywgaGFuZGxlclxuICAgIEBhZGREaXNwb3NhYmxlIGRpc3Bvc2FibGUsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZVxuICBcbiAgYWRkOiAoYXJncy4uLikgLT5cbiAgICBzaWduYXR1cmUgPSAnJ1xuICAgIGZvciBhcmcgaW4gYXJncyBcbiAgICAgIHN3aXRjaCB0eXBlb2YgYXJnXG4gICAgICAgIHdoZW4gJ3N0cmluZycgICB0aGVuIHNpZ25hdHVyZSArPSAncydcbiAgICAgICAgd2hlbiAnb2JqZWN0JyAgIHRoZW4gc2lnbmF0dXJlICs9ICdvJ1xuICAgICAgICB3aGVuICdmdW5jdGlvbicgdGhlbiBzaWduYXR1cmUgKz0gJ2YnXG4gICAgc3dpdGNoIHNpZ25hdHVyZVxuICAgICAgd2hlbiAnbycsICdvb3MnIHRoZW4gQGFkZERpc3Bvc2FibGUgYXJncy4uLlxuICAgICAgd2hlbiAnc3NmJywgJ29zZicgICAgICBcbiAgICAgICAgW2VsZSwgZXZlbnRzLCBoYW5kbGVyXSA9IGFyZ3NcbiAgICAgICAgQGFkZEVsZW1lbnRMaXN0ZW5lciBlbGUsIGV2ZW50cywgc2VsZWN0b3IsIGRpc3Bvc2VFdmVudE9iaiwgZGlzcG9zZUV2ZW50VHlwZSwgaGFuZGxlclxuICAgICAgd2hlbiAnb3NzZicsICdzc3NmJyAgICAgXG4gICAgICAgIFtlbGUsIGV2ZW50cywgc2VsZWN0b3IsIGhhbmRsZXJdID0gYXJnc1xuICAgICAgICBAYWRkRWxlbWVudExpc3RlbmVyIGVsZSwgZXZlbnRzLCBzZWxlY3RvciwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyXG4gICAgICB3aGVuICdvc29zZicsICdzc29zZidcbiAgICAgICAgW2VsZSwgZXZlbnRzLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUsIGhhbmRsZXJdID0gYXJnc1xuICAgICAgICBAYWRkRWxlbWVudExpc3RlbmVyIGVsZSwgZXZlbnRzLCBzZWxlY3RvciwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyXG4gICAgICB3aGVuICdvc3Nvc2YnLCAnc3Nzb3NmJ1xuICAgICAgICBbZWxlLCBldmVudHMsIHNlbGVjdG9yLCBkaXNwb3NlRXZlbnRPYmosIGRpc3Bvc2VFdmVudFR5cGUsIGhhbmRsZXJdID0gYXJnc1xuICAgICAgICBAYWRkRWxlbWVudExpc3RlbmVyIGVsZSwgZXZlbnRzLCBzZWxlY3RvciwgZGlzcG9zZUV2ZW50T2JqLCBkaXNwb3NlRXZlbnRUeXBlLCBoYW5kbGVyXG4gICAgICBlbHNlIFxuICAgICAgICBjb25zb2xlLmxvZyAnU3ViQXRvbTo6YWRkLCBpbnZhbGlkIGNhbGwgc2lnbmF0dXJlJywgYXJnc1xuICAgICAgICByZXR1cm5cblxuICByZW1vdmU6IChhcmdzLi4uKSAtPiBcbiAgICBAZGlzcG9zYWJsZXMucmVtb3ZlIGFyZ3MuLi5cbiAgICBcbiAgY2xlYXI6IC0+IFxuICAgIEBkaXNwb3NhYmxlcy5jbGVhcigpXG5cbiAgZGlzcG9zZTogLT4gXG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuIl19
