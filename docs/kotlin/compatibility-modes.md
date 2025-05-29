[//]: # (title: 兼容模式)

当一个大型团队迁移到新版本时，可能会在某个时间点出现“不一致状态”，即有些开发者已经更新，而另一些还没有。为了防止前者编写和提交其他开发者可能无法编译的代码，我们提供了以下命令行开关（在 IDE 和 [Gradle](gradle-compiler-options.md)/[Maven](maven.md#specify-compiler-options) 中也可用）：

*   `-language-version X.Y` - Kotlin 语言版本 X.Y 的兼容模式，对所有后来发布的语言特性报告错误。
*   `-api-version X.Y` - Kotlin API 版本 X.Y 的兼容模式，对所有使用 Kotlin 标准库中较新 API 的代码（包括编译器生成的代码）报告错误。

目前，除了最新的稳定版本外，我们还支持至少三个之前的语言和 API 版本的开发。