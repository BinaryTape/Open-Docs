[//]: # (title: Swift/Objective-C와의 상호 운용성)

> Objective-C 라이브러리 임포트는 [베타](native-c-interop-stability.md) 단계에 있습니다.
> cinterop 도구를 통해 Objective-C 라이브러리에서 생성된 모든 Kotlin 선언은
> `@ExperimentalForeignApi` 어노테이션을 포함해야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는
> 일부 API에 대해서만 옵트인(opt-in)이 필요합니다.
>
{style="note"}

Kotlin/Native는 Objective-C를 통해 Swift와의 간접적인 상호 운용성을 제공합니다. 이 문서에서는 Swift/Objective-C 코드에서 Kotlin
선언을 사용하는 방법과 Kotlin 코드에서 Objective-C 선언을 사용하는 방법을 다룹니다.

유용하다고 생각할 만한 다른 자료:

* Swift 코드에서 Kotlin 선언을 사용하는 방법에 대한 예제 모음인 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia).
* Kotlin의 트레이싱 GC와 Objective-C의 ARC 간의 통합 세부 정보를 다루는 [Swift/Objective-C ARC 통합](native-arc-integration.md) 섹션.

## Kotlin으로 Swift/Objective-C 라이브러리 임포트

Objective-C 프레임워크와 라이브러리는 빌드에 제대로 임포트되면 Kotlin 코드에서 사용할 수 있습니다(시스템 프레임워크는 기본적으로 임포트됨).
자세한 내용은 다음을 참조하세요:

* [라이브러리 정의 파일 생성 및 구성](native-definition-file.md)
* [네이티브 라이브러리 컴파일 구성](https://kotlinlang.org/docs/multiplatform/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

Swift 라이브러리는 `@objc`를 사용하여 API가 Objective-C로 익스포트(export)되는 경우 Kotlin 코드에서 사용할 수 있습니다.
순수 Swift 모듈은 아직 지원되지 않습니다.

## Swift/Objective-C에서 Kotlin 사용

Kotlin 모듈은 프레임워크로 컴파일되면 Swift/Objective-C 코드에서 사용할 수 있습니다:

* 바이너리를 선언하는 방법은 [최종 네이티브 바이너리 빌드](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html#declare-binaries)를 참조하세요.
* 예제는 [Kotlin Multiplatform 샘플 프로젝트](https://github.com/Kotlin/kmm-basic-sample)를 확인하세요.

### Objective-C 및 Swift에서 Kotlin 선언 숨기기

<primary-label ref="experimental-opt-in"/>

Kotlin 코드를 Swift/Objective-C 친화적으로 만들려면 `@HiddenFromObjC` 어노테이션을 사용하여 Kotlin 선언을
Objective-C 및 Swift에서 숨기세요. 이 어노테이션은 함수 또는 프로퍼티의 Objective-C 익스포트(export)를 비활성화합니다.

대신, `internal` 한정자(modifier)로 Kotlin 선언을 마크하여 컴파일 모듈 내에서의
가시성(visibility)을 제한할 수 있습니다. `@HiddenFromObjC`는 다른 Kotlin 모듈에는 보이게 하면서
Objective-C 및 Swift에서 Kotlin 선언을 숨기려는 경우에 사용하세요.

[Kotlin-Swift interopedia에서 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md).

### Swift에서 리파이닝(Refining) 사용

<primary-label ref="experimental-opt-in"/>

`@ShouldRefineInSwift`는 Kotlin 선언을 Swift로 작성된 래퍼(wrapper)로 대체하는 데 도움을 줍니다. 이 어노테이션은
생성된 Objective-C API에서 함수 또는 프로퍼티를 `swift_private`로 마크합니다. 이러한 선언에는 `__` 접두사가 붙어
Swift에서 보이지 않게 됩니다.

여전히 Swift 코드에서 이러한 선언을 사용하여 Swift 친화적인 API를 생성할 수 있지만, Xcode 자동 완성(autocomplete)에는
제안되지 않습니다.

* Swift에서 Objective-C 선언을 리파이닝하는 방법에 대한 자세한 내용은 [공식 Apple 문서](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)를 참조하세요.
* `@ShouldRefineInSwift` 어노테이션을 사용하는 방법에 대한 예시는 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)를 참조하세요.

### 선언 이름 변경

<primary-label ref="experimental-opt-in"/>

Kotlin 선언의 이름 변경을 피하려면 `@ObjCName` 어노테이션을 사용하세요. 이 어노테이션은 Kotlin 컴파일러에게
어노테이션이 붙은 클래스, 인터페이스 또는 다른 Kotlin 엔티티에 대해 사용자 지정 Objective-C 및 Swift 이름을 사용하도록 지시합니다:

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// Usage with the ObjCName annotations
let array = MySwiftArray()
let index = array.index(of: "element")
```

[Kotlin-Swift interopedia에서 다른 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md).

### KDoc 주석으로 문서화 제공

문서화는 모든 API를 이해하는 데 필수적입니다. 공유 Kotlin API에 대한 문서를 제공하면 사용법, 해야 할 일과 하지 말아야 할 일 등에 대해 사용자에게 전달할 수 있습니다.

생성된 Objective-C 헤더에서 [KDoc](kotlin-doc.md) 주석은 Kotlin 코드에서 해당하는 Objective-C 주석으로 번역됩니다.
예를 들어, KDoc이 포함된 다음 Kotlin 코드는:

```kotlin
/**
 * 인수의 합계를 출력합니다.
 * 합계가 32비트 정수에 맞지 않는 경우를 적절하게 처리합니다.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

해당 주석이 포함된 Objective-C 헤더를 생성합니다:

```objc
/**
 * 인수의 합계를 출력합니다.
 * 합계가 32비트 정수에 맞지 않는 경우를 적절하게 처리합니다.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDoc 주석은 klib에 임베드되어 klib에서 생성된 Apple 프레임워크로 추출됩니다. 결과적으로 클래스 및 메서드에 대한 주석은 예를 들어 Xcode에서 자동 완성(autocompletion) 중에 나타납니다. `.h` 파일의 함수 정의로 이동하면 `@param`, `@return` 및 유사한 태그에 대한 주석을 볼 수 있습니다.

알려진 제한 사항:

* 종속성 문서화는 `-Xexport-kdoc` 옵션으로 컴파일되지 않는 한 내보내기(export)되지 않습니다. 이 컴파일러 옵션으로 컴파일된 라이브러리는 다른 컴파일러 버전과 호환되지 않을 수 있습니다.
* KDoc 주석은 대부분 그대로 내보내기(export)되지만, `@property`와 같은 많은 KDoc 블록 태그는 지원되지 않습니다.

필요한 경우, Gradle 빌드 파일의 `binaries {}` 블록에서 klib에 포함된 KDoc 주석이 생성된 Apple 프레임워크로 내보내지는 것을 비활성화할 수 있습니다:

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

## 매핑

아래 표는 Kotlin 개념이 Swift/Objective-C로 어떻게 매핑되는지, 그리고 그 반대의 경우도 보여줍니다.

"->" 및 "<-"는 매핑이 단방향으로만 진행됨을 나타냅니다.

| Kotlin                 | Swift                            | Objective-C                      | Notes                                                                              |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [note](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [note](#initializers)                                                              |
| Property               | Property                         | Property                         | [note 1](#top-level-functions-and-properties), [note 2](#setters)                  |
| Method                 | Method                           | Method                           | [note 1](#top-level-functions-and-properties), [note 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [note](#enums)                                                                     |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [note 1](#errors-and-exceptions), [note 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [note](#errors-and-exceptions)                                                     |
| Extension              | Extension                        | Category member                  | [note](#extensions-and-category-members)                                           |
| `companion` member <-  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| Singleton              | `shared` or `companion` property | `shared` or `companion` property | [note](#kotlin-singletons)                                                         |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [note](#primitive-types)                                                           |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       | [note](#strings)                                                                   |
| `String`               | `NSMutableString`                | `NSMutableString`                | [note](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [note](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [note](#collections)                                                               |
| Function type          | Function type                    | Block pointer type               | [note](#function-types)                                                            |
| Inline classes         | Unsupported                      | Unsupported                      | [note](#unsupported)                                                               |

### 클래스

#### 이름 변환

Objective-C 클래스는 원래 이름으로 Kotlin으로 임포트됩니다. 프로토콜은 `Protocol` 이름 접미사가 붙은 인터페이스로 임포트됩니다(예: `@protocol Foo` -> `interface FooProtocol`).
이러한 클래스 및 인터페이스는 [빌드 구성에 지정된](#importing-swift-objective-c-libraries-to-kotlin) 패키지(`platform.*` 패키지는 사전 구성된 시스템 프레임워크용)에 배치됩니다.

Kotlin 클래스 및 인터페이스의 이름은 Objective-C로 임포트될 때 접두사가 붙습니다. 접두사는 프레임워크 이름에서 파생됩니다.

Objective-C는 프레임워크 내에서 패키지를 지원하지 않습니다. Kotlin 컴파일러가 동일한 프레임워크 내에서 이름은 같지만
패키지가 다른 Kotlin 클래스를 발견하면 이름을 변경합니다. 이 알고리즘은 아직 안정적이지 않으며 Kotlin 릴리스 간에
변경될 수 있습니다. 이를 해결하려면 프레임워크 내의 충돌하는 Kotlin 클래스 이름을 변경할 수 있습니다.

#### 강력한 링크

Kotlin 소스에서 Objective-C 클래스를 사용할 때마다 강력하게 링크된 심볼로 마크됩니다. 결과 빌드
아티팩트(artifact)에는 관련 심볼이 강력한 외부 참조로 언급됩니다.

이는 앱이 실행 중 동적으로 심볼을 링크하려고 시도하며, 사용할 수 없는 경우 앱이 충돌한다는 의미입니다. 심볼이 한 번도 사용되지 않았더라도
충돌이 발생할 수 있습니다. 심볼이 특정 기기 또는 OS 버전에서 사용할 수 없을 수도 있습니다.

이 문제를 해결하고 "Symbol not found" 오류를 방지하려면 클래스가 실제로 사용 가능한지 확인하는 Swift 또는 Objective-C 래퍼(wrapper)를 사용하세요.
[Compose Multiplatform 프레임워크에서 이 해결 방법이 어떻게 구현되었는지 확인하세요](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files).

### 이니셜라이저

Swift/Objective-C 이니셜라이저는 Kotlin으로 생성자(constructor) 또는 `create`라는 이름의 팩토리 메서드(factory method)로 임포트됩니다.
후자는 Kotlin에 확장 생성자(extension constructor) 개념이 없기 때문에 Objective-C 카테고리 또는 Swift 확장으로 선언된 이니셜라이저에서 발생합니다.

> Swift 이니셜라이저를 Kotlin으로 임포트하기 전에 `@objc`로 어노테이션을 붙이는 것을 잊지 마세요.
>
{style="tip"}

Kotlin 생성자는 Swift/Objective-C로 이니셜라이저로 임포트됩니다.

### 세터

슈퍼클래스의 읽기 전용 프로퍼티를 오버라이드하는 쓰기 가능한 Objective-C 프로퍼티는 프로퍼티 `foo`에 대한 `setFoo()` 메서드로 표현됩니다.
변경 가능한(mutable) 것으로 구현된 프로토콜의 읽기 전용 프로퍼티도 마찬가지입니다.

### 최상위 함수 및 프로퍼티

최상위 Kotlin 함수와 프로퍼티는 특수 클래스의 멤버로 접근할 수 있습니다.
각 Kotlin 파일은 그러한 클래스로 변환됩니다. 예를 들면:

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

그런 다음 Swift에서 `foo()` 함수를 다음과 같이 호출할 수 있습니다:

```swift
MyLibraryUtilsKt.foo()
```

Kotlin-Swift interopedia에서 최상위 Kotlin 선언에 접근하는 예제 모음을 확인하세요:

* [최상위 함수](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
* [최상위 읽기 전용 프로퍼티](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
* [최상위 변경 가능한 프로퍼티](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### 메서드 이름 변환

일반적으로 Swift 인수 레이블(argument label)과 Objective-C 셀렉터 조각(selector piece)은 Kotlin 매개변수 이름으로 매핑됩니다. 이 두 개념은
의미론(semantics)이 다르므로, 때때로 Swift/Objective-C 메서드가 충돌하는 Kotlin 시그니처로 임포트될 수 있습니다.
이 경우, 충돌하는 메서드는 Kotlin에서 이름 있는 인수(named argument)를 사용하여 호출할 수 있습니다. 예를 들면:

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

Kotlin에서는 다음과 같습니다:

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

다음은 `kotlin.Any` 함수가 Swift/Objective-C에 매핑되는 방식입니다:

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[Kotlin-Swift interopedia에서 데이터 클래스 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md).

[`@ObjCName` 어노테이션](#change-declaration-names)으로 Kotlin 선언의 이름을 변경하는 대신 Swift 또는 Objective-C에서
더 관용적인 이름을 지정할 수 있습니다.

### 오류 및 예외

모든 Kotlin 예외는 비검사(unchecked) 예외이며, 이는 오류가 런타임에 포착됨을 의미합니다. 그러나 Swift는 컴파일 타임에
처리되는 검사(checked) 예외만 가집니다. 따라서 Swift 또는 Objective-C 코드가 예외를 던지는(throw) Kotlin 메서드를
호출하는 경우, Kotlin 메서드는 "예상되는" 예외 클래스 목록을 지정하는 `@Throws` 어노테이션으로 마크되어야 합니다.

Swift/Objective-C 프레임워크로 컴파일할 때, `@Throws` 어노테이션을 가지거나 상속하는 비-`suspend` 함수는 Objective-C에서는
`NSError*`-생성 메서드로, Swift에서는 `throws` 메서드로 표현됩니다. `suspend` 함수에 대한 표현은 항상 완료 핸들러(completion handler)에
`NSError*`/`Error` 매개변수를 가집니다.

Swift/Objective-C 코드에서 호출된 Kotlin 함수가 `@Throws`로 지정된 클래스 중 하나 또는 해당 서브클래스의 인스턴스인 예외를 던지는 경우,
해당 예외는 `NSError`로 전파됩니다. Swift/Objective-C에 도달하는 다른 Kotlin 예외는 처리되지 않은 것으로 간주되어 프로그램 종료를 유발합니다.

`suspend` 함수는 `@Throws` 없이 `CancellationException`만 전파합니다(`NSError`로). `@Throws`가 없는
비-`suspend` 함수는 Kotlin 예외를 전혀 전파하지 않습니다.

반대 방향의 역변환은 아직 구현되지 않았습니다. 즉, Swift/Objective-C 오류 던지기(error-throwing) 메서드는 예외 던지기(exception-throwing)로 Kotlin에 임포트되지 않습니다.

[Kotlin-Swift interopedia에서 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md).

### Enum

Kotlin enum은 Objective-C로는 `@interface`로, Swift로는 `class`로 임포트됩니다.
이러한 데이터 구조는 각 enum 값에 해당하는 프로퍼티를 가집니다. 다음 Kotlin 코드를 고려해 보세요:

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

Swift에서 이 enum 클래스의 프로퍼티에 다음과 같이 접근할 수 있습니다:

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

Swift `switch` 문에서 Kotlin enum 변수를 사용하려면 컴파일 오류를 방지하기 위해 `default` 문을 제공해야 합니다:

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[Kotlin-Swift interopedia에서 다른 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md).

### 중단(Suspending) 함수

<primary-label ref="experimental-opt-in"/>

Kotlin의 [중단 함수](coroutines-basics.md) (`suspend`)는 생성된 Objective-C 헤더에서 콜백을 가진 함수 또는
Swift/Objective-C 용어로는 [완료 핸들러](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)로 표현됩니다.

Swift 5.5부터 Kotlin의 `suspend` 함수는 완료 핸들러(completion handler)를 사용하지 않고도 Swift에서 `async` 함수로 호출할 수 있습니다.
현재 이 기능은 매우 실험적이며 특정 제한 사항이 있습니다. 자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47610)를 참조하세요.

* Swift 문서에서 [`async`/`await` 메커니즘](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)에 대해 자세히 알아보세요.
* 동일한 기능을 구현하는 서드파티 라이브러리에 대한 예시 및 권장 사항은 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md)를 참조하세요.

### 확장(Extension) 및 카테고리 멤버

Objective-C 카테고리 및 Swift 확장의 멤버는 일반적으로 Kotlin으로 확장으로 임포트됩니다. 그렇기 때문에 이 선언은 Kotlin에서
오버라이드될 수 없으며, 확장 이니셜라이저는 Kotlin 생성자로 사용할 수 없습니다.

> 현재 두 가지 예외가 있습니다. Kotlin 1.8.20부터 NSView 클래스(AppKit 프레임워크) 또는 UIView 클래스(UIKit 프레임워크)와 동일한 헤더에 선언된 카테고리 멤버는
> 해당 클래스의 멤버로 임포트됩니다. 이는 NSView 또는 UIView에서 서브클래스(subclass)하는 메서드를 오버라이드할 수 있음을 의미합니다.
>
{style="note"}

"일반" Kotlin 클래스에 대한 Kotlin 확장은 Swift 및 Objective-C로 각각 확장 및 카테고리 멤버로 임포트됩니다.
다른 유형에 대한 Kotlin 확장은 추가 수신기(receiver) 매개변수를 가진 [최상위 선언](#top-level-functions-and-properties)으로 처리됩니다.
이러한 유형에는 다음이 포함됩니다:

* Kotlin `String` 유형
* Kotlin 컬렉션 유형 및 서브타입
* Kotlin `interface` 유형
* Kotlin 원시(primitive) 유형
* Kotlin `inline` 클래스
* Kotlin `Any` 유형
* Kotlin 함수 유형 및 서브타입
* Objective-C 클래스 및 프로토콜

[Kotlin-Swift interopedia에서 예제 모음 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions).

### Kotlin 싱글톤

Kotlin 싱글톤(`object` 선언으로 생성, `companion object` 포함)은 단일 인스턴스를 가진 클래스로 Swift/Objective-C로 임포트됩니다.

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

다음과 같이 이 객체에 접근하세요:

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> Objective-C에서 `[MySingleton mySingleton]`를 통해 객체에 접근하거나 Swift에서 `MySingleton()`을 통해 객체에 접근하는 것은 더 이상 사용되지 않습니다.
>
{style="note"}

Kotlin-Swift interopedia에서 더 많은 예시를 확인하세요:

* [`shared`를 사용하여 Kotlin 객체에 접근하는 방법](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
* [Swift에서 Kotlin `companion object`의 멤버에 접근하는 방법](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md).

### 원시(Primitive) 타입

Kotlin 원시(primitive) 타입 박스(box)는 특수 Swift/Objective-C 클래스로 매핑됩니다. 예를 들어, `kotlin.Int` 박스는
Swift에서는 `KotlinInt` 클래스 인스턴스로(Objective-C에서는 `${prefix}Int` 인스턴스, 여기서 `prefix`는 프레임워크의 이름 접두사),
표현됩니다. 이 클래스들은 `NSNumber`에서 파생되었으므로, 인스턴스는 모든 해당 연산을 지원하는 적절한 `NSNumber`입니다.

`NSNumber` 타입은 Swift/Objective-C 매개변수 타입 또는 반환 값으로 사용될 때 Kotlin 원시 타입으로 자동 변환되지 않습니다.
그 이유는 `NSNumber` 타입이 래핑된 원시 값 타입에 대한 충분한 정보를 제공하지 않기 때문입니다(예: `NSNumber`는 정적으로
`Byte`, `Boolean` 또는 `Double`인지 알 수 없습니다). 따라서 Kotlin 원시 값은 `NSNumber`로
[수동으로 형변환(cast)되어야 합니다](#casting-between-mapped-types).

### 문자열(String)

Kotlin `String`이 Swift로 전달될 때, 먼저 Objective-C 객체로 익스포트(export)된 다음, Swift 컴파일러가 Swift 변환을 위해
한 번 더 복사합니다. 이로 인해 추가적인 런타임 오버헤드가 발생합니다.

이를 피하려면 Swift에서 Kotlin 문자열을 Objective-C `NSString`로 직접 접근해야 합니다.
[변환 예시](#see-the-conversion-example)를 참조하세요.

#### NSMutableString

`NSMutableString` Objective-C 클래스는 Kotlin에서 사용할 수 없습니다.
`NSMutableString`의 모든 인스턴스는 Kotlin으로 전달될 때 복사됩니다.

### 컬렉션(Collection)

#### Kotlin -> Objective-C -> Swift

Kotlin 컬렉션이 Swift로 전달될 때, 먼저 Objective-C 동등한(equivalent) 형태로 변환된 다음, Swift 컴파일러가
전체 컬렉션을 복사하여 [매핑 테이블](#mappings)에 설명된 대로 Swift 네이티브 컬렉션으로 변환합니다.

이 마지막 변환은 성능 저하를 초래합니다. 이를 방지하려면 Swift에서 Kotlin 컬렉션을 사용할 때 명시적으로
Objective-C에 해당하는 `NSDictionary`, `NSArray`, `NSSet` 등으로 형변환(cast)해야 합니다.

##### 변환 예시 보기 {initial-collapse-state="collapsed" collapsible="true"}

예를 들어, 다음 Kotlin 선언은:

```kotlin
val map: Map<String, String>
```

Swift에서는 다음과 같이 보일 수 있습니다:

```Swift
map[key]?.count ?? 0
```

여기서 `map`은 Swift의 `Dictionary`로 암시적으로 변환되며, 문자열 값은 Swift의 `String`으로 매핑됩니다.
이는 성능 저하를 초래합니다.

변환을 피하려면 `map`을 Objective-C의 `NSDictionary`로 명시적으로 형변환(cast)하고 값을 `NSString`으로 접근해야 합니다:

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

이렇게 하면 Swift 컴파일러가 추가 변환 단계를 수행하지 않습니다.

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C 컬렉션은 `NSMutableSet` 및 `NSMutableDictionary`를 제외하고 [매핑 테이블](#mappings)에 설명된 대로 Kotlin으로 매핑됩니다.

`NSMutableSet`은 Kotlin의 `MutableSet`으로 변환되지 않습니다. Kotlin `MutableSet`으로 객체를 전달하려면 이러한 종류의 Kotlin 컬렉션을
명시적으로 생성해야 합니다. 예를 들어, Kotlin에서는 `mutableSetOf()` 함수를 사용하고 Swift에서는 `KotlinMutableSet` 클래스를,
Objective-C에서는 `${prefix}MutableSet`을 사용하세요(`prefix`는 프레임워크 이름 접두사). `MutableMap`도 마찬가지입니다.

[Kotlin-Swift interopedia에서 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md).

### 함수 타입

Kotlin 함수 타입 객체(예: 람다)는 Swift에서는 클로저(closure)로, Objective-C에서는 블록으로 변환됩니다.
[Kotlin-Swift interopedia에서 람다를 사용하는 Kotlin 함수의 예시를 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md).

그러나 함수와 함수 타입을 번역할 때 매개변수와 반환 값의 타입이 매핑되는 방식에는 차이가 있습니다.
후자의 경우, 원시 타입은 박스화된 표현으로 매핑됩니다. Kotlin `Unit` 반환 값은 Swift/Objective-C에서 해당 `Unit` 싱글톤으로 표현됩니다.
이 싱글톤의 값은 다른 Kotlin `object`와 동일한 방식으로 검색할 수 있습니다. 위 [표](#mappings)의 싱글톤을 참조하세요.

다음 Kotlin 함수를 고려해 보세요:

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

Swift에서는 다음과 같이 표현됩니다:

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

그리고 다음과 같이 호출할 수 있습니다:

```swift
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

#### Objective-C 블록 타입의 명시적 매개변수 이름

내보내기된(exported) Objective-C 헤더의 Kotlin 함수 타입에 명시적 매개변수 이름을 추가할 수 있습니다. 이름이 없으면
Xcode의 자동 완성 기능은 Objective-C 블록에서 매개변수 이름이 없는 Objective-C 함수 호출을 제안하며, 생성된 블록은 Clang 경고를 유발합니다.

명시적 매개변수 이름을 활성화하려면 `gradle.properties` 파일에 다음 [바이너리 옵션](native-binary-options.md)을 추가하세요:

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=true
```

예를 들어, 다음 Kotlin 코드의 경우:

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin은 Kotlin 함수 타입의 매개변수 이름을 Objective-C 블록 타입으로 전달하여 Xcode가 제안에서 이를 사용할 수 있도록 합니다:

```objc
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

> 이 옵션은 Objective-C 상호 운용성에만 영향을 미칩니다. Xcode에서 Objective-C로부터 생성된 Objective-C 코드를 호출할 때 적용되며,
> 일반적으로 Swift로부터의 호출에는 영향을 미치지 않습니다.
>
{style="note"}

### 제네릭(Generics)

Objective-C는 클래스에 정의된 "경량 제네릭(lightweight generics)"을 지원하지만, 기능 집합이 비교적 제한적입니다. Swift는 클래스에 정의된
제네릭을 임포트하여 컴파일러에 추가 타입 정보를 제공하는 데 도움을 줄 수 있습니다.

Objective-C 및 Swift의 제네릭 기능 지원은 Kotlin과 다르므로, 변환 시 일부 정보가 필연적으로 손실되지만, 지원되는 기능은 의미 있는 정보를 유지합니다.

Swift에서 Kotlin 제네릭을 사용하는 방법에 대한 구체적인 예시는 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)를 참조하세요.

#### 제한 사항

Objective-C 제네릭은 Kotlin이나 Swift의 모든 기능을 지원하지 않으므로, 변환 시 일부 정보가 손실됩니다.

제네릭은 클래스에만 정의할 수 있으며, 인터페이스(Objective-C 및 Swift의 프로토콜) 또는 함수에는 정의할 수 없습니다.

#### Null 허용 여부(Nullability)

Kotlin과 Swift는 모두 null 허용 여부(nullability)를 타입 지정의 일부로 정의하는 반면, Objective-C는 타입의 메서드 및 프로퍼티에
null 허용 여부를 정의합니다. 따라서 다음 Kotlin 코드는:

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

Swift에서는 다음과 같이 보입니다:

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

잠재적으로 null을 허용하는 타입을 지원하려면 Objective-C 헤더에서 `myVal`을 null을 허용하는 반환 값으로 정의해야 합니다.

이를 완화하기 위해 제네릭 타입을 정의할 때 제네릭 타입이 _절대_ null이 아니어야 한다면 null을 허용하지 않는 타입 제약 조건(constraint)을 제공하세요:

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

이렇게 하면 Objective-C 헤더가 `myVal`을 null을 허용하지 않는 것으로 마크하도록 강제합니다.

#### 분산(Variance)

Objective-C는 제네릭을 공변(covariant) 또는 반공변(contravariant)으로 선언할 수 있도록 허용합니다. Swift는 분산(variance)을 지원하지 않습니다.
Objective-C에서 오는 제네릭 클래스는 필요에 따라 강제 형변환(force-cast)할 수 있습니다.

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 제약 조건(Constraints)

Kotlin에서는 제네릭 타입에 대한 상위 바운드(upper bounds)를 제공할 수 있습니다. Objective-C도 이를 지원하지만, 더 복잡한 경우에는
지원되지 않으며 현재 Kotlin-Objective-C 상호 운용성에서는 지원되지 않습니다. 여기서 예외는 null을 허용하지 않는 상위 바운드가
Objective-C 메서드/프로퍼티를 null을 허용하지 않는 것으로 만들 것입니다.

#### 비활성화

프레임워크 헤더가 제네릭 없이 작성되도록 하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 전방 선언(Forward declarations)

전방 선언을 임포트하려면 `objcnames.classes` 및 `objcnames.protocols` 패키지를 사용하세요. 예를 들어, `library.package`를 가진
Objective-C 라이브러리에 선언된 `objcprotocolName` 전방 선언을 임포트하려면 특수 전방 선언 패키지인
`import objcnames.protocols.objcprotocolName`를 사용하세요.

두 개의 objcinterop 라이브러리를 고려해 보세요. 하나는 `objcnames.protocols.ForwardDeclaredProtocolProtocol`을 사용하고
다른 하나는 다른 패키지에 실제 구현이 있습니다:

```ObjC
// First objcinterop library
#import <Foundation/Foundation.h>

@protocol ForwardDeclaredProtocol;

NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
    return [NSString stringWithUTF8String:"Protocol"];
}
```

```ObjC
// Second objcinterop library
// Header:
#import <Foundation/Foundation.h>
@protocol ForwardDeclaredProtocol
@end
// Implementation:
@interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
@end

id<ForwardDeclaredProtocol> produceProtocol() {
    return [ForwardDeclaredProtocolImpl new];
}
```

두 라이브러리 간에 객체를 전송하려면 Kotlin 코드에서 명시적인 `as` 형변환(cast)을 사용하세요:

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> 해당 실제 클래스에서만 `objcnames.protocols.ForwardDeclaredProtocolProtocol`로 형변환(cast)할 수 있습니다.
> 그렇지 않으면 오류가 발생합니다.
>
{style="note"}

## 매핑된 타입 간의 형변환(Casting)

Kotlin 코드를 작성할 때, 객체가 Kotlin 타입에서 동등한 Swift/Objective-C 타입으로(또는 그 반대로) 변환되어야 할 수 있습니다.
이 경우 일반적인 Kotlin 형변환(cast)을 사용할 수 있습니다. 예를 들면:

```kotlin
@file:Suppress("CAST_NEVER_SUCCEEDS")
import platform.Foundation.*

val nsNumber = 42 as NSNumber
val nsArray = listOf(1, 2, 3) as NSArray
val nsString = "Hello" as NSString
val string = nsString as String
```

IDE는 "이 형변환은 절대로 성공할 수 없습니다" 경고를 잘못 발행할 수 있습니다.
이런 경우, `@Suppress("CAST_NEVER_SUCCEEDS")` 어노테이션을 사용하세요.

## 서브클래싱(Subclassing)

### Swift/Objective-C에서 Kotlin 클래스 및 인터페이스 서브클래싱

Kotlin 클래스 및 인터페이스는 Swift/Objective-C 클래스 및 프로토콜에 의해 서브클래싱될 수 있습니다.

### Kotlin에서 Swift/Objective-C 클래스 및 프로토콜 서브클래싱

Swift/Objective-C 클래스 및 프로토콜은 Kotlin `final` 클래스로 서브클래싱될 수 있습니다. 비-`final` Kotlin 클래스가
Swift/Objective-C 타입을 상속하는 것은 아직 지원되지 않으므로, Swift/Objective-C 타입을 상속하는 복잡한 클래스 계층 구조를
선언하는 것은 불가능합니다.

일반 메서드는 Kotlin `override` 키워드를 사용하여 오버라이드될 수 있습니다. 이 경우, 오버라이드하는 메서드는 오버라이드된 메서드와
동일한 매개변수 이름을 가져야 합니다.

때로는 이니셜라이저를 오버라이드해야 할 필요가 있습니다. 예를 들어 `UIViewController`를 서브클래싱할 때입니다.
Kotlin 생성자로 임포트된 이니셜라이저는 `@OverrideInit` 어노테이션으로 마크된 Kotlin 생성자에 의해 오버라이드될 수 있습니다:

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

오버라이드하는 생성자는 오버라이드된 생성자와 동일한 매개변수 이름과 타입을 가져야 합니다.

충돌하는 Kotlin 시그니처를 가진 다른 메서드를 오버라이드하려면 클래스에 `@ObjCSignatureOverride` 어노테이션을 추가할 수 있습니다.
이 어노테이션은 Objective-C 클래스에서 동일한 인수 타입이지만 다른 인수 이름을 가진 여러 함수가 상속되는 경우, Kotlin 컴파일러에게
충돌하는 오버로드(overload)를 무시하도록 지시합니다.

기본적으로 Kotlin/Native 컴파일러는 비지정 Objective-C 이니셜라이저를 `super()` 생성자로 호출하는 것을 허용하지 않습니다.
이 동작은 Objective-C 라이브러리에서 지정된 이니셜라이저가 제대로 마크되지 않은 경우 불편할 수 있습니다.
이러한 컴파일러 검사를 비활성화하려면 라이브러리의 [`.def` 파일](native-definition-file.md)에 `disableDesignatedInitializerChecks = true`를 추가하세요.

## C 기능

라이브러리가 안전하지 않은(unsafe) 포인터, 구조체(struct) 등 일부 일반 C 기능을 사용하는 경우의 예시는 [C와의 상호 운용성](native-c-interop.md)을 참조하세요.

## 지원되지 않음

Kotlin 프로그래밍 언어의 일부 기능은 아직 Objective-C 또는 Swift의 해당 기능으로 매핑되지 않았습니다.
현재, 생성된 프레임워크 헤더에서 다음 기능은 제대로 노출되지 않습니다:

* 인라인(Inline) 클래스(인수는 기본 원시 타입 또는 `id`로 매핑됨)
* 표준 Kotlin 컬렉션 인터페이스(`List`, `Map`, `Set`) 및 기타 특수 클래스를 구현하는 사용자 지정 클래스
* Objective-C 클래스의 Kotlin 서브클래스