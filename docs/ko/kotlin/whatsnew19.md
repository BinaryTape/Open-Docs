---
title: "Kotlin 1.9.0의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[릴리스 날짜: 2023년 7월 6일](releases#release-details)_

Kotlin 1.9.0 릴리스가 출시되었으며 JVM용 K2 컴파일러가 이제 **베타** 단계에 있습니다. 또한 주요 특징은 다음과 같습니다.

* [새로운 Kotlin K2 컴파일러 업데이트](#new-kotlin-k2-compiler-updates)
* [enum class values 함수의 안정적인 대체](#stable-replacement-of-the-enum-class-values-function)
* [개방형 범위에 대한 안정적인 `..<` 연산자](#stable-operator-for-open-ended-ranges)
* [이름으로 regex 캡처 그룹을 가져오는 새로운 공통 함수](#new-common-function-to-get-regex-capture-group-by-name)
* [상위 디렉터리를 생성하는 새로운 경로 유틸리티](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform에서의 Gradle 구성 캐시 미리보기](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform에서 Android 타겟 지원 변경 사항](#changes-to-android-target-support)
* [Kotlin/Native의 사용자 지정 메모리 할당자 미리보기](#preview-of-custom-memory-allocator)
* [Kotlin/Native의 라이브러리 연결](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm의 크기 관련 최적화](#size-related-optimizations)

다음 비디오에서 업데이트에 대한 간략한 개요를 확인할 수도 있습니다.

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE 지원

1.9.0을 지원하는 Kotlin 플러그인은 다음에서 사용할 수 있습니다.

| IDE | 지원되는 버전 |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 플러그인은 곧 출시될 Android Studio Giraffe (223) 및 Hedgehog (231)에 포함될 예정입니다.

Kotlin 1.9.0 플러그인은 곧 출시될 IntelliJ IDEA 2023.2에 포함될 예정입니다.

:::note
Kotlin 아티팩트 및 종속성을 다운로드하려면 Maven Central Repository를 사용하도록 [Gradle 설정을 구성하세요](#configure-gradle-settings).

## 새로운 Kotlin K2 컴파일러 업데이트

JetBrains의 Kotlin 팀은 K2 컴파일러를 지속적으로 안정화하고 있으며 1.9.0 릴리스는 추가적인 발전을 도입합니다.
JVM용 K2 컴파일러는 이제 **베타** 단계에 있습니다.

이제 Kotlin/Native 및 Multiplatform 프로젝트에 대한 기본 지원도 제공됩니다.

### Kapt 컴파일러 플러그인과 K2 컴파일러의 호환성

프로젝트에서 K2 컴파일러와 함께 [kapt plugin](kapt)을 사용할 수 있지만 몇 가지 제한 사항이 있습니다.
`languageVersion`을 `2.0`으로 설정했음에도 불구하고 kapt 컴파일러 플러그인은 여전히 이전 컴파일러를 사용합니다.

`languageVersion`이 `2.0`으로 설정된 프로젝트 내에서 kapt 컴파일러 플러그인을 실행하면 kapt는 자동으로
`1.9`로 전환하고 특정 버전 호환성 검사를 비활성화합니다. 이 동작은 다음 명령 인수를 포함하는 것과 같습니다.
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

이러한 검사는 kapt 작업에 대해서만 비활성화됩니다. 다른 모든 컴파일 작업은 새 K2 컴파일러를 계속 사용합니다.

K2 컴파일러와 함께 kapt를 사용하는 동안 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### 프로젝트에서 K2 컴파일러를 사용해 보기

1.9.0부터 Kotlin 2.0 릴리스까지 `kotlin.experimental.tryK2=true`
Gradle 속성을 `gradle.properties` 파일에 추가하여 K2 컴파일러를 쉽게 테스트할 수 있습니다. 다음 명령을 실행할 수도 있습니다.

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

이 Gradle 속성은 자동으로 언어 버전을 2.0으로 설정하고 K2 컴파일러를 사용하여 컴파일된 Kotlin 작업 수와 현재 컴파일러를 사용한 작업 수를 포함하여 빌드 보고서를 업데이트합니다.

```none
##### 'kotlin.experimental.tryK2' 결과 (Kotlin/Native 확인 안 됨) #####
:lib:compileKotlin: 2.0 언어 버전
:app:compileKotlin: 2.0 언어 버전
##### 100% (2/2) 작업이 Kotlin 2.0으로 컴파일됨 #####
```

### Gradle 빌드 보고서

[Gradle 빌드 보고서](gradle-compilation-and-caches#build-reports)는 이제 코드를 컴파일하는 데 현재 컴파일러 또는 K2 컴파일러가 사용되었는지 여부를 보여줍니다. Kotlin 1.9.0에서는 [Gradle 빌드 스캔](https://scans.gradle.com/)에서 이 정보를 확인할 수 있습니다.

<img src="/img/gradle-build-scan-k1.png" alt="Gradle build scan - K1" width="700" style={{verticalAlign: 'middle'}}/>

<img src="/img/gradle-build-scan-k2.png" alt="Gradle build scan - K2" width="700" style={{verticalAlign: 'middle'}}/>

빌드 보고서에서 프로젝트에 사용된 Kotlin 버전도 확인할 수 있습니다.

```none
Task info:
  Kotlin language version: 1.9
```

Gradle 8.0을 사용하는 경우 특히 Gradle 구성
캐싱이 활성화된 경우 빌드 보고서에 문제가 발생할 수 있습니다. 이는 Gradle 8.1 이상에서 수정된 알려진 문제입니다.

:::

### 현재 K2 컴파일러 제한 사항

Gradle 프로젝트에서 K2를 활성화하면 다음과 같은 경우 Gradle 8.3 미만 버전을 사용하는 프로젝트에 영향을 미칠 수 있는 특정 제한 사항이 있습니다.

* `buildSrc`의 소스 코드 컴파일.
* 포함된 빌드에서 Gradle 플러그인 컴파일.
* Gradle 버전이 8.3 미만인 프로젝트에서 Gradle 플러그인을 사용하는 경우 다른 Gradle 플러그인 컴파일.
* Gradle 플러그인 종속성 빌드.

위에 언급된 문제 중 하나가 발생하면 다음 단계를 수행하여 문제를 해결할 수 있습니다.

* `buildSrc`, Gradle 플러그인 및 해당 종속성에 대한 언어 버전을 설정합니다.

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 프로젝트의 Gradle 버전을 8.3으로 업데이트합니다(사용 가능하게 되면).

### 새 K2 컴파일러에 대한 피드백 남기기

어떤 피드백이든 환영합니다!

* K2 개발자 Kotlin의 Slack에 직접 피드백을 제공하세요. [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 채널에 참여하세요.
* [이슈 트래커](https://kotl.in/issue)에서 새 K2 컴파일러와 관련하여 발생한 문제를 보고하세요.
* **사용 통계 보내기** 옵션을 활성화하여
  JetBrains에서 K2 사용에 대한 익명 데이터를 수집할 수 있도록 허용하세요.

## 언어

Kotlin 1.9.0에서는 이전에 도입된 몇 가지 새로운 언어 기능을 안정화하고 있습니다.
* [enum class values 함수의 대체](#stable-replacement-of-the-enum-class-values-function)
* [데이터 클래스와의 데이터 객체 대칭](#stable-data-objects-for-symmetry-with-data-classes)
* [inline value 클래스에서 본문이 있는 보조 생성자 지원](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enum class values 함수의 안정적인 대체

1.8.20에서는 enum 클래스에 대한 `entries` 속성이 실험적 기능으로 도입되었습니다. `entries` 속성은
합성 `values()` 함수에 대한 최신이고 성능이 뛰어난 대체 함수입니다. 1.9.0에서는 `entries` 속성이 안정적입니다.

:::note
`values()` 함수는 여전히 지원되지만 `entries`
속성을 대신 사용하는 것이 좋습니다.

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

enum 클래스에 대한 `entries` 속성에 대한 자세한 내용은 [Kotlin 1.8.20의 새로운 기능](whatsnew1820#a-modern-and-performant-replacement-of-the-enum-class-values-function)을 참조하세요.

### 데이터 클래스와의 데이터 객체 대칭

[Kotlin 1.8.20](whatsnew1820#preview-of-data-objects-for-symmetry-with-data-classes)에서 도입된 데이터 객체 선언은
이제 안정적입니다. 여기에는 데이터 클래스와의 대칭을 위해 추가된 함수인 `toString()`, `equals()` 및 `hashCode()`가 포함됩니다.

이 기능은 `sealed` 계층 구조(`sealed class` 또는 `sealed interface` 계층 구조와 같은)에서 특히 유용합니다.
`data object` 선언은 `data class` 선언과 함께 편리하게 사용할 수 있기 때문입니다. 이 예에서
일반 `object` 대신 `data object`로 `EndOfFile`을 선언하면 수동으로 재정의할 필요 없이 자동으로 `toString()` 함수가 있습니다.
이렇게 하면 첨부된 데이터 클래스 정의와 대칭을 유지할 수 있습니다.

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```

자세한 내용은 [Kotlin 1.8.20의 새로운 기능](whatsnew1820#preview-of-data-objects-for-symmetry-with-data-classes)을 참조하세요.

### inline value 클래스에서 본문이 있는 보조 생성자 지원

Kotlin 1.9.0부터 [inline value 클래스](inline-classes)에서 본문이 있는 보조 생성자를 사용하는 것이
기본적으로 가능합니다.

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Kotlin 1.4.30부터 허용됨:
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // Kotlin 1.9.0부터 기본적으로 허용됨:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

이전에는 Kotlin은 inline 클래스에서 공용 기본 생성자만 허용했습니다. 결과적으로
기본 값을 캡슐화하거나 일부 제약된 값을 나타내는 inline 클래스를 만드는 것이 불가능했습니다.

Kotlin이 개발되면서 이러한 문제가 해결되었습니다. Kotlin 1.4.30은 `init` 블록에 대한 제한을 해제했고 Kotlin 1.8.20은
본문이 있는 보조 생성자의 미리보기를 제공했습니다. 이제 기본적으로 사용할 수 있습니다. [이 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes)에서 Kotlin inline 클래스의 개발에 대해 자세히 알아보세요.

## Kotlin/JVM

버전 1.9.0부터 컴파일러는 JVM 20에 해당하는 바이트코드 버전을 사용하여 클래스를 생성할 수 있습니다. 또한
`JvmDefault` 어노테이션 및 레거시 `-Xjvm-default` 모드의 사용 중단이 계속됩니다.

### JvmDefault 어노테이션 및 레거시 -Xjvm-default 모드의 사용 중단

Kotlin 1.5부터 `JvmDefault` 어노테이션의 사용은 최신 `-Xjvm-default`
모드인 `all` 및 `all-compatibility`로 대체되었습니다. Kotlin 1.4에서 `JvmDefaultWithoutCompatibility`가 도입되고
Kotlin 1.6에서 `JvmDefaultWithCompatibility`가 도입되면서 이러한 모드는 `DefaultImpls` 생성에 대한 포괄적인 제어를 제공하여
이전 Kotlin 코드와의 원활한 호환성을 보장합니다.

결과적으로 Kotlin 1.9.0에서 `JvmDefault` 어노테이션은 더 이상 의미가 없으며
사용 중단으로 표시되어 오류가 발생합니다. 결국 Kotlin에서 제거될 예정입니다.

## Kotlin/Native

다른 개선 사항 중에서도 이 릴리스는 [Kotlin/Native 메모리 관리자](native-memory-manager)에 대한 추가적인 발전을 제공하여
견고성과 성능을 향상시켜야 합니다.

* [사용자 지정 메모리 할당자 미리보기](#preview-of-custom-memory-allocator)
* [메인 스레드의 Objective-C 또는 Swift 객체 할당 해제 후크](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [Kotlin/Native에서 상수 값에 액세스할 때 객체 초기화 안 함](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [iOS 시뮬레이터 테스트에 대한 독립 실행형 모드를 구성하는 기능](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native의 라이브러리 연결](#library-linkage-in-kotlin-native)

### 사용자 지정 메모리 할당자 미리보기

Kotlin 1.9.0은 사용자 지정 메모리 할당자의 미리보기를 도입합니다. 이 할당 시스템은 [Kotlin/Native 메모리 관리자](native-memory-manager)의 런타임 성능을 향상시킵니다.

Kotlin/Native의 현재 객체 할당 시스템은 효율적인 가비지 컬렉션을 위한 기능이 없는 범용 할당자를 사용합니다. 이를 보완하기 위해 가비지 컬렉터(GC)가 단일 목록으로 병합하기 전에 모든 할당된 객체의 스레드 로컬 연결 목록을 유지 관리합니다. 이 목록은 스위핑 중에 반복될 수 있습니다. 이 접근 방식에는 다음과 같은 여러 가지 성능상의 단점이 있습니다.

* 스위핑 순서에는 메모리 로컬성이 부족하고 메모리 액세스 패턴이 분산되어 잠재적인 성능 문제가 발생합니다.
* 연결 목록은 각 객체에 대해 추가 메모리가 필요하여 메모리 사용량이 증가합니다. 특히 많은 작은 객체를 처리할 때 그렇습니다.
* 할당된 객체의 단일 목록은 스위핑을 병렬화하기 어렵게 만들어 뮤테이터 스레드가 GC 스레드보다 빠르게 객체를 할당할 때 메모리 사용량 문제가 발생할 수 있습니다.

이러한 문제를 해결하기 위해 Kotlin 1.9.0은 사용자 지정 할당자의 미리보기를 도입합니다. 시스템 메모리를 페이지로 나누어 연속적인 순서로 독립적인 스위핑을 허용합니다. 각 할당은 페이지 내의 메모리 블록이 되고 페이지는 블록 크기를 추적합니다. 다양한 페이지 유형은 다양한 할당 크기에 최적화되어 있습니다. 메모리 블록의 연속적인 배열은 할당된 모든 블록을 효율적으로 반복할 수 있도록 합니다.

스레드가 메모리를 할당할 때 할당 크기에 따라 적합한 페이지를 검색합니다. 스레드는 다양한 크기 범주에 대한 페이지 세트를 유지 관리합니다. 일반적으로 지정된 크기에 대한 현재 페이지는 할당을 수용할 수 있습니다. 그렇지 않은 경우 스레드는 공유 할당 공간에서 다른 페이지를 요청합니다. 이 페이지는 이미 사용 가능하거나 스위핑이 필요하거나 먼저 생성해야 합니다.

새로운 할당자를 사용하면 여러 개의 독립적인 할당 공간을 동시에 가질 수 있으므로 Kotlin 팀은 성능을 더욱 향상시키기 위해 다양한 페이지 레이아웃을 실험할 수 있습니다.

새로운 할당자 설계에 대한 자세한 내용은 [이 README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)를 참조하세요.

#### 활성화 방법

`-Xallocator=custom` 컴파일러 옵션을 추가합니다.

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```

#### 피드백 남기기

사용자 지정 할당자를 개선하기 위해 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native)에 피드백을 보내주시면 감사하겠습니다.

### 메인 스레드의 Objective-C 또는 Swift 객체 할당 해제 후크

Kotlin 1.9.0부터 Objective-C 또는 Swift 객체 할당 해제 후크는 객체가 Kotlin으로 전달된 경우 메인 스레드에서 호출됩니다. 이전의 [Kotlin/Native 메모리 관리자](native-memory-manager)가 Objective-C 객체에 대한 참조를 처리하는 방식은 메모리 누수로 이어질 수 있습니다. 새로운 동작은 메모리 관리자의 견고성을 향상시킬 것이라고 생각합니다.

예를 들어, 인수로 전달되거나 함수에서 반환되거나 컬렉션에서 검색되는 등 Kotlin 코드에서 참조되는 Objective-C 객체를 생각해 보세요. 이 경우 Kotlin은 Objective-C 객체에 대한 참조를 보유하는 자체 객체를 만듭니다. Kotlin 객체가 할당 해제되면 Kotlin/Native 런타임은 해당 Objective-C 참조를 해제하는 `objc_release` 함수를 호출합니다.

이전에는 Kotlin/Native 메모리 관리자가 특수 GC 스레드에서 `objc_release`를 실행했습니다. 마지막 객체 참조인 경우 객체가 할당 해제됩니다. Objective-C 객체에 Objective-C의 `dealloc` 메서드 또는 Swift의 `deinit` 블록과 같은 사용자 지정 할당 해제 후크가 있고 이러한 후크가 특정 스레드에서 호출될 것으로 예상되는 경우 문제가 발생할 수 있습니다.

메인 스레드의 객체에 대한 후크는 일반적으로 해당 스레드에서 호출될 것으로 예상되므로 Kotlin/Native 런타임은 이제 메인 스레드에서도 `objc_release`를 호출합니다. 이는 Objective-C 객체가 메인 스레드에서 Kotlin으로 전달되어 Kotlin 피어 객체를 생성한 경우를 처리해야 합니다. 이는 메인 디스패치 큐가 처리된 경우에만 작동합니다. 일반 UI 애플리케이션의 경우 그렇습니다. 메인 큐가 아니거나 객체가 메인 스레드 이외의 스레드에서 Kotlin으로 전달된 경우 `objc_release`는 이전과 같이 특수 GC 스레드에서 호출됩니다.

#### 옵트아웃 방법

문제가 발생하는 경우 `gradle.properties` 파일에서 다음 옵션을 사용하여 이 동작을 비활성화할 수 있습니다.

```none
kotlin.native.binary.objcDisposeOnMain=false
```

[이슈 트래커](https://kotl.in/issue)에 이러한 사례를 보고하는 것을 주저하지 마세요.

### Kotlin/Native에서 상수 값에 액세스할 때 객체 초기화 안 함

Kotlin 1.9.0부터 Kotlin/Native 백엔드는 `const val` 필드에 액세스할 때 객체를 초기화하지 않습니다.

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // No initialization at first
    val x = MyObject    // Initialization occurs
    println(x.y)
}
```

이 동작은 이제 Java와 일관되고 이 경우 객체가 초기화되지 않는 Kotlin/JVM과 통합되었습니다. 또한 이 변경 덕분에 Kotlin/Native 프로젝트에서 약간의 성능 향상을 기대할 수 있습니다.

### Kotlin/Native에서 iOS 시뮬레이터 테스트에 대한 독립 실행형 모드를 구성하는 기능

기본적으로 Kotlin/Native에 대한 iOS 시뮬레이터 테스트를 실행할 때 `--standalone` 플래그는 수동 시뮬레이터
부팅 및 종료를 방지하는 데 사용됩니다. 1.9.0에서는 `standalone` 속성을 통해 Gradle 작업에서 이 플래그가 사용되는지 여부를 구성할 수 있습니다. 기본적으로 `--standalone` 플래그가 사용되므로 독립 실행형 모드가 활성화됩니다.

다음은 `build.gradle.kts` 파일에서 독립 실행형 모드를 비활성화하는 방법의 예입니다.

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```

독립 실행형 모드를 비활성화한 경우 시뮬레이터를 수동으로 부팅해야 합니다. CLI에서 시뮬레이터를 부팅하려면
다음 명령을 사용할 수 있습니다.

```shell
/usr/bin/xcrun simctl boot <DeviceId>
```

:::

### Kotlin/Native의 라이브러리 연결

Kotlin 1.9.0부터 Kotlin/Native 컴파일러는 Kotlin 라이브러리의 연결 문제를 Kotlin/JVM과 동일한 방식으로 처리합니다.
한 타사 Kotlin 라이브러리 작성자가 다른 타사 Kotlin 라이브러리가 사용하는 실험적
API에서 호환되지 않는 변경을 수행하는 경우 이러한 문제가 발생할 수 있습니다.

이제 타사 Kotlin 라이브러리 간의 연결 문제로 인해 컴파일 중에 빌드가 실패하지 않습니다. 대신 JVM에서와 마찬가지로 런타임에만 이러한 오류가 발생합니다.

Kotlin/Native 컴파일러는 라이브러리 연결에 문제가 감지될 때마다 경고를 보고합니다. 컴파일 로그에서 다음과 같은 경고를 찾을 수 있습니다.

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

프로젝트에서 이 동작을 추가로 구성하거나 비활성화할 수도 있습니다.

* 컴파일 로그에 이러한 경고가 표시되지 않도록 하려면 `-Xpartial-linkage-loglevel=INFO` 컴파일러 옵션을 사용하여 경고를 표시하지 않습니다.
* `-Xpartial-linkage-loglevel=ERROR`를 사용하여 보고된 경고의 심각도를 컴파일 오류로 높일 수도 있습니다. 이 경우 컴파일이 실패하고 컴파일 로그에서 모든 오류를 볼 수 있습니다. 이 옵션을 사용하여 연결 문제를 자세히 조사합니다.
* 이 기능에 예기치 않은 문제가 발생하는 경우 항상 `-Xpartial-linkage=disable` 컴파일러 옵션을 사용하여 옵트아웃할 수 있습니다. 이러한 사례를 [이슈
  트래커](https://kotl.in/issue)에 보고하는 것을 주저하지 마세요.

```kotlin
// Gradle 빌드 파일을 통해 컴파일러 옵션을 전달하는 예입니다.
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {

                // 연결 경고를 표시하지 않으려면:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // 연결 경고를 오류로 높이려면:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 기능을 완전히 비활성화하려면:
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```

### C interop 암시적 정수 변환을 위한 컴파일러 옵션

암시적 정수 변환을 사용할 수 있는 C interop에 대한 컴파일러 옵션을 도입했습니다. 신중한 고려 끝에 이 기능을 개선할 여지가 있고 API의 최고 품질을 목표로 하므로 의도하지 않은 사용을 방지하기 위해 이 컴파일러 옵션을 도입했습니다.

이 코드 샘플에서 암시적 정수 변환은 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)에 부호 없는 유형인 `UInt`가 있고 `0`이 부호가 있는 경우에도 `options = 0`을 허용합니다.

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```

네이티브 interop 라이브러리와 함께 암시적 변환을 사용하려면 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`
컴파일러 옵션을 사용하세요.

Gradle `build.gradle.kts` 파일에서 이를 구성할 수 있습니다.
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```

## Kotlin Multiplatform

Kotlin Multiplatform은 1.9.0에서 개발자 경험을 개선하기 위해 설계된 몇 가지 주목할 만한 업데이트를 받았습니다.

* [Android 타겟 지원 변경 사항](#changes-to-android-target-support)
* [새로운 Android 소스 세트 레이아웃이 기본적으로 활성화됨](#new-android-source-set-layout-enabled-by-default)
* [Multiplatform 프로젝트의 Gradle 구성 캐시 미리보기](#preview-of-the-gradle-configuration-cache)

### Android 타겟 지원 변경 사항

Kotlin Multiplatform을 안정화하기 위한 노력을 계속하고 있습니다. 필수적인 단계는 Android 타겟에 대한 최고 수준의
지원을 제공하는 것입니다. Google의 Android 팀이 Kotlin Multiplatform에서 Android를 지원하기 위해 자체 Gradle 플러그인을 제공할 예정이라고 발표하게 되어 기쁩니다.

Google의 이 새로운 솔루션을 위한 길을 열기 위해 1.9.0에서 현재 Kotlin DSL에서 `android` 블록의 이름을 바꿉니다.
빌드 스크립트에서 `android` 블록의 모든 항목을 `androidTarget`으로 변경하세요. 이는 Google에서 제공하는 향후 DSL을 위해 `android` 이름을 비워두는 데 필요한 임시 변경 사항입니다.

Google 플러그인은 Multiplatform 프로젝트에서 Android로 작업하는 데 선호되는 방법입니다. 준비가 되면 이전과 같이 짧은 `android` 이름을 사용할 수 있도록 필요한 마이그레이션 지침을 제공할 예정입니다.

### 새로운 Android 소스 세트 레이아웃이 기본적으로 활성화됨

Kotlin 1.9.0부터 새로운 Android 소스 세트 레이아웃이 기본값입니다. 여러 가지 방식으로 혼란스러운 이전 디렉터리 명명 스키마를 대체했습니다. 새로운 레이아웃에는 다음과 같은 여러 가지 장점이 있습니다.

* 단순화된 유형 의미 체계 - 새로운 Android 소스 레이아웃은 다양한 유형의 소스 세트를 구분하는 데 도움이 되는 명확하고 일관된 명명 규칙을 제공합니다.
* 개선된 소스 디렉터리 레이아웃 - 새로운 레이아웃을 사용하면 `SourceDirectories` 배치가 더욱 일관성이 높아져 코드를 구성하고 소스 파일을 더 쉽게 찾을 수 있습니다.
* Gradle 구성에 대한 명확한 명명 스키마 - 스키마는 이제 `KotlinSourceSets`와 `AndroidSourceSets` 모두에서 더욱 일관성 있고 예측 가능합니다.

새로운 레이아웃에는 Android Gradle 플러그인 버전 7.0 이상이 필요하며 Android Studio 2022.3 이상에서 지원됩니다.
[마이그레이션 가이드](multiplatform-android-layout)를 참조하여 `build.gradle(.kts)` 파일에서 필요한 변경 사항을 적용하세요.

### Gradle 구성 캐시 미리보기

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0은 Multiplatform 라이브러리에서 [Gradle 구성 캐시](https://docs.gradle.org/current/userguide/configuration_cache.html)
를 지원합니다. 라이브러리 작성자인 경우 이미 향상된 빌드 성능의 이점을 누릴 수 있습니다.

Gradle 구성 캐시는 후속 빌드에 대한 구성 단계의 결과를 재사용하여 빌드 프로세스 속도를 높입니다. 이 기능은 Gradle 8.1 이후로 안정화되었습니다. 활성화하려면 [Gradle 설명서](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)의 지침을 따르세요.

Kotlin Multiplatform 플러그인은 여전히 Xcode 통합 작업 또는
[Kotlin CocoaPods Gradle 플러그인](native-cocoapods-dsl-reference)과 함께 Gradle 구성 캐시를 지원하지 않습니다. 향후 Kotlin 릴리스에서 이 기능을 추가할 예정입니다.

:::

## Kotlin/Wasm

Kotlin 팀은 새로운 Kotlin/Wasm 타겟을 계속 실험하고 있습니다. 이 릴리스는 몇 가지 성능 및
[크기 관련 최적화](#size-related-optimizations)와 함께 [JavaScript interop의 업데이트](#updates-in-javascript-interop)를 제공합니다.

### 크기 관련 최적화

Kotlin 1.9.0은 WebAssembly(Wasm) 프로젝트에 대한 상당한 크기 개선을 도입합니다. 두 개의 "Hello World" 프로젝트를 비교하면
Kotlin 1.9.0의 Wasm에 대한 코드 공간은 이제 Kotlin 1.8.20보다 10배 이상 작습니다.

<img src="/img/wasm-1-9-0-size-improvements.png" alt="Kotlin/Wasm 크기 관련 최적화" width="700" style={{verticalAlign: 'middle'}}/>

이러한 크기 최적화는 Kotlin 코드로 Wasm 플랫폼을 타겟팅할 때 더 효율적인 리소스 활용률과 향상된 성능을 제공합니다.

### JavaScript interop의 업데이트

이 Kotlin 업데이트는 Kotlin/Wasm에 대한 Kotlin과 JavaScript 간의 상호 운용성에 대한 변경 사항을 도입합니다. Kotlin/Wasm은 [실험적](components-stability#stability-levels-explained)
기능이므로 특정 제한 사항이 해당 상호 운용성에 적용됩니다.

#### 동적 유형 제한

버전 1.9.0부터 Kotlin은 Kotlin/Wasm에서 `Dynamic` 유형의 사용을 더 이상 지원하지 않습니다. 이제 사용이 중단되었으며 JavaScript 상호 운용성을 용이하게 하는 새로운 범용 `JsAny` 유형이 대신 사용됩니다.

자세한 내용은 [JavaScript와의 Kotlin/Wasm 상호 운용성](wasm-js-interop) 설명서를 참조하세요.

#### 비 외부 유형 제한

Kotlin/Wasm은 JavaScript로 값을 전달하거나 JavaScript에서 값을 전달할 때 특정 Kotlin 정적 유형에 대한 변환을 지원합니다. 이러한 지원되는
유형은 다음과 같습니다.

* 부호 있는 숫자, `Boolean` 및 `Char`와 같은 기본 유형.
* `String`.
* 함수 유형.

다른 유형은 불투명 참조로 변환 없이 전달되어 JavaScript와 Kotlin 간의 하위 유형 간에 불일치가 발생했습니다.

이를 해결하기 위해 Kotlin은 JavaScript interop을 잘 지원되는 유형 세트로 제한합니다. Kotlin 1.9.0부터 외부,
기본, 문자열 및 함수 유형만 Kotlin/Wasm JavaScript interop에서 지원됩니다. 또한 JavaScript interop에서 사용할 수 있는 Kotlin/Wasm 객체에 대한 핸들을 나타내기 위해 `JsReference`라는 별도의 명시적 유형이 도입되었습니다.

자세한 내용은 [JavaScript와의 Kotlin/Wasm 상호 운용성](wasm-js-interop) 설명서를 참조하세요.

### Kotlin Playground의 Kotlin/Wasm

Kotlin Playground는 Kotlin/Wasm 타겟을 지원합니다.
Kotlin/Wasm을 타겟팅하는 Kotlin 코드를 작성, 실행 및 공유할 수 있습니다. [확인해 보세요!](https://pl.kotl.in/HDFAvimga)

:::note
Kotlin/Wasm을 사용하려면 브라우저에서 실험적 기능을 활성화해야 합니다.

[이러한 기능을 활성화하는 방법에 대해 자세히 알아보세요](wasm-troubleshooting).

:::

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 `->` n + 1
    n == 0 `->` ack(m - 1, 1)
    else `->` ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```

## Kotlin/JS

이 릴리스는 이전 Kotlin/JS 컴파일러 제거, Kotlin/JS Gradle 플러그인 사용 중단 및 ES2015에 대한 실험적
지원 등 Kotlin/JS에 대한 업데이트를 도입합니다.

* [이전 Kotlin/JS 컴파일러 제거](#removal-of-the-old-kotlin-js-compiler)
* [Kotlin/JS Gradle 플러그인 사용 중단](#deprecation-of-the-kotlin-js-gradle-plugin)
* [외부 enum 사용 중단](#deprecation-of-external-enum)
* [ES2015 클래스 및 모듈에 대한 실험적 지원](#experimental-support-for-es2015-classes-and-modules)
* [JS 프로덕션 배포의 기본 대상 변경](#changed-default-destination-of-js-production-distribution)
* [stdlib-js에서 org.w3c 선언 추출](#extract-org-w3c-declarations-from-stdlib-js)

:::note
버전 1.9.0부터 [부분 라이브러리 연결](#library-linkage-in-kotlin-native)도 Kotlin/JS에 대해 활성화됩니다.

:::

### 이전 Kotlin/JS 컴파일러 제거

Kotlin 1.8.0에서는 IR 기반 백엔드가 [안정적](components-stability)이 되었다고 [발표](whatsnew18#stable-js-ir-compiler-backend)했습니다.
그 이후로 컴파일러를 지정하지 않으면 오류가 발생하고 이전 컴파일러를 사용하면 경고가 표시됩니다.

Kotlin 1.9.0에서는 이전 백엔드를 사용하면 오류가 발생합니다. [마이그레이션 가이드](js-ir-migration)에 따라