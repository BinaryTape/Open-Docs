---
title: "컴파일 시간 향상 팁"
---
<show-structure depth="1"/>

Kotlin/Native 컴파일러는 성능을 개선하는 업데이트를 지속적으로 받고 있습니다. 최신 Kotlin/Native
컴파일러와 적절하게 구성된 빌드 환경을 사용하면 Kotlin/Native 타겟으로 프로젝트의 컴파일 시간을 크게 단축할 수 있습니다.

Kotlin/Native 컴파일 프로세스 속도를 높이는 방법에 대한 팁을 읽어보세요.

## 일반 권장 사항

### 최신 버전의 Kotlin 사용

이렇게 하면 항상 최신 성능 개선 사항을 얻을 수 있습니다. 최신 Kotlin 버전은 2.1.20입니다.

### 거대한 클래스 생성 방지

컴파일하는 데 시간이 오래 걸리고 실행 중에 로드되는 거대한 클래스를 만들지 않도록 노력하세요.

### 빌드 간에 다운로드 및 캐시된 구성 요소 유지

프로젝트를 컴파일할 때 Kotlin/Native는 필요한 구성 요소를 다운로드하고
작업 결과를 `$USER_HOME/.konan` 디렉토리에 캐시합니다. 컴파일러는 후속
컴파일에 이 디렉토리를 사용하여 완료하는 데 걸리는 시간을 줄입니다.

컨테이너(예: Docker) 또는 지속적 통합 시스템에서 빌드할 때 컴파일러는
각 빌드에 대해 처음부터 `~/.konan` 디렉토리를 만들어야 할 수 있습니다. 이 단계를 피하려면 빌드 간에 `~/.konan`을 유지하도록 환경을 구성하세요.
예를 들어 `kotlin.data.dir` Gradle 속성을 사용하여 해당 위치를 재정의합니다.

또는 `-Xkonan-data-dir` 컴파일러 옵션을 사용하여 `cinterop` 및 `konanc` 도구를 통해 디렉토리에 대한 사용자 지정 경로를 구성할 수 있습니다.

## Gradle 구성

Gradle을 사용한 첫 번째 컴파일은 종속성을 다운로드하고
캐시를 빌드하고 추가 단계를 수행해야 하므로 일반적으로 후속 컴파일보다 시간이 더 오래 걸립니다. 실제 컴파일 시간을 정확하게 읽으려면 프로젝트를 최소 두 번 이상 빌드해야 합니다.

다음은 더 나은 컴파일 성능을 위해 Gradle을 구성하는 방법에 대한 몇 가지 권장 사항입니다.

### Gradle 힙 크기 늘리기

[Gradle 힙 크기](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)를 늘리려면
`gradle.properties` 파일에 `org.gradle.jvmargs=-Xmx3g`를 추가합니다.

[병렬 빌드](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)를 사용하는 경우
`org.gradle.workers.max` 속성 또는 `--max-workers` 명령줄 옵션을 사용하여 적절한 작업자 수를 선택해야 할 수 있습니다.
기본값은 CPU 프로세서 수입니다.

### 필요한 바이너리만 빌드

정말로 필요한 경우가 아니면 `build` 또는 `assemble`과 같이 전체 프로젝트를 빌드하는 Gradle 작업을 실행하지 마세요.
이러한 작업은 동일한 코드를 두 번 이상 빌드하여 컴파일 시간을 늘립니다. IntelliJ IDEA에서 테스트를 실행하거나
Xcode에서 앱을 시작하는 것과 같은 일반적인 경우 Kotlin 도구는 불필요한 작업 실행을 피합니다.

일반적이지 않은 경우 또는 빌드 구성이 있는 경우 작업을 직접 선택해야 할 수 있습니다.

* `linkDebug*`. 개발 중에 코드를 실행하려면 일반적으로 하나의 바이너리만 필요하므로 해당
  `linkDebug*` 작업을 실행하는 것으로 충분해야 합니다.
* `embedAndSignAppleFrameworkForXcode`. iOS 시뮬레이터와 장치는 프로세서 아키텍처가 다르므로
  Kotlin/Native 바이너리를 유니버설(fat) 프레임워크로 배포하는 것이 일반적인 방법입니다.

  그러나 로컬 개발 중에는 사용 중인 플랫폼에 대해서만 `.framework` 파일을 빌드하는 것이 더 빠릅니다.
  플랫폼별 프레임워크를 빌드하려면 [embedAndSignAppleFrameworkForXcode](multiplatform-direct-integration#connect-the-framework-to-your-project) 작업을 사용하세요.

### 필요한 타겟에 대해서만 빌드

위의 권장 사항과 유사하게 모든 네이티브
플랫폼에 대해 한 번에 바이너리를 빌드하지 마세요. 예를 들어 [XCFramework](multiplatform-build-native-binaries#build-xcframeworks)를 컴파일하는 경우
(`*XCFramework` 작업 사용)은 모든 타겟에 대해 동일한 코드를 빌드하므로 단일 타겟에 대해 빌드하는 것보다 비례적으로 더 많은 시간이 걸립니다.

설정에 XCFramework가 필요한 경우 타겟 수를 줄일 수 있습니다.
예를 들어 Intel 기반 Mac에서 이 프로젝트를 iOS 시뮬레이터에서 실행하지 않는 경우 `iosX64`가 필요하지 않습니다.

:::note
다른 타겟용 바이너리는 `linkDebug*$Target` 및 `linkRelease*$Target` Gradle 작업을 통해 빌드됩니다.
실행된 작업은 빌드 로그 또는
[Gradle 빌드 스캔](https://docs.gradle.org/current/userguide/build_scans.html)에서 확인할 수 있습니다.
`--scan` 옵션을 사용하여 Gradle 빌드를 실행하세요.

### 불필요한 릴리스 바이너리를 빌드하지 마세요.

Kotlin/Native는 [디버그 및 릴리스](multiplatform-build-native-binaries#declare-binaries)의 두 가지 빌드 모드를 지원합니다.
릴리스는 고도로 최적화되어 있으며 시간이 많이 걸립니다. 릴리스 바이너리 컴파일은 디버그 바이너리보다 훨씬 더 많은 시간이 걸립니다.

실제 릴리스와는 별개로 이러한 모든 최적화는 일반적인 개발 주기에서 불필요할 수 있습니다.
개발 프로세스 중에 이름에 `Release`가 있는 작업을 사용하는 경우 이를 `Debug`로 바꾸는 것을 고려하세요.
마찬가지로 `assembleXCFramework`를 실행하는 대신 예를 들어 `assembleSharedDebugXCFramework`를 실행할 수 있습니다.

릴리스 바이너리는 `linkRelease*` Gradle 작업을 통해 빌드됩니다. 빌드 로그
또는 `--scan` 옵션으로 Gradle 빌드를 실행하여 [Gradle 빌드 스캔](https://docs.gradle.org/current/userguide/build_scans.html)에서 확인할 수 있습니다.

### Gradle 데몬을 비활성화하지 마세요.

합당한 이유 없이 [Gradle 데몬](https://docs.gradle.org/current/userguide/gradle_daemon.html)을 비활성화하지 마세요. 기본적으로 [Kotlin/Native는 Gradle 데몬에서 실행됩니다](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native).
활성화되면 동일한 JVM 프로세스가 사용되고 각 컴파일에 대해 워밍업할 필요가 없습니다.

### 전이적 내보내기를 사용하지 마세요.

[`transitiveExport = true`](multiplatform-build-native-binaries#export-dependencies-to-binaries)를 사용하면 많은 경우에 데드
코드 제거가 비활성화되므로 컴파일러는 사용되지 않는 많은 코드를 처리해야 합니다. 컴파일 시간이 늘어납니다.
대신 필요한 프로젝트와 종속성을 내보내는 데 `export` 메서드를 명시적으로 사용하세요.

### 모듈을 너무 많이 내보내지 마세요.

불필요한 [모듈 내보내기](multiplatform-build-native-binaries#export-dependencies-to-binaries)를 피하도록 노력하세요.
내보낸 각 모듈은 컴파일 시간과 바이너리 크기에 부정적인 영향을 미칩니다.

### Gradle 빌드 캐싱 사용

Gradle [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html) 기능을 활성화합니다.

* **로컬 빌드 캐시**. 로컬 캐싱의 경우 `gradle.properties` 파일에 `org.gradle.caching=true`를 추가하거나
  명령줄에서 `--build-cache` 옵션으로 빌드를 실행합니다.
* **원격 빌드 캐시**. 지속적 통합 환경에 대한 [원격 빌드 캐시 구성](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote) 방법을 알아보세요.

### Gradle 구성 캐시 사용

Gradle [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)를 사용하려면
`gradle.properties` 파일에 `org.gradle.configuration-cache=true`를 추가합니다.

구성 캐시는 또한 `link*` 작업을 병렬로 실행할 수 있게 해주어 특히 CPU 코어가 많은 경우 시스템에 과부하를 줄 수 있습니다.
이 문제는 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915)에서 수정될 예정입니다.

:::

### 이전에 비활성화된 기능 활성화

Gradle 데몬과 컴파일러 캐시를 비활성화하는 Kotlin/Native 속성이 있습니다.

* `kotlin.native.disableCompilerDaemon=true`
* `kotlin.native.cacheKind=none`
* `$target`이 Kotlin/Native 컴파일 타겟인 `kotlin.native.cacheKind.$target=none`(예: `iosSimulatorArm64`).

이전에 이러한 기능에 문제가 있었고 이러한 줄을 `gradle.properties` 파일 또는 Gradle 인수에 추가한 경우
이를 제거하고 빌드가 성공적으로 완료되는지 확인하세요. 이러한 속성은 이전에
이미 수정된 문제를 해결하기 위해 추가되었을 수 있습니다.

### klib 아티팩트의 증분 컴파일 시도

증분 컴파일을 사용하면 프로젝트 모듈에서 생성된 `klib` 아티팩트의 일부만 변경되는 경우
`klib`의 일부만 바이너리로 다시 컴파일됩니다.

이 기능은 [실험적](components-stability#stability-levels-explained)입니다. 활성화하려면
`gradle.properties` 파일에 `kotlin.incremental.native=true` 옵션을 추가합니다. 문제가 발생하면
[YouTrack에 문제](https://kotl.in/issue)를 만드세요.

## Windows 구성

Windows 보안이 Kotlin/Native 컴파일러 속도를 늦출 수 있습니다. 기본적으로 `%\USERPROFILE%`에 있는 `.konan` 디렉토리를
Windows 보안 예외에 추가하여 이를 방지할 수 있습니다. [Windows 보안에 예외를 추가하는 방법](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)을 알아보세요.