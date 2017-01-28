# ng2-json-editor

Angular2 component for editing large json documents.

# USAGE

## Quick start

### Install

```bash
npm install --save ng2-json-editor
```

### Import

```typescript
import { JsonEditorModule } from 'ng2-json-editor/ng2-json-editor';
```

Then add it to your module's `imports`.

### Use

```html
<json-editor [config]="config" [schema]="mySchema" [record]="myRecord" (onRecordChange)="doStuffWithNewRecord($event)"></json-editor>
```

- `config` : configuration object. See [configuration section](#configuration) for options.
- `schema` : valid json-schema for the record. See [json schema limitations](#json-schema-limitations)
- `record` : valid json to be edited.
- `onRecordChange` emitted when record change, `$event` is the edited record.
- `errorMap (={})`: errors for individual parts of the record (format should be [errors-map.json](./example/assets/mock-data/error-map.json) 

## Example

Please have a look at [example app](./example/app)

## <a name="configuration"></a>Configuration

|               |             |             |
| ------------- |-------------|-------------|
| *schemaOptions*      | Object | Enriches JsonSchema with custom properties that `ng2-json-editor` understands. See [possible values](#schemaOptions).|
| *previews*      | Array | Configures previews for the document. See [configuration syntax](#previews).|
| *shortcuts*     | Object | Configures shortcuts for the document. See [shortcuts syntax](#shortcuts).|

### <a name="schemaOptions"></a>Extended Schema (schemaOptions)

The keys of this object correspond the path in the schema that wants to be configured (in dotted notation), for example:

```
{
  'titles.items.properties.title': {
    x_editor_hidden: true
  },
  'abstracts': {
    x_editor_disabled: true
  }
}
```

Continue reading for available configuration available for fields.

#### x_editor_autocomplete

Configuration for autocompletion of a field from remote or local source. Field to be autocompleted must have the `x_editor_autocomplete` property
with configuration object that has the following properties below.

```
{
  url?: string; (remote source url that returns the autocompletion results)
  path?: string; (path to array of autocompletion results in response from the url, separated by dot '.')
  source?: Array<string>; (source array that will be used to autocomplete locally)
  onCompletionSelect?: function(path: Array<any>, completion: [AutocompletionResult](./src/typings.d.ts), store: [NestedStore](./src/typings.d.ts));
    (function to be called when a completion results is selected)
  size: number; (maximum number of items to be showed)
}
```

Note that:

- query string is appended to `url`, so it should end like `.../foo?bar=`.
- autocompletion results array which is located in `path`, must be a array of objects which have `text` property inside.
- **either `url` and `path` or `source` must be set.**

#### x_editor_hidden

Flag to hide fields in the record from the editor's UI.

```
boolean
```

Note that:

- It deletes fields that are set `x_editor_hidden: true` from the record, before rendering the UI.

#### x_editor_disabled

Flag to disable fields that should be displayed in the UI, but aren't supposed to be edited.

```
boolean
```

Note that:

- It overrides all other types. For instance, if a field enum and `x_editor_disabled` is set, then it is rendered as simple `div` instead of disabled `enum` component (dropdown).

#### x_editor_always_show

Flag to show fields on the UI, even if they aren't present in the record.

```
boolean
```

#### x_editor_priority

Indicator to be used for sorting all fields on the UI.
Larger priority fields appears up-most/left-most on the UI.

```
number
```

```
default: 0
```

#### x_editor_enum_shortcut_map

Shortcut map for enum fields, to map shorthand values to enum values

```
{
  a: "An value in enum array",
  abc: "Another value in enum array"
}
```

So when `a` typed in enum field and enter is pressed, enum field value will be set to `Another value in enum array`.

#### <a name="x_editor_ref_config"></a>x_editor_ref_config

Config for objects that has `$ref` string as a property which points to another json.

```
{
  template: string; (html template where you can access json that is pointed by $ref by using 'context')
  lazy: boolean; (flag to indicate if template should be rendered on request or on page load, a preview button is inserted if set true)
  headers?: Array<Object>; (array of headers which will be used for http request that fetches the $ref data)
}
```

Example `template`:
```
<div>aValue: {{(context | async)?.aValue}}<div>
```

Example `headers`:
```
[
  { 'Accept': 'application/json' },
  { 'Custom': 'custom-header-value' },
  ...
]
```

Note that:

- you have to use async pipe since the Observable passed as context.
- you can use other angular2 common pipes such as `lowercase`, `json` etc.
- you can access the error during http request, via `context.error`.  

#### x_editor_on_value_change

Function that will be called when the value of configured property is changed.
This function can access the whole json thanks to [`store`](./src/shared/services/json-store.service.ts), and 
can change all other properties if required.

```
function(path: Array<any>, value: any, store: NestedStore)
```

Example function:

```
(path, value, store) => {
  // do stuff with params here
}
```

Note that:

- JsonStoreService's `getIn` and `setIn` returns and takes `immutable.js`'s `List` and `Map` instead of `Array` and `Object`

#### x_editor_long_list_navigator

```
{
  findSingle?: function(item: any, expression: string): boolean;
    (the first item for which function returns true is set as search result)
  findMultiple?: function(item: any, expression: string): boolean;
    (all items for which function returns true is set as search results)
  itemsPerPage: number; (number of items are displayed per page)
  maxVisiblePageCount: number; (number of pages that are displayed in pagination view)
}
```

Note that:

- If both `findSingle` and `findMultiple` are defined in configuration, at first `findSingle` is executed for all items,
if there is no result found then `findMultiple` is executed.

#### x_editor_link_builder

The function that returns a url string which will be pointed by a small link button at the right side of input element.

```
function(value: any): string;
```

#### x_editor_column_width

Define the width that a field must acquire in a table.

```
abstracts.items.properties.source: {
      x_editor_column_width: 20
    }
```

Note that:

- This is only applicable when the parent field is a table.

### <a name="previews"></a>Previews

Configuration for previews to be displayed in previewer (on the right side).

```
[
  {
    name: string; (name of the tab which preview is displayed)
    type: string; (type of the preview, such as "html")
    url?: string; (preview url)
    getUrl?: function(record: Object): string; (function that takes record and returns preview url) 
    urlPath?: string; (dot separated path to preview url in the record)
  }
]
```

Types:

```
html
```

Note that:

- Either `url`, `getUrl`, or `urlPath` must be present.
- `html` type uses `iframe` and can display `.pdf` if supported by browser.

### <a name="shortcuts"></a>Shortcuts

Configuration for the shortcuts in the document based on focused fields.

```
{
 shortcutName: {
    key: string; (keyboard combination e.g 'ctrl+t')
 }
}
```

Continue reading for available values of `shortcut-name` to be configured.

#### addParent

Adds a new empty row in the closest parent list.

#### addToRoot

Adds a new empty field to the root parent list.

#### delete

Deletes the table row of the focused field.

#### moveUp/moveDown

Moves up/down the table row of the focused field.

#### navigateUp/navigateDown

Navigates up/down to the above/below focusable field in the table.

#### navigateLeft/navigateRight

Navigates left/right to the previous/next focusable field in the table.

#### copy

Copies the table row of the focused field below and lets the focused field of the new row empty.

#### copyFromRoot

Copies the table item of the focused field below. This functionality can copy a complex schema item in an array.

### $ref fields

These are object fields which has `$ref` string value that points to another json (remote or local).

If you don't configure [like here](#x_editor_ref_config) it will be displayed as a clickable, not editable `$ref` link that opens to the link in a new tab.

## <a name="json-schema-limitations"></a>Json Schema Limitations

### anyOf

`ng2-json-editor` has very limited support for `anyOf`, support where all `anyOf` items have same properties
and they are objects with primitive properties. Before display, it picks the first `anyOf` item, merges all enum values and
removes `pattern` and `format` rules.

# DEVELOPMENT

## Quick start

**Make sure you have Node version >= 4.0 and NPM >= 3**

### Setup

```bash
# clone our repo or alternatively your fork
git clone https://github.com/inspirehep/ng2-json-editor.git

# change directory to our repo
cd ng2-json-editor

# install the repo with npm
npm install

# build for the first time and start example app to see changes
npm start

# in another terminal session
# watch changes on src, so that all will be available on example app immediately
gulp watch
```

### Useful commands

```bash
# build the editor and start the server with example app
npm start

# test
gulp test
# or
ng test --watch=false

# test and watch (for usually debugging tests)
ng test

# build
gulp build 
```

## Contributing

Please see [CONTRIBUTING](./github/CONTRIBUTING.md)
