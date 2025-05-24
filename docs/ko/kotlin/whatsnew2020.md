---
title: "Kotlin 2.0.20의 새로운 기능"
---
_[릴리스 날짜: 2024년 8월 22일](releases#release-details)_

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 2.0.20 릴리스가 출시되었습니다! 이 버전에는 Kotlin K2 컴파일러를 Stable로 발표한 Kotlin 2.0.0의 성능 개선 및 버그 수정 사항이 포함되어 있습니다. 이번 릴리스의 주요 내용은 다음과 같습니다.

* [데이터 클래스 copy 함수가 생성자와 동일한 가시성을 갖게 됩니다](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [기본 대상 계층 구조의 소스 세트에 대한 정적 접근자를 이제 멀티플랫폼 프로젝트에서 사용할 수 있습니다](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native에 대한 동시 마킹이 가비지 컬렉터에서 가능해졌습니다](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm의 `@ExperimentalWasmDsl` 어노테이션에 새로운 위치가 생겼습니다](#new-location-of-experimentalwasmdsl-annotation)
* [Gradle 버전 8.6–8.8에 대한 지원이 추가되었습니다](#gradle)
* [새로운 옵션을 통해 Gradle 프로젝트 간에 JVM 아티팩트를 클래스 파일로 공유할 수 있습니다](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [Compose 컴파일러가 업데이트되었습니다](#compose-compiler)
* [일반 Kotlin 표준 라이브러리에 UUID에 대한 지원이 추가되었습니다](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 지원

2.0.20을 지원하는 Kotlin 플러그인은 최신 IntelliJ IDEA 및 Android Studio에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.0.20으로 변경하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

Kotlin 2.0.20은 데이터 클래스의 일관성을 개선하고 Experimental 컨텍스트 수신기 기능을 대체하기 위한 변경 사항을 도입하기 시작합니다.

### 데이터 클래스 copy 함수가 생성자와 동일한 가시성을 갖게 됩니다

현재 `private` 생성자를 사용하여 데이터 클래스를 생성하는 경우 자동으로 생성되는 `copy()` 함수는 동일한 가시성을 갖지 않습니다. 이로 인해 나중에 코드에서 문제가 발생할 수 있습니다. 향후 Kotlin 릴리스에서는 `copy()` 함수의 기본 가시성이 생성자와 동일한 동작을 도입할 예정입니다. 이 변경 사항은 코드를 최대한 원활하게 마이그레이션할 수 있도록 점진적으로 도입될 예정입니다.

마이그레이션 계획은 Kotlin 2.0.20부터 시작되며, 향후 가시성이 변경될 코드에서 경고를 발생시킵니다. 예를 들어 다음과 같습니다.

```kotlin
// 2.0.20에서 경고를 트리거합니다
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 2.0.20에서 경고를 트리거합니다
    val negativeNumber = positiveNumber.copy(number = -1)
    // Warning: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
    // 경고: 비공개 기본 생성자가 'data' 클래스의 생성된 'copy()' 메서드를 통해 노출됩니다.
    // 생성된 'copy()'는 향후 릴리스에서 가시성이 변경됩니다.
}
```

마이그레이션 계획에 대한 최신 정보는 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914)의 해당 이슈를 참조하세요.

이 동작을 보다 세밀하게 제어할 수 있도록 Kotlin 2.0.20에는 두 가지 어노테이션이 도입되었습니다.

* `@ConsistentCopyVisibility`: 나중에 기본값으로 만들기 전에 지금 이 동작을 선택합니다.
* `@ExposedCopyVisibility`: 동작을 옵트아웃하고 선언 위치에서 경고를 억제합니다.
  이 어노테이션을 사용하더라도 컴파일러는 `copy()` 함수가 호출될 때 여전히 경고를 보고합니다.

개별 클래스가 아닌 전체 모듈에 대해 2.0.20에서 이미 새로운 동작을 선택하려면
`-Xconsistent-data-class-copy-visibility` 컴파일러 옵션을 사용할 수 있습니다.
이 옵션은 모듈의 모든 데이터 클래스에 `@ConsistentCopyVisibility` 어노테이션을 추가하는 것과 동일한 효과를 갖습니다.

### 컨텍스트 수신기를 컨텍스트 매개변수로 단계적으로 대체

Kotlin 1.6.20에서는 [컨텍스트 수신기](whatsnew1620#prototype-of-context-receivers-for-kotlin-jvm)를
[Experimental](components-stability#stability-levels-explained) 기능으로 도입했습니다. 커뮤니티 피드백을 청취한 후 이 접근 방식을 계속 진행하지 않고 다른 방향으로 진행하기로 결정했습니다.

향후 Kotlin 릴리스에서는 컨텍스트 수신기가 컨텍스트 매개변수로 대체됩니다. 컨텍스트 매개변수는 여전히 설계 단계에 있으며 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters)에서 제안을 찾을 수 있습니다.

컨텍스트 매개변수를 구현하려면 컴파일러를 크게 변경해야 하므로 컨텍스트 수신기와 컨텍스트 매개변수를 동시에 지원하지 않기로 결정했습니다. 이 결정은 구현을 크게 단순화하고 불안정한 동작의 위험을 최소화합니다.

컨텍스트 수신기는 이미 많은 개발자가 사용하고 있음을 알고 있습니다. 따라서 컨텍스트 수신기에 대한 지원을 점진적으로 제거하기 시작할 것입니다. 마이그레이션 계획은 Kotlin 2.0.20부터 시작되며, `-Xcontext-receivers` 컴파일러 옵션과 함께 컨텍스트 수신기가 사용될 때 코드에서 경고가 발생합니다. 예를 들어 다음과 같습니다.

```kotlin
class MyContext

context(MyContext)
// Warning: Experimental context receivers are deprecated and will be superseded by context parameters. 
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
// 경고: Experimental 컨텍스트 수신기는 더 이상 사용되지 않으며 컨텍스트 매개변수로 대체됩니다.
// 컨텍스트 수신기를 사용하지 마십시오. 매개변수를 명시적으로 전달하거나 확장자를 사용하여 멤버를 사용할 수 있습니다.
fun someFunction() {
}
```

이 경고는 향후 Kotlin 릴리스에서 오류가 됩니다.

코드에서 컨텍스트 수신기를 사용하는 경우 다음 중 하나를 사용하도록 코드를 마이그레이션하는 것이 좋습니다.

* 명시적 매개변수.
<table>
<tr>
<td>
이전
</td>
<td>
이후
</td>
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

* 확장 멤버 함수 (가능한 경우).
<table>
<tr>
<td>
이전
</td>
<td>
이후
</td>
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

또는 컴파일러에서 컨텍스트 매개변수가 지원되는 Kotlin 릴리스까지 기다릴 수 있습니다. 컨텍스트 매개변수는 처음에는 Experimental 기능으로 도입됩니다.

## Kotlin Multiplatform

Kotlin 2.0.20은 멀티플랫폼 프로젝트의 소스 세트 관리를 개선하고 Gradle의 최근 변경 사항으로 인해 일부 Gradle Java 플러그인과의 호환성을 더 이상 사용하지 않습니다.

### 기본 대상 계층 구조의 소스 세트에 대한 정적 접근자

Kotlin 1.9.20부터 [기본 계층 구조 템플릿](multiplatform-hierarchy#default-hierarchy-template)이
모든 Kotlin Multiplatform 프로젝트에 자동으로 적용됩니다.
그리고 기본 계층 구조 템플릿의 모든 소스 세트에 대해 Kotlin Gradle 플러그인은 유형 안전 접근자를 제공했습니다.
이러한 방식으로 `by getting` 또는 `by creating` 구문을 사용하지 않고도 지정된 모든 대상에 대한 소스 세트에 최종적으로 액세스할 수 있습니다.

Kotlin 2.0.20은 IDE 환경을 더욱 개선하는 것을 목표로 합니다. 이제 기본 계층 구조 템플릿의 모든 소스 세트에 대해 `sourceSets {}` 블록에 정적 접근자를 제공합니다.
이러한 변경으로 인해 이름으로 소스 세트에 더 쉽고 예측 가능하게 액세스할 수 있을 것이라고 생각합니다.

각 소스 세트에는 이제 샘플이 포함된 자세한 KDoc 주석과 해당 대상을 먼저 선언하지 않고 소스 세트에 액세스하려고 할 경우 경고가 포함된 진단 메시지가 있습니다.

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
        // 경고: 대상을 등록하지 않고 소스 세트에 액세스
        iosX64Main { }
    }
}
```

<img src="/img/accessing-sourse-sets.png" alt="Accessing the source sets by name" width="700" style={{verticalAlign: 'middle'}}/>

[Kotlin Multiplatform의 계층적 프로젝트 구조](multiplatform-hierarchy)에 대해 자세히 알아보세요.

### Kotlin Multiplatform Gradle 플러그인 및 Gradle Java 플러그인과의 더 이상 사용되지 않는 호환성

Kotlin 2.0.20에서는 Kotlin Multiplatform Gradle 플러그인과 다음 Gradle Java 플러그인을 동일한 프로젝트에 적용할 때 더 이상 사용되지 않는 경고를 도입합니다. [Java](https://docs.gradle.org/current/userguide/java_plugin.html),
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 및 [Application](https://docs.gradle.org/current/userguide/application_plugin.html).
멀티플랫폼 프로젝트의 다른 Gradle 플러그인이 Gradle Java 플러그인을 적용할 때도 경고가 표시됩니다.
예를 들어 [Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html)은 자동으로 Application 플러그인을 적용합니다.

Kotlin Multiplatform의 프로젝트 모델과 Gradle의 Java 에코시스템 플러그인 간의 근본적인 호환성 문제로 인해 이 더 이상 사용되지 않는 경고를 추가했습니다. Gradle의 Java 에코시스템 플러그인은 현재 다른 플러그인이 다음을 수행할 수 있다는 점을 고려하지 않습니다.

* Java 에코시스템 플러그인과 다른 방식으로 JVM 대상을 게시하거나 컴파일합니다.
* 동일한 프로젝트에 JVM 및 Android와 같은 두 개의 다른 JVM 대상이 있습니다.
* 잠재적으로 여러 비 JVM 대상이 있는 복잡한 멀티플랫폼 프로젝트 구조를 갖습니다.

불행히도 Gradle은 현재 이러한 문제를 해결하기 위한 API를 제공하지 않습니다.

이전에는 Java 에코시스템 플러그인의 통합을 지원하기 위해 Kotlin Multiplatform에서 일부 해결 방법을 사용했습니다.
그러나 이러한 해결 방법은 호환성 문제를 완전히 해결하지 못했으며 Gradle 8.8 릴리스 이후에는 이러한 해결 방법이 더 이상 불가능합니다. 자세한 내용은 [YouTrack 문제](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)를 참조하세요.

이 호환성 문제를 해결하는 방법을 아직 정확히 알지 못하지만 Kotlin Multiplatform 프로젝트에서 Java 소스 컴파일에 대한 몇 가지 형태의 지원을 계속 제공할 것입니다. 최소한 Java 소스 컴파일과 Gradle의 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html)
플러그인을 멀티플랫폼 프로젝트 내에서 지원할 것입니다.

그동안 멀티플랫폼 프로젝트에서 이 더 이상 사용되지 않는 경고가 표시되면 다음을 수행하는 것이 좋습니다.
1. 프로젝트에서 Gradle Java 플러그인이 실제로 필요한지 확인합니다. 그렇지 않은 경우 제거하는 것을 고려하십시오.
2. Gradle Java 플러그인이 단일 작업에만 사용되는지 확인합니다. 그렇다면 많은 노력 없이 플러그인을 제거할 수 있습니다.
   예를 들어 작업에서 Gradle Java 플러그인을 사용하여 Javadoc JAR 파일을 만드는 경우 Javadoc
   작업을 수동으로 정의할 수 있습니다.

그렇지 않고 Kotlin Multiplatform Gradle 플러그인과 멀티플랫폼 프로젝트의 Java용 Gradle 플러그인을 모두 사용하려면 다음을 수행하는 것이 좋습니다.

1. 멀티플랫폼 프로젝트에 별도의 하위 프로젝트를 만듭니다.
2. 별도의 하위 프로젝트에서 Java용 Gradle 플러그인을 적용합니다.
3. 별도의 하위 프로젝트에서 상위 멀티플랫폼 프로젝트에 대한 종속성을 추가합니다.

:::note
별도의 하위 프로젝트는 멀티플랫폼 프로젝트가 **아니어야** 하며 멀티플랫폼 프로젝트에 대한 종속성을 설정하는 데만 사용해야 합니다.

예를 들어 `my-main-project`라는 멀티플랫폼 프로젝트가 있고
[Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle 플러그인을 사용하여 JVM 애플리케이션을 실행하려고 합니다.

하위 프로젝트를 만들었으면 `subproject-A`라고 하고 상위 프로젝트 구조는 다음과 같습니다.

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

하위 프로젝트의 `build.gradle.kts` 파일에서 `plugins {}` 블록에 Application 플러그인을 적용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("application")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id('application')
}
```

</TabItem>
</Tabs>

하위 프로젝트의 `build.gradle.kts` 파일에서 상위 멀티플랫폼 프로젝트에 대한 종속성을 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation(project(":my-main-project")) // The name of your parent multiplatform project
    // 상위 멀티플랫폼 프로젝트의 이름
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation project(':my-main-project') // The name of your parent multiplatform project
    // 상위 멀티플랫폼 프로젝트의 이름
}
```

</TabItem>
</Tabs>

이제 상위 프로젝트가 두 플러그인 모두에서 작동하도록 설정되었습니다.

## Kotlin/Native

Kotlin/Native는 가비지 컬렉터와 Swift/Objective-C에서 Kotlin 일시 중단 함수를 호출하기 위한 개선 사항을 받습니다.

### 가비지 컬렉터에서 동시 마킹

Kotlin 2.0.20에서 JetBrains 팀은 Kotlin/Native 런타임 성능을 개선하기 위한 또 다른 단계를 수행합니다.
가비지 컬렉터(GC)에서 동시 마킹에 대한 실험적 지원을 추가했습니다.

기본적으로 애플리케이션 스레드는 GC가 힙에서 개체를 마킹할 때 일시 중지되어야 합니다. 이는 Compose Multiplatform으로 구축된 UI 애플리케이션과 같이 대기 시간에 중요한 애플리케이션의 성능에 중요한 GC 일시 중지 시간의 지속 시간에 큰 영향을 미칩니다.

이제 가비지 컬렉션의 마킹 단계를 애플리케이션 스레드와 동시에 실행할 수 있습니다.
이렇게 하면 GC 일시 중지 시간이 크게 단축되고 앱 응답성이 향상됩니다.

#### 활성화 방법

이 기능은 현재 [Experimental](components-stability#stability-levels-explained)입니다.
활성화하려면 `gradle.properties` 파일에서 다음 옵션을 설정합니다.

```none
kotlin.native.binary.gc=cms
```

문제는 이슈 트래커 [YouTrack](https://kotl.in/issue)에 보고하십시오.

### 비트코드 임베딩 지원 제거됨

Kotlin 2.0.20부터 Kotlin/Native 컴파일러는 더 이상 비트코드 임베딩을 지원하지 않습니다.
비트코드 임베딩은 Xcode 14에서 더 이상 사용되지 않고 모든 Apple 대상에 대해 Xcode 15에서 제거되었습니다.

이제 프레임워크 구성에 대한 `embedBitcode` 매개변수와
`-Xembed-bitcode` 및 `-Xembed-bitcode-marker` 명령줄 인수가 더 이상 사용되지 않습니다.

이전 버전의 Xcode를 계속 사용하지만 Kotlin 2.0.20으로 업그레이드하려면
Xcode 프로젝트에서 비트코드 임베딩을 비활성화하십시오.

### Signpost를 사용한 GC 성능 모니터링 변경 사항

Kotlin 2.0.0에서는 Xcode Instruments를 통해 Kotlin/Native 가비지 컬렉터
(GC)의 성능을 모니터링할 수 있었습니다. Instruments에는 GC 일시 중지를 이벤트로 표시할 수 있는 signpost 도구가 포함되어 있습니다.
이는 iOS 앱에서 GC 관련 정지를 확인할 때 유용합니다.

이 기능은 기본적으로 활성화되었지만 불행히도
애플리케이션이 Xcode Instruments와 동시에 실행될 때 충돌이 발생하는 경우가 있었습니다.
Kotlin 2.0.20부터는 다음 컴파일러 옵션을 사용하여 명시적으로 옵트인해야 합니다.

```none
-Xbinary=enableSafepointSignposts=true
```

[설명서](native-memory-manager#monitor-gc-performance)에서 GC 성능 분석에 대해 자세히 알아보세요.

### 주 스레드가 아닌 스레드에서 Swift/Objective-C에서 Kotlin 일시 중단 함수를 호출하는 기능

이전에는 Kotlin/Native에 기본 제한이 있었는데, Swift
및 Objective-C에서 Kotlin 일시 중단 함수를 호출하는 기능을 주 스레드로만 제한했습니다. Kotlin 2.0.20은 해당 제한을 해제하여 모든 스레드에서 Swift/Objective-C에서 Kotlin
`suspend` 함수를 실행할 수 있도록 합니다.

`kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none`
바이너리 옵션으로 주 스레드가 아닌 스레드에 대한 기본 동작을 이전에 전환한 경우 이제 `gradle.properties` 파일에서 해당 옵션을 제거할 수 있습니다.

## Kotlin/Wasm

Kotlin 2.0.20에서 Kotlin/Wasm은 명명된 내보내기로의 마이그레이션을 계속하고 `@ExperimentalWasmDsl` 어노테이션의 위치를 변경합니다.

### 기본 내보내기 사용 오류

명명된 내보내기로의 마이그레이션의 일부로 JavaScript에서 Kotlin/Wasm 내보내기에 대한 기본
가져오기를 사용할 때 콘솔에 경고 메시지가 이전에 인쇄되었습니다.

명명된 내보내기를 완전히 지원하기 위해 이 경고가 이제 오류로 업그레이드되었습니다. 기본 가져오기를 사용하는 경우 다음 오류 메시지가 표시됩니다.

```text
Do not use default import. Use the corresponding named import instead.
기본 가져오기를 사용하지 마십시오. 해당 명명된 가져오기를 대신 사용하십시오.
```

이 변경 사항은 명명된 내보내기로 마이그레이션하기 위한 더 이상 사용되지 않는 주기의 일부입니다. 각 단계에서 예상할 수 있는 사항은 다음과 같습니다.

* **버전 2.0.0**: 기본 내보내기를 통해 엔터티를 내보내는 것은 더 이상 사용되지 않는다고 설명하는 경고 메시지가 콘솔에 인쇄됩니다.
* **버전 2.0.20**: 오류가 발생하여 해당 명명된 가져오기를 사용하도록 요청합니다.
* **버전 2.1.0**: 기본 가져오기 사용이 완전히 제거됩니다.

### ExperimentalWasmDsl 어노테이션의 새 위치

이전에는 WebAssembly(Wasm) 기능에 대한 `@ExperimentalWasmDsl` 어노테이션이 Kotlin Gradle 플러그인 내에서 다음 위치에 배치되었습니다.

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

2.0.20에서 `@ExperimentalWasmDsl` 어노테이션이 다음 위치로 재배치되었습니다.

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

이전 위치는 이제 더 이상 사용되지 않으며 해결되지 않은 참조로 인해 빌드 실패가 발생할 수 있습니다.

`@ExperimentalWasmDsl` 어노테이션의 새 위치를 반영하려면 Gradle 빌드 스크립트에서 import 문을 업데이트합니다.
새 `@ExperimentalWasmDsl` 위치에 대한 명시적 import를 사용합니다.

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

또는 이전 패키지에서 이 별표 import 문을 제거합니다.

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS

Kotlin/JS는 JavaScript에서 정적 멤버를 지원하고 JavaScript에서 Kotlin 컬렉션을 생성하기 위한 몇 가지 Experimental 기능을 도입합니다.

### JavaScript에서 Kotlin 정적 멤버 사용 지원

이 기능은 [Experimental](components-stability#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin 2.0.20부터 `@JsStatic` 어노테이션을 사용할 수 있습니다. [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/)와 유사하게 작동하며
컴파일러에게 대상 선언에 대한 추가 정적 메서드를 생성하도록 지시합니다. 이렇게 하면 Kotlin 코드의 정적
멤버를 JavaScript에서 직접 사용할 수 있습니다.

클래스 및 인터페이스 내에서 선언된 동반자 개체뿐만 아니라 명명된 개체에 정의된 함수에 대해 `@JsStatic` 어노테이션을 사용할 수 있습니다. 컴파일러는 개체의 정적 메서드와 개체 자체의 인스턴스 메서드를 모두 생성합니다. 예를 들어 다음과 같습니다.

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

이제 `callStatic()`은 JavaScript에서 정적이고 `callNonStatic()`은 그렇지 않습니다.

```javascript
C.callStatic();              // Works, accessing the static function
// 작동, 정적 함수에 액세스
C.callNonStatic();           // Error, not a static function in the generated JavaScript
// 오류, 생성된 JavaScript에서 정적 함수가 아님
C.Companion.callStatic();    // Instance method remains
// 인스턴스 메서드가 유지됨
C.Companion.callNonStatic(); // The only way it works
// 작동하는 유일한 방법
```

개체 또는 동반자 개체의 속성에 `@JsStatic` 어노테이션을 적용하여 해당 개체 또는 동반자 개체를 포함하는 클래스에서 해당 getter
및 setter 메서드를 정적 멤버로 만들 수도 있습니다.

### JavaScript에서 Kotlin 컬렉션을 생성하는 기능

이 기능은 [Experimental](components-stability#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin 2.0.0은 Kotlin 컬렉션을 JavaScript(및 TypeScript)로 내보내는 기능을 도입했습니다. 이제 JetBrains 팀은
컬렉션 상호 운용성을 개선하기 위한 또 다른 단계를 수행하고 있습니다. Kotlin 2.0.20부터 JavaScript/TypeScript 쪽에서 Kotlin 컬렉션을 직접
만들 수 있습니다.

JavaScript에서 Kotlin 컬렉션을 만들고 내보낸 생성자 또는 함수에 인수로 전달할 수 있습니다.
내보낸 선언 내에서 컬렉션을 언급하는 즉시 Kotlin은 JavaScript/TypeScript에서 사용할 수 있는 컬렉션에 대한 팩터리를 생성합니다.

다음과 같이 내보낸 함수를 살펴보겠습니다.

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

`MutableMap` 컬렉션이 언급되었으므로 Kotlin은 JavaScript/TypeScript에서 사용할 수 있는 팩터리 메서드를 사용하여 개체를 생성합니다.
그런 다음 이 팩터리 메서드는 JavaScript `Map`에서 `MutableMap`을 만듭니다.

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

이 기능은 `Set`, `Map` 및 `List` Kotlin 컬렉션 유형과 해당 변경 가능한 컬렉션 유형에 사용할 수 있습니다.

## Gradle

Kotlin 2.0.20은 Gradle 6.8.3에서 8.6까지 완벽하게 호환됩니다. Gradle 8.7 및 8.8도 지원되지만 한 가지
예외가 있습니다. Kotlin Multiplatform Gradle 플러그인을 사용하는 경우 멀티플랫폼 프로젝트에서 JVM 대상에서 `withJava()` 함수를 호출하는 데 대한 더 이상 사용되지 않는 경고가 표시될 수 있습니다. 가능한 한 빨리 이 문제를 해결할 계획입니다.

자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)에서 문제를 참조하세요.

최신 Gradle 릴리스까지 Gradle 버전을 사용할 수도 있지만 사용하는 경우 더 이상 사용되지 않는 경고가 발생하거나 일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

이 버전에서는 JVM 기록 파일을 기반으로 하는 기존 증분 컴파일 접근 방식에 대한 더 이상 사용되지 않는 프로세스를 시작하고 프로젝트 간에 JVM 아티팩트를 공유하는 새로운 방법을 제공하는 것과 같은 변경 사항이 제공됩니다.

### JVM 기록 파일을 기반으로 하는 더 이상 사용되지 않는 증분 컴파일

Kotlin 2.0.20에서는 Kotlin 1.8.20부터 기본적으로 활성화된 새로운 증분 컴파일 접근 방식을 선호하여 JVM 기록 파일을 기반으로 하는 증분 컴파일 접근 방식이 더 이상 사용되지 않습니다.

JVM 기록 파일을 기반으로 하는 증분 컴파일 접근 방식은
[Gradle의 빌드 캐시](https://docs.gradle.org/current/userguide/build_cache.html)와 함께 작동하지 않고
컴파일 방지를 지원하지 않는 등 제한 사항이 있었습니다.
반대로 새로운 증분 컴파일 접근 방식은 이러한 제한 사항을 극복하고 도입 이후 잘 수행되었습니다.

새로운 증분 컴파일 접근 방식이 지난 두 개의 주요 Kotlin 릴리스에서 기본적으로 사용되었다는 점을 감안할 때
Kotlin 2.0.20에서는 `kotlin.incremental.useClasspathSnapshot` Gradle 속성이 더 이상 사용되지 않습니다.
따라서 옵트아웃하는 데 사용하면 더 이상 사용되지 않는 경고가 표시됩니다.

### 프로젝트 간에 JVM 아티팩트를 클래스 파일로 공유하는 옵션

이 기능은 [Experimental](components-stability#stability-levels-explained)입니다.
언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.
옵트인이 필요합니다 (자세한 내용은 아래 참조).

Kotlin 2.0.20에서는 Kotlin/JVM 컴파일의 출력(예: JAR 파일)이 프로젝트 간에 공유되는 방식을 변경하는 새로운 접근 방식을 도입합니다. 이 접근 방식에서는 Gradle의 `apiElements` 구성에 컴파일된 `.class` 파일이 포함된 디렉터리에 대한 액세스를 제공하는 보조 변형이 있습니다. 구성되면 프로젝트는 컴파일 중에 압축된 JAR 아티팩트를 요청하는 대신 이 디렉터리를 사용합니다. 이렇게 하면 특히 증분 빌드의 경우 JAR 파일이 압축 및 압축 해제되는 횟수가 줄어듭니다.

테스트 결과에 따르면 이 새로운 접근 방식은 Linux 및 macOS 호스트에 대한 빌드 성능 개선을 제공할 수 있습니다.
그러나 Windows 호스트에서는 Windows가 파일 작업 시 I/O 작업을 처리하는 방식으로 인해 성능 저하가 발생했습니다.

이 새로운 접근 방식을 사용해 보려면 `gradle.properties` 파일에 다음 속성을 추가합니다.

```none
kotlin.jvm.addClassesVariant=true
```

기본적으로 이 속성은 `false`로 설정되어 있고 Gradle의 `apiElements` 변형은 압축된 JAR 아티팩트를 요청합니다.

Java 전용 프로젝트에서 이 속성을 사용하여 컴파일된 `.class` 파일이 포함된 디렉터리 **대신** 컴파일 중에 압축된 JAR 아티팩트만 노출할 수 있는 관련 속성이 있습니다.

```none
org.gradle.java.compile-classpath-packaging=true
```

이 속성과 해당 목적에 대한 자세한 내용은
[대규모 다중 프로젝트에 대한 Windows의 심각한 빌드 성능 저하](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance)에 대한 Gradle 문서를 참조하십시오.

:::

이 새로운 접근 방식에 대한 피드백을 보내주시면 감사하겠습니다. 사용하는 동안 성능이 향상되었습니까?
[YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts)에 댓글을 추가하여 알려주십시오.

### Kotlin Gradle 플러그인의 종속성 동작을 java-test-fixtures 플러그인과 정렬

Kotlin 2.0.20 이전에는 프로젝트에서 [`java-test-fixtures` 플러그인](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)을 사용하는 경우 종속성이 전파되는 방식에서 Gradle과 Kotlin Gradle 플러그인 간에 차이가 있었습니다.

Kotlin Gradle 플러그인은 종속성을 전파했습니다.

* `java-test-fixtures` 플러그인의 `implementation` 및 `api` 종속성 유형에서 `test` 소스 세트 컴파일 클래스 경로로.
* 기본 소스 세트의 `implementation` 및 `api` 종속성 유형에서 `java-test-fixtures` 플러그인의 소스 세트 컴파일 클래스 경로로.

그러나 Gradle은 `api` 종속성 유형에서만 종속성을 전파했습니다.

이러한 동작 차이로 인해 일부 프로젝트에서 클래스 경로에서 리소스 파일을 여러 번 찾았습니다.

Kotlin 2.0.20부터 Kotlin Gradle 플러그인의 동작은 Gradle의 `java-test-fixtures` 플러그인과 정렬되어 이 문제가 더 이상 발생하지 않도록 합니다.

이 변경의 결과로 `test` 및 `testFixtures` 소스 세트의 일부 종속성에 더 이상 액세스할 수 없을 수 있습니다.
이 경우 종속성 선언 유형을 `implementation`에서 `api`로 변경하거나 영향을 받는 소스 세트에 새 종속성
선언을 추가합니다.

### 컴파일 작업에 아티팩트에 대한 작업 종속성이 없는 드문 경우에 작업 종속성이 추가되었습니다.

2.0.20 이전에는 컴파일 작업에 아티팩트 입력 중 하나에 대한 작업 종속성이 없는 시나리오가 있는 것으로 확인되었습니다. 이는 종속 컴파일 작업의 결과가 불안정하다는 것을 의미했습니다. 때로는 아티팩트가 제 시간에 생성되었지만 때로는 그렇지 않았기 때문입니다.

이 문제를 해결하기 위해 Kotlin Gradle 플러그인은 이제 이러한 시나리오에서 필요한 작업 종속성을 자동으로 추가합니다.

매우 드문 경우에 이 새로운 동작으로 인해 순환 종속성 오류가 발생할 수 있습니다.
예를 들어 한 컴파일에서 다른 컴파일의 모든 내부 선언을 볼 수 있고 생성된 아티팩트가 두 컴파일 작업의 출력에 모두 의존하는 여러 컴파일이 있는 경우 다음과 같은 오류가 표시될 수 있습니다.

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
// 다음 작업 간의 순환 종속성:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
// (*) - 세부 정보는 생략되었습니다 (이전에 나열됨)
```

이 순환 종속성 오류를 해결하기 위해 Gradle 속성: `archivesTaskOutputAsFriendModule`을 추가했습니다.

기본적으로 이 속성은 작업 종속성을 추적하기 위해 `true`로 설정됩니다. 컴파일
작업에서 아티팩트 사용을 비활성화하여 작업 종속성이 필요하지 않도록 하려면 `gradle.properties` 파일에 다음을 추가합니다.

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

자세한 내용은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69330)에서 문제를 참조하세요.

## Compose 컴파일러

Kotlin 2.0.20에서 Compose 컴파일러는 몇 가지 개선 사항을 얻습니다.

### 2.0.0에 도입된 불필요한 재구성 문제 수정

Compose 컴파일러 2.0.0에는 JVM 대상이 아닌 멀티플랫폼 프로젝트에서 유형의 안정성을 잘못 추론하는 경우가 있는 문제가 있습니다. 이로 인해 불필요한(또는 무한한) 재구성이 발생할 수 있습니다. Kotlin 2.0.0용으로 제작된 Compose 앱을 버전 2.0.10 이상으로 업데이트하는 것이 좋습니다.

앱이 Compose 컴파일러 2.0.10 이상으로 빌드되었지만 버전 2.0.0으로 빌드된 종속성을 사용하는 경우 이러한 이전 종속성으로 인해 재구성 문제가 여전히 발생할 수 있습니다.
이를 방지하려면 앱과 동일한 Compose 컴파일러로 빌드된 버전으로 종속성을 업데이트하십시오.

### 컴파일러 옵션을 구성하는 새로운 방법

최상위 매개변수의 변경을 피하기 위해 새로운 옵션 구성 메커니즘