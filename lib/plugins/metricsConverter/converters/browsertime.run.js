import { getConnectivity } from '../../../support/tsdbUtil.js';
import { Metric } from '../metric.js';

export function converter(message, options) {
  const data = message.data;
  const metrics = [];
  const genericTags = {
    tool: 'browsertime',
    connectivity: getConnectivity(options),
    browser: options.browser
  };

  genericTags.url = message.url;

  // Visual Metrics
  if (data.visualMetrics) {
    for (let name of Object.keys(data.visualMetrics)) {
      if (!name.includes('Progress') && name !== 'videoRecordingStart') {
        const metric = new Metric(
          name,
          data.visualMetrics[name],
          'milliseconds',
          `browsertime.visualMetrics.${name}`
        );
        metric.addTag('metricType', 'VisualMetric');
        metric.addTags(genericTags);
        metrics.push(metric);
      }
    }
  }
  if (data.googleWebVitals) {
    for (let name of Object.keys(data.googleWebVitals)) {
      const metric = new Metric(
        name,
        data.googleWebVitals[name],
        'milliseconds',
        `browsertime.googleWebVitals.${name}`
      );
      metric.addTag('metricType', 'GoogleWebVitals');
      metric.addTags(genericTags);
      metrics.push(metric);
    }
  }

  if (data.timings && data.timings.elementTimings) {
    for (let name of Object.keys(data.timings.elementTimings)) {
      const metric = new Metric(
        name,
        data.timings.elementTimings[name].renderTime ||
          data.timings.elementTimings[name].loadTime,
        'milliseconds',
        `browsertime.elementTimings.${name}`
      );
      metric.addTag('metricType', 'ElementTimings');
      metric.addTags(genericTags);
      metrics.push(metric);
    }
  }

  if (data.timings && data.timings.userTimings) {
    for (const mark of data.timings.userTimings.marks) {
      const metric = new Metric(
        mark.name,
        mark.startTime,
        'milliseconds',
        `browsertime.userTimingsMark.${mark.name}`
      );
      metric.addTag('metricType', 'userTimingsMark');
      metric.addTags(genericTags);
      metrics.push(metric);
    }

    for (const measure of data.timings.userTimings.measures) {
      const metric = new Metric(
        measure.name,
        measure.duration,
        'milliseconds',
        `browsertime.userTimingsMark.${measure.name}`
      );
      metric.addTag('metricType', 'userTimingsMeasure');
      metric.addTags(genericTags);
      metrics.push(metric);
    }
  }

  return metrics;
}
