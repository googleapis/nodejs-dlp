<img src="https://avatars2.githubusercontent.com/u/2810941?v=3&s=96" alt="Google Cloud Platform logo" title="Google Cloud Platform" align="right" height="96" width="96"/>

# Google Cloud Data Loss Prevention (DLP) API: Node.js Samples

[![Open in Cloud Shell][shell_img]][shell_link]

The [Data Loss Prevention API](https://cloud.google.com/dlp/docs/) provides programmatic access to a powerful detection engine for personally identifiable information and other privacy-sensitive data in unstructured data streams.

## Table of Contents

* [Before you begin](#before-you-begin)
* [Samples](#samples)
  * [Inspect](#inspect)
  * [Redact](#redact)
  * [Metadata](#metadata)
  * [DeID](#deid)
  * [Risk Analysis](#risk-analysis)

## Before you begin

Before running the samples, make sure you've followed the steps in the
[Before you begin section](../README.md#before-you-begin) of the client
library's README.

## Samples

### Inspect

View the [source code][inspect_0_code].

[![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-dlp&page=editor&open_in_editor=samples/inspect.js,samples/README.md)

__Usage:__ `node inspect.js --help`

```
inspect.js <command>

Commands:
  inspect.js string <string>                                    Inspect a string using the Data Loss Prevention API.
  inspect.js file <filepath>                                    Inspects a local text, PNG, or JPEG file using the Data
                                                                Loss Prevention API.
  inspect.js gcsFile <bucketName> <fileName> <topicId>          Inspects a text file stored on Google Cloud Storage with
  <subscriptionId>                                              the Data Loss Prevention API, using Pub/Sub for job
                                                                notifications.
  inspect.js bigquery <datasetName> <tableName> <topicId>       Inspects a BigQuery table using the Data Loss Prevention
  <subscriptionId>                                              API using Pub/Sub for job notifications.
  inspect.js datastore <kind> <topicId> <subscriptionId>        Inspect a Datastore instance using the Data Loss
                                                                Prevention API using Pub/Sub for job notifications.

Options:
  --version                Show version number                                                                 [boolean]
  -m, --minLikelihood
          [string] [choices: "LIKELIHOOD_UNSPECIFIED", "VERY_UNLIKELY", "UNLIKELY", "POSSIBLE", "LIKELY", "VERY_LIKELY"]
                                                                                     [default: "LIKELIHOOD_UNSPECIFIED"]
  -c, --callingProjectId                                                       [string] [default: "nodejs-docs-samples"]
  -p, --dataProjectId                                                          [string] [default: "nodejs-docs-samples"]
  -f, --maxFindings                                                                                [number] [default: 0]
  -q, --includeQuote                                                                           [boolean] [default: true]
  -t, --infoTypes                               [array] [default: ["PHONE_NUMBER","EMAIL_ADDRESS","CREDIT_CARD_NUMBER"]]
  -n, --notificationTopic                                                                                       [string]
  --help                   Show help                                                                           [boolean]

Examples:
  node inspect.js string "My email address is me@somedomain.com"
  node inspect.js file resources/test.txt
  node inspect.js gcsFile my-bucket my-file.txt my-topic my-subscription
  node inspect.js bigquery my-dataset my-table my-topic my-subscription
  node inspect.js datastore my-datastore-kind my-topic my-subscription

For more information, see https://cloud.google.com/dlp/docs. Optional flags are explained at
https://cloud.google.com/dlp/docs/reference/rest/v2/InspectConfig
```

[inspect_0_docs]: https://cloud.google.com/dlp/docs
[inspect_0_code]: inspect.js

### Redact

View the [source code][redact_1_code].

[![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-dlp&page=editor&open_in_editor=samples/redact.js,samples/README.md)

__Usage:__ `node redact.js --help`

```
redact.js <command>

Commands:
  redact.js image <filepath> <outputPath>  Redact sensitive data from an image using the Data Loss Prevention API.

Options:
  --version             Show version number                                                                    [boolean]
  -m, --minLikelihood
          [string] [choices: "LIKELIHOOD_UNSPECIFIED", "VERY_UNLIKELY", "UNLIKELY", "POSSIBLE", "LIKELY", "VERY_LIKELY"]
                                                                                     [default: "LIKELIHOOD_UNSPECIFIED"]
  -t, --infoTypes                                                                                     [array] [required]
  -c, --callingProject                                                         [string] [default: "nodejs-docs-samples"]
  --help                Show help                                                                              [boolean]

Examples:
  node redact.js image resources/test.png result.png -t MALE_NAME

For more information, see https://cloud.google.com/dlp/docs. Optional flags are explained at
https://cloud.google.com/dlp/docs/reference/rest/v2/projects.image/redact#ImageRedactionConfig
```

[redact_1_docs]: https://cloud.google.com/dlp/docs
[redact_1_code]: redact.js

### Metadata

View the [source code][metadata_2_code].

[![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-dlp&page=editor&open_in_editor=samples/metadata.js,samples/README.md)

__Usage:__ `node metadata.js --help`

```
metadata.js <command>

Commands:
  metadata.js infoTypes [filter]  List the types of sensitive information the DLP API supports.

Options:
  --version           Show version number                                                                      [boolean]
  -l, --languageCode                                                                         [string] [default: "en-US"]
  --help              Show help                                                                                [boolean]

Examples:
  node metadata.js infoTypes "supported_by=INSPECT"

For more information, see https://cloud.google.com/dlp/docs
```

[metadata_2_docs]: https://cloud.google.com/dlp/docs
[metadata_2_code]: metadata.js

### DeID

View the [source code][deid_3_code].

[![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-dlp&page=editor&open_in_editor=samples/deid.js,samples/README.md)

__Usage:__ `node deid.js --help`

```
deid.js <command>

Commands:
  deid.js deidMask <string>                                     Deidentify sensitive data in a string by masking it with
                                                                a character.
  deid.js deidFpe <string> <wrappedKey> <keyName>               Deidentify sensitive data in a string using Format
                                                                Preserving Encryption (FPE).
  deid.js reidFpe <string> <surrogateType> <wrappedKey>         Reidentify sensitive data in a string using Format
  <keyName>                                                     Preserving Encryption (FPE).
  deid.js deidDateShift <inputCsvFile> <outputCsvFile>          Deidentify dates in a CSV file by pseudorandomly
  <lowerBoundDays> <upperBoundDays> [dateFields...]             shifting them.

Options:
  --version               Show version number                                                                  [boolean]
  -c, --callingProjectId                                                       [string] [default: "nodejs-docs-samples"]
  --help                  Show help                                                                            [boolean]

Examples:
  node deid.js deidMask "My SSN is 372819127"
  node deid.js deidFpe "My SSN is 372819127" <YOUR_ENCRYPTED_AES_256_KEY>
  projects/my-project/locations/global/keyrings/my-keyring -s SSN_TOKEN
  node deid.js reidFpe "My SSN is SSN_TOKEN(9):#########" <YOUR_ENCRYPTED_AES_256_KEY>
  projects/my-project/locations/global/keyrings/my-keyring SSN_TOKEN -a NUMERIC
  node deid.js deidDateShift dates.csv dates-shifted.csv 30 30 birth_date register_date [-w
  <YOUR_ENCRYPTED_AES_256_KEY> -n projects/my-project/locations/global/keyrings/my-keyring]

For more information, see https://cloud.google.com/dlp/docs.
```

[deid_3_docs]: https://cloud.google.com/dlp/docs
[deid_3_code]: deid.js

### Risk Analysis

View the [source code][risk_4_code].

[![Open in Cloud Shell][shell_img]](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-dlp&page=editor&open_in_editor=samples/risk.js,samples/README.md)

__Usage:__ `node risk.js --help`

```
risk.js <command>

Commands:
  risk.js numerical <datasetId> <tableId> <columnName>          Computes risk metrics of a column of numbers in a Google
  <topicId> <subscriptionId>                                    BigQuery table.
  risk.js categorical <datasetId> <tableId> <columnName>        Computes risk metrics of a column of data in a Google
  <topicId> <subscriptionId>                                    BigQuery table.
  risk.js kAnonymity <datasetId> <tableId> <topicId>            Computes the k-anonymity of a column set in a Google
  <subscriptionId> [quasiIdColumnNames..]                       BigQuery table.
  risk.js lDiversity <datasetId> <tableId>                      Computes the l-diversity of a column set in a Google
  <sensitiveAttribute> <topicId> <subscriptionId>               BigQuery table.
  [quasiIdColumnNames..]
  risk.js kMap <datasetId> <tableId> <topicId>                  Computes the k-map risk estimation of a column set in a
  <subscriptionId> [quasiIdColumnNames..]                       Google BigQuery table.

Options:
  --version               Show version number                                                                  [boolean]
  -c, --callingProjectId                                                       [string] [default: "nodejs-docs-samples"]
  -p, --tableProjectId                                                         [string] [default: "nodejs-docs-samples"]
  --help                  Show help                                                                            [boolean]

Examples:
  node risk.js numerical nhtsa_traffic_fatalities accident_2015 state_number my-topic my-subscription -p
  bigquery-public-data
  node risk.js categorical nhtsa_traffic_fatalities accident_2015 state_name my-topic my-subscription -p
  bigquery-public-data
  node risk.js kAnonymity nhtsa_traffic_fatalities accident_2015 my-topic my-subscription state_number county -p
  bigquery-public-data
  node risk.js lDiversity nhtsa_traffic_fatalities accident_2015 my-topic my-subscription city state_number county -p
  bigquery-public-data
  node risk kMap san_francisco bikeshare_trips my-topic my-subscription zip_code -t US_ZIP_5 -p bigquery-public-data

For more information, see https://cloud.google.com/dlp/docs.
```

[risk_4_docs]: https://cloud.google.com/dlp/docs
[risk_4_code]: risk.js

[shell_img]: http://gstatic.com/cloudssh/images/open-btn.png
[shell_link]: https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/googleapis/nodejs-dlp&page=editor&open_in_editor=samples/README.md
