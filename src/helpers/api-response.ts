import { HttpStatus } from './http-status'

export class ApiResponse {
  constructor(private status: number, private data?: any, private error?: boolean) {
    this.message = HttpStatus[this.status]
  }
  private message: string

  public toJSON(): any {
    if (this.error === true) {
      return {
        status: this.status,
        message: this.message,
        error: this.data,
      }
    } else {
      return {
        status: this.status,
        message: this.message,
        data: this.data,
      }
    }
  }
}
