import { SitespeedioPlugin } from '@sitespeed.io/plugin';

import { converter } from './converters/browsertime.run.js';

export default class MetricConverterPlugin extends SitespeedioPlugin {
  constructor(options, context) {
    super({ name: 'metricsConverter', options, context });
  }

  open(context, options) {
    this.options = options;
    this.alias = {};
  }

  processMessage(message) {
    if (message.type === 'browsertime.alias') {
      this.alias[message.url] = message.data;
    }

    try {
      if (message.type === 'browsertime.run') {
        const metrics = converter(message, this.options);
        console.log(metrics);
      }
      // TODO send the metrics on the queue
    } catch (error) {
      console.log(error);
    }
  }
}
