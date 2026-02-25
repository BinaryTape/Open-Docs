[//]: # (title: 對應來自 C 的結構與聯合型別 – 教學)

<tldr>
    <p>這是 <strong>對應 Kotlin 與 C</strong> 教學系列的第二部分。在繼續之前，請確保您已完成上一步。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">對應來自 C 的基本資料型別</a><br/>
       <img src="icon-2.svg" width="20" alt="第二步"/> <strong>對應來自 C 的結構與聯合型別</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">對應來自 C 的函式指標</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">對應來自 C 的字串</a><br/>
    </p>
</tldr>

> C 程式庫匯入目前處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。所有由 cinterop 工具從 C 程式庫產生的 Kotlin 宣告都應具有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台程式庫（如 Foundation、UIKit 和 POSIX）僅對某些 API 需要選擇性同意（opt-in）。
>
{style="note"}

讓我們探索哪些 C 結構（struct）與聯合（union）型別宣告在 Kotlin 中是可見的，並查看 Kotlin/Native 與 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 組建中進階的 C 互通相關使用案例。

在本教學中，您將學習：

* [結構與聯合型別如何對應](#mapping-struct-and-union-c-types)
* [如何從 Kotlin 使用結構與聯合型別](#use-struct-and-union-types-from-kotlin)

## 對應 C 結構與聯合型別

為了理解 Kotlin 如何對應結構與聯合型別，讓我們在 C 中宣告它們，並檢查它們在 Kotlin 中如何表示。

在 [之前的教學](mapping-primitive-data-types-from-c.md) 中，您已經建立了一個包含必要檔案的 C 程式庫。對於此步驟，請更新 `interop.def` 檔案中 `---` 分隔符號後的宣告：

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

## 檢查為 C 程式庫產生的 Kotlin API

讓我們看看 C 結構與聯合型別如何對應到 Kotlin/Native 並更新您的專案：

1. 在 `src/nativeMain/kotlin` 中，使用以下內容更新您在 [之前的教學](mapping-primitive-data-types-from-c.md) 中建立的 `hello.kt` 檔案：

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

2. 為避免編譯器錯誤，請將互通性加入組建過程中。為此，請使用以下內容更新您的 `build.gradle(.kts)` 組建檔案：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64("native") {    // Apple 晶片的 macOS
        // macosX64("native") {   // x86_64 平台上的 macOS
        // linuxArm64("native") { // ARM64 平台上的 Linux 
        // linuxX64("native") {   // x86_64 平台上的 Linux
        // mingwX64("native") {   // Windows 上
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
        macosArm64("native") {    // Apple 晶片的 macOS
        // macosX64("native") {   // x86_64 平台上的 macOS
        // linuxArm64("native") { // ARM64 平台上的 Linux
        // linuxX64("native") {   // x86_64 平台上的 Linux
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

3. 使用 IntelliJ IDEA 的 [跳轉到宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 指令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）來導覽至以下為 C 函式、結構與聯合產生的 API：

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

從技術上講，在 Kotlin 端，結構與聯合型別之間沒有區別。cinterop 工具會為結構與聯合的 C 宣告產生 Kotlin 型別。

產生的 API 包含 `CValue<T>` 與 `CValuesRef<T>` 的完全限定封裝名稱，反映了它們在 `kotlinx.cinterop` 中的位置。`CValue<T>` 代表按值傳遞的結構參數，而 `CValuesRef<T>?` 則用於傳遞指向結構或聯合的指標。

## 從 Kotlin 使用結構與聯合型別

由於有了產生的 API，從 Kotlin 使用 C 結構與聯合型別非常直觀。唯一的問題是如何建立這些型別的新執行個體。

讓我們看看接收 `MyStruct` 與 `MyUnion` 作為參數的產生函式。按值傳遞的參數表示為 `kotlinx.cinterop.CValue<T>`，而指標型別參數則使用 `kotlinx.cinterop.CValuesRef<T>?`。

Kotlin 提供了一個方便的 API 來建立並操作這些型別。讓我們探索如何在實務中使用它。

### 建立 CValue&lt;T&gt;

`CValue<T>` 型別用於將按值傳遞的參數傳遞給 C 函式呼叫。使用 `cValue` 函式來建立 `CValue<T>` 執行個體。該函式需要一個 [具有接收器的 Lambda 函式](lambdas.md#function-literals-with-receiver) 來就地初始化底層的 C 型別。該函式的宣告如下：

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

以下是如何使用 `cValue` 並傳遞按值傳遞的參數：

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

### 將結構與聯合建立為 CValuesRef&lt;T&gt;

`CValuesRef<T>` 型別在 Kotlin 中用於傳遞 C 函式的指標型別參數。若要在原生記憶體中分配 `MyStruct` 與 `MyUnion`，請在 `kotlinx.cinterop.NativePlacement` 型別上使用以下擴充方法：

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` 代表原生記憶體，具有類似於 `malloc` 與 `free` 的函式。`NativePlacement` 有幾種實作：

* 全域實作是 `kotlinx.cinterop.nativeHeap`，但您必須呼叫 `nativeHeap.free()` 才能在使用後釋放記憶體。
* 一個更安全的替代方案是 `memScoped()`，它會建立一個短期的記憶體作用域，其中的所有分配都會在區塊結束時自動釋放：

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
  ```

使用 `memScoped()`，您呼叫帶有指標的函式的程式碼可以如下所示：

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

在這裡，可在 `memScoped {}` 區塊中使用的 `ptr` 擴充屬性，會將 `MyStruct` 與 `MyUnion` 執行個體轉換為原生指標。

由於記憶體是在 `memScoped {}` 區塊內管理的，它會在區塊結束時自動釋放。請避免在此作用域之外使用指標，以防止存取已釋放的記憶體。如果您需要更長期的分配（例如，為了在 C 程式庫中快取），請考慮使用 `Arena()` 或 `nativeHeap`。

### CValue&lt;T&gt; 與 CValuesRef&lt;T&gt; 之間的轉換

有時您需要在一次函式呼叫中按值傳遞結構，然後在另一次呼叫中按引用傳遞相同的結構。

為此，您需要一個 `NativePlacement`，但首先，讓我們看看 `CValue<T>` 如何轉換為指標：

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

在這裡同樣，來自 `memScoped {}` 的 `ptr` 擴充屬性會將 `MyStruct` 執行個體轉換為原生指標。這些指標僅在 `memScoped {}` 區塊內有效。

若要將指標轉換回按值傳遞的變數，請呼叫 `.readValue()` 擴充方法：

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

既然您已經學習了如何在 Kotlin 程式碼中使用 C 宣告，請嘗試在您的專案中使用它們。`hello.kt` 檔案中的最終程式碼可能如下所示：

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

若要驗證一切是否如預期運作，請 [在您的 IDE 中](native-get-started.md#build-and-run-the-application) 執行 `runDebugExecutableNative` Gradle 任務，或使用以下指令來執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您將學習函式指標如何在 Kotlin 與 C 之間進行對應：

**[前進至下一部分](mapping-function-pointers-from-c.md)**

### 延伸閱讀

在涵蓋更多進階案例的 [與 C 互通](native-c-interop.md) 文件中了解更多資訊。