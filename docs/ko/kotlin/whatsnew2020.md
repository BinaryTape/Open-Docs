[//]: # (title: Kotlin 2.0.20의 새로운 기능)

_[릴리스 날짜: 2024년 8월 22일](releases.md#release-details)_

Kotlin 2.0.20 릴리스가 출시되었습니다! 이 버전에는 Kotlin K2 컴파일러가 Stable로 발표된 Kotlin 2.0.0에 대한 성능 개선 및 버그 수정 사항이 포함되어 있습니다. 이번 릴리스의 추가적인 주요 변경 사항은 다음과 같습니다.

*   [생성자와 동일한 가시성을 갖는 데이터 클래스 `copy` 함수](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
*   [멀티플랫폼 프로젝트에서 기본 타겟 계층의 소스 세트에 대한 정적 접근자 사용 가능](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
*   [가비지 컬렉터(GC)에서 Kotlin/Native의 동시 마킹(concurrent marking) 가능](#concurrent-marking-in-garbage-collector)
*   [Kotlin/Wasm의 `@ExperimentalWasmDsl` 어노테이션(annotation) 새 위치](#new-location-of-experimentalwasmdsl-annotation)
*   [Gradle 8.6–8.8 버전 지원 추가](#gradle)
*   [새로운 옵션을 통해 Gradle 프로젝트 간 JVM 아티팩트(artifact)를 클래스 파일로 공유 가능](#option-to-share-jvm-artifacts-between-projects-as-class-files)
*   [Compose 컴파일러 업데이트](#compose-compiler)
*   [공통 Kotlin 표준 라이브러리에 UUID 지원 추가](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 지원

2.0.20을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다. IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다. 빌드 스크립트에서 Kotlin 버전을 2.0.20으로 변경하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하십시오.

## 언어

Kotlin 2.0.20은 데이터 클래스의 일관성을 개선하고 실험적 컨텍스트 리시버(context receivers) 기능을 대체하기 위한 변경 사항을 도입하기 시작했습니다.

### 생성자와 동일한 가시성을 갖는 데이터 클래스 `copy` 함수

현재 `private` 생성자를 사용하여 데이터 클래스를 생성하면 자동 생성되는 `copy()` 함수가 동일한 가시성을 갖지 않습니다. 이는 코드에서 나중에 문제를 일으킬 수 있습니다. 향후 Kotlin 릴리스에서는 `copy()` 함수의 기본 가시성이 생성자와 동일하게 동작하도록 도입할 예정입니다. 이 변경 사항은 코드를 가능한 한 원활하게 마이그레이션하는 데 도움이 되도록 점진적으로 도입될 것입니다.

마이그레이션 계획은 Kotlin 2.0.20부터 시작되며, 향후 가시성이 변경될 코드에 경고를 발생시킵니다. 예를 들면 다음과 같습니다.

```kotlin
// Triggers a warning in 2.0.20
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // Triggers a warning in 2.0.20
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

마이그레이션 계획에 대한 최신 정보는 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914)의 해당 이슈를 참조하십시오.

이 동작에 대한 더 많은 제어권을 제공하기 위해 Kotlin 2.0.20에서는 두 가지 어노테이션을 도입했습니다.

*   `@ConsistentCopyVisibility`: 향후 릴리스에서 기본값으로 설정하기 전에 현재 이 동작을 옵트인(opt-in)합니다.
*   `@ExposedCopyVisibility`: 이 동작을 옵트아웃(opt-out)하고 선언 지점에서 경고를 억제합니다. 이 어노테이션을 사용하더라도 `copy()` 함수가 호출될 때 컴파일러는 여전히 경고를 보고합니다.

개별 클래스 대신 전체 모듈에 대해 2.0.20에서 이미 새 동작을 옵트인하려면 `-Xconsistent-data-class-copy-visibility` 컴파일러 옵션을 사용할 수 있습니다. 이 옵션은 모듈의 모든 데이터 클래스에 `@ConsistentCopyVisibility` 어노테이션을 추가하는 것과 동일한 효과를 가집니다.

### 컨텍스트 리시버(context receivers)를 컨텍스트 파라미터(context parameters)로 단계적 대체

Kotlin 1.6.20에서 [컨텍스트 리시버(context receivers)](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)를 [실험적](components-stability.md#stability-levels-explained) 기능으로 도입했습니다. 커뮤니티 피드백을 수렴한 후, 이 접근 방식을 계속하지 않고 다른 방향을 취하기로 결정했습니다.

향후 Kotlin 릴리스에서는 컨텍스트 리시버가 컨텍스트 파라미터(context parameters)로 대체될 예정입니다. 컨텍스트 파라미터는 아직 설계 단계에 있으며, 제안 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)에서 확인할 수 있습니다.

컨텍스트 파라미터의 구현은 컴파일러에 상당한 변경 사항을 필요로 하므로, 컨텍스트 리시버와 컨텍스트 파라미터를 동시에 지원하지 않기로 결정했습니다. 이 결정은 구현을 크게 단순화하고 불안정한 동작의 위험을 최소화합니다.

컨텍스트 리시버가 이미 많은 개발자들에 의해 사용되고 있음을 이해합니다. 따라서 컨텍스트 리시버에 대한 지원을 점진적으로 제거하기 시작할 것입니다. 마이그레이션 계획은 Kotlin 2.0.20부터 시작되며, `-Xcontext-receivers` 컴파일러 옵션과 함께 컨텍스트 리시버를 사용할 때 코드에 경고를 발생시킵니다. 예를 들면 다음과 같습니다.

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

이 경고는 향후 Kotlin 릴리스에서 오류로 전환될 것입니다.

코드에서 컨텍스트 리시버를 사용하는 경우, 다음 중 하나를 사용하도록 코드를 마이그레이션하는 것을 권장합니다.

*   명시적 파라미터.

    <table>
        <tr>
            <td>이전</td>
            <td>이후</td>
        </tr>
        <tr>
     <td>

    ```kotlin
    context(ContextReceiverType)
    fun someFunction() {
        contextReceiverMember()
    }
    ```

     </td>
     <td>

    ```kotlin
    fun someFunction(explicitContext: ContextReceiverType) {
        explicitContext.contextReceiverMember()
    }
    ```

     </td>
     </tr>
    </table>

*   확장 멤버 함수(가능한 경우).

    <table>
        <tr>
            <td>이전</td>
            <td>이후</td>
        </tr>
        <tr>
     <td>

    ```kotlin
    context(ContextReceiverType)
    fun contextReceiverMember() = TODO()
    
    context(ContextReceiverType)
    fun someFunction() {
        contextReceiverMember()
    }
    ```

     </td>
     <td>

    ```kotlin
    class ContextReceiverType {
        fun contextReceiverMember() = TODO()
    }
    
    fun ContextReceiverType.someFunction() {
        contextReceiverMember()
    }
    ```

     </td>
     </tr>
    </table>

또는 컴파일러에서 컨텍스트 파라미터가 지원되는 Kotlin 릴리스까지 기다릴 수 있습니다. 컨텍스트 파라미터는 초기에는 실험적 기능으로 도입될 예정입니다.

## Kotlin Multiplatform

Kotlin 2.0.20은 멀티플랫폼 프로젝트의 소스 세트(source set) 관리를 개선하고, Gradle의 최근 변경 사항으로 인해 일부 Gradle Java 플러그인과의 호환성을 비활성화합니다.

### 기본 타겟 계층의 소스 세트에 대한 정적 접근자(static accessors)

Kotlin 1.9.20부터 [기본 계층 템플릿(default hierarchy template)](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)이 모든 Kotlin Multiplatform 프로젝트에 자동으로 적용됩니다. 그리고 기본 계층 템플릿의 모든 소스 세트에 대해 Kotlin Gradle 플러그인은 타입 안전 접근자(type-safe accessors)를 제공했습니다. 이를 통해 `by getting` 또는 `by creating` 구문을 사용하지 않고도 지정된 모든 타겟의 소스 세트에 접근할 수 있게 되었습니다.

Kotlin 2.0.20은 IDE 경험을 더욱 향상시키는 것을 목표로 합니다. 이제 `sourceSets {}` 블록에서 기본 계층 템플릿의 모든 소스 세트에 대한 정적 접근자(static accessors)를 제공합니다. 이 변경 사항이 이름으로 소스 세트에 접근하는 것을 더 쉽고 예측 가능하게 만들 것이라고 믿습니다.

이제 각 소스 세트에는 샘플과 함께 자세한 KDoc 주석이 있으며, 해당 타겟을 먼저 선언하지 않고 소스 세트에 접근하려고 시도할 경우 경고와 함께 진단 메시지가 표시됩니다.

```kotlin
kotlin {
    jvm()
    linuxX64()
    linuxArm64()
    mingwX64()
  
    sourceSets {
        commonMain.languageSettings {
            progressiveMode = true
        }

        jvmMain { }
        linuxX64Main { }
        linuxArm64Main { }
        // Warning: accessing source set without registering the target
        iosX64Main { }
    }
}
```

![Accessing the source sets by name](accessing-sourse-sets.png){width=700}

Kotlin Multiplatform의 [계층적 프로젝트 구조](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)에 대해 자세히 알아보십시오.

### Kotlin Multiplatform Gradle 플러그인 및 Gradle Java 플러그인과의 호환성 비활성화

Kotlin 2.0.20에서는 Kotlin Multiplatform Gradle 플러그인과 다음 Gradle Java 플러그인 중 하나를 동일한 프로젝트에 적용할 때 사용 중단 경고를 도입합니다: [Java](https://docs.gradle.org/current/userguide/java_plugin.html), [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html), 및 [Application](https://docs.gradle.org/current/userguide/application_plugin.html). 이 경고는 멀티플랫폼 프로젝트의 다른 Gradle 플러그인이 Gradle Java 플러그인을 적용할 때도 나타납니다. 예를 들어, [Spring Boot Gradle 플러그인](https://docs.spring.io/spring-boot/gradle-plugin/index.html)은 Application 플러그인을 자동으로 적용합니다.

Kotlin Multiplatform의 프로젝트 모델과 Gradle의 Java 생태계 플러그인 간의 근본적인 호환성 문제로 인해 이 사용 중단 경고를 추가했습니다. Gradle의 Java 생태계 플러그인은 현재 다른 플러그인이 다음을 수행할 수 있다는 점을 고려하지 않습니다.

*   Java 생태계 플러그인과 다른 방식으로 JVM 타겟을 게시하거나 컴파일할 수 있습니다.
*   JVM과 Android와 같이 동일한 프로젝트에 두 개의 다른 JVM 타겟을 가질 수 있습니다.
*   잠재적으로 여러 개의 비-JVM 타겟을 포함하는 복잡한 멀티플랫폼 프로젝트 구조를 가질 수 있습니다.

안타깝게도 Gradle은 현재 이러한 문제를 해결할 API를 제공하지 않습니다.

이전에 Kotlin Multiplatform에서 Java 생태계 플러그인 통합을 돕기 위해 일부 임시 해결책(workarounds)을 사용했습니다. 그러나 이러한 임시 해결책은 호환성 문제를 실제로 해결하지 못했으며, Gradle 8.8 릴리스 이후로는 더 이상 이러한 임시 해결책이 불가능합니다. 자세한 내용은 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)를 참조하십시오.

이 호환성 문제를 정확히 어떻게 해결할지는 아직 알 수 없지만, Kotlin Multiplatform 프로젝트에서 어떤 형태의 Java 소스 컴파일에 대한 지원을 계속할 것을 약속합니다. 최소한, 멀티플랫폼 프로젝트 내에서 Java 소스 컴파일 및 Gradle의 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 플러그인 사용을 지원할 것입니다.

그 동안 멀티플랫폼 프로젝트에서 이 사용 중단 경고가 표시되는 경우, 다음을 권장합니다.
1.  프로젝트에 실제로 Gradle Java 플러그인이 필요한지 확인하십시오. 필요하지 않다면 제거를 고려하십시오.
2.  Gradle Java 플러그인이 단일 태스크(task)에만 사용되는지 확인하십시오. 그렇다면 큰 노력 없이 플러그인을 제거할 수 있습니다. 예를 들어, 태스크가 Javadoc JAR 파일을 생성하기 위해 Gradle Java 플러그인을 사용하는 경우, 대신 Javadoc 태스크를 수동으로 정의할 수 있습니다.

그렇지 않고 멀티플랫폼 프로젝트에서 Kotlin Multiplatform Gradle 플러그인과 이러한 Gradle Java 플러그인을 모두 사용하려면 다음을 권장합니다.

1.  멀티플랫폼 프로젝트에 별도의 서브프로젝트를 생성하십시오.
2.  별도의 서브프로젝트에 Gradle Java 플러그인을 적용하십시오.
3.  별도의 서브프로젝트에 상위 멀티플랫폼 프로젝트에 대한 종속성을 추가하십시오.

> 별도의 서브프로젝트는 멀티플랫폼 프로젝트가 **아니어야** 하며, 멀티플랫폼 프로젝트에 대한 종속성을 설정하는 데만 사용해야 합니다.
>
{style="warning"}

예를 들어, `my-main-project`라는 멀티플랫폼 프로젝트가 있고 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 플러그인을 사용하여 JVM 애플리케이션을 실행하려고 합니다.

`subproject-A`라는 서브프로젝트를 생성하면 상위 프로젝트 구조는 다음과 같아야 합니다.

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

서브프로젝트의 `build.gradle.kts` 파일에서 `plugins {}` 블록에 Application 플러그인을 적용하십시오.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("application")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('application')
}
```

</tab>
</tabs>

서브프로젝트의 `build.gradle.kts` 파일에 상위 멀티플랫폼 프로젝트에 대한 종속성을 추가하십시오.

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

이제 상위 프로젝트가 두 플러그인 모두와 작동하도록 설정되었습니다.

## Kotlin/Native

Kotlin/Native는 가비지 컬렉터(GC) 및 Swift/Objective-C에서 Kotlin suspend 함수를 호출하는 기능에 대한 개선 사항을 제공합니다.

### 가비지 컬렉터(GC)의 동시 마킹(concurrent marking)

Kotlin 2.0.20에서 JetBrains 팀은 Kotlin/Native 런타임 성능 개선을 위한 또 다른 단계를 밟습니다. 가비지 컬렉터(GC)의 동시 마킹(concurrent marking)에 대한 실험적 지원을 추가했습니다.

기본적으로 GC가 힙(heap)의 객체를 마킹할 때 애플리케이션 스레드는 일시 중지되어야 합니다. 이는 Compose Multiplatform으로 구축된 UI 애플리케이션과 같이 지연 시간에 민감한 애플리케이션의 성능에 중요한 GC 일시 정지 시간의 지속 시간에 크게 영향을 미칩니다.

이제 가비지 컬렉션의 마킹 단계가 애플리케이션 스레드와 동시에 실행될 수 있습니다. 이는 GC 일시 정지 시간을 크게 단축하고 앱 응답성을 향상시키는 데 도움이 될 것입니다.

#### 활성화 방법

이 기능은 현재 [실험적](components-stability.md#stability-levels-explained)입니다. 이를 활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하십시오.

```none
kotlin.native.binary.gc=cms
```

[YouTrack](https://kotl.in/issue) 이슈 트래커에 문제가 발생하면 보고해 주십시오.

### 비트코드 임베딩(bitcode embedding) 지원 제거

Kotlin 2.0.20부터 Kotlin/Native 컴파일러는 더 이상 비트코드 임베딩을 지원하지 않습니다. 비트코드 임베딩은 Xcode 14에서 사용 중단되었고 Xcode 15에서는 모든 Apple 타겟에서 제거되었습니다.

이제 프레임워크 구성의 `embedBitcode` 매개변수와 `-Xembed-bitcode` 및 `-Xembed-bitcode-marker` 명령줄 인수는 사용 중단되었습니다.

이전 버전의 Xcode를 계속 사용하지만 Kotlin 2.0.20으로 업그레이드하려면 Xcode 프로젝트에서 비트코드 임베딩을 비활성화하십시오.

### Signposts를 사용한 GC 성능 모니터링 변경 사항

Kotlin 2.0.0에서는 Xcode Instruments를 통해 Kotlin/Native 가비지 컬렉터(GC)의 성능을 모니터링할 수 있었습니다. Instruments에는 GC 일시 정지를 이벤트로 표시할 수 있는 Signposts 도구가 포함되어 있습니다. 이는 iOS 앱에서 GC 관련 멈춤 현상을 확인할 때 유용합니다.

이 기능은 기본적으로 활성화되어 있었지만, 안타깝게도 애플리케이션이 Xcode Instruments와 동시에 실행될 때 때때로 충돌을 유발했습니다. Kotlin 2.0.20부터는 다음 컴파일러 옵션을 사용하여 명시적 옵트인(opt-in)이 필요합니다.

```none
-Xbinary=enableSafepointSignposts=true
```

GC 성능 분석에 대한 자세한 내용은 [문서](native-memory-manager.md#monitor-gc-performance)를 참조하십시오.

### Swift/Objective-C에서 Kotlin suspend 함수를 비-메인 스레드에서 호출할 수 있는 기능

이전에는 Kotlin/Native에 기본 제한이 있어 Swift 및 Objective-C에서 Kotlin suspend 함수를 메인 스레드에서만 호출할 수 있었습니다. Kotlin 2.0.20은 이러한 제한을 해제하여 Swift/Objective-C에서 Kotlin `suspend` 함수를 어떤 스레드에서도 실행할 수 있도록 합니다.

이전에 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` 바이너리 옵션을 사용하여 비-메인 스레드에 대한 기본 동작을 변경했다면, 이제 `gradle.properties` 파일에서 해당 옵션을 제거할 수 있습니다.

## Kotlin/Wasm

Kotlin 2.0.20에서 Kotlin/Wasm은 명명된 익스포트(named exports)로의 마이그레이션을 계속하고 `@ExperimentalWasmDsl` 어노테이션의 위치를 변경합니다.

### 기본 익스포트(default export) 사용 시 오류

명명된 익스포트로의 마이그레이션의 일환으로, 이전에 JavaScript에서 Kotlin/Wasm 익스포트에 대해 기본 임포트(default import)를 사용할 때 콘솔에 경고 메시지가 출력되었습니다.

명명된 익스포트를 완전히 지원하기 위해 이 경고는 이제 오류로 상향 조정되었습니다. 기본 임포트를 사용하는 경우 다음 오류 메시지가 발생합니다.

```text
Do not use default import. Use the corresponding named import instead.
```

이 변경 사항은 명명된 익스포트로 마이그레이션하기 위한 사용 중단 주기(deprecation cycle)의 일부입니다. 각 단계에서 예상할 수 있는 내용은 다음과 같습니다.

*   **버전 2.0.0**: 기본 익스포트를 통해 엔티티를 익스포트하는 것이 사용 중단되었다는 설명과 함께 경고 메시지가 콘솔에 출력됩니다.
*   **버전 2.0.20**: 오류가 발생하며, 해당 명명된 임포트를 사용하도록 요청합니다.
*   **버전 2.1.0**: 기본 임포트 사용이 완전히 제거됩니다.

### `@ExperimentalWasmDsl` 어노테이션의 새 위치

이전에는 WebAssembly(Wasm) 기능을 위한 `@ExperimentalWasmDsl` 어노테이션이 Kotlin Gradle 플러그인 내의 다음 위치에 있었습니다.

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

2.0.20에서는 `@ExperimentalWasmDsl` 어노테이션이 다음 위치로 변경되었습니다.

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

이전 위치는 이제 사용 중단되었으며, 확인되지 않은 참조로 인해 빌드 실패가 발생할 수 있습니다.

`@ExperimentalWasmDsl` 어노테이션의 새 위치를 반영하려면 Gradle 빌드 스크립트의 임포트(import) 문을 업데이트하십시오. 새 `@ExperimentalWasmDsl` 위치에 대한 명시적 임포트를 사용하십시오.

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

또는 이전 패키지에서 이 와일드카드 임포트 문을 제거하십시오.

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS는 JavaScript에서 정적 멤버(static members)를 지원하고 JavaScript에서 Kotlin 컬렉션을 생성하기 위한 몇 가지 실험적 기능을 도입합니다.

### JavaScript에서 Kotlin 정적 멤버(static members)를 사용할 수 있는 기능 지원

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic)에서 귀하의 피드백을 환영합니다.
>
{style="warning"}

Kotlin 2.0.20부터 `@JsStatic` 어노테이션을 사용할 수 있습니다. 이 어노테이션은 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)과 유사하게 작동하며, 컴파일러에게 대상 선언에 대한 추가 정적 메서드를 생성하도록 지시합니다. 이는 Kotlin 코드의 정적 멤버를 JavaScript에서 직접 사용하는 데 도움이 됩니다.

`@JsStatic` 어노테이션은 명명된 객체(named objects)에 정의된 함수뿐만 아니라 클래스 및 인터페이스 내부에 선언된 동반 객체(companion objects)의 함수에도 사용할 수 있습니다. 컴파일러는 객체의 정적 메서드와 객체 자체의 인스턴스 메서드를 모두 생성합니다. 예를 들면 다음과 같습니다.

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

이제 `callStatic()`은 JavaScript에서 정적이지만 `callNonStatic()`은 그렇지 않습니다.

```javascript
C.callStatic();              // Works, accessing the static function
C.callNonStatic();           // Error, not a static function in the generated JavaScript
C.Companion.callStatic();    // Instance method remains
C.Companion.callNonStatic(); // The only way it works
```

`@JsStatic` 어노테이션을 객체 또는 동반 객체의 프로퍼티(property)에 적용하여 해당 getter 및 setter 메서드를 해당 객체 또는 동반 객체를 포함하는 클래스의 정적 멤버로 만드는 것도 가능합니다.

### JavaScript에서 Kotlin 컬렉션을 생성할 수 있는 기능

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript)에서 귀하의 피드백을 환영합니다.
>
{style="warning"}

Kotlin 2.0.0은 Kotlin 컬렉션을 JavaScript(및 TypeScript)로 익스포트(export)하는 기능을 도입했습니다. 이제 JetBrains 팀은 컬렉션 상호 운용성(interoperability)을 개선하기 위한 또 다른 단계를 밟습니다. Kotlin 2.0.20부터 JavaScript/TypeScript 측에서 직접 Kotlin 컬렉션을 생성할 수 있습니다.

JavaScript에서 Kotlin 컬렉션을 생성하여 익스포트된 생성자 또는 함수에 인수로 전달할 수 있습니다. 익스포트된 선언 내에서 컬렉션을 언급하자마자 Kotlin은 JavaScript/TypeScript에서 사용할 수 있는 컬렉션에 대한 팩토리(factory)를 생성합니다.

다음 익스포트된 함수를 살펴보십시오.

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

`MutableMap` 컬렉션이 언급되었으므로 Kotlin은 JavaScript/TypeScript에서 사용할 수 있는 팩토리 메서드를 가진 객체를 생성합니다. 이 팩토리 메서드는 JavaScript `Map`에서 `MutableMap`을 생성합니다.

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

이 기능은 `Set`, `Map`, `List` Kotlin 컬렉션 타입 및 변경 가능한 대응 객체에 사용할 수 있습니다.

## Gradle

Kotlin 2.0.20은 Gradle 6.8.3부터 8.6까지 완벽하게 호환됩니다. Gradle 8.7 및 8.8도 지원되지만, 한 가지 예외가 있습니다. Kotlin Multiplatform Gradle 플러그인을 사용하는 경우, JVM 타겟에서 `withJava()` 함수를 호출하는 멀티플랫폼 프로젝트에서 사용 중단 경고가 표시될 수 있습니다. 이 문제는 가능한 한 빨리 수정할 계획입니다.

자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)의 이슈를 참조하십시오.

최신 Gradle 릴리스까지의 Gradle 버전을 사용할 수도 있지만, 그렇게 할 경우 사용 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있다는 점을 염두에 두십시오.

이 버전은 JVM 히스토리 파일 기반의 오래된 점진적 컴파일(incremental compilation) 방식에 대한 사용 중단 프로세스를 시작하는 것과 프로젝트 간 JVM 아티팩트(artifact)를 공유하는 새로운 방법과 같은 변경 사항을 제공합니다.

### JVM 히스토리 파일 기반 점진적 컴파일(incremental compilation) 사용 중단

Kotlin 2.0.20에서는 JVM 히스토리 파일 기반의 점진적 컴파일 방식이 Kotlin 1.8.20부터 기본적으로 활성화된 새로운 점진적 컴파일 방식을 위해 사용 중단되었습니다.

JVM 히스토리 파일 기반의 점진적 컴파일 방식은 [Gradle의 빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)와 함께 작동하지 않고 컴파일 회피(compilation avoidance)를 지원하지 않는 등의 한계가 있었습니다. 대조적으로, 새로운 점진적 컴파일 방식은 이러한 한계를 극복하며 도입 이후 잘 작동했습니다.

새로운 점진적 컴파일 방식이 지난 두 번의 주요 Kotlin 릴리스에서 기본적으로 사용되었음을 감안하여, `kotlin.incremental.useClasspathSnapshot` Gradle 속성은 Kotlin 2.0.20에서 사용 중단되었습니다. 따라서 이 속성을 사용하여 옵트아웃하는 경우 사용 중단 경고가 표시됩니다.

### 프로젝트 간 JVM 아티팩트(artifact)를 클래스 파일로 공유하는 옵션

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts)에서 귀하의 피드백을 환영합니다. 옵트인(opt-in)이 필요합니다(자세한 내용은 아래 참조).
>
{style="warning"}

Kotlin 2.0.20에서는 JAR 파일과 같은 Kotlin/JVM 컴파일 결과물을 프로젝트 간에 공유하는 방식을 변경하는 새로운 접근 방식을 도입합니다. 이 접근 방식을 사용하면 Gradle의 `apiElements` 구성에 이제 컴파일된 `.class` 파일이 포함된 디렉토리에 대한 접근을 제공하는 보조 변형(variant)이 있습니다. 구성되면 프로젝트는 컴파일 중에 압축된 JAR 아티팩트를 요청하는 대신 이 디렉토리를 사용합니다. 이는 특히 점진적 빌드(incremental builds)의 경우 JAR 파일이 압축 및 압축 해제되는 횟수를 줄입니다.

테스트 결과, 이 새로운 접근 방식은 Linux 및 macOS 호스트에서 빌드 성능 개선을 제공할 수 있음을 보여줍니다. 그러나 Windows 호스트에서는 Windows가 파일 작업 시 I/O 작업을 처리하는 방식 때문에 성능 저하를 보였습니다.

이 새로운 접근 방식을 시도하려면 `gradle.properties` 파일에 다음 속성을 추가하십시오.

```none
kotlin.jvm.addClassesVariant=true
```

기본적으로 이 속성은 `false`로 설정되어 있으며 Gradle의 `apiElements` 변형은 압축된 JAR 아티팩트를 요청합니다.

> Gradle에는 Java 전용 프로젝트에서 컴파일 시 컴파일된 `.class` 파일이 포함된 디렉토리 **대신** 압축된 JAR 아티팩트만 노출하는 데 사용할 수 있는 관련 속성이 있습니다.
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 이 속성 및 그 목적에 대한 자세한 내용은 [대규모 멀티 프로젝트에서 Windows의 현저한 빌드 성능 저하](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)에 대한 Gradle 문서를 참조하십시오.
>
{style="note"}

이 새로운 접근 방식에 대한 귀하의 피드백을 환영합니다. 사용 중 성능 개선을 확인했습니까? [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts)에 댓글을 추가하여 알려주십시오.

### Kotlin Gradle 플러그인의 종속성 동작을 `java-test-fixtures` 플러그인과 일치시킴

Kotlin 2.0.20 이전에는 프로젝트에서 [`java-test-fixtures` 플러그인](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)을 사용한 경우 Gradle과 Kotlin Gradle 플러그인 간에 종속성 전파 방식에 차이가 있었습니다.

Kotlin Gradle 플러그인은 다음 종속성을 전파했습니다.

*   `java-test-fixtures` 플러그인의 `implementation` 및 `api` 종속성 유형에서 `test` 소스 세트 컴파일 클래스패스로.
*   메인 소스 세트의 `implementation` 및 `api` 종속성 유형에서 `java-test-fixtures` 플러그인의 소스 세트 컴파일 클래스패스로.

그러나 Gradle은 `api` 종속성 유형의 종속성만 전파했습니다.

이러한 동작의 차이로 인해 일부 프로젝트에서 클래스패스에 리소스 파일이 여러 번 발견되는 결과를 초래했습니다.

Kotlin 2.0.20부터 Kotlin Gradle 플러그인의 동작이 Gradle의 `java-test-fixtures` 플러그인과 일치하여 이 문제 또는 다른 Gradle 플러그인에 대한 문제가 더 이상 발생하지 않습니다.

이 변경 사항의 결과로, `test` 및 `testFixtures` 소스 세트의 일부 종속성에 더 이상 접근할 수 없을 수 있습니다. 이러한 경우 종속성 선언 유형을 `implementation`에서 `api`로 변경하거나, 영향을 받는 소스 세트에 새로운 종속성 선언을 추가하십시오.

### 컴파일 태스크가 아티팩트에 대한 태스크 종속성이 없는 드문 경우에 태스크 종속성 추가

2.0.20 이전에는 컴파일 태스크가 아티팩트 입력 중 하나에 대한 태스크 종속성이 누락된 시나리오가 있었습니다. 이는 종속된 컴파일 태스크의 결과가 불안정하다는 것을 의미했습니다. 때로는 아티팩트가 제때 생성되었지만, 때로는 그렇지 않았기 때문입니다.

이 문제를 해결하기 위해 Kotlin Gradle 플러그인은 이제 이러한 시나리오에서 필요한 태스크 종속성을 자동으로 추가합니다.

매우 드문 경우에, 이 새로운 동작이 순환 종속성 오류를 유발할 수 있다는 것을 발견했습니다. 예를 들어, 여러 컴파일이 있고 한 컴파일이 다른 컴파일의 모든 내부 선언을 볼 수 있으며, 생성된 아티팩트가 두 컴파일 태스크의 출력에 의존하는 경우 다음과 같은 오류가 표시될 수 있습니다.

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

이 순환 종속성 오류를 해결하기 위해 `archivesTaskOutputAsFriendModule`이라는 Gradle 속성을 추가했습니다.

기본적으로 이 속성은 태스크 종속성을 추적하기 위해 `true`로 설정됩니다. 컴파일 태스크에서 아티팩트 사용을 비활성화하여 태스크 종속성이 필요하지 않도록 하려면 `gradle.properties` 파일에 다음을 추가하십시오.

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330)의 이슈를 참조하십시오.

## Compose 컴파일러

Kotlin 2.0.20에서 Compose 컴파일러는 몇 가지 개선 사항을 얻습니다.

### 2.0.0에서 도입된 불필요한 리컴포지션(recompositions) 문제 해결

Compose 컴파일러 2.0.0에는 비-JVM 타겟을 사용하는 멀티플랫폼 프로젝트에서 타입의 안정성을 잘못 추론하여 불필요하거나 (심지어 무한한) 리컴포지션(recompositions)을 유발할 수 있는 문제가 있습니다. Kotlin 2.0.0용으로 제작된 Compose 앱을 2.0.10 버전 이상으로 업데이트하는 것을 강력히 권장합니다.

앱이 Compose 컴파일러 2.0.10 이상으로 빌드되었지만 2.0.0 버전으로 빌드된 종속성을 사용하는 경우, 이러한 오래된 종속성이 여전히 리컴포지션 문제를 일으킬 수 있습니다. 이를 방지하려면 종속성을 앱과 동일한 Compose 컴파일러로 빌드된 버전으로 업데이트하십시오.

### 컴파일러 옵션을 구성하는 새로운 방법

최상위 매개변수의 빈번한 변경을 피하기 위해 새로운 옵션 구성 메커니즘을 도입했습니다. `composeCompiler {}` 블록에 대한 최상위 항목을 생성하거나 제거하여 Compose 컴파일러 팀이 테스트하는 것이 더 어렵습니다. 따라서 강력한 스킵(strong skipping) 모드 및 비스킵 그룹 최적화(non-skipping group optimizations)와 같은 옵션은 이제 `featureFlags` 속성을 통해 활성화됩니다. 이 속성은 결국 기본값이 될 새로운 Compose 컴파일러 옵션을 테스트하는 데 사용될 것입니다.

이 변경 사항은 Compose 컴파일러 Gradle 플러그인에도 적용되었습니다. 향후 기능 플래그를 구성하려면 다음 구문을 사용하십시오(이 코드는 모든 기본값을 뒤집습니다).

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

또는 Compose 컴파일러를 직접 구성하는 경우 다음 구문을 사용하십시오.

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

`enableIntrinsicRemember`, `enableNonSkippingGroupOptimization`, `enableStrongSkippingMode` 속성은 따라서 사용 중단되었습니다.

이 새로운 접근 방식에 대한 귀하의 피드백을 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags)에서 환영합니다.

### 강력한 스킵(strong skipping) 모드 기본적으로 활성화됨

Compose 컴파일러의 강력한 스킵 모드가 이제 기본적으로 활성화되었습니다.

강력한 스킵 모드는 어떤 컴포저블(composable)을 스킵할 수 있는지에 대한 규칙을 변경하는 Compose 컴파일러 구성 옵션입니다. 강력한 스킵 모드가 활성화되면 불안정한 매개변수를 가진 컴포저블도 스킵될 수 있습니다. 강력한 스킵 모드는 또한 컴포저블 함수에서 사용되는 람다(lambda)를 자동으로 기억하므로, 리컴포지션(recomposition)을 피하기 위해 더 이상 람다를 `remember`로 래핑할 필요가 없습니다.

자세한 내용은 [강력한 스킵 모드 문서](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)를 참조하십시오.

### 컴포지션 트레이스 마커(trace markers) 기본적으로 활성화됨

`includeTraceMarkers` 옵션은 이제 컴파일러 플러그인의 기본값과 일치하도록 Compose 컴파일러 Gradle 플러그인에서 기본적으로 `true`로 설정됩니다. 이를 통해 Android Studio 시스템 트레이스 프로파일러(system trace profiler)에서 컴포저블 함수를 볼 수 있습니다. 컴포지션 트레이싱(composition tracing)에 대한 자세한 내용은 [Android 개발자 블로그 게시물](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)을 참조하십시오.

### 비스킵 그룹 최적화(non-skipping group optimizations)

이 릴리스에는 새로운 컴파일러 옵션이 포함되어 있습니다. 활성화되면 스킵할 수 없고 재시작할 수 없는 컴포저블 함수가 컴포저블 본문 주위에 그룹을 더 이상 생성하지 않습니다. 이는 할당을 줄여 성능을 향상시킵니다. 이 옵션은 실험적이며 기본적으로 비활성화되어 있지만, [위](#new-way-to-configure-compiler-options)에서 보여준 `OptimizeNonSkippingGroups` 기능 플래그로 활성화할 수 있습니다.

이 기능 플래그는 이제 더 광범위한 테스트를 위해 준비되었습니다. 기능을 활성화할 때 발견되는 모든 문제는 [Google 이슈 트래커](https://goo.gle/compose-feedback)에 제출할 수 있습니다.

### 추상 컴포저블 함수에서 기본 매개변수 지원

이제 추상 컴포저블 함수에 기본 매개변수를 추가할 수 있습니다.

이전에는 Compose 컴파일러가 유효한 Kotlin 코드임에도 불구하고 이를 시도할 때 오류를 보고했습니다. 이제 Compose 컴파일러에서 이를 지원하며, 제한이 제거되었습니다. 이는 특히 기본 `Modifier` 값을 포함하는 데 유용합니다.

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

open 컴포저블 함수의 기본 매개변수는 2.0.20에서 여전히 제한됩니다. 이 제한은 향후 릴리스에서 해결될 것입니다.

## 표준 라이브러리

표준 라이브러리는 이제 범용 고유 식별자(UUID)를 실험적 기능으로 지원하며, Base64 디코딩에 몇 가지 변경 사항이 포함되어 있습니다.

### 공통 Kotlin 표준 라이브러리의 UUID 지원

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인(opt-in)하려면 `@ExperimentalUuidApi` 어노테이션(annotation) 또는 컴파일러 옵션 `-opt-in=kotlin.uuid.ExperimentalUuidApi`를 사용하십시오.
>
{style="warning"}

Kotlin 2.0.20은 항목을 고유하게 식별하는 문제를 해결하기 위해 공통 Kotlin 표준 라이브러리에 [UUID(범용 고유 식별자)](https://en.wikipedia.org/wiki/Universally_unique_identifier)를 나타내는 클래스를 도입합니다.

또한 이 기능은 다음 UUID 관련 작업에 대한 API를 제공합니다.

*   UUID 생성.
*   문자열 표현에서 UUID를 구문 분석하고 문자열 표현으로 포맷팅.
*   지정된 128비트 값으로 UUID 생성.
*   UUID의 128비트에 접근.

다음 코드 예제는 이러한 작업을 보여줍니다.

```kotlin
// UUID 생성을 위한 바이트 배열 구성
val byteArray = byteArrayOf(
    0x55, 0x0E, 0x84.toByte(), 0x00, 0xE2.toByte(), 0x9B.toByte(), 0x41, 0xD4.toByte(),
    0xA7.toByte(), 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00
)

val uuid1 = Uuid.fromByteArray(byteArray)
val uuid2 = Uuid.fromULongs(0x550E8400E29B41D4uL, 0xA716446655440000uL)
val uuid3 = Uuid.parse("550e8400-e29b-41d4-a716-446655440000")

println(uuid1)
// 550e8400-e29b-41d4-a716-446655440000
println(uuid1 == uuid2)
// true
println(uuid2 == uuid3)
// true

// UUID 비트에 접근
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 4

// 무작위 UUID 생성
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// false
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

`java.util.UUID`를 사용하는 API와의 호환성을 유지하기 위해 Kotlin/JVM에는 `java.util.UUID`와 `kotlin.uuid.Uuid` 간 변환을 위한 두 가지 확장 함수인 `.toJavaUuid()` 및 `.toKotlinUuid()`가 있습니다. 예를 들면 다음과 같습니다.

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// Kotlin UUID를 java.util.UUID로 변환
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// Java UUID를 kotlin.uuid.Uuid로 변환
val kotlinUuid = javaUuid.toKotlinUuid()
```

이 기능과 제공된 API는 여러 플랫폼 간 코드 공유를 허용하여 멀티플랫폼 소프트웨어 개발을 단순화합니다. UUID는 고유 식별자를 생성하기 어려운 환경에서도 이상적입니다.

UUID를 포함하는 예시 사용 사례는 다음과 같습니다.

*   데이터베이스 레코드에 고유 ID 할당.
*   웹 세션 식별자 생성.
*   고유 식별 또는 추적이 필요한 모든 시나리오.

### `HexFormat`의 `minLength` 지원

> [`HexFormat` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/)와 해당 속성들은 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인(opt-in)하려면 `@OptIn(ExperimentalStdlibApi::class)` 어노테이션(annotation) 또는 컴파일러 옵션 `-opt-in=kotlin.ExperimentalStdlibApi`를 사용하십시오.
>
{style="warning"}

Kotlin 2.0.20은 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html)를 통해 접근하는 [`NumberHexFormat` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/)에 새로운 `minLength` 속성을 추가합니다. 이 속성을 사용하면 숫자 값의 16진수 표현에서 최소 자릿수를 지정하여 필요한 길이를 충족시키기 위해 0으로 패딩(padding)할 수 있습니다. 또한 `removeLeadingZeros` 속성을 사용하여 선행 0을 제거할 수 있습니다.

```kotlin
fun main() {
    println(93.toHexString(HexFormat {
        number.minLength = 4
        number.removeLeadingZeros = true
    }))
    // "005d"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

`minLength` 속성은 구문 분석에는 영향을 미치지 않습니다. 그러나 구문 분석은 이제 추가 선행 자릿수가 0인 경우 16진수 문자열이 타입의 너비보다 더 많은 자릿수를 가질 수 있도록 허용합니다.

### Base64 디코더 동작 변경

> [`Base64` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/)와 그 관련 기능들은 [실험적](components-stability.md#stability-levels-explained)입니다. 옵트인(opt-in)하려면 `@OptIn(ExperimentalEncodingApi::class)` 어노테이션(annotation) 또는 컴파일러 옵션 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`를 사용하십시오.
>
{style="warning"}

Kotlin 2.0.20에서 Base64 디코더의 동작에 두 가지 변경 사항이 도입되었습니다.

*   [Base64 디코더에 이제 패딩이 필요합니다.](#the-base64-decoder-now-requires-padding)
*   [패딩 구성을 위한 `withPadding` 함수가 추가되었습니다.](#withpadding-function-for-padding-configuration)

#### Base64 디코더에 이제 패딩이 필요합니다.

Base64 인코더는 이제 기본적으로 패딩을 추가하며, 디코더는 패딩을 요구하고 디코딩 시 0이 아닌 패딩 비트(pad bits)를 금지합니다.

#### 패딩 구성을 위한 `withPadding` 함수

Base64 인코딩 및 디코딩의 패딩 동작을 사용자가 제어할 수 있도록 새로운 `.withPadding()` 함수가 도입되었습니다.

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

이 함수는 다양한 패딩 옵션으로 `Base64` 인스턴스를 생성할 수 있도록 합니다.

| `PaddingOption`    | 인코딩 시    | 디코딩 시           |
|--------------------|--------------|---------------------|
| `PRESENT`          | 패딩 추가    | 패딩 필수           |
| `ABSENT`           | 패딩 생략    | 패딩 허용 안함      |
| `PRESENT_OPTIONAL` | 패딩 추가    | 패딩 선택 사항      |
| `ABSENT_OPTIONAL`  | 패딩 생략    | 패딩 선택 사항      |

다양한 패딩 옵션으로 `Base64` 인스턴스를 생성하고 이를 사용하여 데이터를 인코딩 및 디코딩할 수 있습니다.

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // 인코딩할 데이터 예시
    val data = "fooba".toByteArray()

    // URL 안전 알파벳과 PRESENT 패딩을 사용하는 Base64 인스턴스 생성
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("PRESENT 패딩으로 인코딩된 데이터: $encodedDataPresent")
    // Encoded data with PRESENT padding: Zm9vYmE=

    // URL 안전 알파벳과 ABSENT 패딩을 사용하는 Base64 인스턴스 생성
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("ABSENT 패딩으로 인코딩된 데이터: $encodedDataAbsent")
    // Encoded data with ABSENT padding: Zm9vYmE

    // 데이터 다시 디코딩
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("PRESENT 패딩으로 디코딩된 데이터: ${String(decodedDataPresent)}")
    // Decoded data with PRESENT padding: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("ABSENT 패딩으로 디코딩된 데이터: ${String(decodedDataAbsent)}")
    // Decoded data with ABSENT padding: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 문서 업데이트

Kotlin 문서는 몇 가지 주목할 만한 변경 사항을 받았습니다.

*   개선된 [표준 입력 페이지](standard-input.md) - Java `Scanner`와 `readln()` 사용 방법을 배우십시오.
*   개선된 [K2 컴파일러 마이그레이션 가이드](k2-compiler-migration-guide.md) - 성능 개선, Kotlin 라이브러리와의 호환성, 사용자 지정 컴파일러 플러그인 처리 방법을 배우십시오.
*   개선된 [예외 페이지](exceptions.md) - 예외, 예외를 던지고 잡는 방법을 배우십시오.
*   개선된 [JVM에서 JUnit을 사용하여 코드 테스트 - 튜토리얼](jvm-test-using-junit.md) - JUnit을 사용하여 테스트를 생성하는 방법을 배우십시오.
*   개선된 [Swift/Objective-C와의 상호 운용성 페이지](native-objc-interop.md) - Swift/Objective-C 코드에서 Kotlin 선언을 사용하고 Kotlin 코드에서 Objective-C 선언을 사용하는 방법을 배우십시오.
*   개선된 [Swift 패키지 익스포트 설정 페이지](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-spm-export.html) - Swift 패키지 관리자 종속성으로 소비될 수 있는 Kotlin/Native 결과물을 설정하는 방법을 배우십시오.

## Kotlin 2.0.20 설치

IntelliJ IDEA 2023.3 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 IDE에 포함된 번들 플러그인으로 배포됩니다. 즉, 더 이상 JetBrains Marketplace에서 플러그인을 설치할 수 없습니다.

새 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을 2.0.20으로 변경](releases.md#update-to-a-new-kotlin-version)하십시오.