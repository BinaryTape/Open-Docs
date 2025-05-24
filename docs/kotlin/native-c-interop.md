---
title: "与 C 的互操作性"
---
:::note
C 库的导入是 [实验性的](components-stability#stability-levels-explained)。
所有由 cinterop 工具从 C 库生成的 Kotlin 声明都应具有 `@ExperimentalForeignApi` 注解。

Kotlin/Native 附带的 Native 平台库（例如 Foundation、UIKit 和 POSIX）
仅对某些 API 需要选择加入。

本文档涵盖了 Kotlin 与 C 互操作性的一般方面。Kotlin/Native 自带 cinterop 工具，
您可以使用它来快速生成与外部 C 库交互所需的一切。

该工具分析 C 头文件，并将 C 类型、函数和常量直接映射到 Kotlin 中。
然后，生成的桩可以导入到 IDE 中，以启用代码完成和导航。

Kotlin 还提供与 Objective-C 的互操作性。Objective-C 库也通过 cinterop 工具导入。
有关更多详细信息，请参阅 [Swift/Objective-C 互操作](native-objc-interop)。

:::

## 设置你的项目

以下是使用需要使用 C 库的项目的通用工作流程：

1. 创建并配置一个 [定义文件](native-definition-file)。它描述了 cinterop 工具应将什么
   包含到 Kotlin [绑定](#bindings)中。
2. 配置你的 Gradle 构建文件，以将 cinterop 包含在构建过程中。
3. 编译并运行项目以生成最终的可执行文件。

为了获得实践经验，请完成 [使用 C 互操作创建应用程序](native-app-with-c-and-libcurl) 教程。

:::

在许多情况下，无需配置与 C 库的自定义互操作性。相反，你可以使用平台上可用的 API，
这些 API 是称为 [平台库](native-platform-libs) 的标准化绑定。例如，
Linux/macOS 平台上的 POSIX、Windows 平台上的 Win32 或 macOS/iOS 上的 Apple 框架都可以通过这种方式获得。

## 绑定 (Bindings)

### 基本互操作类型 (Basic interop types)

所有支持的 C 类型在 Kotlin 中都有相应的表示形式：

* 有符号、无符号整型和浮点类型映射到 Kotlin 中具有相同宽度的对应类型。
* 指针和数组映射到 `CPointer<T>?`。
* 枚举可以映射到 Kotlin 枚举或整型值，具体取决于启发式方法和
  [定义文件设置](native-definition-file#configure-enums-generation)。
* 结构体和联合体映射到通过点表示法访问字段的类型，例如 `someStructInstance.field1`。
* `typedef` 表示为 `typealias`。

此外，任何 C 类型都具有表示此类型左值的 Kotlin 类型，即位于内存中的值，而不是
一个简单的不可变的自包含值。可以把 C++ 引用看作一个类似的概念。对于结构体（和 `typedef` 到
结构体），此表示形式是主要的，并且与结构体本身具有相同的名称。对于 Kotlin 枚举，它被命名为
`${type}.Var`；对于 `CPointer<T>`，它是 `CPointerVar<T>`；对于大多数其他类型，它是 `${type}Var`。

对于同时具有两种表示形式的类型，具有左值的类型具有一个可变的 `.value` 属性，用于访问该值。

#### 指针类型 (Pointer types)

`CPointer<T>` 的类型参数 `T` 必须是上述左值类型之一。例如，C 类型
`struct S*` 映射到 `CPointer<S>`，`int8_t*` 映射到 `CPointer<int_8tVar>`，`char**` 映射到
`CPointer<CPointerVar<ByteVar>>`。

C 空指针表示为 Kotlin 的 `null`，指针类型 `CPointer<T>` 不可为空，但
`CPointer<T>?` 可以为空。此类型的值支持所有与处理 `null` 相关的 Kotlin 操作，例如，
`?:`、`?.`、`!!` 等等：

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由于数组也映射到 `CPointer<T>`，因此它支持 `[]` 运算符，用于按索引访问值：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 属性返回此指针指向的 `T` 类型的左值。反向操作
是 `.ptr`，它接受左值并返回指向它的指针。

`void*` 映射到 `COpaquePointer` – 一种特殊的指针类型，它是任何其他指针类型的超类型。
因此，如果 C 函数接受 `void*`，则 Kotlin 绑定接受任何 `CPointer`。

可以使用 `.reinterpret<T>` 转换指针（包括 `COpaquePointer`），例如：

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

与 C 一样，这些 `.reinterpret` 转换是不安全的，并且可能导致应用程序中出现细微的内存问题。

此外，`CPointer<T>?` 和 `Long` 之间存在不安全的转换，由 `.toLong()` 和 `.toCPointer<T>()` 提供
扩展方法：

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

:::tip
如果从上下文中知道结果的类型，则可以省略类型参数，这要归功于类型推断。

:::

### 内存分配 (Memory allocation)

可以使用 `NativePlacement` 接口分配 Native 内存，例如：

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

最符合逻辑的 placement 是在对象 `nativeHeap` 中。它对应于使用 `malloc` 分配 Native 内存，并
提供额外的 `.free()` 操作来释放已分配的内存：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` 需要手动释放内存。但是，在词法作用域内绑定生命周期来分配内存通常很有用。
如果自动释放此类内存，这将很有帮助。

为了解决这个问题，你可以使用 `memScoped { }`。在花括号内，临时 placement 可用作隐式
接收器，因此可以使用 alloc 和 allocArray 分配 Native 内存，并且分配的内存将在
离开作用域后自动释放。

例如，可以使用通过指针参数返回值的 C 函数，如下所示：

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

### 将指针传递给绑定 (Pass pointers to bindings)

尽管 C 指针映射到 `CPointer<T> type`，但 C 函数指针类型的参数映射到
`CValuesRef<T>.` 将 `CPointer<T>` 作为此类参数的值传递时，它会按原样传递给 C 函数。
但是，可以传递值的序列而不是指针。在这种情况下，该序列是“按值”传递的，即
C 函数接收指向该序列临时副本的指针，该指针仅在函数返回之前有效。

指针参数的 `CValuesRef<T>` 表示形式旨在支持 C 数组字面量，而无需显式的 Native
内存分配。为了构造 C 值的不可变自包含序列，提供了以下方法：

* `${type}Array.toCValues()`，其中 `type` 是 Kotlin 原始类型
* `Array<CPointer<T>?>.toCValues()`、`List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})`，其中 `type` 是原始类型或指针

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

### 字符串 (Strings)

与其他指针不同，`const char*` 类型的参数表示为 Kotlin `String`。因此，可以将任何 Kotlin 字符串
传递给期望 C 字符串的绑定。

还有一些工具可用于手动在 Kotlin 和 C 字符串之间进行转换：

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`.

要获取指针，应在 Native 内存中分配 `.cstr`，例如：

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有情况下，C 字符串都应编码为 UTF-8。

要跳过自动转换并确保在绑定中使用原始指针，请将
[`noStringConversion` 属性](native-definition-file#set-up-string-conversion) 添加到 `.def` 文件：

```c
noStringConversion = LoadCursorA LoadCursorW
```

这样，任何 `CPointer<ByteVar>` 类型的值都可以作为 `const char*` 类型的参数传递。如果应传递 Kotlin 字符串
，则可以使用如下代码：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // for ASCII or UTF-8 version
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // for UTF-16 version
}
```

### 作用域局部指针 (Scope-local pointers)

可以使用 `CValues<T>.ptr` 为 `CValues<T>` 实例创建一个 C 表示形式的作用域稳定指针
扩展属性，该属性在 `memScoped {}` 下可用。它允许使用需要 C 指针的 API，这些指针的生命周期绑定
到某个 `MemScope`。例如：

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value `->` items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

在此示例中，传递给 C API `new_menu()` 的所有值都具有其所属的最内层 `memScope` 的生命周期。
一旦控制流离开 `memScoped` 作用域，C 指针将变为无效。

### 按值传递和接收结构体 (Pass and receive structs by value)

当 C 函数按值获取或返回结构体/联合体 `T` 时，相应的参数类型或返回类型
表示为 `CValue<T>`。

`CValue<T>` 是一种不透明类型，因此无法使用相应的 Kotlin 属性访问结构体字段。
如果 API 将结构体用作不透明句柄，则这可能很好。但是，如果需要字段访问，则可以使用以下
转换方法：

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  将（左值）`T` 转换为 `CValue<T>`。因此，要构造 `CValue<T>`，
  可以分配 `T`、填充它，然后将其转换为 `CValue<T>`。
* [`CValue<T>.useContents(block: T.() `->` R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  暂时将 `CValue<T>` 存储在内存中，然后使用作为接收器的此放置值 `T` 运行传递的 lambda。
  因此，要读取单个字段，可以使用以下代码：

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```
  
* [`fun cValue(initialize: T.() `->` Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  将提供的 `initialize` 函数应用于在内存中分配 `T` 并将结果转换为 `CValue<T>`。
* [`fun CValue<T>.copy(modify: T.() `->` Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  创建现有 `CValue<T>` 的修改副本。原始值放置在内存中，使用 `modify()`
  函数进行更改，然后转换回新的 `CValue<T>`。
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  将 `CValues<T>` 放入 `AutofreeScope` 中，返回指向已分配内存的指针。当 `AutofreeScope`
  被释放时，已分配的内存会自动释放。

### 回调 (Callbacks)

要将 Kotlin 函数转换为指向 C 函数的指针，可以使用 `staticCFunction(::kotlinFunction)`。也可以
提供 lambda 代替函数引用。函数或 lambda 不得捕获任何值。

#### 将用户数据传递给回调 (Pass user data to callbacks)

通常，C API 允许将一些用户数据传递给回调。此类数据通常由用户在配置
回调时提供。例如，它作为 `void*` 传递给某些 C 函数（或写入结构体）。但是，无法将对 Kotlin 对象的引用
直接传递给 C。因此，它们需要在配置回调之前进行包装，然后在回调本身中进行解包，
以安全地从 Kotlin 传递到 C 世界再到 Kotlin。可以使用
`StableRef` 类进行此类包装。

要包装引用：

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

在此，`voidPtr` 是一个 `COpaquePointer`，可以传递给 C 函数。

要解包引用：

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

在此，`kotlinReference` 是原始包装的引用。

最终必须使用 `.dispose()` 方法手动释放创建的 `StableRef`，以防止内存泄漏：

```kotlin
stableRef.dispose()
```

之后，它将变为无效，因此无法再解包 `voidPtr`。

### 宏 (Macros)

扩展为常量的每个 C 宏都表示为 Kotlin 属性。

当编译器可以推断类型时，支持不带参数的宏：

```c
int foo(int);
#define FOO foo(42)
```

在这种情况下，`FOO` 在 Kotlin 中可用。

为了支持其他宏，你可以通过使用支持的声明包装它们来手动公开它们。例如，
函数式宏 `FOO` 可以通过
[向库添加自定义声明](native-definition-file#add-custom-declarations) 作为函数 `foo()` 公开：

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 可移植性 (Portability)

有时，C 库具有平台相关的类型的函数参数或结构体字段，例如 `long` 或
`size_t`。Kotlin 本身不提供隐式整数转换或 C 样式的整数转换（例如，
`(size_t) intValue`），因此为了使在这种情况下编写可移植代码更容易，提供了 `convert` 方法：

```kotlin
fun $.convert<$>(): $
```

在此，`type1` 和 `type2` 中的每一个都必须是整数类型，无论是有符号还是无符号。

`.convert<${type}>` 具有与 `.toByte`、`.toShort`、`.toInt`、`.toLong`、`.toUByte` 之一相同的语义、
`.toUShort`、`.toUInt` 或 `.toULong` 方法，具体取决于 `type`。

使用 `convert` 的示例：

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

此外，类型参数可以自动推断，因此在某些情况下可以省略。

### 对象固定 (Object pinning)

Kotlin 对象可以被固定，即保证它们在内存中的位置在它们被取消固定之前是稳定的，
并且指向此类对象内部数据的指针可以传递给 C 函数。

你可以采用以下几种方法：

* 使用 [`usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 服务函数
  该函数固定一个对象，执行一个块，并在正常和异常路径上取消固定它：

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*

  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) {
      val buffer = ByteArray(1024)
      buffer.usePinned { pinned `->`
          while (true) {
              val length = recv(fd, pinned.addressOf(0), buffer.size.convert(), 0).toInt()
              if (length <= 0) {
                  break
              }
              // 现在 `buffer` 具有从 `recv()` 调用中获得的原始数据。
          }
      }
  }
  ```

  在此，`pinned` 是特殊类型 `Pinned<T>` 的对象。它提供了有用的扩展，例如 `addressOf`，它允许
  获取固定数组主体的地址。

* 使用 [`refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 函数，该函数具有
  底层类似的功能，但在某些情况下，可以帮助你减少样板代码：

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
          // 现在 `buffer` 具有从 `recv()` 调用中获得的原始数据。
      }
  }
  ```

  在此，`buffer.refTo(0)` 具有 `CValuesRef` 类型，该类型在进入 `recv()` 函数之前固定数组，
  将第零个元素的地址传递给函数，并在退出后取消固定数组。

### 前向声明 (Forward declarations)

要导入前向声明，请使用 `cnames` 包。例如，要导入在具有 `library.package` 的 C 库中声明的
`cstructName` 前向声明，请使用特殊的前向声明包：
`import cnames.structs.cstructName`。

考虑两个 cinterop 库：一个具有结构体的前向声明，另一个
具有另一个包中的实际实现：

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

要在两个库之间传输对象，请在 Kotlin 代码中使用显式的 `as` 转换：

```kotlin
// Kotlin code:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 下一步 (What's next)

通过完成以下教程，了解类型、函数和常量如何在 Kotlin 和 C 之间映射：

* [从 C 映射原始数据类型](mapping-primitive-data-types-from-c)
* [从 C 映射结构体和联合体类型](mapping-function-pointers-from-c)
* [从 C 映射函数指针](mapping-function-pointers-from-c)
* [从 C 映射字符串](mapping-strings-from-c)
  ```