[//]: # (title: 自定义编译器插件)

> Kotlin 编译器插件 API 尚不稳定，并且在每个版本中都会引入破坏性变更。
> 
{style="warning"}

<include from="compiler-plugins-overview.md" element-id="compiler-plugin-description"/>

在创建您自己的自定义编译器插件之前，请查看[可用编译器插件列表](compiler-plugins-overview.md)，看看是否已经有适合您用例的插件。

您还可以检查是否可以使用 [Kotlin 符号处理 (KSP) API](https://kotlinlang.org/docs/ksp-overview.html) 或外部 Linter（例如 [Android lint](https://developer.android.com/studio/write/lint)）来实现您的目标。

如果您*仍然*找不到所需的内容，可以创建一个自定义编译器插件。请注意，Kotlin 编译器插件 API 是**不稳定**的。由于每个新编译器版本都会引入破坏性变更，因此您需要投入大量的持续精力来进行维护。

### Kotlin 编译器与编译器插件

<p></p> <!-- workaround for MRK057: Paragraph can only contain inline elements-->
<list columns="2">
    <li>
        <p></p>
        <br/>
        <img src="compiler-stages.svg" width="400" alt="Kotlin compiler stages"/>
    </li>
    <li>
        <p>Kotlin 编译器：</p>
        <ol>
            <li>解析源代码并将其转换为结构化语法树。</li>
            <li>通过确定代码含义、解析名称、检查类型以及强制执行可见性规则来分析并解析代码。</li>
            <li>生成中间表示 (IR)，这是一种充当源代码与机器码之间桥梁的数据结构。</li>
            <li>逐步将 IR 降级 (lower) 为更简单的形式。</li>
            <li>将降级后的 IR 翻译为目标特定的输出，例如 JVM 字节码、JavaScript 或原生机器码。</li>
        </ol>
    </li>
</list>

插件可以通过前端 API 影响初始编译器阶段，从而改变编译器解析代码的方式。例如，插件可以添加注解、引入没有主体的函数，或者更改可见性修饰符。这些更改在 IDE 中是可见的。

插件还可以通过后端 API 影响后期阶段，修改声明的行为。这些更改会出现在编译完成后产生的二进制文件中。

在实践中，编译器插件会影响从分析和解析到代码生成的各个阶段，涵盖了前端和后端。例如，前端部分生成声明，而后端部分为这些声明添加主体。

![带有插件的 Kotlin 编译器阶段](compiler-stages-with-plugins.svg){width=650}

[Kotlin 序列化插件](https://github.com/Kotlin/kotlinx.serialization)是一个很好的例子。该插件的前端部分添加了一个伴生对象和一个序列化器函数，并进行检查以防止名称冲突。后端部分则通过 `KSerializer` 对象实现所需的序列化行为。

### Kotlin 编译器插件模板

要开始编写自定义编译器插件，您可以使用 [Kotlin 编译器插件模板](https://github.com/Kotlin/compiler-plugin-template)。然后，您可以注册来自前端和后端插件 API 的扩展点。

> 目前，您只能使用 [Gradle](gradle.md) 开发自定义编译器插件。
> 
{style="note"}

### 前端插件 API

前端插件 API（也称为 FIR）具有以下专门的扩展点来自定义解析：

| 扩展名称                                                                                                                                                                                          | 描述                                                       |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| [`FirAdditionalCheckersExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/checkers/src/org/jetbrains/kotlin/fir/analysis/extensions/FirAdditionalCheckersExtension.kt) | 添加自定义编译器检查器。                                             |
| [`FirDeclarationGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions/FirDeclarationGenerationExtension.kt)   | 生成新声明。                                                   |
| [`FirExtensionSessionComponent`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirExtensionSessionComponent.kt)                  | 在 `FirSession` 中注册自定义组件，供插件的其他部分使用。                       |
| [`FirFunctionTypeKindExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirFunctionTypeKindExtension.kt)                  | 定义新的函数类型家族。                                              |
| [`FirMetadataSerializerPlugin`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/fir-serialization/src/org/jetbrains/kotlin/fir/serialization/FirMetadataSerializerPlugin.kt)    | 读取和写入声明元数据的信息。                                           |
| [`FirStatusTransformerExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirStatusTransformerExtension.kt)             | 修改声明状态属性，如可见性或模态 (modality)。                            |
| [`FirSupertypeGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirSupertypeGenerationExtension.kt)         | 向现有类添加新的超类型。                                             |
| [`FirTypeAttributeExtension`]( https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirTypeAttributeExtension.kt)                       | 根据某些类型的类型注解向其添加特殊属性。                                     |

#### IDE 集成

解析变更会影响 IDE 行为，如代码高亮显示和建议，因此确保您的插件与 IDE 兼容非常重要。每个版本的 IntelliJ IDEA 和 Android Studio 都包含一个开发版本的 Kotlin 编译器。此版本特定于 IDE，且与发布的 Kotlin 编译器二进制不兼容。因此，当您更新 IDE 时，还需要更新编译器插件以保持其正常运行。由于这个原因，默认情况下不加载社区插件。

为了确保您的自定义编译器插件能够与不同的 IDE 版本配合使用，请针对每个 IDE 版本进行测试并修复您发现的任何问题。

如果有了适用于 Kotlin 编译器插件的 Devkit，支持多个 IDE 版本可能会变得更容易。如果您对该功能感兴趣，请在我们的[问题跟踪器](https://youtrack.jetbrains.com/issue/KT-82617)中分享您的反馈。

### 后端插件 API

> 后端插件开发在不降低 IDE 或调试器性能的情况下很难正确完成，因此请谨慎且保守地进行更改。
> 
{style="warning"}

后端插件 API（也称为 IR）有一个单一的扩展点：[`IrGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/ir/backend.common/src/org/jetbrains/kotlin/backend/common/extensions/IrGenerationExtension.kt)。使用此扩展点并重写 `generate()` 函数，可以为前端已生成的声明添加主体，或更改现有的声明主体。

通过此扩展点进行的更改**不会**由编译器检查。您必须确保您的更改在此阶段不会破坏编译器的预期。例如，您可能会意外引入无效类型、错误的函数引用或超出正确作用域的引用。

#### 探索后端插件代码

您可以探索 Kotlin 序列化插件的代码，以查看后端插件编译器代码在实践中是什么样的。例如，[`SerializableCompanionIrGenerator.kt`](https://github.com/JetBrains/kotlin/blob/master/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt) 填充了关键序列化器成员缺失的主体。一个例子是 [`generateChildSerializersGetter()`](https://github.com/JetBrains/kotlin/blob/9cfa558902abc13d245c825717026af63ef82dd2/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt#L242) 函数，它收集 `KSerializer` 表达式列表并将其在数组中返回。

#### 检查后端插件代码的问题

您可以通过三种方式检查后端插件代码中的问题：

1. **验证 IR**

    构建 IR 树并启用 `Xverify-ir` 编译器选项。此选项对编译速度有性能影响，因此请仅在测试期间使用。

2. **转储并对比 IR 输出**

    使用 `-Xphases-to-dump-before=ExternalPackageParentPatcherLowering` 编译器选项在 IR 降级编译阶段后创建一个转储文件。对于 JVM 后端，使用 `-Xdump-directory=<your-file-directory>` 编译器选项配置转储目录。手动编写预期代码，生成另一个转储文件，并比较两者以查看是否存在差异。

3. **调试编译器代码**

    在 `convertToIr.kt` 文件中，在 `convertToIrAndActualize()` 函数中添加断点，并以调试模式运行编译器，以便在编译过程中获取更详细的信息。

### 测试您的插件

实现插件后，请对其进行彻底测试。[Kotlin 编译器插件模板](https://github.com/Kotlin/compiler-plugin-template)已配置为使用 [Kotlin 编译器测试框架](https://github.com/JetBrains/kotlin/blob/master/compiler/test-infrastructure/ReadMe.md)。您可以在以下目录中添加测试：

* `compiler-plugin/testData`
* `compiler-plugin/testData/box` 用于代码生成测试
* `compiler-plugin/testData/diagnostics` 用于诊断测试

当测试运行时，框架会：

1. 解析测试源文件。例如，[`anotherBoxTest.kt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.kt)
2. 为每个文件构建 FIR 和 IR。
3. 将这些内容写入为文本转储文件。例如，[`anotherBoxTest.fir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.txt) 和 [`anotherBoxTest.fir.ir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.ir.txt)。
4. 将这些文件与之前创建的文件（如果存在）进行比较。

您可以使用这些文件来检查生成的差异中是否存在非预期的更改。如果没有问题，新的转储文件将成为您最新的“黄金文件 (golden files)”：这是一个经过批准且可信的源，您可以将未来的更改与其进行比较。

### 获取帮助

如果您在开发自定义编译器插件时遇到问题，请在 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的 [#compiler](https://slack-chats.kotlinlang.org/c/compiler) 频道寻求帮助。我们无法承诺提供解决方案，但如果可以的话，我们会尽力提供帮助。