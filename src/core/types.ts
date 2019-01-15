// (jj) monkey patch
export type JQuery = any;

export type EventApiFunc = (event: Event, api: Api) => void;

/**
 * Content property
 */
export type Title = string | JQuery | EventApiFunc | boolean | Promise<any>;
export type Text = string | JQuery | EventApiFunc | boolean | Promise<any>;

export interface Content {
  title?: Title | { text: Title };
  text?: Text;
  attr?: string;
  button?: string | JQuery | boolean;
}

/**
 * Position property
 */
export interface PositionAdjust {
  x?: number;
  y?: number;
  mouse?: boolean;
  resize?: boolean;
  scroll?: boolean;
  method?: string;
}

export type Target = JQuery | number[] | string;

export interface Position {
  my?: string | boolean;
  at?: string | boolean;
  target?: Target | boolean;
  container?: JQuery | boolean;
  viewport?: JQuery | boolean;
  effect?: boolean | ((api: Api, pos: any, viewport: any) => void);
  adjust?: PositionAdjust;
}

/**
 * Show property
 */
export interface Show {
  target?: JQuery | boolean;
  event?: string | boolean;
  delay?: number;
  solo?: JQuery | string | boolean;
  ready?: boolean;
  effect?: boolean | ((offset: any) => void);
  modal?: boolean | Modal;
}

export interface Modal {
  on?: boolean;
  blur?: boolean;
  escape?: boolean;
  stealfocus?: boolean;
  effect?: boolean | ((state: any) => void);
}

/**
 * Hide property
 */
export interface Hide {
  target?: JQuery | boolean;
  event?: string | boolean;
  delay?: number;
  inactive?: number | boolean;
  fixed?: boolean;
  leave?: string | boolean;
  distance?: number | boolean;
  effect?: boolean | ((offset: any) => void);
}

/**
 * Style property
 */
export interface Style {
  classes?: string | boolean;
  def?: boolean;
  widget?: boolean;
  width?: string | number | boolean;
  height?: string | number | boolean;
  tip?: string | boolean | Tip;
}

export interface Tip {
  corner?: string | boolean;
  mimic?: string | boolean;
  border?: number | boolean;
  width?: number;
  height?: number;
  offset?: number;
}

/**
 * Events property
 */
export interface Events {
  render?: EventApiFunc;
  show?: EventApiFunc;
  hide?: EventApiFunc;
  toggle?: EventApiFunc;
  visible?: EventApiFunc;
  hidden?: EventApiFunc;
  move?: EventApiFunc;
  focus?: EventApiFunc;
  blur?: EventApiFunc;
}

/**
 * Options
 */
export interface QTipOptions {
  id?: string | boolean;
  prerender?: boolean;
  overwrite?: boolean;
  suppress?: boolean;
  metadata?: any;
  content?: Text | Content;
  position?: string | Position;
  style?: string | Style;
  show?: string | boolean | JQuery | Show;
  hide?: string | JQuery | Hide;
  events?: Events;
}

/**
 * API
 */
export interface Api {
  get(propertyName: 'id'): string | boolean;
  get(propertyName: 'prerender'): boolean;
  get(propertyName: 'overwrite'): boolean;
  get(propertyName: 'suppress'): boolean;
  get(propertyName: 'metadata'): any;
  get(propertyName: 'content'): Content;
  get(propertyName: 'content.text'): Text;
  get(propertyName: 'content.attr'): string;
  get(propertyName: 'content.title'): Title;
  get(propertyName: 'content.button'): string | JQuery | boolean;
  get(propertyName: 'position'): Position;
  get(propertyName: 'position.my'): string | boolean;
  get(propertyName: 'position.at'): string | boolean;
  get(propertyName: 'position.target'): Target | boolean;
  get(propertyName: 'position.container'): JQuery | boolean;
  get(propertyName: 'position.viewport'): JQuery | boolean;
  get(propertyName: 'position.effect'): boolean | ((api: any, pos: any, viewport: any) => void);
  get(propertyName: 'position.adjust'): PositionAdjust;
  get(propertyName: 'show'): Show;
  get(propertyName: 'show.target'): JQuery | boolean;
  get(propertyName: 'show.event'): string | boolean;
  get(propertyName: 'show.delay'): number;
  get(propertyName: 'show.solo'): JQuery | string | boolean;
  get(propertyName: 'show.ready'): boolean;
  get(propertyName: 'show.effect'): boolean | ((offset: any) => void);
  get(propertyName: 'show.modal'): boolean | Modal;
  get(propertyName: 'hide'): Hide;
  get(propertyName: 'hide.target'): JQuery | boolean;
  get(propertyName: 'hide.event'): string | boolean;
  get(propertyName: 'hide.delay'): number;
  get(propertyName: 'hide.leave'): string | boolean;
  get(propertyName: 'hide.distance'): number | boolean;
  get(propertyName: 'hide.effect'): boolean | ((offset: any) => void);
  get(propertyName: 'style'): Style;
  get(propertyName: 'style.classes'): string | boolean;
  get(propertyName: 'style.def'): boolean;
  get(propertyName: 'style.widget'): boolean;
  get(propertyName: 'style.width'): string | number | boolean;
  get(propertyName: 'style.height'): string | number | boolean;
  get(propertyName: 'style.tip'): string | boolean | Tip;
  get(propertyName: 'events'): Events;
  get(propertyName: 'events.render'): EventApiFunc;
  get(propertyName: 'events.show'): EventApiFunc;
  get(propertyName: 'events.hide'): EventApiFunc;
  get(propertyName: 'events.toggle'): EventApiFunc;
  get(propertyName: 'events.visible'): EventApiFunc;
  get(propertyName: 'events.hidden'): EventApiFunc;
  get(propertyName: 'events.move'): EventApiFunc;
  get(propertyName: 'events.focus'): EventApiFunc;
  get(propertyName: 'events.blur'): EventApiFunc;
  get(propertyName: string): any;

  set(properties: QTipOptions): Api;
  set(propertyName: 'id', value: string | boolean): Api;
  set(propertyName: 'prerender', value: boolean): Api;
  set(propertyName: 'overwrite', value: boolean): Api;
  set(propertyName: 'suppress', value: boolean): Api;
  set(propertyName: 'metadata', value: any): Api;
  set(propertyName: 'content', value: Text | Content): Api;
  set(propertyName: 'content.title', value: Title | { text: Title }): Api;
  set(propertyName: 'content.text', value: Text): Api;
  set(propertyName: 'content.attr', value: string): Api;
  set(propertyName: 'content.button', value: string | JQuery | boolean): Api;
  set(propertyName: 'position', value: Position): Api;
  set(propertyName: 'position.my', value: string | boolean): Api;
  set(propertyName: 'position.at', value: string | boolean): Api;
  set(propertyName: 'position.target', value: Target | boolean): Api;
  set(propertyName: 'position.container', value: JQuery | boolean): Api;
  set(propertyName: 'position.viewport', value: JQuery | boolean): Api;
  set(
    propertyName: 'position.effect',
    value: boolean | ((api: Api, pos: any, viewport: any) => void)
  ): Api;
  set(propertyName: 'position.adjust', value: PositionAdjust): Api;
  set(propertyName: 'show', value: Show): Api;
  set(propertyName: 'show.target', value: JQuery | boolean): Api;
  set(propertyName: 'show.event', value: string | boolean): Api;
  set(propertyName: 'show.delay', value: number): Api;
  set(propertyName: 'show.solo', value: JQuery | string | boolean): Api;
  set(propertyName: 'show.ready', value: boolean): Api;
  set(propertyName: 'show.effect', value: boolean | ((offset: any) => void)): Api;
  set(propertyName: 'show.modal', value: boolean | Modal): Api;
  set(propertyName: 'hide', value: Hide): Api;
  set(propertyName: 'hide.target', value: JQuery | boolean): Api;
  set(propertyName: 'hide.event', value: string | boolean): Api;
  set(propertyName: 'hide.inactive', value: number | boolean): Api;
  set(propertyName: 'hide.fixed', value: boolean): Api;
  set(propertyName: 'hide.leave', value: string | boolean): Api;
  set(propertyName: 'hide.distance', value: number | boolean): Api;
  set(propertyName: 'hide.effect', value: boolean | ((offset: any) => void)): Api;
  set(propertyName: 'style', value: Style): Api;
  set(propertyName: 'style.classes', value: string | boolean): Api;
  set(propertyName: 'style.def', value: boolean): Api;
  set(propertyName: 'style.widget', value: boolean): Api;
  set(propertyName: 'style.width', value: string | number | boolean): Api;
  set(propertyName: 'style.height', value: string | number | boolean): Api;
  set(propertyName: 'style.tip', value: string | boolean | Tip): Api;
  set(propertyName: 'events', value: Events): Api;
  set(propertyName: 'events.render', value: EventApiFunc): Api;
  set(propertyName: 'events.show', value: EventApiFunc): Api;
  set(propertyName: 'events.hide', value: EventApiFunc): Api;
  set(propertyName: 'events.toggle', value: EventApiFunc): Api;
  set(propertyName: 'events.visible', value: EventApiFunc): Api;
  set(propertyName: 'events.hidden', value: EventApiFunc): Api;
  set(propertyName: 'events.move', value: EventApiFunc): Api;
  set(propertyName: 'events.focus', value: EventApiFunc): Api;
  set(propertyName: 'events.blur', value: EventApiFunc): Api;
  set(propertyName: string, value: any): Api;

  toggle(state?: boolean, event?: Event): Api;

  show(event?: Event): Api;

  hide(event?: Event): Api;

  disable(state?: boolean): Api;

  enable(): Api;

  reposition(event?: Event, effect?: boolean): Api;

  focus(event?: Event): Api;

  blur(event?: Event): Api;

  destroy(immediate?: boolean): Api;
}

export interface Plugin {
  defaults: QTipOptions;

  (methodName: 'api'): Api;

  (methodName: 'option', propertyName: 'id'): string | boolean;
  (methodName: 'option', propertyName: 'prerender'): boolean;
  (methodName: 'option', propertyName: 'overwrite'): boolean;
  (methodName: 'option', propertyName: 'suppress'): boolean;
  (methodName: 'option', propertyName: 'metadata'): any;
  (methodName: 'option', propertyName: 'content'): Content;
  (methodName: 'option', propertyName: 'content.text'): Text;
  (methodName: 'option', propertyName: 'content.attr'): string;
  (methodName: 'option', propertyName: 'content.title'): Title;
  (methodName: 'option', propertyName: 'content.button'): string | JQuery | boolean;
  (methodName: 'option', propertyName: 'position'): Position;
  (methodName: 'option', propertyName: 'position.my'): string | boolean;
  (methodName: 'option', propertyName: 'position.at'): string | boolean;
  (methodName: 'option', propertyName: 'position.target'): Target | boolean;
  (methodName: 'option', propertyName: 'position.container'): JQuery | boolean;
  (methodName: 'option', propertyName: 'position.viewport'): JQuery | boolean;
  (methodName: 'option', propertyName: 'position.effect'):
    | boolean
    | ((api: Api, pos: any, viewport: any) => void);
  (methodName: 'option', propertyName: 'position.adjust'): PositionAdjust;
  (methodName: 'option', propertyName: 'show'): Show;
  (methodName: 'option', propertyName: 'show.target'): JQuery | boolean;
  (methodName: 'option', propertyName: 'show.event'): string | boolean;
  (methodName: 'option', propertyName: 'show.delay'): number;
  (methodName: 'option', propertyName: 'show.solo'): JQuery | string | boolean;
  (methodName: 'option', propertyName: 'show.ready'): boolean;
  (methodName: 'option', propertyName: 'show.effect'): boolean | ((offset: any) => void);
  (methodName: 'option', propertyName: 'show.modal'): boolean | Modal;
  (methodName: 'option', propertyName: 'hide'): Hide;
  (methodName: 'option', propertyName: 'hide.target'): JQuery | boolean;
  (methodName: 'option', propertyName: 'hide.event'): string | boolean;
  (methodName: 'option', propertyName: 'hide.delay'): number;
  (methodName: 'option', propertyName: 'hide.leave'): string | boolean;
  (methodName: 'option', propertyName: 'hide.distance'): number | boolean;
  (methodName: 'option', propertyName: 'hide.effect'): boolean | ((offset: any) => void);
  (methodName: 'option', propertyName: 'style'): Style;
  (methodName: 'option', propertyName: 'style.classes'): string | boolean;
  (methodName: 'option', propertyName: 'style.def'): boolean;
  (methodName: 'option', propertyName: 'style.widget'): boolean;
  (methodName: 'option', propertyName: 'style.width'): string | number | boolean;
  (methodName: 'option', propertyName: 'style.height'): string | number | boolean;
  (methodName: 'option', propertyName: 'style.tip'): string | boolean | Tip;
  (methodName: 'option', propertyName: 'events'): Events;
  (methodName: 'option', propertyName: 'events.render'): EventApiFunc;
  (methodName: 'option', propertyName: 'events.show'): EventApiFunc;
  (methodName: 'option', propertyName: 'events.hide'): EventApiFunc;
  (methodName: 'option', propertyName: 'events.toggle'): EventApiFunc;
  (methodName: 'option', propertyName: 'events.visible'): EventApiFunc;
  (methodName: 'option', propertyName: 'events.hidden'): EventApiFunc;
  (methodName: 'option', propertyName: 'events.move'): EventApiFunc;
  (methodName: 'option', propertyName: 'events.focus'): EventApiFunc;
  (methodName: 'option', propertyName: 'events.blur'): EventApiFunc;

  (methodName: 'option', properties: QTipOptions): Api;
  (methodName: 'option', propertyName: 'id', value: string | boolean): Api;
  (methodName: 'option', propertyName: 'prerender', value: boolean): Api;
  (methodName: 'option', propertyName: 'overwrite', value: boolean): Api;
  (methodName: 'option', propertyName: 'suppress', value: boolean): Api;
  (methodName: 'option', propertyName: 'metadata', value: any): Api;
  (methodName: 'option', propertyName: 'content', value: Text | Content): Api;
  (methodName: 'option', propertyName: 'content.title', value: Title | { text: Title }): Api;
  (methodName: 'option', propertyName: 'content.text', value: Text): Api;
  (methodName: 'option', propertyName: 'content.attr', value: string): Api;
  (methodName: 'option', propertyName: 'content.button', value: string | JQuery | boolean): Api;
  (methodName: 'option', propertyName: 'position', value: Position): Api;
  (methodName: 'option', propertyName: 'position.my', value: string | boolean): Api;
  (methodName: 'option', propertyName: 'position.at', value: string | boolean): Api;
  (methodName: 'option', propertyName: 'position.target', value: Target | boolean): Api;
  (methodName: 'option', propertyName: 'position.container', value: JQuery | boolean): Api;
  (methodName: 'option', propertyName: 'position.viewport', value: JQuery | boolean): Api;
  (
    methodName: 'option',
    propertyName: 'position.effect',
    value: boolean | ((api: Api, pos: any, viewport: any) => void)
  ): Api;
  (methodName: 'option', propertyName: 'position.adjust', value: PositionAdjust): Api;
  (methodName: 'option', propertyName: 'show', value: Show): Api;
  (methodName: 'option', propertyName: 'show.target', value: JQuery | boolean): Api;
  (methodName: 'option', propertyName: 'show.event', value: string | boolean): Api;
  (methodName: 'option', propertyName: 'show.delay', value: number): Api;
  (methodName: 'option', propertyName: 'show.solo', value: JQuery | string | boolean): Api;
  (methodName: 'option', propertyName: 'show.ready', value: boolean): Api;
  (
    methodName: 'option',
    propertyName: 'show.effect',
    value: boolean | ((offset: any) => void)
  ): Api;
  (methodName: 'option', propertyName: 'show.modal', value: boolean | Modal): Api;
  (methodName: 'option', propertyName: 'hide', value: Hide): Api;
  (methodName: 'option', propertyName: 'hide.target', value: JQuery | boolean): Api;
  (methodName: 'option', propertyName: 'hide.event', value: string | boolean): Api;
  (methodName: 'option', propertyName: 'hide.inactive', value: number | boolean): Api;
  (methodName: 'option', propertyName: 'hide.fixed', value: boolean): Api;
  (methodName: 'option', propertyName: 'hide.leave', value: string | boolean): Api;
  (methodName: 'option', propertyName: 'hide.distance', value: number | boolean): Api;
  (
    methodName: 'option',
    propertyName: 'hide.effect',
    value: boolean | ((offset: any) => void)
  ): Api;
  (methodName: 'option', propertyName: 'style', value: Style): Api;
  (methodName: 'option', propertyName: 'style.classes', value: string | boolean): Api;
  (methodName: 'option', propertyName: 'style.def', value: boolean): Api;
  (methodName: 'option', propertyName: 'style.widget', value: boolean): Api;
  (methodName: 'option', propertyName: 'style.width', value: string | number | boolean): Api;
  (methodName: 'option', propertyName: 'style.height', value: string | number | boolean): Api;
  (methodName: 'option', propertyName: 'style.tip', value: string | boolean | Tip): Api;
  (methodName: 'option', propertyName: 'events', value: Events): Api;
  (methodName: 'option', propertyName: 'events.render', value: EventApiFunc): Api;
  (methodName: 'option', propertyName: 'events.show', value: EventApiFunc): Api;
  (methodName: 'option', propertyName: 'events.hide', value: EventApiFunc): Api;
  (methodName: 'option', propertyName: 'events.toggle', value: EventApiFunc): Api;
  (methodName: 'option', propertyName: 'events.visible', value: EventApiFunc): Api;
  (methodName: 'option', propertyName: 'events.hidden', value: EventApiFunc): Api;
  (methodName: 'option', propertyName: 'events.move', value: EventApiFunc): Api;
  (methodName: 'option', propertyName: 'events.focus', value: EventApiFunc): Api;
  (methodName: 'option', propertyName: 'events.blur', value: EventApiFunc): Api;

  (methodName: 'toggle', state?: boolean, event?: Event): JQuery;

  (methodName: 'show', event?: Event): JQuery;

  (methodName: 'hide', event?: Event): JQuery;

  (methodName: 'disable', state?: boolean): JQuery;

  (methodName: 'enable'): JQuery;

  (methodName: 'reposition', event?: Event, effect?: boolean): JQuery;

  (methodName: 'focus', event?: Event): JQuery;

  (methodName: 'blur', event?: Event): JQuery;

  (methodName: 'destroy', immediate?: boolean): JQuery;

  (methodName: string, p1?: any, p2?: any, p3?: any): any;

  (options?: QTipOptions): JQuery;
}
