[//]: # (title: 映射 C 语言中的原生数据类型 – 教程)

<tldr>
    <p>这是 <strong>Kotlin 与 C 映射</strong> 教程系列的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> <strong>映射 C 语言中的原生数据类型</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">映射 C 语言中的结构与联合类型</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">映射 C 语言中的函数指针</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">映射 C 语言中的字符串</a><br/>
    </p>
</tldr>

> C 库导入目前处于 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 阶段。由 cinterop 工具从 C 库生成的所有 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> 随 Kotlin/Native 提供的原生平台库（如 Foundation、UIKit 和 POSIX）仅对部分 API 要求显式启用。
>
{style="note"}

让我们探讨哪些 C 数据类型在 Kotlin/Native 中可见（反之亦然），并研究 Kotlin/Native 和[多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建中与 C 互操作相关的高级用例。

在本教程中，你将：

* [了解 C 语言中的数据类型](#types-in-c-language)
* [创建一个在导出中使用这些类型的 C 库](#create-a-c-library)
* [检查从 C 库生成的 Kotlin API](#inspect-generated-kotlin-apis-for-a-c-library)

你可以使用命令行直接或通过脚本文件（如 `.sh` 或 `.bat` 文件）生成 Kotlin 库。然而，对于拥有数百个文件和库的大型项目，这种方法的扩展性并不理想。使用构建系统可以简化流程，它负责下载并缓存 Kotlin/Native 编译器二进制文件和带有传递依赖项的库，并运行编译器和测试。Kotlin/Native 可以通过 [Kotlin 多平台插件](gradle-configure-project.md#targeting-multiple-platforms)使用 [Gradle](https://gradle.org) 构建系统。

## C 语言中的类型

C 编程语言具有以下[数据类型](https://en.wikipedia.org/wiki/C_data_types)：

* 基本类型：`char, int, float, double` 以及修饰符 `signed, unsigned, short, long`
* 结构、联合、数组
* 指针
* 函数指针

还有一些更具体的类型：

* 布尔类型（源自 [C99](https://en.wikipedia.org/wiki/C99)）
* `size_t` 和 `ptrdiff_t`（还有 `ssize_t`）
* 固定宽度整数类型，例如 `int32_t` 或 `uint64_t`（源自 [C99](https://en.wikipedia.org/wiki/C99)）

C 语言中还有以下类型限定符：`const`、`volatile`、`restrict`、`atomic`。

让我们看看哪些 C 数据类型在 Kotlin 中是可见的。

## 创建 C 库

在本教程中，你不会创建 `lib.c` 源文件，只有在你想编译并运行 C 库时才需要它。对于此设置，你只需要一个用于运行 [cinterop 工具](native-c-interop.md)的 `.h` 头文件。

cinterop 工具会为每组 `.h` 文件生成一个 Kotlin/Native 库（`.klib` 文件）。生成的库有助于桥接从 Kotlin/Native 到 C 的调用。它包含了与 `.h` 文件中的定义相对应的 Kotlin 声明。

要创建一个 C 库：

1. 为你未来的项目创建一个空文件夹。
2. 在其中创建一个 `lib.h` 文件，内容如下，以查看 C 函数是如何映射到 Kotlin 的：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   该文件没有 `extern "C"` 块，在本示例中不需要它，但如果你使用 C++ 和重载函数，则可能需要。有关更多详细信息，请参阅此 [Stackoverflow 线程](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)。

3. 创建 `lib.def` [定义文件](native-definition-file.md)，内容如下：

   ```c
   headers = lib.h
   ```

4. 在 cinterop 工具生成的代码中包含宏或其他 C 定义会很有帮助。通过这种方式，方法体也会被编译并完整包含在二进制文件中。利用此功能，你无需 C 编译器即可创建可运行的示例。

   为此，在 `---` 分隔符之后，将 `lib.h` 文件中 C 函数的实现添加到新的 `interop.def` 文件中：

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def` 文件提供了编译、运行或在 IDE 中打开应用程序所需的一切。

## 创建 Kotlin/Native 项目

> 请参阅 [Kotlin/Native 入门](native-get-started.md#using-gradle)教程，了解详细的初步步骤以及如何创建新 Kotlin/Native 项目并在 IntelliJ IDEA 中打开它的说明。
>
{style="tip"}

创建项目文件：

1. 在你的项目文件夹中，创建一个包含以下内容的 `build.gradle(.kts)` Gradle 构建文件：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple 芯片上的 macOS
        // linuxArm64("native") { // ARM64 平台上的 Linux 
        // linuxX64("native") {   // x86_64 平台上的 Linux
        // mingwX64("native") {   // Windows 上
            val main by compilations.getting
            val interop by main.cinterops.creating
        
            binaries {
                executable()
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.BIN
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple 芯片上的 macOS
        // linuxArm64("native") { // ARM64 平台上的 Linux
        // linuxX64("native") {   // x86_64 平台上的 Linux
        // mingwX64("native") {   // Windows
            compilations.main.cinterops {
                interop 
            }
        
            binaries {
                executable()
            }
        }
    }
    
    wrapper {
        gradleVersion = '%gradleVersion%'
        distributionType = 'BIN'
    }
    ```

    </tab>
    </tabs>

   该项目文件将 C 互操作配置为一个额外的构建步骤。
   查看 [多平台 Gradle DSL 参考](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html)以了解配置它的不同方式。

2. 将你的 `interop.def`、`lib.h` 和 `lib.def` 文件移动到 `src/nativeInterop/cinterop` 目录。
3. 创建一个 `src/nativeMain/kotlin` 目录。这是你应该放置所有源文件的位置，遵循 Gradle 关于使用约定而非配置的建议。

   默认情况下，来自 C 的所有符号都会导入到 `interop` 软件包中。

4. 在 `src/nativeMain/kotlin` 中，创建一个包含以下内容的 `hello.kt` 存根文件：

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")
      
        ints(/* 请修复我 */)
        uints(/* 请修复我 */)
        doubles(/* 请修复我 */)
    }
    ```

稍后当你了解从 Kotlin 侧看 C 原生类型声明是什么样子时，你将完成代码。

## 检查从 C 库生成的 Kotlin API

让我们看看 C 原生类型是如何映射到 Kotlin/Native 的，并相应地更新示例项目。

使用 IntelliJ IDEA 的[转到定义](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到以下为 C 函数生成的 API：

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 类型是直接映射的，但 `char` 类型除外，它被映射到 `kotlin.Byte`，因为它通常是一个 8 位有符号值：

| C                  | Kotlin        |
|--------------------|---------------|
| char               | kotlin.Byte   |
| unsigned char      | kotlin.UByte  |
| short              | kotlin.Short  |
| unsigned short     | kotlin.UShort |
| int                | kotlin.Int    |
| unsigned int       | kotlin.UInt   |
| long long          | kotlin.Long   |
| unsigned long long | kotlin.ULong  |
| float              | kotlin.Float  |
| double             | kotlin.Double |

## 更新 Kotlin 代码

既然你已经看过了 C 定义，现在可以更新你的 Kotlin 代码了。`hello.kt` 文件中的最终代码可能如下所示：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")
  
    ints(1, 2, 3, 4)
    uints(5u, 6u, 7u, 8u)
    doubles(9.0f, 10.0)
}
```

要验证一切是否按预期工作，请[在你的编辑器中](native-get-started.md#build-and-run-the-application)运行 `runDebugExecutableNative` Gradle 任务，或者使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，你将学习结构和联合类型如何在 Kotlin 和 C 之间进行映射：

**[继续下一步](mapping-struct-union-types-from-c.md)**

### 另请参阅

在[与 C 互操作](native-c-interop.md)文档中了解更多信息，该文档涵盖了更高级的场景。