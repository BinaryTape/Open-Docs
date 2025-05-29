[//]: # (title: 컴파일 시간 개선 팁)

<show-structure depth="1"/>

Kotlin/Native 컴파일러는 성능을 개선하는 업데이트를 지속적으로 받고 있습니다. 최신 Kotlin/Native 컴파일러와 적절히 구성된 빌드 환경을 사용하면 Kotlin/Native 타겟을 사용하는 프로젝트의 컴파일 시간을 상당히 개선할 수 있습니다.

Kotlin/Native 컴파일 프로세스의 속도를 높이는 방법에 대한 팁을 계속 읽어보십시오.

## 일반 권장 사항

### 최신 Kotlin 버전 사용

이렇게 하면 항상 최신 성능 개선 사항을 얻을 수 있습니다. 가장 최신 Kotlin 버전은 %kotlinVersion%입니다.

### 거대한 클래스 생성 피하기

컴파일 및 실행 시 로드하는 데 오랜 시간이 걸리는 거대한 클래스 생성을 피하도록 노력하십시오.

### 빌드 간에 다운로드 및 캐시된 구성 요소 유지

프로젝트를 컴파일할 때 Kotlin/Native는 필요한 구성 요소를 다운로드하고 일부 작업 결과를 `$USER_HOME/.konan` 디렉터리에 캐시합니다. 컴파일러는 이 디렉터리를 이후 컴파일에 사용하여 완료하는 데 시간이 덜 걸리도록 합니다.

컨테이너(예: Docker)에서 빌드하거나 지속적 통합 시스템으로 빌드할 때, 컴파일러는 각 빌드마다 `~/.konan` 디렉터리를 새로 생성해야 할 수 있습니다. 이 단계를 피하려면 빌드 간에 `~/.konan`을 유지하도록 환경을 구성하십시오. 예를 들어, `kotlin.data.dir` Gradle 속성을 사용하여 해당 위치를 재정의하십시오.

또는 `-Xkonan-data-dir` 컴파일러 옵션을 사용하여 `cinterop` 및 `konanc` 도구를 통해 디렉터리의 사용자 지정 경로를 구성할 수 있습니다.

## Gradle 구성

Gradle을 사용한 첫 번째 컴파일은 종속성을 다운로드하고, 캐시를 빌드하고, 추가 단계를 수행해야 하기 때문에 일반적으로 이후 컴파일보다 더 많은 시간이 걸립니다. 실제 컴파일 시간을 정확하게 측정하려면 프로젝트를 최소 두 번 빌드해야 합니다.

아래는 더 나은 컴파일 성능을 위해 Gradle을 구성하기 위한 몇 가지 권장 사항입니다.

### Gradle 힙 크기 늘리기

[Gradle 힙 크기](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)를 늘리려면 `org.gradle.jvmargs=-Xmx3g`를 `gradle.properties` 파일에 추가하십시오.

[병렬 빌드](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)를 사용하는 경우, `org.gradle.workers.max` 속성 또는 `--max-workers` 명령줄 옵션으로 적절한 작업자 수를 선택해야 할 수 있습니다. 기본값은 CPU 프로세서 수입니다.

### 필요한 바이너리만 빌드

정말로 필요한 경우가 아니라면 `build` 또는 `assemble`과 같이 전체 프로젝트를 빌드하는 Gradle 작업을 실행하지 마십시오. 이러한 작업은 동일한 코드를 한 번 이상 빌드하여 컴파일 시간을 늘립니다. IntelliJ IDEA에서 테스트를 실행하거나 Xcode에서 앱을 시작하는 것과 같은 일반적인 경우, Kotlin 도구는 불필요한 작업을 실행하지 않도록 합니다.

일반적이지 않은 경우나 빌드 구성이 있는 경우, 작업을 직접 선택해야 할 수 있습니다.

*   `linkDebug*`. 개발 중에 코드를 실행하려면 일반적으로 하나의 바이너리만 필요하므로, 해당 `linkDebug*` 작업을 실행하는 것으로 충분할 것입니다.
*   `embedAndSignAppleFrameworkForXcode`. iOS 시뮬레이터 및 기기는 서로 다른 프로세서 아키텍처를 가지므로, Kotlin/Native 바이너리를 유니버설(fat) 프레임워크로 배포하는 것이 일반적인 접근 방식입니다.

    그러나 로컬 개발 중에는 사용 중인 플랫폼에 대해서만 `.framework` 파일을 빌드하는 것이 더 빠릅니다. 플랫폼별 프레임워크를 빌드하려면 [embedAndSignAppleFrameworkForXcode](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html#connect-the-framework-to-your-project) 작업을 사용하십시오.

### 필요한 타겟에 대해서만 빌드

위 권장 사항과 마찬가지로, 모든 네이티브 플랫폼에 대해 한 번에 바이너리를 빌드하지 마십시오. 예를 들어, [XCFramework](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks)를 컴파일하는 것(`*XCFramework` 작업 사용)은 모든 타겟에 대해 동일한 코드를 빌드하여, 단일 타겟을 빌드하는 것보다 비례적으로 더 많은 시간이 소요됩니다.

설정에 XCFramework가 필요한 경우, 타겟 수를 줄일 수 있습니다. 예를 들어, Intel 기반 Mac의 iOS 시뮬레이터에서 이 프로젝트를 실행하지 않는 경우 `iosX64`는 필요하지 않습니다.

> 서로 다른 타겟용 바이너리는 `linkDebug*$Target` 및 `linkRelease*$Target` Gradle 작업으로 빌드됩니다. `--scan` 옵션으로 Gradle 빌드를 실행하여 빌드 로그 또는 [Gradle 빌드 스캔](https://docs.gradle.org/current/userguide/build_scans.html)에서 실행된 작업을 확인할 수 있습니다.
> {style="tip"}

### 불필요한 릴리스 바이너리 빌드하지 않기

Kotlin/Native는 두 가지 빌드 모드, 즉 [디버그 및 릴리스](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)를 지원합니다. 릴리스는 높게 최적화되어 있어 많은 시간이 소요됩니다. 릴리스 바이너리 컴파일은 디버그 바이너리보다 훨씬 더 많은 시간이 걸립니다.

실제 릴리스를 제외하고는, 이러한 모든 최적화는 일반적인 개발 주기에서는 불필요할 수 있습니다. 개발 프로세스 중에 이름에 `Release`가 포함된 작업을 사용하는 경우, `Debug`로 교체하는 것을 고려하십시오. 마찬가지로, `assembleXCFramework`를 실행하는 대신, 예를 들어 `assembleSharedDebugXCFramework`를 실행할 수 있습니다.

> 릴리스 바이너리는 `linkRelease*` Gradle 작업으로 빌드됩니다. `--scan` 옵션으로 Gradle 빌드를 실행하여 빌드 로그 또는 [Gradle 빌드 스캔](https://docs.gradle.org/current/userguide/build_scans.html)에서 확인할 수 있습니다.
> {style="tip"}

### Gradle 데몬 비활성화하지 않기

특별한 이유 없이 [Gradle 데몬](https://docs.gradle.org/current/userguide/gradle_daemon.html)을 비활성화하지 마십시오. 기본적으로 [Kotlin/Native는 Gradle 데몬에서 실행됩니다](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native). 데몬이 활성화되어 있으면 동일한 JVM 프로세스가 사용되며, 각 컴파일마다 워밍업할 필요가 없습니다.

### 전이적 내보내기 사용하지 않기

[`transitiveExport = true`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)를 사용하면 많은 경우에 데드 코드 제거가 비활성화되어 컴파일러가 많은 사용되지 않는 코드를 처리해야 합니다. 이는 컴파일 시간을 늘립니다. 대신 `export` 메서드를 명시적으로 사용하여 필요한 프로젝트와 종속성을 내보내십시오.

### 모듈을 너무 많이 내보내지 않기

불필요한 [모듈 내보내기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)를 피하도록 노력하십시오. 내보내지는 각 모듈은 컴파일 시간과 바이너리 크기에 부정적인 영향을 미칩니다.

### Gradle 빌드 캐싱 사용

Gradle [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html) 기능을 활성화하십시오.

*   **로컬 빌드 캐시**. 로컬 캐싱의 경우, `gradle.properties` 파일에 `org.gradle.caching=true`를 추가하거나 명령줄에서 `--build-cache` 옵션으로 빌드를 실행하십시오.
*   **원격 빌드 캐시**. 지속적 통합 환경을 위해 [원격 빌드 캐시를 구성하는 방법](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)을 알아보십시오.

### Gradle 구성 캐시 사용

Gradle [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)를 사용하려면 `gradle.properties` 파일에 `org.gradle.configuration-cache=true`를 추가하십시오.

> 구성 캐시는 `link*` 작업을 병렬로 실행하는 것을 가능하게 하는데, 이는 특히 많은 CPU 코어를 가진 시스템에서 시스템에 과도한 부하를 줄 수 있습니다. 이 문제는 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915)에서 해결될 예정입니다.
> {style="note"}

### 이전에 비활성화된 기능 활성화

Gradle 데몬과 컴파일러 캐시를 비활성화하는 Kotlin/Native 속성들이 있습니다.

*   `kotlin.native.disableCompilerDaemon=true`
*   `kotlin.native.cacheKind=none`
*   `kotlin.native.cacheKind.$target=none`, 여기서 `$target`은 Kotlin/Native 컴파일 타겟(예: `iosSimulatorArm64`)입니다.

이전에 이러한 기능에 문제가 있어 이 줄들을 `gradle.properties` 파일이나 Gradle 인수에 추가했다면, 제거하고 빌드가 성공적으로 완료되는지 확인하십시오. 이 속성들이 이미 해결된 문제를 우회하기 위해 이전에 추가되었을 수 있습니다.

### klib 아티팩트의 증분 컴파일 시도

증분 컴파일을 사용하면 프로젝트 모듈에 의해 생성된 `klib` 아티팩트의 일부만 변경되면, `klib`의 일부만 바이너리로 다시 컴파일됩니다.

이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 이 기능을 활성화하려면 `kotlin.incremental.native=true` 옵션을 `gradle.properties` 파일에 추가하십시오. 문제가 발생하면 [YouTrack](https://kotl.in/issue)에 이슈를 생성하십시오.

## Windows 구성

Windows 보안이 Kotlin/Native 컴파일러의 속도를 저하시킬 수 있습니다. 기본적으로 `%\USERPROFILE%`에 있는 `.konan` 디렉터리를 Windows 보안 제외에 추가하여 이를 피할 수 있습니다. [Windows 보안에서 제외를 추가하는 방법](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)을 알아보십시오.