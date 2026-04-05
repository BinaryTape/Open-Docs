[//]: # (title: 從 C 對應字串 – 教學)

<tldr>
    <p>這是<strong>對應 Kotlin 與 C</strong> 教學系列的最後一部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">從 C 對應基本資料型別</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">從 C 對應結構與聯合型別</a><br/>
      <img src="icon-3-done.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">從 C 對應函式指標</a><br/>
      <img src="icon-4.svg" width="20" alt="第四步"/> <strong>從 C 對應字串</strong><br/>
    </p>
</tldr>

> C 程式庫匯入目前處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。所有由 cinterop 工具從 C 程式庫產生的 Kotlin 宣告都應具有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台程式庫（如 Foundation、UIKit 和 POSIX）僅針對部分 API 需要選擇加入（opt-in）。
>
{style="note"}
 
在本系列的最後一部分，讓我們來看看如何在 Kotlin/Native 中處理 C 字串。

在本教學中，您將學習如何：

* [將 Kotlin 字串傳遞給 C](#pass-kotlin-strings-to-c)
* [在 Kotlin 中讀取 C 字串](#read-c-strings-in-kotlin)
* [將 C 字串位元組接收到 Kotlin 字串中](#receive-c-string-bytes-from-kotlin)

## 使用 C 字串

C 沒有專用的字串型別。方法簽章或文件可以幫助您識別在特定上下文中，給定的 `char *` 是否代表 C 字串。

C 語言中的字串是以 null 結尾的，因此在位元組序列的末尾會加上一個尾隨的零字元 `\0` 以標記字串的結束。通常使用 [UTF-8 編碼字串](https://en.wikipedia.org/wiki/UTF-8)。UTF-8 編碼使用變端長度字元，並與 [ASCII](https://en.wikipedia.org/wiki/ASCII) 回溯相容。Kotlin/Native 預設使用 UTF-8 字元編碼。

要理解字串如何在 Kotlin 與 C 之間對應，首先建立程式庫標頭檔。在[本系列的第一部分](mapping-primitive-data-types-from-c.md)中，您已經建立了一個包含必要檔案的 C 程式庫。對於此步驟：

1. 更新您的 `lib.h` 檔案，加入以下處理 C 字串的函式宣告：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   此範例展示了在 C 語言中傳遞或接收字串的常用方法。請小心處理 `return_string()` 函式的傳回值。確保您使用正確的 `free()` 函式來釋放傳回的 `char*`。

2. 在 `interop.def` 檔案的 `---` 分隔符號之後更新宣告：

   ```c
   ---
   
   void pass_string(char* str) {
   }
   
   char* return_string() {
     return "C string";
   }
   
   int copy_string(char* str, int size) {
       *str++ = 'C';
       *str++ = ' ';
       *str++ = 'K';
       *str++ = '/';
       *str++ = 'N';
       *str++ = 0;
       return 0;
   }
   ```

`interop.def` 檔案提供了在 IDE 中編譯、執行或開啟應用程式所需的一切。

## 檢查 C 程式庫產生的 Kotlin API

讓我們看看 C 字串宣告是如何對應到 Kotlin/Native 的：

1. 在 `src/nativeMain/kotlin` 中，將先前[教學](mapping-function-pointers-from-c.md)中的 `hello.kt` 檔案更新為以下內容：

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi
  
   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       pass_string(/*fix me*/)
       val useMe = return_string()
       val useMe2 = copy_string(/*fix me*/)
   }
   ```

2. 使用 IntelliJ IDEA 的 [跳轉到宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 指令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）導覽至以下產生的 C 函式 API：

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

這些宣告非常直觀。在 Kotlin 中，C `char *` 指標在參數中被對應為 `str: CValuesRef<ByteVarOf>?`，而在傳回型別中被對應為 `CPointer<ByteVarOf>?`。Kotlin 將 `char` 型別表示為 `kotlin.Byte`，因為它通常是一個 8 位元有號值。

在產生的 Kotlin 宣告中，`str` 被定義為 `CValuesRef<ByteVarOf<Byte>>?`。由於此型別是可為 null 的，您可以傳遞 `null` 作為引數值。 

## 將 Kotlin 字串傳遞給 C

讓我們嘗試在 Kotlin 中使用該 API。首先呼叫 `pass_string()` 函式：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cstr

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val str = "This is a Kotlin string"
    pass_string(str.cstr)
}
```

感謝 `String.cstr` [擴充屬性](extensions.md#extension-properties)，將 Kotlin 字串傳遞給 C 非常直觀。對於涉及 UTF-16 字元的情況，還有 `String.wcstr` 屬性。

## 在 Kotlin 中讀取 C 字串

現在從 `return_string()` 函式獲取傳回的 `char *` 並將其轉換為 Kotlin 字串：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.toKString

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val stringFromC = return_string()?.toKString()

    println("Returned from C: $stringFromC")
}
```

在這裡，[`.toKString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/to-k-string.html) 擴充函式將 `return_string()` 函式傳回的 C 字串轉換為 Kotlin 字串。

Kotlin 提供了多個擴充函式，用於根據編碼將 C `char *` 字串轉換為 Kotlin 字串：

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // UTF-8 字串的標準函式
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // 明確轉換 UTF-8 字串
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // 轉換 UTF-16 編碼字串
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // 轉換 UTF-32 編碼字串
```

## 將 C 字串位元組接收到 Kotlin 字串中

這一次，使用 `copy_string()` C 函式將 C 字串寫入給定的緩衝區。它接受兩個引數：指向應寫入字串的記憶體位置的指標，以及允許的緩衝區大小。

該函式還應傳回一些內容以指示其成功或失敗。假設 `0` 表示成功，且提供的緩衝區足夠大：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.usePinned

@OptIn(ExperimentalForeignApi::class)
fun sendString() {
    val buf = ByteArray(255)
    buf.usePinned { pinned ->
        if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
            throw Error("Failed to read string from C")
        }
    }

    val copiedStringFromC = buf.decodeToString()
    println("Message from C: $copiedStringFromC")
}
```

在這裡，首先將原生指標傳遞給 C 函式。[`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 擴充函式會暫時固定位元組陣列的原生記憶體位址。C 函式會用資料填充位元組陣列。另一個擴充函式 `ByteArray.decodeToString()` 則將位元組陣列轉換為 Kotlin 字串（假設為 UTF-8 編碼）。 

## 更新 Kotlin 程式碼

既然您已經學習了如何在 Kotlin 程式碼中使用 C 宣告，請嘗試在您的專案中使用它們。最終 `hello.kt` 檔案中的程式碼可能如下所示：
 
```kotlin
import interop.*
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val str = "This is a Kotlin string"
    pass_string(str.cstr)

    val useMe = return_string()?.toKString() ?: error("null pointer returned")
    println(useMe)

    val copyFromC = ByteArray(255).usePinned { pinned ->
        val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
        if (useMe2 != 0) throw Error("Failed to read a string from C")
        pinned.get().decodeToString()
    }

    println(copyFromC)
}
```

要驗證一切是否如預期運作，請[在您的 IDE 中](native-get-started.md#build-and-run-the-application)執行 `runDebugExecutable<YourTargetName>` Gradle 任務，或在您的終端機中使用命令列指令，在此範例中為：

```bash
./gradlew runDebugExecutableMacosArm64
```

## 下一步

在 [與 C 的互通性](native-c-interop.md) 文件中了解更多資訊，該文件涵蓋了更進階的情境。