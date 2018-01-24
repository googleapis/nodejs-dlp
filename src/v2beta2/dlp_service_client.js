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

'use strict';

const gapicConfig = require('./dlp_service_client_config');
const gax = require('google-gax');
const merge = require('lodash.merge');
const path = require('path');

const VERSION = require('../../package.json').version;

/**
 * The DLP API is a service that allows clients
 * to detect the presence of Personally Identifiable Information (PII) and other
 * privacy-sensitive data in user-supplied, unstructured data streams, like text
 * blocks or images.
 * The service also includes methods for sensitive data redaction and
 * scheduling of data scans on Google Cloud Platform based data sets.
 *
 * @class
 * @memberof v2beta2
 */
class DlpServiceClient {
  /**
   * Construct an instance of DlpServiceClient.
   *
   * @param {object} [options] - The configuration object. See the subsequent
   *   parameters for more details.
   * @param {object} [options.credentials] - Credentials object.
   * @param {string} [options.credentials.client_email]
   * @param {string} [options.credentials.private_key]
   * @param {string} [options.email] - Account email address. Required when
   *   usaing a .pem or .p12 keyFilename.
   * @param {string} [options.keyFilename] - Full path to the a .json, .pem, or
   *     .p12 key downloaded from the Google Developers Console. If you provide
   *     a path to a JSON file, the projectId option above is not necessary.
   *     NOTE: .pem and .p12 require you to specify options.email as well.
   * @param {number} [options.port] - The port on which to connect to
   *     the remote host.
   * @param {string} [options.projectId] - The project ID from the Google
   *     Developer's Console, e.g. 'grape-spaceship-123'. We will also check
   *     the environment variable GCLOUD_PROJECT for your project ID. If your
   *     app is running in an environment which supports
   *     {@link https://developers.google.com/identity/protocols/application-default-credentials Application Default Credentials},
   *     your project ID will be detected automatically.
   * @param {function} [options.promise] - Custom promise module to use instead
   *     of native Promises.
   * @param {string} [options.servicePath] - The domain name of the
   *     API remote host.
   */
  constructor(opts) {
    this._descriptors = {};

    // Ensure that options include the service address and port.
    opts = Object.assign(
      {
        clientConfig: {},
        port: this.constructor.port,
        servicePath: this.constructor.servicePath,
      },
      opts
    );

    // Create a `gaxGrpc` object, with any grpc-specific options
    // sent to the client.
    opts.scopes = this.constructor.scopes;
    var gaxGrpc = gax.grpc(opts);

    // Save the auth object to the client, for use by other methods.
    this.auth = gaxGrpc.auth;

    // Determine the client header string.
    var clientHeader = [
      `gl-node/${process.version.node}`,
      `grpc/${gaxGrpc.grpcVersion}`,
      `gax/${gax.version}`,
      `gapic/${VERSION}`,
    ];
    if (opts.libName && opts.libVersion) {
      clientHeader.push(`${opts.libName}/${opts.libVersion}`);
    }

    // Load the applicable protos.
    var protos = merge(
      {},
      gaxGrpc.loadProto(
        path.join(__dirname, '..', '..', 'protos'),
        'google/privacy/dlp/v2beta2/dlp.proto'
      )
    );

    // This API contains "path templates"; forward-slash-separated
    // identifiers to uniquely identify resources within the API.
    // Create useful helper objects for these.
    this._pathTemplates = {
      organizationPathTemplate: new gax.PathTemplate(
        'organizations/{organization}'
      ),
      deidentifyTemplatePathTemplate: new gax.PathTemplate(
        'organizations/{organization}/deidentifyTemplates/{deidentify_template}'
      ),
      deidentifyTemplate2PathTemplate: new gax.PathTemplate(
        'projects/{project}/deidentifyTemplates/{deidentify_template}'
      ),
      inspectTemplatePathTemplate: new gax.PathTemplate(
        'organizations/{organization}/inspectTemplates/{inspect_template}'
      ),
      inspectTemplate2PathTemplate: new gax.PathTemplate(
        'projects/{project}/inspectTemplates/{inspect_template}'
      ),
      projectPathTemplate: new gax.PathTemplate('projects/{project}'),
      dlpJobPathTemplate: new gax.PathTemplate(
        'projects/{project}/dlpJobs/{dlp_job}'
      ),
    };

    // Some of the methods on this service return "paged" results,
    // (e.g. 50 results at a time, with tokens to get subsequent
    // pages). Denote the keys used for pagination and results.
    this._descriptors.page = {
      listInspectTemplates: new gax.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'inspectTemplates'
      ),
      listDeidentifyTemplates: new gax.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'deidentifyTemplates'
      ),
      listDlpJobs: new gax.PageDescriptor('pageToken', 'nextPageToken', 'jobs'),
    };

    // Put together the default options sent with requests.
    var defaults = gaxGrpc.constructSettings(
      'google.privacy.dlp.v2beta2.DlpService',
      gapicConfig,
      opts.clientConfig,
      {'x-goog-api-client': clientHeader.join(' ')}
    );

    // Set up a dictionary of "inner API calls"; the core implementation
    // of calling the API is handled in `google-gax`, with this code
    // merely providing the destination and request information.
    this._innerApiCalls = {};

    // Put together the "service stub" for
    // google.privacy.dlp.v2beta2.DlpService.
    var dlpServiceStub = gaxGrpc.createStub(
      protos.google.privacy.dlp.v2beta2.DlpService,
      opts
    );

    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    var dlpServiceStubMethods = [
      'inspectContent',
      'redactImage',
      'deidentifyContent',
      'reidentifyContent',
      'inspectDataSource',
      'analyzeDataSourceRisk',
      'listInfoTypes',
      'createInspectTemplate',
      'updateInspectTemplate',
      'getInspectTemplate',
      'listInspectTemplates',
      'deleteInspectTemplate',
      'createDeidentifyTemplate',
      'updateDeidentifyTemplate',
      'getDeidentifyTemplate',
      'listDeidentifyTemplates',
      'deleteDeidentifyTemplate',
      'listDlpJobs',
      'getDlpJob',
      'deleteDlpJob',
      'cancelDlpJob',
    ];
    for (let methodName of dlpServiceStubMethods) {
      this._innerApiCalls[methodName] = gax.createApiCall(
        dlpServiceStub.then(
          stub =>
            function() {
              var args = Array.prototype.slice.call(arguments, 0);
              return stub[methodName].apply(stub, args);
            }
        ),
        defaults[methodName],
        this._descriptors.page[methodName]
      );
    }
  }

  /**
   * The DNS address for this API service.
   */
  static get servicePath() {
    return 'dlp.googleapis.com';
  }

  /**
   * The port for this API service.
   */
  static get port() {
    return 443;
  }

  /**
   * The scopes needed to make gRPC calls for every method defined
   * in this service.
   */
  static get scopes() {
    return ['https://www.googleapis.com/auth/cloud-platform'];
  }

  /**
   * Return the project ID used by this class.
   * @param {function(Error, string)} callback - the callback to
   *   be called with the current project Id.
   */
  getProjectId(callback) {
    return this.auth.getProjectId(callback);
  }

  // -------------------
  // -- Service calls --
  // -------------------

  /**
   * Finds potentially sensitive info in content.
   * This method has limits on input size, processing time, and output size.
   * [How-to guide for text](https://cloud.google.com/dlp/docs/inspecting-text), [How-to guide for
   * images](https://cloud.google.com/dlp/docs/inspecting-images)
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id.
   * @param {Object} [request.inspectConfig]
   *   Configuration for the inspector. What specified here will override
   *   the template referenced by the inspect_template_name argument.
   *
   *   This object should have the same structure as [InspectConfig]{@link google.privacy.dlp.v2beta2.InspectConfig}
   * @param {Object} [request.item]
   *   The item to inspect.
   *
   *   This object should have the same structure as [ContentItem]{@link google.privacy.dlp.v2beta2.ContentItem}
   * @param {string} [request.inspectTemplateName]
   *   Optional template to use. Any configuration directly specified in
   *   inspect_config will override those set in the template. Singular fields
   *   that are set in this request will replace their corresponding fields in the
   *   template. Repeated fields are appended. Singular sub-messages and groups
   *   are recursively merged.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [InspectContentResponse]{@link google.privacy.dlp.v2beta2.InspectContentResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [InspectContentResponse]{@link google.privacy.dlp.v2beta2.InspectContentResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.projectPath('[PROJECT]');
   * client.inspectContent({parent: formattedParent})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  inspectContent(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.inspectContent(request, options, callback);
  }

  /**
   * Redacts potentially sensitive info from an image.
   * This method has limits on input size, processing time, and output size.
   * [How-to guide](https://cloud.google.com/dlp/docs/redacting-sensitive-data-images)
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id.
   * @param {Object} [request.inspectConfig]
   *   Configuration for the inspector.
   *
   *   This object should have the same structure as [InspectConfig]{@link google.privacy.dlp.v2beta2.InspectConfig}
   * @param {string} [request.imageType]
   *   Type of the content, as defined in Content-Type HTTP header.
   *   Supported types are: PNG, JPEG, SVG, & BMP.
   * @param {string} [request.imageData]
   *   The bytes of the image to redact.
   * @param {Object[]} [request.imageRedactionConfigs]
   *   The configuration for specifying what content to redact from images.
   *
   *   This object should have the same structure as [ImageRedactionConfig]{@link google.privacy.dlp.v2beta2.ImageRedactionConfig}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [RedactImageResponse]{@link google.privacy.dlp.v2beta2.RedactImageResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [RedactImageResponse]{@link google.privacy.dlp.v2beta2.RedactImageResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.projectPath('[PROJECT]');
   * client.redactImage({parent: formattedParent})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  redactImage(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.redactImage(request, options, callback);
  }

  /**
   * De-identifies potentially sensitive info from a ContentItem.
   * This method has limits on input size and output size.
   * [How-to guide](https://cloud.google.com/dlp/docs/deidentify-sensitive-data)
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id.
   * @param {Object} [request.deidentifyConfig]
   *   Configuration for the de-identification of the content item.
   *   Items specified here will override the template referenced by the
   *   deidentify_template_name argument.
   *
   *   This object should have the same structure as [DeidentifyConfig]{@link google.privacy.dlp.v2beta2.DeidentifyConfig}
   * @param {Object} [request.inspectConfig]
   *   Configuration for the inspector.
   *   Items specified here will override the template referenced by the
   *   inspect_template_name argument.
   *
   *   This object should have the same structure as [InspectConfig]{@link google.privacy.dlp.v2beta2.InspectConfig}
   * @param {Object} [request.item]
   *   The item to de-identify. Will be treated as text.
   *
   *   This object should have the same structure as [ContentItem]{@link google.privacy.dlp.v2beta2.ContentItem}
   * @param {string} [request.inspectTemplateName]
   *   Optional template to use. Any configuration directly specified in
   *   inspect_config will override those set in the template. Singular fields
   *   that are set in this request will replace their corresponding fields in the
   *   template. Repeated fields are appended. Singular sub-messages and groups
   *   are recursively merged.
   * @param {string} [request.deidentifyTemplateName]
   *   Optional template to use. Any configuration directly specified in
   *   deidentify_config will override those set in the template. Singular fields
   *   that are set in this request will replace their corresponding fields in the
   *   template. Repeated fields are appended. Singular sub-messages and groups
   *   are recursively merged.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [DeidentifyContentResponse]{@link google.privacy.dlp.v2beta2.DeidentifyContentResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [DeidentifyContentResponse]{@link google.privacy.dlp.v2beta2.DeidentifyContentResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.projectPath('[PROJECT]');
   * client.deidentifyContent({parent: formattedParent})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  deidentifyContent(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.deidentifyContent(request, options, callback);
  }

  /**
   * Re-identify content that has been de-identified.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name.
   * @param {Object} [request.reidentifyConfig]
   *   Configuration for the re-identification of the content item.
   *   This field shares the same proto message type that is used for
   *   de-identification, however its usage here is for the reversal of the
   *   previous de-identification. Re-identification is performed by examining
   *   the transformations used to de-identify the items and executing the
   *   reverse. This requires that only reversible transformations
   *   be provided here. The reversible transformations are:
   *
   *    - `CryptoReplaceFfxFpeConfig`
   *
   *   This object should have the same structure as [DeidentifyConfig]{@link google.privacy.dlp.v2beta2.DeidentifyConfig}
   * @param {Object} [request.inspectConfig]
   *   Configuration for the inspector.
   *
   *   This object should have the same structure as [InspectConfig]{@link google.privacy.dlp.v2beta2.InspectConfig}
   * @param {Object} [request.item]
   *   The item to re-identify. Will be treated as text.
   *
   *   This object should have the same structure as [ContentItem]{@link google.privacy.dlp.v2beta2.ContentItem}
   * @param {string} [request.inspectTemplateName]
   *   Optional template to use. Any configuration directly specified in
   *   `inspect_config` will override those set in the template. Singular fields
   *   that are set in this request will replace their corresponding fields in the
   *   template. Repeated fields are appended. Singular sub-messages and groups
   *   are recursively merged.
   * @param {string} [request.reidentifyTemplateName]
   *   Optional template to use. References an instance of `DeidentifyTemplate`.
   *   Any configuration directly specified in `reidentify_config` or
   *   `inspect_config` will override those set in the template. Singular fields
   *   that are set in this request will replace their corresponding fields in the
   *   template. Repeated fields are appended. Singular sub-messages and groups
   *   are recursively merged.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [ReidentifyContentResponse]{@link google.privacy.dlp.v2beta2.ReidentifyContentResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [ReidentifyContentResponse]{@link google.privacy.dlp.v2beta2.ReidentifyContentResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.projectPath('[PROJECT]');
   * client.reidentifyContent({parent: formattedParent})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  reidentifyContent(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.reidentifyContent(request, options, callback);
  }

  /**
   * Schedules a job scanning content in a Google Cloud Platform data
   * repository. [How-to guide](https://cloud.google.com/dlp/docs/inspecting-storage)
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id.
   * @param {Object} [request.jobConfig]
   *   A configuration for the job.
   *
   *   This object should have the same structure as [InspectJobConfig]{@link google.privacy.dlp.v2beta2.InspectJobConfig}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.projectPath('[PROJECT]');
   * client.inspectDataSource({parent: formattedParent})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  inspectDataSource(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.inspectDataSource(request, options, callback);
  }

  /**
   * Schedules a job to compute risk analysis metrics over content in a Google
   * Cloud Platform repository. [How-to guide}(/dlp/docs/compute-risk-analysis)
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id.
   * @param {Object} [request.jobConfig]
   *   Configuration for this risk analysis job.
   *
   *   This object should have the same structure as [RiskAnalysisJobConfig]{@link google.privacy.dlp.v2beta2.RiskAnalysisJobConfig}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.projectPath('[PROJECT]');
   * client.analyzeDataSourceRisk({parent: formattedParent})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  analyzeDataSourceRisk(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.analyzeDataSourceRisk(
      request,
      options,
      callback
    );
  }

  /**
   * Returns sensitive information types DLP supports.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.languageCode]
   *   Optional BCP-47 language code for localized infoType friendly
   *   names. If omitted, or if localized strings are not available,
   *   en-US strings will be returned.
   * @param {string} [request.filter]
   *   Optional filter to only return infoTypes supported by certain parts of the
   *   API. Defaults to supported_by=INSPECT.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [ListInfoTypesResponse]{@link google.privacy.dlp.v2beta2.ListInfoTypesResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [ListInfoTypesResponse]{@link google.privacy.dlp.v2beta2.ListInfoTypesResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   *
   * client.listInfoTypes({})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listInfoTypes(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.listInfoTypes(request, options, callback);
  }

  /**
   * Creates an inspect template for re-using frequently used configuration
   * for inspecting content, images, and storage.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id or
   *   organizations/my-org-id.
   * @param {Object} [request.inspectTemplate]
   *   The InspectTemplate to create.
   *
   *   This object should have the same structure as [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}
   * @param {string} [request.templateId]
   *   The template id can contain uppercase and lowercase letters,
   *   numbers, and hyphens; that is, it must match the regular
   *   expression: `[a-zA-Z\\d-]+`. The maximum length is 100
   *   characters. Can be empty to allow the system to generate one.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.organizationPath('[ORGANIZATION]');
   * client.createInspectTemplate({parent: formattedParent})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  createInspectTemplate(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.createInspectTemplate(
      request,
      options,
      callback
    );
  }

  /**
   * Updates the inspect template.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Resource name of organization and inspectTemplate to be updated, for
   *   example `organizations/433245324/inspectTemplates/432452342`.
   * @param {Object} [request.inspectTemplate]
   *   New InspectTemplate value.
   *
   *   This object should have the same structure as [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}
   * @param {Object} [request.updateMask]
   *   Mask to control which fields get updated.
   *
   *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.inspectTemplatePath('[ORGANIZATION]', '[INSPECT_TEMPLATE]');
   * client.updateInspectTemplate({name: formattedName})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  updateInspectTemplate(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.updateInspectTemplate(
      request,
      options,
      callback
    );
  }

  /**
   * Gets an inspect template.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.name]
   *   Resource name of the organization and inspectTemplate to be read, for
   *   example `organizations/433245324/inspectTemplates/432452342`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   *
   * client.getInspectTemplate({})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  getInspectTemplate(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.getInspectTemplate(request, options, callback);
  }

  /**
   * Lists inspect templates.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id or
   *   organizations/my-org-id.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Array, ?Object, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is Array of [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}.
   *
   *   When autoPaginate: false is specified through options, it contains the result
   *   in a single response. If the response indicates the next page exists, the third
   *   parameter is set to be used for the next request object. The fourth parameter keeps
   *   the raw response object of an object representing [ListInspectTemplatesResponse]{@link google.privacy.dlp.v2beta2.ListInspectTemplatesResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is Array of [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate}.
   *
   *   When autoPaginate: false is specified through options, the array has three elements.
   *   The first element is Array of [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate} in a single response.
   *   The second element is the next request object if the response
   *   indicates the next page exists, or null. The third element is
   *   an object representing [ListInspectTemplatesResponse]{@link google.privacy.dlp.v2beta2.ListInspectTemplatesResponse}.
   *
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * var formattedParent = client.organizationPath('[ORGANIZATION]');
   *
   * client.listInspectTemplates({parent: formattedParent})
   *   .then(responses => {
   *     var resources = responses[0];
   *     for (let i = 0; i < resources.length; i += 1) {
   *       // doThingsWith(resources[i])
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   * var formattedParent = client.organizationPath('[ORGANIZATION]');
   *
   *
   * var options = {autoPaginate: false};
   * var callback = responses => {
   *   // The actual resources in a response.
   *   var resources = responses[0];
   *   // The next request if the response shows that there are more responses.
   *   var nextRequest = responses[1];
   *   // The actual response object, if necessary.
   *   // var rawResponse = responses[2];
   *   for (let i = 0; i < resources.length; i += 1) {
   *     // doThingsWith(resources[i]);
   *   }
   *   if (nextRequest) {
   *     // Fetch the next page.
   *     return client.listInspectTemplates(nextRequest, options).then(callback);
   *   }
   * }
   * client.listInspectTemplates({parent: formattedParent}, options)
   *   .then(callback)
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listInspectTemplates(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.listInspectTemplates(request, options, callback);
  }

  /**
   * Equivalent to {@link listInspectTemplates}, but returns a NodeJS Stream object.
   *
   * This fetches the paged responses for {@link listInspectTemplates} continuously
   * and invokes the callback registered for 'data' event for each element in the
   * responses.
   *
   * The returned object has 'end' method when no more elements are required.
   *
   * autoPaginate option will be ignored.
   *
   * @see {@link https://nodejs.org/api/stream.html}
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id or
   *   organizations/my-org-id.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @returns {Stream}
   *   An object stream which emits an object representing [InspectTemplate]{@link google.privacy.dlp.v2beta2.InspectTemplate} on 'data' event.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.organizationPath('[ORGANIZATION]');
   * client.listInspectTemplatesStream({parent: formattedParent})
   *   .on('data', element => {
   *     // doThingsWith(element)
   *   }).on('error', err => {
   *     console.log(err);
   *   });
   */
  listInspectTemplatesStream(request, options) {
    options = options || {};

    return this._descriptors.page.listInspectTemplates.createStream(
      this._innerApiCalls.listInspectTemplates,
      request,
      options
    );
  }

  /**
   * Deletes inspect templates.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Resource name of the organization and inspectTemplate to be deleted, for
   *   example `organizations/433245324/inspectTemplates/432452342`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.inspectTemplatePath('[ORGANIZATION]', '[INSPECT_TEMPLATE]');
   * client.deleteInspectTemplate({name: formattedName}).catch(err => {
   *   console.error(err);
   * });
   */
  deleteInspectTemplate(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.deleteInspectTemplate(
      request,
      options,
      callback
    );
  }

  /**
   * Creates an Deidentify template for re-using frequently used configuration
   * for Deidentifying content, images, and storage.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id or
   *   organizations/my-org-id.
   * @param {Object} [request.deidentifyTemplate]
   *   The DeidentifyTemplate to create.
   *
   *   This object should have the same structure as [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}
   * @param {string} [request.templateId]
   *   The template id can contain uppercase and lowercase letters,
   *   numbers, and hyphens; that is, it must match the regular
   *   expression: `[a-zA-Z\\d-]+`. The maximum length is 100
   *   characters. Can be empty to allow the system to generate one.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.organizationPath('[ORGANIZATION]');
   * client.createDeidentifyTemplate({parent: formattedParent})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  createDeidentifyTemplate(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.createDeidentifyTemplate(
      request,
      options,
      callback
    );
  }

  /**
   * Updates the inspect template.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Resource name of organization and deidentify template to be updated, for
   *   example `organizations/433245324/deidentifyTemplates/432452342`.
   * @param {Object} [request.deidentifyTemplate]
   *   New DeidentifyTemplate value.
   *
   *   This object should have the same structure as [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}
   * @param {Object} [request.updateMask]
   *   Mask to control which fields get updated.
   *
   *   This object should have the same structure as [FieldMask]{@link google.protobuf.FieldMask}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.deidentifyTemplatePath('[ORGANIZATION]', '[DEIDENTIFY_TEMPLATE]');
   * client.updateDeidentifyTemplate({name: formattedName})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  updateDeidentifyTemplate(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.updateDeidentifyTemplate(
      request,
      options,
      callback
    );
  }

  /**
   * Gets an inspect template.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Resource name of the organization and deidentify template to be read, for
   *   example `organizations/433245324/deidentifyTemplates/432452342`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.deidentifyTemplatePath('[ORGANIZATION]', '[DEIDENTIFY_TEMPLATE]');
   * client.getDeidentifyTemplate({name: formattedName})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  getDeidentifyTemplate(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.getDeidentifyTemplate(
      request,
      options,
      callback
    );
  }

  /**
   * Lists inspect templates.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id or
   *   organizations/my-org-id.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Array, ?Object, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is Array of [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}.
   *
   *   When autoPaginate: false is specified through options, it contains the result
   *   in a single response. If the response indicates the next page exists, the third
   *   parameter is set to be used for the next request object. The fourth parameter keeps
   *   the raw response object of an object representing [ListDeidentifyTemplatesResponse]{@link google.privacy.dlp.v2beta2.ListDeidentifyTemplatesResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is Array of [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate}.
   *
   *   When autoPaginate: false is specified through options, the array has three elements.
   *   The first element is Array of [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate} in a single response.
   *   The second element is the next request object if the response
   *   indicates the next page exists, or null. The third element is
   *   an object representing [ListDeidentifyTemplatesResponse]{@link google.privacy.dlp.v2beta2.ListDeidentifyTemplatesResponse}.
   *
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * var formattedParent = client.organizationPath('[ORGANIZATION]');
   *
   * client.listDeidentifyTemplates({parent: formattedParent})
   *   .then(responses => {
   *     var resources = responses[0];
   *     for (let i = 0; i < resources.length; i += 1) {
   *       // doThingsWith(resources[i])
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   * var formattedParent = client.organizationPath('[ORGANIZATION]');
   *
   *
   * var options = {autoPaginate: false};
   * var callback = responses => {
   *   // The actual resources in a response.
   *   var resources = responses[0];
   *   // The next request if the response shows that there are more responses.
   *   var nextRequest = responses[1];
   *   // The actual response object, if necessary.
   *   // var rawResponse = responses[2];
   *   for (let i = 0; i < resources.length; i += 1) {
   *     // doThingsWith(resources[i]);
   *   }
   *   if (nextRequest) {
   *     // Fetch the next page.
   *     return client.listDeidentifyTemplates(nextRequest, options).then(callback);
   *   }
   * }
   * client.listDeidentifyTemplates({parent: formattedParent}, options)
   *   .then(callback)
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listDeidentifyTemplates(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.listDeidentifyTemplates(
      request,
      options,
      callback
    );
  }

  /**
   * Equivalent to {@link listDeidentifyTemplates}, but returns a NodeJS Stream object.
   *
   * This fetches the paged responses for {@link listDeidentifyTemplates} continuously
   * and invokes the callback registered for 'data' event for each element in the
   * responses.
   *
   * The returned object has 'end' method when no more elements are required.
   *
   * autoPaginate option will be ignored.
   *
   * @see {@link https://nodejs.org/api/stream.html}
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id or
   *   organizations/my-org-id.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @returns {Stream}
   *   An object stream which emits an object representing [DeidentifyTemplate]{@link google.privacy.dlp.v2beta2.DeidentifyTemplate} on 'data' event.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.organizationPath('[ORGANIZATION]');
   * client.listDeidentifyTemplatesStream({parent: formattedParent})
   *   .on('data', element => {
   *     // doThingsWith(element)
   *   }).on('error', err => {
   *     console.log(err);
   *   });
   */
  listDeidentifyTemplatesStream(request, options) {
    options = options || {};

    return this._descriptors.page.listDeidentifyTemplates.createStream(
      this._innerApiCalls.listDeidentifyTemplates,
      request,
      options
    );
  }

  /**
   * Deletes inspect templates.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   Resource name of the organization and deidentify template to be deleted,
   *   for example `organizations/433245324/deidentifyTemplates/432452342`.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.deidentifyTemplatePath('[ORGANIZATION]', '[DEIDENTIFY_TEMPLATE]');
   * client.deleteDeidentifyTemplate({name: formattedName}).catch(err => {
   *   console.error(err);
   * });
   */
  deleteDeidentifyTemplate(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.deleteDeidentifyTemplate(
      request,
      options,
      callback
    );
  }

  /**
   * Lists DlpJobs that match the specified filter in the request.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id.
   * @param {string} [request.filter]
   *   Optional. Allows filtering.
   *
   *   Supported syntax:
   *
   *   * Filter expressions are made up of one or more restrictions.
   *   * Restrictions can be combined by `AND` or `OR` logical operators. A
   *   sequence of restrictions implicitly uses `AND`.
   *   * A restriction has the form of `<field> <operator> <value>`.
   *   * Supported fields/values for inspect jobs:
   *       - `state` - PENDING|RUNNING|CANCELED|FINISHED|FAILED
   *       - `inspected_storage` - DATASTORE|CLOUD_STORAGE|BIGQUERY
   *   * Supported fields for risk analysis jobs:
   *       - `state` - RUNNING|CANCELED|FINISHED|FAILED
   *   * The operator must be `=` or `!=`.
   *
   *   Examples:
   *
   *   * inspected_storage = cloud_storage AND state = done
   *   * inspected_storage = cloud_storage OR inspected_storage = bigquery
   *   * inspected_storage = cloud_storage AND (state = done OR state = canceled)
   *
   *   The length of this field should be no more than 500 characters.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {number} [request.type]
   *   The type of job. Defaults to `DlpJobType.INSPECT`
   *
   *   The number should be among the values of [DlpJobType]{@link google.privacy.dlp.v2beta2.DlpJobType}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Array, ?Object, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is Array of [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob}.
   *
   *   When autoPaginate: false is specified through options, it contains the result
   *   in a single response. If the response indicates the next page exists, the third
   *   parameter is set to be used for the next request object. The fourth parameter keeps
   *   the raw response object of an object representing [ListDlpJobsResponse]{@link google.privacy.dlp.v2beta2.ListDlpJobsResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is Array of [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob}.
   *
   *   When autoPaginate: false is specified through options, the array has three elements.
   *   The first element is Array of [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob} in a single response.
   *   The second element is the next request object if the response
   *   indicates the next page exists, or null. The third element is
   *   an object representing [ListDlpJobsResponse]{@link google.privacy.dlp.v2beta2.ListDlpJobsResponse}.
   *
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * // Iterate over all elements.
   * var formattedParent = client.projectPath('[PROJECT]');
   *
   * client.listDlpJobs({parent: formattedParent})
   *   .then(responses => {
   *     var resources = responses[0];
   *     for (let i = 0; i < resources.length; i += 1) {
   *       // doThingsWith(resources[i])
   *     }
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   * // Or obtain the paged response.
   * var formattedParent = client.projectPath('[PROJECT]');
   *
   *
   * var options = {autoPaginate: false};
   * var callback = responses => {
   *   // The actual resources in a response.
   *   var resources = responses[0];
   *   // The next request if the response shows that there are more responses.
   *   var nextRequest = responses[1];
   *   // The actual response object, if necessary.
   *   // var rawResponse = responses[2];
   *   for (let i = 0; i < resources.length; i += 1) {
   *     // doThingsWith(resources[i]);
   *   }
   *   if (nextRequest) {
   *     // Fetch the next page.
   *     return client.listDlpJobs(nextRequest, options).then(callback);
   *   }
   * }
   * client.listDlpJobs({parent: formattedParent}, options)
   *   .then(callback)
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  listDlpJobs(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.listDlpJobs(request, options, callback);
  }

  /**
   * Equivalent to {@link listDlpJobs}, but returns a NodeJS Stream object.
   *
   * This fetches the paged responses for {@link listDlpJobs} continuously
   * and invokes the callback registered for 'data' event for each element in the
   * responses.
   *
   * The returned object has 'end' method when no more elements are required.
   *
   * autoPaginate option will be ignored.
   *
   * @see {@link https://nodejs.org/api/stream.html}
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.parent
   *   The parent resource name, for example projects/my-project-id.
   * @param {string} [request.filter]
   *   Optional. Allows filtering.
   *
   *   Supported syntax:
   *
   *   * Filter expressions are made up of one or more restrictions.
   *   * Restrictions can be combined by `AND` or `OR` logical operators. A
   *   sequence of restrictions implicitly uses `AND`.
   *   * A restriction has the form of `<field> <operator> <value>`.
   *   * Supported fields/values for inspect jobs:
   *       - `state` - PENDING|RUNNING|CANCELED|FINISHED|FAILED
   *       - `inspected_storage` - DATASTORE|CLOUD_STORAGE|BIGQUERY
   *   * Supported fields for risk analysis jobs:
   *       - `state` - RUNNING|CANCELED|FINISHED|FAILED
   *   * The operator must be `=` or `!=`.
   *
   *   Examples:
   *
   *   * inspected_storage = cloud_storage AND state = done
   *   * inspected_storage = cloud_storage OR inspected_storage = bigquery
   *   * inspected_storage = cloud_storage AND (state = done OR state = canceled)
   *
   *   The length of this field should be no more than 500 characters.
   * @param {number} [request.pageSize]
   *   The maximum number of resources contained in the underlying API
   *   response. If page streaming is performed per-resource, this
   *   parameter does not affect the return value. If page streaming is
   *   performed per-page, this determines the maximum number of
   *   resources in a page.
   * @param {number} [request.type]
   *   The type of job. Defaults to `DlpJobType.INSPECT`
   *
   *   The number should be among the values of [DlpJobType]{@link google.privacy.dlp.v2beta2.DlpJobType}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @returns {Stream}
   *   An object stream which emits an object representing [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob} on 'data' event.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedParent = client.projectPath('[PROJECT]');
   * client.listDlpJobsStream({parent: formattedParent})
   *   .on('data', element => {
   *     // doThingsWith(element)
   *   }).on('error', err => {
   *     console.log(err);
   *   });
   */
  listDlpJobsStream(request, options) {
    options = options || {};

    return this._descriptors.page.listDlpJobs.createStream(
      this._innerApiCalls.listDlpJobs,
      request,
      options
    );
  }

  /**
   * Gets the latest state of a long-running DlpJob.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   The name of the DlpJob resource.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [DlpJob]{@link google.privacy.dlp.v2beta2.DlpJob}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.dlpJobPath('[PROJECT]', '[DLP_JOB]');
   * client.getDlpJob({name: formattedName})
   *   .then(responses => {
   *     var response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  getDlpJob(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.getDlpJob(request, options, callback);
  }

  /**
   * Deletes a long-running DlpJob. This method indicates that the client is
   * no longer interested in the DlpJob result. The job will be cancelled if
   * possible.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   The name of the DlpJob resource to be deleted.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.dlpJobPath('[PROJECT]', '[DLP_JOB]');
   * client.deleteDlpJob({name: formattedName}).catch(err => {
   *   console.error(err);
   * });
   */
  deleteDlpJob(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.deleteDlpJob(request, options, callback);
  }

  /**
   * Starts asynchronous cancellation on a long-running DlpJob.  The server
   * makes a best effort to cancel the DlpJob, but success is not
   * guaranteed.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} request.name
   *   The name of the DlpJob resource to be cancelled.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
   * @param {function(?Error)} [callback]
   *   The function which will be called with the result of the API call.
   * @returns {Promise} - The promise which resolves when API call finishes.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const dlp = require('@google-cloud/dlp');
   *
   * var client = new dlp.v2beta2.DlpServiceClient({
   *   // optional auth parameters.
   * });
   *
   * var formattedName = client.dlpJobPath('[PROJECT]', '[DLP_JOB]');
   * client.cancelDlpJob({name: formattedName}).catch(err => {
   *   console.error(err);
   * });
   */
  cancelDlpJob(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.cancelDlpJob(request, options, callback);
  }

  // --------------------
  // -- Path templates --
  // --------------------

  /**
   * Return a fully-qualified organization resource name string.
   *
   * @param {String} organization
   * @returns {String}
   */
  organizationPath(organization) {
    return this._pathTemplates.organizationPathTemplate.render({
      organization: organization,
    });
  }

  /**
   * Return a fully-qualified deidentify_template resource name string.
   *
   * @param {String} organization
   * @param {String} deidentifyTemplate
   * @returns {String}
   */
  deidentifyTemplatePath(organization, deidentifyTemplate) {
    return this._pathTemplates.deidentifyTemplatePathTemplate.render({
      organization: organization,
      deidentify_template: deidentifyTemplate,
    });
  }

  /**
   * Return a fully-qualified deidentify_template_2 resource name string.
   *
   * @param {String} project
   * @param {String} deidentifyTemplate
   * @returns {String}
   */
  deidentifyTemplate2Path(project, deidentifyTemplate) {
    return this._pathTemplates.deidentifyTemplate2PathTemplate.render({
      project: project,
      deidentify_template: deidentifyTemplate,
    });
  }

  /**
   * Return a fully-qualified inspect_template resource name string.
   *
   * @param {String} organization
   * @param {String} inspectTemplate
   * @returns {String}
   */
  inspectTemplatePath(organization, inspectTemplate) {
    return this._pathTemplates.inspectTemplatePathTemplate.render({
      organization: organization,
      inspect_template: inspectTemplate,
    });
  }

  /**
   * Return a fully-qualified inspect_template_2 resource name string.
   *
   * @param {String} project
   * @param {String} inspectTemplate
   * @returns {String}
   */
  inspectTemplate2Path(project, inspectTemplate) {
    return this._pathTemplates.inspectTemplate2PathTemplate.render({
      project: project,
      inspect_template: inspectTemplate,
    });
  }

  /**
   * Return a fully-qualified project resource name string.
   *
   * @param {String} project
   * @returns {String}
   */
  projectPath(project) {
    return this._pathTemplates.projectPathTemplate.render({
      project: project,
    });
  }

  /**
   * Return a fully-qualified dlp_job resource name string.
   *
   * @param {String} project
   * @param {String} dlpJob
   * @returns {String}
   */
  dlpJobPath(project, dlpJob) {
    return this._pathTemplates.dlpJobPathTemplate.render({
      project: project,
      dlp_job: dlpJob,
    });
  }

  /**
   * Parse the organizationName from a organization resource.
   *
   * @param {String} organizationName
   *   A fully-qualified path representing a organization resources.
   * @returns {String} - A string representing the organization.
   */
  matchOrganizationFromOrganizationName(organizationName) {
    return this._pathTemplates.organizationPathTemplate.match(organizationName)
      .organization;
  }

  /**
   * Parse the deidentifyTemplateName from a deidentify_template resource.
   *
   * @param {String} deidentifyTemplateName
   *   A fully-qualified path representing a deidentify_template resources.
   * @returns {String} - A string representing the organization.
   */
  matchOrganizationFromDeidentifyTemplateName(deidentifyTemplateName) {
    return this._pathTemplates.deidentifyTemplatePathTemplate.match(
      deidentifyTemplateName
    ).organization;
  }

  /**
   * Parse the deidentifyTemplateName from a deidentify_template resource.
   *
   * @param {String} deidentifyTemplateName
   *   A fully-qualified path representing a deidentify_template resources.
   * @returns {String} - A string representing the deidentify_template.
   */
  matchDeidentifyTemplateFromDeidentifyTemplateName(deidentifyTemplateName) {
    return this._pathTemplates.deidentifyTemplatePathTemplate.match(
      deidentifyTemplateName
    ).deidentify_template;
  }

  /**
   * Parse the deidentifyTemplate2Name from a deidentify_template_2 resource.
   *
   * @param {String} deidentifyTemplate2Name
   *   A fully-qualified path representing a deidentify_template_2 resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromDeidentifyTemplate2Name(deidentifyTemplate2Name) {
    return this._pathTemplates.deidentifyTemplate2PathTemplate.match(
      deidentifyTemplate2Name
    ).project;
  }

  /**
   * Parse the deidentifyTemplate2Name from a deidentify_template_2 resource.
   *
   * @param {String} deidentifyTemplate2Name
   *   A fully-qualified path representing a deidentify_template_2 resources.
   * @returns {String} - A string representing the deidentify_template.
   */
  matchDeidentifyTemplateFromDeidentifyTemplate2Name(deidentifyTemplate2Name) {
    return this._pathTemplates.deidentifyTemplate2PathTemplate.match(
      deidentifyTemplate2Name
    ).deidentify_template;
  }

  /**
   * Parse the inspectTemplateName from a inspect_template resource.
   *
   * @param {String} inspectTemplateName
   *   A fully-qualified path representing a inspect_template resources.
   * @returns {String} - A string representing the organization.
   */
  matchOrganizationFromInspectTemplateName(inspectTemplateName) {
    return this._pathTemplates.inspectTemplatePathTemplate.match(
      inspectTemplateName
    ).organization;
  }

  /**
   * Parse the inspectTemplateName from a inspect_template resource.
   *
   * @param {String} inspectTemplateName
   *   A fully-qualified path representing a inspect_template resources.
   * @returns {String} - A string representing the inspect_template.
   */
  matchInspectTemplateFromInspectTemplateName(inspectTemplateName) {
    return this._pathTemplates.inspectTemplatePathTemplate.match(
      inspectTemplateName
    ).inspect_template;
  }

  /**
   * Parse the inspectTemplate2Name from a inspect_template_2 resource.
   *
   * @param {String} inspectTemplate2Name
   *   A fully-qualified path representing a inspect_template_2 resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromInspectTemplate2Name(inspectTemplate2Name) {
    return this._pathTemplates.inspectTemplate2PathTemplate.match(
      inspectTemplate2Name
    ).project;
  }

  /**
   * Parse the inspectTemplate2Name from a inspect_template_2 resource.
   *
   * @param {String} inspectTemplate2Name
   *   A fully-qualified path representing a inspect_template_2 resources.
   * @returns {String} - A string representing the inspect_template.
   */
  matchInspectTemplateFromInspectTemplate2Name(inspectTemplate2Name) {
    return this._pathTemplates.inspectTemplate2PathTemplate.match(
      inspectTemplate2Name
    ).inspect_template;
  }

  /**
   * Parse the projectName from a project resource.
   *
   * @param {String} projectName
   *   A fully-qualified path representing a project resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromProjectName(projectName) {
    return this._pathTemplates.projectPathTemplate.match(projectName).project;
  }

  /**
   * Parse the dlpJobName from a dlp_job resource.
   *
   * @param {String} dlpJobName
   *   A fully-qualified path representing a dlp_job resources.
   * @returns {String} - A string representing the project.
   */
  matchProjectFromDlpJobName(dlpJobName) {
    return this._pathTemplates.dlpJobPathTemplate.match(dlpJobName).project;
  }

  /**
   * Parse the dlpJobName from a dlp_job resource.
   *
   * @param {String} dlpJobName
   *   A fully-qualified path representing a dlp_job resources.
   * @returns {String} - A string representing the dlp_job.
   */
  matchDlpJobFromDlpJobName(dlpJobName) {
    return this._pathTemplates.dlpJobPathTemplate.match(dlpJobName).dlp_job;
  }
}

module.exports = DlpServiceClient;
