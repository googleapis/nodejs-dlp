// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @namespace google
 */
/**
 * @namespace google.privacy
 */
/**
 * @namespace google.privacy.dlp
 */
/**
 * @namespace google.privacy.dlp.v2
 */
/**
 * @namespace google.protobuf
 */
/**
 * @namespace google.rpc
 */
/**
 * @namespace google.type
 */

'use strict';

// Import the clients for each version supported by this package.
const gapic = Object.freeze({
  v2: require('./v2'),
});

/**
 * The `@google-cloud/dlp` package has the following named exports:
 *
 * - `DlpServiceClient` - Reference to
 *   {@link v2.DlpServiceClient}
 * - `v2` - This is used for selecting or pinning a
 *   particular backend service version. It exports:
 *     - `DlpServiceClient` - Reference to
 *       {@link v2.DlpServiceClient}
 *
 * @module {object} @google-cloud/dlp
 * @alias nodejs-dlp
 *
 * @example <caption>Install the client library with <a href="https://www.npmjs.com/">npm</a>:</caption>
 * npm install --save @google-cloud/dlp
 *
 * @example <caption>Import the client library:</caption>
 * const dlp = require('@google-cloud/dlp');
 *
 * @example <caption>Create a client that uses <a href="https://goo.gl/64dyYX">Application Default Credentials (ADC)</a>:</caption>
 * const client = new dlp.DlpServiceClient();
 *
 * @example <caption>Create a client with <a href="https://goo.gl/RXp6VL">explicit credentials</a>:</caption>
 * const client = new dlp.DlpServiceClient({
 *   projectId: 'your-project-id',
 *   keyFilename: '/path/to/keyfile.json',
 * });
 */

/**
 * @type {object}
 * @property {constructor} DlpServiceClient
 *   Reference to {@link v2.DlpServiceClient}
 */
module.exports = gapic.v2;

/**
 * @type {object}
 * @property {constructor} DlpServiceClient
 *   Reference to {@link v2.DlpServiceClient}
 */
module.exports.v2 = gapic.v2;

// Alias `module.exports` as `module.exports.default`, for future-proofing.
module.exports.default = Object.assign({}, module.exports);
