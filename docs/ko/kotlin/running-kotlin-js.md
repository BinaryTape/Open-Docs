[//]: # (title: Kotlin/JS 실행하기)

Kotlin/JS 프로젝트는 Kotlin 멀티플랫폼 Gradle 플러그인으로 관리되므로, 적절한 태스크를 사용하여 프로젝트를 실행할 수 있습니다. 빈 프로젝트로 시작하는 경우, 실행할 샘플 코드가 있는지 확인하세요.
`src/jsMain/kotlin/App.kt` 파일을 생성하고 간단한 "Hello, World" 유형의 코드 스니펫을 작성합니다.

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

타겟 플랫폼에 따라 코드를 처음 실행할 때 플랫폼별 추가 설정이 필요할 수 있습니다.

## Node.js 타겟 실행

Kotlin/JS로 Node.js를 타겟팅할 때는 `jsNodeDevelopmentRun` Gradle 태스크를 실행하기만 하면 됩니다. 예를 들어 Gradle 래퍼를 사용하는 커맨드 라인을 통해 이 작업을 수행할 수 있습니다.

```bash
./gradlew jsNodeDevelopmentRun
```

IntelliJ IDEA를 사용하는 경우 Gradle 도구 창에서 `jsNodeDevelopmentRun` 액션을 찾을 수 있습니다.

![IntelliJ IDEA의 Gradle 실행 태스크](run-gradle-task.png){width=700}

처음 시작할 때 `kotlin.multiplatform` Gradle 플러그인이 실행에 필요한 모든 의존성을 다운로드합니다.
빌드가 완료되면 프로그램이 실행되고 터미널에서 로깅 출력을 확인할 수 있습니다.

![IntelliJ IDEA에서 Kotlin 멀티플랫폼 프로젝트의 JS 타겟 실행](cli-output.png){width=700}

## 브라우저 타겟 실행

브라우저를 타겟팅할 때는 프로젝트에 HTML 페이지가 있어야 합니다. 이 페이지는 애플리케이션 작업을 수행하는 동안 개발 서버에서 제공되며, 컴파일된 Kotlin/JS 파일을 포함해야 합니다.
`/src/jsMain/resources/index.html` HTML 파일을 생성하고 채웁니다.

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

기본적으로 참조해야 하는 프로젝트의 생성된 아티팩트(webpack을 통해 생성됨) 이름은 프로젝트 이름(이 경우 `js-tutorial`)입니다. 만약 프로젝트 이름을 `followAlong`으로 지었다면, `js-tutorial.js` 대신 `followAlong.js`를 포함해야 합니다.

이러한 조정을 마친 후 통합 개발 서버를 시작하세요. Gradle 래퍼를 통해 커맨드 라인에서 이 작업을 수행할 수 있습니다.

```bash
./gradlew jsBrowserDevelopmentRun
```

IntelliJ IDEA에서 작업하는 경우 Gradle 도구 창에서 `jsBrowserDevelopmentRun` 액션을 찾을 수 있습니다.

프로젝트가 빌드된 후 내장된 `webpack-dev-server`가 실행되기 시작하며, 이전에 지정한 HTML 파일을 가리키는 (겉보기에는 빈) 브라우저 창이 열립니다. 프로그램이 올바르게 실행되고 있는지 확인하려면 브라우저의 개발자 도구를 엽니다(예: 마우스 오른쪽 버튼을 클릭하고 _검사(Inspect)_ 액션 선택).
개발자 도구 내부의 콘솔로 이동하면 실행된 JavaScript 코드의 결과를 확인할 수 있습니다.

![브라우저 개발자 도구의 콘솔 출력](browser-console-output.png){width=700}

이 설정을 사용하면 각 코드를 변경한 후 프로젝트를 다시 컴파일하여 변경 사항을 확인할 수 있습니다. Kotlin/JS는 개발 중에 애플리케이션을 자동으로 다시 빌드하는 더 편리한 방법도 지원합니다.
이러한 _연속 모드(continuous mode)_를 설정하는 방법은 [관련 튜토리얼](dev-server-continuous-compilation.md)을 확인하세요.