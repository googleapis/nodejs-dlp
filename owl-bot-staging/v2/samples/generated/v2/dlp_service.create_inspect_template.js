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

function main(parent, inspectTemplate) {
  // [START dlp_v2_generated_DlpService_CreateInspectTemplate_async]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  /**
   *  Required. Parent resource name.
   *  The format of this value varies depending on the scope of the request
   *  (project or organization) and whether you have [specified a processing
   *  location](https://cloud.google.com/dlp/docs/specifying-location):
   *  + Projects scope, location specified:<br/>
   *    `projects/`<var>PROJECT_ID</var>`/locations/`<var>LOCATION_ID</var>
   *  + Projects scope, no location specified (defaults to global):<br/>
   *    `projects/`<var>PROJECT_ID</var>
   *  + Organizations scope, location specified:<br/>
   *    `organizations/`<var>ORG_ID</var>`/locations/`<var>LOCATION_ID</var>
   *  + Organizations scope, no location specified (defaults to global):<br/>
   *    `organizations/`<var>ORG_ID</var>
   *  The following example `parent` string specifies a parent project with the
   *  identifier `example-project`, and specifies the `europe-west3` location
   *  for processing data:
   *      parent=projects/example-project/locations/europe-west3
   */
  // const parent = 'abc123'
  /**
   *  Required. The InspectTemplate to create.
   */
  // const inspectTemplate = ''
  /**
   *  The template id can contain uppercase and lowercase letters,
   *  numbers, and hyphens; that is, it must match the regular
   *  expression: `[a-zA-Z\d-_]+`. The maximum length is 100
   *  characters. Can be empty to allow the system to generate one.
   */
  // const templateId = 'abc123'
  /**
   *  Deprecated. This field has no effect.
   */
  // const locationId = 'abc123'

  // Imports the Dlp library
  const {DlpServiceClient} = require('@google-cloud/dlp').v2;

  // Instantiates a client
  const dlpClient = new DlpServiceClient();

  async function createInspectTemplate() {
    // Construct request
    const request = {
      parent,
      inspectTemplate,
    };

    // Run request
    const response = await dlpClient.createInspectTemplate(request);
    console.log(response);
  }

  createInspectTemplate();
  // [END dlp_v2_generated_DlpService_CreateInspectTemplate_async]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});
main(...process.argv.slice(2));
