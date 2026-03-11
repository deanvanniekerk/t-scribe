import Dexie, { type EntityTable } from 'dexie';
import type { Session } from '@/app/types';

const db = new Dexie('t-scribe') as Dexie & {
  sessions: EntityTable<Session, 'id'>;
};

db.version(1).stores({
  sessions: 'id, userId, createdAt',
});

export { db };
