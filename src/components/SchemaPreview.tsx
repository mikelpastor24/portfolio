import { useLocale } from '../i18n/LocaleProvider'

const exampleSchema = '{\n  "type": "object",\n  "properties": {\n    "name": {\n      "type": "string"\n    }\n  }\n}'

export function SchemaPreview() {
  const { messages } = useLocale()
  return (
    <div className="project-visual visual-schema" aria-hidden="true">
      <div className="schema-preview-panel">
        <div className="preview-panel-heading"><strong>JSON Schema</strong><span>Dart + Flutter</span></div>
        <div className="schema-preview-columns">
          <div className="schema-preview-editor">
            <span className="preview-panel-label">schema_engine</span>
            <pre><code>{exampleSchema}</code></pre>
          </div>
          <div className="schema-preview-form">
            <span className="preview-panel-label">schema_ui</span>
            <span className="schema-preview-form-title">{messages.preview.schemaForm}</span>
            <span className="schema-preview-field-label">{messages.preview.schemaName}</span>
            <div className="schema-preview-field"><span /></div>
            <div className="schema-preview-builder"><span>{'{ }'}</span><span>{messages.preview.schemaBuilder}</span></div>
          </div>
        </div>
      </div>
      <span className="visual-caption">{messages.preview.schemaCaption}</span>
    </div>
  )
}
