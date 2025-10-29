[//]: # (title: Kotlin 编译器选项)

每个 Kotlin 发布版本都包含适用于所支持目标的编译器：JVM、JavaScript 以及适用于[支持平台](native-overview.md#target-platforms)的原生二进制文件。

这些编译器由以下工具使用：
* IDE，当您为 Kotlin 项目点击“__编译__”或“__运行__”按钮时。
* Gradle，当您在控制台或 IDE 中调用 `gradle build` 时。
* Maven，当您在控制台或 IDE 中调用 `mvn compile` 或 `mvn test-compile` 时。

您也可以按照[使用命令行编译器](command-line.md)教程中的说明，从命令行手动运行 Kotlin 编译器。

## 编译器选项

Kotlin 编译器提供了诸多选项，用于定制编译过程。针对不同目标的编译器选项及其描述都列在本页中。

有几种方式可以设置编译器选项及其值（_编译器实参_）：
* 在 IntelliJ IDEA 中，将编译器实参写入“**附加命令行参数**”文本框内，该文本框位于“**设置/偏好设置** | **构建、执行、部署** | **编译器** | **Kotlin 编译器**”中。
* 如果您正在使用 Gradle，请在 Kotlin 编译任务的 `compilerOptions` 属性中指定编译器实参。关于详情，请参见[Gradle 编译器选项](gradle-compiler-options.md#how-to-define-options)。
* 如果您正在使用 Maven，请在 Maven 插件节点的 `<configuration>` 元素中指定编译器实参。关于详情，请参见[Maven](maven.md#specify-compiler-options)。
* 如果您运行命令行编译器，请将编译器实参直接添加到实用工具调用中，或者将它们写入一个 [argfile](#argfile) 中。

  例如：

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > 在 Windows 上，当您传递包含分隔符（空白字符、`=`、`;`、`,`）的编译器实参时，请用双引号 (`"`) 将这些实参括起来。
  > ```
  > $ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  > ```
  {style="note"}

## 编译器选项的架构

所有编译器选项的通用架构发布在 [`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description) 下，作为 JAR artifact。该 artifact 包含所有编译器选项描述的代码表示和 JSON 等效表示（供非 Kotlin 消费者使用），以及每个选项引入或稳定时的版本等元数据。

## 通用选项

以下选项适用于所有 Kotlin 编译器。

### -version

显示编译器版本。

### -verbose

启用详细日志输出，其中包含编译过程的详细信息。

### -script

求值一个 Kotlin 脚本文件。当使用此选项调用时，编译器会执行给定实参中的第一个 Kotlin 脚本 (`*.kts`) 文件。

### -help (-h)

显示用法信息并退出。仅显示标准选项。要显示高级选项，请使用 `-X`。

### -X

<primary-label ref="experimental-general"/>

显示有关高级选项的信息并退出。这些选项目前不稳定：其名称和行为可能会在不另行通知的情况下更改。

### -kotlin-home _path_

指定 Kotlin 编译器的自定义路径，用于发现运行时库。
  
### -P plugin:pluginId:optionName=value

将选项传递给 Kotlin 编译器插件。核心插件及其选项列在文档的[核心编译器插件](components-stability.md#core-compiler-plugins)章节中。
  
### -language-version _version_

提供与指定 Kotlin 版本的源码兼容性。

### -api-version _version_

只允许使用来自指定 Kotlin 捆绑库版本的声明。

### -progressive

为编译器启用[渐进模式](whatsnew13.md#progressive-mode)。

在渐进模式下，不稳定代码的弃用和错误修复会立即生效，而无需经过一个优雅的迁移周期。以渐进模式编写的代码向后兼容；然而，以非渐进模式编写的代码可能会在渐进模式下导致编译错误。

### @argfile

从给定文件中读取编译器选项。此类文件可以包含带有值和源文件路径的编译器选项。选项和路径应以空白字符分隔。例如：

```
-include-runtime -d hello.jar hello.kt
```

要传递包含空白字符的值，请用单引号（**'**）或双引号（**"**）将其括起来。如果值中包含引号，请用反斜杠（**\\**）转义它们。
```
-include-runtime -d 'My folder'
```

您也可以传递多个实参文件，例如，将编译器选项与源文件分开。

```bash
$ kotlinc @compiler.options @classes
```

如果文件位于与当前目录不同的位置，请使用相对路径。

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

启用对需要 [opt-in](opt-in-requirements.md) 的 API 的使用，并使用给定全限定名的要求注解。

### -Xrepl

<primary-label ref="experimental-general"/>

激活 Kotlin REPL。

```bash
kotlinc -Xrepl
```

### -Xannotation-target-all

<primary-label ref="experimental-general"/>

启用实验性的[`all` 注解使用点目标](annotations.md#all-meta-target)：

```bash
kotlinc -Xannotation-target-all
```

### -Xannotation-default-target=param-property

<primary-label ref="experimental-general"/>

启用新的实验性[注解使用点目标的默认规则](annotations.md#defaults-when-no-use-site-targets-are-specified)：

```bash
kotlinc -Xannotation-default-target=param-property
```

### 警告管理

#### -nowarn

在编译期间抑制所有警告。

#### -Werror

将所有警告视为编译错误。

#### -Wextra

启用[额外的声明、表达式和类型编译器检测](whatsnew21.md#extra-compiler-checks)，如果为 true 则会发出警告。

#### -Xrender-internal-diagnostic-names
<primary-label ref="experimental-general"/>

打印内部诊断名称伴随警告。这有助于识别为 `-Xwarning-level` 选项配置的 `DIAGNOSTIC_NAME`。

#### -Xwarning-level
<primary-label ref="experimental-general"/>

配置特定编译器警告的严重级别：

```bash
kotlinc -Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`：仅将指定警告提升为错误。
* `warning`：为指定诊断发出警告，并默认启用。
* `disabled`：仅抑制指定警告在模块范围内的显示。

您可以通过将模块范围内的规则与特定规则结合来调整项目中的警告报告：

| 命令 | 描述 |
|---|---|
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制除指定警告外的所有警告。 |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 将除指定警告外的所有警告提升为错误。 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 启用除指定检测外的所有额外检测。 |

如果您有许多警告需要从通用规则中排除，可以使用 [`@argfile`](#argfile) 将它们列在单独的文件中。

您可以使用 [`-Xrender-internal-diagnostic-names`](#xrender-internal-diagnostic-names) 来发现 `DIAGNOSTIC_NAME`。

### -Xdata-flow-based-exhaustiveness
<primary-label ref="experimental-general"/>

启用基于数据流的 `when` 表达式穷尽性检测。

### -Xallow-reified-type-in-catch
<primary-label ref="experimental-general"/>

启用对 `inline` 函数的 `catch` 子句中使用具象化 `Throwable` 类型形参的支持。

### Kotlin 契约选项
<primary-label ref="experimental-general"/>

以下选项启用实验性的 Kotlin 契约特性。

#### -Xallow-contracts-on-more-functions

在额外的声明中启用契约，包括属性访问器、特定的操作符函数和泛型类型的类型断言。

#### -Xallow-condition-implies-returns-contracts

允许在契约中使用 `returnsNotNull()` 函数，以假定指定条件下的非空返回值。

#### -Xallow-holdsin-contract

允许在契约中使用 `holdsIn` 关键字，以假定 lambda 内部的布尔条件为 `true`。

## Kotlin/JVM 编译器选项

用于 JVM 的 Kotlin 编译器将 Kotlin 源文件编译成 Java 类文件。Kotlin 到 JVM 编译的命令行工具是 `kotlinc` 和 `kotlinc-jvm`。您也可以使用它们来执行 Kotlin 脚本文件。

除了[通用选项](#common-options)外，Kotlin/JVM 编译器还具有以下列出的选项。

### -classpath _path_ (-cp _path_)

在指定路径中搜索类文件。使用系统路径分隔符（Windows 上为 **;**，macOS/Linux 上为 **:**）分隔 classpath 的元素。classpath 可以包含文件和目录路径、ZIP 或 JAR 文件。

### -d _path_

将生成的类文件放置到指定位置。该位置可以是目录、ZIP 或 JAR 文件。

### -include-runtime

将 Kotlin 运行时包含到生成的 JAR 文件中。使生成的归档文件可在任何启用 Java 的环境中运行。

### -jdk-home _path_

如果与默认的 `JAVA_HOME` 不同，则使用自定义 JDK 主目录包含到 classpath 中。

### -Xjdk-release=version

<primary-label ref="experimental-general"/>

指定生成的 JVM 字节码的目标版本。限制 classpath 中 JDK 的 API 到指定的 Java 版本。自动设置 [`-jvm-target version`](#jvm-target-version)。可能的值为 `1.8`、`9`、`10`、...、`24`。

> 此选项[不保证](https://youtrack.jetbrains.com/issue/KT-29974)对每个 JDK 发行版都有效。
>
{style="note"}

### -jvm-target _version_

指定生成的 JVM 字节码的目标版本。可能的值为 `1.8`、`9`、`10`、...、`24`。默认值为 `%defaultJvmTargetVersion%`。

### -java-parameters

为 Java 1.8 中关于方法形参的反射生成元数据。

### -module-name _name_ (JVM)

为生成的 `.kotlin_module` 文件设置自定义名称。
  
### -no-jdk

不要自动将 Java 运行时包含到 classpath 中。

### -no-reflect

不要自动将 Kotlin 反射 (`kotlin-reflect.jar`) 包含到 classpath 中。

### -no-stdlib (JVM)

不要自动将 Kotlin/JVM 标准库 (`kotlin-stdlib.jar`) 和 Kotlin 反射 (`kotlin-reflect.jar`) 包含到 classpath 中。
  
### -script-templates _classnames[,]_

脚本定义模板类。使用全限定类名，并用逗号（**，**）分隔它们。

### -Xjvm-expose-boxed

<primary-label ref="experimental-general"/>

生成模块中所有内联值类的装箱版本，以及使用它们的函数的装箱变体，使两者都可以从 Java 访问。关于更多信息，请参见调用 Kotlin 从 Java 指南中的[内联值类](java-to-kotlin-interop.md#inline-value-classes)。

### -jvm-default _mode_

控制接口中声明的函数如何在 JVM 上编译为默认方法。

| 模式 | 描述 |
|---|---|
| `enable` | 在接口中生成默认实现，并在子类和 `DefaultImpls` 类中包含桥接函数。（默认） |
| `no-compatibility` | 仅在接口中生成默认实现，跳过兼容性桥接和 `DefaultImpls` 类。 |
| `disable` | 仅生成兼容性桥接和 `DefaultImpls` 类，跳过默认方法。 |

## Kotlin/JS 编译器选项

用于 JS 的 Kotlin 编译器将 Kotlin 源文件编译成 JavaScript 代码。Kotlin 到 JS 编译的命令行工具是 `kotlinc-js`。

除了[通用选项](#common-options)外，Kotlin/JS 编译器还具有以下列出的选项。

### -target {es5|es2015}

为指定的 ECMA 版本生成 JS 文件。

### -libraries _path_

Kotlin 库 `.meta.js` 和 `.kjsm` 文件的路径，由系统路径分隔符分隔。

### -main _{call|noCall}_

定义 `main` 函数是否应在执行时被调用。

### -meta-info

生成包含元数据的 `.meta.js` 和 `.kjsm` 文件。创建 JS 库时使用此选项。

### -module-kind {umd|commonjs|amd|plain}

编译器生成的 JS 模块种类：

- `umd` - 一个 [Universal Module Definition](https://github.com/umdjs/umd) 模块
- `commonjs` - 一个 [CommonJS](http://www.commonjs.org/) 模块
- `amd` - 一个 [Asynchronous Module Definition](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 模块
- `plain` - 一个 plain JS 模块
    
关于不同种类 JS 模块及其区别的更多信息，请参见[这篇文章](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/)。

### -no-stdlib (JS)

不要自动将默认的 Kotlin/JS 标准库包含到编译依赖项中。

### -output _filepath_

设置编译结果的目标文件。该值必须是 `.js` 文件的路径，包括其名称。

### -output-postfix _filepath_

将指定文件的内容添加到输出文件的末尾。

### -output-prefix _filepath_

将指定文件的内容添加到输出文件的开头。

### -source-map

生成源码映射。

### -source-map-base-dirs _path_

使用指定路径作为基目录。基目录用于计算源码映射中的相对路径。

### -source-map-embed-sources _{always|never|inlining}_

将源文件嵌入到源码映射中。

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

将您在 Kotlin 代码中声明的变量和函数名添加到源码映射中。

| 设置 | 描述 | 示例输出 |
|---|---|---|
| `simple-names` | 添加变量名和简单函数名。（默认） | `main` |
| `fully-qualified-names` | 添加变量名和全限定函数名。 | `com.example.kjs.playground.main` |
| `no` | 不添加任何变量或函数名。 | 不适用 |

### -source-map-prefix

将指定前缀添加到源码映射中的路径。

### -Xes-long-as-bigint
<primary-label ref="experimental-general"/>

当编译到现代 JavaScript (ES2020) 时，启用对 JavaScript `BigInt` 类型支持，以表示 Kotlin `Long` 值。

## Kotlin/Native 编译器选项

Kotlin/Native 编译器将 Kotlin 源文件编译成适用于[支持平台](native-overview.md#target-platforms)的原生二进制文件。Kotlin/Native 编译的命令行工具是 `kotlinc-native`。

除了[通用选项](#common-options)外，Kotlin/Native 编译器还具有以下列出的选项。

### -enable-assertions (-ea)

在生成的代码中启用运行时断言。

### -g

启用发出调试信息。此选项会降低优化级别，不应与 [`-opt`](#opt) 选项结合使用。
    
### -generate-test-runner (-tr)

生成一个用于从项目运行单元测试的应用程序。

### -generate-no-exit-test-runner (-trn)

生成一个用于运行单元测试而无需显式进程退出的应用程序。

### -include-binary _path_ (-ib _path_)

将外部二进制文件打包到生成的 klib 文件中。

### -library _path_ (-l _path_)

链接到库。关于在 Kotlin/Native 项目中使用库的更多信息，请参见[Kotlin/Native 库](native-libraries.md)。

### -library-version _version_ (-lv _version_)

设置库版本。
    
### -list-targets

列出可用的硬件目标。

### -manifest _path_

提供一个清单附加文件。

### -module-name _name_ (Native)

指定编译模块的名称。此选项也可用于指定导出到 Objective-C 的声明的名称前缀：[如何为我的 Kotlin framework 指定自定义 Objective-C 前缀/名称？](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

包含原生位码库。

### -no-default-libs

禁用将用户代码与随编译器分发的预构建[平台库](native-platform-libs.md)链接。

### -nomain

假定 `main` 入口点由外部库提供。

### -nopack

不要将库打包到 klib 文件中。

### -linker-option

在二进制构建期间将实参传递给链接器。这可用于链接到某个原生库。

### -linker-options _args_

在二进制构建期间将多个实参传递给链接器。用空白字符分隔实参。

### -nostdlib

不要链接标准库。

### -opt

启用编译优化并生成具有更好运行时性能的二进制文件。不建议将其与降低优化级别的 [`-g`](#g) 选项结合使用。

### -output _name_ (-o _name_)

设置输出文件的名称。

### -entry _name_ (-e _name_)

指定全限定入口点名称。

### -produce _output_ (-p _output_)

指定输出文件种类：

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

库搜索路径。关于更多信息，请参见[库搜索序列](native-libraries.md#library-search-sequence)。

### -target _target_

设置硬件目标。要查看可用目标的列表，请使用 [`-list-targets`](#list-targets) 选项。