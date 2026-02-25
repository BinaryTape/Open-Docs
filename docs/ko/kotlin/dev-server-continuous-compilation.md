[//]: # (title: 개발 서버 및 지속적 컴파일)

변경 사항을 확인하고 싶을 때마다 매번 Kotlin/JS 프로젝트를 수동으로 컴파일하고 실행하는 대신, _지속적 컴파일(continuous compilation)_ 모드를 사용할 수 있습니다. 일반적인 `jsBrowserDevelopmentRun`(`browser`용) 및 `jsNodeDevelopmentRun`(`nodejs`용) 명령어를 사용하는 대신, 다음과 같이 Gradle 래퍼를 지속적(continuous) 모드로 호출하세요:

```bash
 # `browser` 프로젝트용
./gradlew jsBrowserDevelopmentRun --continuous

 # `nodejs` 프로젝트용
./gradlew jsNodeDevelopmentRun --continuous
```

IntelliJ IDEA에서 작업 중이라면, 실행 구성(run configurations) 목록을 통해 동일한 플래그를 전달할 수 있습니다. IDE에서 `jsBrowserDevelopmentRun` Gradle 태스크를 처음 실행하면, IntelliJ IDEA는 이에 대한 실행 구성을 자동으로 생성하며, 상단 툴바에서 이를 편집할 수 있습니다:

![IntelliJ IDEA에서 실행 구성 편집하기](edit-configurations.png){width=700}

실행 구성의 인자(arguments)에 `--continuous` 플래그를 추가하여 **Run/Debug Configurations** 대화 상자에서 지속적 모드를 활성화하세요:

![IntelliJ IDEA의 실행 구성에 continuous 플래그 추가하기](run-debug-configurations.png){width=700}

이 실행 구성을 실행하면, Gradle 프로세스가 프로그램의 변경 사항을 계속 감시하는 것을 확인할 수 있습니다:

![변경 사항을 대기 중인 Gradle](waiting-for-changes.png){width=700}

변경 사항이 감지되면 프로그램이 자동으로 다시 컴파일됩니다. 브라우저에 웹 페이지가 여전히 열려 있다면, 개발 서버가 페이지의 자동 새로고침을 트리거하여 변경 사항이 즉시 반영됩니다. 이는 [Kotlin Multiplatform Gradle 플러그인](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)이 관리하는 통합 [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/) 덕분입니다.