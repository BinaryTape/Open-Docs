---
title: "Kotlin Multiplatform 호환성 가이드"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<show-structure depth="1"/>

이 가이드는 Kotlin Multiplatform으로 프로젝트를 개발하는 동안 발생할 수 있는 [호환되지 않는 변경 사항](kotlin-evolution-principles#incompatible-changes)을 요약합니다.

현재 Kotlin의 Stable 버전은 2.1.20입니다. 프로젝트에서 사용하는 Kotlin 버전에 따라 특정 변경 사항의 지원 중단 주기를 염두에 두세요. 예를 들면 다음과 같습니다.

* Kotlin 1.7.0에서 Kotlin 1.9.0으로 업그레이드할 때는 [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25)과 [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22) 모두에서 적용된 호환되지 않는 변경 사항을 확인하세요.
* Kotlin 1.9.0에서 Kotlin 2.0.0으로 업그레이드할 때는 [Kotlin 2.0.0](#kotlin-2-0-0-and-later)과 [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25) 모두에서 적용된 호환되지 않는 변경 사항을 확인하세요.

## 버전 호환성

프로젝트를 구성할 때는 특정 Kotlin Multiplatform Gradle plugin 버전(프로젝트의 Kotlin 버전과 동일)이 Gradle, Xcode 및 Android Gradle plugin 버전과 호환되는지 확인하세요.

| Kotlin Multiplatform plugin 버전 | Gradle                                | Android Gradle plugin           | Xcode   |
|-------------------------------------|---------------------------------------|---------------------------------|---------|
| 2.1.20                              | 7.6.3–8.11 | 7.4.2–8.7.2 | 16.0 |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                     | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                       | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                       | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                       | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                       | 15.0    |
:::note
*Kotlin 2.0.20–2.0.21 및 Kotlin 2.1.0–2.1.10은 최대 8.6까지의 Gradle과 완전히 호환됩니다.
Gradle 버전 8.7–8.10도 지원되지만 한 가지 예외가 있습니다. Kotlin Multiplatform Gradle plugin을 사용하는 경우, JVM 타겟에서 `withJava()` 함수를 호출하는 멀티 플랫폼 프로젝트에서 더 이상 사용되지 않는다는 경고가 표시될 수 있습니다.
자세한 내용은 [기본적으로 생성되는 Java 소스 세트](#java-source-sets-created-by-default)를 참조하세요.

## Kotlin 2.0.0 이상

이 섹션에서는 지원 중단 주기가 종료되고 Kotlin 2.0.0−2.1.20에서 적용되는 호환되지 않는 변경 사항을 다룹니다.

<anchor name="java-source-set-created-by-default"/>
### 기본적으로 생성되는 Java 소스 세트

**무엇이 변경되었나요?**

Kotlin Multiplatform을 Gradle의 향후 변경 사항에 맞추기 위해 `withJava()` 함수를 단계적으로 폐지하고 있습니다. `withJava()`
함수는 필요한 Java 소스 세트를 생성하여 Gradle의 Java plugin과의 통합을 가능하게 했습니다. Kotlin 2.1.20부터는
이러한 Java 소스 세트가 기본적으로 생성됩니다.

**현재 가장 좋은 방법은 무엇인가요?**

이전에는 `src/jvmMain/java` 및 `src/jvmTest/java` 소스 세트를 생성하려면 `withJava()` 함수를 명시적으로 사용해야 했습니다.

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
``` 

Kotlin 2.1.20부터는 빌드 스크립트에서 `withJava()` 함수를 제거할 수 있습니다.

또한 Gradle은 이제 Java 소스가 있는 경우에만 Java 컴파일 작업을 실행하여 이전에 실행되지 않았던 JVM 유효성 검사
진단을 트리거합니다. 이 진단은 `KotlinJvmCompile` 작업 또는 `compilerOptions` 내에서 호환되지 않는 JVM 타겟을 명시적으로 구성하면 실패합니다. JVM 타겟 호환성을 보장하는 방법에 대한 지침은
[관련 컴파일 작업의 JVM 타겟 호환성 확인](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)을 참조하세요.

프로젝트에서 [Java](https://docs.gradle.org/current/userguide/java_plugin.html),
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 또는 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)과 같은 Gradle Java plugin이나
Gradle Java plugin에 종속성이 있는 타사 Gradle plugin을 사용하지 않는 경우 `withJava()` 함수를 제거할 수 있습니다.

프로젝트에서 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java plugin을 사용하는 경우
[새로운 Experimental DSL](whatsnew2120#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)로 마이그레이션하는 것이 좋습니다.
Gradle 8.7부터 Application plugin은 더 이상 Kotlin Multiplatform Gradle plugin과 함께 작동하지 않습니다.

멀티 플랫폼 프로젝트에서 Kotlin Multiplatform Gradle plugin과 다른 Gradle plugin을
Java용으로 함께 사용하려면 [Kotlin Multiplatform Gradle plugin 및 Java plugin과의 더 이상 사용되지 않는 호환성](multiplatform-compatibility-guide#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)을 참조하세요.

문제가 발생하면 [이슈 트래커](https://kotl.in/issue)에 보고하거나 [공개 Slack 채널](https://kotlinlang.slack.com/archives/C19FD9681)에서 도움을 요청하세요.

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* Gradle >8.6: `withJava()` 함수를 사용하는 멀티 플랫폼 프로젝트에서 이전 버전의 Kotlin에 대한 지원 중단 경고를 표시합니다.
* Gradle 9.0: 이 경고를 오류로 높입니다.
* 2.1.20: 모든 버전의 Gradle에서 `withJava()` 함수를 사용할 때 지원 중단 경고를 표시합니다.

<anchor name="android-target-rename"/>
### `android` 타겟을 `androidTarget`으로 이름 변경

**무엇이 변경되었나요?**

Kotlin Multiplatform을 더욱 안정적으로 만들기 위한 노력을 계속하고 있습니다. 이 방향으로 나아가는 중요한 단계는 Android 타겟에 대한 최고 수준의
지원을 제공하는 것입니다. 앞으로 이 지원은 Google의 Android 팀에서 개발한 별도의 plugin을 통해 제공될 예정입니다.

새로운 솔루션을 위한 길을 열기 위해 현재
Kotlin DSL에서 `android` 블록의 이름을 `androidTarget`으로 변경하고 있습니다. 이는 Google에서 제공하는 곧 출시될 DSL에서 짧은 `android` 이름을 확보하는 데 필요한 임시 변경 사항입니다.

**현재 가장 좋은 방법은 무엇인가요?**

`android` 블록의 모든 항목 이름을 `androidTarget`으로 변경하세요. Android 타겟 지원을 위한 새로운 plugin을
사용할 수 있게 되면 Google의 DSL로 마이그레이션하세요. 이것이 Kotlin Multiplatform에서 Android를 사용하는 기본 옵션이 될 것입니다.

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* 1.9.0: Kotlin Multiplatform 프로젝트에서 `android` 이름이 사용될 때 지원 중단 경고를 표시합니다.
* 2.1.0: 이 경고를 오류로 높입니다.
* 2.2.0: Kotlin Multiplatform Gradle plugin에서 `android` 타겟 DSL을 제거합니다.

<anchor name="declaring-multiple-targets"/>
### 여러 유사한 타겟 선언

**무엇이 변경되었나요?**

단일 Gradle 프로젝트에서 여러 유사한 타겟을 선언하는 것은 권장하지 않습니다. 예를 들면 다음과 같습니다.

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 권장하지 않으며 지원 중단 경고를 표시합니다.
}
```

일반적인 경우는 두 개의 관련 코드 조각을 함께 사용하는 것입니다. 예를 들어 `:shared` Gradle 프로젝트에서 `jvm("jvmKtor")` 및 `jvm("jvmOkHttp")`를 사용하여 Ktor
또는 OkHttp 라이브러리를 사용하여 네트워킹을 구현할 수 있습니다.

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
                // 공유 종속성
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor 종속성
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp 종속성
            }
        }
    }
}
```

이 구현에는 다음과 같은 복잡한 구성이 필요합니다.

* `:shared` 측과 각 소비자 측에서 Gradle 속성을 설정해야 합니다. 그렇지 않으면 Gradle은 이러한 프로젝트에서 종속성을 해결할 수 없습니다. 추가 정보가 없으면 소비자가
  Ktor 기반 구현 또는 OkHttp 기반 구현을 받아야 하는지 명확하지 않기 때문입니다.
* `commonJvmMain` 소스 세트를 수동으로 설정해야 합니다.
* 구성에는 몇 가지 하위 수준 Gradle 및 Kotlin Gradle plugin 추상화 및 API가 포함됩니다.

**현재 가장 좋은 방법은 무엇인가요?**

Ktor 기반 및 OkHttp 기반 구현은
_동일한 Gradle 프로젝트_에 있기 때문에 구성이 복잡합니다. 대부분의 경우 이러한 부분을 별도의 Gradle 프로젝트로 추출할 수 있습니다.
다음은 이러한 리팩터링의 일반적인 개요입니다.

1. 원래 프로젝트에서 복제된 두 개의 타겟을 단일 타겟으로 바꿉니다.
   이러한 타겟 간에 공유 소스 세트가 있는 경우 해당 소스와 구성을 새로 생성된 타겟의 기본 소스 세트로 이동합니다.

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // jvmCommonMain의 구성을 여기에 복사합니다.
            }
        }
    }
    ```

2. 두 개의 새로운 Gradle 프로젝트를 추가합니다. 일반적으로 `settings.gradle.kts` 파일에서 `include`를 호출합니다. 예를 들면 다음과 같습니다.

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3. 각 새로운 Gradle 프로젝트를 구성합니다.

    * 이러한 프로젝트는 하나의 타겟으로만 컴파일되므로 `kotlin("multiplatform")` plugin을 적용할 필요가 없을 가능성이 높습니다.
      이 예에서는 `kotlin("jvm")`을 적용할 수 있습니다.
    * 원래 타겟별 소스 세트의 내용을 해당 프로젝트로 이동합니다. 예를 들어
      `jvmKtorMain`에서 `ktor-impl/src`로 이동합니다.
    * 소스 세트의 구성(종속성, 컴파일러 옵션 등)을 복사합니다.
    * 새로운 Gradle 프로젝트에서 원래 프로젝트로의 종속성을 추가합니다.

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 원래 프로젝트에 대한 종속성을 추가합니다.
        // jvmKtorMain의 종속성을 여기에 복사합니다.
    }
    
    kotlin {
        compilerOptions {
            // jvmKtorMain의 컴파일러 옵션을 여기에 복사합니다.
        }
    }
    ```

이 접근 방식은 초기 설정에 더 많은 노력이 필요하지만 Gradle 및
Kotlin Gradle plugin의 하위 수준 엔터티를 사용하지 않으므로 결과 빌드를 더 쉽게 사용하고 유지 관리할 수 있습니다.

불행히도 각 경우에 대한 자세한 마이그레이션 단계를 제공할 수는 없습니다. 위의 지침이 작동하지 않는 경우 이 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-59316)에서 사용 사례를 설명하세요.

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* 1.9.20: Kotlin Multiplatform 프로젝트에서 여러 유사한 타겟이 사용될 때 지원 중단 경고를 표시합니다.
* 2.1.0: Kotlin/JS 타겟을 제외하고 이러한 경우에 오류를 보고합니다. 이 예외에 대한 자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode)의 이슈를 참조하세요.

<anchor name="deprecate-pre-hmpp-dependencies"/>
### 레거시 모드로 게시된 멀티 플랫폼 라이브러리의 지원 중단된 지원

**무엇이 변경되었나요?**

이전에 Kotlin Multiplatform 프로젝트에서 [레거시 모드를 지원 중단했습니다](#deprecated-gradle-properties-for-hierarchical-structure-support).
"레거시" 바이너리의 게시를 방지하고 프로젝트를 [계층 구조](multiplatform-hierarchy)로 마이그레이션하도록 권장했습니다.

에코시스템에서 "레거시" 바이너리를 계속 단계적으로 제거하기 위해 Kotlin 1.9.0부터는 레거시 라이브러리의 사용도 권장하지 않습니다.
프로젝트에서 레거시 라이브러리에 대한 종속성을 사용하는 경우 다음과 같은 경고가 표시됩니다.

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**현재 가장 좋은 방법은 무엇인가요?**

_멀티 플랫폼 라이브러리를 사용하는 경우_, 대부분이 이미 "계층 구조" 모드로 마이그레이션되었으므로
라이브러리 버전을 업데이트하기만 하면 됩니다. 자세한 내용은 해당 라이브러리의 설명서를 참조하세요.

라이브러리가 아직 비 레거시 바이너리를 지원하지 않는 경우 유지 관리자에게 문의하여 이
호환성 문제를 알려줄 수 있습니다.

_라이브러리 작성자인 경우_, Kotlin Gradle plugin을 최신 버전으로 업데이트하고 [지원 중단된 Gradle 속성](#deprecated-gradle-properties-for-hierarchical-structure-support)을 수정했는지 확인하세요.

Kotlin 팀은 에코시스템 마이그레이션을 돕기 위해 최선을 다하고 있으므로 문제가 발생하면 주저하지 말고 [YouTrack에 이슈를 생성하세요](https://kotl.in/issue).

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* 1.9: 레거시 라이브러리에 대한 종속성에 대한 지원 중단 경고를 표시합니다.
* 2.0: 레거시 라이브러리에 대한 종속성에 대한 경고를 오류로 높입니다.
* &gt;2.0: 레거시 라이브러리에 대한 종속성 지원을 제거합니다. 이러한 종속성을 사용하면 빌드 오류가 발생할 수 있습니다.

<anchor name="deprecate-hmpp-properties"/>
### 계층 구조 지원을 위해 지원 중단된 Gradle 속성

**무엇이 변경되었나요?**

Kotlin은 진화 과정에서 멀티 플랫폼 프로젝트에서 [계층 구조](multiplatform-hierarchy)에 대한 지원을 점진적으로 도입하고, 공통 소스 세트 `commonMain`과
플랫폼별 소스 세트(예: `jvmMain`) 사이에 중간 소스 세트를 가질 수 있는 기능을 제공했습니다.

전환 기간 동안 툴체인이 충분히 안정되지 않았기 때문에 세분화된 옵트인 및 옵트아웃을 허용하는 몇 가지 Gradle 속성이 도입되었습니다.

Kotlin 1.6.20부터는 계층 구조 프로젝트 구조 지원이 기본적으로 활성화되었습니다. 그러나 이러한 속성은 차단 문제가 발생할 경우 옵트아웃하기 위해 유지되었습니다.
모든 피드백을 처리한 후 이제 이러한 속성을 완전히 단계적으로 제거하기 시작합니다.

이제 다음 속성이 지원 중단되었습니다.

* `kotlin.internal.mpp.hierarchicalStructureByDefault`
* `kotlin.mpp.enableCompatibilityMetadataVariant`
* `kotlin.mpp.hierarchicalStructureSupport`
* `kotlin.mpp.enableGranularSourceSetsMetadata`
* `kotlin.native.enableDependencyPropagation`

**현재 가장 좋은 방법은 무엇인가요?**

* `gradle.properties` 및 `local.properties` 파일에서 이러한 속성을 제거하세요.
* Gradle 빌드 스크립트 또는 Gradle plugin에서 프로그래밍 방식으로 설정하지 마세요.
* 빌드에서 사용되는 일부 타사 Gradle plugin에서 지원 중단된 속성을 설정하는 경우 plugin 유지 관리자에게
  이러한 속성을 설정하지 않도록 요청하세요.

Kotlin 툴체인의 기본 동작은 1.6.20 이후로 이러한 속성을 포함하지 않으므로
이를 제거해도 심각한 영향은 없을 것으로 예상합니다. 가능한 대부분의 결과는 프로젝트를 다시 빌드한 직후에 표시됩니다.

라이브러리 작성자이고 추가로 안전하게 하려면 소비자가 라이브러리와 함께 작업할 수 있는지 확인하세요.

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* 1.8.20: 이러한 속성이 사용될 때 경고를 보고합니다.
* 1.9.20: 이 경고를 오류로 높입니다.
* 2.0: 이러한 속성을 제거합니다. Kotlin Gradle plugin은 해당 사용을 무시합니다.

이러한 속성을 제거한 후 문제가 발생하는 드문 경우에는 [YouTrack에 이슈를 생성하세요](https://kotl.in/issue).

<anchor name="target-presets-deprecation"/>
### 지원 중단된 타겟 프리셋 API

**무엇이 변경되었나요?**

초기 개발 단계에서 Kotlin Multiplatform은 소위 _타겟 프리셋_으로 작업하기 위한 API를 도입했습니다.
각 타겟 프리셋은 본질적으로 Kotlin Multiplatform 타겟을 위한 팩토리를 나타냈습니다. 이 API는 `jvm()` 또는 `iosSimulatorArm64()`와 같은 DSL 함수가 훨씬 더
간단하고 간결하면서도 동일한 사용 사례를 다루기 때문에 대체로 중복되는 것으로 판명되었습니다.

혼동을 줄이고 더 명확한 지침을 제공하기 위해 이제 모든 프리셋 관련 API가 지원 중단되었으며 향후 릴리스에서
Kotlin Gradle plugin의 공용 API에서 제거될 예정입니다. 여기에는 다음이 포함됩니다.

* `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension`의 `presets` 속성
* `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 인터페이스 및 모든 상속자
* `fromPreset` 오버로드

**현재 가장 좋은 방법은 무엇인가요?**

각각의 [Kotlin 타겟](multiplatform-dsl-reference#targets)을 대신 사용하세요. 예를 들면 다음과 같습니다.
<table>
<tr>
<td>
이전
</td>
<td>
현재
</td>
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

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* 1.9.20: 프리셋 관련 API의 모든 사용에 대한 경고를 보고합니다.
* 2.0: 이 경고를 오류로 높입니다.
* &gt;2.0: Kotlin Gradle plugin의 공용 API에서 프리셋 관련 API를 제거합니다. 여전히 사용하는 소스는
  "확인되지 않은 참조" 오류로 실패하고 바이너리(예: Gradle plugin)는 Kotlin Gradle plugin의 최신 버전으로 다시 컴파일되지 않는 한 연결 오류로 실패할 수 있습니다.

<anchor name="target-shortcuts-deprecation"/>
### 지원 중단된 Apple 타겟 바로 가기

**무엇이 변경되었나요?**

Kotlin Multiplatform DSL에서 `ios()`, `watchos()` 및 `tvos()` 타겟 바로 가기를 지원 중단하고 있습니다. 이는 Apple 타겟에 대한 소스 세트 계층 구조를 부분적으로
만들도록 설계되었습니다. 그러나 확장하기 어렵고 때로는 혼란스러울 수 있음이 입증되었습니다.

예를 들어 `ios()` 바로 가기는 `iosArm64` 및 `iosX64` 타겟을 모두 만들었지만 Apple M 칩이 있는 호스트에서 작업할 때 필요한 `iosSimulatorArm64`
타겟은 포함하지 않았습니다. 그러나 이 바로 가기를 변경하는 것은 구현하기 어려웠고 기존 사용자 프로젝트에서 문제를 일으킬 수 있었습니다.

**현재 가장 좋은 방법은 무엇인가요?**

Kotlin Gradle plugin은 이제 기본 제공 계층 구조 템플릿을 제공합니다. Kotlin 1.9.20부터는 기본적으로 활성화되어 있으며 인기 있는 사용 사례에 대한 미리 정의된 중간 소스 세트가 포함되어 있습니다.

바로 가기 대신 타겟 목록을 지정해야 하며 그러면 plugin이 이 목록을 기반으로 중간
소스 세트를 자동으로 설정합니다.

예를 들어 프로젝트에 `iosArm64` 및 `iosSimulatorArm64` 타겟이 있는 경우 plugin은 `iosMain` 및 `iosTest` 중간 소스 세트를 자동으로 만듭니다. `iosArm64` 및 `macosArm64` 타겟이 있는 경우 `appleMain` 및
`appleTest` 소스 세트가 생성됩니다.

자세한 내용은 [계층 구조 프로젝트 구조](multiplatform-hierarchy)를 참조하세요.

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* 1.9.20: `ios()`, `watchos()` 및 `tvos()` 타겟 바로 가기가 사용될 때 경고를 보고합니다.
  기본 계층 구조 템플릿이 대신 기본적으로 활성화됩니다.
* 2.1.0: 타겟 바로 가기가 사용될 때 오류를 보고합니다.
* 2.2.0: Kotlin Multiplatform Gradle plugin에서 타겟 바로 가기 DSL을 제거합니다.

### Kotlin 업그레이드 후 iOS 프레임워크의 잘못된 버전

**문제는 무엇인가요?**

직접 통합을 사용하는 경우 Kotlin 코드의 변경 사항이 Xcode의 iOS 앱에 반영되지 않을 수 있습니다.
직접 통합은 멀티 플랫폼 프로젝트의 iOS
프레임워크를 Xcode의 iOS 앱에 연결하는 `embedAndSignAppleFrameworkForXcode` 작업을 통해 설정됩니다.

멀티 플랫폼 프로젝트에서 Kotlin 버전을 1.9.2x에서 2.0.0으로 업그레이드(또는 2.0.0에서 1.9.2x로 다운그레이드)한 다음
Kotlin 파일을 변경하고 앱을 빌드하려고 할 때 이러한 문제가 발생할 수 있습니다. Xcode가 이전 버전의 iOS
프레임워크를 잘못 사용하는 경우가 있습니다. 따라서 Xcode의 iOS 앱에서 변경 사항이 표시되지 않습니다.

**해결 방법은 무엇인가요?**

1. Xcode에서 **Product** | **Clean Build Folder**를 사용하여 빌드 디렉터리를 정리합니다.
2. 터미널에서 다음 명령을 실행합니다.

   ```none
   ./gradlew clean
   ```

3. 새 버전의 iOS 프레임워크가 사용되는지 확인하기 위해 앱을 다시 빌드합니다.

**문제는 언제 해결될 예정인가요?**

Kotlin 2.0.10에서 이 문제를 해결할 계획입니다.
[Kotlin Early Access Preview 참여](eap) 섹션에서 Kotlin 2.0.10의 미리 보기 버전을 사용할 수 있는지 확인할 수 있습니다.

자세한 내용은 [YouTrack의 해당 문제](https://youtrack.jetbrains.com/issue/KT-68257)를 참조하세요.

## Kotlin 1.9.0−1.9.25

이 섹션에서는 지원 중단 주기가 종료되고 Kotlin 1.9.0−1.9.25에서 적용되는 호환되지 않는 변경 사항을 다룹니다.

<anchor name="compilation-source-deprecation"/>
### Kotlin 소스 세트를 Kotlin 컴파일에 직접 추가하기 위한 지원 중단된 API

**무엇이 변경되었나요?**

`KotlinCompilation.source`에 대한 액세스가 지원 중단되었습니다. 다음과 같은 코드는 지원 중단 경고를 생성합니다.

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

**현재 가장 좋은 방법은 무엇인가요?**

`KotlinCompilation.source(someSourceSet)`을 대체하려면 `KotlinCompilation`의
기본 소스 세트에서 `someSourceSet`으로의 `dependsOn` 관계를 추가합니다. 더 짧고 읽기 쉬운 `by getting`을 사용하여 소스를 직접 참조하는 것이 좋습니다.
그러나 모든 경우에 적용할 수 있는 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`을 사용할 수도 있습니다.

다음 방법 중 하나로 위의 코드를 변경할 수 있습니다.

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
        
        // 옵션 #1. 더 짧고 읽기 쉬우며 가능한 경우 사용합니다.
        // 일반적으로 기본 소스 세트의 이름은
        // 타겟 이름과 컴파일 이름을 간단히 연결한 것입니다.
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // 옵션 #2. 일반적인 솔루션이며 빌드 스크립트에 더 고급 접근 방식이 필요한 경우 사용합니다.
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* 1.9.0: `KotlinComplation.source`가 사용될 때 지원 중단 경고를 표시합니다.
* 1.9.20: 이 경고를 오류로 높입니다.
* &gt;1.9.20: Kotlin Gradle plugin에서 `KotlinComplation.source`를 제거합니다. 사용하려는 시도는 빌드 스크립트 컴파일 중에 "확인되지 않은
  참조" 오류로 이어집니다.

<anchor name="kotlin-js-plugin-deprecation"/>
### `kotlin-js` Gradle plugin에서 `kotlin-multiplatform` Gradle plugin으로 마이그레이션

**무엇이 변경되었나요?**

Kotlin 1.9.0부터는 `kotlin-js` Gradle plugin이
지원 중단되었습니다. 기본적으로 `js()` 타겟이 있는 `kotlin-multiplatform` plugin의 기능을 복제하고 내부적으로 동일한 구현을 공유했습니다.
이러한 중복은 혼란을 야기하고 Kotlin 팀의 유지 관리 부담을 가중시켰습니다. 대신 `js()` 타겟이 있는 `kotlin-multiplatform` Gradle plugin으로 마이그레이션하는 것이 좋습니다.

**현재 가장 좋은 방법은 무엇인가요?**

1. 프로젝트에서 `kotlin-js` Gradle plugin을 제거하고 `pluginManagement {}` 블록을 사용하는 경우 `settings.gradle.kts` 파일에서 `kotlin-multiplatform`을 적용합니다.

   <Tabs>
   <TabItem value="kotlin-js" label="kotlin-js">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // 다음 줄을 제거합니다.
           kotlin("js") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </TabItem>
   <TabItem value="kotlin-multiplatform" label="kotlin-multiplatform">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // 대신 다음 줄을 추가합니다.
           kotlin("multiplatform") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </TabItem>
   </Tabs>

   다른 방법으로 plugin을 적용하는 경우
   [Gradle 설명서](https://docs.gradle.org/current/userguide/plugins.html)에서 마이그레이션 지침을 참조하세요.

2. 소스 파일을 `main` 및 `test` 폴더에서 동일한 디렉터리의 `jsMain` 및 `jsTest` 폴더로 이동합니다.
3. 종속성 선언을 조정합니다.

   * `sourceSets {}` 블록을 사용하고 해당 소스 세트의 종속성을 구성하는 것이 좋습니다.
     프로덕션 종속성의 경우 `jsMain {}`, 테스트 종속성의 경우 `jsTest {}`입니다.
     자세한 내용은 [종속성 추가](multiplatform-add-dependencies)를 참조하세요.
   * 그러나 최상위 블록에서 종속성을 선언하려면
     선언을 `api("group:artifact:1.0")`에서 `add("jsMainApi", "group:artifact:1.0")` 등으로 변경합니다.

      이 경우 최상위 `dependencies {}` 블록이 `kotlin {}` 블록 **뒤**에 와야 합니다. 그렇지 않으면 "구성을 찾을 수 없음" 오류가 발생합니다.

   `build.gradle.kts` 파일에서 다음 방법 중 하나로 코드를 변경할 수 있습니다.

   <Tabs>
   <TabItem value="kotlin-js" label="kotlin-js">

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
   <TabItem value="kotlin-multiplatform" label="kotlin-multiplatform">

   ```kotlin
   // build.gradle.kts:
   plugins {
       kotlin("multiplatform") version "1.9.0"
   }
   
   kotlin {
       js {
           // ...
       }
       
       // 옵션 #1. sourceSets {} 블록에서 종속성을 선언합니다.
       sourceSets {
           val jsMain by getting {
               dependencies {
                   // 여기에는 js 접두사가 필요하지 않습니다. 최상위 블록에서 복사하여 붙여넣을 수 있습니다.
                   implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
               }
          }
       }
   }
   
   dependencies {
       // 옵션 #2. 종속성 선언에 js 접두사를 추가합니다.
       add("jsTestImplementation", kotlin("test"))
   }
   ```

   </TabItem>
   </Tabs>

4. `kotlin {}` 블록 내에서 Kotlin Gradle plugin에서 제공하는 DSL은 대부분의 경우 변경되지 않습니다. 그러나
   작업 및 구성과 같은 하위 수준 Gradle 엔터티를 이름으로 참조하는 경우 이제 `js` 접두사를 추가하여 조정해야 합니다. 예를 들어 `jsBrowserTest` 이름으로 `browserTest` 작업을 찾을 수 있습니다.

**변경 사항은 언제부터 적용되나요?**

1.9.0에서는 `kotlin-js` Gradle plugin을 사용하면 지원 중단 경고가 발생합니다.

<anchor name="jvmWithJava-preset-deprecation"/>
### 지원 중단된 `jvmWithJava` 프리셋

**무엇이 변경되었나요?**

`targetPresets.jvmWithJava`는 지원 중단되었으며 사용하지 않는 것이 좋습니다.

**현재 가장 좋은 방법은 무엇인가요?**

대신 `jvm { withJava() }` 타겟을 사용하세요. `jvm { withJava() }`로 전환한 후에는
`.java` 소스가 있는 소스 디렉터리의 경로를 조정해야 합니다.

예를 들어 기본 이름 "jvm"으로 `jvm` 타겟을 사용하는 경우

| 이전          | 현재                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* 1.3.40: `targetPresets.jvmWithJava`가 사용될 때 경고를 표시합니다.
* 1.9.20: 이 경고를 오류로 높입니다.
* >1.9.20: `targetPresets.jvmWithJava` API를 제거합니다. 사용하려는 시도는 빌드 스크립트 컴파일 실패로 이어집니다.

전체 `targetPresets` API는 지원 중단되었지만 `jvmWithJava` 프리셋에는 다른 지원 중단 타임라인이 있습니다.

:::

<anchor name="android-sourceset-layout-v1-deprecation"/>
### 지원 중단된 레거시 Android 소스 세트 레이아웃

**무엇이 변경되었나요?**

[새로운 Android 소스 세트 레이아웃](multiplatform-android-layout)은 Kotlin 1.9.0부터 기본적으로 사용됩니다.
레거시 레이아웃에 대한 지원은 지원 중단되었으며 `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 속성을 사용하면
이제 지원 중단 진단이 트리거됩니다.

**변경 사항은 언제부터 적용되나요?**

다음은 계획된 지원 중단 주기입니다.

* &lt;=1.9.0: `kotlin.mpp.androidSourceSetLayoutVersion=1`이 사용될 때 경고를 보고합니다. 경고는
  `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 속성으로 억제할 수 있습니다.
* 1.9.20: 이 경고를 오류로 높입니다. 오류는 **억제할 수 없습니다**.
* &gt;1.9.20: `kotlin.mpp.androidSourceSetLayoutVersion=1`에 대한 지원을 제거합니다. Kotlin Gradle plugin은 속성을 무시합니다.

<anchor name="common-sourceset-with-dependson-deprecation"/>
### 지원 중단된