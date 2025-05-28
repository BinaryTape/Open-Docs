[//]: # (title: 요청 유효성 검사)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-request-validation</code>
</p>
<var name="example_name" value="request-validation"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
RequestValidation은 들어오는 요청의 본문을 유효성 검사하는 기능을 제공합니다.
</link-summary>

[RequestValidation](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) 플러그인은 들어오는 요청의 본문을 유효성 검사하는 기능을 제공합니다. [직렬 변환기](server-serialization.md#configure_serializer)와 함께 `ContentNegotiation` 플러그인이 설치되어 있다면, 원시 요청 본문 또는 지정된 요청 객체 속성을 유효성 검사할 수 있습니다. 요청 본문 유효성 검사에 실패하면, 플러그인은 `RequestValidationException`을 발생시키며, 이는 [StatusPages](server-status-pages.md) 플러그인을 사용하여 처리할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## RequestValidation 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## RequestValidation 구성 {id="configure"}

RequestValidation을 구성하는 데는 세 가지 주요 단계가 있습니다:

1. [본문 내용 수신](#receive-body).
2. [유효성 검사 함수 구성](#validation-function).
3. [유효성 검사 예외 처리](#validation-exception).

### 1. 본문 수신 {id="receive-body"}

RequestValidation 플러그인은 **[receive](server-requests.md#body_contents)** 함수를 타입 파라미터와 함께 호출할 때 요청 본문을 유효성 검사합니다. 예를 들어, 아래 코드 스니펫은 본문을 `String` 값으로 수신하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="52-56,65"}

### 2. 유효성 검사 함수 구성 {id="validation-function"}

요청 본문을 유효성 검사하려면 `validate` 함수를 사용하세요.
이 함수는 성공 또는 실패한 유효성 검사 결과를 나타내는 `ValidationResult` 객체를 반환합니다.
유효성 검사에 실패하면 **[RequestValidationException](#validation-exception)**이 발생합니다.

`validate` 함수에는 두 가지 오버로드(overload)가 있으며, 이를 통해 요청 본문을 두 가지 방식으로 유효성 검사할 수 있습니다:

- 첫 번째 `validate` 오버로드를 사용하면 지정된 타입의 객체로 요청 본문에 접근할 수 있습니다.
  아래 예시는 `String` 값을 나타내는 요청 본문을 유효성 검사하는 방법을 보여줍니다:
  ```kotlin
  ```
  {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20-25,43"}

  특정 [직렬 변환기](server-serialization.md#configure_serializer)로 구성된 `ContentNegotiation` 플러그인이 설치되어 있다면, 객체 속성을 유효성 검사할 수 있습니다. 자세한 내용은 [](#example-object)에서 확인하세요.

- 두 번째 `validate` 오버로드는 `ValidatorBuilder`를 허용하며, 사용자 정의 유효성 검사 규칙을 제공할 수 있도록 합니다.
  자세한 내용은 [](#example-byte-array)에서 확인할 수 있습니다.

### 3. 유효성 검사 예외 처리 {id="validation-exception"}

요청 유효성 검사에 실패하면, RequestValidation은 `RequestValidationException`을 발생시킵니다.
이 예외를 통해 요청 본문에 접근하고 해당 요청에 대한 모든 유효성 검사 실패 이유를 확인할 수 있습니다.

다음과 같이 [StatusPages](server-status-pages.md) 플러그인을 사용하여 `RequestValidationException`을 처리할 수 있습니다:

```kotlin
```
{src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="44-48"}

전체 예시는 다음에서 확인할 수 있습니다: [request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation).

## 예시: 객체 속성 유효성 검사 {id="example-object"}

이 예시에서는 RequestValidation 플러그인을 사용하여 객체 속성을 유효성 검사하는 방법을 살펴보겠습니다.
서버가 다음 JSON 데이터를 포함하는 `POST` 요청을 수신한다고 가정해 봅시다:

```HTTP
```
{src="snippets/request-validation/post.http" include-lines="7-14"}

`id` 속성의 유효성 검사를 추가하려면 아래 단계를 따르세요:

1. 위에 제시된 JSON 객체를 설명하는 `Customer` 데이터 클래스를 생성합니다:
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="14-15"}

2. [JSON 직렬 변환기](server-serialization.md#register_json)와 함께 `ContentNegotiation` 플러그인을 설치합니다:
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="49-51"}

3. 서버 측에서 `Customer` 객체를 다음과 같이 수신합니다:
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="57-60"}
4. RequestValidation 플러그인 구성에서 `id` 속성이 지정된 범위 내에 있는지 확인하는 유효성 검사를 추가합니다:
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20,26-30,43"}
   
   이 경우, `id` 값이 `0`보다 작거나 같으면 RequestValidation은 **[RequestValidationException](#validation-exception)**을 발생시킬 것입니다.

## 예시: 바이트 배열 유효성 검사 {id="example-byte-array"}

이 예시에서는 바이트 배열로 수신된 요청 본문을 유효성 검사하는 방법을 살펴보겠습니다.
서버가 다음 텍스트 데이터를 포함하는 `POST` 요청을 수신한다고 가정해 봅시다:

```HTTP
```
{src="snippets/request-validation/post.http" include-lines="17-20"}

데이터를 바이트 배열로 수신하고 유효성 검사하려면 다음 단계를 수행하세요:

1. 서버 측에서 데이터를 다음과 같이 수신합니다:
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="61-64"}
2. 수신된 데이터를 유효성 검사하기 위해, `ValidatorBuilder`를 허용하고 사용자 정의 유효성 검사 규칙을 제공할 수 있는 두 번째 `validate` [함수 오버로드](#validation-function)를 사용하겠습니다:
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20,31-43"}