[//]: # (title: 與 Swift/Objective-C 的互通性)

> Objective-C 函式庫的匯入是 [實驗性](components-stability.md#stability-levels-explained) 功能。
> 所有由 cinterop 工具從 Objective-C 函式庫產生的 Kotlin 宣告
> 都應帶有 `@ExperimentalForeignApi` 註解。
>
> Kotlin/Native 隨附的原生平台函式庫 (如 Foundation、UIKit 和 POSIX)
> 僅部分 API 需要選擇啟用。
>
{style="warning"}

Kotlin/Native 透過 Objective-C 提供與 Swift 的間接互通性。本文件涵蓋如何在 Swift/Objective-C 程式碼中使用 Kotlin
宣告，以及如何在 Kotlin 程式碼中使用 Objective-C 宣告。

您可能會發現以下其他資源很有用：

*   [Kotlin-Swift 互通百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)，這是關於如何在 Swift 程式碼中使用 Kotlin 宣告的範例集合。
*   [與 Swift/Objective-C ARC 整合](native-arc-integration.md) 章節，涵蓋 Kotlin 的追蹤式垃圾回收 (tracing GC) 與 Objective-C 的 ARC 之間整合的詳細資訊。

## 將 Swift/Objective-C 函式庫匯入 Kotlin

Objective-C 框架和函式庫如果正確匯入建置中，即可在 Kotlin 程式碼中使用 (系統框架預設匯入)。
有關更多詳細資訊，請參閱：

*   [建立與配置函式庫定義檔](native-definition-file.md)
*   [配置原生函式庫的編譯](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-configure-compilations.html#configure-interop-with-native-languages)

如果 Swift 函式庫的 API 已透過 `@objc` 導出到 Objective-C，則可在 Kotlin 程式碼中使用。
純 Swift 模組尚未支援。

## 在 Swift/Objective-C 中使用 Kotlin

Kotlin 模組如果編譯成框架，即可在 Swift/Objective-C 程式碼中使用：

*   請參閱 [建置最終原生二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries) 以了解如何宣告二進位檔。
*   查看 [Kotlin Multiplatform 範例專案](https://github.com/Kotlin/kmm-basic-sample) 以獲得範例。

### 從 Objective-C 和 Swift 隱藏 Kotlin 宣告

> `@HiddenFromObjC` 註解是 [實驗性](components-stability.md#stability-levels-explained) 功能，且需要 [選擇啟用](opt-in-requirements.md)。
>
{style="warning"}

為了讓您的 Kotlin 程式碼更符合 Swift/Objective-C 的習慣，請使用 `@HiddenFromObjC` 註解來從 Objective-C 和 Swift 隱藏 Kotlin 宣告。
這會停用函式或屬性導出到 Objective-C。

或者，您可以使用 `internal` 修飾符標記 Kotlin 宣告，以限制它們在編譯模組中的可見性。
如果您想從 Objective-C 和 Swift 隱藏 Kotlin 宣告，同時保持它對其他 Kotlin 模組可見，請使用 `@HiddenFromObjC`。

[請參閱 Kotlin-Swift 互通百科中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/HiddenFromObjC.md)。

### 在 Swift 中使用精煉 (Refining)

> `@ShouldRefineInSwift` 註解是 [實驗性](components-stability.md#stability-levels-explained) 功能，且需要 [選擇啟用](opt-in-requirements.md)。
>
{style="warning"}

`@ShouldRefineInSwift` 有助於將 Kotlin 宣告替換為以 Swift 編寫的包裝器。此註解將函式或屬性標記為在產生的 Objective-C API 中為 `swift_private`。
此類宣告會獲得 `__` 字首，使其在 Swift 中不可見。

您仍然可以在 Swift 程式碼中使用這些宣告來建立 Swift 友好的 API，但它們不會在 Xcode 自動完成中建議。

*   有關在 Swift 中精煉 Objective-C 宣告的更多資訊，請參閱 [Apple 官方文件](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。
*   有關如何使用 `@ShouldRefineInSwift` 註解的範例，請參閱 [Kotlin-Swift 互通百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

### 更改宣告名稱

> `@ObjCName` 註解是 [實驗性](components-stability.md#stability-levels-explained) 功能，且需要 [選擇啟用](opt-in-requirements.md)。
>
{style="warning"}

為了避免重新命名 Kotlin 宣告，請使用 `@ObjCName` 註解。它指示 Kotlin 編譯器為帶註解的類別、介面或其他 Kotlin 實體使用自訂的 Objective-C 和 Swift 名稱：

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

[請參閱 Kotlin-Swift 互通百科中的另一個範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ObjCName.md)。

### 提供 KDoc 註解文件

文件對於理解任何 API 都至關重要。為共享的 Kotlin API 提供文件可讓您與其使用者溝通使用方式、注意事項等。

預設情況下，[KDoc](kotlin-doc.md) 註解在產生 Objective-C 標頭時不會轉換為相應的註解。例如，以下帶有 KDoc 的 Kotlin 程式碼：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

將產生一個沒有任何註解的 Objective-C 宣告：

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

若要啟用 KDoc 註解的導出，請將以下編譯器選項新增到您的 `build.gradle(.kts)` 中：

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

之後，Objective-C 標頭將包含相應的註解：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

您將能夠在自動完成中看到類別和方法的註解，例如在 Xcode 中。如果您轉到函式的定義 (在 `.h` 檔案中)，您將看到 `@param`、`@return` 等的註解。

已知限制：

> 將 KDoc 註解導出到產生的 Objective-C 標頭的功能是 [實驗性](components-stability.md)。
> 它可能隨時被移除或更改。
> 需要選擇啟用 (詳見下方)，您應該只用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 上提供回饋。
>
{style="warning"}

*   除非依賴項本身也使用 `-Xexport-kdoc` 編譯，否則其文件不會導出。此功能為實驗性，
    因此使用此選項編譯的函式庫可能與其他編譯器版本不相容。
*   KDoc 註解大部分按原樣導出。許多 KDoc 功能，例如 `@property`，不支援。

## 映射

下表顯示了 Kotlin 概念如何映射到 Swift/Objective-C，反之亦然。

「->」和「<-」表示映射僅單向進行。

| Kotlin                 | Swift                            | Objective-C                      | 註解                                                                               |
|------------------------|----------------------------------|----------------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                          | `@interface`                     | [註解](#classes)                                                                   |
| `interface`            | `protocol`                       | `@protocol`                      |                                                                                    |
| `constructor`/`create` | 初始化器                         | 初始化器                         | [註解](#initializers)                                                              |
| 屬性                     | 屬性                             | 屬性                             | [註解 1](#top-level-functions-and-properties)、[註解 2](#setters)                  |
| 方法                     | 方法                             | 方法                             | [註解 1](#top-level-functions-and-properties)、[註解 2](#method-names-translation) |
| `enum class`           | `class`                          | `@interface`                     | [註解](#enums)                                                                     |
| `suspend` ->           | `completionHandler:`/ `async`    | `completionHandler:`             | [註解 1](#errors-and-exceptions)、[註解 2](#suspending-functions)                  |
| `@Throws fun`          | `throws`                         | `error:(NSError**)error`         | [註解](#errors-and-exceptions)                                                     |
| 擴展                     | 擴展                             | 類別 (Category) 成員             | [註解](#extensions-and-category-members)                                           |
| `companion` 成員 <-    | 類別方法或屬性                   | 類別方法或屬性                   |                                                                                    |
| `null`                 | `nil`                            | `nil`                            |                                                                                    |
| `Singleton`            | `shared` 或 `companion` 屬性     | `shared` 或 `companion` 屬性     | [註解](#kotlin-singletons)                                                         |
| 原生型別                 | 原生型別 / `NSNumber`            |                                  | [註解](#primitive-types)                                                           |
| `Unit` 回傳型別        | `Void`                           | `void`                           |                                                                                    |
| `String`               | `String`                         | `NSString`                       | [註解](#strings)                                                                   |
| `String`               | `NSMutableString`                | `NSMutableString`                | [註解](#nsmutablestring)                                                           |
| `List`                 | `Array`                          | `NSArray`                        |                                                                                    |
| `MutableList`          | `NSMutableArray`                 | `NSMutableArray`                 |                                                                                    |
| `Set`                  | `Set`                            | `NSSet`                          |                                                                                    |
| `MutableSet`           | `NSMutableSet`                   | `NSMutableSet`                   | [註解](#collections)                                                               |
| `Map`                  | `Dictionary`                     | `NSDictionary`                   |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`            | `NSMutableDictionary`            | [註解](#collections)                                                               |
| 函式型別                 | 函式型別                         | 區塊指標型別                     | [註解](#function-types)                                                            |
| 內聯類別                 | 不支援                           | 不支援                           | [註解](#unsupported)                                                               |

### 類別

#### 名稱翻譯

Objective-C 類別以其原始名稱匯入 Kotlin。
協定作為介面匯入，並帶有 `Protocol` 名稱後綴，例如 `@protocol Foo` -> `interface FooProtocol`。
這些類別和介面被放置在 [建置配置中指定](#importing-swift-objective-c-libraries-to-kotlin) 的套件中
(預先設定的系統框架為 `platform.*` 套件)。

Kotlin 類別和介面的名稱在匯入 Objective-C 時會帶有字首。
該字首衍生自框架名稱。

Objective-C 不支援框架中的套件。如果 Kotlin 編譯器在同一個框架中發現名稱相同但套件不同的 Kotlin 類別，它會重新命名它們。此演算法尚未穩定，可能會在 Kotlin 版本之間更改。為了解決這個問題，您可以重新命名框架中衝突的 Kotlin 類別。

#### 強連結

無論您在 Kotlin 原始碼中使用 Objective-C 類別，它都會被標記為強連結符號。產生的建置產物將相關符號列為強外部參考。

這意味著應用程式在啟動期間嘗試動態連結符號，如果它們不可用，應用程式會崩潰。
即使從未使用過這些符號，崩潰也會發生。這些符號可能在特定裝置或作業系統版本上不可用。

為了解決這個問題並避免「找不到符號」錯誤，請使用 Swift 或 Objective-C 包裝器來檢查類別是否實際可用。[請參閱 Compose Multiplatform 框架中如何實現此解決方案的範例](https://github.com/JetBrains/compose-multiplatform-core/pull/1278/files)。

### 初始化器

Swift/Objective-C 初始化器作為建構子或名為 `create` 的工廠方法匯入 Kotlin。
後者發生在 Objective-C 類別 (category) 或 Swift 擴展中宣告的初始化器，
因為 Kotlin 沒有擴展建構子的概念。

> 在將 Swift 初始化器匯入 Kotlin 之前，別忘了用 `@objc` 註解它們。
>
{style="tip"}

Kotlin 建構子作為初始化器匯入 Swift/Objective-C。

### 設定器

可寫入的 Objective-C 屬性覆寫父類別的唯讀屬性時，會以 `setFoo()` 方法表示屬性 `foo`。這同樣適用於協議中唯讀屬性被實作為可變的情況。

### 頂層函式與屬性

頂層 Kotlin 函式和屬性可作為特殊類別的成員存取。
每個 Kotlin 檔案都翻譯成這樣一個類別，例如：

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

然後您可以像這樣從 Swift 呼叫 `foo()` 函式：

```swift
MyLibraryUtilsKt.foo()
```

請參閱 Kotlin-Swift 互通百科中關於存取頂層 Kotlin 宣告的範例集合：

*   [頂層函式](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Top-level%20functions.md)
*   [頂層唯讀屬性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20val%20properties.md)
*   [頂層可變屬性](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Top-level%20mutable%20var%20properties.md)

### 方法名稱翻譯

通常，Swift 引數標籤和 Objective-C 選擇器片段映射到 Kotlin 參數名稱。這兩個概念
具有不同的語義，因此有時 Swift/Objective-C 方法可以匯入時帶有衝突的 Kotlin 簽章。
在這種情況下，衝突的方法可以使用具名引數從 Kotlin 呼叫，例如：

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

在 Kotlin 中，它是：

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

以下是 `kotlin.Any` 函式如何映射到 Swift/Objective-C：

| Kotlin       | Swift          | Objective-C   |
|--------------|----------------|---------------|
| `equals()`   | `isEquals(_:)` | `isEquals:`   |
| `hashCode()` | `hash`         | `hash`        |
| `toString()` | `description`  | `description` |

[請參閱 Kotlin-Swift 互通百科中帶有資料類別的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Data%20classes.md)。

您可以在 Swift 或 Objective-C 中指定一個更符合習慣的名稱，而不是使用 [`@ObjCName` 註解](#change-declaration-names) 重新命名 Kotlin 宣告。

### 錯誤與例外

所有 Kotlin 例外都是未經檢查的，這意味著錯誤在執行時被捕獲。然而，Swift 只有在編譯時處理的已檢查錯誤。
因此，如果 Swift 或 Objective-C 程式碼呼叫一個拋出例外的 Kotlin 方法，
該 Kotlin 方法應標記為 `@Throws` 註解，並指定「預期」例外類別的列表。

當編譯為 Swift/Objective-C 框架時，帶有或繼承 `@Throws` 註解的非 `suspend` 函式在 Objective-C 中表示為產生 `NSError*` 的方法，在 Swift 中表示為 `throws` 方法。
`suspend` 函式的表示始終在完成處理器中帶有 `NSError*`/`Error` 參數。

當從 Swift/Objective-C 程式碼呼叫的 Kotlin 函式拋出一個例外，該例外是 `@Throws` 指定的類別或其子類別的實例時，
該例外將作為 `NSError` 傳播。
到達 Swift/Objective-C 的其他 Kotlin 例外被視為未處理並導致程式終止。

沒有 `@Throws` 的 `suspend` 函式僅傳播 `CancellationException` (作為 `NSError`)。
沒有 `@Throws` 的非 `suspend` 函式完全不傳播 Kotlin 例外。

請注意，相反的翻譯尚未實作：Swift/Objective-C 拋出錯誤的方法尚未作為拋出例外的函式匯入 Kotlin。

[請參閱 Kotlin-Swift 互通百科中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Exceptions.md)。

### 列舉

Kotlin 列舉匯入 Objective-C 為 `@interface`，匯入 Swift 為 `class`。
這些資料結構具有與每個列舉值相對應的屬性。考慮以下 Kotlin 程式碼：

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

要在 Swift `switch` 語句中使用 Kotlin 列舉的變數，請提供一個預設語句以防止編譯錯誤：

```swift
switch color {
    case .red: print("It's red")
    case .green: print("It's green")
    case .blue: print("It's blue")
    default: fatalError("No such color")
}
```

[請參閱 Kotlin-Swift 互通百科中的另一個範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Enum%20classes.md)。

### 暫停函式

> 從 Swift 程式碼將 `suspend` 函式呼叫為 `async` 的支援是 [實驗性](components-stability.md) 功能。
> 它可能隨時被移除或更改。
> 僅用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47610) 上提供回饋。
>
{style="warning"}

Kotlin 的[暫停函式](coroutines-basics.md) (`suspend`) 在產生的 Objective-C 標頭中表示為
帶有回呼的函式，或在 Swift/Objective-C 術語中稱為[完成處理器](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously)。

從 Swift 5.5 開始，Kotlin 的 `suspend` 函式也可以從 Swift 中作為 `async` 函式呼叫，而無需使用完成處理器。目前，此功能仍高度實驗性，並且
具有某些限制。有關詳細資訊，請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-47610)。

*   了解更多關於 Swift 文件中的 [`async`/`await` 機制](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)。
*   請參閱 [Kotlin-Swift 互通百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/coroutines/Suspend%20functions.md) 中關於實作相同功能的第三方函式庫的範例和建議。

### 擴展和類別 (Category) 成員

Objective-C 類別 (category) 和 Swift 擴展的成員通常作為擴展匯入 Kotlin。這就是
為什麼這些宣告不能在 Kotlin 中被覆寫，並且擴展初始化器不能作為 Kotlin 建構子使用。

> 目前有兩個例外。從 Kotlin 1.8.20 開始，在與 NSView 類別 (來自 AppKit 框架) 或 UIView 類別 (來自 UIKit 框架) 相同的標頭中宣告的類別 (category) 成員被
> 匯入為這些類別的成員。這表示您可以覆寫 NSView 或 UIView 的子類別中的方法。
>
{style="note"}

Kotlin 對「常規」Kotlin 類別的擴展會分別作為擴展和類別 (category) 成員匯入 Swift 和 Objective-C。Kotlin 對於其他型別的擴展則被視為
[頂層宣告](#top-level-functions-and-properties)，並帶有額外的接收者參數。這些型別包括：

*   Kotlin `String` 型別
*   Kotlin 集合型別和子型別
*   Kotlin `interface` 型別
*   Kotlin 原生型別
*   Kotlin `inline` 類別
*   Kotlin `Any` 型別
*   Kotlin 函式型別和子型別
*   Objective-C 類別和協定

[請參閱 Kotlin-Swift 互通百科中的範例集合](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/tree/main/docs/extensions)。

### Kotlin 單例

Kotlin 單例 (由 `object` 宣告建立，包括 `companion object`) 匯入 Swift/Objective-C 時，
會作為具有單一實例的類別。

該實例可透過 `shared` 和 `companion` 屬性取得。

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

您可以像這樣存取這些物件：

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> 透過 `[MySingleton mySingleton]` 在 Objective-C 中以及 `MySingleton()` 在 Swift 中存取物件已被棄用。
>
{style="note"}

請參閱 Kotlin-Swift 互通百科中的更多範例：

*   [如何使用 `shared` 存取 Kotlin 物件](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Objects.md)
*   [如何從 Swift 存取 Kotlin 伴隨物件的成員](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/classesandinterfaces/Companion%20objects.md)。

### 原生型別

Kotlin 原生型別的裝箱 (boxes) 會映射到特殊的 Swift/Objective-C 類別。例如，`kotlin.Int` 的裝箱
在 Swift 中表示為 `KotlinInt` 類別實例 (或在 Objective-C 中為 `${prefix}Int` 實例，其中 `prefix` 是框架的名稱字首)。
這些類別衍生自 `NSNumber`，因此這些實例是真正的 `NSNumber`，支援所有相應的操作。

當 `NSNumber` 型別用作 Swift/Objective-C 參數型別或回傳值時，不會自動轉換為 Kotlin 原生型別。原因是
`NSNumber` 型別沒有提供足夠關於包裝的原生數值型別資訊，例如，`NSNumber` 靜態上不知道是 `Byte`、`Boolean` 或 `Double`。
因此，Kotlin 原生值應 [手動轉換為及從 `NSNumber`](#casting-between-mapped-types)。

### 字串

當 Kotlin `String` 傳遞給 Swift 時，它首先作為 Objective-C 物件導出，然後 Swift 編譯器
會再複製一次以進行 Swift 轉換。這會導致額外的執行時開銷。

為避免這種情況，在 Swift 中直接將 Kotlin 字串作為 Objective-C `NSString` 存取。
[請參閱轉換範例](#see-the-conversion-example)。

#### NSMutableString

`NSMutableString` Objective-C 類別在 Kotlin 中不可用。
`NSMutableString` 的所有實例在傳遞給 Kotlin 時都會被複製。

### 集合

#### Kotlin -> Objective-C -> Swift

當 Kotlin 集合傳遞給 Swift 時，它會首先轉換為 Objective-C 等效項，然後 Swift 編譯器
會複製整個集合並將其轉換為 Swift 原生集合，如 [映射表](#mappings) 中所述。

最後這一步轉換會導致效能成本。為防止這種情況，在 Swift 中使用 Kotlin 集合時，
明確將它們轉換為其 Objective-C 對應項：`NSDictionary`、`NSArray` 或 `NSSet`。

##### 轉換範例 {initial-collapse-state="collapsed" collapsible="true"}

例如，以下 Kotlin 宣告：

```kotlin
val map: Map<String, String>
```

在 Swift 中可能看起來像這樣：

```Swift
map[key]?.count ?? 0
```

這裡，`map` 會隱含轉換為 Swift 的 `Dictionary`，其字串值會映射到 Swift 的 `String`。
這會導致效能成本。

為避免轉換，明確將 `map` 轉換為 Objective-C 的 `NSDictionary` 並將值作為 `NSString` 存取：

```Swift
let nsMap: NSDictionary = map as NSDictionary
(nsMap[key] as? NSString)?.length ?? 0
```

這可確保 Swift 編譯器不會執行額外的轉換步驟。

#### Swift -> Objective-C -> Kotlin

Swift/Objective-C 集合映射到 Kotlin，如 [映射表](#mappings) 中所述，
除了 `NSMutableSet` 和 `NSMutableDictionary`。

`NSMutableSet` 不會轉換為 Kotlin 的 `MutableSet`。要將物件傳遞給 Kotlin `MutableSet`，請明確建立這種
Kotlin 集合。為此，例如，可以在 Kotlin 中使用 `mutableSetOf()` 函式，或在 Swift 中使用
`KotlinMutableSet` 類別，在 Objective-C 中使用 `${prefix}MutableSet` (`prefix` 是框架名稱的字首)。
`MutableMap` 也是如此。

[請參閱 Kotlin-Swift 互通百科中的範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/Collections.md)。

### 函式型別

Kotlin 函式型別物件 (例如 lambda 運算式) 會轉換為 Swift 中的函式和 Objective-C 中的區塊 (block)。
[請參閱 Kotlin-Swift 互通百科中帶有 lambda 的 Kotlin 函式範例](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/functionsandproperties/Functions%20returning%20function%20type.md)。

然而，在翻譯函式和函式型別時，參數和回傳值的型別映射方式存在差異。在後者情況下，原生型別會映射到其裝箱表示。Kotlin `Unit` 回傳值
表示為 Swift/Objective-C 中相應的 `Unit` 單例。此單例的值可以像任何其他 Kotlin `object` 一樣檢索。請參閱上方 [表格](#mappings) 中的單例。

考慮以下 Kotlin 函式：

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

它在 Swift 中表示如下：

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

您可以像這樣呼叫它：

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### 泛型

Objective-C 支援在類別中定義的「輕量泛型」，其功能集相對有限。Swift 可以匯入
在類別上定義的泛型，以幫助向編譯器提供額外的型別資訊。

Objective-C 和 Swift 對泛型功能的支援與 Kotlin 不同，因此翻譯不可避免地會遺失一些
資訊，但所支援的功能保留了有意義的資訊。

有關如何在 Swift 中使用 Kotlin 泛型的具體範例，請參閱 [Kotlin-Swift 互通百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia/blob/main/docs/overview/ShouldRefineInSwift.md)。

#### 限制

Objective-C 泛型不支援 Kotlin 或 Swift 的所有功能，因此翻譯中會遺失一些資訊。

泛型只能在類別上定義，不能在介面 (Objective-C 和 Swift 中的協定) 或函式上定義。

#### 可空性

Kotlin 和 Swift 都將可空性定義為型別規範的一部分，而 Objective-C 則將可空性定義在型別的方法和屬性上。因此，以下 Kotlin 程式碼：

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

為了支援潛在的可空型別，Objective-C 標頭需要將 `myVal` 定義為可空回傳值。

為了解決這個問題，在定義您的泛型類別時，如果泛型型別**永遠不**應該為 null，請提供非空型別約束：

```kotlin
class Sample<T : Any>() {
    fun myVal(): T
}
```

這將強制 Objective-C 標頭將 `myVal` 標記為非空。

#### 變異數

Objective-C 允許將泛型宣告為協變或逆變。Swift 不支援變異數。來自 Objective-C 的泛型類別可以根據需要強制轉型。

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 約束

在 Kotlin 中，您可以為泛型型別提供上限。Objective-C 也支援此功能，但在更複雜的情況下不支援，並且目前在 Kotlin - Objective-C 互通中不支援。這裡的例外是，非空上限將使 Objective-C 方法/屬性非空。

#### 停用

若要讓框架標頭在沒有泛型的情況下編寫，請在建置檔中新增以下編譯器選項：

```kotlin
binaries.framework {
    freeCompilerArgs += "-Xno-objc-generics"
}
```

### 前向宣告

若要匯入前向宣告，請使用 `objcnames.classes` 和 `objcnames.protocols` 套件。例如，
若要匯入在 Objective-C 函式庫中宣告的 `library.package` 帶有 `objcprotocolName` 前向宣告，
請使用特殊的前向宣告套件：`import objcnames.protocols.objcprotocolName`。

考慮兩個 objcinterop 函式庫：一個使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，
另一個在另一個套件中具有實際實作：

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

要在兩個函式庫之間傳輸物件，請在 Kotlin 程式碼中使用明確的 `as` 轉型：

```kotlin
// Kotlin code:
fun test() {
    consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
}
```

> 您只能從相應的真實類別轉型為 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。
> 否則，您將收到錯誤。
>
{style="note"}

## 映射型別之間的轉型

在編寫 Kotlin 程式碼時，物件可能需要從 Kotlin 型別轉換為等效的 Swift/Objective-C 型別
(反之亦然)。在這種情況下，可以使用簡單的 Kotlin 轉型，例如：

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## 子類別化

### 從 Swift/Objective-C 子類別化 Kotlin 類別和介面

Kotlin 類別和介面可以被 Swift/Objective-C 類別和協定子類別化。

### 從 Kotlin 子類別化 Swift/Objective-C 類別和協定

Swift/Objective-C 類別和協定可以使用 Kotlin `final` 類別進行子類別化。非 `final` Kotlin 類別
繼承 Swift/Objective-C 型別尚未支援，因此不可能宣告繼承 Swift/Objective-C 型別的複雜類別繼承結構。

一般方法可以使用 `override` Kotlin 關鍵字覆寫。在這種情況下，覆寫方法必須與被覆寫方法具有
相同的參數名稱。

有時需要覆寫初始化器，例如子類別化 `UIViewController` 時。匯入為 Kotlin 建構子的初始化器可以由帶有 `@OverrideInit` 註解的 Kotlin 建構子覆寫：

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

覆寫建構子必須與被覆寫建構子具有相同的參數名稱和型別。

要覆寫具有衝突 Kotlin 簽章的不同方法，您可以將 `@ObjCSignatureOverride` 註解新增到類別中。
該註解指示 Kotlin 編譯器忽略衝突的重載，以防多個函式具有相同的引數型別但引數名稱不同，而從 Objective-C 類別繼承。

預設情況下，Kotlin/Native 編譯器不允許呼叫非指定 Objective-C 初始化器作為 `super()` 建構子。
如果指定初始化器在 Objective-C 函式庫中未正確標記，這種行為可能會造成不便。要停用這些編譯器檢查，
請將 `disableDesignatedInitializerChecks = true` 新增到函式庫的 [`.def` 檔案](native-definition-file.md) 中。

## C 功能

請參閱 [與 C 互通性](native-c-interop.md)，了解函式庫使用一些純 C 功能 (例如不安全指標、結構等) 的範例情況。

## 不支援的功能

Kotlin 程式語言的某些功能尚未映射到 Objective-C 或 Swift 的相應功能。
目前，以下功能在產生的框架標頭中未適當公開：

*   內聯類別 (引數映射為底層原生型別或 `id`)
*   實作標準 Kotlin 集合介面 (`List`、`Map`、`Set`) 和其他特殊類別的自訂類別
*   Objective-C 類別的 Kotlin 子類別