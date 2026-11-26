import type { IconName } from './icons';
import type { Text } from '../lib/i18n';

export type Route = Text;
export type Tone = '' | 'green' | 'violet' | 'amber';

export interface Value {
  icon: IconName;
  tone: Tone;
  title: Text;
  metric: Text;
  metricLabel: Text;
  points: Text[];
  note?: Text;
}

export interface JourneyStep {
  title: Text;
  nodes: string[];
  pill: string;
  /** [link id, direction] pairs the moving dot follows. */
  route: [string, number][];
  body: Text;
  tech: Text;
}

export interface DgNode {
  icon: IconName;
  title: Text;
  sub: Text;
  short?: Text;
}

export interface Diagram {
  w: number;
  h: number;
  icon: number;
  badge: number;
  dot: number;
  arrow: number;
  labels: boolean;
  short?: boolean;
  nodes: Record<string, { x: number; y: number; w: number; h: number; top?: boolean }>;
  pills: Record<string, { x: number; y: number; w: number; h: number; text: string }>;
  links: Record<string, {
    d: string;
    badge: [number, number];
    label?: [number, number, 'start' | 'middle' | 'end'];
    dash?: boolean;
    both?: boolean;
  }>;
}

export interface StackItem {
  icon: IconName;
  tone: Tone;
  name: string;
  role: Text;
  ver: string[];
  what: Text;
  points: Text[];
}

export type TourKey = 'chat' | 'agents' | 'look';

export interface TourStep {
  box: string;
  title: Text;
  body: Text;
}

export interface TourView {
  group?: Text;
  id: string;
  shot: string;
  label: Text;
  intro: Text;
  steps: TourStep[];
}

export type RoleKey = 'owner' | 'admin' | 'agent';

export type Link = { module: string; sub?: string } | { tour: TourKey; view: string };

export interface RoleTask {
  title: Text;
  steps: Text[];
  /** May contain <b> markup. */
  example?: Text;
  link: Link;
}

export interface Role {
  name: Text;
  person: Text;
  initial: Text;
  tagline: Text;
  desc: Text;
  menu: { manage: 'all' | 'agent' };
  tasks: RoleTask[];
}

export interface MenuGroup {
  group: Text;
  manage?: boolean;
  items: [IconName, Text, 'grant'?][];
}

export type PermKind = 'yes' | 'no' | 'grant' | 'scope';

export type MatrixRow = [Text, PermKind, PermKind, PermKind, Text?];

export interface MatrixGroup {
  group: Text;
  rows: MatrixRow[];
}

export type WhoKey = 'owner' | 'admin' | 'agent' | 'grant' | 'visitor' | 'staff';

export interface Feature {
  id: string;
  icon: IconName;
  name: Text;
  who: WhoKey[];
  subs: [string, Text?][];
  summary: Text;
  points?: Text[];
  subPoints?: Record<string, Text[]>;
}

export interface ShotBox { x: number; y: number; w: number; h: number }

export interface Shot {
  src: string;
  w: number;
  h: number;
  boxes?: Record<string, ShotBox>;
}
