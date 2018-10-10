/**
 * Copyright 2019, Google, Inc.
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

const {assert} = require('chai');
const dlp = require('@google-cloud/dlp');
const execa = require('execa');
const exec = async cmd => (await execa.shell(cmd)).stdout;

const REGION_TAG = 'dlp_inspect_image_file';

describe(REGION_TAG, () => {
  it('should inspect a string', async () => {
    const client = new dlp.DlpServiceClient();
    const projectId = await client.getProjectId();
    const output = await exec(
      `node ${REGION_TAG}.js ${projectId} resources/test.png`
    );
    assert.match(output, /Info type: EMAIL_ADDRESS/);
  });
});
