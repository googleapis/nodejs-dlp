// Copyright 2017, Google LLC All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Note: this file is purely for documentation. Any contents are not expected
// to be loaded as the JS file.

/**
 * Type of information detected by the API.
 *
 * @property {string} name
 *   Name of the information type.
 *
 * @typedef InfoType
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.InfoType definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var InfoType = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Custom information type provided by the user. Used to find domain-specific
 * sensitive information configurable to the data in question.
 *
 * @property {Object} infoType
 *   Info type configuration. All custom info types must have configurations
 *   that do not conflict with built-in info types or other custom info types.
 *
 *   This object should have the same structure as [InfoType]{@link google.privacy.dlp.v2beta1.InfoType}
 *
 * @property {Object} dictionary
 *   Dictionary-based custom info type.
 *
 *   This object should have the same structure as [Dictionary]{@link google.privacy.dlp.v2beta1.Dictionary}
 *
 * @typedef CustomInfoType
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.CustomInfoType definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var CustomInfoType = {
  // This is for documentation. Actual contents will be loaded by gRPC.

  /**
   * Custom information type based on a dictionary of words or phrases. This can
   * be used to match sensitive information specific to the data, such as a list
   * of employee IDs or job titles.
   *
   * Dictionary words are case-insensitive and all characters other than letters
   * and digits in the unicode [Basic Multilingual
   * Plane](https://en.wikipedia.org/wiki/Plane_%28Unicode%29#Basic_Multilingual_Plane)
   * will be replaced with whitespace when scanning for matches, so the
   * dictionary phrase "Sam Johnson" will match all three phrases "sam johnson",
   * "Sam, Johnson", and "Sam (Johnson)". Additionally, the characters
   * surrounding any match must be of a different type than the adjacent
   * characters within the word, so letters must be next to non-letters and
   * digits next to non-digits. For example, the dictionary word "jen" will
   * match the first three letters of the text "jen123" but will return no
   * matches for "jennifer".
   *
   * Dictionary words containing a large number of characters that are not
   * letters or digits may result in unexpected findings because such characters
   * are treated as whitespace.
   *
   * @property {Object} wordList
   *   List of words or phrases to search for.
   *
   *   This object should have the same structure as [WordList]{@link google.privacy.dlp.v2beta1.WordList}
   *
   * @typedef Dictionary
   * @memberof google.privacy.dlp.v2beta1
   * @see [google.privacy.dlp.v2beta1.CustomInfoType.Dictionary definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
   */
  Dictionary: {
    // This is for documentation. Actual contents will be loaded by gRPC.

    /**
     * Message defining a list of words or phrases to search for in the data.
     *
     * @property {string[]} words
     *   Words or phrases defining the dictionary. The dictionary must contain
     *   at least one phrase and every phrase must contain at least 2 characters
     *   that are letters or digits. [required]
     *
     * @typedef WordList
     * @memberof google.privacy.dlp.v2beta1
     * @see [google.privacy.dlp.v2beta1.CustomInfoType.Dictionary.WordList definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
     */
    WordList: {
      // This is for documentation. Actual contents will be loaded by gRPC.
    }
  }
};

/**
 * General identifier of a data field in a storage service.
 *
 * @property {string} columnName
 *   Name describing the field.
 *
 * @typedef FieldId
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.FieldId definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var FieldId = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Datastore partition ID.
 * A partition ID identifies a grouping of entities. The grouping is always
 * by project and namespace, however the namespace ID may be empty.
 *
 * A partition ID contains several dimensions:
 * project ID and namespace ID.
 *
 * @property {string} projectId
 *   The ID of the project to which the entities belong.
 *
 * @property {string} namespaceId
 *   If not empty, the ID of the namespace to which the entities belong.
 *
 * @typedef PartitionId
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.PartitionId definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var PartitionId = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A representation of a Datastore kind.
 *
 * @property {string} name
 *   The name of the kind.
 *
 * @typedef KindExpression
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.KindExpression definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var KindExpression = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A reference to a property relative to the Datastore kind expressions.
 *
 * @property {string} name
 *   The name of the property.
 *   If name includes "."s, it may be interpreted as a property name path.
 *
 * @typedef PropertyReference
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.PropertyReference definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var PropertyReference = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A representation of a Datastore property in a projection.
 *
 * @property {Object} property
 *   The property to project.
 *
 *   This object should have the same structure as [PropertyReference]{@link google.privacy.dlp.v2beta1.PropertyReference}
 *
 * @typedef Projection
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.Projection definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var Projection = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Options defining a data set within Google Cloud Datastore.
 *
 * @property {Object} partitionId
 *   A partition ID identifies a grouping of entities. The grouping is always
 *   by project and namespace, however the namespace ID may be empty.
 *
 *   This object should have the same structure as [PartitionId]{@link google.privacy.dlp.v2beta1.PartitionId}
 *
 * @property {Object} kind
 *   The kind to process.
 *
 *   This object should have the same structure as [KindExpression]{@link google.privacy.dlp.v2beta1.KindExpression}
 *
 * @property {Object[]} projection
 *   Properties to scan. If none are specified, all properties will be scanned
 *   by default.
 *
 *   This object should have the same structure as [Projection]{@link google.privacy.dlp.v2beta1.Projection}
 *
 * @typedef DatastoreOptions
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.DatastoreOptions definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var DatastoreOptions = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Options defining a file or a set of files (path ending with *) within
 * a Google Cloud Storage bucket.
 *
 * @property {Object} fileSet
 *   This object should have the same structure as [FileSet]{@link google.privacy.dlp.v2beta1.FileSet}
 *
 * @typedef CloudStorageOptions
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.CloudStorageOptions definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var CloudStorageOptions = {
  // This is for documentation. Actual contents will be loaded by gRPC.

  /**
   * Set of files to scan.
   *
   * @property {string} url
   *   The url, in the format `gs://<bucket>/<path>`. Trailing wildcard in the
   *   path is allowed.
   *
   * @typedef FileSet
   * @memberof google.privacy.dlp.v2beta1
   * @see [google.privacy.dlp.v2beta1.CloudStorageOptions.FileSet definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
   */
  FileSet: {
    // This is for documentation. Actual contents will be loaded by gRPC.
  }
};

/**
 * A location in Cloud Storage.
 *
 * @property {string} path
 *   The url, in the format of `gs://bucket/<path>`.
 *
 * @typedef CloudStoragePath
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.CloudStoragePath definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var CloudStoragePath = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Options defining BigQuery table and row identifiers.
 *
 * @property {Object} tableReference
 *   Complete BigQuery table reference.
 *
 *   This object should have the same structure as [BigQueryTable]{@link google.privacy.dlp.v2beta1.BigQueryTable}
 *
 * @property {Object[]} identifyingFields
 *   References to fields uniquely identifying rows within the table.
 *   Nested fields in the format, like `person.birthdate.year`, are allowed.
 *
 *   This object should have the same structure as [FieldId]{@link google.privacy.dlp.v2beta1.FieldId}
 *
 * @typedef BigQueryOptions
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.BigQueryOptions definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var BigQueryOptions = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Shared message indicating Cloud storage type.
 *
 * @property {Object} datastoreOptions
 *   Google Cloud Datastore options specification.
 *
 *   This object should have the same structure as [DatastoreOptions]{@link google.privacy.dlp.v2beta1.DatastoreOptions}
 *
 * @property {Object} cloudStorageOptions
 *   Google Cloud Storage options specification.
 *
 *   This object should have the same structure as [CloudStorageOptions]{@link google.privacy.dlp.v2beta1.CloudStorageOptions}
 *
 * @property {Object} bigQueryOptions
 *   BigQuery options specification.
 *
 *   This object should have the same structure as [BigQueryOptions]{@link google.privacy.dlp.v2beta1.BigQueryOptions}
 *
 * @typedef StorageConfig
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.StorageConfig definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var StorageConfig = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Record key for a finding in a Cloud Storage file.
 *
 * @property {string} filePath
 *   Path to the file.
 *
 * @property {number} startOffset
 *   Byte offset of the referenced data in the file.
 *
 * @typedef CloudStorageKey
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.CloudStorageKey definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var CloudStorageKey = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Record key for a finding in Cloud Datastore.
 *
 * @property {Object} entityKey
 *   Datastore entity key.
 *
 *   This object should have the same structure as [Key]{@link google.privacy.dlp.v2beta1.Key}
 *
 * @typedef DatastoreKey
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.DatastoreKey definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var DatastoreKey = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * A unique identifier for a Datastore entity.
 * If a key's partition ID or any of its path kinds or names are
 * reserved/read-only, the key is reserved/read-only.
 * A reserved/read-only key is forbidden in certain documented contexts.
 *
 * @property {Object} partitionId
 *   Entities are partitioned into subsets, currently identified by a project
 *   ID and namespace ID.
 *   Queries are scoped to a single partition.
 *
 *   This object should have the same structure as [PartitionId]{@link google.privacy.dlp.v2beta1.PartitionId}
 *
 * @property {Object[]} path
 *   The entity path.
 *   An entity path consists of one or more elements composed of a kind and a
 *   string or numerical identifier, which identify entities. The first
 *   element identifies a _root entity_, the second element identifies
 *   a _child_ of the root entity, the third element identifies a child of the
 *   second entity, and so forth. The entities identified by all prefixes of
 *   the path are called the element's _ancestors_.
 *
 *   A path can never be empty, and a path can have at most 100 elements.
 *
 *   This object should have the same structure as [PathElement]{@link google.privacy.dlp.v2beta1.PathElement}
 *
 * @typedef Key
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.Key definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var Key = {
  // This is for documentation. Actual contents will be loaded by gRPC.

  /**
   * A (kind, ID/name) pair used to construct a key path.
   *
   * If either name or ID is set, the element is complete.
   * If neither is set, the element is incomplete.
   *
   * @property {string} kind
   *   The kind of the entity.
   *   A kind matching regex `__.*__` is reserved/read-only.
   *   A kind must not contain more than 1500 bytes when UTF-8 encoded.
   *   Cannot be `""`.
   *
   * @property {number} id
   *   The auto-allocated ID of the entity.
   *   Never equal to zero. Values less than zero are discouraged and may not
   *   be supported in the future.
   *
   * @property {string} name
   *   The name of the entity.
   *   A name matching regex `__.*__` is reserved/read-only.
   *   A name must not be more than 1500 bytes when UTF-8 encoded.
   *   Cannot be `""`.
   *
   * @typedef PathElement
   * @memberof google.privacy.dlp.v2beta1
   * @see [google.privacy.dlp.v2beta1.Key.PathElement definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
   */
  PathElement: {
    // This is for documentation. Actual contents will be loaded by gRPC.
  }
};

/**
 * Message for a unique key indicating a record that contains a finding.
 *
 * @property {Object} cloudStorageKey
 *   This object should have the same structure as [CloudStorageKey]{@link google.privacy.dlp.v2beta1.CloudStorageKey}
 *
 * @property {Object} datastoreKey
 *   This object should have the same structure as [DatastoreKey]{@link google.privacy.dlp.v2beta1.DatastoreKey}
 *
 * @typedef RecordKey
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.RecordKey definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var RecordKey = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * Message defining the location of a BigQuery table. A table is uniquely
 * identified  by its project_id, dataset_id, and table_name. Within a query
 * a table is often referenced with a string in the format of:
 * `<project_id>:<dataset_id>.<table_id>` or
 * `<project_id>.<dataset_id>.<table_id>`.
 *
 * @property {string} projectId
 *   The Google Cloud Platform project ID of the project containing the table.
 *   If omitted, project ID is inferred from the API call.
 *
 * @property {string} datasetId
 *   Dataset ID of the table.
 *
 * @property {string} tableId
 *   Name of the table.
 *
 * @typedef BigQueryTable
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.BigQueryTable definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var BigQueryTable = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};

/**
 * An entity in a dataset is a field or set of fields that correspond to a
 * single person. For example, in medical records the `EntityId` might be
 * a patient identifier, or for financial records it might be an account
 * identifier. This message is used when generalizations or analysis must be
 * consistent across multiple rows pertaining to the same entity.
 *
 * @property {Object} field
 *   Composite key indicating which field contains the entity identifier.
 *
 *   This object should have the same structure as [FieldId]{@link google.privacy.dlp.v2beta1.FieldId}
 *
 * @typedef EntityId
 * @memberof google.privacy.dlp.v2beta1
 * @see [google.privacy.dlp.v2beta1.EntityId definition in proto format]{@link https://github.com/googleapis/googleapis/blob/master/google/privacy/dlp/v2beta1/storage.proto}
 */
var EntityId = {
  // This is for documentation. Actual contents will be loaded by gRPC.
};