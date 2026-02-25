[//]: # (title: Kotlin 2.0.20의 새로운 기능)

<web-summary>새로운 언어 기능, Kotlin Multiplatform, JVM, Native, JS, Wasm 업데이트, Gradle 및 Maven 빌드 도구 지원을 포함한 Kotlin 2.0.20 릴리스 노트를 확인해 보세요.</web-summary>

_[출시일: 2024년 8월 22일](releases.md#release-history)_

Kotlin 2.0.20이 출시되었습니다! 이번 버전에는 Kotlin K2 컴파일러가 안정화(Stable)되었다고 발표한 Kotlin 2.0.0의 성능 개선 및 버그 수정이 포함되어 있습니다. 이번 릴리스의 주요 하이라이트는 다음과 같습니다.

* [데이터 클래스 copy 함수의 가시성을 생성자와 동일하게 변경](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [멀티플랫폼 프로젝트의 기본 타겟 계층 구조에서 소스 세트용 정적 접근자(static accessor) 사용 가능](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native 가비지 컬렉터에서 동시 마킹(concurrent marking) 가능](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm의 `@ExperimentalWasmDsl` 어노테이션 위치 변경](#new-location-of-experimentalwasmdsl-annotation)
* [Gradle 8.6–8.8 버전 지원 추가](#gradle)
* [프로젝트 간 JVM 아티팩트를 클래스 파일로 공유할 수 있는 새로운 옵션 추가](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose 컴파일러 업데이트](#compose-compiler)
* [공통 Kotlin 표준 라이브러리에 UUID 지원 추가](#support-for-uuids-in-the-common-kotlin-standard-library)

> Kotlin 릴리스 주기에 대한 정보는 [Kotlin 릴리스 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## IDE 지원

Kotlin 2.0.20을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 포함되어 있습니다. IDE에서 Kotlin 플러그인을 별도로 업데이트할 필요는 없으며, 빌드 스크립트에서 Kotlin 버전을 2.0.20으로 변경하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트하기](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어(Language)

Kotlin 2.0.20에서는 데이터 클래스의 일관성을 높이기 위한 변경 사항을 도입하기 시작했으며, 실험적(Experimental) 기능이었던 컨텍스트 리시버(context receivers)를 대체하는 작업을 진행합니다.

### 데이터 클래스 copy 함수의 가시성을 생성자와 동일하게 변경

현재는 `private` 생성자를 사용하여 데이터 클래스를 생성하더라도 자동으로 생성되는 `copy()` 함수는 동일한 가시성을 갖지 않습니다. 이는 나중에 코드에서 문제를 일으킬 수 있습니다. 향후 Kotlin 릴리스에서는 `copy()` 함수의 기본 가시성이 생성자와 동일하게 적용되도록 변경될 예정입니다. 이 변경 사항은 코드 마이그레이션을 돕기 위해 점진적으로 도입됩니다.

마이그레이션 계획은 Kotlin 2.0.20부터 시작되며, 향후 가시성이 변경될 코드에 경고를 표시합니다. 예를 들면 다음과 같습니다.

```kotlin
// 2.0.20에서 경고 발생
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 2.0.20에서 경고 발생
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

마이그레이션 계획에 대한 최신 정보는 [YouTrack의 해당 이슈](https://youtrack.jetbrains.com/issue/KT-11914)를 확인하세요.

이 동작을 더 세밀하게 제어할 수 있도록 Kotlin 2.0.20에서 두 가지 어노테이션을 도입했습니다.

* `@ConsistentCopyVisibility`: 나중에 기본값이 되기 전에 지금 바로 이 동작을 적용(opt-in)합니다.
* `@ExposedCopyVisibility`: 이 동작을 거부(opt-out)하고 선언부의 경고를 억제합니다. 단, 이 어노테이션을 사용하더라도 `copy()` 함수가 호출되는 시점에는 컴파일러가 여전히 경고를 보고합니다.

개별 클래스가 아닌 모듈 전체에 대해 2.0.20부터 새 동작을 적용하려면 `-Xconsistent-data-class-copy-visibility` 컴파일러 옵션을 사용할 수 있습니다. 이 옵션은 모듈 내 모든 데이터 클래스에 `@ConsistentCopyVisibility` 어노테이션을 추가하는 것과 동일한 효과를 가집니다.

### 컨텍스트 리시버를 컨텍스트 파라미터로 단계적 교체

Kotlin 1.6.20에서 [컨텍스트 리시버(context receivers)](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm)를 [실험적(Experimental)](components-stability.md#stability-levels-explained) 기능으로 도입했습니다. 커뮤니티 피드백을 수렴한 결과, 이 방식을 계속 유지하지 않고 다른 방향으로 진행하기로 결정했습니다.

향후 Kotlin 릴리스에서 컨텍스트 리시버는 컨텍스트 파라미터(context parameters)로 대체될 예정입니다. 컨텍스트 파라미터는 아직 설계 단계에 있으며, 제안서는 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)에서 확인할 수 있습니다.

컨텍스트 파라미터 구현에는 컴파일러의 대대적인 변경이 필요하기 때문에, 컨텍스트 리시버와 컨텍스트 파라미터를 동시에 지원하지 않기로 했습니다. 이 결정은 구현을 크게 단순화하고 불안정한 동작의 위험을 최소화합니다.

많은 개발자가 이미 컨텍스트 리시버를 사용하고 있음을 인지하고 있습니다. 따라서 컨텍스트 리시버에 대한 지원을 점진적으로 제거할 예정입니다. 마이그레이션 계획은 Kotlin 2.0.20부터 시작되며, `-Xcontext-receivers` 컴파일러 옵션과 함께 컨텍스트 리시버를 사용하는 경우 코드에 경고가 표시됩니다. 예를 들면 다음과 같습니다.

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

이 경고는 향후 Kotlin 릴리스에서 에러로 바뀔 예정입니다.

코드에서 컨텍스트 리시버를 사용 중이라면 다음과 같은 방법 중 하나로 마이그레이션하는 것을 권장합니다.

* 명시적 파라미터 사용

   <table>
      <tr>
          <td>변경 전</td>
          <td>변경 후</td>
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

* 확장 멤버 함수 사용(가능한 경우)

   <table>
      <tr>
          <td>변경 전</td>
          <td>변경 후</td>
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

또는 컴파일러에서 컨텍스트 파라미터를 지원하는 Kotlin 릴리스가 나올 때까지 기다릴 수도 있습니다. 컨텍스트 파라미터 역시 초기에는 실험적 기능으로 도입될 예정입니다.

## Kotlin 멀티플랫폼(Kotlin Multiplatform)

Kotlin 2.0.20에서는 멀티플랫폼 프로젝트의 소스 세트 관리 기능이 개선되었으며, 최근 Gradle의 변경 사항으로 인해 일부 Gradle Java 플러그인과의 호환성이 중단(deprecated)되었습니다.

### 기본 타겟 계층 구조에서 소스 세트용 정적 접근자 제공

Kotlin 1.9.20부터 모든 Kotlin 멀티플랫폼 프로젝트에 [기본 계층 구조 템플릿(default hierarchy template)](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html#default-hierarchy-template)이 자동으로 적용됩니다. 또한 Kotlin Gradle 플러그인은 기본 계층 구조 템플릿의 모든 소스 세트에 대해 타입 안전 접근자(type-safe accessor)를 제공해 왔습니다. 덕분에 `by getting`이나 `by creating` 구문을 사용하지 않고도 지정된 모든 타겟의 소스 세트에 접근할 수 있게 되었습니다.

Kotlin 2.0.20에서는 IDE 경험을 더욱 개선하기 위해 `sourceSets {}` 블록 내에서 기본 계층 구조 템플릿의 모든 소스 세트에 대한 정적 접근자(static accessor)를 제공합니다. 이 변경을 통해 소스 세트에 이름으로 접근하는 것이 훨씬 쉽고 예측 가능해질 것으로 기대합니다.

각 소스 세트에는 샘플이 포함된 상세한 KDoc 주석이 제공되며, 해당 타겟을 먼저 선언하지 않고 소스 세트에 접근하려고 하면 경고 메시지가 표시됩니다.

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
        // 경고: 타겟을 등록하지 않고 소스 세트에 접근함
        iosX64Main { }
    }
}
```

![이름으로 소스 세트에 접근하기](accessing-sourse-sets.png){width=700}

[Kotlin 멀티플랫폼의 계층적 프로젝트 구조](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html)에 대해 자세히 알아보세요.

### Kotlin 멀티플랫폼 Gradle 플러그인과 Gradle Java 플러그인 간의 호환성 중단 예고

Kotlin 2.0.20에서는 Kotlin 멀티플랫폼 Gradle 플러그인과 다음의 Gradle Java 플러그인 중 하나를 동일한 프로젝트에 적용할 경우 중단(deprecation) 경고가 발생합니다: [Java](https://docs.gradle.org/current/userguide/java_plugin.html), [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html), [Application](https://docs.gradle.org/current/userguide/application_plugin.html). 멀티플랫폼 프로젝트 내의 다른 Gradle 플러그인이 내부적으로 Gradle Java 플러그인을 적용하는 경우(예: [Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html)은 자동으로 Application 플러그인을 적용함)에도 경고가 나타납니다.

이 경고를 추가한 이유는 Kotlin 멀티플랫폼의 프로젝트 모델과 Gradle의 Java 생태계 플러그인 사이에 근본적인 호환성 문제가 있기 때문입니다. 현재 Gradle의 Java 생태계 플러그인은 다음과 같은 상황을 고려하지 않습니다.

* 다른 플러그인이 Java 생태계 플러그인과 다른 방식으로 JVM 타겟을 위해 배포하거나 컴파일할 수 있다는 점.
* 동일한 프로젝트 내에 JVM과 Android처럼 두 개의 서로 다른 JVM 타겟이 있을 수 있다는 점.
* 여러 개의 비-JVM 타겟이 포함된 복잡한 멀티플랫폼 프로젝트 구조를 가질 수 있다는 점.

안타깝게도 현재 Gradle은 이러한 문제를 해결할 수 있는 API를 제공하지 않습니다.

이전에는 Java 생태계 플러그인과의 통합을 돕기 위해 Kotlin 멀티플랫폼에서 몇 가지 우회 방법(workaround)을 사용했습니다. 하지만 이러한 방법은 호환성 문제를 근본적으로 해결하지 못했으며, Gradle 8.8 릴리스부터는 더 이상 이러한 우회 방법이 불가능해졌습니다. 자세한 내용은 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)를 참조하세요.

이 호환성 문제를 해결할 정확한 방법은 아직 결정되지 않았지만, Kotlin 멀티플랫폼 프로젝트에서 어떤 형태로든 Java 소스 컴파일을 계속 지원하기 위해 노력하고 있습니다. 최소한 멀티플랫폼 프로젝트 내에서 Java 소스 컴파일과 Gradle의 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 플러그인 사용은 지원할 것입니다.

당분간 멀티플랫폼 프로젝트에서 이 경고가 표시된다면 다음을 권장합니다.
1. 프로젝트에 실제로 Gradle Java 플러그인이 필요한지 확인하고, 필요 없다면 제거를 고려하세요.
2. Gradle Java 플러그인이 단일 태스크에만 사용되는지 확인하세요. 그렇다면 플러그인 없이도 해당 태스크를 처리할 수 있습니다. 예를 들어, Javadoc JAR 파일을 생성하기 위해 플러그인을 사용한다면 Javadoc 태스크를 수동으로 정의할 수 있습니다.

반면, Kotlin 멀티플랫폼 Gradle 플러그인과 이러한 Java용 Gradle 플러그인을 모두 사용해야 한다면 다음 방법을 권장합니다.

1. 멀티플랫폼 프로젝트 내에 별도의 서브프로젝트를 생성합니다.
2. 해당 서브프로젝트에 Java용 Gradle 플러그인을 적용합니다.
3. 해당 서브프로젝트에서 상위 멀티플랫폼 프로젝트에 대한 의존성을 추가합니다.

> 해당 서브프로젝트는 멀티플랫폼 프로젝트여서는 **안 되며**, 오직 멀티플랫폼 프로젝트에 대한 의존성을 설정하는 용도로만 사용해야 합니다.
>
{style="warning"}

예를 들어, `my-main-project`라는 멀티플랫폼 프로젝트가 있고 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 플러그인을 사용하여 JVM 애플리케이션을 실행하고 싶다고 가정해 보겠습니다.

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

서브프로젝트의 `build.gradle.kts` 파일의 `plugins {}` 블록에 Application 플러그인을 적용합니다.

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

서브프로젝트의 `build.gradle.kts` 파일에서 상위 멀티플랫폼 프로젝트에 대한 의존성을 추가합니다.

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

이제 상위 프로젝트에서 두 플러그인을 함께 사용할 수 있도록 설정되었습니다.

## Kotlin/Native

Kotlin/Native는 가비지 컬렉터의 개선과 Swift/Objective-C에서 Kotlin 서스펜딩 함수를 호출하는 기능이 향상되었습니다.

### 가비지 컬렉터의 동시 마킹(Concurrent marking)

Kotlin 2.0.20에서 JetBrains 팀은 Kotlin/Native 런타임 성능을 개선하기 위한 또 다른 조치를 취했습니다. 가비지 컬렉터(GC)에 동시 마킹(concurrent marking)에 대한 실험적 지원을 추가했습니다.

기본적으로 GC가 힙의 객체를 마킹할 때는 애플리케이션 스레드가 일시 중지되어야 합니다. 이는 GC 일시 중지 시간(pause time)에 큰 영향을 미치며, Compose Multiplatform으로 구축된 UI 애플리케이션과 같이 지연 시간에 민감한 애플리케이션의 성능에 중요합니다.

이제 가비지 컬렉션의 마킹 단계를 애플리케이션 스레드와 동시에 실행할 수 있습니다. 이를 통해 GC 일시 중지 시간을 크게 단축하고 앱 응답성을 향상할 수 있습니다.

#### 활성화 방법

이 기능은 현재 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 이를 활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하세요.

```none
kotlin.native.binary.gc=cms
```

문제가 발생하면 [YouTrack 이슈 트래커](https://kotl.in/issue)에 보고해 주세요.

### 비트코드 임베딩(bitcode embedding) 지원 제거

Kotlin 2.0.20부터 Kotlin/Native 컴파일러는 더 이상 비트코드 임베딩을 지원하지 않습니다. 비트코드 임베딩은 Xcode 14에서 지원 중단되었으며, Xcode 15부터는 모든 Apple 타겟에서 제거되었습니다.

이제 프레임워크 설정의 `embedBitcode` 파라미터와 `-Xembed-bitcode`, `-Xembed-bitcode-marker` 커맨드 라인 인수는 더 이상 사용되지 않습니다(deprecated).

이전 버전의 Xcode를 사용 중이더라도 Kotlin 2.0.20으로 업그레이드하려면 Xcode 프로젝트에서 비트코드 임베딩을 비활성화해야 합니다.

### signposts를 이용한 GC 성능 모니터링 변경 사항

Kotlin 2.0.0에서는 Xcode Instruments를 통해 Kotlin/Native 가비지 컬렉터(GC)의 성능을 모니터링할 수 있는 기능이 추가되었습니다. Instruments에는 GC 일시 중지를 이벤트로 표시할 수 있는 signposts 도구가 포함되어 있어, iOS 앱에서 GC 관련 프리징 현상을 확인하는 데 유용합니다.

이 기능은 기본적으로 활성화되어 있었으나, 애플리케이션이 Xcode Instruments와 동시에 실행될 때 충돌이 발생하는 경우가 있었습니다. Kotlin 2.0.20부터는 다음과 같은 컴파일러 옵션을 통해 명시적으로 옵트인(opt-in)해야 사용할 수 있습니다.

```none
-Xbinary=enableSafepointSignposts=true
```

GC 성능 분석에 대한 자세한 내용은 [문서](native-memory-manager.md#monitor-gc-performance)를 참조하세요.

### 메인 스레드 이외의 스레드에서 Swift/Objective-C로부터 Kotlin 서스펜딩 함수 호출 가능

이전에는 Kotlin/Native의 기본 제한으로 인해 Swift 및 Objective-C에서 Kotlin 서스펜딩 함수를 호출하는 것이 메인 스레드에서만 가능했습니다. Kotlin 2.0.20에서는 이 제한이 해제되어 어떤 스레드에서든 Swift/Objective-C를 통해 Kotlin `suspend` 함수를 실행할 수 있습니다.

이전에 메인 스레드 이외의 스레드에서 호출하기 위해 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none` 바이너리 옵션을 사용했다면, 이제 `gradle.properties` 파일에서 해당 옵션을 제거해도 됩니다.

## Kotlin/Wasm

Kotlin 2.0.20에서 Kotlin/Wasm은 네임드 익스포트(named exports)로의 마이그레이션을 계속 진행하며, `@ExperimentalWasmDsl` 어노테이션의 위치를 변경했습니다.

### 기본 내보내기(default export) 사용 시 에러 발생

네임드 익스포트로의 마이그레이션의 일환으로, 이전에는 JavaScript에서 Kotlin/Wasm 내보내기에 기본 임포트(default import)를 사용할 때 콘솔에 경고 메시지가 출력되었습니다.

이제 네임드 익스포트를 완전히 지원하기 위해 이 경고가 에러로 격상되었습니다. 기본 임포트를 사용하면 다음과 같은 에러 메시지가 표시됩니다.

```text
Do not use default import. Use the corresponding named import instead.
```

이 변경은 네임드 익스포트로 전환하기 위한 지원 중단 주기의 일부입니다. 각 단계에서 예상되는 상황은 다음과 같습니다.

* **버전 2.0.0**: 기본 내보내기를 통한 엔티티 내보내기가 중단될 예정임을 알리는 경고 메시지가 콘솔에 출력됩니다.
* **버전 2.0.20**: 에러가 발생하며, 해당하는 네임드 임포트를 사용하도록 요구합니다.
* **버전 2.1.0**: 기본 임포트 사용 기능이 완전히 제거됩니다.

### ExperimentalWasmDsl 어노테이션의 새로운 위치

이전에는 WebAssembly(Wasm) 기능을 위한 `@ExperimentalWasmDsl` 어노테이션이 Kotlin Gradle 플러그인 내의 다음 위치에 있었습니다.

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

2.0.20에서 `@ExperimentalWasmDsl` 어노테이션의 위치가 다음과 같이 변경되었습니다.

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

이전 위치는 이제 사용되지 않으며(deprecated), 참조를 찾을 수 없어 빌드에 실패할 수 있습니다.

`@ExperimentalWasmDsl` 어노테이션의 새로운 위치를 반영하려면 Gradle 빌드 스크립트의 임포트 문을 업데이트하세요. 새로운 `@ExperimentalWasmDsl` 위치를 명시적으로 임포트하세요.

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

또는 이전 패키지에서의 스타(*) 임포트 문을 제거하세요.

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS에서는 JavaScript에서 정적 멤버를 지원하고 JavaScript에서 Kotlin 컬렉션을 생성할 수 있는 몇 가지 실험적 기능을 도입했습니다.

### JavaScript에서 Kotlin 정적 멤버 사용 지원

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic)을 통해 의견을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 2.0.20부터 `@JsStatic` 어노테이션을 사용할 수 있습니다. 이는 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)과 유사하게 동작하며, 대상 선언에 대해 추가적인 정적 메서드를 생성하도록 컴파일러에 지시합니다. 이를 통해 Kotlin 코드의 정적 멤버를 JavaScript에서 직접 사용할 수 있습니다.

`@JsStatic` 어노테이션은 명명된 객체(named objects)에 정의된 함수뿐만 아니라 클래스 및 인터페이스 내부에 선언된 컴패니언 객체(companion objects)에도 사용할 수 있습니다. 컴파일러는 객체의 정적 메서드와 객체 자체의 인스턴스 메서드를 모두 생성합니다. 예를 들어:

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

이제 JavaScript에서 `callStatic()`은 정적 메서드가 되지만, `callNonStatic()`은 그렇지 않습니다.

```javascript
C.callStatic();              // 작동함, 정적 함수에 접근
C.callNonStatic();           // 에러, 생성된 JavaScript에서 정적 함수가 아님
C.Companion.callStatic();    // 인스턴스 메서드는 유지됨
C.Companion.callNonStatic(); // 작동하는 유일한 방법
```

객체나 컴패니언 객체의 프로퍼티에도 `@JsStatic` 어노테이션을 적용할 수 있으며, 이 경우 해당 프로퍼티의 게터(getter)와 세터(setter) 메서드는 해당 객체 또는 컴패니언 객체를 포함하는 클래스의 정적 멤버가 됩니다.

### JavaScript에서 Kotlin 컬렉션 생성 기능

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript)을 통해 의견을 보내주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 2.0.0에서는 Kotlin 컬렉션을 JavaScript(및 TypeScript)로 내보내는 기능이 도입되었습니다. 이제 JetBrains 팀은 컬렉션 상호운용성을 개선하기 위해 한 걸음 더 나아갔습니다. Kotlin 2.0.20부터는 JavaScript/TypeScript 쪽에서 직접 Kotlin 컬렉션을 생성할 수 있습니다.

JavaScript에서 Kotlin 컬렉션을 생성하여 내보낸 생성자나 함수의 인자로 전달할 수 있습니다. 내보낸 선언 내부에서 컬렉션을 언급하면 Kotlin은 JavaScript/TypeScript에서 사용할 수 있는 컬렉션 팩토리를 생성합니다.

다음과 같이 내보낸 함수를 예로 들어보겠습니다.

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

`MutableMap` 컬렉션이 사용되었으므로, Kotlin은 JavaScript/TypeScript에서 사용할 수 있는 팩토리 메서드가 포함된 객체를 생성합니다. 이 팩토리 메서드는 JavaScript의 `Map`으로부터 `MutableMap`을 생성합니다.

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

이 기능은 `Set`, `Map`, `List` Kotlin 컬렉션 타입과 그에 상응하는 가변(mutable) 타입에서 사용할 수 있습니다.

## Gradle

Kotlin 2.0.20은 Gradle 6.8.3부터 8.6까지 완벽하게 호환됩니다. Gradle 8.7 및 8.8도 지원되지만, 한 가지 예외가 있습니다. Kotlin 멀티플랫폼 Gradle 플러그인을 사용하는 경우, JVM 타겟에서 `withJava()` 함수를 호출할 때 멀티플랫폼 프로젝트에서 지원 중단 경고가 표시될 수 있습니다. 이 문제는 가능한 한 빨리 해결할 계획입니다.

자세한 내용은 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)를 참조하세요.

최신 Gradle 릴리스 버전까지 사용할 수 있지만, 이 경우 지원 중단 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있음을 유의하세요.

이번 버전에서는 JVM 히스토리 파일 기반의 기존 증분 컴파일 방식에 대한 지원 중단 프로세스를 시작하고, 프로젝트 간 JVM 아티팩트를 공유하는 새로운 방식을 도입하는 등의 변경 사항이 포함되었습니다.

### JVM 히스토리 파일 기반의 증분 컴파일 지원 중단

Kotlin 2.0.20에서는 JVM 히스토리 파일 기반의 증분 컴파일 방식이 Kotlin 1.8.20부터 기본적으로 활성화된 새로운 증분 컴파일 방식을 위해 지원 중단(deprecated)되었습니다.

JVM 히스토리 파일 기반의 증분 컴파일 방식은 [Gradle의 빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)와 함께 작동하지 않고 컴파일 회피(compilation avoidance)를 지원하지 않는 등의 한계가 있었습니다. 반면, 새로운 증분 컴파일 방식은 이러한 한계를 극복했으며 도입 이후 안정적으로 작동하고 있습니다.

새로운 증분 컴파일 방식이 지난 두 번의 주요 Kotlin 릴리스에서 기본적으로 사용되었으므로, Kotlin 2.0.20에서는 `kotlin.incremental.useClasspathSnapshot` Gradle 프로퍼티가 더 이상 사용되지 않습니다. 따라서 이를 통해 옵트아웃(opt-out)하려고 하면 지원 중단 경고가 표시됩니다.

### 프로젝트 간 JVM 아티팩트를 클래스 파일로 공유하는 옵션

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. 언제든지 변경되거나 제거될 수 있습니다. 평가 목적으로만 사용하세요. [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts)을 통해 의견을 보내주시면 감사하겠습니다. 옵트인(opt-in)이 필요합니다(아래 상세 내용 참조).
>
{style="warning"}

Kotlin 2.0.20에서는 프로젝트 간에 JAR 파일과 같은 Kotlin/JVM 컴파일 출력을 공유하는 방식을 변경하는 새로운 접근 방식을 도입했습니다. 이 방식을 사용하면 Gradle의 `apiElements` 설정에 컴파일된 `.class` 파일이 포함된 디렉토리에 접근할 수 있는 보조 변리언트(secondary variant)가 생깁니다. 이 설정이 활성화되면 프로젝트는 컴파일 중에 압축된 JAR 아티팩트를 요청하는 대신 이 디렉토리를 직접 사용합니다. 이는 특히 증분 빌드에서 JAR 파일의 압축 및 압축 해제 횟수를 줄여줍니다.

테스트 결과, 이 새로운 방식은 Linux 및 macOS 호스트에서 빌드 성능을 향상시킬 수 있는 것으로 나타났습니다. 하지만 Windows 호스트에서는 파일 작업 시 Windows의 I/O 처리 방식 때문에 성능 저하가 관찰되었습니다.

이 새로운 방식을 시도해 보려면 `gradle.properties` 파일에 다음 프로퍼티를 추가하세요.

```none
kotlin.jvm.addClassesVariant=true
```

기본적으로 이 프로퍼티는 `false`로 설정되어 있으며 Gradle의 `apiElements` 변리언트는 압축된 JAR 아티팩트를 요청합니다.

> Gradle에는 컴파일 중에 컴파일된 `.class` 파일 디렉토리 **대신** 압축된 JAR 아티팩트만 노출하도록 Java 전용 프로젝트에서 사용할 수 있는 관련 프로퍼티가 있습니다.
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 이 프로퍼티와 그 목적에 대한 자세한 내용은 Gradle 문서의 [거대 멀티 프로젝트에서 Windows의 상당한 빌드 성능 저하](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)를 참조하세요.
>
{style="note"}

이 새로운 접근 방식에 대한 의견을 환영합니다. 이를 사용하는 동안 성능 개선을 경험하셨나요? [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts)에 댓글을 남겨 공유해 주세요.

### Kotlin Gradle 플러그인과 java-test-fixtures 플러그인의 의존성 동작 일치

Kotlin 2.0.20 이전에는 프로젝트에서 [`java-test-fixtures` 플러그인](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)을 사용할 때 Gradle과 Kotlin Gradle 플러그인 간에 의존성이 전파되는 방식에 차이가 있었습니다.

Kotlin Gradle 플러그인은 다음과 같이 의존성을 전파했습니다.

* `java-test-fixtures` 플러그인의 `implementation` 및 `api` 의존성 타입에서 `test` 소스 세트 컴파일 클래스패스로 전파.
* 메인 소스 세트의 `implementation` 및 `api` 의존성 타입에서 `java-test-fixtures` 플러그인의 소스 세트 컴파일 클래스패스로 전파.

하지만 Gradle은 오직 `api` 의존성 타입에 대해서만 의존성을 전파했습니다.

이러한 동작 차이로 인해 일부 프로젝트에서는 클래스패스에서 리소스 파일을 중복해서 찾는 문제가 발생하기도 했습니다.

Kotlin 2.0.20부터 Kotlin Gradle 플러그인의 동작이 Gradle의 `java-test-fixtures` 플러그인과 일치하도록 조정되어, 이 플러그인이나 다른 Gradle 플러그인에서 더 이상 이 문제가 발생하지 않습니다.

이 변경의 결과로 `test` 및 `testFixtures` 소스 세트의 일부 의존성에 더 이상 접근하지 못할 수 있습니다. 이 경우 의존성 선언 타입을 `implementation`에서 `api`로 변경하거나, 영향을 받는 소스 세트에 새로운 의존성 선언을 추가하세요.

### 컴파일 태스크에 아티팩트 의존성이 누락된 희귀 사례에 대한 태스크 의존성 추가

2.0.20 이전에는 컴파일 태스크가 입력 아티팩트 중 하나에 대한 태스크 의존성이 누락된 시나리오가 있음을 발견했습니다. 이는 의존하는 컴파일 태스크의 결과가 불안정해질 수 있음을 의미하는데, 아티팩트가 제때 생성될 때도 있고 그렇지 않을 때도 있었기 때문입니다.

이 문제를 해결하기 위해 Kotlin Gradle 플러그인은 이제 이러한 시나리오에서 필요한 태스크 의존성을 자동으로 추가합니다.

매우 드문 경우지만, 이 새로운 동작으로 인해 순환 의존성 에러가 발생할 수 있습니다. 예를 들어, 한 컴파일 태스크가 다른 컴파일 태스크의 모든 내부 선언을 볼 수 있고 생성된 아티팩트가 두 컴파일 태스크 모두의 출력에 의존하는 여러 컴파일 과정이 있는 경우 다음과 같은 에러가 발생할 수 있습니다.

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

이 순환 의존성 에러를 해결하기 위해 `archivesTaskOutputAsFriendModule`이라는 Gradle 프로퍼티를 추가했습니다.

기본적으로 이 프로퍼티는 태스크 의존성을 추적하기 위해 `true`로 설정되어 있습니다. 컴파일 태스크에서 아티팩트 사용을 비활성화하여 태스크 의존성이 필요하지 않게 하려면 `gradle.properties` 파일에 다음을 추가하세요.

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

자세한 내용은 [YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-69330)를 참조하세요.

## Compose 컴파일러

Kotlin 2.0.20에서 Compose 컴파일러의 몇 가지 사항이 개선되었습니다.

### 2.0.0에서 도입된 불필요한 리컴포지션 문제 수정

Compose 컴파일러 2.0.0에는 비-JVM 타겟을 가진 멀티플랫폼 프로젝트에서 타입의 안정성(stability)을 잘못 추론하는 문제가 있었습니다. 이로 인해 불필요한(또는 무한한) 리컴포지션이 발생할 수 있습니다. Kotlin 2.0.0용으로 제작된 Compose 앱을 2.0.10 이상의 버전으로 업데이트할 것을 강력히 권장합니다.

앱이 Compose 컴파일러 2.0.10 이상으로 빌드되었더라도 버전 2.0.0으로 빌드된 의존성을 사용하는 경우, 이러한 오래된 의존성이 여전히 리컴포지션 문제를 일으킬 수 있습니다. 이를 방지하려면 의존성을 앱과 동일한 Compose 컴파일러 버전으로 빌드된 버전으로 업데이트하세요.

### 컴파일러 옵션 설정의 새로운 방식

최상위 파라미터가 난립하는 것을 방지하기 위해 새로운 옵션 구성 메커니즘을 도입했습니다. Compose 컴파일러 팀이 `composeCompiler {}` 블록에 최상위 항목을 생성하거나 제거하면서 기능을 테스트하는 것은 어려운 일이었습니다. 따라서 강력한 건너뛰기 모드(strong skipping mode) 및 비건너뛰기 그룹 최적화(non-skipping group optimizations)와 같은 옵션은 이제 `featureFlags` 프로퍼티를 통해 활성화됩니다. 이 프로퍼티는 결국 기본값이 될 새로운 Compose 컴파일러 옵션을 테스트하는 데 사용될 것입니다.

이 변경 사항은 Compose 컴파일러 Gradle 플러그인에도 적용되었습니다. 앞으로 기능 플래그를 설정하려면 다음 구문을 사용하세요(아래 코드는 모든 기본값을 반전시킵니다).

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

또는 Compose 컴파일러를 직접 설정하는 경우 다음 구문을 사용하세요.

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

이에 따라 `enableIntrinsicRemember`, `enableNonSkippingGroupOptimization`, `enableStrongSkippingMode` 프로퍼티는 더 이상 사용되지 않습니다(deprecated).

이 새로운 방식에 대한 의견이 있으시면 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags)을 통해 알려주세요.

### 강력한 건너뛰기 모드(Strong skipping mode) 기본 활성화

Compose 컴파일러의 강력한 건너뛰기 모드가 이제 기본적으로 활성화됩니다.

강력한 건너뛰기 모드는 어떤 컴포저블을 건너뛸 수 있는지에 대한 규칙을 변경하는 Compose 컴파일러 설정 옵션입니다. 강력한 건너뛰기 모드가 활성화되면 불안정한(unstable) 파라미터가 있는 컴포저블도 건너뛸 수 있습니다. 또한 강력한 건너뛰기 모드는 컴포저블 함수에서 사용되는 람다를 자동으로 기억(remember)하므로, 리컴포지션을 피하기 위해 람다를 `remember`로 감쌀 필요가 더 이상 없습니다.

자세한 내용은 [강력한 건너뛰기 모드 문서](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping)를 참조하세요.

### 컴포지션 추적 마커(Composition trace markers) 기본 활성화

컴파일러 플러그인의 기본값과 일치하도록 Compose 컴파일러 Gradle 플러그인에서 `includeTraceMarkers` 옵션이 기본적으로 `true`로 설정됩니다. 이를 통해 Android Studio 시스템 추적 프로파일러에서 컴포저블 함수를 볼 수 있습니다. 컴포지션 추적에 대한 자세한 내용은 [Android 개발자 블로그 포스트](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535)를 참조하세요.

### 비건너뛰기 그룹 최적화(Non-skipping group optimizations)

이번 릴리스에는 새로운 컴파일러 옵션이 포함되었습니다. 이 옵션이 활성화되면 건너뛸 수 없거나 재시작할 수 없는 컴포저블 함수는 더 이상 컴포저블 바디 주위에 그룹을 생성하지 않습니다. 이는 할당(allocation)을 줄여 성능 향상으로 이어집니다. 이 옵션은 실험적이며 기본적으로 비활성화되어 있지만, [위에서](#new-way-to-configure-compiler-options) 설명한 대로 `OptimizeNonSkippingGroups` 기능 플래그를 사용하여 활성화할 수 있습니다.

이 기능 플래그는 이제 광범위한 테스트를 거칠 준비가 되었습니다. 기능을 활성화할 때 발견되는 모든 문제는 [Google 이슈 트래커](https://goo.gle/compose-feedback)에 제출해 주시기 바랍니다.

### 추상 컴포저블 함수의 기본 파라미터 지원

이제 추상(abstract) 컴포저블 함수에 기본 파라미터를 추가할 수 있습니다.

이전에는 올바른 Kotlin 코드임에도 불구하고 Compose 컴파일러에서 이를 시도할 때 에러가 발생했습니다. 이제 Compose 컴파일러에서 이 기능을 지원하며 제한이 제거되었습니다. 이는 특히 기본 `Modifier` 값을 포함할 때 유용합니다.

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

오픈(open) 컴포저블 함수의 기본 파라미터 지원은 2.0.20에서도 여전히 제한됩니다. 이 제한은 향후 릴리스에서 해결될 예정입니다.

## 표준 라이브러리(Standard library)

표준 라이브러리는 이제 범용 고유 식별자(UUID)를 실험적 기능으로 지원하며 Base64 디코딩에 대한 몇 가지 변경 사항을 포함합니다.

### 공통 Kotlin 표준 라이브러리의 UUID 지원

> 이 기능은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
> 옵트인하려면 `@ExperimentalUuidApi` 어노테이션이나 컴파일러 옵션 `-opt-in=kotlin.uuid.ExperimentalUuidApi`를 사용하세요.
>
{style="warning"}

Kotlin 2.0.20은 고유 식별 문제를 해결하기 위해 공통 Kotlin 표준 라이브러리에 [UUID(Universally Unique Identifiers)](https://en.wikipedia.org/wiki/Universally_unique_identifier)를 표현하기 위한 클래스를 도입했습니다.

또한, 이 기능은 다음과 같은 UUID 관련 작업에 대한 API를 제공합니다.

* UUID 생성.
* UUID를 문자열 표현으로부터 파싱하거나 문자열로 포맷팅.
* 지정된 128비트 값으로부터 UUID 생성.
* UUID의 128비트에 접근.

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

`java.util.UUID`를 사용하는 API와의 호환성을 유지하기 위해 Kotlin/JVM에는 `java.util.UUID`와 `kotlin.uuid.Uuid` 사이를 변환하는 두 가지 확장 함수인 `.toJavaUuid()` 및 `.toKotlinUuid()`가 있습니다. 예:

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// Kotlin UUID를 java.util.UUID로 변환
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// Java UUID를 kotlin.uuid.Uuid로 변환
val kotlinUuid = javaUuid.toKotlinUuid()
```

이 기능과 제공된 API는 여러 플랫폼 간에 코드를 공유할 수 있게 함으로써 멀티플랫폼 소프트웨어 개발을 단순화합니다. UUID는 고유 식별자를 생성하기 어려운 환경에서도 이상적입니다.

UUID와 관련된 몇 가지 사용 사례는 다음과 같습니다.

* 데이터베이스 레코드에 고유 ID 할당.
* 웹 세션 식별자 생성.
* 고유한 식별이나 추적이 필요한 모든 시나리오.

### HexFormat의 minLength 지원

> [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 클래스와 해당 프로퍼티들은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
> 옵트인하려면 `@OptIn(ExperimentalStdlibApi::class)` 어노테이션이나 컴파일러 옵션 `-opt-in=kotlin.ExperimentalStdlibApi`를 사용하세요.
>
{style="warning"}

Kotlin 2.0.20은 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html)를 통해 접근할 수 있는 [`NumberHexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) 클래스에 새로운 `minLength` 프로퍼티를 추가했습니다. 이 프로퍼티를 사용하면 숫자 값의 16진수 표현에서 최소 자릿수를 지정할 수 있으며, 필요한 길이를 맞추기 위해 0으로 패딩할 수 있습니다. 또한 `removeLeadingZeros` 프로퍼티를 사용하여 앞부분의 0을 제거할 수도 있습니다.

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

`minLength` 프로퍼티는 파싱에 영향을 미치지 않습니다. 하지만 파싱할 때 16진수 문자열이 타입의 너비보다 더 많은 자릿수를 가지고 있더라도, 추가된 앞부분의 자릿수가 0인 경우 파싱이 허용됩니다.

### Base64 디코더 동작 변경

> [`Base64` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/) 및 관련 기능들은 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
> 옵트인하려면 `@OptIn(ExperimentalEncodingApi::class)` 어노테이션이나 컴파일러 옵션 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`를 사용하세요.
>
{style="warning"}

Kotlin 2.0.20에서는 Base64 디코더 동작에 두 가지 변경 사항이 도입되었습니다.

* [Base64 디코더에 패딩 필수 적용](#the-base64-decoder-now-requires-padding)
* [패딩 설정을 위한 withPadding 함수 추가](#withpadding-function-for-padding-configuration)

#### Base64 디코더에 패딩 필수 적용

이제 Base64 인코더는 기본적으로 패딩을 추가하며, 디코더는 패딩을 요구하고 디코딩 시 0이 아닌 패드 비트를 금지합니다.

#### 패딩 설정을 위한 withPadding 함수

사용자가 Base64 인코딩 및 디코딩의 패딩 동작을 제어할 수 있도록 새로운 `.withPadding()` 함수가 도입되었습니다.

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

이 함수를 사용하면 다양한 패딩 옵션이 있는 `Base64` 인스턴스를 생성할 수 있습니다.

| `PaddingOption`    | 인코딩 시        | 디코딩 시           |
|--------------------|--------------|---------------------|
| `PRESENT`          | 패딩 추가     | 패딩 필수            |
| `ABSENT`           | 패딩 생략     | 패딩 허용 안 함       |
| `PRESENT_OPTIONAL` | 패딩 추가     | 패딩 선택 사항        |
| `ABSENT_OPTIONAL`  | 패딩 생략     | 패딩 선택 사항        |

다양한 패딩 옵션을 가진 `Base64` 인스턴스를 생성하고 데이터를 인코딩 및 디코딩하는 데 사용할 수 있습니다.

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // 인코딩할 예제 데이터
    val data = "fooba".toByteArray()

    // URL-safe 알파벳과 PRESENT 패딩을 사용하는 Base64 인스턴스 생성
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("PRESENT 패딩이 포함된 인코딩 데이터: $encodedDataPresent")
    // PRESENT 패딩이 포함된 인코딩 데이터: Zm9vYmE=

    // URL-safe 알파벳과 ABSENT 패딩을 사용하는 Base64 인스턴스 생성
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("ABSENT 패딩이 포함된 인코딩 데이터: $encodedDataAbsent")
    // ABSENT 패딩이 포함된 인코딩 데이터: Zm9vYmE

    // 다시 데이터 디코딩
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("PRESENT 패딩으로 디코딩된 데이터: ${String(decodedDataPresent)}")
    // PRESENT 패딩으로 디코딩된 데이터: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("ABSENT 패딩으로 디코딩된 데이터: ${String(decodedDataAbsent)}")
    // ABSENT 패딩으로 디코딩된 데이터: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 문서 업데이트

Kotlin 문서에 몇 가지 주목할 만한 변경 사항이 있습니다.

* 개선된 [표준 입력 페이지](standard-input.md) - Java Scanner 및 `readln()` 사용 방법을 알아보세요.
* 개선된 [K2 컴파일러 마이그레이션 가이드](k2-compiler-migration-guide.md) - 성능 향상, Kotlin 라이브러리와의 호환성, 사용자 정의 컴파일러 플러그인 처리 방법을 알아보세요.
* 개선된 [예외 페이지](exceptions.md) - 예외의 개념과 발생 및 포착(throw and catch) 방법을 알아보세요.
* 개선된 [JVM에서 JUnit을 사용한 테스트 코드 - 튜토리얼](jvm-test-using-junit.md) - JUnit을 사용하여 테스트를 생성하는 방법을 알아보세요.
* 개선된 [Swift/Objective-C 상호운용성 페이지](native-objc-interop.md) - Swift/Objective-C 코드에서 Kotlin 선언을 사용하고 Kotlin 코드에서 Objective-C 선언을 사용하는 방법을 알아보세요.
* 개선된 [Swift 패키지 내보내기 설정 페이지](https://kotlinlang.org/docs/multiplatform/multiplatform-spm-export.html) - Swift 패키지 매니저 의존성에서 사용할 수 있는 Kotlin/Native 출력을 설정하는 방법을 알아보세요.

## Kotlin 2.0.20 설치

IntelliJ IDEA 2023.3 및 Android Studio Iguana (2023.2.1) Canary 15부터 Kotlin 플러그인은 IDE에 포함된 번들 플러그인으로 배포됩니다. 즉, 더 이상 JetBrains Marketplace에서 플러그인을 설치할 수 없습니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을 2.0.20으로 변경](releases.md#update-to-a-new-kotlin-version)하세요.