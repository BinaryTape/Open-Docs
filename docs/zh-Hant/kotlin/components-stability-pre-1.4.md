[//]: # (title: Kotlin 元件的穩定性 (1.4 版本前))

<no-index/>

元件的穩定性模式可能有所不同，取決於其演進速度：

<a name="moving-fast"/>

*   **快速演進 (MF)**：即使在 [增量發佈版本](kotlin-evolution-principles.md#language-and-tooling-releases) 之間也不應期望有相容性，任何功能都可能在沒有警告的情況下被新增、移除或更改。

*   **增量發佈版本中的新增功能 (AIR)**：可以在增量發佈版本中新增內容，應避免移除或更改行為，如有必要應在之前的增量發佈版本中宣佈。

*   **穩定增量發佈版本 (SIR)**：增量發佈版本完全相容，只會進行最佳化和錯誤修正。任何更改都可以在 [語言發佈版本](kotlin-evolution-principles.md#language-and-tooling-releases) 中進行。

<a name="fully-stable"/>

*   **完全穩定 (FS)**：增量發佈版本完全相容，只會進行最佳化和錯誤修正。功能發佈版本向下相容。

對於同一個元件，源代碼（Source）和二進位（Binary）相容性可能會有不同的模式，例如，源代碼可以在二進位格式穩定之前達到完全穩定，反之亦然。

[Kotlin 演進策略](kotlin-evolution-principles.md) 的條款僅完全適用於已達到完全穩定 (FS) 的元件。從那時起，不相容的更改必須經由語言委員會批准。

|**元件**|**進入狀態版本**|**源代碼模式**|**二進位模式**|
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
|**所有其他實驗性功能，預設為**|N/A|**MF**|**MF**|