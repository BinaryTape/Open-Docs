---
title: "Kotlin 组件的稳定性（1.4 之前）"
---
<no-index/>

根据组件演进速度的不同，稳定性可以有不同的模式：

<a name="moving-fast"/>

*   **快速迭代 (Moving fast, MF)**：即使在[增量发布版本](kotlin-evolution-principles#language-and-tooling-releases)之间也不应期望有任何兼容性，任何功能都可能在没有警告的情况下被添加、删除或更改。

*   **增量发布版本中新增 (Additions in Incremental Releases, AIR)**：可以在增量发布版本中添加新内容，应避免删除和行为更改，如有必要，应在之前的增量发布版本中宣布。

*   **稳定增量发布版本 (Stable Incremental Releases, SIR)**：增量发布版本完全兼容，仅进行优化和错误修复。[语言发布版本](kotlin-evolution-principles#language-and-tooling-releases)可以进行任何更改。

<a name="fully-stable"/>

*   **完全稳定 (Fully Stable, FS)**：增量发布版本完全兼容，仅进行优化和错误修复。功能发布版本向后兼容。

对于同一个组件，源码和二进制兼容性可能具有不同的模式，例如，源码语言可能在二进制格式稳定之前达到完全稳定，反之亦然。

[Kotlin 演进策略](kotlin-evolution-principles)的规定仅完全适用于已达到完全稳定 (Fully Stable, FS) 的组件。从那时起，不兼容的更改必须得到语言委员会的批准。

|**组件 (Component)**|**在版本中输入的状态 (Status Entered at version)**|**源码模式 (Mode for Sources)**|**二进制模式 (Mode for Binaries)**|
| --- | --- | --- | --- |
Kotlin/JVM|1.0|FS|FS|
kotlin-stdlib (JVM)|1.0|FS|FS
KDoc syntax|1.0|FS|N/A
Coroutines|1.3|FS|FS
kotlin-reflect (JVM)|1.0|SIR|SIR
Kotlin/JS|1.1|AIR|MF
Kotlin/Native|1.3|AIR|MF
Kotlin Scripts (*.kts)|1.2|AIR|MF
dokka|0.1|MF|N/A
Kotlin Scripting APIs|1.2|MF|MF
Compiler Plugin API|1.0|MF|MF
Serialization|1.3|MF|MF
Multiplatform Projects|1.2|MF|MF
Inline classes|1.3|MF|MF
Unsigned arithmetics|1.3|MF|MF
**默认情况下，所有其他实验性功能 (All other experimental features, by default)**|N/A|**MF**|**MF**