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

function main(projectId = 'YOUR_PROJECT_ID', filepath = 'path/to/file.txt') {
  // [START dlp_inspect_text_file]
  /**
   * TODO(developer): Uncomment these variables before running the sample.
   */
  // const projectId = 'YOUR_PROJECT_ID';
  // const filepath = 'path/to/file.txt';

  // Imports the Google Cloud Data Loss Prevention library
  const {DlpServiceClient} = require('@google-cloud/dlp');

  // Import other required libraries
  const fs = require('fs');
  const util = require('util');
  const readFile = util.promisify(fs.readFile);

  // Instantiates a client
  const dlpServiceClient = new DlpServiceClient();

  async function inspectTextFile() {
    // Get the bytes of the file
    const fileBytes = Buffer.from(await readFile(filepath)).toString('base64');

    // Construct request
    const request = {
      parent: dlpServiceClient.projectPath(projectId),
      item: {
        byteItem: {
          type: 'TEXT_UTF8',
          data: fileBytes,
        },
      },
      inspectConfig: {
        // The infoTypes of information to match
        infoTypes: [
          {name: 'PHONE_NUMBER'},
          {name: 'EMAIL_ADDRESS'},
          {name: 'CREDIT_CARD_NUMBER'},
        ],
        // Whether to include the matching string
        includeQuote: true,
      },
    };

    // Run request
    const [response] = await client.inspectContent(request);
    const findings = response.result.findings;
    console.log(`Findings: ${findings.length}`);
    for (const finding of findings) {
      console.log(`Quote: ${finding.quote}`);
      console.log(`Info type: ${finding.infoType.name}`);
      console.log(`Likelihood: ${finding.likelihood}`);
    }
  }

  inspectTextFile();
  // [END dlp_inspect_text_file]
}

main(...process.argv.slice(2));
