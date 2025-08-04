[//]: # (title: Kotlin/Native 作为动态库 – 教程)

您可以创建动态库，以便在现有程序中使用 Kotlin 代码。这使得代码能够在包括 JVM、Python、Android 等在内的多个平台或语言之间共享。

> 对于 iOS 及其他 Apple 目标平台，我们建议生成 framework。关于 Kotlin/Native 作为 Apple framework 的教程，请参见[Kotlin/Native as an Apple framework](apple-framework.md)。
> 
{style="tip"}

您可以从现有的原生应用程序或库中使用 Kotlin/Native 代码。为此，您需要将 Kotlin 代码编译为 `.so`、`.dylib` 或 `.dll` 格式的动态库。

在本教程中，您将：

* [将 Kotlin 代码编译为动态库](#create-a-kotlin-library)
* [探查生成的 C 头文件](#generated-header-file)
* [在 C 中使用 Kotlin 动态库](#use-generated-headers-from-c)
* [编译并运行项目](#compile-and-run-the-project)

您可以使用命令行直接或通过脚本文件（例如 `.sh` 或 `.bat` 文件）生成 Kotlin 库。然而，对于拥有数百个文件和库的更大项目来说，这种方法的可伸缩性不佳。使用构建系统可以简化流程，它能够下载并缓存 Kotlin/Native 编译器二进制文件和带有传递性依赖项的库，并运行编译器和测试。Kotlin/Native 可以通过 [Kotlin Multiplatform 插件](gradle-configure-project.md#targeting-multiple-platforms)使用 [Gradle](https://gradle.org) 构建系统。

让我们探查 Kotlin/Native 以及带有 Gradle 的 [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms) 构建中与 C 互操作相关的进阶用法。

> 如果您使用 Mac 并希望为 macOS 或其他 Apple 目标平台创建并运行应用程序，您还需要先安装 [Xcode Command Line Tools](https://developer.apple.com/download/)，启动它并接受许可条款。
>
{style="note"}

## 创建 Kotlin 库

Kotlin/Native 编译器可以从 Kotlin 代码生成动态库。动态库通常附带一个 `.h` 头文件，您可以使用它从 C 调用已编译的代码。

让我们创建一个 Kotlin 库，并在 C 程序中使用它。

> 关于如何创建新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开的详细初始步骤和说明，请参见 [Get started with Kotlin/Native](native-get-started.md#using-gradle) 教程。
>
{style="tip"}

1. 导航到 `src/nativeMain/kotlin` 目录，并创建 `lib.kt` 文件，其库内容如下：

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

2. 使用以下内容更新您的 `build.gradle(.kts)` Gradle 构建文件：

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
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS and Linux 
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
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS and Linux 
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

    * `binaries {}` 代码块配置项目以生成动态库或共享库。
    * `libnative` 用作库名称，也是生成的头文件名称的前缀。它还会为头文件中的所有声明添加前缀。

3. 在 IDE 中运行 `linkDebugSharedNative` Gradle 任务，或在终端中使用以下控制台命令构建库：

   ```bash
   ./gradlew linkDebugSharedNative
   ```

构建会将库生成到 `build/bin/native/debugShared` 目录中，并包含以下文件：

* macOS: `libnative_api.h` and `libnative.dylib`
* Linux: `libnative_api.h` and `libnative.so`
* Windows: `libnative_api.h`, `libnative.def`, and `libnative.dll`

> 您也可以使用 `linkNative` Gradle 任务来生成库的 `debug` 和 `release` 变体。
> 
{style="tip"}

Kotlin/Native 编译器使用相同的规则为所有平台生成 `.h` 文件。让我们查看 Kotlin 库的 C API。

## 生成的头文件

让我们探查 Kotlin/Native 声明如何映射到 C 函数。

在 `build/bin/native/debugShared` 目录中，打开 `libnative_api.h` 头文件。文件的最开始部分包含标准的 C/C++ 头和尾：

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// The rest of the generated code

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

紧随其后，`libnative_api.h` 包含一个包含通用类型定义的代码块：

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

Kotlin 在创建的 `libnative_api.h` 文件中，为所有声明使用 `libnative_` 前缀。以下是完整的类型映射列表：

| Kotlin definition      | C type                                        |
|------------------------|-----------------------------------------------|
| `libnative_KBoolean`   | `bool` or `_Bool`                             |
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

`libnative_api.h` 文件的定义部分展示了 Kotlin 原生类型如何映射到 C 原生类型。Kotlin/Native 编译器为每个库自动生成这些条目。反向映射在[从 C 映射原生数据类型](mapping-primitive-data-types-from-c.md)教程中进行了描述。

在自动生成的类型定义之后，您会找到库中使用的单独类型定义：

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// Automatically generated type definitions

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

在 C 中，`typedef struct { ... } TYPE_NAME` 语法声明结构体。

> 关于这种模式的更多解释，请参见 [此 StackOverflow 帖子](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)。
>
{style="tip"}

从这些定义中可以看出，Kotlin 类型使用相同的模式进行映射：`Object` 映射到 `libnative_kref_example_Object`，`Clazz` 映射到 `libnative_kref_example_Clazz`。所有结构体仅包含一个带有指针的 `pinned` 字段。该字段类型 `libnative_KNativePtr` 早在文件中被定义为 `void*`。

由于 C 不支持命名空间，Kotlin/Native 编译器会生成长名称，以避免与现有原生项目中的其他符号可能发生的冲突。

### 服务运行时函数

`libnative_ExportedSymbols` 结构体定义了 Kotlin/Native 和您的库提供的所有函数。它大量使用嵌套匿名结构体来模仿包。`libnative_` 前缀来源于库名称。

`libnative_ExportedSymbols` 在头文件中包含多个辅助函数：

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

这些函数处理 Kotlin/Native 对象。调用 `DisposeStablePointer` 来释放对 Kotlin 对象的引用，调用 `DisposeString` 来释放 Kotlin 字符串（在 C 中其类型为 `char*`）。

`libnative_api.h` 文件的下一部分包含运行时函数的结构体声明：

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
libnative_KUShort (*getNonNullValueOfUShort)(libnative_KUShort);
libnative_kref_kotlin_UInt (*createNullableUInt)(libnative_KUInt);
libnative_KUInt (*getNonNullValueOfUInt)(libnative_KUInt);
libnative_kref_kotlin_ULong (*createNullableULong)(libnative_KULong);
libnative_KULong (*getNonNullValueOfULong)(libnative_kref_kotlin_ULong);
```

您可以使用 `IsInstance` 函数来检测 Kotlin 对象（通过其 `.pinned` 指针引用）是否是某个类型的实例。实际生成的运算集合取决于实际用法。

> Kotlin/Native 拥有自己的垃圾回收器，但它不管理从 C 访问的 Kotlin 对象。然而，Kotlin/Native 提供了与 Swift/Objective-C 的[互操作性](native-objc-interop.md)，并且垃圾回收器已[与 Swift/Objective-C ARC 集成](native-arc-integration.md)。
>
{style="tip"}

### 您的库函数

让我们看看库中使用的单独结构体声明。`libnative_kref_example` 字段带有 `libnative_kref.` 前缀，模仿您的 Kotlin 代码的包结构：

```c
typedef struct {
  /* User functions. */
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

代码使用了匿名结构体声明。此处，`struct { ... } foo` 在匿名结构体类型的外部结构体中声明了一个字段，该匿名结构体没有名称。

由于 C 也不支持对象，因此使用函数指针来模仿对象语义。函数指针声明为 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`。

`libnative_kref_example_Clazz` 字段表示 Kotlin 中的 `Clazz`。`libnative_KULong` 可通过 `memberFunction` 字段访问。唯一的区别是 `memberFunction` 将 `thiz` 引用作为第一个形参。由于 C 不支持对象，因此 `thiz` 指针被显式传递。

`Clazz` 字段中有一个构造函数（亦称 `libnative_kref_example_Clazz_Clazz`），它作为构造函数来创建 `Clazz` 的实例。

属性被转换为函数。`get_` 和 `set_` 前缀分别命名 getter 和 setter 函数。例如，Kotlin 中的只读属性 `globalString` 在 C 中会变为 `get_globalString` 函数。

全局函数 `forFloats`、`forIntegers` 和 `strings` 在 `libnative_kref_example` 匿名结构体中转换为函数指针。

### 入口点

既然您已经了解 API 是如何创建的，那么 `libnative_ExportedSymbols` 结构体的初始化就是起点。接下来让我们看看 `libnative_api.h` 的最后一部分：

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 函数允许您从原生代码打开通往 Kotlin/Native 库的网关。这是访问库的入口点。库名称用作函数名称的前缀。

> 可能需要按线程托管返回的 `libnative_ExportedSymbols*` 指针。
>
{style="note"}

## 在 C 中使用生成的头文件

在 C 中使用生成的头文件非常简单。在库目录中，创建 `main.c` 文件，其代码如下：

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // Obtain reference for calling Kotlin/Native functions
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  // Use C and Kotlin/Native strings
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s
out:%s
", str, response);
  lib->DisposeString(response);

  // Create Kotlin object instance
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

要编译 C 代码并将其与动态库链接，请导航到库目录并运行以下命令：

```bash
clang main.c libnative.dylib
```

编译器会生成一个名为 `a.out` 的可执行文件。运行它以执行 C 库中的 Kotlin 代码。

### 在 Linux 上

要编译 C 代码并将其与动态库链接，请导航到库目录并运行以下命令：

```bash
gcc main.c libnative.so
```

编译器会生成一个名为 `a.out` 的可执行文件。运行它以执行 C 库中的 Kotlin 代码。在 Linux 上，您需要将 `.` 包含到 `LD_LIBRARY_PATH` 中，以便应用程序知道从当前文件夹加载 `libnative.so` 库。

### 在 Windows 上

首先，您需要安装支持 x64_64 目标平台的 Microsoft Visual C++ 编译器。

最简单的方法是在 Windows 机器上安装 Microsoft Visual Studio。安装过程中，请选择必要组件以使用 C++，例如 **Desktop development with C++**。

在 Windows 上，您可以通过生成静态库包装器或使用 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) 或类似的 Win32API 函数手动包含动态库。

让我们使用第一个选项，为 `libnative.dll` 生成静态包装器库：

1. 从工具链调用 `lib.exe` 来生成静态库包装器 `libnative.lib`，它能自动化代码中 DLL 的使用：

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. 将 `main.c` 编译为可执行文件。将生成的 `libnative.lib` 包含到构建命令中并开始：

   ```bash
   cl.exe main.c libnative.lib
   ```

   该命令会生成 `main.exe` 文件，您可以运行它。

## 接下来

* [关于与 Swift/Objective-C 的互操作性，了解更多](native-objc-interop.md)
* [查看 Kotlin/Native 作为 Apple framework 的教程](apple-framework.md)