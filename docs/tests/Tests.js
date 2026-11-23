/*jsl:import PiecePosition.js*/
QUnit.test( "basic hellow world test", function( assert ) {
	assert.ok( true, "Passed!" );
});
QUnit.test( "check that positions cannot be negative", function( assert ) {
	assert.throws(function() {
		return new PiecePosition(-5,-6);
	});
});
