export function addShockwave(opts = { pos: vec2(), size: 10}) {

}

function shockwave(vecPos, size = 50, opts = {}) {
    let swBorderWidth = size / 10
    let swRadius = 0
    let swColor = opts.color ?? WHITE
    let swSpeed = opts.speed ?? size * 3

    const component = {
        swBorderWidth,
        swRadius,
        swColor,
        swSpeed,
        update() {
            if (this.swRadius >= size) {
                return this.destroy()
            }
            this.swRadius += this.swSpeed * dt()
            this.swBorderWidth -= (this.swSpeed / 8) * dt()
        },
        draw() {
            drawCircle({
                pos: vec2(0,0),
                radius: this.swRadius,
                fill: false,
                anchor: 'center',
                outline: {
                    width: this.swBorderWidth,
                    color: this.swColor
                }
            })
        }
    }
    
    return add([
        pos(vecPos),
        component,
    ])
}