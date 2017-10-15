export class FetchError extends Error {
  constructor(response) {
    super("Fetching");
    this.status = response ? response.status : "";
    this.statusText = response ? response.statusText : "";
  }
}
