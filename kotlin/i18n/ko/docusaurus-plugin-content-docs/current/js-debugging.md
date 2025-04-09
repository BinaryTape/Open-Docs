---
title: "Kotlin/JS 코드 디버그"
---
JavaScript source map은 번들러 또는 축소기가 생성한 최소화된 코드와 개발자가 작업하는 실제 소스 코드 간의 매핑을 제공합니다. 이러한 방식으로 source map은 코드 실행 중 디버깅을 지원합니다.

Kotlin Multiplatform Gradle 플러그인은 프로젝트 빌드에 대한 source map을 자동으로 생성하여 추가 구성 없이 사용할 수 있도록 합니다.

## 브라우저에서 디버깅

대부분의 최신 브라우저는 페이지 콘텐츠를 검사하고 실행되는 코드를 디버깅할 수 있는 도구를 제공합니다. 자세한 내용은 브라우저 설명서를 참조하십시오.

브라우저에서 Kotlin/JS를 디버깅하려면 다음을 수행하십시오.

1. 사용 가능한 _run_ Gradle 작업 중 하나(예: 멀티플랫폼 프로젝트의 `browserDevelopmentRun` 또는
   `jsBrowserDevelopmentRun`)을 호출하여 프로젝트를 실행합니다.
   [Kotlin/JS 실행](running-kotlin-js#run-the-browser-target)에 대해 자세히 알아보십시오.
2. 브라우저에서 페이지로 이동하여 개발자 도구를 시작합니다(예: 마우스 오른쪽 버튼을 클릭하고 **Inspect** 작업 선택).
   인기 있는 브라우저에서 [개발자 도구를 찾는 방법](https://balsamiq.com/support/faqs/browserconsole/)을 알아보십시오.
3. 프로그램이 콘솔에 정보를 로깅하는 경우 **Console** 탭으로 이동하여 이 출력을 확인합니다.
   브라우저에 따라 이러한 로그는 Kotlin 소스 파일 및 해당 파일에서 온 줄을 참조할 수 있습니다.

<img src="/img/devtools-console.png" alt="Chrome DevTools console" width="600" style={{verticalAlign: 'middle'}}/>

4. 오른쪽의 파일 참조를 클릭하여 해당 코드 줄로 이동합니다.
   또는 **Sources** 탭으로 수동으로 전환하여 파일 트리에서 필요한 파일을 찾을 수 있습니다.
   Kotlin 파일로 이동하면 최소화된 JavaScript와 반대로 일반 Kotlin 코드가 표시됩니다.

<img src="/img/devtools-sources.png" alt="Debugging in Chrome DevTools" width="600" style={{verticalAlign: 'middle'}}/>

이제 프로그램 디버깅을 시작할 수 있습니다. 줄 번호 중 하나를 클릭하여 중단점을 설정합니다.
개발자 도구는 명령문 내에서 중단점 설정을 지원합니다. 일반 JavaScript 코드와 마찬가지로 설정된 모든
중단점은 페이지를 다시 로드해도 유지됩니다. 이를 통해 스크립트가 처음 로드될 때 실행되는 Kotlin의 `main()` 메서드를
디버깅할 수도 있습니다.

## IDE에서 디버깅

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)는 개발 중에 코드를 디버깅하기 위한 강력한 도구 세트를 제공합니다.

IntelliJ IDEA에서 Kotlin/JS를 디버깅하려면 **JavaScript Debug** 구성이 필요합니다. 이러한 디버그 구성을 추가하려면:

1. **Run | Edit Configurations**로 이동합니다.
2. **+**를 클릭하고 **JavaScript Debug**를 선택합니다.
3. 구성 **Name**을 지정하고 프로젝트가 실행되는 **URL**을 제공합니다(기본적으로 `http://localhost:8080`).

<img src="/img/debug-config.png" alt="JavaScript debug configuration" width="700" style={{verticalAlign: 'middle'}}/>

4. 구성을 저장합니다.

[JavaScript 디버그 구성 설정](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)에 대해 자세히 알아보십시오.

이제 프로젝트를 디버깅할 준비가 되었습니다!

1. 사용 가능한 _run_ Gradle 작업 중 하나(예: 멀티플랫폼 프로젝트의 `browserDevelopmentRun` 또는
   `jsBrowserDevelopmentRun`)을 호출하여 프로젝트를 실행합니다.
   [Kotlin/JS 실행](running-kotlin-js#run-the-browser-target)에 대해 자세히 알아보십시오.
2. 이전에 만든 JavaScript 디버그 구성을 실행하여 디버깅 세션을 시작합니다.

<img src="/img/debug-config-run.png" alt="JavaScript debug configuration" width="700" style={{verticalAlign: 'middle'}}/>

3. IntelliJ IDEA의 **Debug** 창에서 프로그램의 콘솔 출력을 볼 수 있습니다. 출력 항목은
   Kotlin 소스 파일 및 해당 파일에서 온 줄을 참조합니다.

<img src="/img/ide-console-output.png" alt="JavaScript debug output in the IDE" width="700" style={{verticalAlign: 'middle'}}/>

4. 오른쪽의 파일 참조를 클릭하여 해당 코드 줄로 이동합니다.

이제 IDE가 제공하는 전체 도구 세트(중단점, 단계별 실행, 식
평가 등)를 사용하여 프로그램 디버깅을 시작할 수 있습니다. [IntelliJ IDEA에서 디버깅](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)에 대해 자세히 알아보십시오.

:::note
IntelliJ IDEA의 현재 JavaScript 디버거의 제한 사항으로 인해 실행이 중단점에서 멈추도록 하려면 JavaScript
디버그를 다시 실행해야 할 수 있습니다.

:::

## Node.js에서 디버깅

프로젝트가 Node.js를 대상으로 하는 경우 이 런타임에서 디버깅할 수 있습니다.

Node.js를 대상으로 하는 Kotlin/JS 애플리케이션을 디버깅하려면 다음을 수행하십시오.

1. `build` Gradle 작업을 실행하여 프로젝트를 빌드합니다.
2. 프로젝트 디렉토리 내의 `build/js/packages/your-module/kotlin/` 디렉토리에서 Node.js에 대한 결과 `.js` 파일을 찾습니다.
3. [Node.js 디버깅 가이드](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides)에 설명된 대로 Node.js에서 디버깅합니다.

## 다음 단계

이제 Kotlin/JS 프로젝트로 디버그 세션을 시작하는 방법을 알았으므로 디버깅 도구를 효율적으로 사용하는 방법을 알아보십시오.

* [Google Chrome에서 JavaScript 디버깅](https://developer.chrome.com/docs/devtools/javascript/)하는 방법을 알아보십시오.
* [IntelliJ IDEA JavaScript 디버거](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)에 익숙해지십시오.
* [Node.js에서 디버깅](https://nodejs.org/en/docs/guides/debugging-getting-started/)하는 방법을 알아보십시오.

## 문제가 발생하면

Kotlin/JS 디버깅에 문제가 발생하면 문제 추적기인 [YouTrack](https://kotl.in/issue)에 보고해 주십시오.