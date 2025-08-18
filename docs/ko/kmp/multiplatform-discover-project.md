[//]: # (title: Kotlin 멀티플랫폼 프로젝트 구조의 기본)

Kotlin Multiplatform를 사용하면 여러 플랫폼 간에 코드를 공유할 수 있습니다. 이 글에서는 공유 코드의 제약 사항, 공유 코드와 플랫폼별 코드 부분을 구별하는 방법, 그리고 이 공유 코드가 작동하는 플랫폼을 지정하는 방법을 설명합니다.

또한, 공통 코드(common code), 타겟(targets), 플랫폼별 및 중간 소스 세트(platform-specific and intermediate source sets), 테스트 통합(test integration)과 같은 Kotlin Multiplatform 프로젝트 설정의 핵심 개념을 학습하게 됩니다. 이는 향후 멀티플랫폼 프로젝트를 설정하는 데 도움이 될 것입니다.

여기서 제시하는 모델은 Kotlin에서 사용되는 모델에 비해 단순화되었습니다. 하지만 이 기본적인 모델은 대부분의 경우에 적합할 것입니다.

## 공통 코드

_공통 코드(Common code)_ 는 여러 플랫폼 간에 공유되는 Kotlin 코드입니다.

간단한 "Hello, World" 예시를 살펴보겠습니다.

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

플랫폼 간에 공유되는 Kotlin 코드는 일반적으로 `commonMain` 디렉터리에 위치합니다. 코드 파일의 위치는 이 코드가 컴파일되는 플랫폼 목록에 영향을 미치므로 중요합니다.

Kotlin 컴파일러(Kotlin compiler)는 소스 코드를 입력으로 받아 플랫폼별 바이너리(platform-specific binaries) 세트를 결과물로 생성합니다. 멀티플랫폼 프로젝트를 컴파일할 때, 동일한 코드에서 여러 바이너리를 생성할 수 있습니다. 예를 들어, 컴파일러는 동일한 Kotlin 파일에서 JVM `.class` 파일과 네이티브 실행 파일(native executable files)을 생성할 수 있습니다.

![Common code](common-code-diagram.svg){width=700}

모든 Kotlin 코드가 모든 플랫폼으로 컴파일될 수 있는 것은 아닙니다. Kotlin 컴파일러는 공통 코드에서 플랫폼별 함수나 클래스를 사용하는 것을 방지합니다. 왜냐하면 이 코드는 다른 플랫폼으로 컴파일될 수 없기 때문입니다.

예를 들어, 공통 코드에서 `java.io.File` 종속성(dependency)을 사용할 수 없습니다. 이것은 JDK의 일부이지만, 공통 코드는 네이티브 코드(native code)로도 컴파일되며, 네이티브 코드에서는 JDK 클래스를 사용할 수 없기 때문입니다.

![Unresolved Java reference](unresolved-java-reference.png){width=500}

공통 코드에서는 Kotlin Multiplatform 라이브러리를 사용할 수 있습니다. 이러한 라이브러리는 여러 플랫폼에서 다르게 구현될 수 있는 공통 API를 제공합니다. 이 경우, 플랫폼별 API는 추가적인 부분으로 작용하며, 공통 코드에서 이러한 API를 사용하려고 하면 오류가 발생합니다.

예를 들어, `kotlinx.coroutines`는 모든 타겟을 지원하는 Kotlin Multiplatform 라이브러리이지만, `fun CoroutinesDispatcher.asExecutor(): Executor`와 같이 `kotlinx.coroutines`의 동시성 프리미티브(concurrent primitives)를 JDK 동시성 프리미티브로 변환하는 플랫폼별 부분도 가지고 있습니다. 이 추가 API 부분은 `commonMain`에서 사용할 수 없습니다.

## 타겟

타겟(Targets)은 Kotlin이 공통 코드를 컴파일하는 플랫폼을 정의합니다. 예를 들어, JVM, JS, Android, iOS 또는 Linux가 될 수 있습니다. 이전 예시는 공통 코드를 JVM 및 네이티브 타겟으로 컴파일했습니다.

_Kotlin 타겟(Kotlin target)_ 은 컴파일 타겟을 설명하는 식별자(identifier)입니다. 이는 생성된 바이너리의 형식, 사용 가능한 언어 구성(language constructions) 및 허용되는 종속성을 정의합니다.

> 타겟은 플랫폼(platforms)으로도 지칭될 수 있습니다. 지원되는 타겟의 전체 목록은 [여기](multiplatform-dsl-reference.md#targets)에서 확인할 수 있습니다.
>
> {style="note"}

Kotlin이 특정 타겟에 대한 코드를 컴파일하도록 지시하려면 먼저 타겟을 _선언_해야 합니다. Gradle에서는 `kotlin {}` 블록 내에서 사전 정의된 DSL 호출을 사용하여 타겟을 선언합니다.

```kotlin
kotlin {
    jvm() // Declares a JVM target
    iosArm64() // Declares a target that corresponds to 64-bit iPhones
}
```

이러한 방식으로 각 멀티플랫폼 프로젝트는 지원되는 타겟 세트를 정의합니다. 빌드 스크립트에서 타겟을 선언하는 방법에 대한 자세한 내용은 [계층적 프로젝트 구조(Hierarchical project structure)](multiplatform-hierarchy.md) 섹션을 참조하세요.

`jvm` 및 `iosArm64` 타겟이 선언되면, `commonMain`의 공통 코드는 이 타겟들로 컴파일됩니다.

![Targets](target-diagram.svg){width=700}

특정 타겟으로 어떤 코드가 컴파일될지 이해하려면, 타겟을 Kotlin 소스 파일에 첨부된 레이블로 생각할 수 있습니다. Kotlin은 이 레이블을 사용하여 코드를 컴파일하는 방법, 생성할 바이너리, 그리고 해당 코드에서 허용되는 언어 구성 및 종속성을 결정합니다.

`greeting.kt` 파일을 `.js`로도 컴파일하려면 JS 타겟을 선언하기만 하면 됩니다. 그러면 `commonMain`의 코드는 JS 타겟에 해당하는 추가 `js` 레이블을 받아, Kotlin이 `.js` 파일을 생성하도록 지시합니다.

![Target labels](target-labels-diagram.svg){width=700}

이것이 Kotlin 컴파일러가 선언된 모든 타겟으로 컴파일된 공통 코드와 작동하는 방식입니다. 플랫폼별 코드를 작성하는 방법을 배우려면 [소스 세트](#source-sets)를 참조하세요.

## 소스 세트

_Kotlin 소스 세트(Kotlin source set)_ 는 자체 타겟, 종속성 및 컴파일러 옵션을 가진 소스 파일의 집합입니다. 이는 멀티플랫폼 프로젝트에서 코드를 공유하는 주요 방법입니다.

멀티플랫폼 프로젝트의 각 소스 세트는 다음을 가집니다.

*   주어진 프로젝트에서 고유한 이름을 가집니다.
*   일반적으로 소스 세트의 이름을 가진 디렉터리에 저장되는 소스 파일 및 리소스 집합을 포함합니다.
*   이 소스 세트의 코드가 컴파일되는 타겟 집합을 지정합니다. 이 타겟들은 이 소스 세트에서 사용 가능한 언어 구성 및 종속성에 영향을 미칩니다.
*   자체 종속성 및 컴파일러 옵션을 정의합니다.

Kotlin은 여러 개의 사전 정의된 소스 세트를 제공합니다. 그중 하나는 `commonMain`으로, 모든 멀티플랫폼 프로젝트에 존재하며 선언된 모든 타겟으로 컴파일됩니다.

Kotlin Multiplatform 프로젝트에서는 `src` 내부의 디렉터리 형태로 소스 세트와 상호 작용합니다. 예를 들어, `commonMain`, `iosMain`, `jvmMain` 소스 세트를 가진 프로젝트는 다음과 같은 구조를 가집니다.

![Shared sources](src-directory-diagram.png){width=350}

Gradle 스크립트에서는 `kotlin.sourceSets {}` 블록 내부에서 이름으로 소스 세트에 접근합니다.

```kotlin
kotlin {
    // Targets declaration:
    // …

    // Source set declaration:
    sourceSets {
        commonMain {
            // Configure the commonMain source set
        }
    }
}
```

`commonMain` 외에 다른 소스 세트는 플랫폼별 소스 세트 또는 중간 소스 세트가 될 수 있습니다.

### 플랫폼별 소스 세트

공통 코드만 사용하는 것이 편리하더라도, 항상 가능한 것은 아닙니다. `commonMain`의 코드는 선언된 모든 타겟으로 컴파일되며, Kotlin은 그곳에서 플랫폼별 API를 사용하는 것을 허용하지 않습니다.

네이티브(native) 및 JS 타겟을 가진 멀티플랫폼 프로젝트에서 `commonMain`의 다음 코드는 컴파일되지 않습니다.

```kotlin
// commonMain/kotlin/common.kt
// 공통 코드에서는 컴파일되지 않음
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

해결책으로, Kotlin은 플랫폼별 소스 세트(platform-specific source sets)를 생성하며, 이는 플랫폼 소스 세트(platform source sets)라고도 불립니다. 각 타겟은 해당 타겟만을 위해 컴파일되는 해당 플랫폼 소스 세트를 가집니다. 예를 들어, `jvm` 타겟은 JVM으로만 컴파일되는 해당 `jvmMain` 소스 세트를 가집니다. Kotlin은 이러한 소스 세트에서 플랫폼별 종속성(platform-specific dependencies)을 사용하는 것을 허용합니다. 예를 들어, `jvmMain`에서는 JDK를 사용할 수 있습니다.

```kotlin
// jvmMain/kotlin/jvm.kt
// `jvmMain` 소스 세트에서 Java 종속성을 사용할 수 있습니다
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 특정 타겟으로의 컴파일

특정 타겟으로의 컴파일은 여러 소스 세트와 함께 작동합니다. Kotlin이 멀티플랫폼 프로젝트를 특정 타겟으로 컴파일할 때, 해당 타겟으로 레이블이 지정된 모든 소스 세트를 수집하여 이들로부터 바이너리를 생성합니다.

`jvm`, `iosArm64`, `js` 타겟을 포함하는 예시를 살펴보겠습니다. Kotlin은 공통 코드를 위한 `commonMain` 소스 세트와 특정 타겟을 위한 해당 `jvmMain`, `iosArm64Main`, `jsMain` 소스 세트를 생성합니다.

![Compilation to a specific target](specific-target-diagram.svg){width=700}

JVM으로 컴파일하는 동안, Kotlin은 "JVM"으로 레이블이 지정된 모든 소스 세트, 즉 `jvmMain`과 `commonMain`을 선택합니다. 그런 다음 이들을 함께 JVM 클래스 파일로 컴파일합니다.

![Compilation to JVM](compilation-jvm-diagram.svg){width=700}

Kotlin이 `commonMain`과 `jvmMain`을 함께 컴파일하기 때문에, 결과 바이너리에는 `commonMain`과 `jvmMain` 모두의 선언이 포함됩니다.

멀티플랫폼 프로젝트를 사용할 때 다음 사항을 기억하세요.

*   Kotlin이 코드를 특정 플랫폼으로 컴파일하도록 하려면, 해당 타겟을 선언하세요.
*   코드를 저장할 디렉터리 또는 소스 파일을 선택하려면, 먼저 어떤 타겟 간에 코드를 공유할지 결정하세요.
    *   코드가 모든 타겟 간에 공유되는 경우, `commonMain`에 선언해야 합니다.
    *   코드가 하나의 타겟에만 사용되는 경우, 해당 타겟의 플랫폼별 소스 세트(예: JVM의 경우 `jvmMain`)에 정의해야 합니다.
*   플랫폼별 소스 세트에 작성된 코드는 공통 소스 세트의 선언에 접근할 수 있습니다. 예를 들어, `jvmMain`의 코드는 `commonMain`의 코드를 사용할 수 있습니다. 그러나 그 반대는 성립하지 않습니다: `commonMain`은 `jvmMain`의 코드를 사용할 수 없습니다.
*   플랫폼별 소스 세트에 작성된 코드는 해당 플랫폼 종속성을 사용할 수 있습니다. 예를 들어, `jvmMain`의 코드는 [Guava](https://github.com/google/guava) 또는 [Spring](https://spring.io/)과 같은 Java 전용 라이브러리를 사용할 수 있습니다.

### 중간 소스 세트

간단한 멀티플랫폼 프로젝트는 일반적으로 공통 코드와 플랫폼별 코드만 가집니다. `commonMain` 소스 세트는 선언된 모든 타겟 간에 공유되는 공통 코드를 나타냅니다. `jvmMain`과 같은 플랫폼별 소스 세트는 해당 타겟으로만 컴파일되는 플랫폼별 코드를 나타냅니다.

실제로, 더 세분화된 코드 공유가 필요한 경우가 많습니다.

모든 최신 Apple 기기와 Android 기기를 타겟팅해야 하는 예시를 살펴보겠습니다.

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64비트 iPhone 기기
    macosArm64() // 최신 Apple Silicon 기반 Mac
    watchosX64() // 최신 64비트 Apple Watch 기기
    tvosArm64()  // 최신 Apple TV 기기  
}
```

그리고 모든 Apple 기기를 위한 UUID를 생성하는 함수를 추가할 소스 세트가 필요하다고 가정해 봅시다.

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // Apple별 API에 접근하려 합니다
    return NSUUID().UUIDString()
}
```

이 함수를 `commonMain`에 추가할 수 없습니다. `commonMain`은 Android를 포함한 모든 선언된 타겟으로 컴파일되지만, `platform.Foundation.NSUUID`는 Android에서는 사용할 수 없는 Apple별 API입니다. `commonMain`에서 `NSUUID`를 참조하려고 하면 Kotlin이 오류를 표시합니다.

이 코드를 각 Apple별 소스 세트인 `iosArm64Main`, `macosArm64Main`, `watchosX64Main`, `tvosArm64Main`에 복사하여 붙여넣을 수도 있습니다. 하지만 이와 같이 코드를 중복하는 것은 오류가 발생하기 쉬우므로 권장되지 않습니다.

이 문제를 해결하기 위해 _중간 소스 세트(intermediate source sets)_ 를 사용할 수 있습니다. 중간 소스 세트는 프로젝트의 모든 타겟은 아니지만 일부 타겟으로 컴파일되는 Kotlin 소스 세트입니다. 중간 소스 세트는 계층적 소스 세트(hierarchical source sets) 또는 단순히 계층(hierarchies)이라고도 불립니다.

Kotlin은 기본적으로 일부 중간 소스 세트를 생성합니다. 이 특정 경우에, 결과 프로젝트 구조는 다음과 같습니다.

![Intermediate source sets](intermediate-source-sets-diagram.svg){width=700}

여기서 하단의 여러 색 블록은 플랫폼별 소스 세트입니다. 명확성을 위해 타겟 레이블은 생략되었습니다.

`appleMain` 블록은 Apple별 타겟으로 컴파일된 코드를 공유하기 위해 Kotlin이 생성한 중간 소스 세트입니다. `appleMain` 소스 세트는 Apple 타겟으로만 컴파일됩니다. 따라서 Kotlin은 `appleMain`에서 Apple별 API 사용을 허용하며, 여기에 `randomUUID()` 함수를 추가할 수 있습니다.

> Kotlin이 기본적으로 생성하고 설정하는 모든 중간 소스 세트를 찾고, Kotlin이 기본적으로 필요한 중간 소스 세트를 제공하지 않는 경우 어떻게 해야 하는지에 대한 자세한 내용은 [계층적 프로젝트 구조](multiplatform-hierarchy.md)를 참조하세요.
>
{style="tip"}

특정 타겟으로 컴파일하는 동안, Kotlin은 해당 타겟으로 레이블이 지정된 모든 소스 세트(중간 소스 세트 포함)를 가져옵니다. 따라서 `iosArm64` 플랫폼 타겟으로 컴파일하는 동안 `commonMain`, `appleMain`, `iosArm64Main` 소스 세트에 작성된 모든 코드가 결합됩니다.

![Native executables](multiplatform-executables-diagram.svg){width=700}

> 일부 소스 세트에 소스가 없어도 괜찮습니다. 예를 들어, iOS 개발에서는 일반적으로 iOS 기기에는 특화되지만 iOS 시뮬레이터에는 특화되지 않은 코드를 제공할 필요가 없습니다. 따라서 `iosArm64Main`은 거의 사용되지 않습니다.
>
{style="tip"}

#### Apple 기기 및 시뮬레이터 타겟 {initial-collapse-state="collapsed" collapsible="true"}

Kotlin Multiplatform를 사용하여 iOS 모바일 애플리케이션을 개발할 때, 일반적으로 `iosMain` 소스 세트와 함께 작업합니다. 일반적으로 `ios` 타겟의 플랫폼별 소스 세트라고 생각할 수 있지만, 단일 `ios` 타겟은 존재하지 않습니다. 대부분의 모바일 프로젝트는 최소 두 가지 타겟이 필요합니다.

*   **기기 타겟(Device target)** 은 iOS 기기에서 실행될 수 있는 바이너리를 생성하는 데 사용됩니다. 현재 iOS용 기기 타겟은 `iosArm64` 하나뿐입니다.
*   **시뮬레이터 타겟(Simulator target)** 은 컴퓨터에서 실행되는 iOS 시뮬레이터용 바이너리를 생성하는 데 사용됩니다. Apple silicon Mac 컴퓨터를 사용한다면, 시뮬레이터 타겟으로 `iosSimulatorArm64`를 선택하세요. Intel 기반 Mac 컴퓨터를 사용한다면 `iosX64`를 사용하세요.

`iosArm64` 기기 타겟만 선언하면 로컬 머신에서 애플리케이션과 테스트를 실행하고 디버그할 수 없습니다.

`iosArm64Main`, `iosSimulatorArm64Main`, `iosX64Main`과 같은 플랫폼별 소스 세트는 일반적으로 비어 있습니다. iOS 기기와 시뮬레이터를 위한 Kotlin 코드는 대개 동일하기 때문입니다. 이들 모두 간에 코드를 공유하려면 `iosMain` 중간 소스 세트만 사용해도 됩니다.

동일한 원리가 Mac 이외의 다른 Apple 타겟에도 적용됩니다. 예를 들어, Apple TV용 `tvosArm64` 기기 타겟과 Apple silicon 및 Intel 기반 기기의 Apple TV 시뮬레이터용 `tvosSimulatorArm64`, `tvosX64` 시뮬레이터 타겟이 있다면, 이들 모두를 위해 `tvosMain` 중간 소스 세트를 사용할 수 있습니다.

## 테스트 통합

실제 프로젝트에서는 주요 프로덕션 코드와 함께 테스트도 필요합니다. 이것이 기본적으로 생성되는 모든 소스 세트에 `Main` 및 `Test` 접미사가 붙는 이유입니다. `Main`은 프로덕션 코드를 포함하고, `Test`는 이 코드에 대한 테스트를 포함합니다. 둘 사이의 연결은 자동으로 설정되며, 테스트는 추가 구성 없이 `Main` 코드가 제공하는 API를 사용할 수 있습니다.

`Test`에 해당하는 소스 세트 역시 `Main`과 유사한 소스 세트입니다. 예를 들어, `commonTest`는 `commonMain`에 해당하는 소스 세트이며 선언된 모든 타겟으로 컴파일되어 공통 테스트를 작성할 수 있도록 합니다. `jvmTest`와 같은 플랫폼별 테스트 소스 세트는 플랫폼별 테스트(예: JVM별 테스트 또는 JVM API가 필요한 테스트)를 작성하는 데 사용됩니다.

공통 테스트를 작성할 소스 세트 외에도, 멀티플랫폼 테스트 프레임워크가 필요합니다. Kotlin은 `@kotlin.Test` 어노테이션과 `assertEquals`, `assertTrue`와 같은 다양한 검증 메서드를 제공하는 기본 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리를 제공합니다.

각 플랫폼의 해당 소스 세트에서 일반적인 테스트처럼 플랫폼별 테스트를 작성할 수 있습니다. 주요 코드와 마찬가지로, 각 소스 세트별로 플랫폼별 종속성을 가질 수 있습니다. 예를 들어, JVM용 `JUnit`과 iOS용 `XCTest`가 있습니다. 특정 타겟에 대한 테스트를 실행하려면 `<targetName>Test` 태스크를 사용하세요.

[멀티플랫폼 앱 테스트 튜토리얼](multiplatform-run-tests.md)에서 멀티플랫폼 테스트를 생성하고 실행하는 방법을 알아보세요.

## 다음 단계

*   [Gradle 스크립트에서 사전 정의된 소스 세트를 선언하고 사용하는 방법에 대해 자세히 알아보기](multiplatform-hierarchy.md)
*   [멀티플랫폼 프로젝트 구조의 고급 개념 탐색하기](multiplatform-advanced-project-structure.md)
*   [타겟 컴파일 및 사용자 정의 컴파일 생성에 대해 자세히 알아보기](multiplatform-configure-compilations.md)