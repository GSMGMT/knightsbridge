import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';

export const db = GUN({ file: 'db' });
