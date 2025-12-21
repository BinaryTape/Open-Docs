[//]: # (title: Kotlin Multiplatform 호환성 가이드)

<show-structure depth="1"/>

이 가이드는 Kotlin Multiplatform 프로젝트를 개발할 때 발생할 수 있는 [호환되지 않는 변경 사항](https://kotlinlang.org/docs/kotlin-evolution-principles.html#incompatible-changes)을 요약합니다.

Kotlin의 현재 Stable 버전은 %kotlinVersion%입니다. 프로젝트에서 사용하는 Kotlin 버전에 따라 특정 변경 사항의 사용 중단 주기를 고려하세요. 예를 들어:

*   Kotlin 1.7.0에서 Kotlin 1.9.0으로 업그레이드할 때, [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25) 및 [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22)에서 모두 적용된 호환되지 않는 변경 사항을 확인하세요.
*   Kotlin 1.9.0에서 Kotlin 2.0.0으로 업그레이드할 때, [Kotlin 2.0.0](#kotlin-2-0-0-and-later) 및 [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25)에서 모두 적용된 호환되지 않는 변경 사항을 확인하세요.

## 버전 호환성

프로젝트를 구성할 때, 특정 버전의 Kotlin Multiplatform Gradle 플러그인(프로젝트의 Kotlin 버전과 동일)과 Gradle, Xcode, Android Gradle 플러그인 버전의 호환성을 확인하세요:

| Kotlin Multiplatform plugin version | Gradle | Android Gradle plugin | Xcode |
|-------------------------------------|---------------------------------------|-----------------------------------------------------|---------|
| 2.3.0 | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% | %xcode% |
| 2.2.21 | 7.6.3–8.14 | 7.3.1–8.11.1 | 26 |
| 2.2.20 | 7.6.3–8.14 | 7.3.1–8.11.1 | 16.4 |
| 2.2.0-2.2.10 | 7.6.3–8.14 | 7.3.1–8.10.0 | 16.3 |
| 2.1.21 | 7.6.3–8.12.1 | 7.3.1–8.7.2 | 16.3 |
| 2.1.20 | 7.6.3–8.11 | 7.4.2–8.7.2 | 16.0 |
| 2.1.0–2.1.10 | 7.6.3-8.10* | 7.4.2–8.7.2 | 16.0 |
| 2.0.21 | 7.5-8.8* | 7.4.2–8.5 | 16.0 |
| 2.0.20 | 7.5-8.8* | 7.4.2–8.5 | 15.3 |
| 2.0.0 | 7.5-8.5 | 7.4.2–8.3 | 15.3 |
| 1.9.20 | 7.5-8.1.1 | 7.4.2–8.2 | 15.0 |

> *Kotlin 2.0.20–2.0.21 및 Kotlin 2.1.0–2.1.10은 Gradle 8.6까지 완전히 호환됩니다.
> Gradle 버전 8.7–8.10도 지원되지만, 한 가지 예외가 있습니다. Kotlin Multiplatform Gradle 플러그인을 사용하는 경우, 멀티플랫폼 프로젝트에서 JVM 타겟의 `withJava()` 함수 호출 시 사용 중단 경고가 표시될 수 있습니다.
> 자세한 내용은 [기본적으로 생성되는 Java 소스 세트](#java-source-sets-created-by-default)를 참조하세요.
>
{style="warning"}

## Kotlin 2.0.0 및 이후 버전

이 섹션에서는 사용 중단 주기가 끝나고 Kotlin 2.0.0−%kotlinVersion%에 적용되는 호환되지 않는 변경 사항에 대해 다룹니다.

### Android 타겟을 위한 Google 플러그인으로 마이그레이션

**무엇이 변경되었나요?**

Kotlin 2.3.0 이전에는 `com.android.application` 및 `com.android.library` 플러그인을 통해 Android 타겟을 지원했습니다. 이는 Google의 Android 팀이 Kotlin Multiplatform에 맞춰 별도의 플러그인을 개발하는 동안의 임시 해결책이었습니다.

초기에는 `android` 블록을 사용했지만, 나중에 `android` 이름을 새 플러그인이 사용하도록 예약할 수 있도록 `androidTarget` 블록으로 전환했습니다.

이제 Android 팀에서 제공하는 [`com.android.kotlin.multiplatform.library` 플러그인](https://developer.android.com/kotlin/multiplatform/plugin)을 사용할 수 있으며, 이를 원래의 `android` 블록과 함께 사용할 수 있습니다.

**현재의 모범 사례는 무엇인가요?**

새로운 `com.android.kotlin.multiplatform.library` 플러그인으로 마이그레이션하세요. `androidTarget` 블록의 모든 발생을 `android`로 이름을 변경하세요. 마이그레이션 방법에 대한 자세한 지침은 Google의 [마이그레이션 가이드](https://developer.android.com/kotlin/multiplatform/plugin#migrate)를 참조하세요.

**언제부터 변경 사항이 적용되나요?**

Kotlin Multiplatform Gradle 플러그인에 대한 사용 중단 주기는 다음과 같습니다:

*   1.9.0: Kotlin Multiplatform 프로젝트에서 `android` 이름 사용 시 사용 중단 경고가 도입됩니다.
*   2.1.0: 이 경고가 오류로 상향됩니다.
*   2.2.0: Kotlin Multiplatform Gradle 플러그인에서 `android` 타겟 DSL이 제거됩니다.
*   2.3.0: 새 Android 플러그인을 사용할 수 있으며, Kotlin Multiplatform 프로젝트에서 `androidTarget` 이름 사용 시 사용 중단 경고가 도입됩니다.

### Bitcode 임베딩 사용 중단

**무엇이 변경되었나요?**

Bitcode 임베딩은 Xcode 14에서 사용이 중단되었고 Xcode 15에서는 모든 Apple 타겟에서 제거되었습니다. 이에 따라 프레임워크 구성의 `embedBitcode` 파라미터와 `-Xembed-bitcode`, `-Xembed-bitcode-marker` 명령줄 인수가 Kotlin에서 사용 중단되었습니다.

**현재의 모범 사례는 무엇인가요?**

이전 버전의 Xcode를 사용 중이지만 Kotlin 2.0.20 이상으로 업그레이드하려면 Xcode 프로젝트에서 bitcode 임베딩을 비활성화하세요.

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   2.0.20: Kotlin/Native 컴파일러가 더 이상 bitcode 임베딩을 지원하지 않습니다.
*   2.1.0: `embedBitcode` DSL이 Kotlin Multiplatform Gradle 플러그인에서 경고와 함께 사용 중단됩니다.
*   2.2.0: 경고가 오류로 상향됩니다.
*   2.3.0: `embedBitcode` DSL이 제거됩니다.

### 기본적으로 생성되는 Java 소스 세트

**무엇이 변경되었나요?**

Kotlin Multiplatform을 다가오는 Gradle 변경 사항에 맞추기 위해 `withJava()` 함수를 단계적으로 제거하고 있습니다. `withJava()` 함수는 필요한 Java 소스 세트를 생성하여 Gradle의 Java 플러그인과의 통합을 가능하게 했습니다. Kotlin 2.1.20부터 이러한 Java 소스 세트는 기본적으로 생성됩니다.

**현재의 모범 사례는 무엇인가요?**

이전에는 `src/jvmMain/java` 및 `src/jvmTest/java` 소스 세트를 생성하기 위해 `withJava()` 함수를 명시적으로 사용해야 했습니다.

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

Kotlin 2.1.20부터 빌드 스크립트에서 `withJava()` 함수를 제거할 수 있습니다.

또한, Gradle은 이제 Java 소스가 존재할 경우에만 Java 컴파일 작업을 실행하며, 이전에는 실행되지 않았던 JVM 유효성 검사 진단을 트리거합니다. 이 진단은 `KotlinJvmCompile` 작업 또는 `compilerOptions` 내부에서 호환되지 않는 JVM 타겟을 명시적으로 구성하는 경우 실패합니다. JVM 타겟 호환성을 보장하는 방법에 대한 지침은 [관련 컴파일 작업의 JVM 타겟 호환성 확인](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)을 참조하세요.

프로젝트가 Gradle 버전 8.7보다 높은 버전을 사용하고 [Java](https://docs.gradle.org/current/userguide/java_plugin.html), [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 또는 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)과 같은 Gradle Java 플러그인에 의존하지 않거나, Gradle Java 플러그인에 종속성이 있는 서드 파티 Gradle 플러그인을 사용하지 않는다면 `withJava()` 함수를 제거할 수 있습니다.

프로젝트가 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java 플러그인을 사용하는 경우, [새로운 Experimental DSL](https://kotlinlang.org/docs/whatsnew2120.html#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)로 마이그레이션하는 것을 권장합니다. Gradle 8.7부터 Application 플러그인은 Kotlin Multiplatform Gradle 플러그인과 더 이상 함께 작동하지 않습니다.

멀티플랫폼 프로젝트에서 Kotlin Multiplatform Gradle 플러그인과 다른 Gradle 플러그인을 모두 사용하려면 [Kotlin Multiplatform Gradle 플러그인 및 Gradle Java 플러그인과의 호환성 사용 중단](multiplatform-compatibility-guide.md#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)을 참조하세요.

Kotlin 2.1.20 및 Gradle 버전 8.7보다 높은 버전에서 [Java test fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 플러그인을 사용하는 경우, 해당 플러그인은 작동하지 않습니다. 대신, 이 문제가 해결된 [Kotlin 2.1.21](https://kotlinlang.org/docs/releases.html#release-details)로 업그레이드하세요.

문제가 발생하면 [이슈 트래커](https://kotl.in/issue)에 보고하거나 [공개 Slack 채널](https://kotlinlang.slack.com/archives/C19FD9681)에서 도움을 요청하세요.

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   Gradle >8.6: `withJava()` 함수를 사용하는 멀티플랫폼 프로젝트에서 이전 버전의 Kotlin에 대한 사용 중단 경고가 도입됩니다.
*   Gradle 9.0: 이 경고가 오류로 상향됩니다.
*   2.1.20: 어떤 Gradle 버전에서든 `withJava()` 함수 사용 시 사용 중단 경고가 도입됩니다.

### 여러 유사 타겟 선언

**무엇이 변경되었나요?**

단일 Gradle 프로젝트에서 여러 유사한 타겟을 선언하는 것은 권장되지 않습니다. 예를 들면:

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 권장되지 않으며 사용 중단 경고를 발생시킵니다.
}
```

한 가지 일반적인 경우는 두 개의 관련 코드를 함께 사용하는 것입니다. 예를 들어, `:shared` Gradle 프로젝트에서 `jvm("jvmKtor")` 및 `jvm("jvmOkHttp")`를 사용하여 Ktor 또는 OkHttp 라이브러리를 통해 네트워킹을 구현할 수 있습니다:

```kotlin
// shared/build.gradle.kts:
kotlin {
    jvm("jvmKtor") {
        attributes.attribute(/* ... */)
    }
    jvm("jvmOkHttp") {
        attributes.attribute(/* ... */)
    }

    sourceSets {
        val commonMain by getting
        val commonJvmMain by sourceSets.creating {
            dependsOn(commonMain)
            dependencies {
                // Shared dependencies
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor dependencies
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp dependencies
            }
        }
    }
}
```

이 구현은 간단하지 않은 구성 복잡성을 수반합니다:

*   `:shared` 측과 각 소비자 측에 Gradle 속성을 설정해야 합니다. 그렇지 않으면 추가 정보 없이는 소비자가 Ktor 기반 구현을 받아야 하는지 OkHttp 기반 구현을 받아야 하는지 명확하지 않기 때문에 Gradle이 이러한 프로젝트에서 종속성을 해결할 수 없습니다.
*   `commonJvmMain` 소스 세트를 수동으로 설정해야 합니다.
*   이 구성은 여러 저수준 Gradle 및 Kotlin Gradle 플러그인 추상화 및 API를 포함합니다.

**현재의 모범 사례는 무엇인가요?**

Ktor 기반 및 OkHttp 기반 구현이 _동일한 Gradle 프로젝트_에 있기 때문에 구성이 복잡합니다. 많은 경우, 해당 부분을 별도의 Gradle 프로젝트로 추출하는 것이 가능합니다.
다음은 이러한 리팩토링의 일반적인 개요입니다:

1.  원본 프로젝트에서 중복된 두 타겟을 단일 타겟으로 교체합니다. 이 타겟들 사이에 공유 소스 세트가 있었다면, 해당 소스와 구성을 새로 생성된 타겟의 기본 소스 세트로 이동합니다:

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // 여기에 jvmCommonMain의 구성을 복사
            }
        }
    }
    ```

2.  새로운 Gradle 프로젝트 두 개를 추가합니다. 일반적으로 `settings.gradle.kts` 파일에서 `include`를 호출하여 추가합니다. 예를 들면:

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3.  각 새 Gradle 프로젝트를 구성합니다:

    *   대부분의 경우, 이 프로젝트들은 하나의 타겟으로만 컴파일되므로 `kotlin("multiplatform")` 플러그인을 적용할 필요가 없습니다. 이 예시에서는 `kotlin("jvm")`을 적용할 수 있습니다.
    *   원본 타겟별 소스 세트의 내용을 해당 프로젝트로 이동합니다. 예를 들어, `jvmKtorMain`에서 `ktor-impl/src`로.
    *   소스 세트의 구성(종속성, 컴파일러 옵션 등)을 복사합니다.
    *   새 Gradle 프로젝트에서 원본 프로젝트로의 종속성을 추가합니다.

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 원본 프로젝트에 대한 종속성 추가
        // 여기에 jvmKtorMain의 종속성 복사
    }
    
    kotlin {
        compilerOptions {
            // 여기에 jvmKtorMain의 컴파일러 옵션 복사
        }
    }
    ```

이 접근 방식은 초기 설정에 더 많은 작업이 필요하지만, Gradle 및 Kotlin Gradle 플러그인의 저수준 엔티티를 사용하지 않아 결과 빌드를 사용하고 유지 관리하기가 더 쉽습니다.

> 안타깝게도 각 경우에 대한 자세한 마이그레이션 단계를 제공할 수는 없습니다. 위 지침이 작동하지 않는 경우, 이 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-59316)에 사용 사례를 설명해 주세요.
>
{style="tip"}

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   1.9.20: Kotlin Multiplatform 프로젝트에서 여러 유사한 타겟을 사용할 때 사용 중단 경고가 도입됩니다.
*   2.1.0: Kotlin/JS 타겟을 제외한 경우, 이러한 경우에 오류를 보고합니다. 이 예외에 대한 자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)의 이슈를 참조하세요.

### 레거시 모드로 게시된 멀티플랫폼 라이브러리 지원 중단

**무엇이 변경되었나요?**

이전에 Kotlin Multiplatform 프로젝트에서 [레거시 모드를 사용 중단](#deprecated-gradle-properties-for-hierarchical-structure-support)하여 "레거시" 바이너리 게시를 막고 프로젝트를 [계층 구조](multiplatform-hierarchy.md)로 마이그레이션하도록 권장했습니다.

생태계에서 "레거시" 바이너리를 단계적으로 제거하기 위해 Kotlin 1.9.0부터 레거시 라이브러리 사용 또한 권장되지 않습니다. 프로젝트가 레거시 라이브러리에 종속성을 사용하는 경우 다음과 같은 경고가 표시됩니다:

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**현재의 모범 사례는 무엇인가요?**

_멀티플랫폼 라이브러리를 사용하는 경우_, 대부분의 라이브러리는 이미 "계층 구조" 모드로 마이그레이션되었으므로 라이브러리 버전을 업데이트하기만 하면 됩니다. 자세한 내용은 해당 라이브러리의 문서를 참조하세요.

라이브러리가 아직 비-레거시 바이너리를 지원하지 않는 경우, 유지 관리자에게 연락하여 이 호환성 문제에 대해 알릴 수 있습니다.

_라이브러리 작성자라면_, Kotlin Gradle 플러그인을 최신 버전으로 업데이트하고 [사용 중단된 Gradle 속성](#deprecated-gradle-properties-for-hierarchical-structure-support)을 수정했는지 확인하세요.

Kotlin 팀은 생태계 마이그레이션을 돕기 위해 열심이므로, 문제가 발생하는 경우 주저하지 말고 [YouTrack에 이슈를 생성](https://kotl.in/issue)하세요.

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   1.9.0: 레거시 라이브러리에 대한 종속성에 사용 중단 경고가 도입됩니다.
*   2.0.0: 레거시 라이브러리에 대한 종속성에 대한 경고가 오류로 상향됩니다.
*   >2.0.0: 레거시 라이브러리에 대한 종속성 지원이 제거됩니다. 이러한 종속성을 사용하면 빌드 실패가 발생할 수 있습니다.

### 계층 구조 지원을 위한 Gradle 속성 사용 중단

**무엇이 변경되었나요?**

Kotlin은 진화 과정에서 멀티플랫폼 프로젝트의 [계층 구조](multiplatform-hierarchy.md) 지원을 점진적으로 도입했습니다. 이는 `commonMain`과 `jvmMain`과 같은 플랫폼별 소스 세트 사이에 중간 소스 세트를 가질 수 있는 기능입니다.

전환 기간 동안, 도구 체인이 충분히 안정적이지 않았을 때, 세분화된 옵트인 및 옵트아웃을 허용하는 몇 가지 Gradle 속성이 도입되었습니다.

Kotlin 1.6.20부터 계층적 프로젝트 구조 지원이 기본적으로 활성화되었습니다. 그러나 차단 문제가 발생할 경우 옵트아웃을 위해 이러한 속성들이 유지되었습니다. 모든 피드백을 처리한 후, 이제 해당 속성들을 완전히 단계적으로 제거하기 시작했습니다.

다음 속성들은 이제 사용 중단되었습니다:

*   `kotlin.internal.mpp.hierarchicalStructureByDefault`
*   `kotlin.mpp.enableCompatibilityMetadataVariant`
*   `kotlin.mpp.hierarchicalStructureSupport`
*   `kotlin.mpp.enableGranularSourceSetsMetadata`
*   `kotlin.native.enableDependencyPropagation`

**현재의 모범 사례는 무엇인가요?**

*   `gradle.properties` 및 `local.properties` 파일에서 이러한 속성을 제거하세요.
*   Gradle 빌드 스크립트 또는 Gradle 플러그인에서 이러한 속성을 프로그래밍 방식으로 설정하지 마세요.
*   빌드에서 사용되는 서드 파티 Gradle 플러그인이 사용 중단된 속성을 설정하는 경우, 플러그인 유지 관리자에게 이러한 속성을 설정하지 않도록 요청하세요.

Kotlin 1.6.20부터 Kotlin 도구 체인의 기본 동작에 이러한 속성이 포함되지 않으므로, 심각한 영향은 없을 것으로 예상됩니다. 대부분의 결과는 프로젝트를 다시 빌드한 직후에 나타날 것입니다.

라이브러리 작성자이고 추가적인 안전을 기하고 싶다면, 소비자가 라이브러리와 함께 작업할 수 있는지 확인하세요.

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   1.8.20: 사용 중단된 Gradle 속성 사용 시 경고를 보고합니다.
*   1.9.20: 이 경고가 오류로 상향됩니다.
*   2.0.0: 사용 중단된 속성이 제거됩니다. Kotlin Gradle 플러그인은 해당 사용을 무시합니다.

이러한 속성을 제거한 후 예기치 않은 문제가 발생할 경우, [YouTrack에 이슈를 생성](https://kotl.in/issue)하세요.

### 타겟 프리셋(Presets) API 사용 중단

**무엇이 변경되었나요?**

초기 개발 단계에서 Kotlin Multiplatform은 소위 _타겟 프리셋_과 함께 작동하는 API를 도입했습니다. 각 타겟 프리셋은 본질적으로 Kotlin Multiplatform 타겟을 위한 팩토리를 나타냈습니다. 이 API는 `jvm()` 또는 `iosSimulatorArm64()`와 같은 DSL 함수가 훨씬 더 간단하고 간결하게 동일한 사용 사례를 다루기 때문에 대체로 불필요한 것으로 판명되었습니다.

혼란을 줄이고 더 명확한 지침을 제공하기 위해, 모든 프리셋 관련 API가 Kotlin Gradle 플러그인의 공개 API에서 사용 중단되었습니다. 여기에는 다음이 포함됩니다:

*   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension`의 `presets` 속성
*   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 인터페이스 및 모든 상속자
*   `fromPreset` 오버로드

**현재의 모범 사례는 무엇인가요?**

대신 해당 [Kotlin 타겟](multiplatform-dsl-reference.md#targets)을 사용하세요. 예를 들면:

<table>
    
<tr>
<td>이전</td>
        <td>현재</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        fromPreset(presets.iosArm64, 'ios')&#10;    }&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    iosArm64()&#10;}"/>
</td>
</tr>

</table>

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   1.9.20: 프리셋 관련 API 사용 시 경고를 보고합니다.
*   2.0.0: 이 경고가 오류로 상향됩니다.
*   2.2.0: Kotlin Gradle 플러그인의 공개 API에서 프리셋 관련 API가 제거됩니다. 여전히 이를 사용하는 소스는 "unresolved reference" 오류로 실패하고, 바이너리(예: Gradle 플러그인)는 최신 버전의 Kotlin Gradle 플러그인을 대상으로 다시 컴파일되지 않으면 연결(linkage) 오류로 실패할 수 있습니다.

### 사용 중단된 Apple 타겟 단축키

**무엇이 변경되었나요?**

Kotlin Multiplatform DSL에서 `ios()`, `watchos()`, `tvos()` 타겟 단축키가 사용 중단됩니다. 이 단축키는 Apple 타겟에 대한 소스 세트 계층 구조를 부분적으로 생성하도록 설계되었습니다. 그러나 확장하기 어렵고 때로는 혼란스러움을 유발하는 것으로 드러났습니다.

예를 들어, `ios()` 단축키는 `iosArm64` 및 `iosX64` 타겟을 모두 생성했지만, Apple M 칩을 사용하는 호스트에서 작업할 때 필요한 `iosSimulatorArm64` 타겟은 포함하지 않았습니다. 그러나 이 단축키를 변경하는 것은 구현하기 어려웠고 기존 사용자 프로젝트에 문제를 일으킬 수 있었습니다.

**현재의 모범 사례는 무엇인가요?**

Kotlin Gradle 플러그인은 이제 내장된 계층 구조 템플릿을 제공합니다. Kotlin 1.9.20부터 기본적으로 활성화되어 있으며, 일반적인 사용 사례를 위한 사전 정의된 중간 소스 세트를 포함합니다.

단축키 대신 타겟 목록을 지정해야 하며, 그러면 플러그인이 이 목록을 기반으로 중간 소스 세트를 자동으로 설정합니다.

예를 들어, 프로젝트에 `iosArm64` 및 `iosSimulatorArm64` 타겟이 있는 경우, 플러그인은 `iosMain` 및 `iosTest` 중간 소스 세트를 자동으로 생성합니다. `iosArm64` 및 `macosArm64` 타겟이 있는 경우, `appleMain` 및 `appleTest` 소스 세트가 생성됩니다.

자세한 내용은 [계층적 프로젝트 구조](multiplatform-hierarchy.md)를 참조하세요.

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   1.9.20: `ios()`, `watchos()`, `tvos()` 타겟 단축키 사용 시 경고를 보고합니다. 대신 기본적으로 기본 계층 구조 템플릿이 활성화됩니다.
*   2.1.0: 타겟 단축키 사용 시 오류를 보고합니다.
*   2.2.0: Kotlin Multiplatform Gradle 플러그인에서 타겟 단축키 DSL이 제거됩니다.

### Kotlin 업그레이드 후 iOS 프레임워크 버전이 잘못된 문제

**무엇이 문제인가요?**

직접 통합을 사용하는 경우 Xcode에서 iOS 앱에 Kotlin 코드 변경 사항이 반영되지 않을 수 있습니다. 직접 통합은 `embedAndSignAppleFrameworkForXcode` 작업을 통해 설정되며, 이는 멀티플랫폼 프로젝트의 iOS 프레임워크를 Xcode의 iOS 앱에 연결합니다.

이는 Kotlin 버전을 1.9.2x에서 2.0.0으로(또는 2.0.0에서 1.9.2x로 다운그레이드) 업그레이드한 후 Kotlin 파일을 변경하고 앱을 빌드하려고 할 때 Xcode가 이전 버전의 iOS 프레임워크를 잘못 사용할 수 있기 때문에 발생할 수 있습니다. 따라서 변경 사항이 Xcode의 iOS 앱에 표시되지 않습니다.

**해결 방법은 무엇인가요?**

1.  Xcode에서 **Product** | **Clean Build Folder**를 사용하여 빌드 디렉토리를 정리합니다.
2.  터미널에서 다음 명령어를 실행합니다:

    ```none
    ./gradlew clean
    ```

3.  새 버전의 iOS 프레임워크가 사용되는지 확인하기 위해 앱을 다시 빌드합니다.

**언제 문제가 해결될까요?**

이 문제는 Kotlin 2.0.10에서 해결될 예정입니다. Kotlin 2.0.10의 미리 보기 버전이 [Kotlin Early Access Preview 참여](https://kotlinlang.org/docs/eap.html) 섹션에서 이미 사용 가능한지 확인할 수 있습니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-68257)를 참조하세요.

## Kotlin 1.9.0−1.9.25

이 섹션에서는 사용 중단 주기가 끝나고 Kotlin 1.9.0−1.9.25에 적용되는 호환되지 않는 변경 사항에 대해 다룹니다.

### Kotlin 컴파일에 Kotlin 소스 세트를 직접 추가하기 위한 API 제거 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

`KotlinCompilation.source`에 대한 접근이 제거되었습니다. 다음 코드와 같은 코드는 더 이상 지원되지 않습니다:

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()
    
    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        targets["jvm"].compilations["main"].source(myCustomIntermediateSourceSet)
    }
}
```

**현재의 모범 사례는 무엇인가요?**

`KotlinCompilation.source(someSourceSet)`를 대체하려면, `.srcDir()` 함수를 사용하여 해당 소스를 적절한 소스 세트에 직접 추가하세요. 또는 `KotlinCompilation`의 기본 소스 세트에서 `someSourceSet`으로 `dependsOn` 관계를 추가하여 새 소스 세트를 생성할 수 있습니다. IDE 친화적이며 가장 강력한 접근 방식으로 간주되는 [소스 세트 컨벤션](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl/-kotlin-multiplatform-source-set-conventions/)을 사용하여 소스를 직접 참조할 수도 있습니다. 마지막으로, 모든 경우에 작동하는 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`를 사용할 수 있습니다.

위 코드를 다음 방법 중 하나로 변경할 수 있습니다:

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val myCustomIntermediateSourceSet by creating {
            // commonMain 소스 세트는 .get() 함수를 사용하여 접근해야 합니다.
            dependsOn(commonMain.get())
        }

        // 옵션 #1. 소스를 해당 소스 세트에 직접 추가합니다:
        commonMain {
            kotlin.srcDir(layout.projectDirectory.dir("src/commonMain/my-custom-kotlin"))
        }

        // 옵션 #2. Kotlin Multiplatform 타겟의 기본 main 및 test 소스 세트에 제공되는 컨벤션을 사용합니다:
        jvmMain {
            dependsOn(myCustomIntermediateSourceSet)
        }

        // 옵션 #3. 더 일반적인 솔루션입니다. 빌드 스크립트가 더 고급 접근 방식을 필요로 하는 경우 사용하세요:
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   1.9.0: `KotlinCompilation.source` 사용 시 사용 중단 경고가 도입됩니다.
*   1.9.20: 이 경고가 오류로 상향됩니다.
*   2.3.0: Kotlin Gradle 플러그인에서 `KotlinCompilation.source`가 제거되며, 사용 시도 시 빌드 스크립트 컴파일 중 "unresolved reference" 오류가 발생합니다.

### `kotlin-js` Gradle 플러그인에서 `kotlin-multiplatform` Gradle 플러그인으로 마이그레이션 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Kotlin 1.9.0부터 `kotlin-js` Gradle 플러그인은 사용 중단되었습니다. 기본적으로 이 플러그인은 `js()` 타겟을 가진 `kotlin-multiplatform` 플러그인의 기능을 복제했으며, 내부적으로 동일한 구현을 공유했습니다. 이러한 중복은 혼란을 야기하고 Kotlin 팀의 유지 보수 부담을 증가시켰습니다. 대신 `js()` 타겟과 함께 `kotlin-multiplatform` Gradle 플러그인으로 마이그레이션하는 것을 권장합니다.

**현재의 모범 사례는 무엇인가요?**

1.  프로젝트에서 `kotlin-js` Gradle 플러그인을 제거하고 `pluginManagement {}` 블록을 사용하는 경우 `settings.gradle.kts` 파일에 `kotlin-multiplatform`을 적용합니다:

    <Tabs>
    <TabItem title="kotlin-js">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 다음 줄을 제거합니다:
            kotlin("js") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </TabItem>
    <TabItem title="kotlin-multiplatform">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 대신 다음 줄을 추가합니다:
            kotlin("multiplatform") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </TabItem>
    </Tabs>

    다른 플러그인 적용 방식을 사용하는 경우, 마이그레이션 지침은 [Gradle 문서](https://docs.gradle.org/current/userguide/plugins.html)를 참조하세요.

2.  소스 파일을 `main` 및 `test` 폴더에서 동일한 디렉토리의 `jsMain` 및 `jsTest` 폴더로 이동합니다.
3.  종속성 선언을 조정합니다:

    *   `sourceSets {}` 블록을 사용하고 해당 소스 세트의 종속성을 구성하는 것을 권장합니다. 프로덕션 종속성의 경우 `jsMain {}`, 테스트 종속성의 경우 `jsTest {}`를 사용합니다.
        자세한 내용은 [종속성 추가](multiplatform-add-dependencies.md)를 참조하세요.
    *   그러나 최상위 블록에서 종속성을 선언하려면 `api("group:artifact:1.0")`에서 `add("jsMainApi", "group:artifact:1.0")` 등으로 선언을 변경합니다.

        > 이 경우, 최상위 `dependencies {}` 블록이 `kotlin {}` 블록 **뒤에** 오는지 확인하세요. 그렇지 않으면 "Configuration not found" 오류가 발생합니다.
        >
        {style="note"}

    `build.gradle.kts` 파일의 코드를 다음 방법 중 하나로 변경할 수 있습니다:

    <Tabs>
    <TabItem title="kotlin-js">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("js") version "1.9.0"
    }
    
    dependencies {
        testImplementation(kotlin("test"))
        implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
    }
    
    kotlin {
        js {
            // ...
        }
    }
    ```

    </TabItem>
    <TabItem title="kotlin-multiplatform">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("multiplatform") version "1.9.0"
    }
    
    kotlin {
        js {
            // ...
        }
        
        // 옵션 #1. sourceSets {} 블록에서 종속성을 선언합니다:
        sourceSets {
            val jsMain by getting {
                dependencies {
                    // 여기에 js 접두사가 필요 없습니다. 최상위 블록에서 복사하여 붙여넣을 수 있습니다.
                    implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
                }
           }
        }
    }
    
    dependencies {
        // 옵션 #2. 종속성 선언에 js 접두사를 추가합니다:
        add("jsTestImplementation", kotlin("test"))
    }
    ```

    </TabItem>
    </Tabs>

4.  `kotlin {}` 블록 내에서 Kotlin Gradle 플러그인이 제공하는 DSL은 대부분의 경우 변경되지 않습니다. 그러나 태스크 및 구성과 같은 저수준 Gradle 엔티티를 이름으로 참조했다면 이제 일반적으로 `js` 접두사를 추가하여 조정해야 합니다. 예를 들어, `browserTest` 태스크는 `jsBrowserTest`라는 이름으로 찾을 수 있습니다.

**언제부터 변경 사항이 적용되나요?**

1.9.0에서는 `kotlin-js` Gradle 플러그인을 사용하면 사용 중단 경고가 발생합니다.

### `jvmWithJava` 프리셋 사용 중단 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

`targetPresets.jvmWithJava`가 사용 중단되었으며 사용이 권장되지 않습니다.

**현재의 모범 사례는 무엇인가요?**

대신 `jvm { withJava() }` 타겟을 사용하세요. `jvm { withJava() }`로 전환한 후에는 `.java` 소스가 있는 소스 디렉토리의 경로를 조정해야 합니다.

예를 들어, 기본 이름 "jvm"을 가진 `jvm` 타겟을 사용하는 경우:

| 이전 | 현재 |
|---|---|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   1.3.40: `targetPresets.jvmWithJava` 사용 시 경고가 도입됩니다.
*   1.9.20: 이 경고가 오류로 상향됩니다.
*   >1.9.20: `targetPresets.jvmWithJava` API가 제거됩니다. 사용 시도 시 빌드 스크립트 컴파일 실패로 이어집니다.

> 전체 `targetPresets` API가 사용 중단되었지만, `jvmWithJava` 프리셋은 사용 중단 타임라인이 다릅니다.
>
{style="note"}

### 레거시 Android 소스 세트 레이아웃 사용 중단 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

[새로운 Android 소스 세트 레이아웃](multiplatform-android-layout.md)은 Kotlin 1.9.0부터 기본적으로 사용됩니다.
레거시 레이아웃 지원은 사용 중단되었으며, `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 속성 사용 시 사용 중단 진단이 트리거됩니다.

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   <=1.9.0: `kotlin.mpp.androidSourceSetLayoutVersion=1` 사용 시 경고를 보고합니다. 이 경고는 `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 속성으로 억제할 수 있습니다.
*   1.9.20: 이 경고가 오류로 상향됩니다. 이 오류는 **억제할 수 없습니다**.
*   >1.9.20: `kotlin.mpp.androidSourceSetLayoutVersion=1` 지원이 제거됩니다. Kotlin Gradle 플러그인은 이 속성을 무시합니다.

### 사용자 정의 `dependsOn`을 가진 `commonMain` 및 `commonTest` 사용 중단 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

`commonMain` 및 `commonTest` 소스 세트는 일반적으로 각각 `main` 및 `test` 소스 세트 계층 구조의 루트를 나타냅니다. 그러나 이러한 소스 세트의 `dependsOn` 관계를 수동으로 구성하여 이를 재정의할 수 있었습니다.

이러한 구성을 유지하려면 멀티플랫폼 빌드 내부에 대한 추가적인 노력과 지식이 필요합니다. 또한, `commonMain`이 `main` 소스 세트 계층 구조의 루트인지 확실히 하려면 특정 빌드 스크립트를 읽어야 하므로 코드 가독성과 재사용성이 떨어집니다.

따라서 `dependsOn`을 `commonMain` 및 `commonTest`에서 접근하는 것은 이제 사용 중단되었습니다.

**현재의 모범 사례는 무엇인가요?**

`commonMain.dependsOn(customCommonMain)`을 사용하는 `customCommonMain` 소스 세트를 1.9.20으로 마이그레이션해야 한다고 가정해 봅시다. 대부분의 경우 `customCommonMain`은 `commonMain`과 동일한 컴파일에 참여하므로 `customCommonMain`을 `commonMain`으로 병합할 수 있습니다:

1.  `customCommonMain`의 소스를 `commonMain`으로 복사합니다.
2.  `customCommonMain`의 모든 종속성을 `commonMain`에 추가합니다.
3.  `customCommonMain`의 모든 컴파일러 옵션 설정을 `commonMain`에 추가합니다.

드문 경우지만, `customCommonMain`이 `commonMain`보다 더 많은 컴파일에 참여할 수 있습니다.
이러한 구성은 빌드 스크립트에 대한 추가적인 저수준 구성이 필요합니다. 이것이 귀하의 사용 사례인지 확실하지 않다면, 대부분의 경우 그렇지 않을 것입니다.

이것이 귀하의 사용 사례라면, `customCommonMain`의 소스와 설정을 `commonMain`으로 이동하고 그 반대로 하여 두 소스 세트를 "교체"합니다.

**언제부터 변경 사항이 적용되나요?**

다음은 계획된 사용 중단 주기입니다:

*   1.9.0: `commonMain`에서 `dependsOn` 사용 시 경고를 보고합니다.
*   >=1.9.20: `commonMain` 또는 `commonTest`에서 `dependsOn` 사용 시 오류를 보고합니다.

### 전방 선언에 대한 새로운 접근 방식 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

JetBrains 팀은 예측 가능한 동작을 위해 Kotlin의 전방 선언(forward declarations) 접근 방식을 개선했습니다:

*   `cnames` 또는 `objcnames` 패키지를 사용해서만 전방 선언을 임포트할 수 있습니다.
*   해당 C 및 Objective-C 전방 선언으로의 명시적 캐스팅이 필요합니다.

**현재의 모범 사례는 무엇인가요?**

*   `library.package`에 `cstructName` 전방 선언을 하는 C 라이브러리를 고려해 봅시다.
    이전에는 `import library.package.cstructName`을 사용하여 라이브러리에서 직접 임포트하는 것이 가능했습니다.
    이제는 이를 위해 특수 전방 선언 패키지만 사용할 수 있습니다: `import cnames.structs.cstructName`.
    `objcnames`도 마찬가지입니다.

*   `objcnames.protocols.ForwardDeclaredProtocolProtocol`을 사용하는 objcinterop 라이브러리와 실제 정의를 가진 다른 라이브러리 두 개를 고려해 봅시다:

    ```ObjC
    // First objcinterop library
    #import <Foundation/Foundation.h>
    
    @protocol ForwardDeclaredProtocol;
    
    NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
        return [NSString stringWithUTF8String:"Protocol"];
    }
    ```

    ```ObjC
    // Second objcinterop library
    // Header:
    #import <Foundation/Foundation.h>
    @protocol ForwardDeclaredProtocol
    @end
    // Implementation:
    @interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
    @end

    id<ForwardDeclaredProtocol> produceProtocol() {
        return [ForwardDeclaredProtocolImpl new];
    }
    ```

    이전에는 객체들을 끊김 없이 전달하는 것이 가능했습니다. 이제 전방 선언에 대해 명시적인 `as` 캐스트가 필요합니다:

    ```kotlin
    // Kotlin code:
    fun test() {
        consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
    }
    ```

    > `objcnames.protocols.ForwardDeclaredProtocolProtocol`로의 캐스트는 해당 실제 클래스로부터만 가능합니다.
    > 그렇지 않으면 오류가 발생합니다.
    >
    {style="note"}

**언제부터 변경 사항이 적용되나요?**

Kotlin 1.9.20부터 해당 C 및 Objective-C 전방 선언으로의 명시적 캐스팅이 필요합니다. 또한, 이제 특수 패키지를 사용해서만 전방 선언을 임포트하는 것이 가능합니다.

## Kotlin 1.7.0−1.8.22

이 섹션에서는 사용 중단 주기가 끝나고 Kotlin 1.7.0−1.8.22에 적용되는 호환되지 않는 변경 사항에 대해 다룹니다.

### Kotlin Multiplatform Gradle 플러그인 및 Gradle Java 플러그인과의 호환성 사용 중단 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Kotlin Multiplatform Gradle 플러그인과 Gradle 플러그인인 [Java](https://docs.gradle.org/current/userguide/java_plugin.html), [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html), [Application](https://docs.gradle.org/current/userguide/application_plugin.html) 사이의 호환성 문제로 인해, 이제 이 플러그인들을 동일한 프로젝트에 적용할 때 사용 중단 경고가 발생합니다. 이 경고는 멀티플랫폼 프로젝트의 다른 Gradle 플러그인이 Gradle Java 플러그인을 적용할 때도 나타납니다. 예를 들어, [Spring Boot Gradle 플러그인](https://docs.spring.io/spring-boot/gradle-plugin/index.html)은 자동으로 Application 플러그인을 적용합니다.

Kotlin Multiplatform의 프로젝트 모델과 Gradle의 Java 생태계 플러그인 간의 근본적인 호환성 문제로 인해 이 사용 중단 경고가 추가되었습니다. Gradle의 Java 생태계 플러그인은 현재 다른 플러그인이 다음을 수행할 수 있다는 점을 고려하지 않습니다:

*   Java 생태계 플러그인과 다른 방식으로 JVM 타겟을 게시하거나 컴파일합니다.
*   JVM 및 Android와 같이 동일한 프로젝트에 두 개의 다른 JVM 타겟을 가집니다.
*   잠재적으로 여러 비-JVM 타겟을 포함하는 복잡한 멀티플랫폼 프로젝트 구조를 가집니다.

안타깝게도 Gradle은 현재 이러한 문제를 해결하기 위한 API를 제공하지 않습니다.

이전에 Kotlin Multiplatform에서는 Java 생태계 플러그인 통합을 돕기 위해 일부 해결 방법을 사용했습니다. 그러나 이러한 해결 방법은 호환성 문제를 진정으로 해결한 적이 없으며, Gradle 8.8 출시 이후에는 이러한 해결 방법이 더 이상 불가능합니다. 자세한 내용은 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)를 참조하세요.

이 호환성 문제를 정확히 어떻게 해결해야 할지는 아직 알 수 없지만, Kotlin Multiplatform 프로젝트에서 Java 소스 컴파일의 일부 형태를 계속 지원하기 위해 노력하고 있습니다. 최소한, 멀티플랫폼 프로젝트 내에서 Java 소스 컴파일 및 Gradle의 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 플러그인 사용을 지원할 것입니다.

**현재의 모범 사례는 무엇인가요?**

멀티플랫폼 프로젝트에서 이 사용 중단 경고가 표시되면 다음을 권장합니다:
1.  프로젝트에 Gradle Java 플러그인이 실제로 필요한지 결정합니다. 필요하지 않다면 제거를 고려합니다.
2.  Gradle Java 플러그인이 단일 작업에만 사용되는지 확인합니다. 그렇다면 큰 노력 없이 플러그인을 제거할 수 있습니다. 예를 들어, 작업이 Javadoc JAR 파일을 생성하기 위해 Gradle Java 플러그인을 사용하는 경우, Javadoc 작업을 수동으로 정의할 수 있습니다.

그렇지 않고 멀티플랫폼 프로젝트에서 Kotlin Multiplatform Gradle 플러그인과 Gradle Java 플러그인을 모두 사용하려면 다음을 권장합니다:

1.  Gradle 프로젝트에 별도의 서브프로젝트를 생성합니다.
2.  별도의 서브프로젝트에 Gradle Java 플러그인을 적용합니다.
3.  별도의 서브프로젝트에 상위 멀티플랫폼 프로젝트에 대한 종속성을 추가합니다.

> 별도의 서브프로젝트는 멀티플랫폼 프로젝트가 **아니어야** 하며, 멀티플랫폼 프로젝트에 대한 종속성을 설정하는 데만 사용해야 합니다.
>
{style="warning"}

예를 들어, `my-main-project`라는 멀티플랫폼 프로젝트가 있고 [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) Gradle 플러그인을 사용하고 싶다고 가정해 봅시다.

`subproject-A`라는 서브프로젝트를 생성하면 상위 프로젝트 구조는 다음과 같아야 합니다:

```text
.
├── build.gradle
├── settings.gradle.kts
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

서브프로젝트의 `build.gradle.kts` 파일에서 `plugins {}` 블록에 Java Library 플러그인을 적용합니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</TabItem>
</Tabs>

서브프로젝트의 `build.gradle.kts` 파일에서 상위 멀티플랫폼 프로젝트에 대한 종속성을 추가합니다:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 상위 멀티플랫폼 프로젝트의 이름
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 상위 멀티플랫폼 프로젝트의 이름
}
```

</TabItem>
</Tabs>

이제 상위 프로젝트는 두 플러그인과 모두 작동하도록 설정되었습니다.

### 자동 생성된 타겟에 대한 새로운 접근 방식 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Gradle에 의해 자동 생성된 타겟 접근자는 더 이상 `kotlin.targets {}` 블록 내에서 사용할 수 없습니다. 대신 `findByName("targetName")` 메서드를 사용하세요.

이러한 접근자는 `kotlin.targets {}`의 경우, 예를 들어 `kotlin.targets.linuxX64`와 같이 여전히 사용할 수 있습니다.

**현재의 모범 사례는 무엇인가요?**

<table>
    
<tr>
<td>이전</td>
        <td>현재</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        configure(['windows',&#10;            'linux']) {&#10;        }&#10;    }&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        configure([findByName('windows'),&#10;            findByName('linux')]) {&#10;        }&#10;    }&#10;}"/>
</td>
</tr>

</table>

**언제부터 변경 사항이 적용되나요?**

Kotlin 1.7.20에서는 `kotlin.targets {}` 블록에서 타겟 접근자를 사용할 때 오류가 도입됩니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-47047)를 참조하세요.

### Gradle 입력 및 출력 컴파일 작업의 변경 사항 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Kotlin 컴파일 작업은 더 이상 `sourceCompatibility` 및 `targetCompatibility` 입력을 가진 Gradle `AbstractCompile` 작업을 상속하지 않으므로 Kotlin 사용자 스크립트에서는 사용할 수 없습니다.

컴파일 작업의 다른 주요 변경 사항:

**현재의 모범 사례는 무엇인가요?**

| 이전 | 현재 |
|---|---|
| `SourceTask.stableSources` 입력은 더 이상 사용할 수 없습니다. | 대신 `sources` 입력을 사용하세요. 또한 `setSource()` 메서드는 여전히 사용할 수 있습니다. |
| `sourceFilesExtensions` 입력이 제거되었습니다. | 컴파일 작업은 여전히 `PatternFilterable` 인터페이스를 구현합니다. Kotlin 소스를 필터링하려면 해당 메서드를 사용하세요. |
| `Gradle destinationDir: File` 출력이 사용 중단되었습니다. | 대신 `destinationDirectory: DirectoryProperty` 출력을 사용하세요. |
| `classpath` 속성이 `KotlinCompile` 작업에서 사용 중단되었습니다. | 모든 컴파일 작업은 이제 컴파일에 필요한 라이브러리 목록에 `libraries` 입력을 사용합니다. |

**언제부터 변경 사항이 적용되나요?**

Kotlin 1.7.20에서는 입력이 사용할 수 없게 되고, 출력이 대체되며, `classpath` 속성이 사용 중단됩니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-32805)를 참조하세요.

### 컴파일에 대한 종속성 새 구성 이름 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Kotlin Multiplatform Gradle 플러그인에 의해 생성된 컴파일 구성에 새로운 이름이 부여되었습니다.

Kotlin Multiplatform 프로젝트의 타겟에는 `main`과 `test`라는 두 가지 기본 컴파일이 있습니다. 이러한 각 컴파일에는 `jvmMain`과 `jvmTest`와 같은 자체 기본 소스 세트가 있습니다. 이전에는 테스트 컴파일과 해당 기본 소스 세트의 구성 이름이 동일하여 이름 충돌을 일으킬 수 있었고, 이는 플랫폼별 속성으로 표시된 구성이 다른 구성에 포함될 때 문제를 유발했습니다.

이제 컴파일 구성에는 추가 `Compilation` 접미사가 붙습니다. 반면 이전의 하드 코딩된 구성 이름을 사용하는 프로젝트 및 플러그인은 더 이상 컴파일되지 않습니다.

해당 소스 세트에 대한 종속성 구성 이름은 동일하게 유지됩니다.

**현재의 모범 사례는 무엇인가요?**

<table>
    
<tr>
<td></td>
        <td>이전</td>
        <td>현재</td>
</tr>

    
<tr>
<td rowspan="2"><code>jvmMain</code> 컴파일의 종속성</td>
<td>
<code-block lang="kotlin" code="jvm&lt;Scope&gt;"/>
</td>
<td>
<code-block lang="kotlin" code="jvmCompilation&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="dependencies {&#10;    add(&quot;jvmImplementation&quot;,&#10;        &quot;foo.bar.baz:1.2.3&quot;)&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="dependencies {&#10;    add(&quot;jvmCompilationImplementation&quot;,&#10;        &quot;foo.bar.baz:1.2.3&quot;)&#10;}"/>
</td>
</tr>

    
<tr>
<td><code>jvmMain</code> 소스 세트의 종속성</td>
<td colspan="2">
<code-block lang="kotlin" code="jvmMain&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td><code>jvmTest</code> 컴파일의 종속성</td>
<td>
<code-block lang="kotlin" code="jvmTest&lt;Scope&gt;"/>
</td>
<td>
<code-block lang="kotlin" code="jvmTestCompilation&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td><code>jvmTest</code> 소스 세트의 종속성</td>
<td colspan="2">
<code-block lang="kotlin" code="jvmTest&lt;Scope&gt;"/>
</td>
</tr>

</table>

사용 가능한 범위는 `Api`, `Implementation`, `CompileOnly`, `RuntimeOnly`입니다.

**언제부터 변경 사항이 적용되나요?**

Kotlin 1.8.0에서는 하드 코딩된 문자열에서 이전 구성 이름을 사용할 때 오류가 도입됩니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-35916/)를 참조하세요.