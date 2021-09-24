// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

function main() {
  // [START dlp_v2_generated_DlpService_RedactImage_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Parent resource name.
   *  The format of this value varies depending on whether you have [specified a
   *  processing
   *  location](https://cloud.google.com/dlp/docs/specifying-location):
   *  + Projects scope, location specified:<br/>
   *    `projects/`<var>PROJECT_ID</var>`/locations/`<var>LOCATION_ID</var>
   *  + Projects scope, no location specified (defaults to global):<br/>
   *    `projects/`<var>PROJECT_ID</var>
   *  The following example `parent` string specifies a parent project with the
   *  identifier `example-project`, and specifies the `europe-west3` location
   *  for processing data:
   *      parent=projects/example-project/locations/europe-west3
   */
  // const parent = 'abc123'
  /**
   *  Deprecated. This field has no effect.
   */
  // const locationId = 'abc123'
  /**
   *  Configuration for the inspector.
   */
  // const inspectConfig = ''
  /**
   *  The configuration for specifying what content to redact from images.
   */
  // const imageRedactionConfigs = 1234
  /**
   *  Whether the response should include findings along with the redacted
   *  image.
   */
  // const includeFindings = true
  /**
   *  The content must be PNG, JPEG, SVG or BMP.
   */
  // const byteItem = ''

  // Imports the Dlp library
  const {DlpServiceClient} = require('@google-cloud/dlp').v2;

  // Instantiates a client
  const dlpClient = new DlpServiceClient();

  async function redactImage() {
    // Construct request
    const request = {};

    // Run request
    const response = await dlpClient.redactImage(request);
    console.log(response);
  }

  redactImage();
  // [END dlp_v2_generated_DlpService_RedactImage_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
