[//]: # (title: 選擇啟用要求)

Kotlin 標準函式庫提供了一種機制，用於要求並給予明確同意以使用特定的 API 元素。此機制允許函式庫作者告知使用者需要選擇啟用的特定條件，例如當 API 處於實驗性狀態並可能在未來變更時。

為了保護使用者，編譯器會針對這些條件發出警告，並要求使用者必須選擇啟用後才能使用該 API。

## 選擇啟用 API

如果函式庫作者將其函式庫 API 中的宣告標記為**[需要選擇啟用](#require-opt-in-to-use-api)**，您必須先給予明確同意才能在程式碼中使用它。有幾種選擇啟用的方式。我們建議選擇最適合您情況的方法。

### 本地選擇啟用

若要在程式碼中使用特定的 API 元素時選擇啟用，請使用 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 註解並參照實驗性 API 標記。例如，假設您想使用需要選擇啟用的 `DateProvider` 類別：

```kotlin
// Library code
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// A class requiring opt-in
class DateProvider
```

在您的程式碼中，在宣告使用 `DateProvider` 類別的函式之前，加入 `@OptIn` 註解並參照 `MyDateTime` 註解類別：

```kotlin
// Client code
@OptIn(MyDateTime::class)

// Uses DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

值得注意的是，使用這種方法時，如果 `getDate()` 函式在您的程式碼其他地方被呼叫或被其他開發人員使用，則不需要選擇啟用：

```kotlin
// Client code
@OptIn(MyDateTime::class)

// Uses DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: No opt-in is required
    println(getDate()) 
}
```

選擇啟用要求不會傳播，這表示其他人可能會在不知情的情況下使用實驗性 API。為避免這種情況，傳播選擇啟用要求會更安全。

#### 傳播選擇啟用要求

當您在程式碼中使用供第三方使用的 API（例如在函式庫中），您也可以將其選擇啟用要求傳播到您的 API。為此，請使用函式庫所使用的相同**[選擇啟用要求註解](#create-opt-in-requirement-annotations)**來標記您的宣告。

例如，在宣告使用 `DateProvider` 類別的函式之前，加入 `@MyDateTime` 註解：

```kotlin
// Client code
@MyDateTime
fun getDate(): Date {
    // OK: the function requires opt-in as well
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // Error: getDate() requires opt-in
}
```

如本範例所示，帶註解的函式看起來像是 `@MyDateTime` API 的一部分。該選擇啟用將選擇啟用要求傳播給 `getDate()` 函式的使用者。

如果 API 元素的簽章包含需要選擇啟用的類型，則該簽章本身也必須要求選擇啟用。否則，如果 API 元素不需要選擇啟用，但其簽章包含需要選擇啟用的類型，使用它將會觸發錯誤。

```kotlin
// Client code
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: the function requires opt-in as well
    println(getDate())
}
```

同樣地，如果您將 `@OptIn` 應用於其簽章包含需要選擇啟用的類型的宣告，選擇啟用要求仍然會傳播：

```kotlin
// Client code
@OptIn(MyDateTime::class)
// Propagates opt-in due to DateProvider in the signature
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // Error: getDate() requires opt-in
}
```

在傳播選擇啟用要求時，重要的是要了解，如果某個 API 元素變得穩定且不再有選擇啟用要求，任何仍帶有選擇啟用要求的其他 API 元素仍將保持實驗性。例如，假設函式庫作者移除了 `getDate()` 函式的選擇啟用要求，因為它現在已穩定：

```kotlin
// Library code
// No opt-in requirement
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

如果您在使用 `displayDate()` 函式時未移除選擇啟用註解，即使該選擇啟用已不再需要，它仍將保持實驗性：

```kotlin
// Client code

// Still experimental!
@MyDateTime 
fun displayDate() {
    // Uses a stable library function
    println(getDate())
}
```

#### 選擇啟用多個 API

若要選擇啟用多個 API，請使用所有相關的選擇啟用要求註解來標記該宣告。例如：

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

或者，也可以使用 `@OptIn`：

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 檔案級選擇啟用

若要為檔案中的所有函式和類別使用需要選擇啟用的 API，請在檔案頂部、套件規格和匯入之前，加入檔案級註解 `@file:OptIn`。

 ```kotlin
 // Client code
 @file:OptIn(MyDateTime::class)
 ```

### 模組級選擇啟用

> `-opt-in` 編譯器選項自 Kotlin 1.6.0 起可用。對於較早的 Kotlin 版本，請使用 `-Xopt-in`。
>
{style="note"}

如果您不想註解每個需要選擇啟用的 API 使用處，您可以為整個模組選擇啟用它們。若要在模組中選擇啟用 API 的使用，請使用參數 `-opt-in` 編譯它，並指定您所使用 API 的選擇啟用要求註解的完全限定名稱：`-opt-in=org.mylibrary.OptInAnnotation`。使用此參數編譯的效果，如同模組中的每個宣告都帶有註解 `@OptIn(OptInAnnotation::class)`。

如果您使用 Gradle 建構您的模組，可以像這樣加入參數：

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
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</tab>
</tabs>

對於 Maven，請使用以下方式：

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

若要在模組層級選擇啟用多個 API，請為模組中使用的每個選擇啟用要求標記加入一個所描述的參數。

### 選擇啟用繼承類別或介面

有時，函式庫作者提供 API，但希望要求使用者在繼承它之前明確選擇啟用。例如，函式庫 API 可能穩定供使用，但不能用於繼承，因為它在未來可能透過新的抽象函式進行擴展。函式庫作者可以透過使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解來標記 [開放](inheritance.md) 或 [抽象類別](classes.md#abstract-classes) 以及 [非功能性介面](interfaces.md) 來強制執行此要求。

若要選擇啟用使用此類 API 元素並在程式碼中繼承它，請使用 `@SubclassOptInRequired` 註解並參照該註解類別。例如，假設您想使用需要選擇啟用的 `CoreLibraryApi` 介面：

```kotlin
// Library code
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// An interface requiring opt-in to extend
interface CoreLibraryApi 
```

在您的程式碼中，在建立繼承自 `CoreLibraryApi` 介面的新介面之前，加入 `@SubclassOptInRequired` 註解並參照 `UnstableApi` 註解類別：

```kotlin
// Client code
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

請注意，當您在類別上使用 `@SubclassOptInRequired` 註解時，選擇啟用要求不會傳播到任何 [內部或巢狀類別](nested-classes.md)：

```kotlin
// Library code
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// Client code

// Opt-in is required
class NetworkFileSystem : FileSystem()

// Nested class
// No opt-in required
class TextFile : FileSystem.File()
```

另外，您也可以使用 `@OptIn` 註解來選擇啟用。您也可以使用實驗性標記註解，將該要求進一步傳播到程式碼中對該類別的任何使用：

```kotlin
// Client code
// With @OptIn annotation
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// With annotation referencing annotation class
// Propagates the opt-in requirement further
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## 要求選擇啟用才能使用 API

您可以要求函式庫的使用者在能夠使用您的 API 之前選擇啟用。此外，您可以告知使用者使用您的 API 的任何特殊條件，直到您決定移除選擇啟用要求為止。

### 建立選擇啟用要求註解

若要要求選擇啟用才能使用您的模組 API，請建立一個註解類別作為**選擇啟用要求註解**來使用。此類別必須使用 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 註解：

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

選擇啟用要求註解必須符合幾個要求。它們必須具備：

*   `BINARY` 或 `RUNTIME` [保留策略](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)。
*   `EXPRESSION`、`FILE`、`TYPE` 或 `TYPE_PARAMETER` 作為 [目標](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)。
*   沒有參數。

選擇啟用要求可以有以下兩種嚴重性[等級](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/)之一：

*   `RequiresOptIn.Level.ERROR`。選擇啟用是強制性的。否則，使用已標記 API 的程式碼將無法編譯。這是預設等級。
*   `RequiresOptIn.Level.WARNING`。選擇啟用並非強制性，但建議使用。否則，編譯器會發出警告。

若要設定所需的等級，請指定 `@RequiresOptIn` 註解的 `level` 參數。

此外，您可以向 API 使用者提供 `message`。編譯器會向嘗試在未選擇啟用的情況下使用 API 的使用者顯示此訊息：

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

如果您發布多個需要選擇啟用的獨立功能，請為每個功能宣告一個註解。這使得您的 API 對客戶來說更安全，因為他們只能使用其明確接受的功能。這也表示您可以獨立地從功能中移除選擇啟用要求，使您的 API 更易於維護。

### 標記 API 元素

若要要求選擇啟用才能使用 API 元素，請使用選擇啟用要求註解標記其宣告：

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

請注意，對於某些語言元素，選擇啟用要求註解不適用：

*   您不能註解屬性的支援欄位或讀取器，只能註解屬性本身。
*   您不能註解局部變數或值參數。

## 要求選擇啟用才能繼承 API

有時，您可能希望對 API 的哪些特定部分可以被使用和繼承進行更精細的控制。例如，當您有一些穩定可用的 API，但：

*   **實作不穩定**，由於持續演進，例如當您有一系列介面，預期在未來會加入沒有預設實作的新抽象函式。
*   **實作上微妙或脆弱**，例如需要以協調一致的方式運作的個別函式。
*   **合約可能在未來被削弱**，以向後不相容的方式影響外部實作，例如將輸入參數 `T` 變更為可為空版本 `T?`，而該程式碼之前並未考慮 `null` 值。

在這種情況下，您可以要求使用者在進一步繼承您的 API 之前選擇啟用。使用者可以透過繼承 API 或實作抽象函式來擴展您的 API。透過使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解，您可以強制執行此選擇啟用要求，適用於 [開放](inheritance.md) 或 [抽象類別](classes.md#abstract-classes) 以及 [非功能性介面](interfaces.md)。

若要將選擇啟用要求加入 API 元素，請使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 註解並參照該註解類別：

```kotlin
@RequiresOptIn(
 level = RequiresOptIn.Level.WARNING,
 message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// An interface requiring opt-in to extend
interface CoreLibraryApi 
```

請注意，當您使用 `@SubclassOptInRequired` 註解來要求選擇啟用時，該要求不會傳播到任何 [內部或巢狀類別](nested-classes.md)。

若要查看如何在 API 中使用 `@SubclassOptInRequired` 註解的實際範例，請查看 `kotlinx.coroutines` 函式庫中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 介面。

## 預穩定 API 的選擇啟用要求

如果您對尚未穩定的功能使用選擇啟用要求，請仔細處理 API 的階段性發布，以避免破壞客戶端程式碼。

一旦您的預穩定 API 畢業並以穩定狀態發布，請從您的宣告中移除選擇啟用要求註解。客戶端隨後可以不受限制地使用它們。然而，您應該將註解類別留在模組中，以便現有的客戶端程式碼保持相容。

為了鼓勵 API 使用者透過從其程式碼中移除任何註解並重新編譯來更新其模組，請將這些註解標記為 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 並在棄用訊息中提供解釋。

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime
```