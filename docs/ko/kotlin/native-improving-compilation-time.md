[//]: # (title: 컴파일 시간 개선 팁)

<show-structure depth="1"/>

Kotlin/Native 컴파일러는 성능을 개선하는 업데이트를 지속적으로 받고 있습니다. 최신 Kotlin/Native 컴파일러와 적절하게 구성된 빌드 환경을 사용하면 Kotlin/Native 타겟을 사용하는 프로젝트의 컴파일 시간을 크게 향상시킬 수 있습니다.

Kotlin/Native 컴파일 프로세스 속도를 높이는 방법에 대한 저희의 팁을 계속 읽어보세요.

## 일반적인 권장 사항

### 최신 버전의 Kotlin 사용

이렇게 하면 항상 최신 성능 개선 사항을 얻을 수 있습니다. 가장 최신 Kotlin 버전은 %kotlinVersion%입니다.

### 거대한 클래스 생성 피하기

컴파일 및 실행 시 로드하는 데 오랜 시간이 걸리는 거대한 클래스 생성을 피하려고 노력하세요.

### 빌드 간에 다운로드 및 캐시된 컴포넌트 유지

프로젝트를 컴파일할 때 Kotlin/Native는 필요한 컴포넌트를 다운로드하고 작업 결과 중 일부를 `$USER_HOME/.konan` 디렉터리에 캐시합니다. 컴파일러는 이 디렉터리를 후속 컴파일에 사용하여 완료하는 데 걸리는 시간을 줄여줍니다.

컨테이너(예: Docker) 또는 지속적 통합 시스템에서 빌드할 때, 컴파일러는 각 빌드마다 `~/.konan` 디렉터리를 처음부터 생성해야 할 수도 있습니다. 이 단계를 피하려면 빌드 간에 `~/.konan`을 유지하도록 환경을 구성하세요. 예를 들어, `konan.data.dir` Gradle 속성을 사용하여 해당 위치를 재정의하세요.

또는 `-Xkonan-data-dir` 컴파일러 옵션을 사용하여 `cinterop` 및 `konanc` 도구를 통해 디렉터리에 대한 사용자 지정 경로를 구성할 수 있습니다.

## Gradle 설정

Gradle을 사용한 첫 컴파일은 종속성 다운로드, 캐시 빌드 및 추가 단계 수행의 필요성 때문에 일반적으로 후속 컴파일보다 시간이 더 오래 걸립니다. 실제 컴파일 시간을 정확하게 파악하려면 프로젝트를 최소 두 번 빌드해야 합니다.

아래에는 더 나은 컴파일 성능을 위해 Gradle을 구성하는 몇 가지 권장 사항이 있습니다.

### Gradle 힙 크기 늘리기

[Gradle 힙 크기](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)를 늘리려면 `gradle.properties` 파일에 `org.gradle.jvmargs=-Xmx3g`를 추가하세요.

[병렬 빌드](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)를 사용하는 경우, `org.gradle.workers.max` 속성 또는 `--max-workers` 명령줄 옵션을 사용하여 올바른 작업자 수를 선택해야 할 수 있습니다. 기본값은 CPU 프로세서 수입니다.

### 필요한 바이너리만 빌드

정말로 필요한 경우가 아니라면 `build` 또는 `assemble`과 같이 전체 프로젝트를 빌드하는 Gradle 작업을 실행하지 마세요. 이러한 작업은 동일한 코드를 여러 번 빌드하여 컴파일 시간을 증가시킵니다. IntelliJ IDEA에서 테스트를 실행하거나 Xcode에서 앱을 시작하는 것과 같은 일반적인 경우에 Kotlin 툴링은 불필요한 작업 실행을 피합니다.

일반적이지 않은 경우 또는 빌드 구성이 있다면 작업을 직접 선택해야 할 수도 있습니다:

*   `linkDebug*`. 개발 중에 코드를 실행하려면 일반적으로 하나의 바이너리만 필요하므로 해당 `linkDebug*` 작업을 실행하는 것으로 충분합니다.
*   `embedAndSignAppleFrameworkForXcode`. iOS 시뮬레이터와 장치는 프로세서 아키텍처가 다르기 때문에 Kotlin/Native 바이너리를 유니버설(fat) 프레임워크로 배포하는 것이 일반적인 접근 방식입니다.

    하지만 로컬 개발 중에는 사용 중인 플랫폼에 대해서만 `.framework` 파일을 빌드하는 것이 더 빠릅니다. 플랫폼별 프레임워크를 빌드하려면 [embedAndSignAppleFrameworkForXcode](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html#connect-the-framework-to-your-project) 작업을 사용하세요.

### 필요한 타겟에 대해서만 빌드

위의 권장 사항과 마찬가지로 모든 네이티브 플랫폼에 대한 바이너리를 한 번에 빌드하지 마세요. 예를 들어, [XCFramework](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#build-xcframeworks)를 컴파일하는 것(`*XCFramework` 작업을 사용)은 모든 타겟에 대해 동일한 코드를 빌드하므로 단일 타겟을 빌드하는 것보다 비례적으로 더 많은 시간이 걸립니다.

설정에서 XCFramework가 정말 필요한 경우 타겟 수를 줄일 수 있습니다. 예를 들어, Intel 기반 Mac에서 iOS 시뮬레이터로 이 프로젝트를 실행하지 않는다면 `iosX64`가 필요하지 않습니다.

> 다른 타겟용 바이너리는 `linkDebug*$Target` 및 `linkRelease*$Target` Gradle 작업을 사용하여 빌드됩니다. 실행된 작업은 빌드 로그 또는 `--scan` 옵션으로 Gradle 빌드를 실행하여 [Gradle 빌드 스캔](https://docs.gradle.org/current/userguide/build_scans.html)에서 확인할 수 있습니다.
>
{style="tip"}

### 불필요한 릴리스 바이너리 빌드하지 않기

Kotlin/Native는 [디버그 및 릴리스](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#declare-binaries)의 두 가지 빌드 모드를 지원합니다. 릴리스는 고도로 최적화되어 있으며, 이는 많은 시간이 소요됩니다. 릴리스 바이너리 컴파일은 디버그 바이너리보다 몇 배 더 많은 시간이 걸립니다.

실제 릴리스를 제외하고 일반적인 개발 주기에서는 이러한 모든 최적화가 불필요할 수 있습니다. 개발 프로세스 중에 이름에 `Release`가 포함된 작업을 사용하는 경우 `Debug`로 대체하는 것을 고려해 보세요. 마찬가지로, `assembleXCFramework`를 실행하는 대신 예를 들어 `assembleSharedDebugXCFramework`를 실행할 수 있습니다.

> 릴리스 바이너리는 `linkRelease*` Gradle 작업을 사용하여 빌드됩니다. 빌드 로그 또는 `--scan` 옵션으로 Gradle 빌드를 실행하여 [Gradle 빌드 스캔](https://docs.gradle.org/current/userguide/build_scans.html)에서 확인할 수 있습니다.
>
{style="tip"}

### Gradle 데몬 비활성화하지 않기

합당한 이유 없이 [Gradle 데몬](https://docs.gradle.org/current/userguide/gradle_daemon.html)을 비활성화하지 마세요. 기본적으로 [Kotlin/Native는 Gradle 데몬에서 실행됩니다](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native). 활성화되면 동일한 JVM 프로세스가 사용되며, 각 컴파일마다 워밍업할 필요가 없습니다.

### 전이적 내보내기 사용하지 않기

[`transitiveExport = true`](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)를 사용하면 많은 경우에 데드 코드 제거를 비활성화하므로 컴파일러가 사용되지 않는 많은 코드를 처리해야 합니다. 이는 컴파일 시간을 증가시킵니다. 대신, 필요한 프로젝트와 종속성을 내보내기 위해 `export` 메서드를 명시적으로 사용하세요.

### 모듈을 너무 많이 내보내지 않기

불필요한 [모듈 내보내기](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)를 피하려고 노력하세요. 내보내진 각 모듈은 컴파일 시간과 바이너리 크기에 부정적인 영향을 미칩니다.

### Gradle 빌드 캐싱 사용

Gradle [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html) 기능을 활성화하세요:

*   **로컬 빌드 캐시**. 로컬 캐싱을 위해 `gradle.properties` 파일에 `org.gradle.caching=true`를 추가하거나 명령줄에서 `--build-cache` 옵션으로 빌드를 실행하세요.
*   **원격 빌드 캐시**. 지속적 통합 환경을 위해 [원격 빌드 캐시를 구성하는 방법](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)을 알아보세요.

### Gradle 구성 캐시 사용

Gradle [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)를 사용하려면 `gradle.properties` 파일에 `org.gradle.configuration-cache=true`를 추가하세요.

> 구성 캐시는 또한 `link*` 작업을 병렬로 실행할 수 있게 하는데, 이는 특히 많은 CPU 코어를 가진 머신에 큰 부하를 줄 수 있습니다. 이 문제는 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915)에서 수정될 예정입니다.
>
{style="note"}

### 이전에 비활성화된 기능 활성화

Gradle 데몬 및 컴파일러 캐시를 비활성화하는 Kotlin/Native 속성이 있습니다:

*   `kotlin.native.disableCompilerDaemon=true`
*   `kotlin.native.cacheKind=none`
*   `kotlin.native.cacheKind.$target=none`, 여기서 `$target`은 Kotlin/Native 컴파일 타겟이며, 예를 들어 `iosSimulatorArm64`와 같습니다.

이전에 이 기능들 때문에 문제가 있었고 `gradle.properties` 파일 또는 Gradle 인수에 이 줄들을 추가했다면, 제거하고 빌드가 성공적으로 완료되는지 확인하세요. 이 속성들은 이미 해결된 문제를 해결하기 위해 이전에 추가되었을 수 있습니다.

### klib 아티팩트의 증분 컴파일 시도

증분 컴파일을 사용하면 프로젝트 모듈에서 생성된 `klib` 아티팩트의 일부만 변경되는 경우 `klib`의 일부만 바이너리로 다시 컴파일됩니다.

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 이를 활성화하려면 `gradle.properties` 파일에 `kotlin.incremental.native=true` 옵션을 추가하세요. 문제가 발생하면 [YouTrack](https://kotl.in/issue)에 이슈를 생성하세요.

## Windows 구성

Windows 보안은 Kotlin/Native 컴파일러의 속도를 늦출 수 있습니다. 기본적으로 `%\USERPROFILE%`에 위치하는 `.konan` 디렉터리를 Windows 보안 제외 항목에 추가하여 이를 피할 수 있습니다. [Windows 보안에 제외 항목을 추가하는 방법](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)을 알아보세요.

## LLVM 구성
<primary-label ref="advanced"/>

위의 팁이 컴파일 시간 개선에 도움이 되지 않았다면 [LLVM 백엔드 사용자 지정](native-llvm-passes.md)을 고려해 보세요.