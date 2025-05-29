[//]: # (title: Kotlin 编译器选项)

每个 Kotlin 版本都包含针对支持目标的编译器：JVM、JavaScript 以及针对[支持平台](native-overview.md#target-platforms)的本机二进制文件。

这些编译器用于：
*   在 IDE 中，当您点击 Kotlin 项目的 **Compile**（编译）或 **Run**（运行）按钮时。
*   Gradle，当您在控制台或 IDE 中调用 `gradle build` 时。
*   Maven，当您在控制台或 IDE 中调用 `mvn compile` 或 `mvn test-compile` 时。

您也可以按照[使用命令行编译器](command-line.md)教程中的描述，从命令行手动运行 Kotlin 编译器。

## 编译器选项

Kotlin 编译器有许多选项可用于定制编译过程。本页列出了针对不同目标的编译器选项及其描述。

设置编译器选项及其值（*编译器参数*）有以下几种方式：
*   在 IntelliJ IDEA 中，在 **Settings/Preferences**（设置/偏好设置）| **Build, Execution, Deployment**（构建、执行、部署）| **Compiler**（编译器）| **Kotlin Compiler**（Kotlin 编译器）中的 **Additional command line parameters**（附加命令行参数）文本框中写入编译器参数。
*   如果您使用 Gradle，请在 Kotlin 编译任务的 `compilerOptions` 属性中指定编译器参数。
    详情请参阅[Gradle 编译器选项](gradle-compiler-options.md#how-to-define-options)。
*   如果您使用 Maven，请在 Maven 插件节点的 `<configuration>` 元素中指定编译器参数。
    详情请参阅[Maven](maven.md#specify-compiler-options)。
*   如果您运行命令行编译器，请直接将编译器参数添加到实用工具调用中，或将其写入 [argfile](#argfile)。

    例如：

    ```bash
    $ kotlinc hello.kt -include-runtime -d hello.jar
    ```

    > 在 Windows 上，当您传递包含分隔符字符（空格、`=`、`;`、`,`）的编译器参数时，请使用双引号（`"`）将这些参数括起来。
    > ```
    > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
    > ```
    {style="note"}

## 常用选项

以下选项是所有 Kotlin 编译器的常用选项。

### -version

显示编译器版本。

### -nowarn

禁止编译器在编译期间显示警告。

### -Werror

将任何警告转变为编译错误。

### -Wextra

启用[额外的声明、表达式和类型编译器检查](whatsnew21.md#extra-compiler-checks)，如果为 true 则发出警告。

### -verbose

启用详细日志输出，其中包含编译过程的详细信息。

### -script

评估 Kotlin 脚本文件。使用此选项调用时，编译器会执行给定参数中第一个 Kotlin 脚本 (`*.kts`) 文件。

### -help (-h)

显示使用信息并退出。仅显示标准选项。
要显示高级选项，请使用 `-X`。

### -X

显示有关高级选项的信息并退出。这些选项目前不稳定：它们的名称和行为可能会在不通知的情况下更改。

### -kotlin-home _path_

指定 Kotlin 编译器的自定义路径，用于发现运行时库。

### -P plugin:pluginId:optionName=value

将选项传递给 Kotlin 编译器插件。
核心插件及其选项列在文档的[核心编译器插件](components-stability.md#core-compiler-plugins)部分。

### -language-version _version_

提供与指定 Kotlin 版本的源代码兼容性。

### -api-version _version_

只允许使用指定 Kotlin 版本的捆绑库中的声明。

### -progressive

为编译器启用[渐进模式](whatsnew13.md#progressive-mode)。

在渐进模式下，对不稳定代码的弃用和错误修复会立即生效，而无需经过优雅的迁移周期。
以渐进模式编写的代码向后兼容；但是，以非渐进模式编写的代码可能会在渐进模式下导致编译错误。

### @argfile

从给定文件中读取编译器选项。此类文件可以包含带有值和源文件路径的编译器选项。选项和路径应以空格分隔。例如：

```
-include-runtime -d hello.jar hello.kt
```

要传递包含空格的值，请用单引号（**'**）或双引号（**"**）将其括起来。如果值中包含引号，请使用反斜杠（**\\**）对其进行转义。
```
-include-runtime -d 'My folder'
```

您还可以传递多个参数文件，例如，将编译器选项与源文件分开。

```bash
$ kotlinc @compiler.options @classes
```

如果文件位于与当前目录不同的位置，请使用相对路径。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

启用需要[显式选择加入](opt-in-requirements.md)的 API 的使用，并带有所给定完全限定名称的需求注解。

### -Xsuppress-warning

[在整个项目中全局](whatsnew21.md#global-warning-suppression)抑制特定警告，例如：

```bash
kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
```

## Kotlin/JVM 编译器选项

Kotlin/JVM 编译器将 Kotlin 源文件编译为 Java 类文件。
用于 Kotlin 到 JVM 编译的命令行工具是 `kotlinc` 和 `kotlinc-jvm`。
您也可以使用它们来执行 Kotlin 脚本文件。

除了[常用选项](#common-options)外，Kotlin/JVM 编译器还具有以下选项。

### -classpath _path_ (-cp _path_)

在指定的路径中搜索类文件。使用系统路径分隔符（Windows 上为 **;**，macOS/Linux 上为 **:**）分隔类路径的元素。
类路径可以包含文件和目录路径、ZIP 或 JAR 文件。

### -d _path_

将生成的类文件放置到指定位置。该位置可以是目录、ZIP 或 JAR 文件。

### -include-runtime

将 Kotlin 运行时包含到生成的 JAR 文件中。使生成的归档文件可在任何启用 Java 的环境中运行。

### -jdk-home _path_

如果与默认的 `JAVA_HOME` 不同，则使用自定义 JDK 主目录将其包含到类路径中。

### -Xjdk-release=version

指定生成的 JVM 字节码的目标版本。将类路径中 JDK 的 API 限制到指定的 Java 版本。
自动设置 [`-jvm-target version`](#jvm-target-version)。
可能的值有 `1.8`、`9`、`10`、...、`21`。

> 此选项[不保证](https://youtrack.jetbrains.com/issue/KT-29974)对每个 JDK 分发都有效。
>
{style="note"}

### -jvm-target _version_

指定生成的 JVM 字节码的目标版本。可能的值有 `1.8`、`9`、`10`、...、`21`。
默认值为 `%defaultJvmTargetVersion%`。

### -java-parameters

为 Java 1.8 方法参数的反射生成元数据。

### -module-name _name_ (JVM)

为生成的 `.kotlin_module` 文件设置自定义名称。

### -no-jdk

不自动将 Java 运行时包含到类路径中。

### -no-reflect

不自动将 Kotlin 反射 (`kotlin-reflect.jar`) 包含到类路径中。

### -no-stdlib (JVM)

不自动将 Kotlin/JVM 标准库 (`kotlin-stdlib.jar`) 和 Kotlin 反射 (`kotlin-reflect.jar`) 包含到类路径中。

### -script-templates _classnames[,]_

脚本定义模板类。使用完全限定类名，并用逗号（**,**）分隔。

## Kotlin/JS 编译器选项

Kotlin/JS 编译器将 Kotlin 源文件编译为 JavaScript 代码。
用于 Kotlin 到 JS 编译的命令行工具是 `kotlinc-js`。

除了[常用选项](#common-options)外，Kotlin/JS 编译器还具有以下选项。

### -target {es5|es2015}

为指定的 ECMA 版本生成 JS 文件。

### -libraries _path_

包含 `.meta.js` 和 `.kjsm` 文件的 Kotlin 库的路径，以系统路径分隔符分隔。

### -main _{call|noCall}_

定义 `main` 函数是否应在执行时被调用。

### -meta-info

生成包含元数据的 `.meta.js` 和 `.kjsm` 文件。创建 JS 库时使用此选项。

### -module-kind {umd|commonjs|amd|plain}

编译器生成的 JS 模块类型：

- `umd` - [通用模块定义](https://github.com/umdjs/umd)模块
- `commonjs` - [CommonJS](http://www.commonjs.org/)模块
- `amd` - [异步模块定义](https://en.wikipedia.org/wiki/Asynchronous_module_definition)模块
- `plain` - 普通 JS 模块

要了解有关不同类型 JS 模块及其区别的更多信息，请参阅[此](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)文章。

### -no-stdlib (JS)

不自动将默认的 Kotlin/JS 标准库包含到编译依赖项中。

### -output _filepath_

设置编译结果的目标文件。该值必须是包含文件名的 `.js` 文件的路径。

### -output-postfix _filepath_

将指定文件的内容添加到输出文件的末尾。

### -output-prefix _filepath_

将指定文件的内容添加到输出文件的开头。

### -source-map

生成源映射。

### -source-map-base-dirs _path_

使用指定路径作为基本目录。基本目录用于计算源映射中的相对路径。

### -source-map-embed-sources _{always|never|inlining}_

将源文件嵌入到源映射中。

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

将您在 Kotlin 代码中声明的变量和函数名称添加到源映射中。

| 设置 | 描述 | 示例输出 |
|---|---|---|
| `simple-names` | 添加变量名和简单的函数名。（默认） | `main` |
| `fully-qualified-names` | 添加变量名和完全限定的函数名。 | `com.example.kjs.playground.main` |
| `no` | 不添加任何变量或函数名。 | 不适用 |

### -source-map-prefix

将指定的`前缀`添加到源映射中的路径。

## Kotlin/Native 编译器选项

Kotlin/Native 编译器将 Kotlin 源文件编译为针对[支持平台](native-overview.md#target-platforms)的本机二进制文件。
Kotlin/Native 编译的命令行工具是 `kotlinc-native`。

除了[常用选项](#common-options)外，Kotlin/Native 编译器还具有以下选项。

### -enable-assertions (-ea)

在生成的代码中启用运行时断言。

### -g

启用发出调试信息。此选项会降低优化级别，不应与 [`-opt`](#opt) 选项结合使用。

### -generate-test-runner (-tr)

为项目生成运行单元测试的应用程序。

### -generate-no-exit-test-runner (-trn)

生成用于运行单元测试而不显式退出进程的应用程序。

### -include-binary _path_ (-ib _path_)

将外部二进制文件打包到生成的 klib 文件中。

### -library _path_ (-l _path_)

链接库。要了解在 Kotlin/Native 项目中使用库的信息，请参阅 [Kotlin/Native 库](native-libraries.md)。

### -library-version _version_ (-lv _version_)

设置库版本。

### -list-targets

列出可用的硬件目标。

### -manifest _path_

提供清单附加文件。

### -module-name _name_ (Native)

指定编译模块的名称。
此选项也可用于为导出到 Objective-C 的声明指定名称前缀：
[如何为我的 Kotlin 框架指定自定义 Objective-C 前缀/名称？](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

包含本机位码库。

### -no-default-libs

禁用用户代码与编译器分发的预构建[平台库](native-platform-libs.md)的链接。

### -nomain

假定 `main` 入口点由外部库提供。

### -nopack

不将库打包到 klib 文件中。

### -linker-option

在二进制构建期间将参数传递给链接器。这可用于链接到某些本机库。

### -linker-options _args_

在二进制构建期间将多个参数传递给链接器。参数之间用空格分隔。

### -nostdlib

不链接标准库 (stdlib)。

### -opt

启用编译优化并生成具有更好运行时性能的二进制文件。不建议将其与降低优化级别的 [`-g`](#g) 选项结合使用。

### -output _name_ (-o _name_)

设置输出文件的名称。

### -entry _name_ (-e _name_)

指定限定入口点名称。

### -produce _output_ (-p _output_)

指定输出文件类型：

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

库搜索路径。有关更多信息，请参阅[库搜索序列](native-libraries.md#library-search-sequence)。

### -target _target_

设置硬件目标。要查看可用目标的列表，请使用 [`-list-targets`](#list-targets) 选项。