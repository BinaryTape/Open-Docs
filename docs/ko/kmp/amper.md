[//]: # (title: Amper를 사용한 프로젝트 구성)

[Amper](https://github.com/JetBrains/amper/tree/HEAD)는 JetBrains에서 만든 새로운 도구로, 빌드, 패키징, 퍼블리싱 등을 위한 프로젝트를 구성하는 데 도움을 줍니다. Amper를 사용하면 빌드 시스템에 시간을 덜 쓰고 실제 비즈니스 문제를 해결하는 데 집중할 수 있습니다.

Amper를 사용하면 JVM, Android, iOS, macOS, Linux에서 작동하는 Kotlin Multiplatform 애플리케이션은 물론, 이러한 모든 지원 대상에서 작동하는 멀티플랫폼 라이브러리에 대한 구성 파일을 생성할 수 있습니다.

> Amper는 현재 [실험 단계](supported-platforms.md#general-kotlin-stability-levels)입니다.
> Kotlin Multiplatform 프로젝트에서 사용해 보시길 권합니다.
> [YouTrack](https://youtrack.jetbrains.com/issues/AMPER)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

## Amper 작동 방식

Amper는 현재 백엔드로 Gradle을, 프런트엔드로 YAML을 사용하여 프로젝트 구성을 정의합니다. 커스텀 태스크, CocoaPods, Maven 라이브러리 퍼블리싱, Gradle 상호 운용성을 통한 데스크톱 앱 패키징을 지원합니다.

Amper를 사용하면 플랫폼별 애플리케이션 및 공유 Kotlin 라이브러리에 대한 구성을 설정할 수 있습니다. 이들은 특별한 선언적 DSL을 사용하여 `.yaml` 모듈 매니페스트 파일에 모듈로 선언됩니다.

이 DSL의 핵심 개념은 Kotlin Multiplatform입니다. Amper를 사용하면 복잡한 Gradle 개념에 깊이 파고들지 않고도 Kotlin Multiplatform 프로젝트를 빠르고 쉽게 구성할 수 있습니다. Amper DSL은 의존성, 설정 등 멀티플랫폼 구성을 작업할 수 있도록 특별한 구문을 제공합니다.

다음은 JVM, Android, iOS 애플리케이션과 함께 사용할 수 있는 Kotlin Multiplatform 공유 라이브러리용 Amper 매니페스트 파일의 예시입니다.

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

# iOS-only dependencies with a dependency on a CocoaPod
# Note that CocoaPods dependencies are not yet implemented in the prototype
dependencies@ios:
  - pod: 'FirebaseCore'
    version: '~> 6.6'

settings:
  # Enable Kotlin serialization
  kotlin:
    serialization: json

  # Enable Compose Multiplatform framework
  compose: enabled
```

* `product` 섹션은 프로젝트 유형과 대상 플랫폼 목록을 정의합니다.
* `dependencies` 섹션은 Kotlin 및 Maven 의존성뿐만 아니라 CocoaPods 및 Swift Package Manager와 같은 플랫폼별 패키지 관리자도 추가합니다.
* `@platform` 한정자는 의존성 및 설정을 포함한 플랫폼별 섹션을 표시합니다.

## Amper 사용해 보기

다음 방법 중 하나로 Amper를 사용해 볼 수 있습니다.

* [IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/) 2023.3 이상 버전(빌드 233.11555부터)을 JVM 및 Android 프로젝트에 사용하세요.
* 명령줄 또는 CI/CD 도구에서 Amper 프로젝트를 빌드하려면 [Gradle](https://docs.gradle.org/current/userguide/userguide.html)을 사용하세요.

[이 튜토리얼](https://github.com/JetBrains/amper/tree/HEAD/docs/Tutorial.md)을 따라 Amper로 첫 Kotlin Multiplatform 프로젝트를 생성하세요. Amper의 기능과 설계에 대해 자세히 알아보려면 [문서](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)를 살펴보세요.

가지고 있는 피드백을 [이슈 트래커](https://youtrack.jetbrains.com/issues/AMPER)에 자유롭게 제출해 주세요. 여러분의 의견은 Amper의 미래를 형성하는 데 도움이 될 것입니다.

## 다음 단계

* [JetBrains 블로그](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience)를 확인하여 Amper를 만든 동기, 사용 사례, 현재 프로젝트 상태 및 미래에 대해 자세히 알아보세요.
* 가장 자주 묻는 질문에 대한 답변을 찾아보려면 [Amper FAQ](https://github.com/JetBrains/amper/tree/HEAD/docs/FAQ.md)를 참조하세요.
* Amper 기능 및 설계의 다양한 측면을 다루는 [Amper 문서](https://github.com/JetBrains/amper/tree/HEAD/docs/Documentation.md)를 읽어보세요.