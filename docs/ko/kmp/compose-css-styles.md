[//]: # (title: 뷰포트 설정하기)
<show-structure for="none"/>

Compose Multiplatform for web은 `ComposeViewport` 함수를 사용하여 UI를 HTML 캔버스(canvas)에 렌더링합니다. 이 함수는 전역 CSS 스타일을 주입하지 않으므로, 애플리케이션이 HTML 구조와 통합되는 방식을 완전히 제어할 수 있습니다.

브라우저 창 내에 콘텐츠를 올바르게 맞추려면 호스트 컨테이너에 명시적인 CSS를 적용하세요. CSS를 지정하지 않으면 캔버스 크기가 올바르게 조정되지 않거나 의도한 공간을 채우지 못할 수 있습니다.

다음은 콘텐츠가 전체 화면을 채우도록 하는 표준 `styles.css` 예시입니다:

```css
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
```

그런 다음, 웹 소스 세트의 `main` 함수에서 엔트리 포인트를 초기화하세요:

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(viewportContainerId = "webApp") {
        App()
    }
}
```

> 이전에 사용되던 `CanvasBasedWindow`는 이제 사용이 중단(deprecated)되었습니다. 이 함수는 캔버스가 브라우저 창을 채우도록 페이지의 HTML 요소에 CSS 스타일을 직접 자동으로 삽입했습니다. 단독 실행형 앱의 경우에는 더 간단했지만, 기존 웹 레이아웃에 Compose를 삽입하기는 어려웠습니다. `ComposeViewport`는 표준 CSS 기반 레이아웃 관리에 의존하는 더 유연한 접근 방식입니다.

## 다음 단계

* [웹 관련 리소스 처리 방법](compose-web-resources.md)을 알아보세요.
* [Kotlin/Wasm 및 Compose Multiplatform](https://kotlinlang.org/docs/wasm-get-started.html)에 대해 더 자세히 읽어보세요.