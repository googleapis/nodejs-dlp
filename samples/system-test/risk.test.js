/**
 * Copyright 2018, Google, Inc.
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

const {assert} = require('chai');
const uuid = require('uuid');
const {PubSub} = require(`@google-cloud/pubsub`);
const execa = require('execa');

const cmd = 'node risk.js';
const dataset = 'integration_tests_dlp';
const uniqueField = 'Name';
const repeatedField = 'Mystery';
const numericField = 'Age';
const stringBooleanField = 'Gender';
const testProjectId = process.env.GCLOUD_PROJECT;
const pubsub = new PubSub();
const exec = async cmd => (await execa.shell(cmd)).stdout;

describe('risk', () => {
  // Create new custom topic/subscription
  let topic, subscription;
  const topicName = `dlp-risk-topic-${uuid.v4()}`;
  const subscriptionName = `dlp-risk-subscription-${uuid.v4()}`;
  before(async () => {
    [topic] = await pubsub.createTopic(topicName);
    [subscription] = await topic.createSubscription(subscriptionName);
  });

  // Delete custom topic/subscription
  after(async () => {
    await subscription.delete();
    await topic.delete();
  });

  // numericalRiskAnalysis
  it('should perform numerical risk analysis', async () => {
    const output = await exec(
      `${cmd} numerical ${dataset} harmful ${numericField} ${topicName} ${subscriptionName} -p ${testProjectId}`
    );
    assert.match(output, /Value at 0% quantile: \d{2}/);
    assert.match(output, /Value at \d{2}% quantile: \d{2}/);
  });

  it('should handle numerical risk analysis errors', async () => {
    const output = await exec(
      `${cmd} numerical ${dataset} nonexistent ${numericField} ${topicName} ${subscriptionName} -p ${testProjectId}`
    );
    assert.match(output, /Error in numericalRiskAnalysis/);
  });

  // categoricalRiskAnalysis
  it('should perform categorical risk analysis on a string field', async () => {
    const output = await exec(
      `${cmd} categorical ${dataset} harmful ${uniqueField} ${topicName} ${subscriptionName} -p ${testProjectId}`
    );
    assert.match(output, /Most common value occurs \d time\(s\)/);
  });

  it('should perform categorical risk analysis on a number field', async () => {
    const output = await exec(
      `${cmd} categorical ${dataset} harmful ${numericField} ${topicName} ${subscriptionName} -p ${testProjectId}`
    );
    assert.match(output, /Most common value occurs \d time\(s\)/);
  });

  it('should handle categorical risk analysis errors', async () => {
    const output = await exec(
      `${cmd} categorical ${dataset} nonexistent ${uniqueField} ${topicName} ${subscriptionName} -p ${testProjectId}`
    );
    assert.match(output, /Error in categoricalRiskAnalysis/);
  });

  // kAnonymityAnalysis
  it('should perform k-anonymity analysis on a single field', async () => {
    const output = await exec(
      `${cmd} kAnonymity ${dataset} harmful ${topicName} ${subscriptionName} ${numericField} -p ${testProjectId}`
    );
    assert.match(output, /Quasi-ID values: \{\d{2}\}/);
    assert.match(output, /Class size: \d/);
  });

  it('should perform k-anonymity analysis on multiple fields', async () => {
    const output = await exec(
      `${cmd} kAnonymity ${dataset} harmful ${topicName} ${subscriptionName} ${numericField} ${repeatedField} -p ${testProjectId}`
    );
    assert.match(output, /Quasi-ID values: \{\d{2}, \d{4} \d{4} \d{4} \d{4}\}/);
    assert.match(output, /Class size: \d/);
  });

  it('should handle k-anonymity analysis errors', async () => {
    const output = await exec(
      `${cmd} kAnonymity ${dataset} nonexistent ${topicName} ${subscriptionName} ${numericField} -p ${testProjectId}`
    );
    assert.match(output, /Error in kAnonymityAnalysis/);
  });

  // kMapAnalysis
  it('should perform k-map analysis on a single field', async () => {
    const output = await exec(
      `${cmd} kMap ${dataset} harmful ${topicName} ${subscriptionName} ${numericField} -t AGE -p ${testProjectId}`
    );
    assert.match(output, /Anonymity range: \[\d+, \d+\]/);
    assert.match(output, /Size: \d/);
    assert.match(output, /Values: \d{2}/);
  });

  it('should perform k-map analysis on multiple fields', async () => {
    const output = await exec(
      `${cmd} kMap ${dataset} harmful ${topicName} ${subscriptionName} ${numericField} ${stringBooleanField} -t AGE GENDER -p ${testProjectId}`
    );
    assert.match(output, /Anonymity range: \[\d+, \d+\]/);
    assert.match(output, /Size: \d/);
    assert.match(output, /Values: \d{2} Female/);
  });

  it('should handle k-map analysis errors', async () => {
    const output = await exec(
      `${cmd} kMap ${dataset} nonexistent ${topicName} ${subscriptionName} ${numericField} -t AGE -p ${testProjectId}`
    );
    assert.match(output, /Error in kMapEstimationAnalysis/);
  });

  it('should check that numbers of quasi-ids and info types are equal', async () => {
    const {stderr} = await execa.shell(
      `${cmd} kMap ${dataset} nonexistent ${topicName} ${subscriptionName} ${numericField} -t AGE GENDER -p ${testProjectId}`
    );
    assert.match(
      stderr,
      /Number of infoTypes and number of quasi-identifiers must be equal!/
    );
  });

  // lDiversityAnalysis
  it('should perform l-diversity analysis on a single field', async () => {
    const output = await exec(
      `${cmd} lDiversity ${dataset} harmful ${uniqueField} ${topicName} ${subscriptionName} ${numericField} -p ${testProjectId}`
    );
    assert.match(output, /Quasi-ID values: \{\d{2}\}/);
    assert.match(output, /Class size: \d/);
    assert.match(output, /Sensitive value James occurs \d time\(s\)/);
  });

  it('should perform l-diversity analysis on multiple fields', async () => {
    const output = await exec(
      `${cmd} lDiversity ${dataset} harmful ${uniqueField} ${topicName} ${subscriptionName} ${numericField} ${repeatedField} -p ${testProjectId}`
    );
    assert.match(output, /Quasi-ID values: \{\d{2}, \d{4} \d{4} \d{4} \d{4}\}/);
    assert.match(output, /Class size: \d/);
    assert.match(output, /Sensitive value James occurs \d time\(s\)/);
  });

  it('should handle l-diversity analysis errors', async () => {
    const output = await exec(
      `${cmd} lDiversity ${dataset} nonexistent ${topicName} ${subscriptionName} ${numericField} -p ${testProjectId}`
    );
    assert.match(output, /Error in lDiversityAnalysis/);
  });
});
