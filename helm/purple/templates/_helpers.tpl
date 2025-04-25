{{- define "dvwa.labels" -}}
app.kubernetes.io/name: dvwa
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "dvwa.selectorLabels" -}}
app.kubernetes.io/name: dvwa
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "dvwa.fullname" -}}
{{ printf "%s-dvwa" .Release.Name }}
{{- end }}