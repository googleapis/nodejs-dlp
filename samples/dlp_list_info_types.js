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

function main() {
  // [START dlp_list_info_types]
  // Imports the Google Cloud Data Loss Prevention library
  const {DlpServiceClient} = require('@google-cloud/dlp');

  // Instantiates a client
  const dlpServiceClient = new DlpServiceClient();

  async function listInfoTypes() {
    // Construct request
    const request = {
      languageCode: 'en-US',
      filter: 'supported_by=INSPECT',
    };

    // Run request
    const [response] = await dlpServiceClient.listInfoTypes(request);
    const infoTypes = response.infoTypes;
    console.log(`Info types: ${infoTypes.length}`);
    for (const infoType of infoTypes) {
      console.log(`${infoType.name} (${infoType.displayName})`);
    }
  }

  listInfoTypes();
  // [END dlp_list_info_types]
}

main(...process.argv.slice(2));
