---
title: "개발 서버 및 지속적 컴파일"
---
수동으로 Kotlin/JS 프로젝트를 컴파일하고 실행하여 변경 사항을 확인하는 대신, _지속적인 컴파일_ 모드를 사용할 수 있습니다. 일반적인 `run` 명령을 사용하는 대신, _지속적인_ 모드로 Gradle 래퍼를 호출합니다.

```bash
./gradlew run --continuous
```

IntelliJ IDEA에서 작업 중인 경우, _실행 구성_을 통해 동일한 플래그를 전달할 수 있습니다. IDE에서 Gradle `run` 작업을 처음 실행하면 IntelliJ IDEA가 자동으로 해당 작업에 대한 실행 구성을 생성하며, 이를 편집할 수 있습니다.

<img src="/img/edit-configurations.png" alt="IntelliJ IDEA에서 실행 구성 편집" width="700" style={{verticalAlign: 'middle'}}/>

**Run/Debug Configurations** 대화 상자를 통해 지속적인 모드를 활성화하는 것은 실행 구성에 대한 인수에 `--continuous` 플래그를 추가하는 것만큼 쉽습니다.

<img src="/img/run-debug-configurations.png" alt="IntelliJ IDEA에서 실행 구성에 지속적인 플래그 추가" width="700" style={{verticalAlign: 'middle'}}/>

이 실행 구성을 실행할 때 Gradle 프로세스가 프로그램 변경 사항을 계속 감시하고 있음을 알 수 있습니다.

<img src="/img/waiting-for-changes.png" alt="변경 사항을 기다리는 Gradle" width="700" style={{verticalAlign: 'middle'}}/>

변경 사항이 감지되면 프로그램이 자동으로 다시 컴파일됩니다. 브라우저에서 페이지를 계속 열어두면 개발 서버가 페이지의 자동 새로 고침을 트리거하고 변경 사항이 표시됩니다. 이는 Kotlin Multiplatform Gradle 플러그인에서 관리하는 통합된 `webpack-dev-server` 덕분입니다.