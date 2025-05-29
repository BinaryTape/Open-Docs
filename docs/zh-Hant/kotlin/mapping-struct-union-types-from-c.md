[//]: # (title: 從 C 映射結構和聯合型別 – 教程)

<tldr>
    <p>這是「**映射 Kotlin 和 C**」教學系列中的第二部分。在繼續之前，請確保您已完成上一步。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">從 C 映射基本資料型別</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>從 C 映射結構和聯合型別</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">映射函式指標</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">從 C 映射字串</a><br/>
    </p>
</tldr>

> C 函式庫的匯入功能為 [實驗性](components-stability.md#stability-levels-explained)。cinterop 工具從 C 函式庫生成的所有 Kotlin 宣告都應帶有 `@ExperimentalForeignApi` 註解 (annotation)。
>
> Kotlin/Native 隨附的原生平台函式庫 (例如 Foundation、UIKit 和 POSIX) 僅部分 API 需要啟用 (opt-in)。
>
{style="warning"}

讓我們探索哪些 C 結構 (struct) 和聯合 (union) 宣告在 Kotlin 中可見，並探討 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 建置 (build) 中進階的 C 互通性 (interop) 相關使用案例。

在本教程中，您將學習：

* [結構 (struct) 和聯合 (union) 型別如何映射](#mapping-struct-and-union-c-types)
* [如何在 Kotlin 中使用結構 (struct) 和聯合 (union) 型別](#use-struct-and-union-types-from-kotlin)

## 映射 C 結構 (struct) 和聯合 (union) 型別

為了理解 Kotlin 如何映射結構 (struct) 和聯合 (union) 型別，讓我們在 C 中宣告它們，並檢查它們在 Kotlin 中的表示方式。

在[上一個教程](mapping-primitive-data-types-from-c.md)中，您已經建立了一個包含必要檔案的 C 函式庫。
對於此步驟，請在 `---` 分隔符號之後更新 `interop.def` 檔案中的宣告：

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

## 檢查為 C 函式庫生成的 Kotlin API

讓我們看看 C 結構 (struct) 和聯合 (union) 型別如何映射到 Kotlin/Native 中，並更新您的專案：

1. 在 `src/nativeMain/kotlin` 中，使用以下內容更新您[上一個教程](mapping-primitive-data-types-from-c.md)中的 `hello.kt` 檔案：

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

2. 為了避免編譯器錯誤，請將互通性 (interoperability) 加入到建置 (build) 過程中。為此，請使用以下內容更新您的 `build.gradle(.kts)` 建置檔案：

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

3. 使用 IntelliJ IDEA 的 [前往宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 指令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 導航到為 C 函式、結構 (struct) 和聯合 (union) 生成的以下 API：

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

從技術上講，在 Kotlin 端結構 (struct) 和聯合 (union) 型別之間沒有區別。cinterop 工具為 C 結構 (struct) 和聯合 (union) 宣告生成 Kotlin 型別。

生成的 API 包含 `CValue<T>` 和 `CValuesRef<T>` 的完整套件名稱，反映了它們在 `kotlinx.cinterop` 中的位置。`CValue<T>` 表示傳值 (by-value) 的結構參數，而 `CValuesRef<T>?` 用於傳遞指向結構或聯合的指標 (pointer)。

## 在 Kotlin 中使用結構 (struct) 和聯合 (union) 型別

由於生成的 API，從 Kotlin 使用 C 結構 (struct) 和聯合 (union) 型別非常簡單。唯一的問題是如何建立這些型別的新實例 (instance)。

讓我們看看將 `MyStruct` 和 `MyUnion` 作為參數的生成函式。傳值 (by-value) 參數表示為 `kotlinx.cinterop.CValue<T>`，而指標型別參數則使用 `kotlinx.cinterop.CValuesRef<T>?`。

Kotlin 為建立和使用這些型別提供了方便的 API。讓我們在實踐中探索如何使用它。

### 建立 `CValue<T>`

`CValue<T>` 型別用於將傳值 (by-value) 參數傳遞給 C 函式呼叫。使用 `cValue` 函式建立 `CValue<T>` 實例 (instance)。該函式需要一個[帶接收者的 Lambda 函式](lambdas.md#function-literals-with-receiver)來原地初始化底層的 C 型別。該函式宣告如下：

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

以下是如何使用 `cValue` 並傳遞傳值 (by-value) 參數：

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

### 將結構 (struct) 和聯合 (union) 建立為 `CValuesRef<T>`

`CValuesRef<T>` 型別在 Kotlin 中用於傳遞 C 函式的指標型別參數。要在原生記憶體中分配 (allocate) `MyStruct` 和 `MyUnion`，請在 `kotlinx.cinterop.NativePlacement` 型別上使用以下擴充函式：

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` 代表原生記憶體，其函式類似於 `malloc` 和 `free`。`NativePlacement` 有幾種實作 (implementation)：

*   全域實作是 `kotlinx.cinterop.nativeHeap`，但使用後您必須呼叫 `nativeHeap.free()` 來釋放記憶體。
*   一種更安全的替代方案是 `memScoped()`，它會建立一個短暫的記憶體範圍 (memory scope)，其中所有分配的記憶體都會在區塊 (block) 結束時自動釋放：

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
  ```

使用 `memScoped()`，您呼叫帶指標的函式之程式碼可能如下所示：

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

在這裡，`ptr` 擴充屬性 (extension property) 在 `memScoped {}` 區塊 (block) 內可用，它將 `MyStruct` 和 `MyUnion` 實例轉換為原生指標。

由於記憶體在 `memScoped {}` 區塊內管理，它會在區塊結束時自動釋放。
避免在此範圍 (scope) 之外使用指標，以防止存取已解分配 (deallocated) 的記憶體。如果您需要更長生命週期的分配 (例如，用於 C 函式庫中的快取 (caching))，請考慮使用 `Arena()` 或 `nativeHeap`。

### `CValue<T>` 和 `CValuesRef<T>` 之間的轉換

有時您需要將結構 (struct) 作為值在一個函式呼叫中傳遞，然後將相同的結構作為參考在另一個函式呼叫中傳遞。

為此，您需要一個 `NativePlacement`，但首先，讓我們看看 `CValue<T>` 是如何轉換為指標 (pointer) 的：

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

在這裡，`memScoped {}` 中的 `ptr` 擴充屬性再次將 `MyStruct` 實例轉換為原生指標。
這些指標僅在 `memScoped {}` 區塊 (block) 內部有效。

要將指標轉換回傳值 (by-value) 變數，請呼叫 `.readValue()` 擴充函式：

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

現在您已經學會如何在 Kotlin 程式碼中使用 C 宣告，請嘗試在您的專案中使用它們。
`hello.kt` 檔案中的最終程式碼可能如下所示：

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

為了驗證一切如預期般運作，請在[您的 IDE](native-get-started.md#build-and-run-the-application) 中執行 `runDebugExecutableNative` Gradle 工作 (task)，或使用以下命令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您將學習函式指標 (function pointer) 如何在 Kotlin 和 C 之間映射：

**[前往下一部分](mapping-function-pointers-from-c.md)**

### 另請參閱

在 [與 C 的互通性 (Interoperability)](native-c-interop.md) 文件中了解更多資訊，該文件涵蓋了更進階的場景。