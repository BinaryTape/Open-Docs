---
title: "C 原始数据类型映射 – 教程"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   这是<strong>Kotlin 和 C 映射</strong>教程系列的第一部分。
</p>
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step"/> <strong>映射 C 中的基本数据类型</strong><br/>
       <img src="/img/icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">映射 C 中的结构体和联合体类型</a><br/>
       <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">映射函数指针</a><br/>
       <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">映射 C 中的字符串</a><br/>
</p>

:::

:::tip
C 库导入是 [Experimental](components-stability#stability-levels-explained) 的。由 `cinterop` 工具从 C 库生成的所有 Kotlin 声明都应该带有 `@ExperimentalForeignApi` 注解。

Kotlin/Native 附带的 Native 平台库（如 Foundation、UIKit 和 POSIX）仅对某些 API 需要选择加入（opt-in）。

让我们探索哪些 C 数据类型在 Kotlin/Native 中可见，反之亦然，并检查 Kotlin/Native 和[多平台](gradle-configure-project#targeting-multiple-platforms) Gradle 构建中与 C 互操作相关的高级用例。

在本教程中，您将：

* [了解 C 语言中的数据类型](#types-in-c-language)
* [创建一个在导出中使用这些类型的 C 库](#create-a-c-library)
* [检查从 C 库生成的 Kotlin API](#inspect-generated-kotlin-apis-for-a-c-library)

您可以使用命令行直接或使用脚本文件（例如 `.sh` 或 `.bat` 文件）生成 Kotlin 库。
但是，这种方法不适用于具有数百个文件和库的大型项目。
使用构建系统可以简化此过程，它会下载并缓存带有传递依赖项的 Kotlin/Native 编译器二进制文件和库，并运行编译器和测试。
Kotlin/Native 可以通过 [Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 构建系统。

## C 语言中的数据类型

C 编程语言具有以下[数据类型](https://en.wikipedia.org/wiki/C_data_types)：

* 基本类型：`char, int, float, double`，带有修饰符 `signed, unsigned, short, long`
* 结构体（Structures）、联合体（Unions）、数组（Arrays）
* 指针（Pointers）
* 函数指针（Function pointers）

还有更多特定的类型：

* 布尔类型（Boolean type）（来自 [C99](https://en.wikipedia.org/wiki/C99)）
* `size_t` 和 `ptrdiff_t` (还有 `ssize_t`)
* 固定宽度整数类型，例如 `int32_t` 或 `uint64_t`（来自 [C99](https://en.wikipedia.org/wiki/C99)）

C 语言中还有以下类型限定符：`const`、`volatile`、`restrict`、`atomic`。

让我们看看哪些 C 数据类型在 Kotlin 中可见。

## 创建一个 C 库

在本教程中，您无需创建 `lib.c` 源文件，只有在您想要编译和运行 C 库时才需要它。对于此设置，您只需要一个 `.h` 头文件，这是运行 [cinterop tool](native-c-interop) 所必需的。

对于每组 `.h` 文件，cinterop 工具都会生成一个 Kotlin/Native 库（一个 `.klib` 文件）。生成的库有助于桥接从 Kotlin/Native 到 C 的调用。它包括与 `.h` 文件中的定义相对应的 Kotlin 声明。

要创建一个 C 库：

1. 为您的未来项目创建一个空文件夹。
2. 在其中创建一个 `lib.h` 文件，其中包含以下内容，以了解 C 函数如何映射到 Kotlin：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   该文件没有 `extern "C"` 块，此示例不需要该块，但如果您使用 C++ 和重载函数，则可能需要该块。有关更多详细信息，请参见此 [Stackoverflow thread](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)。

3. 创建带有以下内容的 `lib.def` [定义文件](native-definition-file)：

   ```c
   headers = lib.h
   ```

4. 在 cinterop 工具生成的代码中包含宏或其他 C 定义可能会很有帮助。这样，方法体也会被编译并完全包含在二进制文件中。使用此功能，您可以创建一个可运行的示例，而无需 C 编译器。

   为此，将 `lib.h` 文件中 C 函数的实现添加到 `---` 分隔符后的新 `interop.def` 文件中：

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def` 文件提供了编译、运行或在 IDE 中打开应用程序所需的一切。

## 创建一个 Kotlin/Native 项目

有关详细的初始步骤以及如何创建新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开它的说明，请参见 [Get started with Kotlin/Native](native-get-started#using-gradle) 教程。

:::

要创建项目文件：

1. 在您的项目文件夹中，创建一个包含以下内容的 `build.gradle(.kts)` Gradle 构建文件：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
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
        gradleVersion = "8.10"
        distributionType = Wrapper.DistributionType.BIN
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
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
        gradleVersion = '8.10'
        distributionType = 'BIN'
    }
    ```

    </TabItem>
    </Tabs>

   项目文件将 C 互操作配置为附加的构建步骤。
   查看 [Multiplatform Gradle DSL reference](multiplatform-dsl-reference) 以了解配置它的不同方法。

2. 将您的 `interop.def`、`lib.h` 和 `lib.def` 文件移动到 `src/nativeInterop/cinterop` 目录。
3. 创建一个 `src/nativeMain/kotlin` 目录。这是您应该放置所有源文件的地方，遵循 Gradle 关于使用约定而不是配置的建议。

   默认情况下，C 中的所有符号都导入到 `interop` 包中。

4. 在 `src/nativeMain/kotlin` 中，创建一个包含以下内容的 `hello.kt` 存根文件：

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

稍后，当您了解 C 原始类型声明在 Kotlin 端的表示形式时，您将完成代码。

## 检查为 C 库生成的 Kotlin API

让我们看看 C 原始类型如何映射到 Kotlin/Native，并相应地更新示例项目。

使用 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 导航到以下为 C 函数生成的 API：

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 类型是直接映射的，除了 `char` 类型，它映射到 `kotlin.Byte`，因为它通常是一个 8 位有符号值：

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

既然您已经看到了 C 定义，就可以更新您的 Kotlin 代码了。`hello.kt` 文件中的最终代码可能如下所示：

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

要验证一切是否按预期工作，请[在您的 IDE 中](native-get-started#build-and-run-the-application)运行 `runDebugExecutableNative` Gradle 任务，或使用以下命令运行代码：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您将学习结构体（struct）和联合体（union）类型如何在 Kotlin 和 C 之间映射：

**[进入下一部分](mapping-struct-union-types-from-c)**

### 参见

在 [Interoperability with C](native-c-interop) 文档中了解更多信息，该文档涵盖了更高级的方案。