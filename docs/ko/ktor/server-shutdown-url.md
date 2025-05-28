[//]: # (title: 서버 종료 URL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 플러그인을 사용하면 서버를 종료하는 데 사용되는 URL을 구성할 수 있습니다.
이 플러그인을 활성화하는 두 가지 방법이 있습니다:

- [설정 파일](#config-file)에서.
- [플러그인을 설치](#install)하여.

## 설정 파일에서 서버 종료 URL 구성 {id="config-file"}

[설정 파일](server-configuration-file.topic)에서 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 속성을 사용하여 서버 종료 URL을 구성할 수 있습니다.

<tabs group="config">
<tab title="application.conf" group-key="hocon">

```shell
```

{src="snippets/shutdown-url/src/main/resources/application.conf" include-lines="1-2,4-5,9"}

</tab>
<tab title="application.yaml" group-key="yaml">

```yaml
```

{src="snippets/shutdown-url/src/main/resources/_application.yaml" include-lines="1-2,4-5"}

</tab>
</tabs>

## 플러그인을 설치하여 서버 종료 URL 구성 {id="install"}

코드에서 서버 종료 URL을 [설치](server-plugins.md#install)하고 구성하려면, `install` 함수에 `ShutDownUrl.ApplicationCallPlugin`을 전달하고 `shutDownUrl` 속성을 사용합니다:

```kotlin
```

{src="snippets/shutdown-url/src/main/kotlin/com/example/Application.kt" include-lines="11-14"}

전체 예시는 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)에서 확인할 수 있습니다.