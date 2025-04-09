---
title: "Swift/Objective-C와의 상호 운용성"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Objective-C 라이브러리 가져오기는 [Experimental](components-stability#stability-levels-explained)입니다.
cinterop 툴로 Objective-C 라이브러리에서 생성된 모든 Kotlin 선언에는 `@ExperimentalForeignApi` 어노테이션이 있어야 합니다.

Kotlin/Native와 함께 제공되는 네이티브 플랫폼 라이브러리(예: Foundation, UIKit, POSIX)는
일부 API에 대해서만 옵트인을 요구합니다.

이 문서는 Swift/Objective-C와의 Kotlin/Native interoperability의 몇 가지 측면을 다룹니다. Kotlin 선언을 Swift/Objective-C 코드에서 사용하는 방법과 Objective-C 선언을 Kotlin 코드에서 사용하는 방법을 설명합니다.

유용하게 사용할 수 있는 다른 자료는 다음과 같습니다.

* [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)는 Swift 코드에서 Kotlin 선언을 사용하는 방법에 대한 예제 모음입니다.
* [Swift/Objective-C ARC와 통합](native-arc-integration) 섹션에서는 Kotlin의 추적 GC와 Objective-C의 ARC 간의 통합에 대한 세부 정보를 다룹니다.

## Kotlin으로 Swift/Objective-C 라이브러리 가져오기

Objective-C 프레임워크 및 라이브러리는 빌드로 적절히 가져오면 Kotlin 코드에서 사용할 수 있습니다 (시스템 프레임워크는 기본적으로 가져옴).
자세한 내용은 다음을 참조하십시오.

* [라이브러리 정의 파일 생성 및 구성](native-definition-file)
* [네이티브 라이브러리에 대한 컴파일 구성](multiplatform-configure-compilations#configure-interop-with-native-languages)

API가 `@objc`를 사용하여 Objective-C로 내보내진 경우 Swift 라이브러리를 Kotlin 코드에서 사용할 수 있습니다.
순수 Swift 모듈은 아직 지원되지 않습니다.

## Swift/Objective-C에서 Kotlin 사용하기

Kotlin 모듈은 프레임워크로 컴파일된 경우 Swift/Objective-C 코드에서 사용할 수 있습니다.

* 바이너리를 선언하는 방법은 [최종 네이티브 바이너리 빌드](multiplatform-build-native-binaries#declare-binaries)를 참조하세요.
* 예제는 [Kotlin Multiplatform 샘플 프로젝트](https://github.com/Kotlin/kmm-basic-sample)를 확인하세요.

### Objective-C 및 Swift에서 Kotlin 선언 숨기기

`@HiddenFromObjC` 어노테이션은 [Experimental](components-stability#stability-levels-explained)이며 [opt-in](opt-in-requirements)이 필요합니다.

Kotlin 코드를 Objective-C/Swift에 더 친숙하게 만들려면 `@HiddenFromObjC`를 사용하여 Objective-C 및 Swift에서 Kotlin 선언을 숨길 수 있습니다.
어노테이션은 Objective-C로의 함수 또는 속성 내보내기를 비활성화합니다.

또는 Kotlin 선언에 `internal` 수정자를 표시하여 컴파일 모듈에서 가시성을 제한할 수 있습니다.
Objective-C 및 Swift에서만 Kotlin 선언을 숨기고 다른 Kotlin 모듈에서는 계속 보이도록 하려면 `@HiddenFromObjC`를 선택하세요.

[Kotlin-Swift interopedia에서 예제를 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC).

### Swift에서 개선 사용

`@ShouldRefineInSwift` 어노테이션은 [Experimental](components-stability#stability-levels-explained)이며 [opt-in](opt-in-requirements)이 필요합니다.

`@ShouldRefineInSwift`는 Kotlin 선언을 Swift로 작성된 래퍼로 대체하는 데 도움이 됩니다.
어노테이션은 함수 또는 속성을 생성된 Objective-C API에서 `swift_private`로 표시합니다.
이러한 선언에는 `__` 접두사가 붙어 Swift에서 보이지 않게 됩니다.

Swift 코드에서 이러한 선언을 사용하여 Swift에 친숙한 API를 만들 수 있지만 Xcode 자동 완성에서는 제안되지 않습니다.

* Swift에서 Objective-C 선언을 개선하는 방법에 대한 자세한 내용은 [공식 Apple 문서](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)를 참조하세요.
* `@ShouldRefineInSwift` 어노테이션을 사용하는 방법에 대한 예제는 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift)를 참조하세요.

### 선언 이름 변경

`@ObjCName` 어노테이션은 [Experimental](components-stability#stability-levels-explained)이며 [opt-in](opt-in-requirements)이 필요합니다.

Kotlin 선언 이름을 바꾸지 않으려면 `@ObjCName` 어노테이션을 사용하세요.
어노테이션이 달린 클래스, 인터페이스 또는 기타 Kotlin 엔터티에 대해 사용자 지정 Objective-C 및 Swift 이름을 사용하도록 Kotlin 컴파일러에 지시합니다.

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

[Kotlin-Swift interopedia에서 다른 예제를 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName).

### KDoc 주석으로 문서 제공

문서는 API를 이해하는 데 필수적입니다.
공유 Kotlin API에 대한 문서를 제공하면 사용 방법, 해야 할 일과 하지 말아야 할 일 등에 대해 사용자와 소통할 수 있습니다.

기본적으로 [KDocs](kotlin-doc) 주석은 Objective-C 헤더를 생성할 때 해당 주석으로 변환되지 않습니다.
예를 들어 KDoc이 있는 다음 Kotlin 코드는 다음과 같습니다.

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

주석 없이 Objective-C 선언을 생성합니다.

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

KDoc 주석 내보내기를 활성화하려면 다음 컴파일러 옵션을 `build.gradle(.kts)`에 추가하세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").compilerOptions.options.freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</TabItem>
</Tabs>

그런 다음 Objective-C 헤더에 해당 주석이 포함됩니다.

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

예를 들어 Xcode에서 자동 완성 시 클래스 및 메서드에 대한 주석을 볼 수 있습니다.
함수 정의 (`.h` 파일)로 이동하면 `@param`, `@return` 등에 대한 주석이 표시됩니다.

알려진 제한 사항:

생성된 Objective-C 헤더로 KDoc 주석을 내보내는 기능은 [Experimental](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다.
옵트인이 필요하며 (자세한 내용은 아래 참조) 평가 목적으로만 사용해야 합니다.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-38600)에서 피드백을 보내주시면 감사하겠습니다.

* `-Xexport-kdoc` 자체로 컴파일되지 않은 경우 종속성 문서가 내보내지지 않습니다. 이 기능은 Experimental이므로 이 옵션으로 컴파일된 라이브러리는 다른 컴파일러 버전과 호환되지 않을 수 있습니다.
* KDoc 주석은 대부분 있는 그대로 내보내집니다. 예를 들어 `@property`와 같은 많은 KDoc 기능은 지원되지 않습니다.

## 매핑

아래 표는 Kotlin 개념이 Swift/Objective-C에 매핑되는 방식과 그 반대의 경우를 보여줍니다.

"`->`" 및 "`<-`"는 매핑이 한 방향으로만 진행됨을 나타냅니다.

| Kotlin                 | Swift                            | Objective-C                      | 참고                                                                               |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [참고](#classes)                                                                  |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [참고](#initializers)                                                              |
| Property               | Property                         | Property                         | [참고 1](#top-level-functions-and-properties), [참고 2](#setters)                  |
| Method                 | Method                           | Method                           | [참고 1](#top-level-functions-and-properties), [참고 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [참고](#enums)                                                                    |
| `suspend` `->`           | `completionHandler:`/ `async`    | `completionHandler:`             | [참고 1](#errors-and-exceptions), [참고 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [참고](#errors-and-exceptions)                                                    |
| Extension              | Extension                        | Category member                  | [참고](#extensions-and-category-members)                                          |
| `companion` member `<-`  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [참고](#kotlin-singletons)                                                        |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [참고](#nsnumber)                                                                 |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       |                                                                                    |
| `String`               | `NSMutableString`                | `NSMutableString`                | [참고](#nsmutablestring)                                                          |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [참고](#collections)                                                              |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [참고](#collections)                                                              |
| Function type          | Function type                    | Block pointer type               | [참고](#function-types)                                                           |
| Inline classes         | Unsupported                      | Unsupported                      | [참고](#unsupported)                                                              |

### 클래스

#### 이름 변환

Objective-C 클래스는 원래 이름으로 Kotlin으로 가져옵니다.
프로토콜은 `Protocol` 이름 접미사가 있는 인터페이스로 가져옵니다(예: `@protocol Foo` `->` `interface FooProtocol`).
이러한 클래스 및 인터페이스는 [빌드 구성에 지정된](#importing-swift-objective-c-libraries-to-kotlin) 패키지에 배치됩니다
(미리 구성된 시스템 프레임워크의 경우 `platform.*` 패키지).

Kotlin 클래스 및 인터페이스의 이름은 Objective-C로 가져올 때 접두사가 붙습니다.
접두사는 프레임워크 이름에서 파생됩니다.

Objective-C는 프레임워크에서 패키지를 지원하지 않습니다.
Kotlin 컴파일러가 동일한 이름을 가진 Kotlin 클래스를 동일한 프레임워크에서 찾았지만 다른 패키지에 있는 경우 이름을 바꿉니다.
이 알고리즘은 아직 안정적이지 않으며 Kotlin 릴리스 간에 변경될 수 있습니다.
이 문제를 해결하려면 프레임워크에서 충돌하는 Kotlin 클래스의 이름을 바꿀 수 있습니다.

#### 강력한 링크

Kotlin 소스에서 Objective-C 클래스를 사용할 때마다 강력하게 연결된 기호로 표시됩니다.
결과 빌드 아티팩트는 관련 기호를 강력한 외부 참조로 언급합니다.

즉, 앱은 시작 중에 기호를 동적으로 연결하려고 시도하고 사용할 수 없는 경우 앱이 충돌합니다.
기호가 사용되지 않은 경우에도 충돌이 발생합니다.
기호는 특정 장치 또는 OS 버전에서 사용할 수 없을 수 있습니다.

이 문제를 해결하고 "기호를 찾을 수 없음" 오류를 방지하려면 클래스를 실제로 사용할 수 있는지 확인하는 Swift 또는 Objective-C 래퍼를 사용하세요.
[이 해결 방법이 Compose Multiplatform 프레임워크에서 구현된 방법을 참조하세요](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files).

### Initializer

Swift/Objective-C initializer는 Kotlin으로 생성자 또는 `create`라는 팩토리 메서드로 가져옵니다.
후자는 Kotlin에는 확장 생성자 개념이 없기 때문에 Objective-C 범주 또는 Swift 확장으로 선언된 initializer에서 발생합니다.

Swift initializer를 Kotlin으로 가져오기 전에 `@objc`로 어노테이션을 추가하는 것을 잊지 마세요.

Kotlin 생성자는 Swift/Objective-C로 initializer로 가져옵니다.

### Setter

슈퍼 클래스의 읽기 전용 속성을 재정의하는 쓰기 가능한 Objective-C 속성은 속성 `foo`에 대한 `setFoo()` 메서드로 표시됩니다.
뮤터블로 구현된 프로토콜의 읽기 전용 속성도 마찬가지입니다.

### 최상위 함수 및 속성

최상위 Kotlin 함수 및 속성은 특수 클래스의 멤버로 액세스할 수 있습니다.
각 Kotlin 파일은 다음과 같은 클래스로 변환됩니다.

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

그런 다음 다음과 같이 Swift에서 `foo()` 함수를 호출할 수 있습니다.

```swift
MyLibraryUtilsKt.foo()
```

Kotlin-Swift interopedia에서 최상위 Kotlin 선언에 액세스하는 방법에 대한 예제 모음을 참조하세요.

* [최상위 함수](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions)
* [최상위 읽기 전용 속성](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties)
* [최상위 뮤터블 속성](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties)

### 메서드 이름 변환

일반적으로 Swift 인수 레이블과 Objective-C 선택기 조각은 Kotlin 매개변수 이름에 매핑됩니다.
이 두 가지 개념은 의미 체계가 다르므로 때때로 Swift/Objective-C 메서드를 충돌하는 Kotlin 시그니처로 가져올 수 있습니다.
이 경우 명명된 인수를 사용하여 Kotlin에서 충돌하는 메서드를 호출할 수 있습니다. 예를 들면 다음과 같습니다.

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

Kotlin에서는 다음과 같습니다.

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

다음은 `kotlin.Any` 함수가 Swift/Objective-C에 매핑되는 방식입니다.

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[Kotlin-Swift interopedia에서 데이터 클래스 예제를 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes).

[`@ObjCName` 어노테이션](#change-declaration-names)을 사용하여 Kotlin 선언 이름을 바꾸는 대신 Swift 또는 Objective-C에서 더 관용적인 이름을 지정할 수 있습니다.

### 오류 및 예외

모든 Kotlin 예외는 unchecked이며 런타임에 오류가 발생합니다.
그러나 Swift에는 컴파일 타임에 처리되는 checked 오류만 있습니다.
따라서 Swift 또는 Objective-C 코드가 예외를 throw하는 Kotlin 메서드를 호출하는 경우 Kotlin 메서드는 "예상되는" 예외 클래스 목록을 지정하는 `@Throws` 어노테이션으로 표시해야 합니다.

Objective-C/Swift 프레임워크로 컴파일할 때 `@Throws` 어노테이션이 있거나 상속하는 non-`suspend` 함수는 Objective-C에서 `NSError*`-생성 메서드와 Swift에서 `throws` 메서드로 표시됩니다.
`suspend` 함수에 대한 표현에는 항상 completion handler에 `NSError*`/`Error` 매개변수가 있습니다.

Swift/Objective-C 코드에서 호출된 Kotlin 함수가 `@Throws`-지정된 클래스 또는 해당 하위 클래스 중 하나의 인스턴스인 예외를 throw하면 `NSError`로 전파됩니다.
Swift/Objective-C에 도달하는 다른 Kotlin 예외는 처리되지 않은 것으로 간주되어 프로그램이 종료됩니다.

`@Throws`가 없는 `suspend` 함수는 `CancellationException`만 (`NSError`로) 전파합니다.
`@Throws`가 없는 Non-`suspend` 함수는 Kotlin 예외를 전혀 전파하지 않습니다.

반대로 Swift/Objective-C 오류 throw 메서드는 예외 throw로 Kotlin으로 가져오지 않습니다.

[Kotlin-Swift interopedia에서 예제를 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions).

### Enum

Kotlin enum은 Objective-C로 `@interface`로, Swift로 `class`로 가져옵니다.
이러한 데이터 구조에는 각 enum 값에 해당하는 속성이 있습니다.
다음 Kotlin 코드를 고려하십시오.

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

다음과 같이 Swift에서 이 enum 클래스의 속성에 액세스할 수 있습니다.

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

Swift `switch` 문에서 Kotlin enum의 변수를 사용하려면 컴파일 오류를 방지하기 위해 기본 문을 제공하세요.

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[Kotlin-Swift interopedia에서 다른 예제를 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes).

### 일시 중단 함수

Swift 코드에서 `async`로 `suspend` 함수를 호출하는 지원은 [Experimental](components-stability)입니다.
언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하세요.
[YouTrack](https://youtrack.jetbrains.com/issue/KT-47610)에서 피드백을 보내주시면 감사하겠습니다.

Kotlin의 [일시 중단 함수](coroutines-basics) (`suspend`)는 생성된 Objective-C 헤더에서 콜백이 있는 함수 또는 Swift/Objective-C 용어에서 [completion handler](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)로 표시됩니다.

Swift 5.5부터 Kotlin의 `suspend` 함수는 completion handler를 사용하지 않고 Swift에서 `async` 함수로 호출할 수도 있습니다.
현재 이 기능은 매우 실험적이며
특정 제한 사항이 있습니다.
자세한 내용은 [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-47610)를 참조하세요.

* [Swift 문서에서 `async`/`await` 메커니즘에 대해 자세히 알아보세요](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html).
* [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions)에서 동일한 기능을 구현하는 타사 라이브러리에 대한 예제 및 권장 사항을 참조하세요.

### 확장 및 범주 멤버

Objective-C 범주 및 Swift 확장의 멤버는 일반적으로 Kotlin으로 확장으로 가져옵니다.
그렇기 때문에 이러한 선언은 Kotlin에서 재정의할 수 없으며 확장 initializer는 Kotlin 생성자로 사용할 수 없습니다.

현재 두 가지 예외가 있습니다. Kotlin 1.8.20부터 NSView 클래스 (AppKit 프레임워크에서) 또는 UIView 클래스 (UIKit 프레임워크에서)와 동일한 헤더에 선언된 범주 멤버는
이러한 클래스의 멤버로 가져옵니다. 즉, NSView 또는 UIView에서 하위 클래스를 만드는 메서드를 재정의할 수 있습니다.

:::

"일반" Kotlin 클래스에 대한 Kotlin 확장은 각각 Swift 및 Objective-C로 확장 및 범주 멤버로 가져옵니다.
다른 유형에 대한 Kotlin 확장은 추가 수신자 매개변수가 있는 [최상위 선언](#top-level-functions-and-properties)으로 처리됩니다.
이러한 유형에는 다음이 포함됩니다.

* Kotlin `String` 유형
* Kotlin 컬렉션 유형 및 하위 유형
* Kotlin `interface` 유형
* Kotlin 기본 유형
* Kotlin `inline` 클래스
* Kotlin `Any` 유형
* Kotlin 함수 유형 및 하위 유형
* Objective-C 클래스 및 프로토콜

[Kotlin-Swift interopedia에서 예제 모음을 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions).

### Kotlin 싱글톤

Kotlin 싱글톤 (`companion object` 포함, `object` 선언으로 작성)은 단일 인스턴스가 있는 클래스로 Swift/Objective-C로 가져옵니다.

인스턴스는 `shared` 및 `companion` 속성을 통해 사용할 수 있습니다.

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

다음과 같이 이러한 객체에 액세스합니다.

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

:::note
Objective-C에서 `[MySingleton mySingleton]`를 통해 객체에 액세스하고 Swift에서 `MySingleton()`에 액세스하는 것은 더 이상 사용되지 않습니다.

:::

Kotlin-Swift interopedia에서 더 많은 예제를 참조하세요.

* [`shared`를 사용하여 Kotlin 객체에 액세스하는 방법](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects)
* [Swift에서 Kotlin companion 객체의 멤버에 액세스하는 방법](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects).

### NSNumber

Kotlin 기본 유형 상자는 특수 Swift/Objective-C 클래스에 매핑됩니다.
예를 들어 `kotlin.Int` 상자는 Swift에서 `KotlinInt` 클래스 인스턴스로 표시됩니다 (또는 Objective-C에서 `${prefix}Int` 인스턴스로, 여기서 `prefix`는 프레임워크 이름 접두사입니다).
이러한 클래스는 `NSNumber`에서 파생되므로 인스턴스는 해당 작업을 지원하는 적절한 `NSNumber`입니다.

`NSNumber` 유형은 Swift/Objective-C 매개변수 유형 또는 반환 값으로 사용될 때 Kotlin 기본 유형으로 자동 변환되지 않습니다.
그 이유는 `NSNumber` 유형이 래핑된 기본 값 유형에 대한 충분한 정보를 제공하지 않기 때문입니다. 예를 들어 `NSNumber`는 정적으로 `Byte`, `Boolean` 또는 `Double`로 알려져 있지 않습니다.
따라서 Kotlin 기본 값은 [`NSNumber`에서 수동으로 캐스팅해야 합니다](#casting-between-mapped-types).

### NSMutableString

`NSMutableString` Objective-C 클래스는 Kotlin에서 사용할 수 없습니다.
`NSMutableString`의 모든 인스턴스는 Kotlin으로 전달될 때 복사됩니다.

### 컬렉션

Kotlin 컬렉션은 [위의 표](#mappings)에 설명된 대로 Swift/Objective-C 컬렉션으로 변환됩니다.
Swift/Objective-C 컬렉션은 `NSMutableSet` 및 `NSMutableDictionary`를 제외하고 동일한 방식으로 Kotlin에 매핑됩니다.

`NSMutableSet`은 Kotlin `MutableSet`으로 변환되지 않습니다.
객체를 Kotlin `MutableSet`에 전달하려면 Kotlin 컬렉션의 종류를 명시적으로 만드세요.
이를 위해 Kotlin에서 `mutableSetOf()` 함수 또는 Swift에서 `KotlinMutableSet` 클래스 및 Objective-C에서 `${prefix}MutableSet`(`prefix`는 프레임워크 이름 접두사)를 사용하세요.
`MutableMap`도 마찬가지입니다.

[Kotlin-Swift interopedia에서 예제를 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections).

### 함수 유형

Kotlin 함수 유형 객체 (예: 람다)는 Swift에서 함수로, Objective-C에서 블록으로 변환됩니다.
[Kotlin-Swift interopedia에서 람다가 있는 Kotlin 함수 예제를 참조하세요](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type).

그러나 함수와 함수 유형을 변환할 때 매개변수 및 반환 값의 유형이 매핑되는 방식에는 차이가 있습니다.
후자의 경우 기본 유형은 상자형 표현에 매핑됩니다.
Kotlin `Unit` 반환 값은 Swift/Objective-C에서 해당 `Unit` 싱글톤으로 표시됩니다.
이 싱글톤의 값은 다른 Kotlin `object`와 동일한 방식으로 검색할 수 있습니다.
[위의 표](#mappings)에서 싱글톤을 참조하세요.

다음 Kotlin 함수를 고려하세요.

```kotlin
fun foo(block: (Int) `->` Unit) { ... }
```

Swift에서는 다음과 같이 표시됩니다.

```swift
func foo(block: (KotlinInt) `->` KotlinUnit)
```

다음을 통해 호출할 수 있습니다.

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### 제네릭

Objective-C는 비교적 제한된 기능 세트로 클래스에 정의된 "lightweight generics"를 지원합니다. Swift는 컴파일러에 추가 유형 정보를 제공하는 데 도움이 되도록 클래스에 정의된 제네릭을 가져올 수 있습니다.

Objective-C 및 Swift에 대한 제네릭 기능 지원은 Kotlin과 다르므로 변환은 필연적으로 일부 정보를 잃게 되지만 지원되는 기능은 의미 있는 정보를 유지합니다.

Swift에서 Kotlin 제네릭을 사용하는 방법에 대한 특정 예제는 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift)를 참조하세요.

#### 제한 사항

Objective-C 제네릭은 Kotlin 또는 Swift의 모든 기능을 지원하지 않으므로 변환에서 일부 정보가 손실됩니다.

제네릭은 인터페이스 (Objective-C 및 Swift의 프로토콜) 또는 함수가 아닌 클래스에서만 정의할 수 있습니다.

#### Nullability

Kotlin과 Swift는 모두 유형 사양의 일부로 nullability를 정의하는 반면 Objective-C는 유형의 메서드 및 속성에 nullability를 정의합니다. 따라서 다음 Kotlin 코드는

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

Swift에서는 다음과 같습니다.

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

잠재적으로 nullable한 유형을 지원하려면 Objective-C 헤더는 nullable한 반환 값으로 `myVal`을 정의해야 합니다.

이를 완화하려면 제네릭 클래스를 정의할 때 제네릭 유형이 _never_ null이 되어야 하는 경우 nullable하지 않은 유형 제약 조건을 제공하세요.

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

이렇게 하면 Objective-C 헤더에서 `myVal`을 nullable하지 않은 것으로 표시합니다.

#### Variance

Objective-C에서는 제네릭을 공변 또는 반변으로 선언할 수 있습니다. Swift는 variance를 지원하지 않습니다. Objective-C에서 오는 제네릭 클래스는 필요에 따라 강제로 캐스팅할 수 있습니다.

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 제약 조건

Kotlin에서는 제네릭 유형에 대한 상한을 제공할 수 있습니다. Objective-C도 이를 지원하지만 더 복잡한 경우에는 지원되지 않으며 현재 Kotlin - Objective-C interop에서 지원되지 않습니다. 예외는 nullable하지 않은 상한이 Objective-C 메서드/속성을 nullable하지 않게 만든다는 것입니다.

#### 비활성화하려면

프레임워크 헤더가 제네릭 없이 작성되도록 하려면 빌드 파일에 다음 컴파일러 옵션을 추가하세요.

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### Forward 선언

Forward 선언을 가져오려면 `objcnames.classes` 및 `objcnames.protocols` 패키지를 사용하세요. 예를 들어
`library.package`가 있는 Objective-C 라이브러리에 선언된 `objcprotocolName` forward 선언을 가져오려면
특수 forward 선언 패키지인 `import objcnames.protocols.objcprotocolName`을 사용하세요.

`objcnames.protocols.ForwardDeclaredProtocolProtocol`을 사용하는 첫 번째 objcinterop 라이브러리와
다른 패키지에 실제 구현이 있는 두 번째 라이브러리를 고려해 보세요.

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

두 라이브러리 간에 객체를 전송하려면 Kotlin 코드에서 명시적 `as` 캐스트를 사용하세요.

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

:::note
해당하는 실제 클래스에서만 `objcnames.protocols.ForwardDeclaredProtocolProtocol`로 캐스팅할 수 있습니다.
그렇지 않으면 오류가 발생합니다.

:::

## 매핑된 유형 간 캐스팅

Kotlin 코드를 작성할 때 객체를 Kotlin 유형에서 해당 Swift/Objective-C 유형으로 (또는 그 반대로) 변환해야 할 수 있습니다.
이 경우 일반 Kotlin 캐스트를 사용할 수 있습니다. 예를 들면 다음과 같습니다.

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## 하위 클래스 만들기

### Swift/Objective-C에서 Kotlin 클래스 및 인터페이스 하위 클래스 만들기

Kotlin 클래스 및 인터페이스는 Swift/Objective-C 클래스 및 프로토콜에서 하위 클래스를 만들 수 있습니다.

### Kotlin에서 Swift/Objective-C 클래스 및 프로토콜 하위 클래스 만들기

Swift/Objective-C 클래스 및 프로토콜은 Kotlin `final` 클래스로 하위 클래스를 만들 수 있습니다. Swift/Objective-C 유형을 상속하는 Non-`final` Kotlin 클래스는 아직 지원되지 않으므로 Swift/Objective-C 유형을 상속하는 복잡한 클래스 계층 구조를 선언할 수 없습니다.

일반 메서드는 `override` Kotlin 키워드를 사용하여 재정의할 수 있습니다. 이 경우 재정의하는 메서드는 재정의된 메서드와 동일한 매개변수 이름을 가져야 합니다.

때로는 `UIViewController`에서 하위 클래스를 만들 때와 같이 initializer를 재정의해야 합니다. Kotlin 생성자로 가져온 initializer는 `@OverrideInit` 어노테이션으로 표시된 Kotlin 생성자로 재정의할 수 있습니다.

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

재정의하는 생성자는 재정의된 생성자와 동일한 매개변수 이름과 유형을 가져야 합니다.

충돌하는 Kotlin 시그니처로 다른 메서드를 재정의하려면 클래스에 `@ObjCSignatureOverride` 어노테이션을 추가할 수 있습니다.
이 어노테이션은 동일한 인수 유형이지만 다른 인수 이름을 가진 여러 함수가 Objective-C 클래스에서 상속된 경우 Kotlin 컴파일러에 충돌하는 오버로드를 무시하도록 지시합니다.

기본적으로 Kotlin/Native 컴파일러는 지정되지 않은 Objective-C initializer를 `super()` 생성자로 호출할 수 없습니다.
지정된 initializer가 Objective-C 라이브러리에서 제대로 표시되지 않은 경우 이 동작이 불편할 수 있습니다. 이러한 컴파일러 검사를 비활성화하려면 라이브러리의 [`.def` 파일](native-definition-file)에 `disableDesignatedInitializerChecks = true`를 추가하세요.

## C 기능

라이브러리가 안전하지 않은 포인터, 구조체 등과 같은 일부 일반 C 기능을 사용하는 예제는 [C와의 상호 운용성](native-c-interop)을 참조하세요.

## 지원되지 않음

Kotlin 프로그래밍 언