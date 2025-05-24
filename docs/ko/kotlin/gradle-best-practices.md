---
title: "Gradle 모범 사례"
---
[Gradle](https://docs.gradle.org/current/userguide/userguide.html)은 많은 Kotlin 프로젝트에서 빌드 프로세스를 자동화하고 관리하는 데 사용되는 빌드 시스템입니다.

Gradle을 최대한 활용하는 것은 빌드 관리 및 대기 시간을 줄이고 코딩 시간을 늘리는 데 필수적입니다. 여기에서는 프로젝트 **구성** 및 **최적화**라는 두 가지 주요 영역으로 나눈 모범 사례를 제공합니다.

## 구성

이 섹션에서는 명확성, 유지 관리 용이성 및 확장성을 개선하기 위해 Gradle 프로젝트를 구조화하는 데 중점을 둡니다.

### Kotlin DSL 사용

기존 Groovy DSL 대신 Kotlin DSL을 사용하세요. 다른 언어를 배울 필요가 없으며 엄격한 타입 지정의 이점을 얻을 수 있습니다. 엄격한 타입 지정은 IDE가 리팩터링 및 자동 완성에 대한 더 나은 지원을 제공하여 개발 효율성을 높입니다.

자세한 내용은 [Gradle의 Kotlin DSL 입문서](https://docs.gradle.org/current/userguide/kotlin_dsl.html)에서 확인하세요.

Gradle의 [블로그](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)에서 Kotlin DSL이 새로운 Gradle 빌드의 기본값이 된 것에 대해 알아보세요.

### 버전 카탈로그 사용

`libs.versions.toml` 파일에서 버전 카탈로그를 사용하여 종속성 관리를 중앙 집중화하세요. 이렇게 하면 프로젝트 전반에서 버전, 라이브러리 및 플러그인을 일관되게 정의하고 재사용할 수 있습니다.

```kotlin
[versions]
kotlinxCoroutines = "1.10.1"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

다음 종속성을 `build.gradle.kts` 파일에 추가합니다.

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

자세한 내용은 Gradle 문서의 [종속성 관리 기본 사항](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)에서 확인하세요.

### 컨벤션 플러그인 사용

컨벤션 플러그인을 사용하여 여러 빌드 파일에서 공통 빌드 로직을 캡슐화하고 재사용하세요. 공유 구성을 플러그인으로 이동하면 빌드 스크립트를 단순화하고 모듈화하는 데 도움이 됩니다.

초기 설정은 시간이 오래 걸릴 수 있지만 완료 후에는 새로운 빌드 로직을 유지 관리하고 추가하기 쉽습니다.

자세한 내용은 Gradle 문서의 [컨벤션 플러그인](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)에서 확인하세요.

## 최적화

이 섹션에서는 Gradle 빌드의 성능과 효율성을 향상시키기 위한 전략을 제공합니다.

### 로컬 빌드 캐시 사용

로컬 빌드 캐시를 사용하여 다른 빌드에서 생성된 출력을 재사용하여 시간을 절약하세요. 빌드 캐시는 이미 생성한 이전 빌드에서 출력을 검색할 수 있습니다.

자세한 내용은 Gradle 문서의 [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)에서 확인하세요.

### 구성 캐시 사용

:::note
구성 캐시는 아직 모든 핵심 Gradle 플러그인을 지원하지 않습니다. 최신 정보는 Gradle의 [지원되는 플러그인 표](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core)를 참조하세요.

:::

구성 캐시를 사용하여 구성 단계의 결과를 캐시하고 후속 빌드에 재사용하여 빌드 성능을 크게 향상시키세요. Gradle이 빌드 구성 또는 관련 종속성의 변경 사항을 감지하지 못하면 구성 단계를 건너뜁니다.

자세한 내용은 Gradle 문서의 [구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)에서 확인하세요.

### 여러 대상에 대한 빌드 시간 개선

멀티플랫폼 프로젝트에 여러 대상이 포함된 경우 `build` 및 `assemble`과 같은 작업은 각 대상에 대해 동일한 코드를 여러 번 컴파일하여 컴파일 시간이 길어질 수 있습니다.

특정 플랫폼을 적극적으로 개발하고 테스트하는 경우 해당 `linkDebug*` 작업을 대신 실행하세요.

자세한 내용은 [컴파일 시간 개선 팁](native-improving-compilation-time#gradle-configuration)을 참조하세요.

### kapt에서 KSP로 마이그레이션

[kapt](kapt) 컴파일러 플러그인을 사용하는 라이브러리를 사용하는 경우 대신 [Kotlin Symbol Processing (KSP) API](ksp-overview)를 사용하도록 전환할 수 있는지 확인하세요. KSP API는 어노테이션 처리 시간을 줄여 빌드 성능을 향상시킵니다. KSP는 중간 Java 스텁을 생성하지 않고 소스 코드를 직접 처리하므로 kapt보다 빠르고 효율적입니다.

마이그레이션 단계에 대한 지침은 Google의 [마이그레이션 가이드](https://developer.android.com/build/migrate-to-ksp)를 참조하세요.

KSP가 kapt와 어떻게 비교되는지 자세히 알아보려면 [KSP를 사용하는 이유](ksp-why-ksp)를 확인하세요.

### 모듈화 사용

:::note
모듈화는 중간 규모에서 대규모 프로젝트에만 유용합니다. 마이크로서비스 아키텍처를 기반으로 하는 프로젝트에는 장점을 제공하지 않습니다.

:::

모듈화된 프로젝트 구조를 사용하여 빌드 속도를 높이고 병렬 개발을 더 쉽게 할 수 있습니다. 프로젝트를 하나의 루트 프로젝트와 하나 이상의 하위 프로젝트로 구성하세요. 변경 사항이 하위 프로젝트 중 하나에만 영향을 미치는 경우 Gradle은 해당 특정 하위 프로젝트만 다시 빌드합니다.

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

자세한 내용은 Gradle 문서의 [Gradle로 프로젝트 구조화](https://docs.gradle.org/current/userguide/multi_project_builds.html)에서 확인하세요.

### CI/CD 설정

CI/CD 프로세스를 설정하여 증분 빌드 및 종속성 캐싱을 사용하여 빌드 시간을 크게 줄이세요. 이러한 이점을 보려면 영구 스토리지를 추가하거나 원격 빌드 캐시를 사용하세요. [GitHub](https://github.com/features/actions)와 같은 일부 제공업체는 이 서비스를 거의 즉시 제공하므로 이 프로세스에 시간이 많이 걸릴 필요가 없습니다.

[연속 통합 시스템과 함께 Gradle 사용](https://cookbook.gradle.org/ci/)에 대한 Gradle 커뮤니티 Cookbook을 살펴보세요.

### 원격 빌드 캐시 사용

[로컬 빌드 캐시](#use-local-build-cache)와 마찬가지로 원격 빌드 캐시는 다른 빌드의 출력을 재사용하여 시간을 절약하는 데 도움이 됩니다. 마지막 빌드뿐만 아니라 누군가가 이미 실행한 이전 빌드에서 작업 출력을 검색할 수 있습니다.

원격 빌드 캐시는 캐시 서버를 사용하여 빌드 간에 작업 출력을 공유합니다. 예를 들어 CI/CD 서버가 있는 개발 환경에서 서버의 모든 빌드는 원격 캐시를 채웁니다. 새 기능을 시작하기 위해 메인 브랜치를 체크아웃하면 증분 빌드에 즉시 액세스할 수 있습니다.

느린 인터넷 연결로 인해 캐시된 결과를 전송하는 데 로컬에서 작업을 실행하는 것보다 시간이 더 오래 걸릴 수 있다는 점에 유의하세요.

자세한 내용은 Gradle 문서의 [빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)에서 확인하세요.