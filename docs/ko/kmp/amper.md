[//]: # (title: Amper를 이용한 프로젝트 구성)

[Amper](https://amper.org)는 JetBrains에서 만든 새로운 도구로, 빌드, 패키징, 퍼블리싱 등을 위한 프로젝트를 구성하는 데 도움을 줍니다. Amper를 사용하면 빌드 시스템에 시간을 덜 쓰고 대신 실제 비즈니스 문제를 해결하는 데 집중할 수 있습니다.

Amper를 사용하면 JVM, Android, iOS, macOS, Windows, Linux에서 작동하는 Kotlin 멀티플랫폼 애플리케이션은 물론, 이러한 모든 지원 대상과 함께 작동하는 멀티플랫폼 라이브러리를 위한 구성 파일을 생성할 수 있습니다.

> Amper는 현재 [실험 단계](supported-platforms.md#general-kotlin-stability-levels)입니다.
> Kotlin 멀티플랫폼 프로젝트에서 사용해 보시는 것을 환영합니다.
> [YouTrack](https://youtrack.jetbrains.com/issues/AMPER)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

## Amper 작동 방식

Amper는 독립형 CLI 애플리케이션이며, YAML 파일을 사용하여 프로젝트를 구성할 수 있습니다.

Amper를 사용하면 플랫폼별 애플리케이션과 공유 Kotlin 라이브러리를 설정할 수 있습니다.
이들은 특별한 선언형 DSL을 사용하여 `module.yaml` 매니페스트 파일에 모듈로 선언됩니다.

이 DSL의 핵심 개념은 Kotlin 멀티플랫폼입니다. Amper를 사용하면 복잡한 개념에 깊이 파고들 필요 없이 Kotlin 멀티플랫폼 프로젝트를 빠르고 쉽게 구성할 수 있습니다. Amper DSL은 종속성, 설정 등을 포함한 멀티플랫폼 구성으로 작업할 수 있는 특별한 구문을 제공합니다.

다음은 JVM, Android, iOS 애플리케이션과 함께 사용할 수 있는 Kotlin 멀티플랫폼 공유 라이브러리를 위한 Amper 모듈 파일의 예시입니다:

```yaml
product:
  type: lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64, iosX64 ]

# Shared Compose Multiplatform dependencies:
dependencies:
  - org.jetbrains.compose.foundation:foundation:1.5.0-rc01: exported
  - org.jetbrains.compose.material3:material3:1.5.0-rc01: exported

# Android-only dependencies  
dependencies@android:
  # Integration compose with activities
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

settings:
  # Enable Kotlin serialization
  kotlin:
    serialization: json

  # Enable Compose Multiplatform framework
  compose: enabled
```

*   `product` 섹션은 프로젝트 유형과 대상 플랫폼 목록을 정의합니다.
*   `dependencies` 섹션은 Maven 종속성을 추가하며, 향후 CocoaPods 및 Swift Package Manager와 같은 플랫폼별 패키지 관리자를 지원할 수 있습니다.
*   `@platform` 한정자는 종속성 및 설정을 포함한 플랫폼별 섹션을 표시합니다.

## Amper 사용해 보기

Amper의 [시작하기 가이드](https://jb.gg/amper/get-started)를 확인하여 직접 사용해 보세요.

저희 [이슈 트래커](https://jb.gg/amper-issues)에 자유롭게 피드백을 제출해 주세요. 여러분의 의견은 Amper의 미래를 만드는 데 도움이 될 것입니다.

## 다음 단계

*   Amper를 만들게 된 동기, 사용 사례, 프로젝트의 현재 상태 및 미래에 대해 자세히 알아보려면 [JetBrains 블로그](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)를 확인하세요.
*   가이드와 포괄적인 문서를 읽으려면 [Amper 웹사이트](https://amper.org)를 확인하세요.