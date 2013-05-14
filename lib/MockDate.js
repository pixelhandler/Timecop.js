/*globals Timecop*/

// A mock Date implementation.
Timecop.MockDate = function() {
  if (arguments.length > 0 || !Timecop.topOfStack()) {
    this._underlyingDate = Timecop.buildNativeDate.apply(Timecop, Array.prototype.slice.apply(arguments));
  } else {
    var date = Timecop.topOfStack().date();
    this._underlyingDate = Timecop.buildNativeDate.call(Timecop, date.getTime());
  }
  this.decorate( this._underlyingDate );
};

Timecop.MockDate.UTC = function() {
  return Timecop.NativeDate.UTC.apply(Timecop.NativeDate, arguments);
};

Timecop.MockDate.parse = function(dateString) {
  return Timecop.NativeDate.parse(dateString);
};

if (Timecop.NativeDate.hasOwnProperty('now')) {
  Timecop.MockDate.now = function() {
    return new Timecop.MockDate().getTime();
  };
}

Timecop.MockDate.prototype = {

  decorate: function( date ){
    var proto = Timecop.MockDate.prototype, i,
        props = Object.getOwnPropertyNames(Timecop.NativeDate.prototype);

    for (i = props.length - 1; i >= 0; i--) {
      if (props[i] !== 'constructor') {
        this.delegate( proto, props[i], date );
      }
    }
  },

  // Delegate `method` to the underlying date, 
  // passing all arguments and returning the result.
  delegate: function(context, method, date){
    if (!context.hasOwnProperty(method) ){
      context[method] = function() {
        return Timecop.NativeDate.prototype[method].apply(this, arguments);
      }.bind(date);
    } else {
      context[method].bind(date);
    }
  }

};
