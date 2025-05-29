[//]: # (title: Kotlin/JS 코드 디버그하기)

JavaScript 소스 맵은 번들러나 미니파이어가 생성하는 최소화된 코드와 개발자가 작업하는 실제 소스 코드 간의 매핑을 제공합니다. 이를 통해 소스 맵은 코드 실행 중 디버깅을 지원합니다.

Kotlin Multiplatform Gradle 플러그인은 프로젝트 빌드를 위한 소스 맵을 자동으로 생성하여, 추가 설정 없이도 소스 맵을 사용할 수 있도록 합니다.

## 브라우저에서 디버그하기

대부분의 최신 브라우저는 페이지 콘텐츠를 검사하고 페이지에서 실행되는 코드를 디버깅할 수 있는 도구를 제공합니다. 자세한 내용은 사용 중인 브라우저의 문서를 참조하십시오.

브라우저에서 Kotlin/JS를 디버그하려면:

1.  사용 가능한 _run_ Gradle 태스크 중 하나를 호출하여 프로젝트를 실행합니다. 예를 들어, 멀티플랫폼 프로젝트에서는 `browserDevelopmentRun` 또는 `jsBrowserDevelopmentRun`입니다.
    [Kotlin/JS 실행](running-kotlin-js.md#run-the-browser-target)에 대해 자세히 알아보세요.
2.  브라우저에서 페이지로 이동한 다음 개발자 도구를 실행합니다(예: 마우스 오른쪽 클릭 후 **검사** 동작 선택). 인기 있는 브라우저에서 [개발자 도구를 찾는 방법](https://balsamiq.com/support/faqs/browserconsole/)을 알아보세요.
3.  프로그램이 콘솔에 정보를 로깅하는 경우, **콘솔** 탭으로 이동하여 해당 출력을 확인합니다. 사용 중인 브라우저에 따라 이러한 로그는 Kotlin 소스 파일과 로그가 발생한 줄을 참조할 수 있습니다.

![Chrome DevTools console](devtools-console.png){width="600"}

4.  오른쪽에 있는 파일 참조를 클릭하여 해당 코드 줄로 이동합니다.
    또는 수동으로 **소스** 탭으로 전환하여 파일 트리에서 필요한 파일을 찾을 수 있습니다. Kotlin 파일로 이동하면 (최소화된 JavaScript가 아닌) 일반 Kotlin 코드를 볼 수 있습니다.

![Debugging in Chrome DevTools](devtools-sources.png){width="600"}

이제 프로그램을 디버깅할 수 있습니다. 줄 번호 중 하나를 클릭하여 중단점을 설정합니다.
개발자 도구는 문 내에서도 중단점 설정을 지원합니다. 일반 JavaScript 코드와 마찬가지로, 설정된 모든 중단점은 페이지를 다시 로드해도 유지됩니다. 이는 스크립트가 처음 로드될 때 실행되는 Kotlin의 `main()` 메서드를 디버그하는 것도 가능하게 합니다.

## IDE에서 디버그하기

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)는 개발 중에 코드를 디버깅하기 위한 강력한 도구 세트를 제공합니다.

IntelliJ IDEA에서 Kotlin/JS를 디버그하려면 **JavaScript 디버그** 구성이 필요합니다. 이러한 디버그 구성을 추가하려면:

1.  **실행 | 구성 편집**으로 이동합니다.
2.  **+**를 클릭하고 **JavaScript 디버그**를 선택합니다.
3.  구성 **이름**을 지정하고 프로젝트가 실행되는 **URL**(`http://localhost:8080`이 기본값)을 제공합니다.

![JavaScript debug configuration](debug-config.png){width=700}

4.  구성을 저장합니다.

[JavaScript 디버그 구성 설정](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html)에 대해 자세히 알아보세요.

이제 프로젝트를 디버그할 준비가 되었습니다!

1.  사용 가능한 _run_ Gradle 태스크 중 하나를 호출하여 프로젝트를 실행합니다. 예를 들어, 멀티플랫폼 프로젝트에서는 `browserDevelopmentRun` 또는 `jsBrowserDevelopmentRun`입니다.
    [Kotlin/JS 실행](running-kotlin-js.md#run-the-browser-target)에 대해 자세히 알아보세요.
2.  이전에 생성한 JavaScript 디버그 구성을 실행하여 디버깅 세션을 시작합니다.

![JavaScript debug configuration](debug-config-run.png){width=700}

3.  IntelliJ IDEA의 **디버그** 창에서 프로그램의 콘솔 출력을 확인할 수 있습니다. 출력 항목은 Kotlin 소스 파일과 로그가 발생한 줄을 참조합니다.

![JavaScript debug output in the IDE](ide-console-output.png){width=700}

4.  오른쪽에 있는 파일 참조를 클릭하여 해당 코드 줄로 이동합니다.

이제 IDE가 제공하는 중단점, 스텝 실행, 표현식 평가 등 모든 도구를 사용하여 프로그램을 디버그할 수 있습니다. [IntelliJ IDEA에서 디버깅](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)에 대해 자세히 알아보세요.

> IntelliJ IDEA의 현재 JavaScript 디버거의 한계로 인해, 실행이 중단점에서 멈추도록 JavaScript 디버그를 다시 실행해야 할 수 있습니다.
>
{style="note"}

## Node.js에서 디버그하기

프로젝트가 Node.js를 대상으로 하는 경우, 이 런타임에서 디버그할 수 있습니다.

Node.js를 대상으로 하는 Kotlin/JS 애플리케이션을 디버그하려면:

1.  `build` Gradle 태스크를 실행하여 프로젝트를 빌드합니다.
2.  프로젝트 디렉터리 내의 `build/js/packages/your-module/kotlin/` 디렉터리에서 Node.js용 `.js` 결과 파일을 찾습니다.
3.  [Node.js 디버깅 가이드](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides)에 설명된 대로 Node.js에서 디버그합니다.

## 다음 단계

이제 Kotlin/JS 프로젝트로 디버그 세션을 시작하는 방법을 알았으니, 디버깅 도구를 효율적으로 사용하는 방법을 배워보세요:

*   [Google Chrome에서 JavaScript를 디버그하는 방법](https://developer.chrome.com/docs/devtools/javascript/)을 알아보세요.
*   [IntelliJ IDEA JavaScript 디버거](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)에 익숙해지세요.
*   [Node.js에서 디버그하는 방법](https://nodejs.org/en/docs/guides/debugging-getting-started/)을 알아보세요.

## 문제 발생 시

Kotlin/JS 디버깅에 문제가 발생하는 경우, 이슈 트래커인 [YouTrack](https://kotl.in/issue)에 보고해 주십시오.