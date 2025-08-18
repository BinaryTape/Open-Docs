[//]: # (title: 클라이언트 플러그인)

<link-summary>
로깅, 직렬화, 인증 등과 같이 공통 기능을 제공하는 플러그인에 대해 알아봅니다.
</link-summary>

많은 애플리케이션은 애플리케이션 로직 범위를 벗어나는 공통 기능을 필요로 합니다. 예를 들어, [로깅](client-logging.md), [직렬화](client-serialization.md), 또는 [인증](client-auth.md) 등이 있습니다. 이 모든 기능은 Ktor에서 **플러그인**이라고 부르는 수단을 통해 제공됩니다.

## 플러그인 의존성 추가 {id="plugin-dependency"}
플러그인은 별도의 [의존성](client-dependencies.md)을 필요로 할 수 있습니다. 예를 들어, [로깅](client-logging.md) 플러그인은 빌드 스크립트에 `ktor-client-logging` 아티팩트를 추가해야 합니다:

<var name="artifact_name" value="ktor-client-logging"/>
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

필요한 플러그인에 대한 토픽에서 어떤 의존성이 필요한지 확인할 수 있습니다.

## 플러그인 설치 {id="install"}
플러그인을 설치하려면, [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 플러그인을 전달해야 합니다. 예를 들어, `Logging` 플러그인을 설치하는 방법은 다음과 같습니다:

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

## 플러그인 구성 {id="configure_plugin"}
`install` 블록 내에서 플러그인을 구성할 수 있습니다. 예를 들어, [로깅](client-logging.md) 플러그인의 경우 로거, 로깅 레벨, 그리고 로그 메시지 필터링 조건을 지정할 수 있습니다:
```kotlin
runBlocking {
    val client = HttpClient(CIO) {
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.HEADERS
            filter { request ->
                request.url.host.contains("ktor.io")
            }
            sanitizeHeader { header -> header == HttpHeaders.Authorization }
```

## 사용자 지정 플러그인 생성 {id="custom"}
사용자 지정 플러그인을 생성하는 방법을 배우려면, [사용자 지정 클라이언트 플러그인](client-custom-plugins.md)을 참조하세요.