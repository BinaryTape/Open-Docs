[//]: # (title: 요청 유효성 검사)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>
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

<link-summary>
%plugin_name%는 들어오는 요청의 본문을 유효성 검사하는 기능을 제공합니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) 플러그인은 들어오는 요청의 본문을 유효성 검사하는 기능을 제공합니다. [직렬 변환기](server-serialization.md#configure_serializer)와 함께 `ContentNegotiation` 플러그인이 설치되어 있다면, 원시 요청 본문 또는 지정된 요청 객체 속성을 유효성 검사할 수 있습니다. 요청 본문 유효성 검사에 실패하면, 플러그인은 `RequestValidationException`을 발생시키며, 이 예외는 [StatusPages](server-status-pages.md) 플러그인을 사용하여 처리할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
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
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요. 아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다 ...
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
    <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 경로에</a>도 설치할 수 있습니다. 이는 서로 다른 애플리케이션 리소스에 대해 다른 <code>%plugin_name%</code> 구성을 필요로 할 때 유용할 수 있습니다.
</p>

## %plugin_name% 구성 {id="configure"}

%plugin_name%을(를) 구성하는 데는 세 가지 주요 단계가 있습니다:

1. [본문 내용 수신](#receive-body).
2. [유효성 검사 함수 구성](#validation-function).
3. [유효성 검사 예외 처리](#validation-exception).

### 1. 본문 수신 {id="receive-body"}

%plugin_name% 플러그인은 타입 파라미터와 함께 **[receive](server-requests.md#body_contents)** 함수를 호출할 때 요청 본문을 유효성 검사합니다. 예를 들어, 아래 코드 스니펫은 본문을 `String` 값으로 수신하는 방법을 보여줍니다:

```kotlin
routing {
    post("/text") {
        val body = call.receive<String>()
        call.respond(body)
    }
}
```

### 2. 유효성 검사 함수 구성 {id="validation-function"}

요청 본문을 유효성 검사하려면 `validate` 함수를 사용하세요. 이 함수는 성공 또는 실패한 유효성 검사 결과를 나타내는 `ValidationResult` 객체를 반환합니다. 실패한 결과의 경우 **[RequestValidationException](#validation-exception)**이(가) 발생합니다.

`validate` 함수는 두 가지 방식으로 요청 본문을 유효성 검사할 수 있도록 두 가지 오버로드(overload)를 제공합니다:

- 첫 번째 `validate` 오버로드를 사용하면 지정된 타입의 객체로 요청 본문에 접근할 수 있습니다. 아래 예시는 `String` 값을 나타내는 요청 본문을 유효성 검사하는 방법을 보여줍니다:
   ```kotlin
   install(RequestValidation) {
       validate<String> { bodyText ->
           if (!bodyText.startsWith("Hello"))
               ValidationResult.Invalid("Body text should start with 'Hello'")
           else ValidationResult.Valid
       }
   }
   ```

   특정 [직렬 변환기](server-serialization.md#configure_serializer)로 `ContentNegotiation` 플러그인이 설치 및 구성된 경우, 객체 속성을 유효성 검사할 수 있습니다. 자세한 내용은 [예시: 객체 속성 유효성 검사](#example-object)에서 확인하세요.

- 두 번째 `validate` 오버로드는 `ValidatorBuilder`를 허용하며, 사용자 정의 유효성 검사 규칙을 제공할 수 있도록 합니다. 자세한 내용은 [예시: 바이트 배열 유효성 검사](#example-byte-array)에서 확인하세요.

### 3. 유효성 검사 예외 처리 {id="validation-exception"}

요청 유효성 검사에 실패하면, `%plugin_name%`은(는) `RequestValidationException`을(를) 발생시킵니다. 이 예외를 통해 요청 본문에 접근하고 이 요청에 대한 모든 유효성 검사 실패 이유를 얻을 수 있습니다.

다음과 같이 [StatusPages](server-status-pages.md) 플러그인을 사용하여 `RequestValidationException`을(를) 처리할 수 있습니다:

```kotlin
install(StatusPages) {
    exception<RequestValidationException> { call, cause ->
        call.respond(HttpStatusCode.BadRequest, cause.reasons.joinToString())
    }
}
```

전체 예시는 여기서 확인할 수 있습니다: [request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation).

## 예시: 객체 속성 유효성 검사 {id="example-object"}

이 예시에서는 `%plugin_name%` 플러그인을 사용하여 객체 속성을 유효성 검사하는 방법을 살펴보겠습니다. 서버가 다음 JSON 데이터를 포함하는 `POST` 요청을 수신한다고 가정해 봅시다:

```HTTP
POST http://0.0.0.0:8080/json
Content-Type: application/json

{
  "id": -1,
  "firstName": "Jet",
  "lastName": "Brains"
}
```

`id` 속성에 대한 유효성 검사를 추가하려면 다음 단계를 따르세요:

1. 위 JSON 객체를 설명하는 `Customer` 데이터 클래스를 생성합니다:
   ```kotlin
   @Serializable
   data class Customer(val id: Int, val firstName: String, val lastName: String)
   ```

2. [JSON 직렬 변환기](server-serialization.md#register_json)와 함께 `ContentNegotiation` 플러그인을 설치합니다:
   ```kotlin
   install(ContentNegotiation) {
       json()
   }
   ```

3. 다음과 같이 서버 측에서 `Customer` 객체를 수신합니다:
   ```kotlin
   post("/json") {
       val customer = call.receive<Customer>()
       call.respond(customer)
   }
   ```
4. `%plugin_name%` 플러그인 구성에서, `id` 속성이 지정된 범위 내에 있는지 확인하기 위해 유효성 검사를 추가합니다:
   ```kotlin
   install(RequestValidation) {
       validate<Customer> { customer ->
           if (customer.id <= 0)
               ValidationResult.Invalid("A customer ID should be greater than 0")
           else ValidationResult.Valid
       }
   }
   ```
   
   이 경우, `id` 값이 `0`보다 작거나 같으면 `%plugin_name%`은(는) **[RequestValidationException](#validation-exception)**을(를) 발생시킵니다.

## 예시: 바이트 배열 유효성 검사 {id="example-byte-array"}

이 예시에서는 바이트 배열로 수신된 요청 본문을 유효성 검사하는 방법을 살펴보겠습니다. 서버가 다음 텍스트 데이터를 포함하는 `POST` 요청을 수신한다고 가정해 봅시다:

```HTTP
POST http://localhost:8080/array
Content-Type: text/plain

-1
```

데이터를 바이트 배열로 수신하고 유효성 검사하려면 다음 단계를 수행하세요:

1. 다음과 같이 서버 측에서 데이터를 수신합니다:
   ```kotlin
   post("/array") {
       val body = call.receive<ByteArray>()
       call.respond(String(body))
   }
   ```
2. 수신된 데이터를 유효성 검사하려면 `ValidatorBuilder`를 허용하고 사용자 정의 유효성 검사 규칙을 제공할 수 있도록 하는 두 번째 `validate` [함수 오버로드](#validation-function)를 사용하겠습니다:
   ```kotlin
   install(RequestValidation) {
       validate {
           filter { body ->
               body is ByteArray
           }
           validation { body ->
               check(body is ByteArray)
               val intValue = String(body).toInt()
               if (intValue <= 0)
                   ValidationResult.Invalid("A value should be greater than 0")
               else ValidationResult.Valid
           }
       }
   }
   ```