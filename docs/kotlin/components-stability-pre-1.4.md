[//]: # (title: Kotlin 组件的稳定性（1.4 之前）)

<no-index/>

根据组件演进的速度，稳定性可以分为不同的模式：

<a name="moving-fast"/>

*   **快速演进 (Moving fast, MF)**：即使在[增量版本](kotlin-evolution-principles.md#language-and-tooling-releases)之间也不保证兼容性，任何功能都可能在不经预告的情况下被添加、移除或更改。

*   **在增量版本中添加 (Additions in Incremental Releases, AIR)**：可以在增量版本中添加新功能，应避免更改或移除既有行为，必要时应在之前的增量版本中发布预告。

*   **稳定的增量版本 (Stable Incremental Releases, SIR)**：增量版本完全兼容，仅进行优化和错误修复。任何更改都可在[语言版本](kotlin-evolution-principles.md#language-and-tooling-releases)中进行。

<a name="fully-stable"/>

*   **完全稳定 (Fully Stable, FS)**：增量版本完全兼容，仅进行优化和错误修复。功能版本向后兼容。

源码兼容性和二进制兼容性对于同一个组件可能具有不同的模式。例如，源码语言可能在二进制格式稳定之前就达到完全稳定，反之亦然。

[Kotlin 演进政策](kotlin-evolution-principles.md)的规定仅完全适用于已达到完全稳定 (FS) 的组件。从该点开始，不兼容的更改必须经过语言委员会的批准。

|**组件**|**进入该状态的版本**|**源码模式**|**二进制模式**|
| --- | --- | --- | --- |
|Kotlin/JVM|1.0|FS|FS|
|kotlin-stdlib (JVM)|1.0|FS|FS|
|KDoc syntax|1.0|FS|不适用|
|Coroutines|1.3|FS|FS|
|kotlin-reflect (JVM)|1.0|SIR|SIR|
|Kotlin/JS|1.1|AIR|MF|
|Kotlin/Native|1.3|AIR|MF|
|Kotlin Scripts (*.kts)|1.2|AIR|MF|
|dokka|0.1|MF|不适用|
|Kotlin Scripting APIs|1.2|MF|MF|
|Compiler Plugin API|1.0|MF|MF|
|Serialization|1.3|MF|MF|
|Multiplatform Projects|1.2|MF|MF|
|Inline classes|1.3|MF|MF|
|Unsigned arithmetics|1.3|MF|MF|
|**默认情况下，所有其他实验性功能**|不适用|**MF**|**MF**|