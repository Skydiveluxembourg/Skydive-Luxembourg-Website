import assert from 'node:assert/strict';
import test from 'node:test';
import { pageHref } from '../src/utils/urls.js';

test('locale pages use slash URLs without losing queries or booking anchors', () => {
  assert.equal(pageHref('/en'), '/en/');
  assert.equal(pageHref('/fr/contact'), '/fr/contact/');
  assert.equal(pageHref('/de/tandem#book'), '/de/tandem/#book');
  assert.equal(pageHref('/en/tandem?gift=1&return=%2Fen%2F#book'), '/en/tandem/?gift=1&return=%2Fen%2F#book');
  assert.equal(pageHref('/en/tandem/#book'), '/en/tandem/#book');
  assert.equal(pageHref('/lu/about'), '/lu/about/');
});

test('non-page destinations keep their existing behavior', () => {
  for (const href of [
    '#aff-form', '?gift=1', '/img/logo.png', '/en/files/guide.pdf?download=1',
    'mailto:mail@skydive.lu', 'tel:+352621701194',
    'https://dz-cloud.com/book?lang=en#dates', '//example.com/en/contact',
  ]) {
    assert.equal(pageHref(href), href);
  }
});
