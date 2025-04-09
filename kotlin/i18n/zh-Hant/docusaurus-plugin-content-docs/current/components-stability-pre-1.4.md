---
title: "Kotlin 元件的穩定性 (1.4 之前的版本)"
---
<no-index/>

根據元件發展的速度，穩定性可以有不同的模式：

<a name="moving-fast"/>

*   **快速發展 (Moving fast, MF)**：即使是[增量版本 (incremental releases)](kotlin-evolution-principles#language-and-tooling-releases)之間也不應期望相容性，任何功能都可以在沒有警告的情況下新增、移除或更改。

*   **增量版本新增 (Additions in Incremental Releases, AIR)**：可以在增量版本中新增內容，應避免移除和變更行為，如有必要，應在之前的增量版本中宣告。

*   **穩定增量版本 (Stable Incremental Releases, SIR)**：增量版本完全相容，只進行最佳化和錯誤修復。 任何更改都可以在[語言版本 (language release)](kotlin-evolution-principles#language-and-tooling-releases)中進行。

<a name="fully-stable"/>

*   **完全穩定 (Fully Stable, FS)**：增量版本完全相容，只進行最佳化和錯誤修復。 功能版本是向後相容的。

原始碼和二進位相容性對於同一元件可能具有不同的模式，例如，原始碼語言可以在二進位格式穩定之前達到完全穩定，反之亦然。

[Kotlin 演進策略 (Kotlin evolution policy)](kotlin-evolution-principles)的規定僅完全適用於已達到完全穩定 (Fully Stable, FS) 的元件。 從那時起，不相容的變更必須得到語言委員會的批准。

|**元件 (Component)**|**在版本中輸入的狀態 (Status Entered at version)**|**原始碼模式 (Mode for Sources)**|**二進位模式 (Mode for Binaries)**|
| --- | --- | --- | --- |
Kotlin/JVM|1.0|FS|FS|
kotlin-stdlib (JVM)|1.0|FS|FS
KDoc 語法 (syntax)|1.0|FS|N/A
協程 (Coroutines)|1.3|FS|FS
kotlin-reflect (JVM)|1.0|SIR|SIR
Kotlin/JS|1.1|AIR|MF
Kotlin/Native|1.3|AIR|MF
Kotlin 腳本 (*.kts)|1.2|AIR|MF
dokka|0.1|MF|N/A
Kotlin 腳本編寫 API (Kotlin Scripting APIs)|1.2|MF|MF
編譯器外掛程式 API (Compiler Plugin API)|1.0|MF|MF
序列化 (Serialization)|1.3|MF|MF
多平台專案 (Multiplatform Projects)|1.2|MF|MF
內聯類別 (Inline classes)|1.3|MF|MF
無符號算術 (Unsigned arithmetics)|1.3|MF|MF
**所有其他實驗性功能，預設情況下 (All other experimental features, by default)**|N/A|**MF**|**MF**