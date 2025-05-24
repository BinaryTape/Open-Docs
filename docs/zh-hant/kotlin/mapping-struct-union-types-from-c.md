---
title: "從 C 語言對應 struct 和 union 類型 – 教學"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   這是 <strong>Kotlin 和 C 映射</strong>教學系列的第二部分。在繼續之前，請確保您已完成上一步。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c">映射 C 的基本資料型別 (Mapping primitive data types from C)</a><br/>
       <img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>映射 C 的結構 (struct) 和聯合 (union) 型別</strong><br/>
       <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">映射函數指標 (Mapping function pointers)</a><br/>
       <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">映射 C 的字串 (Mapping strings from C)</a><br/>
</p>

:::

:::caution
C 函式庫匯入是 [實驗性的 (Experimental)](components-stability#stability-levels-explained)。由 cinterop 工具從 C 函式庫產生的所有 Kotlin 宣告都應具有 `@ExperimentalForeignApi` 註解。

與 Kotlin/Native 一起提供的原生平台函式庫 (例如 Foundation、UIKit 和 POSIX) 僅需針對某些 API 選擇加入。

:::

讓我們探索哪些 C 結構 (struct) 和聯合 (union) 宣告在 Kotlin 中可見，並檢查 Kotlin/Native 和 [多平台 (multiplatform)](gradle-configure-project#targeting-multiple-platforms) Gradle 建置中與 C 互通相關的高階用例。

在本教學中，您將學習：

* [如何映射結構 (struct) 和聯合 (union) 型別](#mapping-struct-and-union-c-types)
* [如何從 Kotlin 使用結構 (struct) 和聯合 (union) 型別](#use-struct-and-union-types-from-kotlin)

## 映射 C 的結構 (struct) 和聯合 (union) 型別

為了理解 Kotlin 如何映射結構 (struct) 和聯合 (union) 型別，讓我們在 C 中宣告它們，並檢查它們在 Kotlin 中如何表示。

在[先前的教學](mapping-primitive-data-types-from-c)中，您已經建立了一個包含必要檔案的 C 函式庫。對於此步驟，請更新 `interop.def` 檔案中 `---` 分隔符號後的宣告：

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

## 檢查為 C 函式庫產生的 Kotlin API

讓我們看看 C 結構 (struct) 和聯合 (union) 型別如何映射到 Kotlin/Native 中，並更新您的專案：

1. 在 `src/nativeMain/kotlin` 中，使用[先前的教學](mapping-primitive-data-types-from-c)中的以下內容更新您的 `hello.kt` 檔案：

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

2. 為了避免編譯器錯誤，請將互通性新增到建置過程中。為此，請使用以下內容更新您的 `build.gradle(.kts)` 建置檔案：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

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

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

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

    </TabItem>
    </Tabs> 

3. 使用 IntelliJ IDEA 的 [跳至宣告 (Go to declaration)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 以導覽至以下為 C 函數、結構 (struct) 和聯合 (union) 產生的 API：

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

從技術上講，在 Kotlin 端，結構 (struct) 和聯合 (union) 型別之間沒有區別。cinterop 工具會為結構 (struct) 和聯合 (union) C 宣告產生 Kotlin 型別。

產生的 API 包含 `CValue<T>` 和 `CValuesRef<T>` 的完整套件名稱，反映它們在 `kotlinx.cinterop` 中的位置。`CValue<T>` 表示傳值的結構參數，而 `CValuesRef<T>?` 用於傳遞指向結構或聯合的指標。

## 從 Kotlin 使用結構 (struct) 和聯合 (union) 型別

由於產生的 API，從 Kotlin 使用 C 結構 (struct) 和聯合 (union) 型別非常簡單。唯一的問題是如何建立這些型別的新實例。

讓我們看看將 `MyStruct` 和 `MyUnion` 作為參數的產生函數。傳值參數表示為 `kotlinx.cinterop.CValue<T>`，而指標型別參數使用 `kotlinx.cinterop.CValuesRef<T>?`。

Kotlin 提供了方便的 API 來建立和使用這些型別。讓我們探索如何在實踐中使用它。

### 建立 CValue&lt;T&gt;

`CValue<T>` 型別用於將傳值參數傳遞給 C 函數呼叫。使用 `cValue` 函數建立 `CValue<T>` 實例。該函數需要一個[帶有接收者的 Lambda 函數 (lambda function with a receiver)](lambdas#function-literals-with-receiver)以就地初始化底層 C 型別。該函數宣告如下：

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() `->` Unit): CValue<T>
```

以下是如何使用 `cValue` 並傳遞傳值參數：

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

### 建立結構 (struct) 和聯合 (union) 作為 CValuesRef&lt;T&gt;

`CValuesRef<T>` 型別在 Kotlin 中用於傳遞 C 函數的指標型別參數。若要在原生記憶體中分配 `MyStruct` 和 `MyUnion`，請使用 `kotlinx.cinterop.NativePlacement` 型別上的以下擴充函數：

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` 表示具有類似於 `malloc` 和 `free` 函數的原生記憶體。`NativePlacement` 有多個實作：

* 全域實作是 `kotlinx.cinterop.nativeHeap`，但您必須呼叫 `nativeHeap.free()` 以在使用後釋放記憶體。
* 一個更安全的替代方案是 `memScoped()`，它會建立一個短期的記憶體範圍，其中所有分配都會在區塊結尾自動釋放：

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() `->` R): R
  ```

使用 `memScoped()`，您的呼叫帶有指標函數的程式碼可以如下所示：

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

在這裡，`ptr` 擴充屬性在 `memScoped {}` 區塊中可用，將 `MyStruct` 和 `MyUnion` 實例轉換為原生指標。

由於記憶體在 `memScoped {}` 區塊內管理，因此它會在區塊結尾自動釋放。避免在此範圍之外使用指標，以防止存取已釋放的記憶體。如果您需要更長時間的分配 (例如，在 C 函式庫中進行快取)，請考慮使用 `Arena()` 或 `nativeHeap`。

### CValue&lt;T&gt; 和 CValuesRef&lt;T&gt; 之間的轉換

有時，您需要在一個函數呼叫中將結構 (struct) 作為值傳遞，然後在另一個函數呼叫中將相同的結構 (struct) 作為參考傳遞。

為此，您需要一個 `NativePlacement`，但首先，讓我們看看如何將 `CValue<T>` 轉換為指標：

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

若要將指標轉換回傳值變數，請呼叫 `readValue()` 擴充函數：

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

現在您已經學習瞭如何在 Kotlin 程式碼中使用 C 宣告，請嘗試在您的專案中使用它們。`hello.kt` 檔案中的最終程式碼可能如下所示：

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

若要驗證一切是否按預期工作，請[在您的 IDE 中](native-get-started#build-and-run-the-application)執行 `runDebugExecutableNative` Gradle 任務，或使用以下命令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您將學習如何在 Kotlin 和 C 之間映射函數指標：

**[繼續到下一部分](mapping-function-pointers-from-c)**

### 參見

在 [與 C 的互通性 (Interoperability with C)](native-c-interop) 文件中了解更多資訊，該文件涵蓋了更進階的情境。