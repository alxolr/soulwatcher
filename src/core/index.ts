#!/usr/bin/env node

import { DeadCode } from '../lib/plugin/dead-code';
import { Soulwatcher } from '../lib/soulwatcher';

(async () => {
  await new Soulwatcher()
    .addPlugin(new DeadCode())
    .addPlugin(new DeadCode())
    .execute();
})();
