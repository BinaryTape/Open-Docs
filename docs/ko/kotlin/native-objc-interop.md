[//]: # (title: Swift/Objective-C와의 상호 운용)

> Objective-C 라이브러리 import는 [실험적 기능](components-stability.md#stability-levels-explained)입니다.
> cinterop 도구를 통해 Objective-C 라이브러리에서 생성된 모든 Kotlin 선언에는
> `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.
>
> Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(Foundation, UIKit, POSIX 등)는
> 일부 API에 대해서만 옵트인이 필요합니다.
>
{style="warning"}

Kotlin/Native는 Objective-C를 통해 Swift와의 간접적인 상호 운용을 제공합니다. 이 문서에서는 Swift/Objective-C 코드에서 Kotlin
선언을 사용하고 Kotlin 코드에서 Objective-C 선언을 사용하는 방법을 다룹니다.

다음은 유용할 수 있는 다른 리소스입니다:

*   Swift 코드에서 Kotlin 선언을 사용하는 방법의 예시 모음인 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia).
*   Kotlin의 트레이싱 GC와 Objective-C의 ARC 간의 통합 세부 사항을 다루는 [Swift/Objective-C ARC와의 통합](native-arc-integration.md) 섹션.

## Swift/Objective-C 라이브러리를 Kotlin으로 import하기

Objective-C 프레임워크 및 라이브러리는 빌드에 제대로 import(시스템 프레임워크는 기본적으로 import됨)되면 Kotlin 코드에서 사용할 수 있습니다.
자세한 내용은 다음을 참조하세요:

*   [라이브러리 정의 파일 생성 및 구성](native-definition-file.md)
*   [네이티브 라이브러리 컴파일 구성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

Swift 라이브러리는 해당 API가 `@objc`로 Objective-C에 export(내보내기)된 경우 Kotlin 코드에서 사용할 수 있습니다.
순수 Swift 모듈은 아직 지원되지 않습니다.

## Swift/Objective-C에서 Kotlin 사용하기

Kotlin 모듈은 프레임워크로 컴파일되면 Swift/Objective-C 코드에서 사용할 수 있습니다:

*   바이너리를 선언하는 방법은 [최종 네이티브 바이너리 빌드](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)를 참조하세요.
*   예시는 [Kotlin Multiplatform 샘플 프로젝트](https://github.com/Kotlin/kmm-basic-sample)를 확인하세요.

### Objective-C 및 Swift에서 Kotlin 선언 숨기기

> `@HiddenFromObjC` 어노테이션은 [실험적 기능](components-stability.md#stability-levels-explained)이며 [옵트인](opt-in-requirements.md)이 필요합니다.
>
{style="warning"}

Kotlin 코드를 Swift/Objective-C 친화적으로 만들려면 `@HiddenFromObjC` 어노테이션을 사용하여 Kotlin 선언을
Objective-C 및 Swift에서 숨길 수 있습니다. 이는 함수 또는 프로퍼티의 Objective-C export를 비활성화합니다.

또는 Kotlin 선언에 `internal` 접근 제한자를 마크하여 컴파일 모듈 내에서 가시성을 제한할 수 있습니다.
다른 Kotlin 모듈에는 계속 표시되면서도 Objective-C 및 Swift에서 Kotlin 선언을 숨기려면 `@HiddenFromObjC`를 사용하세요.

[Kotlin-Swift interopedia에서 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md).

### Swift에서 refining 사용하기

> `@ShouldRefineInSwift` 어노테이션은 [실험적 기능](components-stability.md#stability-levels-explained)이며 [옵트인](opt-in-requirements.md)이 필요합니다.
>
{style="warning"}

`@ShouldRefineInSwift`는 Kotlin 선언을 Swift로 작성된 래퍼로 교체하는 데 도움이 됩니다. 이 어노테이션은
생성된 Objective-C API에서 함수 또는 프로퍼티를 `swift_private`로 마크합니다. 이러한 선언에는 `__` 접두사가 붙어
Swift에서는 보이지 않게 됩니다.

Swift-친화적인 API를 생성하기 위해 Swift 코드에서 이러한 선언을 계속 사용할 수 있지만,
Xcode 자동 완성에서는 제안되지 않습니다.

*   Swift에서 Objective-C 선언을 개선하는 방법에 대한 자세한 내용은 [Apple 공식 문서](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)를 참조하세요.
*   `@ShouldRefineInSwift` 어노테이션 사용 예시는 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)를 참조하세요.

### 선언 이름 변경

> `@ObjCName` 어노테이션은 [실험적 기능](components-stability.md#stability-levels-explained)이며 [옵트인](opt-in-requirements.md)이 필요합니다.
>
{style="warning"}

Kotlin 선언의 이름 변경을 피하려면 `@ObjCName` 어노테이션을 사용하세요. 이 어노테이션은 Kotlin 컴파일러에게
어노테이션이 적용된 클래스, 인터페이스 또는 다른 Kotlin 엔티티에 커스텀 Objective-C 및 Swift 이름을 사용하도록 지시합니다:

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

### KDoc 주석으로 문서 제공

문서는 모든 API를 이해하는 데 필수적입니다. 공유 Kotlin API에 대한 문서를 제공하면
사용법, 해야 할 일과 하지 말아야 할 일 등에 대해 사용자들과 소통할 수 있습니다.

기본적으로 [KDocs](kotlin-doc.md) 주석은 Objective-C 헤더를 생성할 때 해당 주석으로 번역되지 않습니다.
예를 들어, KDoc이 포함된 다음 Kotlin 코드는:

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

어떤 주석도 없는 Objective-C 선언을 생성합니다:

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDoc 주석 export를 활성화하려면 `build.gradle(.kts)`에 다음 컴파일러 옵션을 추가하세요:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
</tabs>

그 후 Objective-C 헤더에는 해당 주석이 포함됩니다:

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

Xcode 등에서 자동 완성 시 클래스 및 메서드에 대한 주석을 볼 수 있습니다. 함수 정의(`.h` 파일)로 이동하면 `@param`, `@return` 등에 대한 주석을 볼 수 있습니다.

알려진 제한 사항:

> KDoc 주석을 생성된 Objective-C 헤더로 export하는 기능은 [실험적 기능](components-stability.md)입니다.
> 이 기능은 언제든지 중단되거나 변경될 수 있습니다.
> 옵트인(자세한 내용은 아래 참조)이 필요하며, 평가 목적으로만 사용해야 합니다.
> [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

*   종속성 문서는 `-Xexport-kdoc`로 직접 컴파일되지 않는 한 export되지 않습니다. 이 기능은 실험적 기능이므로, 이 옵션으로 컴파일된 라이브러리는 다른 컴파일러 버전과 호환되지 않을 수 있습니다.
*   KDoc 주석은 대부분 그대로 export됩니다. `@property`와 같은 많은 KDoc 기능은 지원되지 않습니다.

## 매핑

아래 표는 Kotlin 개념이 Swift/Objective-C로, 그 반대로 어떻게 매핑되는지 보여줍니다.

"->"와 "<-"는 매핑이 한 방향으로만 이루어짐을 나타냅니다.

| Kotlin                 | Swift                            | Objective-C                      | 비고                                                                                                     |
|------------------------|----------------------------------|----------------------------------|----------------------------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [비고](#classes)                                                                                         |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                                          |
| `constructor`/`create` | Initializer                      | Initializer                      | [비고](#initializers)                                                                                    |
| Property               | Property                         | Property                         | [비고 1](#top-level-functions-and-properties), [비고 2](#setters)                                        |
| Method                 | Method                           | Method                           | [비고 1](#top-level-functions-and-properties), [비고 2](#method-names-translation)                       |
| `enum class`           | `class`                          | `@interface`                     | [비고](#enums)                                                                                           |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [비고 1](#errors-and-exceptions), [비고 2](#suspending-functions)                                        |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [비고](#errors-and-exceptions)                                                                           |
| Extension              | Extension                        | Category member                  | [비고](#extensions-and-category-members)                                                                 |
| `companion` member <-  | Class method or property         | Class method or property         |                                                                                                          |
| `null`                 | `nil`                            | `nil`                            |                                                                                                          |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [비고](#kotlin-singletons)                                                                               |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [비고](#primitive-types)                                                                                 |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                                          |
| `String`               | `String`                         | `NSString`                       | [비고](#strings)                                                                                         |
| `String`               | `NSMutableString`                | `NSMutableString`                | [비고](#nsmutablestring)                                                                                 |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                                          |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                                          |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                                          |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [비고](#collections)                                                                                     |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                                          |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [비고](#collections)                                                                                     |
| Function type          | Function type                    | Block pointer type               | [비고](#function-types)                                                                                  |
| Inline classes         | Unsupported                      | Unsupported                      | [비고](#unsupported)                                                                                     |

### 클래스

#### 이름 번역

Objective-C 클래스는 원본 이름으로 Kotlin으로 import됩니다.
프로토콜은 `Protocol` 이름 접미사가 붙은 인터페이스로 import됩니다. 예를 들어, `@protocol Foo`는 `interface FooProtocol`이 됩니다.
이러한 클래스와 인터페이스는 [빌드 구성에 지정된](#importing-swift-objective-c-libraries-to-kotlin) 패키지에 배치됩니다
(사전 구성된 시스템 프레임워크의 경우 `platform.*` 패키지).

Kotlin 클래스 및 인터페이스의 이름은 Objective-C로 import될 때 접두사가 붙습니다.
접두사는 프레임워크 이름에서 파생됩니다.

Objective-C는 프레임워크 내에서 패키지를 지원하지 않습니다. Kotlin 컴파일러가 동일한 프레임워크 내에서
이름은 같지만 패키지가 다른 Kotlin 클래스를 발견하면 이름을 변경합니다. 이 알고리즘은 아직 안정적이지 않으며
Kotlin 릴리스 간에 변경될 수 있습니다. 이 문제를 해결하려면 프레임워크 내에서 충돌하는 Kotlin 클래스의 이름을 변경할 수 있습니다.

#### 강력한 링크

Kotlin 소스에서 Objective-C 클래스를 사용할 때마다 해당 클래스는 강력하게 링크된 심볼로 마크됩니다. 결과 빌드
아티팩트는 관련 심볼을 강력한 외부 참조로 언급합니다.

이는 앱이 시작 시 동적으로 심볼을 링크하려고 시도하며, 사용할 수 없는 경우 앱이 충돌한다는 것을 의미합니다.
심볼이 사용되지 않은 경우에도 충돌이 발생합니다. 심볼은 특정 장치나 OS 버전에서 사용할 수 없을 수 있습니다.

이 문제를 해결하고 "Symbol not found" 오류를 방지하려면 클래스가 실제로 사용 가능한지 확인하는 Swift 또는 Objective-C 래퍼를 사용하세요.
[Compose Multiplatform 프레임워크에서 이 해결 방법이 어떻게 구현되었는지 확인하세요](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files).

### 초기화 메서드

Swift/Objective-C 초기화 메서드는 Kotlin으로 생성자 또는 `create`라는 이름의 팩토리 메서드로 import됩니다.
후자의 경우는 Objective-C 카테고리 또는 Swift 확장으로 선언된 초기화 메서드에서 발생합니다.
Kotlin에는 확장 생성자 개념이 없기 때문입니다.

> Swift 초기화 메서드를 Kotlin으로 import하기 전에 `@objc`로 어노테이션을 붙이는 것을 잊지 마세요.
>
{style="tip"}

Kotlin 생성자는 Swift/Objective-C로 초기화 메서드로 import됩니다.

### 세터

슈퍼클래스의 읽기 전용 프로퍼티를 오버라이드하는 쓰기 가능한 Objective-C 프로퍼티는
프로퍼티 `foo`에 대한 `setFoo()` 메서드로 표현됩니다. 가변으로 구현된 프로토콜의 읽기 전용 프로퍼티도 마찬가지입니다.

### 최상위 함수 및 프로퍼티

최상위 Kotlin 함수와 프로퍼티는 특수 클래스의 멤버로 접근할 수 있습니다.
각 Kotlin 파일은 그러한 클래스로 번역됩니다. 예를 들어:

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

그러면 Swift에서 `foo()` 함수를 다음과 같이 호출할 수 있습니다:

```swift
MyLibraryUtilsKt.foo()
```

Kotlin-Swift interopedia에서 최상위 Kotlin 선언에 접근하는 방법에 대한 예시 모음을 참조하세요:

*   [최상위 함수](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
*   [최상위 읽기 전용 프로퍼티](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
*   [최상위 가변 프로퍼티](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### 메서드 이름 번역

일반적으로 Swift 인자 레이블과 Objective-C 셀렉터 조각은 Kotlin 파라미터 이름에 매핑됩니다. 이 두 개념은
의미론이 다르므로, 때로는 Swift/Objective-C 메서드가 충돌하는 Kotlin 시그니처로 import될 수 있습니다.
이 경우, 충돌하는 메서드는 Kotlin에서 명명된 인자를 사용하여 호출할 수 있습니다. 예를 들어:

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

Kotlin에서는 다음과 같습니다:

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

`kotlin.Any` 함수가 Swift/Objective-C에 어떻게 매핑되는지 보여줍니다:

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[Kotlin-Swift interopedia에서 데이터 클래스 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md).

[`@ObjCName` 어노테이션](#change-declaration-names)으로 Kotlin 선언의 이름을 변경하는 대신
Swift 또는 Objective-C에서 더 관용적인 이름을 지정할 수 있습니다.

### 오류 및 예외

모든 Kotlin 예외는 비검사 예외이므로 오류는 런타임에 catch됩니다. 그러나 Swift는 컴파일 타임에
처리되는 검사 예외만 있습니다. 따라서 Swift 또는 Objective-C 코드가 예외를 throw하는 Kotlin 메서드를 호출하는 경우,
해당 Kotlin 메서드는 `@Throws` 어노테이션으로 마크되어 "예상되는" 예외 클래스 목록을 지정해야 합니다.

Swift/Objective-C 프레임워크로 컴파일할 때, `@Throws` 어노테이션이 있거나 상속하는 비-`suspend` 함수는
Objective-C에서는 `NSError*`를 생성하는 메서드로, Swift에서는 `throws` 메서드로 표현됩니다.
`suspend` 함수의 표현은 항상 완료 핸들러에 `NSError*`/`Error` 파라미터를 가집니다.

Swift/Objective-C 코드에서 호출된 Kotlin 함수가 `@Throws`에 지정된 클래스 또는 해당 서브클래스의
인스턴스인 예외를 throw하는 경우, 해당 예외는 `NSError`로 전파됩니다.
Swift/Objective-C에 도달하는 다른 Kotlin 예외는 처리되지 않은 것으로 간주되어 프로그램 종료를 야기합니다.

`@Throws`가 없는 `suspend` 함수는 `CancellationException`만 전파합니다(`NSError`로).
`@Throws`가 없는 비-`suspend` 함수는 Kotlin 예외를 전혀 전파하지 않습니다.

반대 방향의 역번역은 아직 구현되지 않았습니다: Swift/Objective-C 오류를 throw하는 메서드는
Kotlin으로 예외를 throw하는 메서드로 import되지 않습니다.

[Kotlin-Swift interopedia에서 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md).

### 열거형

Kotlin 열거형은 Objective-C로 `@interface`로, Swift로 `class`로 import됩니다.
이러한 데이터 구조는 각 열거형 값에 해당하는 프로퍼티를 가집니다. 다음 Kotlin 코드를 고려하세요:

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

이 열거형 클래스의 프로퍼티는 Swift에서 다음과 같이 접근할 수 있습니다:

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

Swift `switch` 문에서 Kotlin 열거형의 변수를 사용하려면 컴파일 오류를 방지하기 위해 `default` 구문을 제공하세요:

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[Kotlin-Swift interopedia에서 다른 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md).

### 일시 중단 함수

> Swift 코드에서 `suspend` 함수를 `async`로 호출하는 기능은 [실험적 기능](components-stability.md)입니다.
> 이 기능은 언제든지 중단되거나 변경될 수 있습니다.
> 평가 목적으로만 사용해야 합니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin의 [일시 중단 함수](coroutines-basics.md)(`suspend`)는 생성된 Objective-C 헤더에 콜백이 있는 함수로 제공되거나,
Swift/Objective-C 용어로는 [완료 핸들러](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)로 제공됩니다.

Swift 5.5부터 Kotlin의 `suspend` 함수는 완료 핸들러를 사용하지 않고도 Swift에서 `async` 함수로 호출할 수 있습니다.
현재 이 기능은 매우 실험적이며 특정 제한 사항이 있습니다. 자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47610)를 참조하세요.

*   Swift 문서에서 [`async`/`await` 메커니즘](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)에 대해 자세히 알아보세요.
*   [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md)에서 동일한 기능을 구현하는 서드파티 라이브러리에 대한 예시 및 권장 사항을 참조하세요.

### 확장 및 카테고리 멤버

Objective-C 카테고리 및 Swift 확장의 멤버는 일반적으로 Kotlin으로 확장으로 import됩니다. 이것이 이러한
선언이 Kotlin에서 오버라이드될 수 없고, 확장 초기화 메서드가 Kotlin 생성자로 사용할 수 없는 이유입니다.

> 현재 두 가지 예외가 있습니다. Kotlin 1.8.20부터, NSView 클래스(AppKit 프레임워크에서) 또는
> UIView 클래스(UIKit 프레임워크에서)와 동일한 헤더에 선언된 카테고리 멤버는
> 이 클래스의 멤버로 import됩니다. 이는 NSView 또는 UIView를 서브클래싱하는 메서드를 오버라이드할 수 있음을 의미합니다.
>
{style="note"}

"일반" Kotlin 클래스에 대한 Kotlin 확장은 Swift 및 Objective-C로 각각 확장 및 카테고리 멤버로 import됩니다.
다른 타입에 대한 Kotlin 확장은 추가 리시버 파라미터가 있는 [최상위 선언](#top-level-functions-and-properties)으로 처리됩니다.
이러한 타입에는 다음이 포함됩니다:

*   Kotlin `String` 타입
*   Kotlin 컬렉션 타입 및 서브타입
*   Kotlin `interface` 타입
*   Kotlin 기본 타입
*   Kotlin `inline` 클래스
*   Kotlin `Any` 타입
*   Kotlin 함수 타입 및 서브타입
*   Objective-C 클래스 및 프로토콜

[Kotlin-Swift interopedia에서 예시 모음 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions).

### Kotlin 싱글톤

Kotlin 싱글톤(`object` 선언, `companion object` 포함)은 Swift/Objective-C로 단일 인스턴스를 가진 클래스로 import됩니다.

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

이러한 객체에 다음과 같이 접근합니다:

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> Objective-C에서 `[MySingleton mySingleton]`을 통해, Swift에서 `MySingleton()`을 통해 객체에 접근하는 방법은 지원 중단되었습니다.
>
{style="note"}

Kotlin-Swift interopedia에서 더 많은 예시를 참조하세요:

*   [`shared`를 사용하여 Kotlin 객체에 접근하는 방법](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
*   [Swift에서 Kotlin 동반 객체 멤버에 접근하는 방법](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md).

### 기본 타입

Kotlin 기본 타입 박스는 특수 Swift/Objective-C 클래스에 매핑됩니다. 예를 들어, `kotlin.Int` 박스는
Swift에서 `KotlinInt` 클래스 인스턴스(또는 Objective-C에서 `${prefix}Int` 인스턴스, 여기서 `prefix`는 프레임워크의 이름 접두사)로 표현됩니다.
이러한 클래스는 `NSNumber`에서 파생되므로, 인스턴스는 모든 해당 연산을 지원하는 적절한 `NSNumber`입니다.

`NSNumber` 타입은 Swift/Objective-C 파라미터 타입 또는 반환 값으로 사용될 때 Kotlin 기본 타입으로 자동 번역되지 않습니다.
그 이유는 `NSNumber` 타입이 래핑된 기본 값 타입에 대한 충분한 정보를 제공하지 않기 때문입니다(예: `NSNumber`는 정적으로 `Byte`, `Boolean` 또는 `Double`인지 알려지지 않음).
따라서 Kotlin 기본 값은 [수동으로 `NSNumber`로 캐스트 및 해제](#casting-between-mapped-types)해야 합니다.

### 문자열

Kotlin `String`이 Swift로 전달될 때, 먼저 Objective-C 객체로 export되고, 그 다음 Swift 컴파일러가
Swift 변환을 위해 한 번 더 복사합니다. 이는 추가 런타임 오버헤드를 초래합니다.

이를 피하려면 Swift에서 Kotlin 문자열에 Objective-C `NSString`로 직접 접근하세요.
[변환 예시 보기](#see-the-conversion-example).

#### NSMutableString

`NSMutableString` Objective-C 클래스는 Kotlin에서 사용할 수 없습니다.
`NSMutableString`의 모든 인스턴스는 Kotlin으로 전달될 때 복사됩니다.

### 컬렉션

#### Kotlin -> Objective-C -> Swift

Kotlin 컬렉션이 Swift로 전달될 때, 먼저 Objective-C 등가로 변환되고, 그 다음 Swift 컴파일러가
전체 컬렉션을 복사하여 [매핑 표](#mappings)에 설명된 대로 Swift-네이티브 컬렉션으로 변환합니다.

이 마지막 변환은 성능 비용을 초래합니다. 이를 방지하려면 Swift에서 Kotlin 컬렉션을 사용할 때,
명시적으로 해당 Objective-C 대응 객체(`NSDictionary`, `NSArray`, `NSSet`)로 캐스트하세요.

##### 변환 예시 보기 {initial-collapse-state="collapsed" collapsible="true"}

예를 들어, 다음 Kotlin 선언은:

```kotlin
val map: Map<String, String>
```

Swift에서는 다음과 같이 보일 수 있습니다:

```Swift
map[key]?.count ?? 0
```

여기서 `map`은 암시적으로 Swift의 `Dictionary`로 변환되고, 해당 문자열 값은 Swift의 `String`으로 매핑됩니다.
이는 성능 비용을 초래합니다.

변환을 피하려면 `map`을 명시적으로 Objective-C의 `NSDictionary`로 캐스트하고 대신 `NSString`로 값에 접근하세요:

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

이렇게 하면 Swift 컴파일러가 추가 변환 단계를 수행하지 않습니다.

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C 컬렉션은 [매핑 표](#mappings)에 설명된 대로 Kotlin으로 매핑되지만,
`NSMutableSet` 및 `NSMutableDictionary`는 예외입니다.

`NSMutableSet`은 Kotlin의 `MutableSet`으로 변환되지 않습니다. 객체를 Kotlin `MutableSet`으로 전달하려면
이러한 종류의 Kotlin 컬렉션을 명시적으로 생성해야 합니다. 예를 들어, Kotlin의 `mutableSetOf()` 함수 또는
Swift의 `KotlinMutableSet` 클래스와 Objective-C의 `${prefix}MutableSet`(`prefix`는 프레임워크 이름 접두사)을 사용합니다.
`MutableMap`도 마찬가지입니다.

[Kotlin-Swift interopedia에서 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md).

### 함수 타입

Kotlin 함수 타입 객체(예: 람다)는 Swift에서는 함수로, Objective-C에서는 블록으로 변환됩니다.
[Kotlin-Swift interopedia에서 람다를 포함하는 Kotlin 함수의 예시 보기](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md).

그러나 함수와 함수 타입을 번역할 때 파라미터와 반환 값의 타입이 매핑되는 방식에는 차이가 있습니다.
후자의 경우, 기본 타입은 해당 박싱된 표현으로 매핑됩니다. Kotlin `Unit` 반환 값은
Swift/Objective-C에서 해당 `Unit` 싱글톤으로 표현됩니다. 이 싱글톤의 값은 다른 Kotlin `object`와
동일한 방식으로 검색할 수 있습니다. 위 [표](#mappings)의 싱글톤을 참조하세요.

다음 Kotlin 함수를 고려하세요:

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

이는 Swift에서 다음과 같이 표현됩니다:

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

그리고 다음과 같이 호출할 수 있습니다:

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### 제네릭

Objective-C는 클래스에 정의된 "경량 제네릭"을 지원하며, 기능 세트가 상대적으로 제한적입니다. Swift는
클래스에 정의된 제네릭을 import하여 컴파일러에 추가 타입 정보를 제공하는 데 도움을 줄 수 있습니다.

Objective-C 및 Swift의 제네릭 기능 지원은 Kotlin과 다르므로, 번역 시 일부 정보가 필연적으로 손실되지만,
지원되는 기능은 의미 있는 정보를 유지합니다.

Swift에서 Kotlin 제네릭을 사용하는 방법에 대한 특정 예시는 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)를 참조하세요.

#### 제한 사항

Objective-C 제네릭은 Kotlin 또는 Swift의 모든 기능을 지원하지 않으므로 번역 시 일부 정보가 손실됩니다.

제네릭은 인터페이스(Objective-C 및 Swift의 프로토콜) 또는 함수가 아닌 클래스에만 정의할 수 있습니다.

#### 널러블리티

Kotlin과 Swift는 모두 타입 사양의 일부로 널러블리티를 정의하는 반면, Objective-C는 타입의 메서드 및 프로퍼티에 널러블리티를 정의합니다.
따라서 다음 Kotlin 코드는:

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

잠재적으로 널러블한 타입을 지원하려면 Objective-C 헤더는 널러블 반환 값을 가진 `myVal`을 정의해야 합니다.

이를 완화하려면 제네릭 클래스를 정의할 때 제네릭 타입이 _절대_ 널이 아니어야 하는 경우 널이 아닌 타입 제약을 제공하세요:

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

이렇게 하면 Objective-C 헤더가 `myVal`을 널이 아닌 것으로 마크하도록 강제합니다.

#### 분산

Objective-C는 제네릭이 공변 또는 반변으로 선언될 수 있도록 허용합니다. Swift는 분산을 지원하지 않습니다.
Objective-C에서 오는 제네릭 클래스는 필요에 따라 강제 캐스트될 수 있습니다.

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 제약 조건

Kotlin에서는 제네릭 타입에 대한 상위 경계를 제공할 수 있습니다. Objective-C도 이를 지원하지만,
더 복잡한 경우에는 지원되지 않으며 현재 Kotlin - Objective-C 상호 운용에서는 지원되지 않습니다.
여기서 예외는 널이 아닌 상위 경계가 Objective-C 메서드/프로퍼티를 널이 아닌 것으로 만든다는 점입니다.

#### 비활성화

제네릭 없이 프레임워크 헤더를 작성하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 전방 선언

전방 선언을 import하려면 `objcnames.classes` 및 `objcnames.protocols` 패키지를 사용하세요. 예를 들어,
`library.package`를 가진 Objective-C 라이브러리에 선언된 `objcprotocolName` 전방 선언을 import하려면,
특별한 전방 선언 패키지를 사용하세요: `import objcnames.protocols.objcprotocolName`.

두 개의 objcinterop 라이브러리를 고려하세요: 하나는 `objcnames.protocols.ForwardDeclaredProtocolProtocol`을 사용하고,
다른 하나는 다른 패키지에 실제 구현을 가지고 있습니다:

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

두 라이브러리 간에 객체를 전송하려면 Kotlin 코드에서 명시적 `as` 캐스트를 사용하세요:

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> `objcnames.protocols.ForwardDeclaredProtocolProtocol`로 캐스트하는 것은 해당 실제 클래스에서만 가능합니다.
> 그렇지 않으면 오류가 발생합니다.
>
{style="note"}

## 매핑된 타입 간 캐스팅

Kotlin 코드를 작성할 때 객체를 Kotlin 타입에서 동등한 Swift/Objective-C 타입으로 (또는 그 반대로)
변환해야 할 수 있습니다. 이 경우, 일반적인 Kotlin 캐스트를 사용할 수 있습니다. 예를 들어:

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## 서브클래싱

### Swift/Objective-C에서 Kotlin 클래스 및 인터페이스 서브클래싱

Kotlin 클래스 및 인터페이스는 Swift/Objective-C 클래스 및 프로토콜에 의해 서브클래싱될 수 있습니다.

### Kotlin에서 Swift/Objective-C 클래스 및 프로토콜 서브클래싱

Swift/Objective-C 클래스 및 프로토콜은 Kotlin `final` 클래스로 서브클래싱될 수 있습니다.
Swift/Objective-C 타입을 상속하는 비-`final` Kotlin 클래스는 아직 지원되지 않으므로,
Swift/Objective-C 타입을 상속하는 복잡한 클래스 계층 구조를 선언하는 것은 불가능합니다.

일반 메서드는 `override` Kotlin 키워드를 사용하여 오버라이드할 수 있습니다. 이 경우, 오버라이딩 메서드는
오버라이드된 메서드와 동일한 파라미터 이름을 가져야 합니다.

때로는 `UIViewController` 서브클래싱과 같이 초기화 메서드를 오버라이드해야 할 때가 있습니다.
Kotlin 생성자로 import된 초기화 메서드는 `@OverrideInit` 어노테이션이 마크된 Kotlin 생성자에 의해 오버라이드될 수 있습니다:

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

오버라이딩 생성자는 오버라이드된 생성자와 동일한 파라미터 이름과 타입을 가져야 합니다.

충돌하는 Kotlin 시그니처를 가진 다른 메서드를 오버라이드하려면 클래스에 `@ObjCSignatureOverride` 어노테이션을 추가할 수 있습니다.
이 어노테이션은 Objective-C 클래스에서 상속된 여러 함수가 동일한 인자 타입을 가지지만 다른 인자 이름을 가지는 경우,
Kotlin 컴파일러에게 충돌하는 오버로드를 무시하도록 지시합니다.

기본적으로 Kotlin/Native 컴파일러는 비-지정 Objective-C 초기화 메서드를 `super()` 생성자로 호출하는 것을 허용하지 않습니다.
이 동작은 지정 초기화 메서드가 Objective-C 라이브러리에 제대로 마크되지 않은 경우 불편할 수 있습니다.
이러한 컴파일러 검사를 비활성화하려면 라이브러리의 [`.def` 파일](native-definition-file.md)에 `disableDesignatedInitializerChecks = true`를 추가하세요.

## C 기능

라이브러리가 안전하지 않은 포인터, 구조체 등과 같은 일부 일반 C 기능을 사용하는 경우에 대한 예시는
[C와의 상호 운용](native-c-interop.md)을 참조하세요.

## 지원되지 않음

Kotlin 프로그래밍 언어의 일부 기능은 아직 Objective-C 또는 Swift의 해당 기능으로 매핑되지 않았습니다.
현재 다음 기능은 생성된 프레임워크 헤더에 제대로 노출되지 않습니다:

*   인라인 클래스(인자는 기본 원시 타입 또는 `id`로 매핑됨)
*   표준 Kotlin 컬렉션 인터페이스(`List`, `Map`, `Set`) 및 기타 특수 클래스를 구현하는 커스텀 클래스
*   Objective-C 클래스의 Kotlin 서브클래스