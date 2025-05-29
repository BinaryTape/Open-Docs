[//]: # (title: 映射 C 语言的原始数据类型 – 教程)

<tldr>
    <p>这是 **Kotlin 和 C 映射** 教程系列的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>映射 C 语言的原始数据类型</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">映射 C 语言的结构体和联合体类型</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">映射函数指针</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">映射 C 语言的字符串</a><br/>
    </p>
</tldr>

> C 库导入是 [实验性的](components-stability.md#stability-levels-explained)。所有由 cinterop 工具从 C 库生成的 Kotlin 声明都应带有 `@ExperimentalForeignApi` 注解。
>
> Kotlin/Native 附带的原生平台库（如 Foundation、UIKit 和 POSIX）仅部分 API 需要选择启用 (opt-in)。
>
{style="warning"}

让我们探究哪些 C 数据类型在 Kotlin/Native 中可见，反之亦然，并检查 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建中与 C 互操作相关的进阶用例。

在本教程中，你将：

* [了解 C 语言中的数据类型](#types-in-c-language)
* [创建一个在导出中使用这些类型的 C 库](#create-a-c-library)
* [检查从 C 库生成的 Kotlin API](#inspect-generated-kotlin-apis-for-a-c-library)

你可以使用命令行直接或通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成 Kotlin 库。然而，对于拥有数百个文件和库的大型项目，这种方法的可伸缩性不佳。使用构建系统可以简化该过程，它能够下载并缓存 Kotlin/Native 编译器二进制文件和带有传递性依赖的库，并运行编译器和测试。Kotlin/Native 可以通过 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 构建系统。

## C 语言中的类型

C 编程语言具有以下 [数据类型](https://en.wikipedia.org/wiki/C_data_types)：

* 基本类型：`char, int, float, double`，带有修饰符 `signed, unsigned, short, long`
* 结构体 (Structures)、联合体 (unions)、数组 (arrays)
* 指针 (Pointers)
* 函数指针 (Function pointers)

还有更具体的类型：

* 布尔类型（来自 [C99](https://en.wikipedia.org/wiki/C99)）
* `size_t` 和 `ptrdiff_t`（还有 `ssize_t`）
* 固定宽度整数类型，例如 `int32_t` 或 `uint64_t`（来自 [C99](https://en.wikipedia.org/wiki/C99)）

C 语言中还有以下类型限定符：`const`、`volatile`、`restrict`、`atomic`。

让我们看看哪些 C 数据类型在 Kotlin 中是可见的。

## 创建 C 库

在本教程中，你无需创建 `lib.c` 源文件，它仅在你想要编译并运行 C 库时才需要。对于此设置，你只需要一个 `.h` 头文件，它是运行 [cinterop 工具](native-c-interop.md) 所必需的。

cinterop 工具为每组 `.h` 文件生成一个 Kotlin/Native 库（一个 `.klib` 文件）。生成的库有助于将调用从 Kotlin/Native 桥接到 C。它包含与 `.h` 文件中定义相对应的 Kotlin 声明。

要创建 C 库：

1. 为你未来的项目创建一个空文件夹。
2. 在其中创建一个 `lib.h` 文件，内容如下，以查看 C 函数如何映射到 Kotlin：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   该文件没有 `extern "C"` 块，对于本例而言它不是必需的，但如果你使用 C++ 和重载函数，则可能需要它。有关更多详细信息，请参阅此 [Stackoverflow 帖子](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)。

3. 创建 `lib.def` [定义文件](native-definition-file.md)，内容如下：

   ```c
   headers = lib.h
   ```

4. 将宏或其他 C 定义包含在由 cinterop 工具生成的代码中会很有帮助。这样，方法体也会被编译并完整包含在二进制文件中。通过此功能，你可以创建一个可运行的示例，而无需 C 编译器。

   为此，在 `---` 分隔符后，将 `lib.h` 文件中的 C 函数的实现添加到新的 `interop.def` 文件中：

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def` 文件提供了编译、运行或在 IDE 中打开应用程序所需的一切。

## 创建 Kotlin/Native 项目

> 有关详细的第一步以及如何创建新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开的说明，请参阅 [Kotlin/Native 入门](native-get-started.md#using-gradle) 教程。
>
{style="tip"}

要创建项目文件：

1. 在你的项目文件夹中，创建一个 `build.gradle(.kts)` Gradle 构建文件，内容如下：

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
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms 
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // on Windows
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
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
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

   该项目文件将 C 互操作配置为额外的构建步骤。
   查阅 [多平台 Gradle DSL 参考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 以了解配置它的不同方式。

2. 将 `interop.def`、`lib.h` 和 `lib.def` 文件移动到 `src/nativeInterop/cinterop` 目录。
3. 创建 `src/nativeMain/kotlin` 目录。根据 Gradle 关于使用约定而非配置的建议，你应将所有源文件放置在此处。

   默认情况下，所有 C 符号都导入到 `interop` 包中。

4. 在 `src/nativeMain/kotlin` 中，创建一个 `hello.kt` 存根 (stub) 文件，内容如下：

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")
      
        ints(/* fix me*/)
        uints(/* fix me*/)
        doubles(/* fix me*/)
    }
    ```

你稍后将在了解 C 原始类型声明在 Kotlin 侧如何显示后，完成代码。

## 检查 C 库生成的 Kotlin API

让我们看看 C 原始类型如何映射到 Kotlin/Native，并相应地更新示例项目。

使用 IntelliJ IDEA 的 [跳转到声明](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）导航到 C 函数的以下生成的 API：

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 类型被直接映射，除了 `char` 类型被映射为 `kotlin.Byte`，因为它通常是一个 8 位有符号值：

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

既然你已经看到了 C 定义，你就可以更新你的 Kotlin 代码了。`hello.kt` 文件中的最终代码可能如下所示：

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

要验证一切是否按预期工作，请在 [IDE 中](native-get-started.md#build-and-run-the-application) 运行 `runDebugExecutableNative` Gradle 任务，或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，你将学习结构体 (struct) 和联合体 (union) 类型如何在 Kotlin 和 C 之间映射：

**[继续到下一部分](mapping-struct-union-types-from-c.md)**

### 另请参阅

在 [与 C 的互操作性](native-c-interop.md) 文档中了解更多高级场景。