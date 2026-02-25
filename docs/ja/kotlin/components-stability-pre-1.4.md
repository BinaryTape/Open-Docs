[//]: # (title: Kotlinコンポーネントの安定性（1.4以前）)

<no-index/>

コンポーネントの進化の速さに応じて、異なる安定性モードが存在します：

<a name="moving-fast"/>

*   **Moving fast (MF)**: [インクリメンタルリリース](kotlin-evolution-principles.md#language-and-tooling-releases)間であっても互換性は期待できません。いかなる機能も予告なしに追加、削除、または変更される可能性があります。

*   **Additions in Incremental Releases (AIR)**: インクリメンタルリリースで機能を追加できます。削除や振る舞いの変更は避けるべきであり、必要な場合は以前のインクリメンタルリリースで告知される必要があります。

*   **Stable Incremental Releases (SIR)**: インクリメンタルリリースは完全に互換性があり、最適化とバグ修正のみが行われます。いかなる変更も[言語リリース](kotlin-evolution-principles.md#language-and-tooling-releases)で行うことができます。

<a name="fully-stable"/>

*   **Fully Stable (FS)**: インクリメンタルリリースは完全に互換性があり、最適化とバグ修正のみが行われます。フィーチャーリリース（Feature releases）は後方互換性があります。

ソース互換性とバイナリ互換性は、同じコンポーネントであっても異なるモードを持つ場合があります。例えば、バイナリ形式が安定する前にソース言語が完全な安定性に達する場合や、その逆もあり得ます。

[Kotlin進化ポリシー](kotlin-evolution-principles.md)の規定は、完全な安定性（Fully Stable: FS）に達したコンポーネントにのみ全面的に適用されます。その時点以降、互換性のない変更は言語委員会（Language Committee）によって承認される必要があります。

|**コンポーネント**|**導入バージョン**|**ソースのモード**|**バイナリのモード**|
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
|**その他すべての実験的機能（デフォルト）**|N/A|**MF**|**MF**|