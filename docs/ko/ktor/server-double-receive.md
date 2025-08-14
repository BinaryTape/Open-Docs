[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="double-receive"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-double-receive/io.ktor.server.plugins.doublereceive/-double-receive.html) 플러그인은 `RequestAlreadyConsumedException` 예외 없이 [요청 본문](server-requests.md#body_contents)을 여러 번 수신할 수 있는 기능을 제공합니다.
이는 [플러그인](server-plugins.md)이 이미 요청 본문을 소비하여 라우트 핸들러 내에서 이를 수신할 수 없을 때 유용할 수 있습니다.
예를 들어, `%plugin_name%`을(를) 사용하여 [CallLogging](server-call-logging.md) 플러그인으로 요청 본문을 로깅하고, `post` [라우트 핸들러](server-routing.md#define_route) 내에서 본문을 한 번 더 수신할 수 있습니다.

> `%plugin_name%` 플러그인은 잠재적으로 호환성이 깨지는 변경 사항과 함께 향후 업데이트에서 발전할 것으로 예상되는 실험적인 API를 사용합니다.
>
{type="note"}

## 종속성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면, 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## %plugin_name% 설치 {id="install_plugin"}

    <p>
        응용 프로그램에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내에서.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 라우트에 설치</a>할 수도 있습니다.
        이는 다양한 애플리케이션 리소스에 대해 다른 <code>%plugin_name%</code> 구성이 필요한 경우에 유용할 수 있습니다.
    </p>
    

`%plugin_name%` 설치 후, [요청 본문](server-requests.md#body_contents)을 여러 번 수신할 수 있으며, 각 호출은 동일한 인스턴스를 반환합니다.
예를 들어, [CallLogging](server-call-logging.md) 플러그인을 사용하여 요청 본문 로깅을 활성화할 수 있습니다...

[object Promise]

... 그리고 라우트 핸들러 내에서 요청 본문을 한 번 더 가져올 수 있습니다.

[object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive).

## %plugin_name% 구성 {id="configure"}
기본 구성으로, `%plugin_name%`은(는) 다음 유형으로 [요청 본문](server-requests.md#body_contents)을 수신할 수 있는 기능을 제공합니다:

- `ByteArray` 
- `String`
- `Parameters` 
- `ContentNegotiation` 플러그인에서 사용하는 [데이터 클래스](server-serialization.md#create_data_class)

기본적으로 `%plugin_name%`은(는) 다음을 지원하지 않습니다:

- 동일한 요청에서 다른 유형 수신;
- [스트림 또는 채널](server-requests.md#raw) 수신.

동일한 요청에서 다른 유형을 수신하거나 스트림 또는 채널을 수신할 필요가 없는 경우, `cacheRawRequest` 속성을 `false`로 설정하십시오:

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}
```