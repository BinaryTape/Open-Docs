[//]: # (title: Kotlin 组件的稳定性（1.4 版本前）)

<no-index/>

组件的稳定性模式可能有所不同，具体取决于其演进速度：

<a name="moving-fast"/>

*   **快速演进 (MF)**：即使是 [增量版本](kotlin-evolution-principles.md#language-and-tooling-releases) 之间也不应期望兼容性，任何功能都可以不另行通知地添加、移除或更改。

*   **增量版本可添加 (AIR)**：可以在增量版本中添加内容，应避免移除和行为变更，如有必要，则应在之前的增量版本中宣布。

*   **稳定的增量版本 (SIR)**：增量版本完全兼容，仅进行优化和错误修复。任何更改都可以在 [语言版本](kotlin-evolution-principles.md#language-and-tooling-releases) 中进行。

<a name="fully-stable"/>

*   **完全稳定 (FS)**：增量版本完全兼容，仅进行优化和错误修复。特性版本向后兼容。

同一个组件的源码和二进制兼容性可能具有不同的模式，例如，源码语言可以在二进制格式稳定之前达到完全稳定，反之亦然。

[Kotlin 演进策略](kotlin-evolution-principles.md) 的条款仅完全适用于已达到完全稳定 (FS) 的组件。从那时起，不兼容的更改必须得到语言委员会的批准。

|**组件**|**在哪个版本达到该状态**|**源码模式**|**二进制模式**|
| --- | --- | --- | --- |
Kotlin/JVM|1.0|FS|FS|
kotlin-stdlib (JVM)|1.0|FS|FS
KDoc 语法|1.0|FS|不适用
协程|1.3|FS|FS
kotlin-reflect (JVM)|1.0|SIR|SIR
Kotlin/JS|1.1|AIR|MF
Kotlin/Native|1.3|AIR|MF
Kotlin 脚本 (*.kts)|1.2|AIR|MF
dokka|0.1|MF|不适用
Kotlin 脚本 API|1.2|MF|MF
编译器插件 API|1.0|MF|MF
序列化|1.3|MF|MF
多平台项目|1.2|MF|MF
内联类|1.3|MF|MF
无符号算术|1.3|MF|MF
**所有其他实验性特性，默认**|不适用|**MF**|**MF**