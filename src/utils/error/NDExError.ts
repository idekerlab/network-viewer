class NDExError extends Error {
  details: object

  constructor(message: string, details: any) {
    super(message)

    this.details = details
    this.name = new.target.name;

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export default NDExError
