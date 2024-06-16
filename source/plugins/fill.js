// # by Luiz Bills / modified by amyspark-ng
export function fill(_color, _opacity = 0, _blendFactor = 1) {
	let fillColor = null
	let shaderLoaded = false
	return {
		id: 'fill',

		fill(_color, _opacity = 1, _blendFactor = _blendFactor) {
			if (_color instanceof Color) {
				fillColor = _color
				this.use(
					shader('fillColor', {
						c: _color,
						a: _opacity,
					})
				)
			} else {
				fillColor = null
				this.unuse('shader')
			}
		},

		async add() {
			if (!shaderLoaded) {
				const s = await loadShader(
					'fillColor',
					null,
					`
					uniform vec3 c;
					uniform float a;

					vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
						if (texture2D(tex, uv).a > 0.0) return vec4(c.r, c.g, c.b, a);
						discard;
					}`
				)
			}
			this.fill(_color, _opacity)
		},

		get fillColor() {
			return fillColor
		},

		set fillColor(newColor) {
			this.fill(newColor, _opacity)
		}
	}
}