[//]: # (title: Gradle 모범 사례)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html)은 빌드 프로세스를 자동화하고 관리하기 위해 많은 Kotlin 프로젝트에서 사용하는 빌드 시스템입니다.

Gradle을 최대한 활용하는 것은 빌드 관리 및 대기 시간을 줄이고 코딩에 더 많은 시간을 할애하는 데 필수적입니다. 여기서는 프로젝트 **구성(organizing)**과 **최적화(optimizing)**라는 두 가지 핵심 영역으로 나뉜 모범 사례 세트를 제공합니다.

## 구성 (Organize)

이 섹션에서는 명확성, 유지 관리성 및 확장성을 개선하기 위해 Gradle 프로젝트를 구조화하는 방법에 중점을 둡니다.

### Kotlin DSL 사용

전통적인 Groovy DSL 대신 Kotlin DSL을 사용하세요. 다른 언어를 배울 필요가 없으며 강타입(strict typing)의 이점을 얻을 수 있습니다. 강타입을 통해 IDE는 리팩터링 및 자동 완성에 대한 더 나은 지원을 제공하여 개발 효율성을 높여줍니다.

자세한 정보는 [Gradle의 Kotlin DSL 입문서](https://docs.gradle.org/current/userguide/kotlin_dsl.html)에서 확인하세요.

Kotlin DSL이 Gradle 빌드의 기본값이 된 것에 관한 Gradle의 [블로그](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)를 읽어보세요.

### 버전 카탈로그 사용

의존성 관리를 중앙 집중화하기 위해 `libs.versions.toml` 파일에서 버전 카탈로그를 사용하세요. 이를 통해 여러 프로젝트에서 버전, 라이브러리 및 플러그인을 일관되게 정의하고 재사용할 수 있습니다.

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

`build.gradle.kts` 파일에 다음과 같은 의존성을 추가합니다:

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

Gradle 문서의 [의존성 관리 기초(Dependency management basics)](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog)에서 자세히 알아보세요.

### 컨벤션 플러그인 사용

<primary-label ref="advanced"/>

여러 빌드 파일에서 공통 빌드 로직을 캡슐화하고 재사용하려면 컨벤션 플러그인을 사용하세요. 공유 구성을 플러그인으로 이동하면 빌드 스크립트를 단순화하고 모듈화하는 데 도움이 됩니다.

초기 설정에 시간이 걸릴 수 있지만, 일단 완료하면 새로운 빌드 로직을 유지 관리하고 추가하기가 쉽습니다.

Gradle 문서의 [컨벤션 플러그인(Convention plugins)](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)에서 자세히 알아보세요.

## 최적화 (Optimize)

이 섹션에서는 Gradle 빌드의 성능과 효율성을 높이기 위한 전략을 제공합니다.

### 로컬 빌드 캐시 사용

다른 빌드에서 생성된 출력물을 재사용하여 시간을 절약하려면 로컬 빌드 캐시를 사용하세요. 빌드 캐시는 이미 생성한 이전 빌드의 출력물을 가져올 수 있습니다.

Gradle 문서의 [빌드 캐시(Build cache)](https://docs.gradle.org/current/userguide/build_cache.html)에서 자세히 알아보세요.

### 구성 캐시 사용

> 구성 캐시(configuration cache)는 아직 모든 핵심 Gradle 플러그인을 지원하지 않습니다. 최신 정보는 Gradle의 [지원 플러그인 표](https://docs.gradle.org/current/userguide/configuration_cache_status.html#config_cache:plugins:core)를 참조하세요.
>
{style="note"}

구성 단계의 결과를 캐싱하고 이후 빌드에서 재사용하여 빌드 성능을 크게 향상시키려면 구성 캐시를 사용하세요. Gradle이 빌드 구성이나 관련 의존성의 변경 사항을 감지하지 못하면 구성 단계를 건너뜁니다.

구성 캐시는 또한 단일 프로젝트 내에서 독립적인 태스크의 병렬 실행을 가능하게 하여 빌드 성능을 더욱 향상시킬 수 있습니다. 또한 `org.gradle.parallel` 속성을 암시적으로 활성화하여 서로 다른 프로젝트의 태스크가 [병렬로 실행](https://docs.gradle.org/current/userguide/performance.html#sec:enable_parallel_execution)되도록 합니다.

구성 캐시에 대해 [Gradle 문서](https://docs.gradle.org/current/userguide/configuration_cache.html)에서 자세히 알아보세요.

### 멀티 타겟 빌드 시간 개선

멀티플랫폼 프로젝트에 여러 타겟이 포함된 경우, `build` 및 `assemble`과 같은 태스크가 각 타겟에 대해 동일한 코드를 여러 번 컴파일하여 컴파일 시간이 길어질 수 있습니다.

특정 플랫폼을 활발하게 개발하고 테스트 중이라면 대신 해당하는 `linkDebug*` 태스크를 실행하세요.

자세한 내용은 [컴파일 시간 개선을 위한 팁](native-improving-compilation-time.md#gradle-configuration)을 참조하세요.

### kapt에서 KSP로 마이그레이션

[kapt](kapt.md) 컴파일러 플러그인에 의존하는 라이브러리를 사용 중이라면, 대신 [Kotlin Symbol Processing (KSP) API](ksp-overview.md) 사용으로 전환할 수 있는지 확인하세요. KSP API는 어노테이션 처리 시간을 줄여 빌드 성능을 향상시킵니다. KSP는 중간 Java 스텁(stub)을 생성하지 않고 소스 코드를 직접 처리하므로 kapt보다 빠르고 효율적입니다.

마이그레이션 단계에 대한 안내는 Google의 [마이그레이션 가이드](https://developer.android.com/build/migrate-to-ksp)를 참조하세요.

KSP와 kapt의 비교에 대해 자세히 알아보려면 [왜 KSP인가(why KSP)](ksp-why-ksp.md)를 확인하세요.

### 모듈화 사용

<primary-label ref="advanced"/>

> 모듈화는 중간 규모에서 대규모 프로젝트에만 이점이 있습니다. 마이크로서비스 아키텍처 기반의 프로젝트에는 이점을 제공하지 않습니다.
>
{style="note"}

빌드 속도를 높이고 더 쉬운 병렬 개발을 가능하게 하려면 모듈화된 프로젝트 구조를 사용하세요. 프로젝트를 하나의 루트 프로젝트와 하나 이상의 서브프로젝트로 구성하세요. 변경 사항이 서브프로젝트 중 하나에만 영향을 미치는 경우, Gradle은 해당 특정 서브프로젝트만 다시 빌드합니다.

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

Gradle 문서의 [Gradle로 프로젝트 구조화하기](https://docs.gradle.org/current/userguide/multi_project_builds.html)에서 자세히 알아보세요.

### CI/CD 설정
<primary-label ref="advanced"/>

증분 빌드(incremental builds) 및 의존성 캐싱을 사용하여 빌드 시간을 크게 단축하려면 CI/CD 프로세스를 설정하세요. 이러한 이점을 얻으려면 영구 저장소를 추가하거나 원격 빌드 캐시를 사용하세요. [GitHub](https://github.com/features/actions)와 같은 일부 제공업체는 이 서비스를 거의 즉시 사용할 수 있도록 제공하므로 이 프로세스가 오래 걸릴 필요는 없습니다.

Gradle 커뮤니티 쿡북의 [지속적 통합(CI) 시스템에서 Gradle 사용하기](https://cookbook.gradle.org/ci/)를 살펴보세요.

### 원격 빌드 캐시 사용
<primary-label ref="advanced"/>

[로컬 빌드 캐시](#use-local-build-cache)와 마찬가지로, 원격 빌드 캐시는 다른 빌드의 출력을 재사용하여 시간을 절약하는 데 도움이 됩니다. 단순히 마지막 빌드뿐만 아니라 이전에 누군가가 실행한 모든 빌드의 태스크 출력물을 가져올 수 있습니다.

원격 빌드 캐시는 캐시 서버를 사용하여 빌드 간에 태스크 출력물을 공유합니다. 예를 들어 CI/CD 서버가 있는 개발 환경에서 서버의 모든 빌드는 원격 캐시를 채웁니다. 새로운 기능을 시작하기 위해 메인 브랜치를 체크아웃할 때, 즉시 증분 빌드 결과에 접근할 수 있습니다.

인터넷 연결이 느리면 캐시된 결과를 전송하는 것이 로컬에서 태스크를 실행하는 것보다 느려질 수 있다는 점에 유의하세요.

Gradle 문서의 [빌드 캐시(Build cache)](https://docs.gradle.org/current/userguide/build_cache.html)에서 자세히 알아보세요.