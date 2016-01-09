var test = require('tape')

test('...', function (t) {
  t.ok(true);
  throw new Error('hmm')
  t.end()
})
