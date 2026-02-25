[//]: # (title: Shutdown URL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 플러그인을 사용하면 서버를 종료하는 데 사용되는 URL을 구성할 수 있습니다. 이 플러그인을 활성화하는 방법은 두 가지가 있습니다:

- [구성 파일](#config-file)에서 설정하기.
- [플러그인 설치](#install)를 통해 설정하기.

## 구성 파일에서 Shutdown URL 설정하기 {id="config-file"}

[구성 파일](server-configuration-file.topic)에서 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 속성을 사용하여 shutdown URL을 구성할 수 있습니다.

<Tabs group="config">
<TabItem title="application.conf" group-key="hocon">

```shell
ktor {
    deployment {
        shutdown.url = "/shutdown"
    }
}
```

</TabItem>
<TabItem title="application.yaml" group-key="yaml">

```yaml
ktor:
    deployment:
        shutdown:
            url: "/shutdown"
```

</TabItem>
</Tabs>

## 플러그인 설치를 통해 Shutdown URL 설정하기 {id="install"}

코드에서 shutdown URL을 [설치](server-plugins.md#install)하고 구성하려면, `install` 함수에 `ShutDownUrl.ApplicationCallPlugin`을 전달하고 `shutDownUrl` 속성을 사용하세요:

```kotlin
install(ShutDownUrl.ApplicationCallPlugin) {
    shutDownUrl = "/shutdown"
    exitCodeSupplier = { 0 }
}
```

전체 예제는 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)을 확인하세요.