/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const path = require('path');
const test = require('ava');
const tools = require('@google-cloud/nodejs-repo-tools');

const cmd = 'node deid.js';
const cwd = path.join(__dirname, `..`);

const harmfulString = 'My SSN is 372819127';
const harmlessString = 'My favorite color is blue';

const surrogateType = 'SSN_TOKEN';
let labeledFPEString;

const wrappedKey = process.env.DLP_DEID_WRAPPED_KEY;
const keyName = process.env.DLP_DEID_KEY_NAME;

test.before(tools.checkCredentials);

// deidentify_masking
test(`should mask sensitive data in a string`, async t => {
  const output = await tools.runAsync(
    `${cmd} deidMask "${harmfulString}" -m x -n 5`,
    cwd
  );
  t.is(output, 'My SSN is xxxxx9127');
});

test(`should ignore insensitive data when masking a string`, async t => {
  const output = await tools.runAsync(`${cmd} deidMask "${harmlessString}"`, cwd);
  t.is(output, harmlessString);
});

test(`should handle masking errors`, async t => {
  const output = await tools.runAsync(
    `${cmd} deidMask "${harmfulString}" -n -1`,
    cwd
  );
  t.regex(output, /Error in deidentifyWithMask/);
});

// deidentify_fpe
test(`should FPE encrypt sensitive data in a string`, async t => {
  const output = await tools.runAsync(
    `${cmd} deidFpe "${harmfulString}" ${wrappedKey} ${keyName} -a NUMERIC`,
    cwd
  );
  t.regex(output, /My SSN is \d{9}/);
  t.not(output, harmfulString);
});

test.serial(`should use surrogate info types in FPE encryption`, async t => {
  const output = await tools.runAsync(
    `${cmd} deidFpe "${harmfulString}" ${wrappedKey} ${keyName} -a NUMERIC -s ${surrogateType}`,
    cwd
  );
  t.regex(output, /My SSN is SSN_TOKEN\(9\):\d{9}/);
  labeledFPEString = output;
});

test(`should ignore insensitive data when FPE encrypting a string`, async t => {
  const output = await tools.runAsync(
    `${cmd} deidFpe "${harmlessString}" ${wrappedKey} ${keyName}`,
    cwd
  );
  t.is(output, harmlessString);
});

test(`should handle FPE encryption errors`, async t => {
  const output = await tools.runAsync(
    `${cmd} deidFpe "${harmfulString}" ${wrappedKey} BAD_KEY_NAME`,
    cwd
  );
  t.regex(output, /Error in deidentifyWithFpe/);
});

// reidentify_fpe
test.serial(`should FPE decrypt surrogate-typed sensitive data in a string`, async t => {
  t.truthy(labeledFPEString, `Verify that FPE encryption succeeded.`);
  const output = await tools.runAsync(
    `${cmd} reidFpe "${labeledFPEString}" ${surrogateType} ${wrappedKey} ${keyName} -a NUMERIC`,
    cwd
  );
  t.is(output, harmfulString);
});

test(`should handle FPE decryption errors`, async t => {
  const output = await tools.runAsync(
    `${cmd} reidFpe "${harmfulString}" ${surrogateType} ${wrappedKey} BAD_KEY_NAME -a NUMERIC`,
    cwd
  );
  t.regex(output, /Error in reidentifyWithFpe/);
});
