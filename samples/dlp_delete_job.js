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

function main(projectId = 'YOUR_PROJECT_ID', dlpJob = 'YOUR_JOB_NAME') {
  // [START dlp_delete_job]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const projectId = 'YOUR_PROJECT_ID';
  // const dlpJob = 'X-abcd-1234';

  // Imports the Google Cloud Data Loss Prevention library
  const {DlpServiceClient} = require('@google-cloud/dlp');

  // Instantiates a client
  const dlpServiceClient = new DlpServiceClient();

  async function deleteJob() {
    // Construct request
    const request = {
      name: dlpServiceClient.dlpJobPath(projectId, dlpJob),
    };

    // Run request
    await dlpServiceClient.deleteDlpJob(request);
    console.log(`Successfully deleted job ${dlpJob}`);
  }

  deleteJob();
  // [END dlp_delete_job]
}

main(...process.argv.slice(2));
