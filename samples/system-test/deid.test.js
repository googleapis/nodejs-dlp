/**
 * Copyright 2018, Google, Inc.
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
const assert = require('assert');
const fs = require('fs');
const tools = require('@google-cloud/nodejs-repo-tools');

const cmd = 'node deid.js';
const cwd = path.join(__dirname, '..');

const harmfulString = 'My SSN is 372819127';
const harmlessString = 'My favorite color is blue';

const surrogateType = 'SSN_TOKEN';
let labeledFPEString;

const wrappedKey = process.env.DLP_DEID_WRAPPED_KEY;
const keyName = process.env.DLP_DEID_KEY_NAME;

const csvFile = 'resources/dates.csv';
const tempOutputFile = path.join(__dirname, 'temp.result.csv');
const csvContextField = 'name';
const dateShiftAmount = 30;
const dateFields = 'birth_date register_date';

before(tools.checkCredentials);

// deidentify_masking
it('should mask sensitive data in a string', async () => {
  const output = await tools.runAsync(
    `${cmd} deidMask "${harmfulString}" -m x -n 5`,
    cwd
  );
  assert.strictEqual(output, 'My SSN is xxxxx9127');
});

it('should ignore insensitive data when masking a string', async () => {
  const output = await tools.runAsync(
    `${cmd} deidMask "${harmlessString}"`,
    cwd
  );
  assert.strictEqual(output, harmlessString);
});

it('should handle masking errors', async () => {
  const output = await tools.runAsync(
    `${cmd} deidMask "${harmfulString}" -n -1`,
    cwd
  );
  assert.strictEqual(
    new RegExp(/Error in deidentifyWithMask/).test(output),
    true
  );
});

// deidentify_fpe
it('should FPE encrypt sensitive data in a string', async () => {
  const output = await tools.runAsync(
    `${cmd} deidFpe "${harmfulString}" ${wrappedKey} ${keyName} -a NUMERIC`,
    cwd
  );
  assert.strictEqual(new RegExp(/My SSN is \d{9}/).test(output), true);
  assert.notStrictEqual(output, harmfulString);
});

it('should use surrogate info types in FPE encryption', async () => {
  const output = await tools.runAsync(
    `${cmd} deidFpe "${harmfulString}" ${wrappedKey} ${keyName} -a NUMERIC -s ${surrogateType}`,
    cwd
  );
  assert.strictEqual(
    new RegExp(/My SSN is SSN_TOKEN\(9\):\d{9}/).test(output),
    true
  );
  labeledFPEString = output;
});

it('should ignore insensitive data when FPE encrypting a string', async () => {
  const output = await tools.runAsync(
    `${cmd} deidFpe "${harmlessString}" ${wrappedKey} ${keyName}`,
    cwd
  );
  assert.strictEqual(output, harmlessString);
});

it('should handle FPE encryption errors', async () => {
  const output = await tools.runAsync(
    `${cmd} deidFpe "${harmfulString}" ${wrappedKey} BAD_KEY_NAME`,
    cwd
  );
  assert.strictEqual(
    new RegExp(/Error in deidentifyWithFpe/).test(output),
    true
  );
});

// reidentify_fpe
it('should FPE decrypt surrogate-typed sensitive data in a string', async () => {
  assert.ok(labeledFPEString, 'Verify that FPE encryption succeeded.');
  const output = await tools.runAsync(
    `${cmd} reidFpe "${labeledFPEString}" ${surrogateType} ${wrappedKey} ${keyName} -a NUMERIC`,
    cwd
  );
  assert.strictEqual(output, harmfulString);
});

it('should handle FPE decryption errors', async () => {
  const output = await tools.runAsync(
    `${cmd} reidFpe "${harmfulString}" ${surrogateType} ${wrappedKey} BAD_KEY_NAME -a NUMERIC`,
    cwd
  );
  assert.strictEqual(
    new RegExp(/Error in reidentifyWithFpe/).test(output),
    true
  );
});

// deidentify_date_shift
it('should date-shift a CSV file', async () => {
  const outputCsvFile = 'dates.actual.csv';
  const output = await tools.runAsync(
    `${cmd} deidDateShift "${csvFile}" "${outputCsvFile}" ${dateShiftAmount} ${dateShiftAmount} ${dateFields}`,
    cwd
  );
  assert.strictEqual(
    output.includes(`Successfully saved date-shift output to ${outputCsvFile}`),
    true
  );
  assert.notStrictEqual(
    fs.readFileSync(outputCsvFile).toString(),
    fs.readFileSync(csvFile).toString()
  );
});

it('should date-shift a CSV file using a context field', async () => {
  const outputCsvFile = 'dates-context.actual.csv';
  const expectedCsvFile =
    'system-test/resources/date-shift-context.expected.csv';
  const output = await tools.runAsync(
    `${cmd} deidDateShift "${csvFile}" "${outputCsvFile}" ${dateShiftAmount} ${dateShiftAmount} ${dateFields} -f ${csvContextField} -n ${keyName} -w ${wrappedKey}`,
    cwd
  );
  assert.strictEqual(
    output.includes(`Successfully saved date-shift output to ${outputCsvFile}`),
    true
  );
  assert.strictEqual(
    fs.readFileSync(outputCsvFile).toString(),
    fs.readFileSync(expectedCsvFile).toString()
  );
});

it('should require all-or-none of {contextField, wrappedKey, keyName}', async () => {
  const output = await tools.runAsync(
    `${cmd} deidDateShift "${csvFile}" "${tempOutputFile}" ${dateShiftAmount} ${dateShiftAmount} ${dateFields} -f ${csvContextField} -n ${keyName}`,
    cwd
  );

  assert.strictEqual(
    output.includes('You must set either ALL or NONE of'),
    true
  );
});

it('should handle date-shift errors', async () => {
  const output = await tools.runAsync(
    `${cmd} deidDateShift "${csvFile}" "${tempOutputFile}" ${dateShiftAmount} ${dateShiftAmount}`,
    cwd
  );
  assert.strictEqual(
    new RegExp(/Error in deidentifyWithDateShift/).test(output),
    true
  );
});
