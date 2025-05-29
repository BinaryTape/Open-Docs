[//]: # (title: Kotlin 组件的稳定性 (1.4 以前))

<no-index/>

存在不同的稳定性模式，具体取决于组件演进的速度：

<a name="moving-fast"/>

*   **快速演进 (MF)**: 即使在[增量版本](kotlin-evolution-principles.md#language-and-tooling-releases)之间也不应期望任何兼容性，任何功能都可以在不发出警告的情况下添加、删除或更改。

*   **增量版本中允许添加 (AIR)**: 可以在增量版本中添加内容，应避免移除和行为更改，如果有必要，则应在先前的增量版本中进行公告。

*   **稳定的增量版本 (SIR)**: 增量版本完全兼容，只会进行优化和错误修复。任何更改都可以在[语言版本](kotlin-evolution-principles.md#language-and-tooling-releases)中进行。

<a name="fully-stable"/>

*   **完全稳定 (FS)**: 增量版本完全兼容，只会进行优化和错误修复。功能版本向后兼容。

对于同一个组件，源码和二进制兼容性可能具有不同的模式，例如，源码语言可以在二进制格式稳定之前达到完全稳定，反之亦然。

[Kotlin 演进策略](kotlin-evolution-principles.md)的规定仅完全适用于已达到完全稳定 (FS) 的组件。从那时起，不兼容的更改必须得到语言委员会的批准。

|**组件**|**达到此状态的版本**|**源码模式**|**二进制模式**|
| --- | --- | --- | --- |
|Kotlin/JVM|1.0|FS|FS|
|kotlin-stdlib (JVM)|1.0|FS|FS|
|KDoc syntax|1.0|FS|N/A|
|Coroutines|1.3|FS|FS|
|kotlin-reflect (JVM)|1.0|SIR|SIR|
|Kotlin/JS|1.1|AIR|MF|
|Kotlin/Native|1.3|AIR|MF|
|Kotlin Scripts (*.kts)|1.2|AIR|MF|
|dokka|0.1|MF|N/A|
|Kotlin Scripting APIs|1.2|MF|MF|
|Compiler Plugin API|1.0|MF|MF|
|Serialization|1.3|MF|MF|
|Multiplatform Projects|1.2|MF|MF|
|Inline classes|1.3|MF|MF|
|Unsigned arithmetics|1.3|MF|MF|
|**所有其他实验性功能 (默认)**|N/A|**MF**|**MF**|