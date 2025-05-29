[//]: # (title: 定义文件)

Kotlin/Native 允许您使用 C 和 Objective-C 库，从而在 Kotlin 中利用它们的功能。
一个名为 `cinterop` 的特殊工具可以处理 C 或 Objective-C 库并生成相应的 Kotlin 绑定，
以便该库的方法可以在您的 Kotlin 代码中正常使用。

为了生成这些绑定，每个库都需要一个定义文件，通常与库同名。
这是一个属性文件，它精确描述了该库应该如何被使用。请参阅[可用属性的完整列表](#properties)。

以下是使用项目时的通用工作流程：

1.  创建一个 `.def` 文件，描述要包含在绑定中的内容。
2.  在您的 Kotlin 代码中使用生成的绑定。
3.  运行 Kotlin/Native 编译器以生成最终的可执行文件。

## 创建并配置定义文件

让我们创建一个定义文件并为一个 C 库生成绑定：

1.  在您的 IDE 中，选择 `src` 文件夹并通过 **File | New | Directory** 创建一个新目录。
2.  将新目录命名为 `nativeInterop/cinterop`。

    这是 `.def` 文件位置的默认约定，但如果您使用不同的位置，可以在 `build.gradle.kts` 文件中覆盖它。
3.  选择新的子文件夹并通过 **File | New | File** 创建一个 `png.def` 文件。
4.  添加必要的属性：

    ```none
    headers = png.h
    headerFilter = png.h
    package = png

    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
    ```

    *   `headers` 是要为其生成 Kotlin 存根的头文件列表。您可以向此条目添加多个文件，每个文件之间用空格分隔。在本例中，它只有 `png.h`。引用的文件需要位于指定路径（在本例中为 `/usr/include/png`）。
    *   `headerFilter` 显示了具体包含哪些内容。在 C 中，当一个文件使用 `#include` 指令引用另一个文件时，所有头文件也会被包含。有时这并非必要，您可以[使用 glob 模式](https://en.wikipedia.org/wiki/Glob_(programming))添加此参数进行调整。

        如果您不想将外部依赖项（例如系统 `stdint.h` 头文件）引入互操作库中，则可以使用 `headerFilter`。此外，它对于库大小优化以及解决系统与所提供的 Kotlin/Native 编译环境之间潜在的冲突也可能有用。

    *   如果需要修改某个特定平台的行为，您可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 等格式为选项提供平台特定值。在本例中，它们是 macOS（`.osx` 后缀）和 Linux（`.linux` 后缀）。不带后缀的参数也可能（例如 `linkerOpts=`）并应用于所有平台。

5.  要生成绑定，请通过点击通知中的 **Sync Now** 同步 Gradle 文件。

    ![Synchronize the Gradle files](gradle-sync.png)

绑定生成后，IDE 可以将其用作本地库的代理视图。

> 您还可以通过在命令行中使用 [cinterop 工具](#generate-bindings-using-command-line)来配置绑定生成。
>
{style="tip"}

## 属性

以下是您可以在定义文件中使用的所有属性的完整列表，用于调整生成二进制文件的内容。
更多信息请参阅下面的相应部分。

| **属性 (Property)**                                                                 | **描述 (Description)**                                                                                                                                                                                                                 |
|:------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | 要包含在绑定中的库的头文件列表。                                                                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | 要包含在绑定中的 Objective-C 库的 Clang 模块列表。                                                                                                                                                                                      |
| `language`                                                                          | 指定语言。默认使用 C；必要时更改为 `Objective-C`。                                                                                                                                                                                      |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | `cinterop` 工具传递给 C 编译器的编译器选项。                                                                                                                                                                                             |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | `cinterop` 工具传递给链接器的链接器选项。                                                                                                                                                                                                |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 应该忽略的函数名称的空格分隔列表。                                                                                                                                                                                                     |
| [`staticLibraries`](#include-a-static-library)                                      | [实验性 (Experimental)](components-stability.md#stability-levels-explained)。将静态库包含到 `.klib` 中。                                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [实验性 (Experimental)](components-stability.md#stability-levels-explained)。`cinterop` 工具搜索要包含在 `.klib` 中的库的目录的空格分隔列表。                                                                                           |
| `packageName`                                                                       | 生成的 Kotlin API 的包前缀。                                                                                                                                                                                                             |
| [`headerFilter`](#filter-headers-by-globs)                                          | 通过 glob 模式过滤头文件，并且只在导入库时包含它们。                                                                                                                                                                                    |
| [`excludeFilter`](#exclude-headers)                                                 | 在导入库时排除特定的头文件，并优先于 `headerFilter`。                                                                                                                                                                                  |
| [`strictEnums`](#configure-enums-generation)                                        | 应生成为 [Kotlin 枚举](enum-classes.md) 的枚举的空格分隔列表。                                                                                                                                                                            |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 应生成为整型值的枚举的空格分隔列表。                                                                                                                                                                                                     |
| [`noStringConversion`](#set-up-string-conversion)                                   | `const char*` 参数不应自动转换为 Kotlin `String` 的函数的空格分隔列表。                                                                                                                                                                 |
| `allowedOverloadsForCFunctions`                                                     | 默认情况下，C 函数被假定具有唯一名称。如果多个函数具有相同的名称，则只选择一个。但是，您可以通过在 `allowedOverloadsForCFunctions` 中指定这些函数来更改此行为。                                                                        |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 禁用不允许将非指定 Objective-C 初始化器作为 `super()` 构造函数调用的编译器检查。                                                                                                                                                      |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | 将 Objective-C 代码中的异常包装成 `ForeignException` 类型的 Kotlin 异常。                                                                                                                                                              |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | 添加自定义消息，例如，帮助用户解决链接器错误。                                                                                                                                                                                       |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

除了属性列表之外，您还可以在定义文件中包含[自定义声明](#add-custom-declarations)。

### 导入头文件

如果一个 C 库没有 Clang 模块，而是由一组头文件组成，请使用 `headers` 属性指定要导入的头文件：

```none
headers = curl/curl.h
```

#### 通过 glob 模式过滤头文件

您可以使用 `.def` 文件中的过滤属性通过 glob 模式过滤头文件。要包含头文件中的声明，请使用 `headerFilter` 属性。如果头文件与任何 glob 模式匹配，其声明将包含在绑定中。

glob 模式应用于相对于适当包含路径元素的头文件路径，
例如，`time.h` 或 `curl/curl.h`。因此，如果库通常使用 `#include <SomeLibrary/Header.h>` 包含，
您可能可以使用以下过滤器过滤头文件：

```none
headerFilter = SomeLibrary/**
```

如果未提供 `headerFilter`，则包含所有头文件。但是，我们鼓励您使用 `headerFilter` 并尽可能精确地指定 glob 模式。在这种情况下，生成的库只包含必要的声明。这有助于避免升级 Kotlin 或开发环境中的工具时出现的各种问题。

#### 排除头文件

要排除特定的头文件，请使用 `excludeFilter` 属性。这有助于删除冗余或有问题的头文件并优化编译，因为来自指定头文件的声明不包含在绑定中：

```none
excludeFilter = SomeLibrary/time.h
```

> 如果同一个头文件同时被 `headerFilter` 包含，又被 `excludeFilter` 排除，则指定的头文件将不会包含在绑定中。
>
{style="note"}

### 导入模块

如果一个 Objective-C 库有一个 Clang 模块，请使用 `modules` 属性指定要导入的模块：

```none
modules = UIKit
```

### 传递编译器和链接器选项

使用 `compilerOpts` 属性将选项传递给 C 编译器，该编译器在底层用于分析头文件。
要将选项传递给用于链接最终可执行文件的链接器，请使用 `linkerOpts`。例如：

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

您还可以指定仅适用于特定目标的特定于目标的选项：

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

通过此配置，头文件在 Linux 上使用 `-DBAR=bar -DFOO=foo1` 分析，在 macOS 上使用 `-DBAR=bar -DFOO=foo2` 分析。请注意，任何定义文件选项都可以同时包含通用部分和平台特定部分。

### 忽略特定函数

使用 `excludedFunctions` 属性指定应忽略的函数名称列表。如果头文件中声明的函数不保证可调用，并且
难以或不可能自动确定，这会很有用。您也可以使用此属性来解决互操作本身中的错误。

### 包含静态库

> 此功能是[实验性的 (Experimental)](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。
> 仅用于评估目的。
>
{style="warning"}

有时，将静态库与您的产品一起发布比假设它在用户环境中可用更方便。要将静态库包含到 `.klib` 中，请使用 `staticLibrary` 和 `libraryPaths` 属性：

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

给定上述代码片段时，`cinterop` 工具会在 `/opt/local/lib` 和 `/usr/local/opt/curl/lib` 中搜索 `libfoo.a`，如果找到，则将库二进制文件包含在 `klib` 中。

在程序中使用这样的 `klib` 时，库会自动链接。

### 配置枚举生成

使用 `strictEnums` 属性将枚举生成为 Kotlin 枚举，或使用 `nonStrictEnums` 将它们生成为整型值。如果枚举未包含在这些列表中的任何一个中，它将根据启发式方法生成。

### 设置字符串转换

使用 `noStringConversion` 属性禁用 `const char*` 函数参数自动转换为 Kotlin `String` 的功能。

### 允许调用非指定初始化器

默认情况下，Kotlin/Native 编译器不允许将非指定的 Objective-C 初始化器作为 `super()` 构造函数调用。如果库中未正确标记指定的 Objective-C 初始化器，此行为可能会带来不便。要禁用这些编译器检查，请使用 `disableDesignatedInitializerChecks` 属性。

### 处理 Objective-C 异常

默认情况下，如果 Objective-C 异常到达 Objective-C 到 Kotlin 互操作边界并进入 Kotlin 代码，程序将崩溃。

要将 Objective-C 异常传播到 Kotlin，请通过 `foreignExceptionMode = objc-wrap` 属性启用包装。
在这种情况下，Objective-C 异常将转换为类型为 `ForeignException` 的 Kotlin 异常。

### 帮助解决链接器错误

当 Kotlin 库依赖于 C 或 Objective-C 库时，可能会发生链接器错误，例如，使用 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)。如果依赖库未在本地机器上安装或未在项目构建脚本中明确配置，则会发生“Framework not found”错误。

如果您是库作者，您可以通过自定义消息帮助用户解决链接器错误。
为此，请在 `.def` 文件中添加 `userSetupHint=message` 属性，或将 `-Xuser-setup-hint` 编译器选项传递给 `cinterop`。

### 添加自定义声明

有时需要将自定义 C 声明添加到库中，然后才能生成绑定（例如，用于[宏](native-c-interop.md#macros)）。
除了创建包含这些声明的额外头文件之外，您还可以将它们直接包含在 `.def` 文件的末尾，
在包含分隔序列 `---` 的分隔行之后：

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

请注意，`.def` 文件的这一部分被视为头文件的一部分，因此带有函数体的函数应声明为 `static`。声明在包含 `headers` 列表中的文件后进行解析。

## 使用命令行生成绑定

除了定义文件之外，您还可以通过在 `cinterop` 调用中将相应属性作为选项传递来指定要包含在绑定中的内容。

以下是生成 `png.klib` 编译库的命令示例：

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

请注意，生成的绑定通常是平台特定的，因此如果您正在为多个目标开发，则需要重新生成绑定。

*   对于不包含在 sysroot 搜索路径中的主机库，可能需要头文件。
*   对于带有配置脚本的典型 UNIX 库，`compilerOpts` 可能包含带有 `--cflags` 选项的配置脚本的输出（可能没有确切的路径）。
*   带有 `--libs` 的配置脚本的输出可以传递给 `linkerOpts` 属性。

## 接下来

*   [C 互操作性绑定](native-c-interop.md#bindings)
*   [与 Swift/Objective-C 的互操作性](native-objc-interop.md)