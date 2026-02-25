[//]: # (title: 與 C 的互通性)

> C 程式庫匯入目前處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。所有由 `cinterop` 工具從 C 程式庫產生的 Kotlin 宣告都應帶有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台程式庫（如 Foundation、UIKit 和 POSIX）僅針對部分 API 要求選入（opt-in）。
>
{style="note"}

本文件涵蓋了 Kotlin 與 C 互通的一般層面。Kotlin/Native 附帶了 `cinterop` 工具，你可以使用它快速產生與外部 C 程式庫互動所需的一切內容。

該工具會分析 C 標頭檔並產出 C 型別、函式和字串到 Kotlin 的直接對應。產生的虛設常式（stubs）隨後可以匯入到 IDE 中，以啟用程式碼補全和瀏覽功能。

> Kotlin 也提供了與 Objective-C 的互通性。Objective-C 程式庫同樣是透過 `cinterop` 工具匯入。如需更多詳細資訊，請參閱 [Swift/Objective-C 互通性](native-objc-interop.md)。
>
{style="tip"}

## 設定你的專案

以下是處理需要取用 C 程式庫的專案時的一般流程：

1. 建立並配置[定義檔](native-definition-file.md)。它描述了 `cinterop` 工具應在 Kotlin [繫結](#bindings)中包含哪些內容。
2. 配置你的 Gradle 組建檔案，將 `cinterop` 納入建置過程中。
3. 編譯並執行專案以產生最終的可執行檔。

> 若要獲得動手實作經驗，請完成[使用 C 互通功能建立應用程式](native-app-with-c-and-libcurl.md)教學。
>
{style="note"}

在許多情況下，不需要配置自訂的 C 程式庫互通功能。相反地，你可以使用平台上已標準化繫結的可用 API，稱為[平台程式庫](native-platform-libs.md)。例如，Linux/macOS 平台上的 POSIX、Windows 平台上的 Win32，或是 macOS/iOS 上的 Apple 框架都可以透過這種方式使用。

## 繫結

### 基本互通型別

所有支援的 C 型別在 Kotlin 中都有對應的表示方式：

* 有符號、無符號整數以及浮點型別會對應到具有相同寬度的 Kotlin 對應型別。
* 指標（Pointers）和陣列（Arrays）會對應到 `CPointer<T>?`。
* 列舉（Enums）可以根據啟發式演算法和[定義檔設定](native-definition-file.md#configure-enums-generation)對應到 Kotlin 列舉或整數值。
* 結構（Structs）和聯合（Unions）會對應到可透過點記法存取欄位的型別，例如 `someStructInstance.field1`。
* `typedef` 會表示為 `typealias`。

此外，任何 C 型別都有對應的 Kotlin 型別來表示該型別的左值（lvalue），即位於記憶體中的值，而非簡單的不可變獨立值。可以將 C++ 的參照（references）視為類似的概念。對於結構（以及結構的 `typedef`），這種表示方式是主要的表示方式，且與結構本身具有相同的名稱。對於 Kotlin 列舉，它被命名為 `${type}.Var`；對於 `CPointer<T>`，它是 `CPointerVar<T>`；而對於大多數其他型別，則是 `${type}Var`。

對於同時具有兩種表示方式的型別，具有左值的型別有一個可變的 `.value` 屬性用於存取該值。

#### 指標型別

`CPointer<T>` 的型別引數 `T` 必須是上述左值型別之一。例如，C 型別 `struct S*` 會對應到 `CPointer<S>`，`int8_t*` 對應到 `CPointer<int_8tVar>`，而 `char**` 則對應到 `CPointer<CPointerVar<ByteVar>>`。

C null 指標在 Kotlin 中表示為 `null`，指標型別 `CPointer<T>` 是不可為 null 的，但 `CPointer<T>?` 可以。此型別的值支援所有與處理 `null` 相關的 Kotlin 操作，例如 `?:`、`?.`、`!!` 等：

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由於陣列也對應到 `CPointer<T>`，因此它支援 `[]` 運算子以透過索引存取值：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 屬性會回傳該指標所指向的 `T` 型別左值。反向操作是 `.ptr`，它會取得左值並回傳指向它的指標。

`void*` 會對應到 `COpaquePointer` —— 這是特殊的指標型別，是任何其他指標型別的超型別。因此，如果 C 函式接受 `void*`，Kotlin 繫結將接受任何 `CPointer`。

可以使用 `.reinterpret<T>` 來進行指標轉型（包含 `COpaquePointer`），例如：

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

與 C 一樣，這些 `.reinterpret` 轉型是不安全的，並可能導致應用程式中出現細微的記憶體問題。

此外，透過 `.toLong()` 和 `.toCPointer<T>()` 擴充方法，可以在 `CPointer<T>?` 和 `Long` 之間進行不安全轉型：

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 如果可以從上下文中得知結果的型別，由於型別推論的緣故，你可以省略型別引數。
> 
{style="tip"}

### 記憶體分配

可以使用 `NativePlacement` 介面來分配原生記憶體，例如：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

val placement: NativePlacement = // 請參閱下方的分配範例
val byteVar = placement.alloc<ByteVar>()
val bytePtr = placement.allocArray<ByteVar>(5)
```

最合乎邏輯的分配位置是在 `nativeHeap` 物件中。它對應於使用 `malloc` 分配原生記憶體，並提供額外的 `.free()` 操作來釋放已分配的記憶體：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*

fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` 要求手動釋放記憶體。然而，分配生命週期與詞法作用域綁定的記憶體通常很有用。如果這類記憶體能自動釋放，將會非常有幫助。

為了解決這個問題，你可以使用 `memScoped { }`。在花括號內，臨時分配位置作為隱式接收者可用，因此可以使用 `alloc` 和 `allocArray` 分配原生記憶體，且分配的記憶體將在離開作用域後自動釋放。

例如，一個透過指標參數回傳值的 C 函式可以這樣使用：

```kotlin
@file:OptIn(ExperimentalForeignApi::class)
import kotlinx.cinterop.*
import platform.posix.*

val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### 將指標傳遞給繫結

雖然 C 指標對應到 `CPointer<T>` 型別，但 C 函式的指標型型別參數會對應到 `CValuesRef<T>`。當傳遞 `CPointer<T>` 作為此類參數的值時，它會原樣傳遞給 C 函式。然而，可以傳遞一系列值來代替指標。在這種情況下，該序列會「按值」傳遞，也就是說，C 函式會接收到該序列臨時副本的指標，該指標僅在函式回傳前有效。

指標參數的 `CValuesRef<T>` 表示方式旨在支援無需明確原生記憶體分配的 C 陣列常值。為了建構不可變的獨立 C 值序列，提供了以下方法：

* `${type}Array.toCValues()`，其中 `type` 是 Kotlin 基本型別
* `Array<CPointer<T>?>.toCValues()`、`List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})`，其中 `type` 是基本型別或指標

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

與其他指標不同，`const char*` 型別的參數被表示為 Kotlin `String`。因此，可以將任何 Kotlin 字串傳遞給預期 C 字串的繫結。

還有一些工具可用於手動在 Kotlin 和 C 字串之間進行轉換：

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`。

要取得指標，`.cstr` 應在原生記憶體中分配，例如：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有情況下，C 字串都應該以 UTF-8 編碼。

若要跳過自動轉換並確保在繫結中使用原始指標，請將 [`noStringConversion` 屬性](native-definition-file.md#set-up-string-conversion)新增到 `.def` 檔案中：

```c
noStringConversion = LoadCursorA LoadCursorW
```

這樣，任何 `CPointer<ByteVar>` 型別的值都可以作為 `const char*` 型別的引數傳遞。如果需要傳遞 Kotlin 字串，可以使用如下程式碼：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // 用於 ASCII 或 UTF-8 版本
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // 用於 UTF-16 版本
}
```

### 作用域局部指標

可以使用在 `memScoped {}` 下可用的 `CValues<T>.ptr` 擴充屬性，為 `CValues<T>` 執行個體建立 C 表示形式的作用域穩定指標。它允許使用需要 C 指標且生命週期綁定到特定 `MemScope` 的 API。例如：

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

在此範例中，傳遞給 C API `new_menu()` 的所有值，其生命週期都屬於它所屬的最內層 `memScope`。一旦控制流程離開 `memScoped` 作用域，C 指標就會失效。

### 按值傳遞和接收結構

當 C 函式按值接受或回傳結構/聯合 `T` 時，相應的引數型別或回傳型別會表示為 `CValue<T>`。

`CValue<T>` 是一個不透明型別，因此無法透過相應的 Kotlin 屬生存取結構欄位。如果 API 將結構作為不透明控制代碼（opaque handles）使用，這可能沒問題。但是，如果需要存取欄位，可以使用以下轉換方法：

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  將（左值）`T` 轉換為 `CValue<T>`。因此，為了建構 `CValue<T>`，可以分配 `T`、填寫內容，然後轉換為 `CValue<T>`。
* [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  暫時將 `CValue<T>` 儲存在記憶體中，然後以該放置的值 `T` 作為接收者執行傳入的 lambda。因此，要讀取單個欄位，你可以使用以下程式碼：

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
* [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  套用提供的 `initialize` 函式在記憶體中分配 `T`，並將結果轉換為 `CValue<T>`。
* [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  建立現有 `CValue<T>` 的修改後副本。原始值會被放置在記憶體中，使用 `modify()` 函式進行更改，然後轉換回新的 `CValue<T>`。
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  將 `CValues<T>` 放入 `AutofreeScope` 中，回傳指向已分配記憶體的指標。當 `AutofreeScope` 被處置時，分配的記憶體會自動釋放。

### 回呼

若要將 Kotlin 函式轉換為指向 C 函式的指標，可以使用 `staticCFunction(::kotlinFunction)`。也可以提供 lambda 而不是函式參照。該函式或 lambda 不得擷取任何值。

#### 將使用者資料傳遞給回呼

C API 通常允許將某些使用者資料傳遞給回呼。此類資料通常由使用者在配置回呼時提供。例如，它會以 `void*` 的形式傳遞給某些 C 函式（或寫入結構）。然而，Kotlin 物件的參照不能直接傳遞給 C。因此，它們需要在配置回呼之前進行包裝，然後在回呼本身中進行解包，以便安全地從 Kotlin 經過 C 世界再回到 Kotlin。這種包裝可以透過 `StableRef` 類別實現。

包裝參照：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

這裡，`voidPtr` 是一個 `COpaquePointer`，可以傳遞給 C 函式。

解包參照：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

這裡，`kotlinReference` 是原始的包裝參照。

建立的 `StableRef` 最終必須使用 `.dispose()` 方法手動處置，以防止記憶體洩漏：

```kotlin
stableRef.dispose()
```

處置後它將失效，因此 `voidPtr` 無法再被解包。

### 巨集

每個擴展為常數的 C 巨集都表示為 Kotlin 屬性。

在編譯器可以推論型別的情況下，支援不帶參數的巨集：

```c
int foo(int);
#define FOO foo(42)
```

在這種情況下，`FOO` 在 Kotlin 中可用。

為了支援其他巨集，你可以透過將它們包裝在支援的宣告中來手動公開它們。例如，透過在程式庫中[新增自訂宣告](native-definition-file.md#add-custom-declarations)，類函式巨集 `FOO` 可以作為函式 `foo()` 公開：

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 移植性

有時 C 程式庫的函式參數或結構欄位具有平台相依型別，例如 `long` 或 `size_t`。Kotlin 本身不提供隱式整數轉型或 C 風格整數轉型（例如 `(size_t) intValue`），因此為了讓編寫這類情況下的可移植程式碼更容易，提供了 `convert` 方法：

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

這裡，`type1` 和 `type2` 必須都是整數型別，無論是有符號還是無符號。

`.convert<${type}>` 的語意與 `.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte`、`.toUShort`、`.toUInt` 或 `.toULong` 方法之一相同，具體取決於 `type`。

使用 `convert` 的範例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

此外，型別參數可以自動推論，因此在某些情況下可以省略。

### 物件固定

Kotlin 物件可以被固定（pinned），即保證它們在記憶體中的位置在取消固定之前是穩定的，並且指向這些物件內部資料的指標可以傳遞給 C 函式。

你可以採取幾種方法：

* 使用 [`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 擴充函式來固定物件、執行一個區塊，並在正常和異常路徑上取消固定：

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
              // 現在 `buffer` 含有從 `recv()` 呼叫取得的原始資料。
          }
      }
  }
  ```

  這裡，`pinned` 是一個特殊型別 `Pinned<T>` 的物件。它提供了有用的擴充功能，如 [`.addressOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/address-of.html)，允許取得固定陣列主體的位址。

* 使用 [`.refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 擴充函式，其底層具有類似的功能，但在某些情況下可以幫助你減少樣板程式碼：

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
          // 現在 `buffer` 含有從 `recv()` 呼叫取得的原始資料。
      }
  }
  ```

  這裡，`buffer.refTo(0)` 具有 `CValuesRef` 型別，它在進入 `recv()` 函式之前固定陣列，將其第零個元素的位址傳遞給函式，並在離開後取消固定陣列。

### 前向宣告

若要匯入前向宣告（forward declarations），請使用 `cnames` 套件。例如，若要匯入在具有 `library.package` 的 C 程式庫中宣告的 `cstructName` 前向宣告，請使用特殊的前向宣告套件：`import cnames.structs.cstructName`。

考慮兩個 `cinterop` 程式庫：一個具有結構的前向宣告，另一個在另一個套件中具有實際實作：

```C
// 第一個 C 程式庫
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed
");
}
```

```C
// 第二個 C 程式庫
// 標頭檔：
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// 實作：
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

若要在兩個程式庫之間傳遞物件，請在 Kotlin 程式碼中使用顯式的 `as` 轉型：

```kotlin
// Kotlin 程式碼：
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 接下來的步驟

透過完成以下教學，了解型別、函式和字串如何在 Kotlin 和 C 之間對應：

* [對應來自 C 的基本資料型別](mapping-primitive-data-types-from-c.md)
* [對應來自 C 的結構和聯合型別](mapping-struct-union-types-from-c.md)
* [對應來自 C 的函式指標](mapping-function-pointers-from-c.md)
* [對應來自 C 的字串](mapping-strings-from-c.md)