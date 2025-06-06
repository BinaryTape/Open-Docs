[//]: # (title: Gradle 모범 사례)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html)은 많은 Kotlin 프로젝트에서 빌드 프로세스를 자동화하고 관리하는 데 사용되는 빌드 시스템입니다.

Gradle을 최대한 활용하는 것은 빌드를 관리하고 기다리는 시간을 줄이고 코딩에 더 많은 시간을 할애하는 데 필수적입니다. 여기서는 프로젝트를 **구성**하고 **최적화**하는 두 가지 핵심 영역으로 나누어 모범 사례를 제공합니다.

## 구성

이 섹션에서는 명확성, 유지보수성 및 확장성을 개선하기 위한 Gradle 프로젝트 구성에 중점을 둡니다.

### Kotlin DSL 사용

기존 Groovy DSL 대신 Kotlin DSL을 사용하세요. 다른 언어를 배울 필요가 없으며 강력한 타입 지정의 이점을 얻을 수 있습니다. 강력한 타입 지정은 IDE가 리팩터링 및 자동 완성에 대한 더 나은 지원을 제공하여 개발 효율성을 높입니다.

더 자세한 정보는 [Gradle의 Kotlin DSL primer](https://docs.gradle.org/current/userguide/kotlin_dsl.html)에서 찾아볼 수 있습니다.

Kotlin DSL이 Gradle 빌드의 기본값이 된 것에 대한 Gradle [블로그](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)를 읽어보세요.

### 버전 카탈로그 사용

`libs.versions.toml` 파일에 버전 카탈로그(version catalog)를 사용하여 의존성 관리를 중앙 집중화하세요. 이를 통해 프로젝트 전반에 걸쳐 버전, 라이브러리 및 플러그인을 일관되게 정의하고 재사용할 수 있습니다.

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

다음 의존성을 `build.gradle.kts` 파일에 추가하면:

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

Gradle 문서의 [의존성 관리 기본 사항](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)에서 더 자세히 알아보세요.

### 컨벤션 플러그인 사용

<primary-label ref="advanced"/>

컨벤션 플러그인(convention plugins)을 사용하여 여러 빌드 파일에서 공통 빌드 로직을 캡슐화하고 재사용하세요. 공유되는 구성을 플러그인으로 옮기면 빌드 스크립트를 단순화하고 모듈화하는 데 도움이 됩니다.

초기 설정은 시간이 많이 걸릴 수 있지만, 일단 완료하면 유지보수하고 새로운 빌드 로직을 추가하기 쉽습니다.

Gradle 문서의 [컨벤션 플러그인](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)에서 더 자세히 알아보세요.

## 최적화

이 섹션에서는 Gradle 빌드의 성능과 효율성을 향상시키기 위한 전략을 제공합니다.

### 로컬 빌드 캐시 사용

로컬 빌드 캐시(local build cache)를 사용하여 다른 빌드에서 생성된 결과물을 재사용함으로써 시간을 절약하세요. 빌드 캐시는 이미 생성했던 이전 빌드로부터 결과물을 검색할 수 있습니다.

Gradle 문서의 [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)에서 더 자세히 알아보세요.

### 구성 캐시 사용

> 구성 캐시(configuration cache)는 아직 모든 핵심 Gradle 플러그인을 지원하지 않습니다. 최신 정보는 Gradle의 [지원되는 플러그인 표](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)를 참조하세요.
>
{style="note"}

구성 캐시를 사용하여 구성 단계의 결과를 캐싱하고 이후 빌드에서 재사용함으로써 빌드 성능을 크게 향상시키세요. Gradle이 빌드 구성 또는 관련 의존성에서 변경 사항을 감지하지 못하면 구성 단계를 건너뜁니다.

Gradle 문서의 [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)에서 더 자세히 알아보세요.

### 여러 대상에 대한 빌드 시간 개선

멀티플랫폼 프로젝트에 여러 대상(target)이 포함된 경우, `build` 및 `assemble`과 같은 태스크는 각 대상에 대해 동일한 코드를 여러 번 컴파일하여 컴파일 시간이 길어질 수 있습니다.

특정 플랫폼을 활발히 개발하고 테스트하는 경우, 대신 해당 `linkDebug*` 태스크를 실행하세요.

더 자세한 정보는 [컴파일 시간 개선을 위한 팁](native-improving-compilation-time.md#gradle-configuration)을 참조하세요.

### kapt에서 KSP로 마이그레이션

[kapt](kapt.md) 컴파일러 플러그인에 의존하는 라이브러리를 사용하고 있다면, 대신 [Kotlin Symbol Processing (KSP) API](ksp-overview.md)를 사용할 수 있는지 확인해 보세요. KSP API는 어노테이션 처리 시간을 줄여 빌드 성능을 향상시킵니다. KSP는 중간 자바 스텁(Java stubs)을 생성하지 않고 소스 코드를 직접 처리하므로 kapt보다 빠르고 효율적입니다.

마이그레이션 단계에 대한 지침은 Google의 [마이그레이션 가이드](https://developer.android.com/build/migrate-to-ksp)를 참조하세요.

KSP가 kapt와 어떻게 비교되는지 더 자세히 알아보려면 [KSP를 사용하는 이유](ksp-why-ksp.md)를 확인해 보세요.

### 모듈화 사용

<primary-label ref="advanced"/>

> 모듈화(Modularization)는 중규모에서 대규모 프로젝트에만 이점이 있습니다. 마이크로서비스 아키텍처 기반 프로젝트에는 이점을 제공하지 않습니다.
>
{style="note"}

모듈화된 프로젝트 구조를 사용하여 빌드 속도를 높이고 병렬 개발을 더 쉽게 할 수 있습니다. 프로젝트를 하나의 루트 프로젝트와 하나 이상의 서브프로젝트로 구성하세요. 변경 사항이 서브프로젝트 중 하나에만 영향을 미치는 경우, Gradle은 해당 특정 서브프로젝트만 다시 빌드합니다.

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

Gradle 문서의 [Gradle로 프로젝트 구성하기](https://docs.gradle.org/current/userguide/multi_project_builds.html)에서 더 자세히 알아보세요.

### CI/CD 설정

<primary-label ref="advanced"/>

점진적 빌드(incremental builds) 및 의존성 캐싱을 사용하여 빌드 시간을 크게 줄이려면 CI/CD 프로세스를 설정하세요. 이러한 이점을 얻으려면 영구 저장소를 추가하거나 원격 빌드 캐시를 사용하세요. [GitHub](https://github.com/features/actions)와 같은 일부 제공업체는 이 서비스를 거의 즉시 사용할 수 있도록 제공하므로 이 과정이 시간이 많이 걸릴 필요는 없습니다.

[지속적 통합 시스템에서 Gradle 사용하기](https://cookbook.gradle.org/ci/)에 대한 Gradle 커뮤니티 쿡북을 살펴보세요.

### 원격 빌드 캐시 사용

<primary-label ref="advanced"/>

[로컬 빌드 캐시](#use-local-build-cache)와 마찬가지로 원격 빌드 캐시(remote build cache)는 다른 빌드의 결과물을 재사용하여 시간을 절약하는 데 도움이 됩니다. 이는 누군가가 이미 실행한 이전 빌드로부터 태스크 결과물을 검색할 수 있으며, 마지막 빌드뿐만 아니라 어떤 빌드에서도 가능합니다.

원격 빌드 캐시는 캐시 서버를 사용하여 빌드 전반에 걸쳐 태스크 결과물을 공유합니다. 예를 들어, CI/CD 서버가 있는 개발 환경에서 서버의 모든 빌드는 원격 캐시를 채웁니다. 새로운 기능을 시작하기 위해 메인 브랜치를 체크아웃할 때, 즉시 점진적 빌드에 접근할 수 있습니다.

인터넷 연결이 느리면 캐시된 결과를 전송하는 것이 로컬에서 태스크를 실행하는 것보다 느려질 수 있다는 점을 명심하세요.

Gradle 문서의 [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)에서 더 자세히 알아보세요.