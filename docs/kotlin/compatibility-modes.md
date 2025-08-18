[//]: # (title: 兼容模式)

当大型团队迁移到新版本时，可能会在某个时间点出现“不一致状态”——即部分开发者已更新而其他开发者尚未更新。为了防止前者编写和提交其他人可能无法编译的代码，我们提供了以下命令行开关（也可在 IDE 以及 [Gradle](gradle-compiler-options.md)/[Maven](maven.md#specify-compiler-options) 中使用）：

*   `-language-version X.Y` - Kotlin 语言版本 X.Y 的兼容模式，报告所有稍后推出的语言特性相关的错误。
*   `-api-version X.Y` - Kotlin API 版本 X.Y 的兼容模式，报告所有使用 Kotlin 标准库中较新 API 的代码错误（包括编译器生成的代码）。

当前，除了最新稳定版之外，我们还支持至少三个之前的语言和 API 版本的开发。