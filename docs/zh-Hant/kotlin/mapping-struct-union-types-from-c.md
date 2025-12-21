[//]: # (title: 從 C 語言映射結構與聯集型別 – 教學)

<tldr>
    <p>這是 **映射 Kotlin 與 C** 教學系列文件的第二部分。在繼續之前，請確保您已完成上一個步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">從 C 語言映射基本資料型別</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>從 C 語言映射結構與聯集型別</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">從 C 語言映射函式指標</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">從 C 語言映射字串</a><br/>
    </p>
</tldr>

> C 程式庫匯入功能處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。所有由 cinterop 工具從 C 程式庫生成的 Kotlin 宣告都應該帶有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台程式庫 (例如 Foundation、UIKit 和 POSIX) 僅部分 API 需要選擇加入 (opt-in)。
>
{style="note"}

讓我們來探討哪些 C 結構和聯集宣告在 Kotlin 中是可見的，並檢視 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 建置中與 C 互通相關的進階使用案例。

在本教學中，您將學習：

*   [結構與聯集型別如何映射](#mapping-struct-and-union-c-types)
*   [如何在 Kotlin 中使用結構與聯集型別](#use-struct-and-union-types-from-kotlin)

## 映射 C 語言的結構與聯集型別

為了理解 Kotlin 如何映射結構和聯集型別，讓我們在 C 語言中宣告它們，並檢視它們在 Kotlin 中的表示方式。

在 [上一個教學](mapping-primitive-data-types-from-c.md) 中，您已經建立了一個包含必要檔案的 C 程式庫。對於此步驟，請在 `---` 分隔符後更新 `interop.def` 檔案中的宣告：

```c

---

typedef struct {
  int a;
  double b;
} MyStruct;

void struct_by_value(MyStruct s) {}
void struct_by_pointer(MyStruct* s) {}

typedef union {
  int a;
  MyStruct b;
  float c;
} MyUnion;

void union_by_value(MyUnion u) {}
void union_by_pointer(MyUnion* u) {}
``` 

`interop.def` 檔案提供了編譯、執行或在 IDE 中開啟應用程式所需的一切。

## 檢查 C 程式庫的生成 Kotlin API

讓我們看看 C 結構和聯集型別如何映射到 Kotlin/Native 中，並更新您的專案：

1.  在 `src/nativeMain/kotlin` 中，使用以下內容更新您在 [上一個教學](mapping-primitive-data-types-from-c.md) 中建立的 `hello.kt` 檔案：

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")

        struct_by_value(/* fix me*/)
        struct_by_pointer(/* fix me*/)
        union_by_value(/* fix me*/)
        union_by_pointer(/* fix me*/)
    }
    ```

2.  為避免編譯器錯誤，請將互通性 (interoperability) 加入到建置流程中。為此，請使用以下內容更新您的 `build.gradle(.kts)` 建置檔案：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms 
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // on Windows
            val main by compilations.getting
            val interop by main.cinterops.creating {
                definitionFile.set(project.file("src/nativeInterop/cinterop/interop.def"))
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
            compilations.main.cinterops {
                interop {   
                    definitionFile = project.file('src/nativeInterop/cinterop/interop.def')
                }
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    </tabs> 

3.  使用 IntelliJ IDEA 的 [跳轉到宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)，導覽至以下針對 C 函式、結構和聯集生成的 API：

    ```kotlin
    fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
    fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
    
    fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
    fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
    ```

從技術上講，在 Kotlin 側，結構和聯集型別之間沒有區別。cinterop 工具會為 C 語言的結構和聯集宣告生成 Kotlin 型別。

生成的 API 包含 `CValue<T>` 和 `CValuesRef<T>` 的完整限定套件名稱，反映了它們在 `kotlinx.cinterop` 中的位置。`CValue<T>` 代表一個值傳遞的結構參數，而 `CValuesRef<T>?` 用於傳遞指向結構或聯集的指標。

## 在 Kotlin 中使用結構與聯集型別

由於生成的 API，在 Kotlin 中使用 C 結構和聯集型別非常直接。唯一的問題是如何建立這些型別的新實例。

讓我們看看以 `MyStruct` 和 `MyUnion` 作為參數的生成函式。值傳遞的參數表示為 `kotlinx.cinterop.CValue<T>`，而指標型別的參數使用 `kotlinx.cinterop.CValuesRef<T>?`。

Kotlin 提供了一個方便的 API 來建立和使用這些型別。讓我們探討如何在實踐中使用它。

### 建立 `CValue<T>`

`CValue<T>` 型別用於將值傳遞的參數傳遞給 C 函式呼叫。使用 `cValue` 函式建立一個 `CValue<T>` 實例。該函式需要一個 [帶有接收者的 Lambda 函式](lambdas.md#function-literals-with-receiver) 來就地初始化底層 C 型別。該函式宣告如下：

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

以下是如何使用 `cValue` 並傳遞值傳遞參數：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue

@OptIn(ExperimentalForeignApi::class)
fun callValue() {

    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }
    struct_by_value(cStruct)

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    union_by_value(cUnion)
}
```

### 建立結構與聯集作為 `CValuesRef<T>`

`CValuesRef<T>` 型別在 Kotlin 中用於傳遞 C 函式的指標型別參數。要原生記憶體中分配 `MyStruct` 和 `MyUnion`，請在 `kotlinx.cinterop.NativePlacement` 型別上使用以下擴充函式：

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` 代表原生記憶體，其功能類似於 `malloc` 和 `free`。`NativePlacement` 有多種實作：

*   全域實作是 `kotlinx.cinterop.nativeHeap`，但您必須在使用後呼叫 `nativeHeap.free()` 來釋放記憶體。
*   一個更安全的替代方案是 `memScoped()`，它會建立一個短暫的記憶體範圍 (scope)，其中所有分配都會在區塊結束時自動釋放：

    ```kotlin
    fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
    ```

使用 `memScoped()`，您呼叫帶有指標的函式的程式碼可以像這樣：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ptr

@OptIn(ExperimentalForeignApi::class)
fun callRef() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_pointer(cStruct.ptr)

        val cUnion = alloc<MyUnion>()
        cUnion.b.a = 5
        cUnion.b.b = 2.7182

        union_by_pointer(cUnion.ptr)
    }
}
```

在這裡，`memScoped {}` 區塊中可用的 `ptr` 擴充屬性，會將 `MyStruct` 和 `MyUnion` 實例轉換為原生指標。

由於記憶體在 `memScoped {}` 區塊內部管理，它會在區塊結束時自動釋放。避免在此範圍之外使用指標，以防止存取已解除分配的記憶體。如果您需要較長生命週期的分配 (例如，用於 C 程式庫中的快取)，請考慮使用 `Arena()` 或 `nativeHeap`。

### `CValue<T>` 與 `CValuesRef<T>` 之間的轉換

有時您需要將結構作為值在一個函式呼叫中傳遞，然後在另一個函式呼叫中將相同的結構作為參考傳遞。

為此，您將需要 `NativePlacement`，但首先，讓我們看看 `CValue<T>` 如何轉換為指標：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped

@OptIn(ExperimentalForeignApi::class)
fun callMix_ref() {
    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }

    memScoped {
        struct_by_pointer(cStruct.ptr)
    }
}
```

在這裡，來自 `memScoped {}` 的 `ptr` 擴充屬性再次將 `MyStruct` 實例轉換為原生指標。這些指標僅在 `memScoped {}` 區塊內有效。

要將指標轉換回值傳遞變數，請呼叫 `.readValue()` 擴充函式：

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.readValue

@OptIn(ExperimentalForeignApi::class)
fun callMix_value() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_value(cStruct.readValue())
    }
}
```

## 更新 Kotlin 程式碼

既然您已經學會如何在 Kotlin 程式碼中使用 C 宣告，請嘗試在您的專案中使用它們。`hello.kt` 檔案中的最終程式碼可能如下所示：

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.ptr
import kotlinx.cinterop.readValue
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    memScoped {
        union_by_value(cUnion)
        union_by_pointer(cUnion.ptr)
    }

    memScoped {
        val cStruct = alloc<MyStruct> {
            a = 42
            b = 3.14
        }

        struct_by_value(cStruct.readValue())
        struct_by_pointer(cStruct.ptr)
    }
}
```

若要驗證一切是否如預期般運作，請在 [您的 IDE](native-get-started.md#build-and-run-the-application) 中執行 `runDebugExecutableNative` Gradle 任務，或使用以下命令來執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您將學習函式指標如何在 Kotlin 和 C 之間映射：

**[繼續前往下一部分](mapping-function-pointers-from-c.md)**

### 另請參閱

在 [與 C 語言的互通性](native-c-interop.md) 文件中了解更多資訊，該文件涵蓋了更進階的場景。