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

function redactImage (callingProjectId, filepath, minLikelihood, infoTypes, outputPath) {
  // [START redact_image]
  // Imports required Node.js libraries
  const mime = require('mime');
  const fs = require('fs');

  // Imports the Google Cloud Data Loss Prevention library
  const DLP = require('@google-cloud/dlp').v2beta2;

  // Instantiates a client
  const dlp = new DLP.DlpServiceClient();

  // The project ID to run the API call under
  // const callingProjectId = process.env.GCLOUD_PROJECT;

  // The path to a local file to inspect. Can be a JPG or PNG image file.
  // const fileName = 'path/to/image.png';

  // The minimum likelihood required before redacting a match
  // const minLikelihood = 'LIKELIHOOD_UNSPECIFIED';

  // The infoTypes of information to redact
  // const infoTypes = [{ name: 'EMAIL_ADDRESS' }, { name: 'PHONE_NUMBER' }];

  // The local path to save the resulting image to.
  // const outputPath = 'result.png';

  const fileItem = {
    type: mime.getType(filepath) || 'application/octet-stream',
    data: Buffer.from(fs.readFileSync(filepath)).toString('base64')
  };

  const imageRedactionConfigs = infoTypes.map(infoType => {
    return {infoType: infoType};
  });

  const request = {
    parent: dlp.projectPath(callingProjectId),
    imageType: fileItem.type,
    imageData: fileItem.data,
    inspectConfig: {
      minLikelihood: minLikelihood,
      infoTypes: infoTypes
    },
    imageRedactionConfigs: imageRedactionConfigs
  };

  dlp
    .redactImage(request)
    .then(response => {
      const image = response[0].redactedImage;
      fs.writeFileSync(outputPath, image);
      console.log(`Saved image redaction results to path: ${outputPath}`);
    })
    .catch(err => {
      console.log(`Error in redactImage: ${err.message || err}`);
    });
  // [END redact_image]
}

const cli = require(`yargs`)
  .demand(1)
  .command(
    `image <filepath> <outputPath>`,
    `Redact sensitive data from an image using the Data Loss Prevention API.`,
    {},
    opts =>
      redactImage(
        opts.callingProject,
        opts.filepath,
        opts.minLikelihood,
        opts.infoTypes,
        opts.outputPath
      )
  )
  .option('m', {
    alias: 'minLikelihood',
    default: 'LIKELIHOOD_UNSPECIFIED',
    type: 'string',
    choices: [
      'LIKELIHOOD_UNSPECIFIED',
      'VERY_UNLIKELY',
      'UNLIKELY',
      'POSSIBLE',
      'LIKELY',
      'VERY_LIKELY'
    ],
    global: true
  })
  .option('t', {
    alias: 'infoTypes',
    required: true,
    type: 'array',
    global: true,
    coerce: infoTypes =>
      infoTypes.map(type => {
        return {name: type};
      })
  })
  .option('c', {
    alias: 'callingProject',
    default: process.env.GCLOUD_PROJECT,
    type: 'string',
    global: true
  })
  .example(`node $0 image resources/test.png result.png -t MALE_NAME`)
  .wrap(120)
  .recommendCommands()
  .epilogue(
    `For more information, see https://cloud.google.com/dlp/docs. Optional flags are explained at https://cloud.google.com/dlp/docs/reference/rest/v2beta2/InspectConfig`
  );

if (module === require.main) {
  cli.help().strict().argv; // eslint-disable-line
}
