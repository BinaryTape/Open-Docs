[//]: # (title: Kotlin/Native 作为动态库 – 教程)

你可以创建动态库，以便在现有程序中使用 Kotlin 代码。这使得代码可以在包括 JVM、Python、Android 等在内的许多平台或语言之间共享。

> 对于 iOS 和其他 Apple 目标平台，我们建议生成框架。请参阅 [Kotlin/Native 作为 Apple 框架](apple-framework.md)教程。
> 
{style="tip"}

你可以从现有的原生应用程序或库中使用 Kotlin/Native 代码。为此，你需要将 Kotlin 代码编译为 `.so`、`.dylib` 或 `.dll` 格式的动态库。

在本教程中，你将：

* [将 Kotlin 代码编译为动态库](#create-a-kotlin-library)
* [检查生成的 C 头文件](#generated-header-file)
* [在 C 中使用 Kotlin 动态库](#use-generated-headers-from-c)
* [编译并运行项目](#compile-and-run-the-project)

你可以直接使用命令行或通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成 Kotlin 库。然而，这种方法对于包含数百个文件和库的大型项目来说扩展性不佳。使用构建系统可以简化流程，它会自动下载并缓存 Kotlin/Native 编译器二进制文件以及带有传递依赖的库，并负责运行编译器和测试。Kotlin/Native 可以通过 [Kotlin Multiplatform 插件](gradle-configure-project.md#targeting-multiple-platforms)使用 [Gradle](https://gradle.org) 构建系统。

让我们深入了解 Kotlin/Native 的高级 C 互操作相关用法，以及使用 Gradle 进行 [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms) 构建。

> 如果你使用 Mac 并且想要为 macOS 或其他 Apple 目标平台创建并运行应用程序，你还需要先安装 [Xcode 命令行工具](https://developer.apple.com/download/)，启动它并接受许可条款。
>
{style="note"}

## 创建 Kotlin 库

Kotlin/Native 编译器可以从 Kotlin 代码生成动态库。动态库通常带有一个 `.h` 头文件，你可以使用它在 C 中调用编译后的代码。

让我们创建一个 Kotlin 库并在 C 程序中使用它。

> 请参阅 [Kotlin/Native 入门](native-get-started.md#using-gradle)教程，了解详细的初步步骤以及如何创建新的 Kotlin/Native 项目并在 IntelliJ IDEA 中将其打开。
>
{style="tip"}

1. 导航到 `src/nativeMain/kotlin` 目录，并创建包含以下库内容的 `lib.kt` 文件：

   ```kotlin
   package example
    
   object Object { 
       val field = "A"
   }
    
   class Clazz {
       fun memberFunction(p: Int): ULong = 42UL
   }
    
   fun forIntegers(b: Byte, s: Short, i: UInt, l: Long) { }
   fun forFloats(f: Float, d: Double) { }
    
   fun strings(str: String) : String? {
       return "That is '$str' from C"
   }
    
   val globalString = "A global String"
   ```

2. 使用以下内容更新你的 `build.gradle(.kts)` Gradle 构建文件：

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
        // macosX64("native") {   // x86_64 平台上的 macOS
        // linuxArm64("native") { // ARM64 平台上的 Linux
        // linuxX64("native") {   // x86_64 平台上的 Linux
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS 和 Linux 
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.ALL
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
        // macosX64("native") {   // x86_64 平台上的 macOS
        // linuxArm64("native") { // ARM64 平台上的 Linux
        // linuxX64("native") {   // x86_64 平台上的 Linux
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS 和 Linux 
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = "ALL"
    }
    ```

    </tab>
    </tabs>

    * `binaries {}` 块将项目配置为生成动态库或共享库。
    * `libnative` 用作库名称，它是生成的头文件名称的前缀。它也是头文件中所有声明的前缀。

3. 在 IDE 中运行 `linkDebugSharedNative` Gradle 任务，或在终端中使用以下控制台命令来构建库：

   ```bash
   ./gradlew linkDebugSharedNative
   ```

该构建会在 `build/bin/native/debugShared` 目录下生成库，其中包含以下文件：

* macOS: `libnative_api.h` 和 `libnative.dylib`
* Linux: `libnative_api.h` 和 `libnative.so`
* Windows: `libnative_api.h`、`libnative.def` 和 `libnative.dll`

> 你还可以使用 `linkNative` Gradle 任务来同时生成库的 `debug` 和 `release` 变体。 
> 
{style="tip"}

Kotlin/Native 编译器使用相同的规则为所有平台生成 `.h` 文件。让我们查看 Kotlin 库的 C API。

## 生成的头文件

让我们检查 Kotlin/Native 声明是如何映射到 C 函数的。

在 `build/bin/native/debugShared` 目录中，打开 `libnative_api.h` 头文件。
最开始的部分包含了标准的 C/C++ 头文件头和尾：

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// 生成的代码的其余部分

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

随后，`libnative_api.h` 包含一个带有通用类型定义的块：

```c
#ifdef __cplusplus
typedef bool            libnative_KBoolean;
#else
typedef _Bool           libnative_KBoolean;
#endif
typedef unsigned short     libnative_KChar;
typedef signed char        libnative_KByte;
typedef short              libnative_KShort;
typedef int                libnative_KInt;
typedef long long          libnative_KLong;
typedef unsigned char      libnative_KUByte;
typedef unsigned short     libnative_KUShort;
typedef unsigned int       libnative_KUInt;
typedef unsigned long long libnative_KULong;
typedef float              libnative_KFloat;
typedef double             libnative_KDouble;
typedef float __attribute__ ((__vector_size__ (16))) libnative_KVector128;
typedef void*              libnative_KNativePtr;
``` 

Kotlin 在创建的 `libnative_api.h` 文件中为所有声明使用 `libnative_` 前缀。以下是完整的类型映射列表：

| Kotlin 定义            | C 类型                                          |
|------------------------|-----------------------------------------------|
| `libnative_KBoolean`   | `bool` 或 `_Bool`                             |
| `libnative_KChar`      | `unsigned short`                              |
| `libnative_KByte`      | `signed char`                                 |
| `libnative_KShort`     | `short`                                       |
| `libnative_KInt`       | `int`                                         |
| `libnative_KLong`      | `long long`                                   |
| `libnative_KUByte`     | `unsigned char`                               |
| `libnative_KUShort`    | `unsigned short`                              |
| `libnative_KUInt`      | `unsigned int`                                |
| `libnative_KULong`     | `unsigned long long`                          |
| `libnative_KFloat`     | `float`                                       |
| `libnative_KDouble`    | `double`                                      |
| `libnative_KVector128` | `float __attribute__ ((__vector_size__ (16))` |
| `libnative_KNativePtr` | `void*`                                       |

`libnative_api.h` 文件的定义部分显示了 Kotlin 基本类型如何映射到 C 基本类型。Kotlin/Native 编译器会自动为每个库生成这些条目。反向映射在[从 C 映射基本数据类型](mapping-primitive-data-types-from-c.md)教程中进行了说明。

在自动生成的类型定义之后，你会发现库中使用的独立类型定义：

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// 自动生成的类型定义

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

在 C 中，`typedef struct { ... } TYPE_NAME` 语法声明了结构。

> 有关此模式的更多说明，请参阅[此 StackOverflow 帖子](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)。
>
{style="tip"}

正如你从这些定义中看到的，Kotlin 类型使用相同的模式映射：`Object` 映射到 `libnative_kref_example_Object`，而 `Clazz` 映射到 `libnative_kref_example_Clazz`。所有结构都只包含带有一个指针的 `pinned` 字段。字段类型 `libnative_KNativePtr` 在文件前面被定义为 `void*`。

由于 C 不支持命名空间，Kotlin/Native 编译器会生成长名称，以避免与现有原生项目中的其他符号发生任何可能的冲突。

### 服务运行时函数

`libnative_ExportedSymbols` 结构定义了 Kotlin/Native 及其库提供的所有函数。它大量使用嵌套匿名结构来模拟软件包。`libnative_` 前缀来自库名称。

`libnative_ExportedSymbols` 在头文件中包含多个辅助函数：

```c
typedef struct {
  /* 服务函数。 */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

这些函数用于处理 Kotlin/Native 对象。调用 `DisposeStablePointer` 用于释放对 Kotlin 对象的引用，调用 `DisposeString` 用于释放 Kotlin 字符串（在 C 中为 `char*` 类型）。

`libnative_api.h` 文件的下一部分由运行时函数的结构声明组成：

```c
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
libnative_kref_kotlin_Byte (*createNullableByte)(libnative_KByte);
libnative_KByte (*getNonNullValueOfByte)(libnative_kref_kotlin_Byte);
libnative_kref_kotlin_Short (*createNullableShort)(libnative_KShort);
libnative_KShort (*getNonNullValueOfShort)(libnative_kref_kotlin_Short);
libnative_kref_kotlin_Int (*createNullableInt)(libnative_KInt);
libnative_KInt (*getNonNullValueOfInt)(libnative_kref_kotlin_Int);
libnative_kref_kotlin_Long (*createNullableLong)(libnative_KLong);
libnative_KLong (*getNonNullValueOfLong)(libnative_kref_kotlin_Long);
libnative_kref_kotlin_Float (*createNullableFloat)(libnative_KFloat);
libnative_KFloat (*getNonNullValueOfFloat)(libnative_kref_kotlin_Float);
libnative_kref_kotlin_Double (*createNullableDouble)(libnative_KDouble);
libnative_KDouble (*getNonNullValueOfDouble)(libnative_kref_kotlin_Double);
libnative_kref_kotlin_Char (*createNullableChar)(libnative_KChar);
libnative_KChar (*getNonNullValueOfChar)(libnative_kref_kotlin_Char);
libnative_kref_kotlin_Boolean (*createNullableBoolean)(libnative_KBoolean);
libnative_KBoolean (*getNonNullValueOfBoolean)(libnative_kref_kotlin_Boolean);
libnative_kref_kotlin_Unit (*createNullableUnit)(void);
libnative_kref_kotlin_UByte (*createNullableUByte)(libnative_KUByte);
libnative_KUByte (*getNonNullValueOfUByte)(libnative_kref_kotlin_UByte);
libnative_kref_kotlin_UShort (*createNullableUShort)(libnative_KUShort);
libnative_KUShort (*getNonNullValueOfUShort)(libnative_kref_kotlin_UShort);
libnative_kref_kotlin_UInt (*createNullableUInt)(libnative_KUInt);
libnative_KUInt (*getNonNullValueOfUInt)(libnative_kref_kotlin_UInt);
libnative_kref_kotlin_ULong (*createNullableULong)(libnative_KULong);
libnative_KULong (*getNonNullValueOfULong)(libnative_kref_kotlin_ULong);
```

你可以使用 `IsInstance` 函数来检查 Kotlin 对象（通过其 `.pinned` 指针引用）是否为某个类型的实例。实际生成的函数集取决于实际用法。

> Kotlin/Native 有自己的垃圾回收，但它不管理从 C 访问的 Kotlin 对象。然而，Kotlin/Native 提供了[与 Swift/Objective-C 的互操作性](native-objc-interop.md)，并且其垃圾回收已[与 Swift/Objective-C ARC 集成](native-arc-integration.md)。
>
{style="tip"}

### 你的库函数

让我们看看库中使用的独立结构声明。`libnative_kref_example` 字段使用 `libnative_kref.` 前缀模拟 Kotlin 代码的软件包结构：

```c
typedef struct {
  /* 用户函数。 */
  struct {
    struct {
      struct {
        struct {
          libnative_KType* (*_type)(void);
          libnative_kref_example_Object (*_instance)();
          const char* (*get_field)(libnative_kref_example_Object thiz);
        } Object;
        struct {
          libnative_KType* (*_type)(void);
          libnative_kref_example_Clazz (*Clazz)();
          libnative_KULong (*memberFunction)(libnative_kref_example_Clazz thiz, libnative_KInt p);
        } Clazz;
        const char* (*get_globalString)();
        void (*forFloats)(libnative_KFloat f, libnative_KDouble d);
        void (*forIntegers)(libnative_KByte b, libnative_KShort s, libnative_KUInt i, libnative_KLong l);
        const char* (*strings)(const char* str);
      } example;
    } root;
  } kotlin;
} libnative_ExportedSymbols;
```

代码使用了匿名结构声明。这里，`struct { ... } foo` 在匿名结构类型的外部结构中声明了一个字段，该匿名结构类型没有名称。

由于 C 也不支持对象，因此使用函数指针来模拟对象语义。函数指针声明为 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`。

`libnative_kref_example_Clazz` 字段代表来自 Kotlin 的 `Clazz`。可以通过 `memberFunction` 字段访问 `libnative_KULong`。唯一的区别是 `memberFunction` 接受 `thiz` 引用作为第一个参数。由于 C 不支持对象，因此显式传递 `thiz` 指针。

`Clazz` 字段（即 `libnative_kref_example_Clazz_Clazz`）中有一个构造函数，它充当创建 `Clazz` 实例的构造函数。

Kotlin 的 `object Object` 可以作为 `libnative_kref_example_Object` 访问。`_instance` 函数用于检索该对象的唯一实例。

属性被转换为函数。`get_` 和 `set_` 前缀分别命名 getter 和 setter 函数。例如，Kotlin 中的只读属性 `globalString` 在 C 中变成了 `get_globalString` 函数。

全局函数 `forFloats`、`forIntegers` 和 `strings` 在 `libnative_kref_example` 匿名结构中被转换为函数指针。

### 入口点

现在你已经了解了 API 是如何创建的，`libnative_ExportedSymbols` 结构的初始化就是起点。接下来让我们看看 `libnative_api.h` 的最后一部分：

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 函数允许你打开从原生代码到 Kotlin/Native 库的门户。这是访问库的入口点。库名称被用作该函数名称的前缀。

> 可能需要为每个线程托管返回的 `libnative_ExportedSymbols*` 指针。
>
{style="note"}

## 在 C 中使用生成的头文件

在 C 中使用生成的头文件非常简单。在库目录中，创建包含以下代码的 `main.c` 文件：

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // 获取调用 Kotlin/Native 函数的引用
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  // 使用 C 和 Kotlin/Native 字符串
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s
out:%s
", str, response);
  lib->DisposeString(response);

  // 创建 Kotlin 对象实例
  libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
  long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld
", x);

  return 0;
}
```

## 编译并运行项目

### 在 macOS 上

要编译 C 代码并将其与动态库链接，请导航至库目录并运行以下命令：

```bash
clang main.c libnative.dylib
```

编译器生成一个名为 `a.out` 的可执行文件。运行它以从 C 库中执行 Kotlin 代码。

### 在 Linux 上

要编译 C 代码并将其与动态库链接，请导航至库目录并运行以下命令：

```bash
gcc main.c libnative.so
```

编译器生成一个名为 `a.out` 的可执行文件。运行它以从 C 库中执行 Kotlin 代码。在 Linux 上，你需要将 `.` 包含到 `LD_LIBRARY_PATH` 中，让应用程序知道从当前文件夹加载 `libnative.so` 库。

### 在 Windows 上

首先，你需要安装支持 x64_64 目标平台的 Microsoft Visual C++ 编译器。

最简单的方法是在 Windows 机器上安装 Microsoft Visual Studio。在安装过程中，选择使用 C++ 所需的组件，例如 **使用 C++ 的桌面开发**。

在 Windows 上，你可以通过生成静态库包装器或手动使用 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) 或类似的 Win32API 函数来包含动态库。

让我们使用第一种方案，并为 `libnative.dll` 生成静态包装库：

1. 从工具链调用 `lib.exe` 来生成静态库包装器 `libnative.lib`，它可以自动处理代码中的 DLL 使用：

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. 将你的 `main.c` 编译为可执行文件。在构建命令中包含生成的 `libnative.lib` 并开始构建：

   ```bash
   cl.exe main.c libnative.lib
   ```

   该命令会生成 `main.exe` 文件，你可以运行它。

## 下一步

* [详细了解与 Swift/Objective-C 的互操作性](native-objc-interop.md)
* [查看 Kotlin/Native 作为 Apple 框架教程](apple-framework.md)