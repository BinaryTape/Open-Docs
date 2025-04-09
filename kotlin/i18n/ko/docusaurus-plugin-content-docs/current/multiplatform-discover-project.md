---
title: "Kotlin Multiplatform 프로젝트 구조의 기초"
---
Kotlin Multiplatform을 사용하면 여러 플랫폼 간에 코드를 공유할 수 있습니다. 이 문서에서는 공유 코드의 제약 조건, 코드의 공유 부분과 플랫폼별 부분을 구별하는 방법, 이 공유 코드가 작동하는 플랫폼을 지정하는 방법을 설명합니다.

또한 공통 코드, 타겟, 플랫폼별 및 중간 소스 세트, 테스트 통합과 같은 Kotlin Multiplatform 프로젝트 설정의 핵심 개념에 대해서도 알아봅니다. 이는 향후 멀티플랫폼 프로젝트를 설정하는 데 도움이 될 것입니다.

여기에 제시된 모델은 Kotlin에서 사용하는 모델보다 단순화되었습니다. 그러나 이 기본 모델은 대부분의 경우에 적합해야 합니다.

## 공통 코드

_공통 코드(Common code)_는 여러 플랫폼 간에 공유되는 Kotlin 코드입니다.

간단한 "Hello, World" 예제를 생각해 보세요.

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

플랫폼 간에 공유되는 Kotlin 코드는 일반적으로 `commonMain` 디렉터리에 있습니다. 코드 파일의 위치는 이 코드가 컴파일되는 플랫폼 목록에 영향을 미치므로 중요합니다.

Kotlin 컴파일러는 소스 코드를 입력으로 받아 플랫폼별 바이너리 세트를 결과로 생성합니다. 멀티플랫폼 프로젝트를 컴파일할 때 동일한 코드에서 여러 바이너리를 생성할 수 있습니다. 예를 들어 컴파일러는 동일한 Kotlin 파일에서 JVM `.class` 파일과 네이티브 실행 파일을 생성할 수 있습니다.

<img src="/img/common-code-diagram.svg" alt="Common code" width="700" style={{verticalAlign: 'middle'}}/>

모든 Kotlin 코드가 모든 플랫폼으로 컴파일될 수 있는 것은 아닙니다. Kotlin 컴파일러는 공통 코드에서 플랫폼별 함수나 클래스를 사용하는 것을 방지합니다. 이 코드는 다른 플랫폼으로 컴파일할 수 없기 때문입니다.

예를 들어 공통 코드에서 `java.io.File` 종속성을 사용할 수 없습니다. 이는 JDK의 일부이지만 공통 코드는 JDK 클래스를 사용할 수 없는 네이티브 코드로도 컴파일됩니다.

<img src="/img/unresolved-java-reference.png" alt="Unresolved Java reference" width="500" style={{verticalAlign: 'middle'}}/>

공통 코드에서는 Kotlin Multiplatform 라이브러리를 사용할 수 있습니다. 이러한 라이브러리는 여러 플랫폼에서 다르게 구현될 수 있는 공통 API를 제공합니다. 이 경우 플랫폼별 API는 추가 부분으로 사용되며 공통 코드에서 이러한 API를 사용하려고 하면 오류가 발생합니다.

예를 들어 `kotlinx.coroutines`는 모든 타겟을 지원하는 Kotlin Multiplatform 라이브러리이지만 `kotlinx.coroutines` 동시성 기본 요소를 `fun CoroutinesDispatcher.asExecutor(): Executor`와 같은 JDK 동시성 기본 요소로 변환하는 플랫폼별 부분도 있습니다. API의 이 추가 부분은 `commonMain`에서 사용할 수 없습니다.

## 타겟

타겟(Targets)은 Kotlin이 공통 코드를 컴파일하는 플랫폼을 정의합니다. 예를 들어 JVM, JS, Android, iOS 또는 Linux가 될 수 있습니다. 이전 예제에서는 공통 코드를 JVM 및 네이티브 타겟으로 컴파일했습니다.

_Kotlin 타겟(Kotlin target)_은 컴파일 타겟을 설명하는 식별자입니다. 생성된 바이너리의 형식, 사용 가능한 언어 구조 및 허용되는 종속성을 정의합니다.

:::tip
타겟을 플랫폼이라고도 할 수 있습니다. 지원되는 타겟의 전체 [목록](multiplatform-dsl-reference#targets)을 참조하세요.

먼저 특정 타겟에 대해 코드를 컴파일하도록 Kotlin에 지시하려면 타겟을 _선언(declare)_해야 합니다. Gradle에서는 `kotlin {}` 블록 내에서 미리 정의된 DSL 호출을 사용하여 타겟을 선언합니다.

```kotlin
kotlin {
    jvm() // JVM 타겟 선언
    iosArm64() // 64비트 iPhone에 해당하는 타겟 선언
}
```

이러한 방식으로 각 멀티플랫폼 프로젝트는 지원되는 타겟 세트를 정의합니다. 빌드 스크립트에서 타겟을 선언하는 방법에 대한 자세한 내용은 [계층적 프로젝트 구조](multiplatform-hierarchy) 섹션을 참조하세요.

`jvm` 및 `iosArm64` 타겟이 선언되면 `commonMain`의 공통 코드는 이러한 타겟으로 컴파일됩니다.

<img src="/img/target-diagram.svg" alt="Targets" width="700" style={{verticalAlign: 'middle'}}/>

특정 타겟으로 컴파일될 코드를 이해하려면 타겟을 Kotlin 소스 파일에 연결된 레이블로 생각할 수 있습니다. Kotlin은 이러한 레이블을 사용하여 코드를 컴파일하는 방법, 생성할 바이너리 및 해당 코드에서 허용되는 언어 구조와 종속성을 결정합니다.

`greeting.kt` 파일을 `.js`로도 컴파일하려면 JS 타겟만 선언하면 됩니다. 그러면 `commonMain`의 코드는 JS 타겟에 해당하는 추가 `js` 레이블을 수신하여 Kotlin에 `.js` 파일을 생성하도록 지시합니다.

<img src="/img/target-labels-diagram.svg" alt="Target labels" width="700" style={{verticalAlign: 'middle'}}/>

이것이 Kotlin 컴파일러가 선언된 모든 타겟으로 컴파일된 공통 코드와 함께 작동하는 방식입니다. 플랫폼별 코드를 작성하는 방법은 [소스 세트](#source-sets)를 참조하세요.

## 소스 세트

_Kotlin 소스 세트(Kotlin source set)_는 자체 타겟, 종속성 및 컴파일러 옵션이 있는 소스 파일 세트입니다. 이는 멀티플랫폼 프로젝트에서 코드를 공유하는 주요 방법입니다.

멀티플랫폼 프로젝트의 각 소스 세트:

* 지정된 프로젝트에 대해 고유한 이름을 가집니다.
* 일반적으로 소스 세트의 이름이 있는 디렉터리에 저장되는 소스 파일 및 리소스 세트를 포함합니다.
* 이 소스 세트의 코드가 컴파일되는 타겟 세트를 지정합니다. 이러한 타겟은 이 소스 세트에서 사용할 수 있는 언어 구조 및 종속성에 영향을 미칩니다.
* 자체 종속성 및 컴파일러 옵션을 정의합니다.

Kotlin은 미리 정의된 소스 세트를 제공합니다. 그중 하나는 모든 멀티플랫폼 프로젝트에 존재하고 선언된 모든 타겟으로 컴파일되는 `commonMain`입니다.

Kotlin Multiplatform 프로젝트의 `src` 내부에서 디렉터리로 소스 세트와 상호 작용합니다. 예를 들어 `commonMain`, `iosMain` 및 `jvmMain` 소스 세트가 있는 프로젝트는 다음과 같은 구조를 가집니다.

<img src="/img/src-directory-diagram.png" alt="Shared sources" width="350" style={{verticalAlign: 'middle'}}/>

Gradle 스크립트에서는 `kotlin.sourceSets {}` 블록 내에서 이름으로 소스 세트에 액세스합니다.

```kotlin
kotlin {
    // 타겟 선언:
    // …

    // 소스 세트 선언:
    sourceSets {
        commonMain {
            // commonMain 소스 세트 구성
        }
    }
}
```

`commonMain` 외에 다른 소스 세트는 플랫폼별이거나 중간일 수 있습니다.

### 플랫폼별 소스 세트

공통 코드만 있는 것이 편리하지만 항상 가능한 것은 아닙니다. `commonMain`의 코드는 선언된 모든 타겟으로 컴파일되며 Kotlin은 해당 코드에서 플랫폼별 API를 사용하는 것을 허용하지 않습니다.

네이티브 및 JS 타겟이 있는 멀티플랫폼 프로젝트에서 `commonMain`의 다음 코드는 컴파일되지 않습니다.

```kotlin
// commonMain/kotlin/common.kt
// 공통 코드에서 컴파일되지 않음
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

이에 대한 해결책으로 Kotlin은 플랫폼별 소스 세트(플랫폼 소스 세트라고도 함)를 만듭니다. 각 타겟에는 해당 타겟에 대해서만 컴파일되는 해당 플랫폼 소스 세트가 있습니다. 예를 들어 `jvm` 타겟에는 JVM으로만 컴파일되는 해당 `jvmMain` 소스 세트가 있습니다. Kotlin은 이러한 소스 세트에서 플랫폼별 종속성(예: `jvmMain`의 JDK)을 사용할 수 있습니다.

```kotlin
// jvmMain/kotlin/jvm.kt
// `jvmMain` 소스 세트에서 Java 종속성을 사용할 수 있습니다.
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 특정 타겟으로 컴파일

특정 타겟으로 컴파일하려면 여러 소스 세트를 사용해야 합니다. Kotlin이 멀티플랫폼 프로젝트를 특정 타겟으로 컴파일할 때 이 타겟으로 레이블이 지정된 모든 소스 세트를 수집하고 해당 소스 세트에서 바이너리를 생성합니다.

`jvm`, `iosArm64` 및 `js` 타겟이 있는 예제를 생각해 보세요. Kotlin은 공통 코드에 대해 `commonMain` 소스 세트를 만들고 특정 타겟에 대해 해당 `jvmMain`, `iosArm64Main` 및 `jsMain` 소스 세트를 만듭니다.

<img src="/img/specific-target-diagram.svg" alt="Compilation to a specific target" width="700" style={{verticalAlign: 'middle'}}/>

JVM으로 컴파일하는 동안 Kotlin은 "JVM"으로 레이블이 지정된 모든 소스 세트(즉, `jvmMain` 및 `commonMain`)를 선택합니다. 그런 다음 이를 함께 컴파일하여 JVM 클래스 파일을 만듭니다.

<img src="/img/compilation-jvm-diagram.svg" alt="Compilation to JVM" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin은 `commonMain` 및 `jvmMain`을 함께 컴파일하므로 결과 바이너리에는 `commonMain` 및 `jvmMain` 모두의 선언이 포함됩니다.

멀티플랫폼 프로젝트로 작업할 때는 다음 사항을 기억하세요.

* Kotlin이 코드를 특정 플랫폼으로 컴파일하도록 하려면 해당 타겟을 선언하세요.
* 코드를 저장할 디렉터리 또는 소스 파일을 선택하려면 먼저 코드를 공유할 타겟을 결정하세요.

    * 코드가 모든 타겟 간에 공유되는 경우 `commonMain`에 선언해야 합니다.
    * 코드가 하나의 타겟에만 사용되는 경우 해당 타겟에 대한 플랫폼별 소스 세트(예: JVM의 경우 `jvmMain`)에 정의해야 합니다.
* 플랫폼별 소스 세트에 작성된 코드는 공통 소스 세트의 선언에 액세스할 수 있습니다. 예를 들어 `jvmMain`의 코드는 `commonMain`의 코드를 사용할 수 있습니다. 그러나 그 반대는 사실이 아닙니다. `commonMain`은 `jvmMain`의 코드를 사용할 수 없습니다.
* 플랫폼별 소스 세트에 작성된 코드는 해당 플랫폼 종속성을 사용할 수 있습니다. 예를 들어 `jvmMain`의 코드는 [Guava](https://github.com/google/guava) 또는 [Spring](https://spring.io/)과 같은 Java 전용 라이브러리를 사용할 수 있습니다.

### 중간 소스 세트

단순한 멀티플랫폼 프로젝트에는 일반적으로 공통 코드와 플랫폼별 코드만 있습니다. `commonMain` 소스 세트는 선언된 모든 타겟 간에 공유되는 공통 코드를 나타냅니다. `jvmMain`과 같은 플랫폼별 소스 세트는 해당 타겟으로만 컴파일되는 플랫폼별 코드를 나타냅니다.

실제로는 더 세분화된 코드 공유가 필요한 경우가 많습니다.

모든 최신 Apple 장치와 Android 장치를 타겟팅해야 하는 예제를 생각해 보세요.

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64비트 iPhone 장치
    macosArm64() // 최신 Apple Silicon 기반 Mac
    watchosX64() // 최신 64비트 Apple Watch 장치
    tvosArm64()  // 최신 Apple TV 장치
}
```

그리고 모든 Apple 장치에 대한 UUID를 생성하는 함수를 추가할 소스 세트가 필요합니다.

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // Apple별 API에 액세스하고 싶습니다.
    return NSUUID().UUIDString()
}
```

이 함수를 `commonMain`에 추가할 수 없습니다. `commonMain`은 Android를 포함하여 선언된 모든 타겟으로 컴파일되지만 `platform.Foundation.NSUUID`는 Android에서 사용할 수 없는 Apple별 API입니다. `commonMain`에서 `NSUUID`를 참조하려고 하면 Kotlin에서 오류가 표시됩니다.

이 코드를 각 Apple별 소스 세트(`iosArm64Main`, `macosArm64Main`, `watchosX64Main` 및 `tvosArm64Main`)에 복사하여 붙여넣을 수 있습니다. 하지만 이와 같이 코드를 복제하면 오류가 발생하기 쉬우므로 권장하지 않습니다.

이 문제를 해결하기 위해 _중간 소스 세트(intermediate source sets)_를 사용할 수 있습니다. 중간 소스 세트는 프로젝트의 일부 타겟으로 컴파일되는 Kotlin 소스 세트입니다. 중간 소스 세트를 계층적 소스 세트 또는 단순히 계층 구조라고도 합니다.

Kotlin은 기본적으로 일부 중간 소스 세트를 만듭니다. 이 특정 경우에는 결과 프로젝트 구조가 다음과 같습니다.

<img src="/img/intermediate-source-sets-diagram.svg" alt="Intermediate source sets" width="700" style={{verticalAlign: 'middle'}}/>

여기서 하단의 다색 블록은 플랫폼별 소스 세트입니다. 명확성을 위해 타겟 레이블은 생략되었습니다.

`appleMain` 블록은 Apple별 타겟으로 컴파일된 코드를 공유하기 위해 Kotlin에서 만든 중간 소스 세트입니다. `appleMain` 소스 세트는 Apple 타겟으로만 컴파일됩니다. 따라서 Kotlin은 `appleMain`에서 Apple별 API를 사용할 수 있도록 허용하며 여기에 `randomUUID()` 함수를 추가할 수 있습니다.

[계층적 프로젝트 구조](multiplatform-hierarchy)에서 Kotlin이 기본적으로 만들고 설정하는 모든 중간 소스 세트를 찾고 Kotlin이 기본적으로 필요한 중간 소스 세트를 제공하지 않는 경우 수행해야 할 작업을 알아보세요.

:::

특정 타겟으로 컴파일하는 동안 Kotlin은 이 타겟으로 레이블이 지정된 중간 소스 세트를 포함한 모든 소스 세트를 가져옵니다. 따라서 `commonMain`, `appleMain` 및 `iosArm64Main` 소스 세트에 작성된 모든 코드는 `iosArm64` 플랫폼 타겟으로 컴파일하는 동안 결합됩니다.

<img src="/img/native-executables-diagram.svg" alt="Native executables" width="700" style={{verticalAlign: 'middle'}}/>
:::tip
일부 소스 세트에 소스가 없어도 괜찮습니다. 예를 들어 iOS 개발에서는 iOS 장치에만 해당하고 iOS 시뮬레이터에는 해당하지 않는 코드를 제공할 필요가 없습니다. 따라서 `iosArm64Main`은 거의 사용되지 않습니다.

:::

#### Apple 장치 및 시뮬레이터 타겟

Kotlin Multiplatform을 사용하여 iOS 모바일 애플리케이션을 개발할 때 일반적으로 `iosMain` 소스 세트로 작업합니다. `ios` 타겟에 대한 플랫폼별 소스 세트라고 생각할 수 있지만 단일 `ios` 타겟은 없습니다. 대부분의 모바일 프로젝트에는 최소한 두 개의 타겟이 필요합니다.

* **장치 타겟**은 iOS 장치에서 실행할 수 있는 바이너리를 생성하는 데 사용됩니다. 현재 iOS에는 `iosArm64`라는 장치 타겟이 하나만 있습니다.
* **시뮬레이터 타겟**은 컴퓨터에서 실행되는 iOS 시뮬레이터용 바이너리를 생성하는 데 사용됩니다. Apple 실리콘 Mac 컴퓨터가 있는 경우 `iosSimulatorArm64`를 시뮬레이터 타겟으로 선택합니다. Intel 기반 Mac 컴퓨터가 있는 경우 `iosX64`를 사용합니다.

`iosArm64` 장치 타겟만 선언하면 로컬 컴퓨터에서 애플리케이션 및 테스트를 실행하고 디버그할 수 없습니다.

iOS 장치 및 시뮬레이터용 Kotlin 코드는 일반적으로 동일하므로 `iosArm64Main`, `iosSimulatorArm64Main` 및 `iosX64Main`과 같은 플랫폼별 소스 세트는 일반적으로 비어 있습니다. 이러한 모든 소스 세트 간에 코드를 공유하려면 `iosMain` 중간 소스 세트만 사용할 수 있습니다.

다른 비 Mac Apple 타겟에도 동일하게 적용됩니다. 예를 들어 Apple TV에 대한 `tvosArm64` 장치 타겟과 Apple 실리콘 및 Intel 기반 장치에 대한 Apple TV 시뮬레이터용 `tvosSimulatorArm64` 및 `tvosX64` 시뮬레이터 타겟이 있는 경우 이러한 모든 타겟에 대해 `tvosMain` 중간 소스 세트를 사용할 수 있습니다.

## 테스트와의 통합

실제 프로젝트에서는 기본 프로덕션 코드와 함께 테스트도 필요합니다. 이것이 기본적으로 생성된 모든 소스 세트에 `Main` 및 `Test` 접미사가 있는 이유입니다. `Main`에는 프로덕션 코드가 포함되어 있고 `Test`에는 이 코드에 대한 테스트가 포함되어 있습니다. 이들 간의 연결은 자동으로 설정되며 테스트는 추가 구성 없이 `Main` 코드에서 제공하는 API를 사용할 수 있습니다.

`Test` 대응 요소도 `Main`과 유사한 소스 세트입니다. 예를 들어 `commonTest`는 `commonMain`에 대한 대응 요소이며 선언된 모든 타겟으로 컴파일되어 공통 테스트를 작성할 수 있습니다. `jvmTest`와 같은 플랫폼별 테스트 소스 세트는 플랫폼별 테스트(예: JVM별 테스트 또는 JVM API가 필요한 테스트)를 작성하는 데 사용됩니다.

공통 테스트를 작성할 소스 세트를 갖는 것 외에도 멀티플랫폼 테스트 프레임워크도 필요합니다. Kotlin은 기본 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리를 제공합니다. 이 라이브러리에는 `@kotlin.Test` 어노테이션과 `assertEquals` 및 `assertTrue`와 같은 다양한 어설션 메서드가 함께 제공됩니다.

각 플랫폼에 대한 일반 테스트와 마찬가지로 해당 소스 세트에서 플랫폼별 테스트를 작성할 수 있습니다. 기본 코드와 마찬가지로 각 소스 세트에 대해 플랫폼별 종속성(예: JVM의 경우 `JUnit`, iOS의 경우 `XCTest`)을 가질 수 있습니다. 특정 타겟에 대한 테스트를 실행하려면 `<targetName>Test` 작업을 사용합니다.

[멀티플랫폼 앱 테스트 튜토리얼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)에서 멀티플랫폼 테스트를 만들고 실행하는 방법을 알아보세요.

## 다음 단계

* [Gradle 스크립트에서 미리 정의된 소스 세트를 선언하고 사용하는 방법에 대해 자세히 알아보세요.](multiplatform-hierarchy)
* [멀티플랫폼 프로젝트 구조의 고급 개념을 살펴보세요.](multiplatform-advanced-project-structure)
* [타겟 컴파일 및 사용자 지정 컴파일 생성에 대해 자세히 알아보세요.](multiplatform-configure-compilations)