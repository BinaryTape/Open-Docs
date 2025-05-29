[//]: # (title: 從 C 語言映射字串 – 教學)

<tldr>
    <p>這是<strong>映射 Kotlin 與 C 語言</strong>系列教學的最後一部分。在繼續之前，請確保您已完成先前的步驟。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">從 C 語言映射基本資料型別</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">從 C 語言映射結構和聯合型別</a><br/>
      <img src="icon-3-done.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">映射函式指標</a><br/>
      <img src="icon-4.svg" width="20" alt="第四步"/> <strong>從 C 語言映射字串</strong><br/>
    </p>
</tldr>

> C 函式庫的匯入功能為[實驗性](components-stability.md#stability-levels-explained)。所有由 cinterop 工具從 C 函式庫生成的 Kotlin 宣告
> 都應帶有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）
> 僅某些 API 需要選擇加入 (opt-in)。
>
{style="warning"}
 
在本系列的最後一部分，讓我們看看如何在 Kotlin/Native 中處理 C 字串。

在本教學中，您將學習如何：

* [將 Kotlin 字串傳遞給 C](#pass-kotlin-strings-to-c)
* [在 Kotlin 中讀取 C 字串](#read-c-strings-in-kotlin)
* [將 C 字串位元組接收到 Kotlin 字串中](#receive-c-string-bytes-from-kotlin)

## 使用 C 字串

C 語言沒有專用的字串型別。函式簽章或文件可以幫助您判斷
在特定上下文中，給定的 `char *` 是否代表一個 C 字串。

C 語言中的字串是以 null 終止的，因此會在位元組序列的末尾添加一個尾隨的零字元 `\0` 以標記字串的結束。通常使用 [UTF-8 編碼字串](https://en.wikipedia.org/wiki/UTF-8)。
UTF-8 編碼使用變寬字元，並與 [ASCII](https://en.wikipedia.org/wiki/ASCII) 向後相容。
Kotlin/Native 預設使用 UTF-8 字元編碼。

要了解 Kotlin 和 C 之間如何映射字串，首先需要建立函式庫標頭。
在本系列的[第一部分](mapping-primitive-data-types-from-c.md)中，您已經建立了一個帶有
必要檔案的 C 函式庫。對於此步驟：

1. 使用以下處理 C 字串的函式宣告來更新您的 `lib.h` 檔案：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   此範例顯示了在 C 語言中傳遞或接收字串的常見方式。請仔細處理 `return_string()` 函式的回傳值。
   請確保使用正確的 `free()` 函式來釋放回傳的 `char*`。

2. 在 `---` 分隔符號之後，更新 `interop.def` 檔案中的宣告：

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

`interop.def` 檔案提供了在 IDE 中編譯、運行或開啟應用程式所需的一切。

## 檢查為 C 函式庫生成的 Kotlin API

讓我們看看 C 字串宣告如何映射到 Kotlin/Native：

1. 在 `src/nativeMain/kotlin` 中，從[先前的教學](mapping-function-pointers-from-c.md)更新您的 `hello.kt` 檔案
   為以下內容：

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

2. 使用 IntelliJ IDEA 的[跳轉到宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 來導航到以下為 C 函式生成的 API：

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

這些宣告很直觀。在 Kotlin 中，C 語言的 `char *` 指標會被映射為參數的 `str: CValuesRef<ByteVarOf>?`，
並映射為回傳型別的 `CPointer<ByteVarOf>?`。Kotlin 將 `char` 型別表示為 `kotlin.Byte`，
因為它通常是一個 8 位元的有符號值。

在生成的 Kotlin 宣告中，`str` 被定義為 `CValuesRef<ByteVarOf<Byte>>?`。
由於此型別可為 null，您可以傳遞 `null` 作為引數值。

## 將 Kotlin 字串傳遞給 C

讓我們先嘗試從 Kotlin 使用此 API。首先呼叫 `pass_string()` 函式：

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

多虧了 `String.cstr` [擴充屬性](extensions.md#extension-properties)，將 Kotlin 字串傳遞給 C 語言非常直接。
對於涉及 UTF-16 字元的情況，還有 `String.wcstr` 屬性。

## 在 Kotlin 中讀取 C 字串

現在從 `return_string()` 函式獲取一個回傳的 `char *`，並將其轉換為 Kotlin 字串：

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

在這裡，`.toKString()` 擴充函數將 `return_string()` 函式回傳的 C 字串
轉換為 Kotlin 字串。

Kotlin 提供了多個擴充函數，用於將 C 語言的 `char *` 字串轉換為 Kotlin 字串，
具體取決於編碼：

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // Standard function for UTF-8 strings
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // Explicitly converts UTF-8 strings
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // Converts UTF-16 encoded strings
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // Converts UTF-32 encoded strings
```

## 將 C 字串位元組接收到 Kotlin 字串中

這次，使用 `copy_string()` C 函式將 C 字串寫入給定的緩衝區。它接受兩個引數：
一個指向應寫入字串的記憶體位置的指標，以及允許的緩衝區大小。

該函式還應回傳一些內容以指示其成功或失敗。我們假設 `0` 表示成功，
並且提供的緩衝區足夠大：

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

在這裡，首先將一個原生指標傳遞給 C 函式。`.usePinned` 擴充函數會暫時
固定位元組陣列的原生記憶體位址。C 函式會將資料填入位元組陣列。另一個擴充函數
`ByteArray.decodeToString()` 會將位元組陣列轉換為 Kotlin 字串，假定為 UTF-8 編碼。

## 更新 Kotlin 程式碼

現在您已經學會了如何在 Kotlin 程式碼中使用 C 宣告，請嘗試在您的專案中使用它們。
最終的 `hello.kt` 檔案中的程式碼可能如下所示：
 
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

為驗證一切是否按預期工作，請在[您的 IDE](native-get-started.md) 中運行 `runDebugExecutableNative` Gradle 任務
或使用以下命令運行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 接下來

在涵蓋更多進階情境的[與 C 語言的互通性](native-c-interop.md)文件中了解更多資訊。