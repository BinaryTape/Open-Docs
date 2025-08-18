[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
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

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-double-receive/io.ktor.server.plugins.doublereceive/-double-receive.html) 플러그인은 `RequestAlreadyConsumedException` 예외 없이 [요청 바디를](server-requests.md#body_contents) 여러 번 수신할 수 있는 기능을 제공합니다. 이는 [플러그인](server-plugins.md)이 요청 바디를 이미 소비하여 라우트 핸들러 내에서 이를 수신할 수 없는 경우에 유용할 수 있습니다. 예를 들어, [CallLogging](server-call-logging.md) 플러그인을 사용하여 요청 바디를 로깅한 다음, `post` [라우트 핸들러](server-routing.md#define_route) 내에서 바디를 한 번 더 수신하는 데 `%plugin_name%`을 사용할 수 있습니다.

> `%plugin_name%` 플러그인은 향후 업데이트에서 잠재적으로 호환성이 깨지는 변경 사항과 함께 발전할 것으로 예상되는 실험적인 API를 사용합니다.
>
{type="note"}

## 의존성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>을 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## %plugin_name% 설치 {id="install_plugin"}

<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요. 아래 코드 스니펫은 <code>%plugin_name%</code>을 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내에서.
    </li>
    <li>
        ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 라우트에 설치</a>할 수도 있습니다. 이는 애플리케이션의 리소스별로 다른 <code>%plugin_name%</code> 설정을 필요로 할 때 유용할 수 있습니다.
</p>

`%plugin_name%`을 설치한 후에는 [요청 바디를](server-requests.md#body_contents) 여러 번 수신할 수 있으며, 각 호출은 동일한 인스턴스를 반환합니다. 예를 들어, [CallLogging](server-call-logging.md) 플러그인을 사용하여 요청 바디 로깅을 활성화할 수 있습니다...

```kotlin
install(CallLogging) {
    level = Level.TRACE
    format { call ->
        runBlocking {
            "Body: ${call.receiveText()}"
        }
    }
}
```

... 그리고 라우트 핸들러 내에서 요청 바디를 한 번 더 가져올 수 있습니다.

```kotlin
post("/") {
    val receivedText = call.receiveText()
    call.respondText("Text '$receivedText' is received")
}
```

전체 예시는 다음에서 찾을 수 있습니다: [double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive).

## %plugin_name% 설정 {id="configure"}
기본 설정으로, `%plugin_name%`은 [요청 바디를](server-requests.md#body_contents) 다음 타입으로 수신하는 기능을 제공합니다:

- `ByteArray`
- `String`
- `Parameters`
- `ContentNegotiation` 플러그인에서 사용되는 [데이터 클래스](server-serialization.md#create_data_class)

기본적으로 `%plugin_name%`은 다음을 지원하지 않습니다:

- 동일한 요청에서 다른 타입을 수신하는 것;
- [스트림 또는 채널](server-requests.md#raw)을 수신하는 것.

동일한 요청에서 다른 타입을 수신하거나 스트림 또는 채널을 수신할 필요가 없다면 `cacheRawRequest` 속성을 `false`로 설정하세요:

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}