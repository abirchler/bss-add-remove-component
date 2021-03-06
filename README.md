# bss-add-remove-component
Web component for interactively adding and removing 

**This project is under development and is not at a stable point.**

To use, wrap an element and set the follwing attributes:
* data-template,
* data-container,
* data-add,
* data-remove

This component adjusts name and id attributes to keep them unique.  It adjusts
name attributes to allow multi-dimensional array submission to php scripts, and
it adjusts IDs assuming that the first number following a dash represents the
row index.

## Usage

```html
<!doctype HTML>
<html>
	<head>
		<title>Add/Remove Web Component</title>
		<script defer src="bss-add-remove-component.js"></script>
		<style type="text/css">
			span[name]::after {
				content: attr(name)
			}
			span[id]::after {
				content: attr(id)
			}
		</style>
	</head>
	<body>
		<bss-add-remove
			data-template="tbody tr:last-child"
			data-container="tbody"
			data-add=".add-btn"
			data-remove=".remove-btn"
			data-min="1"
			data-max="10"
		>
			<table>
				<thead>
					<tr>
						<th>Name Replacement</th>
						<th>ID Replacement</th>
						<th>Name</th>
						<th>Number</th>
						<th><button type="button" class="add-btn">Add</button></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<span name="whatever[0][example]"></span>
						</td>
						<td>
							<span id="whatever-0-example"></span>
						</td>
						<td>
							<input type="hidden" name="whatever[0][id] id=" id="whatever-0-id">
							<input style="" type="text" name="whatever[0][name]" id="whatever-0-name">
						</td>
						<td>
							<input type="text" name="whatever[0][number]" id="whatever-0-number">
						</td>
						<td>
							<button type="button" class="remove-btn">Remove</button>
						</td>
					</tr>
				</tbody>
			</table>
		</bss-add-remove>
	</body>
</html>
```
