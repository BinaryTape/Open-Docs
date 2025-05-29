[//]: # (title: 개발 서버 및 지속적 컴파일)

Kotlin/JS 프로젝트에서 변경 사항을 확인할 때마다 수동으로 컴파일하고 실행하는 대신, _지속적 컴파일_ 모드를 사용할 수 있습니다. 일반적인 `run` 명령 대신, Gradle 래퍼를 _지속_ 모드로 호출하세요:

```bash
./gradlew run --continuous
```

IntelliJ IDEA에서 작업하는 경우, _실행 구성_을 통해 동일한 플래그를 전달할 수 있습니다. IDE에서 Gradle `run` 작업을 처음 실행하면, IntelliJ IDEA가 자동으로 해당 실행 구성을 생성하며, 이를 편집할 수 있습니다:

![IntelliJ IDEA에서 실행 구성 편집](edit-configurations.png){width=700}

**실행/디버그 구성** 대화 상자를 통해 지속 모드를 활성화하는 것은 실행 구성의 인수에 `--continuous` 플래그를 추가하는 것만큼 쉽습니다:

![IntelliJ IDEA에서 실행 구성에 지속 플래그 추가](run-debug-configurations.png){width=700}

이 실행 구성을 실행하면, Gradle 프로세스가 프로그램 변경 사항을 계속 주시하는 것을 확인할 수 있습니다:

![Gradle이 변경 사항을 기다리는 중](waiting-for-changes.png){width=700}

변경 사항이 감지되면, 프로그램은 자동으로 다시 컴파일됩니다. 브라우저에 페이지가 계속 열려 있다면, 개발 서버가 페이지 자동 새로 고침을 트리거하여 변경 사항이 반영됩니다. 이는 Kotlin Multiplatform Gradle 플러그인에 의해 관리되는 통합 `webpack-dev-server` 덕분입니다.