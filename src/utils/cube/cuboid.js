class Cuboid {
  constructor(minX, maxX, minY, maxY, minZ, maxZ) {
    this.minX = minX
    this.maxX = maxX
    this.minY = minY
    this.maxY = maxY
    this.minZ = minZ
    this.maxZ = maxZ
  }

  CenterX() {
    return (this.minX + this.maxX) / 2
  }
  CenterY() {
    return (this.minY + this.maxY) / 2
  }
  CenterZ() {
    return (this.minZ + this.maxZ) / 2
  }
  LengthX() {
    return this.maxX - this.minX
  }
  LengthY() {
    return this.maxY - this.minY
  }
}

export default Cuboid