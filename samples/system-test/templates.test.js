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

const test = require(`ava`);
const tools = require('@google-cloud/nodejs-repo-tools');

const cmd = `node templates.js`;
let templateName = '';

const INFO_TYPE = `PERSON_NAME`;
const MIN_LIKELIHOOD = `VERY_LIKELY`;
const MAX_FINDINGS = 5;
const INCLUDE_QUOTE = false;

// create_inspect_template
test.serial(`should create template`, async t => {
  const output = await tools.runAsync(`${cmd} create -m ${MIN_LIKELIHOOD} -t ${INFO_TYPE} -f ${MAX_FINDINGS} -q ${INCLUDE_QUOTE}`);
  t.regex(output, /Successfully created template projects\/(\w|-)+\/inspectTemplates\/[0-9]+/);

  // Capture created template name for use in subsequent tests
  templateName = output.match(/projects\/(\w|-)+\/inspectTemplates\/\d+/)[0];
});

test(`should handle template creation errors`, async t => {
  const output = await tools.runAsync(`${cmd} create -t BAD_INFOTYPE`);
  t.regex(output, /Error in createInspectTemplate/);
});

// list_inspect_templates
test.serial(`should list templates`, async t => {
  const output = await tools.runAsync(`${cmd} list`);
  t.true(output.includes(`Template ${templateName}`));
  t.regex(output, /Created: \d{1,2}\/\d{1,2}\/\d{4}/);
  t.regex(output, /Updated: \d{1,2}\/\d{1,2}\/\d{4}/);
});

test.serial(`should pass creation settings to template`, async t => {
  const output = await tools.runAsync(`${cmd} list`);
  t.true(output.includes(`Template ${templateName}`));
  t.true(output.includes(`InfoTypes: US_CENSUS_NAME`));
  t.true(output.includes(`Minimum likelihood: ${MIN_LIKELIHOOD}`));
  t.true(output.includes(`Include quotes: ${INCLUDE_QUOTE}`));
  t.true(output.includes(`Max findings per request: ${MAX_FINDINGS}`));
});

// delete_inspect_template
test.serial(`should delete template`, async t => {
  const output = await tools.runAsync(`${cmd} delete ${templateName}`);
  t.true(output.includes(`Successfully deleted template ${templateName}.`));
});

test(`should handle template deletion errors`, async t => {
  const output = await tools.runAsync(`${cmd} delete BAD_TEMPLATE`);
  t.regex(output, /Error in deleteInspectTemplate/);
});
