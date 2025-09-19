[//]: # (title: 選擇加入要求)

Kotlin 標準函式庫提供了一種機制，用於要求和給予明確同意才能使用某些 API 元素。此機制允許函式庫作者告知使用者需要選擇加入的特定條件，例如當 API 處於實驗性狀態並可能在未來改變時。

為了保護使用者，編譯器會針對這些條件發出警告，並要求使用者在 API 可以被使用之前選擇加入。

## 選擇加入 API

如果函式庫作者將其函式庫 API 中的宣告標記為 **[需要選擇加入](#require-opt-in-to-use-api)**，您必須在程式碼中使用它之前給予明確同意。有幾種方式可以選擇加入。我們建議選擇最適合您情況的方法。

### 在本地選擇加入

若要在程式碼中使用特定 API 元素時選擇加入，請使用 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 註解，並參考實驗性 API 標記。例如，假設您想使用需要選擇加入的 `DateProvider` 類別：

```kotlin
// 函式庫程式碼
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// 一個需要選擇加入的類別
class DateProvider
```

在您的程式碼中，於宣告使用 `DateProvider` 類別的函式之前，新增 `@OptIn` 註解並參考 `MyDateTime` 註解類別：

```kotlin
// 用戶端程式碼
@OptIn(MyDateTime::class)

// 使用 DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

值得注意的是，使用這種方法，如果 `getDate()` 函式在您的程式碼中其他地方被呼叫或被其他開發者使用，則無需選擇加入：

```kotlin
// 用戶端程式碼
@OptIn(MyDateTime::class)

// 使用 DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: 無需選擇加入
    println(getDate())
}
```

選擇加入要求不會傳播，這意味著其他人可能會在不知不覺中使用實驗性 API。為避免這種情況，傳播選擇加入要求會更安全。

#### 傳播選擇加入要求

當您在程式碼中使用旨在供第三方使用的 API（例如在函式庫中）時，您也可以將其選擇加入要求傳播到您的 API。為此，請使用函式庫所用的相同 **[選擇加入要求註解](#create-opt-in-requirement-annotations)** 來標記您的宣告。

例如，在宣告使用 `DateProvider` 類別的函式之前，新增 `@MyDateTime` 註解：

```kotlin
// 用戶端程式碼
@MyDateTime
fun getDate(): Date {
    // OK: 該函式也需要選擇加入
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // 錯誤: getDate() 需要選擇加入
}
```

如本範例所示，此被註解的函式似乎是 `@MyDateTime` API 的一部分。此選擇加入將選擇加入要求傳播給 `getDate()` 函式的使用者。

如果 API 元素的簽章包含需要選擇加入的類型，則該簽章本身也必須需要選擇加入。否則，如果 API 元素不需要選擇加入，但其簽章包含需要選擇加入的類型，則使用它將觸發錯誤。

```kotlin
// 用戶端程式碼
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: 該函式也需要選擇加入
    println(getDate())
}
```

同樣地，如果您將 `@OptIn` 應用於其簽章包含需要選擇加入的類型的宣告，則選擇加入要求仍然會傳播：

```kotlin
// 用戶端程式碼
@OptIn(MyDateTime::class)
// 因簽章中的 DateProvider 而傳播選擇加入
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // 錯誤: getDate() 需要選擇加入
}
```

傳播選擇加入要求時，重要的是要了解，如果某個 API 元素變得穩定且不再有選擇加入要求，則任何其他仍有選擇加入要求的 API 元素仍保持實驗性。例如，假設函式庫作者移除了 `getDate()` 函式的選擇加入要求，因為它現在已經穩定：

```kotlin
// 函式庫程式碼
// 無需選擇加入
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

如果您使用 `displayDate()` 函式時未移除選擇加入註解，它仍會保持實驗性，即使該選擇加入不再需要：

```kotlin
// 用戶端程式碼

// 仍然實驗性！
@MyDateTime
fun displayDate() {
    // 使用穩定的函式庫函式
    println(getDate())
}
```

#### 選擇加入多個 API

若要選擇加入多個 API，請使用所有其選擇加入要求註解來標記該宣告。例如：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

或者使用 `@OptIn`：

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 選擇加入檔案

若要讓檔案中的所有函式和類別都能使用需要選擇加入的 API，請在檔案頂部、套件規範和匯入之前，新增檔案層級註解 `@file:OptIn`。

 ```kotlin
 // 用戶端程式碼
 @file:OptIn(MyDateTime::class)
 ```

### 選擇加入模組

> `-opt-in` 編譯器選項自 Kotlin 1.6.0 起可用。對於較早的 Kotlin 版本，請使用 `-Xopt-in`。
>
{style="note"}

如果您不想對每個需要選擇加入的 API 用法進行註解，您可以為整個模組選擇加入它們。若要在模組中選擇加入使用 API，請使用參數 `-opt-in` 進行編譯，並指定您所使用 API 的選擇加入要求註解的完整限定名稱：`-opt-in=org.mylibrary.OptInAnnotation`。使用此參數編譯的效果等同於模組中的每個宣告都具有註解`@OptIn(OptInAnnotation::class)`。

如果您使用 Gradle 建置模組，您可以這樣新增參數：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

如果您的 Gradle 模組是多平台模組，請使用 `optIn` 方法：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

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

若要在模組層級選擇加入多個 API，請為模組中使用的每個選擇加入要求標記新增其中一個所描述的參數。

### 選擇加入以繼承類別或介面

有時，函式庫作者提供 API，但希望要求使用者在擴充它之前明確選擇加入。例如，函式庫 API 可能穩定可用，但不穩定繼承，因為它未來可能會透過新增抽象函式進行擴充。函式庫作者可以透過使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解來標記 [開放類別](inheritance.md) 或 [抽象類別](classes.md#abstract-classes) 和 [非函式介面](interfaces.md) 來強制執行此要求。

若要選擇加入使用此類 API 元素並在您的程式碼中擴充它，請使用 `@SubclassOptInRequired` 註解並參考該註解類別。例如，假設您想使用需要選擇加入的 `CoreLibraryApi` 介面：

```kotlin
// 函式庫程式碼
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 一個需要選擇加入才能擴充的介面
interface CoreLibraryApi
```

在您的程式碼中，在建立繼承自 `CoreLibraryApi` 介面的新介面之前，新增 `@SubclassOptInRequired` 註解並參考 `UnstableApi` 註解類別：

```kotlin
// 用戶端程式碼
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

請注意，當您在類別上使用 `@SubclassOptInRequired` 註解時，選擇加入要求不會傳播到任何 [內部類別或巢狀類別](nested-classes.md)：

```kotlin
// 函式庫程式碼
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// 用戶端程式碼

// 需要選擇加入
class NetworkFileSystem : FileSystem()

// 巢狀類別
// 無需選擇加入
class TextFile : FileSystem.File()
```

或者，您可以使用 `@OptIn` 註解來選擇加入。您也可以使用實驗性標記註解，將該要求進一步傳播到程式碼中該類別的任何使用處：

```kotlin
// 用戶端程式碼
// 使用 @OptIn 註解
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// 使用參考註解類別的註解
// 進一步傳播選擇加入要求
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## 要求選擇加入才能使用 API

您可以要求函式庫的使用者在能夠使用您的 API 之前選擇加入。此外，您還可以告知使用者有關使用您 API 的任何特殊條件，直到您決定移除選擇加入要求。

### 建立選擇加入要求註解

若要要求選擇加入才能使用您模組的 API，請建立一個註解類別，用作 **選擇加入要求註解**。此類別必須使用 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 進行註解：

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

選擇加入要求註解必須符合幾個要求。它們必須具有：

*   `BINARY` 或 `RUNTIME` [留存策略](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
*   `EXPRESSION`、`FILE`、`TYPE` 或 `TYPE_PARAMETER` 作為 [目標](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)。
*   沒有參數。

選擇加入要求可以具有兩種嚴重程度 [層級](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/) 之一：

*   `RequiresOptIn.Level.ERROR`。選擇加入是強制性的。否則，使用已標記 API 的程式碼將無法編譯。這是預設層級。
*   `RequiresOptIn.Level.WARNING`。選擇加入不是強制性的，但建議使用。如果沒有，編譯器會發出警告。

若要設定所需的層級，請指定 `@RequiresOptIn` 註解的 `level` 參數。

此外，您可以向 API 使用者提供 `message`。編譯器會向嘗試不選擇加入而使用 API 的使用者顯示此訊息：

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

如果您發布多個需要選擇加入的獨立功能，請為每個功能宣告一個註解。這使得您的客戶使用您的 API 更加安全，因為他們只能使用他們明確接受的功能。這也意味著您可以獨立地從功能中移除選擇加入要求，這使您的 API 更容易維護。

### 標記 API 元素

若要要求選擇加入才能使用 API 元素，請使用選擇加入要求註解來註解其宣告：

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

請注意，對於某些語言元素，選擇加入要求註解不適用：

*   您不能註解屬性的支援欄位或 getter，只能註解屬性本身。
*   您不能註解本地變數或值參數。

## 要求選擇加入才能擴充 API

有時您可能希望對 API 的哪些特定部分可以被使用和擴充有更精細的控制。例如，當您有一些 API 穩定可用但：

*   **實作不穩定**，因為持續演進，例如當您有一個介面家族，預計會新增沒有預設實作的新抽象函式。
*   **實作時很精細或脆弱**，例如需要以協調方式運作的個別函式。
*   **具有未來可能以向後不相容方式削弱的契約**，對於外部實作而言，例如將輸入參數 `T` 變更為可為空值版本 `T?`，而程式碼之前並未考慮 `null` 值。

在這種情況下，您可以要求使用者在進一步擴充您的 API 之前選擇加入。使用者可以透過繼承 API 或實作抽象函式來擴充您的 API。透過使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解，您可以強制執行此選擇加入要求，適用於 [開放類別](inheritance.md) 或 [抽象類別](classes.md#abstract-classes) 和 [非函式介面](interfaces.md)。

若要將選擇加入要求新增到 API 元素，請使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解，並參考該註解類別：

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 一個需要選擇加入才能擴充的介面
interface CoreLibraryApi
```

請注意，當您使用 `@SubclassOptInRequired` 註解來要求選擇加入時，該要求不會傳播到任何 [內部類別或巢狀類別](nested-classes.md)。

若要查看如何在您的 API 中使用 `@SubclassOptInRequired` 註解的實際範例，請查看 `kotlinx.coroutines` 函式庫中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 介面。

## 預穩定 API 的選擇加入要求

如果您為尚未穩定的功能使用選擇加入要求，請小心處理 API 的穩定化過程，以避免破壞客戶端程式碼。

一旦您的預穩定 API 達到穩定狀態並以穩定版本發布，請從您的宣告中移除選擇加入要求註解。客戶端便可以不受限制地使用它們。但是，您應該將註解類別保留在模組中，以便現有的客戶端程式碼保持相容。

為了鼓勵 API 使用者透過從程式碼中移除任何註解並重新編譯來更新其模組，請將這些註解標記為 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/)，並在棄用訊息中提供解釋。

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime