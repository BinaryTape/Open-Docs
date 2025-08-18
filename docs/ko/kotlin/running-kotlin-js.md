[//]: # (title: Kotlin/JS 실행하기)

Kotlin/JS 프로젝트는 Kotlin Multiplatform Gradle 플러그인으로 관리되므로, 적절한 태스크를 사용하여 프로젝트를 실행할 수 있습니다. 빈 프로젝트에서 시작하는 경우, 실행할 샘플 코드가 있는지 확인하세요. `src/jsMain/kotlin/App.kt` 파일을 생성하고 작은 "Hello, World" 유형의 코드 스니펫으로 채우세요:

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

대상 플랫폼에 따라 코드를 처음 실행하기 위해 일부 플랫폼별 추가 설정이 필요할 수 있습니다.

## Node.js 타겟 실행하기

Kotlin/JS로 Node.js를 타겟팅할 때, 단순히 `jsNodeDevelopmentRun` Gradle 태스크를 실행하면 됩니다. 예를 들어, Gradle 래퍼를 사용하여 명령줄을 통해 이를 수행할 수 있습니다:

```bash
./gradlew jsNodeDevelopmentRun
```

IntelliJ IDEA를 사용하는 경우, `jsNodeDevelopmentRun` 액션을 Gradle 도구 창에서 찾을 수 있습니다:

![Gradle Run task in IntelliJ IDEA](run-gradle-task.png){width=700}

첫 실행 시, `kotlin.multiplatform` Gradle 플러그인이 프로젝트를 실행하는 데 필요한 모든 종속성(dependencies)을 다운로드합니다. 빌드가 완료되면 프로그램이 실행되고, 터미널에서 로깅 출력을 확인할 수 있습니다:

![Executing the JS target in a Kotlin Multiplatform project in IntelliJ IDEA](cli-output.png){width=700}

## 브라우저 타겟 실행하기

브라우저를 타겟팅할 때, 프로젝트에는 HTML 페이지가 있어야 합니다. 이 페이지는 애플리케이션 작업 중 개발 서버에서 제공(serve)되며, 컴파일된 Kotlin/JS 파일을 포함해야 합니다. `/src/jsMain/resources/index.html` HTML 파일을 생성하고 채우세요:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JS Client</title>
</head>
<body>
<script src="js-tutorial.js"></script>
</body>
</html>
```

기본적으로 참조되어야 하는 프로젝트의 생성된 아티팩트(webpack을 통해 생성됨)의 이름은 프로젝트 이름입니다 (이 경우, `js-tutorial`). 프로젝트 이름을 `followAlong`으로 지정했다면, `js-tutorial.js` 대신 `followAlong.js`를 포함해야 합니다.

이러한 조정을 마친 후, 통합 개발 서버를 시작하세요. Gradle 래퍼를 통해 명령줄에서 이를 수행할 수 있습니다:

```bash
./gradlew jsBrowserDevelopmentRun
```

IntelliJ IDEA에서 작업하는 경우, `jsBrowserDevelopmentRun` 액션을 Gradle 도구 창에서 찾을 수 있습니다.

프로젝트가 빌드되면, 내장된 `webpack-dev-server`가 실행을 시작하고, 이전에 지정한 HTML 파일을 가리키는 (겉보기에는 빈) 브라우저 창을 엽니다. 프로그램이 올바르게 실행되는지 확인하려면, 브라우저의 개발자 도구 (예를 들어, 마우스 오른쪽 버튼을 클릭하고 _검사_ 액션을 선택)를 여세요. 개발자 도구 내부에서 콘솔로 이동하면 실행된 JavaScript 코드의 결과를 볼 수 있습니다:

![Console output in browser developer tools](browser-console-output.png){width=700}

이 설정을 통해 코드 변경 후 프로젝트를 다시 컴파일하여 변경 사항을 확인할 수 있습니다. Kotlin/JS는 또한 개발 중에 애플리케이션을 자동으로 재빌드하는 더 편리한 방법도 지원합니다. 이 _연속 모드_를 설정하는 방법을 알아보려면 [해당 튜토리얼](dev-server-continuous-compilation.md)을 확인하세요.