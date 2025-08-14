[//]: # (title: 종료 URL)

<primary-label ref="server-plugin"/>

<tldr>
<var name="example_name" value="shutdown-url"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[ShutDownUrl](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.engine/-shut-down-url/index.html) 플러그인을 사용하면 서버를 종료하는 데 사용되는 URL을 구성할 수 있습니다.
이 플러그인을 활성화하는 방법은 두 가지입니다:

- [구성 파일](#config-file)에서.
- [플러그인 설치](#install)를 통해.

## 구성 파일에서 종료 URL 구성 {id="config-file"}

[구성 파일](server-configuration-file.topic)에서 [ktor.deployment.shutdown.url](server-configuration-file.topic#predefined-properties) 속성을 사용하여 종료 URL을 구성할 수 있습니다.

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

## 플러그인 설치를 통해 종료 URL 구성 {id="install"}

코드를 통해 종료 URL을 [설치](server-plugins.md#install)하고 구성하려면, `ShutDownUrl.ApplicationCallPlugin`을 `install` 함수에 전달하고 `shutDownUrl` 속성을 사용합니다:

[object Promise]

전체 예시는 [shutdown-url](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/shutdown-url)을 참조하십시오.