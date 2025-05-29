# 贡献

如果你想为这个项目贡献代码，可以通过 GitHub Fork 仓库并发送 Pull Request 来实现。

提交代码时，请尽力遵循现有的规范和风格，以尽可能保持代码的可读性。

在你的代码被项目接受之前，你还必须签署[个人贡献者许可协议 (CLA)][1]。

 [1]: https://spreadsheets.google.com/spreadsheet/viewform?formkey=dDViT2xzUHAwRkI3X3k5Z0lQM091OGc6MQ&ndplr=1
 
## SQLDelight 

如果你想开始贡献，请查看下面根据你希望贡献到 SQLDelight 的哪个部分而提供的具体指南。如果你仍然不确定，请在你正在查看的 Issue 中留言，说明你遇到的困难，我们会在那里回复——或者为你正在尝试做的事情创建一个 Issue 并开始讨论。

### IDE 插件

如果你想修复 Bug 或扩展 IDE，代码更改可能发生于 `sqldelight-idea-plugin` 模块中。你可以使用 `./gradlew runIde` 任务测试你的更改，也可以使用 `./gradlew runIde --debug-jvm` 进行实时调试。

如果你在 IDE 中遇到 Bug 但无法在示例项目重现，你可以实时调试你的 IDE。为此，你需要第二个 IntelliJ 安装。你可以通过 [Toolbox](https://www.jetbrains.com/toolbox-app/) 来实现，滚动到 IDE 列表底部并选择不同版本的 IntelliJ。

在你希望使用调试器的 IDE 中，检出 SQLDelight 仓库，然后创建一个新的 `Remote` 运行配置。它将自动填充“Command line arguments for remote JVM”，类似 `-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005`。复制该值，然后打开你想要调试的 IDE。选择 `Help -> Edit Custom VM Options`，并将你复制的行粘贴到打开文件的底部。重启你想要调试的 IDE，一旦它启动，打开你创建配置的 IDE，然后使用你创建的远程配置附加调试器。

有关构建 IDE 插件及其功能的更多信息，请参阅 [Jetbrains 官方文档](https://jetbrains.org/intellij/sdk/docs/reference_guide/custom_language_support.html) 或加入 [Jetbrains 平台 Slack](https://blog.jetbrains.com/platform/2019/10/introducing-jetbrains-platform-slack-for-plugin-developers/)。

### 驱动

如果你有兴趣创建自己的驱动，你可以在 SQLDelight 仓库之外使用 `runtime` Artifact 来实现。为了测试驱动，你可以依赖于 `driver-test` 并扩展 `DriverTest` 和 `TransactionTest`，以确保它能按 SQLDelight 的预期工作。

#### 异步驱动

可以通过使用 `runtime-async` Artifact 来实现进行异步调用的驱动。

### Gradle

如果你遇到 Gradle 问题，请首先在 `sqldelight-gradle-plugin/src/test` 中创建一个类似于其他文件夹的测试夹具，以重现你的问题。如果你不知道如何修复，请随意直接用这个失败的测试打开一个 PR！测试用例非常受欢迎。集成测试展示了如何设置一个完整的 Gradle 项目，该项目将运行 SQLite/MySQL/PostgreSQL 等，并使用它们各自的运行时环境和 SQLDelight 执行 SQL 查询。如果你在 SQLDelight 中遇到运行时问题，请考虑将测试添加到这些已有的集成测试中。

### 编译器

SQLDelight 的编译器有多个层面——如果你只对代码生成 (而非 SQL 解析) 感兴趣，那么你需要在 `sqldelight-compiler` 模块中进行贡献。如果你对解析器感兴趣，则需要贡献到 [sql-psi](https://github.com/alecstrong/sql-psi)。SQLDelight 使用 [kotlinpoet](https://github.com/square/kotlinpoet) 来生成 Kotlin 代码，请务必使用它的 API 来引用 Kotlin 类型，以确保导入仍然正常工作。如果你以任何方式修改了代码生成，请在打开 Pull Request 之前运行 `./gradlew build`，因为它将更新 `sqldelight-compiler:integration-tests` 中的集成测试。如果你想编写集成测试 (即在运行时环境运行 SQL 查询)，请将测试添加到 `sqldelight-compiler:integration-tests`。

---

## SQL PSI

在下一节中，我们将介绍如何贡献到解析器和 PSI 层，但在此之前，你应该阅读一篇关于 [多变体](https://www.alecstrong.com/posts/multiple-dialects/) 的博客文章，以了解 [sql-psi](https://github.com/AlecStrong/sql-psi) 中各个活动组件。与 SQLDelight 一样，如果你遇到问题但不知道如何贡献修复或需要帮助，请在 GitHub Issue 中留言或创建一个新的 Issue 来开始讨论。

对于 SQL-PSI 中的任何更改，你都需要在相应的 `core/src/test/fixtures_*` 文件夹中添加一个测试夹具。`fixtures` 文件夹 (无后缀) 适用于所有变体。在你的更改合并到 sql-psi 之后，如果 SQLDelight 中也有你需要进行的更改，请检出 SQLDelight 上的 `sql-psi-dev` 分支，并将你的 PR 指向它。它使用 sql-psi 的快照版本，因此你可以在 sql-psi 更改合并后大约 10 分钟构建你的 SQLDelight 更改。

### 语法

如果你要向语法中添加内容，首先决定这是否是你向现有语法添加的新规则，或者你希望从 ANSI SQL (在 [sql.bnf](https://github.com/AlecStrong/sql-psi/blob/master/core/src/main/kotlin/com/alecstrong/sql/psi/core/sql.bnf) 中找到) 覆盖的规则。在这两种情况下，你都需要在新语法中定义该规则，但在覆盖 ANSI SQL 规则的情况下，请将其添加到 overrides 列表并为该规则设置 override 属性：

```bnf
overrides ::= my_rule

my_rule ::= SOME_TOKEN {
  override = true
}
```

你的规则定义应从 ANSI-SQL 规则的精确复制粘贴开始。要引用 ANSI-SQL 中的规则，你需要用 {} 括起来，因此你应该用 {} 括起覆盖规则中的所有外部规则：

```bnf
my_rule ::= internal_rule {external_rule} {
  override = true
}
internal_rule ::= SOME_TOKEN
```

一个注意事项是，引用 ANSI-SQL 中的 `expr` 规则应看起来像 `<<expr '-1'>>`，因为它很特殊，不能被覆盖。

任何你希望使用的 ANSI SQL 词元 (Token) 也应该手动导入：

```bnf
{
  parserImports = [
    "static com.alecstrong.sql.psi.core.psi.SqlTypes.DELETE"
    "static com.alecstrong.sql.psi.core.psi.SqlTypes.FROM"
  ]
}
overrides ::= delete

delete ::= DELETE FROM {table_name} {
  override = true
}
```

变体不能添加自己的词元，但你可以通过用 `""` 括起来要求精确文本：

```bnf
my_rule ::= "SOME_TOKEN"
```

覆盖规则仍必须生成符合原始规则类型的代码，因此请确保 `implement` 和 `extend` 原始规则的现有类型：

```bnf
my_rule ::= internal_rule {external_rule} {
  extends = "com.alecstrong.sql.psi.core.psi.impl.SqlMyRuleImpl"
  implements = "com.alecstrong.sql.psi.core.psi.SqlMyRule"
  overrides = true
}
```

要查看语法中覆盖规则的示例，请查看 [此 PR](https://github.com/AlecStrong/sql-psi/pull/163/files)，它将 `RETURNING` 语法添加到了 PostgreSQL。

### 规则行为

通常，你希望修改 PSI 层的行为 (例如在某些情况下抛出错误，以使编译失败)。为此，让你的规则使用 `mixin` 而非 `extends`，`mixin` 是你编写的包含新逻辑的类：

```bnf
my_rule ::= interal_rule {external_rule} {
  mixin = "com.alecstrong.sql.psi.MyRuleMixin"
  implements = "com.alecstrong.sql.psi.core.psi.SqlMyRule"
  overrides = true
}
```

然后，在该类中确保它实现了原始的 ANSI SQL 类型和 SQL-PSI 基类 `SqlCompositeElementImpl`：

```
class MyRule(
  node: ASTNode
) : SqlCompositeElementImpl(node),
    SqlMyRule {
  fun annotate(annotationHolder: SqlAnnotationHolder) {
    if (internal_rule.text == "bad_text") {
      annotationHolder.createErrorAnnotation("Invalid text value", internal_rule)
    }
  }
}
```

例如，[DropIndexMixin](https://github.com/AlecStrong/sql-psi/blob/f1137ff82dd0aa77f741a09d88855fbf9b751c00/core/src/main/kotlin/com/alecstrong/sql/psi/core/psi/mixins/DropIndexMixin.kt) 验证正在删除的索引是否存在于 Schema 中。

---

如果你有关于贡献的未涵盖在此文档中的问题，请随时在 SqlDelight 上开一个 Issue 或开一个 PR，以便我们致力于改进它！