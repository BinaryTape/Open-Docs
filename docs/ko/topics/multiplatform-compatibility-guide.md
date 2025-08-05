[//]: # (title: Kotlin Multiplatform 호환성 가이드)

<show-structure depth="1"/>

이 가이드는 Kotlin Multiplatform 프로젝트를 개발하는 동안 발생할 수 있는 [호환되지 않는 변경 사항](https://kotlinlang.org/docs/kotlin-evolution-principles.html#incompatible-changes)을 요약합니다.

Kotlin의 현재 안정화 버전은 %kotlinVersion%입니다. 프로젝트에서 사용하는 Kotlin 버전과 관련하여 특정 변경 사항의 지원 중단 주기를 고려하세요. 예를 들어:

*   Kotlin 1.7.0에서 Kotlin 1.9.0으로 업그레이드할 때, [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25)과 [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22) 모두에서 적용된 호환되지 않는 변경 사항을 확인하세요.
*   Kotlin 1.9.0에서 Kotlin 2.0.0으로 업그레이드할 때, [Kotlin 2.0.0](#kotlin-2-0-0-and-later)과 [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25) 모두에서 적용된 호환되지 않는 변경 사항을 확인하세요.

## 버전 호환성

프로젝트를 구성할 때, 특정 버전의 Kotlin Multiplatform Gradle 플러그인(프로젝트의 Kotlin 버전과 동일)과 Gradle, Xcode, Android Gradle 플러그인 버전의 호환성을 확인하세요:

| Kotlin Multiplatform 플러그인 버전 | Gradle                                | Android Gradle 플러그인                             | Xcode   |
|-------------------------------------|---------------------------------------|-----------------------------------------------------|---------|
| 2.2.0                               | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% | %xcode% |
| 2.1.21                              | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         | 16.3    |
| 2.1.20                              | 7.6.3–8.11                            | 7.4.2–8.7.2                                         | 16.0    |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                                         | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                                           | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                                           | 15.0    |

> *Kotlin 2.0.20–2.0.21 및 Kotlin 2.1.0–2.1.10은 Gradle 8.6까지 완전히 호환됩니다.
> Gradle 버전 8.7–8.10도 지원되지만 한 가지 예외가 있습니다: Kotlin Multiplatform Gradle 플러그인을 사용하는 경우, 멀티플랫폼 프로젝트에서 JVM 타겟의 `withJava()` 함수를 호출할 때 지원 중단 경고가 표시될 수 있습니다.
> 자세한 내용은 [기본적으로 생성되는 Java 소스 세트](#java-source-sets-created-by-default)를 참조하세요.
>
{style="warning"}

## Kotlin 2.0.0 이상

이 섹션에서는 지원 중단 주기가 끝나고 Kotlin 2.0.0−%kotlinVersion%에 적용되는 호환되지 않는 변경 사항을 다룹니다.

### 비트코드 임베딩 지원 중단

**무엇이 변경되었나요?**

비트코드 임베딩은 Xcode 14에서 지원이 중단되었고 Xcode 15에서 모든 Apple 타겟에 대해 제거되었습니다. 그 결과, 프레임워크 구성의 `embedBitcode` 매개변수와 `-Xembed-bitcode`, `-Xembed-bitcode-marker` 명령줄 인수가 Kotlin에서 지원이 중단되었습니다.

**현재 권장되는 방식은 무엇인가요?**

여전히 이전 버전의 Xcode를 사용하지만 Kotlin 2.0.20 이상으로 업그레이드하려는 경우, Xcode 프로젝트에서 비트코드 임베딩을 비활성화하세요.

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   2.0.20: Kotlin/Native 컴파일러가 더 이상 비트코드 임베딩을 지원하지 않습니다
*   2.1.0: Kotlin Multiplatform Gradle 플러그인에서 `embedBitcode` DSL이 경고와 함께 지원 중단됩니다
*   2.2.0: 경고가 오류로 상향됩니다
*   2.3.0: `embedBitcode` DSL이 제거됩니다

<anchor name="java-source-set-created-by-default"/>
### 기본적으로 생성되는 Java 소스 세트

**무엇이 변경되었나요?**

Kotlin Multiplatform을 Gradle의 향후 변경 사항과 맞추기 위해 `withJava()` 함수를 점진적으로 폐지하고 있습니다. `withJava()` 함수는 필요한 Java 소스 세트를 생성하여 Gradle의 Java 플러그인과의 통합을 가능하게 했습니다. Kotlin 2.1.20부터 이러한 Java 소스 세트는 기본적으로 생성됩니다.

**현재 권장되는 방식은 무엇인가요?**

이전에는 `src/jvmMain/java` 및 `src/jvmTest/java` 소스 세트를 생성하기 위해 `withJava()` 함수를 명시적으로 사용해야 했습니다:

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

Kotlin 2.1.20부터 빌드 스크립트에서 `withJava()` 함수를 제거할 수 있습니다.

또한 Gradle은 이제 Java 소스가 있을 경우에만 Java 컴파일 작업을 실행하며, 이전에 실행되지 않았던 JVM 유효성 검사 진단을 트리거합니다. `KotlinJvmCompile` 작업 또는 `compilerOptions` 내에서 호환되지 않는 JVM 타겟을 명시적으로 구성하면 이 진단이 실패합니다. JVM 타겟 호환성을 보장하는 방법에 대한 지침은 [관련 컴파일 작업의 JVM 타겟 호환성 확인](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)을 참조하세요.

프로젝트가 8.7보다 높은 Gradle 버전을 사용하고 [Java](https://docs.gradle.org/current/userguide/java_plugin.html), [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html), [Application](https://docs.gradle.org/current/userguide/application_plugin.html)와 같은 Gradle Java 플러그인에 의존하지 않거나, Gradle Java 플러그인에 종속된 타사 Gradle 플러그인을 사용하는 경우, `withJava()` 함수를 제거할 수 있습니다.

프로젝트가 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java 플러그인을 사용하는 경우, [새로운 실험적 DSL](https://kotlinlang.org/docs/whatsnew2120.html#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)로 마이그레이션하는 것을 권장합니다. Gradle 8.7부터 Application 플러그인은 Kotlin Multiplatform Gradle 플러그인과 더 이상 호환되지 않습니다.

Kotlin Multiplatform Gradle 플러그인과 멀티플랫폼 프로젝트에서 Java용 다른 Gradle 플러그인을 모두 사용하려면 [Kotlin Multiplatform Gradle 플러그인과 Gradle Java 플러그인의 지원 중단된 호환성](multiplatform-compatibility-guide.md#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)을 참조하세요.

Kotlin 2.1.20 및 8.7보다 높은 Gradle 버전에서 [Java test fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 플러그인을 사용하는 경우, 플러그인이 작동하지 않습니다. 대신 이 문제가 해결된 [Kotlin 2.1.21](https://kotlinlang.org/docs/releases.html#release-details)로 업그레이드하세요.

문제가 발생하면 [이슈 트래커](https://kotl.in/issue)에 보고하거나 [공개 Slack 채널](https://kotlinlang.slack.com/archives/C19FD9681)에서 도움을 요청하세요.

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   Gradle >8.6: `withJava()` 함수를 사용하는 멀티플랫폼 프로젝트에서 이전 버전의 Kotlin에 대해 지원 중단 경고를 도입합니다.
*   Gradle 9.0: 이 경고를 오류로 상향합니다.
*   2.1.20: 모든 Gradle 버전에서 `withJava()` 함수를 사용할 때 지원 중단 경고를 도입합니다.

<anchor name="android-target-rename"/>
### `android` 타겟을 `androidTarget`으로 이름 변경

**무엇이 변경되었나요?**

Kotlin Multiplatform을 더욱 안정적으로 만들기 위한 노력을 계속하고 있습니다. 이러한 노력의 중요한 단계는 Android 타겟에 대한 일급 지원을 제공하는 것입니다. 앞으로 이 지원은 Google의 Android 팀이 개발한 별도의 플러그인을 통해 제공될 예정입니다.

새로운 솔루션의 길을 열기 위해 현재 Kotlin DSL에서 `android` 블록의 이름을 `androidTarget`으로 변경하고 있습니다. 이는 Google에서 출시될 DSL을 위해 짧은 `android` 이름을 확보하는 데 필요한 임시 변경입니다.

**현재 권장되는 방식은 무엇인가요?**

`android` 블록의 모든 사용을 `androidTarget`으로 이름을 변경하세요. Android 타겟 지원을 위한 새 플러그인이 제공되면 Google의 DSL로 마이그레이션하세요. 이는 Kotlin Multiplatform 프로젝트에서 Android와 함께 작업하는 데 선호되는 옵션이 될 것입니다.

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.9.0: Kotlin Multiplatform 프로젝트에서 `android` 이름이 사용될 때 지원 중단 경고를 도입합니다.
*   2.1.0: 이 경고를 오류로 상향합니다.
*   2.2.0: Kotlin Multiplatform Gradle 플러그인에서 `android` 타겟 DSL을 제거합니다.

<anchor name="declaring-multiple-targets"/>
### 여러 유사 타겟 선언

**무엇이 변경되었나요?**

단일 Gradle 프로젝트에서 여러 유사 타겟을 선언하는 것을 권장하지 않습니다. 예를 들면 다음과 같습니다:

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 권장되지 않으며 지원 중단 경고를 생성합니다
}
```

한 가지 일반적인 경우는 두 개의 관련 코드 조각을 함께 사용하는 것입니다. 예를 들어, `:shared` Gradle 프로젝트에서 Ktor 또는 OkHttp 라이브러리를 사용하여 네트워킹을 구현하기 위해 `jvm("jvmKtor")` 및 `jvm("jvmOkHttp")`를 사용하고 싶을 수 있습니다:

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

구현은 상당한 구성 복잡성을 수반합니다:

*   `:shared` 측과 각 소비자 측에서 Gradle 속성을 설정해야 합니다. 그렇지 않으면 Gradle은 추가 정보 없이는 소비자가 Ktor 기반 구현을 받아야 할지 OkHttp 기반 구현을 받아야 할지 명확하지 않으므로 이러한 프로젝트에서 의존성을 해결할 수 없습니다.
*   `commonJvmMain` 소스 세트를 수동으로 설정해야 합니다.
*   이 구성에는 몇 가지 낮은 수준의 Gradle 및 Kotlin Gradle 플러그인 추상화 및 API가 포함됩니다.

**현재 권장되는 방식은 무엇인가요?**

Ktor 기반 및 OkHttp 기반 구현이 _동일한 Gradle 프로젝트_에 있기 때문에 구성이 복잡합니다. 많은 경우에 해당 부분을 별도의 Gradle 프로젝트로 추출하는 것이 가능합니다. 다음은 이러한 리팩토링에 대한 일반적인 개요입니다:

1.  원본 프로젝트에서 중복된 두 타겟을 단일 타겟으로 교체합니다. 이 타겟들 사이에 공유 소스 세트가 있었다면, 해당 소스와 구성을 새로 생성된 타겟의 기본 소스 세트로 이동하세요:

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // 여기에 jvmCommonMain의 구성을 복사하세요
            }
        }
    }
    ```

2.  일반적으로 `settings.gradle.kts` 파일에서 `include`를 호출하여 두 개의 새 Gradle 프로젝트를 추가합니다. 예를 들면 다음과 같습니다:

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3.  각 새 Gradle 프로젝트를 구성합니다:

    *   이러한 프로젝트는 하나의 타겟으로만 컴파일되므로 `kotlin("multiplatform")` 플러그인을 적용할 필요가 없을 가능성이 높습니다. 이 예에서는 `kotlin("jvm")`을 적용할 수 있습니다.
    *   원본 타겟별 소스 세트의 내용을 해당 프로젝트로 이동합니다. 예를 들어, `jvmKtorMain`에서 `ktor-impl/src`로 이동합니다.
    *   소스 세트의 구성(의존성, 컴파일러 옵션 등)을 복사합니다.
    *   새 Gradle 프로젝트에서 원본 프로젝트로 의존성을 추가합니다.

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 원본 프로젝트에 대한 의존성 추가
        // 여기에 jvmKtorMain의 의존성을 복사하세요
    }
    
    kotlin {
        compilerOptions {
            // 여기에 jvmKtorMain의 컴파일러 옵션을 복사하세요
        }
    }
    ```

이 접근 방식은 초기 설정에 더 많은 작업이 필요하지만, Gradle 및 Kotlin Gradle 플러그인의 낮은 수준 엔티티를 사용하지 않으므로 결과 빌드를 더 쉽게 사용하고 유지 관리할 수 있습니다.

> 안타깝게도 각 경우에 대한 자세한 마이그레이션 단계를 제공할 수는 없습니다. 위 지침이 작동하지 않는 경우, 이 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-59316)에 사용 사례를 설명해 주세요.
>
{style="tip"}

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.9.20: Kotlin Multiplatform 프로젝트에서 여러 유사 타겟이 사용될 때 지원 중단 경고를 도입합니다.
*   2.1.0: Kotlin/JS 타겟을 제외하고 이러한 경우 오류를 보고합니다; 이 예외에 대해 자세히 알아보려면 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)의 이슈를 참조하세요.

<anchor name="deprecate-pre-hmpp-dependencies"/>
### 레거시 모드로 게시된 멀티플랫폼 라이브러리 지원 중단

**무엇이 변경되었나요?**

이전에 Kotlin Multiplatform 프로젝트에서 [레거시 모드를 지원 중단하여](#deprecated-gradle-properties-for-hierarchical-structure-support) "레거시" 바이너리 게시를 방지하고 프로젝트를 [계층적 구조](multiplatform-hierarchy.md)로 마이그레이션하도록 권장했습니다.

생태계에서 "레거시" 바이너리를 계속해서 단계적으로 폐지하기 위해 Kotlin 1.9.0부터 레거시 라이브러리 사용도 권장하지 않습니다. 프로젝트가 레거시 라이브러리에 의존성을 사용하는 경우, 다음 경고가 표시됩니다:

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**현재 권장되는 방식은 무엇인가요?**

_멀티플랫폼 라이브러리를 사용하는 경우_, 대부분의 라이브러리는 이미 "계층적 구조" 모드로 마이그레이션되었으므로 라이브러리 버전만 업데이트하면 됩니다. 자세한 내용은 해당 라이브러리 문서를 참조하세요.

라이브러리가 아직 비레거시 바이너리를 지원하지 않는 경우, 유지 관리자에게 연락하여 이 호환성 문제에 대해 알릴 수 있습니다.

_라이브러리 작성자라면_, Kotlin Gradle 플러그인을 최신 버전으로 업데이트하고 [지원 중단된 Gradle 속성](#deprecated-gradle-properties-for-hierarchical-structure-support)을 해결했는지 확인하세요.

Kotlin 팀은 생태계 마이그레이션을 돕기 위해 노력하고 있으므로, 문제가 발생하면 주저하지 말고 [YouTrack에 이슈](https://kotl.in/issue)를 생성하세요.

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.9.0: 레거시 라이브러리에 대한 의존성에 대해 지원 중단 경고를 도입합니다.
*   2.0.0: 레거시 라이브러리에 대한 의존성 경고를 오류로 상향합니다.
*   >2.0.0: 레거시 라이브러리에 대한 의존성 지원을 제거합니다; 이러한 의존성을 사용하면 빌드 실패를 초래할 수 있습니다.

<anchor name="deprecate-hmpp-properties"/>
### 계층적 구조 지원을 위한 지원 중단된 Gradle 속성

**무엇이 변경되었나요?**

Kotlin은 진화 과정에서 멀티플랫폼 프로젝트에서 [계층적 구조](multiplatform-hierarchy.md) 지원을 점진적으로 도입했습니다. 이는 `commonMain` 공통 소스 세트와 `jvmMain`과 같은 플랫폼별 소스 세트 사이에 중간 소스 세트를 가질 수 있는 기능입니다.

도구 체인이 충분히 안정적이지 않았던 전환 기간 동안, 세분화된 옵트인 및 옵트아웃을 허용하는 몇 가지 Gradle 속성이 도입되었습니다.

Kotlin 1.6.20부터 계층적 프로젝트 구조 지원이 기본적으로 활성화되었습니다. 그러나 이러한 속성은 차단 문제가 발생할 경우 옵트아웃을 위해 유지되었습니다. 모든 피드백을 처리한 후, 이제 해당 속성들을 완전히 단계적으로 폐지하기 시작했습니다.

다음 속성들은 이제 지원 중단됩니다:

*   `kotlin.internal.mpp.hierarchicalStructureByDefault`
*   `kotlin.mpp.enableCompatibilityMetadataVariant`
*   `kotlin.mpp.hierarchicalStructureSupport`
*   `kotlin.mpp.enableGranularSourceSetsMetadata`
*   `kotlin.native.enableDependencyPropagation`

**현재 권장되는 방식은 무엇인가요?**

*   `gradle.properties` 및 `local.properties` 파일에서 이러한 속성들을 제거하세요.
*   Gradle 빌드 스크립트나 Gradle 플러그인에서 이러한 속성들을 프로그래밍 방식으로 설정하는 것을 피하세요.
*   빌드에서 사용되는 일부 타사 Gradle 플러그인이 지원 중단된 속성을 설정하는 경우, 플러그인 유지 관리자에게 이러한 속성을 설정하지 않도록 요청하세요.

Kotlin 1.6.20부터 Kotlin 도구 체인의 기본 동작에 이러한 속성이 포함되지 않으므로 심각한 영향은 예상하지 않습니다. 대부분의 결과는 프로젝트를 다시 빌드한 직후에 나타날 것입니다.

라이브러리 작성자이고 추가적인 안전을 기하고 싶다면, 소비자가 귀하의 라이브러리와 함께 작동할 수 있는지 확인하세요.

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.8.20: 지원 중단된 Gradle 속성이 사용될 때 경고를 보고합니다.
*   1.9.20: 이 경고를 오류로 상향합니다.
*   2.0.0: 지원 중단된 속성을 제거합니다; Kotlin Gradle 플러그인은 이들의 사용을 무시합니다.

이러한 속성을 제거한 후 문제가 발생할 가능성이 희박하지만, [YouTrack에 이슈](https://kotl.in/issue)를 생성하세요.

<anchor name="target-presets-deprecation"/>
### 지원 중단된 타겟 프리셋 API

**무엇이 변경되었나요?**

초기 개발 단계에서 Kotlin Multiplatform은 소위 _타겟 프리셋_과 함께 작동하기 위한 API를 도입했습니다. 각 타겟 프리셋은 본질적으로 Kotlin Multiplatform 타겟을 위한 팩토리를 나타냈습니다. 이 API는 `jvm()` 또는 `iosSimulatorArm64()`와 같은 DSL 함수가 훨씬 더 직관적이고 간결하면서도 동일한 사용 사례를 다루므로 대체로 중복되는 것으로 판명되었습니다.

혼란을 줄이고 더 명확한 지침을 제공하기 위해 모든 프리셋 관련 API는 이제 Kotlin Gradle 플러그인의 공개 API에서 지원 중단됩니다. 이는 다음을 포함합니다:

*   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension`의 `presets` 속성
*   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 인터페이스 및 모든 상속자
*   `fromPreset` 오버로드

**현재 권장되는 방식은 무엇인가요?**

대신 해당 [Kotlin 타겟](multiplatform-dsl-reference.md#targets)을 사용하세요. 예를 들면 다음과 같습니다:

<table>
    <tr>
        <td>이전</td>
        <td>현재</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        fromPreset(presets.iosArm64, 'ios')
    }
}
```

</td>
<td>

```kotlin
kotlin {
    iosArm64()
}
```

</td>
</tr>
</table>

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.9.20: 프리셋 관련 API 사용 시 경고를 보고합니다.
*   2.0.0: 이 경고를 오류로 상향합니다.
*   2.2.0: Kotlin Gradle 플러그인의 공개 API에서 프리셋 관련 API를 제거합니다; 여전히 이를 사용하는 소스는 빌드 중 "확인되지 않은 참조" 오류로 실패하고, 바이너리(예: Gradle 플러그인)는 최신 버전의 Kotlin Gradle 플러그인에 대해 다시 컴파일되지 않는 한 연결 오류로 실패할 수 있습니다.

<anchor name="target-shortcuts-deprecation"/>
### 지원 중단된 Apple 타겟 단축키

**무엇이 변경되었나요?**

Kotlin Multiplatform DSL에서 `ios()`, `watchos()`, `tvos()` 타겟 단축키를 지원 중단하고 있습니다. 이들은 Apple 타겟을 위한 소스 세트 계층을 부분적으로 생성하도록 설계되었습니다. 그러나 확장하기 어렵고 때로는 혼란스러웠음이 입증되었습니다.

예를 들어, `ios()` 단축키는 `iosArm64`와 `iosX64` 타겟을 모두 생성했지만, Apple M 칩을 사용하는 호스트에서 작업할 때 필요한 `iosSimulatorArm64` 타겟은 포함하지 않았습니다. 그러나 이 단축키를 변경하는 것은 구현하기 어려웠고 기존 사용자 프로젝트에 문제를 일으킬 수 있었습니다.

**현재 권장되는 방식은 무엇인가요?**

Kotlin Gradle 플러그인은 이제 내장된 계층 템플릿을 제공합니다. Kotlin 1.9.20부터 기본적으로 활성화되며, 일반적인 사용 사례를 위한 사전 정의된 중간 소스 세트를 포함합니다.

단축키 대신 타겟 목록을 지정해야 하며, 그러면 플러그인이 이 목록을 기반으로 중간 소스 세트를 자동으로 설정합니다.

예를 들어, 프로젝트에 `iosArm64` 및 `iosSimulatorArm64` 타겟이 있는 경우, 플러그인은 `iosMain` 및 `iosTest` 중간 소스 세트를 자동으로 생성합니다. `iosArm64` 및 `macosArm64` 타겟이 있는 경우, `appleMain` 및 `appleTest` 소스 세트가 생성됩니다.

자세한 내용은 [계층적 프로젝트 구조](multiplatform-hierarchy.md)를 참조하세요.

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.9.20: `ios()`, `watchos()`, `tvos()` 타겟 단축키가 사용될 때 경고를 보고합니다; 대신 기본 계층 템플릿이 기본적으로 활성화됩니다.
*   2.1.0: 타겟 단축키가 사용될 때 오류를 보고합니다.
*   2.2.0: Kotlin Multiplatform Gradle 플러그인에서 타겟 단축키 DSL을 제거합니다.

### Kotlin 업그레이드 후 iOS 프레임워크 버전 오류

**문제는 무엇인가요?**

직접 통합을 사용할 때 Kotlin 코드의 변경 사항이 Xcode의 iOS 앱에 반영되지 않을 수 있습니다. 직접 통합은 `embedAndSignAppleFrameworkForXcode` 작업을 통해 설정되며, 이 작업은 멀티플랫폼 프로젝트의 iOS 프레임워크를 Xcode의 iOS 앱에 연결합니다.

이는 멀티플랫폼 프로젝트에서 Kotlin 버전을 1.9.2x에서 2.0.0으로 업그레이드(또는 2.0.0에서 1.9.2x로 다운그레이드)한 다음 Kotlin 파일을 변경하고 앱을 빌드하려고 할 때 Xcode가 이전 버전의 iOS 프레임워크를 잘못 사용할 수 있음을 의미합니다. 따라서 변경 사항이 Xcode의 iOS 앱에 표시되지 않을 것입니다.

**해결 방법은 무엇인가요?**

1.  Xcode에서 **Product** | **Clean Build Folder**를 사용하여 빌드 디렉토리를 정리합니다.
2.  터미널에서 다음 명령을 실행합니다:

    ```none
    ./gradlew clean
    ```

3.  새로운 버전의 iOS 프레임워크가 사용되도록 앱을 다시 빌드합니다.

**언제 문제가 해결될까요?**

Kotlin 2.0.10에서 이 문제를 해결할 계획입니다. [Kotlin Early Access Preview 참여](https://kotlinlang.org/docs/eap.html) 섹션에서 Kotlin 2.0.10의 미리 보기 버전이 이미 사용 가능한지 확인할 수 있습니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-68257)를 참조하세요.

## Kotlin 1.9.0−1.9.25

이 섹션에서는 지원 중단 주기가 끝나고 Kotlin 1.9.0−1.9.25에 적용되는 호환되지 않는 변경 사항을 다룹니다.

<anchor name="compilation-source-deprecation"/>
### Kotlin 컴파일에 Kotlin 소스 세트를 직접 추가하는 지원 중단된 API {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

`KotlinCompilation.source`에 대한 접근이 지원 중단되었습니다. 다음과 같은 코드는 지원 중단 경고를 생성합니다:

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

**현재 권장되는 방식은 무엇인가요?**

`KotlinCompilation.source(someSourceSet)`를 대체하려면, `KotlinCompilation`의 기본 소스 세트에서 `someSourceSet`으로 `dependsOn` 관계를 추가하세요. 더 짧고 읽기 쉬운 `by getting`을 사용하여 소스를 직접 참조하는 것을 권장합니다. 그러나 모든 경우에 적용 가능한 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`을 사용할 수도 있습니다.

위 코드를 다음 방법 중 하나로 변경할 수 있습니다:

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
        
        // 옵션 #1. 더 짧고 읽기 쉬우므로 가능하면 사용하세요. 
        // 일반적으로 기본 소스 세트의 이름은 
        // 타겟 이름과 컴파일 이름의 간단한 연결입니다:
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // 옵션 #2. 일반적인 솔루션이며, 빌드 스크립트가 더 고급 접근 방식을 요구하는 경우 사용하세요:
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.9.0: `KotlinComplation.source`가 사용될 때 지원 중단 경고를 도입합니다.
*   1.9.20: 이 경고를 오류로 상향합니다.
*   2.2.0: Kotlin Gradle 플러그인에서 `KotlinComplation.source`를 제거합니다. 이를 사용하려는 시도는 빌드 스크립트 컴파일 중 "확인되지 않은 참조" 오류를 유발합니다.

<anchor name="kotlin-js-plugin-deprecation"/>
### `kotlin-js` Gradle 플러그인에서 `kotlin-multiplatform` Gradle 플러그인으로 마이그레이션 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Kotlin 1.9.0부터 `kotlin-js` Gradle 플러그인은 지원 중단됩니다. 기본적으로 `js()` 타겟을 가진 `kotlin-multiplatform` 플러그인의 기능을 중복했으며 내부적으로 동일한 구현을 공유했습니다. 이러한 중복은 혼란을 야기하고 Kotlin 팀의 유지 보수 부담을 증가시켰습니다. 대신 `js()` 타겟을 가진 `kotlin-multiplatform` Gradle 플러그인으로 마이그레이션하는 것을 권장합니다.

**현재 권장되는 방식은 무엇인가요?**

1.  `pluginManagement {}` 블록을 사용하는 경우, 프로젝트에서 `kotlin-js` Gradle 플러그인을 제거하고 `settings.gradle.kts` 파일에 `kotlin-multiplatform`을 적용하세요:

    <tabs>
    <tab title="kotlin-js">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 다음 줄을 제거하세요:
            kotlin("js") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </tab>
    <tab title="kotlin-multiplatform">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 대신 다음 줄을 추가하세요:
            kotlin("multiplatform") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </tab>
    </tabs>

    다른 방식으로 플러그인을 적용하는 경우, 마이그레이션 지침은 [Gradle 문서](https://docs.gradle.org/current/userguide/plugins.html)를 참조하세요.

2.  소스 파일을 `main` 및 `test` 폴더에서 동일한 디렉토리의 `jsMain` 및 `jsTest` 폴더로 이동하세요.
3.  의존성 선언을 조정하세요:

    *   `sourceSets {}` 블록을 사용하고 각 소스 세트의 의존성, 즉 프로덕션 의존성을 위한 `jsMain {}`과 테스트 의존성을 위한 `jsTest {}`를 구성하는 것을 권장합니다.
        자세한 내용은 [의존성 추가](multiplatform-add-dependencies.md)를 참조하세요.
    *   그러나 최상위 블록에서 의존성을 선언하려면 `api("group:artifact:1.0")`에서 `add("jsMainApi", "group:artifact:1.0")` 등으로 선언을 변경하세요.

      > 이 경우, 최상위 `dependencies {}` 블록이 `kotlin {}` 블록 **뒤에** 오도록 하세요. 그렇지 않으면 "Configuration not found" 오류가 발생합니다.
      >
      {style="note"}

    `build.gradle.kts` 파일의 코드를 다음 방법 중 하나로 변경할 수 있습니다:

    <tabs>
    <tab title="kotlin-js">

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

    </tab>
    <tab title="kotlin-multiplatform">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("multiplatform") version "1.9.0"
    }
    
    kotlin {
        js {
            // ...
        }
        
        // 옵션 #1. sourceSets {} 블록에서 의존성을 선언합니다:
        sourceSets {
            val jsMain by getting {
                dependencies {
                    // 여기서는 js 접두사가 필요 없습니다. 최상위 블록에서 복사하여 붙여넣기만 하면 됩니다.
                    implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
                }
           }
        }
    }
    
    dependencies {
        // 옵션 #2. 의존성 선언에 js 접두사를 추가합니다:
        add("jsTestImplementation", kotlin("test"))
    }
    ```

    </tab>
    </tabs>

4.  `kotlin {}` 블록 내의 Kotlin Gradle 플러그인이 제공하는 DSL은 대부분의 경우 변경되지 않습니다. 그러나 작업 및 구성과 같은 낮은 수준의 Gradle 엔티티를 이름으로 참조했다면, 이제 `js` 접두사를 추가하여 조정해야 합니다. 예를 들어, `browserTest` 작업은 `jsBrowserTest` 이름으로 찾을 수 있습니다.

**언제 변경 사항이 적용되나요?**

1.9.0에서는 `kotlin-js` Gradle 플러그인 사용 시 지원 중단 경고가 발생합니다.

<anchor name="jvmWithJava-preset-deprecation"/>
### 지원 중단된 `jvmWithJava` 프리셋 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

`targetPresets.jvmWithJava`는 지원 중단되었으며, 사용을 권장하지 않습니다.

**현재 권장되는 방식은 무엇인가요?**

대신 `jvm { withJava() }` 타겟을 사용하세요. `jvm { withJava() }`로 전환한 후에는 `.java` 소스가 있는 소스 디렉토리의 경로를 조정해야 합니다.

예를 들어, 기본 이름 "jvm"을 가진 `jvm` 타겟을 사용하는 경우:

| 이전          | 현재               |
|---------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.3.40: `targetPresets.jvmWithJava`가 사용될 때 경고를 도입합니다.
*   1.9.20: 이 경고를 오류로 상향합니다.
*   >1.9.20: `targetPresets.jvmWithJava` API를 제거합니다; 이를 사용하려는 시도는 빌드 스크립트 컴파일 실패를 초래합니다.

> 전체 `targetPresets` API가 지원 중단되었지만, `jvmWithJava` 프리셋은 다른 지원 중단 일정을 가집니다.
>
{style="note"}

<anchor name="android-sourceset-layout-v1-deprecation"/>
### 지원 중단된 레거시 Android 소스 세트 레이아웃 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

[새로운 Android 소스 세트 레이아웃](multiplatform-android-layout.md)이 Kotlin 1.9.0부터 기본적으로 사용됩니다. 레거시 레이아웃 지원은 지원 중단되었으며, `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 속성 사용 시 지원 중단 진단이 트리거됩니다.

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   <=1.9.0: `kotlin.mpp.androidSourceSetLayoutVersion=1`이 사용될 때 경고를 보고합니다; 이 경고는 `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 속성으로 억제할 수 있습니다.
*   1.9.20: 이 경고를 오류로 상향합니다; 이 오류는 **억제할 수 없습니다**.
*   >1.9.20: `kotlin.mpp.androidSourceSetLayoutVersion=1` 지원을 제거합니다; Kotlin Gradle 플러그인은 이 속성을 무시합니다.

<anchor name="common-sourceset-with-dependson-deprecation"/>
### 사용자 정의 `dependsOn`을 사용하는 `commonMain` 및 `commonTest` 지원 중단 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

`commonMain` 및 `commonTest` 소스 세트는 일반적으로 각각 `main` 및 `test` 소스 세트 계층의 루트를 나타냅니다. 그러나 이러한 소스 세트의 `dependsOn` 관계를 수동으로 구성하여 이를 재정의할 수 있었습니다.

이러한 구성을 유지 관리하려면 멀티플랫폼 빌드 내부에 대한 추가적인 노력과 지식이 필요합니다. 또한 `commonMain`이 `main` 소스 세트 계층의 루트인지 확인하기 위해 특정 빌드 스크립트를 읽어야 하므로 코드 가독성과 코드 재사용성이 저하됩니다.

따라서 `commonMain` 및 `commonTest`에서 `dependsOn`에 접근하는 것은 이제 지원 중단됩니다.

**현재 권장되는 방식은 무엇인가요?**

`commonMain.dependsOn(customCommonMain)`을 사용하는 `customCommonMain` 소스 세트를 1.9.20으로 마이그레이션해야 한다고 가정해 봅시다. 대부분의 경우 `customCommonMain`은 `commonMain`과 동일한 컴파일에 참여하므로 `customCommonMain`을 `commonMain`으로 병합할 수 있습니다:

1.  `customCommonMain`의 소스를 `commonMain`으로 복사합니다.
2.  `customCommonMain`의 모든 의존성을 `commonMain`에 추가합니다.
3.  `customCommonMain`의 모든 컴파일러 옵션 설정을 `commonMain`에 추가합니다.

드문 경우이지만, `customCommonMain`이 `commonMain`보다 더 많은 컴파일에 참여할 수 있습니다. 이러한 구성은 빌드 스크립트의 추가적인 낮은 수준 구성이 필요합니다. 이것이 귀하의 사용 사례인지 확실하지 않다면, 대부분의 경우 아닐 것입니다.

이것이 귀하의 사용 사례라면, `customCommonMain`의 소스와 설정을 `commonMain`으로 이동하고 그 반대로 하여 이 두 소스 세트를 "교체"하세요.

**언제 변경 사항이 적용되나요?**

다음은 계획된 지원 중단 주기입니다:

*   1.9.0: `commonMain`에서 `dependsOn`이 사용될 때 경고를 보고합니다.
*   >=1.9.20: `commonMain` 또는 `commonTest`에서 `dependsOn`이 사용될 때 오류를 보고합니다.

### 전방 선언에 대한 새로운 접근 방식 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

JetBrains 팀은 Kotlin에서 전방 선언의 동작을 더 예측 가능하게 만들기 위해 접근 방식을 개편했습니다:

*   `cnames` 또는 `objcnames` 패키지를 사용하여 전방 선언을 가져올 수 있습니다.
*   해당 C 및 Objective-C 전방 선언으로 또는 해당 전방 선언으로부터 명시적으로 캐스팅해야 합니다.

**현재 권장되는 방식은 무엇인가요?**

*   `cstructName` 전방 선언을 선언하는 `library.package`를 가진 C 라이브러리를 고려해 봅시다.
    이전에는 `import library.package.cstructName`을 사용하여 라이브러리에서 직접 가져올 수 있었습니다.
    이제는 이를 위해 특별한 전방 선언 패키지를 사용해야 합니다: `import cnames.structs.cstructName`.
    `objcnames`도 마찬가지입니다.

*   `objcnames.protocols.ForwardDeclaredProtocolProtocol`을 사용하는 objcinterop 라이브러리 하나와 실제 정의를 가진 다른 라이브러리 두 개를 고려해 봅시다:

    ```ObjC
    // 첫 번째 objcinterop 라이브러리
    #import <Foundation/Foundation.h>
    
    @protocol ForwardDeclaredProtocol;
    
    NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
        return [NSString stringWithUTF8String:"Protocol"];
    }
    ```

    ```ObjC
    // 두 번째 objcinterop 라이브러리
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

    이전에는 객체를 이들 간에 원활하게 전송하는 것이 가능했습니다. 이제 전방 선언에 대해 명시적인 `as` 캐스트가 필요합니다:

    ```kotlin
    // Kotlin 코드:
    fun test() {
        consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
    }
    ```

    > 해당 실제 클래스에서만 `objcnames.protocols.ForwardDeclaredProtocolProtocol`로 캐스팅할 수 있습니다.
    > 그렇지 않으면 오류가 발생합니다.
    >
    {style="note"}

**언제 변경 사항이 적용되나요?**

Kotlin 1.9.20부터 해당 C 및 Objective-C 전방 선언으로 또는 해당 전방 선언으로부터 명시적으로 캐스팅해야 합니다. 또한 이제는 특수 패키지를 사용하여 전방 선언을 가져오는 것만 가능합니다.

## Kotlin 1.7.0−1.8.22

이 섹션에서는 지원 중단 주기가 끝나고 Kotlin 1.7.0−1.8.22에 적용되는 호환되지 않는 변경 사항을 다룹니다.

<anchor name="deprecated-compatibility-with-kmp-gradle-plugin-and-gradle-java-plugins"/>
### Kotlin Multiplatform Gradle 플러그인과 Gradle Java 플러그인의 지원 중단된 호환성 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Kotlin Multiplatform Gradle 플러그인과 [Java](https://docs.gradle.org/current/userguide/java_plugin.html), [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html), [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 플러그인 간의 호환성 문제로 인해, 이제 이 플러그인들을 동일한 프로젝트에 적용할 때 지원 중단 경고가 발생합니다. 멀티플랫폼 프로젝트의 다른 Gradle 플러그인이 Gradle Java 플러그인을 적용할 때도 경고가 나타납니다. 예를 들어, [Spring Boot Gradle 플러그인](https://docs.spring.io/spring-boot/gradle-plugin/index.html)은 Application 플러그인을 자동으로 적용합니다.

Kotlin Multiplatform의 프로젝트 모델과 Gradle의 Java 생태계 플러그인 간의 근본적인 호환성 문제로 인해 이 지원 중단 경고를 추가했습니다. Gradle의 Java 생태계 플러그인들은 현재 다른 플러그인들이 다음을 할 수 있다는 것을 고려하지 않습니다:

*   Java 생태계 플러그인과 다른 방식으로 JVM 타겟을 게시하거나 컴파일할 수도 있습니다.
*   동일한 프로젝트에 JVM 및 Android와 같이 두 개의 다른 JVM 타겟을 가질 수도 있습니다.
*   잠재적으로 여러 비JVM 타겟을 가진 복잡한 멀티플랫폼 프로젝트 구조를 가질 수도 있습니다.

안타깝게도 Gradle은 현재 이러한 문제를 해결할 API를 제공하지 않습니다.

이전에는 Java 생태계 플러그인과의 통합을 돕기 위해 Kotlin Multiplatform에서 일부 해결 방법을 사용했습니다. 그러나 이러한 해결 방법은 호환성 문제를 진정으로 해결하지 못했으며, Gradle 8.8 출시 이후에는 이러한 해결 방법이 더 이상 불가능합니다. 자세한 내용은 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)를 참조하세요.

아직 이 호환성 문제를 정확히 해결하는 방법을 알지 못하지만, Kotlin Multiplatform 프로젝트에서 어떤 형태로든 Java 소스 컴파일을 계속 지원하기 위해 노력하고 있습니다. 최소한 멀티플랫폼 프로젝트 내에서 Java 소스 컴파일 및 Gradle의 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 플러그인 사용을 지원할 것입니다.

**현재 권장되는 방식은 무엇인가요?**

멀티플랫폼 프로젝트에서 이 지원 중단 경고가 표시되면 다음을 권장합니다:
1.  프로젝트에서 실제로 Gradle Java 플러그인이 필요한지 확인하세요. 필요하지 않다면 제거를 고려해 보세요.
2.  Gradle Java 플러그인이 단일 작업에만 사용되는지 확인하세요. 그렇다면 큰 노력 없이 플러그인을 제거할 수 있을 것입니다. 예를 들어, 작업이 Javadoc JAR 파일을 생성하기 위해 Gradle Java 플러그인을 사용하는 경우, 대신 Javadoc 작업을 수동으로 정의할 수 있습니다.

그렇지 않고, 멀티플랫폼 프로젝트에서 Kotlin Multiplatform Gradle 플러그인과 Java용 Gradle 플러그인을 모두 사용하려면 다음을 권장합니다:

1.  Gradle 프로젝트에 별도의 서브프로젝트를 생성합니다.
2.  별도의 서브프로젝트에 Java용 Gradle 플러그인을 적용합니다.
3.  별도의 서브프로젝트에 상위 멀티플랫폼 프로젝트에 대한 의존성을 추가합니다.

> 별도의 서브프로젝트는 멀티플랫폼 프로젝트가 **아니어야** 하며, 멀티플랫폼 프로젝트에 대한 의존성을 설정하는 용도로만 사용해야 합니다.
>
{style="warning"}

예를 들어, `my-main-project`라는 멀티플랫폼 프로젝트가 있고 [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) Gradle 플러그인을 사용하고 싶다고 가정해 봅시다.

서브프로젝트(`subproject-A`라고 부르겠습니다)를 생성하면, 상위 프로젝트 구조는 다음과 같을 것입니다:

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

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</tab>
</tabs>

서브프로젝트의 `build.gradle.kts` 파일에서 상위 멀티플랫폼 프로젝트에 대한 의존성을 추가합니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 상위 멀티플랫폼 프로젝트의 이름
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 상위 멀티플랫폼 프로젝트의 이름
}
```

</tab>
</tabs>

이제 상위 프로젝트는 두 플러그인 모두와 함께 작동하도록 설정되었습니다.

### 자동 생성된 타겟에 대한 새로운 접근 방식 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Gradle에 의해 자동 생성된 타겟 접근자는 더 이상 `kotlin.targets {}` 블록 내에서 사용할 수 없습니다. 대신 `findByName("targetName")` 메서드를 사용하세요.

예를 들어, `kotlin.targets.linuxX64`와 같이 `kotlin.targets {}`의 경우에는 이러한 접근자가 여전히 사용 가능합니다.

**현재 권장되는 방식은 무엇인가요?**

<table>
    <tr>
        <td>이전</td>
        <td>현재</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```

</td>
    </tr>
</table>

**언제 변경 사항이 적용되나요?**

Kotlin 1.7.20에서는 `kotlin.targets {}` 블록에서 타겟 접근자를 사용할 때 오류가 발생합니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-47047)를 참조하세요.

### Gradle 입력 및 출력 컴파일 작업의 변경 사항 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Kotlin 컴파일 작업은 더 이상 `sourceCompatibility` 및 `targetCompatibility` 입력을 가진 Gradle `AbstractCompile` 작업을 상속하지 않으므로 Kotlin 사용자 스크립트에서 사용할 수 없습니다.

컴파일 작업의 다른 주요 변경 사항:

**현재 권장되는 방식은 무엇인가요?**

| 이전                                                              | 현재                                                                                                   |
|---------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| `SourceTask.stableSources` 입력은 더 이상 사용할 수 없습니다.        | 대신 `sources` 입력을 사용하세요. 또한 `setSource()` 메서드는 여전히 사용 가능합니다.                    |
| `sourceFilesExtensions` 입력이 제거되었습니다.                      | 컴파일 작업은 여전히 `PatternFilterable` 인터페이스를 구현합니다. Kotlin 소스 필터링에 해당 메서드를 사용하세요. |
| `Gradle destinationDir: File` 출력은 지원 중단되었습니다.            | 대신 `destinationDirectory: DirectoryProperty` 출력을 사용하세요.                                              |
| `KotlinCompile` 작업의 `classpath` 속성이 지원 중단되었습니다. | 모든 컴파일 작업은 이제 컴파일에 필요한 라이브러리 목록을 위해 `libraries` 입력을 사용합니다.              |

**언제 변경 사항이 적용되나요?**

Kotlin 1.7.20에서는 입력이 사용할 수 없게 되고, 출력이 교체되며, `classpath` 속성이 지원 중단됩니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-32805)를 참조하세요.

### 컴파일 의존성을 위한 새로운 구성 이름 {initial-collapse-state="collapsed" collapsible="true"}

**무엇이 변경되었나요?**

Kotlin Multiplatform Gradle 플러그인에 의해 생성된 컴파일 구성이 새로운 이름을 받았습니다.

Kotlin Multiplatform 프로젝트의 타겟에는 `main`과 `test` 두 가지 기본 컴파일이 있습니다. 이러한 각 컴파일은 예를 들어 `jvmMain` 및 `jvmTest`와 같은 자체 기본 소스 세트를 가집니다. 이전에는 테스트 컴파일과 그 기본 소스 세트의 구성 이름이 동일하여, 플랫폼별 속성으로 표시된 구성이 다른 구성에 포함될 때 이름 충돌이 발생하여 문제를 일으킬 수 있었습니다.

이제 컴파일 구성에는 추가 `Compilation` 접미사가 붙으며, 이전의 하드 코딩된 구성 이름을 사용하는 프로젝트 및 플러그인은 더 이상 컴파일되지 않습니다.

해당 소스 세트에 대한 의존성 구성 이름은 동일하게 유지됩니다.

<table>
    <tr>
        <td></td>
        <td>이전</td>
        <td>현재</td>
    </tr>
    <tr>
        <td rowspan="2"><code>jvmMain</code> 컴파일의 의존성</td>
<td>

```kotlin
jvm<Scope>
```

</td>
<td>

```kotlin
jvmCompilation<Scope>
```

</td>
    </tr>
    <tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
    </tr>
    <tr>
        <td><code>jvmMain</code> 소스 세트의 의존성</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 컴파일의 의존성</td>
<td>

```kotlin
jvmTest<Scope>
```

</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 소스 세트의 의존성</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```

</td>
    </tr>
</table>

사용 가능한 스코프는 `Api`, `Implementation`, `CompileOnly`, `RuntimeOnly`입니다.

**언제 변경 사항이 적용되나요?**

Kotlin 1.8.0에서는 하드 코딩된 문자열에 이전 구성 이름을 사용할 때 오류가 발생합니다.

자세한 내용은 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-35916/)를 참조하세요.