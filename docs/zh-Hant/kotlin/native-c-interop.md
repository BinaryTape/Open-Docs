[//]: # (title: 與 C 語言的互通性)

> C 函式庫匯入是 [實驗性功能](components-stability.md#stability-levels-explained)。
> 所有由 cinterop 工具從 C 函式庫產生的 Kotlin 宣告
> 都應具備 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 附帶的原生平台函式庫 (例如 Foundation、UIKit 和 POSIX)
> 僅部分 API 需要選擇啟用。
>
{style="warning"}

本文檔涵蓋了 Kotlin 與 C 語言互通性的通用層面。Kotlin/Native 附帶了一個 cinterop 工具，
您可以使用它快速生成與外部 C 函式庫互動所需的一切。

該工具分析 C 標頭檔，並將 C 類型、函式和常數直接映射到 Kotlin。
生成的存根隨後可以匯入 IDE，以啟用程式碼補齊和導覽。

> Kotlin 也提供了與 Objective-C 的互通性。Objective-C 函式庫
> 同樣透過 cinterop 工具匯入。詳情請參閱 [Swift/Objective-C 互通性](native-objc-interop.md)。
>
{style="tip"}

## 設定專案

當您需要使用 C 函式庫的專案時，一般的工作流程如下：

1. 建立並配置一個 [定義檔](native-definition-file.md)。它描述了 cinterop 工具應將哪些內容包含到 Kotlin [繫結](#bindings)中。
2. 配置您的 Gradle 建置檔，以便在建置過程中包含 cinterop。
3. 編譯並執行專案以產生最終的可執行檔。

> 若要獲得實作經驗，請完成 [使用 C interop 建立應用程式](native-app-with-c-and-libcurl.md) 教學。
>
{style="note"}

在許多情況下，無需配置自訂的與 C 函式庫的互通性。您可以改用平台上標準化的繫結所提供的 API，
稱為 [平台函式庫](native-platform-libs.md)。例如，Linux/macOS 平台上的 POSIX、Windows 平台上的 Win32，或 macOS/iOS 上的 Apple 框架都透過這種方式提供。

## 繫結

### 基本互通性類型

所有支援的 C 類型在 Kotlin 中都有對應的表示：

*   帶符號、無符號整數和浮點類型映射到具有相同位元寬度的 Kotlin 對應類型。
*   指標和陣列映射到 `CPointer<T>?`。
*   列舉可映射到 Kotlin 列舉或整數值，取決於啟發式規則和
    [定義檔設定](native-definition-file.md#configure-enums-generation)。
*   結構體和聯集映射到可透過點符號存取欄位的類型，即 `someStructInstance.field1`。
*   `typedef` 表示為 `typealias`。

此外，任何 C 類型都有表示該類型左值 (lvalue) 的 Kotlin 類型，即記憶體中的值，而非簡單不可變的獨立值。
可以將 C++ 參考 (references) 視為類似的概念。對於結構體（以及結構體的 `typedef`），這種表示是主要的，並與結構體本身同名。對於 Kotlin 列舉，它被命名為 `${type}.Var`；對於 `CPointer<T>`，它是 `CPointerVar<T>`；對於大多數其他類型，它是 `${type}Var`。

對於同時具備兩種表示的類型，具備左值 (lvalue) 的那個有一個可變的 `.value` 屬性，用於存取值。

#### 指標類型

`CPointer<T>` 的類型引數 `T` 必須是上述左值 (lvalue) 類型之一。例如，C 類型 `struct S*` 映射到 `CPointer<S>`，`int8_t*` 映射到 `CPointer<int_8tVar>`，而 `char**` 映射到 `CPointer<CPointerVar<ByteVar>>`。

C 空指標表示為 Kotlin 的 `null`，且指標類型 `CPointer<T>` 不可為空，但 `CPointer<T>?` 可以。此類型的值支援所有與處理 `null` 相關的 Kotlin 運算，例如 `?:`、`?.`、`!!` 等等：

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由於陣列也映射到 `CPointer<T>`，它支援 `[]` 運算子，用於按索引存取值：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 屬性返回此指標指向的 `T` 類型的左值 (lvalue)。反向操作是 `.ptr`，它接收左值 (lvalue) 並返回指向它的指標。

`void*` 映射到 `COpaquePointer` – 這是一種特殊的指標類型，是任何其他指標類型的超類型。
因此，如果 C 函式接收 `void*`，Kotlin 繫結接受任何 `CPointer`。

指標的轉換（包括 `COpaquePointer`）可以使用 `.reinterpret<T>` 完成，例如：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr = bytePtr.reinterpret<IntVar>()
```

或者：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr: CPointer<IntVar> = bytePtr.reinterpret()
```

與 C 語言一樣，這些 `.reinterpret` 轉換不安全，並且可能導致應用程式中出現微妙的記憶體問題。

此外，也提供了 `CPointer<T>?` 和 `Long` 之間不安全的類型轉換，由 `.toLong()` 和 `.toCPointer<T>()` 擴充方法提供：

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 如果結果的類型可以從上下文推斷出來，由於類型推斷，您可以省略類型引數。
>
{style="tip"}

### 記憶體分配

原生記憶體可以使用 `NativePlacement` 介面來分配，例如：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val byteVar = placement.alloc<ByteVar>()
```

或者：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val bytePtr = placement.allocArray<ByteVar>(5)
```

最邏輯的配置位置是在 `nativeHeap` 物件中。它對應於使用 `malloc` 分配原生記憶體，並提供了額外的 `.free()` 操作來釋放已分配的記憶體：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` 需要手動釋放記憶體。然而，通常有用的是分配生命週期綁定到詞法作用域的記憶體。如果這些記憶體能自動釋放會很有幫助。

為了解決這個問題，您可以使用 `memScoped { }`。在大括號內，臨時的記憶體放置點 (placement) 作為隱式接收者可用，因此可以透過 alloc 和 allocArray 分配原生記憶體，並且在離開作用域後，已分配的記憶體將會自動釋放。

例如，透過指標參數返回值的 C 函式可以使用如下方式：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### 將指標傳遞給繫結

儘管 C 指標映射到 `CPointer<T>` 類型，但 C 函式指標類型的參數則映射到 `CValuesRef<T>`。當將 `CPointer<T>` 作為此類參數的值傳遞時，它會原樣傳遞給 C 函式。然而，也可以傳遞一序列的值而非指標。在這種情況下，序列是「按值傳遞」的，即 C 函式會接收該序列臨時副本的指標，該指標僅在函式返回前有效。

指標參數的 `CValuesRef<T>` 表示旨在支援 C 陣列字面值而無需顯式分配原生記憶體。為了建構不可變的獨立 C 值序列，提供了以下方法：

*   `${type}Array.toCValues()`，其中 `type` 是 Kotlin 原生類型
*   `Array<CPointer<T>?>.toCValues()`，`List<CPointer<T>?>.toCValues()`
*   `cValuesOf(vararg elements: ${type})`，其中 `type` 是原生類型或指標

例如：

```c
// C:
void foo(int* elements, int count);
...
int elements[] = {1, 2, 3};
foo(elements, 3);
```

```kotlin
// Kotlin:

foo(cValuesOf(1, 2, 3), 3)
```

### 字串

與其他指標不同，類型為 `const char*` 的參數在 Kotlin 中表示為 `String`。因此，可以將任何 Kotlin 字串傳遞給預期 C 字串的繫結。

也有一些工具可手動在 Kotlin 和 C 字串之間進行轉換：

*   `fun CPointer<ByteVar>.toKString(): String`
*   `val String.cstr: CValuesRef<ByteVar>`.

要取得指標，`.cstr` 應在原生記憶體中分配，例如：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有情況下，C 字串應以 UTF-8 編碼。

若要跳過自動轉換並確保在繫結中使用原始指標，請將 [`noStringConversion` 屬性](native-definition-file.md#set-up-string-conversion) 新增到 `.def` 檔案中：

```c
noStringConversion = LoadCursorA LoadCursorW
```

這樣一來，任何 `CPointer<ByteVar>` 類型的值都可以作為 `const char*` 類型的引數傳遞。如果需要傳遞 Kotlin 字串，可以使用以下程式碼：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### 作用域局部指標

可以為 `CValues<T>` 實例建立 C 表示的作用域穩定指標，使用在 `memScoped {}` 下可用的 `CValues<T>.ptr` 擴充屬性。它允許使用那些要求 C 指標生命週期綁定到特定 `MemScope` 的 API。例如：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value -> items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

在此範例中，所有傳遞給 C API `new_menu()` 的值都具有其所屬最內層 `memScope` 的生命週期。一旦控制流離開 `memScoped` 作用域，C 指標將失效。

### 按值傳遞和接收結構體

當 C 函式按值接收或返回結構體/聯集 `T` 時，對應的引數類型或返回類型表示為 `CValue<T>`。

`CValue<T>` 是一個不透明類型，因此結構體欄位無法透過相應的 Kotlin 屬性存取。
如果 API 使用結構體作為不透明的句柄 (handles)，這可能沒問題。然而，如果需要存取欄位，則提供以下轉換方法：

*   [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html) 將（左值）`T` 轉換為 `CValue<T>`。因此，要建構 `CValue<T>`，可以先分配 `T`，填入內容，然後再轉換為 `CValue<T>`。
*   [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html) 暫時將 `CValue<T>` 儲存在記憶體中，然後以這個已放置的值 `T` 作為接收者執行傳入的 lambda。
    因此，要讀取單一欄位，可以使用以下程式碼：

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
*   [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html) 應用提供的 `initialize` 函式，在記憶體中分配 `T`，並將結果轉換為 `CValue<T>`。
*   [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html) 建立現有 `CValue<T>` 的修改副本。原始值會放置在記憶體中，使用 `modify()` 函式進行修改，然後再轉換回新的 `CValue<T>`。
*   [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html) 將 `CValues<T>` 放置到 `AutofreeScope` 中，並返回指向已分配記憶體的指標。當 `AutofreeScope` 被處置時，已分配的記憶體會自動釋放。

### 回呼

要將 Kotlin 函式轉換為指向 C 函式的指標，您可以使用 `staticCFunction(::kotlinFunction)`。也可以提供 lambda 而非函式參考。該函式或 lambda 不得捕獲任何值。

#### 將使用者資料傳遞給回呼

C API 通常允許將一些使用者資料傳遞給回呼。此類資料通常由使用者在配置回呼時提供。例如，它會以 `void*` 的形式傳遞給某些 C 函式（或寫入結構體）。然而，指向 Kotlin 物件的參考不能直接傳遞給 C。因此，在配置回呼之前需要進行包裝，然後在回呼本身中進行解包，以便安全地從 Kotlin 透過 C 世界傳遞到 Kotlin。這種包裝可以使用 `StableRef` 類別來實現。

包裝參考的方法：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

在這裡，`voidPtr` 是一個 `COpaquePointer`，可以傳遞給 C 函式。

解包參考的方法：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

在這裡，`kotlinReference` 是原始的已包裝參考。

所建立的 `StableRef` 最終必須使用 `.dispose()` 方法手動釋放，以防止記憶體洩漏：

```kotlin
stableRef.dispose()
```

之後，它會變得無效，因此 `voidPtr` 無法再解包。

### 巨集

每個展開為常數的 C 巨集都表示為 Kotlin 屬性。

在編譯器可以推斷類型的情況下，不帶參數的巨集也受支援：

```c
int foo(int);
#define FOO foo(42)
```

在此情況下，`FOO` 在 Kotlin 中可用。

為了支援其他巨集，您可以透過將它們包裝在受支援的宣告中來手動暴露它們。例如，函式式巨集 `FOO` 可以作為函式 `foo()` 暴露，透過 [為函式庫新增自訂宣告](native-definition-file.md#add-custom-declarations) 來實現：

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 可攜性

有時 C 函式庫的函式參數或結構體欄位具有平台相關的類型，例如 `long` 或 `size_t`。Kotlin 本身不提供隱式整數類型轉換或 C 風格的整數類型轉換（例如，`(size_t) intValue`），因此，為了在這種情況下更容易編寫可攜式程式碼，提供了 `convert` 方法：

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

這裡，`type1` 和 `type2` 都必須是整數類型，可以是帶符號或無符號的。

`.convert<${type}>` 具有與 `.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、`.toUShort`、`.toUInt` 或 `.toULong` 方法之一相同的語義，具體取決於 `type`。

使用 `convert` 的範例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

此外，類型參數可以自動推斷，因此在某些情況下可以省略。

### 物件釘選

Kotlin 物件可以被釘選 (pinned)，即它們在記憶體中的位置被保證穩定，直到它們被解除釘選 (unpinned)，並且可以將指向此類物件內部資料的指標傳遞給 C 函式。

有幾種方法可以採用：

*   使用 [`usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 服務函式，它會釘選一個物件，執行一個程式碼區塊，並在正常或例外情況下解除釘選它：

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*

  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) {
      val buffer = ByteArray(1024)
      buffer.usePinned { pinned ->
          while (true) {
              val length = recv(fd, pinned.addressOf(0), buffer.size.convert(), 0).toInt()
              if (length <= 0) {
                  break
              }
              // Now `buffer` has raw data obtained from the `recv()` call.
          }
      }
  }
  ```

  在這裡，`pinned` 是特殊類型 `Pinned<T>` 的物件。它提供了像 `addressOf` 這樣有用的擴充功能，允許取得已釘選陣列主體的位址。

*   使用 [`refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 函式，它在底層具有類似的功能，但在某些情況下，可能幫助您減少樣板程式碼：

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*
    
  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) { 
      val buffer = ByteArray(1024)
      while (true) {
          val length = recv(fd, buffer.refTo(0), buffer.size.convert(), 0).toInt()

          if (length <= 0) {
              break
          }
          // Now `buffer` has raw data obtained from the `recv()` call.
      }
  }
  ```

  在這裡，`buffer.refTo(0)` 具有 `CValuesRef` 類型，它在進入 `recv()` 函式之前釘選陣列，將其第零個元素的位址傳遞給函式，並在離開後解除釘選陣列。

### 前向宣告

若要匯入前向宣告，請使用 `cnames` 套件。例如，要匯入 C 函式庫中 `library.package` 宣告的 `cstructName` 前向宣告，請使用特殊的前向宣告套件：`import cnames.structs.cstructName`。

考慮兩個 cinterop 函式庫：一個包含結構體的前向宣告，另一個則在不同的套件中包含實際的實作：

```C
// First C library
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// Second C library
// Header:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// Implementation:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

要在兩個函式庫之間傳輸物件，請在您的 Kotlin 程式碼中使用顯式的 `as` 轉換：

```kotlin
// Kotlin code:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 接下來

透過完成以下教學，了解 Kotlin 與 C 之間類型、函式和常數是如何映射的：

*   [從 C 映射原始資料類型](mapping-primitive-data-types-from-c.md)
*   [從 C 映射結構體和聯集類型](mapping-function-pointers-from-c.md)
*   [從 C 映射函式指標](mapping-function-pointers-from-c.md)
*   [從 C 映射字串](mapping-strings-from-c.md)