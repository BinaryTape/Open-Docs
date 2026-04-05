[//]: # (title: 映射来自 C 的字符串 – 教程)

<tldr>
    <p>这是<strong>映射 Kotlin 和 C</strong> 教程系列的最后一部分。在继续之前，请确保您已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="mapping-primitive-data-types-from-c.md">映射来自 C 的基元数据类型</a><br/>
        <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">映射来自 C 的结构和联合类型</a><br/>
      <img src="icon-3-done.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">映射来自 C 的函数指针</a><br/>
      <img src="icon-4.svg" width="20" alt="第四步"/> <strong>映射来自 C 的字符串</strong><br/>
    </p>
</tldr>

> C 库导入目前处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。由 cinterop 工具从 C 库生成的所有 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 提供的原生平台库（如 Foundation、UIKit 和 POSIX）仅对部分 API 需要选择性加入。
>
{style="note"}
 
在本系列的最后一部分中，让我们看看如何在 Kotlin/Native 中处理 C 字符串。

在本教程中，您将学习如何：

* [将 Kotlin 字符串传递给 C](#pass-kotlin-strings-to-c)
* [在 Kotlin 中读取 C 字符串](#read-c-strings-in-kotlin)
* [从 Kotlin 接收 C 字符串字节到 Kotlin 字符串中](#receive-c-string-bytes-from-kotlin)

## 处理 C 字符串

C 没有专门的字符串类型。方法签名或文档可以帮助您识别在特定上下文中给定的 `char *` 是否表示 C 字符串。

C 语言中的字符串是以 null 结尾的，因此在字节序列的末尾会添加一个尾随零字符 `\0` 来标记字符串的结束。通常使用 [UTF-8 编码的字符串](https://en.wikipedia.org/wiki/UTF-8)。UTF-8 编码使用可变宽度字符，并且向后兼容 [ASCII](https://en.wikipedia.org/wiki/ASCII)。Kotlin/Native 默认使用 UTF-8 字符编码。

要了解字符串如何在 Kotlin 和 C 之间映射，首先创建库头文件。在[本系列的第一部分](mapping-primitive-data-types-from-c.md)中，您已经创建了一个包含必要文件的 C 库。对于这一步：

1. 更新您的 `lib.h` 文件，添加以下处理 C 字符串的函数声明：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED
   
   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);
   
   #endif
   ```

   这个示例展示了在 C 语言中传递或接收字符串的常用方法。请小心处理 `return_string()` 函数的返回值。确保您使用正确的 `free()` 函数来释放返回的 `char*`。

2. 在 `---` 分隔符之后更新 `interop.def` 文件中的声明：

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

`interop.def` 文件提供了编译、运行或在 IDE 中打开应用程序所需的一切。

## 检查为 C 库生成的 Kotlin API

让我们看看 C 字符串声明如何映射到 Kotlin/Native：

1. 在 `src/nativeMain/kotlin` 中，使用以下内容更新[上一篇教程](mapping-function-pointers-from-c.md)中的 `hello.kt` 文件：

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi
  
   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       pass_string(/*请修复我*/)
       val useMe = return_string()
       val useMe2 = copy_string(/*请修复我*/)
   }
   ```

2. 使用 IntelliJ IDEA 的[转到声明](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到以下为 C 函数生成的 API：

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

这些声明非常直观。在 Kotlin 中，C `char *` 指针在形参中映射为 `str: CValuesRef<ByteVarOf>?`，在返回值类型中映射为 `CPointer<ByteVarOf>?`。Kotlin 将 `char` 类型表示为 `kotlin.Byte`，因为它通常是一个 8 位有符号值。

在生成的 Kotlin 声明中，`str` 被定义为 `CValuesRef<ByteVarOf<Byte>>?`。由于该类型是可为 null 的，因此您可以传递 `null` 作为实参值。 

## 将 Kotlin 字符串传递给 C

让我们尝试在 Kotlin 中使用该 API。首先调用 `pass_string()` 函数：

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

得益于 `String.cstr` [扩展属性](extensions.md#extension-properties)，将 Kotlin 字符串传递给 C 非常简单。对于涉及 UTF-16 字符的情况，还有 `String.wcstr` 属性。

## 在 Kotlin 中读取 C 字符串

现在从 `return_string()` 函数中获取返回的 `char *` 并将其转换为 Kotlin 字符串：

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

在这里，[`.toKString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/to-k-string.html) 扩展函数将 `return_string()` 函数返回的 C 字符串转换为 Kotlin 字符串。

根据编码的不同，Kotlin 提供了多个用于将 C `char *` 字符串转换为 Kotlin 字符串的扩展函数：

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // UTF-8 字符串的标准函数
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // 显式转换 UTF-8 字符串
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // 转换 UTF-16 编码的字符串
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // 转换 UTF-32 编码的字符串
```

## 从 Kotlin 接收 C 字符串字节

这一次，使用 `copy_string()` C 函数将 C 字符串写入给定的缓冲区。它接受两个实参：指向应写入字符串的内存位置的指针以及允许的缓冲区大小。

该函数还应返回一些内容以指示其成功还是失败。让我们假设 `0` 表示成功，并且提供的缓冲区足够大：

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

这里，首先将一个原生指针传递给 C 函数。[`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 扩展函数会暂时固定字节数组的原生内存地址。C 函数用数据填充字节数组。另一个扩展函数 `ByteArray.decodeToString()` 将字节数组转换为 Kotlin 字符串（假设为 UTF-8 编码）。 

## 更新 Kotlin 代码

既然您已经学会了如何在 Kotlin 代码中使用 C 声明，请尝试在您的项目中使用它们。最终 `hello.kt` 文件中的代码可能如下所示：
 
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

要验证一切是否按预期工作，请[在您的 IDE 中](native-get-started.md#build-and-run-the-application)运行 `runDebugExecutable<YourTargetName>` Gradle 任务，或在终端中使用控制台命令，在本示例中为：

```bash
./gradlew runDebugExecutableMacosArm64
```

## 下一步

在 [与 C 互操作](native-c-interop.md) 文档中了解更多信息，该文档涵盖了更多高级场景。