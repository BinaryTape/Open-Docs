[//]: # (title: Kotlin 元件的穩定性 (1.4 版之前))

<no-index/>

穩定性模式會因元件演進的速度而有所不同：

<a name="moving-fast"/>

*   **快速變動 (MF)**：即使在 [增量發行](kotlin-evolution-principles.md#language-and-tooling-releases) 之間，也不應預期有任何相容性；任何功能都可能在不發出警告的情況下被新增、移除或更改。

*   **增量發行中可新增 (AIR)**：增量發行中可以新增內容；應避免移除和行為變更，如有必要，應在先前的增量發行中宣佈。

*   **穩定增量發行 (SIR)**：增量發行是完全相容的，只進行優化和錯誤修正。任何變更都可以在 [語言發行](kotlin-evolution-principles.md#language-and-tooling-releases) 中進行。

<a name="fully-stable"/>

*   **完全穩定 (FS)**：增量發行是完全相容的，只進行優化和錯誤修正。功能發行是向後相容的。

原始碼和二進位檔相容性對於相同的元件可能會有不同的模式，例如，原始碼語言可能在二進位格式穩定之前達到完全穩定，反之亦然。

[Kotlin 演進策略](kotlin-evolution-principles.md) 的條款僅完全適用於已達到完全穩定 (FS) 的元件。從那時起，不相容的變更必須經由語言委員會批准。

|**元件**|**達到狀態的版本**|**原始碼模式**|**二進位檔模式**|
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
|**所有其他實驗性功能 (預設)**|N/A|**MF**|**MF**|