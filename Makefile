frontend:
	npm start

backend:
	env FLASK_APP=server.py FLASK_DEBUG=1 pipenv run flask run

vscode: .vscode/settings.json

.vscode/settings.json:
	mkdir -p .vscode
	jq -n --arg pythonpath "$(shell pipenv --py)" '{"python.pythonPath":$$pythonpath}' > $@
