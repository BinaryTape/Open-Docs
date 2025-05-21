---
title: "與 Swift/Objective-C 的互通性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Objective-C 函式庫匯入是 [實驗性的 (Experimental)](components-stability#stability-levels-explained)。
所有由 cinterop 工具從 Objective-C 函式庫產生的 Kotlin 宣告都應具有 `@ExperimentalForeignApi` 註解。

與 Kotlin/Native 一起提供的原生平台函式庫 (例如 Foundation、UIKit 和 POSIX) 僅針對某些 API 需要選擇加入 (opt-in)。

本文涵蓋了 Kotlin/Native 與 Swift/Objective-C 互通性的某些方面：如何在 Swift/Objective-C 程式碼中使用 Kotlin 宣告，以及如何在 Kotlin 程式碼中使用 Objective-C 宣告。

您可能會覺得其他資源也很有用：

* [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)，其中收集了如何在 Swift 程式碼中使用 Kotlin 宣告的範例。
* [與 Swift/Objective-C ARC 整合](native-arc-integration) 區段，涵蓋了 Kotlin 的追蹤 GC 和 Objective-C 的 ARC 之間整合的詳細資訊。

## 將 Swift/Objective-C 函式庫匯入 Kotlin

如果正確匯入到建置 (預設會匯入系統框架)，則 Objective-C 框架和函式庫可以在 Kotlin 程式碼中使用。
有關更多詳細資訊，請參閱：

* [建立和配置函式庫定義檔](native-definition-file)
* [配置原生函式庫的編譯](multiplatform-configure-compilations#configure-interop-with-native-languages)

如果 Swift 函式庫的 API 使用 `@objc` 匯出到 Objective-C，則可以在 Kotlin 程式碼中使用 Swift 函式庫。
目前尚不支援純 Swift 模組。

## 在 Swift/Objective-C 中使用 Kotlin

如果將 Kotlin 模組編譯到框架中，則可以在 Swift/Objective-C 程式碼中使用 Kotlin 模組：

* 請參閱[建置最終原生二進制檔案](multiplatform-build-native-binaries#declare-binaries)以了解如何宣告二進制檔案。
* 查看 [Kotlin Multiplatform 範例專案](https://github.com/Kotlin/kmm-basic-sample) 以取得範例。

### 從 Objective-C 和 Swift 隱藏 Kotlin 宣告

`@HiddenFromObjC` 註解是 [實驗性的 (Experimental)](components-stability#stability-levels-explained)，並且需要 [選擇加入 (opt-in)](opt-in-requirements)。

為了使您的 Kotlin 程式碼更適合 Objective-C/Swift，您可以使用 `@HiddenFromObjC` 從 Objective-C 和 Swift 隱藏 Kotlin 宣告。 該註解會停用函式或屬性匯出到 Objective-C。

或者，您可以使用 `internal` 修飾符標記 Kotlin 宣告，以限制其在編譯模組中的可見性。 如果您只想從 Objective-C 和 Swift 隱藏 Kotlin 宣告，但仍使其對其他 Kotlin 模組可見，請選擇 `@HiddenFromObjC`。

[請參閱 Kotlin-Swift interopedia 中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC)。

### 在 Swift 中使用 refining

`@ShouldRefineInSwift` 註解是 [實驗性的 (Experimental)](components-stability#stability-levels-explained)，並且需要 [選擇加入 (opt-in)](opt-in-requirements)。

`@ShouldRefineInSwift` 幫助使用 Swift 編寫的包裝函式替換 Kotlin 宣告。 該註解在產生的 Objective-C API 中將函式或屬性標記為 `swift_private`。 這些宣告具有 `__` 字首，這使得它們在 Swift 中不可見。

您仍然可以在 Swift 程式碼中使用這些宣告來建立 Swift 友好的 API，但它們不會在 Xcode 自動完成中建議。

* 有關在 Swift 中 refining Objective-C 宣告的更多資訊，請參閱 [Apple 官方文件](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。
* 有關如何使用 `@ShouldRefineInSwift` 註解的範例，請參閱 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift)。

### 變更宣告名稱

`@ObjCName` 註解是 [實驗性的 (Experimental)](components-stability#stability-levels-explained)，並且需要 [選擇加入 (opt-in)](opt-in-requirements)。

為了避免重新命名 Kotlin 宣告，請使用 `@ObjCName` 註解。 它指示 Kotlin 編譯器對帶註解的類別、介面或其他 Kotlin 實體使用自訂的 Objective-C 和 Swift 名稱：

```kotlin
@ObjCName(swiftName = "MySwiftArray")
class MyKotlinArray {
    @ObjCName("index")
    fun indexOf(@ObjCName("of") element: String): Int = TODO()
}

// 使用 ObjCName 註解
let array = MySwiftArray()
let index = array.index(of: "element")
```

[請參閱 Kotlin-Swift interopedia 中的另一個範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName)。

### 使用 KDoc 註解提供文件

文件對於理解任何 API 至關重要。 為共用的 Kotlin API 提供文件可讓您與其使用者溝通有關使用、注意事項等。

預設情況下，在產生 Objective-C 標頭時，[KDocs](kotlin-doc) 註解不會轉換為相應的註解。 例如，以下帶有 KDoc 的 Kotlin 程式碼：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

將產生沒有任何註解的 Objective-C 宣告：

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

若要啟用 KDoc 註解的匯出，請將以下編譯器選項新增到您的 `build.gradle(.kts)`：

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

之後，Objective-C 標頭將包含相應的註解：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

您將能夠在自動完成中看到類別和方法的註解，例如，在 Xcode 中。 如果您轉到函式的定義 (在 `.h` 檔案中)，您將看到 `@param`、`@return` 等註解。

已知限制：

將 KDoc 註解匯出到產生的 Objective-C 標頭的功能是 [實驗性的 (Experimental)](components-stability)。
它可能隨時被刪除或變更。
需要選擇加入 (opt-in) (請參閱下面的詳細資訊)，您應該僅將其用於評估目的。
我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 中提供有關它的回饋。

* 除非依賴項本身使用 `-Xexport-kdoc` 進行編譯，否則不會匯出依賴項文件。 該功能是實驗性的 (Experimental)，因此使用此選項編譯的函式庫可能與其他編譯器版本不相容。
* KDoc 註解主要按原樣匯出。 許多 KDoc 功能，例如 `@property`，不受支援。

## 對應

下表顯示了 Kotlin 概念如何對應到 Swift/Objective-C，反之亦然。

"`->`" 和 "`<-`" 表示對應僅單向進行。

| Kotlin                 | Swift                            | Objective-C                      | 備註                                                                              |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [備註](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | Initializer                      | Initializer                      | [備註](#initializers)                                                              |
| Property               | Property                         | Property                         | [備註 1](#top-level-functions-and-properties), [備註 2](#setters)                  |
| Method                 | Method                           | Method                           | [備註 1](#top-level-functions-and-properties), [備註 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [備註](#enums)                                                                     |
| `suspend` `->`           | `completionHandler:`/ `async`    | `completionHandler:`             | [備註 1](#errors-and-exceptions), [備註 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [備註](#errors-and-exceptions)                                                     |
| Extension              | Extension                        | Category member                  | [備註](#extensions-and-category-members)                                           |
| `companion` member `<-`  | Class method or property         | Class method or property         |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` or `companion` property | `shared` or `companion` property | [備註](#kotlin-singletons)                                                         |
| Primitive type         | Primitive type / `NSNumber`      |                                  | [備註](#nsnumber)                                                                  |
| `Unit` return type     | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       |                                                                                    |
| `String`               | `NSMutableString`                | `NSMutableString`                | [備註](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [備註](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [備註](#collections)                                                               |
| Function type          | Function type                    | Block pointer type               | [備註](#function-types)                                                            |
| Inline classes         | Unsupported                      | Unsupported                      | [備註](#unsupported)                                                               |

### 類別 (Classes)

#### 名稱翻譯

Objective-C 類別以其原始名稱匯入到 Kotlin。
協定 (Protocols) 會匯入為具有 `Protocol` 名稱後綴的介面，例如，`@protocol Foo` `->` `interface FooProtocol`。
這些類別和介面放置在 [建置配置中指定的套件](#importing-swift-objective-c-libraries-to-kotlin)
(預配置系統框架的 `platform.*` 套件)。

Kotlin 類別和介面的名稱在匯入到 Objective-C 時會加上字首。
字首源自框架名稱。

Objective-C 不支援框架中的套件。 如果 Kotlin 編譯器在同一個框架中找到具有相同名稱但不同套件的 Kotlin 類別，它會重新命名它們。 此演算法尚未穩定，並且可能在 Kotlin 版本之間變更。 為了解決這個問題，您可以重新命名框架中衝突的 Kotlin 類別。

#### 強式連結 (Strong linking)

每當您在 Kotlin 來源中使用 Objective-C 類別時，它都會被標記為強式連結符號。 產生的建置產物會將相關符號提及為強外部參考。

這表示應用程式會嘗試在啟動期間動態連結符號，如果它們不可用，應用程式會崩潰。
即使從未使用過這些符號，也會發生崩潰。 符號可能在特定裝置或 OS 版本上不可用。

為了解決這個問題並避免「找不到符號」錯誤，請使用 Swift 或 Objective-C 包裝函式來檢查該類別是否實際可用。 [請參閱 Compose Multiplatform 框架中如何實作此解決方案](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### 初始化器 (Initializers)

Swift/Objective-C 初始化器會匯入到 Kotlin 中，作為建構函式或名為 `create` 的 factory 方法。
後者發生在 Objective-C 類別中宣告的初始化器或作為 Swift 擴充功能中宣告的初始化器，因為 Kotlin 沒有擴充建構函式的概念。

在將 Swift 初始化器匯入到 Kotlin 之前，請不要忘記使用 `@objc` 標註它們。

Kotlin 建構函式會匯入為 Swift/Objective-C 的初始化器。

### Setters

覆寫超類別的唯讀屬性的可寫 Objective-C 屬性表示為屬性 `foo` 的 `setFoo()` 方法。 對於實作為可變的協定的唯讀屬性也是如此。

### Top-level 函式和屬性

Top-level Kotlin 函式和屬性可以作為特殊類別的成員存取。
每個 Kotlin 檔案都會轉換為這樣一個類別，例如：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

然後，您可以從 Swift 呼叫 `foo()` 函式，如下所示：

```swift
MyLibraryUtilsKt.foo()
```

請參閱 Kotlin-Swift interopedia 中有關存取 top-level Kotlin 宣告的範例集合：

* [Top-level 函式](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions)
* [Top-level 唯讀屬性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties)
* [Top-level 可變屬性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties)

### 方法名稱翻譯 (Method names translation)

通常，Swift 引數標籤和 Objective-C 選擇器片段會對應到 Kotlin 參數名稱。 這兩個概念具有不同的語意，因此有時可以使用衝突的 Kotlin 簽章匯入 Swift/Objective-C 方法。
在這種情況下，可以使用具名引數從 Kotlin 呼叫衝突的方法，例如：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

在 Kotlin 中，它是：

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

以下是 `kotlin.Any` 函式如何對應到 Swift/Objective-C：

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[請參閱 Kotlin-Swift interopedia 中帶有資料類別的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes)。

您可以在 Swift 或 Objective-C 中指定更慣用的名稱，而不是使用 [`@ObjCName` 註解](#change-declaration-names) 重新命名 Kotlin 宣告。

### 錯誤和例外 (Errors and exceptions)

所有 Kotlin 例外都是 unchecked，這表示錯誤是在執行階段捕獲的。 但是，Swift 只有在編譯時處理的 checked 錯誤。 因此，如果 Swift 或 Objective-C 程式碼呼叫拋出例外的 Kotlin 方法，則應使用 `@Throws` 註解標記 Kotlin 方法，並指定「預期」例外類別的清單。

編譯到 Objective-C/Swift 框架時，具有或繼承 `@Throws` 註解的非 `suspend` 函式表示為 Objective-C 中的 `NSError*`-產生方法和 Swift 中的 `throws` 方法。
`suspend` 函式的表示形式始終在 completion handler 中具有 `NSError*`/`Error` 參數。

當從 Swift/Objective-C 程式碼呼叫的 Kotlin 函式拋出例外時，該例外是 `@Throws`-指定類別或其子類別之一的實例，則會將其作為 `NSError` 傳播。
到達 Swift/Objective-C 的其他 Kotlin 例外被視為未處理並導致程式終止。

沒有 `@Throws` 的 `suspend` 函式僅傳播 `CancellationException` (作為 `NSError`)。
沒有 `@Throws` 的非 `suspend` 函式根本不傳播 Kotlin 例外。

請注意，尚未實作相反的反向翻譯：Swift/Objective-C 拋出錯誤的方法未匯入到 Kotlin 作為拋出例外。

[請參閱 Kotlin-Swift interopedia 中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions)。

### 列舉 (Enums)

Kotlin 列舉作為 `@interface` 匯入到 Objective-C 中，並作為 `class` 匯入到 Swift 中。
這些資料結構具有與每個列舉值對應的屬性。 考慮以下 Kotlin 程式碼：

```kotlin
// Kotlin
enum class Colors {
    RED, GREEN, BLUE
}
```

您可以從 Swift 存取此列舉類別的屬性，如下所示：

```swift
// Swift
Colors.red
Colors.green
Colors.blue
```

若要在 Swift `switch` 語句中使用 Kotlin 列舉的變數，請提供預設語句以防止編譯錯誤：

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[請參閱 Kotlin-Swift interopedia 中的另一個範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes)。

### 暫停函式 (Suspending functions)

從 Swift 程式碼呼叫 `suspend` 函式作為 `async` 的支援是 [實驗性的 (Experimental)](components-stability)。
它可能隨時被刪除或變更。
僅將其用於評估目的。 我們將感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 中提供有關它的回饋。

Kotlin 的 [暫停函式](coroutines-basics) (`suspend`) 在產生的 Objective-C 標頭中表示為具有回呼的函式，或 Swift/Objective-C 術語中的 [completion handlers](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)。

從 Swift 5.5 開始，Kotlin 的 `suspend` 函式也可以從 Swift 作為 `async` 函式呼叫，而無需使用 completion handlers。 目前，此功能具有高度實驗性，並且具有某些限制。 有關詳細資訊，請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47610)。

* 在 Swift 文件中了解有關 [`async`/`await` 機制的更多資訊](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)。
* 請參閱 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions) 中實作相同功能的第三方函式庫的範例和建議。

### 擴充功能和類別成員 (Extensions and category members)

Objective-C 類別和 Swift 擴充功能的成員通常作為擴充功能匯入到 Kotlin。 這就是為什麼這些宣告無法在 Kotlin 中覆寫，並且擴充初始化器不可用作 Kotlin 建構函式的原因。

目前，有兩個例外。 從 Kotlin 1.8.20 開始，與 NSView 類別 (來自 AppKit 框架) 或 UIView 類別 (來自 UIKit 框架) 相同的標頭中宣告的類別成員會匯入為這些類別的成員。 這表示您可以覆寫從 NSView 或 UIView 子類別化的方法。

:::

Kotlin 對「常規」Kotlin 類別的擴充功能分別作為擴充功能和類別成員匯入到 Swift 和 Objective-C。 對於其他類型的 Kotlin 擴充功能被視為具有額外接收器參數的 [top-level 宣告](#top-level-functions-and-properties)。 這些類型包括：

* Kotlin `String` 類型
* Kotlin 集合類型和子類型
* Kotlin `interface` 類型
* Kotlin 原始類型
* Kotlin `inline` 類別
* Kotlin `Any` 類型
* Kotlin 函式類型和子類型
* Objective-C 類別和協定 (protocols)

[請參閱 Kotlin-Swift interopedia 中的範例集合](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlin 單例 (Singletons)

Kotlin 單例 (使用 `object` 宣告建立，包括 `companion object`) 作為具有單個實例的類別匯入到 Swift/Objective-C。

該實例可通過 `shared` 和 `companion` 屬性取得。

對於以下 Kotlin 程式碼：

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

如下所示存取這些物件：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

:::note
在 Objective-C 中透過 `[MySingleton mySingleton]` 存取物件，在 Swift 中透過 `MySingleton()` 存取物件已被取代。

:::

請參閱 Kotlin-Swift interopedia 中的更多範例：

* [如何使用 `shared` 存取 Kotlin 物件](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects)
* [如何從 Swift 存取 Kotlin 伴生物件的成員](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects)。

### NSNumber

Kotlin 原始類型 box 對應到特殊的 Swift/Objective-C 類別。 例如，`kotlin.Int` box 在 Swift 中表示為 `KotlinInt` 類別實例 (或在 Objective-C 中表示為 `${prefix}Int` 實例，其中 `prefix` 是框架名稱字首)。
這些類別源自 `NSNumber`，因此這些實例是正確的 `NSNumber`，支援所有相應的操作。

當 `NSNumber` 類型用作 Swift/Objective-C 參數類型或傳回值時，不會自動轉換為 Kotlin 原始類型。 原因是 `NSNumber` 類型沒有提供有關包裝的原始值類型的足夠資訊，例如，`NSNumber` 在靜態上不知道是 `Byte`、`Boolean` 還是 `Double`。 因此，應[手動在 `NSNumber` 之間轉換 Kotlin 原始值](#casting-between-mapped-types)。

### NSMutableString

Kotlin 無法使用 `NSMutableString` Objective-C 類別。
將所有 `NSMutableString` 實例複製到 Kotlin 時。

### 集合 (Collections)

Kotlin 集合會轉換為 Swift/Objective-C 集合，如[上表](#mappings)中所述。
Swift/Objective-C 集合以相同的方式對應到 Kotlin，除了 `NSMutableSet` 和 `NSMutableDictionary`。

`NSMutableSet` 不會轉換為 Kotlin `MutableSet`。 若要將物件傳遞到 Kotlin `MutableSet`，請明確建立此類 Kotlin 集合。
為此，請使用 Kotlin 中的 `mutableSetOf()` 函式或 Swift 中的 `KotlinMutableSet` 類別以及 Objective-C 中的 `${prefix}MutableSet` (`prefix` 是框架名稱字首)。
對於 `MutableMap` 也是如此。

[請參閱 Kotlin-Swift interopedia 中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections)。

### 函式類型 (Function types)

Kotlin 函式類型物件 (例如，lambdas) 會轉換為 Swift 中的函式和 Objective-C 中的區塊。
[請參閱 Kotlin-Swift interopedia 中帶有 lambda 的 Kotlin 函式的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type)。

但是，在翻譯函式和函式類型時，參數和傳回值的類型對應方式有所不同。 在後一種情況下，原始類型會對應到其 boxed 表示形式。 Kotlin `Unit` 傳回值在 Swift/Objective-C 中表示為相應的 `Unit` 單例。 可以使用與任何其他 Kotlin `object` 相同的方式檢索此單例的值。 請參閱[上表](#mappings)中的單例。

考慮以下 Kotlin 函式：

```kotlin
fun foo(block: (Int) `->` Unit) { ... }
```

它在 Swift 中表示如下：

```swift
func foo(block: (KotlinInt) `->` KotlinUnit)
```

您可以像這樣呼叫它：

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### 泛型 (Generics)

Objective-C 支援在類別上定義的「lightweight generics」，其功能集相對有限。 Swift 可以匯入在類別上定義的泛型，以幫助為編譯器提供額外的類型資訊。

Objective-C 和 Swift 的泛型功能支援與 Kotlin 不同，因此翻譯不可避免地會遺失一些資訊，但支援的功能會保留有意義的資訊。

有關如何在 Swift 中使用 Kotlin 泛型的特定範例，請參閱 [Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift)。

#### 限制

Objective-C 泛型不支援 Kotlin 或 Swift 的所有功能，因此翻譯中會遺失一些資訊。

泛型只能在類別上定義，不能在介面 (Objective-C 和 Swift 中的協定 (protocols)) 或函式上定義。

#### Nullability

Kotlin 和 Swift 都將 nullability 定義為類型規格的一部分，而 Objective-C 在類型的屬性和方法上定義 nullability。 因此，以下 Kotlin 程式碼：

```kotlin
class Sample<T>() {
    fun myVal(): T
}
```

在 Swift 中看起來像這樣：

```swift
class Sample<T>() {
    fun myVal(): T?
}
```

為了支援可能為 null 的類型，Objective-C 標頭需要使用可為 null 的傳回值來定義 `myVal`。

為了減輕這種情況，在定義泛型類別時，如果泛型類型_絕對不能_為 null，請提供非 null 類型約束：

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

這將強制 Objective-C 標頭將 `myVal` 標記為非 null。

#### Variance

Objective-C 允許將泛型宣告為 covariant 或 contravariant。 Swift 不支援 variance。 來自 Objective-C 的泛型類別可以根據需要強制轉換。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 限制 (Constraints)

在 Kotlin 中，您可以為泛型類型提供上限。 Objective-C 也支援此功能，但在更複雜的情況下，該支援不可用，並且目前在 Kotlin - Objective-C 互通中不受支援。 這裡的例外情況是非 null 上限將使 Objective-C 方法/屬性非 null。

#### 停用

若要使框架標頭在沒有泛型的情況下編寫，請在您的建置檔案中新增以下編譯器選項：

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 轉發宣告 (Forward declarations)

若要匯入轉發宣告，請使用 `objcnames.classes` 和 `objcnames.protocols` 套件。 例如，若要匯入在 Objective-C 函式庫中使用 `library.package` 宣告的 `objcprotocolName` 轉發宣告，請使用特殊的轉發宣告套件：`import objcnames.protocols.objcprotocolName`。

考慮兩個 objcinterop 函式庫：一個使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一個在另一個套件中使用實際實作：

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

若要在兩個函式庫之間傳輸物件，請在您的 Kotlin 程式碼中使用明確的 `as` 轉換：

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

:::note
您只能從相應的真實類別轉換為 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。
否則，您將收到錯誤。

:::

## 在對應類型之間轉換 (Casting between mapped types)

編寫 Kotlin 程式碼時，可能需要將物件從 Kotlin 類型轉換為等效的 Swift/Objective-C 類型 (反之亦然)。 在這種情況下，可以使用簡單的舊 Kotlin 轉換，例如：

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## 子類別化 (Subclassing)

### 從 Swift/Objective-C 子類別化 Kotlin 類別和介面

Kotlin 類別和介面可以由 Swift/Objective-C 類別和協定 (protocols) 子類別化。

### 從 Kotlin 子類別化 Swift/Objective-C 類別和協定 (protocols)

Swift/Objective-C 類別和協定 (protocols) 可以使用 Kotlin `final` 類別子類別化。 尚不支援繼承 Swift/Objective-C 類型的非 `final` Kotlin 類別，因此無法宣告繼承 Swift/Objective-C 類型的複雜類別層次結構。

可以使用 `override` Kotlin 關鍵字覆寫正常方法。 在這種情況下，覆寫方法必須具有與覆寫方法相同的參數名稱。

有時需要覆寫初始化器，例如在子類別化 `UIViewController` 時。 作為 Kotlin 建構函式匯入的初始化器可以由使用 `@OverrideInit` 註解標記的 Kotlin 建構函式覆寫：

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

覆寫建構函式必須具有與覆寫建構函式相同的參數名稱和類型。

若要覆寫具有衝突 Kotlin 簽章的不同方法，您可以將 `@ObjCSignatureOverride` 註解新增到類別。
如果從 Objective-C 類別繼承了具有相同引數類型但引數名稱不同的多個函式，則該註解會指示 Kotlin 編譯器忽略衝突的過載。

預設情況下，Kotlin/Native 編譯器不允許呼叫非指定 Objective-C 初始化器作為 `super()` 建構函式。 如果在 Objective-C 函式庫中未正確標記指定初始化器，則此行為可能不方便。 若要停用這些編譯器檢查，請將 `disableDesignatedInitializerChecks = true` 新增到函式庫的 [`.def` 檔案](native-definition-file)。

## C 功能

有關函式庫使用一些簡單 C 功能 (例如不安全指標、結構等) 的範例案例，請參閱 [與 C 的互通性](native-c-interop)。

## 不支援 (Unsupported)

Kotlin 程式語言的某些功能尚未對應到 Objective-C 或 Swift 的相應功能。
目前，產生的框架標頭中未正確公開以下功能：

* Inline 類別 (引數對應為基礎原始類型或 `id`)
* 實作標準 Kotlin 集合介面 (`List`、`Map`、`Set`) 和其他特殊類別的自訂類別
* Objective-C 類別的 Kotlin 子類別

  ```