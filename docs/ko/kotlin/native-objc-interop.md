[//]: # (title: Swift/Objective-C와의 상호 운용성)

> Objective-C 라이브러리 가져오기는 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 단계입니다.
> cinterop 도구를 통해 Objective-C 라이브러리에서 생성된 모든 Kotlin 선언에는
> `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)는
> 일부 API에 대해서만 옵트인이 필요합니다.
>
{style="note"}

Kotlin/Native는 Objective-C를 통해 Swift와의 간접적인 상호 운용성을 제공합니다. 이 문서는 Swift/Objective-C 코드에서 Kotlin 선언을 사용하는 방법과 Kotlin 코드에서 Objective-C 선언을 사용하는 방법을 다룹니다.

도움이 될 만한 다른 리소스는 다음과 같습니다:

* [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia): Swift 코드에서 Kotlin 선언을 사용하는 방법에 대한 예제 모음입니다.
* [Swift/Objective-C ARC와의 통합](native-arc-integration.md) 섹션: Kotlin의 추적 GC(tracing GC)와 Objective-C의 ARC 간 통합에 대한 세부 사항을 다룹니다.

## Swift/Objective-C 라이브러리를 Kotlin으로 가져오기

Objective-C 프레임워크와 라이브러리는 빌드에 적절히 가져오면 Kotlin 코드에서 사용할 수 있습니다(시스템 프레임워크는 기본적으로 가져오기 됩니다). 자세한 내용은 다음을 참조하세요:

* [라이브러리 정의 파일 생성 및 구성](native-definition-file.md)
* [네이티브 라이브러리에 대한 컴파일 구성](https://kotlinlang.org/docs/multiplatform/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

Swift 라이브러리는 해당 API가 `@objc`를 통해 Objective-C로 노출(export)된 경우 Kotlin 코드에서 사용할 수 있습니다. 순수 Swift 모듈은 아직 지원되지 않습니다.

## Swift/Objective-C에서 Kotlin 사용하기

Kotlin 모듈을 프레임워크로 컴파일하면 Swift/Objective-C 코드에서 사용할 수 있습니다:

* 바이너리 선언 방법은 [최종 네이티브 바이너리 빌드](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#declare-binaries)를 참조하세요.
* 예제는 [Kotlin Multiplatform 샘플 프로젝트](https://github.com/Kotlin/kmm-basic-sample)를 확인하세요.

### Objective-C 및 Swift로부터 Kotlin 선언 숨기기

<primary-label ref="experimental-opt-in"/>

Kotlin 코드를 Swift/Objective-C에서 더 사용하기 쉽게 만들려면, `@HiddenFromObjC` 어노테이션을 사용하여 Objective-C 및 Swift로부터 Kotlin 선언을 숨길 수 있습니다. 이 어노테이션은 해당 함수나 프로퍼티가 Objective-C로 노출되는 것을 비활성화합니다.

또는, Kotlin 선언에 `internal` 수정자를 사용하여 컴파일 모듈 내에서 가시성을 제한할 수 있습니다. 다른 Kotlin 모듈에서는 보이게 유지하면서 Objective-C 및 Swift에서만 숨기고 싶을 때 `@HiddenFromObjC`를 사용하세요.

[Kotlin-Swift interopedia의 예제 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md).

### Swift에서 리파이닝(Refining) 사용하기

<primary-label ref="experimental-opt-in"/>

`@ShouldRefineInSwift`는 Kotlin 선언을 Swift로 작성된 래퍼(wrapper)로 대체하는 데 도움이 됩니다. 이 어노테이션은 생성된 Objective-C API에서 함수나 프로퍼티를 `swift_private`으로 표시합니다. 이러한 선언은 `__` 접두사가 붙어 Swift에서 보이지 않게 됩니다.

Swift 친화적인 API를 만들기 위해 Swift 코드 내에서 이러한 선언을 여전히 사용할 수 있지만, Xcode 오토컴플릿(autocomplete)에는 제안되지 않습니다.

* Swift에서 Objective-C 선언을 리파이닝하는 방법에 대한 자세한 내용은 [공식 Apple 문서](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)를 참조하세요.
* `@ShouldRefineInSwift` 어노테이션 사용 예제는 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)를 참조하세요.

### 선언 이름 변경하기

<primary-label ref="experimental-opt-in"/>

Kotlin 선언의 이름을 변경하지 않고 그대로 두려면 `@ObjCName` 어노테이션을 사용하세요. 이 어노테이션은 Kotlin 컴파일러가 어노테이션이 달린 클래스, 인터페이스 또는 기타 Kotlin 엔티티에 대해 사용자 정의 Objective-C 및 Swift 이름을 사용하도록 지시합니다.

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// ObjCName 어노테이션과 함께 사용
let array = MySwiftArray()
let index = array.index(of: "element")
```

[Kotlin-Swift interopedia의 다른 예제 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md).

### KDoc 주석으로 문서 제공하기

문서는 모든 API를 이해하는 데 필수적입니다. 공유된 Kotlin API에 대한 문서를 제공하면 사용법, 주의 사항 등에 대해 사용자와 소통할 수 있습니다.

Objective-C 헤더를 생성할 때, Kotlin 코드의 [KDoc](kotlin-doc.md) 주석은 해당 Objective-C 주석으로 번역됩니다. 예를 들어, KDoc이 포함된 다음 Kotlin 코드는:

```kotlin
/**
 * 인수의 합계를 출력합니다.
 * 합계가 32비트 정수에 맞지 않는 경우를 적절히 처리합니다.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

다음과 같은 주석이 포함된 Objective-C 헤더를 생성합니다.

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDoc 주석은 klibs에 내장되어 있으며 klibs에서 생성된 Apple 프레임워크로 추출됩니다. 그 결과, Xcode 등에서 자동 완성 중에 클래스와 메서드에 대한 주석이 나타납니다. `.h` 파일의 함수 정의로 이동하면 `@param`, `@return` 및 유사한 태그에 대한 주석을 볼 수 있습니다.

알려진 제한 사항:

* 종속성(Dependency) 문서는 `-Xexport-kdoc` 옵션으로 컴파일되지 않는 한 내보내지지 않습니다. 이 컴파일러 옵션으로 컴파일된 라이브러리는 다른 컴파일러 버전과 호환되지 않을 수 있습니다.
* KDoc 주석은 대부분 그대로 내보내지지만, `@property`와 같은 많은 KDoc 블록 태그는 지원되지 않습니다.

필요한 경우, Gradle 빌드 파일의 `binaries {}` 블록에서 klibs에서 생성된 Apple 프레임워크로의 KDoc 주석 내보내기를 비활성화할 수 있습니다.

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

kotlin {
    iosArm64 {
        binaries {
            framework {
                baseName = "sdk"
                @OptIn(ExperimentalKotlinGradlePluginApi::class)
                exportKdoc.set(false)
            }
        }
    }
}
```

## 매핑(Mappings)

아래 표는 Kotlin 개념이 Swift/Objective-C로 어떻게 매핑되는지, 그 반대의 경우는 어떤지 보여줍니다.

"->" 및 "<-"는 매핑이 한 방향으로만 이루어짐을 나타냅니다.

| Kotlin                 | Swift                            | Objective-C                      | 참고                                                                              |
|------------------------|----------------------------------|----------------------------------|---------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [참고](#classes)                                                                  |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                 |
| `constructor`/`create` | Initializer                      | Initializer                      | [참고](#initializers)                                                              |
| Property               | Property                         | Property                         | [참고 1](#top-level-functions-and-properties), [참고 2](#setters)                  |
| Method                 | Method                           | Method                           | [참고 1](#top-level-functions-and-properties), [참고 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [참고](#enums)                                                                    |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [참고 1](#errors-and-exceptions), [참고 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [참고](#errors-and-exceptions)                                                    |
| Extension              | Extension                        | Category member                  | [참고](#extensions-and-category-members)                                          |
| `companion` member <-  | Class method or property         | Class method or property         |                                                                                 |
| `null`                 | `nil`                            | `nil`                            |                                                                                 |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [참고](#kotlin-singletons)                                                         |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [참고](#primitive-types)                                                          |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                 |
| `String`               | `String`                         | `NSString`                       | [참고](#strings)                                                                  |
| `String`               | `NSMutableString`                | `NSMutableString`                | [참고](#nsmutablestring)                                                          |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                 |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                 |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                 |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [참고](#collections)                                                              |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                 |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [참고](#collections)                                                              |
| Function type          | Function type                    | Block pointer type               | [참고](#function-types)                                                           |
| Inline classes         | Unsupported                      | Unsupported                      | [참고](#unsupported)                                                              |

### 클래스(Classes)

#### 이름 번역(Name translation)

Objective-C 클래스는 원래 이름 그대로 Kotlin으로 가져오기 됩니다.
프로토콜은 이름 뒤에 `Protocol` 접미사가 붙은 인터페이스로 가져오기 됩니다. 예: `@protocol Foo` -> `interface FooProtocol`.
이러한 클래스와 인터페이스는 [빌드 구성에 지정된](#importing-swift-objective-c-libraries-to-kotlin) 패키지에 배치됩니다(미리 구성된 시스템 프레임워크의 경우 `platform.*` 패키지).

Kotlin 클래스 및 인터페이스의 이름은 Objective-C로 가져올 때 접두사가 붙습니다. 접두사는 프레임워크 이름에서 파생됩니다.

Objective-C는 프레임워크 내의 패키지를 지원하지 않습니다. Kotlin 컴파일러가 동일한 프레임워크 내에서 이름은 같지만 패키지가 다른 Kotlin 클래스를 발견하면 이름을 바꿉니다. 이 알고리즘은 아직 안정적이지 않으며 Kotlin 릴리스 간에 변경될 수 있습니다. 이를 방지하려면 프레임워크 내에서 충돌하는 Kotlin 클래스의 이름을 바꾸면 됩니다.

#### 강한 연결(Strong linking)

Kotlin 소스에서 Objective-C 클래스를 사용할 때마다 해당 클래스는 강하게 연결된 심볼(strongly linked symbol)로 표시됩니다. 결과물인 빌드 아티팩트는 관련 심볼을 강한 외부 참조(strong external references)로 언급합니다.

즉, 앱이 실행 중에 심볼을 동적으로 연결하려고 시도하며, 해당 심볼을 사용할 수 없는 경우 앱이 충돌합니다. 심볼이 전혀 사용되지 않았더라도 충돌이 발생합니다. 특정 기기나 OS 버전에서 심볼을 사용할 수 없는 경우가 있을 수 있습니다.

이 문제를 해결하고 "Symbol not found" 오류를 방지하려면, 클래스가 실제로 사용 가능한지 확인하는 Swift 또는 Objective-C 래퍼를 사용하세요. [Compose Multiplatform 프레임워크에서 이 해결 방법이 어떻게 구현되었는지 확인해 보세요](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files).

### 초기화 구문(Initializers)

Swift/Objective-C 초기화 구문은 Kotlin에서 생성자 또는 `create`라는 이름의 팩토리 메서드로 가져오기 됩니다. 후자의 경우는 Objective-C 카테고리 또는 Swift 확장(extension)에 선언된 초기화 구문에서 발생하는데, 이는 Kotlin에 확장 생성자라는 개념이 없기 때문입니다.

> Swift 초기화 구문을 Kotlin으로 가져오기 전에 `@objc` 어노테이션을 잊지 말고 추가하세요.
>
{style="tip"}

Kotlin 생성자는 Swift/Objective-C의 초기화 구문으로 가져오기 됩니다.

### 세터(Setters)

상위 클래스의 읽기 전용 프로퍼티를 재정의하는 쓰기 가능한 Objective-C 프로퍼티는 프로퍼티 `foo`에 대해 `setFoo()` 메서드로 표현됩니다. 프로토콜의 읽기 전용 프로퍼티가 가변(mutable)으로 구현된 경우에도 마찬가지입니다.

### 최상위 함수 및 프로퍼티(Top-level functions and properties)

최상위 Kotlin 함수 및 프로퍼티는 특수 클래스의 멤버로 액세스할 수 있습니다. 각 Kotlin 파일은 그러한 클래스로 번역됩니다. 예를 들어:

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

그런 다음 Swift에서 다음과 같이 `foo()` 함수를 호출할 수 있습니다.

```swift
MyLibraryUtilsKt.foo()
```

Kotlin-Swift interopedia에서 최상위 Kotlin 선언에 액세스하는 예제 모음을 참조하세요:

* [최상위 함수(Top-level functions)](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
* [최상위 읽기 전용 프로퍼티(Top-level read-only properties)](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
* [최상위 가변 프로퍼티(Top-level mutable properties)](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### 메서드 이름 번역(Method names translation)

일반적으로 Swift의 인수 레이블(argument labels)과 Objective-C의 셀렉터 조각(selector pieces)은 Kotlin 매개변수 이름에 매핑됩니다. 이 두 개념은 의미론적으로 다르기 때문에 가끔 Swift/Objective-C 메서드가 Kotlin 시그니처와 충돌하며 가져오기 될 수 있습니다. 이 경우 명명된 인수(named arguments)를 사용하여 Kotlin에서 충돌하는 메서드를 호출할 수 있습니다. 예를 들어:

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

Kotlin에서는 다음과 같습니다.

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

`kotlin.Any` 함수가 Swift/Objective-C에 매핑되는 방식은 다음과 같습니다:

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[Kotlin-Swift interopedia에서 데이터 클래스를 사용한 예제 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md).

[`@ObjCName` 어노테이션](#change-declaration-names)을 사용하여 Kotlin 선언의 이름을 바꾸는 대신 Swift 또는 Objective-C에서 더 관용적인 이름을 지정할 수 있습니다.

### 오류 및 예외(Errors and exceptions)

모든 Kotlin 예외는 언체크 예외(unchecked exceptions)이므로 런타임에 오류가 포착됩니다. 그러나 Swift에는 컴파일 타임에 처리되는 체크 예외(checked errors)만 있습니다. 따라서 Swift 또는 Objective-C 코드가 예외를 발생시키는 Kotlin 메서드를 호출하는 경우, Kotlin 메서드에 `@Throws` 어노테이션을 표시하고 "예상되는" 예외 클래스 목록을 지정해야 합니다.

Swift/Objective-C 프레임워크로 컴파일할 때, `@Throws` 어노테이션을 가지거나 상속받은 비 `suspend` 함수는 Objective-C에서 `NSError*`를 생성하는 메서드로, Swift에서는 `throws` 메서드로 표현됩니다. `suspend` 함수의 표현은 항상 완료 핸들러(completion handler)에 `NSError*`/`Error` 매개변수를 가집니다.

Swift/Objective-C 코드에서 호출된 Kotlin 함수가 `@Throws`로 지정된 클래스 중 하나 또는 그 하위 클래스의 인스턴스인 예외를 던지면, 해당 예외는 `NSError`로 전파됩니다. Swift/Objective-C에 도달하는 다른 Kotlin 예외는 처리되지 않은 것으로 간주되어 프로그램 종료를 유발합니다.

`suspend` 함수는 `@Throws`가 없어도 `CancellationException`만 (`NSError`로) 전파합니다. `@Throws`가 없는 비 `suspend` 함수는 Kotlin 예외를 전혀 전파하지 않습니다.

반대 방향의 번역은 아직 구현되지 않았습니다. 즉, Swift/Objective-C의 오류 발생 메서드는 Kotlin으로 예외 발생 메서드로 가져오기 되지 않습니다.

[Kotlin-Swift interopedia의 예제 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md).

### 열거형(Enums)

Kotlin 열거형은 Objective-C로 `@interface`로, Swift로는 `class`로 가져오기 됩니다. 이러한 데이터 구조에는 각 열거형 값에 해당하는 프로퍼티가 있습니다. 다음 Kotlin 코드를 살펴보세요:

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

Swift에서 다음과 같이 이 열거형 클래스의 프로퍼티에 액세스할 수 있습니다.

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

Swift의 `switch` 문에서 Kotlin 열거형 변수를 사용하려면 컴파일 오류를 방지하기 위해 default 문을 제공하세요.

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[Kotlin-Swift interopedia의 다른 예제 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md).

### 중단 함수(Suspending functions)

<primary-label ref="experimental-opt-in"/>

Kotlin의 [중단 함수](coroutines-basics.md)(`suspend`)는 생성된 Objective-C 헤더에서 콜백이 있는 함수 또는 Swift/Objective-C 용어로 [완료 핸들러(completion handlers)](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)가 있는 함수로 표시됩니다.

Swift 5.5부터 Kotlin의 `suspend` 함수는 완료 핸들러를 사용하지 않고 Swift에서 `async` 함수로 호출할 수도 있습니다. 현재 이 기능은 실험적 단계이며 특정 제한 사항이 있습니다. 자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47610)를 참조하세요.

* [Swift 문서의 `async`/`await` 메커니즘](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)에 대해 자세히 알아보세요.
* 동일한 기능을 구현하는 서드파티 라이브러리에 대한 예제와 권장 사항은 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md)를 참조하세요.

### 확장 및 카테고리 멤버(Extensions and category members)

Objective-C 카테고리와 Swift 확장의 멤버는 일반적으로 Kotlin으로 확장(extensions)으로 가져오기 됩니다. 따라서 이러한 선언은 Kotlin에서 재정의할 수 없으며, 확장 초기화 구문은 Kotlin 생성자로 사용할 수 없습니다.

> 현재 두 가지 예외가 있습니다. Kotlin 1.8.20부터 NSView 클래스(AppKit 프레임워크) 또는 UIView 클래스(UIKit 프레임워크)와 동일한 헤더에 선언된 카테고리 멤버는 이러한 클래스의 멤버로 가져오기 됩니다. 즉, NSView 또는 UIView를 상속하는 메서드를 재정의할 수 있습니다.
>
{style="note"}

"일반적인" Kotlin 클래스에 대한 Kotlin 확장은 각각 Swift의 확장 및 Objective-C의 카테고리 멤버로 가져오기 됩니다. 다른 타입에 대한 Kotlin 확장은 추가 수신자 매개변수가 있는 [최상위 선언](#top-level-functions-and-properties)으로 취급됩니다. 이러한 타입에는 다음이 포함됩니다:

* Kotlin `String` 타입
* Kotlin 컬렉션 타입 및 하위 타입
* Kotlin `interface` 타입
* Kotlin 원시 타입(primitive types)
* Kotlin `inline` 클래스
* Kotlin `Any` 타입
* Kotlin 함수 타입 및 하위 타입
* Objective-C 클래스 및 프로토콜

[Kotlin-Swift interopedia의 예제 모음 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions).

### Kotlin 싱글톤(Kotlin singletons)

Kotlin 싱글톤(`companion object`를 포함하여 `object` 선언으로 생성됨)은 단일 인스턴스를 가진 클래스로 Swift/Objective-C에 가져오기 됩니다.

인스턴스는 `shared` 및 `companion` 프로퍼티를 통해 사용할 수 있습니다.

다음 Kotlin 코드의 경우:

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

이 객체들에 다음과 같이 액세스합니다:

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> Objective-C에서 `[MySingleton mySingleton]`을 통해, Swift에서 `MySingleton()`을 통해 객체에 액세스하는 방식은 더 이상 사용되지 않습니다(deprecated).
> 
{style="note"}

Kotlin-Swift interopedia에서 더 많은 예제를 참조하세요:

* [`shared`를 사용하여 Kotlin 객체에 액세스하는 방법](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
* [Swift에서 Kotlin 컴패니언 객체의 멤버에 액세스하는 방법](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)

### 원시 타입(Primitive types)

Kotlin 원시 타입 박싱(boxing)은 특수 Swift/Objective-C 클래스에 매핑됩니다. 예를 들어, `kotlin.Int` 박스는 Swift에서 `KotlinInt` 클래스 인스턴스(또는 Objective-C에서 `${prefix}Int` 인스턴스, 여기서 `prefix`는 프레임워크 이름 접두사)로 표현됩니다. 이러한 클래스는 `NSNumber`에서 파생되므로, 인스턴스는 모든 해당 작업을 지원하는 적절한 `NSNumber`입니다.

`NSNumber` 타입은 Swift/Objective-C 매개변수 타입 또는 반환 값으로 사용될 때 Kotlin 원시 타입으로 자동 번역되지 않습니다. 그 이유는 `NSNumber` 타입이 래핑된 원시 값 타입에 대해 충분한 정보를 제공하지 않기 때문입니다. 예를 들어, `NSNumber`가 `Byte`, `Boolean` 또는 `Double`인지 정적으로 알 수 없습니다. 따라서 Kotlin 원시 값은 [`NSNumber`로/에서 수동으로 캐스팅](#casting-between-mapped-types)해야 합니다.

### 문자열(Strings)

Kotlin `String`이 Swift로 전달될 때, 먼저 Objective-C 객체로 노출된 다음, Swift 컴파일러가 Swift 변환을 위해 이를 한 번 더 복사합니다. 이로 인해 추가적인 런타임 오버헤드가 발생합니다.

이를 피하려면 Swift에서 Kotlin 문자열에 직접 Objective-C `NSString`으로 액세스하세요. [변환 예제](#see-the-conversion-example)를 참조하세요.

#### NSMutableString

`NSMutableString` Objective-C 클래스는 Kotlin에서 사용할 수 없습니다. 모든 `NSMutableString` 인스턴스는 Kotlin으로 전달될 때 복사됩니다.

### 컬렉션(Collections)

#### Kotlin -> Objective-C -> Swift

Kotlin 컬렉션이 Swift로 전달될 때, 먼저 Objective-C 동등물로 변환된 다음, Swift 컴파일러가 전체 컬렉션을 복사하여 [매핑 표](#mappings)에 설명된 대로 Swift 전용 컬렉션으로 변환합니다.

이 마지막 변환은 성능 비용을 초래합니다. 이를 방지하기 위해 Swift에서 Kotlin 컬렉션을 사용할 때는 `NSDictionary`, `NSArray` 또는 `NSSet`과 같은 Objective-C 대응물로 명시적으로 캐스팅하세요.

##### 변환 예제 보기 {initial-collapse-state="collapsed" collapsible="true"}

예를 들어, 다음과 같은 Kotlin 선언이 있다고 가정해 보겠습니다.

```kotlin
val map: Map<String, String>
```

Swift에서는 다음과 같이 보일 수 있습니다.

```Swift
map[key]?.count ?? 0
```

여기서 `map`은 Swift의 `Dictionary`로 암시적으로 변환되고, 그 문자열 값은 Swift의 `String`에 매핑됩니다. 이로 인해 성능 비용이 발생합니다.

변환을 피하려면 `map`을 Objective-C의 `NSDictionary`로 명시적으로 캐스팅하고 대신 `NSString`으로 값에 액세스하세요.

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

이렇게 하면 Swift 컴파일러가 추가 변환 단계를 수행하지 않도록 보장합니다.

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C 컬렉션은 `NSMutableSet` 및 `NSMutableDictionary`를 제외하고 [매핑 표](#mappings)에 설명된 대로 Kotlin으로 매핑됩니다.

`NSMutableSet`은 Kotlin의 `MutableSet`으로 변환되지 않습니다. Kotlin `MutableSet`에 객체를 전달하려면 이러한 종류의 Kotlin 컬렉션을 명시적으로 생성하세요. 이를 위해 예를 들어 Kotlin의 `mutableSetOf()` 함수를 사용하거나 Swift의 `KotlinMutableSet` 클래스 및 Objective-C의 `${prefix}MutableSet`(`prefix`는 프레임워크 이름 접두사)을 사용하세요. `MutableMap`에 대해서도 마찬가지입니다.

[Kotlin-Swift interopedia의 예제 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md).

### 함수 타입(Function types)

Kotlin 함수 타입 객체(예: 람다)는 Swift의 클로저(closures) 및 Objective-C의 블록(blocks)으로 변환됩니다.
[Kotlin-Swift interopedia에서 람다가 있는 Kotlin 함수 예제 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md).

그러나 함수와 함수 타입을 번역할 때 매개변수 및 반환 값의 타입이 매핑되는 방식에는 차이가 있습니다. 후자의 경우, 원시 타입은 박싱된 표현으로 매핑됩니다. Kotlin `Unit` 반환 값은 Swift/Objective-C에서 해당 `Unit` 싱글톤으로 표현됩니다. 이 싱글톤의 값은 다른 Kotlin `object`와 동일한 방식으로 가져올 수 있습니다. 위의 [매핑 표](#mappings)에서 싱글톤을 참조하세요.

다음 Kotlin 함수를 살펴보세요:

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

Swift에서는 다음과 같이 표현됩니다:

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

그리고 다음과 같이 호출할 수 있습니다.

```swift
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

#### Objective-C 블록 타입의 명시적 매개변수 이름
<primary-label ref="experimental-opt-in"/>

내보낸 Objective-C 헤더의 Kotlin 함수 타입에 명시적인 매개변수 이름을 추가할 수 있습니다. 그러면 Xcode의 자동 완성 기능이 Objective-C 블록에서 Objective-C 함수를 호출할 때 이러한 이름을 제안합니다. 이는 생성된 블록에서 Clang 경고를 피하는 데 도움이 됩니다.

명시적 매개변수 이름을 활성화하려면 `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 추가하세요.

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

예를 들어, 다음과 같은 Kotlin 코드는:

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin 함수 타입의 매개변수 이름을 Objective-C 블록 타입으로 전달하여 Xcode가 제안 사항에서 이를 사용할 수 있도록 합니다.

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

> 이 옵션은 Objective-C interop에만 영향을 미칩니다. Xcode에서 생성된 Objective-C 코드를 Objective-C로부터 호출할 때 적용되며, 일반적으로 Swift에서의 호출에는 영향을 미치지 않습니다.
>
{style="note"}

### 제네릭(Generics)

Objective-C는 클래스에 정의된 "경량 제네릭(lightweight generics)"을 지원하며 기능 세트는 비교적 제한적입니다. Swift는 클래스에 정의된 제네릭을 가져와 컴파일러에 추가 타입 정보를 제공할 수 있습니다.

Objective-C 및 Swift의 제네릭 기능 지원은 Kotlin과 다르므로 번역 시 필연적으로 일부 정보가 유실되지만, 지원되는 기능은 유의미한 정보를 유지합니다.

Swift에서 Kotlin 제네릭을 사용하는 방법에 대한 구체적인 예제는 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)를 참조하세요.

#### 제한 사항

Objective-C 제네릭은 Kotlin이나 Swift의 모든 기능을 지원하지 않으므로 번역 과정에서 일부 정보가 누락됩니다.

제네릭은 클래스에만 정의할 수 있으며, 인터페이스(Objective-C 및 Swift의 프로토콜)나 함수에는 정의할 수 없습니다.

#### 널 가능성(Nullability)

Kotlin과 Swift는 모두 타입 사양의 일부로 널 가능성(nullability)을 정의하는 반면, Objective-C는 타입의 메서드 및 프로퍼티에 널 가능성을 정의합니다. 따라서 다음과 같은 Kotlin 코드는:

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

Swift에서 다음과 같이 보입니다:

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

잠재적으로 널이 될 수 있는 타입을 지원하기 위해, Objective-C 헤더는 널 가능한 반환 값을 갖도록 `myVal`을 정의해야 합니다.

이를 완화하려면, 제네릭 타입이 _절대로_ null이 아니어야 하는 경우 제네릭 클래스를 정의할 때 null이 아닌 타입 제약 조건을 제공하세요.

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

이렇게 하면 Objective-C 헤더에서 `myVal`을 non-nullable로 표시하도록 강제합니다.

#### 변성(Variance)

Objective-C는 제네릭을 공변(covariant) 또는 반공변(contravariant)으로 선언할 수 있게 해줍니다. Swift는 변성(variance)을 지원하지 않습니다. Objective-C에서 오는 제네릭 클래스는 필요에 따라 강제 캐스팅될 수 있습니다.

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 제약 조건(Constraints)

Kotlin에서는 제네릭 타입에 대한 상한(upper bounds)을 제공할 수 있습니다. Objective-C도 이를 지원하지만, 복잡한 사례에서는 해당 지원을 사용할 수 없으며 현재 Kotlin - Objective-C interop에서는 지원되지 않습니다. 여기서 예외는 non-nullable 상한이 Objective-C 메서드/프로퍼티를 non-nullable로 만든다는 점입니다.

#### 비활성화 방법

프레임워크 헤더가 제네릭 없이 작성되도록 하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요.

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 전방 선언(Forward declarations)

전방 선언(forward declarations)을 가져오려면 `objcnames.classes` 및 `objcnames.protocols` 패키지를 사용하세요. 예를 들어, `library.package`가 있는 Objective-C 라이브러리에 선언된 `objcprotocolName` 전방 선언을 가져오려면 특수한 전방 선언 패키지를 사용하세요: `import objcnames.protocols.objcprotocolName`.

두 개의 objcinterop 라이브러리가 있다고 가정해 보겠습니다. 하나는 `objcnames.protocols.ForwardDeclaredProtocolProtocol`을 사용하고 다른 하나는 다른 패키지에 실제 구현이 있는 경우입니다:

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
// 헤더:
#import <Foundation/Foundation.h>
@protocol ForwardDeclaredProtocol
@end
// 구현:
@interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
@end

id<ForwardDeclaredProtocol> produceProtocol() {
    return [ForwardDeclaredProtocolImpl new];
}
```

두 라이브러리 간에 객체를 전달하려면 Kotlin 코드에서 명시적인 `as` 캐스트를 사용하세요.

```kotlin
// Kotlin 코드:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> 해당 실제 클래스에서만 `objcnames.protocols.ForwardDeclaredProtocolProtocol`로 캐스팅할 수 있습니다. 그렇지 않으면 오류가 발생합니다.
>
{style="note"}

## 매핑된 타입 간 캐스팅(Casting between mapped types)

Kotlin 코드를 작성할 때 객체를 Kotlin 타입에서 해당하는 Swift/Objective-C 타입으로 또는 그 반대로 변환해야 할 수도 있습니다. 이 경우 [`as` 캐스트](typecasts.md#unsafe-cast-operator)를 사용할 수 있습니다. 예를 들어:

```kotlin
@file:Suppress("CAST_NEVER_SUCCEEDS")
import platform.Foundation.*

val nsNumber = 42 as NSNumber
val nsArray = listOf(1, 2, 3) as NSArray
val nsString = "Hello" as NSString
val string = nsString as String
```

IDE에서 "This cast can never succeed" 경고를 잘못 표시할 수 있습니다. 그런 경우에는 `@Suppress("CAST_NEVER_SUCCEEDS")` 어노테이션을 사용하세요.

## 서브클래싱(Subclassing)

### Swift/Objective-C에서 Kotlin 클래스 및 인터페이스 서브클래싱하기

Kotlin 클래스 및 인터페이스는 Swift/Objective-C 클래스 및 프로토콜에 의해 서브클래싱될 수 있습니다.

### Kotlin에서 Swift/Objective-C 클래스 및 프로토콜 서브클래싱하기

Swift/Objective-C 클래스 및 프로토콜은 Kotlin `final` 클래스로 서브클래싱될 수 있습니다. Swift/Objective-C 타입을 상속하는 비 `final` Kotlin 클래스는 아직 지원되지 않으므로, Swift/Objective-C 타입을 상속하는 복잡한 클래스 계층 구조를 선언하는 것은 불가능합니다.

일반 메서드는 `override` Kotlin 키워드를 사용하여 재정의할 수 있습니다. 이 경우 재정의하는 메서드는 재정의되는 메서드와 동일한 매개변수 이름을 가져야 합니다.

`UIViewController`를 서브클래싱할 때와 같이 초기화 구문을 재정의해야 하는 경우가 있습니다. Kotlin 생성자로 가져온 초기화 구문은 `@OverrideInit` 어노테이션이 표시된 Kotlin 생성자에 의해 재정의될 수 있습니다.

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

재정의하는 생성자는 재정의되는 생성자와 동일한 매개변수 이름과 타입을 가져야 합니다.

충돌하는 Kotlin 시그니처를 가진 서로 다른 메서드를 재정의하려면 클래스에 `@ObjCSignatureOverride` 어노테이션을 추가할 수 있습니다. 이 어노테이션은 Objective-C 클래스에서 인수 타입은 같지만 인수 이름이 다른 여러 함수를 상속받는 경우, Kotlin 컴파일러가 충돌하는 오버로드를 무시하도록 지시합니다.

기본적으로 Kotlin/Native 컴파일러는 지정되지 않은(non-designated) Objective-C 초기화 구문을 `super()` 생성자로 호출하는 것을 허용하지 않습니다. Objective-C 라이브러리에 지정 초기화 구문(designated initializers)이 제대로 표시되지 않은 경우 이 동작이 불편할 수 있습니다. 이러한 컴파일러 검사를 비활성화하려면 라이브러리의 [`.def` 파일](native-definition-file.md)에 `disableDesignatedInitializerChecks = true`를 추가하세요.

## C 기능

라이브러리가 안전하지 않은 포인터(unsafe pointers), 구조체 등과 같은 일반 C 기능을 사용하는 예시는 [C와의 상호 운용성](native-c-interop.md)을 참조하세요.

## 지원되지 않음(Unsupported)

Kotlin 프로그래밍 언어의 일부 기능은 아직 Objective-C 또는 Swift의 해당 기능으로 매핑되지 않았습니다. 현재 다음 기능은 생성된 프레임워크 헤더에 제대로 노출되지 않습니다.

* 인라인 클래스 (인수는 기본 원시 타입 또는 `id`로 매핑됨)
* 표준 Kotlin 컬렉션 인터페이스(`List`, `Map`, `Set`)를 구현하는 사용자 정의 클래스 및 기타 특수 클래스
* Objective-C 클래스의 Kotlin 서브클래스