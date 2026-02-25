[//]: # (title: Kotlin 元件的穩定性 (1.4 以前))

<no-index/>

根據元件演進的速度，可能存在不同的穩定性模式：

<a name="moving-fast"/>

*   **快速演進 (Moving fast (MF))**：即使在[增量版本](kotlin-evolution-principles.md#language-and-tooling-releases)之間也不應預期任何相容性，任何功能都可能在不經通知的情況下新增、移除或變更。

*   **增量版本中的新增內容 (Additions in Incremental Releases (AIR))**：可以在增量版本中新增內容，應避免移除或變更行為，必要時應在先前的增量版本中宣布。

*   **穩定的增量版本 (Stable Incremental Releases (SIR))**：增量版本完全相容，僅進行最佳化和錯誤修正。任何變更都可以在[語言版本](kotlin-evolution-principles.md#language-and-tooling-releases)中進行。

<a name="fully-stable"/>

*   **完全穩定 (Fully Stable (FS))**：增量版本完全相容，僅進行最佳化和錯誤修正。功能版本向後相容。

原始碼與二進制相容性對於同一個元件可能具有不同的模式，例如，原始碼語言可能在二進制格式穩定之前達到完全穩定，反之亦然。

[Kotlin 演進原則](kotlin-evolution-principles.md)的規定僅完全適用於已達到完全穩定 (FS) 的元件。從該點起，不相容的變更必須由語言委員會批准。

|**元件**|**進入該狀態的版本**|**原始碼模式**|**二進制模式**|
| --- | --- | --- | --- |
Kotlin/JVM|1.0|FS|FS|
kotlin-stdlib (JVM)|1.0|FS|FS
KDoc 語法|1.0|FS|N/A
協同程式|1.3|FS|FS
kotlin-reflect (JVM)|1.0|SIR|SIR
Kotlin/JS|1.1|AIR|MF
Kotlin/Native|1.3|AIR|MF
Kotlin 指令碼 (*.kts)|1.2|AIR|MF
dokka|0.1|MF|N/A
Kotlin 指令碼 API|1.2|MF|MF
編譯器外掛程式 API|1.0|MF|MF
序列化|1.3|MF|MF
多平台專案|1.2|MF|MF
內嵌類別|1.3|MF|MF
無符號運算|1.3|MF|MF
**預設情況下，所有其他實驗功能**|N/A|**MF**|**MF**