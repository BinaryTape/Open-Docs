[//]: # (title: 从 C 语言映射字符串 – 教程)

<tldr>
    <p>这是 **映射 Kotlin 和 C** 教程系列的最后一部分。在继续之前，请确保你已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">从 C 语言映射原生数据类型</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">从 C 语言映射结构体和联合体类型</a><br/>
      <img src="icon-3-done.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">映射函数指针</a><br/>
      <img src="icon-4.svg" width="20" alt="第四步"/> <strong>从 C 语言映射字符串</strong><br/>
    </p>
</tldr>

> C 语言库导入处于 [Beta](native-c-interop-stability.md) 阶段。所有通过 cinterop 工具从 C 语言库生成的 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> Kotlin/Native 附带的原生平台库（例如 Foundation、UIKit 和 POSIX）仅对某些 API 要求显式选择启用。
>
{style="note"}
 
在本系列的最后一部分，让我们看看如何在 Kotlin/Native 中处理 C 字符串。

在本教程中，你将学习如何：

* [将 Kotlin 字符串传递给 C](#pass-kotlin-strings-to-c)
* [在 Kotlin 中读取 C 字符串](#read-c-strings-in-kotlin)
* [将 C 字符串字节接收到 Kotlin 字符串中](#receive-c-string-bytes-from-kotlin)

## 使用 C 字符串

C 语言没有专用的字符串类型。方法签名或文档可以帮助你识别在特定上下文中给定的 `char *` 是否表示 C 字符串。

C 语言中的字符串是空终止的，因此在字节序列的末尾会添加一个尾随的零字符 `\0` 以标记字符串的结束。通常使用 [UTF-8 编码字符串](https://en.wikipedia.org/wiki/UTF-8)。UTF-8 编码使用可变宽度字符，并与 [ASCII](https://en.wikipedia.org/wiki/ASCII) 向后兼容。Kotlin/Native 默认使用 UTF-8 字符编码。

要理解 Kotlin 和 C 之间如何映射字符串，首先创建库头文件。在本系列的[第一部分](mapping-primitive-data-types-from-c.md)中，你已经创建了一个包含所需文件的 C 语言库。对于此步骤：

1. 使用以下处理 C 字符串的函数声明更新你的 `lib.h` 文件：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   此示例展示了在 C 语言中传递或接收字符串的常见方式。请仔细处理 `return_string()` 函数的返回值。确保使用正确的 `free()` 函数来释放返回的 `char*`。

2. 在 `---` 分隔符后，更新 `interop.def` 文件中的声明：

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

`interop.def` 文件提供了在 IDE 中编译、运行或打开应用程序所需的一切。

## 探查 C 语言库生成的 Kotlin API

让我们看看 C 字符串声明如何映射到 Kotlin/Native 中：

1. 在 `src/nativeMain/kotlin` 中，使用以下内容更新你[上一个教程](mapping-function-pointers-from-c.md)中的 `hello.kt` 文件：

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

2. 使用 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到以下为 C 语言生成的 API：

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

这些声明很简单。在 Kotlin 中，C 语言的 `char *` 指针被映射为参数的 `str: CValuesRef<ByteVarOf>?` 并且映射为返回类型的 `CPointer<ByteVarOf>?`。Kotlin 将 `char` 类型表示为 `kotlin.Byte`，因为它通常是一个 8 位有符号值。

在生成的 Kotlin 声明中，`str` 被定义为 `CValuesRef<ByteVarOf<Byte>>?`。由于此类型是可空的，因此你可以将 `null` 作为实参值传递。 

## 将 Kotlin 字符串传递给 C

让我们尝试在 Kotlin 中使用此 API。首先调用 `pass_string()` 函数：

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

将 Kotlin 字符串传递给 C 非常简单，这得益于 `String.cstr` [扩展属性](extensions.md#extension-properties)。对于涉及 UTF-16 字符的情况，还有 `String.wcstr` 属性。

## 在 Kotlin 中读取 C 字符串

现在，从 `return_string()` 函数获取返回的 `char *` 并将其转换为 Kotlin 字符串：

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

在这里，`.toKString()` [扩展](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/to-k-string.html)函数将从 `return_string()` 函数返回的 C 字符串转换为 Kotlin 字符串。

Kotlin 提供了几个扩展函数，用于将 C 语言的 `char *` 字符串转换为 Kotlin 字符串，具体取决于编码：

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // Standard function for UTF-8 strings
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // Explicitly converts UTF-8 strings
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // Converts UTF-16 encoded strings
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // Converts UTF-32 encoded strings
```

## 从 Kotlin 接收 C 字符串字节

这次，使用 `copy_string()` C 函数将 C 字符串写入给定缓冲区。它接受两个实参：一个指向字符串应写入的内存位置的指针以及允许的缓冲区大小。

该函数还应返回一些内容以指示其是成功还是失败。我们假设 `0` 表示成功，并且提供的缓冲区足够大：

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

在这里，首先将一个原生指针传递给 C 函数。`.usePinned()` [扩展](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)函数会临时固定字节数组的原生内存地址。C 函数会用数据填充字节数组。另一个扩展函数 `ByteArray.decodeToString()` 则将字节数组转换为 Kotlin 字符串，假设为 UTF-8 编码。 

## 更新 Kotlin 代码

既然你已经学会了如何在 Kotlin 代码中使用 C 声明，请尝试在你的项目中中使用它们。最终的 `hello.kt` 文件中的代码可能如下所示：
 
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

要验证一切是否按预期工作，请在你的 [IDE](native-get-started.md) 中运行 `runDebugExecutableNative` Gradle 任务或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 接下来

在 [C 语言互操作](native-c-interop.md) 文档中了解更多信息，该文档涵盖了更高级的场景。