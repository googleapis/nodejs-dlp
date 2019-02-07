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

const {assert} = require('chai');
const fs = require('fs');
const execa = require('execa');
const {PNG} = require('pngjs');
const pixelmatch = require('pixelmatch');

const cmd = 'node redact.js';
const testImage = 'resources/test.png';
const testResourcePath = 'system-test/resources';
const exec = async cmd => (await execa.shell(cmd)).stdout;

async function readImage(filePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(new PNG())
      .on('error', reject)
      .on('parsed', function() {
        resolve(this);
      });
  });
}

async function getImageDiffPercentage(image1Path, image2Path) {
  const image1 = await readImage(image1Path);
  const image2 = await readImage(image2Path);
  const diff = new PNG({width: image1.width, height: image1.height});

  const diffPixels = pixelmatch(
    image1.data,
    image2.data,
    diff.data,
    image1.width,
    image1.height
  );
  return diffPixels / (diff.width * diff.height);
}

describe('redact', () => {
  // redact_text
  it('should redact a single sensitive data type from a string', async () => {
    const output = await exec(
      `${cmd} string "My email is jenny@example.com" -t EMAIL_ADDRESS`
    );
    assert.match(output, /My email is \[EMAIL_ADDRESS\]/);
  });

  it('should redact multiple sensitive data types from a string', async () => {
    const output = await exec(
      `${cmd} string "I am 29 years old and my email is jenny@example.com" -t EMAIL_ADDRESS AGE`
    );
    assert.match(output, /I am \[AGE\] and my email is \[EMAIL_ADDRESS\]/);
  });

  it('should handle string with no sensitive data', async () => {
    const output = await exec(
      `${cmd} string "No sensitive data to redact here" -t EMAIL_ADDRESS AGE`
    );
    assert.match(output, /No sensitive data to redact here/);
  });

  // redact_image
  it('should redact a single sensitive data type from an image', async () => {
    const testName = `redact-single-type`;
    const output = await exec(
      `${cmd} image ${testImage} ${testName}.actual.png -t PHONE_NUMBER`
    );
    assert.match(output, /Saved image redaction results to path/);
    const difference = await getImageDiffPercentage(
      `${testName}.actual.png`,
      `${testResourcePath}/${testName}.expected.png`
    );
    assert.isBelow(difference, 0.03);
  });

  it('should redact multiple sensitive data types from an image', async () => {
    const testName = `redact-multiple-types`;
    const output = await exec(
      `${cmd} image ${testImage} ${testName}.actual.png -t PHONE_NUMBER EMAIL_ADDRESS`
    );
    assert.match(output, /Saved image redaction results to path/);
    const difference = await getImageDiffPercentage(
      `${testName}.actual.png`,
      `${testResourcePath}/${testName}.expected.png`
    );
    assert.isBelow(difference, 0.03);
  });

  it('should report info type errors', async () => {
    const output = await exec(
      `${cmd} string "My email is jenny@example.com" -t NONEXISTENT`
    );
    assert.match(output, /Error in deidentifyContent/);
  });

  it('should report image redaction handling errors', async () => {
    const output = await exec(
      `${cmd} image ${testImage} output.png -t BAD_TYPE`
    );
    assert.match(output, /Error in redactImage/);
  });
});
