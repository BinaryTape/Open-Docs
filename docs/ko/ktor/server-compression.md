[//]: # (title: 압축)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-compression"/>
<var name="package_name" value="io.ktor.server.plugins.compression"/>
<var name="plugin_name" value="Compression"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="compression"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

Ktor는 [Compression](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-compression/io.ktor.server.plugins.compression/-compression.html) 플러그인을 사용하여 응답 본문을 압축하고 요청 본문의 압축을 해제하는 기능을 제공합니다. `gzip` 및 `deflate`를 포함한 다양한 압축 알고리즘을 사용할 수 있으며, 데이터 압축에 필요한 조건(예: 콘텐츠 타입 또는 응답 크기)을 지정하거나 특정 요청 파라미터에 따라 데이터를 압축할 수도 있습니다.

> 참고로, %plugin_name% 플러그인은 현재 SSE 응답을 지원하지 않습니다.
>
{style="warning"}

> Ktor에서 사전 압축된 정적 파일을 제공하는 방법을 알아보려면 [](server-static-content.md#precompressed)를 참조하세요.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

이를 통해 서버에서 `gzip`, `deflate`, `identity` 인코더를 사용할 수 있습니다. 다음 챕터에서 특정 인코더만 활성화하고 데이터 압축 조건을 구성하는 방법을 알아봅니다. 참고로, 추가된 모든 인코더는 필요한 경우 요청 본문의 압축을 해제하는 데 사용됩니다.

## 압축 설정 구성 {id="configure"}

압축은 여러 가지 방법으로 구성할 수 있습니다: 특정 인코더만 활성화하거나, 우선순위를 지정하거나, 특정 콘텐츠 타입만 압축하는 등의 방법이 있습니다.

### 특정 인코더 추가 {id="add_specific_encoders"}

특정 인코더만 활성화하려면 해당 확장 함수를 호출하면 됩니다. 예를 들어:

```kotlin
install(Compression) {
    gzip()
    deflate()
}
```

각 압축 알고리즘의 우선순위는 `priority` 속성을 설정하여 지정할 수 있습니다:

```kotlin
install(Compression) {
    gzip {
        priority = 0.9
    }
    deflate {
        priority = 1.0
    }
}
```

위 예시에서 `deflate`는 `gzip`보다 높은 우선순위 값을 가지므로 `gzip`보다 우선합니다. 서버는 먼저 [Accept-Encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding) 헤더 내의 [품질(Quality Values)](https://developer.mozilla.org/en-US/docs/Glossary/Quality_Values) 값을 확인한 다음 지정된 우선순위를 고려한다는 점에 유의하세요.

### 콘텐츠 타입 구성 {id="configure_content_type"}

기본적으로 Ktor는 `audio`, `video`, `image`, `text/event-stream`과 같은 특정 콘텐츠 타입은 압축하지 않습니다. `matchContentType`를 호출하여 압축할 콘텐츠 타입을 선택하거나 `excludeContentType`를 사용하여 원하는 미디어 타입을 압축에서 제외할 수 있습니다. 아래 코드 스니펫은 `gzip`을 사용하여 JavaScript 코드를 압축하고 `deflate`를 사용하여 모든 텍스트 하위 타입을 압축하는 방법을 보여줍니다.

```kotlin
```

{src="snippets/compression/src/main/kotlin/compression/Application.kt" include-lines="12-13,15-19,21-25"}

전체 예제는 다음에서 찾을 수 있습니다: [compression](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/compression).

### 응답 크기 구성 {id="configure_response_size"}

`%plugin_name%` 플러그인을 사용하면 지정된 값을 초과하지 않는 크기의 응답에 대해 압축을 비활성화할 수 있습니다. 이렇게 하려면 `minimumSize` 함수에 원하는 값(바이트 단위)을 전달하세요.

```kotlin
    install(Compression) {
        deflate {
            minimumSize(1024)
        }
    }

```

### 사용자 지정 조건 지정 {id="specify_custom_conditions"}

필요한 경우 `condition` 함수를 사용하여 사용자 지정 조건을 제공하고 특정 요청 파라미터에 따라 데이터를 압축할 수 있습니다. 아래 코드 스니펫은 지정된 URI에 대한 요청을 압축하는 방법을 보여줍니다.

```kotlin
install(Compression) {
    gzip {
        condition {
            request.uri == "/orders"
        }
    }
}
```

## HTTPS 보안 {id="security"}

압축이 활성화된 HTTPS는 [BREACH](https://en.wikipedia.org/wiki/BREACH) 공격에 취약합니다. 이 공격을 완화하는 다양한 방법을 사용할 수 있습니다. 예를 들어, 리퍼러(referrer) 헤더가 교차 사이트 요청을 나타낼 때마다 압축을 비활성화할 수 있습니다. Ktor에서는 리퍼러(referrer) 헤더 값을 확인하여 이를 수행할 수 있습니다.

```kotlin
install(Compression) {
    gzip {
        condition {
            request.headers[HttpHeaders.Referrer]?.startsWith("https://my.domain/") == true
        }
    }
}
```

## 사용자 지정 인코더 구현 {id="custom_encoder"}

필요한 경우 [ContentEncoder](https://api.ktor.io/ktor-utils/io.ktor.util/-content-encoder/index.html) 인터페이스를 구현하여 자신만의 인코더를 제공할 수 있습니다. 구현 예시는 [GzipEncoder](https://github.com/ktorio/ktor/blob/b5b59ca3ae61601e6175f334e6a1252609638e61/ktor-server/ktor-server-plugins/ktor-server-compression/jvm/src/io/ktor/server/plugins/compression/Encoders.kt#L41)를 참조하세요.