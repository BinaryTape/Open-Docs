[//]: # (title: HTMX 통합)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-htmx</code>, <code>io.ktor:ktor-htmx-html</code>,
<code>io.ktor:ktor-server-htmx</code>
</p>
<var name="example_name" value="htmx-integration"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[HTMX](https://htmx.org/)는 HTML 속성을 사용하여 동적인 클라이언트 측 동작을 가능하게 하는 경량 JavaScript 라이브러리입니다. JavaScript를 작성하지 않고도 AJAX, CSS 트랜지션(transition), WebSocket, Server-Sent Events와 같은 기능을 지원합니다.

Ktor는 서버와 클라이언트 컨텍스트 모두에서 통합을 간소화하는 공통 모듈 세트를 통해 HTMX에 대한 실험적인 일급(first-class) 지원을 제공합니다. 이러한 모듈은 HTMX 헤더 작업, Kotlin DSL을 사용한 HTML 속성 정의, 서버에서의 HTMX 전용 라우팅 로직 처리 등을 위한 도구를 제공합니다.

## 모듈 개요

Ktor의 HTMX 지원은 세 가지 실험적 모듈을 통해 제공됩니다:

| 모듈 | 설명 |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 핵심 정의 및 헤더 상수 |
| `ktor-htmx-html`   | Kotlin HTML DSL과의 통합 |
| `ktor-server-htmx` | HTMX 전용 요청에 대한 라우팅 지원 |

모든 API는 `@ExperimentalKtorApi`로 표시되어 있으며, `@OptIn(ExperimentalKtorApi::class)`를 통한 사용 동의가 필요합니다.

## HTMX 헤더

핵심 모듈인 `ktor-htmx`에서 제공하는 미리 정의된 상수를 사용하여 타입 안전한 방식으로 HTMX 헤더에 접근하거나 설정할 수 있습니다. 이러한 상수를 사용하면 트리거(trigger), 기록 복구(history restoration) 또는 콘텐츠 스왑(content swapping)과 같은 HTMX 동작을 감지할 때 매직 문자열(magic string) 사용을 피할 수 있습니다.

### 요청 헤더(Request headers)

애플리케이션에서 HTMX 요청 헤더를 읽거나 일치시키려면 `HxRequestHeaders` 객체를 사용하십시오:

<deflist type="wide">
<def title="HxRequestHeaders.Request">HTMX 요청인 경우 항상 <code>true</code>입니다.</def>
<def title="HxRequestHeaders.Target">대상 요소의 ID입니다.</def>
<def title="HxRequestHeaders.Trigger">트리거된 요소의 ID입니다.</def>
<def title="HxRequestHeaders.TriggerName">트리거된 요소의 이름입니다.</def>
<def title="HxRequestHeaders.Boosted">hx-boost를 통한 요청임을 나타냅니다.</def>
<def title="HxRequestHeaders.CurrentUrl">브라우저의 현재 URL입니다.</def>
<def title="HxRequestHeaders.HistoryRestoreRequest">기록 복구를 위한 요청임을 나타냅니다.</def>
<def title="HxRequestHeaders.Prompt">hx-prompt에 대한 사용자 응답입니다.</def>
</deflist>

### 응답 헤더(Response headers)

`HxResponseHeaders` 객체를 사용하여 HTMX 응답 헤더용 상수에 접근할 수 있습니다:

<deflist type="wide">
<def title="HxResponseHeaders.Location">페이지 새로고침 없이 클라이언트 측 리다이렉트를 수행합니다.</def>
<def title="HxResponseHeaders.PushUrl">URL을 히스토리 스택에 추가합니다.</def>
<def title="HxResponseHeaders.Redirect">클라이언트 측 리다이렉트를 수행합니다.</def>
<def title="HxResponseHeaders.Refresh">페이지의 전체 새로고침을 강제합니다.</def>
<def title="HxResponseHeaders.ReplaceUrl">현재 URL을 대체합니다.</def>
<def title="HxResponseHeaders.Reswap">응답이 스왑(swap)되는 방식을 제어합니다.</def>
<def title="HxResponseHeaders.Retarget">콘텐츠 업데이트의 대상을 변경합니다.</def>
<def title="HxResponseHeaders.Reselect">스왑할 응답의 일부를 선택합니다.</def>
<def title="HxResponseHeaders.Trigger">클라이언트 측 이벤트를 트리거합니다.</def>
<def title="HxResponseHeaders.TriggerAfterSettle">정착(settle) 후 이벤트를 트리거합니다.</def>
<def title="HxResponseHeaders.TriggerAfterSwap">스왑(swap) 후 이벤트를 트리거합니다.</def>
</deflist>

## 스왑 모드(Swap modes)

`ktor-htmx` 핵심 모듈의 `HxSwap` 객체를 사용하여 다양한 HTMX 스왑 모드 상수에 접근할 수 있습니다.

<deflist type="medium">
<def title="HxSwap.innerHtml">내부 HTML을 교체합니다 (기본값).</def>
<def title="HxSwap.outerHtml ">요소 전체를 교체합니다.</def>
<def title="HxSwap.textContent">텍스트 콘텐츠만 교체합니다.</def>
<def title="HxSwap.beforeBegin">대상 요소 앞에 삽입합니다.</def>
<def title="HxSwap.afterBegin">첫 번째 자식으로 삽입합니다.</def>
<def title="HxSwap.beforeEnd">마지막 자식으로 삽입합니다.</def>
<def title="HxSwap.afterEnd">대상 요소 뒤에 삽입합니다.</def>
<def title="HxSwap.delete">대상 요소를 삭제합니다.</def>
<def title="HxSwap.none">콘텐츠를 추가하지 않습니다.</def>
</deflist>

## HTML DSL 확장

`ktor-htmx-html` 모듈은 Kotlin의 HTML DSL에 확장 함수를 추가하여 HTML 요소에 HTMX 속성을 직접 추가할 수 있게 해줍니다:

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

위의 예제는 다음과 같은 HTMX 속성이 포함된 HTML을 생성합니다:

```html
<button hx-get="/api/data" hx-target="#result-div" hx-swap="outerHTML" hx-trigger="click">Load Data</button>
```

## 서버 측 라우팅

`ktor-server-htmx` 모듈은 `hx` DSL 블록을 통해 HTMX를 인식하는 라우팅을 제공합니다:

```kotlin
@OptIn(ExperimentalKtorApi::class)
routing {
    route("api") {
        // 일반 라우트 (HTMX 및 비 HTMX 요청 모두 해당)
        get {
            call.respondText("Regular response")
        }
        
        // HTMX 요청만 일치 (HX-Request 헤더가 있는 경우)
        hx.get {
            call.respondText("HTMX response")
        }
        
        // 특정 대상을 가진 HTMX 요청과 일치
        hx {
            target("#result-div") {
                get {
                    call.respondText("Response for #result-div")
                }
            }
            
            // 특정 트리거를 가진 HTMX 요청과 일치
            trigger("#load-button") {
                get {
                    call.respondText("Response for #load-button clicks")
                }
            }
        }
    }
}
```

이러한 기능을 사용하면 클라이언트가 보낸 HTMX 헤더에 따라 애플리케이션이 다르게 응답하도록 만들 수 있습니다.