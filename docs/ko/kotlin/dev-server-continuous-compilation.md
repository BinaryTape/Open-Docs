[//]: # (title: 개발 서버와 지속적인 컴파일)

변경 사항을 확인할 때마다 Kotlin/JS 프로젝트를 수동으로 컴파일하고 실행하는 대신, _지속적인 컴파일_ 모드를 사용할 수 있습니다. 일반 `jsBrowserDevelopmentRun` (for `browser`) 및 `jsNodeDevelopmentRun` (for `nodejs`) 명령을 사용하는 대신, Gradle 래퍼를 _지속적인_ 모드로 호출하세요:

```bash
 # For `browser` project
./gradlew jsBrowserDevelopmentRun --continuous

 # For `nodejs` project
./gradlew jsNodeDevelopmentRun --continuous
```

IntelliJ IDEA에서 작업하는 경우, 실행 구성 목록을 통해 동일한 플래그를 전달할 수 있습니다. IDE에서 `jsBrowserDevelopmentRun` Gradle 작업을 처음 실행하면, IntelliJ IDEA가 자동으로 해당 실행 구성을 생성하며, 이를 상단 툴바에서 편집할 수 있습니다:

![IntelliJ IDEA에서 실행 구성 편집](edit-configurations.png){width=700}

지속적인 모드는 **실행/디버그 구성(Run/Debug Configurations)** 대화상자에서 실행 구성의 인수에 `--continuous` 플래그를 추가하여 활성화할 수 있습니다:

![IntelliJ IDEA에서 실행 구성에 지속적인 플래그 추가](run-debug-configurations.png){width=700}

이 실행 구성을 실행하면, Gradle 프로세스가 프로그램 변경 사항을 계속 주시하고 있음을 알 수 있습니다:

![변경 사항을 기다리는 Gradle](waiting-for-changes.png){width=700}

변경 사항이 감지되면 프로그램은 자동으로 다시 컴파일됩니다. 브라우저에 웹 페이지가 계속 열려 있다면, 개발 서버가 페이지의 자동 새로고침을 트리거하여 변경 사항이 표시됩니다. 이는 [Kotlin Multiplatform Gradle 플러그인](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)에 의해 관리되는 통합 [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/) 덕분입니다.