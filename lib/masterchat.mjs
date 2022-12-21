import axios from "axios";
import { AsyncIterator } from "iterator-helpers-polyfill";
import sha1 from "sha1";
import debug from "debug";

class MasterchatError extends Error {
  code;
  constructor(code, msg) {
    super(msg);
    this.code = code;
    Object.setPrototypeOf(this, MasterchatError.prototype);
  }
}
class UnavailableError extends MasterchatError {
  constructor(msg) {
    super("unavailable", msg);
    Object.setPrototypeOf(this, UnavailableError.prototype);
  }
}
class DisabledChatError extends MasterchatError {
  constructor(msg) {
    super("disabled", msg);
    Object.setPrototypeOf(this, DisabledChatError.prototype);
  }
}
class NoPermissionError extends MasterchatError {
  constructor(msg) {
    super("private", msg);
    Object.setPrototypeOf(this, NoPermissionError.prototype);
  }
}
class MembersOnlyError extends MasterchatError {
  constructor(msg) {
    super("membersOnly", msg);
    Object.setPrototypeOf(this, MembersOnlyError.prototype);
  }
}
class NoStreamRecordingError extends MasterchatError {
  constructor(msg) {
    super("unarchived", msg);
    Object.setPrototypeOf(this, NoStreamRecordingError.prototype);
  }
}
class AccessDeniedError extends MasterchatError {
  constructor(msg) {
    super("denied", msg);
    Object.setPrototypeOf(this, AccessDeniedError.prototype);
  }
}
class InvalidArgumentError extends MasterchatError {
  constructor(msg) {
    super("invalid", msg);
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}
class AbortError extends Error {}

var LiveChatMode;
(function (LiveChatMode) {
  LiveChatMode["MembersOnly"] = "MEMBERS_ONLY";
  LiveChatMode["Slow"] = "SLOW";
  LiveChatMode["SubscribersOnly"] = "SUBSCRIBERS_ONLY";
  LiveChatMode["Unknown"] = "UNKNOWN";
})(LiveChatMode || (LiveChatMode = {}));

const SUPERCHAT_SIGNIFICANCE_MAP = {
  blue: 1,
  lightblue: 2,
  green: 3,
  yellow: 4,
  orange: 5,
  magenta: 6,
  red: 7,
};
/**
 * Map from headerBackgroundColor to color name
 */
const SUPERCHAT_COLOR_MAP = {
  4279592384: "blue",
  4278237396: "lightblue",
  4278239141: "green",
  4294947584: "yellow",
  4293284096: "orange",
  4290910299: "magenta",
  4291821568: "red",
};

var YTTarget;
(function (YTTarget) {
  YTTarget["NewWindow"] = "TARGET_NEW_WINDOW";
})(YTTarget || (YTTarget = {}));
var YTChatErrorStatus;
(function (YTChatErrorStatus) {
  YTChatErrorStatus["Unavailable"] = "UNAVAILABLE";
  YTChatErrorStatus["PermissionDenied"] = "PERMISSION_DENIED";
  YTChatErrorStatus["Internal"] = "INTERNAL";
  YTChatErrorStatus["Invalid"] = "INVALID_ARGUMENT";
  YTChatErrorStatus["NotFound"] = "NOT_FOUND";
  YTChatErrorStatus["Unauthenticated"] = "UNAUTHENTICATED";
})(YTChatErrorStatus || (YTChatErrorStatus = {}));
var YTLiveChatPollType;
(function (YTLiveChatPollType) {
  YTLiveChatPollType["Creator"] = "LIVE_CHAT_POLL_TYPE_CREATOR";
})(YTLiveChatPollType || (YTLiveChatPollType = {}));
var YTWebPageType;
(function (YTWebPageType) {
  YTWebPageType["Unknown"] = "WEB_PAGE_TYPE_UNKNOWN";
  YTWebPageType["WebPageTypeBrowse"] = "WEB_PAGE_TYPE_BROWSE";
  YTWebPageType["WebPageTypeChannel"] = "WEB_PAGE_TYPE_CHANNEL";
  YTWebPageType["WebPageTypeSearch"] = "WEB_PAGE_TYPE_SEARCH";
  YTWebPageType["WebPageTypeUnknown"] = "WEB_PAGE_TYPE_UNKNOWN";
  YTWebPageType["WebPageTypeWatch"] = "WEB_PAGE_TYPE_WATCH";
})(YTWebPageType || (YTWebPageType = {}));
var YTIconType;
(function (YTIconType) {
  YTIconType["Keep"] = "KEEP";
  YTIconType["MoreVert"] = "MORE_VERT";
  YTIconType["QuestionAnswer"] = "QUESTION_ANSWER";
  YTIconType["SlowMode"] = "SLOW_MODE";
  YTIconType["MembersOnlyMode"] = "MEMBERS_ONLY_MODE";
  YTIconType["TabSubscriptions"] = "TAB_SUBSCRIPTIONS";
  YTIconType["BlockUser"] = "BLOCK_USER";
  YTIconType["ErrorOutline"] = "ERROR_OUTLINE";
})(YTIconType || (YTIconType = {}));

var SizeEnum;
(function (SizeEnum) {
  SizeEnum["SizeDefault"] = "SIZE_DEFAULT";
})(SizeEnum || (SizeEnum = {}));
var CommentActionButtonsRendererStyle;
(function (CommentActionButtonsRendererStyle) {
  CommentActionButtonsRendererStyle[
    "CommentActionButtonStyleTypeDesktopToolbar"
  ] = "COMMENT_ACTION_BUTTON_STYLE_TYPE_DESKTOP_TOOLBAR";
})(
  CommentActionButtonsRendererStyle || (CommentActionButtonsRendererStyle = {})
);
var TextEnum;
(function (TextEnum) {
  TextEnum["The1DayAgo"] = "1 day ago";
  TextEnum["The2DaysAgo"] = "2 days ago";
  TextEnum["The3DaysAgo"] = "3 days ago";
  TextEnum["The3DaysAgoEdited"] = "3 days ago (edited)";
})(TextEnum || (TextEnum = {}));
var VoteStatus;
(function (VoteStatus) {
  VoteStatus["Indifferent"] = "INDIFFERENT";
})(VoteStatus || (VoteStatus = {}));
var RenderingPriority;
(function (RenderingPriority) {
  RenderingPriority["Unknown"] = "RENDERING_PRIORITY_UNKNOWN";
  RenderingPriority["LinkedComment"] = "RENDERING_PRIORITY_LINKED_COMMENT";
})(RenderingPriority || (RenderingPriority = {}));
var IconPosition;
(function (IconPosition) {
  IconPosition["ButtonIconPositionTypeLeftOfText"] =
    "BUTTON_ICON_POSITION_TYPE_LEFT_OF_TEXT";
})(IconPosition || (IconPosition = {}));

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function () {
  this.domain = null;
  if (EventEmitter.usingDomains) {
    // if there is an active domain, then attach to it.
    if (domain.active);
  }

  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
    this._events = new EventHandlers();
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== "number" || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn) handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn) handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn) handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn) handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn) handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var doError = type === "error";

  events = this._events;
  if (events) doError = doError && events.error == null;
  else if (!doError) return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er) er = new Error('Uncaught, unspecified "error" event');
      er.domainEmitter = this;
      er.domain = domain;
      er.domainThrown = false;
      domain.emit("error", er);
    } else if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler) return false;

  var isFn = typeof handler === "function";
  len = arguments.length;
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
    // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++) args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit(
        "newListener",
        type,
        listener.listener ? listener.listener : listener
      );

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === "function") {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend
        ? [listener, existing]
        : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error(
          "Possible EventEmitter memory leak detected. " +
            existing.length +
            " " +
            type +
            " listeners added. " +
            "Use emitter.setMaxListeners() to increase limit"
        );
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }

  return target;
}
function emitWarning(e) {
  typeof console.warn === "function" ? console.warn(e) : console.log(e);
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(
  type,
  listener
) {
  return _addListener(this, type, listener, true);
};

function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(
  type,
  listener
) {
  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function removeListener(
  type,
  listener
) {
  var list, events, position, i, originalListener;

  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');

  events = this._events;
  if (!events) return this;

  list = events[type];
  if (!list) return this;

  if (list === listener || (list.listener && list.listener === listener)) {
    if (--this._eventsCount === 0) this._events = new EventHandlers();
    else {
      delete events[type];
      if (events.removeListener)
        this.emit("removeListener", type, list.listener || listener);
    }
  } else if (typeof list !== "function") {
    position = -1;

    for (i = list.length; i-- > 0; ) {
      if (
        list[i] === listener ||
        (list[i].listener && list[i].listener === listener)
      ) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;

    if (list.length === 1) {
      list[0] = undefined;
      if (--this._eventsCount === 0) {
        this._events = new EventHandlers();
        return this;
      } else {
        delete events[type];
      }
    } else {
      spliceOne(list, position);
    }

    if (events.removeListener)
      this.emit("removeListener", type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events;

  events = this._events;
  if (!events) return this;

  // not listening for removeListener, no need to emit
  if (!events.removeListener) {
    if (arguments.length === 0) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    } else if (events[type]) {
      if (--this._eventsCount === 0) this._events = new EventHandlers();
      else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    for (var i = 0, key; i < keys.length; ++i) {
      key = keys[i];
      if (key === "removeListener") continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners("removeListener");
    this._events = new EventHandlers();
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === "function") {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    do {
      this.removeListener(type, listeners[listeners.length - 1]);
    } while (listeners[0]);
  }

  return this;
};

EventEmitter.prototype.listeners = function listeners(type) {
  var evlistener;
  var ret;
  var events = this._events;

  if (!events) ret = [];
  else {
    evlistener = events[type];
    if (!evlistener) ret = [];
    else if (typeof evlistener === "function")
      ret = [evlistener.listener || evlistener];
    else ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === "function") {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--) copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

/**
 * Other Actions
 *
 * Vote
 * POST <yiv1>/live_chat/send_live_chat_vote?key=<key>
 * body: {params}
 *
 * Context Menu Actions
 *
 * Block user
 * POST <yiv1>/live_chat/moderate
 * text: "Block"
 * icon: "BLOCK_USER"
 * key: menuNavigationItemRenderer.navigationEndpoint.confirmDialogEndpoint.content.confirmDialogRenderer.confirmButton.buttonRenderer.serviceEndpoint.moderateLiveChatEndpoint.params
 *
 * Unblock user
 * POST <yiv1>/live_chat/moderate
 * text: "Unblock"
 * icon: "BLOCK_USER"
 * key: menuServiceItemRenderer.serviceEndpoint.moderateLiveChatEndpoint.params
 *
 * Report message
 * POST <yiv1>/flag/get_form?key=<key>
 * text: "Report"
 * icon: "FLAG"
 * key: menuServiceItemRenderer.serviceEndpoint.getReportFormEndpoint.params
 *
 * Pin message
 * POST <yiv1>/live_chat/live_chat_action?key=<key>
 * text: "Pin message"
 * icon: "KEEP"
 * key: liveChatActionEndpoint
 *
 * Unpin message
 * POST <yiv1>/live_chat/live_chat_action?key=<key>
 * text: Unpin message
 * icon: KEEP_OFF
 * key: liveChatActionEndpoint
 *
 * Remove message
 * POST <yiv1>/live_chat/moderate?key=<key>
 * text: "Remove"
 * icon: "DELETE"
 * key: moderateLiveChatEndpoint
 *
 * Put user in timeout
 * POST <yiv1>/live_chat/moderate?key=<key>
 * text: "Put user in timeout"
 * icon: "HOURGLASS"
 * key: moderateLiveChatEndpoint
 *
 * Hide user on this channel
 * POST <yiv1>/live_chat/moderate?key=<key>
 * text: "Hide user on this channel"
 * icon: "REMOVE_CIRCLE"
 * key: moderateLiveChatEndpoint
 *
 * Unhide user on this channel
 * POST <yiv1>/live_chat/moderate?key=<key>
 * text: Unhide user on this channel
 * icon: ADD_CIRCLE
 * key: moderateLiveChatEndpoint
 *
 * Add moderator
 * POST <yiv1>/live_chat/manage_user?key=<key>
 * text: "Add moderator"
 * icon: "ADD_MODERATOR"
 * key: manageLiveChatUserEndpoint
 *
 * Remove moderator
 * POST <yiv1>/live_chat/manage_user?key=<key>
 * text: Remove moderator
 * icon: REMOVE_MODERATOR
 * key: manageLiveChatUserEndpoint
 */
function findParams(obj) {
  const keys = Object.keys(obj).filter(
    (key) => !["clickTrackingParams", "commandMetadata"].includes(key)
  );
  const key = keys[0];
  if (key === "confirmDialogEndpoint") {
    return findParams(
      obj[keys[0]].content.confirmDialogRenderer.confirmButton.buttonRenderer
        .serviceEndpoint
    );
  }
  const params = obj[key]?.params;
  return params;
}
function buildMeta(endpoint) {
  return {
    isPost: endpoint.commandMetadata.webCommandMetadata.sendPost,
    url: endpoint.commandMetadata.webCommandMetadata.apiUrl,
    params: findParams(endpoint),
  };
}

var PBType;
(function (PBType) {
  PBType[(PBType["V"] = 0)] = "V";
  PBType[(PBType["F64"] = 1)] = "F64";
  PBType[(PBType["LD"] = 2)] = "LD";
  PBType[(PBType["StartGroup"] = 3)] = "StartGroup";
  PBType[(PBType["EndGroup"] = 4)] = "EndGroup";
  PBType[(PBType["F32"] = 5)] = "F32";
})(PBType || (PBType = {}));

var global$1 =
  typeof global !== "undefined"
    ? global
    : typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : {};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var inited = false;
function init() {
  inited = true;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
}

function toByteArray(b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr((len * 3) / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xff;
    arr[L++] = (tmp >> 8) & 0xff;
    arr[L++] = tmp & 0xff;
  }

  if (placeHolders === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xff;
  } else if (placeHolders === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xff;
    arr[L++] = tmp & 0xff;
  }

  return arr;
}

function tripletToBase64(num) {
  return (
    lookup[(num >> 18) & 0x3f] +
    lookup[(num >> 12) & 0x3f] +
    lookup[(num >> 6) & 0x3f] +
    lookup[num & 0x3f]
  );
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}

function fromByteArray(uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = "";
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(
      encodeChunk(
        uint8,
        i,
        i + maxChunkLength > len2 ? len2 : i + maxChunkLength
      )
    );
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3f];
    output += "==";
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3f];
    output += lookup[(tmp << 2) & 0x3f];
    output += "=";
  }

  parts.push(output);

  return parts.join("");
}

function read(buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << -nBits) - 1);
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << -nBits) - 1);
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}

function write(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (
    ;
    mLen >= 8;
    buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8
  ) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (
    ;
    eLen > 0;
    buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8
  ) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray =
  Array.isArray ||
  function (arr) {
    return toString.call(arr) == "[object Array]";
  };

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT =
  global$1.TYPED_ARRAY_SUPPORT !== undefined
    ? global$1.TYPED_ARRAY_SUPPORT
    : true;

/*
 * Export kMaxLength after typed array support is determined.
 */
kMaxLength();

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError("Invalid typed array length");
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }

  // Common case.
  if (typeof arg === "number") {
    if (typeof encodingOrOffset === "string") {
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === "string") {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize(size) {
  if (typeof size !== "number") {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === "string"
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill);
  }
  return createBuffer(that, size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== "string" || encoding === "") {
    encoding = "utf8";
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError("'offset' is out of bounds");
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError("'length' is out of bounds");
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that;
}

function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (
      (typeof ArrayBuffer !== "undefined" &&
        obj.buffer instanceof ArrayBuffer) ||
      "length" in obj
    ) {
      if (typeof obj.length !== "number" || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }

    if (obj.type === "Buffer" && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError(
    "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
  );
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError(
      "Attempt to allocate Buffer larger than maximum " +
        "size: 0x" +
        kMaxLength().toString(16) +
        " bytes"
    );
  }
  return length | 0;
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}

Buffer.compare = function compare(a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError("Arguments must be Buffers");
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }
  if (
    typeof ArrayBuffer !== "undefined" &&
    typeof ArrayBuffer.isView === "function" &&
    (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)
  ) {
    return string.byteLength;
  }
  if (typeof string !== "string") {
    string = "" + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
      case undefined:
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default: // assume utf8
        if (loweredCase) return utf8ToBytes(string).length;
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return "";
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return "";
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return "";
  }

  if (!encoding) encoding = "utf8";

  while (true) {
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);

      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);

      case "ascii":
        return asciiSlice(this, start, end);

      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);

      case "base64":
        return base64Slice(this, start, end);

      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return "";
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!internalIsBuffer(b)) throw new TypeError("Argument must be a Buffer");
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = "";
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
    if (this.length > max) str += " ... ";
  }
  return "<Buffer " + str + ">";
};

Buffer.prototype.compare = function compare(
  target,
  start,
  end,
  thisStart,
  thisEnd
) {
  if (!internalIsBuffer(target)) {
    throw new TypeError("Argument must be a Buffer");
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (
    start < 0 ||
    end > target.length ||
    thisStart < 0 ||
    thisEnd > this.length
  ) {
    throw new RangeError("out of range index");
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === "string") {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1;
  }

  // Normalize val
  if (typeof val === "string") {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === "number") {
    val = val & 0xff; // Search for a byte value [0-255]
    if (
      Buffer.TYPED_ARRAY_SUPPORT &&
      typeof Uint8Array.prototype.indexOf === "function"
    ) {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError("val must be string, number or Buffer");
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (
      encoding === "ucs2" ||
      encoding === "ucs-2" ||
      encoding === "utf16le" ||
      encoding === "utf-16le"
    ) {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(
    utf8ToBytes(string, buf.length - offset),
    buf,
    offset,
    length
  );
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(
    utf16leToBytes(string, buf.length - offset),
    buf,
    offset,
    length
  );
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = "utf8";
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === "string") {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = "utf8";
    } else {
      encoding = length;
      length = undefined;
    }
    // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (
    (string.length > 0 && (length < 0 || offset < 0)) ||
    offset > this.length
  ) {
    throw new RangeError("Attempt to write outside buffer bounds");
  }

  if (!encoding) encoding = "utf8";

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case "hex":
        return hexWrite(this, string, offset, length);

      case "utf8":
      case "utf-8":
        return utf8Write(this, string, offset, length);

      case "ascii":
        return asciiWrite(this, string, offset, length);

      case "latin1":
      case "binary":
        return latin1Write(this, string, offset, length);

      case "base64":
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0),
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence =
      firstByte > 0xef ? 4 : firstByte > 0xdf ? 3 : firstByte > 0xbf ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xc0) === 0x80) {
            tempCodePoint = ((firstByte & 0x1f) << 0x6) | (secondByte & 0x3f);
            if (tempCodePoint > 0x7f) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xc0) === 0x80 && (thirdByte & 0xc0) === 0x80) {
            tempCodePoint =
              ((firstByte & 0xf) << 0xc) |
              ((secondByte & 0x3f) << 0x6) |
              (thirdByte & 0x3f);
            if (
              tempCodePoint > 0x7ff &&
              (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)
            ) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if (
            (secondByte & 0xc0) === 0x80 &&
            (thirdByte & 0xc0) === 0x80 &&
            (fourthByte & 0xc0) === 0x80
          ) {
            tempCodePoint =
              ((firstByte & 0xf) << 0x12) |
              ((secondByte & 0x3f) << 0xc) |
              ((thirdByte & 0x3f) << 0x6) |
              (fourthByte & 0x3f);
            if (tempCodePoint > 0xffff && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xfffd;
      bytesPerSequence = 1;
    } else if (codePoint > 0xffff) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(((codePoint >>> 10) & 0x3ff) | 0xd800);
      codePoint = 0xdc00 | (codePoint & 0x3ff);
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = "";
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH))
    );
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7f);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = "";
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = "";
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0)
    throw new RangeError("offset is not uint");
  if (offset + ext > length)
    throw new RangeError("Trying to access beyond buffer length");
}

Buffer.prototype.readUIntLE = function readUIntLE(
  offset,
  byteLength,
  noAssert
) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(
  offset,
  byteLength,
  noAssert
) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8);
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (
    (this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16)) +
    this[offset + 3] * 0x1000000
  );
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (
    this[offset] * 0x1000000 +
    ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3])
  );
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return val & 0x8000 ? val | 0xffff0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return val & 0x8000 ? val | 0xffff0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (
    this[offset] |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
  );
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (
    (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3]
  );
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min)
    throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError("Index out of range");
}

Buffer.prototype.writeUIntLE = function writeUIntLE(
  value,
  offset,
  byteLength,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xff;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xff;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(
  value,
  offset,
  byteLength,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xff;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xff;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] =
      (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      ((littleEndian ? i : 1 - i) * 8);
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(
  value,
  offset,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(
  value,
  offset,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> ((littleEndian ? i : 3 - i) * 8)) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(
  value,
  offset,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(
  value,
  offset,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(
  value,
  offset,
  byteLength,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xff;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (((value / mul) >> 0) - sub) & 0xff;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(
  value,
  offset,
  byteLength,
  noAssert
) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xff;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (((value / mul) >> 0) - sub) & 0xff;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError("Index out of range");
  if (offset < 0) throw new RangeError("Index out of range");
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(
  value,
  offset,
  noAssert
) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(
  value,
  offset,
  noAssert
) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError("targetStart out of bounds");
  }
  if (start < 0 || start >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (end < 0) throw new RangeError("sourceEnd out of bounds");

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === "string") {
    if (typeof start === "string") {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === "string") {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== "string") {
      throw new TypeError("encoding must be a string");
    }
    if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
  } else if (typeof val === "number") {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError("Out of range index");
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === "number") {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, "");
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return "";
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + "=";
  }
  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, "");
}

function toHex(n) {
  if (n < 16) return "0" + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xd7ff && codePoint < 0xe000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xdbff) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xdc00) {
        if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint =
        (((leadSurrogate - 0xd800) << 10) | (codePoint - 0xdc00)) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push((codePoint >> 0x6) | 0xc0, (codePoint & 0x3f) | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(
        (codePoint >> 0xc) | 0xe0,
        ((codePoint >> 0x6) & 0x3f) | 0x80,
        (codePoint & 0x3f) | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(
        (codePoint >> 0x12) | 0xf0,
        ((codePoint >> 0xc) & 0x3f) | 0x80,
        ((codePoint >> 0x6) & 0x3f) | 0x80,
        (codePoint & 0x3f) | 0x80
      );
    } else {
      throw new Error("Invalid code point");
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xff);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}

// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return (
    obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
  );
}

function isFastBuffer(obj) {
  return (
    !!obj.constructor &&
    typeof obj.constructor.isBuffer === "function" &&
    obj.constructor.isBuffer(obj)
  );
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(obj) {
  return (
    typeof obj.readFloatLE === "function" &&
    typeof obj.slice === "function" &&
    isFastBuffer(obj.slice(0, 0))
  );
}

function mapType(type) {
  switch (type) {
    case PBType.LD:
      return "ld";
    case PBType.F32:
      return "f32";
    case PBType.F64:
      return "f64";
    case PBType.V:
      return "v";
  }
}
function pprintPbValue(value, depth = 0) {
  const pad = "".padEnd(depth * 4, " ");
  if (Array.isArray(value)) {
    for (const token of value) {
      if (token.type === PBType.LD) {
        console.log(pad + `[${token.fid} (${mapType(token.type)})] ->`);
        pprintPbValue(token.v, depth + 1);
      } else {
        console.log(
          pad + `[${token.fid} (${mapType(token.type)})] -> ${token.v}`
        );
      }
    }
  } else {
    console.log(pad + value);
  }
}
function printBuf(buf) {
  for (const el of buf) {
    console.log(
      el.toString(16).padStart(2, "0"),
      el.toString(2).padStart(8, "0"),
      el.toString()
    );
  }
}
function toJSON(tokens) {
  return JSON.stringify(
    tokens,
    (_, v) => (typeof v === "bigint" ? v.toString() : v),
    2
  );
}
function bitou8(n) {
  let hv = n.toString(16);
  hv = "".padStart(hv.length % 2, "0") + hv;
  return hextou8(hv);
}
function u8tobi(buf) {
  return BigInt(`0x${u8tohex(buf)}`);
}
function concatu8(args) {
  let totalLength = 0;
  for (let i = 0; i < args.length; ++i) {
    totalLength += args[i].length;
  }
  const out = new Uint8Array(totalLength);
  let offset = 0;
  for (let i = 0; i < args.length; ++i) {
    out.set(args[i], offset);
    offset += args[i].length;
  }
  return out;
}
function hextou8(data) {
  data =
    data.startsWith("0x") || data.startsWith("0X") ? data.substring(2) : data;
  const out = new Uint8Array(data.length / 2);
  for (let i = 0; i < out.length; ++i) {
    out[i] = parseInt(data.substr(i * 2, 2), 16);
  }
  return out;
}
function u8tohex(data) {
  let out = "";
  for (let i = 0; i < data.length; ++i) {
    out += data[i].toString(16).padStart(2, "0");
  }
  return out;
}
const b64tou8 = (data) => {
  const buf = Buffer.from(data, "base64");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
};
const u8tob64 = (data) => Buffer.from(data).toString("base64");

function h(b) {
  return new TextDecoder().decode(hextou8(b.raw[0]));
}
const DH = {
  "Accept-Language": "en",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
};
const DC = { clientName: "WEB", clientVersion: "2.20211014.05.00" };
const DO = "https://www.youtube.com";
const DAK = h`41497a615379414f5f464a32536c7155385134535445484c4743696c775f59395f313171635738`;
const EP_GLCR = "/youtubei/v1/live_chat/get_live_chat_replay?key=" + DAK;
const EP_GLC = "/youtubei/v1/live_chat/get_live_chat?key=" + DAK;
const EP_SM = "/youtubei/v1/live_chat/send_message?key=" + DAK;
const EP_MOD = "/youtubei/v1/live_chat/moderate?key=" + DAK;
const EP_LCA = "/youtubei/v1/live_chat/live_chat_action?key=" + DAK;
const EP_MU = "/youtubei/v1/live_chat/manage_user?key=" + DAK;
const EP_GTS = "/youtubei/v1/get_transcript?key=" + DAK;
const EP_NXT = "/youtubei/v1/next?key=" + DAK;
const EP_GICM = "/youtubei/v1/live_chat/get_item_context_menu?key=" + DAK;
const SASH = "SAPISIDHASH";
const XO = "X-Origin";
const XGAU = "X-Goog-AuthUser";
const XGPID = "X-Goog-PageId";

function buildAuthHeaders(creds) {
  const dsid = creds.DELEGATED_SESSION_ID ?? creds.SESSION_ID;
  return {
    Cookie: genCookieString(creds),
    Authorization: genAuthToken(creds.SAPISID, DO),
    [XO]: DO,
    [XGAU]: "0",
    ...(dsid && { [XGPID]: dsid }),
  };
}
function genCookieString(creds) {
  return Object.entries(creds)
    .map(([key, value]) => `${key}=${value};`)
    .join(" ");
}
function genAuthToken(sid, origin) {
  return `${SASH} ${genSash(sid, origin)}`;
}
function genSash(sid, origin) {
  const now = Math.floor(new Date().getTime() / 1e3);
  const payload = [now, sid, origin];
  const digest = sha1Digest(payload.join(" "));
  return [now, digest].join("_");
}
function sha1Digest(payload) {
  const hash = sha1(payload);
  return hash.toString();
}

function splitRunsByNewLines(runs) {
  return runs.reduce(
    (s, i) =>
      "text" in i && i.text === "\n"
        ? [...s, []]
        : (s[s.length - 1].push(i), s),
    [[]]
  );
}
/**
 * Convert timestampUsec into Date
 */
function tsToDate(timestampUsec) {
  return new Date(Number(BigInt(timestampUsec) / BigInt(1000)));
}
/**
 * Convert timestampUsec into number (in seconds)
 */
function tsToNumber(timestampUsec) {
  return Number(BigInt(timestampUsec) / BigInt(1000));
}
function usecToSeconds(usec) {
  return Number(BigInt(usec) / BigInt(1000 * 2));
}
function formatColor(color, format = "hex") {
  switch (format) {
    case "rgb":
      return `rgba(${color.r},${color.g},${color.b},${color.opacity / 255})`;
    case "hex":
      return `#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(
        16
      )}${color.opacity.toString(16)}`;
  }
}
const debugLog$1 = debug("masterchat");
function toVideoId(idOrUrl) {
  const match = /(?:[&=/]|^)([A-Za-z0-9_-]{11})(?=(?:[^A-Za-z0-9_-]|$))/.exec(
    idOrUrl
  );
  return match?.[1];
}
function stripYtRedirection(url) {
  if (!url.startsWith("https://www.youtube.com/redirect?")) {
    return url;
  }
  const target = new URL(url);
  const q = target.searchParams.get("q");
  return q ? q : target.href;
}
function endpointToUrl(navigationEndpoint) {
  if ("urlEndpoint" in navigationEndpoint) {
    return stripYtRedirection(navigationEndpoint.urlEndpoint.url);
  }
  if ("watchEndpoint" in navigationEndpoint) {
    const { watchEndpoint } = navigationEndpoint;
    let url = DO + `/watch?v=${watchEndpoint.videoId}`;
    if (watchEndpoint.playlistId) url += "&list=" + watchEndpoint.playlistId;
    if (watchEndpoint.index) url += "&index=" + watchEndpoint.index;
    if (watchEndpoint.startTimeSeconds)
      url += "&t=" + watchEndpoint.startTimeSeconds;
    return url;
  }
  if ("browseEndpoint" in navigationEndpoint) {
    const { browseEndpoint } = navigationEndpoint;
    const { browseId } = browseEndpoint;
    if ("canonicalBaseUrl" in browseEndpoint) {
      return stripYtRedirection(browseEndpoint.canonicalBaseUrl);
    } else if (browseId) {
      const prefix = browseId.substr(0, 2);
      let url = DO;
      if (prefix === "FE") {
        if (browseId === "FEwhat_to_watch") url = "/";
        else if (browseId === "FEmy_videos") url = "/my_videos";
        else url = "/feed/" + browseId.substr(2);
      } else if (prefix === "VL") {
        url = "/playlist?list=" + browseId.substr(2);
      } else {
        url = "/channel/" + browseId;
      }
      return url;
    }
  }
}
function textRunToPlainText(run) {
  const { text, navigationEndpoint } = run;
  if (navigationEndpoint) {
    if ("urlEndpoint" in navigationEndpoint) {
      return endpointToUrl(navigationEndpoint) ?? text;
    }
    if ("watchEndpoint" in navigationEndpoint && text.startsWith("https://")) {
      return endpointToUrl(navigationEndpoint) ?? text;
    }
  }
  return text;
}
function emojiRunToPlainText(run) {
  const { emoji } = run;
  /**
     * Anomalous emoji pattern
     * 1. Missing `isCustomEmoji` and `emojiId`
     * {
        emoji: {
          emojiId: "",
          shortcuts: [":smilisageReng_face_with_tear:"],
          searchTerms: ["smiling", "face", "with", "tear"],
          image: {
            thumbnails: [
              {
                url: "https://www.youtube.com/s/gaming/emoji/828cb648/emoji_u1f972.svg",
              },
            ],
            accessibility: { accessibilityData: { label: "" } },
          },
        },
      },
     */
  const term =
    emoji.isCustomEmoji || emoji.emojiId === ""
      ? emoji.shortcuts[emoji.shortcuts.length - 1]
      : emoji.emojiId;
  return term;
}
function stringify(payload, runsToStringOptions) {
  // undefined
  if (payload == undefined) return undefined;
  // string
  if (typeof payload === "string") return payload;
  // Run[]
  if (Array.isArray(payload)) return runsToString(payload, runsToStringOptions);
  // YTRunContainer
  if ("runs" in payload) return runsToString(payload.runs, runsToStringOptions);
  // YTSimpleTextContainer
  // TODO: add option for expanding accessibility label
  if ("simpleText" in payload) return simpleTextToString(payload, false);
  throw new Error(`Invalid payload format: ${payload}`);
}
function simpleTextToString(payload, expand = false) {
  if (payload.accessibility && expand) {
    return payload.accessibility.accessibilityData.label;
  }
  return payload.simpleText;
}
function runsToString(
  runs,
  {
    spaces = false,
    textHandler = textRunToPlainText,
    emojiHandler = emojiRunToPlainText,
  } = {}
) {
  return runs
    .map((run) => {
      if ("text" in run) return textHandler(run);
      if ("emoji" in run) return emojiHandler(run);
      throw new Error(`Unrecognized run token: ${JSON.stringify(run)}`);
    })
    .join(spaces ? " " : "");
}
function delay(duration, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new AbortError());
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(new AbortError());
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, duration);
    signal?.addEventListener("abort", onAbort);
  });
}
function guessFreeChat(title) {
  return /(?:[fF]ree\s?[cC]hat|(?:ふりー|フリー)(?:ちゃっと|チャット))/.test(
    title
  );
}
function groupBy(lst, key) {
  return lst.reduce((result, o) => {
    const index = o[key];
    if (!result[index]) result[index] = [];
    result[index].push(o);
    return result;
  }, {});
}
function withContext(input = {}) {
  return {
    ...input,
    context: {
      ...input?.context,
      client: DC,
    },
  };
}
function durationToSeconds(durationText) {
  const match = /^(a|\d+)\s(year|month|week|day|hour|minute|second)s?$/.exec(
    durationText
  );
  // throwing an error here will cause it to bubble all the way up.
  // if (!match) throw new Error(`Invalid duration: ${durationText}`);
  if (!match) return -1;
  const [_, duration, unit] = match;
  const durationInt = parseInt(duration) || 1;
  const multiplier = {
    year: 31536000,
    month: 2628000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  }[unit];
  if (!multiplier) throw new Error(`Invalid duration unit: ${unit}`);
  return durationInt * multiplier;
}
function durationToISO8601(durationText) {
  const match = /^(a|\d+)\s(year|month|week|day|hour|minute|second)s?$/.exec(
    durationText
  );
  if (!match) throw new Error(`Invalid duration: ${durationText}`);
  const [_, duration, unit] = match;
  const durationInt = parseInt(duration) || 1;
  const durationUnit = {
    year: "Y",
    month: "M",
    week: "W",
    day: "D",
    hour: "TH",
    minute: "TM",
    second: "TS",
  }[unit];
  if (!durationUnit) throw new Error(`Invalid duration unit: ${unit}`);
  return `P${durationInt}${durationUnit}`;
}
function unwrapReplayActions(rawActions) {
  return rawActions.map(
    // TODO: verify that an action always holds a single item.
    (action) => {
      const replayAction = Object.values(omitTrackingParams(action))[0];
      return replayAction.actions[0];
    }
  );
}
function getTimedContinuation(continuationContents) {
  /**
   * observed k: invalidationContinuationData | timedContinuationData | liveChatReplayContinuationData
   * continuations[1] would be playerSeekContinuationData
   */
  if (
    Object.keys(
      continuationContents.liveChatContinuation.continuations[0]
    )[0] === "playerSeekContinuationData"
  ) {
    // only playerSeekContinuationData
    return undefined;
  }
  const continuation = Object.values(
    continuationContents.liveChatContinuation.continuations[0]
  )[0];
  if (!continuation) {
    // no continuation
    return undefined;
  }
  return {
    token: continuation.continuation,
    timeoutMs: continuation.timeoutMs,
  };
}
/**
 * Remove `clickTrackingParams` and `trackingParams` from object
 */
function omitTrackingParams(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k]) => k !== "clickTrackingParams" && k !== "trackingParams"
    )
  );
}

function parseMembership(badge) {
  if (!badge) return;
  const renderer = badge?.liveChatAuthorBadgeRenderer;
  if (!renderer?.customThumbnail) return;
  const match = /^(.+?)(?:\s\((.+)\))?$/.exec(renderer.tooltip);
  if (match) {
    const [_, status, since] = match;
    const membership = {
      status,
      since,
      thumbnail:
        renderer.customThumbnail.thumbnails[
          renderer.customThumbnail.thumbnails.length - 1
        ].url,
    };
    return membership;
  }
}
function parseBadges(renderer) {
  let isVerified = false,
    isOwner = false,
    isModerator = false,
    membership = undefined;
  if ("authorBadges" in renderer && renderer.authorBadges) {
    for (const badge of renderer.authorBadges) {
      const renderer = badge.liveChatAuthorBadgeRenderer;
      const iconType = renderer.icon?.iconType;
      switch (iconType) {
        case "VERIFIED":
          isVerified = true;
          break;
        case "OWNER":
          isOwner = true;
          break;
        case "MODERATOR":
          isModerator = true;
          break;
        case undefined:
          // membership
          membership = parseMembership(badge);
          break;
        default:
          debugLog$1(
            `[action required] Unrecognized iconType:`,
            iconType,
            JSON.stringify(renderer)
          );
          throw new Error("Unrecognized iconType: " + iconType);
      }
    }
  }
  return {
    isOwner,
    isVerified,
    isModerator,
    membership,
  };
}

function pickThumbUrl(thumbList) {
  return thumbList.thumbnails[thumbList.thumbnails.length - 1].url;
}
function parseColorCode(code) {
  if (code > 4294967295) {
    throw new Error(`Invalid color code: ${code}`);
  }
  const b = code & 0xff;
  const g = (code >>> 8) & 0xff;
  const r = (code >>> 16) & 0xff;
  const opacity = code >>> 24;
  return { r, g, b, opacity };
}

function parseAddBannerToLiveChatCommand(payload) {
  // add pinned item
  const bannerRdr = payload["bannerRenderer"]["liveChatBannerRenderer"];
  if (
    bannerRdr.header &&
    bannerRdr.header.liveChatBannerHeaderRenderer.icon.iconType !== "KEEP"
  ) {
    debugLog$1(
      "[action required] Unknown icon type (addBannerToLiveChatCommand)",
      JSON.stringify(bannerRdr.header)
    );
  }
  // banner
  const actionId = bannerRdr.actionId;
  const targetId = bannerRdr.targetId;
  const viewerIsCreator = bannerRdr.viewerIsCreator;
  const isStackable = bannerRdr.isStackable;
  // contents
  const contents = bannerRdr.contents;
  if ("liveChatTextMessageRenderer" in contents) {
    const rdr = contents.liveChatTextMessageRenderer;
    const id = rdr.id;
    const message = rdr.message.runs;
    const timestampUsec = rdr.timestampUsec;
    const timestamp = tsToDate(timestampUsec);
    const authorName = stringify(rdr.authorName);
    const authorPhoto = pickThumbUrl(rdr.authorPhoto);
    const authorChannelId = rdr.authorExternalChannelId;
    const { isVerified, isOwner, isModerator, membership } = parseBadges(rdr);
    // header
    const header = bannerRdr.header.liveChatBannerHeaderRenderer;
    const title = header.text.runs;
    if (!authorName) {
      debugLog$1(
        "[action required] Empty authorName found at addBannerToLiveChatCommand",
        JSON.stringify(rdr)
      );
    }
    const parsed = {
      type: "addBannerAction",
      actionId,
      targetId,
      id,
      title,
      message,
      timestampUsec,
      timestamp,
      authorName,
      authorPhoto,
      authorChannelId,
      isVerified,
      isOwner,
      isModerator,
      membership,
      viewerIsCreator,
      contextMenuEndpointParams:
        rdr.contextMenuEndpoint?.liveChatItemContextMenuEndpoint.params,
    };
    return parsed;
  } else if ("liveChatBannerRedirectRenderer" in contents) {
    const rdr = contents.liveChatBannerRedirectRenderer;
    const targetVideoId =
      "watchEndpoint" in rdr.inlineActionButton.buttonRenderer.command
        ? rdr.inlineActionButton.buttonRenderer.command.watchEndpoint.videoId
        : undefined;
    const photo = pickThumbUrl(rdr.authorPhoto);
    if (targetVideoId) {
      // Outgoing
      const targetName = rdr.bannerMessage.runs[1].text;
      const payload = {
        type: "addOutgoingRaidBannerAction",
        actionId,
        targetId,
        targetName,
        targetPhoto: photo,
        targetVideoId,
      };
      return payload;
    } else {
      // Incoming
      const sourceName = rdr.bannerMessage.runs[0].text;
      const payload = {
        type: "addIncomingRaidBannerAction",
        actionId,
        targetId,
        sourceName,
        sourcePhoto: photo,
      };
      return payload;
    }
  } else if ("liveChatProductItemRenderer" in contents) {
    const rdr = contents.liveChatProductItemRenderer;
    const title = rdr.title;
    const description = rdr.accessibilityTitle;
    const thumbnail = rdr.thumbnail.thumbnails[0].url;
    const price = rdr.price;
    const vendorName = rdr.vendorName;
    const creatorMessage = rdr.creatorMessage;
    const creatorName = rdr.creatorName;
    const authorPhoto = pickThumbUrl(rdr.authorPhoto);
    const url = endpointToUrl(rdr.onClickCommand);
    if (!url) {
      debugLog$1(
        `Empty url at liveChatProductItemRenderer: ${JSON.stringify(rdr)}`
      );
    }
    const dialogMessage =
      rdr.informationDialog.liveChatDialogRenderer.dialogMessages;
    const isVerified = rdr.isVerified;
    const payload = {
      type: "addProductBannerAction",
      actionId,
      targetId,
      viewerIsCreator,
      isStackable,
      title,
      description,
      thumbnail,
      price,
      vendorName,
      creatorMessage,
      creatorName,
      authorPhoto,
      url,
      dialogMessage,
      isVerified,
    };
    return payload;
  } else if ("liveChatCallForQuestionsRenderer" in contents) {
    debugLog$1(
      "[TODO, action required] implement liveChatCallForQuestionsRenderer in parseAddBannerToLiveChatCommand"
    );
    /*
         [action required] Unrecognized content type found in parseAddBannerToLiveChatCommand: {"bannerRenderer":{"liveChatBannerRenderer":{"contents":{"liveChatCallForQuestionsRenderer":{"creatorAvatar":{"thumbnails":[{"url":"https://yt4.ggpht.com/hI-shJC2UnZcXRsZjKAPHXfEabW3KpiyeTtHTu1lkDvuwyJHYX4daHJ1g7nMW75Y-D36ba7EB3o=s32-c-k-c0x00ffffff-no-rj","width":32,"height":32},{"url":"https://yt4.ggpht.com/hI-shJC2UnZcXRsZjKAPHXfEabW3KpiyeTtHTu1lkDvuwyJHYX4daHJ1g7nMW75Y-D36ba7EB3o=s64-c-k-c0x00ffffff-no-rj","width":64,"height":64}]},"featureLabel":{"simpleText":"Q&A"},"contentSeparator":{"simpleText":"·"},"overflowMenuButton":{"buttonRenderer":{"icon":{"iconType":"MORE_VERT"},"accessibility":{"label":"Chat actions"},"trackingParams":"CAcQ8FsiEwiqrZ3ytIn8AhXBDX0KHZ3kALE=","accessibilityData":{"accessibilityData":{"label":"Chat actions"}},"command":{"clickTrackingParams":"CAcQ8FsiEwiqrZ3ytIn8AhXBDX0KHZ3kALE=","commandMetadata":{"webCommandMetadata":{"ignoreNavigation":true}},"liveChatItemContextMenuEndpoint":{"params":"Q2g0S0hBb2FRMGt0YlRGUE5qQnBabmREUmxkWlNISlJXV1EwT0ZGSVRXY2FLU29uQ2hoVlEyYzNjMWN0YURGUVZXOTNaR2xTTlVzMFNHeENaWGNTQzNsRmVVbGxMVXBPWkVkM0lBRW9BVElhQ2hoVlEyYzNjMWN0YURGUVZXOTNaR2xTTlVzMFNHeENaWGM0QVVnQVVCNCUzRA=="}}}},"creatorAuthorName":{"simpleText":"Lia Ch. 鈴香アシェリア 【Phase Connect】"},"questionMessage":{"runs":[{"text":"ASK"}]}}},"actionId":"ChwKGkNJLW0xTzYwaWZ3Q0ZXWUhyUVlkNDhRSE1n","viewerIsCreator":false,"targetId":"live-chat-banner","onCollapseCommand":{"clickTrackingParams":"CAEQl98BIhMIqq2d8rSJ_AIVwQ19Ch2d5ACx","elementsCommand":{"setEntityCommand":{"identifier":"EihDaHdLR2tOSkxXMHhUell3YVdaM1EwWlhXVWh5VVZsa05EaFJTRTFuIIsBKAE%3D","entity":"CkJFaWhEYUhkTFIydE9Ta3hYTUhoVWVsbDNZVmRhTTFFd1dsaFhWV2g1VlZac2EwNUVhRkpUUlRGdUlJc0JLQUUlM0QQAQ=="}}},"onExpandCommand":{"clickTrackingParams":"CAEQl98BIhMIqq2d8rSJ_AIVwQ19Ch2d5ACx","elementsCommand":{"setEntityCommand":{"identifier":"EihDaHdLR2tOSkxXMHhUell3YVdaM1EwWlhXVWh5VVZsa05EaFJTRTFuIIsBKAE%3D","entity":"CkJFaWhEYUhkTFIydE9Ta3hYTUhoVWVsbDNZVmRhTTFFd1dsaFhWV2g1VlZac2EwNUVhRkpUUlRGdUlJc0JLQUUlM0QQAA=="}}},"isStackable":true}}}
        */
    return unknown(payload);
  } else {
    debugLog$1(
      `[action required] Unrecognized content type found in parseAddBannerToLiveChatCommand: ${JSON.stringify(
        payload
      )}`
    );
    return unknown(payload);
  }
}

const AMOUNT_REGEXP = /[\d.,]+/;
const SYMBOL_TO_TLS_MAP = {
  $: "USD",
  "£": "GBP",
  "¥": "JPY",
  "JP¥": "JPY",
  "₩": "KRW",
  "₪": "ILS",
  "€": "EUR",
  "₱": "PHP",
  "₹": "INR",
  A$: "AUD",
  CA$: "CAD",
  HK$: "HKD",
  MX$: "MXN",
  NT$: "TWD",
  NZ$: "NZD",
  R$: "BRL",
};
function toTLS(symbolOrTls) {
  return SYMBOL_TO_TLS_MAP[symbolOrTls] ?? symbolOrTls;
}
function parseAmountText(purchaseAmountText) {
  const input = stringify(purchaseAmountText);
  const amountString = AMOUNT_REGEXP.exec(input)[0].replace(/,/g, "");
  const amount = parseFloat(amountString);
  const currency = toTLS(input.replace(AMOUNT_REGEXP, "").trim());
  return { amount, currency };
}
function parseSuperChat(renderer) {
  const { amount, currency } = parseAmountText(
    renderer.purchaseAmountText.simpleText
  );
  const color = SUPERCHAT_COLOR_MAP[renderer.headerBackgroundColor.toString()];
  const significance = SUPERCHAT_SIGNIFICANCE_MAP[color];
  return {
    amount,
    currency,
    color,
    significance,
    authorNameTextColor: parseColorCode(renderer.authorNameTextColor),
    timestampColor: parseColorCode(renderer.timestampColor),
    headerBackgroundColor: parseColorCode(renderer.headerBackgroundColor),
    headerTextColor: parseColorCode(renderer.headerTextColor),
    bodyBackgroundColor: parseColorCode(renderer.bodyBackgroundColor),
    bodyTextColor: parseColorCode(renderer.bodyTextColor),
  };
}

function parseAddChatItemAction(payload) {
  const { item } = payload;
  const parsedAction = (() => {
    if ("liveChatTextMessageRenderer" in item) {
      // Chat
      const renderer = item["liveChatTextMessageRenderer"];
      return parseLiveChatTextMessageRenderer(renderer);
    } else if ("liveChatPaidMessageRenderer" in item) {
      // Super Chat
      const renderer = item["liveChatPaidMessageRenderer"];
      return parseLiveChatPaidMessageRenderer(renderer);
    } else if ("liveChatPaidStickerRenderer" in item) {
      // Super Sticker
      const renderer = item["liveChatPaidStickerRenderer"];
      return parseLiveChatPaidStickerRenderer(renderer);
    } else if ("liveChatMembershipItemRenderer" in item) {
      // Membership updates
      const renderer = item["liveChatMembershipItemRenderer"];
      return parseLiveChatMembershipItemRenderer(renderer);
    } else if ("liveChatViewerEngagementMessageRenderer" in item) {
      // Engagement message
      const renderer = item["liveChatViewerEngagementMessageRenderer"];
      return parseLiveChatViewerEngagementMessageRenderer(renderer);
    } else if ("liveChatPlaceholderItemRenderer" in item) {
      // Placeholder chat
      const renderer = item["liveChatPlaceholderItemRenderer"];
      return parseLiveChatPlaceholderItemRenderer(renderer);
    } else if ("liveChatModeChangeMessageRenderer" in item) {
      // Mode change message (e.g. toggle members-only)
      const renderer = item["liveChatModeChangeMessageRenderer"];
      return parseLiveChatModeChangeMessageRenderer(renderer);
    } else if ("liveChatSponsorshipsGiftPurchaseAnnouncementRenderer" in item) {
      // Sponsorships gift purchase announcement
      const renderer =
        item["liveChatSponsorshipsGiftPurchaseAnnouncementRenderer"];
      return parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(
        renderer
      );
    } else if (
      "liveChatSponsorshipsGiftRedemptionAnnouncementRenderer" in item
    ) {
      // Sponsorships gift purchase announcement
      const renderer =
        item["liveChatSponsorshipsGiftRedemptionAnnouncementRenderer"];
      return parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(
        renderer
      );
    } else if ("liveChatModerationMessageRenderer" in item) {
      const renderer = item["liveChatModerationMessageRenderer"];
      return parseLiveChatModerationMessageRenderer(renderer);
    }
  })();
  if (!parsedAction) {
    debugLog$1(
      "[action required] Unrecognized chat item renderer type:",
      JSON.stringify(item)
    );
    return unknown(payload);
  }
  return parsedAction;
}
// Chat
function parseLiveChatTextMessageRenderer(renderer) {
  const {
    id,
    timestampUsec,
    authorExternalChannelId: authorChannelId,
  } = renderer;
  const timestamp = tsToDate(timestampUsec);
  const authorName = renderer.authorName
    ? stringify(renderer.authorName)
    : undefined;
  const authorPhoto =
    renderer.authorPhoto.thumbnails[renderer.authorPhoto.thumbnails.length - 1]
      .url;
  const { isVerified, isOwner, isModerator, membership } =
    parseBadges(renderer);
  const contextMenuEndpointParams =
    renderer.contextMenuEndpoint.liveChatItemContextMenuEndpoint.params;
  if (renderer.authorName && !("simpleText" in renderer.authorName)) {
    debugLog$1(
      "[action required] non-simple authorName (live chat):",
      JSON.stringify(renderer.authorName)
    );
  }
  // message can somehow be a blank object (in quite rare occasion though)
  const message = renderer.message.runs;
  const parsed = {
    type: "addChatItemAction",
    id,
    timestamp,
    timestampUsec,
    authorName,
    authorChannelId,
    authorPhoto,
    message,
    membership,
    isVerified,
    isOwner,
    isModerator,
    contextMenuEndpointParams,
    rawMessage: message, // deprecated
  };
  return parsed;
}
// Super Chat
function parseLiveChatPaidMessageRenderer(renderer) {
  const { timestampUsec, authorExternalChannelId: authorChannelId } = renderer;
  const timestamp = tsToDate(timestampUsec);
  const authorName = stringify(renderer.authorName);
  const authorPhoto = pickThumbUrl(renderer.authorPhoto);
  if (renderer.authorName && !("simpleText" in renderer.authorName)) {
    debugLog$1(
      "[action required] non-simple authorName (super chat):",
      JSON.stringify(renderer.authorName)
    );
  }
  const message = renderer.message?.runs ?? null;
  const superchat = parseSuperChat(renderer);
  const parsed = {
    type: "addSuperChatItemAction",
    id: renderer.id,
    timestamp,
    timestampUsec,
    authorName,
    authorChannelId,
    authorPhoto,
    message,
    ...superchat,
    superchat,
    rawMessage: renderer.message?.runs, // deprecated
  };
  return parsed;
}
// Super Sticker
function parseLiveChatPaidStickerRenderer(rdr) {
  const { timestampUsec, authorExternalChannelId: authorChannelId } = rdr;
  const timestamp = tsToDate(timestampUsec);
  const authorName = stringify(rdr.authorName);
  const authorPhoto = pickThumbUrl(rdr.authorPhoto);
  if (!authorName) {
    debugLog$1(
      "[action required] empty authorName (super sticker)",
      JSON.stringify(rdr)
    );
  }
  const stickerUrl = "https:" + pickThumbUrl(rdr.sticker);
  const stickerText = rdr.sticker.accessibility.accessibilityData.label;
  const { amount, currency } = parseAmountText(
    rdr.purchaseAmountText.simpleText
  );
  const parsed = {
    type: "addSuperStickerItemAction",
    id: rdr.id,
    timestamp,
    timestampUsec,
    authorName,
    authorChannelId,
    authorPhoto,
    stickerUrl,
    stickerText,
    amount,
    currency,
    stickerDisplayWidth: rdr.stickerDisplayWidth,
    stickerDisplayHeight: rdr.stickerDisplayHeight,
    moneyChipBackgroundColor: parseColorCode(rdr.moneyChipBackgroundColor),
    moneyChipTextColor: parseColorCode(rdr.moneyChipTextColor),
    backgroundColor: parseColorCode(rdr.backgroundColor),
    authorNameTextColor: parseColorCode(rdr.authorNameTextColor),
  };
  return parsed;
}
// Membership
function parseLiveChatMembershipItemRenderer(renderer) {
  const id = renderer.id;
  const timestampUsec = renderer.timestampUsec;
  const timestamp = tsToDate(timestampUsec);
  const authorName = renderer.authorName
    ? stringify(renderer.authorName)
    : undefined;
  const authorChannelId = renderer.authorExternalChannelId;
  const authorPhoto = pickThumbUrl(renderer.authorPhoto);
  // observed, MODERATOR
  // observed, undefined renderer.authorBadges
  const membership = renderer.authorBadges
    ? parseMembership(renderer.authorBadges[renderer.authorBadges.length - 1])
    : undefined;
  if (!membership) {
    debugLog$1(
      `missing membership information while parsing neww membership action: ${JSON.stringify(
        renderer
      )}`
    );
  }
  const isMilestoneMessage = "empty" in renderer || "message" in renderer;
  if (isMilestoneMessage) {
    const message = renderer.message ? renderer.message.runs : null;
    const durationText = renderer.headerPrimaryText.runs
      .slice(1)
      .map((r) => r.text)
      .join("");
    // duration > membership.since
    // e.g. 12 months > 6 months
    const duration = durationToSeconds(durationText);
    const level = renderer.headerSubtext
      ? stringify(renderer.headerSubtext)
      : undefined;
    const parsed = {
      type: "addMembershipMilestoneItemAction",
      id,
      timestamp,
      timestampUsec,
      authorName,
      authorChannelId,
      authorPhoto,
      membership,
      level,
      message,
      duration,
      durationText,
    };
    return parsed;
  } else {
    /**
     * no level -> ["New Member"]
     * multiple levels -> ["Welcome", "<level>", "!"]
     */
    const subRuns = renderer.headerSubtext.runs;
    const level = subRuns.length > 1 ? subRuns[1].text : undefined;
    const parsed = {
      type: "addMembershipItemAction",
      id,
      timestamp,
      timestampUsec,
      authorName,
      authorChannelId,
      authorPhoto,
      membership,
      level,
    };
    return parsed;
  }
}
// Engagement message
function parseLiveChatViewerEngagementMessageRenderer(renderer) {
  /**
   * YOUTUBE_ROUND: engagement message
   * POLL: poll result message
   */
  const {
    id,
    timestampUsec,
    icon: { iconType },
  } = renderer;
  if ("simpleText" in renderer.message) {
    debugLog$1(
      "[action required] message is simpleText (engagement):",
      JSON.stringify(renderer)
    );
  }
  switch (iconType) {
    case "YOUTUBE_ROUND": {
      const timestamp = tsToDate(timestampUsec);
      const actionUrl =
        renderer.actionButton?.buttonRenderer.navigationEndpoint.urlEndpoint
          .url;
      const parsed = {
        type: "addViewerEngagementMessageAction",
        id,
        message: renderer.message,
        actionUrl,
        timestamp,
        timestampUsec: timestampUsec,
      };
      return parsed;
    }
    case "POLL": {
      // [{"id":"ChkKF1hTbnRZYzNTQk91R2k5WVA1cDJqd0FV","message":{"runs":[{"text":"生まれは？","bold":true},{"text":"\n"},{"text":"平成 (80%)"},{"text":"\n"},{"text":"昭和 (19%)"},{"text":"\n"},{"text":"\n"},{"text":"Poll complete: 84 votes"}]},"messageType":"poll","type":"addViewerEngagementMessageAction","originVideoId":"1SzuFU7t450","originChannelId":"UC3Z7UaEe_vMoKRz9ABQrI5g"}]
      //  <!> addViewerEngagementMessageAction [{"id":"ChkKF3VDX3RZWS1PQl95QWk5WVBrUGFENkFz","message":{"runs":[{"text":"2 (73%)"},{"text":"\n"},{"text":"4 (26%)"},{"text":"\n"},{"text":"\n"},{"text":"Poll complete: 637 votes"}]},"messageType":"poll","type":"addViewerEngagementMessageAction","originVideoId":"8sne4hKHNeo","originChannelId":"UC2hc-00y-MSR6eYA4eQ4tjQ"}]
      // Poll complete: 637 votes
      // Poll complete: 1.9K votes
      // split runs by {"text": "\n"}
      // has question: {text: "...", "bold": true}, {emoji: ...}
      //               {emoji: ...}, {text: "...", "bold": true}
      // otherwise:    {emoji: ...}, {text: " (\d%)"}
      const runs = renderer.message.runs;
      const runsNL = splitRunsByNewLines(runs);
      const hasQuestion = runsNL[0].some(
        (run) => "bold" in run && run.bold == true
      );
      const question = hasQuestion ? runsNL[0] : undefined;
      const total = /: (.+?) vote/.exec(runs[runs.length - 1].text)[1];
      const choiceStart = hasQuestion ? 1 : 0;
      const choices = runsNL.slice(choiceStart, -2).map((choiceRuns) => {
        const last = choiceRuns[choiceRuns.length - 1];
        const [lastTextFragment, votePercentage] = /(?:^(.+?))? \((\d+%)\)$/
          .exec(last.text)
          .slice(1);
        let text = choiceRuns;
        if (lastTextFragment) {
          text[text.length - 1].text = lastTextFragment;
        } else {
          text.pop();
        }
        return { text, votePercentage };
      });
      const parsed = {
        type: "addPollResultAction",
        id,
        question,
        total,
        choices,
      };
      return parsed;
    }
    default:
      debugLog$1(
        "[action required] unknown icon type (engagement message):",
        JSON.stringify(renderer)
      );
  }
}
// Placeholder chat
function parseLiveChatPlaceholderItemRenderer(renderer) {
  const id = renderer.id;
  const timestampUsec = renderer.timestampUsec;
  const timestamp = tsToDate(timestampUsec);
  const parsed = {
    type: "addPlaceholderItemAction",
    id,
    timestamp,
    timestampUsec,
  };
  return parsed;
}
// Mode change message
function parseLiveChatModeChangeMessageRenderer(renderer) {
  const text = stringify(renderer.text);
  const description = stringify(renderer.subtext);
  let mode = LiveChatMode.Unknown;
  if (/Slow mode/.test(text)) {
    mode = LiveChatMode.Slow;
  } else if (/Members-only mode/.test(text)) {
    mode = LiveChatMode.MembersOnly;
  } else if (/subscribers-only/.test(text)) {
    mode = LiveChatMode.SubscribersOnly;
  } else {
    debugLog$1(
      "[action required] Unrecognized mode (modeChangeAction):",
      JSON.stringify(renderer)
    );
  }
  const enabled = /(is|turned) on/.test(text);
  const parsed = {
    type: "modeChangeAction",
    mode,
    enabled,
    description,
  };
  return parsed;
}
// Sponsorships gift purchase announcement
function parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(renderer) {
  const id = renderer.id;
  /** timestampUsec can be undefined when passed from ticker action */
  const timestampUsec = renderer.timestampUsec;
  const timestamp = timestampUsec ? tsToDate(timestampUsec) : undefined;
  const authorChannelId = renderer.authorExternalChannelId;
  const header = renderer.header.liveChatSponsorshipsHeaderRenderer;
  const authorName = stringify(header.authorName);
  const authorPhoto = pickThumbUrl(header.authorPhoto);
  const channelName = header.primaryText.runs[3].text;
  const amount = parseInt(header.primaryText.runs[1].text, 10);
  const image = header.image.thumbnails[0].url;
  if (!authorName) {
    debugLog$1(
      "[action required] empty authorName (gift purchase)",
      JSON.stringify(renderer)
    );
  }
  const membership = parseMembership(
    header.authorBadges?.[header.authorBadges?.length - 1]
  );
  if (!membership) {
    debugLog$1(
      "[action required] empty membership (gift purchase)",
      JSON.stringify(renderer)
    );
  }
  if (!timestampUsec || !timestamp) {
    const tickerContent = {
      id,
      channelName,
      amount,
      membership,
      authorName,
      authorChannelId,
      authorPhoto,
      image,
    };
    return tickerContent;
  }
  const parsed = {
    type: "membershipGiftPurchaseAction",
    id,
    timestamp,
    timestampUsec,
    channelName,
    amount,
    membership,
    authorName,
    authorChannelId,
    authorPhoto,
    image,
  };
  return parsed;
}
// Sponsorships gift redemption announcement
function parseLiveChatSponsorshipsGiftRedemptionAnnouncementRenderer(renderer) {
  const id = renderer.id;
  const timestampUsec = renderer.timestampUsec;
  const timestamp = tsToDate(timestampUsec);
  const authorChannelId = renderer.authorExternalChannelId;
  const authorName = stringify(renderer.authorName);
  const authorPhoto = pickThumbUrl(renderer.authorPhoto);
  const senderName = renderer.message.runs[1].text;
  if (!authorName) {
    debugLog$1(
      "[action required] empty authorName (gift redemption)",
      JSON.stringify(renderer)
    );
  }
  const parsed = {
    type: "membershipGiftRedemptionAction",
    id,
    timestamp,
    timestampUsec,
    senderName,
    authorName,
    authorChannelId,
    authorPhoto,
  };
  return parsed;
}
// Moderation message
function parseLiveChatModerationMessageRenderer(renderer) {
  const id = renderer.id;
  const timestampUsec = renderer.timestampUsec;
  const timestamp = tsToDate(timestampUsec);
  const message = renderer.message.runs;
  const parsed = {
    type: "moderationMessageAction",
    id,
    timestamp,
    timestampUsec,
    message,
  };
  return parsed;
}

function parseAddLiveChatTickerItemAction(payload) {
  const { item, durationSec } = payload;
  const rendererType = Object.keys(item)[0];
  switch (rendererType) {
    // SuperChat Ticker
    case "liveChatTickerPaidMessageItemRenderer": {
      const renderer = item[rendererType];
      return parseLiveChatTickerPaidMessageItemRenderer(renderer, durationSec);
    }
    case "liveChatTickerPaidStickerItemRenderer": {
      // Super Sticker
      const renderer = item[rendererType];
      const parsed = parseLiveChatTickerPaidStickerItemRenderer(
        renderer,
        durationSec
      );
      return parsed;
    }
    case "liveChatTickerSponsorItemRenderer": {
      // Membership
      const renderer = item[rendererType];
      const parsed = parseLiveChatTickerSponsorItemRenderer(
        renderer,
        durationSec
      );
      return parsed;
    }
    default:
      debugLog$1(
        "[action required] Unrecognized renderer type (addLiveChatTickerItemAction):",
        rendererType,
        JSON.stringify(item)
      );
  }
  return unknown(payload);
}
function parseLiveChatTickerPaidMessageItemRenderer(renderer, durationSec) {
  const contents = parseLiveChatPaidMessageRenderer(
    renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer
      .liveChatPaidMessageRenderer
  );
  const authorPhoto = pickThumbUrl(renderer.authorPhoto);
  const parsed = {
    type: "addSuperChatTickerAction",
    id: renderer.id,
    authorChannelId: renderer.authorExternalChannelId,
    authorPhoto,
    amountText: stringify(renderer.amount),
    durationSec: Number(durationSec),
    fullDurationSec: renderer.fullDurationSec,
    contents,
    amountTextColor: parseColorCode(renderer.amountTextColor),
    startBackgroundColor: parseColorCode(renderer.startBackgroundColor),
    endBackgroundColor: parseColorCode(renderer.endBackgroundColor),
  };
  return parsed;
}
function parseLiveChatTickerPaidStickerItemRenderer(renderer, durationSec) {
  const contents = parseLiveChatPaidStickerRenderer(
    renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer
      .liveChatPaidStickerRenderer
  );
  const authorName =
    renderer.authorPhoto.accessibility?.accessibilityData.label;
  const authorChannelId = renderer.authorExternalChannelId;
  const authorPhoto = pickThumbUrl(renderer.authorPhoto);
  if (!authorName) {
    debugLog$1(
      "[action required] empty authorName (parseLiveChatTickerPaidStickerItemRenderer):",
      JSON.stringify(renderer.authorPhoto)
    );
  }
  // NOTE: tickerThumbnails can be more than single entry
  const tickerPackThumbnail = pickThumbUrl(renderer.tickerThumbnails[0]);
  const tickerPackName =
    renderer.tickerThumbnails[0].accessibility.accessibilityData.label;
  return {
    type: "addSuperStickerTickerAction",
    id: renderer.id,
    authorName: authorName,
    authorChannelId,
    authorPhoto,
    durationSec: Number(durationSec),
    fullDurationSec: renderer.fullDurationSec,
    tickerPackThumbnail,
    tickerPackName,
    contents,
    startBackgroundColor: parseColorCode(renderer.startBackgroundColor),
    endBackgroundColor: parseColorCode(renderer.endBackgroundColor),
  };
}
function parseLiveChatTickerSponsorItemRenderer(renderer, durationSec) {
  const authorChannelId = renderer.authorExternalChannelId;
  const authorPhoto = pickThumbUrl(renderer.sponsorPhoto);
  /**
   * - membership / membership milestone
   * detailIcon -> undefined
   * detailText -> {simpleText: "20"} // amount
   * showItemEndpoint.showLiveChatItemEndpoint.renderer -> liveChatMembershipItemRenderer
   *
   * - membership gift
   * detailIcon -> {iconType: "GIFT"}
   * detailText -> {runs: [{text: "Member"}]}
   * showItemEndpoint.showLiveChatItemEndpoint.renderer -> liveChatSponsorshipsGiftPurchaseAnnouncementRenderer
   * also liveChatSponsorshipsGiftPurchaseAnnouncementRenderer missing timestampUsec
   */
  // const iconType = renderer.detailIcon?.iconType;
  const rdr = renderer.showItemEndpoint.showLiveChatItemEndpoint.renderer;
  let contents;
  if ("liveChatMembershipItemRenderer" in rdr) {
    contents = parseLiveChatMembershipItemRenderer(
      rdr.liveChatMembershipItemRenderer
    );
  } else if ("liveChatSponsorshipsGiftPurchaseAnnouncementRenderer" in rdr) {
    contents = parseLiveChatSponsorshipsGiftPurchaseAnnouncementRenderer(
      rdr.liveChatSponsorshipsGiftPurchaseAnnouncementRenderer
    );
  } else {
    const key = Object.keys(rdr)[0];
    debugLog$1(
      `[action required] Unrecognized renderer '${key}' (parseLiveChatTickerSponsorItemRenderer):`,
      JSON.stringify(renderer)
    );
    throw new Error(
      `Unrecognized renderer (parseLiveChatTickerSponsorItemRenderer): ${key}`
    );
  }
  return {
    type: "addMembershipTickerAction",
    id: renderer.id,
    authorChannelId,
    authorPhoto,
    durationSec: Number(durationSec),
    fullDurationSec: renderer.fullDurationSec,
    detailText: renderer.detailText,
    contents,
    detailTextColor: parseColorCode(renderer.detailTextColor),
    startBackgroundColor: parseColorCode(renderer.startBackgroundColor),
    endBackgroundColor: parseColorCode(renderer.endBackgroundColor),
  };
}

function parseCloseLiveChatActionPanelAction(payload) {
  const parsed = {
    type: "closePanelAction",
    targetPanelId: payload.targetPanelId,
    skipOnDismissCommand: payload.skipOnDismissCommand,
  };
  return parsed;
}

function parseMarkChatItemAsDeletedAction(payload) {
  const statusText = payload.deletedStateMessage.runs[0].text;
  // {"deletedStateMessage":{"runs":[{"text":"Message deleted by "},{"text":"uetchy","bold":true},{"text":"."}]},"targetItemId":"Ch4KGkNONjBtTHZWX1BjQ0ZSTUNyUVlkclZBRnlREgA%3D","showOriginalContentMessage":{"runs":[{"text":"View deleted message","italics":true}]}
  // [{"text":"Message deleted by "},{"text":"uetchy","bold":true},{"text":"."}]
  switch (statusText) {
    case "[message retracted]":
    case "[message deleted]":
    case "Message deleted by ":
      break;
    default:
      debugLog$1(
        "[action required] Unrecognized deletion status:",
        statusText,
        JSON.stringify(payload)
      );
  }
  const executor =
    statusText === "Message deleted by "
      ? payload.deletedStateMessage.runs[1].text
      : undefined;
  const retracted = statusText === "[message retracted]";
  const parsed = {
    type: "markChatItemAsDeletedAction",
    retracted,
    targetId: payload.targetItemId,
    executor,
    timestamp: new Date(),
  };
  return parsed;
}

function parseMarkChatItemsByAuthorAsDeletedAction(payload) {
  return {
    type: "markChatItemsByAuthorAsDeletedAction",
    channelId: payload.externalChannelId,
    timestamp: new Date(),
  };
}

function parseRemoveBannerForLiveChatCommand(payload) {
  // remove pinned item
  const parsed = {
    type: "removeBannerAction",
    targetActionId: payload.targetActionId,
  };
  return parsed;
}

function parseRemoveChatItemAction(payload) {
  const parsed = {
    type: "removeChatItemAction",
    targetId: payload.targetItemId,
    timestamp: new Date(),
  };
  return parsed;
}

function parseReplaceChatItemAction(payload) {
  const parsedItem = parseReplacementItem(payload.replacementItem);
  const parsed = {
    type: "replaceChatItemAction",
    targetItemId: payload.targetItemId,
    replacementItem: parsedItem,
  };
  return parsed;
}
function parseReplacementItem(item) {
  if ("liveChatPlaceholderItemRenderer" in item) {
    return parseLiveChatPlaceholderItemRenderer(
      item.liveChatPlaceholderItemRenderer
    );
  } else if ("liveChatTextMessageRenderer" in item) {
    return parseLiveChatTextMessageRenderer(item.liveChatTextMessageRenderer);
  } else if ("liveChatPaidMessageRenderer" in item) {
    // TODO: check if YTLiveChatPaidMessageRendererContainer will actually appear
    debugLog$1(
      "[action required] observed liveChatPaidMessageRenderer as a replacementItem"
    );
    return parseLiveChatPaidMessageRenderer(item.liveChatPaidMessageRenderer);
  } else {
    debugLog$1(
      "[action required] unrecognized replacementItem type:",
      JSON.stringify(item)
    );
    return item;
  }
}

function parseShowLiveChatActionPanelAction(payload) {
  const panelRdr = payload.panelToShow.liveChatActionPanelRenderer;
  const rendererType = Object.keys(panelRdr.contents)[0];
  switch (rendererType) {
    case "pollRenderer": {
      const rdr = panelRdr.contents.pollRenderer;
      const authorName =
        rdr.header.pollHeaderRenderer.metadataText.runs[0].text;
      const parsed = {
        type: "showPollPanelAction",
        targetId: panelRdr.targetId,
        id: panelRdr.id,
        choices: rdr.choices,
        question: rdr.header.pollHeaderRenderer.pollQuestion?.simpleText,
        authorName,
        authorPhoto: pickThumbUrl(rdr.header.pollHeaderRenderer.thumbnail),
        pollType: rdr.header.pollHeaderRenderer.liveChatPollType,
      };
      return parsed;
    }
    default: {
      debugLog$1(
        "[action required] unrecognized rendererType (parseShowLiveChatActionPanelAction):",
        JSON.stringify(payload)
      );
    }
  }
  const parsed = {
    type: "showPanelAction",
    panelToShow: payload.panelToShow,
  };
  return parsed;
}

function parseShowLiveChatTooltipCommand(payload) {
  const rdr = payload["tooltip"]["tooltipRenderer"];
  const parsed = {
    type: "showTooltipAction",
    // live-chat-banner
    targetId: rdr.targetId,
    // { "runs": [{ "text": "Click to show less" }] }
    detailsText: rdr.detailsText,
    // TOOLTIP_POSITION_TYPE_BELOW
    suggestedPosition: rdr.suggestedPosition.type,
    // TOOLTIP_DISMISS_TYPE_TAP_ANYWHERE
    dismissStrategy: rdr.dismissStrategy.type,
    promoConfig: rdr.promoConfig,
    dwellTimeMs: rdr.dwellTimeMs ? parseInt(rdr.dwellTimeMs, 10) : undefined,
  };
  return parsed;
}

function parseUpdateLiveChatPollAction(payload) {
  const rdr = payload.pollToUpdate.pollRenderer;
  const header = rdr.header.pollHeaderRenderer;
  // "runs": [
  //   { "text": "朝陽にいな / Nina Ch." },
  //   { "text": " • " },
  //   { "text": "just now" },
  //   { "text": " • " },
  //   { "text": "23 votes" }
  // ]
  const meta = header.metadataText.runs;
  const authorName = meta[0].text;
  const elapsedText = meta[2].text;
  const voteCount = parseInt(meta[4].text, 10);
  const parsed = {
    type: "updatePollAction",
    id: rdr.liveChatPollId,
    authorName,
    authorPhoto: pickThumbUrl(header.thumbnail),
    question: header.pollQuestion?.simpleText,
    choices: rdr.choices,
    elapsedText,
    voteCount,
    pollType: header.liveChatPollType,
  };
  return parsed;
}

/**
 * Parse raw action object and returns Action
 */
function parseAction(action) {
  const filteredActions = omitTrackingParams(action);
  const type = Object.keys(filteredActions)[0];
  switch (type) {
    case "addChatItemAction":
      return parseAddChatItemAction(action[type]);
    case "markChatItemsByAuthorAsDeletedAction":
      return parseMarkChatItemsByAuthorAsDeletedAction(action[type]);
    case "markChatItemAsDeletedAction":
      return parseMarkChatItemAsDeletedAction(action[type]);
    case "addLiveChatTickerItemAction":
      return parseAddLiveChatTickerItemAction(action[type]);
    case "replaceChatItemAction":
      return parseReplaceChatItemAction(action[type]);
    case "addBannerToLiveChatCommand":
      return parseAddBannerToLiveChatCommand(action[type]);
    case "removeBannerForLiveChatCommand":
      return parseRemoveBannerForLiveChatCommand(action[type]);
    case "showLiveChatTooltipCommand":
      return parseShowLiveChatTooltipCommand(action[type]);
    case "showLiveChatActionPanelAction":
      return parseShowLiveChatActionPanelAction(action[type]);
    case "updateLiveChatPollAction":
      return parseUpdateLiveChatPollAction(action[type]);
    case "closeLiveChatActionPanelAction":
      return parseCloseLiveChatActionPanelAction(action[type]);
    case "removeChatItemAction":
      return parseRemoveChatItemAction(action[type]);
    default: {
      debugLog$1(
        "[action required] Unrecognized action type:",
        JSON.stringify(action)
      );
    }
  }
  return unknown(action);
}
/** Unknown action used for unexpected payloads. You should implement an appropriate action parser as soon as you discover this action in the production.
 */
function unknown(payload) {
  return {
    type: "unknown",
    payload,
  };
}

// OK duration=">0" => Archived (replay chat may be available)
// OK duration="0" => Live (chat may be available)
// LIVE_STREAM_OFFLINE => Offline (chat may be available)
function assertPlayability(playabilityStatus) {
  if (!playabilityStatus) {
    throw new Error("playabilityStatus missing");
  }
  switch (playabilityStatus.status) {
    case "ERROR":
      throw new UnavailableError(playabilityStatus.reason);
    case "LOGIN_REQUIRED":
      throw new NoPermissionError(playabilityStatus.reason);
    case "UNPLAYABLE": {
      if (
        "playerLegacyDesktopYpcOfferRenderer" in playabilityStatus.errorScreen
      ) {
        throw new MembersOnlyError(playabilityStatus.reason);
      }
      throw new NoStreamRecordingError(playabilityStatus.reason);
    }
  }
}
function findCfg(data) {
  const match = /ytcfg\.set\(({.+?})\);/.exec(data);
  if (!match) return;
  return JSON.parse(match[1]);
}
function findIPR(data) {
  const match = /var ytInitialPlayerResponse = (.+?);var meta/.exec(data);
  if (!match) return;
  return JSON.parse(match[1]);
}
function findInitialData(data) {
  const match =
    /(?:var ytInitialData|window\["ytInitialData"\]) = (.+?);<\/script>/.exec(
      data
    );
  if (!match) return;
  return JSON.parse(match[1]);
}
function findEPR(data) {
  return findCfg(data)?.PLAYER_VARS?.embedded_player_response;
}
function findPlayabilityStatus(data) {
  const ipr = findIPR(data);
  return ipr?.playabilityStatus;
}
// embed disabled https://www.youtube.com/embed/JfJYHfrOGgQ
// unavailable video https://www.youtube.com/embed/YEAINgb2xfo
// private video https://www.youtube.com/embed/UUjdYGda4N4
// 200 OK
async function parseMetadataFromEmbed(html) {
  const epr = findEPR(html);
  const ps = epr.previewPlayabilityStatus;
  assertPlayability(ps);
  const ep = epr.embedPreview;
  const prevRdr = ep.thumbnailPreviewRenderer;
  const vdRdr = prevRdr.videoDetails.embeddedPlayerOverlayVideoDetailsRenderer;
  const expRdr =
    vdRdr.expandedRenderer.embeddedPlayerOverlayVideoDetailsExpandedRenderer;
  const title = runsToString(prevRdr.title.runs);
  const thumbnail =
    prevRdr.defaultThumbnail.thumbnails[
      prevRdr.defaultThumbnail.thumbnails.length - 1
    ].url;
  const channelId = expRdr.subscribeButton.subscribeButtonRenderer.channelId;
  const channelName = runsToString(expRdr.title.runs);
  const channelThumbnail = vdRdr.channelThumbnail.thumbnails[0].url;
  const duration = Number(prevRdr.videoDurationSeconds);
  return {
    title,
    thumbnail,
    channelId,
    channelName,
    channelThumbnail,
    duration,
    status: ps.status,
    statusText: ps.reason,
  };
}
function parseMetadataFromWatch(html) {
  const initialData = findInitialData(html);
  const playabilityStatus = findPlayabilityStatus(html);
  assertPlayability(playabilityStatus);
  // TODO: initialData.contents.twoColumnWatchNextResults.conversationBar.conversationBarRenderer.availabilityMessage.messageRenderer.text.runs[0].text === 'Chat is disabled for this live stream.'
  const results =
    initialData.contents?.twoColumnWatchNextResults?.results.results;
  const primaryInfo = results.contents[0].videoPrimaryInfoRenderer;
  const videoOwner =
    results.contents[1].videoSecondaryInfoRenderer.owner.videoOwnerRenderer;
  const title = runsToString(primaryInfo.title.runs);
  const channelId = videoOwner.navigationEndpoint.browseEndpoint.browseId;
  const channelName = runsToString(videoOwner.title.runs);
  const isLive = primaryInfo.viewCount.videoViewCountRenderer.isLive ?? false;
  return {
    title,
    channelId,
    channelName,
    isLive,
  };
}

var B64Type;
(function (B64Type) {
  B64Type["B1"] = "b1";
  B64Type["B2"] = "b2";
})(B64Type || (B64Type = {}));
function urlsafeB64e(payload) {
  return encodeURIComponent(u8tob64(payload));
}
function urlsafeB64d(payload) {
  return b64tou8(decodeURIComponent(payload));
}
function b64e(payload, type) {
  switch (type) {
    case B64Type.B1:
      return urlsafeB64e(payload);
    case B64Type.B2:
      const urlsafe = urlsafeB64e(payload);
      const encoded = new TextEncoder().encode(urlsafe);
      return u8tob64(encoded);
    // return u8tob64(new TextEncoder().encode(urlsafeB64e(payload)));
    default:
      throw new Error("Invalid b64type: " + type);
  }
}
function b64d(payload, type) {
  switch (type) {
    case B64Type.B1:
      return urlsafeB64d(payload);
    case B64Type.B2:
      const b64 = b64tou8(payload);
      const decoded = new TextDecoder().decode(b64);
      return urlsafeB64d(decoded);
    // return urlsafeB64d(new TextDecoder().decode(b64tou8(payload)));
    default:
      throw new Error("Invalid b64type: " + type);
  }
}

class ProtoBufReader {
  buf;
  c;
  s = 0;
  static splitHeader(n) {
    return [n >> 3n, Number(n & 0x7n)];
  }
  static parseVariant(buf) {
    return buf.reduce(
      (r, b, i) => r | ((BigInt(b) & 0x7fn) << (BigInt(i) * 7n)),
      0n
    );
  }
  constructor(buf) {
    this.buf = buf;
    this.c = 0;
  }
  eat(bytes) {
    if (this.isEnded()) return null;
    return this.buf.slice(this.c, (this.c += bytes));
  }
  eatUInt32() {
    if (this.isEnded()) return null;
    try {
      const n = new DataView(this.buf.buffer).getUint32(this.c, true);
      // const n = this.buf.readUInt32LE(this.c);
      this.c += 4;
      return n;
    } catch (err) {
      return null;
    }
  }
  eatUInt64() {
    if (this.isEnded()) return null;
    try {
      const n = new DataView(this.buf.buffer).getBigUint64(this.c, true);
      // const n = this.buf.readBigUInt64LE(this.c);
      this.c += 8;
      return n;
    } catch (err) {
      return null;
    }
  }
  eatVariant() {
    if (this.isEnded()) return null;
    const start = this.c;
    while (this.buf[this.c] & 0x80) this.c += 1;
    const rawBuf = this.buf.slice(start, (this.c += 1));
    return ProtoBufReader.parseVariant(rawBuf);
  }
  save() {
    this.s = this.c;
  }
  rewind(b) {
    if (b !== undefined) {
      this.c -= b;
    } else {
      this.c = this.s;
    }
  }
  remainingBytes() {
    return this.buf.length - this.c;
  }
  isEnded() {
    return this.c === this.buf.length;
  }
}

const debugLog = debug("masterchat:pb");
function parsePb(input, depth = 0) {
  function logger(...obj) {
    debugLog(depth + "".padEnd(depth * 2, " "), obj.join(" "));
  }
  const pbr = new ProtoBufReader(input);
  const tokens = [];
  let nextHeader;
  while ((nextHeader = pbr.eatVariant())) {
    logger(" rawHeader=", nextHeader.toString(2));
    const [fid, type] = ProtoBufReader.splitHeader(nextHeader);
    logger(`┌(fid: ${fid}: type: ${type})`);
    switch (type) {
      case 0: {
        const v = pbr.eatVariant();
        logger("└(var)", v);
        if (v == null) throw new Error("Invalid sequence (v)");
        tokens.push({ fid, type: PBType.V, v });
        break;
      }
      case 2: {
        pbr.save();
        const len = pbr.eatVariant();
        logger(`└struct [length=${len}]>`);
        if (len == null) throw new Error("Invalid sequence (ld)");
        if (len > pbr.remainingBytes()) {
          logger("!overSized");
          pbr.rewind();
        } else {
          const inner = pbr.eat(Number(len));
          if (inner == null) {
            logger("!empty");
            pbr.rewind();
          } else {
            const v = parsePb(inner, depth + 1);
            tokens.push({ fid, type: PBType.LD, v });
            break;
          }
        }
      }
      case 1: {
        pbr.save();
        const v = pbr.eatUInt64();
        if (v !== null) {
          logger("└f64>", v);
          tokens.push({ fid, type: PBType.F64, v });
          break;
        }
        // throw new Error("Invalid sequence (f64)");
        pbr.rewind();
      }
      case 5: {
        pbr.save();
        const v = pbr.eatUInt32();
        if (v !== null) {
          logger("└f32>", v);
          tokens.push({ fid, type: PBType.F32, v });
          break;
        }
        // throw new Error("Invalid sequence (f32)");
        pbr.rewind();
      }
      default: {
        // throw new Error("Unknown type: " + type);
        // debugLog(input);
        const res = new TextDecoder().decode(input);
        logger("└str>", res);
        return res;
      }
    }
  }
  if (tokens.length === 0) {
    throw new Error("Empty sequence");
  }
  return tokens;
}

function csc(videoId, { top = false, highlightedCommentId } = {}) {
  const sortType = top ? 0 : 1;
  return b64e(
    concatu8([
      ld(2, ld(2, videoId)),
      vt(3, 6),
      ld(6, [
        ld(4, [
          ld(4, videoId),
          vt(6, sortType),
          vt(15, 2),
          ...(highlightedCommentId ? [ld(16, highlightedCommentId)] : []),
        ]),
        // vt(5, 50),
        ld(8, "comments-section"),
      ]),
    ]),
    B64Type.B1
  );
}
function liveReloadContinuation(origin, { top = false } = {}) {
  const chatType = top ? 4 : 1;
  return b64e(
    ld(119693434, [ld(3, hdt(origin)), vt(6, 1), ld(16, vt(1, chatType))]),
    B64Type.B1
  );
}
function liveTimedContinuation(
  origin,
  { top = false, since = new Date() } = {}
) {
  const chatType = top ? 4 : 1;
  const t1 = Date.now() * 1000;
  const t2 = since.getTime() * 1000;
  return b64e(
    ld(119693434, [
      ld(3, hdt(origin)),
      vt(5, t2),
      vt(6, 0),
      vt(8, 1),
      ld(9, [vt(1, 1), vt(3, 0), vt(4, 0), vt(10, t1), vt(11, 3), vt(15, 0)]),
      vt(10, t1),
      vt(11, t1),
      ld(16, vt(1, chatType)),
      vt(17, 0),
      vt(20, t1),
    ]),
    B64Type.B1
  );
}
function replayReloadContinuation(origin, { top = false, seekMs = 0 } = {}) {
  const chatType = top ? 4 : 1;
  return b64e(
    ld(156074452, [
      ld(3, hdt(origin)),
      vt(8, 1),
      ld(11, vt(2, seekMs)),
      ld(14, vt(1, chatType)),
      vt(15, 1),
    ]),
    B64Type.B1
  );
}
function replayTimedContinuation(origin, { top = false, seekMs = 0 } = {}) {
  const chatType = top ? 4 : 1;
  return b64e(
    ld(156074452, [
      ld(3, hdt(origin)),
      vt(5, seekMs * 1000),
      vt(8, 0),
      vt(9, 4),
      ld(10, [
        vt(4, 0),
        vt(22, 0), // recently added
      ]),
      ld(14, vt(1, chatType)),
      vt(15, 0),
    ]),
    B64Type.B1
  );
}
function sendMessageParams(to) {
  return b64e(concatu8([ld(1, cvToken(to)), vt(2, 2), vt(3, 4)]), B64Type.B2);
}
function removeMessageParams(chatId, origin, retract = true) {
  return b64e(
    concatu8([
      ld(1, cvToken(origin)),
      ld(2, ld(1, chatToken(chatId))),
      vt(10, retract ? 1 : 2),
      vt(11, 1),
    ]),
    B64Type.B2
  );
}
function timeoutParams(channelId, origin) {
  return b64e(
    concatu8([
      ld(1, cvToken(origin)),
      ld(6, ld(1, truc(channelId))),
      vt(10, 2),
      vt(11, 1),
    ]),
    B64Type.B2
  );
}
function hideParams(channelId, origin, undo = false) {
  const op = undo ? 5 : 4;
  return b64e(
    concatu8([
      ld(1, cvToken(origin)),
      ld(op, ld(1, truc(channelId))),
      vt(10, 2),
      vt(11, 1),
    ]),
    B64Type.B2
  );
}
function pinParams(chatId, origin) {
  return b64e(
    ld(1, [
      ld(1, cvToken(origin)),
      ld(2, chatToken(chatId)),
      vt(3, 1),
      vt(10, 2),
      vt(11, 1),
    ]),
    B64Type.B2
  );
}
function unpinParams(actionId, origin) {
  return b64e(
    ld(1, [
      ld(1, cvToken(origin)),
      ld(2, ld(1, ld(1, actionId))),
      vt(3, 2),
      vt(10, 2),
      vt(11, 1),
    ]),
    B64Type.B2
  );
}
function addModeratorParams(tgt, origin, undo = false) {
  // TODO: support undo op
  b64e(concatu8([ld(1, cvToken(origin)), ld(2, ld(1, truc(tgt)))]), B64Type.B2);
}
function getContextMenuParams(chatId, authorChannelId, origin) {
  return b64e(
    concatu8([
      ld(1, chatToken(chatId)),
      ld(3, cvToken(origin)),
      vt(4, 2),
      vt(5, 4),
      ld(6, ld(1, authorChannelId)),
    ]),
    B64Type.B2
  );
}
function getTranscriptParams(videoId, language, autoGenerated = true) {
  return b64e(
    concatu8([
      ld(1, videoId),
      ld(2, transcriptFormatToken(language, autoGenerated)),
      vt(3, 1),
      ld(5, "engagement-panel-searchable-transcript-search-panel"),
      vt(6, 1),
    ]),
    B64Type.B1
  );
}
function transcriptFormatToken(language, autoGenerated = true) {
  return b64e(
    concatu8([ld(1, autoGenerated ? "asr" : ""), ld(2, language), ld(3, "")]),
    B64Type.B1
  );
}
/**
 * Utils
 */
function cvToken(p) {
  return ld(5, [ld(1, p.channelId), ld(2, p.videoId)]);
}
function chatToken(chatId) {
  return b64d(chatId, B64Type.B1);
  // const i = parse(b64d(chatId, B64Type.B1)) as PBToken[];
  // const j = i[0].v as PBToken[];
  // const k = j.map((pbv) => pbv.v) as [string, string];
  // return [ld(1, k[0]), ld(2, k[1])];
}
function hdt(tgt) {
  return u8tob64(
    concatu8([
      ld(1, cvToken(tgt)),
      ld(3, ld(48687757, ld(1, tgt.videoId))),
      vt(4, 1),
    ])
  );
}
function truc(i) {
  return i.replace(/^UC/, "");
}
/**
 * Builder
 */
function ld(fid, payload) {
  const b =
    typeof payload === "string"
      ? new TextEncoder().encode(payload)
      : Array.isArray(payload)
      ? concatu8(payload)
      : payload;
  const bLen = b.byteLength;
  return concatu8([bitou8(pbh(fid, 2)), bitou8(encv(BigInt(bLen))), b]);
}
function vt(fid, payload) {
  return concatu8([bitou8(pbh(fid, 0)), bitou8(payload)]);
}
// function f3(fid: bigint | number, payload: bigint): Buffer {
//   while (payload >> 8n) {
//     const b = payload & 8n;
//   }
// }
function pbh(fid, type) {
  return encv((BigInt(fid) << 3n) | BigInt(type));
}
function encv(n) {
  let s = 0n;
  while (n >> 7n) {
    s = (s << 8n) | 0x80n | (n & 0x7fn);
    n >>= 7n;
  }
  s = (s << 8n) | n;
  return s;
}

class Masterchat extends EventEmitter {
  videoId;
  channelId;
  isLive;
  channelName;
  title;
  axiosInstance;
  listener = null;
  listenerAbortion = new AbortController();
  credentials;
  /*
   * Private API
   */
  async postWithRetry(input, body, options) {
    // this.log("postWithRetry", input);
    const errors = [];
    let remaining = options?.retry ?? 0;
    const retryInterval = options?.retryInterval ?? 1000;
    while (true) {
      try {
        return await this.post(input, body);
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "canceled") throw new AbortError();
          errors.push(err);
          if (remaining > 0) {
            await delay(retryInterval);
            remaining -= 1;
            debugLog$1(
              `Retrying(postJson) remaining=${remaining} after=${retryInterval}`
            );
            continue;
          }
          err.errors = errors;
        }
        throw err;
      }
    }
  }
  async post(input, body, config = {}) {
    if (!input.startsWith("http")) {
      input = DO + input;
    }
    const res = await this.axiosInstance.request({
      ...config,
      url: input,
      signal: this.listenerAbortion.signal,
      method: "POST",
      headers: {
        ...config.headers,
        "Content-Type": "application/json",
        ...(this.credentials && buildAuthHeaders(this.credentials)),
        ...DH,
      },
      data: body,
    });
    return res.data;
  }
  async get(input, config = {}) {
    if (!input.startsWith("http")) {
      input = DO + input;
    }
    const res = await this.axiosInstance.request({
      ...config,
      url: input,
      signal: this.listenerAbortion.signal,
      headers: {
        ...config.headers,
        ...(this.credentials && buildAuthHeaders(this.credentials)),
        ...DH,
      },
    });
    return res.data;
  }
  log(label, ...obj) {
    debugLog$1(`${label}(${this.videoId}):`, ...obj);
  }
  cvPair() {
    return {
      channelId: this.channelId,
      videoId: this.videoId,
    };
  }
  /**
   * NOTE: urlParams: pbj=1|0
   */
  async getActionCatalog(contextMenuEndpointParams) {
    const query = new URLSearchParams({
      params: contextMenuEndpointParams,
    });
    const endpoint = EP_GICM + "&" + query.toString();
    const response = await this.postWithRetry(endpoint, withContext(), {
      retry: 2,
    });
    if (response.error) {
      // TODO: handle this
      // {
      //   "error": {
      //     "code": 400,
      //     "message": "Precondition check failed.",
      //     "errors": [
      //       {
      //         "message": "Precondition check failed.",
      //         "domain": "global",
      //         "reason": "failedPrecondition"
      //       }
      //     ],
      //     "status": "FAILED_PRECONDITION"
      //   }
      // }
      return undefined;
    }
    let items = {};
    for (const item of response.liveChatItemContextMenuSupportedRenderers
      .menuRenderer.items) {
      const rdr =
        item.menuServiceItemRenderer ?? item.menuNavigationItemRenderer;
      const text = rdr.text.runs[0].text;
      switch (text) {
        case "Report": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.report = buildMeta(endpoint);
          break;
        }
        case "Block": {
          const endpoint =
            item.menuNavigationItemRenderer.navigationEndpoint
              .confirmDialogEndpoint.content.confirmDialogRenderer.confirmButton
              .buttonRenderer.serviceEndpoint;
          items.block = buildMeta(endpoint);
          break;
        }
        case "Unblock": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.unblock = buildMeta(endpoint);
          break;
        }
        case "Pin message": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.pin = buildMeta(endpoint);
          break;
        }
        case "Unpin message": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.unpin = buildMeta(endpoint);
          break;
        }
        case "Remove": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.remove = buildMeta(endpoint);
          break;
        }
        case "Put user in timeout": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.timeout = buildMeta(endpoint);
          break;
        }
        case "Hide user on this channel": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.hide = buildMeta(endpoint);
          break;
        }
        case "Unhide user on this channel": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.unhide = buildMeta(endpoint);
          break;
        }
        case "Add moderator": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.addModerator = buildMeta(endpoint);
          break;
        }
        case "Remove moderator": {
          const endpoint = item.menuServiceItemRenderer.serviceEndpoint;
          items.removeModerator = buildMeta(endpoint);
          break;
        }
      }
    }
    return items;
  }
  async sendAction(actionInfo) {
    const url = actionInfo.url;
    let json;
    if (actionInfo.isPost) {
      json = await this.post(url, {
        body: withContext({
          params: actionInfo.params,
        }),
      });
    } else {
      json = await this.get(url);
    }
    if (!json.success) {
      throw new Error(`Failed to perform action: ` + JSON.stringify(json));
    }
    return json.actions;
  }
  /*
   * Public API
   */
  /**
   * Useful when you don't know channelId or isLive status
   */
  static async init(videoIdOrUrl, options = {}) {
    const videoId = toVideoId(videoIdOrUrl);
    if (!videoId) {
      throw new InvalidArgumentError(
        `Failed to extract video id: ${videoIdOrUrl}`
      );
    }
    // set channelId "" as populateMetadata will fill out it anyways
    const mc = new Masterchat(videoId, "", options);
    await mc.populateMetadata();
    return mc;
  }
  /**
   * Much faster than Masterchat.init
   */
  constructor(videoId, channelId, { mode, credentials, axiosInstance } = {}) {
    super();
    this.videoId = videoId;
    this.channelId = channelId;
    this.isLive =
      mode === "live" ? true : mode === "replay" ? false : undefined;
    this.axiosInstance =
      axiosInstance ??
      axios.create({
        timeout: 4000,
      });
    this.setCredentials(credentials);
  }
  /**
   * Context API
   */
  async populateMetadata() {
    const metadata = await this.fetchMetadataFromWatch(this.videoId);
    this.title = metadata.title;
    this.channelId = metadata.channelId;
    this.channelName = metadata.channelName;
    this.isLive ??= metadata.isLive;
  }
  async fetchMetadataFromWatch(id) {
    try {
      const html = await this.get("/watch?v=" + this.videoId);
      return parseMetadataFromWatch(html);
    } catch (err) {
      // Check ban status
      if (err.code === "429") {
        throw new AccessDeniedError("Rate limit exceeded: " + this.videoId);
      }
      throw err;
    }
  }
  async fetchMetadataFromEmbed(id) {
    try {
      const html = await this.get(`/embed/${id}`);
      return parseMetadataFromEmbed(html);
    } catch (err) {
      if (err.code === "429")
        throw new AccessDeniedError("Rate limit exceeded: " + id);
    }
  }
  get metadata() {
    return {
      videoId: this.videoId,
      channelId: this.channelId,
      channelName: this.channelName,
      title: this.title,
      isLive: this.isLive,
    };
  }
  /**
   * Set credentials. This will take effect on the subsequent requests.
   */
  setCredentials(credentials) {
    if (typeof credentials === "string") {
      credentials = JSON.parse(new TextDecoder().decode(b64tou8(credentials)));
    }
    this.credentials = credentials;
  }
  /**
   * (EventEmitter API)
   * start listening live stream
   */
  listen(iterateOptions) {
    if (this.listener) return this.listener;
    this.listenerAbortion = new AbortController();
    let handledFirstResponse = false;
    const makePromise = async ({ iterateOptions }) => {
      // NOTE: `ignoreFirstResponse=false` means you might get chats already processed before when recovering MasterchatAgent from error. Make sure you have unique index for chat id to prevent duplication.
      for await (const res of this.iterate(iterateOptions)) {
        handledFirstResponse = true;
        this.emit("data", res, this);
        const { actions } = res;
        this.emit("actions", actions, this);
        // only normal chats
        if (this.listenerCount("chats") > 0 || this.listenerCount("chat") > 0) {
          const chats = actions.filter(
            (action) => action.type === "addChatItemAction"
          );
          this.emit("chats", chats, this);
          chats.forEach((chat) => this.emit("chat", chat, this));
        }
      }
    };
    this.listener = makePromise({
      iterateOptions,
    })
      .then(() => {
        // live chat closed by streamer
        this.emit("end", null);
      })
      .catch((err) => {
        if (err instanceof AbortError) return;
        // special treatment for unrecoverable unavailable/private errors
        // emit 'end' only if ->
        //   (not first response) && unrecoverable (private || unavailable)
        if (
          err instanceof MasterchatError &&
          [
            "private",
            "unavailable",
            "disabled", // disabled ()
          ].includes(err.code) &&
          handledFirstResponse
        ) {
          const reason = (() => {
            switch (err.code) {
              case "private":
                return "privated";
              case "unavailable":
                return "deleted";
              case "disabled":
                return "disabled";
              default:
                return null;
            }
          })();
          this.emit("end", reason);
          return;
        }
        this.emit("error", err);
      })
      .finally(() => {
        this.listener = null;
      });
    return this.listener;
  }
  /**
   * (EventEmitter API)
   * stop listening live stream
   */
  stop() {
    if (!this.listener) return;
    this.listenerAbortion.abort();
    this.emit("end", "aborted");
  }
  /**
   * (EventEmitter API)
   * returns listener status
   */
  get stopped() {
    return this.listener === null;
  }
  /**
   * AsyncIterator API
   */
  iter(options) {
    return AsyncIterator.from(this.iterate(options)).flatMap(
      (action) => action.actions
    );
  }
  /**
   * (AsyncGenerator API)
   * Iterate until live stream ends
   */
  async *iterate({
    topChat = false,
    ignoreFirstResponse = false,
    continuation,
  } = {}) {
    const signal = this.listenerAbortion.signal;
    if (signal.aborted) {
      throw new AbortError();
    }
    let token = continuation ? continuation : { top: topChat };
    let treatedFirstResponse = false;
    // continuously fetch chat fragments
    while (true) {
      const res = await this.fetch(token);
      const startMs = Date.now();
      // handle chats
      if (!(ignoreFirstResponse && !treatedFirstResponse)) {
        yield res;
      }
      treatedFirstResponse = true;
      // refresh continuation token
      const { continuation } = res;
      if (!continuation) {
        // stream ended normally
        break;
      }
      token = continuation.token;
      if (this.isLive ?? true) {
        const driftMs = Date.now() - startMs;
        const timeoutMs = continuation.timeoutMs - driftMs;
        if (timeoutMs > 500) {
          await delay(timeoutMs, signal);
        }
      }
    }
  }
  async fetch(tokenOrOptions, maybeOptions) {
    const options =
      (typeof tokenOrOptions === "string" ? maybeOptions : tokenOrOptions) ??
      {};
    const topChat = options.topChat ?? false;
    const target = this.cvPair();
    let retryRemaining = 5;
    const retryInterval = 1000;
    let requestUrl = "";
    let requestBody;
    let payload;
    function applyNewLiveStatus(isLive) {
      requestUrl = isLive ? EP_GLC : EP_GLCR;
      const continuation =
        typeof tokenOrOptions === "string"
          ? tokenOrOptions
          : isLive
          ? liveReloadContinuation(target, { top: topChat })
          : replayTimedContinuation(target, { top: topChat });
      requestBody = withContext({
        continuation,
      });
    }
    applyNewLiveStatus(this.isLive ?? true);
    loop: while (true) {
      try {
        payload = await this.post(requestUrl, requestBody);
      } catch (err) {
        // handle user cancallation
        if (err?.message === "canceled") {
          this.log(`fetch`, `Request canceled`);
          throw new AbortError();
        }
        // handle server errors
        if (err?.isAxiosError) {
          const { code: axiosErrorCode, response } = err;
          // handle early timeout
          if (
            axiosErrorCode === "ECONNABORTED" ||
            axiosErrorCode === "ERR_REQUEST_ABORTED"
          ) {
            if (retryRemaining > 0) {
              retryRemaining -= 1;
              this.log(
                `fetch`,
                `Retrying ${retryRemaining} / ${retryInterval}ms cause=EARLY_TIMEOUT`
              );
              await delay(retryInterval);
              continue loop;
            }
          }
          if (!response) {
            this.log(
              "fetch",
              `Empty error response ${err} (${axiosErrorCode})`
            );
            throw new Error(
              `Axios got empty error response: ${err} (${axiosErrorCode})`
            );
          }
          /** error.code ->
           * 400: request contains an invalid argument
           *   - when attempting to access livechat while it is already in replay mode
           * 403: no permission
           *   - video was made private by uploader
           *   - something went wrong (server-side)
           * 404: not found
           *   - removed by uploader
           * 500: internal error
           *   - server-side failure
           * 503: The service is currently unavailable
           *   - temporary server-side failure
           */
          const { code, status, message } = response.data.error;
          this.log(`fetch`, `API error: ${code} (${status}): ${message}`);
          switch (status) {
            // stream got privated
            case YTChatErrorStatus.PermissionDenied:
              throw new NoPermissionError(message);
            // stream got deleted
            case YTChatErrorStatus.NotFound:
              throw new UnavailableError(message);
            // stream already turned into archive OR received completely malformed token
            case YTChatErrorStatus.Invalid:
              throw new InvalidArgumentError(message);
            // it might be a temporary issue so you should retry immediately
            case YTChatErrorStatus.Unavailable:
            case YTChatErrorStatus.Internal:
              if (retryRemaining > 0) {
                retryRemaining -= 1;
                this.log(
                  `fetch`,
                  `Retrying ${retryRemaining} / ${retryInterval}ms cause=${status}`
                );
                await delay(retryInterval);
                continue loop;
              }
            default:
              this.log(
                `fetch`,
                `[action required] Got unrecognized error from the API:`,
                status,
                message,
                JSON.stringify(response.data)
              );
              throw new Error(message);
          }
        }
        // handle client-side errors
        // ECONNRESET, ETIMEOUT, etc
        this.log(`fetch`, `Unrecoverable error:`, err);
        throw err;
      }
      const { continuationContents } = payload;
      if (!continuationContents) {
        /** there's several possibilities lied here:
         * 1. live chat is over (primary)
         * 2. turned into membership-only stream
         * 3. given video is neither a live stream nor an archived stream
         * 4. chat got disabled
         */
        const obj = Object.assign({}, payload);
        delete obj["responseContext"];
        if ("contents" in obj) {
          const reason = stringify(obj.contents.messageRenderer.text.runs);
          if (/disabled/.test(reason)) {
            // {contents: "Chat is disabled for this live stream."} => pre-chat unavailable
            // or accessing replay chat with live chat token
            // retry with replay endpoint if isLive is unknown
            if (this.isLive === undefined) {
              this.log("fetch", "Switched to replay endpoint");
              this.isLive = false;
              applyNewLiveStatus(false);
              continue loop;
            }
            throw new DisabledChatError(reason);
          } else if (/currently unavailable/.test(reason)) {
            // {contents: "Sorry, live chat is currently unavailable"} =>
            // - Turned into members-only stream
            // - No stream recordings
            throw new MembersOnlyError(reason);
          }
          this.log(`fetch`, `continuationNotFound(with contents)`, reason);
        }
        // {} => Live stream ended
        return {
          actions: [],
          continuation: undefined,
          error: null,
        };
      }
      const newContinuation = getTimedContinuation(continuationContents);
      let rawActions = continuationContents.liveChatContinuation.actions;
      // this means no chat available between the time window
      if (!rawActions) {
        return {
          actions: [],
          continuation: newContinuation,
          error: null,
        };
      }
      // unwrap replay actions
      if (!(this.isLive ?? true)) {
        rawActions = unwrapReplayActions(rawActions);
      }
      const actions = rawActions
        .map(parseAction)
        .filter((a) => a !== undefined);
      const chat = {
        actions,
        continuation: newContinuation,
        error: null,
      };
      return chat;
    }
  }
  /**
   * NOTE: invalid params -> "actions":[{"liveChatAddToToastAction":{"item":{"notificationTextRenderer":{"successResponseText":{"runs":[{"text":"Error, try again."}]},"trackingParams":"CAAQyscDIhMI56_wmNj89wIV0HVgCh2Qow9y"}}}}]
   */
  /**
   * Send Message API
   */
  async sendMessage(message) {
    const params = sendMessageParams(this.cvPair());
    const body = withContext({
      richMessage: {
        textSegments: [
          {
            text: message,
          },
        ],
      },
      params,
    });
    const res = await this.postWithRetry(EP_SM, body);
    if (res.timeoutDurationUsec) {
      // You are timeouted
      const timeoutSec = usecToSeconds(res.timeoutDurationUsec);
      throw new Error(
        `You have been placed in timeout for ${timeoutSec} seconds`
      );
    }
    const item = res.actions?.[0].addChatItemAction?.item;
    if (!(item && "liveChatTextMessageRenderer" in item)) {
      throw new Error(`Invalid response: ` + item);
    }
    return item.liveChatTextMessageRenderer;
  }
  /**
   * Live Chat Action API
   */
  async pin(chatId) {
    const params = pinParams(chatId, this.cvPair());
    const res = await this.post(
      EP_LCA,
      withContext({
        params,
      })
    );
    if (!res.success) {
      throw new Error(`Failed to pin chat: ` + JSON.stringify(res));
    }
    return res; // TODO
  }
  async unpin(actionId) {
    const params = unpinParams(actionId, this.cvPair());
    const res = await this.post(
      EP_LCA,
      withContext({
        params,
      })
    );
    if (!res.success) {
      throw new Error(`Failed to unpin chat: ` + JSON.stringify(res));
    }
    return res; // TODO
  }
  /**
   * Moderate API
   */
  async remove(chatId) {
    const params = removeMessageParams(chatId, this.cvPair());
    const res = await this.post(
      EP_MOD,
      withContext({
        params,
      })
    );
    if (!res.success) {
      // {"error":{"code":501,"message":"Operation is not implemented, or supported, or enabled.","errors":[{"message":"Operation is not implemented, or supported, or enabled.","domain":"global","reason":"notImplemented"}],"status":"UNIMPLEMENTED"}}
      throw new Error(`Failed to remove chat: ` + JSON.stringify(res));
    }
    const payload = res.actions[0].markChatItemAsDeletedAction;
    if (!payload) {
      throw new Error(
        `Invalid response when removing chat: ${JSON.stringify(res)}`
      );
    }
    return parseMarkChatItemAsDeletedAction(payload);
  }
  /**
   * Put user in timeout for 300 seconds
   */
  async timeout(channelId) {
    const params = timeoutParams(channelId, this.cvPair());
    const res = await this.post(
      EP_MOD,
      withContext({
        params,
      })
    );
    if (!res.success) {
      throw new Error(`Failed to timeout user: ` + JSON.stringify(res));
    }
  }
  /**
   * Hide user on the channel
   */
  async hide(targetChannelId) {
    const params = hideParams(targetChannelId, this.cvPair());
    const res = await this.post(
      EP_MOD,
      withContext({
        params,
      })
    );
    if (!res.success) {
      throw new Error(`Failed to hide user: ` + JSON.stringify(res));
    }
    // NOTE: res.actions[0] -> {"liveChatAddToToastAction":{"item":{"notificationActionRenderer":{"responseText":{"runs":[{"text":"This user's messages will be hidden"}]},"actionButton":{"buttonRenderer":{"style":"STYLE_BLUE_TEXT","size":"SIZE_DEFAULT","isDisabled":false,"text":{"runs":[{"text":"Undo"}]},"command":{...}}}}}}}
  }
  async unhide(channelId) {
    const params = hideParams(channelId, this.cvPair(), true);
    const res = await this.post(
      EP_MOD,
      withContext({
        params,
      })
    );
    if (!res.success) {
      throw new Error(`Failed to unhide user: ` + JSON.stringify(res));
    }
  }
  // TODO: narrow down return type
  async block(contextMenuEndpointParams) {
    const catalog = await this.getActionCatalog(contextMenuEndpointParams);
    const actionInfo = catalog?.block;
    if (!actionInfo) return;
    return await this.sendAction(actionInfo);
  }
  // TODO: narrow down return type
  async unblock(contextMenuEndpointParams) {
    const catalog = await this.getActionCatalog(contextMenuEndpointParams);
    const actionInfo = catalog?.unblock;
    if (!actionInfo) return;
    return await this.sendAction(actionInfo);
  }
  /**
   * Manage User API
   */
  async addModerator(channelId) {
    const params = addModeratorParams(channelId, this.cvPair());
    const res = await this.post(
      EP_MU,
      withContext({
        params,
      })
    );
    if (!res.success) {
      throw new Error(`Failed to perform action: ` + JSON.stringify(res));
    }
    return res; // TODO
  }
  async removeModerator(channelId) {
    const params = addModeratorParams(channelId, this.cvPair(), true);
    const res = await this.post(
      EP_MU,
      withContext({
        params,
      })
    );
    if (!res.success) {
      throw new Error(`Failed to perform action: ` + JSON.stringify(res));
    }
    return res; // TODO
  }
  /*
   * Video Comments API
   */
  async getComment(commentId) {
    const comments = await this.getComments({
      highlightedCommentId: commentId,
    });
    const first = comments.comments?.[0];
    if (first.renderingPriority !== RenderingPriority.LinkedComment)
      return undefined;
    return first;
  }
  async getComments(continuation = {}) {
    if (typeof continuation !== "string") {
      continuation = csc(this.videoId, continuation);
    }
    const body = withContext({
      continuation,
    });
    const payload = await this.post(EP_NXT, body);
    const endpoints = payload.onResponseReceivedEndpoints;
    const isAppend = endpoints.length === 1;
    const items = isAppend
      ? endpoints[0].appendContinuationItemsAction.continuationItems
      : endpoints[1].reloadContinuationItemsCommand.continuationItems;
    const nextContinuation =
      items[items.length - 1].continuationItemRenderer?.continuationEndpoint
        .continuationCommand.token;
    const comments = items
      .map((item) => item.commentThreadRenderer)
      .filter((rdr) => rdr !== undefined);
    return {
      comments,
      continuation: nextContinuation,
      next: nextContinuation
        ? () => this.getComments(nextContinuation)
        : undefined,
    };
  }
  /*
   * Transcript API
   */
  /**
   * Fetch transcript
   */
  async getTranscript(language) {
    const fetchTranscript = async ({ autoGenerated }) => {
      const res = await this.post(EP_GTS, {
        context: {
          client: { clientName: "WEB", clientVersion: "2.20220502.01.00" },
        },
        params: getTranscriptParams(this.videoId, language, autoGenerated),
      });
      const rdr =
        res.actions[0].updateEngagementPanelAction.content.transcriptRenderer
          .content.transcriptSearchPanelRenderer;
      const subtitles =
        rdr.footer?.transcriptFooterRenderer.languageMenu
          ?.sortFilterSubMenuRenderer.subMenuItems;
      const segments = rdr.body.transcriptSegmentListRenderer.initialSegments
        ?.map((seg) => seg.transcriptSegmentRenderer)
        .map((rdr) => ({
          startMs: Number(rdr.startMs),
          endMs: Number(rdr.endMs),
          snippet: rdr.snippet.runs,
          startTimeText: rdr.startTimeText.simpleText,
        }));
      return { segments, subtitles };
    };
    let res = await fetchTranscript({ autoGenerated: true });
    if (!res.segments && res.subtitles) {
      this.log("transcript", "retry fetching non-autogenerated transcript");
      res = await fetchTranscript({ autoGenerated: false });
    }
    if (!res.segments) {
      throw new Error("No transcript available for " + language);
    }
    return res.segments;
  }
  /*
   * Playlist API
   */
  async getPlaylist(browseId) {
    if (typeof browseId === "object") {
      switch (browseId.type) {
        case "membersOnly": {
          browseId = "VLUUMO" + this.channelId.replace(/^UC/, "");
          break;
        }
        default: {
          throw new Error(`Invalid type "${browseId.type}"`);
        }
      }
    }
    const res = await this.post("https://www.youtube.com/youtubei/v1/browse", {
      context: {
        client: { clientName: "WEB", clientVersion: "2.20220411.09.00" },
      },
      browseId,
    });
    const metadata = res.metadata.playlistMetadataRenderer;
    const title = metadata.title;
    const description = metadata.description;
    const contents =
      res.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
        .sectionListRenderer.contents[0].itemSectionRenderer.contents[0]
        .playlistVideoListRenderer.contents;
    const videos = contents.map((content) => {
      const rdr = content.playlistVideoRenderer;
      const videoId = rdr.videoId;
      const title = rdr.title.runs;
      const lengthText = rdr.lengthText.simpleText; // "2:12:01"
      const length = Number(rdr.lengthSeconds); // "7921"
      const thumbnailUrl = pickThumbUrl(rdr.thumbnail);
      return {
        videoId,
        title,
        thumbnailUrl,
        length,
        lengthText,
      };
    });
    this.log(title, description, videos);
    return {
      title,
      description,
      videos,
    };
  }
}

class StreamPool extends EventEmitter {
  pool = new Map();
  options;
  started = false;
  constructor(options) {
    super();
    this.options = options;
  }
  get entries() {
    return Array.from(this.pool.entries());
  }
  async forEach(fn) {
    return Promise.allSettled(
      this.entries.map(([videoId, instance], i) =>
        Promise.resolve(fn(instance, videoId, i))
      )
    );
  }
  setCredentials(credentials) {
    this.forEach((instance) => {
      instance.setCredentials(credentials);
    });
  }
  get(videoId) {
    return this.pool.get(videoId);
  }
  /**
   * resolves after every stream closed
   */
  ensure() {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.streamCount() === 0) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });
  }
  /**
   * number of active streams
   */
  streamCount() {
    return this.pool.size;
  }
  /**
   * check if the given stream is already subscribed
   */
  has(videoId) {
    return this.pool.has(videoId);
  }
  /**
   * subscribe live chat.
   * always guarantees single instance for each stream.
   */
  subscribe(videoId, channelId, iterateOptions) {
    if (this.has(videoId)) return this.pool.get(videoId);
    const mc = new Masterchat(videoId, channelId, this.options);
    mc.on("end", (reason) => this._handleEnd(mc, reason));
    mc.on("error", (err) => this._handleError(mc, err));
    mc.on("data", (data) => {
      this._handleData(mc, data);
    });
    mc.on("actions", (actions) => {
      this._handleActions(mc, actions);
    });
    mc.on("chats", (chats) => {
      this._handleChats(mc, chats);
    });
    mc.listen(iterateOptions);
    if (!this.started) {
      this.started = true;
      this.ensure();
    }
    this.pool.set(videoId, mc);
    return mc;
  }
  /**
   * stop subscribing live chat
   */
  unsubscribe(videoId) {
    const mc = this.pool.get(videoId);
    if (!mc) return;
    mc.stop(); // will emit 'end' event
  }
  _handleData(mc, data) {
    this.emit("data", data, mc);
  }
  _handleActions(mc, actions) {
    this.emit("actions", actions, mc);
  }
  _handleChats(mc, chats) {
    this.emit("chats", chats, mc);
  }
  _handleEnd(mc, reason) {
    this.pool.delete(mc.videoId);
    this.emit("end", reason, mc);
  }
  _handleError(mc, err) {
    this.pool.delete(mc.videoId);
    this.emit("error", err, mc);
  }
}

export {
  AbortError,
  AccessDeniedError,
  B64Type,
  CommentActionButtonsRendererStyle,
  DisabledChatError,
  IconPosition,
  InvalidArgumentError,
  LiveChatMode,
  Masterchat,
  MasterchatError,
  MembersOnlyError,
  NoPermissionError,
  NoStreamRecordingError,
  RenderingPriority,
  SUPERCHAT_COLOR_MAP,
  SUPERCHAT_SIGNIFICANCE_MAP,
  SizeEnum,
  StreamPool,
  TextEnum,
  UnavailableError,
  VoteStatus,
  YTChatErrorStatus,
  addModeratorParams,
  b64d,
  b64e,
  b64tou8,
  bitou8,
  concatu8,
  csc,
  delay,
  durationToISO8601,
  durationToSeconds,
  endpointToUrl,
  formatColor,
  getContextMenuParams,
  getTranscriptParams,
  groupBy,
  guessFreeChat,
  hextou8,
  hideParams,
  liveReloadContinuation,
  liveTimedContinuation,
  parsePb,
  pinParams,
  pprintPbValue,
  printBuf,
  removeMessageParams,
  replayReloadContinuation,
  replayTimedContinuation,
  runsToString,
  sendMessageParams,
  stringify,
  timeoutParams,
  toJSON,
  toVideoId,
  transcriptFormatToken,
  tsToDate,
  tsToNumber,
  u8tob64,
  u8tobi,
  u8tohex,
  unpinParams,
};
