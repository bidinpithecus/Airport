import re
import glob

pattern = r'"(\b[0-9a-fA-F]{24}\b)"'
replacement = '{"$oid" : "\\1" }'

json_files = glob.glob('mongo/*.json')

for file_name in json_files:
	with open(file_name, 'r') as file:
		content = file.read()

	updated_content = re.sub(pattern, replacement, content)

	with open(file_name, 'w') as file:
		file.write(updated_content)
