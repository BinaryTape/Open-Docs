---
title: "Kotlin/JS 실행"
---
Kotlin/JS 프로젝트는 Kotlin Multiplatform Gradle 플러그인으로 관리되므로 적절한 작업을 사용하여 프로젝트를 실행할 수 있습니다. 빈 프로젝트로 시작하는 경우 실행할 샘플 코드가 있는지 확인하세요. `src/jsMain/kotlin/App.kt` 파일을 만들고 간단한 "Hello, World" 유형의 코드 스니펫으로 채웁니다.

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

대상 플랫폼에 따라 코드를 처음 실행하려면 플랫폼별 추가 설정이 필요할 수 있습니다.

## Node.js 타겟 실행

Kotlin/JS로 Node.js를 타겟팅하는 경우 `jsNodeDevelopmentRun` Gradle 작업을 실행하기만 하면 됩니다. 예를 들어 Gradle wrapper를 사용하여 명령줄을 통해 이 작업을 수행할 수 있습니다.

```bash
./gradlew jsNodeDevelopmentRun
```

IntelliJ IDEA를 사용하는 경우 Gradle 도구 창에서 `jsNodeDevelopmentRun` 작업을 찾을 수 있습니다.

<img src="/img/run-gradle-task.png" alt="IntelliJ IDEA의 Gradle Run 작업" width="700" style={{verticalAlign: 'middle'}}/>

처음 시작할 때 `kotlin.multiplatform` Gradle 플러그인은 필요한 모든 종속성을 다운로드하여 실행할 수 있도록 합니다. 빌드가 완료되면 프로그램이 실행되고 터미널에서 로깅 출력을 볼 수 있습니다.

<img src="/img/cli-output.png" alt="IntelliJ IDEA에서 Kotlin Multiplatform 프로젝트의 JS 타겟 실행" width="700" style={{verticalAlign: 'middle'}}/>

## 브라우저 타겟 실행

브라우저를 타겟팅하는 경우 프로젝트에 HTML 페이지가 있어야 합니다. 이 페이지는 애플리케이션 작업을 하는 동안 개발 서버에서 제공되며 컴파일된 Kotlin/JS 파일을 포함해야 합니다. HTML 파일 `/src/jsMain/resources/index.html`을 만들고 채웁니다.

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

기본적으로 참조해야 하는 프로젝트의 생성된 아티팩트(webpack을 통해 생성됨)의 이름은 프로젝트 이름(이 경우 `js-tutorial`)입니다. 프로젝트 이름을 `followAlong`으로 지정한 경우 `js-tutorial.js` 대신 `followAlong.js`를 포함해야 합니다.

이러한 조정을 수행한 후 통합 개발 서버를 시작합니다. Gradle wrapper를 통해 명령줄에서 이 작업을 수행할 수 있습니다.

```bash
./gradlew jsBrowserDevelopmentRun
```

IntelliJ IDEA에서 작업하는 경우 Gradle 도구 창에서 `jsBrowserDevelopmentRun` 작업을 찾을 수 있습니다.

프로젝트가 빌드되면 내장된 `webpack-dev-server`가 실행을 시작하고 이전에 지정한 HTML 파일을 가리키는 (겉보기에 비어 있는) 브라우저 창을 엽니다. 프로그램이 올바르게 실행되고 있는지 확인하려면 브라우저의 개발자 도구를 엽니다(예: 마우스 오른쪽 버튼을 클릭하고 _Inspect_ 작업 선택). 개발자 도구 내에서 콘솔로 이동하면 실행된 JavaScript 코드의 결과를 볼 수 있습니다.

<img src="/img/browser-console-output.png" alt="브라우저 개발자 도구의 콘솔 출력" width="700" style={{verticalAlign: 'middle'}}/>

이 설정을 사용하면 코드 변경 후 프로젝트를 다시 컴파일하여 변경 사항을 확인할 수 있습니다. Kotlin/JS는 또한 애플리케이션을 개발하는 동안 자동으로 다시 빌드하는 더 편리한 방법을 지원합니다. 이 _continuous mode_를 설정하는 방법을 알아보려면 [해당 튜토리얼](dev-server-continuous-compilation)을 확인하세요.