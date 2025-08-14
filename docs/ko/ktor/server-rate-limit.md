[//]: # (title: 속도 제한)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="rate-limit"/>

    <p>
        <b>코드 예제</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name%는 들어오는 요청의 본문 유효성을 검사하는 기능을 제공합니다.
</link-summary>

[%plugin_name%](%plugin_api_link%) 플러그인을 사용하면 클라이언트가 특정 시간 내에 만들 수 있는 [요청](server-requests.md) 수를 제한할 수 있습니다.
Ktor는 속도 제한을 구성하기 위한 다양한 방법을 제공합니다. 예를 들면 다음과 같습니다:
- 애플리케이션 전체에 전역적으로 속도 제한을 활성화하거나, 서로 다른 [리소스](server-routing.md)에 대해 다른 속도 제한을 구성할 수 있습니다.
- 특정 요청 매개변수(예: IP 주소, API 키 또는 액세스 토큰 등)를 기반으로 속도 제한을 구성할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
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
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내부에.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부에.
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
    

## %plugin_name% 구성 {id="configure"}

### 개요 {id="overview"}

Ktor는 속도 제한을 위해 _토큰 버킷_ 알고리즘을 사용하며, 이는 다음과 같이 작동합니다:
1. 처음에, 용량(토큰 수)으로 정의된 버킷이 있습니다.
2. 각 들어오는 요청은 버킷에서 토큰 하나를 소모하려고 시도합니다:
    - 용량이 충분하면, 서버는 요청을 처리하고 다음 헤더와 함께 응답을 보냅니다:
        - `X-RateLimit-Limit`: 지정된 버킷 용량.
        - `X-RateLimit-Remaining`: 버킷에 남아 있는 토큰 수.
        - `X-RateLimit-Reset`: 버킷이 리필되는 시간을 지정하는 UTC 타임스탬프(초).
    - 용량이 부족하면, 서버는 `429 Too Many Requests` 응답을 사용하여 요청을 거부하고, 클라이언트가 다음 요청을 보내기 전에 기다려야 할 시간(초)을 나타내는 `Retry-After` 헤더를 추가합니다.
3. 지정된 시간이 지나면, 버킷 용량이 리필됩니다.

### 속도 제한기 등록 {id="register"}
Ktor를 사용하면 애플리케이션 전체에 전역적으로 또는 특정 라우트에 속도 제한을 적용할 수 있습니다:
- 애플리케이션 전체에 속도 제한을 적용하려면, `global` 메서드를 호출하고 구성된 속도 제한기를 전달합니다.
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register` 메서드는 특정 라우트에 적용할 수 있는 속도 제한기를 등록합니다.
   [object Promise]

위의 코드 예제는 `%plugin_name%` 플러그인에 대한 최소한의 구성을 보여주지만,
`register` 메서드를 사용하여 등록된 속도 제한기의 경우 [특정 라우트](#rate-limiting-scope)에 적용해야 합니다.

### 속도 제한 구성 {id="configure-rate-limiting"}

이 섹션에서는 속도 제한을 구성하는 방법을 살펴보겠습니다:

1. (선택 사항) `register` 메서드를 사용하면 속도 제한 규칙을 [특정 라우트](#rate-limiting-scope)에 적용하는 데 사용할 수 있는 속도 제한기 이름을 지정할 수 있습니다:
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. `rateLimiter` 메서드는 두 가지 매개변수로 속도 제한기를 생성합니다:
   `limit`는 버킷 용량을 정의하고, `refillPeriod`는 이 버킷의 리필 기간을 지정합니다.
   아래 예제의 속도 제한기는 분당 30개의 요청을 처리할 수 있습니다:
   [object Promise]

3. (선택 사항) `requestKey`를 사용하면 요청의 키를 반환하는 함수를 지정할 수 있습니다.
   키가 다른 요청은 독립적인 속도 제한을 가집니다.
   아래 예제에서 `login` [쿼리 파라미터](server-requests.md#query_parameters)는 다른 사용자를 구별하는 데 사용되는 키입니다:
   [object Promise]

   > 키는 `equals` 및 `hashCode` 구현이 잘 되어 있어야 합니다.

4. (선택 사항) `requestWeight`는 요청이 소비하는 토큰 수를 반환하는 함수를 설정합니다.
   아래 예제에서는 요청 키가 요청 가중치를 구성하는 데 사용됩니다:
   [object Promise]

5. (선택 사항) `modifyResponse`를 사용하면 각 요청과 함께 전송되는 기본 `X-RateLimit-*` 헤더를 재정의할 수 있습니다:
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### 속도 제한 범위 정의 {id="rate-limiting-scope"}

속도 제한기를 구성한 후, `rateLimit` 메서드를 사용하여 해당 규칙을 특정 라우트에 적용할 수 있습니다:

[object Promise]

이 메서드는 [속도 제한기 이름](#configure-rate-limiting)도 받을 수 있습니다:

[object Promise]

## 예제 {id="example"}

아래 코드 예제는 `RateLimit` 플러그인을 사용하여 서로 다른 리소스에 다른 속도 제한기를 적용하는 방법을 보여줍니다.
`429 Too Many Requests` 응답이 전송된 거부된 요청을 처리하기 위해 [StatusPages](server-status-pages.md) 플러그인이 사용됩니다.

[object Promise]

전체 예제는 다음에서 찾을 수 있습니다: [rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit).