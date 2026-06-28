[//]: # (title: Kotlin Toolchain을 사용한 프로젝트 구성)

[Kotlin Toolchain](https://kotlin-toolchain.org/)은 JetBrains에서 빌드, 패키징, 배포 등을 위한 프로젝트 구성을 돕기 위해 만든 도구입니다. Kotlin Toolchain을 사용하면 빌드 시스템을 다루는 시간을 줄이고 대신 실제 비즈니스 문제를 해결하는 데 집중할 수 있습니다.

Kotlin Toolchain을 사용하면 JVM, Android, iOS, macOS, Windows, Linux에서 동작하는 Kotlin 멀티플랫폼(Kotlin Multiplatform) 애플리케이션뿐만 아니라, 지원되는 모든 타겟에서 동작하는 멀티플랫폼 라이브러리를 위한 구성 파일을 만들 수 있습니다.

> Kotlin Toolchain은 [Alpha](supported-platforms.md#general-kotlin-stability-levels) 단계에 있습니다.
> 여러분의 Kotlin 멀티플랫폼 프로젝트에서 자유롭게 사용해 보세요.
> [YouTrack](https://youtrack.jetbrains.com/issues/AMPER)에 피드백을 남겨 주시면 감사하겠습니다.
>
{style="warning"}

## Kotlin Toolchain의 작동 원리

Kotlin Toolchain은 독립형 CLI 애플리케이션이며, YAML 파일을 사용하여 프로젝트를 구성할 수 있습니다.

Kotlin Toolchain을 사용하면 플랫폼별 애플리케이션과 공유 Kotlin 라이브러리를 설정할 수 있습니다. 이는 특별한 선언적 DSL을 사용하여 `module.yaml` 매니페스트 파일에 모듈로 선언됩니다.

이 DSL의 핵심 개념은 Kotlin 멀티플랫폼입니다. Kotlin Toolchain을 사용하면 복잡한 개념을 깊이 파고들 필요 없이 Kotlin 멀티플랫폼 프로젝트를 쉽고 빠르게 구성할 수 있습니다. Kotlin Toolchain DSL은 의존성, 설정 등을 포함한 멀티플랫폼 구성을 처리할 수 있는 특별한 구문을 제공합니다.

다음은 JVM, Android, iOS 애플리케이션에서 사용할 수 있는 Kotlin 멀티플랫폼 공유 라이브러리를 위한 Kotlin 모듈 파일 예시입니다:

```yaml
product:
  type: kmp/lib
  platforms: [ jvm, android, iosArm64, iosSimulatorArm64 ]

# Shared Compose Multiplatform dependencies:
dependencies:
  - $compose.foundation: exported
  - $compose.material3: exported

# Android-only dependencies  
dependencies@android:
  # Integrate compose with activities
  - androidx.activity:activity-compose:1.7.2: exported
  - androidx.appcompat:appcompat:1.6.1: exported

settings:
  # Enable Kotlin serialization
  kotlin:
    serialization: json

  # Enable Compose Multiplatform framework
  compose:
    enabled: true
```

* `product` 섹션은 프로젝트 유형과 대상 플랫폼 목록을 정의합니다.
* `dependencies` 섹션은 Maven 의존성을 추가하며, 향후 CocoaPods나 Swift Package Manager와 같은 플랫폼별 패키지 관리자를 지원할 예정입니다.
* `$compose` 네임스페이스는 모든 선택적 Compose 모듈에 대한 접근을 제공하는 내장 라이브러리 카탈로그입니다.
* `@platform` 한정자는 의존성 및 설정을 포함한 플랫폼별 섹션을 표시합니다.

## Kotlin Toolchain 사용해 보기

직접 사용해 보려면 Kotlin Toolchain의 [시작 가이드(Getting Started guide)](https://kotlin-toolchain.org/dev/getting-started/)를 확인해 보세요.

의견이 있으시면 언제든지 [이슈 트래커(issue tracker)](https://jb.gg/amper-issues)에 제출해 주세요. 여러분의 의견은 Kotlin Toolchain의 미래를 만드는 데 도움이 됩니다.

## 다음 단계

<!---
* [JetBrains 블로그](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)를 확인하여
  Kotlin Toolchain을 만든 동기, 사용 사례, 프로젝트의 현재 상태 및 미래에 대해
  자세히 알아보세요.
-->
* [Kotlin Toolchain 웹사이트](https://kotlin-toolchain.org)에서 가이드와 전체 문서를 확인해 보세요.