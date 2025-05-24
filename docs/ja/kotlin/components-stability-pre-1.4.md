---
title: "Kotlinコンポーネントの安定性 (1.4より前)"
---
<no-index/>

コンポーネントの進化の速さに応じて、さまざまな安定性のモードがあります。

<a name="moving-fast"/>

*   **Moving fast (MF)**：[インクリメンタルリリース](kotlin-evolution-principles#language-and-tooling-releases)間でも互換性は期待できず、いかなる機能も予告なしに追加、削除、または変更される可能性があります。

*   **Additions in Incremental Releases (AIR)**：インクリメンタルリリースで機能が追加される可能性があります。動作の削除や変更は避け、必要な場合は前のインクリメンタルリリースで告知する必要があります。

*   **Stable Incremental Releases (SIR)**：インクリメンタルリリースは完全に互換性があり、最適化とバグ修正のみが行われます。[言語リリース](kotlin-evolution-principles#language-and-tooling-releases)では、どのような変更も行うことができます。

<a name="fully-stable"/>

*   **Fully Stable (FS)**：インクリメンタルリリースは完全に互換性があり、最適化とバグ修正のみが行われます。フィーチャーリリースは後方互換性があります。

ソースとバイナリの互換性は、同じコンポーネントに対して異なるモードを持つ場合があります。たとえば、ソース言語がバイナリ形式よりも先に完全な安定性に達したり、その逆の場合もあります。

[Kotlin evolution policy](kotlin-evolution-principles)の規定は、Fully Stable (FS)に達したコンポーネントにのみ完全に適用されます。その時点から、互換性のない変更はLanguage Committeeによって承認される必要があります。

|**Component**|**Status Entered at version**|**Mode for Sources**|**Mode for Binaries**|
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
**All other experimental features, by default**|N/A|**MF**|**MF**