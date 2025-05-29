[//]: # (title: Kotlin/Native 作为动态库 – 教程)

你可以创建动态库，以便在现有程序中使用 Kotlin 代码。这使得代码可以在 JVM、Python、Android 等多种平台或语言之间共享。

> 对于 iOS 及其他 Apple 目标平台，我们建议生成框架。请参阅 [Kotlin/Native 作为 Apple 框架](apple-framework.md) 教程。
> 
{style="tip"}

你可以从现有的原生应用程序或库中使用 Kotlin/Native 代码。为此，你需要将 Kotlin 代码编译为 `.so`、`.dylib` 或 `.dll` 格式的动态库。

在本教程中，你将：

* [将 Kotlin 代码编译为动态库](#create-a-kotlin-library)
* [检查生成的 C 头文件](#generated-header-file)
* [从 C 中使用 Kotlin 动态库](#use-generated-headers-from-c)
* [编译并运行项目](#compile-and-run-the-project)

你可以使用命令行生成 Kotlin 库，无论是直接操作还是通过脚本文件（例如 `.sh` 或 `.bat` 文件）。然而，对于包含数百个文件和库的大型项目，这种方法扩展性不佳。使用构建系统可以通过下载和缓存 Kotlin/Native 编译器二进制文件及带有传递依赖的库，并运行编译器和测试来简化该过程。Kotlin/Native 可以通过 [Kotlin 多平台插件](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 构建系统。

让我们探讨 Kotlin/Native 的高级 C 互操作相关用法以及使用 Gradle 进行 [Kotlin 多平台](gradle-configure-project.md#targeting-multiple-platforms) 构建。

> 如果你使用 Mac 并且希望为 macOS 或其他 Apple 目标平台创建和运行应用程序，你还需要先安装 [Xcode 命令行工具](https://developer.apple.com/download/)，启动它并接受许可条款。
>
{style="note"}

## 创建 Kotlin 库

Kotlin/Native 编译器可以从 Kotlin 代码生成动态库。动态库通常附带一个 `.h` 头文件，你可以在 C 中使用它来调用编译后的代码。

让我们创建一个 Kotlin 库并在 C 程序中使用它。

> 有关详细的初始步骤以及如何创建新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开的说明，请参阅 [Kotlin/Native 入门](native-get-started.md#using-gradle) 教程。
>
{style="tip"}

1. 导航到 `src/nativeMain/kotlin` 目录并创建 `lib.kt` 文件，其库内容如下：

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

    * `binaries {}` 块配置项目以生成动态或共享库。
    * `libnative` 用作库名称，即生成的头文件名的前缀。它还作为头文件中所有声明的前缀。

3. 在 IDE 中运行 `linkDebugSharedNative` Gradle 任务，或在终端中使用以下控制台命令构建库：

   ```bash
   ./gradlew linkDebugSharedNative
   ```

构建会将库生成到 `build/bin/native/debugShared` 目录中，并包含以下文件：

* macOS: `libnative_api.h` 和 `libnative.dylib`
* Linux: `libnative_api.h` 和 `libnative.so`
* Windows: `libnative_api.h`、`libnative.def` 和 `libnative.dll`

> 你也可以使用 `linkNative` Gradle 任务来生成库的 `debug` 和 `release` 两种变体。
> 
{style="tip"}

Kotlin/Native 编译器使用相同的规则为所有平台生成 `.h` 文件。让我们查看 Kotlin 库的 C API。

## 生成的头文件

让我们检查 Kotlin/Native 声明如何映射到 C 函数。

在 `build/bin/native/debugShared` 目录中，打开 `libnative_api.h` 头文件。
最开始的部分包含标准 C/C++ 头和尾：

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

在此之后，`libnative_api.h` 包含一个带有通用类型定义的块：

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

Kotlin 对在 `libnative_api.h` 文件中创建的所有声明都使用了 `libnative_` 前缀。以下是类型映射的完整列表：

| Kotlin 定义          | C 类型                                        |
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

`libnative_api.h` 文件的定义部分展示了 Kotlin 基本类型如何映射到 C 基本类型。Kotlin/Native 编译器会自动为每个库生成这些条目。反向映射在 [从 C 映射基本数据类型](mapping-primitive-data-types-from-c.md) 教程中描述。

在自动生成的类型定义之后，你会找到库中使用的单独类型定义：

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

在 C 语言中，`typedef struct { ... } TYPE_NAME` 语法声明了结构体。

> 有关此模式的更多解释，请参阅 [此 StackOverflow 帖子](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)。
>
{style="tip"}

从这些定义中可以看出，Kotlin 类型使用相同的模式进行映射：`Object` 映射到 `libnative_kref_example_Object`，`Clazz` 映射到 `libnative_kref_example_Clazz`。所有结构体仅包含一个带有指针的 `pinned` 字段。字段类型 `libnative_KNativePtr` 在文件前面被定义为 `void*`。

由于 C 不支持命名空间，Kotlin/Native 编译器会生成长名称以避免与现有原生项目中的其他符号发生任何可能的冲突。

### 服务运行时函数

`libnative_ExportedSymbols` 结构体定义了 Kotlin/Native 和你的库提供的所有函数。它大量使用嵌套匿名结构来模拟包。`libnative_` 前缀来自库名称。

`libnative_ExportedSymbols` 在头文件中包含几个辅助函数：

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

这些函数处理 Kotlin/Native 对象。`DisposeStablePointer` 用于释放对 Kotlin 对象的引用，而 `DisposeString` 用于释放 Kotlin 字符串，该字符串在 C 中具有 `char*` 类型。

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

你可以使用 `IsInstance` 函数来检查 Kotlin 对象（通过其 `.pinned` 指针引用）是否是某个类型的实例。实际生成的操作集取决于实际用法。

> Kotlin/Native 有自己的垃圾回收器，但它不管理从 C 访问的 Kotlin 对象。然而，Kotlin/Native 提供了 [与 Swift/Objective-C 的互操作性](native-objc-interop.md)，并且垃圾回收器已 [与 Swift/Objective-C ARC 集成](native-arc-integration.md)。
>
{style="tip"}

### 你的库函数

让我们看看你的库中使用的单独结构声明。`libnative_kref_example` 字段通过 `libnative_kref.` 前缀模拟了你的 Kotlin 代码的包结构：

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

代码使用了匿名结构声明。在这里，`struct { ... } foo` 声明了外部结构体中一个匿名结构体类型的字段，该字段没有名称。

由于 C 也不支持对象，因此使用函数指针来模拟对象语义。函数指针声明为 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`。

`libnative_kref_example_Clazz` 字段表示 Kotlin 中的 `Clazz`。`libnative_KULong` 可通过 `memberFunction` 字段访问。唯一的区别是 `memberFunction` 接受 `thiz` 引用作为第一个参数。由于 C 不支持对象，因此显式传递了 `thiz` 指针。

`Clazz` 字段中有一个构造函数（即 `libnative_kref_example_Clazz_Clazz`），它充当创建 `Clazz` 实例的构造函数。

Kotlin `object Object` 可作为 `libnative_kref_example_Object` 访问。`_instance` 函数检索该对象的唯一实例。

属性被转换为函数。`get_` 和 `set_` 前缀分别命名 getter 和 setter 函数。例如，Kotlin 中的只读属性 `globalString` 在 C 中被转换为 `get_globalString` 函数。

全局函数 `forFloats`、`forIntegers` 和 `strings` 在 `libnative_kref_example` 匿名结构体中被转换为函数指针。

### 入口点

现在你已经了解了 API 是如何创建的，`libnative_ExportedSymbols` 结构体的初始化就是起点。
接下来让我们看一下 `libnative_api.h` 的最后一部分：

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 函数允许你打开从原生代码到 Kotlin/Native 库的网关。这是访问库的入口点。库名称用作函数名的前缀。

> 可能需要按线程托管返回的 `libnative_ExportedSymbols*` 指针。
>
{style="note"}

## 在 C 中使用生成的头文件

从 C 中使用生成的头文件非常简单。在库目录中，创建 `main.c` 文件，其中包含以下代码：

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

编译器会生成一个名为 `a.out` 的可执行文件。运行它以从 C 库执行 Kotlin 代码。

### 在 Linux 上

要编译 C 代码并将其与动态库链接，请导航到库目录并运行以下命令：

```bash
gcc main.c libnative.so
```

编译器会生成一个名为 `a.out` 的可执行文件。在 Linux 上，你需要将 `.` 添加到 `LD_LIBRARY_PATH` 中，以让应用程序知道从当前文件夹加载 `libnative.so` 库。

### 在 Windows 上

首先，你需要安装支持 x64_64 目标的 Microsoft Visual C++ 编译器。

最简单的方法是在 Windows 机器上安装 Microsoft Visual Studio。安装期间，选择使用 C++ 所需的组件，例如 **使用 C++ 的桌面开发**。

在 Windows 上，你可以通过生成静态库包装器或手动使用 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) 或类似的 Win32API 函数来包含动态库。

让我们使用第一种方案，为 `libnative.dll` 生成静态包装库：

1. 从工具链调用 `lib.exe` 来生成静态库包装器 `libnative.lib`，它会自动实现代码中的 DLL 使用：

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. 将你的 `main.c` 编译成可执行文件。将生成的 `libnative.lib` 包含到构建命令中并开始：

   ```bash
   cl.exe main.c libnative.lib
   ```

   该命令会生成 `main.exe` 文件，你可以运行它。

## 接下来

* [了解更多关于与 Swift/Objective-C 的互操作性](native-objc-interop.md)
* [查看 Kotlin/Native 作为 Apple 框架教程](apple-framework.md)