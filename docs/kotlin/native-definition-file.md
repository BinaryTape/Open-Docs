---
title: 定义文件
---
Kotlin/Native 使你能够使用 C 和 Objective-C 库，从而在 Kotlin 中使用它们的功能。一个名为 cinterop 的特殊工具接受 C 或 Objective-C 库，并生成相应的 Kotlin 绑定 (bindings)，以便该库的方法可以像往常一样在你的 Kotlin 代码中使用。

为了生成这些绑定，每个库都需要一个定义文件（通常与库同名）。这是一个属性文件，用于准确描述应如何使用该库。请参阅[可用属性的完整列表](#properties)。

以下是使用项目时的一般工作流程：

1. 创建一个 `.def` 文件，描述要在绑定中包含的内容。
2. 在你的 Kotlin 代码中使用生成的绑定。
3. 运行 Kotlin/Native 编译器以生成最终的可执行文件。

## 创建和配置定义文件

让我们创建一个定义文件并为 C 库生成绑定：

1. 在你的 IDE 中，选择 `src` 文件夹并使用 **File | New | Directory** 创建一个新目录。
2. 将新目录命名为 `nativeInterop/cinterop`。

   这是 `.def` 文件位置的默认约定，但如果使用不同的位置，可以在 `build.gradle.kts` 文件中覆盖它。
3. 选择新的子文件夹并使用 **File | New | File** 创建一个 `png.def` 文件。
4. 添加必要的属性：

   ```none
   headers = png.h
   headerFilter = png.h
   package = png
   
   compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
   linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
   linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
   ```

   * `headers` 是要为其生成 Kotlin 存根 (stubs) 的头文件列表。你可以将多个文件添加到此条目，用空格分隔每个文件。在这种情况下，它只是 `png.h`。引用的文件需要在指定的路径上可用（在本例中，它是 `/usr/include/png`）。
   * `headerFilter` 显示了具体包含的内容。在 C 中，当一个文件使用 `#include` 指令引用另一个文件时，也会包含所有头文件。有时这是不必要的，你可以添加此参数 [使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming)) 进行调整。

     如果你不想将外部依赖项（例如系统 `stdint.h` 头文件）提取到 interop 库中，则可以使用 `headerFilter`。此外，它对于库大小优化和修复系统与提供的 Kotlin/Native 编译环境之间潜在的冲突可能很有用。

   * 如果需要修改特定平台的行为，你可以使用类似 `compilerOpts.osx` 或 `compilerOpts.linux` 的格式为选项提供平台特定的值。在本例中，它们是 macOS（`.osx` 后缀）和 Linux（`.linux` 后缀）。也可以使用不带后缀的参数（例如，`linkerOpts=`）并将其应用于所有平台。

5. 要生成绑定，请单击通知中的 **Sync Now** 来同步 Gradle 文件。

   <img src="/img/gradle-sync.png" alt="Synchronize the Gradle files" style={{verticalAlign: 'middle'}}/>

绑定生成后，IDE 可以将它们用作本机库的代理视图。

:::note
你还可以通过在命令行中使用 [cinterop 工具](#generate-bindings-using-command-line) 来配置绑定生成。

## 属性

以下是可以在定义文件中使用的属性的完整列表，用于调整生成的二进制文件的内容。有关更多信息，请参见下面的相应部分。

| **Property**                                                                        | **Description**                                                                                                                                                                                                          |
|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | 要包含在绑定中的库中的头文件列表。                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | 要包含在绑定中的 Objective-C 库中的 Clang 模块列表。                                                                                                                                    |
| `language`                                                                          | 指定语言。默认情况下使用 C；如果需要，更改为 `Objective-C`。                                                                                                                                      |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop 工具传递给 C 编译器的编译器选项。                                                                                                                                                        |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop 工具传递给链接器的链接器选项。                                                                                                                                                              |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 应该忽略的函数名称的空格分隔列表。                                                                                                                                                         |                                              
| `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| [`staticLibraries`](#include-a-static-library)                                      | [实验性](components-stability#stability-levels-explained)。将静态库包含到 `.klib` 中。                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [实验性](components-stability#stability-levels-explained)。cinterop 工具在其中搜索要包含在 `.klib` 中的库的目录的空格分隔列表。                                    |
| `packageName`                                                                       | 生成的 Kotlin API 的包前缀。                                                                                                                                                                             |
| [`headerFilter`](#filter-headers-by-globs)                                          | 按 glob 过滤头文件，并且仅在导入库时包含它们。                                                                                                                                                |
| [`excludeFilter`](#exclude-headers)                                                 | 导入库时排除特定的头文件，并优先于 `headerFilter`。                                                                                                                               |
| [`strictEnums`](#configure-enums-generation)                                        | 应该生成为 [Kotlin 枚举](enum-classes) 的枚举的空格分隔列表。                                                                                                                             |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 应该生成为整数值的枚举的空格分隔列表。                                                                                                                                             |
| [`noStringConversion`](#set-up-string-conversion)                                   | 不应自动转换为 Kotlin `String` 的函数的 `const char*` 参数的空格分隔列表。                                                                                                     |
| `allowedOverloadsForCFunctions`                                                     | 默认情况下，假定 C 函数具有唯一的名称。如果多个函数具有相同的名称，则仅选择一个。但是，你可以通过在 `allowedOverloadsForCFunctions` 中指定这些函数来更改此设置。 |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 禁用编译器检查，该检查不允许将非指定的 Objective-C 初始化器作为 `super()` 构造函数调用。                                                                                              |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | 使用 `ForeignException` 类型将 Objective-C 代码中的异常包装到 Kotlin 异常中。                                                                                                                          |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | 添加自定义消息，例如，以帮助用户解决链接器错误。                                                                                                                                                 |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

除了属性列表之外，你还可以在定义文件中包含[自定义声明](#add-custom-declarations)。

### 导入头文件

如果 C 库没有 Clang 模块，而是由一组头文件组成，请使用 `headers` 属性指定应导入的头文件：

```none
headers = curl/curl.h
```

#### 按 glob 过滤头文件

你可以使用 `.def` 文件中的过滤器属性按 glob 过滤头文件。要包含来自头文件的声明，请使用 `headerFilter` 属性。如果头文件与任何 glob 匹配，则其声明将包含在绑定中。

glob 应用于相对于适当的 include 路径元素的头文件路径，例如 `time.h` 或 `curl/curl.h`。因此，如果库通常包含 `#include <SomeLibrary/Header.h>`，则可以使用以下过滤器过滤头文件：

```none
headerFilter = SomeLibrary/**
```

如果未提供 `headerFilter`，则将包含所有头文件。但是，我们建议你使用 `headerFilter` 并尽可能精确地指定 glob。在这种情况下，生成的库仅包含必要的声明。这可以帮助避免在升级 Kotlin 或开发环境中的工具时出现各种问题。

#### 排除头文件

要排除特定的头文件，请使用 `excludeFilter` 属性。这有助于删除冗余或有问题的头文件并优化编译，因为来自指定头文件的声明不包含在绑定中：

```none
excludeFilter = SomeLibrary/time.h
```

如果同一头文件既包含在 `headerFilter` 中，又排除在 `excludeFilter` 中，则指定的头文件将不会包含在绑定中。

:::

### 导入模块

如果 Objective-C 库具有 Clang 模块，请使用 `modules` 属性指定要导入的模块：

```none
modules = UIKit
```

### 传递编译器和链接器选项

使用 `compilerOpts` 属性将选项传递给 C 编译器，该编译器用于在后台分析头文件。要将选项传递给链接器（用于链接最终可执行文件），请使用 `linkerOpts`。例如：

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

你还可以指定仅适用于特定目标的特定于目标的选项：

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

使用此配置，将在 Linux 上使用 `-DBAR=bar -DFOO=foo1` 并在 macOS 上使用 `-DBAR=bar -DFOO=foo2` 分析头文件。请注意，任何定义文件选项都可以同时具有通用部分和平台特定部分。

### 忽略特定函数

使用 `excludedFunctions` 属性指定应忽略的函数名称的列表。如果无法保证头文件中声明的函数可调用，并且难以或无法自动确定这一点，则这可能很有用。你还可以使用此属性来解决 interop 本身中的错误。

### 包含静态库

:::caution
此功能是[实验性](components-stability#stability-levels-explained)的。它可能随时被删除或更改。仅将其用于评估目的。

:::

有时，将静态库与你的产品一起发布比假定它在用户的环境中可用更方便。要将静态库包含到 `.klib` 中，请使用 `staticLibrary` 和 `libraryPaths` 属性：

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

给定上述代码段，cinterop 工具会在 `/opt/local/lib` 和 `/usr/local/opt/curl/lib` 中搜索 `libfoo.a`，如果找到，则将库二进制文件包含在 `klib` 中。

在你的程序中使用像这样的 `klib` 时，该库会自动链接。

### 配置枚举生成

使用 `strictEnums` 属性将枚举生成为 Kotlin 枚举，或使用 `nonStrictEnums` 将它们生成为整数值。如果枚举未包含在这些列表中的任何一个中，则会根据启发式方法生成它。

### 设置字符串转换

使用 `noStringConversion` 属性禁用将 `const char*` 函数参数自动转换为 Kotlin `String`。

### 允许调用非指定的初始化器

默认情况下，Kotlin/Native 编译器不允许将非指定的 Objective-C 初始化器作为 `super()` 构造函数调用。如果指定的 Objective-C 初始化器在库中未正确标记，则此行为可能不方便。要禁用这些编译器检查，请使用 `disableDesignatedInitializerChecks` 属性。

### 处理 Objective-C 异常

默认情况下，如果 Objective-C 异常到达 Objective-C 到 Kotlin 的 interop 边界并到达 Kotlin 代码，程序将崩溃。

要将 Objective-C 异常传播到 Kotlin，请使用 `foreignExceptionMode = objc-wrap` 属性启用包装。在这种情况下，Objective-C 异常将转换为获取 `ForeignException` 类型的 Kotlin 异常。

#### 帮助解决链接器错误

当 Kotlin 库依赖于 C 或 Objective-C 库时，可能会发生链接器错误，例如，使用 [CocoaPods 集成](native-cocoapods)。如果依赖库未在本地计算机上安装或未在项目构建脚本中显式配置，则会发生“Framework not found”错误。

如果你是库作者，你可以使用自定义消息帮助你的用户解决链接器错误。为此，请将 `userSetupHint=message` 属性添加到你的 `.def` 文件，或将 `-Xuser-setup-hint` 编译器选项传递给 `cinterop`。

### 添加自定义声明

有时需要在生成绑定之前向库添加自定义 C 声明（例如，对于 [宏](native-c-interop#macros)）。你可以直接将它们包含到 `.def` 文件的末尾，而不是创建一个包含这些声明的附加头文件，在包含仅包含分隔符序列 `---` 的分隔行之后：

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

请注意，`.def` 文件的这一部分被视为头文件的一部分，因此带有主体的函数应声明为 `static`。在包含 `headers` 列表中的文件之后，将解析声明。

## 使用命令行生成绑定

除了定义文件之外，你还可以通过在 `cinterop` 调用中将相应的属性作为选项传递来指定要在绑定中包含的内容。

以下是生成已编译的 `png.klib` 库的命令示例：

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

请注意，生成的绑定通常是特定于平台的，因此，如果你正在为多个目标开发，则需要重新生成绑定。

* 对于未包含在 sysroot 搜索路径中的主机库，可能需要头文件。
* 对于具有配置脚本的典型 UNIX 库，`compilerOpts` 可能会包含带有 `--cflags` 选项（可能没有精确路径）的配置脚本的输出。
* 带有 `--libs` 的配置脚本的输出可以传递给 `linkerOpts` 属性。

## 接下来做什么

* [C 互操作的绑定](native-c-interop#bindings)
* [与 Swift/Objective-C 的互操作性](native-objc-interop)
```