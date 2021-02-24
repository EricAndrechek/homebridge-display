class clock {
  constructor(format, log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;
    this.send_info = {
      format: format,
    };
  }
  getFormat() {
    return this.send_info;
  }
}

module.exports = clock;
