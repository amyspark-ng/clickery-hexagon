(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b2) => (typeof require !== "undefined" ? require : a)[b2]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // node_modules/.pnpm/kaplay@4000.0.0-alpha.1/node_modules/kaplay/dist/kaplay.mjs
  var Na = Object.defineProperty;
  var i = (t18, e) => Na(t18, "name", { value: e, configurable: true });
  var so = (() => {
    for (var t18 = new Uint8Array(128), e = 0; e < 64; e++)
      t18[e < 26 ? e + 65 : e < 52 ? e + 71 : e < 62 ? e - 4 : e * 4 - 205] = e;
    return (n) => {
      for (var r = n.length, o = new Uint8Array((r - (n[r - 1] == "=") - (n[r - 2] == "=")) * 3 / 4 | 0), s = 0, a = 0; s < r; ) {
        var l = t18[n.charCodeAt(s++)], u = t18[n.charCodeAt(s++)], m = t18[n.charCodeAt(s++)], c = t18[n.charCodeAt(s++)];
        o[a++] = l << 2 | u >> 4, o[a++] = u << 4 | m >> 2, o[a++] = m << 6 | c;
      }
      return o;
    };
  })();
  var H = class t {
    static {
      i(this, "Color");
    }
    r = 255;
    g = 255;
    b = 255;
    constructor(e, n, r) {
      this.r = Be(e, 0, 255), this.g = Be(n, 0, 255), this.b = Be(r, 0, 255);
    }
    static fromArray(e) {
      return new t(e[0], e[1], e[2]);
    }
    static fromHex(e) {
      if (typeof e == "number")
        return new t(e >> 16 & 255, e >> 8 & 255, e >> 0 & 255);
      if (typeof e == "string") {
        let n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
        if (!n)
          throw new Error("Invalid hex color format");
        return new t(parseInt(n[1], 16), parseInt(n[2], 16), parseInt(n[3], 16));
      } else
        throw new Error("Invalid hex color format");
    }
    static fromHSL(e, n, r) {
      if (n == 0)
        return new t(255 * r, 255 * r, 255 * r);
      let o = i((c, p, d) => (d < 0 && (d += 1), d > 1 && (d -= 1), d < 1 / 6 ? c + (p - c) * 6 * d : d < 1 / 2 ? p : d < 2 / 3 ? c + (p - c) * (2 / 3 - d) * 6 : c), "hue2rgb"), s = r < 0.5 ? r * (1 + n) : r + n - r * n, a = 2 * r - s, l = o(a, s, e + 1 / 3), u = o(a, s, e), m = o(a, s, e - 1 / 3);
      return new t(Math.round(l * 255), Math.round(u * 255), Math.round(m * 255));
    }
    static RED = new t(255, 0, 0);
    static GREEN = new t(0, 255, 0);
    static BLUE = new t(0, 0, 255);
    static YELLOW = new t(255, 255, 0);
    static MAGENTA = new t(255, 0, 255);
    static CYAN = new t(0, 255, 255);
    static WHITE = new t(255, 255, 255);
    static BLACK = new t(0, 0, 0);
    clone() {
      return new t(this.r, this.g, this.b);
    }
    lighten(e) {
      return new t(this.r + e, this.g + e, this.b + e);
    }
    darken(e) {
      return this.lighten(-e);
    }
    invert() {
      return new t(255 - this.r, 255 - this.g, 255 - this.b);
    }
    mult(e) {
      return new t(this.r * e.r / 255, this.g * e.g / 255, this.b * e.b / 255);
    }
    lerp(e, n) {
      return new t(Ce(this.r, e.r, n), Ce(this.g, e.g, n), Ce(this.b, e.b, n));
    }
    toHSL() {
      let e = this.r / 255, n = this.g / 255, r = this.b / 255, o = Math.max(e, n, r), s = Math.min(e, n, r), a = (o + s) / 2, l = a, u = a;
      if (o == s)
        a = l = 0;
      else {
        let m = o - s;
        switch (l = u > 0.5 ? m / (2 - o - s) : m / (o + s), o) {
          case e:
            a = (n - r) / m + (n < r ? 6 : 0);
            break;
          case n:
            a = (r - e) / m + 2;
            break;
          case r:
            a = (e - n) / m + 4;
            break;
        }
        a /= 6;
      }
      return [a, l, u];
    }
    eq(e) {
      return this.r === e.r && this.g === e.g && this.b === e.b;
    }
    toString() {
      return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    toHex() {
      return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    }
    toArray() {
      return [this.r, this.g, this.b];
    }
  };
  function W(...t18) {
    if (t18.length === 0)
      return new H(255, 255, 255);
    if (t18.length === 1) {
      if (t18[0] instanceof H)
        return t18[0].clone();
      if (typeof t18[0] == "string")
        return H.fromHex(t18[0]);
      if (Array.isArray(t18[0]) && t18[0].length === 3)
        return H.fromArray(t18[0]);
    } else if (t18.length === 2) {
      if (t18[0] instanceof H)
        return t18[0].clone();
    } else if (t18.length === 3 || t18.length === 4)
      return new H(t18[0], t18[1], t18[2]);
    throw new Error("Invalid color arguments");
  }
  i(W, "rgb");
  var ao = i((t18, e, n) => H.fromHSL(t18, e, n), "hsl2rgb");
  function ce(t18) {
    return t18 * Math.PI / 180;
  }
  i(ce, "deg2rad");
  function pt(t18) {
    return t18 * 180 / Math.PI;
  }
  i(pt, "rad2deg");
  function Be(t18, e, n) {
    return e > n ? Be(t18, n, e) : Math.min(Math.max(t18, e), n);
  }
  i(Be, "clamp");
  function Ce(t18, e, n) {
    if (typeof t18 == "number" && typeof e == "number")
      return t18 + (e - t18) * n;
    if (t18 instanceof w && e instanceof w)
      return t18.lerp(e, n);
    if (t18 instanceof H && e instanceof H)
      return t18.lerp(e, n);
    throw new Error(`Bad value for lerp(): ${t18}, ${e}. Only number, Vec2 and Color is supported.`);
  }
  i(Ce, "lerp");
  function De(t18, e, n, r, o) {
    return r + (t18 - e) / (n - e) * (o - r);
  }
  i(De, "map");
  function co(t18, e, n, r, o) {
    return Be(De(t18, e, n, r, o), r, o);
  }
  i(co, "mapc");
  var w = class t2 {
    static {
      i(this, "Vec2");
    }
    x = 0;
    y = 0;
    constructor(e = 0, n = e) {
      this.x = e, this.y = n;
    }
    static fromAngle(e) {
      let n = ce(e);
      return new t2(Math.cos(n), Math.sin(n));
    }
    static fromArray(e) {
      return new t2(e[0], e[1]);
    }
    static LEFT = new t2(-1, 0);
    static RIGHT = new t2(1, 0);
    static UP = new t2(0, -1);
    static DOWN = new t2(0, 1);
    clone() {
      return new t2(this.x, this.y);
    }
    add(...e) {
      let n = b(...e);
      return new t2(this.x + n.x, this.y + n.y);
    }
    sub(...e) {
      let n = b(...e);
      return new t2(this.x - n.x, this.y - n.y);
    }
    scale(...e) {
      let n = b(...e);
      return new t2(this.x * n.x, this.y * n.y);
    }
    dist(...e) {
      let n = b(...e);
      return this.sub(n).len();
    }
    sdist(...e) {
      let n = b(...e);
      return this.sub(n).slen();
    }
    len() {
      return Math.sqrt(this.dot(this));
    }
    slen() {
      return this.dot(this);
    }
    unit() {
      let e = this.len();
      return e === 0 ? new t2(0) : this.scale(1 / e);
    }
    normal() {
      return new t2(this.y, -this.x);
    }
    reflect(e) {
      return this.sub(e.scale(2 * this.dot(e)));
    }
    project(e) {
      return e.scale(e.dot(this) / e.len());
    }
    reject(e) {
      return this.sub(this.project(e));
    }
    dot(e) {
      return this.x * e.x + this.y * e.y;
    }
    cross(e) {
      return this.x * e.y - this.y * e.x;
    }
    angle(...e) {
      let n = b(...e);
      return pt(Math.atan2(this.y - n.y, this.x - n.x));
    }
    angleBetween(...e) {
      let n = b(...e);
      return pt(Math.atan2(this.cross(n), this.dot(n)));
    }
    lerp(e, n) {
      return new t2(Ce(this.x, e.x, n), Ce(this.y, e.y, n));
    }
    slerp(e, n) {
      let r = this.dot(e), o = this.cross(e), s = Math.atan2(o, r);
      return this.scale(Math.sin((1 - n) * s)).add(e.scale(Math.sin(n * s))).scale(1 / o);
    }
    isZero() {
      return this.x === 0 && this.y === 0;
    }
    toFixed(e) {
      return new t2(Number(this.x.toFixed(e)), Number(this.y.toFixed(e)));
    }
    transform(e) {
      return e.multVec2(this);
    }
    eq(e) {
      return this.x === e.x && this.y === e.y;
    }
    bbox() {
      return new ee(this, 0, 0);
    }
    toString() {
      return `vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }
    toArray() {
      return [this.x, this.y];
    }
  };
  function b(...t18) {
    if (t18.length === 1) {
      if (t18[0] instanceof w)
        return new w(t18[0].x, t18[0].y);
      if (Array.isArray(t18[0]) && t18[0].length === 2)
        return new w(...t18[0]);
    }
    return new w(...t18);
  }
  i(b, "vec2");
  var $ = class t3 {
    static {
      i(this, "Quad");
    }
    x = 0;
    y = 0;
    w = 1;
    h = 1;
    constructor(e, n, r, o) {
      this.x = e, this.y = n, this.w = r, this.h = o;
    }
    scale(e) {
      return new t3(this.x + this.w * e.x, this.y + this.h * e.y, this.w * e.w, this.h * e.h);
    }
    pos() {
      return new w(this.x, this.y);
    }
    clone() {
      return new t3(this.x, this.y, this.w, this.h);
    }
    eq(e) {
      return this.x === e.x && this.y === e.y && this.w === e.w && this.h === e.h;
    }
    toString() {
      return `quad(${this.x}, ${this.y}, ${this.w}, ${this.h})`;
    }
  };
  function pe(t18, e, n, r) {
    return new $(t18, e, n, r);
  }
  i(pe, "quad");
  var Dt = class t4 {
    static {
      i(this, "Mat2");
    }
    a;
    b;
    c;
    d;
    constructor(e, n, r, o) {
      this.a = e, this.b = n, this.c = r, this.d = o;
    }
    mul(e) {
      return new t4(this.a * e.a + this.b * e.c, this.a * e.b + this.b * e.d, this.c * e.a + this.d * e.c, this.c * e.b + this.d * e.d);
    }
    transform(e) {
      return b(this.a * e.x + this.b * e.y, this.c * e.x + this.d * e.y);
    }
    get inverse() {
      let e = this.det;
      return new t4(this.d / e, -this.b / e, -this.c / e, this.a / e);
    }
    get transpose() {
      return new t4(this.a, this.c, this.b, this.d);
    }
    get eigenvalues() {
      let e = this.trace / 2, n = this.det, r = e + Math.sqrt(e * e - n), o = e - Math.sqrt(e * e - n);
      return [r, o];
    }
    eigenvectors(e, n) {
      return this.c != 0 ? [[e - this.d, this.c], [n - this.d, this.c]] : this.b != 0 ? [[this.b, e - this.a], [this.b, n - this.a]] : Math.abs(this.transform(b(1, 0)).x - e) < Number.EPSILON ? [[1, 0], [0, 1]] : [[0, 1], [1, 0]];
    }
    get det() {
      return this.a * this.d - this.b * this.c;
    }
    get trace() {
      return this.a + this.d;
    }
    static rotation(e) {
      let n = Math.cos(e), r = Math.sin(e);
      return new t4(n, r, -r, n);
    }
    static scale(e, n) {
      return new t4(e, 0, 0, n);
    }
  };
  var yt = class t5 {
    static {
      i(this, "Mat3");
    }
    m11;
    m12;
    m13;
    m21;
    m22;
    m23;
    m31;
    m32;
    m33;
    constructor(e, n, r, o, s, a, l, u, m) {
      this.m11 = e, this.m12 = n, this.m13 = r, this.m21 = o, this.m22 = s, this.m23 = a, this.m31 = l, this.m32 = u, this.m33 = m;
    }
    static fromMat2(e) {
      return new t5(e.a, e.b, 0, e.c, e.d, 0, 0, 0, 1);
    }
    toMat2() {
      return new Dt(this.m11, this.m12, this.m21, this.m22);
    }
    mul(e) {
      return new t5(this.m11 * e.m11 + this.m12 * e.m21 + this.m13 * e.m31, this.m11 * e.m12 + this.m12 * e.m22 + this.m13 * e.m32, this.m11 * e.m13 + this.m12 * e.m23 + this.m13 * e.m33, this.m21 * e.m11 + this.m22 * e.m21 + this.m23 * e.m31, this.m21 * e.m12 + this.m22 * e.m22 + this.m23 * e.m32, this.m21 * e.m13 + this.m22 * e.m23 + this.m23 * e.m33, this.m31 * e.m11 + this.m32 * e.m21 + this.m33 * e.m31, this.m31 * e.m12 + this.m32 * e.m22 + this.m33 * e.m32, this.m31 * e.m13 + this.m32 * e.m23 + this.m33 * e.m33);
    }
    get det() {
      return this.m11 * this.m22 * this.m33 + this.m12 * this.m23 * this.m31 + this.m13 * this.m21 * this.m32 - this.m13 * this.m22 * this.m31 - this.m12 * this.m21 * this.m33 - this.m11 * this.m23 * this.m32;
    }
    rotate(e) {
      let n = Math.cos(e), r = Math.sin(e), o = this.m11, s = this.m12;
      return this.m11 = n * this.m11 + r * this.m21, this.m12 = n * this.m12 + r * this.m22, this.m21 = n * this.m21 - r * o, this.m22 = n * this.m22 - r * s, this;
    }
    scale(e, n) {
      return this.m11 *= e, this.m12 *= e, this.m21 *= n, this.m22 *= n, this;
    }
    get inverse() {
      let e = this.det;
      return new t5((this.m22 * this.m33 - this.m23 * this.m32) / e, (this.m13 * this.m32 - this.m12 * this.m33) / e, (this.m12 * this.m23 - this.m13 * this.m22) / e, (this.m23 * this.m31 - this.m21 * this.m33) / e, (this.m11 * this.m33 - this.m13 * this.m31) / e, (this.m13 * this.m21 - this.m11 * this.m23) / e, (this.m21 * this.m32 - this.m22 * this.m31) / e, (this.m12 * this.m31 - this.m11 * this.m32) / e, (this.m11 * this.m22 - this.m12 * this.m21) / e);
    }
    get transpose() {
      return new t5(this.m11, this.m21, this.m31, this.m12, this.m22, this.m32, this.m13, this.m23, this.m33);
    }
  };
  var fe = class t6 {
    static {
      i(this, "Mat4");
    }
    m = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    constructor(e) {
      e && (this.m = e);
    }
    static translate(e) {
      return new t6([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, e.x, e.y, 0, 1]);
    }
    static scale(e) {
      return new t6([e.x, 0, 0, 0, 0, e.y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    static rotateX(e) {
      e = ce(-e);
      let n = Math.cos(e), r = Math.sin(e);
      return new t6([1, 0, 0, 0, 0, n, -r, 0, 0, r, n, 0, 0, 0, 0, 1]);
    }
    static rotateY(e) {
      e = ce(-e);
      let n = Math.cos(e), r = Math.sin(e);
      return new t6([n, 0, r, 0, 0, 1, 0, 0, -r, 0, n, 0, 0, 0, 0, 1]);
    }
    static rotateZ(e) {
      e = ce(-e);
      let n = Math.cos(e), r = Math.sin(e);
      return new t6([n, -r, 0, 0, r, n, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
    translate(e) {
      return this.m[12] += this.m[0] * e.x + this.m[4] * e.y, this.m[13] += this.m[1] * e.x + this.m[5] * e.y, this.m[14] += this.m[2] * e.x + this.m[6] * e.y, this.m[15] += this.m[3] * e.x + this.m[7] * e.y, this;
    }
    scale(e) {
      return this.m[0] *= e.x, this.m[4] *= e.y, this.m[1] *= e.x, this.m[5] *= e.y, this.m[2] *= e.x, this.m[6] *= e.y, this.m[3] *= e.x, this.m[7] *= e.y, this;
    }
    rotate(e) {
      e = ce(-e);
      let n = Math.cos(e), r = Math.sin(e), o = this.m[0], s = this.m[1], a = this.m[4], l = this.m[5];
      return this.m[0] = o * n + s * r, this.m[1] = -o * r + s * n, this.m[4] = a * n + l * r, this.m[5] = -a * r + l * n, this;
    }
    mult(e) {
      let n = [];
      for (let r = 0; r < 4; r++)
        for (let o = 0; o < 4; o++)
          n[r * 4 + o] = this.m[0 * 4 + o] * e.m[r * 4 + 0] + this.m[1 * 4 + o] * e.m[r * 4 + 1] + this.m[2 * 4 + o] * e.m[r * 4 + 2] + this.m[3 * 4 + o] * e.m[r * 4 + 3];
      return new t6(n);
    }
    multVec2(e) {
      return new w(e.x * this.m[0] + e.y * this.m[4] + this.m[12], e.x * this.m[1] + e.y * this.m[5] + this.m[13]);
    }
    getTranslation() {
      return new w(this.m[12], this.m[13]);
    }
    getScale() {
      if (this.m[0] != 0 || this.m[1] != 0) {
        let e = this.m[0] * this.m[5] - this.m[1] * this.m[4], n = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
        return new w(n, e / n);
      } else if (this.m[4] != 0 || this.m[5] != 0) {
        let e = this.m[0] * this.m[5] - this.m[1] * this.m[4], n = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
        return new w(e / n, n);
      } else
        return new w(0, 0);
    }
    getRotation() {
      if (this.m[0] != 0 || this.m[1] != 0) {
        let e = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
        return pt(this.m[1] > 0 ? Math.acos(this.m[0] / e) : -Math.acos(this.m[0] / e));
      } else if (this.m[4] != 0 || this.m[5] != 0) {
        let e = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
        return pt(Math.PI / 2 - (this.m[5] > 0 ? Math.acos(-this.m[4] / e) : -Math.acos(this.m[4] / e)));
      } else
        return 0;
    }
    getSkew() {
      if (this.m[0] != 0 || this.m[1] != 0) {
        let e = Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1]);
        return new w(Math.atan(this.m[0] * this.m[4] + this.m[1] * this.m[5]) / (e * e), 0);
      } else if (this.m[4] != 0 || this.m[5] != 0) {
        let e = Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5]);
        return new w(0, Math.atan(this.m[0] * this.m[4] + this.m[1] * this.m[5]) / (e * e));
      } else
        return new w(0, 0);
    }
    invert() {
      let e = [], n = this.m[10] * this.m[15] - this.m[14] * this.m[11], r = this.m[9] * this.m[15] - this.m[13] * this.m[11], o = this.m[9] * this.m[14] - this.m[13] * this.m[10], s = this.m[8] * this.m[15] - this.m[12] * this.m[11], a = this.m[8] * this.m[14] - this.m[12] * this.m[10], l = this.m[8] * this.m[13] - this.m[12] * this.m[9], u = this.m[6] * this.m[15] - this.m[14] * this.m[7], m = this.m[5] * this.m[15] - this.m[13] * this.m[7], c = this.m[5] * this.m[14] - this.m[13] * this.m[6], p = this.m[4] * this.m[15] - this.m[12] * this.m[7], d = this.m[4] * this.m[14] - this.m[12] * this.m[6], x = this.m[5] * this.m[15] - this.m[13] * this.m[7], f = this.m[4] * this.m[13] - this.m[12] * this.m[5], y = this.m[6] * this.m[11] - this.m[10] * this.m[7], v = this.m[5] * this.m[11] - this.m[9] * this.m[7], A = this.m[5] * this.m[10] - this.m[9] * this.m[6], V = this.m[4] * this.m[11] - this.m[8] * this.m[7], M2 = this.m[4] * this.m[10] - this.m[8] * this.m[6], G2 = this.m[4] * this.m[9] - this.m[8] * this.m[5];
      e[0] = this.m[5] * n - this.m[6] * r + this.m[7] * o, e[4] = -(this.m[4] * n - this.m[6] * s + this.m[7] * a), e[8] = this.m[4] * r - this.m[5] * s + this.m[7] * l, e[12] = -(this.m[4] * o - this.m[5] * a + this.m[6] * l), e[1] = -(this.m[1] * n - this.m[2] * r + this.m[3] * o), e[5] = this.m[0] * n - this.m[2] * s + this.m[3] * a, e[9] = -(this.m[0] * r - this.m[1] * s + this.m[3] * l), e[13] = this.m[0] * o - this.m[1] * a + this.m[2] * l, e[2] = this.m[1] * u - this.m[2] * m + this.m[3] * c, e[6] = -(this.m[0] * u - this.m[2] * p + this.m[3] * d), e[10] = this.m[0] * x - this.m[1] * p + this.m[3] * f, e[14] = -(this.m[0] * c - this.m[1] * d + this.m[2] * f), e[3] = -(this.m[1] * y - this.m[2] * v + this.m[3] * A), e[7] = this.m[0] * y - this.m[2] * V + this.m[3] * M2, e[11] = -(this.m[0] * v - this.m[1] * V + this.m[3] * G2), e[15] = this.m[0] * A - this.m[1] * M2 + this.m[2] * G2;
      let F = this.m[0] * e[0] + this.m[1] * e[4] + this.m[2] * e[8] + this.m[3] * e[12];
      for (let g = 0; g < 4; g++)
        for (let T = 0; T < 4; T++)
          e[g * 4 + T] *= 1 / F;
      return new t6(e);
    }
    clone() {
      return new t6([...this.m]);
    }
    toString() {
      return this.m.toString();
    }
  };
  function xn(t18, e, n, r = (o) => -Math.cos(o)) {
    return t18 + (r(n) + 1) / 2 * (e - t18);
  }
  i(xn, "wave");
  var Ha = 1103515245;
  var qa = 12345;
  var uo = 2147483648;
  var Wt = class {
    static {
      i(this, "RNG");
    }
    seed;
    constructor(e) {
      this.seed = e;
    }
    gen() {
      return this.seed = (Ha * this.seed + qa) % uo, this.seed / uo;
    }
    genNumber(e, n) {
      return e + this.gen() * (n - e);
    }
    genVec2(e, n) {
      return new w(this.genNumber(e.x, n.x), this.genNumber(e.y, n.y));
    }
    genColor(e, n) {
      return new H(this.genNumber(e.r, n.r), this.genNumber(e.g, n.g), this.genNumber(e.b, n.b));
    }
    genAny(...e) {
      if (e.length === 0)
        return this.gen();
      if (e.length === 1) {
        if (typeof e[0] == "number")
          return this.genNumber(0, e[0]);
        if (e[0] instanceof w)
          return this.genVec2(b(0, 0), e[0]);
        if (e[0] instanceof H)
          return this.genColor(W(0, 0, 0), e[0]);
      } else if (e.length === 2) {
        if (typeof e[0] == "number" && typeof e[1] == "number")
          return this.genNumber(e[0], e[1]);
        if (e[0] instanceof w && e[1] instanceof w)
          return this.genVec2(e[0], e[1]);
        if (e[0] instanceof H && e[1] instanceof H)
          return this.genColor(e[0], e[1]);
      }
      throw new Error("More than 2 arguments not supported");
    }
  };
  var lr = new Wt(Date.now());
  function lo(t18) {
    return t18 != null && (lr.seed = t18), lr.seed;
  }
  i(lo, "randSeed");
  function ge(...t18) {
    return lr.genAny(...t18);
  }
  i(ge, "rand");
  function mr(...t18) {
    return Math.floor(ge(...t18));
  }
  i(mr, "randi");
  function mo(t18) {
    return ge() <= t18;
  }
  i(mo, "chance");
  function pr(t18) {
    for (let e = t18.length - 1; e > 0; e--) {
      let n = Math.floor(Math.random() * (e + 1));
      [t18[e], t18[n]] = [t18[n], t18[e]];
    }
    return t18;
  }
  i(pr, "shuffle");
  function po(t18, e) {
    return t18.length <= e ? t18.slice() : pr(t18.slice()).slice(0, e);
  }
  i(po, "chooseMultiple");
  function ho(t18) {
    return t18[mr(t18.length)];
  }
  i(ho, "choose");
  function dr(t18, e) {
    return t18.pos.x + t18.width > e.pos.x && t18.pos.x < e.pos.x + e.width && t18.pos.y + t18.height > e.pos.y && t18.pos.y < e.pos.y + e.height;
  }
  i(dr, "testRectRect");
  function za(t18, e) {
    if (t18.p1.x === t18.p2.x && t18.p1.y === t18.p2.y || e.p1.x === e.p2.x && e.p1.y === e.p2.y)
      return null;
    let n = (e.p2.y - e.p1.y) * (t18.p2.x - t18.p1.x) - (e.p2.x - e.p1.x) * (t18.p2.y - t18.p1.y);
    if (n === 0)
      return null;
    let r = ((e.p2.x - e.p1.x) * (t18.p1.y - e.p1.y) - (e.p2.y - e.p1.y) * (t18.p1.x - e.p1.x)) / n, o = ((t18.p2.x - t18.p1.x) * (t18.p1.y - e.p1.y) - (t18.p2.y - t18.p1.y) * (t18.p1.x - e.p1.x)) / n;
    return r < 0 || r > 1 || o < 0 || o > 1 ? null : r;
  }
  i(za, "testLineLineT");
  function vn(t18, e) {
    let n = za(t18, e);
    return n ? b(t18.p1.x + n * (t18.p2.x - t18.p1.x), t18.p1.y + n * (t18.p2.y - t18.p1.y)) : null;
  }
  i(vn, "testLineLine");
  function wn(t18, e) {
    let n = e.p2.sub(e.p1), r = Number.NEGATIVE_INFINITY, o = Number.POSITIVE_INFINITY;
    if (n.x != 0) {
      let s = (t18.pos.x - e.p1.x) / n.x, a = (t18.pos.x + t18.width - e.p1.x) / n.x;
      r = Math.max(r, Math.min(s, a)), o = Math.min(o, Math.max(s, a));
    }
    if (n.y != 0) {
      let s = (t18.pos.y - e.p1.y) / n.y, a = (t18.pos.y + t18.height - e.p1.y) / n.y;
      r = Math.max(r, Math.min(s, a)), o = Math.min(o, Math.max(s, a));
    }
    return o >= r && o >= 0 && r <= 1;
  }
  i(wn, "testRectLine");
  function Cn(t18, e) {
    return e.x > t18.pos.x && e.x < t18.pos.x + t18.width && e.y > t18.pos.y && e.y < t18.pos.y + t18.height;
  }
  i(Cn, "testRectPoint");
  function fo(t18, e) {
    let n = Math.max(t18.pos.x, Math.min(e.center.x, t18.pos.x + t18.width)), r = Math.max(t18.pos.y, Math.min(e.center.y, t18.pos.y + t18.height));
    return b(n, r).sdist(e.center) <= e.radius * e.radius;
  }
  i(fo, "testRectCircle");
  function go2(t18, e) {
    return bo(e, new Ae(t18.points()));
  }
  i(go2, "testRectPolygon");
  function En(t18, e) {
    let n = e.sub(t18.p1), r = t18.p2.sub(t18.p1);
    if (Math.abs(n.cross(r)) > Number.EPSILON)
      return false;
    let o = n.dot(r) / r.dot(r);
    return o >= 0 && o <= 1;
  }
  i(En, "testLinePoint");
  function Mt(t18, e) {
    let n = t18.p2.sub(t18.p1), r = n.dot(n), o = t18.p1.sub(e.center), s = 2 * n.dot(o), a = o.dot(o) - e.radius * e.radius, l = s * s - 4 * r * a;
    if (r <= Number.EPSILON || l < 0)
      return false;
    if (l == 0) {
      let u = -s / (2 * r);
      if (u >= 0 && u <= 1)
        return true;
    } else {
      let u = (-s + Math.sqrt(l)) / (2 * r), m = (-s - Math.sqrt(l)) / (2 * r);
      if (u >= 0 && u <= 1 || m >= 0 && m <= 1)
        return true;
    }
    return Tn(e, t18.p1);
  }
  i(Mt, "testLineCircle");
  function hr(t18, e) {
    if (rt(e, t18.p1) || rt(e, t18.p2))
      return true;
    for (let n = 0; n < e.pts.length; n++) {
      let r = e.pts[n], o = e.pts[(n + 1) % e.pts.length];
      if (vn(t18, new Oe(r, o)))
        return true;
    }
    return false;
  }
  i(hr, "testLinePolygon");
  function Tn(t18, e) {
    return t18.center.sdist(e) < t18.radius * t18.radius;
  }
  i(Tn, "testCirclePoint");
  function Ya(t18, e) {
    return t18.center.sdist(e.center) < (t18.radius + e.radius) * (t18.radius + e.radius);
  }
  i(Ya, "testCircleCircle");
  function $t(t18, e) {
    let n = e.pts[e.pts.length - 1];
    for (let r of e.pts) {
      if (Mt(new Oe(n, r), t18))
        return true;
      n = r;
    }
    return Tn(t18, e.pts[0]) ? true : rt(e, t18.center);
  }
  i($t, "testCirclePolygon");
  function bo(t18, e) {
    for (let n = 0; n < t18.pts.length; n++)
      if (hr(new Oe(t18.pts[n], t18.pts[(n + 1) % t18.pts.length]), e))
        return true;
    return !!(t18.pts.some((n) => rt(e, n)) || e.pts.some((n) => rt(t18, n)));
  }
  i(bo, "testPolygonPolygon");
  function rt(t18, e) {
    let n = false, r = t18.pts;
    for (let o = 0, s = r.length - 1; o < r.length; s = o++)
      r[o].y > e.y != r[s].y > e.y && e.x < (r[s].x - r[o].x) * (e.y - r[o].y) / (r[s].y - r[o].y) + r[o].x && (n = !n);
    return n;
  }
  i(rt, "testPolygonPoint");
  function fr(t18, e) {
    e = e.sub(t18.center);
    let n = ce(t18.angle), r = Math.cos(n), o = Math.sin(n), s = e.x * r + e.y * o, a = -e.x * o + e.y * r;
    return s * s / (t18.radiusX * t18.radiusX) + a * a / (t18.radiusY * t18.radiusY) < 1;
  }
  i(fr, "testEllipsePoint");
  function bn(t18, e) {
    let n = e.center.sub(t18.center), r = ce(t18.angle), o = Math.cos(r), s = Math.sin(r), a = n.x * o + n.y * s, l = -n.x * s + n.y * o;
    return fr(new _e(b(), t18.radiusX + e.radius, t18.radiusY + e.radius, 0), b(a, l));
  }
  i(bn, "testEllipseCircle");
  function yo(t18, e) {
    let n = t18.toMat2().inverse;
    return e = new Oe(n.transform(e.p1.sub(t18.center)), n.transform(e.p2.sub(t18.center))), Mt(e, new Re(b(), 1));
  }
  i(yo, "testEllipseLine");
  function Wa(t18, e) {
    if (t18.radiusX === t18.radiusY)
      return bn(e, new Re(t18.center, t18.radiusX));
    if (e.radiusX === e.radiusY)
      return bn(t18, new Re(e.center, e.radiusX));
    let n = new yt(1 / t18.radiusX ** 2, 0, 0, 0, 1 / t18.radiusY ** 2, 0, 0, 0, -1), r = new yt(1 / e.radiusX ** 2, 0, 0, 0, 1 / e.radiusY ** 2, 0, 0, 0, -1), o = t18.center.x, s = t18.center.y, a = e.center.x, l = e.center.y, u = ce(t18.angle), m = ce(e.angle), c = new yt(Math.cos(u), -Math.sin(u), o, Math.sin(u), Math.cos(u), s, 0, 0, 1), p = new yt(Math.cos(m), -Math.sin(m), a, Math.sin(m), Math.cos(m), l, 0, 0, 1), d = c.inverse, x = p.inverse, f = d.transpose.mul(n).mul(d), y = x.transpose.mul(r).mul(x), v = f.m11, A = f.m12, V = f.m13, M2 = f.m21, G2 = f.m22, F = f.m23, g = f.m31, T = f.m32, S = f.m33, D = y.m11, B = y.m12, K2 = y.m13, k2 = y.m21, z3 = y.m22, X = y.m23, te = y.m31, Q = y.m32, q = y.m33, ae = v * G2 * S - v * F * T - A * M2 * S + A * F * g + V * M2 * T - V * G2 * g, U2 = (v * G2 * q - v * F * Q - v * T * X + v * S * z3 - A * M2 * q + A * F * te + A * g * X - A * S * k2 + V * M2 * Q - V * G2 * te - V * g * z3 + V * T * k2 + M2 * T * K2 - M2 * S * B - G2 * g * K2 + G2 * S * D + F * g * B - F * T * D) / ae, I = (v * z3 * q - v * X * Q - A * k2 * q + A * X * te + V * k2 * Q - V * z3 * te - M2 * B * q + M2 * K2 * Q + G2 * D * q - G2 * K2 * te - F * D * Q + F * B * te + g * B * X - g * K2 * z3 - T * D * X + T * K2 * k2 + S * D * z3 - S * B * k2) / ae, Y = (D * z3 * q - D * X * Q - B * k2 * q + B * X * te + K2 * k2 * Q - K2 * z3 * te) / ae;
    if (U2 >= 0) {
      let j = -3 * I + U2 ** 2, ue = 3 * U2 * Y + I * U2 ** 2 - 4 * I ** 2, Z = -27 * Y ** 2 + 18 * Y * U2 * I + U2 ** 2 * I ** 2 - 4 * U2 ** 3 * Y - 4 * I ** 3;
      return !(j > 0 && ue < 0 && Z > 0);
    } else {
      let j = -3 * I + U2 ** 2, ue = -27 * Y ** 2 + 18 * Y * U2 * I + U2 ** 2 * I ** 2 - 4 * U2 ** 3 * Y - 4 * I ** 3;
      return !(j > 0 && ue > 0);
    }
  }
  i(Wa, "testEllipseEllipse");
  function xo(t18, e) {
    return gr(t18, new Ae(e.points()));
  }
  i(xo, "testEllipseRect");
  function gr(t18, e) {
    let n = t18.toMat2().inverse;
    return e = new Ae(e.pts.map((r) => n.transform(r.sub(t18.center)))), $t(new Re(b(), 1), e);
  }
  i(gr, "testEllipsePolygon");
  function $a(t18, e) {
    return t18.x === e.x && t18.y === e.y;
  }
  i($a, "testPointPoint");
  function Xa(t18, e) {
    return e instanceof w ? $a(e, t18.pt) : e instanceof Re ? Tn(e, t18.pt) : e instanceof Oe ? En(e, t18.pt) : e instanceof ee ? Cn(e, t18.pt) : e instanceof Ae ? rt(e, t18.pt) : e instanceof _e ? fr(e, t18.pt) : false;
  }
  i(Xa, "testPointShape");
  function Qa(t18, e) {
    return e instanceof w ? En(t18, e) : e instanceof Re ? Mt(t18, e) : e instanceof Oe ? vn(t18, e) != null : e instanceof ee ? wn(e, t18) : e instanceof Ae ? hr(t18, e) : e instanceof _e ? yo(e, t18) : false;
  }
  i(Qa, "testLineShape");
  function Ja(t18, e) {
    return e instanceof w ? Tn(t18, e) : e instanceof Re ? Ya(t18, e) : e instanceof Oe ? Mt(e, t18) : e instanceof ee ? fo(e, t18) : e instanceof Ae ? $t(t18, e) : e instanceof _e ? bn(e, t18) : false;
  }
  i(Ja, "testCircleShape");
  function Za(t18, e) {
    return e instanceof w ? Cn(t18, e) : e instanceof Re ? fo(t18, e) : e instanceof Oe ? wn(t18, e) : e instanceof ee ? dr(t18, e) : e instanceof Ae ? go2(t18, e) : e instanceof _e ? xo(e, t18) : false;
  }
  i(Za, "testRectShape");
  function eu(t18, e) {
    return e instanceof w ? rt(t18, e) : e instanceof Re ? $t(e, t18) : e instanceof Oe ? hr(e, t18) : e instanceof ee ? go2(e, t18) : e instanceof Ae ? bo(e, t18) : e instanceof _e ? gr(e, t18) : false;
  }
  i(eu, "testPolygonShape");
  function tu(t18, e) {
    return e instanceof w ? fr(t18, e) : e instanceof Re ? bn(t18, e) : e instanceof Oe ? yo(t18, e) : e instanceof ee ? xo(t18, e) : e instanceof Ae ? gr(t18, e) : e instanceof _e ? Wa(e, t18) : false;
  }
  i(tu, "testEllipseShape");
  function vo(t18, e, n) {
    let r = t18, o = n.p1, s = n.p2, a = e, l = s.sub(o), u = a.cross(l);
    if (Math.abs(u) < Number.EPSILON)
      return null;
    let m = o.sub(r), c = m.cross(l) / u;
    if (c <= 0 || c >= 1)
      return null;
    let p = m.cross(a) / u;
    if (p <= 0 || p >= 1)
      return null;
    let d = l.normal().unit();
    return e.dot(d) > 0 && (d.x *= -1, d.y *= -1), { point: r.add(a.scale(c)), normal: d, fraction: c };
  }
  i(vo, "raycastLine");
  function nu(t18, e, n) {
    let r = Number.NEGATIVE_INFINITY, o = Number.POSITIVE_INFINITY, s;
    if (t18.x != 0) {
      let a = (n.pos.x - t18.x) / e.x, l = (n.pos.x + n.width - t18.x) / e.x;
      s = b(-Math.sign(e.x), 0), r = Math.max(r, Math.min(a, l)), o = Math.min(o, Math.max(a, l));
    }
    if (t18.y != 0) {
      let a = (n.pos.y - t18.y) / e.y, l = (n.pos.y + n.height - t18.y) / e.y;
      Math.min(a, l) > r && (s = b(0, -Math.sign(e.y))), r = Math.max(r, Math.min(a, l)), o = Math.min(o, Math.max(a, l));
    }
    return o >= r && r >= 0 && r <= 1 ? { point: t18.add(e.scale(r)), normal: s, fraction: r } : null;
  }
  i(nu, "raycastRect");
  function wo(t18, e, n) {
    let r = t18, o = n.center, s = e, a = s.dot(s), l = r.sub(o), u = 2 * s.dot(l), m = l.dot(l) - n.radius * n.radius, c = u * u - 4 * a * m;
    if (a <= Number.EPSILON || c < 0)
      return null;
    if (c == 0) {
      let p = -u / (2 * a);
      if (p >= 0 && p <= 1) {
        let d = r.add(s.scale(p));
        return { point: d, normal: d.sub(o), fraction: p };
      }
    } else {
      let p = (-u + Math.sqrt(c)) / (2 * a), d = (-u - Math.sqrt(c)) / (2 * a), x = null;
      if (p >= 0 && p <= 1 && (x = p), d >= 0 && d <= 1 && (x = Math.min(d, x ?? d)), x != null) {
        let f = r.add(s.scale(x));
        return { point: f, normal: f.sub(o).unit(), fraction: x };
      }
    }
    return null;
  }
  i(wo, "raycastCircle");
  function ru(t18, e, n) {
    let r = n.pts, o = null, s = r[r.length - 1];
    for (let a = 0; a < r.length; a++) {
      let l = r[a], u = vo(t18, e, new Oe(s, l));
      u && (!o || o.fraction > u.fraction) && (o = u), s = l;
    }
    return o;
  }
  i(ru, "raycastPolygon");
  function ou(t18, e, n) {
    let r = n.toMat2(), o = r.inverse, s = o.transform(t18.sub(n.center)), a = o.transform(e), l = wo(s, a, new Re(b(), 1));
    if (l) {
      let u = Dt.rotation(ce(-n.angle)), c = Dt.scale(n.radiusX, n.radiusY).transform(l.point), p = r.transform(l.point).add(n.center), d = p.dist(t18) / e.len();
      return { point: p, normal: u.transform(b(n.radiusY ** 2 * c.x, n.radiusX ** 2 * c.y)).unit(), fraction: d };
    }
    return l;
  }
  i(ou, "raycastEllipse");
  function Co(t18, e, n, r = 64) {
    let o = t18, s = e.len(), a = e.scale(1 / s), l = 0, u = b(Math.floor(t18.x), Math.floor(t18.y)), m = b(a.x > 0 ? 1 : -1, a.y > 0 ? 1 : -1), c = b(Math.abs(1 / a.x), Math.abs(1 / a.y)), p = b(m.x > 0 ? u.x + 1 - t18.x : t18.x - u.x, m.y > 0 ? u.y + 1 - t18.y : t18.y - u.y), d = b(c.x < 1 / 0 ? c.x * p.x : 1 / 0, c.y < 1 / 0 ? c.y * p.y : 1 / 0), x = -1;
    for (; l <= r; ) {
      let f = n(u);
      if (f === true)
        return { point: o.add(a.scale(l)), normal: b(x === 0 ? -m.x : 0, x === 1 ? -m.y : 0), fraction: l / s, gridPos: u };
      if (f)
        return f;
      d.x < d.y ? (u.x += m.x, l = d.x, d.x += c.x, x = 0) : (u.y += m.y, l = d.y, d.y += c.y, x = 1);
    }
    return null;
  }
  i(Co, "raycastGrid");
  var yn = class t7 {
    static {
      i(this, "Point");
    }
    pt;
    constructor(e) {
      this.pt = e.clone();
    }
    transform(e) {
      return new t7(e.multVec2(this.pt));
    }
    bbox() {
      return new ee(this.pt, 0, 0);
    }
    area() {
      return 0;
    }
    clone() {
      return new t7(this.pt);
    }
    collides(e) {
      return Xa(this, e);
    }
    contains(e) {
      return this.pt.eq(e);
    }
    raycast(e, n) {
      return null;
    }
    random() {
      return this.pt.clone();
    }
  };
  var Oe = class t8 {
    static {
      i(this, "Line");
    }
    p1;
    p2;
    constructor(e, n) {
      this.p1 = e.clone(), this.p2 = n.clone();
    }
    transform(e) {
      return new t8(e.multVec2(this.p1), e.multVec2(this.p2));
    }
    bbox() {
      return ee.fromPoints(this.p1, this.p2);
    }
    area() {
      return this.p1.dist(this.p2);
    }
    clone() {
      return new t8(this.p1, this.p2);
    }
    collides(e) {
      return Qa(this, e);
    }
    contains(e) {
      return this.collides(e);
    }
    raycast(e, n) {
      return vo(e, n, this);
    }
    random() {
      return this.p1.add(this.p2.sub(this.p1).scale(ge(1)));
    }
  };
  var ee = class t9 {
    static {
      i(this, "Rect");
    }
    pos;
    width;
    height;
    constructor(e, n, r) {
      this.pos = e.clone(), this.width = n, this.height = r;
    }
    static fromPoints(e, n) {
      return new t9(e.clone(), n.x - e.x, n.y - e.y);
    }
    center() {
      return new w(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
    }
    points() {
      return [this.pos, this.pos.add(this.width, 0), this.pos.add(this.width, this.height), this.pos.add(0, this.height)];
    }
    transform(e) {
      return new Ae(this.points().map((n) => e.multVec2(n)));
    }
    bbox() {
      return this.clone();
    }
    area() {
      return this.width * this.height;
    }
    clone() {
      return new t9(this.pos.clone(), this.width, this.height);
    }
    distToPoint(e) {
      return Math.sqrt(this.sdistToPoint(e));
    }
    sdistToPoint(e) {
      let n = this.pos, r = this.pos.add(this.width, this.height), o = Math.max(n.x - e.x, 0, e.x - r.x), s = Math.max(n.y - e.y, 0, e.y - r.y);
      return o * o + s * s;
    }
    collides(e) {
      return Za(this, e);
    }
    contains(e) {
      return this.collides(e);
    }
    raycast(e, n) {
      return nu(e, n, this);
    }
    random() {
      return this.pos.add(ge(this.width), ge(this.height));
    }
  };
  var Re = class t10 {
    static {
      i(this, "Circle");
    }
    center;
    radius;
    constructor(e, n) {
      this.center = e.clone(), this.radius = n;
    }
    transform(e) {
      return new _e(this.center, this.radius, this.radius).transform(e);
    }
    bbox() {
      return ee.fromPoints(this.center.sub(b(this.radius)), this.center.add(b(this.radius)));
    }
    area() {
      return this.radius * this.radius * Math.PI;
    }
    clone() {
      return new t10(this.center, this.radius);
    }
    collides(e) {
      return Ja(this, e);
    }
    contains(e) {
      return this.collides(e);
    }
    raycast(e, n) {
      return wo(e, n, this);
    }
    random() {
      return this.center.add(w.fromAngle(ge(360)).scale(ge(this.radius)));
    }
  };
  var _e = class t11 {
    static {
      i(this, "Ellipse");
    }
    center;
    radiusX;
    radiusY;
    angle;
    constructor(e, n, r, o = 0) {
      this.center = e.clone(), this.radiusX = n, this.radiusY = r, this.angle = o;
    }
    static fromMat2(e) {
      let n = e.inverse, r = n.transpose.mul(n), [o, s] = r.eigenvalues, [a, l] = r.eigenvectors(o, s), [u, m] = [1 / Math.sqrt(o), 1 / Math.sqrt(s)];
      return u > m ? new t11(b(), u, m, pt(Math.atan2(-a[1], a[0]))) : new t11(b(), m, u, pt(Math.atan2(-l[1], l[0])));
    }
    toMat2() {
      let e = ce(this.angle), n = Math.cos(e), r = Math.sin(e);
      return new Dt(n * this.radiusX, -r * this.radiusY, r * this.radiusX, n * this.radiusY);
    }
    transform(e) {
      if (this.angle == 0 && e.getRotation() == 0)
        return new t11(e.multVec2(this.center), e.m[0] * this.radiusX, e.m[5] * this.radiusY);
      {
        let n = this.toMat2(), r = e.getRotation(), o = e.getScale();
        n = yt.fromMat2(n).scale(o.x, o.y).rotate(r).toMat2();
        let a = t11.fromMat2(n);
        return a.center = e.multVec2(this.center), a;
      }
    }
    bbox() {
      if (this.angle == 0)
        return ee.fromPoints(this.center.sub(b(this.radiusX, this.radiusY)), this.center.add(b(this.radiusX, this.radiusY)));
      {
        let e = ce(this.angle), n = Math.cos(e), r = Math.sin(e), o = this.radiusX * n, s = this.radiusX * r, a = this.radiusY * r, l = this.radiusY * n, u = Math.sqrt(o * o + a * a), m = Math.sqrt(s * s + l * l);
        return ee.fromPoints(this.center.sub(b(u, m)), this.center.add(b(u, m)));
      }
    }
    area() {
      return this.radiusX * this.radiusY * Math.PI;
    }
    clone() {
      return new t11(this.center, this.radiusX, this.radiusY, this.angle);
    }
    collides(e) {
      return tu(this, e);
    }
    contains(e) {
      e = e.sub(this.center);
      let n = ce(this.angle), r = Math.cos(n), o = Math.sin(n), s = e.x * r + e.y * o, a = -e.x * o + e.y * r;
      return s * s / (this.radiusX * this.radiusX) + a * a / (this.radiusY * this.radiusY) < 1;
    }
    raycast(e, n) {
      return ou(e, n, this);
    }
    random() {
      return this.center;
    }
  };
  function iu(t18, e, n, r) {
    let o = e.sub(t18), s = r.sub(n), a = o.cross(s);
    return a < 1e-5 && a > -1e-5 || (a = n.sub(t18).cross(s) / a, a < 0 || a > 1) ? null : t18.add(o.scale(a));
  }
  i(iu, "segmentLineIntersection");
  var Ae = class t12 {
    static {
      i(this, "Polygon");
    }
    pts;
    constructor(e) {
      if (e.length < 3)
        throw new Error("Polygons should have at least 3 vertices");
      this.pts = e;
    }
    transform(e) {
      return new t12(this.pts.map((n) => e.multVec2(n)));
    }
    bbox() {
      let e = b(Number.MAX_VALUE), n = b(-Number.MAX_VALUE);
      for (let r of this.pts)
        e.x = Math.min(e.x, r.x), n.x = Math.max(n.x, r.x), e.y = Math.min(e.y, r.y), n.y = Math.max(n.y, r.y);
      return ee.fromPoints(e, n);
    }
    area() {
      let e = 0, n = this.pts.length;
      for (let r = 0; r < n; r++) {
        let o = this.pts[r], s = this.pts[(r + 1) % n];
        e += o.x * s.y * 0.5, e -= s.x * o.y * 0.5;
      }
      return Math.abs(e);
    }
    clone() {
      return new t12(this.pts.map((e) => e.clone()));
    }
    collides(e) {
      return eu(this, e);
    }
    contains(e) {
      return this.collides(e);
    }
    raycast(e, n) {
      return ru(e, n, this);
    }
    random() {
      return b();
    }
    cut(e, n) {
      let r = new Oe(e, n), o = [], s = [], a = n.sub(e), l = this.pts[this.pts.length - 1], u = l.sub(e), m = a.cross(u) > 0;
      return this.pts.forEach((c) => {
        u = c.sub(e);
        let p = a.cross(u) > 0;
        if (m != p) {
          let d = iu(l, c, e, n);
          o.push(d), s.push(d), m = p;
        }
        (p ? o : s).push(c), l = c;
      }), [o.length ? new t12(o) : null, s.length ? new t12(s) : null];
    }
  };
  function Eo(t18, e, n, r) {
    let o = r * r, s = 1 - r, a = s * s;
    return t18.scale(a).add(e.scale(2 * s * r)).add(n.scale(o));
  }
  i(Eo, "evaluateQuadratic");
  function To(t18, e, n, r) {
    let o = 1 - r;
    return e.sub(t18).scale(2 * o).add(n.sub(e).scale(2 * r));
  }
  i(To, "evaluateQuadraticFirstDerivative");
  function Oo(t18, e, n, r) {
    return n.sub(e.scale(2)).add(t18).scale(2);
  }
  i(Oo, "evaluateQuadraticSecondDerivative");
  function Xt(t18, e, n, r, o) {
    let s = o * o, a = s * o, l = 1 - o, u = l * l, m = u * l;
    return t18.scale(m).add(e.scale(3 * u * o)).add(n.scale(3 * l * s)).add(r.scale(a));
  }
  i(Xt, "evaluateBezier");
  function Ao(t18, e, n, r, o) {
    let s = o * o, a = 1 - o, l = a * a;
    return e.sub(t18).scale(3 * l).add(n.sub(e).scale(6 * a * o)).add(r.sub(n).scale(3 * s));
  }
  i(Ao, "evaluateBezierFirstDerivative");
  function So(t18, e, n, r, o) {
    let s = 1 - o;
    return n.sub(e.scale(2)).add(t18).scale(6 * s).add(r.sub(n.scale(2)).add(e).scale(6 * o));
  }
  i(So, "evaluateBezierSecondDerivative");
  function Vo(t18, e, n, r, o) {
    let s = 0.5 * (((-o + 2) * o - 1) * o), a = 0.5 * ((3 * o - 5) * o * o + 2), l = 0.5 * (((-3 * o + 4) * o + 1) * o), u = 0.5 * ((o - 1) * o * o);
    return t18.scale(s).add(e.scale(a)).add(n.scale(l)).add(r.scale(u));
  }
  i(Vo, "evaluateCatmullRom");
  function Po(t18, e, n, r, o) {
    let s = 0.5 * ((-3 * o + 4) * o - 1), a = 0.5 * ((9 * o - 10) * o), l = 0.5 * ((-9 * o + 8) * o + 1), u = 0.5 * ((3 * o - 2) * o);
    return t18.scale(s).add(e.scale(a)).add(n.scale(l)).add(r.scale(u));
  }
  i(Po, "evaluateCatmullRomFirstDerivative");
  function Ro(t18) {
    let e = br(t18), n = e(1);
    return (r) => {
      let o = r * n, s = e(o, true);
      return t18(s);
    };
  }
  i(Ro, "normalizedCurve");
  function br(t18, e = 10, n = 10) {
    let r = [0], o = [0], a = 1 / (e - 1) / n, l = 0, u = t18(0), m = 0;
    for (let c = 1; c < e; c++) {
      for (let p = 0; p < n; p++) {
        m += a;
        let d = t18(m), x = d.dist(u);
        l += x, u = d;
      }
      r[c] = l, o[c] = m;
    }
    return o[e - 1] = 1, (c, p = false) => {
      if (p) {
        let d = c;
        if (d <= 0)
          return 0;
        if (d >= l)
          return 1;
        let x = 0;
        for (; r[x + 1] < d; )
          x++;
        let f = o[x], y = o[x + 1], v = r[x], A = r[x + 1], V = (d - v) / (A - v);
        return f + (y - f) * V;
      } else {
        if (c <= 0)
          return 0;
        if (c >= 1)
          return r[e - 1];
        let d = 0;
        for (; o[d + 1] < c; )
          d++;
        let x = o[d], f = o[d + 1], y = r[d], v = r[d + 1], A = (c - x) / (f - x);
        return y + (v - y) * A;
      }
    };
  }
  i(br, "curveLengthApproximation");
  function Ut(t18, e, n, r) {
    let o = 2 * t18 + e - 2 * r + n, s = -3 * t18 + 3 * r - 2 * e - n, a = e, l = t18;
    return (u) => {
      let m = u * u, c = m * u;
      return o * c + s * m + a * u + l;
    };
  }
  i(Ut, "hermite");
  function yr(t18, e, n, r, o, s = Ut) {
    let a = s(e.x, (1 - o) * (n.x - t18.x), (1 - o) * (r.x - e.x), n.x), l = s(e.y, (1 - o) * (n.y - t18.y), (1 - o) * (r.y - e.y), n.y);
    return (u) => new w(a(u), l(u));
  }
  i(yr, "cardinal");
  function Bt(t18, e, n, r, o = Ut) {
    return yr(t18, e, n, r, 0.5, o);
  }
  i(Bt, "catmullRom");
  function Go(t18, e, n, r, o = Ut) {
    return Bt(r.add(t18.sub(e).scale(6)), t18, r, t18.add(r.sub(n).scale(6)), o);
  }
  i(Go, "bezier");
  function Do(t18, e, n, r, o, s, a, l = Ut) {
    let u = l(e.x, 0.5 * (1 - o) * (1 + a) * (1 + s) * (e.x - t18.x) + 0.5 * (1 - o) * (1 - a) * (1 - s) * (n.x - e.x), 0.5 * (1 - o) * (1 + a) * (1 - s) * (n.x - e.x) + 0.5 * (1 - o) * (1 - a) * (1 + s) * (r.x - n.x), n.x), m = l(e.y, 0.5 * (1 - o) * (1 + a) * (1 + s) * (e.y - t18.y) + 0.5 * (1 - o) * (1 - a) * (1 - s) * (n.y - e.y), 0.5 * (1 - o) * (1 + a) * (1 - s) * (n.y - e.y) + 0.5 * (1 - o) * (1 - a) * (1 + s) * (r.y - n.y), n.y);
    return (c) => new w(u(c), m(c));
  }
  i(Do, "kochanekBartels");
  function Mo(t18, e, n, r) {
    let o = 2 * t18 + e - 2 * r + n, s = -3 * t18 + 3 * r - 2 * e + n, a = e;
    return (l) => {
      let u = l * l;
      return 3 * o * u + 2 * s * l + a;
    };
  }
  i(Mo, "hermiteFirstDerivative");
  function zt(t18) {
    return 0 <= t18 && t18 <= 1;
  }
  i(zt, "inZeroOneDomain");
  function ur(t18, e) {
    return Math.abs(t18 - e) <= Number.EPSILON;
  }
  i(ur, "approximately");
  function Yt(t18) {
    return t18 < 0 ? -Math.pow(-t18, 1 / 3) : Math.pow(t18, 1 / 3);
  }
  i(Yt, "cubeRoot");
  function su(t18, e, n, r) {
    let o = 3 * t18 - 6 * e + 3 * n, s = -3 * t18 + 3 * e, a = t18, l = -t18 + 3 * e - 3 * n + r;
    if (ur(l, 0)) {
      if (ur(o, 0))
        return ur(s, 0) ? [] : [-a / s].filter(zt);
      let A = Math.sqrt(s * s - 4 * o * a), V = 2 * o;
      return [(A - s) / V, (-s - A) / V].filter(zt);
    }
    o /= l, s /= l, a /= l;
    let u = (3 * s - o * o) / 3, m = u / 3, c = (2 * o * o * o - 9 * o * s + 27 * a) / 27, p = c / 2, d = p * p + m * m * m;
    if (d < 0) {
      let A = -u / 3, V = A * A * A, M2 = Math.sqrt(V), G2 = -c / (2 * M2), F = G2 < -1 ? -1 : G2 > 1 ? 1 : G2, g = Math.acos(F), S = 2 * Yt(M2), D = S * Math.cos(g / 3) - o / 3, B = S * Math.cos((g + 2 * Math.PI) / 3) - o / 3, K2 = S * Math.cos((g + 4 * Math.PI) / 3) - o / 3;
      return [D, B, K2].filter(zt);
    }
    if (d === 0) {
      let A = p < 0 ? Yt(-p) : -Yt(p), V = 2 * A - o / 3, M2 = -A - o / 3;
      return [V, M2].filter(zt);
    }
    let x = Math.sqrt(d), f = Yt(x - p), y = Yt(x + p);
    return [f - y - o / 3].filter(zt);
  }
  i(su, "getCubicRoots");
  function au(t18, e, n, r, o) {
    let s = su(t18.x - o, e.x - o, n.x - o, r.x - o);
    return s.length > 0 ? Xt(t18, e, n, r, s[0]).y : NaN;
  }
  i(au, "cubicBezierYforX");
  function Uo(t18) {
    if (!t18 || t18.length == 0)
      throw new Error("Need at least one point for easingLinear.");
    let e = t18.length;
    return (n) => {
      if (n <= 0 || t18.length == 1 || n <= t18[0].x)
        return t18[0].y;
      for (let r = 0; r < e; r++)
        if (t18[r].x >= n)
          return De(n, t18[r - 1].x, t18[r].x, t18[r - 1].y, t18[r].y);
      return t18[t18.length - 1].y;
    };
  }
  i(Uo, "easingLinear");
  function Bo(t18, e) {
    return (n) => au(b(0, 0), t18, e, b(1, 1), n);
  }
  i(Bo, "easingCubicBezier");
  function Fo(t18, e = "jump-end") {
    let n = 1 / t18, r = e == "jump-start" || e == "jump-both", o = e == "jump-end" || e == "jump-both", s = 1 / (t18 + (o ? 1 : 0)), a = r ? s : 0;
    return (l) => {
      let u = Math.floor(l / n);
      return a + u * s;
    };
  }
  i(Fo, "easingSteps");
  function Lo(t18, e) {
    let n = Number.MAX_VALUE, r = { normal: b(0), distance: 0 };
    for (let o of [t18, e])
      for (let s = 0; s < o.pts.length; s++) {
        let a = o.pts[s], u = o.pts[(s + 1) % o.pts.length].sub(a).normal().unit(), m = Number.MAX_VALUE, c = -Number.MAX_VALUE;
        for (let f = 0; f < t18.pts.length; f++) {
          let y = t18.pts[f].dot(u);
          m = Math.min(m, y), c = Math.max(c, y);
        }
        let p = Number.MAX_VALUE, d = -Number.MAX_VALUE;
        for (let f = 0; f < e.pts.length; f++) {
          let y = e.pts[f].dot(u);
          p = Math.min(p, y), d = Math.max(d, y);
        }
        let x = Math.min(c, d) - Math.max(m, p);
        if (x < 0)
          return null;
        if (x < Math.abs(n)) {
          let f = d - m, y = p - c;
          n = Math.abs(f) < Math.abs(y) ? f : y, r.normal = u, r.distance = n;
        }
      }
    return r;
  }
  i(Lo, "sat");
  function Io(t18, e, n) {
    return (e.x - t18.x) * (n.y - t18.y) - (e.y - t18.y) * (n.x - t18.x) >= 0;
  }
  i(Io, "isOrientedCcw");
  function uu(t18) {
    let e = 0, n = t18[t18.length - 1];
    for (let r = 0; r < t18.length; r++)
      e += (t18[r].x - n.x) * (t18[r].y + n.y), n = t18[r];
    return e < 0;
  }
  i(uu, "isOrientedCcwPolygon");
  function cr(t18, e, n, r) {
    let o = r.x - n.x, s = r.y - n.y, a = o * (t18.y - n.y) - s * (t18.x - n.x), l = o * (e.y - n.y) - s * (e.x - n.x);
    return a * l >= 0;
  }
  i(cr, "onSameSide");
  function cu(t18, e, n, r) {
    return cr(t18, e, n, r) && cr(t18, n, e, r) && cr(t18, r, e, n);
  }
  i(cu, "pointInTriangle");
  function lu(t18, e, n, r) {
    for (let o of t18)
      if (o !== e && o !== n && o !== r && cu(o, e, n, r))
        return true;
    return false;
  }
  i(lu, "someInTriangle");
  function mu(t18, e, n, r) {
    return Io(t18, e, n) && !lu(r, t18, e, n);
  }
  i(mu, "isEar");
  function On(t18) {
    if (t18.length < 3)
      return [];
    if (t18.length == 3)
      return [t18];
    let e = [], n = [], r = 0;
    for (let p = 0; p < t18.length; p++) {
      let d = t18[r], x = t18[p];
      (x.x < d.x || x.x == d.x && x.y < d.y) && (r = r), e[p] = p + 1, n[p] = p - 1;
    }
    e[e.length - 1] = 0, n[0] = n.length - 1, uu(t18) || ([e, n] = [n, e]);
    let o = [];
    for (let p = 0; p < t18.length; ++p)
      Io(t18[n[p]], t18[p], t18[e[p]]) || o.push(t18[p]);
    let s = [], a = t18.length, l = 1, u = 0, m, c;
    for (; a > 3; ) {
      m = e[l], c = n[l];
      let p = t18[c], d = t18[l], x = t18[m];
      if (mu(p, d, x, o))
        s.push([p, d, x]), e[c] = m, n[m] = c, o.splice(o.indexOf(d), 1), --a, u = 0;
      else if (++u > a)
        return [];
      l = m;
    }
    return m = e[l], c = n[l], s.push([t18[c], t18[l], t18[m]]), s;
  }
  i(On, "triangulate");
  function jo(t18) {
    if (t18.length < 3)
      return false;
    let e = t18.length - 2, n = t18.length - 1, r = 0, o = t18[n].sub(t18[e]), s = t18[r].sub(t18[n]), a = o.cross(s);
    for (; r + 1 < t18.length; )
      if (e = n, n = r, r++, o = t18[n].sub(t18[e]), s = t18[r].sub(t18[n]), o.cross(s) * a < 0)
        return false;
    return true;
  }
  i(jo, "isConvex");
  var Ko = i((t18) => t18[0] instanceof H, "arrayIsColor");
  var ko = i((t18) => t18[0] instanceof w, "arrayIsVec2");
  var _o = i((t18) => typeof t18[0] == "number", "arrayIsNumber");
  function No(t18) {
    return t18?.prototype && Object.getOwnPropertyDescriptor(t18.prototype, "constructor") !== void 0;
  }
  i(No, "isClass");
  var Ft = class {
    static {
      i(this, "BinaryHeap");
    }
    _items;
    _compareFn;
    constructor(e = (n, r) => n < r) {
      this._compareFn = e, this._items = [];
    }
    insert(e) {
      this._items.push(e), this.moveUp(this._items.length - 1);
    }
    remove() {
      if (this._items.length === 0)
        return null;
      let e = this._items[0], n = this._items.pop();
      return this._items.length !== 0 && (this._items[0] = n, this.moveDown(0)), e;
    }
    clear() {
      this._items.splice(0, this._items.length);
    }
    moveUp(e) {
      for (; e > 0; ) {
        let n = Math.floor((e - 1) / 2);
        if (!this._compareFn(this._items[e], this._items[n]) && this._items[e] >= this._items[n])
          break;
        this.swap(e, n), e = n;
      }
    }
    moveDown(e) {
      for (; e < Math.floor(this._items.length / 2); ) {
        let n = 2 * e + 1;
        if (n < this._items.length - 1 && !this._compareFn(this._items[n], this._items[n + 1]) && ++n, this._compareFn(this._items[e], this._items[n]))
          break;
        this.swap(e, n), e = n;
      }
    }
    swap(e, n) {
      [this._items[e], this._items[n]] = [this._items[n], this._items[e]];
    }
    get length() {
      return this._items.length;
    }
  };
  function pu(t18) {
    let e = window.atob(t18), n = e.length, r = new Uint8Array(n);
    for (let o = 0; o < n; o++)
      r[o] = e.charCodeAt(o);
    return r.buffer;
  }
  i(pu, "base64ToArrayBuffer");
  function Ho(t18) {
    return pu(t18.split(",")[1]);
  }
  i(Ho, "dataURLToArrayBuffer");
  function An(t18, e) {
    let n = document.createElement("a");
    n.href = e, n.download = t18, n.click();
  }
  i(An, "download");
  function xr(t18, e) {
    An(t18, "data:text/plain;charset=utf-8," + e);
  }
  i(xr, "downloadText");
  function qo(t18, e) {
    xr(t18, JSON.stringify(e));
  }
  i(qo, "downloadJSON");
  function vr(t18, e) {
    let n = URL.createObjectURL(e);
    An(t18, n), URL.revokeObjectURL(n);
  }
  i(vr, "downloadBlob");
  var Sn = i((t18) => t18.match(/^data:\w+\/\w+;base64,.+/), "isDataURL");
  var zo = i((t18) => t18.split(".").slice(0, -1).join("."), "getFileName");
  function Vn(t18, e) {
    if (t18 === e)
      return true;
    let n = typeof t18, r = typeof e;
    if (n !== r)
      return false;
    if (n === "object" && r === "object" && t18 !== null && e !== null) {
      if (Array.isArray(t18) !== Array.isArray(e))
        return false;
      let o = Object.keys(t18), s = Object.keys(e);
      if (o.length !== s.length)
        return false;
      for (let a of o) {
        let l = t18[a], u = e[a];
        if (!Vn(l, u))
          return false;
      }
      return true;
    }
    return false;
  }
  i(Vn, "deepEq");
  var Qt = class extends Map {
    static {
      i(this, "Registry");
    }
    lastID = 0;
    push(e) {
      let n = this.lastID;
      return this.set(n, e), this.lastID++, n;
    }
    pushd(e) {
      let n = this.push(e);
      return () => this.delete(n);
    }
  };
  var Ze = class t13 {
    static {
      i(this, "KEventController");
    }
    paused = false;
    cancel;
    constructor(e) {
      this.cancel = e;
    }
    static join(e) {
      let n = new t13(() => e.forEach((r) => r.cancel()));
      return Object.defineProperty(n, "paused", { get: i(() => e[0].paused, "get"), set: i((r) => e.forEach((o) => o.paused = r), "set") }), n.paused = false, n;
    }
  };
  var le = class {
    static {
      i(this, "KEvent");
    }
    handlers = new Qt();
    add(e) {
      let n = this.handlers.pushd((...o) => {
        r.paused || e(...o);
      }), r = new Ze(n);
      return r;
    }
    addOnce(e) {
      let n = this.add((...r) => {
        n.cancel(), e(...r);
      });
      return n;
    }
    next() {
      return new Promise((e) => this.addOnce(e));
    }
    trigger(...e) {
      this.handlers.forEach((n) => n(...e));
    }
    numListeners() {
      return this.handlers.size;
    }
    clear() {
      this.handlers.clear();
    }
  };
  var $e = class {
    static {
      i(this, "KEventHandler");
    }
    handlers = {};
    registers = {};
    on(e, n) {
      return this.handlers[e] || (this.handlers[e] = new le()), this.handlers[e].add(n);
    }
    onOnce(e, n) {
      let r = this.on(e, (...o) => {
        r.cancel(), n(...o);
      });
      return r;
    }
    next(e) {
      return new Promise((n) => {
        this.onOnce(e, (...r) => n(r[0]));
      });
    }
    trigger(e, ...n) {
      this.handlers[e] && this.handlers[e].trigger(...n);
    }
    remove(e) {
      delete this.handlers[e];
    }
    clear() {
      this.handlers = {};
    }
    numListeners(e) {
      return this.handlers[e]?.numListeners() ?? 0;
    }
  };
  var Yo = i((t18) => t18 instanceof Error ? t18.message : String(t18), "getErrorMessage");
  function Jt(t18, e) {
    return Number(t18.toFixed(e));
  }
  i(Jt, "toFixed");
  function de(t18, e) {
    return (...n) => {
      let r = n.length;
      if (r === t18.length)
        return t18(...n);
      if (r === e.length)
        return e(...n);
    };
  }
  i(de, "overload2");
  var du = Object.freeze([776, 2359, 2367, 2984, 3007, 3021, 3633, 3635, 3648, 3657, 4352, 4449, 4520]);
  function $o(t18) {
    if (typeof t18 != "string")
      throw new TypeError("string cannot be undefined or null");
    let e = [], n = 0, r = 0;
    for (; n < t18.length; ) {
      if (r += hu(n + r, t18), wu(t18[n + r]) && r++, yu(t18[n + r]) && r++, xu(t18[n + r]) && r++, Cu(t18[n + r])) {
        r++;
        continue;
      }
      e.push(t18.substring(n, n + r)), n += r, r = 0;
    }
    return e;
  }
  i($o, "runes");
  function hu(t18, e) {
    let n = e[t18];
    if (!fu(n) || t18 === e.length - 1)
      return 1;
    let r = n + e[t18 + 1], o = e.substring(t18 + 2, t18 + 5);
    return Wo(r) && Wo(o) ? 4 : gu(r) && vu(o) ? e.slice(t18).indexOf(String.fromCodePoint(917631)) + 2 : bu(o) ? 4 : 2;
  }
  i(hu, "nextUnits");
  function fu(t18) {
    return t18 && xt(t18[0].charCodeAt(0), 55296, 56319);
  }
  i(fu, "isFirstOfSurrogatePair");
  function Wo(t18) {
    return xt(wr(t18), 127462, 127487);
  }
  i(Wo, "isRegionalIndicator");
  function gu(t18) {
    return xt(wr(t18), 127988, 127988);
  }
  i(gu, "isSubdivisionFlag");
  function bu(t18) {
    return xt(wr(t18), 127995, 127999);
  }
  i(bu, "isFitzpatrickModifier");
  function yu(t18) {
    return typeof t18 == "string" && xt(t18.charCodeAt(0), 65024, 65039);
  }
  i(yu, "isVariationSelector");
  function xu(t18) {
    return typeof t18 == "string" && xt(t18.charCodeAt(0), 8400, 8447);
  }
  i(xu, "isDiacriticalMark");
  function vu(t18) {
    let e = t18.codePointAt(0);
    return typeof t18 == "string" && typeof e == "number" && xt(e, 917504, 917631);
  }
  i(vu, "isSupplementarySpecialpurposePlane");
  function wu(t18) {
    return typeof t18 == "string" && du.includes(t18.charCodeAt(0));
  }
  i(wu, "isGrapheme");
  function Cu(t18) {
    return typeof t18 == "string" && t18.charCodeAt(0) === 8205;
  }
  i(Cu, "isZeroWidthJoiner");
  function wr(t18) {
    let e = t18.charCodeAt(0) - 55296, n = t18.charCodeAt(1) - 56320;
    return (e << 10) + n + 65536;
  }
  i(wr, "codePointFromSurrogatePair");
  function xt(t18, e, n) {
    return t18 >= e && t18 <= n;
  }
  i(xt, "betweenInclusive");
  var Fe = i((t18, e) => Array.isArray(t18) ? t18?.includes(e) : t18 === e, "isEqOrIncludes");
  var Xe = i((t18, e) => Array.isArray(e) ? e.some((n) => t18.has(n)) : t18.has(e), "setHasOrIncludes");
  var Pn = i((t18, e, n) => {
    t18.has(e) ? t18.get(e)?.push(n) : t18.set(e, [n]);
  }, "mapAddOrPush");
  var Xo = /* @__PURE__ */ (() => {
    let t18 = 0;
    return () => t18++;
  })();
  var Cr = { "Joy-Con L+R (STANDARD GAMEPAD Vendor: 057e Product: 200e)": { buttons: { "0": "south", "1": "east", "2": "west", "3": "north", "4": "lshoulder", "5": "rshoulder", "6": "ltrigger", "7": "rtrigger", "8": "select", "9": "start", "10": "lstick", "11": "rstick", "12": "dpad-up", "13": "dpad-down", "14": "dpad-left", "15": "dpad-right", "16": "home", "17": "capture" }, sticks: { left: { x: 0, y: 1 }, right: { x: 2, y: 3 } } }, "Joy-Con (L) (STANDARD GAMEPAD Vendor: 057e Product: 2006)": { buttons: { "0": "south", "1": "east", "2": "west", "3": "north", "4": "lshoulder", "5": "rshoulder", "9": "select", "10": "lstick", "16": "start" }, sticks: { left: { x: 0, y: 1 } } }, "Joy-Con (R) (STANDARD GAMEPAD Vendor: 057e Product: 2007)": { buttons: { "0": "south", "1": "east", "2": "west", "3": "north", "4": "lshoulder", "5": "rshoulder", "9": "start", "10": "lstick", "16": "select" }, sticks: { left: { x: 0, y: 1 } } }, "Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)": { buttons: { "0": "south", "1": "east", "2": "west", "3": "north", "4": "lshoulder", "5": "rshoulder", "6": "ltrigger", "7": "rtrigger", "8": "select", "9": "start", "10": "lstick", "11": "rstick", "12": "dpad-up", "13": "dpad-down", "14": "dpad-left", "15": "dpad-right", "16": "home", "17": "capture" }, sticks: { left: { x: 0, y: 1 }, right: { x: 2, y: 3 } } }, default: { buttons: { "0": "south", "1": "east", "2": "west", "3": "north", "4": "lshoulder", "5": "rshoulder", "6": "ltrigger", "7": "rtrigger", "8": "select", "9": "start", "10": "lstick", "11": "rstick", "12": "dpad-up", "13": "dpad-down", "14": "dpad-left", "15": "dpad-right", "16": "home" }, sticks: { left: { x: 0, y: 1 }, right: { x: 2, y: 3 } } } };
  var Qo = i(() => vt.lastInputDevice, "getLastInputDeviceType");
  var Jo = i(() => {
    let t18 = vt.buttons;
    for (let e in t18) {
      let n = t18[e].keyboard && [t18[e].keyboard].flat(), r = t18[e].gamepad && [t18[e].gamepad].flat(), o = t18[e].mouse && [t18[e].mouse].flat();
      n && n.forEach((s) => {
        Pn(vt.buttonsByKey, s, e);
      }), r && r.forEach((s) => {
        Pn(vt.buttonsByGamepad, s, e);
      }), o && o.forEach((s) => {
        Pn(vt.buttonsByMouse, s, e);
      });
    }
  }, "parseButtonBindings");
  var wt = class {
    static {
      i(this, "ButtonState");
    }
    pressed = /* @__PURE__ */ new Set([]);
    pressedRepeat = /* @__PURE__ */ new Set([]);
    released = /* @__PURE__ */ new Set([]);
    down = /* @__PURE__ */ new Set([]);
    update() {
      this.pressed.clear(), this.released.clear(), this.pressedRepeat.clear();
    }
    press(e) {
      this.pressed.add(e), this.pressedRepeat.add(e), this.down.add(e);
    }
    pressRepeat(e) {
      this.pressedRepeat.add(e);
    }
    release(e) {
      this.down.delete(e), this.pressed.delete(e), this.released.add(e);
    }
  };
  var Er = class {
    static {
      i(this, "GamepadState");
    }
    buttonState = new wt();
    stickState = /* @__PURE__ */ new Map();
  };
  var Tr = class {
    static {
      i(this, "FPSCounter");
    }
    dts = [];
    timer = 0;
    fps = 0;
    tick(e) {
      this.dts.push(e), this.timer += e, this.timer >= 1 && (this.timer = 0, this.fps = Math.round(1 / (this.dts.reduce((n, r) => n + r) / this.dts.length)), this.dts = []);
    }
  };
  var vt;
  var Tu = i((t18) => {
    let e = t18.buttons ?? {};
    return { canvas: t18.canvas, buttons: e, buttonsByKey: /* @__PURE__ */ new Map(), buttonsByMouse: /* @__PURE__ */ new Map(), buttonsByGamepad: /* @__PURE__ */ new Map(), loopID: null, stopped: false, dt: 0, fixedDt: 1 / 50, restDt: 0, time: 0, realTime: 0, fpsCounter: new Tr(), timeScale: 1, skipTime: false, isHidden: false, numFrames: 0, mousePos: new w(0), mouseDeltaPos: new w(0), keyState: new wt(), mouseState: new wt(), mergedGamepadState: new Er(), gamepadStates: /* @__PURE__ */ new Map(), lastInputDevice: null, buttonState: new wt(), gamepads: [], charInputted: [], isMouseMoved: false, lastWidth: t18.canvas.offsetWidth, lastHeight: t18.canvas.offsetHeight, events: new $e() };
  }, "initAppState");
  var Zo = i((t18) => {
    if (!t18.canvas)
      throw new Error("Please provide a canvas");
    let e = Tu(t18);
    vt = e, Jo();
    function n() {
      return e.dt * e.timeScale;
    }
    i(n, "dt");
    function r() {
      return e.fixedDt * e.timeScale;
    }
    i(r, "fixedDt");
    function o() {
      return e.restDt * e.timeScale;
    }
    i(o, "restDt");
    function s() {
      return e.isHidden;
    }
    i(s, "isHidden");
    function a() {
      return e.time;
    }
    i(a, "time");
    function l() {
      return e.fpsCounter.fps;
    }
    i(l, "fps");
    function u() {
      return e.numFrames;
    }
    i(u, "numFrames");
    function m() {
      return e.canvas.toDataURL();
    }
    i(m, "screenshot");
    function c(h) {
      e.canvas.style.cursor = h;
    }
    i(c, "setCursor");
    function p() {
      return e.canvas.style.cursor;
    }
    i(p, "getCursor");
    function d(h) {
      if (h)
        try {
          let E = e.canvas.requestPointerLock();
          E.catch && E.catch((R) => console.error(R));
        } catch (E) {
          console.error(E);
        }
      else
        document.exitPointerLock();
    }
    i(d, "setCursorLocked");
    function x() {
      return !!document.pointerLockElement;
    }
    i(x, "isCursorLocked");
    function f(h) {
      h.requestFullscreen ? h.requestFullscreen() : h.webkitRequestFullscreen && h.webkitRequestFullscreen();
    }
    i(f, "enterFullscreen");
    function y() {
      document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullScreen && document.webkitExitFullScreen();
    }
    i(y, "exitFullscreen");
    function v(h = true) {
      h ? f(e.canvas) : y();
    }
    i(v, "setFullscreen");
    function A() {
      return document.fullscreenElement === e.canvas || document.webkitFullscreenElement === e.canvas;
    }
    i(A, "isFullscreen");
    function V() {
      e.stopped = true;
      let h = Object.entries(Ue2), E = Object.entries(sr2), R = Object.entries(gn);
      for (let [N, ie] of h)
        e.canvas.removeEventListener(N, ie);
      for (let [N, ie] of E)
        document.removeEventListener(N, ie);
      for (let [N, ie] of R)
        window.removeEventListener(N, ie);
      io.disconnect();
    }
    i(V, "quit");
    function M2(h, E) {
      e.loopID !== null && cancelAnimationFrame(e.loopID);
      let R = 0, N = 0, ie = i((Pe) => {
        if (e.stopped)
          return;
        if (document.visibilityState !== "visible") {
          e.loopID = requestAnimationFrame(ie);
          return;
        }
        let se2 = Pe / 1e3, nt = Math.min(se2 - e.realTime, 0.25), bt = t18.maxFPS ? 1 / t18.maxFPS : 0;
        if (e.realTime = se2, N += nt, N > bt) {
          if (!e.skipTime) {
            for (R += N, e.dt = e.fixedDt, e.restDt = 0; R > e.fixedDt; )
              R -= e.fixedDt, R < e.fixedDt && (e.restDt = R), h();
            e.restDt = R, e.dt = N, e.time += n(), e.fpsCounter.tick(e.dt);
          }
          N = 0, e.skipTime = false, e.numFrames++, Ia(), E(), ja();
        }
        e.loopID = requestAnimationFrame(ie);
      }, "frame");
      ie(0);
    }
    i(M2, "run");
    function G2() {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    }
    i(G2, "isTouchscreen");
    function F() {
      return e.mousePos.clone();
    }
    i(F, "mousePos");
    function g() {
      return e.mouseDeltaPos.clone();
    }
    i(g, "mouseDeltaPos");
    function T(h = "left") {
      return e.mouseState.pressed.has(h);
    }
    i(T, "isMousePressed");
    function S(h = "left") {
      return e.mouseState.down.has(h);
    }
    i(S, "isMouseDown");
    function D(h = "left") {
      return e.mouseState.released.has(h);
    }
    i(D, "isMouseReleased");
    function B() {
      return e.isMouseMoved;
    }
    i(B, "isMouseMoved");
    function K2(h) {
      return h === void 0 ? e.keyState.pressed.size > 0 : Xe(e.keyState.pressed, h);
    }
    i(K2, "isKeyPressed");
    function k2(h) {
      return h === void 0 ? e.keyState.pressedRepeat.size > 0 : Xe(e.keyState.pressedRepeat, h);
    }
    i(k2, "isKeyPressedRepeat");
    function z3(h) {
      return h === void 0 ? e.keyState.down.size > 0 : Xe(e.keyState.down, h);
    }
    i(z3, "isKeyDown");
    function X(h) {
      return h === void 0 ? e.keyState.released.size > 0 : Xe(e.keyState.released, h);
    }
    i(X, "isKeyReleased");
    function te(h) {
      return h === void 0 ? e.mergedGamepadState.buttonState.pressed.size > 0 : Xe(e.mergedGamepadState.buttonState.pressed, h);
    }
    i(te, "isGamepadButtonPressed");
    function Q(h) {
      return h === void 0 ? e.mergedGamepadState.buttonState.down.size > 0 : Xe(e.mergedGamepadState.buttonState.down, h);
    }
    i(Q, "isGamepadButtonDown");
    function q(h) {
      return h === void 0 ? e.mergedGamepadState.buttonState.released.size > 0 : Xe(e.mergedGamepadState.buttonState.released, h);
    }
    i(q, "isGamepadButtonReleased");
    function ae(h) {
      return h === void 0 ? e.buttonState.pressed.size > 0 : Xe(e.buttonState.pressed, h);
    }
    i(ae, "isButtonPressed");
    function U2(h) {
      return h === void 0 ? e.buttonState.down.size > 0 : Xe(e.buttonState.down, h);
    }
    i(U2, "isButtonDown");
    function I(h) {
      return h === void 0 ? e.buttonState.released.size > 0 : Xe(e.buttonState.released, h);
    }
    i(I, "isButtonReleased");
    function Y(h) {
      return e.buttons?.[h];
    }
    i(Y, "getButton");
    function j(h, E) {
      e.buttons[h] = { ...e.buttons[h], ...E };
    }
    i(j, "setButton");
    function ue(h) {
      return e.events.on("resize", h);
    }
    i(ue, "onResize");
    let Z = de((h) => e.events.on("keyDown", h), (h, E) => e.events.on("keyDown", (R) => Fe(h, R) && E(R))), we = de((h) => e.events.on("keyPress", (E) => h(E)), (h, E) => e.events.on("keyPress", (R) => Fe(h, R) && E(R))), Ht = de((h) => e.events.on("keyPressRepeat", h), (h, E) => e.events.on("keyPressRepeat", (R) => Fe(h, R) && E(R))), lt = de((h) => e.events.on("keyRelease", h), (h, E) => e.events.on("keyRelease", (R) => Fe(h, R) && E(R))), nr2 = de((h) => e.events.on("mouseDown", (E) => h(E)), (h, E) => e.events.on("mouseDown", (R) => Fe(h, R) && E(R))), rr = de((h) => e.events.on("mousePress", (E) => h(E)), (h, E) => e.events.on("mousePress", (R) => Fe(h, R) && E(R))), or = de((h) => e.events.on("mouseRelease", (E) => h(E)), (h, E) => e.events.on("mouseRelease", (R) => R === h && E(R)));
    function ir(h) {
      return e.events.on("mouseMove", () => h(F(), g()));
    }
    i(ir, "onMouseMove");
    function dn(h) {
      return e.events.on("charInput", h);
    }
    i(dn, "onCharInput");
    function Je2(h) {
      return e.events.on("touchStart", h);
    }
    i(Je2, "onTouchStart");
    function mt(h) {
      return e.events.on("touchMove", h);
    }
    i(mt, "onTouchMove");
    function hn(h) {
      return e.events.on("touchEnd", h);
    }
    i(hn, "onTouchEnd");
    function ke2(h) {
      return e.events.on("scroll", h);
    }
    i(ke2, "onScroll");
    function qt(h) {
      return e.events.on("hide", h);
    }
    i(qt, "onHide");
    function tt(h) {
      return e.events.on("show", h);
    }
    i(tt, "onShow");
    let fn = de((h) => e.events.on("gamepadButtonPress", (E) => h(E)), (h, E) => e.events.on("gamepadButtonPress", (R) => Fe(h, R) && E(R))), Va = de((h) => e.events.on("gamepadButtonDown", (E) => h(E)), (h, E) => e.events.on("gamepadButtonDown", (R) => Fe(h, R) && E(R))), Pa = de((h) => e.events.on("gamepadButtonRelease", (E) => h(E)), (h, E) => e.events.on("gamepadButtonRelease", (R) => Fe(h, R) && E(R)));
    function Ra(h, E) {
      return e.events.on("gamepadStick", (R, N) => R === h && E(N));
    }
    i(Ra, "onGamepadStick");
    function Ga(h) {
      e.events.on("gamepadConnect", h);
    }
    i(Ga, "onGamepadConnect");
    function Da(h) {
      e.events.on("gamepadDisconnect", h);
    }
    i(Da, "onGamepadDisconnect");
    function Ma(h) {
      return e.mergedGamepadState.stickState.get(h) || new w(0);
    }
    i(Ma, "getGamepadStick");
    function Ua() {
      return [...e.charInputted];
    }
    i(Ua, "charInputted");
    function eo() {
      return [...e.gamepads];
    }
    i(eo, "getGamepads");
    let Ba = de((h) => e.events.on("buttonPress", (E) => h(E)), (h, E) => e.events.on("buttonPress", (R) => Fe(h, R) && E(R))), Fa = de((h) => e.events.on("buttonDown", (E) => h(E)), (h, E) => e.events.on("buttonDown", (R) => Fe(h, R) && E(R))), La = de((h) => e.events.on("buttonRelease", (E) => h(E)), (h, E) => e.events.on("buttonRelease", (R) => Fe(h, R) && E(R)));
    function Ia() {
      e.events.trigger("input"), e.keyState.down.forEach((h) => e.events.trigger("keyDown", h)), e.mouseState.down.forEach((h) => e.events.trigger("mouseDown", h)), e.buttonState.down.forEach((h) => e.events.trigger("buttonDown", h)), ka();
    }
    i(Ia, "processInput");
    function ja() {
      e.keyState.update(), e.mouseState.update(), e.buttonState.update(), e.mergedGamepadState.buttonState.update(), e.mergedGamepadState.stickState.forEach((h, E) => {
        e.mergedGamepadState.stickState.set(E, new w(0));
      }), e.charInputted = [], e.isMouseMoved = false, e.mouseDeltaPos = new w(0), e.gamepadStates.forEach((h) => {
        h.buttonState.update(), h.stickState.forEach((E, R) => {
          h.stickState.set(R, new w(0));
        });
      });
    }
    i(ja, "resetInput");
    function to(h) {
      let E = { index: h.index, isPressed: i((R) => e.gamepadStates.get(h.index)?.buttonState.pressed.has(R) || false, "isPressed"), isDown: i((R) => e.gamepadStates.get(h.index)?.buttonState.down.has(R) || false, "isDown"), isReleased: i((R) => e.gamepadStates.get(h.index)?.buttonState.released.has(R) || false, "isReleased"), getStick: i((R) => e.gamepadStates.get(h.index)?.stickState.get(R) || b(), "getStick") };
      return e.gamepads.push(E), e.gamepadStates.set(h.index, { buttonState: new wt(), stickState: /* @__PURE__ */ new Map([["left", new w(0)], ["right", new w(0)]]) }), E;
    }
    i(to, "registerGamepad");
    function Ka(h) {
      e.gamepads = e.gamepads.filter((E) => E.index !== h.index), e.gamepadStates.delete(h.index);
    }
    i(Ka, "removeGamepad");
    function ka() {
      for (let h of navigator.getGamepads())
        h && !e.gamepadStates.has(h.index) && to(h);
      for (let h of e.gamepads) {
        let E = navigator.getGamepads()[h.index];
        if (!E)
          continue;
        let N = (t18.gamepads ?? {})[E.id] ?? Cr[E.id] ?? Cr.default, ie = e.gamepadStates.get(h.index);
        if (ie) {
          for (let Pe = 0; Pe < E.buttons.length; Pe++) {
            let se2 = N.buttons[Pe], nt = E.buttons[Pe], bt = e.buttonsByGamepad.has(se2);
            nt.pressed ? (ie.buttonState.down.has(se2) || (e.lastInputDevice = "gamepad", bt && e.buttonsByGamepad.get(se2)?.forEach((Te2) => {
              e.buttonState.press(Te2), e.events.trigger("buttonPress", Te2);
            }), e.mergedGamepadState.buttonState.press(se2), ie.buttonState.press(se2), e.events.trigger("gamepadButtonPress", se2)), bt && e.buttonsByGamepad.get(se2)?.forEach((Te2) => {
              e.buttonState.press(Te2), e.events.trigger("buttonDown", Te2);
            }), e.events.trigger("gamepadButtonDown", se2)) : ie.buttonState.down.has(se2) && (bt && e.buttonsByGamepad.get(se2)?.forEach((Te2) => {
              e.buttonState.release(Te2), e.events.trigger("buttonRelease", Te2);
            }), e.mergedGamepadState.buttonState.release(se2), ie.buttonState.release(se2), e.events.trigger("gamepadButtonRelease", se2));
          }
          for (let Pe in N.sticks) {
            let se2 = N.sticks[Pe];
            if (!se2)
              continue;
            let nt = new w(E.axes[se2.x], E.axes[se2.y]);
            ie.stickState.set(Pe, nt), e.mergedGamepadState.stickState.set(Pe, nt), e.events.trigger("gamepadStick", Pe, nt);
          }
        }
      }
    }
    i(ka, "processGamepad");
    let Ue2 = {}, sr2 = {}, gn = {}, no = t18.pixelDensity || window.devicePixelRatio || 1;
    Ue2.mousemove = (h) => {
      let E = new w(h.offsetX, h.offsetY), R = new w(h.movementX, h.movementY);
      if (A()) {
        let N = e.canvas.width / no, ie = e.canvas.height / no, Pe = window.innerWidth, se2 = window.innerHeight, nt = Pe / se2, bt = N / ie;
        if (nt > bt) {
          let Te2 = se2 / ie, ar2 = (Pe - N * Te2) / 2;
          E.x = De(h.offsetX - ar2, 0, N * Te2, 0, N), E.y = De(h.offsetY, 0, ie * Te2, 0, ie);
        } else {
          let Te2 = Pe / N, ar2 = (se2 - ie * Te2) / 2;
          E.x = De(h.offsetX, 0, N * Te2, 0, N), E.y = De(h.offsetY - ar2, 0, ie * Te2, 0, ie);
        }
      }
      e.events.onOnce("input", () => {
        e.isMouseMoved = true, e.mousePos = E, e.mouseDeltaPos = R, e.events.trigger("mouseMove");
      });
    };
    let ro = ["left", "middle", "right", "back", "forward"];
    Ue2.mousedown = (h) => {
      e.events.onOnce("input", () => {
        let E = ro[h.button];
        E && (e.lastInputDevice = "mouse", e.buttonsByMouse.has(E) && e.buttonsByMouse.get(E)?.forEach((R) => {
          e.buttonState.press(R), e.events.trigger("buttonPress", R);
        }), e.mouseState.press(E), e.events.trigger("mousePress", E));
      });
    }, Ue2.mouseup = (h) => {
      e.events.onOnce("input", () => {
        let E = ro[h.button];
        E && (e.buttonsByMouse.has(E) && e.buttonsByMouse.get(E)?.forEach((R) => {
          e.buttonState.release(R), e.events.trigger("buttonRelease", R);
        }), e.mouseState.release(E), e.events.trigger("mouseRelease", E));
      });
    };
    let _a = /* @__PURE__ */ new Set([" ", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"]), oo = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", " ": "space" };
    Ue2.keydown = (h) => {
      _a.has(h.key) && h.preventDefault(), e.events.onOnce("input", () => {
        let E = oo[h.key] || h.key.toLowerCase();
        if (E === void 0)
          throw new Error(`Unknown key: ${h.key}`);
        E.length === 1 ? (e.events.trigger("charInput", E), e.charInputted.push(E)) : E === "space" && (e.events.trigger("charInput", " "), e.charInputted.push(" ")), h.repeat ? (e.keyState.pressRepeat(E), e.events.trigger("keyPressRepeat", E)) : (e.lastInputDevice = "keyboard", e.buttonsByKey.has(E) && e.buttonsByKey.get(E)?.forEach((R) => {
          e.buttonState.press(R), e.events.trigger("buttonPress", R);
        }), e.keyState.press(E), e.events.trigger("keyPressRepeat", E), e.events.trigger("keyPress", E));
      });
    }, Ue2.keyup = (h) => {
      e.events.onOnce("input", () => {
        let E = oo[h.key] || h.key.toLowerCase();
        e.buttonsByKey.has(E) && e.buttonsByKey.get(E)?.forEach((R) => {
          e.buttonState.release(R), e.events.trigger("buttonRelease", R);
        }), e.keyState.release(E), e.events.trigger("keyRelease", E);
      });
    }, Ue2.touchstart = (h) => {
      h.preventDefault(), e.events.onOnce("input", () => {
        let E = [...h.changedTouches], R = e.canvas.getBoundingClientRect();
        t18.touchToMouse !== false && (e.mousePos = new w(E[0].clientX - R.x, E[0].clientY - R.y), e.lastInputDevice = "mouse", e.buttonsByMouse.has("left") && e.buttonsByMouse.get("left")?.forEach((N) => {
          e.buttonState.press(N), e.events.trigger("buttonPress", N);
        }), e.mouseState.press("left"), e.events.trigger("mousePress", "left")), E.forEach((N) => {
          e.events.trigger("touchStart", new w(N.clientX - R.x, N.clientY - R.y), N);
        });
      });
    }, Ue2.touchmove = (h) => {
      h.preventDefault(), e.events.onOnce("input", () => {
        let E = [...h.changedTouches], R = e.canvas.getBoundingClientRect();
        if (t18.touchToMouse !== false) {
          let N = e.mousePos;
          e.mousePos = new w(E[0].clientX - R.x, E[0].clientY - R.y), e.mouseDeltaPos = e.mousePos.sub(N), e.events.trigger("mouseMove");
        }
        E.forEach((N) => {
          e.events.trigger("touchMove", new w(N.clientX - R.x, N.clientY - R.y), N);
        });
      });
    }, Ue2.touchend = (h) => {
      e.events.onOnce("input", () => {
        let E = [...h.changedTouches], R = e.canvas.getBoundingClientRect();
        t18.touchToMouse !== false && (e.mousePos = new w(E[0].clientX - R.x, E[0].clientY - R.y), e.mouseDeltaPos = new w(0, 0), e.buttonsByMouse.has("left") && e.buttonsByMouse.get("left")?.forEach((N) => {
          e.buttonState.release(N), e.events.trigger("buttonRelease", N);
        }), e.mouseState.release("left"), e.events.trigger("mouseRelease", "left")), E.forEach((N) => {
          e.events.trigger("touchEnd", new w(N.clientX - R.x, N.clientY - R.y), N);
        });
      });
    }, Ue2.touchcancel = (h) => {
      e.events.onOnce("input", () => {
        let E = [...h.changedTouches], R = e.canvas.getBoundingClientRect();
        t18.touchToMouse !== false && (e.mousePos = new w(E[0].clientX - R.x, E[0].clientY - R.y), e.mouseState.release("left"), e.events.trigger("mouseRelease", "left")), E.forEach((N) => {
          e.events.trigger("touchEnd", new w(N.clientX - R.x, N.clientY - R.y), N);
        });
      });
    }, Ue2.wheel = (h) => {
      h.preventDefault(), e.events.onOnce("input", () => {
        e.events.trigger("scroll", new w(h.deltaX, h.deltaY));
      });
    }, Ue2.contextmenu = (h) => h.preventDefault(), sr2.visibilitychange = () => {
      document.visibilityState === "visible" ? (e.skipTime = true, e.isHidden = false, e.events.trigger("show")) : (e.isHidden = true, e.events.trigger("hide"));
    }, gn.gamepadconnected = (h) => {
      let E = to(h.gamepad);
      e.events.onOnce("input", () => {
        e.events.trigger("gamepadConnect", E);
      });
    }, gn.gamepaddisconnected = (h) => {
      let E = eo().filter((R) => R.index === h.gamepad.index)[0];
      Ka(h.gamepad), e.events.onOnce("input", () => {
        e.events.trigger("gamepadDisconnect", E);
      });
    };
    for (let [h, E] of Object.entries(Ue2))
      e.canvas.addEventListener(h, E);
    for (let [h, E] of Object.entries(sr2))
      document.addEventListener(h, E);
    for (let [h, E] of Object.entries(gn))
      window.addEventListener(h, E);
    let io = new ResizeObserver((h) => {
      for (let E of h)
        if (E.target === e.canvas) {
          if (e.lastWidth === e.canvas.offsetWidth && e.lastHeight === e.canvas.offsetHeight)
            return;
          e.lastWidth = e.canvas.offsetWidth, e.lastHeight = e.canvas.offsetHeight, e.events.onOnce("input", () => {
            e.events.trigger("resize");
          });
        }
    });
    return io.observe(e.canvas), { dt: n, fixedDt: r, restDt: o, time: a, run: M2, canvas: e.canvas, fps: l, numFrames: u, quit: V, isHidden: s, setFullscreen: v, isFullscreen: A, setCursor: c, screenshot: m, getGamepads: eo, getCursor: p, setCursorLocked: d, isCursorLocked: x, isTouchscreen: G2, mousePos: F, mouseDeltaPos: g, isKeyDown: z3, isKeyPressed: K2, isKeyPressedRepeat: k2, isKeyReleased: X, isMouseDown: S, isMousePressed: T, isMouseReleased: D, isMouseMoved: B, isGamepadButtonPressed: te, isGamepadButtonDown: Q, isGamepadButtonReleased: q, getGamepadStick: Ma, isButtonPressed: ae, isButtonDown: U2, isButtonReleased: I, setButton: j, getButton: Y, charInputted: Ua, onResize: ue, onKeyDown: Z, onKeyPress: we, onKeyPressRepeat: Ht, onKeyRelease: lt, onMouseDown: nr2, onMousePress: rr, onMouseRelease: or, onMouseMove: ir, onCharInput: dn, onTouchStart: Je2, onTouchMove: mt, onTouchEnd: hn, onScroll: ke2, onHide: qt, onShow: tt, onGamepadButtonDown: Va, onGamepadButtonPress: fn, onGamepadButtonRelease: Pa, onGamepadStick: Ra, onGamepadConnect: Ga, onGamepadDisconnect: Da, onButtonPress: Ba, onButtonDown: Fa, onButtonRelease: La, getLastInputDeviceType: Qo, events: e.events };
  }, "initApp");
  function Se() {
    return P.dt() * J.timeScale;
  }
  i(Se, "dt");
  function ei() {
    return P.fixedDt() * J.timeScale;
  }
  i(ei, "fixedDt");
  function ti() {
    return P.restDt() * J.timeScale;
  }
  i(ti, "restDt");
  function Ne(t18) {
    switch (t18) {
      case "topleft":
        return new w(-1, -1);
      case "top":
        return new w(0, -1);
      case "topright":
        return new w(1, -1);
      case "left":
        return new w(-1, 0);
      case "center":
        return new w(0, 0);
      case "right":
        return new w(1, 0);
      case "botleft":
        return new w(-1, 1);
      case "bot":
        return new w(0, 1);
      case "botright":
        return new w(1, 1);
      default:
        return t18;
    }
  }
  i(Ne, "anchorPt");
  function ni(t18) {
    switch (t18) {
      case "left":
        return 0;
      case "center":
        return 0.5;
      case "right":
        return 1;
      default:
        return 0;
    }
  }
  i(ni, "alignPt");
  function ri(t18) {
    return t18.createBuffer(1, 1, 44100);
  }
  i(ri, "createEmptyAudioBuffer");
  var Rn = 2.5949095;
  var oi = 1.70158 + 1;
  var ii = 2 * Math.PI / 3;
  var si = 2 * Math.PI / 4.5;
  var Gn = { linear: i((t18) => t18, "linear"), easeInSine: i((t18) => 1 - Math.cos(t18 * Math.PI / 2), "easeInSine"), easeOutSine: i((t18) => Math.sin(t18 * Math.PI / 2), "easeOutSine"), easeInOutSine: i((t18) => -(Math.cos(Math.PI * t18) - 1) / 2, "easeInOutSine"), easeInQuad: i((t18) => t18 * t18, "easeInQuad"), easeOutQuad: i((t18) => 1 - (1 - t18) * (1 - t18), "easeOutQuad"), easeInOutQuad: i((t18) => t18 < 0.5 ? 2 * t18 * t18 : 1 - Math.pow(-2 * t18 + 2, 2) / 2, "easeInOutQuad"), easeInCubic: i((t18) => t18 * t18 * t18, "easeInCubic"), easeOutCubic: i((t18) => 1 - Math.pow(1 - t18, 3), "easeOutCubic"), easeInOutCubic: i((t18) => t18 < 0.5 ? 4 * t18 * t18 * t18 : 1 - Math.pow(-2 * t18 + 2, 3) / 2, "easeInOutCubic"), easeInQuart: i((t18) => t18 * t18 * t18 * t18, "easeInQuart"), easeOutQuart: i((t18) => 1 - Math.pow(1 - t18, 4), "easeOutQuart"), easeInOutQuart: i((t18) => t18 < 0.5 ? 8 * t18 * t18 * t18 * t18 : 1 - Math.pow(-2 * t18 + 2, 4) / 2, "easeInOutQuart"), easeInQuint: i((t18) => t18 * t18 * t18 * t18 * t18, "easeInQuint"), easeOutQuint: i((t18) => 1 - Math.pow(1 - t18, 5), "easeOutQuint"), easeInOutQuint: i((t18) => t18 < 0.5 ? 16 * t18 * t18 * t18 * t18 * t18 : 1 - Math.pow(-2 * t18 + 2, 5) / 2, "easeInOutQuint"), easeInExpo: i((t18) => t18 === 0 ? 0 : Math.pow(2, 10 * t18 - 10), "easeInExpo"), easeOutExpo: i((t18) => t18 === 1 ? 1 : 1 - Math.pow(2, -10 * t18), "easeOutExpo"), easeInOutExpo: i((t18) => t18 === 0 ? 0 : t18 === 1 ? 1 : t18 < 0.5 ? Math.pow(2, 20 * t18 - 10) / 2 : (2 - Math.pow(2, -20 * t18 + 10)) / 2, "easeInOutExpo"), easeInCirc: i((t18) => 1 - Math.sqrt(1 - Math.pow(t18, 2)), "easeInCirc"), easeOutCirc: i((t18) => Math.sqrt(1 - Math.pow(t18 - 1, 2)), "easeOutCirc"), easeInOutCirc: i((t18) => t18 < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t18, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t18 + 2, 2)) + 1) / 2, "easeInOutCirc"), easeInBack: i((t18) => oi * t18 * t18 * t18 - 1.70158 * t18 * t18, "easeInBack"), easeOutBack: i((t18) => 1 + oi * Math.pow(t18 - 1, 3) + 1.70158 * Math.pow(t18 - 1, 2), "easeOutBack"), easeInOutBack: i((t18) => t18 < 0.5 ? Math.pow(2 * t18, 2) * ((Rn + 1) * 2 * t18 - Rn) / 2 : (Math.pow(2 * t18 - 2, 2) * ((Rn + 1) * (t18 * 2 - 2) + Rn) + 2) / 2, "easeInOutBack"), easeInElastic: i((t18) => t18 === 0 ? 0 : t18 === 1 ? 1 : -Math.pow(2, 10 * t18 - 10) * Math.sin((t18 * 10 - 10.75) * ii), "easeInElastic"), easeOutElastic: i((t18) => t18 === 0 ? 0 : t18 === 1 ? 1 : Math.pow(2, -10 * t18) * Math.sin((t18 * 10 - 0.75) * ii) + 1, "easeOutElastic"), easeInOutElastic: i((t18) => t18 === 0 ? 0 : t18 === 1 ? 1 : t18 < 0.5 ? -(Math.pow(2, 20 * t18 - 10) * Math.sin((20 * t18 - 11.125) * si)) / 2 : Math.pow(2, -20 * t18 + 10) * Math.sin((20 * t18 - 11.125) * si) / 2 + 1, "easeInOutElastic"), easeInBounce: i((t18) => 1 - Gn.easeOutBounce(1 - t18), "easeInBounce"), easeOutBounce: i((t18) => t18 < 1 / 2.75 ? 7.5625 * t18 * t18 : t18 < 2 / 2.75 ? 7.5625 * (t18 -= 1.5 / 2.75) * t18 + 0.75 : t18 < 2.5 / 2.75 ? 7.5625 * (t18 -= 2.25 / 2.75) * t18 + 0.9375 : 7.5625 * (t18 -= 2.625 / 2.75) * t18 + 0.984375, "easeOutBounce"), easeInOutBounce: i((t18) => t18 < 0.5 ? (1 - Gn.easeOutBounce(1 - 2 * t18)) / 2 : (1 + Gn.easeOutBounce(2 * t18 - 1)) / 2, "easeInOutBounce") };
  var ot = Gn;
  function Ou(t18, e, n) {
    let r = [], o = e;
    for (r.push(o); o !== t18; ) {
      if (o = n.get(o), o == null)
        return null;
      r.push(o);
    }
    return r.reverse();
  }
  i(Ou, "buildPath");
  function Or(t18, e, n) {
    let r = new Ft((a, l) => a.cost < l.cost);
    r.insert({ cost: 0, node: e });
    let o = /* @__PURE__ */ new Map();
    o.set(e, e);
    let s = /* @__PURE__ */ new Map();
    for (s.set(e, 0); r.length !== 0; ) {
      let a = r.remove()?.node;
      if (a === n)
        break;
      let l = t18.getNeighbours(a);
      for (let u of l) {
        let m = (s.get(a) || 0) + t18.getCost(a, u) + t18.getHeuristic(u, n);
        (!s.has(u) || m < s.get(u)) && (s.set(u, m), r.insert({ cost: m, node: u }), o.set(u, a));
      }
    }
    return Ou(e, n, o);
  }
  i(Or, "aStarSearch");
  var Ar = class {
    static {
      i(this, "NavEdge");
    }
    a;
    b;
    polygon;
    constructor(e, n, r) {
      this.a = e, this.b = n, this.polygon = new WeakRef(r);
    }
    isLeft(e, n) {
      return (this.b.x - this.a.x) * (n - this.a.y) - (e - this.a.x) * (this.b.y - this.a.y);
    }
    get middle() {
      return this.a.add(this.b).scale(0.5);
    }
  };
  var Sr = class {
    static {
      i(this, "NavPolygon");
    }
    _edges;
    _centroid;
    _id;
    constructor(e) {
      this._id = e;
    }
    get id() {
      return this._id;
    }
    set edges(e) {
      this._edges = e;
      let n = 0, r = 0, o = 0;
      for (let s of this._edges) {
        s.polygon = new WeakRef(this);
        let a = s.a.x * s.b.y - s.a.y * s.b.x;
        n += (s.a.x + s.b.x) * a, r += (s.a.y + s.b.y) * a, o += a;
      }
      o /= 2, this._centroid = b(n / (6 * o), r / (6 * o));
    }
    get edges() {
      return this._edges;
    }
    get centroid() {
      return this._centroid;
    }
    contains(e) {
      let n = false;
      for (let r of this.edges)
        r.b.y > e.y != r.a.y > e.y && e.x < (r.a.x - r.b.x) * (e.y - r.b.y) / (r.a.y - r.b.y) + r.b.x && (n = !n);
      return n;
    }
  };
  var Dn = class {
    static {
      i(this, "NavMesh");
    }
    _polygons;
    _pointCache;
    _edgeCache;
    constructor() {
      this._polygons = [], this._pointCache = {}, this._edgeCache = {};
    }
    _addPoint(e) {
      let n = this._pointCache[`${e.x}_${e.y}`];
      return n || (n = e.clone(), this._pointCache[`${e.x}_${e.y}`] = n, n);
    }
    _addEdge(e) {
      let n = `${e.a.x}_${e.a.y}-${e.b.x}_${e.b.y}`;
      return this._edgeCache[n] = e, e;
    }
    _findEdge(e, n) {
      let r = `${e.x}_${e.y}-${n.x}_${n.y}`;
      return this._edgeCache[r];
    }
    _findCommonEdge(e, n) {
      for (let r of e.edges) {
        let o = this._findEdge(r.b, r.a);
        if (o && o.polygon.deref().id === n.id)
          return o;
      }
      return null;
    }
    addPolygon(e) {
      let n = new Sr(this._polygons.length), r = e.map((o, s) => new Ar(o, e[(s + 1) % e.length], n));
      n.edges = r, this._polygons.push(n);
      for (let o of n.edges)
        this._addEdge(o);
      return n;
    }
    addRect(e, n) {
      let r = this._addPoint(e), o = this._addPoint(e.add(n.x, 0)), s = this._addPoint(e.add(n)), a = this._addPoint(e.add(0, n.y));
      return this.addPolygon([r, o, s, a]);
    }
    _getLocation(e) {
      for (let n of this._polygons)
        if (n.contains(e))
          return n;
      return null;
    }
    getNeighbours(e) {
      let n = [];
      for (let r of this._polygons[e].edges) {
        let o = this._findEdge(r.b, r.a);
        if (o) {
          let s = o.polygon.deref();
          s && n.push(s.id);
        }
      }
      return n;
    }
    getCost(e, n) {
      return 1;
    }
    getHeuristic(e, n) {
      let r = this._polygons[e], o = this._polygons[n], s = r.centroid.x - o.centroid.x, a = r.centroid.y - o.centroid.y;
      return Math.sqrt(s * s + a * a);
    }
    getPath(e, n) {
      return e === void 0 || n === void 0 ? [] : e === n ? [e, n] : Or(this, e, n);
    }
    getWaypointPath(e, n, r) {
      let o = r?.type || "centroids", s = this._getLocation(e), a = this._getLocation(n);
      if (s === void 0 || a === void 0)
        return [];
      let l = this.getPath(s.id, a.id);
      if (!l)
        return [];
      if (o === "edges") {
        let u = [];
        for (let m = 1; m < l.length; m++) {
          let c = this._polygons[l[m - 1]], p = this._polygons[l[m]], d = this._findCommonEdge(c, p);
          u.push(d.middle.add(p.centroid.sub(d.middle).unit().scale(4)));
        }
        return [e, ...u, n];
      } else
        return [e, ...l.slice(1, -1).map((u) => this._polygons[u].centroid), n];
    }
  };
  function Lt(t18) {
    let e = new fe();
    return t18.pos && e.translate(t18.pos), t18.scale && e.scale(t18.scale), t18.angle && e.rotate(t18.angle), t18.parent ? e.mult(t18.parent.transform) : e;
  }
  i(Lt, "calcTransform");
  function ai(t18) {
    return new w(t18.x / he() * 2 - 1, -t18.y / be() * 2 + 1);
  }
  i(ai, "screen2ndc");
  function Ct(t18, e, n, r, o, s = 1) {
    r = ce(r % 360), o = ce(o % 360), o <= r && (o += Math.PI * 2);
    let a = [], l = Math.ceil((o - r) / ce(8) * s), u = (o - r) / l, m = b(Math.cos(r), Math.sin(r)), c = b(Math.cos(u), Math.sin(u));
    for (let p = 0; p <= l; p++)
      a.push(t18.add(e * m.x, n * m.y)), m = b(m.x * c.x - m.y * c.y, m.x * c.y + m.y * c.x);
    return a;
  }
  i(Ct, "getArcPts");
  function ui(...t18) {
    let e = W(...t18), n = t18[3] ?? 1;
    O.bgColor = e, O.bgAlpha = n, O.ggl.gl.clearColor(e.r / 255, e.g / 255, e.b / 255, n);
  }
  i(ui, "setBackground");
  function ci() {
    return O.bgColor?.clone?.() ?? null;
  }
  i(ci, "getBackground");
  function ne(...t18) {
    if (t18[0] === void 0)
      return;
    let e = b(...t18);
    e.x === 0 && e.y === 0 || O.transform.translate(e);
  }
  i(ne, "pushTranslate");
  function ve() {
    O.transformStack.push(O.transform.clone());
  }
  i(ve, "pushTransform");
  function li(t18) {
    O.transform = t18.clone();
  }
  i(li, "pushMatrix");
  function it(...t18) {
    if (t18[0] === void 0)
      return;
    let e = b(...t18);
    e.x === 1 && e.y === 1 || O.transform.scale(e);
  }
  i(it, "pushScale");
  function Qe(t18) {
    t18 && O.transform.rotate(t18);
  }
  i(Qe, "pushRotate");
  function ye() {
    O.transformStack.length > 0 && (O.transform = O.transformStack.pop());
  }
  i(ye, "popTransform");
  function Ee() {
    O.renderer.flush();
  }
  i(Ee, "flush");
  function he() {
    return O.width;
  }
  i(he, "width");
  function be() {
    return O.height;
  }
  i(be, "height");
  function Mn() {
    return (O.viewport.width + O.viewport.height) / (O.width + O.height);
  }
  i(Mn, "getViewportScale");
  function mi(t18) {
    return new w(t18.x * O.viewport.width / O.width, t18.y * O.viewport.height / O.height);
  }
  i(mi, "contentToView");
  function Au(t18) {
    return new w((t18.x - O.viewport.x) * he() / O.viewport.width, (t18.y - O.viewport.y) * be() / O.viewport.height);
  }
  i(Au, "windowToContent");
  function Un() {
    return Au(P.mousePos());
  }
  i(Un, "mousePos");
  function Et() {
    return b(he() / 2, be() / 2);
  }
  i(Et, "center");
  var Bn = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
  var dt2 = "topleft";
  var pi = "monospace";
  var Tt = "monospace";
  var Zt = "linear";
  var en = [{ name: "a_pos", size: 2 }, { name: "a_uv", size: 2 }, { name: "a_color", size: 4 }];
  var Su = en.reduce((t18, e) => t18 + e.size, 0);
  var di = 2048;
  var hi = di * 4 * Su;
  var fi = di * 6;
  var gi = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 0.0, 1.0);
}

{{user}}

void main() {
	vec4 pos = vert(a_pos, a_uv, a_color);
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
`;
  var bi = `
precision mediump float;

varying vec2 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

{{user}}

void main() {
	gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`;
  var tn = `
vec4 vert(vec2 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`;
  var nn = `
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`;
  var yi = /* @__PURE__ */ new Set(["id", "require"]);
  var xi = /* @__PURE__ */ new Set(["add", "fixedUpdate", "update", "draw", "destroy", "inspect", "drawInspect"]);
  var vi = /^\w+$/;
  var wi = 200;
  var Ci = 640;
  var Ei = 65536;
  var rn = class {
    static {
      i(this, "TexPacker");
    }
    textures = [];
    bigTextures = [];
    canvas;
    c2d;
    x = 0;
    y = 0;
    curHeight = 0;
    gfx;
    constructor(e, n, r) {
      this.gfx = e, this.canvas = document.createElement("canvas"), this.canvas.width = n, this.canvas.height = r, this.textures = [Me.fromImage(e, this.canvas)], this.bigTextures = [];
      let o = this.canvas.getContext("2d");
      if (!o)
        throw new Error("Failed to get 2d context");
      this.c2d = o;
    }
    add(e) {
      if (e.width > this.canvas.width || e.height > this.canvas.height) {
        let o = Me.fromImage(this.gfx, e);
        return this.bigTextures.push(o), [o, new $(0, 0, 1, 1)];
      }
      this.x + e.width > this.canvas.width && (this.x = 0, this.y += this.curHeight, this.curHeight = 0), this.y + e.height > this.canvas.height && (this.c2d.clearRect(0, 0, this.canvas.width, this.canvas.height), this.textures.push(Me.fromImage(this.gfx, this.canvas)), this.x = 0, this.y = 0, this.curHeight = 0);
      let n = this.textures[this.textures.length - 1], r = new w(this.x, this.y);
      return this.x += e.width, e.height > this.curHeight && (this.curHeight = e.height), e instanceof ImageData ? this.c2d.putImageData(e, r.x, r.y) : this.c2d.drawImage(e, r.x, r.y), n.update(this.canvas), [n, new $(r.x / this.canvas.width, r.y / this.canvas.height, e.width / this.canvas.width, e.height / this.canvas.height)];
    }
    free() {
      for (let e of this.textures)
        e.free();
      for (let e of this.bigTextures)
        e.free();
    }
  };
  var me = class t14 {
    static {
      i(this, "Asset");
    }
    loaded = false;
    data = null;
    error = null;
    onLoadEvents = new le();
    onErrorEvents = new le();
    onFinishEvents = new le();
    constructor(e) {
      e.then((n) => {
        this.loaded = true, this.data = n, this.onLoadEvents.trigger(n);
      }).catch((n) => {
        if (this.error = n, this.onErrorEvents.numListeners() > 0)
          this.onErrorEvents.trigger(n);
        else
          throw n;
      }).finally(() => {
        this.onFinishEvents.trigger(), this.loaded = true;
      });
    }
    static loaded(e) {
      let n = new t14(Promise.resolve(e));
      return n.data = e, n.loaded = true, n;
    }
    onLoad(e) {
      return this.loaded && this.data ? e(this.data) : this.onLoadEvents.add(e), this;
    }
    onError(e) {
      return this.loaded && this.error ? e(this.error) : this.onErrorEvents.add(e), this;
    }
    onFinish(e) {
      return this.loaded ? e() : this.onFinishEvents.add(e), this;
    }
    then(e) {
      return this.onLoad(e);
    }
    catch(e) {
      return this.onError(e);
    }
    finally(e) {
      return this.onFinish(e);
    }
  };
  var ht = class {
    static {
      i(this, "AssetBucket");
    }
    assets = /* @__PURE__ */ new Map();
    lastUID = 0;
    add(e, n) {
      let r = e ?? this.lastUID++ + "", o = new me(n);
      return this.assets.set(r, o), o;
    }
    addLoaded(e, n) {
      let r = e ?? this.lastUID++ + "", o = me.loaded(n);
      return this.assets.set(r, o), o;
    }
    get(e) {
      return this.assets.get(e);
    }
    progress() {
      if (this.assets.size === 0)
        return 1;
      let e = 0;
      return this.assets.forEach((n) => {
        n.loaded && e++;
      }), e / this.assets.size;
    }
  };
  function Rr(t18) {
    return fetch(t18).then((e) => {
      if (!e.ok)
        throw new Error(`Failed to fetch "${t18}"`);
      return e;
    });
  }
  i(Rr, "fetchURL");
  function Ot(t18) {
    return Rr(t18).then((e) => e.json());
  }
  i(Ot, "fetchJSON");
  function Ti(t18) {
    return Rr(t18).then((e) => e.text());
  }
  i(Ti, "fetchText");
  function Oi(t18) {
    return Rr(t18).then((e) => e.arrayBuffer());
  }
  i(Oi, "fetchArrayBuffer");
  function Ai(t18) {
    return t18 !== void 0 && (_.urlPrefix = t18), _.urlPrefix;
  }
  i(Ai, "loadRoot");
  function Si(t18, e) {
    return _.custom.add(t18, Ot(e));
  }
  i(Si, "loadJSON");
  function At(t18) {
    let e = new Image();
    return e.crossOrigin = "anonymous", e.src = t18, new Promise((n, r) => {
      e.onload = () => n(e), e.onerror = () => r(new Error(`Failed to load image from "${t18}"`));
    });
  }
  i(At, "loadImg");
  function Le() {
    let t18 = [_.sprites, _.sounds, _.shaders, _.fonts, _.bitmapFonts, _.custom];
    return t18.reduce((e, n) => e + n.progress(), 0) / t18.length;
  }
  i(Le, "loadProgress");
  function Vi(t18) {
    return _.custom.get(t18) ?? null;
  }
  i(Vi, "getAsset");
  function on(t18) {
    return _.custom.add(null, t18);
  }
  i(on, "load");
  var Pi = i((t18) => ({ urlPrefix: "", sprites: new ht(), fonts: new ht(), bitmapFonts: new ht(), sounds: new ht(), shaders: new ht(), custom: new ht(), music: {}, packer: new rn(t18, 2048, 2048), loaded: false }), "initAssets");
  var Ri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAA1CAYAAADyMeOEAAAAAXNSR0IArs4c6QAAAoVJREFUaIHdm7txwkAQhheGAqACiCHzOKQDQrqgILpwSAeEDBnEUAF0gCMxZ7G72qce/mec2Lpf9+3unaS78wgSNZ8uX5729+d1FNWXUuGmXlBOUUEIMckEpeQJgBu6C+BSFngztBR2vd+ovY+7g+p6LbgaWgJrAeUkDYIUXgXdBBwNi6kpABJwMTQH3AZsXRR8GHTfgEth8E3gjdAUcNewpbTgY85sCMCUuOokozE0YM0YRzM9NGAAXd8+omAF5h4lnmBRvpSnZHyLoLEbaN+aKB9KWv/KWw0tAbbANnlG+UvB2dm77NxxdwgBpjrF/d7rW9cbmpvio2A5z8iAYpVU8pGZlo6/2+MSco2lHfd3rv9jAP038e1xef9o2mjvYb2OqpqKE81028/jeietlSEVO5FRWsxWsJit1G3aFpW8iWe5RwpiCZAk25QvV6nz6fIlynRGuTd5WqpJ4guAlDfVKBK87hXljflgv1ON6fV+4+5gVlA17SfeG0heKqQd4l4jI/wrmaA9N9R4ar+wpHJDZyrrfcH0nB66PqAzPi76pn+faSyJk/vzOorYhGurQrzj/P68jtBMawHaHBIR9xoD5O34dy0qQOSYHvqExq2TpT2nf76+w7y251OYF0CRaU+J920TwLUa6inx6OxE6g80lu2ux7Y2eJLF/rCXE6zEPdnenk9o+4ih9AEdnW2q81HXl5LuU6OTl2fXUhqganbXAGq3g6jJOWV/OnoesO6YqqEB/GdNsjf7uHtwj2DzmRNpp7iOZfm6D9oAxB6Yi1gC4oIYeo4MIPdopEQRB+cAko5J1tW386HpB2Kz1eop4Epdwls/kgZ1sh8gZsEjdcWkr//D8Qu3Z3l5Nl1NtAAAAABJRU5ErkJggg==";
  function Ge(t18) {
    return typeof t18 != "string" || Sn(t18) ? t18 : _.urlPrefix + t18;
  }
  i(Ge, "fixURL");
  var Ie = class t15 {
    static {
      i(this, "SpriteData");
    }
    tex;
    frames = [new $(0, 0, 1, 1)];
    anims = {};
    slice9 = null;
    constructor(e, n, r = {}, o = null) {
      this.tex = e, n && (this.frames = n), this.anims = r, this.slice9 = o;
    }
    get width() {
      return this.tex.width * this.frames[0].w;
    }
    get height() {
      return this.tex.height * this.frames[0].h;
    }
    static from(e, n = {}) {
      return typeof e == "string" ? t15.fromURL(e, n) : Promise.resolve(t15.fromImage(e, n));
    }
    static fromImage(e, n = {}) {
      let [r, o] = _.packer.add(e), s = n.frames ? n.frames.map((a) => new $(o.x + a.x * o.w, o.y + a.y * o.h, a.w * o.w, a.h * o.h)) : Dr(n.sliceX || 1, n.sliceY || 1, o.x, o.y, o.w, o.h);
      return new t15(r, s, n.anims, n.slice9);
    }
    static fromURL(e, n = {}) {
      return At(e).then((r) => t15.fromImage(r, n));
    }
  };
  function It(t18) {
    if (typeof t18 == "string") {
      let e = Gr(t18);
      if (e)
        return e;
      if (Le() < 1)
        return null;
      throw new Error(`Sprite not found: ${t18}`);
    } else {
      if (t18 instanceof Ie)
        return me.loaded(t18);
      if (t18 instanceof me)
        return t18;
      throw new Error(`Invalid sprite: ${t18}`);
    }
  }
  i(It, "resolveSprite");
  function Gr(t18) {
    return _.sprites.get(t18) ?? null;
  }
  i(Gr, "getSprite");
  function St(t18, e, n = { sliceX: 1, sliceY: 1, anims: {} }) {
    return e = Ge(e), Array.isArray(e) ? e.some((r) => typeof r == "string") ? _.sprites.add(t18, Promise.all(e.map((r) => typeof r == "string" ? At(r) : Promise.resolve(r))).then((r) => Gi(r, n))) : _.sprites.addLoaded(t18, Gi(e, n)) : typeof e == "string" ? _.sprites.add(t18, Ie.from(e, n)) : _.sprites.addLoaded(t18, Ie.fromImage(e, n));
  }
  i(St, "loadSprite");
  function Dr(t18 = 1, e = 1, n = 0, r = 0, o = 1, s = 1) {
    let a = [], l = o / t18, u = s / e;
    for (let m = 0; m < e; m++)
      for (let c = 0; c < t18; c++)
        a.push(new $(n + c * l, r + m * u, l, u));
    return a;
  }
  i(Dr, "slice");
  function Gi(t18, e = {}) {
    let n = document.createElement("canvas"), r = t18[0].width, o = t18[0].height;
    n.width = r * t18.length, n.height = o;
    let s = n.getContext("2d");
    if (!s)
      throw new Error("Failed to create canvas context");
    t18.forEach((l, u) => {
      l instanceof ImageData ? s.putImageData(l, u * r, 0) : s.drawImage(l, u * r, 0);
    });
    let a = s.getImageData(0, 0, t18.length * r, o);
    return Ie.fromImage(a, { ...e, sliceX: t18.length, sliceY: 1 });
  }
  i(Gi, "createSpriteSheet");
  function Di(t18 = "bean") {
    return St(t18, Ri);
  }
  i(Di, "loadBean");
  function Mi(t18, e, n) {
    e = Ge(e), n = Ge(n), typeof e == "string" && !n && (n = zo(e) + ".json");
    let r = typeof n == "string" ? Ot(n) : Promise.resolve(n);
    return _.sprites.add(t18, r.then((o) => {
      let s = o.meta.size, a = o.frames.map((u) => new $(u.frame.x / s.w, u.frame.y / s.h, u.frame.w / s.w, u.frame.h / s.h)), l = {};
      for (let u of o.meta.frameTags)
        u.from === u.to ? l[u.name] = u.from : l[u.name] = { from: u.from, to: u.to, speed: 10, loop: true, pingpong: u.direction === "pingpong" };
      return Ie.from(e, { frames: a, anims: l });
    }));
  }
  i(Mi, "loadAseprite");
  var Vt = class {
    static {
      i(this, "FontData");
    }
    fontface;
    filter = Zt;
    outline = null;
    size = 64;
    constructor(e, n = {}) {
      if (this.fontface = e, this.filter = n.filter ?? Zt, this.size = n.size ?? 64, this.size > 256)
        throw new Error(`Max font size: ${256}`);
      n.outline && (this.outline = { width: 1, color: W(0, 0, 0) }, typeof n.outline == "number" ? this.outline.width = n.outline : typeof n.outline == "object" && (n.outline.width && (this.outline.width = n.outline.width), n.outline.color && (this.outline.color = n.outline.color)));
    }
  };
  function Mr(t18) {
    if (!t18)
      return Mr(re.font ?? pi);
    if (typeof t18 == "string") {
      let e = Fn(t18), n = Ur(t18);
      if (e)
        return e.data ?? e;
      if (n)
        return n.data ?? n;
      if (document.fonts.check(`${64}px ${t18}`))
        return t18;
      if (Le() < 1)
        return null;
      throw new Error(`Font not found: ${t18}`);
    } else if (t18 instanceof me)
      return t18.data ? t18.data : t18;
    return t18;
  }
  i(Mr, "resolveFont");
  function Ur(t18) {
    return _.fonts.get(t18) ?? null;
  }
  i(Ur, "getFont");
  function Ui(t18, e, n = {}) {
    let r = new FontFace(t18, typeof e == "string" ? `url(${e})` : e);
    return document.fonts.add(r), _.fonts.add(t18, r.load().catch((o) => {
      throw new Error(`Failed to load font from "${e}": ${o}`);
    }).then((o) => new Vt(o, n)));
  }
  i(Ui, "loadFont");
  function Bi(t18, e, n, r) {
    let o = t18.width / e, s = {}, a = r.split("").entries();
    for (let [l, u] of a)
      s[u] = new $(l % o * e, Math.floor(l / o) * n, e, n);
    return { tex: t18, map: s, size: n };
  }
  i(Bi, "makeFont");
  function Fn(t18) {
    return _.bitmapFonts.get(t18) ?? null;
  }
  i(Fn, "getBitmapFont");
  function Fi(t18, e, n, r, o = {}) {
    return _.bitmapFonts.add(t18, At(e).then((s) => Bi(Me.fromImage(O.ggl, s, o), n, r, o.chars ?? Bn)));
  }
  i(Fi, "loadBitmapFont");
  function Li(t18, e) {
    return e = Ge(e), _.sprites.add(t18, new Promise(async (n) => {
      let r = typeof e == "string" ? await Ot(e) : e, o = await Promise.all(r.frames.map(At)), s = document.createElement("canvas");
      s.width = r.width, s.height = r.height * r.frames.length;
      let a = s.getContext("2d");
      if (!a)
        throw new Error("Failed to create canvas context");
      o.forEach((u, m) => {
        a.drawImage(u, 0, m * r.height);
      });
      let l = await St(null, s, { sliceY: r.frames.length, anims: r.anims });
      n(l);
    }));
  }
  i(Li, "loadPedit");
  var Br = class {
    static {
      i(this, "Shader");
    }
    ctx;
    glProgram;
    constructor(e, n, r, o) {
      this.ctx = e, e.onDestroy(() => this.free());
      let s = e.gl, a = s.createShader(s.VERTEX_SHADER), l = s.createShader(s.FRAGMENT_SHADER);
      if (!a || !l)
        throw new Error("Failed to create shader");
      s.shaderSource(a, n), s.shaderSource(l, r), s.compileShader(a), s.compileShader(l);
      let u = s.createProgram();
      if (this.glProgram = u, s.attachShader(u, a), s.attachShader(u, l), o.forEach((m, c) => s.bindAttribLocation(u, c, m)), s.linkProgram(u), !s.getProgramParameter(u, s.LINK_STATUS)) {
        let m = s.getShaderInfoLog(a);
        if (m)
          throw new Error("VERTEX SHADER " + m);
        let c = s.getShaderInfoLog(l);
        if (c)
          throw new Error("FRAGMENT SHADER " + c);
      }
      s.deleteShader(a), s.deleteShader(l);
    }
    bind() {
      this.ctx.pushProgram(this.glProgram);
    }
    unbind() {
      this.ctx.popProgram();
    }
    send(e) {
      let n = this.ctx.gl;
      for (let r in e) {
        let o = e[r], s = n.getUniformLocation(this.glProgram, r);
        if (typeof o == "number")
          n.uniform1f(s, o);
        else if (o instanceof fe)
          n.uniformMatrix4fv(s, false, new Float32Array(o.m));
        else if (o instanceof H)
          n.uniform3f(s, o.r, o.g, o.b);
        else if (o instanceof w)
          n.uniform2f(s, o.x, o.y);
        else if (Array.isArray(o)) {
          let a = o[0];
          _o(o) ? n.uniform1fv(s, o) : ko(o) ? n.uniform2fv(s, o.map((l) => [l.x, l.y]).flat()) : Ko(o) && n.uniform3fv(s, o.map((l) => [l.r, l.g, l.b]).flat());
        } else
          throw new Error("Unsupported uniform data type");
      }
    }
    free() {
      this.ctx.gl.deleteProgram(this.glProgram);
    }
  };
  function Ln(t18, e = tn, n = nn) {
    let r = gi.replace("{{user}}", e ?? tn), o = bi.replace("{{user}}", n ?? nn);
    try {
      return new Br(t18, r, o, en.map((s) => s.name));
    } catch (s) {
      let l = /(?<type>^\w+) SHADER ERROR: 0:(?<line>\d+): (?<msg>.+)/, u = Yo(s).match(l);
      if (!u?.groups)
        throw s;
      let m = Number(u.groups.line) - 14, c = u.groups.msg.trim(), p = u.groups.type.toLowerCase();
      throw new Error(`${p} shader line ${m}: ${c}`);
    }
  }
  i(Ln, "makeShader");
  function Ii(t18) {
    if (!t18)
      return O.defShader;
    if (typeof t18 == "string") {
      let e = Fr(t18);
      if (e)
        return e.data ?? e;
      if (Le() < 1)
        return null;
      throw new Error(`Shader not found: ${t18}`);
    } else if (t18 instanceof me)
      return t18.data ? t18.data : t18;
    return t18;
  }
  i(Ii, "resolveShader");
  function Fr(t18) {
    return _.shaders.get(t18) ?? null;
  }
  i(Fr, "getShader");
  function ji(t18, e, n) {
    return _.shaders.addLoaded(t18, Ln(O.ggl, e, n));
  }
  i(ji, "loadShader");
  function Ki(t18, e, n) {
    e = Ge(e), n = Ge(n);
    let r = i((s) => s ? Ti(s) : Promise.resolve(null), "resolveUrl"), o = Promise.all([r(e), r(n)]).then(([s, a]) => Ln(O.ggl, s, a));
    return _.shaders.add(t18, o);
  }
  i(Ki, "loadShaderURL");
  var st = class t16 {
    static {
      i(this, "SoundData");
    }
    buf;
    constructor(e) {
      this.buf = e;
    }
    static fromArrayBuffer(e) {
      return new Promise((n, r) => oe.ctx.decodeAudioData(e, n, r)).then((n) => new t16(n));
    }
    static fromURL(e) {
      return Sn(e) ? t16.fromArrayBuffer(Ho(e)) : Oi(e).then((n) => t16.fromArrayBuffer(n));
    }
  };
  function ki(t18) {
    if (typeof t18 == "string") {
      let e = Lr(t18);
      if (e)
        return e;
      if (Le() < 1)
        return null;
      throw new Error(`Sound not found: ${t18}`);
    } else {
      if (t18 instanceof st)
        return me.loaded(t18);
      if (t18 instanceof me)
        return t18;
      throw new Error(`Invalid sound: ${t18}`);
    }
  }
  i(ki, "resolveSound");
  function Lr(t18) {
    return _.sounds.get(t18) ?? null;
  }
  i(Lr, "getSound");
  function _i(t18, e) {
    return e = Ge(e), _.sounds.add(t18, typeof e == "string" ? st.fromURL(e) : st.fromArrayBuffer(e));
  }
  i(_i, "loadSound");
  function Ni(t18, e) {
    let n = new Audio(e);
    return n.preload = "auto", _.music[t18] = Ge(e);
  }
  i(Ni, "loadMusic");
  function Ir(t18, e) {
    return t18 = Ge(t18), typeof e == "string" ? on(new Promise((n, r) => {
      Ot(e).then((o) => {
        Ir(t18, o).then(n).catch(r);
      });
    })) : on(Ie.from(t18).then((n) => {
      let r = {};
      for (let o in e) {
        let s = e[o], a = n.frames[0], l = 2048 * a.w, u = 2048 * a.h, m = s.frames ? s.frames.map((p) => new $(a.x + (s.x + p.x) / l * a.w, a.y + (s.y + p.y) / u * a.h, p.w / l * a.w, p.h / u * a.h)) : Dr(s.sliceX || 1, s.sliceY || 1, a.x + s.x / l * a.w, a.y + s.y / u * a.h, s.width / l * a.w, s.height / u * a.h), c = new Ie(n.tex, m, s.anims);
        _.sprites.addLoaded(o, c), r[o] = c;
      }
      return r;
    }));
  }
  i(Ir, "loadSpriteAtlas");
  function je(t18, e, n = false, r, o, s = {}) {
    let a = r ?? O.defTex, l = o ?? O.defShader, u = Ii(l);
    if (!u || u instanceof me)
      return;
    let m = O.fixed || n ? O.transform : C.cam.transform.mult(O.transform), c = [];
    for (let p of t18) {
      let d = ai(m.multVec2(p.pos));
      c.push(d.x, d.y, p.uv.x, p.uv.y, p.color.r / 255, p.color.g / 255, p.color.b / 255, p.opacity);
    }
    O.renderer.push(O.ggl.gl.TRIANGLES, c, e, u, a, s);
  }
  i(je, "drawRaw");
  function He(t18) {
    if (!t18.pts)
      throw new Error('drawPolygon() requires property "pts".');
    let e = t18.pts.length;
    if (!(e < 3)) {
      if (ve(), ne(t18.pos), it(t18.scale), Qe(t18.angle), ne(t18.offset), t18.fill !== false) {
        let n = t18.color ?? H.WHITE, r = t18.pts.map((s, a) => ({ pos: new w(s.x, s.y), uv: t18.uv ? t18.uv[a] : new w(0, 0), color: t18.colors && t18.colors[a] ? t18.colors[a].mult(n) : n, opacity: t18.opacity ?? 1 })), o;
        t18.triangulate ? o = On(t18.pts).map((a) => a.map((l) => t18.pts.indexOf(l))).flat() : o = [...Array(e - 2).keys()].map((s) => [0, s + 1, s + 2]).flat(), je(r, t18.indices ?? o, t18.fixed, t18.uv ? t18.tex : O.defTex, t18.shader, t18.uniform ?? void 0);
      }
      t18.outline && jt({ pts: [...t18.pts, t18.pts[0]], radius: t18.radius, width: t18.outline.width, color: t18.outline.color, join: t18.outline.join, uniform: t18.uniform, fixed: t18.fixed, opacity: t18.opacity ?? t18.outline.opacity }), ye();
    }
  }
  i(He, "drawPolygon");
  function In(t18) {
    if (t18.radiusX === void 0 || t18.radiusY === void 0)
      throw new Error('drawEllipse() requires properties "radiusX" and "radiusY".');
    if (t18.radiusX === 0 || t18.radiusY === 0)
      return;
    let e = t18.start ?? 0, n = t18.end ?? 360, r = Ne(t18.anchor ?? "center").scale(new w(-t18.radiusX, -t18.radiusY)), o = Ct(r, t18.radiusX, t18.radiusY, e, n, t18.resolution);
    o.unshift(r);
    let s = Object.assign({}, t18, { pts: o, radius: 0, ...t18.gradient ? { colors: [t18.gradient[0], ...Array(o.length - 1).fill(t18.gradient[1])] } : {} });
    if (n - e >= 360 && t18.outline) {
      t18.fill !== false && He(Object.assign({}, s, { outline: null })), He(Object.assign({}, s, { pts: o.slice(1), fill: false }));
      return;
    }
    He(s);
  }
  i(In, "drawEllipse");
  function ft(t18) {
    if (typeof t18.radius != "number")
      throw new Error('drawCircle() requires property "radius".');
    t18.radius !== 0 && In(Object.assign({}, t18, { radiusX: t18.radius, radiusY: t18.radius, angle: 0 }));
  }
  i(ft, "drawCircle");
  function Kt(t18) {
    let { p1: e, p2: n } = t18;
    if (!e || !n)
      throw new Error('drawLine() requires properties "p1" and "p2".');
    let r = t18.width || 1, o = n.sub(e).unit().normal().scale(r * 0.5), s = [e.sub(o), e.add(o), n.add(o), n.sub(o)].map((a) => ({ pos: new w(a.x, a.y), uv: new w(0), color: t18.color ?? H.WHITE, opacity: t18.opacity ?? 1 }));
    je(s, [0, 1, 3, 1, 2, 3], t18.fixed, O.defTex, t18.shader, t18.uniform ?? void 0);
  }
  i(Kt, "drawLine");
  function Pu(t18) {
    let e = t18.pts, n = [], r = (t18.width || 1) * 0.5, o = e[0] === e[e.length - 1] || e[0].eq(e[e.length - 1]), s = t18.pos || b(0, 0), a;
    o ? a = e[0].sub(e[e.length - 2]) : a = e[1].sub(e[0]);
    let l = a.len(), u = a.normal().scale(-r / l), m, c = e[0];
    if (!o)
      switch (t18.cap) {
        case "square": {
          let f = a.scale(-r / l);
          n.push(c.add(f).add(u)), n.push(c.add(f).sub(u));
          break;
        }
        case "round": {
          let f = Math.max(r, 10), y = Math.PI / f, v = u.scale(-1), A = Math.cos(y), V = Math.sin(y);
          for (let M2 = 0; M2 < f; M2++)
            n.push(c), n.push(c.sub(v)), v = b(v.x * A - v.y * V, v.x * V + v.y * A);
        }
      }
    for (let f = 1; f < e.length; f++) {
      if (c === e[f] || c.eq(e[f]))
        continue;
      m = c, c = e[f];
      let y = c.sub(m), v = y.len(), A = y.normal().scale(-r / v), V = a.cross(y);
      if (Math.abs(V) / (l * v) < 0.05) {
        n.push(m.add(u)), n.push(m.sub(u)), a.dot(y) < 0 && (n.push(m.sub(u)), n.push(m.add(u))), a = y, l = v, u = A;
        continue;
      }
      let M2 = A.sub(u).cross(y) / V, G2 = u.add(a.scale(M2));
      V > 0 ? (n.push(m.add(G2)), n.push(m.sub(u)), n.push(m.add(G2)), n.push(m.sub(A))) : (n.push(m.add(u)), n.push(m.sub(G2)), n.push(m.add(A)), n.push(m.sub(G2))), a = y, l = v, u = A;
    }
    if (!o)
      switch (n.push(c.add(u)), n.push(c.sub(u)), t18.cap) {
        case "square": {
          let f = a.scale(r / l);
          n.push(c.add(f).add(u)), n.push(c.add(f).sub(u));
          break;
        }
        case "round": {
          let f = Math.max(r, 10), y = Math.PI / f, v = u.scale(1), A = Math.cos(y), V = Math.sin(y);
          for (let M2 = 0; M2 < f; M2++)
            v = b(v.x * A - v.y * V, v.x * V + v.y * A), n.push(c), n.push(c.sub(v));
        }
      }
    if (n.length < 4)
      return;
    let p = n.map((f) => ({ pos: s.add(f), uv: b(), color: t18.color || H.WHITE, opacity: t18.opacity ?? 1 })), d = [], x = 0;
    for (let f = 0; f < n.length - 2; f += 2)
      d[x++] = f + 1, d[x++] = f, d[x++] = f + 2, d[x++] = f + 2, d[x++] = f + 3, d[x++] = f + 1;
    o && (d[x++] = n.length - 1, d[x++] = n.length - 2, d[x++] = 0, d[x++] = 0, d[x++] = 1, d[x++] = n.length - 1), je(p, d, t18.fixed, O.defTex, t18.shader, t18.uniform ?? void 0);
  }
  i(Pu, "_drawLinesBevel");
  function Ru(t18) {
    let e = t18.pts, n = [], r = (t18.width || 1) * 0.5, o = e[0] === e[e.length - 1] || e[0].eq(e[e.length - 1]), s = t18.pos || b(0, 0), a;
    o ? a = e[0].sub(e[e.length - 2]) : a = e[1].sub(e[0]);
    let l = a.len(), u = a.normal().scale(-r / l), m, c = e[0];
    if (!o)
      switch (t18.cap) {
        case "square": {
          let f = a.scale(-r / l);
          n.push(c.add(f).add(u)), n.push(c.add(f).sub(u));
          break;
        }
        case "round": {
          let f = Math.max(r, 10), y = Math.PI / f, v = u.scale(-1), A = Math.cos(y), V = Math.sin(y);
          for (let M2 = 0; M2 < f; M2++)
            n.push(c), n.push(c.sub(v)), v = b(v.x * A - v.y * V, v.x * V + v.y * A);
        }
      }
    for (let f = 1; f < e.length; f++) {
      if (c === e[f] || c.eq(e[f]))
        continue;
      m = c, c = e[f];
      let y = c.sub(m), v = y.len(), A = y.normal().scale(-r / v), V = a.cross(y);
      if (Math.abs(V) / (l * v) < 0.05) {
        n.push(m.add(u)), n.push(m.sub(u)), a.dot(y) < 0 && (n.push(m.sub(u)), n.push(m.add(u))), a = y, l = v, u = A;
        continue;
      }
      let M2 = A.sub(u).cross(y) / V, G2 = u.add(a.scale(M2));
      if (V > 0) {
        let F = m.add(G2), g = Math.max(r, 10), T = ce(u.angleBetween(A) / g), S = u, D = Math.cos(T), B = Math.sin(T);
        for (let K2 = 0; K2 < g; K2++)
          n.push(F), n.push(m.sub(S)), S = b(S.x * D - S.y * B, S.x * B + S.y * D);
      } else {
        let F = m.sub(G2), g = Math.max(r, 10), T = ce(u.angleBetween(A) / g), S = u, D = Math.cos(T), B = Math.sin(T);
        for (let K2 = 0; K2 < g; K2++)
          n.push(m.add(S)), n.push(F), S = b(S.x * D - S.y * B, S.x * B + S.y * D);
      }
      a = y, l = v, u = A;
    }
    if (!o)
      switch (n.push(c.add(u)), n.push(c.sub(u)), t18.cap) {
        case "square": {
          let f = a.scale(r / l);
          n.push(c.add(f).add(u)), n.push(c.add(f).sub(u));
          break;
        }
        case "round": {
          let f = Math.max(r, 10), y = Math.PI / f, v = u.scale(1), A = Math.cos(y), V = Math.sin(y);
          for (let M2 = 0; M2 < f; M2++)
            v = b(v.x * A - v.y * V, v.x * V + v.y * A), n.push(c), n.push(c.sub(v));
        }
      }
    if (n.length < 4)
      return;
    let p = n.map((f) => ({ pos: s.add(f), uv: b(), color: t18.color || H.WHITE, opacity: t18.opacity ?? 1 })), d = [], x = 0;
    for (let f = 0; f < n.length - 2; f += 2)
      d[x++] = f + 1, d[x++] = f, d[x++] = f + 2, d[x++] = f + 2, d[x++] = f + 3, d[x++] = f + 1;
    o && (d[x++] = n.length - 1, d[x++] = n.length - 2, d[x++] = 0, d[x++] = 0, d[x++] = 1, d[x++] = n.length - 1), je(p, d, t18.fixed, O.defTex, t18.shader, t18.uniform ?? void 0);
  }
  i(Ru, "_drawLinesRound");
  function Gu(t18) {
    let e = t18.pts, n = [], r = (t18.width || 1) * 0.5, o = e[0] === e[e.length - 1] || e[0].eq(e[e.length - 1]), s = t18.pos || b(0, 0), a;
    o ? a = e[0].sub(e[e.length - 2]) : a = e[1].sub(e[0]);
    let l = a.len(), u = a.normal().scale(-r / l), m, c = e[0];
    if (!o)
      switch (t18.cap) {
        case "square": {
          let f = a.scale(-r / l);
          n.push(c.add(f).add(u)), n.push(c.add(f).sub(u));
          break;
        }
        case "round": {
          let f = Math.max(r, 10), y = Math.PI / f, v = u.scale(-1), A = Math.cos(y), V = Math.sin(y);
          for (let M2 = 0; M2 < f; M2++)
            n.push(c), n.push(c.sub(v)), v = b(v.x * A - v.y * V, v.x * V + v.y * A);
        }
      }
    for (let f = 1; f < e.length; f++) {
      if (c === e[f] || c.eq(e[f]))
        continue;
      m = c, c = e[f];
      let y = c.sub(m), v = y.len(), A = y.normal().scale(-r / v), V = a.cross(y);
      if (Math.abs(V) / (l * v) < 0.05) {
        n.push(m.add(u)), n.push(m.sub(u)), a.dot(y) < 0 && (n.push(m.sub(u)), n.push(m.add(u))), a = y, l = v, u = A;
        continue;
      }
      let M2 = A.sub(u).cross(y) / V, G2 = u.add(a.scale(M2));
      n.push(m.add(G2)), n.push(m.sub(G2)), a = y, l = v, u = A;
    }
    if (!o)
      switch (n.push(c.add(u)), n.push(c.sub(u)), t18.cap) {
        case "square": {
          let f = a.scale(r / l);
          n.push(c.add(f).add(u)), n.push(c.add(f).sub(u));
          break;
        }
        case "round": {
          let f = Math.max(r, 10), y = Math.PI / f, v = u.scale(1), A = Math.cos(y), V = Math.sin(y);
          for (let M2 = 0; M2 < f; M2++)
            v = b(v.x * A - v.y * V, v.x * V + v.y * A), n.push(c), n.push(c.sub(v));
        }
      }
    if (n.length < 4)
      return;
    let p = n.map((f) => ({ pos: s.add(f), uv: b(), color: t18.color || H.WHITE, opacity: t18.opacity ?? 1 })), d = [], x = 0;
    for (let f = 0; f < n.length - 2; f += 2)
      d[x++] = f + 1, d[x++] = f, d[x++] = f + 2, d[x++] = f + 2, d[x++] = f + 3, d[x++] = f + 1;
    o && (d[x++] = n.length - 1, d[x++] = n.length - 2, d[x++] = 0, d[x++] = 0, d[x++] = 1, d[x++] = n.length - 1), je(p, d, t18.fixed, O.defTex, t18.shader, t18.uniform ?? void 0);
  }
  i(Gu, "_drawLinesMiter");
  function jt(t18) {
    let e = t18.pts, n = t18.width ?? 1;
    if (!e)
      throw new Error('drawLines() requires property "pts".');
    if (!(e.length < 2)) {
      if (e.length > 2)
        switch (t18.join) {
          case "bevel":
            return Pu(t18);
          case "round":
            return Ru(t18);
          case "miter":
            return Gu(t18);
        }
      if (t18.radius && e.length >= 3) {
        Kt(Object.assign({}, t18, { p1: e[0], p2: e[1] }));
        for (let r = 1; r < e.length - 2; r++) {
          let o = e[r], s = e[r + 1];
          Kt(Object.assign({}, t18, { p1: o, p2: s }));
        }
        Kt(Object.assign({}, t18, { p1: e[e.length - 2], p2: e[e.length - 1] }));
      } else
        for (let r = 0; r < e.length - 1; r++)
          Kt(Object.assign({}, t18, { p1: e[r], p2: e[r + 1] })), t18.join !== "none" && ft(Object.assign({}, t18, { pos: e[r], radius: n / 2 }));
    }
  }
  i(jt, "drawLines");
  function jn(t18, e) {
    let n = e.segments ?? 16, r = [];
    for (let o = 0; o <= n; o++)
      r.push(t18(o / n));
    jt({ pts: r, width: e.width || 1, pos: e.pos, color: e.color, opacity: e.opacity });
  }
  i(jn, "drawCurve");
  function Hi(t18) {
    jn((e) => Xt(t18.pt1, t18.pt2, t18.pt3, t18.pt4, e), t18);
  }
  i(Hi, "drawBezier");
  var Me = class t17 {
    static {
      i(this, "Texture");
    }
    ctx;
    src = null;
    glTex;
    width;
    height;
    constructor(e, n, r, o = {}) {
      this.ctx = e;
      let s = e.gl, a = e.gl.createTexture();
      if (!a)
        throw new Error("Failed to create texture");
      this.glTex = a, e.onDestroy(() => this.free()), this.width = n, this.height = r;
      let l = { linear: s.LINEAR, nearest: s.NEAREST }[o.filter ?? e.opts.texFilter ?? "nearest"], u = { repeat: s.REPEAT, clampToEdge: s.CLAMP_TO_EDGE }[o.wrap ?? "clampToEdge"];
      this.bind(), n && r && s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, n, r, 0, s.RGBA, s.UNSIGNED_BYTE, null), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, l), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, l), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_S, u), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_WRAP_T, u), this.unbind();
    }
    static fromImage(e, n, r = {}) {
      let o = new t17(e, n.width, n.height, r);
      return o.update(n), o.src = n, o;
    }
    update(e, n = 0, r = 0) {
      let o = this.ctx.gl;
      this.bind(), o.texSubImage2D(o.TEXTURE_2D, 0, n, r, o.RGBA, o.UNSIGNED_BYTE, e), this.unbind();
    }
    bind() {
      this.ctx.pushTexture2D(this.glTex);
    }
    unbind() {
      this.ctx.popTexture2D();
    }
    free() {
      this.ctx.gl.deleteTexture(this.glTex);
    }
  };
  var at = class {
    static {
      i(this, "FrameBuffer");
    }
    ctx;
    tex;
    glFramebuffer;
    glRenderbuffer;
    constructor(e, n, r, o = {}) {
      this.ctx = e;
      let s = e.gl;
      e.onDestroy(() => this.free()), this.tex = new Me(e, n, r, o);
      let a = s.createFramebuffer(), l = s.createRenderbuffer();
      if (!a || !l)
        throw new Error("Failed to create framebuffer");
      this.glFramebuffer = a, this.glRenderbuffer = l, this.bind(), s.renderbufferStorage(s.RENDERBUFFER, s.DEPTH_STENCIL, n, r), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, this.tex.glTex, 0), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.RENDERBUFFER, this.glRenderbuffer), this.unbind();
    }
    get width() {
      return this.tex.width;
    }
    get height() {
      return this.tex.height;
    }
    toImageData() {
      let e = this.ctx.gl, n = new Uint8ClampedArray(this.width * this.height * 4);
      this.bind(), e.readPixels(0, 0, this.width, this.height, e.RGBA, e.UNSIGNED_BYTE, n), this.unbind();
      let r = this.width * 4, o = new Uint8Array(r);
      for (let s = 0; s < (this.height / 2 | 0); s++) {
        let a = s * r, l = (this.height - s - 1) * r;
        o.set(n.subarray(a, a + r)), n.copyWithin(a, l, l + r), n.set(o, l);
      }
      return new ImageData(n, this.width, this.height);
    }
    toDataURL() {
      let e = document.createElement("canvas"), n = e.getContext("2d");
      if (e.width = this.width, e.height = this.height, !n)
        throw new Error("Failed to get 2d context");
      return n.putImageData(this.toImageData(), 0, 0), e.toDataURL();
    }
    clear() {
      let e = this.ctx.gl;
      e.clear(e.COLOR_BUFFER_BIT);
    }
    draw(e) {
      this.bind(), e(), this.unbind();
    }
    bind() {
      this.ctx.pushFramebuffer(this.glFramebuffer), this.ctx.pushRenderbuffer(this.glRenderbuffer), this.ctx.pushViewport({ x: 0, y: 0, w: this.width, h: this.height });
    }
    unbind() {
      this.ctx.popFramebuffer(), this.ctx.popRenderbuffer(), this.ctx.popViewport();
    }
    free() {
      let e = this.ctx.gl;
      e.deleteFramebuffer(this.glFramebuffer), e.deleteRenderbuffer(this.glRenderbuffer), this.tex.free();
    }
  };
  var Kn = class {
    static {
      i(this, "BatchRenderer");
    }
    ctx;
    glVBuf;
    glIBuf;
    vqueue = [];
    iqueue = [];
    stride;
    maxVertices;
    maxIndices;
    vertexFormat;
    numDraws = 0;
    curPrimitive = null;
    curTex = null;
    curShader = null;
    curUniform = {};
    constructor(e, n, r, o) {
      let s = e.gl;
      this.vertexFormat = n, this.ctx = e, this.stride = n.reduce((l, u) => l + u.size, 0), this.maxVertices = r, this.maxIndices = o;
      let a = s.createBuffer();
      if (!a)
        throw new Error("Failed to create vertex buffer");
      this.glVBuf = a, e.pushArrayBuffer(this.glVBuf), s.bufferData(s.ARRAY_BUFFER, r * 4, s.DYNAMIC_DRAW), e.popArrayBuffer(), this.glIBuf = s.createBuffer(), e.pushElementArrayBuffer(this.glIBuf), s.bufferData(s.ELEMENT_ARRAY_BUFFER, o * 4, s.DYNAMIC_DRAW), e.popElementArrayBuffer();
    }
    push(e, n, r, o, s = null, a = {}) {
      (e !== this.curPrimitive || s !== this.curTex || o !== this.curShader || !Vn(this.curUniform, a) || this.vqueue.length + n.length * this.stride > this.maxVertices || this.iqueue.length + r.length > this.maxIndices) && this.flush();
      let l = this.vqueue.length / this.stride;
      for (let u of n)
        this.vqueue.push(u);
      for (let u of r)
        this.iqueue.push(u + l);
      this.curPrimitive = e, this.curShader = o, this.curTex = s, this.curUniform = a;
    }
    flush() {
      if (!this.curPrimitive || !this.curShader || this.vqueue.length === 0 || this.iqueue.length === 0)
        return;
      let e = this.ctx.gl;
      this.ctx.pushArrayBuffer(this.glVBuf), e.bufferSubData(e.ARRAY_BUFFER, 0, new Float32Array(this.vqueue)), this.ctx.pushElementArrayBuffer(this.glIBuf), e.bufferSubData(e.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.iqueue)), this.ctx.setVertexFormat(this.vertexFormat), this.curShader.bind(), this.curShader.send(this.curUniform), this.curTex?.bind(), e.drawElements(this.curPrimitive, this.iqueue.length, e.UNSIGNED_SHORT, 0), this.curTex?.unbind(), this.curShader.unbind(), this.ctx.popArrayBuffer(), this.ctx.popElementArrayBuffer(), this.vqueue = [], this.iqueue = [], this.numDraws++;
    }
    free() {
      let e = this.ctx.gl;
      e.deleteBuffer(this.glVBuf), e.deleteBuffer(this.glIBuf);
    }
  };
  function Pt(t18) {
    let e = [], n = i((s) => {
      e.push(s), t18(s);
    }, "push"), r = i(() => {
      e.pop(), t18(o() ?? null);
    }, "pop"), o = i(() => e[e.length - 1], "cur");
    return [n, r, o];
  }
  i(Pt, "genStack");
  function qi(t18, e = {}) {
    let n = [];
    function r(F) {
      n.push(F);
    }
    i(r, "onDestroy");
    function o() {
      n.forEach((g) => g());
      let F = t18.getExtension("WEBGL_lose_context");
      F && F.loseContext();
    }
    i(o, "destroy");
    let s = null;
    function a(F) {
      if (Vn(F, s))
        return;
      s = F;
      let g = F.reduce((T, S) => T + S.size, 0);
      F.reduce((T, S, D) => (t18.vertexAttribPointer(D, S.size, t18.FLOAT, false, g * 4, T), t18.enableVertexAttribArray(D), T + S.size * 4), 0);
    }
    i(a, "setVertexFormat");
    let [l, u] = Pt((F) => t18.bindTexture(t18.TEXTURE_2D, F)), [m, c] = Pt((F) => t18.bindBuffer(t18.ARRAY_BUFFER, F)), [p, d] = Pt((F) => t18.bindBuffer(t18.ELEMENT_ARRAY_BUFFER, F)), [x, f] = Pt((F) => t18.bindFramebuffer(t18.FRAMEBUFFER, F)), [y, v] = Pt((F) => t18.bindRenderbuffer(t18.RENDERBUFFER, F)), [A, V] = Pt((F) => {
      if (!F)
        return;
      let { x: g, y: T, w: S, h: D } = F;
      t18.viewport(g, T, S, D);
    }), [M2, G2] = Pt((F) => t18.useProgram(F));
    return A({ x: 0, y: 0, w: t18.drawingBufferWidth, h: t18.drawingBufferHeight }), { gl: t18, opts: e, onDestroy: r, destroy: o, pushTexture2D: l, popTexture2D: u, pushArrayBuffer: m, popArrayBuffer: c, pushElementArrayBuffer: p, popElementArrayBuffer: d, pushFramebuffer: x, popFramebuffer: f, pushRenderbuffer: y, popRenderbuffer: v, pushViewport: A, popViewport: V, pushProgram: M2, popProgram: G2, setVertexFormat: a };
  }
  i(qi, "initGfx");
  var jr = {};
  function Wi(t18, e) {
    e.pos && (t18.pos = t18.pos.add(e.pos)), e.scale && (t18.scale = t18.scale.scale(b(e.scale))), e.angle && (t18.angle += e.angle), e.color && t18.ch.length === 1 && (t18.color = t18.color.mult(e.color)), e.opacity && (t18.opacity *= e.opacity);
  }
  i(Wi, "applyCharTransform");
  function $i(t18) {
    let e = {}, n = "", r = [], o = 0, s = 0;
    for (let a = 0; a < t18.length; a++)
      if (a !== o + 1 && (s += a - o), o = a, !(t18[a] === "\\" && t18[a + 1] === "[")) {
        if ((a === 0 || t18[a - 1] !== "\\") && t18[a] === "[") {
          let l = a;
          a++;
          let u = t18[a] === "/", m = "";
          for (u && a++; a < t18.length && t18[a] !== "]"; )
            m += t18[a++];
          if (!vi.test(m) || a >= t18.length || t18[a] !== "]" || u && (r.length === 0 || r[r.length - 1][0] !== m))
            a = l;
          else {
            u ? r.pop() : r.push([m, l]);
            continue;
          }
        }
        n += t18[a], r.length > 0 && (e[a - s] = r.map(([l]) => l));
      }
    if (r.length > 0) {
      for (; r.length > 0; ) {
        let [a, l] = r.pop();
        t18 = t18.substring(0, l) + "\\" + t18.substring(l);
      }
      return $i(t18);
    }
    return { charStyleMap: e, text: n };
  }
  i($i, "compileStyledText");
  function qe(t18) {
    if (t18.text === void 0)
      throw new Error('formatText() requires property "text".');
    let e = Mr(t18.font);
    if (t18.text === "" || e instanceof me || !e)
      return { width: 0, height: 0, chars: [], opt: t18 };
    let { charStyleMap: n, text: r } = $i(t18.text + ""), o = $o(r);
    if (e instanceof Vt || typeof e == "string") {
      let V = e instanceof Vt ? e.fontface.family : e, M2 = e instanceof Vt ? { outline: e.outline, filter: e.filter } : { outline: null, filter: Zt }, G2 = jr[V] ?? { font: { tex: new Me(O.ggl, 2048, 2048, { filter: M2.filter }), map: {}, size: 64 }, cursor: new w(0), outline: M2.outline };
      jr[V] || (jr[V] = G2), e = G2.font;
      for (let F of o)
        if (!G2.font.map[F]) {
          let g = Kr;
          if (!g)
            throw new Error("fontCacheC2d is not defined.");
          if (!gt)
            throw new Error("fontCacheCanvas is not defined.");
          g.clearRect(0, 0, gt.width, gt.height), g.font = `${e.size}px ${V}`, g.textBaseline = "top", g.textAlign = "left", g.fillStyle = "#ffffff";
          let T = g.measureText(F), S = Math.ceil(T.width);
          if (!S)
            continue;
          let D = e.size;
          G2.outline && G2.outline.width && G2.outline.color && (g.lineJoin = "round", g.lineWidth = G2.outline.width * 2, g.strokeStyle = G2.outline.color.toHex(), g.strokeText(F, G2.outline.width, G2.outline.width), S += G2.outline.width * 2, D += G2.outline.width * 3), g.fillText(F, G2.outline?.width ?? 0, G2.outline?.width ?? 0);
          let B = g.getImageData(0, 0, S, D);
          if (G2.cursor.x + S > 2048 && (G2.cursor.x = 0, G2.cursor.y += D, G2.cursor.y > 2048))
            throw new Error("Font atlas exceeds character limit");
          e.tex.update(B, G2.cursor.x, G2.cursor.y), e.map[F] = new $(G2.cursor.x, G2.cursor.y, S, D), G2.cursor.x += S;
        }
    }
    let s = t18.size || e.size, a = b(t18.scale ?? 1).scale(s / e.size), l = t18.lineSpacing ?? 0, u = t18.letterSpacing ?? 0, m = 0, c = 0, p = 0, d = [], x = [], f = 0, y = null, v = 0;
    for (; f < o.length; ) {
      let V = o[f];
      if (V === `
`)
        p += s + l, d.push({ width: m - u, chars: x }), y = null, v = 0, m = 0, x = [];
      else {
        let M2 = e.map[V];
        if (M2) {
          let G2 = M2.w * a.x;
          t18.width && m + G2 > t18.width && (p += s + l, y != null && (f -= x.length - y, V = o[f], M2 = e.map[V], G2 = M2.w * a.x, x = x.slice(0, y - 1), m = v), y = null, v = 0, d.push({ width: m - u, chars: x }), m = 0, x = []), x.push({ tex: e.tex, width: M2.w, height: M2.h, quad: new $(M2.x / e.tex.width, M2.y / e.tex.height, M2.w / e.tex.width, M2.h / e.tex.height), ch: V, pos: new w(m, p), opacity: t18.opacity ?? 1, color: t18.color ?? H.WHITE, scale: b(a), angle: 0 }), V === " " && (y = x.length, v = m), m += G2, c = Math.max(c, m), m += u;
        }
      }
      f++;
    }
    d.push({ width: m - u, chars: x }), p += s, t18.width && (c = t18.width);
    let A = [];
    for (let V = 0; V < d.length; V++) {
      let M2 = (c - d[V].width) * ni(t18.align ?? "left");
      for (let G2 of d[V].chars) {
        let F = e.map[G2.ch], g = A.length + V;
        if (G2.pos = G2.pos.add(M2, 0).add(F.w * a.x * 0.5, F.h * a.y * 0.5), t18.transform) {
          let T = typeof t18.transform == "function" ? t18.transform(g, G2.ch) : t18.transform;
          T && Wi(G2, T);
        }
        if (n[g]) {
          let T = n[g];
          for (let S of T) {
            let D = t18.styles?.[S], B = typeof D == "function" ? D(g, G2.ch) : D;
            B && Wi(G2, B);
          }
        }
        A.push(G2);
      }
    }
    return { width: c, height: p, chars: A, opt: t18 };
  }
  i(qe, "formatText");
  function ut(t18) {
    if (t18.width === void 0 || t18.height === void 0)
      throw new Error('drawUVQuad() requires property "width" and "height".');
    if (t18.width <= 0 || t18.height <= 0)
      return;
    let e = t18.width, n = t18.height, o = Ne(t18.anchor || dt2).scale(new w(e, n).scale(-0.5)), s = t18.quad || new $(0, 0, 1, 1), a = t18.color || W(255, 255, 255), l = t18.opacity ?? 1, u = t18.tex ? 0.1 / t18.tex.width : 0, m = t18.tex ? 0.1 / t18.tex.height : 0, c = s.x + u, p = s.y + m, d = s.w - u * 2, x = s.h - m * 2;
    ve(), ne(t18.pos), Qe(t18.angle), it(t18.scale), ne(o), je([{ pos: new w(-e / 2, n / 2), uv: new w(t18.flipX ? c + d : c, t18.flipY ? p : p + x), color: a, opacity: l }, { pos: new w(-e / 2, -n / 2), uv: new w(t18.flipX ? c + d : c, t18.flipY ? p + x : p), color: a, opacity: l }, { pos: new w(e / 2, -n / 2), uv: new w(t18.flipX ? c : c + d, t18.flipY ? p + x : p), color: a, opacity: l }, { pos: new w(e / 2, n / 2), uv: new w(t18.flipX ? c : c + d, t18.flipY ? p : p + x), color: a, opacity: l }], [0, 1, 3, 1, 2, 3], t18.fixed, t18.tex, t18.shader, t18.uniform ?? void 0), ye();
  }
  i(ut, "drawUVQuad");
  function ze(t18) {
    ve(), ne(t18.opt.pos), Qe(t18.opt.angle), ne(Ne(t18.opt.anchor ?? "topleft").add(1, 1).scale(t18.width, t18.height).scale(-0.5)), t18.chars.forEach((e) => {
      ut({ tex: e.tex, width: e.width, height: e.height, pos: e.pos, scale: e.scale, angle: e.angle, color: e.color, opacity: e.opacity, quad: e.quad, anchor: "center", uniform: t18.opt.uniform, shader: t18.opt.shader, fixed: t18.opt.fixed });
    }), ye();
  }
  i(ze, "drawFormattedText");
  function Ve(t18) {
    if (t18.width === void 0 || t18.height === void 0)
      throw new Error('drawRect() requires property "width" and "height".');
    if (t18.width <= 0 || t18.height <= 0)
      return;
    let e = t18.width, n = t18.height, o = Ne(t18.anchor || dt2).add(1, 1).scale(new w(e, n).scale(-0.5)), s = [new w(0, 0), new w(e, 0), new w(e, n), new w(0, n)];
    if (t18.radius) {
      let a = Math.min(e, n) / 2, l = Array.isArray(t18.radius) ? t18.radius.map((u) => Math.min(a, u)) : new Array(4).fill(Math.min(a, t18.radius));
      s = [new w(l[0], 0), ...l[1] ? Ct(new w(e - l[1], l[1]), l[1], l[1], 270, 360) : [b(e, 0)], ...l[2] ? Ct(new w(e - l[2], n - l[2]), l[2], l[2], 0, 90) : [b(e, n)], ...l[3] ? Ct(new w(l[3], n - l[3]), l[3], l[3], 90, 180) : [b(0, n)], ...l[0] ? Ct(new w(l[0], l[0]), l[0], l[0], 180, 270) : []];
    }
    He(Object.assign({}, t18, { offset: o, pts: s, ...t18.gradient ? { colors: t18.horizontal ? [t18.gradient[0], t18.gradient[1], t18.gradient[1], t18.gradient[0]] : [t18.gradient[0], t18.gradient[0], t18.gradient[1], t18.gradient[1]] } : {} }));
  }
  i(Ve, "drawRect");
  function Ye(t18) {
    Ee();
    let e = O.width, n = O.height;
    O.width = O.viewport.width, O.height = O.viewport.height, t18(), Ee(), O.width = e, O.height = n;
  }
  i(Ye, "drawUnscaled");
  function kr(t18, e) {
    Ye(() => {
      let n = b(8);
      ve(), ne(t18);
      let r = qe({ text: e, font: Tt, size: 16, pos: n, color: W(255, 255, 255), fixed: true }), o = r.width + n.x * 2, s = r.height + n.x * 2;
      t18.x + o >= he() && ne(b(-o, 0)), t18.y + s >= be() && ne(b(0, -s)), Ve({ width: o, height: s, color: W(0, 0, 0), radius: 4, opacity: 0.8, fixed: true }), ze(r), ye();
    });
  }
  i(kr, "drawInspectText");
  function kn(t18) {
    if (!t18.p1 || !t18.p2 || !t18.p3)
      throw new Error('drawTriangle() requires properties "p1", "p2" and "p3".');
    return He(Object.assign({}, t18, { pts: [t18.p1, t18.p2, t18.p3] }));
  }
  i(kn, "drawTriangle");
  function Qi() {
    if (J.inspect) {
      let t18 = null;
      for (let e of C.root.get("*", { recursive: true }))
        if (e.c("area") && e.isHovering()) {
          t18 = e;
          break;
        }
      if (C.root.drawInspect(), t18) {
        let e = [], n = t18.inspect();
        for (let r in n)
          n[r] ? e.push(`${n[r]}`) : e.push(`${r}`);
        kr(mi(Un()), e.join(`
`));
      }
      kr(b(8), `FPS: ${J.fps()}`);
    }
    J.paused && Ye(() => {
      ve(), ne(he(), 0), ne(-8, 8);
      let t18 = 32;
      Ve({ width: t18, height: t18, anchor: "topright", color: W(0, 0, 0), opacity: 0.8, radius: 4, fixed: true });
      for (let e = 1; e <= 2; e++)
        Ve({ width: 4, height: t18 * 0.6, anchor: "center", pos: b(-t18 / 3 * e, t18 * 0.5), color: W(255, 255, 255), radius: 2, fixed: true });
      ye();
    }), J.timeScale !== 1 && Ye(() => {
      ve(), ne(he(), be()), ne(-8, -8);
      let t18 = 8, e = qe({ text: J.timeScale.toFixed(1), font: Tt, size: 16, color: W(255, 255, 255), pos: b(-t18), anchor: "botright", fixed: true });
      Ve({ width: e.width + t18 * 2 + t18 * 4, height: e.height + t18 * 2, anchor: "botright", color: W(0, 0, 0), opacity: 0.8, radius: 4, fixed: true });
      for (let n = 0; n < 2; n++) {
        let r = J.timeScale < 1;
        kn({ p1: b(-e.width - t18 * (r ? 2 : 3.5), -t18), p2: b(-e.width - t18 * (r ? 2 : 3.5), -t18 - e.height), p3: b(-e.width - t18 * (r ? 3.5 : 2), -t18 - e.height / 2), pos: b(-n * t18 * 1 + (r ? -t18 * 0.5 : 0), 0), color: W(255, 255, 255), fixed: true });
      }
      ze(e), ye();
    }), J.curRecording && Ye(() => {
      ve(), ne(0, be()), ne(24, -24), ft({ radius: 12, color: W(255, 0, 0), opacity: xn(0, 1, P.time() * 4), fixed: true }), ye();
    }), J.showLog && C.logs.length > 0 && Ye(() => {
      ve(), ne(0, be()), ne(8, -8);
      let t18 = 8, e = [];
      for (let r of C.logs) {
        let o = "", s = r.msg instanceof Error ? "error" : "info";
        o += `[time]${r.time.toFixed(2)}[/time]`, o += " ", o += `[${s}]${r.msg?.toString ? r.msg.toString() : r.msg}[/${s}]`, e.push(o);
      }
      C.logs = C.logs.filter((r) => P.time() - r.time < (re.logTime || 4));
      let n = qe({ text: e.join(`
`), font: Tt, pos: b(t18, -t18), anchor: "botleft", size: 16, width: he() * 0.6, lineSpacing: t18 / 2, fixed: true, styles: { time: { color: W(127, 127, 127) }, info: { color: W(255, 255, 255) }, error: { color: W(255, 0, 127) } } });
      Ve({ width: n.width + t18 * 2, height: n.height + t18 * 2, anchor: "botleft", color: W(0, 0, 0), radius: 4, opacity: 0.8, fixed: true }), ze(n), ye();
    });
  }
  i(Qi, "drawDebug");
  function Ji() {
    let t18 = C.cam, e = w.fromAngle(ge(0, 360)).scale(t18.shake);
    t18.shake = Ce(t18.shake, 0, 5 * Se()), t18.transform = new fe().translate(Et()).scale(t18.scale).rotate(t18.angle).translate((t18.pos ?? Et()).scale(-1).add(e)), C.root.draw(), Ee();
  }
  i(Ji, "drawFrame");
  function Zi() {
    let t18 = Le();
    C.events.numListeners("loading") > 0 ? C.events.trigger("loading", t18) : Ye(() => {
      let e = he() / 2, n = 24, r = b(he() / 2, be() / 2).sub(b(e / 2, n / 2));
      Ve({ pos: b(0), width: he(), height: be(), color: W(0, 0, 0) }), Ve({ pos: r, width: e, height: n, fill: false, outline: { width: 4 } }), Ve({ pos: r, width: e * t18, height: n });
    });
  }
  i(Zi, "drawLoadScreen");
  function _n(t18, e, n) {
    let r = O.ggl.gl;
    Ee(), r.clear(r.STENCIL_BUFFER_BIT), r.enable(r.STENCIL_TEST), r.stencilFunc(r.NEVER, 1, 255), r.stencilOp(r.REPLACE, r.REPLACE, r.REPLACE), e(), Ee(), r.stencilFunc(n, 1, 255), r.stencilOp(r.KEEP, r.KEEP, r.KEEP), t18(), Ee(), r.disable(r.STENCIL_TEST);
  }
  i(_n, "drawStenciled");
  function es(t18, e) {
    let n = O.ggl.gl;
    _n(t18, e, n.EQUAL);
  }
  i(es, "drawMasked");
  function Rt(t18) {
    if (!t18.tex)
      throw new Error('drawTexture() requires property "tex".');
    let e = t18.quad ?? new $(0, 0, 1, 1), n = t18.tex.width * e.w, r = t18.tex.height * e.h, o = new w(1);
    if (t18.tiled) {
      let a = Ne(t18.anchor || dt2).add(new w(1, 1)).scale(0.5).scale(t18.width || n, t18.height || r), l = (t18.width || n) / n, u = (t18.height || r) / r, m = Math.floor(l), c = Math.floor(u), p = l - m, d = u - c, x = (m + p ? 1 : 0) * (c + d ? 1 : 0), f = new Array(x * 6), y = new Array(x * 4), v = 0, A = i((V, M2, G2, F, g) => {
        f[v * 6 + 0] = v * 4 + 0, f[v * 6 + 1] = v * 4 + 1, f[v * 6 + 2] = v * 4 + 3, f[v * 6 + 3] = v * 4 + 1, f[v * 6 + 4] = v * 4 + 2, f[v * 6 + 5] = v * 4 + 3, y[v * 4 + 0] = { pos: new w(V - a.x, M2 - a.y), uv: new w(g.x, g.y), color: t18.color || H.WHITE, opacity: t18.opacity || 1 }, y[v * 4 + 1] = { pos: new w(V + G2 - a.x, M2 - a.y), uv: new w(g.x + g.w, g.y), color: t18.color || H.WHITE, opacity: t18.opacity || 1 }, y[v * 4 + 2] = { pos: new w(V + G2 - a.x, M2 + F - a.y), uv: new w(g.x + g.w, g.y + g.h), color: t18.color || H.WHITE, opacity: t18.opacity || 1 }, y[v * 4 + 3] = { pos: new w(V - a.x, M2 + F - a.y), uv: new w(g.x, g.y + g.h), color: t18.color || H.WHITE, opacity: t18.opacity || 1 }, v++;
      }, "addQuad");
      for (let V = 0; V < c; V++) {
        for (let M2 = 0; M2 < m; M2++)
          A(M2 * n, V * r, n, r, e);
        p && A(m * n, V * r, n * p, r, new $(e.x, e.y, e.w * p, e.h));
      }
      if (d) {
        for (let V = 0; V < m; V++)
          A(V * n, c * r, n, r * d, new $(e.x, e.y, e.w, e.h * d));
        p && A(m * n, c * r, n * p, r * d, new $(e.x, e.y, e.w * p, e.h * d));
      }
      je(y, f, t18.fixed, t18.tex, t18.shader, t18.uniform ?? void 0);
    } else
      t18.width && t18.height ? (o.x = t18.width / n, o.y = t18.height / r) : t18.width ? (o.x = t18.width / n, o.y = o.x) : t18.height && (o.y = t18.height / r, o.x = o.y), ut(Object.assign({}, t18, { scale: o.scale(t18.scale || new w(1)), tex: t18.tex, quad: e, width: n, height: r }));
  }
  i(Rt, "drawTexture");
  function ts(t18) {
    if (!t18.sprite)
      throw new Error('drawSprite() requires property "sprite"');
    let e = It(t18.sprite);
    if (!e || !e.data)
      return;
    let n = e.data.frames[t18.frame ?? 0];
    if (!n)
      throw new Error(`Frame not found: ${t18.frame ?? 0}`);
    Rt(Object.assign({}, t18, { tex: e.data.tex, quad: n.scale(t18.quad ?? new $(0, 0, 1, 1)) }));
  }
  i(ts, "drawSprite");
  function ns(t18, e) {
    let n = O.ggl.gl;
    _n(t18, e, n.NOTEQUAL);
  }
  i(ns, "drawSubtracted");
  function _r(t18) {
    ze(qe(t18));
  }
  i(_r, "drawText");
  var rs = i((t18, e) => {
    let n = Ln(e, tn, nn), r = window.devicePixelRatio || window.devicePixelRatio, o = t18.scale ?? 1, { gl: s } = e, a = Me.fromImage(e, new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1)), l = t18.width && t18.height ? new at(e, t18.width * r * o, t18.height * r * o) : new at(e, s.drawingBufferWidth, s.drawingBufferHeight), u = null, m = 1;
    t18.background && (typeof t18.background == "string" ? u = W(t18.background) : (u = W(...t18.background), m = t18.background[3] ?? 1), s.clearColor(u.r / 255, u.g / 255, u.b / 255, m ?? 1)), s.enable(s.BLEND), s.blendFuncSeparate(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
    let c = new Kn(e, en, hi, fi), p = Me.fromImage(e, new ImageData(new Uint8ClampedArray([128, 128, 128, 255, 190, 190, 190, 255, 190, 190, 190, 255, 128, 128, 128, 255]), 2, 2), { wrap: "repeat", filter: "nearest" });
    return { lastDrawCalls: 0, ggl: e, defShader: n, defTex: a, frameBuffer: l, postShader: null, postShaderUniform: null, renderer: c, transform: new fe(), transformStack: [], bgTex: p, bgColor: u, bgAlpha: m, width: t18.width ?? s.drawingBufferWidth / r / o, height: t18.height ?? s.drawingBufferHeight / r / o, viewport: { x: 0, y: 0, width: s.drawingBufferWidth, height: s.drawingBufferHeight }, fixed: false };
  }, "initAppGfx");
  function Nn() {
    let t18 = We, e = O.ggl.gl.drawingBufferWidth / t18, n = O.ggl.gl.drawingBufferHeight / t18;
    if (re.letterbox) {
      if (!re.width || !re.height)
        throw new Error("Letterboxing requires width and height defined.");
      let r = e / n, o = re.width / re.height;
      if (r > o) {
        let s = n * o, a = (e - s) / 2;
        O.viewport = { x: a, y: 0, width: s, height: n };
      } else {
        let s = e / o, a = (n - s) / 2;
        O.viewport = { x: 0, y: a, width: e, height: s };
      }
      return;
    }
    if (re.stretch && (!re.width || !re.height))
      throw new Error("Stretching requires width and height defined.");
    O.viewport = { x: 0, y: 0, width: e, height: n };
  }
  i(Nn, "updateViewport");
  function ct(t18) {
    return t18.fixed ? true : t18.parent ? ct(t18.parent) : false;
  }
  i(ct, "isFixed");
  function Ke(t18) {
    return { color: t18.color, opacity: t18.opacity, anchor: t18.anchor, outline: t18.outline, shader: t18.shader, uniform: t18.uniform };
  }
  i(Ke, "getRenderProps");
  function os(t18, e = {}) {
    return { id: "circle", radius: t18, draw() {
      ft(Object.assign(Ke(this), { radius: this.radius, fill: e.fill }));
    }, renderArea() {
      return new ee(new w(this.anchor ? 0 : -this.radius), this.radius * 2, this.radius * 2);
    }, inspect() {
      return `radius: ${Math.ceil(this.radius)}`;
    } };
  }
  i(os, "circle");
  function Hn(...t18) {
    return { id: "color", color: W(...t18), inspect() {
      return `color: ${this.color.toString()}`;
    } };
  }
  i(Hn, "color");
  function is(t18) {
    return { add() {
      this.canvas = t18;
    } };
  }
  i(is, "drawon");
  function ss(t18 = 1) {
    let e, n = 0, r = false;
    return { require: ["opacity"], add() {
      e = this.opacity, this.opacity = 0;
    }, update() {
      r || (n += Se(), this.opacity = De(n, 0, t18, 0, e), n >= t18 && (this.opacity = e, r = true));
    } };
  }
  i(ss, "fadeIn");
  function as(t18 = "intersect") {
    return { id: "mask", mask: t18 };
  }
  i(as, "mask");
  function qn(t18) {
    return { id: "opacity", opacity: t18 ?? 1, fadeIn(e = 1, n = L.easings.linear) {
      return C.root.tween(0, this.opacity, e, (r) => this.opacity = r, n);
    }, fadeOut(e = 1, n = L.easings.linear) {
      return C.root.tween(this.opacity, 0, e, (r) => this.opacity = r, n);
    }, inspect() {
      return `opacity: ${Jt(this.opacity, 1)}`;
    } };
  }
  i(qn, "opacity");
  function us(t18 = 1, e = W(0, 0, 0), n = 1, r = "miter", o = 10, s = "butt") {
    return { id: "outline", outline: { width: t18, color: e, opacity: n, join: r, miterLimit: o, cap: s }, inspect() {
      return `outline: ${this.outline.width}px, ${this.outline.color}`;
    } };
  }
  i(us, "outline");
  var Nr = class {
    static {
      i(this, "Particle");
    }
    pos = b(0);
    vel = b(0);
    acc = b(0);
    angle = 0;
    angularVelocity = 0;
    damping = 0;
    t;
    lt = null;
    gc;
    constructor() {
      this.t = 0, this.gc = true;
    }
    get progress() {
      return this.lt ? this.t / this.lt : this.t;
    }
  };
  function cs(t18, e) {
    let n = e.lifetime, r = [], o = t18.colors || [H.WHITE], s = t18.opacities || [1], a = t18.quads || [new $(0, 0, 1, 1)], l = t18.scales || [1], u = t18.lifeTime, m = e.direction, c = e.spread, p = t18.speed || [0, 0], d = t18.angle || [0, 0], x = t18.angularVelocity || [0, 0], f = t18.acceleration || [b(0), b(0)], y = t18.damping || [0, 0], v = [], A = new Array(t18.max), V = 0, M2 = 0;
    for (let g = 0; g < t18.max; g++) {
      v[g * 6 + 0] = g * 4 + 0, v[g * 6 + 1] = g * 4 + 1, v[g * 6 + 2] = g * 4 + 3, v[g * 6 + 3] = g * 4 + 1, v[g * 6 + 4] = g * 4 + 2, v[g * 6 + 5] = g * 4 + 3;
      for (let T = 0; T < 4; T++)
        A[g * 4 + T] = { pos: new w(0, 0), uv: new w(0, 0), color: W(255, 255, 255), opacity: 1 };
      r[g] = new Nr();
    }
    let G2 = new le();
    function F(g = 0) {
      for (; g < t18.max; ) {
        if (r[g].gc)
          return g;
        g++;
      }
      return null;
    }
    return i(F, "nextFree"), { id: "particles", emit(g) {
      let T = 0;
      for (let S = 0; S < g; S++) {
        if (T = F(T), T == null)
          return;
        let D = ge(m - c, m + c), B = w.fromAngle(D).scale(ge(p[0], p[1])), K2 = ge(d[0], d[1]), k2 = ge(x[0], x[1]), z3 = b(ge(f[0].x, f[1].x), ge(f[0].y, f[1].y)), X = ge(y[0], y[1]), te = u ? ge(u[0], u[1]) : null, Q = e.shape ? e.shape.random() : b(), q = r[T];
        q.lt = te, q.pos = Q, q.vel = B, q.acc = z3, q.angle = K2, q.angularVelocity = k2, q.damping = X, q.angularVelocity = k2, q.gc = false;
      }
      V += g;
    }, update() {
      if (n !== void 0 && n <= 0)
        return;
      let g = Se();
      for (let T of r)
        if (!T.gc) {
          if (T.t += g, T.lt && T.t >= T.lt) {
            T.gc = true, V--;
            continue;
          }
          T.vel = T.vel.add(T.acc.scale(g)).scale(1 - T.damping * g), T.pos = T.pos.add(T.vel.scale(g)), T.angle += T.angularVelocity * g;
        }
      for (n !== void 0 && (n -= g, n <= 0 && G2.trigger()), M2 += g; V < t18.max && e.rate && M2 > e.rate; )
        this.emit(1), V++, M2 -= e.rate;
    }, draw() {
      if (!(n !== void 0 && n <= 0)) {
        for (let g = 0; g < r.length; g++) {
          let T = r[g];
          if (T.gc)
            continue;
          let S = T.progress, D = Math.floor(T.progress * o.length), B = D < o.length - 1 ? Ce(o[D], o[D + 1], De(S, D / o.length, (D + 1) / o.length, 0, 1)) : o[D], K2 = Math.floor(T.progress * s.length), k2 = K2 < s.length - 1 ? Ce(s[K2], s[K2 + 1], De(S, K2 / s.length, (K2 + 1) / s.length, 0, 1)) : s[K2], z3 = Math.floor(T.progress * a.length), X = a[z3], te = Math.floor(T.progress * l.length), Q = l[te], q = Math.cos(T.angle * Math.PI / 180), ae = Math.sin(T.angle * Math.PI / 180), U2 = (t18.texture ? t18.texture.width : 10) * X.w / 2, I = (t18.texture ? t18.texture.height : 10) * X.h / 2, Y = g * 4, j = A[Y];
          j.pos.x = T.pos.x + -U2 * Q * q - -I * Q * ae, j.pos.y = T.pos.y + -U2 * Q * ae + -I * Q * q, j.uv.x = X.x, j.uv.y = X.y, j.color.r = B.r, j.color.g = B.g, j.color.b = B.b, j.opacity = k2, j = A[Y + 1], j.pos.x = T.pos.x + U2 * Q * q - -I * Q * ae, j.pos.y = T.pos.y + U2 * Q * ae + -I * Q * q, j.uv.x = X.x + X.w, j.uv.y = X.y, j.color.r = B.r, j.color.g = B.g, j.color.b = B.b, j.opacity = k2, j = A[Y + 2], j.pos.x = T.pos.x + U2 * Q * q - I * Q * ae, j.pos.y = T.pos.y + U2 * Q * ae + I * Q * q, j.uv.x = X.x + X.w, j.uv.y = X.y + X.h, j.color.r = B.r, j.color.g = B.g, j.color.b = B.b, j.opacity = k2, j = A[Y + 3], j.pos.x = T.pos.x + -U2 * Q * q - I * Q * ae, j.pos.y = T.pos.y + -U2 * Q * ae + I * Q * q, j.uv.x = X.x, j.uv.y = X.y + X.h, j.color.r = B.r, j.color.g = B.g, j.color.b = B.b, j.opacity = k2;
        }
        je(A, v, this.fixed, t18.texture, this.shader, this.uniform);
      }
    }, onEnd(g) {
      return G2.add(g);
    }, inspect() {
      return `count: ${V}/${t18.max}`;
    } };
  }
  i(cs, "particles");
  function ls(t18, e = {}) {
    if (t18.length < 3)
      throw new Error(`Polygon's need more than two points, ${t18.length} points provided`);
    return { id: "polygon", pts: t18, colors: e.colors, uv: e.uv, tex: e.tex, radius: e.radius, draw() {
      He(Object.assign(Ke(this), { pts: this.pts, colors: this.colors, uv: this.uv, tex: this.tex, radius: this.radius, fill: e.fill, triangulate: e.triangulate }));
    }, renderArea() {
      return new Ae(this.pts);
    }, inspect() {
      return `polygon: ${this.pts.map((n) => `[${n.x},${n.y}]`).join(",")}`;
    } };
  }
  i(ls, "polygon");
  function zn(t18, e, n) {
    let r;
    return C.root.get("area").forEach((s) => {
      if (n && n.some((u) => s.is(u)))
        return;
      let l = s.worldArea().raycast(t18, e);
      l && (r ? l.fraction < r.fraction && (r = l, r.object = s) : (r = l, r.object = s));
    }), r;
  }
  i(zn, "raycast");
  function Yn(t18, e, n = {}) {
    return { id: "rect", width: t18, height: e, radius: n.radius || 0, draw() {
      Ve(Object.assign(Ke(this), { width: this.width, height: this.height, radius: this.radius, fill: n.fill }));
    }, renderArea() {
      return new ee(b(0), this.width, this.height);
    }, inspect() {
      return `rect: (${Math.ceil(this.width)}w, ${Math.ceil(this.height)}h)`;
    } };
  }
  i(Yn, "rect");
  function ms(t18, e) {
    return { id: "shader", shader: t18, ...typeof e == "function" ? { uniform: e(), update() {
      this.uniform = e();
    } } : { uniform: e }, inspect() {
      return `shader: ${t18}`;
    } };
  }
  i(ms, "shader");
  function ps(...t18) {
    return t18.length > 0 && (C.cam.pos = b(...t18)), C.cam.pos ? C.cam.pos.clone() : Et();
  }
  i(ps, "camPos");
  function ds(...t18) {
    return t18.length > 0 && (C.cam.scale = b(...t18)), C.cam.scale.clone();
  }
  i(ds, "camScale");
  function hs(t18) {
    return t18 !== void 0 && (C.cam.angle = t18), C.cam.angle;
  }
  i(hs, "camRot");
  function fs(t18 = W(255, 255, 255), e = 1) {
    let n = C.root.add([Yn(he(), be()), Hn(t18), qn(1), $n()]), r = n.fadeOut(e);
    return r.onEnd(() => Wn(n)), r;
  }
  i(fs, "camFlash");
  function gs() {
    return C.cam.transform.clone();
  }
  i(gs, "camTransform");
  function bs(t18 = 12) {
    C.cam.shake += t18;
  }
  i(bs, "shake");
  function ys(t18) {
    return C.cam.transform.multVec2(t18);
  }
  i(ys, "toScreen");
  function xs(t18) {
    return C.cam.transform.invert().multVec2(t18);
  }
  i(xs, "toWorld");
  function vs(t18, e) {
    if (!e.tileWidth || !e.tileHeight)
      throw new Error("Must provide tileWidth and tileHeight.");
    let n = C.root.add([Gt(e.pos ?? b(0))]), r = t18.length, o = 0, s = null, a = null, l = null, u = null, m = i((g) => g.x + g.y * o, "tile2Hash"), c = i((g) => b(Math.floor(g % o), Math.floor(g / o)), "hash2Tile"), p = i(() => {
      s = [];
      for (let g of n.children)
        d(g);
    }, "createSpatialMap"), d = i((g) => {
      let T = m(g.tilePos);
      s[T] ? s[T].push(g) : s[T] = [g];
    }, "insertIntoSpatialMap"), x = i((g) => {
      let T = m(g.tilePos);
      if (s[T]) {
        let S = s[T].indexOf(g);
        S >= 0 && s[T].splice(S, 1);
      }
    }, "removeFromSpatialMap"), f = i(() => {
      let g = false;
      for (let T of n.children) {
        let S = n.pos2Tile(T.pos);
        (T.tilePos.x != S.x || T.tilePos.y != S.y) && (g = true, x(T), T.tilePos.x = S.x, T.tilePos.y = S.y, d(T));
      }
      g && n.trigger("spatialMapChanged");
    }, "updateSpatialMap"), y = i(() => {
      let g = n.getSpatialMap(), T = n.numRows() * n.numColumns();
      a ? a.length = T : a = new Array(T), a.fill(1, 0, T);
      for (let S = 0; S < g.length; S++) {
        let D = g[S];
        if (D) {
          let B = 0;
          for (let K2 of D)
            if (K2.isObstacle) {
              B = 1 / 0;
              break;
            } else
              B += K2.cost;
          a[S] = B || 1;
        }
      }
    }, "createCostMap"), v = i(() => {
      let g = n.getSpatialMap(), T = n.numRows() * n.numColumns();
      l ? l.length = T : l = new Array(T), l.fill(15, 0, T);
      for (let S = 0; S < g.length; S++) {
        let D = g[S];
        if (D) {
          let B = D.length, K2 = 15;
          for (let k2 = 0; k2 < B; k2++)
            K2 |= D[k2].edgeMask;
          l[S] = K2;
        }
      }
    }, "createEdgeMap"), A = i(() => {
      let g = n.numRows() * n.numColumns(), T = i((D, B) => {
        let K2 = [];
        for (K2.push(D); K2.length > 0; ) {
          let k2 = K2.pop();
          G2(k2).forEach((z3) => {
            u[z3] < 0 && (u[z3] = B, K2.push(z3));
          });
        }
      }, "traverse");
      u ? u.length = g : u = new Array(g), u.fill(-1, 0, g);
      let S = 0;
      for (let D = 0; D < a.length; D++) {
        if (u[D] >= 0) {
          S++;
          continue;
        }
        T(D, S), S++;
      }
    }, "createConnectivityMap"), V = i((g, T) => a[T], "getCost"), M2 = i((g, T) => {
      let S = c(g), D = c(T);
      return S.dist(D);
    }, "getHeuristic"), G2 = i((g, T) => {
      let S = [], D = Math.floor(g % o), B = D > 0 && l[g] & 1 && a[g - 1] !== 1 / 0, K2 = g >= o && l[g] & 2 && a[g - o] !== 1 / 0, k2 = D < o - 1 && l[g] & 4 && a[g + 1] !== 1 / 0, z3 = g < o * r - o - 1 && l[g] & 8 && a[g + o] !== 1 / 0;
      return T ? (B && (K2 && S.push(g - o - 1), S.push(g - 1), z3 && S.push(g + o - 1)), K2 && S.push(g - o), k2 && (K2 && S.push(g - o + 1), S.push(g + 1), z3 && S.push(g + o + 1)), z3 && S.push(g + o)) : (B && S.push(g - 1), K2 && S.push(g - o), k2 && S.push(g + 1), z3 && S.push(g + o)), S;
    }, "getNeighbours"), F = { id: "level", tileWidth() {
      return e.tileWidth;
    }, tileHeight() {
      return e.tileHeight;
    }, spawn(g, ...T) {
      let S = b(...T), D = (() => {
        if (typeof g == "string") {
          if (e.tiles[g]) {
            if (typeof e.tiles[g] != "function")
              throw new Error("Level symbol def must be a function returning a component list");
            return e.tiles[g](S);
          } else if (e.wildcardTile)
            return e.wildcardTile(g, S);
        } else {
          if (Array.isArray(g))
            return g;
          throw new Error("Expected a symbol or a component list");
        }
      })();
      if (!D)
        return null;
      let B = false, K2 = false;
      for (let z3 of D)
        z3.id === "tile" && (K2 = true), z3.id === "pos" && (B = true);
      B || D.push(Gt()), K2 || D.push(Xn());
      let k2 = n.add(D);
      return B && (k2.tilePosOffset = k2.pos.clone()), k2.tilePos = S, s && (d(k2), this.trigger("spatialMapChanged"), this.trigger("navigationMapInvalid")), k2;
    }, numColumns() {
      return o;
    }, numRows() {
      return r;
    }, levelWidth() {
      return o * this.tileWidth();
    }, levelHeight() {
      return r * this.tileHeight();
    }, tile2Pos(...g) {
      return b(...g).scale(this.tileWidth(), this.tileHeight());
    }, pos2Tile(...g) {
      let T = b(...g);
      return b(Math.floor(T.x / this.tileWidth()), Math.floor(T.y / this.tileHeight()));
    }, getSpatialMap() {
      return s || p(), s;
    }, onSpatialMapChanged(g) {
      return this.on("spatialMapChanged", g);
    }, onNavigationMapInvalid(g) {
      return this.on("navigationMapInvalid", g);
    }, getAt(g) {
      s || p();
      let T = m(g);
      return s[T] || [];
    }, raycast(g, T) {
      let S = g.scale(1 / this.tileWidth(), 1 / this.tileHeight()), D = Co(S, T, (B) => {
        let K2 = this.getAt(B);
        if (K2.some((z3) => z3.isObstacle))
          return true;
        let k2 = null;
        for (let z3 of K2)
          if (z3.is("area")) {
            let te = z3.worldArea().raycast(g, T);
            te && (k2 ? te.fraction < k2.fraction && (k2 = te, k2.object = z3) : (k2 = te, k2.object = z3));
          }
        return k2 || false;
      }, 64);
      return D && (D.point = D.point.scale(this.tileWidth(), this.tileHeight())), D;
    }, update() {
      s && f();
    }, invalidateNavigationMap() {
      a = null, l = null, u = null;
    }, onNavigationMapChanged(g) {
      return this.on("navigationMapChanged", g);
    }, getTilePath(g, T, S = {}) {
      if (a || y(), l || v(), u || A(), g.x < 0 || g.x >= o || g.y < 0 || g.y >= r || T.x < 0 || T.x >= o || T.y < 0 || T.y >= r)
        return null;
      let D = m(g), B = m(T);
      if (a[B] === 1 / 0)
        return null;
      if (D === B)
        return [];
      if (u[D] != -1 && u[D] !== u[B])
        return null;
      let K2 = new Ft((q, ae) => q.cost < ae.cost);
      K2.insert({ cost: 0, node: D });
      let k2 = /* @__PURE__ */ new Map();
      k2.set(D, D);
      let z3 = /* @__PURE__ */ new Map();
      for (z3.set(D, 0); K2.length !== 0; ) {
        let q = K2.remove()?.node;
        if (q === B)
          break;
        let ae = G2(q, S.allowDiagonals);
        for (let U2 of ae) {
          let I = (z3.get(q) || 0) + V(q, U2) + M2(U2, B);
          (!z3.has(U2) || I < z3.get(U2)) && (z3.set(U2, I), K2.insert({ cost: I, node: U2 }), k2.set(U2, q));
        }
      }
      let X = [], te = B, Q = c(te);
      for (X.push(Q); te !== D; ) {
        let q = k2.get(te);
        if (!q)
          throw new Error("Bug in pathfinding algorithm");
        te = q;
        let ae = c(te);
        X.push(ae);
      }
      return X.reverse();
    }, getPath(g, T, S = {}) {
      let D = this.tileWidth(), B = this.tileHeight(), K2 = this.getTilePath(this.pos2Tile(g), this.pos2Tile(T), S);
      return K2 ? [g, ...K2.slice(1, -1).map((k2) => k2.scale(D, B).add(D / 2, B / 2)), T] : null;
    } };
    return n.use(F), n.onNavigationMapInvalid(() => {
      n.invalidateNavigationMap(), n.trigger("navigationMapChanged");
    }), t18.forEach((g, T) => {
      let S = g.split("");
      o = Math.max(S.length, o), S.forEach((D, B) => {
        n.spawn(D, b(B, T));
      });
    }), n;
  }
  i(vs, "addLevel");
  function et(t18, e, n) {
    return C.objEvents.registers[t18] || (C.objEvents.registers[t18] = new Qt()), C.objEvents.on(t18, (r, ...o) => {
      r.is(e) && n(r, ...o);
    });
  }
  i(et, "on");
  var ws = de((t18) => {
    let e = C.root.add([{ update: t18 }]);
    return { get paused() {
      return e.paused;
    }, set paused(n) {
      e.paused = n;
    }, cancel: i(() => e.destroy(), "cancel") };
  }, (t18, e) => et("fixedUpdate", t18, e));
  var Cs = de((t18) => {
    let e = C.root.add([{ update: t18 }]);
    return { get paused() {
      return e.paused;
    }, set paused(n) {
      e.paused = n;
    }, cancel: i(() => e.destroy(), "cancel") };
  }, (t18, e) => et("update", t18, e));
  var Es = de((t18) => {
    let e = C.root.add([{ draw: t18 }]);
    return { get paused() {
      return e.hidden;
    }, set paused(n) {
      e.hidden = n;
    }, cancel: i(() => e.destroy(), "cancel") };
  }, (t18, e) => et("draw", t18, e));
  var Hr = de((t18) => C.events.on("add", t18), (t18, e) => et("add", t18, e));
  var Ts = de((t18) => C.events.on("destroy", t18), (t18, e) => et("destroy", t18, e));
  function Os(t18, e, n) {
    return et("collide", t18, (r, o, s) => o.is(e) && n(r, o, s));
  }
  i(Os, "onCollide");
  function As(t18, e, n) {
    return et("collideUpdate", t18, (r, o, s) => o.is(e) && n(r, o, s));
  }
  i(As, "onCollideUpdate");
  function Ss(t18, e, n) {
    return et("collideEnd", t18, (r, o, s) => o.is(e) && n(r, o, s));
  }
  i(Ss, "onCollideEnd");
  function Qn(t18, e) {
    C.root.get(t18, { recursive: true }).forEach(e), Hr(t18, e);
  }
  i(Qn, "forAllCurrentAndFuture");
  var Vs = de((t18) => P.onMousePress(t18), (t18, e) => {
    let n = [];
    return Qn(t18, (r) => {
      if (!r.area)
        throw new Error("onClick() requires the object to have area() component");
      n.push(r.onClick(() => e(r)));
    }), Ze.join(n);
  });
  function Ps(t18, e) {
    let n = [];
    return Qn(t18, (r) => {
      if (!r.area)
        throw new Error("onHover() requires the object to have area() component");
      n.push(r.onHover(() => e(r)));
    }), Ze.join(n);
  }
  i(Ps, "onHover");
  function Rs(t18, e) {
    let n = [];
    return Qn(t18, (r) => {
      if (!r.area)
        throw new Error("onHoverUpdate() requires the object to have area() component");
      n.push(r.onHoverUpdate(() => e(r)));
    }), Ze.join(n);
  }
  i(Rs, "onHoverUpdate");
  function Gs(t18, e) {
    let n = [];
    return Qn(t18, (r) => {
      if (!r.area)
        throw new Error("onHoverEnd() requires the object to have area() component");
      n.push(r.onHoverEnd(() => e(r)));
    }), Ze.join(n);
  }
  i(Gs, "onHoverEnd");
  function Ds(t18) {
    C.events.on("loading", t18);
  }
  i(Ds, "onLoading");
  function Ms(t18) {
    P.onResize(t18);
  }
  i(Ms, "onResize");
  function Us(t18) {
    C.events.on("error", t18);
  }
  i(Us, "onError");
  function kt(t18) {
    _.loaded ? t18() : C.events.on("load", t18);
  }
  i(kt, "onLoad");
  function un(t18 = []) {
    let e = /* @__PURE__ */ new Map(), n = [], r = {}, o = new $e(), s = [], a = null, l = false, u = { id: Xo(), hidden: false, transform: new fe(), children: [], parent: null, set paused(c) {
      if (c !== l) {
        l = c;
        for (let p of s)
          p.paused = c;
      }
    }, get paused() {
      return l;
    }, get tags() {
      let c = [];
      for (let [p, d] of e.entries())
        Object.keys(d).length == 1 && c.push(p);
      return c;
    }, add(c) {
      let p = Array.isArray(c) ? un(c) : c;
      if (p.parent)
        throw new Error("Cannot add a game obj that already has a parent.");
      return p.parent = this, p.transform = Lt(p), this.children.push(p), p.trigger("add", p), C.events.trigger("add", p), p;
    }, readd(c) {
      let p = this.children.indexOf(c);
      return p !== -1 && (this.children.splice(p, 1), this.children.push(c)), c;
    }, remove(c) {
      let p = this.children.indexOf(c);
      if (p !== -1) {
        c.parent = null, this.children.splice(p, 1);
        let d = i((x) => {
          x.trigger("destroy"), C.events.trigger("destroy", x), x.children.forEach((f) => d(f));
        }, "trigger");
        d(c);
      }
    }, removeAll(c) {
      if (c)
        this.get(c).forEach((p) => this.remove(p));
      else
        for (let p of [...this.children])
          this.remove(p);
    }, fixedUpdate() {
      this.paused || (this.children.forEach((c) => c.fixedUpdate()), this.trigger("fixedUpdate"));
    }, update() {
      this.paused || (this.children.forEach((c) => c.update()), this.trigger("update"));
    }, draw() {
      if (this.hidden)
        return;
      this.canvas && (Ee(), this.canvas.bind());
      let c = O.fixed;
      this.fixed && (O.fixed = true), ve(), ne(this.pos), it(this.scale), Qe(this.angle);
      let p = this.children.sort((d, x) => {
        let f = d.layerIndex ?? C.defaultLayerIndex, y = x.layerIndex ?? C.defaultLayerIndex;
        return f - y || (d.z ?? 0) - (x.z ?? 0);
      });
      if (this.mask) {
        let d = { intersect: L.drawMasked, subtract: L.drawSubtracted }[this.mask];
        if (!d)
          throw new Error(`Invalid mask func: "${this.mask}"`);
        d(() => {
          p.forEach((x) => x.draw());
        }, () => {
          this.trigger("draw");
        });
      } else
        this.trigger("draw"), p.forEach((d) => d.draw());
      ye(), O.fixed = c, this.canvas && (Ee(), this.canvas.unbind());
    }, drawInspect() {
      this.hidden || (ve(), ne(this.pos), it(this.scale), Qe(this.angle), this.children.forEach((c) => c.drawInspect()), this.trigger("drawInspect"), ye());
    }, use(c) {
      if (!c)
        return;
      if (No(c) && (c = new c(this)), typeof c == "function")
        return this.use(c(this));
      if (typeof c == "string")
        return this.use({ id: c });
      let p = [];
      c.id ? (this.unuse(c.id), r[c.id] = [], p = r[c.id], e.set(c.id, c)) : n.push(c);
      for (let x in c) {
        if (yi.has(x))
          continue;
        let f = Object.getOwnPropertyDescriptor(c, x);
        if (f)
          if (typeof f.value == "function" && (c[x] = c[x].bind(this)), f.set && Object.defineProperty(c, x, { set: f.set.bind(this) }), f.get && Object.defineProperty(c, x, { get: f.get.bind(this) }), xi.has(x)) {
            let y = x === "add" ? () => {
              a = i((v) => p.push(v), "onCurCompCleanup"), c[x]?.(), a = null;
            } : c[x];
            p.push(this.on(x, y).cancel);
          } else if (this[x] === void 0)
            Object.defineProperty(this, x, { get: i(() => c[x], "get"), set: i((y) => c[x] = y, "set"), configurable: true, enumerable: true }), p.push(() => delete this[x]);
          else
            throw new Error(`Duplicate component property: "${x}"`);
      }
      let d = i(() => {
        if (c.require) {
          for (let x of c.require)
            if (!this.c(x))
              throw new Error(`Component "${c.id}" requires component "${x}"`);
        }
      }, "checkDeps");
      c.destroy && p.push(c.destroy.bind(this)), this.exists() ? (d(), c.add && (a = i((x) => p.push(x), "onCurCompCleanup"), c.add.call(this), a = null)) : c.require && p.push(this.on("add", d).cancel);
    }, unuse(c) {
      if (e.has(c)) {
        for (let p of e.values())
          if (p.require && p.require.includes(c))
            throw new Error(`Can't unuse. Component "${p.id}" requires component "${c}"`);
        e.delete(c);
      }
      r[c] && (r[c].forEach((p) => p()), delete r[c]);
    }, c(c) {
      return e.get(c) ?? null;
    }, get(c, p = {}) {
      let d = p.recursive ? this.children.flatMap(i(function x(f) {
        return [f, ...f.children.flatMap(x)];
      }, "recurse")) : this.children;
      if (d = d.filter((x) => c ? x.is(c) : true), p.liveUpdate) {
        let x = i((y) => p.recursive ? this.isAncestorOf(y) : y.parent === this, "isChild"), f = [];
        f.push(L.onAdd((y) => {
          x(y) && y.is(c) && d.push(y);
        })), f.push(L.onDestroy((y) => {
          if (x(y) && y.is(c)) {
            let v = d.findIndex((A) => A.id === y.id);
            v !== -1 && d.splice(v, 1);
          }
        })), this.onDestroy(() => {
          for (let y of f)
            y.cancel();
        });
      }
      return d;
    }, query(c) {
      let p = c.hierarchy || "children", d = c.include, x = c.exclude, f = [];
      switch (p) {
        case "children":
          f = this.children;
          break;
        case "siblings":
          f = this.parent ? this.parent.children.filter((v) => v !== this) : [];
          break;
        case "ancestors":
          let y = this.parent;
          for (; y; )
            f.push(y), y = y.parent;
          break;
        case "descendants":
          f = this.children.flatMap(i(function v(A) {
            return [A, ...A.children.flatMap(v)];
          }, "recurse"));
          break;
      }
      if (d && ((c.includeOp || "and") === "and" || !Array.isArray(c.include) ? f = f.filter((v) => v.is(d)) : f = f.filter((v) => c.include.some((A) => v.is(A)))), x && ((c.includeOp || "and") === "and" || !Array.isArray(c.include) ? f = f.filter((v) => !v.is(x)) : f = f.filter((v) => !c.exclude.some((A) => v.is(A)))), c.visible === true && (f = f.filter((y) => y.visible)), c.distance) {
        if (!this.pos)
          throw Error("Can't do a distance query from an object without pos");
        let y = c.distanceOp || "near", v = c.distance * c.distance;
        y === "near" ? f = f.filter((A) => A.pos && this.pos.sdist(A.pos) <= v) : f = f.filter((A) => A.pos && this.pos.sdist(A.pos) > v);
      }
      return c.name && (f = f.filter((y) => y.name === c.name)), f;
    }, isAncestorOf(c) {
      return c.parent ? c.parent === this || this.isAncestorOf(c.parent) : false;
    }, exists() {
      return C.root.isAncestorOf(this);
    }, is(c) {
      if (c === "*")
        return true;
      if (Array.isArray(c)) {
        for (let p of c)
          if (!this.c(p))
            return false;
        return true;
      } else
        return this.c(c) != null;
    }, on(c, p) {
      let d = o.on(c, p.bind(this));
      return a && a(() => d.cancel()), d;
    }, trigger(c, ...p) {
      o.trigger(c, ...p), C.objEvents.trigger(c, this, ...p);
    }, destroy() {
      this.parent && this.parent.remove(this);
    }, inspect() {
      let c = {};
      for (let [p, d] of e)
        c[p] = d.inspect?.() ?? null;
      for (let [p, d] of n.entries()) {
        if (d.inspect) {
          c[p] = d.inspect();
          continue;
        }
        for (let [x, f] of Object.entries(d))
          typeof f != "function" && (c[x] = `${x}: ${f}`);
      }
      return c;
    }, onAdd(c) {
      return this.on("add", c);
    }, onFixedUpdate(c) {
      return this.on("fixedUpdate", c);
    }, onUpdate(c) {
      return this.on("update", c);
    }, onDraw(c) {
      return this.on("draw", c);
    }, onDestroy(c) {
      return this.on("destroy", c);
    }, clearEvents() {
      o.clear();
    } }, m = ["onKeyPress", "onKeyPressRepeat", "onKeyDown", "onKeyRelease", "onMousePress", "onMouseDown", "onMouseRelease", "onMouseMove", "onCharInput", "onMouseMove", "onTouchStart", "onTouchMove", "onTouchEnd", "onScroll", "onGamepadButtonPress", "onGamepadButtonDown", "onGamepadButtonRelease", "onGamepadStick", "onButtonPress", "onButtonDown", "onButtonRelease"];
    for (let c of m)
      u[c] = (...p) => {
        let d = P[c]?.(...p);
        return s.push(d), u.onDestroy(() => d.cancel()), d;
      };
    for (let c of t18)
      u.use(c);
    return u;
  }
  i(un, "make");
  var Bs = i(() => ({ events: new $e(), objEvents: new $e(), root: un([]), gravity: null, scenes: {}, currentScene: null, layers: null, defaultLayerIndex: 0, logs: [], cam: { pos: null, scale: new w(1), angle: 0, shake: 0, transform: new fe() } }), "initGame");
  function Fs(t18) {
    C.gravity = t18 ? (C.gravity || b(0, 1)).unit().scale(t18) : null;
  }
  i(Fs, "setGravity");
  function Ls() {
    return C.gravity ? C.gravity.len() : 0;
  }
  i(Ls, "getGravity");
  function Is(t18) {
    C.gravity = t18.unit().scale(C.gravity ? C.gravity.len() : 1);
  }
  i(Is, "setGravityDirection");
  function qr() {
    return C.gravity ? C.gravity.unit() : b(0, 1);
  }
  i(qr, "getGravityDirection");
  var js = so("SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwPj4+Pj4+TExMTExZWVlZWVlnZ2dnZ3V1dXV1dYODg4ODkZGRkZGRn5+fn5+frKysrKy6urq6urrIyMjIyNbW1tbW1uTk5OTk8vLy8vLy//////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQKAAAAAAAAHjOZTf9/AAAAAAAAAAAAAAAAAAAAAP/7kGQAAANUMEoFPeACNQV40KEYABEY41g5vAAA9RjpZxRwAImU+W8eshaFpAQgALAAYALATx/nYDYCMJ0HITQYYA7AH4c7MoGsnCMU5pnW+OQnBcDrQ9Xx7w37/D+PimYavV8elKUpT5fqx5VjV6vZ38eJR48eRKa9KUp7v396UgPHkQwMAAAAAA//8MAOp39CECAAhlIEEIIECBAgTT1oj///tEQYT0wgEIYxgDC09aIiE7u7u7uIiIz+LtoIQGE/+XAGYLjpTAIOGYYy0ZACgDgSNFxC7YYiINocwERjAEDhIy0mRoGwAE7lOTBsGhj1qrXNCU9GrgwSPr80jj0dIpT9DRUNHKJbRxiWSiifVHuD2b0EbjLkOUzSXztP3uE1JpHzV6NPq+f3P5T0/f/lNH7lWTavQ5Xz1yLVe653///qf93B7f/vMdaKJAAJAMAIwIMAHMpzDkoYwD8CR717zVb8/p54P3MikXGCEWhQOEAOAdP6v8b8oNL/EzdnROC8Zo+z+71O8VVAGIKFEglKbidkoLam0mAFiwo0ZoVExf/7kmQLgAQyZFxvPWAENcVKXeK0ABAk2WFMaSNIzBMptBYfArbkZgpWjEQpcmjxQoG2qREWQcvpzuuIm29THt3ElhDNlrXV///XTGbm7Kbx0ymcRX///x7GVvquf5vk/dPs0Wi5Td1vggDxqbNII4bAPTU3Ix5h9FJTe7zv1LHG/uPsPrvth0ejchVzVT3giirs6sQAACgQAAIAdaXbRAYra/2t0//3HwqLKIlBOJhOg4BzAOkt+MOL6H8nlNvKyi3rOnqP//zf6AATwBAKIcHKixxwjl1TjDVIrvTqdmKQOFQBUBDwZ1EhHlDEGEVyGQWBAHrcJgRSXYbkvHK/8/6rbYjs4Qj0C8mRy2hwRv/82opGT55fROgRoBTjanaiQiMRHUu1/P3V9yGFffaVv78U1/6l/kpo0cz73vuSv/9GeaqDVRA5bWdHRKQKIEAAAAoIktKeEmdQFKN5sguv/ZSC0oxCAR7CzcJgEsd8cA0M/x0tzv15E7//5L5KCqoIAAmBFIKM1UxYtMMFjLKESTE8lhaelUyCBYeA2IN4rK1iDt//+5JkEgAkZzlVq29D8DJDWo0YLLARwPFZrL0PyLsUazTAlpI+hKSx01VSOfbjXg0iW9/jVPDleLJ15QQA4Okdc5ByMDFIeuCCE5CvevwBGH8YibiX9FtaIIgUikF42wrZw6ZJ6WlHrA+Ki5++NNMeYH1lEkwwJAIJB4ugVFguXFc20Vd/FLlvq1GSiSwAFABABABA47k6BFeNvxEQZO9v3L1IE4iEVElfrXmEmlyWIyGslFA55gH/sW7////o9AAFIBIIAAIUMzYTTNkgsAmYObfwQyzplrOmYvq0BKCKNN+nUTbvD7cJzvHxrEWG5QqvP8U1vFx6CwE8NoRc2ADBeEb/HoXh60N7ST8nw9QiiGoYvf/r6GtC9+vLwXHjaSkIp3iupC5+Nii81Zhu85pNYbFvrf+UFThDOYYY26off+W6b//73GTiN9xDfl0AAwBAiMBO8qsDBPOZtuT/dTbjVVbY/KSGH6ppHwKv/6X+s8gUCN/lODzv////GQAGAMQAADlXAUCBJiY0wFQZusYQOaQzaTwDBTcx0IvVp8m7uxKp//uSZBMCBHRI1eNPLHAyxNqWGeoYUIEnWYyxD8DUFSn0l6iojcd+oEOkzV6uWqyHNzjqmv+7V5xGUfY9yEmbziTzjRscm9OqFQp1PKFrqu3PX/7YuGtDU6bt0OUTpv38rdc+37dVDQLKUchaJ853E9edNDGqWwsYz1VoiSStEJtZvw6+sNqFWqaIXJjQCGAAGWAYVwmag/x3BRJw1wYF7IzVqDcNzn85d//FzK7IgwbQwccLoB4AsF8Nj/1ESRUAAVJwAFh0YOFEhmSJEHKQRDyhszgLUpHIgFrb5cySFg5jv10ImlYuvaaGBItfXqnNPmic+XNkmb5fW49vdhq97nQMQyGIlM2v8oQSrxKSxE4F1WqrduqvuJCRof1R7Gsre9KszUVF1/t3PzH2tnp+iSUG3rDwGNcDzxCGA8atuQF0paZAAkAhAQAEAC240yJV+nJgUrqq8axAYtVpYjZyFGb13/17jwiClQDaCdytZpyHHf1R/EG/+lUAgAAAChhmJvioVGGBCFgqdpsGAkUUrbTstwTCJgLQpFIsELW7t/68Iv/7kmQUgAQ9NFO9aeAAPAU6RKwUABClY2e5hoARGpDvPydCAsY8WO10fSvUOnfT98+n/l/6/+hxslhQ1DEOaevNKGocvIYba8WJpaP/15pX0NQ1DUNn/////k6lPp/N61rBi8RJFfERV3IgrqDsJA64sjCoKxDDQ9xEcWDpMBDwVFDIAEIAAzryxsjGi4q/oWpixKjhklAF4pUrDPjFhFVupDFZ/t/t0YPAygUBhADPR/KLCKJ8h2Oxhpxz/zNRAAFl0MAZLAYEAiVbEiz36LSgZ5QoQVat69KNy8FyM5Z80ACHAzgnISEkxUSJIDyBSwi5KF4mjBl4xJdbrG9ComLrL8YATiodhQKCkj6ROdyg1y5XmZlvMVmpJzYppJDwLi/Lp9vT3TfmimOGpuezi2U/9FNav0zX9Oja2r//8+hvuihuQAAMAVmqFgAgCcuboAEAAAUcqy8ca0BHBmwbFkED0CNA1YYDPkhcQrRJxcY3BzfxxltAz9vX62Xl3plAzWmRO+FkZyH///1qAAEjQBAACUpgU5o2AIBmFBGMamrGg0b/+5JkC4ADxyLWb2ngAEEkGofsoACP7U1JLaxTkOqFaKhspGgnW3SGC56ZgUJGCRnLOmIJAkuNBgvwU4Ocf8CJK9UsafH9/Frj///365XSoME+DZMw5UNjrMbVoeIj9EL91IuQ5KHyl5V2LCpdIdESgafOHxVGkAlkHuakmix/gN8+BP/sKguLAAoAtUjtvaoeEADwr3OK11E4KBlojgeQNQBJ4MvCAd/4t/xMMzeLhQGQ1//6tQu5BaBOGCT6U4aafvXZ//4iAPAAAAbLkgIlQmMSLA2H1CVNAlWwyVvKIQIxOSK1NWxs4MBUATlKrAkIMPAjCAdS6MVFzuURWa/+/qQWEGsA6EEpiBEJb9Q21lAHoBoD0B6aAPhyt+bG3muoXIN3RLadXxUfr/ohjGFF/p97eqNI5noKAqYLNPpUTDSI9/TmA6B+YAAADgA0Y4lxTW1SQfOQuDDDI0KTTuIrF5qoJrUFhUFAsg+AT2hbkaRZYGIjBKVDIa5VgNN/9P/rCDsBJbYJRKpCA1ArAkigIeYY61AjE+jubyiZFZ3+L789//uSZBCABHVj2entNmw1JXokLycYEFTFVa0wz4DYjKs08J2Q+r4n3lgbWaaMwMLEjFW88F39brqPF83cv1mCSJeY3Q2uiQxhBJxCBeR1D2LQRsYQcZUTzdNll8+OwZBsIwSgl45ymaHX603Mz7JmZuvt71GDTN66zev/+cLn/b5imV8pAHkg61FIJchBSG+zycgAZgADD6F1iQQRXRWmWS6bDIIgyBCZEcdl/KgXGmVKFv/vl8ry/5bLypf//U5jhYDhL9X/pAA0AKBIAAKgGtGXGGWJgEoF2JNsHlKfSKLRhGBAgIuWZKIJCFpF1VBhkB+EfzEyMUJdWuMrEZoPZ5BfF3/Nu62riIdjoO4AAKD2sTrDmpZZaYysf/810TitAVvn9xtFucieiaEy54YqiIO6RqkGAm5wVO0bFB0sDTdNxYGekKktR4KAAfAwUIgI8Ci6aXgtwbhPWAC+CKExAFydNtYGXNZoQjUsXv/9vKjgmdwieb+h7kHvPoc//0FaCACAATKFC4Y9ammklidbaiJNPBhGWTNhFSgdtalK12lpl//7kmQRAFN2NFI7TBvwNKNaTRsFGBWdfV2tPNcYvBHpgPKJsc8IUcTCxY3HSvUVNTWe/Z3YWlrJ0yrNRUiT19aprA7E+mPP+ZmC3/CsheOJXhc/9VJb3UZnphUBcqZUZQth1i3XqtPYu2Sy1s8DV9ZYACAAASAAHgFkQcOqgB5utFHFh3kSi4USs0yk4iOClREmjvdG+upaiLcRA6/9QGbOfxF/8sEAQAVG0G07YFMihKR4EXJCkRdX9isueLqUMRAQdhDZmv3KeR0nPqRVrZmSIXDt+BBSR7qqbKQcB98W9qiMb55preHIStxFWPE4lAyI+BKz2iSxonpvMR5DgKxTH6vGGXAbYCaAnJUW4W07EesQqbfqdbo4qNnPxSpn1H8eahszc/y9//dn1V7D/OYpn1szQKAPXTMlO/rO//u7JriJXbld7aP33v6RXYg/COIDzTWkTspg6Ay1YaDSwKxrP/LfIikHjmO871POf/kEAseAgoPEi9/0ZziNwfxVKy9qAEGEEAAq1EcOamDEGHAA0iao8k31rz2MiLNEik6VQ37/+5JkEAgEYU5WU0M3MDjDe0o9IjiOzSVM7aCzEM2GqXD8pFB0zxMcHCQNHtZD+R+pMWZxOJ/otEZTvVN/MeU12xTVcL+f2YaiNJTVoPd6SvzEnKel5GXOzEaazgdChnP2jOAwpfyRpVlQwoJBwpN1L1DL////6TVWcoepf7CVWrpEWiym5lR5U0BSMlxQC4qByOyQIAEuJfIriWixDqRgMfVZWuvRowjR9BzP5lZlT/+YG50CsSBG////////liXDQVMxEaBkbzKAAACnDIAstY7iK7gGSF7SIDexaTtPOHABk9YcmJEACmo50pgWal22etroBpYoVqtU6OPqvlf0c4QCAfLk9P/FJs4KCQMf6ECZyA6BwqqyJ0rMYj56k1/UlTIx1V3Rt5NF71D4qlptDC8VMgQVHFDlQnDFi06qQgKQAAIK4TxxJGFGYJuZNGXRdpq7IW/DYpPIQRFJLAc+qn1E0XYdOkQVJT+z8Lvff//8vbKAWTIBBUUdM6cOhlDry7x4dAkJXIBhbO3HSMMMGBQ9K9/JNfu09PjTO64wYEcR//uSZBeABP5g11NPRVwzQ4r8PMJVj7j9UU2wUwDPjeq0Z5w675D9+uDdL2QsuIry2lZtwn/pJYyRRjANEOQxNWw8mU7Tq+vueV7JrX/Pg7VIkEuZT5dwd85MVoq5lpStNICkBAcFR88//58KO8Zjt2PIGxWl1cVfXeNGH18SReNT//hYliWtQuNluxyxONbm4U+lpkAgpyE7yAIYUjIaqHmARJ0GQTtmH60xdwFp/u253XBCxD0f/lBcguCALn//Y5nqEv//1h4BAAwgAA5gcHmpIplgeW9fAOM6RFZUywrsGAiRmKkanQnCFBjYoPDS7bjwtPTkVI8D/P8VVLcTUz65n7PW2s3tNYHgEul4tBaIz0A9RgJAyAMI4/i0fpQKjhX9S+qIa0vmc4CZit/0/3UTDGeKNpkk0nu2rUE2ag8WErhE/kgAiQCJKQEYBA5Wn6CxHoIUh6dQ46nLIuwFk4S/LaDQxXu7Yf/pf//lwJB0S/Ff/4C///EiBEiAAAIAMnpngiIABAdMpKigkXaUwhLEGvpiofmXW57h2XAZO3CMRv/7kmQUAEOHQlHraRTQMkQp6GWFZBTVU1lNPTPYyIyocYeUoNgLBWAs1jPkTv/tXBaeZ/tbD/nAGP8/xT0SNEi5zof0KIVEzVe9r5lZOol7kyaXMYS4J/ZS3djp//UaeVyR0mUMlTgfz8XqMzIEgAQQ6UNQ1DSE0/C16OvyaocF4ijAGFci0FSYqCUSaWs6t9F6/699DKvMgMoK1//kSbvxtyBN27I7mdXgNMAW75sRU1UwUHYG5axI2tFIFpkgx7nnK+1JmRKjqeAd5Ph0QAL4QAnirmiPlg0yBDlrb/d3ngtA65rb999+8vdDCfnJuJAYIl285zklpVbrKpk1PEzrOY9NZUgyz6OiOsKt5qG/g2ibxSZ+/eTI/NB8n4ev//n2nIw85GAdwuJL7kYnnAbpcf1RBKH6b2U4RWP8dmWH5snsAFYwADBgAopKdzFJq4Jlmotloh/m4QpTSvJRE3nYZHephoqBhVf+P7vQ9BPlwZCP+3//+hdy5uUwS3LDEgQx4cdIgvDEBR1YqymCsSbKzRy2aQmSv+AAcAgAkvzPfuX/+5JkFQAj6VFX00Zr5DllOhhgpn4MmSs+zSRRiO8U5tWklYgSLKfs+Xheb/+6WaAQCKTztNeJ382MUltZNnjSJoFrCqB6C4mFcwJpJD4Oc8dLDXMTh9k1/rmTopfzqv9AvHWfOuZJlEvHSVMjyjpkVucKSzxJVQBgAAIo8DGqRdYCXPckFYg+dH9A/qUyljrtpxH9RJX/Z3Vv6uFkPg4M2jf3CL09QrwOrMt69n//8UFEAAMHWdhg1CcjyVBwiArOYlDL5NPY6x8ZLFBCGi6SVTKX5nqdSEFjebnv2zHdt0dj6xvORsSFzwqRNTJSZIrrlpXcURNL9WW7krBgr5jPMaGcvJ5v0N1s19CV7+7fvQfjySX2QECWUgKgeJCIif4WRBZ/6archpDkzE7oWctK3zEHP9Smeai8oeHkM6AK7pGjtOgeFv40ugqNd+Iv///uAZAMgAAAUeSWhLPpdwk3iXpBw43hOVIp1gliUOSaeZcZeZhLAH9TtD56wUpBduzLF5v5qViTH6o+I0+8Z1asaLgKVAohlpB72DgAQBQxEd3g//uSZCiAA6k0UdMPQfA+xcnBYON8E3WDVU0w1ZjPDSmo8IniHAFDNnkXF3B94gicH5d8MFw+IHZwufxOf/8gsHw+XrD4Jn8T4RAyQiABNBQg/3giEWuZ42mVFB3kkXNjhqBg1CghEUbN3/7/KBhyqNueef/MIDBClP3YRnKLiIlEFzf//0g+4zKpRIKTpqQgUtnHGFw6RSLN421iGcYapqFxny/capK9r9v+2BSy/RU1yZxa2eGaWK07ijfcxeiO3iuHJvjbXzts+Ny+XyFnsne1h0qG4mAaN6xRGaLVxKPlrri0Bg9oXGyxcw8JRBPkUzC8v451vVd9liSX85JMrmkVNwxOCwUg298////7ks//L409/hwMRIozKiIckXtjzDaAMTBcAACAwLGargPSEgEJZN/EFjfF/VKgaMYKMbwtf/T0UCGGfjfOAZ2frCigYdwh/+sGlQBxhCAAAUHkDPqOdmmUdAVYl3IhrEfR8qZFjLYEPOyzVGvm6lNUJCk2PNazwFxaijk+ZEaiTehoJGuDh6zN/EVP8BCLD/88BoY7Xv/7kmQlgBNmMtNTL0FwOGZJ/WHiKAyhJU+soE3A3JnmAa2oaCIru/+RrEHMTphxQ0X/LzoVy4gKhYl6ZUlklW7CLRVoYmgABwCRMAAMA/poCiEEYLsBVodWcVZ18+CcAfH165U4Xgh7/X1/BAQF6GN/BwQ/+D9S9P6wII//CoANYFYCBAKlGQDKhVjjylKARw2mPAtp8JjcQHggQswVsOEKsF6AIBWvmpIFdSZvRVv/LHWEy0+txMxu+VK9gEqG5pWf6GNGU4UBVkfd+bsj/6lZE0fkOpAqAOvyUO9oo+IiEtcLKOGzhhSGa4MYINHWoQsFr8zzmow0tRILkqz5/+vFxl/oZX/+qGW//xiLjR3xcGn//0QLkTQJh1UA8MAQAEXC/YxODKTDUEhrASs1512GRp+dRFFdTWIRaOXrve1eNjTNpreqQYrC9NBlQc1f8YO2po8bnH6qffuRvU7taiNF3baokE0YpmjRCHRclWBb9NCHKHpERwHRG3pqgXklq4sBpLjGvmekg8Y7SjM1FZopIM8IhB6dtMr8aKsdovh4FW//+5JkQ4CjTDdSU0gtIDiE+YBrKgwNbSVJTCBPwN8N5ZW8NKDnhRB8AXCm//KAsBUCwKU//oJQnET+UP3/zpYRocAAABJkVzzIuoLGEaDoxfsNva12EUdxhJMGFQioSg8GxKsLm8kWEmExJuNidarkk+OTXc0i2OZEq2v+tZr/MDZRS0I7LfRpHdlsiF6m/mEjk+XlK10UqtKYUwNgMx24hUtCJLfpM3ExUeKDYjClgZAzAjQ0qlNQBTsGpk9zSRkCiKkRGp572VXsPYChGvxhAuYkDYZK//jSRgto2mTf6+PJqgAAgIAAAACYZE6aZOHhYkYlcbpeYQq1RgLO4U8TIlL1sGw+iKZi5Kzc/bKT0yXrIUMES89RCWy8oWlxqIQlKANLFpT/KjUrK+UCYbZqGnjVj29aO5dzofWAskRX5eJWPi4kf/aRVjy3Wlyg2AnMYIDSTLwZUTASIzflPWUwwlUnIFMnGiyABeaXJcN91PmQJCLzmvUJkFOHCrX/+6O///IHnT4tT9YYBoNMQ09GfKIErwdwChNz1Qy5+5S/wWeY//uSZF+C03UyT2tMO0A3RRkhY20KzQjDMszhA8DjlGOBp5y4ZCS3ica52GIGiryv7FAaSDVZSXKFTiir+GvGiuK4rjgwPVTddso+W/42a4ueJJHDYtfj6YoKknnjzRgKA0fBIRZOSsprJqnoNN73ps/Z9DVgbKNbMGmRzrYBMAZCPUANkAZQ0syAC2ubK1NF90+WoesBpnhY8qwVDkNb/5Uof6//418TgElCSgAIgyAAQBHEmiaQFPIRmfAMELffpo0IflyEuAAQnSnKvwTlVlnIgOAAGS3P3IydjXPSh/CaVRqpSNCjQqDvPM+fLcuN+WgqNix6CoHomUWTT86JjziRSZ3yjnq+dIldKPU11KUuf6wAASMAAJxE+MlyktgE9UGSxjEx6RR0v1s9bWZ+EJSrGtjqUIhklG3J8eLRn/2U/nv7f///+7/6gBQgEAMUijVMwweWWMyYM/PLXuc7DptIQmBARMRCxXjEIcTNDQgSSeHpUNXO7dRSOllJPvnY7yzaO1hmUjsKvHe99fOxrabMX7mGTi5tsNkZVZLndzxse//7kmR7ABM2O0pbKTvQN4NI+WGFPA2ZESs1pYAAvA0jVrJwAHfbr/c6//vW790dzX36QNBRlDv/6QQAU3V64yUgBEAYc/lI8e5bm+Z9+j+4aaj4tFrb//iker/4a12b/V//q//9v+7vAEAAAAMqZTGd5gL4f54o6ZebKNrR/zWVYUEVYVVv8BuAV2OUT+DUQgkJ8J1Ey4ZbFCiAwgwzMSdHV4jQR+OoPWEASaPkyYq+PsQFFJCsEEJtOiUjI/+GRhtC2DnizTMXATJig9Ey/kAJMrkHGYJ8gpLjmJOYoskpav+ShRJInyGGZVJMihDi6pIxRZJJel/8iZPkYiREnyKE0akTL5QNSqT5iiySS9Ja2SV//5ME0ak//+4KgAAABgQBAADAMDgYCAEgCteQ0fZH6+ICXA357+MPfhR/+ywRf/U///LVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JknQAFoWhGLm5gBClBmT3GiAAAAAGkHAAAIAAANIOAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
  var Ks = i(() => (() => {
    let e = new (window.AudioContext || window.webkitAudioContext)(), n = e.createGain();
    n.connect(e.destination);
    let r = new st(ri(e));
    return e.decodeAudioData(js.buffer.slice(0)).then((o) => {
      r.buf = o;
    }).catch((o) => {
      console.error("Failed to load burp: ", o);
    }), { ctx: e, masterNode: n, burpSnd: r };
  })(), "initAudio");
  function ks(t18, e = {}) {
    let n = new le(), r = new Audio(t18);
    oe.ctx.createMediaElementSource(r).connect(oe.masterNode);
    function s() {
      J.paused || P.isHidden() && !re.backgroundAudio || oe.ctx.resume();
    }
    i(s, "resumeAudioCtx");
    function a() {
      s(), r.play();
    }
    return i(a, "play"), e.paused || a(), r.onended = () => n.trigger(), { play() {
      a();
    }, seek(l) {
      r.currentTime = l;
    }, stop() {
      r.pause(), this.seek(0);
    }, set loop(l) {
      r.loop = l;
    }, get loop() {
      return r.loop;
    }, set paused(l) {
      l ? r.pause() : a();
    }, get paused() {
      return r.paused;
    }, time() {
      return r.currentTime;
    }, duration() {
      return r.duration;
    }, set volume(l) {
      r.volume = Be(l, 0, 1);
    }, get volume() {
      return r.volume;
    }, set speed(l) {
      r.playbackRate = Math.max(l, 0);
    }, get speed() {
      return r.playbackRate;
    }, set detune(l) {
    }, get detune() {
      return 0;
    }, onEnd(l) {
      return n.add(l);
    }, then(l) {
      return this.onEnd(l);
    } };
  }
  i(ks, "playMusic");
  function Jn(t18, e = {}) {
    if (typeof t18 == "string" && _.music[t18])
      return ks(_.music[t18], e);
    let n = oe.ctx, r = e.paused ?? false, o = n.createBufferSource(), s = new le(), a = n.createGain(), l = e.seek ?? 0, u = 0, m = 0, c = false;
    o.loop = !!e.loop, o.detune.value = e.detune ?? 0, o.playbackRate.value = e.speed ?? 1, o.connect(a), o.onended = () => {
      x() >= (o.buffer?.duration ?? Number.POSITIVE_INFINITY) && s.trigger();
    }, a.connect(oe.masterNode), a.gain.value = e.volume ?? 1;
    let p = i((y) => {
      o.buffer = y.buf, r || (u = n.currentTime, o.start(0, l), c = true);
    }, "start"), d = ki(t18);
    d instanceof me && d.onLoad(p);
    let x = i(() => {
      if (!o.buffer)
        return 0;
      let y = r ? m - u : n.currentTime - u, v = o.buffer.duration;
      return o.loop ? y % v : Math.min(y, v);
    }, "getTime"), f = i((y) => {
      let v = n.createBufferSource();
      return v.buffer = y.buffer, v.loop = y.loop, v.playbackRate.value = y.playbackRate.value, v.detune.value = y.detune.value, v.onended = y.onended, v.connect(a), v;
    }, "cloneNode");
    return { stop() {
      this.paused = true, this.seek(0);
    }, set paused(y) {
      if (r !== y)
        if (r = y, y)
          c && (o.stop(), c = false), m = n.currentTime;
        else {
          o = f(o);
          let v = m - u;
          o.start(0, v), c = true, u = n.currentTime - v, m = 0;
        }
    }, get paused() {
      return r;
    }, play(y = 0) {
      this.seek(y), this.paused = false;
    }, seek(y) {
      o.buffer?.duration && (y > o.buffer.duration || (r ? (o = f(o), u = m - y) : (o.stop(), o = f(o), u = n.currentTime - y, o.start(0, y), c = true, m = 0)));
    }, set speed(y) {
      o.playbackRate.value = y;
    }, get speed() {
      return o.playbackRate.value;
    }, set detune(y) {
      o.detune.value = y;
    }, get detune() {
      return o.detune.value;
    }, set volume(y) {
      a.gain.value = Math.max(y, 0);
    }, get volume() {
      return a.gain.value;
    }, set loop(y) {
      o.loop = y;
    }, get loop() {
      return o.loop;
    }, duration() {
      return o.buffer?.duration ?? 0;
    }, time() {
      return x() % this.duration();
    }, onEnd(y) {
      return s.add(y);
    }, then(y) {
      return this.onEnd(y);
    } };
  }
  i(Jn, "play");
  function Zn(t18) {
    return Jn(oe.burpSnd, t18);
  }
  i(Zn, "burp");
  function _s(t18) {
    return t18 !== void 0 && (oe.masterNode.gain.value = t18), oe.masterNode.gain.value;
  }
  i(_s, "volume");
  function er() {
    P.onHide(() => {
      re.backgroundAudio || oe.ctx.suspend();
    }), P.onShow(() => {
      !re.backgroundAudio && !J.paused && oe.ctx.resume();
    }), P.onResize(() => {
      if (P.isFullscreen())
        return;
      let t18 = re.width && re.height;
      t18 && !re.stretch && !re.letterbox || (xe.width = xe.offsetWidth * We, xe.height = xe.offsetHeight * We, Nn(), t18 || (O.frameBuffer.free(), O.frameBuffer = new at(O.ggl, O.ggl.gl.drawingBufferWidth, O.ggl.gl.drawingBufferHeight), O.width = O.ggl.gl.drawingBufferWidth / We / _t, O.height = O.ggl.gl.drawingBufferHeight / We / _t));
    }), re.debug !== false && (P.onKeyPress(re.debugKey ?? "f1", () => J.inspect = !J.inspect), P.onKeyPress("f2", () => J.clearLog()), P.onKeyPress("f8", () => J.paused = !J.paused), P.onKeyPress("f7", () => {
      J.timeScale = Jt(Be(J.timeScale - 0.2, 0, 2), 1);
    }), P.onKeyPress("f9", () => {
      J.timeScale = Jt(Be(J.timeScale + 0.2, 0, 2), 1);
    }), P.onKeyPress("f10", () => J.stepFrame())), re.burp && P.onKeyPress("b", () => Zn());
  }
  i(er, "initEvents");
  function Ns(t18, e = {}) {
    let n = C.root.add([Gt(t18), tr()]), r = (e.speed || 1) * 5, o = e.scale || 1;
    n.add([cn(Wr), Nt(0), ln("center"), zr(r, o), ...e.comps ?? []]);
    let s = n.add([cn(Yr), Nt(0), ln("center"), mn(), ...e.comps ?? []]);
    return s.wait(0.4 / r, () => s.use(zr(r, o))), s.onDestroy(() => n.destroy()), n;
  }
  i(Ns, "addKaboom");
  var Hs = i(function(t18, e) {
    if (C.layers)
      throw Error("Layers can only be assigned once.");
    let n = t18.indexOf(e);
    if (n == -1)
      throw Error("The default layer name should be present in the layers list.");
    C.layers = t18, C.defaultLayerIndex = n;
  }, "layers");
  function Wn(t18) {
    t18.destroy();
  }
  i(Wn, "destroy");
  function qs() {
    return C.root;
  }
  i(qs, "getTreeRoot");
  function zs(t18, e) {
    C.scenes[t18] = e;
  }
  i(zs, "scene");
  function Ys(t18, ...e) {
    if (!C.scenes[t18])
      throw new Error(`Scene not found: ${t18}`);
    C.events.onOnce("frameEnd", () => {
      C.events.trigger("sceneLeave", t18), P.events.clear(), C.events.clear(), C.objEvents.clear(), [...C.root.children].forEach((n) => {
        (!n.stay || n.scenesToStay && !n.scenesToStay.includes(t18)) && C.root.remove(n);
      }), C.root.clearEvents(), er(), C.cam = { pos: null, scale: b(1), angle: 0, shake: 0, transform: new fe() }, C.scenes[t18](...e);
    }), C.currentScene = t18;
  }
  i(Ys, "go");
  function Ws(t18) {
    return C.events.on("sceneLeave", t18);
  }
  i(Ws, "onSceneLeave");
  function $s() {
    return C.currentScene;
  }
  i($s, "getSceneName");
  function cn(t18, e = {}) {
    let n = null, r = null, o = null, s = new le();
    if (!t18)
      throw new Error("Please pass the resource name or data to sprite()");
    let a = i((u, m, c, p) => {
      let d = b(1, 1);
      return c && p ? (d.x = c / (u.width * m.w), d.y = p / (u.height * m.h)) : c ? (d.x = c / (u.width * m.w), d.y = d.x) : p && (d.y = p / (u.height * m.h), d.x = d.y), d;
    }, "calcTexScale"), l = i((u, m) => {
      if (!m)
        return;
      let c = m.frames[0].clone();
      e.quad && (c = c.scale(e.quad));
      let p = a(m.tex, c, e.width, e.height);
      u.width = m.tex.width * c.w * p.x, u.height = m.tex.height * c.h * p.y, e.anim && u.play(e.anim), n = m, s.trigger(n);
    }, "setSpriteData");
    return { id: "sprite", width: 0, height: 0, frame: e.frame || 0, quad: e.quad || new $(0, 0, 1, 1), animSpeed: e.animSpeed ?? 1, flipX: e.flipX ?? false, flipY: e.flipY ?? false, get sprite() {
      return t18.toString();
    }, set sprite(u) {
      let m = It(u);
      m && m.onLoad((c) => l(this, c));
    }, draw() {
      if (!n)
        return;
      let u = n.frames[this.frame ?? 0];
      if (!u)
        throw new Error(`Frame not found: ${this.frame ?? 0}`);
      if (n.slice9) {
        let { left: m, right: c, top: p, bottom: d } = n.slice9, x = n.tex.width * u.w, f = n.tex.height * u.h, y = this.width - m - c, v = this.height - p - d, A = m / x, V = c / x, M2 = 1 - A - V, G2 = p / f, F = d / f, g = 1 - G2 - F, T = [pe(0, 0, A, G2), pe(A, 0, M2, G2), pe(A + M2, 0, V, G2), pe(0, G2, A, g), pe(A, G2, M2, g), pe(A + M2, G2, V, g), pe(0, G2 + g, A, F), pe(A, G2 + g, M2, F), pe(A + M2, G2 + g, V, F), pe(0, 0, m, p), pe(m, 0, y, p), pe(m + y, 0, c, p), pe(0, p, m, v), pe(m, p, y, v), pe(m + y, p, c, v), pe(0, p + v, m, d), pe(m, p + v, y, d), pe(m + y, p + v, c, d)];
        for (let S = 0; S < 9; S++) {
          let D = T[S], B = T[S + 9];
          Rt(Object.assign(Ke(this), { pos: B.pos(), tex: n.tex, quad: u.scale(D), flipX: this.flipX, flipY: this.flipY, tiled: e.tiled, width: B.w, height: B.h }));
        }
      } else
        Rt(Object.assign(Ke(this), { tex: n.tex, quad: u.scale(this.quad ?? new $(0, 0, 1, 1)), flipX: this.flipX, flipY: this.flipY, tiled: e.tiled, width: this.width, height: this.height }));
    }, add() {
      let u = It(t18);
      u ? u.onLoad((m) => l(this, m)) : kt(() => l(this, It(t18).data));
    }, update() {
      if (!n || !r || o === null)
        return;
      let u = n.anims[r.name];
      if (typeof u == "number") {
        this.frame = u;
        return;
      }
      if (u.speed === 0)
        throw new Error("Sprite anim speed cannot be 0");
      r.timer += Se() * this.animSpeed, r.timer >= 1 / r.speed && (r.timer = 0, this.frame += o, (this.frame < Math.min(u.from, u.to) || this.frame > Math.max(u.from, u.to)) && (r.loop ? r.pingpong ? (this.frame -= o, o *= -1, this.frame += o) : this.frame = u.from : r.pingpong ? o === Math.sign(u.to - u.from) ? (this.frame = u.to, o *= -1, this.frame += o) : (this.frame = u.from, r.onEnd(), this.stop()) : (this.frame = u.to, r.onEnd(), this.stop())));
    }, play(u, m = {}) {
      if (!n) {
        s.add(() => this.play(u, m));
        return;
      }
      let c = n.anims[u];
      if (c === void 0)
        throw new Error(`Anim not found: ${u}`);
      r && this.stop(), r = typeof c == "number" ? { name: u, timer: 0, loop: false, pingpong: false, speed: 0, onEnd: i(() => {
      }, "onEnd") } : { name: u, timer: 0, loop: m.loop ?? c.loop ?? false, pingpong: m.pingpong ?? c.pingpong ?? false, speed: m.speed ?? c.speed ?? 10, onEnd: m.onEnd ?? (() => {
      }) }, o = typeof c == "number" ? null : c.from < c.to ? 1 : -1, this.frame = typeof c == "number" ? c : c.from, this.trigger("animStart", u);
    }, stop() {
      if (!r)
        return;
      let u = r.name;
      r = null, this.trigger("animEnd", u);
    }, numFrames() {
      return n?.frames.length ?? 0;
    }, getCurAnim() {
      return r;
    }, curAnim() {
      return r?.name;
    }, getAnim(u) {
      return n?.anims[u] ?? null;
    }, hasAnim(u) {
      return !!this.getAnim(u);
    }, onAnimEnd(u) {
      return this.on("animEnd", u);
    }, onAnimStart(u) {
      return this.on("animStart", u);
    }, renderArea() {
      return new ee(b(0), this.width, this.height);
    }, inspect() {
      return typeof t18 == "string" ? `sprite: "${t18}"` : null;
    } };
  }
  i(cn, "sprite");
  function Xs(t18, e = {}) {
    function n(o) {
      let s = qe(Object.assign(Ke(o), { text: o.text + "", size: o.textSize, font: o.font, width: e.width && o.width, align: o.align, letterSpacing: o.letterSpacing, lineSpacing: o.lineSpacing, transform: o.textTransform, styles: o.textStyles }));
      return e.width || (o.width = s.width / (o.scale?.x || 1)), o.height = s.height / (o.scale?.y || 1), s;
    }
    i(n, "update");
    let r = { id: "text", set text(o) {
      t18 = o, n(this);
    }, get text() {
      return t18;
    }, textSize: e.size ?? 36, font: e.font, width: e.width ?? 0, height: 0, align: e.align, lineSpacing: e.lineSpacing, letterSpacing: e.letterSpacing, textTransform: e.transform, textStyles: e.styles, add() {
      kt(() => n(this));
    }, draw() {
      ze(n(this));
    }, renderArea() {
      return new ee(b(0), this.width, this.height);
    } };
    return n(r), r;
  }
  i(Xs, "text");
  function Qs(t18, e) {
    return { id: "rect", width: t18, height: e, draw() {
      ut(Object.assign(Ke(this), { width: this.width, height: this.height }));
    }, renderArea() {
      return new ee(b(0), this.width, this.height);
    }, inspect() {
      return `uvquad: (${Math.ceil(this.width)}w, ${Math.ceil(this.height)})h`;
    } };
  }
  i(Qs, "uvquad");
  function Js(t18 = {}) {
    let e = null, n = null, r = null, o = null;
    return { id: "agent", require: ["pos", "tile"], agentSpeed: t18.speed ?? 100, allowDiagonals: t18.allowDiagonals ?? true, getDistanceToTarget() {
      return e ? this.pos.dist(e) : 0;
    }, getNextLocation() {
      return n && r ? n[r] : null;
    }, getPath() {
      return n ? n.slice() : null;
    }, getTarget() {
      return e;
    }, isNavigationFinished() {
      return n ? r === null : true;
    }, isTargetReachable() {
      return n !== null;
    }, isTargetReached() {
      return e ? this.pos.eq(e) : true;
    }, setTarget(s) {
      e = s, n = this.getLevel().getPath(this.pos, e, { allowDiagonals: this.allowDiagonals }), r = n ? 0 : null, n && r !== null ? (o || (o = this.getLevel().onNavigationMapChanged(() => {
        e && n && r !== null && (n = this.getLevel().getPath(this.pos, e, { allowDiagonals: this.allowDiagonals }), n ? (r = 0, this.trigger("navigationNext", this, n[r])) : (r = null, this.trigger("navigationEnded", this)));
      }), this.onDestroy(() => o?.cancel())), this.trigger("navigationStarted", this), this.trigger("navigationNext", this, n[r])) : this.trigger("navigationEnded", this);
    }, update() {
      if (e && n && r !== null) {
        if (this.pos.sdist(n[r]) < 2)
          if (r === n.length - 1) {
            this.pos = e.clone(), r = null, this.trigger("navigationEnded", this), this.trigger("targetReached", this);
            return;
          } else
            r++, this.trigger("navigationNext", this, n[r]);
        this.moveTo(n[r], this.agentSpeed);
      }
    }, onNavigationStarted(s) {
      return this.on("navigationStarted", s);
    }, onNavigationNext(s) {
      return this.on("navigationNext", s);
    }, onNavigationEnded(s) {
      return this.on("navigationEnded", s);
    }, onTargetReached(s) {
      return this.on("targetReached", s);
    }, inspect() {
      return "agent: " + JSON.stringify({ target: JSON.stringify(e), path: JSON.stringify(n) });
    } };
  }
  i(Js, "agent");
  function Zs(t18) {
    let e = t18.graph;
    return { id: "navigator", require: ["pos"], navigateTo(n) {
      return this.graph?.getWaypointPath(this.pos, n, t18.navigationOpt);
    }, get graph() {
      if (e)
        return e;
      let n = this.parent;
      for (; n; ) {
        if (n.is("navigatormap"))
          return n.graph;
        n = n.parent;
      }
    }, set graph(n) {
      e = n;
    } };
  }
  i(Zs, "navigation");
  function ea(t18 = {}) {
    let e = t18.waypoints, n = t18.speed || 100, r = t18.endBehavior || "stop", o = 0, s = e != null;
    return { id: "patrol", require: ["pos"], get patrolSpeed() {
      return n;
    }, set patrolSpeed(a) {
      n = a;
    }, get waypoints() {
      return e;
    }, set waypoints(a) {
      e = a, o = 0, s = false;
    }, get nextLocation() {
      return e ? e[o] : void 0;
    }, update() {
      let a = this.nextLocation;
      if (!(!e || !a || s) && (this.moveTo(a, n), this.pos.sdist(a) < 9))
        switch (r) {
          case "loop":
            o = (o + 1) % e.length;
            break;
          case "ping-pong":
            o = o + 1, o == e.length && (e.reverse(), o = 0);
            break;
          case "stop":
            o = Math.min(o + 1, e.length - 1), o == e.length - 1 && (s = true, this.trigger("patrolFinished"));
            break;
        }
    }, onPatrolFinished(a) {
      return this.on("patrolFinished", a);
    } };
  }
  i(ea, "patrol");
  function ta(t18, e = {}) {
    let n = typeof t18 == "function" ? t18 : () => C.root.query(t18), r = e.checkFrequency || 1, o = typeof e.direction == "number" ? w.fromAngle(e.direction) : e.direction, s = 0;
    return { id: "sentry", require: ["pos"], direction: typeof e.direction == "number" ? w.fromAngle(e.direction) : e.direction, spotted: [], set directionAngle(a) {
      this.direction = a !== void 0 ? w.fromAngle(a) : void 0;
    }, get directionAngle() {
      return this.direction ? this.direction.angle() : void 0;
    }, fieldOfView: e.fieldOfView || 200, isWithinFieldOfView(a, l, u) {
      let m = (typeof l == "number" ? w.fromAngle(l) : l) || o, c = u || e.fieldOfView;
      if (!m || !c || c >= 360)
        return true;
      let p = c / 2;
      return a.pos && m.angleBetween(a.pos.sub(this.pos)) <= p;
    }, hasLineOfSight(a) {
      let l = zn(this.pos, a.pos.sub(this.pos), e.raycastExclude);
      return l != null && l.object === a;
    }, update() {
      if (s += Se(), s > r) {
        s -= r;
        let a = n();
        if (a.length && o && this.fieldOfView && this.fieldOfView < 360) {
          let l = this.fieldOfView / 2;
          a = a.filter((u) => u.pos && o.angleBetween(u.pos.sub(this.pos)) <= l);
        }
        a.length && e.lineOfSight && (a = a.filter((l) => l.pos && this.hasLineOfSight(l))), a.length > 0 && (this.spotted = a, this.trigger("objectSpotted", a));
      }
    }, onObjectsSpotted(a) {
      return this.on("objectSpotted", a);
    } };
  }
  i(ta, "sentry");
  function Xn(t18 = {}) {
    let e = b(0), n = t18.isObstacle ?? false, r = t18.cost ?? 0, o = t18.edges ?? [], s = i(() => {
      let l = { left: 1, top: 2, right: 4, bottom: 8 };
      return o.map((u) => l[u] || 0).reduce((u, m) => u | m, 0);
    }, "getEdgeMask"), a = s();
    return { id: "tile", tilePosOffset: t18.offset ?? b(0), set tilePos(l) {
      let u = this.getLevel();
      e = l.clone(), this.pos = b(this.tilePos.x * u.tileWidth(), this.tilePos.y * u.tileHeight()).add(this.tilePosOffset);
    }, get tilePos() {
      return e;
    }, set isObstacle(l) {
      n !== l && (n = l, this.getLevel().invalidateNavigationMap());
    }, get isObstacle() {
      return n;
    }, set cost(l) {
      r !== l && (r = l, this.getLevel().invalidateNavigationMap());
    }, get cost() {
      return r;
    }, set edges(l) {
      o = l, a = s(), this.getLevel().invalidateNavigationMap();
    }, get edges() {
      return o;
    }, get edgeMask() {
      return a;
    }, getLevel() {
      return this.parent;
    }, moveLeft() {
      this.tilePos = this.tilePos.add(b(-1, 0));
    }, moveRight() {
      this.tilePos = this.tilePos.add(b(1, 0));
    }, moveUp() {
      this.tilePos = this.tilePos.add(b(0, -1));
    }, moveDown() {
      this.tilePos = this.tilePos.add(b(0, 1));
    } };
  }
  i(Xn, "tile");
  var pn = class {
    static {
      i(this, "AnimateChannel");
    }
    name;
    duration;
    loops;
    direction;
    easing;
    interpolation;
    isFinished;
    timing;
    easings;
    relative;
    constructor(e, n, r) {
      this.name = e, this.duration = n.duration, this.loops = n.loops || 0, this.direction = n.direction || "forward", this.easing = n.easing || ot.linear, this.interpolation = n.interpolation || "linear", this.isFinished = false, this.timing = n.timing, this.easings = n.easings, this.relative = r;
    }
    update(e, n) {
      return true;
    }
    getLowerKeyIndexAndRelativeTime(e, n, r) {
      let o = n - 1, s = e / this.duration;
      if (this.loops !== 0 && s >= this.loops)
        return [o, 0];
      let a = Math.trunc(s);
      if (s -= a, (this.direction == "reverse" || this.direction == "ping-pong" && a & 1) && (s = 1 - s), r) {
        let l = 0;
        for (; r[l + 1] !== void 0 && r[l + 1] < s; )
          l++;
        return l >= o ? [o, 0] : [l, (s - r[l]) / (r[l + 1] - r[l])];
      } else {
        let l = Math.floor((n - 1) * s);
        return [l, (s - l / o) * o];
      }
    }
    setValue(e, n, r) {
      if (this.relative)
        switch (n) {
          case "pos":
            e.pos = e.base.pos.add(r);
            break;
          case "angle":
            e.angle = e.base.angle + r;
            break;
          case "scale":
            e.scale = e.base.scale.scale(r);
            break;
          case "opacity":
            e.opacity = e.base.opacity * r;
            break;
          default:
            e[n] = r;
        }
      else
        e[n] = r;
    }
    serialize() {
      let e = { duration: this.duration, keys: [] };
      return this.loops && (e.loops = this.loops), this.direction !== "forward" && (e.direction = this.direction), this.easing != ot.linear && (e.easing = this.easing.name), this.interpolation !== "linear" && (e.interpolation = this.interpolation), this.timing && (e.timing = this.timing), this.easings && (e.easings = this.easings.map((n) => this.easing.name)), e;
    }
  };
  function na(t18, e) {
    return e.add(e.sub(t18));
  }
  i(na, "reflect");
  var $r = class extends pn {
    static {
      i(this, "AnimateChannelNumber");
    }
    keys;
    constructor(e, n, r, o) {
      super(e, r, o), this.keys = n;
    }
    update(e, n) {
      let [r, o] = this.getLowerKeyIndexAndRelativeTime(n, this.keys.length, this.timing);
      if (o == 0 || this.interpolation === "none")
        this.setValue(e, this.name, this.keys[r]);
      else {
        let s = this.easings ? this.easings[r] : this.easing;
        this.setValue(e, this.name, Ce(this.keys[r], this.keys[r + 1], s(o)));
      }
      return o == 1;
    }
    serialize() {
      return Object.assign(super.serialize(), { keys: this.keys });
    }
  };
  var Xr = class extends pn {
    static {
      i(this, "AnimateChannelVec2");
    }
    keys;
    curves;
    dcurves;
    constructor(e, n, r, o, s) {
      if (super(e, r, o), this.keys = n, this.interpolation === "spline") {
        this.curves = [], s && (this.dcurves = []);
        for (let a = 0; a < this.keys.length - 1; a++) {
          let l = this.keys[a], u = a + 1, m = this.keys[u], c = a > 0 ? this.keys[a - 1] : na(m, l), p = u < this.keys.length - 1 ? this.keys[u + 1] : na(l, m);
          this.curves.push(Bt(c, l, m, p)), s && this.dcurves?.push(Bt(c, l, m, p, Mo));
        }
      }
    }
    update(e, n) {
      let [r, o] = this.getLowerKeyIndexAndRelativeTime(n, this.keys.length, this.timing);
      if (o == 0 || this.interpolation === "none")
        this.setValue(e, this.name, this.keys[r]);
      else {
        let s = this.easings ? this.easings[r] : this.easing;
        switch (this.interpolation) {
          case "linear":
            this.setValue(e, this.name, this.keys[r].lerp(this.keys[r + 1], s(o)));
            break;
          case "slerp":
            this.setValue(e, this.name, this.keys[r].slerp(this.keys[r + 1], s(o)));
            break;
          case "spline":
            if (this.curves) {
              this.setValue(e, this.name, this.curves[r](s(o))), this.dcurves && this.setValue(e, "angle", this.dcurves[r](s(o)).angle());
              break;
            }
        }
      }
      return o == 1;
    }
    serialize() {
      return Object.assign(super.serialize(), { keys: this.keys.map((e) => [e.x, e.y]) });
    }
  };
  var Qr = class extends pn {
    static {
      i(this, "AnimateChannelColor");
    }
    keys;
    constructor(e, n, r, o) {
      super(e, r, o), this.keys = n;
    }
    update(e, n) {
      let [r, o] = this.getLowerKeyIndexAndRelativeTime(n, this.keys.length, this.timing);
      if (o == 0 || this.interpolation == "none")
        this.setValue(e, this.name, this.keys[r]);
      else {
        let s = this.easings ? this.easings[r] : this.easing;
        this.setValue(e, this.name, this.keys[r].lerp(this.keys[r + 1], s(o)));
      }
      return o == 1;
    }
    serialize() {
      return Object.assign(super.serialize(), { keys: this.keys });
    }
  };
  function ra(t18 = {}) {
    let e = [], n = 0, r = false;
    return { id: "animate", require: t18.followMotion ? ["rotate"] : void 0, base: { pos: b(0, 0), angle: 0, scale: b(1, 1), opacity: 1 }, add() {
      t18.relative && (this.is("pos") && (this.base.pos = this.pos.clone()), this.is("rotate") && (this.base.angle = this.angle), this.is("scale") && (this.base.scale = this.scale), this.is("opacity") && (this.base.opacity = this.opacity));
    }, update() {
      let o = true, s;
      n += Se();
      for (let a of e)
        s = a.update(this, n), s && !a.isFinished && (a.isFinished = true, this.trigger("animateChannelFinished", a.name)), o &&= s;
      o && !r && (r = true, this.trigger("animateFinished"));
    }, animate(o, s, a) {
      r = false, this.unanimate(o), typeof s[0] == "number" ? e.push(new $r(o, s, a, t18.relative || false)) : s[0] instanceof w ? e.push(new Xr(o, s, a, t18.relative || false, o === "pos" && (t18.followMotion || false))) : s[0] instanceof H && e.push(new Qr(o, s, a, t18.relative || false));
    }, unanimate(o) {
      let s = e.findIndex((a) => a.name === o);
      s >= 0 && e.splice(s, 1);
    }, unanimateAll() {
      e.splice(0, e.length);
    }, onAnimateFinished(o) {
      return this.on("animateFinished", o);
    }, onAnimateChannelFinished(o) {
      return this.on("animateChannelFinished", o);
    }, serializeAnimationChannels() {
      return e.reduce((o, s) => (o[s.name] = s.serialize(), o), {});
    }, serializeAnimationOptions() {
      let o = {};
      return t18.followMotion && (o.followMotion = true), t18.relative && (o.relative = true), o;
    } };
  }
  i(ra, "animate");
  function Jr(t18, e) {
    let n = { name: t18.name };
    return t18.is("animate") && (n.channels = t18.serializeAnimationChannels(), Object.assign(n, t18.serializeAnimationOptions())), t18.children.length > 0 && (n.children = t18.children.filter((r) => r.is("named")).map((r) => Jr(r, r.name))), n;
  }
  i(Jr, "serializeAnimation");
  function zr(t18 = 2, e = 1) {
    let n = 0;
    return { require: ["scale"], update() {
      let r = Math.sin(n * t18) * e;
      r < 0 && this.destroy(), this.scale = b(r), n += Se();
    } };
  }
  i(zr, "boom");
  function oa(t18, e) {
    if (t18 == null)
      throw new Error("health() requires the initial amount of hp");
    return { id: "health", hurt(n = 1) {
      this.setHP(t18 - n), this.trigger("hurt", n);
    }, heal(n = 1) {
      let r = t18;
      this.setHP(t18 + n), this.trigger("heal", t18 - r);
    }, hp() {
      return t18;
    }, maxHP() {
      return e ?? null;
    }, setMaxHP(n) {
      e = n;
    }, setHP(n) {
      t18 = e ? Math.min(e, n) : n, t18 <= 0 && this.trigger("death");
    }, onHurt(n) {
      return this.on("hurt", n);
    }, onHeal(n) {
      return this.on("heal", n);
    }, onDeath(n) {
      return this.on("death", n);
    }, inspect() {
      return `health: ${t18}`;
    } };
  }
  i(oa, "health");
  function ia(t18, e = {}) {
    if (t18 == null)
      throw new Error("lifespan() requires time");
    let n = e.fade ?? 0;
    return { id: "lifespan", require: ["opacity"], async add() {
      await C.root.wait(t18), this.opacity = this.opacity ?? 1, n > 0 && await C.root.tween(this.opacity, 0, n, (r) => this.opacity = r, ot.linear), this.destroy();
    } };
  }
  i(ia, "lifespan");
  function sa(t18) {
    return { id: "named", name: t18 };
  }
  i(sa, "named");
  function aa(t18, e, n) {
    if (!t18)
      throw new Error("state() requires an initial state");
    let r = {};
    function o(u) {
      r[u] || (r[u] = { enter: new le(), end: new le(), update: new le(), draw: new le() });
    }
    i(o, "initStateEvents");
    function s(u, m, c) {
      return o(m), r[m][u].add(c);
    }
    i(s, "on");
    function a(u, m, ...c) {
      o(m), r[m][u].trigger(...c);
    }
    i(a, "trigger");
    let l = false;
    return { id: "state", state: t18, enterState(u, ...m) {
      if (l = true, e && !e.includes(u))
        throw new Error(`State not found: ${u}`);
      let c = this.state;
      if (n) {
        if (!n?.[c])
          return;
        let p = typeof n[c] == "string" ? [n[c]] : n[c];
        if (!p.includes(u))
          throw new Error(`Cannot transition state from "${c}" to "${u}". Available transitions: ${p.map((d) => `"${d}"`).join(", ")}`);
      }
      a("end", c, ...m), this.state = u, a("enter", u, ...m), a("enter", `${c} -> ${u}`, ...m);
    }, onStateTransition(u, m, c) {
      return s("enter", `${u} -> ${m}`, c);
    }, onStateEnter(u, m) {
      return s("enter", u, m);
    }, onStateUpdate(u, m) {
      return s("update", u, m);
    }, onStateDraw(u, m) {
      return s("draw", u, m);
    }, onStateEnd(u, m) {
      return s("end", u, m);
    }, update() {
      l || (a("enter", t18), l = true), a("update", this.state);
    }, draw() {
      a("draw", this.state);
    }, inspect() {
      return `state: ${this.state}`;
    } };
  }
  i(aa, "state");
  function tr(t18) {
    return { id: "stay", stay: true, scenesToStay: t18 };
  }
  i(tr, "stay");
  function ua(t18 = true, e) {
    let n, r;
    return { id: "textInput", hasFocus: t18, require: ["text"], add() {
      n = L.onCharInput((o) => {
        this.hasFocus && (!e || this.text.length < e) && (L.isKeyDown("shift") ? this.text += o.toUpperCase() : this.text += o);
      }), r = L.onKeyPress("backspace", () => {
        this.hasFocus && (this.text = this.text.slice(0, -1));
      });
    }, destroy() {
      n.cancel(), r.cancel();
    } };
  }
  i(ua, "textInput");
  function mn() {
    return { id: "timer", wait(t18, e) {
      let n = [];
      e && n.push(e);
      let r = 0, o = this.onUpdate(() => {
        r += L.dt(), r >= t18 && (n.forEach((s) => s()), o.cancel());
      });
      return { get paused() {
        return o.paused;
      }, set paused(s) {
        o.paused = s;
      }, cancel: o.cancel, onEnd(s) {
        n.push(s);
      }, then(s) {
        return this.onEnd(s), this;
      } };
    }, loop(t18, e) {
      let n = null, r = i(() => {
        n = this.wait(t18, r), e();
      }, "newAction");
      return n = this.wait(0, r), { get paused() {
        return n?.paused ?? false;
      }, set paused(o) {
        n && (n.paused = o);
      }, cancel: i(() => n?.cancel(), "cancel") };
    }, tween(t18, e, n, r, o = ot.linear) {
      let s = 0, a = [], l = this.onUpdate(() => {
        s += L.dt();
        let u = Math.min(s / n, 1);
        r(Ce(t18, e, o(u))), u === 1 && (l.cancel(), r(e), a.forEach((m) => m()));
      });
      return { get paused() {
        return l.paused;
      }, set paused(u) {
        l.paused = u;
      }, onEnd(u) {
        a.push(u);
      }, then(u) {
        return this.onEnd(u), this;
      }, cancel() {
        l.cancel();
      }, finish() {
        l.cancel(), r(e), a.forEach((u) => u());
      } };
    } };
  }
  i(mn, "timer");
  var Zr = 0;
  function ca() {
    return Zr > 0;
  }
  i(ca, "usesArea");
  function la(t18 = {}) {
    let e = {}, n = /* @__PURE__ */ new Set();
    return { id: "area", collisionIgnore: t18.collisionIgnore ?? [], add() {
      Zr++, this.area.cursor && this.onHover(() => P.setCursor(this.area.cursor)), this.onCollideUpdate((r, o) => {
        if (!r.id)
          throw new Error("area() requires the object to have an id");
        e[r.id] || this.trigger("collide", r, o), o && (e[r.id] = o, n.add(r.id));
      });
    }, destroy() {
      Zr--;
    }, update() {
      for (let r in e)
        n.has(Number(r)) || (this.trigger("collideEnd", e[r].target), delete e[r]);
      n.clear();
    }, drawInspect() {
      let r = this.localArea();
      L.pushTransform(), L.pushScale(this.area.scale), L.pushTranslate(this.area.offset);
      let o = { outline: { width: 4 / Mn(), color: W(0, 0, 255) }, anchor: this.anchor, fill: false, fixed: ct(this) };
      r instanceof L.Rect ? L.drawRect({ ...o, pos: r.pos, width: r.width, height: r.height }) : r instanceof L.Polygon ? L.drawPolygon({ ...o, pts: r.pts }) : r instanceof L.Circle && L.drawCircle({ ...o, pos: r.center, radius: r.radius }), L.popTransform();
    }, area: { shape: t18.shape ?? null, scale: t18.scale ? b(t18.scale) : b(1), offset: t18.offset ?? b(0), cursor: t18.cursor ?? null }, isClicked() {
      return P.isMousePressed() && this.isHovering();
    }, isHovering() {
      let r = ct(this) ? L.mousePos() : L.toWorld(L.mousePos());
      return this.hasPoint(r);
    }, checkCollision(r) {
      if (!r.id)
        throw new Error("checkCollision() requires the object to have an id");
      return e[r.id] ?? null;
    }, getCollisions() {
      return Object.values(e);
    }, isColliding(r) {
      if (!r.id)
        throw new Error("isColliding() requires the object to have an id");
      return !!e[r.id];
    }, isOverlapping(r) {
      if (!r.id)
        throw new Error("isOverlapping() requires the object to have an id");
      let o = e[r.id];
      return o && o.hasOverlap();
    }, onClick(r, o = "left") {
      let s = P.onMousePress(o, () => {
        this.isHovering() && r();
      });
      return this.onDestroy(() => s.cancel()), s;
    }, onHover(r) {
      let o = false;
      return this.onUpdate(() => {
        o ? o = this.isHovering() : this.isHovering() && (o = true, r());
      });
    }, onHoverUpdate(r) {
      return this.onUpdate(() => {
        this.isHovering() && r();
      });
    }, onHoverEnd(r) {
      let o = false;
      return this.onUpdate(() => {
        o ? this.isHovering() || (o = false, r()) : o = this.isHovering();
      });
    }, onCollide(r, o) {
      if (typeof r == "function" && o === void 0)
        return this.on("collide", r);
      if (typeof r == "string")
        return this.onCollide((s, a) => {
          s.is(r) && o?.(s, a);
        });
      throw new Error("onCollide() requires either a function or a tag");
    }, onCollideUpdate(r, o) {
      if (typeof r == "function" && o === void 0)
        return this.on("collideUpdate", r);
      if (typeof r == "string")
        return this.on("collideUpdate", (s, a) => s.is(r) && o?.(s, a));
      throw new Error("onCollideUpdate() requires either a function or a tag");
    }, onCollideEnd(r, o) {
      if (typeof r == "function" && o === void 0)
        return this.on("collideEnd", r);
      if (typeof r == "string")
        return this.on("collideEnd", (s) => s.is(r) && o?.(s));
      throw new Error("onCollideEnd() requires either a function or a tag");
    }, hasPoint(r) {
      return rt(this.worldArea(), r);
    }, resolveCollision(r) {
      let o = this.checkCollision(r);
      o && !o.resolved && (this.pos = this.pos.add(o.displacement), o.resolved = true);
    }, localArea() {
      return this.area.shape ? this.area.shape : this.renderArea();
    }, worldArea() {
      let r = this.localArea();
      if (!(r instanceof L.Polygon || r instanceof L.Rect))
        throw new Error("Only support polygon and rect shapes for now");
      let o = this.transform.clone().scale(b(this.area.scale ?? 1)).translate(this.area.offset);
      if (r instanceof L.Rect) {
        let s = Ne(this.anchor || dt2).add(1, 1).scale(-0.5).scale(r.width, r.height);
        o.translate(s);
      }
      return r.transform(o);
    }, screenArea() {
      let r = this.worldArea();
      return ct(this) ? r : r.transform(C.cam.transform);
    }, inspect() {
      return this.area.scale.x == this.area.scale.y ? `area: ${this.area.scale.x.toFixed(1)}x` : `area: (${this.area.scale.x.toFixed(1)}x, ${this.area.scale.y.toFixed(1)}y)`;
    } };
  }
  i(la, "area");
  function ma(t18 = {}) {
    let e = null, n = null, r = false, o = b(0), s = null, a = null, l;
    return { id: "body", require: ["pos"], vel: b(0), drag: t18.drag ?? 0, jumpForce: t18.jumpForce ?? Ci, gravityScale: t18.gravityScale ?? 1, isStatic: t18.isStatic ?? false, mass: t18.mass ?? 1, add() {
      if (s = this.pos.clone(), a = this.pos.clone(), l = this.pos.clone(), this.mass === 0)
        throw new Error("Can't set body mass to 0");
      this.is("area") && (this.onCollideUpdate((u, m) => {
        if (!m || !u.is("body") || m.resolved)
          return;
        this.trigger("beforePhysicsResolve", m);
        let c = m.reverse();
        if (u.trigger("beforePhysicsResolve", c), !(m.resolved || c.resolved) && !(this.isStatic && u.isStatic)) {
          if (!this.isStatic && !u.isStatic) {
            let p = this.mass + u.mass;
            this.pos = this.pos.add(m.displacement.scale(u.mass / p)), u.pos = u.pos.add(m.displacement.scale(-this.mass / p)), this.transform = Lt(this), u.transform = Lt(u);
          } else {
            let p = !this.isStatic && u.isStatic ? m : m.reverse();
            p.source.pos = p.source.pos.add(p.displacement), p.source.transform = Lt(p.source);
          }
          m.resolved = true, this.trigger("physicsResolve", m), u.trigger("physicsResolve", m.reverse());
        }
      }), this.onPhysicsResolve((u) => {
        C.gravity && (u.isBottom() && this.isFalling() ? (this.vel = this.vel.reject(C.gravity.unit()), e = u.target, n = u.target.pos, r ? r = false : (this.trigger("ground", e), u.target.trigger("land", this))) : u.isTop() && this.isJumping() && (this.vel = this.vel.reject(C.gravity.unit()), this.trigger("headbutt", u.target), u.target.trigger("headbutted", this)));
      }));
    }, update() {
      e && (!this.isColliding(e) || !e.exists() || !e.is("body") ? r = true : (n && !e.pos.eq(n) && t18.stickToPlatform !== false && this.moveBy(e.pos.sub(n)), n = e.pos));
      let u = L.restDt();
      u && this.pos.eq(l) && (this.pos = L.lerp(s, a, u / L.fixedDt()), l = this.pos.clone());
    }, fixedUpdate() {
      if (s && (this.pos.eq(l) && (this.pos = s), s = null), C.gravity && !this.isStatic) {
        r && (e = null, n = null, this.trigger("fallOff"), r = false);
        let m = true;
        if (e && (m = false), m) {
          let c = this.vel.clone();
          this.vel = this.vel.add(C.gravity.scale(this.gravityScale * L.dt()));
          let p = t18.maxVelocity ?? Ei;
          this.vel.slen() > p * p && (this.vel = this.vel.unit().scale(p)), c.dot(C.gravity) < 0 && this.vel.dot(C.gravity) >= 0 && this.trigger("fall");
        }
      }
      if (this.vel.x += o.x * L.dt(), this.vel.y += o.y * L.dt(), this.vel.x *= 1 - this.drag * L.dt(), this.vel.y *= 1 - this.drag * L.dt(), this.move(this.vel), L.restDt()) {
        s = this.pos.clone();
        let m = this.vel.add(o.scale(L.dt()));
        a = this.pos.add(m.scale(L.dt())), l = this.pos.clone();
      }
      o.x = 0, o.y = 0;
    }, onPhysicsResolve(u) {
      return this.on("physicsResolve", u);
    }, onBeforePhysicsResolve(u) {
      return this.on("beforePhysicsResolve", u);
    }, curPlatform() {
      return e;
    }, isGrounded() {
      return e !== null;
    }, isFalling() {
      return this.vel.dot(L.getGravityDirection()) > 0;
    }, isJumping() {
      return this.vel.dot(L.getGravityDirection()) < 0;
    }, applyImpulse(u) {
      this.vel = this.vel.add(u);
    }, addForce(u) {
      o.x += u.x / this.mass, o.y += u.y / this.mass;
    }, jump(u) {
      e = null, n = null, this.vel = L.getGravityDirection().scale(-u || -this.jumpForce);
    }, onGround(u) {
      return this.on("ground", u);
    }, onFall(u) {
      return this.on("fall", u);
    }, onFallOff(u) {
      return this.on("fallOff", u);
    }, onHeadbutt(u) {
      return this.on("headbutt", u);
    }, onLand(u) {
      return this.on("land", u);
    }, onHeadbutted(u) {
      return this.on("headbutted", u);
    }, inspect() {
      return `gravityScale: ${this.gravityScale}x`;
    } };
  }
  i(ma, "body");
  function pa(t18 = 2) {
    let e = t18;
    return { id: "doubleJump", require: ["body"], numJumps: t18, add() {
      this.onGround(() => {
        e = this.numJumps;
      });
    }, doubleJump(n) {
      e <= 0 || (e < this.numJumps && this.trigger("doubleJump"), e--, this.jump(n));
    }, onDoubleJump(n) {
      return this.on("doubleJump", n);
    }, inspect() {
      return `jumpsLeft: ${e}`;
    } };
  }
  i(pa, "doubleJump");
  function da(t18) {
    return { id: "surfaceEffector", require: ["area"], speed: t18.speed, speedVariation: t18.speedVariation ?? 0, forceScale: t18.speedVariation ?? 0.9, add() {
      this.onCollideUpdate((e, n) => {
        let r = n?.normal.normal(), o = e.vel.project(r), a = r?.scale(this.speed)?.sub(o);
        e.addForce(a?.scale(e.mass * this.forceScale));
      });
    } };
  }
  i(da, "surfaceEffector");
  function ha(t18) {
    return { id: "areaEffector", require: ["area"], useGlobalAngle: t18.useGlobalAngle || false, forceAngle: t18.forceAngle, forceMagnitude: t18.forceMagnitude, forceVariation: t18.forceVariation ?? 0, linearDrag: t18.linearDrag ?? 0, add() {
      this.onCollideUpdate((e, n) => {
        let o = w.fromAngle(this.forceAngle).scale(this.forceMagnitude);
        e.addForce(o), this.linearDrag && e.addForce(e.vel.scale(-this.linearDrag));
      });
    } };
  }
  i(ha, "areaEffector");
  function fa(t18) {
    return { id: "pointEffector", require: ["area", "pos"], forceMagnitude: t18.forceMagnitude, forceVariation: t18.forceVariation ?? 0, distanceScale: t18.distanceScale ?? 1, forceMode: t18.forceMode || "inverseLinear", linearDrag: t18.linearDrag ?? 0, add() {
      this.onCollideUpdate((e, n) => {
        let r = this.pos.sub(e.pos), o = r.len(), s = o * this.distanceScale / 10, a = this.forceMode === "constant" ? 1 : this.forceMode === "inverseLinear" ? 1 / s : 1 / s ** 2, l = r.scale(this.forceMagnitude * a / o);
        e.addForce(l), this.linearDrag && e.addForce(e.vel.scale(-this.linearDrag));
      });
    } };
  }
  i(fa, "pointEffector");
  function ga(t18) {
    return { id: "constantForce", require: ["body"], force: t18.force, update() {
      this.force && this.addForce(this.force);
    } };
  }
  i(ga, "constantForce");
  function ba(t18) {
    return { id: "buoyancyEffector", require: ["area"], surfaceLevel: t18.surfaceLevel, density: t18.density ?? 1, linearDrag: t18.linearDrag ?? 1, angularDrag: t18.angularDrag ?? 0.2, flowAngle: t18.flowAngle ?? 0, flowMagnitude: t18.flowMagnitude ?? 0, flowVariation: t18.flowVariation ?? 0, add() {
      this.onCollideUpdate((e, n) => {
        let r = e, o = r.worldArea(), [s, a] = o.cut(b(-100, this.surfaceLevel), b(100, this.surfaceLevel));
        s && (this.applyBuoyancy(r, s), this.applyDrag(r, s)), this.flowMagnitude && r.addForce(w.fromAngle(this.flowAngle).scale(this.flowMagnitude));
      });
    }, applyBuoyancy(e, n) {
      let r = this.density * n.area(), o = b(0, 1).scale(-r);
      e.addForce(o);
    }, applyDrag(e, n) {
      let r = e.vel, o = this.density * this.linearDrag, s = r.scale(-o);
      e.addForce(s);
    } };
  }
  i(ba, "buoyancyEffector");
  function ln(t18) {
    if (!t18)
      throw new Error("Please define an anchor");
    return { id: "anchor", anchor: t18, inspect() {
      return typeof this.anchor == "string" ? "anchor: " + this.anchor : "anchor: " + this.anchor.toString();
    } };
  }
  i(ln, "anchor");
  function $n() {
    return { id: "fixed", fixed: true };
  }
  i($n, "fixed");
  function ya(t18, e) {
    return { id: "follow", require: ["pos"], follow: { obj: t18, offset: e ?? b(0) }, add() {
      t18.exists() && (this.pos = this.follow.obj.pos.add(this.follow.offset));
    }, update() {
      t18.exists() && (this.pos = this.follow.obj.pos.add(this.follow.offset));
    } };
  }
  i(ya, "follow");
  function xa(t18) {
    let e = C.layers?.indexOf(t18);
    return { id: "layer", get layerIndex() {
      return e ?? null;
    }, get layer() {
      return e ? C.layers?.[e] ?? null : null;
    }, set layer(n) {
      if (e = C.layers?.indexOf(n), e == -1)
        throw Error("Invalid layer name");
    }, inspect() {
      return `layer: ${this.layer}`;
    } };
  }
  i(xa, "layer");
  function va(t18, e) {
    let n = typeof t18 == "number" ? w.fromAngle(t18) : t18.unit();
    return { id: "move", require: ["pos"], update() {
      this.move(n.scale(e));
    } };
  }
  i(va, "move");
  function wa(t18 = {}) {
    let e = t18.distance ?? wi, n = false;
    return { id: "offscreen", require: ["pos"], isOffScreen() {
      let r = this.screenPos();
      if (!r)
        return false;
      let o = new ee(b(0), L.width(), L.height());
      return !L.testRectPoint(o, r) && o.sdistToPoint(r) > e * e;
    }, onExitScreen(r) {
      return this.on("exitView", r);
    }, onEnterScreen(r) {
      return this.on("enterView", r);
    }, update() {
      this.isOffScreen() ? (n || (this.trigger("exitView"), n = true), t18.hide && (this.hidden = true), t18.pause && (this.paused = true), t18.destroy && this.destroy()) : (n && (this.trigger("enterView"), n = false), t18.hide && (this.hidden = false), t18.pause && (this.paused = false));
    } };
  }
  i(wa, "offscreen");
  function Gt(...t18) {
    return { id: "pos", pos: b(...t18), moveBy(...e) {
      this.pos = this.pos.add(b(...e));
    }, move(...e) {
      this.moveBy(b(...e).scale(L.dt()));
    }, moveTo(...e) {
      if (typeof e[0] == "number" && typeof e[1] == "number")
        return this.moveTo(b(e[0], e[1]), e[2]);
      let n = e[0], r = e[1];
      if (r === void 0) {
        this.pos = b(n);
        return;
      }
      let o = n.sub(this.pos);
      if (o.len() <= r * L.dt()) {
        this.pos = b(n);
        return;
      }
      this.move(o.unit().scale(r));
    }, worldPos(e = null) {
      return e ? (this.pos = this.pos.add(this.fromWorld(e)), null) : this.parent ? this.parent.transform.multVec2(this.pos) : this.pos;
    }, toWorld(e) {
      return this.parent ? this.parent.transform.multVec2(this.pos.add(e)) : this.pos.add(e);
    }, fromWorld(e) {
      return this.parent ? this.parent.transform.invert().multVec2(e).sub(this.pos) : e.sub(this.pos);
    }, screenPos(e = null) {
      if (e)
        return this.pos = this.pos.add(this.fromScreen(e)), null;
      {
        let n = this.worldPos();
        return n ? ct(this) ? n : L.toScreen(n) : null;
      }
    }, toScreen(e) {
      let n = this.toWorld(e);
      return ct(this) ? n : L.toScreen(n);
    }, fromScreen(e) {
      return ct(this) ? this.fromWorld(e) : this.fromWorld(L.toWorld(e));
    }, toOther(e, n) {
      return e.fromWorld(this.toWorld(n));
    }, fromOther(e, n) {
      return e.toOther(this, n);
    }, inspect() {
      return `pos: (${Math.round(this.pos.x)}x, ${Math.round(this.pos.y)}y)`;
    }, drawInspect() {
      L.drawCircle({ color: L.rgb(255, 0, 0), radius: 4 / Mn() });
    } };
  }
  i(Gt, "pos");
  function Ca(t18) {
    return { id: "rotate", angle: t18 ?? 0, rotateBy(e) {
      this.angle += e;
    }, rotateTo(e) {
      this.angle = e;
    }, inspect() {
      return `angle: ${Math.round(this.angle)}`;
    } };
  }
  i(Ca, "rotate");
  function Nt(...t18) {
    if (t18.length === 0)
      return Nt(1);
    let e = b(...t18);
    return { id: "scale", set scale(n) {
      if (!(n instanceof w))
        throw Error("The scale property on scale is a vector. Use scaleTo or scaleBy to set the scale with a number.");
      e = b(n);
    }, get scale() {
      return e;
    }, scaleTo(...n) {
      e = b(...n);
    }, scaleBy(...n) {
      e = e.scale(b(...n));
    }, inspect() {
      return e.x == e.y ? `scale: ${e.x.toFixed(1)}x` : `scale: (${e.x.toFixed(1)}x, ${e.y.toFixed(1)}y)`;
    } };
  }
  i(Nt, "scale");
  function Ea(t18) {
    return { id: "z", z: t18, inspect() {
      return `z: ${this.z}`;
    } };
  }
  i(Ea, "z");
  var Ta = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOcAAACDCAYAAAB2kQxsAAAAAXNSR0IArs4c6QAABqxJREFUeJztnU1yFDkQRtMEB+AG7Fk6fBPO6ZsQLGc/N5gbMAtosJvqKv2kpPxS763A0W5XSXqVqZ+SngzgF58/fflx/7N///vnacW1gBkFD2Z2LOYNBF3Dx9UXAGs5kxLWwhNxU2qlJHrOhwLfkNZoiaBzIa3dCFJYLXgSboKXmETPeVDQyamR8vX55fe/v37/9vBzCDoH0tqktEpZ+t0IOh4KOBm16euZmETPtVDAiRgRLRF0HRRuEkrFrE1hzR4Lipxj+bD6AqCPz5++/Bgp5tXfdv1CeAdPPmFmSkn0nE+a0drdFm6XiOkdKWEuKRptTXqlLuqqFNaM6Dkb+T5nbb+npo8WjZVinqFantFJk9bWojaRThq7HzKN8wiPJ7aCoJHEZN5zHvJp7RE1DTV6SnZ1fa/PL1MjJtF5HmnT2tJF3GZ/BIj05I8ULUtR6ypER7ogjxpw61rRGxEal4KYjNyORzatbUlHSxr06tFcBTHPiN5NUEJWzlZKG/aKRqYk5tl1IKgPafucZ7w+vxSluLP6olHnL6MQQfYV6bpk/+BRZXm+cXHEiApSipZHlE6tRBDMkxmyysl5VsmtjXiFoJmiZU35ZWK0oNv1OY+omSv0GDDKJCaMI42cHg25dvFCi6QZxVS6ViVSpLUz38A4oiS9ySjlW2althGWKZrN6XNuOVpbwq0ReIzqZhfTrHwE/PZZuEYqcnqO0tZQGxVqRylprLGIEDXNkLOKEakbYsYiiphmiQaEZuD9BghixiKSmGYJIueqBt4TRZEyHtHENCNyNtMaRREzHhHFNBOKnKv7myVcVXKka4WfRBXTjMjpypl8iBmP6MsOmed0Bgk1UHjxXlpORIAWIqeybyGtha1QEdNMRM5s7wLCGpTENBORE6AXNTHNkBM2QFFMM4F5ToX5TYiLqphmRE7YmMhimiEnJEb9XBdJOUlp4Qp1Mc1E5QQ4I/qyvFJCy8n8JnijEjXNAi3fQ0TwIEM6e2OqnAgII8kkptkgOZEQZlN6BquZjqhVFxlBOkZq4Z6WASAFQQ8jZwQJ70FK8CTiaeb3fDSLJyMiwiwiS/q0SkwEBE+85jYjSTpcTiSE2WQRtVlOpAMVemVdtjXmlZxICFlQk/TJjHcmYS96JJ0p6KmcZggKeWmVdPopYwgKuxJVUuQE+EU0Sd99KYICxJH0ry9DUIA/rFy3WyWnGYLCnqyQ9PCXERTgmJmSPvwlBAU4p1bUWklPP1yytA9JYWdGRtLLDyEowDUjomiRwQgKUIZnJC3OgREUoByPSDpkDyEkBfhJj6RNQ7xEUYA6aiS9Cdo8SUoUBaijVtCuFQwICtBGiajdawARFKCNK0HdVtEjKUAd0+Q0q9v/FklhJ1rmP4e8JEoUBejfq2jYNgtEUdgJzwN7u6dSSkBQyMSME7O7FyHUQpoLCqw8rv5o+d6Uw3NvfzjagUkAZvOlLH1lLMyx8wCzWBEhW3ZDmLZ7NTsrwCpmyui5A1+IPidigjcjhZy14/vytBYxwRsPMVcf/2c2QU72wQUVIgj5lqFyIiZEJ5qQb1me1gLMJLKM93wY9cVETYiGkphmg+RETFhJljY2LHICQB/uchI1AXxwlRMxAfwgrYVtUHvxwk1OoiaAL8MjJ2ICtOEip1q6APnJEBS6VwiRzp4vtM5YBvf3m/EeI8DyvUZK33z4+v1bqsZ7dN+3n2W6zwgMO44hY0X1vIqkXh419x7lXh9ds8oyviFyRqmcXrxf2FUtF89ymFkG6nI2p7WZB4FGvUWfLcVt4ahsdy+TR7ifz6lc0F5v0GfalmXldpE3esrr6PrTR84sjNjS4kpQhQhaUi4lD6KR1xK9DHupfoKoR02vSFDy9FWNoKVivv1/lG7OfZkqR043OZUbWgmtFaomaGl51ZTHCnFv5bqNnFGjZvRtEFUEHSHmI1ZHWgVBXZ5+sxvX7ANlPChpjKsknSllKaPlRU4nZo0Yjq6wiIJGFPMML2mj3M8ZRRe4QkzF6FhCJEFbBn4i0iKswn11yenZiLLKeMRqQdWiZSmlkqrcV9d0gPfksAcqBW+2ZqAoq5gZGSrnTtGwlVmCIqUepxWxerj7iIyNZ7SgiKmJhJw7NJpRgiKmLuHl3KnReA4UIaU+y+WkcbzHQ1DEzMGQ9aJH0BDK6RE0y9wlTDp2HuppERQxc0FFBaZGUMTMB5UlQG/fHyk1odJEaBUUMXWh4oSoFRQxtaHyxMi2uBseQwUKciUoYuaAShTlkaCImQcqUph7QREzF/8DSS/2GZ2/N/sAAAAASUVORK5CYII=";
  var Oa = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOcAAACDCAYAAAB2kQxsAAAAAXNSR0IArs4c6QAABdRJREFUeJzt3d3N3TYMgGG16ADdoAhyl7UyV9bqXRB0g2zQXgRGDcOWSIoUaX3vAwQBknMk/4gWLcnHrQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDEb9kb8FH99eeXf6Wf/efn35ynDyj1pEsb6G6NUxOYZ7sdB/QtPdnWRnn29gbKMYDUspPs0SgPb22cHANo/JG9AZF6wWBp3JLgeir36bvff3x9LOvzp2/dbSFA97bk5I4a9VMD7TXOUcP0uJ+d6emu5d6V1QvMs5nj8FZPx37X/b2TFpzShtnafeP0DipJMFnLnN3/w1OQ7tZgP+pA4VVKcHo0TG36KNULKGt5XsHZmi1APS5WM2Vqg0i7vbsG6YcIznN9vRTxXHavgdxtv6Tc3vc1pAHqdaG6ipwKYprpf1sFp6aH0gRTrxxLubPB2avHu+c/l3mICvqnsr//+Cq+qGrK1Xw/wzbBaRkNvSv3yew9cq+cu89L6nu6F/cMzCgzF1ftANlbe+Otp1IkDVxyVfbo6Z481f3507dhvXfbrk3HpdtjKTNqKuio8678c7mzF6ns6arfMyrVNoA75wMfNU2hKSeCx3Fq7dc+SPfDc39H9Vqn2CT//4bsYeT1PecOJyGSJdh6PZOlbElPZz2PHtlD1cUeS4LT4z5IOihwfNaD5ERm9qxH/dZ7Vmt9M999CtCZbdLUP/p3r2zFQ0paG8lr4Eb6+ZWBcSeq/qhyK6bXUfXOSgtO7/tOb9eT1NveqKttpYbiyXu/euV51JV16/T6e86zyF5TUp731V5Sp+Z7M71h9QvFNWWuvr0Sy4LzLfNvrel6zRX1e+hN2VzrnNlfaYD0xhCs++851lDh3vNV95xe6YvHgb8bwbNcuc+f09wbaUj2dzYgjz93//5kh94t0quCM8OKK6glKKuM0EYHfhUZWd8WwenZa0rLsp6s2YY66o0k9WUvS4NManBaGuo1eDIHgUZ1ePdkntsfFaCz5VZJdStsxyt7ziMNXHEAK5yk1mqmhrMPf1fcp57Vqe3SqZTMEduZhqAZyaywFne0DVHngHTZ11bznE88l/1lBZ9meP8851plWkBCO7drmQvWnL/sY/fKtFaqN3iy6iofsQxNktJnTMgfPXJUz3w3VaP5vOQ7Iyszvy2DczSi+aYFET2jINUEqFcAS4+rV480WlwRWXe07dLa0YGvfl9kmbTvPZJ1TXGvn4t4yuRp+2aMgk27wkm63DIztU3vOVfueC8wK4zKWtK0M+nvJXmOdlt65MgFFCva06qsKz044SvjIiN5TjLaaHxhtNyyouXBGZ1WSn66Ivt+M7pRZAWoZsDq+t2emeM1am/WtHxFG9runrO1/n1CxLK7CilxJM/H4bwuTJJBvWtgvm0gcNu01uvpd8la1soLE7xkpYDea4Ot6W3GOSzRc3o/qHw2M9qmXWA+uw+jbd0hyO9Yz0+vJ9QGcO/8ZV2YUqYVPN8dImXp3aJ/w1XTGGYfKZN+P7IXiXqO1uINLzFOm/Pz+BV4C03PNEqpZl//ELXP1ro8nhLyKLPHMyAiXyvh4cMFZ2uyAJXc62gzgJl1nhrSLMEzcLx+5qQnIhgqv6qhTHC2Zmus1tUuowCVDkRU6j0jgiJqhLPSSq2q7wMtMSBkdbcQWjNCq2nMlRrTnajAPP/t+c5Sj3K8VNueQ+pGzaa2MyOb2sZseW2dpL6ZnjMzfeQFt/Fe3XP2WIfGvRY6a569jCJ9TaIlcCS9KQE5p1TP2VrMbwLNDlZEvpE5AkGxh9f2nLO/QOetytIwAnMf6SfS2ns+jaZ6B4i2sWvSvF0HWOAj/aRGNFAaPXbw2rS2Rzr0T/ChshKNM3qd4135BCaqK9VAKy+lAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4DBC0k0jFtF9wAAAAASUVORK5CYII=";
  var ju = "3001.0.0";
  var L;
  var re;
  var O;
  var C;
  var P;
  var _;
  var gt;
  var Kr;
  var J;
  var oe;
  var We;
  var xe;
  var _t;
  var Yr;
  var Wr;
  var Sa = i((t18 = {}) => {
    re = t18;
    let e = t18.root ?? document.body;
    e === document.body && (document.body.style.width = "100%", document.body.style.height = "100%", document.body.style.margin = "0px", document.documentElement.style.width = "100%", document.documentElement.style.height = "100%"), xe = t18.canvas ?? e.appendChild(document.createElement("canvas")), _t = t18.scale ?? 1;
    let n = t18.width && t18.height && !t18.stretch && !t18.letterbox;
    n ? (xe.width = t18.width * _t, xe.height = t18.height * _t) : (xe.width = xe.parentElement.offsetWidth, xe.height = xe.parentElement.offsetHeight);
    let r = ["outline: none", "cursor: default"];
    if (n) {
      let U2 = xe.width, I = xe.height;
      r.push(`width: ${U2}px`), r.push(`height: ${I}px`);
    } else
      r.push("width: 100%"), r.push("height: 100%");
    t18.crisp && (r.push("image-rendering: pixelated"), r.push("image-rendering: crisp-edges")), xe.style.cssText = r.join(";"), We = t18.pixelDensity || window.devicePixelRatio, xe.width *= We, xe.height *= We, xe.tabIndex = 0, gt = document.createElement("canvas"), gt.width = 256, gt.height = 256, Kr = gt.getContext("2d", { willReadFrequently: true }), P = Zo({ canvas: xe, touchToMouse: t18.touchToMouse, gamepads: t18.gamepads, pixelDensity: t18.pixelDensity, maxFPS: t18.maxFPS, buttons: t18.buttons });
    let o = [], s = P.canvas.getContext("webgl", { antialias: true, depth: true, stencil: true, alpha: true, preserveDrawingBuffer: true });
    if (!s)
      throw new Error("WebGL not supported");
    let a = s, l = qi(a, { texFilter: t18.texFilter });
    O = rs(t18, l), oe = Ks(), _ = Pi(l), C = Bs(), C.root.use(mn());
    function u(U2, I) {
      let Y = new at(l, U2, I);
      return { clear: i(() => Y.clear(), "clear"), free: i(() => Y.free(), "free"), toDataURL: i(() => Y.toDataURL(), "toDataURL"), toImageData: i(() => Y.toImageData(), "toImageData"), width: Y.width, height: Y.height, draw: i((j) => {
        Ee(), Y.bind(), j(), Ee(), Y.unbind();
      }, "draw") };
    }
    i(u, "makeCanvas");
    function m() {
      a.clear(a.COLOR_BUFFER_BIT), O.frameBuffer.bind(), a.clear(a.COLOR_BUFFER_BIT), O.bgColor || Ye(() => {
        ut({ width: he(), height: be(), quad: new $(0, 0, he() / 64, be() / 64), tex: O.bgTex, fixed: true });
      }), O.renderer.numDraws = 0, O.fixed = false, O.transformStack.length = 0, O.transform = new fe();
    }
    i(m, "frameStart");
    function c(U2, I) {
      O.postShader = U2, O.postShaderUniform = I ?? null;
    }
    i(c, "usePostEffect");
    function p() {
      Ee(), O.lastDrawCalls = O.renderer.numDraws, O.frameBuffer.unbind(), a.viewport(0, 0, a.drawingBufferWidth, a.drawingBufferHeight);
      let U2 = O.width, I = O.height;
      O.width = a.drawingBufferWidth / We, O.height = a.drawingBufferHeight / We, Rt({ flipY: true, tex: O.frameBuffer.tex, pos: new w(O.viewport.x, O.viewport.y), width: O.viewport.width, height: O.viewport.height, shader: O.postShader, uniform: typeof O.postShaderUniform == "function" ? O.postShaderUniform() : O.postShaderUniform, fixed: true }), Ee(), O.width = U2, O.height = I;
    }
    i(p, "frameEnd");
    let d = false;
    J = { inspect: false, timeScale: 1, showLog: true, fps: i(() => P.fps(), "fps"), numFrames: i(() => P.numFrames(), "numFrames"), stepFrame: K2, drawCalls: i(() => O.lastDrawCalls, "drawCalls"), clearLog: i(() => C.logs = [], "clearLog"), log: i((U2) => {
      let I = t18.logMax ?? 8;
      C.logs.unshift({ msg: U2, time: P.time() }), C.logs.length > I && (C.logs = C.logs.slice(0, I));
    }, "log"), error: i((U2) => J.log(new Error(U2.toString ? U2.toString() : U2)), "error"), curRecording: null, numObjects: i(() => F("*", { recursive: true }).length, "numObjects"), get paused() {
      return d;
    }, set paused(U2) {
      d = U2, U2 ? oe.ctx.suspend() : oe.ctx.resume();
    } };
    function x(U2, I) {
      try {
        return JSON.parse(window.localStorage[U2]);
      } catch {
        return I ? (f(U2, I), I) : null;
      }
    }
    i(x, "getData");
    function f(U2, I) {
      window.localStorage[U2] = JSON.stringify(I);
    }
    i(f, "setData");
    function y(U2, ...I) {
      let Y = U2(L), j;
      typeof Y == "function" ? j = Y(...I)(L) : j = Y;
      for (let ue in j)
        L[ue] = j[ue], t18.global !== false && (window[ue] = j[ue]);
      return L;
    }
    i(y, "plug");
    function v(U2) {
      let I = P.canvas.captureStream(U2), Y = oe.ctx.createMediaStreamDestination();
      oe.masterNode.connect(Y);
      let j = new MediaRecorder(I), ue = [];
      return j.ondataavailable = (Z) => {
        Z.data.size > 0 && ue.push(Z.data);
      }, j.onerror = () => {
        oe.masterNode.disconnect(Y), I.getTracks().forEach((Z) => Z.stop());
      }, j.start(), { resume() {
        j.resume();
      }, pause() {
        j.pause();
      }, stop() {
        return j.stop(), oe.masterNode.disconnect(Y), I.getTracks().forEach((Z) => Z.stop()), new Promise((Z) => {
          j.onstop = () => {
            Z(new Blob(ue, { type: "video/mp4" }));
          };
        });
      }, download(Z = "kaboom.mp4") {
        this.stop().then((we) => vr(Z, we));
      } };
    }
    i(v, "record");
    function A() {
      return document.activeElement === P.canvas;
    }
    i(A, "isFocused");
    let V = C.root.add.bind(C.root), M2 = C.root.readd.bind(C.root), G2 = C.root.removeAll.bind(C.root), F = C.root.get.bind(C.root), g = C.root.wait.bind(C.root), T = C.root.loop.bind(C.root), S = C.root.query.bind(C.root), D = C.root.tween.bind(C.root);
    Yr = St(null, Oa), Wr = St(null, Ta);
    function B() {
      C.root.fixedUpdate();
    }
    i(B, "fixedUpdateFrame");
    function K2() {
      C.root.update();
    }
    i(K2, "updateFrame");
    class k2 {
      static {
        i(this, "Collision");
      }
      source;
      target;
      normal;
      distance;
      resolved = false;
      constructor(I, Y, j, ue, Z = false) {
        this.source = I, this.target = Y, this.normal = j, this.distance = ue, this.resolved = Z;
      }
      get displacement() {
        return this.normal.scale(this.distance);
      }
      reverse() {
        return new k2(this.target, this.source, this.normal.scale(-1), this.distance, this.resolved);
      }
      hasOverlap() {
        return !this.displacement.isZero();
      }
      isLeft() {
        return this.displacement.cross(C.gravity || b(0, 1)) > 0;
      }
      isRight() {
        return this.displacement.cross(C.gravity || b(0, 1)) < 0;
      }
      isTop() {
        return this.displacement.dot(C.gravity || b(0, 1)) > 0;
      }
      isBottom() {
        return this.displacement.dot(C.gravity || b(0, 1)) < 0;
      }
      preventResolution() {
        this.resolved = true;
      }
    }
    function z3() {
      if (!ca())
        return;
      let U2 = {}, I = t18.hashGridSize || 64, Y = new fe(), j = [];
      function ue(Z) {
        if (j.push(Y.clone()), Z.pos && Y.translate(Z.pos), Z.scale && Y.scale(Z.scale), Z.angle && Y.rotate(Z.angle), Z.transform = Y.clone(), Z.c("area") && !Z.paused) {
          let we = Z, lt = we.worldArea().bbox(), nr2 = Math.floor(lt.pos.x / I), rr = Math.floor(lt.pos.y / I), or = Math.ceil((lt.pos.x + lt.width) / I), ir = Math.ceil((lt.pos.y + lt.height) / I), dn = /* @__PURE__ */ new Set();
          for (let Je2 = nr2; Je2 <= or; Je2++)
            for (let mt = rr; mt <= ir; mt++)
              if (!U2[Je2])
                U2[Je2] = {}, U2[Je2][mt] = [we];
              else if (!U2[Je2][mt])
                U2[Je2][mt] = [we];
              else {
                let hn = U2[Je2][mt];
                e:
                  for (let ke2 of hn) {
                    if (ke2.paused || !ke2.exists() || dn.has(ke2.id))
                      continue;
                    for (let tt of we.collisionIgnore)
                      if (ke2.is(tt))
                        continue e;
                    for (let tt of ke2.collisionIgnore)
                      if (we.is(tt))
                        continue e;
                    let qt = Lo(we.worldArea(), ke2.worldArea());
                    if (qt) {
                      let tt = new k2(we, ke2, qt.normal, qt.distance);
                      we.trigger("collideUpdate", ke2, tt);
                      let fn = tt.reverse();
                      fn.resolved = tt.resolved, ke2.trigger("collideUpdate", we, fn);
                    }
                    dn.add(ke2.id);
                  }
                hn.push(we);
              }
        }
        Z.children.forEach(ue), Y = j.pop();
      }
      i(ue, "checkObj"), ue(C.root);
    }
    i(z3, "checkFrame");
    function X(U2) {
      console.error(U2), oe.ctx.suspend();
      let I = U2.message ?? String(U2) ?? "Unknown error, check console for more info";
      P.run(() => {
      }, () => {
        m(), Ye(() => {
          let ue = he(), Z = be(), we = { size: 36, width: ue - 32 * 2, letterSpacing: 4, lineSpacing: 4, font: Tt, fixed: true };
          Ve({ width: ue, height: Z, color: W(0, 0, 255), fixed: true });
          let Ht = qe({ ...we, text: "Error", pos: b(32), color: W(255, 128, 0), fixed: true });
          ze(Ht), _r({ ...we, text: I, pos: b(32, 32 + Ht.height + 16), fixed: true }), ye(), C.events.trigger("error", U2);
        }), p();
      });
    }
    i(X, "handleErr");
    function te(U2) {
      o.push(U2);
    }
    i(te, "onCleanup");
    function Q() {
      C.events.onOnce("frameEnd", () => {
        P.quit(), a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT | a.STENCIL_BUFFER_BIT);
        let U2 = a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS);
        for (let I = 0; I < U2; I++)
          a.activeTexture(a.TEXTURE0 + I), a.bindTexture(a.TEXTURE_2D, null), a.bindTexture(a.TEXTURE_CUBE_MAP, null);
        a.bindBuffer(a.ARRAY_BUFFER, null), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, null), a.bindRenderbuffer(a.RENDERBUFFER, null), a.bindFramebuffer(a.FRAMEBUFFER, null), l.destroy(), o.forEach((I) => I());
      });
    }
    i(Q, "quit");
    let q = true;
    P.run(() => {
      try {
        _.loaded && (z3(), J.paused || B());
      } catch (U2) {
        X(U2);
      }
    }, () => {
      try {
        _.loaded || Le() === 1 && !q && (_.loaded = true, C.events.trigger("load")), !_.loaded && t18.loadingScreen !== false || q ? (m(), Zi(), p()) : (J.paused || K2(), z3(), m(), Ji(), t18.debug !== false && Qi(), p()), q && (q = false), C.events.trigger("frameEnd");
      } catch (U2) {
        X(U2);
      }
    }), Nn(), er(), L = { VERSION: ju, loadRoot: Ai, loadProgress: Le, loadSprite: St, loadSpriteAtlas: Ir, loadSound: _i, loadMusic: Ni, loadBitmapFont: Fi, loadFont: Ui, loadShader: ji, loadShaderURL: Ki, loadAseprite: Mi, loadPedit: Li, loadBean: Di, loadJSON: Si, load: on, getSound: Lr, getFont: Ur, getBitmapFont: Fn, getSprite: Gr, getShader: Fr, getAsset: Vi, Asset: me, SpriteData: Ie, SoundData: st, width: he, height: be, center: Et, dt: Se, fixedDt: ei, restDt: ti, time: P.time, screenshot: P.screenshot, record: v, isFocused: A, setCursor: P.setCursor, getCursor: P.getCursor, setCursorLocked: P.setCursorLocked, isCursorLocked: P.isCursorLocked, setFullscreen: P.setFullscreen, isFullscreen: P.isFullscreen, isTouchscreen: P.isTouchscreen, onLoad: kt, onLoading: Ds, onResize: Ms, onGamepadConnect: P.onGamepadConnect, onGamepadDisconnect: P.onGamepadDisconnect, onError: Us, onCleanup: te, camPos: ps, camScale: ds, camFlash: fs, camRot: hs, camTransform: gs, shake: bs, toScreen: ys, toWorld: xs, setGravity: Fs, getGravity: Ls, setGravityDirection: Is, getGravityDirection: qr, setBackground: ui, getBackground: ci, getGamepads: P.getGamepads, getTreeRoot: qs, add: V, make: un, destroy: Wn, destroyAll: G2, get: F, query: S, readd: M2, pos: Gt, scale: Nt, rotate: Ca, color: Hn, opacity: qn, anchor: ln, area: la, sprite: cn, text: Xs, polygon: ls, rect: Yn, circle: os, uvquad: Qs, outline: us, particles: cs, body: ma, surfaceEffector: da, areaEffector: ha, pointEffector: fa, buoyancyEffector: ba, constantForce: ga, doubleJump: pa, shader: ms, textInput: ua, timer: mn, fixed: $n, stay: tr, health: oa, lifespan: ia, named: sa, state: aa, z: Ea, layer: xa, move: va, offscreen: wa, follow: ya, fadeIn: ss, mask: as, drawon: is, raycast: zn, tile: Xn, animate: ra, serializeAnimation: Jr, agent: Js, sentry: ta, patrol: ea, navigation: Zs, on: et, onFixedUpdate: ws, onUpdate: Cs, onDraw: Es, onAdd: Hr, onDestroy: Ts, onClick: Vs, onCollide: Os, onCollideUpdate: As, onCollideEnd: Ss, onHover: Ps, onHoverUpdate: Rs, onHoverEnd: Gs, onKeyDown: P.onKeyDown, onKeyPress: P.onKeyPress, onKeyPressRepeat: P.onKeyPressRepeat, onKeyRelease: P.onKeyRelease, onMouseDown: P.onMouseDown, onMousePress: P.onMousePress, onMouseRelease: P.onMouseRelease, onMouseMove: P.onMouseMove, onCharInput: P.onCharInput, onTouchStart: P.onTouchStart, onTouchMove: P.onTouchMove, onTouchEnd: P.onTouchEnd, onScroll: P.onScroll, onHide: P.onHide, onShow: P.onShow, onGamepadButtonDown: P.onGamepadButtonDown, onGamepadButtonPress: P.onGamepadButtonPress, onGamepadButtonRelease: P.onGamepadButtonRelease, onGamepadStick: P.onGamepadStick, onButtonPress: P.onButtonPress, onButtonDown: P.onButtonDown, onButtonRelease: P.onButtonRelease, mousePos: Un, mouseDeltaPos: P.mouseDeltaPos, isKeyDown: P.isKeyDown, isKeyPressed: P.isKeyPressed, isKeyPressedRepeat: P.isKeyPressedRepeat, isKeyReleased: P.isKeyReleased, isMouseDown: P.isMouseDown, isMousePressed: P.isMousePressed, isMouseReleased: P.isMouseReleased, isMouseMoved: P.isMouseMoved, isGamepadButtonPressed: P.isGamepadButtonPressed, isGamepadButtonDown: P.isGamepadButtonDown, isGamepadButtonReleased: P.isGamepadButtonReleased, getGamepadStick: P.getGamepadStick, isButtonPressed: P.isButtonPressed, isButtonDown: P.isButtonDown, isButtonReleased: P.isButtonReleased, setButton: P.setButton, getButton: P.getButton, getLastInputDeviceType: P.getLastInputDeviceType, charInputted: P.charInputted, loop: T, wait: g, play: Jn, volume: _s, burp: Zn, audioCtx: oe.ctx, Line: Oe, Rect: ee, Circle: Re, Ellipse: _e, Point: yn, Polygon: Ae, Vec2: w, Color: H, Mat4: fe, Quad: $, RNG: Wt, rand: ge, randi: mr, randSeed: lo, vec2: b, rgb: W, hsl2rgb: ao, quad: pe, choose: ho, chooseMultiple: po, shuffle: pr, chance: mo, lerp: Ce, tween: D, easings: ot, map: De, mapc: co, wave: xn, deg2rad: ce, rad2deg: pt, clamp: Be, evaluateQuadratic: Eo, evaluateQuadraticFirstDerivative: To, evaluateQuadraticSecondDerivative: Oo, evaluateBezier: Xt, evaluateBezierFirstDerivative: Ao, evaluateBezierSecondDerivative: So, evaluateCatmullRom: Vo, evaluateCatmullRomFirstDerivative: Po, curveLengthApproximation: br, normalizedCurve: Ro, hermite: Ut, cardinal: yr, catmullRom: Bt, bezier: Go, kochanekBartels: Do, easingSteps: Fo, easingLinear: Uo, easingCubicBezier: Bo, testLineLine: vn, testRectRect: dr, testRectLine: wn, testRectPoint: Cn, testCirclePolygon: $t, testLinePoint: En, testLineCircle: Mt, isConvex: jo, triangulate: On, NavMesh: Dn, drawSprite: ts, drawText: _r, formatText: qe, drawRect: Ve, drawLine: Kt, drawLines: jt, drawTriangle: kn, drawCircle: ft, drawEllipse: In, drawUVQuad: ut, drawPolygon: He, drawCurve: jn, drawBezier: Hi, drawFormattedText: ze, drawMasked: es, drawSubtracted: ns, pushTransform: ve, popTransform: ye, pushTranslate: ne, pushScale: it, pushRotate: Qe, pushMatrix: li, usePostEffect: c, makeCanvas: u, debug: J, scene: zs, getSceneName: $s, go: Ys, onSceneLeave: Ws, layers: Hs, addLevel: vs, getData: x, setData: f, download: An, downloadJSON: qo, downloadText: xr, downloadBlob: vr, plug: y, ASCII_CHARS: Bn, canvas: P.canvas, addKaboom: Ns, LEFT: w.LEFT, RIGHT: w.RIGHT, UP: w.UP, DOWN: w.DOWN, RED: H.RED, GREEN: H.GREEN, BLUE: H.BLUE, YELLOW: H.YELLOW, MAGENTA: H.MAGENTA, CYAN: H.CYAN, WHITE: H.WHITE, BLACK: H.BLACK, quit: Q, KEvent: le, KEventHandler: $e, KEventController: Ze };
    let ae = t18.plugins;
    if (ae && ae.forEach(y), t18.global !== false)
      for (let U2 in L)
        window[U2] = L[U2];
    return t18.focus !== false && P.canvas.focus(), L;
  }, "kaplay");
  var HC = Sa;

  // source/game/scenes/introScene.ts
  function introscene() {
    return scene("introscene", () => {
      debug.log("amuspark logo");
    });
  }

  // source/game/plugins/wave.ts
  function waver(WaveCompOpt) {
    return {
      // Name of the component
      id: "wave",
      // This component requires the "pos" component to work
      require: ["pos"],
      amplitude: 0,
      wave_tweenSpeed: WaveCompOpt?.wave_tweenSpeed || 0.32,
      wave_startTweenSpeed: WaveCompOpt?.wave_tweenSpeed || 0.32,
      wave_endTweenSpeed: WaveCompOpt?.wave_tweenSpeed || 0.32,
      minAmplitude: WaveCompOpt?.minAmplitude || 0,
      maxAmplitude: WaveCompOpt?.maxAmplitude || 50,
      wave_verPosition: 0,
      wave_speed: WaveCompOpt?.wave_speed || 1,
      isWaving: false,
      add() {
        this.wave_verPosition = this.pos.y;
      },
      startWave() {
        if (this.isWaving)
          return;
        this.trigger("waveStart");
        tween(this.minAmplitude, this.maxAmplitude, this.wave_tweenSpeed, (v) => this.amplitude = v);
        this.isWaving = true;
      },
      stopWave() {
        if (!this.isWaving)
          return;
        this.trigger("waveStop");
        tween(this.amplitude, this.minAmplitude, this.wave_tweenSpeed, (v) => this.amplitude = v);
        tween(this.pos.y, this.wave_verPosition, this.wave_tweenSpeed, (v) => this.pos.y = v);
        this.isWaving = false;
      },
      // "update" is a lifecycle method gets called every frame the obj is in scene
      update() {
        if (!this.isWaving)
          return;
        const t18 = time() * this.wave_speed;
        this.pos.y = this.wave_verPosition + this.amplitude * Math.cos(t18 * this.wave_speed);
      }
    };
  }

  // source/sound.ts
  var bg;
  var volumeText;
  var speaker;
  var trayVolElements;
  var volumeBars;
  var sfxHandlers = /* @__PURE__ */ new Set();
  function playSfx(sound, opts) {
    opts = opts || {};
    opts.detune = opts.detune || 0;
    opts.speed = opts.speed || 1;
    opts.loop = opts.loop || false;
    opts.volume = opts.volume || GameState.settings.sfx.muted == true ? 0 : GameState.settings.sfx.volume;
    let handle = play(sound, {
      volume: opts.volume,
      detune: opts.detune,
      speed: opts.speed,
      loop: opts.loop
    });
    sfxHandlers.add(handle);
    handle.onEnd(() => sfxHandlers.delete(handle));
    return handle;
  }
  function stopAllSounds() {
    sfxHandlers.forEach((handler) => {
      handler.stop();
    });
  }
  var musicHandler;
  function playMusic(song, opts) {
    opts = opts || {};
    opts.volume = opts.volume || GameState.settings.music.muted == true ? 0 : GameState.settings.music.volume;
    opts.loop = opts.loop || true;
    opts.detune = opts.detune || 0;
    musicHandler?.stop();
    musicHandler = play(song, {
      volume: opts.volume,
      loop: opts.loop,
      detune: opts.detune
    });
  }
  function changeVolume(type, volume2) {
    if (type == "sfx") {
      sfxHandlers.forEach((handler) => {
        handler.volume = volume2;
      });
    } else if (type == "music") {
      musicHandler.volume = volume2;
    }
  }
  function manageMute(type, mute) {
    if (type == "sfx") {
      GameState.settings.sfx.muted = mute;
      changeVolume("sfx", mute == true ? 0 : GameState.settings.sfx.volume);
    } else if (type == "music") {
      GameState.settings.music.muted = mute;
      changeVolume("music", mute == true ? 0 : GameState.settings.music.volume);
    }
  }
  function scratchSong() {
    musicHandler.winding = true;
    tween(musicHandler.detune, rand(-100, -150), 0.25, (p) => musicHandler.detune = p, easings.easeInQuint).then(() => {
      tween(musicHandler.detune, rand(100, 150), 0.25, (p) => musicHandler.detune = p, easings.easeInQuint);
    });
    tween(musicHandler.speed, rand(0.25, 0.5), 0.25, (p) => musicHandler.speed = p, easings.easeInQuint);
    tween(musicHandler.volume, rand(0.1, 0.5), 0.5, (p) => musicHandler.volume = p, easings.easeInQuint).then(() => {
      musicHandler.stop();
    });
  }
  var volChangeTune = 0;
  var showTween = null;
  function addSoundElements() {
    bg = add([
      rect(width() / 6, 80, { radius: 2.5 }),
      pos(width() / 2, 0),
      anchor("top"),
      color(BLACK),
      stay(),
      opacity(0.75),
      layer("sound"),
      z(0),
      "trayVolElement",
      {
        upYPos: -80,
        downYPos: 0
      }
    ]);
    bg.pos.y = bg.upYPos;
    volumeText = bg.add([
      text("VOLUME"),
      pos(0, bg.height - 12),
      anchor("center"),
      scale(0.6),
      layer("sound"),
      z(1),
      "trayVolElement"
    ]);
    speaker = volumeText.add([
      sprite("speakers"),
      opacity(1),
      pos(0, -64),
      scale(),
      anchor("center"),
      layer("sound"),
      z(1),
      "trayVolElement"
    ]);
    speaker.frame = 0;
    speaker.hidden = true;
    for (let i2 = 0; i2 < 10; i2++) {
      bg.add([
        pos(-67 + i2 * 15, 30),
        rect(10, bg.height - 40, { radius: 1 }),
        opacity(0),
        anchor("center"),
        layer("sound"),
        z(1),
        scale(),
        "trayVolElement",
        "trayVolBar",
        {
          volume: 0.1 * (i2 + 1),
          update() {
            if (GameState.settings.volume.toFixed(1) < this.volume.toFixed(1))
              this.opacity = 0.1;
            else
              this.opacity = 1;
          }
        }
      ]);
    }
    trayVolElements = get("trayVolElement", { recursive: true });
    volumeBars = get("trayVolBar", { recursive: true });
  }
  function volumeManager() {
    showTween = tween(GameState.settings.volume, GameState.settings.volume, 0, (p) => GameState.settings.volume = p, easings.linear);
    volume(GameState.settings.volume);
    let changeVolTune = 0;
    let waitingTimer = wait(0, function() {
    });
    musicHandler = play("clickRelease", { volume: 0 });
    musicHandler.winding = true;
    musicHandler.currentTime = 0;
    musicHandler.totalTime = 0;
    trayVolElements = get("trayVolElement", { recursive: true });
    let soundManager = add([
      stay(),
      {
        update() {
          GameState.settings.volume = parseFloat(GameState.settings.volume.toFixed(1));
          GameState.settings.sfx.volume = parseFloat(GameState.settings.sfx.volume.toFixed(1));
          GameState.settings.music.volume = parseFloat(GameState.settings.music.volume.toFixed(1));
          volChangeTune = map(GameState.settings.volume, 0, 1, -250, 0);
          if (isKeyPressed("-")) {
            this.trigger("show");
            if (GameState.settings.volume > 0) {
              GameState.settings.volume -= 0.1;
              volume(GameState.settings.volume);
              if (GameState.settings.volume == 0) {
                volumeText.text = "SOUND OFF";
              } else {
                volumeText.text = `VOLUME: ${(GameState.settings.volume * 100).toFixed(0)}%`;
                bop(volumeBars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)], 0.05);
              }
              get("trayVolBar", { recursive: true }).forEach((trayVolBar) => {
                trayVolBar.hidden = GameState.settings.volume == 0 ? true : false;
              });
              speaker.hidden = GameState.settings.volume == 0 ? false : true;
              speaker.frame = GameState.settings.volume == 0 ? 0 : 1;
            }
          } else if (isKeyPressed("+")) {
            this.trigger("show");
            get("trayVolBar", { recursive: true }).forEach((trayVolBar) => {
              trayVolBar.hidden = false;
            });
            speaker.hidden = true;
            speaker.frame = 1;
            if (GameState.settings.volume <= 0.9) {
              GameState.settings.volume += 0.1;
              volume(GameState.settings.volume);
            } else {
            }
            bop(volumeBars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)], 0.05);
            volumeText.text = `VOLUME: ${(GameState.settings.volume * 100).toFixed(0)}%`;
          } else if (isKeyPressed("n") && panderitoIndex != 3) {
            this.trigger("show");
            manageMute("sfx", !GameState.settings.sfx.muted);
            volumeText.text = `SFX: ${GameState.settings.sfx.muted ? "OFF" : "ON"}`;
            get("trayVolBar", { recursive: true }).forEach((trayVolBar) => {
              trayVolBar.hidden = true;
            });
            speaker.hidden = false;
            speaker.frame = GameState.settings.sfx.muted ? 0 : 1;
            bop(speaker, 0.05);
            if (get("sfxCheckbox", { recursive: true })[0]) {
              if (GameState.settings.sfx.muted)
                get("sfxCheckbox", { recursive: true })[0]?.turnOff();
              else
                get("sfxCheckbox", { recursive: true })[0]?.turnOn();
            }
          } else if (isKeyPressed("m")) {
            this.trigger("show");
            GameState.settings.music.muted = !GameState.settings.music.muted;
            volumeText.text = `MUSIC: ${GameState.settings.music.muted ? "OFF" : "ON"}`;
            get("trayVolBar", { recursive: true }).forEach((trayVolBar) => {
              trayVolBar.hidden = true;
            });
            speaker.hidden = false;
            speaker.frame = GameState.settings.music.muted ? 0 : 1;
            bop(speaker, 0.05);
            if (get("musicCheckbox", { recursive: true })[0]) {
              if (GameState.settings.music.muted)
                get("musicCheckbox", { recursive: true })[0]?.turnOff();
              else
                get("musicCheckbox", { recursive: true })[0]?.turnOn();
            }
            manageMute("music", GameState.settings.music.muted);
          }
        }
      }
    ]);
    soundManager.on("hide", () => {
      if (get("trayVolElement").length === 0)
        return;
      showTween.cancel();
      showTween = tween(bg.pos.y, bg.upYPos, 0.32, (p) => bg.pos.y = p, easings.easeOutQuad).then(() => {
        waitingTimer.cancel();
        waitingTimer = wait(0.5, () => {
          trayVolElements.forEach((soundElement) => {
            destroy(soundElement);
          });
        });
      });
    });
    soundManager.on("show", () => {
      if (get("trayVolElement").length === 0)
        addSoundElements();
      if (showTween) {
        showTween.cancel();
      }
      showTween = tween(bg.pos.y, bg.downYPos, 0.32, (p) => bg.pos.y = p, easings.easeOutQuad);
      waitingTimer.cancel();
      waitingTimer = wait(1, () => {
        soundManager.trigger("hide");
      });
      if (GameState.settings.volume < 10)
        play("volumeChange", { detune: changeVolTune });
    });
    return soundManager;
  }

  // source/game/plugins/drag.ts
  var curDraggin = null;
  function setCurDraggin(value = null) {
    curDraggin = value;
  }
  function drag(onlyX = false) {
    let offset = vec2(0);
    return {
      // Name of the component
      id: "drag",
      // This component requires the "pos" and "area" component to work
      require: ["pos", "area"],
      dragging: false,
      pick() {
        curDraggin = this;
        offset = mousePos().sub(this.pos);
        this.trigger("drag");
        this.dragging = true;
      },
      // "update" is a lifecycle method gets called every frame the obj is in scene
      update() {
        if (curDraggin === this) {
          if (onlyX == true)
            this.pos.x = mousePos().x - offset.x;
          else
            this.pos = this.pos = mousePos().sub(offset);
          this.trigger("dragUpdate");
        } else {
          this.dragging = false;
        }
      },
      onDrag(action) {
        return this.on("drag", action);
      },
      onDragUpdate(action) {
        return this.on("dragUpdate", action);
      },
      onDragEnd(action) {
        return this.on("dragEnd", action);
      },
      inspect() {
        return `dragging: ${this.dragging}`;
      }
    };
  }

  // source/game/plugins/dummyShadow.ts
  function dummyShadow() {
    return {
      // Name of the component
      id: "dummyShadow",
      require: ["pos", "area", "drag", "z"],
      shadow: null,
      add() {
        this.on("drag", () => {
          this.shadow = add([
            pos(this.pos),
            sprite(this.sprite),
            z(this.z - 1),
            rotate(0),
            color(BLACK),
            layer(this.layer),
            opacity(0.8),
            anchor("center")
          ]);
          this.shadow.onUpdate(() => {
            let xPos = map(this.pos.x, 0, width(), this.pos.x + 8, this.pos.x - 8);
            this.shadow.pos.x = lerp(this.pos.x, xPos, 0.75);
            this.shadow.pos.y = lerp(this.shadow.pos.y, this.pos.y + 8, 0.75);
            this.shadow.angle = lerp(this.shadow.angle, this.angle, 0.9);
          });
          this.on("dragEnd", () => {
            this.shadow?.destroy();
          });
        });
      },
      destroy() {
        this.shadow?.destroy();
      }
    };
  }

  // source/game/windows/windows-api/openWindowButton.ts
  var timeForHold = 0.18;
  function openWindowButton() {
    let lastPosClicked;
    return {
      id: "windowButton",
      require: ["rotate", "drag", "dummyShadow"],
      add() {
        let waitingHold = wait(0, () => {
        });
        this.onMousePress("left", () => {
          lastPosClicked = mousePos();
          if (!this.isBeingHovered)
            return;
          waitingHold.cancel();
          waitingHold = wait(timeForHold, () => {
            if (!this.isBeingHovered)
              return;
            if (curDraggin) {
              return;
            }
            this.trigger("hold");
          });
        });
        this.onMouseRelease("left", () => {
          if (this.dragging) {
            this.trigger("holdRelease");
          } else {
            waitingHold.cancel();
            if (!this.isBeingHovered)
              return;
            if (!this.hasPoint(lastPosClicked))
              return;
            if (curDraggin)
              return;
            this.trigger("press");
          }
        });
      },
      update() {
        if (this.dragging) {
          if (isMouseMoved())
            this.angle = lerp(this.angle, mouseDeltaPos().x, 0.25);
          else
            this.angle = lerp(this.angle, 0, 0.25);
        }
      },
      onPress(action) {
        return this.on("press", action);
      },
      onHold(action) {
        return this.on("hold", action);
      },
      onHoldRelease(action) {
        return this.on("holdRelease", action);
      }
    };
  }

  // source/game/hovers/outsideWindowHover.ts
  function outsideWindowHover() {
    return {
      id: "outsideHover",
      require: ["area"],
      isBeingHovered: false,
      startHoverAnim: null,
      endHoverAnim: null,
      startHoverFunction: null,
      endHoverFunction: null,
      add() {
        this.startHoverFunction = function() {
          if (curDraggin == null && this.isBeingHovered == false) {
            this.startHoverAnim();
            this.trigger("outsideHoverStart");
            mouse.play("point");
            this.isBeingHovered = true;
          }
        };
        this.endHoverFunction = function() {
          if (this.isBeingHovered == false || this.dragging == true)
            return;
          this.endHoverAnim();
          this.trigger("outsideHoverEnd");
          mouse.play("cursor");
          this.isBeingHovered = false;
        };
        this.onHover(() => {
          if (allObjWindows.isHoveringAWindow == false && allObjWindows.isDraggingAWindow == false) {
            this.startHoverFunction();
          }
        });
        this.onHoverEnd(() => {
          this.endHoverFunction();
        });
        this.on("cursorEnterWindow", (windowObj) => {
          if (this.isBeingHovered == true) {
            this.endHoverFunction();
          }
        });
        this.on("cursorExitWindow", (windowObj) => {
          if (this.isHovering()) {
            this.startHoverFunction();
          }
        });
      },
      startingHover(action) {
        this.startHoverAnim = action;
      },
      endingHover(action) {
        this.endHoverAnim = action;
      }
    };
  }

  // source/game/windows/windows-api/minibuttons.ts
  function getMinibuttonPos(taskbarIndex) {
    return getPosInGrid(folderObj.pos, 0, -taskbarIndex - 1, vec2(75, 0));
  }
  function addMinibutton(opts) {
    let quad;
    getSprite("bean")?.then((quady) => {
      quad = quady;
    });
    let idxForInfo = infoForWindows[opts.windowKey].idx;
    let destinedPosition;
    if (opts.destPosition)
      destinedPosition = opts.destPosition;
    else {
      let extraMb = infoForWindows[Object.keys(infoForWindows)[idxForInfo]].icon ? true : false;
      if (extraMb)
        destinedPosition = vec2(folderObj.pos.x, folderObj.pos.y - buttonSpacing);
      else
        destinedPosition = getMinibuttonPos(opts.taskbarIndex);
    }
    let currentMinibutton = add([
      sprite("white_noise"),
      pos(opts.initialPosition),
      anchor("center"),
      area({ scale: vec2(0) }),
      scale(1),
      opacity(1),
      rotate(0),
      drag(),
      color(),
      layer("ui"),
      z(folderObj.z - 1),
      dummyShadow(),
      openWindowButton(),
      outsideWindowHover(),
      `${opts.windowKey}`,
      "minibutton",
      infoForWindows[opts.windowKey].icon == "extra" ? "extraMinibutton" : "",
      {
        idxForInfo,
        taskbarIndex: opts.taskbarIndex,
        window: get(`${opts.windowKey}`, { recursive: true })[0] ?? null,
        windowInfo: infoForWindows[opts.windowKey],
        windowKey: opts.windowKey,
        nervousSpinSpeed: 10,
        saturation: 0,
        saturationColor: WHITE,
        defaultScale: vec2(1),
        dragHasSurpassed: false,
        destinedPosition,
        extraMb: infoForWindows[opts.windowKey].icon == "extra" ? true : null,
        shut: get("extraWin")[0] ? false : true,
        update() {
          if (this.dragging == false) {
            if (curDraggin?.is("minibutton") && !this.extraMb) {
              this.angle = wave(-8, 8, time() * 3);
              this.saturation = wave(5e-3, 0.05, time() * 3);
              if (Math.abs(curDraggin?.pos.sub(this.pos).x) < 15) {
                if (curDraggin.pos.x < this.pos.x && !this.dragHasSurpassed) {
                  this.trigger("dragHasSurpassed", true);
                }
                if (curDraggin.pos.x > this.pos.x && !this.dragHasSurpassed) {
                  this.trigger("dragHasSurpassed", false);
                }
              } else {
                this.dragHasSurpassed = false;
              }
            } else if (curDraggin?.is("gridMiniButton") && !this.extraMb) {
              this.angle = wave(-4, 4, time() * this.nervousSpinSpeed);
              this.saturation = wave(0.01, 0.1, time() * 3);
            } else if (curDraggin == null) {
              if (this.isBeingHovered) {
                this.angle = wave(-8, 8, time() * 3);
              } else {
                this.angle = lerp(this.angle, 0, 0.25);
              }
              if (this.window != null) {
                this.saturation = wave(0.01, 0.1, time() * 3);
              } else {
                this.saturation = 0;
              }
            }
            if (this.pos.dist(folderObj.pos) > 65) {
              this.area.scale = !this.extraMb ? vec2(0.75, 1.1) : vec2(0.75, 0.8);
              this.area.offset = vec2(2, 4);
            } else {
              this.area.scale = vec2(0);
            }
          }
          if (this.extraMb) {
            this.destinedPosition = vec2(folderObj.pos.x, folderObj.pos.y - buttonSpacing);
          } else {
            this.destinedPosition = getMinibuttonPos(this.taskbarIndex);
          }
        },
        drawInspect() {
          if (this.extraMb)
            return;
          drawText({
            text: this.taskbarIndex,
            pos: vec2(0, -this.height),
            anchor: "center",
            size: 25,
            color: WHITE
          });
        },
        click() {
          manageWindow(currentMinibutton.windowKey);
          bop(currentMinibutton);
          destroyExclamation(currentMinibutton);
        },
        pickFromTaskbar() {
          mouse.grab();
          this.pick();
          this.layer = "mouse";
          this.z = mouse.z - 1;
          folderObj.addSlots();
          playSfx("plap", { detune: 100 * this.windowInfo.idx / 4 });
          bop(this, 0.1);
          if (this.window)
            this.window.close();
        },
        releaseDrop() {
          curDraggin.trigger("dragEnd");
          setCurDraggin(null);
          mouse.releaseAndPlay("cursor");
          this.layer = "ui";
          this.z = folderObj.z - 1;
          let closestSlot = null;
          let closestDistance = Infinity;
          const minibuttonSlots = get("minibuttonslot");
          minibuttonSlots.forEach((slot) => {
            const distance = currentMinibutton.screenPos().dist(slot.screenPos());
            if (distance < closestDistance) {
              closestDistance = distance;
              closestSlot = slot;
            }
          });
          let movingTween = null;
          if (this.taskbarIndex != closestSlot.taskbarIndex)
            movingTween = tween(this.pos, get(`slot_${this.taskbarIndex}`)[0].pos, 0.32, (p) => this.pos = p, easings.easeOutQuint);
          if (this.taskbarIndex == closestSlot.taskbarIndex)
            movingTween = tween(this.pos, closestSlot.pos, 0.32, (p) => this.pos = p, easings.easeOutQuint);
          playSfx("plop", { detune: 100 * this.windowInfo.idx / 4 });
          this.z = folderObj.z - 1;
          get("minibuttonslot").filter((minibuttonslot) => minibuttonslot.taskbarIndex != this.taskbarIndex).forEach((minibuttonslot) => {
            destroy(minibuttonslot);
          });
          movingTween.onEnd(() => {
            let currentSlot = get(`slot_${this.taskbarIndex}`)[0];
            currentSlot?.fadeOut(0.32).onEnd(() => currentSlot?.destroy());
            if (this.isHovering() && !allObjWindows.isHoveringAWindow)
              this.startHoverFunction();
            else
              this.endHoverFunction();
          });
          get("minibutton").forEach((element) => {
            tween(element.angle, 0, 0.32, (p) => element.angle = p, easings.easeOutQuint);
          });
        }
      }
    ]);
    currentMinibutton.use(sprite(`icon_${infoForWindows[opts.windowKey].icon || opts.windowKey.replace("Win", "")}`));
    if (currentMinibutton.extraMb) {
      if (currentMinibutton.shut)
        currentMinibutton.play("shut_default");
      else
        currentMinibutton.play("open_default");
    } else
      currentMinibutton.play("default");
    currentMinibutton.opacity = 0;
    tween(currentMinibutton.opacity, 1, 0.32, (p) => currentMinibutton.opacity = p, easings.easeOutQuad);
    tween(currentMinibutton.pos, currentMinibutton.destinedPosition, 0.32, (p) => currentMinibutton.pos = p, easings.easeOutBack);
    currentMinibutton.on("dragHasSurpassed", (left) => {
      currentMinibutton.dragHasSurpassed = true;
      function swap(sourceObj, sourceKey, targetObj, targetKey) {
        let temp = sourceObj[sourceKey];
        sourceObj[sourceKey] = targetObj[targetKey];
        targetObj[targetKey] = temp;
      }
      GameState.taskbar[curDraggin.taskbarIndex] = currentMinibutton.windowKey;
      GameState.taskbar[currentMinibutton.taskbarIndex] = curDraggin.windowKey;
      swap(curDraggin, "taskbarIndex", currentMinibutton, "taskbarIndex");
      let newXPos = getMinibuttonPos(currentMinibutton.taskbarIndex).x;
      tween(currentMinibutton.pos.x, newXPos, 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutBack);
    });
    currentMinibutton.use(shader("saturate", () => ({
      "saturation": currentMinibutton.saturation,
      "saturationColor": currentMinibutton.saturationColor,
      "u_pos": vec2(quad.x, quad.y),
      "u_size": vec2(quad.w, quad.h)
    })));
    currentMinibutton.startingHover(() => {
      if (folded)
        return;
      playSfx("hoverMiniButton", { detune: 100 * currentMinibutton.windowInfo.idx / 4 });
      tween(currentMinibutton.pos.y, currentMinibutton.destinedPosition.y - 5, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint);
      tween(currentMinibutton.scale, vec2(1.05), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint);
      if (currentMinibutton.extraMb)
        currentMinibutton.shut ? currentMinibutton.play("shut_hover") : currentMinibutton.play("open_hover");
      else
        currentMinibutton.play("hover");
      if (currentMinibutton.extraMb || currentMinibutton.dragging)
        return;
      let newXPos = getMinibuttonPos(currentMinibutton.taskbarIndex).x;
      tween(currentMinibutton.pos.x, newXPos, 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint);
    });
    currentMinibutton.endingHover(() => {
      if (folded)
        return;
      if (allObjWindows.isDraggingAWindow)
        return;
      tween(currentMinibutton.pos.y, currentMinibutton.destinedPosition.y, 0.32, (p) => currentMinibutton.pos.y = p, easings.easeOutQuint);
      tween(currentMinibutton.angle, 0, 0.32, (p) => currentMinibutton.angle = p, easings.easeOutQuint);
      tween(currentMinibutton.scale, vec2(1), 0.32, (p) => currentMinibutton.scale = p, easings.easeOutQuint);
      currentMinibutton.defaultScale = vec2(1.05);
      if (currentMinibutton.extraMb)
        currentMinibutton.shut ? currentMinibutton.play("shut_default") : currentMinibutton.play("open_default");
      else
        currentMinibutton.play("default");
      mouse.play("cursor");
      if (currentMinibutton.extraMb || currentMinibutton.dragging)
        return;
      let newXPos = getMinibuttonPos(currentMinibutton.taskbarIndex).x;
      tween(currentMinibutton.pos.x, newXPos, 0.32, (p) => currentMinibutton.pos.x = p, easings.easeOutQuint);
    });
    currentMinibutton.onPress(() => {
      if (allObjWindows.isHoveringAWindow || allObjWindows.isDraggingAWindow)
        return;
      currentMinibutton.click();
    });
    if (currentMinibutton.windowKey != "extraWin") {
      currentMinibutton.onHold(() => {
        if (curDraggin)
          return;
        currentMinibutton.pickFromTaskbar();
        destroyExclamation(currentMinibutton);
      });
      currentMinibutton.onHoldRelease(() => {
        if (curDraggin == currentMinibutton) {
          currentMinibutton.releaseDrop();
        }
      });
    }
    return currentMinibutton;
  }

  // source/game/unlockables/unlockablewindows.ts
  var unlockableWindows = {
    "storeWin": {
      condition: () => GameState.score >= 25
    },
    "settingsWin": {
      condition: () => GameState.score >= 50
    },
    "statsWin": {
      condition: () => GameState.score >= 60
    },
    // they're unlocked at the same time lol!
    "extraWin": {
      condition: () => GameState.score >= 150
    },
    "musicWin": {
      condition: () => GameState.score >= 150
    },
    "medalsWin": {
      condition: () => GameState.score >= 105
    },
    "creditsWin": {
      condition: () => GameState.score >= 200
    },
    "leaderboardsWin": {
      condition: () => GameState.scoreAllTime >= 11e5
    },
    "ascendWin": {
      condition: () => GameState.scoreAllTime >= scoreManager.ascensionConstant
    }
  };
  function isWindowUnlocked(windowName) {
    return GameState.unlockedWindows.includes(windowName);
  }
  function destroyExclamation(obj) {
    obj?.get("exclamation")?.forEach((element) => {
      element?.fadeOut(0.1).onEnd(() => {
        destroy(element);
      });
    });
  }
  function addExclamation(obj) {
    if (obj.get("exclamation").length == 0) {
      let exclamation = obj.add([
        text("!", { font: "lambdao", size: 45 }),
        pos(obj.width / 2, -obj.height / 2),
        anchor("center"),
        scale(),
        opacity(1),
        waver({ maxAmplitude: 5 }),
        "exclamation",
        {
          times: 0,
          update() {
            if (obj.opacity != null)
              this.opacity = obj.opacity;
          }
        }
      ]);
      tween(-obj.height, -obj.height / 2, 0.32, (p) => exclamation.pos.y = p, easings.easeOutBack).onEnd(() => {
        exclamation.startWave();
      });
      tween(0.5, 1, 0.32, (p) => exclamation.opacity = p, easings.easeOutQuad);
    } else {
      let exclamation = obj.get("exclamation")[0];
      bop(exclamation);
    }
  }
  function unlockWindow(windowJustUnlocked) {
    GameState.unlockedWindows.push(windowJustUnlocked);
    playSfx("windowUnlocked");
    if (GameState.taskbar.length < 4 || windowJustUnlocked == "extraWin") {
      GameState.taskbar.push(windowJustUnlocked);
    } else {
    }
    if (folded == true) {
      addExclamation(folderObj);
      let unfoldCheckEvent = folderObj.on("unfold", () => {
        destroyExclamation(folderObj);
        if (GameState.taskbar.includes(windowJustUnlocked)) {
          let newlyUnlockedBtn = get("minibutton").filter((btn) => btn.windowKey == windowJustUnlocked)[0];
          addExclamation(newlyUnlockedBtn);
        } else if (GameState.taskbar.includes(windowJustUnlocked) == false) {
          let extraWinBtn = get("minibutton").filter((btn) => btn.windowKey == "extraWin")[0];
          addExclamation(extraWinBtn);
        }
        unfoldCheckEvent.cancel();
      });
    } else if (folded == false) {
      if (GameState.taskbar.includes(windowJustUnlocked)) {
        let newIndex = GameState.taskbar.indexOf(windowJustUnlocked);
        let btnForNewWindow = addMinibutton({
          windowKey: windowJustUnlocked,
          taskbarIndex: newIndex,
          initialPosition: folderObj.pos
        });
        addExclamation(btnForNewWindow);
      } else {
        let extraWinBtn = get("minibutton").filter((btn) => btn.windowKey == "extraWin")[0];
        addExclamation(extraWinBtn);
      }
    }
    if (GameState.taskbar.includes(windowJustUnlocked) == false) {
      let extraWinOpenCheck = ROOT.on("winOpen", (windowOpened) => {
        if (windowOpened == "extraWin") {
          let gridMinibtn = get("gridMiniButton", { recursive: true }).filter((btn) => btn.windowKey == windowJustUnlocked)[0];
          addExclamation(gridMinibtn);
          extraWinOpenCheck.cancel();
        }
      });
    }
    ROOT.trigger("winUnlock", windowJustUnlocked);
  }

  // source/game/ascension/cards.ts
  var cardsInfo = {
    "clickersCard": {
      info: "Clickers are +[number]% more efficient",
      basePrice: 1,
      percentageIncrease: 100,
      idx: 0,
      gamestateInfo: {
        key: "clickPercentage",
        objectAmount: "ascension.clickPercentagesBought"
      }
    },
    "cursorsCard": {
      info: "Cursors are +[number]% more efficient",
      basePrice: 1,
      percentageIncrease: 110,
      idx: 1,
      gamestateInfo: {
        key: "cursorsPercentage",
        objectAmount: "ascension.cursorsPercentagesBought"
      }
    },
    "powerupsCard": {
      info: "Powerups will be +[number]x more powerful",
      basePrice: 2,
      percentageIncrease: 120,
      idx: 2,
      gamestateInfo: {
        key: "powerupPower",
        objectAmount: "ascension.powerupPowersBought"
      }
    },
    "critsCard": {
      info: "Criticals will be +[number]x more powerful",
      basePrice: 3,
      percentageIncrease: 122,
      idx: 3,
      gamestateInfo: {
        key: "critPower",
        objectAmount: "ascension.critPowersBought"
      }
    },
    "hexColorCard": {
      info: "You can customize the hexagon's color",
      unlockPrice: 5,
      idx: 4
    },
    "bgColorCard": {
      info: "You can customize the background's color",
      unlockPrice: 5,
      idx: 5
    }
  };
  function cardTypes() {
    return Object.keys(cardsInfo).sort((a, b2) => cardsInfo[a].idx - cardsInfo[b2].idx);
  }
  var cardYPositions = {
    hidden: 691,
    /**
     * The position they are when they're stacked
     */
    dealing: 341,
    unhovered: 544,
    hovered: 524
  };
  function getAdditive(type) {
    let additive;
    if (type == "clickersCard" || type == "cursorsCard") {
      additive = randi(8, 12);
    } else if (type == "powerupsCard") {
      additive = randi(1, 5);
    } else if (type == "critsCard") {
      if (GameState.ascension.critPowersBought == 0)
        additive = 1;
      else
        additive = randi(10, 15);
    } else if (type == "hexColorCard" || type == "bgColorCard") {
      additive = 0;
    }
    return additive;
  }
  var typeToSprite = (type) => `card_${type.replace("Card", "")}`;
  function flipCard(card, newType) {
    let flipOneSideTime = 0.075;
    card.area.scale = vec2(0);
    tween(1, 0, flipOneSideTime, (p) => card.scale.x = p).onEnd(() => {
      card.type = newType;
      card.typeIdx = cardsInfo[card.type].idx;
      card.additive = getAdditive(card.type);
      card.sprite = typeToSprite(card.type);
      tween(0, 1, flipOneSideTime, (p) => card.scale.x = p).onEnd(() => {
        card.area.scale = vec2(1);
        card.trigger("flip");
      });
    });
  }
  function addCard(cardType, position) {
    let card = add([
      // starts at backcard
      sprite("backcard"),
      pos(position),
      rotate(0),
      layer("ascension"),
      z(6),
      scale(),
      anchor("center"),
      area({ scale: vec2(0) }),
      "card",
      "ascensionHover",
      {
        indexInDeck: 0,
        // 1 - 4 / 1 being leftmost
        price: 1,
        type: cardType,
        typeIdx: cardsInfo[cardType].idx,
        additive: getAdditive(cardType),
        update() {
          if (!(this.type == "hexColorCard" || this.type == "bgColorCard")) {
            let objectAmount = getVariable(GameState, cardsInfo[this.type].gamestateInfo.objectAmount);
            this.price = getPrice({
              basePrice: cardsInfo[this.type].basePrice,
              percentageIncrease: cardsInfo[this.type].percentageIncrease,
              objectAmount
            });
          } else {
            this.price = cardsInfo[this.type].unlockPrice;
          }
        },
        startHover() {
          tween(this.pos.y, cardYPositions.hovered, 0.25, (p) => this.pos.y = p, easings.easeOutQuart);
          tween(this.angle, choose([-1.5, 1.5]), 0.25, (p) => this.angle = p, easings.easeOutQuart);
          let message;
          if (this.type == "critsCard" && GameState.ascension.critPowersBought == 0) {
            message = "When you click, you will have a random chance of getting more score per click";
          } else {
            message = cardsInfo[this.type].info.replace("[number]", this.additive);
            if (!(this.type == "hexColorCard" || this.type == "bgColorCard")) {
              let addition = getVariable(GameState, cardsInfo[this.type].gamestateInfo.objectAmount);
              if (this.type == "powerupsCard" || this.type == "critsCard") {
                message += ` (Current power: ${addition}x)`;
              } else {
                message += ` (You have: ${addition}%)`;
              }
            }
          }
          talk("card", message);
          playSfx("onecard", { detune: rand(-75, 75) * this.indexInDeck });
        },
        buy() {
          tween(0.75, 1, 0.15, (p) => this.scale.y = p, easings.easeOutQuart);
          if (this.type == "hexColorCard" || this.type == "bgColorCard") {
            let oldType = this.type;
            flipCard(card, cardTypes()[this.typeIdx - 2]);
            let endascensioncheck = ROOT.on("endAscension", () => {
              wait(1, () => {
                unlockWindow(oldType.replace("Card", "Win"));
              });
              endascensioncheck.cancel();
            });
          } else {
            if (this.type == "critsCard" && GameState.ascension.critPowersBought == 0) {
              GameState.critPower = 1;
              GameState.ascension.critPowersBought = 1;
            } else {
              let currentPercentage = getVariable(GameState, cardsInfo[this.type].gamestateInfo.key);
              let percentagesBought = getVariable(GameState, cardsInfo[this.type].gamestateInfo.objectAmount);
              setVariable(GameState, cardsInfo[this.type].gamestateInfo.key, currentPercentage + this.additive);
              setVariable(GameState, cardsInfo[this.type].gamestateInfo.objectAmount, percentagesBought + 1);
            }
            this.additive = getAdditive(this.type);
            this.startHover();
          }
          function subMana(amount) {
            tween(GameState.ascension.mana, GameState.ascension.mana - amount, 0.32, (p) => GameState.ascension.mana = Math.round(p), easings.easeOutExpo);
          }
          subMana(this.price);
          playSfx("kaching", { detune: rand(-50, 50) });
          if (ascension.canLeave == false) {
            ascension.canLeave = true;
            ROOT.trigger("canLeaveAscension");
          }
        },
        drawInspect() {
          drawText({
            text: `deck: ${this.indexInDeck}
type: ${this.typeIdx} - ${this.type}`,
            pos: vec2(0, -this.height),
            anchor: "center",
            size: 25,
            color: WHITE
          });
        }
      }
    ]);
    card.on("dealingOver", () => {
      card.onHover(() => {
        card.startHover();
      });
      card.onHoverEnd(() => {
        tween(card.pos.y, cardYPositions.unhovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart);
      });
      card.onClick(() => {
        if (GameState.ascension.mana >= card.price)
          card.buy();
        else {
          tween(0.75, 1, 0.15, (p) => card.scale.x = p, easings.easeOutQuart);
        }
      });
      const greenPrice = GREEN.lighten(30);
      const redPrice = RED.lighten(30);
      card.onDraw(() => {
        drawText({
          text: `${card.price}\u2726`,
          align: "center",
          anchor: "center",
          pos: vec2(0, 35),
          size: 26,
          scale: card.scale,
          color: GameState.ascension.mana >= card.price ? greenPrice : redPrice
        });
        if (!(card.type == "hexColorCard" || card.type == "bgColorCard")) {
          drawText({
            text: `+${card.additive}%`,
            size: 15,
            color: BLACK,
            align: "left",
            pos: vec2(-59, -82)
          });
        }
      });
    });
    return card;
  }
  function spawnCards() {
    const cardSpacing = 150;
    let cardsToAdd = [
      "clickersCard",
      "cursorsCard",
      !isWindowUnlocked("hexColorWin") ? "hexColorCard" : "powerupsCard",
      !isWindowUnlocked("bgColorWin") ? "bgColorCard" : "critsCard"
    ];
    let dealingXPosition = 947;
    playSfx("allcards", { detune: rand(-25, 25) });
    cardsToAdd.forEach((cardToAdd, index) => {
      let card = addCard(cardToAdd, vec2(dealingXPosition, cardYPositions.hidden));
      card.angle = rand(-4, 4);
      card.pos.x = dealingXPosition + rand(-5, 5);
      card.pos.y = cardYPositions.hidden;
      card.indexInDeck = index;
      let randOffset = rand(-5, 5);
      tween(card.pos.y, cardYPositions.dealing + randOffset, 0.75, (p) => card.pos.y = p, easings.easeOutQuint);
      function dealTheCards() {
        wait(0.25 * card.indexInDeck, () => {
          function getCardXPos(index2) {
            let startPoint = 492;
            return startPoint + cardSpacing + cardSpacing * (index2 - 1);
          }
          playSfx("onecard", { detune: rand(-25, 25) * card.indexInDeck });
          tween(card.angle, rand(-1.5, 1.5), 0.25, (p) => card.angle = p, easings.easeOutQuart);
          tween(card.pos.x, getCardXPos(card.indexInDeck), 0.25, (p) => card.pos.x = p, easings.easeOutQuart);
          tween(card.pos.y, cardYPositions.unhovered, 0.25, (p) => card.pos.y = p, easings.easeOutQuart);
          tween(card.scale.x, 0, 0.25, (p) => card.scale.x = p, easings.easeOutQuart).onEnd(() => {
            card.sprite = typeToSprite(card.type);
            tween(card.scale.x, 1, 0.25, (p) => card.scale.x = p, easings.easeOutQuart).onEnd(() => {
              card.area.scale = vec2(1);
              card.trigger("dealingOver");
            });
          });
        });
      }
      wait(0.75, () => {
        dealTheCards();
      });
    });
  }

  // source/game/plugins/positionSetter.ts
  function positionSetter() {
    return {
      id: "setterAnimation",
      distance: 1,
      require: ["pos"],
      update() {
        if (this.parent.is("setterAnimation"))
          return;
        if (isKeyDown("shift") && isKeyDown("control"))
          this.distance = 50;
        else if (isKeyDown("shift"))
          this.distance = 5;
        else if (isKeyDown("control"))
          this.distance = 10;
        else
          this.distance = 1;
        if (isKeyPressedRepeat("up")) {
          this.pos.y -= this.distance;
          debug.log(this.pos);
        }
        if (isKeyPressedRepeat("down")) {
          this.pos.y += this.distance;
          debug.log(this.pos);
        }
        if (isKeyPressedRepeat("left")) {
          this.pos.x -= this.distance;
          debug.log(this.pos);
        }
        if (isKeyPressedRepeat("right")) {
          this.pos.x += this.distance;
          debug.log(this.pos);
        }
      },
      add() {
      }
    };
  }

  // source/game/ascension/ascension.ts
  var ascension = {
    ascending: false,
    canLeave: false
  };
  var activeLetterWaits = [];
  var currentlySaying = "";
  function addMage() {
    let mage_color = rgb(0, 51, 102);
    let mage;
    mage = add([
      pos(-17, 154),
      waver({ wave_speed: 1, maxAmplitude: 2.5 }),
      layer("ascension"),
      z(1),
      opacity(1),
      anchor("center"),
      "mage"
    ]);
    mage.startWave();
    let mage_body = mage.add([
      pos(),
      sprite("mage_body"),
      z(2),
      "mage_body"
    ]);
    let mage_body_lightning = mage.add([
      pos(),
      sprite("mage_body_lightning"),
      z(3),
      opacity(0.25),
      "mage_lightning"
    ]);
    let mage_cursors = mage.add([
      pos(0, -7),
      sprite("mage_cursors"),
      z(0),
      waver({ wave_speed: 1, maxAmplitude: 5 }),
      opacity(1),
      color(WHITE.darken(50))
    ]);
    mage_cursors.startWave();
    let mage_eye = mage.add([
      pos(117, 120),
      sprite("mage_eye"),
      area({ scale: 0.8 }),
      z(2),
      "ascensionHover",
      {
        timeToBlinkAgain: 8,
        timeUntilBlink: 8,
        update() {
          if (this.isHovering() && isMousePressed("left")) {
            this.play("blink");
            talk("mage", "stop that");
          }
          this.timeToBlinkAgain -= dt();
          if (this.timeToBlinkAgain < 0) {
            this.timeToBlinkAgain = rand(5, 8);
            this.timeToBlinkAgain = this.timeToBlinkAgain;
            if (chance(0.75))
              this.play("blink");
          }
        }
      }
    ]);
    mage_eye.onAnimEnd((anim) => {
    });
    let mage_toparm = mage.add([
      pos(0, 0),
      sprite("mage_toparm"),
      z(1),
      {
        update() {
          this.angle = wave(-0.5, 0.5, time());
        }
      }
    ]);
    let mage_toparm_lightning = mage.add([
      pos(0, 0),
      sprite("mage_toparm_lightning"),
      z(4),
      opacity(0.25),
      "mage_lightning",
      {
        update() {
          this.angle = wave(-0.5, 0.5, time());
        }
      }
    ]);
    let mage_botarm = mage.add([
      pos(5, 240),
      sprite("mage_botarm"),
      z(7),
      anchor("left"),
      {
        update() {
          this.angle = wave(-1, 1, time());
        }
      }
    ]);
    let mage_botarm_lightning = mage.add([
      pos(5, 240),
      sprite("mage_botarm_lightning"),
      z(8),
      anchor("left"),
      opacity(0.25),
      "mage_lightning",
      {
        update() {
          this.angle = wave(-1, 1, time());
        }
      }
    ]);
    let mage_hexagon = mage.add([
      pos(GameState.settings.panderitoMode ? vec2(231, 250) : vec2(231, 244)),
      sprite(GameState.settings.panderitoMode ? "panderito" : "hexagon"),
      scale(0.35),
      waver({ wave_speed: 1, maxAmplitude: 10 }),
      rotate(0),
      anchor("center"),
      color(WHITE),
      z(5),
      area({ scale: 0.8 }),
      "hexagon",
      "ascensionHover",
      {
        update() {
          if (this.isHovering() && isMousePressed("left")) {
            bop(this, 0.01);
            talk("mage", "no backsies");
          }
          this.angle += 0.02;
        }
      }
    ]);
    mage.get("mage_lightning").forEach((o) => o.onUpdate(() => {
      o.color = mage_hexagon.color;
    }));
    return mage;
  }
  var dialogue;
  function addDialogueBox() {
    let box = add([
      sprite("dialogue"),
      pos(623, 144),
      anchor("center"),
      scale(),
      area({ scale: 0.8 }),
      opacity(),
      layer("ascension"),
      z(1),
      "textbox",
      {
        defaultPos: vec2(623, 144)
      }
    ]);
    box.on("talk", (speaker2) => {
      if (speaker2 == "card") {
        box.use(sprite("hoverDialogue"));
        tween(box.defaultPos.y + 10, box.defaultPos.y, 0.25, (p) => box.pos.y = p, easings.easeOutQuint);
      } else if (speaker2 == "mage") {
        box.use(sprite("dialogue"));
        tween(box.defaultPos.x - 10, box.defaultPos.x, 0.25, (p) => box.pos.x = p, easings.easeOutQuint);
      }
      tween(0.75, 1, 0.25, (p) => box.scale.x = p, easings.easeOutQuint);
    });
    box.onClick(() => {
      if (dialogue.textBox.text == currentlySaying)
        return;
      skipTalk();
    });
    tween(0.5, 1, 0.25, (p) => box.scale.x = p, easings.easeOutQuint);
    tween(0, 1, 0.25, (p) => box.opacity = p, easings.easeOutQuint);
    return box;
  }
  function addDialogueText() {
    let textBox = add([
      text("", {
        styles: {
          "wavy": (idx) => ({
            pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5))
          })
        },
        width: 606,
        // width without tail
        align: "center",
        size: 25
      }),
      pos(670, 127),
      anchor("center"),
      color(BLACK),
      layer("ascension"),
      opacity(),
      z(dialogue.box.z + 1),
      "textbox",
      "boxText"
    ]);
    return textBox;
  }
  function talk(speaker2, thingToSay, speed) {
    dialogue.box.trigger("talk", speaker2);
    speaker2 = speaker2 || "card";
    thingToSay = thingToSay || "No dialogue, missing a dialogue here";
    speed = speed || 0.025;
    if (currentlySaying == thingToSay)
      speed /= 2;
    currentlySaying = thingToSay;
    activeLetterWaits.forEach((waitCall) => waitCall.cancel());
    activeLetterWaits = [];
    dialogue.textBox.text = "";
    let currentDelay = 0;
    Array.from(thingToSay).forEach((letter, index) => {
      let delay = speed;
      if (letter === "," || letter === "_") {
        delay = speed * 5;
      }
      currentDelay += delay;
      const waitCall = wait(currentDelay, () => {
        if (letter !== "_")
          dialogue.textBox.text += letter;
      });
      activeLetterWaits.push(waitCall);
    });
  }
  function skipTalk() {
    activeLetterWaits.forEach((waitCall) => waitCall.cancel());
    dialogue.textBox.text = currentlySaying;
    tween(dialogue.box.defaultPos.y + 10, dialogue.box.defaultPos.y, 0.25, (p) => dialogue.box.pos.y = p, easings.easeOutQuint);
    tween(dialogue.box.defaultPos.x + 10, dialogue.box.defaultPos.x, 0.25, (p) => dialogue.box.pos.x = p, easings.easeOutQuint);
  }
  function triggerAscension() {
    ascension.ascending = true;
    GameState.ascension.magicLevel++;
    ROOT.trigger("ascension", { score: GameState.score, scoreThisRun: GameState.scoreThisRun });
    hexagon.interactable = false;
    folderObj.interactable = false;
    folderObj.fold();
    get("window").forEach((window2) => {
      window2.close();
    });
    tween(hexagon.scaleIncrease, 0, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutCubic);
    tween(hexagon.stretchScaleIncrease, 0, 0.35, (p) => hexagon.stretchScaleIncrease = p, easings.easeOutCubic);
    tween(hexagon.maxScaleIncrease, 0, 0.35, (p) => hexagon.maxScaleIncrease = p, easings.easeOutCubic);
    let blackBg = add([
      rect(width(), height()),
      color(BLACK),
      fixed(),
      opacity(0.5),
      anchor("center"),
      pos(center()),
      z(0),
      layer("ascension"),
      "ascensionBg"
    ]);
    let mage = addMage();
    mage.pos.x = -489;
    blackBg.fadeIn(0.35).onEnd(() => {
      tween(-489, -17, 0.5, (p) => mage.pos.x = p, easings.easeOutQuart);
      tween(145, 154, 0.5, (p) => mage.pos.y = p, easings.easeOutQuart);
      tween(0.5, 1, 0.5, (p) => mage.opacity = p, easings.easeOutQuart).onEnd(() => {
        dialogue = add([]);
        dialogue.box = addDialogueBox();
        dialogue.textBox = addDialogueText();
        talk("mage", "welcome to fortnite");
        mage.trigger("endAnimating");
      });
    });
    spawnCards();
    wait(0.1, () => {
      let manaText = add([
        text("", { align: "left", font: "lambdao", size: 38 }),
        pos(4, 19),
        anchor("left"),
        layer("ascension"),
        opacity(1),
        "manaText",
        {
          hiddenXPos: -72,
          update() {
            this.text = `\u2726${GameState.ascension.mana}`;
          }
        }
      ]);
      manaText.fadeIn(0.35);
      tween(manaText.hiddenXPos, 4, 0.5, (p) => manaText.pos.x = p, easings.easeOutQuart);
    });
    let canLeaveAscensionCheck = ROOT.on("canLeaveAscension", () => {
      let leaveButton = add([
        sprite("confirmAscension"),
        layer("ascension"),
        z(6),
        pos(960, 289),
        layer("ascension"),
        scale(),
        area(),
        anchor("center"),
        positionSetter(),
        opacity(),
        "ascensionHover",
        "leaveButton",
        {
          dscale: vec2(0.8),
          update() {
            if (ascension.canLeave == true) {
              this.area.scale = vec2(1);
            } else {
              this.area.scale = vec2(0);
            }
          }
        }
      ]);
      leaveButton.fadeIn(0.1, easings.easeOutQuad);
      leaveButton.onHover(() => {
        tween(leaveButton.scale, vec2(1.2), 0.35, (p) => leaveButton.scale = p, easings.easeOutQuint);
      });
      leaveButton.onHoverEnd(() => {
        tween(leaveButton.scale, vec2(1), 0.35, (p) => leaveButton.scale = p, easings.easeOutQuint);
      });
      mage.on("endAnimating", () => {
        leaveButton.onUpdate(() => {
          if (ascension.canLeave == true)
            leaveButton.opacity = 1;
          else
            leaveButton.opacity = 0.75;
        });
      });
      leaveButton.onClick(() => {
        leaveButton.area.scale = vec2(0);
        bop(leaveButton);
        playSfx("clickButton");
        mouse.play("point");
        endAscension();
      });
      canLeaveAscensionCheck.cancel();
    });
    let startHover = onHover("ascensionHover", () => {
      mouse.play("point");
    });
    let endHover = onHoverEnd("ascensionHover", () => {
      mouse.play("cursor");
    });
    blackBg.onDestroy(() => {
      startHover.cancel();
      endHover.cancel();
    });
  }
  function endAscension() {
    folderObj.interactable = true;
    ROOT.trigger("endAscension");
    get("*", { recursive: true }).filter((obj) => obj.layer == "ascension").forEach((obj) => {
      if (obj.is("area"))
        obj.area.scale = vec2(0);
      if (obj.is("mage") || obj.is("manaText")) {
        tween(obj.pos.x, obj.pos.x - obj.width, 0.5, (p) => obj.pos.x = p, easings.easeOutQuart).onEnd(() => destroy(obj));
      } else if (obj.is("card")) {
        tween(obj.pos.y, obj.pos.y + obj.height, 0.5, (p) => obj.pos.y = p, easings.easeOutQuart).onEnd(() => destroy(obj));
      } else if (obj.is("textbox")) {
        tween(obj.pos.y, -obj.height, 0.5, (p) => obj.pos.y = p, easings.easeOutQuart).onEnd(() => destroy(obj));
      } else if (obj.is("ascensionBg") || obj.is("leaveButton")) {
        obj.fadeOut(0.5).onEnd(() => destroy(obj));
      }
    });
    scoreManager.resetRun();
    wait(0.25, () => {
      tween(hexagon.scaleIncrease, 1, 0.25, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint);
      tween(hexagon.maxScaleIncrease, 1, 0.25, (p) => hexagon.maxScaleIncrease = p, easings.easeOutQuint);
      tween(hexagon.stretchScaleIncrease, 1, 0.25, (p) => hexagon.stretchScaleIncrease = p, easings.easeOutQuint).onEnd(() => {
        hexagon.interactable = true;
      });
      hexagonIntro();
    });
    wait(0.5, () => {
      ascension.canLeave = false;
    });
  }

  // source/game/plugins/confetti.ts
  var DEF_COUNT = 80;
  var DEF_GRAVITY = 800;
  var DEF_AIR_DRAG = 0.9;
  var DEF_VELOCITY = [1e3, 4e3];
  var DEF_ANGULAR_VELOCITY = [-200, 200];
  var DEF_FADE = 0.3;
  var DEF_SPREAD = 60;
  var DEF_SPIN = [2, 8];
  var DEF_SATURATION = 0.7;
  var DEF_LIGHTNESS = 0.6;
  function addConfetti(opt) {
    const sample = (s) => typeof s === "function" ? s() : s;
    for (let i2 = 0; i2 < (opt.count ?? DEF_COUNT); i2++) {
      const p = add([
        pos(sample(opt.pos ?? vec2(0, 0))),
        choose([
          rect(rand(5, 20), rand(5, 20)),
          circle(rand(3, 10))
        ]),
        color(sample(opt.color ?? hsl2rgb(rand(0, 1), DEF_SATURATION, DEF_LIGHTNESS))),
        opacity(1),
        lifespan(4),
        scale(1),
        anchor("center"),
        rotate(rand(0, 360))
      ]);
      const spin = rand(DEF_SPIN[0], DEF_SPIN[1]);
      const gravity = opt.gravity ?? DEF_GRAVITY;
      const airDrag = opt.airDrag ?? DEF_AIR_DRAG;
      const heading = sample(opt.heading ?? 0) - 90;
      const spread = opt.spread ?? DEF_SPREAD;
      const head = heading + rand(-spread / 2, spread / 2);
      const fade = opt.fade ?? DEF_FADE;
      const vel = sample(opt.velocity ?? rand(DEF_VELOCITY[0], DEF_VELOCITY[1]));
      let velX = Math.cos(deg2rad(head)) * vel;
      let velY = Math.sin(deg2rad(head)) * vel;
      const velA = sample(opt.angularVelocity ?? rand(DEF_ANGULAR_VELOCITY[0], DEF_ANGULAR_VELOCITY[1]));
      p.onUpdate(() => {
        velY += gravity * dt();
        p.pos.x += velX * dt();
        p.pos.y += velY * dt();
        p.angle += velA * dt();
        p.opacity -= fade * dt();
        velX *= airDrag;
        velY *= airDrag;
        p.scale.x = wave(-1, 1, time() * spin);
      });
    }
  }

  // source/game/hovers/insideWindowHover.ts
  function insideWindowHover(winParent) {
    return {
      id: "insideHover",
      require: ["area"],
      isBeingHovered: false,
      startHoverAnim: null,
      endHoverAnim: null,
      startHoverFunction: null,
      endHoverFunction: null,
      winParent,
      add() {
        this.startHoverFunction = function() {
          if (this.isBeingHovered == false) {
            this.startHoverAnim();
            this.trigger("insideHoverStart");
            this.isBeingHovered = true;
          }
        };
        this.endHoverFunction = function() {
          if (this.isBeingHovered == true) {
            this.endHoverAnim();
            this.trigger("insideHoverEnd");
            this.isBeingHovered = false;
          }
        };
        this.onHover(() => {
          if (curDraggin)
            return;
          if (this.winParent.active == false)
            return;
          this.startHoverFunction();
        });
        this.onHoverEnd(() => {
          if (this.dragging == true)
            return;
          if (this.winParent.active == false)
            return;
          this.endHoverFunction();
        });
      },
      startingHover(action) {
        this.startHoverAnim = action;
      },
      endingHover(action) {
        this.endHoverAnim = action;
      }
    };
  }

  // source/game/windows/store/upgrades.ts
  var upgradeInfo = {
    "k_0": { value: 2, price: 500 },
    "k_1": { value: 4, price: 5e3 },
    // TODO: look into this, between first and second there's a 5x gap, i think that's good
    "k_2": { value: 8, price: 1e4 },
    // ending
    "k_3": { value: 16, price: 15e4 },
    "k_4": { value: 32, price: 6e5 },
    "k_5": { value: 64, price: 75e4 },
    // freq
    "c_0": { freq: 10 },
    // 10 seconds
    "c_1": { freq: 5, price: 25e4 },
    // 5 seconds
    "c_2": { freq: 1, price: 5e5 },
    // 1 second
    // cursor values
    "c_3": { value: 16, price: 5e4 },
    "c_4": { value: 32, price: 1e5 },
    "c_5": { value: 64, price: 5e5 }
  };
  function isUpgradeBought(id) {
    return GameState.upgradesBought.includes(id);
  }
  function addUpgrades(elementParent) {
    let winParent = elementParent.parent;
    let initialPos2 = vec2(-27.5, -31.5);
    let desiredPos = vec2(initialPos2.x, initialPos2.y);
    let spacing2 = vec2(55);
    for (let i2 = 0; i2 < 6; i2++) {
      if (i2 == 3) {
        desiredPos.y += spacing2.y;
        desiredPos.x = initialPos2.x;
      }
      desiredPos.x += spacing2.x;
      let progressSound = null;
      let downEvent = null;
      let elementColor = elementParent.is("clickersElement") ? rgb(49, 156, 222) : rgb(49, 222, 58);
      let newColor = blendColors(elementColor.lighten(310), elementColor, map(i2, 0, 6, 0.5, 1));
      let upgradeObj = elementParent.add([
        sprite("upgrade"),
        pos(desiredPos),
        color(newColor),
        anchor("center"),
        scale(1),
        z(winParent.z + 1),
        area({ scale: vec2(1.15, 1.15) }),
        outline(5, BLACK),
        insideWindowHover(elementParent.parent),
        "upgrade",
        {
          type: elementParent.is("clickersElement") ? "k_" : "c_",
          idx: i2,
          // is setted below
          value: null,
          freq: null,
          id: "",
          price: 0,
          boughtProgress: 0,
          manageBlinkText(texty = "missing a text there buddy") {
            let thisUpgrade = this;
            function addT() {
              let stacksText = thisUpgrade.parent.get("stacksText")[0];
              let blinkingText = elementParent.add([
                text("+0", { align: "left", size: stacksText.textSize + 4 }),
                pos(),
                color(BLACK),
                anchor("left"),
                layer("windows"),
                opacity(),
                positionSetter(),
                "blinkText",
                {
                  upgradeId: thisUpgrade.id,
                  update() {
                    this.text = texty;
                    this.opacity = wave(0.25, 1, time() * 8);
                  }
                }
              ]);
              if (thisUpgrade.freq == null) {
                blinkingText.pos.x = -56;
                blinkingText.pos.y = stacksText.pos.y - 15;
              } else {
                blinkingText.pos.x = -56;
                blinkingText.pos.y = 56;
              }
            }
            function end() {
              elementParent.get("blinkText", { recursive: true }).filter((t18) => t18.upgradeId == thisUpgrade.id).forEach((t18) => t18.destroy());
            }
            return { addT, end };
          },
          dropBuy() {
            tween(this.scale, this.isHovering() ? vec2(1.1) : vec2(1), 0.15, (p) => this.scale = p, easings.easeOutQuad);
            tween(this.boughtProgress, 0, 0.15, (p) => this.boughtProgress = p, easings.easeOutQuad);
            this.trigger("dropBuy");
            downEvent?.cancel();
            downEvent = null;
          },
          buy() {
            this.tooltip?.end();
            GameState.upgradesBought.push(this.id);
            playSfx("kaching", { detune: 25 * this.idx });
            tween(this.scale, vec2(1.1), 0.15, (p) => this.scale = p, easings.easeOutQuad);
            if (this.type == "k_") {
              if (GameState.clicksUpgradesValue == 1)
                GameState.clicksUpgradesValue += this.value - 1;
              else
                GameState.clicksUpgradesValue += this.value;
            } else if (this.type == "c_") {
              if (this.value != null) {
                if (GameState.cursorsUpgradesValue == 1)
                  GameState.cursorsUpgradesValue += this.value - 1;
                else
                  GameState.cursorsUpgradesValue += this.value;
              } else if (this.freq != null)
                GameState.timeUntilAutoLoopEnds = this.freq;
            }
            scoreManager.subTweenScore(this.price);
            ROOT.trigger("buy", { element: "upgrade", id: this.id, price: this.price });
            this.trigger("buy");
          },
          draw() {
            drawText({
              text: this.freq != null ? `${this.freq}s` : `x${this.value}`,
              anchor: "center",
              font: "lambda",
              size: this.height / 2,
              align: "center"
            });
            if (isUpgradeBought(upgradeObj.id))
              return;
            drawRect({
              width: this.width,
              height: map(this.boughtProgress, 0, 100, this.height, 0),
              anchor: "bot",
              radius: 10,
              color: BLACK,
              opacity: map(this.boughtProgress, 0, 100, 0.5, 0.05),
              pos: vec2(0, this.height / 2)
            });
            drawSprite({
              sprite: "upgradelock",
              pos: vec2(upgradeObj.width / 2, -upgradeObj.height / 2 + 5),
              anchor: "center",
              scale: vec2(0.7),
              color: GameState.score >= this.price ? GREEN.lighten(100) : RED.lighten(100),
              opacity: map(this.boughtProgress, 0, 100, 1, 0.1)
            });
          },
          inspect() {
            return `upgradeId: ${this.id}`;
          }
        }
      ]);
      const addedPosition = upgradeObj.pos;
      upgradeObj.id = upgradeObj.type + upgradeObj.idx;
      upgradeObj.price = upgradeInfo[upgradeObj.id].price;
      if (upgradeObj.type == "k_")
        upgradeObj.value = upgradeInfo[upgradeObj.id].value;
      else if (upgradeObj.type == "c_") {
        if (upgradeObj.idx > -1 && upgradeObj.idx < 3)
          upgradeObj.freq = upgradeInfo[upgradeObj.id].freq;
        else
          upgradeObj.value = upgradeInfo[upgradeObj.id].value;
      }
      upgradeObj.outline.color = upgradeObj.color.darken(10);
      let upgradeTooltip = null;
      const addPriceTooltip = () => {
        let tooltip = addTooltip(upgradeObj, {
          text: `${formatNumber(upgradeObj.price, { price: true, fixAmount: 0 })}`,
          textSize: upgradeObj.height / 2,
          direction: "down",
          lerpValue: 0.95,
          type: "price",
          layer: winParent.layer,
          z: winParent.z
        });
        tooltip.tooltipText.onUpdate(() => {
          GameState.score >= upgradeObj.price ? tooltip.tooltipText.color = GREEN : tooltip.tooltipText.color = RED;
        });
        tooltip.tooltipBg.z += 1;
        return tooltip;
      };
      upgradeObj.startingHover(() => {
        upgradeObj.parent.endHoverFunction();
        tween(upgradeObj.parent.opacity, 0.9, 0.15, (p) => upgradeObj.parent.opacity = p, easings.easeOutQuad);
        tween(upgradeObj.scale, vec2(1.1), 0.15, (p) => upgradeObj.scale = p, easings.easeOutQuad);
        let textInBlink = upgradeObj.value != null ? `+${upgradeObj.value}` : `Clicks every ${upgradeObj.freq} ${upgradeObj.freq > 1 ? "seconds" : "second"}`;
        if (!isUpgradeBought(upgradeObj.id)) {
          if (upgradeObj.tooltip == null) {
            upgradeTooltip = addPriceTooltip();
            upgradeObj.manageBlinkText(textInBlink).addT();
          }
        }
      });
      upgradeObj.endingHover(() => {
        upgradeObj.parent.startHoverFunction();
        tween(upgradeObj.parent.opacity, 1, 0.15, (p) => upgradeObj.parent.opacity = p, easings.easeOutQuad);
        if (!isUpgradeBought(upgradeObj.id) && upgradeObj.boughtProgress > 0 && GameState.score >= upgradeObj.price)
          upgradeObj.dropBuy();
        tween(upgradeObj.scale, vec2(1), 0.15, (p) => upgradeObj.scale = p, easings.easeOutQuad);
        if (upgradeObj.tooltip != null) {
          upgradeObj.tooltip?.end();
          upgradeObj.manageBlinkText().end();
        }
      });
      upgradeObj.onClick(() => {
        if (!winParent.active)
          return;
        if (isUpgradeBought(upgradeObj.id)) {
          bop(upgradeObj);
          upgradeObj.trigger("dummyClick");
          let sillyParticle = elementParent.add([
            sprite("cursors"),
            opacity(),
            pos(upgradeObj.pos.x, upgradeObj.pos.y - upgradeObj.height / 2 + 5),
            anchor("center"),
            z(upgradeObj.z - 1),
            scale(rand(0.25, 0.5)),
            {
              update() {
                this.pos.y -= 1.5;
                this.pos.x = wave(upgradeObj.pos.x - 5, upgradeObj.pos.x + 5, time() * 5);
                if (this.pos.y < getPositionOfSide(upgradeObj).top)
                  this.z = upgradeObj.z + 1;
                else
                  this.z = upgradeObj.z - 1;
              }
            }
          ]);
          sillyParticle.fadeIn(0.1).onEnd(() => sillyParticle.fadeOut(0.25).onEnd(() => sillyParticle.destroy()));
          if (upgradeObj.type == "k_")
            parseAnimation(sillyParticle, "cursors.cursor");
          else if (upgradeObj.type == "c_")
            parseAnimation(sillyParticle, "cursors.point");
          return;
        } else {
          if (upgradeObj.id == "c_2" && !isUpgradeBought("c_1")) {
            upgradeObj.tooltip.end();
            addTooltip(upgradeObj, {
              text: "You have to buy the previous one",
              textSize: upgradeObj.height / 2,
              direction: "down",
              lerpValue: 0.65,
              type: "store",
              layer: winParent.layer,
              z: winParent.z
            });
            upgradeObj.trigger("dummyClick");
            return;
          } else if (GameState.score < upgradeObj.price) {
            upgradeObj.trigger("notEnoughMoney");
            return;
          } else if (GameState.score >= upgradeObj.price) {
            progressSound?.stop();
            progressSound = playSfx("progress");
            downEvent = upgradeObj.onMouseDown(() => {
              if (isUpgradeBought(upgradeObj.id))
                return;
              if (upgradeObj.boughtProgress >= 5) {
                if (upgradeObj.tooltip.type == "storeholddowntobuy") {
                  upgradeObj.tooltip.end();
                  addPriceTooltip();
                  progressSound?.stop();
                  progressSound = playSfx("progress", { detune: upgradeObj.boughtProgress });
                }
              }
              if (upgradeObj.boughtProgress < 100) {
                upgradeObj.boughtProgress += 2;
                upgradeObj.scale.x = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85);
                upgradeObj.scale.y = map(upgradeObj.boughtProgress, 0, 100, 1.1, 0.85);
                progressSound.detune = upgradeObj.boughtProgress * upgradeObj.idx / 2 + 1;
              }
              if (upgradeObj.boughtProgress >= 100) {
                upgradeObj.buy();
                upgradeObj.manageBlinkText().end();
              }
            });
          }
        }
      });
      upgradeObj.onMouseRelease(() => {
        if (!winParent.active)
          return;
        if (isUpgradeBought(upgradeObj.id))
          return;
        if (!upgradeObj.isHovering())
          return;
        upgradeObj.dropBuy();
        if (GameState.score >= upgradeObj.price) {
          if (upgradeObj.boughtProgress < 1) {
            upgradeObj.tooltip?.end();
            let tutorialTooltip = addTooltip(upgradeObj, {
              text: "Hold down to buy!",
              lerpValue: 0.75,
              type: "storeholddowntobuy",
              direction: "down"
            });
          }
          upgradeObj.trigger("dummyClick");
        }
      });
      upgradeObj.on("notEnoughMoney", () => {
        const direction = getRandomDirection(addedPosition, false, 1.25);
        tween(direction, addedPosition, 0.25, (p) => upgradeObj.pos = p, easings.easeOutQuint);
        tween(choose([-15, 15]), 0, 0.25, (p) => upgradeTooltip.tooltipText.angle = p, easings.easeOutQuint);
        playSfx("wrong", { detune: rand(25, 75) });
      });
      upgradeObj.on("dropBuy", () => {
        if (progressSound != null || progressSound != void 0) {
          tween(progressSound.volume, 0, 0.35, (p) => progressSound.volume = p).onEnd(() => {
            progressSound.stop();
          });
          sfxHandlers.delete(progressSound);
        }
      });
      upgradeObj.on("dummyClick", () => {
        tween(choose([-15, 15]), 0, 0.15, (p) => upgradeObj.angle = p, easings.easeOutQuint);
        playSfx("clickButton", { detune: rand(-25, 25) });
      });
      let drawShadow = elementParent.onDraw(() => {
        drawSprite({
          sprite: upgradeObj.sprite,
          opacity: 0.25,
          pos: vec2(upgradeObj.pos.x, upgradeObj.pos.y + 2),
          anchor: upgradeObj.anchor,
          color: BLACK
        });
      });
    }
  }

  // node_modules/.pnpm/newgrounds.js@4.0.0-beta.1/node_modules/newgrounds.js/dist/newgrounds.mjs
  var tx = Object.create;
  var A0 = Object.defineProperty;
  var ax = Object.getOwnPropertyDescriptor;
  var ix = Object.getOwnPropertyNames;
  var nx = Object.getPrototypeOf;
  var ox = Object.prototype.hasOwnProperty;
  var sx = (t18) => A0(t18, "__esModule", { value: true });
  var z2 = (t18, e) => A0(t18, "name", { value: e, configurable: true });
  var _e2 = ((t18) => typeof __require != "undefined" ? __require : typeof Proxy != "undefined" ? new Proxy(t18, { get: (e, C2) => (typeof __require != "undefined" ? __require : e)[C2] }) : t18)(function(t18) {
    if (typeof __require != "undefined")
      return __require.apply(this, arguments);
    throw new Error('Dynamic require of "' + t18 + '" is not supported');
  });
  var L2 = (t18, e) => () => (e || t18((e = { exports: {} }).exports, e), e.exports);
  var fx = (t18, e, C2) => {
    if (e && typeof e == "object" || typeof e == "function")
      for (let h of ix(e))
        !ox.call(t18, h) && h !== "default" && A0(t18, h, { get: () => e[h], enumerable: !(C2 = ax(e, h)) || C2.enumerable });
    return t18;
  };
  var cx = (t18) => fx(sx(A0(t18 != null ? tx(nx(t18)) : {}, "default", t18 && t18.__esModule && "default" in t18 ? { get: () => t18.default, enumerable: true } : { value: t18, enumerable: true })), t18);
  var be2 = L2(() => {
  });
  var U = L2((F0, ye2) => {
    (function(t18, e) {
      typeof F0 == "object" ? ye2.exports = F0 = e() : typeof define == "function" && define.amd ? define([], e) : t18.CryptoJS = e();
    })(F0, function() {
      var t18 = t18 || function(e, C2) {
        var h;
        if (typeof window != "undefined" && window.crypto && (h = window.crypto), typeof self != "undefined" && self.crypto && (h = self.crypto), typeof globalThis != "undefined" && globalThis.crypto && (h = globalThis.crypto), !h && typeof window != "undefined" && window.msCrypto && (h = window.msCrypto), !h && typeof global != "undefined" && global.crypto && (h = global.crypto), !h && typeof _e2 == "function")
          try {
            h = be2();
          } catch {
          }
        var b2 = z2(function() {
          if (h) {
            if (typeof h.getRandomValues == "function")
              try {
                return h.getRandomValues(new Uint32Array(1))[0];
              } catch {
              }
            if (typeof h.randomBytes == "function")
              try {
                return h.randomBytes(4).readInt32LE();
              } catch {
              }
          }
          throw new Error("Native crypto module could not be used to get secure random number.");
        }, "cryptoSecureRandomInt"), d = Object.create || function() {
          function x() {
          }
          return z2(x, "F"), function(n) {
            var p;
            return x.prototype = n, p = new x(), x.prototype = null, p;
          };
        }(), F = {}, r = F.lib = {}, o = r.Base = /* @__PURE__ */ function() {
          return { extend: function(x) {
            var n = d(this);
            return x && n.mixIn(x), (!n.hasOwnProperty("init") || this.init === n.init) && (n.init = function() {
              n.$super.init.apply(this, arguments);
            }), n.init.prototype = n, n.$super = this, n;
          }, create: function() {
            var x = this.extend();
            return x.init.apply(x, arguments), x;
          }, init: function() {
          }, mixIn: function(x) {
            for (var n in x)
              x.hasOwnProperty(n) && (this[n] = x[n]);
            x.hasOwnProperty("toString") && (this.toString = x.toString);
          }, clone: function() {
            return this.init.prototype.extend(this);
          } };
        }(), v = r.WordArray = o.extend({ init: function(x, n) {
          x = this.words = x || [], n != C2 ? this.sigBytes = n : this.sigBytes = x.length * 4;
        }, toString: function(x) {
          return (x || c).stringify(this);
        }, concat: function(x) {
          var n = this.words, p = x.words, l = this.sigBytes, E = x.sigBytes;
          if (this.clamp(), l % 4)
            for (var A = 0; A < E; A++) {
              var H2 = p[A >>> 2] >>> 24 - A % 4 * 8 & 255;
              n[l + A >>> 2] |= H2 << 24 - (l + A) % 4 * 8;
            }
          else
            for (var w2 = 0; w2 < E; w2 += 4)
              n[l + w2 >>> 2] = p[w2 >>> 2];
          return this.sigBytes += E, this;
        }, clamp: function() {
          var x = this.words, n = this.sigBytes;
          x[n >>> 2] &= 4294967295 << 32 - n % 4 * 8, x.length = e.ceil(n / 4);
        }, clone: function() {
          var x = o.clone.call(this);
          return x.words = this.words.slice(0), x;
        }, random: function(x) {
          for (var n = [], p = 0; p < x; p += 4)
            n.push(b2());
          return new v.init(n, x);
        } }), a = F.enc = {}, c = a.Hex = { stringify: function(x) {
          for (var n = x.words, p = x.sigBytes, l = [], E = 0; E < p; E++) {
            var A = n[E >>> 2] >>> 24 - E % 4 * 8 & 255;
            l.push((A >>> 4).toString(16)), l.push((A & 15).toString(16));
          }
          return l.join("");
        }, parse: function(x) {
          for (var n = x.length, p = [], l = 0; l < n; l += 2)
            p[l >>> 3] |= parseInt(x.substr(l, 2), 16) << 24 - l % 8 * 4;
          return new v.init(p, n / 2);
        } }, i2 = a.Latin1 = { stringify: function(x) {
          for (var n = x.words, p = x.sigBytes, l = [], E = 0; E < p; E++) {
            var A = n[E >>> 2] >>> 24 - E % 4 * 8 & 255;
            l.push(String.fromCharCode(A));
          }
          return l.join("");
        }, parse: function(x) {
          for (var n = x.length, p = [], l = 0; l < n; l++)
            p[l >>> 2] |= (x.charCodeAt(l) & 255) << 24 - l % 4 * 8;
          return new v.init(p, n);
        } }, f = a.Utf8 = { stringify: function(x) {
          try {
            return decodeURIComponent(escape(i2.stringify(x)));
          } catch {
            throw new Error("Malformed UTF-8 data");
          }
        }, parse: function(x) {
          return i2.parse(unescape(encodeURIComponent(x)));
        } }, s = r.BufferedBlockAlgorithm = o.extend({ reset: function() {
          this._data = new v.init(), this._nDataBytes = 0;
        }, _append: function(x) {
          typeof x == "string" && (x = f.parse(x)), this._data.concat(x), this._nDataBytes += x.sigBytes;
        }, _process: function(x) {
          var n, p = this._data, l = p.words, E = p.sigBytes, A = this.blockSize, H2 = A * 4, w2 = E / H2;
          x ? w2 = e.ceil(w2) : w2 = e.max((w2 | 0) - this._minBufferSize, 0);
          var q = w2 * A, P2 = e.min(q * 4, E);
          if (q) {
            for (var D = 0; D < q; D += A)
              this._doProcessBlock(l, D);
            n = l.splice(0, q), p.sigBytes -= P2;
          }
          return new v.init(n, P2);
        }, clone: function() {
          var x = o.clone.call(this);
          return x._data = this._data.clone(), x;
        }, _minBufferSize: 0 }), u = r.Hasher = s.extend({ cfg: o.extend(), init: function(x) {
          this.cfg = this.cfg.extend(x), this.reset();
        }, reset: function() {
          s.reset.call(this), this._doReset();
        }, update: function(x) {
          return this._append(x), this._process(), this;
        }, finalize: function(x) {
          x && this._append(x);
          var n = this._doFinalize();
          return n;
        }, blockSize: 512 / 32, _createHelper: function(x) {
          return function(n, p) {
            return new x.init(p).finalize(n);
          };
        }, _createHmacHelper: function(x) {
          return function(n, p) {
            return new B.HMAC.init(x, p).finalize(n);
          };
        } }), B = F.algo = {};
        return F;
      }(Math);
      return t18;
    });
  });
  var u0 = L2((D0, ge2) => {
    (function(t18, e) {
      typeof D0 == "object" ? ge2.exports = D0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(D0, function(t18) {
      return function(e) {
        var C2 = t18, h = C2.lib, b2 = h.Base, d = h.WordArray, F = C2.x64 = {}, r = F.Word = b2.extend({ init: function(v, a) {
          this.high = v, this.low = a;
        } }), o = F.WordArray = b2.extend({ init: function(v, a) {
          v = this.words = v || [], a != e ? this.sigBytes = a : this.sigBytes = v.length * 8;
        }, toX32: function() {
          for (var v = this.words, a = v.length, c = [], i2 = 0; i2 < a; i2++) {
            var f = v[i2];
            c.push(f.high), c.push(f.low);
          }
          return d.create(c, this.sigBytes);
        }, clone: function() {
          for (var v = b2.clone.call(this), a = v.words = this.words.slice(0), c = a.length, i2 = 0; i2 < c; i2++)
            a[i2] = a[i2].clone();
          return v;
        } });
      }(), t18;
    });
  });
  var ke = L2((_0, me2) => {
    (function(t18, e) {
      typeof _0 == "object" ? me2.exports = _0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(_0, function(t18) {
      return function() {
        if (typeof ArrayBuffer == "function") {
          var e = t18, C2 = e.lib, h = C2.WordArray, b2 = h.init, d = h.init = function(F) {
            if (F instanceof ArrayBuffer && (F = new Uint8Array(F)), (F instanceof Int8Array || typeof Uint8ClampedArray != "undefined" && F instanceof Uint8ClampedArray || F instanceof Int16Array || F instanceof Uint16Array || F instanceof Int32Array || F instanceof Uint32Array || F instanceof Float32Array || F instanceof Float64Array) && (F = new Uint8Array(F.buffer, F.byteOffset, F.byteLength)), F instanceof Uint8Array) {
              for (var r = F.byteLength, o = [], v = 0; v < r; v++)
                o[v >>> 2] |= F[v] << 24 - v % 4 * 8;
              b2.call(this, o, r);
            } else
              b2.apply(this, arguments);
          };
          d.prototype = h;
        }
      }(), t18.lib.WordArray;
    });
  });
  var Se2 = L2((b0, we) => {
    (function(t18, e) {
      typeof b0 == "object" ? we.exports = b0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(b0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.WordArray, b2 = e.enc, d = b2.Utf16 = b2.Utf16BE = { stringify: function(r) {
          for (var o = r.words, v = r.sigBytes, a = [], c = 0; c < v; c += 2) {
            var i2 = o[c >>> 2] >>> 16 - c % 4 * 8 & 65535;
            a.push(String.fromCharCode(i2));
          }
          return a.join("");
        }, parse: function(r) {
          for (var o = r.length, v = [], a = 0; a < o; a++)
            v[a >>> 1] |= r.charCodeAt(a) << 16 - a % 2 * 16;
          return h.create(v, o * 2);
        } };
        b2.Utf16LE = { stringify: function(r) {
          for (var o = r.words, v = r.sigBytes, a = [], c = 0; c < v; c += 2) {
            var i2 = F(o[c >>> 2] >>> 16 - c % 4 * 8 & 65535);
            a.push(String.fromCharCode(i2));
          }
          return a.join("");
        }, parse: function(r) {
          for (var o = r.length, v = [], a = 0; a < o; a++)
            v[a >>> 1] |= F(r.charCodeAt(a) << 16 - a % 2 * 16);
          return h.create(v, o * 2);
        } };
        function F(r) {
          return r << 8 & 4278255360 | r >>> 8 & 16711935;
        }
        z2(F, "swapEndian");
      }(), t18.enc.Utf16;
    });
  });
  var x0 = L2((y0, He2) => {
    (function(t18, e) {
      typeof y0 == "object" ? He2.exports = y0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(y0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.WordArray, b2 = e.enc, d = b2.Base64 = { stringify: function(r) {
          var o = r.words, v = r.sigBytes, a = this._map;
          r.clamp();
          for (var c = [], i2 = 0; i2 < v; i2 += 3)
            for (var f = o[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255, s = o[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255, u = o[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, B = f << 16 | s << 8 | u, x = 0; x < 4 && i2 + x * 0.75 < v; x++)
              c.push(a.charAt(B >>> 6 * (3 - x) & 63));
          var n = a.charAt(64);
          if (n)
            for (; c.length % 4; )
              c.push(n);
          return c.join("");
        }, parse: function(r) {
          var o = r.length, v = this._map, a = this._reverseMap;
          if (!a) {
            a = this._reverseMap = [];
            for (var c = 0; c < v.length; c++)
              a[v.charCodeAt(c)] = c;
          }
          var i2 = v.charAt(64);
          if (i2) {
            var f = r.indexOf(i2);
            f !== -1 && (o = f);
          }
          return F(r, o, a);
        }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
        function F(r, o, v) {
          for (var a = [], c = 0, i2 = 0; i2 < o; i2++)
            if (i2 % 4) {
              var f = v[r.charCodeAt(i2 - 1)] << i2 % 4 * 2, s = v[r.charCodeAt(i2)] >>> 6 - i2 % 4 * 2, u = f | s;
              a[c >>> 2] |= u << 24 - c % 4 * 8, c++;
            }
          return h.create(a, c);
        }
        z2(F, "parseLoop");
      }(), t18.enc.Base64;
    });
  });
  var ze2 = L2((g0, qe2) => {
    (function(t18, e) {
      typeof g0 == "object" ? qe2.exports = g0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(g0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.WordArray, b2 = e.enc, d = b2.Base64url = { stringify: function(r, o) {
          o === void 0 && (o = true);
          var v = r.words, a = r.sigBytes, c = o ? this._safe_map : this._map;
          r.clamp();
          for (var i2 = [], f = 0; f < a; f += 3)
            for (var s = v[f >>> 2] >>> 24 - f % 4 * 8 & 255, u = v[f + 1 >>> 2] >>> 24 - (f + 1) % 4 * 8 & 255, B = v[f + 2 >>> 2] >>> 24 - (f + 2) % 4 * 8 & 255, x = s << 16 | u << 8 | B, n = 0; n < 4 && f + n * 0.75 < a; n++)
              i2.push(c.charAt(x >>> 6 * (3 - n) & 63));
          var p = c.charAt(64);
          if (p)
            for (; i2.length % 4; )
              i2.push(p);
          return i2.join("");
        }, parse: function(r, o) {
          o === void 0 && (o = true);
          var v = r.length, a = o ? this._safe_map : this._map, c = this._reverseMap;
          if (!c) {
            c = this._reverseMap = [];
            for (var i2 = 0; i2 < a.length; i2++)
              c[a.charCodeAt(i2)] = i2;
          }
          var f = a.charAt(64);
          if (f) {
            var s = r.indexOf(f);
            s !== -1 && (v = s);
          }
          return F(r, v, c);
        }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_" };
        function F(r, o, v) {
          for (var a = [], c = 0, i2 = 0; i2 < o; i2++)
            if (i2 % 4) {
              var f = v[r.charCodeAt(i2 - 1)] << i2 % 4 * 2, s = v[r.charCodeAt(i2)] >>> 6 - i2 % 4 * 2, u = f | s;
              a[c >>> 2] |= u << 24 - c % 4 * 8, c++;
            }
          return h.create(a, c);
        }
        z2(F, "parseLoop");
      }(), t18.enc.Base64url;
    });
  });
  var t0 = L2((m0, Re2) => {
    (function(t18, e) {
      typeof m0 == "object" ? Re2.exports = m0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(m0, function(t18) {
      return function(e) {
        var C2 = t18, h = C2.lib, b2 = h.WordArray, d = h.Hasher, F = C2.algo, r = [];
        (function() {
          for (var f = 0; f < 64; f++)
            r[f] = e.abs(e.sin(f + 1)) * 4294967296 | 0;
        })();
        var o = F.MD5 = d.extend({ _doReset: function() {
          this._hash = new b2.init([1732584193, 4023233417, 2562383102, 271733878]);
        }, _doProcessBlock: function(f, s) {
          for (var u = 0; u < 16; u++) {
            var B = s + u, x = f[B];
            f[B] = (x << 8 | x >>> 24) & 16711935 | (x << 24 | x >>> 8) & 4278255360;
          }
          var n = this._hash.words, p = f[s + 0], l = f[s + 1], E = f[s + 2], A = f[s + 3], H2 = f[s + 4], w2 = f[s + 5], q = f[s + 6], P2 = f[s + 7], D = f[s + 8], S = f[s + 9], R = f[s + 10], m = f[s + 11], j = f[s + 12], W2 = f[s + 13], I = f[s + 14], O2 = f[s + 15], _2 = n[0], g = n[1], k2 = n[2], y = n[3];
          _2 = v(_2, g, k2, y, p, 7, r[0]), y = v(y, _2, g, k2, l, 12, r[1]), k2 = v(k2, y, _2, g, E, 17, r[2]), g = v(g, k2, y, _2, A, 22, r[3]), _2 = v(_2, g, k2, y, H2, 7, r[4]), y = v(y, _2, g, k2, w2, 12, r[5]), k2 = v(k2, y, _2, g, q, 17, r[6]), g = v(g, k2, y, _2, P2, 22, r[7]), _2 = v(_2, g, k2, y, D, 7, r[8]), y = v(y, _2, g, k2, S, 12, r[9]), k2 = v(k2, y, _2, g, R, 17, r[10]), g = v(g, k2, y, _2, m, 22, r[11]), _2 = v(_2, g, k2, y, j, 7, r[12]), y = v(y, _2, g, k2, W2, 12, r[13]), k2 = v(k2, y, _2, g, I, 17, r[14]), g = v(g, k2, y, _2, O2, 22, r[15]), _2 = a(_2, g, k2, y, l, 5, r[16]), y = a(y, _2, g, k2, q, 9, r[17]), k2 = a(k2, y, _2, g, m, 14, r[18]), g = a(g, k2, y, _2, p, 20, r[19]), _2 = a(_2, g, k2, y, w2, 5, r[20]), y = a(y, _2, g, k2, R, 9, r[21]), k2 = a(k2, y, _2, g, O2, 14, r[22]), g = a(g, k2, y, _2, H2, 20, r[23]), _2 = a(_2, g, k2, y, S, 5, r[24]), y = a(y, _2, g, k2, I, 9, r[25]), k2 = a(k2, y, _2, g, A, 14, r[26]), g = a(g, k2, y, _2, D, 20, r[27]), _2 = a(_2, g, k2, y, W2, 5, r[28]), y = a(y, _2, g, k2, E, 9, r[29]), k2 = a(k2, y, _2, g, P2, 14, r[30]), g = a(g, k2, y, _2, j, 20, r[31]), _2 = c(_2, g, k2, y, w2, 4, r[32]), y = c(y, _2, g, k2, D, 11, r[33]), k2 = c(k2, y, _2, g, m, 16, r[34]), g = c(g, k2, y, _2, I, 23, r[35]), _2 = c(_2, g, k2, y, l, 4, r[36]), y = c(y, _2, g, k2, H2, 11, r[37]), k2 = c(k2, y, _2, g, P2, 16, r[38]), g = c(g, k2, y, _2, R, 23, r[39]), _2 = c(_2, g, k2, y, W2, 4, r[40]), y = c(y, _2, g, k2, p, 11, r[41]), k2 = c(k2, y, _2, g, A, 16, r[42]), g = c(g, k2, y, _2, q, 23, r[43]), _2 = c(_2, g, k2, y, S, 4, r[44]), y = c(y, _2, g, k2, j, 11, r[45]), k2 = c(k2, y, _2, g, O2, 16, r[46]), g = c(g, k2, y, _2, E, 23, r[47]), _2 = i2(_2, g, k2, y, p, 6, r[48]), y = i2(y, _2, g, k2, P2, 10, r[49]), k2 = i2(k2, y, _2, g, I, 15, r[50]), g = i2(g, k2, y, _2, w2, 21, r[51]), _2 = i2(_2, g, k2, y, j, 6, r[52]), y = i2(y, _2, g, k2, A, 10, r[53]), k2 = i2(k2, y, _2, g, R, 15, r[54]), g = i2(g, k2, y, _2, l, 21, r[55]), _2 = i2(_2, g, k2, y, D, 6, r[56]), y = i2(y, _2, g, k2, O2, 10, r[57]), k2 = i2(k2, y, _2, g, q, 15, r[58]), g = i2(g, k2, y, _2, W2, 21, r[59]), _2 = i2(_2, g, k2, y, H2, 6, r[60]), y = i2(y, _2, g, k2, m, 10, r[61]), k2 = i2(k2, y, _2, g, E, 15, r[62]), g = i2(g, k2, y, _2, S, 21, r[63]), n[0] = n[0] + _2 | 0, n[1] = n[1] + g | 0, n[2] = n[2] + k2 | 0, n[3] = n[3] + y | 0;
        }, _doFinalize: function() {
          var f = this._data, s = f.words, u = this._nDataBytes * 8, B = f.sigBytes * 8;
          s[B >>> 5] |= 128 << 24 - B % 32;
          var x = e.floor(u / 4294967296), n = u;
          s[(B + 64 >>> 9 << 4) + 15] = (x << 8 | x >>> 24) & 16711935 | (x << 24 | x >>> 8) & 4278255360, s[(B + 64 >>> 9 << 4) + 14] = (n << 8 | n >>> 24) & 16711935 | (n << 24 | n >>> 8) & 4278255360, f.sigBytes = (s.length + 1) * 4, this._process();
          for (var p = this._hash, l = p.words, E = 0; E < 4; E++) {
            var A = l[E];
            l[E] = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360;
          }
          return p;
        }, clone: function() {
          var f = d.clone.call(this);
          return f._hash = this._hash.clone(), f;
        } });
        function v(f, s, u, B, x, n, p) {
          var l = f + (s & u | ~s & B) + x + p;
          return (l << n | l >>> 32 - n) + s;
        }
        z2(v, "FF");
        function a(f, s, u, B, x, n, p) {
          var l = f + (s & B | u & ~B) + x + p;
          return (l << n | l >>> 32 - n) + s;
        }
        z2(a, "GG");
        function c(f, s, u, B, x, n, p) {
          var l = f + (s ^ u ^ B) + x + p;
          return (l << n | l >>> 32 - n) + s;
        }
        z2(c, "HH");
        function i2(f, s, u, B, x, n, p) {
          var l = f + (u ^ (s | ~B)) + x + p;
          return (l << n | l >>> 32 - n) + s;
        }
        z2(i2, "II"), C2.MD5 = d._createHelper(o), C2.HmacMD5 = d._createHmacHelper(o);
      }(Math), t18.MD5;
    });
  });
  var oe2 = L2((k0, Pe) => {
    (function(t18, e) {
      typeof k0 == "object" ? Pe.exports = k0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(k0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.WordArray, b2 = C2.Hasher, d = e.algo, F = [], r = d.SHA1 = b2.extend({ _doReset: function() {
          this._hash = new h.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
        }, _doProcessBlock: function(o, v) {
          for (var a = this._hash.words, c = a[0], i2 = a[1], f = a[2], s = a[3], u = a[4], B = 0; B < 80; B++) {
            if (B < 16)
              F[B] = o[v + B] | 0;
            else {
              var x = F[B - 3] ^ F[B - 8] ^ F[B - 14] ^ F[B - 16];
              F[B] = x << 1 | x >>> 31;
            }
            var n = (c << 5 | c >>> 27) + u + F[B];
            B < 20 ? n += (i2 & f | ~i2 & s) + 1518500249 : B < 40 ? n += (i2 ^ f ^ s) + 1859775393 : B < 60 ? n += (i2 & f | i2 & s | f & s) - 1894007588 : n += (i2 ^ f ^ s) - 899497514, u = s, s = f, f = i2 << 30 | i2 >>> 2, i2 = c, c = n;
          }
          a[0] = a[0] + c | 0, a[1] = a[1] + i2 | 0, a[2] = a[2] + f | 0, a[3] = a[3] + s | 0, a[4] = a[4] + u | 0;
        }, _doFinalize: function() {
          var o = this._data, v = o.words, a = this._nDataBytes * 8, c = o.sigBytes * 8;
          return v[c >>> 5] |= 128 << 24 - c % 32, v[(c + 64 >>> 9 << 4) + 14] = Math.floor(a / 4294967296), v[(c + 64 >>> 9 << 4) + 15] = a, o.sigBytes = v.length * 4, this._process(), this._hash;
        }, clone: function() {
          var o = b2.clone.call(this);
          return o._hash = this._hash.clone(), o;
        } });
        e.SHA1 = b2._createHelper(r), e.HmacSHA1 = b2._createHmacHelper(r);
      }(), t18.SHA1;
    });
  });
  var S0 = L2((w0, We2) => {
    (function(t18, e) {
      typeof w0 == "object" ? We2.exports = w0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(w0, function(t18) {
      return function(e) {
        var C2 = t18, h = C2.lib, b2 = h.WordArray, d = h.Hasher, F = C2.algo, r = [], o = [];
        (function() {
          function c(u) {
            for (var B = e.sqrt(u), x = 2; x <= B; x++)
              if (!(u % x))
                return false;
            return true;
          }
          z2(c, "isPrime");
          function i2(u) {
            return (u - (u | 0)) * 4294967296 | 0;
          }
          z2(i2, "getFractionalBits");
          for (var f = 2, s = 0; s < 64; )
            c(f) && (s < 8 && (r[s] = i2(e.pow(f, 1 / 2))), o[s] = i2(e.pow(f, 1 / 3)), s++), f++;
        })();
        var v = [], a = F.SHA256 = d.extend({ _doReset: function() {
          this._hash = new b2.init(r.slice(0));
        }, _doProcessBlock: function(c, i2) {
          for (var f = this._hash.words, s = f[0], u = f[1], B = f[2], x = f[3], n = f[4], p = f[5], l = f[6], E = f[7], A = 0; A < 64; A++) {
            if (A < 16)
              v[A] = c[i2 + A] | 0;
            else {
              var H2 = v[A - 15], w2 = (H2 << 25 | H2 >>> 7) ^ (H2 << 14 | H2 >>> 18) ^ H2 >>> 3, q = v[A - 2], P2 = (q << 15 | q >>> 17) ^ (q << 13 | q >>> 19) ^ q >>> 10;
              v[A] = w2 + v[A - 7] + P2 + v[A - 16];
            }
            var D = n & p ^ ~n & l, S = s & u ^ s & B ^ u & B, R = (s << 30 | s >>> 2) ^ (s << 19 | s >>> 13) ^ (s << 10 | s >>> 22), m = (n << 26 | n >>> 6) ^ (n << 21 | n >>> 11) ^ (n << 7 | n >>> 25), j = E + m + D + o[A] + v[A], W2 = R + S;
            E = l, l = p, p = n, n = x + j | 0, x = B, B = u, u = s, s = j + W2 | 0;
          }
          f[0] = f[0] + s | 0, f[1] = f[1] + u | 0, f[2] = f[2] + B | 0, f[3] = f[3] + x | 0, f[4] = f[4] + n | 0, f[5] = f[5] + p | 0, f[6] = f[6] + l | 0, f[7] = f[7] + E | 0;
        }, _doFinalize: function() {
          var c = this._data, i2 = c.words, f = this._nDataBytes * 8, s = c.sigBytes * 8;
          return i2[s >>> 5] |= 128 << 24 - s % 32, i2[(s + 64 >>> 9 << 4) + 14] = e.floor(f / 4294967296), i2[(s + 64 >>> 9 << 4) + 15] = f, c.sigBytes = i2.length * 4, this._process(), this._hash;
        }, clone: function() {
          var c = d.clone.call(this);
          return c._hash = this._hash.clone(), c;
        } });
        C2.SHA256 = d._createHelper(a), C2.HmacSHA256 = d._createHmacHelper(a);
      }(Math), t18.SHA256;
    });
  });
  var Ie2 = L2((H0, je2) => {
    (function(t18, e, C2) {
      typeof H0 == "object" ? je2.exports = H0 = e(U(), S0()) : typeof define == "function" && define.amd ? define(["./core", "./sha256"], e) : e(t18.CryptoJS);
    })(H0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.WordArray, b2 = e.algo, d = b2.SHA256, F = b2.SHA224 = d.extend({ _doReset: function() {
          this._hash = new h.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]);
        }, _doFinalize: function() {
          var r = d._doFinalize.call(this);
          return r.sigBytes -= 4, r;
        } });
        e.SHA224 = d._createHelper(F), e.HmacSHA224 = d._createHmacHelper(F);
      }(), t18.SHA224;
    });
  });
  var se = L2((q0, Ne2) => {
    (function(t18, e, C2) {
      typeof q0 == "object" ? Ne2.exports = q0 = e(U(), u0()) : typeof define == "function" && define.amd ? define(["./core", "./x64-core"], e) : e(t18.CryptoJS);
    })(q0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.Hasher, b2 = e.x64, d = b2.Word, F = b2.WordArray, r = e.algo;
        function o() {
          return d.create.apply(d, arguments);
        }
        z2(o, "X64Word_create");
        var v = [o(1116352408, 3609767458), o(1899447441, 602891725), o(3049323471, 3964484399), o(3921009573, 2173295548), o(961987163, 4081628472), o(1508970993, 3053834265), o(2453635748, 2937671579), o(2870763221, 3664609560), o(3624381080, 2734883394), o(310598401, 1164996542), o(607225278, 1323610764), o(1426881987, 3590304994), o(1925078388, 4068182383), o(2162078206, 991336113), o(2614888103, 633803317), o(3248222580, 3479774868), o(3835390401, 2666613458), o(4022224774, 944711139), o(264347078, 2341262773), o(604807628, 2007800933), o(770255983, 1495990901), o(1249150122, 1856431235), o(1555081692, 3175218132), o(1996064986, 2198950837), o(2554220882, 3999719339), o(2821834349, 766784016), o(2952996808, 2566594879), o(3210313671, 3203337956), o(3336571891, 1034457026), o(3584528711, 2466948901), o(113926993, 3758326383), o(338241895, 168717936), o(666307205, 1188179964), o(773529912, 1546045734), o(1294757372, 1522805485), o(1396182291, 2643833823), o(1695183700, 2343527390), o(1986661051, 1014477480), o(2177026350, 1206759142), o(2456956037, 344077627), o(2730485921, 1290863460), o(2820302411, 3158454273), o(3259730800, 3505952657), o(3345764771, 106217008), o(3516065817, 3606008344), o(3600352804, 1432725776), o(4094571909, 1467031594), o(275423344, 851169720), o(430227734, 3100823752), o(506948616, 1363258195), o(659060556, 3750685593), o(883997877, 3785050280), o(958139571, 3318307427), o(1322822218, 3812723403), o(1537002063, 2003034995), o(1747873779, 3602036899), o(1955562222, 1575990012), o(2024104815, 1125592928), o(2227730452, 2716904306), o(2361852424, 442776044), o(2428436474, 593698344), o(2756734187, 3733110249), o(3204031479, 2999351573), o(3329325298, 3815920427), o(3391569614, 3928383900), o(3515267271, 566280711), o(3940187606, 3454069534), o(4118630271, 4000239992), o(116418474, 1914138554), o(174292421, 2731055270), o(289380356, 3203993006), o(460393269, 320620315), o(685471733, 587496836), o(852142971, 1086792851), o(1017036298, 365543100), o(1126000580, 2618297676), o(1288033470, 3409855158), o(1501505948, 4234509866), o(1607167915, 987167468), o(1816402316, 1246189591)], a = [];
        (function() {
          for (var i2 = 0; i2 < 80; i2++)
            a[i2] = o();
        })();
        var c = r.SHA512 = h.extend({ _doReset: function() {
          this._hash = new F.init([new d.init(1779033703, 4089235720), new d.init(3144134277, 2227873595), new d.init(1013904242, 4271175723), new d.init(2773480762, 1595750129), new d.init(1359893119, 2917565137), new d.init(2600822924, 725511199), new d.init(528734635, 4215389547), new d.init(1541459225, 327033209)]);
        }, _doProcessBlock: function(i2, f) {
          for (var s = this._hash.words, u = s[0], B = s[1], x = s[2], n = s[3], p = s[4], l = s[5], E = s[6], A = s[7], H2 = u.high, w2 = u.low, q = B.high, P2 = B.low, D = x.high, S = x.low, R = n.high, m = n.low, j = p.high, W2 = p.low, I = l.high, O2 = l.low, _2 = E.high, g = E.low, k2 = A.high, y = A.low, X = H2, T = w2, Z = q, N = P2, s0 = D, a0 = S, ie = R, f0 = m, $2 = j, J2 = W2, C0 = I, c0 = O2, p0 = _2, v0 = g, ne2 = k2, d0 = y, V = 0; V < 80; V++) {
            var Y, e0, E0 = a[V];
            if (V < 16)
              e0 = E0.high = i2[f + V * 2] | 0, Y = E0.low = i2[f + V * 2 + 1] | 0;
            else {
              var ve2 = a[V - 15], i0 = ve2.high, l0 = ve2.low, Xr2 = (i0 >>> 1 | l0 << 31) ^ (i0 >>> 8 | l0 << 24) ^ i0 >>> 7, de2 = (l0 >>> 1 | i0 << 31) ^ (l0 >>> 8 | i0 << 24) ^ (l0 >>> 7 | i0 << 25), le2 = a[V - 2], n0 = le2.high, h0 = le2.low, Kr2 = (n0 >>> 19 | h0 << 13) ^ (n0 << 3 | h0 >>> 29) ^ n0 >>> 6, he2 = (h0 >>> 19 | n0 << 13) ^ (h0 << 3 | n0 >>> 29) ^ (h0 >>> 6 | n0 << 26), ue = a[V - 7], Gr2 = ue.high, Zr2 = ue.low, Be2 = a[V - 16], Jr2 = Be2.high, Ce2 = Be2.low;
              Y = de2 + Zr2, e0 = Xr2 + Gr2 + (Y >>> 0 < de2 >>> 0 ? 1 : 0), Y = Y + he2, e0 = e0 + Kr2 + (Y >>> 0 < he2 >>> 0 ? 1 : 0), Y = Y + Ce2, e0 = e0 + Jr2 + (Y >>> 0 < Ce2 >>> 0 ? 1 : 0), E0.high = e0, E0.low = Y;
            }
            var Qr2 = $2 & C0 ^ ~$2 & p0, pe2 = J2 & c0 ^ ~J2 & v0, Yr2 = X & Z ^ X & s0 ^ Z & s0, $r2 = T & N ^ T & a0 ^ N & a0, Vr = (X >>> 28 | T << 4) ^ (X << 30 | T >>> 2) ^ (X << 25 | T >>> 7), Ee2 = (T >>> 28 | X << 4) ^ (T << 30 | X >>> 2) ^ (T << 25 | X >>> 7), Mr2 = ($2 >>> 14 | J2 << 18) ^ ($2 >>> 18 | J2 << 14) ^ ($2 << 23 | J2 >>> 9), ex = (J2 >>> 14 | $2 << 18) ^ (J2 >>> 18 | $2 << 14) ^ (J2 << 23 | $2 >>> 9), Ae2 = v[V], rx = Ae2.high, Fe2 = Ae2.low, Q = d0 + ex, r0 = ne2 + Mr2 + (Q >>> 0 < d0 >>> 0 ? 1 : 0), Q = Q + pe2, r0 = r0 + Qr2 + (Q >>> 0 < pe2 >>> 0 ? 1 : 0), Q = Q + Fe2, r0 = r0 + rx + (Q >>> 0 < Fe2 >>> 0 ? 1 : 0), Q = Q + Y, r0 = r0 + e0 + (Q >>> 0 < Y >>> 0 ? 1 : 0), De2 = Ee2 + $r2, xx = Vr + Yr2 + (De2 >>> 0 < Ee2 >>> 0 ? 1 : 0);
            ne2 = p0, d0 = v0, p0 = C0, v0 = c0, C0 = $2, c0 = J2, J2 = f0 + Q | 0, $2 = ie + r0 + (J2 >>> 0 < f0 >>> 0 ? 1 : 0) | 0, ie = s0, f0 = a0, s0 = Z, a0 = N, Z = X, N = T, T = Q + De2 | 0, X = r0 + xx + (T >>> 0 < Q >>> 0 ? 1 : 0) | 0;
          }
          w2 = u.low = w2 + T, u.high = H2 + X + (w2 >>> 0 < T >>> 0 ? 1 : 0), P2 = B.low = P2 + N, B.high = q + Z + (P2 >>> 0 < N >>> 0 ? 1 : 0), S = x.low = S + a0, x.high = D + s0 + (S >>> 0 < a0 >>> 0 ? 1 : 0), m = n.low = m + f0, n.high = R + ie + (m >>> 0 < f0 >>> 0 ? 1 : 0), W2 = p.low = W2 + J2, p.high = j + $2 + (W2 >>> 0 < J2 >>> 0 ? 1 : 0), O2 = l.low = O2 + c0, l.high = I + C0 + (O2 >>> 0 < c0 >>> 0 ? 1 : 0), g = E.low = g + v0, E.high = _2 + p0 + (g >>> 0 < v0 >>> 0 ? 1 : 0), y = A.low = y + d0, A.high = k2 + ne2 + (y >>> 0 < d0 >>> 0 ? 1 : 0);
        }, _doFinalize: function() {
          var i2 = this._data, f = i2.words, s = this._nDataBytes * 8, u = i2.sigBytes * 8;
          f[u >>> 5] |= 128 << 24 - u % 32, f[(u + 128 >>> 10 << 5) + 30] = Math.floor(s / 4294967296), f[(u + 128 >>> 10 << 5) + 31] = s, i2.sigBytes = f.length * 4, this._process();
          var B = this._hash.toX32();
          return B;
        }, clone: function() {
          var i2 = h.clone.call(this);
          return i2._hash = this._hash.clone(), i2;
        }, blockSize: 1024 / 32 });
        e.SHA512 = h._createHelper(c), e.HmacSHA512 = h._createHmacHelper(c);
      }(), t18.SHA512;
    });
  });
  var Ue = L2((z0, Le2) => {
    (function(t18, e, C2) {
      typeof z0 == "object" ? Le2.exports = z0 = e(U(), u0(), se()) : typeof define == "function" && define.amd ? define(["./core", "./x64-core", "./sha512"], e) : e(t18.CryptoJS);
    })(z0, function(t18) {
      return function() {
        var e = t18, C2 = e.x64, h = C2.Word, b2 = C2.WordArray, d = e.algo, F = d.SHA512, r = d.SHA384 = F.extend({ _doReset: function() {
          this._hash = new b2.init([new h.init(3418070365, 3238371032), new h.init(1654270250, 914150663), new h.init(2438529370, 812702999), new h.init(355462360, 4144912697), new h.init(1731405415, 4290775857), new h.init(2394180231, 1750603025), new h.init(3675008525, 1694076839), new h.init(1203062813, 3204075428)]);
        }, _doFinalize: function() {
          var o = F._doFinalize.call(this);
          return o.sigBytes -= 16, o;
        } });
        e.SHA384 = F._createHelper(r), e.HmacSHA384 = F._createHmacHelper(r);
      }(), t18.SHA384;
    });
  });
  var Te = L2((R0, Oe2) => {
    (function(t18, e, C2) {
      typeof R0 == "object" ? Oe2.exports = R0 = e(U(), u0()) : typeof define == "function" && define.amd ? define(["./core", "./x64-core"], e) : e(t18.CryptoJS);
    })(R0, function(t18) {
      return function(e) {
        var C2 = t18, h = C2.lib, b2 = h.WordArray, d = h.Hasher, F = C2.x64, r = F.Word, o = C2.algo, v = [], a = [], c = [];
        (function() {
          for (var s = 1, u = 0, B = 0; B < 24; B++) {
            v[s + 5 * u] = (B + 1) * (B + 2) / 2 % 64;
            var x = u % 5, n = (2 * s + 3 * u) % 5;
            s = x, u = n;
          }
          for (var s = 0; s < 5; s++)
            for (var u = 0; u < 5; u++)
              a[s + 5 * u] = u + (2 * s + 3 * u) % 5 * 5;
          for (var p = 1, l = 0; l < 24; l++) {
            for (var E = 0, A = 0, H2 = 0; H2 < 7; H2++) {
              if (p & 1) {
                var w2 = (1 << H2) - 1;
                w2 < 32 ? A ^= 1 << w2 : E ^= 1 << w2 - 32;
              }
              p & 128 ? p = p << 1 ^ 113 : p <<= 1;
            }
            c[l] = r.create(E, A);
          }
        })();
        var i2 = [];
        (function() {
          for (var s = 0; s < 25; s++)
            i2[s] = r.create();
        })();
        var f = o.SHA3 = d.extend({ cfg: d.cfg.extend({ outputLength: 512 }), _doReset: function() {
          for (var s = this._state = [], u = 0; u < 25; u++)
            s[u] = new r.init();
          this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
        }, _doProcessBlock: function(s, u) {
          for (var B = this._state, x = this.blockSize / 2, n = 0; n < x; n++) {
            var p = s[u + 2 * n], l = s[u + 2 * n + 1];
            p = (p << 8 | p >>> 24) & 16711935 | (p << 24 | p >>> 8) & 4278255360, l = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360;
            var E = B[n];
            E.high ^= l, E.low ^= p;
          }
          for (var A = 0; A < 24; A++) {
            for (var H2 = 0; H2 < 5; H2++) {
              for (var w2 = 0, q = 0, P2 = 0; P2 < 5; P2++) {
                var E = B[H2 + 5 * P2];
                w2 ^= E.high, q ^= E.low;
              }
              var D = i2[H2];
              D.high = w2, D.low = q;
            }
            for (var H2 = 0; H2 < 5; H2++)
              for (var S = i2[(H2 + 4) % 5], R = i2[(H2 + 1) % 5], m = R.high, j = R.low, w2 = S.high ^ (m << 1 | j >>> 31), q = S.low ^ (j << 1 | m >>> 31), P2 = 0; P2 < 5; P2++) {
                var E = B[H2 + 5 * P2];
                E.high ^= w2, E.low ^= q;
              }
            for (var W2 = 1; W2 < 25; W2++) {
              var w2, q, E = B[W2], I = E.high, O2 = E.low, _2 = v[W2];
              _2 < 32 ? (w2 = I << _2 | O2 >>> 32 - _2, q = O2 << _2 | I >>> 32 - _2) : (w2 = O2 << _2 - 32 | I >>> 64 - _2, q = I << _2 - 32 | O2 >>> 64 - _2);
              var g = i2[a[W2]];
              g.high = w2, g.low = q;
            }
            var k2 = i2[0], y = B[0];
            k2.high = y.high, k2.low = y.low;
            for (var H2 = 0; H2 < 5; H2++)
              for (var P2 = 0; P2 < 5; P2++) {
                var W2 = H2 + 5 * P2, E = B[W2], X = i2[W2], T = i2[(H2 + 1) % 5 + 5 * P2], Z = i2[(H2 + 2) % 5 + 5 * P2];
                E.high = X.high ^ ~T.high & Z.high, E.low = X.low ^ ~T.low & Z.low;
              }
            var E = B[0], N = c[A];
            E.high ^= N.high, E.low ^= N.low;
          }
        }, _doFinalize: function() {
          var s = this._data, u = s.words, B = this._nDataBytes * 8, x = s.sigBytes * 8, n = this.blockSize * 32;
          u[x >>> 5] |= 1 << 24 - x % 32, u[(e.ceil((x + 1) / n) * n >>> 5) - 1] |= 128, s.sigBytes = u.length * 4, this._process();
          for (var p = this._state, l = this.cfg.outputLength / 8, E = l / 8, A = [], H2 = 0; H2 < E; H2++) {
            var w2 = p[H2], q = w2.high, P2 = w2.low;
            q = (q << 8 | q >>> 24) & 16711935 | (q << 24 | q >>> 8) & 4278255360, P2 = (P2 << 8 | P2 >>> 24) & 16711935 | (P2 << 24 | P2 >>> 8) & 4278255360, A.push(P2), A.push(q);
          }
          return new b2.init(A, l);
        }, clone: function() {
          for (var s = d.clone.call(this), u = s._state = this._state.slice(0), B = 0; B < 25; B++)
            u[B] = u[B].clone();
          return s;
        } });
        C2.SHA3 = d._createHelper(f), C2.HmacSHA3 = d._createHmacHelper(f);
      }(Math), t18.SHA3;
    });
  });
  var Ke2 = L2((P0, Xe2) => {
    (function(t18, e) {
      typeof P0 == "object" ? Xe2.exports = P0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(P0, function(t18) {
      return function(e) {
        var C2 = t18, h = C2.lib, b2 = h.WordArray, d = h.Hasher, F = C2.algo, r = b2.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]), o = b2.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]), v = b2.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]), a = b2.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]), c = b2.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), i2 = b2.create([1352829926, 1548603684, 1836072691, 2053994217, 0]), f = F.RIPEMD160 = d.extend({ _doReset: function() {
          this._hash = b2.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
        }, _doProcessBlock: function(l, E) {
          for (var A = 0; A < 16; A++) {
            var H2 = E + A, w2 = l[H2];
            l[H2] = (w2 << 8 | w2 >>> 24) & 16711935 | (w2 << 24 | w2 >>> 8) & 4278255360;
          }
          var q = this._hash.words, P2 = c.words, D = i2.words, S = r.words, R = o.words, m = v.words, j = a.words, W2, I, O2, _2, g, k2, y, X, T, Z;
          k2 = W2 = q[0], y = I = q[1], X = O2 = q[2], T = _2 = q[3], Z = g = q[4];
          for (var N, A = 0; A < 80; A += 1)
            N = W2 + l[E + S[A]] | 0, A < 16 ? N += s(I, O2, _2) + P2[0] : A < 32 ? N += u(I, O2, _2) + P2[1] : A < 48 ? N += B(I, O2, _2) + P2[2] : A < 64 ? N += x(I, O2, _2) + P2[3] : N += n(I, O2, _2) + P2[4], N = N | 0, N = p(N, m[A]), N = N + g | 0, W2 = g, g = _2, _2 = p(O2, 10), O2 = I, I = N, N = k2 + l[E + R[A]] | 0, A < 16 ? N += n(y, X, T) + D[0] : A < 32 ? N += x(y, X, T) + D[1] : A < 48 ? N += B(y, X, T) + D[2] : A < 64 ? N += u(y, X, T) + D[3] : N += s(y, X, T) + D[4], N = N | 0, N = p(N, j[A]), N = N + Z | 0, k2 = Z, Z = T, T = p(X, 10), X = y, y = N;
          N = q[1] + O2 + T | 0, q[1] = q[2] + _2 + Z | 0, q[2] = q[3] + g + k2 | 0, q[3] = q[4] + W2 + y | 0, q[4] = q[0] + I + X | 0, q[0] = N;
        }, _doFinalize: function() {
          var l = this._data, E = l.words, A = this._nDataBytes * 8, H2 = l.sigBytes * 8;
          E[H2 >>> 5] |= 128 << 24 - H2 % 32, E[(H2 + 64 >>> 9 << 4) + 14] = (A << 8 | A >>> 24) & 16711935 | (A << 24 | A >>> 8) & 4278255360, l.sigBytes = (E.length + 1) * 4, this._process();
          for (var w2 = this._hash, q = w2.words, P2 = 0; P2 < 5; P2++) {
            var D = q[P2];
            q[P2] = (D << 8 | D >>> 24) & 16711935 | (D << 24 | D >>> 8) & 4278255360;
          }
          return w2;
        }, clone: function() {
          var l = d.clone.call(this);
          return l._hash = this._hash.clone(), l;
        } });
        function s(l, E, A) {
          return l ^ E ^ A;
        }
        z2(s, "f1");
        function u(l, E, A) {
          return l & E | ~l & A;
        }
        z2(u, "f2");
        function B(l, E, A) {
          return (l | ~E) ^ A;
        }
        z2(B, "f3");
        function x(l, E, A) {
          return l & A | E & ~A;
        }
        z2(x, "f4");
        function n(l, E, A) {
          return l ^ (E | ~A);
        }
        z2(n, "f5");
        function p(l, E) {
          return l << E | l >>> 32 - E;
        }
        z2(p, "rotl"), C2.RIPEMD160 = d._createHelper(f), C2.HmacRIPEMD160 = d._createHmacHelper(f);
      }(Math), t18.RIPEMD160;
    });
  });
  var j0 = L2((W0, Ge2) => {
    (function(t18, e) {
      typeof W0 == "object" ? Ge2.exports = W0 = e(U()) : typeof define == "function" && define.amd ? define(["./core"], e) : e(t18.CryptoJS);
    })(W0, function(t18) {
      (function() {
        var e = t18, C2 = e.lib, h = C2.Base, b2 = e.enc, d = b2.Utf8, F = e.algo, r = F.HMAC = h.extend({ init: function(o, v) {
          o = this._hasher = new o.init(), typeof v == "string" && (v = d.parse(v));
          var a = o.blockSize, c = a * 4;
          v.sigBytes > c && (v = o.finalize(v)), v.clamp();
          for (var i2 = this._oKey = v.clone(), f = this._iKey = v.clone(), s = i2.words, u = f.words, B = 0; B < a; B++)
            s[B] ^= 1549556828, u[B] ^= 909522486;
          i2.sigBytes = f.sigBytes = c, this.reset();
        }, reset: function() {
          var o = this._hasher;
          o.reset(), o.update(this._iKey);
        }, update: function(o) {
          return this._hasher.update(o), this;
        }, finalize: function(o) {
          var v = this._hasher, a = v.finalize(o);
          v.reset();
          var c = v.finalize(this._oKey.clone().concat(a));
          return c;
        } });
      })();
    });
  });
  var Je = L2((I0, Ze2) => {
    (function(t18, e, C2) {
      typeof I0 == "object" ? Ze2.exports = I0 = e(U(), S0(), j0()) : typeof define == "function" && define.amd ? define(["./core", "./sha256", "./hmac"], e) : e(t18.CryptoJS);
    })(I0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.Base, b2 = C2.WordArray, d = e.algo, F = d.SHA256, r = d.HMAC, o = d.PBKDF2 = h.extend({ cfg: h.extend({ keySize: 128 / 32, hasher: F, iterations: 25e4 }), init: function(v) {
          this.cfg = this.cfg.extend(v);
        }, compute: function(v, a) {
          for (var c = this.cfg, i2 = r.create(c.hasher, v), f = b2.create(), s = b2.create([1]), u = f.words, B = s.words, x = c.keySize, n = c.iterations; u.length < x; ) {
            var p = i2.update(a).finalize(s);
            i2.reset();
            for (var l = p.words, E = l.length, A = p, H2 = 1; H2 < n; H2++) {
              A = i2.finalize(A), i2.reset();
              for (var w2 = A.words, q = 0; q < E; q++)
                l[q] ^= w2[q];
            }
            f.concat(p), B[0]++;
          }
          return f.sigBytes = x * 4, f;
        } });
        e.PBKDF2 = function(v, a, c) {
          return o.create(c).compute(v, a);
        };
      }(), t18.PBKDF2;
    });
  });
  var M = L2((N0, Qe2) => {
    (function(t18, e, C2) {
      typeof N0 == "object" ? Qe2.exports = N0 = e(U(), oe2(), j0()) : typeof define == "function" && define.amd ? define(["./core", "./sha1", "./hmac"], e) : e(t18.CryptoJS);
    })(N0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.Base, b2 = C2.WordArray, d = e.algo, F = d.MD5, r = d.EvpKDF = h.extend({ cfg: h.extend({ keySize: 128 / 32, hasher: F, iterations: 1 }), init: function(o) {
          this.cfg = this.cfg.extend(o);
        }, compute: function(o, v) {
          for (var a, c = this.cfg, i2 = c.hasher.create(), f = b2.create(), s = f.words, u = c.keySize, B = c.iterations; s.length < u; ) {
            a && i2.update(a), a = i2.update(o).finalize(v), i2.reset();
            for (var x = 1; x < B; x++)
              a = i2.finalize(a), i2.reset();
            f.concat(a);
          }
          return f.sigBytes = u * 4, f;
        } });
        e.EvpKDF = function(o, v, a) {
          return r.create(a).compute(o, v);
        };
      }(), t18.EvpKDF;
    });
  });
  var K = L2((L0, Ye2) => {
    (function(t18, e, C2) {
      typeof L0 == "object" ? Ye2.exports = L0 = e(U(), M()) : typeof define == "function" && define.amd ? define(["./core", "./evpkdf"], e) : e(t18.CryptoJS);
    })(L0, function(t18) {
      t18.lib.Cipher || function(e) {
        var C2 = t18, h = C2.lib, b2 = h.Base, d = h.WordArray, F = h.BufferedBlockAlgorithm, r = C2.enc, o = r.Utf8, v = r.Base64, a = C2.algo, c = a.EvpKDF, i2 = h.Cipher = F.extend({ cfg: b2.extend(), createEncryptor: function(D, S) {
          return this.create(this._ENC_XFORM_MODE, D, S);
        }, createDecryptor: function(D, S) {
          return this.create(this._DEC_XFORM_MODE, D, S);
        }, init: function(D, S, R) {
          this.cfg = this.cfg.extend(R), this._xformMode = D, this._key = S, this.reset();
        }, reset: function() {
          F.reset.call(this), this._doReset();
        }, process: function(D) {
          return this._append(D), this._process();
        }, finalize: function(D) {
          D && this._append(D);
          var S = this._doFinalize();
          return S;
        }, keySize: 128 / 32, ivSize: 128 / 32, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function() {
          function D(S) {
            return typeof S == "string" ? P2 : H2;
          }
          return z2(D, "selectCipherStrategy"), function(S) {
            return { encrypt: function(R, m, j) {
              return D(m).encrypt(S, R, m, j);
            }, decrypt: function(R, m, j) {
              return D(m).decrypt(S, R, m, j);
            } };
          };
        }() }), f = h.StreamCipher = i2.extend({ _doFinalize: function() {
          var D = this._process(true);
          return D;
        }, blockSize: 1 }), s = C2.mode = {}, u = h.BlockCipherMode = b2.extend({ createEncryptor: function(D, S) {
          return this.Encryptor.create(D, S);
        }, createDecryptor: function(D, S) {
          return this.Decryptor.create(D, S);
        }, init: function(D, S) {
          this._cipher = D, this._iv = S;
        } }), B = s.CBC = function() {
          var D = u.extend();
          D.Encryptor = D.extend({ processBlock: function(R, m) {
            var j = this._cipher, W2 = j.blockSize;
            S.call(this, R, m, W2), j.encryptBlock(R, m), this._prevBlock = R.slice(m, m + W2);
          } }), D.Decryptor = D.extend({ processBlock: function(R, m) {
            var j = this._cipher, W2 = j.blockSize, I = R.slice(m, m + W2);
            j.decryptBlock(R, m), S.call(this, R, m, W2), this._prevBlock = I;
          } });
          function S(R, m, j) {
            var W2, I = this._iv;
            I ? (W2 = I, this._iv = e) : W2 = this._prevBlock;
            for (var O2 = 0; O2 < j; O2++)
              R[m + O2] ^= W2[O2];
          }
          return z2(S, "xorBlock"), D;
        }(), x = C2.pad = {}, n = x.Pkcs7 = { pad: function(D, S) {
          for (var R = S * 4, m = R - D.sigBytes % R, j = m << 24 | m << 16 | m << 8 | m, W2 = [], I = 0; I < m; I += 4)
            W2.push(j);
          var O2 = d.create(W2, m);
          D.concat(O2);
        }, unpad: function(D) {
          var S = D.words[D.sigBytes - 1 >>> 2] & 255;
          D.sigBytes -= S;
        } }, p = h.BlockCipher = i2.extend({ cfg: i2.cfg.extend({ mode: B, padding: n }), reset: function() {
          var D;
          i2.reset.call(this);
          var S = this.cfg, R = S.iv, m = S.mode;
          this._xformMode == this._ENC_XFORM_MODE ? D = m.createEncryptor : (D = m.createDecryptor, this._minBufferSize = 1), this._mode && this._mode.__creator == D ? this._mode.init(this, R && R.words) : (this._mode = D.call(m, this, R && R.words), this._mode.__creator = D);
        }, _doProcessBlock: function(D, S) {
          this._mode.processBlock(D, S);
        }, _doFinalize: function() {
          var D, S = this.cfg.padding;
          return this._xformMode == this._ENC_XFORM_MODE ? (S.pad(this._data, this.blockSize), D = this._process(true)) : (D = this._process(true), S.unpad(D)), D;
        }, blockSize: 128 / 32 }), l = h.CipherParams = b2.extend({ init: function(D) {
          this.mixIn(D);
        }, toString: function(D) {
          return (D || this.formatter).stringify(this);
        } }), E = C2.format = {}, A = E.OpenSSL = { stringify: function(D) {
          var S, R = D.ciphertext, m = D.salt;
          return m ? S = d.create([1398893684, 1701076831]).concat(m).concat(R) : S = R, S.toString(v);
        }, parse: function(D) {
          var S, R = v.parse(D), m = R.words;
          return m[0] == 1398893684 && m[1] == 1701076831 && (S = d.create(m.slice(2, 4)), m.splice(0, 4), R.sigBytes -= 16), l.create({ ciphertext: R, salt: S });
        } }, H2 = h.SerializableCipher = b2.extend({ cfg: b2.extend({ format: A }), encrypt: function(D, S, R, m) {
          m = this.cfg.extend(m);
          var j = D.createEncryptor(R, m), W2 = j.finalize(S), I = j.cfg;
          return l.create({ ciphertext: W2, key: R, iv: I.iv, algorithm: D, mode: I.mode, padding: I.padding, blockSize: D.blockSize, formatter: m.format });
        }, decrypt: function(D, S, R, m) {
          m = this.cfg.extend(m), S = this._parse(S, m.format);
          var j = D.createDecryptor(R, m).finalize(S.ciphertext);
          return j;
        }, _parse: function(D, S) {
          return typeof D == "string" ? S.parse(D, this) : D;
        } }), w2 = C2.kdf = {}, q = w2.OpenSSL = { execute: function(D, S, R, m, j) {
          if (m || (m = d.random(64 / 8)), j)
            var W2 = c.create({ keySize: S + R, hasher: j }).compute(D, m);
          else
            var W2 = c.create({ keySize: S + R }).compute(D, m);
          var I = d.create(W2.words.slice(S), R * 4);
          return W2.sigBytes = S * 4, l.create({ key: W2, iv: I, salt: m });
        } }, P2 = h.PasswordBasedCipher = H2.extend({ cfg: H2.cfg.extend({ kdf: q }), encrypt: function(D, S, R, m) {
          m = this.cfg.extend(m);
          var j = m.kdf.execute(R, D.keySize, D.ivSize, m.salt, m.hasher);
          m.iv = j.iv;
          var W2 = H2.encrypt.call(this, D, S, j.key, m);
          return W2.mixIn(j), W2;
        }, decrypt: function(D, S, R, m) {
          m = this.cfg.extend(m), S = this._parse(S, m.format);
          var j = m.kdf.execute(R, D.keySize, D.ivSize, S.salt, m.hasher);
          m.iv = j.iv;
          var W2 = H2.decrypt.call(this, D, S, j.key, m);
          return W2;
        } });
      }();
    });
  });
  var Ve2 = L2((U0, $e2) => {
    (function(t18, e, C2) {
      typeof U0 == "object" ? $e2.exports = U0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(U0, function(t18) {
      return t18.mode.CFB = function() {
        var e = t18.lib.BlockCipherMode.extend();
        e.Encryptor = e.extend({ processBlock: function(h, b2) {
          var d = this._cipher, F = d.blockSize;
          C2.call(this, h, b2, F, d), this._prevBlock = h.slice(b2, b2 + F);
        } }), e.Decryptor = e.extend({ processBlock: function(h, b2) {
          var d = this._cipher, F = d.blockSize, r = h.slice(b2, b2 + F);
          C2.call(this, h, b2, F, d), this._prevBlock = r;
        } });
        function C2(h, b2, d, F) {
          var r, o = this._iv;
          o ? (r = o.slice(0), this._iv = void 0) : r = this._prevBlock, F.encryptBlock(r, 0);
          for (var v = 0; v < d; v++)
            h[b2 + v] ^= r[v];
        }
        return z2(C2, "generateKeystreamAndEncrypt"), e;
      }(), t18.mode.CFB;
    });
  });
  var er2 = L2((O0, Me2) => {
    (function(t18, e, C2) {
      typeof O0 == "object" ? Me2.exports = O0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(O0, function(t18) {
      return t18.mode.CTR = function() {
        var e = t18.lib.BlockCipherMode.extend(), C2 = e.Encryptor = e.extend({ processBlock: function(h, b2) {
          var d = this._cipher, F = d.blockSize, r = this._iv, o = this._counter;
          r && (o = this._counter = r.slice(0), this._iv = void 0);
          var v = o.slice(0);
          d.encryptBlock(v, 0), o[F - 1] = o[F - 1] + 1 | 0;
          for (var a = 0; a < F; a++)
            h[b2 + a] ^= v[a];
        } });
        return e.Decryptor = C2, e;
      }(), t18.mode.CTR;
    });
  });
  var xr2 = L2((T0, rr) => {
    (function(t18, e, C2) {
      typeof T0 == "object" ? rr.exports = T0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(T0, function(t18) {
      return t18.mode.CTRGladman = function() {
        var e = t18.lib.BlockCipherMode.extend();
        function C2(d) {
          if ((d >> 24 & 255) == 255) {
            var F = d >> 16 & 255, r = d >> 8 & 255, o = d & 255;
            F === 255 ? (F = 0, r === 255 ? (r = 0, o === 255 ? o = 0 : ++o) : ++r) : ++F, d = 0, d += F << 16, d += r << 8, d += o;
          } else
            d += 1 << 24;
          return d;
        }
        z2(C2, "incWord");
        function h(d) {
          return (d[0] = C2(d[0])) === 0 && (d[1] = C2(d[1])), d;
        }
        z2(h, "incCounter");
        var b2 = e.Encryptor = e.extend({ processBlock: function(d, F) {
          var r = this._cipher, o = r.blockSize, v = this._iv, a = this._counter;
          v && (a = this._counter = v.slice(0), this._iv = void 0), h(a);
          var c = a.slice(0);
          r.encryptBlock(c, 0);
          for (var i2 = 0; i2 < o; i2++)
            d[F + i2] ^= c[i2];
        } });
        return e.Decryptor = b2, e;
      }(), t18.mode.CTRGladman;
    });
  });
  var ar = L2((X0, tr2) => {
    (function(t18, e, C2) {
      typeof X0 == "object" ? tr2.exports = X0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(X0, function(t18) {
      return t18.mode.OFB = function() {
        var e = t18.lib.BlockCipherMode.extend(), C2 = e.Encryptor = e.extend({ processBlock: function(h, b2) {
          var d = this._cipher, F = d.blockSize, r = this._iv, o = this._keystream;
          r && (o = this._keystream = r.slice(0), this._iv = void 0), d.encryptBlock(o, 0);
          for (var v = 0; v < F; v++)
            h[b2 + v] ^= o[v];
        } });
        return e.Decryptor = C2, e;
      }(), t18.mode.OFB;
    });
  });
  var nr = L2((K0, ir) => {
    (function(t18, e, C2) {
      typeof K0 == "object" ? ir.exports = K0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(K0, function(t18) {
      return t18.mode.ECB = function() {
        var e = t18.lib.BlockCipherMode.extend();
        return e.Encryptor = e.extend({ processBlock: function(C2, h) {
          this._cipher.encryptBlock(C2, h);
        } }), e.Decryptor = e.extend({ processBlock: function(C2, h) {
          this._cipher.decryptBlock(C2, h);
        } }), e;
      }(), t18.mode.ECB;
    });
  });
  var sr = L2((G0, or) => {
    (function(t18, e, C2) {
      typeof G0 == "object" ? or.exports = G0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(G0, function(t18) {
      return t18.pad.AnsiX923 = { pad: function(e, C2) {
        var h = e.sigBytes, b2 = C2 * 4, d = b2 - h % b2, F = h + d - 1;
        e.clamp(), e.words[F >>> 2] |= d << 24 - F % 4 * 8, e.sigBytes += d;
      }, unpad: function(e) {
        var C2 = e.words[e.sigBytes - 1 >>> 2] & 255;
        e.sigBytes -= C2;
      } }, t18.pad.Ansix923;
    });
  });
  var cr2 = L2((Z0, fr2) => {
    (function(t18, e, C2) {
      typeof Z0 == "object" ? fr2.exports = Z0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(Z0, function(t18) {
      return t18.pad.Iso10126 = { pad: function(e, C2) {
        var h = C2 * 4, b2 = h - e.sigBytes % h;
        e.concat(t18.lib.WordArray.random(b2 - 1)).concat(t18.lib.WordArray.create([b2 << 24], 1));
      }, unpad: function(e) {
        var C2 = e.words[e.sigBytes - 1 >>> 2] & 255;
        e.sigBytes -= C2;
      } }, t18.pad.Iso10126;
    });
  });
  var dr2 = L2((J0, vr2) => {
    (function(t18, e, C2) {
      typeof J0 == "object" ? vr2.exports = J0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(J0, function(t18) {
      return t18.pad.Iso97971 = { pad: function(e, C2) {
        e.concat(t18.lib.WordArray.create([2147483648], 1)), t18.pad.ZeroPadding.pad(e, C2);
      }, unpad: function(e) {
        t18.pad.ZeroPadding.unpad(e), e.sigBytes--;
      } }, t18.pad.Iso97971;
    });
  });
  var hr2 = L2((Q0, lr2) => {
    (function(t18, e, C2) {
      typeof Q0 == "object" ? lr2.exports = Q0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(Q0, function(t18) {
      return t18.pad.ZeroPadding = { pad: function(e, C2) {
        var h = C2 * 4;
        e.clamp(), e.sigBytes += h - (e.sigBytes % h || h);
      }, unpad: function(e) {
        for (var C2 = e.words, h = e.sigBytes - 1, h = e.sigBytes - 1; h >= 0; h--)
          if (C2[h >>> 2] >>> 24 - h % 4 * 8 & 255) {
            e.sigBytes = h + 1;
            break;
          }
      } }, t18.pad.ZeroPadding;
    });
  });
  var Br2 = L2((Y0, ur2) => {
    (function(t18, e, C2) {
      typeof Y0 == "object" ? ur2.exports = Y0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })(Y0, function(t18) {
      return t18.pad.NoPadding = { pad: function() {
      }, unpad: function() {
      } }, t18.pad.NoPadding;
    });
  });
  var pr2 = L2(($0, Cr2) => {
    (function(t18, e, C2) {
      typeof $0 == "object" ? Cr2.exports = $0 = e(U(), K()) : typeof define == "function" && define.amd ? define(["./core", "./cipher-core"], e) : e(t18.CryptoJS);
    })($0, function(t18) {
      return function(e) {
        var C2 = t18, h = C2.lib, b2 = h.CipherParams, d = C2.enc, F = d.Hex, r = C2.format, o = r.Hex = { stringify: function(v) {
          return v.ciphertext.toString(F);
        }, parse: function(v) {
          var a = F.parse(v);
          return b2.create({ ciphertext: a });
        } };
      }(), t18.format.Hex;
    });
  });
  var Ar2 = L2((V0, Er2) => {
    (function(t18, e, C2) {
      typeof V0 == "object" ? Er2.exports = V0 = e(U(), x0(), t0(), M(), K()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], e) : e(t18.CryptoJS);
    })(V0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.BlockCipher, b2 = e.algo, d = [], F = [], r = [], o = [], v = [], a = [], c = [], i2 = [], f = [], s = [];
        (function() {
          for (var x = [], n = 0; n < 256; n++)
            n < 128 ? x[n] = n << 1 : x[n] = n << 1 ^ 283;
          for (var p = 0, l = 0, n = 0; n < 256; n++) {
            var E = l ^ l << 1 ^ l << 2 ^ l << 3 ^ l << 4;
            E = E >>> 8 ^ E & 255 ^ 99, d[p] = E, F[E] = p;
            var A = x[p], H2 = x[A], w2 = x[H2], q = x[E] * 257 ^ E * 16843008;
            r[p] = q << 24 | q >>> 8, o[p] = q << 16 | q >>> 16, v[p] = q << 8 | q >>> 24, a[p] = q;
            var q = w2 * 16843009 ^ H2 * 65537 ^ A * 257 ^ p * 16843008;
            c[E] = q << 24 | q >>> 8, i2[E] = q << 16 | q >>> 16, f[E] = q << 8 | q >>> 24, s[E] = q, p ? (p = A ^ x[x[x[w2 ^ A]]], l ^= x[x[l]]) : p = l = 1;
          }
        })();
        var u = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], B = b2.AES = h.extend({ _doReset: function() {
          var x;
          if (!(this._nRounds && this._keyPriorReset === this._key)) {
            for (var n = this._keyPriorReset = this._key, p = n.words, l = n.sigBytes / 4, E = this._nRounds = l + 6, A = (E + 1) * 4, H2 = this._keySchedule = [], w2 = 0; w2 < A; w2++)
              w2 < l ? H2[w2] = p[w2] : (x = H2[w2 - 1], w2 % l ? l > 6 && w2 % l == 4 && (x = d[x >>> 24] << 24 | d[x >>> 16 & 255] << 16 | d[x >>> 8 & 255] << 8 | d[x & 255]) : (x = x << 8 | x >>> 24, x = d[x >>> 24] << 24 | d[x >>> 16 & 255] << 16 | d[x >>> 8 & 255] << 8 | d[x & 255], x ^= u[w2 / l | 0] << 24), H2[w2] = H2[w2 - l] ^ x);
            for (var q = this._invKeySchedule = [], P2 = 0; P2 < A; P2++) {
              var w2 = A - P2;
              if (P2 % 4)
                var x = H2[w2];
              else
                var x = H2[w2 - 4];
              P2 < 4 || w2 <= 4 ? q[P2] = x : q[P2] = c[d[x >>> 24]] ^ i2[d[x >>> 16 & 255]] ^ f[d[x >>> 8 & 255]] ^ s[d[x & 255]];
            }
          }
        }, encryptBlock: function(x, n) {
          this._doCryptBlock(x, n, this._keySchedule, r, o, v, a, d);
        }, decryptBlock: function(x, n) {
          var p = x[n + 1];
          x[n + 1] = x[n + 3], x[n + 3] = p, this._doCryptBlock(x, n, this._invKeySchedule, c, i2, f, s, F);
          var p = x[n + 1];
          x[n + 1] = x[n + 3], x[n + 3] = p;
        }, _doCryptBlock: function(x, n, p, l, E, A, H2, w2) {
          for (var q = this._nRounds, P2 = x[n] ^ p[0], D = x[n + 1] ^ p[1], S = x[n + 2] ^ p[2], R = x[n + 3] ^ p[3], m = 4, j = 1; j < q; j++) {
            var W2 = l[P2 >>> 24] ^ E[D >>> 16 & 255] ^ A[S >>> 8 & 255] ^ H2[R & 255] ^ p[m++], I = l[D >>> 24] ^ E[S >>> 16 & 255] ^ A[R >>> 8 & 255] ^ H2[P2 & 255] ^ p[m++], O2 = l[S >>> 24] ^ E[R >>> 16 & 255] ^ A[P2 >>> 8 & 255] ^ H2[D & 255] ^ p[m++], _2 = l[R >>> 24] ^ E[P2 >>> 16 & 255] ^ A[D >>> 8 & 255] ^ H2[S & 255] ^ p[m++];
            P2 = W2, D = I, S = O2, R = _2;
          }
          var W2 = (w2[P2 >>> 24] << 24 | w2[D >>> 16 & 255] << 16 | w2[S >>> 8 & 255] << 8 | w2[R & 255]) ^ p[m++], I = (w2[D >>> 24] << 24 | w2[S >>> 16 & 255] << 16 | w2[R >>> 8 & 255] << 8 | w2[P2 & 255]) ^ p[m++], O2 = (w2[S >>> 24] << 24 | w2[R >>> 16 & 255] << 16 | w2[P2 >>> 8 & 255] << 8 | w2[D & 255]) ^ p[m++], _2 = (w2[R >>> 24] << 24 | w2[P2 >>> 16 & 255] << 16 | w2[D >>> 8 & 255] << 8 | w2[S & 255]) ^ p[m++];
          x[n] = W2, x[n + 1] = I, x[n + 2] = O2, x[n + 3] = _2;
        }, keySize: 256 / 32 });
        e.AES = h._createHelper(B);
      }(), t18.AES;
    });
  });
  var Dr2 = L2((M0, Fr2) => {
    (function(t18, e, C2) {
      typeof M0 == "object" ? Fr2.exports = M0 = e(U(), x0(), t0(), M(), K()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], e) : e(t18.CryptoJS);
    })(M0, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.WordArray, b2 = C2.BlockCipher, d = e.algo, F = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4], r = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32], o = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], v = [{ 0: 8421888, 268435456: 32768, 536870912: 8421378, 805306368: 2, 1073741824: 512, 1342177280: 8421890, 1610612736: 8389122, 1879048192: 8388608, 2147483648: 514, 2415919104: 8389120, 2684354560: 33280, 2952790016: 8421376, 3221225472: 32770, 3489660928: 8388610, 3758096384: 0, 4026531840: 33282, 134217728: 0, 402653184: 8421890, 671088640: 33282, 939524096: 32768, 1207959552: 8421888, 1476395008: 512, 1744830464: 8421378, 2013265920: 2, 2281701376: 8389120, 2550136832: 33280, 2818572288: 8421376, 3087007744: 8389122, 3355443200: 8388610, 3623878656: 32770, 3892314112: 514, 4160749568: 8388608, 1: 32768, 268435457: 2, 536870913: 8421888, 805306369: 8388608, 1073741825: 8421378, 1342177281: 33280, 1610612737: 512, 1879048193: 8389122, 2147483649: 8421890, 2415919105: 8421376, 2684354561: 8388610, 2952790017: 33282, 3221225473: 514, 3489660929: 8389120, 3758096385: 32770, 4026531841: 0, 134217729: 8421890, 402653185: 8421376, 671088641: 8388608, 939524097: 512, 1207959553: 32768, 1476395009: 8388610, 1744830465: 2, 2013265921: 33282, 2281701377: 32770, 2550136833: 8389122, 2818572289: 514, 3087007745: 8421888, 3355443201: 8389120, 3623878657: 0, 3892314113: 33280, 4160749569: 8421378 }, { 0: 1074282512, 16777216: 16384, 33554432: 524288, 50331648: 1074266128, 67108864: 1073741840, 83886080: 1074282496, 100663296: 1073758208, 117440512: 16, 134217728: 540672, 150994944: 1073758224, 167772160: 1073741824, 184549376: 540688, 201326592: 524304, 218103808: 0, 234881024: 16400, 251658240: 1074266112, 8388608: 1073758208, 25165824: 540688, 41943040: 16, 58720256: 1073758224, 75497472: 1074282512, 92274688: 1073741824, 109051904: 524288, 125829120: 1074266128, 142606336: 524304, 159383552: 0, 176160768: 16384, 192937984: 1074266112, 209715200: 1073741840, 226492416: 540672, 243269632: 1074282496, 260046848: 16400, 268435456: 0, 285212672: 1074266128, 301989888: 1073758224, 318767104: 1074282496, 335544320: 1074266112, 352321536: 16, 369098752: 540688, 385875968: 16384, 402653184: 16400, 419430400: 524288, 436207616: 524304, 452984832: 1073741840, 469762048: 540672, 486539264: 1073758208, 503316480: 1073741824, 520093696: 1074282512, 276824064: 540688, 293601280: 524288, 310378496: 1074266112, 327155712: 16384, 343932928: 1073758208, 360710144: 1074282512, 377487360: 16, 394264576: 1073741824, 411041792: 1074282496, 427819008: 1073741840, 444596224: 1073758224, 461373440: 524304, 478150656: 0, 494927872: 16400, 511705088: 1074266128, 528482304: 540672 }, { 0: 260, 1048576: 0, 2097152: 67109120, 3145728: 65796, 4194304: 65540, 5242880: 67108868, 6291456: 67174660, 7340032: 67174400, 8388608: 67108864, 9437184: 67174656, 10485760: 65792, 11534336: 67174404, 12582912: 67109124, 13631488: 65536, 14680064: 4, 15728640: 256, 524288: 67174656, 1572864: 67174404, 2621440: 0, 3670016: 67109120, 4718592: 67108868, 5767168: 65536, 6815744: 65540, 7864320: 260, 8912896: 4, 9961472: 256, 11010048: 67174400, 12058624: 65796, 13107200: 65792, 14155776: 67109124, 15204352: 67174660, 16252928: 67108864, 16777216: 67174656, 17825792: 65540, 18874368: 65536, 19922944: 67109120, 20971520: 256, 22020096: 67174660, 23068672: 67108868, 24117248: 0, 25165824: 67109124, 26214400: 67108864, 27262976: 4, 28311552: 65792, 29360128: 67174400, 30408704: 260, 31457280: 65796, 32505856: 67174404, 17301504: 67108864, 18350080: 260, 19398656: 67174656, 20447232: 0, 21495808: 65540, 22544384: 67109120, 23592960: 256, 24641536: 67174404, 25690112: 65536, 26738688: 67174660, 27787264: 65796, 28835840: 67108868, 29884416: 67109124, 30932992: 67174400, 31981568: 4, 33030144: 65792 }, { 0: 2151682048, 65536: 2147487808, 131072: 4198464, 196608: 2151677952, 262144: 0, 327680: 4198400, 393216: 2147483712, 458752: 4194368, 524288: 2147483648, 589824: 4194304, 655360: 64, 720896: 2147487744, 786432: 2151678016, 851968: 4160, 917504: 4096, 983040: 2151682112, 32768: 2147487808, 98304: 64, 163840: 2151678016, 229376: 2147487744, 294912: 4198400, 360448: 2151682112, 425984: 0, 491520: 2151677952, 557056: 4096, 622592: 2151682048, 688128: 4194304, 753664: 4160, 819200: 2147483648, 884736: 4194368, 950272: 4198464, 1015808: 2147483712, 1048576: 4194368, 1114112: 4198400, 1179648: 2147483712, 1245184: 0, 1310720: 4160, 1376256: 2151678016, 1441792: 2151682048, 1507328: 2147487808, 1572864: 2151682112, 1638400: 2147483648, 1703936: 2151677952, 1769472: 4198464, 1835008: 2147487744, 1900544: 4194304, 1966080: 64, 2031616: 4096, 1081344: 2151677952, 1146880: 2151682112, 1212416: 0, 1277952: 4198400, 1343488: 4194368, 1409024: 2147483648, 1474560: 2147487808, 1540096: 64, 1605632: 2147483712, 1671168: 4096, 1736704: 2147487744, 1802240: 2151678016, 1867776: 4160, 1933312: 2151682048, 1998848: 4194304, 2064384: 4198464 }, { 0: 128, 4096: 17039360, 8192: 262144, 12288: 536870912, 16384: 537133184, 20480: 16777344, 24576: 553648256, 28672: 262272, 32768: 16777216, 36864: 537133056, 40960: 536871040, 45056: 553910400, 49152: 553910272, 53248: 0, 57344: 17039488, 61440: 553648128, 2048: 17039488, 6144: 553648256, 10240: 128, 14336: 17039360, 18432: 262144, 22528: 537133184, 26624: 553910272, 30720: 536870912, 34816: 537133056, 38912: 0, 43008: 553910400, 47104: 16777344, 51200: 536871040, 55296: 553648128, 59392: 16777216, 63488: 262272, 65536: 262144, 69632: 128, 73728: 536870912, 77824: 553648256, 81920: 16777344, 86016: 553910272, 90112: 537133184, 94208: 16777216, 98304: 553910400, 102400: 553648128, 106496: 17039360, 110592: 537133056, 114688: 262272, 118784: 536871040, 122880: 0, 126976: 17039488, 67584: 553648256, 71680: 16777216, 75776: 17039360, 79872: 537133184, 83968: 536870912, 88064: 17039488, 92160: 128, 96256: 553910272, 100352: 262272, 104448: 553910400, 108544: 0, 112640: 553648128, 116736: 16777344, 120832: 262144, 124928: 537133056, 129024: 536871040 }, { 0: 268435464, 256: 8192, 512: 270532608, 768: 270540808, 1024: 268443648, 1280: 2097152, 1536: 2097160, 1792: 268435456, 2048: 0, 2304: 268443656, 2560: 2105344, 2816: 8, 3072: 270532616, 3328: 2105352, 3584: 8200, 3840: 270540800, 128: 270532608, 384: 270540808, 640: 8, 896: 2097152, 1152: 2105352, 1408: 268435464, 1664: 268443648, 1920: 8200, 2176: 2097160, 2432: 8192, 2688: 268443656, 2944: 270532616, 3200: 0, 3456: 270540800, 3712: 2105344, 3968: 268435456, 4096: 268443648, 4352: 270532616, 4608: 270540808, 4864: 8200, 5120: 2097152, 5376: 268435456, 5632: 268435464, 5888: 2105344, 6144: 2105352, 6400: 0, 6656: 8, 6912: 270532608, 7168: 8192, 7424: 268443656, 7680: 270540800, 7936: 2097160, 4224: 8, 4480: 2105344, 4736: 2097152, 4992: 268435464, 5248: 268443648, 5504: 8200, 5760: 270540808, 6016: 270532608, 6272: 270540800, 6528: 270532616, 6784: 8192, 7040: 2105352, 7296: 2097160, 7552: 0, 7808: 268435456, 8064: 268443656 }, { 0: 1048576, 16: 33555457, 32: 1024, 48: 1049601, 64: 34604033, 80: 0, 96: 1, 112: 34603009, 128: 33555456, 144: 1048577, 160: 33554433, 176: 34604032, 192: 34603008, 208: 1025, 224: 1049600, 240: 33554432, 8: 34603009, 24: 0, 40: 33555457, 56: 34604032, 72: 1048576, 88: 33554433, 104: 33554432, 120: 1025, 136: 1049601, 152: 33555456, 168: 34603008, 184: 1048577, 200: 1024, 216: 34604033, 232: 1, 248: 1049600, 256: 33554432, 272: 1048576, 288: 33555457, 304: 34603009, 320: 1048577, 336: 33555456, 352: 34604032, 368: 1049601, 384: 1025, 400: 34604033, 416: 1049600, 432: 1, 448: 0, 464: 34603008, 480: 33554433, 496: 1024, 264: 1049600, 280: 33555457, 296: 34603009, 312: 1, 328: 33554432, 344: 1048576, 360: 1025, 376: 34604032, 392: 33554433, 408: 34603008, 424: 0, 440: 34604033, 456: 1049601, 472: 1024, 488: 33555456, 504: 1048577 }, { 0: 134219808, 1: 131072, 2: 134217728, 3: 32, 4: 131104, 5: 134350880, 6: 134350848, 7: 2048, 8: 134348800, 9: 134219776, 10: 133120, 11: 134348832, 12: 2080, 13: 0, 14: 134217760, 15: 133152, 2147483648: 2048, 2147483649: 134350880, 2147483650: 134219808, 2147483651: 134217728, 2147483652: 134348800, 2147483653: 133120, 2147483654: 133152, 2147483655: 32, 2147483656: 134217760, 2147483657: 2080, 2147483658: 131104, 2147483659: 134350848, 2147483660: 0, 2147483661: 134348832, 2147483662: 134219776, 2147483663: 131072, 16: 133152, 17: 134350848, 18: 32, 19: 2048, 20: 134219776, 21: 134217760, 22: 134348832, 23: 131072, 24: 0, 25: 131104, 26: 134348800, 27: 134219808, 28: 134350880, 29: 133120, 30: 2080, 31: 134217728, 2147483664: 131072, 2147483665: 2048, 2147483666: 134348832, 2147483667: 133152, 2147483668: 32, 2147483669: 134348800, 2147483670: 134217728, 2147483671: 134219808, 2147483672: 134350880, 2147483673: 134217760, 2147483674: 134219776, 2147483675: 0, 2147483676: 133120, 2147483677: 2080, 2147483678: 131104, 2147483679: 134350848 }], a = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679], c = d.DES = b2.extend({ _doReset: function() {
          for (var u = this._key, B = u.words, x = [], n = 0; n < 56; n++) {
            var p = F[n] - 1;
            x[n] = B[p >>> 5] >>> 31 - p % 32 & 1;
          }
          for (var l = this._subKeys = [], E = 0; E < 16; E++) {
            for (var A = l[E] = [], H2 = o[E], n = 0; n < 24; n++)
              A[n / 6 | 0] |= x[(r[n] - 1 + H2) % 28] << 31 - n % 6, A[4 + (n / 6 | 0)] |= x[28 + (r[n + 24] - 1 + H2) % 28] << 31 - n % 6;
            A[0] = A[0] << 1 | A[0] >>> 31;
            for (var n = 1; n < 7; n++)
              A[n] = A[n] >>> (n - 1) * 4 + 3;
            A[7] = A[7] << 5 | A[7] >>> 27;
          }
          for (var w2 = this._invSubKeys = [], n = 0; n < 16; n++)
            w2[n] = l[15 - n];
        }, encryptBlock: function(u, B) {
          this._doCryptBlock(u, B, this._subKeys);
        }, decryptBlock: function(u, B) {
          this._doCryptBlock(u, B, this._invSubKeys);
        }, _doCryptBlock: function(u, B, x) {
          this._lBlock = u[B], this._rBlock = u[B + 1], i2.call(this, 4, 252645135), i2.call(this, 16, 65535), f.call(this, 2, 858993459), f.call(this, 8, 16711935), i2.call(this, 1, 1431655765);
          for (var n = 0; n < 16; n++) {
            for (var p = x[n], l = this._lBlock, E = this._rBlock, A = 0, H2 = 0; H2 < 8; H2++)
              A |= v[H2][((E ^ p[H2]) & a[H2]) >>> 0];
            this._lBlock = E, this._rBlock = l ^ A;
          }
          var w2 = this._lBlock;
          this._lBlock = this._rBlock, this._rBlock = w2, i2.call(this, 1, 1431655765), f.call(this, 8, 16711935), f.call(this, 2, 858993459), i2.call(this, 16, 65535), i2.call(this, 4, 252645135), u[B] = this._lBlock, u[B + 1] = this._rBlock;
        }, keySize: 64 / 32, ivSize: 64 / 32, blockSize: 64 / 32 });
        function i2(u, B) {
          var x = (this._lBlock >>> u ^ this._rBlock) & B;
          this._rBlock ^= x, this._lBlock ^= x << u;
        }
        z2(i2, "exchangeLR");
        function f(u, B) {
          var x = (this._rBlock >>> u ^ this._lBlock) & B;
          this._lBlock ^= x, this._rBlock ^= x << u;
        }
        z2(f, "exchangeRL"), e.DES = b2._createHelper(c);
        var s = d.TripleDES = b2.extend({ _doReset: function() {
          var u = this._key, B = u.words;
          if (B.length !== 2 && B.length !== 4 && B.length < 6)
            throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
          var x = B.slice(0, 2), n = B.length < 4 ? B.slice(0, 2) : B.slice(2, 4), p = B.length < 6 ? B.slice(0, 2) : B.slice(4, 6);
          this._des1 = c.createEncryptor(h.create(x)), this._des2 = c.createEncryptor(h.create(n)), this._des3 = c.createEncryptor(h.create(p));
        }, encryptBlock: function(u, B) {
          this._des1.encryptBlock(u, B), this._des2.decryptBlock(u, B), this._des3.encryptBlock(u, B);
        }, decryptBlock: function(u, B) {
          this._des3.decryptBlock(u, B), this._des2.encryptBlock(u, B), this._des1.decryptBlock(u, B);
        }, keySize: 192 / 32, ivSize: 64 / 32, blockSize: 64 / 32 });
        e.TripleDES = b2._createHelper(s);
      }(), t18.TripleDES;
    });
  });
  var br2 = L2((ee2, _r2) => {
    (function(t18, e, C2) {
      typeof ee2 == "object" ? _r2.exports = ee2 = e(U(), x0(), t0(), M(), K()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], e) : e(t18.CryptoJS);
    })(ee2, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.StreamCipher, b2 = e.algo, d = b2.RC4 = h.extend({ _doReset: function() {
          for (var o = this._key, v = o.words, a = o.sigBytes, c = this._S = [], i2 = 0; i2 < 256; i2++)
            c[i2] = i2;
          for (var i2 = 0, f = 0; i2 < 256; i2++) {
            var s = i2 % a, u = v[s >>> 2] >>> 24 - s % 4 * 8 & 255;
            f = (f + c[i2] + u) % 256;
            var B = c[i2];
            c[i2] = c[f], c[f] = B;
          }
          this._i = this._j = 0;
        }, _doProcessBlock: function(o, v) {
          o[v] ^= F.call(this);
        }, keySize: 256 / 32, ivSize: 0 });
        function F() {
          for (var o = this._S, v = this._i, a = this._j, c = 0, i2 = 0; i2 < 4; i2++) {
            v = (v + 1) % 256, a = (a + o[v]) % 256;
            var f = o[v];
            o[v] = o[a], o[a] = f, c |= o[(o[v] + o[a]) % 256] << 24 - i2 * 8;
          }
          return this._i = v, this._j = a, c;
        }
        z2(F, "generateKeystreamWord"), e.RC4 = h._createHelper(d);
        var r = b2.RC4Drop = d.extend({ cfg: d.cfg.extend({ drop: 192 }), _doReset: function() {
          d._doReset.call(this);
          for (var o = this.cfg.drop; o > 0; o--)
            F.call(this);
        } });
        e.RC4Drop = h._createHelper(r);
      }(), t18.RC4;
    });
  });
  var gr2 = L2((re2, yr2) => {
    (function(t18, e, C2) {
      typeof re2 == "object" ? yr2.exports = re2 = e(U(), x0(), t0(), M(), K()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], e) : e(t18.CryptoJS);
    })(re2, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.StreamCipher, b2 = e.algo, d = [], F = [], r = [], o = b2.Rabbit = h.extend({ _doReset: function() {
          for (var a = this._key.words, c = this.cfg.iv, i2 = 0; i2 < 4; i2++)
            a[i2] = (a[i2] << 8 | a[i2] >>> 24) & 16711935 | (a[i2] << 24 | a[i2] >>> 8) & 4278255360;
          var f = this._X = [a[0], a[3] << 16 | a[2] >>> 16, a[1], a[0] << 16 | a[3] >>> 16, a[2], a[1] << 16 | a[0] >>> 16, a[3], a[2] << 16 | a[1] >>> 16], s = this._C = [a[2] << 16 | a[2] >>> 16, a[0] & 4294901760 | a[1] & 65535, a[3] << 16 | a[3] >>> 16, a[1] & 4294901760 | a[2] & 65535, a[0] << 16 | a[0] >>> 16, a[2] & 4294901760 | a[3] & 65535, a[1] << 16 | a[1] >>> 16, a[3] & 4294901760 | a[0] & 65535];
          this._b = 0;
          for (var i2 = 0; i2 < 4; i2++)
            v.call(this);
          for (var i2 = 0; i2 < 8; i2++)
            s[i2] ^= f[i2 + 4 & 7];
          if (c) {
            var u = c.words, B = u[0], x = u[1], n = (B << 8 | B >>> 24) & 16711935 | (B << 24 | B >>> 8) & 4278255360, p = (x << 8 | x >>> 24) & 16711935 | (x << 24 | x >>> 8) & 4278255360, l = n >>> 16 | p & 4294901760, E = p << 16 | n & 65535;
            s[0] ^= n, s[1] ^= l, s[2] ^= p, s[3] ^= E, s[4] ^= n, s[5] ^= l, s[6] ^= p, s[7] ^= E;
            for (var i2 = 0; i2 < 4; i2++)
              v.call(this);
          }
        }, _doProcessBlock: function(a, c) {
          var i2 = this._X;
          v.call(this), d[0] = i2[0] ^ i2[5] >>> 16 ^ i2[3] << 16, d[1] = i2[2] ^ i2[7] >>> 16 ^ i2[5] << 16, d[2] = i2[4] ^ i2[1] >>> 16 ^ i2[7] << 16, d[3] = i2[6] ^ i2[3] >>> 16 ^ i2[1] << 16;
          for (var f = 0; f < 4; f++)
            d[f] = (d[f] << 8 | d[f] >>> 24) & 16711935 | (d[f] << 24 | d[f] >>> 8) & 4278255360, a[c + f] ^= d[f];
        }, blockSize: 128 / 32, ivSize: 64 / 32 });
        function v() {
          for (var a = this._X, c = this._C, i2 = 0; i2 < 8; i2++)
            F[i2] = c[i2];
          c[0] = c[0] + 1295307597 + this._b | 0, c[1] = c[1] + 3545052371 + (c[0] >>> 0 < F[0] >>> 0 ? 1 : 0) | 0, c[2] = c[2] + 886263092 + (c[1] >>> 0 < F[1] >>> 0 ? 1 : 0) | 0, c[3] = c[3] + 1295307597 + (c[2] >>> 0 < F[2] >>> 0 ? 1 : 0) | 0, c[4] = c[4] + 3545052371 + (c[3] >>> 0 < F[3] >>> 0 ? 1 : 0) | 0, c[5] = c[5] + 886263092 + (c[4] >>> 0 < F[4] >>> 0 ? 1 : 0) | 0, c[6] = c[6] + 1295307597 + (c[5] >>> 0 < F[5] >>> 0 ? 1 : 0) | 0, c[7] = c[7] + 3545052371 + (c[6] >>> 0 < F[6] >>> 0 ? 1 : 0) | 0, this._b = c[7] >>> 0 < F[7] >>> 0 ? 1 : 0;
          for (var i2 = 0; i2 < 8; i2++) {
            var f = a[i2] + c[i2], s = f & 65535, u = f >>> 16, B = ((s * s >>> 17) + s * u >>> 15) + u * u, x = ((f & 4294901760) * f | 0) + ((f & 65535) * f | 0);
            r[i2] = B ^ x;
          }
          a[0] = r[0] + (r[7] << 16 | r[7] >>> 16) + (r[6] << 16 | r[6] >>> 16) | 0, a[1] = r[1] + (r[0] << 8 | r[0] >>> 24) + r[7] | 0, a[2] = r[2] + (r[1] << 16 | r[1] >>> 16) + (r[0] << 16 | r[0] >>> 16) | 0, a[3] = r[3] + (r[2] << 8 | r[2] >>> 24) + r[1] | 0, a[4] = r[4] + (r[3] << 16 | r[3] >>> 16) + (r[2] << 16 | r[2] >>> 16) | 0, a[5] = r[5] + (r[4] << 8 | r[4] >>> 24) + r[3] | 0, a[6] = r[6] + (r[5] << 16 | r[5] >>> 16) + (r[4] << 16 | r[4] >>> 16) | 0, a[7] = r[7] + (r[6] << 8 | r[6] >>> 24) + r[5] | 0;
        }
        z2(v, "nextState"), e.Rabbit = h._createHelper(o);
      }(), t18.Rabbit;
    });
  });
  var kr2 = L2((xe2, mr2) => {
    (function(t18, e, C2) {
      typeof xe2 == "object" ? mr2.exports = xe2 = e(U(), x0(), t0(), M(), K()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], e) : e(t18.CryptoJS);
    })(xe2, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.StreamCipher, b2 = e.algo, d = [], F = [], r = [], o = b2.RabbitLegacy = h.extend({ _doReset: function() {
          var a = this._key.words, c = this.cfg.iv, i2 = this._X = [a[0], a[3] << 16 | a[2] >>> 16, a[1], a[0] << 16 | a[3] >>> 16, a[2], a[1] << 16 | a[0] >>> 16, a[3], a[2] << 16 | a[1] >>> 16], f = this._C = [a[2] << 16 | a[2] >>> 16, a[0] & 4294901760 | a[1] & 65535, a[3] << 16 | a[3] >>> 16, a[1] & 4294901760 | a[2] & 65535, a[0] << 16 | a[0] >>> 16, a[2] & 4294901760 | a[3] & 65535, a[1] << 16 | a[1] >>> 16, a[3] & 4294901760 | a[0] & 65535];
          this._b = 0;
          for (var s = 0; s < 4; s++)
            v.call(this);
          for (var s = 0; s < 8; s++)
            f[s] ^= i2[s + 4 & 7];
          if (c) {
            var u = c.words, B = u[0], x = u[1], n = (B << 8 | B >>> 24) & 16711935 | (B << 24 | B >>> 8) & 4278255360, p = (x << 8 | x >>> 24) & 16711935 | (x << 24 | x >>> 8) & 4278255360, l = n >>> 16 | p & 4294901760, E = p << 16 | n & 65535;
            f[0] ^= n, f[1] ^= l, f[2] ^= p, f[3] ^= E, f[4] ^= n, f[5] ^= l, f[6] ^= p, f[7] ^= E;
            for (var s = 0; s < 4; s++)
              v.call(this);
          }
        }, _doProcessBlock: function(a, c) {
          var i2 = this._X;
          v.call(this), d[0] = i2[0] ^ i2[5] >>> 16 ^ i2[3] << 16, d[1] = i2[2] ^ i2[7] >>> 16 ^ i2[5] << 16, d[2] = i2[4] ^ i2[1] >>> 16 ^ i2[7] << 16, d[3] = i2[6] ^ i2[3] >>> 16 ^ i2[1] << 16;
          for (var f = 0; f < 4; f++)
            d[f] = (d[f] << 8 | d[f] >>> 24) & 16711935 | (d[f] << 24 | d[f] >>> 8) & 4278255360, a[c + f] ^= d[f];
        }, blockSize: 128 / 32, ivSize: 64 / 32 });
        function v() {
          for (var a = this._X, c = this._C, i2 = 0; i2 < 8; i2++)
            F[i2] = c[i2];
          c[0] = c[0] + 1295307597 + this._b | 0, c[1] = c[1] + 3545052371 + (c[0] >>> 0 < F[0] >>> 0 ? 1 : 0) | 0, c[2] = c[2] + 886263092 + (c[1] >>> 0 < F[1] >>> 0 ? 1 : 0) | 0, c[3] = c[3] + 1295307597 + (c[2] >>> 0 < F[2] >>> 0 ? 1 : 0) | 0, c[4] = c[4] + 3545052371 + (c[3] >>> 0 < F[3] >>> 0 ? 1 : 0) | 0, c[5] = c[5] + 886263092 + (c[4] >>> 0 < F[4] >>> 0 ? 1 : 0) | 0, c[6] = c[6] + 1295307597 + (c[5] >>> 0 < F[5] >>> 0 ? 1 : 0) | 0, c[7] = c[7] + 3545052371 + (c[6] >>> 0 < F[6] >>> 0 ? 1 : 0) | 0, this._b = c[7] >>> 0 < F[7] >>> 0 ? 1 : 0;
          for (var i2 = 0; i2 < 8; i2++) {
            var f = a[i2] + c[i2], s = f & 65535, u = f >>> 16, B = ((s * s >>> 17) + s * u >>> 15) + u * u, x = ((f & 4294901760) * f | 0) + ((f & 65535) * f | 0);
            r[i2] = B ^ x;
          }
          a[0] = r[0] + (r[7] << 16 | r[7] >>> 16) + (r[6] << 16 | r[6] >>> 16) | 0, a[1] = r[1] + (r[0] << 8 | r[0] >>> 24) + r[7] | 0, a[2] = r[2] + (r[1] << 16 | r[1] >>> 16) + (r[0] << 16 | r[0] >>> 16) | 0, a[3] = r[3] + (r[2] << 8 | r[2] >>> 24) + r[1] | 0, a[4] = r[4] + (r[3] << 16 | r[3] >>> 16) + (r[2] << 16 | r[2] >>> 16) | 0, a[5] = r[5] + (r[4] << 8 | r[4] >>> 24) + r[3] | 0, a[6] = r[6] + (r[5] << 16 | r[5] >>> 16) + (r[4] << 16 | r[4] >>> 16) | 0, a[7] = r[7] + (r[6] << 8 | r[6] >>> 24) + r[5] | 0;
        }
        z2(v, "nextState"), e.RabbitLegacy = h._createHelper(o);
      }(), t18.RabbitLegacy;
    });
  });
  var Sr2 = L2((te, wr2) => {
    (function(t18, e, C2) {
      typeof te == "object" ? wr2.exports = te = e(U(), x0(), t0(), M(), K()) : typeof define == "function" && define.amd ? define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], e) : e(t18.CryptoJS);
    })(te, function(t18) {
      return function() {
        var e = t18, C2 = e.lib, h = C2.BlockCipher, b2 = e.algo;
        let d = 16, F = [608135816, 2242054355, 320440878, 57701188, 2752067618, 698298832, 137296536, 3964562569, 1160258022, 953160567, 3193202383, 887688300, 3232508343, 3380367581, 1065670069, 3041331479, 2450970073, 2306472731], r = [[3509652390, 2564797868, 805139163, 3491422135, 3101798381, 1780907670, 3128725573, 4046225305, 614570311, 3012652279, 134345442, 2240740374, 1667834072, 1901547113, 2757295779, 4103290238, 227898511, 1921955416, 1904987480, 2182433518, 2069144605, 3260701109, 2620446009, 720527379, 3318853667, 677414384, 3393288472, 3101374703, 2390351024, 1614419982, 1822297739, 2954791486, 3608508353, 3174124327, 2024746970, 1432378464, 3864339955, 2857741204, 1464375394, 1676153920, 1439316330, 715854006, 3033291828, 289532110, 2706671279, 2087905683, 3018724369, 1668267050, 732546397, 1947742710, 3462151702, 2609353502, 2950085171, 1814351708, 2050118529, 680887927, 999245976, 1800124847, 3300911131, 1713906067, 1641548236, 4213287313, 1216130144, 1575780402, 4018429277, 3917837745, 3693486850, 3949271944, 596196993, 3549867205, 258830323, 2213823033, 772490370, 2760122372, 1774776394, 2652871518, 566650946, 4142492826, 1728879713, 2882767088, 1783734482, 3629395816, 2517608232, 2874225571, 1861159788, 326777828, 3124490320, 2130389656, 2716951837, 967770486, 1724537150, 2185432712, 2364442137, 1164943284, 2105845187, 998989502, 3765401048, 2244026483, 1075463327, 1455516326, 1322494562, 910128902, 469688178, 1117454909, 936433444, 3490320968, 3675253459, 1240580251, 122909385, 2157517691, 634681816, 4142456567, 3825094682, 3061402683, 2540495037, 79693498, 3249098678, 1084186820, 1583128258, 426386531, 1761308591, 1047286709, 322548459, 995290223, 1845252383, 2603652396, 3431023940, 2942221577, 3202600964, 3727903485, 1712269319, 422464435, 3234572375, 1170764815, 3523960633, 3117677531, 1434042557, 442511882, 3600875718, 1076654713, 1738483198, 4213154764, 2393238008, 3677496056, 1014306527, 4251020053, 793779912, 2902807211, 842905082, 4246964064, 1395751752, 1040244610, 2656851899, 3396308128, 445077038, 3742853595, 3577915638, 679411651, 2892444358, 2354009459, 1767581616, 3150600392, 3791627101, 3102740896, 284835224, 4246832056, 1258075500, 768725851, 2589189241, 3069724005, 3532540348, 1274779536, 3789419226, 2764799539, 1660621633, 3471099624, 4011903706, 913787905, 3497959166, 737222580, 2514213453, 2928710040, 3937242737, 1804850592, 3499020752, 2949064160, 2386320175, 2390070455, 2415321851, 4061277028, 2290661394, 2416832540, 1336762016, 1754252060, 3520065937, 3014181293, 791618072, 3188594551, 3933548030, 2332172193, 3852520463, 3043980520, 413987798, 3465142937, 3030929376, 4245938359, 2093235073, 3534596313, 375366246, 2157278981, 2479649556, 555357303, 3870105701, 2008414854, 3344188149, 4221384143, 3956125452, 2067696032, 3594591187, 2921233993, 2428461, 544322398, 577241275, 1471733935, 610547355, 4027169054, 1432588573, 1507829418, 2025931657, 3646575487, 545086370, 48609733, 2200306550, 1653985193, 298326376, 1316178497, 3007786442, 2064951626, 458293330, 2589141269, 3591329599, 3164325604, 727753846, 2179363840, 146436021, 1461446943, 4069977195, 705550613, 3059967265, 3887724982, 4281599278, 3313849956, 1404054877, 2845806497, 146425753, 1854211946], [1266315497, 3048417604, 3681880366, 3289982499, 290971e4, 1235738493, 2632868024, 2414719590, 3970600049, 1771706367, 1449415276, 3266420449, 422970021, 1963543593, 2690192192, 3826793022, 1062508698, 1531092325, 1804592342, 2583117782, 2714934279, 4024971509, 1294809318, 4028980673, 1289560198, 2221992742, 1669523910, 35572830, 157838143, 1052438473, 1016535060, 1802137761, 1753167236, 1386275462, 3080475397, 2857371447, 1040679964, 2145300060, 2390574316, 1461121720, 2956646967, 4031777805, 4028374788, 33600511, 2920084762, 1018524850, 629373528, 3691585981, 3515945977, 2091462646, 2486323059, 586499841, 988145025, 935516892, 3367335476, 2599673255, 2839830854, 265290510, 3972581182, 2759138881, 3795373465, 1005194799, 847297441, 406762289, 1314163512, 1332590856, 1866599683, 4127851711, 750260880, 613907577, 1450815602, 3165620655, 3734664991, 3650291728, 3012275730, 3704569646, 1427272223, 778793252, 1343938022, 2676280711, 2052605720, 1946737175, 3164576444, 3914038668, 3967478842, 3682934266, 1661551462, 3294938066, 4011595847, 840292616, 3712170807, 616741398, 312560963, 711312465, 1351876610, 322626781, 1910503582, 271666773, 2175563734, 1594956187, 70604529, 3617834859, 1007753275, 1495573769, 4069517037, 2549218298, 2663038764, 504708206, 2263041392, 3941167025, 2249088522, 1514023603, 1998579484, 1312622330, 694541497, 2582060303, 2151582166, 1382467621, 776784248, 2618340202, 3323268794, 2497899128, 2784771155, 503983604, 4076293799, 907881277, 423175695, 432175456, 1378068232, 4145222326, 3954048622, 3938656102, 3820766613, 2793130115, 2977904593, 26017576, 3274890735, 3194772133, 1700274565, 1756076034, 4006520079, 3677328699, 720338349, 1533947780, 354530856, 688349552, 3973924725, 1637815568, 332179504, 3949051286, 53804574, 2852348879, 3044236432, 1282449977, 3583942155, 3416972820, 4006381244, 1617046695, 2628476075, 3002303598, 1686838959, 431878346, 2686675385, 1700445008, 1080580658, 1009431731, 832498133, 3223435511, 2605976345, 2271191193, 2516031870, 1648197032, 4164389018, 2548247927, 300782431, 375919233, 238389289, 3353747414, 2531188641, 2019080857, 1475708069, 455242339, 2609103871, 448939670, 3451063019, 1395535956, 2413381860, 1841049896, 1491858159, 885456874, 4264095073, 4001119347, 1565136089, 3898914787, 1108368660, 540939232, 1173283510, 2745871338, 3681308437, 4207628240, 3343053890, 4016749493, 1699691293, 1103962373, 3625875870, 2256883143, 3830138730, 1031889488, 3479347698, 1535977030, 4236805024, 3251091107, 2132092099, 1774941330, 1199868427, 1452454533, 157007616, 2904115357, 342012276, 595725824, 1480756522, 206960106, 497939518, 591360097, 863170706, 2375253569, 3596610801, 1814182875, 2094937945, 3421402208, 1082520231, 3463918190, 2785509508, 435703966, 3908032597, 1641649973, 2842273706, 3305899714, 1510255612, 2148256476, 2655287854, 3276092548, 4258621189, 236887753, 3681803219, 274041037, 1734335097, 3815195456, 3317970021, 1899903192, 1026095262, 4050517792, 356393447, 2410691914, 3873677099, 3682840055], [3913112168, 2491498743, 4132185628, 2489919796, 1091903735, 1979897079, 3170134830, 3567386728, 3557303409, 857797738, 1136121015, 1342202287, 507115054, 2535736646, 337727348, 3213592640, 1301675037, 2528481711, 1895095763, 1721773893, 3216771564, 62756741, 2142006736, 835421444, 2531993523, 1442658625, 3659876326, 2882144922, 676362277, 1392781812, 170690266, 3921047035, 1759253602, 3611846912, 1745797284, 664899054, 1329594018, 3901205900, 3045908486, 2062866102, 2865634940, 3543621612, 3464012697, 1080764994, 553557557, 3656615353, 3996768171, 991055499, 499776247, 1265440854, 648242737, 3940784050, 980351604, 3713745714, 1749149687, 3396870395, 4211799374, 3640570775, 1161844396, 3125318951, 1431517754, 545492359, 4268468663, 3499529547, 1437099964, 2702547544, 3433638243, 2581715763, 2787789398, 1060185593, 1593081372, 2418618748, 4260947970, 69676912, 2159744348, 86519011, 2512459080, 3838209314, 1220612927, 3339683548, 133810670, 1090789135, 1078426020, 1569222167, 845107691, 3583754449, 4072456591, 1091646820, 628848692, 1613405280, 3757631651, 526609435, 236106946, 48312990, 2942717905, 3402727701, 1797494240, 859738849, 992217954, 4005476642, 2243076622, 3870952857, 3732016268, 765654824, 3490871365, 2511836413, 1685915746, 3888969200, 1414112111, 2273134842, 3281911079, 4080962846, 172450625, 2569994100, 980381355, 4109958455, 2819808352, 2716589560, 2568741196, 3681446669, 3329971472, 1835478071, 660984891, 3704678404, 4045999559, 3422617507, 3040415634, 1762651403, 1719377915, 3470491036, 2693910283, 3642056355, 3138596744, 1364962596, 2073328063, 1983633131, 926494387, 3423689081, 2150032023, 4096667949, 1749200295, 3328846651, 309677260, 2016342300, 1779581495, 3079819751, 111262694, 1274766160, 443224088, 298511866, 1025883608, 3806446537, 1145181785, 168956806, 3641502830, 3584813610, 1689216846, 3666258015, 3200248200, 1692713982, 2646376535, 4042768518, 1618508792, 1610833997, 3523052358, 4130873264, 2001055236, 3610705100, 2202168115, 4028541809, 2961195399, 1006657119, 2006996926, 3186142756, 1430667929, 3210227297, 1314452623, 4074634658, 4101304120, 2273951170, 1399257539, 3367210612, 3027628629, 1190975929, 2062231137, 2333990788, 2221543033, 2438960610, 1181637006, 548689776, 2362791313, 3372408396, 3104550113, 3145860560, 296247880, 1970579870, 3078560182, 3769228297, 1714227617, 3291629107, 3898220290, 166772364, 1251581989, 493813264, 448347421, 195405023, 2709975567, 677966185, 3703036547, 1463355134, 2715995803, 1338867538, 1343315457, 2802222074, 2684532164, 233230375, 2599980071, 2000651841, 3277868038, 1638401717, 4028070440, 3237316320, 6314154, 819756386, 300326615, 590932579, 1405279636, 3267499572, 3150704214, 2428286686, 3959192993, 3461946742, 1862657033, 1266418056, 963775037, 2089974820, 2263052895, 1917689273, 448879540, 3550394620, 3981727096, 150775221, 3627908307, 1303187396, 508620638, 2975983352, 2726630617, 1817252668, 1876281319, 1457606340, 908771278, 3720792119, 3617206836, 2455994898, 1729034894, 1080033504], [976866871, 3556439503, 2881648439, 1522871579, 1555064734, 1336096578, 3548522304, 2579274686, 3574697629, 3205460757, 3593280638, 3338716283, 3079412587, 564236357, 2993598910, 1781952180, 1464380207, 3163844217, 3332601554, 1699332808, 1393555694, 1183702653, 3581086237, 1288719814, 691649499, 2847557200, 2895455976, 3193889540, 2717570544, 1781354906, 1676643554, 2592534050, 3230253752, 1126444790, 2770207658, 2633158820, 2210423226, 2615765581, 2414155088, 3127139286, 673620729, 2805611233, 1269405062, 4015350505, 3341807571, 4149409754, 1057255273, 2012875353, 2162469141, 2276492801, 2601117357, 993977747, 3918593370, 2654263191, 753973209, 36408145, 2530585658, 25011837, 3520020182, 2088578344, 530523599, 2918365339, 1524020338, 1518925132, 3760827505, 3759777254, 1202760957, 3985898139, 3906192525, 674977740, 4174734889, 2031300136, 2019492241, 3983892565, 4153806404, 3822280332, 352677332, 2297720250, 60907813, 90501309, 3286998549, 1016092578, 2535922412, 2839152426, 457141659, 509813237, 4120667899, 652014361, 1966332200, 2975202805, 55981186, 2327461051, 676427537, 3255491064, 2882294119, 3433927263, 1307055953, 942726286, 933058658, 2468411793, 3933900994, 4215176142, 1361170020, 2001714738, 2830558078, 3274259782, 1222529897, 1679025792, 2729314320, 3714953764, 1770335741, 151462246, 3013232138, 1682292957, 1483529935, 471910574, 1539241949, 458788160, 3436315007, 1807016891, 3718408830, 978976581, 1043663428, 3165965781, 1927990952, 4200891579, 2372276910, 3208408903, 3533431907, 1412390302, 2931980059, 4132332400, 1947078029, 3881505623, 4168226417, 2941484381, 1077988104, 1320477388, 886195818, 18198404, 3786409e3, 2509781533, 112762804, 3463356488, 1866414978, 891333506, 18488651, 661792760, 1628790961, 3885187036, 3141171499, 876946877, 2693282273, 1372485963, 791857591, 2686433993, 3759982718, 3167212022, 3472953795, 2716379847, 445679433, 3561995674, 3504004811, 3574258232, 54117162, 3331405415, 2381918588, 3769707343, 4154350007, 1140177722, 4074052095, 668550556, 3214352940, 367459370, 261225585, 2610173221, 4209349473, 3468074219, 3265815641, 314222801, 3066103646, 3808782860, 282218597, 3406013506, 3773591054, 379116347, 1285071038, 846784868, 2669647154, 3771962079, 3550491691, 2305946142, 453669953, 1268987020, 3317592352, 3279303384, 3744833421, 2610507566, 3859509063, 266596637, 3847019092, 517658769, 3462560207, 3443424879, 370717030, 4247526661, 2224018117, 4143653529, 4112773975, 2788324899, 2477274417, 1456262402, 2901442914, 1517677493, 1846949527, 2295493580, 3734397586, 2176403920, 1280348187, 1908823572, 3871786941, 846861322, 1172426758, 3287448474, 3383383037, 1655181056, 3139813346, 901632758, 1897031941, 2986607138, 3066810236, 3447102507, 1393639104, 373351379, 950779232, 625454576, 3124240540, 4148612726, 2007998917, 544563296, 2244738638, 2330496472, 2058025392, 1291430526, 424198748, 50039436, 29584100, 3605783033, 2429876329, 2791104160, 1057563949, 3255363231, 3075367218, 3463963227, 1469046755, 985887462]];
        var o = { pbox: [], sbox: [] };
        function v(s, u) {
          let B = u >> 24 & 255, x = u >> 16 & 255, n = u >> 8 & 255, p = u & 255, l = s.sbox[0][B] + s.sbox[1][x];
          return l = l ^ s.sbox[2][n], l = l + s.sbox[3][p], l;
        }
        z2(v, "F");
        function a(s, u, B) {
          let x = u, n = B, p;
          for (let l = 0; l < d; ++l)
            x = x ^ s.pbox[l], n = v(s, x) ^ n, p = x, x = n, n = p;
          return p = x, x = n, n = p, n = n ^ s.pbox[d], x = x ^ s.pbox[d + 1], { left: x, right: n };
        }
        z2(a, "BlowFish_Encrypt");
        function c(s, u, B) {
          let x = u, n = B, p;
          for (let l = d + 1; l > 1; --l)
            x = x ^ s.pbox[l], n = v(s, x) ^ n, p = x, x = n, n = p;
          return p = x, x = n, n = p, n = n ^ s.pbox[1], x = x ^ s.pbox[0], { left: x, right: n };
        }
        z2(c, "BlowFish_Decrypt");
        function i2(s, u, B) {
          for (let E = 0; E < 4; E++) {
            s.sbox[E] = [];
            for (let A = 0; A < 256; A++)
              s.sbox[E][A] = r[E][A];
          }
          let x = 0;
          for (let E = 0; E < d + 2; E++)
            s.pbox[E] = F[E] ^ u[x], x++, x >= B && (x = 0);
          let n = 0, p = 0, l = 0;
          for (let E = 0; E < d + 2; E += 2)
            l = a(s, n, p), n = l.left, p = l.right, s.pbox[E] = n, s.pbox[E + 1] = p;
          for (let E = 0; E < 4; E++)
            for (let A = 0; A < 256; A += 2)
              l = a(s, n, p), n = l.left, p = l.right, s.sbox[E][A] = n, s.sbox[E][A + 1] = p;
          return true;
        }
        z2(i2, "BlowFishInit");
        var f = b2.Blowfish = h.extend({ _doReset: function() {
          if (this._keyPriorReset !== this._key) {
            var s = this._keyPriorReset = this._key, u = s.words, B = s.sigBytes / 4;
            i2(o, u, B);
          }
        }, encryptBlock: function(s, u) {
          var B = a(o, s[u], s[u + 1]);
          s[u] = B.left, s[u + 1] = B.right;
        }, decryptBlock: function(s, u) {
          var B = c(o, s[u], s[u + 1]);
          s[u] = B.left, s[u + 1] = B.right;
        }, blockSize: 64 / 32, keySize: 128 / 32, ivSize: 64 / 32 });
        e.Blowfish = h._createHelper(f);
      }(), t18.Blowfish;
    });
  });
  var qr2 = L2((ae, Hr2) => {
    (function(t18, e, C2) {
      typeof ae == "object" ? Hr2.exports = ae = e(U(), u0(), ke(), Se2(), x0(), ze2(), t0(), oe2(), S0(), Ie2(), se(), Ue(), Te(), Ke2(), j0(), Je(), M(), K(), Ve2(), er2(), xr2(), ar(), nr(), sr(), cr2(), dr2(), hr2(), Br2(), pr2(), Ar2(), Dr2(), br2(), gr2(), kr2(), Sr2()) : typeof define == "function" && define.amd ? define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./enc-base64url", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy", "./blowfish"], e) : t18.CryptoJS = e(t18.CryptoJS);
    })(ae, function(t18) {
      return t18;
    });
  });
  var B0 = cx(qr2());
  var o0 = class {
    constructor(e, C2) {
      this._appID = e, this._cipher = C2;
      let h = new URL(globalThis.location.href);
      this._sessionID = h.searchParams.get("ngio_session_id") ?? null, this._sessionID || z2(async () => {
        let d = await this.call("App.startSession");
        this._sessionID = d.result.data.session.id;
      }, "startSession")();
    }
    encryptCall(e) {
      if (!this._cipher)
        return e;
      let C2 = B0.default.enc.Base64.parse(this._cipher), h = B0.default.lib.WordArray.random(16), b2 = B0.default.AES.encrypt(JSON.stringify(e), C2, { iv: h }), d = B0.default.enc.Base64.stringify(h.concat(b2.ciphertext));
      return e.secure = d, e.parameters = null, e;
    }
    async call(e, C2) {
      let h = this.encryptCall({ component: e, parameters: C2 }), b2 = { app_id: this._appID, session_id: this._sessionID, call: h }, d = new FormData();
      d.append("input", JSON.stringify(b2));
      let F = "https://newgrounds.io/gateway_v3.php";
      try {
        let r = await fetch(F, { method: "POST", body: d, mode: "cors" });
        if (r.ok) {
          let o = await r.json();
          return console.log(o), o;
        } else
          throw new Error("Network response was not ok.");
      } catch (r) {
        throw console.error("Fetch Error:", r), r;
      }
    }
  };
  z2(o0, "NewgroundsClient");
  var fe2 = null;
  var G = z2(() => {
    if (!fe2)
      throw new Error("Client not initialized");
    return fe2;
  }, "getClient");
  var zr2 = z2((t18) => {
    fe2 = t18;
  }, "setClient");
  var Rr2 = z2(async (t18) => {
    let C2 = (await G().call("CloudSave.loadSlot", { id: t18 })).result.data.slot.url;
    if (!C2)
      return "";
    try {
      return await (await fetch(C2, { method: "GET", mode: "cors" })).text();
    } catch (h) {
      throw console.error("Fetch Error:", h), h;
    }
  }, "getCloudData");
  var Pr = z2(async (t18, e) => (await G().call("CloudSave.setData", { id: t18, data: e })).result.data.slot, "setCloudData");
  function Wr2(t18, e) {
    let C2 = new o0(t18, e);
    return zr2(C2), C2;
  }
  z2(Wr2, "connect");
  var jr2 = z2(async () => {
    let t18 = await G().call("App.checkSession");
    return new Promise((e, C2) => {
      if (t18?.result?.data?.session?.user)
        e(t18.result.data.session.user);
      else {
        let h = t18.result.data.session.passport_url;
        globalThis.open(h, "Newgrounds Passport", "height=600,width=800");
        let b2 = setInterval(async () => {
          let d = await G().call("App.checkSession");
          d?.result?.data?.session?.user && (console.log("User logged in!"), clearInterval(b2), e(d.result.data.session.user));
        }, 6e3);
      }
    });
  }, "login");
  var Ir2 = z2(async (t18) => (await G().call("Medal.unlock", { id: t18 })).result.data.medal.unlocked, "unlockMedal");
  var Nr2 = z2(async (t18, e) => {
    let { id: C2, ...h } = e;
    return (await G().call("ScoreBoard.getScores", { id: t18, ...h })).result?.data?.scores;
  }, "getScores");
  var Lr2 = z2(async (t18, e) => (await G().call("ScoreBoard.postScore", { id: t18, value: e })).result?.data?.score, "postScore");
  var Ur2 = z2(async () => (await G().call("App.checkSession"))?.result?.data?.session?.user?.name, "getUsername");
  var Or2 = z2(async () => (await G().call("App.getCurrentVersion"))?.result?.data?.current_version, "getVersion");
  var Tr2 = z2(async () => (await G().call("App.checkSession"))?.result?.data?.session?.user?.supporter, "isSupporter");
  var ce2 = { connect: Wr2, login: jr2, unlockMedal: Ir2, getScores: Nr2, postScore: Lr2, getUsername: Ur2, getVersion: Or2, isSupporter: Tr2, getCloudData: Rr2, setCloudData: Pr, NewgroundsClient: o0 };
  function vx(t18) {
    return t18.charAt(0).toUpperCase() + t18.slice(1);
  }
  z2(vx, "capitalizeFirstLetter");
  for (let t18 in ce2)
    globalThis[vx(t18)] = ce2[t18];
  var Rx = ce2;

  // source/env.json
  var API_ID = "58772:iSJtdnjI";
  var ENCRIPTION_KEY = "tU8YymrSEPrn1PmsJtxd0w==";

  // source/newgrounds.ts
  var ngEnabled;
  var ngUser;
  async function newgroundsManagement() {
    let connectionToNg = Rx.connect(API_ID, ENCRIPTION_KEY);
  }
  async function newgroundsSceneContent() {
    debug.log("you don't seem to be signed in, would you like to?");
    onKeyPress("enter", async () => {
      ngUser = await Rx.login().then(null);
      if (await Rx.getUsername() != null) {
        ngEnabled = true;
        debug.log("You logged in! Youhoo!!!");
        wait(1, () => {
          go("gamescene");
        });
      } else {
        debug.log("something went wrong im sorry...");
      }
    });
    onKeyPress("escape", async () => {
      wait(1, () => {
        go("gamescene");
      });
    });
  }

  // source/game/unlockables/achievements.ts
  var Achievement = class {
    constructor(opts) {
      this.opts = opts;
      this.id = opts.id;
      this.ngId = opts.ngId;
      this.title = opts.title;
      this.description = opts.description;
      this.icon = opts.icon;
      this.timeAfter = opts.timeAfter || 0;
      this.duration = opts.duration || 3;
      this.condition = opts.condition || null;
      this.secretCondition = opts.secretCondition || null;
    }
    id;
    ngId;
    title;
    description;
    icon;
    timeAfter;
    visible;
    duration;
    condition;
    secretCondition;
  };
  var fullUpgradeValues = {
    clicks: () => {
      let sum = 0;
      Object.keys(upgradeInfo).forEach((key) => {
        if (key.includes("k_")) {
          sum += upgradeInfo[key].value;
        }
      });
      return sum;
    },
    cursors: () => {
      let sum = 0;
      Object.keys(upgradeInfo).forEach((key) => {
        if (key.includes("c_") && upgradeInfo[key].freq == null) {
          sum += upgradeInfo[key].value;
        }
      });
      return sum;
    }
  };
  var achievements;
  achievements = [
    /* TODO: Missing types of achievements
    	- Score per second
    	- Score forfeited on ascending
    	- Score gained by tapping
    	- Score gained by cursors
    */
    // #region SCORE ACHIEVEMENTS =====================
    new Achievement({
      id: "100score",
      title: "It starts...",
      description: "Get 100 of score",
      icon: "upgrades.k_0",
      condition: () => GameState.scoreAllTime >= 100
    }),
    new Achievement({
      id: "500score",
      title: "Wake and click",
      description: "Get 500 of score",
      icon: "upgrades.k_1",
      condition: () => GameState.scoreAllTime >= 500
    }),
    new Achievement({
      id: "1000score",
      title: "Wake and click",
      description: "Get 1.000 of score",
      icon: "upgrades.k_1",
      condition: () => GameState.scoreAllTime >= 1e3
    }),
    new Achievement({
      id: "5000score",
      title: "Wake and click",
      description: "Get 5.000 of score",
      icon: "upgrades.k_1",
      condition: () => GameState.scoreAllTime >= 5e3
    }),
    new Achievement({
      id: "10000score",
      title: "Wake and click",
      description: "Get 10.000 of score",
      icon: "upgrades.k_1",
      condition: () => GameState.scoreAllTime >= 1e4
    }),
    new Achievement({
      id: "25000score",
      title: "Wake and click",
      description: "Get 25.000 of score",
      icon: "upgrades.k_1",
      condition: () => GameState.scoreAllTime >= 25e3
    }),
    new Achievement({
      id: "50000score",
      title: "Wake and click",
      description: "Get 50.000 of score",
      icon: "upgrades.k_1",
      condition: () => GameState.scoreAllTime >= 5e4
    }),
    new Achievement({
      id: "millionscore",
      title: "That's crazy",
      description: "Get 1 million of score",
      icon: "upgrades.k_1",
      condition: () => GameState.scoreAllTime >= 1e6
    }),
    new Achievement({
      id: "1sextillionscore",
      title: "Getting scientific",
      description: "Get 1 sextillion of score",
      icon: "upgrades.k_1",
      duration: 4,
      condition: () => GameState.scoreAllTime >= scoreManager.scientificENOT
    }),
    new Achievement({
      id: "1000clicks",
      title: "One hell of a clicker",
      description: "Click 1.000 times",
      icon: "cursors.cursor",
      condition: () => GameState.stats.timesClicked >= 1e3
    }),
    // #endregion SCORE ACHIEVEMENTS ====================
    // #region CLICKER/CURSOR ACHIEVEMENTS ==================
    // ### CLICKERS
    new Achievement({
      id: "10clickers",
      title: "Getting clickery",
      description: "Have 10 clickers",
      icon: "cursors.cursor",
      condition: () => GameState.clickers >= 10
    }),
    new Achievement({
      id: "20clickers",
      title: "Getting clickery",
      description: "Have 20 clickers",
      icon: "cursors.cursor",
      condition: () => GameState.clickers >= 20
    }),
    new Achievement({
      id: "30clickers",
      title: "Getting clickery",
      description: "Have 30 clickers",
      icon: "cursors.cursor",
      condition: () => GameState.clickers >= 30
    }),
    new Achievement({
      id: "40clickers",
      title: "Getting clickery",
      description: "Have 40 clickers",
      icon: "cursors.cursor",
      condition: () => GameState.clickers >= 40
    }),
    new Achievement({
      id: "50clickers",
      title: "Getting clickery",
      description: "Have 50 clickers",
      icon: "cursors.cursor",
      condition: () => GameState.clickers >= 50
    }),
    // ### CURSORS
    new Achievement({
      id: "10cursors",
      title: "Getting cursory",
      description: "Have 10 cursors",
      icon: "cursors.cursor",
      condition: () => GameState.cursors >= 10
    }),
    new Achievement({
      id: "20cursors",
      title: "Getting cursory",
      description: "Have 20 cursors",
      icon: "cursors.cursor",
      condition: () => GameState.cursors >= 20
    }),
    new Achievement({
      id: "30cursors",
      title: "Getting cursory",
      description: "Have 30 cursors",
      icon: "cursors.cursor",
      condition: () => GameState.cursors >= 30
    }),
    new Achievement({
      id: "40cursors",
      title: "Getting cursory",
      description: "Have 40 cursors",
      icon: "cursors.cursor",
      condition: () => GameState.cursors >= 40
    }),
    new Achievement({
      id: "50cursors",
      title: "Getting cursory",
      description: "Have 50 cursors",
      icon: "cursors.cursor",
      condition: () => GameState.cursors >= 50
    }),
    //#endregion CLICKERS/CURSORS ACHIEVEMENTS =================
    // #region SCORE PER SECOND ACHIEVEMENTS ==================
    new Achievement({
      id: "10scorepersecond",
      title: "Very fast score",
      description: "Get to 10 score per second",
      icon: "cursors.cursor",
      condition: () => scoreManager.autoScorePerSecond() >= 10
    }),
    //#endregion SCORE PER SECOND ACHIEVEMENTS =================
    new Achievement({
      id: "allclickupgrades",
      title: "Very clickery score",
      description: "Buy all the click upgrades",
      icon: "icon_store",
      timeAfter: 1,
      condition: () => GameState.clicksUpgradesValue >= fullUpgradeValues.clicks()
    }),
    new Achievement({
      id: "allupgrades",
      title: "Very very score",
      description: "Buy all the available upgrades",
      icon: "icon_store",
      timeAfter: 1,
      condition: () => GameState.clicksUpgradesValue >= fullUpgradeValues.clicks() && GameState.cursorsUpgradesValue >= fullUpgradeValues.cursors()
    }),
    // #region POWERUP ACHIEVEMENTS =====================
    new Achievement({
      id: "click1powerup",
      title: "What?! Help me!",
      description: "Click 1 powerup",
      icon: "cursors.cursor",
      timeAfter: 0.5,
      condition: () => GameState.stats.powerupsClicked >= 1
    }),
    new Achievement({
      id: "click5powerup",
      title: "What?! Help me!",
      description: "Click 5 powerup",
      icon: "cursors.cursor",
      timeAfter: 0.5,
      condition: () => GameState.stats.powerupsClicked >= 5
    }),
    new Achievement({
      id: "click10powerup",
      title: "What?! Help me!",
      description: "Click 10 powerup",
      icon: "cursors.cursor",
      timeAfter: 0.5,
      condition: () => GameState.stats.powerupsClicked >= 10
    }),
    new Achievement({
      id: "buy10powerup",
      title: "Scrooge McDuck",
      description: "Buy 10 powerup",
      icon: "icon_store",
      timeAfter: 1,
      condition: () => GameState.stats.powerupsBought >= 10
    }),
    // #endregion POWERUP ACHIEVEMENTS ====================
    // #region ASCENSION ACHIEVEMENTS =====================
    new Achievement({
      id: "ascend1time",
      title: "Oh. So you've met him?",
      description: "Ascend for the first time",
      icon: "icon_ascend",
      secretCondition: () => GameState.stats.timesAscended >= 1
    }),
    new Achievement({
      id: "ascend5time",
      title: "He's funny, isn't he?",
      description: "Ascend for the fifth time",
      icon: "icon_ascend",
      condition: () => GameState.stats.timesAscended >= 5,
      secretCondition: () => GameState.stats.timesAscended >= 1
    }),
    new Achievement({
      id: "ascend10time",
      title: "I am the clickery...",
      description: "Ascend for the tenth time",
      icon: "icon_ascend",
      condition: () => GameState.stats.timesAscended >= 10,
      secretCondition: () => GameState.stats.timesAscended >= 1
    }),
    // #endregion ASCENSION ACHIEVEMENTS =====================
    // #region EXTRA ACHIEVEMENTS =====================
    new Achievement({
      id: "maxedcombo",
      title: "OVERDRIVE!!!",
      description: "Max your combo for the first time, FULL COMBO!!",
      icon: "hexagon",
      timeAfter: 2
    }),
    new Achievement({
      id: "allwindowsontaskbar",
      title: "CPU Usage too high!!",
      description: "Open all windows in your taskbar at the same time",
      icon: "icon_extra.open_default"
    }),
    new Achievement({
      id: "panderitomode",
      title: "Hmmmmmmmm panderitos...",
      description: "Spell panderito",
      icon: "panderito"
    }),
    new Achievement({
      id: "tapachievementslot",
      title: "That was easy right?",
      description: "Tap this achivement's slot",
      icon: "cursors.point"
    }),
    new Achievement({
      id: "gnome",
      title: "HOLY SHIT GUYS DID YOU SEE THAT???",
      description: "WHAT THE FUCK WAS THAT DID WE GET THAT ON CAMERA??????!!",
      icon: "gnome",
      timeAfter: 1.5,
      duration: 5,
      secretCondition: () => GameState.stats.timesGnomed >= 1
    }),
    new Achievement({
      id: "allsongs",
      title: "Big fan",
      description: "Listen to all the songs at least once",
      icon: "icon_music",
      condition: () => songsListened.length == Object.keys(songs).length
    }),
    // #endregion EXTRA ACHIEVEMENTS =====================
    new Achievement({
      id: "allAchievements",
      title: "CONGRATS!!!!",
      description: "Complete all achievements, congratulations!!",
      icon: "osaka",
      condition: () => GameState.unlockedAchievements.length == achievements.length - 1
    })
  ];
  function getAchievement(achievementId) {
    return achievements.filter((achievementObject) => achievementObject.id == achievementId)[0];
  }
  function isAchievementUnlocked(achievementName) {
    return GameState.unlockedAchievements.includes(achievementName);
  }
  var achievementsInfo = {
    ids: achievements.map((achievement) => achievement.id),
    objects: achievements.map((achievement) => achievement)
  };
  function checkForUnlockable() {
    achievements.forEach((achievement) => {
      if (achievement.condition != null && !isAchievementUnlocked(achievement.id)) {
        if (achievement.condition()) {
          unlockAchievement(achievement.id);
        }
      }
    });
    Object.keys(unlockableWindows).forEach((window2) => {
      if (!isWindowUnlocked(window2)) {
        if (unlockableWindows[window2].condition()) {
          unlockWindow(window2);
        }
      }
    });
  }
  function unlockAchievement(id) {
    if (isAchievementUnlocked(id))
      return;
    GameState.unlockedAchievements.push(id);
    let achievement = getAchievement(id);
    wait(achievement.timeAfter || 0, () => {
      addToast({
        icon: achievement.icon,
        title: achievement.title,
        body: achievement.description,
        duration: achievement.duration,
        type: "achievement"
      });
      if (id == "allachievements") {
        addConfetti({ pos: mousePos() });
      }
      ROOT.trigger("achivementUnlock", id);
    });
    if (ngEnabled == true) {
      if (achievement.ngId)
        Rx.unlockMedal(achievement.ngId);
    }
  }

  // source/game/windows/musicWindow.ts
  var songs = {
    "clicker.wav": { name: "clicker.wav", idx: 0, speed: 2.5, cover: "wav", duration: 61 },
    "menu.wav": { name: "menu.wav", idx: 1, speed: 1.6, cover: "wav", duration: 36 },
    "whatttt.wav": { name: "whatttt.wav", idx: 2, speed: 2, cover: "wav", duration: 51 },
    "simple.wav": { name: "simple.wav", idx: 3, speed: 1.3, cover: "wav", duration: 99 },
    "jazz.wav": { name: "jazz.wav", idx: 4, speed: 2.1, cover: "wav", duration: 43 },
    "sweet.wav": { name: "sweet.wav", idx: 5, speed: 2.5, cover: "wav", duration: 46 },
    "ok_instrumental": { name: "ok (Inst)", idx: 6, speed: 2, cover: "ok", duration: 102 },
    "magic": { name: "magic.", idx: 7, speed: 1, cover: "bb1", duration: 46 },
    "watchout": { name: "Watch out!", idx: 8, speed: 2.4, cover: "bb2", duration: 49 },
    "catnip": { name: "catnip", idx: 9, speed: 2.1, cover: "cat", duration: 67 },
    "project_23": { name: "Project_23", idx: 10, speed: 2.1, cover: "bb3", duration: 45 }
  };
  var songsListened = [];
  var currentSongIdx = 0;
  var progressBar;
  var timeText;
  var timeSinceSkip = 0;
  var skipping = false;
  function setTimeSinceSkip(value = 0) {
    timeSinceSkip = value;
  }
  var angleOfDisc = 0;
  function musicWinContent(winParent) {
    currentSongIdx = GameState.settings.music.favoriteIdx == null ? 0 : GameState.settings.music.favoriteIdx;
    let currentSong = songs[Object.keys(songs)[currentSongIdx]];
    function checkForSongListen(songIdx) {
      if (songsListened.includes(songIdx) == false)
        songsListened.push(songIdx);
    }
    if (!isAchievementUnlocked("allsongs")) {
      checkForSongListen(currentSongIdx);
    }
    let disc = winParent.add([
      sprite("discs", {
        anim: `${songs[Object.keys(songs)[currentSongIdx]].cover}`
      }),
      pos(-150, -20),
      rotate(angleOfDisc),
      anchor("center"),
      scale(1),
      area(),
      "bpmChange",
      "pauseButton",
      "musicButton",
      "windowButton",
      {
        verPosition: -20,
        spinSpeed: musicHandler.paused ? 0 : songs[Object.keys(songs)[currentSongIdx]].speed,
        update() {
          if (musicHandler.winding || skipping)
            return;
          this.angle += this.spinSpeed;
          if (Math.floor(this.angle) % 360 == 0)
            this.angle = 0;
        }
      }
    ]);
    let nowPlaying = winParent.add([
      pos(-50, -25),
      text(Object.keys(songs)[0], {
        size: 20,
        styles: {
          "small": {
            scale: vec2(0.8),
            pos: vec2(0, 4)
          }
        }
      }),
      anchor("left"),
      {
        update() {
          this.text = `${songs[Object.keys(songs)[currentSongIdx]].idx + 1}. ${songs[Object.keys(songs)[currentSongIdx]].name} ${musicHandler.paused && !musicHandler.winding ? "(PAUSED)" : ""}`;
        }
      }
    ]);
    let theOneBehind = winParent.add([
      rect(winParent.width - 50, 10, { radius: 20 }),
      pos(0, 25),
      area(),
      color(),
      area({ scale: vec2(1, 1.25) }),
      opacity(1),
      anchor("center"),
      {
        update() {
          this.color = progressBar.color.darken(150);
        }
      }
    ]);
    timeText = winParent.add([
      text("0:00", {
        size: 20
      }),
      pos(-120, 50),
      anchor("center"),
      "bpmChange",
      {
        verPosition: 50,
        update() {
          let time2 = `${formatTime(musicHandler.currentTime, false)}/${formatTime(musicHandler.totalTime === void 0 ? musicHandler.duration() : musicHandler.totalTime, false)}`;
          this.text = time2;
          if (!musicHandler.winding)
            musicHandler.currentTime = map(progressBar.width, 0, theOneBehind.width, 0, musicHandler.duration());
          if (!musicHandler.winding)
            musicHandler.totalTime = songs[Object.keys(songs)[currentSongIdx]].duration;
        }
      }
    ]);
    progressBar = winParent.add([
      rect(1, 10, { radius: 10 }),
      pos(theOneBehind.pos.x - theOneBehind.width / 2, theOneBehind.pos.y),
      color(WHITE),
      anchor("left"),
      {
        update() {
          if (musicHandler.winding)
            return;
          this.width = musicHandler.time() / musicHandler.duration() * theOneBehind.width;
        },
        draw() {
          drawCircle({
            pos: vec2(this.width, 0),
            radius: 8,
            color: this.color,
            anchor: "center",
            opacity: this.opacity
          });
        }
      }
    ]);
    let backButton = winParent.add([
      text("<", {
        size: 40
      }),
      pos(-30, 60),
      area(),
      scale(),
      anchor("center"),
      "musicButton",
      "windowButton",
      "backButton"
    ]);
    let pauseButton = winParent.add([
      text("", {
        size: 40
      }),
      pos(15, 60),
      area(),
      scale(),
      anchor("center"),
      "musicButton",
      "windowButton",
      "pauseButton",
      {
        update() {
          if (musicHandler.paused && !musicHandler.winding)
            this.text = ">";
          else
            this.text = "||";
        }
      }
    ]);
    let skipButton = winParent.add([
      text(">", {
        size: 40
      }),
      pos(60, 60),
      area(),
      scale(),
      anchor("center"),
      "musicButton",
      "windowButton",
      "skipButton"
    ]);
    function backButtonAction() {
      if (musicHandler.currentTime > 2) {
        musicHandler.seek(0);
        musicHandler.winding = true;
      } else {
        currentSongIdx--;
        if (currentSongIdx < 0)
          currentSongIdx = Object.keys(songs).length - 1;
        currentSong = songs[Object.keys(songs)[currentSongIdx]];
      }
      playSfx("clickButton", { detune: rand(-150, 50) });
      bop(backButton);
    }
    function skipButtonAction() {
      currentSongIdx++;
      if (currentSongIdx >= Object.keys(songs).length)
        currentSongIdx = 0;
      currentSong = songs[Object.keys(songs)[currentSongIdx]];
      playSfx("clickButton", { detune: rand(-50, 150) });
      bop(skipButton);
    }
    function pauseButtonAction() {
      if (musicHandler.winding)
        return;
      musicHandler.paused = !musicHandler.paused;
      pauseButton.text = musicHandler.paused ? ">" : "||";
      get("bpmChange", { recursive: true }).forEach((bpmChange) => {
        musicHandler.paused ? bpmChange.stopWave() : bpmChange.startWave();
      });
      tween(disc.spinSpeed, musicHandler.paused ? 0 : songs[Object.keys(songs)[currentSongIdx]].speed, 1, (p) => disc.spinSpeed = p, easings.easeOutQuint);
      playSfx("clickButton", { detune: rand(-100, 100) });
      bop(pauseButton);
    }
    function generalBackSkipButtonAction(action) {
      if (skipping == false) {
        skipping = true;
        get("bpmChange", { recursive: true }).forEach((element) => {
          element.stopWave();
        });
      }
      scratchSong();
      tween(progressBar.width, 0, 0.5, (p) => progressBar.width = p, easings.easeOutQuint);
      musicHandler.currentTime = musicHandler.time();
      musicHandler.totalTime = musicHandler.duration();
      tween(musicHandler.currentTime, 0, 0.5, (p) => musicHandler.currentTime = p, easings.easeOutQuint);
      tween(musicHandler.totalTime, songs[Object.keys(songs)[currentSongIdx]].duration, 0.5, (p) => musicHandler.totalTime = p, easings.easeOutQuint);
      let idxOfNewSong = action == 0 ? currentSongIdx + 1 : currentSongIdx - 1;
      if (idxOfNewSong < 0)
        idxOfNewSong = Object.keys(songs).length - 1;
      if (idxOfNewSong >= Object.keys(songs).length)
        idxOfNewSong = 0;
      if (songs[Object.keys(songs)[idxOfNewSong]].cover != songs[Object.keys(songs)[currentSongIdx]].cover) {
        tween(disc.angle, 0, 0.5, (p) => disc.angle = p, easings.easeOutQuint);
        if (action == 0)
          tween(1, -1, 0.5, (p) => disc.scale.x = p, easings.easeOutQuint);
        else if (action == 1)
          tween(-1, 1, 0.5, (p) => disc.scale.x = p, easings.easeOutQuint);
      } else {
        if (action == 0)
          tween(disc.angle, disc.angle - rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint);
        else
          tween(disc.angle, disc.angle + rand(75, 100), 0.5, (p) => disc.angle = p, easings.easeOutQuint);
      }
      disc.play(songs[Object.keys(songs)[currentSongIdx]].cover);
      GameState.settings.music.favoriteIdx = currentSongIdx;
      timeSinceSkip = 0;
      if (!isAchievementUnlocked("allsongs")) {
        checkForSongListen(currentSongIdx);
      }
      wait(1, () => {
        if (timeSinceSkip > 1) {
          playMusic(Object.keys(songs)[currentSongIdx]);
          skipping = false;
          musicHandler.winding = false;
          get("bpmChange", { recursive: true }).forEach((element) => {
            musicHandler.paused ? true : element.startWave();
          });
        }
      });
    }
    get("musicButton", { recursive: true }).forEach((mBtn) => mBtn.onClick(() => {
      if (mBtn.is("backButton") || mBtn.is("skipButton")) {
        let action;
        if (mBtn.is("backButton")) {
          backButtonAction();
          action = 0;
        } else if (mBtn.is("skipButton")) {
          skipButtonAction();
          action = 1;
        }
        generalBackSkipButtonAction(action);
      } else if (mBtn.is("pauseButton")) {
        pauseButtonAction();
      }
    }));
    get("bpmChange", { recursive: true }).forEach((bpmChange) => {
      if (!bpmChange.is("wave"))
        bpmChange.use(waver({
          maxAmplitude: 5,
          wave_speed: currentSong.speed,
          wave_tweenSpeed: 0.2
        }));
      if (!musicHandler.paused)
        bpmChange.startWave();
    });
    onUpdate("bpmChange", (bpmChangeObj) => {
      bpmChangeObj.wave_speed = currentSong.speed;
    });
    winParent.onKeyPress((key) => {
      let action;
      if (key == "left") {
        backButtonAction();
        action = 0;
      } else if (key == "right") {
        skipButtonAction();
        action = 1;
      }
      if (key == "left" || key == "right")
        generalBackSkipButtonAction(action);
      else if (key == "up")
        pauseButtonAction();
    });
    winParent.on("close", () => {
      angleOfDisc = disc.angle;
    });
    theOneBehind.onClick(() => {
      if (!winParent.active)
        return;
      let leftSideOfTheOneBehind = theOneBehind.screenPos().x - theOneBehind.width * 0.5;
      let rightSideOfTheOneBehind = theOneBehind.screenPos().x + theOneBehind.width * 0.5;
      let mappedSeconds = map(mousePos().x, leftSideOfTheOneBehind, rightSideOfTheOneBehind, 0, musicHandler.duration());
      mappedSeconds = clamp(mappedSeconds, 0, musicHandler.duration());
      if (!skipping) {
        musicHandler.winding = true;
        musicHandler.seek(mappedSeconds);
        let mappedWidth = map(mappedSeconds, 0, currentSong.duration, 0, theOneBehind.width);
        tween(progressBar.width, mappedWidth, 0.2, (p) => progressBar.width = p, easings.easeOutQuint).onEnd(() => {
          musicHandler.winding = false;
        });
      }
    });
    return;
  }

  // source/game/windows/windows-api/folderObj.ts
  var folderObj;
  var folded = true;
  var timeSinceFold = 0;
  var movingMinibuttons;
  function folderObjManaging() {
    folded = true;
    timeSinceFold = 0;
    allObjWindows.isHoveringAWindow = false;
    allObjWindows.isDraggingAWindow = false;
    movingMinibuttons = false;
    folderObj = add([
      sprite("folderObj"),
      pos(width() - 40, height() - 40),
      area({ scale: vec2(1.2) }),
      layer("ui"),
      z(0),
      scale(),
      anchor("center"),
      outsideWindowHover(),
      "folderObj",
      {
        defaultScale: vec2(1.2),
        interactable: true,
        unfold() {
          folded = false;
          timeSinceFold = 0;
          playSfx("fold");
          if (get("minibutton").length == 0) {
            GameState.taskbar.forEach((key, taskbarIndex) => {
              let newminibutton = addMinibutton({
                windowKey: key,
                taskbarIndex,
                initialPosition: folderObj.pos
              });
            });
            movingMinibuttons = true;
            get("minibutton").forEach((miniButton) => {
              tween(miniButton.pos, miniButton.destinedPosition, 0.32, (p) => miniButton.pos = p, easings.easeOutBack).then(() => {
                movingMinibuttons = false;
              });
            });
          }
          this.trigger("unfold");
        },
        fold() {
          folded = true;
          movingMinibuttons = true;
          get("minibutton").forEach((minibutton) => {
            tween(minibutton.opacity, 0, 0.32, (p) => minibutton.opacity = p, easings.easeOutQuint);
            tween(minibutton.pos, folderObj.pos, 0.32, (p) => minibutton.pos = p, easings.easeOutQuint).then(() => {
              destroy(minibutton);
              movingMinibuttons = false;
            });
          });
          playSfx("fold", { detune: -150 });
          this.trigger("fold");
        },
        manageFold() {
          if (folded)
            folderObj.unfold();
          else
            folderObj.fold();
        },
        addSlots() {
          get("minibutton").filter((minibutton) => !minibutton.extraMb).forEach((minibutton, index) => {
            add([
              rect(20, 20, { radius: 4 }),
              pos(getMinibuttonPos(index)),
              color(BLACK),
              anchor("center"),
              opacity(0.5),
              "minibuttonslot",
              "slot_" + index,
              {
                taskbarIndex: index
              }
            ]);
          });
        },
        deleteSlots() {
          let minibuttonsslots = get("minibuttonslot");
          minibuttonsslots?.forEach((minibuttonslot) => {
            destroy(minibuttonslot);
          });
        },
        update() {
          if (this.interactable == false)
            this.area.scale = vec2(0);
          else
            this.area.scale = vec2(1.2);
          this.flipX = folded ? true : false;
          if (curDraggin?.is("gridMiniButton") || curDraggin?.is("minibutton"))
            return;
          if (!movingMinibuttons) {
            if (this.interactable == true && isKeyPressed("space") || isMousePressed("left") && this.isHovering()) {
              this.manageFold();
              this.deleteSlots();
              bop(this);
            }
          }
          if (timeSinceFold < 0.25)
            timeSinceFold += dt();
          if (timeSinceSkip < 5)
            setTimeSinceSkip(timeSinceSkip + dt());
        }
      }
    ]);
    folderObj.startingHover(() => {
      mouse.play("point");
    });
    folderObj.endingHover(() => {
      mouse.play("cursor");
    });
    folderObj.onCharInput((key) => {
      if (ascension.ascending == true)
        return;
      if (isKeyDown("control"))
        return;
      if (curDraggin)
        return;
      const numberPressed = parseInt(key);
      if (isNaN(numberPressed))
        return;
      const index = numberPressed - 1;
      if (numberPressed == 0) {
        if (folded)
          folderObj.unfold();
        manageWindow("extraWin");
      } else if (index >= 0 && index < GameState.taskbar.length) {
        const windowKey3 = GameState.taskbar[index];
        if (GameState.unlockedWindows.includes(windowKey3)) {
          if (folded)
            folderObj.unfold();
          let minibutton = get(windowKey3)?.filter((obj) => obj.is("minibutton"))[0];
          if (minibutton)
            minibutton.click();
          else
            manageWindow(windowKey3);
        }
      }
    });
    folderObj.on("winClose", () => {
      let allWindows = get("window");
      if (allWindows.length > 0)
        allWindows.reverse()[0].activate();
      let isAnyObjGettingHovered = get("outsideHover", { recursive: true }).some((outsideHover) => outsideHover.isHovering() == true && outsideHover.isBeingHovered == false);
      if (isAnyObjGettingHovered == true) {
        let allHoveredObjs = get("outsideHover", { recursive: true }).filter((outsideHover) => outsideHover.isHovering() == true && outsideHover.isBeingHovered == false);
        allHoveredObjs.forEach((obj) => obj.startHoverFunction());
      }
    });
    folderObj.onUpdate(() => {
      if (get("window").length > 0) {
        allObjWindows.isHoveringAWindow = get("window").some((window2) => window2.isMouseInRange());
        allObjWindows.isDraggingAWindow = get("window").some((window2) => window2.dragging);
      } else {
        allObjWindows.isHoveringAWindow = false;
        allObjWindows.isDraggingAWindow = false;
      }
    });
    onUpdate("closestMinibuttonToDrag", (minibutton) => {
      if (!curDraggin?.is("gridMiniButton"))
        return;
      if (curDraggin?.screenPos().dist(minibutton.screenPos()) > 120)
        return;
      let distanceToCurDragging = curDraggin?.screenPos().dist(minibutton.screenPos());
      minibutton.nervousSpinSpeed = 14;
      let blackness = map(distanceToCurDragging, 20, 120, 1, 0.25);
      minibutton.opacity = map(distanceToCurDragging, 20, 120, 0.5, 1);
      minibutton.scale.x = map(distanceToCurDragging, 20, 120, 0.8, 1);
      minibutton.scale.y = map(distanceToCurDragging, 20, 120, 0.8, 1);
      minibutton.scale.y = map(distanceToCurDragging, 20, 120, 0.8, 1);
      minibutton.color = blendColors(WHITE, BLACK, blackness);
    });
  }

  // source/game/powerups.ts
  var powerupTypes = {
    /**
     * Makes clicks more powerful
     */
    "clicks": { sprite: "cursors.cursor", multiplier: 1, removalTime: null, color: [199, 228, 255] },
    /**
     * Makes cursors more powerful
     */
    "cursors": { sprite: "cursors.point", multiplier: 1, removalTime: null, color: [199, 252, 197] },
    /**
     * Gives you the score you would have gotten in X amount of time
     */
    "time": { sprite: "cursors.wait", multiplier: 1, removalTime: null, color: [247, 242, 193] },
    /**
     * Increses production
     */
    "awesome": { sprite: "cursors.check", multiplier: 1, removalTime: null, color: [227, 190, 247] },
    /**
     * Gives discounts for clickers and cursors
     */
    "store": { sprite: "icon_store", multiplier: 1, removalTime: null, color: [195, 250, 162] },
    /**
     * Is just silly, very silly
     */
    "blab": { sprite: "panderito", multiplier: 1, removalTime: null }
  };
  var blabPhrases = [
    "lol!",
    "Why did you click me?",
    "IT HAD A FAMILY",
    "Clicking since 1999"
  ];
  var timerSpacing = 65;
  function getTimerXPos(index) {
    let initialPos2 = vec2(width() + timerSpacing / 2);
    return getPosInGrid(initialPos2, 0, -index - 1, vec2(timerSpacing, 0)).x;
  }
  function addTimer(opts) {
    let timerObj = add([
      rect(60, 60),
      color(WHITE),
      outline(3, BLACK),
      pos(0, 40),
      anchor("center"),
      opacity(1),
      scale(),
      rotate(0),
      layer("ui"),
      area(),
      "putimer",
      `${opts.type}_putimer`,
      {
        index: get("putimer").length,
        updateTime() {
          tween(vec2(1), vec2(1.1), 0.32, (p) => this.scale = p, easings.easeOutQuint).onEnd(() => {
            tween(this.scale, vec2(1), 0.32, (p) => this.scale = p, easings.easeOutElastic);
          });
        },
        end() {
          this.tags.forEach((tag) => this.unuse(tag));
          tween(this.pos.y, this.pos.y - 40, 0.32, (p) => this.pos.y = p, easings.easeOutQuint);
          tween(1, 0, 0.32, (p) => this.opacity = p, easings.easeOutQuint).onEnd(() => {
            destroy(this);
          });
          get("putimer").filter((pt2) => pt2.index > this.index).forEach((element) => {
            element.index--;
            tween(element.pos.x, getTimerXPos(element.index), 0.32, (p) => element.pos.x = p, easings.easeOutQuint);
          });
        }
      }
    ]);
    tween(30, 40, 0.32, (p) => timerObj.pos.y = p, easings.easeOutQuint);
    tween(90, 0, 0.32, (p) => timerObj.angle = p, easings.easeOutQuint);
    timerObj.pos.x = getTimerXPos(timerObj.index);
    timerObj.add([
      text("", { font: "lambdao", size: timerObj.height / 2 }),
      pos(0, timerObj.height / 2 + 15),
      anchor("center"),
      opacity(),
      z(3),
      {
        update() {
          this.opacity = timerObj.opacity;
          if (powerupTypes[opts.type].removalTime == null)
            return;
          this.text = `${powerupTypes[opts.type].removalTime.toFixed(0)}s
`;
        }
      }
    ]);
    timerObj.onClick(() => {
      if (get(`poweruplog_${opts.type}`).length == 0) {
        bop(timerObj);
        addPowerupLog(opts.type);
      }
    });
    let icon = timerObj.add([
      sprite("white_noise"),
      anchor("center"),
      z(1),
      {
        update() {
          this.opacity = timerObj.opacity;
        }
      }
    ]);
    parseAnimation(icon, opts.sprite);
    icon.width = 50;
    icon.height = 50;
    let maxTime = powerupTypes[opts.type].removalTime;
    let round = timerObj.add([
      z(2),
      {
        draw() {
          drawRect({
            width: timerObj.width - timerObj.outline.width,
            height: map(powerupTypes[opts.type].removalTime, 0, maxTime, 0, timerObj.height - timerObj.outline.width),
            color: YELLOW,
            anchor: "bot",
            pos: vec2(0, timerObj.height / 2),
            opacity: 0.25
          });
        }
      }
    ]);
  }
  function addPowerupLog(powerupType) {
    let powerupTime = powerupTypes[powerupType].removalTime;
    let textInText = "";
    if (powerupType == "blab")
      textInText = choose(blabPhrases);
    let bgOpacity = 0.95;
    let bg2 = add([
      rect(300, 100, { radius: 5 }),
      pos(center().x, height() - 100),
      color(BLACK.lighten(2)),
      positionSetter(),
      anchor("center"),
      layer("powerups"),
      opacity(bgOpacity),
      z(1),
      `poweruplog_${powerupType}`,
      {
        draw() {
        }
      }
    ]);
    let textInBgOpts = { size: 25, align: "center", width: 300 };
    let textInBg = bg2.add([
      text("", textInBgOpts),
      pos(0, 0),
      anchor("center"),
      area(),
      opacity(),
      {
        update() {
          if (powerupTypes[powerupType].removalTime == null) {
            powerupTime = 0;
            return;
          }
          powerupTime = Math.round(powerupTypes[powerupType].removalTime);
          let powerupMultiplier = powerupTypes[powerupType].multiplier;
          if (powerupType == "clicks")
            textInText = `Click production increased x${powerupMultiplier} for ${powerupTime} secs`;
          else if (powerupType == "cursors")
            textInText = `Cursors production increased x${powerupMultiplier} for ${powerupTime} secs`;
          else if (powerupType == "time") {
            textInText = `+${formatNumber(Math.round(scoreManager.autoScorePerSecond()) * powerupTime)}, the score you would have gained in ${powerupTime} secs`;
          } else if (powerupType == "awesome")
            textInText = `Score production increased by x${powerupMultiplier} for ${powerupTime}, AWESOME!!`;
          else if (powerupType == "store")
            textInText = `Store prices have a discount of ${Math.round(powerupMultiplier * 100)}% for ${powerupTime} secs, get em' now!`;
          else if (powerupType == "blab")
            textInText = textInText;
          else
            throw new Error("powerup type doesn't exist");
          this.text = textInText;
        }
      }
    ]);
    bg2.onUpdate(() => {
      bg2.width = 315;
      bg2.height = formatText({ text: textInText, ...textInBgOpts }).height + 15;
    });
    tween(0, bgOpacity, 0.5, (p) => bg2.opacity = p, easings.easeOutQuad);
    tween(height() + bg2.height, height() - bg2.height, 0.5, (p) => bg2.pos.y = p, easings.easeOutQuad);
    wait(3.5, () => {
      tween(bg2.pos.y, bg2.pos.y - bg2.height, 0.5, (p) => bg2.pos.y = p, easings.easeOutQuad);
      bg2.fadeOut(0.5).onEnd(() => destroy(bg2));
      tween(textInBg.opacity, 0, 0.5, (p) => textInBg.opacity = p, easings.easeOutQuad);
    });
  }
  var isHoveringAPowerup = false;
  function spawnPowerup(opts) {
    if (ascension.ascending == true)
      return;
    if (opts == void 0)
      opts = {};
    function getRandomPowerup() {
      let list = Object.keys(powerupTypes);
      if (Math.round(scoreManager.autoScorePerSecond()) < 1)
        list.splice(list.indexOf("time"), 1);
      if (opts.natural == false)
        list.splice(list.indexOf("awesome"), 1);
      let element = choose(list);
      if (chance(0.2) && opts.natural == false)
        element = "blab";
      return element;
    }
    opts.type = opts.type || getRandomPowerup();
    opts.pos = opts.pos || randomPos2();
    let powerupObj = add([
      sprite("white_noise"),
      pos(opts.pos),
      scale(1),
      area(),
      anchor("center"),
      opacity(),
      layer("powerups"),
      color(WHITE),
      rotate(0),
      z(0),
      waver({ wave_speed: 1.25, maxAmplitude: 5, minAmplitude: 0 }),
      area(),
      "powerup",
      {
        whiteness: 0,
        type: opts.type,
        maxScale: 3,
        update() {
          this.angle = wave(-1, 1, time() * 3);
        },
        startHover() {
          tween(this.scale, vec2(this.maxScale).add(0.2), 0.15, (p) => this.scale = p, easings.easeOutBack);
        },
        endHover() {
          tween(this.scale, vec2(this.maxScale).sub(0.2), 0.15, (p) => this.scale = p, easings.easeOutBack);
        },
        dieAnim() {
          this.area.scale = vec2(0);
          tween(this.scale, vec2(this.maxScale).add(0.4), 0.15, (p) => this.scale = p, easings.easeOutBack);
          tween(this.opacity, 0, 0.15, (p) => this.opacity = p, easings.easeOutBack).onEnd(() => {
            destroy(this);
          });
          let blink = add([
            sprite("white_noise"),
            pos(this.pos),
            scale(this.scale),
            anchor(this.anchor),
            opacity(0.5),
            layer("powerups"),
            z(this.z - 1),
            timer(),
            {
              maxOpacity: 0.5,
              update() {
                this.pos.y -= 0.5;
              }
            }
          ]);
          blink.width = this.width;
          blink.height = this.height;
          parseAnimation(blink, powerupTypes[opts.type].sprite);
          let timeToLeave = 0.75;
          loop(0.1, () => {
            if (blink.opacity == blink.maxOpacity)
              blink.opacity = 0;
            else
              blink.opacity = blink.maxOpacity;
          });
          tween(0.5, 0, timeToLeave, (p) => blink.maxOpacity = p, easings.easeOutBack);
          blink.wait(timeToLeave, () => {
            destroy(blink);
          });
        },
        click() {
          this.dieAnim();
          playSfx("powerup");
          checkForUnlockable();
          GameState.stats.powerupsClicked++;
          let multiplier = 0;
          let time2 = 0;
          const power = GameState.powerupPower;
          if (opts.multiplier == null) {
            if (opts.type == "clicks" || opts.type == "cursors") {
              time2 = opts.time ?? randi(5, 15);
              multiplier = randi(2, 5) * power;
            } else if (opts.type == "awesome") {
              time2 = opts.time ?? randi(2.5, 5);
              multiplier = randi(5, 10) * power;
            } else if (opts.type == "store") {
              time2 = opts.time ?? randi(2.5, 5);
              multiplier = rand(0.05, 0.25) / power;
            } else if (opts.type == "time") {
              multiplier = 1;
              time2 = opts.time ?? rand(30, 60) * power;
              scoreManager.addTweenScore(scoreManager.scorePerSecond() * time2);
            } else if (opts.type == "blab") {
              multiplier = 1;
              time2 = 1;
              scoreManager.addScore(1);
            }
          }
          if (opts.type != "time") {
            let checkTimer = get(`${opts.type}_putimer`)[0];
            if (checkTimer)
              checkTimer.updateTime();
            else
              addTimer({ sprite: powerupTypes[powerupObj.type].sprite, type: opts.type });
          }
          powerupTypes[opts.type].multiplier = multiplier;
          powerupTypes[opts.type].removalTime = time2;
          addPowerupLog(opts.type);
        }
      }
    ]);
    parseAnimation(powerupObj, powerupTypes[opts.type].sprite);
    powerupObj.startWave();
    powerupObj.width = 60;
    powerupObj.height = 60;
    tween(vec2(powerupObj.maxScale).sub(0.4), vec2(powerupObj.maxScale), 0.25, (p) => powerupObj.scale = p, easings.easeOutBack);
    tween(0, 1, 0.2, (p) => powerupObj.opacity = p, easings.easeOutBack);
    powerupObj.onHover(() => {
      powerupObj.startHover();
      query({
        include: ["insideHover", "outsideHover"],
        includeOp: "or"
      }).forEach((obj) => {
        if (obj.isBeingHovered == true) {
          obj.endHoverFunction();
        }
      });
    });
    powerupObj.onHoverEnd(() => {
      powerupObj.endHover();
      query({
        include: ["insideHover", "outsideHover"],
        includeOp: "or"
      }).forEach((obj) => {
        if (obj.isHovering() == true && obj.isBeingHovered == false) {
          obj.startHoverFunction();
        }
      });
    });
    powerupObj.onClick(() => {
      powerupObj.click();
    });
  }
  function powerupTimeManagement() {
    for (let powerup in powerupTypes) {
      if (powerupTypes[powerup].removalTime != null) {
        if (powerup != "time")
          powerupTypes[powerup].removalTime -= dt();
        if (powerupTypes[powerup].removalTime < 0) {
          powerupTypes[powerup].removalTime = null;
          get(`${powerup}_putimer`)?.forEach((timer2) => timer2.end());
          powerupTypes[powerup].multiplier = 1;
        }
      }
    }
    if (get("powerup").length > 0) {
      isHoveringAPowerup = get("powerup").some((powerup) => powerup.isHovering());
    }
  }

  // source/game/windows/store/storeElements.ts
  var storeElementsInfo = {
    "clickersElement": {
      gamestateKey: "clickers",
      basePrice: 25,
      percentageIncrease: 15
    },
    "cursorsElement": {
      gamestateKey: "cursors",
      basePrice: 50,
      percentageIncrease: 25
    },
    "powerupsElement": {
      gamestateKey: "stats.powerupsBought",
      basePrice: 50500,
      percentageIncrease: 160,
      unlockPrice: 10500
    }
  };
  function addSmoke(winParent, btn) {
    let smoke = winParent.add([
      sprite("smoke"),
      pos(btn.pos.x - btn.width / 2, btn.pos.y - btn.height / 2),
      opacity(),
      anchor("center"),
      z(btn.z - 1),
      "smoke"
    ]);
    smoke.fadeIn(1);
    smoke.play("smoking");
    return smoke;
  }
  function regularStoreElement(winParent) {
    let thisElement = null;
    let timer2 = 0;
    let minTime = 0.08;
    let timeUntilAnotherBuy = 1.2;
    let maxTime = 1.2;
    let hold_timesBought = 0;
    let downEvent = null;
    return {
      add() {
        thisElement = this;
        thisElement.onMousePress("left", () => {
          if (isHoveringAPowerup == true)
            return;
          if (thisElement.isBeingHovered == false)
            return;
          if (!winParent.active)
            return;
          if (isHoveringUpgrade)
            return;
          if (!thisElement.isHovering())
            return;
          if (GameState.score < thisElement.price) {
            thisElement.trigger("notEnoughMoney");
            return;
          }
          downEvent = thisElement.onMouseDown(() => {
            thisElement.isBeingClicked = true;
            if (GameState.score < thisElement.price)
              return;
            if (hold_timesBought == 0) {
              timeUntilAnotherBuy = maxTime;
            }
            timer2 += dt();
            timeUntilAnotherBuy = maxTime / hold_timesBought;
            timeUntilAnotherBuy = clamp(timeUntilAnotherBuy, minTime, maxTime);
            if (hold_timesBought == 0) {
              hold_timesBought = 1;
              thisElement.buy(amountToBuy);
            }
            if (timer2 > timeUntilAnotherBuy) {
              timer2 = 0;
              hold_timesBought++;
              thisElement.buy(amountToBuy);
            }
          });
        });
        thisElement.onMouseRelease(() => {
          if (isHoveringAPowerup == true)
            return;
          if (!winParent.active)
            return;
          downEvent?.cancel();
          downEvent = null;
          if (!thisElement.isHovering())
            return;
          thisElement.isBeingClicked = false;
          timer2 = 0;
          hold_timesBought = 0;
          timeUntilAnotherBuy = 2.25;
        });
        thisElement.on("endHover", () => {
          timer2 = 0;
          hold_timesBought = 0;
        });
      }
    };
  }
  function lockedPowerupStoreElement(winParent) {
    let thisElement = null;
    let progressSound = null;
    const unlockPrice = storeElementsInfo.powerupsElement.unlockPrice;
    return {
      id: "lockedPowerupStoreElement",
      chains: null,
      boughtProgress: 0,
      dropUnlock() {
        tween(thisElement.boughtProgress, 0, 0.15, (p) => thisElement.boughtProgress = p);
        tween(this.scale, vec2(1.025), 0.15, (p) => this.scale = p, easings.easeOutQuad);
        tween(thisElement.chains.opacity, 1, 0.15, (p) => thisElement.chains.opacity = p, easings.easeOutQuad);
      },
      add() {
        thisElement = this;
        thisElement.chains = thisElement.add([
          sprite("chains"),
          pos(),
          anchor("center"),
          opacity(1)
        ]);
        thisElement.onDraw(() => {
          drawRect({
            width: thisElement.width,
            height: map(thisElement.boughtProgress, 0, 100, thisElement.height, 0),
            anchor: "bot",
            color: BLACK,
            pos: vec2(0, thisElement.height / 2),
            radius: 5,
            opacity: 0.8
          });
        });
        let downEvent = null;
        thisElement.onMousePress("left", () => {
          if (isHoveringAPowerup == true)
            return;
          if (thisElement.isBeingHovered == false)
            return;
          if (!winParent.active)
            return;
          downEvent?.cancel();
          if (!thisElement.isHovering())
            return;
          if (GameState.score < thisElement.price) {
            thisElement.trigger("notEnoughMoney");
            return;
          }
          progressSound = playSfx("progress");
          downEvent = thisElement.onMouseDown("left", () => {
            if (thisElement.isBeingHovered == false)
              return;
            if (thisElement.boughtProgress < 100) {
              thisElement.boughtProgress += 1.5;
              thisElement.scale.x = map(thisElement.boughtProgress, 0, 100, 1.025, 0.9);
              thisElement.scale.y = map(thisElement.boughtProgress, 0, 100, 1.025, 0.9);
              thisElement.chains.opacity = map(thisElement.boughtProgress, 0, 100, 1, 0.25);
              progressSound.detune = thisElement.boughtProgress * 1.1;
            }
            if (thisElement.boughtProgress >= 100 && !GameState.hasUnlockedPowerups) {
              thisElement.unlock();
            }
          });
        });
        thisElement.onMouseRelease("left", () => {
          if (isHoveringAPowerup == true)
            return;
          if (!winParent.active)
            return;
          if (!thisElement.isHovering())
            return;
          thisElement.dropUnlock();
          if (thisElement.boughtProgress > 0) {
          } else {
            if (GameState.score >= this.price)
              bop(thisElement);
          }
          progressSound?.seek(1);
        });
      },
      unlock() {
        GameState.hasUnlockedPowerups = true;
        playSfx("kaching");
        playSfx("chainbreak");
        let copyOfOld = thisElement;
        thisElement.destroy();
        let newElement = addStoreElement(winParent, { type: "powerupsElement", pos: thisElement.pos });
        let index = storeElements.indexOf(copyOfOld);
        if (index > -1)
          storeElements[index] = newElement;
        ROOT.trigger("powerupunlock");
        scoreManager.subTweenScore(unlockPrice);
      }
    };
  }
  var buyTimer = null;
  var amountToBuy = 1;
  function addStoreElement(winParent, opts) {
    const btn = winParent.add([
      sprite(opts.type),
      pos(opts.pos),
      area(),
      color(),
      opacity(1),
      scale(1),
      anchor("center"),
      z(winParent.z + 1),
      insideWindowHover(winParent),
      "storeElement",
      `${opts.type}`,
      {
        price: 0,
        isBeingClicked: false,
        down: false,
        timesBoughtConsecutively: 0,
        buy(amount) {
          if (winParent.dragging)
            return;
          GameState[storeElementsInfo[opts.type].gamestateKey] += amount;
          storePitchJuice.hasBoughtRecently = true;
          storePitchJuice.timeSinceBought = 0;
          if (storePitchJuice.hasBoughtRecently == true)
            storePitchJuice.storeTune += 25;
          storePitchJuice.storeTune = clamp(storePitchJuice.storeTune, -100, 500);
          playSfx("kaching", { detune: storePitchJuice.storeTune });
          scoreManager.subTweenScore(this.price);
          if (this.isBeingClicked) {
            this.play("down");
            this.get("*").forEach((element) => {
              element.pos.y += 2;
            });
            wait(0.15, () => {
              this.play("up");
              this.get("*").forEach((element) => {
                element.pos.y -= 2;
              });
            });
          }
          if (this.timesBoughtConsecutively < 6)
            this.timesBoughtConsecutively++;
          buyTimer?.cancel();
          buyTimer = wait(0.75, () => {
            this.timesBoughtConsecutively = 0;
            let smoke = get("smoke", { recursive: true })[0];
            if (smoke) {
              smoke.unuse("smoke");
              smoke.fadeOut(1);
              tween(smoke.pos.y, smoke.pos.y - 15, 0.5, (p) => smoke.pos.y = p);
            }
          });
          if (this.timesBoughtConsecutively == 5) {
            addSmoke(winParent, this);
          }
          ROOT.trigger("buy", { element: "storeElement", type: opts.type == "clickersElement" ? "clickers" : "cursors", price: this.price });
          if (opts.type == "powerupsElement") {
            spawnPowerup({
              pos: randomPos2(),
              natural: false
            });
            GameState.stats.powerupsBought++;
          }
          this.trigger("buy");
        }
      }
    ]);
    let tooltip = null;
    if (opts.type == "powerupsElement" && GameState.hasUnlockedPowerups == false) {
      btn.use(lockedPowerupStoreElement(winParent));
      tooltip = addTooltip(btn, {
        text: `${formatNumber(storeElementsInfo.powerupsElement.unlockPrice, { price: true })}`,
        direction: "down",
        lerpValue: 1,
        layer: winParent.layer,
        z: winParent.z,
        type: "store"
      });
      const greenPrice = GREEN.lighten(30);
      const redPrice = RED.lighten(30);
      tooltip.tooltipText.onUpdate(() => {
        if (GameState.score >= storeElementsInfo.powerupsElement.unlockPrice)
          tooltip.tooltipText.color = greenPrice;
        else
          tooltip.tooltipText.color = redPrice;
      });
    } else
      btn.use(regularStoreElement(winParent));
    btn.onUpdate(() => {
      if (isKeyDown("shift"))
        amountToBuy = 10;
      else
        amountToBuy = 1;
      btn.area.scale = vec2(1 / btn.scale.x, 1 / btn.scale.y);
      if (opts.type == "powerupsElement" && GameState.hasUnlockedPowerups == false) {
        btn.price = storeElementsInfo.powerupsElement.unlockPrice;
      } else {
        const amountBought = getVariable(GameState, storeElementsInfo[opts.type].gamestateKey);
        let priceMultiplier = 1;
        if (opts.type != "powerupsElement")
          priceMultiplier = powerupTypes.store.multiplier;
        const elementInfo = storeElementsInfo[opts.type];
        btn.price = getPrice({
          basePrice: elementInfo.basePrice,
          percentageIncrease: elementInfo.percentageIncrease + 1 * GameState.stats.timesAscended,
          objectAmount: amountBought,
          amountToBuy: opts.type == "powerupsElement" ? 1 : amountToBuy,
          gifted: opts.type == "clickersElement" ? 1 : 0
        }) * priceMultiplier;
      }
    });
    btn.startingHover(() => {
      tween(btn.scale, vec2(1.025), 0.15, (p) => btn.scale = p, easings.easeOutQuad);
    });
    btn.endingHover(() => {
      tween(btn.scale, vec2(1), 0.15, (p) => btn.scale = p, easings.easeOutQuad);
      if (btn.isBeingClicked == true)
        btn.isBeingClicked = false;
      btn.trigger("endHover");
    });
    let stacksText = btn.add([
      text("Stacked upgrades: 0", {
        size: 14,
        align: "left"
      }),
      anchor("left"),
      pos(-155, 24),
      color(BLACK),
      z(btn.z + 1),
      "stacksText",
      {
        update() {
          if (opts.type == "clickersElement") {
            let percentage3 = `(+${GameState.clickPercentage}%)`;
            let stuff = [
              `Stacked upgrades: ${GameState.clicksUpgradesValue == 1 ? GameState.clicksUpgradesValue - 1 : GameState.clicksUpgradesValue}`,
              `${GameState.clickPercentage < 1 ? "" : percentage3}`
            ];
            this.text = stuff.join(" ");
          } else if (opts.type == "cursorsElement") {
            let percentage3 = `(+${GameState.cursorsPercentage}%)`;
            let stuff = [
              `Stacked upgrades: ${GameState.cursorsUpgradesValue == 1 ? GameState.cursorsUpgradesValue - 1 : GameState.cursorsUpgradesValue}`,
              `${GameState.clickPercentage < 1 ? "" : percentage3}`
            ];
            this.text = stuff.join(" ");
          } else if (opts.type == "powerupsElement")
            this.destroy();
        }
      }
    ]);
    let priceText = btn.add([
      text("$50", {
        size: 18,
        align: "center"
      }),
      anchor("center"),
      pos(-100, stacksText.pos.y + 15),
      color(BLACK),
      z(btn.z + 1),
      {
        update() {
          this.text = `${formatNumber(Math.round(btn.price), { price: true, fixAmount: 2 })}`;
          if (GameState.score >= btn.price)
            this.color = GREEN;
          else
            this.color = RED;
          if (opts.type == "powerupsElement") {
            if (GameState.hasUnlockedPowerups == false)
              this.destroy();
            else
              this.pos = vec2(-5, 41);
          }
        }
      }
    ]);
    let amountText = btn.add([
      text("x1", {
        size: 18,
        align: "left"
      }),
      anchor("center"),
      pos(-159, -52),
      color(BLACK),
      opacity(0.25),
      z(btn.z + 1),
      {
        update() {
          this.text = "x" + amountToBuy;
          if (amountToBuy == 10)
            this.opacity = 0.45;
          else
            this.opacity = 0.252;
          if (opts.type == "powerupsElement")
            this.destroy();
        }
      }
    ]);
    if (opts.type == "powerupsElement") {
      let powerupText = btn.add([
        text("x1", {
          size: 18,
          align: "left"
        }),
        anchor("center"),
        pos(-139, -52),
        color(BLACK),
        opacity(0.45),
        z(btn.z + 1),
        {
          update() {
            if (GameState.hasUnlockedPowerups == false)
              this.destroy();
            this.text = `Power: ${GameState.powerupPower}x`;
          }
        }
      ]);
    }
    btn.on("notEnoughMoney", () => {
      const direction = getRandomDirection(opts.pos, false, 1.25);
      tween(direction, opts.pos, 0.25, (p) => btn.pos = p, easings.easeOutQuint);
      if (btn.is("lockedPowerupStoreElement")) {
        tween(choose([-15, 15]), 0, 0.25, (p) => tooltip.tooltipText.angle = p, easings.easeOutQuint);
        playSfx("chainwrong", { detune: rand(-50, 50) });
      } else {
        tween(choose([-15, 15]), 0, 0.25, (p) => priceText.angle = p, easings.easeOutQuint);
      }
      playSfx("wrong", { detune: rand(-50, 50) });
    });
    btn.on("buy", () => {
    });
    return btn;
  }

  // source/game/windows/store/storeWindows.ts
  var storeElements = [];
  var storePitchJuice = {
    hasBoughtRecently: false,
    timeSinceBought: 0,
    storeTune: 0
  };
  var isHoveringUpgrade;
  var clickersElement;
  var cursorsElement;
  var powerupsElement;
  function storeWinContent(winParent) {
    clickersElement = addStoreElement(winParent, { type: "clickersElement", pos: vec2(0, -128) });
    addUpgrades(clickersElement);
    cursorsElement = addStoreElement(winParent, { type: "cursorsElement", pos: vec2(0, clickersElement.pos.y + clickersElement.height + 15) });
    addUpgrades(cursorsElement);
    powerupsElement = addStoreElement(winParent, { type: "powerupsElement", pos: vec2(0, cursorsElement.pos.y + cursorsElement.height + 15) });
    storeElements = [clickersElement, cursorsElement, powerupsElement];
    let firstUpgrade = clickersElement.get("upgrade").filter((upgrade) => upgrade.id == "k_0")[0];
    winParent.onUpdate(() => {
      if (!winParent.is("window"))
        return;
      if (storePitchJuice.timeSinceBought < 1) {
        storePitchJuice.timeSinceBought += dt();
        if (storePitchJuice.timeSinceBought > 0.25) {
          storePitchJuice.hasBoughtRecently = false;
          storePitchJuice.storeTune = 0;
        }
      }
      isHoveringUpgrade = get("upgrade", { recursive: true }).some((upgrade) => upgrade.isHovering());
      if (GameState.stats.timesAscended < 1) {
        const clickersTutorialTooltip = () => {
          let tooltip = addTooltip(clickersElement, {
            text: "\u2190 You can buy these to get more\nscore per click",
            direction: "right",
            type: "tutorialClickers",
            layer: winParent.layer,
            z: winParent.z
          });
          let buyClickersEvent = ROOT.on("buy", (data) => {
            if (data.type == "clickers") {
              tooltip.end();
              buyClickersEvent.cancel();
            }
          });
        };
        const cursorsTutorialTooltip = () => {
          let tooltip = addTooltip(cursorsElement, {
            text: "\u2190 You can buy these to\nautomatically get score!",
            direction: "right",
            type: "tutorialCursors",
            layer: winParent.layer,
            z: winParent.z
          });
          let buyCursorsEvent = ROOT.on("buy", (data) => {
            if (data.type == "cursors") {
              tooltip.end();
              buyCursorsEvent.cancel();
            }
          });
        };
        const powerupsTutorialTooltip = () => {
          let tooltip = addTooltip(powerupsElement, {
            text: "\u2190 Power-ups give you a small help!\nFor a time limit.",
            direction: "right",
            type: "tutorialPowerups",
            layer: winParent.layer,
            z: winParent.z
          });
          let unlockPowerupsEvent = ROOT.on("powerupunlock", () => {
            tooltip.end();
            unlockPowerupsEvent.cancel();
          });
        };
        const upgradesTutorialTooltip = () => {
          let tutorialObj = firstUpgrade.add([
            pos(),
            anchor(firstUpgrade.anchor)
          ]);
          let tooltip = addTooltip(tutorialObj, {
            text: "\u2190 Upgrades help make your clicks worth!",
            direction: "left",
            type: "tutorialUpgrades",
            layer: winParent.layer,
            z: winParent.z
          });
          let buyFirstUpgradeCheck = ROOT.on("buy", (data) => {
            if (data.element == "upgrade" && data.id == "k_0") {
              tooltip.end();
              buyFirstUpgradeCheck.cancel();
            }
          });
        };
        const getTooltip = (type) => {
          return get("tooltip", { recursive: true }).filter((tooltip) => tooltip.is("text") == false && tooltip.type == type);
        };
        if (GameState.clickers == 1 && GameState.score >= storeElementsInfo.clickersElement.basePrice) {
          if (getTooltip("tutorialClickers").length == 0) {
            clickersTutorialTooltip();
          }
        }
        if (GameState.cursors == 0 && GameState.score >= storeElementsInfo.cursorsElement.basePrice) {
          if (getTooltip("tutorialCursors").length == 0) {
            cursorsTutorialTooltip();
          }
        }
        if (GameState.hasUnlockedPowerups == false && GameState.score >= storeElementsInfo.powerupsElement.unlockPrice) {
          if (getTooltip("tutorialPowerups").length == 0) {
            powerupsTutorialTooltip();
          }
        }
        if (!isUpgradeBought("k_0") && GameState.score >= firstUpgrade.price) {
          if (getTooltip("tutorialUpgrades").length == 0) {
            upgradesTutorialTooltip();
          }
        }
      }
    });
    winParent.on("close", () => {
      winParent.get("*", { recursive: true }).forEach((element) => {
        if (element.endHover)
          element.endHover();
      });
      let tooltips = get("tooltip").filter((tooltip) => tooltip.type != void 0);
      tooltips = tooltips.filter((obj) => obj.type.includes("tutorial") || obj.type.includes("price") || obj.type.includes("store"));
      tooltips.forEach((tooltip) => {
        tooltip.end();
      });
    });
    if (chance(0.01)) {
      winParent.sprite = "stroeWin";
    }
  }

  // source/game/windows/settings/settingsWinElements.ts
  function addCheckbox(opts, parent) {
    let checkBox = (parent || ROOT).add([
      sprite("checkbox", {
        anim: "off"
      }),
      pos(opts.pos),
      anchor("center"),
      area(),
      scale(),
      opts.name,
      {
        tick: null,
        turnOn() {
          this.play("on");
          this.tick.appear();
        },
        turnOff() {
          this.play("off");
          this.tick.dissapear();
        }
      }
    ]);
    let tick = checkBox.add([
      sprite("tick"),
      anchor("center"),
      pos(),
      scale(1),
      "tick",
      {
        appear() {
          this.hidden = false;
        },
        dissapear() {
          this.hidden = true;
        }
      }
    ]);
    checkBox.tick = tick;
    if (opts.checked == true) {
      checkBox.turnOn();
    } else {
      checkBox.turnOff();
    }
    checkBox.onClick(() => {
      bop(checkBox);
      let resultOfClick = opts.onCheck();
      if (resultOfClick == true) {
        checkBox.turnOn();
      } else {
        checkBox.turnOff();
      }
      playSfx("clickButton", { detune: resultOfClick == true ? 150 : -150 });
    });
    if (opts.title) {
      (parent || ROOT).add([
        text(opts.title, {
          size: opts.titleSize
        }),
        pos(checkBox.pos.x, 0),
        anchor("left"),
        {
          update() {
            this.pos.x = checkBox.pos.x + checkBox.width / 2 + 10;
            this.pos.y = checkBox.pos.y;
          }
        }
      ]);
    }
    return checkBox;
  }
  function addVolumeControl(opts, parent) {
    let volumeControlBg = (parent || ROOT).add([
      rect(parent.width - 25, 150, { radius: 10 }),
      pos(0, -218),
      color(BLACK),
      opacity(0.25),
      anchor("top")
    ]);
    let barscontainer = volumeControlBg.add([pos(27, 236)]);
    for (let i2 = 0; i2 < 10; i2++) {
      let volbar = barscontainer.add([
        sprite("volbarbutton"),
        pos(opts.pos),
        anchor("center"),
        scale(),
        area(),
        opacity(1),
        "volbar",
        {
          volume: 0.1 * (i2 + 1),
          update() {
            if (GameState.settings.volume.toFixed(1) < this.volume.toFixed(1))
              this.frame = 1;
            else
              this.frame = 0;
          }
        }
      ]);
      volbar.pos.x = volbar.pos.x + i2 * 28;
      volbar.onClick(() => {
        tween(GameState.settings.volume, volbar.volume, 0.1, (p) => {
          const lastVolume = GameState.settings.volume;
          GameState.settings.volume = parseFloat(p.toFixed(1));
          if (lastVolume != GameState.settings.volume)
            play("volumeChange", { detune: volChangeTune });
        });
        bop(volbar);
      });
    }
    ;
    let volbars = get("volbar", { recursive: true });
    let minus = barscontainer.add([
      sprite("minusbutton"),
      pos(-180, -194),
      area(),
      scale(),
      anchor("center")
    ]);
    minus.pos.x = volbars[0].pos.x - 26;
    minus.onClick(() => {
      if (GameState.settings.volume > 0) {
        GameState.settings.volume -= 0.1;
      } else if ((GameState.settings.volume -= 0.1) == 0) {
      }
      bop(volbars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)]);
      play("volumeChange", { detune: volChangeTune });
      bop(minus);
    });
    let plus = barscontainer.add([
      sprite("plusbutton"),
      pos(142, -194),
      area(),
      scale(),
      anchor("center")
    ]);
    plus.pos.x = volbars[volbars.length - 1].pos.x + 26;
    plus.onClick(() => {
      if (GameState.settings.volume <= 0.9) {
        GameState.settings.volume += 0.1;
        play("volumeChange", { detune: volChangeTune });
      } else
        play("volumeChange", { detune: volChangeTune, volume: 5 });
      bop(volbars[clamp(Math.floor(GameState.settings.volume * 10 - 1), 0, 10)]);
      bop(plus);
    });
    let sfx = addCheckbox({
      pos: vec2(-140, 104),
      title: "SFX",
      checked: !GameState.settings.sfx.muted,
      onCheck: () => {
        manageMute("sfx", !GameState.settings.sfx.muted);
        return !GameState.settings.sfx.muted;
      },
      name: "sfxCheckbox"
    }, volumeControlBg);
    let music = addCheckbox({
      pos: vec2(42, 104),
      title: "MUSIC",
      checked: !GameState.settings.music.muted,
      onCheck: () => {
        manageMute("music", !GameState.settings.music.muted);
        return !GameState.settings.music.muted;
      },
      name: "musicCheckbox"
    }, volumeControlBg);
    return volumeControlBg;
  }
  function addDeleteSaveButton(otherButtonsBg2, winParent) {
    let deleteSaveButton = otherButtonsBg2.add([
      text("X", { size: 50 }),
      pos(-140, 24),
      anchor("center"),
      color(blendColors(WHITE, RED, 0.5)),
      area(),
      insideWindowHover(winParent),
      {
        count: 3
      }
    ]);
    let deleteSaveButtonTooltip = null;
    deleteSaveButton.startingHover(() => {
      if (deleteSaveButton.tooltip == null) {
        deleteSaveButtonTooltip = addTooltip(deleteSaveButton, {
          direction: "up",
          text: "WILL DELETE YOUR SAVE"
        });
      }
    });
    deleteSaveButton.endingHover(() => {
      deleteSaveButton.count = 3;
      deleteSaveButtonTooltip.end();
      deleteSaveButton.color = blendColors(WHITE, RED, 0.5);
    });
    deleteSaveButton.onClick(() => {
      if (!winParent.active)
        return;
      deleteSaveButton.count--;
      playSfx("clickButton", { detune: 25 * deleteSaveButton.count });
      deleteSaveButton.color = blendColors(WHITE, RED, map(deleteSaveButton.count, 3, 0, 0.5, 1));
      deleteSaveButtonTooltip.end();
      deleteSaveButtonTooltip = addTooltip(deleteSaveButton, {
        direction: "up",
        text: `WILL DELETE YOUR SAVE IN ${deleteSaveButton.count}`
      });
      if (deleteSaveButton.count == 0) {
        deleteSaveButtonTooltip.tooltipText.text = "GOODBYE SAVE :)";
        GameState.delete();
      }
    });
    return deleteSaveButton;
  }

  // source/game/windows/settings/settingsWindow.ts
  var otherCheckboxesBg;
  var otherButtonsBg;
  function settingsWinContent(winParent) {
    let volumeControl = addVolumeControl({ pos: vec2(-winParent.width / 2 + 40, -winParent.height / 2 + 75) }, winParent);
    otherCheckboxesBg = winParent.add([
      rect(winParent.width - 25, 255, { radius: 10 }),
      pos(0, -60),
      color(BLACK),
      opacity(0.25),
      anchor("top")
    ]);
    let fullscreenCheckbox = addCheckbox({
      pos: vec2(-144, 38),
      name: "fullscreenCheckbox",
      checked: GameState.settings.fullscreen,
      onCheck: function() {
        GameState.settings.fullscreen = !GameState.settings.fullscreen;
        setFullscreen(GameState.settings.fullscreen);
        return GameState.settings.fullscreen;
      },
      title: "Fullscreen"
    }, otherCheckboxesBg);
    let checkForFullscreen = ROOT.on("fullscreenchange", () => {
      if (isFullscreen())
        fullscreenCheckbox.turnOn();
      else
        fullscreenCheckbox.turnOff();
      GameState.settings.fullscreen = isFullscreen();
    });
    let commaCheckbox = addCheckbox({
      pos: vec2(-144, fullscreenCheckbox.pos.y + 60),
      name: "commaCheckbox",
      checked: GameState.settings.commaInsteadOfDot,
      onCheck: function() {
        GameState.settings.commaInsteadOfDot = !GameState.settings.commaInsteadOfDot;
        return GameState.settings.commaInsteadOfDot;
      },
      title: "Use commas for\ndecimals",
      titleSize: 40
    }, otherCheckboxesBg);
    otherButtonsBg = winParent.add([
      rect(winParent.width - 25, 55, { radius: 10 }),
      pos(0, 203),
      color(BLACK),
      opacity(0.25),
      anchor("top")
    ]);
    addDeleteSaveButton(otherButtonsBg, winParent);
    winParent.on("close", () => {
      checkForFullscreen.cancel();
    });
  }

  // source/game/windows/ascendWindow.ts
  var objectsPositions = {
    mage_hidden: 450,
    mage_visible: 30,
    cursors_hidden: 470,
    cursors_visible: 26
  };
  function addWinMage(position, parent) {
    let winMage = parent.add([
      pos(position),
      anchor("center"),
      waver({ maxAmplitude: 2 })
    ]);
    let body2 = winMage.add([
      sprite("winMage_body"),
      anchor("center")
    ]);
    let eye = winMage.add([
      sprite("winMage_eye"),
      anchor("center")
    ]);
    let cursors = parent.add([
      sprite("winMage_cursors"),
      anchor("center"),
      pos(),
      waver({ maxAmplitude: 3 })
    ]);
    return {
      mage: winMage,
      cursors
    };
  }
  function ascendWinContent(winParent) {
    let manaText = winParent.add([
      text("", {
        size: 40,
        align: "left"
      }),
      anchor("left"),
      color(WHITE),
      pos(-182, -189),
      area(),
      {
        update() {
          let scoreTilNextMana = formatNumber(Math.round(scoreManager.scoreYouGetNextManaAt()) - Math.round(GameState.scoreAllTime));
          let text2 = [
            // TODO: make it so it shows how much mana you've  gotten since the run started
            `${GameState.ascension.mana}\u2726`,
            `Score 'til next mana: ${scoreTilNextMana}`,
            `+${GameState.ascension.magicLevel}MG`
          ].join("\n");
          this.text = text2;
        }
      }
    ]);
    let button = winParent.add([
      text("ASCEND!!!", {
        size: 20,
        align: "center",
        font: "lambdao"
      }),
      anchor("center"),
      color(WHITE),
      pos(0, -100),
      area(),
      opacity(),
      {
        update() {
          if (GameState.ascension.mana < 1)
            this.opacity = 0.5;
          else
            this.opacity = 1;
        }
      }
    ]);
    let manaBarContent = null;
    let barFrame = winParent.add([
      rect(winParent.width, winParent.height / 12, { fill: false, radius: 5 }),
      pos(0, 0),
      anchor("center"),
      opacity(1),
      outline(3.5, BLACK),
      z(1)
    ]);
    let barFrameBg = winParent.onDraw(() => {
      drawRect({
        pos: barFrame.pos,
        anchor: barFrame.anchor,
        width: barFrame.width,
        height: barFrame.height,
        opacity: barFrame.opacity * 0.28,
        radius: 5,
        color: BLACK
      });
    });
    barFrame.onDestroy(() => {
      barFrameBg.cancel();
    });
    manaBarContent = winParent.add([
      rect(0, barFrame.height, { radius: 5 }),
      pos(-barFrame.width / 2, barFrame.pos.y),
      anchor("left"),
      color(WHITE),
      opacity(1),
      z(barFrame.z - 1),
      {
        update() {
          let scoreTilNextMana = Math.round(scoreManager.scoreYouGetNextManaAt() - GameState.scoreAllTime);
          let mappedWidth = map(scoreTilNextMana, 0, GameState.scoreAllTime + scoreManager.scoreYouGetNextManaAt(), barFrame.width, 0);
          this.width = lerp(this.width, mappedWidth, 0.5);
          const lighter = rgb(178, 208, 247);
          const darker = rgb(100, 157, 232);
          this.color.r = wave(lighter.r, darker.r, time() * 2);
          this.color.g = wave(lighter.g, darker.g, time() * 2);
          this.color.b = wave(lighter.b, darker.b, time() * 2);
        }
      }
    ]);
    button.onClick(() => {
      if (isHoveringAPowerup == true)
        return;
      if (GameState.ascension.mana >= 1)
        triggerAscension();
    });
    let manaGainedCheck = ROOT.on("manaGained", () => {
    });
    let masked = winParent.add([
      mask("intersect"),
      anchor("center"),
      pos(),
      rect(winParent.width, winParent.height)
    ]);
    let winMageFull = addWinMage(vec2(0, 450), masked);
    let winMage = winMageFull.mage;
    let winMageCursors = winMageFull.cursors;
    winMageCursors.use(positionSetter()), tween(objectsPositions.mage_hidden, objectsPositions.mage_visible, 0.6, (p) => winMage.pos.y = p, easings.easeOutQuint).onEnd(() => {
      winMage.wave_verPosition = objectsPositions.mage_visible;
    });
    wait(0.2, () => {
      tween(objectsPositions.cursors_hidden, objectsPositions.cursors_visible, 0.5, (p) => winMageCursors.pos.y = p, easings.easeOutBack).onEnd(() => {
      });
    });
    winParent.on("close", () => {
      manaGainedCheck.cancel();
    });
  }

  // source/game/windows/extraWindow.ts
  var gridContainer;
  var currentClosest;
  function updateClosestMinibuttonToDrag() {
    const minibuttons = get("minibutton").filter((minibutton) => !minibutton.extraMb);
    let closestDistance = Infinity;
    let closestMinibutton = null;
    minibuttons.forEach((minibutton) => {
      const dist = curDraggin?.screenPos().dist(minibutton.screenPos());
      if (dist < closestDistance) {
        closestDistance = dist;
        closestMinibutton = minibutton;
      }
    });
    if (closestMinibutton !== currentClosest) {
      if (currentClosest) {
        if (currentClosest.is("closestMinibuttonToDrag")) {
          currentClosest.unuse("closestMinibuttonToDrag");
          currentClosest.opacity = 1;
          currentClosest.scale = vec2(1);
          currentClosest.color = WHITE;
          currentClosest.nervousSpinSpeed = 10;
        }
      }
      currentClosest = closestMinibutton;
      if (currentClosest) {
        if (!currentClosest.is("closestMinibuttonToDrag"))
          currentClosest.use("closestMinibuttonToDrag");
      }
    }
  }
  function makeGridMinibutton(windowKey3, gridSlot, winParent) {
    let selection;
    let distanceToSlot;
    let distanceToClosestMinibutton;
    let minibuttons;
    let closestMinibutton = null;
    let closestDistance = Infinity;
    let idx = infoForWindows[windowKey3].idx;
    let gridMiniButton = make([
      sprite(`icon_${infoForWindows[Object.keys(infoForWindows)[idx]].icon || Object.keys(infoForWindows)[idx].replace("Win", "")}`, {
        anim: "default"
      }),
      anchor("center"),
      opacity(1),
      pos(gridSlot.pos),
      color(WHITE),
      scale(0),
      drag(),
      layer("windows"),
      z(winParent.z + 1),
      area(),
      rotate(0),
      dummyShadow(),
      insideWindowHover(winParent),
      openWindowButton(),
      "gridMiniButton",
      {
        windowKey: windowKey3,
        beingHeld: false,
        releaseDrop(defaultShadow = true) {
          if (curDraggin == this) {
            curDraggin.trigger("dragEnd");
            setCurDraggin(null);
            mouse.releaseAndPlay("cursor");
            gridMiniButton.layer = "windows";
            let thisThing = this;
            const goToShadowSlot = function() {
              let gridMinibuttonIdx = infoForWindows[thisThing.windowKey].idx;
              destroy(thisThing);
              gridContainer.add(makeGridMinibutton(windowKey3, get(`gridShadow_${gridMinibuttonIdx}`, { recursive: true })[0], winParent));
              playSfx("plop");
              get("minibutton").forEach((element) => {
                tween(element.angle, 0, 0.32, (p) => element.angle = p, easings.easeOutQuint);
                element.color = WHITE;
                element.opacity = 1;
                element.scale = vec2(1);
              });
              get("gridMiniButton", { recursive: true }).forEach((element) => {
                if (element.isHovering())
                  element.startHoverFunction();
              });
            };
            const goToTaskbar = function() {
              let newMinibutton = addMinibutton({
                windowKey: thisThing.windowKey,
                taskbarIndex: closestMinibutton.taskbarIndex,
                initialPosition: thisThing.pos,
                destPosition: closestMinibutton.pos
              });
              GameState.taskbar[closestMinibutton.taskbarIndex] = thisThing.windowKey;
              tween(closestMinibutton.opacity, 0, 0.32, (p) => closestMinibutton.opacity = p, easings.easeOutQuint);
              tween(closestMinibutton.scale, vec2(0), 0.32, (p) => closestMinibutton.scale = p, easings.easeOutQuint).onEnd(() => {
                destroy(closestMinibutton);
              });
              destroy(thisThing);
              let cmbShadow = get(`gridShadow`, { recursive: true }).filter((cmb) => cmb.windowKey == closestMinibutton.windowKey)[0];
              gridContainer.add(makeGridMinibutton(closestMinibutton.windowKey, cmbShadow, winParent));
              playSfx("plop");
              get("minibutton").forEach((minibutton) => {
                tween(minibutton.angle, 0, 0.15, (p) => minibutton.angle = p, easings.easeOutQuint);
              });
            };
            if (distanceToSlot < distanceToClosestMinibutton || defaultShadow == true)
              goToShadowSlot();
            else
              goToTaskbar();
          }
        }
      }
    ]);
    tween(gridMiniButton.scale, vec2(1), 0.32, (p) => gridMiniButton.scale = p, easings.easeOutElastic);
    gridMiniButton.onUpdate(() => {
      if (gridMiniButton.dragging) {
        closestMinibutton = null;
        closestDistance = Infinity;
        minibuttons = get("minibutton").filter((minibutton) => !minibutton.extraMb);
        minibuttons.forEach((minibutton) => {
          const distance = gridMiniButton.screenPos().dist(minibutton.pos);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestMinibutton = minibutton;
          }
        });
        distanceToSlot = gridMiniButton.screenPos().dist(gridSlot.screenPos());
        distanceToClosestMinibutton = gridMiniButton.screenPos().dist(closestMinibutton.screenPos());
      }
    });
    gridMiniButton.startingHover(() => {
      playSfx("hoverMiniButton", { detune: 100 * idx / 4 });
      gridMiniButton.play("hover");
      selection = gridSlot.add([
        pos(),
        rect(gridMiniButton.width, gridMiniButton.height, { radius: 5 }),
        opacity(0.15),
        anchor("center"),
        "gridMinibuttonSelection"
      ]);
    });
    gridMiniButton.endingHover(() => {
      gridMiniButton.play("default");
      tween(gridMiniButton.angle, 0, 0.32, (p) => gridMiniButton.angle = p, easings.easeOutQuint);
      selection?.destroy();
    });
    gridMiniButton.onPress(() => {
      if (get(gridMiniButton.windowKey)[0])
        winParent.close();
      else {
        openWindow2(gridMiniButton.windowKey);
        winParent.close();
      }
      bop(gridMiniButton);
    });
    gridMiniButton.onHold(() => {
      get("gridMinibuttonSelection", { recursive: true }).forEach((selection2) => {
        selection2?.destroy();
      });
      gridMiniButton.parent.children.splice(gridMiniButton.parent.children.indexOf(gridMiniButton), 1);
      gridMiniButton.parent = ROOT;
      ROOT.children.push(gridMiniButton);
      gridMiniButton.pos = toScreen(mousePos());
      gridMiniButton.z = mouse.z - 1;
      destroyExclamation(gridMiniButton);
      gridMiniButton.layer = "mouse";
      mouse.grab();
      gridMiniButton.pick();
      playSfx("plap");
    });
    gridMiniButton.onHoldRelease(() => {
      gridMiniButton.releaseDrop(false);
    });
    return gridMiniButton;
  }
  var amountOfElementsX = 5;
  function extraWinContent(winParent) {
    gridContainer = winParent.add([pos(-154, -192)]);
    for (let i2 = 0; i2 < Object.keys(infoForWindows).length - 1; i2++) {
      let windowKey3 = Object.keys(infoForWindows)[i2];
      let buttonPositionX = 0;
      let buttonPositionY = 0;
      if (i2 < amountOfElementsX)
        buttonPositionX = 1 + i2 * 75;
      else
        buttonPositionX = 1 + (i2 - amountOfElementsX) * 75 + 75 / amountOfElementsX;
      if (i2 < amountOfElementsX)
        buttonPositionY = 0;
      else
        buttonPositionY = buttonSpacing + 10;
      let shadowOne = gridContainer.add([
        sprite(`icon_${infoForWindows[windowKey3].icon || windowKey3.replace("Win", "")}`, {
          anim: "default"
        }),
        anchor("center"),
        opacity(0.5),
        pos(buttonPositionX, buttonPositionY),
        color(BLACK),
        area(),
        `gridShadow_${i2}`,
        "gridShadow",
        {
          idx: i2,
          windowKey: windowKey3
        }
      ]);
      if (!GameState.taskbar.includes(windowKey3)) {
        if (GameState.unlockedWindows.includes(windowKey3)) {
          gridContainer.add(makeGridMinibutton(windowKey3, shadowOne, winParent));
        }
      }
    }
    winParent.onUpdate(() => {
      if (curDraggin == null || !curDraggin.is("gridMiniButton"))
        return;
      updateClosestMinibuttonToDrag();
    });
    let extraMinibutton = get("extraMinibutton")[0];
    if (extraMinibutton) {
      extraMinibutton.shut = false;
      extraMinibutton.play(`open_${extraMinibutton.isHovering() ? "hover" : "default"}`);
    }
    let winUnlockEvent = ROOT.on("winUnlock", (window2) => {
    });
    winParent.on("close", () => {
      let extraMinibutton2 = get("extraMinibutton")[0];
      if (extraMinibutton2) {
        extraMinibutton2.shut = true;
        extraMinibutton2.play(`shut_${extraMinibutton2.isHovering() ? "hover" : "default"}`);
      }
      winUnlockEvent.cancel();
    });
  }

  // source/game/windows/creditsWin.ts
  function creditsWinContent(winParent) {
    winParent.add([
      pos(0, -190),
      text("Clickery Hexagon\nwas made by", {
        align: "center"
      }),
      anchor("center")
    ]);
    let credits = {
      "amyspark-ng": "Code",
      "DevkyRD": "Art & Design",
      "MF": "Code & Shaders",
      "lajbel": "Game Design",
      "Khriz28": "Playtesting & Support"
    };
    function createCredits() {
      let text2 = "";
      for (const [key, value] of Object.entries(credits)) {
        text2 += `${key} - [small]${value}[/small]
`;
      }
      return text2;
    }
    winParent.add([
      text(createCredits(), {
        align: "left",
        styles: {
          "small": {
            scale: 0.8
          }
        }
      }),
      pos(-183, -134)
    ]);
    winParent.add([
      pos(0, 120),
      text("Special thanks to", {
        align: "center"
      }),
      anchor("center")
    ]);
    let specialCredits = {
      "GGBotNet": "Lambda font",
      "niceEli": "Desktop support",
      "Webadazzz": "[heart]<3[/heart]"
    };
    function createSpecialCredits() {
      let text2 = "";
      for (const [key, value] of Object.entries(specialCredits)) {
        text2 += `${key} - ${value.includes("heart") ? value : `[small]${value}[/small]`}
`;
      }
      return text2;
    }
    winParent.add([
      text(createSpecialCredits(), {
        align: "left",
        styles: {
          "small": {
            scale: 0.8
          },
          "heart": {
            scale: 0.8,
            color: RED
          }
        }
      }),
      pos(-183, 146),
      positionSetter()
    ]);
  }

  // source/game/windows/statsWin.ts
  function statsWinContent(winParent) {
    let stats = [];
    winParent.onUpdate(() => {
      stats = [
        { "Score all time": formatNumber(GameState.scoreAllTime) },
        { "Times clicked": formatNumberSimple(GameState.stats.timesClicked) },
        { "Powerups clicked": formatNumberSimple(GameState.stats.powerupsClicked) },
        { "Powerups bought": formatNumberSimple(GameState.stats.powerupsBought) },
        { "Achievements unlocked": `${GameState.unlockedAchievements.length}/${achievements.length}` },
        { "Total time played": formatTime(Math.round(GameState.stats.totalTimePlayed), true) }
      ];
      if (GameState.stats.timesAscended > 0) {
        stats[0] = { "Score all time": formatNumber(GameState.scoreAllTime) };
        stats[1] = { "Score this run": formatNumber(GameState.scoreThisRun) };
        stats.splice(2, 0, { "Times clicked": `${formatNumberSimple(GameState.stats.timesClicked)}` });
        let ascendStatObject = { "Times ascended": `${GameState.stats.timesAscended}` };
        if (stats.indexOf(ascendStatObject) == -1)
          stats.push(ascendStatObject);
      }
    });
    let icons = winParent.add([
      pos(),
      // positionSetter(),
      anchor("top")
    ]);
    icons.onDraw(() => {
      drawSprite({
        sprite: "cursors",
        frame: 2,
        anchor: "center",
        width: 50,
        height: 45
      });
      drawSprite({
        sprite: "cursors",
        frame: 0,
        anchor: "center",
        pos: vec2(0, 40),
        width: 45,
        height: 45
      });
      drawSprite({
        sprite: "hexagon",
        anchor: "center",
        pos: vec2(0, 80),
        width: 45,
        scale: vec2(0.9),
        height: 45
      });
      drawSprite({
        sprite: "icon_medals",
        frame: 0,
        anchor: "center",
        pos: vec2(0, 160),
        width: 45,
        height: 45
      });
    });
    function createStats() {
      let text2 = stats.map((stat) => `${Object.keys(stat)[0]}: ${Object.values(stat)[0]}`).join("\n");
      return text2;
    }
    let statsText = winParent.add([
      text(createStats()),
      pos(70, -230),
      anchor("top"),
      positionSetter(),
      {
        update() {
          this.text = createStats();
          icons.pos.y = this.pos.y + 20;
          icons.pos.x = this.pos.x - this.width / 2 - 25;
        }
      }
    ]);
  }

  // source/game/windows/medalsWin.ts
  var totalColumns = 5;
  var totalRows = 7;
  var initialPos = { x: -137, y: 46 };
  var spacing = { x: 65, y: 65 };
  function getPositionInWindow(row, column) {
    return vec2(initialPos.x + spacing.x * column, initialPos.y + spacing.y * row);
  }
  function indexToGrid(i2) {
    let newDesiredPos = { row: Math.floor(i2 / totalColumns) + 1, column: i2 % totalColumns + 1 };
    return newDesiredPos;
  }
  var medalsContainer;
  function medalsWinContent(winParent) {
    medalsContainer = winParent.add([
      pos(0, -222),
      rect(winParent.width - 25, winParent.height - 35 * 2, { radius: 5 }),
      color(BLACK),
      opacity(0.5),
      anchor("top")
    ]);
    function addMedal(gridPosition, medalid) {
      let achievementInfo = getAchievement(medalid);
      let medalObj = medalsContainer.add([
        sprite("white_noise"),
        pos(),
        anchor("center"),
        layer("windows"),
        z(winParent.z + 1),
        // positionSetter(),
        area(),
        "medal",
        {
          achievementIdx: 0,
          achievementId: medalid,
          row: gridPosition.row,
          column: gridPosition.column,
          update() {
            if (!isAchievementUnlocked(this.achievementId)) {
              this.opacity = 0.25;
            } else {
              this.opacity = 1;
            }
          }
        }
      ]);
      medalObj.pos = getPositionInWindow(gridPosition.row - 1, gridPosition.column - 1);
      medalObj.achievementIdx = achievements.indexOf(getAchievement(medalid));
      if (isAchievementUnlocked(medalid)) {
        parseAnimation(medalObj, getAchievement(medalid).icon);
        medalObj.width = 60;
        medalObj.height = 60;
      } else {
        parseAnimation(medalObj, "medals.unknown");
      }
      medalObj.onClick(() => {
        if (medalObj.achievementId == "tapachievementslot") {
          if (!isAchievementUnlocked(medalObj.achievementId))
            unlockAchievement(medalObj.achievementId);
        }
      });
      medalObj.onHover(() => {
        let achievement = getAchievement(medalObj.achievementId);
        let texting;
        if (!isAchievementUnlocked(achievement.id)) {
          if (achievement.secretCondition == null)
            texting = achievement.description;
          else
            texting = "This achievement is secret\nFor now...";
        } else {
          texting = achievement.description;
        }
        let tooltip = addTooltip(medalObj, {
          text: texting,
          direction: "down",
          lerpValue: 1
          // TODO: make this just appear, it looks ugly 
        });
      });
      medalObj.onHoverEnd(() => {
        medalObj.tooltip.end();
      });
      let checkforunlock = ROOT.on("achivementUnlock", (id) => {
        if (id == medalid) {
          parseAnimation(medalObj, getAchievement(id).icon);
          medalObj.width = 60;
          medalObj.height = 60;
        }
      });
      medalObj.onDestroy(() => {
        checkforunlock.cancel();
      });
    }
    for (let i2 = 0; i2 < achievements.length; i2++) {
      if (i2 == totalColumns * totalRows)
        break;
      let medalid = achievements[i2].id;
      addMedal(indexToGrid(i2), medalid);
    }
    let scrollSpeed = 0;
    function scrollDown() {
      let allMedals = medalsContainer.get("medal");
      let sortedMedals = allMedals.sort((a, b2) => b2.achievementIdx - a.achievementIdx).reverse();
      if (sortedMedals[sortedMedals.length - 1].achievementIdx == achievements.length - 1)
        return;
      medalsContainer.get("medal").filter((medal) => medal.row == 1).forEach((medal) => {
        destroy(medal);
      });
      medalsContainer.get("medal").forEach((medal) => {
        medal.row--;
        tween(medal.pos.y, medal.pos.y - spacing.y, scrollSpeed, (p) => medal.pos.y = p, easings.easeInOutSine);
      });
      wait(scrollSpeed / 2, () => {
        let indexOfLastAchievementInList = achievements.map((achievement) => achievement.id).indexOf(medalsContainer.get("medal")[medalsContainer.get("medal").length - 1].achievementId);
        let nextMedals = achievements.map((achievement) => achievement.id).slice(indexOfLastAchievementInList + 1, achievements.map((achievement) => achievement.id).length);
        nextMedals.length = Math.min(nextMedals.length, totalColumns);
        let medalsInfo = nextMedals.map((medal) => getAchievement(medal));
        for (let i2 = 0; i2 < nextMedals.length; i2++) {
          addMedal({ row: totalRows, column: indexToGrid(indexOfLastAchievementInList + 1 + i2).column }, medalsInfo.map((achievement) => achievement.id)[i2]);
        }
      });
    }
    function scrollUp() {
      let allMedals = medalsContainer.get("medal");
      let sortedMedals = allMedals.sort((a, b2) => b2.achievementIdx - a.achievementIdx).reverse();
      if (sortedMedals[0].achievementIdx == 0)
        return;
      medalsContainer.get("medal").filter((medal) => medal.row == totalRows).forEach((medal) => {
        destroy(medal);
      });
      medalsContainer.get("medal").forEach((medal) => {
        medal.row++;
        tween(medal.pos.y, medal.pos.y + spacing.y, scrollSpeed, (p) => medal.pos.y = p, easings.easeInOutSine);
      });
      wait(scrollSpeed / 2, () => {
        let previousMedalsNames = achievementsInfo.ids.slice(0, achievementsInfo.ids.indexOf(medalsContainer.get("medal")[0].achievementId));
        let previousMedalsInfo = previousMedalsNames.map((medal) => getAchievement(medal));
        for (let i2 = 0; i2 < previousMedalsInfo.length; i2++) {
          addMedal({ row: 1, column: indexToGrid(i2).column }, previousMedalsInfo.map((achievement) => achievement.id)[i2]);
        }
      });
    }
    winParent.onKeyPress("down", () => {
      scrollDown();
    });
    winParent.onKeyPress("up", () => {
      scrollUp();
    });
    winParent.onScroll((delta) => {
      if (delta.y > 0)
        scrollDown();
      else if (delta.y < 0)
        scrollUp();
    });
  }

  // source/game/plugins/drawDamnShadow.ts
  function drawDamnShadow(xSpacing, ySpacing, theOpacity) {
    let drawEvent = null;
    const theColor = BLACK;
    return {
      id: "damnShadow",
      require: ["anchor"],
      disableShadow: false,
      add() {
        let drawingShadow = () => {
          if (this.disableShadow == true)
            return;
          if (this.is("sprite")) {
            drawSprite({
              sprite: this.sprite,
              pos: vec2(this.pos.x + xSpacing, this.pos.y + ySpacing),
              opacity: theOpacity,
              color: theColor,
              anchor: this.anchor,
              scale: this.scale,
              angle: this.angle
            });
          } else if (this.is("text")) {
            drawText({
              text: this.text,
              font: this.font,
              align: this.align,
              size: this.textSize,
              pos: vec2(this.pos.x + xSpacing, this.pos.y + ySpacing),
              opacity: theOpacity,
              color: theColor,
              anchor: this.anchor,
              scale: this.scale,
              angle: this.angle
            });
          } else if (this.is("rect")) {
            drawRect({
              width: this.width,
              height: this.height,
              radius: this.radius,
              pos: vec2(this.pos.x + xSpacing, this.pos.y + ySpacing),
              opacity: theOpacity,
              color: theColor,
              anchor: this.anchor,
              scale: this.scale,
              angle: this.angle
            });
          }
        };
        drawEvent = this.parent.onDraw(drawingShadow);
      },
      destroy() {
        drawEvent.cancel();
        drawEvent = null;
      }
    };
  }

  // source/game/windows/color/colorWindowElements.ts
  var SLIDER_HANDLE_LERP = 0.2;
  var sliderColors = {
    red: { full: [255, 60, 60], dull: [245, 119, 119] },
    green: { full: [68, 255, 74], dull: [133, 243, 136] },
    blue: { full: [60, 121, 255], dull: [126, 163, 243] },
    alpha: { full: [48, 48, 48], dull: [118, 118, 118] }
  };
  function keyToName(key) {
    switch (key) {
      case "r":
        return "red";
      case "g":
        return "green";
      case "b":
        return "blue";
      case "a":
        return "alpha";
    }
  }
  function addSlider(opts) {
    opts.parent = opts.parent || ROOT;
    let value = opts.value;
    let previousValue = value;
    let winParent = opts.parent;
    opts.parent.onUpdate(() => winParent = opts.parent);
    let fullColor = Color.fromArray(sliderColors[opts.color].full);
    let dullColor = Color.fromArray(sliderColors[opts.color].dull);
    const triggerOnValueChange = () => {
      if (opts.onValueChange && value !== previousValue) {
        opts.onValueChange(value);
        previousValue = value;
      }
    };
    let content = winParent.add([
      rect(winParent.width - 40, 18, { radius: 10 }),
      color(),
      pos(opts.pos),
      anchor("left"),
      area(),
      drawDamnShadow(2, 2, 0.5),
      {
        update() {
          let blendFactor = map(value, opts.range[0], opts.range[1], 0, 1);
          let color2 = blendColors(dullColor, fullColor, blendFactor);
          this.color = color2;
          triggerOnValueChange();
        }
      }
    ]);
    let leftSideOfContent = content.pos.x;
    let rightSideOfContent = content.pos.x + content.width;
    let button = winParent.add([
      sprite("hexColorHandle"),
      anchor("center"),
      rotate(0),
      pos(0, content.pos.y),
      area(),
      scale(),
      drag(true),
      insideWindowHover(winParent),
      drawDamnShadow(2, 2, 0.5),
      {
        update() {
          this.pos.y = content.pos.y;
          if (this.dragging === true) {
            value = map(this.pos.x, leftSideOfContent, rightSideOfContent, opts.range[0], opts.range[1]);
          } else {
            let mappedPos = map(value, opts.range[0], opts.range[1], leftSideOfContent, rightSideOfContent);
            this.pos.x = lerp(this.pos.x, mappedPos, SLIDER_HANDLE_LERP);
          }
          value = clamp(value, opts.range[0], opts.range[1]);
          this.pos.x = clamp(this.pos.x, leftSideOfContent, rightSideOfContent);
          let mappedAngle = map(value, opts.range[0], opts.range[1], 0, 360);
          this.angle = lerp(this.angle, mappedAngle, SLIDER_HANDLE_LERP);
          let mappedColor = content.color.darken(5);
          this.color = mappedColor;
          triggerOnValueChange();
        },
        releaseDrop() {
          curDraggin?.trigger("dragEnd");
          setCurDraggin(null);
        }
      }
    ]);
    button.startingHover(() => {
      tween(vec2(1), vec2(1.2), 0.15, (p) => button.scale = p);
      mouse.play("point");
    });
    button.endingHover(() => {
      tween(vec2(1.2), vec2(1), 0.15, (p) => button.scale = p);
      mouse.play("cursor");
    });
    button.onClick(() => {
      if (!winParent.active)
        return;
      button.pick();
      mouse.grab();
      winParent.canClose = false;
    });
    button.onMouseRelease(() => {
      if (!winParent.active)
        return;
      if (button.isBeingHovered == false)
        return;
      button.releaseDrop();
      if (button.isHovering() == true) {
        button.startHoverFunction();
        mouse.releaseAndPlay("point");
      } else {
        mouse.releaseAndPlay("cursor");
        button.endHoverFunction();
      }
      winParent.canClose = true;
    });
    content.onClick(() => {
      if (button.isBeingHovered == true)
        return;
      let mappedValue = map(mousePos().x, content.screenPos().x, content.screenPos().x + content.width, opts.range[0], opts.range[1]);
      value = clamp(mappedValue, opts.range[0], opts.range[1]);
    });
    return {
      sliderContent: content,
      sliderButton: button,
      value,
      range: [opts.range[0], opts.range[1]],
      setValue: (newValue) => {
        value = newValue;
        triggerOnValueChange();
      }
    };
  }
  function playSliderSound(value) {
    if (Math.round(value) % 2 == 0) {
      let mappedDetune = map(value, 0, 255, -100, 100);
      playSfx("hoverMiniButton", { detune: mappedDetune });
    }
  }
  function addDefaultButton(position, parent, sliders, defaultValues) {
    parent = parent || ROOT;
    let winParent = parent.parent;
    let defaultButton = parent.add([
      sprite("defaultButton"),
      pos(position),
      area(),
      color(),
      scale(),
      anchor("center"),
      drawDamnShadow(2, 2, 0.5)
    ]);
    defaultButton.onClick(() => {
      if (!winParent.active)
        return;
      bop(defaultButton);
      playSfx("clickButton", { detune: rand(-50, 50) });
      for (let i2 = 0; i2 < sliders.length; i2++) {
        sliders[i2].setValue(defaultValues[i2]);
      }
    });
    return defaultButton;
  }
  function addRandomButton(position, parent, sliders) {
    parent = parent || ROOT;
    let winParent = parent.parent;
    let randomButton = parent.add([
      sprite("randomButton"),
      pos(position),
      area(),
      anchor("center"),
      color(),
      scale(),
      drawDamnShadow(2, 2, 0.5)
    ]);
    randomButton.onClick(() => {
      if (!winParent.active)
        return;
      bop(randomButton);
      playSfx("clickButton", { detune: rand(-50, 50) });
      sliders.forEach((slider) => {
        let randomValue = rand(slider.range[0], slider.range[1]);
        slider.setValue(randomValue);
      });
    });
    return randomButton;
  }
  function addNumbers(position, parent, objSaveColor) {
    parent = parent || ROOT;
    let numberStyles = {};
    let names = Object.keys(objSaveColor).map((color2) => keyToName(color2));
    names.forEach((colorName) => {
      numberStyles[`${colorName}`] = {
        color: Color.fromArray(sliderColors[colorName].full)
      };
    });
    function formatRgb(value) {
      return value.toFixed(0).padStart(3, "0");
    }
    let numbers = parent.add([
      text("000 000 000", {
        styles: numberStyles
      }),
      pos(position),
      anchor("left"),
      drawDamnShadow(2, 2, 0.5),
      {
        update() {
          let stuff = [];
          if (isNaN(objSaveColor.a) == true)
            delete objSaveColor.a;
          Object.keys(objSaveColor).forEach((colorKey, index) => {
            if (colorKey == "a") {
              stuff[index] = `[${names[index]}]${formatRgb(objSaveColor[colorKey] * 100)}[/${names[index]}]`;
            } else {
              stuff[index] = `[${names[index]}]${formatRgb(objSaveColor[colorKey])}[/${names[index]}]`;
            }
          });
          this.text = stuff.join(" ");
        }
      }
    ]);
    return numbers;
  }

  // source/game/windows/color/hexColorWindow.ts
  function hexColorWinContent(winParent) {
    let redslider = addSlider({
      parent: winParent,
      pos: vec2(-180, -66),
      value: GameState.settings.hexColor.r,
      range: [0, 255],
      color: "red",
      onValueChange: (value) => {
        hexagon.color.r = value;
        GameState.settings.hexColor.r = value;
        playSliderSound(value);
      }
    });
    let greenslider = addSlider({
      parent: winParent,
      pos: vec2(-180, -15),
      value: GameState.settings.hexColor.g,
      range: [0, 255],
      color: "green",
      onValueChange: (value) => {
        hexagon.color.g = value;
        GameState.settings.hexColor.g = value;
        playSliderSound(value);
      }
    });
    let blueslider = addSlider({
      parent: winParent,
      pos: vec2(-180, 38),
      value: GameState.settings.hexColor.b,
      range: [0, 255],
      color: "blue",
      onValueChange: (value) => {
        hexagon.color.b = value;
        GameState.settings.hexColor.b = value;
        playSliderSound(value);
      }
    });
    let sliders = [redslider, greenslider, blueslider];
    let controlBar = winParent.add([
      rect(winParent.width - 40, 60, { radius: 10 }),
      anchor("top"),
      pos(0, 70),
      color(BLACK),
      opacity(0.25)
    ]);
    let defaultButton = addDefaultButton(vec2(-135, 29), controlBar, sliders, [255, 255, 255]);
    let randomButton = addRandomButton(vec2(-66, 29), controlBar, sliders);
    let rgbaNumbers = addNumbers(vec2(-18, 29), controlBar, GameState.settings.hexColor);
    winParent.onUpdate(() => {
      winParent.color = hexagon.color.lighten(50);
    });
  }

  // source/game/windows/color/bgColorWindow.ts
  function bgColorWinContent(winParent) {
    let redslider = addSlider({
      parent: winParent,
      pos: vec2(-180, -98),
      value: GameState.settings.bgColor.r,
      range: [0, 255],
      color: "red",
      onValueChange: (value) => {
        gameBg.color.r = value;
        GameState.settings.bgColor.r = value;
        playSliderSound(value);
      }
    });
    let greenslider = addSlider({
      parent: winParent,
      pos: vec2(-180, redslider.sliderContent.pos.y + 55),
      value: GameState.settings.bgColor.g,
      range: [0, 255],
      color: "green",
      onValueChange: (value) => {
        gameBg.color.g = value;
        GameState.settings.bgColor.g = value;
        let mappedValue = map(value, 0, 1, 0, 255);
        playSliderSound(mappedValue);
      }
    });
    let blueslider = addSlider({
      parent: winParent,
      pos: vec2(-180, greenslider.sliderContent.pos.y + 55),
      value: GameState.settings.bgColor.b,
      range: [0, 255],
      color: "blue",
      onValueChange: (value) => {
        gameBg.color.b = value;
        GameState.settings.bgColor.b = value;
        playSliderSound(value);
      }
    });
    let alphaslider = addSlider({
      parent: winParent,
      pos: vec2(-180, blueslider.sliderContent.pos.y + 55),
      value: GameState.settings.bgColor.a,
      range: [0, 1],
      color: "alpha",
      onValueChange: (value) => {
        gameBg.color.a = value;
        GameState.settings.bgColor.a = value;
        playSliderSound(value);
      }
    });
    let sliders = [redslider, greenslider, blueslider, alphaslider];
    let controlBar = winParent.add([
      rect(winParent.width - 20, 60, { radius: 10 }),
      anchor("left"),
      pos(-winParent.width / 2 + 10, 125),
      color(BLACK),
      opacity(0.25)
    ]);
    let defaultButton = addDefaultButton(vec2(38, 0), controlBar, sliders, [0, 0, 0, 0.84]);
    let randomButton = addRandomButton(vec2(98, 0), controlBar, sliders);
    let rgbaNumbers = addNumbers(vec2(130, 0), controlBar, GameState.settings.bgColor);
    winParent.onUpdate(() => {
      winParent.color = blendColors(WHITE, gameBg.color.lighten(50), gameBg.color.a);
    });
  }

  // source/game/windows/windows-api/windowManaging.ts
  var infoForWindows = {};
  var allObjWindows = {
    isHoveringAWindow: false,
    isDraggingAWindow: false
  };
  var buttonSpacing = 75;
  function deactivateAllWindows() {
    get("window").filter((window2) => window2.active == true).forEach((element) => {
      element.deactivate();
    });
  }
  function manageWindow(windowKey3) {
    if (!infoForWindows.hasOwnProperty(windowKey3))
      throw new Error("No such window for: " + windowKey3);
    let maybeWindow = get(windowKey3).filter((obj) => !obj.is("minibutton"))[0];
    if (maybeWindow) {
      if (maybeWindow.is("window")) {
        maybeWindow.close();
      }
    } else {
      maybeWindow = openWindow2(windowKey3);
    }
    return maybeWindow;
  }
  function windowsDefinition() {
    infoForWindows = {
      "storeWin": { idx: 0, content: storeWinContent, lastPos: vec2(264, 285) },
      "musicWin": { idx: 1, content: musicWinContent, lastPos: vec2(208, 96) },
      "ascendWin": { idx: 2, content: ascendWinContent, lastPos: vec2(center().x, center().y) },
      "statsWin": { idx: 3, content: statsWinContent, lastPos: vec2(center().x, center().y) },
      "medalsWin": { idx: 4, content: medalsWinContent, lastPos: vec2(center().x, center().y) },
      "creditsWin": { idx: 5, content: creditsWinContent, lastPos: vec2(center().x, center().y) },
      "settingsWin": { idx: 6, content: settingsWinContent, lastPos: vec2(center().x, center().y) },
      "leaderboardsWin": { idx: 7, content: emptyWinContent, lastPos: vec2(center().x, center().y) },
      "hexColorWin": { idx: 8, content: hexColorWinContent, lastPos: vec2(208, 160) },
      "bgColorWin": { idx: 9, content: bgColorWinContent, lastPos: vec2(width() - 200, 200) },
      "extraWin": { idx: 10, icon: "extra", content: extraWinContent, lastPos: center() }
    };
  }
  function addXButton(windowParent) {
    let xButton = windowParent.add([
      text("X", {
        font: "lambda"
      }),
      color(WHITE),
      pos(),
      anchor("center"),
      insideWindowHover(windowParent),
      z(windowParent.z + 1),
      area({ scale: vec2(1.8, 1.1), offset: vec2(-5, 0) }),
      "xButton",
      {
        add() {
          let offset = vec2(-18, 23);
          this.pos.x += windowParent.width / 2;
          this.pos.y -= windowParent.height / 2;
          this.pos = this.pos.add(offset);
        }
      }
    ]);
    xButton.startingHover(() => {
      xButton.color = RED;
    });
    xButton.endingHover(() => {
      xButton.color = WHITE;
    });
    xButton.onClick(() => {
      if (!windowParent.active) {
        if (!allObjWindows.isDraggingAWindow && !get("window").some((window2) => window2.isHovering() && window2 != windowParent)) {
          windowParent.close();
        }
      } else
        windowParent.close();
    });
    return xButton;
  }
  function openWindow2(windowKey3) {
    if (!infoForWindows.hasOwnProperty(windowKey3))
      throw new Error(`No such window for: ${windowKey3}`);
    playSfx("openWin");
    let windowObj = add([
      sprite(getSprite(windowKey3) ? windowKey3 : "dumbTestWin"),
      pos(infoForWindows[windowKey3].lastPos),
      anchor("center"),
      opacity(1),
      scale(1),
      layer("windows"),
      z(0),
      drag(),
      area({ scale: vec2(1.05, 1) }),
      "window",
      `${windowKey3}`,
      {
        idx: infoForWindows[windowKey3].idx,
        windowKey: windowKey3,
        active: true,
        xButton: null,
        canClose: true,
        close() {
          this.trigger("close");
          this.removeAll();
          this.unuse("window");
          this.active = false;
          playSfx("closeWin");
          tween(this.scale, vec2(0.9), 0.32, (p) => this.scale = p, easings.easeOutQuint);
          tween(this.opacity, 0, 0.32, (p) => this.opacity = p, easings.easeOutQuint).then(() => {
            destroy(this);
          });
          folderObj.trigger("winClose");
          infoForWindows[windowKey3].lastPos = this.pos;
        },
        releaseDrop() {
          if (curDraggin && curDraggin == this) {
            curDraggin.trigger("dragEnd");
            setCurDraggin(null);
            mouse.releaseAndPlay("cursor");
          }
        },
        activate() {
          this.active = true;
          this.trigger("activate");
          if (!this.is("shader"))
            return;
          this.unuse("shader");
          this.get("*", { recursive: true }).forEach((obj) => {
            obj.unuse("shader");
          });
          this.get("*").filter((obj) => obj.is("insideHover") && obj.isHovering() == true && obj.isBeingHovered == false).forEach((obj) => {
            obj.startHoverFunction();
          });
        },
        deactivate() {
          this.active = false;
          this.trigger("deactivate");
          if (this.is("shader"))
            return;
          this.use(shader("grayscale"));
          this.get("*", { recursive: true }).forEach((obj) => {
            obj.use(shader("grayscale"));
          });
          let objsWithHover = this.get("*").filter((obj) => obj.is("insideHover") && obj.isBeingHovered == true);
          objsWithHover.forEach((obj) => {
            obj.endHoverFunction();
          });
        },
        isMouseInClickingRange() {
          let condition = mouse.pos.y >= getPositionOfSide(this).top && mouse.pos.y <= getPositionOfSide(this).top + 25;
          return condition;
        },
        isMouseInRange() {
          return this.hasPoint(mouse.pos);
        },
        update() {
          this.pos.x = clamp(this.pos.x, -151, 1180);
          this.pos.y = clamp(this.pos.y, this.height / 2, height() + this.height / 2 - 36);
        }
      }
    ]);
    infoForWindows[windowKey3].lastPos.x = clamp(infoForWindows[windowKey3].lastPos.x, 196, 827);
    infoForWindows[windowKey3].lastPos.y = clamp(infoForWindows[windowKey3].lastPos.y, height() - windowObj.height / 2, -windowObj.height / 2);
    windowObj.pos = infoForWindows[windowKey3].lastPos;
    windowObj.onHover(() => {
      query({
        include: ["outsideHover", "insideHover"],
        includeOp: "or",
        hierarchy: "descendants"
      }).forEach((obj) => {
        obj.trigger("cursorEnterWindow", windowObj);
      });
    });
    windowObj.onHoverEnd(() => {
      query({
        include: ["outsideHover", "insideHover"],
        includeOp: "or",
        hierarchy: "descendants"
      }).forEach((obj) => {
        obj.trigger("cursorExitWindow", windowObj);
      });
    });
    windowObj.xButton = addXButton(windowObj);
    windowObj.onClick(() => {
      if (!windowObj.is("window"))
        return;
      if (!windowObj.xButton.isHovering()) {
        if (curDraggin) {
          return;
        }
        for (const window2 of get("window").reverse()) {
          if (window2.isMouseInRange()) {
            if (window2.isMouseInClickingRange()) {
              mouse.grab();
              window2.pick();
            }
            if (window2.active == false) {
              wait(0.01, () => {
                deactivateAllWindows();
                window2.activate();
              });
            }
            break;
          }
        }
      }
    });
    windowObj.onMouseRelease(() => {
      if (windowObj.dragging)
        windowObj.releaseDrop();
    });
    windowObj.onKeyPress("escape", () => {
      if (windowObj.canClose == true && windowObj.active && curDraggin != windowObj && !(windowObj.is("extraWin") && curDraggin?.is("gridMiniButton")))
        windowObj.close();
    });
    deactivateAllWindows();
    windowObj.activate();
    infoForWindows[windowKey3].content(windowObj, windowKey3);
    tween(0, 1, 0.32, (p) => windowObj.opacity = p, easings.easeOutQuint);
    tween(vec2(0.8), vec2(1), 0.32, (p) => windowObj.scale = p, easings.easeOutQuint);
    let correspondingMinibutton = get("minibutton").filter((minibutton) => minibutton.windowKey === windowKey3)[0];
    if (correspondingMinibutton != null) {
      correspondingMinibutton.window = windowObj;
      if (!correspondingMinibutton.isHovering())
        bop(correspondingMinibutton);
    }
    windowObj.on("close", () => {
      if (correspondingMinibutton != null) {
        correspondingMinibutton.window = null;
        if (!correspondingMinibutton.isHovering())
          bop(correspondingMinibutton);
      }
    });
    if (GameState.taskbar.length > 3) {
      if (!isAchievementUnlocked("allwindowsontaskbar")) {
        if (get("window").length == GameState.taskbar.length) {
          let windows = [];
          get("window").forEach((window2) => {
            windows.push(window2.windowKey);
          });
          let gamestateTaskbarClone = GameState.taskbar.slice();
          const isEqual = (a, b2) => new Set(a).symmetricDifference(new Set(b2)).size == 0;
          if (isEqual(gamestateTaskbarClone, windows)) {
            unlockAchievement("allwindowsontaskbar");
          }
        }
      }
    }
    let drawShadowEvent = onDraw(() => {
      drawSprite({
        sprite: windowObj.sprite,
        // width: windowObj.width,
        // height: windowObj.height,
        pos: vec2(windowObj.pos.x, windowObj.pos.y + 4),
        scale: windowObj.scale,
        anchor: windowObj.anchor,
        color: BLACK,
        opacity: 0.5
      });
    });
    windowObj.on("close", () => {
      drawShadowEvent.cancel();
    });
    ROOT.trigger("winOpen", windowKey3);
    return windowObj;
  }
  function emptyWinContent(winParent) {
    winParent.add([
      text(`THIS WINDOW IS EMPTY
This is the ${winParent.windowKey}`, {
        align: "center"
      }),
      anchor("center")
    ]);
  }

  // source/game/additives.ts
  var gameBg;
  function addBackground() {
    gameBg = add([
      rect(width(), height()),
      pos(center()),
      anchor("center"),
      scale(8),
      color(saveColorToColor(GameState.settings.bgColor)),
      layer("background"),
      stay(),
      {
        speed: 0.1,
        movAngle: 5,
        uScale: 2,
        col1D: rgb(128, 128, 128),
        col2D: rgb(190, 190, 190),
        update() {
          if (getSceneName() != "gamescene")
            return;
          if (!isWindowUnlocked("bgColorWin"))
            return;
          if (isMousePressed("right")) {
            if (!hexagon?.isHovering() && !get("folderObj")[0]?.isHovering() && !get("minibutton")[0]?.isHovering() && !get("window")[0]?.isHovering() && !allObjWindows.isDraggingAWindow) {
              manageWindow("bgColorWin");
            }
          }
        }
      }
    ]);
    gameBg.color.a = GameState.settings.bgColor.a;
    gameBg.use(shader("checkeredBg", () => ({
      "u_time": time() / 10,
      "u_color1": blendColors(gameBg.col1D, gameBg.color, gameBg.color.a),
      "u_color2": blendColors(gameBg.col2D, gameBg.color, gameBg.color.a),
      "u_speed": vec2(-1, 2).scale(gameBg.speed),
      "u_angle": gameBg.movAngle,
      "u_scale": gameBg.uScale,
      "u_aspect": width() / height()
    })));
  }
  var mouse;
  function addMouse() {
    mouse = add([
      sprite("cursors"),
      pos(mousePos()),
      color(WHITE),
      stay(),
      anchor(vec2(-0.5, -0.65)),
      fixed(),
      layer("mouse"),
      z(0),
      {
        intro: false,
        speed: 5e3,
        // 5000 is the optimal for actual mouse movement
        grabbing: false,
        grab() {
          this.grabbing = true;
          mouse.play("grab");
        },
        releaseAndPlay(newAnim) {
          this.grabbing = false;
          mouse.play(newAnim);
        },
        update() {
          this.pos = mousePos();
        }
      }
    ]);
  }
  var maxLogs = 100;
  var toastQueue2 = [];
  var initialYPosition = 50;
  function addToast(opts) {
    function actuallyAddToast(idx, opt) {
      let logs2 = get("toast", { recursive: true });
      let yOffset = initialYPosition;
      for (let i2 = 0; i2 < idx; i2++) {
        yOffset += logs2[i2].height + 10;
      }
      let toastBg = add([
        rect(0, 0, { radius: [0, 10, 10, 0] }),
        pos(-200, yOffset),
        anchor("top"),
        color(WHITE.darken(50)),
        area(),
        fixed(),
        layer("logs"),
        z(0),
        timer(),
        "toast",
        {
          index: idx,
          type: opts.type,
          add() {
            if (this.type == "achievement") {
              playSfx("unlockachievement", { detune: this.index * 100 });
            } else if (this.type == "gamesaved") {
              playSfx("gamesaved", { detune: rand(0, 30) });
            }
          },
          close() {
            wait(0.7).onEnd(() => this.trigger("closed"));
            tween(toastBg.pos.x, -toastBg.width, 0.8, (p) => toastBg.pos.x = p, easings.easeOutQuint).onEnd(() => {
              destroy(toastBg);
              processQueue();
            });
          }
        }
      ]);
      let drawToastShadow = onDraw(() => {
        drawRect({
          pos: vec2(toastBg.pos.x, toastBg.pos.y + 5),
          width: toastBg.width,
          anchor: toastBg.anchor,
          height: toastBg.height,
          radius: toastBg.radius,
          opacity: 0.5,
          fixed: true,
          color: BLACK
        });
      });
      toastBg.height = opts.icon ? 80 : 100;
      toastBg.onClick(() => {
        toastBg.close();
      });
      let icon = add([
        sprite("white_noise"),
        anchor("center"),
        pos(toastBg.pos.x - toastBg.width / 2 + 50, toastBg.pos.y),
        fixed(),
        layer("logs"),
        z(toastBg.z + 1),
        {
          update() {
            this.pos.x = toastBg.pos.x - toastBg.width / 2 + 50;
            this.pos.y = toastBg.pos.y + toastBg.height / 2;
          }
        }
      ]);
      parseAnimation(icon, opts.icon);
      icon.width = 60;
      icon.height = 60;
      let titleText = add([
        text(opts.title, {
          font: "lambda",
          size: 40,
          align: "left",
          width: 500
        }),
        pos(icon.pos.x + icon.width / 2 + 10, toastBg.pos.y - toastBg.height / 2),
        fixed(),
        color(BLACK),
        layer("logs"),
        z(toastBg.z + 1),
        {
          update() {
            this.pos.x = icon.pos.x + icon.width / 2 + 10;
            this.pos.y = toastBg.pos.y + 5;
          }
        }
      ]);
      let bodyText = add([
        text(opts.body, {
          font: "lambda",
          size: 20,
          align: "left",
          width: 500
        }),
        pos(titleText.pos.x, titleText.pos.y + titleText.height),
        fixed(),
        color(BLACK),
        layer("logs"),
        z(toastBg.z + 1),
        {
          update() {
            this.pos.x = titleText.pos.x;
            this.pos.y = titleText.pos.y + titleText.height;
          }
        }
      ]);
      toastBg.width = icon.width + 20;
      toastBg.height = icon.height + 20;
      let titleTextWidth = formatText({ text: titleText.text, size: titleText.textSize }).width;
      let bodyTextWidth = formatText({ text: bodyText.text, size: bodyText.textSize }).width;
      titleTextWidth = clamp(titleTextWidth, 0, 500);
      bodyTextWidth = clamp(bodyTextWidth, 0, 500);
      if (titleTextWidth > bodyTextWidth)
        toastBg.width += titleTextWidth + 25;
      else if (bodyTextWidth > titleTextWidth)
        toastBg.width += bodyTextWidth + 25;
      if (titleText.height > bodyText.height)
        toastBg.height = titleText.height + bodyText.height + 15;
      else
        toastBg.height += bodyText.height - titleText.height + 15;
      tween(-toastBg.width, toastBg.width / 2, 0.5, (p) => toastBg.pos.x = p, easings.easeOutQuint);
      toastBg.wait(opts.duration ?? 3, () => {
        toastBg.close();
      });
      toastBg.onDestroy(() => {
        drawToastShadow.cancel();
        icon.destroy();
        titleText.destroy();
        bodyText.destroy();
      });
      if (toastBg.type == "save")
        playSfx("gamesaved");
      else if (toastBg.type == "achievement" || toastBg.type == "window")
        playSfx("unlockachievement", { detune: toastBg.index * 100 });
      return toastBg;
    }
    let toastObj;
    function processQueue() {
      let logs2 = get("toast", { recursive: true });
      let totalHeight = logs2.reduce((sum, log) => sum + log.height + 10, 0);
      maxLogs = Math.floor(height() / totalHeight);
      while (toastQueue2.length > 0 && logs2.length < maxLogs) {
        let nextToast = toastQueue2.shift();
        let availableIndex = getAvailableIndex(logs2);
        if (availableIndex !== -1) {
          toastObj = actuallyAddToast(availableIndex, nextToast);
          logs2 = get("toast", { recursive: true });
        }
      }
    }
    function getAvailableIndex(logs2) {
      let occupiedIndices = logs2.map((log) => log.index);
      for (let i2 = 0; i2 < maxLogs; i2++) {
        if (!occupiedIndices.includes(i2)) {
          return i2;
        }
      }
      return -1;
    }
    let logs = get("toast", { recursive: true });
    if (logs.length >= maxLogs) {
      toastQueue2.push(opts);
    } else {
      let availableIndex = getAvailableIndex(logs);
      if (availableIndex !== -1) {
        toastObj = actuallyAddToast(availableIndex, opts);
      }
    }
    processQueue();
    return toastObj;
  }
  function addTooltip(obj, opts) {
    if (opts == void 0)
      opts = {};
    opts.direction = opts.direction ?? "up";
    opts.lerpValue = opts.lerpValue ?? 1;
    opts.textSize = opts.textSize ?? 20;
    opts.layer = opts.layer ?? "windows";
    opts.z = opts.z ?? 0;
    let sizeOfText = { x: 0, y: 0 };
    let offset = 10;
    let bgPos = vec2(obj.worldPos().x, obj.worldPos().y);
    let padding = 10;
    let tooltipBg = add([
      rect(sizeOfText.x, sizeOfText.y, { radius: 5 }),
      z(0),
      pos(obj.worldPos()),
      color(BLACK),
      opacity(0.95),
      opacity(),
      anchor("center"),
      layer(opts.layer),
      z(opts.z),
      "tooltip",
      {
        end: null,
        type: opts.type,
        update() {
          switch (opts.direction) {
            case "up":
              bgPos.y = obj.worldPos().y - obj.height / 2 - offset;
              bgPos.x = obj.worldPos().x;
              break;
            case "down":
              bgPos.y = obj.worldPos().y + obj.height / 2 + offset;
              bgPos.x = obj.worldPos().x;
              break;
            case "left":
              this.anchor = "right";
              bgPos.x = obj.worldPos().x - obj.width / 2 - offset;
              bgPos.y = obj.worldPos().y;
              break;
            case "right":
              this.anchor = "left";
              bgPos.x = obj.worldPos().x + obj.width / 2 + offset;
              bgPos.y = obj.worldPos().y;
              break;
          }
          this.width = lerp(this.width, sizeOfText.x + padding, opts.lerpValue);
          this.height = lerp(this.height, sizeOfText.y + padding, opts.lerpValue);
          this.pos.x = lerp(this.pos.x, bgPos.x, opts.lerpValue);
          this.pos.y = lerp(this.pos.y, bgPos.y, opts.lerpValue);
        }
      }
    ]);
    let tooltipText = add([
      text(opts.text, {
        font: "lambda",
        size: opts.textSize,
        styles: {
          "red": {
            color: RED
          },
          "green": {
            color: GREEN
          }
        }
      }),
      color(WHITE),
      anchor(tooltipBg.anchor),
      opacity(),
      pos(tooltipBg.pos),
      layer(opts.layer),
      z(opts.z + 1),
      "tooltip",
      {
        bg: tooltipBg,
        update() {
          sizeOfText.x = formatText({ text: tooltipText.text, size: tooltipText.textSize }).width;
          sizeOfText.y = formatText({ text: tooltipText.text, size: tooltipText.textSize }).height;
          this.anchor = tooltipBg.anchor;
          this.layer = tooltipBg.layer;
          this.z = tooltipBg.z;
          let xPos;
          if (opts.direction == "right")
            xPos = tooltipBg.pos.x + padding / 2;
          else if (opts.direction == "left")
            xPos = tooltipBg.pos.x - padding / 2;
          else
            xPos = tooltipBg.pos.x;
          this.pos.x = xPos;
          this.pos.y = tooltipBg.pos.y;
        }
      }
    ]);
    let tooltipinfo = { tooltipBg, tooltipText, end, type: opts.type };
    if (obj.tooltip == null)
      obj.tooltip = tooltipinfo;
    function end() {
      destroy(tooltipBg);
      destroy(tooltipText);
      obj.tooltip = null;
    }
    obj.onDestroy(() => {
      end();
    });
    tooltipBg.end = end;
    return tooltipinfo;
  }

  // source/game/utils.ts
  function formatNumberSimple(value) {
    let integerStr = value.toString();
    var len = integerStr.length;
    var formatted = "";
    var breakpoint = (len - 1) % 3;
    for (let i2 = 0; i2 < len; i2++) {
      formatted += integerStr.charAt(i2);
      if (i2 % 3 === breakpoint) {
        if (i2 < len - 1)
          formatted += ".";
      }
    }
    return formatted;
  }
  var numTypes = {
    n: { small: "", large: "" },
    // just for offset apparently
    K: { small: "K", large: "Thousands" },
    M: { small: "M", large: "Millions" },
    B: { small: "B", large: "Billions" },
    T: { small: "T", large: "Trillions" },
    Qa: { small: "Qa", large: "Quadrillions" },
    Qt: { small: "Qi", large: "Quintillions" },
    St: { small: "Sx", large: "Sextillions" },
    Sp: { small: "Sp", large: "Septillions" },
    Oc: { small: "Oc", large: "Octillions" },
    Nn: { small: "No", large: "Nonillions" },
    Dc: { small: "Dc", large: "Decillions" },
    Un: { small: "Und", large: "Undecillions" },
    Du: { small: "DoD", large: "Duodecillions" },
    Te: { small: "TrD", large: "Tredecillions" },
    Qd: { small: "QaD", large: "Quattuordecillion" },
    Qu: { small: "QiD", large: "Quindecillions" },
    Sd: { small: "SxD", large: "Sexdecillions" },
    Su: { small: "SpD", large: "Septemdecillion" },
    Oe: { small: "OcD", large: "Octodecillion" },
    No: { small: "NoD", large: "Novemdecillion" },
    Ve: { small: "VgT", large: "Vigintillion" }
  };
  function formatNumber(value, opts) {
    if (opts == void 0)
      opts = {};
    opts.price = opts.price ?? false;
    opts.fullWord = opts.fullWord ?? false;
    if (opts.price && !opts.fixAmount)
      opts.fixAmount = 1;
    else
      opts.fixAmount = opts.fixAmount ?? 3;
    let returnValue = "";
    if (value < 1e3) {
      returnValue = value.toString();
    } else if (value < Math.pow(1e3, Object.keys(numTypes).length) && value > 999) {
      for (let i2 = 1; value >= Math.pow(1e3, i2); i2++) {
        let numberValue = (value / Math.pow(1e3, i2)).toFixed(opts.fixAmount);
        let suffix = (opts.fullWord == true ? " " : "") + numTypes[Object.keys(numTypes)[i2]][opts.fullWord == true ? "large" : "small"];
        returnValue = numberValue + suffix;
      }
    } else {
      returnValue = value.toExponential(2);
    }
    if (opts.price == true)
      returnValue = returnValue.replace(/^/, "$");
    if (GameState.settings.commaInsteadOfDot == true)
      returnValue = returnValue.replaceAll(".", ",");
    return returnValue;
  }
  function getPosInGrid(initialpos, row, column, spacing2) {
    return vec2(initialpos.x + spacing2.x * column, initialpos.y + spacing2.y * row);
  }
  function formatTime(time2, includeWords) {
    function toHHMMSS(timeInSeconds) {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor(timeInSeconds % 3600 / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const formattedHours = hours > 0 ? `${hours}:` : "";
      const formattedMinutes = hours > 0 ? `${minutes < 10 ? "0" + minutes : minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
      return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    }
    let returnValue = toHHMMSS(time2);
    if (includeWords == true) {
      let timeName = "";
      if (time2 > 3600) {
        if (time2 < 3600 * 2)
          timeName = "hour";
        else
          timeName = "hours";
      } else if (time2 > 60) {
        if (time2 < 120)
          timeName = "min";
        else
          timeName = "mins";
      } else if (time2 > 0) {
        if (time2 < 2)
          timeName = "sec";
        else
          timeName = "secs";
      }
      returnValue = `${returnValue} ${timeName}`;
    }
    return returnValue;
  }
  function percentage2(percentageOf, number) {
    return Math.round(percentageOf * number / 100);
  }
  function getPrice(opts) {
    opts.amountToBuy = opts.amountToBuy ?? 1;
    opts.gifted = opts.gifted ?? 0;
    let percentageMultiplier = 1 + opts.percentageIncrease / 100;
    let priceToReturn = 0;
    for (let i2 = 0; i2 < opts.amountToBuy; i2++) {
      let currentPrice = opts.basePrice * percentageMultiplier ** (opts.objectAmount + i2 - opts.gifted);
      priceToReturn += Math.round(currentPrice);
    }
    return priceToReturn;
  }
  function insertAtStart2(str, replacement) {
    return str.replace(/^/, `${replacement}`);
  }
  function blendColors(color1, color2, blendFactor) {
    return color1.lerp(color2, blendFactor);
  }
  function saveColorToColor(color2) {
    return rgb(color2.r, color2.g, color2.b);
  }
  function getPositionOfSide(obj) {
    return {
      get left() {
        return obj.pos.x - obj.width * 0.5;
      },
      get right() {
        return obj.pos.x + obj.width * 0.5;
      },
      get top() {
        return obj.pos.y - obj.height * 0.5;
      },
      get bottom() {
        return obj.pos.y + obj.height * 0.5;
      }
    };
  }
  function getRandomDirection(initialPos2, onlyCardinal, mult) {
    onlyCardinal = onlyCardinal || false;
    let directions = {
      "left": LEFT,
      "right": RIGHT,
      "top": UP,
      "bot": DOWN
    };
    if (onlyCardinal == false) {
      directions["botleft"] = vec2(-1, 1);
      directions["topleft"] = vec2(-1, -1);
      directions["botright"] = vec2(1, 1);
      directions["botleft"] = vec2(1, -1);
    }
    let direction = choose(Object.values(directions));
    direction = direction.scale(mult);
    let newPos = vec2();
    newPos.x = initialPos2.x + direction.x * mult;
    newPos.y = initialPos2.y + direction.y * mult;
    return newPos;
  }
  function parseAnimation(obj, anim) {
    let spriteName = !anim.includes(".") ? anim : [anim.split(".")[0], anim.split(".")[1]];
    obj.unuse("sprite");
    obj.use(sprite(typeof spriteName == "string" ? spriteName : spriteName[0]));
    if (typeof spriteName == "string")
      return;
    if (spriteName[1] && typeof spriteName != "string")
      obj.play(spriteName[1]);
  }
  function getVariable(obj, path) {
    const parts = path.split(".");
    const target = parts.slice(0, -1).reduce((o, p) => o[p], obj);
    return target[parts[parts.length - 1]];
  }
  function setVariable(obj, path, value) {
    const parts = path.split(".");
    const target = parts.slice(0, -1).reduce((o, p) => o[p], obj);
    target[parts[parts.length - 1]] = value;
  }
  function saveAnim() {
    addToast({ icon: "floppy", title: "Game saved!", body: `Time played: ${formatTime(GameState.stats.totalTimePlayed, true)}`, type: "gamesaved" });
  }
  function randomPos2() {
    return vec2(rand(0, width()), rand(0, height()));
  }
  function bop(obj, howMuch = 0.1, bopEasing = easings.easeOutQuint) {
    if (!obj.is("scale"))
      throw new Error("Obj must have scale component");
    if (obj.bopDefScale == null)
      obj.bopDefScale = obj.scale;
    tween(obj.scale, obj.bopDefScale.sub(howMuch), 0.15, (p) => obj.scale = p, bopEasing).then(() => {
      tween(obj.scale, obj.bopDefScale, 0.15, (p) => obj.scale = p, bopEasing);
    });
  }
  function debugTexts() {
    let keys = {};
    function createKeys() {
      let text2 = Object.keys(keys).map((key) => `${key} ${keys[key]}`).join("\n");
      return text2;
    }
    add([
      text("DEBUG", { size: 18 }),
      anchor("botleft"),
      opacity(0.25),
      pos(0, height()),
      fixed(),
      layer("mouse"),
      {
        update() {
          this.text = `DEBUG ${debug.fps()}`;
        }
      }
    ]);
    let debugTexts2 = add([
      text("", {
        size: 18
      }),
      color(WHITE),
      opacity(0.25),
      anchor("topleft"),
      layer("mouse"),
      fixed(),
      pos(),
      z(mouse.z + 1),
      "debugText",
      {
        update() {
          if (isKeyPressed("tab"))
            this.hidden = !this.hidden;
          keys = {
            "Auto loop time: ": autoLoopTime.toFixed(2),
            "Time until auto loop ends: ": GameState.timeUntilAutoLoopEnds,
            "Taskbar: ": GameState.taskbar
          };
          this.text = createKeys();
        }
      }
    ]);
    debugTexts2.hidden = true;
  }
  function debugFunctions() {
    debugTexts();
    window.globalThis.GameState = GameState;
    window.globalThis.scoreManager = scoreManager;
    window.globalThis.unlockAchievement = unlockAchievement;
    window.globalThis.spawnPowerup = spawnPowerup;
    window.globalThis.hexagon = hexagon;
    window.globalThis.openWindow = openWindow2;
    onUpdate(() => {
      if (isKeyPressed("c") && GameState.scoreAllTime > 25)
        GameState.save(true);
      else if (isKeyPressed("v"))
        GameState.delete();
      else if (isKeyPressed("b"))
        GameState.cheat();
      else if (isKeyPressed("w")) {
        hexagon.autoClick();
      } else if (isKeyDown("q")) {
        hexagon.clickPress();
        wait(0.1, () => hexagon.clickRelease());
      } else if (isKeyPressed("f")) {
        spawnPowerup({
          pos: mousePos(),
          natural: true
        });
      } else if (isKeyPressed("h")) {
        triggerGnome();
      }
    });
    onScroll((delta) => {
      if (isKeyDown("shift"))
        cam.zoom = cam.zoom * (1 - 0.1 * Math.sign(delta.y));
    });
    onMousePress("middle", () => {
      if (isKeyDown("shift"))
        cam.zoom = 1;
    });
  }

  // source/game/uicounters.ts
  var scoreText;
  var spsText;
  var buildingsText;
  function uiCounters() {
    scoreText = add([
      text(GameState.score.toString(), {
        // 46 width of char
        size: 75,
        font: "lambdao"
      }),
      anchor("center"),
      rotate(0),
      scale(1),
      layer("ui"),
      opacity(1),
      pos(center().x, 60),
      "scoreCounter",
      {
        defaultScale: 1,
        scaleIncrease: 1,
        scoreShown: 0,
        update() {
          this.text = `${formatNumber(Math.round(this.scoreShown))}`;
          this.angle = wave(-2.8, 2.8, time() * 1.25);
          this.scale.x = wave(0.95 * this.scaleIncrease, 1.08 * this.scaleIncrease, time() * 1.15);
          this.scale.y = wave(0.95 * this.scaleIncrease, 1.08 * this.scaleIncrease, time() * 1.15);
          this.defaultScale = vec2(this.scale.x, this.scale.y);
        }
      }
    ]);
    scoreText.on("startAnimEnd", () => {
      scoreText.use(waver({ maxAmplitude: 5, wave_speed: 0.5 }));
      scoreText.startWave();
      scoreText.onUpdate(() => scoreText.scoreShown = GameState.score);
    });
    spsText = scoreText.add([
      text("0.0/s", {
        size: 30,
        font: "lambdao"
      }),
      scale(),
      anchor("center"),
      area(),
      layer("ui"),
      opacity(1),
      pos(0, scoreText.pos.y - 14),
      "scoreCounter",
      // can't put text change here bc it would update to 0 each second
      {
        defaultYPos: 49,
        barYPos: 75,
        value: 0,
        // value is the raw (number) score per second (with time accounted for)
        formatSpsText(value) {
          let textThing = "/s";
          switch (GameState.settings.spsTextMode) {
            case 1:
              textThing = "/sec";
              break;
            case 2:
              textThing = "/min";
              break;
            case 3:
              textThing = "/hour";
              break;
            default:
              textThing = "/sec";
              break;
          }
          let valueToReturn = formatNumber(Number(value.toFixed(2)), { fixAmount: 2 });
          return valueToReturn + textThing;
        },
        updateValue() {
          let multiplyValue = GameState.settings.spsTextMode ? Math.pow(60, GameState.settings.spsTextMode - 1) : 1;
          this.value = scoreManager.scorePerSecond() * multiplyValue;
        },
        update() {
          this.text = this.formatSpsText(this.value, GameState.settings.spsTextMode);
        },
        click() {
          if (allObjWindows.isHoveringAWindow == false) {
            GameState.settings.spsTextMode++;
            if (GameState.settings.spsTextMode > 3)
              GameState.settings.spsTextMode = 1;
            this.updateValue();
            bop(this, 0.05);
          }
        }
      }
    ]);
    spsText.onClick(() => {
      spsText.click();
    });
    let buildingTextTextOpts = { size: 40, lineSpacing: 1.5, font: "lambdao" };
    buildingsText = add([
      text(`${formatNumberSimple(GameState.cursors)}<
${formatNumberSimple(GameState.clickers)}`, buildingTextTextOpts),
      opacity(1),
      anchor("left"),
      layer("ui"),
      pos(10, height() - 55),
      waver({ maxAmplitude: 8, wave_speed: 0.8 }),
      {
        update() {
          this.text = `${formatNumberSimple(GameState.cursors)}
${formatNumberSimple(GameState.clickers)}`;
        },
        draw() {
          let clickersWidth = formatText({ text: `${formatNumberSimple(GameState.clickers)}`, ...buildingTextTextOpts }).width;
          let cursorsWidth = formatText({ text: `${formatNumberSimple(GameState.cursors)}`, ...buildingTextTextOpts }).width;
          drawSprite({
            sprite: "cursors",
            frame: 0,
            pos: vec2(this.pos.x + clickersWidth + 5, 28),
            anchor: "center",
            scale: 0.75,
            opacity: this.opacity * 0.9
          });
          drawSprite({
            sprite: "cursors",
            frame: 1,
            pos: vec2(this.pos.x + cursorsWidth + 5, -17),
            anchor: "center",
            scale: 0.75,
            opacity: this.opacity * 0.9
          });
        }
      }
    ]);
    buildingsText.startWave();
  }

  // source/game/combo-utils.ts
  function getClicksFromCombo(level) {
    return Math.round(map(level, 2, COMBO_MAX, COMBO_MINCLICKS, COMBO_MAXCLICKS));
  }
  function getComboFromClicks(clicks) {
    return Math.round(map(clicks, COMBO_MINCLICKS, COMBO_MAXCLICKS, 2, COMBO_MAX));
  }
  var comboBarContent;
  var maxContentWidth = 0;
  function addComboBar() {
    let targetPos = vec2(0, scoreText.height / 2 + scoreText.height / 4 - 6);
    let barFrame = scoreText.add([
      rect(scoreText.width, scoreText.height / 4, { fill: false, radius: 5 }),
      pos(targetPos.x, scoreText.y),
      anchor("center"),
      opacity(1),
      outline(3.5, BLACK),
      z(scoreText.z - 1),
      layer("ui"),
      z(0),
      "comboBar",
      {
        update() {
          this.width = lerp(this.width, scoreText.width, 0.25);
          maxContentWidth = this.width;
        }
      }
    ]);
    barFrame.fadeIn(0.5);
    tween(barFrame.pos.y, targetPos.y, 0.5, (p) => barFrame.pos.y = p, easings.easeOutQuint);
    let barFrameBg = scoreText.onDraw(() => {
      drawRect({
        pos: barFrame.pos,
        anchor: barFrame.anchor,
        width: barFrame.width,
        height: barFrame.height,
        opacity: barFrame.opacity * 0.28,
        radius: 5,
        color: BLACK
      });
    });
    barFrame.onDestroy(() => {
      barFrameBg.cancel();
    });
    comboBarContent = scoreText.add([
      rect(0, barFrame.height, { radius: 5 }),
      pos(-barFrame.width / 2, barFrame.pos.y),
      anchor("left"),
      color(WHITE),
      opacity(1),
      layer("ui"),
      z(barFrame.z - 1),
      "comboBar",
      {
        update() {
          if (!clickVars.constantlyClicking) {
            if (clickVars.consecutiveClicks > 0)
              clickVars.consecutiveClicks -= 0.75;
            scoreManager.combo = getComboFromClicks(clickVars.consecutiveClicks);
            if (this.width < maxContentWidth / 2)
              clickVars.maxedCombo = false;
          } else {
            clickVars.consecutiveClicks = Math.round(clickVars.consecutiveClicks);
          }
          let mappedWidth = map(clickVars.consecutiveClicks, COMBO_MINCLICKS, COMBO_MAXCLICKS, 0, maxContentWidth);
          this.width = lerp(this.width, mappedWidth, 0.25);
          this.width = clamp(this.width, 0, maxContentWidth - 2);
          if (this.width == 0 && !clickVars.constantlyClicking && clickVars.comboDropped == false) {
            dropCombo();
          }
          let blendFactor = map(scoreManager.combo, 1, COMBO_MAX, 0, 1);
          this.color = blendColors(
            WHITE,
            hsl2rgb(time() * 0.2 * 0.1 % 1, 1.5, 0.8),
            blendFactor
          );
          this.pos.x = barFrame.pos.x - barFrame.width / 2;
          this.pos.y = barFrame.pos.y;
        }
      }
    ]);
    comboBarContent.fadeIn(0.25);
    tween(spsText.pos.y, spsText.barYPos, 0.5, (p) => spsText.pos.y = p, easings.easeOutQuint);
    return barFrame;
  }
  function addPlusScoreText(opts) {
    let size;
    if (!opts.cursorRelated)
      size = [40, 50];
    else
      size = [32.5, 40];
    let textBlendFactor = 0;
    let plusScoreText = add([
      text("", {
        size: rand(size[0], size[1]),
        font: "lambdao",
        styles: {
          "small": {
            scale: vec2(0.8),
            pos: vec2(0, 4)
          },
          "combo": (idx) => ({
            color: blendColors(
              WHITE,
              hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
              textBlendFactor
            ),
            pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5))
          })
        }
      }),
      opacity(1),
      pos(opts.pos),
      rotate(0),
      color(),
      anchor("center"),
      layer("ui"),
      "plusScoreText",
      {
        update() {
          if (opts.cursorRelated)
            return;
          textBlendFactor = map(scoreManager.combo, 1, COMBO_MAX, 0, 1);
        }
      }
    ]);
    plusScoreText.text = `+${formatNumber(opts.value)}`;
    if (scoreManager.combo > 1 && !opts.cursorRelated) {
      plusScoreText.text = insertAtStart2(plusScoreText.text, "[combo]");
      plusScoreText.text += `[/combo]`;
    }
    plusScoreText.pos.x = opts.pos.x + 2;
    plusScoreText.pos.y = opts.pos.y - 18;
    tween(
      plusScoreText.pos.y,
      plusScoreText.pos.y - 20,
      0.25,
      (p) => plusScoreText.pos.y = p
    );
    tween(
      1,
      0,
      0.25,
      (p) => plusScoreText.opacity = p
    );
    wait(0.25, () => {
      tween(
        plusScoreText.opacity,
        0,
        0.25,
        (p) => plusScoreText.opacity = p
      );
    });
    wait(0.25, () => {
      destroy(plusScoreText);
    });
    if (plusScoreText.pos.x > opts.pos.x)
      plusScoreText.anchor = "left";
    else
      plusScoreText.anchor = "right";
    if (scoreManager.combo > 1 && !opts.cursorRelated) {
    }
    return plusScoreText;
  }
  function increaseComboText() {
    let blendFactor = 0;
    let incComboText = add([
      text(`[combo]x${scoreManager.combo}[/combo]`, {
        font: "lambdao",
        size: 48,
        align: "center",
        styles: {
          "combo": (idx) => ({
            pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
            color: blendColors(
              WHITE,
              hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
              blendFactor
            )
          })
        }
      }),
      pos(mousePos().x, mousePos().y - 80),
      scale(),
      opacity(),
      layer("ui"),
      color(),
      {
        update() {
          this.pos.y -= 0.5;
          blendFactor = map(scoreManager.combo, 0, COMBO_MAX, 0, 1);
        }
      }
    ]);
    let timeToDie = 2;
    tween(0.5, 1, 0.1, (p) => incComboText.opacity = p, easings.easeOutQuint).onEnd(() => {
      tween(incComboText.opacity, 0, timeToDie, (p) => incComboText.opacity = p, easings.easeOutQuint);
      wait(timeToDie, () => {
        destroy(incComboText);
      });
    });
  }
  function maxComboAnim() {
    let blendFactor = 0;
    let words = ["MAX COMBO", "MAX COMBO!!", "YOO-HOO!!!", "YEEEOUCH!!", "FINISH IT"];
    let maxComboText = add([
      text(`[combo]${choose(words)}[/combo]`, {
        font: "lambdao",
        size: 55,
        align: "center",
        styles: {
          "combo": (idx) => ({
            pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
            color: blendColors(
              WHITE,
              hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
              blendFactor
            )
          })
        }
      }),
      pos(vec2(mousePos().x, mousePos().y - 65)),
      layer("ui"),
      color(),
      scale(),
      opacity(),
      anchor("center"),
      timer(),
      {
        update() {
          this.pos.y -= 1;
          blendFactor = 1;
        }
      }
    ]);
    let timeToDie = 2;
    maxComboText.tween(vec2(0.5), vec2(1), 0.1, (p) => maxComboText.scale = p, easings.easeOutQuad);
    maxComboText.tween(0.5, 1, 0.1, (p) => maxComboText.opacity = p, easings.easeOutQuint).onEnd(() => {
      maxComboText.tween(maxComboText.opacity, 0, timeToDie, (p) => maxComboText.opacity = p, easings.easeOutQuint);
      maxComboText.wait(timeToDie, () => {
        destroy(maxComboText);
      });
    });
    if (GameState.hasUnlockedPowerups == true && chance(0.2)) {
      spawnPowerup({
        type: "awesome",
        pos: randomPos2(),
        natural: true
      });
    }
  }
  function increaseCombo() {
    scoreManager.combo = getComboFromClicks(clickVars.consecutiveClicks);
    playSfx("combo", { detune: scoreManager.combo > 1 ? 100 * scoreManager.combo : 0 });
    tween(cam.zoom, 0.95, 0.25 / 2, (p) => cam.zoom = p, easings.easeOutQuint).onEnd(() => {
      tween(cam.zoom, 1, 0.25, (p) => cam.zoom = p, easings.easeOutQuint);
    });
    if (scoreManager.combo != COMBO_MAX)
      increaseComboText();
  }
  function startCombo() {
    increaseCombo();
    clickVars.comboDropped = false;
    addComboBar();
    tween(-10, 0, 0.5, (p) => cam.rotation = p, easings.easeOutQuint);
  }
  function dropCombo() {
    clickVars.comboDropped = true;
    clickVars.consecutiveClicks = 0;
    get("comboBar", { recursive: true }).forEach((comboBar) => {
      comboBar.fadeOut(0.25).onEnd(() => {
        comboBar.destroy();
        tween(spsText.pos.y, spsText.defaultYPos, 0.5, (p) => spsText.pos.y = p, easings.easeOutQuint);
      });
    });
  }

  // source/game/hexagon.ts
  var clickVars = {
    clicksPerSecond: 0,
    // to properly calculate sps
    consecutiveClicks: 0,
    comboDropped: true,
    maxedCombo: false,
    constantlyClicking: false
  };
  var COMBO_MINCLICKS = 25;
  var COMBO_MAXCLICKS = 160;
  var COMBO_MAX = 5;
  var hoverRotSpeedIncrease = 0.01 * 0.25;
  var maxRotSpeed = 10;
  var consecutiveClicksWaiting = null;
  var spsUpdaterTimer = 0;
  var hexagon;
  function addHexagon() {
    scoreManager.combo = 1;
    clickVars.consecutiveClicks = 0;
    clickVars.constantlyClicking = false;
    clickVars.comboDropped = true;
    clickVars.maxedCombo = false;
    spsUpdaterTimer = 0;
    maxRotSpeed = 10;
    hexagon = add([
      sprite(GameState.settings.panderitoMode ? "panderito" : "hexagon"),
      pos(center().x, center().y + 55),
      anchor("center"),
      rotate(0),
      scale(),
      opacity(1),
      outsideWindowHover(),
      color(saveColorToColor(GameState.settings.hexColor)),
      area({
        shape: new Polygon([
          vec2(406, 118),
          vec2(613, 116),
          vec2(711, 292),
          vec2(615, 463),
          vec2(411, 466),
          vec2(315, 293)
        ]),
        offset: vec2(-512, -293),
        scale: vec2(1.08)
      }),
      z(0),
      layer("hexagon"),
      "hexagon",
      {
        smallestScale: 0.985,
        biggestScale: 1.0015,
        defaultScale: vec2(1),
        scaleIncrease: 1,
        maxScaleIncrease: 1,
        stretchScaleIncrease: 1,
        interactable: true,
        isBeingClicked: false,
        rotationSpeed: 0.01,
        clickPressTween: null,
        stretched: true,
        update() {
          if (this.interactable) {
            if (GameState.settings.panderitoMode)
              this.area.scale = vec2(0.65, 1.1);
            else
              this.area.scale = vec2(1.08);
          } else
            this.area.scale = vec2(0);
          if (this.isBeingHovered)
            maxRotSpeed = 4.75;
          else
            maxRotSpeed = 4;
          this.rotationSpeed = map(GameState.score, 0, scoreManager.scoreYouGetNextManaAt(), 0.01, maxRotSpeed);
          this.rotationSpeed = clamp(this.rotationSpeed, 0.01, maxRotSpeed);
          this.angle += this.rotationSpeed;
          this.scale.x = wave(this.smallestScale * this.scaleIncrease, this.biggestScale * this.scaleIncrease, time() * 1.15);
          this.scale.y = wave(this.smallestScale * this.scaleIncrease * this.stretchScaleIncrease, this.biggestScale * this.scaleIncrease * this.stretchScaleIncrease, time() * 1.15);
          if (this.angle >= 360) {
            this.angle = 0;
          }
        },
        clickPress() {
          this.maxScaleIncrease = 0.98;
          this.clickPressTween = tween(this.scaleIncrease, this.maxScaleIncrease, 0.35, (p) => this.scaleIncrease = p, easings.easeOutQuint);
          this.isBeingClicked = true;
          mouse.grab();
          playSfx("clickPress", { detune: rand(-50, 50) });
        },
        clickRelease() {
          this.maxScaleIncrease = this.isBeingHovered ? 1.05 : 1;
          this.clickPressTween?.cancel();
          tween(this.scaleIncrease, this.maxScaleIncrease, 0.35, (p) => this.scaleIncrease = p, easings.easeOutQuint);
          this.isBeingClicked = false;
          clickVars.clicksPerSecond++;
          if (hexagon.isBeingHovered)
            mouse.releaseAndPlay("point");
          else
            mouse.releaseAndPlay("cursor");
          clickVars.constantlyClicking = true;
          consecutiveClicksWaiting.cancel();
          consecutiveClicksWaiting = wait(1, () => {
            clickVars.constantlyClicking = false;
            if (scoreManager.combo < 2)
              clickVars.consecutiveClicks = 0;
          });
          if (GameState.scoreThisRun > 100) {
            if (clickVars.consecutiveClicks != COMBO_MAXCLICKS) {
              clickVars.consecutiveClicks++;
            }
            if (clickVars.consecutiveClicks == getClicksFromCombo(2) && clickVars.comboDropped == true) {
              startCombo();
            } else if (scoreManager.combo < COMBO_MAX) {
              for (let i2 = 2; i2 < COMBO_MAX + 1; i2++) {
                if (clickVars.consecutiveClicks == getClicksFromCombo(i2)) {
                  increaseCombo();
                }
              }
            }
            if (scoreManager.combo == COMBO_MAX && clickVars.maxedCombo == false) {
              clickVars.maxedCombo = true;
              maxComboAnim();
              addConfetti({ pos: center() });
              tween(-10, 0, 0.5, (p) => cam.rotation = p, easings.easeOutQuint);
              playSfx("fullcombo", { detune: rand(-50, 50) });
              if (!isAchievementUnlocked("maxedcombo")) {
                unlockAchievement("maxedcombo");
              }
            }
          }
          let scoreObtained = 0;
          let isCritical = chance(rand(0.08, 0.1));
          let isBigCrit;
          if (isCritical == true) {
            if (chance(0.2))
              isBigCrit = true;
            else
              isBigCrit = false;
          }
          if (GameState.critPower > 1 && isCritical == true) {
            scoreObtained = scoreManager.getScoreWithCrit();
            if (isBigCrit == true)
              scoreObtained *= rand(1.2, 1.5);
          } else {
            scoreObtained = scoreManager.scorePerClick();
          }
          scoreObtained = Math.round(scoreObtained);
          let plusScoreText = addPlusScoreText({
            pos: mousePos(),
            value: scoreObtained,
            cursorRelated: false
          });
          scoreManager.addScore(scoreObtained);
          const addCriticalParticles = (big) => {
            let redcritcolor = RED.lighten(rand(110, 130));
            let bluecritcolor = BLUE.lighten(rand(110, 130));
            let angles = [big ? 45 : 0, big ? 45 : 0];
            let color2 = [big ? bluecritcolor : redcritcolor, big ? bluecritcolor : redcritcolor];
            let starparticle = add([
              layer("ui"),
              pos(mousePos()),
              opacity(),
              particles({
                max: 4,
                texture: getSprite("part_star").data.tex,
                quads: [getSprite("part_star").data.frames[0]],
                speed: [50, 100],
                // angle: angles,
                colors: color2,
                lifeTime: [1, 1.5]
              }, {
                lifetime: 1.5,
                rate: 100,
                direction: -90,
                spread: 25
              })
            ]);
            starparticle.fadeIn(0.1);
            starparticle.emit(4);
          };
          if (scoreObtained > scoreManager.scorePerClick()) {
            if (isCritical == true && isBigCrit == false) {
              plusScoreText.color = blendColors(plusScoreText.color, RED, 0.1);
              plusScoreText.text += "!";
              let randomDir = getRandomDirection(center(), false, 2.5);
              tween(randomDir, center(), 0.35, (p) => cam.pos = p, easings.easeOutQuint);
              let tone = rand(-60, 45);
              playSfx("punch", { detune: tone });
              addCriticalParticles(isBigCrit);
            }
            if (isCritical == true && isBigCrit == true) {
              plusScoreText.color = blendColors(plusScoreText.color, BLUE, 0.1);
              plusScoreText.text += "!!";
              let randomDir = getRandomDirection(center(), false, 2.5);
              tween(randomDir, center(), 0.35, (p) => cam.pos = p, easings.easeOutQuint);
              tween(choose([-1, 1]), 0, 0.35, (p) => cam.rotation = p, easings.easeOutQuint);
              let tone = rand(35, 80);
              playSfx("punch", { detune: tone });
              addCriticalParticles(isBigCrit);
            }
          }
          tween(scoreText.scaleIncrease, 1.05, 0.2, (p) => scoreText.scaleIncrease = p, easings.easeOutQuint).onEnd(() => {
            tween(scoreText.scaleIncrease, 1, 0.2, (p) => scoreText.scaleIncrease = p, easings.easeOutQuint);
          });
          const tune = rand(-50, isCritical == true ? 100 : 50);
          playSfx("clickRelease", { detune: tune });
          if (GameState.settings.panderitoMode) {
            let smallpanderito = add([
              sprite("smallpanderito"),
              anchor("center"),
              pos(mouse.pos),
              rotate(rand(0, 360)),
              body(),
              area({ collisionIgnore: ["smallpanderito", "autoCursor"] }),
              opacity(1),
              scale(rand(1, 2.5)),
              layer("ui"),
              color(),
              "smallpanderito"
            ]);
            smallpanderito.gravityScale = 0.5;
            smallpanderito.vel.x = rand(30, 75);
            let randomColor = rgb(rand(0, 255), rand(0, 255), rand(0, 255));
            smallpanderito.color = blendColors(smallpanderito.color, randomColor, 0.1);
            if (chance(0.5)) {
              tween(smallpanderito.angle, smallpanderito.angle + 90, 1, (p) => smallpanderito.angle = p);
            } else {
              tween(smallpanderito.angle, smallpanderito.angle - 90, 1, (p) => smallpanderito.angle = p);
              smallpanderito.vel.x *= -1;
            }
            wait(0.5, () => {
              tween(smallpanderito.opacity, 0, 0.5, (p) => smallpanderito.opacity = p, easings.easeOutQuint);
            });
            wait(1, () => {
              destroy(smallpanderito);
            });
          }
          this.trigger("clickrelease");
        },
        autoClick() {
          let autoCursor = add([
            sprite("cursors"),
            pos(),
            scale(0.8),
            rotate(0),
            layer("ui"),
            area({ collisionIgnore: ["autoCursor"] }),
            body(),
            opacity(1),
            anchor("center"),
            "autoCursor",
            {
              update() {
              }
            }
          ]);
          autoCursor.gravityScale = 0;
          autoCursor.pos.x = rand(
            hexagon.pos.x - 50,
            hexagon.pos.x + 50
          );
          autoCursor.pos.y = rand(
            hexagon.pos.y - 50,
            hexagon.pos.y + 50
          );
          tween(0, 1, 0.5, (p) => autoCursor.opacity = p, easings.easeOutQuint);
          tween(autoCursor.pos, autoCursor.pos.add(choose([-80, -70, -60, -50, 50, 60, 70, 80])), 0.5, (p) => autoCursor.pos = p, easings.easeOutQuint);
          if (autoCursor.pos.x > hexagon.pos.x - 50 && autoCursor.pos.x < hexagon.pos.x) {
            autoCursor.angle = 90;
          } else if (autoCursor.pos.x > hexagon.pos.x && autoCursor.pos.x < hexagon.pos.x + 50) {
            autoCursor.angle = 270;
          }
          if (autoCursor.pos.y > hexagon.pos.y - 50 && autoCursor.pos.y < hexagon.pos.y) {
            autoCursor.angle += 45;
          } else if (autoCursor.pos.y > hexagon.pos.y && autoCursor.pos.y < hexagon.pos.y + 50) {
            autoCursor.angle -= 45;
          }
          wait(0.25, () => {
            autoCursor.play("point");
            wait(0.15, () => {
              autoCursor.play("grab");
              tween(hexagon.scaleIncrease, this.maxScaleIncrease * 0.98, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint);
              playSfx("clickPress", { detune: rand(-50, 50) });
              wait(0.15, () => {
                autoCursor.play("point");
                tween(hexagon.scaleIncrease, hexagon.maxScaleIncrease, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutQuint);
                playSfx("clickRelease", { detune: rand(-50, 50) });
                addPlusScoreText({
                  pos: autoCursor.pos,
                  value: scoreManager.scorePerAutoClick(),
                  cursorRelated: true
                });
                scoreManager.addScore(scoreManager.scorePerAutoClick());
                autoCursor.gravityScale = 1;
                autoCursor.jump(300);
                wait(0.2, () => {
                  let upwards = chance(0.1);
                  if (upwards)
                    autoCursor.gravityScale = -1;
                  tween(1, 0, upwards ? 0.4 : 0.25, (p) => autoCursor.opacity = p, easings.linear);
                  if (autoCursor.pos.x > hexagon.pos.x) {
                    tween(autoCursor.angle, autoCursor.angle + 90, 1, (p) => autoCursor.angle = p);
                    autoCursor.vel.x = rand(25, 50);
                  }
                  if (autoCursor.pos.x < hexagon.pos.x) {
                    tween(autoCursor.angle, autoCursor.angle - 90, 1, (p) => autoCursor.angle = p);
                    autoCursor.vel.x = rand(-25, -50);
                  }
                  wait(1, () => {
                    destroy(autoCursor);
                  });
                });
              });
            });
          });
        }
      }
    ]);
    hexagon.startingHover(() => {
      tween(hexagon.scaleIncrease, 1.05, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutCubic);
      hexagon.rotationSpeed += hoverRotSpeedIncrease;
      hexagon.maxScaleIncrease = 1.05;
    });
    hexagon.endingHover(() => {
      tween(hexagon.scaleIncrease, 1, 0.35, (p) => hexagon.scaleIncrease = p, easings.easeOutCubic);
      hexagon.isBeingClicked = false;
      hexagon.rotationSpeed = 0;
      hexagon.maxScaleIncrease = 1;
    });
    hexagon.on("startAnimEnd", () => {
      hexagon.use(waver({ maxAmplitude: 5, wave_speed: 1 }));
      hexagon.startWave();
    });
    hexagon.onClick(() => {
      if (hexagon.isBeingHovered) {
        hexagon.clickPress();
        GameState.stats.timesClicked++;
      }
    });
    hexagon.onMouseRelease("left", () => {
      if (hexagon.isBeingHovered) {
        hexagon.clickRelease();
      }
    });
    hexagon.onMousePress("right", () => {
      if (isWindowUnlocked("hexColorWin") && hexagon.isBeingHovered)
        manageWindow("hexColorWin");
    });
    hexagon.onUpdate(() => {
      spsUpdaterTimer += dt();
      if (spsUpdaterTimer > 1) {
        spsUpdaterTimer = 0;
        spsText.updateValue();
        clickVars.clicksPerSecond = 0;
      }
    });
    ROOT.on("scoreGained", (amount) => {
      checkForUnlockable();
    });
    loop(2.5, () => {
      hexagon.stretched = !hexagon.stretched;
      if (hexagon.stretched)
        tween(hexagon.stretchScaleIncrease, 0.98, 2, (p) => hexagon.stretchScaleIncrease = p, easings.linear);
      else
        tween(hexagon.stretchScaleIncrease, 1.01, 2, (p) => hexagon.stretchScaleIncrease = p, easings.linear);
    });
    consecutiveClicksWaiting = wait(0, () => {
    });
    return hexagon;
  }

  // source/gamestate.ts
  var saveColor2 = class {
    r = 255;
    g = 255;
    b = 255;
    a;
    constructor(r, g, b2, a) {
      this.r = r;
      this.g = g;
      this.b = b2;
      this.a = a;
    }
  };
  var _GameState = class __GameState {
    score = 0;
    scoreThisRun = 0;
    scoreAllTime = 0;
    clickers = 1;
    clicksUpgradesValue = 1;
    // multiplier for clicks
    clickPercentage = 0;
    // percentage added
    cursors = 0;
    cursorsUpgradesValue = 1;
    // multiplier for cursors
    cursorsPercentage = 0;
    // percentage added
    timeUntilAutoLoopEnds = 10;
    // cursor frequency
    upgradesBought = ["c_0"];
    // powerups 
    hasUnlockedPowerups = false;
    powerupPower = 1;
    critPower = 0;
    ascension = {
      mana: 0,
      manaAllTime: 0,
      magicLevel: 1,
      // times ascended + 1
      // stuff bought for price calculation
      clickPercentagesBought: 0,
      cursorsPercentagesBought: 0,
      powerupPowersBought: 0,
      critPowersBought: 0
    };
    unlockedAchievements = [];
    unlockedWindows = ["bgColorWin", "hexColorWin"];
    taskbar = [];
    stats = {
      timesClicked: 0,
      powerupsClicked: 0,
      timesAscended: 0,
      powerupsBought: 0,
      totalTimePlayed: 0,
      timesGnomed: 0
    };
    settings = {
      sfx: { volume: 1, muted: false },
      music: { volume: 1, muted: false, favoriteIdx: 0 },
      volume: 1,
      hexColor: new saveColor2(255, 255, 255),
      bgColor: new saveColor2(0, 0, 0, 0.84),
      commaInsteadOfDot: false,
      fullscreen: false,
      spsTextMode: 1,
      panderitoMode: false
    };
    save(anim = true) {
      if (this.score < 25)
        return;
      setData("hexagon-save", this);
      if (anim)
        saveAnim();
    }
    load() {
      let gottenData = getData("hexagon-save");
      if (gottenData) {
        Object.assign(this, gottenData);
      } else {
        gottenData = new __GameState();
      }
      return gottenData;
    }
    delete() {
      let oldvolume = this.settings.volume;
      localStorage.removeItem("hexagon-save");
      Object.assign(this, new __GameState());
      musicHandler?.stop();
      stopAllSounds();
      this.settings.volume = oldvolume;
      go("gamescene");
    }
    cheat() {
      this.clickers = 100;
      this.cursors = 100;
      this.score = scoreManager.ascensionConstant;
      this.scoreThisRun = scoreManager.ascensionConstant;
      this.scoreAllTime = scoreManager.ascensionConstant;
    }
  };
  var GameState = new _GameState();
  var _scoreManager = class {
    scientificENOT = 1e21;
    combo = 1;
    // score per click (no combo or powerups or percentage)
    scorePerClick_Vanilla = () => {
      return Math.round(GameState.clickers * GameState.clicksUpgradesValue);
    };
    // score per click
    scorePerClick = () => {
      let vanillaValue = this.scorePerClick_Vanilla();
      let noPercentage = vanillaValue * (powerupTypes.clicks.multiplier * powerupTypes.awesome.multiplier) * this.combo;
      let returnValue = noPercentage + percentage2(GameState.clickPercentage, noPercentage);
      return Math.round(returnValue);
    };
    getScoreWithCrit = () => {
      return Math.round(this.scorePerClick() * (GameState.critPower * 0.5));
    };
    // score per cursor click (not including powerups or percentages)
    scorePerAutoClick_Vanilla = () => {
      return Math.round(GameState.cursors * GameState.cursorsUpgradesValue);
    };
    // score per cursor click
    scorePerAutoClick = () => {
      let noPercentage = GameState.cursors * GameState.cursorsUpgradesValue * (powerupTypes.cursors.multiplier * powerupTypes.awesome.multiplier);
      let returnValue = noPercentage + percentage2(GameState.cursorsPercentage, noPercentage);
      return Math.round(returnValue);
    };
    // the score per second you're getting by cursors
    // no rounding because can be decimal (0.1)
    autoScorePerSecond = () => {
      let returnValue = this.scorePerAutoClick() / GameState.timeUntilAutoLoopEnds;
      return returnValue;
    };
    // the general score per second clicks and all
    // no rounding because can be decimal (0.1)
    scorePerSecond = () => {
      return clickVars.clicksPerSecond * this.scorePerClick() + this.autoScorePerSecond();
    };
    addScore(amount) {
      GameState.score += amount;
      GameState.scoreThisRun += amount;
      GameState.scoreAllTime += amount;
      ROOT.trigger("scoreGained", amount);
    }
    // used usually when buying
    subTweenScore(amount) {
      tween(GameState.score, GameState.score - amount, 0.32, (p) => GameState.score = p, easings.easeOutExpo);
      ROOT.trigger("scoreDecreased", amount);
    }
    addTweenScore(amount) {
      tween(GameState.score, GameState.score + amount, 0.32, (p) => GameState.score = p, easings.easeOutExpo);
      GameState.scoreThisRun += amount;
      GameState.scoreAllTime += amount;
      ROOT.trigger("scoreGained", amount);
    }
    // =====================
    //   ASCENSION STUFF
    // =====================
    // Mana is a spendable currency
    // When score is greater than scoreTilNextMana, mana is added by one
    // Magic level is as multiplier
    /**
     * This is the number you start getting mana at
     */
    ascensionConstant = 5e6;
    // Is the actual formula that determines the amounts you get mana at
    getScoreForManaAT = (manaAllTime) => {
      return manaAllTime ** 3 * this.ascensionConstant;
    };
    // The score you get the next mana at
    scoreYouGetNextManaAt = () => {
      let nextManaAt = this.getScoreForManaAT(GameState.ascension.manaAllTime + 1);
      return nextManaAt;
    };
    resetRun() {
      tween(GameState.score, 0, 0.32, (p) => GameState.score = p, easings.easeOutCirc);
      tween(GameState.scoreThisRun, 0, 0.32, (p) => GameState.scoreThisRun = p, easings.easeOutCirc);
      tween(GameState.clickers, 1, 0.5, (p) => GameState.clickers = Math.round(p), easings.easeOutQuad);
      tween(GameState.cursors, 0, 0.5, (p) => GameState.cursors = Math.round(p), easings.easeOutQuad);
      tween(GameState.clicksUpgradesValue, 1, 0.5, (p) => GameState.clicksUpgradesValue = Math.round(p), easings.easeOutQuad);
      tween(GameState.cursorsUpgradesValue, 1, 0.5, (p) => GameState.cursorsUpgradesValue = Math.round(p), easings.easeOutQuad);
      GameState.stats.powerupsBought = 0;
      GameState.upgradesBought = ["c_0"];
      GameState.timeUntilAutoLoopEnds = 10;
    }
  };
  var scoreManager = new _scoreManager();

  // source/game/gamescene.ts
  var panderitoLetters = "panderito".split("");
  var panderitoIndex = 0;
  var isTabActive = true;
  var totalTimeOutsideTab = 0;
  var startTimeOutsideTab;
  var excessTime = 0;
  var autoLoopTime = 0;
  var idleWaiter;
  var sleeping = false;
  var timeSlept = 0;
  var cam = null;
  function togglePanderito() {
    GameState.settings.panderitoMode = !GameState.settings.panderitoMode;
    panderitoIndex = 0;
    if (!isAchievementUnlocked("panderitomode")) {
      unlockAchievement("panderitomode");
    }
    let block = add([
      rect(width(), 100),
      pos(center()),
      anchor("center"),
      opacity(0.5),
      color(BLACK),
      layer("mouse"),
      z(mouse.z - 2)
    ]);
    let panderitoText = add([
      text(`Panderito mode: ${GameState.settings.panderitoMode ? "ACTIVATED" : "DEACTIVATED"}`, {
        size: 26,
        font: "emulogic"
      }),
      pos(center()),
      anchor("center"),
      layer("mouse"),
      z(mouse.z - 1),
      opacity(1)
    ]);
    wait(0.8, () => {
      tween(0.5, 0, 0.5, (p) => block.opacity = p);
      tween(1, 0, 0.5, (p) => panderitoText.opacity = p);
      wait(0.5, () => {
        destroy(panderitoText);
        destroy(block);
      });
    });
    if (GameState.settings.panderitoMode) {
      hexagon.use(sprite("panderito"));
    } else {
      hexagon.use(sprite("hexagon"));
    }
    GameState.save(false);
  }
  function triggerZZZ(idle = true) {
    if (idle)
      sleeping = true;
    let black = add([
      rect(width(), height()),
      pos(center()),
      anchor("center"),
      color(BLACK),
      layer("mouse"),
      z(mouse.z - 2),
      opacity(1)
    ]);
    if (idle)
      black.fadeIn(0.5);
    let sleepyText = add([
      text("Z Z Z . . . ", {
        size: 90,
        font: "lambda",
        transform: (idx) => ({
          pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
          scale: wave(1, 1.2, time() * 3 + idx),
          angle: wave(-9, 9, time() * 3 + idx)
        })
      }),
      z(mouse.z - 1),
      layer("mouse"),
      anchor("center"),
      pos(center()),
      opacity(1)
    ]);
    if (idle)
      sleepyText.fadeIn(0.5);
    let events;
    function wakeUp() {
      sleeping = false;
      wait(0.5, () => {
        black.fadeOut(0.5);
        sleepyText.fadeOut(0.5).onEnd(() => {
          black?.destroy();
          sleepyText?.destroy();
          if (idle)
            welcomeBack(true);
        });
      });
      events?.forEach((event) => {
        event.cancel();
      });
    }
    if (idle) {
      let mouse2 = onMouseMove(() => wakeUp());
      let click = onClick(() => wakeUp());
      let key = onKeyPress(() => wakeUp());
      events = [mouse2, click, key];
    } else
      wakeUp();
  }
  function welcomeBack(idle = false) {
    let timeSinceLeave = 0;
    let scoreGained = 0;
    function addWelcomeBackToast(score, timeInSeconds) {
      let body2 = `You were out for: ${formatTime(timeInSeconds, true)}`;
      if (score != null)
        body2 += `
+${formatNumber(score)}`;
      let hasCombo = scoreManager.combo > 1;
      let hasPowerup = get("putimer")?.length > 0;
      let applicationMessage = "";
      if (hasCombo)
        applicationMessage += `
(Combo is not applicable)`;
      else if (hasPowerup)
        applicationMessage += "\n(Power-ups are not applicable)";
      else if (hasCombo && hasPowerup)
        applicationMessage += "\n(Combo nor Power-ups are applicable)";
      body2 += applicationMessage;
      let toast = addToast({ icon: "cursors.cursor", title: "Welcome back!", body: body2, type: "welcome" });
      if (GameState.hasUnlockedPowerups == true) {
        if (timeInSeconds > 60) {
          if (chance(0.1))
            spawnPowerup();
        }
        if (timeInSeconds > 120) {
          if (chance(0.25)) {
            if (chance(0.05)) {
              for (let i2 = 0; i2 < 2; i2++)
                spawnPowerup();
            } else {
              spawnPowerup();
            }
          }
        }
      }
      return toast;
    }
    if (idle == false) {
      timeSinceLeave = totalTimeOutsideTab / 1e3;
      autoLoopTime += totalTimeOutsideTab / 1e3;
      excessTime = autoLoopTime - GameState.timeUntilAutoLoopEnds;
      let gainedScore = 0;
      if (excessTime >= 0) {
        gainedScore = Math.floor(excessTime / GameState.timeUntilAutoLoopEnds);
        excessTime -= GameState.timeUntilAutoLoopEnds * gainedScore;
        gainedScore = gainedScore * scoreManager.scorePerAutoClick();
        scoreManager.addTweenScore(gainedScore);
        scoreGained = gainedScore;
      }
    } else {
      timeSinceLeave = timeSlept;
      if (GameState.cursors < 1 || ascension.ascending == true) {
        addWelcomeBackToast(null, timeSlept);
        return;
      }
      if (timeSlept > 60) {
        timeSlept = 0;
      }
      scoreGained = Math.round(scoreManager.autoScorePerSecond() * timeSinceLeave);
    }
    let welcomebacktoasts = get("toast").filter((t18) => t18.type == "welcome");
    if (timeSinceLeave > 10 && welcomebacktoasts.length > 0) {
      welcomebacktoasts.forEach((toast) => toast.destroy());
    }
    if (GameState.cursors < 1 || ascension.ascending == true) {
      addWelcomeBackToast(null, timeSinceLeave);
    } else {
      addWelcomeBackToast(scoreGained, timeSinceLeave);
    }
  }
  function resetIdleTime() {
    idleWaiter.cancel();
    idleWaiter = wait(20, () => {
      triggerZZZ(true);
    });
  }
  function triggerGnome() {
    let gnome = add([
      sprite("gnome"),
      pos(),
      layer("mouse"),
      scale(1.25),
      z(mouse.z - 1),
      anchor("center"),
      {
        update() {
          this.angle = wave(-10, 10, time() / 2);
        }
      }
    ]);
    playSfx("gnome");
    tween(0, width(), 0.1, (p) => gnome.pos.x = p, easings.linear);
    tween(0, height(), 0.1, (p) => gnome.pos.y = p, easings.linear).onEnd(() => {
      destroy(gnome);
    });
    if (!isAchievementUnlocked("gnome"))
      unlockAchievement("gnome");
    GameState.stats.timesGnomed++;
  }
  var hexagonIntro;
  var hasStartedGame;
  function gamescene() {
    return scene("gamescene", () => {
      GameState.load();
      hasStartedGame = GameState.scoreAllTime > 1;
      ascension.ascending = false;
      cam = {
        pos: center(),
        zoom: 1,
        rotation: 0
      };
      addHexagon();
      uiCounters();
      folderObjManaging();
      windowsDefinition();
      setGravity(1600);
      debug.log(ngUser.name);
      ROOT.on("gamestart", () => {
        wait(60, () => {
          loop(120, () => {
            if (GameState.scoreAllTime > 25)
              GameState.save(true);
          });
        });
        function naturalPowerupSpawningManagement() {
          wait(60, () => {
            loop(60, () => {
              if (chance(0.25)) {
                if (GameState.hasUnlockedPowerups) {
                  spawnPowerup();
                }
              }
            });
          });
        }
        if (!GameState.hasUnlockedPowerups) {
          ROOT.on("powerupunlock", () => {
            wait(10, () => {
              naturalPowerupSpawningManagement();
              spawnPowerup();
            });
          });
        } else
          naturalPowerupSpawningManagement();
        idleWaiter = wait(0, () => {
        });
        onMouseMove(() => resetIdleTime());
        onKeyPress(() => resetIdleTime());
        onClick(() => resetIdleTime());
        onCharInput((ch) => {
          if (!hasStartedGame)
            return;
          if (ch == panderitoLetters[panderitoIndex]) {
            panderitoIndex++;
          } else {
            panderitoIndex = 0;
          }
          if (panderitoIndex == panderitoLetters.length) {
            togglePanderito();
          }
        });
        if (!isAchievementUnlocked("gnome")) {
          wait(60, () => {
            loop(1, () => {
              if (chance(25e-4)) {
                if (ascension.ascending == true)
                  return;
                if (!isAchievementUnlocked("gnome"))
                  triggerGnome();
              }
            });
          });
        }
      });
      onUpdate(() => {
        camRot(cam.rotation);
        camScale(vec2(cam.zoom));
        camPos(cam.pos);
        if (isKeyDown("shift") && isKeyPressed("r") && panderitoIndex != 6) {
          musicHandler.stop();
          stopAllSounds();
          go("gamescene");
        }
        if (isKeyDown("shift") && isKeyPressed("s") && GameState.scoreAllTime > 25)
          GameState.save();
        GameState.stats.totalTimePlayed += dt();
        GameState.score = clamp(GameState.score, 0, Infinity);
        GameState.score = Math.round(GameState.score);
        if (GameState.scoreAllTime >= scoreManager.scoreYouGetNextManaAt() && unlockableWindows.ascendWin.condition() == true) {
          GameState.ascension.mana++;
          GameState.ascension.manaAllTime++;
          ROOT.trigger("manaGained");
        }
        GameState.stats.timesAscended = GameState.ascension.magicLevel - 1;
        if (GameState.cursors >= 1 && ascension.ascending == false) {
          autoLoopTime += dt();
          if (autoLoopTime >= GameState.timeUntilAutoLoopEnds) {
            if (excessTime > 0)
              autoLoopTime = excessTime;
            else {
              autoLoopTime = 0;
              hexagon.autoClick();
            }
            excessTime = 0;
          }
        } else {
          autoLoopTime = 0;
        }
        if (sleeping)
          timeSlept += dt();
        powerupTimeManagement();
      });
      function handleVisibilityChange() {
        if (!hasStartedGame)
          return;
        if (document.hidden) {
          totalTimeOutsideTab = 0;
          isTabActive = false;
          startTimeOutsideTab = performance.now();
          GameState.save(false);
        } else {
          if (!isTabActive) {
            isTabActive = true;
            GameState.save(false);
            const timeOutsideTab = performance.now() - startTimeOutsideTab;
            totalTimeOutsideTab += timeOutsideTab;
            GameState.stats.totalTimePlayed += totalTimeOutsideTab / 1e3;
            if (!(GameState.scoreAllTime > 0))
              return;
            if (totalTimeOutsideTab / 1e3 > 30) {
              triggerZZZ(false);
              welcomeBack(false);
            }
          }
        }
      }
      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("keydown", (event) => {
        if (event.keyCode == 83 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
          event.preventDefault();
        }
      }, false);
      document.getElementById("kanva").addEventListener("mouseout", () => {
        if (curDraggin && curDraggin.releaseDrop)
          curDraggin.releaseDrop();
      }, false);
      document.getElementById("kanva").addEventListener("fullscreenchange", () => {
        ROOT.trigger("fullscreenchange");
      });
      let introAnimations = {
        intro_hopes() {
          let reference = add([
            text("\u266A ~ Clicker.wav", {
              align: "right",
              font: "lambdao"
            }),
            opacity(),
            pos(width(), -2)
          ]);
          tween(reference.pos.x, 733, 0.32, (p) => reference.pos.x = p, easings.easeOutCubic);
          tween(0, 1, 0.32, (p) => reference.opacity = p, easings.easeOutCubic);
          wait(4, () => {
            tween(reference.pos.x, width(), 0.32, (p) => reference.pos.x = p, easings.easeInCubic).onEnd(() => destroy(reference));
            tween(1, 0, 0.32, (p) => reference.opacity = p, easings.easeOutCubic);
          });
        },
        intro_playMusic() {
          let song = GameState.settings.music.favoriteIdx == null ? "clicker.wav" : Object.keys(songs)[GameState.settings.music.favoriteIdx];
          playMusic(song);
        },
        intro_hexagon() {
          tween(vec2(center().x, center().y + 110), vec2(center().x, center().y + 55), 0.5, (p) => hexagon.pos = p, easings.easeOutQuad).onEnd(() => {
            hexagon.trigger("startAnimEnd");
          });
          tween(0.25, 1, 1, (p) => hexagon.opacity = p, easings.easeOutQuad);
        },
        intro_gameBg() {
          tween(BLACK, saveColorToColor(GameState.settings.bgColor), 0.5, (p) => gameBg.color = p, easings.easeOutQuad);
          tween(1, GameState.settings.bgColor.a, 0.5, (p) => gameBg.color.a = p, easings.easeOutQuad);
          tween(-5, 5, 0.5, (p) => gameBg.movAngle = p, easings.easeOutQuad);
        },
        intro_scoreCounter() {
          tween(scoreText.scoreShown, GameState.score, 0.25, (p) => scoreText.scoreShown = p, easings.easeOutQuint);
          tween(vec2(center().x, 80), vec2(center().x, 60), 0.5, (p) => scoreText.pos = p, easings.easeOutQuad).onEnd(() => {
            scoreText.trigger("startAnimEnd");
          });
          tween(0.25, 1, 0.5, (p) => scoreText.opacity = p, easings.easeOutQuad);
        },
        intro_spsText() {
          tween(0.25, 1, 0.5, (p) => spsText.opacity = p, easings.easeOutQuad);
        },
        intro_buildingsText() {
          tween(5, 10, 0.5, (p) => buildingsText.pos.x = p, easings.easeOutQuad);
          tween(0.25, 1, 0.5, (p) => buildingsText.opacity = p, easings.easeOutQuad);
        },
        intro_folderObj() {
          tween(width() - 30, width() - 40, 0.5, (p) => folderObj.pos.x = p, easings.easeOutQuad);
          tween(0.25, 1, 0.5, (p) => folderObj.opacity = p, easings.easeOutQuad);
        }
      };
      hexagonIntro = introAnimations.intro_hexagon;
      if (hasStartedGame) {
        Object.values(introAnimations).filter((animation) => !animation.name.includes("hopes")).forEach((animation) => {
          animation();
        });
        wait(0.5, () => {
          hexagon.interactable = true;
          ROOT.trigger("gamestart");
        });
      } else {
        gameBg.color.a = 1;
        hexagon.interactable = false;
        let black = add([
          rect(width(), height()),
          pos(center()),
          anchor("center"),
          color(BLACK),
          opacity(),
          layer("mouse"),
          z(mouse.z - 1)
        ]);
        wait(2, () => {
          black.destroy();
          let ominus = playSfx("ominus", { loop: true });
          playSfx("biglight");
          hexagon.interactable = true;
          folderObj.interactable = false;
          spsText.opacity = 0;
          scoreText.opacity = 0;
          buildingsText.opacity = 0;
          folderObj.opacity = 0;
          hexagon.on("clickrelease", () => {
            switch (GameState.scoreAllTime) {
              case 1:
                ominus.stop();
                gameBg.color.a = 0.84;
                introAnimations.intro_scoreCounter();
                break;
              case 2:
                introAnimations.intro_playMusic();
                introAnimations.intro_hopes();
                introAnimations.intro_spsText();
                break;
              case 3:
                introAnimations.intro_buildingsText();
                break;
              case 25:
                introAnimations.intro_folderObj();
                hasStartedGame = true;
                folderObj.interactable = true;
                ROOT.trigger("gamestart");
                break;
            }
          });
        });
      }
      ROOT.on("buy", (info) => {
        checkForUnlockable();
      });
      if (DEBUG == true)
        debugFunctions();
    });
  }

  // source/game/scenes/focuscene.ts
  function focuscene() {
    return scene("focuscene", () => {
      tween(1, 0.95, 0.25, (p) => gameBg.color.a = p, easings.linear);
      let y_posToDrawText = center().y + 5;
      let opacityToDrawText = 0;
      tween(y_posToDrawText, center().y, 0.25, (p) => y_posToDrawText = p, easings.easeOutCirc);
      tween(opacityToDrawText, 1, 0.25, (p) => opacityToDrawText = p, easings.easeOutCirc);
      onDraw(() => {
        drawText({
          text: "Thanks for playing!\nClick to focus the game",
          size: 60,
          pos: vec2(center().x, y_posToDrawText),
          opacity: opacityToDrawText,
          color: WHITE,
          font: "lambda",
          align: "center",
          angle: wave(-8, 8, time() * 0.9),
          anchor: "center"
        });
      });
      onClick(async () => {
        gameBg.color.a = 1;
        if (!await Rx.getUsername())
          go("ngScene");
        else
          go("gamescene");
      });
    });
  }

  // source/game/scenes/ngScene.ts
  var ngScene = () => scene("ngScene", () => {
    newgroundsSceneContent();
  });

  // source/loader.ts
  function drawSeriousLoadScreen(progress, op = 1) {
    function drawHexagon(opts = {
      pos: center(),
      scale: vec2(1),
      opacity: 1,
      color: WHITE
    }) {
      const centerX = 0;
      const centerY = 0;
      const radius = 100;
      const pts = [];
      const colors = [];
      for (let i2 = 0; i2 < 6; i2++) {
        const angle = Math.PI / 3 * i2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        pts.push(vec2(x, y));
        colors.push(rgb(
          Math.floor(Math.random() * 128 + 128),
          Math.floor(Math.random() * 128 + 128),
          Math.floor(Math.random() * 128 + 128)
        ));
      }
      drawPolygon({
        pos: opts.pos,
        opacity: opts.opacity,
        scale: opts.scale,
        color: opts.color,
        pts
      });
    }
    drawRect({
      width: width(),
      height: height(),
      color: BLACK
    });
    drawHexagon({
      pos: vec2(963, 495),
      opacity: op,
      scale: vec2(wave(-0.5, 0.5, time() * 3), 0.5),
      color: WHITE
    });
    drawText({
      text: `LOADING ${Math.round(progress * 100)}%`,
      size: 40,
      color: WHITE,
      anchor: "right",
      pos: vec2(899, 525),
      opacity: op
    });
    drawRect({
      width: map(progress, 0, 1, 5, width() - 5),
      radius: 2.5,
      height: 10,
      anchor: "left",
      pos: vec2(5, height() - 10),
      opacity: op
    });
  }
  function drawDevkyLoadScreen(progress) {
    drawRect({
      width: width(),
      height: height(),
      color: BLACK
    });
    drawSprite({
      sprite: "devky",
      anchor: "topleft",
      pos: vec2(),
      width: map(progress, 0, 1, 0, width()),
      height: height()
    });
  }
  function loadFonts() {
    if (!DEBUG) {
      load(new Promise((res) => {
        setTimeout(() => {
          res();
        }, 5e3);
      }));
    }
    loadFont("emulogic", "assets/emulogic.ttf", {
      outline: 10,
      filter: "linear"
    });
    loadFont("lambdao", "assets/Lambda-Regular.ttf", {
      outline: 5,
      filter: "linear"
    });
    loadFont("lambda", "assets/Lambda-Regular.ttf", {
      filter: "linear"
    });
  }
  function loadSprites() {
    loadBean();
    loadFonts();
    loadRoot("assets/");
    loadSprite("devky", "devky.png");
    loadSprite("hexagon", "sprites/hexagon.png");
    if (!DEBUG) {
      load(new Promise((res) => {
        setTimeout(() => {
          res();
        }, 5e3);
      }));
    }
    loadSprite("cursors", "sprites/cursors.png", {
      sliceX: 5,
      sliceY: 1,
      anims: {
        cursor: 0,
        point: 1,
        grab: 2,
        wait: 3,
        check: 4
      }
    });
    loadSprite("part_star", "sprites/part_star.png");
    loadSprite("osaka", "sprites/osaka.png");
    loadSprite("floppy", "sprites/floppy.png");
    loadSprite("panderito", "sprites/panderito.png");
    loadSprite("smallpanderito", "sprites/smallpanderito.png");
    loadSprite("folderObj", "sprites/folderObj.png");
    loadSprite("speakers", "sprites/speakers.png", {
      sliceX: 2,
      sliceY: 1,
      anims: {
        mute: 0,
        sound: 1
      }
    });
    loadSprite("dumbTestWin", "sprites/windows/dumbTestWin.png");
    loadSpriteAtlas("sprites/windows/folderIcons.png", {
      "icon_about": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 0,
        y: 0,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_medals": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 140,
        y: 0,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_ascend": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 280,
        y: 0,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_settings": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 420,
        y: 0,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_leaderboards": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 560,
        y: 0,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_music": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 700,
        y: 0,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_stats": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 0,
        y: 70,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_store": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 140,
        y: 70,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_bgColor": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 280,
        y: 70,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_hexColor": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 420,
        y: 70,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "icon_credits": {
        width: 140,
        height: 70,
        sliceX: 2,
        sliceY: 1,
        x: 560,
        y: 70,
        anims: {
          default: 0,
          hover: 1
        }
      },
      "white_noise": {
        width: 140,
        height: 70,
        x: 770,
        y: 70
      },
      "icon_extra": {
        width: 280,
        height: 70,
        sliceX: 4,
        sliceY: 1,
        x: 0,
        y: 140,
        anims: {
          open_default: 0,
          open_hover: 1,
          shut_default: 2,
          shut_hover: 3
        }
      }
    });
    loadSprite("storeWin", "sprites/windows/storeWin/storeWin.png");
    loadSprite("stroeWin", "sprites/windows/storeWin/stroeWin.png");
    loadSpriteAtlas("sprites/windows/storeWin/storeElements.png", {
      "clickersElement": {
        sliceX: 2,
        x: 0,
        y: 254,
        width: 349 * 2,
        height: 127,
        anims: {
          "up": 0,
          "down": 1
        }
      },
      "cursorsElement": {
        sliceX: 2,
        x: 0,
        y: 0,
        width: 349 * 2,
        height: 127,
        anims: {
          "up": 0,
          "down": 1
        }
      },
      "powerupsElement": {
        sliceX: 3,
        x: 0,
        y: 127,
        width: 349 * 3,
        height: 127,
        anims: {
          "up": 0,
          "down": 1
        }
      }
    });
    loadSprite("chains", "sprites/windows/storeWin/chains.png");
    loadSprite("smoke", "sprites/windows/storeWin/smoke.png", {
      sliceX: 3,
      anims: {
        "smoking": {
          from: 0,
          to: 2,
          loop: true
        }
      }
    });
    loadSprite("upgrade", "sprites/windows/storeWin/upgrade.png");
    loadSprite("upgradelock", "sprites/windows/storeWin/upgradelock.png");
    loadSprite("upgrades", "sprites/upgrades.png", {
      sliceX: 18,
      sliceY: 3,
      anims: {
        "k_0": {
          from: 0,
          to: 2
        },
        "k_1": {
          from: 3,
          to: 5
        },
        "k_2": {
          from: 6,
          to: 8
        },
        "k_3": {
          from: 9,
          to: 11
        },
        "k_4": {
          from: 12,
          to: 14
        },
        "k_5": {
          from: 15,
          to: 17
        },
        "c_6": {
          from: 18,
          to: 20
        },
        "c_7": {
          from: 21,
          to: 23
        },
        "c_8": {
          from: 24,
          to: 26
        },
        "c_9": {
          from: 27,
          to: 29
        },
        "c_10": {
          from: 30,
          to: 32
        },
        "c_11": {
          from: 33,
          to: 35
        }
      }
    });
    loadSprite("mupgrades", "sprites/mupgrades.png", {
      sliceX: 12,
      sliceY: 1,
      anims: {
        "u_12": {
          from: 0,
          to: 2
        },
        "u_13": {
          from: 3,
          to: 5
        },
        "u_14": {
          from: 6,
          to: 8
        },
        "u_15": {
          from: 9,
          to: 11
        }
      }
    });
    loadSprite("musicWin", "sprites/windows/musicWin/musicWin.png");
    loadSpriteAtlas("sprites/windows/musicWin/discs.png", {
      "discs": {
        "x": 0,
        "y": 0,
        "width": 50 * 6,
        "height": 50,
        "sliceX": 6,
        "sliceY": 1,
        "anims": {
          "wav": 0,
          "ok": 1,
          "bb1": 2,
          "bb2": 3,
          "cat": 4,
          "bb3": 5
        }
      }
    });
    loadSpriteAtlas("sprites/windows/settingsWin/settingsVolbars.png", {
      "plusbutton": {
        "x": 90,
        "y": 0,
        "width": 30,
        "height": 50
      },
      "minusbutton": {
        "x": 60,
        "y": 0,
        "width": 30,
        "height": 50
      },
      "volbarbutton": {
        "x": 0,
        "y": 0,
        "width": 60,
        "height": 50,
        "sliceX": 2,
        "sliceY": 1,
        "anims": {
          on: 1,
          off: 0
        }
      }
    });
    loadSpriteAtlas("sprites/windows/settingsWin/settingsCheckbox.png", {
      "checkbox": {
        "x": 0,
        "y": 0,
        "width": 45 * 2,
        "height": 45,
        "sliceX": 2,
        "anims": {
          "on": 1,
          "off": 0
        }
      },
      "tick": {
        "x": 90,
        "y": 0,
        "width": 60,
        "height": 54
      }
    });
    loadSprite("medals", "sprites/windows/medalsWin/medals.png", {
      sliceX: 1,
      sliceY: 1,
      anims: {
        "unknown": 0
      }
    });
    loadSprite("hexColorWin", "sprites/windows/colorWin/hexColorWin.png");
    loadSprite("bgColorWin", "sprites/windows/colorWin/bgColorWin.png");
    loadSprite("hexColorHandle", "sprites/windows/colorWin/hexColorHandle.png");
    loadSprite("defaultButton", "sprites/windows/colorWin/defaultButton.png");
    loadSprite("randomButton", "sprites/windows/colorWin/randomButton.png");
    if (!DEBUG) {
      load(new Promise((res) => {
        setTimeout(() => {
          res();
        }, 5e3);
      }));
    }
    loadSpriteAtlas("sprites/ascendscene/hexAgony.png", {
      "mage_body": {
        "x": 1e3,
        "y": 0,
        "width": 500,
        "height": 500
      },
      "mage_body_lightning": {
        "x": 0,
        "y": 500,
        "width": 500,
        "height": 500
      },
      "mage_botarm": {
        "x": 500,
        "y": 0,
        "width": 500,
        "height": 500
      },
      "mage_botarm_lightning": {
        "x": 0,
        "y": 0,
        "width": 500,
        "height": 500
      },
      "mage_toparm": {
        "x": 1e3,
        "y": 500,
        "width": 500,
        "height": 500
      },
      "mage_toparm_lightning": {
        "x": 0,
        "y": 1e3,
        "width": 500,
        "height": 500
      },
      "mage_cursors": {
        "x": 500,
        "y": 500,
        "width": 500,
        "height": 500
      }
    });
    loadSprite("mage_eye", "sprites/ascendscene/eye.png", {
      sliceX: 4,
      sliceY: 1,
      anims: {
        "blink": {
          from: 1,
          to: 3
        }
      }
    });
    loadSprite("dialogue", "sprites/ascendscene/dialogue.png");
    loadSprite("hoverDialogue", "sprites/ascendscene/emptyDialogue.png");
    loadSprite("eye_translate", "sprites/ascendscene/translate.png", {
      sliceX: 4,
      sliceY: 1,
      anims: {
        "woke": 3,
        "dumb": 1
      }
    });
    loadSpriteAtlas("sprites/ascendscene/cards.png", {
      // 22 between each card
      "card_clickers": {
        "x": 0,
        "y": 0,
        "width": 123,
        "height": 169
      },
      "card_cursors": {
        "x": 133 * 1,
        "y": 0,
        "width": 123,
        "height": 169
      },
      "card_powerups": {
        "x": 133 * 2,
        "y": 0,
        "width": 123,
        "height": 169
      },
      "card_crits": {
        "x": 133 * 3,
        "y": 0,
        "width": 123,
        "height": 169
      },
      "card_hexColor": {
        "x": 133 * 4,
        "y": 0,
        "width": 123,
        "height": 169
      },
      "card_bgColor": {
        "x": 133 * 5,
        "y": 0,
        "width": 123,
        "height": 169
      }
    });
    loadSprite("backcard", "sprites/ascendscene/backcard.png");
    loadSprite("confirmAscension", "sprites/ascendscene/confirmAscension.png");
    loadSprite("ascendWin", "sprites/windows/ascendWin/ascendWin.png");
    loadSprite("winMage_body", "sprites/windows/ascendWin/winMage_body.png");
    loadSprite("winMage_eye", "sprites/windows/ascendWin/winMage_eye.png");
    loadSprite("winMage_cursors", "sprites/windows/ascendWin/winMage_cursors.png");
    loadSprite("winMage_vignette", "sprites/windows/ascendWin/winMage_vignette.png");
    loadSprite("gnome", "sprites/gnome.png");
    loadSprite("pinch", "sprites/pinch.png");
  }
  function loadEverything() {
    loadSprites();
    if (!DEBUG) {
      load(new Promise((res) => {
        setTimeout(() => {
          res();
        }, 5e3);
      }));
    }
    loadSound("biglight", "sounds/sfx/hexagon-intro/biglight.mp3");
    loadSound("ominus", "sounds/sfx/hexagon-intro/ominus.mp3");
    loadSound("clickPress", "sounds/sfx/hexagon-intro/clickPress.mp3");
    loadSound("clickRelease", "sounds/sfx/hexagon-intro/clickRelease.mp3");
    loadSound("powerup", "sounds/sfx/hexagon-intro/powerup.wav");
    loadSound("fullcombo", "sounds/sfx/hexagon-intro/fullcombo.wav");
    loadSound("combo", "sounds/sfx/hexagon-intro/combo.wav");
    loadSound("punch", "sounds/sfx/hexagon-intro/punch.mp3");
    loadSound("mage_e", "sounds/sfx/ascension/mage_e.mp3");
    loadSound("onecard", "sounds/sfx/ascension/onecard.mp3");
    loadSound("allcards", "sounds/sfx/ascension/allcards.mp3");
    loadSound("unlockachievement", "sounds/sfx/ui/unlockachievement.wav");
    loadSound("gamesaved", "sounds/sfx/ui/gamesaved.wav");
    loadSound("clickButton", "sounds/sfx/ui/clickButton.ogg");
    loadSound("kaching", "sounds/sfx/ui/kaching.mp3");
    loadSound("unhoverhex", "sounds/sfx/ui/unhoverhex.wav");
    loadSound("volumeChange", "sounds/sfx/ui/volumeChange.mp3");
    loadSound("fold", "sounds/sfx/window/fold.wav");
    loadSound("hoverMiniButton", "sounds/sfx/window/hoverMiniButton.wav");
    loadSound("plap", "sounds/sfx/window/plap.mp3");
    loadSound("plop", "sounds/sfx/window/plop.mp3");
    loadSound("windowUnlocked", "sounds/sfx/window/windowUnlocked.wav");
    loadSound("openWin", "sounds/sfx/window/openWin.wav");
    loadSound("closeWin", "sounds/sfx/window/closeWin.wav");
    loadSound("progress", "sounds/sfx/window/progress.wav");
    loadSound("wrong", "sounds/sfx/window/wrong.wav");
    loadSound("chainwrong", "sounds/sfx/window/chainwrong.mp3");
    loadSound("chainbreak", "sounds/sfx/window/chainbreak.mp3");
    loadSound("gnome", "sounds/sfx/gnome.ogg");
    if (!DEBUG) {
      load(new Promise((res) => {
        setTimeout(() => {
          res();
        }, 5e3);
      }));
    }
    loadSound("clicker.wav", "sounds/music/clicker.ogg");
    loadSound("menu.wav", "sounds/music/menu.ogg");
    loadSound("whatttt.wav", "sounds/music/whatttt.ogg");
    loadSound("simple.wav", "sounds/music/simple.ogg");
    loadSound("jazz.wav", "sounds/music/jazz.ogg");
    loadSound("sweet.wav", "sounds/music/sweet.ogg");
    loadSound("ok_instrumental", "sounds/music/ok_instrumental.ogg");
    loadSound("magic", "sounds/music/magic.ogg");
    loadSound("watchout", "sounds/music/watchout.ogg");
    loadSound("catnip", "sounds/music/catnip.ogg");
    loadSound("project_23", "sounds/music/project_23.wav");
    if (!DEBUG) {
      load(new Promise((res) => {
        setTimeout(() => {
          res();
        }, 5e3);
      }));
    }
    loadShader("checkeredBg", null, `
	uniform float u_time;
	uniform vec3 u_color1;
	uniform vec3 u_color2;
	uniform vec2 u_speed;
	uniform float u_angle;
	uniform float u_scale;
	uniform float u_aspect;
	
	#define PI 3.14159265359
	vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
		float angle = u_angle * PI / 180.0;
		mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
		vec2 size = vec2(u_scale);
		vec2 p = (pos + vec2(u_time) * u_speed) * vec2(u_aspect, 1.0);
		p = p * rot;
		float total = floor(p.x * size.x) + floor(p.y * size.y);
		bool isEven = mod(total, 2.0) == 0.0;
		vec4 col1 = vec4(u_color1 / 255.0, 1.0);
		vec4 col2 = vec4(u_color2 / 255.0, 1.0);
		return (isEven) ? col1 : col2;
	}
	`);
    loadShader("saturate", null, `
		uniform float saturation;
		uniform vec2 u_pos;
		uniform vec2 u_size;
		uniform vec3 saturationColor;

		vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
			vec4 c = def_frag();
			vec4 col = vec4(saturationColor/255.0, 1);
			return (c + vec4(mix(vec3(0), vec3(1), saturation), 0)) * col;
		}
	`);
    loadShader("grayscale", null, `
		vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
			vec4 c = def_frag();
			return vec4(vec3(dot(c.rgb, vec3(0.2125, 0.7154, 0.0721))), c.a);
		}
	`);
    if (!DEBUG) {
      load(new Promise((res) => {
        setTimeout(() => {
          res();
        }, 5e3);
      }));
    }
    ngScene();
    focuscene();
    introscene();
    gamescene();
    if (chance(0.2))
      onLoading((progress) => drawDevkyLoadScreen(progress));
    else
      onLoading((progress) => drawSeriousLoadScreen(progress));
  }

  // source/main.ts
  var DEBUG = true;
  var k = HC({
    width: 1024,
    height: 576,
    font: "lambda",
    canvas: document.querySelector("#kanva"),
    logMax: 10,
    debugKey: "f1",
    debug: DEBUG,
    loadingScreen: true,
    crisp: false,
    backgroundAudio: true,
    stretch: DEBUG == true ? false : true,
    letterbox: DEBUG == true ? false : true
  });
  var ROOT = getTreeRoot();
  setBackground(BLACK);
  setCursor("none");
  layers([
    "background",
    "hexagon",
    "ui",
    "windows",
    "powerups",
    "ascension",
    "logs",
    "sound",
    "mouse"
  ], "background");
  loadEverything();
  onLoad(() => {
    volumeManager();
    addBackground();
    newgroundsManagement();
    gameBg.movAngle = -5;
    gameBg.color = BLACK;
    if (!DEBUG) {
      let opacity2 = 1;
      tween(opacity2, 0, 1, (p) => opacity2 = p, easings.linear);
      let drawEvent = onDraw(() => {
        drawSeriousLoadScreen(1, opacity2);
      });
      wait(1, () => {
        drawEvent.cancel();
        ROOT.trigger("rungame");
      });
    } else {
      wait(0.05, () => {
        ROOT.trigger("rungame");
      });
    }
    ROOT.on("rungame", async () => {
      addMouse();
      if (!isFocused())
        go("focuscene");
      else {
        if (!await Rx.getUsername())
          go("ngScene");
        else
          go("gamescene");
      }
    });
  });
  if (DEBUG == true)
    document.body.style.backgroundColor = "rgb(1, 3, 13)";
  else
    document.body.style.backgroundColor = "rgb(0, 0, 0)";
})();
/*! Bundled license information:

newgrounds.js/dist/newgrounds.mjs:
  (** @preserve
  	(c) 2012 by Cédric Mesnil. All rights reserved.
  
  	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
  
  	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
  
  	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  	*)
  (** @preserve
   * Counter block mode compatible with  Dr Brian Gladman fileenc.c
   * derived from CryptoJS.mode.CTR
   * Jan Hruby jhruby.web@gmail.com
   *)
*/
