[//]: # (title: Swift export를 사용한 Swift와의 상호 운용성)

<primary-label ref="experimental-general"/>

Kotlin은 Swift export에 대한 실험적 지원을 제공합니다. 이를 통해 Kotlin 소스를 직접 내보내고 Swift에서 Kotlin 코드를 Swift 고유의 방식으로 호출할 수 있게 해줍니다. 이로써 Objective-C 헤더가 필요하지 않습니다.

Swift export는 Apple 대상의 멀티플랫폼 개발을 더욱 간소화합니다. 예를 들어, 최상위 함수가 있는 Kotlin 모듈이 있다면, Swift export는 깔끔하고 모듈별 임포트를 가능하게 하여 혼란스러운 Objective-C 언더스코어와 변형된 이름들을 제거합니다.

현재 Swift export 기능은 다음과 같습니다:

*   **멀티 모듈 지원**. 각 Kotlin 모듈은 별도의 Swift 모듈로 내보내져 함수 호출을 간소화합니다.
*   **패키지 지원**. Kotlin 패키지는 내보내기 시 명시적으로 보존되어 생성된 Swift 코드에서 이름 충돌을 방지합니다.
*   **타입 별칭**. Kotlin 타입 별칭은 Swift로 내보내지고 보존되어 가독성을 향상시킵니다.
*   **기본 타입에 대한 향상된 널 허용성**. `Int?`와 같은 타입을 `KotlinInt`와 같은 래퍼 클래스로 박싱하여 널 허용성을 보존해야 했던 Objective-C 상호 운용성과 달리, Swift export는 널 허용성 정보를 직접 변환합니다.
*   **오버로드**. Swift에서 Kotlin의 오버로드된 함수를 모호함 없이 호출할 수 있습니다.
*   **플랫 패키지 구조**. Kotlin 패키지를 Swift 열거형으로 변환하여 생성된 Swift 코드에서 패키지 접두사를 제거할 수 있습니다.
*   **모듈 이름 사용자 지정**. Kotlin 프로젝트의 Gradle 설정에서 결과 Swift 모듈 이름을 사용자 지정할 수 있습니다.

## Swift export 활성화

이 기능은 현재 [실험적](components-stability.md#stability-levels-explained)이며 프로덕션에 사용할 준비가 되지 않았습니다. 이 기능을 사용해 보려면 Kotlin 프로젝트에서 [빌드 파일을 구성](#configure-kotlin-project)하고 Swift export를 통합하도록 [Xcode를 설정](#configure-xcode-project)하세요.

### Kotlin 프로젝트 구성

프로젝트에서 다음 빌드 파일을 Swift export 설정의 시작점으로 사용할 수 있습니다:

```kotlin
// build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // Set the root module name
        moduleName = "Shared"

        // Set the collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Configure external modules export
        export(project(":subproject")) {
            // Set the name for the exported module 
            moduleName = "Subproject"
            // Set the collapse rule for the exported dependency 
            flattenPackage = "com.subproject.library"
        }

        // Provide compiler arguments to link tasks
        configure {
            freeCompilerArgs.add("-Xexpect-actual-classes")
        }
    }
}
```

Kotlin 컴파일러는 필요한 모든 파일(`swiftmodule` 파일, 정적 `.a` 라이브러리, 헤더 파일, `modulemap` 파일을 포함)을 자동으로 생성하여 앱의 빌드 디렉터리에 복사하며, 이 디렉터리는 Xcode에서 접근할 수 있습니다.

> Swift export가 이미 설정된 [공개 샘플](https://github.com/Kotlin/swift-export-sample)을 클론할 수도 있습니다.
>
{style="tip"}

### Xcode 프로젝트 구성

Xcode에서 Swift export를 프로젝트에 통합하도록 구성하려면:

1.  Xcode에서 프로젝트 설정을 엽니다.
2.  **Build Phases** 탭에서 `embedAndSignAppleFrameworkForXcode` 태스크가 있는 **Run Script** 단계를 찾습니다.
3.  실행 스크립트 단계에서 스크립트를 `embedSwiftExportForXcode` 태스크로 대체합니다:

    ```bash
    ./gradlew :<Shared module name>:embedSwiftExportForXcode
    ```

    ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4.  프로젝트를 빌드합니다. 빌드 시 출력 디렉터리에 Swift 모듈이 생성됩니다.

## 현재 제한 사항

Swift export는 현재 iOS 프레임워크를 Xcode 프로젝트에 연결하기 위해 [직접 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html)을 사용하는 프로젝트에서만 작동합니다. 이는 IntelliJ IDEA의 Kotlin Multiplatform 플러그인 또는 [웹 마법사](https://kmp.jetbrains.com/)를 통해 생성된 Kotlin Multiplatform 프로젝트의 표준 구성입니다.

알려진 다른 문제:

*   Gradle 좌표에서 모듈 이름이 동일할 경우 Swift export가 중단됩니다. 예를 들어, SQLDelight의 Runtime 모듈과 Compose Runtime 모듈의 경우입니다 ([KT-80185](https://youtrack.jetbrains.com/issue/KT-80185)).
*   `List`, `Set`, 또는 `Map`을 상속하는 타입은 내보내기 중에 무시됩니다 ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416)).
*   `List`, `Set`, 또는 `Map`의 상속자는 Swift 측에서 인스턴스화할 수 없습니다 ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417)).
*   Swift로 내보내질 때, Kotlin 제네릭 타입 파라미터는 상위 경계로 타입 소거됩니다.
*   Swift 클로저는 Kotlin으로 전달될 수 있지만, Kotlin은 함수형 타입을 Swift로 내보낼 수 없습니다.
*   교차 언어 상속은 지원되지 않으므로, Swift 클래스는 Kotlin으로 내보내진 클래스나 인터페이스를 직접 서브클래싱할 수 없습니다.
*   IDE 마이그레이션 팁이나 자동화 기능은 제공되지 않습니다.
*   옵트인(opt-in)이 필요한 선언을 사용할 경우, Gradle 빌드 파일에 _모듈 수준_에서 명시적인 `optIn` 컴파일러 옵션을 추가해야 합니다. 예를 들어, `kotlinx.datetime` 라이브러리의 경우:

    ```kotlin
    swiftExport {
        moduleName = "Shared"

        export("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%") {
            moduleName = "KotlinDateTime"
            flattenPackage = "kotlinx.datetime"
        }
    }

    // Add a separate opt-in block at the module level
    compilerOptions {
        optIn.add("kotlin.time.ExperimentalTime")
    }
    ```

## 매핑

아래 표는 Kotlin 개념이 Swift에 어떻게 매핑되는지를 보여줍니다.

| Kotlin                 | Swift                          | 참고                    |
|------------------------|--------------------------------|-------------------------|
| `class`                | `class`                        | [참고](#classes)        |
| `object`               | `class` with `shared` property | [참고](#objects)        |
| `typealias`            | `typealias`                    | [참고](#type-aliases)   |
| Function               | Function                       | [참고](#functions)      |
| Property               | Property                       | [참고](#properties)     |
| Constructor            | Initializer                    | [참고](#constructors)   |
| Package                | Nested enum                    | [참고](#packages)       |
| `Boolean`              | `Bool`                         |                         |
| `Char`                 | `Unicode.UTF16.CodeUnit`       |                         |
| `Byte`                 | `Int8`                         |                         |
| `Short`                | `Int16`                        |                         |
| `Int`                  | `Int32`                        |                         |
| `Long`                 | `Int64`                        |                         |
| `UByte`                | `UInt8`                        |                         |
| `UShort`               | `UInt16`                       |                         |
| `UInt`                 | `UInt32`                       |                         |
| `ULong`                | `UInt64`                       |                         |
| `Float`                | `Float`                        |                         |
| `Double`               | `Double`                       |                         |
| `Any`                  | `KotlinBase` class             |                         |
| `Unit`                 | `Void`                         |                         |
| `Nothing`              | `Never`                        | [참고](#kotlin-nothing) |

### 선언

#### 클래스

Swift export는 `class Foo()`와 같이 `Any`를 직접 상속하는 final 클래스만 지원합니다. 이들은 특별한 `KotlinBase` 클래스를 상속하는 Swift 클래스로 변환됩니다:

```kotlin
// Kotlin
class MyClass {
    val property: Int = 0

    fun method() {}
}
```

```swift
// Swift
public class MyClass : KotlinRuntime.KotlinBase {
    public var property: Swift.Int32 {
        get {
            // ...
        }
    }
    public override init() {
        // ...
    }
    public func method() -> Swift.Void {
        // ...
    }
}
```

#### 객체

객체는 private `init`과 정적 `shared` 접근자를 가진 Swift 클래스로 변환됩니다:

```kotlin
// Kotlin
object O
```

```swift
// Swift
public class O : KotlinRuntime.KotlinBase {
    public static var shared: O {
        get {
            // ...
        }
    }
    private override init() {
        // ...
    }
}
```

#### 타입 별칭

Kotlin 타입 별칭은 그대로 내보내집니다:

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

#### 함수

Swift export는 간단한 최상위 함수와 메서드를 지원합니다:

```kotlin
// Kotlin
fun foo(a: Short, b: Bar) {}

fun baz(): Long = 0
```

```swift
// Swift
public func foo(a: Swift.Int16, b: Bar) -> Swift.Void {
    // ...
}

public func baz() -> Swift.Int64 {
    // ...
}
```

확장 함수도 지원됩니다. 확장 함수의 리시버(receiver) 파라미터는 일반 파라미터의 첫 번째 위치로 이동됩니다:

```kotlin
// Kotlin
fun Int.foo(): Unit = TODO()
```

```swift
// Swift
func foo(_ receiver: Int32) {}
```

`suspend`, `inline`, `operator` 키워드가 있는 함수는 지원되지 않습니다.

#### 프로퍼티

Kotlin 프로퍼티는 Swift 프로퍼티로 변환됩니다:

```kotlin
// Kotlin
val a: Int = 0

var b: Short = 15

const val c: Int = 0
```

```swift
// Swift
public var a: Swift.Int32 {
    get {
        // ...
    }
}
public var b: Swift.Int16 {
    get {
        // ...
    }
    set {
        // ...
    }
}
public var c: Swift.Int32 {
    get {
        // ...
    }
}
```

#### 생성자

생성자는 Swift 이니셜라이저(initializer)로 변환됩니다:

```kotlin
// Kotlin
class Foo(val prop: Int)
```

```swift
// Swift
public class Foo : KotlinRuntime.KotlinBase {
    public init(
        prop: Swift.Int32
    ) {
        // ...
    }
}
```

### 타입

#### kotlin.Nothing

Kotlin의 `Nothing` 타입은 `Never` 타입으로 변환됩니다:

```kotlin
// Kotlin
fun foo(): Nothing = TODO()

fun baz(input: Nothing) {}
```

```swift
// Swift
public func foo() -> Swift.Never {
    // ...
}

public func baz(input: Swift.Never) -> Void {
    // ...
}
```

#### 분류자 타입

Swift export는 현재 `Any`를 직접 상속하는 final 클래스만 지원합니다.

### 패키지

Kotlin 패키지는 이름 충돌을 피하기 위해 중첩된 Swift 열거형으로 변환됩니다:

```kotlin
// Kotlin
// bar.kt file in foo.bar package
fun callMeMaybe() {}
```

```kotlin
// Kotlin
// baz.kt file in foo.baz package
fun callMeMaybe() {}
```

```swift
// Swift
public extension foo.bar {
    public func callMeMaybe() {}
}

public extension foo.baz {
    public func callMeMaybe() {}
}

public enum foo {
    public enum bar {}

    public enum baz {}
}
```

## Swift export의 발전

향후 Kotlin 릴리스에서 Swift export를 확장하고 점진적으로 안정화하여 Kotlin과 Swift 간의 상호 운용성을 개선하고, 특히 코루틴(coroutines) 및 플로우(flows) 관련 기능을 향상할 계획입니다.

피드백을 남기실 수 있습니다:

*   Kotlin Slack에서 – [초대받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 및 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 채널에 참여하세요.
*   [YouTrack](https://kotl.in/issue)에 이슈를 보고하세요.