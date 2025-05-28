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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 플러그인은 들어오는 요청의 본문을 검증하는 기능을 제공합니다.
</link-summary>

[%plugin_name%](%plugin_api_link%) 플러그인을 사용하면 클라이언트가 특정 기간 내에 수행할 수 있는 [요청](server-requests.md) 수를 제한할 수 있습니다.
Ktor는 속도 제한을 구성하기 위한 다양한 방법을 제공합니다. 예를 들어:
- 애플리케이션 전체에 대해 전역적으로 속도 제한을 활성화하거나 다른 [리소스](server-routing.md)에 대해 다른 속도 제한을 구성할 수 있습니다.
- IP 주소, API 키 또는 액세스 토큰 등 특정 요청 매개변수를 기반으로 속도 제한을 구성할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% 구성 {id="configure"}

### 개요 {id="overview"}

Ktor는 속도 제한을 위해 _토큰 버킷_ 알고리즘을 사용하며, 작동 방식은 다음과 같습니다:
1. 시작 시, 용량(토큰 수)으로 정의된 버킷이 있습니다.
2. 각 들어오는 요청은 버킷에서 토큰 하나를 소비하려고 시도합니다:
    - 충분한 용량이 있는 경우, 서버는 요청을 처리하고 다음 헤더와 함께 응답을 보냅니다:
        - `X-RateLimit-Limit`: 지정된 버킷 용량.
        - `X-RateLimit-Remaining`: 버킷에 남은 토큰 수.
        - `X-RateLimit-Reset`: 버킷을 리필하는 시간을 지정하는 UTC 타임스탬프 (초 단위).
    - 용량이 부족한 경우, 서버는 `429 Too Many Requests` 응답을 사용하여 요청을 거부하고 `Retry-After` 헤더를 추가하여 클라이언트가 다음 요청을 수행하기 전에 얼마나 기다려야 하는지 (초 단위) 나타냅니다.
3. 지정된 기간이 지나면 버킷 용량이 다시 채워집니다.

### 속도 제한기 등록 {id="register"}
Ktor를 사용하면 애플리케이션 전체에 전역적으로 속도 제한을 적용하거나 특정 경로에 적용할 수 있습니다:
- 애플리케이션 전체에 속도 제한을 적용하려면, `global` 메서드를 호출하고 구성된 속도 제한기를 전달합니다.
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register` 메서드는 특정 경로에 적용될 수 있는 속도 제한기를 등록합니다.
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="14-17,33"}

위의 코드 샘플은 `%plugin_name%` 플러그인에 대한 최소 구성을 보여주지만, `register` 메서드를 사용하여 등록된 속도 제한기의 경우 [특정 경로](#rate-limiting-scope)에도 적용해야 합니다.

### 속도 제한 구성 {id="configure-rate-limiting"}

이 섹션에서는 속도 제한을 구성하는 방법을 살펴보겠습니다:

1. (선택 사항) `register` 메서드를 사용하면 [특정 경로](#rate-limiting-scope)에 속도 제한 규칙을 적용하는 데 사용할 수 있는 속도 제한기 이름을 지정할 수 있습니다:
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. `rateLimiter` 메서드는 두 개의 매개변수로 속도 제한기를 생성합니다: `limit`는 버킷 용량을 정의하고, `refillPeriod`는 이 버킷의 리필 기간을 지정합니다.
   아래 예시의 속도 제한기는 분당 30개의 요청을 처리할 수 있도록 허용합니다:
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21-22,32"}

3. (선택 사항) `requestKey`는 요청에 대한 키를 반환하는 함수를 지정할 수 있도록 허용합니다.
   다른 키를 가진 요청은 독립적인 속도 제한을 가집니다.
   아래 예시에서 `login` [쿼리 매개변수](server-requests.md#query_parameters)는 다른 사용자를 구별하는 데 사용되는 키입니다:
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21,23-25,32"}

   > 참고: 키는 우수한 `equals` 및 `hashCode` 구현을 가져야 합니다.

4. (선택 사항) `requestWeight`는 요청이 소비하는 토큰 수를 반환하는 함수를 설정합니다.
   아래 예시에서 요청 키는 요청 가중치를 구성하는 데 사용됩니다:
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21,23-32"}

5. (선택 사항) `modifyResponse`를 사용하면 각 요청과 함께 전송되는 기본 `X-RateLimit-*` 헤더를 재정의할 수 있습니다:
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### 속도 제한 범위 정의 {id="rate-limiting-scope"}

속도 제한기를 구성한 후, `rateLimit` 메서드를 사용하여 특정 경로에 규칙을 적용할 수 있습니다:

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="40-46,60"}

이 메서드는 [속도 제한기 이름](#configure-rate-limiting)도 받을 수 있습니다:

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="40,53-60"}

## 예시 {id="example"}

아래 코드 샘플은 `RateLimit` 플러그인을 사용하여 다른 리소스에 다른 속도 제한기를 적용하는 방법을 보여줍니다.
[StatusPages](server-status-pages.md) 플러그인은 `429 Too Many Requests` 응답이 전송된 거부된 요청을 처리하는 데 사용됩니다.

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt"}

전체 예제는 여기에서 찾을 수 있습니다: [rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit).