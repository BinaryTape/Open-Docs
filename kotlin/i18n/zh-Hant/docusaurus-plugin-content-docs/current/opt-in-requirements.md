---
title: "Opt-in 的要求"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 標準函式庫提供了一種機制，用於要求和明確同意使用某些 API 元素。
這種機制允許函式庫作者告知使用者需要選擇加入 (opt-in) 的特定條件，
例如當 API 處於實驗狀態並且將來可能發生變更時。

為了保護使用者，編譯器會警告這些情況，並要求他們選擇加入後才能使用 API。

## 選擇加入 API (Opt in to API)

如果函式庫作者將其函式庫 API 中的宣告標記為**[需要選擇加入才能使用 (requiring opt-in to use)](#require-opt-in-to-use-api)**，
則必須先明確同意，才能在程式碼中使用它。
有多種選擇加入的方式。建議選擇最適合您情況的方法。

### 在本地選擇加入 (Opt in locally)

若要在程式碼中使用特定的 API 元素時選擇加入，請使用 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/)
註解，並參考實驗性 API 標記。例如，假設您想使用需要選擇加入的 `DateProvider` 類別：

```kotlin
// 函式庫程式碼 (Library code)
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// 需要選擇加入的類別 (A class requiring opt-in)
class DateProvider
```

在您的程式碼中，宣告使用 `DateProvider` 類別的函數之前，請新增帶有對 `MyDateTime` 註解類別的參考的 `@OptIn` 註解：

```kotlin
// 客戶端程式碼 (Client code)
@OptIn(MyDateTime::class)

// 使用 DateProvider (Uses DateProvider)
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

重要的是要注意，使用這種方法，如果 `getDate()` 函數在您的程式碼中其他地方被呼叫或被
其他開發人員使用，則不需要選擇加入：

```kotlin
// 客戶端程式碼 (Client code)
@OptIn(MyDateTime::class)

// 使用 DateProvider (Uses DateProvider)
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: 不需要選擇加入 (No opt-in is required)
    println(getDate()) 
}
```

選擇加入的要求不會傳播，這意味著其他人可能會在不知情的情況下使用實驗性 API。為了避免這種情況，
傳播選擇加入要求更安全。

#### 傳播選擇加入要求 (Propagate opt-in requirements)

當您在程式碼中使用預定供第三方使用的 API（例如在函式庫中）時，您可以將其選擇加入要求
也傳播到您的 API。為此，請使用函式庫使用的相同**[選擇加入要求註解 (opt-in requirement annotation)](#create-opt-in-requirement-annotations)**來標記您的宣告。

例如，在宣告使用 `DateProvider` 類別的函數之前，請新增 `@MyDateTime` 註解：

```kotlin
// 客戶端程式碼 (Client code)
@MyDateTime
fun getDate(): Date {
    // OK: 該函數也需要選擇加入 (the function requires opt-in as well)
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // Error: getDate() 需要選擇加入 (requires opt-in)
}
```

如您在本範例中所見，帶註解的函數似乎是 `@MyDateTime` API 的一部分。
選擇加入會將選擇加入要求傳播給 `getDate()` 函數的使用者。

如果 API 元素的簽章 (signature) 包含需要選擇加入的類型，則簽章本身也必須需要選擇加入。
否則，如果 API 元素不需要選擇加入，但其簽章包含需要選擇加入的類型，則使用它會觸發錯誤。

```kotlin
// 客戶端程式碼 (Client code)
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: 該函數也需要選擇加入 (the function requires opt-in as well)
    println(getDate())
}
```

同樣地，如果您將 `@OptIn` 應用於簽章包含需要選擇加入的類型的宣告，則選擇加入要求
仍然會傳播：

```kotlin
// 客戶端程式碼 (Client code)
@OptIn(MyDateTime::class)
// 由於簽章中的 DateProvider 而傳播選擇加入 (Propagates opt-in due to DateProvider in the signature)
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // Error: getDate() 需要選擇加入 (requires opt-in)
}
```

在傳播選擇加入要求時，重要的是要了解，如果 API 元素變得穩定並且不再
具有選擇加入要求，則任何仍然具有選擇加入要求的其他 API 元素仍然是實驗性的。例如，
假設函式庫作者刪除了 `getDate()` 函數的選擇加入要求，因為它現在已穩定：

```kotlin
// 函式庫程式碼 (Library code)
// 無選擇加入要求 (No opt-in requirement)
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

如果您使用 `displayDate()` 函數而不刪除選擇加入註解，即使
不再需要選擇加入，它仍然是實驗性的：

```kotlin
// 客戶端程式碼 (Client code)

// 仍然是實驗性的! (Still experimental!)
@MyDateTime 
fun displayDate() {
    // 使用穩定的函式庫函數 (Uses a stable library function)
    println(getDate())
}
```

#### 選擇加入多個 API (Opt in to multiple APIs)

若要選擇加入多個 API，請使用所有其選擇加入要求註解來標記宣告。例如：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

或者使用 `@OptIn`：

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 在檔案中選擇加入 (Opt in a file)

若要對檔案中的所有函數和類別使用需要選擇加入的 API，請將檔案層級註解 `@file:OptIn`
新增到檔案頂部，放在套件規範和匯入之前。

 ```kotlin
 // 客戶端程式碼 (Client code)
 @file:OptIn(MyDateTime::class)
 ```

### 在模組中選擇加入 (Opt in a module)

:::note
`-opt-in` 編譯器選項自 Kotlin 1.6.0 起可用。對於較早的 Kotlin 版本，請使用 `-Xopt-in`。

:::

如果您不想註解每個需要選擇加入的 API 的用法，您可以為整個模組選擇加入它們。
若要選擇加入在模組中使用 API，請使用參數 `-opt-in` 編譯它，
指定您使用的 API 的選擇加入要求註解的完整限定名稱：`-opt-in=org.mylibrary.OptInAnnotation`。
使用此參數進行編譯的效果與模組中的每個宣告都具有註解 `@OptIn(OptInAnnotation::class)` 相同。

如果使用 Gradle 建置模組，您可以新增如下參數：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</TabItem>
</Tabs>

如果您的 Gradle 模組是多平台模組，請使用 `optIn` 方法：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</TabItem>
</Tabs>

對於 Maven，請使用以下內容：

```xml
<build>
<plugins>
<plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>...</executions>
            <configuration>
                <args>
                    <arg>-opt-in=org.mylibrary.OptInAnnotation</arg>                    
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

若要在模組層級選擇加入多個 API，請為模組中使用的每個選擇加入要求標記新增上述其中一個參數。

### 選擇加入以繼承類別或介面 (Opt in to inherit from a class or interface)

有時，函式庫作者提供 API，但希望要求使用者在可以擴充它之前明確選擇加入。
例如，函式庫 API 可能穩定可用，但不適用於繼承，因為將來可能會使用
新的抽象函數對其進行擴充。函式庫作者可以通過使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解標記 [open](inheritance) 或 [abstract classes](classes#abstract-classes) 和 [non-functional interfaces](interfaces) 來強制執行此操作。

若要選擇加入以使用此類 API 元素並在您的程式碼中擴充它，請使用 `@SubclassOptInRequired` 註解，
並參考註解類別。例如，假設您想使用需要選擇加入的 `CoreLibraryApi` 介面：

```kotlin
// 函式庫程式碼 (Library code)
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 需要選擇加入才能擴充的介面 (An interface requiring opt-in to extend)
interface CoreLibraryApi 
```

在您的程式碼中，在建立從 `CoreLibraryApi` 介面繼承的新介面之前，請新增帶有對 `UnstableApi` 註解類別的參考的 `@SubclassOptInRequired`
註解：

```kotlin
// 客戶端程式碼 (Client code)
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

請注意，當您在類別上使用 `@SubclassOptInRequired` 註解時，選擇加入要求不會傳播到
任何 [inner or nested classes](nested-classes)：

```kotlin
// 函式庫程式碼 (Library code)
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// 客戶端程式碼 (Client code)

// 需要選擇加入 (Opt-in is required)
class NetworkFileSystem : FileSystem()

// 巢狀類別 (Nested class)
// 不需要選擇加入 (No opt-in required)
class TextFile : FileSystem.File()
```

或者，您可以使用 `@OptIn` 註解選擇加入。您也可以使用實驗性標記註解
將需求進一步傳播到程式碼中該類別的任何用法：

```kotlin
// 客戶端程式碼 (Client code)
// 使用 @OptIn 註解 (With @OptIn annotation)
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// 使用參考註解類別的註解 (With annotation referencing annotation class)
// 進一步傳播選擇加入要求 (Propagates the opt-in requirement further)
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## 要求選擇加入才能使用 API (Require opt-in to use API)

您可以要求您的函式庫使用者在能夠使用您的 API 之前選擇加入。此外，您可以告知使用者
使用 API 的任何特殊條件，直到您決定移除選擇加入要求。

### 建立選擇加入要求註解 (Create opt-in requirement annotations)

若要要求選擇加入才能使用您模組的 API，請建立一個註解類別以用作**選擇加入要求註解 (opt-in requirement annotation)**。
此類別必須使用 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 註解：

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

選擇加入要求註解必須滿足多個要求。它們必須具有：

* `BINARY` 或 `RUNTIME` [retention](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
* `EXPRESSION`、`FILE`、`TYPE` 或 `TYPE_PARAMETER` 作為 [target](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)。
* 無參數。

選擇加入要求可以具有兩個嚴重性 [levels](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/) 之一：

* `RequiresOptIn.Level.ERROR`。選擇加入是強制性的。否則，使用標記 API 的程式碼將無法編譯。這是預設層級。
* `RequiresOptIn.Level.WARNING`。選擇加入不是強制性的，但建議使用。如果沒有它，編譯器會發出警告。

若要設定所需的層級，請指定 `@RequiresOptIn` 註解的 `level` 參數。

此外，您可以向 API 使用者提供 `message`。編譯器會向嘗試在沒有選擇加入的情況下使用 API 的使用者顯示此訊息：

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

如果您發布多個需要選擇加入的獨立功能，請為每個功能宣告一個註解。
這使您的客戶使用您的 API 更安全，因為他們只能使用他們明確接受的功能。
這也意味著您可以獨立地從功能中移除選擇加入要求，這使您的 API 更容易
維護。

### 標記 API 元素 (Mark API elements)

若要要求選擇加入才能使用 API 元素，請使用選擇加入要求註解來註解其宣告：

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

請注意，對於某些語言元素，選擇加入要求註解不適用：

* 您不能註解屬性的後端欄位或 getter，只能註解屬性本身。
* 您不能註解區域變數或值參數。

## 要求選擇加入才能擴充 API (Require opt-in to extend API)

有時，您可能希望更精細地控制可以使用和
擴充的 API 的哪些特定部分。例如，當您有一些穩定的 API 可用，但：

* 由於正在進行的演變而**不穩定以實作 (Unstable to implement)**，例如當您有一系列介面，您希望新增沒有預設實作的新抽象函數時。
* **實作起來很精細或脆弱 (Delicate or fragile to implement)**，例如需要以協調方式運作的個別函數。
* **具有合約，將來可能會以向後不相容的方式為外部實作減弱 (Has a contract that may be weakened in the future)**，例如將輸入參數 `T` 變更為可為 null 的版本 `T?`，其中程式碼先前未考慮 `null` 值。

在這種情況下，您可以要求使用者在可以進一步擴充您的 API 之前選擇加入。使用者可以通過從 API 繼承或實作抽象函數來擴充您的 API。通過使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解，
您可以對 [open](inheritance) 或 [abstract classes](classes#abstract-classes) 和 [non-functional interfaces](interfaces) 強制執行此選擇加入要求。

若要將選擇加入要求新增到 API 元素，請使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)
註解，並參考註解類別：

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 需要選擇加入才能擴充的介面 (An interface requiring opt-in to extend)
interface CoreLibraryApi 
```

請注意，當您使用 `@SubclassOptInRequired` 註解來要求選擇加入時，該要求不會傳播到
任何 [inner or nested classes](nested-classes)。

有關如何在您的 API 中使用 `@SubclassOptInRequired` 註解的真實範例，請查看 `kotlinx.coroutines` 函式庫中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/)
介面。

## 預先穩定 API 的選擇加入要求 (Opt-in requirements for pre-stable APIs)

如果您將選擇加入要求用於尚未穩定的功能，請仔細處理 API 畢業，以避免
中斷客戶端程式碼。

一旦您的預先穩定 API 畢業並以穩定狀態發布，請從
您的宣告中移除選擇加入要求註解。然後，客戶端可以不受限制地使用它們。但是，您應該將註解類別
保留在模組中，以便現有的客戶端程式碼保持相容。

若要鼓勵 API 使用者通過從其程式碼中移除任何註解並重新編譯來更新其模組，請將註解
標記為 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)，並在棄用訊息中提供說明。

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime
```