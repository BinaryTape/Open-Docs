[//]: # (title: Swift export를 사용한 Swift와의 상호운용성)

<primary-label ref="experimental-general"/>

Kotlin은 Swift export에 대한 실험적 지원을 제공합니다. 이를 통해 Kotlin 소스를 직접 내보내고 Swift에서 관용적(idiomatically)으로 Kotlin 코드를 호출할 수 있으며, Objective-C 헤더가 필요하지 않습니다.

Swift export는 Apple 타겟을 위한 멀티플랫폼 개발을 더욱 효율적으로 만들어 줍니다. 예를 들어, 최상위 함수(top-level functions)가 포함된 Kotlin 모듈이 있는 경우, Swift export를 사용하면 혼란스러운 Objective-C의 언더스코어(_)나 맹글링된 이름(mangled names) 없이 깔끔하고 모듈에 특화된 임포트(import)가 가능합니다.

현재 Swift export의 기능은 다음과 같습니다:

* **다중 모듈 지원(Multi-module support)**: 각 Kotlin 모듈은 별도의 Swift 모듈로 내보내지므로 함수 호출이 간소화됩니다.
* **패키지 지원(Package support)**: Kotlin 패키지가 내보내기 중에 명시적으로 보존되어, 생성된 Swift 코드에서의 이름 충돌을 방지합니다.
* **타입 별칭(Type aliases)**: Kotlin의 타입 별칭(`typealias`)이 Swift로 내보내지고 유지되어 가독성이 향상됩니다.
* **기본 타입에 대한 향상된 null 가능성(nullability) 지원**: null 가능성을 유지하기 위해 `Int?`와 같은 타입을 `KotlinInt`와 같은 래퍼 클래스로 박싱해야 했던 Objective-C 상호운용성과 달리, Swift export는 null 가능성 정보를 직접 변환합니다.
* **오버로드(Overloads)**: Swift에서 모호함 없이 Kotlin의 오버로드된 함수를 호출할 수 있습니다.
* **패키지 구조 평탄화(Flattened package structure)**: Kotlin 패키지를 Swift 열거형(enum)으로 변환하여, 생성된 Swift 코드에서 패키지 접두사를 제거할 수 있습니다.
* **모듈 이름 커스텀**: Kotlin 프로젝트의 Gradle 설정에서 생성되는 Swift 모듈 이름을 커스텀할 수 있습니다.

## Swift export 활성화하기

이 기능은 현재 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계이며 프로덕션 환경에서 사용할 준비가 되지 않았습니다. 이 기능을 사용해 보려면 Kotlin 프로젝트에서 [빌드 파일을 구성](#configure-kotlin-project)하고, Swift export를 통합하도록 [Xcode를 설정](#configure-xcode-project)하세요.

### Kotlin 프로젝트 설정

Swift export 설정을 시작하기 위해 프로젝트에서 다음 빌드 파일을 참고할 수 있습니다:

```kotlin
// build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // 루트 모듈 이름 설정
        moduleName = "Shared"

        // 평탄화(collapse) 규칙 설정
        // 생성된 Swift 코드에서 패키지 접두사 제거
        flattenPackage = "com.example.sandbox"

        // 외부 모듈 내보내기 설정
        export(project(":subproject")) {
            // 내보낼 모듈의 이름 설정 
            moduleName = "Subproject"
            // 내보낼 종속성에 대한 평탄화 규칙 설정 
            flattenPackage = "com.subproject.library"
        }

        // 링크 태스크에 컴파일러 인자 제공
        configure {
            freeCompilerArgs.add("-Xexpect-actual-classes")
        }
    }
}
```

Kotlin 컴파일러는 필요한 모든 파일(`swiftmodule` 파일, 정적 `.a` 라이브러리, 헤더 파일, `modulemap` 파일 포함)을 자동으로 생성하고 이를 앱의 빌드 디렉토리에 복사하며, Xcode에서 이 디렉토리에 접근할 수 있습니다.

> Swift export가 이미 설정된 [공식 샘플](https://github.com/Kotlin/swift-export-sample)을 클론하여 확인할 수도 있습니다.
>
{style="tip"}

### Xcode 프로젝트 설정

프로젝트에 Swift export를 통합하도록 Xcode를 설정하는 방법은 다음과 같습니다:

1. Xcode에서 프로젝트 설정을 엽니다.
2. **Build Phases** 탭에서 `embedAndSignAppleFrameworkForXcode` 태스크가 포함된 **Run Script** 페이즈를 찾습니다.
3. 해당 실행 스크립트 페이즈의 스크립트를 `embedSwiftExportForXcode` 태스크로 교체합니다:

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![Swift export 스크립트 추가](xcode-swift-export-run-script-phase.png){width=700}

4. 프로젝트를 빌드합니다. 빌드가 완료되면 출력 디렉토리에 Swift 모듈이 생성됩니다.

## 현재 제한 사항

현재 Swift export는 iOS 프레임워크를 Xcode 프로젝트에 연결하기 위해 [직접 통합(direct integration)](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html) 방식을 사용하는 프로젝트에서만 작동합니다. 이는 IntelliJ IDEA의 Kotlin Multiplatform 플러그인이나 [웹 위저드](https://kmp.jetbrains.com/)를 통해 생성된 Kotlin Multiplatform 프로젝트의 표준 구성입니다.

기타 알려진 문제:

* Gradle 좌표에서 모듈 이름이 동일한 경우(예: SQLDelight의 Runtime 모듈과 Compose Runtime 모듈) Swift export가 중단됩니다 ([KT-80185](https://youtrack.jetbrains.com/issue/KT-80185)).
* `List`, `Set`, `Map`을 상속하는 타입은 내보내기 중에 무시됩니다 ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416)).
* `List`, `Set`, `Map`의 상속자는 Swift 측에서 인스턴스화할 수 없습니다 ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417)).
* Swift로 내보낼 때 Kotlin 제네릭 타입 파라미터는 상한(upper bounds) 타입으로 타입 삭제(type-erased)됩니다.
* Swift 클로저를 Kotlin으로 전달할 수 있지만, Kotlin은 함수형 타입(functional types)을 Swift로 내보낼 수 없습니다.
* 언어 간 상속은 지원되지 않으므로, Swift 클래스는 Kotlin에서 내보낸 클래스나 인터페이스를 직접 서브클래싱할 수 없습니다.
* IDE 마이그레이션 팁이나 자동화 도구는 제공되지 않습니다.
* 옵트인(opt-in)이 필요한 선언을 사용할 때는 Gradle 빌드 파일의 _모듈 레벨_에서 명시적인 `optIn` 컴파일러 옵션을 추가해야 합니다. 예를 들어, `kotlinx.datetime` 라이브러리의 경우 다음과 같습니다:

  ```kotlin
  swiftExport {
      moduleName = "Shared"

      export("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%") {
          moduleName = "KotlinDateTime"
          flattenPackage = "kotlinx.datetime"
      }
  }

  // 모듈 레벨에 별도의 opt-in 블록 추가
  compilerOptions {
      optIn.add("kotlin.time.ExperimentalTime")
  }
  ```

## 매핑(Mappings)

아래 표는 Kotlin 개념이 Swift로 어떻게 매핑되는지 보여줍니다.

| Kotlin                 | Swift                          | 비고                      |
|------------------------|--------------------------------|-------------------------|
| `class`                | `class`                        | [참고](#classes)        |
| `object`               | `shared` 프로퍼티를 가진 `class` | [참고](#objects)        |
| `enum class`           | `enum`                         | [참고](#enums)          |
| `typealias`            | `typealias`                    | [참고](#type-aliases)   |
| 함수(Function)          | 함수(Function)                  | [참고](#functions)      |
| 프로퍼티(Property)       | 프로퍼티(Property)               | [참고](#properties)     |
| 생성자(Constructor)     | 이니셜라이저(Initializer)        | [참고](#constructors)   |
| 패키지(Package)         | 중첩된 열거형(Nested enum)        | [참고](#packages)       |
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
| `Any`                  | `KotlinBase` 클래스             |                         |
| `Unit`                 | `Void`                         |                         |
| `Nothing`              | `Never`                        | [참고](#kotlin-nothing) |

### 선언(Declarations)

#### 클래스(Classes)

Swift export는 `class Foo()`와 같이 `Any`를 직접 상속하는 final 클래스만 지원합니다. 이들은 특별한 `KotlinBase` 클래스를 상속하는 Swift 클래스로 변환됩니다.

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

#### 객체(Objects)

객체(object)는 private `init`과 static `shared` 접근자를 가진 Swift 클래스로 변환됩니다.

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

#### 타입 별칭(Type aliases)

Kotlin의 타입 별칭은 있는 그대로 내보내집니다.

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

#### 열거형(Enums)

Kotlin의 `enum class` 선언은 일반적인 네이티브 Swift `enum` 타입으로 내보내집니다.

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    public var rgb: Swift.Int32 { get }
}
```

#### 함수(Functions)

Swift export는 간단한 최상위 함수와 메서드를 지원합니다.

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

Kotlin의 확장 함수(extension functions)의 경우, 수신 객체(receiver) 파라미터가 첫 번째 위치의 일반 Swift 파라미터가 됩니다.

```kotlin
// Kotlin
fun Int.foo(): Unit = TODO()
```

```swift
// Swift
func foo(_ receiver: Int32) {}
```

Kotlin의 [`vararg`](functions.md#variable-number-of-arguments-varargs) 함수는 Swift의 가변 파라미터(variadic parameters)로 매핑됩니다.

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```swift
// Swift
public func log(messages: Swift.String...)
```

> `suspend`, `inline`, `operator` 키워드가 포함된 함수에 대한 지원은 현재 제한적입니다.
> 제네릭 타입은 일반적으로 지원되지 않습니다.
>
{style="note"}

#### 프로퍼티(Properties)

Kotlin 프로퍼티는 Swift 프로퍼티로 변환됩니다.

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

#### 생성자(Constructors)

생성자는 Swift 이니셜라이저로 변환됩니다.

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

### 타입(Types)

#### kotlin.Nothing

Kotlin의 `Nothing` 타입은 Swift의 `Never` 타입으로 변환됩니다.

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

#### 분류자 타입(Classifier types)

Swift export는 현재 `Any`를 직접 상속하는 final 클래스만 지원합니다.

### 패키지(Packages)

이름 충돌을 피하기 위해 Kotlin 패키지는 중첩된 Swift 열거형(enum)으로 변환됩니다.

```kotlin
// Kotlin
// foo.bar 패키지의 bar.kt 파일
fun callMeMaybe() {}
```

```kotlin
// Kotlin
// foo.baz 패키지의 baz.kt 파일
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

## Swift export의 발전 방향

향후 Kotlin 릴리스에서 Swift export를 확장하고 점진적으로 안정화하여, 특히 코루틴(coroutines)과 플로우(flows)를 중심으로 Kotlin과 Swift 간의 상호운용성을 개선할 계획입니다.

다음 채널을 통해 의견을 남겨주세요:

* Kotlin Slack – [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 후 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 채널에 참여하세요.
* [YouTrack](https://kotl.in/issue)에 이슈를 제보해 주세요.