const cardDB_OCTGN = require('./cardDB.json');

function requireAll( requireContext ) {
  return requireContext.keys().map( requireContext );
}
const cardDBs_ALeP = requireAll( require.context("./ALeP", false, /.json$/) );
const cardDB_ALeP = Object.assign({}, ...cardDBs_ALeP);

export const cardDB = {
  ...cardDB_OCTGN,
  ...cardDB_ALeP
};