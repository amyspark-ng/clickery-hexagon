// A custom component for waving - it is TS for this waveCompOpt
export interface WaveCompOpt {
	wave_tweenSpeed?: number,
	wave_startTweenSpeed: number,
	wave_endTweenSpeed: number,
	minAmplitude?: number,
	maxAmplitude?: number,
	wave_speed?: number,
}

export function waver(WaveCompOpt: WaveCompOpt) {
	return {
		// Name of the component
		id: "wave",
		// This component requires the "pos" component to work
		require: [ "pos" ],
		amplitude: 0,
		wave_tweenSpeed: WaveCompOpt.wave_tweenSpeed || 0.32,
		wave_startTweenSpeed: WaveCompOpt.wave_tweenSpeed || 0.32,
		wave_endTweenSpeed: WaveCompOpt.wave_tweenSpeed || 0.32,
		minAmplitude: WaveCompOpt.minAmplitude || 0,
		maxAmplitude: WaveCompOpt.maxAmplitude || 50,
		wave_verPosition: 0,
		wave_speed: WaveCompOpt.wave_speed || 1,
		isWaving: false,
		add() {
			this.wave_verPosition = this.pos.y
		},
		startWave() {
			if (this.isWaving) return
			this.trigger("waveStart")
			tween(this.minAmplitude, this.maxAmplitude, this.wave_tweenSpeed, v => this.amplitude = v)
			this.isWaving = true
		},
		stopWave() {
			if (!this.isWaving) return
			this.trigger("waveStop")
			tween(this.amplitude, this.minAmplitude, this.wave_tweenSpeed, v => this.amplitude = v)
			tween(this.pos.y, this.wave_verPosition, this.wave_tweenSpeed, v => this.pos.y = v)
			this.isWaving = false
		},
		// "update" is a lifecycle method gets called every frame the obj is in scene
		update() {
			if (!this.isWaving) return
			const t = time() * this.wave_speed
			this.pos.y = this.wave_verPosition + this.amplitude * Math.cos(t * this.wave_speed)
		},
	}
}
