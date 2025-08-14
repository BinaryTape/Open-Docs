[//]: # (title: HTMX 통합)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:ktor-htmx</code>, <code>io.ktor:ktor-htmx-html</code>,
<code>io.ktor:ktor-server-htmx</code>
</p>
<var name="example_name" value="htmx-integration"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[HTMX](https://htmx.org/)는 HTML 속성을 사용하여 동적인 클라이언트 측 동작을 가능하게 하는 경량 JavaScript 라이브러리입니다. HTMX는 JavaScript를 작성하지 않고도 AJAX, CSS 트랜지션, WebSockets, 서버 전송 이벤트(Server-Sent Events)와 같은 기능을 지원합니다.

Ktor는 서버 및 클라이언트 컨텍스트 모두에서 통합을 단순화하는 공유 모듈 세트를 통해 HTMX에 대한 실험적인 최고 수준의 지원을 제공합니다. 이러한 모듈은 HTMX 헤더 작업, Kotlin DSL을 사용한 HTML 속성 정의, 서버에서 HTMX 관련 라우팅 로직 처리 도구를 제공합니다.

## 모듈 개요

Ktor의 HTMX 지원은 세 가지 실험적 모듈을 통해 제공됩니다.

| 모듈             | 설명                                           |
|--------------------|------------------------------------------------|
| `ktor-htmx`        | 코어 정의 및 헤더 상수                         |
| `ktor-htmx-html`   | Kotlin HTML DSL과의 통합                       |
| `ktor-server-htmx` | HTMX 특정 요청에 대한 라우팅 지원            |

모든 API는 `@ExperimentalKtorApi`로 마크되어 있으며 `@OptIn(ExperimentalKtorApi::class)`를 통해 옵트인해야 합니다.

## HTMX 헤더

코어 `ktor-htmx` 모듈의 미리 정의된 상수를 사용하여 HTMX 헤더에 타입 안전한 방식으로 접근하거나 설정할 수 있습니다. 이러한 상수는 트리거, 히스토리 복원 또는 콘텐츠 스와핑과 같은 HTMX 동작을 감지할 때 매직 스트링(magic string)을 피하는 데 도움이 됩니다.

### 요청 헤더

애플리케이션에서 HTMX 요청 헤더를 읽거나 매칭할 때 `HxRequestHeaders` 객체를 사용하세요.

<deflist type="wide">
<def title="HxRequestHeaders.Request">HTMX 요청 시 항상 <code>true</code></def>
<def title="HxRequestHeaders.Target">타겟 엘리먼트의 ID</def>
<def title="HxRequestHeaders.Trigger">트리거된 엘리먼트의 ID</def>
<def title="HxRequestHeaders.TriggerName">트리거된 엘리먼트의 이름</def>
<def title="HxRequestHeaders.Boosted"><code>hx-boost</code>를 통한 요청 표시</def>
<def title="HxRequestHeaders.CurrentUrl">현재 브라우저 URL</def>
<def title="HxRequestHeaders.HistoryRestoreRequest">히스토리 복원용</def>
<def title="HxRequestHeaders.Prompt"><code>hx-prompt</code>에 대한 사용자 응답</def>
</deflist>

### 응답 헤더

`HxResponseHeaders` 객체를 사용하여 HTMX 응답 헤더에 대한 상수에 접근할 수 있습니다.

<deflist type="wide">
<def title="HxResponseHeaders.Location">페이지 새로고침 없이 클라이언트 측 리다이렉션</def>
<def title="HxResponseHeaders.PushUrl">히스토리 스택에 URL 푸시</def>
<def title="HxResponseHeaders.Redirect">클라이언트 측 리다이렉션</def>
<def title="HxResponseHeaders.Refresh">전체 페이지 강제 새로고침</def>
<def title="HxResponseHeaders.ReplaceUrl">현재 URL 대체</def>
<def title="HxResponseHeaders.Reswap">응답 스와핑 방식 제어</def>
<def title="HxResponseHeaders.Retarget">콘텐츠 업데이트의 타겟 업데이트</def>
<def title="HxResponseHeaders.Reselect">스와핑할 응답 부분 선택</def>
<def title="HxResponseHeaders.Trigger">클라이언트 측 이벤트 트리거</def>
<def title="HxResponseHeaders.TriggerAfterSettle">정착 후 이벤트 트리거</def>
<def title="HxResponseHeaders.TriggerAfterSwap">스와프 후 이벤트 트리거</def>
</deflist>

## 스와프 모드

코어 `ktor-htmx` 모듈의 `HxSwap` 객체를 사용하여 다양한 HTMX 스와프 모드에 대한 상수에 접근할 수 있습니다.

<deflist type="medium">
<def title="HxSwap.innerHtml">내부 HTML 교체 (기본값)</def>
<def title="HxSwap.outerHtml ">전체 엘리먼트 교체</def>
<def title="HxSwap.textContent">텍스트 콘텐츠만 교체</def>
<def title="HxSwap.beforeBegin">타겟 엘리먼트 앞에 삽입</def>
<def title="HxSwap.afterBegin">첫 번째 자식으로 삽입</def>
<def title="HxSwap.beforeEnd">마지막 자식으로 삽입</def>
<def title="HxSwap.afterEnd">타겟 엘리먼트 뒤에 삽입</def>
<def title="HxSwap.delete">타겟 엘리먼트 삭제</def>
<def title="HxSwap.none">콘텐츠 추가 없음</def>
</deflist>

## HTML DSL 확장

`ktor-htmx-html` 모듈은 Kotlin HTML DSL에 확장 함수를 추가하여 HTMX 속성을 HTML 엘리먼트에 직접 추가할 수 있도록 합니다.

```kotlin
@OptIn(ExperimentalKtorApi::class)
html {
    body {
        button {
            attributes.hx {
                get = "/data"
                target = "#result"
                swap = HxSwap.outerHtml
                trigger = "click"
            }
            +"Load Data"
        }
    }
}
```

위 예시는 HTMX 속성을 가진 HTML을 생성합니다.

```html
<button hx-get="/api/data" hx-target="#result-div" hx-swap="outerHTML" hx-trigger="click">Load Data</button>
```

## 서버 측 라우팅

`ktor-server-htmx` 모듈은 `hx` DSL 블록을 통해 HTMX를 인식하는 라우팅을 제공합니다.

```kotlin
@OptIn(ExperimentalKtorApi::class)
routing {
    route("api") {
        // Regular route (both HTMX and non-HTMX requests)
        get {
            call.respondText("Regular response")
        }
        
        // Only matches HTMX requests (HX-Request header is present)
        hx.get {
            call.respondText("HTMX response")
        }
        
        // Matches HTMX requests with specific target
        hx {
            target("#result-div") {
                get {
                    call.respondText("Response for #result-div")
                }
            }
            
            // Matches HTMX requests with specific trigger
            trigger("#load-button") {
                get {
                    call.respondText("Response for #load-button clicks")
                }
            }
        }
    }
}
```

이러한 기능을 통해 애플리케이션은 클라이언트가 전송한 HTMX 헤더에 따라 다르게 응답할 수 있습니다.