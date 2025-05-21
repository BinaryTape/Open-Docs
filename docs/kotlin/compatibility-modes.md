---
title: 兼容模式
---
当一个大型团队迁移到新版本时，在某个时间点可能会出现“不一致状态”，即一些开发者已经更新，而另一些开发者尚未更新。为了防止前者编写和提交后者可能无法编译的代码，我们提供了以下命令行开关（也可在 IDE 和 [Gradle](gradle-compiler-options)/[Maven](maven#specify-compiler-options) 中使用）：

* `-language-version X.Y` - Kotlin 语言版本 X.Y 的兼容模式，报告所有后续出现的语言特性的错误。
* `-api-version X.Y` - Kotlin API 版本 X.Y 的兼容模式，报告所有使用 Kotlin 标准库中较新 API 的代码的错误（包括编译器生成的代码）。

目前，除了最新的稳定版本外，我们还支持至少三个以前的语言和 API 版本的开发。