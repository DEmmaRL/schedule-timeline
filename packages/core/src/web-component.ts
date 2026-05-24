import type { Event, TimelineConfig } from './types';
import { renderTimeline, type TimelineInstance, type TimelineRenderProps } from './renderer';

type WebComponentProps = TimelineRenderProps;

function parseJson<T>(value: string | null, fallback: T | undefined): T | undefined {
  if (value === null || value.trim() === '') {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export class ScheduleTimelineElement extends HTMLElement {
  private instance: TimelineInstance | null = null;
  private currentProps: WebComponentProps = {};

  static get observedAttributes(): string[] {
    return ['events', 'config'];
  }

  connectedCallback(): void {
    this.style.display = 'block';
    this.render();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) {
      return;
    }

    if (this.isConnected) {
      this.render();
    }
  }

  disconnectedCallback(): void {
    this.instance?.destroy();
    this.instance = null;
  }

  setEvents(events: Event[]): void {
    this.currentProps = { ...this.currentProps, events };
    this.render();
  }

  setConfig(config: TimelineConfig): void {
    this.currentProps = { ...this.currentProps, config };
    this.render();
  }

  private readProps(): WebComponentProps {
    const currentEvents = this.currentProps.events;
    const currentConfig = this.currentProps.config;
    const eventsAttr = this.getAttribute('events');
    const configAttr = this.getAttribute('config');

    return {
      ...this.currentProps,
      className: this.className,
      events: eventsAttr === null ? currentEvents : parseJson<Event[]>(eventsAttr, currentEvents),
      config: configAttr === null ? currentConfig : parseJson<TimelineConfig>(configAttr, currentConfig),
    };
  }

  private render(): void {
    const nextProps = this.readProps();
    this.currentProps = nextProps;

    if (this.instance) {
      this.instance.update(nextProps);
      return;
    }

    this.instance = renderTimeline(this, nextProps);
  }
}

export function registerScheduleTimelineElement(): void {
  if (typeof customElements === 'undefined') {
    return;
  }

  if (!customElements.get('schedule-timeline')) {
    customElements.define('schedule-timeline', ScheduleTimelineElement);
  }
}