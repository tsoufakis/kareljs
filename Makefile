test:
	node tests/validate_levels.js ../public/levels.json
	node tests/test_models.js
	npm test
